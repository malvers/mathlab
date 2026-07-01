// Tracker/Labs — "infra-usage" Edge Function: the DAILY infra watchdog.
//
// Emails Doc (as Solita) the utilization numbers so a quota overflow can never sneak up on us again
// (the 2026-06-19 egress lockout was the trigger — though egress itself is now ~0 since media moved to R2):
//   • R2 storage    — % of the 10 GB R2 free quota (all photos/voice live here now → this is the real risk)
//   • Supabase DB   — % of the 0.5 GB Free-Plan database-size limit
//   • GitHub Pages  — % of the 1 GB published-site limit (a Pages deploy timed out at ~209 MB on 2026-06-30;
//                     public repo → no token needed, and Actions minutes/bandwidth aren't a concern here)
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
const GH_PAGES_QUOTA_GB = 1;          // GitHub Pages published-site soft limit
const GH_REPO = 'malvers/mathlab';    // public repo → no token needed for the Git Trees API

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

// GitHub Pages published size vs the 1 GB soft limit — the only real GitHub "Auslastung" risk for us (a
// public repo → Actions minutes are free/unlimited, and Pages bandwidth would need a billing token we
// deliberately don't add, Rule 18). The repo is PUBLIC, so the Git Trees API needs NO auth: one call, sum
// the blob sizes that end up in the Pages artifact = everything under HTML/ PLUS repo-root
// resources/screenshots/ (the deploy workflow copies those into the site tree). Best-effort: any problem
// (rate limit, truncated tree, network) returns null so it can NEVER break the R2/DB watchdog mail.
async function ghPagesBytesUsed(): Promise<number | null> {
  try {
    const r = await fetch(`https://api.github.com/repos/${GH_REPO}/git/trees/main?recursive=1`, {
      headers: { 'User-Agent': 'infra-usage-watchdog', 'Accept': 'application/vnd.github+json' },
    });
    if (!r.ok) return null;
    const j = await r.json();
    // A truncated tree would undercount → report nothing rather than a wrong % (honest, no faking).
    if (!j || !Array.isArray(j.tree) || j.truncated) return null;
    let total = 0;
    for (const t of j.tree) {
      if (t && t.type === 'blob' && typeof t.path === 'string'
        && (t.path.startsWith('HTML/') || t.path.startsWith('resources/screenshots/'))) {
        total += Number(t.size) || 0;
      }
    }
    return total;
  } catch (_) { return null; }
}

// Send the daily mail through the existing gmail-send function (it signs as Solita for us).
async function sendMail(subject: string, body: string, html: string, pass: string): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL');
  const r = await fetch(url + '/functions/v1/gmail-send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-app-pass': pass },
    body: JSON.stringify({ subject, body, html }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.ok) throw new Error('gmail-send: ' + (d.error || ('HTTP ' + r.status)));
}

const pctN = (used: number, quotaGb: number) => (used / (quotaGb * GB)) * 100;   // exact % (number, not rounded)
const de = (n: number, d: number) => n.toFixed(d).replace('.', ',');             // German decimal comma, fixed places
const gbDe = (b: number) => de(b / GB, b < GB ? 3 : 2);                          // bytes → GB, German comma

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

