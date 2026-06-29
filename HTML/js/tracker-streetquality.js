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

    // Overpass now goes through the shared server-side proxy (window.queryOverpass → `overpass` Edge
    // Function), which owns the mirror list + rotation + failover (rule 18: all key-less).
    const QUERY_TIMEOUT_MS = 14000; // client abort; the proxy races all mirrors and answers well within this
    const SEARCH_RADIUS_M = 25;    // only roads within this many metres of the click point count

    let lastClient = null;         // { x, y } of the cursor in CSS pixels (for tip placement)
    let lastLatLng = null;         // map coords under the cursor
    let reqId = 0;                 // bumped per query so a slow earlier response can't overwrite a newer one
    let altDown = false;           // is the Option/Alt key currently held? (shows the crosshair cursor)

    // The map container — we flip its cursor to a crosshair while Alt is held so it's clear the
    // road-info probe is armed.
    const mapEl = (map.getContainer && map.getContainer()) || null;

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

    // Thin wrapper around the shared proxy so the call sites below stay unchanged. Keeps the 🛣️ debug
    // line and this module's QUERY_TIMEOUT_MS client-side abort. Returns parsed JSON or null, as before.
    async function overpass(q) {
        return window.queryOverpass(q, { timeout: QUERY_TIMEOUT_MS, dbg: dbg });
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

    // Tempo line for the clicked road — uses the SAME tag→limit logic as the speed-limit sign
    // (ctx.speed.resolveLimit), so a real signed limit / 30-zone shows, generic guesses don't.
    // 'none' → unbegrenzt; null (no signed limit in OSM) → muted "nicht getaggt".
    function speedLine(tags) {
        const lim = (ctx.speed && ctx.speed.resolveLimit) ? ctx.speed.resolveLimit(tags) : null;
        if (lim === 'none') return '<div>Tempo: <b>unbegrenzt</b></div>';
        if (lim == null) return '<div style="opacity:.6">Tempo: nicht getaggt</div>';
        return '<div>Tempo: <b>' + lim + '</b> km/h</div>';
    }

    async function query(latlng) {
        const p = [latlng.lat, latlng.lng];
        const id = ++reqId;
        const q = '[out:json][timeout:8];way(around:' + SEARCH_RADIUS_M + ',' + p[0] + ',' + p[1] +
            ')[highway];out tags geom;';
        const j = await overpass(q);
        if (id !== reqId) return;                  // a newer hover already fired → drop this stale answer
        if (!j) {
            dbg('Overpass: alle Mirror fehlgeschlagen');
            showTip('<div style="opacity:.9">Keine Verbindung möglich.</div>', 'rgb(176, 36, 24)');
            return;
        }
        dbg('Overpass: ' + ((j.elements && j.elements.length) || 0) + ' ways');
        let best = null, bestD = Infinity;
        for (const e of (j.elements) || []) {
            if (!e.tags || !DRIVE_HW.has(e.tags.highway)) continue;
            const d = distToWay(p, e.geometry);
            if (d < bestD) { bestD = d; best = e.tags; }
        }
        if (!best) { dbg('keine fahrbare Straße in ' + SEARCH_RADIUS_M + 'm'); hideTip(); return; }
        dbg('nächste: ' + (best.name || best.ref || best.highway) + ' (' + Math.round(bestD) + 'm)');
        const info = describe(best);
        if (info) {
            showTip(info.html + speedLine(best), info.color);
        } else {
            // Road found but OSM has no quality tags for it — say so honestly, but still show the Tempo.
            showTip('<div style="opacity:.7;margin-bottom:3px">' +
                esc(best.name || best.ref || 'Straße') + '</div>' +
                '<div style="opacity:.65">keine OSM-Qualitätsdaten</div>' + speedLine(best), '#555');
        }
    }

    // ---- Mouse wiring. Moving the mouse only keeps an open tip glued to the cursor; the actual
    //      road-info query fires on an Option/Alt-CLICK (Doc's choice), not on hover-rest.
    function onMove(e) {
        lastClient = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
        lastLatLng = e.latlng;
        if (tip.style.opacity === '1') place();    // keep an open tip glued to the cursor
    }

    // Option/Alt + click on the map → probe the road at the clicked point.
    function onClick(e) {
        const oe = e.originalEvent;
        if (!(altDown || (oe && oe.altKey))) return;   // only when Option is held
        if (oe) lastClient = { x: oe.clientX, y: oe.clientY };
        lastLatLng = e.latlng;
        dbg('Klick-Abfrage @ ' + e.latlng.lat.toFixed(5) + ',' + e.latlng.lng.toFixed(5));
        query(e.latlng);
    }

    function onOut() { hideTip(); }

    // ---- Keyboard gate. Holding Option/Alt shows the crosshair cursor so it's clear an Option-click
    //      will probe the road; releasing it clears the cursor and any open tip. blur resets the state
    //      so a missed keyup can't leave it stuck on.
    function arm() {
        if (altDown) return;
        altDown = true;
        if (mapEl) mapEl.style.cursor = 'crosshair';
    }
    function disarm() {
        if (!altDown) return;
        altDown = false;
        if (mapEl) mapEl.style.cursor = '';
        hideTip();
    }
    function onKeyDown(e) { if (e.altKey || e.key === 'Alt') arm(); }
    function onKeyUp(e) { if (e.key === 'Alt' || !e.altKey) disarm(); }

    map.on('mousemove', onMove);
    map.on('mouseout', onOut);
    map.on('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', disarm);

    function destroy() {
        map.off('mousemove', onMove);
        map.off('mouseout', onOut);
        map.off('click', onClick);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('blur', disarm);
        if (mapEl) mapEl.style.cursor = '';
        tip.remove();
    }

    dbg('Straßenqualität aktiv (Option+Klick auf die Karte)');
    return { destroy };
};
