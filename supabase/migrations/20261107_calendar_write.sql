-- Doc's calendar, part 3: the agents on Doc's Mac may write appointments (07.11.2026, Doc: "nee, ihr dürft schreiben!
-- Zwingend" - e.g. "trag mal die Termine ein"). The Supabase MCP stays read-only (it reaches every table, grades
-- included); this is the one narrow write path, and it reaches nothing but Doc's rows of calendar_event.
--
-- calendar_add(token, events)  inserts one or more appointments; an event whose source_uid already exists is replaced
--                              (upsert on calendar_event_source), so a corrected file can be sent again without doubles.
-- calendar_remove(token, id)   deletes one appointment.
-- Both take the token of the reminder watcher (tools/kalender/waechter.mjs, keychain service doc-kalender-waechter),
-- checked as in calendar_poll: only its SHA-256 lives in calendar_poller, and without a matching token nothing happens.
-- The caller is tools/kalender/eintragen.mjs. user_id is always Doc's uid - the caller cannot choose it.
-- Nothing is ever lost: the history trigger of 20261106_calendar.sql (before update or delete) keeps every former
-- version of a replaced or deleted row in calendar_event_history.
--
-- Times must carry an explicit offset ("2026-11-14T10:00:00+01:00" or "...Z"): the database runs in UTC and would
-- shift a bare "10:00" by one or two hours without a word. Only for all-day events a bare date is accepted
-- ("2026-11-14" = midnight Europe/Berlin, as the calendar stores all-day events).
-- One bad entry refuses the whole call (one transaction) - nothing is written half.
--
-- Apply: SQL editor. Idempotent (safe to re-run).

begin;

-- one time value of an event (see above); errors name the event and the field. Internal helper, no grant.
create or replace function public.calendar_parse_time(p_val jsonb, p_all_day boolean, p_what text)
returns timestamptz
language plpgsql stable set search_path = public, pg_temp as $$
declare
  s text;
begin
  if p_val is null or jsonb_typeof(p_val) = 'null' then
    return null;
  end if;
  if jsonb_typeof(p_val) <> 'string' then
    raise exception '%: text expected', p_what using errcode = '22023';
  end if;
  s := btrim(p_val #>> '{}');
  if p_all_day and s ~ '^\d{4}-\d{2}-\d{2}$' then
    return s::date::timestamp at time zone 'Europe/Berlin';
  end if;
  if s !~ '^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?\s*(Z|[+-]\d{2}(:?\d{2})?)$' then
    raise exception '%: "%" is not an ISO time with offset (e.g. 2026-11-14T10:00:00+01:00)', p_what, s
      using errcode = '22023';
  end if;
  return s::timestamptz;
exception when invalid_datetime_format or datetime_field_overflow then
  raise exception '%: "%" is not a valid time', p_what, s using errcode = '22023';
end $$;
revoke all on function public.calendar_parse_time(jsonb, boolean, text) from public, anon, authenticated;

-- p_events: one object or an array of up to 200:
--   { "title": "...", "starts_at": "2026-11-14T10:00:00+01:00", "ends_at": "...", "all_day": false,
--     "location": "...", "notes": "...", "rrule": "FREQ=WEEKLY;BYDAY=SA", "exdates": ["..."], "remind": [100],
--     "color": 2, "source_uid": "..." }
-- Only title and starts_at are required. Absent keys take the calendar's defaults (remind: 60,15 - all-day: 360 =
-- 18:00 the day before, as kalender-core.js); with an existing source_uid the row is replaced by exactly these values.
-- Returns one row per event, in the order given: its id and 'insert' or 'update'.
create or replace function public.calendar_add(p_token text, p_events jsonb)
returns table (id bigint, op text)
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_list     jsonb;
  v_ev       jsonb;
  v_i        int;
  v_key      text;
  v_title    text;
  v_all_day  boolean;
  v_start    timestamptz;
  v_end      timestamptz;
  v_location text;
  v_notes    text;
  v_rrule    text;
  v_exdates  timestamptz[];
  v_remind   int[];
  v_color    smallint;
  v_uid      text;
  v_old      bigint;
