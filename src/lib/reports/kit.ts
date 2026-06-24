import type { FreeResult, ReportSection, PaidItem } from "../types";
import { deriveMBTI, mbtiLabel } from "../mbti";

// 4축 리치 리포트 공통 정의. 각 진단 파일이 이 형태로 export 한다.
export interface RichType {
  name: string;
  emoji?: string;
  tagline: string;
  summary: string;
  sections: (mbti: string, enn: string) => ReportSection[];
}

export interface RichReportDef {
  dims: string[]; // 4개 차원 키
  dimLabels: Record<string, string>;
  enneagram: Record<string, string>; // topDim → 에니어그램 라벨
  strengthLabel: Record<string, string>; // topDim → 강점 한 단어
  badgeLabel: string; // 두 번째 배지 라벨 (예: "광고 유형")
  types: Record<string, RichType>; // topDim → 유형
  paid: PaidItem[];
}

function topDim(scores: Record<string, number>, dims: string[]) {
  return [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))[0];
}

// raw 점수 → FreeResult (리치)
export function buildRichFromDef(
  def: RichReportDef,
  raw: Record<string, number>
): FreeResult {
  const scores: Record<string, number> = {};
  for (const k of def.dims) {
    const v = Math.max(0, raw[k] ?? 0);
    scores[k] = Math.min(100, Math.round((v / 9) * 100));
  }
  const strongest = topDim(scores, def.dims);
  const t = def.types[strongest] ?? def.types[def.dims[0]];
  const mbti = mbtiLabel(deriveMBTI(raw));
  const enn = def.enneagram[strongest] ?? "탐구형";
  const badges = [
    { label: "추정 MBTI", value: mbti },
    { label: "에니어그램", value: enn },
    { label: "핵심 강점", value: def.strengthLabel[strongest] ?? def.dimLabels[strongest] },
  ];
  return {
    typeName: t.name,
    typeEmoji: t.emoji,
    tagline: t.tagline,
    badges,
    sections: t.sections(mbti, enn),
    summary: t.summary,
    scores,
  };
}
