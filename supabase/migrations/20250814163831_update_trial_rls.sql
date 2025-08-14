-- =========================================
-- アクセス判定関数の追加（課金者 or 無料トライアル中）
-- =========================================

-- 既存: has_active_subscription(uid) はそのまま利用（active/trialing を true）

-- カラム追加（デフォルトは登録時から7日後）
alter table public.profiles
add column if not exists free_trial_end timestamptz default (now() + interval '7 days');

-- free_trial_end が NULL の行にだけ 7日後をセット
update public.profiles
set free_trial_end = now() + interval '7 days';

create or replace function public.is_on_free_trial(uid uuid)
returns boolean
language sql
stable
as $$
  -- サブスクが無い かつ free_trial_end が設定されていて、今日以降
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and not exists (
        select 1
        from public.subscriptions s
        where s.profile_id = uid
          and s.status in ('active','trialing')
      )
      and p.free_trial_end is not null
      and p.free_trial_end >= now()
  );
$$;

create or replace function public.has_access(uid uuid)
returns boolean
language sql
stable
as $$
  select public.has_active_subscription(uid) or public.is_on_free_trial(uid);
$$;

-- =========================================
-- missions の RLS
-- =========================================
alter table public.missions enable row level security;

-- 既存ポリシー掃除
drop policy if exists "missions_select_public"           on public.missions;
drop policy if exists "missions_select_subscribers_only" on public.missions;
drop policy if exists "missions_admin_all"               on public.missions;

-- SELECT: 課金者 or 無料トライアル中のみ
create policy "missions_select_access_only"
on public.missions
for select
to authenticated
using ( public.has_access(auth.uid()) );

-- 管理: service_role はフル
create policy "missions_admin_all"
on public.missions
for all
to service_role
using (true)
with check (true);

-- =========================================
-- posts の RLS
-- =========================================
alter table public.posts enable row level security;

-- 既存ポリシー掃除
drop policy if exists "posts_select_authenticated"  on public.posts;
drop policy if exists "posts_select_subscribers_only" on public.posts;
drop policy if exists "posts_insert_owner_only"     on public.posts;
drop policy if exists "posts_update_owner_only"     on public.posts;
drop policy if exists "posts_delete_owner_only"     on public.posts;
drop policy if exists "posts_admin_all"             on public.posts;

-- SELECT: 課金者 or 無料トライアル中のみ（他人の投稿含め閲覧可）
create policy "posts_select_access_only"
on public.posts
for select
to authenticated
using ( public.has_access(auth.uid()) );

-- INSERT: 所有者のみ（投稿自体は無料期間でも可能）
create policy "posts_insert_owner_only"
on public.posts
for insert
to authenticated
with check ( profile_id = auth.uid() );

-- UPDATE: 所有者のみ
create policy "posts_update_owner_only"
on public.posts
for update
to authenticated
using ( profile_id = auth.uid() )
with check ( profile_id = auth.uid() );

-- DELETE: 所有者のみ
create policy "posts_delete_owner_only"
on public.posts
for delete
to authenticated
using ( profile_id = auth.uid() );

-- 管理: service_role フル
create policy "posts_admin_all"
on public.posts
for all
to service_role
using (true)
with check (true);

-- =========================================
-- storage.objects（posts バケット）
--  読み取り: 課金者 or 無料トライアル中のみ
--  書き込み/更新/削除: 自分の uid/ プレフィックス配下のみ
-- =========================================

-- 既存ポリシー掃除（存在すれば）
drop policy if exists "posts_obj_select_authenticated" on storage.objects;
drop policy if exists "posts_obj_select_subscribers"   on storage.objects;
drop policy if exists "posts_obj_insert_owner"         on storage.objects;
drop policy if exists "posts_obj_update_owner"         on storage.objects;
drop policy if exists "posts_obj_delete_owner"         on storage.objects;

-- SELECT: 課金者 or 無料トライアル中のみ
create policy "posts_obj_select_access_only"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'posts'
  and public.has_access(auth.uid())
);

-- INSERT: 自分のフォルダ配下のみ（{uid}/...）
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
