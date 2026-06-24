"use client";
import { useState } from "react";

export default function EmailNotifyForm({ productSlug }: { productSlug: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product_slug: productSlug, source: "coming_soon" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-3 rounded-xl bg-soft-pink px-3 py-2.5 text-center text-[13px] font-semibold text-pink">
        ✓ 신청 완료! 오픈하면 가장 먼저 알려드릴게요.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        type="email"
        inputMode="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder="이메일로 오픈 알림 받기"
        className="min-w-0 flex-1 rounded-xl border border-line bg-app-bg px-3 py-2.5 text-[13px] outline-none focus:border-pink"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-50"
      >
        {state === "loading" ? "..." : "신청"}
      </button>
    </form>
  );
}
