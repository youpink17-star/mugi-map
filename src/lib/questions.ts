import type { Question } from "./types";

// ============================================================
// 무료 테스트 질문 (객관식 + 주관식 혼합)
//  - 각 옵션 score 의 키는 results.ts / scoring.ts 의 차원 키와 일치해야 함
// ============================================================

export const FREE_TESTS: Record<string, Question[]> = {
  // ---------------- 사업 전략 및 마케팅 진단 ----------------
  "business-marketing": [
    {
      id: "stage",
      type: "single",
      q: "지금 사업은 어느 단계인가요?",
      required: true,
      options: [
        { value: "idea", label: "준비 중 / 아이디어 단계", score: { stage: 0 } },
        { value: "early", label: "막 시작 (월 매출 ~500만 원)", score: { stage: 1 } },
        { value: "growth", label: "성장 중 (월 매출 500만~3천)", score: { stage: 2 } },
        { value: "scale", label: "안정·확장 (월 3천 이상)", score: { stage: 3 } },
      ],
    },
    {
      id: "target",
      type: "single",
      q: "우리 핵심 고객을 한 문장으로 말할 수 있나요?",
      required: true,
      options: [
        { value: "clear", label: "아주 또렷하게 설명 가능", score: { target: 4 } },
        { value: "rough", label: "대략은 안다", score: { target: 2 } },
        { value: "no", label: "‘다양한 사람’이라 콕 집기 어렵다", score: { target: 0 } },
      ],
    },
    {
      id: "diff",
      type: "single",
      q: "경쟁사 대신 우리를 골라야 할 이유가 분명한가요?",
      required: true,
      options: [
        { value: "yes", label: "한마디로 설명되는 강점이 있다", score: { diff: 4 } },
        { value: "weak", label: "있긴 한데 애매하다", score: { diff: 2 } },
        { value: "price", label: "가격 말곤 딱히 없다", score: { diff: 0 } },
      ],
    },
    {
      id: "channel",
      type: "single",
      q: "새 고객을 ‘꾸준히’ 데려오는 채널이 있나요?",
      required: true,
      options: [
        { value: "stable", label: "안정적으로 작동하는 채널이 있다", score: { channel: 4 } },
        { value: "luck", label: "운에 따라 들쭉날쭉", score: { channel: 2 } },
        { value: "none", label: "거의 없다 / 지인·소개 위주", score: { channel: 0 } },
      ],
    },
    {
      id: "content",
      type: "single",
      q: "콘텐츠(SNS·블로그·영상 등)를 정기적으로 발행하나요?",
      required: true,
      options: [
        { value: "regular", label: "주기적으로 꾸준히 + 전환 설계", score: { content: 4 } },
        { value: "sometimes", label: "생각날 때만 한다", score: { content: 2 } },
        { value: "no", label: "거의 안 한다", score: { content: 0 } },
      ],
    },
    {
      id: "data",
      type: "single",
      q: "주요 지표(방문·전환·재구매)를 보고 결정하나요?",
      required: true,
      options: [
        { value: "yes", label: "정기적으로 보고 의사결정에 쓴다", score: { data: 4 } },
        { value: "sometimes", label: "가끔 본다", score: { data: 2 } },
        { value: "no", label: "거의 안 본다 / 감으로 한다", score: { data: 0 } },
      ],
    },
    {
      id: "bottleneck",
      type: "single",
      q: "솔직히, 지금 가장 답답한 건 무엇인가요?",
      required: true,
      options: [
        { value: "noTraffic", label: "사람이 안 와요 (유입)", score: { channel: -1 } },
        { value: "noConvert", label: "와도 안 사요 (전환)", score: { content: -1, data: -1 } },
        { value: "noDiff", label: "비슷한 데가 너무 많아요 (차별화)", score: { diff: -1 } },
        { value: "noRepeat", label: "한 번 사고 안 와요 (재구매)", score: { data: -1 } },
      ],
    },
    {
      id: "goal",
      type: "long",
      q: "올해 이 사업으로 꼭 이루고 싶은 한 가지는?",
      placeholder: "예) 월 매출 1,000만 원 안정화 / 재구매율 2배",
      required: false,
    },
  ],

  // ---------------- 사업 아이템 발굴 진단 (12문항) ----------------
  "business-item": [
    {
      id: "win",
      type: "single",
      q: "사업이 크게 성공했다고 상상해보세요. 가장 짜릿한 장면은?",
      required: true,
      options: [
        { value: "top", label: "업계에서 인정받고 정상에 선 나", score: { model: 2, t: 1, j: 1 } },
        { value: "free", label: "누구 눈치도 안 보고 내 방식대로 사는 나", score: { action: 2, p: 1 } },
        { value: "expert", label: "내 전문성으로 ‘이 분야 최고’가 된 나", score: { strength: 2, i: 1 } },
        { value: "impact", label: "내가 만든 게 누군가의 삶을 바꾼 것", score: { market: 2, f: 1, n: 1 } },
      ],
    },
    {
      id: "idea_mode",
      type: "single",
      q: "새 아이디어가 떠올랐을 때, 머릿속에서 먼저 작동하는 건?",
      required: true,
      options: [
        { value: "real", label: "‘이게 현실적으로 될까?’ 실행 가능성부터", score: { model: 1, s: 1 } },
        { value: "big", label: "‘이게 이렇게 커질 수도?’ 큰 그림부터", score: { market: 1, n: 1 } },
        { value: "exp", label: "‘내가 해봐서 아는데’ 내 경험에서 출발", score: { strength: 1, s: 1 } },
        { value: "go", label: "‘일단 해보자’ 생각보다 손이 먼저", score: { action: 1, n: 1 } },
      ],
    },
    {
      id: "favor",
      type: "single",
      q: "사람들이 당신에게 도움을 청할 때, 주로 뭘 부탁하나요?",
      required: true,
      options: [
        { value: "analyze", label: "“이것 좀 정리·분석해줘”", score: { strength: 2, t: 1 } },
        { value: "connect", label: "“누구 좀 소개·연결해줘”", score: { market: 2, e: 1, f: 1 } },
        { value: "money", label: "“이걸로 어떻게 돈 벌지 같이 궁리해줘”", score: { model: 2, t: 1 } },
        { value: "dothis", label: "“그냥 같이 한번 해보자”", score: { action: 2, e: 1 } },
      ],
    },
    {
      id: "plan_style",
      type: "single",
      q: "목표가 생기면 당신은?",
      required: true,
      options: [
        { value: "schedule", label: "계획·마감을 세우고 차근차근 밟는다", score: { model: 1, j: 1 } },
        { value: "flex", label: "상황을 봐가며 유연하게 간다", score: { action: 1, p: 1 } },
        { value: "study", label: "충분히 공부·준비한 뒤 움직인다", score: { strength: 1, j: 1 } },
        { value: "gather", label: "사람부터 모아 판을 벌인다", score: { market: 1, e: 1, p: 1 } },
      ],
    },
    {
      id: "weapon",
      type: "single",
      q: "지금 당신이 가진 가장 큰 무기는?",
      required: true,
      options: [
        { value: "skill", label: "특정 분야의 기술·전문성", score: { strength: 2 } },
        { value: "people", label: "사람·팔로워·네트워크", score: { market: 2, e: 1 } },
        { value: "capital", label: "돈 보는 눈·굴릴 수 있는 자본", score: { model: 2 } },
        { value: "grit", label: "시간·체력·근성 (그 외엔 아직)", score: { action: 2 } },
      ],
    },
    {
      id: "fear",
      type: "single",
      q: "사업하면서 가장 피하고 싶은 상황은?",
      required: true,
      options: [
        { value: "incompetent", label: "무능력해 보이고 뒤처지는 것", score: { strength: 1, i: 1 } },
        { value: "trapped", label: "통제·구속당하는 것", score: { action: 1, p: 1 } },
        { value: "risk", label: "실패하고 불안정해지는 것", score: { model: 1, s: 1, j: 1 } },
        { value: "meaningless", label: "아무 의미·영향력이 없는 것", score: { market: 1, n: 1, f: 1 } },
      ],
    },
    {
      id: "sell",
      type: "single",
      q: "당신의 상품을 팔아야 한다면, 더 자신 있는 방식은?",
      required: true,
      options: [
        { value: "logic", label: "데이터·논리로 ‘이게 이득’임을 증명", score: { strength: 1, t: 1 } },
        { value: "story", label: "스토리·공감으로 마음을 움직임", score: { market: 1, f: 1 } },
        { value: "offer", label: "압도적인 제안·가격으로 밀어붙임", score: { model: 1, t: 1 } },
        { value: "show", label: "직접 보여주고 체험시켜 납득", score: { action: 1, s: 1 } },
      ],
    },
    {
      id: "bet",
      type: "single",
      q: "쓸 수 있는 돈 500만 원이 생겼다면?",
      required: true,
      options: [
        { value: "invest_self", label: "내 역량을 키운다 (교육·장비·자격)", score: { strength: 1 } },
        { value: "test", label: "작게 여러 개를 동시에 테스트한다", score: { action: 1, p: 1 } },
        { value: "focus", label: "될 것 같은 하나에 집중 투자한다", score: { model: 1, j: 1 } },
        { value: "reach", label: "사람을 모은다 (마케팅·커뮤니티)", score: { market: 1, e: 1 } },
      ],
    },
    {
      id: "weekend",
      type: "single",
      q: "한가한 주말, 가장 당신다운 모습은?",
      required: true,
      options: [
        { value: "deepen", label: "관심 분야를 깊게 공부하거나 파고든다", score: { strength: 1, i: 1, s: 1 } },
        { value: "meet", label: "사람들을 만나 에너지를 얻는다", score: { market: 1, e: 1, f: 1 } },
        { value: "side", label: "돈 될 만한 걸 기웃거리며 굴려본다", score: { model: 1, t: 1 } },
        { value: "new", label: "안 해본 새로운 걸 무작정 시도한다", score: { action: 1, n: 1, p: 1 } },
      ],
    },
    {
      id: "praise",
      type: "single",
      q: "지금까지 들은 칭찬 중 가장 ‘내 얘기’ 같은 건?",
      required: true,
      options: [
        { value: "pro", label: "“넌 진짜 그 분야 전문가야”", score: { strength: 2, i: 1 } },
        { value: "people", label: "“넌 사람을 잘 모으고 다뤄”", score: { market: 2, e: 1 } },
        { value: "biz", label: "“넌 돈 냄새를 잘 맡아”", score: { model: 2, t: 1 } },
        { value: "action", label: "“넌 진짜 추진력이 대단해”", score: { action: 2, j: 1 } },
      ],
    },
    {
      id: "stuck",
      type: "single",
      q: "일이 막혔을 때 당신의 첫 반응은?",
      required: true,
      options: [
        { value: "research", label: "자료를 더 찾아 깊이 파고든다", score: { strength: 1, s: 1, t: 1 } },
        { value: "ask", label: "사람들에게 물어보고 도움을 구한다", score: { market: 1, e: 1, f: 1 } },
        { value: "reframe", label: "‘이게 돈이 되나’ 구조부터 다시 본다", score: { model: 1, t: 1 } },
        { value: "justdo", label: "고민 접고 일단 다른 방법을 시도", score: { action: 1, n: 1, p: 1 } },
      ],
    },
    {
      id: "horizon",
      type: "single",
      q: "사업을 한다면 더 끌리는 그림은?",
      required: true,
      options: [
        { value: "master", label: "작아도 ‘이 분야 최고’ 소리 듣는 1인 브랜드", score: { strength: 1, i: 1, j: 1 } },
        { value: "community", label: "사람들이 모이는 커뮤니티·플랫폼", score: { market: 1, e: 1, n: 1 } },
        { value: "scale", label: "구조를 갖춰 크게 키우는 회사", score: { model: 1, t: 1, j: 1 } },
        { value: "agile", label: "여러 시도를 빠르게 돌리는 가벼운 사업", score: { action: 1, p: 1, n: 1 } },
      ],
    },
  ],

  // ---------------- 광고 전환 진단 (12문항) ----------------
  "ad-conversion": [
    {
      id: "hook_first",
      type: "single",
      q: "스크롤을 멈추게 만드는 첫 1초, 당신의 소재는 무엇으로 잡나요?",
      required: true,
      options: [
        { value: "shock", label: "예상 못 한 장면·반전으로 시선을 낚아챈다", score: { hook: 2, n: 1 } },
        { value: "problem", label: "‘딱 내 얘기’ 싶은 고민을 정면으로 찌른다", score: { hook: 2, f: 1 } },
        { value: "benefit", label: "결과·혜택을 첫 줄에 대놓고 박는다", score: { hook: 1, offer: 1, t: 1 } },
        { value: "asis", label: "솔직히 첫 컷은 별생각 없이 만든다", score: { hook: 0 } },
      ],
    },
    {
      id: "hook_test",
      type: "single",
      q: "후킹이 약하다는 걸 어떻게 확인하나요?",
      required: true,
      options: [
        { value: "rate", label: "조회·3초 재생률을 소재별로 비교한다", score: { hook: 2, t: 1, j: 1 } },
        { value: "feel", label: "내가 봐서 ‘멈칫’ 했는지로 판단한다", score: { hook: 1, f: 1 } },
        { value: "ab", label: "여러 첫 컷을 A/B로 돌려본다", score: { hook: 2, s: 1 } },
        { value: "none", label: "딱히 확인 안 한다", score: { hook: 0 } },
      ],
    },
    {
      id: "hook_format",
      type: "single",
      q: "가장 반응이 좋았던 첫 장면 유형은?",
      required: true,
      options: [
        { value: "before", label: "비포→애프터 변화 보여주기", score: { hook: 2 } },
        { value: "question", label: "‘혹시 이러신가요?’ 질문 던지기", score: { hook: 1, targeting: 1 } },
        { value: "number", label: "충격적인 숫자·결과 제시", score: { hook: 1, offer: 1 } },
        { value: "unknown", label: "뭐가 잘 먹히는지 모르겠다", score: { hook: 0 } },
      ],
    },
    {
      id: "target_define",
      type: "single",
      q: "이 광고를 ‘누구에게’ 보일지 얼마나 또렷한가요?",
      required: true,
      options: [
        { value: "sharp", label: "상황·고민까지 한 사람을 그릴 만큼 또렷", score: { targeting: 2, j: 1 } },
        { value: "demo", label: "연령·성별 정도는 잡혀 있다", score: { targeting: 1, s: 1 } },
        { value: "broad", label: "‘관심 있을 만한 사람’ 정도로 넓다", score: { targeting: 1 } },
        { value: "all", label: "최대한 많은 사람에게 뿌린다", score: { targeting: 0 } },
      ],
    },
    {
      id: "target_message",
      type: "single",
      q: "타겟에 따라 메시지를 바꾸나요?",
      required: true,
      options: [
        { value: "tailor", label: "타겟별로 카피·소재를 따로 만든다", score: { targeting: 2, t: 1 } },
        { value: "tweak", label: "큰 틀은 같고 문구만 조금 바꾼다", score: { targeting: 1 } },
        { value: "same", label: "하나의 소재를 모두에게 쓴다", score: { targeting: 0 } },
      ],
    },
    {
      id: "target_signal",
      type: "single",
      q: "‘타겟이 안 맞는다’는 신호를 무엇으로 잡나요?",
      required: true,
      options: [
        { value: "ctr", label: "클릭은 되는데 전환이 안 붙을 때", score: { targeting: 2, landing: 1 } },
        { value: "cheap", label: "노출은 싼데 엉뚱한 문의만 올 때", score: { targeting: 2 } },
        { value: "gut", label: "감으로 ‘좀 이상한데’ 느낄 때", score: { targeting: 1, n: 1 } },
        { value: "none", label: "그런 신호를 잘 못 본다", score: { targeting: 0 } },
      ],
    },
    {
      id: "landing_match",
      type: "single",
      q: "광고를 누른 사람이 랜딩에 도착했을 때, 첫인상은?",
      required: true,
      options: [
        { value: "seamless", label: "광고에서 본 그 약속이 그대로 이어진다", score: { landing: 2, j: 1 } },
        { value: "ok", label: "연결은 되는데 살짝 따로 논다", score: { landing: 1 } },
        { value: "gap", label: "광고와 랜딩이 꽤 다르다", score: { landing: 0 } },
      ],
    },
    {
      id: "landing_flow",
      type: "single",
      q: "랜딩 페이지의 구매 동선은 어떤가요?",
      required: true,
      options: [
        { value: "designed", label: "스크롤 순서·CTA 위치까지 설계돼 있다", score: { landing: 2, t: 1, j: 1 } },
        { value: "rough", label: "필요한 정보는 있지만 흐름은 대충", score: { landing: 1 } },
        { value: "messy", label: "정보가 흩어져 어디서 사야 할지 애매", score: { landing: 0 } },
      ],
    },
    {
      id: "landing_drop",
      type: "single",
      q: "들어와도 이탈이 잦다면, 먼저 손보는 곳은?",
      required: true,
      options: [
        { value: "above", label: "첫 화면(상단)의 카피·후킹", score: { landing: 1, hook: 1 } },
        { value: "proof", label: "후기·보장 같은 신뢰 요소", score: { landing: 2, f: 1 } },
        { value: "cta", label: "구매 버튼·결제 단계의 마찰", score: { landing: 2, t: 1 } },
        { value: "dunno", label: "어디가 문제인지 잘 모르겠다", score: { landing: 0 } },
      ],
    },
    {
      id: "offer_strength",
      type: "single",
      q: "지금 내미는 제안(가격·혜택)은 얼마나 거절하기 힘든가요?",
      required: true,
      options: [
        { value: "irresistible", label: "‘이 값에 이걸?’ 싶은 압도적 제안", score: { offer: 2, t: 1 } },
        { value: "decent", label: "경쟁사와 비슷한 수준은 된다", score: { offer: 1 } },
        { value: "weak", label: "가격 말곤 내세울 게 없다", score: { offer: 0 } },
      ],
    },
    {
      id: "offer_urgency",
      type: "single",
      q: "‘지금 사야 할 이유’를 만들고 있나요?",
      required: true,
      options: [
        { value: "strong", label: "기한·수량·보너스로 지금을 만든다", score: { offer: 2, j: 1 } },
        { value: "some", label: "가끔 할인·이벤트 정도", score: { offer: 1, p: 1 } },
        { value: "none", label: "딱히 없다, 알아서 사겠지", score: { offer: 0 } },
      ],
    },
    {
      id: "weakest_link",
      type: "single",
      q: "솔직히, 지금 광고에서 가장 새는 구멍은?",
      required: true,
      options: [
        { value: "hook", label: "애초에 시선을 못 끈다(노출→클릭)", score: { hook: 2 } },
        { value: "targeting", label: "엉뚱한 사람에게 돈을 쓴다", score: { targeting: 2 } },
        { value: "landing", label: "들어와도 페이지에서 빠져나간다", score: { landing: 2 } },
        { value: "offer", label: "마지막에 제안이 약해 안 산다", score: { offer: 2 } },
      ],
    },
  ],

  // ---------------- 콘텐츠 전략 진단 (12문항) ----------------
  "content-strategy": [
    {
      id: "clarity_oneline",
      type: "single",
      q: "‘이 채널은 한마디로 ___ 다’를 지금 바로 채울 수 있나요?",
      required: true,
      options: [
        { value: "sharp", label: "한 문장으로 또렷하게 말할 수 있다", score: { clarity: 2, j: 1 } },
        { value: "rough", label: "설명하면 길어지지만 핵심은 있다", score: { clarity: 1 } },
        { value: "vary", label: "그때그때 주제가 바뀐다", score: { clarity: 0, p: 1 } },
      ],
    },
    {
      id: "clarity_who",
      type: "single",
      q: "‘누구를 위한’ 콘텐츠인지 정해져 있나요?",
      required: true,
      options: [
        { value: "one", label: "한 명의 독자가 또렷이 그려진다", score: { clarity: 2, f: 1 } },
        { value: "group", label: "대략의 집단 정도는 안다", score: { clarity: 1 } },
        { value: "anyone", label: "보는 사람 누구나라고 생각한다", score: { clarity: 0 } },
      ],
    },
    {
      id: "clarity_topic",
      type: "single",
      q: "다룰 주제를 고르는 기준은?",
      required: true,
      options: [
        { value: "pillar", label: "정해둔 핵심 주제(필러) 안에서만 고른다", score: { clarity: 2, j: 1 } },
        { value: "mix", label: "핵심 + 끌리는 것 적당히 섞는다", score: { clarity: 1, p: 1 } },
        { value: "mood", label: "그날 떠오르는 걸 올린다", score: { clarity: 0, n: 1 } },
      ],
    },
    {
      id: "consistency_cadence",
      type: "single",
      q: "발행 리듬은 어떤가요?",
      required: true,
      options: [
        { value: "fixed", label: "요일·주기를 정해 기계처럼 지킨다", score: { consistency: 2, j: 1 } },
        { value: "loose", label: "대략 주 몇 회 느낌으로 한다", score: { consistency: 1 } },
        { value: "burst", label: "몰아 했다가 한참 쉰다", score: { consistency: 0, p: 1 } },
      ],
    },
    {
      id: "consistency_stock",
      type: "single",
      q: "콘텐츠를 미리 쌓아두고(재고) 운영하나요?",
      required: true,
      options: [
        { value: "bank", label: "며칠~몇 주치를 미리 만들어 둔다", score: { consistency: 2, j: 1, s: 1 } },
        { value: "near", label: "직전에 겨우 만든다", score: { consistency: 1 } },
        { value: "live", label: "그때그때 즉흥으로 만든다", score: { consistency: 0, p: 1 } },
      ],
    },
    {
      id: "consistency_block",
      type: "single",
      q: "꾸준함이 무너지는 가장 큰 이유는?",
      required: true,
      options: [
        { value: "idea", label: "쓸 소재가 떨어진다", score: { consistency: 1, clarity: 1 } },
        { value: "time", label: "제작 시간이 너무 든다", score: { consistency: 1, format: 1 } },
        { value: "reaction", label: "반응이 없어 힘이 빠진다", score: { consistency: 1, f: 1 } },
        { value: "fine", label: "딱히 안 무너진다", score: { consistency: 2 } },
      ],
    },
    {
      id: "format_fit",
      type: "single",
      q: "주제에 맞는 형식(포맷)을 고르는 감각은?",
      required: true,
      options: [
        { value: "good", label: "내용에 맞춰 글·카드·영상을 골라 쓴다", score: { format: 2, n: 1 } },
        { value: "habit", label: "익숙한 한 가지 포맷만 쓴다", score: { format: 1, s: 1 } },
        { value: "none", label: "포맷은 별로 신경 안 쓴다", score: { format: 0 } },
      ],
    },
    {
      id: "format_hook",
      type: "single",
      q: "콘텐츠의 ‘구성(도입-전개-마무리)’은 어떤가요?",
      required: true,
      options: [
        { value: "template", label: "검증된 틀·템플릿을 가지고 있다", score: { format: 2, j: 1 } },
        { value: "sense", label: "감으로 그때그때 짠다", score: { format: 1, p: 1 } },
        { value: "dump", label: "할 말을 그냥 쏟아낸다", score: { format: 0 } },
      ],
    },
    {
      id: "format_repurpose",
      type: "single",
      q: "하나의 콘텐츠를 여러 형식으로 재활용하나요?",
      required: true,
      options: [
        { value: "yes", label: "긴 글→숏폼→카드처럼 쪼개 돌려쓴다", score: { format: 2, t: 1 } },
        { value: "some", label: "가끔 옮겨본다", score: { format: 1 } },
        { value: "no", label: "한 번 쓰고 끝", score: { format: 0 } },
      ],
    },
    {
      id: "funnel_path",
      type: "single",
      q: "콘텐츠를 본 사람이 다음에 갈 곳이 있나요?",
      required: true,
      options: [
        { value: "designed", label: "프로필·링크·CTA로 동선이 설계돼 있다", score: { funnel: 2, j: 1 } },
        { value: "weak", label: "프로필에 링크 정도는 있다", score: { funnel: 1 } },
        { value: "none", label: "보고 나면 끝, 다음 단계가 없다", score: { funnel: 0 } },
      ],
    },
    {
      id: "funnel_cta",
      type: "single",
      q: "콘텐츠 안에서 행동을 유도(CTA)하나요?",
      required: true,
      options: [
        { value: "always", label: "저장·댓글·링크 클릭을 매번 유도한다", score: { funnel: 2, e: 1 } },
        { value: "sometimes", label: "가끔 ‘문의 주세요’ 정도", score: { funnel: 1 } },
        { value: "never", label: "유도하면 부담될까 봐 안 한다", score: { funnel: 0, i: 1 } },
      ],
    },
    {
      id: "funnel_result",
      type: "single",
      q: "콘텐츠가 실제 문의·매출로 이어지나요?",
      required: true,
      options: [
        { value: "track", label: "어떤 콘텐츠가 전환을 냈는지 추적한다", score: { funnel: 2, t: 1 } },
        { value: "occasion", label: "가끔 문의가 들어온다", score: { funnel: 1 } },
        { value: "likes", label: "반응만 있고 전환은 안 보인다", score: { funnel: 0 } },
      ],
    },
  ],

  // ---------------- 인스타그램 운영 진단 (12문항) ----------------
  instagram: [
    {
      id: "concept_identity",
      type: "single",
      q: "낯선 사람이 프로필에 처음 닿았을 때, 무슨 계정인지 바로 알까요?",
      required: true,
      options: [
        { value: "instant", label: "3초 안에 ‘아, 이런 계정’ 하고 안다", score: { concept: 2, j: 1 } },
        { value: "scroll", label: "몇 게시물 봐야 감이 온다", score: { concept: 1 } },
        { value: "mixed", label: "잡화점처럼 정체가 흐릿하다", score: { concept: 0, p: 1 } },
      ],
    },
    {
      id: "concept_bio",
      type: "single",
      q: "프로필 소개(바이오)는 어떤 상태인가요?",
      required: true,
      options: [
        { value: "pitch", label: "누구에게 뭘 주는지 + 행동 유도까지 있다", score: { concept: 2, convert: 1 } },
        { value: "plain", label: "이름·키워드 정도만 적혀 있다", score: { concept: 1 } },
        { value: "empty", label: "거의 비어 있거나 사적인 문구", score: { concept: 0 } },
      ],
    },
    {
      id: "concept_niche",
      type: "single",
      q: "콘텐츠 주제의 폭은?",
      required: true,
      options: [
        { value: "narrow", label: "한 분야로 좁게 파고든다", score: { concept: 2, i: 1 } },
        { value: "related", label: "관련된 몇 갈래를 오간다", score: { concept: 1 } },
        { value: "wide", label: "관심 가는 건 다 올린다", score: { concept: 0, n: 1 } },
      ],
    },
    {
      id: "visual_consistency",
      type: "single",
      q: "피드를 한눈에 봤을 때 톤·색감은?",
      required: true,
      options: [
        { value: "unified", label: "색·폰트·여백이 통일돼 브랜드 같다", score: { visual: 2, j: 1 } },
        { value: "soso", label: "그럭저럭, 큰 위화감은 없다", score: { visual: 1 } },
        { value: "random", label: "게시물마다 제각각이다", score: { visual: 0, p: 1 } },
      ],
    },
    {
      id: "visual_cover",
      type: "single",
      q: "첫 장(커버) 디자인에 들이는 공은?",
      required: true,
      options: [
        { value: "hook", label: "멈추게 할 카피·구도를 매번 설계한다", score: { visual: 2, n: 1 } },
        { value: "template", label: "정해둔 템플릿에 내용만 바꾼다", score: { visual: 1, s: 1 } },
        { value: "raw", label: "찍은 사진을 거의 그대로 올린다", score: { visual: 0 } },
      ],
    },
    {
      id: "visual_quality",
      type: "single",
      q: "이미지·영상의 기본 퀄리티는?",
      required: true,
      options: [
        { value: "high", label: "구도·조명·편집까지 신경 쓴다", score: { visual: 2, t: 1 } },
        { value: "ok", label: "보기 무난한 수준", score: { visual: 1 } },
        { value: "low", label: "흔들리거나 거친 게 섞여 있다", score: { visual: 0 } },
      ],
    },
    {
      id: "consistency_cadence",
      type: "single",
      q: "업로드 빈도는?",
      required: true,
      options: [
        { value: "high", label: "주 3회 이상 규칙적으로", score: { consistency: 2, j: 1 } },
        { value: "weekly", label: "주 1회 정도", score: { consistency: 1 } },
        { value: "rare", label: "생각날 때만, 뜸하다", score: { consistency: 0, p: 1 } },
      ],
    },
    {
      id: "consistency_format",
      type: "single",
      q: "릴스·스토리·게시물을 어떻게 운영하나요?",
      required: true,
      options: [
        { value: "system", label: "각 포맷 역할을 정해 돌린다", score: { consistency: 2, j: 1 } },
        { value: "some", label: "주로 한두 포맷만 쓴다", score: { consistency: 1 } },
        { value: "post", label: "게시물만 가끔 올린다", score: { consistency: 0 } },
      ],
    },
    {
      id: "consistency_plan",
      type: "single",
      q: "다음에 올릴 게 미리 정해져 있나요?",
      required: true,
      options: [
        { value: "calendar", label: "콘텐츠 캘린더로 며칠치가 잡혀 있다", score: { consistency: 2, s: 1, j: 1 } },
        { value: "rough", label: "대충 머릿속에 있다", score: { consistency: 1, n: 1 } },
        { value: "blank", label: "매번 ‘오늘 뭐 올리지’ 한다", score: { consistency: 0 } },
      ],
    },
    {
      id: "convert_path",
      type: "single",
      q: "팔로워가 고객·문의로 가는 길이 있나요?",
      required: true,
      options: [
        { value: "funnel", label: "DM·링크·하이라이트로 동선이 짜여 있다", score: { convert: 2, j: 1 } },
        { value: "link", label: "프로필 링크 정도", score: { convert: 1 } },
        { value: "none", label: "팔로워는 늘어도 매출 길은 없다", score: { convert: 0 } },
      ],
    },
    {
      id: "convert_cta",
      type: "single",
      q: "게시물에서 다음 행동을 유도하나요?",
      required: true,
      options: [
        { value: "always", label: "저장·DM·링크 클릭을 매번 건다", score: { convert: 2, e: 1 } },
        { value: "sometimes", label: "가끔 ‘문의 주세요’", score: { convert: 1 } },
        { value: "never", label: "유도는 거의 안 한다", score: { convert: 0, i: 1 } },
      ],
    },
    {
      id: "convert_dm",
      type: "single",
      q: "DM·댓글로 들어온 관심을 어떻게 처리하나요?",
      required: true,
      options: [
        { value: "flow", label: "응대→상담→판매로 이어지는 흐름이 있다", score: { convert: 2, t: 1 } },
        { value: "reply", label: "친절히 답은 하지만 거기서 끝", score: { convert: 1, f: 1 } },
        { value: "miss", label: "놓치거나 잘 못 챙긴다", score: { convert: 0 } },
      ],
    },
  ],

  // ---------------- 유튜브 운영 진단 (12문항) ----------------
  youtube: [
    {
      id: "plan_topic",
      type: "single",
      q: "영상 주제를 정할 때 출발점은?",
      required: true,
      options: [
        { value: "search", label: "사람들이 검색·궁금해하는 것에서 역산한다", score: { plan: 2, t: 1, j: 1 } },
        { value: "want", label: "내가 하고 싶은 이야기에서 시작한다", score: { plan: 1, f: 1 } },
        { value: "mood", label: "그때그때 떠오르는 대로", score: { plan: 0, p: 1 } },
      ],
    },
    {
      id: "plan_structure",
      type: "single",
      q: "촬영 전에 구성(대본·흐름)을 짜나요?",
      required: true,
      options: [
        { value: "script", label: "흐름·핵심 포인트를 미리 설계한다", score: { plan: 2, j: 1 } },
        { value: "bullet", label: "키워드만 메모하고 찍는다", score: { plan: 1 } },
        { value: "freestyle", label: "그냥 카메라 켜고 말한다", score: { plan: 0, p: 1 } },
      ],
    },
    {
      id: "plan_series",
      type: "single",
      q: "채널의 큰 그림(시리즈·포지셔닝)이 있나요?",
      required: true,
      options: [
        { value: "clear", label: "어떤 채널로 키울지 방향이 또렷하다", score: { plan: 2, n: 1, j: 1 } },
        { value: "loose", label: "대략은 있지만 느슨하다", score: { plan: 1 } },
        { value: "none", label: "한 편 한 편 그냥 올린다", score: { plan: 0 } },
      ],
    },
    {
      id: "thumbnail_ctr",
      type: "single",
      q: "썸네일·제목으로 클릭을 끄는 편인가요?",
      required: true,
      options: [
        { value: "test", label: "여러 안을 만들고 클릭률로 고른다", score: { thumbnail: 2, t: 1 } },
        { value: "ok", label: "신경 쓰지만 감으로 정한다", score: { thumbnail: 1 } },
        { value: "weak", label: "대충 캡처 한 장 쓴다", score: { thumbnail: 0 } },
      ],
    },
    {
      id: "thumbnail_curiosity",
      type: "single",
      q: "제목을 지을 때 가장 신경 쓰는 것은?",
      required: true,
      options: [
        { value: "gap", label: "‘안 누르면 궁금한’ 호기심 격차를 만든다", score: { thumbnail: 2, n: 1 } },
        { value: "keyword", label: "검색 키워드를 정확히 넣는다", score: { thumbnail: 1, s: 1 } },
        { value: "plain", label: "내용을 그대로 적는다", score: { thumbnail: 0 } },
      ],
    },
    {
      id: "thumbnail_design",
      type: "single",
      q: "썸네일 디자인 일관성은?",
      required: true,
      options: [
        { value: "brand", label: "한눈에 ‘우리 채널’인 톤이 있다", score: { thumbnail: 2, j: 1 } },
        { value: "varies", label: "그때그때 다르다", score: { thumbnail: 1, p: 1 } },
        { value: "none", label: "디자인은 거의 안 한다", score: { thumbnail: 0 } },
      ],
    },
    {
      id: "retention_intro",
      type: "single",
      q: "영상 초반 30초를 어떻게 다루나요?",
      required: true,
      options: [
        { value: "hook", label: "결론·핵심을 앞당겨 이탈을 막는다", score: { retention: 2, t: 1 } },
        { value: "intro", label: "인사·채널 소개부터 한다", score: { retention: 0, f: 1 } },
        { value: "natural", label: "자연스럽게 본론으로 들어간다", score: { retention: 1 } },
      ],
    },
    {
      id: "retention_graph",
      type: "single",
      q: "시청 지속률(리텐션) 그래프를 보나요?",
      required: true,
      options: [
        { value: "analyze", label: "이탈 구간을 찾아 다음 편에 반영한다", score: { retention: 2, t: 1, j: 1 } },
        { value: "glance", label: "가끔 들여다본다", score: { retention: 1 } },
        { value: "never", label: "거의 안 본다", score: { retention: 0 } },
      ],
    },
    {
      id: "retention_pace",
      type: "single",
      q: "영상의 편집 호흡은?",
      required: true,
      options: [
        { value: "tight", label: "군더더기를 쳐내 빠르게 간다", score: { retention: 2, s: 1 } },
        { value: "medium", label: "보통 속도", score: { retention: 1 } },
        { value: "slow", label: "늘어지는 구간이 꽤 있다", score: { retention: 0 } },
      ],
    },
    {
      id: "output_cadence",
      type: "single",
      q: "업로드 꾸준함은?",
      required: true,
      options: [
        { value: "regular", label: "정해진 주기로 꾸준히 올린다", score: { output: 2, j: 1 } },
        { value: "irregular", label: "올릴 때만 올린다", score: { output: 1, p: 1 } },
        { value: "stalled", label: "한동안 멈춰 있다", score: { output: 0 } },
      ],
    },
    {
      id: "output_workflow",
      type: "single",
      q: "제작 워크플로(촬영·편집)는 어떤가요?",
      required: true,
      options: [
        { value: "system", label: "틀·템플릿이 있어 빠르게 찍어낸다", score: { output: 2, t: 1, j: 1 } },
        { value: "manual", label: "매번 처음부터 새로 한다", score: { output: 1 } },
        { value: "stuck", label: "편집에서 늘 막혀 늦어진다", score: { output: 0 } },
      ],
    },
    {
      id: "output_batch",
      type: "single",
      q: "영상을 미리 쌓아두나요?",
      required: true,
      options: [
        { value: "bank", label: "몇 편을 미리 만들어 둔다", score: { output: 2, s: 1, j: 1 } },
        { value: "near", label: "업로드 직전에 겨우 완성", score: { output: 1 } },
        { value: "none", label: "재고 없이 그때그때", score: { output: 0, p: 1 } },
      ],
    },
  ],

  // ---------------- 숏폼 글쓰기 진단 (12문항) ----------------
  "shortform-writing": [
    {
      id: "hook_firstline",
      type: "single",
      q: "글의 첫 줄, 당신은 보통 어떻게 시작하나요?",
      required: true,
      options: [
        { value: "punch", label: "한 방 있는 단언·도발로 멈추게 한다", score: { hook: 2, t: 1 } },
        { value: "question", label: "‘혹시 너도?’ 싶은 질문을 던진다", score: { hook: 1, empathy: 1 } },
        { value: "context", label: "상황 설명부터 차분히 깐다", score: { hook: 0, s: 1 } },
      ],
    },
    {
      id: "hook_scroll",
      type: "single",
      q: "‘이 글은 끝까지 읽히겠다’는 감을 어떻게 잡나요?",
      required: true,
      options: [
        { value: "tension", label: "첫 줄에 궁금증·긴장을 심었는지로", score: { hook: 2, n: 1 } },
        { value: "reread", label: "내가 다시 읽어도 안 지루한지로", score: { hook: 1 } },
        { value: "post", label: "그냥 올리고 본다", score: { hook: 0, p: 1 } },
      ],
    },
    {
      id: "hook_cut",
      type: "single",
      q: "글을 다 쓴 뒤, 첫 문장을 다듬는 편인가요?",
      required: true,
      options: [
        { value: "rewrite", label: "첫 줄만 따로 여러 번 고쳐 쓴다", score: { hook: 2, j: 1 } },
        { value: "sometimes", label: "가끔 손본다", score: { hook: 1 } },
        { value: "leave", label: "처음 쓴 대로 둔다", score: { hook: 0 } },
      ],
    },
    {
      id: "insight_angle",
      type: "single",
      q: "같은 소재를 다룰 때 당신의 글은?",
      required: true,
      options: [
        { value: "twist", label: "남들과 다른 각도·관점을 낸다", score: { insight: 2, n: 1 } },
        { value: "deep", label: "한 가지를 깊게 파고든다", score: { insight: 2, t: 1, i: 1 } },
        { value: "summary", label: "정보를 깔끔히 정리해준다", score: { insight: 1, s: 1 } },
        { value: "same", label: "대체로 무난한 이야기", score: { insight: 0 } },
      ],
    },
    {
      id: "insight_source",
      type: "single",
      q: "글감(인사이트)은 주로 어디서 나오나요?",
      required: true,
      options: [
        { value: "experience", label: "직접 겪은 경험에서 뽑아낸다", score: { insight: 2, s: 1 } },
        { value: "connect", label: "여러 정보를 엮어 새 결론을 낸다", score: { insight: 2, n: 1, t: 1 } },
        { value: "curate", label: "남의 좋은 내용을 정리·인용한다", score: { insight: 1 } },
        { value: "dry", label: "요즘 쓸 거리가 잘 안 떠오른다", score: { insight: 0 } },
      ],
    },
    {
      id: "insight_takeaway",
      type: "single",
      q: "독자가 글을 다 읽고 남는 것은?",
      required: true,
      options: [
        { value: "aha", label: "‘오 그렇구나’ 하는 한 줄의 깨달음", score: { insight: 2, t: 1 } },
        { value: "feel", label: "‘맞아, 내 얘기야’ 하는 공감", score: { insight: 1, empathy: 1, f: 1 } },
        { value: "nothing", label: "딱히 남는 게 약하다", score: { insight: 0 } },
      ],
    },
    {
      id: "empathy_voice",
      type: "single",
      q: "글의 말투(보이스)는 어떤가요?",
      required: true,
      options: [
        { value: "honest", label: "솔직하고 진짜 ‘사람 냄새’가 난다", score: { empathy: 2, f: 1 } },
        { value: "warm", label: "다정하게 독자에게 말 걸듯 쓴다", score: { empathy: 2, e: 1 } },
        { value: "neutral", label: "정보 전달 위주로 담백하다", score: { empathy: 1, t: 1 } },
        { value: "stiff", label: "딱딱하다는 말을 듣는다", score: { empathy: 0 } },
      ],
    },
    {
      id: "empathy_react",
      type: "single",
      q: "댓글·반응을 어떻게 대하나요?",
      required: true,
      options: [
        { value: "active", label: "하나하나 답하며 대화를 잇는다", score: { empathy: 2, e: 1 } },
        { value: "selective", label: "중요한 것만 가끔 답한다", score: { empathy: 1 } },
        { value: "ignore", label: "거의 보지 않는다", score: { empathy: 0, i: 1 } },
      ],
    },
    {
      id: "empathy_pain",
      type: "single",
      q: "독자의 ‘아픈 지점’을 글에 얼마나 녹이나요?",
      required: true,
      options: [
        { value: "core", label: "그들의 고민을 내 말처럼 짚어준다", score: { empathy: 2, f: 1 } },
        { value: "some", label: "가끔 의식한다", score: { empathy: 1 } },
        { value: "self", label: "주로 내 하고 싶은 말을 한다", score: { empathy: 0 } },
      ],
    },
    {
      id: "consistency_cadence",
      type: "single",
      q: "글을 얼마나 자주 쓰나요?",
      required: true,
      options: [
        { value: "daily", label: "거의 매일 쓴다", score: { consistency: 2, j: 1 } },
        { value: "weekly", label: "주 1~2회", score: { consistency: 1 } },
        { value: "rare", label: "어쩌다 한 번", score: { consistency: 0, p: 1 } },
      ],
    },
    {
      id: "consistency_habit",
      type: "single",
      q: "글쓰기는 당신에게 어떤 일인가요?",
      required: true,
      options: [
        { value: "routine", label: "정해진 시간에 쓰는 루틴이다", score: { consistency: 2, j: 1, s: 1 } },
        { value: "mood", label: "기분·영감이 와야 쓴다", score: { consistency: 1, p: 1, n: 1 } },
        { value: "burden", label: "쓰려면 늘 미루게 된다", score: { consistency: 0 } },
      ],
    },
    {
      id: "consistency_idea",
      type: "single",
      q: "쓸 거리를 어떻게 관리하나요?",
      required: true,
      options: [
        { value: "bank", label: "소재 노트를 만들어 쌓아둔다", score: { consistency: 2, s: 1 } },
        { value: "memory", label: "떠오르면 머릿속에 둔다", score: { consistency: 1, n: 1 } },
        { value: "none", label: "쓸 때마다 백지에서 시작", score: { consistency: 0 } },
      ],
    },
  ],

  // ---------------- 크리에이터 적성 진단 (12문항) ----------------
  "creator-fit": [
    {
      id: "plan_format",
      type: "single",
      q: "콘텐츠를 만든다면 더 끌리는 형식은?",
      required: true,
      options: [
        { value: "long", label: "기승전결이 있는 긴 영상·글", score: { plan: 2, j: 1 } },
        { value: "visual", label: "사진·감성 비주얼 위주", score: { face: 2 } },
        { value: "short", label: "빠르게 터지는 숏폼", score: { trend: 2, p: 1 } },
        { value: "daily", label: "일상·소통 기반", score: { consistency: 1, face: 1 } },
      ],
    },
    {
      id: "plan_prep",
      type: "single",
      q: "콘텐츠를 만들기 전에 당신은?",
      required: true,
      options: [
        { value: "outline", label: "구성·흐름을 짜야 마음이 놓인다", score: { plan: 2, j: 1 } },
        { value: "rough", label: "큰 줄기만 잡고 나머지는 즉흥", score: { plan: 1, p: 1 } },
        { value: "wing", label: "그냥 바로 시작한다", score: { trend: 1, p: 1 } },
      ],
    },
    {
      id: "plan_depth",
      type: "single",
      q: "‘좋은 콘텐츠’에 대한 당신의 기준은?",
      required: true,
      options: [
        { value: "value", label: "끝까지 볼 가치가 있는 알찬 내용", score: { plan: 2, t: 1 } },
        { value: "vibe", label: "분위기·감성이 살아 있는 것", score: { face: 2, f: 1 } },
        { value: "viral", label: "지금 반응이 터지는 것", score: { trend: 2 } },
      ],
    },
    {
      id: "face_camera",
      type: "single",
      q: "카메라 앞에 서는 건 당신에게?",
      required: true,
      options: [
        { value: "love", label: "오히려 신나고 에너지가 난다", score: { face: 2, e: 1 } },
        { value: "ok", label: "적응하면 괜찮다", score: { face: 1, consistency: 1 } },
        { value: "behind", label: "얼굴 없이 만드는 게 편하다", score: { plan: 1, i: 1 } },
      ],
    },
    {
      id: "face_express",
      type: "single",
      q: "사람들 앞에서 나를 드러내는 것에 대해?",
      required: true,
      options: [
        { value: "natural", label: "감정·생각을 표현하는 게 자연스럽다", score: { face: 2, e: 1, f: 1 } },
        { value: "selective", label: "골라서 어느 정도는 보여준다", score: { face: 1 } },
        { value: "private", label: "사적인 노출은 부담된다", score: { plan: 1, i: 1 } },
      ],
    },
    {
      id: "face_charm",
      type: "single",
      q: "사람들이 당신에게서 매력을 느끼는 지점은?",
      required: true,
      options: [
        { value: "presence", label: "표정·말투 같은 존재감·끼", score: { face: 2, e: 1 } },
        { value: "taste", label: "감각·취향·미감", score: { face: 1, n: 1 } },
        { value: "info", label: "아는 게 많고 설명을 잘함", score: { plan: 1, t: 1 } },
      ],
    },
    {
      id: "trend_speed",
      type: "single",
      q: "유행하는 밈·포맷을 캐치하는 속도는?",
      required: true,
      options: [
        { value: "fast", label: "누구보다 빨리 알아채고 써먹는다", score: { trend: 2, n: 1, p: 1 } },
        { value: "mid", label: "어느 정도는 따라간다", score: { trend: 1 } },
        { value: "slow", label: "관심이 적고 느린 편", score: { plan: 1, s: 1 } },
      ],
    },
    {
      id: "trend_remix",
      type: "single",
      q: "유행하는 포맷을 보면 당신은?",
      required: true,
      options: [
        { value: "remix", label: "내 식으로 바로 변주해 올려본다", score: { trend: 2, p: 1 } },
        { value: "watch", label: "괜찮으면 따라 해본다", score: { trend: 1 } },
        { value: "skip", label: "유행보다 내 스타일을 고수한다", score: { plan: 1, face: 1 } },
      ],
    },
    {
      id: "trend_sense",
      type: "single",
      q: "‘이거 곧 뜰 것 같다’는 촉이 있나요?",
      required: true,
      options: [
        { value: "sharp", label: "자주 맞고, 먼저 올려본 적도 있다", score: { trend: 2, n: 1 } },
        { value: "sometimes", label: "가끔 맞는다", score: { trend: 1 } },
        { value: "none", label: "그런 촉은 별로 없다", score: { plan: 1 } },
      ],
    },
    {
      id: "consistency_daily",
      type: "single",
      q: "매일 콘텐츠를 올려야 한다면?",
      required: true,
      options: [
        { value: "routine", label: "루틴으로 만들어 꾸준히 할 수 있다", score: { consistency: 2, j: 1 } },
        { value: "batch", label: "몰아서라도 어떻게든 채운다", score: { consistency: 1, plan: 1 } },
        { value: "burden", label: "금방 지치고 부담된다", score: { consistency: 0, p: 1 } },
      ],
    },
    {
      id: "consistency_motive",
      type: "single",
      q: "반응이 한동안 없어도 계속할 수 있나요?",
      required: true,
      options: [
        { value: "yes", label: "결과와 상관없이 꾸준히 간다", score: { consistency: 2, j: 1 } },
        { value: "depends", label: "어느 정도 버티다 흔들린다", score: { consistency: 1 } },
        { value: "no", label: "반응 없으면 금세 식는다", score: { consistency: 0, f: 1 } },
      ],
    },
    {
      id: "consistency_growth",
      type: "single",
      q: "더 끌리는 성장 그림은?",
      required: true,
      options: [
        { value: "asset", label: "검색에 쌓이는 자산형 (느려도 꾸준)", score: { consistency: 2, plan: 1 } },
        { value: "viral", label: "한 방 바이럴로 확 뜨기", score: { trend: 2 } },
        { value: "brand", label: "감성·비주얼로 각인되는 브랜드", score: { face: 2 } },
        { value: "compound", label: "매일의 복리로 천천히 큰다", score: { consistency: 2, j: 1 } },
      ],
    },
  ],

  // ---------------- 자기 발견 진단 (12문항) ----------------
  "self-discovery": [
    {
      id: "flow",
      type: "single",
      q: "시간 가는 줄 모르고 몰입했던 순간, 당신은 뭘 하고 있었나요?",
      required: true,
      options: [
        { value: "create", label: "없던 걸 새로 구상하고 만들 때", score: { idea: 2, n: 1 } },
        { value: "finish", label: "목표를 하나씩 끝내며 진도 뺄 때", score: { drive: 2, j: 1 } },
        { value: "solve", label: "복잡한 문제를 분석해 답을 찾을 때", score: { logic: 2, t: 1 } },
        { value: "help", label: "누군가를 돕고 마음이 통했을 때", score: { empathy: 2, f: 1 } },
      ],
    },
    {
      id: "energy",
      type: "single",
      q: "지치고 방전됐을 때, 무엇이 당신을 다시 채우나요?",
      required: true,
      options: [
        { value: "alone", label: "혼자만의 시간·공간", score: { idea: 1, i: 1 } },
        { value: "people", label: "좋은 사람들과의 대화·만남", score: { empathy: 1, e: 1 } },
        { value: "win", label: "작은 성취·해낸 기록", score: { drive: 1, j: 1 } },
        { value: "learn", label: "새로운 걸 배우고 이해하는 것", score: { logic: 1, n: 1 } },
      ],
    },
    {
      id: "praise",
      type: "single",
      q: "살면서 가장 자주 들어온 칭찬은?",
      required: true,
      options: [
        { value: "creative", label: "“넌 생각이 진짜 남달라”", score: { idea: 2, n: 1 } },
        { value: "doer", label: "“넌 말한 건 진짜 해내더라”", score: { drive: 2, j: 1 } },
        { value: "smart", label: "“넌 설명을 잘하고 똑똑해”", score: { logic: 2, t: 1 } },
        { value: "warm", label: "“너랑 있으면 편하고 힘이 나”", score: { empathy: 2, f: 1 } },
      ],
    },
    {
      id: "decide",
      type: "single",
      q: "중요한 결정을 내릴 때, 최종적으로 따르는 건?",
      required: true,
      options: [
        { value: "logic", label: "객관적 사실과 논리", score: { logic: 2, t: 1 } },
        { value: "value", label: "내 가치관과 사람들에 미칠 영향", score: { empathy: 2, f: 1 } },
        { value: "result", label: "어느 쪽이 결과를 빨리 내는가", score: { drive: 1, t: 1 } },
        { value: "gut", label: "직관·가능성에 대한 끌림", score: { idea: 1, n: 1 } },
      ],
    },
    {
      id: "fear",
      type: "single",
      q: "당신이 가장 견디기 힘든 상황은?",
      required: true,
      options: [
        { value: "ordinary", label: "특별할 것 없이 남들과 똑같아지는 것", score: { idea: 1, i: 1 } },
        { value: "stuck", label: "아무것도 진척 없이 멈춰 있는 것", score: { drive: 1, j: 1 } },
        { value: "wrong", label: "틀리거나 무능해 보이는 것", score: { logic: 1, t: 1 } },
        { value: "alone", label: "관계가 끊기고 외면받는 것", score: { empathy: 1, f: 1 } },
      ],
    },
    {
      id: "role",
      type: "single",
      q: "팀 프로젝트에서 자연스럽게 맡게 되는 역할은?",
      required: true,
      options: [
        { value: "ideator", label: "방향·컨셉을 던지는 아이디어맨", score: { idea: 2, n: 1 } },
        { value: "driver", label: "일을 굴리고 마감을 책임지는 추진자", score: { drive: 2, j: 1 } },
        { value: "planner", label: "구조를 짜고 리스크를 챙기는 설계자", score: { logic: 2, j: 1 } },
        { value: "glue", label: "사람을 챙기고 분위기를 잇는 윤활유", score: { empathy: 2, e: 1, f: 1 } },
      ],
    },
    {
      id: "approach",
      type: "single",
      q: "낯선 과제를 받았을 때 첫 반응은?",
      required: true,
      options: [
        { value: "detail", label: "구체적 사실·사례부터 차근차근 파악", score: { logic: 1, s: 1 } },
        { value: "pattern", label: "전체 맥락·패턴부터 직관적으로 잡음", score: { idea: 1, n: 1 } },
        { value: "try", label: "일단 손대보며 부딪혀 익힘", score: { drive: 1, s: 1 } },
        { value: "ask", label: "관련된 사람에게 물어보며 시작", score: { empathy: 1, e: 1 } },
      ],
    },
    {
      id: "regret",
      type: "single",
      q: "요즘 가장 자주 드는 생각에 가까운 건?",
      required: true,
      options: [
        { value: "waste", label: "“내 능력을 제대로 못 쓰고 있는 것 같아”", score: { idea: 1, logic: 1 } },
        { value: "direction", label: "“열심히는 사는데 방향을 모르겠어”", score: { drive: 1, n: 1 } },
        { value: "compare", label: "“남들과 비교돼서 자꾸 불안해”", score: { empathy: 1, f: 1 } },
        { value: "burnout", label: "“다 잘하고 싶은데 지치고 벅차”", score: { logic: 1, j: 1 } },
      ],
    },
    {
      id: "social",
      type: "single",
      q: "여러 사람과 있을 때 당신은?",
      required: true,
      options: [
        { value: "lead", label: "분위기를 띄우고 대화를 주도한다", score: { empathy: 1, e: 1 } },
        { value: "listen", label: "주로 듣고 필요할 때만 말한다", score: { logic: 1, i: 1 } },
        { value: "spark", label: "엉뚱한 화제를 던져 판을 흔든다", score: { idea: 1, e: 1, n: 1 } },
        { value: "organize", label: "흩어진 얘기를 정리하고 결론을 낸다", score: { drive: 1, j: 1 } },
      ],
    },
    {
      id: "plan_life",
      type: "single",
      q: "여행이나 약속을 잡을 때 당신은?",
      required: true,
      options: [
        { value: "plan", label: "동선·예약까지 꼼꼼히 계획한다", score: { logic: 1, j: 1, s: 1 } },
        { value: "rough", label: "큰 틀만 잡고 나머진 즉흥으로", score: { idea: 1, p: 1, n: 1 } },
        { value: "go", label: "일단 떠나고 현장에서 정한다", score: { drive: 1, p: 1 } },
        { value: "follow", label: "같이 가는 사람에 맞춰준다", score: { empathy: 1, f: 1 } },
      ],
    },
    {
      id: "feedback",
      type: "single",
      q: "내 결과물에 대한 피드백을 받을 때, 가장 신경 쓰이는 말은?",
      required: true,
      options: [
        { value: "unoriginal", label: "“좀 뻔하다 / 새롭지 않다”", score: { idea: 1, n: 1 } },
        { value: "slow", label: "“진행이 느리다 / 결과가 없다”", score: { drive: 1, j: 1 } },
        { value: "sloppy", label: "“허술하다 / 논리가 약하다”", score: { logic: 1, t: 1 } },
        { value: "cold", label: "“차갑다 / 공감이 안 된다”", score: { empathy: 1, f: 1 } },
      ],
    },
    {
      id: "dream_day",
      type: "single",
      q: "아무 제약이 없다면, 가장 살고 싶은 하루는?",
      required: true,
      options: [
        { value: "make", label: "내 작업실에서 뭔가를 창작하는 하루", score: { idea: 1, i: 1, n: 1 } },
        { value: "achieve", label: "큰 목표를 향해 바쁘게 달리는 하루", score: { drive: 1, j: 1 } },
        { value: "study", label: "관심 분야를 깊이 파고드는 하루", score: { logic: 1, i: 1, t: 1 } },
        { value: "with", label: "사랑하는 사람들과 함께하는 하루", score: { empathy: 1, e: 1, f: 1 } },
      ],
    },
  ],

  // ---------------- 목적 발견 진단 (12문항) ----------------
  purpose: [
    {
      id: "achieve_thrill",
      type: "single",
      q: "일하면서 가장 짜릿했던 순간은?",
      required: true,
      options: [
        { value: "win", label: "어려운 목표를 끝내 해냈을 때", score: { achieve: 2, j: 1 } },
        { value: "free", label: "누구 간섭 없이 내 방식대로 했을 때", score: { freedom: 2, p: 1 } },
        { value: "help", label: "누군가에게 진짜 도움이 됐을 때", score: { contribute: 2, f: 1 } },
        { value: "calm", label: "모든 게 안정적으로 굴러갈 때", score: { stability: 2, s: 1 } },
      ],
    },
    {
      id: "achieve_drive",
      type: "single",
      q: "당신을 아침에 일어나게 하는 힘에 가까운 건?",
      required: true,
      options: [
        { value: "grow", label: "어제보다 나아지는 성장감", score: { achieve: 2, n: 1 } },
        { value: "own", label: "내 삶을 내가 정한다는 감각", score: { freedom: 2 } },
        { value: "matter", label: "내가 누군가에게 필요하다는 느낌", score: { contribute: 2, f: 1 } },
        { value: "secure", label: "내일이 불안하지 않다는 안심", score: { stability: 2 } },
      ],
    },
    {
      id: "achieve_success",
      type: "single",
      q: "‘성공’에 가장 가까운 정의는?",
      required: true,
      options: [
        { value: "top", label: "내 분야에서 정상에 오르는 것", score: { achieve: 2, t: 1 } },
        { value: "master", label: "내 시간의 주인이 되는 것", score: { freedom: 2 } },
        { value: "legacy", label: "좋은 영향을 남기는 것", score: { contribute: 2, n: 1 } },
        { value: "base", label: "흔들리지 않는 기반을 갖는 것", score: { stability: 2, s: 1 } },
      ],
    },
    {
      id: "freedom_money",
      type: "single",
      q: "평생 쓸 돈이 생겨도 계속하고 싶은 것은?",
      required: true,
      options: [
        { value: "challenge", label: "더 크고 어려운 도전", score: { achieve: 2 } },
        { value: "life", label: "원하는 곳에서 원하는 대로 사는 삶", score: { freedom: 2, p: 1 } },
        { value: "give", label: "세상에 보탬이 되는 일", score: { contribute: 2, f: 1 } },
        { value: "peace", label: "편안하고 평온한 일상", score: { stability: 2 } },
      ],
    },
    {
      id: "freedom_choice",
      type: "single",
      q: "두 일자리 중 하나만 고른다면?",
      required: true,
      options: [
        { value: "high", label: "빡세지만 크게 성장하는 곳", score: { achieve: 2, j: 1 } },
        { value: "flex", label: "돈은 덜 줘도 시간이 자유로운 곳", score: { freedom: 2, p: 1 } },
        { value: "mission", label: "의미 있는 일을 하는 곳", score: { contribute: 2 } },
        { value: "safe", label: "월급이 안정적인 곳", score: { stability: 2 } },
      ],
    },
    {
      id: "freedom_constraint",
      type: "single",
      q: "당신을 가장 답답하게 만드는 건?",
      required: true,
      options: [
        { value: "stuck", label: "성장 없이 제자리걸음", score: { achieve: 2 } },
        { value: "control", label: "일일이 통제·간섭받는 것", score: { freedom: 2, p: 1 } },
        { value: "empty", label: "아무 의미 없는 일", score: { contribute: 2, n: 1 } },
        { value: "unstable", label: "앞날이 불확실한 것", score: { stability: 2, s: 1 } },
      ],
    },
    {
      id: "contribute_proud",
      type: "single",
      q: "사람들에게 가장 듣고 싶은 말은?",
      required: true,
      options: [
        { value: "best", label: "“넌 정말 대단해, 최고야”", score: { achieve: 2, t: 1 } },
        { value: "envy", label: "“넌 진짜 자유롭게 산다”", score: { freedom: 2 } },
        { value: "thanks", label: "“네 덕분에 정말 도움이 됐어”", score: { contribute: 2, f: 1 } },
        { value: "trust", label: "“넌 항상 든든하고 믿음직해”", score: { stability: 2 } },
      ],
    },
    {
      id: "contribute_work",
      type: "single",
      q: "이상적인 일의 모습에 가까운 건?",
      required: true,
      options: [
        { value: "impactful", label: "성과로 증명되는 일", score: { achieve: 2 } },
        { value: "autonomous", label: "내가 설계하고 끌어가는 일", score: { freedom: 2 } },
        { value: "meaningful", label: "누군가의 삶을 바꾸는 일", score: { contribute: 2, n: 1, f: 1 } },
        { value: "steady", label: "꾸준하고 예측 가능한 일", score: { stability: 2, s: 1 } },
      ],
    },
    {
      id: "contribute_legacy",
      type: "single",
      q: "먼 훗날 어떻게 기억되고 싶나요?",
      required: true,
      options: [
        { value: "achiever", label: "“많은 걸 이뤄낸 사람”", score: { achieve: 2 } },
        { value: "freeman", label: "“자기답게 산 사람”", score: { freedom: 2 } },
        { value: "giver", label: "“많은 이를 도운 사람”", score: { contribute: 2, f: 1 } },
        { value: "rock", label: "“늘 곁에서 든든했던 사람”", score: { stability: 2 } },
      ],
    },
    {
      id: "stability_risk",
      type: "single",
      q: "리스크 앞에서 당신은?",
      required: true,
      options: [
        { value: "bold", label: "크게 먹으려면 크게 걸어야지", score: { achieve: 2, t: 1 } },
        { value: "free", label: "내가 감당하면 그만, 자유롭게 건다", score: { freedom: 2, p: 1 } },
        { value: "care", label: "주변에 피해 안 가는지부터 본다", score: { contribute: 1, f: 1 } },
        { value: "safe", label: "되도록 안전한 길을 택한다", score: { stability: 2, s: 1, j: 1 } },
      ],
    },
    {
      id: "stability_worry",
      type: "single",
      q: "요즘 가장 자주 드는 걱정은?",
      required: true,
      options: [
        { value: "behind", label: "‘이러다 뒤처지는 거 아닌가’", score: { achieve: 2 } },
        { value: "trapped", label: "‘이 틀에 갇힌 거 아닌가’", score: { freedom: 2 } },
        { value: "pointless", label: "‘이게 무슨 의미가 있나’", score: { contribute: 2, n: 1 } },
        { value: "future", label: "‘앞으로 괜찮을까’", score: { stability: 2 } },
      ],
    },
    {
      id: "lack_now",
      type: "single",
      q: "요즘 당신 삶에 가장 부족하다고 느끼는 건?",
      required: true,
      options: [
        { value: "achieve", label: "성장감·성취", score: { achieve: 2 } },
        { value: "freedom", label: "자유·자율", score: { freedom: 2 } },
        { value: "contribute", label: "의미·기여", score: { contribute: 2 } },
        { value: "stability", label: "안정·안심", score: { stability: 2 } },
      ],
    },
  ],

  // ---------------- 우선순위 정리 진단 (12문항) ----------------
  priority: [
    {
      id: "impact_criteria",
      type: "single",
      q: "할 일을 고를 때 가장 먼저 보는 기준은?",
      required: true,
      options: [
        { value: "impact", label: "결과 임팩트가 큰가", score: { impact: 2, t: 1 } },
        { value: "urgent", label: "지금 급한가(마감)", score: { urgent: 2 } },
        { value: "skill", label: "내가 잘하는가", score: { skill: 2 } },
        { value: "desire", label: "하고 싶은가", score: { desire: 2, f: 1 } },
      ],
    },
    {
      id: "impact_bigrock",
      type: "single",
      q: "‘이것만 되면 나머진 덜 중요해지는’ 큰 일이 있나요?",
      required: true,
      options: [
        { value: "clear", label: "또렷하게 하나 있다", score: { impact: 2, j: 1 } },
        { value: "vague", label: "어렴풋이 있다", score: { impact: 1, n: 1 } },
        { value: "none", label: "다 비슷비슷해 보인다", score: { impact: 0 } },
      ],
    },
    {
      id: "impact_leverage",
      type: "single",
      q: "‘한 번 해두면 두고두고 편해지는’ 일에 시간을 쓰나요?",
      required: true,
      options: [
        { value: "yes", label: "시스템·자산 만드는 일을 챙긴다", score: { impact: 2, n: 1, j: 1 } },
        { value: "sometimes", label: "급할 때만 잠깐", score: { impact: 1 } },
        { value: "no", label: "늘 눈앞의 일에 쫓긴다", score: { impact: 0, urgent: 1 } },
      ],
    },
    {
      id: "urgent_firefight",
      type: "single",
      q: "요즘 하루의 대부분은 무엇으로 채워지나요?",
      required: true,
      options: [
        { value: "fire", label: "급한 불 끄기", score: { urgent: 2 } },
        { value: "plan", label: "계획한 중요한 일", score: { impact: 2, j: 1 } },
        { value: "habit", label: "익숙해서 그냥 하는 일", score: { skill: 1, s: 1 } },
        { value: "drift", label: "이것저것 끌려다니다 끝남", score: { urgent: 1, p: 1 } },
      ],
    },
    {
      id: "urgent_react",
      type: "single",
      q: "갑자기 ‘급한 요청’이 들어오면?",
      required: true,
      options: [
        { value: "filter", label: "정말 급한지 따져보고 거른다", score: { impact: 1, t: 1, j: 1 } },
        { value: "drop", label: "하던 걸 멈추고 바로 처리한다", score: { urgent: 2 } },
        { value: "guilt", label: "거절을 못 해 다 떠안는다", score: { urgent: 1, f: 1 } },
      ],
    },
    {
      id: "urgent_waste",
      type: "single",
      q: "돌아보면 ‘안 해도 됐는데’ 싶은 일이 많나요?",
      required: true,
      options: [
        { value: "few", label: "거의 없다, 잘 거른다", score: { impact: 2, j: 1 } },
        { value: "some", label: "꽤 많다", score: { urgent: 1 } },
        { value: "lots", label: "절반은 그런 일 같다", score: { urgent: 2 } },
      ],
    },
    {
      id: "skill_strength",
      type: "single",
      q: "지금 하는 일이 당신의 강점과 얼마나 맞나요?",
      required: true,
      options: [
        { value: "fit", label: "잘하는 걸로 승부하고 있다", score: { skill: 2, t: 1 } },
        { value: "half", label: "절반쯤만 맞는다", score: { skill: 1 } },
        { value: "off", label: "약점을 메우느라 바쁘다", score: { skill: 0 } },
      ],
    },
    {
      id: "skill_delegate",
      type: "single",
      q: "내가 못하거나 약한 일을 어떻게 하나요?",
      required: true,
      options: [
        { value: "delegate", label: "맡기거나 도구로 넘긴다", score: { skill: 2, t: 1, j: 1 } },
        { value: "try", label: "어떻게든 직접 붙든다", score: { skill: 1, s: 1 } },
        { value: "stuck", label: "거기서 늘 시간을 잡아먹힌다", score: { skill: 0 } },
      ],
    },
    {
      id: "skill_value",
      type: "single",
      q: "당신이 ‘대체 불가’한 일은 무엇인지 아나요?",
      required: true,
      options: [
        { value: "clear", label: "또렷이 알고 거기에 시간을 쏟는다", score: { skill: 2, j: 1 } },
        { value: "rough", label: "대략은 안다", score: { skill: 1, n: 1 } },
        { value: "no", label: "잘 모르겠다", score: { skill: 0 } },
      ],
    },
    {
      id: "desire_energy",
      type: "single",
      q: "지금 일과에서 ‘하고 싶어서’ 하는 일의 비중은?",
      required: true,
      options: [
        { value: "high", label: "꽤 많다, 즐겁다", score: { desire: 2, f: 1 } },
        { value: "some", label: "조금 있다", score: { desire: 1 } },
        { value: "none", label: "거의 의무로만 채워져 있다", score: { desire: 0 } },
      ],
    },
    {
      id: "desire_drain",
      type: "single",
      q: "하고 나면 진을 빼는 ‘에너지 도둑’ 일이 있나요?",
      required: true,
      options: [
        { value: "cut", label: "있고, 줄이려 손쓰고 있다", score: { desire: 2, j: 1 } },
        { value: "endure", label: "있지만 그냥 참고 한다", score: { desire: 1 } },
        { value: "many", label: "그런 일투성이라 방전된다", score: { desire: 0 } },
      ],
    },
    {
      id: "fix_now",
      type: "single",
      q: "지금 가장 필요한 정리는?",
      required: true,
      options: [
        { value: "impact", label: "임팩트 큰 일 중심으로 재정렬", score: { impact: 2 } },
        { value: "urgent", label: "급한 일·잡일 쳐내기", score: { urgent: 2 } },
        { value: "skill", label: "잘하는 일에 집중·위임", score: { skill: 2 } },
        { value: "desire", label: "하고 싶은 일 되찾기", score: { desire: 2 } },
      ],
    },
  ],

  // ---------------- 일하는 방식 진단 (12문항) ----------------
  "work-style": [
    {
      id: "focus_best",
      type: "single",
      q: "일이 가장 잘 풀리는 순간은?",
      required: true,
      options: [
        { value: "deep", label: "방해 없이 깊게 몰입할 때", score: { focus: 2, i: 1 } },
        { value: "framed", label: "틀·계획이 잡혔을 때", score: { structure: 2, j: 1 } },
        { value: "together", label: "사람들과 머리를 맞댈 때", score: { collab: 2, e: 1 } },
        { value: "fast", label: "빠르게 쳐낼 때", score: { speed: 2, p: 1 } },
      ],
    },
    {
      id: "focus_env",
      type: "single",
      q: "집중이 가장 잘 되는 환경은?",
      required: true,
      options: [
        { value: "quiet", label: "혼자 조용한 공간", score: { focus: 2, i: 1 } },
        { value: "block", label: "일정에 ‘방해 금지’ 시간을 잡았을 때", score: { focus: 2, structure: 1, j: 1 } },
        { value: "buzz", label: "적당히 사람 소리가 있는 곳", score: { collab: 1, e: 1 } },
        { value: "deadline", label: "마감이 코앞일 때", score: { speed: 2, p: 1 } },
      ],
    },
    {
      id: "focus_distract",
      type: "single",
      q: "알림·메신저가 오면?",
      required: true,
      options: [
        { value: "off", label: "몰입 시간엔 아예 꺼둔다", score: { focus: 2, i: 1, j: 1 } },
        { value: "batch", label: "정해진 때 몰아서 본다", score: { focus: 1, structure: 1 } },
        { value: "instant", label: "바로바로 확인·응답한다", score: { collab: 1, speed: 1, e: 1 } },
      ],
    },
    {
      id: "structure_start",
      type: "single",
      q: "새 일을 받으면 가장 먼저?",
      required: true,
      options: [
        { value: "plan", label: "계획·단계부터 세운다", score: { structure: 2, j: 1 } },
        { value: "dig", label: "혼자 조용히 파고든다", score: { focus: 2, i: 1 } },
        { value: "ask", label: "관련된 사람과 먼저 논의", score: { collab: 2, e: 1 } },
        { value: "draft", label: "일단 초안부터 만든다", score: { speed: 2, p: 1 } },
      ],
    },
    {
      id: "structure_tool",
      type: "single",
      q: "할 일·정보를 어떻게 관리하나요?",
      required: true,
      options: [
        { value: "system", label: "툴·체계로 깔끔히 정리한다", score: { structure: 2, j: 1, s: 1 } },
        { value: "list", label: "간단한 메모·리스트 정도", score: { structure: 1 } },
        { value: "head", label: "주로 머릿속에 둔다", score: { structure: 0, p: 1, n: 1 } },
      ],
    },
    {
      id: "structure_stress",
      type: "single",
      q: "가장 스트레스받는 상황은?",
      required: true,
      options: [
        { value: "chaos", label: "무계획·즉흥으로 굴러갈 때", score: { structure: 2, j: 1 } },
        { value: "interrupt", label: "잦은 방해·회의로 끊길 때", score: { focus: 2, i: 1 } },
        { value: "alone", label: "혼자 고립돼 일할 때", score: { collab: 2, e: 1 } },
        { value: "slow", label: "진행이 느리고 답답할 때", score: { speed: 2, p: 1 } },
      ],
    },
    {
      id: "collab_energy",
      type: "single",
      q: "협업할 때 당신은?",
      required: true,
      options: [
        { value: "thrive", label: "함께할수록 아이디어·에너지가 난다", score: { collab: 2, e: 1 } },
        { value: "selective", label: "필요한 만큼만 협업하고 나머진 혼자", score: { focus: 1, i: 1 } },
        { value: "drain", label: "회의가 많으면 진이 빠진다", score: { focus: 1, i: 1 } },
      ],
    },
    {
      id: "collab_delegate",
      type: "single",
      q: "일을 나누거나 위임하는 것에 대해?",
      required: true,
      options: [
        { value: "natural", label: "잘 나누고 사람을 잘 굴린다", score: { collab: 2, e: 1, t: 1 } },
        { value: "reluctant", label: "필요하면 하지만 직접이 편하다", score: { focus: 1 } },
        { value: "alone", label: "웬만하면 혼자 다 한다", score: { focus: 2, i: 1 } },
      ],
    },
    {
      id: "collab_feedback",
      type: "single",
      q: "일을 진행할 때 피드백·소통 방식은?",
      required: true,
      options: [
        { value: "frequent", label: "수시로 공유하며 함께 맞춰간다", score: { collab: 2, e: 1 } },
        { value: "milestone", label: "중요 시점에만 공유한다", score: { structure: 1, j: 1 } },
        { value: "final", label: "다 끝내고 결과만 보여준다", score: { focus: 1, i: 1 } },
      ],
    },
    {
      id: "speed_vs_quality",
      type: "single",
      q: "완성도 vs 속도, 더 가까운 쪽은?",
      required: true,
      options: [
        { value: "quality", label: "느려도 완성도 있게(깊게)", score: { focus: 2, structure: 1, j: 1 } },
        { value: "speed", label: "거칠어도 빠르게 내놓기", score: { speed: 2, p: 1 } },
        { value: "depends", label: "상황 따라 조절", score: { collab: 1, n: 1 } },
      ],
    },
    {
      id: "speed_iterate",
      type: "single",
      q: "결과물을 만들 때 당신은?",
      required: true,
      options: [
        { value: "ship", label: "일단 내놓고 고쳐가며 개선한다", score: { speed: 2, p: 1, n: 1 } },
        { value: "polish", label: "충분히 다듬은 뒤 내놓는다", score: { focus: 1, structure: 1, j: 1 } },
        { value: "balance", label: "적당한 선에서 마무리한다", score: { speed: 1 } },
      ],
    },
    {
      id: "improve_now",
      type: "single",
      q: "지금 가장 개선하고 싶은 건?",
      required: true,
      options: [
        { value: "focus", label: "방해 없는 몰입 시간 확보", score: { focus: 2 } },
        { value: "structure", label: "체계·정리·계획", score: { structure: 2 } },
        { value: "collab", label: "협업·위임·소통", score: { collab: 2 } },
        { value: "speed", label: "실행 속도·추진력", score: { speed: 2 } },
      ],
    },
  ],
};

