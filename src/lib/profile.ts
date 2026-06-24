// ============================================================
//  통합 무기 프로필 — 시스템의 두뇌
//  운영자는 이 파일의 JSON만 수정하면 유형/무기/문구/성공패턴을 바꿀 수 있다.
// ============================================================

export type ProfileTypeId =
  | "inventor"
  | "strategist"
  | "seller"
  | "interpreter"
  | "executor"
  | "connector"
  | "creator"
  | "craftsman";

export interface ProfileType {
  id: ProfileTypeId;
  name: string; // 발명가형
  emoji: string;
  oneLine: string; // 헤더 한 줄
  free: string; // 무료 공개 요약 (대표 유형 설명)
  traits: string[]; // 무료: 이 유형의 특징 4가지 ("어 나 이런데")
  shine: string; // 무료: 강점이 빛나는 순간
  shade: string; // 무료: 약점이 나오는 순간
  task: string; // 지금 가장 중요한 과제 한 줄
  strengths: string[]; // 핵심 무기 후보
  failurePatterns: string[]; // 망하는 패턴 (유료)
  moneyRoute: string; // 돈 버는 방식 (유료)
  thirtyDayPlan: string[]; // 30일 액션 4주 (유료)
  successPatternId: string; // 연결된 성공 패턴
}

