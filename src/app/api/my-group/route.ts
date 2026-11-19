import { NextResponse } from "next/server";
import { normalizeHandle } from "@/lib/handle";
import { getGroups, findAssignment } from "@/lib/groups";

// GET /api/my-group?handle=darani.zip
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("handle") ?? "";
  const handle = normalizeHandle(raw);
  if (!handle) return NextResponse.json({ error: "아이디 형식이 이상해요" }, { status: 400 });

  try {
    const result = findAssignment(await getGroups(), handle);
    if (!result) return NextResponse.json({ error: `@${handle}은(는) 등록되지 않은 아이디예요` }, { status: 404 });
    return NextResponse.json({ handle, ...result });
  } catch {
    return NextResponse.json({ error: "조 정보를 불러오지 못했어요" }, { status: 500 });
  }
}
