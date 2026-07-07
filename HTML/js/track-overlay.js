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
    // Order a folder's stages into their real WALKED sequence by geography, not by upload time. Sorting
    // by created_at breaks the moment a stage is (re-)built/imported later than it was walked — e.g. a GPX
    // we constructed today belongs mid-tour, yet created_at dumps it at the very end, tearing the
    // elevation profile into cliffs and mis-numbering the legs. So: seed with the earliest-created stage,
    // then greedily chain each next stage by the START point nearest the current chain's END (stages are
    // walked forward, so end→start matches). A loop traces the ring; an open route walks A→B. Stages
    // without points keep their created_at order at the tail so nothing is dropped.
    function orderStages(tracks) {
        const list = Array.isArray(tracks) ? tracks : [];
        const byDate = list.slice().sort((a, b) => Date.parse((a && a.created_at) || 0) - Date.parse((b && b.created_at) || 0));
        const hasPts = t => t && Array.isArray(t.points) && t.points.length;
        const withPts = byDate.filter(hasPts);
        const noPts = byDate.filter(t => !hasPts(t));
        if (withPts.length <= 1) return withPts.concat(noPts);
        const startOf = t => t.points[0];
        const endOf = t => t.points[t.points.length - 1];
        const remaining = withPts.slice();
        const ordered = [remaining.shift()];   // seed = earliest created_at
        while (remaining.length) {
            const tail = endOf(ordered[ordered.length - 1]);
            let bi = 0, bd = Infinity;
            for (let i = 0; i < remaining.length; i++) {
                const dist = haversine(tail, startOf(remaining[i]));
                if (dist < bd) { bd = dist; bi = i; }
            }
            ordered.push(remaining.splice(bi, 1)[0]);
        }
        return ordered.concat(noPts);
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

    // Media show/hide toggles (photo · voice · video) for the read-only pages — declutter a map full of
    // pins. Builds one button per PRESENT type into #boxId, filters the markers (each carrying ._wp) by
    // type, and persists per-type visibility in localStorage (trk-media-<kind>, the SAME keys the recorder
    // uses). Single source so view.html and tour.html behave identically. `getMarkers()` returns the current
    // marker array (each an L.marker with ._wp = the waypoint, whose .type is 'voice' | 'video' | else photo).
    // Returns { refresh, apply, sync } — call refresh() after the marker set changes.
    const MT_KINDS = ['photo', 'voice', 'video'];
    const MT_TITLE = { photo: 'Fotos', voice: 'Sprachnotizen', video: 'Videos' };
    const MT_GLYPH = {
        photo: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
        video: '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>',
        voice: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    };
    const mtKind = wp => (wp && wp.type === 'voice') ? 'voice' : ((wp && wp.type === 'video') ? 'video' : 'photo');
    function mediaToggles(map, boxId, getMarkers) {
        const vis = { photo: true, voice: true, video: true };
        MT_KINDS.forEach(k => { if (localStorage.getItem('trk-media-' + k) === '0') vis[k] = false; });
        const visible = () => getMarkers().filter(m => map.hasLayer(m));
        function applyOne(m) {
            if (!m || !m._wp) return;
            const on = vis[mtKind(m._wp)];
            if (on && !map.hasLayer(m)) m.addTo(map);
            else if (!on && map.hasLayer(m)) map.removeLayer(m);
        }
        function apply() { getMarkers().forEach(applyOne); PhotoLayer.applyStackBadges(visible(), map); }
        function sync() {
            const box = document.getElementById(boxId); if (!box) return;
            const present = {};
            getMarkers().forEach(m => { if (m && m._wp) present[mtKind(m._wp)] = true; });
            MT_KINDS.forEach(kind => {
                let btn = box.querySelector('[data-kind="' + kind + '"]');
                if (present[kind] && !btn) {
                    btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'media-tgl' + (vis[kind] ? '' : ' off');
                    btn.dataset.kind = kind;
                    btn.setAttribute('aria-label', MT_TITLE[kind] + ' ein-/ausblenden');
                    btn.title = MT_TITLE[kind];
                    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + MT_GLYPH[kind] + '</svg>';
                    btn.addEventListener('click', () => {
                        vis[kind] = !vis[kind];
                        localStorage.setItem('trk-media-' + kind, vis[kind] ? '1' : '0');
                        btn.classList.toggle('off', !vis[kind]);
                        apply();
                    });
                    box.appendChild(btn);
                }
                if (btn) { btn.style.display = present[kind] ? '' : 'none'; btn.classList.toggle('off', !vis[kind]); }
            });
        }
        function refresh() { apply(); sync(); }
        // applyOne(m): add/remove a SINGLE freshly-created marker per its type's current visibility — callers
        // create markers without addTo(map) and let this place them, so a hidden type never flashes on.
        return { refresh, apply, sync, applyOne };
    }

    global.TrackOverlay = { haversine, fmtClock, statsFromPoints, orderStages, drawStage, addWaypoint, mediaToggles };
})(window);
