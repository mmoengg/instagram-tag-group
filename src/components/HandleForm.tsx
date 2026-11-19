"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "register" | "edit";

const input =
  "w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base outline-none focus:border-neutral-900";

export default function HandleForm({ mode }: { mode: Mode }) {
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/participants", {
        method: mode === "register" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return setStatus({ ok: false, msg: json.error });
      setStatus({
        ok: true,
        msg: mode === "register" ? `@${json.handle} 등록 완료!` : `@${json.handle}(으)로 수정했어요`,
      });
      form.reset();
      router.refresh(); // 조 목록 갱신
    } catch {
      setStatus({ ok: false, msg: "네트워크 오류예요. 다시 시도해주세요" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="handle"
        required
        autoCapitalize="none"
        autoCorrect="off"
        placeholder={mode === "register" ? "인스타 아이디 또는 프로필 URL" : "지금 등록된 아이디"}
        className={input}
      />
      {mode === "edit" && (
        <input name="newHandle" required autoCapitalize="none" placeholder="바꿀 아이디" className={input} />
      )}
      <input
        name="pw"
        type="password"
        required
        minLength={4}
        placeholder={mode === "register" ? "수정용 비밀번호 (4자 이상)" : "등록할 때 정한 비밀번호"}
        className={input}
      />
      <button
        disabled={loading}
        className="rounded-lg bg-neutral-900 py-2.5 font-medium text-white disabled:opacity-50"
      >
        {loading ? "처리 중…" : mode === "register" ? "등록하기" : "수정하기"}
      </button>
      {status && (
        <p className={`text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}>{status.msg}</p>
      )}
    </form>
  );
}
