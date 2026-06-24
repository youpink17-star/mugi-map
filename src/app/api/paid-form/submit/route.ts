import { NextResponse } from "next/server";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";
import { getProduct } from "@/lib/products";
import { sendReportWebhook, type ReportWebhookPayload } from "@/lib/webhook";
import { isDemoId, decodeDemo } from "@/lib/demoid";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const orderId = body?.order_id as string | undefined;
  const paidAnswers = (body?.answers ?? {}) as Record<string, unknown>;
  if (!orderId) {
    return NextResponse.json({ error: "order_id 누락" }, { status: 400 });
  }

  let productSlug = "";
  let customer = { name: null as string | null, email: null as string | null, phone: null as string | null };
  let freeTestAnswers: Record<string, unknown> = {};
  let freeResult: unknown = null;

  const sb = hasSupabase() ? getServiceSupabase() : null;

  // 1) 주문/응답 데이터 수집
  if (isDemoId(orderId)) {
    const d = decodeDemo<{
      slug: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      test_response_id: string | null;
    }>(orderId);
    if (!d) return NextResponse.json({ error: "잘못된 주문" }, { status: 400 });
    productSlug = d.slug;
    customer = { name: d.name, email: d.email, phone: d.phone };
    if (d.test_response_id && isDemoId(d.test_response_id)) {
      const t = decodeDemo<{ free_result: unknown }>(d.test_response_id);
      freeResult = t?.free_result ?? null;
    }
  } else if (sb) {
    const { data: order, error } = await sb.from("orders").select("*").eq("id", orderId).single();
    if (error || !order) return NextResponse.json({ error: "주문을 찾을 수 없음" }, { status: 404 });
    productSlug = order.product_slug;
    customer = { name: order.name, email: order.email, phone: order.phone };

    if (order.test_response_id) {
      const { data: tr } = await sb
        .from("test_responses")
        .select("answers, free_result")
        .eq("id", order.test_response_id)
        .single();
      if (tr) {
        freeTestAnswers = (tr.answers ?? {}) as Record<string, unknown>;
        freeResult = tr.free_result;
      }
    }

    // 유료폼 저장 + 상태 업데이트
    await sb.from("paid_forms").insert({
      order_id: orderId,
      product_slug: productSlug,
      answers: paidAnswers,
    });
    await sb.from("orders").update({ status: "paid_form_done" }).eq("id", orderId);
  } else {
    return NextResponse.json({ error: "저장소가 설정되지 않았습니다." }, { status: 500 });
  }

  const product = getProduct(productSlug);

  // 2) Make Webhook 으로 리포트 생성 요청
  const payload: ReportWebhookPayload = {
    order_id: orderId,
    product_slug: productSlug,
    product_title: product?.title ?? productSlug,
    customer_info: customer,
    free_test_answers: freeTestAnswers,
    free_result: freeResult,
    paid_answers: paidAnswers,
    created_at: new Date().toISOString(),
  };

  const result = await sendReportWebhook(payload);

  // 3) 작업 로그 기록 + 발송 완료 상태
  if (sb && !isDemoId(orderId)) {
    await sb.from("report_jobs").insert({
      order_id: orderId,
      product_slug: productSlug,
      status: result.ok ? "sent" : "failed",
      webhook_status: result.status,
      webhook_response: result.body,
    });
    if (result.ok) {
      await sb.from("orders").update({ status: "report_sent" }).eq("id", orderId);
    }
  }

  // 웹훅이 미설정이어도 사용자 플로우는 완료로 진행(운영자가 수동 처리)
  return NextResponse.json({ ok: true, webhook: result.ok });
}
