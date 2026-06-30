// js/tracker-hazards.js — point-hazard pins + "voraus"-warning for the tracker (Doc 2026-06-30).
//
// Surfaces OSM POINT hazards on the road from a single node query (CLAUDE.md rule 7 — one fetch, many
// types) via the shared overpass client (proxy + direct-mirror fallback, key-less, rule 18):
//   • railway=level_crossing  → 🚂 Bahnübergang   (warns ahead — safety-critical, rare)
//   • highway=stop            → 🛑 Stopp          (warns ahead)
//   • highway=give_way        → 🔻 Vorfahrt achten (pin only — too common in town to chime each one)
//   • highway=crossing (zebra)→ 🚸 Zebrastreifen   (pin only)
// All four are drawn as map pins; the two "warn" types fire a one-shot toast when one lies AHEAD within
// WARN_M of travel. Best-effort and position-driven (fed from onPosition, like the speed sign); silent on
// failure. Warning set is deliberately conservative to avoid carpet-bombing toasts — give-way/zebra are
// visible as pins but don't chime. Default ON; toggle via setOn().
window.TrackerHazards = function (ctx) {
    const { map } = ctx;
    const toast = (typeof ctx.toast === 'function') ? ctx.toast : function () {};

    const KEY_ON = 'trk_hazards_on';
    let on = localStorage.getItem(KEY_ON) !== '0';   // default ON

    const QUERY_R_M = 900;          // fetch hazards within this radius of the position
    const MIN_INTERVAL_MS = 8000;   // …re-query no more often than this
    const MIN_MOVE_M = 200;         // …and only after this much travel
    const QUERY_TIMEOUT_MS = 12000;
    const WARN_M = 260;             // warn when a "warn" hazard lies ahead within this
    const WARN_MIN_M = 25;          // …but not once essentially on top of / past it
    const AHEAD_TOL = 55;           // hazard bearing must be within this of travel direction (i.e. ahead)
    const WARN_REPEAT_MS = 90000;   // never re-warn the SAME hazard within this

    // Clean inline SVG sign faces (crisper than emoji at pin size; brand red rgb(176,36,24), dark blue
    // rgb(14,36,78) instead of black). Sized 28 px; the pin adds a drop-shadow for contrast on the map.
    // Bahnübergang = a Schranke (post + red/white boom); STOP = red octagon; Vorfahrt = inverted triangle;
    // Zebra = blue Fußgängerüberweg plate with white stripes.
    const SVG_SCHRANKE =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Bahnübergang">'
        + '<rect x="2.5" y="2.5" width="35" height="35" rx="7" fill="#fff" stroke="rgb(176,36,24)" stroke-width="2.5"/>'
        + '<rect x="8" y="13" width="4" height="18" rx="1" fill="rgb(14,36,78)"/>'
        + '<rect x="10" y="13" width="25" height="6" rx="1.5" fill="#fff" stroke="rgb(14,36,78)" stroke-width="0.8"/>'
        + '<rect x="12" y="13" width="5" height="6" fill="rgb(176,36,24)"/>'
        + '<rect x="22" y="13" width="5" height="6" fill="rgb(176,36,24)"/>'
        + '<rect x="32" y="13" width="3" height="6" fill="rgb(176,36,24)"/></svg>';
    const SVG_STOP =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Stopp">'
        + '<polygon points="13,2.5 27,2.5 37.5,13 37.5,27 27,37.5 13,37.5 2.5,27 2.5,13" fill="rgb(176,36,24)" stroke="#fff" stroke-width="2"/>'
        + '<text x="20" y="20.5" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="10">STOP</text></svg>';
    const SVG_YIELD =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Vorfahrt achten">'
        + '<polygon points="3,6.5 37,6.5 20,36" fill="#fff" stroke="rgb(176,36,24)" stroke-width="4.5" stroke-linejoin="round"/></svg>';
    const SVG_ZEBRA =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Zebrastreifen">'
        + '<rect x="3" y="3" width="34" height="34" rx="6" fill="rgb(14,36,78)"/>'
        + '<rect x="10" y="9" width="4" height="22" rx="1" fill="#fff"/>'
        + '<rect x="18" y="9" width="4" height="22" rx="1" fill="#fff"/>'
        + '<rect x="26" y="9" width="4" height="22" rx="1" fill="#fff"/></svg>';

    // type → label / sign svg / whether it fires a toast (vs pin-only)
    const TYPES = {
        level_crossing: { label: 'Bahnübergang',    svg: SVG_SCHRANKE, warn: true },
        stop:           { label: 'Stopp',            svg: SVG_STOP,     warn: true },
        give_way:       { label: 'Vorfahrt achten',  svg: SVG_YIELD,    warn: false },
        zebra:          { label: 'Zebrastreifen',    svg: SVG_ZEBRA,    warn: false },
    };

    let layer = null, lastQ = 0, lastQPos = null, fetching = false;
    let lastUpdPos = null;          // for the travel-bearing baseline
    let nodes = [];                 // [{ id, lat, lng, type }]
    const warned = {};              // node id -> last warn timestamp

    function dbg(m) { try { if (window.DebugWindow) DebugWindow.log('⚠️ ' + m); } catch (e) { } }
    function ensureLayer() { if (!layer) layer = L.layerGroup().addTo(map); return layer; }

    function haversine(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }
    function bearingDeg(a, b) {
        const t = Math.PI / 180, la1 = a[0] * t, la2 = b[0] * t, dLon = (b[1] - a[1]) * t;
        const y = Math.sin(dLon) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    // True when the bearing to the hazard is within tol of the travel direction (i.e. genuinely AHEAD,
    // not behind) — DIRECTIONAL, unlike the speed sign's road-alignment (which is mod 180).
    function ahead(travel, brgTo, tol) {
        const d = Math.abs(((brgTo - travel + 540) % 360) - 180);
        return d <= tol;
    }

    // OSM node tags → our hazard type, or null if it isn't one we surface.
    function classify(tags) {
        if (!tags) return null;
        if (tags.railway === 'level_crossing') return 'level_crossing';
        if (tags.highway === 'stop') return 'stop';
        if (tags.highway === 'give_way') return 'give_way';
        // ONLY a real Zebrastreifen (Zeichen 293): crossing_ref / crossing:markings / crossing = zebra.
        // NOT the generic 'marked'/'uncontrolled' crossings — those are every minor pedestrian crossing (a
        // whole parking lot full near Elbepark, Doc 2026-06-30) and carpet-bombed the map.
        if (tags.highway === 'crossing') {
            const z = (tags.crossing_ref || '') + '|' + (tags['crossing:markings'] || '') + '|' + (tags.crossing || '');
            if (/\bzebra\b/i.test(z)) return 'zebra';
        }
        return null;
    }

    function pin(type) {
        return L.divIcon({
            className: 'hazard-pin-wrap',
            html: '<div style="filter:drop-shadow(0 1px 2px rgba(8,20,42,0.55))">' + TYPES[type].svg + '</div>',
            iconSize: [28, 28], iconAnchor: [14, 14],
        });
    }
    function drawPins() {
        const lyr = ensureLayer();
        lyr.clearLayers();
        for (const n of nodes) {
            L.marker([n.lat, n.lng], { icon: pin(n.type), interactive: false, keyboard: false, pane: 'markerPane' })
                .bindTooltip(TYPES[n.type].label, { direction: 'top', opacity: 0.9 })
                .addTo(lyr);
        }
    }
    function clearPins() { if (layer) layer.clearLayers(); }

    async function query(here) {
        fetching = true;
        const r = QUERY_R_M, la = here[0], ln = here[1];
        // one combined node query — crossings are narrowed to REAL zebra markings server-side so we never
        // pull (or pin) the parking-lot full of generic 'marked'/'uncontrolled' crossings.
        const q = '[out:json][timeout:8];('
            + 'node(around:' + r + ',' + la + ',' + ln + ')[railway=level_crossing];'
            + 'node(around:' + r + ',' + la + ',' + ln + ')[highway=stop];'
            + 'node(around:' + r + ',' + la + ',' + ln + ')[highway=give_way];'
            + 'node(around:' + r + ',' + la + ',' + ln + ')[highway=crossing][crossing_ref=zebra];'
            + 'node(around:' + r + ',' + la + ',' + ln + ')[highway=crossing]["crossing:markings"=zebra];'
            + 'node(around:' + r + ',' + la + ',' + ln + ')[highway=crossing][crossing=zebra];'
            + ');out;';
        try {
            const j = await window.queryOverpass(q, { timeout: QUERY_TIMEOUT_MS, dbg });
            if (!j || !Array.isArray(j.elements)) { dbg('Hazards: keine Antwort → behalte'); return; }
            const next = [];
            for (const e of j.elements) {
                const type = classify(e.tags);
                if (!type || e.lat == null || e.lon == null) continue;
                next.push({ id: (e.type || 'n') + '/' + e.id, lat: e.lat, lng: e.lon, type });
            }
            nodes = next;
            drawPins();
            dbg('Hazards: ' + nodes.length + ' im Umkreis ' + r + ' m');
        } catch (e) { /* keep last set */ }
        finally { fetching = false; }
    }

    // Called on every GPS fix (throttled inside). here=[lat,lng]; speedKmh for a reliable travel bearing.
    function update(here, speedKmh) {
        if (!on || !here) return;
        const now = Date.now();
        // re-query on throttle + movement
        if (!fetching && now - lastQ > MIN_INTERVAL_MS && (!lastQPos || haversine(here, lastQPos) > MIN_MOVE_M)) {
            lastQ = now; lastQPos = here; query(here);
        }
        // travel bearing over the leg since the last fix (only trust it when actually moving)
        let travelBrg = null;
        if (lastUpdPos && speedKmh != null && speedKmh >= 10 && haversine(here, lastUpdPos) >= 8) {
            travelBrg = bearingDeg(lastUpdPos, here);
        }
        lastUpdPos = here;
        if (travelBrg == null) return;
        // nearest "warn" hazard ahead within the window
        let best = null, bestD = Infinity;
        for (const n of nodes) {
            if (!TYPES[n.type].warn) continue;
            const d = haversine(here, [n.lat, n.lng]);
            if (d > WARN_M || d < WARN_MIN_M) continue;
            if (!ahead(travelBrg, bearingDeg(here, [n.lat, n.lng]), AHEAD_TOL)) continue;
            if (d < bestD) { bestD = d; best = n; }
        }
        if (best && now - (warned[best.id] || 0) > WARN_REPEAT_MS) {
            warned[best.id] = now;
            const msg = '⚠ ' + TYPES[best.type].label + ' in ' + (Math.round(bestD / 10) * 10) + ' m';
            toast(msg); dbg(msg);
        }
    }

    function setOn(v) { on = !!v; try { localStorage.setItem(KEY_ON, on ? '1' : '0'); } catch (e) { } if (!on) clearPins(); }
    function enabled() { return on; }
    function destroy() { clearPins(); if (layer) { map.removeLayer(layer); layer = null; } }

    return { update, setOn, enabled, destroy };
};
