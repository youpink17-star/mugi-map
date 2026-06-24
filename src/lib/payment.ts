// 결제 모드 추상화. 실제 PG(포트원) 연동 전까지 구조만 잡아둔다.
//  - mock     : 결제 없이 바로 통과(개발/데모)
//  - external : 외부 결제 링크로 이동
//  - portone  : 포트원 SDK 연동(추후 구현)

export type PaymentMode = "mock" | "external" | "portone";

export function getPaymentMode(): PaymentMode {
  const m = process.env.NEXT_PUBLIC_PAYMENT_MODE as PaymentMode | undefined;
  return m ?? "mock";
}

// 외부 결제 링크 생성(슬러그/주문ID 전달)
export function buildExternalPaymentUrl(orderId: string, slug: string): string {
  const base = process.env.NEXT_PUBLIC_PAYMENT_EXTERNAL_URL ?? "";
  if (!base) return "";
  const u = new URL(base);
  u.searchParams.set("order_id", orderId);
  u.searchParams.set("slug", slug);
  return u.toString();
}
