import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "무기제작소 — 사업·마케팅 무기진단센터",
  description:
    "열심히 하는데 왜 안 팔릴까요? 상품이 나빠서가 아닙니다. 팔리는 구조를 못 찾은 것입니다. 사업 단계에 맞춰 1:1로 분석해드립니다.",
  openGraph: {
    title: "무기제작소 — 사업·마케팅 무기진단센터",
    description: "팔리는 구조를 못 찾은 것입니다. 사업 단계에 맞춰 진단해드립니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07071F",
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
