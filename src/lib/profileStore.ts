"use client";
// 진단 결과를 회원가입 없이 브라우저(localStorage)에 누적한다.
// 각 진단 완료 시 saveTestResult 호출 → /profile 에서 buildUnifiedProfile 로 통합.

import type { CompletedTest } from "./profile";

const KEY = "mugi_profile_v1";

export function saveTestResult(slug: string, scores: Record<string, number>) {
  if (typeof window === "undefined") return;
  const all = loadResults();
  const idx = all.findIndex((t) => t.slug === slug);
  const entry: CompletedTest = { slug, scores };
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* quota 등 무시 */
  }
}

export function loadResults(): CompletedTest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CompletedTest[]) : [];
  } catch {
    return [];
  }
}

export function hasResult(slug: string): boolean {
  return loadResults().some((t) => t.slug === slug);
}

export function clearResults() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
