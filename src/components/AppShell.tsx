import type { ReactNode } from "react";

// 모든 페이지를 감싸는 모바일 앱 컨테이너.
// PC에서도 화면 중앙에 max-width 430px 로 좁게 고정된다.
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-app-bg">
      <div className="relative flex min-h-[100dvh] w-full max-w-app flex-col bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03)] md:shadow-card">
        {children}
      </div>
    </div>
  );
}
