// ============================================================
//  내 사업 위키 — 시스템의 설계도 (운영자가 여기만 고치면 됨)
//  무기제작소의 본체. 진단은 이 위키의 "빈칸을 채우는 입력 도구"다.
//  - 위키 목차/섹션 정의
//  - 12개 진단 → 위키 섹션 매핑
//  - 섹션별 예시(초안) 생성기
//  - (확장용) 아임웹 상품 추천 CTA 구조
// ============================================================

// ---------- 상태 ----------
export type SectionStatus = "empty" | "draft" | "needs_update" | "complete";

export const STATUS_META: Record<
  SectionStatus,
  { label: string; tone: string; dot: string }
> = {
  empty: { label: "비어 있음", tone: "text-muted bg-app-bg", dot: "bg-line" },
  draft: { label: "초안 있음", tone: "text-purple bg-soft-pink", dot: "bg-purple" },
  needs_update: { label: "업데이트 필요", tone: "text-pink bg-soft-pink", dot: "bg-pink" },
  complete: { label: "완성", tone: "text-emerald-600 bg-emerald-50", dot: "bg-emerald-500" },
};

// ---------- 사업 유형 / 판매 상태 ----------
export type SellingStatus = "none" | "selling";
export type BusinessType = "undecided" | "product" | "service" | "content";

export const BUSINESS_TYPE_LABEL: Record<BusinessType, string> = {
  undecided: "고민중",
  product: "상품",
  service: "서비스",
  content: "콘텐츠",
};
export const BUSINESS_TYPE_ORDER: BusinessType[] = ["undecided", "product", "service", "content"];

export const SELLING_STATUS_LABEL: Record<SellingStatus, string> = {
  none: "팔 것 없음",
  selling: "판매 중",
};
export const SELLING_STATUS_ORDER: SellingStatus[] = ["none", "selling"];

// 과거 저장값(unknown/coaching 등) → 새 유형으로 정규화
export function normalizeBusinessType(v: unknown): BusinessType {
  return (BUSINESS_TYPE_ORDER as string[]).includes(v as string)
    ? (v as BusinessType)
    : "undecided";
}

// ---------- 액션(버튼) ----------
// fill: 이 칸 채우기(에디터 열기) · edit: 초안 수정하기 · example: 예시 생성하기
// related: 관련 문서 만들기(연결된 진단으로) · tool: 도구실(준비 중)
export type WikiActionKind = "fill" | "edit" | "example" | "related" | "tool";

export interface WikiAction {
  label: string;
  kind: WikiActionKind;
}

// ---------- 섹션 정의 ----------
export interface WikiSectionDef {
  id: string;
  num: string; // "1", "7", "7.1"
  title: string;
  parentId?: string; // 퍼널 하위 섹션
  isParent?: boolean; // 7. 판매 흐름 (컨테이너)
  purpose?: string; // 이 칸이 무엇을 정리하는 칸인지 한 줄
  desc?: string; // 이 칸을 왜/어떻게 채우는지 설명 문단
  fields: string[]; // 이 칸에 채울 것(체크리스트)
  template?: string; // 예시) [브랜드명]은 … 작성 형식 문장
  actions: WikiAction[]; // 이 섹션에서 가능한 작업 버튼
  placeholder: string; // 본문 입력 placeholder
}

// 기본 액션 (대부분 섹션 공통)
const DEFAULT_ACTIONS: WikiAction[] = [
  { label: "이 칸 채우기", kind: "fill" },
  { label: "다른 브랜드 예시 확인하기", kind: "example" },
  { label: "관련 문서 만들기", kind: "related" },
];

