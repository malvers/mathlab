-- Doc's calendar, part 8: joint appointments - Doc's AND the guest's (19.11.2026, Doc: "Ist [Gast] und ich wählbar?", then
-- "nee [Gast] und ich checks"). In the editor two checks, "Ich" and the guest's label; both = a joint appointment, drawn
-- half gold, half turquoise; a filter in the header shows Doc's, the guest's or both.
--
-- calendar_event + together boolean (default false). A joint appointment is a guest row (shared_by = the share) with
--   together = true: the guest sees it in full and may change or delete it, like their own; Doc sees it as before.
--   No check constraint ties it to shared_by on purpose: deleting a share sets shared_by null (part 5's foreign key),
--   and such a row simply counts as Doc's again - the page and these functions only read together next to shared_by.
-- Reminders: unchanged - a row with shared_by never rings (part 6's rule), so Solita does not call for joint ones
--   either. (If Doc wants that one day, it is a small change here and in calendar_shared_save.)
--
-- Changed, each otherwise word for word as before:
--   calendar_shared_rows  (part 5)  + "together" per event (only on the guest's rows), + share.can_together = true
--                                   (so the guest's page knows it may offer the check)
--   calendar_shared_save  (part 5)  + optional "together": true/false; absent = a new entry is the guest's alone, a
--                                   changed one stays as it was
--   calendar_add          (part 7)  + optional "together": true (implies "shared": true; with "shared": false refused),
--                                   false = no longer joint, absent = as before; taking the row back from the guest
--                                   ("shared": false) ends it too
-- Unchanged: calendar_shared_remove, calendar_share_of, calendar_poll, the feed functions, all grants.
-- Until this runs, the page works as before: no together column = no joint choice (the two checks act like a switch).
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs parts 1-7; without part 7 it stops before changing anything.

begin;

do $$
begin
  if not exists (
       select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'calendar_add' and position('''7''' in p.prosrc) > 0)
     or to_regprocedure('public.calendar_shared_save(text, jsonb)') is null then
    raise exception 'run supabase/migrations/20261119c_calendar_colors.sql first';
  end if;
end $$;

alter table public.calendar_event add column if not exists together boolean not null default false;

-- What the guest may see in [p_from, p_to):
--   { "share":   { "label", "show_lessons", "show_events", "show_work", "show_yearly", "can_write", "can_together" },
--     "events":  [{ "id", "kind", "title", "starts_at", "ends_at", "all_day", "location", "notes", "rrule", "exdates",
--                   "together" }],
--     "lessons": [{ "title": "Schule", "starts_at", "ends_at" }] }
-- kind: 'own'    the guest's entry - everything
--       'work'   IBB/Outlook (source_uid outlook:...) - title "IBB", no place, no notes
--       'yearly' a yearly series (birthdays), only with show_yearly - title, no place, no notes
--       'event'  any other appointment of Doc's, only with show_events - title and place, no notes
-- Never: rows marked private, rows another guest entered, Doc's reminders and colours. Lessons: only with
-- show_lessons, never cancelled ones, back-to-back lessons (up to 15 minutes apart) merged into one "Schule" block -
-- no subject, class, room or Untis note ever leaves the database.
create or replace function public.calendar_shared_rows(p_token text,
                                                       p_from timestamptz default now() - interval '42 days',
                                                       p_to timestamptz default now() + interval '400 days')
returns jsonb
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v public.calendar_share;
  v_events jsonb;
  v_lessons jsonb;
begin
  v := public.calendar_share_of(p_token);
  if p_from is null or p_to is null or p_to <= p_from or p_to - p_from > interval '500 days' then
    raise exception 'bad range (at most 500 days)' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'id', e.id, 'kind', k.kind,
           'title', case when k.kind = 'work' then 'IBB' else e.title end,
           'starts_at', e.starts_at, 'ends_at', e.ends_at, 'all_day', e.all_day,
           'location', case when k.kind in ('own', 'event') then e.location end,
           'notes', case when k.kind = 'own' then e.notes end,
           'rrule', e.rrule, 'exdates', e.exdates,
           'together', k.kind = 'own' and e.together) order by e.starts_at, e.id), '[]'::jsonb)
    into v_events
    from public.calendar_event e
    cross join lateral (select case
        when e.shared_by = v.id then 'own'
        when e.shared_by is not null or e.private then null
        when starts_with(coalesce(e.source_uid, ''), 'outlook:') then case when v.show_work then 'work' end
        when e.rrule ilike 'FREQ=YEARLY%' then case when v.show_yearly then 'yearly' end
        else case when v.show_events then 'event' end
      end as kind) k
    where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
      and k.kind is not null
      and e.starts_at < p_to
      and (e.rrule is not null
           or coalesce(e.ends_at, e.starts_at + case when e.all_day then interval '1 day' else interval '1 hour' end) > p_from);

  with l as (
    select x.starts_at, x.ends_at
    from public.calendar_lesson x
    where v.show_lessons
      and x.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
      and x.code is distinct from 'cancelled'
      and x.starts_at < p_to and x.ends_at > p_from
  ), b as (   -- 1 = a new block begins: this lesson starts more than 15 minutes after every earlier one ended
    select l.starts_at, l.ends_at,
           case when l.starts_at <= max(l.ends_at) over (order by l.starts_at, l.ends_at
                                                          rows between unbounded preceding and 1 preceding)
                                    + interval '15 minutes' then 0 else 1 end as brk
    from l
  ), g as (
    select b.starts_at, b.ends_at, sum(b.brk) over (order by b.starts_at, b.ends_at) as grp from b
  ), m as (
    select min(g.starts_at) as starts_at, max(g.ends_at) as ends_at from g group by g.grp
  )
  select coalesce(jsonb_agg(jsonb_build_object('title', 'Schule', 'starts_at', m.starts_at, 'ends_at', m.ends_at)
                            order by m.starts_at), '[]'::jsonb)
    into v_lessons
    from m;

  return jsonb_build_object(
    'share', jsonb_build_object('label', v.label, 'show_lessons', v.show_lessons, 'show_events', v.show_events,
                                'show_work', v.show_work, 'show_yearly', v.show_yearly, 'can_write', v.can_write,
                                'can_together', true),
    'events', v_events,
    'lessons', v_lessons);
end $$;
revoke all on function public.calendar_shared_rows(text, timestamptz, timestamptz) from public;
grant execute on function public.calendar_shared_rows(text, timestamptz, timestamptz) to anon, authenticated, service_role;

-- p_event: { "id": 123 (absent = new), "title": "...", "starts_at": "2026-11-21T10:00:00+01:00", "ends_at": "...",
--            "all_day": false, "location": "...", "notes": "...", "rrule": "FREQ=WEEKLY", "exdates": ["..."],
--            "together": true }   (joint with Doc; absent = a new one is the guest's alone, a changed one stays as it was)
-- Rules as calendar_add (20261107_calendar_write.sql): title and starts_at required, times with an explicit offset
-- (all-day: a bare date = midnight Europe/Berlin), ends_at after starts_at, the rrule subset kalender-core.js follows.
-- "remind" and "color" are accepted and ignored: guest entries always get remind = '{}' (Doc 19.11.2026: no reminders
-- for them) and the page paints them pink. Any other key is refused, so a misspelt one is never lost silently.
-- An id must be one of the GUEST's entries (shared_by = this share) - Doc's own appointments cannot be reached.
-- Returns the saved entry in the shape of calendar_shared_rows (kind 'own').
create or replace function public.calendar_shared_save(p_token text, p_event jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v          public.calendar_share;
  v_key      text;
  v_id       bigint;
  v_title    text;
  v_all_day  boolean;
  v_start    timestamptz;
  v_end      timestamptz;
  v_location text;
  v_notes    text;
  v_rrule    text;
  v_exdates  timestamptz[];
  v_together boolean;
  r          public.calendar_event;
begin
  v := public.calendar_share_of(p_token);
  if not v.can_write then
    raise exception 'read only' using errcode = '42501';
  end if;
  if jsonb_typeof(p_event) is distinct from 'object' then
    raise exception 'p_event: one event object expected' using errcode = '22023';
  end if;
  select k.jkey into v_key from jsonb_object_keys(p_event) as k(jkey)
    where k.jkey not in ('id', 'title', 'starts_at', 'ends_at', 'all_day', 'location', 'notes', 'rrule', 'exdates',
                         'remind', 'color', 'together')
    limit 1;
  if v_key is not null then
    raise exception 'unknown key "%"', v_key using errcode = '22023';
  end if;

  -- id: absent or null = a new entry
  if jsonb_typeof(p_event -> 'id') = 'number' and (p_event ->> 'id') ~ '^\d{1,18}$' then
    v_id := (p_event ->> 'id')::bigint;
  elsif jsonb_typeof(p_event -> 'id') is not null and jsonb_typeof(p_event -> 'id') <> 'null' then
    raise exception 'id must be a whole number' using errcode = '22023';
  end if;

  -- title: text, whitespace collapsed like the calendar's form
  if jsonb_typeof(p_event -> 'title') is distinct from 'string' or btrim(p_event ->> 'title') = '' then
    raise exception 'title (text) is required' using errcode = '22023';
  end if;
  v_title := regexp_replace(btrim(p_event ->> 'title'), '\s+', ' ', 'g');
  if length(v_title) > 300 then
    raise exception 'title longer than 300 characters' using errcode = '22023';
  end if;

  -- all_day: boolean, default false
  if jsonb_typeof(p_event -> 'all_day') not in ('boolean', 'null') then
    raise exception 'all_day must be true or false' using errcode = '22023';
  end if;
  v_all_day := coalesce((p_event ->> 'all_day')::boolean, false);

  -- starts_at (required), ends_at (optional, exclusive end, after the start)
  v_start := public.calendar_parse_time(p_event -> 'starts_at', v_all_day, 'starts_at');
  if v_start is null then
    raise exception 'starts_at is required' using errcode = '22023';
  end if;
  v_end := public.calendar_parse_time(p_event -> 'ends_at', v_all_day, 'ends_at');
  if v_end is not null and v_end <= v_start then
    raise exception 'ends_at must lie after starts_at' using errcode = '22023';
  end if;

  -- location, notes, rrule: text or null (empty text = null)
  if exists (select 1 from unnest(array['location', 'notes', 'rrule']) as f(k)
             where jsonb_typeof(p_event -> f.k) not in ('string', 'null')) then
    raise exception 'location, notes and rrule must be text' using errcode = '22023';
  end if;
  v_location := nullif(btrim(p_event ->> 'location'), '');
  v_notes    := nullif(btrim(p_event ->> 'notes'), '');
  if length(v_location) > 500 or length(v_notes) > 10000 then
    raise exception 'location (500) or notes (10000) too long' using errcode = '22023';
  end if;

  -- rrule: the subset the calendar understands (kalender-core.js), FREQ first - as calendar_add
  v_rrule := nullif(upper(regexp_replace(btrim(coalesce(p_event ->> 'rrule', '')), '^RRULE:', '', 'i')), '');
  if v_rrule is not null and v_rrule !~ ('^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)'
       '(;(INTERVAL=\d{1,3}|COUNT=\d{1,4}|UNTIL=\d{8}(T\d{6}Z?)?'
       '|BYDAY=[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU)(,[+-]?\d{0,2}(MO|TU|WE|TH|FR|SA|SU))*))*$') then
    raise exception 'rrule "%" not understood (FREQ=DAILY|WEEKLY|MONTHLY|YEARLY;INTERVAL;COUNT;UNTIL;BYDAY)', v_rrule
      using errcode = '22023';
  end if;

  -- exdates: list of times (same rules as starts_at), at most 500
  v_exdates := '{}';
  if jsonb_typeof(p_event -> 'exdates') = 'array' then
    if jsonb_array_length(p_event -> 'exdates') > 500 then
      raise exception 'exdates: at most 500' using errcode = '22023';
    end if;
    select coalesce(array_agg(public.calendar_parse_time(x.val, v_all_day, 'exdates') order by x.n), '{}')
      into v_exdates
      from jsonb_array_elements(p_event -> 'exdates') with ordinality as x(val, n);
  elsif jsonb_typeof(p_event -> 'exdates') is not null and jsonb_typeof(p_event -> 'exdates') <> 'null' then
    raise exception 'exdates must be a list of times' using errcode = '22023';
  end if;

  -- together: true = joint with Doc, false = the guest's alone, absent = as before (new: the guest's alone)
  if jsonb_typeof(p_event -> 'together') not in ('boolean', 'null') then
    raise exception 'together must be true or false' using errcode = '22023';
  end if;
  v_together := (p_event ->> 'together')::boolean;

  if v_id is null then
    -- a leaked link must not flood Doc's calendar: at most 200 new entries in 24 hours
    if (select count(*) from public.calendar_event e
        where e.shared_by = v.id and e.created_at > now() - interval '24 hours') >= 200 then
      raise exception 'too many new entries today' using errcode = '54000';
    end if;
    insert into public.calendar_event
           (user_id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color, private, shared_by,
            together)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, '{}', 2, false, v.id, coalesce(v_together, false))
    returning * into r;
  else
    update public.calendar_event e
       set title = v_title, starts_at = v_start, ends_at = v_end, all_day = v_all_day, location = v_location,
           notes = v_notes, rrule = v_rrule, exdates = v_exdates, remind = '{}',
           together = coalesce(v_together, e.together)
     where e.id = v_id and e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.shared_by = v.id
    returning * into r;
    if r.id is null then
      raise exception 'not an entry of this share' using errcode = '42501';
    end if;
  end if;

  return jsonb_build_object('id', r.id, 'kind', 'own', 'title', r.title, 'starts_at', r.starts_at,
                            'ends_at', r.ends_at, 'all_day', r.all_day, 'location', r.location, 'notes', r.notes,
                            'rrule', r.rrule, 'exdates', r.exdates, 'together', r.together);
end $$;
revoke all on function public.calendar_shared_save(text, jsonb) from public;
grant execute on function public.calendar_shared_save(text, jsonb) to anon, authenticated, service_role;

-- p_events: one object or an array of up to 200:
--   { "title": "...", "starts_at": "2026-11-14T10:00:00+01:00", "ends_at": "...", "all_day": false,
--     "location": "...", "notes": "...", "rrule": "FREQ=WEEKLY;BYDAY=SA", "exdates": ["..."], "remind": [100],
--     "color": 2, "source_uid": "...", "shared": true, "together": true }
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
  v_together boolean;          -- null = not given
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
                          'remind', 'color', 'source_uid', 'shared', 'together')
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

    -- color: 1 = Υ red, 2 = λ gold (default), 3 = φ green, 4 = blue, 5 = violet, 6 = orange, 7 = pink
    if jsonb_typeof(v_ev -> 'color') is null or jsonb_typeof(v_ev -> 'color') = 'null' then
      v_color := 2;
    elsif jsonb_typeof(v_ev -> 'color') = 'number' and (v_ev ->> 'color') in ('1', '2', '3', '4', '5', '6', '7') then
      v_color := (v_ev ->> 'color')::smallint;
    else
      raise exception 'event %: color must be 1 to 7', v_i using errcode = '22023';
    end if;

    -- shared: true = the guest's entry (the one share, no reminders), false = Doc's again, absent = as before
    if jsonb_typeof(v_ev -> 'shared') not in ('boolean', 'null') then
      raise exception 'event %: shared must be true or false', v_i using errcode = '22023';
    end if;
    v_shared := (v_ev ->> 'shared')::boolean;
    -- together: true = a joint entry of Doc and the guest (implies shared), false = no longer joint, absent = as before
    if jsonb_typeof(v_ev -> 'together') not in ('boolean', 'null') then
      raise exception 'event %: together must be true or false', v_i using errcode = '22023';
    end if;
    v_together := (v_ev ->> 'together')::boolean;
    if v_together and v_shared is false then
      raise exception 'event %: together needs the guest - not with "shared": false', v_i using errcode = '22023';
    end if;
    if v_together then
      v_shared := true;
    end if;
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
            shared_by, together)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, v_remind, v_color, v_uid, case when v_shared then v_share end,
            v_shared is true and v_together is true)
    on conflict on constraint calendar_event_source do update
      set title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
          all_day = excluded.all_day, location = excluded.location, notes = excluded.notes, rrule = excluded.rrule,
          exdates = excluded.exdates, color = excluded.color,
          shared_by = case when v_shared is null then e.shared_by else excluded.shared_by end,
          private = case when v_shared then false else e.private end,
          -- joint only while the guest is part of it
          together = case when (case when v_shared is null then e.shared_by else excluded.shared_by end) is null then false
                          when v_together is null then e.together else v_together end,
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

-- control: four rows - the column (boolean, default false) and the three functions knowing "together"
select 'calendar_event.together' as what, data_type || ', default ' || column_default as state
from information_schema.columns
where table_schema = 'public' and table_name = 'calendar_event' and column_name = 'together'
union all
select p.proname, 'together: ' || (position('together' in p.prosrc) > 0)::text || ', anon may call: ' ||
       has_function_privilege('anon', p.oid, 'execute')::text
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('calendar_add', 'calendar_shared_rows', 'calendar_shared_save');