// Count grounded Google searches in the last 24 h (ai_cost_log rows tagged label='search') → drives the
// "X / 1500 gratis" line. Google grounds 1500 prompts/day free, then $35/1000 — so this is the cap-watch.
// Best-effort: any problem → 0 (must never break the watchdog mail).
async function geminiSearchCount(): Promise<number> {
  try {
    const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return 0;
    const supa = createClient(url, key, { auth: { persistSession: false } });
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count, error } = await supa.from('ai_cost_log')
      .select('*', { count: 'exact', head: true })
      .eq('label', 'search').gte('created_at', since);
    if (error) return 0;
    return count || 0;
  } catch (_) { return 0; }
}
// Graduated precision so DeepSeek's sub-cent sums don't collapse to "0.0 ¢" (Doc: „mehr NKS"):
// ≥1 € → Euro · ≥10 ¢ → 1 NKS · ≥1 ¢ → 2 NKS · <1 ¢ → 3 NKS.
// All-time priced AI total from ai_cost_log (server-authoritative → the cross-device Σ; localStorage counters
// would clobber when two devices both count). Reuses the SAME pricing as the daily mail (single source).
async function aiTotalAllTimeEur(): Promise<number> {
  try {
    const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return 0;
    const supa = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supa.rpc('ai_cost_summary', { days: 36500 });   // ~all time
    if (error || !Array.isArray(data)) return 0;
    let total = 0;
    for (const r of data as Array<Record<string, unknown>>) {
      total += rowEur(String(r.provider), String(r.model || ''), Number(r.in_tok), Number(r.out_tok), Number(r.cache_read), Number(r.cache_write));
    }
    return total;
  } catch (_) { return 0; }
}

