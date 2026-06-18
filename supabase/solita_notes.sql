-- Solita — PRIVATE notes store (Doc 2026-06-18). Moves notes OFF the public repo into a private,
-- RLS-locked table. Only the 'solita-note' Edge Function (service role) may read/write it — anon/auth
-- clients get nothing. Same privacy model as the chat history (solita_history).
--
-- Run ONCE in the Supabase SQL editor (project fyfhxzyymmurlaenmzse).

create table if not exists public.solita_notes (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  text       text not null
);

-- Deny-all: enabling RLS with NO policies means no anon/auth access at all. The Edge Function uses the
-- service role, which bypasses RLS — so the notes are reachable ONLY through the password-gated function.
alter table public.solita_notes enable row level security;

-- ── Optional one-time import of the existing (public-repo) notes ──────────────────────────────────────
-- These are harmless feature-ideas; import them if you want continuity, or skip for a clean private start.
-- (Times are the local stamps from the old markdown file.)
-- insert into public.solita_notes (created_at, text) values
--   ('2026-06-15 16:37+02', 'Herkunft des Wortes „Spelunking" …'),
--   ('2026-06-17 07:13+02', 'Doc vergisst häufig Dinge — im Hinterkopf behalten und bei Bedarf sanft erinnern.');
-- … (sag Bescheid, dann generiere ich die vollständige INSERT-Liste aus solita-notizen.md)
