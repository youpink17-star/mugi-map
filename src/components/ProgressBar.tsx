export default function ProgressBar({
  current,
  total,
}: {
  current: number; // 1-based
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="px-4 pt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-muted">
        <span className="text-pink">{current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-app-bg">
        <div
          className="h-full rounded-full bg-pink-grad transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
