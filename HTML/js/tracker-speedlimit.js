// js/tracker-speedlimit.js — show the current road's speed limit (OSM maxspeed via Overpass).
//
// Position-driven, independent of navigation: on each GPS fix (throttled) it asks Overpass for the
// road you're on and shows a round speed-limit sign. If your smoothed speed exceeds the limit, the
// sign turns red. Free + key-less (CLAUDE.md rule 18). Best-effort: Overpass can be slow/rate-limited,
// so failures are silent and the last known limit stays on screen.
window.TrackerSpeedLimit = function (ctx) {
    const { $ } = ctx;

    const OVERPASS = 'https://overpass-api.de/api/interpreter';
    const MIN_INTERVAL_MS = 15000; // never query Overpass more often than this
    const MIN_MOVE_M = 60;         // …and only after the position moved at least this far
    const OVER_TOL_KMH = 3;        // grace before flagging "too fast" (GPS speed noise)

    let lastQ = 0;          // timestamp of the last Overpass query
    let lastPos = null;     // [lat,lng] at the last query
    let fetching = false;   // a query is in flight
    let curLimit = null;    // number (km/h) | 'none' (unlimited) | null (unknown)

    function haversine(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }

    // OSM maxspeed string → km/h number, 'none' (Autobahn unlimited), or null (unknown/implicit zone).
    function parseMax(v) {
        if (!v) return null;
        if (/^\d+$/.test(v)) return parseInt(v, 10);                 // "50", "100"
        if (/\bnone\b/i.test(v)) return 'none';                      // "none" → unlimited
        if (/walk/i.test(v)) return 7;                              // "walk" ≈ Schrittgeschwindigkeit
        const mph = v.match(/^(\d+)\s*mph$/i);
        if (mph) return Math.round(parseInt(mph[1], 10) * 1.60934); // "30 mph" → km/h
        return null; // implicit tags like "DE:urban" carry no explicit number → unknown
    }

    function setSign(limit, over) {
        const el = $('speed-sign'); if (!el) return;
        if (limit == null) { el.hidden = true; el.classList.remove('over'); return; }
        el.textContent = (limit === 'none') ? '∞' : String(limit);
        el.classList.toggle('over', !!over && limit !== 'none');
        el.hidden = false;
    }

    async function query(p) {
        fetching = true;
        // Roads passing within 25 m of the fix that carry a maxspeed tag — almost always just your road.
        const q = '[out:json][timeout:8];way(around:25,' + p[0] + ',' + p[1] + ')[highway][maxspeed];out tags 4;';
        try {
            const r = await fetch(OVERPASS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'data=' + encodeURIComponent(q),
            });
            const j = await r.json();
            let lim = null;
            for (const e of (j && j.elements) || []) {
                const m = e.tags && parseMax(e.tags.maxspeed);
                if (m != null) { lim = m; break; } // first road with a parseable limit
            }
            curLimit = lim;
            setSign(lim, false);
        } catch (e) { /* silent: keep the last known sign */ }
        fetching = false;
    }

    // Called from the core on every GPS fix: update the over-limit colour every time (cheap), and
    // re-query Overpass only when throttle + movement allow.
    function update(here, still, speedKmh) {
        if (typeof curLimit === 'number' && speedKmh != null) {
            setSign(curLimit, speedKmh > curLimit + OVER_TOL_KMH);
        }
        if (!here || still || fetching) return;
        const now = Date.now();
        if (now - lastQ < MIN_INTERVAL_MS) return;
        if (lastPos && haversine(here, lastPos) < MIN_MOVE_M) return;
        lastQ = now; lastPos = here;
        query(here);
    }

    function clear() { curLimit = null; lastPos = null; setSign(null, false); }

    return { update, clear };
};
