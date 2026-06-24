import { NextResponse } from "next/server";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "이메일 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (hasSupabase()) {
    const sb = getServiceSupabase();
    const { error } = await sb.from("leads").insert({
      email,
      product_slug: body?.product_slug ?? null,
      source: body?.source ?? "coming_soon",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
