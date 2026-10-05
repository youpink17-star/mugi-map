// 질문 방식 채우기 — "문단 쓰기" 대신 한 화면에 질문 하나씩 답하면 문단이 자동으로 완성된다.
// 각 칸의 질문은 wiki.ts 템플릿의 [빈칸]을 쉬운 말로 바꾼 것. carry = 앞 칸에서 한 답을 미리 채움.

export interface FlowQuestion {
  id: string;
  q: string;
  hint?: string;
  chips?: string[]; // 눌러서 고르는 답
  input?: { placeholder: string }; // 직접 쓰기 (chips와 함께면 "직접 쓰기" 칩으로 열림)
  skip?: string; // 건너뛰기 라벨 (있으면 선택 질문)
  carry?: { section: string; key: string }; // 앞 칸의 답을 미리 채움
}

export interface FlowContext {
  name: string; // 사업 이름 (개요 답 → 위키 제목 → "내 사업")
}

export interface QuestionFlowDef {
  sectionId: string;
  intro: string;
  doneTitle: string;
  questions: FlowQuestion[];
  assemble: (a: Record<string, string>, ctx: FlowContext) => string;
}

function lastBatchim(word: string): "none" | "rieul" | "other" | null {
  // 끝에 붙은 문장부호·따옴표·괄호는 빼고 마지막 글자를 본다
  const ch = word.replace(/[^0-9A-Za-z가-힣]+$/u, "").slice(-1);
  if (!ch) return null;
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const jong = (code - 0xac00) % 28;
    return jong === 0 ? "none" : jong === 8 ? "rieul" : "other";
  }
  if (/[0-9]/.test(ch)) return "178".includes(ch) ? "rieul" : "036".includes(ch) ? "other" : "none";
  if (/[a-zA-Z]/.test(ch)) return /l/i.test(ch) ? "rieul" : /[mnr]/i.test(ch) ? "other" : "none";
  return null;
}

// 받침에 맞는 조사 (은/는, 을/를, 이/가, 과/와, 이라는/라는). 판단 불가면 "은(는)" 형태.
export function particle(word: string, withB: string, withoutB: string): string {
  const b = lastBatchim(word);
  if (b === null) return withoutB;
  return b === "none" ? withoutB : withB;
}
// 으로/로 — ㄹ 받침 뒤에는 "로"
export function ro(word: string): string {
  const b = lastBatchim(word);
  if (b === null) return "(으)로";
  return b === "other" ? "으로" : "로";
}
export function josa(word: string, withB: string, withoutB: string): string {
  return `${word}${particle(word, withB, withoutB)}`;
}
const q = (s: string) => `'${s}'`;
const quoteLike = (s: string, noun: string) => `'${s}'${particle(s, "이라는", "라는")} ${noun}`;
const set = (v: string | undefined, ...no: string[]) => !!v && !no.includes(v);

const NO_NAME = "아직 없어요";
const NO_PRODUCT = "아직 안 정했어요";
const NO_CHANNEL = "아직 안 정했어요";
const NO_IDEA = "아직 없어요";
const NOT_SURE = "잘 모르겠어요";

const WHO_CHIPS = ["1인 사장님", "직장인", "아이 키우는 부모", "예비 창업자", "대학생", "시니어"];
const PROBLEM_CHIPS = ["뭐부터 해야 할지 모르겠어요", "시간이 너무 없어요", "혼자라 막막해요", "돈 쓴 만큼 효과가 없어요"];

