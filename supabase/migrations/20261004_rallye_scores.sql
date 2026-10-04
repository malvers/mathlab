-- Rechen-Rallye high-score list (Doc, 04.10.2026: "ein Spieler gibt sich einen Namen, und wir machen dann eine Hitliste
-- ... auf Supabase eine Tabelle", then "du hast meine ausdrückliche Zustimmung"). DOCPAD's game (docpad/web/rallye.js)
-- reads and writes only through the edge function rallye-scores, which checks the nickname and the score against the
-- time played and takes a score only into the top ten. The browser may neither read nor write the table itself: no
-- grants for anon / authenticated, the function works with the service role. Nicknames only, never real names.
create table if not exists public.rallye_scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 12 and name ~ '^[A-Za-zÄÖÜäöüß0-9 ._-]+$'),
  score integer not null check (score between 0 and 100000),
  op text not null check (op in ('mul', 'div')),         -- the quiz that earned the ride: 1⋅1 or 1÷1
  seconds integer not null check (seconds between 1 and 7200),
  created_at timestamptz not null default now()
);

create index if not exists rallye_scores_top on public.rallye_scores (score desc, created_at);

alter table public.rallye_scores enable row level security;
revoke all on public.rallye_scores from anon, authenticated;
