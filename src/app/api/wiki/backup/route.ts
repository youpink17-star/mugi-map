import { NextResponse } from "next/server";
import { backupWiki } from "@/lib/wikiBackup";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await checkRateLimit(getClientIp(req), "wiki-backup"))) {
    return NextResponse.json({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const wiki = body?.wiki;
  const code = typeof body?.code === "string" ? body.code : null;

  if (!wiki || typeof wiki !== "object") {
    return NextResponse.json({ error: "위키 데이터가 없습니다." }, { status: 400 });
  }

  try {
    const savedCode = await backupWiki(code, wiki);
    return NextResponse.json({ code: savedCode });
  } catch {
    // Netlify Blobs를 못 쓰는 환경(로컬 개발 등) — 백업은 그냥 건너뛴다.
    return NextResponse.json({ error: "지금은 백업을 저장할 수 없어요." }, { status: 503 });
  }
}
