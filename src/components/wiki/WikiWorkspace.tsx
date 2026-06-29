"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  WIKI_SECTIONS,
  STATUS_META,
  BUSINESS_TYPE_LABEL,
  BUSINESS_TYPE_ORDER,
  SELLING_STATUS_LABEL,
  SELLING_STATUS_ORDER,
  getSection,
  type WikiSectionDef,
  type SectionStatus,
  type BusinessType,
  type SellingStatus,
  type ExampleContext,
} from "@/lib/wiki";
import {
  getOrCreateWiki,
  updateSection,
  setMeta,
  completionRate,
  todaysBlanks,
  emptiestSection,
  type BusinessWiki,
} from "@/lib/wikiStore";
import WikiSectionEditor from "./WikiSectionEditor";
import WikiDocument from "./WikiDocument";
import WikiJourney from "./WikiJourney";

const TOP_LEVEL = WIKI_SECTIONS.filter((s) => !s.parentId);
const FUNNEL_CHILDREN = WIKI_SECTIONS.filter((s) => s.parentId === "funnel");

type WikiMode = "edit" | "read" | "blanks";

// 사업 시작일로부터 며칠째인지 (1일차부터)
function daysSince(iso?: string): number | null {
  if (!iso) return null;
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return null;
  const diff = Date.now() - start;
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

export default function WikiWorkspace() {
  const [wiki, setWiki] = useState<BusinessWiki | null>(null);
  const [selectedId, setSelectedId] = useState<string>("overview");
  const [expandedId, setExpandedId] = useState<string | null>(null); // 모바일 아코디언
  const [mode, setMode] = useState<WikiMode>("edit"); // 편집 / 정리본 / 빈칸
  const searchParams = useSearchParams();

  // 최초 로드 (한 번)
  useEffect(() => {
    setWiki(getOrCreateWiki());
  }, []);

  // URL 쿼리 변화에 반응 — 같은 /wiki 라우트에서 탭(?view=blanks 등) 이동해도 모드 전환
  useEffect(() => {
    const w = getOrCreateWiki();
    const sec = searchParams.get("section");
    const view = searchParams.get("view");
    if (sec && getSection(sec)) {
      setSelectedId(sec);
      setExpandedId(sec);
    }
    if (view === "doc") {
      setMode("read");
    } else if (view === "blanks" || view === "empty") {
      setMode("blanks");
      const e = emptiestSection(w);
      if (e) {
        setSelectedId(e);
        setExpandedId(e);
      }
    } else {
      setMode("edit");
    }
  }, [searchParams]);

  // 예시 생성기에 넘길 컨텍스트 (진단 앱 분리 후에는 위키 제목만 사용)
  const exampleCtx: ExampleContext = useMemo(() => {
    if (!wiki) return {};
    return { title: wiki.title };
  }, [wiki?.title]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!wiki) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-[14px] text-muted">
        내 사업 위키를 불러오는 중…
      </div>
    );
  }

  // ---------- 핸들러 ----------
  // 한 번의 이벤트에서 content + status 가 함께 바뀔 수 있으므로(예시 생성),
  // 항상 최신 상태를 기준으로 갱신하도록 함수형 업데이트를 쓴다.
  const commit = (id: string, text: string) =>
    setWiki((prev) => (prev ? updateSection(prev, id, { content: text }) : prev));
  const status = (id: string, st: SectionStatus) =>
    setWiki((prev) => (prev ? updateSection(prev, id, { status: st }) : prev));
  const meta = (patch: Partial<BusinessWiki>) =>
    setWiki((prev) => (prev ? setMeta(prev, patch) : prev));

  const rate = completionRate(wiki);
  const blanks = todaysBlanks(wiki, 3);
  const emptiest = emptiestSection(wiki);
  const selectedDef = getSection(selectedId);

  function renderEditor(def: WikiSectionDef, autoFocus = false) {
    if (def.isParent) {
      return <FunnelIntro wiki={wiki!} onPick={(id) => pick(id)} />;
    }
    return (
      <WikiSectionEditor
        def={def}
        state={wiki!.sections[def.id]}
        exampleCtx={exampleCtx}
        onCommit={(t) => commit(def.id, t)}
        onStatus={(s) => status(def.id, s)}
        autoFocus={autoFocus}
      />
    );
  }

  function pick(id: string) {
    setSelectedId(id);
    setExpandedId(id);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      document.getElementById("wiki-center")?.scrollTo({ top: 0 });
    }
  }

  function editFromDoc(id: string) {
    setMode("edit");
    pick(id);
  }

  function editFromJourney(id: string) {
    setMode("edit");
    pick(id);
  }

  // ===== 정리본(읽기) 모드 — 채운 칸을 한 장으로 =====
  if (mode === "read") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-5 md:py-9">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMode("edit")}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] font-bold text-ink"
          >
            ← 편집으로 돌아가기
          </button>
          <span className="text-[12px] font-bold text-muted">읽기 전용</span>
        </div>
        <WikiDocument wiki={wiki} rate={rate} onEdit={editFromDoc} />
      </div>
    );
  }

  // ===== 빈칸 모드 — 화면 전체가 여정 지도 (검정 박스 없음) =====
  if (mode === "blanks") {
    return (
      <WikiJourney
        wiki={wiki}
        onPick={(id) => editFromJourney(id)}
        onBack={() => setMode("edit")}
        onDoc={() => setMode("read")}
      />
    );
  }

  return (
    <>
      {/* ===== 모바일 레이아웃 (가볍게 채우는 위키 앱) — 폰만 ===== */}
      <div className="mx-auto w-full max-w-app px-4 pb-2 md:hidden">
        <InfoBox wiki={wiki} rate={rate} emptiest={emptiest} onMeta={meta} />
        <button
          onClick={() => setMode("read")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-3 text-[14px] font-bold text-ink"
        >
          📄 내 사업 정리본 보기
        </button>
        <TodayBlanks blanks={blanks} onPick={(id) => setExpandedId(id)} />
        <div className="mt-5 space-y-2.5 pb-4">
          {TOP_LEVEL.map((def) => (
            <MobileSection
              key={def.id}
              def={def}
              wiki={wiki}
              expandedId={expandedId}
              onToggle={(id) => setExpandedId((cur) => (cur === id ? null : id))}
              renderEditor={renderEditor}
            />
          ))}
        </div>
      </div>

      {/* ===== 데스크톱/태블릿 레이아웃 (풀높이 문서 작업실) — md(768)+ ===== */}
      <div className="hidden w-full md:flex md:min-h-[calc(100dvh-4rem)]">
        {/* 왼쪽: 사업 정체성 + 위키 목차 (풀높이 사이드바) */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-white">
          <DeskSidebarHeader
            wiki={wiki}
            rate={rate}
            onMeta={meta}
            onOpenDoc={() => setMode("read")}
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
            <Toc wiki={wiki} selectedId={selectedId} onPick={pick} />
          </div>
        </aside>

        {/* 가운데: 회색 캔버스 위 흰 문서 시트 */}
        <main id="wiki-center" className="min-w-0 flex-1 overflow-y-auto bg-app-bg">
          <div className="mx-auto max-w-[840px] px-8 py-10">
            <DocBreadcrumb wiki={wiki} def={selectedDef} />
            <div className="mt-4 rounded-3xl border border-line bg-white p-9 shadow-card">
              {selectedDef && renderEditor(selectedDef, false)}
            </div>
          </div>
        </main>

        {/* 오른쪽: 빈칸 / 다음 할 일 / 도구 / 추천 (풀높이 패널) */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-line bg-app-bg/60 p-5 lg:block">
          <RightRail wiki={wiki} onPick={pick} />
        </aside>
      </div>
    </>
  );
}

// ============================================================
//  데스크톱 좌측 사이드바 헤더 — 사업 정체성 + 완성도 (워크스페이스 식별자)
// ============================================================
function DeskSidebarHeader({
  wiki,
  rate,
  onMeta,
  onOpenDoc,
}: {
  wiki: BusinessWiki;
  rate: number;
  onMeta: (patch: Partial<BusinessWiki>) => void;
  onOpenDoc: () => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(wiki.title);

  return (
    <div className="border-b border-line p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-purple">내 사업 위키</p>
      {editTitle ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            onMeta({ title: title.trim() || "내 사업" });
            setEditTitle(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="mt-1 w-full rounded-lg border border-line px-2 py-1 text-[17px] font-extrabold text-ink outline-none focus:border-pink"
        />
      ) : (
        <button
          onClick={() => setEditTitle(true)}
          className="mt-1 flex w-full items-center gap-1.5 text-left text-[17px] font-extrabold leading-tight text-ink"
        >
          <span className="truncate">{wiki.title}</span>
          <span className="text-[12px] font-normal text-muted">✎</span>
        </button>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <SellingChip wiki={wiki} onMeta={onMeta} tone="light" />
        <TypeChip wiki={wiki} onMeta={onMeta} tone="light" />
      </div>

      <div className="mt-3">
        <div className="flex items-end justify-between">
          <span className="text-[11px] font-bold text-muted">완성도</span>
          <span className="text-[15px] font-extrabold text-pink">{rate}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-app-bg">
          <div
            className="h-full rounded-full bg-pink-grad transition-all"
            style={{ width: `${Math.max(rate, 3)}%` }}
          />
        </div>
      </div>

      <button
        onClick={onOpenDoc}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-app-bg py-2 text-[12.5px] font-bold text-ink"
      >
        📄 내 사업 정리본 보기
      </button>
    </div>
  );
}

// 가운데 문서 상단 브레드크럼 — "내 사업 위키 / 5. 차별화"
function DocBreadcrumb({ wiki, def }: { wiki: BusinessWiki; def?: WikiSectionDef }) {
  return (
    <p className="text-[12px] font-semibold text-muted">
      {wiki.title} <span className="px-1 text-line">/</span>
      <span className="text-ink/70">
        {def ? `${def.num}. ${def.title}` : ""}
      </span>
    </p>
  );
}

// ============================================================
//  상단 인포박스
// ============================================================
function InfoBox({
  wiki,
  rate,
  emptiest,
  onMeta,
}: {
  wiki: BusinessWiki;
  rate: number;
  emptiest: string | null;
  onMeta: (patch: Partial<BusinessWiki>) => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(wiki.title);
  const emptyName = emptiest ? getSection(emptiest)?.title : null;
  const updated = new Date(wiki.updatedAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mt-4 rounded-3xl bg-navy p-5 text-white lg:p-7">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-pink">내 사업 위키</p>
          {editTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                onMeta({ title: title.trim() || "내 사업" });
                setEditTitle(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="mt-1 w-full rounded-lg bg-white/10 px-2 py-1 text-[22px] font-extrabold text-white outline-none ring-1 ring-white/20"
            />
          ) : (
            <button
              onClick={() => setEditTitle(true)}
              className="mt-1 flex items-center gap-2 text-left text-[22px] font-extrabold leading-tight lg:text-[26px]"
            >
              {wiki.title}
              <span className="text-[13px] font-normal text-white/40">✎</span>
            </button>
          )}

          {/* 메타 칩 */}
          <div className="mt-3 flex flex-wrap gap-2">
            <SellingChip wiki={wiki} onMeta={onMeta} />
            <TypeChip wiki={wiki} onMeta={onMeta} />
            {daysSince(wiki.startedAt) && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white/85">
                사업 {daysSince(wiki.startedAt)}일차
              </span>
            )}
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/70">
              마지막 업데이트 · {updated}
            </span>
          </div>
        </div>

        {/* 완성도 */}
        <div className="mt-5 shrink-0 lg:mt-0 lg:w-[260px]">
          <div className="flex items-end justify-between">
            <span className="text-[12px] font-bold text-white/70">위키 완성도</span>
            <span className="text-[22px] font-extrabold text-pink">{rate}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-pink-grad transition-all"
              style={{ width: `${Math.max(rate, 3)}%` }}
            />
          </div>
          {emptyName && (
            <p className="mt-2 text-[12px] text-white/60">
              가장 비어 있는 구간 · <b className="text-white/85">{emptyName}</b>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SellingChip({
  wiki,
  onMeta,
  tone = "dark",
}: {
  wiki: BusinessWiki;
  onMeta: (p: Partial<BusinessWiki>) => void;
  tone?: "dark" | "light";
}) {
  return (
    <MetaSelect
      tone={tone}
      current={SELLING_STATUS_LABEL[wiki.sellingStatus]}
      prefix={wiki.sellingStatus === "selling" ? "🟢" : "⚪"}
      options={SELLING_STATUS_ORDER.map((v) => ({ value: v, label: SELLING_STATUS_LABEL[v] }))}
      selected={wiki.sellingStatus}
      onChange={(v) => onMeta({ sellingStatus: v as SellingStatus })}
    />
  );
}

function TypeChip({
  wiki,
  onMeta,
  tone = "dark",
}: {
  wiki: BusinessWiki;
  onMeta: (p: Partial<BusinessWiki>) => void;
  tone?: "dark" | "light";
}) {
  return (
    <MetaSelect
      tone={tone}
      current={`유형 · ${BUSINESS_TYPE_LABEL[wiki.businessType]}`}
      options={BUSINESS_TYPE_ORDER.map((v) => ({ value: v, label: BUSINESS_TYPE_LABEL[v] }))}
      selected={wiki.businessType}
      onChange={(v) => onMeta({ businessType: v as BusinessType })}
    />
  );
}

// 칩을 누르면 선택지가 펼쳐지는 드롭다운 — 클릭마다 값이 도는 방식 대체
function MetaSelect({
  current,
  prefix,
  options,
  selected,
  onChange,
  tone = "dark",
}: {
  current: string;
  prefix?: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (v: string) => void;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold ${
          tone === "dark" ? "bg-white/10 text-white/85" : "bg-app-bg text-ink/75"
        }`}
      >
        {prefix && <span>{prefix}</span>}
        {current}
        <span className="text-[9px] opacity-70">▼</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-card">
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-semibold ${
                  o.value === selected ? "bg-soft-pink text-ink" : "text-ink/70 hover:bg-app-bg"
                }`}
              >
                {o.label}
                {o.value === selected && <span className="text-pink">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
//  오늘 채워야 할 칸 (모바일)
// ============================================================
function TodayBlanks({ blanks, onPick }: { blanks: string[]; onPick: (id: string) => void }) {
  if (blanks.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 text-[13px] font-extrabold text-ink">오늘 채울 칸</p>
      <div className="flex flex-wrap gap-2">
        {blanks.map((id) => {
          const def = getSection(id);
          if (!def) return null;
          return (
            <button
              key={id}
              onClick={() => {
                onPick(id);
                document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="rounded-xl border border-pink/40 bg-soft-pink px-3.5 py-2.5 text-[13px] font-bold text-ink"
            >
              {def.num}. {def.title} 채우기 →
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
//  모바일 섹션 카드 (접힘/펼침) — 퍼널은 하위 섹션 중첩
// ============================================================
function MobileSection({
  def,
  wiki,
  expandedId,
  onToggle,
  renderEditor,
}: {
  def: WikiSectionDef;
  wiki: BusinessWiki;
  expandedId: string | null;
  onToggle: (id: string) => void;
  renderEditor: (def: WikiSectionDef, autoFocus?: boolean) => React.ReactNode;
}) {
  const isFunnel = def.isParent;
  const open = expandedId === def.id;
  const st = wiki.sections[def.id]?.status ?? "empty";

  return (
    <div id={`sec-${def.id}`} className="overflow-hidden rounded-2xl border border-line bg-white">
      <button
        onClick={() => onToggle(def.id)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-[12px] font-extrabold text-purple">{def.num}</span>
        <span className="min-w-0 flex-1 text-[15px] font-extrabold text-ink">{def.title}</span>
        {!isFunnel && <StatusDot status={st} />}
        <span className="text-[13px] text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-line px-4 py-4">
          {isFunnel ? (
            <div className="space-y-2.5">
              <p className="text-[13px] leading-relaxed text-muted">{def.purpose}</p>
              {FUNNEL_CHILDREN.map((c) => (
                <details key={c.id} id={`sec-${c.id}`} className="rounded-xl border border-line">
                  <summary className="flex cursor-pointer items-center gap-2 px-3.5 py-3 text-[14px] font-bold text-ink">
                    <span className="text-[11px] font-extrabold text-purple">{c.num}</span>
                    {c.title}
                    <span className="ml-auto">
                      <StatusDot status={wiki.sections[c.id]?.status ?? "empty"} />
                    </span>
                  </summary>
                  <div className="border-t border-line px-3.5 py-4">{renderEditor(c)}</div>
                </details>
              ))}
            </div>
          ) : (
            renderEditor(def, true)
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  데스크톱: 왼쪽 목차
// ============================================================
function Toc({
  wiki,
  selectedId,
  onPick,
}: {
  wiki: BusinessWiki;
  selectedId: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav className="pt-3">
      <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-muted">목차</p>
      <ul className="space-y-0.5">
        {TOP_LEVEL.map((def) => {
          const on = selectedId === def.id;
          const st = wiki.sections[def.id]?.status ?? "empty";
          return (
            <li key={def.id}>
              <button
                onClick={() => onPick(def.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-bold transition ${
                  on ? "bg-soft-pink text-ink" : "text-ink/70 hover:bg-app-bg"
                }`}
              >
                <span className="text-[11px] text-purple">{def.num}</span>
                <span className="min-w-0 flex-1 truncate">{def.title}</span>
                {!def.isParent && <StatusDot status={st} />}
              </button>
              {def.isParent && (
                <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-line pl-2">
                  {FUNNEL_CHILDREN.map((c) => {
                    const onC = selectedId === c.id;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => onPick(c.id)}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition ${
                            onC ? "bg-soft-pink font-bold text-ink" : "text-ink/60 hover:bg-app-bg"
                          }`}
                        >
                          <span className="text-[10px] text-purple">{c.num}</span>
                          <span className="min-w-0 flex-1 truncate">{c.title}</span>
                          <StatusDot status={wiki.sections[c.id]?.status ?? "empty"} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ============================================================
//  데스크톱: 오른쪽 패널
// ============================================================
function RightRail({ wiki, onPick }: { wiki: BusinessWiki; onPick: (id: string) => void }) {
  const empties = WIKI_SECTIONS.filter(
    (d) => !d.isParent && (wiki.sections[d.id]?.status ?? "empty") === "empty"
  );
  const next = empties.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* 비어 있는 칸 */}
      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-[12px] font-extrabold text-ink">지금 비어 있는 칸</p>
        {next.length === 0 ? (
          <p className="mt-2 text-[13px] text-muted">모든 칸에 초안이 생겼어요. 이제 다듬을 차례예요.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {next.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => onPick(d.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-ink/75 hover:bg-app-bg"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                  <span className="truncate">{d.title}</span>
                  <span className="ml-auto text-[12px] font-bold text-pink">채우기</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 관련 도구 (도구실) */}
      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-[12px] font-extrabold text-ink">관련 도구</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          위키가 채워지면 콘텐츠·문구 도구가 열립니다.
        </p>
        <Link
          href="/tools"
          className="mt-3 inline-block rounded-xl border border-line bg-app-bg px-3.5 py-2 text-[13px] font-bold text-ink"
        >
          도구실 보기 →
        </Link>
      </div>

      {/* 추후 아임웹 상품 추천 CTA (구조만) */}
      <div className="rounded-2xl border border-dashed border-purple/30 bg-soft-pink p-4">
        <p className="text-[11px] font-bold text-purple">더 깊이 채우고 싶다면</p>
        <p className="mt-1 text-[13.5px] font-extrabold text-ink">내 사업 위키 완성 코스</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
          섹션별 AI 초안·랜딩 구조·CRM 문구까지. 곧 열립니다.
        </p>
        <p className="mt-3 inline-block rounded-xl border border-dashed border-line bg-white px-3.5 py-2 text-[12px] font-bold text-muted">
          준비 중
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  퍼널 부모 섹션 인트로 (데스크톱 가운데에서 7. 선택 시)
// ============================================================
function FunnelIntro({ wiki, onPick }: { wiki: BusinessWiki; onPick: (id: string) => void }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-purple">7</p>
      <h2 className="text-[22px] font-extrabold leading-tight text-ink">판매 퍼널</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        고객이 나를 알고(인지) → 관심 갖고 → 비교하고(고려) → 사기까지(구매)의 흐름입니다. 네 칸을 차례로 채우세요.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {FUNNEL_CHILDREN.map((c) => {
          const st = wiki.sections[c.id]?.status ?? "empty";
          const meta = STATUS_META[st];
          return (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="rounded-2xl border border-line bg-white p-4 text-left transition hover:border-pink"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-extrabold text-purple">{c.num}</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.tone}`}>
                  {meta.label}
                </span>
              </div>
              <p className="mt-1.5 text-[16px] font-extrabold text-ink">{c.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{c.purpose}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
function StatusDot({ status }: { status: SectionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="flex shrink-0 items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      <span className="hidden text-[11px] font-bold text-muted sm:inline lg:hidden xl:inline">
        {meta.label}
      </span>
    </span>
  );
}
