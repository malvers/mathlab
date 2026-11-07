-- Doc's calendar, part 4: his Google and Outlook calendars, mirrored one way into his own calendar (07.11.2026, Doc:
-- "Ich möchte [Google] bitte dauerhaft verknüpfen. Vielleicht trägt mir irgendjemand anderes in den Kalender ein. …
-- Und dann müssten wir den Outlook-Kalender auch noch irgendwie mit verbinden.")
--
-- The reminder watcher on the Mac (tools/kalender/waechter.mjs + feeds.mjs) fetches each calendar's secret iCal address
-- (kept only in the Mac's keychain) every 15 minutes and writes what changed through calendar_add
-- (20261107_calendar_write.sql) with source_uid = 'google:<UID>' or 'outlook:<UID>'. To know what changed and what
-- disappeared it needs the rows it wrote before - these two functions give exactly that, and nothing more:
--
-- calendar_feed_rows(token, prefix, after)   Doc's appointments whose source_uid starts with 'google:' or 'outlook:',
--                                            500 at a time by id (the API hands out at most 1000 rows per call)
-- calendar_feed_remove(token, prefix, ids)   deletes such appointments - a row without that prefix (one Doc entered
--                                            himself, or one an agent entered) is never touched, whatever ids say
--
-- Token check as in calendar_poll (only the SHA-256 lives in calendar_poller). user_id is always Doc's uid.
-- Nothing is ever lost: the history trigger of 20261106_calendar.sql keeps every deleted row in calendar_event_history.
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs parts 1-3.

begin;

create or replace function public.calendar_feed_rows(p_token text, p_prefix text, p_after bigint default 0)
returns table (id bigint, source_uid text, title text, starts_at timestamptz, ends_at timestamptz, all_day boolean,
               location text, notes text, rrule text, exdates timestamptz[], remind int[], color smallint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.calendar_token_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_prefix is null or p_prefix not in ('google:', 'outlook:') then
    raise exception 'unknown feed prefix' using errcode = '22023';
  end if;
  return query
    select e.id, e.source_uid, e.title, e.starts_at, e.ends_at, e.all_day, e.location, e.notes, e.rrule, e.exdates,
           e.remind, e.color
    from public.calendar_event e
    where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and starts_with(e.source_uid, p_prefix)
      and e.id > coalesce(p_after, 0)
    order by e.id
    limit 500;
end $$;
revoke all on function public.calendar_feed_rows(text, text, bigint) from public;
grant execute on function public.calendar_feed_rows(text, text, bigint) to anon, authenticated, service_role;

create or replace function public.calendar_feed_remove(p_token text, p_prefix text, p_ids bigint[])
returns int
language plpgsql volatile security definer set search_path = public as $$
declare
  n int;
begin
  if not public.calendar_token_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_prefix is null or p_prefix not in ('google:', 'outlook:') then
    raise exception 'unknown feed prefix' using errcode = '22023';
  end if;
  delete from public.calendar_event e
    where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.id = any(coalesce(p_ids, '{}'))
      and starts_with(e.source_uid, p_prefix);
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.calendar_feed_remove(text, text, bigint[]) from public;
grant execute on function public.calendar_feed_remove(text, text, bigint[]) to anon, authenticated, service_role;

commit;

-- control: two functions, both security definer and callable by anon (the token guards them)
select p.proname, p.prosecdef as security_definer, has_function_privilege('anon', p.oid, 'execute') as anon_may_call
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('calendar_feed_rows', 'calendar_feed_remove')
order by p.proname;
