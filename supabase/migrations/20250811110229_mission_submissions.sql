-- =======================================================
-- Mission submissions (審査用) → 承認で missions へ自動移送
-- =======================================================

-- UUID生成拡張（無ければ）
create extension if not exists "pgcrypto";

-- 1) 審査用テーブル
create table if not exists public.mission_submissions (
  id                 uuid primary key default gen_random_uuid(),
  title_raw          text not null,                             -- 改行ありの原文
  created_by         uuid references public.profiles(id) on delete set null,
  status             text not null default 'pending',           -- 'pending' | 'approved' | 'rejected'
  notes              text,                                      -- 審査メモなど
  migrated_mission_id uuid references public.missions(id),      -- 承認で作られた missions.id（1回だけ付与）
  approved_by        uuid references public.profiles(id),       -- 承認者（任意）
  approved_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- 2) updated_at 自動更新
create or replace function public.tg_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_updated_at on public.mission_submissions;
create trigger trg_touch_updated_at
before update on public.mission_submissions
for each row execute function public.tg_touch_updated_at();

-- 3) 承認トリガ: status を 'approved' に変更したら missions へ 1回だけ移送
create or replace function public.tg_mission_submission_on_approve()
returns trigger
language plpgsql
security definer
as $$
declare
  v_mission_id uuid;
begin
  -- 変更が 'approved' 以外、または既に移送済みなら何もしない
  if not (tg_op = 'UPDATE' and new.status = 'approved' and old.status is distinct from 'approved') then
    return new;
  end if;

  if new.migrated_mission_id is not null then
    return new;
  end if;

  -- missions へ作成（title は title_raw をそのまま格納）
  insert into public.missions (title, used_at, created_at)
  values (new.title_raw, null, now())
  returning id into v_mission_id;

  -- レコードに紐付け
  new.migrated_mission_id := v_mission_id;
  new.approved_at := coalesce(new.approved_at, now());
  return new;
end;
$$;

drop trigger if exists trg_mission_submission_on_approve on public.mission_submissions;
create trigger trg_mission_submission_on_approve
before update of status on public.mission_submissions
for each row execute function public.tg_mission_submission_on_approve();

-- 4) RLS 設定
alter table public.mission_submissions enable row level security;

-- 既存ポリシー掃除
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='mission_submissions' and policyname='ms_select_own')       then execute 'drop policy "ms_select_own" on public.mission_submissions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='mission_submissions' and policyname='ms_insert_own')       then execute 'drop policy "ms_insert_own" on public.mission_submissions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='mission_submissions' and policyname='ms_update_fix_pending') then execute 'drop policy "ms_update_fix_pending" on public.mission_submissions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='mission_submissions' and policyname='ms_admin_all')        then execute 'drop policy "ms_admin_all" on public.mission_submissions'; end if;
end$$;

-- 4-1) 自分の下書きは参照可（どのステータスでも）
create policy "ms_select_own"
on public.mission_submissions
for select
to authenticated
using (created_by = auth.uid());

-- 4-2) 作成はログインユーザのみ（created_by 自動一致）
create policy "ms_insert_own"
on public.mission_submissions
for insert
to authenticated
with check (created_by = auth.uid());

-- 4-3) 自分の pending の間だけ本文/メモなどを修正可（status は変更不可）
create policy "ms_update_fix_pending"
on public.mission_submissions
for update
to authenticated
using (created_by = auth.uid() and status = 'pending')
with check (created_by = auth.uid() and status = 'pending');

-- 4-4) 管理（service_role）は全件 select/insert/update/delete 可能（GUI/SQLから承認運用）
create policy "ms_admin_all"
on public.mission_submissions
for all
to service_role
using (true)
with check (true);

-- 5) missions 側は「読み取り自由・書き込みは service_role」のままにする想定
--    もし未設定なら復元
alter table public.missions enable row level security;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_select_public')
    then execute 'drop policy "missions_select_public" on public.missions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_writes_service_only')
    then execute 'drop policy "missions_writes_service_only" on public.missions'; end if;
end$$;

create policy "missions_select_public"
on public.missions
for select
to anon, authenticated
using (true);

create policy "missions_writes_service_only"
on public.missions
for all
to authenticated
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');


-- ============================================
-- 1) admin 用の表示文字列カラムを追加
-- ============================================
alter table public.mission_submissions
  add column if not exists title_display text;  -- 管理が GUI で改行入りの最終文面を入れる

-- 既存の updated_at トリガは前のスクリプトで作成済み想定

-- ============================================
-- 2) 改行正規化ヘルパー（\r\n / \r → \n に統一）
-- ============================================
create or replace function public.normalize_newlines(src text)
returns text
language sql
immutable
as $$
  select replace(replace(coalesce(src, ''), E'\r\n', E'\n'), E'\r', E'\n');
$$;

-- ============================================
-- 3) 承認トリガ差し替え：
--    status を 'approved' に変更 → missions へ 1 回だけ移送。
--    title は title_display があればそれを使い、無ければ title_raw を正規化して採用。
-- ============================================
drop trigger if exists trg_mission_submission_on_approve on public.mission_submissions;

create or replace function public.tg_mission_submission_on_approve()
returns trigger
language plpgsql
security definer
as $$
declare
  v_mission_id uuid;
  v_title text;
begin
  -- 'approved' への遷移時のみ、未移送なら処理
  if not (tg_op = 'UPDATE' and new.status = 'approved' and old.status is distinct from 'approved') then
    return new;
  end if;

  if new.migrated_mission_id is not null then
    return new;
  end if;

  -- 表示タイトルを決定（title_display 優先、無ければ raw）
  v_title := public.normalize_newlines(
    coalesce(nullif(new.title_display, ''), new.title_raw)
  );

  -- missions へ作成
  insert into public.missions (title, used_at, created_at)
  values (v_title, null, now())
  returning id into v_mission_id;

  -- 紐付けと監査情報
  new.migrated_mission_id := v_mission_id;
  new.approved_at := coalesce(new.approved_at, now());
  return new;
end;
$$;

create trigger trg_mission_submission_on_approve
before update of status on public.mission_submissions
for each row execute function public.tg_mission_submission_on_approve();