// fallback
export const FALLBACK_TEST: Question[] = [
  { id: "q1", type: "single", q: "이 진단은 준비 중입니다.", options: [{ value: "ok", label: "확인", score: {} }] },
];

// ============================================================
// 유료폼 질문 (결제 후 심층 입력) — Make 로 전송됨
// ============================================================
const GENERIC_PAID_FORM: Question[] = [
  { id: "context", type: "long", q: "현재 상황을 간단히 알려주세요.", placeholder: "지금 하고 있는 일/단계/규모 등", required: true },
  { id: "goal", type: "long", q: "이 진단으로 해결하고 싶은 목표 1가지는?", placeholder: "구체적일수록 리포트 품질이 올라갑니다.", required: true },
  { id: "obstacle", type: "long", q: "가장 큰 걸림돌이라고 느끼는 건?", placeholder: "솔직하게 적어주세요.", required: false },
  { id: "link", type: "text", q: "참고할 링크(SNS/홈페이지 등)가 있다면?", placeholder: "https://", required: false },
];

export const PAID_FORMS: Record<string, Question[]> = {
  "business-marketing": [
    { id: "biz_desc", type: "long", q: "어떤 사업을 하시나요? 제품/서비스를 한 단락으로.", placeholder: "무엇을, 누구에게, 어떻게 파는지", required: true },
    { id: "target_detail", type: "long", q: "주 고객은 누구인가요? 아는 만큼 구체적으로.", placeholder: "연령/성별/상황/고민 등", required: true },
    { id: "revenue", type: "single", q: "최근 월 매출 규모는?", required: true, options: [
      { value: "a", label: "~100만 원" }, { value: "b", label: "100~500만 원" },
      { value: "c", label: "500~3,000만 원" }, { value: "d", label: "3,000만 원 이상" },
    ]},
    { id: "channels_now", type: "long", q: "현재 마케팅 채널과 성과를 알려주세요.", placeholder: "예) 인스타 3천, 블로그 주 2회, 네이버 광고 월 50만 원", required: true },
    { id: "biggest_problem", type: "long", q: "가장 해결하고 싶은 문제 1가지는?", required: true },
    { id: "link", type: "text", q: "참고 링크(홈페이지/SNS/스토어)", placeholder: "https://", required: false },
  ],
  "business-item": [
    { id: "background", type: "long", q: "지금까지의 경력·경험을 간단히.", placeholder: "직무, 잘하는 일, 해본 사업 등", required: true },
    { id: "interest", type: "long", q: "관심 있는 분야/시장이 있다면?", placeholder: "여러 개여도 좋아요.", required: true },
    { id: "budget", type: "single", q: "초기 투자 가능 예산은?", required: true, options: [
      { value: "a", label: "거의 없음(무자본)" }, { value: "b", label: "~500만 원" },
      { value: "c", label: "500~3,000만 원" }, { value: "d", label: "3,000만 원 이상" },
    ]},
    { id: "time", type: "single", q: "주당 투입 가능 시간은?", required: true, options: [
      { value: "a", label: "5시간 이하(부업)" }, { value: "b", label: "10~20시간" }, { value: "c", label: "풀타임" },
    ]},
    { id: "constraint", type: "long", q: "꼭 지켜야 할 조건/제약이 있다면?", placeholder: "예: 재고 없이, 온라인만", required: false },
  ],
};

export function getFreeTest(slug: string): Question[] {
  return FREE_TESTS[slug] ?? FALLBACK_TEST;
}

export function getPaidForm(slug: string): Question[] {
  return PAID_FORMS[slug] ?? GENERIC_PAID_FORM;
}
