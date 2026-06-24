"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, getProduct } from "@/lib/products";
import { getOffer } from "@/lib/reports/offers";

export default function PaidCTA({
  productSlug,
  price,
  testResponseId,
}: {
  productSlug: string;
  price: number;
  testResponseId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"preview" | "form">("preview");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const offer = getOffer(productSlug);
  const product = getProduct(productSlug);
  const reportItems = product?.paidUnlocks ?? offer?.toc ?? ["맞춤 분석", "추천 전략", "30일 실행 플랜"];
  const valid = form.name.trim() && form.email.includes("@") && form.phone.trim().length >= 9;

  function openSheet() {
    setStep("preview");
    setOpen(true);
  }

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_slug: productSlug, test_response_id: testResponseId, ...form }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error("no order");
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      router.push(`/paid-form/${data.orderId}`);
    } catch {
      alert("준비 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* 하단 고정 CTA */}
      <div className="sticky bottom-0 z-20 mt-auto border-t border-line bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        <p className="mb-2 text-center text-[12px] font-semibold text-muted">
          잠긴 답까지 전부 열어 지금 확인하세요
        </p>
        <button
          onClick={openSheet}
          className="block w-full rounded-2xl bg-pink-grad py-4 text-center text-[16px] font-extrabold text-white shadow-cta active:scale-[0.99]"
        >
          내 결과 전부 열어보기 🔓
        </button>
      </div>

      {/* 시트 */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40">
          <div className="max-h-[88vh] w-full max-w-app overflow-y-auto rounded-t-3xl bg-white p-5 pb-8">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />

            {step === "preview" ? (
              <>
                <h3 className="text-[19px] font-extrabold leading-snug text-ink">
                  잠금을 풀면 <span className="text-pink">이걸 받습니다</span>
                </h3>
                <p className="mt-1 text-[13px] text-muted">
                  당신의 답변으로 만든 한 사람만을 위한 리포트
                </p>

                {/* 샘플 리포트 — 목차(받을 것) 미리보기 */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                  <div className="flex items-center gap-1.5 bg-navy px-4 py-2.5 text-[12px] font-bold text-pink">
                    <span>📄</span>
                    <span>리포트 미리보기</span>
                    <span className="ml-auto font-medium text-white/45">샘플</span>
                  </div>
                  <ol className="divide-y divide-line">
                    {reportItems.map((t, i) => (
                      <li key={i} className="flex items-center gap-3 px-4 py-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-soft-pink text-[12px] font-bold text-pink">
                          {i + 1}
                        </span>
                        <span className="text-[13.5px] font-semibold text-ink">{t}</span>
                        <span className="ml-auto text-[12px]">🔒</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 정량 팩트 */}
                {offer?.facts && (
                  <div className="mt-3 space-y-1">
                    {offer.facts.map((f, i) => (
                      <p key={i} className="flex gap-1.5 text-[12px] leading-relaxed text-muted">
                        <span className="text-pink">✓</span>
                        <span>{f}</span>
                      </p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setStep("form")}
                  className="mt-5 w-full rounded-2xl bg-pink-grad py-4 text-[16px] font-extrabold text-white shadow-cta active:scale-[0.99]"
                >
                  지금 잠금 해제하기 · {formatPrice(price)}
                </button>
                <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-[14px] font-semibold text-muted">
                  다음에 볼게요
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep("preview")}
                  className="mb-2 text-[13px] font-semibold text-muted"
                >
                  ← 뒤로
                </button>
                <h3 className="text-[18px] font-extrabold text-ink">리포트 받을 곳</h3>
                <p className="mt-1 text-[13px] text-muted">완성되면 이메일·카카오톡으로 바로 보내드립니다</p>

                <div className="mt-4 space-y-2.5">
                  <input
                    placeholder="이름"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-line bg-app-bg px-4 py-3 text-[15px] outline-none focus:border-pink"
                  />
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-line bg-app-bg px-4 py-3 text-[15px] outline-none focus:border-pink"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="휴대폰 번호"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-line bg-app-bg px-4 py-3 text-[15px] outline-none focus:border-pink"
                  />
                </div>

                <button
                  onClick={checkout}
                  disabled={!valid || loading}
                  className="mt-5 w-full rounded-2xl bg-pink-grad py-4 text-[16px] font-extrabold text-white shadow-cta disabled:opacity-40"
                >
                  {loading ? "준비 중…" : `지금 잠금 해제하기 · ${formatPrice(price)}`}
                </button>
                <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-[14px] font-semibold text-muted">
                  다음에 볼게요
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
