# 인스타 품앗이 조 편성

인스타 아이디를 등록하면 5명씩 조를 짜서 보여주고, 조별로 `@아이디` 전체를 한 번에 복사해 댓글 소환에 쓰는 사이트.

- `/` 등록 + 조 목록 (조별 전체 복사)
- `/edit` 아이디 수정 (등록 때 정한 비밀번호 필요)
- `/admin` 조 다시 섞기 (ADMIN_PASSWORD)

## 동작 규칙
- 새 가입자는 맨 뒤 조에 붙음. 5로 안 나눠떨어지면 마지막 조는 5명 미만.
- 운영자가 `/admin`에서 섞으면 전원 순서가 랜덤으로 재배치되고 그 상태로 고정.
- 비밀번호 분실 시: Supabase > Table Editor > participants 에서 해당 행 삭제 → 재등록 안내.

## 세팅
1. Supabase 프로젝트 생성 → SQL Editor에 `supabase/schema.sql` 실행
2. `.env.example` → `.env.local` 복사 후 값 채우기
3. `npm install && npm run dev`

## 배포 (Vercel)
GitHub 레포 Import → Environment Variables에 `.env.example`의 3개 값 입력 → Deploy
