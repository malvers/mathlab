// Tracker/Labs — "infra-usage" Edge Function: the DAILY infra watchdog.
//
// Emails Doc (as Solita) two utilization numbers so a quota overflow can never sneak up on us again
// (the 2026-06-19 egress lockout was the trigger — though egress itself is now ~0 since media moved to R2):
//   • R2 storage   — % of the 10 GB R2 free quota (all photos/voice live here now → this is the real risk)
//   • Supabase DB  — % of the 0.5 GB Free-Plan database-size limit
//
// REUSES existing infra only — NO new tokens/secrets (Rule 18/21):
//   • R2_*            — same S3 creds the media-sign function already uses (list bucket → sum object sizes)
//   • db_size_bytes() — SECURITY DEFINER RPC (see migration) read via the auto-injected service-role key
//   • gmail-send      — the existing Solita mail function (x-app-pass == LABAI_PASSWORD), appends the signature
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are auto-injected by the Edge runtime (no manual secret).
//
// Trigger: a daily pg_cron job POSTs here with x-app-pass == LABAI_PASSWORD (see the migration).
// Manual check: POST { ping: true } with the same header → { ok: true } (no mail sent).
//
// Deploy (after Supabase is un-restricted again):
//   supabase functions deploy infra-usage --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
// (--no-verify-jwt so pg_cron/pg_net can call it; the x-app-pass gate below is what actually protects it.)

import { AwsClient } from 'https://esm.sh/aws4fetch@1.0.20';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

const GB = 1024 ** 3;
const R2_QUOTA_GB = 10;    // Cloudflare R2 free storage
const DB_QUOTA_GB = 0.5;   // Supabase Free-Plan database size limit

// Sum every object's <Size> in the R2 bucket via S3 ListObjectsV2 (paginated). Same creds as media-sign.
async function r2BytesUsed(): Promise<number> {
  const accountId = Deno.env.get('R2_ACCOUNT_ID');
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
  const bucket = Deno.env.get('R2_BUCKET');
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) throw new Error('R2_* Secrets fehlen');

  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
  let total = 0;
  let cont: string | undefined;
  do {
    const u = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucket}`);
    u.searchParams.set('list-type', '2');
    u.searchParams.set('max-keys', '1000');
    if (cont) u.searchParams.set('continuation-token', cont);
    const r = await client.fetch(u.toString(), { method: 'GET' });
    if (!r.ok) throw new Error('R2 ListObjectsV2 ' + r.status);
    const xml = await r.text();
    for (const m of xml.matchAll(/<Size>(\d+)<\/Size>/g)) total += parseInt(m[1], 10);
    const truncated = /<IsTruncated>\s*true\s*<\/IsTruncated>/i.test(xml);
    const nt = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/);
    cont = truncated && nt ? nt[1] : undefined;
  } while (cont);
  return total;
}

// Supabase database size via the SECURITY DEFINER RPC (service-role only). No Management token needed.
async function dbBytesUsed(): Promise<number> {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('SUPABASE_URL/SERVICE_ROLE_KEY fehlen');
  const supa = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supa.rpc('db_size_bytes');
  if (error) throw new Error('db_size_bytes: ' + error.message);
  return Number(data);
}

// Send the daily mail through the existing gmail-send function (it signs as Solita for us).
async function sendMail(subject: string, body: string, pass: string): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL');
  const r = await fetch(url + '/functions/v1/gmail-send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-app-pass': pass },
    body: JSON.stringify({ subject, body }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.ok) throw new Error('gmail-send: ' + (d.error || ('HTTP ' + r.status)));
}

const pct = (used: number, quotaGb: number) => Math.round((used / (quotaGb * GB)) * 100);
const gb = (b: number) => (b / GB).toFixed(b < GB ? 3 : 2);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  try {
    const [r2, db] = await Promise.all([r2BytesUsed(), dbBytesUsed()]);
    const r2pct = pct(r2, R2_QUOTA_GB), dbpct = pct(db, DB_QUOTA_GB);
    const subject = `📊 Infra: R2 ${r2pct}% · DB ${dbpct}%`;
    const body =
      `Tägliche Infra-Auslastung:\n\n` +
      `• R2-Storage:  ${r2pct}% von ${R2_QUOTA_GB} GB  (${gb(r2)} GB)\n` +
      `• Supabase-DB: ${dbpct}% von ${DB_QUOTA_GB} GB  (${gb(db)} GB)\n\n` +
      ((r2pct >= 80 || dbpct >= 80) ? '⚠️ Achtung: ein Wert über 80% — Zeit, aufzuräumen.\n' : 'Alles im grünen Bereich.\n');
    if (!b.dry) await sendMail(subject, body, pass);
    return json({ ok: true, r2pct, dbpct, r2bytes: r2, dbbytes: db, mailed: !b.dry });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
