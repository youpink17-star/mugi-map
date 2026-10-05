"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restoreFromBackup, loadWiki, completionRate } from "@/lib/wikiStore";

type Status = "checking" | "confirm" | "loading" | "error";

export default function RestorePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");

  async function applyRestore() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/wiki/restore/${params.code}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.wiki) {
        setStatus("error");
        return;
      }
      restoreFromBackup(data.wiki);
      router.replace("/wiki");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    // 이 기기에 이미 어느 정도 채운 위키가 있으면, 덮어쓰기 전에 먼저 확인받는다.
    const existing = loadWiki();
    if (existing && completionRate(existing) > 0) {
      setStatus("confirm");
      return;
    }
    void applyRestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code]);

  if (status === "confirm") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card">
          <p className="text-[16px] font-extrabold text-ink">이 정리본을 덮어쓸까요?</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            이 기기에 이미 작성 중인 정리본이 있어요. 복구 링크의 내용으로 덮어쓰면{" "}
            <b className="font-bold text-ink">되돌릴 수 없어요.</b>
          </p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => router.replace("/wiki")}
              className="flex-1 rounded-xl border border-line bg-white py-3 text-[13.5px] font-bold text-ink"
            >
              취소
            </button>
            <button
              onClick={() => void applyRestore()}
              className="flex-1 rounded-xl bg-pink-grad py-3 text-[13.5px] font-extrabold text-white shadow-cta"
            >
              덮어쓰기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      {status === "checking" || status === "loading" ? (
        <p className="text-[14px] font-semibold text-muted">정리본을 불러오는 중…</p>
      ) : (
        <>
          <p className="text-[15px] font-bold text-ink">복구 코드를 찾을 수 없어요.</p>
          <p className="text-[13px] text-muted">링크가 정확한지 확인해주세요.</p>
        </>
      )}
    </div>
  );
}