export const WIKI_SECTIONS: WikiSectionDef[] = [
  {
    id: "overview",
    num: "1",
    title: "개요",
    purpose: "지금 내 사업의 현재 위치를 찍는 칸",
    desc:
      "내가 누구를 돕고, 어떤 문제를 해결하며, 지금 무엇을 팔려고 하는지 정리합니다. 이 칸이 선명해야 뒤에 나오는 고객·차별점·콘텐츠 방향도 흔들리지 않습니다.",
    fields: ["어떤 사업인지", "누구를 위한 사업인지", "어떤 문제를 해결하는지", "어떤 상품·서비스를 다루는지", "현재 어떤 단계인지"],
    template:
      "[사업/브랜드명]은 [이런 문제]를 겪는 [이런 사람]을 위한 [이런 사업]입니다. [상품/서비스]를 통해 [고객이 얻는 결과]를 돕습니다. 현재 [인스타/스마트스토어/홈페이지/오프라인 매장]에서 [준비 중/운영 중/판매 중]입니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 내 사업을 한 문단으로 적어보세요.",
  },
  {
    id: "weapon",
    num: "2",
    title: "내 무기",
    purpose: "내 사업이 선택받는 이유를 정리하는 칸",
    desc:
      "내가 잘하는 것, 남들보다 쉽게 해내는 것, 고객에게 실제로 도움이 되는 강점을 정리합니다. 단순한 장점 목록이 아니라, 내 사업이 왜 선택받을 수 있는지 보여주는 부분입니다.",
    fields: ["핵심 강점(무기)", "그 강점이 생긴 이유", "고객에게 주는 이득", "강점이 드러나는 상품·서비스", "강점을 보여주는 증거"],
    template:
      "[사업/브랜드명]의 핵심 강점은 [대표 강점]입니다. 이 강점은 [상품/서비스/운영 방식]에서 가장 잘 드러납니다. 고객은 이를 통해 [얻는 이득]을 경험할 수 있습니다. 대표적으로 [성과/후기/경험/반복해서 듣는 말]이 있습니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 내 사업의 무기를 적어보세요.",
  },
  {
    id: "product",
    num: "3",
    title: "판매할 것",
    purpose: "지금 팔고 있거나, 가장 먼저 검증할 상품을 정리하는 칸",
    desc:
      "내 사업이 고객에게 제공하는 상품·서비스를 정리합니다. 아직 준비 중이라면 ‘가장 먼저 팔아볼 상품 후보’를, 이미 운영 중이라면 ‘현재 판매 중인 대표 상품’을 적어주세요.",
    fields: ["대표 상품·서비스명", "상품 형태", "대상 고객", "해결하는 문제", "제공 방식", "가격(대)", "현재 상태"],
    template:
      "[사업/브랜드명]의 대표 상품·서비스는 [상품/서비스명]입니다. 이 상품은 [대상 고객]이 [문제]를 해결할 수 있도록 [제공 내용]을 제공합니다. [온라인/오프라인/강의/상품/앱] 방식으로 제공되며, 가격은 [금액/가격대]입니다. 현재 [준비 중/판매 중/검증 중/확장 중]입니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 가장 먼저 검증할 상품을 적어보세요.",
  },
  {
    id: "target",
    num: "4",
    title: "메인 고객",
    purpose: "이 사업이 가장 먼저 설득해야 할 사람을 정리하는 칸",
    desc:
      "내 상품을 가장 필요로 하는 고객이 누구인지 정리합니다. 나이·성별·직업만 적는 게 아니라, 고객이 어떤 상황에서 문제를 느끼고, 무엇을 원하며, 어떤 말로 해결책을 찾는지 적어주세요.",
    fields: ["핵심 고객", "고객이 놓인 상황", "고객이 겪는 문제", "고객이 원하는 결과", "구매 전 망설이는 이유", "고객이 실제로 쓰는 말"],
    template:
      "[사업/브랜드명]의 주요 고객은 [상황]에 있는 [대상 고객]입니다. 이들은 [문제] 때문에 [겪는 불편]을 느끼고 있으며, [원하는 결과]를 원합니다. 구매 전에는 [망설이는 이유]를 확인하고 싶어 합니다. 주로 [고객이 실제로 쓰는 말], [검색어/질문]처럼 표현합니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 가장 먼저 설득할 고객을 적어보세요.",
  },
  {
    id: "diff",
    num: "5",
    title: "차별화 포인트",
    purpose: "고객이 나를 고를 이유를 정리하는 칸",
    desc:
      "고객이 비슷한 선택지 사이에서 왜 내 사업을 골라야 하는지 정리합니다. 단순히 ‘남들과 다른 점’이 아니라, 고객이 중요하게 보는 기준에서 내가 어떤 이유로 선택될 수 있는지 적어주세요.",
    fields: ["고객이 비교하는 대상", "고객이 중요하게 보는 기준", "기존 선택지의 아쉬운 점", "내가 다르게 해결하는 방식", "고객이 얻는 분명한 이득", "차별화를 보여주는 근거", "선택 이유 3가지"],
    template:
      "[사업/브랜드명]의 차별화 기준은 [고객이 중요하게 보는 기준]입니다. 고객은 보통 [기존 선택지]에서 [아쉬운 점]을 느낍니다. [사업/브랜드명]은 이를 [다르게 해결하는 방식]으로 해결합니다. 이 차별화는 [상품/서비스/운영/콘텐츠/후기/성과]에서 드러납니다. 대표적인 선택 이유는 [이유1], [이유2], [이유3]입니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 고객이 나를 고를 이유를 적어보세요.",
  },
  {
    id: "content",
    num: "6",
    title: "브랜드 콘텐츠",
    purpose: "고객에게 어떤 브랜드로 기억될지 정리하는 칸",
    desc:
      "내 사업이 어떤 말·주제·분위기로 기억될지 정리합니다. ‘무엇을 올릴지’가 아니라, 고객이 내 콘텐츠를 보고 어떤 문제를 떠올리고 왜 나를 믿게 되는지까지 정리해보세요.",
    fields: ["콘텐츠 한 줄 방향", "고객이 자주 묻는 질문", "반복해서 다룰 주제", "보여줄 증거", "사용할 포맷", "제목/후킹 방식", "콘텐츠를 보고 하게 할 행동"],
    template:
      "[사업/브랜드명]의 콘텐츠 방향은 [고객이 겪는 문제]를 [브랜드의 관점]으로 풀어주는 것입니다. 주요 주제는 [주제1], [주제2], [주제3]이며, [후기/사례/비교/과정/결과]를 통해 신뢰를 보여줍니다. 콘텐츠는 [릴스/카드뉴스/블로그/뉴스레터/유튜브/스레드] 형식으로 발행하며, 고객이 [다음 행동]을 하도록 돕습니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 내 브랜드 콘텐츠 방향을 적어보세요.",
  },

  // ---------- 7. 판매 흐름 (컨테이너 + 4단계) ----------
  {
    id: "funnel",
    num: "7",
    title: "판매 흐름",
    isParent: true,
    purpose: "고객이 나를 처음 발견하고, 구매하고, 다시 찾기까지의 길",
    desc:
      "고객이 내 사업을 처음 알게 되는 순간부터 실제로 구매하고, 이후 다시 찾아오게 만드는 흐름을 정리합니다. ‘무엇을 홍보할지’가 아니라 고객이 각 단계에서 무엇을 보고, 무엇을 믿고, 무엇 때문에 다음 행동을 하는지 정리하는 칸입니다.",
    fields: [],
    actions: [],
    placeholder: "",
  },
  {
    id: "funnel-awareness",
    num: "7.1",
    title: "알리기 (인지)",
    parentId: "funnel",
    purpose: "고객이 브랜드를 처음 접하는 방식",
    desc: "고객이 어떤 채널에서, 어떤 메시지를 통해 내 브랜드를 처음 알게 되는지 정리합니다.",
    fields: ["처음 노출되는 채널", "처음 보여줄 메시지", "고객이 멈추게 될 문제·상황", "대표 콘텐츠·광고 소재", "처음 유도할 행동"],
    template:
      "[브랜드명]은 [채널]을 통해 [대상 고객]에게 처음 노출됩니다. 주요 메시지는 [고객이 멈추게 될 문제/욕망]이며, [콘텐츠/광고/검색/입소문]을 중심으로 브랜드 인지가 형성됩니다. 초기 유입은 [팔로우/저장/검색/프로필 방문/무료 진단/상세페이지 클릭]으로 이어집니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 고객이 나를 처음 알게 되는 방식을 적어보세요.",
  },
  {
    id: "funnel-interest",
    num: "7.2",
    title: "관심 갖게 하기 (관심)",
    parentId: "funnel",
    purpose: "고객이 더 알아보고 싶어지는 방식",
    desc: "고객이 내 브랜드를 본 뒤, 어떤 정보·콘텐츠를 통해 더 오래 머물고 관심을 갖는지 정리합니다.",
    fields: ["고객이 더 알고 싶어 하는 내용", "관심을 키우는 콘텐츠·페이지", "상품의 핵심 매력", "보여줄 사례·증거", "다음 행동으로 이어지는 장치"],
    template:
      "[브랜드명]은 [관심 콘텐츠/페이지]를 통해 고객이 [상품/서비스]를 더 자세히 이해하도록 만듭니다. 관심을 형성하는 핵심 요소는 [셀링포인트/사례/추천/전후 비교/사용 장면]입니다. 이 흐름은 [상세페이지/프로필/추천 목록/콘텐츠/무료 자료/이벤트]에서 드러납니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 고객의 관심을 키우는 방식을 적어보세요.",
  },
  {
    id: "funnel-consideration",
    num: "7.3",
    title: "혹하게 만들기 (고려)",
    parentId: "funnel",
    purpose: "고객이 검색하고 비교하며 구매 이유를 확인하는 방식",
    desc: "고객이 구매 전 무엇을 확인하고, 어떤 증거를 보고, 비슷한 선택지 중 내 브랜드를 고르게 되는지 정리합니다.",
    fields: ["고객이 검색하는 말", "고객이 비교하는 대상", "구매 전 확인하는 기준", "불안을 줄이는 증거", "나를 선택하게 만드는 이유"],
    template:
      "[브랜드명]은 구매 전 고객이 [비교 기준]을 확인할 수 있도록 [증거 자료]를 제공합니다. 고객은 [비교 대상]과 비교하면서 [가격/후기/결과/신뢰도/편의성/사용법]을 확인합니다. 선택 이유는 [차별화 포인트]와 [구매 전 불안을 줄이는 정보]에서 형성됩니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 고객이 비교·확인하는 방식을 적어보세요.",
  },
  {
    id: "funnel-purchase",
    num: "7.4",
    title: "결정하게 만들기 (구매)",
    parentId: "funnel",
    purpose: "고객이 결제하고 다시 찾아오게 되는 방식",
    desc: "고객이 실제로 구매한 뒤, 어떻게 만족하고 후기·재구매·소개로 이어지는지 정리합니다.",
    fields: ["결제 전 마지막 확신", "결제 후 안내 방식", "사용법·진행 과정 안내", "후기 요청 방식", "재구매·재방문 장치", "단골 관리 방식"],
    template:
      "[브랜드명]은 구매 이후 [안내/혜택/리워드/사용 경험]을 통해 고객 경험을 이어갑니다. 결제 후에는 [안내 메시지/사용법/배송 안내/진행 과정]이 제공되며, 이후 [후기/재구매/구독/리워드/추천]으로 연결됩니다. 이 구조는 [CRM 메시지/멤버십/쿠폰/리워드/커뮤니티/후기 요청]에서 드러납니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 구매·재방문 흐름을 적어보세요.",
  },

  {
    id: "todo",
    num: "8",
    title: "브랜드 최종 방향성",
    purpose: "이 사업이 앞으로 어떤 방향으로 확장될지 정리하는 칸",
    desc:
      "앞에서 정리한 개요·무기·상품·고객·차별화·콘텐츠·고객 여정을 바탕으로 앞으로의 방향을 정리합니다. 단순한 할 일 목록이 아니라, 이 사업이 앞으로 어떤 브랜드로 발전할 수 있는지 정리하는 마지막 문단입니다.",
    fields: ["앞으로 집중할 방향", "확장될 상품·서비스", "더 강화할 고객 경험", "더 선명해질 브랜드 역할", "방향성이 드러나는 영역"],
    template:
      "[브랜드명]의 향후 방향은 [현재 상품/서비스]를 넘어, [더 큰 브랜드 역할]로 확장되는 것입니다. [브랜드명]은 [핵심 방향]을 바탕으로 [상품/서비스/콘텐츠/커뮤니티/기술/고객 경험]을 발전시키고 있습니다. 이 방향은 [대표 상품], [콘텐츠], [운영 방식], [고객 경험]에서 드러납니다.",
    actions: DEFAULT_ACTIONS,
    placeholder: "위 형식을 참고해, 이 브랜드의 최종 방향성을 적어보세요.",
  },
];

