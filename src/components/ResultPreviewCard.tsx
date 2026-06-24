// 무료 결과 미리보기 카드 — "어? 나잖아" 영역
export default function ResultPreviewCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        accent ? "border-pink/40 bg-soft-pink" : "border-line bg-white",
      ].join(" ")}
    >
      <p className="text-[12px] font-bold tracking-wide text-purple">{label}</p>
      <p className="mt-1 text-[17px] font-extrabold leading-snug text-ink">{value}</p>
    </div>
  );
}
