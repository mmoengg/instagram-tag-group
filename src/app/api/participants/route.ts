import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/supabase";
import { normalizeHandle } from "@/lib/handle";

const err = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

function checkPw(pw: unknown): pw is string {
  return typeof pw === "string" && pw.length >= 4 && pw.length <= 64;
}

// 등록: { handle, pw }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const handle = normalizeHandle(String(body?.handle ?? ""));
  if (!handle) return err("인스타 아이디 형식이 이상해요. 예: darani.zip");
  if (!checkPw(body?.pw)) return err("비밀번호는 4~64자로 정해주세요");

  const pw_hash = await bcrypt.hash(body.pw, 10);
  const { error } = await db().from("participants").insert({ handle, pw_hash });
  if (error?.code === "23505") return err("이미 등록된 아이디예요. 잘못 입력했다면 '정보 수정'을 이용해주세요", 409);
  if (error) return err("저장 중 문제가 생겼어요. 잠시 후 다시 시도해주세요", 500);

  return NextResponse.json({ handle }, { status: 201 });
}

// 수정: { handle(현재), pw, newHandle }
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const handle = normalizeHandle(String(body?.handle ?? ""));
  const newHandle = normalizeHandle(String(body?.newHandle ?? ""));
  if (!handle) return err("현재 아이디 형식이 이상해요");
  if (!newHandle) return err("새 아이디 형식이 이상해요. 예: darani.zip");
  if (typeof body?.pw !== "string") return err("비밀번호를 입력해주세요");

  const client = db();
  const { data: row } = await client
    .from("participants")
    .select("id, pw_hash")
    .eq("handle", handle)
    .maybeSingle();

  // 아이디가 없는 경우와 비번이 틀린 경우를 같은 메시지로 → 누가 등록했는지 떠보기 방지
  const ok = row && (await bcrypt.compare(body.pw, row.pw_hash));
  if (!ok) return err("아이디 또는 비밀번호가 맞지 않아요", 401);

  const { error } = await client
    .from("participants")
    .update({ handle: newHandle, updated_at: new Date().toISOString() })
    .eq("id", row.id);
  if (error?.code === "23505") return err("새 아이디는 이미 다른 사람이 등록했어요", 409);
  if (error) return err("수정 중 문제가 생겼어요", 500);

  return NextResponse.json({ handle: newHandle });
}
