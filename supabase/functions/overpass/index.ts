// Tracker — "overpass" Edge Function (OSM Overpass proxy).
//
// Why: the browser hitting the public Overpass mirrors directly gets rate-limited / refused / timed
// out (and is at the mercy of the client's local network — proxy, security tool, flaky mirror). Every
// tracker module also kept its own copy of the mirror list + fetch + failover. This function
// centralises that ONE server-side: the client sends the Overpass QL, we POST it to the three public
// mirrors with rotation + per-mirror timeout + failover, and return the RAW Overpass JSON
// byte-identical (including any `remark` and element `center`) so callers need NO parsing change.
//
// No secret needed — the Overpass mirrors are key-less (CLAUDE.md rule 18). Deploy public, like
// fuel-prices / tomtom-traffic (it only calls an external API and touches no user data):
//   supabase functions deploy overpass --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

// Three key-less public mirrors (same set the modules used). Rotated per request so we don't always
// hammer the same one first.
const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
let mirrorRot = 0; // module-scoped rotation cursor (survives across invocations in a warm instance)

const MAX_QL = 100000;       // guard: reject absurd bodies (the corridor query is the biggest, ~tens of KB)
const PER_MIRROR_MS = 28000; // matches the longest client need (speedprofile corridor, server [timeout:25])

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

// Pull the Overpass QL out of the request. Tolerate BOTH shapes:
//   • JSON body { data: <ql> }  (preferred — what the shared client helper sends, like fuel)
//   • form body  data=<urlencoded ql>  (what the old direct-to-mirror callers sent)
async function readQL(req: Request): Promise<string | null> {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  try {
    if (ct.includes('application/json')) {
      const b = await req.json().catch(() => ({}));
      const q = (b && (b.data ?? b.q ?? b.ql));
      return typeof q === 'string' && q.trim() ? q : null;
    }
    // form-urlencoded (or anything else) → read raw text and parse `data=`
    const raw = await req.text();
    const params = new URLSearchParams(raw);
    const q = params.get('data');
    return q && q.trim() ? q : null;
  } catch (_e) {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const ql = await readQL(req);
  if (!ql) return json({ error: 'missing Overpass QL (send {"data": "..."})' }, 400);
  if (ql.length > MAX_QL) return json({ error: 'query too large' }, 413);

  const body = 'data=' + encodeURIComponent(ql);
  let lastErr = 'all mirrors failed';

  // Try each mirror in turn from a rotated start; abort a stuck mirror after PER_MIRROR_MS and fail
  // over to the next. On the first clean 200 we stick the rotation cursor to the winner and stream its
  // JSON back UNCHANGED.
  for (let i = 0; i < MIRRORS.length; i++) {
    const idx = (mirrorRot + i) % MIRRORS.length;
    const url = MIRRORS[idx];
    const host = url.replace(/^https?:\/\//, '').split('/')[0];
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), PER_MIRROR_MS);
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'DocAlversTracker/1.0 (overpass-proxy)',
        },
        body,
        signal: ctrl.signal,
      });
      if (!r.ok) { lastErr = host + ' HTTP ' + r.status; continue; } // 429/5xx → next mirror
      const text = await r.text(); // pass the upstream JSON through verbatim (keeps remark / center / etc.)
      mirrorRot = idx; // stick with the mirror that worked
      return new Response(text, {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      lastErr = host + ' ' + ((e && (e as Error).name === 'AbortError') ? 'TIMEOUT' : String((e as Error)?.message || e));
    } finally {
      clearTimeout(to);
    }
  }

  // Every mirror failed → small JSON error with a non-200 status (502). The client helper maps any
  // non-ok / throw to null, so callers behave exactly as when their old overpass() returned null.
  return json({ error: 'overpass: ' + lastErr }, 502);
});
