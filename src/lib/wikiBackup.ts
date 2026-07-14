// ============================================================
//  위키 복구 백업 — 로그인 없이, Netlify Blobs에 위키 스냅샷을 저장.
//  "복구 코드"만 알면 다른 기기에서 같은 위키를 이어서 열 수 있다.
//  Blobs 사용 불가(로컬 개발 등)한 환경에서는 에러를 던져서
//  호출부(API route)가 "지금은 백업이 안 됩니다"로 처리하게 한다.
// ============================================================

import "server-only";

const STORE_NAME = "mugi-wiki-backups";
const CODE_RE = /^[a-z0-9]{10,20}$/;

function randomCode(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 14);
}

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}

// code가 없으면 새로 발급, 있으면 그 코드에 덮어쓴다. 저장된 code를 반환.
export async function backupWiki(code: string | null, wiki: unknown): Promise<string> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore(STORE_NAME);
  const key = code && isValidCode(code) ? code : randomCode();
  await store.setJSON(key, { wiki, updatedAt: new Date().toISOString() });
  return key;
}

export async function restoreWiki(code: string): Promise<unknown | null> {
  if (!isValidCode(code)) return null;
  const { getStore } = await import("@netlify/blobs");
  const store = getStore(STORE_NAME);
  const val = (await store.get(code, { type: "json" })) as { wiki: unknown } | null;
  return val?.wiki ?? null;
}
