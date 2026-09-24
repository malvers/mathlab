// Tracker/Labs — "tts" Edge Function. Proxies Google Cloud Text-to-Speech so the API key lives ONLY
// here as the env secret GOOGLE_API_KEY — never in the public client (glocken etc.). The client POSTs
// { ssml | text, voice?, languageCode?, speakingRate?, pitch? }; we add the key, call Google, and
// return Google's JSON verbatim ({ audioContent: <base64 mp3> }).
//
// voice: 'doc' is Doc's own voice - a Google Voice Replication (Gemini TTS, built 24.09.2026 from his
// recordings). It answers { audioContent: <base64 wav>, mime: 'audio/wav' }. If Gemini is slow or
// fails, the same text comes back in Solita's Studio voice as mp3 (mime: 'audio/mp3', fallback: true),
// so a deck never goes silent. Secret: GEMINI_VOICE_KEY - a key of the Google project that owns the
// replicated voice (the voice id is project bound). Without it GEMINI_API_KEY is tried.
//
// Deploy (no JWT — it only calls an external API, touches no user data):
//   supabase functions deploy tts --no-verify-jwt
// Secret: GOOGLE_API_KEY (Dashboard → Edge Functions → Secrets) — a Google API key with the
// Cloud Text-to-Speech API enabled.

import { guard, budgetExceeded } from '../_shared/guard.ts';

// Fire-and-forget: one row per synthesis into ai_cost_log, so the daily 08:00 mail can show how much
// of Google's monthly free character quota is gone (Doc, 16.09.2026: "volle Kontrolle"). Characters go
// into in_tok - the column is a counter, and infra-usage prices this provider at 0 because characters
// are not tokens and the quota is monthly, not per call. Never let logging affect the audio response.
async function logTtsChars(voice: string, chars: number) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !svc || !chars) return;
    await fetch(url + '/rest/v1/ai_cost_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ provider: 'google-tts', model: voice, in_tok: chars, out_tok: 0, cache_read: 0, cache_write: 0, label: 'tts' }),
    });
  } catch (_) { /* logging must never break the voice */ }
}

const GOOGLE_TTS = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const GEMINI_INTERACTIONS = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const DOC_MODEL = 'gemini-3.8-flash-tts';
const DOC_VOICE = 'voice_ns9j59rfoa3l';           // valid until 24.09.2027 (~/Movies/stimmklon/stimme.json)
// Doc on the first tour takes: "nicht pathetisch, nicht kindlich, Oberstufe" - the same text as STYLE in
// videopipeline/maya/voice_doc.py, so the deck and the tour sound alike
const DOC_STYLE = 'ruhig und sachlich, mit leiser Begeisterung für die Sache, wie ein Lehrer vor einer Oberstufenklasse - '
  + 'nicht pathetisch, nicht kindlich, normales Sprechtempo';
const DOC_WAIT = 15_000;                          // ms - after that Solita's voice steps in (the deck waits 20 s)
const FALLBACK_VOICE = 'de-DE-Studio-C';

// Doc's voice: one Gemini "interaction", the audio comes back base64 inside steps[].content[].
// Returns the audio, or why there is none - the caller then falls back to Solita and passes the
// reason on (status and Google's message only, never the key), so a failure can be read from outside.
async function docVoice(text: string): Promise<{ wav?: string; why?: string }> {
  // its own key if set, else the general one - which only works if it belongs to the voice's project
  const key = Deno.env.get('GEMINI_VOICE_KEY') || Deno.env.get('GEMINI_API_KEY');
  if (!key) return { why: 'no key' };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), DOC_WAIT);
  try {
    const r = await fetch(GEMINI_INTERACTIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        model: DOC_MODEL,
        input: [{ type: 'user_input', content: [{ type: 'text', text,
          annotations: [{ type: 'speech_metadata', style: DOC_STYLE }] }] }],
        response_format: { type: 'audio' },
        generation_config: { speech_config: [{ voice: DOC_VOICE }] },
      }),
      signal: ctl.signal,
    });
    const raw = await r.text();
    if (!r.ok) return { why: r.status + ' ' + raw.slice(0, 300) };
    let data: { status?: string; steps?: { content?: { type?: string; data?: string }[] }[] } | null = null;
    try { data = JSON.parse(raw); } catch (_) { return { why: 'no json' }; }
    for (const step of data?.steps || []) {
      for (const c of step.content || []) {
        if (c.type === 'audio' && typeof c.data === 'string' && c.data.length > 1000) return { wav: c.data };
      }
    }
    return { why: 'no audio, status ' + (data?.status || '?') };
  } catch (e) {
    return { why: String((e as Error)?.name || e) };   // timeout, network - Solita takes over
  } finally {
    clearTimeout(timer);
  }
}

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

  const wantDoc = b.voice === 'doc';
  let docWhy = '';
  if (wantDoc && !b.ssml) {
    const doc = await docVoice(String(b.text));
    docWhy = doc.why || '';
    const wav = doc.wav;
    if (wav) {
      try {
        const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
        const p = logTtsChars('doc-replica', chars);
        if (er?.waitUntil) er.waitUntil(p);
      } catch (_) { /* never affect the response */ }
      return json({ audioContent: wav, mime: 'audio/wav' });
    }
  }

  // Chirp3-HD voices reject pitch/speakingRate ("This voice does not support pitch parameters") → omit
  // them for Chirp; everything else (Neural2/Wavenet/Studio, incl. glocken) keeps the same audioConfig.
  const voiceName = wantDoc ? FALLBACK_VOICE : (b.voice || 'de-DE-Neural2-B');
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
    if (r.ok) {                                    // only count what Google actually synthesised (and billed)
      try {
        const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
        const p = logTtsChars(voiceName, chars);
        if (er?.waitUntil) er.waitUntil(p);
      } catch (_) { /* never affect the response */ }
    }
    if (wantDoc && r.ok) return json({ ...data, mime: 'audio/mp3', fallback: true, why: docWhy });   // Doc's voice did not come
    return json(data, r.ok ? 200 : (r.status || 502)); // pass Google's { audioContent } (or its error) through
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 502);
  }
});
