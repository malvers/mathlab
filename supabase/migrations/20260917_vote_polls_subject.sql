-- vote: the "Fach / Klasse" picker of the host page (since 27.08.2026) writes vote_polls.subject - the column was
-- never created, so every round went out without it (the page fell back silently, Doc 17.09.2026). One of the
-- names in COURSES of vote.html ('MA BGY 11', 'FOS 12', ...), or null.
-- The nine rounds before this date were filled in once by hand from the published timetable (not repeated here).
-- Additive + reversible: alter table public.vote_polls drop column subject. Idempotent.

alter table public.vote_polls add column if not exists subject text;
