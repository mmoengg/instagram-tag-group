"use client";
import { useCallback, useEffect, useState } from "react";
import CopyButton from "./CopyButton";

type Assignment = {
  handle: string;
  myNo: number;
  myGroup: string[];
  targetNo: number | null;
  target: string[];
  totalGroups: number;
};

const KEY = "my-handle";
const store = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(KEY, v); } catch {} },
  clear: () => { try { localStorage.removeItem(KEY); } catch {} },
};

export const MY_HANDLE_EVENT = "my-handle-change";

export default function MyGroup() {
  const [data, setData] = useState<Assignment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (handle: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/my-group?handle=${encodeURIComponent(handle)}`, { cache: "no-store" });
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
    return (
      <section className="flex flex-col gap-3 rounded-xl bg-neutral-100 p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">
            @{data.handle} 님은 <span className="text-blue-600">{data.myNo}조</span>
          </p>
          <button
            onClick={() => { store.clear(); setData(null); }}
            className="text-xs text-neutral-500 underline"
          >
            다른 아이디
          </button>
        </div>

        {data.targetNo === null ? (
          <p className="text-sm text-neutral-600">
            아직 조가 1개뿐이라 소환할 조가 없어요. 사람이 더 모이면 다시 확인해주세요!
          </p>
        ) : (
          <div className="rounded-lg bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-semibold">내가 소환할 조: {data.targetNo}조</span>
              <CopyButton text={data.target.map((h) => `@${h}`).join(" ")} />
            </div>
            <p className="break-all text-sm text-neutral-700">
              {data.target.map((h) => `@${h}`).join(" ")}
            </p>
          </div>
        )}
        <p className="text-xs text-neutral-500">
          {data.myNo}조는 {data.myNo === 1 ? data.totalGroups : data.myNo - 1}조 분들이 소환해줘요.
          새 참가자가 들어오면 마지막 조 구성은 바뀔 수 있어요.
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
      <p className="font-semibold">이미 등록했다면 내 조 확인</p>
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
