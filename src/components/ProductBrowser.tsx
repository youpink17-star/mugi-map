"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { PRODUCTS, CATEGORY_HEADLINE, CATEGORY_ORDER, CATEGORY_LABEL } from "@/lib/products";
import type { Category } from "@/lib/types";

export default function ProductBrowser() {
  const [cat, setCat] = useState<Category>("business");
  const list = PRODUCTS.filter((p) => p.category === cat);
  const head = CATEGORY_HEADLINE[cat];

  return (
    <section id="products" className="pb-2">
      {/* 청월당식 밑줄형 메뉴 (3개) */}
      <div className="sticky top-14 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="flex">
          {CATEGORY_ORDER.map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={[
                  "relative flex-1 py-3 text-[14.5px] font-bold transition",
                  on ? "text-ink" : "text-muted",
                ].join(" ")}
              >
                {CATEGORY_LABEL[c]}
                {on && (
                  <span className="absolute inset-x-4 -bottom-px h-[3px] rounded-full bg-navy" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 카테고리 섹션 */}
      <div className="px-4">
        <div className="mb-3 mt-5">
          <h2 className="text-[18px] font-extrabold leading-tight text-ink">
            {head.emoji} {head.title}
          </h2>
          <p className="mt-0.5 text-[13px] text-muted">{head.sub}</p>
        </div>
        <div className="space-y-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
