-- Doc's to-do list gets priorities and a manual order (05.11.2026): three priorities, priority 1 on top;
-- within a priority Doc drags the items up and down.
--   prio  1, 2 or 3 - existing items start in 2
--   pos   order inside a priority, smaller = higher up; existing items keep their order (newest first)
-- The history trigger is switched off while the existing rows get their pos, so that step does not
-- write a history row for every item.
--
-- Apply: SQL editor or management API. Idempotent (safe to re-run).

begin;

alter table public.todo add column if not exists prio smallint not null default 2;
alter table public.todo add column if not exists pos double precision;

alter table public.todo disable trigger todo_history_trg;
update public.todo set pos = -extract(epoch from created_at) where pos is null;
alter table public.todo enable trigger todo_history_trg;

-- an item written without pos (e.g. by an older copy of the app) lands on top of its priority
alter table public.todo alter column pos set default (-extract(epoch from now()))::double precision;
alter table public.todo alter column pos set not null;

alter table public.todo drop constraint if exists todo_prio_range;
alter table public.todo add constraint todo_prio_range check (prio between 1 and 3);

commit;

notify pgrst, 'reload schema';

-- control
select prio, count(*) as items, min(pos) as top_pos, max(pos) as bottom_pos
from public.todo group by prio order by prio;
