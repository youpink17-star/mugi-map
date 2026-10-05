"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomTabs from "./BottomTabs";
import NavIllustration from "./NavIllustration";
import HeroIllustration from "./HeroIllustration";
import { WikiUseShowcase } from "./wiki/WikiUses";
import {
  BUSINESS_TYPE_ORDER,
  BUSINESS_TYPE_LABEL,
  type SellingStatus,
  type BusinessType,
} from "@/lib/wiki";
import {
  loadWiki,
  getOrCreateWiki,
  setMeta,
  updateSection,
  completionRate,
} from "@/lib/wikiStore";
import { reportForSelling } from "@/lib/storeProducts";

// env로 리포트 URL 덮어쓰기 가능(없으면 기본 라이브 URL)
const REPORT_ENV: Record<string, string | undefined> = {
  NEXT_PUBLIC_URL_REPORT_ITEM: process.env.NEXT_PUBLIC_URL_REPORT_ITEM,
  NEXT_PUBLIC_URL_REPORT_MARKETING: process.env.NEXT_PUBLIC_URL_REPORT_MARKETING,
};

function goToStart() {
  document.getElementById("start-q")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type Step = "ask" | "onboard";

export default function HomeView() {
  const router = useRouter();
  const [rate, setRate] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("ask");
  const [selling, setSelling] = useState<SellingStatus>("none");
  const [form, setForm] = useState({
    name: "",
    type: "undecided" as BusinessType,
    startedAt: "",
    oneLiner: "",
  });

  useEffect(() => {
    const w = loadWiki();
    if (w) setRate(completionRate(w));
  }, []);

  function choose(s: SellingStatus) {
    setSelling(s);
    setForm((f) => ({ ...f, type: s === "selling" ? "product" : "undecided" }));
    setStep("onboard");
  }

  function finish() {
    const w = getOrCreateWiki();
    let next = setMeta(w, {
      title: form.name.trim() || "내 사업",
      sellingStatus: selling,
      businessType: selling === "selling" ? form.type : "undecided",
      startedAt: selling === "selling" && form.startedAt ? form.startedAt : undefined,
    });
    // 여기서 적은 이름·한 줄은 '개요' 질문에 미리 채워 둔다 (같은 걸 두 번 묻지 않게).
    // 개요 칸은 질문에 답해야 완성되므로 본문은 비워 둔다.
    const seed: Record<string, string> = {};
    if (form.name.trim()) seed.name = form.name.trim().slice(0, 60);
    if (form.oneLiner.trim()) seed._seed = form.oneLiner.trim().slice(0, 200);
    if (Object.keys(seed).length && !w.sections.overview?.content) {
      next = updateSection(next, "overview", { answers: { ...(w.sections.overview?.answers ?? {}), ...seed } });
    }
    void next;
    router.push("/wiki");
  }

  const returning = rate !== null && rate > 0;

  return (
    <>
      {/* 히어로 — 연보라→흰색 그라데이션으로 아래 섹션과 자연스럽게 이어짐 */}
      <section className="w-full bg-gradient-to-b from-[#ECE6FB] via-[#F4F0FE] to-white text-ink">
        <div className="mx-auto max-w-2xl px-6 pb-6 pt-11 md:max-w-3xl md:px-10 md:pb-10 md:pt-16">
          <h1 className="text-[25px] font-extrabold leading-[1.35] text-ink md:text-[36px]">
            머릿속에서만 맴돌던 내 사업
            <br />
            <span className="text-pink">이제 눈앞에 펼쳐보세요.</span>
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-muted md:max-w-md md:text-[15px]">
            사업 아이디어가 흩어져 있으면 방향이 안 보입니다.
            <br />
            무기지도는 흩어진 걸 <b className="font-extrabold text-ink">한 장의 사업 지도</b>로 모아
            <br />
            지금 채울 칸과 다음에 가야 하는 방향을 짚어줍니다.
          </p>

          {/* 접힌 사업 지도 일러스트 */}
          <HeroIllustration className="mx-auto mt-5 block h-auto w-[86%] max-w-[300px] md:mt-8 md:max-w-[360px]" />

          {returning && step === "ask" && (
            <Link
              href="/wiki"
              className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-card ring-1 ring-line"
            >
              <span className="text-[14px] font-bold text-ink">내 사업 정리본 이어서 채우기</span>
              <span className="text-[13px] font-extrabold text-pink">완성도 {rate}% →</span>
            </Link>
          )}
        </div>
      </section>

      {/* 1단계: 질문 (2택) — 들어오자마자 누를 수 있게 큰 버튼 두 개 */}
      {step === "ask" && (
        <section id="start-q" className="mx-auto w-full max-w-2xl scroll-mt-4 px-5 pt-7 md:max-w-3xl md:px-10">
          <h2 className="text-[20px] font-extrabold leading-snug text-ink md:text-[24px]">
            지금 팔 상품이 <span className="text-pink">있나요?</span>
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <ChoiceButton mark="?" title="아직 없어요" desc="강점부터 찾기" onClick={() => choose("none")} />
            <ChoiceButton mark="✓" accent title="있어요" desc="빈틈부터 찾기" onClick={() => choose("selling")} />
          </div>
          <p className="mt-3 text-center text-[12.5px] text-muted">누르면 내 지도가 바로 만들어집니다</p>

          {/* 무기지도가 해주는 일 — 글 대신 작은 그림 3장 */}
          <h2 className="mt-9 text-[17px] font-extrabold text-ink">무기지도가 해주는 일</h2>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <FeatureTile label="한 장으로 정리">
              <div className="w-full px-3">
                <div className="h-[7px] w-[70%] rounded-full bg-navy" />
                <div className="mt-1.5 h-[7px] rounded-full bg-[#E3E1EC]" />
                <div className="mt-1.5 h-[7px] w-[60%] rounded-full bg-[#E3E1EC]" />
              </div>
            </FeatureTile>
            <FeatureTile label="다음 칸 안내">
              <svg width="76" height="34" viewBox="0 0 76 34" aria-hidden="true">
                <path d="M8 26 C28 26,28 10,48 10 S64 8 68 8" fill="none" stroke="#E0487C" strokeWidth="4" strokeLinecap="round" />
                <circle cx="8" cy="26" r="4.5" fill="#fff" stroke="#E0487C" strokeWidth="3" />
                <circle cx="68" cy="8" r="5.5" fill="#E0487C" />
              </svg>
            </FeatureTile>
            <FeatureTile label="AI에 꺼내 쓰기">
              <span className="rounded-full rounded-br-[4px] bg-pink px-2.5 py-1 text-[10.5px] font-extrabold text-white">
                글 써줘
              </span>
            </FeatureTile>
          </div>
        </section>
      )}

      {/* 2단계: 간단 온보딩 */}
      {step === "onboard" && (
        <section className="mx-auto w-full max-w-2xl px-5 pt-7 md:max-w-3xl md:px-10">
          <button
            onClick={() => setStep("ask")}
            className="mb-3 text-[13px] font-bold text-muted"
          >
            ← 다시 선택
          </button>
          <h2 className="text-[18px] font-extrabold text-ink">
            {selling === "selling" ? "내 상품 지도 그리기" : "내 무기 지도 그리기"}
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            몇 가지만 적으면 바로 내 사업 지도가 만들어집니다. 나중에 다 바꿀 수 있어요.
          </p>

          <div className="mt-5 space-y-4">
            {/* 사업/활동 이름 */}
            <Field label="사업·활동 이름">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="예) 김코치의 글쓰기 클래스"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-pink"
              />
            </Field>

            {/* selling 전용: 유형 + 시작일 */}
            {selling === "selling" && (
              <>
                <Field label="사업 유형">
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_TYPE_ORDER.map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`rounded-xl border px-3.5 py-2.5 text-[14px] font-bold transition ${
                          form.type === t
                            ? "border-pink bg-soft-pink text-ink"
                            : "border-line bg-white text-ink/70"
                        }`}
                      >
                        {BUSINESS_TYPE_LABEL[t]}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="사업 시작일">
                  <input
                    type="date"
                    value={form.startedAt}
                    onChange={(e) => setForm((f) => ({ ...f, startedAt: e.target.value }))}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-pink"
                  />
                </Field>
              </>
            )}

            {/* 한 줄 소개 */}
            <Field
              label={selling === "selling" ? "무엇을 파나요? (한 줄)" : "어떤 강점·관심이 있나요? (선택)"}
            >
              <input
                value={form.oneLiner}
                onChange={(e) => setForm((f) => ({ ...f, oneLiner: e.target.value }))}
                placeholder={
                  selling === "selling"
                    ? "예) 직장인 대상 글쓰기 1:1 코칭"
                    : "예) 정리·설명을 잘해요"
                }
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-pink"
              />
            </Field>
          </div>

          <button
            onClick={finish}
            className="mt-6 w-full rounded-2xl bg-pink-grad py-3.5 text-center text-[15px] font-extrabold text-white shadow-cta"
          >
            내 사업 지도 만들기 →
          </button>
          <button
            onClick={finish}
            className="mt-2 w-full py-2 text-center text-[13px] font-semibold text-muted"
          >
            나중에 적을게요 · 바로 지도 열기
          </button>

          {/* 상황별 자동 리포트 (개인 정보 입력 → 40p 개인화 PDF) */}
          {(() => {
            const rep = reportForSelling(selling);
            const url = REPORT_ENV[rep.envKey] || rep.url;
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition active:scale-[0.99]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft-pink text-[22px]">
                  📄
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13.5px] font-extrabold text-ink">{rep.title}</p>
                    <span className="rounded-full bg-app-bg px-1.5 py-0.5 text-[10px] font-bold text-muted">
                      40p 개인화
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{rep.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-white">
                  받아보기 ↗
                </span>
              </a>
            );
          })()}
          <p className="mt-2 text-center text-[11px] text-muted">
            지금 바로 받아볼 수 있는 자동 리포트예요
          </p>
        </section>
      )}

      {/* 위키 미리보기 (질문 단계에서만) — 사업 내비게이션 일러스트 */}
      {step === "ask" && (
        <section className="mx-auto w-full max-w-2xl px-5 pt-10 md:max-w-3xl md:px-10">
          <h2 className="text-[17px] font-extrabold text-ink">사업에도 내비게이션이 필요합니다</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            <b className="font-extrabold text-pink underline decoration-pink/40 underline-offset-2">
              무기지도
            </b>
            가 지금 내 위치와 다음 목적지를 알려드려요.
          </p>

          <button onClick={goToStart} className="mt-3 block w-full">
            <NavIllustration className="h-auto w-full" />
          </button>

          {/* 완성한 지도의 쓸모 — 나만 보고 끝나는 문서가 아니라는 걸 보여준다 */}
          <WikiUseShowcase />

          {/* 무기진단 별도 진입 — 막힐 때 쓰는 도구 */}
          <Link
            href="/diagnosis"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-pink"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft-pink text-[22px]">
              🧭
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-extrabold text-ink">
                막막할 땐 <span className="text-pink">무기진단</span>
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">
                내가 뭘 잘하고, 뭘 팔 수 있고, 어떻게 팔면 좋을지 테스트로 찾아보세요.
              </span>
            </span>
            <span className="shrink-0 text-[18px] font-extrabold text-pink">→</span>
          </Link>
        </section>
      )}

      <footer className="mx-auto mt-10 w-full max-w-2xl border-t border-line px-5 py-6 text-center text-[12px] text-muted md:max-w-3xl md:px-10">
        <b className="text-ink">무기제작소</b> · 1인사업가의 사업을 한 장으로 정리하는 작업실
        <div className="mt-3 flex items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/mugi_maker/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-muted transition hover:text-pink"
          >
            인스타그램
          </a>
          <span className="text-line">·</span>
          <a
            href="https://www.youtube.com/@mugi_maker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-muted transition hover:text-pink"
          >
            유튜브
          </a>
        </div>
      </footer>

      <BottomTabs active="home" />
    </>
  );
}

