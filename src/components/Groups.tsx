import { connection } from "next/server";
import { db } from "@/lib/supabase";
import { profileUrl } from "@/lib/handle";
import CopyButton from "./CopyButton";

const GROUP_SIZE = 5;

export default async function Groups() {
  await connection(); // 매 요청마다 최신 조 목록을 DB에서 읽음
  const { data, error } = await db()
    .from("participants")
    .select("handle")
    .order("position", { ascending: true });

  if (error) return <p className="text-sm text-red-600">조 목록을 불러오지 못했어요.</p>;
  if (!data?.length) return <p className="text-sm text-neutral-500">아직 등록한 사람이 없어요. 1호가 되어주세요!</p>;

  const groups: string[][] = [];
  for (let i = 0; i < data.length; i += GROUP_SIZE) {
    groups.push(data.slice(i, i + GROUP_SIZE).map((r) => r.handle));
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">
        조 목록 <span className="text-sm font-normal text-neutral-500">총 {data.length}명 · {groups.length}개 조</span>
      </h2>
      {groups.map((handles, i) => (
        <article key={i} className="rounded-xl border border-neutral-200 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="font-semibold">{i + 1}조</span>
            <CopyButton text={handles.map((h) => `@${h}`).join(" ")} />
          </div>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {handles.map((h) => (
              <li key={h}>
                <a href={profileUrl(h)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  @{h}
                </a>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
