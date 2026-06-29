"use client";
import { WIKI_SECTIONS, type WikiSectionDef } from "@/lib/wiki";
import type { BusinessWiki } from "@/lib/wikiStore";

// 빈칸 = "내 사업 만들기 여정" — 화면 전체가 부드러운 지도. 검정 박스 없음.
// 상단: 캐릭터 + 상태(남은 여정/오늘의 미션). 아래: 구불구불한 길 위 노드.

const LEAVES = WIKI_SECTIONS.filter((s) => !s.isParent);

const ICON: Record<string, string> = {
  overview: "🧭",
  weapon: "⚔️",
  product: "💎",
  target: "🎯",
  diff: "✨",
  content: "📣",
  "funnel-awareness": "👀",
  "funnel-interest": "💖",
  "funnel-consideration": "🔍",
  "funnel-purchase": "💳",
  todo: "🚀",
};

// 여정(빈칸)에서 보여줄 친근한 노드 라벨 (위키 섹션 제목과 다르게)
const JOURNEY_LABELS: Record<string, string> = {
  overview: "1. 개요",
  weapon: "2. 내 무기",
  product: "3. 판매할 것",
  target: "4. 메인 고객",
  diff: "5. 차별화 포인트",
  content: "6. 브랜드 콘텐츠",
  "funnel-awareness": "7-1. 알리기 (인지)",
  "funnel-interest": "7-2. 관심갖게 하기 (관심)",
  "funnel-consideration": "7-3. 혹하게 만들기 (고려)",
  "funnel-purchase": "7-4. 결정하게 만들기 (구매)",
  todo: "8. 브랜드 최종 방향성",
};

function journeyLabel(def: WikiSectionDef): string {
  return JOURNEY_LABELS[def.id] ?? `${def.num}. ${def.title}`;
}

// 노드를 3구역으로 묶기: 현재 위치 확인(1-3) / 목적지 입력(4-6) / 경로 따라가기(7-8)
const ZONE_OF: Record<string, string> = {
  overview: "현재 위치 확인하기",
  target: "목적지 입력하기",
  "funnel-awareness": "경로 따라가기",
};

const W = 360;
const CX = 180;
const AMP = 100;
const TOP = 60;
const DY = 112;

function isFilled(w: BusinessWiki, id: string) {
  return (w.sections[id]?.status ?? "empty") !== "empty";
}

