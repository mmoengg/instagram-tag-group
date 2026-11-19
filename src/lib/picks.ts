import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/supabase";

export const PICK_COUNT = 5;
// 같은 5명이 유지되는 기간(일). 7로 바꾸면 일주일 고정
export const PERIOD_DAYS = 1;

export async function getAllHandles(): Promise<string[]> {
  const { data, error } = await db().from("participants").select("handle");
  if (error) throw error;
  return data.map((r) => r.handle);
}

// 한국 시간 기준 기간 번호 (자정에 바뀜)
function periodKey(now = Date.now()) {
  const kstDays = Math.floor((now + 9 * 3600_000) / 86_400_000);
  return Math.floor(kstDays / PERIOD_DAYS);
}

function score(period: number, me: string, other: string) {
  return createHash("sha256").update(`${period}|${me}|${other}`).digest().readUInt32BE(0);
}

// 나를 뺀 사람들을 (기간+나+상대) 해시 순으로 줄 세워 앞에서 5명.
// - 같은 기간엔 새로고침해도 같은 결과 (다시 뽑기로 고르기 불가)
// - 해시가 균등하니 모두가 비슷한 확률로 뽑힘
// - 새 참가자가 들어와도 기존 5명 중 일부만 바뀔 수 있음
export function pickFor(me: string, all: string[], now = Date.now()): string[] {
  const p = periodKey(now);
  return all
    .filter((h) => h !== me)
    .map((h) => ({ h, s: score(p, me, h) }))
    .sort((a, b) => a.s - b.s || a.h.localeCompare(b.h))
    .slice(0, PICK_COUNT)
    .map((x) => x.h);
}
