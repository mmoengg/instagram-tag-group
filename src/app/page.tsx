import { Suspense } from "react";
import Link from "next/link";
import HandleForm from "@/components/HandleForm";
import MyGroup from "@/components/MyGroup";
import Groups from "@/components/Groups";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <header>
        <h1 className="text-2xl font-bold">인스타 품앗이 조 편성</h1>
        <p className="mt-1 text-sm text-neutral-500">
          등록하면 5명씩 조가 짜여요. 내 조의 <b>다음 조</b>를 복사해서 댓글에 소환해주세요!
        </p>
      </header>

      <MyGroup />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">처음이라면 등록</h2>
        <HandleForm mode="register" />
        <Link href="/edit" className="text-sm text-neutral-500 underline">
          잘못 입력했나요? 정보 수정
        </Link>
      </section>

      <Suspense fallback={<p className="text-sm text-neutral-500">조 불러오는 중…</p>}>
        <Groups />
      </Suspense>
    </main>
  );
}
