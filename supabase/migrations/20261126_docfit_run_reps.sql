-- DocFit, part 5 (26.11.2026): counted exercises. Dumbbells and Legs count repetitions instead of time (Doc: "Bei
-- Dumbbells und Legs müssen wir Repeats zählen. Nicht die Zeit." - "Klar brauchen wir auch das Gewicht."). Such a row
-- of docfit_run is one set: duration_ms 0, reps = the repetitions, weight_kg = the weight (for dumbbells the weight of
-- ONE dumbbell; null = without weight), move = the kind of movement exactly as the app names it ('Curls',
-- 'Lateral Raises'; null = none). Timed rows keep all three null. The app: Entries.java, SyncRows.java.
--
-- Apply: SQL editor (Doc) or MCP. Additive and idempotent (safe to re-run): only new nullable columns, nothing dropped
-- or changed, existing rows untouched. Needs part 1 (20261121_docfit.sql).

begin;

alter table public.docfit_run add column if not exists reps      integer      check (reps between 0 and 1000);
alter table public.docfit_run add column if not exists weight_kg numeric(5,2) check (weight_kg between 0 and 300);
alter table public.docfit_run add column if not exists move      text         check (length(move) <= 30);

commit;

-- control: the columns of docfit_run (expected: reps integer, weight_kg numeric, move text - all nullable)
select column_name, data_type, numeric_precision, numeric_scale, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'docfit_run'
order by ordinal_position;
