// "@Darani.zip", "darani.zip", "https://www.instagram.com/darani.zip/?igsh=..." → "darani.zip"
// 인스타 아이디 규칙: 영문 소문자·숫자·마침표·밑줄, 1~30자
const HANDLE_RE = /^(?!\.)(?!.*\.$)[a-z0-9._]{1,30}$/;

export function normalizeHandle(input: string): string | null {
  let s = input.trim();
  const m = s.match(/instagram\.com\/([^/?#\s]+)/i);
  if (m) s = m[1];
  s = s.replace(/^@+/, "").toLowerCase();
  return HANDLE_RE.test(s) ? s : null;
}

export const profileUrl = (handle: string) => `https://www.instagram.com/${handle}/`;
