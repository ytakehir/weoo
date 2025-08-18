create or replace function public.pick_mission()
returns public.missions
language plpgsql
as $$
declare
  picked public.missions;
begin
  -- 候補: 未使用 or 2ヶ月以上前
  with candidates as (
    select id from public.missions where used_at is null
    union all
    select id from public.missions where used_at < now() - interval '2 months'
  ),
  one as (
    select id from candidates order by random() limit 1
  )
  update public.missions m
     set used_at = now()
  from one
  where m.id = one.id
  returning m.* into picked;

  return picked;
end;
$$;

select cron.schedule(
  'daily_pick_mission',   -- ジョブ名（任意）
  '0 0 * * *',            -- 毎日0時
  $$select public.pick_mission();$$
);
