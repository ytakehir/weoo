-- 0) 依存ポリシーの確認（statusを参照しているかどうか）
select policyname, pg_get_expr(policyqual, tablerelid) as using_expr,
       pg_get_expr(with_check, tablerelid) as check_expr
from pg_policies
where tablename = 'mission_submissions'
  and schemaname = 'public'
  and (
    pg_get_expr(policyqual, tablerelid) ilike '%status%'
    or pg_get_expr(with_check, tablerelid) ilike '%status%'
  );

-- 1) 該当ポリシーを削除
drop policy if exists ms_update_fix_pending on public.mission_submissions;
-- ↑ 0) で出たもの全部drop

-- 2) enum型がなければ作成
do $$
begin
  if not exists (select 1 from pg_type where typname = 'mission_submission_status') then
    create type mission_submission_status as enum ('pending', 'approved', 'rejected');
  end if;
end$$;

-- 3) カラム型変更
alter table public.mission_submissions
  alter column status drop default;

alter table public.mission_submissions
  alter column status type mission_submission_status
  using status::mission_submission_status;

-- 4) デフォルト値 & NOT NULL 設定
alter table public.mission_submissions
  alter column status set default 'pending';

alter table public.mission_submissions
  alter column status set not null;

-- 5) 削除したポリシーを再作成（元の条件に合わせる）
create policy ms_update_fix_pending
on public.mission_submissions
for update
to authenticated
using (status = 'pending')
with check (status = 'pending');
