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
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return json({ error: 'Gemini ' + r.status, detail }, 502);
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
    return json({ title, text });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 500);
  }
});