// 본문이 들어가는 "잎(leaf)" 섹션 = 완성도 계산 대상 (7.판매퍼널 컨테이너 제외)
export const LEAF_SECTIONS = WIKI_SECTIONS.filter((s) => !s.isParent);

export function getSection(id: string): WikiSectionDef | undefined {
  return WIKI_SECTIONS.find((s) => s.id === id);
}

// ============================================================
//  12개 진단 → 위키 섹션 매핑
//  진단은 "섹션을 채우는 도구". 진단을 완료하면 해당 섹션이 초안 상태가 된다.
//  (운영자가 여기만 고치면 진단-섹션 연결을 바꿀 수 있다)
// ============================================================
export const TEST_TO_SECTIONS: Record<string, string[]> = {
  "self-discovery": ["weapon"], // 자기 발견 → 내 무기
  purpose: ["overview"], // 목적 발견 → 개요
  "business-item": ["product"], // 사업 아이템 발굴 → 판매 상품·서비스
  // 사업 전략·마케팅 = "어디가 새는지(병목)" 진단 → 타겟 + 판매 흐름 전 구간
  "business-marketing": ["target", "funnel-awareness", "funnel-interest", "funnel-consideration", "funnel-purchase"],
  "content-strategy": ["content"], // 콘텐츠 전략 → 브랜드 콘텐츠
  differentiation: ["diff"], // 차별화 진단 → 차별화 칸
  priority: ["todo"], // 브랜드 방향성(실행 우선순위 리튜닝) → 브랜드 최종 방향성 칸
  // ad-conversion: 위키 추천에서 제외. 진단 앱엔 선택 도구로 남김.
};

