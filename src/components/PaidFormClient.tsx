"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import type { Question } from "@/lib/types";

type Answers = Record<string, string | string[] | undefined>;

export default function PaidFormClient({
  orderId,
  questions,
}: {
  orderId: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const value = answers[q.id];
  const answered =
    !q.required ||
    (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "");

  function setValue(v: Answers[string]) {
    setAnswers((prev) => ({ ...prev, [q.id]: v }));
    if (q.type === "single" && !isLast) {
      window.setTimeout(() => setIndex((i) => Math.min(questions.length - 1, i + 1)), 180);
    }
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/paid-form/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, answers }),
      });
      if (!res.ok) throw new Error();
      router.push(`/complete/${orderId}`);
    } catch {
      alert("제출 중 오류가 발생했어요. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <ProgressBar current={index + 1} total={questions.length} />
      <main className="flex-1">
        <QuestionCard question={q} value={value} onChange={setValue} />
      </main>

      <div className="sticky bottom-0 z-20 mt-auto flex gap-2 border-t border-line bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        {index > 0 && (
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="rounded-2xl border border-line bg-white px-5 py-4 text-[15px] font-bold text-ink"
          >
            이전
          </button>
        )}
        {isLast ? (
          <button
            onClick={submit}
            disabled={!answered || submitting}
            className="flex-1 rounded-2xl bg-pink-grad py-4 text-[16px] font-extrabold text-white shadow-cta disabled:opacity-40"
          >
            {submitting ? "제출 중…" : "제출하고 리포트 받기"}
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={!answered}
            className="flex-1 rounded-2xl bg-navy py-4 text-[16px] font-extrabold text-white disabled:opacity-40"
          >
            다음
          </button>
        )}
      </div>
    </>
  );
}
