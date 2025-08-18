-- =========================================
-- posts: caption / is_public の追加・型整備
-- =========================================
alter table public.posts
add column if not exists caption varchar(30);

alter table public.posts
add column if not exists is_public boolean default false;

-- =========================================
-- reactions テーブル（URL を持つリアクション）
-- posts:reactions = 1:N
-- =========================================
create table if not exists public.reactions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  url        text not null,              -- 絵文字/スタンプ等のURL
  created_at timestamptz not null default now()
);

-- よく使う検索用インデックス
create index if not exists reactions_post_id_idx on public.reactions(post_id);
create index if not exists reactions_profile_id_idx on public.reactions(profile_id);
create index if not exists reactions_url_idx on public.reactions(url);
create index if not exists reactions_created_at_idx on public.reactions(created_at);

-- reactions
alter table public.reactions enable row level security;

-- 既存掃除
drop policy if exists "reactions_select_members_only" on public.reactions;
drop policy if exists "reactions_insert_owner_only"   on public.reactions;
drop policy if exists "reactions_update_owner_only"   on public.reactions;
drop policy if exists "reactions_delete_owner_only"   on public.reactions;
drop policy if exists "reactions_admin_all"           on public.reactions;

-- SELECT: 課金 or 無料トライアル中の認証ユーザ
create policy "missions_select_paid_or_trial"
on public.reactions
for select
to authenticated
using (
  can_view_paid_or_trial(auth.uid())
);

-- INSERT: 本人のみ（profile_id = auth.uid()）
create policy "reactions_insert_owner_only"
on public.reactions
for insert
to authenticated
with check (profile_id = auth.uid());

-- UPDATE: 本人のみ
create policy "reactions_update_owner_only"
on public.reactions
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- DELETE: 本人のみ
create policy "reactions_delete_owner_only"
on public.reactions
for delete
to authenticated
using (profile_id = auth.uid());

-- 管理フル権限（service_role）
create policy "reactions_admin_all"
on public.reactions
for all
to service_role
using (true)
with check (true);
