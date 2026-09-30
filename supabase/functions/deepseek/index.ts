// Tracker/Labs — "deepseek" Edge Function. Password-gated proxy for the DeepSeek chat API so the API
// key lives ONLY here as the env secret DEEPSEEK_API_KEY — never in the public client (labai.html).
// Access is gated by a shared password (env secret LABAI_PASSWORD): the client sends the password the
// user typed in the X-App-Pass header; we reject anything else with 401. This keeps the public
// function URL from being an open, billable DeepSeek endpoint.
//
// Client contract:
//   { ping: true }                          -> just verifies the password, returns { ok: true } (no DeepSeek call)
//   { model, messages, temperature?, max_tokens? } -> forwards to DeepSeek, returns its JSON verbatim
//
// Deploy (no JWT — own password gate, touches no user data):
//   supabase functions deploy deepseek --no-verify-jwt
// Secrets (Dashboard → Edge Functions → Secrets):
//   DEEPSEEK_API_KEY  — a DeepSeek API key (platform.deepseek.com/api_keys)
//   LABAI_PASSWORD    — the login password for labai.html

const DEEPSEEK = 'https://api.deepseek.com/v1/chat/completions';

// DeepSeek's models are deepseek-flash (V4.1 Flash) and deepseek-v4-pro (api-docs.deepseek.com, read 30.09.2026).
// Our pages still ask for the old names; DeepSeek announced their end for 2026-07-24, until then they stood for
// Flash without and with thinking. They are translated here, in one place, so no page has to change and the cost
// log names the model that is billed (Doc, 30.09.2026: "bitte korrigieren"). The new models THINK by default -
// slower and dearer; a chat name gets thinking switched off, as it always was. [model, thinking]
const ALT: Record<string, [string, boolean]> = {
  'deepseek-chat': ['deepseek-flash', false],
  'deepseek-reasoner': ['deepseek-flash', true],
  'deepseek-v4-flash': ['deepseek-flash', false],
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// Fire-and-forget: append ONE token-usage row to ai_cost_log for the daily infra cost mail. Best-effort
// (try/catch) — a logging hiccup must NEVER affect the chat. DeepSeek/OpenAI usage shape: prompt_tokens
// (INCLUDES cache hits) / completion_tokens / prompt_cache_hit_tokens. Pricing happens later in infra-usage.
async function logAiCost(model: string, u: Record<string, number> | undefined) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !svc || !u) return;
    const cr = u.prompt_cache_hit_tokens || 0;
    await fetch(url + '/rest/v1/ai_cost_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        provider: 'deepseek', model,
        in_tok: Math.max(0, (u.prompt_tokens || 0) - cr),
        out_tok: u.completion_tokens || 0,
        cache_read: cr,
        cache_write: 0,
        label: 'chat',
      }),
    });
  } catch (_) { /* logging must never break the chat */ }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const key = Deno.env.get('DEEPSEEK_API_KEY');
  if (!key) return json({ error: 'DEEPSEEK_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);
  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);

  // Password-only check (used by the login overlay) — no DeepSeek call, no cost.
  if (b.ping) return json({ ok: true });

  if (!Array.isArray(b.messages)) return json({ error: 'keine messages übergeben' }, 400);

  const wanted = typeof b.model === 'string' ? b.model : 'deepseek-chat';
  const asked: Record<string, unknown> = {
    model: wanted,
    messages: b.messages,
    temperature: (typeof b.temperature === 'number') ? b.temperature : 0.6,
    max_tokens: (typeof b.max_tokens === 'number') ? b.max_tokens : 3000,
  };
  // an old name: today's model, thinking as that name meant it (or as the page says: thinking true/false)
  const neu = ALT[wanted];
  let body: Record<string, unknown> = asked;
  if (neu) {
    const denkt = typeof b.thinking === 'boolean' ? b.thinking : neu[1];
    body = { ...asked, model: neu[0], thinking: { type: denkt ? 'enabled' : 'disabled' } };
  } else if (typeof b.thinking === 'boolean') {
    body = { ...asked, thinking: { type: b.thinking ? 'enabled' : 'disabled' } };
  }

  const call = (payload: Record<string, unknown>) => fetch(DEEPSEEK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify(payload),
  });

  try {
    let r = await call(body);
    let data = await r.json().catch(() => ({}));
    // the translated request refused: once more exactly as the page asked, as before this change - never worse
    if (!r.ok && body !== asked) {
      const r2 = await call(asked);
      const d2 = await r2.json().catch(() => ({}));
      if (r2.ok) { r = r2; data = d2; body = asked; }
    }
    if (r.ok && data && data.usage) {   // cost mail: record this call's tokens in the background (zero latency)
      try {
        const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
        const p = logAiCost(String(body.model), data.usage);
        if (er?.waitUntil) er.waitUntil(p);
      } catch (_) { /* never affect the chat */ }
    }
    return json(data, r.ok ? 200 : (r.status || 502)); // pass DeepSeek's response (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
