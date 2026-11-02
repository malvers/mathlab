-- Doc's to-do list (02.11.2026): one row per item, written by the phone app doc-todo.pages.dev and by
-- docalvers.de/todo/ on the Mac. For now only text + done; checked items move to the bottom of the list.
-- Only Doc's account may read or write. Anonymous sign-in is enabled on this project, so `authenticated`
-- alone would be everybody - pinned to Doc's uid like 20261004_grateful.sql.
-- Every former version of a row (update and delete) is kept in todo_history, so a stale tab or a slip
-- can never lose an item.
-- New public tables get no Data API access by default since 30.10.2026 - the grants are part of this script.
--
-- Apply: SQL editor or management API. Idempotent (safe to re-run).

begin;

create table if not exists public.todo (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null default auth.uid(),
  text       text        not null check (length(btrim(text)) > 0),
  done       boolean     not null default false,
  done_at    timestamptz,                                 -- when it was checked, null while open
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists todo_user_done on public.todo (user_id, done);

alter table public.todo enable row level security;
revoke all on public.todo from anon;
grant select, insert, update, delete on public.todo to authenticated;
grant select, insert, update, delete on public.todo to service_role;

drop policy if exists todo_doc_all on public.todo;
create policy todo_doc_all on public.todo for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- former versions, read-only for Doc; written by the trigger only
create table if not exists public.todo_history (
  hist_id    bigint generated always as identity primary key,
  op         text        not null,
  changed_at timestamptz not null default now(),
  row_data   jsonb       not null
);
alter table public.todo_history enable row level security;
revoke all on public.todo_history from anon;
grant select on public.todo_history to authenticated;
grant select, insert, update, delete on public.todo_history to service_role;

drop policy if exists todo_history_doc_read on public.todo_history;
create policy todo_history_doc_read on public.todo_history for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create or replace function public.todo_keep_history() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.todo_history (op, row_data) values (tg_op, to_jsonb(old));
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists todo_history_trg on public.todo;
create trigger todo_history_trg before update or delete on public.todo
  for each row execute function public.todo_keep_history();

commit;

-- control
select tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename like 'todo%' order by tablename;
