import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import SmartImage from "@/components/SmartImage";
import { getProduct, formatPrice, CATEGORY_GRADIENT } from "@/lib/products";

export default function LandingPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  if (!product.active) {
    return (
      <>
        <AppHeader title={product.title} showBack />
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
          <div className="mb-3 text-4xl">🔜</div>
          <h1 className="text-[20px] font-extrabold text-ink">{product.title}</h1>
          <p className="mt-2 text-[14px] text-muted">곧 오픈 예정입니다. 홈에서 알림을 신청해 주세요.</p>
          <Link href="/" className="mt-6 rounded-xl bg-navy px-5 py-3 text-[14px] font-bold text-white">
            홈으로
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={product.title} showBack />

      <main className="flex-1">
        {/* 후킹 히어로 (캐릭터 이미지 배경) */}
        <section className="relative min-h-[420px] text-white">
          <SmartImage
            src={`/images/landing/${product.slug}.jpg`}
            alt={product.title}
            gradient={CATEGORY_GRADIENT[product.category]}
            emoji={product.emoji}
            className="absolute inset-0 h-full w-full"
            emojiClassName="text-[130px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
          <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-6">
            <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
              {product.categoryLabel}
            </span>
            <h1 className="mt-4 text-[28px] font-extrabold leading-[1.3] drop-shadow-lg">{product.hook}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85 drop-shadow">{product.hookSub}</p>
            <div className="mt-5 flex items-center gap-2 text-[13px] text-white/75">
              <span className="rounded-md bg-white/15 px-2 py-1 backdrop-blur">약 2분 진단</span>
              <span className="rounded-md bg-white/15 px-2 py-1 backdrop-blur">무료 결과 제공</span>
            </div>
          </div>
        </section>

        {/* 무료로 받는 것 */}
        <section className="px-5 py-8">
          <h2 className="text-[16px] font-extrabold text-ink">무료로 먼저 확인하세요</h2>
          <p className="mt-1 text-[13px] text-muted">진단만 해도 아래 항목이 바로 공개됩니다.</p>
          <ul className="mt-4 space-y-2">
            {product.freeReveal.map((it) => (
              <li key={it} className="flex items-start gap-2 rounded-xl bg-soft-pink px-4 py-3 text-[14px] font-semibold text-ink">
                <span className="text-pink">✓</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 유료 리포트에서 열리는 것 */}
        <section className="px-5 pb-8">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold text-ink">유료 리포트 풀버전</h2>
              <span className="text-[18px] font-extrabold text-navy">{formatPrice(product.price)}</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {product.paidUnlocks.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[14px] text-ink/85">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-navy text-[9px] text-white">★</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      {/* 하단 고정 CTA */}
      <div className="sticky bottom-0 z-20 mt-auto border-t border-line bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        <Link
          href={`/test/${product.slug}`}
          className="block w-full rounded-2xl bg-pink-grad py-4 text-center text-[16px] font-extrabold text-white shadow-cta active:scale-[0.99]"
        >
          내 결과 무료로 확인하기
        </Link>
      </div>
    </>
  );
}
