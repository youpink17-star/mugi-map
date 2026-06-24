"use client";
import Link from "next/link";
import { useEffect } from "react";
import { saveTestResult } from "@/lib/profileStore";
import { getNextSlug, getStageOf } from "@/lib/journey";
import { getProduct } from "@/lib/products";

// 결과 페이지 하단: ① 점수 누적 저장 ② 통합 프로필 CTA ③ 다음 추천 진단
export default function ResultJourney({
  slug,
  scores,
}: {
  slug: string;
  scores: Record<string, number>;
}) {
  // 결과를 통합 프로필 저장소에 누적
  useEffect(() => {
    saveTestResult(slug, scores);
  }, [slug, scores]);

  const nextSlug = getNextSlug(slug);
  const next = nextSlug ? getProduct(nextSlug) : undefined;
  const nextStage = nextSlug ? getStageOf(nextSlug) : undefined;

  return (
    <section className="border-t border-line px-5 py-7">
      {/* 통합 프로필로 모으기 */}
      <div className="rounded-2xl bg-navy p-5 text-white">
        <p className="text-[12px] font-bold text-pink">무기제작소 성장 시스템</p>
        <h3 className="mt-1.5 text-[17px] font-extrabold leading-snug">
          이 결과는 끝이 아닙니다
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
          진단을 받을수록 당신의 <b className="text-white">통합 무기 프로필</b>이 또렷해집니다.
          지금까지의 결과를 한 장으로 모아보세요.
        </p>
        <Link
          href="/profile"
          className="mt-4 block rounded-xl bg-pink-grad py-3 text-center text-[14px] font-extrabold text-white shadow-cta"
        >
          내 통합 무기 프로필 보기
        </Link>
      </div>

      {/* 다음 추천 진단 */}
      {next && (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-bold text-ink/60">다음으로 이어서 받으세요</p>
          <Link
            href={`/landing/${next.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-pink"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft-pink text-[22px]">
              {next.emoji}
            </span>
            <div className="min-w-0 flex-1">
              {nextStage && (
                <p className="text-[11px] font-bold text-purple">
                  {nextStage.emoji} {nextStage.step}단계 · {nextStage.title}
                </p>
              )}
              <p className="truncate text-[14.5px] font-extrabold text-ink">{next.title}</p>
            </div>
            <span className="text-[18px] font-extrabold text-pink">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
