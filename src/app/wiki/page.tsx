import { Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import WikiWorkspace from "@/components/wiki/WikiWorkspace";
import BottomTabs from "@/components/BottomTabs";

export default function WikiPage({
  searchParams,
}: {
  searchParams?: { view?: string };
}) {
  // 빈칸 모드(?view=blanks)면 하단 탭의 '빈칸'을 활성화
  const active = searchParams?.view === "blanks" ? "blanks" : "wiki";
  return (
    <>
      <AppHeader title="내 사업 위키" />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center py-24 text-[14px] text-muted">
              내 사업 위키를 불러오는 중…
            </div>
          }
        >
          <WikiWorkspace />
        </Suspense>
      </main>
      {/* 데스크톱(작업실)에서는 하단 탭 숨김, 모바일에서만 노출 */}
      <BottomTabs active={active} mobileOnly />
    </>
  );
}