// 섹션 id → 그 칸을 채워주는 진단 slug 목록 (역매핑, 자동 계산)
export function getTestsForSection(sectionId: string): string[] {
  return Object.entries(TEST_TO_SECTIONS)
    .filter(([, secs]) => secs.includes(sectionId))
    .map(([slug]) => slug);
}

// ============================================================
//  섹션 예시(초안) 생성기 — "예시 생성하기" 버튼
//  유료/AI 확장 전까지, 채워진 진단 프로필이 있으면 살짝 개인화한다.
// ============================================================
export interface ExampleContext {
  title?: string; // 사업 이름
  typeName?: string; // 통합 프로필 유형명 (있으면)
  typeOneLine?: string; // 유형 한 줄
  offerName?: string; // 추천 첫 상품명 (offerEngine)
  contentTitle?: string; // 추천 콘텐츠 제목 (contentEngine)
}

type ExampleFn = (c: ExampleContext) => string;

// 다른 브랜드는 이 칸을 어떻게 채웠는지 보여주는 참고 예시 (유명 브랜드 기준).
const EXAMPLES: Record<string, ExampleFn> = {
  overview: () =>
    "배달의민족은 음식을 주문하려는 사람과 음식을 판매하는 가게를 연결하는 배달 주문 서비스다. 사용자는 앱에서 주변 음식점을 찾고, 메뉴를 고른 뒤 배달이나 포장 주문을 할 수 있다. 음식점은 배달의민족을 통해 더 많은 고객에게 가게와 메뉴를 알리고 주문을 받을 수 있다.",
  weapon: () =>
    "쿠팡의 핵심 무기는 빠른 배송을 가능하게 하는 물류 운영입니다. 이 강점은 로켓배송, 물류센터, 배송 네트워크에서 가장 잘 드러납니다. 쿠팡을 통해 고객은 필요한 상품을 더 빠르고 편하게 받아볼 수 있으며, 이는 쿠팡이 일반 온라인 쇼핑몰과 구분되는 대표적인 특징이다.",
  product: () =>
    "스타벅스의 대표 판매 상품은 커피 음료, 푸드, 시즌 상품이다. 고객은 매장에서 음료와 푸드를 주문하거나, 시즌마다 출시되는 텀블러·머그 등 상품을 구매할 수 있다. 주요 상품군은 음료·푸드·상품으로 나뉘며, 매장과 앱을 중심으로 판매된다.",
  target: () =>
    "당근마켓의 주요 고객은 집 근처에서 중고 물건을 사고팔거나 동네 정보를 얻고 싶은 사람들입니다. 이들은 멀리 이동하거나 복잡한 택배 거래를 하기보다, 가까운 사람과 빠르고 편하게 거래하기를 원합니다. 구매 전에는 물건 상태, 거래 장소, 판매자 신뢰도, 가격이 적당한지 확인하고 싶어 합니다. 주로 ‘동네 중고거래’, ‘근처에서 바로 살 수 있는 물건’, ‘직거래 가능한 사람’ 같은 말로 해결책을 찾습니다.",
  diff: () =>
    "이케아의 차별화 기준은 좋은 디자인, 낮은 가격, 직접 조립하는 구매 경험입니다. 고객은 보통 예쁜 가구는 비싸고, 저렴한 가구는 디자인이 아쉽다고 느낍니다. 이케아는 플랫팩 포장, 셀프 운반, 직접 조립 방식으로 가격을 낮추고, 고객이 가구를 완성하는 과정에 참여하게 만듭니다. 이 차별화는 조립식 가구, 대형 쇼룸, 플랫팩 포장, 합리적인 가격대에서 드러납니다. 대표적인 선택 이유는 ① 낮은 가격 ② 실용적인 디자인 ③ 내가 직접 완성하는 경험입니다.",
  content: () =>
    "오늘의집의 콘텐츠 방향은 집을 꾸미고 싶은 사람이 실제 집 사례를 보며 자기 공간에 적용할 수 있게 돕는 것입니다. 주요 주제는 집들이, 공간별 인테리어, 수납 아이디어, 제품 활용 사례이며, 실제 사용자 사진과 구매 가능한 상품 정보를 함께 보여줍니다. 콘텐츠는 앱, 인스타그램, 유튜브, 커뮤니티 게시물 형식으로 제공되며, 고객이 마음에 드는 공간을 저장하고 관련 상품을 찾아보도록 돕습니다.",
  "funnel-awareness": () =>
    "나이키는 광고 캠페인, 스포츠 선수, SNS 콘텐츠를 통해 도전과 운동의 메시지를 반복적으로 노출하는 브랜드다. 제품 자체보다 ‘움직이게 만드는 태도’를 먼저 전달하며, 이를 통해 운동을 시작하거나 자신을 밀어붙이고 싶은 사람들에게 강하게 인식된다. 이는 캠페인 영상, 선수 협업, 슬로건, 스포츠 문화 콘텐츠를 통해 드러난다.",
  "funnel-interest": () =>
    "넷플릭스는 개인화 추천, 썸네일, 예고편, 인기 순위 등을 통해 사용자가 볼만한 콘텐츠를 계속 탐색하게 만드는 구조를 갖고 있다. 사용자는 처음 접한 작품 하나에서 출발해 비슷한 장르·배우·취향 기반 추천 콘텐츠로 이동하며 관심을 이어간다. 이 관심 형성 구조는 홈 화면 추천 목록, 작품 상세 페이지, 자동 재생 예고편, 시청 기록 기반 추천에서 드러난다.",
  "funnel-consideration": () =>
    "아마존은 상품 상세페이지에서 고객이 구매 전 필요한 비교 정보를 한곳에 모아 보여주는 구조를 갖고 있다. 별점, 리뷰, 사진 후기, 구매 인증, 배송 정보, 반품 가능 여부 등이 함께 제공되며, 사용자는 비슷한 상품을 비교하면서 구매 여부를 판단한다. 이 비교 구조는 리뷰 시스템, 상품 랭킹, 추천 상품, 배송·반품 정보, Q&A 영역에서 드러난다.",
  "funnel-purchase": () =>
    "맥도날드는 앱 주문, 쿠폰, 리워드 포인트를 통해 구매 이후에도 고객이 다시 방문할 이유를 만드는 구조를 갖고 있다. 사용자는 주문 과정에서 혜택을 확인하고, 구매 후 포인트를 적립하며, 적립된 보상을 다시 사용할 수 있다. 이 재방문 구조는 모바일 앱, 쿠폰, 포인트 리워드, 기간 한정 프로모션에서 드러난다.",
  todo: () =>
    "레고의 향후 방향은 단순한 장난감 판매를 넘어, 놀이를 통해 아이들의 창의력과 문제 해결력을 키우는 브랜드로 확장되는 것이다. 레고는 ‘미래의 건설가에게 영감을 주고 성장시킨다’는 방향 아래 제품, 교육, 지속가능성, 디지털 놀이 경험을 함께 발전시키고 있다. 이 방향은 브릭 제품, 교육 프로그램, 지속가능한 소재 개발, 안전한 디지털 놀이 환경에서 드러난다.",
};

