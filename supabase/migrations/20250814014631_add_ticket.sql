-- =========================================
-- 0) profiles.ticket カラム（なければ追加）
-- =========================================
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='ticket'
  ) then
    alter table public.profiles
      add column ticket integer not null default 10;
  end if;
end$$;

-- 0-2) 非負制約（存在しなければ）
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_ticket_nonnegative'
  ) then
    alter table public.profiles
      add constraint profiles_ticket_nonnegative check (ticket >= 0);
  end if;
end$$;

-- =========================================
-- 1) チケット関連の関数
-- =========================================
create or replace function public.topup_weekly_tickets()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set ticket = least(ticket + 1, 10);
$$;

create or replace function public.topup_event_tickets(inc integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set ticket = ticket + inc;
$$;

create or replace function public.consume_one_ticket()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set ticket = greatest(ticket - 1, 0);
$$;

-- =========================================
-- 2) pg_cron を有効化（cron スキーマ）
-- =========================================
create extension if not exists pg_cron with schema cron;

-- =========================================
-- 3) 週次ジョブを入れ直し（JST 月曜 0:05）
--    ※ pg_cron は UTC 動作。JST+9 なので
--       日曜 15:05(UTC) = 月曜 0:05(JST)
--       → '5 15 * * 0'
-- =========================================
-- 同名ジョブがあれば無効化
select cron.unschedule(jobid)
from cron.job
where jobname = 'weekly_tickets';

-- 登録
select cron.schedule(
  'weekly_tickets',
  '0 15 * * 0',
  $$select public.topup_weekly_tickets();$$
);
