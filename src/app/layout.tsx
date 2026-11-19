import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인스타 품앗이 소환",
  description: "등록하면 나를 뺀 5명이 매일 정해져요. 복사해서 댓글에 소환해요. 만든 사람 @darani.zip",
  openGraph: {
    title: "인스타 품앗이 소환",
    description: "매일 나를 뺀 5명, 복사해서 댓글에 소환해요",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col antialiased">
        {children}
        <footer className="mt-auto flex flex-col items-center gap-2 pt-10 pb-8">
          <a
            href="https://www.instagram.com/darani.zip/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-neutral-500">만든 사람</span>
            <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text font-semibold text-transparent">
              @darani.zip
            </span>
            <span aria-hidden className="text-neutral-400">↗</span>
          </a>
          <p className="text-xs text-neutral-400">© darani. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
