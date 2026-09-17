-- vote: free-text feedback from the voters (Doc 2026-09-17: "für die Voters noch ein Feld mit Feedback").
-- After tapping 1..10 a voter may send one short text per round; the host sees "Feedbacks (n)" under the
-- Show chart and reads the texts only on a click.
--
-- Unlike the 1..10 votes, free text from pupils can carry names or personal things, so it is NOT public:
-- anon/authenticated may only INSERT; SELECT is Doc's account alone (same uid rule as svp_untis). The host
-- page reads with the SVP login (localStorage 'svp-session'), the voter never reads back.
-- One feedback per device per round via unique (poll_id, device); rows go with their poll (on delete cascade,
-- so vote_delete_poll removes them too).
--
-- Additive + reversible: drop table public.vote_feedback. Idempotent.

create table if not exists public.vote_feedback (
  id         bigint      generated always as identity primary key,
  poll_id    uuid        not null references public.vote_polls (id) on delete cascade,
  device     text        not null,
  body       text        not null check (char_length(btrim(body)) between 1 and 500),
  created_at timestamptz not null default now(),
  unique (poll_id, device)
);
create index if not exists vote_feedback_poll_idx on public.vote_feedback (poll_id);

alter table public.vote_feedback enable row level security;

drop policy if exists vote_feedback_insert on public.vote_feedback;
drop policy if exists vote_feedback_doc_read on public.vote_feedback;

create policy vote_feedback_insert on public.vote_feedback for insert to anon, authenticated with check (true);
create policy vote_feedback_doc_read on public.vote_feedback for select to authenticated
  using (auth.uid() = '2889073e-cbb8-4ca1-ad48-5234abe40585'::uuid);

grant insert on public.vote_feedback to anon, authenticated;
grant select on public.vote_feedback to authenticated;
