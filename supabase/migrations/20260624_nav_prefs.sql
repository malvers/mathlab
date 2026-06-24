-- Per-user navigation preferences (Doc 2026-06-24): "Zuhause" + recent destinations used to live ONLY in
-- each device's localStorage (per-origin), so Home set on the phone never reached the laptop/localhost. We
-- now sync them per user, isolated exactly like tracks: one row per auth.uid(), guarded by RLS so a stranger
-- (their own anon uid / their own sync code) never sees another user's Home or destinations.
--
-- Mirrors the public.tracks ownership model: user_id default auth.uid(), RLS auth.uid() = user_id for all CRUD.
-- Additive + reversible (drop table to undo). NEVER stores a password/secret — only coordinates + labels.
--
-- Apply: paste into Supabase → SQL Editor → Run. Idempotent (safe to re-run).

create table if not exists public.nav_prefs (
  user_id    uuid        primary key default auth.uid(),     -- one row per user; owner = the authenticated uid
  home       jsonb,                                          -- { lat, lng, label } or null
  history    jsonb       not null default '[]'::jsonb,       -- recent destinations [{ lat, lng, label, t }, …]
  updated_at timestamptz not null default now()
);

alter table public.nav_prefs enable row level security;

-- Owner-only access, same shape as the tracks policies.
drop policy if exists nav_prefs_select on public.nav_prefs;
drop policy if exists nav_prefs_insert on public.nav_prefs;
drop policy if exists nav_prefs_update on public.nav_prefs;
drop policy if exists nav_prefs_delete on public.nav_prefs;

create policy nav_prefs_select on public.nav_prefs for select using (auth.uid() = user_id);
create policy nav_prefs_insert on public.nav_prefs for insert with check (auth.uid() = user_id);
create policy nav_prefs_update on public.nav_prefs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy nav_prefs_delete on public.nav_prefs for delete using (auth.uid() = user_id);
