import "server-only";
import { db } from "@/lib/supabase";

export const GROUP_SIZE = 5;

// position 순서대로 5명씩 자른 조 목록 (마지막 조는 5명 미만일 수 있음)
export async function getGroups(): Promise<string[][]> {
  const { data, error } = await db()
    .from("participants")
    .select("handle")
    .order("position", { ascending: true });
  if (error) throw error;

  const groups: string[][] = [];
  for (let i = 0; i < data.length; i += GROUP_SIZE) {
    groups.push(data.slice(i, i + GROUP_SIZE).map((r) => r.handle));
  }
  return groups;
}

// 릴레이: N조는 N+1조를 소환, 마지막 조는 1조를 소환
export function findAssignment(groups: string[][], handle: string) {
  const idx = groups.findIndex((g) => g.includes(handle));
  if (idx === -1) return null;
  const targetIdx = groups.length > 1 ? (idx + 1) % groups.length : null;
  return {
    myNo: idx + 1,
    myGroup: groups[idx],
    targetNo: targetIdx === null ? null : targetIdx + 1,
    target: targetIdx === null ? [] : groups[targetIdx],
    totalGroups: groups.length,
  };
}
