-- DocFit, part 4 (21.11.2026): FASTENMODUS - live fasts (Doc, 21.11.2026). A fast is a time range per person
-- [started_at, ended_at | open] with the planned days and a note; every weigh-in, blood pressure and glucose reading
-- inside the range belongs to it (nothing is tagged). The app keeps them in Fasts.java (preferences "fasts" /
-- "fasts2"), the web in the same table.
--
-- docfit_fasting (part 1) stays what it is: ONE generated document with the historic fasts 2021-2024 from Doc's
-- workbook (tools/fasting_from_excel.py). Live fasts are records that change while they run (started, ended, the
-- planned days changed), so they get rows of their own:
-- docfit_fast   keyed by account + the app's id of the fast (text, so a number or a uuid both fit) - the start can be
--               corrected without the fast changing its identity.
--
-- Same rules as part 1 (20261121_docfit.sql): upsert on_conflict = user_id,fast_id; RLS pinned to Doc's uid; a delete
-- is a tombstone (deleted_at); updated_at is the server's clock; every former version goes to docfit_history (trigger
-- docfit_touch from part 1).
--
-- Apply: SQL editor (Doc). Additive and idempotent (safe to re-run). Needs part 1 (20261121_docfit.sql).

begin;

create table if not exists public.docfit_fast (
  user_id       uuid        not null default auth.uid(),
  fast_id       text        not null check (length(fast_id) between 1 and 64),   -- the app's id of the fast
  person        smallint    not null default 0 check (person between 0 and 9),   -- 0 = Doc, 1 = the second person
  started_at    timestamptz not null,
  ended_at      timestamptz,                                                     -- null = still running
  planned_days  smallint    check (planned_days between 1 and 90),
  note          text        check (note is null or length(note) <= 200),
  deleted_at    timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, fast_id),
  check (ended_at is null or ended_at >= started_at)
);

alter table public.docfit_fast enable row level security;
revoke all on public.docfit_fast from anon;
grant select, insert, update, delete on public.docfit_fast to authenticated;
grant select, insert, update, delete on public.docfit_fast to service_role;

drop policy if exists docfit_fast_doc_all on public.docfit_fast;
create policy docfit_fast_doc_all on public.docfit_fast for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create index if not exists docfit_fast_pull on public.docfit_fast (user_id, updated_at);

drop trigger if exists docfit_fast_touch on public.docfit_fast;
create trigger docfit_fast_touch before insert or update or delete on public.docfit_fast
  for each row execute function public.docfit_touch();

commit;

-- control: RLS on, the policy, the trigger (expected: true, docfit_fast_doc_all, docfit_fast_touch)
select c.relrowsecurity, p.policyname,
       (select string_agg(t.tgname, ',') from pg_trigger t where t.tgrelid = c.oid and not t.tgisinternal) as triggers
from pg_class c left join pg_policies p on p.tablename = c.relname and p.schemaname = 'public'
where c.oid = 'public.docfit_fast'::regclass;
