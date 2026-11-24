-- Doc's calendar, part 10: the lesson colour as one more appointment colour (24.11.2026, Doc: "Kannst du in die
-- Farbpalette von den Terminen auch die Stundenfarbe mit reinpacken"). He had entered the Wednesday IA block as an
-- appointment of his own, and it came out in an appointment colour instead of looking like the lessons around it.
--
--   1 = Υ red   2 = λ gold (default)   3 = φ green   4 = blue   5 = violet   6 = orange   7 = pink
--   8 = the lesson colour ("Stundenfarbe"): the page draws the row exactly like the timetable's lessons
--       (calendar_lesson), in the scheme's tint - so unlike 1-7 it follows Blau / Hell / Grau
--
-- Changed: only the check on calendar_event.color (1-8 instead of 1-7, part 7 named it calendar_event_color_check), so
-- the page's own save path (PostgREST, Doc's login) can store colour 8.
-- Unchanged: every existing row, the default 2, calendar_add (the agents' write path, eintragen.mjs, still takes 1-7),
-- the guest's functions (they never carry Doc's colours), the feed mirror, the history.
--
-- Apply: SQL editor. Idempotent (safe to re-run).

begin;

alter table public.calendar_event drop constraint if exists calendar_event_color_check;
alter table public.calendar_event
  add constraint calendar_event_color_check check (color between 1 and 8);

commit;

-- control: one row - the check now says 8
select c.conname as name, pg_get_constraintdef(c.oid) as definition
from pg_constraint c
where c.conrelid = 'public.calendar_event'::regclass and c.contype = 'c' and pg_get_constraintdef(c.oid) ilike '%color%';
