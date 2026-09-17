// DOCPAD — "docpad-key" Edge Function. Hands out the key of the encrypted DOCPAD bundle (docalvers.de/docpad/) to
// whoever knows the DOCPAD password (Doc, 17.09.2026: "kann man DP ändern 'auf Solita'" - a new password without a
// new bundle and a push). The bundle is encrypted with a random AES-256 key that never changes with the password; this
// function is the doorman in front of that key, like the password gate of the "claude" function for Solita.
//
// Client contract: POST (a simple request, text/plain, no preflight) { pass } ->
//   200 { key: <base64 of the 32-byte AES-GCM key> }   the password is right
//   401 { error }                                       it is not
//   403/413/429 from ../_shared/guard.ts                foreign page, payload too big, too many tries from one IP
//
// Secrets (Dashboard → Edge Functions → Secrets, or `supabase secrets set`):
//   DOCPAD_PASSWORD  — the password (source of truth for Doc: macOS keychain, service "docpad-web")
//   DOCPAD_DATA_KEY  — base64 of the bundle key (macOS keychain, service "docpad-data-key"; docpad/tools/pack_web.mjs
//                      encrypts with it). Changing it needs a new bundle.
// Deploy (no JWT — own password gate, touches no user data):
//   supabase functions deploy docpad-key --no-verify-jwt

import { guard } from '../_shared/guard.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

// compares in time independent of where the strings differ, so the answer time gives nothing away
function sameText(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  /* Only our own pages, a small payload, and a cap on tries per IP. A whole class unlocks from one school IP, but
     only on a device's first unlock - a remembered device opens new bundles without asking again. */
  const blocked = guard(req, { maxBytes: 2_000, limit: 60 });
  if (blocked) return blocked;

  const pass = Deno.env.get('DOCPAD_PASSWORD') || '';
  const key = Deno.env.get('DOCPAD_DATA_KEY') || '';
  if (pass.length < 12 || !key) return json({ error: 'DOCPAD ist gerade nicht eingerichtet.' }, 500);

  const b = await req.json().catch(() => ({}));
  const given = typeof b.pass === 'string' ? b.pass : '';
  if (!sameText(given, pass)) {
    await new Promise((r) => setTimeout(r, 400));   // a wrong try costs time
    return json({ error: 'Passwort falsch' }, 401);
  }
  return json({ key });
});
