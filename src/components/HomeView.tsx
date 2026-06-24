"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import ProductCard from "./ProductCard";
import { STAGES } from "@/lib/journey";
import { getProduct } from "@/lib/products";
import { loadResults } from "@/lib/profileStore";

const TRUST_POINTS = [
  { icon: "🧠", title: "검증된 심리 프레임 기반", desc: "MBTI · 에니어그램 · 강점검사 이론을 토대로 문항을 설계합니다." },
  { icon: "🎯", title: "12문항 정밀 분석", desc: "두루뭉술한 결과가 아니라 4가지 축을 교차해 유형을 가려냅니다." },
  { icon: "🧩", title: "12개 진단이 하나로 연결", desc: "받을수록 통합 무기 프로필이 또렷해지는 성장 시스템입니다." },
];

export default function HomeView() {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDone(new Set(loadResults().map((r) => r.slug)));
  }, []);

  const total = STAGES.reduce((n, s) => n + s.slugs.length, 0);
  const doneCount = done.size;

  return (
    <>
      {/* 히어로 캐러셀 */}
      <HeroCarousel />

      {/* 성장 시스템 진행 상황 */}
      <section className="px-4 pt-5">
        <Link href="/profile" className="block rounded-2xl bg-navy p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-pink">무기제작소 성장 시스템</p>
            <span className="text-[12px] font-semibold text-white/70">
              {doneCount} / {total} 완료
            </span>
          </div>
          <p className="mt-1.5 text-[16px] font-extrabold leading-snug">
            진단을 모아 <span className="text-pink">나의 무기 프로필</span>을 완성하세요
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-pink-grad transition-all"
              style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2.5 text-[12px] font-semibold text-white/80">
            {doneCount === 0 ? "1단계 무기 발견부터 시작하기 →" : "내 통합 무기 프로필 보기 →"}
          </p>
        </Link>
      </section>

      {/* 4단계 여정 */}
      {STAGES.map((stage) => {
        const products = stage.slugs.map(getProduct).filter(Boolean);
        const stageDone = stage.slugs.filter((s) => done.has(s)).length;
        return (
          <section key={stage.id} className="px-4 pt-7" id={`stage-${stage.id}`}>
            {/* 단계 헤더 */}
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft-pink text-[20px]">
                {stage.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-purple">{stage.step}단계</p>
                <h2 className="text-[18px] font-extrabold leading-tight text-ink">{stage.title}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-app-bg px-2.5 py-1 text-[11px] font-bold text-muted">
                {stageDone}/{stage.slugs.length}
              </span>
            </div>
            <p className="mb-3 text-[13px] text-muted">{stage.tagline}</p>

            <div className="space-y-3">
              {products.map((p) => (
                <ProductCard key={p!.slug} product={p!} />
              ))}
            </div>
          </section>
        );
      })}

      {/* 신뢰 근거 */}
      <section className="px-4 py-8">
        <h2 className="mb-1 text-center text-[18px] font-extrabold text-ink">
          왜 이 진단을 믿어도 될까요
        </h2>
        <p className="mb-4 text-center text-[13px] text-muted">감으로 찍어주는 테스트가 아닙니다</p>
        <div className="space-y-2.5">
          {TRUST_POINTS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft-pink text-[20px]">
                {t.icon}
              </span>
              <div>
                <p className="text-[14.5px] font-extrabold text-ink">{t.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-4 py-6 text-center text-[12px] text-muted">
        <b className="text-ink">무기제작소</b> · 12개의 진단을 하나의 성장 시스템으로
        <br />
        결과는 자기 이해를 돕기 위한 참고 자료입니다.
      </footer>

      {/* 하단 고정 탭바 공간 */}
      <div className="h-[68px]" />

      {/* 하단 고정 탭바: 홈 / 내 프로필 */}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-app -translate-x-1/2 border-t border-line bg-white/95 pb-[max(env(safe-area-inset-bottom),0px)] backdrop-blur">
        <div className="grid grid-cols-2">
          <span className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-pink">
            <span className="text-[20px] leading-none">🏠</span>홈
          </span>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-muted"
          >
            <span className="text-[20px] leading-none">🧭</span>내 무기 프로필
          </Link>
        </div>
      </nav>
    </>
  );
}
