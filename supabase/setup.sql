-- ===========================================================================
-- VGP — Supabase setup (idempotent). Run the whole file in the SQL Editor.
-- Project: fyfhxzyymmurlaenmzse  (https://fyfhxzyymmurlaenmzse.supabase.co)
--
-- Covers the policies / migrations / storage / realtime that the VGP client
-- needs. ASSUMES the base tables already exist (messages, identities,
-- receipts, group_meta, vaults, push_subscriptions) — this file does NOT
-- recreate them (their full DDL lives in the Supabase project, not here).
-- Re-running is safe: everything is guarded / drop-if-exists + create.
--
-- Security model (deliberately relaxed): everything is readable/writable by
-- authenticated users (incl. anonymous-auth). Message CONTENT stays private
-- via client-side E2E (ECDH/AES-GCM); impersonation is blocked by the per-
-- message ECDSA signature (a forged edit shows ⚠️ in the UI). Images in
-- Storage are encrypted client-side → the bucket only holds ciphertext.
-- ===========================================================================

-- --- messages: reply quote reference -------------------------------------
alter table public.messages add column if not exists reply_to text;

-- --- messages: RLS open to authenticated (read/insert/update/delete) ------
-- (edit needs UPDATE, delete-for-all needs DELETE; both were added mid-build)
alter table public.messages enable row level security;
drop policy if exists "vgp messages select" on public.messages;
drop policy if exists "vgp messages insert" on public.messages;
drop policy if exists "vgp messages update" on public.messages;
drop policy if exists "vgp messages delete" on public.messages;
create policy "vgp messages select" on public.messages for select to authenticated using (true);
create policy "vgp messages insert" on public.messages for insert to authenticated with check (true);
create policy "vgp messages update" on public.messages for update to authenticated using (true) with check (true);
create policy "vgp messages delete" on public.messages for delete to authenticated using (true);

-- --- reactions: emoji comments on a message -------------------------------
create table if not exists public.reactions (
  id         bigint generated always as identity primary key,
  message_id text        not null,
  pubkey     text        not null,
  emoji      text        not null,
  created_at timestamptz not null default now(),
  unique (message_id, pubkey)              -- one reaction per person per message
);
alter table public.reactions enable row level security;
drop policy if exists "vgp reactions select" on public.reactions;
drop policy if exists "vgp reactions insert" on public.reactions;
drop policy if exists "vgp reactions update" on public.reactions;
drop policy if exists "vgp reactions delete" on public.reactions;
create policy "vgp reactions select" on public.reactions for select to authenticated using (true);
create policy "vgp reactions insert" on public.reactions for insert to authenticated with check (true);
create policy "vgp reactions update" on public.reactions for update to authenticated using (true) with check (true);
create policy "vgp reactions delete" on public.reactions for delete to authenticated using (true);

-- --- Data-API grants (explicit, future-proof) -----------------------------
-- Supabase used to auto-grant public-schema tables to the API roles. From
-- 2026-10-30 newly created tables in existing projects no longer get the
-- automatic grant → we set them explicitly so this script keeps working on a
-- fresh project after that date. Idempotent: re-running is a no-op.
grant select, insert, update, delete on public.reactions to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- --- Realtime: live INSERT/UPDATE/DELETE for messages + reactions ---------
-- replica identity full → UPDATE/DELETE events carry enough to update the UI
alter table public.messages  replica identity full;
alter table public.reactions replica identity full;
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname='supabase_realtime' and schemaname='public' and tablename='reactions') then
    alter publication supabase_realtime add table public.reactions;
  end if;
end $$;

-- --- Storage: private "media" bucket for E2E-encrypted images --------------
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;
drop policy if exists "media read"   on storage.objects;
drop policy if exists "media insert" on storage.objects;
drop policy if exists "media delete" on storage.objects;
create policy "media read"   on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "media insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media delete" on storage.objects for delete to authenticated using (bucket_id = 'media');

-- ===========================================================================
-- NOT covered here (set up separately / outside SQL):
--   • Base tables' original DDL (messages/identities/receipts/group_meta/
--     vaults/push_subscriptions) — already in the project.
--   • Push: Edge Function "dynamic-responder" + its Secrets (VAPID_*,
--     VAPID_SUBJECT) + the DB Webhook on messages INSERT.
-- ===========================================================================
