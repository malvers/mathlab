-- Doc's calendar, part 5: sharing it with one guest (19.11.2026). The guest sees when Doc is busy and keeps their own
-- appointments in his calendar - without an account: a link with a random token, shown once as a QR code in the
-- calendar's settings and scanned in person. Doc's decisions (19.11.2026): IBB/Outlook appointments show, but only as
-- "IBB" ("da muss nie dran stehen, was es ist"), lessons only as "Schule"; no Solita reminders for the guest's entries;
-- the guest may do everything Doc can (series, all-day, place, notes) - but only on their own entries; Doc sees them
-- (pink, marked). Birthdays and other yearly series stay hidden unless switched on; an appointment marked "privat"
-- never shows.
--
-- calendar_share         one row per guest: a label (only in the database, never in the repo), the SHA-256 of the
--                        current token (null = access locked) and the switches. Doc's account only.
-- calendar_event         + private   (true = never shown to a guest)
--                        + shared_by (the share whose guest entered it; such rows still belong to Doc's uid, so his
--                                     page, the history trigger and the watcher treat them like his own)
-- calendar_shared_rows(token, from, to)    what the guest may see in [from, to): { share, events, lessons },
--                                         anonymised here in the database - the page never receives what it must not show
-- calendar_shared_save(token, event)      inserts or updates one of the GUEST's entries (validated like calendar_add,
--                                         remind always [] so Solita never calls for it, at most 200 new ones a day)
-- calendar_shared_remove(token, id)       deletes one of the GUEST's entries
-- Without a matching token the functions refuse with 42501 (the page then says the link no longer works). Only the
-- token's SHA-256 is stored; the token itself exists only in the QR code and on the guest's phone.
--
-- Unchanged on purpose: calendar_poll, calendar_add, calendar_feed_rows/remove (fixed column lists, prefix-guarded),
-- the history trigger. Guest entries carry remind = '{}', so the watcher never rings for them.
--
-- Apply: SQL editor. Idempotent (safe to re-run). Needs parts 1-4 (20261106/20261107_calendar*.sql).

begin;

create table if not exists public.calendar_share (
  id            bigint generated always as identity primary key,
  user_id       uuid        not null default auth.uid(),
  label         text        not null check (length(btrim(label)) between 1 and 40),
  token_sha256  text        unique check (token_sha256 ~ '^[0-9a-f]{64}$'),   -- null = access locked
  show_lessons  boolean     not null default true,    -- lessons, only as "Schule" (no subject, class, room, note)
  show_events   boolean     not null default true,    -- Doc's appointments, without notes
  show_work     boolean     not null default true,    -- IBB/Outlook appointments, only as "IBB" (no place, no notes)
  show_yearly   boolean     not null default false,   -- birthdays and other yearly series
  can_write     boolean     not null default true,    -- the guest may enter, change and delete their own appointments
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.calendar_share enable row level security;
revoke all on public.calendar_share from anon;
grant select, insert, update, delete on public.calendar_share to authenticated;
grant select, insert, update, delete on public.calendar_share to service_role;

drop policy if exists calendar_share_doc_all on public.calendar_share;
create policy calendar_share_doc_all on public.calendar_share for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create or replace function public.calendar_share_touch() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.calendar_share_touch() from public, anon, authenticated;

drop trigger if exists calendar_share_touch_trg on public.calendar_share;
create trigger calendar_share_touch_trg before update on public.calendar_share
  for each row execute function public.calendar_share_touch();

alter table public.calendar_event add column if not exists private boolean not null default false;
alter table public.calendar_event add column if not exists shared_by bigint
  references public.calendar_share (id) on delete set null;
create index if not exists calendar_event_shared_by on public.calendar_event (shared_by) where shared_by is not null;

-- the share that belongs to a token, or 42501. Internal helper, no grant.
create or replace function public.calendar_share_of(p_token text)
returns public.calendar_share
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v public.calendar_share;
begin
  if p_token is not null and length(p_token) between 20 and 200 then
    select * into v from public.calendar_share s
      where s.token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
        and s.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid;
  end if;
  if v.id is null then
    raise exception 'link no longer valid' using errcode = '42501';
  end if;
  return v;
end $$;
revoke all on function public.calendar_share_of(text) from public, anon, authenticated;

-- What the guest may see in [p_from, p_to):
--   { "share":   { "label", "show_lessons", "show_events", "show_work", "show_yearly", "can_write" },
--     "events":  [{ "id", "kind", "title", "starts_at", "ends_at", "all_day", "location", "notes", "rrule", "exdates" }],
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
           'rrule', e.rrule, 'exdates', e.exdates) order by e.starts_at, e.id), '[]'::jsonb)
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
                                'show_work', v.show_work, 'show_yearly', v.show_yearly, 'can_write', v.can_write),
    'events', v_events,
    'lessons', v_lessons);
