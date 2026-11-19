import Link from "next/link";
import HandleForm from "@/components/HandleForm";
import MyPicks from "@/components/MyPicks";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <header>
        <h1 className="text-2xl font-bold">인스타 품앗이 소환</h1>
        <p className="mt-1 text-sm text-neutral-500">
          등록하면 나를 뺀 5명이 매일 정해져요. 복사해서 댓글에 소환하고, 친해져요!
        </p>
      </header>

      <MyPicks />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">처음이라면 등록</h2>
        <HandleForm mode="register" />
        <Link href="/edit" className="text-sm text-neutral-500 underline">
          잘못 입력했나요? 정보 수정
        </Link>
      </section>
    </main>
  );
}
