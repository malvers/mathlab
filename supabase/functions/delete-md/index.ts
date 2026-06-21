// supabase/functions/delete-md/index.ts — edit/delete a single .md file in the public repo
// (malvers/mathlab), gated by the Solita password. Used by HTML/ideas/ideas.html (the .md browser).
// Mirrors solita-config's GitHub usage (Contents API, GITHUB_TOKEN).
//
// Client contract (POST, header x-app-pass == LABAI_PASSWORD):
//   { "path": "HTML/tracker/ideen.md", "content": "<new full markdown>" }  → PUT (section/item edit)
//   { "path": "HTML/tracker/ideen.md" }                                    → DELETE the whole file
// (Naming: kept as `delete-md` for a stable deploy step; it now also writes content.)
//
// ⚠️ INERT until deployed. Secrets (both already exist):
//   LABAI_PASSWORD — shared app password (server-side check; never shipped to the client).
//   GITHUB_TOKEN   — fine-grained PAT, repo malvers/mathlab, permission "Contents: Read and write".

const OWNER = 'malvers';
const REPO = 'mathlab';
const BRANCH = 'main';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-pass',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const GH_HEADERS = (tok: string) => ({
  'Authorization': 'Bearer ' + tok,
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'ideas-md',
  'X-GitHub-Api-Version': '2022-11-28',
});
function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}
// UTF-8 → base64 (GitHub Contents API wants base64 content).
function toB64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const pass = Deno.env.get('LABAI_PASSWORD');
  const ghTok = Deno.env.get('GITHUB_TOKEN');
  if (!pass) return json({ error: 'LABAI_PASSWORD fehlt.' }, 500);
  if (!ghTok) return json({ error: 'GITHUB_TOKEN fehlt — als Edge-Function-Secret setzen.' }, 500);

  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch (_) { /* empty body → handled below */ }
  const given = req.headers.get('x-app-pass') || (typeof b.pass === 'string' ? b.pass : '');
  if (given !== pass) return json({ error: 'Passwort falsch.' }, 401);

  const path = (typeof b.path === 'string' ? b.path : '').trim();
  // string content present → edit (PUT); absent → delete the whole file.
  const isEdit = typeof b.content === 'string';
  const newContent = isEdit ? (b.content as string) : '';

  // Safety: only .md, no absolute paths / traversal, and never the load-bearing CLAUDE.md.
  if (!path || !path.toLowerCase().endsWith('.md')) return json({ error: 'Nur .md-Dateien erlaubt.' }, 400);
  if (path.startsWith('/') || path.includes('..')) return json({ error: 'Ungültiger Pfad.' }, 400);
  if (path === 'CLAUDE.md' || path.endsWith('/CLAUDE.md')) return json({ error: 'CLAUDE.md ist geschützt.' }, 403);

  const ghPath = path.split('/').map(encodeURIComponent).join('/');

  // 1) current sha of the file (both PUT and DELETE need it).
  let sha: string;
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${ghPath}?ref=${BRANCH}`,
      { headers: GH_HEADERS(ghTok) });
    if (r.status === 404) return json({ error: 'Datei nicht gefunden: ' + path }, 404);
    if (!r.ok) return json({ error: `GitHub GET ${r.status}` }, 502);
    const g = await r.json();
    sha = g.sha;
  } catch (e) {
    return json({ error: 'GitHub GET fehlgeschlagen: ' + ((e as Error)?.message || e) }, 502);
  }

  // 2) commit the change to main.
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ghPath}`;
    const init: RequestInit = isEdit
      ? {
          method: 'PUT',
          headers: { ...GH_HEADERS(ghTok), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'ideas: edit ' + path + ' (via ideas.html)', content: toB64(newContent), sha, branch: BRANCH }),
        }
      : {
          method: 'DELETE',
          headers: { ...GH_HEADERS(ghTok), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'ideas: delete ' + path + ' (via ideas.html)', sha, branch: BRANCH }),
        };
    const r = await fetch(url, init);
    const out = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: `GitHub ${isEdit ? 'PUT' : 'DELETE'} ${r.status}: ${out?.message || ''}` }, 502);
    return json({ ok: true, path, action: isEdit ? 'edit' : 'delete', commit: out?.commit?.sha || null });
  } catch (e) {
    return json({ error: 'GitHub commit fehlgeschlagen: ' + ((e as Error)?.message || e) }, 502);
  }
});