// ---------------- 1. 개요 ----------------
const OVERVIEW: QuestionFlowDef = {
  sectionId: "overview",
  intro: "눌러서 답하면 내 사업 소개 문단이 자동으로 완성돼요. 1분이면 끝나요.",
  doneTitle: "내 사업 소개가 생겼어요",
  questions: [
    { id: "name", q: "사업(브랜드) 이름이 뭐예요?", hint: "정식 이름이 없으면 부르는 이름도 좋아요.", input: { placeholder: "예) 무기제작소" }, skip: NO_NAME },
    { id: "who", q: "누구를 돕고 싶어요?", chips: WHO_CHIPS, input: { placeholder: "예) 첫 가게를 연 카페 사장님" } },
    { id: "problem", q: "그분들이 제일 힘들어하는 건 뭐예요?", hint: "손님이 실제로 할 법한 말로 적으면 더 좋아요.", chips: PROBLEM_CHIPS, input: { placeholder: "예) 인스타를 해도 손님이 안 와요" } },
    { id: "biz", q: "어떤 방식으로 도와줘요?", chips: ["강의·클래스", "1:1 코칭·컨설팅", "전자책·템플릿", "실물 상품", "대행 서비스", "앱·온라인 도구"], input: { placeholder: "예) 촬영 대행" } },
    { id: "product", q: "대표 상품 이름이 있나요?", input: { placeholder: "예) 4주 인스타 클래스" }, skip: NO_PRODUCT },
    { id: "result", q: "도움을 받으면 손님은 어떻게 달라져요?", chips: ["시간이 줄어요", "돈을 더 벌어요", "자신감이 생겨요", "결과가 눈에 보여요", "덜 불안해요"], input: { placeholder: "예) 한 달 만에 첫 매출이 나요" } },
    { id: "where", q: "어디서 팔아요? (팔 예정도 괜찮아요)", chips: ["인스타그램", "스마트스토어", "홈페이지", "오프라인 매장", "블로그", NO_CHANNEL], input: { placeholder: "예) 크몽" } },
    { id: "stage", q: "지금 어느 단계예요?", chips: ["준비 중", "막 시작했어요", "판매 중이에요"] },
  ],
  assemble(a, { name }) {
    const stageWord = a.stage === "판매 중이에요" ? "판매 중" : a.stage === "막 시작했어요" ? "막 시작한 단계" : "준비 중";
    return [
      `${josa(name, "은", "는")} ${josa(a.who, "을", "를")} 위한 ${a.biz} 사업입니다.`,
      `이분들은 ${quoteLike(a.problem, "고민")}이 있습니다.`,
      set(a.product, NO_PRODUCT)
        ? `대표 상품은 ${q(a.product)}입니다. 고객은 이를 통해 ${quoteLike(a.result, "변화")}를 얻습니다.`
        : `도움을 받은 고객은 ${quoteLike(a.result, "변화")}를 얻습니다.`,
      set(a.where, NO_CHANNEL) ? `현재 ${a.where}에서 ${stageWord}입니다.` : `판매 채널은 아직 정하지 않았고, 지금은 ${stageWord}입니다.`,
    ].join(" ");
  },
};

// ---------------- 2. 내 무기 ----------------
const WEAPON: QuestionFlowDef = {
  sectionId: "weapon",
  intro: "내가 남들보다 잘하는 걸 찾는 칸이에요. 떠오르는 대로 눌러보세요.",
  doneTitle: "내 무기를 찾았어요",
  questions: [
    { id: "strength", q: "남들보다 쉽게, 잘하는 게 뭐예요?", chips: ["어려운 걸 쉽게 설명해요", "꼼꼼하게 챙겨요", "감각·센스가 좋아요", "사람 마음을 잘 읽어요", "빠르게 실행해요", "정리·기획을 잘해요"], input: { placeholder: "예) 사진을 예쁘게 찍어요" } },
    { id: "origin", q: "그 강점은 어디서 생겼어요?", chips: ["오래 일한 경력", "직접 겪어본 경험", "꾸준한 공부", "타고난 성향"], input: { placeholder: "예) 10년 간호사 경력" } },
    { id: "shows", q: "그 강점이 제일 잘 드러나는 순간은?", chips: ["상담·수업할 때", "상품을 만들 때", "손님을 챙길 때", "콘텐츠를 만들 때"], input: { placeholder: "예) 첫 상담할 때" } },
    { id: "benefit", q: "그 덕분에 손님은 뭐가 좋아요?", chips: ["빨리 이해해요", "실수가 줄어요", "믿고 맡겨요", "결과가 좋아져요"], input: { placeholder: "예) 혼자 할 때보다 두 배 빨라요" } },
    { id: "proof", q: "주변에서 자주 듣는 칭찬이 있나요?", hint: "손님이나 지인이 한 말 그대로 적어보세요.", input: { placeholder: "예) 설명 들으니까 바로 이해돼요" }, skip: NO_IDEA },
  ],
  assemble(a, { name }) {
    const out = [
      `${name}의 가장 큰 무기는 ${quoteLike(a.strength, "점")}입니다.`,
      `이 강점은 ${q(a.origin)}에서 나왔고, 특히 ${a.shows} 가장 잘 드러납니다.`,
      `덕분에 고객은 ${quoteLike(a.benefit, "이득")}을 얻습니다.`,
    ];
    if (set(a.proof, NO_IDEA)) out.push(`실제로 ${quoteLike(a.proof, "말")}을 자주 듣습니다.`);
    return out.join(" ");
  },
};

