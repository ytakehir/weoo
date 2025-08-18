-- 同じ (post_id, profile_id, url) を重複不可に
create unique index if not exists reactions_unique_per_user
  on public.reactions (post_id, profile_id, url);
