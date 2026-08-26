-- Mini-Mentimeter "vote" (Doc 2026-08-26): host publishes a title under a 4-digit code, kids scan the QR
-- (vote.html?c=1234) and tap 1..10 once; the host screen counts votes live and reveals the mean on "Show".
--
-- Model: every "Publish" creates a NEW poll row (same code, fresh id) = a new round; votes hang on the poll id,
-- so "next round" never needs a delete. Anonymous clients may only INSERT + SELECT (no update/delete at all).
-- One vote per device per round is enforced by unique (poll_id, device); the device id is a random string the
-- kid's browser keeps in localStorage — classroom-grade, not tamper-proof (on purpose: no accounts).
--
-- Additive + reversible: drop table public.vote_votes, public.vote_polls. Apply via SQL Editor, idempotent.

create table if not exists public.vote_polls (
  id         uuid        primary key default gen_random_uuid(),
  code       text        not null check (code ~ '^[0-9]{4}$'),
  title      text        not null default '',
  created_at timestamptz not null default now()
);
create index if not exists vote_polls_code_idx on public.vote_polls (code, created_at desc);

create table if not exists public.vote_votes (
  id         bigint      generated always as identity primary key,
  poll_id    uuid        not null references public.vote_polls (id) on delete cascade,
  device     text        not null,
  value      smallint    not null check (value between 1 and 10),
  created_at timestamptz not null default now(),
  unique (poll_id, device)
);
create index if not exists vote_votes_poll_idx on public.vote_votes (poll_id);

alter table public.vote_polls enable row level security;
alter table public.vote_votes enable row level security;

drop policy if exists vote_polls_select on public.vote_polls;
drop policy if exists vote_polls_insert on public.vote_polls;
drop policy if exists vote_votes_select on public.vote_votes;
drop policy if exists vote_votes_insert on public.vote_votes;

create policy vote_polls_select on public.vote_polls for select to anon, authenticated using (true);
create policy vote_polls_insert on public.vote_polls for insert to anon, authenticated with check (true);
create policy vote_votes_select on public.vote_votes for select to anon, authenticated using (true);
create policy vote_votes_insert on public.vote_votes for insert to anon, authenticated with check (true);

-- Realtime (postgres_changes) so the host counter and the kids' "new round" switch are push, not polling.
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'vote_polls') then
    alter publication supabase_realtime add table public.vote_polls;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'vote_votes') then
    alter publication supabase_realtime add table public.vote_votes;
  end if;
end $$;
