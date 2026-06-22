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

// ── AI-Kosten (Phase 1: GEMESSENE Tokens × Listenpreis → ~die echte Rechnung; Phase 2 holt die echten
//    Provider-Zahlen). Preistabelle spiegelt solita-brain.js. Cache: Anthropic read 0.1×/write 1.25×,
//    DeepSeek hit 0.26×/kein Write-Aufschlag. Gemini: pro Token, kein Cache hier. ──
const USD_EUR = 0.92;
const PRICES: Record<string, [number, number]> = {   // [in, out] $/1M tokens
  'claude-sonnet-4-6': [3, 15], 'claude-opus-4-8': [5, 25], 'claude-haiku-4-5': [1, 5],
  'deepseek-chat': [0.27, 1.10], 'deepseek-reasoner': [0.55, 2.19],
  'gemini-2.5-flash': [0.30, 2.50], 'gemini-2.5-flash-lite': [0.10, 0.40], 'gemini-2.5-pro': [1.25, 10],
};
function priceFor(model: string): [number, number] {
  const k = Object.keys(PRICES).find((p) => model && model.indexOf(p) === 0);
  return k ? PRICES[k] : [3, 15];
}
function rowEur(provider: string, model: string, inTok: number, outTok: number, cr: number, cw: number): number {
  const p = priceFor(model || '');
  const isDS = /^deepseek/.test(provider) || /^deepseek/.test(model || '');
  const readMul = isDS ? 0.26 : 0.1, writeMul = isDS ? 1 : 1.25;
  return (inTok * p[0] + cr * p[0] * readMul + cw * p[0] * writeMul + outTok * p[1]) / 1e6 * USD_EUR;
}
// Sum the last 24 h of ai_cost_log per provider (via the SECURITY-DEFINER RPC). Fully best-effort — a
// missing table / RPC error must NEVER break the infra mail, so it returns empty on any problem.
async function aiCostToday(): Promise<{ byProvider: Record<string, number>; total: number; calls: number }> {
  const out: Record<string, number> = {}; let total = 0, calls = 0;
  try {
    const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return { byProvider: out, total, calls };
    const supa = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supa.rpc('ai_cost_summary', { days: 1 });
    if (error || !Array.isArray(data)) return { byProvider: out, total, calls };
    for (const r of data as Array<Record<string, unknown>>) {
      const eur = rowEur(String(r.provider), String(r.model || ''), Number(r.in_tok), Number(r.out_tok), Number(r.cache_read), Number(r.cache_write));
      out[String(r.provider)] = (out[String(r.provider)] || 0) + eur;
      total += eur; calls += Number(r.n) || 0;
    }
  } catch (_) { /* cost section is optional — never fail the watchdog mail */ }
  return { byProvider: out, total, calls };
}
// Graduated precision so DeepSeek's sub-cent sums don't collapse to "0.0 ¢" (Doc: „mehr NKS"):
// ≥1 € → Euro · ≥10 ¢ → 1 NKS · ≥1 ¢ → 2 NKS · <1 ¢ → 3 NKS.
const eurFmt = (e: number) => {
  const c = e * 100;
  if (c >= 100) return '€ ' + e.toFixed(2);
  if (c >= 10) return c.toFixed(1) + ' ¢';
  if (c >= 1) return c.toFixed(2) + ' ¢';
  return c.toFixed(3) + ' ¢';
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  try {
    const [r2, db, ai] = await Promise.all([r2BytesUsed(), dbBytesUsed(), aiCostToday()]);
    const r2pct = pct(r2, R2_QUOTA_GB), dbpct = pct(db, DB_QUOTA_GB);
    const provs = Object.keys(ai.byProvider).sort();
    const LBL: Record<string, string> = { claude: 'Claude', deepseek: 'DeepSeek', gemini: 'Gemini' };
    const aiSection = provs.length
      ? `\nKI-Kosten (gemessene Tokens × Listenpreis, letzte 24 h):\n`
        + provs.map((p) => `• ${LBL[p] || p}: ${eurFmt(ai.byProvider[p])}`).join('\n')
        + `\n  Σ ${eurFmt(ai.total)}  (${ai.calls} Calls)\n`
      : '';
    const subject = `📊 Infra: R2 ${r2pct}% · DB ${dbpct}%` + (ai.total > 0 ? ` · KI ${eurFmt(ai.total)}` : '');
    const body =
      `Tägliche Infra-Auslastung:\n\n` +
      `• R2-Storage:  ${r2pct}% von ${R2_QUOTA_GB} GB  (${gb(r2)} GB)\n` +
      `• Supabase-DB: ${dbpct}% von ${DB_QUOTA_GB} GB  (${gb(db)} GB)\n` +
      aiSection + `\n` +
      `Exakte Kosten beim Anbieter:\n` +
      `• Claude:   https://console.anthropic.com/settings/cost\n` +
      `• Gemini:   https://console.cloud.google.com/billing/01B7AA-7DDDCA-D629CE\n` +
      `• DeepSeek: https://platform.deepseek.com/usage\n\n` +
      ((r2pct >= 80 || dbpct >= 80) ? '⚠️ Achtung: ein Wert über 80% — Zeit, aufzuräumen.\n' : 'Alles im grünen Bereich.\n');
    if (!b.dry) await sendMail(subject, body, pass);
    return json({ ok: true, r2pct, dbpct, r2bytes: r2, dbbytes: db, ai: { byProvider: ai.byProvider, total: ai.total, calls: ai.calls }, mailed: !b.dry });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
