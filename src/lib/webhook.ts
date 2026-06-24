import "server-only";

export interface ReportWebhookPayload {
  order_id: string;
  product_slug: string;
  product_title: string;
  customer_info: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  free_test_answers: Record<string, unknown>;
  free_result: unknown;
  paid_answers: Record<string, unknown>;
  created_at: string;
}

export interface WebhookResult {
  ok: boolean;
  status: number;
  body: string;
}

// Make(Integromat) Webhook 으로 리포트 생성 요청 전송
export async function sendReportWebhook(
  payload: ReportWebhookPayload
): Promise<WebhookResult> {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) {
    return { ok: false, status: 0, body: "MAKE_WEBHOOK_URL not configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body: body.slice(0, 500) };
  } catch (e) {
    return { ok: false, status: 0, body: String(e).slice(0, 500) };
  }
}
