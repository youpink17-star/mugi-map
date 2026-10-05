"use client";
import { useEffect, useState } from "react";
import { getBackupCode, syncWikiBackup, buildRecoveryUrl } from "@/lib/wikiBackupClient";
import { getOrCreateWiki } from "@/lib/wikiStore";

// 로그인 없이 다른 기기에서 위키를 이어보는 복구 링크. 한 번 만들면
// WikiWorkspace의 자동 백업이 그 코드로 계속 최신 내용을 동기화한다.
export default function WikiBackupLink() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(getBackupCode());
  }, []);

  async function generate() {
    setLoading(true);
    const wiki = getOrCreateWiki();
    const newCode = await syncWikiBackup(wiki);
    setLoading(false);
    if (newCode) setCode(newCode);
    else alert("지금은 복구 링크를 만들 수 없어요. 잠시 후 다시 시도해주세요.");
  }

  async function copy() {
    if (!code) return;
    const url = buildRecoveryUrl(code);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      alert(url);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-[12px] font-extrabold text-ink">다른 기기에서 이어보기</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        가입 없이, 이 링크만 저장해두면 다른 기기에서도 이 정리본을 이어서 쓸 수 있어요.
      </p>
      {code ? (
        <button
          onClick={copy}
          className="mt-3 w-full rounded-xl border border-line bg-app-bg px-3.5 py-2 text-[13px] font-bold text-ink"
        >
          {copied ? "복사됨 ✓" : "복구 링크 복사하기"}
        </button>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 w-full rounded-xl border border-line bg-app-bg px-3.5 py-2 text-[13px] font-bold text-ink disabled:opacity-50"
        >
          {loading ? "만드는 중…" : "복구 링크 만들기"}
        </button>
      )}
    </div>
  );
}
