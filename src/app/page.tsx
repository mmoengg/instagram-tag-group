import { Suspense } from "react";
import Link from "next/link";
import HandleForm from "@/components/HandleForm";
import Groups from "@/components/Groups";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-12">
      <header>
        <h1 className="text-2xl font-bold">인스타 품앗이 조 편성</h1>
        <p className="mt-1 text-sm text-neutral-500">
          아이디를 등록하면 5명씩 조가 짜여요. 조별 &lsquo;전체 복사&rsquo; 후 댓글에 붙여넣기!
        </p>
      </header>

      <HandleForm mode="register" />

      <Link href="/edit" className="text-sm text-neutral-500 underline">
        잘못 입력했나요? 정보 수정
      </Link>

      <Suspense fallback={<p className="text-sm text-neutral-500">조 불러오는 중…</p>}>
        <Groups />
      </Suspense>
    </main>
  );
}
