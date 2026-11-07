-- Doc's own calendar (06.11.2026: "ich möchte gerne einen eigenen Kalender haben ... dass mich Solita dann immer an
-- Termine erinnern kann"). One row per appointment, written by docalvers.de/kalender/ and the phone app
-- doc-kalender.pages.dev. Replaces the Google calendar; the few Google entries come in once from Google's export.
-- Only Doc's account may read or write. Anonymous sign-in is enabled on this project, so `authenticated` alone
-- would be everybody - pinned to Doc's uid like 20261102_todo.sql.
-- Every former version of a row (update and delete) is kept in calendar_event_history, so nothing is ever lost.
--
-- The reminder watcher on Doc's Mac (tools/kalender/waechter.mjs, launchd every minute) has no login. It calls
-- calendar_poll(token) with a random token from the Mac's keychain; only the token's SHA-256 is stored here
-- (calendar_poller, inserted separately - never in this file). Without a matching token the function returns nothing.
-- New public tables get no Data API access by default since 30.10.2026 - the grants are part of this script.
--
-- Apply: SQL editor. Idempotent (safe to re-run).

begin;

create table if not exists public.calendar_event (
  id          bigint generated always as identity primary key,
  user_id     uuid        not null default auth.uid(),
  title       text        not null check (length(btrim(title)) > 0),
  starts_at   timestamptz not null,           -- all-day: local midnight (Europe/Berlin) of the first day
  ends_at     timestamptz,                    -- exclusive end; null = start + 1 h (timed) or + 1 day (all-day)
  all_day     boolean     not null default false,
  location    text,
  notes       text,
  rrule       text,                           -- repetition, RFC 5545 subset: FREQ, INTERVAL, COUNT, UNTIL, BYDAY
  exdates     timestamptz[] not null default '{}',   -- single occurrences of a series that were removed
  remind      int[]       not null default '{60,15}', -- minutes before the start (all-day: before 00:00, so 360 = 18:00 the day before)
  color       smallint    not null default 2 check (color between 1 and 3),   -- 1 = Υ red, 2 = λ gold, 3 = φ green
  source_uid  text,                           -- UID of an imported .ics entry: a second import skips it
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint calendar_event_source unique (user_id, source_uid)
);
create index if not exists calendar_event_user_start on public.calendar_event (user_id, starts_at);

alter table public.calendar_event enable row level security;
revoke all on public.calendar_event from anon;
grant select, insert, update, delete on public.calendar_event to authenticated;
grant select, insert, update, delete on public.calendar_event to service_role;

drop policy if exists calendar_event_doc_all on public.calendar_event;
create policy calendar_event_doc_all on public.calendar_event for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- former versions, read-only for Doc; written by the trigger only
create table if not exists public.calendar_event_history (
  hist_id    bigint generated always as identity primary key,
  op         text        not null,
  changed_at timestamptz not null default now(),
  row_data   jsonb       not null
);
alter table public.calendar_event_history enable row level security;
revoke all on public.calendar_event_history from anon;
grant select on public.calendar_event_history to authenticated;
grant select, insert, update, delete on public.calendar_event_history to service_role;

drop policy if exists calendar_event_history_doc_read on public.calendar_event_history;
create policy calendar_event_history_doc_read on public.calendar_event_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create or replace function public.calendar_event_keep_history() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.calendar_event_history (op, row_data) values (tg_op, to_jsonb(old));
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists calendar_event_history_trg on public.calendar_event;
create trigger calendar_event_history_trg before update or delete on public.calendar_event
  for each row execute function public.calendar_event_keep_history();

-- the watcher's token: only its SHA-256 (hex). No policy and no grant for anon/authenticated = nobody reads it.
create table if not exists public.calendar_poller (
  token_sha256 text primary key check (token_sha256 ~ '^[0-9a-f]{64}$'),
  created_at   timestamptz not null default now()
);
alter table public.calendar_poller enable row level security;
revoke all on public.calendar_poller from anon, authenticated;
grant select, insert, update, delete on public.calendar_poller to service_role;

-- what the watcher may see: Doc's appointments that can still ring (series, or not ended more than 2 days ago)
create or replace function public.calendar_poll(p_token text)
returns table (id bigint, title text, starts_at timestamptz, ends_at timestamptz, all_day boolean,
               location text, rrule text, exdates timestamptz[], remind int[], updated_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_token is null or not exists (
       select 1 from public.calendar_poller
       where token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  return query
    select e.id, e.title, e.starts_at, e.ends_at, e.all_day, e.location, e.rrule, e.exdates, e.remind, e.updated_at
    from public.calendar_event e
    where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
      and (e.rrule is not null or coalesce(e.ends_at, e.starts_at + interval '1 day') > now() - interval '2 days');
end $$;
revoke all on function public.calendar_poll(text) from public;
grant execute on function public.calendar_poll(text) to anon, authenticated, service_role;

commit;

-- control
select tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename like 'calendar%' order by tablename;
