// Tracker/Labs — "solita-note" Edge Function (SOLITA STUFE 2a — bounded "Solita schreibt auf & pusht").
//
// ⚠️ INERT bis Doc es bewusst deployt UND ein GITHUB_TOKEN-Secret setzt (dasselbe wie solita-config).
//    Solange nicht deployt, passiert NICHTS.
//
// Was es tut: nimmt einen Notiz-Text, hängt ihn als datierten Eintrag an EINE Datei (solita-notizen.md)
// und committet via GitHub Contents API. KEIN Claude-Call nötig (reines Anhängen). tracker/Notizen kann
// das später live ziehen. Blast-Radius: genau diese eine Markdown-Datei.
//
// Sicherheit (Regel 18): kein Secret im Repo. Token NUR als Env. Pfad fest auf solita-notizen.md
// (Whitelist) — die Function kann NICHTS anderes schreiben. Passwort-Gate wie die anderen Functions.
// Der Notiz-Text wird auf offensichtliche Secrets geprüft und sonst abgelehnt (public repo).
//
// Client contract:
//   { ping: true }              -> { ok: true } (Passwort-Check)
//   { note: "<text>" }          -> hängt an solita-notizen.md an, returns { ok, commit }
//
// Deploy (Doc, wenn gewollt):
//   supabase functions deploy solita-note --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
// Secrets (dieselben wie solita-config): LABAI_PASSWORD + GITHUB_TOKEN (fine-grained PAT, malvers/mathlab,
//   Contents: Read and write).

const OWNER = 'malvers';
const REPO = 'mathlab';
const NOTE_PATH = 'solita-notizen.md';         // the ONLY file this function may touch
const BRANCH = 'main';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const GH_HEADERS = (tok: string) => ({
  'Authorization': 'Bearer ' + tok,
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'solita-note',
  'X-GitHub-Api-Version': '2022-11-28',
});

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Refuse to commit anything that looks like a secret into the public repo (Regel 18).
function looksLikeSecret(s: string): boolean {
  return /AIza[0-9A-Za-z_\-]{20,}|AQ\.[A-Za-z0-9_\-]{10,}|sb_secret_|sk-[a-zA-Z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}\./.test(s);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const pass = Deno.env.get('LABAI_PASSWORD');
  const ghTok = Deno.env.get('GITHUB_TOKEN');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  if (!ghTok) return json({ error: 'GITHUB_TOKEN fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'unauthorized' }, 401);
  if (b.ping) return json({ ok: true });

  const note = typeof b.note === 'string' ? b.note.trim() : '';
  if (!note) return json({ error: 'keine note übergeben' }, 400);
  if (note.length > 4000) return json({ error: 'note zu lang (max 4000 Zeichen)' }, 400);
  if (looksLikeSecret(note)) return json({ error: 'Notiz sieht aus wie ein Secret — abgelehnt (public repo, Regel 18).' }, 422);

  // 1) current notes file (content + sha) from GitHub. 404 → start a fresh file.
  let prevText = ''; let sha: string | undefined;
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${NOTE_PATH}?ref=${BRANCH}`,
      { headers: GH_HEADERS(ghTok) });
    if (r.ok) {
      const g = await r.json();
      sha = g.sha;
      prevText = decodeURIComponent(escape(atob(String(g.content).replace(/\n/g, ''))));
    } else if (r.status !== 404) {
      return json({ error: `GitHub GET ${r.status}` }, 502);
    }
  } catch (e) { return json({ error: 'notes laden fehlgeschlagen: ' + String((e as Error).message || e) }, 502); }

  // 2) append a dated entry. (Date is fine here — server-side Deno, not the workflow sandbox.)
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const header = prevText ? '' : '# Solita-Notizen\n\n> Von Solita aufgeschrieben (Sprach-/Chat-Befehl).\n';
  const entry = `\n## ${stamp}\n${note}\n`;
  const newText = header + prevText + entry;

  // 3) commit it back to main.
  try {
    const content = btoa(unescape(encodeURIComponent(newText)));
    const put: Record<string, unknown> = {
      message: `solita: notiz — ${note}`.slice(0, 100),
      content, branch: BRANCH,
    };
    if (sha) put.sha = sha;   // omit on first create
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${NOTE_PATH}`, {
      method: 'PUT',
      headers: { ...GH_HEADERS(ghTok), 'Content-Type': 'application/json' },
      body: JSON.stringify(put),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: `GitHub PUT ${r.status}: ${out?.message || ''}` }, 502);
    return json({ ok: true, commit: out?.commit?.sha || null });
  } catch (e) { return json({ error: 'commit fehlgeschlagen: ' + String((e as Error).message || e) }, 502); }
});
