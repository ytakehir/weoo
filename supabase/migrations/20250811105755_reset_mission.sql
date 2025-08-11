-- ================================
-- missions: 承認フローをロールバック
-- ================================

-- 1) まず既存ポリシーを掃除
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_select_approved_public')
    then execute 'drop policy "missions_select_approved_public" on public.missions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_select_own')
    then execute 'drop policy "missions_select_own" on public.missions'; end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_insert_active_subscriber')
    then execute 'drop policy "missions_insert_active_subscriber" on public.missions'; end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_update_owner_pending_only')
    then execute 'drop policy "missions_update_owner_pending_only" on public.missions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_update_admin')
    then execute 'drop policy "missions_update_admin" on public.missions'; end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_delete_admin')
    then execute 'drop policy "missions_delete_admin" on public.missions'; end if;
end$$;

-- 2) トリガー/関数を削除
drop trigger if exists trg_missions_enforce_status on public.missions;
drop function if exists public.missions_enforce_status();

-- 3) カラムを削除（存在すれば）
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='missions' and column_name='status'
  ) then
    alter table public.missions drop column status;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='missions' and column_name='created_by'
  ) then
    alter table public.missions drop column created_by;
  end if;
end$$;

-- 4) enum型を削除（存在すれば）
do $$
begin
  if exists (select 1 from pg_type where typname='mission_status') then
    drop type mission_status;
  end if;
end$$;

-- 5) RLS は維持しつつ、元のシンプルな方針に戻す
--    読み取り：全員OK / 書き込み：実運用では service_role 経由（RLSをバイパス）
alter table public.missions enable row level security;

-- 重複回避のため既存の同名ポリシーがあれば削除
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_select_public')
    then execute 'drop policy "missions_select_public" on public.missions'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_writes_service_only')
    then execute 'drop policy "missions_writes_service_only" on public.missions'; end if;
end$$;

-- 読み取りは誰でも
create policy "missions_select_public"
on public.missions
for select
to anon, authenticated
using (true);

-- 書き込みは実運用で service_role 経由に限定（保険で条件も付ける）
create policy "missions_writes_service_only"
on public.missions
for all
to authenticated
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
