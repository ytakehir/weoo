-- =========================================
-- posts_enforce_status の完全削除 + posts RLS 再定義
-- 変更点: SELECT を「authenticated は全件読める」に緩和
-- =========================================

-- 念のため RLS 有効化
alter table public.posts enable row level security;

-- 1) 使っていないトリガ/関数の削除（存在すれば）
drop trigger if exists trg_posts_enforce_status on public.posts;
drop function if exists public.posts_enforce_status();

-- 2) 既存の posts 向けポリシー掃除
drop policy if exists "posts_select_subscribers_only" on public.posts;
drop policy if exists "posts_select_authenticated"     on public.posts;
drop policy if exists "posts_insert_owner_only"        on public.posts;
drop policy if exists "posts_update_owner_only"        on public.posts;
drop policy if exists "posts_delete_owner_only"        on public.posts;
drop policy if exists "posts_admin_all"                on public.posts;

-- 3) 再定義
-- SELECT: 認証ユーザなら全件OK（課金判定なし）
create policy "posts_select_authenticated"
on public.posts
for select
to authenticated
using ( true );

-- INSERT: 所有者（= 自分）なら OK（課金不要）
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check ( profile_id = auth.uid() );

-- UPDATE: 所有者のみ（課金不要）
create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using ( profile_id = auth.uid() )
with check ( profile_id = auth.uid() );

-- DELETE: 所有者のみ（課金不要）
create policy "posts_delete_owner_only"
on public.posts
for delete
to authenticated
using ( profile_id = auth.uid() );

-- 管理用（Webhook/管理画面等で service_role がフル権限）
create policy "posts_admin_all"
on public.posts
for all
to service_role
using (true)
with check (true);
