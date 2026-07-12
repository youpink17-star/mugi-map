// ============================================================
//  상품 카탈로그 (A~E 5층) — 외부(아임웹/노션)에서 판매하는 상품 안내.
//  결제는 externalUrl 링크로 연결. 실제 URL은 환경변수로 주입(없으면 준비 중).
//  운영자는 이 파일 + .env 만 고치면 상품/가격/링크를 바꿀 수 있다.
// ============================================================

export type Tier = "free" | "entry" | "flagship" | "diagnosis" | "consulting";

export interface StoreProduct {
  id: string;
  title: string;
  price: string; // 표기용 (예: "149,000원")
  desc: string;
  badge?: string; // "대표 상품" | "베타" 등
  envKey?: string; // 이 상품의 외부 링크 환경변수 이름
  defaultUrl?: string; // env 미설정 시 쓸 기본 링크(이미 라이브인 상품)
}

export interface StoreTier {
  tier: Tier;
  emoji: string;
  label: string; // A. 무료층
  goal: string; // 이 층의 목표(내부용이지만 짧게 노출)
  products: StoreProduct[];
}

// env 에서 외부 판매 URL 을 읽는다. 없으면 undefined(→ "준비 중" 표시)
export function productUrl(envKey?: string): string | undefined {
  if (!envKey) return undefined;
  const v = process.env[envKey as keyof NodeJS.ProcessEnv];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export const STORE_TIERS: StoreTier[] = [
  {
    tier: "free",
    emoji: "🎁",
    label: "무료로 시작하기",
    goal: "먼저 내 무기와 사업의 빈칸부터 확인하세요",
    products: [
      { id: "free-wiki", title: "무기위키", price: "무료", desc: "내 사업을 한 장으로 정리하는 사업 위키" },
      { id: "free-diagnosis", title: "무기진단", price: "무료", desc: "내 강점·유형을 찾는 진단" },
      { id: "free-checklist", title: "무료 체크리스트·템플릿", price: "무료", desc: "지금 바로 쓰는 간단 템플릿" },
    ],
  },
  {
    tier: "entry",
    emoji: "🌱",
    label: "가볍게 입문하기",
    goal: "커피 한 잔 값으로 첫 실전 감각을 얻으세요",
    products: [
      { id: "report-item", title: "사업 아이템 발굴 리포트", price: "자세히 보기", desc: "10문항이면 나에게 맞는 아이템 방향을 40p 리포트로", badge: "바로 가능", envKey: "NEXT_PUBLIC_URL_REPORT_ITEM", defaultUrl: "https://funny-cactus-item.netlify.app/" },
      { id: "report-marketing", title: "마케팅 전략 리포트", price: "자세히 보기", desc: "안 팔리는 진짜 이유와 나에게 맞는 마케팅 방향", badge: "바로 가능", envKey: "NEXT_PUBLIC_URL_REPORT_MARKETING", defaultUrl: "https://funny-cactus-25ffa8.netlify.app/" },
      { id: "experiment-book", title: "AI 마케팅 실험북", price: "48,000원", desc: "AI로 마케팅을 직접 실험해보는 워크북", envKey: "NEXT_PUBLIC_URL_EXPERIMENT_BOOK" },
    ],
  },
  {
    tier: "flagship",
    emoji: "⭐",
    label: "대표 상품 — 노션 콘텐츠 제조실",
    goal: "막힘 없이 콘텐츠를 계속 만들어내는 나만의 시스템",
    products: [
      { id: "studio-beta", title: "콘텐츠 제조실 베타", price: "99,000원", desc: "콘텐츠 제조 시스템 베타 버전", badge: "대표 상품", envKey: "NEXT_PUBLIC_URL_STUDIO_BETA" },
      { id: "studio-full", title: "콘텐츠 제조실 정식판", price: "149,000원", desc: "제목·후킹·본문·CTA를 계속 찍어내는 완성판", badge: "BEST", envKey: "NEXT_PUBLIC_URL_STUDIO_FULL" },
      { id: "studio-bundle", title: "확장판·번들", price: "199,000원~", desc: "제조실 + 확장 템플릿 번들", envKey: "NEXT_PUBLIC_URL_STUDIO_BUNDLE" },
    ],
  },
  {
    tier: "diagnosis",
    emoji: "🎯",
    label: "막힌 곳 뚫기 (1:1·실행방)",
    goal: "혼자 안 풀리는 지점을 함께 뚫습니다",
    products: [
      { id: "diag-1on1", title: "1:1 무기진단", price: "350,000원~", desc: "내 사업을 1:1로 정밀 진단", envKey: "NEXT_PUBLIC_URL_DIAG_1ON1" },
      { id: "content-room", title: "3주 콘텐츠 실행방", price: "300,000원~", desc: "3주간 실제로 콘텐츠를 완성하는 그룹 실행방", envKey: "NEXT_PUBLIC_URL_CONTENT_ROOM" },
      { id: "diag-bundle", title: "제조실 + 진단 번들", price: "390,000원~", desc: "시스템과 1:1 진단을 함께", envKey: "NEXT_PUBLIC_URL_DIAG_BUNDLE" },
    ],
  },
  {
    tier: "consulting",
    emoji: "👑",
    label: "제대로 판을 짜기 (컨설팅)",
    goal: "판매 구조 자체를 함께 설계합니다",
    products: [
      { id: "consult-4w", title: "4주 무기설계 컨설팅", price: "1,500,000원", desc: "내 무기와 상품 구조를 4주간 설계", envKey: "NEXT_PUBLIC_URL_CONSULT_4W" },
      { id: "consult-8w", title: "8주 판매구조 구축 컨설팅", price: "3,000,000원~", desc: "판매 시스템 전체를 8주간 구축", envKey: "NEXT_PUBLIC_URL_CONSULT_8W" },
    ],
  },
];

// ---------- 자동 리포트 (기존 라이브 진단) ----------
// 30문항 → 40~50p PDF 자동 발송. 홈 2택 직후 상황별로 연결한다.
// 값은 env로 덮어쓸 수 있고, 없으면 아래 기본 라이브 URL 사용.
export interface AutoReport {
  id: string;
  title: string;
  desc: string;
  url: string; // 기본 라이브 URL (env로 덮어쓰기 가능)
  envKey: string;
}

const REPORT_ITEM: AutoReport = {
  id: "report-item",
  title: "사업 아이템 발굴 리포트",
  desc: "10문항이면 나에게 맞는 아이템 방향을 40p 리포트로 받아봐요",
  url: "https://funny-cactus-item.netlify.app/",
  envKey: "NEXT_PUBLIC_URL_REPORT_ITEM",
};
const REPORT_MARKETING: AutoReport = {
  id: "report-marketing",
  title: "마케팅 전략 리포트",
  desc: "안 팔리는 진짜 이유와 나에게 맞는 마케팅 방향을 리포트로",
  url: "https://funny-cactus-25ffa8.netlify.app/",
  envKey: "NEXT_PUBLIC_URL_REPORT_MARKETING",
};

// 홈에서 "아직 없어요 / 있어요" 선택에 따라 붙일 리포트
export function reportForSelling(selling: "none" | "selling"): AutoReport {
  return selling === "selling" ? REPORT_MARKETING : REPORT_ITEM;
}

// 위키/결과 페이지 업셀 CTA에서 쓸 대표 연결 2개
export const UPSELL_STUDIO = {
  title: "콘텐츠 제조실",
  desc: "위키에 채운 걸 실제 콘텐츠로 계속 찍어내는 시스템",
  envKey: "NEXT_PUBLIC_URL_STUDIO_FULL",
};
export const UPSELL_CONSULT = {
  title: "1:1 무기진단",
  desc: "혼자 안 풀리는 지점을 전문가와 1:1로",
  envKey: "NEXT_PUBLIC_URL_DIAG_1ON1",
};
