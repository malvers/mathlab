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

  const body = {
    model: typeof b.model === 'string' ? b.model : 'deepseek-chat',
    messages: b.messages,
    temperature: (typeof b.temperature === 'number') ? b.temperature : 0.6,
    max_tokens: (typeof b.max_tokens === 'number') ? b.max_tokens : 3000,
  };

  try {
    const r = await fetch(DEEPSEEK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return json(data, r.ok ? 200 : (r.status || 502)); // pass DeepSeek's response (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
