// Tracker/Labs — "claude" Edge Function. Password-gated proxy for Anthropic's Claude Messages API so the
// API key lives ONLY here as the env secret ANTHROPIC_API_KEY — never in the public client (solita.html).
// Mirrors the "deepseek" function: access is gated by a shared password (env secret LABAI_PASSWORD); the
// client sends the user-typed password in the X-App-Pass header, anything else gets 401. Keeps the public
// function URL from being an open, billable Claude endpoint.
//
// Client contract (SAME as deepseek so the client stays almost unchanged):
//   { ping: true }                                  -> verifies the password, returns { ok: true } (no Claude call)
//   { model, messages, temperature?, max_tokens? }  -> forwards to Claude, returns an OpenAI-shaped reply:
//        { choices: [ { message: { role:'assistant', content: <text> } } ] }
//   messages: [{ role:'system'|'user'|'assistant', content:<string> }]. We lift any 'system' turns into
//   Anthropic's top-level `system` field; the rest go through as user/assistant turns.
//
// Deploy (no JWT — own password gate, touches no user data):
//   supabase functions deploy claude --no-verify-jwt
// Secrets (Dashboard → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY  — a Claude API key (console.anthropic.com)
//   LABAI_PASSWORD     — the same login password used by solita.html (shared with the deepseek proxy)

const ANTHROPIC = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-6'; // balanced/fast for a voice assistant; client can send opus/haiku

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

  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) return json({ error: 'ANTHROPIC_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);
  const pass = Deno.env.get('LABAI_PASSWORD');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);

  // Password-only check (used by the login overlay) — no Claude call, no cost.
  if (b.ping) return json({ ok: true });

  if (!Array.isArray(b.messages)) return json({ error: 'keine messages übergeben' }, 400);

  // Split Anthropic's separate `system` from the user/assistant turns. Drop any empty content.
  const turns = b.messages.filter((m: { role?: string; content?: unknown }) =>
    m && typeof m.content === 'string' && m.content.trim() !== '');
  const system = turns.filter((m: { role: string }) => m.role === 'system')
    .map((m: { content: string }) => m.content).join('\n\n');
  let chat = turns
    .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
    .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));
  // Anthropic requires the first turn to be 'user'. Drop any leading assistant turns.
  while (chat.length && chat[0].role === 'assistant') chat = chat.slice(1);
  if (!chat.length) return json({ error: 'keine user-Nachricht' }, 400);

  const body: Record<string, unknown> = {
    model: typeof b.model === 'string' && b.model ? b.model : DEFAULT_MODEL,
    max_tokens: (typeof b.max_tokens === 'number') ? b.max_tokens : 3000,
    temperature: (typeof b.temperature === 'number') ? b.temperature : 0.6,
    messages: chat,
  };
  if (system) body.system = system;

  try {
    const r = await fetch(ANTHROPIC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      // Pass Anthropic's error through (status + message) so the client can show something useful.
      const msg = (data && data.error && data.error.message) ? data.error.message : 'Claude-Fehler';
      return json({ error: msg }, r.status || 502);
    }
    // Anthropic: { content: [ { type:'text', text } , ... ] } → reshape to the OpenAI form the client reads.
    const text = Array.isArray(data.content)
      ? data.content.filter((c: { type: string }) => c.type === 'text')
          .map((c: { text: string }) => c.text).join('\n')
      : '';
    return json({ choices: [{ message: { role: 'assistant', content: text } }], usage: data.usage });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