export function generateExample(sectionId: string, ctx: ExampleContext = {}): string {
  const fn = EXAMPLES[sectionId];
  return fn ? fn(ctx) : "";
}

// ============================================================
//  불편함 노트 → 상품/콘텐츠 아이디어 제안 (로컬 템플릿, AI 토큰 0)
//  발견한 불편함/누가/왜 불만족 필드를 조합해 바로 쓸 수 있는 제안을 만든다.
// ============================================================
export interface NoteSeed {
  discomfort: string;
  who?: string;
  whyUnsatisfied?: string;
}

export interface NoteIdea {
  kind: "상품" | "서비스" | "콘텐츠" | "차별점";
  emoji: string;
  text: string;
}

export function ideasFromNote(n: NoteSeed): NoteIdea[] {
  const problem = (n.discomfort || "이 불편함").trim().replace(/\.$/, "");
  const who = (n.who || "").trim();
  const target = who || "이걸 겪는 사람";
  const gap = (n.whyUnsatisfied || "").trim();

  return [
    {
      kind: "상품",
      emoji: "🛍️",
      text: `${target}를 위한 "${problem}" 해결 템플릿·키트 (한 번 만들어 반복 판매)`,
    },
    {
      kind: "서비스",
      emoji: "🎓",
      text: `"${problem}"를 30분 안에 같이 푸는 1:1 점검 세션`,
    },
    {
      kind: "콘텐츠",
      emoji: "✍️",
      text: `"${problem}, 이렇게 해결했습니다" 사례 글/영상으로 ${target} 모으기`,
    },
    {
      kind: "차별점",
      emoji: "💡",
      text: gap
        ? `기존 방법은 "${gap}" → 바로 그 지점을 없앤 버전으로 차별화`
        : `가장 번거로운 한 단계를 자동화·대행해 주는 버전으로 차별화`,
    },
  ];
}

