-- Buzzer: the "Euphorie" button (Doc, 11.11.2026: "ganz oben einen Button ... I feel happy ... Euphoria ... wenn das
-- gedrückt wird ... bei mir ... wenn ich gerade am Präsentieren bin, ein kleines Feuerwerk, so ein Mini-Feuerwerk").
-- A tap is one row in buzzer_tempo with art = 'jubel' - the table the phones already write "zu schnell" / "zu langsam"
-- into: same code, same day, the same brake (40 a minute per code), realtime already on, readable for a day.
-- Only the check of art widens; the teacher's side counts schnell and langsam by name, so a 'jubel' row changes nothing
-- there until the presenter listens for it.
alter table public.buzzer_tempo drop constraint if exists buzzer_tempo_art_check;
alter table public.buzzer_tempo add constraint buzzer_tempo_art_check check (art in ('schnell', 'langsam', 'jubel'));

-- check: the new list
select conname, pg_get_constraintdef(oid) as def
from pg_constraint
where conrelid = 'public.buzzer_tempo'::regclass and conname = 'buzzer_tempo_art_check';