// ---------------- 3. 판매 상품·서비스 ----------------
const PRODUCT: QuestionFlowDef = {
  sectionId: "product",
  intro: "가장 먼저 팔아볼(또는 지금 파는) 상품 하나만 정리해요.",
  doneTitle: "대표 상품이 정리됐어요",
  questions: [
    { id: "name", q: "가장 먼저 팔 상품 이름은?", input: { placeholder: "예) 4주 인스타 클래스" }, skip: NO_PRODUCT, carry: { section: "overview", key: "product" } },
    { id: "form", q: "어떤 형태예요?", chips: ["온라인 강의", "오프라인 클래스", "1:1 코칭", "전자책·템플릿", "실물 상품", "대행 서비스", "구독·멤버십"], input: { placeholder: "예) 원데이 체험" } },
    { id: "deliver", q: "손님은 정확히 뭘 받게 돼요?", input: { placeholder: "예) 주 1회 수업 4번 + 실습 자료" } },
    { id: "price", q: "가격은 얼마쯤이에요?", chips: ["1만 원 이하", "1~5만 원", "5~10만 원", "10~30만 원", "30만 원 이상", "아직 몰라요"], input: { placeholder: "예) 39,000원" } },
    { id: "status", q: "지금 이 상품은 어느 상태예요?", chips: ["아이디어 단계", "만들고 있어요", "테스트로 팔아봤어요", "잘 팔리고 있어요"] },
  ],
  assemble(a, { name }) {
    const status: Record<string, string> = {
      "아이디어 단계": "지금은 아이디어 단계입니다.",
      "만들고 있어요": "지금 만들고 있습니다.",
      "테스트로 팔아봤어요": "지금은 테스트로 팔아본 단계입니다.",
      "잘 팔리고 있어요": "지금 꾸준히 팔리고 있습니다.",
    };
    return [
      set(a.name, NO_PRODUCT)
        ? `${name}의 대표 상품은 ${a.form} 형태의 ${q(a.name)}입니다.`
        : `${josa(name, "은", "는")} 첫 상품을 ${a.form} 형태로 준비하고 있습니다.`,
      `구성은 ${q(a.deliver)}입니다.`,
      a.price === "아직 몰라요" ? "가격은 아직 정하지 않았고," : `가격은 ${a.price}이며,`,
      status[a.status] ?? `${a.status}입니다.`,
    ].join(" ");
  },
};

