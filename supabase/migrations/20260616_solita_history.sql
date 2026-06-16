-- Solita cross-device conversation sync — single shared log.
-- Solita is single-user: access is ONE shared password (LABAI_PASSWORD, checked in the edge functions),
-- so browser and Pixel are the same user "Doc". We therefore keep ONE row holding the whole conversation
-- history + rolling summary, and let every device read/write it through the password-gated 'solita-sync'
-- edge function (service role). The table itself stays PRIVATE: RLS is enabled with NO policies, so the
-- anon/authenticated roles get zero access — only the service_role (the edge fn) bypasses RLS.
--
-- Apply: paste into Supabase → SQL Editor → Run. Idempotent (safe to re-run).

create table if not exists public.solita_history (
  id         text primary key default 'main',          -- single shared bucket; always 'main' for now
  history    jsonb       not null default '[]'::jsonb,  -- [{ role:'user'|'assistant', content:'…' }, …]
  summary    text        not null default '',           -- rolling context summary (German)
  rev        bigint      not null default 0,            -- optimistic-concurrency counter (compare-and-swap)
  updated_at timestamptz not null default now()
);

-- Guarantee the single row exists so the edge fn can always PATCH it.
insert into public.solita_history (id) values ('main')
  on conflict (id) do nothing;

-- Private by default: deny-all to anon/authenticated; only the service_role (edge fn) reaches the data.
alter table public.solita_history enable row level security;
-- (No CREATE POLICY on purpose — RLS with zero policies = no row is visible to anon/authenticated.)
