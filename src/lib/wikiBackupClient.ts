"use client";
// ============================================================
//  위키 복구 링크 — 클라이언트 쪽 유틸.
//  복구 코드는 로컬(localStorage)에 한 번 저장해두고,
//  이후 위키가 바뀔 때마다 그 코드로 서버(Netlify Blobs)에 조용히 백업한다.
// ============================================================

const CODE_KEY = "mugi_wiki_backup_code_v1";

export function getBackupCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CODE_KEY);
}

function setBackupCode(code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CODE_KEY, code);
}

// 위키를 백업하고(코드가 없으면 새로 발급) 성공한 코드를 반환. 실패하면 null.
export async function syncWikiBackup(wiki: unknown): Promise<string | null> {
  try {
    const code = getBackupCode();
    const res = await fetch("/api/wiki/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, wiki }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.code === "string") {
      setBackupCode(data.code);
      return data.code;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildRecoveryUrl(code: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/wiki/restore/${code}`;
}
