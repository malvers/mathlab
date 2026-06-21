// js/tracker-traffic.js — Verkehrs-Spur: live German-Autobahn closures / roadworks / warnings on the map.
// While you drive an Autobahn, nearby Sperrungen (red), Baustellen + Warnungen (λ orange) show up as
// pins; tapping one routes you there. If a closure lies ON your active navigation route you get a one-off
// toast + spoken warning. Data: the Autobahn GmbH open API (verkehr.autobahn.de) — KEYLESS, CORS '*',
// fetched straight from the browser (no Edge function, no secret; fits CLAUDE.md rule 18 like Nominatim/OSRM).
// Germany + Autobahn only; Spain/city/flow-heatmap is Phase 2 (TomTom via an Edge proxy).
//
// Which Autobahn? We reuse the speed-limit module's Overpass road detection (speed.currentRoad().ref) so
// we only query the A-road you're actually on — no spatial "near me" endpoint exists, it's per-ref.
//
// ctx (from tracker.js): { map, toast, speed, nav, voice }
window.TrackerTraffic = function (ctx) {
    const { map, toast, speed, nav, voice, apiUrl, apiKey } = ctx;

    const AB_BASE = 'https://verkehr.autobahn.de/o/autobahn/';
    const SERVICES = ['closure', 'roadworks', 'warning'];
    const REFRESH_MS = 180000;     // re-poll at most every 3 min …
    const REFRESH_MOVE_M = 3000;   // … or once we've moved 3 km (Autobahn scale)
    const FETCH_TIMEOUT_MS = 9000; // per-request abort
    const MAX_NEAR_M = 30000;      // only show items within 30 km of the current position
    const ROUTE_HIT_M = 200;       // a closure this close to the nav route counts as "on your route"

    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('traffic: ' + m); };

    // Inline Lucide-style glyphs (keyless, no emoji) — stroke uses currentColor (set per kind via CSS).
    const ICONS = {
        sperrung: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',
        baustelle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="m8 6 8 8"/></svg>',
        warnung: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    };

    let layer = null;
    let items = [];
    let lastLat = null, lastLng = null, lastFetch = 0;
    let busy = false;
    let failUntil = 0, failStreak = 0;     // post-failure backoff (mirrors tracker-fuel.js)
    let attribution = '';                  // '© TomTom' while showing TomTom data (Phase 2), else ''
    let lastHere = null;                    // last position seen (even while disabled) → toggle-on can fetch at once
    const announced = new Set();           // closure identifiers already spoken/toasted (no spam)
    let enabled = localStorage.getItem('trk-traffic-on') === '1'; // default OFF (heavier overlay, like REGEN)

    function ensureLayer() {
        if (!layer) {
            // z 615: above the fuel symbol (610), below the fuel price badge (620).
            if (!map.getPane('traffic')) map.createPane('traffic').style.zIndex = 615;
            layer = L.layerGroup().addTo(map);
        }
        return layer;
    }

    // metres between two lat/lng points (haversine)
    function distM(aLat, aLng, bLat, bLng) {
        const R = 6371000, toRad = Math.PI / 180;
        const dLat = (bLat - aLat) * toRad, dLng = (bLng - aLng) * toRad;
        const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(aLat * toRad) * Math.cos(bLat * toRad) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(s));
    }

    // Point→segment distance (m) via a cheap equirectangular projection — good enough at road scale.
    function segDistM(p, a, b) {
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const P = xy(p), A = xy(a), B = xy(b);
        const dx = B[0] - A[0], dy = B[1] - A[1], len2 = dx * dx + dy * dy;
        let t = len2 ? ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / len2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        return Math.hypot(P[0] - (A[0] + t * dx), P[1] - (A[1] + t * dy));
    }
    // min distance from a point to a polyline [[lat,lng]…]
    function distToLine(p, line) {
        if (!line || line.length < 2) return Infinity;
        let best = Infinity;
        for (let i = 1; i < line.length; i++) best = Math.min(best, segDistM(p, line[i - 1], line[i]));
        return best;
    }

    // Which Autobahn ref(s) are we on? From the speed-limit module's Overpass road detection. OSM `ref`
    // OSM `ref` ("A4" / "A 4" / "A4;A38") → normalised Autobahn refs ["A4", …] (what the API uses).
    function aRefs(ref) {
        const out = new Set();
        if (ref) String(ref).split(/[;,]/).forEach((r) => { const m = String(r).trim().match(/^A\s?(\d+)/i); if (m) out.add('A' + m[1]); });
        return [...out];
    }
    const OVERPASS_MIRRORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
    const DETECT_RADIUS_M = 15000;  // find every Autobahn within ~15 km → show the incidents AROUND you (POI-like),
    const MAX_REFS = 8;             // not just the road under your wheels. Cap the ref count to bound API load.
    // Own Autobahn detection: motorway/trunk ways carrying a `ref` within DETECT_RADIUS_M. Independent of the
    // speed-limit module (which only runs while recording) → traffic shows AMBIENTLY, like POIs, even when idle.
    async function overpassRefs(here) {
        const q = '[out:json][timeout:25];way(around:' + DETECT_RADIUS_M + ',' + here[0] + ',' + here[1] + ')[highway~"^(motorway|trunk)(_link)?$"][ref];out tags 150;';
        let gotOk = false;                                  // did ANY mirror answer cleanly (200 + JSON)?
        for (const url of OVERPASS_MIRRORS) {
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), 13000);   // don't let a slow mirror wedge the fetch (busy stays true)
            try {
                const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(q), signal: ctrl.signal });
                if (!r.ok) continue;
                const j = await r.json();
                gotOk = true;
                const out = new Set();
                for (const e of (j.elements || [])) aRefs(e.tags && e.tags.ref).forEach((x) => out.add(x));
                if (out.size) return [...out].slice(0, MAX_REFS);  // empty 200 → try the other mirror, then trust it as empty
            } catch (e) { /* try next mirror */ }
            finally { clearTimeout(to); }
        }
        return gotOk ? [] : null;   // [] = genuinely no Autobahn within reach · null = every mirror failed (don't wipe pins)
    }
    // Which Autobahn(s) to show? The road you're on (speed module, free while recording) PLUS every Autobahn
    // within ~15 km (Overpass) — so incidents appear around you like POIs, not only on the road you're driving.
    async function resolveRefs(here) {
        const road = speed && speed.currentRoad && speed.currentRoad();
        const fromSpeed = aRefs(road && road.ref);
        const area = await overpassRefs(here);              // [] = no Autobahn nearby · null = Overpass unreachable
        if (area === null) return fromSpeed.length ? fromSpeed : null;  // hard fail → signal it (don't clear pins on a blip)
        return [...new Set([...fromSpeed, ...area])].slice(0, MAX_REFS);
    }

    // "lat,lng" string or {lat,long} object or geometry[0] → [lat, lng] anchor for the pin.
    function anchorOf(it) {
        if (it.coordinate && typeof it.coordinate.lat === 'number') return [it.coordinate.lat, it.coordinate.long];
        if (typeof it.point === 'string') {
            const p = it.point.split(',').map(Number);
            if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) return [p[0], p[1]];
        }
        const g = it.geometry && it.geometry.coordinates;
        if (Array.isArray(g) && g.length && Array.isArray(g[0])) return [g[0][1], g[0][0]]; // GeoJSON [long,lat]
        return null;
    }
    // geometry → [[lat,lng]…] (GeoJSON stores [long,lat]); falls back to the single anchor.
    function geomLatLng(it, anchor) {
        const g = it.geometry && it.geometry.coordinates;
        if (Array.isArray(g) && g.length && Array.isArray(g[0]) && it.geometry.type === 'LineString') {
            return g.map((c) => [c[1], c[0]]);
        }
        return anchor ? [anchor] : [];
    }

    function kindOf(it, svc) {
        const blocked = it.isBlocked && String(it.isBlocked) !== 'false';
        if (svc === 'closure' || blocked || /CLOSURE/i.test(it.display_type || '')) return 'sperrung';
        if (svc === 'roadworks') return 'baustelle';
        return 'warnung';
    }

    // ---- Phase 2: TomTom (abroad). Same pin model, fetched via the tomtom-traffic Edge proxy (key
    //      server-side). Only used OUTSIDE Germany (the Autobahn API is DE-only); fails gracefully and
    //      shows nothing until that function is deployed (blocked by the current Supabase 402). ----
    function inGermany(p) { return p[0] >= 47.2 && p[0] <= 55.1 && p[1] >= 5.8 && p[1] <= 15.1; }
    // TomTom iconCategory → our kind: 8 = road closed, 9 = roadworks, else jam/generic warning.
    function tomtomKind(cat) { return cat === 8 ? 'sperrung' : cat === 9 ? 'baustelle' : 'warnung'; }
    function tomtomItems(incidents) {
        const out = [];
        for (const f of incidents || []) {
            const pr = f.properties || {}, g = f.geometry || {};
            let line = [];
            if (Array.isArray(g.coordinates)) {
                if (g.type === 'LineString') line = g.coordinates.map((c) => [c[1], c[0]]);
                else if (g.type === 'Point') line = [[g.coordinates[1], g.coordinates[0]]];
            }
            const anchor = line.length ? line[Math.floor(line.length / 2)] : null;
            if (!anchor || isNaN(anchor[0]) || isNaN(anchor[1])) continue;
            const ev = (pr.events && pr.events[0]) || {};
            const road = Array.isArray(pr.roadNumbers) ? pr.roadNumbers.join(', ') : '';
            out.push({
                id: 'tt|' + anchor[0].toFixed(4) + ',' + anchor[1].toFixed(4) + '|' + (pr.iconCategory || 0),
                anchor, kind: tomtomKind(pr.iconCategory), future: false,
                title: (road ? road + ' · ' : '') + (ev.description || 'Verkehr'),
                subtitle: [pr.from, pr.to].filter(Boolean).join(' → '),
                description: pr.delay ? ['Verzögerung ca. ' + Math.round(pr.delay / 60) + ' min'] : [],
                geom: line.length ? line : [anchor],
            });
        }
        return out;
    }

    function pinIcon(kind, future) {
        const cls = 'trf-pin trf-' + kind + (future ? ' trf-future' : '');
        return L.divIcon({
            className: 'trf-pin-wrap',
            html: '<div class="' + cls + '">' + (ICONS[kind] || ICONS.warnung) + '</div>',
            iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
        });
    }

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

    function popupHtml(o) {
        const desc = Array.isArray(o.description) ? o.description.filter(Boolean).join('<br>') : '';
        const LABEL = { sperrung: 'Sperrung', baustelle: 'Baustelle', warnung: 'Warnung' };
        return '<div class="trf-popup trf-' + o.kind + '">' +
            '<div class="trf-kind">' + LABEL[o.kind] + (o.future ? ' · geplant' : '') + '</div>' +
            '<div class="trf-title">' + esc(o.title) + '</div>' +
            (o.subtitle ? '<div class="trf-sub">' + esc(o.subtitle.trim()) + '</div>' : '') +
            (desc ? '<div class="trf-desc">' + desc + '</div>' : '') +
            '</div>';   // no "Hinfahren" — you don't route yourself INTO a closure/jam (Doc)
    }

    function render() {
        const lyr = ensureLayer();
        lyr.clearLayers();
        if (map.attributionControl) {                 // show "© TomTom" only while TomTom data is on screen
            map.attributionControl.removeAttribution('© TomTom');
            if (enabled && attribution) map.attributionControl.addAttribution(attribution);
        }
        if (!enabled) return;
        for (const o of items) {
            if (!o.anchor) continue;
            // proximity cull for PINS only — the full fetched set stays in `items` for the route-closure scan
            if (lastLat != null && distM(lastLat, lastLng, o.anchor[0], o.anchor[1]) > MAX_NEAR_M) continue;
            L.marker(o.anchor, { icon: pinIcon(o.kind, o.future), pane: 'traffic', keyboard: false })
                .bindPopup(popupHtml(o), { className: 'trf-popup-card trf-' + o.kind }).addTo(lyr);
        }
    }

    // One-off heads-up when an ACTIVE closure sits on the live nav route.
    function checkRouteClosures() {
        const route = nav && nav.routePoints && nav.routePoints();
        if (!route || route.length < 2) return;
        for (const o of items) {
            if (o.kind !== 'sperrung' || o.future || announced.has(o.id)) continue;
            const onRoute = o.geom.some((p) => distToLine(p, route) <= ROUTE_HIT_M);
            if (!onRoute) continue;
            announced.add(o.id);
            const t = o.title || 'Sperrung';
            if (toast) toast('⚠ Sperrung auf Deiner Route: ' + t);
            if (voice && voice.speak) { try { voice.speak('Achtung, Sperrung voraus: ' + t); } catch (e) { /* ignore */ } }
        }
    }

    async function fetchSvc(ref, svc) {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
        try {
            const r = await fetch(AB_BASE + encodeURIComponent(ref) + '/services/' + svc, { signal: ctrl.signal });
            if (!r.ok) return null;
            return await r.json();
        } catch (e) { return null; }
        finally { clearTimeout(to); }
    }

    async function fetchTraffic(here) {
        let ok = false;
        try {
            busy = true;                            // inside try → a throw (e.g. bad `here`) still hits finally, never wedges busy
            lastLat = here[0]; lastLng = here[1];   // set NOW so render()'s proximity cull uses the CURRENT position (not the stale one)
            const refs = await resolveRefs(here);   // [] = no Autobahn nearby · null = Overpass unreachable · else the refs
            if (refs === null) { dbg('ref-lookup failed (Overpass) — Pins bleiben, Backoff'); return; } // soft fail: keep pins (ok=false → backoff)
            if (!refs.length) { items = []; attribution = ''; render(); ok = true; return; } // genuinely not on/near an Autobahn → clear
            const raw = [];
            const perRef = await Promise.allSettled(   // all refs × services in parallel (was sequential → up to ~72 s worst case)
                refs.map((ref) => Promise.allSettled(SERVICES.map((svc) => fetchSvc(ref, svc))))
            );
            for (const rr of perRef) {
                if (rr.status !== 'fulfilled') continue;
                rr.value.forEach((r, i) => {
                    if (r.status === 'fulfilled' && r.value) {
                        const svc = SERVICES[i];
                        (r.value[svc] || []).forEach((it) => raw.push({ it, svc }));
                    }
                });
            }
            const seen = new Set(), out = [];
            let dropped = 0;
            for (const { it, svc } of raw) {
                const id = it.identifier || (it.title + '|' + (it.point || ''));
                if (seen.has(id)) continue;
                seen.add(id);
                const anchor = anchorOf(it);
                if (!anchor || isNaN(anchor[0]) || isNaN(anchor[1])) { dropped++; continue; } // no/NaN anchor → can't place; logged below
                out.push({
                    id, anchor, kind: kindOf(it, svc), future: !!it.future,
                    title: it.title, subtitle: it.subtitle, description: it.description,
                    geom: geomLatLng(it, anchor),
                });
            }
            // Keep ALL of this A-road's items so the route-closure scan sees closures the whole route ahead
            // (render() culls pins to MAX_NEAR_M). Clear any leftover credit — this is keyless Autobahn data.
            items = out; attribution = '';
            dbg('refs ' + refs.join(',') + ' → ' + items.length + ' Items' + (dropped ? ' (' + dropped + ' ohne Anker verworfen)' : ''));
            render();
            checkRouteClosures();
            ok = true;
        } catch (e) {
            dbg('ERR ' + (e && (e.message || e)));
        } finally {
            busy = false;
            lastFetch = Date.now(); // advance throttle (also on no-refs / fail; position already set up top before render)
            // back off after a failure so a hiccup isn't retried on every GPS fix (mirrors tracker-fuel.js)
            if (ok) { failStreak = 0; failUntil = 0; }
            else { failStreak++; failUntil = Date.now() + Math.min(REFRESH_MS, 5000 * Math.pow(2, failStreak - 1)); }
        }
    }

    // Phase 2 sibling of fetchTraffic: query the TomTom proxy for the current map bbox (abroad).
    async function fetchTomTom(here) {
        if (!apiUrl) return;
        let ok = false;
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
        try {
            busy = true;                            // inside try → pairs with the finally that clears it (no wedge)
            // Clamp to a driving-scale window (~±33 km) around the position, NOT the whole viewport — keeps
            // it under TomTom's bbox area cap (silent 400 when zoomed out) and matches the proximity cull.
            const dLat = 0.30, dLng = 0.30 / Math.max(0.2, Math.cos(here[0] * Math.PI / 180));
            const bbox = { minLon: here[1] - dLng, minLat: here[0] - dLat, maxLon: here[1] + dLng, maxLat: here[0] + dLat };
            const r = await fetch(apiUrl + '/functions/v1/tomtom-traffic', {
                method: 'POST', signal: ctrl.signal,
                headers: { 'Content-Type': 'application/json', 'apikey': apiKey, 'Authorization': 'Bearer ' + apiKey },
                body: JSON.stringify({ bbox }),
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok || !d.ok) { dbg('TomTom ERR ' + (d.error || r.status)); return; }
            items = tomtomItems(d.incidents);
            attribution = '© TomTom';
            lastLat = here[0]; lastLng = here[1];
            dbg('TomTom → ' + items.length + ' Items');
            render();
            checkRouteClosures();
            ok = true;
        } catch (e) {
            dbg('TomTom ERR ' + (e && (e.message || e)));
        } finally {
            clearTimeout(to);
            busy = false;
            lastFetch = Date.now();   // advance throttle on every path (mirrors fetchTraffic — the abroad path was missing this)
            if (ok) { failStreak = 0; failUntil = 0; }
            else { failStreak++; failUntil = Date.now() + Math.min(REFRESH_MS, 5000 * Math.pow(2, failStreak - 1)); }
        }
    }

    // Called from the position handler on every GPS fix; re-polls only on enough move/time, gated by backoff.
    function update(here) {
        try {
            if (!here) return;
            const lat = here[0], lng = here[1];
            if (typeof lat !== 'number' || typeof lng !== 'number') return;
            lastHere = [lat, lng];                               // remember position even while disabled (toggle-on uses it)
            if (!enabled || busy) return;
            if (Date.now() < failUntil) return;
            const moved = (lastLat == null) ? Infinity : distM(lastLat, lastLng, lat, lng);
            if (moved < REFRESH_MOVE_M && (Date.now() - lastFetch) < REFRESH_MS) return;   // move/time throttle
            if (inGermany([lat, lng])) fetchTraffic([lat, lng]);  // Phase 1: keyless Autobahn GmbH API (resolves refs itself)
            else if (apiUrl) fetchTomTom([lat, lng]);             // Phase 2: TomTom proxy (graceful if not deployed)
        } catch (e) { dbg('update ERR ' + (e && (e.message || e))); } // never let a throw reach onPosition
    }

    function setEnabled(on) {
        enabled = !!on; localStorage.setItem('trk-traffic-on', enabled ? '1' : '0');
        failUntil = 0; failStreak = 0;              // a manual toggle clears any stale backoff window (consistent on/off)
        if (!enabled) {
            if (layer) layer.clearLayers();
            attribution = ''; if (map.attributionControl) map.attributionControl.removeAttribution('© TomTom');
            return;
        }
        // Turned on → fetch right away from the last known position so even a static fix shows pins at once.
        lastFetch = 0;
        if (lastHere && !busy) { if (inGermany(lastHere)) fetchTraffic(lastHere); else if (apiUrl) fetchTomTom(lastHere); }
    }
    function clear() {
        if (layer) layer.clearLayers();
        items = []; lastLat = lastLng = null; lastHere = null; lastFetch = 0; busy = false; announced.clear();
        failUntil = 0; failStreak = 0;
        attribution = ''; if (map.attributionControl) map.attributionControl.removeAttribution('© TomTom');
    }

    return {
        update, setEnabled, clear,
        get enabled() { return enabled; },
    };
};
