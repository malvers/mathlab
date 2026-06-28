// js/tracker-speedprofile.js — precomputed speed-limit profile for the ACTIVE navigation route.
//
// Problem it solves (Doc 2026-06-28): the live #speed-sign (tracker-speedlimit.js) polls Overpass per
// GPS fix. Leaving a town the 50→100 switch lands LATE (we sample too rarely) and frequent sampling
// costs. But while navigating we already KNOW the whole route — so we can resolve the limit for the
// ENTIRE line ONCE, mark every change point on the route, and then switch the sign EXACTLY at the
// point from the precomputed profile (instant, accurate, zero further Overpass calls). The profile is
// CACHED per route (start/dest/mode) so a frequently-driven stretch is never recomputed.
//
// Free + key-less (CLAUDE.md rule 18): one Overpass "corridor" query (way(around:…, <route polyline>))
// reuses the SAME limit resolver as the live sign, so the numbers always agree. Best-effort: if
// Overpass fails the profile simply doesn't build and the live sign keeps polling as before.
window.TrackerSpeedProfile = function (ctx) {
    const { map } = ctx;

    const OVERPASS_MIRRORS = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.private.coffee/api/interpreter',
    ];
    let mirrorRot = 0;
    const QUERY_TIMEOUT_MS = 28000;   // > the server-side [timeout:25] below; a whole-route corridor is big
    const CORRIDOR_M = 25;            // ways within this distance of the route count
    const MAX_VERTS = 2500;           // guard: very long routes are downsampled for resolution (cost/time)
    const MAX_CORRIDOR_PTS = 800;     // cap the around-polyline length so the query body stays sane
    const CACHE_PREFIX = 'trk_speedprofile_';
    const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 60; // 60 days — OSM limits change rarely

    let resolveLimit = null;          // injected from the live sign so the logic is identical (setResolver)
    let routePts = null;              // the route [[lat,lng]…] the current profile is aligned to
    let vertexLimit = null;           // carry-forward limit per route vertex: number | 'none' | null
    let changePoints = [];            // [{lat,lng,limit}] where the limit changes — drawn on the route
    let markers = null;               // Leaflet layerGroup of the change-point badges
    let buildGen = 0;                 // bumped per build so a slow Overpass answer can't apply to a newer route

    function setResolver(fn) { resolveLimit = fn; }
    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('🚦 ' + msg); } catch (e) { } }

    function hasRoute() { return !!(vertexLimit && vertexLimit.length && routePts && routePts.length); }

    // ---- geometry helpers (equirectangular; same approach as tracker-speedlimit / nav) -------------
    function distToWay(p, geom) {
        if (!geom || geom.length < 1) return Infinity;
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (la, lo) => [lo * 111320 * k, la * 110540];
        const px = xy(p[0], p[1]);
        let min = Infinity;
        for (let i = 1; i < geom.length; i++) {
            const a = xy(geom[i - 1].lat, geom[i - 1].lon), b = xy(geom[i].lat, geom[i].lon);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((px[0] - a[0]) * dx + (px[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            min = Math.min(min, Math.hypot(px[0] - (a[0] + t * dx), px[1] - (a[1] + t * dy)));
        }
        if (geom.length === 1) { const a = xy(geom[0].lat, geom[0].lon); min = Math.hypot(px[0] - a[0], px[1] - a[1]); }
        return min;
    }

    // Nearest route segment to a point → end index `bi`. Mirrors nav.nearestSeg so limitAt() agrees
    // with where the route is drawn.
    function nearestSegIdx(here) {
        const k = Math.cos(here[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const p = xy(here);
        let bi = 1, bd = Infinity;
        for (let i = 1; i < routePts.length; i++) {
            const a = xy(routePts[i - 1]), b = xy(routePts[i]);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
            if (d < bd) { bd = d; bi = i; }
        }
        return bi;
    }

    // The precomputed limit at the current position: number | 'none' (unlimited) | null (on route but
    // unknown — let the live sign fall back) | undefined (no profile / off route).
    function limitAt(here) {
        if (!hasRoute() || !here) return undefined;
        const bi = nearestSegIdx(here);
        const v = vertexLimit[bi - 1];
        return (v === undefined) ? null : v; // map a missing slot to null (known gap), never undefined
    }

    // ---- Overpass --------------------------------------------------------------------------------
    async function overpass(q) {
        for (let i = 0; i < OVERPASS_MIRRORS.length; i++) {
            const url = OVERPASS_MIRRORS[(mirrorRot + i) % OVERPASS_MIRRORS.length];
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), QUERY_TIMEOUT_MS);
            try {
                const r = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'data=' + encodeURIComponent(q),
                    signal: ctrl.signal,
                });
                if (!r.ok) continue;
                const j = await r.json();
                mirrorRot = (mirrorRot + i) % OVERPASS_MIRRORS.length;
                return j;
            } catch (e) { /* timeout/offline/parse → next mirror */ }
            finally { clearTimeout(to); }
        }
        return null;
    }

    // ---- cache -----------------------------------------------------------------------------------
    // Key by mode + start/dest rounded to ~110 m so the SAME everyday route hits the cache even though
    // the GPS start point jitters a few metres each time. Stored value = the change points (compact).
    function cacheKey(meta) {
        const r = (x) => (Math.round(x * 1000) / 1000).toFixed(3);
        const s = meta.start, d = meta.dest;
        return CACHE_PREFIX + (meta.mode || 'car') + '|' + r(s[0]) + ',' + r(s[1]) + '|' + r(d[0]) + ',' + r(d[1]);
    }
    function cacheGet(meta) {
        try {
            const raw = localStorage.getItem(cacheKey(meta));
            if (!raw) return null;
            const o = JSON.parse(raw);
            if (!o || o.v !== 1 || !Array.isArray(o.cps)) return null;
            if (o.t && (Date.now() - o.t) > CACHE_TTL_MS) return null;
            return o.cps;
        } catch (e) { return null; }
    }
    function cachePut(meta, cps) {
        try { localStorage.setItem(cacheKey(meta), JSON.stringify({ v: 1, t: Date.now(), cps })); } catch (e) { }
    }

    // ---- build the per-vertex limit array --------------------------------------------------------
    // Resolve a raw limit for each route vertex from the corridor ways, then CARRY FORWARD across gaps
    // so a short untagged stretch doesn't blank the sign. Returns the carry-forward array.
    function limitsFromWays(pts, ways) {
        const raw = new Array(pts.length).fill(null);
        for (let vi = 0; vi < pts.length; vi++) {
            const p = pts[vi];
            let best = null, bestD = Infinity;
            for (const w of ways) {
                const lim = resolveLimit ? resolveLimit(w.tags) : null;
                if (lim == null) continue;                 // not a drivable, limit-bearing way → ignore
                const d = distToWay(p, w.geometry);
                if (d < bestD && d <= CORRIDOR_M + 10) { bestD = d; best = lim; }
            }
            raw[vi] = best;
        }
        return carryForward(raw);
    }
    function carryForward(raw) {
        const out = raw.slice();
        let last = null;
        for (let i = 0; i < out.length; i++) {
            if (out[i] == null) out[i] = last; else last = out[i];
        }
        return out;
    }

    // Change points = vertices where the carry-forward limit first differs from the previous one.
    function deriveChangePoints(pts, limits) {
        const cps = [];
        let prev = undefined;
        for (let i = 0; i < pts.length; i++) {
            const v = limits[i];
            if (v != null && v !== prev) { cps.push({ lat: pts[i][0], lng: pts[i][1], limit: v }); prev = v; }
        }
        return cps;
    }

    // Rebuild the per-vertex array from cached change points by walking the route and switching the
    // limit each time we pass a change point (projected onto the current geometry). Lets a cached
    // profile align to a freshly-fetched route whose start jittered slightly.
    function limitsFromChangePoints(pts, cps) {
        if (!cps.length) return new Array(pts.length).fill(null);
        // along-route distance of each change point (nearest projection), and of each vertex.
        const cpIdx = cps.map((c) => nearestIdxOn(pts, [c.lat, c.lng]));
        const out = new Array(pts.length).fill(null);
        for (let i = 0; i < pts.length; i++) {
            let lim = null;
            for (let c = 0; c < cps.length; c++) { if (cpIdx[c] <= i) lim = cps[c].limit; else break; }
            out[i] = lim;
        }
        return carryForward(out);
    }
    function nearestIdxOn(pts, here) {
        const k = Math.cos(here[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const p = xy(here);
        let bi = 0, bd = Infinity;
        for (let i = 0; i < pts.length; i++) {
            const a = xy(pts[i]);
            const d = Math.hypot(p[0] - a[0], p[1] - a[1]);
            if (d < bd) { bd = d; bi = i; }
        }
        return bi;
    }

    // ---- markers ---------------------------------------------------------------------------------
    function badgeHtml(limit) {
        const txt = (limit === 'none') ? '∞' : String(limit);
        const small = txt.length >= 3 ? ' sp-badge-s3' : '';
        return '<div class="sp-badge' + small + '">' + txt + '</div>';
    }
    function drawMarkers(cps) {
        clearMarkers();
        markers = L.layerGroup();
        for (const c of cps) {
            const icon = L.divIcon({ className: 'sp-badge-wrap', html: badgeHtml(c.limit), iconSize: [26, 26], iconAnchor: [13, 13] });
            L.marker([c.lat, c.lng], { icon, interactive: false, keyboard: false, pane: 'markerPane' }).addTo(markers);
        }
        markers.addTo(map);
    }
    function clearMarkers() { if (markers) { map.removeLayer(markers); markers = null; } }

    // ---- public: build / clear -------------------------------------------------------------------
    // meta = { mode, start:[lat,lng], dest:[lat,lng] }. Fire-and-forget from nav after drawRoute().
    async function build(pts, meta) {
        const gen = ++buildGen;
        if (!pts || pts.length < 2 || !resolveLimit) { clear(); return; }
        routePts = pts.slice();

        // 1) cache hit → align cached change points to this geometry, no Overpass.
        const cached = cacheGet(meta);
        if (cached) {
            vertexLimit = limitsFromChangePoints(routePts, cached);
            changePoints = cached;
            drawMarkers(changePoints);
            dbg('Profil aus Cache: ' + changePoints.length + ' Umschaltpunkte');
            return;
        }

        // 2) miss → ONE corridor query for the whole route. Downsample the around-polyline if very long.
        const corridorPts = downsample(routePts, MAX_CORRIDOR_PTS);
        let coords = '';
        for (const p of corridorPts) coords += ',' + p[0] + ',' + p[1];
        const q = '[out:json][timeout:25];way(around:' + CORRIDOR_M + coords + ')[highway];out tags geom;';
        const j = await overpass(q);
        if (gen !== buildGen) return;                 // a newer route superseded us → drop this answer
        if (!j || !j.elements) { dbg('Overpass-Korridor fehlgeschlagen → Live-Schild bleibt aktiv'); return; }
        const ways = j.elements.filter((e) => e.tags && e.geometry);

        // Resolve per-vertex (downsample the resolution set for very long routes to bound cost).
        const resAt = downsampleIdx(routePts.length, MAX_VERTS);
        const sub = resAt.map((i) => routePts[i]);
        const subLimits = limitsFromWays(sub, ways);
        // expand the sub-sampled limits back onto every vertex (carry the nearest sample forward).
        vertexLimit = expandToAll(routePts.length, resAt, subLimits);
        changePoints = deriveChangePoints(routePts, vertexLimit);
        if (gen !== buildGen) return;
        cachePut(meta, changePoints);
        drawMarkers(changePoints);
        dbg('Profil berechnet: ' + changePoints.length + ' Umschaltpunkte (' + ways.length + ' Wege)');
    }

    function clear() { buildGen++; routePts = null; vertexLimit = null; changePoints = []; clearMarkers(); }

    // ---- small array utilities -------------------------------------------------------------------
    function downsample(arr, maxN) {
        if (arr.length <= maxN) return arr;
        const step = arr.length / maxN, out = [];
        for (let i = 0; i < arr.length; i += step) out.push(arr[Math.floor(i)]);
        if (out[out.length - 1] !== arr[arr.length - 1]) out.push(arr[arr.length - 1]);
        return out;
    }
    function downsampleIdx(n, maxN) {
        if (n <= maxN) { const a = []; for (let i = 0; i < n; i++) a.push(i); return a; }
        const step = n / maxN, out = [];
        for (let i = 0; i < n; i += step) out.push(Math.floor(i));
        if (out[out.length - 1] !== n - 1) out.push(n - 1);
        return out;
    }
    // Map limits sampled at indices `idx` back onto all n vertices (carry the last sample forward).
    function expandToAll(n, idx, sampled) {
        const out = new Array(n).fill(null);
        for (let s = 0; s < idx.length; s++) {
            const from = idx[s], to = (s + 1 < idx.length) ? idx[s + 1] : n;
            for (let i = from; i < to; i++) out[i] = sampled[s];
        }
        return carryForward(out);
    }

    return { build, clear, limitAt, hasRoute, setResolver };
};