// ============================================================
//  불편함 → 사업으로 바꾸는 길 (정적 가이드) + 창작자 명언 (팩트 기반)
//  매번 같은 템플릿 대신, 발상을 자극하는 안내북 + 출처 있는 격언.
// ============================================================
export interface IdeaPath {
  emoji: string;
  title: string;
  how: string; // 한 줄 요약(무엇을 만들어 판매하는지)
  essence: string; // 본질: 무엇을 무엇으로 바꾸는 방법인지
  difficulty: "하" | "중" | "상";
  types: string; // 종류 예시
}

export const IDEA_PATHS: IdeaPath[] = [
  {
    emoji: "📝",
    title: "콘텐츠 · 교육으로",
    how: "내가 알고 있는 정보, 경험, 시행착오를 글·영상·강의로 정리해 판매",
    essence: "머릿속 지식과 경험을 ‘배울 수 있는 형태’로 바꾸는 방법",
    difficulty: "하",
    types: "전자책, 강의, 온라인 코스, 웨비나, 유튜브/인스타 콘텐츠, 뉴스레터",
  },
  {
    emoji: "💾",
    title: "디지털 제품 · 템플릿으로",
    how: "반복해서 쓰는 과정, 기준, 양식, 체크리스트를 파일로 만들어 판매",
    essence: "내가 매번 하던 일을 ‘남도 바로 따라 쓸 수 있는 도구’로 바꾸는 방법",
    difficulty: "중",
    types: "노션 템플릿, 엑셀 시트, 체크리스트, 가이드북, 프롬프트팩, 업무 양식, 계산기",
  },
  {
    emoji: "👥",
    title: "커뮤니티 · 멤버십으로",
    how: "같은 문제를 가진 사람들을 모아 정보, 피드백, 동기부여, 연결을 제공",
    essence: "혼자 해결하기 어려운 불편을 ‘함께 해결하는 환경’으로 바꾸는 방법",
    difficulty: "중",
    types: "유료 단톡방, 멤버십, 스터디, 챌린지, 정기 모임, 구독형 커뮤니티",
  },
  {
    emoji: "🛠️",
    title: "툴 · 자동화 기능으로",
    how: "반복되는 불편, 귀찮은 작업, 시간이 오래 걸리는 과정을 자동화해 판매",
    essence: "사람이 직접 하던 일을 ‘버튼 한 번으로 해결되는 시스템’으로 바꾸는 방법",
    difficulty: "상",
    types: "자동화 봇, 웹사이트, 어플, 예약/분석/정리 자동화",
  },
  {
    emoji: "👨‍🏫",
    title: "1:1 코칭 · 컨설팅으로",
    how: "상대의 상황을 직접 보고 문제를 진단한 뒤 맞춤 해결책을 제공",
    essence: "일반 정보를 ‘한 사람에게 딱 맞는 해답’으로 바꾸는 방법",
    difficulty: "중",
    types: "1:1 코칭, 컨설팅, 피드백 세션, 전략 설계, 맞춤 실행 플랜",
  },
  {
    emoji: "📦",
    title: "실물 · 하이브리드 제품으로",
    how: "눈에 보이지 않는 불편을 실제로 쓰고 만질 수 있는 상품으로 만들어 판매",
    essence: "해결책을 ‘손에 잡히는 경험’으로 바꾸는 방법",
    difficulty: "중",
    types: "키트, 워크북, 굿즈, 실물 교재, 실물 상품 패키지",
  },
];

