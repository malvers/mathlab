// Tracker — "identify" Edge Function.
// The Foto-Spur sends a photo (base64 JPEG); we ask Gemini what the main subject is
// and return a short German explanation: { title, text }. The Gemini key lives ONLY
// here as an env secret — never in the public web client / repo.
//
// Secret to set (dashboard → Edge Functions → Secrets):
//   GEMINI_API_KEY – your Google AI Studio key (https://aistudio.google.com/apikey)
//
// Deploy (no JWT needed — it only calls Gemini, touches no user data):
//   supabase functions deploy identify --no-verify-jwt

const MODEL = 'gemini-2.5-flash';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PROMPT = `Du bist ein kundiger Wander- und Stadtführer.
Erkenne das HAUPTMOTIV auf dem Foto (Pflanze, Baum, Tier, Pilz, Gebäude, Denkmal, Gestein …).
Antworte AUSSCHLIESSLICH als JSON: {"title": "...", "text": "..."}.
- title: kurzer Name auf Deutsch, wenn sinnvoll mit Fach-/Artname in Klammern, max. ~6 Wörter.
- text: 1–2 Sätze Wissenswertes auf Deutsch, sachlich, ohne Floskeln.
Wenn du es nicht sicher erkennst: title "Unklar", text mit deiner besten Vermutung.`;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

    const { image, mime } = await req.json().catch(() => ({}));
    if (!image) return json({ error: 'kein Bild übergeben' }, 400);

    const body = {
      contents: [{
        parts: [
          { inline_data: { mime_type: mime || 'image/jpeg', data: image } },
          { text: PROMPT },
        ],
      }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

    // Gemini occasionally answers with a transient 503 ("model overloaded"),
    // 429 or 5xx that clears within a second or two. Retry those with
    // exponential backoff instead of failing the whole identification.
    // Hard errors (e.g. 400 bad image) are returned right away — retrying
    // them would only waste time.
    const TRANSIENT = new Set([429, 500, 502, 503, 504]);
    const MAX_TRIES = 4;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    let r: Response | undefined;
    let lastStatus = 0;
    let lastDetail = '';
    const statuses: (number | string)[] = []; // per-attempt outcome, for the debug readout
    let waitedMs = 0;
    let triesUsed = 0;
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      triesUsed = attempt;
      try {
        r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        // network-level failure → treat like a transient error and retry
        r = undefined;
        lastStatus = 0;
        lastDetail = String((e && (e as Error).message) || e);
        statuses.push('net');
      }
      if (r) {
        statuses.push(r.status);
        if (r.ok) break; // success
        lastStatus = r.status;
        lastDetail = (await r.text()).slice(0, 800);
        if (!TRANSIENT.has(r.status)) break; // hard error → no retry
      }
      if (attempt === MAX_TRIES) break;
      // How long until the next try?
      //  • 503 / overload / network → short exponential backoff, genuinely worth retrying.
      //  • 429 with a SHORT "retry in Xs" (≤8s) → a brief per-minute blip → wait it out.
      //  • 429 with a LONG hint (>8s) → a real quota wall (free tier exhausted). Retrying
      //    only wastes ~30s per try AND burns more of the tiny budget → bail immediately.
      let waitMs = 600 * 2 ** (attempt - 1); // 0.6 / 1.2 / 2.4s fallback (good for 503)
      const hint = lastDetail.match(/retry in ([0-9.]+)s/i);
      if (hint) {
        const hintMs = Math.ceil(parseFloat(hint[1]) * 1000);
        if (lastStatus === 429 && hintMs > 8000) break; // quota wall → fail fast
        waitMs = Math.min(8000, hintMs + 300);
      }
      waitedMs += waitMs;
      await sleep(waitMs);
    }
    const diag = { tries: triesUsed, waitedMs, statuses };

    if (!r || !r.ok) {
      return json({ error: 'Gemini ' + (lastStatus || 'net'), detail: lastDetail, _diag: diag }, 502);
    }

    const data = await r.json();
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let title = 'Unbekannt';
    let text = '';
    try {
      const p = JSON.parse(txt);
      title = p.title || title;
      text = p.text || '';
    } catch {
      // model didn't return clean JSON → fall back to raw text
      text = txt.slice(0, 300);
    }
    return json({ title, text, _diag: diag });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 500);
  }
});
