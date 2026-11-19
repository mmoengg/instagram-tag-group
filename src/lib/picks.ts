import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/supabase";

export const PICK_COUNT = 5;
// 같은 5명이 유지되는 기간(일). 7로 바꾸면 일주일 고정
export const PERIOD_DAYS = 1;

// 전체 아이디 목록을 서버 메모리에 1분간 보관 → DB 조회(Supabase Egress)를 방문자 수와 무관하게 유지
const CACHE_TTL_MS = 60_000;
let cache: { at: number; handles: string[] } | null = null;

export async function getAllHandles(): Promise<string[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.handles;
  const { data, error } = await db().from("participants").select("handle");
  if (error) throw error;
  cache = { at: Date.now(), handles: data.map((r) => r.handle) };
  return cache.handles;
}

// 등록·수정 직후 호출 → 이 서버에서는 바로 반영
export function clearHandlesCache() {
  cache = null;
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
