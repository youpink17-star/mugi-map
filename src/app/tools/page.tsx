import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import Link from "next/link";

// 콘텐츠 제조실은 별도의 독립 사이트. 배포 URL을 환경변수로 연결한다.
const CONTENT_STUDIO_URL =
  process.env.NEXT_PUBLIC_CONTENT_STUDIO_URL || "http://localhost:3001";

// 도구실 — 나머지는 준비 중 placeholder. 위키가 본체.
const TOOLS = [
  { emoji: "🔬", title: "레퍼런스 연구소", desc: "잘 팔린 사례를 저장하고 + 내 사업에 맞게 바꿔 쓰는 공간" },
  { emoji: "💬", title: "고객 문구함", desc: "문의 답변, 협업 제안, 체험단 요청 등 상황에 맞는 문구를 바로 꺼내 쓰는 공간" },
  { emoji: "📊", title: "사업 상황판", desc: "방문자, 문의, 판매, 콘텐츠 반응을 한눈에 확인하는 공간" },
  { emoji: "📡", title: "고객 레이더", desc: "고객이 요즘 뭘 검색하고, 어떤 고민이 있는지 조사하는 공간" },
];

export default function ToolsPage() {
  return (
    <>
      <AppHeader title="도구실" />
      <main className="mx-auto w-full max-w-app flex-1 px-4 pb-6 lg:max-w-[760px]">
        <section className="mt-5 rounded-3xl bg-navy p-6 text-white">
          <p className="text-[12px] font-bold text-pink">도구실</p>
          <h1 className="mt-1.5 text-[20px] font-extrabold leading-snug">
            1인 사장님들을 위해 만들었습니다
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            혼자 다 짊어지지 말고 필요할 때 꺼내 쓰세요. 내 사업 위키에 적은 내용을 바탕으로 SNS 콘텐츠, 고객 전송용 메시지, 참고하기 좋은 사례까지 바로 확인할 수 있습니다.
          </p>
          <Link
            href="/wiki"
            className="mt-4 inline-block rounded-xl bg-pink-grad px-4 py-2.5 text-[14px] font-extrabold text-white shadow-cta"
          >
            내 사업 위키로 가기 →
          </Link>
        </section>

        {/* 콘텐츠 제조실 — 별도 사이트로 이동 */}
        <a
          href={CONTENT_STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-pink/30 bg-soft-pink p-4 shadow-card transition active:scale-[0.99]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[22px]">
            ✍️
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-extrabold text-ink">콘텐츠 제조실</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
              오늘 올릴 콘텐츠 제목, 후킹, 본문, CTA를 바로 만드는 공간
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-pink px-2.5 py-1 text-[11px] font-bold text-white">
            바로가기 ↗
          </span>
        </a>

        <div className="mt-3 space-y-3">
          {TOOLS.map((t) => (
            <div
              key={t.title}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-line bg-white p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-app-bg text-[22px]">
                {t.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-extrabold text-ink">{t.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{t.desc}</p>
              </div>
              <span className="shrink-0 rounded-full bg-app-bg px-2.5 py-1 text-[11px] font-bold text-muted">
                준비 중
              </span>
            </div>
          ))}
        </div>
      </main>
      <BottomTabs active="tools" />
    </>
  );
}
