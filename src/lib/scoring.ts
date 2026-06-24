import { getFreeTest } from "./questions";
import { RESULT_SPEC } from "./results";
import { deriveMBTI, deriveEnneagram, mbtiLabel } from "./mbti";
import { buildBusinessItemReport } from "./reports/business-item";
import { buildSelfDiscoveryReport } from "./reports/self-discovery";
import { getRichDef } from "./reports";
import { buildRichFromDef } from "./reports/kit";
import type { FreeResult, ResultCard } from "./types";

// 답안(answers: questionId -> value | value[])을 받아 차원 점수를 합산
function tallyScores(slug: string, answers: Record<string, unknown>) {
  const test = getFreeTest(slug);
  const scores: Record<string, number> = {};
  for (const q of test) {
    if (!q.options) continue;
    const a = answers[q.id];
    const chosen = Array.isArray(a) ? a : [a];
    for (const opt of q.options) {
      if (chosen.includes(opt.value) && opt.score) {
        for (const [k, v] of Object.entries(opt.score)) {
          scores[k] = (scores[k] ?? 0) + v;
        }
      }
    }
  }
  return scores;
}

function normalize(scores: Record<string, number>, dims: string[], maxPerDim: number) {
  const out: Record<string, number> = {};
  for (const k of dims) {
    const v = Math.max(0, scores[k] ?? 0);
    out[k] = Math.min(100, Math.round((v / maxPerDim) * 100));
  }
  return out;
}

function topDim(scores: Record<string, number>, dims: string[]) {
  return [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))[0];
}
function lowDim(scores: Record<string, number>, dims: string[]) {
  return [...dims].sort((a, b) => (scores[a] ?? 0) - (scores[b] ?? 0))[0];
}

