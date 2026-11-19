import { NextResponse } from "next/server";
import { normalizeHandle } from "@/lib/handle";
import { getAllHandles, pickFor, PERIOD_DAYS } from "@/lib/picks";

// GET /api/picks?handle=darani.zip → 나를 뺀 오늘의 5명
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("handle") ?? "";
  const handle = normalizeHandle(raw);
  if (!handle) return NextResponse.json({ error: "아이디 형식이 이상해요" }, { status: 400 });

  try {
    const all = await getAllHandles();
    if (!all.includes(handle)) {
      return NextResponse.json({ error: `@${handle}은(는) 등록되지 않은 아이디예요` }, { status: 404 });
    }
    return NextResponse.json({
      handle,
      picks: pickFor(handle, all),
      total: all.length,
      periodDays: PERIOD_DAYS,
    });
  } catch {
    return NextResponse.json({ error: "목록을 불러오지 못했어요" }, { status: 500 });
  }
}
