import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import { WIKI_USES } from "@/lib/wikiUses";

export const metadata: Metadata = {
  title: "지도 활용법 — 무기지도",
  description: "다 채운 사업 지도를 어디에 쓰는지. AI에게 내 브랜드 알려주기, 소개 문구 뽑기, 같이 일할 사람에게 넘기기.",
};

// 누구나 볼 수 있는 소개 페이지 — 지도를 아직 안 만든 사람도 "완성하면 뭐가 좋은지" 먼저 본다.
export default function UsesPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-app flex-1 px-4 pb-6 md:max-w-2xl md:px-6 lg:max-w-[760px]">
        <section className="mt-5 rounded-3xl bg-navy p-6 text-white md:p-8">
          <p className="text-[12px] font-bold text-white/60">지도 활용법</p>
          <h1 className="mt-1.5 text-[20px] font-extrabold leading-snug md:text-[26px]">
            지도는 채우고 끝이 아니라
            <br />
            <span className="text-pink">매일 꺼내 쓰는 한 장</span>입니다
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70 md:text-[14px]">
            혼자 사업하면 같은 설명을 AI에게, 고객에게, 외주 작업자에게 매번 다시 합니다. 한 번 정리해두면 그
            설명을 한 장이 대신합니다.
          </p>
        </section>

        <div className="mt-6 space-y-4">
          {WIKI_USES.map((u, i) => (
            <section key={u.id} id={u.id} className="scroll-mt-20 rounded-3xl border border-line bg-white p-5 shadow-card md:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-app-bg text-[24px]">{u.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-muted">활용 {i + 1}</p>
                  <h2 className="text-[17px] font-extrabold leading-snug text-ink md:text-[19px]">{u.title}</h2>
                </div>
              </div>

              <p className="mt-4 text-[12px] font-extrabold text-ink/60">이럴 때</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink/85">{u.when}</p>

              <p className="mt-4 text-[12px] font-extrabold text-ink/60">이렇게</p>
              <ol className="mt-1.5 space-y-2">
                {u.steps.map((s, n) => (
                  <li key={n} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink/85">
                    <span className="mt-[2px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full bg-navy text-[11px] font-extrabold text-white">
                      {n + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="h-full rounded-2xl bg-app-bg p-4">
                  <p className="text-[12px] font-extrabold text-muted">지도 없이</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink/75">{u.before}</p>
                </div>
                <div className="h-full rounded-2xl bg-soft-pink p-4">
                  <p className="text-[12px] font-extrabold text-pink">지도가 있으면</p>
                  <p className="mt-1 text-[13.5px] font-bold leading-relaxed text-ink">{u.after}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-3xl border border-line bg-white p-6 text-center shadow-card">
          <h2 className="text-[17px] font-extrabold text-ink">먼저 지도를 채워야 꺼내 쓸 수 있습니다</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">질문에 답만 하면 한 장으로 정리됩니다.</p>
          <Link
            href="/wiki"
            className="mt-4 inline-block rounded-2xl bg-pink-grad px-6 py-3.5 text-[15px] font-extrabold text-white shadow-cta"
          >
            내 사업 정리본 채우기 →
          </Link>
        </section>
      </main>
      <BottomTabs />
    </>
  );
}
