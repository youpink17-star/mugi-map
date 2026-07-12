import type { ReactNode } from "react";

// 화면 폭 고정은 각 페이지 내부(main/section)에서 관리한다.
// 모바일에서는 자연히 앱 카드처럼 보이고, 데스크톱에서는 각 페이지가
// 자기 콘텐츠에 맞는 최대폭(max-w-2xl 등)으로 중앙 정렬해 넓게 쓴다.
export default function AppShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] flex-col bg-app-bg">{children}</div>;
}
