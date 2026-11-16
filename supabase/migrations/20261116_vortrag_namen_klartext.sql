-- Talk names in plain text for everybody - no login, no key, the pupils themselves included (Doc, 09.11.2026:
-- "Alle Namen sollen von allen gesehen werden koennen, wer welche Vortraege haelt"; 16.11.2026: "die sollen die
-- Kinder auch sehen, die sollen ueberhaupt nie mehr versteckt sein"). Replaces 20261109_vortrag_namen_klartext.sql,
-- which was written but never run (the column `name` did not exist on 12.11. and 16.11.).
--
-- Until now svp_vortrag_namen held only the sealed name (name_enc, readable with Doc's key alone), so everybody
-- without the key saw "vergeben". New column `name`: plain text, anon may read it and write it under exactly the
-- rules that already hold today (RLS "vt namen anon update": a free slot, or within ten minutes of the last
-- change; no INSERT grant for anon, so anon still cannot invent rows). Unchanged: name_enc stays unreadable for
-- anon, the marks (svp_vortrag_bewertung, svp_plan_edits) are not touched at all.
-- The new vortraege.js writes `name` and sets name_enc to null; old entries get their plain text from Doc's
-- browser, logged in + unlocked (vortraege.js backfillNames). The old page keeps working against this schema.
--
-- Checked against the live schema on 16.11.2026 (read-only): columns plan, klasse, idx, slot, taken, name_enc, ts;
-- anon column grants select (plan, klasse, idx, slot, taken, ts) and update (taken, name_enc, ts); authenticated
-- table grants; triggers svp_vortrag_namen_archive (before update/delete) and svp_vortrag_namen_touch (before
-- update, ts := now()); history table without `name`; 236 sealed names, plain text 1 to 19 bytes.
--
-- Run once in the Supabase SQL editor. The last select must show three rows, each with ok = true.

begin;

alter table public.svp_vortrag_namen add column if not exists name text;

alter table public.svp_vortrag_namen drop constraint if exists svp_vortrag_namen_name_len;
alter table public.svp_vortrag_namen add constraint svp_vortrag_namen_name_len
  check (name is null or char_length(name) between 1 and 80);

-- anon works with column grants - add the new column to both. authenticated holds table-wide grants, which cover
-- a new column on their own; RLS keeps that to Doc's account ("vt namen doc all").
grant select (name), update (name) on public.svp_vortrag_namen to anon;

-- The archive keeps every old version, the plain name included (Doc reads it, nobody else: "vt hist doc read").
alter table public.svp_vortrag_namen_history add column if not exists name text;

create or replace function public.svp_vortrag_namen_archive() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.svp_vortrag_namen_history(plan, klasse, idx, slot, taken, name_enc, name, ts, op)
  values (old.plan, old.klasse, old.idx, old.slot, old.taken, old.name_enc, old.name, old.ts, lower(tg_op));
  return coalesce(new, old);
end $$;

-- Server time on every change, as before, with three additions:
-- (1) a free slot never carries a name - also when a page loaded before this change clears a slot without
--     sending the column (the next pupil would otherwise inherit the old name);
-- (2) a page loaded before this change re-seals a name without sending `name`: the plain text would then tell
--     an older story, so it goes (Doc's unlocked browser publishes the new one);
-- (3) publishing the plain text of an existing sealed entry (the backfill: only `name` goes from null to a value,
--     taken and name_enc stay) keeps the entry's time - otherwise every old entry would be open to anonymous
--     changes for ten minutes after Doc opens a talk page.
create or replace function public.svp_vortrag_namen_touch() returns trigger
language plpgsql as $$
begin
  if not new.taken then
    new.name := null;
    new.name_enc := null;
  end if;
  if new.name_enc is not null and new.name_enc is distinct from old.name_enc
     and new.name is not distinct from old.name then
    new.name := null;
  end if;
  if old.taken and new.taken and old.name is null and new.name is not null
     and old.name_enc is not null and new.name_enc is not distinct from old.name_enc then
    new.ts := old.ts;
  else
    new.ts := now();
  end if;
  return new;
end $$;

commit;

-- let the Data API see the new column right away
notify pgrst, 'reload schema';

-- check: three rows, each ok = true
select 'column name' as was,
       (select count(*) from information_schema.columns where table_schema = 'public'
          and table_name in ('svp_vortrag_namen', 'svp_vortrag_namen_history') and column_name = 'name') = 2 as ok
union all
select 'anon reads + writes name, never name_enc',
       has_column_privilege('anon', 'public.svp_vortrag_namen', 'name', 'SELECT')
       and has_column_privilege('anon', 'public.svp_vortrag_namen', 'name', 'UPDATE')
       and not has_column_privilege('anon', 'public.svp_vortrag_namen', 'name_enc', 'SELECT')
       and not has_table_privilege('anon', 'public.svp_vortrag_namen', 'INSERT')
union all
select 'triggers know name',
       exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
               where n.nspname = 'public' and p.proname = 'svp_vortrag_namen_archive'
                 and pg_get_functiondef(p.oid) like '%old.name,%')
       and exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
               where n.nspname = 'public' and p.proname = 'svp_vortrag_namen_touch'
                 and pg_get_functiondef(p.oid) like '%new.name := null%');

-- later, after Doc opened one talk list logged in + unlocked (the agents can run this read-only):
--   select count(*) filter (where taken) as belegt,
--          count(*) filter (where taken and name is not null) as klartext,
--          count(*) filter (where taken and name is null) as noch_verschluesselt
--   from public.svp_vortrag_namen;
-- expected: noch_verschluesselt = 0, klartext = belegt (236 on 16.11.2026, plus whatever came since).
