"use client";
import { useEffect, useRef, useState } from "react";
import {
  STATUS_META,
  generateExample,
  getStoreRecommendation,
  type WikiSectionDef,
  type SectionStatus,
  type ExampleContext,
} from "@/lib/wiki";
import type { WikiSectionState } from "@/lib/wikiStore";

const STATUS_CYCLE: SectionStatus[] = ["empty", "draft", "needs_update", "complete"];

// 한 섹션의 "사업 문서" 편집 화면 — 모바일 펼친 카드 / 데스크톱 가운데 본문 공용
export default function WikiSectionEditor({
  def,
  state,
  exampleCtx,
  onCommit,
  onStatus,
  autoFocus = false,
}: {
  def: WikiSectionDef;
  state: WikiSectionState;
  exampleCtx: ExampleContext;
  onCommit: (text: string) => void;
  onStatus: (status: SectionStatus) => void;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState(state.content);
  const [saved, setSaved] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 섹션이 바뀌면 입력값 동기화
  useEffect(() => setText(state.content), [def.id, state.content]);
  useEffect(() => {
    if (autoFocus) taRef.current?.focus();
  }, [autoFocus, def.id]);

  const status = state.status;
  const rec = getStoreRecommendation(def.id, status);

  const dirty = text !== state.content;

  function commit(next: string) {
    setText(next);
    onCommit(next);
    if (next.trim() && status === "empty") onStatus("draft");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  // 작성 형식(템플릿)을 빈 칸에 넣어 시작점을 만들어 준다.
  function useTemplate() {
    if (!def.template) return;
    if (!text.trim()) commit(def.template);
    taRef.current?.focus();
  }

  return (
    <div>
      {/* 제목 + 설명 */}
      <div>
        <p className="text-[11px] font-bold text-purple">{def.num}</p>
        <h2 className="text-[19px] font-extrabold leading-tight text-ink lg:text-[22px]">
          {def.title}
        </h2>
        {def.purpose && (
          <p className="mt-1 text-[13.5px] font-bold text-ink/75">{def.purpose}</p>
        )}
        {def.desc && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{def.desc}</p>
        )}
      </div>

      {/* 진행 상태 — 4단계 한 줄, 눌러서 선택 */}
      <div className="mt-3 flex gap-1.5">
        {STATUS_CYCLE.map((s) => {
          const sm = STATUS_META[s];
          const on = s === status;
          return (
            <button
              key={s}
              onClick={() => onStatus(s)}
              aria-pressed={on}
              className={[
                "flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg border px-1.5 py-1.5 text-[11px] font-bold transition",
                on ? `${sm.tone} border-transparent ring-1 ring-pink/30` : "border-line bg-white text-muted hover:border-pink/40",
              ].join(" ")}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${on ? sm.dot : "bg-line"}`} />
              {sm.label}
            </button>
          );
        })}
      </div>

      {/* 채울 칸 체크리스트 */}
      {def.fields.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-app-bg/60 p-4">
          <p className="mb-2 text-[12px] font-bold text-ink/60">이 칸에 채울 것</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {def.fields.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[13.5px] text-ink/80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 작성 형식(예시) */}
      {def.template && (
        <div className="mt-3 rounded-2xl border border-dashed border-purple/30 bg-soft-pink/50 p-4">
          <p className="mb-1.5 text-[12px] font-bold text-purple">이렇게 적으면 돼요 · 형식</p>
          <p className="text-[13px] leading-relaxed text-ink/75">{def.template}</p>
        </div>
      )}

      {/* 본문 입력 */}
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          if (dirty) commit(text);
        }}
        placeholder={def.placeholder}
        rows={6}
        className="mt-4 w-full resize-y rounded-2xl border border-line bg-white p-4 text-[14.5px] leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-pink"
      />

      {/* 저장 줄 — 명시적 저장 + 상태 피드백 */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => commit(text)}
          disabled={!dirty}
          className={`rounded-xl px-5 py-2.5 text-[13px] font-extrabold transition ${
            dirty ? "bg-navy text-white" : "bg-app-bg text-muted"
          }`}
        >
          {dirty ? "저장" : saved ? "저장됨 ✓" : "저장됨"}
        </button>
        <span className="text-[12px] text-muted">
          {dirty ? "변경 사항이 있어요" : "자동 저장되고 있습니다"}
        </span>
      </div>

      {/* 작업 버튼 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {def.actions.map((a, i) => {
          if (a.kind === "example") {
            return (
              <button
                key={i}
                onClick={() => setShowBrand((v) => !v)}
                className="rounded-xl bg-pink-grad px-3.5 py-2.5 text-[13px] font-extrabold text-white shadow-cta"
              >
                {showBrand ? "예시 접기" : a.label}
              </button>
            );
          }
          if (a.kind === "fill" || a.kind === "edit") {
            return (
              <button
                key={i}
                onClick={() => taRef.current?.focus()}
                className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-bold text-ink"
              >
                {a.label}
              </button>
            );
          }
          if (a.kind === "tool") {
            return (
              <span
                key={i}
                className="cursor-default rounded-xl border border-dashed border-line bg-app-bg px-3.5 py-2.5 text-[13px] font-bold text-muted"
                title="도구실에서 곧 열립니다"
              >
                {a.label} · 준비 중
              </span>
            );
          }
          // related → 아래 관련 문서 블록으로 안내
          return null;
        })}
      </div>

      {/* 다른 브랜드 예시 (참고용 — 내 칸에 자동 입력하지 않음) */}
      {showBrand && (
        <div className="mt-3 rounded-2xl border border-purple/30 bg-white p-4 shadow-sm">
          <p className="text-[12px] font-bold text-purple">다른 브랜드는 이 칸을 이렇게 채웠어요</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">
            {generateExample(def.id, exampleCtx)}
          </p>
          {def.template && (
            <button
              onClick={useTemplate}
              className="mt-3 rounded-xl border border-pink bg-white px-3.5 py-2 text-[12.5px] font-bold text-pink"
            >
              이 형식으로 내 칸 시작하기 →
            </button>
          )}
        </div>
      )}

      {/* (확장) 아임웹 상품 추천 CTA — 지금은 externalUrl 없으면 비활성 안내 */}
      {rec && (
        <div className="mt-5 rounded-2xl border border-purple/30 bg-soft-pink p-4">
          <p className="text-[11px] font-bold text-purple">추천 자료</p>
          <p className="mt-1 text-[14.5px] font-extrabold text-ink">{rec.title}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{rec.description}</p>
          {rec.externalUrl ? (
            <a
              href={rec.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-xl bg-navy px-4 py-2.5 text-[13px] font-bold text-white"
            >
              {rec.ctaLabel} →
            </a>
          ) : (
            <p className="mt-3 inline-block rounded-xl border border-dashed border-line bg-white px-4 py-2.5 text-[12px] font-bold text-muted">
              곧 열립니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
