import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인스타 품앗이 조 편성",
  description: "아이디를 등록하면 5명씩 조가 짜여요",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
