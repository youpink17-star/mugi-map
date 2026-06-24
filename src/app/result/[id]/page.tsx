import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ResultPreviewCard from "@/components/ResultPreviewCard";
import ReportSectionView from "@/components/ReportSectionView";
import PaidCTA from "@/components/PaidCTA";
import PaywallVariants from "@/components/PaywallVariants";
import ResultJourney from "@/components/ResultJourney";
import { getProduct } from "@/lib/products";
import { buildUnifiedProfile } from "@/lib/profile";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";
import { isDemoId, decodeDemo } from "@/lib/demoid";
import type { FreeResult } from "@/lib/types";

interface ResultData {
  slug: string;
  free: FreeResult;
}

async function loadResult(id: string): Promise<ResultData | null> {
  if (isDemoId(id)) {
    const d = decodeDemo<{ slug: string; free_result: FreeResult }>(id);
    if (!d) return null;
    return { slug: d.slug, free: d.free_result };
  }
  if (!hasSupabase()) return null;
  const sb = getServiceSupabase();
  const { data } = await sb
    .from("test_responses")
    .select("product_slug, free_result")
    .eq("id", id)
    .single();
  if (!data) return null;
  return { slug: data.product_slug, free: data.free_result as FreeResult };
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const result = await loadResult(params.id);
  if (!result) notFound();

  const product = getProduct(result.slug);
  if (!product) notFound();
  const free = result.free;
  const isRich = Array.isArray(free.sections) && free.sections.length > 0;
  const FREE_COUNT = 4; // 무료로 공개할 섹션 수
  // 이 진단의 점수로 통합 프로필을 만들어 C→B→잠금 유료 흐름에 사용
  const miniProfile = buildUnifiedProfile([{ slug: result.slug, scores: free.scores ?? {} }]);

  return (
    <>
      <AppHeader title="진단 결과" />

      <main className="flex-1">
        {/* 헤더 */}
        <section className="bg-navy px-6 py-9 text-center text-white">
          <p className="text-[13px] font-semibold text-pink">{product.title}</p>
          {free.typeEmoji && (
            <div className="mt-3 text-[44px] leading-none">{free.typeEmoji}</div>
          )}
          <h1 className="mt-3 text-[24px] font-extrabold leading-snug text-white">
            <span className="text-pink">{free.typeName}</span>
          </h1>
          {free.tagline && (
            <p className="mt-2 text-[14px] leading-relaxed text-white/80">{free.tagline}</p>
          )}

          {/* 지표 배지 (MBTI / 에니어그램 / 강점) — 가운데 정렬 + 줄바꿈 */}
          {free.badges && free.badges.length > 0 && (
            <div className="mx-auto mt-5 grid max-w-[330px] grid-cols-3 gap-2">
              {free.badges.map((b, i) => {
                // "4번 개성가 (독창성 추구)" → 두 줄로
                const m = b.value.match(/^(.*?)\s*\((.*)\)\s*$/);
                return (
                  <div key={i} className="flex min-h-[64px] flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-2 text-center ring-1 ring-white/10">
                    <div className="text-[10px] font-semibold text-white/55">{b.label}</div>
                    {m ? (
                      <div className="mt-1 leading-tight">
                        <div className="text-[12px] font-extrabold text-white">{m[1]}</div>
                        <div className="text-[10px] font-medium text-white/70">({m[2]})</div>
                      </div>
                    ) : (
                      <div className="mt-1 text-[12px] font-extrabold leading-tight text-white">{b.value}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {isRich ? (
          // ===== 리치 리포트 (사업아이템 / 자기발견) =====
          <>
            <section className="px-5 pt-6">
              <div className="mb-4 rounded-2xl border-l-4 border-pink bg-soft-pink px-4 py-3">
                <p className="text-[14px] font-semibold leading-relaxed text-ink">{free.summary}</p>
              </div>

              {/* 무료 공개: 앞 FREE_COUNT 개 섹션 전부 공개 */}
              <div className="space-y-3">
                {free.sections!.slice(0, FREE_COUNT).map((s, i) => (
                  <ReportSectionView key={i} section={s} />
                ))}
              </div>
            </section>

            {/* 유료 흐름 — C(실수) → B(성공 경로) → 잠금 */}
            {miniProfile && <PaywallVariants profile={miniProfile} sampleSize={1} hideCta />}
          </>
        ) : (
          // ===== 일반 진단 (카드형) =====
          <>
            <section className="space-y-3 px-5 py-6">
              <div className="grid grid-cols-2 gap-3">
                {(free.cards ?? []).map((c, i) => (
                  <div key={i} className={c.accent ? "col-span-2" : ""}>
                    <ResultPreviewCard label={c.label} value={c.value} accent={c.accent} />
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-[12px] font-bold tracking-wide text-purple">한 줄 요약</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{free.summary}</p>
              </div>
            </section>

            {/* 유료 흐름 — C(실수) → B(성공 경로) → 잠금 */}
            {miniProfile && <PaywallVariants profile={miniProfile} sampleSize={1} hideCta />}
          </>
        )}

        {/* 성장 시스템: 결과 저장 + 통합 프로필 CTA + 다음 추천 진단 */}
        <ResultJourney slug={result.slug} scores={free.scores ?? {}} />
      </main>

      <PaidCTA productSlug={product.slug} price={product.price} testResponseId={params.id} />
    </>
  );
}
