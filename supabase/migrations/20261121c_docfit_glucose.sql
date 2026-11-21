-- DocFit, part 3 (21.11.2026): blood glucose typed in by hand (Doc, 21.11.2026; the app's 5th tab, Glucoses.java),
-- per person, with a context and a note. Stored in ONE unit, mg/dL as a whole number (the app's and the web's canonical
-- value; mmol/L is shown from it: mg/dL / 18.016), so a value never drifts between phone and web. The context is the
-- app's stable key - 'fasting', 'before_meal', 'after_meal_2h', 'other' (the German words only in the UI); kept as
-- free text, so a new context needs no DDL.
--
-- Same rules as part 1 (20261121_docfit.sql): keyed by account + moment (upsert on_conflict = user_id,measured_at),
-- RLS pinned to Doc's uid, a delete is a tombstone (deleted_at), updated_at is the server's clock, every former version
-- goes to docfit_history (trigger docfit_touch from part 1).
--
-- Apply: SQL editor (Doc). Additive and idempotent (safe to re-run). Needs part 1 (20261121_docfit.sql).

begin;

create table if not exists public.docfit_glucose (
  user_id     uuid        not null default auth.uid(),
  measured_at timestamptz not null,                                       -- the app's moment (ms)
  person      smallint    not null default 0 check (person between 0 and 9),   -- 0 = Doc, 1 = the second person
  mg_dl       smallint    not null check (mg_dl between 10 and 800),       -- canonical value, mg/dL (app: 18-630)
  context     text        not null default 'other' check (length(context) <= 40),   -- the app's key, see above
  source      text        not null default 'hand' check (source in ('hand', 'meter', 'excel')),
  note        text        check (note is null or length(note) <= 200),
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, measured_at)
);

alter table public.docfit_glucose enable row level security;
revoke all on public.docfit_glucose from anon;
grant select, insert, update, delete on public.docfit_glucose to authenticated;
grant select, insert, update, delete on public.docfit_glucose to service_role;

drop policy if exists docfit_glucose_doc_all on public.docfit_glucose;
create policy docfit_glucose_doc_all on public.docfit_glucose for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create index if not exists docfit_glucose_pull on public.docfit_glucose (user_id, updated_at);

drop trigger if exists docfit_glucose_touch on public.docfit_glucose;
create trigger docfit_glucose_touch before insert or update or delete on public.docfit_glucose
  for each row execute function public.docfit_touch();

commit;

-- control: RLS on, the policy, the trigger (expected: true, docfit_glucose_doc_all, docfit_glucose_touch)
select c.relrowsecurity, p.policyname,
       (select string_agg(t.tgname, ',') from pg_trigger t where t.tgrelid = c.oid and not t.tgisinternal) as triggers
from pg_class c left join pg_policies p on p.tablename = c.relname and p.schemaname = 'public'
where c.oid = 'public.docfit_glucose'::regclass;
