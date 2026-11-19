"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("정말 전체 조를 다시 섞을까요? 기존 조는 사라져요.")) return;
    const password = new FormData(e.currentTarget).get("password");
    setLoading(true);
    const res = await fetch("/api/admin/shuffle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    setMsg(res.ok ? { ok: true, text: "새로 섞었어요!" } : { ok: false, text: json.error ?? "실패" });
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <h1 className="text-2xl font-bold">운영자</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          name="password"
          type="password"
          required
          placeholder="운영자 비밀번호"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none focus:border-neutral-900"
        />
        <button disabled={loading} className="rounded-lg bg-red-600 py-2.5 font-medium text-white disabled:opacity-50">
          {loading ? "섞는 중…" : "조 다시 섞기"}
        </button>
        {msg && <p className={`text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>}
      </form>
      <Link href="/" className="text-sm text-neutral-500 underline">← 조 목록 보기</Link>
    </main>
  );
}
