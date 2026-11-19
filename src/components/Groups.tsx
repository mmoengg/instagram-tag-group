import { connection } from "next/server";
import { profileUrl } from "@/lib/handle";
import { getGroups } from "@/lib/groups";

// 전체 조 목록 (접힘). 복사 버튼은 '내가 소환할 조'에만 있음 → 공평한 릴레이 유지
export default async function Groups() {
  await connection(); // 매 요청마다 최신 조 목록을 DB에서 읽음

  let groups: string[][];
  try {
    groups = await getGroups();
  } catch {
    return <p className="text-sm text-red-600">조 목록을 불러오지 못했어요.</p>;
  }
  if (!groups.length) return <p className="text-sm text-neutral-500">아직 등록한 사람이 없어요. 1호가 되어주세요!</p>;

  const total = groups.reduce((n, g) => n + g.length, 0);

  return (
    <details className="group rounded-xl border border-neutral-200">
      <summary className="cursor-pointer list-none p-4 font-semibold">
        전체 조 보기{" "}
        <span className="text-sm font-normal text-neutral-500">
          총 {total}명 · {groups.length}개 조
        </span>
        <span className="float-right text-neutral-400 transition group-open:rotate-180">▾</span>
      </summary>
      <ol className="flex flex-col gap-2 px-4 pb-4">
        {groups.map((handles, i) => (
          <li key={i} className="text-sm">
            <span className="mr-2 font-semibold">{i + 1}조</span>
            {handles.map((h) => (
              <a
                key={h}
                href={profileUrl(h)}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2 text-blue-600 hover:underline"
              >
                @{h}
              </a>
            ))}
          </li>
        ))}
      </ol>
    </details>
  );
}
