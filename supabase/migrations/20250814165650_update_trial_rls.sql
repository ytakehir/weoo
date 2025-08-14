-- 必要テーブルのRLSを有効化
alter table public.missions           enable row level security;
alter table public.posts              enable row level security;

-- 課金判定（既存のものを再定義してOK）
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

-- 無料トライアル判定（free_trial_end が “今以降” ならトライアル中）
create or replace function public.is_on_free_trial(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.free_trial_end is not null
      and now() <= p.free_trial_end
  );
$$;

-- 共通条件：課金または無料トライアル
create or replace function public.can_view_paid_or_trial(uid uuid)
returns boolean
language sql
stable
as $$
  select public.has_active_subscription(uid) or public.is_on_free_trial(uid);
$$;

-- 既存の類似ポリシーを掃除
drop policy if exists "missions_select_subscribers_only" on public.missions;
drop policy if exists "missions_admin_all"               on public.missions;

-- SELECT: 課金者 or 無料トライアル中
create policy "missions_select_paid_or_trial"
on public.missions
for select
to authenticated
using ( public.can_view_paid_or_trial(auth.uid()) );

-- 管理用（service_role はフル権限）
create policy "missions_admin_all"
on public.missions
for all
to service_role
using (true)
with check (true);

-- 掃除
drop policy if exists "posts_select_authenticated" on public.posts;
drop policy if exists "posts_select_subscribers_only" on public.posts;
drop policy if exists "posts_insert_owner_only"    on public.posts;
drop policy if exists "posts_update_owner_only"    on public.posts;
drop policy if exists "posts_delete_owner_only"    on public.posts;
drop policy if exists "posts_admin_all"            on public.posts;

-- SELECT: 課金者 or 無料トライアル中（全体閲覧を許可）
create policy "posts_select_paid_or_trial"
on public.posts
for select
to authenticated
using ( public.can_view_paid_or_trial(auth.uid()) );

-- INSERT: 自分の投稿のみ（課金不要）
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check ( profile_id = auth.uid() );

-- UPDATE: 自分の投稿のみ
create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using ( profile_id = auth.uid() )
with check ( profile_id = auth.uid() );

-- DELETE: 自分の投稿のみ
create policy "posts_delete_owner_only"
on public.posts
for delete
to authenticated
using ( profile_id = auth.uid() );

-- 管理フル権限
create policy "posts_admin_all"
on public.posts
for all
to service_role
using (true)
with check (true);
