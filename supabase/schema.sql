-- ============================================================
--  무기제작소 (Mugi Maker) — Supabase Schema
--  Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN 하세요.
--  모든 DB 접근은 서버(API Route)에서 service_role 키로 수행하므로
--  RLS는 켜되 공개 정책은 두지 않습니다(= 클라이언트 직접 접근 차단).
-- ============================================================

-- 확장
create extension if not exists "pgcrypto";

-- 주문 상태 enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum (
      'free_done',        -- 무료진단 완료
      'payment_pending',  -- 결제 대기
      'paid',             -- 결제 완료
      'paid_form_done',   -- 유료폼 완료
      'report_sent'       -- 리포트 발송 완료
    );
  end if;
end$$;

-- ============================================================
-- 1) products : 진단 상품 카탈로그
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,            -- business | creator | identity
  description text,
  price integer not null default 0,  -- 원 단위, 0이면 Coming Soon
  is_active boolean not null default false,
  badge text,                        -- NEW | BEST | null
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2) leads : Coming Soon 이메일 알림 신청
-- ============================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_slug text,
  source text not null default 'coming_soon',
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads (email);

-- ============================================================
-- 3) test_responses : 무료 진단 응답 + 무료 결과
-- ============================================================
create table if not exists test_responses (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  answers jsonb not null default '{}'::jsonb,
  free_result jsonb,                 -- 무료 공개 요약(사업유형/레버리지/막힌단계/올해과제 등)
  name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);
create index if not exists test_responses_slug_idx on test_responses (product_slug);

-- ============================================================
-- 4) orders : 주문(결제) — 상태 머신의 중심
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  test_response_id uuid references test_responses(id) on delete set null,
  name text,
  email text,
  phone text,
  amount integer not null default 0,
  status order_status not null default 'free_done',
  payment_provider text,             -- mock | external | portone
  payment_ref text,                  -- PG 거래 ID 등
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_idx on orders (created_at desc);

-- updated_at 자동 갱신
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ============================================================
-- 5) paid_forms : 결제 후 추가 질문 응답
-- ============================================================
create table if not exists paid_forms (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_slug text not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6) report_jobs : Make Webhook 발송 작업 로그
-- ============================================================
create table if not exists report_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_slug text not null,
  status text not null default 'queued',  -- queued | sent | failed
  webhook_status integer,                  -- HTTP status code
  webhook_response text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS 활성화 (공개 정책 없음 = service_role 로만 접근)
-- ============================================================
alter table products       enable row level security;
alter table leads          enable row level security;
alter table test_responses enable row level security;
alter table orders         enable row level security;
alter table paid_forms     enable row level security;
alter table report_jobs    enable row level security;

-- products 만 읽기 공개가 필요하면 아래 주석 해제(앱은 정적 카탈로그 사용하므로 기본 비공개)
-- create policy "products are public readable" on products for select using (true);

-- ============================================================
-- 시드: 진단 상품 12개
-- ============================================================
insert into products (slug, title, category, description, price, is_active, badge) values
  ('business-item',      '사업 아이템 발굴 진단',     'business', '나에게 맞는 돈 되는 아이템 방향을 찾습니다.',        12900, true,  'NEW'),
  ('business-marketing', '사업 전략 및 마케팅 진단',  'business', '안 팔리는 진짜 이유와 팔리는 구조를 진단합니다.',   29000, true,  'BEST'),
  ('ad-conversion',      '광고 전환 진단',           'business', '광고비가 새는 구간을 찾아 전환을 끌어올립니다.',     0,     false, null),
  ('content-strategy',   '콘텐츠 전략 진단',         'business', '우리 브랜드에 맞는 콘텐츠 방향을 잡습니다.',         0,     false, null),
  ('instagram',          '인스타그램 운영 진단',      'creator',  '계정 운영의 강·약점을 점검합니다.',                0,     false, null),
  ('youtube',            '유튜브 운영 진단',          'creator',  '채널 성장의 병목을 찾습니다.',                     0,     false, null),
  ('shortform-writing',  '숏폼 글쓰기 진단',          'creator',  '스레드·X 텍스트 콘텐츠 적성을 봅니다.',             0,     false, null),
  ('creator-fit',        '크리에이터 적성 진단',      'creator',  '나에게 맞는 플랫폼을 추천합니다.',                  0,     false, null),
  ('self-discovery',     '자기 발견 진단',           'identity', '강점·재능을 발견합니다.',                          0,     false, null),
  ('purpose',            '목적 발견 진단',           'identity', '내가 진짜 원하는 방향을 찾습니다.',                 0,     false, null),
  ('priority',           '우선순위 정리 진단',        'identity', '무엇에 먼저 집중할지 정리합니다.',                 0,     false, null),
  ('work-style',         '일하는 방식 진단',          'identity', '나에게 맞는 업무·협업 스타일을 찾습니다.',          0,     false, null)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  price = excluded.price,
  is_active = excluded.is_active,
  badge = excluded.badge;
