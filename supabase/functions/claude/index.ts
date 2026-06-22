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
const DEFAULT_MODEL = 'claude-sonnet-4-6'; // balanced/fast for a voice assistant; client may send haiku (cheaper)
// Cost guards (Doc: the 5€ must last). Opus is ~1.67× Sonnet in+out → never run it for a voice assistant,
// even if a stale client localStorage 'ai_model' (reachable with the shared password) asks for it. And cap
// the requested output: a buggy/abusive client could otherwise set max_tokens huge and run one request to
// ~$1.60. 4096 is plenty for a spoken answer; the normal client value (3000) passes through unchanged.
const MAX_OUTPUT_TOKENS = 4096;
function pickModel(m: unknown): string {
  if (typeof m !== 'string' || !m) return DEFAULT_MODEL;
  if (/opus/i.test(m)) return DEFAULT_MODEL; // clamp Opus → Sonnet
  return m;
}

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

// Fire-and-forget: append ONE token-usage row to ai_cost_log for the daily infra cost mail. A logging
// hiccup must NEVER affect the chat response (best-effort, try/catch). SUPABASE_URL + service-role key are
// auto-injected by the Edge runtime. Pricing happens later in infra-usage — here we only record raw tokens.
async function logAiCost(provider: string, model: string, u: Record<string, number> | undefined) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !svc || !u) return;
    await fetch(url + '/rest/v1/ai_cost_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        provider, model,
        in_tok: u.input_tokens || 0,
        out_tok: u.output_tokens || 0,
        cache_read: u.cache_read_input_tokens || 0,
        cache_write: u.cache_creation_input_tokens || 0,
        label: 'chat',
      }),
    });
  } catch (_) { /* logging must never break the chat */ }
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

  // A turn's content may be a string OR an Anthropic content-block array (tool_use / tool_result blocks,
  // used by Solita's tool-use loop). Keep both; only drop genuinely empty turns.
  const hasContent = (c: unknown) =>
    (typeof c === 'string' && c.trim() !== '') || (Array.isArray(c) && c.length > 0);
  const turns = b.messages.filter((m: { role?: string; content?: unknown }) => m && hasContent(m.content));
  // System is lifted to Anthropic's top-level field (string-content system turns only). Kept as SEPARATE
  // blocks (NOT joined) so each caches independently — the client sends persona + rolling summary as two
  // system turns; only the persona gets a cache breakpoint (see body.system below).
  const systemTexts: string[] = turns
    .filter((m: { role: string; content: unknown }) => m.role === 'system' && typeof m.content === 'string')
    .map((m: { content: string }) => m.content);
  let chat = turns
    .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
    .map((m: { role: string; content: unknown }) => ({ role: m.role, content: m.content }));   // pass string OR blocks through
  // Anthropic requires the first turn to be 'user'. Drop any leading assistant turns.
  while (chat.length && chat[0].role === 'assistant') chat = chat.slice(1);
  if (!chat.length) return json({ error: 'keine user-Nachricht' }, 400);

  const body: Record<string, unknown> = {
    model: pickModel(b.model),
    max_tokens: Math.min(Math.max((typeof b.max_tokens === 'number') ? b.max_tokens : 3000, 1), MAX_OUTPUT_TOKENS),
    messages: chat,
  };
  // NOTE: `temperature` is deprecated on Claude 4.x models (they reject it with HTTP 400) → don't forward it.
  // Prompt caching (cost): the system turn (persona + rolling summary) and the tool schemas are a large,
  // mostly-stable prefix that was being re-sent at FULL input price every turn AND every tool-loop hop.
  // cache_control bills the repeated prefix at ~0.1×. Two tiers — the tools cache on their own breakpoint and
  // the system on a second, so a summary change re-writes only the system block, not the tools. Render order
  // is tools → system → messages. Verify it's working via usage.cache_read_input_tokens > 0.
  // Cache ONLY the first system block (the static persona). The volatile rolling summary arrives as a SECOND
  // system turn and stays UNcached → a summary change re-reads just those few hundred tokens at 1× instead of
  // re-writing the whole persona at 1.25× (the cache_creation churn that made Solita expensive). Still one
  // system breakpoint total (persona), so the tools + last-message breakpoints are unaffected.
  if (systemTexts.length) {
    body.system = systemTexts.map((text: string, i: number) =>
      i === 0 ? { type: 'text', text, cache_control: { type: 'ephemeral' } } : { type: 'text', text });
  }
  // Optional Claude tool-use: forward a `tools` schema so Solita can take actions. The CLIENT runs the loop
  // (executes tool_use blocks, sends tool_result back). No tools field → behaves exactly as before.
  if (Array.isArray(b.tools) && b.tools.length) {
    const tools = b.tools.map((t: Record<string, unknown>) => ({ ...t }));
    tools[tools.length - 1] = { ...tools[tools.length - 1], cache_control: { type: 'ephemeral' } };
    body.tools = tools;
  }
  // Cache the CONVERSATION too, not just the static system+tools prefix. The running history (and, in the
  // tool-use loop, the accumulated tool_use/tool_result blocks) is otherwise re-sent at FULL input price on
  // every turn AND every loop hop. A breakpoint on the LAST block of the LAST turn makes the whole prior
  // conversation a cache READ (~0.1×) on the next request/hop. This also pushes the cached prefix past the
  // model's minimum (2048 Sonnet / 4096 Haiku·Opus), so caching actually fires once the chat has a few turns.
  // Third breakpoint (tools + system + messages = 3 of the 4 allowed). Render order is tools → system → messages.
  if (chat.length) {
    const last = chat[chat.length - 1] as { role: string; content: unknown };
    if (typeof last.content === 'string') {
      last.content = [{ type: 'text', text: last.content, cache_control: { type: 'ephemeral' } }];
    } else if (Array.isArray(last.content) && last.content.length) {
      const blocks = (last.content as Record<string, unknown>[]).map((blk) => ({ ...blk }));
      blocks[blocks.length - 1] = { ...blocks[blocks.length - 1], cache_control: { type: 'ephemeral' } };
      last.content = blocks;
    }
  }

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
    // Back-compat: the existing chat reads choices[0].message.content (joined text).
    // ADDITIVE: also return the raw Anthropic content blocks + stop_reason so Solita can run the tool-use loop.
    const text = Array.isArray(data.content)
      ? data.content.filter((c: { type: string }) => c.type === 'text')
          .map((c: { text: string }) => c.text).join('\n')
      : '';
    // cost mail: record this hop's token usage in the BACKGROUND so the chat response is never delayed
    // or affected by the logging POST (waitUntil keeps the worker alive past the response on Supabase Edge).
    try {
      const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
      const p = logAiCost('claude', String(body.model), data.usage);
      if (er?.waitUntil) er.waitUntil(p);
    } catch (_) { /* logging must never affect the chat */ }
    return json({
      choices: [{ message: { role: 'assistant', content: text } }],
      content: Array.isArray(data.content) ? data.content : [],
      stop_reason: data.stop_reason || null,
      usage: data.usage,
    });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
