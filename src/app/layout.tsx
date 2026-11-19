import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인스타 품앗이 조 편성",
  description: "아이디를 등록하면 5명씩 조가 짜여요",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col antialiased">
        {children}
        <footer className="mt-auto pb-8 text-center text-xs text-neutral-400">
          ©{" "}
          <a
            href="https://www.instagram.com/darani.zip/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-700 hover:underline"
          >
            darani
          </a>
          . All rights reserved.
        </footer>
      </body>
    </html>
  );
}
