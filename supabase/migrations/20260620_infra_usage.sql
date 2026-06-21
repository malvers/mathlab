-- infra-usage: daily watchdog support — a DB-size helper RPC + the pg_cron job that pings the Edge Function.
-- Paired with supabase/functions/infra-usage/index.ts. NO secret lives in this file (Rule 18/21): the cron
-- reads the app password from Supabase Vault at call time.
--
-- One-time prerequisites (Dashboard → Database → Extensions): enable  pg_cron · pg_net · supabase_vault.
-- One-time Vault secret (SQL editor, paste the real app password ONCE — it is stored encrypted, not here):
--   select vault.create_secret('<LABAI_PASSWORD>', 'labai_password');

-- 1) DB size in bytes. SECURITY DEFINER so the service-role Edge Function can read it; locked to service_role.
create or replace function public.db_size_bytes()
returns bigint
language sql
security definer
set search_path = ''
as $$
  select pg_database_size(current_database());
$$;

revoke all on function public.db_size_bytes() from public, anon, authenticated;
grant execute on function public.db_size_bytes() to service_role;

-- 2) Daily 06:00 UTC (08:00 CEST): pg_net POSTs to the function with the app password from the Vault.
--    Re-running this migration replaces the schedule (unschedule-if-exists, then schedule).
select cron.unschedule('daily-infra-usage')
where exists (select 1 from cron.job where jobname = 'daily-infra-usage');

select cron.schedule('daily-infra-usage', '0 6 * * *', $cron$
  select net.http_post(
    url     := 'https://fyfhxzyymmurlaenmzse.functions.supabase.co/infra-usage',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-app-pass', (select decrypted_secret from vault.decrypted_secrets where name = 'labai_password')
    ),
    body    := '{}'::jsonb
  );
$cron$);
