-- 当日(JST)のミッションを取得。未決定なら候補から1件ランダムに選んで used_at をセットして返す
create or replace function public.pick_today_mission_jst()
returns public.missions
language plpgsql
security definer
set search_path = public
as $$
declare
  today_start timestamptz := (date_trunc('day', (now() at time zone 'Asia/Tokyo')) at time zone 'Asia/Tokyo');
  today_end   timestamptz := today_start + interval '1 day';
  picked public.missions;
begin
  -- 既に当日分があるならそれを返す
  select * into picked
  from public.missions
  where used_at >= today_start and used_at < today_end
  order by used_at desc
  limit 1;

  if found then
    return picked;
  end if;

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

-- 認証ユーザから実行できるように（関数は definer でRLSを越える）
grant execute on function public.pick_today_mission_jst() to authenticated;
