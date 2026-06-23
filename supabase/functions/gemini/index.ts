// Tracker/Labs — "gemini" Edge Function. Generic proxy for Google Generative Language
// (generateContent) so the API key lives ONLY here as the env secret GEMINI_API_KEY — never in a
// public client (morpheus/equationocr etc.). The client POSTs { model, body }, where body is the
// full generateContent payload ({ contents, generationConfig, ... }); we add the key, call Google,
// and return Google's JSON verbatim.
//
// Deploy (no JWT — it only calls an external API, touches no user data):
//   supabase functions deploy gemini --no-verify-jwt
// Secret: GEMINI_API_KEY (Dashboard → Edge Functions → Secrets) — a Google API key with the
// Generative Language API enabled. (Same secret the "identify" function uses.)

const GLA = 'https://generativelanguage.googleapis.com/v1beta/models/';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// Fire-and-forget: log Gemini token usage to ai_cost_log for the daily infra cost mail (same shape as the
// identify/claude functions). Best-effort — a logging hiccup must NEVER affect the response. Gemini shape:
// usageMetadata.promptTokenCount / candidatesTokenCount. `label` distinguishes callers (e.g. 'photo' vs
// 'search') — the grounded-search count drives the "X/1500 free" line in infra-usage. Pricing: infra-usage.
async function logGeminiCost(model: string, label: string, um: Record<string, number> | undefined) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !svc || !um) return;
    await fetch(url + '/rest/v1/ai_cost_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        provider: 'gemini', model,
        in_tok: um.promptTokenCount || 0,
        out_tok: um.candidatesTokenCount || 0,
        cache_read: um.cachedContentTokenCount || 0,
        cache_write: 0,
        label,
      }),
    });
  } catch (_) { /* logging must never affect the response */ }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const model = typeof b.model === 'string' ? b.model : '';
  const label = typeof b.label === 'string' ? b.label : 'gemini';   // caller tag for the cost log (e.g. 'photo'|'search')
  if (!model) return json({ error: 'kein model übergeben' }, 400);
  if (!b.body || typeof b.body !== 'object') return json({ error: 'kein body übergeben' }, 400);

  const url = GLA + encodeURIComponent(model) + ':generateContent?key=' + key;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b.body),
    });
    const data = await r.json().catch(() => ({}));
    // Record token usage in the BACKGROUND so the response is never delayed (waitUntil keeps the worker alive).
    if (r.ok && data && (data as { usageMetadata?: Record<string, number> }).usageMetadata) {
      try {
        const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
        const p = logGeminiCost(model, label, (data as { usageMetadata?: Record<string, number> }).usageMetadata);
        if (er?.waitUntil) er.waitUntil(p);
      } catch (_) { /* logging must never affect the response */ }
    }
    return json(data, r.ok ? 200 : (r.status || 502)); // pass Gemini's response (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
