// ============================================================
//  공개 API 요청 제한 (IP + 라우트별). Netlify Blobs에 카운터를 저장해
//  서버리스 함수가 재시작돼도(콜드스타트) 제한이 유지되게 한다.
//  Blobs 사용 불가(로컬 개발 등) 시에는 제한 없이 통과시킨다.
// ============================================================

import "server-only";

const WINDOW_MS = 5 * 60 * 1000; // 5분
const MAX_REQUESTS = 20; // 5분당 IP+라우트별 20회 (위키 자동 백업이라 진단 폼보다 넉넉하게)
const STORE_NAME = "mugi-ratelimit";

export function getClientIp(req: Request): string {
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

// true = 허용, false = 제한 초과(차단)
export async function checkRateLimit(ip: string, routeKey: string): Promise<boolean> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(STORE_NAME);
    const key = `${routeKey}:${ip}`;
    const now = Date.now();
    const raw = (await store.get(key, { type: "json" })) as
      | { count: number; windowStart: number }
      | null;

    if (!raw || now - raw.windowStart > WINDOW_MS) {
      await store.setJSON(key, { count: 1, windowStart: now });
      return true;
    }
    if (raw.count >= MAX_REQUESTS) return false;
    await store.setJSON(key, { count: raw.count + 1, windowStart: raw.windowStart });
    return true;
  } catch {
    return true;
  }
}
