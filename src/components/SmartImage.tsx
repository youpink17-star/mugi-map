"use client";
import { useEffect, useRef, useState } from "react";

// 이미지가 있으면 표시, 없으면(404/미존재) 세련된 그라데이션 + 패턴 + 작은 배지로 대체.
// → /public/images 에 파일을 넣기만 하면 그대로 채워진다.
export default function SmartImage({
  src,
  alt,
  gradient,
  emoji,
  className = "",
  variant = "cover", // cover = 사진 자리(패턴+은은한 이모지) / badge = 작은 아이콘 칩
}: {
  src?: string;
  alt: string;
  gradient: string;
  emoji: string;
  className?: string;
  variant?: "cover" | "badge";
  emojiClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  const showFallback = !src || failed;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: gradient }}>
      {!showFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {showFallback && (
        <>
          {/* 은은한 점 패턴 + 글로우로 "디자인된" 느낌 */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div
            className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-40 blur-3xl"
            style={{ background: "rgba(255,47,143,0.55)" }}
          />
          <div
            className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full opacity-30 blur-3xl"
            style={{ background: "rgba(139,92,246,0.55)" }}
          />
          {variant === "cover" && (
            <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm ring-1 ring-white/20">
              {emoji}
            </div>
          )}
          {variant === "badge" && (
            <div className="absolute inset-0 grid place-items-center text-3xl">{emoji}</div>
          )}
        </>
      )}
    </div>
  );
}
