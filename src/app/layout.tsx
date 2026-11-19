import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인스타 품앗이 소환",
  description: "등록하면 나를 뺀 5명이 매일 정해져요",
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
