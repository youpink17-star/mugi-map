// ============================================================
//  무기제작소 성장 시스템 — 4단계 여정
//  운영자는 이 파일만 고치면 단계 구성·순서·다음 추천을 바꿀 수 있다.
//  (진단 콘텐츠 자체는 products.ts / questions.ts / reports 에 있음)
// ============================================================

export type StageId = "discover" | "select" | "sharpen" | "expand";

export interface Stage {
  id: StageId;
  step: number; // 1~4
  title: string; // 무기 발견
  emoji: string;
  tagline: string; // 한 줄 설명
  slugs: string[]; // 이 단계에 속한 진단 slug (products.ts 와 일치)
}

export const STAGES: Stage[] = [
  {
    id: "discover",
    step: 1,
    title: "무기 발견",
    emoji: "🔎",
    tagline: "나는 어떤 사람이고 무엇을 잘하는가",
    slugs: ["self-discovery", "purpose", "work-style", "priority"],
  },
  {
    id: "select",
    step: 2,
    title: "무기 선택",
    emoji: "🗡️",
    tagline: "그 무기로 무엇을 할 것인가",
    slugs: ["business-item", "creator-fit", "business-marketing"],
  },
  {
    id: "sharpen",
    step: 3,
    title: "무기 연마",
    emoji: "⚒️",
    tagline: "고른 무기를 어떻게 날카롭게 할 것인가",
    slugs: ["content-strategy", "instagram", "youtube", "shortform-writing"],
  },
  {
    id: "expand",
    step: 4,
    title: "무기 확장",
    emoji: "🚀",
    tagline: "검증된 무기를 어떻게 키울 것인가",
    slugs: ["ad-conversion"],
  },
];

// slug → 소속 단계
export function getStageOf(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slugs.includes(slug));
}

// 전체 진단 순서 (단계 순 → 단계 내 순서)
export const JOURNEY_ORDER: string[] = STAGES.flatMap((s) => s.slugs);

// ---------- 다음 추천 진단 ----------
// 명시적 추천 맵(운영자가 자유롭게 수정). 없으면 JOURNEY_ORDER 순서로 폴백.
export const NEXT_RECOMMEND: Record<string, string> = {
  "self-discovery": "purpose",
  purpose: "work-style",
  "work-style": "priority",
  priority: "business-item",
  "business-item": "business-marketing",
  "creator-fit": "content-strategy",
  "business-marketing": "content-strategy",
  "content-strategy": "instagram",
  instagram: "youtube",
  youtube: "shortform-writing",
  "shortform-writing": "ad-conversion",
  "ad-conversion": "",
};

export function getNextSlug(slug: string): string | undefined {
  if (slug in NEXT_RECOMMEND) {
    const n = NEXT_RECOMMEND[slug];
    return n || undefined;
  }
  const i = JOURNEY_ORDER.indexOf(slug);
  if (i >= 0 && i < JOURNEY_ORDER.length - 1) return JOURNEY_ORDER[i + 1];
  return undefined;
}
