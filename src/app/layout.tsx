import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "무기지도 — 1인사업가의 사업 지도",
  description:
    "머릿속에만 맴돌던 내 사업을 한 장의 지도로. 흩어진 강점·상품·타겟·콘텐츠를 모아 지금 채울 칸과 다음 방향을 짚어줍니다.",
  openGraph: {
    title: "무기지도 — 1인사업가의 사업 지도",
    description: "흩어진 내 사업을 한 장의 지도로 모아, 다음에 갈 방향을 짚어줍니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ECE6FB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
