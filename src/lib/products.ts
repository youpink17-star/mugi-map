import type { Product, Category } from "./types";

export const CATEGORY_LABEL: Record<Category, string> = {
  business: "사업/마케팅",
  creator: "크리에이터",
  identity: "아이덴티티",
};

// 카테고리별 섹션 헤드라인(청월당식 후킹 카피)
export const CATEGORY_HEADLINE: Record<Category, { emoji: string; title: string; sub: string }> = {
  business: { emoji: "🔥", title: "안 팔리는 진짜 이유, 여기 있어요", sub: "사업·마케팅의 막힌 곳을 진단합니다" },
  creator: { emoji: "🎬", title: "나에게 맞는 무대를 찾아드려요", sub: "채널·콘텐츠 적성을 진단합니다" },
  identity: { emoji: "🧭", title: "어라, 이거 완전 내 얘긴데?", sub: "강점·욕구·일하는 방식을 진단합니다" },
};

// 이미지 미존재 시 대체 배경 그라데이션 (CSS)
export const CATEGORY_GRADIENT: Record<Category, string> = {
  business: "linear-gradient(135deg,#07071F 0%,#2a1248 55%,#FF2F8F 140%)",
  creator: "linear-gradient(135deg,#1a0830 0%,#6d28d9 60%,#FF2F8F 130%)",
  identity: "linear-gradient(135deg,#0b1030 0%,#3b2a7a 55%,#8B5CF6 130%)",
};

export const CATEGORY_ORDER: Category[] = ["business", "creator", "identity"];

