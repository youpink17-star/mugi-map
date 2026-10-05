// 완성한 사업 정리본을 "어디에 쓰는지" — 1인 사업자가 가장 자주 겪는 상황 3가지만 깊게.
// 홈(요약 카드) · /uses(자세한 소개 페이지) · 한 장으로 보기(바로 쓰는 버튼)에서 같이 쓴다.
// 버튼을 누르면 [AI에게 시킬 말 + 내 정리본 전체]가 복사돼서, ChatGPT·Claude 등에 붙여넣기만 하면 된다.
import { WIKI_SECTIONS, BUSINESS_TYPE_LABEL, SELLING_STATUS_LABEL } from "./wiki";
import type { BusinessWiki } from "./wikiStore";

export interface WikiUse {
  id: string;
  emoji: string; // 옛 윈도우에서도 깨지지 않는 이모지만 (🪪·🤝 같은 건 깨짐)
  title: string;
  desc: string; // 한 줄 요약
  when: string; // 이럴 때 — 혼자 사업하면서 겪는 장면
  steps: string[]; // 이렇게 — 3단계
  before: string; // 정리본 없이 하면
  after: string; // 정리본을 쓰면
  ask: string; // AI에게 시킬 말 (뒤에 정리본 본문이 붙는다)
}

export const WIKI_USES: WikiUse[] = [
  {
    id: "ai",
    emoji: "🤖",
    title: "AI가 내 브랜드를 잊지 않게 하기",
    desc: "한 번 넣어두면, 글을 시킬 때마다 내 고객·내 말투 그대로",
    when: "AI에게 글을 시킬 때마다 내 사업을 처음부터 다시 설명하고, 그래도 남의 브랜드 같은 글이 나올 때",
    steps: [
      "‘한 장으로 보기’에서 버튼을 눌러 복사하기",
      "ChatGPT·Claude의 프로젝트(지침) 칸에 한 번만 붙여넣기",
      "그다음부터는 “인스타 글 써줘” 한마디면 끝",
    ],
    before: "“30대 여성 대상이고요, 제 상품은요…” 매번 다시 설명",
    after: "“이번 주 인스타 글 3개 써줘” — 내 고객과 차별화 포인트가 이미 들어간 글",
    ask: "아래는 내 브랜드 정리본이야. 앞으로 내가 글이나 아이디어를 부탁하면, 이 정리본에 적힌 고객·판매할 것·차별화 포인트에 맞춰서 답해줘. 정리본에 없는 내용은 지어내지 말고 나에게 먼저 물어봐줘. 이해했으면 내 브랜드를 3줄로 요약해줘.",
  },
  {
    id: "intro",
    emoji: "✍️",
    title: "소개 문구 한 번에 뽑기",
    desc: "한 줄 소개, 인스타 프로필, 스토어 소개글까지 같은 말로",
    when: "프로필·스토어 소개·명함을 쓸 때마다 말이 달라지고, ‘나를 뭐라고 소개하지?’에서 막힐 때",
    steps: [
      "‘한 장으로 보기’에서 버튼을 눌러 복사하기",
      "AI에 붙여넣으면 한 줄 소개 5개 + 프로필 + 소개글이 한 번에",
      "마음에 드는 한 줄을 골라 프로필·스토어·명함에 똑같이 쓰기",
    ],
    before: "인스타엔 ‘글쓰기 코치’, 스토어엔 ‘콘텐츠 전문가’ — 볼 때마다 다른 사람",
    after: "어디서 봐도 같은 한 줄 — 고객이 ‘아, 그 사람’ 하고 기억",
    ask: "아래 정리본으로 ① 한 줄 소개 5개(각 20자 안팎) ② 인스타그램 프로필 소개(150자 이내, 4줄) ③ 스토어·홈페이지 소개글(300자), 이렇게 3가지를 써줘. 메인 고객이 읽고 ‘내 얘기네’ 하도록, 어려운 말 없이. 정리본에 없는 숫자나 사실은 쓰지 마.",
  },
  {
    id: "handoff",
    emoji: "👥",
    title: "같이 일할 사람에게 한 장으로 넘기기",
    desc: "디자이너·편집자·알바에게 내 브랜드를 5분 만에 설명",
    when: "외주를 맡겼는데 ‘알아서 해주세요’ 했다가 내 브랜드와 안 맞는 결과물이 돌아올 때",
    steps: [
      "‘한 장으로 보기’에서 버튼을 눌러 복사하기",
      "AI가 정리본을 ‘작업 안내문’으로 바꿔줌 (지킬 것 3가지·하면 안 되는 것 3가지)",
      "안내문을 작업 요청과 함께 보내기",
    ],
    before: "전화로 30분 설명하고도 수정 요청 세 번",
    after: "안내문 한 장 — 처음부터 내 고객에게 맞는 결과물",
    ask: "아래 정리본을, 처음 같이 일하는 외주 작업자(디자이너·영상 편집자·마케터·아르바이트)에게 보내는 ‘작업 안내문’으로 바꿔줘. ① 우리가 누구에게 무엇을 파는지 ② 고객이 우리를 고르는 이유 ③ 만들 때 꼭 지킬 것 3가지 ④ 하면 안 되는 것 3가지 순서로, 5분 안에 읽을 수 있게 쉬운 말로 써줘.",
  },
];

// 정리본 전체를 글자로 — AI에 붙여넣거나 파일로 저장하는 용도. 비어 있는 칸은 뺀다.
export function wikiToText(wiki: BusinessWiki): string {
  const lines: string[] = [
    `# ${wiki.title} — 사업 정리본`,
    `- 판매 상태: ${SELLING_STATUS_LABEL[wiki.sellingStatus]}`,
    `- 유형: ${BUSINESS_TYPE_LABEL[wiki.businessType]}`,
    "",
  ];
  for (const def of WIKI_SECTIONS) {
    if (def.isParent) {
      const hasChild = WIKI_SECTIONS.some((c) => c.parentId === def.id && wiki.sections[c.id]?.content?.trim());
      if (hasChild) lines.push(`## ${def.num}. ${def.title}`, "");
      continue;
    }
    const content = wiki.sections[def.id]?.content?.trim();
    if (!content) continue;
    lines.push(`${def.parentId ? "###" : "##"} ${def.num} ${def.title}`, content, "");
  }
  return lines.join("\n").trim();
}

export function filledCount(wiki: BusinessWiki): number {
  return WIKI_SECTIONS.filter((d) => !d.isParent && wiki.sections[d.id]?.content?.trim()).length;
}

export function buildUseText(use: WikiUse, wiki: BusinessWiki): string {
  return `${use.ask}\n\n---\n${wikiToText(wiki)}`;
}