// ---------------- 4. 타겟 ----------------
const TARGET: QuestionFlowDef = {
  sectionId: "target",
  intro: "가장 먼저 설득할 손님 한 명을 떠올려보세요.",
  doneTitle: "내 손님이 선명해졌어요",
  questions: [
    { id: "who", q: "가장 먼저 설득할 손님은 누구예요?", chips: WHO_CHIPS, input: { placeholder: "예) 첫 가게를 연 카페 사장님" }, carry: { section: "overview", key: "who" } },
    { id: "situation", q: "그 손님은 보통 어떤 상황이에요?", chips: ["막 시작해서 막막한 상황", "바빠서 시간이 없는 상황", "해봤는데 실패한 상황", "혼자라 물어볼 데가 없는 상황"], input: { placeholder: "예) 퇴근 후 부업을 알아보는 상황" } },
    { id: "problem", q: "제일 답답해하는 건 뭐예요?", chips: PROBLEM_CHIPS, input: { placeholder: "예) 인스타를 해도 손님이 안 와요" }, carry: { section: "overview", key: "problem" } },
    { id: "want", q: "진짜 원하는 결과는요?", chips: ["돈을 더 벌고 싶어요", "시간을 아끼고 싶어요", "실력을 키우고 싶어요", "인정받고 싶어요", "마음이 편해지고 싶어요"], input: { placeholder: "예) 월 100만 원 부수입" } },
    { id: "hesitate", q: "사기 전에 뭘 망설여요?", chips: ["가격이 부담돼요", "나한테 맞을지 모르겠어요", "효과가 있을지 의심돼요", "시간이 없을 것 같아요"], input: { placeholder: "예) 초보도 따라갈 수 있을까요?" } },
    { id: "words", q: "그 손님이 검색창에 칠 법한 말은?", input: { placeholder: "예) 인스타 팔로워 늘리는 법" }, skip: NOT_SURE },
  ],
  assemble(a, { name }) {
    const out = [
      `${name}의 주요 고객은 ${a.who}입니다. 보통 ${a.situation}에 있습니다.`,
      `이들은 ${quoteLike(a.problem, "고민")}이 있고, ${quoteLike(a.want, "결과")}를 원합니다.`,
      `구매 전에는 ${quoteLike(a.hesitate, "이유")}로 망설입니다.`,
    ];
    if (set(a.words, NOT_SURE)) out.push(`주로 ${q(a.words)} 같은 말로 해결책을 찾습니다.`);
    return out.join(" ");
  },
};

// ---------------- 5. 차별화 ----------------
const DIFF: QuestionFlowDef = {
  sectionId: "diff",
  intro: "손님이 다른 곳 말고 나를 고를 이유를 찾아요.",
  doneTitle: "나를 고를 이유가 생겼어요",
  questions: [
    { id: "compare", q: "손님이 나 말고 고민하는 선택지는?", chips: ["비슷한 가게·브랜드", "무료 유튜브·블로그", "대형 플랫폼", "혼자 해보기"], input: { placeholder: "예) 동네 다른 공방" } },
    { id: "criterion", q: "고를 때 제일 중요하게 보는 건?", chips: ["가격", "결과·효과", "믿을 수 있는지", "편한지", "취향·감성"], input: { placeholder: "예) 선생님 실력" } },
    { id: "gap", q: "그 선택지들은 뭐가 아쉬워요?", chips: ["너무 뻔하고 일반적이에요", "나한테 맞춰주지 않아요", "너무 비싸요", "끝까지 안 챙겨줘요"], input: { placeholder: "예) 질문할 곳이 없어요" } },
    { id: "myway", q: "나는 그걸 어떻게 다르게 해줘요?", hint: "한 문장이면 충분해요.", input: { placeholder: "예) 한 명씩 맞춤으로 끝까지 봐줘요" } },
    { id: "proof", q: "그 차이를 보여줄 증거가 있나요?", chips: ["고객 후기", "전후 비교", "고객 성과", "자격·경력"], input: { placeholder: "예) 수강생 매출 인증" }, skip: NO_IDEA },
  ],
  assemble(a, { name }) {
    const out = [
      `고객은 보통 ${a.compare}${particle(a.compare, "과", "와")} 비교하며, 가장 중요하게 보는 기준은 ${a.criterion}입니다.`,
      `하지만 기존 선택지에는 ${quoteLike(a.gap, "아쉬움")}이 있습니다.`,
      `${josa(name, "은", "는")} 이를 ${quoteLike(a.myway, "방식")}으로 다르게 해결합니다.`,
    ];
    if (set(a.proof, NO_IDEA)) out.push(`이 차이는 ${a.proof}${ro(a.proof)} 확인할 수 있습니다.`);
    return out.join(" ");
  },
};

