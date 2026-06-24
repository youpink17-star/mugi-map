import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function NotFound() {
  return (
    <>
      <AppHeader showBack />
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
        <div className="mb-3 text-4xl">🧭</div>
        <h1 className="text-[20px] font-extrabold text-ink">페이지를 찾을 수 없어요</h1>
        <p className="mt-2 text-[14px] text-muted">주소가 바뀌었거나 만료된 결과일 수 있어요.</p>
        <Link href="/" className="mt-6 rounded-xl bg-navy px-5 py-3 text-[14px] font-bold text-white">
          홈으로
        </Link>
      </div>
    </>
  );
}
