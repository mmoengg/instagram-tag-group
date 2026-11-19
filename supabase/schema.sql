-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run (여러 번 돌려도 안전)

create sequence if not exists participants_position_seq;

create table if not exists participants (
  id          uuid primary key default gen_random_uuid(),
  handle      text not null unique,          -- 소문자, @ 없이 저장
  pw_hash     text not null,                 -- bcrypt 해시 (평문 저장 X)
  position    bigint not null default nextval('participants_position_seq'), -- 조 순서
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 1단계 스키마를 이미 돌렸다면 컬럼만 추가
alter table participants
  add column if not exists position bigint not null default nextval('participants_position_seq');

-- RLS 켜고 정책은 안 만듦 → 브라우저(anon 키)로는 아무것도 못 읽고 못 씀.
-- 모든 접근은 Next.js 서버(API 라우트)에서 secret(service_role) 키로만.
alter table participants enable row level security;

-- 조 다시 섞기: 전원 순서를 랜덤으로 1..N 재배치.
-- 시퀀스는 계속 커지므로 이후 가입자는 자동으로 맨 뒤에 붙음.
create or replace function shuffle_participants() returns void
language sql security definer as $$
  update participants p
     set position = s.rn
    from (select id, row_number() over (order by random()) as rn from participants) s
   where p.id = s.id;
$$;
revoke execute on function shuffle_participants() from public, anon, authenticated;