export interface CreatorQuote {
  text: string;
  author: string;
  source: string;
}

// 출처가 분명한 격언만 (창의 = 조합 / 불편 = 기회 테마)
export const CREATOR_QUOTES: CreatorQuote[] = [
  {
    text: "아이디어는 낡은 요소들의 새로운 조합일 뿐이다.",
    author: "제임스 웹 영",
    source: "『아이디어 생산법』(1939)",
  },
  {
    text: "창의성은 그저 무언가를 연결하는 것이다.",
    author: "스티브 잡스",
    source: "Wired 인터뷰(1996)",
  },
  {
    text: "필요는 발명의 어머니다.",
    author: "서양 속담",
    source: "오래된 격언",
  },
  {
    text: "사람들은 드릴이 아니라 ‘구멍’을 원한다.",
    author: "시어도어 레빗",
    source: "하버드 마케팅, 널리 인용",
  },
  {
    text: "고객은 제품을 ‘고용’해 자신의 할 일을 해결한다.",
    author: "클레이튼 크리스텐슨",
    source: "‘할 일(Jobs to be Done)’ 이론",
  },
];

// notes 개수 등으로 결정적으로 한 개 고르기 (랜덤 → 하이드레이션 불일치 방지)
export function pickQuote(seed: number): CreatorQuote {
  return CREATOR_QUOTES[((seed % CREATOR_QUOTES.length) + CREATOR_QUOTES.length) % CREATOR_QUOTES.length];
}

