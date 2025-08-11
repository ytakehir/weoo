-- =========================================
-- 共通: 便利関数（課金中判定）
-- =========================================
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.profile_id = uid
      and s.status in ('active','trialing')
  );
$$;

-- =========================================
-- テーブル: profiles（auth.users と 1:1）
-- =========================================
create table if not exists public.profiles (
  id                uuid primary key,                    -- = auth.users.id
  display_name      text,
  avatar_url        text,
  stripe_customer_id text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- タイムスタンプ自動更新
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- サインアップ時に profiles を自動作成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- =========================================
-- テーブル: subscriptions（profiles と 1:N、Stripe同期）
-- =========================================
create table if not exists public.subscriptions (
  id                  text primary key,                 -- Stripe subscription ID
  profile_id          uuid references public.profiles(id) on delete cascade,
  customer_id         text not null,                    -- Stripe customer ID
  price_id            text not null,
  status              text not null,                    -- 'active' | 'trialing' | ...
  current_period_end  timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists idx_subscriptions_profile_id on public.subscriptions(profile_id);
create index if not exists idx_subscriptions_customer_id on public.subscriptions(customer_id);


-- =========================================
-- テーブル: missions（課金者が作成/更新可能・削除不可）
-- =========================================
create table if not exists public.missions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_missions_updated_at on public.missions;
create trigger set_missions_updated_at
before update on public.missions
for each row execute function public.set_updated_at();

create index if not exists idx_missions_used_at on public.missions(used_at nulls last);
create index if not exists idx_missions_created_at on public.missions(created_at desc);


-- =========================================
-- テーブル: posts（profiles 1:N、missions 1:N）
-- 画像ファイルは storage の "posts" バケットに保存し、image_path にキーを持たせる
-- =========================================
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  mission_id  uuid not null references public.missions(id) on delete cascade,
  image_path  text not null,           -- 例: "<profile_id>/YYYYMMDD/<uuid>.jpg"
  taken_at    timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create index if not exists idx_posts_profile_id_created_at on public.posts(profile_id, created_at desc);
create index if not exists idx_posts_mission_id_created_at on public.posts(mission_id, created_at desc);


-- =========================================
-- RLS 有効化
-- =========================================
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.missions enable row level security;
alter table public.posts enable row level security;

-- 既存ポリシー掃除（存在すれば削除）
do $$
begin
  perform 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_self_rw';
  if found then execute 'drop policy "profiles_self_rw" on public.profiles'; end if;

  perform 1 from pg_policies where schemaname='public' and tablename='subscriptions' and policyname='subscriptions_self_select';
  if found then execute 'drop policy "subscriptions_self_select" on public.subscriptions'; end if;
  perform 1 from pg_policies where schemaname='public' and tablename='subscriptions' and policyname='subscriptions_service_write';
  if found then execute 'drop policy "subscriptions_service_write" on public.subscriptions'; end if;

  perform 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_read_authenticated';
  if found then execute 'drop policy "missions_read_authenticated" on public.missions'; end if;
  perform 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_write_active_subscriber';
  if found then execute 'drop policy "missions_write_active_subscriber" on public.missions'; end if;

  perform 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_select_active_subscriber';
  if found then execute 'drop policy "posts_select_active_subscriber" on public.posts'; end if;
  perform 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_insert_owner_only';
  if found then execute 'drop policy "posts_insert_owner_only" on public.posts'; end if;
  perform 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_update_owner_only';
  if found then execute 'drop policy "posts_update_owner_only" on public.posts'; end if;
  perform 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_delete_disabled';
  if found then execute 'drop policy "posts_delete_disabled" on public.posts'; end if;
end $$;

-- profiles: 自分の行のみ 読み書き
create policy "profiles_self_rw"
on public.profiles
for all
to authenticated
using ( id = auth.uid() )
with check ( id = auth.uid() );

-- subscriptions:
--   読み取り = 本人のみ
--   書き込み = service_role（Webhook）※RLSは by default deny。UIからは不可
create policy "subscriptions_self_select"
on public.subscriptions
for select
to authenticated
using ( profile_id = auth.uid() );

-- missions:
--   読み取り = authenticated 全員（※必要なら課金者限定に変更可）
create policy "missions_read_authenticated"
on public.missions
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

--   作成/更新 = 課金者のみ
create policy "missions_write_active_subscriber"
on public.missions
for insert
to authenticated
with check ( public.has_active_subscription(auth.uid()) );

create policy "missions_update_active_subscriber"
on public.missions
for update
to authenticated
using ( public.has_active_subscription(auth.uid()) )
with check ( public.has_active_subscription(auth.uid()) );

--   削除 = ユーザーは不可（service_role のみ実運用で）
--   ※明示ポリシーは付けず、RLSで拒否（= UIからはできない）

-- posts:
--   読み取り = 課金者なら全件閲覧可（要件: 画像は課金ユーザなら閲覧可能）
create policy "posts_select_active_subscriber"
on public.posts
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

--   作成 = 自分のprofile_idの行のみ
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check ( profile_id = auth.uid() );

--   更新 = 自分の投稿のみ（必要なら不可にしてもOK）
create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using ( profile_id = auth.uid() )
with check ( profile_id = auth.uid() );

--   削除 = ユーザー不可（service_roleのみ）
--   ※こちらも明示ポリシーは付けない（= UIからは削除不可）


-- =========================================
-- Storage: バケット & RLS（posts）
--   - バケットは private
--   - select: 課金者のみ OK（アプリは signed URL を発行する運用でもOK）
--   - insert: 自分の prefix（<auth.uid()>/...）にのみ許可
--   - update/delete: ユーザー不可（service_role のみ）
-- =========================================
insert into storage.buckets (id, name, public)
values ('posts', 'posts', false)
on conflict (id) do nothing;

-- 既存ポリシー掃除
do $$
begin
  if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='posts_select_active_subscriber') then
    execute 'drop policy "posts_select_active_subscriber" on storage.objects';
  end if;
  if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='posts_insert_own_prefix') then
    execute 'drop policy "posts_insert_own_prefix" on storage.objects';
  end if;
  if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='posts_update_disabled') then
    execute 'drop policy "posts_update_disabled" on storage.objects';
  end if;
  if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='posts_delete_disabled') then
    execute 'drop policy "posts_delete_disabled" on storage.objects';
  end if;
end $$;

-- 読み取り: 課金者のみ
create policy "posts_select_active_subscriber"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
);

-- 作成: 自分のフォルダ配下のみ（例: "<auth.uid()>/YYYYMMDD/xxx.jpg"）
create policy "posts_insert_own_prefix"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'posts'
  and (position(auth.uid()::text || '/' in name) = 1)
);

-- 更新: ユーザー不可（＝ポリシーを作らない）
-- 削除: ユーザー不可（＝ポリシーを作らない）
--   ※ service_role でのみ可能


-- ※ missions の select を課金者限定にしたい場合は、以下に置き換え:

