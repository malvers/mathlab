// Tracker/Labs — "solita-config" Edge Function (SOLITA STUFE 2a — bounded "Solita ändert das Repo").
//
// ⚠️ INERT bis Doc es bewusst deployt UND ein GITHUB_TOKEN-Secret setzt. Solange nicht deployt, passiert
//    NICHTS. Es ist NICHT in solita.html eingehängt — keine Auto-Aktivierung. Authoring 2026-06-12 als
//    Vorsprung; Doc entscheidet, ob/wann er es scharf schaltet (eine KI committet hier in den public
//    main-Branch — das ist Docs Entscheidung).
//
// Was es tut (NUR Präsentation, kein Code): nimmt einen natürlichsprachigen Wunsch ("mach das Navi-Banner
// grün"), lässt Claude die EINE Datei HTML/config.json (Live-Config, Idee 19) patchen, validiert das
// Ergebnis als JSON, und committet es via GitHub Contents API. tracker-config.js zieht es live → sofort
// sichtbar, ohne Neuinstallation. Blast-Radius: genau diese eine deklarative Datei.
//
// Sicherheit (Regel 18): kein Secret im Repo. Token NUR als Env. Pfad fest auf HTML/config.json
// (Whitelist) — die Function kann NICHTS anderes schreiben. Passwort-Gate wie die anderen Functions.
//
// Client contract:
//   { ping: true }              -> { ok: true } (Passwort-Check)
//   { instruction: "<wunsch>" } -> patcht HTML/config.json, returns { ok, version, commit }
//
// Deploy (Doc, wenn gewollt):
//   supabase functions deploy solita-config --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
// Secrets (zusätzlich zu ANTHROPIC_API_KEY / LABAI_PASSWORD, die schon da sind):
//   GITHUB_TOKEN  — fine-grained PAT, NUR Repo malvers/mathlab, Permission "Contents: Read and write"

const ANTHROPIC = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-6';            // good at precise, schema-faithful JSON edits

const OWNER = 'malvers';
const REPO = 'mathlab';
const CONFIG_PATH = 'HTML/config.json';        // the ONLY file this function may touch
const BRANCH = 'main';                         // live-config (docalvers.de) reads main

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const GH_HEADERS = (tok: string) => ({
  'Authorization': 'Bearer ' + tok,
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'solita-config',
  'X-GitHub-Api-Version': '2022-11-28',
});

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Claude sometimes wraps JSON in ```json fences — strip them before parsing.
function parseJsonLoose(s: string): unknown {
  let t = String(s).trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (m) t = m[1].trim();
  return JSON.parse(t);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const key = Deno.env.get('ANTHROPIC_API_KEY');
  const pass = Deno.env.get('LABAI_PASSWORD');
  const ghTok = Deno.env.get('GITHUB_TOKEN');
  if (!key) return json({ error: 'ANTHROPIC_API_KEY fehlt.' }, 500);
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  if (!ghTok) return json({ error: 'GITHUB_TOKEN fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  const instruction = typeof b.instruction === 'string' ? b.instruction.trim() : '';
  if (!instruction) return json({ error: 'keine instruction übergeben' }, 400);

  // 1) current config.json (content + sha) from GitHub.
  let curObj: Record<string, unknown>; let sha: string;
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONFIG_PATH}?ref=${BRANCH}`,
      { headers: GH_HEADERS(ghTok) });
    if (!r.ok) return json({ error: `GitHub GET ${r.status}` }, 502);
    const g = await r.json();
    sha = g.sha;
    curObj = JSON.parse(atob(g.content.replace(/\n/g, '')));
  } catch (e) { return json({ error: 'config.json laden/parsen fehlgeschlagen: ' + String((e as Error).message || e) }, 502); }

  // 2) Claude patches it — strict JSON, same shape, change only what's asked.
  const sys = 'Du bekommst eine config.json (Live-UI-Konfiguration, NUR Präsentation: Farben, Größen, '
    + 'z-Index, Positionen, Sichtbarkeit, einfache Parameter) und eine Anweisung. Gib die KOMPLETTE neue '
    + 'config.json als striktes JSON zurück (nichts außer dem JSON). Ändere NUR, was die Anweisung verlangt; '
    + 'behalte alle anderen Schlüssel/Werte unverändert. Erfinde keine neuen Strukturen, füge KEINE Secrets/'
    + 'URLs/Code ein. Farben als rgb()/#hex. Wenn die Anweisung unklar ist, mach die kleinste sinnvolle Änderung.';
  let newObj: Record<string, unknown>;
  try {
    const r = await fetch(ANTHROPIC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify({
        // NOTE: no `temperature` — Claude 4.x models reject it with HTTP 400 (deprecated).
        model: MODEL, max_tokens: 4000,
        system: sys,
        messages: [{ role: 'user', content: 'AKTUELLE config.json:\n' + JSON.stringify(curObj, null, 2) + '\n\nANWEISUNG:\n' + instruction }],
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: (data?.error?.message) || 'Claude-Fehler' }, r.status || 502);
    const text = Array.isArray(data.content) ? data.content.filter((c: { type: string }) => c.type === 'text').map((c: { text: string }) => c.text).join('') : '';
    newObj = parseJsonLoose(text) as Record<string, unknown>;
  } catch (e) { return json({ error: 'Claude/JSON-Parse fehlgeschlagen: ' + String((e as Error).message || e) }, 502); }

  // 3) Guard rails: must be an object, must not DROP existing top-level keys, bump version server-side.
  if (!newObj || typeof newObj !== 'object' || Array.isArray(newObj)) return json({ error: 'kein JSON-Objekt zurück' }, 422);
  for (const k of Object.keys(curObj)) {
    if (!(k in newObj)) return json({ error: `Schlüssel "${k}" würde verloren gehen — abgelehnt` }, 422);
  }
  const oldV = typeof curObj.version === 'number' ? curObj.version : 0;
  newObj.version = oldV + 1;

  // 4) commit the new config.json back to main.
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(newObj, null, 2) + '\n')));
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONFIG_PATH}`, {
      method: 'PUT',
      headers: { ...GH_HEADERS(ghTok), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `solita: live-config update — ${instruction}`.slice(0, 120),
        content, sha, branch: BRANCH,
      }),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: `GitHub PUT ${r.status}: ${out?.message || ''}` }, 502);
    return json({ ok: true, version: newObj.version, commit: out?.commit?.sha || null });
  } catch (e) { return json({ error: 'commit fehlgeschlagen: ' + String((e as Error).message || e) }, 502); }
});