end $$;
revoke all on function public.calendar_shared_rows(text, timestamptz, timestamptz) from public;
grant execute on function public.calendar_shared_rows(text, timestamptz, timestamptz) to anon, authenticated, service_role;

-- p_event: { "id": 123 (absent = new), "title": "...", "starts_at": "2026-11-21T10:00:00+01:00", "ends_at": "...",
--            "all_day": false, "location": "...", "notes": "...", "rrule": "FREQ=WEEKLY", "exdates": ["..."] }
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
                         'remind', 'color')
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

  if v_id is null then
    -- a leaked link must not flood Doc's calendar: at most 200 new entries in 24 hours
    if (select count(*) from public.calendar_event e
        where e.shared_by = v.id and e.created_at > now() - interval '24 hours') >= 200 then
      raise exception 'too many new entries today' using errcode = '54000';
    end if;
    insert into public.calendar_event
           (user_id, title, starts_at, ends_at, all_day, location, notes, rrule, exdates, remind, color, private, shared_by)
    values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, v_title, v_start, v_end, v_all_day, v_location, v_notes,
            v_rrule, v_exdates, '{}', 2, false, v.id)
    returning * into r;
  else
    update public.calendar_event e
       set title = v_title, starts_at = v_start, ends_at = v_end, all_day = v_all_day, location = v_location,
           notes = v_notes, rrule = v_rrule, exdates = v_exdates, remind = '{}'
     where e.id = v_id and e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.shared_by = v.id
    returning * into r;
    if r.id is null then
      raise exception 'not an entry of this share' using errcode = '42501';
    end if;
  end if;

  return jsonb_build_object('id', r.id, 'kind', 'own', 'title', r.title, 'starts_at', r.starts_at,
                            'ends_at', r.ends_at, 'all_day', r.all_day, 'location', r.location, 'notes', r.notes,
                            'rrule', r.rrule, 'exdates', r.exdates);
end $$;
revoke all on function public.calendar_shared_save(text, jsonb) from public;
grant execute on function public.calendar_shared_save(text, jsonb) to anon, authenticated, service_role;

-- deletes one of the GUEST's entries; true if it was there (the history trigger keeps it in calendar_event_history)
create or replace function public.calendar_shared_remove(p_token text, p_id bigint)
returns boolean
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v public.calendar_share;
begin
  v := public.calendar_share_of(p_token);
  if not v.can_write then
    raise exception 'read only' using errcode = '42501';
  end if;
  delete from public.calendar_event e
    where e.id = p_id and e.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and e.shared_by = v.id;
  return found;
end $$;
revoke all on function public.calendar_shared_remove(text, bigint) from public;
grant execute on function public.calendar_shared_remove(text, bigint) to anon, authenticated, service_role;

commit;

-- control (run after the script; expected: two new columns, one table with RLS and one policy, four functions -
-- the three calendar_shared_* callable by anon (the token guards them), calendar_share_of not):
--
-- select column_name, data_type, column_default from information_schema.columns
-- where table_schema = 'public' and table_name = 'calendar_event' and column_name in ('private', 'shared_by');
--
-- select c.relname, c.relrowsecurity, (select count(*) from pg_policies p where p.tablename = c.relname) as policies,
--        has_table_privilege('anon', c.oid, 'select') as anon_may_read
-- from pg_class c where c.oid = 'public.calendar_share'::regclass;
--
-- select p.proname, p.prosecdef as security_definer, has_function_privilege('anon', p.oid, 'execute') as anon_may_call
-- from pg_proc p join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public' and p.proname in ('calendar_share_of', 'calendar_shared_rows', 'calendar_shared_save',
--                                              'calendar_shared_remove')
-- order by p.proname;
