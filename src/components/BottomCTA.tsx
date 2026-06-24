"use client";
import type { ReactNode } from "react";

// 하단 고정 CTA. AppShell 내부에서 sticky 로 컨테이너 폭(430px)에 맞춰 고정된다.
export default function BottomCTA({
  children,
  onClick,
  disabled = false,
  variant = "pink",
  subText,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "pink" | "navy";
  subText?: string;
}) {
  return (
    <div className="sticky bottom-0 z-20 mt-auto border-t border-line bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
      {subText && (
        <p className="mb-2 text-center text-xs font-medium text-muted">{subText}</p>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          "w-full rounded-2xl py-4 text-[16px] font-extrabold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40",
          variant === "pink"
            ? "bg-pink-grad text-white shadow-cta"
            : "bg-navy text-white",
        ].join(" ")}
      >
        {children}
      </button>
    </div>
  );
}