// ============================================================
//  (확장용) 아임웹 상품 추천 CTA 구조
//  이번 작업에서는 실제 결제를 붙이지 않는다. 구조만 남긴다.
//  triggerSectionId 가 비어 있거나 약할 때, 외부 판매 페이지로 보낼 추천.
// ============================================================
export interface StoreRecommendation {
  id: string;
  triggerSectionId: string; // 어떤 섹션을 채울 때 노출할지
  condition: "empty" | "draft" | "always"; // 노출 조건
  title: string;
  description: string;
  productType: "ebook" | "bootcamp" | "coaching" | "academy" | "tool";
  externalUrl: string; // 아임웹/퍼블 결제 페이지 (지금은 placeholder)
  ctaLabel: string;
}

// 지금은 비활성 placeholder. 운영 시 externalUrl/문구만 채우면 노출된다.
export const STORE_RECOMMENDATIONS: StoreRecommendation[] = [
  {
    id: "rec-product-ebook",
    triggerSectionId: "product",
    condition: "empty",
    title: "첫 상품, 막막하다면",
    description: "맨손에서 첫 상품을 만든 1인 사업가들의 설계법을 정리한 전자책",
    productType: "ebook",
    externalUrl: "", // 예: https://your-imweb-store.com/ebook
    ctaLabel: "전자책 살펴보기",
  },
  {
    id: "rec-funnel-bootcamp",
    triggerSectionId: "funnel",
    condition: "draft",
    title: "퍼널을 끝까지 완성하고 싶다면",
    description: "인지부터 구매까지, 4주 안에 판매 퍼널을 세우는 부트캠프",
    productType: "bootcamp",
    externalUrl: "",
    ctaLabel: "부트캠프 알아보기",
  },
];

export function getStoreRecommendation(
  sectionId: string,
  status: SectionStatus
): StoreRecommendation | undefined {
  return STORE_RECOMMENDATIONS.find(
    (r) =>
      r.triggerSectionId === sectionId &&
      (r.condition === "always" ||
        (r.condition === "empty" && status === "empty") ||
        (r.condition === "draft" && status === "draft"))
  );
}
