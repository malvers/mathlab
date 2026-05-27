-- ===========================================================================
-- VGP — DB RESET (data only). Run in the Supabase SQL Editor.
-- Project: fyfhxzyymmurlaenmzse
--
-- Wipes ALL app DATA back to zero but keeps EVERY structure:
-- tables, columns, RLS policies, realtime publication, storage bucket + its
-- policies, Edge Functions, webhooks — all untouched. Only rows are removed.
--
-- TRUNCATE ... RESTART IDENTITY also resets the bigint id sequences (reactions
-- etc.) so new rows start at 1 again. No DROP, no ALTER → schema stays intact.
--
-- NOTE: Storage files in the "media" bucket are NOT removed by this SQL
-- (see the manual step at the bottom).
-- ===========================================================================

truncate table
  public.messages,
  public.reactions,
  public.identities,
  public.receipts,
  public.group_meta,
  public.vaults,
  public.push_subscriptions
restart identity cascade;

-- ===========================================================================
-- STORAGE: empty the encrypted-media bucket (the E2E image/voice blobs).
-- SQL can clear the object index, but the safe/complete way is the dashboard.
--
--   Recommended: Dashboard → Storage → "media" → select all → Delete.
--
-- If you prefer SQL (clears the index; bucket + policies stay):
--   delete from storage.objects where bucket_id = 'media';
--
-- ===========================================================================

-- OPTIONAL — also drop the throwaway anonymous-auth users (forces a fresh
-- anonymous session on next visit; harmless to leave them). Uncomment if wanted:
--   delete from auth.users where is_anonymous = true;
