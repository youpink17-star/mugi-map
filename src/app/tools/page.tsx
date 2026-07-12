import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import Link from "next/link";
import { STORE_TIERS } from "@/lib/storeProducts";

// 외부 판매 URL은 서버에서 env로 해석 (없으면 "준비 중")
// process.env를 클라이언트에서 동적 조회하면 정적 치환이 안 되므로 서버 컴포넌트에서 처리.
function resolveUrl(envKey?: string, defaultUrl?: string): string | undefined {
  if (envKey) {
    const v = process.env[envKey as keyof NodeJS.ProcessEnv];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return defaultUrl || undefined;
}

export default function ToolsPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-app flex-1 px-4 pb-6 md:max-w-2xl md:px-6 lg:max-w-[760px]">
        {/* 인트로 */}
        <section className="mt-5 rounded-3xl bg-navy p-6 text-white md:p-8">
          <p className="text-[12px] font-bold text-pink">무기상점</p>
          <h1 className="mt-1.5 text-[20px] font-extrabold leading-snug md:text-[26px]">
            내 무기를 실제 매출로
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70 md:text-[14px]">
            무료로 내 무기를 찾고, 필요할 때 한 단계씩 올라가세요. 콘텐츠·마케팅부터
            1:1 진단까지, 지금 막힌 지점에 맞는 도구를 하나씩 골라보세요.
          </p>
          <Link
            href="/wiki"
            className="mt-4 inline-block rounded-xl bg-pink-grad px-4 py-2.5 text-[14px] font-extrabold text-white shadow-cta"
          >
            먼저 내 사업 위키 채우기 →
          </Link>
        </section>

        {/* A~E 상품군 계단 */}
        <div className="mt-6 space-y-7">
          {STORE_TIERS.map((tier) => {
            return (
              <section key={tier.tier}>
                <div className="mb-2.5 flex items-baseline gap-2">
                  <span className="text-[18px]">{tier.emoji}</span>
                  <h2 className="text-[16px] font-extrabold text-ink">{tier.label}</h2>
                </div>
                <p className="mb-3 text-[12.5px] leading-relaxed text-muted">{tier.goal}</p>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {tier.products.map((p) => {
                    const url = resolveUrl(p.envKey, p.defaultUrl);
                    const isFree = tier.tier === "free";
                    const inner = (
                      <div
                        className={[
                          "flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition",
                          url ? "active:scale-[0.99] hover:border-pink" : "",
                        ].join(" ")}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-[14.5px] font-extrabold text-ink">{p.title}</p>
                            {p.badge && (
                              <span className="rounded-full bg-app-bg px-2 py-0.5 text-[10px] font-extrabold text-ink/60">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{p.desc}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          {isFree ? (
                            <p className="text-[14px] font-extrabold text-navy">{p.price}</p>
                          ) : (
                            <span
                              className={[
                                "inline-block rounded-full px-2.5 py-1 text-[11px] font-bold",
                                url ? "bg-navy text-white" : "bg-app-bg text-muted",
                              ].join(" ")}
                            >
                              {url ? "보러가기 ↗" : "준비 중"}
                            </span>
                          )}
                        </div>
                      </div>
                    );

                    // 무료 상품은 내부 링크, 유료는 외부(있을 때만)
                    if (isFree) {
                      const href =
                        p.id === "free-wiki" ? "/wiki" : p.id === "free-diagnosis" ? "/" : "/wiki";
                      return (
                        <Link key={p.id} href={href} className="block">
                          {inner}
                        </Link>
                      );
                    }
                    if (url) {
                      return (
                        <a key={p.id} href={url} target="_blank" rel="noopener noreferrer" className="block">
                          {inner}
                        </a>
                      );
                    }
                    return <div key={p.id}>{inner}</div>;
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-muted">
          가격·구성은 변경될 수 있어요. 결제는 각 상품 페이지에서 진행됩니다.
        </p>
      </main>
      <BottomTabs active="tools" />
    </>
  );
}
