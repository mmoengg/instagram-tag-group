import { NextResponse, connection } from "next/server";
import { db } from "@/lib/supabase";

// Vercel Cron이 매일 1번 호출 → Supabase 무료 플랜의 '7일 미사용 일시정지' 방지
// Vercel에 CRON_SECRET 환경변수를 넣어두면 Vercel이 자동으로 Authorization 헤더를 붙여 보내고,
// 외부에서 아무나 이 주소를 두드리는 건 막힘
export async function GET(req: Request) {
  await connection(); // 빌드 때 미리 만들지 말고 호출될 때마다 실행
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { count, error } = await db()
    .from("participants")
    .select("id", { count: "exact", head: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, participants: count, at: new Date().toISOString() });
}
