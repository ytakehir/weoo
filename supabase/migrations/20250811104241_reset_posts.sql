-- ============ ROLLBACK: posts の承認フローを撤去 ============

-- トリガ削除
drop trigger if exists trg_posts_enforce_status on public.posts;
drop function if exists public.posts_enforce_status();

-- ポリシー削除（存在する場合のみ）
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

  if exists (select 1 from pg_p_policies where schemaname='public' and tablename='posts' and policyname='posts_update_owner_content') then
    drop policy "posts_update_owner_content" on public.posts;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_update_admin') then
    drop policy "posts_update_admin" on public.posts;
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='posts_delete_admin') then
    drop policy "posts_delete_admin" on public.posts;
  end if;
end$$;

-- カラム削除（あれば）
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='status'
  ) then
    alter table public.posts drop column status;
  end if;
end$$;

-- 型削除（他に使われていなければ）
do $$
begin
  if exists (select 1 from pg_type where typname='post_status') then
    -- 依存があれば drop で失敗するので、明示的に posts から先に外しておく必要がある
    drop type post_status;
  end if;
end$$;
