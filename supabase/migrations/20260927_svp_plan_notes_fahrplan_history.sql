-- Doc, 27.09.2026: "Das darf nie passieren. Dann stehe ich am Montag im Unterricht und alles ist weg." -
-- a plan tab open since the morning saved its old state over a pill added at noon (whole row, last write wins).
-- svp_plan_edits has kept every former row since before (svp_plan_edits_archive); the notes and the Fahrplan of
-- the lessons are written the same way and had no such net. Now they do: before every update or delete the old
-- row goes into <table>_history (RLS on, no policy - read only through the management API, for a restore).
-- Applied 27.09.2026 ~15:35 through the management API; tested with a no-op update (one history row each).

create table if not exists public.svp_plan_notes_history (
  hid bigint generated always as identity primary key, page text, notes jsonb, ts timestamptz, op text,
  saved_at timestamptz not null default now());
alter table public.svp_plan_notes_history enable row level security;
create or replace function public.svp_plan_notes_archive() returns trigger language plpgsql security definer
  set search_path to 'public' as $f$
begin
  insert into public.svp_plan_notes_history(page, notes, ts, op) values (old.page, old.notes, old.ts, lower(tg_op));
  return coalesce(new, old);
end $f$;
drop trigger if exists svp_plan_notes_archive on public.svp_plan_notes;
create trigger svp_plan_notes_archive before update or delete on public.svp_plan_notes
  for each row execute function public.svp_plan_notes_archive();

create table if not exists public.svp_plan_fahrplan_history (
  hid bigint generated always as identity primary key, page text, fahrplan jsonb, ts timestamptz, op text,
  saved_at timestamptz not null default now());
alter table public.svp_plan_fahrplan_history enable row level security;
create or replace function public.svp_plan_fahrplan_archive() returns trigger language plpgsql security definer
  set search_path to 'public' as $f$
begin
  insert into public.svp_plan_fahrplan_history(page, fahrplan, ts, op) values (old.page, old.fahrplan, old.ts, lower(tg_op));
  return coalesce(new, old);
end $f$;
drop trigger if exists svp_plan_fahrplan_archive on public.svp_plan_fahrplan;
create trigger svp_plan_fahrplan_archive before update or delete on public.svp_plan_fahrplan
  for each row execute function public.svp_plan_fahrplan_archive();
