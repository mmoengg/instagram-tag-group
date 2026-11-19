"use client";
import { useCallback, useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import { profileUrl } from "@/lib/handle";

type Result = { handle: string; picks: string[]; total: number; periodDays: number };

const KEY = "my-handle";
const store = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(KEY, v); } catch {} },
  clear: () => { try { localStorage.removeItem(KEY); } catch {} },
};

export const MY_HANDLE_EVENT = "my-handle-change";

export default function MyPicks() {
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (handle: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/picks?handle=${encodeURIComponent(handle)}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setData(null);
        setError(json.error);
        return;
      }
      setData(json);
      store.set(json.handle);
    } catch {
      setError("네트워크 오류예요");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = store.get();
    // 첫 렌더 이후로 미뤄서 effect 안 동기 setState 방지
    if (saved) queueMicrotask(() => lookup(saved));
    // 등록 직후 HandleForm이 보내는 이벤트
    const onChange = (e: Event) => lookup((e as CustomEvent<string>).detail);
    window.addEventListener(MY_HANDLE_EVENT, onChange);
    return () => window.removeEventListener(MY_HANDLE_EVENT, onChange);
  }, [lookup]);

  if (data) {
    const period = data.periodDays === 1 ? "오늘" : `이번 ${data.periodDays}일`;
    return (
      <section className="flex flex-col gap-3 rounded-xl bg-neutral-100 p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">@{data.handle} 님의 {period}의 5명</p>
          <button
            onClick={() => { store.clear(); setData(null); }}
            className="text-xs text-neutral-500 underline"
          >
            다른 아이디
          </button>
        </div>

        {data.picks.length === 0 ? (
          <p className="text-sm text-neutral-600">아직 혼자예요. 친구들을 불러주세요!</p>
        ) : (
          <div className="rounded-lg bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-500">댓글에 붙여넣어 소환하세요</span>
              <CopyButton text={data.picks.map((h) => `@${h}`).join(" ")} />
            </div>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {data.picks.map((h) => (
                <li key={h}>
                  <a href={profileUrl(h)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    @{h}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-neutral-500">
          총 {data.total}명 참여 중 · 5명은 {data.periodDays === 1 ? "매일 자정" : `${data.periodDays}일마다`} 바뀌어요
          {data.picks.length > 0 && data.picks.length < 5 && " · 참여자가 늘면 5명까지 채워져요"}
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get("me") ?? "");
        if (v.trim()) lookup(v);
      }}
      className="flex flex-col gap-2 rounded-xl bg-neutral-100 p-4"
    >
      <p className="font-semibold">이미 등록했다면 오늘의 5명 보기</p>
      <div className="flex gap-2">
        <input
          name="me"
          required
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="내 인스타 아이디"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-neutral-900"
        />
        <button disabled={loading} className="shrink-0 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white disabled:opacity-50">
          {loading ? "…" : "확인"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
