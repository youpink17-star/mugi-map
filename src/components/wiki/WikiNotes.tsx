"use client";
import { useState } from "react";
import { IDEA_PATHS, pickQuote } from "@/lib/wiki";
import type { BusinessWiki, WikiNote } from "@/lib/wikiStore";

// 불편함 노트 — 불편함 + 내가 생각한 해결책을 계속 모으는 공간.
// 하단엔 '불편함을 사업으로 바꾸는 길' 가이드 + 창작자 명언.
export default function WikiNotes({
  wiki,
  onAdd,
  onDelete,
  onMarkIdea,
}: {
  wiki: BusinessWiki;
  onAdd: (n: Omit<WikiNote, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
  onMarkIdea: (id: string) => void;
}) {
  const empty = { discomfort: "", who: "", when: "", existing: "", whyUnsatisfied: "", myIdea: "" };
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  function submit() {
    if (!form.discomfort.trim()) return;
    onAdd(form);
    setForm(empty);
    setOpen(false);
  }

  const fields: { key: keyof typeof empty; label: string; ph: string; area?: boolean }[] = [
    { key: "discomfort", label: "발견한 불편함", ph: "어떤 불편함을 봤나요?", area: true },
    { key: "who", label: "누가 겪는 문제인지", ph: "이 문제를 겪는 사람은?" },
    { key: "when", label: "언제 발생하는지", ph: "어떤 순간/상황에서?" },
    { key: "existing", label: "기존 해결책", ph: "지금은 어떻게들 해결하나요?" },
    { key: "whyUnsatisfied", label: "왜 아직 불만족인지", ph: "기존 방법의 아쉬운 점은?" },
    { key: "myIdea", label: "내가 생각한 해결책", ph: "내가 풀면 이렇게 풀겠다 (떠오르는 대로)", area: true },
  ];

  const quote = pickQuote(wiki.notes.length);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-purple">아이디어 노트</p>
          <h2 className="text-[20px] font-extrabold leading-tight text-ink lg:text-[24px]">
            불편함 노트
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            성공한 상품은 대부분 불편함에서 나옵니다.
          </p>
        </div>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl bg-pink-grad px-3.5 py-2.5 text-[13px] font-extrabold text-white shadow-cta"
          >
            + 불편함 기록
          </button>
        )}
      </div>

      {/* 입력 폼 */}
      {open && (
        <div className="mt-4 rounded-2xl border border-line bg-app-bg/60 p-4">
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-[12px] font-bold text-ink/70">{f.label}</label>
                {f.area ? (
                  <textarea
                    value={form[f.key]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    rows={2}
                    className="w-full resize-y rounded-xl border border-line bg-white p-3 text-[14px] text-ink outline-none placeholder:text-muted/70 focus:border-pink"
                  />
                ) : (
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full rounded-xl border border-line bg-white p-3 text-[14px] text-ink outline-none placeholder:text-muted/70 focus:border-pink"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={submit}
              disabled={!form.discomfort.trim()}
              className="flex-1 rounded-xl bg-navy py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
            >
              노트에 저장
            </button>
            <button
              onClick={() => {
                setForm(empty);
                setOpen(false);
              }}
              className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-bold text-muted"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 기록 목록 */}
      <div className="mt-4 space-y-3">
        {wiki.notes.length === 0 && !open && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-center">
            <div className="text-3xl">🗒️</div>
            <p className="mt-2 text-[14px] font-bold text-ink">아직 기록한 불편함이 없어요</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              요즘 내가 불편했던 것, 손님이 자주 묻는 것,
              <br />
              매번 반복해서 설명하는 것을 모아두세요.
            </p>
          </div>
        )}
        {wiki.notes.map((n) => (
          <NoteCard key={n.id} note={n} onDelete={onDelete} onMarkIdea={onMarkIdea} />
        ))}
      </div>

      {/* 하단: 불편함을 사업으로 바꾸는 길 + 창작자 명언 */}
      <div className="mt-6 rounded-2xl border border-purple/20 bg-soft-pink/50 p-5">
        <p className="text-[12px] font-bold text-purple">불편함으로 만들 수 있는 사업 아이템</p>
        <p className="mt-0.5 text-[13px] text-muted">하나의 불편함도 여러 갈래로 풀 수 있어요.</p>
        <div className="mt-4 space-y-3">
          {IDEA_PATHS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft-pink text-[18px]">
                  {p.emoji}
                </span>
                <p className="text-[14px] font-extrabold text-ink">{p.title}</p>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-ink/80">{p.how}</p>

              <div className="mt-3 rounded-xl bg-soft-pink/70 px-3 py-2.5">
                <p className="text-[11px] font-extrabold text-pink">본질</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink/85">{p.essence}</p>
              </div>

              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                <span className="font-bold text-ink/45">종류 · </span>
                {p.types}
              </p>
            </div>
          ))}
        </div>

        <figure className="mt-4 rounded-xl bg-navy p-4 text-white">
          <blockquote className="text-[14px] font-semibold leading-relaxed">“{quote.text}”</blockquote>
          <figcaption className="mt-1.5 text-[12px] text-white/60">
            — {quote.author} · {quote.source}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function NoteCard({
  note: n,
  onDelete,
  onMarkIdea,
}: {
  note: WikiNote;
  onDelete: (id: string) => void;
  onMarkIdea: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[15px] font-extrabold leading-snug text-ink">{n.discomfort}</p>
        {n.turnedIntoIdea && (
          <span className="shrink-0 rounded-full bg-soft-pink px-2 py-0.5 text-[11px] font-bold text-pink">
            ⭐ 후보
          </span>
        )}
      </div>
      <dl className="mt-2 space-y-1 text-[13px] text-muted">
        {n.who && <Row k="누가" v={n.who} />}
        {n.when && <Row k="언제" v={n.when} />}
        {n.existing && <Row k="기존 해결" v={n.existing} />}
        {n.whyUnsatisfied && <Row k="아쉬운 점" v={n.whyUnsatisfied} />}
      </dl>

      {/* 내가 생각한 해결책 — 강조 */}
      {n.myIdea && (
        <div className="mt-2.5 rounded-xl border border-pink/30 bg-soft-pink/60 p-3">
          <p className="text-[11px] font-bold text-pink">내가 생각한 해결책</p>
          <p className="mt-0.5 whitespace-pre-line text-[13.5px] leading-relaxed text-ink/85">
            {n.myIdea}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onMarkIdea(n.id)}
          className={`rounded-lg px-3 py-2 text-[12px] font-bold ${
            n.turnedIntoIdea ? "bg-app-bg text-muted" : "bg-soft-pink text-pink"
          }`}
        >
          {n.turnedIntoIdea ? "⭐ 후보 해제" : "⭐ 아이디어 후보"}
        </button>
        <button
          onClick={() => onDelete(n.id)}
          className="rounded-lg border border-line px-3 py-2 text-[12px] font-bold text-muted"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-bold text-ink/50">{k}</dt>
      <dd className="text-ink/75">{v}</dd>
    </div>
  );
}
