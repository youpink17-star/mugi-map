"use client";
import type { UnifiedProfile } from "@/lib/profile";
import { socialProofLine, canShowPercent } from "@/lib/stats";

// 검증 결과 반영: C(버릴 것=공포 후킹) → B(성공 경로=욕망) → 잠금(결제)
// 단일 흐름. 거짓 수치 금지.
export default function PaywallVariants({
  profile,
  sampleSize,
  hideCta = false,
  unlockHref = "?unlock=1",
}: {
  profile: UnifiedProfile;
  sampleSize: number;
  hideCta?: boolean; // 개별 결과: 하단 고정 결제버튼이 따로 있어 CTA 숨김
  unlockHref?: string;
}) {
  const { type, successPattern } = profile;
  const showPercent = canShowPercent(sampleSize);
  const route = type.moneyRoute.split("→").map((s) => s.trim());

  return (
    <section className="border-t border-line px-5 py-7">
      {/* ── 1) 공포 후킹 (C) : 지금 반복하는 실수로 시선 잡기 ── */}
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-soft-pink px-3 py-1.5">
        <span className="text-[13px]">⚠️</span>
        <span className="text-[12px] font-extrabold text-pink">먼저 멈춰야 할 것</span>
      </div>
      <h2 className="text-[21px] font-extrabold leading-snug text-ink">
        당신이 지금 반복하는
        <br />
        <span className="text-pink">3가지 실수</span>
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        {type.name}이 성장을 멈추는 건 능력이 아니라 이 패턴 때문입니다
      </p>
      <div className="mt-4 space-y-2">
        {type.failurePatterns.map((f, i) => (
          <div key={i} className="flex gap-2.5 rounded-xl border border-line bg-white px-4 py-3.5 text-[14px] text-ink/85">
            <span className="text-pink">✗</span>
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* ── 연결: 그럼 어떻게? ── */}
      <p className="my-9 text-center text-[14px] font-bold text-ink/60">
        그렇다면 어떻게 풀어야 할까요?
      </p>

      {/* ── 2) 욕망 (B) : 같은 유형의 성공 경로 ── */}
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-soft-pink px-3 py-1.5">
        <span className="text-[13px]">📊</span>
        <span className="text-[12px] font-extrabold text-pink">나와 비슷한 사람들의 길</span>
      </div>
      <h2 className="text-[21px] font-extrabold leading-snug text-ink">
        당신과 같은 길을 걸은 사람들은
        <br />
        <span className="text-pink">이렇게 돈을 벌었습니다</span>
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        {socialProofLine(type, sampleSize)}
      </p>

      <div className="mt-4 rounded-2xl bg-navy p-5">
        <p className="text-[12px] font-bold text-pink">{successPattern.title}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {route.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[13px] font-bold text-white">
                {step}
              </span>
              {i < route.length - 1 && <span className="text-pink">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-white/70">{successPattern.summary}</p>
      </div>

      {/* ── 3) 잠금 (결제) : 당신의 1단계 + 버릴 1순위 ── */}
      <div className="mt-4 space-y-2.5">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-ink">이 경로에서 당신의 1단계는?</p>
            <span className="rounded-md bg-app-bg px-1.5 py-0.5 text-[10px] font-bold text-muted">🔒 잠금</span>
          </div>
          <p className="mt-2 rounded-xl bg-app-bg px-3 py-2.5 text-[14px] font-semibold text-navy">
            → 당신의 상황에 맞춰 <mark className="rounded bg-pink/15 px-1 font-extrabold text-navy">첫 행동 1개</mark>를 콕 집어 드립니다
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-ink">가장 먼저 버려야 할 1가지는?</p>
            <span className="rounded-md bg-app-bg px-1.5 py-0.5 text-[10px] font-bold text-muted">🔒 잠금</span>
          </div>
          <p className="mt-2 rounded-xl bg-app-bg px-3 py-2.5 text-[14px] font-semibold text-navy">
            → 위 3가지 중 당신의 <mark className="rounded bg-pink/15 px-1 font-extrabold text-navy">1순위 버릴 것</mark>과 끊는 법을 드립니다
          </p>
        </div>
      </div>

      {/* 정직성 라벨 */}
      {!showPercent && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          ※ 통계 수치는 진단 데이터가 충분히 쌓인 뒤 실제 집계로 공개됩니다. 현재는 유형별 일반 경로를 안내합니다.
        </p>
      )}

      {!hideCta && (
        <a
          href={unlockHref}
          className="mt-5 block rounded-2xl bg-pink-grad py-4 text-center text-[16px] font-extrabold text-white shadow-cta"
        >
          나와 비슷한 성공 경로 보기
        </a>
      )}
    </section>
  );
}
