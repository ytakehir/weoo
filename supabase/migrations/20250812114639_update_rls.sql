-- ========= 共通: 課金判定関数（更新/再作成） =========
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

-- ========= RLS 有効化 =========
alter table public.missions             enable row level security;
alter table public.mission_submissions  enable row level security;
alter table public.posts                enable row level security;
alter table public.profiles             enable row level security;
alter table public.subscriptions        enable row level security;

-- ========= missions =========
drop policy if exists "missions_select_subscribers_only" on public.missions;
drop policy if exists "missions_admin_all"               on public.missions;

-- SELECT: 課金者のみ
create policy "missions_select_subscribers_only"
on public.missions
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

-- 管理: フル
create policy "missions_admin_all"
on public.missions
for all
to service_role
using (true) with check (true);

-- ========= mission_submissions（下書き/審査） =========
drop policy if exists "ms_insert_own"  on public.mission_submissions;
drop policy if exists "ms_select_own"  on public.mission_submissions;
drop policy if exists "ms_update_own"  on public.mission_submissions;
drop policy if exists "ms_admin_all"   on public.mission_submissions;

-- INSERT/SELECT/UPDATE: 自分の行のみ
create policy "ms_insert_own"
on public.mission_submissions
for insert
to authenticated
with check (created_by = auth.uid());

create policy "ms_select_own"
on public.mission_submissions
for select
to authenticated
using (created_by = auth.uid());

create policy "ms_update_own"
on public.mission_submissions
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

-- 管理: フル
create policy "ms_admin_all"
on public.mission_submissions
for all
to service_role
using (true) with check (true);

-- ========= posts =========
drop policy if exists "posts_select_subscribers_only" on public.posts;
drop policy if exists "posts_insert_owner_only"       on public.posts;
drop policy if exists "posts_update_owner_only"       on public.posts;
drop policy if exists "posts_delete_owner_only"       on public.posts;
drop policy if exists "posts_admin_all"               on public.posts;

-- SELECT: 課金者のみ（他人の投稿も閲覧可）
create policy "posts_select_subscribers_only"
on public.posts
for select
to authenticated
using ( public.has_active_subscription(auth.uid()) );

-- INSERT/UPDATE/DELETE: 本人 かつ 課金者
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and public.has_active_subscription(auth.uid())
);

create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using (
  profile_id = auth.uid()
  and public.has_active_subscription(auth.uid())
)
with check (
  profile_id = auth.uid()
  and public.has_active_subscription(auth.uid())
);

create policy "posts_delete_owner_only"
on public.posts
for delete
to authenticated
using (
  profile_id = auth.uid()
  and public.has_active_subscription(auth.uid())
);

-- 管理: フル
create policy "posts_admin_all"
on public.posts
for all
to service_role
using (true) with check (true);

-- ========= profiles（ここが今回の詰まりポイント） =========
drop policy if exists "profiles_select_subscribers" on public.profiles;
drop policy if exists "profiles_select_self_or_sub" on public.profiles;
drop policy if exists "profiles_update_self"        on public.profiles;

-- SELECT: 自分は常にOK OR 課金者は全体OK
create policy "profiles_select_self_or_sub"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.has_active_subscription(auth.uid())
);

-- UPDATE: 本人のみ
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ========= subscriptions =========
drop policy if exists "subscriptions_select_self" on public.subscriptions;
drop policy if exists "subscriptions_admin_all"   on public.subscriptions;

-- SELECT: 自分の分のみ
create policy "subscriptions_select_self"
on public.subscriptions
for select
to authenticated
using (profile_id = auth.uid());

-- 管理(Webhook等): フル
create policy "subscriptions_admin_all"
on public.subscriptions
for all
to service_role
using (true) with check (true);

-- ========= Storage: posts バケット =========
-- 既存掃除
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

-- INSERT/UPDATE/DELETE: 自分プレフィックスのみ かつ 課金者
create policy "posts_obj_insert_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
  and position((auth.uid()::text || '/') in name) = 1
);

create policy "posts_obj_update_owner"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
  and position((auth.uid()::text || '/') in name) = 1
)
with check (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
  and position((auth.uid()::text || '/') in name) = 1
);

create policy "posts_obj_delete_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'posts'
  and public.has_active_subscription(auth.uid())
  and position((auth.uid()::text || '/') in name) = 1
);
