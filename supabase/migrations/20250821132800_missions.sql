-- =========================================
-- enums
-- =========================================
do $$
begin
  -- 地方名（大まかな粒度）
  if not exists (select 1 from pg_type where typname = 'area_region') then
    create type area_region as enum (
      'hokkaido',
      'tohoku',
      'kanto',
      'chubu',
      'kansai',
      'chugoku',
      'shikoku',
      'kyushu_okinawa'
    );
  end if;
end$$;

-- =========================================
-- seasons_missions（季節/長期お題）
--  - 公開開始/終了日時を追加
--  - 他は missions と同等
-- =========================================
create table if not exists public.seasons_missions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  used_at     timestamptz null,
  publish_start_at timestamptz not null,
  publish_end_at   timestamptz not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- indexes（重複作成ガード付）
create index if not exists seasons_missions_used_at_idx
  on public.seasons_missions using btree (used_at);

create index if not exists idx_seasons_missions_publish_start
  on public.seasons_missions using btree (publish_start_at);

create index if not exists idx_seasons_missions_publish_end
  on public.seasons_missions using btree (publish_end_at);

create index if not exists idx_seasons_missions_created_at
  on public.seasons_missions using btree (created_at desc);

-- updated_at 自動更新トリガ
drop trigger if exists set_seasons_missions_updated_at on public.seasons_missions;
create trigger set_seasons_missions_updated_at
before update on public.seasons_missions
for each row execute function set_updated_at();

-- =========================================
-- area_missions（エリアお題）
--  - 公開開始/終了日時を追加
--  - 地方名（enum: area_region）を追加
--  - 他は missions と同等
-- =========================================
create table if not exists public.area_missions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  used_at     timestamptz null,
  publish_start_at timestamptz not null,
  publish_end_at   timestamptz not null,
  region      area_region not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- indexes
create index if not exists area_missions_used_at_idx
  on public.area_missions using btree (used_at);

create index if not exists idx_area_missions_publish_start
  on public.area_missions using btree (publish_start_at);

create index if not exists idx_area_missions_publish_end
  on public.area_missions using btree (publish_end_at);

create index if not exists idx_area_missions_region
  on public.area_missions using btree (region);

create index if not exists idx_area_missions_created_at
  on public.area_missions using btree (created_at desc);

-- updated_at 自動更新トリガ
drop trigger if exists set_area_missions_updated_at on public.area_missions;
create trigger set_area_missions_updated_at
before update on public.area_missions
for each row execute function set_updated_at();

alter table public.seasons_missions           enable row level security;
alter table public.area_missions              enable row level security;

create policy "seasons_missions_select_paid_or_trial"
on public.seasons_missions
for select
to authenticated
using ( public.can_view_paid_or_trial(auth.uid()) );

create policy "area_missions_select_paid_or_trial"
on public.area_missions
for select
to authenticated
using ( public.can_view_paid_or_trial(auth.uid()) );
