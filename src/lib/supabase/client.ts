"use client";
import { createClient } from "@supabase/supabase-js";

// 브라우저용 클라이언트(anon). 현재 앱은 쓰기를 모두 API Route 로 처리하므로
// 필수는 아니지만, 추후 클라이언트 직접 조회가 필요할 때 사용.
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}
