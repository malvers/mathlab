// Doc Alvers Tracker - part 1 of 13: brand palette, the Leaflet map, panes, attribution, scale, touch, rain radar.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---------------------------------------------------------------
        // Brand palette (see CLAUDE.md)
        // ---------------------------------------------------------------
        const COL_ORANGE = 'rgb(245, 194, 66)';   // track line
        const COL_RED = 'rgb(176, 36, 24)';       // stop / recording
        const COL_GREEN = 'rgb(121, 158, 49)';    // start / idle

        // ---------------------------------------------------------------
        // Map setup
        // ---------------------------------------------------------------
        const map = L.map('map', {
            zoomControl: false,
            attributionControl: false, // we add our own collapsible ⓘ control below (Leaflet's would rebuild & wipe on basemap toggle)
            touchZoom: true,          // pinch-zoom with two fingers
            doubleClickZoom: false,   // so a double-tap never zooms the map (clock owns double-tap → fullscreen)
            tap: true,
            zoomSnap: 1,              // whole zoom levels only (stepless/0 was too laggy)
            wheelPxPerZoomLevel: 160, // Apple Magic Mouse fires hi-res momentum wheel events → default 60
                                      // accumulated to 2 levels/notch; 160 px/level = one calm step
            wheelDebounceTime: 60,    // coalesce the momentum burst (default 40)
        }).setView([51.1657, 10.4515], 6); // centre of Germany as a neutral start

        // Dedicated pane for the current-position dot + its heading arrow. It must ALWAYS stay on top
        // of every map symbol (POI pins/markerPane 600, fuel 610/620, traffic 615) so the "you are here"
        // puck is never hidden behind e.g. a speed-cam pin. Below the tooltip/popup panes (650/700) so
        // taps still open over it. Both markers below opt into it via `pane: 'posDot'`.
        if (map.createPane && !map.getPane('posDot')) {
            map.createPane('posDot');
            map.getPane('posDot').style.zIndex = 640;
        }
        // Zoom: custom round buttons in the two bottom corners (#zoom-in / #zoom-out, styled like our
        // FABs, wired further down). Leaflet's own control stays off (zoomControl:false above).
        // Collapsible map attribution, pinned to the CENTRE of the viewport. ODbL requires the OSM
        // credit to be visible, but it should not eat space: show only a tiny ⓘ; a tap reveals
        // "© OpenStreetMap" (the word is the copyright link). NOT a Leaflet control — a Leaflet
        // control lives inside #map, whose z-index:1 stacking context would trap a fixed/centred
        // element BEHIND the clock & FAB overlays (z 600) → invisible. So it is a plain element on
        // <body>. The tile layer therefore carries NO attribution string.
        const attribEl = document.createElement('div');
        attribEl.className = 'attrib-collapsed';
        attribEl.innerHTML =
            '<button type="button" class="attrib-toggle" aria-label="Karten-Attribution" title="Karten-Attribution">' +
            '<svg viewBox="0 0 20 20" aria-hidden="true">' +
            '<circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
            '<circle cx="10" cy="6.1" r="1.15" fill="currentColor"/>' +
            '<rect x="8.85" y="8.6" width="2.3" height="5.6" rx="1.15" fill="currentColor"/>' +
            '</svg></button>' +
            '<span class="attrib-body">&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>';
        attribEl.querySelector('.attrib-toggle').addEventListener('click', function () {
            attribEl.classList.toggle('attrib-open');
        });
        document.body.appendChild(attribEl);

        // Metric scale bar (Doc 2026-06-17): a small distance reference. metric-only; lifted clear of the
        // bottom-left zoom (+) button and styled dark/thin in tracker.css (.leaflet-control-scale).
        L.control.scale({ metric: true, imperial: false, maxWidth: 110, position: 'bottomleft' }).addTo(map);

        // Smooth two-finger pinch WITHOUT making the (Magic-Mouse) wheel floaty: the wheel/buttons keep
        // zoomSnap=1 (clean integer steps), but for the duration of a pinch we drop to 0 so it settles
        // exactly where you lift your fingers — no snap-back "Klingklang". Restored right after the
        // gesture (deferred so Leaflet's own touchend has already computed the stepless target).
        const _mapEl = map.getContainer();
        _mapEl.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length >= 2) map.options.zoomSnap = 0;
        }, { passive: true });
        _mapEl.addEventListener('touchend', () => {
            setTimeout(() => { map.options.zoomSnap = 1; }, 0);
        }, { passive: true });

        // Persist the map viewport (pan + zoom) across reloads: a hard-reload reopens where you
        // last were instead of snapping back. A restored view WINS over the start-up GPS snap
        // (see `viewRestored` in the acquire watch); GPS auto-follow while tracking still takes over.
        const VIEW_KEY = 'tracker.mapView';
        let viewRestored = false;
        try {
            const sv = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null');
            if (sv && isFinite(sv.lat) && isFinite(sv.lng) && isFinite(sv.z)) {
                map.setView([sv.lat, sv.lng], sv.z);
                viewRestored = true;
            }
        } catch (e) { /* corrupt entry → ignore, keep the default view */ }
        const saveView = () => {
            const c = map.getCenter();
            try { localStorage.setItem(VIEW_KEY, JSON.stringify({ lat: c.lat, lng: c.lng, z: map.getZoom() })); } catch (e) {}
        };
        map.on('moveend zoomend', saveView);

        // Optional rain-radar overlay (toggled via the REGEN radial button; state persisted).
        // Lives in ../js/rain-radar.js — its dedicated pane sits below the track + photo pins.
        const RAIN_KEY = 'tracker.rainOn';
        if (typeof RainRadar !== 'undefined') {
            RainRadar.init(map);
            // Restore the persisted REGEN choice: if it was on last time, turn it back on.
            if (localStorage.getItem(RAIN_KEY) === '1' && !RainRadar.isOn()) {
                RainRadar.toggle();
                const rb = document.getElementById('mb-rain'); if (rb) rb.classList.add('active');
            }
        }

        // Build/deploy stamp now lives at the top of the central DebugWindow header (js/debug-window.js,
        // Doc 2026-06-30) — no longer painted into the bottom #motion-dbg bar.

        // The map auto-follows new fixes until you take over (drag) — ZENTRIEREN re-enables it.
        // The position dot is hidden during zoom animations so it doesn't jump, then fades back.
        let following = !viewRestored; // a restored viewport stays put (don't auto-follow GPS away from it)
        let lastAutoZoom = 0;            // throttle the speed-adaptive zoom (ms)
        const AUTOZOOM_COOLDOWN = 4000;
        // Speed-adaptive zoom while auto-following: faster → wider view (more lookahead), slower → closer.
        // Discrete bands + smoothed speed + cooldown avoid constant re-zooming. null = leave zoom alone.
        function speedZoom(kmh) {
            if (kmh == null) return null;
            if (kmh < 10) return 17;     // walking / standing
            if (kmh < 35) return 16;     // slow town
            if (kmh < 70) return 15;     // town / country road
            if (kmh < 110) return 14;    // fast road
            return 13;                   // autobahn → widest
        }
        let fitMode = false; // FIT loop: false → 'all' (whole track) → 'remaining' (rest of route, while navigating) → false
        let loadedBounds = null; // bounds of a MULTI-loaded overlay (plotMultiple leaves 'track' empty) → lets FIT still work/show
        // Hand-over ("Hand-Modus"): a manual viewport input that MOVES the map (drag, pinch, wheel,
        // double-click) freezes ALL automatic camera moves — auto-follow AND FIT — so the hand-set view
        // is never overwritten. Hand becomes the view-fan's current mode (its own icon); picking any other
        // fan mode (follow / fit) leaves hand-mode — that transient option then drops away.
        // NOTE: the +/− zoom buttons deliberately do NOT enter hand-mode (Doc 2026-06-26) — see autoZoomHold.
        let handMode = false;
        // +/− zoom buttons must NOT switch on the private/custom (hand) view. Instead a manual +/− just
        // HOLDS the zoom: auto-follow keeps panning to the dot (and FIT keeps centering), but the
        // speed-/fit-driven auto-ZOOM is suspended so the user's chosen zoom sticks. Re-selecting any mode
        // from the view-fan (follow / fit) — i.e. an explicit "resume auto" — clears the hold.
        let autoZoomHold = false;
        let savedAuto = null; // { following, fitMode } captured when hand-mode began → the resume target
        // Nav start shows the whole route for a moment, THEN engages the DYNAMIC remaining-route fit
        // (fitMode='remaining' → re-frames the rest as it shrinks; falls back to centerOnPosition's flyTo
        // if no route geometry yet). This timer holds that "moment"; any manual take-over cancels it.
        let navOverviewTimer = null;
        const NAV_OVERVIEW_MS = 3000;
        // ≈ 5 mm from the map centre (CSS px ≈ 1/96 in → 5 mm ≈ 19 px); within that the dot is "centred".
        const CENTER_TOL_PX = 19;
        // Bounds for "fit whole route": the driven trail ∪ (while navigating) the remaining route to the
        // destination — so mid-drive it frames the ENTIRE journey, not just the small bit already driven
        // (Doc: „ganze Route" hatte nur das Gefahrene gefittet → viertelte mitten auf der Fahrt). Without a
        // route it's just the driven track (or a multi-loaded overlay). `here` optional → else the dot.
        function wholeRouteBounds(here) {
            let b = null;
            if (track.length > 1) b = L.latLngBounds(track);                                                  // driven trail
            else if (loadedBounds) b = L.latLngBounds(loadedBounds.getSouthWest(), loadedBounds.getNorthEast()); // overlay (cloned → never mutate it)
            let ll = here;
            if (!ll && posMarker && posMarker.getLatLng) { const p = posMarker.getLatLng(); ll = [p.lat, p.lng]; }
            const rb = (ll && __nav && __nav.remainingBounds) ? __nav.remainingBounds(ll) : null;             // remaining route ahead
            if (rb) b = b ? b.extend(rb) : rb;
            return b;
        }
        // The view-fan's current mode (drives the trigger icon + which destination the fan excludes).
        // Hand-zoom WINS → the trigger shows the custom-view icon so you can SEE you're in a hand-set view
        // (Doc 2026-06-23: visible as the closed-state trigger, but NEVER as a fan option). A tap OPENS the
        // fan with the escapes (crosshair / fit whole / fit remaining); the hand icon is hidden while the fan
        // is open (CSS) so it never sits among them. Then active FIT, else 'follow' (crosshair / re-centre).
        function currentMode() {
            if (handMode) return 'hand';
            if (fitMode === 'remaining') return 'fitrem';
            if (fitMode === 'all') return 'fitall';
            return 'follow';
        }
        // Which modes are valid to OFFER right now: follow needs a position, fitall a track, fitrem a
        // remaining route (i.e. while navigating), hand only exists once you've actually hand-zoomed.
        function validModes() {
            const pos = posMarker && posMarker.getLatLng && posMarker.getLatLng();
            const trackPresent = track.length >= 10 || !!loadedBounds;   // ≥10 live pts OR a multi-loaded overlay
            const rb = (pos && __nav && __nav.remainingBounds) ? __nav.remainingBounds([pos.lat, pos.lng]) : null;
            // fitall ("ganze Route") is valid with a recorded track OR while navigating (the planned route is
            // a whole route to fit) — so it doesn't pop in only after 10 recorded points (Doc: "mal da, mal nicht").
            return { follow: !!pos, fitall: trackPresent || !!rb, fitrem: !!rb, hand: handMode };
        }
        // Lay out the fan options. The fan only ever offers DESTINATIONS you can jump to — follow / fitall /
        // fitrem — and never the current one (it's on the trigger). "hand" is NOT a destination and never gets
        // a button (m !== 'hand'): you can't "select" a hand-zoom, you only land in it BY zooming. In hand-mode
        // current = 'hand', so NO destination is excluded → the fan shows all three escapes (crosshair + both
        // fits), and the hand trigger itself is hidden while open (CSS). Returns the visible-option count.
        function buildFanOptions() {
            const valid = validModes();
            const cur = currentMode();
            let slot = 0;
            ['follow', 'fitall', 'fitrem', 'hand'].forEach((m) => {
                const b = document.querySelector('#view-fan .vf-opt[data-mode="' + m + '"]');
                if (!b) return;
                if (valid[m] && m !== cur && m !== 'hand') {   // offer only OTHER valid destinations (never hand)
                    b.hidden = false;
                    b.style.setProperty('--i', String(++slot));
                } else {
                    b.hidden = true;
                }
            });
            const fan = document.getElementById('view-fan');
            // --n centres the open cluster. Normally the cluster = trigger + `slot` options. In hand-mode the
            // trigger is hidden (CSS) but still holds its slot, so count it as one extra (slot+1) → the visible
            // options stay centred instead of drifting 28 px left (Doc 2026-06-23).
            if (fan) fan.style.setProperty('--n', String(handMode ? slot + 1 : slot));
            return slot;
        }
        function refreshRecenter() {
            const fan = $('view-fan'), btn = $('recenter-fab');
            if (!fan || !btn) return;
            const pos = posMarker && posMarker.getLatLng && posMarker.getLatLng();
            const trackPresent = track.length >= 10 || !!loadedBounds;
            if (!pos && !trackPresent) { fan.classList.remove('show'); closeFan(); return; } // nothing to centre or fit
            btn.dataset.mode = currentMode();              // trigger shows the current mode's icon
            btn.classList.toggle('mode-on', !!fitMode);    // persistent FIT → green
            fan.classList.add('show');
            if (fanOpen && buildFanOptions() === 0) closeFan(); // state changed away under an open fan → collapse
        }
        function setFollowing(v) { following = v; refreshRecenter(); }
        // Hand-mode no longer has its own button — it's just another mode of the fan. Keep the name so the
        // existing callers (enterHandMode / clearHandMode) stay untouched.
        function refreshResume() { refreshRecenter(); }
