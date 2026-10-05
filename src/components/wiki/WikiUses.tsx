"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { WIKI_USES, buildUseText, wikiToText, filledCount } from "@/lib/wikiUses";
import type { BusinessWiki } from "@/lib/wikiStore";

// 활용법마다 "결과물이 이렇게 생겼다"를 보여주는 작은 화면 그림 (글자 카드 반복을 피하려고 그림으로)
const bar = "h-[7px] rounded-full bg-[#E3E1EC]";

function UsePreview({ id }: { id: string }) {
  // ① AI와 대화: 내 한마디 → 내 브랜드가 들어간 답
  if (id === "ai") {
    return (
      <div className="flex h-full flex-col justify-center gap-2 px-4">
        <span className="self-end rounded-2xl rounded-br-[4px] bg-pink px-3 py-1.5 text-[11.5px] font-bold text-white">
          인스타 글 써줘
        </span>
        <div className="w-[82%] rounded-2xl rounded-bl-[4px] bg-white p-2.5 shadow-[0_2px_8px_rgba(7,7,31,0.08)]">
          <div className="flex gap-1">
            <span className="rounded-full bg-navy px-2 py-0.5 text-[9.5px] font-extrabold text-white">내 고객</span>
            <span className="rounded-full bg-navy px-2 py-0.5 text-[9.5px] font-extrabold text-white">내 말투</span>
          </div>
          <div className={`${bar} mt-2 w-full`} />
          <div className={`${bar} mt-1.5 w-[70%]`} />
        </div>
      </div>
    );
  }
  // ② 프로필 카드: 어디서나 같은 한 줄 소개
  if (id === "intro") {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-[200px] rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(7,7,31,0.08)]">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 shrink-0 rounded-full bg-[#DCD2FF]" />
            <div className="flex-1">
              <div className={`${bar} w-[60%] bg-ink/70`} />
              <div className={`${bar} mt-1.5 w-[40%]`} />
            </div>
          </div>
          <div className="mt-2.5 rounded-lg bg-soft-pink px-2 py-1.5 text-center text-[10.5px] font-extrabold text-pink">
            나를 소개하는 한 줄
          </div>
          <div className="mt-2 flex justify-center gap-1">
            {["프로필", "스토어", "명함"].map((t) => (
              <span key={t} className="rounded-full bg-app-bg px-2 py-0.5 text-[9.5px] font-bold text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // ③ 작업 안내문 한 장 → 같이 일할 사람들
  return (
    <div className="flex h-full items-center justify-center gap-1.5 overflow-hidden px-3">
      <div className="w-[78px] shrink-0 -rotate-3 rounded-xl bg-white p-2 shadow-[0_2px_8px_rgba(7,7,31,0.08)]">
        <div className="whitespace-nowrap text-[9.5px] font-extrabold text-ink">꼭 지킬 것</div>
        {[0, 1, 2].map((n) => (
          <div key={n} className="mt-1.5 flex items-center gap-1.5">
            <span className="grid h-3 w-3 shrink-0 place-items-center rounded-[4px] bg-navy text-[8px] font-extrabold leading-none text-white">
              ✓
            </span>
            <div className={`${bar} flex-1`} />
          </div>
        ))}
      </div>
      <span className="shrink-0 text-[13px] font-extrabold text-ink/35">→</span>
      <div className="flex shrink-0 -space-x-1.5">
        <span className="h-[26px] w-[26px] rounded-full border-2 border-[#F3F1F8] bg-[#C9F0DC]" />
        <span className="h-[26px] w-[26px] rounded-full border-2 border-[#F3F1F8] bg-[#FFE27A]" />
        <span className="h-[26px] w-[26px] rounded-full border-2 border-[#F3F1F8] bg-[#CFE8FF]" />
      </div>
    </div>
  );
}

// 홈 — "다 채우면 어디에 쓰나". 네이비 판 위에 그림 카드 3장(모바일은 옆으로 넘기기), 누르면 자세한 소개(/uses)로.
export function WikiUseShowcase() {
  const scroller = useRef<HTMLDivElement>(null);
  // 마우스로 끌어서 넘기기 (손가락 스와이프는 브라우저가 알아서 한다)
  const drag = useRef({ on: false, startX: 0, startLeft: 0, moved: false });

  function slide(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 260) + 12), behavior: "smooth" });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { on: true, startX: e.clientX, startLeft: scroller.current.scrollLeft, moved: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = scroller.current;
    if (!d.on || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true;
      el.style.scrollSnapType = "none"; // 끄는 동안은 자석처럼 붙는 걸 잠깐 끈다
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  }
  function endDrag() {
    const el = scroller.current;
    if (drag.current.on && el) el.style.scrollSnapType = "";
    drag.current.on = false;
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl bg-navy px-5 pb-6 pt-6 text-white md:px-7 md:pb-7 md:pt-7">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-white/55">채우고 끝이 아닙니다</p>
          <h2 className="mt-1 text-[19px] font-extrabold leading-snug md:text-[22px]">
            다 채운 지도 한 장,
            <br />
            <span className="text-pink">이렇게 꺼내 씁니다</span>
          </h2>
        </div>
        {/* 넘기기 버튼 — 카드가 한 줄에 다 안 보이는 좁은 화면에서만 */}
        <div className="flex shrink-0 gap-1.5 md:hidden">
          <button
            type="button"
            aria-label="이전 활용법"
            onClick={() => slide(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[16px] font-extrabold text-white ring-1 ring-white/15 active:bg-white/20"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="다음 활용법"
            onClick={() => slide(1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[16px] font-extrabold text-white ring-1 ring-white/15 active:bg-white/20"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
        // 끌다가 놓았을 때 카드 링크가 눌리지 않게
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {WIKI_USES.map((u, i) => (
          <Link
            key={u.id}
            href={`/uses#${u.id}`}
            draggable={false}
            className="flex w-[76%] shrink-0 snap-start scroll-ml-5 flex-col overflow-hidden rounded-2xl bg-white text-ink transition active:scale-[0.99] sm:w-[44%] md:w-auto"
          >
            <div className="h-[128px] bg-[#F3F1F8]">
              <UsePreview id={u.id} />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span className="text-[11px] font-extrabold text-muted">활용 {i + 1}</span>
              <span className="mt-0.5 block text-[14.5px] font-extrabold leading-snug text-ink [word-break:keep-all]">{u.title}</span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-muted [word-break:keep-all]">{u.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/uses"
        className="mt-4 block rounded-2xl bg-white/10 py-3 text-center text-[14px] font-extrabold text-white ring-1 ring-white/15 transition hover:bg-white/15"
      >
        활용법 자세히 보기 →
      </Link>
    </section>
  );
}

// 한 장으로 보기 — 누르면 [AI에게 시킬 말 + 내 정리본]이 복사된다
export function WikiUseActions({ wiki }: { wiki: BusinessWiki }) {
  const [done, setDone] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const ready = filledCount(wiki) > 0;

  function copy(id: string, text: string) {
    const ok = () => {
      setFailed(false);
      setDone(id);
      window.setTimeout(() => setDone((d) => (d === id ? null : d)), 2600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, () => setFailed(true));
    else setFailed(true);
  }

  function saveFile() {
    const blob = new Blob([wikiToText(wiki)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${wiki.title.replace(/[\\/:*?"<>|]/g, "").trim() || "내 사업"}_정리본.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-card md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-extrabold text-ink">이 한 장, 이렇게 쓰기</h2>
        <Link href="/uses" className="shrink-0 text-[12.5px] font-bold text-muted underline underline-offset-2">
          활용법 자세히
        </Link>
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        버튼을 누르면 AI에게 시킬 말과 내 정리본이 함께 복사됩니다. ChatGPT나 Claude에 붙여넣기만 하면 끝.
      </p>

      {!ready && (
        <p className="mt-3 rounded-xl bg-app-bg px-3.5 py-2.5 text-[12.5px] font-bold text-muted">
          아직 채운 칸이 없어요. 한 칸이라도 채우면 바로 쓸 수 있습니다.
        </p>
      )}

      <div className="mt-4 space-y-2.5">
        {WIKI_USES.map((u) => {
          const on = done === u.id;
          return (
            <button
              key={u.id}
              type="button"
              disabled={!ready}
              onClick={() => copy(u.id, buildUseText(u, wiki))}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                on ? "border-pink bg-soft-pink" : "border-line bg-white hover:border-pink"
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-app-bg text-[22px]">{u.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-extrabold text-ink">{u.title}</span>
                <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">{u.desc}</span>
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-extrabold ${
                  on ? "bg-pink text-white" : "bg-navy text-white"
                }`}
              >
                {on ? "복사됨 ✓" : "복사"}
              </span>
            </button>
          );
        })}
      </div>

      {done && done !== "_all" && (
        <p role="status" className="mt-3 text-[12.5px] font-bold text-pink">
          복사됐어요. ChatGPT나 Claude를 열고 붙여넣어 주세요.
        </p>
      )}
      {failed && (
        <p className="mt-3 text-[12px] text-muted">자동 복사가 안 됐어요. 아래 ‘파일로 저장’을 눌러 파일 내용을 붙여넣어 주세요.</p>
      )}

      {/* AI 프로젝트·스킬·팀 폴더에 올려둘 때는 파일이 편하다 */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <button
          type="button"
          disabled={!ready}
          onClick={() => copy("_all", wikiToText(wiki))}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-extrabold text-ink disabled:opacity-50"
        >
          {done === "_all" ? "복사됐어요 ✓" : "정리본만 전체 복사"}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={saveFile}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-extrabold text-ink disabled:opacity-50"
        >
          파일로 저장
        </button>
      </div>
    </section>
  );
}