// ---------- 8유형 ----------
export const PROFILE_TYPES: Record<ProfileTypeId, ProfileType> = {
  inventor: {
    id: "inventor",
    name: "발명가형",
    emoji: "💡",
    oneLine: "없던 걸 만들어내는 사람",
    free: "당신은 새로운 아이디어와 구조를 만드는 데 강합니다. 다만 너무 많은 가능성을 동시에 붙잡을 때 성장이 멈춥니다. 지금 가장 중요한 건 더 만드는 것이 아니라 하나를 골라 시장에 던지는 것입니다.",
    traits: [
      "머릿속에 늘 새 아이디어가 떠다닙니다",
      "남들이 못 보는 각도를 먼저 봅니다",
      "익숙한 방식보다 새 방식에 끌립니다",
      "시작은 잘하는데 마무리가 약합니다",
    ],
    shine: "아무도 안 한 빈 공간에서 0을 1로 만들 때",
    shade: "정해진 일을 반복하거나 끝까지 밀어야 할 때",
    task: "벌여둔 것 중 하나만 골라 시장에 던지기",
    strengths: ["아이디어 발상", "문제 재정의", "차별화 설계"],
    failurePatterns: [
      "새 프로젝트를 계속 추가하다 하나도 못 끝냅니다",
      "완벽해질 때까지 출시를 미룹니다",
      "만들기는 좋아하는데 파는 것을 회피합니다",
    ],
    moneyRoute: "작은 유료상품 → 사례 확보 → 콘텐츠화 → 강의·구독",
    thirtyDayPlan: [
      "1주차 · 벌여둔 아이디어 중 팔 것 하나만 확정합니다",
      "2주차 · 그 고객의 문제 콘텐츠 10개를 발행합니다",
      "3주차 · 무료 상담 5명을 모집합니다",
      "4주차 · 29,000원 유료상품을 테스트합니다",
    ],
    successPatternId: "build_to_education",
  },
  strategist: {
    id: "strategist",
    name: "전략가형",
    emoji: "🧠",
    oneLine: "복잡함을 구조로 푸는 사람",
    free: "당신은 흩어진 문제를 구조로 정리하고 최적의 길을 설계하는 데 강합니다. 다만 완벽한 계획을 기다리다 실행이 늦어질 때 기회를 놓칩니다. 지금 필요한 건 더 분석하는 것이 아니라 70%에서 출발하는 것입니다.",
    traits: [
      "복잡한 걸 보면 정리하고 싶어집니다",
      "감보다 근거와 데이터를 믿습니다",
      "큰 그림과 우선순위를 잘 봅니다",
      "확신이 설 때까지 실행을 미룹니다",
    ],
    shine: "복잡한 문제를 쪼개 최적의 길을 설계할 때",
    shade: "정보가 부족한 채 즉흥적으로 결정해야 할 때",
    task: "분석을 멈추고 70%에서 일단 실행하기",
    strengths: ["구조화 사고", "수익 구조 설계", "우선순위 판단"],
    failurePatterns: [
      "계획만 정교해지고 실행이 안 됩니다",
      "완벽한 데이터를 기다리다 타이밍을 놓칩니다",
      "혼자 설계만 하고 사람을 안 끌어들입니다",
    ],
    moneyRoute: "전문성 정리 → 컨설팅·자문 → 지식 상품 → 시스템화",
    thirtyDayPlan: [
      "1주차 · 풀고 싶은 문제 하나를 1장으로 정리합니다",
      "2주차 · 해결안을 실제 1명에게 적용해 봅니다",
      "3주차 · 결과를 사례로 정리해 공개합니다",
      "4주차 · 유료 자문 1건을 받아 검증합니다",
    ],
    successPatternId: "expert_to_consulting",
  },
  seller: {
    id: "seller",
    name: "판매가형",
    emoji: "🎯",
    oneLine: "원하는 사람에게 정확히 파는 사람",
    free: "당신은 누가 무엇을 원하는지 읽고 사게 만드는 데 강합니다. 다만 좋은 상품 없이 파는 기술만으로는 오래가지 못합니다. 지금 필요한 건 한 번 팔고 끝이 아니라 다시 사게 만드는 구조입니다.",
    traits: [
      "사람들이 무엇에 지갑을 여는지 감이 옵니다",
      "설득하고 파는 일이 어렵지 않습니다",
      "반응과 숫자를 보며 빠르게 고칩니다",
      "상품보다 파는 기술에 의존할 때가 있습니다",
    ],
    shine: "원하는 사람을 정확히 골라 사게 만들 때",
    shade: "팔 것이 약하거나 신뢰를 길게 쌓아야 할 때",
    task: "잘 팔리는 상품 하나의 재구매 구조 만들기",
    strengths: ["시장 포착", "타겟 정의", "전환 설계"],
    failurePatterns: [
      "한 번 팔고 끝나는 일회성 판매에 머뭅니다",
      "단가가 낮은 박리다매에 갇힙니다",
      "신뢰 자산 없이 광고에만 의존합니다",
    ],
    moneyRoute: "잘 팔리는 상품 → 전환 최적화 → 광고 확장 → 재구매·구독",
    thirtyDayPlan: [
      "1주차 · 가장 잘 팔리는 상품 하나를 정합니다",
      "2주차 · 상세페이지 전환 동선을 다시 짭니다",
      "3주차 · 작은 광고로 반응을 테스트합니다",
      "4주차 · 재구매 제안 1개를 붙입니다",
    ],
    successPatternId: "product_to_ads",
  },
  interpreter: {
    id: "interpreter",
    name: "해석가형",
    emoji: "🔍",
    oneLine: "복잡한 것을 쉽게 풀어내는 사람",
    free: "당신은 어려운 것을 쉽게 풀고 메시지를 또렷하게 만드는 데 강합니다. 다만 자기 언어에만 갇히면 사람들이 못 알아듣습니다. 지금 필요한 건 더 깊이 아는 것이 아니라 고객의 언어로 바꾸는 것입니다.",
    traits: [
      "어려운 걸 쉽게 설명하는 걸 잘합니다",
      "핵심을 한 문장으로 뽑아냅니다",
      "글이나 말로 풀어내는 게 편합니다",
      "정보는 많은데 행동은 덜 부릅니다",
    ],
    shine: "복잡한 것을 누구나 알아듣게 풀어낼 때",
    shade: "내 언어에 갇혀 고객 말로 못 바꿀 때",
    task: "내 언어를 고객의 언어로 바꾸기",
    strengths: ["통찰 도출", "메시지 명료화", "콘텐츠 언어화"],
    failurePatterns: [
      "고객 언어 대신 자기 언어만 씁니다",
      "정보는 많은데 행동을 안 부릅니다",
      "콘텐츠는 쌓이는데 상품이 없습니다",
    ],
    moneyRoute: "콘텐츠 → 신뢰 → 진단·컨설팅 → 강의·구독",
    thirtyDayPlan: [
      "1주차 · 고객이 쓰는 말로 주제 10개를 적습니다",
      "2주차 · 그 말로 콘텐츠 10개를 발행합니다",
      "3주차 · 반응 좋은 주제로 무료 강의를 엽니다",
      "4주차 · 29,000원 유료 강의를 테스트합니다",
    ],
    successPatternId: "build_to_education",
  },
  executor: {
    id: "executor",
    name: "실행가형",
    emoji: "🔥",
    oneLine: "일단 해내고야 마는 사람",
    free: "당신은 생각보다 행동이 빠르고 결과를 만들어내는 데 강합니다. 다만 방향 점검 없이 달리면 빠르게 헛수고합니다. 지금 필요한 건 더 빨리 가는 것이 아니라 옳은 산을 오르는 것입니다.",
    traits: [
      "생각보다 손이 먼저 움직입니다",
      "일단 해보면서 배우는 편입니다",
      "결과가 빨리 나와야 신이 납니다",
      "방향 점검 없이 달릴 때가 있습니다",
    ],
    shine: "남들이 고민할 때 먼저 시작해 결과를 낼 때",
    shade: "느리게 쌓이거나 오래 인내해야 할 때",
    task: "달리기 전에 옳은 방향부터 확인하기",
    strengths: ["실행 추진", "즉시 실행", "속도전"],
    failurePatterns: [
      "방향 없이 달려 헛수고합니다",
      "새것이 보이면 하던 걸 두고 갈아탑니다",
      "바쁨과 성과를 구분하지 못합니다",
    ],
    moneyRoute: "빠른 실행 → 실전 데이터 → 되는 것 집중 → 확장",
    thirtyDayPlan: [
      "1주차 · 끌리는 것 하나만 남기고 나머지는 봉인합니다",
      "2주차 · 7일 안에 파는 최소 버전을 출시합니다",
      "3주차 · 안 되면 갈아타지 말고 한 번 더 개선합니다",
      "4주차 · 30일 완주 결과를 기록합니다",
    ],
    successPatternId: "product_to_ads",
  },
  connector: {
    id: "connector",
    name: "연결가형",
    emoji: "🤝",
    oneLine: "사람을 모으고 잇는 사람",
    free: "당신은 사람의 마음을 읽고 모으는 데 강합니다. 다만 사람만 모으고 수익 구조가 없으면 지칩니다. 지금 필요한 건 더 친해지는 것이 아니라 모인 사람에게 무엇을 줄지 정하는 것입니다.",
    traits: [
      "사람들이 당신 주변에 잘 모입니다",
      "분위기와 상대 마음을 빨리 읽습니다",
      "혼자보다 함께할 때 힘이 납니다",
      "남 챙기다 내 것을 못 만들곤 합니다",
    ],
    shine: "사람을 모으고 분위기를 만들어 연결할 때",
    shade: "혼자 묵묵히 숫자나 기술을 파야 할 때",
    task: "모인 사람에게 팔 것 하나 정하기",
    strengths: ["공감 연결", "커뮤니티 운영", "협업 시너지"],
    failurePatterns: [
      "사람은 모이는데 파는 게 없습니다",
      "남 챙기다 내 것을 못 만듭니다",
      "관계는 넓은데 수익으로 안 이어집니다",
    ],
    moneyRoute: "커뮤니티 → 신뢰 → 교육·모임 → 멤버십",
    thirtyDayPlan: [
      "1주차 · 내가 가장 잘 모을 사람을 한 문장으로 정합니다",
      "2주차 · 무료 모임으로 30명을 모읍니다",
      "3주차 · 그 안에서 유료로 원할 것 1개를 테스트합니다",
      "4주차 · 소액 멤버십을 열어 검증합니다",
    ],
    successPatternId: "community_to_membership",
  },
  creator: {
    id: "creator",
    name: "크리에이터형",
    emoji: "🎬",
    oneLine: "표현으로 사람을 끌어모으는 사람",
    free: "당신은 콘텐츠와 표현으로 시선을 모으는 데 강합니다. 다만 조회수만 좇으면 돈으로 안 이어집니다. 지금 필요한 건 더 터뜨리는 것이 아니라 팬을 고객으로 바꾸는 것입니다.",
    traits: [
      "시선을 끄는 표현 감각이 있습니다",
      "트렌드를 남보다 빨리 캐치합니다",
      "보여주고 표현하는 일이 즐겁습니다",
      "조회수는 나오는데 매출은 약합니다",
    ],
    shine: "콘텐츠와 표현으로 사람을 끌어모을 때",
    shade: "팬을 고객으로 바꾸는 동선을 짜야 할 때",
    task: "조회수를 매출 동선으로 잇기",
    strengths: ["후킹", "트렌드 감각", "비주얼 연출"],
    failurePatterns: [
      "조회수는 나오는데 매출이 없습니다",
      "유행만 좇다 시그니처가 안 생깁니다",
      "팬을 고객으로 바꾸는 동선이 없습니다",
    ],
    moneyRoute: "콘텐츠 → 팬덤 → 자체 상품·협찬 → 멤버십",
    thirtyDayPlan: [
      "1주차 · 시그니처 포맷 하나를 정합니다",
      "2주차 · 그 포맷으로 8개를 발행합니다",
      "3주차 · 프로필에 구매 동선을 답니다",
      "4주차 · 소액 자체 상품을 테스트합니다",
    ],
    successPatternId: "content_to_brand",
  },
  craftsman: {
    id: "craftsman",
    name: "장인형",
    emoji: "🛠️",
    oneLine: "꾸준함으로 쌓아 올리는 사람",
    free: "당신은 꾸준함과 완성도로 자산을 쌓는 데 강합니다. 다만 방향 없이 꾸준하면 제자리입니다. 지금 필요한 건 더 열심히가 아니라 무엇을 쌓을지 정하는 것입니다.",
    traits: [
      "한번 시작하면 꾸준히 이어갑니다",
      "대충보다 완성도를 중요하게 봅니다",
      "묵묵히 실력을 쌓는 걸 좋아합니다",
      "방향 없이 열심히만 할 때가 있습니다",
    ],
    shine: "꾸준함과 완성도로 자산을 쌓아 올릴 때",
    shade: "무엇을 쌓을지 방향이 흐릿할 때",
    task: "무엇을 쌓을지 한 방향 정하기",
    strengths: ["꾸준한 발행", "완성도", "역량 숙련"],
    failurePatterns: [
      "방향 없이 꾸준해 제자리걸음입니다",
      "완성도에 집착해 출시가 느립니다",
      "쌓기만 하고 알리지 않습니다",
    ],
    moneyRoute: "꾸준한 콘텐츠·실력 → 검색 자산 → 자동 유입 → 상품·구독",
    thirtyDayPlan: [
      "1주차 · 쌓을 주제 하나를 정합니다",
      "2주차 · 같은 주제로 8개를 발행합니다",
      "3주차 · 가장 반응 좋은 1개를 상품 씨앗으로 잡습니다",
      "4주차 · 소액 상품을 테스트합니다",
    ],
    successPatternId: "content_to_brand",
  },
};

