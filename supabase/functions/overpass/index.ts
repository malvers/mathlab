// Tracker — "overpass" Edge Function (OSM Overpass proxy).
//
// Why: the browser hitting the public Overpass mirrors directly gets rate-limited / refused / timed
// out (and is at the mercy of the client's local network — proxy, security tool, flaky mirror). Every
// tracker module also kept its own copy of the mirror list + fetch + failover. This function
// centralises that ONE server-side: the client sends the Overpass QL, we RACE all three public mirrors
// in parallel (Promise.any) — the first healthy 200 wins, a slow/dead mirror is simply ignored — and
// return that mirror's RAW Overpass JSON byte-identical (including any `remark` and element `center`)
// so callers need NO parsing change.
//
// Racing (not sequential failover) is the whole point: when a mirror is overloaded it just hangs, and
// a sequential loop would burn the client's whole timeout budget on the first slow mirror before ever
// trying a fast one. Parallel means we return as soon as ANY mirror answers.
//
// No secret needed — the Overpass mirrors are key-less (CLAUDE.md rule 18). Deploy public, like
// fuel-prices / tomtom-traffic (it only calls an external API and touches no user data):
//   supabase functions deploy overpass --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse

// Key-less public mirrors, raced in parallel — the first healthy one wins, so an overload/outage of one
// operator doesn't take us down. ALL must be WORLDWIDE instances: a regional extract (e.g. the Swiss
// overpass.osm.ch, verified 2026-06-28 to hold no Dresden data) would return a fast 200 with EMPTY
// elements, win the race, and falsely report "no road".
//
// Geo-diverse + health-verified 2026-06-29 (the German .de/.kumi/.private set was overloaded and the
// deployed proxy still lacked the working ones → a flood of 502s, the "Geschwindigkeits-Disaster").
// openstreetmap.fr (~0.4 s) and maps.mail.ru (~0.4 s) are the fastest reliable worldwide instances;
// the rest stay in the race as spares (a dead one is simply ignored).
const MIRRORS = [
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const MAX_QL = 100000;          // guard: reject absurd bodies (the corridor query is the biggest, ~tens of KB)
const DEFAULT_TIMEOUT_MS = 12000; // per-mirror abort if the client didn't ask for a specific budget
const MIN_TIMEOUT_MS = 3000;
const MAX_TIMEOUT_MS = 28000;   // ceiling — covers the speedprofile corridor (server-side [timeout:25])

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

// Pull the Overpass QL (+ optional per-mirror timeout) out of the request. Tolerate BOTH shapes:
//   • JSON body { data: <ql>, timeout?: <ms> }  (preferred — what the shared client helper sends)
//   • form body  data=<urlencoded ql>           (legacy direct-to-mirror callers)
async function readBody(req: Request): Promise<{ ql: string | null; timeout: number }> {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  try {
    if (ct.includes('application/json')) {
      const b = await req.json().catch(() => ({}));
      const ql = b && (b.data ?? b.q ?? b.ql);
      const t = b && Number(b.timeout);
      return { ql: typeof ql === 'string' && ql.trim() ? ql : null, timeout: Number.isFinite(t) ? t : 0 };
    }
    const raw = await req.text();
    const p = new URLSearchParams(raw);
    const ql = p.get('data');
    const t = Number(p.get('timeout'));
    return { ql: ql && ql.trim() ? ql : null, timeout: Number.isFinite(t) ? t : 0 };
  } catch (_e) {
    return { ql: null, timeout: 0 };
  }
}

// Fetch one mirror, aborting after timeoutMs. Resolves with the upstream JSON TEXT on a clean 200;
// rejects (so Promise.any moves on) on non-200, timeout, or network error.
async function tryMirror(url: string, body: string, timeoutMs: number): Promise<string> {
  const host = url.replace(/^https?:\/\//, '').split('/')[0];
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
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
    if (!r.ok) { console.error('overpass mirror', host, 'HTTP', r.status); throw new Error(host + ' HTTP ' + r.status); }
    const text = await r.text(); // pass the upstream JSON through verbatim (keeps remark / center / etc.)
    console.log('overpass mirror', host, 'OK', text.length, 'bytes');
    return text;
  } catch (e) {
    const name = e && (e as Error).name;
    if (name === 'AbortError') console.error('overpass mirror', host, 'TIMEOUT');
    throw e;
  } finally {
    clearTimeout(to);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const { ql, timeout } = await readBody(req);
  if (!ql) return json({ error: 'missing Overpass QL (send {"data": "..."})' }, 400);
  if (ql.length > MAX_QL) return json({ error: 'query too large' }, 413);

  const perMirror = Math.min(MAX_TIMEOUT_MS, Math.max(MIN_TIMEOUT_MS, timeout || DEFAULT_TIMEOUT_MS));
  const body = 'data=' + encodeURIComponent(ql);

  // Race all mirrors; the first clean 200 wins, the rest are abandoned. If every mirror rejects,
  // Promise.any throws an AggregateError → 502, which the client helper maps to null (callers then
  // behave exactly as when their old overpass() returned null).
  try {
    const text = await Promise.any(MIRRORS.map((u) => tryMirror(u, body, perMirror)));
    return new Response(text, { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } });
  } catch (_e) {
    console.error('overpass: all mirrors failed');
    return json({ error: 'overpass: all mirrors failed' }, 502);
  }
});
