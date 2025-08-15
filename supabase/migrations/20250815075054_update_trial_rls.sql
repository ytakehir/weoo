alter table public.profiles
add column if not exists free_trial_end timestamptz default (now() + interval '30 days');

-- free_trial_end が NULL の行にだけ 30日後をセット
update public.profiles
set free_trial_end = now() + interval '30 days'
