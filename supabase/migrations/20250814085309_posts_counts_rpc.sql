-- =========================================
-- posts の総数 / ミッション別件数を返す SECDEF RPC
--  - RLSをバイパスして COUNT だけ取得したい用途向け
--  - anon / authenticated から呼べるように EXECUTEを付与
-- =========================================

-- 総件数
create or replace function public.posts_count_total()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint from public.posts;
$$;

-- ミッション別件数
create or replace function public.posts_count_by_mission(post_mission_id uuid)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.posts
  where mission_id = post_mission_id;
$$;

-- 必要ならプロフィール別などの派生も
-- create or replace function public.posts_count_by_profile(p_profile_id uuid) ...

-- 所有者をテーブルオーナー(=通常 postgres)に変更してRLSを確実にバイパス
-- ※ SupabaseのSQLエディタ実行ユーザがpostgresでない場合はこの行はスキップしてください
--  （実行ユーザがオーナーならSECURITY DEFINERでもOKです）
-- alter function public.posts_count_total() owner to postgres;
-- alter function public.posts_count_by_mission(uuid) owner to postgres;

-- 実行権限付与（クライアントから呼べるように）
grant execute on function public.posts_count_total()            to anon, authenticated;
grant execute on function public.posts_count_by_mission(uuid)   to anon, authenticated;
