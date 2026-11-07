-- Doc's calendar, part 2: the timetable and the call switches (07.11.2026, Doc: "dass der Stundenplan da bitte auch
-- mit eingetragen sein soll. Also dieser Kalender soll mein zentraler Kalender sein für alles. Die Basis für Solita,
-- die mich an alles erinnern soll." - "wir müssen irgendwo einen Switch machen, dass ich aus- und einschalten kann,
-- ob sie ruft. Aber ich würde mal sagen, fünf Minuten vor Stundenbeginn.")
--
-- calendar_lesson: Doc's lessons from Untis. The Untis run on the Mac keeps them in HTML/svp/plandaten/ (local,
-- gitignored); the reminder watcher (tools/kalender/waechter.mjs) mirrors them here with calendar_sync_lessons(token),
-- so the calendar on the phone shows them too. Read-only for Doc's account; written only through that function.
-- calendar_setting: whether Solita calls before appointments and before lessons - switched in the calendar's settings,
-- read by the watcher every minute through calendar_settings_poll(token).
-- Token check as in 20261106_calendar.sql (only the SHA-256 lives in calendar_poller).

create table if not exists public.calendar_lesson (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null,
  day        date        not null,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  subject    text        not null,
  classes    text[]      not null default '{}',
  rooms      text[]      not null default '{}',
  code       text,                 -- null, 'cancelled' or 'irregular' (Untis)
  note       text                  -- Untis substitution text / lesson text / info
);
create index if not exists calendar_lesson_user_day on public.calendar_lesson (user_id, day);

alter table public.calendar_lesson enable row level security;
revoke all on public.calendar_lesson from anon;
grant select on public.calendar_lesson to authenticated;
grant select, insert, update, delete on public.calendar_lesson to service_role;

drop policy if exists calendar_lesson_doc_read on public.calendar_lesson;
create policy calendar_lesson_doc_read on public.calendar_lesson for select to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

create table if not exists public.calendar_setting (
  user_id      uuid primary key,
  call_events  boolean     not null default true,   -- Solita calls before appointments (their own reminder times)
  call_lessons boolean     not null default true,   -- Solita calls before every lesson ...
  lesson_lead  int         not null default 5 check (lesson_lead between 0 and 60),   -- ... this many minutes before
  updated_at   timestamptz not null default now()
);
alter table public.calendar_setting enable row level security;
revoke all on public.calendar_setting from anon;
grant select, update on public.calendar_setting to authenticated;
grant select, insert, update, delete on public.calendar_setting to service_role;

drop policy if exists calendar_setting_doc_all on public.calendar_setting;
create policy calendar_setting_doc_all on public.calendar_setting for all to authenticated
  using (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (user_id = auth.uid() and auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

-- Doc's one row: the page only switches it (PATCH), it never has to create it
insert into public.calendar_setting (user_id) values ('2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid) on conflict do nothing;

create or replace function public.calendar_token_ok(p_token text) returns boolean
language sql stable security definer set search_path = public as $$
  select p_token is not null and exists (
    select 1 from public.calendar_poller where token_sha256 = encode(sha256(convert_to(p_token, 'UTF8')), 'hex'));
$$;
revoke all on function public.calendar_token_ok(text) from public, anon, authenticated;

-- the watcher's switches
create or replace function public.calendar_settings_poll(p_token text)
returns table (call_events boolean, call_lessons boolean, lesson_lead int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.calendar_token_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  return query
    select s.call_events, s.call_lessons, s.lesson_lead from public.calendar_setting s
    where s.user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid;
end $$;
revoke all on function public.calendar_settings_poll(text) from public;
grant execute on function public.calendar_settings_poll(text) to anon, authenticated, service_role;

-- the watcher's mirror of the timetable: the days [p_from, p_to] are replaced by p_rows
-- p_rows = [{ "day": "2026-11-09", "starts_at": "...", "ends_at": "...", "subject": "Inf", "classes": [..], "rooms": [..],
--             "code": null, "note": null }, ...]
create or replace function public.calendar_sync_lessons(p_token text, p_from date, p_to date, p_rows jsonb)
returns int
language plpgsql volatile security definer set search_path = public as $$
declare
  n int;
begin
  if not public.calendar_token_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_to < p_from or p_to - p_from > 400 then
    raise exception 'bad range' using errcode = '22023';
  end if;
  delete from public.calendar_lesson
    where user_id = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid and day between p_from and p_to;
  insert into public.calendar_lesson (user_id, day, starts_at, ends_at, subject, classes, rooms, code, note)
    select '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid, r.day, r.starts_at, r.ends_at, r.subject,
           coalesce(r.classes, '{}'), coalesce(r.rooms, '{}'), r.code, r.note
    from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb))
         as r(day date, starts_at timestamptz, ends_at timestamptz, subject text, classes text[], rooms text[], code text, note text)
    where r.day between p_from and p_to and r.subject is not null and r.ends_at > r.starts_at;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.calendar_sync_lessons(text, date, date, jsonb) from public;
grant execute on function public.calendar_sync_lessons(text, date, date, jsonb) to anon, authenticated, service_role;
