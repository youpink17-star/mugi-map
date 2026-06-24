import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import PaidFormClient from "@/components/PaidFormClient";
import { getProduct } from "@/lib/products";
import { getPaidForm } from "@/lib/questions";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";
import { isDemoId, decodeDemo } from "@/lib/demoid";

async function loadOrderSlug(id: string): Promise<string | null> {
  if (isDemoId(id)) {
    const d = decodeDemo<{ slug: string }>(id);
    return d?.slug ?? null;
  }
  if (!hasSupabase()) return null;
  const sb = getServiceSupabase();
  const { data } = await sb.from("orders").select("product_slug").eq("id", id).single();
  return data?.product_slug ?? null;
}

export default async function PaidFormPage({ params }: { params: { id: string } }) {
  const slug = await loadOrderSlug(params.id);
  if (!slug) notFound();
  const product = getProduct(slug);
  if (!product) notFound();

  const questions = getPaidForm(slug);

  return (
    <>
      <AppHeader title="추가 정보 입력" />
      <section className="bg-soft-pink px-5 py-5">
        <p className="text-[13px] font-bold text-pink">결제 완료 ✓</p>
        <h1 className="mt-1 text-[18px] font-extrabold text-ink">
          정밀 리포트를 위한 몇 가지만 더 알려주세요
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          답변이 구체적일수록 리포트 품질이 올라갑니다.
        </p>
      </section>

      {questions.length > 0 ? (
        <PaidFormClient orderId={params.id} questions={questions} />
      ) : (
        <div className="p-10 text-center text-muted">추가 질문이 없습니다.</div>
      )}
    </>
  );
}
