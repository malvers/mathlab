-- Vorrechnen, Wiederholung (Doc, 01.10.2026: "rechts ein x", then "Ja"): the x takes a task off the list.
-- Nothing is deleted: each of the task's rows gets erledigt = the moment of the x. Every question pressed
-- up to the latest erledigt of its task is done with; a newer one brings the task back.
-- The policy "eigenes feedback" (ALL, user_id = auth.uid()) already lets the teacher patch her rows; the
-- upsert of js/vorrechnen-klasse.js names its columns, so it never writes erledigt back to null.
alter table public.vorrechnen_feedback add column if not exists erledigt timestamptz;
