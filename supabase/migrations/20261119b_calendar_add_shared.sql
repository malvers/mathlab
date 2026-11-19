-- Doc's calendar, part 6: the agents' write path may enter an appointment as the GUEST's (19.11.2026, Doc: "Ja, bitte").
-- Part 5 (20261119_calendar_share.sql) let the guest keep their own entries (calendar_event.shared_by, pink in Doc's
-- page); until now only the guest's page could create such a row. calendar_add (part 3, 20261107_calendar_write.sql,
-- caller tools/kalender/eintragen.mjs with the watcher's keychain token) learns one optional key per event:
--
--   "shared": true    the entry is the guest's: shared_by = the one calendar_share row, remind = '{}' (Doc 19.11.2026:
--                     no Solita reminders for the guest's entries - a remind given along is ignored, as
--                     calendar_shared_save does), private = false (the guest always sees their own entries)
--   "shared": false   the entry is Doc's again: shared_by = null (remind and private as sent / as before)
--   absent / null     exactly as before: a new row is Doc's, a replaced row keeps its shared_by and private
--
-- One rule holds for every row calendar_add writes, with or without the key: a row with shared_by never gets a
-- reminder. So an agent that re-sends a guest entry without "shared" cannot make Solita call for it.
-- "shared": true needs exactly one calendar_share row (the page and the guest link know only one); none or several
-- refuse the call - an entry is never given to the wrong guest.
--
-- Unchanged: the signature, the return rows (id, op), every other check, the grants. Existing callers never send
-- "shared" and never touch a guest row (guest rows from the guest's page have no source_uid), so for them - the
-- agents and the 15-minute Google/Outlook mirror (tools/kalender/feeds.mjs) - nothing changes.
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs parts 1-5; without part 5 it stops before changing anything.

begin;

do $$
begin
  if to_regclass('public.calendar_share') is null or not exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'calendar_event' and column_name = 'shared_by') then
    raise exception 'run supabase/migrations/20261119_calendar_share.sql first';
  end if;
end $$;

-- p_events: one object or an array of up to 200:
--   { "title": "...", "starts_at": "2026-11-14T10:00:00+01:00", "ends_at": "...", "all_day": false,
--     "location": "...", "notes": "...", "rrule": "FREQ=WEEKLY;BYDAY=SA", "exdates": ["..."], "remind": [100],
--     "color": 2, "source_uid": "...", "shared": true }
-- Only title and starts_at are required. Absent keys take the calendar's defaults (remind: 60,15 - all-day: 360 =
-- 18:00 the day before, as kalender-core.js); with an existing source_uid the row is replaced by exactly these values
-- (shared_by and private only when "shared" is given, see above).
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
  v_shared   boolean;          -- null = not given
  v_share    bigint;           -- the one calendar_share row, looked up once when an event asks for it
  v_shares   bigint;
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
                          'remind', 'color', 'source_uid', 'shared')
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

    -- shared: true = the guest's entry (the one share, no reminders), false = Doc's again, absent = as before
    if jsonb_typeof(v_ev -> 'shared') not in ('boolean', 'null') then
      raise exception 'event %: shared must be true or false', v_i using errcode = '22023';
    end if;
    v_shared := (v_ev ->> 'shared')::boolean;
    if v_shared and v_share is null then
      select count(*), min(s.id) into v_shares, v_share
        from public.calendar_share s
        where s.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid;
      if v_shares = 0 then
        raise exception 'event %: shared - the calendar is not shared with anyone yet', v_i using errcode = '22023';
      elsif v_shares > 1 then
        raise exception 'event %: shared - the calendar is shared with % guests, not clear whose entry this is',
          v_i, v_shares using errcode = '22023';
      end if;
    end if;
    if v_shared then
      v_remind := '{}';
    end if;

    -- insert, or replace the row with the same source_uid (the history trigger keeps the old version)
    v_old := null;
    if v_uid is not null then
      select e.id into v_old from public.calendar_event e
        where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.source_uid = v_uid;
    end if;
    insert into public.calendar_event as e
           (user_id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color, source_uid,
            shared_by)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, v_remind, v_color, v_uid, case when v_shared then v_share end)
    on conflict on constraint calendar_event_source do update
      set title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
          all_day = excluded.all_day, location = excluded.location, notes = excluded.notes, rrule = excluded.rrule,
          exdates = excluded.exdates, color = excluded.color,
          shared_by = case when v_shared is null then e.shared_by else excluded.shared_by end,
          private = case when v_shared then false else e.private end,
          -- a guest's entry never rings, whoever sends it again
          remind = case when (case when v_shared is null then e.shared_by else excluded.shared_by end) is not null
                        then '{}'::int[] else excluded.remind end
    returning e.id into id;
    op := case when v_old is null then 'insert' else 'update' end;
    return next;
  end loop;
end $$;
revoke all on function public.calendar_add(text, jsonb) from public;
grant execute on function public.calendar_add(text, jsonb) to anon, authenticated, service_role;

commit;

-- control: one row - calendar_add security definer, callable by anon (the token guards it), knows "shared"
select p.proname, p.prosecdef as security_definer, has_function_privilege('anon', p.oid, 'execute') as anon_may_call,
       position('v_shared' in p.prosrc) > 0 as knows_shared
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'calendar_add';
