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
import { getFlow, carriedAnswers, flowName as flowNameFrom } from "@/lib/questionFlows";
import QuestionFlow from "./QuestionFlow";

const STATUS_CYCLE: SectionStatus[] = ["empty", "draft", "needs_update", "complete"];

// 한 섹션의 "사업 문서" 편집 화면 — 모바일 펼친 카드 / 데스크톱 가운데 본문 공용
export default function WikiSectionEditor({
  def,
  state,
  exampleCtx,
  onCommit,
  onStatus,
  onFlowComplete,
  onFlowProgress,
  onNext,
  flowName = "내 사업",
  allAnswers = {},
  autoFocus = false,
}: {
  def: WikiSectionDef;
  state: WikiSectionState;
  exampleCtx: ExampleContext;
  onCommit: (text: string) => void;
  onStatus: (status: SectionStatus) => void;
  onFlowComplete?: (answers: Record<string, string>, text: string) => void;
  onFlowProgress?: (answers: Record<string, string>) => void;
  onNext?: () => void;
  flowName?: string;
  allAnswers?: Record<string, Record<string, string> | undefined>;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState(state.content);
  const [saved, setSaved] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const flow = onFlowComplete ? getFlow(def.id) : undefined;
  type View = "flow" | "result" | "classic";
  const initialView = (): View => (flow ? (state.content.trim() ? "result" : "flow") : "classic");
  const [view, setView] = useState<View>(initialView);
  const [justDone, setJustDone] = useState(false);
  useEffect(() => {
    setView(initialView());
    setJustDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.id]);
  // 같은 칸이 다른 화면(폰/PC 레이아웃)에서 채워지거나 비워지면 보이는 화면도 맞춘다
  const hasContent = !!state.content.trim();
  // 질문을 끝까지 답해서 만든 칸인지 (홈에서 넘어온 이름·한 줄만 있는 경우는 제외)
  const answeredByFlow = !!flow && flow.questions.filter((qq) => !qq.skip).every((qq) => !!state.answers?.[qq.id]);
  useEffect(() => {
    if (!flow) return;
    setView((v) => (hasContent && v === "flow" ? "result" : !hasContent && v === "result" ? "flow" : v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent]);

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

  if (flow && view !== "classic") {
    return (
      <div>
        <p className="text-[11px] font-bold text-purple">{def.num}</p>
        <h2 className="text-[19px] font-extrabold leading-tight text-ink lg:text-[22px]">{def.title}</h2>
        {def.purpose && <p className="mt-1 text-[13.5px] font-bold text-ink/75">{def.purpose}</p>}

        {view === "flow" ? (
          <div className="mt-4">
            <QuestionFlow
              flow={flow}
              initialAnswers={{ ...carriedAnswers(flow, allAnswers), ...(state.answers ?? {}) }}
              carried={carriedAnswers(flow, allAnswers)}
              startStep={
                hasContent
                  ? 0
                  : Math.max(0, flow.questions.findIndex((qq) => !(state.answers ?? {})[qq.id]))
              }
              seedNote={state.answers?._seed}
              onProgress={hasContent ? undefined : onFlowProgress}
              onWriteSelf={() => setView("classic")}
              onComplete={(a) => {
                onFlowComplete!(a, flow.assemble(a, { name: flowNameFrom({ ...allAnswers, [def.id]: a }, flowName) }));
                setJustDone(true);
                setView("result");
              }}
            />
          </div>
        ) : (
          <div className="mt-4">
            <div
              className={`rounded-2xl border p-5 ${justDone ? "border-pink/40 bg-gradient-to-b from-soft-pink to-white" : "border-line bg-white"}`}
              style={justDone ? { animation: "qfPop .35s ease-out" } : undefined}
            >
              <style>{`@keyframes qfPop{0%{opacity:0;transform:scale(.96)}100%{opacity:1;transform:none}}`}</style>
              {justDone && (
                <div className="mb-3 text-center">
                  <div className="text-[34px] leading-none">🎉</div>
                  <p className="mt-2 text-[17px] font-extrabold text-ink">{flow.doneTitle}</p>
                  <p className="mt-0.5 text-[12.5px] font-bold text-emerald-600">✓ {def.title} 칸 완성 · 정리본에 저장됐어요</p>
                </div>
              )}
              {!justDone && (
                <p className={`mb-2 flex items-center gap-1.5 text-[12px] font-bold ${status === "complete" ? "text-emerald-600" : "text-purple"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`} />
                  {status === "complete" ? "완성된 칸" : STATUS_META[status].label}
                </p>
              )}
              <p className="text-[15px] leading-[1.75] text-ink">{state.content}</p>
            </div>
            {onNext && (
              <button
                onClick={onNext}
                className="mt-3 w-full rounded-2xl bg-pink-grad py-3.5 text-[15px] font-extrabold text-white shadow-cta"
              >
                다음 칸 채우기 →
              </button>
            )}
            {!answeredByFlow && (
              <p className="mt-3 text-[11.5px] text-muted">질문으로 새로 쓰면 지금 적힌 글은 새 문장으로 바뀌어요.</p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setJustDone(false);
                  setView("flow");
                }}
                className="flex-1 rounded-xl border border-line bg-white py-2.5 text-[13px] font-bold text-ink"
              >
                {answeredByFlow ? "질문으로 다시 답하기" : "질문으로 새로 쓰기"}
              </button>
              <button
                onClick={() => setView("classic")}
                className="flex-1 rounded-xl border border-line bg-white py-2.5 text-[13px] font-bold text-ink"
              >
                문장 직접 고치기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {flow && (
        <button
          onClick={() => setView(state.content.trim() ? "result" : "flow")}
          className="mb-3 rounded-xl border border-pink/40 bg-soft-pink px-3.5 py-2 text-[12.5px] font-bold text-pink"
        >
          ← 질문으로 채우기
        </button>
      )}
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