// ---------------- 6. 브랜드 콘텐츠 ----------------
const CONTENT: QuestionFlowDef = {
  sectionId: "content",
  intro: "무엇을 어떻게 올릴지, 어떤 브랜드로 기억될지 정해요.",
  doneTitle: "콘텐츠 방향이 잡혔어요",
  questions: [
    { id: "topic", q: "콘텐츠로 제일 자주 다룰 주제는?", chips: ["노하우·팁", "만드는 과정·비하인드", "고객 후기·사례", "내 이야기", "자주 묻는 질문"], input: { placeholder: "예) 초보 사장님 인스타 운영 팁" } },
    { id: "faq", q: "손님이 자주 묻는 질문 하나는?", input: { placeholder: "예) 팔로워 없어도 팔 수 있나요?" }, skip: NOT_SURE },
    { id: "format", q: "어떤 형식으로 올려요?", chips: ["릴스·숏폼", "카드뉴스", "블로그 글", "유튜브", "스레드", "뉴스레터"], input: { placeholder: "예) 라이브 방송" } },
    { id: "tone", q: "어떤 느낌으로 기억되고 싶어요?", chips: ["친근한 언니·형", "믿음직한 전문가", "솔직한 동료", "감성적인 브랜드"], input: { placeholder: "예) 유쾌한 옆집 사장님" } },
    { id: "cta", q: "콘텐츠를 본 사람이 뭘 하면 좋겠어요?", chips: ["팔로우", "저장·공유", "프로필 링크 클릭", "DM 문의", "무료 자료 받기"], input: { placeholder: "예) 체험 신청" } },
  ],
  assemble(a, { name }) {
    const out = [
      `${josa(name, "은", "는")} ${a.format}${ro(a.format)} ${josa(a.topic, "을", "를")} 꾸준히 다룹니다.`,
      `${q(a.tone)} 같은 느낌으로 기억되는 것이 목표입니다.`,
    ];
    if (set(a.faq, NOT_SURE)) out.push(`고객이 자주 묻는 ${q(a.faq)} 같은 질문에 답하며 신뢰를 쌓고,`);
    out.push(`콘텐츠를 본 사람이 ${josa(a.cta, "을", "를")} 하도록 이끕니다.`);
    return out.join(" ");
  },
};

// ---------------- 7.1 인지 ----------------
const AWARENESS: QuestionFlowDef = {
  sectionId: "funnel-awareness",
  intro: "손님이 나를 처음 만나는 순간을 정리해요.",
  doneTitle: "첫 만남이 정리됐어요",
  questions: [
    { id: "channel", q: "손님이 나를 처음 알게 되는 곳은?", chips: ["인스타그램", "네이버 검색·블로그", "유튜브", "지인 소개", "오프라인 매장·행사", "광고"], input: { placeholder: "예) 맘카페" }, carry: { section: "overview", key: "where" } },
    { id: "hook", q: "처음 봤을 때 멈추게 할 한마디는?", hint: "손님이 '어, 내 얘기네' 할 문장이요.", input: { placeholder: "예) 팔로워 300명으로 첫 매출 내는 법" } },
    { id: "first", q: "처음 본 사람이 하면 좋을 행동은?", chips: ["팔로우", "프로필 방문", "무료 자료 받기", "상세페이지 클릭", "검색해보기"], input: { placeholder: "예) 무료 체험 신청" } },
  ],
  assemble(a, { name }) {
    return [
      `고객은 주로 ${a.channel}에서 ${josa(name, "을", "를")} 처음 알게 됩니다.`,
      `처음에는 ${quoteLike(a.hook, "메시지")}로 눈길을 끌고, ${a.first}${ro(a.first)} 이어지게 합니다.`,
    ].join(" ");
  },
};

// ---------------- 7.2 관심 ----------------
const INTEREST: QuestionFlowDef = {
  sectionId: "funnel-interest",
  intro: "처음 본 손님이 더 알고 싶어지게 만드는 단계예요.",
  doneTitle: "관심을 끄는 방법이 정리됐어요",
  questions: [
    { id: "know", q: "처음 본 사람이 제일 궁금해하는 건?", chips: ["가격", "진짜 효과가 있는지", "어떻게 진행되는지", "누가 하는지", "다른 사람 후기"], input: { placeholder: "예) 초보도 가능한지" } },
    { id: "where", q: "그걸 어디서 보여줘요?", chips: ["프로필·하이라이트", "상세페이지", "블로그 글", "무료 자료", "라이브·영상"], input: { placeholder: "예) 노션 소개 페이지" } },
    { id: "charm", q: "내 상품의 제일 큰 매력 한 줄은?", input: { placeholder: "예) 4주면 첫 판매까지 같이 가요" } },
  ],
  assemble(a, { name }) {
    return [
      `관심이 생긴 고객은 ${josa(a.know, "이", "가")} 가장 궁금합니다.`,
      `${josa(name, "은", "는")} ${a.where}에서 이를 보여주며, ${quoteLike(a.charm, "매력")}을 강조합니다.`,
    ].join(" ");
  },
};

