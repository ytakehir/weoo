-- =========================================
-- Extensions & helpers
-- =========================================
-- gen_random_uuid() を使うので pgcrypto を有効化（Supabaseは通常有効だが保険で）
create extension if not exists "pgcrypto";

-- updated_at 自動更新用トリガ関数
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- TABLES
-- =========================================

-- プロフィール（= アプリ側ユーザー情報）
-- auth.users(id) を参照する public テーブル
create table if not exists public.profiles (
  id uuid primary key,                                  -- = auth.users.id
  display_name text,
  avatar_url text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FK: profiles.id -> auth.users(id)
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'profiles_user_fk'
      and table_schema = 'public'
      and table_name = 'profiles'
  ) then
    alter table public.profiles
      add constraint profiles_user_fk
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

-- ミッション
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists missions_used_at_idx on public.missions (used_at);

-- 投稿
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  mission_id uuid not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_profile_fk foreign key (profile_id) references public.profiles(id) on delete cascade,
  constraint posts_mission_fk foreign key (mission_id) references public.missions(id) on delete cascade
);

create index if not exists posts_profile_id_idx on public.posts (profile_id);
create index if not exists posts_mission_id_idx on public.posts (mission_id);
create index if not exists posts_created_at_idx on public.posts (created_at);

-- Stripe サブスク
create table if not exists public.subscriptions (
  id text primary key,                                  -- Stripe subscription id
  profile_id uuid,
  customer_id text not null,
  price_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  constraint subs_profile_fk foreign key (profile_id) references public.profiles(id) on delete set null
);

create index if not exists subs_profile_id_idx on public.subscriptions (profile_id);

-- =========================================
-- TRIGGERS
-- =========================================

-- updated_at を自動更新
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_missions_updated_at on public.missions;
create trigger set_missions_updated_at
before update on public.missions
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- =========================================
-- RLS: enable
-- =========================================
alter table public.profiles      enable row level security;
alter table public.missions      enable row level security;
alter table public.posts         enable row level security;
alter table public.subscriptions enable row level security;

-- =========================================
-- RLS: policies
-- =========================================

-- PROFILES
-- 読み取り：全体公開（必要に応じて限定に変更可）
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
on public.profiles for select using (true);

-- 追加：本人のみ（auth.uid() = id）
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles for insert
with check (auth.uid() = id);

-- 更新：本人のみ
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles for update
using (auth.uid() = id);

-- MISSIONS
-- 読み取り：全体公開
drop policy if exists "missions_read_all" on public.missions;
create policy "missions_read_all"
on public.missions for select using (true);

-- 書き込みは基本禁止（管理は service_role で実施）
drop policy if exists "missions_block_writes" on public.missions;
create policy "missions_block_writes"
on public.missions for all
using (false) with check (false);

-- POSTS
-- 読み取り：全体公開（必要に応じて絞る）
drop policy if exists "posts_select_all" on public.posts;
create policy "posts_select_all"
on public.posts for select using (true);

-- 追加：本人のみ
drop policy if exists "posts_insert_owner" on public.posts;
create policy "posts_insert_owner"
on public.posts for insert
with check (auth.uid() = profile_id);

-- 更新/削除：本人のみ
drop policy if exists "posts_update_owner" on public.posts;
create policy "posts_update_owner"
on public.posts for update
using (auth.uid() = profile_id);

drop policy if exists "posts_delete_owner" on public.posts;
create policy "posts_delete_owner"
on public.posts for delete
using (auth.uid() = profile_id);

-- SUBSCRIPTIONS
-- 読み取り：自分の分のみ（クライアントからの閲覧用）
drop policy if exists "subs_read_self" on public.subscriptions;
create policy "subs_read_self"
on public.subscriptions for select
using (auth.uid() = profile_id);

-- 書き込みは基本禁止（Stripe Webhook などは service_role で）
drop policy if exists "subs_block_writes" on public.subscriptions;
create policy "subs_block_writes"
on public.subscriptions for all
using (false) with check (false);
