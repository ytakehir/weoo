-- =========================================
-- 1) enum を用意
-- =========================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'mission_kind') then
    create type mission_kind as enum ('daily', 'season', 'area');
  end if;

  if not exists (select 1 from pg_type where typname = 'region_jp') then
    create type region_jp as enum (
      'hokkaido','tohoku','kanto','chubu','kansai','chugoku','shikoku','kyushu_okinawa'
    );
  end if;
end$$;

-- =========================================
-- 2) missions テーブルを拡張
--    - kind: daily/season/area の別
--    - publish_start_at / publish_end_at: 季節＆エリアの公開期間
--    - region: エリア（エリア以外はNULL）
-- =========================================
alter table public.missions
  add column if not exists kind mission_kind not null default 'daily',
  add column if not exists publish_start_at timestamptz,
  add column if not exists publish_end_at   timestamptz,
  add column if not exists region           region_jp;

-- 期間の整合性（start < end）チェック（両方入っているケースのみ）
alter table public.missions
  drop constraint if exists missions_publish_window_check;
alter table public.missions
  add constraint missions_publish_window_check
  check (
    publish_start_at is null
    or publish_end_at is null
    or publish_start_at < publish_end_at
  );

-- kind と必須項目の対応（area のとき region 必須、season/area は期間を入れる運用想定）
-- 期間は柔らかく運用したい場合はこの制約はコメントアウト可
alter table public.missions
  drop constraint if exists missions_kind_requirements_check;
alter table public.missions
  add constraint missions_kind_requirements_check
  check (
    (kind = 'daily'  and region is null)
    or
    (kind = 'season' and region is null)
    or
    (kind = 'area'   and region is not null)
  );

-- よく使うフィルタ用のインデックス
create index if not exists idx_missions_kind on public.missions(kind);
create index if not exists idx_missions_region on public.missions(region);
create index if not exists idx_missions_publish_window on public.missions(publish_start_at, publish_end_at);