// ---------------- 7.3 고려 ----------------
const CONSIDERATION: QuestionFlowDef = {
  sectionId: "funnel-consideration",
  intro: "사기 직전 손님이 비교하고 확인하는 단계예요.",
  doneTitle: "마지막 망설임을 풀었어요",
  questions: [
    { id: "check", q: "사기 직전 손님이 꼭 확인하는 건?", chips: ["후기", "가격 비교", "환불 규정", "결과 사례", "운영자 경력"], input: { placeholder: "예) 수업 샘플 영상" } },
    { id: "worry", q: "마지막에 불안한 점은?", chips: ["돈만 날릴까 봐", "나한테 안 맞을까 봐", "시간이 없을까 봐", "연락이 안 될까 봐"], input: { placeholder: "예) 따라가다 포기할까 봐" }, carry: { section: "target", key: "hesitate" } },
    { id: "relief", q: "그 불안을 뭘로 줄여줘요?", chips: ["솔직한 후기", "무료 체험·상담", "환불 보장", "실제 결과 공개", "빠른 1:1 답변"], input: { placeholder: "예) 첫 수업 무료" } },
  ],
  assemble(a, { name }) {
    return [
      `사기 전 고객은 ${josa(a.check, "을", "를")} 꼭 확인합니다.`,
      `마지막 순간에는 ${quoteLike(a.worry, "불안")}이 있는데, ${josa(name, "은", "는")} ${a.relief}${ro(a.relief)} 이 불안을 줄여줍니다.`,
    ].join(" ");
  },
};

// ---------------- 7.4 구매·관리 ----------------
const PURCHASE: QuestionFlowDef = {
  sectionId: "funnel-purchase",
  intro: "산 손님이 만족하고 다시 찾아오게 만드는 단계예요.",
  doneTitle: "단골 만드는 길이 생겼어요",
  questions: [
    { id: "after", q: "결제한 손님에게 제일 먼저 하는 건?", chips: ["환영·안내 메시지", "사용법·진행 안내", "배송 알림", "첫 상담 일정 잡기"], input: { placeholder: "예) 감사 손편지" } },
    { id: "review", q: "후기는 어떻게 받아요?", chips: ["직접 부탁해요", "후기 이벤트", "자동 메시지", "아직 안 받아요"], input: { placeholder: "예) 수업 끝나고 설문" } },
    { id: "repeat", q: "다시 찾아오게 하는 장치는?", chips: ["재구매 쿠폰", "다음 단계 상품", "단골 혜택·멤버십", "소식 뉴스레터", "커뮤니티", "아직 없어요"], input: { placeholder: "예) 졸업생 모임" } },
  ],
  assemble(a) {
    const review: Record<string, string> = {
      "직접 부탁해요": "후기는 직접 부탁해서 받고,",
      "후기 이벤트": "후기는 이벤트로 모으고,",
      "자동 메시지": "후기는 자동 메시지로 요청하고,",
      "아직 안 받아요": "후기는 아직 따로 받지 않고,",
    };
    return [
      `결제한 고객에게는 먼저 ${josa(a.after, "을", "를")} 챙깁니다.`,
      review[a.review] ?? `후기는 ${q(a.review)} 방식으로 받고,`,
      a.repeat === "아직 없어요"
        ? "다시 찾아오게 하는 장치는 아직 준비 중입니다."
        : `${a.repeat}${ro(a.repeat)} 다시 찾아오게 만듭니다.`,
    ].join(" ");
  },
};

