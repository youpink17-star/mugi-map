// Supabase 가 아직 연결되지 않은 환경에서도 전체 플로우를 시연할 수 있도록
// id 안에 데이터를 인코딩하는 demo 폴백. (서버에서만 사용)
const PREFIX = "demo.";

export function isDemoId(id: string): boolean {
  return id.startsWith(PREFIX);
}

export function encodeDemo(obj: unknown): string {
  return PREFIX + Buffer.from(JSON.stringify(obj)).toString("base64url");
}

export function decodeDemo<T = unknown>(id: string): T | null {
  try {
    return JSON.parse(Buffer.from(id.slice(PREFIX.length), "base64url").toString()) as T;
  } catch {
    return null;
  }
}