// ---------- 성공 패턴 (더미, 실제 인물명 전 임시) ----------
export interface SuccessPattern {
  id: string;
  title: string;
  fitTypes: ProfileTypeId[];
  summary: string;
  warning: string;
  firstAction: string;
}

export const SUCCESS_PATTERNS: Record<string, SuccessPattern> = {
  build_to_education: {
    id: "build_to_education",
    title: "콘텐츠 → 교육화 루트",
    fitTypes: ["inventor", "interpreter", "creator"],
    summary: "콘텐츠로 신뢰를 만들고 진단·컨설팅·강의로 수익화하는 패턴입니다. 만드는 능력이 강한 유형이 가장 빠르게 자리 잡습니다.",
    warning: "콘텐츠만 만들고 상품을 안 만들면 돈이 안 됩니다.",
    firstAction: "무료 콘텐츠 10개보다 29,000원짜리 작은 상품 1개를 먼저 만드세요.",
  },
  expert_to_consulting: {
    id: "expert_to_consulting",
    title: "전문성 → 컨설팅 루트",
    fitTypes: ["strategist", "craftsman"],
    summary: "쌓아온 전문성을 1:1 자문·컨설팅으로 비싸게 팔고, 그 사례를 지식 상품으로 확장하는 패턴입니다.",
    warning: "준비만 하다 시작을 미루면 전문성이 돈이 되지 않습니다.",
    firstAction: "지금 실력의 70%로 유료 자문 1건을 먼저 받아보세요.",
  },
  product_to_ads: {
    id: "product_to_ads",
    title: "상품 → 광고 확장 루트",
    fitTypes: ["seller", "executor"],
    summary: "잘 팔리는 상품 하나를 만들고 전환을 최적화한 뒤 광고로 키우는 패턴입니다. 실행과 판매가 강한 유형에 맞습니다.",
    warning: "전환 구조 없이 광고부터 키우면 돈만 태웁니다.",
    firstAction: "광고 전에 상세페이지 전환율부터 1.5배로 올리세요.",
  },
  community_to_membership: {
    id: "community_to_membership",
    title: "커뮤니티 → 멤버십 루트",
    fitTypes: ["connector"],
    summary: "사람을 먼저 모으고 신뢰를 쌓은 뒤 교육·멤버십으로 수익화하는 패턴입니다.",
    warning: "모으기만 하고 팔 것을 안 정하면 번아웃이 옵니다.",
    firstAction: "무료 모임 안에서 소액 유료 모임 1개를 먼저 열어보세요.",
  },
  content_to_brand: {
    id: "content_to_brand",
    title: "콘텐츠 → 퍼스널 브랜드 루트",
    fitTypes: ["creator", "craftsman", "interpreter"],
    summary: "꾸준한 콘텐츠로 팬덤을 쌓고 자체 상품·구독으로 잇는 패턴입니다.",
    warning: "조회수만 좇고 구매 동선이 없으면 매출로 안 이어집니다.",
    firstAction: "다음 콘텐츠부터 끝에 다음 행동(저장·링크·상품) 1개를 넣으세요.",
  },
};

