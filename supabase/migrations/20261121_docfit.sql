-- DocFit, part 1 (21.11.2026): Doc's training and body data in one private place, written by the Android app
-- (docfit-app) and the web page /docfit/ - "DocFit im Web = identisch zum Phone" (Doc, 20.11.2026), concept in
-- HTML/docfit/konzept-web.html. Health data: only Doc's account may read or write. Anonymous sign-in is enabled on
-- this project, so `authenticated` alone would be everybody - every policy is pinned to Doc's uid like grateful.
--
-- Two people use the scale (the app's slots "" and "2"): person 0 = Doc, person 1 = the second person. Her rows
-- belong to Doc's account as well; her name lives only in docfit_profile (never in the repository).
--
-- docfit_profile   one row per person: name (null = Doc), height, birth year, sex, on/off in the app
-- docfit_weighing  one row per weigh-in: weight in 10 g, resistance in ohms (0 = no fat measured), waist/hip in mm,
--                  person - the same fields as the app's Weighings; body values are computed when shown
-- docfit_run       one row per stopped time: start, duration in ms, exercise exactly as in the app ('Planks',
--                  'Two Balls'; '' = a time from before there were exercises) - new exercises need no DDL
-- docfit_bp        blood pressure (Omron, read over Bluetooth once it is there; 'excel' = the old workbook)
-- docfit_fasting   the generated fasting document (tools/fasting_from_excel.py), one row - the fasting page reads it
-- docfit_history   every former version of every row above (written by the trigger only, read-only for Doc)
--
-- Sync rules the clients rely on:
-- - The key of a row is its moment (ms, like the app) plus the account, so every upload is an upsert
--   (?on_conflict=user_id,measured_at with Prefer: resolution=merge-duplicates) and sending twice never hurts.
-- - Clients never hard-delete: a delete sets deleted_at (so it reaches the other device), undo sets it back to null.
-- - updated_at is always the server's clock (trigger), the pull cursor of the clients; a write that changes nothing
--   keeps the old updated_at and leaves no history row, so re-sending a whole list is a true no-op.
--
-- Apply: SQL editor (Doc). Idempotent (safe to re-run). Grants written out (rule for new tables since 30.10.2026).

begin;

create table if not exists public.docfit_profile (
  user_id     uuid        not null default auth.uid(),
  person      smallint    not null check (person between 0 and 9),     -- 0 = Doc, 1 = the second person
  name        text        check (length(btrim(name)) between 1 and 40), -- null = Doc
  height_cm   smallint    check (height_cm between 100 and 250),
  birth_year  smallint    check (birth_year between 1900 and 2100),
  sex         text        check (sex in ('m', 'w')),
  active      boolean     not null default true,                        -- the app's "Personen" switch
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, person)
);

create table if not exists public.docfit_weighing (
  user_id     uuid        not null default auth.uid(),
  measured_at timestamptz not null,                                     -- the app's Weighing.time (ms)
  person      smallint    not null default 0 check (person between 0 and 9),
  centi_kg    integer     not null check (centi_kg between 2000 and 30000),   -- 10 g units
  ohm         integer     not null default 0
              check (ohm = 0 or ohm between 150 and 1500),              -- 0 = no fat measured (65535 is sent as 0)
  waist_mm    integer     check (waist_mm between 500 and 2000),        -- typed in by hand, null = none
  hip_mm      integer     check (hip_mm between 500 and 2000),
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, measured_at)
);

create table if not exists public.docfit_run (
  user_id     uuid        not null default auth.uid(),
  started_at  timestamptz not null,                                     -- the app's Entry.start (ms)
  duration_ms integer     not null check (duration_ms between 0 and 86400000),
  kind        text        not null default '' check (length(kind) <= 30),   -- 'Planks', 'Two Balls', '' = from before
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, started_at)
);

create table if not exists public.docfit_bp (
  user_id     uuid        not null default auth.uid(),
  measured_at timestamptz not null,
  person      smallint    not null default 0 check (person between 0 and 9),
  sys         smallint    not null check (sys between 50 and 260),
  dia         smallint    not null check (dia between 30 and 160),
  pulse       smallint    check (pulse between 25 and 220),
  irregular   boolean,                                                  -- the monitor's irregular-heartbeat flag
  source      text        not null default 'omron' check (source in ('omron', 'excel')),
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, measured_at)
);

create table if not exists public.docfit_fasting (
  user_id     uuid        primary key default auth.uid(),
  data        jsonb       not null check (pg_column_size(data) < 4000000),   -- window.FASTING_DATA as generated
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now()
);

create table if not exists public.docfit_history (
  hist_id     bigint generated always as identity primary key,
  tab         text        not null,
  op          text        not null,
  changed_at  timestamptz not null default now(),
  row_data    jsonb       not null
);
alter table public.docfit_history enable row level security;
revoke all on public.docfit_history from anon;
grant select on public.docfit_history to authenticated;
grant select, insert, update, delete on public.docfit_history to service_role;
drop policy if exists docfit_history_doc_read on public.docfit_history;
create policy docfit_history_doc_read on public.docfit_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- the server's clock on every write and the former version into the history; a write that changes nothing stays
-- a no-op (old updated_at, no history row)
create or replace function public.docfit_touch() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'UPDATE' and (to_jsonb(new) - 'updated_at') = (to_jsonb(old) - 'updated_at') then
    new.updated_at := old.updated_at;
    return new;
  end if;
  if tg_op <> 'INSERT' then
    insert into public.docfit_history (tab, op, row_data) values (tg_table_name, tg_op, to_jsonb(old));
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.updated_at := clock_timestamp();
  return new;
end $$;
revoke all on function public.docfit_touch() from public, anon, authenticated;

-- the same rules for every data table: RLS pinned to Doc, grants, pull index, trigger
do $$
declare
  t   text;
  doc constant text := '2889073e-cbb8-4ca1-ad48-5234abe40585';
begin
  foreach t in array array['docfit_profile', 'docfit_weighing', 'docfit_run', 'docfit_bp', 'docfit_fasting'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
    execute format('drop policy if exists %I on public.%I', t || '_doc_all', t);
    execute format('create policy %I on public.%I for all to authenticated '
                   'using (user_id = auth.uid() and auth.uid() = %L::uuid) '
                   'with check (user_id = auth.uid() and auth.uid() = %L::uuid)',
                   t || '_doc_all', t, doc, doc);
    execute format('create index if not exists %I on public.%I (user_id, updated_at)', t || '_pull', t);
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format('create trigger %I before insert or update or delete on public.%I '
                   'for each row execute function public.docfit_touch()', t || '_touch', t);
  end loop;
end $$;

commit;

-- control: every docfit table with RLS on and its policy (expected: 6 rows, relrowsecurity true everywhere)
select c.relname, c.relrowsecurity, p.policyname, p.cmd
from pg_class c left join pg_policies p on p.tablename = c.relname and p.schemaname = 'public'
where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and c.relname like 'docfit%'
order by 1;
