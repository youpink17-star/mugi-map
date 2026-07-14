import { NextResponse } from "next/server";
import { restoreWiki } from "@/lib/wikiBackup";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  if (!(await checkRateLimit(getClientIp(req), "wiki-restore"))) {
    return NextResponse.json({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  try {
    const wiki = await restoreWiki(params.code);
    if (!wiki) return NextResponse.json({ error: "복구 코드를 찾을 수 없어요." }, { status: 404 });
    return NextResponse.json({ wiki });
  } catch {
    return NextResponse.json({ error: "지금은 복구할 수 없어요." }, { status: 503 });
  }
}
