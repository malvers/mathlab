// Shared track-OVERLAY glue for the read-only pages — view.html (multi-bundle) and tour.html (folder
// showcase). The heavy rendering already lives centrally in TrackRender + PhotoLayer; this is the thin
// glue both pages were duplicating: draw one stage's speed-coloured line + a transparent clickable
// hit-line that names it, drop media pins, and derive per-stage stats. Single source of truth so a
// tweak (popup look, gap logic, pin behaviour) is made ONCE (Doc 2026-07-06).
//
// Load AFTER leaflet, track-render.js and photo-layer.js. Callers pass PRE-FILTERED points
// (each [lat, lng, tIso, alt, speed, activity, …], no null coords) so indices stay aligned.
(function (global) {
    'use strict';
    const R = 6371000, rad = d => d * Math.PI / 180;
    function haversine(a, b) {
        const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
        const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
    }
    // Compact duration: "2:07 h" or "23 min".
    function fmtClock(ms) {
        const s = Math.max(0, Math.round(ms / 1000)), p = n => String(n).padStart(2, '0');
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
        return h > 0 ? h + ':' + p(m) + ' h' : m + ' min';
    }
    // Distance (m), duration (ms) and ascent/descent (m) from raw points — format-independent.
    function statsFromPoints(pts) {
        let d = 0, up = 0, down = 0, prevA = null;
        for (let i = 0; i < pts.length; i++) {
            if (i > 0) d += haversine(pts[i - 1], pts[i]);
            const a = pts[i][3];
            if (a != null) { if (prevA != null) { const dv = a - prevA; if (dv > 0) up += dv; else down -= dv; } prevA = a; }
        }
        const ts = pts.map(p => p[2]).filter(Boolean);
        let durMs = 0;
        if (ts.length > 1) { const a = Date.parse(ts[0]), b = Date.parse(ts[ts.length - 1]); if (!isNaN(a) && !isNaN(b)) durMs = Math.max(0, b - a); }
        return { distM: d, durMs, up: Math.round(up), down: Math.round(down) };
    }
    // Draw ONE stage into `layer` (speed-coloured, via TrackRender). If opts.name is given, a transparent
    // fat hit-line on top opens a popup with the name (+ optional meta line) — the coloured hotline isn't
    // clickable, so this catches the tap. Returns the stage's [lat,lng] points (for fitBounds).
    function drawStage(map, layer, pts, opts) {
        opts = opts || {};
        const ll = pts.map(p => [p[0], p[1]]);
        if (!ll.length) return ll;
        TrackRender.draw({
            track: ll,
            times: pts.map(p => p[2] || null),
            speeds: pts.map(p => (p[4] != null ? p[4] : null)),
            activities: pts.map(p => (p[5] != null ? p[5] : null)),
            layer: layer, usesHotline: !!opts.usesHotline,
        });
        if (opts.name) {
            const hit = L.polyline(ll, { color: '#000', opacity: 0, weight: 16, interactive: true });
            const pop = document.createElement('div'); pop.className = 'track-id-pop';
            const nm = document.createElement('div'); nm.className = 'track-id-name'; nm.textContent = opts.name; pop.appendChild(nm);
            if (opts.meta) { const me = document.createElement('div'); me.className = 'track-id-meta'; me.textContent = opts.meta; pop.appendChild(me); }
            hit.bindPopup(pop); hit.addTo(layer);
        }
        return ll;
    }
    // Add a media waypoint pin (photo / voice / video, shared PhotoLayer renderer) + lightbox.
    // `state` = { waypoints:[], wpMarkers:[] } (the caller keeps them for stack badges).
    function addWaypoint(map, state, wp) {
        state.waypoints.push(wp);
        const m = L.marker([wp.lat, wp.lng], { icon: PhotoLayer.pinIcon(wp) }).addTo(map);
        m._wp = wp;
        m.on('click', () => PhotoLayer.openLightbox(wp, state.waypoints));
        state.wpMarkers.push(m);
        PhotoLayer.applyStackBadges(state.wpMarkers, map);
        return m;
    }

    global.TrackOverlay = { haversine, fmtClock, statsFromPoints, drawStage, addWaypoint };
})(window);
