-- buch_feedback: spoken (or typed) feedback from the readers of the interactive textbooks (HTML/buch/…).
-- Doc, 09.10.2026: "oben ein Feedback-Knopf … einsprechen, sofort transkribiert, in unsere Datenbank, ein Cronjob geht
-- jeden Tag drüber und korrigiert". Doc, 10.10.2026: "Darf ich die Tabelle anlegen?" - "ja".
--
-- Only TEXT is stored, never audio: the browser transcribes (js/solita-listen.js), the reader sees and may edit the text
-- before it goes out. Each row carries its place in the book (book, chapter file, section, data-ziel of the block, the
-- marked or visible passage), so the daily job can find and check it.
--
-- Free text from pupils may carry names or personal things, so it is NOT public: anon/authenticated may only INSERT
-- (and only the reader's columns - status and the job's columns keep their defaults); SELECT and UPDATE are Doc's
-- account alone (same uid rule as vote_feedback / svp_untis).
-- Spam: a trigger allows at most 10 rows per device per hour and 500 rows per day in all.
--
-- Additive + reversible: drop table public.buch_feedback; drop function public.buch_feedback_limit(). Idempotent.

create table if not exists public.buch_feedback (
  id            bigint      generated always as identity primary key,
  created_at    timestamptz not null default now(),
  buch          text        not null check (char_length(buch) between 1 and 40),
  seite         text        not null check (char_length(seite) between 1 and 80),
  abschnitt     text                 check (char_length(abschnitt) <= 160),
  ziel          text                 check (char_length(ziel) <= 200),
  stelle        text                 check (char_length(stelle) <= 3000),
  body          text        not null check (char_length(btrim(body)) between 3 and 2000),
  gesprochen    boolean     not null default false,
  device        text        not null check (char_length(device) between 8 and 64),
  -- the daily job's columns
  status        text        not null default 'neu' check (status in ('neu', 'korrigiert', 'abgelehnt', 'unklar')),
  bearbeitet_at timestamptz,
  notiz         text,
  commit_sha    text
);
create index if not exists buch_feedback_status_idx on public.buch_feedback (status, created_at);
create index if not exists buch_feedback_device_idx on public.buch_feedback (device, created_at);

-- rate limit: security definer, because anon may not read the table it counts
create or replace function public.buch_feedback_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.buch_feedback
      where device = new.device and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'buch_feedback: too many reports from this device' using errcode = 'P0001';
  end if;
  if (select count(*) from public.buch_feedback where created_at > now() - interval '1 day') >= 500 then
    raise exception 'buch_feedback: daily limit reached' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function public.buch_feedback_limit() from public, anon, authenticated;

drop trigger if exists buch_feedback_limit on public.buch_feedback;
create trigger buch_feedback_limit before insert on public.buch_feedback
  for each row execute function public.buch_feedback_limit();

alter table public.buch_feedback enable row level security;

drop policy if exists buch_feedback_insert on public.buch_feedback;
drop policy if exists buch_feedback_doc_read on public.buch_feedback;
drop policy if exists buch_feedback_doc_update on public.buch_feedback;

create policy buch_feedback_insert on public.buch_feedback for insert to anon, authenticated
  with check (status = 'neu' and bearbeitet_at is null and notiz is null and commit_sha is null);
create policy buch_feedback_doc_read on public.buch_feedback for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);
create policy buch_feedback_doc_update on public.buch_feedback for update to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid)
  with check (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

revoke all on public.buch_feedback from anon, authenticated;
grant insert (buch, seite, abschnitt, ziel, stelle, body, gesprochen, device) on public.buch_feedback to anon, authenticated;
grant select, update (status, bearbeitet_at, notiz, commit_sha) on public.buch_feedback to authenticated;
