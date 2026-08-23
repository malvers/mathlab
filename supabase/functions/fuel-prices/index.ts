// Tracker — "fuel-prices" Edge Function (Tankstellen-Spur).
// Thin proxy to Tankerkönig (Markttransparenzstelle für Kraftstoffe / Bundeskartellamt): the client
// sends its coordinates, the function adds the secret API key and returns the nearby stations with
// their current e5/e10/diesel prices. The key lives ONLY here as a secret — never in the public web
// client / repo. Tankerkönig data is CC BY-NC: non-commercial use only, attribution required.
//
// Secret to set (dashboard → Edge Functions → Secrets):
//   TANKERKOENIG_KEY – free key from https://creativecommons.tankerkoenig.de/  [required]
//
// Deploy (no JWT needed — it only calls an external API and touches no user data):
//   supabase functions deploy fuel-prices --no-verify-jwt

import { guard } from '../_shared/guard.ts';

const LIST_URL = 'https://creativecommons.tankerkoenig.de/json/list.php';
const MAX_RAD = 25; // Tankerkönig hard limit (km)

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  /* Public endpoint with a server-side key behind it — see ../_shared/guard.ts
     (own pages / our key, burst limit, payload cap). */
  const blocked = guard(req, { maxBytes: 8_000, limit: 240 });
  if (blocked) return blocked;

  try {
    const key = Deno.env.get('TANKERKOENIG_KEY');
    if (!key) return json({ error: 'TANKERKOENIG_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

    const { lat, lng, rad } = await req.json().catch(() => ({}));
    if (typeof lat !== 'number' || typeof lng !== 'number') return json({ error: 'lat/lng fehlen' }, 400);
    const radius = Math.min(MAX_RAD, Math.max(1, Number(rad) || 5));

    // type=all → each station carries diesel/e5/e10 together; sort=dist (price-sort needs a single type).
    const url = `${LIST_URL}?lat=${lat}&lng=${lng}&rad=${radius}&sort=dist&type=all&apikey=${key}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'DocAlversTracker/1.0 (fuel)' } });
    if (!r.ok) return json({ error: 'Tankerkönig HTTP ' + r.status }, 502);

    const d = await r.json();
    if (!d || d.ok !== true) return json({ error: 'Tankerkönig: ' + (d?.message || 'unbekannt') }, 502);

    // Trim to the fields the client needs (keeps the payload small).
    // deno-lint-ignore no-explicit-any
    const stations = (Array.isArray(d.stations) ? d.stations : []).map((s: any) => ({
      id: s.id,
      name: s.name,
      brand: s.brand || '',
      lat: s.lat,
      lng: s.lng,
      dist: s.dist,
      isOpen: s.isOpen,
      e5: typeof s.e5 === 'number' ? s.e5 : null,
      e10: typeof s.e10 === 'number' ? s.e10 : null,
      diesel: typeof s.diesel === 'number' ? s.diesel : null,
      street: s.street || '',
      houseNumber: s.houseNumber || '',
      place: s.place || '',
      postCode: s.postCode || '',
    }));

    return json({ ok: true, count: stations.length, rad: radius, stations });
  } catch (e) {
    return json({ error: String((e && (e as Error).message) || e) }, 500);
  }
});
