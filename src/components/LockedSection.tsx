// 유료에서 열리는 잠금 영역
export default function LockedSection({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
      {/* 흐릿한 더미 콘텐츠 */}
      <div className="select-none p-5 blur-[5px]" aria-hidden>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i}>
              <div className="mb-2 h-3.5 w-1/2 rounded bg-ink/15" />
              <div className="h-3 w-full rounded bg-ink/10" />
              <div className="mt-1.5 h-3 w-5/6 rounded bg-ink/10" />
            </div>
          ))}
        </div>
      </div>

      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 px-6 text-center backdrop-blur-[1px]">
        <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-navy text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-[14px] font-extrabold text-ink">유료 리포트에서 공개됩니다</p>
        <p className="mt-1 text-[12px] text-muted">{items.length}개 항목 잠금 해제</p>
      </div>
    </div>
  );
}
