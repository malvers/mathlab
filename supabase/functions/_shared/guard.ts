// Shared abuse guard for the public, login-less proxy functions (tts, gemini, identify, overpass,
// fuel-prices, reroute). Each of them carries a PAID or rate-limited API key as a server-side secret,
// and each is deployed with --no-verify-jwt so the labs can call it without a login.
//
// Measured on 2026-08-23: a bare `curl -X POST .../functions/v1/tts -d '{"text":"a"}'` — no key, no
// headers, nothing — returned 200 and Google-synthesised audio on Doc's bill. Same for gemini and
// identify. That is what this file closes.
//
// The gate, in order:
//   1. Origin — if the browser sends one it MUST be one of our own hosts. Blocks another site from
//      calling our proxies from its pages (hotlinking, embedded labs).
//   2. No Origin (native app, node script) — the request must at least carry our publishable Supabase
//      key, or the optional PIPELINE_KEY secret. Every real caller already does this.
//   3. Per-IP burst limit and a hard payload cap for everybody.
//
// Honest about what this is: the publishable key is public by design and an Origin header can be
// forged, so a determined attacker who reads the repo still gets through. What this stops is the
// whole drive-by class — scanners, copied URLs, foreign pages, runaway loops — and it bounds the burn
// rate per IP. The hard ceiling on the bill stays where it belongs: the daily quota / budget cap in
// the Google Cloud console (see README of this folder).

/* Hosts our own pages are served from. new URL() gives 'localhost' for capacitor://localhost and
   https://localhost too, which is what the Capacitor apps (tracker, pagode, solita, vgp) send. */
const ALLOWED_HOSTS = new Set([
  'docalvers.de',
  'www.docalvers.de',
  'malvers.github.io',
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

/* Publishable ("anon") key of the project — public by design, it sits in every lab page. Presence of
   it only proves the caller copied our client, not who they are. */
const PUBLISHABLE = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';

const CORS_BASE: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function deny(msg: string, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...CORS_BASE, ...extra, 'Content-Type': 'application/json' },
  });
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return false;
  try {
    return ALLOWED_HOSTS.has(new URL(origin).hostname);
  } catch {
    return false;            /* 'null' (file://) and garbage land here */
  }
}

function carriesOurKey(req: Request): boolean {
  const pipeline = Deno.env.get('PIPELINE_KEY') || '';
  if (pipeline && req.headers.get('x-app-key') === pipeline) return true;
  const apikey = req.headers.get('apikey') || '';
  const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return apikey === PUBLISHABLE || auth === PUBLISHABLE;
}

/* Per-IP counters, kept in the isolate's memory. Not exact — Supabase runs several isolates and
   recycles them — but it costs nothing and reliably cuts a single client hammering one instance.
   `cost` lets a caller charge more than one unit per request (tts charges characters). */
const hits = new Map<string, { n: number; t: number }>();

function charge(ip: string, cost: number, windowMs: number): number {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now - e.t > windowMs) {
    if (hits.size > 10000) hits.clear();      /* crude memory bound, the window resets for everyone */
    hits.set(ip, { n: cost, t: now });
    return cost;
  }
  e.n += cost;
  return e.n;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

export interface GuardOpts {
  maxBytes?: number;      /* reject a bigger payload before reading it */
  limit?: number;         /* requests per window and IP */
  windowMs?: number;      /* default 5 min */
}

/* Run FIRST in the handler, right after the OPTIONS preflight. Returns a Response to send back when
   the request must be refused, or null when it may proceed. */
export function guard(req: Request, opts: GuardOpts = {}): Response | null {
  const { maxBytes = 1_000_000, limit = 120, windowMs = 5 * 60_000 } = opts;

  const origin = req.headers.get('origin');
  if (origin ? !originAllowed(origin) : !carriesOurKey(req)) {
    return deny('nicht autorisiert — diese Funktion beantwortet nur Anfragen von docalvers.de', 403);
  }

  const len = Number(req.headers.get('content-length') || 0);
  if (maxBytes && len > maxBytes) {
    return deny('Anfrage zu groß (max. ' + Math.round(maxBytes / 1024) + ' kB)', 413);
  }

  if (charge(clientIp(req), 1, windowMs) > limit) {
    return deny('zu viele Anfragen — bitte kurz warten', 429, { 'Retry-After': String(Math.ceil(windowMs / 1000)) });
  }
  return null;
}

/* Second stage for functions whose cost scales with the payload, not the request count (tts pays per
   character). Call after parsing the body; returns a Response when the budget is spent. */
export function budgetExceeded(req: Request, cost: number, limit: number, windowMs = 5 * 60_000): Response | null {
  if (charge('chars:' + clientIp(req), cost, windowMs) > limit) {
    return deny('Text-Kontingent für die nächsten Minuten aufgebraucht — bitte später weiter', 429,
      { 'Retry-After': String(Math.ceil(windowMs / 1000)) });
  }
  return null;
}
