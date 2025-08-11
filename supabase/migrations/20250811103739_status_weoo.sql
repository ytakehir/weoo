-- 0) 依存: RLS を有効化（未設定なら）
alter table public.posts enable row level security;

-- 1) ステータス enum を作成（既にあればスキップ）
do $$
begin
  if not exists (select 1 from pg_type where typname = 'post_status') then
    create type post_status as enum ('pending','approved','rejected');
  end if;
end$$;

-- 2) posts に status カラムを追加（デフォルト pending）
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='status'
  ) then
    alter table public.posts
      add column status post_status not null default 'pending';
  end if;
end$$;

-- 3) 非管理者が status を変更できないようにするトリガ
--    - insert: 強制的に 'pending' にする
--    - update: service_role 以外は status 変更禁止
create or replace function public.posts_enforce_status()
returns trigger
language plpgsql
security definer
as $$
declare
  is_admin boolean;
begin
  -- Supabase の JWT には role が入る（service_key = service_role）
  is_admin := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role';

  if tg_op = 'INSERT' then
    new.status := 'pending';
    return new;
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status and not is_admin then
      raise exception 'status can only be changed by admins';
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_posts_enforce_status on public.posts;
create trigger trg_posts_enforce_status
before insert or update on public.posts
for each row execute function public.posts_enforce_status();

-- 4) 既存ポリシーを整理（無ければスキップ）
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_select_approved_public') then
    drop policy "posts_select_approved_public" on public.posts;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_select_own') then
    drop policy "posts_select_own" on public.posts;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_insert_self_pending') then
    drop policy "posts_insert_self_pending" on public.posts;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_update_owner_content') then
    drop policy "posts_update_owner_content" on public.posts;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_update_admin') then
    drop policy "posts_update_admin" on public.posts;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_delete_admin') then
    drop policy "posts_delete_admin" on public.posts;
  end if;
end$$;

-- 5) 読み取り
-- 5-1) 誰でも approved は読める（公開一覧用）
create policy "posts_select_approved_public"
on public.posts
for select
to anon, authenticated
using (status = 'approved');

-- 5-2) 自分の投稿はステータスに関係なく読める（作成者の管理・下書き確認用）
create policy "posts_select_own"
on public.posts
for select
to authenticated
using (profile_id = auth.uid());

-- 6) 作成
-- 作成者のみ insert 可。status はトリガで 'pending' に固定されるが、
-- 念のため with check でも pending & 自分の id を強制
create policy "posts_insert_self_pending"
on public.posts
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and status = 'pending'
);

-- 7) 更新
-- オーナーによる本文/画像等の更新は可（status はトリガがブロック）
create policy "posts_update_owner_content"
on public.posts
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- 管理者（service_role）のみ全件更新可（承認/却下フローで status 更新する想定）
create policy "posts_update_admin"
on public.posts
for update
to service_role
using (true)
with check (true);

-- 8) 削除
-- 削除は管理者のみ
create policy "posts_delete_admin"
on public.posts
for delete
to service_role
using (true);
