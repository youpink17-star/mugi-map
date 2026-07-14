"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restoreFromBackup, loadWiki, completionRate } from "@/lib/wikiStore";

export default function RestorePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 이 기기에 이미 어느 정도 채운 위키가 있으면, 덮어쓰기 전에 먼저 확인받는다.
        const existing = loadWiki();
        if (existing && completionRate(existing) > 0) {
          const ok = window.confirm(
            "이 기기에 이미 작성 중인 위키가 있어요. 복구 링크의 내용으로 덮어쓸까요? (되돌릴 수 없어요)"
          );
          if (!ok) {
            router.replace("/wiki");
            return;
          }
        }

        const res = await fetch(`/api/wiki/restore/${params.code}`);
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !data?.wiki) {
          setStatus("error");
          return;
        }
        restoreFromBackup(data.wiki);
        router.replace("/wiki");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.code, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      {status === "loading" ? (
        <p className="text-[14px] font-semibold text-muted">위키를 불러오는 중…</p>
      ) : (
        <>
          <p className="text-[15px] font-bold text-ink">복구 코드를 찾을 수 없어요.</p>
          <p className="text-[13px] text-muted">링크가 정확한지 확인해주세요.</p>
        </>
      )}
    </div>
  );
}
