"use client";
import Link from "next/link";

// 위키/결과에서 "실제 콘텐츠·판매 구조로 바꾸고 싶다면" 업셀.
// 제조실 / 1:1 컨설팅 외부 링크로 연결. env 없으면 준비 중 표시.
// NEXT_PUBLIC_* 은 클라이언트에서 정적 치환되므로 직접 참조 가능.
const STUDIO_URL = process.env.NEXT_PUBLIC_URL_STUDIO_FULL || "";
const CONSULT_URL = process.env.NEXT_PUBLIC_URL_DIAG_1ON1 || "";

export default function UpsellCard() {
  const items = [
    {
      emoji: "✍️",
      title: "콘텐츠 제조실",
      desc: "위키에 채운 걸 실제 콘텐츠로 계속 찍어내는 시스템",
      url: STUDIO_URL,
    },
    {
      emoji: "🎯",
      title: "마케팅 제조실",
      desc: "혼자 안 풀리는 지점을 전문가와 1:1로",
      url: CONSULT_URL,
    },
  ];

  return (
    <div className="rounded-2xl border border-pink/30 bg-soft-pink p-4">
      <p className="text-[11px] font-bold text-pink">이걸 실제 매출로 바꾸고 싶다면</p>
      <p className="mt-1 text-[13.5px] font-extrabold text-ink">다음 단계를 시작해보세요</p>

      <div className="mt-3 space-y-2">
        {items.map((it) => {
          const inner = (
            <div className="flex items-center gap-3 rounded-xl bg-white p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft-pink text-[18px]">
                {it.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-extrabold text-ink">{it.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{it.desc}</p>
              </div>
              <span
                className={[
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
                  it.url ? "bg-navy text-white" : "bg-app-bg text-muted",
                ].join(" ")}
              >
                {it.url ? "보기 ↗" : "준비 중"}
              </span>
            </div>
          );
          return it.url ? (
            <a key={it.title} href={it.url} target="_blank" rel="noopener noreferrer" className="block">
              {inner}
            </a>
          ) : (
            <div key={it.title}>{inner}</div>
          );
        })}
      </div>

      <Link href="/tools" className="mt-3 inline-block text-[12px] font-bold text-pink">
        전체 무기상점 보기 →
      </Link>
    </div>
  );
}
