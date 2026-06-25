// Tracker — "reroute" Edge Function (Google-näheres Off-Route-Rerouting via OpenRouteService).
//
// Why: the public OSRM instance has no avoid-area, no heading tolerance and no U-turn penalty, so an
// off-route reroute can get "pulled back" onto the rejected line (Doc 2026-06-25, see
// HTML/tracker/reroute-recherche-google.md). OpenRouteService (ORS) supports a departure bearing with a
// tolerance and U-turn handling. This function is a thin proxy: the client sends from/to (+ heading), we
// add the secret ORS key, call ORS, and TRANSLATE the answer into the SAME shape OSRM returns so the web
// client's existing parser (drawRoute + setGuidance) stays unchanged. On ANY problem the client falls
// back to OSRM, so this is purely additive.
//
// Secret to set (dashboard → Edge Functions → Secrets):
//   ORS_API_KEY – free key from https://openrouteservice.org/dev/#/signup  (2.500/day, 40k/month) [required]
//
// Deploy (no JWT needed — only calls an external API, touches no user data):
//   supabase functions deploy reroute --no-verify-jwt

const ORS_BASE = 'https://api.openrouteservice.org/v2/directions';
const HEADING_TOLERANCE = 60; // ± degrees around the travel heading (Valhalla's sensible default)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// ORS instruction type (int) → OSRM (type, modifier), so the client's phrase()/isSilentManeuver() work.
function orsTypeToOsrm(t: number): { type: string; modifier?: string } {
  switch (t) {
    case 0: return { type: 'turn', modifier: 'left' };
    case 1: return { type: 'turn', modifier: 'right' };
    case 2: return { type: 'turn', modifier: 'sharp left' };
    case 3: return { type: 'turn', modifier: 'sharp right' };
    case 4: return { type: 'turn', modifier: 'slight left' };
    case 5: return { type: 'turn', modifier: 'slight right' };
    case 6: return { type: 'turn', modifier: 'straight' };      // → silenced client-side
    case 7: return { type: 'roundabout', modifier: 'right' };   // enter roundabout (exit carried separately)
    case 8: return { type: 'continue', modifier: 'straight' };  // exit roundabout → silent
    case 9: return { type: 'turn', modifier: 'uturn' };
    case 10: return { type: 'arrive' };
    case 11: return { type: 'depart' };
    case 12: return { type: 'fork', modifier: 'slight left' };  // keep left
    case 13: return { type: 'fork', modifier: 'slight right' }; // keep right
    default: return { type: 'continue', modifier: 'straight' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const key = Deno.env.get('ORS_API_KEY');
    if (!key) return json({ code: 'Error', error: 'ORS_API_KEY fehlt — als Edge-Function-Secret setzen.' }, 500);

    const body = await req.json().catch(() => ({}));
    const from = body.from, to = body.to;            // [lat, lng]
    const heading = (typeof body.heading === 'number') ? Math.round(((body.heading % 360) + 360) % 360) : null;
    const profile = body.profile === 'foot-walking' ? 'foot-walking' : 'driving-car';
    if (!Array.isArray(from) || !Array.isArray(to) || from.length < 2 || to.length < 2) {
      return json({ code: 'Error', error: 'from/to [lat,lng] fehlen' }, 400);
    }

    // ORS wants [lon,lat]. Constrain ONLY the departure direction (origin) to the travel heading with a
    // tolerance → forward reroute, no immediate U-turn back; the destination stays unconstrained ([0,180]
    // = any). continue_straight:false → the engine may still U-turn where it is genuinely best (dead end).
    const reqBody: Record<string, unknown> = {
      coordinates: [[from[1], from[0]], [to[1], to[0]]],
      instructions: true,
      continue_straight: false,
    };
    if (heading != null) reqBody.bearings = [[heading, HEADING_TOLERANCE], [0, 180]];
    if (body.avoid_polygons) reqBody.options = { avoid_polygons: body.avoid_polygons };

    const r = await fetch(`${ORS_BASE}/${profile}/geojson`, {
      method: 'POST',
      headers: { Authorization: key, 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });
    if (!r.ok) return json({ code: 'Error', error: 'ORS HTTP ' + r.status }, 502);

    const ors = await r.json();
    const f = ors && ors.features && ors.features[0];
    if (!f || !f.geometry || !f.properties) return json({ code: 'Error', error: 'ORS: keine Route' }, 502);

    const coords = f.geometry.coordinates || [];     // [[lon,lat], …]
    const summary = f.properties.summary || {};
    const steps: unknown[] = [];
    // deno-lint-ignore no-explicit-any
    (f.properties.segments || []).forEach((seg: any) => (seg.steps || []).forEach((st: any) => {
      const wp = (st.way_points && st.way_points[0] != null) ? st.way_points[0] : 0;
      const loc = coords[Math.min(wp, coords.length - 1)] || coords[0]; // [lon,lat], OSRM order
      const m = orsTypeToOsrm(st.type);
      steps.push({
        name: (st.name && st.name !== '-') ? st.name : '',
        maneuver: { location: loc, type: m.type, modifier: m.modifier, exit: st.exit_number || undefined },
      });
    }));

    // OSRM-shaped output → the web client parses it unchanged.
    return json({
      code: 'Ok',
      routes: [{
        geometry: f.geometry,                 // GeoJSON LineString, [lon,lat] — same as OSRM geometries=geojson
        distance: summary.distance || 0,
        duration: summary.duration || 0,
        legs: [{ steps }],
      }],
    });
  } catch (e) {
    return json({ code: 'Error', error: String(e) }, 500);
  }
});
