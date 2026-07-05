// js/tracker-hazards.js — point-hazard pins + "voraus"-warning for the tracker (Doc 2026-06-30).
//
// Surfaces OSM POINT hazards on the road from a single node query (CLAUDE.md rule 7 — one fetch, many
// types) via the shared overpass client (proxy + direct-mirror fallback, key-less, rule 18):
//   • railway=level_crossing  → 🚂 Bahnübergang   (warns ahead — safety-critical, rare)
//   • highway=stop            → 🛑 Stopp          (warns ahead)
//   • highway=give_way        → 🔻 Vorfahrt achten (pin only — too common in town to chime each one)
//   • highway=traffic_signals → 🚦 Ampel           (pin only — as common as give_way in town; OSM knows the
//                                                    POSITION only, never the live red/green state)
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
    const nav = (typeof ctx.nav === 'function') ? ctx.nav : () => null;   // nav module handle (route relevance)
    const ROUTE_HAZARD_M = 7;       // while navigating, only pins THIS close to the route line count as "on my
    //                                 road" — a cross-street stop/give-way sits farther off and is dropped (Doc 2026-07-01)
    // …but a side-street give_way/stop sits AT the junction (~0 m from the route) yet governs cross-traffic,
    // not me (Doc 2026-07-05). So a right-of-way sign additionally has to sit on a way that RUNS ALONG the
    // route: we sample its own way this far either side of the node and require both to stay near the route.
    const ALONG_SAMPLE_M = 20;      // sample the sign's own way this far each side of the node
    const ALONG_TOL_M = 14;         // …both samples must stay within this of the route to count as "my road"

    const QUERY_R_M = 900;          // fetch hazards within this radius of the position
    const MIN_INTERVAL_MS = 8000;   // …re-query no more often than this
    const MIN_MOVE_M = 200;         // …and only after this much travel
    const QUERY_TIMEOUT_MS = 12000;
    const WARN_M = 260;             // warn when a "warn" hazard lies ahead within this
    const WARN_MIN_M = 25;          // …but not once essentially on top of / past it
    const AHEAD_TOL = 55;           // hazard bearing must be within this of travel direction (i.e. ahead)
    const WARN_REPEAT_MS = 90000;   // never re-warn the SAME hazard within this

    // Roads-only + "my road" filtering (Doc 2026-07-02). Only DRIVABLE ways count — no service/footway/
    // cycleway/path/track (that's what put the Andreaskreuz-pulk into the Lößnitzgrundbahn rail yard, where
    // only foot/service paths cross the tracks). service is excluded too (parking aisles, driveways).
    const DRIVE_RE = '^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|road|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link)$';
    const COORD_EPS = 1e-6;         // ~0.11 m — a hazard node equals a way vertex byte-for-byte in Overpass out
    const SNAP_MAX_M = 50;          // if even the nearest drivable way is farther than this, I'm not on a road
    //                                 (rail yard / parking) → can't name "my road" → fall back to roads-only.

    // Clean inline SVG sign faces (crisper than emoji at pin size; brand red rgb(176,36,24), dark blue
    // rgb(14,36,78) instead of black). Sized 28 px; the pin adds a drop-shadow for contrast on the map.
    // Bahnübergang = the Andreaskreuz (Zeichen 201): a FREE-STANDING, Y-stretched (taller-than-wide) red-and-
    // white saltire — no plate, no background (Doc). STOP = red octagon; Vorfahrt = inverted triangle;
    // Zebra = the Fußgängerüberweg sign (Zeichen 350): blue square + white triangle + walking figure.
    const SVG_ANDREAS =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Bahnübergang (Andreaskreuz)">'
        // Full-length red bars + a white centre → red tips, white where they cross. A thin dark-blue outline
        // keeps the frameless/transparent X legible on any map background.
        + '<g stroke-linecap="round">'
        + '<line x1="10" y1="4" x2="30" y2="36" stroke="rgb(14,36,78)" stroke-width="7.5"/>'
        + '<line x1="30" y1="4" x2="10" y2="36" stroke="rgb(14,36,78)" stroke-width="7.5"/>'
        + '<line x1="10" y1="4" x2="30" y2="36" stroke="rgb(176,36,24)" stroke-width="5.5"/>'
        + '<line x1="30" y1="4" x2="10" y2="36" stroke="rgb(176,36,24)" stroke-width="5.5"/>'
        + '</g>'
        + '<g stroke-width="5.5">'
        + '<line x1="15.5" y1="13" x2="24.5" y2="27" stroke="#fff"/>'
        + '<line x1="24.5" y1="13" x2="15.5" y2="27" stroke="#fff"/>'
        + '</g></svg>';
    // Stopp (Zeichen 206) + Vorfahrt gewähren (Zeichen 205) — official signs from the shared
    // js/traffic-signs.js (public-domain amtliche Werke, one source of truth, CLAUDE.md rule 7).
    const SVG_STOP = window.SIGN_STOP ? window.SIGN_STOP(28) : '';
    const SVG_YIELD = window.SIGN_VORFAHRT_ACHTEN ? window.SIGN_VORFAHRT_ACHTEN(28) : '';
    // Vorfahrtstraße (Zeichen 306, "Hauptstraße") — the OFFICIAL sign from the shared js/traffic-signs.js
    // (public-domain amtliches Werk, one source of truth, CLAUDE.md rule 7): white square-on-point, black
    // keyline, yellow inner diamond.
    const SVG_PRIORITY = window.SIGN_VORFAHRTSTRASSE ? window.SIGN_VORFAHRTSTRASSE(28) : '';
    // Zebra = the OFFICIAL German Fußgängerüberweg sign (Zeichen 350-10, walking right). German traffic
    // signs are amtliche Werke (§5 UrhG) → public domain; this SVG is from Wikimedia Commons, metadata
    // stripped + scaled to 28px (Doc 2026-07-01, "findest DAS svg?"). Authentic black figure (not the
    // house dark-blue) because it's the real sign; blue #154889.
    const SVG_ZEBRA = '<svg aria-label="Fußgängerüberweg (Zeichen 350)" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 601.00134 601.00159" height="28" width="28" xml:space="preserve" id="svg5392" version="1.1"><defs id="defs5396" /><g transform="matrix(1.3333333,0,0,-1.3333333,0,601.00159)" id="g5400"><g id="g5402"><path id="path5404" style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 27.375,450.376 c -27.059,0.016 -27,-27.004 -27,-27.004 V 27.376 c 0,0 -0.059,-27.023 27,-27 h 396 c 27.234,-0.027 27,27 27,27 v 395.996 c 0,0 0.223,27.094 -27,27.004 z" /><path id="path5406" style="fill:#154889;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 27.375,441.376 c -9.937,0 -18,-8.058 -18,-18 v -396 c 0,-9.949 8.063,-18 18,-18 h 396 c 9.941,0 18,8.051 18,18 v 396 c 0,9.942 -8.059,18 -18,18 z" /><path id="path5408" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 27.375,450.751 C 13.719,450.759 6.805,443.892 3.391,437.048 -0.023,430.204 0,423.368 0,423.368 V 27.376 C 0,27.376 -0.02,20.54 3.391,13.7 6.805,6.857 13.719,-0.011 27.375,0.001 h 396 c 13.742,-0.015 20.66,6.856 24.051,13.699 3.387,6.84 3.324,13.672 3.324,13.676 v 395.996 c 0,0.004 0.059,6.852 -3.332,13.7 -3.391,6.851 -10.309,13.722 -24.043,13.679 z m 0,-0.375 h 396 c 27.223,0.09 27,-27.004 27,-27.004 V 27.376 c 0,0 0.234,-27.027 -27,-27 h -396 c -27.059,-0.023 -27,27 -27,27 v 395.996 c 0,0 -0.059,27.02 27,27.004 z" /><path id="path5410" style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 37.48,71.661 H 413.27 L 225.383,397.095" /><path id="path5412" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 237.309,320.38 c 0,-9.641 -7.829,-17.469 -17.469,-17.469 -9.645,0 -17.461,7.828 -17.461,17.469 0,9.645 7.816,17.461 17.461,17.461 9.64,0 17.469,-7.816 17.469,-17.461 z m 8.734,-51.941 v -50.645 h -34.93 v 41.879 l -22.679,-34.926 c -4.602,-7.078 -14.063,-9.09 -21.137,-4.5 l 42.965,66.184 c 6.566,10.109 20.093,12.984 30.203,6.418 0.742,-0.488 1.453,-1.024 2.144,-1.59 l 29.305,-24.59 c 2.965,-2.488 4.68,-6.168 4.68,-10.031 v -21.387 c 0,-8.437 -6.848,-15.277 -15.278,-15.277 v 35.644 z M 228.57,204.63 187.344,128.689 c -4.602,-8.461 -15.199,-11.61 -23.672,-6.996 l 46.387,85.425 c 0.691,1.27 1.054,2.704 1.054,4.157 v 2.16 h 34.93 v -2.16 c 0,-1.453 0.348,-2.887 1.055,-4.157 l 34.675,-63.867 c 4.59,-8.472 1.454,-19.07 -7.019,-23.683 z m 105.407,-117 -28.204,63.879 h 28.375 L 372.313,87.63 Z m -63.879,0 -8.325,45.817 11.051,-20.375 4.215,2.285 c 10.801,5.871 14.809,19.375 8.938,30.164 l -3.247,5.988 h 4.122 L 308.434,87.63 Z m -63.879,0 4.976,63.879 h 28.371 l 4.989,-63.879 z m -63.891,0 21.57,63.879 h 10.508 l -17.23,-31.746 4.203,-2.285 c 8.152,-4.43 18.207,-3.34 25.215,2.75 l -5.93,-32.598 z m -63.875,0 38.16,63.879 h 28.375 L 116.773,87.63" /></g></g></svg>';
    // Ampel PIN = the traffic-light DEVICE itself (a dark housing with the three real lights) — because this
    // marks an actual traffic light AT this spot. NOT Zeichen 131 (the "Ampel voraus" WARNING sign) — that
    // means something different (a sign ahead of a light), kept as window.SIGN_AMPEL_VORAUS for when we want it.
    const SVG_AMPEL =
        '<svg viewBox="0 0 40 40" width="28" height="28" aria-label="Ampel">'
        + '<rect x="13" y="3" width="14" height="34" rx="3.5" fill="rgb(14,36,78)" stroke="#fff" stroke-width="1.5"/>'
        + '<circle cx="20" cy="10" r="3.6" fill="rgb(176,36,24)"/>'
        + '<circle cx="20" cy="20" r="3.6" fill="rgb(245,194,66)"/>'
        + '<circle cx="20" cy="30" r="3.6" fill="rgb(121,158,49)"/></svg>';

    // type → label / sign svg / whether it fires a toast (vs pin-only)
    const TYPES = {
        level_crossing: { label: 'Bahnübergang',    svg: SVG_ANDREAS,  warn: true },
        stop:           { label: 'Stopp',            svg: SVG_STOP,     warn: true },
        give_way:       { label: 'Vorfahrt achten',  svg: SVG_YIELD,    warn: false },
        priority:       { label: 'Vorfahrtstraße',   svg: SVG_PRIORITY, warn: false },
        traffic_signals:{ label: 'Ampel',            svg: SVG_AMPEL,    warn: false },
        zebra:          { label: 'Zebrastreifen',    svg: SVG_ZEBRA,    warn: false },
    };

    let layer = null, lastQ = 0, lastQPos = null, fetching = false;
    let lastUpdPos = null;          // for the travel-bearing baseline
    let nodes = [];                 // [{ id, lat, lng, type, wayIds[], wayNames[] }]
    let roadWays = [];              // [{ id, name, pts:[[lat,lng]…] }] — drivable ways in range (with geometry)
    let lastDrawWayId;              // id of "my road" at the last pin draw ('nav' while navigating) → redraw on change
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
        // Vorfahrtstraße (Zeichen 306, "Hauptstraße") — the physical priority-road sign, tagged on a node as
        // traffic_sign=DE:306 (also matches a bare "306" or a "DE:306;…" combo). \b306\b so 3060 etc. don't hit.
        if (/\b306\b/.test(tags.traffic_sign || '')) return 'priority';
        if (tags.highway === 'traffic_signals') return 'traffic_signals';
        if (tags.highway === 'crossing') {
            // A SIGNALISED crossing (Fußgänger-/Bettelampel) is an Ampel too — in DE most town traffic lights
            // are tagged this way (highway=crossing + crossing=traffic_signals), NOT as a standalone
            // highway=traffic_signals node, so without this the map showed no Ampel where there clearly is one
            // (Doc 2026-07-01, Radebeul).
            if (/traffic_signals/i.test(tags.crossing || '') || /traffic_signals/i.test(tags['crossing:signals'] || '')) return 'traffic_signals';
            // ONLY a real Zebrastreifen (Zeichen 350): crossing_ref / crossing:markings / crossing = zebra.
            // NOT the generic 'marked'/'uncontrolled' crossings — those are every minor pedestrian crossing and
            // carpet-bombed the map (Doc: Elbepark/IKEA parking).
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
    // Planar point→segment distance in metres (ENU around p; fine at street scale).
    function pointToSegM(p, a, b) {
        const t = Math.PI / 180, mLat = 111320, mLon = 111320 * Math.cos(p[0] * t);
        const ax = (a[1] - p[1]) * mLon, ay = (a[0] - p[0]) * mLat;
        const bx = (b[1] - p[1]) * mLon, by = (b[0] - p[0]) * mLat;
        const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
        let u = len2 ? -((ax * dx + ay * dy) / len2) : 0;
        u = Math.max(0, Math.min(1, u));
        return Math.hypot(ax + u * dx, ay + u * dy);   // distance from p (origin) to the closest point
    }
    // Which drivable road(s) is a hazard node on? It IS a way member, so its coord equals a way vertex.
    function waysAtPoint(lat, lon) {
        const ids = [], names = [];
        for (const w of roadWays) {
            for (const pt of w.pts) {
                if (Math.abs(pt[0] - lat) < COORD_EPS && Math.abs(pt[1] - lon) < COORD_EPS) {
                    ids.push(w.id); if (w.name) names.push(w.name);
                    break;
                }
            }
        }
        return { ids, names };
    }
    // Snap the current position onto the nearest drivable way = "my road" (or null if none within SNAP_MAX_M).
    function snapMyRoad(here) {
        if (!here || !roadWays.length) return null;
        let best = null, bd = Infinity;
        for (const w of roadWays) {
            for (let i = 1; i < w.pts.length; i++) {
                const d = pointToSegM(here, w.pts[i - 1], w.pts[i]);
                if (d < bd) { bd = d; best = w; }
            }
        }
        return (best && bd <= SNAP_MAX_M) ? best : null;
    }

    // A point ~`meters` along `pts` from index `idx` in direction `dir` (+1/-1). Null if the way ends first.
    function pointAlongWay(pts, idx, dir, meters) {
        let acc = 0, i = idx;
        for (;;) {
            const j = i + dir;
            if (j < 0 || j >= pts.length) return null;
            const seg = haversine(pts[i], pts[j]);
            if (seg > 0 && acc + seg >= meters) {
                const t = (meters - acc) / seg;
                return [pts[i][0] + (pts[j][0] - pts[i][0]) * t, pts[i][1] + (pts[j][1] - pts[i][1]) * t];
            }
            acc += seg; i = j;
        }
    }
    // True when the sign's OWN way runs ALONG the route (both sampled sides stay near it), rather than
    // merely touching it at a junction — a side-street give_way sits ~0 m from the route but its way
    // veers off immediately, so one sample lands far away and it's dropped. Uses only distToRoute, so it
    // stays self-contained. Unknown geometry → true (never over-drop a sign we can't resolve).
    function wayAlongRoute(n, distToRoute) {
        if (!n.wayIds || !n.wayIds.length) return true;
        for (const wid of n.wayIds) {
            const w = roadWays.find((x) => x.id === wid);
            if (!w || w.pts.length < 2) continue;
            let idx = -1;
            for (let i = 0; i < w.pts.length; i++) {
                if (Math.abs(w.pts[i][0] - n.lat) < COORD_EPS && Math.abs(w.pts[i][1] - n.lng) < COORD_EPS) { idx = i; break; }
            }
            if (idx < 0) continue;
            const pB = pointAlongWay(w.pts, idx, -1, ALONG_SAMPLE_M);
            const pA = pointAlongWay(w.pts, idx, +1, ALONG_SAMPLE_M);
            const dB = pB ? distToRoute(pB) : null;
            const dA = pA ? distToRoute(pA) : null;
            const nearB = (pB == null) || (dB != null && dB <= ALONG_TOL_M); // missing end = neutral
            const nearA = (pA == null) || (dA != null && dA <= ALONG_TOL_M);
            const realNear = (pB != null && dB != null && dB <= ALONG_TOL_M) || (pA != null && dA != null && dA <= ALONG_TOL_M);
            if (nearB && nearA && realNear) return true;   // this way follows the route → my sign
        }
        return false;   // no on-route way found → it's a cross street
    }

    function drawPins() {
        const lyr = ensureLayer();
        lyr.clearLayers();
        const n2 = nav();
        const navigating = !!(n2 && n2.isNavigating && n2.isNavigating());
        // Navigating → keep ONLY the signs on my ROUTE (all types incl. Bahnübergang — the old level_crossing
        // exemption is exactly what carpet-bombed the rail yard, Doc 2026-07-02). Not navigating → keep only
        // the signs on the road I'm currently on (snapped), so cross-street signs drop too. Can't name my road
        // (off-road / no way data) → fall back to roads-only (the query already dropped non-drivable ways).
        const myWay = navigating ? null : snapMyRoad(lastUpdPos || lastQPos);
        lastDrawWayId = navigating ? 'nav' : (myWay ? myWay.id : null);
        for (const n of nodes) {
            let show = true;
            if (navigating) {
                const d = n2.distToRoute([n.lat, n.lng]);
                show = (d != null && d <= ROUTE_HAZARD_M);
                // Right-of-way signs (Vorfahrt gewähren/Stopp/Vorfahrtstraße) must also sit on a way that
                // runs ALONG my route — else a side-street sign AT the junction (~0 m off route) shows
                // though it governs cross-traffic, not me (Doc 2026-07-05).
                if (show && (n.type === 'give_way' || n.type === 'stop' || n.type === 'priority')) {
                    show = wayAlongRoute(n, (ll) => n2.distToRoute(ll));
                }
            } else if (myWay) {
                show = n.wayIds.indexOf(myWay.id) >= 0 || (!!myWay.name && n.wayNames.indexOf(myWay.name) >= 0);
            }
            if (!show) continue;
            L.marker([n.lat, n.lng], { icon: pin(n.type), interactive: false, keyboard: false, pane: 'markerPane' })
                .bindTooltip(TYPES[n.type].label, { direction: 'top', opacity: 0.9 })
                .addTo(lyr);
        }
    }
    function clearPins() { if (layer) layer.clearLayers(); }

    async function query(here) {
        fetching = true;
        const r = QUERY_R_M, la = here[0], ln = here[1];
        // Roads-only (Doc 2026-07-02): scope every hazard to a DRIVABLE way (.rd) via node(w.rd) — so a
        // level_crossing where only a foot/service path crosses the tracks (the rail-yard pulk) and any
        // parking-lot sign never reach us. We also pull the drivable ways WITH GEOMETRY (.rd out geom) so we
        // can snap the position to "my road" and tell which road each hazard sits on — no second request.
        // Crossings stay narrowed to REAL zebra markings (no generic 'marked'/'uncontrolled', Doc: Elbepark).
        const q = '[out:json][timeout:12];'
            + 'way(around:' + r + ',' + la + ',' + ln + ')[highway~"' + DRIVE_RE + '"]->.rd;'
            + '.rd out geom;'
            + '('
            + 'node(w.rd)[railway=level_crossing];'
            + 'node(w.rd)[highway=stop];'
            + 'node(w.rd)[highway=give_way];'
            + 'node(w.rd)[traffic_sign~"306"];'
            + 'node(w.rd)[highway=traffic_signals];'
            + 'node(w.rd)[highway=crossing][crossing=traffic_signals];'
            + 'node(w.rd)[highway=crossing][crossing_ref=zebra];'
            + 'node(w.rd)[highway=crossing]["crossing:markings"=zebra];'
            + 'node(w.rd)[highway=crossing][crossing=zebra];'
            + ');out;';
        try {
            const j = await window.queryOverpass(q, { timeout: QUERY_TIMEOUT_MS, dbg });
            if (!j || !Array.isArray(j.elements)) { dbg('Hazards: keine Antwort → behalte'); return; }
            // Split the response: drivable ways (with geometry) first, then the hazard nodes.
            const ways = [], rawNodes = [];
            for (const e of j.elements) {
                if (e.type === 'way' && Array.isArray(e.geometry)) {
                    ways.push({ id: e.id, name: (e.tags && (e.tags.name || e.tags.ref)) || '',
                        pts: e.geometry.map((g) => [g.lat, g.lon]),
                        priority: /^(designated|yes)$/i.test((e.tags && e.tags.priority_road) || '') });
                } else if (e.type === 'node') { rawNodes.push(e); }
            }
            roadWays = ways;
            const next = [];
            for (const e of rawNodes) {
                const type = classify(e.tags);
                if (!type || e.lat == null || e.lon == null) continue;
                const w = waysAtPoint(e.lat, e.lon);
                next.push({ id: (e.type || 'n') + '/' + e.id, lat: e.lat, lng: e.lon, type,
                    wayIds: w.ids, wayNames: w.names });
            }
            // Vorfahrtstraße (Zeichen 306) is almost never a mapped point sign in DE — it's the WAY tag
            // priority_road=designated (Doc 2026-07-02, measured at Schloss Wackerbarth: 11 priority_road ways,
            // zero traffic_sign=306 nodes). The physical yellow diamond stands where such a road crosses a
            // lesser road, so synthesise a 'priority' pin at each junction shared by a priority_road way AND a
            // non-priority drivable way. Shared OSM junction nodes carry identical coords across ways → key by
            // rounded coord. The pin is tagged with the PRIORITY way only, so drawPins shows it when you're ON
            // the Hauptstraße (you have right of way) — NOT when you're on the crossing side street.
            const jSeen = new Map();
            for (const w of ways) {
                for (const p of w.pts) {
                    const k = p[0].toFixed(5) + ',' + p[1].toFixed(5);
                    let e = jSeen.get(k);
                    if (!e) { e = { ll: p, ids: new Set(), priIds: [], priNames: [], other: false }; jSeen.set(k, e); }
                    e.ids.add(w.id);
                    if (w.priority) { e.priIds.push(w.id); if (w.name) e.priNames.push(w.name); }
                    else { e.other = true; }
                }
            }
            for (const e of jSeen.values()) {
                if (e.ids.size >= 2 && e.priIds.length && e.other) {
                    next.push({ id: 'pri/' + e.ll[0].toFixed(5) + ',' + e.ll[1].toFixed(5),
                        lat: e.ll[0], lng: e.ll[1], type: 'priority', wayIds: e.priIds, wayNames: e.priNames });
                }
            }
            nodes = next;
            lastDrawWayId = undefined;   // new set → let drawPins recompute the filter
            drawPins();
            // Per-type tally so Doc can SEE in the debug window exactly how many Ampeln (etc.) came back —
            // "Ampel:0" vs "Ampel:5" tells data-gap from render-bug apart at a glance (Doc 2026-07-01).
            const by = {};
            for (const n of nodes) by[n.type] = (by[n.type] || 0) + 1;
            const tally = Object.keys(TYPES).map((t) => TYPES[t].label + ':' + (by[t] || 0)).join(' · ');
            dbg('Hazards ' + nodes.length + ' im Umkreis ' + r + ' m → ' + tally);
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
        // Follow "my road" between the sparse re-queries: if the snapped road changed (turned into a new
        // street), redraw the my-road filter. Cheap — snap over the cached ways, no network (Doc 2026-07-02).
        if (nodes.length) {
            const n2 = nav();
            const navng = !!(n2 && n2.isNavigating && n2.isNavigating());
            const wid = navng ? 'nav' : (function () { const w = snapMyRoad(here); return w ? w.id : null; })();
            if (wid !== lastDrawWayId) drawPins();
        }
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
