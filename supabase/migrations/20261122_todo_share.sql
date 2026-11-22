-- Doc's to-do list, shared with one guest (22.11.2026). Doc: "die To-Do-Liste bitte so machen, dass sie auch [der Gast]
-- bedienen kann. Also vollen Zugriff auf meine Wünsche und sie kann ihre eigenen eintragen, aber die müssen natürlich
-- getrennt voneinander gehandelt werden."
-- The same design as the calendar's sharing (20261119_calendar_share.sql), without an account for the guest: a link
-- with a random token, shown once as a QR code (or sent as a link) in the to-do app's settings; only the token's SHA-256
-- is stored, a new code locks the old one, "Zugang sperren" removes it.
--
-- todo_share        one row per guest: a label (only in the database, never in the repo) and the SHA-256 of the
--                   current token (null = access locked). Doc's account only.
-- todo              + shared_by  (the share whose guest added the item to Doc's list - the app marks it in the guest's
--                                 turquoise; such rows belong to Doc's uid like all of his items)
-- todo_guest        the guest's OWN list, kept apart from Doc's: same columns as todo (text, done, prio, pos, wv_date ...)
--                   + share_id. Rows carry Doc's uid, so his account may read them should his app ever show them;
--                   the morning briefing, the mail button and everything else reading public.todo never see them.
-- todo_history      + source ('todo' or 'todo_guest'): every former version of both lists is kept, as before.
--
-- For the guest's page (the token is the guard; without a matching one: 42501 "link no longer valid"):
-- todo_shared_rows(token)                    { share: { label }, doc: [...], own: [...] } - each list: open items by
--                                            prio, pos, then the last 100 checked ones (as the app loads them)
-- todo_shared_save(token, list, id, item)    list 'doc' = Doc's items, 'own' = the guest's; id null = a new item.
--                                            item: any of text, done, prio, pos, wv_date (done_at is accepted and
--                                            ignored - the database stamps it). At most 300 new items a day.
-- todo_shared_remove(token, list, ids)       deletes CHECKED items only (as the app offers it) - a leaked link can
--                                            never empty Doc's open list; the history keeps every deleted row anyway
--
-- Unchanged on purpose: todo's row-level security (Doc's uid only), its history trigger, the todo-mail function
-- (it reads public.todo with the caller's login - the guest has none, and the app hides the button for her).
-- New public tables get no Data API access by default since 30.10.2026 - the grants are part of this script.
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs 20261102_todo.sql, 20261105_todo_prio.sql, 20261119_todo_wv.sql.

begin;

-- ---------- the share ----------
create table if not exists public.todo_share (
  id            bigint generated always as identity primary key,
  user_id       uuid        not null default auth.uid(),
  label         text        not null check (length(btrim(label)) between 1 and 40),
  token_sha256  text        unique check (token_sha256 ~ '^[0-9a-f]{64}$'),   -- null = access locked
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.todo_share enable row level security;
revoke all on public.todo_share from anon;
grant select, insert, update, delete on public.todo_share to authenticated;
grant select, insert, update, delete on public.todo_share to service_role;

drop policy if exists todo_share_doc_all on public.todo_share;
create policy todo_share_doc_all on public.todo_share for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create or replace function public.todo_share_touch() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.todo_share_touch() from public, anon, authenticated;

drop trigger if exists todo_share_touch_trg on public.todo_share;
create trigger todo_share_touch_trg before update on public.todo_share
  for each row execute function public.todo_share_touch();

-- ---------- Doc's items: which guest added one ----------
-- nullable, no default: no table rewrite, the history trigger does not fire, todo's grants and policy cover it
alter table public.todo add column if not exists shared_by bigint
  references public.todo_share (id) on delete set null;
create index if not exists todo_shared_by on public.todo (shared_by) where shared_by is not null;

-- ---------- the guest's own list ----------
create table if not exists public.todo_guest (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null default auth.uid(),   -- Doc's uid (written by the functions below)
  share_id   bigint      not null references public.todo_share (id) on delete cascade,   -- history keeps the rows
  text       text        not null check (length(btrim(text)) > 0),
  done       boolean     not null default false,
  done_at    timestamptz,                                -- when it was checked, null while open
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  prio       smallint    not null default 2,
  pos        double precision not null default (-extract(epoch from now()))::double precision,
  wv_date    date,                                       -- Wiedervorlage, as in todo (20261119_todo_wv.sql)
  constraint todo_guest_prio_range check (prio between 1 and 3)
);
create index if not exists todo_guest_share_done on public.todo_guest (share_id, done);

alter table public.todo_guest enable row level security;
revoke all on public.todo_guest from anon;
grant select, insert, update, delete on public.todo_guest to authenticated;
grant select, insert, update, delete on public.todo_guest to service_role;

drop policy if exists todo_guest_doc_all on public.todo_guest;
create policy todo_guest_doc_all on public.todo_guest for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- ---------- history for both lists ----------
-- a constant default: no table rewrite; todo_keep_history (20261102_todo.sql) keeps writing 'todo'
alter table public.todo_history add column if not exists source text not null default 'todo';

create or replace function public.todo_guest_keep_history() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.todo_history (op, row_data, source) values (tg_op, to_jsonb(old), 'todo_guest');
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.todo_guest_keep_history() from public, anon, authenticated;

drop trigger if exists todo_guest_history_trg on public.todo_guest;
create trigger todo_guest_history_trg before update or delete on public.todo_guest
  for each row execute function public.todo_guest_keep_history();

-- ---------- internal helpers (no grant) ----------
-- the share that belongs to a token, or 42501
create or replace function public.todo_share_of(p_token text)
returns public.todo_share
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v public.todo_share;
begin
  if p_token is not null and length(p_token) between 20 and 200 then
    select * into v from public.todo_share s
      where s.token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
        and s.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid;
  end if;
  if v.id is null then
    raise exception 'link no longer valid' using errcode = '42501';
  end if;
  return v;
end $$;
revoke all on function public.todo_share_of(text) from public, anon, authenticated;

-- one item as the app reads it (the columns of its PostgREST select)
create or replace function public.todo_item_json(t public.todo) returns jsonb
language sql immutable set search_path = public, pg_temp as $$
  select jsonb_build_object('id', t.id, 'text', t.text, 'done', t.done, 'done_at', t.done_at, 'created_at', t.created_at,
                            'prio', t.prio, 'pos', t.pos, 'wv_date', t.wv_date, 'shared_by', t.shared_by)
$$;
revoke all on function public.todo_item_json(public.todo) from public, anon, authenticated;

create or replace function public.todo_guest_item_json(t public.todo_guest) returns jsonb
language sql immutable set search_path = public, pg_temp as $$
  select jsonb_build_object('id', t.id, 'text', t.text, 'done', t.done, 'done_at', t.done_at, 'created_at', t.created_at,
                            'prio', t.prio, 'pos', t.pos, 'wv_date', t.wv_date)
$$;
revoke all on function public.todo_guest_item_json(public.todo_guest) from public, anon, authenticated;

-- ---------- the guest's page ----------
-- both lists at once: open items by prio, pos; then the last 100 checked ones, last checked first
create or replace function public.todo_shared_rows(p_token text)
returns jsonb
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v     public.todo_share;
  v_doc jsonb;
  v_own jsonb;
begin
  v := public.todo_share_of(p_token);

  select coalesce((select jsonb_agg(public.todo_item_json(t) order by t.prio, t.pos, t.id)
                     from public.todo t
                    where t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and not t.done), '[]'::jsonb)
      || coalesce((select jsonb_agg(public.todo_item_json(d) order by d.done_at desc, d.id desc)
                     from (select * from public.todo t
                            where t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and t.done
                            order by t.done_at desc, t.id desc limit 100) d), '[]'::jsonb)
    into v_doc;

  select coalesce((select jsonb_agg(public.todo_guest_item_json(t) order by t.prio, t.pos, t.id)
                     from public.todo_guest t
                    where t.share_id = v.id and not t.done), '[]'::jsonb)
      || coalesce((select jsonb_agg(public.todo_guest_item_json(d) order by d.done_at desc, d.id desc)
                     from (select * from public.todo_guest t
                            where t.share_id = v.id and t.done
                            order by t.done_at desc, t.id desc limit 100) d), '[]'::jsonb)
    into v_own;

  return jsonb_build_object('share', jsonb_build_object('id', v.id, 'label', v.label), 'doc', v_doc, 'own', v_own);
end $$;
revoke all on function public.todo_shared_rows(text) from public;
grant execute on function public.todo_shared_rows(text) to anon, authenticated, service_role;

-- p_list 'doc' (Doc's items) or 'own' (the guest's); p_id null = a new item (text required, prio 2 and on top of its
-- priority unless given); otherwise only the keys given change. Keys: text, done, done_at (ignored: checking stamps
-- now(), unchecking clears it), prio (1-3), pos (number), wv_date ('YYYY-MM-DD' or null). Any other key is refused, so
-- a misspelt one is never lost silently. Returns the saved item, or null when the id is not (any more) in that list.
create or replace function public.todo_shared_save(p_token text, p_list text, p_id bigint, p_item jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v      public.todo_share;
  v_key  text;
  v_text text;
  v_prio smallint;
  v_pos  double precision;
  v_wv   date;
  v_done boolean;
  r      public.todo;
  g      public.todo_guest;
begin
  v := public.todo_share_of(p_token);
  if p_list is null or p_list not in ('doc', 'own') then
    raise exception 'p_list must be doc or own' using errcode = '22023';
  end if;
  if jsonb_typeof(p_item) is distinct from 'object' then
    raise exception 'p_item: one object expected' using errcode = '22023';
  end if;
  select k.jkey into v_key from jsonb_object_keys(p_item) as k(jkey)
    where k.jkey not in ('text', 'done', 'done_at', 'prio', 'pos', 'wv_date')
    limit 1;
  if v_key is not null then
    raise exception 'unknown key "%"', v_key using errcode = '22023';
  end if;

  if p_item ? 'text' then
    if jsonb_typeof(p_item -> 'text') is distinct from 'string' or btrim(p_item ->> 'text') = '' then
      raise exception 'text must not be empty' using errcode = '22023';
    end if;
    v_text := btrim(p_item ->> 'text');
    if length(v_text) > 2000 then
      raise exception 'text longer than 2000 characters' using errcode = '22023';
    end if;
  end if;
  if p_item ? 'prio' then
    if jsonb_typeof(p_item -> 'prio') is distinct from 'number' or (p_item ->> 'prio') not in ('1', '2', '3') then
      raise exception 'prio must be 1, 2 or 3' using errcode = '22023';
    end if;
    v_prio := (p_item ->> 'prio')::smallint;
  end if;
  if p_item ? 'pos' then
    if jsonb_typeof(p_item -> 'pos') is distinct from 'number' then
      raise exception 'pos must be a number' using errcode = '22023';
    end if;
    v_pos := (p_item ->> 'pos')::double precision;
  end if;
  if p_item ? 'wv_date' and jsonb_typeof(p_item -> 'wv_date') <> 'null' then
    if jsonb_typeof(p_item -> 'wv_date') <> 'string' or (p_item ->> 'wv_date') !~ '^\d{4}-\d{2}-\d{2}$' then
      raise exception 'wv_date must be YYYY-MM-DD or null' using errcode = '22023';
    end if;
    v_wv := (p_item ->> 'wv_date')::date;
  end if;
  if p_item ? 'done' then
    if jsonb_typeof(p_item -> 'done') is distinct from 'boolean' then
      raise exception 'done must be true or false' using errcode = '22023';
    end if;
    v_done := (p_item ->> 'done')::boolean;
  end if;

  if p_id is null then
    if v_text is null then
      raise exception 'text is required' using errcode = '22023';
    end if;
    -- a leaked link must not flood the lists: at most 300 new items in 24 hours, both lists together
    if (select count(*) from public.todo t where t.shared_by = v.id and t.created_at > now() - interval '24 hours')
       + (select count(*) from public.todo_guest t where t.share_id = v.id and t.created_at > now() - interval '24 hours')
       >= 300 then
      raise exception 'too many new items today' using errcode = '54000';
    end if;
    if p_list = 'doc' then
      insert into public.todo (user_id, text, done, done_at, prio, pos, wv_date, shared_by)
      values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_text, coalesce(v_done, false),
              case when v_done then now() end, coalesce(v_prio, 2),
              coalesce(v_pos, -extract(epoch from now())), v_wv, v.id)
      returning * into r;
      return public.todo_item_json(r);
    end if;
    insert into public.todo_guest (user_id, share_id, text, done, done_at, prio, pos, wv_date)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v.id, v_text, coalesce(v_done, false),
            case when v_done then now() end, coalesce(v_prio, 2),
            coalesce(v_pos, -extract(epoch from now())), v_wv)
    returning * into g;
    return public.todo_guest_item_json(g);
  end if;

  if p_item = '{}'::jsonb then
    raise exception 'nothing to change' using errcode = '22023';
  end if;
  if p_list = 'doc' then
    update public.todo t
       set text    = coalesce(v_text, t.text),
           prio    = case when p_item ? 'prio' then v_prio else t.prio end,
           pos     = case when p_item ? 'pos' then v_pos else t.pos end,
           wv_date = case when p_item ? 'wv_date' then v_wv else t.wv_date end,
           done    = case when p_item ? 'done' then v_done else t.done end,
           done_at = case when not p_item ? 'done' then t.done_at
                          when v_done then coalesce(case when t.done then t.done_at end, now()) end
     where t.id = p_id and t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
    returning * into r;
    if not found then
      return null;
    end if;
    return public.todo_item_json(r);
  end if;
  update public.todo_guest t
     set text    = coalesce(v_text, t.text),
         prio    = case when p_item ? 'prio' then v_prio else t.prio end,
         pos     = case when p_item ? 'pos' then v_pos else t.pos end,
         wv_date = case when p_item ? 'wv_date' then v_wv else t.wv_date end,
         done    = case when p_item ? 'done' then v_done else t.done end,
         done_at = case when not p_item ? 'done' then t.done_at
                        when v_done then coalesce(case when t.done then t.done_at end, now()) end
   where t.id = p_id and t.share_id = v.id
  returning * into g;
  if not found then
    return null;
  end if;
  return public.todo_guest_item_json(g);
end $$;
revoke all on function public.todo_shared_save(text, text, bigint, jsonb) from public;
grant execute on function public.todo_shared_save(text, text, bigint, jsonb) to anon, authenticated, service_role;

-- deletes checked items of one list (at most 500 ids); returns the ids that were deleted
create or replace function public.todo_shared_remove(p_token text, p_list text, p_ids bigint[])
returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v     public.todo_share;
  v_out jsonb;
begin
  v := public.todo_share_of(p_token);
  if p_list is null or p_list not in ('doc', 'own') then
    raise exception 'p_list must be doc or own' using errcode = '22023';
  end if;
  if p_ids is null or cardinality(p_ids) not between 1 and 500 then
    raise exception 'p_ids: 1 to 500 ids' using errcode = '22023';
  end if;
  if p_list = 'doc' then
    with d as (
      delete from public.todo t
       where t.id = any (p_ids) and t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and t.done
      returning t.id
    )
    select coalesce(jsonb_agg(d.id order by d.id), '[]'::jsonb) into v_out from d;
  else
    with d as (
      delete from public.todo_guest t
       where t.id = any (p_ids) and t.share_id = v.id and t.done
      returning t.id
    )
    select coalesce(jsonb_agg(d.id order by d.id), '[]'::jsonb) into v_out from d;
  end if;
  return v_out;
end $$;
revoke all on function public.todo_shared_remove(text, text, bigint[]) from public;
grant execute on function public.todo_shared_remove(text, text, bigint[]) to anon, authenticated, service_role;

commit;

notify pgrst, 'reload schema';

-- control (expected: todo_share and todo_guest with RLS, one policy each, not readable by anon; three functions
-- callable by anon (the token guards them), the four helpers not):
select c.relname, c.relrowsecurity as rls,
       (select count(*) from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) as policies,
       has_table_privilege('anon', c.oid, 'select') as anon_may_read
from pg_class c
where c.oid in ('public.todo_share'::regclass, 'public.todo_guest'::regclass)
order by c.relname;

select p.proname, p.prosecdef as security_definer, has_function_privilege('anon', p.oid, 'execute') as anon_may_call
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('todo_share_of', 'todo_item_json', 'todo_guest_item_json', 'todo_guest_keep_history',
                    'todo_shared_rows', 'todo_shared_save', 'todo_shared_remove')
order by p.proname;
