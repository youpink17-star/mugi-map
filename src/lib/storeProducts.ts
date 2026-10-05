import { DIAGNOSIS_URL } from "./links";

// ============================================================
//  상품 카탈로그 (A~E 5층) — 외부(아임웹/노션)에서 판매하는 상품 안내.
//  결제는 externalUrl 링크로 연결. 실제 URL은 환경변수로 주입(없으면 준비 중).
//  운영자는 이 파일 + .env 만 고치면 상품/가격/링크를 바꿀 수 있다.
// ============================================================

export type Tier = "free" | "entry" | "flagship" | "diagnosis" | "consulting";

export interface StoreProduct {
  id: string;
  title: string;
  desc: string;
  badge?: string; // 상품 라벨 — "NOTION" | "전자책" | "무료" | "B2B" 등
  internalHref?: string; // 무기지도 안에서 바로 여는 경우 (예: 사업 정리본)
  cta?: string; // 버튼 문구 (없으면 링크 있을 때 "보러가기 ↗", 없으면 "준비 중")
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
    goal: "내 무기와 사업의 빈칸부터 확인하기",
    products: [
      {
        id: "free-wiki",
        title: "사업 정리본",
        badge: "지금 이곳",
        desc: "질문에 답만 하면 내 사업이 한 장으로 정리",
        internalHref: "/wiki",
        cta: "바로 채우기 →",
      },
      {
        id: "free-diagnosis",
        title: "무기진단",
        badge: "무료",
        desc: "24문항으로 내가 잘하는 것과 무기 유형 찾기",
        defaultUrl: DIAGNOSIS_URL,
      },
    ],
  },
  {
    tier: "entry",
    emoji: "🌱",
    label: "가볍게 입문하기",
    goal: "리포트 한 권으로 방향 먼저 잡기",
    products: [
      { id: "report-item", title: "사업 아이템 발굴 리포트", badge: "PDF 리포트", desc: "나에게 맞는 사업 아이템 3개와 90일 계획을 40쪽에 정리", envKey: "NEXT_PUBLIC_URL_REPORT_ITEM", defaultUrl: "https://item.mugimaker.com/" },
      { id: "report-marketing", title: "사업 및 마케팅 전략 리포트", badge: "PDF 리포트", desc: "열심히 해도 안 팔리는 이유와 해결법을 40쪽에 정리", envKey: "NEXT_PUBLIC_URL_REPORT_MARKETING", defaultUrl: "https://marketing.mugimaker.com/" },
    ],
  },
  {
    tier: "flagship",
    emoji: "⭐",
    label: "혼자서도 계속 만들어내기",
    goal: "막힘 없이 콘텐츠와 마케팅을 계속 만드는 나만의 도구",
    products: [
      { id: "experiment-book", title: "혼자 하는 48시간 AI 마케팅 실험", desc: "콘텐츠부터 광고까지, 마케터 없이 주말에 끝내기", badge: "전자책", envKey: "NEXT_PUBLIC_URL_EXPERIMENT_BOOK", defaultUrl: "https://mugimaker.com/shop_view/?idx=10" },
      {
        id: "studio-full",
        title: "AI 콘텐츠 제조실",
        desc: "콘텐츠 만드는 사이트에 마케팅 설계법·잘된 광고 모음까지 한 번에",
        badge: "NOTION",
        envKey: "NEXT_PUBLIC_URL_STUDIO_FULL",
        // 판매 페이지는 https://mugimaker.com/shop_view/?idx=20 — 아직 비공개라 링크를 걸지 않는다("준비 중" 표시).
        // 공개되면 여기에 defaultUrl 로 넣는다.
      },
    ],
  },
  {
    tier: "diagnosis",
    emoji: "🎯",
    label: "막힌 곳 빠르게 뚫기",
    goal: "혼자 안 풀리는 곳을 함께 해결",
    products: [
      {
        id: "diag-1on1",
        title: "관점 컨설팅 세션",
        badge: "30분 · 비대면",
        desc: "30분 상담으로 상세페이지·제안서를 더 잘 팔리게 고치기",
        envKey: "NEXT_PUBLIC_URL_DIAG_1ON1",
        defaultUrl: "https://mugimaker.com/30",
      },
      { id: "content-room", title: "4주 콘텐츠 실행방", badge: "4주 챌린지", desc: "혼자 미루던 콘텐츠, 동료들과 4주 동안 끝까지 완성", envKey: "NEXT_PUBLIC_URL_CONTENT_ROOM" },
    ],
  },
  {
    tier: "consulting",
    emoji: "👑",
    label: "프리미엄 컨설팅",
    goal: "기업·법인 전용 · 의뢰하면 가격 안내",
    products: [
      {
        id: "premium-consult",
        title: "기업 제안서 컨설팅",
        badge: "B2B",
        desc: "제안서·회사 소개서·투자 자료를 따내는 문서로 새로 고치기",
        envKey: "NEXT_PUBLIC_URL_PREMIUM_CONSULT",
        defaultUrl: "https://mugimaker.com/30",
        cta: "의뢰하기 ↗",
      },
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
  desc: "내 사주와 특징을 입력하면 딱 맞는 아이템을 40p 리포트로 찾아드려요",
  url: "https://item.mugimaker.com/",
  envKey: "NEXT_PUBLIC_URL_REPORT_ITEM",
};
const REPORT_MARKETING: AutoReport = {
  id: "report-marketing",
  title: "사업 및 마케팅 전략 리포트",
  desc: "내 사업에 맞춘 마케팅 방향을 40p 리포트로 개인화해 보내드려요",
  url: "https://marketing.mugimaker.com/",
  envKey: "NEXT_PUBLIC_URL_REPORT_MARKETING",
};

// 홈에서 "아직 없어요 / 있어요" 선택에 따라 붙일 리포트
export function reportForSelling(selling: "none" | "selling"): AutoReport {
  return selling === "selling" ? REPORT_MARKETING : REPORT_ITEM;
}

// 위키/결과 페이지 업셀 CTA에서 쓸 대표 연결 2개
export const UPSELL_STUDIO = {
  title: "AI 콘텐츠 제조실",
  desc: "사업 정리본에 채운 걸 실제 콘텐츠·마케팅으로 계속 찍어내는 노션 시스템",
  envKey: "NEXT_PUBLIC_URL_STUDIO_FULL",
};
export const UPSELL_CONSULT = {
  title: "관점 컨설팅 세션",
  desc: "30분 비대면으로 상세페이지·제안서를 더 잘 팔리게",
  envKey: "NEXT_PUBLIC_URL_DIAG_1ON1",
};
