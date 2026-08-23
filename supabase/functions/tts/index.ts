// Tracker/Labs — "tts" Edge Function. Proxies Google Cloud Text-to-Speech so the API key lives ONLY
// here as the env secret GOOGLE_API_KEY — never in the public client (glocken etc.). The client POSTs
// { ssml | text, voice?, languageCode?, speakingRate?, pitch? }; we add the key, call Google, and
// return Google's JSON verbatim ({ audioContent: <base64 mp3> }).
//
// Deploy (no JWT — it only calls an external API, touches no user data):
//   supabase functions deploy tts --no-verify-jwt
// Secret: GOOGLE_API_KEY (Dashboard → Edge Functions → Secrets) — a Google API key with the
// Cloud Text-to-Speech API enabled.

import { guard, budgetExceeded } from '../_shared/guard.ts';

const GOOGLE_TTS = 'https://texttospeech.googleapis.com/v1/text:synthesize';

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

  /* Public endpoint with a server-side key behind it — see ../_shared/guard.ts
     (own pages / our key, burst limit, payload cap). */
  const blocked = guard(req, { maxBytes: 64_000, limit: 200 });
  if (blocked) return blocked;

  const key = Deno.env.get('GOOGLE_API_KEY');
  if (!key) return json({ error: 'GOOGLE_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  if (!b.ssml && !b.text) return json({ error: 'kein Text/ssml übergeben' }, 400);

  /* Google caps one request at 5000 bytes anyway; the per-IP character budget is what stops a copied
     client from burning the TTS bill in a loop (Studio voices ≈ 160 $ per 1 Mio. characters). */
  const chars = String(b.ssml || b.text || '').length;
  if (chars > 5000) return json({ error: 'Text zu lang (max. 5000 Zeichen pro Anfrage)' }, 413);
  const spent = budgetExceeded(req, chars, 150_000);
  if (spent) return spent;

  // Chirp3-HD voices reject pitch/speakingRate ("This voice does not support pitch parameters") → omit
  // them for Chirp; everything else (Neural2/Wavenet/Studio, incl. glocken) keeps the same audioConfig.
  const voiceName = b.voice || 'de-DE-Neural2-B';
  const isChirp = /chirp/i.test(voiceName);
  const audioConfig: Record<string, unknown> = { audioEncoding: 'MP3' };
  if (!isChirp) {
    audioConfig.speakingRate = (typeof b.speakingRate === 'number') ? b.speakingRate : 0.95;
    audioConfig.pitch = (typeof b.pitch === 'number') ? b.pitch : -1.5;
  }
  const body = {
    input: b.ssml ? { ssml: b.ssml } : { text: b.text },
    voice: { languageCode: b.languageCode || 'de-DE', name: voiceName },
    audioConfig,
  };

  try {
    const r = await fetch(GOOGLE_TTS + '?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return json(data, r.ok ? 200 : (r.status || 502)); // pass Google's { audioContent } (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
