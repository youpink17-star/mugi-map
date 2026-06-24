import type { ReportSection } from "@/lib/types";

export default function ReportSectionView({ section }: { section: ReportSection }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="flex items-center gap-2 text-[16px] font-extrabold text-ink">
        {section.icon && <span className="text-[18px]">{section.icon}</span>}
        {section.heading}
      </h3>

      {/* 본문: \n\n 으로 문단 분리 */}
      <div className="mt-3 space-y-3">
        {section.body.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="text-[14px] leading-relaxed text-ink/85"
            // **굵게** 마크업만 가볍게 지원
            dangerouslySetInnerHTML={{
              __html: para.replace(
                /\*\*(.+?)\*\*/g,
                '<b class="font-bold text-ink">$1</b>'
              ),
            }}
          />
        ))}
      </div>

      {/* 불릿 */}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink/85">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 사례 (닮은 사업가/브랜드/직무) */}
      {section.examples && section.examples.length > 0 && (
        <div className="mt-4 space-y-2">
          {section.examples.map((ex, i) => (
            <div key={i} className="rounded-xl bg-soft-pink px-4 py-3">
              <p className="text-[13.5px] font-extrabold text-ink">{ex.name}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink/75">{ex.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
