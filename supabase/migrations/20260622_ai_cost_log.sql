-- ai_cost_log: per-call AI token usage, for the daily infra mail's cost section (Phase 1: measured tokens,
-- priced in infra-usage). Each AI Edge Function (claude/deepseek/identify) appends ONE row per call,
-- fire-and-forget with the auto-injected service-role key. Pricing lives in infra-usage (TS) — ONE place.
--
-- RLS on, NO policies → anon/authenticated get nothing; the service-role key (Edge runtime) bypasses RLS.
-- Apply: paste into Dashboard → SQL editor ONCE (or `supabase db push` if the project is linked).

create table if not exists public.ai_cost_log (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  provider    text not null,            -- 'claude' | 'deepseek' | 'gemini'
  model       text,
  in_tok      integer not null default 0,   -- uncached input tokens
  out_tok     integer not null default 0,
  cache_read  integer not null default 0,   -- cached-input reads (cheap)
  cache_write integer not null default 0,   -- cache creation (Anthropic only; 0 elsewhere)
  label       text
);

create index if not exists ai_cost_log_created_idx on public.ai_cost_log (created_at);

alter table public.ai_cost_log enable row level security;
-- (no policies on purpose → only service_role, which bypasses RLS, can read/write)

-- Summed token usage per provider+model over the last N days (default 1). SECURITY DEFINER so the
-- service-role Edge Function can read it; execution locked to service_role.
create or replace function public.ai_cost_summary(days integer default 1)
returns table (provider text, model text, in_tok bigint, out_tok bigint,
               cache_read bigint, cache_write bigint, n bigint)
language sql
security definer
set search_path = ''
as $$
  select provider, model,
         coalesce(sum(in_tok),0)::bigint, coalesce(sum(out_tok),0)::bigint,
         coalesce(sum(cache_read),0)::bigint, coalesce(sum(cache_write),0)::bigint,
         count(*)::bigint
  from public.ai_cost_log
  where created_at >= now() - (days || ' days')::interval
  group by provider, model
  order by provider, model;
$$;

revoke all on function public.ai_cost_summary(integer) from public, anon, authenticated;
grant execute on function public.ai_cost_summary(integer) to service_role;
