import { NextResponse } from "next/server";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

const VALID: OrderStatus[] = [
  "free_done",
  "payment_pending",
  "paid",
  "paid_form_done",
  "report_sent",
];

function authorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const got = req.headers.get("x-admin-password");
  return got === expected;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ orders: [], note: "Supabase 미설정" });
  }
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const status = body?.status as OrderStatus | undefined;
  if (!id || !status || !VALID.includes(status)) {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ ok: true, note: "Supabase 미설정 — 변경 미반영" });
  }
  const sb = getServiceSupabase();
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
