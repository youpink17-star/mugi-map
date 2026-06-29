// 무기지도(이 앱, 본체 위키)에서 무기진단(별도 진단 앱)으로 가는 외부 링크.
// 두 앱은 로그인/동기화 없이 URL 링크로만 연결된다. (content-factory 분리 패턴과 동일)
// 미설정 시 로컬 개발 기본값(무기진단 = 포트 3002).
export const DIAGNOSIS_URL = process.env.NEXT_PUBLIC_DIAGNOSIS_URL || "http://localhost:3002";

// 각 진단이 "이 칸을 채울 때 무엇을 얻는지" — 위키 섹션의 관련 진단 버튼 카피.
// 진단 본체는 무기진단 앱(별도)에 있고, 여기는 slug → 안내 문구만 둔다.
export interface DiagnosisInfo {
  slug: string;
  emoji: string;
  title: string;
  copy: string; // 이 진단을 쓰면 뭘 얻는지
}

export const DIAGNOSIS_INFO: Record<string, DiagnosisInfo> = {
  "self-discovery": {
    slug: "self-discovery",
    emoji: "🗝️",
    title: "자기 발견 진단",
    copy: "내 진짜 강점은 뭘까?",
  },
  purpose: {
    slug: "purpose",
    emoji: "🧭",
    title: "목적 발견 진단",
    copy: "내 진짜 욕구는 뭘까?",
  },
  "business-item": {
    slug: "business-item",
    emoji: "💎",
    title: "사업 아이템 발굴 진단",
    copy: "난 뭘 팔 수 있을까?",
  },
  "business-marketing": {
    slug: "business-marketing",
    emoji: "📊",
    title: "사업 전략·마케팅 진단",
    copy: "왜 안 팔리는 걸까?",
  },
  "content-strategy": {
    slug: "content-strategy",
    emoji: "📝",
    title: "콘텐츠 전략 진단",
    copy: "어떤 콘텐츠 방향으로 가야 할까?",
  },
  differentiation: {
    slug: "differentiation",
    emoji: "✨",
    title: "차별화 진단",
    copy: "왜 굳이 사야 할까?",
  },
  // 실행 우선순위 → '브랜드 방향성'으로 리튜닝. 브랜드 최종 방향성 칸 담당.
  priority: {
    slug: "priority",
    emoji: "🧭",
    title: "브랜드 방향성 진단",
    copy: "앞으로 어디로 가야 할까?",
  },
  // ad-conversion: 위키 추천엔 안 뜸(매핑 제외). 진단 앱 선택 도구.
  "ad-conversion": {
    slug: "ad-conversion",
    emoji: "📣",
    title: "광고 전환 진단",
    copy: "광고비가 어디서 새지?",
  },
};
