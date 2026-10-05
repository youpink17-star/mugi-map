"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBackupCode, syncWikiBackup, buildRecoveryUrl, extractRestoreCode } from "@/lib/wikiBackupClient";
import { getOrCreateWiki } from "@/lib/wikiStore";

export default function AppHeader({
  title,
  showBack = false,
}: {
  title?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

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

        <div className="ml-auto flex items-center gap-1">
          <button
            aria-label="저장 — 다른 기기에서 이어보기"
            onClick={() => {
              setSaveOpen((v) => !v);
              setOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-app-bg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M4.5 20c1.2-3.8 4.4-6 7.5-6s6.3 2.2 7.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            aria-label="메뉴"
            onClick={() => {
              setOpen((v) => !v);
              setSaveOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-app-bg"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="absolute right-5 top-16 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-card">
            <MenuLink href="/" onClick={() => setOpen(false)}>홈</MenuLink>
            <MenuLink href="/wiki" onClick={() => setOpen(false)}>사업 정리본</MenuLink>
            <MenuLink href="/uses" onClick={() => setOpen(false)}>지도 활용법</MenuLink>
            <MenuLink href="/diagnosis" onClick={() => setOpen(false)}>무기진단</MenuLink>
            <MenuLink href="/tools" onClick={() => setOpen(false)}>무기상점</MenuLink>
            <MenuLink href="/notes" onClick={() => setOpen(false)}>아이디어</MenuLink>
          </div>
        )}

        {saveOpen && <SavePopover onClose={() => setSaveOpen(false)} />}
      </div>
    </header>
  );
}

// 헤더의 "저장" 아이콘 팝오버 — 로그인 자리를 대신하는 복구 링크 발급/복원.
function SavePopover({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [pasteError, setPasteError] = useState("");

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

  function restore() {
    const found = extractRestoreCode(pasteValue);
    if (!found) {
      setPasteError("링크나 코드를 다시 확인해주세요.");
      return;
    }
    onClose();
    router.push(`/wiki/restore/${found}`);
  }

  return (
    <div className="absolute right-5 top-16 w-72 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-card">
      <p className="text-[13.5px] font-extrabold text-ink">다른 기기에서 이어보기</p>
      <p className="mt-1 text-[12px] leading-relaxed text-muted">
        가입 없이, 이 링크 하나가 곧 당신 데이터예요. 저장해두면 다른 기기에서도 이어서 쓸 수 있어요.
      </p>

      {code ? (
        <button
          onClick={copy}
          className="mt-3 w-full rounded-xl bg-pink-grad px-3.5 py-2.5 text-[13px] font-extrabold text-white shadow-cta"
        >
          {copied ? "복사됨 ✓" : "복구 링크 복사하기"}
        </button>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-pink-grad px-3.5 py-2.5 text-[13px] font-extrabold text-white shadow-cta disabled:opacity-50"
        >
          {loading ? "만드는 중…" : "복구 링크 만들기"}
        </button>
      )}

      <div className="my-3.5 h-px bg-line" />

      <p className="mb-1.5 text-[11.5px] font-bold text-muted">다른 기기의 링크가 있다면</p>
      <div className="flex gap-1.5">
        <input
          value={pasteValue}
          onChange={(e) => {
            setPasteValue(e.target.value);
            setPasteError("");
          }}
          placeholder="복구 링크나 코드 붙여넣기"
          className="min-w-0 flex-1 rounded-lg border border-line px-2.5 py-2 text-[12px] outline-none focus:border-pink"
        />
        <button
          onClick={restore}
          className="shrink-0 rounded-lg border border-line px-3 py-2 text-[12px] font-bold text-ink hover:bg-app-bg"
        >
          불러오기
        </button>
      </div>
      {pasteError && <p className="mt-1.5 text-[11px] font-semibold text-pink">{pasteError}</p>}
    </div>
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
