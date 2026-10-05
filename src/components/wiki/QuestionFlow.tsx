"use client";
import { useEffect, useRef, useState } from "react";
import { cleanAnswer, type QuestionFlowDef } from "@/lib/questionFlows";
import { getSection } from "@/lib/wiki";

// 한 화면에 질문 하나 — 칩을 누르면 바로 다음 질문으로 넘어간다.
export default function QuestionFlow({
  flow,
  initialAnswers,
  carried = {},
  startStep = 0,
  seedNote,
  onProgress,
  onComplete,
  onWriteSelf,
}: {
  flow: QuestionFlowDef;
  initialAnswers?: Record<string, string>;
  carried?: Record<string, string>;
  startStep?: number; // 하다 만 답이 있으면 이어서 시작할 질문
  seedNote?: string; // 홈에서 처음 적어둔 한 줄
  onProgress?: (answers: Record<string, string>) => void; // 답할 때마다 중간 저장
  onComplete: (answers: Record<string, string>) => void;
  onWriteSelf: () => void;
}) {
  const total = flow.questions.length;
  const firstStep = Math.min(Math.max(0, startStep), flow.questions.length - 1);
  const [step, setStep] = useState(firstStep);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers ?? {});
  const q = flow.questions[step];
  const prev = answers[q.id] ?? "";
  const prevIsChip = !!q.chips?.includes(prev) || prev === q.skip;
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const readyAt = useRef(0); // 질문이 바뀐 직후 연속 탭이 다음 질문에 찍히지 않게

  useEffect(() => {
    const a = answers[q.id] ?? "";
    const fromChip = !!q.chips?.includes(a) || a === q.skip;
    setPicked(null);
    readyAt.current = Date.now() + 350;
    setTyping(!q.chips || (!!a && !fromChip));
    setDraft(fromChip ? "" : a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (typing && q.chips) inputRef.current?.focus();
  }, [typing, q.chips]);

  function answer(value: string) {
    const v = cleanAnswer(value);
    if (!v) return;
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    if (step + 1 < total) {
      onProgress?.(next);
      setStep(step + 1);
    } else onComplete(next);
  }

  function pickChip(value: string) {
    if (picked !== null || Date.now() < readyAt.current) return;
    setPicked(value);
    window.setTimeout(() => answer(value), 180);
  }

  return (
    <div className="rounded-2xl border border-pink/25 bg-gradient-to-b from-soft-pink/60 to-white p-4 lg:p-6">
      <style>{`@keyframes qfIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}`}</style>

      {/* 진행 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label="이전 질문"
          className={`h-8 w-8 shrink-0 rounded-full text-[16px] font-bold ${step === 0 ? "text-line" : "text-ink hover:bg-white"}`}
        >
          ←
        </button>
        <div className="flex flex-1 gap-1">
          {flow.questions.map((qq, i) => (
            <span
              key={qq.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-pink" : i === step ? "bg-pink/50" : "bg-line"}`}
            />
          ))}
        </div>
        <span className="w-10 shrink-0 text-right text-[12px] font-bold text-muted">
          {step + 1}/{total}
        </span>
      </div>

      {step === 0 && !prev && <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{flow.intro}</p>}
      {step === firstStep && seedNote && (
        <p className="mt-2 rounded-xl bg-white px-3 py-2 text-[12.5px] leading-relaxed text-ink/80">
          <span className="font-bold text-purple">처음에 적어둔 한 줄</span> · {seedNote}
        </p>
      )}

      {/* 질문 */}
      <div key={q.id} style={{ animation: "qfIn .22s ease-out" }} className="mt-4">
        <h3 className="text-[19px] font-extrabold leading-snug text-ink lg:text-[21px]">{q.q}</h3>
        {q.hint && <p className="mt-1 text-[13px] text-muted">{q.hint}</p>}
        {q.carry && carried[q.id] && answers[q.id] === carried[q.id] && (
          <p className="mt-2 inline-block rounded-full bg-purple/10 px-2.5 py-1 text-[11.5px] font-bold text-purple">
            ↩ {getSection(q.carry.section)?.title}에서 답한 내용이에요 · 맞으면 그대로 눌러요
          </p>
        )}

        {q.chips && (
          <div className="mt-4 flex flex-wrap gap-2">
            {q.chips.map((c) => {
              const on = picked === c || (!picked && prevIsChip && prev === c);
              return (
                <button
                  key={c}
                  onClick={() => pickChip(c)}
                  className={`rounded-2xl border px-4 py-3 text-left text-[14.5px] font-bold transition active:scale-[.97] ${
                    on ? "border-pink bg-pink text-white" : "border-line bg-white text-ink hover:border-pink/50"
                  }`}
                >
                  {c}
                </button>
              );
            })}
            {q.input && !typing && (
              <button
                onClick={() => setTyping(true)}
                className="rounded-2xl border border-dashed border-purple/40 bg-white px-4 py-3 text-[14.5px] font-bold text-purple"
              >
                ✏️ 직접 쓰기
              </button>
            )}
          </div>
        )}

        {q.input && typing && (
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              answer(draft);
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={q.input.placeholder}
              maxLength={80}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-muted/70 focus:border-pink"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className={`mt-3 w-full rounded-2xl py-3.5 text-[15px] font-extrabold transition ${
                draft.trim() ? "bg-pink-grad text-white shadow-cta" : "bg-app-bg text-muted"
              }`}
            >
              {step + 1 < total ? "다음" : "완성하기"}
            </button>
          </form>
        )}

        {q.skip && (
          <button
            onClick={() => pickChip(q.skip!)}
            className="mt-3 w-full rounded-2xl py-2.5 text-[13.5px] font-bold text-muted hover:text-ink"
          >
            {q.skip}
          </button>
        )}
      </div>

      <button onClick={onWriteSelf} className="mt-5 text-[12px] font-semibold text-muted underline underline-offset-2">
        질문 없이 직접 문단으로 쓸래요
      </button>
    </div>
  );
}