export default function WikiJourney({
  wiki,
  onPick,
  onBack,
  onDoc,
}: {
  wiki: BusinessWiki;
  onPick: (id: string) => void;
  onBack: () => void;
  onDoc: () => void;
}) {
  const nodes = LEAVES.map((def, i) => ({
    def,
    x: CX + AMP * Math.sin(i * 1.0),
    y: TOP + i * DY,
    filled: isFilled(wiki, def.id),
    status: wiki.sections[def.id]?.status ?? "empty",
  }));

  const done = nodes.filter((n) => n.filled).length;
  const total = nodes.length;
  const firstEmptyIdx = nodes.findIndex((n) => !n.filled);
  const nextDef = firstEmptyIdx >= 0 ? nodes[firstEmptyIdx].def : null;
  const goal = { x: CX, y: TOP + (total - 1) * DY + 96 };
  const H = goal.y + 52;

  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const my = (a.y + b.y) / 2;
    d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  {
    const a = nodes[nodes.length - 1];
    const my = (a.y + goal.y) / 2;
    d += ` C ${a.x} ${my}, ${goal.x} ${my}, ${goal.x} ${goal.y}`;
  }

  const clouds = [
    { x: 70, y: 40, s: 0.9 },
    { x: 300, y: 92, s: 0.78 },
    { x: 150, y: 150, s: 0.62 },
    { x: 250, y: 230, s: 0.7 },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#DCEBFF] via-[#E9E8FF] to-[#DBF2E4]">
      {/* 풀블리드 산 (바닥) */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] w-full"
        viewBox="0 0 360 280"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 200 C 80 140, 150 150, 205 192 C 262 235, 300 168, 360 196 L360 280 L0 280 Z" fill="#CBE8D5" opacity="0.6" />
        <path d="M0 244 C 70 196, 150 212, 212 242 C 280 276, 320 214, 360 240 L360 280 L0 280 Z" fill="#A9D8BA" opacity="0.85" />
      </svg>

      {/* ===== 상단: 뒤로/정리본 + 캐릭터 상태 ===== */}
      <div className="relative z-10 mx-auto max-w-md px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-white/70 bg-white/80 px-3.5 py-2 text-[13px] font-bold text-ink shadow-sm backdrop-blur"
          >
            ← 위키로
          </button>
          <button
            onClick={onDoc}
            className="rounded-xl border border-white/70 bg-white/80 px-3.5 py-2 text-[13px] font-bold text-ink shadow-sm backdrop-blur"
          >
            📄 정리본
          </button>
        </div>

        <CharacterHeader done={done} total={total} nextDef={nextDef} onPick={onPick} />
      </div>

      {/* ===== 지도(길 + 노드) ===== */}
      <div className="relative z-10 mx-auto mt-2" style={{ width: W, height: H, maxWidth: "100%" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" aria-hidden="true">
          {clouds.map((c, i) => (
            <Cloud key={i} x={c.x} y={c.y} s={c.s} />
          ))}

          {/* 길 */}
          <path d={d} fill="none" stroke="#07071f" strokeOpacity="0.06" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#FFB7D8" strokeWidth="2.5" strokeDasharray="1 9" strokeLinecap="round" />

          {/* 시작 깃발 */}
          <rect x={nodes[0].x - 22} y={nodes[0].y - 42} width="2.5" height="22" rx="1" fill="#94A1B2" />
          <path d={`M ${nodes[0].x - 20} ${nodes[0].y - 42} L ${nodes[0].x - 7} ${nodes[0].y - 37} L ${nodes[0].x - 20} ${nodes[0].y - 32} Z`} fill="#FF2F8F" />

          {/* 목표 보물상자 */}
          <g>
            <ellipse cx={goal.x} cy={goal.y + 20} rx="20" ry="5" fill="#07071F" opacity="0.10" />
            <rect x={goal.x - 16} y={goal.y - 2} width="32" height="22" rx="4" fill="#F2B33A" />
            <rect x={goal.x - 16} y={goal.y - 10} width="32" height="10" rx="3" fill="#FFD36B" />
            <rect x={goal.x - 3} y={goal.y - 10} width="6" height="30" fill="#E0922A" />
          </g>
        </svg>

        {/* 3구역 라벨 — 현재 위치 확인 / 목적지 입력 / 경로 따라가기 */}
        {nodes.map((n) =>
          ZONE_OF[n.def.id] ? (
            <div
              key={`zone-${n.def.id}`}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: CX, top: n.y - 48 }}
            >
              <span className="rounded-full bg-purple px-3 py-1 text-[11px] font-extrabold text-white shadow-[0_4px_10px_rgba(139,92,246,0.35)]">
                {ZONE_OF[n.def.id]}
              </span>
            </div>
          ) : null
        )}

        {nodes.map((n, i) => (
          <Node
            key={n.def.id}
            def={n.def}
            x={n.x}
            y={n.y}
            filled={n.filled}
            status={n.status}
            isNext={i === firstEmptyIdx}
            onPick={onPick}
          />
        ))}

        <div className="absolute -translate-x-1/2 text-center" style={{ left: goal.x, top: goal.y + 28 }}>
          <span className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-bold text-ink shadow-sm">
            {done === total ? "목적지를 전부 채웠어요 🎉" : "목적지 · 전부 채우기"}
          </span>
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}

// ===== 상단 캐릭터 + 상태 =====
function CharacterHeader({
  done,
  total,
  nextDef,
  onPick,
}: {
  done: number;
  total: number;
  nextDef: WikiSectionDef | null;
  onPick: (id: string) => void;
}) {
  const remaining = total - done;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-card backdrop-blur">
      <div className="flex items-center gap-3">
        {/* 캐릭터 (placeholder) — 추후 /images/journey-character.png 로 교체 */}
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-purple text-[26px] ring-4 ring-white">
          🧭
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-muted">내 여정</p>
          <p className="text-[17px] font-extrabold leading-tight text-ink">
            {remaining > 0 ? `목적지까지 ${remaining}칸 남았어요` : "여정 완주! 🎉"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-app-bg">
              <div className="h-full rounded-full bg-pink-grad transition-all" style={{ width: `${Math.max(pct, 4)}%` }} />
            </div>
            <span className="shrink-0 text-[12px] font-extrabold text-pink">
              {done}/{total}
            </span>
          </div>
        </div>
      </div>

      {nextDef ? (
        <button
          onClick={() => onPick(nextDef.id)}
          className="mt-3 flex w-full items-center justify-between rounded-2xl bg-pink-grad px-4 py-3 text-white shadow-cta"
        >
          <span className="flex items-center gap-1.5 text-[13.5px] font-extrabold">
            <span className="text-[15px]">{ICON[nextDef.id] ?? "📍"}</span>
            오늘의 미션 · {journeyLabel(nextDef).replace(/^[\d-]+\.\s*/, "")} 채우기
          </span>
          <span className="text-[15px] font-extrabold">→</span>
        </button>
      ) : (
        <div className="mt-3 rounded-2xl bg-soft-pink px-4 py-3 text-center text-[13.5px] font-extrabold text-pink">
          모든 칸을 채웠어요! 🎉 정리본에서 확인해 보세요.
        </div>
      )}
    </div>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g fill="#FFFFFF" opacity="0.85">
      <ellipse cx={x} cy={y} rx={17 * s} ry={11 * s} />
      <ellipse cx={x + 15 * s} cy={y + 3 * s} rx={12 * s} ry={8 * s} />
      <ellipse cx={x - 14 * s} cy={y + 3 * s} rx={11 * s} ry={7 * s} />
      <rect x={x - 24 * s} y={y + 1 * s} width={48 * s} height={9 * s} rx={5 * s} />
    </g>
  );
}

function Node({
  def,
  x,
  y,
  filled,
  status,
  isNext,
  onPick,
}: {
  def: WikiSectionDef;
  x: number;
  y: number;
  filled: boolean;
  status: string;
  isNext: boolean;
  onPick: (id: string) => void;
}) {
  const complete = status === "complete";
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      {isNext && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="relative rounded-full border border-pink bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-pink shadow-sm">
            여기 채우기!
          </span>
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-pink" />
        </div>
      )}

      <button
        onClick={() => onPick(def.id)}
        aria-label={`${def.num} ${def.title} 채우기`}
        className={[
          "relative grid h-[52px] w-[52px] place-items-center rounded-full border-[3px] text-[21px] shadow-[0_6px_14px_rgba(7,7,31,0.14)] transition active:translate-y-[1px]",
          complete ? "border-white bg-pink text-white" : filled ? "border-white bg-purple text-white" : "border-pink bg-white",
          isNext ? "animate-bounce-slow ring-4 ring-pink/20" : "",
        ].join(" ")}
      >
        {ICON[def.id] ?? "▫️"}
        <span
          className={`absolute -right-1 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-white text-[9px] font-bold ${
            complete ? "bg-emerald-500 text-white" : filled ? "bg-purple text-white" : "bg-pink text-white"
          }`}
        >
          {complete ? "✓" : filled ? "✎" : "+"}
        </span>
      </button>

      <div className="absolute left-1/2 top-[56px] -translate-x-1/2 whitespace-nowrap">
        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-bold text-ink shadow-sm">
          {journeyLabel(def)}
        </span>
      </div>
    </div>
  );
}
