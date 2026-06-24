import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <>
      <AppHeader title="신청 완료" />
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-soft-pink text-4xl">
          ⚒️
        </div>
        <h1 className="text-[22px] font-extrabold leading-snug text-ink">
          리포트를 생성하고 있어요
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          전문 분석을 거쳐 <b className="text-ink">정밀 리포트</b>를 만들고 있습니다.
          <br />
          완료되면 <b className="text-pink">이메일과 카카오톡</b>으로 보내드릴게요.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-line bg-white p-4 text-left">
          <p className="text-[12px] font-bold tracking-wide text-purple">예상 소요</p>
          <p className="mt-1 text-[14px] font-semibold text-ink">보통 10~30분 이내 발송</p>
          <p className="mt-3 text-[12px] font-bold tracking-wide text-purple">접수 번호</p>
          <p className="mt-1 break-all font-mono text-[12px] text-muted">{params.id}</p>
        </div>

        <Link
          href="/"
          className="mt-8 rounded-2xl bg-navy px-6 py-3.5 text-[15px] font-bold text-white"
        >
          홈으로 돌아가기
        </Link>
      </main>
    </>
  );
}
