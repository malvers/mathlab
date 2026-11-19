-- Doc's to-do list gets a Wiedervorlage (resubmission, 19.11.2026): an item put on WV waits until its date in a
-- collapsed group of its own and comes back on that day on top of Prio 1.
--   wv_date  the day the item comes back (local date), null = a plain item
-- The app stores a WV item as prio 1 with a pos far above every other one (-1e12 + days since 1970), so everyone
-- reading "where done = false order by prio, pos" gets the due ones first. Items still waiting are the ones with
-- wv_date > current_date - a reader that should leave them out adds: and (wv_date is null or wv_date <= current_date)
-- A nullable column without default: no table rewrite, existing rows stay as they are (null), the history trigger
-- does not fire, the table grants and the row-level security of public.todo cover the new column as well.
--
-- Apply: SQL editor or management API. Idempotent (safe to re-run).

begin;

alter table public.todo add column if not exists wv_date date;

commit;

notify pgrst, 'reload schema';

-- control: one row "wv_date | date | YES"
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'todo' and column_name = 'wv_date';
