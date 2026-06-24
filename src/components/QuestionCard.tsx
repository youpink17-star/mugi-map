"use client";
import type { Question } from "@/lib/types";

type Value = string | string[] | undefined;

export default function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const q = question;

  return (
    <div className="px-5 pt-6">
      <h2 className="text-[20px] font-extrabold leading-snug text-ink">{q.q}</h2>
      {q.help && <p className="mt-2 text-[13px] text-muted">{q.help}</p>}

      <div className="mt-5">
        {/* 단일 선택 */}
        {q.type === "single" && q.options && (
          <div className="space-y-2.5">
            {q.options.map((o) => {
              const selected = value === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => onChange(o.value)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] font-semibold transition active:scale-[0.99]",
                    selected
                      ? "border-pink bg-soft-pink text-ink"
                      : "border-line bg-white text-ink hover:border-pink/50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                      selected ? "border-pink bg-pink" : "border-line",
                    ].join(" ")}
                  >
                    {selected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 다중 선택 */}
        {q.type === "multi" && q.options && (
          <div className="space-y-2.5">
            {q.options.map((o) => {
              const arr = Array.isArray(value) ? value : [];
              const selected = arr.includes(o.value);
              return (
                <button
                  key={o.value}
                  onClick={() =>
                    onChange(
                      selected ? arr.filter((x) => x !== o.value) : [...arr, o.value]
                    )
                  }
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] font-semibold transition",
                    selected ? "border-pink bg-soft-pink" : "border-line bg-white hover:border-pink/50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border-2",
                      selected ? "border-pink bg-pink" : "border-line",
                    ].join(" ")}
                  >
                    {selected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 척도 1~5 */}
        {q.type === "scale" && (
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = value === String(n);
              return (
                <button
                  key={n}
                  onClick={() => onChange(String(n))}
                  className={[
                    "h-12 flex-1 rounded-xl border text-[15px] font-bold transition",
                    selected ? "border-pink bg-pink text-white" : "border-line bg-white text-ink",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
          </div>
        )}

        {/* 단답 */}
        {q.type === "text" && (
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={q.placeholder}
            className="w-full rounded-2xl border border-line bg-app-bg px-4 py-4 text-[15px] outline-none focus:border-pink"
          />
        )}

        {/* 장문 */}
        {q.type === "long" && (
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={q.placeholder}
            rows={5}
            className="w-full resize-none rounded-2xl border border-line bg-app-bg px-4 py-4 text-[15px] leading-relaxed outline-none focus:border-pink"
          />
        )}
      </div>
    </div>
  );
}
