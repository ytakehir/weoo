-- =========================================
-- storage.objects（posts バケット）RLS 再定義
--  読み取り: 認証ユーザーなら可（課金不要）
--  書き込み: 認証ユーザー & 自分の uid/ プレフィックス配下のみ
-- =========================================

-- 既存ポリシー掃除（存在すれば DROP）
drop policy if exists "posts_insert_own_prefix"        on storage.objects;
drop policy if exists "posts_obj_delete_owner"         on storage.objects;
drop policy if exists "posts_obj_insert_owner"         on storage.objects;
drop policy if exists "posts_obj_select_subscribers"   on storage.objects;
drop policy if exists "posts_obj_update_owner"         on storage.objects;
drop policy if exists "posts_select_active_subscriber" on storage.objects;
drop policy if exists "posts_obj_select_authenticated" on storage.objects;

-- 1) SELECT: 認証ユーザーならOK（posts バケット限定）
create policy "posts_obj_select_authenticated"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'posts'
);

-- 2) INSERT: 自分の uid/ プリフィックス配下のみ
create policy "posts_obj_insert_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
);

-- 3) UPDATE: 自分の uid/ プリフィックス配下のみ
create policy "posts_obj_update_owner"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
)
with check (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
);

-- 4) DELETE: 自分の uid/ プリフィックス配下のみ
create policy "posts_obj_delete_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
);