// 진단 상품 12개 — UI/랜딩의 단일 소스(Single Source of Truth)
export const PRODUCTS: Product[] = [
  // ================= 비즈니스 =================
  {
    slug: "business-item",
    title: "사업 아이템 발굴 진단",
    category: "business",
    categoryLabel: "사업/마케팅",
    emoji: "💎",
    short: "나에게 맞는 ‘돈 되는 아이템’ 방향 찾기",
    hook: "뭘 팔지부터 막혔다면",
    hookSub: "당신의 경험·강점·시장을 교차 분석해 ‘될 만한 아이템’ 방향을 잡아드립니다.",
    includes: ["내 강점 × 시장 수요 교차 분석", "추천 아이템 유형 3가지", "피해야 할 함정 아이템", "검증 우선순위 로드맵"],
    price: 12900,
    active: true,
    badge: "NEW",
    freeReveal: ["내가 가진 사업가 기질", "내 강점이 가장 잘 먹히는 시장", "지금 나를 가로막는 결정적 한 가지", "남들은 모르는 내 무기"],
    paidUnlocks: ["나에게 딱 맞는 돈 되는 아이템 1순위", "맨손에서 성공한 같은 유형 3인의 길", "7일 안에 첫 매출 만드는 실행 순서", "내가 반드시 피해야 할 돈 새는 함정"],
  },
  {
    slug: "business-marketing",
    title: "사업 전략 및 마케팅 진단",
    category: "business",
    categoryLabel: "사업/마케팅",
    emoji: "📊",
    short: "안 팔리는 진짜 이유 = 팔리는 구조 진단",
    hook: "열심히 하는데 왜 안 팔릴까요?",
    hookSub: "상품이 나빠서가 아닙니다. 팔리는 구조를 못 찾은 것입니다.",
    includes: ["타겟·차별화·채널·콘텐츠·전환 5축 진단", "가장 새는 구간(병목) 진단", "우선순위 처방전", "30일 실행 플랜"],
    price: 29000,
    active: true,
    badge: "BEST",
    freeReveal: ["우리 사업의 진짜 성장 단계", "매출을 막는 가장 큰 병목", "내가 이미 잘하고 있는 강점", "지금 손봐야 할 약한 고리"],
    paidUnlocks: ["우리만의 한 문장 차별화 메시지", "매출을 여는 병목 1순위 처방", "우리에게 맞는 채널 우선순위", "30일이면 숫자가 바뀌는 실행 플랜"],
  },
  {
    slug: "ad-conversion",
    title: "광고 전환 진단",
    category: "business",
    categoryLabel: "사업/마케팅",
    emoji: "📣",
    short: "광고비가 새는 구간 찾기",
    hook: "광고비, 어디서 새고 있을까요?",
    hookSub: "후킹-타겟팅-랜딩-오퍼 4구간에서 돈이 빠지는 지점을 찾아드립니다.",
    includes: ["4구간 누수 진단", "소재·타겟 점검", "랜딩 전환 체크", "개선 우선순위"],
    price: 19000,
    active: true,
    freeReveal: ["내 광고가 가진 강점 구간", "광고비가 새고 있는 구간", "전환을 막는 결정적 약점", "지금 손대면 효과 큰 지점"],
    paidUnlocks: ["돈 새는 구간을 막는 1순위 처방", "클릭을 결제로 바꾸는 소재 공식", "전환율 높이는 랜딩 수정 포인트", "성과 기준 예산 재배분 표"],
  },
  {
    slug: "content-strategy",
    title: "콘텐츠 전략 진단",
    category: "business",
    categoryLabel: "사업/마케팅",
    emoji: "📝",
    short: "우리 브랜드에 맞는 콘텐츠 방향",
    hook: "콘텐츠는 만드는데 반응이 없다면",
    hookSub: "메시지·꾸준함·포맷·전환 4축으로 콘텐츠 구조를 진단합니다.",
    includes: ["콘텐츠 4축 진단", "포맷 추천", "주제 풀 제안", "발행 리듬 설계"],
    price: 19000,
    active: true,
    freeReveal: ["내 콘텐츠가 가진 강점", "반응이 없는 결정적 이유", "내가 놓치고 있는 약한 축", "우리 브랜드에 맞는 방향"],
    paidUnlocks: ["우리만의 콘텐츠 한 문장 메시지", "바로 쓰는 30일치 주제 캘린더", "우리에게 맞는 포맷 3가지", "좋아요를 매출로 잇는 동선 설계"],
  },

  // ================= 크리에이터 =================
  {
    slug: "instagram",
    title: "인스타그램 운영 진단",
    category: "creator",
    categoryLabel: "크리에이터",
    emoji: "📷",
    short: "계정 운영 강·약점 점검",
    hook: "팔로워는 느는데 매출은 그대로라면",
    hookSub: "컨셉·비주얼·꾸준함·전환 4축으로 계정을 진단합니다.",
    includes: ["계정 컨셉 진단", "콘텐츠 믹스 점검", "전환 동선 체크", "성장 액션"],
    price: 14900,
    active: true,
    freeReveal: ["내 계정이 가진 강점", "팔로워가 매출로 안 가는 이유", "지금 손봐야 할 약한 축", "한눈에 기억되게 만드는 법 힌트"],
    paidUnlocks: ["한눈에 기억되는 프로필 한 줄", "우리에게 맞는 콘텐츠 비중 공식", "팔로워를 고객으로 바꾸는 동선", "30일이면 클릭이 바뀌는 플랜"],
  },
  {
    slug: "youtube",
    title: "유튜브 운영 진단",
    category: "creator",
    categoryLabel: "크리에이터",
    emoji: "📺",
    short: "채널 성장의 병목 찾기",
    hook: "조회수가 안 터지는 이유",
    hookSub: "기획·썸네일·지속시청·발행력 4축으로 채널을 진단합니다.",
    includes: ["채널 컨셉 진단", "기획 점검", "썸네일·제목 체크", "성장 액션"],
    price: 14900,
    active: true,
    freeReveal: ["내 채널이 가진 강점", "조회수가 안 터지는 약한 고리", "지금 손대면 효과 큰 지점", "내 채널에 맞는 방향 힌트"],
    paidUnlocks: ["클릭을 부르는 썸네일·제목 공식", "끝까지 보게 만드는 도입 30초 설계", "터질 확률 높은 주제 3가지", "30일 콘텐츠 캘린더"],
  },
  {
    slug: "shortform-writing",
    title: "숏폼 글쓰기 진단",
    category: "creator",
    categoryLabel: "크리에이터",
    emoji: "✍️",
    short: "스레드·X 텍스트 콘텐츠 적성",
    hook: "짧은 글로 사람을 모으고 싶다면",
    hookSub: "후킹·통찰·공감·꾸준함 4축으로 글쓰기 스타일을 진단합니다.",
    includes: ["글쓰기 유형 진단", "강점 포맷", "주제 톤 추천", "발행 루틴"],
    price: 9900,
    active: true,
    freeReveal: ["내 글이 가진 무기", "사람이 안 모이는 약한 고리", "지금 키우면 좋은 강점", "내게 맞는 글 방향 힌트"],
    paidUnlocks: ["스크롤 멈추는 첫 문장 공식", "바로 쓰는 훅 문장 템플릿 20", "내게 맞는 주제 3가지", "막히지 않는 30일 글감"],
  },
  {
    slug: "creator-fit",
    title: "크리에이터 적성 진단",
    category: "creator",
    categoryLabel: "크리에이터",
    emoji: "🎬",
    short: "나에게 맞는 플랫폼 추천",
    hook: "어떤 플랫폼이 나에게 맞을까?",
    hookSub: "기획·노출·꾸준함·트렌드 4축으로 적성을 봅니다.",
    includes: ["적성 4축 진단", "추천 플랫폼", "시작 전략", "주의점"],
    price: 9900,
    active: true,
    badge: "NEW",
    freeReveal: ["내 크리에이터 기질", "나에게 맞는 무대 방향", "지금 보완하면 좋은 약점", "남들은 모르는 내 강점"],
    paidUnlocks: ["나에게 맞는 플랫폼 1순위", "바로 시작하는 첫 30일 플랜", "내 강점을 콘텐츠로 바꾸는 법", "초보가 꼭 피해야 할 실패 패턴"],
  },

  // ================= 아이덴티티 =================
  {
    slug: "self-discovery",
    title: "자기 발견 진단",
    category: "identity",
    categoryLabel: "아이덴티티",
    emoji: "🗝️",
    short: "강점·재능 발견",
    hook: "내 강점이 뭔지 모르겠다면",
    hookSub: "창의·실행·분석·관계 4가지 재능축으로 나를 정리해드립니다.",
    includes: ["재능 4축 진단", "핵심 강점", "보완점", "활용 액션"],
    price: 9900,
    active: true,
    badge: "NEW",
    freeReveal: ["내가 가진 돋보이는 강점", "내 숨겨진 재능과 활용 힌트", "지금 발목 잡는 약한 고리", "남들은 부러워하는 내 무기"],
    paidUnlocks: ["내 강점이 돈이 되는 직무 3가지", "사업과 회사 중 나에게 맞는 길", "강점 조합이 만드는 나만의 무기", "지금 시작하는 3개월 행동 계획"],
  },
  {
    slug: "purpose",
    title: "목적 발견 진단",
    category: "identity",
    categoryLabel: "아이덴티티",
    emoji: "🧭",
    short: "내가 진짜 원하는 방향",
    hook: "바쁜데 공허하다면",
    hookSub: "성취·자유·기여·안정 4가지 동기축으로 진짜 방향을 봅니다.",
    includes: ["동기 유형 진단", "핵심 가치", "방향 제안", "정렬 액션"],
    price: 9900,
    active: true,
    freeReveal: ["나를 진짜 움직이는 동기", "내가 포기 못 하는 핵심 가치", "지금 공허한 결정적 이유", "남들은 모르는 내 진짜 욕구"],
    paidUnlocks: ["나에게 맞는 삶의 방향 3가지", "지금 내려놓아야 할 것", "가치에 맞는 목표 세우는 법", "지금 시작하는 3개월 정렬 계획"],
  },
  {
    slug: "priority",
    title: "우선순위 정리 진단",
    category: "identity",
    categoryLabel: "아이덴티티",
    emoji: "🎯",
    short: "무엇에 먼저 집중할지",
    hook: "할 일은 많은데 진도가 안 나간다면",
    hookSub: "임팩트·긴급·역량·욕구 4축으로 지금 집중할 한 가지를 골라드립니다.",
    includes: ["우선순위 진단", "임팩트 맵", "버릴 일 추천", "집중 액션"],
    price: 7900,
    active: true,
    freeReveal: ["내가 일을 고르는 방식", "지금 집중해야 할 방향", "나를 바쁘게만 하는 함정", "남들은 모르는 내 시간 누수"],
    paidUnlocks: ["이번 주 가장 먼저 할 1가지", "지금 당장 멈춰야 할 일들", "나에게 맞는 우선순위 판단법", "흔들리지 않는 주간 운영 루틴"],
  },
  {
    slug: "work-style",
    title: "일하는 방식 진단",
    category: "identity",
    categoryLabel: "아이덴티티",
    emoji: "🧩",
    short: "나에게 맞는 업무·협업 스타일",
    hook: "왜 나는 이 방식이 힘들까?",
    hookSub: "몰입·구조·협업·속도 4축으로 최적 업무 환경을 진단합니다.",
    includes: ["워크스타일 진단", "최적 환경", "협업 팁", "번아웃 주의점"],
    price: 7900,
    active: true,
    freeReveal: ["내가 강해지는 일하는 방식", "지금 나를 지치게 하는 환경", "내가 보완하면 좋은 약점", "남들은 모르는 내 몰입 스위치"],
    paidUnlocks: ["나에게 맞는 최적 업무 환경", "협업에서 내 강점과 마찰 포인트", "나에게 맞는 집중 루틴 설계", "지치지 않는 번아웃 예방법"],
  },
];

