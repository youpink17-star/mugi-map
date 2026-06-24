"use client";
import { useEffect, useState } from "react";

const STEPS = [
  "응답을 분석하고 있어요",
  "강점·병목 패턴을 매칭 중",
  "맞춤 처방전을 정리하는 중",
  "거의 다 됐어요",
];

export default function LoadingAnalysis({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          clearInterval(t);
          onDone?.();
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
      <div className="relative mb-6 h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-line" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-pink" />
        <div className="absolute inset-0 grid place-items-center text-2xl">⚒️</div>
      </div>
      <p className="text-[17px] font-extrabold text-ink">무기를 분석하는 중…</p>
      <p className="mt-2 text-[14px] text-muted">{STEPS[step]}</p>
    </div>
  );
}
