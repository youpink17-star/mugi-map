// 정직한 통계 표기 헬퍼.
// 거짓 수치 금지. 실제 누적 데이터가 충분할 때만 % 를 보여주고,
// 그 전에는 "경로 서술" 또는 "참고 통계(출처 명시)" 로 대체한다.

import type { ProfileType } from "./profile";

// 신뢰할 만한 % 를 보여주려면 최소 이 표본 수가 필요(예시 기준)
export const MIN_SAMPLE_FOR_PERCENT = 100;

// 유형별 성공 경로 — 숫자 없이도 성립하는 정직한 서술
// (N 이 쌓이면 아래 percent 자리에 실제 집계값을 넣는다)
export interface RouteStat {
  label: string; // "콘텐츠 사업"
  note: string; // 정직한 보조 설명
}

// 외부 공신력 통계 (출처 명시 — 실제 인용 가능한 일반 사실 위주)
export const MARKET_FACTS: string[] = [
  "1인 지식창업 시장은 매년 빠르게 성장하고 있습니다 (출처: 중소벤처기업부 1인 창조기업 실태조사)",
  "크리에이터의 다수가 콘텐츠 이후 ‘교육·멤버십’으로 수익을 확장합니다 (출처: 크리에이터 이코노미 리포트)",
];

// 현재 표본으로 % 를 보여줘도 되는지 판단
export function canShowPercent(sampleSize: number): boolean {
  return sampleSize >= MIN_SAMPLE_FOR_PERCENT;
}

// 정직한 사회적 증거 문장 생성
// sampleSize: 실제 누적 진단 수 (서버/스토어에서 주입)
export function socialProofLine(type: ProfileType, sampleSize: number): string {
  if (canShowPercent(sampleSize)) {
    // 실제 데이터가 충분할 때만 % (지금은 자리만, 운영 시 집계값 주입)
    return `지금까지 ${type.name} 진단자 ${sampleSize.toLocaleString("ko-KR")}명의 실제 선택을 분석했습니다`;
  }
  // 표본 부족 → 숫자 대신 경로 서술 (거짓 없음)
  return `${type.name}은 보통 이 경로로 자리를 잡습니다`;
}
