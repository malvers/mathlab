// SVP — "upload-zahl" Edge Function: how many entries an Abgabe folder holds, for the upload pill of the plan
// (Doc, 29.09.2026: "Könnte man den Button updaten? Je nachdem, wie viele Files da drin sind").
//
// Why a function: SharePoint lets no page of docalvers.de read the folder (CORS), and Microsoft Graph needs an app
// consent the IBB does not grant (AADSTS65002). But the folder's own share link ("Anyone with the link") opens it
// for an anonymous guest - and that guest may ask SharePoint's REST API for the folder's ItemCount (measured
// 29.09.2026: HTTP 200, {"ItemCount":5}). So this function walks the share link like a visitor (following the
// redirects by hand, keeping the cookies SharePoint sets on the way), reads the folder path off the landing URL
// and asks for the count. It returns the number and nothing else - no names, no files.
//
// Only IBB OneDrive folder links (/:f:/) are taken: anything else would make this an open door into the web.
// One answer per link and minute (CACHE), so a whole class behind one school IP asks SharePoint once, not
// twenty-five times. Subfolders count as entries.
//
// No secret involved (CLAUDE.md rule 18). Deploy public like overpass - the page calls it without a login:
//   supabase functions deploy upload-zahl --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
import { guard } from '../_shared/guard.ts';

const ERLAUBT = /^https:\/\/ibbdresden-my\.sharepoint\.com\/:f:\/g\/personal\/[a-z0-9_-]+\/[A-Za-z0-9_-]+(\?e=[A-Za-z0-9]+)?$/;
const HOST = 'ibbdresden-my.sharepoint.com';
const FRISCH_MS = 60_000;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const CACHE = new Map<string, { n: number; t: number }>();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

async function zahl(link: string): Promise<number> {
  const jar = new Map<string, string>();
  const cookies = () => [...jar].map(([k, v]) => k + '=' + v).join('; ');
  let url = link;
  for (let hop = 0; hop < 10; hop++) {
    const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA, Cookie: cookies() } });
    for (const c of res.headers.getSetCookie()) {
      const kv = c.split(';')[0], i = kv.indexOf('=');
      if (i > 0) jar.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim());
    }
    await res.body?.cancel();
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) { url = new URL(loc, url).href; continue; }
    break;
  }
  const ziel = new URL(url);
  /* a link that needs a login ends at login.microsoftonline.com - then there is no count to give */
  if (ziel.hostname !== HOST) throw new Error('Freigabe verlangt eine Anmeldung');
  const pfad = ziel.searchParams.get('id') || '';
  const site = (pfad.match(/^\/personal\/[^/]+/) || [''])[0];
  if (!site) throw new Error('kein Ordnerpfad');
  const api = 'https://' + HOST + site + "/_api/web/GetFolderByServerRelativeUrl('" +
    encodeURIComponent(pfad.replace(/'/g, "''")) + "')?$select=ItemCount";
  const r = await fetch(api, { headers: { 'User-Agent': UA, Cookie: cookies(), Accept: 'application/json;odata=nometadata' } });
  if (!r.ok) throw new Error('SharePoint ' + r.status);
  const j = await r.json();
  if (typeof j.ItemCount !== 'number') throw new Error('keine Zahl');
  return j.ItemCount;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  /* public, login-less - see ../_shared/guard.ts; a class behind one school IP asks once a minute per device */
  const blocked = guard(req, { maxBytes: 4_000, limit: 600 });
  if (blocked) return blocked;
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  let link = '';
  try { link = String((await req.json()).url || ''); } catch { /* no body */ }
  if (!ERLAUBT.test(link)) return json({ error: 'nur Abgabe-Ordner der IBB' }, 400);
  const c = CACHE.get(link);
  if (c && Date.now() - c.t < FRISCH_MS) return json({ n: c.n });
  try {
    const n = await zahl(link);
    if (CACHE.size > 500) CACHE.clear();
    CACHE.set(link, { n, t: Date.now() });
    return json({ n });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }
});
