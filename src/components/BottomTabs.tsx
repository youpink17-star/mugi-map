"use client";
import Link from "next/link";

// 하단 고정 탭 — 매일 들어와 빈칸을 채우게 만드는 핵심 내비.
// 본체는 "위키". "빈칸"은 비어 있는 칸으로 바로 데려가고, "노트"는 불편함 노트.
type TabId = "home" | "wiki" | "blanks" | "tools" | "notes";

const TABS: { id: TabId; label: string; emoji: string; href: string }[] = [
  { id: "home", label: "홈", emoji: "🏠", href: "/" },
  { id: "wiki", label: "사업 정리본", emoji: "📓", href: "/wiki" },
  { id: "blanks", label: "지도", emoji: "🗺️", href: "/wiki?view=blanks" },
  { id: "tools", label: "무기상점", emoji: "🛒", href: "/tools" },
  { id: "notes", label: "아이디어", emoji: "🗒️", href: "/notes" },
];

export default function BottomTabs({
  active,
  mobileOnly = false,
}: {
  active?: TabId;
  mobileOnly?: boolean;
}) {
  const hide = mobileOnly ? "md:hidden" : "";
  return (
    <>
      <div className={`h-[76px] ${hide}`} />
      {/* 바탕(흰 배경)만 화면 끝까지 이어지고, 탭 내용은 본문과 같은 폭으로 가운데 정렬 */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-40 w-full border-t border-line bg-white/95 pb-[max(env(safe-area-inset-bottom),0px)] backdrop-blur ${hide}`}
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {TABS.map((t) => {
            const on = t.id === active;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={[
                  "flex flex-col items-center gap-1 py-3.5 text-[10px] font-bold transition",
                  on ? "text-pink" : "text-muted",
                ].join(" ")}
              >
                <span className="text-[18px] leading-none">{t.emoji}</span>
                <span className="leading-tight">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
