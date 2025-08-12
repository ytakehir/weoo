-- =========================================================
-- Unified hardening migration (Supabase / Postgres)
-- 方針:
--  - 課金者のみ SELECT（原則）
--  - 書き込みは本人のみ（service_role は管理用フル権限）
--  - Storage(postsバケット)も同方針
-- =========================================================

-- ---------- 0) 課金判定関数（無ければ作成 / あれば更新） ----------
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.subscriptions s
    where s.profile_id = uid
      and s.status in ('active','trialing')
  );
$$;

-- ---------- 1) RLS 有効化 ----------
alter table public.missions           enable row level security;
alter table public.mission_submissions enable row level security;
alter table public.posts              enable row level security;
alter table public.profiles           enable row level security;
alter table public.subscriptions      enable row level security;

-- =========================================================
-- missions
--  読み取り: 課金者のみ
--  ※ 公開で見せたい場合は "missions_select_subscribers_only" を anon に緩めてください
-- =========================================================

-- 既存ポリシー掃除（存在時のみDROP）
drop policy if exists "missions_select_public"       on public.missions;
drop policy if exists "missions_writes_service_only" on public.missions;

-- 新規: SELECT = 課金者のみ
create policy "missions_select_subscribers_only"
on public.missions
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

-- 管理（サービス）で全操作したい場合は必要に応じて↓
drop policy if exists "missions_admin_all" on public.missions;
create policy "missions_admin_all"
on public.missions
for all
to service_role
using (true)
with check (true);

-- =========================================================
-- mission_submissions（ユーザ投稿の下書き/審査用）
--  自分の行だけ読める/編集できる、承認等は service_role
-- =========================================================

drop policy if exists "ms_insert_own"        on public.mission_submissions;
drop policy if exists "ms_select_own"        on public.mission_submissions;
drop policy if exists "ms_update_fix_pending" on public.mission_submissions;
drop policy if exists "ms_admin_all"         on public.mission_submissions;

-- INSERT: 自分の行のみ
create policy "ms_insert_own"
on public.mission_submissions
for insert
to authenticated
with check (created_by = auth.uid());

-- SELECT: 自分の行のみ
create policy "ms_select_own"
on public.mission_submissions
for select
to authenticated
using (created_by = auth.uid());

-- UPDATE: 自分の行のみ（status等はトリガで制御している想定。不要なら with check を調整）
create policy "ms_update_own"
on public.mission_submissions
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

-- 管理: 全操作OK
create policy "ms_admin_all"
on public.mission_submissions
for all
to service_role
using (true)
with check (true);

-- =========================================================
-- posts
--  読み取り: 課金者のみ（他人の投稿も課金者なら閲覧可）
--  作成/更新/削除: 本人のみ
--  service_role: 管理フル権限
-- =========================================================

-- 既存ポリシー掃除
drop policy if exists "posts_select_all"              on public.posts;
drop policy if exists "posts_select_approved_public"  on public.posts;
drop policy if exists "posts_select_own"              on public.posts;
drop policy if exists "posts_select_active_subscriber" on public.posts;

drop policy if exists "posts_insert_owner"            on public.posts;
drop policy if exists "posts_insert_owner_only"       on public.posts;
drop policy if exists "posts_insert_self_pending"     on public.posts;

drop policy if exists "posts_update_owner"            on public.posts;
drop policy if exists "posts_update_owner_only"       on public.posts;
drop policy if exists "posts_update_owner_content"    on public.posts;

drop policy if exists "posts_delete_owner"            on public.posts;
drop policy if exists "posts_delete_admin"            on public.posts;
drop policy if exists "posts_update_admin"            on public.posts;

-- SELECT: 課金者のみ
create policy "posts_select_subscribers_only"
on public.posts
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

-- INSERT: 本人のみ
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check (profile_id = auth.uid());

-- UPDATE: 本人のみ
create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- DELETE: 本人のみ
create policy "posts_delete_owner_only"
on public.posts
for delete
to authenticated
using (profile_id = auth.uid());

-- 管理フル権限
create policy "posts_admin_all"
on public.posts
for all
to service_role
using (true)
with check (true);

-- =========================================================
-- profiles
--  公開SELECTをやめる。課金者のみ全体閲覧 or 本人のみ閲覧のどちらか。
--  下は「課金者のみ全体閲覧」例。本人のみ運用にしたい場合は using(id=auth.uid()) に差し替えてください。
-- =========================================================

drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_insert_self" on public.profiles;
drop policy if exists "profiles_self_rw"     on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;

-- SELECT: 課金者のみ（全体参照）
create policy "profiles_select_subscribers"
on public.profiles
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

-- UPDATE: 本人のみ
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- INSERT はサインアップトリガ等で自動作成する運用なら不要
-- 必要なら本人のみINSERTを許可するポリシーを追加してください。

-- =========================================================
-- subscriptions
--  自分の分のみ SELECT、書込みは service_role(Webhook等)のみ
-- =========================================================

drop policy if exists "subs_read_self"         on public.subscriptions;
drop policy if exists "subs_block_writes"      on public.subscriptions;
drop policy if exists "subscriptions_self_select" on public.subscriptions;

-- SELECT: 自分の分のみ
create policy "subscriptions_select_self"
on public.subscriptions
for select
to authenticated
using (profile_id = auth.uid());

-- 管理(Webhook等): フル操作
create policy "subscriptions_admin_all"
on public.subscriptions
for all
to service_role
using (true)
with check (true);

-- =========================================================
-- Storage: posts バケット（storage.objects）
--  読み取り: 課金者のみ（直リンク防止）
--  作成/更新/削除: 自分プレフィックスのみ（auth.uid()/...）
-- =========================================================

-- Storage: posts バケットの RLS（position 構文を修正）
-- 既存ポリシーがあれば掃除
drop policy if exists "posts_obj_select_subscribers" on storage.objects;
drop policy if exists "posts_obj_insert_owner"       on storage.objects;
drop policy if exists "posts_obj_update_owner"       on storage.objects;
drop policy if exists "posts_obj_delete_owner"       on storage.objects;

-- SELECT: 課金者のみ
create policy "posts_obj_select_subscribers"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
);

-- INSERT: 自分のフォルダ配下のみ
create policy "posts_obj_insert_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
);

-- UPDATE: 自分のオブジェクトのみ
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

-- DELETE: 自分のオブジェクトのみ
create policy "posts_obj_delete_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'posts'
  and position((auth.uid()::text || '/') in name) = 1
);
-- =========================================================
-- 以上
-- ※ 公開で見せたいテーブルがある場合は、そのテーブルのみ anon SELECT を別途追加してください。
-- =========================================================
