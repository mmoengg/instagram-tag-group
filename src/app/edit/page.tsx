import Link from "next/link";
import HandleForm from "@/components/HandleForm";

export default function EditPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <header>
        <h1 className="text-2xl font-bold">정보 수정</h1>
        <p className="mt-1 text-sm text-neutral-500">
          비밀번호가 기억 안 나면 운영자에게 DM 주세요.
        </p>
      </header>
      <HandleForm mode="edit" />
      <Link href="/" className="text-sm text-neutral-500 underline">
        ← 처음으로
      </Link>
    </main>
  );
}
