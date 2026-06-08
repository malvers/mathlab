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
// Tuned to NAME the specific/iconic thing (designer, model, era) rather than describe its
// surface ("chair with red cushion") — with a hedge so it won't invent false attributions.
const PROMPT_GENERIC = `Du bist ein kundiger Experte für Natur, Architektur, Kunst und Design.
Erkenne das HAUPTMOTIV auf dem Foto und BENENNE es so SPEZIFISCH wie möglich.
Es kann sein: Pflanze, Baum, Tier, Pilz, Gestein — aber genauso ein Gebäude, Denkmal,
Kunstwerk, ein Design-/Möbelstück, Fahrzeug oder bekanntes Produkt.

WICHTIG — benennen, nicht beschreiben:
- Ist das Objekt ein bekanntes/ikonisches Stück, nenne seinen EIGENNAMEN samt Schöpfer/
  Designer und Epoche, soweit du sie kennst — NICHT bloß sein Aussehen.
  Schlecht: "Stuhl mit rotem Sitzpolster". Gut: "Hill House Chair (Charles Rennie Mackintosh, 1903)".
- Eine reine Oberflächen-Beschreibung (Farbe, Material, Form) ist nur erlaubt, wenn das
  Objekt wirklich namenlos/alltäglich ist.
- Bist du dir beim exakten Namen unsicher, nenne TYP + STIL/EPOCHE und kennzeichne die
  Vermutung klar ("vermutlich …", "im Stil von …") — erfinde KEINE falsche, präzise Zuschreibung.

Antworte AUSSCHLIESSLICH als JSON: {"title": "...", "text": "..."}.
- title: spezifischer Name auf Deutsch, wenn sinnvoll mit Fach-/Designer-/Artname in Klammern, max. ~8 Wörter.
- text: 1–2 Sätze Wissenswertes auf Deutsch (Bedeutung, Schöpfer, Epoche o. Ä.), sachlich, ohne Floskeln.
Nur wenn du es wirklich nicht einordnen kannst: title "Unklar", text mit deiner besten Vermutung.`;

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

// POWO (Kew, Plants of the World Online) — half-official API (no SLA), best-effort.
// Resolves the ACCEPTED taxon for a binomial and returns its NATIVE range as WGSRPD
// level-3 region names (e.g. ["Japan", "Korea"] for Acer palmatum) — the species' true
// "Heimat" (natural origin), NOT where it was planted (that's `introduced`). Returns []
// on any failure so the caller just omits the line. Two short hops, each aborted at ~2.5 s.
// TDWG WGSRPD level-1 continent tokens (as they appear in POWO's locationTree) → German.
// Asia's two halves both collapse to "Asien" (the dedup below merges them).
const POWO_CONTINENTS: Record<string, string> = {
  EUROPE: 'Europa', AFRICA: 'Afrika', ASIA_TEMPERATE: 'Asien', ASIA_TROPICAL: 'Asien',
  AUSTRALASIA: 'Australasien', PACIFIC: 'Pazifik', NORTHERN_AMERICA: 'Nordamerika',
  SOUTHERN_AMERICA: 'Südamerika', ANTARCTIC: 'Antarktis',
};

