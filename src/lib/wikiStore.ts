"use client";
// ============================================================
//  내 사업 위키 저장소 — 회원가입 없이 브라우저(localStorage)에 보관.
//  Supabase가 설정되어 있으면 동기화할 수 있도록 구조를 분리해 둠.
//  (지금은 localStorage. 확장 지점은 saveWiki / loadWiki 안에 표시)
// ============================================================

import {
  LEAF_SECTIONS,
  TEST_TO_SECTIONS,
  normalizeBusinessType,
  type SectionStatus,
  type SellingStatus,
  type BusinessType,
} from "./wiki";

const KEY = "mugi_wiki_v1";

// ---------- 타입 ----------
export interface WikiSectionState {
  status: SectionStatus;
  content: string;
  lastUpdatedAt: string | null;
}

export interface WikiNote {
  id: string;
  discomfort: string; // 발견한 불편함
  who: string; // 누가 겪는지
  when: string; // 언제 발생하는지
  existing: string; // 기존 해결책
  whyUnsatisfied: string; // 왜 아직 불만족인지
  myIdea: string; // 내가 생각한 해결책
  turnedIntoIdea?: boolean; // 아이디어 후보로 표시됨
  createdAt: string;
}

export interface BusinessWiki {
  id: string;
  anonymousId: string;
  title: string; // 사업 이름
  sellingStatus: SellingStatus;
  businessType: BusinessType;
  startedAt?: string; // 사업 시작일 (YYYY-MM-DD)
  sections: Record<string, WikiSectionState>;
  notes: WikiNote[];
  createdAt: string;
  updatedAt: string;
}

// ---------- 유틸 ----------
function uid(prefix = "w"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

function emptySections(): Record<string, WikiSectionState> {
  const s: Record<string, WikiSectionState> = {};
  for (const def of LEAF_SECTIONS) {
    s[def.id] = { status: "empty", content: "", lastUpdatedAt: null };
  }
  return s;
}

export function createWiki(partial?: Partial<BusinessWiki>): BusinessWiki {
  const t = nowISO();
  return {
    id: uid("wiki"),
    anonymousId: uid("anon"),
    title: "내 사업",
    sellingStatus: "none",
    businessType: "undecided",
    sections: emptySections(),
    notes: [],
    createdAt: t,
    updatedAt: t,
    ...partial,
  };
}

// ---------- load / save ----------
export function loadWiki(): BusinessWiki | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const w = JSON.parse(raw) as BusinessWiki;
    // 섹션 정의가 늘어났을 때를 대비해 누락 섹션 보강
    const base = emptySections();
    w.sections = { ...base, ...w.sections };
    // 과거 저장값(unknown/coaching 등) 정규화
    w.businessType = normalizeBusinessType(w.businessType);
    if (!Array.isArray(w.notes)) w.notes = [];
    return w;
  } catch {
    return null;
  }
}

export function saveWiki(w: BusinessWiki): BusinessWiki {
  if (typeof window === "undefined") return w;
  w.updatedAt = nowISO();
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
    // [확장] Supabase 연결 시: 여기서 business_wiki upsert(anonymousId 기준) 호출
  } catch {
    /* quota 등 무시 */
  }
  return w;
}

export function getOrCreateWiki(): BusinessWiki {
  return loadWiki() ?? saveWiki(createWiki());
}

// ---------- 변경 헬퍼 (불변 갱신 후 저장된 새 객체 반환) ----------
export function updateSection(
  w: BusinessWiki,
  sectionId: string,
  patch: Partial<WikiSectionState>
): BusinessWiki {
  const prev = w.sections[sectionId] ?? {
    status: "empty" as SectionStatus,
    content: "",
    lastUpdatedAt: null,
  };
  const next: BusinessWiki = {
    ...w,
    sections: {
      ...w.sections,
      [sectionId]: { ...prev, ...patch, lastUpdatedAt: nowISO() },
    },
  };
  return saveWiki(next);
}

export function setMeta(w: BusinessWiki, patch: Partial<BusinessWiki>): BusinessWiki {
  return saveWiki({ ...w, ...patch });
}

// ---------- 불편함 노트 ----------
export function addNote(w: BusinessWiki, note: Omit<WikiNote, "id" | "createdAt">): BusinessWiki {
  const full: WikiNote = { ...note, id: uid("note"), createdAt: nowISO() };
  return saveWiki({ ...w, notes: [full, ...w.notes] });
}

export function deleteNote(w: BusinessWiki, id: string): BusinessWiki {
  return saveWiki({ ...w, notes: w.notes.filter((n) => n.id !== id) });
}

export function markNoteAsIdea(w: BusinessWiki, id: string): BusinessWiki {
  const notes = w.notes.map((n) =>
    n.id === id ? { ...n, turnedIntoIdea: !n.turnedIntoIdea } : n
  );
  return saveWiki({ ...w, notes });
}

// ---------- 진단 완료 → 매핑된 섹션을 초안으로 ----------
// 결과 페이지에서 호출. 진단을 "위키 빈칸을 채우는 입력"으로 연결한다.
export function recordTestCompletion(
  slug: string,
  content?: string
): { wiki: BusinessWiki; filled: string[] } {
  const w = getOrCreateWiki();
  const targets = TEST_TO_SECTIONS[slug] ?? [];
  const filled: string[] = [];
  const sections = { ...w.sections };
  for (const id of targets) {
    const cur = sections[id];
    if (!cur) continue;
    // 비어 있던 칸만 초안으로 승격(이미 채운 칸은 본문을 건드리지 않음)
    if (cur.status === "empty") {
      sections[id] = {
        ...cur,
        status: "draft",
        // 진단 결과 본문을 칸에 자동 입력(빈 칸일 때만)
        content: content && !cur.content.trim() ? content : cur.content,
        lastUpdatedAt: nowISO(),
      };
      filled.push(id);
    }
  }
  const next = saveWiki({ ...w, sections });
  return { wiki: next, filled };
}

// ---------- 완성도 / 빈칸 ----------
export function completionRate(w: BusinessWiki): number {
  const leaves = LEAF_SECTIONS;
  let score = 0;
  for (const def of leaves) {
    const st = w.sections[def.id]?.status ?? "empty";
    if (st === "complete") score += 1;
    else if (st === "draft" || st === "needs_update") score += 0.4;
  }
  return Math.round((score / leaves.length) * 100);
}

// 가장 많이 비어 있는 구간(현재 비어 있는 첫 leaf 섹션)
export function emptiestSection(w: BusinessWiki): string | null {
  const empty = LEAF_SECTIONS.find((d) => (w.sections[d.id]?.status ?? "empty") === "empty");
  return empty?.id ?? null;
}

export function emptySectionIds(w: BusinessWiki): string[] {
  return LEAF_SECTIONS.filter(
    (d) => (w.sections[d.id]?.status ?? "empty") === "empty"
  ).map((d) => d.id);
}

// 오늘 채워야 할 칸 1~3개 (비어 있는 칸 우선)
export function todaysBlanks(w: BusinessWiki, n = 3): string[] {
  const empties = emptySectionIds(w).filter((id) => id !== "notes" && id !== "todo");
  if (empties.length >= n) return empties.slice(0, n);
  const drafts = LEAF_SECTIONS.filter(
    (d) => (w.sections[d.id]?.status ?? "empty") === "draft"
  ).map((d) => d.id);
  return [...empties, ...drafts].slice(0, n);
}

export function clearWiki() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
