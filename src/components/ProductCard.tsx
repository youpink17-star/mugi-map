"use client";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, CATEGORY_GRADIENT } from "@/lib/products";
import SmartImage from "./SmartImage";
import EmailNotifyForm from "./EmailNotifyForm";

export default function ProductCard({ product }: { product: Product }) {
  const { active, badge, slug } = product;

  const inner = (
    <div
      className={[
        "group overflow-hidden rounded-3xl border bg-white transition-all duration-200",
        active
          ? "border-line shadow-card hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(7,7,31,0.12)]"
          : "border-line",
      ].join(" ")}
    >
      {/* 썸네일 */}
      <div className="relative aspect-[16/9] w-full">
        <SmartImage
          src={`/images/products/${slug}.jpg`}
          alt={product.title}
          gradient={CATEGORY_GRADIENT[product.category]}
          emoji={product.emoji}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* 배지 */}
        <div className="absolute left-3.5 top-3.5 flex gap-1.5">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            {product.categoryLabel}
          </span>
          {active && badge && (
            <span className="rounded-full bg-pink px-2.5 py-1 text-[11px] font-extrabold text-white shadow-cta">
              {badge}
            </span>
          )}
          {!active && (
            <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-extrabold text-white/90 backdrop-blur-sm">
              COMING SOON
            </span>
          )}
        </div>

        {/* 제목 오버레이 */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-[19px] font-extrabold leading-tight text-white">{product.title}</h3>
          <p className="mt-1 text-[12.5px] font-medium text-white/80">{product.short}</p>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between px-4 py-3.5">
        {active ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-extrabold text-navy">{formatPrice(product.price)}</span>
          </div>
        ) : (
          <span className="text-[13px] font-bold text-muted">오픈 예정</span>
        )}
        {active && (
          <span className="inline-flex items-center gap-1 rounded-xl bg-navy px-4 py-2 text-[13px] font-bold text-white transition group-hover:bg-pink">
            무료로 확인
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {!active && (
        <div className="px-4 pb-4">
          <EmailNotifyForm productSlug={slug} />
        </div>
      )}
    </div>
  );

  if (active) {
    return (
      <Link href={`/landing/${slug}`} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
