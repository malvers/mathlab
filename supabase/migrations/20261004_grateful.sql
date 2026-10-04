-- Doc's gratitude journal (04.10.2026): one row per entry. Imported once from "MRA Daten 2021 - 2026.xlsx"
-- (column "I'm greatfull for ...", source = 'excel'), from then on written by the phone page /grateful/.
-- Very personal text: only Doc's account may read or write. Anonymous sign-in is enabled on this project, so
-- `authenticated` alone would be everybody - pinned to Doc's uid like 20260927_svp_rls_only_doc.sql.
-- Every former version of a row (update and delete) is kept in grateful_history, so a stale tab or a slip
-- can never lose an entry.
--
-- Apply: SQL editor or management API. Idempotent (safe to re-run).

begin;

create table if not exists public.grateful (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null default auth.uid(),
  day        date        not null,
  text       text        not null check (length(btrim(text)) > 0),
  source     text        not null default 'app',          -- 'excel' = imported, 'app' = written on the page
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists grateful_user_day on public.grateful (user_id, day);

alter table public.grateful enable row level security;
revoke all on public.grateful from anon;

drop policy if exists grateful_doc_all on public.grateful;
create policy grateful_doc_all on public.grateful for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- former versions, read-only for Doc; written by the trigger only
create table if not exists public.grateful_history (
  hist_id    bigint generated always as identity primary key,
  op         text        not null,
  changed_at timestamptz not null default now(),
  row_data   jsonb       not null
);
alter table public.grateful_history enable row level security;
revoke all on public.grateful_history from anon;

drop policy if exists grateful_history_doc_read on public.grateful_history;
create policy grateful_history_doc_read on public.grateful_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create or replace function public.grateful_keep_history() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.grateful_history (op, row_data) values (tg_op, to_jsonb(old));
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists grateful_history_trg on public.grateful;
create trigger grateful_history_trg before update or delete on public.grateful
  for each row execute function public.grateful_keep_history();

commit;

-- control
select tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename like 'grateful%' order by tablename;
