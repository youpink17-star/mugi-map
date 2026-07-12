"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppHeader({
  title,
  showBack = false,
}: {
  title?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-line bg-white/90 backdrop-blur">
      {/* 바탕은 화면 끝까지, 내용물(로고·메뉴)은 본문과 같은 폭으로 가운데 정렬 */}
      <div className="relative mx-auto flex h-16 max-w-2xl items-center px-5">
        {showBack ? (
          <button
            aria-label="뒤로"
            onClick={() => router.back()}
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-app-bg"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-[17px]">🗺️</span>
            <span className="text-[16px] font-extrabold tracking-tight text-navy">무기지도</span>
          </Link>
        )}

        {title && (
          <span className="mx-auto truncate px-2 text-[15px] font-bold text-ink">{title}</span>
        )}

        <button
          aria-label="메뉴"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-app-bg"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-5 top-16 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-card">
            <MenuLink href="/" onClick={() => setOpen(false)}>홈</MenuLink>
            <MenuLink href="/wiki" onClick={() => setOpen(false)}>내 사업 위키</MenuLink>
            <MenuLink href="/diagnosis" onClick={() => setOpen(false)}>무기진단</MenuLink>
            <MenuLink href="/tools" onClick={() => setOpen(false)}>무기상점</MenuLink>
            <MenuLink href="/notes" onClick={() => setOpen(false)}>아이디어 노트</MenuLink>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-semibold text-ink hover:bg-app-bg"
    >
      {children}
    </Link>
  );
}
