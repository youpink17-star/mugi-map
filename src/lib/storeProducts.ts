// ============================================================
//  상품 카탈로그 (A~E 5층) — 외부(아임웹/노션)에서 판매하는 상품 안내.
//  결제는 externalUrl 링크로 연결. 실제 URL은 환경변수로 주입(없으면 준비 중).
//  운영자는 이 파일 + .env 만 고치면 상품/가격/링크를 바꿀 수 있다.
// ============================================================

export type Tier = "free" | "entry" | "flagship" | "diagnosis" | "consulting";

export interface StoreProduct {
  id: string;
  title: string;
  price?: string; // 무료 상품에만 "무료"로 표기. 유료는 금액이 자주 바뀌어 비공개(보러가기/준비 중 배지로 대신)
  desc: string;
  badge?: string; // 상품 형태 라벨 — "NOTION" | "전자책" 등
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
    ],
  },
  {
    tier: "entry",
    emoji: "🌱",
    label: "가볍게 입문하기",
    goal: "지금 바로 받아보는 무료 리포트로 먼저 감을 잡으세요",
    products: [
      { id: "report-item", title: "사업 아이템 발굴 리포트", desc: "10문항으로 알아보는 나에게 맞는 아이템 방향", envKey: "NEXT_PUBLIC_URL_REPORT_ITEM", defaultUrl: "https://funny-cactus-item.netlify.app/" },
      { id: "report-marketing", title: "마케팅 전략 리포트", desc: "안 팔리는 진짜 이유를 알려주는 마케팅 리포트", envKey: "NEXT_PUBLIC_URL_REPORT_MARKETING", defaultUrl: "https://funny-cactus-25ffa8.netlify.app/" },
    ],
  },
  {
    tier: "flagship",
    emoji: "⭐",
    label: "AI 콘텐츠 제조실",
    goal: "막힘 없이 콘텐츠와 마케팅을 계속 만들어내는 나만의 시스템",
    products: [
      { id: "experiment-book", title: "48시간 안에 끝내는 AI 마케팅 실험북", desc: "가진 트래픽을 매출로 바꿔보는 48시간 실험북", badge: "전자책", envKey: "NEXT_PUBLIC_URL_EXPERIMENT_BOOK" },
      { id: "studio-full", title: "콘텐츠 제조실 (노션)", desc: "여러 채널 콘텐츠를 한 번에 찍어내는 시스템", badge: "NOTION", envKey: "NEXT_PUBLIC_URL_STUDIO_FULL" },
      { id: "marketing-studio", title: "마케팅 제조실 (노션)", desc: "타겟부터 문구까지 마케팅을 직접 설계하는 시스템", badge: "NOTION", envKey: "NEXT_PUBLIC_URL_MARKETING_STUDIO" },
    ],
  },
  {
    tier: "diagnosis",
    emoji: "🎯",
    label: "막힌 곳 빠르게 뚫기",
    goal: "혼자 안 풀리는 지점을 함께 뚫습니다",
    products: [
      { id: "diag-1on1", title: "1:1 무기진단", desc: "내 강점과 상품을 함께 뜯어보는 1:1 진단", envKey: "NEXT_PUBLIC_URL_DIAG_1ON1" },
      { id: "content-room", title: "4주 콘텐츠 실행방", desc: "동료들과 소통하며 콘텐츠를 완성하는 4주 챌린지", envKey: "NEXT_PUBLIC_URL_CONTENT_ROOM" },
    ],
  },
  {
    tier: "consulting",
    emoji: "👑",
    label: "맞춤형 전략 컨설팅",
    goal: "사업 마케팅 전략을 처음부터 다시 설계합니다",
    products: [
      { id: "consult-funnel-strategy", title: "4주 마케팅 퍼널 구축 컨설팅", desc: "전체 마케팅 퍼널을 함께 설계하는 4주 컨설팅", envKey: "NEXT_PUBLIC_URL_CONSULT_4W" },
      { id: "consult-funnel-agency", title: "4주 마케팅 퍼널 구축 대행", desc: "전체 마케팅 퍼널을 대신 만들어주는 4주 대행", envKey: "NEXT_PUBLIC_URL_CONSULT_8W" },
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
