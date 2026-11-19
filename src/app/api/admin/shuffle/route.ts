import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/supabase";

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const admin = process.env.ADMIN_PASSWORD;
  if (!admin) return NextResponse.json({ error: "ADMIN_PASSWORD 환경변수가 없어요" }, { status: 500 });
  if (typeof password !== "string" || !same(password, admin)) {
    return NextResponse.json({ error: "운영자 비밀번호가 틀렸어요" }, { status: 401 });
  }

  const { error } = await db().rpc("shuffle_participants");
  if (error) return NextResponse.json({ error: "섞기 실패: " + error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