begin
  if p_token is null or not exists (
       select 1 from public.calendar_poller
       where token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  v_list := case jsonb_typeof(p_events) when 'array' then p_events when 'object' then jsonb_build_array(p_events) end;
  if v_list is null or jsonb_array_length(v_list) not between 1 and 200 then
    raise exception 'p_events: one event object or an array of 1 to 200 expected' using errcode = '22023';
  end if;

  for v_ev, v_i in select x.ev, x.n::int from jsonb_array_elements(v_list) with ordinality as x(ev, n) loop
    if jsonb_typeof(v_ev) <> 'object' then
      raise exception 'event %: object expected', v_i using errcode = '22023';
    end if;
    -- a misspelt key ("start", "reminder") would be lost without a word - refuse it
    select k.jkey into v_key from jsonb_object_keys(v_ev) as k(jkey)
      where k.jkey not in ('title', 'starts_at', 'ends_at', 'all_day', 'location', 'notes', 'rrule', 'exdates',
                          'remind', 'color', 'source_uid')
      limit 1;
    if v_key is not null then
      raise exception 'event %: unknown key "%"', v_i, v_key using errcode = '22023';
    end if;

    -- title: text, whitespace collapsed like the calendar's form
    if jsonb_typeof(v_ev -> 'title') is distinct from 'string' or btrim(v_ev ->> 'title') = '' then
      raise exception 'event %: title (text) is required', v_i using errcode = '22023';
    end if;
    v_title := regexp_replace(btrim(v_ev ->> 'title'), '\s+', ' ', 'g');
    if length(v_title) > 300 then
      raise exception 'event %: title longer than 300 characters', v_i using errcode = '22023';
    end if;

    -- all_day: boolean, default false
    if jsonb_typeof(v_ev -> 'all_day') not in ('boolean', 'null') then
      raise exception 'event %: all_day must be true or false', v_i using errcode = '22023';
    end if;
    v_all_day := coalesce((v_ev ->> 'all_day')::boolean, false);

    -- starts_at (required), ends_at (optional, exclusive end, after the start)
    v_start := public.calendar_parse_time(v_ev -> 'starts_at', v_all_day, format('event %s: starts_at', v_i));
    if v_start is null then
      raise exception 'event %: starts_at is required', v_i using errcode = '22023';
    end if;
    v_end := public.calendar_parse_time(v_ev -> 'ends_at', v_all_day, format('event %s: ends_at', v_i));
    if v_end is not null and v_end <= v_start then
      raise exception 'event %: ends_at must lie after starts_at', v_i using errcode = '22023';
    end if;

    -- location, notes, rrule, source_uid: text or null (empty text = null)
    if exists (select 1 from unnest(array['location', 'notes', 'rrule', 'source_uid']) as f(k)
               where jsonb_typeof(v_ev -> f.k) not in ('string', 'null')) then
      raise exception 'event %: location, notes, rrule and source_uid must be text', v_i using errcode = '22023';
    end if;
    v_location := nullif(btrim(v_ev ->> 'location'), '');
    v_notes    := nullif(btrim(v_ev ->> 'notes'), '');
    v_uid      := nullif(btrim(v_ev ->> 'source_uid'), '');
    if length(v_location) > 500 or length(v_notes) > 10000 or length(v_uid) > 300 then
      raise exception 'event %: location (500), notes (10000) or source_uid (300) too long', v_i using errcode = '22023';
    end if;

    -- rrule: the subset the calendar understands (kalender-core.js), FREQ first
    v_rrule := nullif(upper(regexp_replace(btrim(coalesce(v_ev ->> 'rrule', '')), '^RRULE:', '', 'i')), '');
    if v_rrule is not null and v_rrule !~ ('^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)'
         '(;(INTERVAL=\d{1,3}|COUNT=\d{1,4}|UNTIL=\d{8}(T\d{6}Z?)?'
         '|BYDAY=[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU)(,[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU))*))*$') then
      raise exception 'event %: rrule "%" not understood (FREQ=DAILY|WEEKLY|MONTHLY|YEARLY;INTERVAL;COUNT;UNTIL;BYDAY)',
        v_i, v_rrule using errcode = '22023';
    end if;

    -- exdates: list of times (same rules as starts_at)
    v_exdates := '{}';
    if jsonb_typeof(v_ev -> 'exdates') = 'array' then
      select coalesce(array_agg(public.calendar_parse_time(x.v, v_all_day, format('event %s: exdates', v_i)) order by x.n),
                      '{}')
        into v_exdates
        from jsonb_array_elements(v_ev -> 'exdates') with ordinality as x(v, n);
    elsif jsonb_typeof(v_ev -> 'exdates') <> 'null' then
      raise exception 'event %: exdates must be a list of times', v_i using errcode = '22023';
    end if;

    -- remind: whole minutes before the start ([] = no reminder; all-day: before 00:00, negative = on the day)
    if jsonb_typeof(v_ev -> 'remind') = 'array' then
      if exists (select 1 from jsonb_array_elements(v_ev -> 'remind') as r(m)
                 where case when jsonb_typeof(r.m) <> 'number' then true
                            else r.m::numeric <> trunc(r.m::numeric) or r.m::numeric not between -1440 and 40320 end) then
        raise exception 'event %: remind must be a list of whole minutes between -1440 and 40320', v_i
          using errcode = '22023';
      end if;
      select coalesce(array_agg(distinct r.m::int order by r.m::int desc), '{}')
        into v_remind
        from jsonb_array_elements(v_ev -> 'remind') as r(m);
    elsif jsonb_typeof(v_ev -> 'remind') is null or jsonb_typeof(v_ev -> 'remind') = 'null' then
      v_remind := case when v_all_day then '{360}'::int[] else '{60,15}'::int[] end;
    else
      raise exception 'event %: remind must be a list of minutes', v_i using errcode = '22023';
    end if;

    -- color: 1 = Υ red, 2 = λ gold (default), 3 = φ green
    if jsonb_typeof(v_ev -> 'color') is null or jsonb_typeof(v_ev -> 'color') = 'null' then
      v_color := 2;
    elsif jsonb_typeof(v_ev -> 'color') = 'number' and (v_ev ->> 'color') in ('1', '2', '3') then
      v_color := (v_ev ->> 'color')::smallint;
    else
      raise exception 'event %: color must be 1, 2 or 3', v_i using errcode = '22023';
    end if;

    -- insert, or replace the row with the same source_uid (the history trigger keeps the old version)
    v_old := null;
    if v_uid is not null then
      select e.id into v_old from public.calendar_event e
        where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.source_uid = v_uid;
    end if;
    insert into public.calendar_event as e
           (user_id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color, source_uid)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, v_remind, v_color, v_uid)
    on conflict on constraint calendar_event_source do update
      set title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
          all_day = excluded.all_day, location = excluded.location, notes = excluded.notes, rrule = excluded.rrule,
          exdates = excluded.exdates, remind = excluded.remind, color = excluded.color
    returning e.id into id;
    op := case when v_old is null then 'insert' else 'update' end;
    return next;
  end loop;
end $$;
revoke all on function public.calendar_add(text, jsonb) from public;
grant execute on function public.calendar_add(text, jsonb) to anon, authenticated, service_role;

-- deletes one of Doc's appointments; returns it (id, title, start), or no row when there is none with that id
create or replace function public.calendar_remove(p_token text, p_id bigint)
returns table (id bigint, title text, starts_at timestamptz)
language plpgsql volatile security definer set search_path = public, pg_temp as $$
begin
  if p_token is null or not exists (
       select 1 from public.calendar_poller
       where token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  delete from public.calendar_event as e
    where e.id = p_id and e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
    returning e.id, e.title, e.starts_at into id, title, starts_at;
  if found then
    return next;
  end if;
end $$;
revoke all on function public.calendar_remove(text, bigint) from public;
grant execute on function public.calendar_remove(text, bigint) to anon, authenticated, service_role;

commit;

-- control: three functions; calendar_add / calendar_remove security definer and callable by anon (the token guards),
-- calendar_parse_time not
select p.proname, p.prosecdef as security_definer, p.proconfig as settings,
       has_function_privilege('anon', p.oid, 'execute') as anon_may_call
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('calendar_add', 'calendar_remove', 'calendar_parse_time')
order by p.proname;