// ---------------- 8. 브랜드 최종 방향성 ----------------
const DIRECTION: QuestionFlowDef = {
  sectionId: "todo",
  intro: "마지막 칸이에요. 이 사업이 어디로 갈지 그려봐요.",
  doneTitle: "내 사업의 목적지가 생겼어요",
  questions: [
    { id: "focus", q: "앞으로 1년, 가장 집중할 한 가지는?", chips: ["첫 매출 만들기", "단골 늘리기", "상품 늘리기", "브랜드 알리기", "자동화·시스템 만들기"], input: { placeholder: "예) 월 매출 500만 원 만들기" } },
    { id: "next", q: "다음에 늘리고 싶은 상품·서비스는?", input: { placeholder: "예) 온라인 강의" }, skip: NOT_SURE },
    { id: "role", q: "손님에게 어떤 존재가 되고 싶어요?", chips: ["믿고 물어보는 선배", "가장 쉬운 선생님", "든든한 파트너", "동네 단골집", "업계 대표 브랜드"], input: { placeholder: "예) 인생 첫 브랜드를 만들어준 곳" } },
    { id: "dream", q: "3년 뒤 내 사업의 모습을 한 줄로?", input: { placeholder: "예) 수강생 1,000명과 함께하는 클래스 브랜드" } },
  ],
  assemble(a, { name }) {
    const out = [`${josa(name, "은", "는")} 앞으로 ${a.focus}에 가장 집중합니다.`];
    if (set(a.next, NOT_SURE)) out.push(`이후 ${a.next}${ro(a.next)} 확장할 계획입니다.`);
    out.push(`고객에게는 ${q(a.role)} 같은 존재가 되는 것이 목표이며, 3년 뒤 그리는 모습은 ${q(a.dream)}입니다.`);
    return out.join(" ");
  },
};

export const FLOWS: Record<string, QuestionFlowDef> = Object.fromEntries(
  [OVERVIEW, WEAPON, PRODUCT, TARGET, DIFF, CONTENT, AWARENESS, INTEREST, CONSIDERATION, PURCHASE, DIRECTION].map((f) => [
    f.sectionId,
    f,
  ])
);

export function getFlow(sectionId: string): QuestionFlowDef | undefined {
  return FLOWS[sectionId];
}

// 앞 칸 답을 이어받아 미리 채울 값 (건너뛰기·"아직 안 정했어요" 같은 답은 제외)
export function carriedAnswers(
  flow: QuestionFlowDef,
  all: Record<string, Record<string, string> | undefined>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const qq of flow.questions) {
    if (!qq.carry) continue;
    const v = all[qq.carry.section]?.[qq.carry.key];
    const src = FLOWS[qq.carry.section]?.questions.find((x) => x.id === qq.carry!.key);
    if (!v || v === src?.skip || v === NO_CHANNEL) continue;
    out[qq.id] = v;
  }
  return out;
}

export function flowName(all: Record<string, Record<string, string> | undefined>, title?: string): string {
  const n = all.overview?.name;
  if (n && n !== NO_NAME) return n;
  return title?.trim() || "내 사업";
}

// 직접 쓴 답 다듬기: 앞뒤 공백·감싼 따옴표·끝 마침표 제거 (문장에 넣을 때 따옴표가 겹치지 않게)
export function cleanAnswer(v: string): string {
  return v
    .trim()
    .replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "")
    .replace(/[.。]+$/g, "")
    .trim();
}

// 개요 답 → 상단 사업 정보(판매 상태·유형)에 맞춰줄 값
export function metaFromOverview(a: Record<string, string>): { selling?: "none" | "selling"; type?: "product" | "service" | "content" } {
  const type: Record<string, "product" | "service" | "content"> = {
    "실물 상품": "product",
    "전자책·템플릿": "product",
    "앱·온라인 도구": "product",
    "1:1 코칭·컨설팅": "service",
    "대행 서비스": "service",
    "강의·클래스": "content",
  };
  return {
    selling: a.stage ? (a.stage === "준비 중" ? "none" : "selling") : undefined,
    type: type[a.biz],
  };
}
