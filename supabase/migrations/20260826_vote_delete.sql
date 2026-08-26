-- vote: host may delete its own questions (Doc 2026-08-26, ⌘⇧⌫ on the host screen).
-- No DELETE policy for anon (anyone with the publishable key could wipe the table). Instead the host keeps a
-- random owner token in localStorage, stores only its SHA-256 in the poll row, and deletes through a
-- security-definer RPC that checks the hash. Rows without a hash (pre-feature test polls) are deletable too.
-- Idempotent; reversible (drop function, drop column).

create extension if not exists pgcrypto with schema extensions;

alter table public.vote_polls add column if not exists owner_hash text;

create or replace function public.vote_delete_poll(p_id uuid, p_owner text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  with del as (
    delete from public.vote_polls
    where id = p_id
      and (owner_hash is null or owner_hash = encode(extensions.digest(p_owner, 'sha256'), 'hex'))
    returning 1
  )
  select exists (select 1 from del);
$$;

revoke all on function public.vote_delete_poll(uuid, text) from public;
grant execute on function public.vote_delete_poll(uuid, text) to anon, authenticated;
