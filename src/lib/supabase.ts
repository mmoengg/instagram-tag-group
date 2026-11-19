import "server-only";
import { createClient } from "@supabase/supabase-js";

export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없어요");
  return createClient(url, key, { auth: { persistSession: false } });
}
