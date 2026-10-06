import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import { DIAGNOSIS_URL } from "@/lib/links";

// 무기진단은 별도 앱(포트 3002)으로 분리됨. 여기는 그 앱으로 보내는 링크 카드만 남긴다.
export default function DiagnosisPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-app flex-1 px-4 pb-2 md:max-w-xl md:px-6 lg:max-w-2xl">
        <section className="mt-4 rounded-3xl bg-navy p-6 text-white md:p-8">
          <p className="text-[12px] font-bold text-pink">무기 유형 테스트</p>
          <h1 className="mt-1.5 text-[21px] font-extrabold leading-snug md:text-[28px]">
            막막할 땐,
            <br />테스트로 시작하세요
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70 md:text-[14px]">
            나에게 맞는 일하는 방식과 내 무기 유형을 찾아주는 무료 테스트가 새 창으로 열립니다. 결과는 다시 이 지도로 옮겨 정리하세요.
          </p>
          <a
            href={DIAGNOSIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-pink-grad px-4 py-2.5 text-[14px] font-extrabold text-white shadow-cta"
          >
            무기 유형 테스트 열기 →
          </a>
        </section>

        <section className="mt-5 rounded-2xl border border-line bg-white p-5 md:p-6">
          <p className="text-[13px] font-bold text-ink">테스트는 왜 따로 있나요?</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            테스트는 사업 지도의 빈칸을 채우는 <b className="text-ink">입력 도구</b>예요. 가볍게 받아보고, 마음에 드는 결과만 골라
            이 지도의 강점·팔 것·타겟·콘텐츠 칸에 옮겨 적으면 됩니다.
          </p>
        </section>

        <footer className="mt-9 border-t border-line py-6 text-center text-[12px] text-muted">
          본체는 <b className="text-ink">내 사업 지도</b>입니다. 테스트는 거들 뿐.
        </footer>
      </main>
      <BottomTabs />
    </>
  );
}