// ============================================================
// 무료 결과 계산 — 슬러그별 분기
// ============================================================
export function computeFreeResult(slug: string, answers: Record<string, unknown>): FreeResult {
  const raw = tallyScores(slug, answers);

  // ---------- 사업 전략 및 마케팅 (bespoke) ----------
  if (slug === "business-marketing") {
    const dims = ["target", "diff", "channel", "content", "data"];
    const scores = normalize(raw, dims, 4);
    const bnMap: Record<string, string> = {
      noTraffic: "유입 (사람이 안 옴)",
      noConvert: "전환 (와도 안 삼)",
      noDiff: "차별화 (비슷한 곳이 많음)",
      noRepeat: "재구매 (한 번 사고 안 옴)",
    };
    const labelMap: Record<string, string> = {
      target: "타겟 정의", diff: "차별화", channel: "유입", content: "콘텐츠/전환", data: "데이터/재구매",
    };
    const picked = answers["bottleneck"] as string | undefined;
    let stuckStage = picked && bnMap[picked] ? bnMap[picked] : "";
    if (!stuckStage) stuckStage = labelMap[lowDim(scores, dims)] ?? "유입";

    const strongest = topDim(scores, dims);
    const typeMap: Record<string, string> = {
      target: "타겟 명확형", diff: "차별화 강점형", channel: "유입 강점형", content: "콘텐츠 강점형", data: "데이터 기반형",
    };
    const businessType = typeMap[strongest] ?? "균형 탐색형";
    const stage = Math.round(raw["stage"] ?? 1);
    const leverageMap = [
      "검증 레버리지 (작게 팔아보기)",
      "유입 레버리지 (채널 한 우물)",
      "전환 레버리지 (구매 동선 설계)",
      "시스템 레버리지 (자동화·재구매)",
    ];
    const leverageType = leverageMap[Math.min(3, Math.max(0, isNaN(stage) ? 1 : stage))];
    const avg = Math.round(dims.reduce((s, k) => s + scores[k], 0) / dims.length);
    const yearTask = stuckStage.includes("유입")
      ? "‘한 채널 한 우물’로 안정적 유입 만들기"
      : stuckStage.includes("전환")
        ? "구매 직전 동선을 다듬어 전환율 끌어올리기"
        : stuckStage.includes("차별화")
          ? "한 문장 차별화 메시지 만들기"
          : "재구매 흐름(후속 제안) 설계하기";

    // 약점 축 보강 팁
    const fixTips: Record<string, string> = {
      target: "타겟을 ‘누구의 어떤 고민’ 한 명으로 좁혀 적어보세요.",
      diff: "경쟁사 3곳을 적고 우리만 채우는 빈칸 한 문장을 만드세요.",
      channel: "유입 채널 1개를 정해 4주간 집중 실험하세요.",
      content: "콘텐츠 끝마다 다음 행동(문의·저장·링크) 1개를 넣으세요.",
      data: "핵심 지표 3개만 정해 주간으로 기록하세요.",
    };
    const weak2 = [...dims].sort((a, b) => scores[a] - scores[b]).slice(0, 2);
    const strong2 = [...dims].sort((a, b) => scores[b] - scores[a]).slice(0, 2);

    const mbti = mbtiLabel(deriveMBTI(raw));
    const grade = avg >= 75 ? "A" : avg >= 55 ? "B" : avg >= 35 ? "C" : "D";
    const badges = [
      { label: "종합 점수", value: `${avg}점 · ${grade}` },
      { label: "사업 유형", value: businessType },
      { label: "성장 레버리지", value: leverageType.split(" (")[0] },
    ];

    const sections = [
      {
        icon: "🧭",
        heading: "지금 우리 사업의 진단",
        body:
          `현재 마케팅 구조는 종합 **${avg}점(${grade}등급)** 수준입니다. 가장 강한 무기는 **${labelMap[strongest]}**이고, 매출을 막는 진짜 병목은 **${stuckStage}**입니다.\n\n` +
          `많은 사장님이 ‘더 열심히 알리면’ 팔린다고 믿지만, 문제는 노력의 양이 아니라 **새는 구간**입니다. 물을 더 부어도 구멍 난 양동이는 안 찹니다. 지금 당신의 구멍은 ${stuckStage}입니다.\n\n` +
          `그래서 올해의 한 가지 과제는 분명합니다. ${yearTask}.`,
      },
      {
        icon: "💪",
        heading: "잘하고 있는 것 (살릴 무기)",
        body: "아래 두 축은 이미 평균 이상입니다. 새로 만들기보다 여기에 더 힘을 실을 때 효율이 가장 큽니다.",
        bullets: strong2.map((k) => `${labelMap[k]} — ${scores[k]}점. 강점이니 이 축을 마케팅 전면에 내세우세요.`),
      },
      {
        icon: "⚠️",
        heading: "지금 새고 있는 곳 (보강할 무기)",
        body: `매출이 막힌 진짜 이유는 여기 있습니다. 특히 **${stuckStage}**가 1순위입니다.`,
        bullets: weak2.map((k) => `${labelMap[k]} — ${scores[k]}점. ${fixTips[k]}`),
      },
      {
        icon: "🚀",
        heading: "이번 달 가장 먼저 할 한 가지",
        body: `${yearTask}. 거창한 캠페인보다 이 한 가지가 지금 가장 큰 변화를 만듭니다.`,
        bullets: [
          `1주차 · ${fixTips[weak2[0]]}`,
          weak2[1] ? `2주차 · ${fixTips[weak2[1]]}` : "2주차 · 1주차 결과를 보고 한 번 더 다듬으세요.",
          "3~4주차 · 작은 변화의 숫자(문의·전환)를 기록해 효과를 확인하세요.",
        ],
      },
    ];

    return {
      typeName: businessType,
      typeEmoji: "📊",
      tagline: `${stuckStage}에 막혀 있는 ${leverageType.split(" (")[0]} 단계`,
      badges,
      sections,
      summary: `현재 마케팅 구조는 약 ${avg}점 수준입니다. 강점은 ‘${businessType}’이지만 지금 매출을 막는 진짜 병목은 ‘${stuckStage}’입니다. 올해는 여기에 힘을 모아야 합니다.`,
      scores,
    };
  }

  // ---------- 사업 아이템 발굴 (리치 리포트) ----------
  if (slug === "business-item") {
    const dims = ["strength", "market", "model", "action"];
    const scores = normalize(raw, dims, 9);
    const strongest = topDim(scores, dims);
    const mbti = mbtiLabel(deriveMBTI(raw));
    const enn = deriveEnneagram(strongest, {
      strength: "5번 탐구가 (유능함 추구)",
      market: "2번 조력가 (관계·기여 추구)",
      model: "3번 성취가 (성공·성장 추구)",
      action: "7번 열정가 (자유·도전 추구)",
    });
    const strongLabel: Record<string, string> = {
      strength: "전문성", market: "사람·수요 감각", model: "수익 설계력", action: "실행 속도",
    };
    const badges = [
      { label: "추정 MBTI", value: mbti },
      { label: "에니어그램", value: enn },
      { label: "핵심 강점", value: strongLabel[strongest] },
    ];
    return buildBusinessItemReport(strongest, scores, mbti, enn, badges);
  }

  // ---------- 자기 발견 (리치 리포트) ----------
  if (slug === "self-discovery") {
    const dims = ["idea", "drive", "logic", "empathy"];
    const scores = normalize(raw, dims, 9);
    const strongest = topDim(scores, dims);
    const mbti = mbtiLabel(deriveMBTI(raw));
    const enn = deriveEnneagram(strongest, {
      idea: "4번 개성가 (독창성 추구)",
      drive: "3번 성취가 (성과 추구)",
      logic: "5번 탐구가 (유능함 추구)",
      empathy: "2번 조력가 (관계 추구)",
    });
    const strongLabel: Record<string, string> = {
      idea: "창의·발상", drive: "추진·실행", logic: "분석·전략", empathy: "공감·관계",
    };
    const badges = [
      { label: "추정 MBTI", value: mbti },
      { label: "에니어그램", value: enn },
      { label: "핵심 재능", value: strongLabel[strongest] },
    ];
    return buildSelfDiscoveryReport(strongest, scores, mbti, enn, badges);
  }

  // ---------- 리치 4축 진단 (공통 엔진) ----------
  const richDef = getRichDef(slug);
  if (richDef) {
    return buildRichFromDef(richDef, raw);
  }

  // ---------- 일반 진단 (RESULT_SPEC 기반, 폴백) ----------
  const spec = RESULT_SPEC[slug];
  if (spec) {
    const scores = normalize(raw, spec.dims, 10);
    const top = topDim(scores, spec.dims);
    const low = lowDim(scores, spec.dims);
    const type = spec.types[top];
    const cards: ResultCard[] = [
      { label: spec.typeCardLabel, value: type.name },
      { label: "가장 강한 무기", value: spec.dimLabels[top] },
      { label: "지금 약한 고리", value: spec.dimLabels[low], accent: true },
      { label: "추천 첫걸음", value: type.action },
    ];
    return {
      typeName: type.name,
      cards,
      summary: `${type.oneLine} 다만 ‘${spec.dimLabels[low]}’이(가) 약한 편이에요 — ${spec.lowTips[low]}`,
      scores,
    };
  }

  // fallback
  return {
    typeName: "탐색형",
    cards: [{ label: "유형", value: "탐색형" }],
    summary: "이 진단은 준비 중입니다.",
    scores: {},
  };
}
