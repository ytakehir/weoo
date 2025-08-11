-- ============ missions に承認フローを導入 ============

-- RLS 有効化（未設定なら）
alter table public.missions enable row level security;

-- 1) 作成者識別のための created_by を追加（無ければ）
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='missions' and column_name='created_by'
  ) then
    alter table public.missions
      add column created_by uuid references public.profiles(id) on delete set null;
  end if;
end$$;

-- 2) ステータス enum
do $$
begin
  if not exists (select 1 from pg_type where typname='mission_status') then
    create type mission_status as enum ('pending','approved','rejected');
  end if;
end$$;

-- 3) status カラム（デフォルト pending）
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='missions' and column_name='status'
  ) then
    alter table public.missions
      add column status mission_status not null default 'pending';
  end if;
end$$;

-- 4) ステータス保護トリガ
create or replace function public.missions_enforce_status()
returns trigger
language plpgsql
security definer
as $$
declare
  is_admin boolean;
begin
  is_admin := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role';

  if tg_op = 'INSERT' then
    -- 作成者を自動付帯
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
    -- ステータスは pending に固定
    new.status := 'pending';
    return new;
  elsif tg_op = 'UPDATE' then
    -- 一般ユーザは status を変えられない
    if new.status is distinct from old.status and not is_admin then
      raise exception 'status can only be changed by admins';
    end if;

    -- used_at は admin のみ（任意）
    if new.used_at is distinct from old.used_at and not is_admin then
      raise exception 'used_at can only be changed by admins';
    end if;

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_missions_enforce_status on public.missions;
create trigger trg_missions_enforce_status
before insert or update on public.missions
for each row execute function public.missions_enforce_status();

-- 5) 既存ポリシー整理（命名衝突回避）
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_read_all') then
    drop policy "missions_read_all" on public.missions;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_read_authenticated') then
    drop policy "missions_read_authenticated" on public.missions;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_update_active_subscriber') then
    drop policy "missions_update_active_subscriber" on public.missions;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_write_active_subscriber') then
    drop policy "missions_write_active_subscriber" on public.missions;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='missions' and policyname='missions_block_writes') then
    drop policy "missions_block_writes" on public.missions;
  end if;
end$$;

-- 6) 読み取り
-- 6-1) 公開: approved は誰でも読める
create policy "missions_select_approved_public"
on public.missions
for select
to anon, authenticated
using (status = 'approved');

-- 6-2) 自分の作成分は status に関わらず読める
create policy "missions_select_own"
on public.missions
for select
to authenticated
using (created_by = auth.uid());

-- 7) 作成: 課金者のみ、created_by=auth.uid() & status=pending
create policy "missions_insert_active_subscriber"
on public.missions
for insert
to authenticated
with check (
  public.has_active_subscription(auth.uid())
  and created_by = auth.uid()
  and status = 'pending'
);

-- 8) 更新
-- 8-1) 作成者は pending の間だけ title 等の更新可（status/used_at はトリガで拒否）
create policy "missions_update_owner_pending_only"
on public.missions
for update
to authenticated
using (created_by = auth.uid() and status = 'pending')
with check (created_by = auth.uid() and status = 'pending');

-- 8-2) 管理（service_role）は全件更新可（承認/却下、used_at 設定など）
create policy "missions_update_admin"
on public.missions
for update
to service_role
using (true)
with check (true);

-- 9) 削除: 管理のみ
create policy "missions_delete_admin"
on public.missions
for delete
to service_role
using (true);