// ---------- 차원(dim) → {유형, 무기} 매핑 ----------
// 모든 진단의 차원 키를 8유형으로 연결한다. (운영자가 여기만 고치면 됨)
export interface DimMap {
  type: ProfileTypeId;
  weapon: string;
}
export const DIM_MAP: Record<string, DimMap> = {
  // inventor
  idea: { type: "inventor", weapon: "아이디어 발상" },
  diff: { type: "inventor", weapon: "차별화 설계" },
  freedom: { type: "inventor", weapon: "틀 깨기" },
  desire: { type: "inventor", weapon: "열정 동력" },
  strength: { type: "inventor", weapon: "전문성 무기화" },
  // strategist
  logic: { type: "strategist", weapon: "구조화 사고" },
  model: { type: "strategist", weapon: "수익 구조 설계" },
  data: { type: "strategist", weapon: "데이터 해석" },
  plan: { type: "strategist", weapon: "콘텐츠 기획" },
  structure: { type: "strategist", weapon: "체계 설계" },
  impact: { type: "strategist", weapon: "우선순위 판단" },
  // seller
  market: { type: "seller", weapon: "시장 포착" },
  target: { type: "seller", weapon: "타겟 정의" },
  targeting: { type: "seller", weapon: "정밀 타겟팅" },
  channel: { type: "seller", weapon: "유입 채널 운영" },
  landing: { type: "seller", weapon: "전환 설계" },
  offer: { type: "seller", weapon: "오퍼 설계" },
  funnel: { type: "seller", weapon: "퍼널 설계" },
  convert: { type: "seller", weapon: "고객 전환" },
  // interpreter
  insight: { type: "interpreter", weapon: "통찰 도출" },
  clarity: { type: "interpreter", weapon: "메시지 명료화" },
  concept: { type: "interpreter", weapon: "컨셉 정의" },
  content: { type: "interpreter", weapon: "콘텐츠 언어화" },
  // executor
  drive: { type: "executor", weapon: "실행 추진" },
  action: { type: "executor", weapon: "즉시 실행" },
  speed: { type: "executor", weapon: "속도전" },
  urgent: { type: "executor", weapon: "긴급 대응" },
  achieve: { type: "executor", weapon: "목표 완수" },
  // connector
  empathy: { type: "connector", weapon: "공감 연결" },
  contribute: { type: "connector", weapon: "기여·도움" },
  collab: { type: "connector", weapon: "협업 시너지" },
  // creator
  face: { type: "creator", weapon: "카메라 표현" },
  trend: { type: "creator", weapon: "트렌드 감각" },
  hook: { type: "creator", weapon: "후킹" },
  thumbnail: { type: "creator", weapon: "클릭 유도" },
  visual: { type: "creator", weapon: "비주얼 연출" },
  // craftsman
  consistency: { type: "craftsman", weapon: "꾸준한 발행" },
  focus: { type: "craftsman", weapon: "몰입" },
  retention: { type: "craftsman", weapon: "완성도" },
  output: { type: "craftsman", weapon: "꾸준한 생산" },
  skill: { type: "craftsman", weapon: "역량 숙련" },
  stability: { type: "craftsman", weapon: "지속·안정" },
};

