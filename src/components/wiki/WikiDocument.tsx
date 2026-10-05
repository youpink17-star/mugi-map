"use client";
import Link from "next/link";
import {
  WIKI_SECTIONS,
  STATUS_META,
  BUSINESS_TYPE_LABEL,
  SELLING_STATUS_LABEL,
  type WikiSectionDef,
} from "@/lib/wiki";
import type { BusinessWiki } from "@/lib/wikiStore";

const TOP_LEVEL = WIKI_SECTIONS.filter((s) => !s.parentId);
const FUNNEL_CHILDREN = WIKI_SECTIONS.filter((s) => s.parentId === "funnel");

// 채운 칸을 한 장으로 모아 읽는 "내 사업 정리본" (읽기 전용)
export default function WikiDocument({
  wiki,
  rate,
  onEdit,
}: {
  wiki: BusinessWiki;
  rate: number;
  onEdit: (sectionId: string) => void;
}) {
  const updated = new Date(wiki.updatedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      {/* 문서 헤더 (프로필 상단 정보) */}
      <header className="border-b border-line bg-navy px-6 py-7 text-white md:px-9">
        <p className="text-[12px] font-bold text-pink">한 장으로 보는 내 사업</p>
        <h1 className="mt-1 text-[24px] font-extrabold md:text-[28px]">{wiki.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
          <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white/85">
            {wiki.sellingStatus === "selling" ? "🟢" : "⚪"} {SELLING_STATUS_LABEL[wiki.sellingStatus]}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white/85">
            유형 · {BUSINESS_TYPE_LABEL[wiki.businessType]}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white/70">
            완성도 {rate}%
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white/60">
            업데이트 · {updated}
          </span>
        </div>
      </header>

      {/* 본문 */}
      <div className="px-6 py-7 md:px-9 md:py-9">
        {TOP_LEVEL.map((def) => {
          if (def.isParent) {
            return (
              <FunnelGroup key={def.id} def={def} wiki={wiki} onEdit={onEdit} />
            );
          }
          return <SectionBlock key={def.id} def={def} wiki={wiki} onEdit={onEdit} />;
        })}

        {/* 아이디어 노트는 별도 페이지로 분리 — 요약 링크만 */}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-5">
          <span className="text-[13px] font-bold text-ink/70">
            🗒️ 아이디어 {wiki.notes.length}개
          </span>
          <Link href="/notes" className="text-[13px] font-bold text-pink">
            아이디어 열기 →
          </Link>
        </div>
      </div>
    </article>
  );
}

function SectionBlock({
  def,
  wiki,
  onEdit,
  nested = false,
}: {
  def: WikiSectionDef;
  wiki: BusinessWiki;
  onEdit: (id: string) => void;
  nested?: boolean;
}) {
  const st = wiki.sections[def.id];
  const content = st?.content?.trim();
  const status = st?.status ?? "empty";
  const meta = STATUS_META[status];

  return (
    <section
      className={`border-t border-line py-5 first:border-t-0 first:pt-0 ${nested ? "pl-4" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          className={`font-extrabold text-ink ${nested ? "text-[15px]" : "text-[18px]"}`}
        >
          <span className="text-purple">{def.num}.</span> {def.title}
        </h2>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.tone}`}>
          {meta.label}
        </span>
      </div>

      {content ? (
        <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-ink/85">
          {content}
        </p>
      ) : (
        <button
          onClick={() => onEdit(def.id)}
          className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-line bg-app-bg px-3.5 py-2.5 text-[13px] font-bold text-muted transition hover:border-pink hover:text-pink"
        >
          이 칸 채우기 →
        </button>
      )}
    </section>
  );
}

function FunnelGroup({
  def,
  wiki,
  onEdit,
}: {
  def: WikiSectionDef;
  wiki: BusinessWiki;
  onEdit: (id: string) => void;
}) {
  return (
    <section className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <h2 className="text-[18px] font-extrabold text-ink">
        <span className="text-purple">{def.num}.</span> {def.title}
      </h2>
      <div className="mt-1">
        {FUNNEL_CHILDREN.map((c) => (
          <SectionBlock key={c.id} def={c} wiki={wiki} onEdit={onEdit} nested />
        ))}
      </div>
    </section>
  );
}
