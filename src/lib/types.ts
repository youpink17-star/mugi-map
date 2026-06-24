// 공통 타입 정의

export type Category = "business" | "creator" | "identity";

export interface Product {
  slug: string;
  title: string;
  category: Category;
  categoryLabel: string;
  emoji: string; // 이미지 미존재 시 대체 표시용
  short: string; // 카드용 짧은 설명
  hook: string; // 랜딩 후킹 카피
  hookSub: string; // 후킹 보조 카피
  includes: string[]; // 제공 항목 4~5개
  price: number; // 0 이면 Coming Soon
  active: boolean;
  badge?: "NEW" | "BEST";
  freeReveal: string[]; // 무료 결과에서 공개되는 항목 설명
  paidUnlocks: string[]; // 유료 리포트에서 열리는 항목
}

export type QuestionType = "single" | "multi" | "scale" | "text" | "long";

export interface QuestionOption {
  value: string;
  label: string;
  // 객관식 점수: 차원별 가중치
  score?: Record<string, number>;
}

export interface Question {
  id: string;
  type: QuestionType;
  q: string;
  help?: string;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
}

// 무료 결과 미리보기 카드
export interface ResultCard {
  label: string;
  value: string;
  accent?: boolean;
}

// 리치 리포트 한 섹션 (긴 본문 + 불릿 + 사례)
export interface ReportExample {
  name: string; // 닮은 사업가 / 브랜드 / 직무
  desc: string; // 왜 닮았는지
}
export interface ReportSection {
  icon?: string;
  heading: string;
  body: string; // 긴 본문 (\n\n 로 문단 구분)
  bullets?: string[];
  examples?: ReportExample[];
}

// 진단 상단 지표 배지 (MBTI 추정 / 에니어그램 / 강점 등)
export interface ResultBadge {
  label: string;
  value: string;
}

// 유료 리포트에서 열리는 항목 명세 (제목 + 무엇을 주는지) — 구버전, 폴백용
export interface PaidItem {
  icon: string;
  title: string;
  desc: string;
}

// 유료 섹션 — A+C 혼합(질문→답) 프리미엄 구조
// 답변(a) 안에서 **텍스트** 로 감싸면 형광펜 강조 처리됨
export interface PaidQA {
  q: string; // 고민 토로체 "내 실력으로 무엇을 팔아야 하는지 궁금해요"
  a: string; // "유료 리포트에서는 **가장 잘 맞는 아이템 1가지**를 추천해드립니다"
}
export interface PaidOffer {
  headline: string; // 두 줄 헤드 ("\n" 로 구분)
  intro: string; // 개인화 한 줄
  qa: PaidQA[]; // 질문→답 5개
  toc: string[]; // 유료 리포트 목차
  previewTitle: string; // "리포트는 이렇게 나옵니다"
  preview: { label: string; value: string }[]; // 미리보기 표 4행
  facts: string[]; // 정량 팩트 ("12개 문항을 4가지 축으로…")
}

// 무료 결과(미리보기) — "어? 나잖아" 영역
export interface FreeResult {
  typeName: string; // 핵심 유형명(헤더 강조)
  typeEmoji?: string; // 유형 대표 이모지
  tagline?: string; // 유형 한 줄 정의
  badges?: ResultBadge[]; // 상단 지표 칩 (MBTI/에니어/강점)
  cards?: ResultCard[]; // (일반 진단용) 미리보기 카드들
  sections?: ReportSection[]; // (리치 진단용) 긴 본문 섹션들
  summary: string; // 한 문단 요약
  scores: Record<string, number>; // 차원 점수(0~100)
}

export type OrderStatus =
  | "free_done"
  | "payment_pending"
  | "paid"
  | "paid_form_done"
  | "report_sent";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  free_done: "무료진단 완료",
  payment_pending: "결제 대기",
  paid: "결제 완료",
  paid_form_done: "유료폼 완료",
  report_sent: "리포트 발송 완료",
};

export interface OrderRow {
  id: string;
  product_slug: string;
  test_response_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  amount: number;
  status: OrderStatus;
  payment_provider: string | null;
  payment_ref: string | null;
  created_at: string;
  updated_at: string;
}
