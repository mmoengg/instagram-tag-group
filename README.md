# 인스타 품앗이 소환

인스타 아이디를 등록하면, 나를 뺀 참여자 5명이 매일(한국 시간 자정 기준) 정해지고 `@아이디` 5개를 한 번에 복사해 댓글 소환에 쓰는 사이트.

- `/` 등록 + 오늘의 5명 (전체 복사)
- `/edit` 아이디 수정 (등록 때 정한 비밀번호 필요)

## 동작 규칙
- 5명은 (날짜 + 내 아이디 + 상대 아이디) 해시 순으로 정해짐 → 같은 날엔 새로고침해도 동일, 모두가 비슷한 확률로 뽑힘
- 고정 기간은 `src/lib/picks.ts`의 `PERIOD_DAYS`로 조절 (7 = 일주일)
- 비밀번호 분실 시: Supabase > Table Editor > participants 에서 해당 행 삭제 → 재등록 안내

## 세팅
1. Supabase 프로젝트 생성 → SQL Editor에 `supabase/schema.sql` 실행
2. `.env.example` → `.env.local` 복사 후 값 채우기
3. `npm install && npm run dev`

## 배포 (Vercel)
GitHub 레포 Import → Environment Variables에 `.env.example`의 값 입력 → Deploy