// POWO (Kew, Plants of the World Online) — half-official API (no SLA), best-effort.
// Resolves the ACCEPTED taxon for a binomial and returns a short German "Heimat" string —
// the species' NATIVE origin, NOT where it was planted (`introduced`). Few regions → the
// region names ("Japan, Korea"); many → a continent roll-up ("Europa, Asien") from each
// region's locationTree, so a Eurasian weed doesn't dump 33 fragments. Returns "" on any
// failure so the caller just omits the line. Two short hops, each aborted at ~2.5 s.
async function powoHeimat(sci: string): Promise<string> {
  if (!sci) return '';
  const BASE = 'https://powo.science.kew.org/api/2';
  const H = { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' };
  const signal = (ms: number) => {
    const c = new AbortController();
    setTimeout(() => c.abort(), ms);
    return c.signal;
  };
  try {
    const s = await fetch(`${BASE}/search?q=${encodeURIComponent(sci)}`, { headers: H, signal: signal(2500) });
    if (!s.ok) return '';
    const sd = await s.json();
    const results = Array.isArray(sd?.results) ? sd.results : [];
    // A binomial often matches a synonym first → prefer the ACCEPTED result.
    const hit = results.find((r: { accepted?: boolean }) => r?.accepted) || results[0];
    if (!hit?.fqId) return '';
    const t = await fetch(`${BASE}/taxon/${hit.fqId}?fields=distribution`, { headers: H, signal: signal(2500) });
    if (!t.ok) return '';
    const td = await t.json();
    const natives: { name?: string; locationTree?: string[] }[] =
      Array.isArray(td?.distribution?.natives) ? td.distribution.natives : [];
    const names = natives.map((n) => n?.name || '').filter((x: string) => x.length > 0);
    if (!names.length) return '';
    if (names.length <= 6) return names.join(', ');
    // Widespread → roll up to continents via each region's locationTree.
    const conts: string[] = [];
    for (const n of natives) {
      for (const tok of (Array.isArray(n?.locationTree) ? n.locationTree : [])) {
        const de = POWO_CONTINENTS[tok];
        if (de && !conts.includes(de)) conts.push(de);
      }
    }
    return conts.length ? conts.join(', ') : names.slice(0, 6).join(', ') + ' +' + (names.length - 6);
  } catch {
    return ''; // POWO down / shape changed / timed out → best-effort: simply no Heimat line
  }
}

// Race a promise against a timeout so a slow Wikipedia/Overpass never holds up recognition.
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

// Build a short German LOCATION CONTEXT from two free, key-free, anonymous APIs so Gemini can name the
// river/bridge/landmark instead of guessing blind from the pixels. Best-effort: any error/timeout is
// dropped and recognition runs exactly as before. Only anonymous coordinates leave — never the photo.
async function geoContext(lat: number, lng: number): Promise<string> {
  // Wikipedia: the NOTABLE things nearby (Frauenkirche, Schloss Moritzburg, …), sorted by distance.
  const wiki = (async (): Promise<string[]> => {
    const u = `https://de.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}%7C${lng}&gsradius=600&gslimit=8&format=json`;
    const r = await fetch(u, { headers: { 'User-Agent': 'DocAlversTracker/1.0 (geo-context)' } });
    const d = await r.json();
    return (d?.query?.geosearch || []).map((g: { title: string; dist: number }) => `${g.title} (${Math.round(g.dist)} m)`);
  })();

  // Overpass/OSM: the NAMED thing right under you — river / bridge / artwork / historic — which
  // Wikipedia often has no own article for ("Elbe", a concrete bridge name).
  const overpass = (async (): Promise<string[]> => {
    const q = `[out:json][timeout:8];(way(around:160,${lat},${lng})[waterway=river][name];way(around:160,${lat},${lng})[bridge][name];node(around:160,${lat},${lng})[tourism=artwork][name];way(around:130,${lat},${lng})[historic][name];);out tags 14;`;
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'User-Agent': 'DocAlversTracker/1.0 (geo-context)' },
      body: 'data=' + encodeURIComponent(q),
    });
    const d = await r.json();
    const seen = new Set<string>(); const out: string[] = [];
    for (const e of (d?.elements || [])) {
      const t = e.tags || {}; const n: string = t.name; if (!n || seen.has(n)) continue; seen.add(n);
      const kind = t.waterway ? 'Fluss' : (t.bridge || t.man_made === 'bridge') ? 'Brücke'
        : t.tourism === 'artwork' ? 'Kunstwerk' : t.historic ? 'historisch' : '';
      out.push(kind ? `${n} (${kind})` : n);
    }
    return out;
  })();

  const [w, o] = await Promise.allSettled([withTimeout(wiki, 2500), withTimeout(overpass, 2500)]);
  const wikiHits = w.status === 'fulfilled' ? w.value : [];
  const osmHits = o.status === 'fulfilled' ? o.value : [];
  if (!wikiHits.length && !osmHits.length) return '';

  let ctx = `\n\nSTANDORT-KONTEXT (Foto aufgenommen bei ${lat.toFixed(4)}, ${lng.toFixed(4)}):`;
  if (osmHits.length) ctx += `\nDirekt vor Ort (OpenStreetMap): ${osmHits.slice(0, 6).join('; ')}.`;
  if (wikiHits.length) ctx += `\nBekanntes in der Nähe (Wikipedia): ${wikiHits.slice(0, 8).join('; ')}.`;
  ctx += `\nBerücksichtige diesen Standort. Wenn das Hauptmotiv ein benannter Fluss, eine Brücke, ein Bauwerk, ein Denkmal oder ein Kunstwerk aus dieser Liste ist, benenne es KONKRET statt generisch. Erfinde aber nichts, was nicht zum Bild passt.`;
  return ctx;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) return json({ error: 'GEMINI_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

    const { image, mime, lat, lng } = await req.json().catch(() => ({}));
    if (!image) return json({ error: 'kein Bild übergeben' }, 400);

    // Kick off the location context NOW (best-effort) so it overlaps the Pl@ntNet + POWO hops below
    // and adds no latency of its own. Resolves to '' when no coords or on any error/timeout.
    const geoPromise: Promise<string> = (typeof lat === 'number' && typeof lng === 'number')
      ? geoContext(lat, lng).catch(() => '')
      : Promise.resolve('');

    // ---- Step 1: specialist plant identification (optional, only if a key is configured) ----
    const plantKey = Deno.env.get('PLANTNET_API_KEY');
    let plant: { sci: string; common: string; score: number } | null = null;
    let plantConfident = false; // score ≥ MIN → Pl@ntNet also gets the headline (else just shown)
    let pnDiag: unknown = 'off';
    let pnRemaining: number | undefined; // Pl@ntNet daily quota left (free tier = 500/day)
    if (plantKey) {
      try {
        const pn = await plantnetIdentify(image, mime, plantKey);
        if (pn.remaining !== undefined) pnRemaining = pn.remaining;
        if (pn.ok && pn.sci) {
          // ACCEPT any plant Pl@ntNet returns — even a weak score is worth showing as a second
          // opinion (Doc: "immer beide"). MIN_SCORE only decides who writes the HEADLINE.
          plant = { sci: pn.sci, common: pn.common, score: pn.score };
          plantConfident = pn.score >= PLANTNET_MIN_SCORE;
          pnDiag = { score: +pn.score.toFixed(3), sci: pn.sci, conf: plantConfident };
        } else {
          pnDiag = pn.ok ? { empty: true } : { reject: pn.reason };
        }
      } catch (e) {
        pnDiag = { err: String((e && (e as Error).message) || e) };
      }
    }

    // Kick POWO off NOW (it only needs Pl@ntNet's name) so its two hops overlap the Gemini
    // call below instead of adding latency after it. Awaited only when we build the plant answer.
    const powoPromise: Promise<string> = plant?.sci ? powoHeimat(plant.sci) : Promise.resolve('');

    // ---- Step 2: Gemini identifies the subject INDEPENDENTLY (never told Pl@ntNet's guess) ----
    // On the plant path this yields a genuine SECOND opinion to compare against Pl@ntNet, instead
    // of just a blurb echoing Pl@ntNet's answer. (promptForPlant is kept above but now unused.)
    const promptText = PROMPT_GENERIC + (await geoPromise);
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
    // Gemini's OWN identification (independent of Pl@ntNet).
    let gTitle = '';
    let gText = '';
    try {
      const p = JSON.parse(txt);
      gTitle = p.title || '';
      gText = p.text || '';
    } catch {
      gText = txt.slice(0, 300); // model didn't return clean JSON → keep raw text as the blurb
    }

    let title: string;
    let text: string;
    let source: string;
    if (plant) {
      // PLANT → just show BOTH opinions side by side. NO agreement verdict — synonyms like
      // Soehrensia/Echinopsis huascha can't be judged by a string match; Doc reads + decides.
      const pct = Math.round(plant.score * 100);
      const pnName = plant.common ? plant.sci + ' – ' + plant.common : plant.sci;
      // Headline = the specialist's name when it's confident (≥ MIN); otherwise Gemini's, which is
      // more trustworthy when Pl@ntNet is unsure (and Gemini can read a plant's label / sign).
      const pnHead = plant.common ? plant.common + ' (' + plant.sci + ')' : plant.sci;
      title = plantConfident ? (pnHead || gTitle) : (gTitle || pnHead);
      // "Label:\tValue" lines — the client's lightbox renders these as a 2-column facts table.
      text = (gText ? gText.trimEnd() + '\n\n' : '') +
        'PlantNet:\t' + pnName + ' (' + pct + ' %)\n' +
        'Google Gemini:\t' + (gTitle || 'unklar');
      // POWO native range (best-effort) as a third row — the species' true "Heimat".
      const heimat = await powoPromise;
      if (heimat) text += '\nHeimat:\t' + heimat;
      source = 'both';
    } else {
      // Not a plant (Pl@ntNet rejected it) → Gemini only. NO "(Quelle: …)" stamp anymore — that
      // parenthetical now marks an OLD recognition for the client's re-analyze logic.
      title = gTitle || 'Unbekannt';
      text = gText ? gText.trimEnd() : '';
      source = 'Google Gemini';
    }

    // Usage log: 1 successful identification = 1 Gemini call = the real cost driver. Append a row
    // (service-role key, auto-injected into the edge env) so the app can show the TRUE usage incl.
    // re-runs. Fire-and-forget under try/catch — a logging hiccup must never fail the result.
    try {
      const sbUrl = Deno.env.get('SUPABASE_URL');
      const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (sbUrl && svc) {
        await fetch(sbUrl + '/rest/v1/identify_log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': svc,
            'Authorization': 'Bearer ' + svc,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ engine: source }),
        });
      }
    } catch (_) { /* logging must never break identification */ }

    return json({ title, text, source, pnRemaining, _diag: diag });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 500);
  }
});
