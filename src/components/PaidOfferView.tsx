import type { PaidOffer } from "@/lib/types";

// **텍스트** → 형광펜 강조 (눈 편한 옐로 하이라이트 + 진한 글씨)
function renderHighlight(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <mark
          key={i}
          className="rounded bg-pink/15 px-1 font-extrabold text-navy"
        >
          {p.slice(2, -2)}
        </mark>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

// 유료 섹션 — A+C 혼합(질문→답) + 목차 + 결과 미리보기 1장 + 정량 팩트
export default function PaidOfferView({ offer }: { offer: PaidOffer }) {
  const [line1, line2] = offer.headline.split("\n");
  return (
    <div>
      {/* 유료 소개 배지 */}
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-soft-pink px-3 py-1.5">
        <span className="text-[13px]">🔒</span>
        <span className="text-[12px] font-extrabold text-pink">유료 리포트에서 열립니다</span>
      </div>

      {/* 헤드라인 */}
      <h2 className="text-[21px] font-extrabold leading-snug text-ink">
        {line1}
        <br />
        <span className="text-pink">{line2}</span>
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{offer.intro}</p>

      {/* 소개 한 줄 */}
      <p className="mt-5 text-[13px] font-bold text-ink/60">
        정밀 리포트에서는 이런 답을 드립니다
      </p>

      {/* 질문 → 답 (잠금 표시 + 딥톤 답변 + 형광펜) */}
      <div className="mt-2.5 space-y-3">
        {offer.qa.map((item, i) => (
          <div key={i} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="flex gap-1.5 text-[14px] font-bold text-ink">
                <span className="text-pink">Q.</span>
                <span>{item.q}</span>
              </p>
              <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-md bg-app-bg px-1.5 py-0.5 text-[10px] font-bold text-muted">
                🔒 잠금
              </span>
            </div>
            <p className="mt-2 flex gap-1.5 rounded-xl bg-app-bg px-3 py-2.5 text-[14px] font-semibold leading-relaxed text-navy">
              <span className="text-pink">→</span>
              <span>{renderHighlight(item.a)}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 유료 리포트 목차 */}
      {offer.toc && offer.toc.length > 0 && (
        <div className="mt-5 rounded-2xl border border-line bg-soft-pink/50 p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-ink">
            <span>📑</span>
            <span>유료 리포트 목차</span>
          </p>
          <ol className="mt-3 space-y-2">
            {offer.toc.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink/80">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 결과 미리보기 1장 */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-navy bg-navy">
        <div className="flex items-center gap-1.5 px-4 pt-3.5 text-[12px] font-bold text-pink">
          <span>🔍</span>
          <span>{offer.previewTitle}</span>
          <span className="font-medium text-white/45">· 실제 일부</span>
        </div>
        <div className="m-3 mt-2.5 rounded-xl bg-white/5 p-3.5">
          {offer.preview.map((row, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-3 border-b border-white/10 py-2 last:border-0"
            >
              <span className="shrink-0 text-[12px] font-medium text-white/55">{row.label}</span>
              <span className="text-right text-[13px] font-bold text-white">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="px-4 pb-3.5 text-[11px] leading-relaxed text-white/45">
          당신의 답변에 맞춰 이 내용이 통째로 채워집니다
        </p>
      </div>

      {/* 정량 팩트 */}
      <div className="mt-4 space-y-1.5">
        {offer.facts.map((f, i) => (
          <p key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-muted">
            <span className="text-pink">✓</span>
            <span>{f}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
