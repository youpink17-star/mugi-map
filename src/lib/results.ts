// 일반 진단(비즈니스 2종 제외 10종)의 결과 해석 스펙.
// scoring.ts 의 generic 경로에서 사용한다.

export interface TypeInfo {
  name: string; // 유형명
  oneLine: string; // 요약 첫 문장(강점 톤)
  action: string; // 추천 첫걸음
}

export interface ResultSpec {
  dims: string[]; // 차원 키 순서
  dimLabels: Record<string, string>;
  typeCardLabel: string; // 유형 카드 라벨 (예: "나의 광고 유형")
  types: Record<string, TypeInfo>; // 최강 차원 → 유형
  lowTips: Record<string, string>; // 최약 차원 → 보완 팁
}

export const RESULT_SPEC: Record<string, ResultSpec> = {
  // ---------------- 광고 전환 진단 ----------------
  "ad-conversion": {
    dims: ["hook", "targeting", "landing", "offer"],
    dimLabels: { hook: "후킹", targeting: "타겟팅", landing: "랜딩·상세", offer: "오퍼·가격" },
    typeCardLabel: "나의 광고 유형",
    types: {
      hook: { name: "후킹 장인형", oneLine: "시선을 멈추게 하는 첫 3초가 강점이에요.", action: "후킹 카피 3개를 A/B로 돌려보세요." },
      targeting: { name: "정밀 타겟형", oneLine: "누구에게 보여줄지 잘 아는 게 강점이에요.", action: "동일 타겟에 소재 3종을 로테이션하세요." },
      landing: { name: "전환 설계형", oneLine: "클릭을 구매로 잇는 동선이 탄탄해요.", action: "상단 후킹을 강화해 유입량을 늘리세요." },
      offer: { name: "오퍼 설계형", oneLine: "가격·혜택 구성이 매력적인 편이에요.", action: "후기·보증을 더해 구매 저항을 없애세요." },
    },
    lowTips: {
      hook: "첫 3초(썸네일·첫 문장)가 평범해요. 후킹부터 손보세요.",
      targeting: "아무에게나 뿌리고 있어요. 타겟을 한 명으로 좁히세요.",
      landing: "클릭은 되는데 상세에서 이탈해요. 랜딩을 점검하세요.",
      offer: "가격·혜택 매력이 약해요. 오퍼 구성을 다시 짜세요.",
    },
  },

  // ---------------- 콘텐츠 전략 진단 ----------------
  "content-strategy": {
    dims: ["clarity", "consistency", "format", "funnel"],
    dimLabels: { clarity: "메시지 명확성", consistency: "꾸준함", format: "포맷 적합도", funnel: "전환 연결" },
    typeCardLabel: "나의 콘텐츠 유형",
    types: {
      clarity: { name: "메시지 명확형", oneLine: "무엇을 말하는지 또렷한 게 강점이에요.", action: "핵심 메시지 1줄을 모든 콘텐츠 상단에 고정하세요." },
      consistency: { name: "꾸준 발행형", oneLine: "발행 리듬을 지키는 힘이 강점이에요.", action: "주제 캘린더로 2주치를 미리 쌓으세요." },
      format: { name: "포맷 감각형", oneLine: "주제에 맞는 형식을 잘 고르는 감각이 강점.", action: "잘 된 포맷 1개를 시리즈로 굳히세요." },
      funnel: { name: "전환 설계형", oneLine: "콘텐츠를 행동으로 잇는 설계가 강점.", action: "콘텐츠 끝마다 다음 행동 1개를 넣으세요." },
    },
    lowTips: {
      clarity: "메시지가 흩어져 있어요. ‘한 문장’으로 좁혀보세요.",
      consistency: "발행이 들쭉날쭉해요. 작게라도 주기를 정하세요.",
      format: "형식이 주제와 안 맞을 때가 있어요. 포맷부터 점검.",
      funnel: "반응은 오는데 전환이 없어요. 행동 동선을 만드세요.",
    },
  },

  // ---------------- 인스타그램 운영 진단 ----------------
  instagram: {
    dims: ["concept", "visual", "consistency", "convert"],
    dimLabels: { concept: "컨셉", visual: "비주얼", consistency: "꾸준함", convert: "전환" },
    typeCardLabel: "나의 계정 유형",
    types: {
      concept: { name: "컨셉 뚜렷형", oneLine: "계정이 뭘 하는 곳인지 분명한 게 강점.", action: "프로필 한 줄을 ‘누구에게 무엇’으로 다듬으세요." },
      visual: { name: "비주얼 강점형", oneLine: "톤·무드로 시선을 잡는 힘이 강점이에요.", action: "피드 9칸의 색·톤을 통일하세요." },
      consistency: { name: "성실 운영형", oneLine: "꾸준한 발행이 최고의 자산이에요.", action: "릴스 주 3회 고정 발행을 지켜보세요." },
      convert: { name: "전환 설계형", oneLine: "팔로워를 고객으로 잇는 동선이 강점.", action: "하이라이트·링크로 구매 동선을 정리하세요." },
    },
    lowTips: {
      concept: "계정 정체성이 흐려요. ‘한 줄 컨셉’을 정하세요.",
      visual: "피드 통일감이 약해요. 색·폰트 규칙을 만드세요.",
      consistency: "발행이 끊겨요. 작은 주기라도 고정하세요.",
      convert: "팔로워는 느는데 매출은 그대로. 전환 동선을 설계하세요.",
    },
  },

  // ---------------- 유튜브 운영 진단 ----------------
  youtube: {
    dims: ["plan", "thumbnail", "retention", "output"],
    dimLabels: { plan: "기획", thumbnail: "썸네일·제목", retention: "지속 시청", output: "발행력" },
    typeCardLabel: "나의 채널 유형",
    types: {
      plan: { name: "기획 탄탄형", oneLine: "주제·구성을 설계하는 힘이 강점이에요.", action: "한 주제로 5편 시리즈를 묶어보세요." },
      thumbnail: { name: "클릭 유발형", oneLine: "썸네일·제목으로 클릭을 끄는 감각이 강점.", action: "도입 30초로 클릭을 시청으로 이으세요." },
      retention: { name: "몰입 설계형", oneLine: "끝까지 보게 만드는 구성이 강점이에요.", action: "검색 키워드를 노려 노출을 키우세요." },
      output: { name: "꾸준 발행형", oneLine: "지속적인 업로드가 큰 무기예요.", action: "기획 템플릿으로 편당 시간을 줄이세요." },
    },
    lowTips: {
      plan: "주제가 매번 즉흥적이에요. 기획 틀을 만드세요.",
      thumbnail: "내용은 좋은데 클릭이 안 돼요. 썸네일·제목부터.",
      retention: "초반 이탈이 커요. 도입 30초를 다시 짜세요.",
      output: "업로드가 끊겨요. 발행 리듬을 고정하세요.",
    },
  },

  // ---------------- 숏폼 글쓰기 진단 ----------------
  "shortform-writing": {
    dims: ["hook", "insight", "empathy", "consistency"],
    dimLabels: { hook: "후킹", insight: "통찰", empathy: "공감", consistency: "꾸준함" },
    typeCardLabel: "나의 글쓰기 유형",
    types: {
      hook: { name: "첫 문장 장인형", oneLine: "스크롤을 멈추게 하는 첫 줄이 강점이에요.", action: "훅 문장 20개를 미리 저장해두세요." },
      insight: { name: "인사이트형", oneLine: "남다른 관점으로 생각을 주는 게 강점.", action: "관점 1개를 ‘짧은 글+긴 글’로 변주하세요." },
      empathy: { name: "공감 연결형", oneLine: "마음을 건드려 대화를 여는 힘이 강점.", action: "댓글에서 나온 말을 다음 글감으로 쓰세요." },
      consistency: { name: "꾸준 발행형", oneLine: "매일 쓰는 성실함이 최고의 무기예요.", action: "하루 1줄 생각 + 주 1편 긴 글 루틴을." },
    },
    lowTips: {
      hook: "첫 줄이 밋밋해요. 훅부터 강하게 쓰세요.",
      insight: "정보만 있고 관점이 약해요. ‘내 생각’을 더하세요.",
      empathy: "혼잣말처럼 느껴져요. 독자를 부르듯 쓰세요.",
      consistency: "발행이 끊겨요. 짧게라도 매일 쓰세요.",
    },
  },

  // ---------------- 크리에이터 적성 진단 ----------------
  "creator-fit": {
    dims: ["plan", "face", "trend", "consistency"],
    dimLabels: { plan: "기획력", face: "노출·표현", trend: "트렌드 감각", consistency: "꾸준함" },
    typeCardLabel: "나의 크리에이터 유형",
    types: {
      plan: { name: "유튜브형 기획러", oneLine: "깊이 있는 기획으로 신뢰를 쌓는 타입.", action: "추천: 유튜브/블로그. 한 주제 5편 시리즈부터." },
      face: { name: "인스타·릴스형 비주얼러", oneLine: "감각과 무드로 시선을 잡는 타입.", action: "추천: 인스타/릴스. 통일된 피드 9칸부터." },
      trend: { name: "숏폼 트렌드 헌터", oneLine: "빠른 감각으로 흐름을 타는 타입.", action: "추천: 릴스/쇼츠/틱톡. 하루 1개 짧게." },
      consistency: { name: "꾸준함의 장인", oneLine: "성실함이 곧 무기인 롱런 타입.", action: "추천: 무엇이든 OK. 주 3회 고정 발행부터." },
    },
    lowTips: {
      plan: "기획 틀이 약해요. 시작 전 구성부터 잡으세요.",
      face: "노출이 부담스러워요. 얼굴 없는 포맷도 좋아요.",
      trend: "트렌드를 놓쳐요. 매일 5분 트렌드 체크를.",
      consistency: "꾸준함이 약해요. 가벼운 고정 루틴부터.",
    },
  },

  // ---------------- 자기 발견 진단 ----------------
  "self-discovery": {
    dims: ["idea", "drive", "logic", "empathy"],
    dimLabels: { idea: "창의", drive: "실행", logic: "분석", empathy: "관계" },
    typeCardLabel: "나의 강점 유형",
    types: {
      idea: { name: "아이디어 대장장이", oneLine: "세상에 없던 컨셉을 벼려내는 창작자.", action: "주 1개 아이디어를 끝까지 완성해보세요." },
      drive: { name: "돌격형 전사", oneLine: "일단 부딪혀 결과를 만드는 추진가.", action: "주간 회고로 ‘한 일 vs 효과’를 점검하세요." },
      logic: { name: "전략 책사", oneLine: "구조와 데이터로 길을 설계하는 참모.", action: "분석을 1장 요약 + 실행안까지 만들어보세요." },
      empathy: { name: "관계의 연금술사", oneLine: "사람 마음을 읽고 연결하는 조율가.", action: "내가 연결한 사람·성사시킨 일을 기록하세요." },
    },
    lowTips: {
      idea: "새 발상이 약하게 느껴질 수 있어요. 인풋을 늘리세요.",
      drive: "생각이 길어 실행이 늦어요. 작게 바로 시작하세요.",
      logic: "구조화가 약해요. 쪼개서 정리하는 연습을.",
      empathy: "혼자가 편해요. 가끔은 의견을 먼저 물어보세요.",
    },
  },

  // ---------------- 목적 발견 진단 ----------------
  purpose: {
    dims: ["achieve", "freedom", "contribute", "stability"],
    dimLabels: { achieve: "성취", freedom: "자유", contribute: "기여", stability: "안정" },
    typeCardLabel: "나의 동기 유형",
    types: {
      achieve: { name: "성취 추구형", oneLine: "성장과 성과에서 에너지를 얻는 타입.", action: "분기마다 ‘이긴 게임’ 목표를 1개 세우세요." },
      freedom: { name: "자유 추구형", oneLine: "주도권과 유연함을 가장 중시하는 타입.", action: "시간·방식의 자율을 지키는 일을 우선하세요." },
      contribute: { name: "기여 추구형", oneLine: "누군가에게 도움이 될 때 충만한 타입.", action: "‘누구의 무엇을 돕는가’를 목표에 새기세요." },
      stability: { name: "안정 추구형", oneLine: "예측 가능함과 지속성을 중시하는 타입.", action: "리스크는 작게 쪼개 단계적으로 시도하세요." },
    },
    lowTips: {
      achieve: "성취 압박이 공허로 올 수 있어요. ‘왜’를 적어두세요.",
      freedom: "자유가 적어 답답해요. 자율 영역을 확보하세요.",
      contribute: "의미가 옅어요. 누구를 돕는지 다시 보세요.",
      stability: "불안정이 힘이 빠지게 해요. 안전판을 만드세요.",
    },
  },

  // ---------------- 우선순위 정리 진단 ----------------
  priority: {
    dims: ["impact", "urgent", "skill", "desire"],
    dimLabels: { impact: "임팩트", urgent: "긴급", skill: "역량", desire: "욕구" },
    typeCardLabel: "나의 우선순위 유형",
    types: {
      impact: { name: "임팩트 집중형", oneLine: "큰 결과를 내는 일을 보는 눈이 강점.", action: "‘임팩트 큰 1개’만 이번 주에 끝내세요." },
      urgent: { name: "긴급 대응형", oneLine: "급한 불을 빠르게 끄는 순발력이 강점.", action: "긴급함과 중요함을 분리해 표시하세요." },
      skill: { name: "역량 활용형", oneLine: "잘하는 일로 성과를 내는 효율형.", action: "잘하는 영역에 시간 비중을 더 주세요." },
      desire: { name: "열정 우선형", oneLine: "하고 싶은 일에서 추진력이 나오는 타입.", action: "욕구와 임팩트가 겹치는 1개를 고르세요." },
    },
    lowTips: {
      impact: "바쁜데 성과가 옅어요. 임팩트 기준으로 다시 줄 세우세요.",
      urgent: "급한 일에 끌려다녀요. 중요한 일을 먼저 예약하세요.",
      skill: "안 맞는 일에 시간을 써요. 위임·제거를 고려하세요.",
      desire: "의무감만 남았어요. 하고 싶은 일을 1개 넣으세요.",
    },
  },

  // ---------------- 일하는 방식 진단 ----------------
  "work-style": {
    dims: ["focus", "structure", "collab", "speed"],
    dimLabels: { focus: "몰입", structure: "구조", collab: "협업", speed: "속도" },
    typeCardLabel: "나의 워크스타일 유형",
    types: {
      focus: { name: "딥워크형", oneLine: "방해 없이 깊게 파고들 때 강한 타입.", action: "하루 2시간 ‘방해 금지’ 블록을 만드세요." },
      structure: { name: "체계 설계형", oneLine: "틀과 프로세스를 만들면 잘하는 타입.", action: "반복 업무를 체크리스트로 자동화하세요." },
      collab: { name: "협업 시너지형", oneLine: "함께 굴릴 때 에너지가 나는 타입.", action: "혼자 일도 짧은 공유 루프를 만드세요." },
      speed: { name: "스피드 실행형", oneLine: "빠르게 쳐내며 흐름을 타는 타입.", action: "완벽보다 ‘초안 먼저’ 원칙을 지키세요." },
    },
    lowTips: {
      focus: "잔업무에 집중이 깨져요. 몰입 시간을 보호하세요.",
      structure: "즉흥적이라 놓치는 게 많아요. 틀을 만드세요.",
      collab: "혼자 떠안아요. 가끔은 함께·위임하세요.",
      speed: "완벽주의로 느려져요. 마감을 먼저 정하세요.",
    },
  },
};