// 홈 히어로 캐러셀 슬라이드
export interface HeroSlide {
  kind: "brand" | "product";
  slug?: string;
  badge?: string; // 예: "TOP 1"
  title: string;
  sub: string;
  cta: string;
  href: string;
  image: string; // /images/hero/xxx.jpg (없으면 그라데이션 대체)
  gradient: string;
  emoji: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    kind: "brand",
    title: "문제는 당신이\n아닙니다",
    sub: "방법을 몰랐을 뿐입니다\n3분이면 길이 보입니다",
    cta: "내 무기 찾기",
    href: "#products",
    image: "/images/hero/brand.jpg",
    gradient: "linear-gradient(135deg,#07071F 0%,#2a1248 60%,#FF2F8F 150%)",
    emoji: "⚒️",
  },
  {
    kind: "product",
    slug: "business-marketing",
    badge: "TOP 1",
    title: "안 팔리는 데는\n이유가 있습니다",
    sub: "그 이유를 정확히 짚어드립니다",
    cta: "내 약점 확인하기",
    href: "/landing/business-marketing",
    image: "/images/hero/business-marketing.jpg",
    gradient: "linear-gradient(135deg,#1a0830 0%,#6d28d9 55%,#FF2F8F 140%)",
    emoji: "📊",
  },
  {
    kind: "product",
    slug: "self-discovery",
    badge: "TOP 2",
    title: "당신의 무기를\n아직 모릅니다",
    sub: "남들은 부러워하는 그 강점\n3분 만에 꺼내드립니다",
    cta: "내 강점 찾기",
    href: "/landing/self-discovery",
    image: "/images/hero/self-discovery.jpg",
    gradient: "linear-gradient(135deg,#0b1030 0%,#3b2a7a 55%,#8B5CF6 140%)",
    emoji: "🗝️",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(cat: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === cat);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}
