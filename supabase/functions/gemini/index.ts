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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const model = typeof b.model === 'string' ? b.model : '';
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
    return json(data, r.ok ? 200 : (r.status || 502)); // pass Gemini's response (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
