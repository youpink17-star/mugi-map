// 답안에 누적된 MBTI 4축(e/i, s/n, t/f, j/p)과 에니어그램 신호를 해석한다.

export function deriveMBTI(raw: Record<string, number>): string {
  const axis = (a: string, b: string, hi: string, lo: string) =>
    (raw[a] ?? 0) >= (raw[b] ?? 0) ? hi : lo;
  const ei = axis("e", "i", "E", "I");
  const sn = axis("s", "n", "S", "N");
  const tf = axis("t", "f", "T", "F");
  const jp = axis("j", "p", "J", "P");
  return `${ei}${sn}${tf}${jp}`;
}

export function deriveEnneagram(topDim: string, map: Record<string, string>): string {
  return map[topDim] ?? "탐구형";
}

const MBTI_NICK: Record<string, string> = {
  ENTJ: "지휘관", ENTP: "토론가", ENFJ: "선도자", ENFP: "활동가",
  ESTJ: "경영자", ESTP: "사업가", ESFJ: "집정관", ESFP: "연예인",
  INTJ: "전략가", INTP: "논리술사", INFJ: "옹호자", INFP: "중재자",
  ISTJ: "현실주의자", ISTP: "장인", ISFJ: "수호자", ISFP: "모험가",
};

export function mbtiLabel(code: string): string {
  return MBTI_NICK[code] ? `${code} · ${MBTI_NICK[code]}` : code;
}
