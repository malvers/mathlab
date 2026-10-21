-- hoerbuch_notes: Doc's bookmarks and notes in the audiobook reader (HTML/hoerbuch/), the same on Fon and Mac.
-- Doc, 21.10.2026: "dass ich einen Bookmark machen kann und dass ich an der Stelle auch eine Notiz sprechen kann" -
-- "die Notizen, die man sich macht, auf Supabase abgelegt sein sollten".
--
-- Only the PLACE in the book and Doc's own words are stored, never text of the book: the page finds the sentence again by
-- chapter key + sentence number + a checksum of its text (sh). The page works local first (localStorage "cn.notes"), so the
-- id comes from the device; an entry without text is a bookmark. A delete is kept as deleted = true, so it also reaches the
-- other device. The newer updated_at wins (set by the page).
--
-- Private: only the owner sees and changes rows (RLS, login of svp-auth.js); anon gets nothing.
-- Grants written out (new tables in public need them from 30.10.2026).
--
-- Additive + reversible: drop table public.hoerbuch_notes. Idempotent.

create table if not exists public.hoerbuch_notes (
  id          text        primary key check (char_length(id) between 6 and 40),
  user_id     uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  book        text        not null check (char_length(book) between 1 and 40),
  ch          text        not null check (char_length(ch) between 1 and 40),     -- chapter key, e.g. '1', 'de-1'
  s           integer     not null check (s >= 0),                              -- sentence number in the chapter
  sh          text        not null default '' check (char_length(sh) <= 16),     -- checksum of the sentence text
  wi          integer,                                                          -- word in the sentence
  pos         real,                                                             -- seconds into the chapter's sound, null = text only
  note        text        not null default '' check (char_length(note) <= 20000),
  deleted     boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists hoerbuch_notes_user_book_idx on public.hoerbuch_notes (user_id, book);

alter table public.hoerbuch_notes enable row level security;
drop policy if exists hoerbuch_notes_select on public.hoerbuch_notes;
drop policy if exists hoerbuch_notes_insert on public.hoerbuch_notes;
drop policy if exists hoerbuch_notes_update on public.hoerbuch_notes;
drop policy if exists hoerbuch_notes_delete on public.hoerbuch_notes;
create policy hoerbuch_notes_select on public.hoerbuch_notes for select to authenticated using (user_id = auth.uid());
create policy hoerbuch_notes_insert on public.hoerbuch_notes for insert to authenticated with check (user_id = auth.uid());
create policy hoerbuch_notes_update on public.hoerbuch_notes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy hoerbuch_notes_delete on public.hoerbuch_notes for delete to authenticated using (user_id = auth.uid());

revoke all on public.hoerbuch_notes from anon;
grant select, insert, update, delete on public.hoerbuch_notes to authenticated;
grant select, insert, update, delete on public.hoerbuch_notes to service_role;
