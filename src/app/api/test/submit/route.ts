import { NextResponse } from "next/server";
import { getServiceSupabase, hasSupabase } from "@/lib/supabase/server";
import { computeFreeResult } from "@/lib/scoring";
import { getProduct } from "@/lib/products";
import { encodeDemo } from "@/lib/demoid";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = body?.product_slug as string | undefined;
  const answers = (body?.answers ?? {}) as Record<string, unknown>;

  if (!slug || !getProduct(slug)) {
    return NextResponse.json({ error: "잘못된 상품입니다." }, { status: 400 });
  }

  const free_result = computeFreeResult(slug, answers);

  if (hasSupabase()) {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("test_responses")
      .insert({ product_slug: slug, answers, free_result })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
    }
    return NextResponse.json({ id: data.id });
  }

  // 데모 모드: 결과를 id 안에 인코딩
  return NextResponse.json({ id: encodeDemo({ slug, free_result }) });
}
