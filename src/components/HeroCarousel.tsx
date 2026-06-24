"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SmartImage from "./SmartImage";
import { HERO_SLIDES } from "@/lib/products";

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = HERO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section className="px-4 pt-4">
      <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl shadow-card">
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <SmartImage src={s.image} alt={s.title} gradient={s.gradient} emoji={s.emoji} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/25" />

            {s.badge && (
              <div className="absolute right-4 top-4 rounded-2xl bg-pink px-3 py-1.5 text-center text-white shadow-cta">
                <div className="text-[9px] font-bold leading-none opacity-90">TOP</div>
                <div className="text-[17px] font-extrabold leading-tight">{s.badge.replace(/[^0-9]/g, "")}</div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
                무기제작소 진단센터
              </span>
              <h1 className="whitespace-pre-line text-[28px] font-extrabold leading-[1.22] text-white">
                {s.title}
              </h1>
              <p className="mt-2.5 whitespace-pre-line text-[13.5px] leading-relaxed text-white/80">{s.sub}</p>
              <Link
                href={s.href}
                className="mt-5 inline-flex items-center gap-1.5 rounded-2xl bg-pink-grad px-6 py-3 text-[15px] font-extrabold text-white shadow-cta transition active:scale-[0.98]"
              >
                {s.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`슬라이드 ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/45"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
