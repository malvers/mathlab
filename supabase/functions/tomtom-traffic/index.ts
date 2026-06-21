// Tracker — "tomtom-traffic" Edge Function (Phase 2 of the Verkehrs-Spur).
//
// Proxies the TomTom Traffic Incident API so the API key stays SERVER-SIDE (this repo is PUBLIC,
// CLAUDE.md rule 18 — no key in the client). Used for live traffic OUTSIDE Germany (e.g. Spain/Altea),
// where the keyless Autobahn-GmbH API does not reach. In Germany the client keeps using the free
// Autobahn API directly (Phase 1) — this function is only hit abroad / when explicitly enabled.
//
// ⚠️ INERT until deployed AND the TOMTOM_KEY secret is set. Until then the client's TomTom branch just
//    fails gracefully (no pins). DEPLOY is blocked by the current Supabase 402 egress lock — do it once
//    the project is un-restricted (see project_egress_audit_todo / project_tracker_egress_incident).
//
// Client contract:
//   POST { bbox: { minLon, minLat, maxLon, maxLat }, lang? }  -> { ok:true, incidents:[…GeoJSON Features…] }
//
// ── EINMALIGE EINRICHTUNG (Doc, SPÄTER) ────────────────────────────────────────────────────────────
//  1) developer.tomtom.com → kostenloser Account (keine Kreditkarte) → "API & SDK keys" → Key kopieren.
//  2) supabase secrets set TOMTOM_KEY="…" --project-ref fyfhxzyymmurlaenmzse
//  3) supabase functions deploy tomtom-traffic --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
//  4) Verify: POST mit einer Altea-bbox → { ok:true, incidents:[…] }; der Key bleibt server-seitig.
//
// Attribution (Pflicht): der Client zeigt "© TomTom" wenn TomTom-Daten dargestellt werden.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// TomTom Traffic Incident Details v5. We request a compact GeoJSON FeatureCollection so the client can
// render it like the Autobahn items (geometry + a few properties). iconCategory drives the pin colour:
//   8 = road closed → Sperrung (red) · 9 = roadworks → Baustelle (orange) · 6 = jam / others → Warnung (orange)
const FIELDS = '{incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,'
  + 'delay,length,startTime,endTime,from,to,roadNumbers,events{description,code,iconCategory}}}}';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const key = Deno.env.get('TOMTOM_KEY');
  if (!key) return json({ error: 'TOMTOM_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

  const b = await req.json().catch(() => ({}));
  const bx = b && b.bbox;
  const nums = bx && [bx.minLon, bx.minLat, bx.maxLon, bx.maxLat];
  if (!nums || nums.some((n: unknown) => typeof n !== 'number' || isNaN(n as number))) {
    return json({ error: 'bbox {minLon,minLat,maxLon,maxLat} (Zahlen) erforderlich' }, 400);
  }
  const lang = (typeof b.lang === 'string' && /^[a-z]{2}-[A-Z]{2}$/.test(b.lang)) ? b.lang : 'de-DE';

  const url = 'https://api.tomtom.com/traffic/services/5/incidentDetails'
    + '?key=' + encodeURIComponent(key)
    + '&bbox=' + nums.join(',')
    + '&fields=' + encodeURIComponent(FIELDS)
    + '&language=' + lang
    + '&timeValidityFilter=present';

  try {
    const r = await fetch(url);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: 'TomTom ' + r.status + ': ' + (d?.detailedError?.message || d?.error || '') }, 502);
    return json({ ok: true, incidents: (d && d.incidents) || [] });
  } catch (e) {
    return json({ error: 'TomTom fetch fehlgeschlagen: ' + String((e as Error).message || e) }, 502);
  }
});
