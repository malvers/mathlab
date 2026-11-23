-- Grateful as a book (/tagebuch/, 23.11.2026): everything the book writes besides the thanks sentence, which stays in
-- public.grateful (column text = morning 1): morning 2-3, evening 1-3, the 30-second clocks that ran out, the habits of the
-- day, the week's answers and the monthly check. One row per page key and user:
--   'tag:2026-11-23'    {"m2": "...", "m3": "...", "e1": "...", "e2": "...", "e3": "...", "habits": [true, false, true], "done": ["m2", "e1"]}
--   'woche:2026-11-16'  {"w1": "...", ..., "w5": "...", "done": [...]}            (key = Monday of the week)
--   'monat:2026-11'     {"werte": [8, 7, 6, 8, 9, 7], "ms": "...", "done": [...]}
-- Additive only: public.grateful and its rows stay untouched.
-- Same rules as grateful (20261004_grateful.sql): only Doc's uid may read or write, anon revoked, and every former version
-- of a row (update and delete) is kept in grateful_history by the same trigger function.
--
-- Apply: SQL editor or management API. Idempotent (safe to re-run).

begin;

create table if not exists public.grateful_buch (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null default auth.uid(),
  key        text        not null check (key ~ '^(tag:[0-9]{4}-[0-9]{2}-[0-9]{2}|woche:[0-9]{4}-[0-9]{2}-[0-9]{2}|monat:[0-9]{4}-[0-9]{2})$'),
  data       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

alter table public.grateful_buch enable row level security;
revoke all on public.grateful_buch from anon;

drop policy if exists grateful_buch_doc_all on public.grateful_buch;
create policy grateful_buch_doc_all on public.grateful_buch for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- former versions: the trigger function of grateful (inserts (op, to_jsonb(old)) into grateful_history, stamps updated_at)
drop trigger if exists grateful_buch_history_trg on public.grateful_buch;
create trigger grateful_buch_history_trg before update or delete on public.grateful_buch
  for each row execute function public.grateful_keep_history();

commit;

-- control
select tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename like 'grateful%' order by tablename;
