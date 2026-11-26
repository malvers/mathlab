-- calendar_add learns "private": true|false (Doc, 26.11.2026: make-up dates are only info for him, Ute never needs to
-- see them - except where he supervises himself). Same function as 20261122_calendar_reminder.sql plus the one key;
-- calendar_shared_rows already hides private rows from the guest. Absent key = as before (a new row: not private).
-- Run once in the Supabase SQL editor. The one-off UPDATE below makes the existing make-up rows private (only that
-- column; reminders, the guest's rows and Doc's own supervision - the "google:" row of 25.01.2027 - stay as they are).

begin;

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
  v_reminder boolean;          -- null = not given
  v_private  boolean;          -- null = not given
  v_old_shared bigint;         -- shared_by of the row this source_uid replaces
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
                          'remind', 'color', 'source_uid', 'shared', 'together', 'reminder', 'private')
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

    -- reminder: true = a reminder (a point in time with its own look - Doc's own entries only), false = an appointment
    -- again, absent = as before (a new row: an appointment)
    if jsonb_typeof(v_ev -> 'reminder') not in ('boolean', 'null') then
      raise exception 'event %: reminder must be true or false', v_i using errcode = '22023';
    end if;
    v_reminder := (v_ev ->> 'reminder')::boolean;
    if v_reminder and v_shared then
      raise exception 'event %: a reminder is Doc''s own - not with "shared" or "together"', v_i using errcode = '22023';
    end if;

    -- private: true = never shown to the guest (Doc's own, e.g. make-up dates he does not supervise), false = visible
    -- again, absent = as before (a new row: false). Not together with "shared" - a guest's entry is always visible.
    if jsonb_typeof(v_ev -> 'private') not in ('boolean', 'null') then
      raise exception 'event %: private must be true or false', v_i using errcode = '22023';
    end if;
    v_private := (v_ev ->> 'private')::boolean;
    if v_private and v_shared then
      raise exception 'event %: private is Doc''s own - not with "shared" or "together"', v_i using errcode = '22023';
    end if;

    -- insert, or replace the row with the same source_uid (the history trigger keeps the old version)
    v_old := null;
    v_old_shared := null;
    if v_uid is not null then
      select e.id, e.shared_by into v_old, v_old_shared from public.calendar_event e
        where e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.source_uid = v_uid;
    end if;
    if v_reminder and v_shared is null and v_old_shared is not null then
      raise exception 'event %: this entry is the guest''s - a reminder is Doc''s own (send "shared": false with it)', v_i
        using errcode = '22023';
    end if;
    insert into public.calendar_event as e
           (user_id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color, source_uid,
            shared_by, together, reminder, private)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, v_remind, v_color, v_uid, case when v_shared then v_share end,
            v_shared is true and v_together is true, coalesce(v_reminder, false), coalesce(v_private, false))
    on conflict on constraint calendar_event_source do update
      set title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
          all_day = excluded.all_day, location = excluded.location, notes = excluded.notes, rrule = excluded.rrule,
          exdates = excluded.exdates, color = excluded.color,
          shared_by = case when v_shared is null then e.shared_by else excluded.shared_by end,
          private = case when v_shared then false when v_private is null then e.private else v_private end,
          -- joint only while the guest is part of it
          together = case when (case when v_shared is null then e.shared_by else excluded.shared_by end) is null then false
                          when v_together is null then e.together else v_together end,
          -- a guest's entry never rings, whoever sends it again
          remind = case when (case when v_shared is null then e.shared_by else excluded.shared_by end) is not null
                        then '{}'::int[] else excluded.remind end,
          -- a reminder only on Doc's own rows (the check constraint above holds it too)
          reminder = case when (case when v_shared is null then e.shared_by else excluded.shared_by end) is not null then false
                          when v_reminder is null then e.reminder else v_reminder end
    returning e.id into id;
    op := case when v_old is null then 'insert' else 'update' end;
    return next;
  end loop;
end $$;
revoke all on function public.calendar_add(text, jsonb) from public;
grant execute on function public.calendar_add(text, jsonb) to anon, authenticated, service_role;

update public.calendar_event
   set private = true
 where user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid
   and shared_by is null and not reminder and not private
   and source_uid like 'nachschreiben-%';

commit;

-- control: the make-up rows by state (expect: nachschreiben-bgy 49 / -fo 40 / -os9a 1 private, none public)
select split_part(source_uid, '-', 2) as kind, private, count(*)
from public.calendar_event
where user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and shared_by is null and not reminder
  and source_uid like 'nachschreiben-%'
group by 1, 2 order by 1, 2;