function ChoiceButton({
  mark,
  accent = false,
  title,
  desc,
  onClick,
}: {
  mark: string;
  accent?: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-center rounded-2xl border-2 border-line bg-white px-3 py-6 text-center transition hover:border-pink hover:bg-soft-pink active:scale-[0.98]"
    >
      <span
        className={`grid h-12 w-12 place-items-center rounded-full text-[22px] font-extrabold leading-none ${
          accent ? "bg-pink text-white" : "bg-app-bg text-muted"
        }`}
      >
        {mark}
      </span>
      <span className="mt-3 block text-[16.5px] font-extrabold text-ink">{title}</span>
      <span className="mt-0.5 block text-[13px] text-muted">{desc}</span>
    </button>
  );
}

// 작은 그림 + 한마디 (무기지도가 해주는 일)
function FeatureTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-2.5">
      <div className="grid h-[62px] place-items-center rounded-xl bg-[#F3F1F8]">{children}</div>
      <p className="mt-2 text-center text-[12.5px] font-extrabold text-ink [word-break:keep-all]">{label}</p>
    </div>
  );
}

// label 로 감싸 자식 input 이 암묵적으로 연결됨(클릭 포커스·스크린리더 대응)
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-ink/70">{label}</span>
      {children}
    </label>
  );
}
