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
  answers?: Record<string, string>; // 질문 방식으로 채운 칸의 답 (다시 답할 때 미리 채움)
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

// ---------- 런타임 검증(손상/조작 데이터 방어) ----------
const SECTION_STATUSES: SectionStatus[] = ["empty", "draft", "needs_update", "complete"];
const SELLING_STATUSES: SellingStatus[] = ["none", "selling"];
const STR_MAX = 5000; // 필드별 길이 상한(렌더 지연·quota 방지)

function str(v: unknown, max = STR_MAX): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}
function normalizeStatus(v: unknown): SectionStatus {
  return SECTION_STATUSES.includes(v as SectionStatus) ? (v as SectionStatus) : "empty";
}
function normalizeSection(v: unknown): WikiSectionState {
  const s = v && typeof v === "object" ? (v as Partial<WikiSectionState>) : {};
  return {
    status: normalizeStatus(s.status),
    content: str(s.content),
    lastUpdatedAt: typeof s.lastUpdatedAt === "string" ? s.lastUpdatedAt : null,
    ...(normalizeAnswers(s.answers) ?? {}),
  };
}
function normalizeAnswers(v: unknown): { answers: Record<string, string> } | null {
  if (!v || typeof v !== "object") return null;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 30)) {
    if (typeof val === "string") out[k.slice(0, 40)] = val.slice(0, 300);
  }
  return Object.keys(out).length ? { answers: out } : null;
}
function normalizeNote(v: unknown): WikiNote {
  const n = v && typeof v === "object" ? (v as Partial<WikiNote>) : {};
  return {
    id: str(n.id, 60) || uid("note"),
    discomfort: str(n.discomfort),
    who: str(n.who),
    when: str(n.when),
    existing: str(n.existing),
    whyUnsatisfied: str(n.whyUnsatisfied),
    myIdea: str(n.myIdea),
    turnedIntoIdea: n.turnedIntoIdea === true,
    createdAt: typeof n.createdAt === "string" ? n.createdAt : nowISO(),
  };
}

// 어떤 형태가 와도 안전한 BusinessWiki 로 복구
function parseWiki(raw: string): BusinessWiki | null {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;
  const w = obj as Partial<BusinessWiki>;

  const base = emptySections();
  const secIn = w.sections && typeof w.sections === "object" ? w.sections : {};
  const sections: Record<string, WikiSectionState> = { ...base };
  for (const id of Object.keys(base)) {
    if (id in secIn) sections[id] = normalizeSection((secIn as Record<string, unknown>)[id]);
  }

  const t = nowISO();
  return {
    id: str(w.id, 60) || uid("wiki"),
    anonymousId: str(w.anonymousId, 60) || uid("anon"),
    title: str(w.title, 120) || "내 사업",
    sellingStatus: SELLING_STATUSES.includes(w.sellingStatus as SellingStatus)
      ? (w.sellingStatus as SellingStatus)
      : "none",
    businessType: normalizeBusinessType(w.businessType),
    startedAt: typeof w.startedAt === "string" ? w.startedAt : undefined,
    sections,
    notes: Array.isArray(w.notes) ? w.notes.map(normalizeNote) : [],
    createdAt: typeof w.createdAt === "string" ? w.createdAt : t,
    updatedAt: typeof w.updatedAt === "string" ? w.updatedAt : t,
  };
}

// ---------- load / save ----------
export function loadWiki(): BusinessWiki | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const parsed = parseWiki(raw);
  if (!parsed) return null;
  // 손상/구버전 데이터를 읽었으면 정규화된 값으로 되써서 자가 복구(self-heal)
  if (parsed !== null && raw !== JSON.stringify(parsed)) {
    try {
      localStorage.setItem(KEY, JSON.stringify(parsed));
    } catch {
      /* ignore */
    }
  }
  return parsed;
}

export type SaveResult =
  | { ok: true; wiki: BusinessWiki }
  | { ok: false; error: string; wiki: BusinessWiki };

// 저장 결과를 알려주는 버전(호출자가 실패를 처리할 수 있게)
export function saveWikiSafe(w: BusinessWiki): SaveResult {
  const next = { ...w, updatedAt: nowISO() };
  if (typeof window === "undefined") return { ok: true, wiki: next };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    // [확장] Supabase 연결 시: 여기서 business_wiki upsert(anonymousId 기준) 호출
    return { ok: true, wiki: next };
  } catch (e) {
    // 저장 실패(용량 초과·프라이빗 모드 등) → 콘솔 + 이벤트로 알림
    console.warn("[wiki] 저장 실패:", e);
    try {
      window.dispatchEvent(new CustomEvent("wiki:save-failed"));
    } catch {
      /* ignore */
    }
    return { ok: false, error: String(e), wiki: next };
  }
}

// 기존 호출부 호환용: 저장하고 새 객체만 반환(실패해도 객체는 갱신됨)
export function saveWiki(w: BusinessWiki): BusinessWiki {
  return saveWikiSafe(w).wiki;
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

// 메타 필드만 안전하게 갱신 (sections/notes/id 등 덮어쓰기 차단)
export type WikiMetaPatch = Partial<
  Pick<BusinessWiki, "title" | "sellingStatus" | "businessType" | "startedAt">
>;

export function setMeta(w: BusinessWiki, patch: WikiMetaPatch): BusinessWiki {
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

// ---------- 복구 링크로 받아온 백업 데이터 적용 ----------
// 서버에서 온 데이터도 loadWiki()와 동일한 정규화(parseWiki)를 거쳐 안전하게 저장한다.
export function restoreFromBackup(data: unknown): BusinessWiki {
  const parsed = parseWiki(JSON.stringify(data)) ?? createWiki();
  return saveWiki(parsed);
}
