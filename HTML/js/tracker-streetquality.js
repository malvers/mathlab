// js/tracker-streetquality.js — desktop-only road-quality hover tip.
//
// Modelled on tracker-speedlimit.js. When you let the mouse rest on the map (Mac / any device with a
// FINE pointer — never on touch, where there is no hover), it asks Overpass for the nearest drivable
// road at that point and shows a small tooltip with its quality: OSM `surface` (asphalt / cobblestone /
// gravel …) and `smoothness` (excellent … horrible). Free + key-less (CLAUDE.md rule 18). Best-effort:
// Overpass can be slow / rate-limited, so failures are silent (the tip simply doesn't appear).
window.TrackerStreetQuality = function (ctx) {
    const { map } = ctx;

    // Mouse-only: a touch screen has no hover, so the tip would never make sense there. Bail out to a
    // no-op on coarse pointers (phones/tablets) so this never interferes with the touch UI.
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!map || !fine) return { destroy: function () {} };

    // Same key-less Overpass mirrors as tracker-speedlimit.js (rule 18). Rotated so we don't always hit
    // the same one first.
    const OVERPASS_MIRRORS = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.private.coffee/api/interpreter',
    ];
    let mirrorRot = 0;
    const HOVER_DELAY_MS = 350;    // how long the mouse must rest before we query (debounce)
    const MIN_INTERVAL_MS = 1200;  // never query Overpass more often than this, however fast you wiggle
    const QUERY_TIMEOUT_MS = 9000; // abort a stuck request
    const SEARCH_RADIUS_M = 25;    // only roads within this many metres of the cursor count

    let lastQ = 0;                 // timestamp of the last Overpass query
    let hoverTimer = null;         // the rest-debounce timer
    let lastClient = null;         // { x, y } of the cursor in CSS pixels (for tip placement)
    let reqId = 0;                 // bumped per query so a slow earlier response can't overwrite a newer one

    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('🛣️ ' + msg); } catch (e) { } }

    // ---- German labels for the OSM tag values. Unknown values fall through to the raw tag so we still
    //      show *something* rather than hiding it. quality: 'good' | 'mid' | 'bad' drives the colour.
    const SURFACE_DE = {
        asphalt: 'Asphalt', concrete: 'Beton', 'concrete:plates': 'Betonplatten',
        'concrete:lanes': 'Beton (Spuren)', paved: 'befestigt', paving_stones: 'Pflastersteine',
        sett: 'Pflaster (behauen)', cobblestone: 'Kopfsteinpflaster',
        unhewn_cobblestone: 'Kopfstein (roh)', metal: 'Metall', wood: 'Holz',
        compacted: 'verdichtet', fine_gravel: 'Feinschotter', gravel: 'Schotter',
        pebblestone: 'Kies', rock: 'Fels', ground: 'Naturboden', dirt: 'Erdweg',
        earth: 'Erde', grass: 'Gras', grass_paver: 'Rasengittersteine', sand: 'Sand',
        mud: 'Schlamm', unpaved: 'unbefestigt',
    };
    const SMOOTH_DE = {
        excellent: 'exzellent', good: 'gut', intermediate: 'mittel', bad: 'schlecht',
        very_bad: 'sehr schlecht', horrible: 'grauenhaft', very_horrible: 'extrem schlecht',
        impassable: 'unpassierbar',
    };
    // Coarse good/mid/bad buckets for the colour swatch — from smoothness if present, else inferred
    // from the surface. Brand palette (CLAUDE.md): green / orange / red.
    const SMOOTH_Q = {
        excellent: 'good', good: 'good', intermediate: 'mid', bad: 'bad',
        very_bad: 'bad', horrible: 'bad', very_horrible: 'bad', impassable: 'bad',
    };
    const SURFACE_Q = {
        asphalt: 'good', concrete: 'good', 'concrete:plates': 'good', paved: 'good',
        paving_stones: 'mid', sett: 'mid', cobblestone: 'mid', unhewn_cobblestone: 'bad',
        compacted: 'mid', fine_gravel: 'mid', gravel: 'bad', pebblestone: 'bad',
        ground: 'bad', dirt: 'bad', earth: 'bad', grass: 'bad', sand: 'bad', mud: 'bad',
        unpaved: 'bad',
    };
    const Q_COLOR = { good: 'rgb(121, 158, 49)', mid: 'rgb(245, 194, 66)', bad: 'rgb(176, 36, 24)' };

    // Drivable highway types — exclude footways/cycleways so a parallel path can't steal the tip
    // (same set as tracker-speedlimit.js).
    const DRIVE_HW = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary',
        'unclassified', 'residential', 'living_street', 'service', 'road', 'track',
        'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link']);

    // ---- The tooltip element. A plain <body> child (not a Leaflet control) so its z-index sits above
    //      the map without fighting Leaflet's stacking context.
    const tip = document.createElement('div');
    tip.className = 'street-quality-tip';
    tip.style.cssText = [
        'position:fixed', 'z-index:650', 'pointer-events:none',
        'max-width:240px', 'padding:7px 11px', 'border-radius:9px',
        'background:rgba(18,18,20,0.92)', 'color:#f2f2f2',
        "font-family:Orbitron, sans-serif", 'font-size:0.72rem', 'line-height:1.35',
        'box-shadow:0 4px 16px rgba(0,0,0,0.45)', 'border-left:4px solid #555',
        'opacity:0', 'transition:opacity 0.12s ease', 'left:0', 'top:0',
    ].join(';');
    document.body.appendChild(tip);

    function hideTip() { tip.style.opacity = '0'; }

    function showTip(html, color) {
        tip.innerHTML = html;
        tip.style.borderLeftColor = color || '#555';
        tip.style.opacity = '1';
        place();
    }

    // Position the tip next to the cursor, flipped/clamped so it never leaves the viewport.
    function place() {
        if (!lastClient) return;
        const pad = 14, r = tip.getBoundingClientRect();
        let x = lastClient.x + pad, y = lastClient.y + pad;
        if (x + r.width > window.innerWidth - 6) x = lastClient.x - pad - r.width;
        if (y + r.height > window.innerHeight - 6) y = lastClient.y - pad - r.height;
        tip.style.left = Math.max(6, x) + 'px';
        tip.style.top = Math.max(6, y) + 'px';
    }

    // Cheap point-to-way distance (metres), equirectangular — same approach as tracker-speedlimit.js.
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

    // Build the tip HTML for the nearest drivable way's tags. Returns null if the road carries no
    // surface/smoothness info at all (then we show a soft "no data" note instead of a fake quality).
    function describe(tags) {
        const surfRaw = tags.surface || null;
        const smoothRaw = tags.smoothness || null;
        if (!surfRaw && !smoothRaw) return null;
        const surfDE = surfRaw ? (SURFACE_DE[surfRaw] || surfRaw) : null;
        const smoothDE = smoothRaw ? (SMOOTH_DE[smoothRaw] || smoothRaw) : null;
        const q = (smoothRaw && SMOOTH_Q[smoothRaw]) || (surfRaw && SURFACE_Q[surfRaw]) || 'mid';
        const name = tags.name || tags.ref || 'Straße';
        let body = '';
        if (surfDE) body += '<div>Belag: <b>' + esc(surfDE) + '</b></div>';
        if (smoothDE) body += '<div>Qualität: <b>' + esc(smoothDE) + '</b></div>';
        return {
            html: '<div style="opacity:.7;margin-bottom:3px">' + esc(name) + '</div>' + body,
            color: Q_COLOR[q],
        };
    }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, (c) =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    async function query(latlng) {
        const p = [latlng.lat, latlng.lng];
        const id = ++reqId;
        const q = '[out:json][timeout:8];way(around:' + SEARCH_RADIUS_M + ',' + p[0] + ',' + p[1] +
            ')[highway];out tags geom;';
        const j = await overpass(q);
        if (id !== reqId) return;                  // a newer hover already fired → drop this stale answer
        if (!j) { dbg('Overpass: alle Mirror fehlgeschlagen'); return; }
        let best = null, bestD = Infinity;
        for (const e of (j.elements) || []) {
            if (!e.tags || !DRIVE_HW.has(e.tags.highway)) continue;
            const d = distToWay(p, e.geometry);
            if (d < bestD) { bestD = d; best = e.tags; }
        }
        if (!best) { hideTip(); return; }          // no drivable road under the cursor
        const info = describe(best);
        if (info) {
            showTip(info.html, info.color);
        } else {
            // Road found but OSM has no quality tags for it — say so honestly.
            showTip('<div style="opacity:.7;margin-bottom:3px">' +
                esc(best.name || best.ref || 'Straße') + '</div>' +
                '<div style="opacity:.65">keine OSM-Qualitätsdaten</div>', '#555');
        }
    }

    // ---- Mouse wiring. While the mouse moves we keep the tip where it is but reposition it; once it
    //      rests for HOVER_DELAY_MS we fire a (throttled) Overpass query.
    function onMove(e) {
        lastClient = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
        if (tip.style.opacity === '1') place();    // keep an open tip glued to the cursor
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            const now = Date.now();
            if (now - lastQ < MIN_INTERVAL_MS) return;
            lastQ = now;
            query(e.latlng);
        }, HOVER_DELAY_MS);
    }

    function onOut() {
        if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
        hideTip();
    }

    map.on('mousemove', onMove);
    map.on('mouseout', onOut);

    function destroy() {
        map.off('mousemove', onMove);
        map.off('mouseout', onOut);
        if (hoverTimer) clearTimeout(hoverTimer);
        tip.remove();
    }

    dbg('Straßenqualität-Hover aktiv (Maus)');
    return { destroy };
};
