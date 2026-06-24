"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import SmartImage from "@/components/SmartImage";
import { getFreeTest } from "@/lib/questions";
import { getProduct, CATEGORY_GRADIENT } from "@/lib/products";

type Answers = Record<string, string | string[] | undefined>;

export default function TestPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const product = getProduct(params.slug);
  const questions = useMemo(() => getFreeTest(params.slug), [params.slug]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  if (!product || !product.active) {
    return (
      <>
        <AppHeader showBack />
        <div className="flex flex-1 items-center justify-center p-10 text-center text-muted">
          준비 중인 진단입니다.
        </div>
      </>
    );
  }

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const value = answers[q.id];
  const answered =
    !q.required ||
    (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "");

  function setValue(v: Answers[string]) {
    setAnswers((prev) => ({ ...prev, [q.id]: v }));
    // 단일/척도는 선택 시 자동으로 다음 문항
    if ((q.type === "single" || q.type === "scale") && !isLast) {
      window.setTimeout(() => setIndex((i) => Math.min(questions.length - 1, i + 1)), 180);
    }
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_slug: product!.slug, answers }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/result/${data.id}`);
      } else {
        alert("제출 중 문제가 발생했어요. 다시 시도해주세요.");
        setSubmitting(false);
      }
    } catch {
      alert("네트워크 오류가 발생했어요.");
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <>
        <AppHeader title={product.title} />
        <LoadingAnalysis />
      </>
    );
  }

  return (
    <>
      <AppHeader title={product.title} showBack />
      <ProgressBar current={index + 1} total={questions.length} />

      <main className="flex-1">
        {/* 가이드 캐릭터 */}
        <div className="px-5 pt-4">
          <div className="relative h-28 w-full overflow-hidden rounded-2xl">
            <SmartImage
              src={`/images/guide/${product.slug}.jpg`}
              alt="진단 가이드"
              gradient={CATEGORY_GRADIENT[product.category]}
              emoji={product.emoji}
              className="h-full w-full"
              emojiClassName="text-5xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
            <p className="absolute bottom-3 left-4 right-4 text-[13px] font-bold text-white drop-shadow">
              편하게 골라주세요. 정답은 없어요 :)
            </p>
          </div>
        </div>
        <QuestionCard question={q} value={value} onChange={setValue} />
      </main>

      {/* 하단 내비게이션 */}
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
            disabled={!answered}
            className="flex-1 rounded-2xl bg-pink-grad py-4 text-[16px] font-extrabold text-white shadow-cta disabled:opacity-40"
          >
            결과 보기
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
