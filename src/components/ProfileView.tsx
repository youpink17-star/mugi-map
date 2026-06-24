"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadResults } from "@/lib/profileStore";
import { buildUnifiedProfile, type UnifiedProfile } from "@/lib/profile";
import { JOURNEY_ORDER, getStageOf } from "@/lib/journey";
import { getProduct } from "@/lib/products";
import PaywallVariants from "./PaywallVariants";

// 통합 무기 프로필 — 무료(유형+무기) / 유료 잠금(루트·패턴·30일·성공패턴)
export default function ProfileView() {
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const results = loadResults();
    setCount(results.length);
    setProfile(buildUnifiedProfile(results));
    // 유료 잠금 해제 여부: ?unlock=1 또는 localStorage 플래그(데모)
    const url = new URLSearchParams(window.location.search);
    if (url.get("unlock") === "1") localStorage.setItem("mugi_unlocked", "1");
    setUnlocked(localStorage.getItem("mugi_unlocked") === "1");
  }, []);

  const nextUndone = useMemo(() => {
    const done = new Set(loadResults().map((r) => r.slug));
    const slug = JOURNEY_ORDER.find((s) => !done.has(s));
    return slug ? getProduct(slug) : undefined;
  }, [count]);

  // 아직 진단 0개
  if (count === 0 || !profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
        <div className="mb-4 text-5xl">🧭</div>
        <h1 className="text-[20px] font-extrabold text-ink">아직 만들 무기가 없어요</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          진단을 하나라도 받으면 당신의 통합 무기 프로필이 만들어집니다.
        </p>
        <Link href="/" className="mt-6 rounded-2xl bg-navy px-6 py-3.5 text-[15px] font-bold text-white">
          첫 진단 시작하기
        </Link>
      </div>
    );
  }

  const { type, weapons, successPattern } = profile;
  const totalTests = JOURNEY_ORDER.length;

  return (
    <main className="flex-1">
      {/* 헤더 — 대표 유형 (무료) */}
      <section className="bg-navy px-6 py-9 text-center text-white">
        <p className="text-[13px] font-semibold text-pink">나의 통합 무기 프로필</p>
        <div className="mt-3 text-[46px] leading-none">{type.emoji}</div>
        <h1 className="mt-3 text-[26px] font-extrabold">
          <span className="text-pink">{type.name}</span>
        </h1>
        <p className="mt-1.5 text-[14px] text-white/80">{type.oneLine}</p>
        <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/80 ring-1 ring-white/10">
          진단 {count} / {totalTests}개 완료
        </div>
      </section>

      {/* 무료: 대표 유형 설명 */}
      <section className="px-5 pt-6">
        <div className="rounded-2xl border-l-4 border-pink bg-soft-pink px-4 py-3.5">
          <p className="text-[14px] font-semibold leading-relaxed text-ink">{type.free}</p>
        </div>
      </section>

      {/* 무료: 이 유형의 특징 (어 나 이런데) */}
      <section className="px-5 pt-5">
        <h2 className="mb-3 text-[16px] font-extrabold text-ink">✅ {type.name}의 특징</h2>
        <div className="rounded-2xl border border-line bg-white p-2">
          {type.traits.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 border-b border-line px-3 py-3 text-[14px] text-ink last:border-0"
            >
              <span className="mt-0.5 text-pink">✓</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 무료: 빛날 때 / 약할 때 */}
      <section className="px-5 pt-5">
        <div className="grid grid-cols-1 gap-2.5">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[12px] font-bold text-pink">💪 당신이 빛나는 순간</p>
            <p className="mt-1 text-[14.5px] font-semibold leading-relaxed text-ink">{type.shine}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[12px] font-bold text-muted">🌥️ 당신이 흔들리는 순간</p>
            <p className="mt-1 text-[14.5px] font-semibold leading-relaxed text-ink">{type.shade}</p>
          </div>
        </div>
      </section>

      {/* 무료: 핵심 무기 3개 */}
      <section className="px-5 pt-5">
        <h2 className="mb-3 text-[16px] font-extrabold text-ink">🗡️ 나의 핵심 무기 3개</h2>
        <div className="space-y-2.5">
          {weapons.map((w, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-extrabold text-ink">
                  {i + 1}. {w.weapon}
                </span>
                <span className="text-[13px] font-bold text-pink">{w.score}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-app-bg">
                <div className="h-full rounded-full bg-pink-grad" style={{ width: `${w.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 무료: 지금 가장 중요한 과제 — 유료로 가는 다리 */}
      <section className="px-5 pt-5">
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-[12px] font-bold tracking-wide text-pink">지금 가장 중요한 과제</p>
          <p className="mt-1.5 text-[17px] font-extrabold leading-snug">{type.task}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            왜 이게 지금 당신의 1순위인지, 무엇부터 시작해야 하는지는 아래에서 이어집니다.
          </p>
        </div>
      </section>

      {/* 유료 영역 — 잠금 전: B/C 결제 화면 비교(검증용) */}
      {unlocked ? (
        <UnlockedSections type={type} successPattern={successPattern} />
      ) : (
        <PaywallVariants profile={profile} sampleSize={count} />
      )}

      {/* 다음 추천 진단 (프로필 정밀도 ↑) */}
      {nextUndone && (
        <section className="px-5 pb-8 pt-2">
          <p className="mb-2 text-[13px] font-bold text-ink/60">프로필을 더 또렷하게</p>
          <Link
            href={`/landing/${nextUndone.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-pink"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft-pink text-[22px]">
              {nextUndone.emoji}
            </span>
            <div className="min-w-0 flex-1">
              {getStageOf(nextUndone.slug) && (
                <p className="text-[11px] font-bold text-purple">
                  {getStageOf(nextUndone.slug)!.emoji} {getStageOf(nextUndone.slug)!.step}단계 ·{" "}
                  {getStageOf(nextUndone.slug)!.title}
                </p>
              )}
              <p className="truncate text-[14.5px] font-extrabold text-ink">{nextUndone.title}</p>
            </div>
            <span className="text-[18px] font-extrabold text-pink">→</span>
          </Link>
        </section>
      )}
    </main>
  );
}

// ---------- 유료 잠금 해제 후 ----------
function UnlockedSections({
  type,
  successPattern,
}: {
  type: UnifiedProfile["type"];
  successPattern: UnifiedProfile["successPattern"];
}) {
  return (
    <>
      {/* 돈 버는 루트 */}
      <section className="border-t border-line px-5 pt-6">
        <h2 className="mb-2 text-[16px] font-extrabold text-ink">💰 나의 돈 버는 루트</h2>
        <div className="rounded-2xl bg-navy p-4 text-center text-white">
          <p className="text-[15px] font-extrabold leading-relaxed text-pink">{type.moneyRoute}</p>
        </div>
      </section>

      {/* 망하는 패턴 */}
      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[16px] font-extrabold text-ink">⚠️ 내가 반복하는 망하는 패턴</h2>
        <div className="space-y-2">
          {type.failurePatterns.map((f, i) => (
            <div key={i} className="flex gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink/85">
              <span className="text-pink">✗</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 나와 비슷한 성공 패턴 */}
      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[16px] font-extrabold text-ink">🧭 나와 비슷한 성공 패턴</h2>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[15px] font-extrabold text-ink">{successPattern.title}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/80">{successPattern.summary}</p>
          <div className="mt-3 rounded-xl bg-soft-pink px-3 py-2.5">
            <p className="text-[12px] font-bold text-pink">주의</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink">{successPattern.warning}</p>
          </div>
          <div className="mt-2 rounded-xl bg-navy px-3 py-2.5">
            <p className="text-[12px] font-bold text-pink">첫 행동</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-white">{successPattern.firstAction}</p>
          </div>
        </div>
      </section>

      {/* 30일 액션 */}
      <section className="px-5 pb-6 pt-5">
        <h2 className="mb-3 text-[16px] font-extrabold text-ink">🗓️ 지금 해야 할 30일 액션</h2>
        <ol className="space-y-2.5">
          {type.thirtyDayPlan.map((p, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-[14px] font-semibold leading-relaxed text-ink">{p}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
