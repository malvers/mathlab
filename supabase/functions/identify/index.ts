// Tracker — "identify" Edge Function (Foto-Spur).
// Hybrid recognition: a SPECIALIST identifies the species, Gemini writes the explanation.
//   1. If PLANTNET_API_KEY is set, the photo first goes to the Pl@ntNet botanical API.
//      Pl@ntNet returns the most likely plant species + a confidence score, and REJECTS
//      non-plant photos (buildings, animals, rocks) on its own.
//   2. • Confident plant  → Gemini is told the species and only writes the German blurb.
//      • No plant / low score / Pl@ntNet off → Gemini identifies the subject itself (as before).
// Returns { title, text } (+ _diag). All keys live ONLY here as env secrets — never in the
// public web client / repo.
//
// Secrets to set (dashboard → Edge Functions → Secrets):
//   GEMINI_API_KEY   – Google AI Studio key (https://aistudio.google.com/apikey)   [required]
//   PLANTNET_API_KEY – Pl@ntNet API key   (https://my.plantnet.org/)               [optional]
//
// Deploy (no JWT needed — it only calls external APIs, touches no user data):
//   supabase functions deploy identify --no-verify-jwt

const MODEL = 'gemini-2.5-flash';
const PLANTNET_URL = 'https://my-api.plantnet.org/v2/identify/all';
const PLANTNET_MIN_SCORE = 0.30; // below this, treat the plant guess as too weak → let Gemini decide

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Gemini identifies the subject itself (used for non-plants or when Pl@ntNet is off/unsure).
const PROMPT_GENERIC = `Du bist ein kundiger Wander- und Stadtführer.
Erkenne das HAUPTMOTIV auf dem Foto (Pflanze, Baum, Tier, Pilz, Gebäude, Denkmal, Gestein …).
Antworte AUSSCHLIESSLICH als JSON: {"title": "...", "text": "..."}.
- title: kurzer Name auf Deutsch, wenn sinnvoll mit Fach-/Artname in Klammern, max. ~6 Wörter.
- text: 1–2 Sätze Wissenswertes auf Deutsch, sachlich, ohne Floskeln.
Wenn du es nicht sicher erkennst: title "Unklar", text mit deiner besten Vermutung.`;

// Gemini only EXPLAINS a species that Pl@ntNet has already determined botanically.
function promptForPlant(sci: string, common: string): string {
  return `Das Foto zeigt diese Pflanze (botanisch bestimmt): ${sci}${common ? ` — deutscher Name: ${common}` : ''}.
Antworte AUSSCHLIESSLICH als JSON: {"title": "...", "text": "..."}.
- title: deutscher Name mit wissenschaftlichem Artnamen in Klammern, max. ~6 Wörter.
- text: 1–2 Sätze Wissenswertes auf Deutsch, sachlich, ohne Floskeln.`;
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// Ask Pl@ntNet for the most likely species. Returns the top result, or a reason it didn't apply.
// Pl@ntNet rejects non-plant photos itself (HTTP 404) → that's the natural "not a plant" signal.
async function plantnetIdentify(
  image: string,
  mime: string,
  key: string,
): Promise<
  | { ok: true; score: number; sci: string; common: string; remaining?: number }
  | { ok: false; reason: string; remaining?: number }
> {
  const bin = Uint8Array.from(atob(image), (c) => c.charCodeAt(0));
  const fd = new FormData();
  fd.append('images', new Blob([bin], { type: mime || 'image/jpeg' }), 'photo.jpg');
  fd.append('organs', 'auto');
  const url = `${PLANTNET_URL}?api-key=${key}&lang=de&nb-results=5`;
  const r = await fetch(url, { method: 'POST', body: fd });
  if (!r.ok) return { ok: false, reason: 'http' + r.status }; // 404 ≈ not a plant / no match
  const d = await r.json();
  // Pl@ntNet reports how much of today's quota is left in every response body.
  const remaining = typeof d?.remainingIdentificationRequests === 'number'
    ? d.remainingIdentificationRequests
    : undefined;
  const top = d?.results?.[0];
  if (!top) return { ok: false, reason: 'empty', remaining };
  return {
    ok: true,
    score: top.score ?? 0,
    sci: top.species?.scientificNameWithoutAuthor || '',
    common: (top.species?.commonNames && top.species.commonNames[0]) || '',
    remaining,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

    const { image, mime } = await req.json().catch(() => ({}));
    if (!image) return json({ error: 'kein Bild übergeben' }, 400);

    // ---- Step 1: specialist plant identification (optional, only if a key is configured) ----
    const plantKey = Deno.env.get('PLANTNET_API_KEY');
    let plant: { sci: string; common: string; score: number } | null = null;
    let pnDiag: unknown = 'off';
    let pnRemaining: number | undefined; // Pl@ntNet daily quota left (free tier = 500/day)
    if (plantKey) {
      try {
        const pn = await plantnetIdentify(image, mime, plantKey);
        if (pn.remaining !== undefined) pnRemaining = pn.remaining;
        if (pn.ok && pn.score >= PLANTNET_MIN_SCORE) {
          plant = { sci: pn.sci, common: pn.common, score: pn.score };
          pnDiag = { score: +pn.score.toFixed(3), sci: pn.sci };
        } else {
          pnDiag = pn.ok ? { low: +pn.score.toFixed(3) } : { reject: pn.reason };
        }
      } catch (e) {
        pnDiag = { err: String((e && (e as Error).message) || e) };
      }
    }

    // ---- Step 2: Gemini — explain the known plant, or identify the subject itself ----
    const promptText = plant ? promptForPlant(plant.sci, plant.common) : PROMPT_GENERIC;
    const body = {
      contents: [{
        parts: [
          { inline_data: { mime_type: mime || 'image/jpeg', data: image } },
          { text: promptText },
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
    const diag = { tries: triesUsed, waitedMs, statuses, plantnet: pnDiag };

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
    // Credit the engine that actually identified the subject: Pl@ntNet (the botanical
    // specialist) on the plant path, otherwise Gemini recognised it itself. Appended
    // inline so it survives the esc()'d <div>/GPX rendering on the client.
    const source = plant ? 'Pl@ntNet (' + Math.round(plant.score * 100) + '%)' : 'Google Gemini';
    text = (text ? text.trimEnd() + ' ' : '') + '(Quelle: ' + source + ')';
    return json({ title, text, source, pnRemaining, _diag: diag });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 500);
  }
});