const eurFmt = (e: number) => {
  const c = e * 100;
  const s = c >= 100 ? '€ ' + e.toFixed(2)
    : c >= 10 ? c.toFixed(1) + ' ¢'
      : c >= 1 ? c.toFixed(2) + ' ¢'
        : c.toFixed(3) + ' ¢';
  return s.replace('.', ',');   // deutsche Komma-Schreibweise, konsistent mit den Prozenten
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  // Fast cost-only mode for Solita's cross-device Σ: just the all-time priced AI total, no R2/DB/mail.
  if (b.costOnly) {
    const totalAllTimeEur = await aiTotalAllTimeEur();
    return json({ ok: true, totalAllTimeEur });
  }

  try {
    const [r2, db, ai, searches, ghBytes] = await Promise.all([r2BytesUsed(), dbBytesUsed(), aiCostToday(), geminiSearchCount(), ghPagesBytesUsed()]);
    const r2pctN = pctN(r2, R2_QUOTA_GB), dbpctN = pctN(db, DB_QUOTA_GB);
    const r2pct = de(r2pctN, 2), dbpct = de(dbpctN, 2);   // 2 Nachkommastellen, deutsche Komma-Schreibweise
    const ghPctN = ghBytes != null ? pctN(ghBytes, GH_PAGES_QUOTA_GB) : null;   // null → GitHub unreachable, skip the row
    const ghpct = ghPctN != null ? de(ghPctN, 2) : '';
    const warn = r2pctN >= 80 || dbpctN >= 80 || (ghPctN != null && ghPctN >= 80);
    const provs = Object.keys(ai.byProvider).sort();
    const LBL: Record<string, string> = { claude: 'Claude', deepseek: 'DeepSeek', gemini: 'Gemini' };
    const subject = 'Stats and costs';

    // ── Plaintext-Body (Fallback im multipart/alternative) ──
    const aiText = provs.length
      ? `\nKI-Kosten (gemessene Tokens × Listenpreis, letzte 24 h):\n`
        + provs.map((p) => `• ${LBL[p] || p}: ${eurFmt(ai.byProvider[p])}`).join('\n')
        + `\n  Σ ${eurFmt(ai.total)}  (${ai.calls} Calls)\n`
      : '';
    const body =
      `Tägliche Auslastung:\n\n` +
      `• R2-Storage:  ${r2pct}% von ${R2_QUOTA_GB} GB  (${gbDe(r2)} GB)\n` +
      `• Supabase-DB: ${dbpct}% von ${de(DB_QUOTA_GB, 1)} GB  (${gbDe(db)} GB)\n` +
      (ghPctN != null ? `• GitHub Pages: ${ghpct}% von ${GH_PAGES_QUOTA_GB} GB  (${gbDe(ghBytes!)} GB)\n` : '') +
      aiText +
      (searches > 0 ? `\nGemini-Suchen (24 h): ${searches} / 1500 gratis\n` : '') + `\n` +
      `Verbrauch beim Anbieter:\n` +
      `• Cloudflare R2: https://dash.cloudflare.com/?to=/:account/r2/overview\n` +
      `• Supabase:      https://supabase.com/dashboard/project/fyfhxzyymmurlaenmzse/reports/database\n\n` +
      `Exakte Kosten beim Anbieter:\n` +
      `• Claude:   https://console.anthropic.com/settings/cost\n` +
      `• Gemini:   https://aistudio.google.com/spend\n` +
      `• DeepSeek: https://platform.deepseek.com/usage\n\n` +
      (warn ? '⚠️ Achtung: ein Wert über 80% — Zeit, aufzuräumen.\n' : 'Alles im grünen Bereich.\n');

    // ── HTML-Body: die schöne Tabelle (Email-sicher: Inline-Styles, table-basiert, Arial) ──
    const stamp = new Date().toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' });
    const C = { ink: '#1a2238', muted: '#6b7a99', line: '#e3e8f0', shade: '#f6f8fc', navy: 'rgb(8,20,42)', green: 'rgb(121,158,49)', red: 'rgb(176,36,24)' };
    const col = (n: number) => (n >= 80 ? C.red : C.green);
    const bar = (n: number) =>
      `<div style="background:${C.line};border-radius:3px;height:6px;width:130px;margin-top:5px;">`
      + `<div style="background:${col(n)};height:6px;border-radius:3px;width:${Math.max(2, Math.min(100, n)).toFixed(1)}%;"></div></div>`;
    const cell = (x: string) => `padding:10px 12px;border-bottom:1px solid ${C.line};${x}`;
    const usageRow = (icon: string, name: string, n: number, pctStr: string, used: string, quota: string, shade: boolean) =>
      `<tr style="background:${shade ? C.shade : '#ffffff'};">`
      + `<td style="${cell('')}">${icon}&nbsp; ${name}</td>`
      + `<td style="${cell('text-align:right;white-space:nowrap;')}"><span style="font-weight:bold;color:${col(n)};font-size:15px;">${pctStr}&nbsp;%</span>${bar(n)}</td>`
      + `<td style="${cell('text-align:right;white-space:nowrap;color:' + C.ink + ';')}">${used}&nbsp;GB</td>`
      + `<td style="${cell('text-align:right;white-space:nowrap;color:' + C.muted + ';')}">${quota}</td></tr>`;
    const aiHtml = provs.length
      ? `<h3 style="color:${C.navy};font-size:15px;margin:24px 0 8px;">KI-Kosten · letzte 24 h</h3>`
        + `<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;font-size:14px;">`
        + provs.map((p, i) =>
            `<tr style="background:${i % 2 ? C.shade : '#ffffff'};"><td style="padding:7px 12px;border-bottom:1px solid ${C.line};">${LBL[p] || p}</td>`
            + `<td style="padding:7px 12px;border-bottom:1px solid ${C.line};text-align:right;">${eurFmt(ai.byProvider[p])}</td></tr>`).join('')
        + `<tr><td style="padding:9px 12px;font-weight:bold;">Σ gesamt</td>`
        + `<td style="padding:9px 12px;text-align:right;font-weight:bold;">${eurFmt(ai.total)} <span style="color:${C.muted};font-weight:normal;">(${ai.calls} Calls)</span></td></tr></table>`
        + (searches > 0 ? `<p style="color:${C.muted};font-size:13px;margin:8px 0 0;">Gemini-Suchen: <b style="color:${C.ink};">${searches}</b>&nbsp;/&nbsp;1500 gratis</p>` : '')
      : '';
    const html =
      `<div style="font-family:Arial,Helvetica,sans-serif;color:${C.ink};max-width:580px;padding:4px;">`
      + `<h2 style="color:${C.navy};margin:0 0 2px;font-size:20px;">📊 Auslastung</h2>`
      + `<p style="color:${C.muted};margin:0 0 18px;font-size:13px;">${stamp}</p>`
      + `<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;font-size:14px;">`
      + `<thead><tr style="background:${C.navy};color:#ffffff;">`
      + `<th style="text-align:left;padding:9px 12px;font-weight:600;">Dienst</th>`
      + `<th style="text-align:right;padding:9px 12px;font-weight:600;">Auslastung</th>`
      + `<th style="text-align:right;padding:9px 12px;font-weight:600;">Belegt</th>`
      + `<th style="text-align:right;padding:9px 12px;font-weight:600;">Limit</th></tr></thead><tbody>`
      + usageRow('☁️', 'Cloudflare R2', r2pctN, r2pct, gbDe(r2), `${R2_QUOTA_GB} GB`, false)
      + usageRow('🗄️', 'Supabase DB', dbpctN, dbpct, gbDe(db), `${de(DB_QUOTA_GB, 1)} GB`, true)
      + (ghPctN != null ? usageRow('🐙', 'GitHub Pages', ghPctN, ghpct, gbDe(ghBytes!), `${GH_PAGES_QUOTA_GB} GB`, false) : '')
      + `</tbody></table>`
      + aiHtml
      + `<div style="margin:22px 0 0;padding:12px 14px;border-radius:8px;font-size:14px;font-weight:bold;`
      + `background:${warn ? 'rgba(176,36,24,.08)' : 'rgba(121,158,49,.10)'};color:${warn ? C.red : C.green};">`
      + `${warn ? '⚠️ Achtung: ein Wert über 80 % — Zeit, aufzuräumen.' : '✓ Alles im grünen Bereich.'}</div>`
      + `<p style="color:${C.muted};font-size:12px;margin:18px 0 0;line-height:1.8;">Verbrauch beim Anbieter:<br>`
      + `Cloudflare R2 · <a href="https://dash.cloudflare.com/?to=/:account/r2/overview" style="color:${C.navy};">dash.cloudflare.com</a> &nbsp;|&nbsp; `
      + `Supabase · <a href="https://supabase.com/dashboard/project/fyfhxzyymmurlaenmzse/reports/database" style="color:${C.navy};">supabase.com</a></p>`
      + `<p style="color:${C.muted};font-size:12px;margin:10px 0 0;line-height:1.8;">Exakte Kosten beim Anbieter:<br>`
      + `Claude · <a href="https://console.anthropic.com/settings/cost" style="color:${C.navy};">console.anthropic.com</a> &nbsp;|&nbsp; `
      + `Gemini · <a href="https://aistudio.google.com/spend" style="color:${C.navy};">aistudio.google.com</a> &nbsp;|&nbsp; `
      + `DeepSeek · <a href="https://platform.deepseek.com/usage" style="color:${C.navy};">platform.deepseek.com</a></p></div>`;

    // Gesprochene Zusammenfassung für Solitas /costs (vorgelesen → keine URLs; % ganzzahlig für Hörbarkeit).
    const eurSpoken = (e: number) => { const c = e * 100; return c < 100 ? (c < 10 ? c.toFixed(2) : c.toFixed(1)) + ' Cent' : e.toFixed(2) + ' Euro'; };
    const spoken =
      `Unsere Infra-Auslastung: R2-Speicher ${Math.round(r2pctN)} Prozent, Datenbank ${Math.round(dbpctN)} Prozent`
      + (ghPctN != null ? `, GitHub Pages ${Math.round(ghPctN)} Prozent` : '')
      + (ai.total > 0 ? `. KI-Kosten der letzten 24 Stunden ${eurSpoken(ai.total)}` : '')
      + (searches > 0 ? `, davon ${searches} von 1500 gratis Suchen` : '')
      + `. ${warn ? 'Achtung, ein Wert liegt über 80 Prozent.' : 'Alles im grünen Bereich.'}`;
    if (!b.dry) await sendMail(subject, body, html, pass);
    return json({ ok: true, r2pct, dbpct, ghpct: ghPctN != null ? ghpct : null, r2bytes: r2, dbbytes: db, ghbytes: ghBytes, searches, ai: { byProvider: ai.byProvider, total: ai.total, calls: ai.calls }, body, html, spoken, mailed: !b.dry });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
