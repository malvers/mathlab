-- Doc's to-do list: moving an item between Doc's list and the guest's (22.11.2026). Doc: "Wenn ich ein Item selektiere und
-- auf [den Gast] drücke, soll das Item zu [ihr] wechseln. Gleiches gilt für Doc. Aber nur wenn es selektiert ist."
-- The two lists are two tables (20261122_todo_share.sql), so a move is one transaction: the row is deleted from its old
-- list - the history trigger keeps it there (op DELETE), nothing is lost - and inserted into the other one with its text,
-- done, done_at, created_at, prio and wv_date; pos as given (the app puts it on top of its priority) or kept.
--
-- todo_move(from, id, pos)                  Doc's page, with his login (only his uid may call it)
-- todo_shared_move(token, from, id, pos)    the guest's page: the token guards it (42501 without a matching one); an
--                                           item the guest moves into Doc's list carries shared_by, as if she had added it
-- from: 'doc' (Doc's list -> the guest's) or 'own' (the guest's -> Doc's). Returns the item in its new list (the shape of
-- todo_shared_rows), or null when the id is not (any more) in the old list.
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs 20261122_todo_share.sql.

begin;

create or replace function public.todo_move(p_from text, p_id bigint, p_pos double precision default null)
returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_share bigint;
  r       public.todo;
  g       public.todo_guest;
begin
  if auth.uid() is distinct from '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if p_from is null or p_from not in ('doc', 'own') then
    raise exception 'p_from must be doc or own' using errcode = '22023';
  end if;
  if p_from = 'doc' then
    select s.id into v_share from public.todo_share s
      where s.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid order by s.id limit 1;
    if v_share is null then
      raise exception 'not shared with anyone' using errcode = '22023';
    end if;
    delete from public.todo t
     where t.id = p_id and t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
    returning * into r;
    if not found then
      return null;
    end if;
    insert into public.todo_guest (user_id, share_id, text, done, done_at, created_at, prio, pos, wv_date)
    values (r.user_id, v_share, r.text, r.done, r.done_at, r.created_at, r.prio, coalesce(p_pos, r.pos), r.wv_date)
    returning * into g;
    return public.todo_guest_item_json(g);
  end if;
  delete from public.todo_guest t
   where t.id = p_id and t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
  returning * into g;
  if not found then
    return null;
  end if;
  insert into public.todo (user_id, text, done, done_at, created_at, prio, pos, wv_date, shared_by)
  values (g.user_id, g.text, g.done, g.done_at, g.created_at, g.prio, coalesce(p_pos, g.pos), g.wv_date, null)
  returning * into r;
  return public.todo_item_json(r);
end $$;
revoke all on function public.todo_move(text, bigint, double precision) from public, anon;
grant execute on function public.todo_move(text, bigint, double precision) to authenticated, service_role;

create or replace function public.todo_shared_move(p_token text, p_from text, p_id bigint, p_pos double precision default null)
returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v public.todo_share;
  r public.todo;
  g public.todo_guest;
begin
  v := public.todo_share_of(p_token);
  if p_from is null or p_from not in ('doc', 'own') then
    raise exception 'p_from must be doc or own' using errcode = '22023';
  end if;
  if p_from = 'doc' then
    delete from public.todo t
     where t.id = p_id and t.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
    returning * into r;
    if not found then
      return null;
    end if;
    insert into public.todo_guest (user_id, share_id, text, done, done_at, created_at, prio, pos, wv_date)
    values (r.user_id, v.id, r.text, r.done, r.done_at, r.created_at, r.prio, coalesce(p_pos, r.pos), r.wv_date)
    returning * into g;
    return public.todo_guest_item_json(g);
  end if;
  delete from public.todo_guest t
   where t.id = p_id and t.share_id = v.id
  returning * into g;
  if not found then
    return null;
  end if;
  insert into public.todo (user_id, text, done, done_at, created_at, prio, pos, wv_date, shared_by)
  values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, g.text, g.done, g.done_at, g.created_at, g.prio,
          coalesce(p_pos, g.pos), g.wv_date, v.id)
  returning * into r;
  return public.todo_item_json(r);
end $$;
revoke all on function public.todo_shared_move(text, text, bigint, double precision) from public;
grant execute on function public.todo_shared_move(text, text, bigint, double precision) to anon, authenticated, service_role;

commit;

notify pgrst, 'reload schema';

-- control (expected: todo_move callable by authenticated, not by anon; todo_shared_move by both - the token guards it):
select p.proname, p.prosecdef as security_definer,
       has_function_privilege('anon', p.oid, 'execute') as anon_may_call,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_may_call
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('todo_move', 'todo_shared_move')
order by p.proname;