// ---------- 집계: 여러 진단 결과(scores)를 통합 프로필로 ----------
export interface CompletedTest {
  slug: string;
  scores: Record<string, number>; // dim → 0~100
}

export interface UnifiedProfile {
  type: ProfileType;
  weapons: { weapon: string; score: number }[]; // 핵심 무기 상위 3
  successPattern: SuccessPattern;
  testCount: number;
  typeScores: Record<ProfileTypeId, number>;
}

export function buildUnifiedProfile(completed: CompletedTest[]): UnifiedProfile | null {
  if (!completed.length) return null;

  const typeScores: Record<string, number> = {};
  const weaponScores: Record<string, number> = {};

  for (const t of completed) {
    for (const [dim, score] of Object.entries(t.scores)) {
      const m = DIM_MAP[dim];
      if (!m) continue;
      typeScores[m.type] = (typeScores[m.type] ?? 0) + score;
      weaponScores[m.weapon] = Math.max(weaponScores[m.weapon] ?? 0, score);
    }
  }

  const topTypeId = (Object.keys(typeScores) as ProfileTypeId[]).sort(
    (a, b) => typeScores[b] - typeScores[a]
  )[0] as ProfileTypeId;
  const type = PROFILE_TYPES[topTypeId] ?? PROFILE_TYPES.inventor;

  const weapons = Object.entries(weaponScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([weapon, score]) => ({ weapon, score }));

  const successPattern =
    SUCCESS_PATTERNS[type.successPatternId] ?? SUCCESS_PATTERNS.build_to_education;

  const full = {} as Record<ProfileTypeId, number>;
  (Object.keys(PROFILE_TYPES) as ProfileTypeId[]).forEach((k) => {
    full[k] = Math.round(typeScores[k] ?? 0);
  });

  return { type, weapons, successPattern, testCount: completed.length, typeScores: full };
}
