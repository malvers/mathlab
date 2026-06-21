// Doc Alvers Tracker — main app logic. Extracted verbatim from the inline <script> in
// tracker.html (2026-06-09, Phase-1 refactor) so a linter can run on it and a single init
// error no longer hides inside the HTML. Loads as a classic script AFTER supabase-js and the
// document.write'd modules (rain-*, cyber-clock, debug-window, photo-*, voice-note, …), so it
// shares their globals exactly as before. Behaviour is unchanged.

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

        // Build/deploy stamp in the always-on debug box — document.lastModified = the served
        // HTML's Last-Modified header → the real deploy time; tells at a glance if a push landed.
        (function () {
            const el = document.getElementById('dbg-build');
            if (!el) return;
            const lm = new Date(document.lastModified);
            const p = (n) => String(n).padStart(2, '0');
            el.textContent = isNaN(lm.getTime())
                ? 'BUILD ' + (document.lastModified || '?')
                : 'BUILD ' + p(lm.getDate()) + '.' + p(lm.getMonth() + 1) + '. '
                  + p(lm.getHours()) + ':' + p(lm.getMinutes()) + ':' + p(lm.getSeconds());
        })();

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
        // Hand-over ("Hand-Modus"): ANY manual viewport/zoom input (drag, +/− buttons, pinch, wheel,
        // double-click) freezes ALL automatic camera moves — auto-follow AND FIT — so the hand-set view
        // is never overwritten. A resume arrow (#resume-fab) appears; tapping it (or CENTER / FIT) restores
        // the auto-mode that was active before the take-over (remembered in `savedAuto`).
        let handMode = false;
        let savedAuto = null; // { following, fitMode } captured when hand-mode began → the resume target
        // Nav start shows the whole route for a moment, THEN engages the DYNAMIC remaining-route fit
        // (fitMode='remaining' → re-frames the rest as it shrinks; falls back to centerOnPosition's flyTo
        // if no route geometry yet). This timer holds that "moment"; any manual take-over cancels it.
        let navOverviewTimer = null;
        const NAV_OVERVIEW_MS = 3000;
        // ≈ 5 mm from the map centre (CSS px ≈ 1/96 in → 5 mm ≈ 19 px); within that the dot is "centred".
        const CENTER_TOL_PX = 19;
        function refreshRecenter() {
            const btn = $('recenter-fab');
            if (!btn) return;
            const pos = posMarker && posMarker.getLatLng && posMarker.getLatLng();
            const trackPresent = track.length >= 10 || !!loadedBounds;   // ≥10 live pts OR a multi-loaded overlay
            if (!pos && !trackPresent) { btn.classList.remove('show'); return; } // nothing to centre or fit
            // ONE button, never both: the FIT frame whenever there's a track to fit (tap cycles; "off" re-centres
            // on you, see the click handler); otherwise the crosshair to re-centre on GPS.
            btn.classList.toggle('fit', trackPresent);
            btn.classList.toggle('mode-on', !!fitMode);   // persistent FIT → green
            btn.classList.add('show');
        }
        function setFollowing(v) { following = v; refreshRecenter(); }
        // Show/hide the resume arrow — visible exactly while we're in hand-mode.
        function refreshResume() { const b = $('resume-fab'); if (b) b.classList.toggle('show', handMode); }
        // Enter hand-mode: remember whichever auto-mode is driving the camera, then freeze BOTH (follow +
        // FIT) so the user's hand-set view stays put. No-op if nothing auto was running (then there is
        // nothing to freeze or resume) or if we're already in hand-mode.
        function enterHandMode() {
            if (handMode || (!following && !fitMode)) return;
            savedAuto = { following: following, fitMode: fitMode };
            handMode = true;
            following = false; fitMode = false; // the auto-follow + FIT blocks now no-op → frozen
            cancelNavOverview();
            refreshRecenter(); refreshResume();
        }
        // Leave hand-mode WITHOUT restoring (used when CENTER / FIT explicitly take over instead).
        function clearHandMode() { if (!handMode) return; handMode = false; savedAuto = null; refreshResume(); }
        // Resume the auto-mode that was active before the hand take-over (the resume arrow).
        function resumeAuto() {
            const s = savedAuto;
            clearHandMode();
            if (!s) return;
            if (s.fitMode) {
                fitMode = s.fitMode; following = false;
                const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng();
                const b = (s.fitMode === 'remaining' && ll && __nav && __nav.remainingBounds)
                    ? __nav.remainingBounds([ll.lat, ll.lng])
                    : (track.length > 1 ? L.latLngBounds(track) : loadedBounds);
                if (b) { try { map.fitBounds(b, { padding: fitPad() }); } catch (e) { } }
                refreshRecenter();
            } else if (s.following) {
                centerOnPosition(); // re-centre on the dot + setFollowing(true)
            }
        }
        // Cancel a pending "overview → follow" glide (the user took over, or we stopped/paused).
        function cancelNavOverview() { if (navOverviewTimer) { clearTimeout(navOverviewTimer); navOverviewTimer = null; } }
        // ANY hand input → hand-mode (freeze auto). Drag, mouse wheel, two-finger pinch, double-click;
        // the +/− buttons hook enterHandMode() in their own click handlers below.
        map.on('dragstart', () => { cancelNavOverview(); enterHandMode(); });
        map.on('dblclick', enterHandMode);
        (function wireHandZoom() {
            const el = map.getContainer && map.getContainer();
            if (!el) return;
            el.addEventListener('wheel', enterHandMode, { passive: true });
            el.addEventListener('touchstart', (e) => { if (e.touches && e.touches.length >= 2) enterHandMode(); }, { passive: true });
        })();
        map.on('moveend zoomend', refreshRecenter); // view moved → POS may have left/entered the view

        // Fit insets (used by every map fit below). The map runs zoomSnap:1 (whole zoom levels), so for
        // FEAT-21's soft idle-zoom a padding tweak alone would resolve to the SAME snapped level
        // (invisible) → fitBigger() drops to zoomSnap:0 for that one animated fit and restores it after.
        const FIT_PAD = 40;        // normal fit inset (instruments visible)
        const FIT_PAD_IDLE = 14;   // tighter inset while the chrome is hidden → track uses the freed space
        const BASE_ZOOMSNAP = map.options.zoomSnap; // = 1; restored after the fractional soft-fit
        const fitPad = () => { const p = document.body.classList.contains('ui-idle') ? FIT_PAD_IDLE : FIT_PAD; return [p, p]; };
        // Chrome HIDES (idle) → remember the exact current view, then fit the track BIGGER into the freed
        // space (tight inset, fractional zoom so it's visible at zoomSnap:1). Chrome SHOWS again → just
        // restore that remembered view (Doc's idea — no recompute, so "shown" always lands back exactly).
        let _savedView = null;
        function fitBigger() {
            if (handMode || following || track.length < 2) return false; // not in hand-mode, not while live-following; need a real track
            const b = (fitMode === 'remaining' && __nav && __nav.remainingBounds && posMarker)
                ? __nav.remainingBounds([posMarker.getLatLng().lat, posMarker.getLatLng().lng])
                : L.latLngBounds(track);
            if (!b) return false;
            map.options.zoomSnap = 0; // fractional → the zoom-in is actually visible at zoomSnap:1
            try { map.fitBounds(b, { padding: [FIT_PAD_IDLE, FIT_PAD_IDLE], animate: true, duration: 0.5 }); } catch (e) { }
            setTimeout(() => { map.options.zoomSnap = BASE_ZOOMSNAP; }, 700);
            return true;
        }
        let _wasIdle = document.body.classList.contains('ui-idle');
        new MutationObserver(() => {
            const idle = document.body.classList.contains('ui-idle');
            if (idle === _wasIdle) return; // only react when ui-idle actually flips
            _wasIdle = idle;
            if (idle) {
                const view = { c: map.getCenter(), z: map.getZoom() }; // remember BEFORE we zoom bigger
                if (fitBigger()) _savedView = view;                    // saved only if we actually zoomed
            } else if (_savedView) {
                map.options.zoomSnap = 0;
                map.setView(_savedView.c, _savedView.z, { animate: true, duration: 0.5 }); // restore exactly
                setTimeout(() => { map.options.zoomSnap = BASE_ZOOMSNAP; }, 700);
                _savedView = null;
            }
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        map.on('zoomstart', () => {
            const el = posMarker && posMarker.getElement && posMarker.getElement();
            if (el) { el.style.transition = 'none'; el.style.opacity = '0'; }
        });
        map.on('zoomend', () => {
            const el = posMarker && posMarker.getElement && posMarker.getElement();
            if (el) { el.style.transition = ''; el.style.opacity = ''; }
        });

        const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxNativeZoom: 19, // OSM tiles stop at z19 …
            maxZoom: 21,       // … Leaflet upscales beyond (blurry) so close photo pins can separate
            // no `attribution` here — rendered by our collapsible AttribCtl (ⓘ) above
        }).addTo(map);

        // DEBUG: hide the background map → judge the rain-radar colours with no terrain underneath.
        //   key 'k' → dark backdrop · key 'w' → white backdrop · same key again → map back on.
        let hgMode = 'on'; // 'on' | 'dark' | 'white'
        function applyHg(mode) {
            hgMode = mode;
            if (mode === 'on') { baseMap.addTo(map); map.getContainer().style.background = ''; }
            else { map.removeLayer(baseMap); map.getContainer().style.background = (mode === 'white') ? '#ffffff' : 'rgb(8, 20, 42)'; }
            if (window.DebugWindow && DebugWindow.log)
                DebugWindow.log('Basemap (HG): ' + (mode === 'on' ? 'AN' : mode === 'white' ? 'AUS · weiß' : 'AUS · dunkel'));
        }
        document.addEventListener('keydown', function (e) {
            const k = e.key;
            if (k !== 'k' && k !== 'K' && k !== 'w' && k !== 'W') return;
            const t = e.target;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            if (k === 'w' || k === 'W') applyHg(hgMode === 'white' ? 'on' : 'white');
            else applyHg(hgMode === 'dark' ? 'on' : 'dark');
        });

        // Track coloured by speed (green slow → orange → red fast) via Leaflet.hotline, but the
        // line is BROKEN at gaps: a stretch where recording paused (movement gate "still", accuracy
        // > 50 m, or no fix from the OS) leaves a big time gap → instead of a speed line, that
        // segment is drawn as a white/red dashed "no data here" marker (no speed colour under it).
        const usesHotline = !!L.hotline;
        // ABSOLUTE colour scale (comparable across tracks). Walking (0–5 km/h) gets the lower HALF
        // of the scale as its own rich green sub-ramp; 5 km/h → MAX_KMH fills the upper half.
        const MAX_KMH = 40;
        // Track-Renderer (Farbskalen, Gap-Logik, Run-Splitting) lebt zentral in ../js/track-render.js
        // — single source of truth, geteilt mit view.html. Hier nur der seiteneigene Layer + ein
        // dünner Wrapper, der den lokalen State (track/times/speeds/activities) reinreicht.
        const trackLayer = L.layerGroup().addTo(map);
        let smoothOn = false; // non-destructive GPS smoothing: transforms the DISPLAYED line only
        function redrawTrack() {
            const t = (smoothOn && typeof TrackSmooth !== 'undefined' && TrackSmooth.smooth)
                ? TrackSmooth.smooth(track, times) : track;
            TrackRender.redraw({ track: t, times, speeds, activities, layer: trackLayer, usesHotline });
        }
        // Central altitude accessor: every consumer (HÖHE tile, GPX export, ascent) reads through this,
        // so the DEM toggle has ONE hook — just like positions all go through redrawTrack(). Falls back
        // to the raw GPS+baro alts whenever DEM is off or not (yet) aligned with the current track.
        function effectiveAlts() {
            return (demOn && demAlts.length === track.length) ? demAlts : alts;
        }
        // Total climb / descent (m) over an altitude array; nulls are skipped.
        function ascentDescent(arr) {
            let up = 0, down = 0, prev = null;
            for (let i = 0; i < arr.length; i++) {
                const v = arr[i]; if (v == null) continue;
                if (prev != null) { const d = v - prev; if (d > 0) up += d; else down -= d; }
                prev = v;
            }
            return { up: Math.round(up), down: Math.round(down) };
        }
        // Forget any DEM result + switch the toggle off — called whenever the track changes.
        function resetDem() {
            demAlts = []; demOn = false;
            const b = $('mb-dem'); if (b) b.classList.remove('active');
        }

        // ---- Track statistics (idea #8): distance, duration, Ø/max speed, ascent/descent ----
        // Höhenmeter read through effectiveAlts() → they use the DEM-corrected altitude when that
        // toggle is on, the raw GPS+baro otherwise. Computed on demand when the settings panel opens.
        function trackStats() {
            const A = effectiveAlts();
            const t0 = times.find(Boolean), t1 = times.slice().reverse().find(Boolean);
            const durMs = (t0 && t1) ? (Date.parse(t1) - Date.parse(t0)) : 0;
            const avgKmh = durMs > 0 ? (totalDist / 1000) / (durMs / 3600000) : 0;
            let maxKmh = 0;
            for (let i = 0; i < speeds.length; i++) if (speeds[i] != null && speeds[i] > maxKmh) maxKmh = speeds[i];
            const ad = ascentDescent(A);
            let hi = null, lo = null;
            for (let i = 0; i < A.length; i++) { const v = A[i]; if (v == null) continue; if (hi == null || v > hi) hi = v; if (lo == null || v < lo) lo = v; }
            return { distM: totalDist, durMs, avgKmh, maxKmh, up: ad.up, down: ad.down, hi, lo };
        }
        function fmtDur(ms) {
            const s = Math.max(0, Math.round(ms / 1000));
            const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
            const p = (n) => String(n).padStart(2, '0');
            return h > 0 ? h + ':' + p(m) + ':' + p(ss) : m + ':' + p(ss);
        }
        function fmtDist(m) { return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(2) + ' km'; }
        function renderTrackStats() {
            const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
            if (!track.length) { ['ts-dist', 'ts-dur', 'ts-avg', 'ts-max', 'ts-up', 'ts-down', 'ts-hilo'].forEach((id) => set(id, '–')); return; }
            const s = trackStats(), dem = demOn ? ' (DEM)' : '';
            set('ts-dist', fmtDist(s.distM));
            set('ts-dur', fmtDur(s.durMs));
            set('ts-avg', s.avgKmh.toFixed(1) + ' km/h');
            set('ts-max', s.maxKmh.toFixed(1) + ' km/h');
            set('ts-up', s.up + ' m' + dem);
            set('ts-down', s.down + ' m' + dem);
            set('ts-hilo', (s.hi != null ? Math.round(s.hi) : '–') + ' / ' + (s.lo != null ? Math.round(s.lo) : '–') + ' m');
        }

        let posMarker = null;
        let headingMarker = null; // small travel-direction triangle at the position dot

        // ---------------------------------------------------------------
        // Tracking state
        // ---------------------------------------------------------------
        let watchId = null;
        let ambientId = null;      // idle live-follow watch (runs when NOT recording, so the dot tracks you)
        let acquireWatch = null;   // temporary watch used while acquiring a good initial fix
        let tracking = false;      // true only while actively recording
        let trkState = 'idle';     // 'idle' | 'recording' | 'paused'
        let pauseStart = 0;        // ms — when the current pause began (to not count it as track time)
        let track = [];            // array of [lat, lng]
        let times = [];            // ISO timestamp per recorded point (index-aligned)
        let alts = [];             // altitude in m per point (fused GPS+baro; null if unknown)
        let demAlts = [];          // terrain-model altitude per point (filled on demand, parallel to alts)
        let demOn = false;         // show/export DEM-corrected altitude instead of GPS+baro (non-destructive)
        let demBusy = false;       // a DEM fetch is in flight → ignore further taps
        let speeds = [];           // speed in km/h per point (index-aligned)
        let activities = [];       // travel mode per point: walking/running/on_bicycle/in_vehicle/still
        let currentTrackId = null; // DB id of the loaded/just-saved track (for the menu "TEILEN")
        let currentTrackName = '';
        let totalDist = 0;         // metres
        let startTime = null;      // ms
        let timerId = null;
        let lastFix = null;        // { lat, lng, t }
        let waypoints = [];        // Foto-/Voice-Spur: [{type, lat, lng, t, img|audio, dur, mime, title, text, _marker}]
        // Canonical waypoint → DB/buffer shape: pass ALL fields through (photo `img` and voice
        // `audio`/`dur`/`type` alike), only drop the runtime-only Leaflet marker. Future fields
        // (e.g. a transcript) ride along for free — single source, no per-field enumeration.
        function wpSer(w) {
            const o = Object.assign({}, w); delete o._marker;
            delete o._blob;                                         // never serialize the raw video File
            delete o._trackId;                                      // runtime-only: which DB row holds this wp (for corrections)
            if (o._pending) { o.video = null; delete o._pending; }  // un-uploaded video → no dead blob: URL
            return o;
        }
        let wpMarkers = [];
        let fannedCluster = null;  // spiderfy: a photo fan is open (set by tracker-media); core reads it to gate the radial menu
        let __media = null;        // Foto-Spur module instance (js/tracker-media.js)        // their Leaflet markers (kept for clearing)
        let __nav = null;          // simple-navigation module instance (js/tracker-nav.js)
        let __speed = null;        // speed-limit sign module instance (js/tracker-speedlimit.js)
        let __compass = null;      // north/compass module instance (js/tracker-compass.js)
        let __fuel = null;         // fuel-station price layer (js/tracker-fuel.js)
        let __poi = null;          // points-of-interest layer (js/tracker-poi.js)
        let gnssActive = false;    // true once the native GnssStatus listener delivers data
        let gnssLatest = null;     // last native GNSS summary {used, inView, usedByConstellation, ...}
        let gpsReal = false;       // true only on a genuine GPS fix (native sats used, or acc ≤ GPS) —
                                   // gates the travel-mode icon: in WLAN/cell the guessed mode is junk

        const MIN_MOVE_M = 4;      // ignore jitter below this distance
        const MAX_ACC_M = 50;      // ignore fixes worse than this accuracy
        const MAX_JUMP_KMH = 300;  // a fix implying a faster GROUND speed than this = a GPS "teleport"
                                   // — typically the coarse WLAN/cell first fix snapping to the real
                                   // GPS position. Re-baseline on it, but drop its bogus speed + leg.

        // --- Movement gate (accelerometer) + adaptive jitter filtering ---
        const ACC_STEP_FACTOR = 0.7;   // adaptive min step = accuracy * this (never below MIN_MOVE_M)
        // Gate is a SAFETY NET only for "phone lying around" (sensor barely reacts). Any carrying
        // — even calm walking / a smooth ride / a steady hand — has enough micro-motion to count as
        // moving, so it keeps recording. Thresholds sit just above the accelerometer noise floor.
        const MOTION_STILL = 0.04;     // m/s²: dynamic-accel energy below this → "still" (basically motionless)
        const MOTION_MOVE = 0.10;      // m/s²: above this → "moving" (hysteresis between the two)
        const SPEED_MOVE_KMH = 4;      // km/h: GPS speed above this overrides the gate → always "moving"
                                       // (a vehicle at steady cruise produces almost no dynamic accel)
        const SPEED_ZERO_KMH = 1.0;    // km/h: readout snaps to 0 below this → kills GPS-Doppler noise at standstill
        let motionReady = false;       // a real accelerometer is delivering data
        let motionStill = true;        // current gate verdict
        let motionEnergy = 0;          // smoothed |dynamic acceleration|
        let shownSpeed = 0;            // smoothed km/h for a flicker-free readout
        let spdDbg = '';               // BUG-1: speed-source readout appended to the existing #motion-dbg bar
        let dopplerLogged = false;     // BUG-1: log coords.speed availability to the existing DebugWindow once
        const _grav = { x: 0, y: 0, z: 0 };

        // --- Altitude: fuse the (precise but uncalibrated) barometer with the (absolute but
        //     noisy) GPS height. baro gives the smooth profile, GPS anchors it slowly. ---
        let baroReady = false;     // native pressure sensor delivering data
        let baroAlt = null;        // barometric altitude (m, uncalibrated absolute)
        let altOffset = null;      // slow EMA of (ref − baroAlt) → calibrates the baro to the absolute anchor (DEM, else GPS)
        let fusedAlt = null;       // current best altitude (m) shown + stored
        let demElev = null;        // live terrain elevation (DEM/Open-Meteo, m MSL) at our position — the absolute anchor
        let demElevKey = null;     // grid cell of the last DEM lookup (skip redundant calls)
        let demElevBusy = false;   // a DEM lookup is in flight
        let lastGpsAlt = null;     // most recent non-null GPS altitude (fallback anchor when DEM unavailable/offline)

        const $ = id => document.getElementById(id);
        const elToggle = $('trk-toggle');
        const elTime = $('hud-time');
        const elAcc = $('gps-acc');
        const elSrc = $('gps-src');
        const elStatus = $('trk-status');
        const elGps = $('gps-dot');
        const elGpsLabel = $('gps-label');

        // Mount the shared fixed-slot clock so the ticking timer never jitters.
        // Size comes from the #hud-time --cc-size rule; colours are set here.
        CyberClock.mount(elTime, {
            digitColor: 'var(--cfg-clock-color, #fff)',   // live-config: Solita "mach die Uhr gruen" → clockColor
            colonColor: 'rgba(255, 255, 255, 0.55)',
            seconds: true,
        });
        CyberClock.set(elTime, '00:00:00');

        // HUD stat tiles (DISTANCE / SPEED / HÖHE) → js/tracker-hud.js. Owns the fixed-slot widgets +
        // adaptive distance unit. Destructured into the same names so every existing call site stays
        // unchanged. Constructed HERE (before the idle clock below) so updateDistVisibility is assigned
        // before tickIdleClock first calls it — a later const would hit the TDZ.
        const Hud = TrackerHud({ isIdle: () => trkState === 'idle', navActive });
        const { setDist, setSpeed, setAlt, updateDistVisibility } = Hud;

        // Idle clock: when NOT recording and NOT navigating, the top clock shows the real wall-clock time
        // instead of a frozen 00:00:00. While recording it shows the track duration (updateDuration), while
        // paused the frozen duration stays, and during navigation it's left as-is — this tick only acts in
        // the genuine idle state. Runs once a second alongside (but independent of) the recording timer.
        function navActive() { return !!(__nav && __nav.hasDestination && __nav.hasDestination()); }
        function tickIdleClock() {
            updateDistVisibility(); // catch nav start/stop (which don't route through setTrkState)
            if (trkState !== 'idle' || navActive()) return; // recording/paused/navigating own the display
            const d = new Date(), pad = (n) => String(n).padStart(2, '0');
            CyberClock.set(elTime, `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
        }
        tickIdleClock();                       // show the time immediately on load
        setInterval(tickIdleClock, 1000);

        setDist(0); setSpeed(0); setAlt(null); updateDistVisibility(); // 🧍 mode-icon updates on the first GPS fix — calling
        // updateModeIcon() here would hit the TDZ (its consts MODE_ICON/ActRec are declared further down)

        function setStatus(msg) { if (elStatus) elStatus.textContent = msg; } // status line removed — guard-safe no-op

        function setGpsState(hasFix) {
            // dot + POSITION label were removed → guard-safe no-op (kept so callers don't break)
            if (!elGps) return;
            const c = hasFix ? COL_GREEN : 'rgba(255, 255, 255, 0.3)';
            elGps.style.background = c;
            elGps.style.color = c; // drives the dot glow (box-shadow uses currentColor)
            if (elGpsLabel) elGpsLabel.style.color = hasFix ? COL_GREEN : 'rgba(255, 255, 255, 0.55)';
        }
        setGpsState(false);

        // Colour the accuracy number by quality: green < 10 m, orange 10–50 m, red worse.
        // (50 m is also the cutoff above which a fix is too noisy to record into the track.)
        function accColor(acc) {
            if (acc == null) return 'rgba(255, 255, 255, 0.6)';
            if (acc < 10) return COL_GREEN;
            if (acc <= 50) return COL_ORANGE;
            return COL_RED;
        }

        // Fade the red position dot in (it starts hidden via CSS)
        function showDot() {
            const el = posMarker && posMarker.getElement && posMarker.getElement();
            if (el) el.classList.add('pos-shown');
        }

        // ---------------------------------------------------------------
        // Geometry helpers
        // ---------------------------------------------------------------
        // Distance helper — shared implementation lives in track-render.js (single source).
        const haversine = TrackRender.haversine;

        // Compass bearing in degrees (0–360, clockwise from north) for point a → b.
        function bearingBetween(lat1, lon1, lat2, lon2) {
            const r = Math.PI / 180;
            const la1 = lat1 * r, la2 = lat2 * r, dLon = (lon2 - lon1) * r;
            const y = Math.sin(dLon) * Math.cos(la2);
            const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
            return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        }

        function fmtDuration(ms) {
            const s = Math.floor(ms / 1000);
            const hh = Math.floor(s / 3600);
            const mm = Math.floor((s % 3600) / 60);
            const ss = s % 60;
            const pad = n => String(n).padStart(2, '0');
            return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
        }

        function updateDuration() {
            if (startTime) CyberClock.set(elTime, fmtDuration(Date.now() - startTime));
        }

        // ---------------------------------------------------------------
        // Position handling
        // ---------------------------------------------------------------
        // Draw / move the current-position marker, accuracy circle and HUD readout.
        // Shared by live tracking and the one-shot "centre" locate.
        function renderPosition(here, accuracy, holdPos) {
            // Fixed-pixel dot via circleMarker — keeps its size at every zoom level.
            // (An L.circle would use metres and balloon when zooming in.)
            if (!posMarker) {
                posMarker = L.circleMarker(here, {
                    radius: 7, color: '#fff', weight: 2,
                    fillColor: COL_RED, fillOpacity: 1,
                    className: 'pos-marker',
                }).addTo(map);
            } else if (!holdPos) {
                posMarker.setLatLng(here); // hold the dot steady when the gate says we're standing still
            }

            elAcc.innerHTML = accuracy != null ? '±<span class="sat-n">' + Math.round(accuracy) + '</span> m' : '±<span class="sat-n">–</span> m';
            elAcc.style.color = accColor(accuracy);
            // Native app: the real GnssStatus listener owns the source label. Only the web
            // falls back to the accuracy heuristic here.
            if (!gnssActive) elSrc.textContent = sourceLabel(accuracy);
            setGpsState(true);
        }

        // ---- travel-direction triangle ----
        // A small triangle at the position dot, rotated to the heading; shown only while moving.
        // Created once, then later fixes just move it + update its CSS rotation (no flicker).
        const HEADING_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 L18 18 L6 18 Z"/></svg>';
        function setHeading(here, bearing, show) {
            if (!show || bearing == null || isNaN(bearing)) {
                if (headingMarker) { map.removeLayer(headingMarker); headingMarker = null; }
                return;
            }
            if (!headingMarker) {
                const icon = L.divIcon({
                    className: 'heading-icon',
                    html: '<div class="heading-arrow">' + HEADING_SVG + '</div>',
                    iconSize: [40, 40], iconAnchor: [20, 20],
                });
                headingMarker = L.marker(here, { icon, interactive: false, keyboard: false }).addTo(map);
            } else {
                headingMarker.setLatLng(here);
            }
            const el = headingMarker.getElement();
            if (el) { const a = el.querySelector('.heading-arrow'); if (a) a.style.transform = 'rotate(' + bearing + 'deg)'; }
        }

        // The web Geolocation API hides the fix source — infer it from accuracy (heuristic).
        // The real provider (gps/network/fused) is only available in the native app.
        function sourceLabel(acc) {
            if (acc == null) return '';
            if (acc <= 15) return 'GPS';     // only GNSS is this precise
            if (acc <= 150) return 'WLAN';
            return 'FUNK';                    // cell tower / IP
        }

        function updateGpsReal(accuracy) {
            // Real GPS fix? Native sats in use, or an accuracy only GNSS reaches (≤15 m — the same
            // threshold sourceLabel() calls 'GPS'). Gates the travel-mode icon: in WLAN/cell the
            // speed (and thus the guessed mode) is unreliable → no icon at all.
            gpsReal = (gnssLatest && gnssLatest.used > 0) || (accuracy != null && accuracy <= 15);
            updateModeIcon(); // reflect the source immediately (also on rejected/teleport fixes)
        }

        function computeMovementGate(speed, accuracy, here) {
            // Movement gate: does the accelerometer confirm we actually move? If the sensor
            // says "still", GPS jitter is suppressed (no points, speed 0, dot + map held).
            // BUT a vehicle at steady cruise has almost no dynamic acceleration, so the sensor
            // can wrongly read "still" mid-drive. The gate's only job is to kill GPS jitter while
            // genuinely stopped (where GPS speed ≈ 0), so let a clear GPS speed override it: above
            // SPEED_MOVE_KMH (with usable accuracy) we trust GPS and keep recording. Then it only
            // suppresses true standstill — a red light, not the open road.
            const gpsKmh = (speed != null && speed >= 0) ? speed * 3.6 : null;
            const gpsMoving = gpsKmh != null && gpsKmh > SPEED_MOVE_KMH && (accuracy == null || accuracy <= MAX_ACC_M);
            const sensorStill = motionReady && motionStill && !gpsMoving;
            // POSITION deadband — ALWAYS on (sensor or not): a fix that stays within the GPS error
            // circle of the shown dot is noise, not motion → hold. This catches the case where the
            // accelerometer says "still" (e≈0) but the GPS speed-override (gpsMoving) wrongly fires on
            // an indoor phantom speed, AND the no-sensor (desktop/WLAN) standstill drift. A real move
            // (> band) still snaps through; sub-accuracy "movement" stays invisible (WLAN can't resolve it).
            let posStill = false;
            if (posMarker) {
                const shown = posMarker.getLatLng();
                const band = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
                posStill = haversine([shown.lat, shown.lng], here) <= band;
            }
            const still = sensorStill || posStill;
            return { gpsKmh, still };
        }

        function renderInitialFix(here, accuracy, still) {
            const firstFix = !posMarker;
            renderPosition(here, accuracy, still && !firstFix);
            showDot();
            if (firstFix) map.setView(here, 17); // snap to the very first fix
            return firstFix;
        }

        function updateFuelLayer(here) {
            // Ambient, position-driven layer: nearby fuel-station prices. Runs on EVERY fix —
            // BEFORE the recording accuracy gate below — because its 5 km search radius doesn't
            // need a ≤ MAX_ACC_M fix (a coarse WLAN/IP browser fix is plenty). It has its own
            // 3 min / 2 km throttle, so this can't spam Tankerkönig. The track recording itself
            // stays strict at MAX_ACC_M; only the fuel layer is exempt. (Was below the gate, so it
            // never ran in a desktop browser where geolocation accuracy is worse than 50 m.)
            if (__fuel) __fuel.update(here);
        }

        function rejectNoisyFix(accuracy, still) {
            // Reject noisy fixes for the recorded track
            if (accuracy != null && accuracy > MAX_ACC_M) {
                setStatus(`Warte auf besseres Signal … (±${Math.round(accuracy)} m)`);
                updateMotionDbg(accuracy, MIN_MOVE_M, still);
                return true;
            }
            return false;
        }

        function rejectTeleportFix(latitude, longitude, here, now, still, accuracy) {
            // Drop GPS "teleports": the first fix is often a coarse WLAN/cell guess; when the real
            // GPS fix lands the position leaps km in seconds → an absurd speed (962 km/h!) and a
            // bogus track leg. If a fix implies an impossible ground speed from the previous one,
            // re-baseline on it but ignore the jump itself (no speed, no point, no distance).
            if (lastFix) {
                const jdt = (now - lastFix.t) / 1000;
                const jumpKmh = jdt > 0 ? (haversine([lastFix.lat, lastFix.lng], here) / jdt) * 3.6 : Infinity;
                if (jumpKmh > MAX_JUMP_KMH) {
                    lastFix = { lat: latitude, lng: longitude, t: now }; // trust the new fix as the baseline
                    shownSpeed = 0; setSpeed(0);
                    if (following && !still) map.panTo(here, { animate: true });
                    updateMotionDbg(accuracy, MIN_MOVE_M, still);
                    return true;
                }
            }
            return false;
        }

        function updateAltitudePhase(pos, here) {
            // Altitude: fuse the precise barometer profile with the absolute anchor (DEM terrain, else GPS).
            updateDemElev(here);
            updateAltitude(pos.coords.altitude != null ? pos.coords.altitude : null);
        }

        function computeAndDisplaySpeed(speed, here, now, still) {
            // Speed display DECOUPLED from the recording gate (BUG-1). The gate only exists to
            // suppress position jitter while genuinely stopped, but it ALSO nulled the km/h readout
            // while slowly walking inside the accuracy band → the "0.0 / 1.7" flicker Doc saw. GPS
            // Doppler (coords.speed) measures velocity directly and is correct even inside that band,
            // so we trust it regardless of `still`. Only with NO Doppler do we fall back to the old
            // gated distance/time estimate → regression-free on devices that give no Doppler.
            let kmh = 0;
            let spdSrc;
            if (speed != null && speed >= 0) {
                kmh = speed * 3.6;              // raw GPS Doppler — independent of the gate
                spdSrc = 'dop';
            } else if (!still && lastFix) {
                const dt = (now - lastFix.t) / 1000;
                if (dt > 0) kmh = (haversine([lastFix.lat, lastFix.lng], here) / dt) * 3.6;
                spdSrc = 'calc';               // no Doppler → derived from distance/time (gated, as before)
            } else {
                spdSrc = 'gate0';              // no Doppler and gate says still → 0
            }
            if (kmh > MAX_JUMP_KMH) kmh = 0;   // a device-reported nonsense speed → ignore
            const rawKmh = kmh;                // pre-floor value — shown in the debug so standstill noise stays visible
            // Doppler can report a noisy 1–2 km/h at standstill; snap sub-walking-pace to 0 so a
            // parked readout stays a clean 0 instead of jittering. Tune SPEED_ZERO_KMH if needed.
            if (kmh < SPEED_ZERO_KMH) kmh = 0;
            shownSpeed = 0.6 * shownSpeed + 0.4 * kmh; // light EMA; no hard gate-kill anymore
            setSpeed(shownSpeed);
            // Interesting bits into the EXISTING debug surfaces (no new element):
            //  • live in the #motion-dbg bar: source + raw→shown km/h (see updateMotionDbg).
            //  • once in the DebugWindow: whether THIS device delivers coords.speed at all.
            spdDbg = 'spd:' + spdSrc + '=' + rawKmh.toFixed(1) + '→' + shownSpeed.toFixed(1);
            if (!dopplerLogged && gpsReal && window.DebugWindow) {
                dopplerLogged = true;
                DebugWindow.log(speed != null
                    ? 'BUG-1 Speed: coords.speed ✓ (' + (speed * 3.6).toFixed(1) + ' km/h Doppler) → Anzeige entkoppelt'
                    : 'BUG-1 Speed: coords.speed = null → Distanz/Zeit-Fallback');
            }
            updateModeIcon(); // keep the mode glyph (left of the clock) current
        }

        function computeBearing(hdg, gpsKmh, here, latitude, longitude) {
            // Travel direction: prefer the GPS heading; else the bearing of the last real step.
            // Only while moving → a triangle at the dot rotated to the course (hidden when still).
            let bearing = null;
            if (hdg != null && !isNaN(hdg) && (gpsKmh == null || gpsKmh > 1)) bearing = hdg;
            else if (lastFix && haversine([lastFix.lat, lastFix.lng], here) >= MIN_MOVE_M) {
                bearing = bearingBetween(lastFix.lat, lastFix.lng, latitude, longitude);
            }
            return bearing;
        }

        function recordTrackPoint(here, accuracy, now, still) {
            // Adaptive minimum step: within the GPS error circle everything is noise, so require
            // a move bigger than a fraction of the accuracy — never below MIN_MOVE_M. Each recorded
            // point carries its altitude (m) + speed (km/h) for the later elevation/speed profile.
            const minStep = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
            const stamp = new Date(now).toISOString();
            const altVal = fusedAlt != null ? Math.round(fusedAlt * 10) / 10 : null;
            const spdVal = Math.round(shownSpeed * 10) / 10;
            const actVal = effectiveActivity();
            const ptsBefore = track.length;
            if (track.length === 0) {
                track.push(here); times.push(stamp); alts.push(altVal); speeds.push(spdVal); activities.push(actVal); redrawTrack();
            } else if (!still) {
                const step = haversine(track[track.length - 1], here);
                if (step >= minStep) {
                    totalDist += step;
                    track.push(here); times.push(stamp); alts.push(altVal); speeds.push(spdVal); activities.push(actVal); redrawTrack();
                }
            }
            if (track.length !== ptsBefore) {
                if (typeof TrackBuffer !== 'undefined') TrackBuffer.save(bufferSnapshot());
                scheduleSync(); // Stage 2: push to the cloud on the fly
                if (liveOn) broadcastLive(); // Stage 3: live position to viewers
            }
            setDist(totalDist);
            return { minStep };
        }

        function updateLastFix(latitude, longitude, now) {
            lastFix = { lat: latitude, lng: longitude, t: now };
        }

        function updateAutoFollow(here, still) {
            if (following && !still) { // auto-follow: pan to the dot; zoom by SPEED — but NOT in
                // 'remaining' FIT mode, where the remaining-route fit (below) owns the zoom so the two
                // don't fight over it (note #9).
                const tz = (fitMode === 'remaining') ? null : speedZoom(shownSpeed);
                if (tz != null && Math.abs(map.getZoom() - tz) >= 1 && Date.now() - lastAutoZoom > AUTOZOOM_COOLDOWN) {
                    lastAutoZoom = Date.now();
                    map.setView(here, tz, { animate: true }); // pan + zoom together
                } else {
                    map.panTo(here, { animate: true });
                }
            }
        }

        function updateFitMode(here) {
            // FIT mode (3-state): 'all' keeps the WHOLE track in view; 'remaining' keeps the rest of the
            // route ahead in view AND tightens the zoom as the rest shrinks (note #9). The remaining
            // re-fit is BIDIRECTIONAL with hysteresis + cooldown so it can't flutter: zoom OUT when the
            // rest spills past the frame (-0.12 slack), zoom IN when it sits well inside (-0.40 inset →
            // only when there's lots of empty margin). Tune the two insets if it tightens too late/eager.
            if (fitMode === 'all' && track.length > 1) {
                const tb = L.latLngBounds(track);
                if (!map.getBounds().pad(-0.12).contains(tb)) { try { map.fitBounds(tb, { padding: fitPad() }); } catch (e) { } }
            } else if (fitMode === 'remaining' && __nav && __nav.remainingBounds) {
                const rb = __nav.remainingBounds(here);
                if (rb && Date.now() - lastAutoZoom > AUTOZOOM_COOLDOWN) {
                    const v = map.getBounds();
                    const grew = !v.pad(-0.12).contains(rb);   // rest spilled out of the frame → zoom OUT
                    const shrank = v.pad(-0.40).contains(rb);  // rest sits in the inner margin → zoom IN
                    if (grew || shrank) { lastAutoZoom = Date.now(); try { map.fitBounds(rb, { padding: fitPad() }); } catch (e) { } }
                }
            }
        }

        function updateNavigationAndDebug(here, still, accuracy, minStep) {
            refreshRecenter(); // show/hide the recenter button as needed
            if (__nav && __nav.update) __nav.update(here); // navigation: reroute if we drifted off the line
            if (__speed) __speed.update(here, still, shownSpeed); // speed-limit sign for the current road
            updateMotionDbg(accuracy, minStep, still);
            if (tracking) setStatus(`Aufzeichnung läuft … ${track.length} Punkte`);
        }

        function onPosition(pos) {
            const { latitude, longitude, accuracy, speed } = pos.coords;
            const now = pos.timestamp || Date.now();
            const here = [latitude, longitude];

            updateGpsReal(accuracy);                                          // Phase 1: source flag + mode icon
            const { gpsKmh, still } = computeMovementGate(speed, accuracy, here); // Phase 2: movement gate
            renderInitialFix(here, accuracy, still);                          // Phase 3: render marker + first-fix snap
            updateFuelLayer(here);                                            // Phase 4: ambient fuel layer (pre-gate)
            if (rejectNoisyFix(accuracy, still)) return;                      // Phase 5: drop low-accuracy fixes
            if (rejectTeleportFix(latitude, longitude, here, now, still, accuracy)) return; // Phase 6: drop teleports
            updateAltitudePhase(pos, here);                                   // Phase 7: barometer/DEM altitude fusion
            computeAndDisplaySpeed(speed, here, now, still);                  // Phase 8: speed (Doppler/calc) + EMA
            const bearing = computeBearing(pos.coords.heading, gpsKmh, here, latitude, longitude); // Phase 9: heading
            setHeading(here, bearing, !still && bearing != null);
            const { minStep } = recordTrackPoint(here, accuracy, now, still); // Phase 10: record point + sync/broadcast
            updateLastFix(latitude, longitude, now);                          // Phase 11: re-baseline (every accepted fix)
            updateAutoFollow(here, still);                                    // Phase 12: auto-follow pan/zoom
            updateFitMode(here);                                              // Phase 13a: FIT-mode re-fit
            updateNavigationAndDebug(here, still, accuracy, minStep);         // Phase 13b: nav + speed-sign + debug + status
        }

        function onError(err) {
            const messages = {
                1: 'Standortzugriff verweigert. Bitte in den Einstellungen erlauben.',
                2: 'Position nicht verfügbar (kein GPS-Signal).',
                3: 'Zeitüberschreitung beim Standort.',
            };
            setStatus(messages[err.code] || ('Fehler: ' + err.message));
        }

        // ---------------------------------------------------------------
        // Geolocation source — prefer the native background plugin (Capacitor)
        // so recording continues with the screen off; fall back to the browser
        // API on the web. In a plain browser window.Capacitor is undefined, so
        // this whole block is a no-op and the web behaviour is unchanged.
        // ---------------------------------------------------------------
        const BgGeo = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.BackgroundGeolocation) || null;
        const useNativeGeo = !!(BgGeo && Capacitor.isNativePlatform && Capacitor.isNativePlatform());

        function startGeoWatch(onPos, onErr) {
            if (useNativeGeo) {
                // addWatcher returns a Promise<string> (the watcher id)
                return BgGeo.addWatcher(
                    {
                        backgroundTitle: 'Doc Alvers Tracker',
                        backgroundMessage: 'Aufzeichnung läuft …',
                        requestPermissions: true,
                        stale: false,
                        distanceFilter: 0,
                    },
                    (location, error) => {
                        if (error) {
                            onErr({ code: error.code === 'NOT_AUTHORIZED' ? 1 : 2, message: error.message || '' });
                            return;
                        }
                        // adapt the plugin's location shape to the W3C Geolocation shape
                        onPos({
                            coords: {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                accuracy: location.accuracy,
                                speed: location.speed,
                                altitude: location.altitude,
                            },
                            timestamp: location.time || Date.now(),
                        });
                    }
                );
            }
            return navigator.geolocation.watchPosition(onPos, onErr, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            });
        }

        function stopGeoWatch(id) {
            if (id == null) return;
            if (useNativeGeo) Promise.resolve(id).then(realId => BgGeo.removeWatcher({ id: realId }));
            else navigator.geolocation.clearWatch(id);
        }

        // ---------------------------------------------------------------
        // Start / Stop
        // ---------------------------------------------------------------
        // ---------------------------------------------------------------
        // Movement gate — the accelerometer (DeviceMotion) tells "standing
        // still" from "moving", so GPS jitter can't fake phantom motion.
        // Works on web + native while the screen is on. No sensor (desktop)
        // → motionReady stays false and the gate is simply inactive.
        // ---------------------------------------------------------------
        function onDeviceMotion(e) {
            let ax, ay, az;
            const acc = e.acceleration;
            if (acc && acc.x != null) {            // gravity already removed
                ax = acc.x; ay = acc.y; az = acc.z;
            } else {
                const g = e.accelerationIncludingGravity;
                if (!g || g.x == null) return;
                _grav.x = 0.8 * _grav.x + 0.2 * g.x; // low-pass ≈ gravity, subtract for the dynamic part
                _grav.y = 0.8 * _grav.y + 0.2 * g.y;
                _grav.z = 0.8 * _grav.z + 0.2 * g.z;
                ax = g.x - _grav.x; ay = g.y - _grav.y; az = g.z - _grav.z;
            }
            const mag = Math.sqrt(ax * ax + ay * ay + az * az);
            motionEnergy = 0.8 * motionEnergy + 0.2 * mag;
            motionReady = true;
            if (motionStill && motionEnergy > MOTION_MOVE) motionStill = false;
            else if (!motionStill && motionEnergy < MOTION_STILL) motionStill = true;
        }
        function enableMotion() {
            if (typeof DeviceMotionEvent === 'undefined') return;
            // iOS 13+ needs an explicit permission, triggered here from the START gesture
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then(s => { if (s === 'granted') window.addEventListener('devicemotion', onDeviceMotion); })
                    .catch(() => { });
            } else {
                window.addEventListener('devicemotion', onDeviceMotion);
            }
        }
        function disableMotion() {
            window.removeEventListener('devicemotion', onDeviceMotion);
            motionReady = false; motionStill = true; motionEnergy = 0;
        }
        // Tiny tuning readout (Arial per debug convention) — remove once thresholds are dialed in.
        function updateMotionDbg(acc, minStep, still) {
            const el = $('dbg-motion');
            if (!el) return;
            const base = motionReady
                ? (still ? 'STILL' : 'MOVE') + ' · e=' + motionEnergy.toFixed(2) + ' · step > ' + minStep.toFixed(1) + 'm'
                : (still ? 'HALT·band' : 'frei') + ' · kein Sensor · step > ' + minStep.toFixed(1) + 'm';
            el.textContent = spdDbg ? base + ' · ' + spdDbg : base; // BUG-1: append the speed-source readout
        }

        // ---------------------------------------------------------------
        // Altitude — barometer (native Baro plugin) fused with GPS height.
        // Browser / no barometer → GPS altitude only (rougher). The barometer
        // gives the smooth relative profile; GPS slowly calibrates the absolute.
        // ---------------------------------------------------------------
        function renderAltitude() {
            if (demOn) {
                const A = effectiveAlts();
                let last = null;
                for (let i = A.length - 1; i >= 0; i--) { if (A[i] != null) { last = A[i]; break; } }
                setAlt(last);
            } else {
                setAlt(fusedAlt);
            }
        }
        // Live terrain elevation (DEM, Open-Meteo via track-dem.js) — the ABSOLUTE anchor for altitude:
        // true MSL height, noise-free, no GPS geoid offset (Doc 2026-06-18). Cheap: track-dem caches per
        // ~90 m grid cell → staying in a cell makes NO network call; only a new cell triggers one lookup.
        function updateDemElev(here) {
            if (!here || !window.TrackDem) return;
            const k = Math.round(here[0] * 1000) + ',' + Math.round(here[1] * 1000);
            if (demElevBusy || (k === demElevKey && demElev != null)) return;
            demElevBusy = true;
            TrackDem.elevations([here]).then(function (arr) {
                if (arr && arr.length && arr[0] != null) { demElev = arr[0]; demElevKey = k; updateAltitude(null); }
            }).catch(function () { }).finally(function () { demElevBusy = false; });
        }

        function updateAltitude(gpsAlt) {
            if (gpsAlt != null) lastGpsAlt = gpsAlt;
            // Anchor preference: DEM (MSL, noise-free) → live GPS → last known GPS.
            const ref = (demElev != null) ? demElev : (gpsAlt != null ? gpsAlt : lastGpsAlt);
            if (baroReady && baroAlt != null) {
                if (ref != null) {
                    const diff = ref - baroAlt;
                    altOffset = (altOffset == null) ? diff : (0.95 * altOffset + 0.05 * diff);
                }
                fusedAlt = (altOffset != null) ? baroAlt + altOffset : baroAlt;
            } else {
                fusedAlt = ref; // no barometer (idle / web) → DEM terrain height, else GPS fallback (may be null)
            }
            renderAltitude();
        }

        const Baro = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Baro) || null;
        let baroListenerAdded = false;
        function startBaro() {
            if (!Baro) return; // web / no plugin → GPS-only altitude
            if (!baroListenerAdded) {
                Baro.addListener('baro', (d) => {
                    if (!d || d.altitude == null) return;
                    baroReady = true;
                    baroAlt = d.altitude;
                    fusedAlt = (altOffset != null) ? baroAlt + altOffset : baroAlt;
                    renderAltitude();
                });
                baroListenerAdded = true;
            }
            Baro.start().catch(() => { }); // resolves {available:false} on phones without a barometer
        }
        function stopBaro() { if (Baro) Baro.stop().catch(() => { }); }

        // ---- Track lifecycle: idle → recording → paused → (finish) idle ----
        // Buttons: idle [START] · recording [STOP=pause] · paused [CONTINUE | STOP=finish+save].
        function setTrkState(s) {
            trkState = s;
            tracking = (s === 'recording');
            updateDistVisibility(); // idle (& not navigating) → hide DISTANCE; recording/paused → show it
            const tg = $('trk-toggle'), fin = $('trk-finish'), disc = $('trk-discard');
            if (disc) disc.style.display = (s === 'paused') ? 'inline-flex' : 'none';
            if (s === 'idle') {
                tg.textContent = 'START'; tg.style.background = COL_GREEN; fin.style.display = 'none';
            } else if (s === 'recording') {
                tg.textContent = 'PAUSE'; tg.style.background = COL_RED; fin.style.display = 'none';
            } else { // paused → continue or save
                tg.textContent = 'CONTINUE'; tg.style.background = COL_GREEN; tg.style.color = '#fff';
                fin.textContent = 'SPEICHERN'; fin.style.background = 'rgb(245, 194, 66)'; fin.style.color = '#fff';
                fin.style.display = 'inline-flex';
            }
        }

        // Shared startup of the live watch + sensors (does NOT touch startTime → caller sets it).
        function startWatch() {
            stopAmbient(); // recording's own watch (onPosition) takes over the idle live-follow
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            tracking = true;
            timerId = setInterval(updateDuration, 1000);
            watchId = startGeoWatch(onPosition, onError); // native background plugin if available, else web
            startGnss();     // native: real GnssStatus
            startActivity(); // native travel-mode detection
            enableMotion();  // accelerometer movement gate
            startBaro();     // native barometer → altitude
        }

        // ---- Idle live-follow ------------------------------------------------------------------
        // When NOT recording (and not navigating), keep a lightweight foreground position watch so the
        // dot tracks you and the map follows — like a maps app. Stops automatically while recording
        // (onPosition owns the watch then). Foreground only (navigator.geolocation, same as the initial
        // acquire) — NOT the background plugin, so there's no "Aufzeichnung läuft" notification when idle.
        const AMBIENT_PAN_M = 12; // only re-centre once the dot moved this far → no GPS-jitter jiggle
        // Idle ambient temperature → the freed DISTANCE tile shows the current °C while idle (Doc
        // 2026-06-19). Open-Meteo's keyless forecast API (same provider as the DEM elevation lookup),
        // throttled like the fuel layer (≥ 10 min OR ≥ 3 km moved) so it stays gentle. Offline / error
        // → keep the last value silently. Only fetched here in ambientOnPos, i.e. only while idle.
        const TEMP_REFRESH_MS = 600000; // 10 min
        const TEMP_REFRESH_M = 3000;    // or once we've moved 3 km
        let tempBusy = false, lastTempFetch = 0, lastTempLat = null, lastTempLng = null;
        async function updateAmbientTemp(here) {
            if (tempBusy || !here) return;
            const lat = here[0], lng = here[1];
            if (typeof lat !== 'number' || typeof lng !== 'number') return;
            const moved = (lastTempLat == null) ? Infinity : haversine([lastTempLat, lastTempLng], here);
            if (moved < TEMP_REFRESH_M && (Date.now() - lastTempFetch) < TEMP_REFRESH_MS) return;
            tempBusy = true;
            try {
                const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat.toFixed(4) +
                    '&longitude=' + lng.toFixed(4) + '&current=temperature_2m';
                const r = await fetch(url);
                const d = await r.json().catch(() => null);
                const t = d && d.current && typeof d.current.temperature_2m === 'number' ? d.current.temperature_2m : null;
                if (t != null) { Hud.setTemp(t); lastTempFetch = Date.now(); lastTempLat = lat; lastTempLng = lng; }
            } catch (e) { /* offline / rate-limited → keep the last reading */ }
            finally { tempBusy = false; }
        }

        function ambientOnPos(pos) {
            if (!pos || !pos.coords || pos.coords.latitude == null) return;
            const here = [pos.coords.latitude, pos.coords.longitude];
            const now = Date.now();
            const accuracy = pos.coords.accuracy;
            const sp = pos.coords.speed;

            // Jitter guard, idle edition — the SAME movement gate the recording path uses (note the
            // accelerometer now also runs while idle, see startAmbient). A phone resting on a table
            // must NOT have its dot dance around: if the accelerometer says "still" (and GPS isn't
            // clearly moving), or the new fix sits inside the GPS error circle of the shown dot, we
            // HOLD the dot + skip the map pan. A real move (sensor energy, or a step beyond the band)
            // snaps straight through.
            const gpsKmh = (sp != null && sp >= 0) ? sp * 3.6 : null;
            const gpsMoving = gpsKmh != null && gpsKmh > SPEED_MOVE_KMH && (accuracy == null || accuracy <= MAX_ACC_M);
            const sensorStill = motionReady && motionStill && !gpsMoving;
            let posStill = false;
            if (posMarker) {
                const shown = posMarker.getLatLng();
                const band = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
                posStill = haversine([shown.lat, shown.lng], here) <= band;
            }
            const firstFix = !posMarker;
            const still = (sensorStill || posStill) && !firstFix;

            // Live speedometer while idle: ONLY the GPS Doppler (coords.speed) — the velocity the
            // receiver actually measures. No distance/time fallback: on a device without Doppler
            // (desktop / coarse WLAN, ±35 m) the jitter between fixes would fake 20+ km/h on a desk.
            // No Doppler → 0. Same floor/EMA as the recording path.
            let kmh = (sp != null && sp >= 0) ? sp * 3.6 : 0;
            if (kmh > MAX_JUMP_KMH || kmh < SPEED_ZERO_KMH || still) kmh = 0; // standing → a clean 0
            // Snap HARD to 0 when there's no movement — the EMA alone only decays (0.6·old) and gets
            // stuck around 0,1 km/h on WLAN/standstill (the irritating residual Doc saw). Smooth only
            // real motion upward.
            shownSpeed = (kmh === 0) ? 0 : (0.6 * shownSpeed + 0.4 * kmh);
            setSpeed(shownSpeed);
            // TEMP idle-gate diagnostics → existing #motion-dbg bar (Doc has DEBUG open). Shows whether
            // the accelerometer is live (STILL/MOVE + e=), the raw Doppler, and the gated speed.
            spdDbg = 'idle dop=' + (sp != null ? (sp * 3.6).toFixed(1) : 'null') + ' still=' + (still ? '1' : '0') + '→' + shownSpeed.toFixed(1);
            updateMotionDbg(accuracy, Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR), still);
            lastFix = { lat: here[0], lng: here[1], t: now };
            renderPosition(here, accuracy, still); // hold the dot steady when the gate says we stand
            showDot();
            // Idle altitude (no barometer here): show the DEM terrain height directly → no more „−".
            updateDemElev(here);
            updateAltitude(pos.coords.altitude != null ? pos.coords.altitude : null);
            updateAmbientTemp(here); // idle-only: current temperature in the (otherwise distance) tile
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; } // initial one-shot now redundant
            if (following && !handMode && !still) {
                const moved = map.distance(map.getCenter(), L.latLng(here));
                if (moved > AMBIENT_PAN_M) map.panTo(here, { animate: true });
            }
            refreshRecenter();
        }
        function startAmbient() {
            if (ambientId != null || watchId != null) return;     // already on, or recording owns the watch
            if (!('geolocation' in navigator)) return;
            following = true; refreshRecenter();                  // idle follows by default (Maps-style; CENTER/drag still toggle it)
            enableMotion();                                       // accelerometer also in idle → jitter guard works on the resting dot
            ambientId = navigator.geolocation.watchPosition(ambientOnPos, () => { },
                { enableHighAccuracy: true, maximumAge: 2000, timeout: 12000 });
        }
        function stopAmbient() {
            if (ambientId == null) return;
            try { navigator.geolocation.clearWatch(ambientId); } catch (e) { }
            ambientId = null;
        }

        // START (idle): a brand-new track. The previous (finished+saved) one is cleared from view.
        async function beginTracking() {
            if (!('geolocation' in navigator)) { setStatus('Dieser Browser unterstützt keine Standortbestimmung.'); return; }
            if (!window.isSecureContext) { setStatus('GPS braucht HTTPS oder localhost. Über file:// gibt es keine Position.'); return; }
            // A track is on screen (loaded or just finished) → don't wipe the VIEW without asking.
            // (It stays safe in the cloud / LADEN — START only clears the screen, it never deletes a row.)
            if (track.length && !(await uiConfirm('Neuen Track starten? Der angezeigte Track verschwindet nur aus der Ansicht und bleibt gespeichert.', { okText: 'Neu starten' }))) return;
            clearTrack(true); // silent — the displayed track was loaded/saved; START begins fresh
            currentTrackId = null; currentTrackName = autoTrackName(); // fresh live track; name from start (autosync + finish reuse it)
            startTime = Date.now();
            startWatch();
            $('hud-top').classList.add('shown'); // reveal the header on first start
            if (window.RainRadar && RainRadar.setShifted) RainRadar.setShifted(true); // drop the rain slider below the HUD
            setTrkState('recording');
            setStatus('Suche GPS-Signal …');
            if (__nav && __nav.hasDestination()) {
                // Navigation start: show the WHOLE route first (overview, like the framed map), hold it a
                // beat, THEN glide into the crosshair follow-view (centerOnPosition's flyTo = the fade).
                // following stays OFF during the hold so an incoming GPS fix can't yank the map off it.
                cancelNavOverview();
                fitMode = false;     // a leftover persistent FIT mode would re-fit every GPS fix → kill the glide
                setFollowing(false);
                if (window.DebugWindow) DebugWindow.log('NAV start: following→false, fitMode→false, computing route …');
                __nav.startNavigation().then(function (ok) {
                    if (window.DebugWindow) DebugWindow.log('NAV route resolved ok=' + ok);
                    if (ok === false) { setFollowing(true); return; }   // no route (e.g. offline) → just follow
                    const framed = __nav.frameRoute();                   // frame start → destination
                    if (window.DebugWindow) DebugWindow.log('NAV frameRoute=' + framed + ' → glide in ' + NAV_OVERVIEW_MS + 'ms');
                    navOverviewTimer = setTimeout(function () {
                        navOverviewTimer = null;
                        if (window.DebugWindow) DebugWindow.log('NAV glide fire: trkState=' + trkState + ' following=' + following);
                        if (trkState !== 'recording' || following) return;   // stopped, or user took over during the hold
                        // Dynamic route framing (Doc 2026-06-20, BUG-10): keep the REMAINING route in view and
                        // re-fit it as it shrinks, instead of a one-shot crosshair glide that never re-frames.
                        // From here the fitMode==='remaining' loop in onSuccess owns the camera (re-fit + zoom).
                        const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng();
                        const rb = (ll && __nav && __nav.remainingBounds) ? __nav.remainingBounds([ll.lat, ll.lng]) : null;
                        if (rb) {
                            fitMode = 'remaining'; setFollowing(false);
                            try { map.fitBounds(rb, { padding: fitPad(), animate: true, duration: 0.8 }); } catch (e) { }
                            refreshRecenter();
                            if (window.DebugWindow) DebugWindow.log('NAV → dynamic remaining-route fit');
                        } else {
                            centerOnPosition();   // no route geometry yet → fall back to the crosshair follow
                        }
                    }, NAV_OVERVIEW_MS);
                });
            } else {
                // No navigation → follow the moving position right away. Otherwise a restored viewport
                // (or a left-over hand-set view) leaves the GPS dot un-followed while you drive.
                centerOnPosition();
            }
        }

        // STOP while recording → pause (keep all data, freeze the timer).
        function pauseTracking() {
            cancelNavOverview(); // stopped during the route-overview hold → don't auto-glide afterwards
            pauseStart = Date.now();
            stopGeoWatch(watchId); watchId = null;
            stopActivity(); disableMotion(); stopBaro();
            if (timerId) clearInterval(timerId); timerId = null;
            setTrkState('paused');
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.saveNow(bufferSnapshot());
            doSync(); // Stage 2: flush to the cloud on pause
            setStatus(track.length ? `Pausiert · ${(totalDist / 1000).toFixed(2)} km` : 'Pausiert.');
            startAmbient(); // paused → resume idle live-follow so the dot keeps tracking you
        }

        // CONTINUE → resume the same track (don't count the pause as elapsed track time).
        function resumeTracking() {
            startTime += (Date.now() - pauseStart);
            startWatch();
            setTrkState('recording');
            setStatus('Aufzeichnung läuft …');
        }

        // STOP while paused → finish: auto-save the track, back to idle. Track stays drawn.
        async function finishTracking() {
            setTrkState('idle');
            startAmbient(); // back to idle → resume idle live-follow
            stopLive(true);
            if (__nav) __nav.clearRoute(); // STOP also clears the navigation route + destination pin
            if (__speed) __speed.clear();  // …and the speed-limit sign
            if (track.length >= 1) {
                const name = currentTrackName || autoTrackName();
                toast('Speichere …');
                try { currentTrackId = await saveTrack(name, 'done'); currentTrackName = name; if (typeof TrackBuffer !== 'undefined') await TrackBuffer.clear(); toast('Gespeichert: ' + name); }
                catch (e) { toast('Speichern fehlgeschlagen (lokal gesichert): ' + (e.message || e)); }
            } else {
                setStatus('Beendet.');
            }
        }

        $('trk-toggle').addEventListener('click', () => {
            if (__speed) __speed.unlockAudio(); // unlock the over-speed chime within this user gesture
            if (__compass) __compass.enable();  // start the compass (iOS needs this gesture for permission)
            if (trkState === 'idle') beginTracking();
            else if (trkState === 'recording') pauseTracking();
            else resumeTracking(); // paused
        });
        // VERWERFEN → throw the paused track away WITHOUT saving: stop, delete the autosynced
        // cloud row if one exists, wipe the crash buffer, reset the HUD, back to idle.
        // Destructive → confirm first.
        async function discardTracking() {
            if (!(await uiConfirm('Track verwerfen? Das lässt sich nicht rückgängig machen.', { danger: true, okText: 'Verwerfen' }))) return;
            setTrkState('idle');
            startAmbient(); // back to idle → resume idle live-follow
            stopLive(true);
            if (__nav) __nav.clearRoute(); // discard also clears the navigation route + destination pin
            if (__speed) __speed.clear();  // …and the speed-limit sign
            const id = currentTrackId;
            currentTrackId = null; currentTrackName = '';
            await clearTrack(true);
            setDist(0); setSpeed(0); setAlt(null); updateModeIcon(); // 0,0 → 🧍 (stehen) right away
            try { if (typeof TrackBuffer !== 'undefined') await TrackBuffer.clear(); } catch (e) { }
            if (id != null) { try { await removeTrack(id); } catch (e) { toast('Cloud-Löschen fehlgeschlagen: ' + (e.message || e)); } }
            toast('Track verworfen.');
        }
        $('trk-finish').addEventListener('click', () => { if (trkState === 'paused') finishTracking(); });
        $('trk-discard').addEventListener('click', () => { if (trkState === 'paused') discardTracking(); });
        setTrkState('idle');

        // Round-button labels: size the font by MEASURING the widest label (SPEICHERN/VERWERFEN…)
        // so it always fits the smaller circle — computed, not guessed; uniform; re-fit on resize.
        // Caps at the original font/diameter ratio so it never grows beyond design.
        const CONTROL_LABELS = ['START', 'PAUSE', 'CONTINUE', 'SPEICHERN', 'LÖSCHEN'];
        function fitControlText() {
            const btns = [$('trk-toggle'), $('trk-finish'), $('trk-discard')].filter(Boolean);
            if (!btns.length) return;
            const cs = getComputedStyle(btns[0]);
            const dia = parseFloat(cs.width);
            if (!dia) { const c = $('trk-controls'); if (c) c.classList.add('fitted'); return; }
            const border = parseFloat(cs.borderLeftWidth) || 0;
            const ls = parseFloat(cs.letterSpacing) || 0; // fixed px, size-independent
            const avail = dia - 2 * border - 2 * (dia * 0.12); // text chord minus side margin
            const ctx = fitControlText._ctx || (fitControlText._ctx = document.createElement('canvas').getContext('2d'));
            const REF = 100;
            ctx.font = '700 ' + REF + 'px ' + (cs.fontFamily || 'sans-serif');
            let need = Infinity;
            for (const lbl of CONTROL_LABELS) {
                const glyph = ctx.measureText(lbl).width;          // at REF px (no letter-spacing)
                const spacing = ls * Math.max(0, lbl.length - 1);  // px at final size
                const fs = (avail - spacing) * REF / glyph;        // px that makes this label = avail
                if (fs < need) need = fs;
            }
            const px = Math.max(7, Math.min(need, dia * 0.115) * 1.134); // cap = original ratio, +13.4% (Doc: +8%, then +5% more)
            btns.forEach(b => { b.style.fontSize = px.toFixed(1) + 'px'; });
            const ctrl = $('trk-controls'); if (ctrl) ctrl.classList.add('fitted'); // reveal — now sized, no flash
        }
        fitControlText();
        window.addEventListener('resize', () => {
            fitControlText();
            Hud.recenterAll();
        });

        // ---- Crash-proof live buffer (../js/track-buffer.js): persist the in-progress track on
        //      the fly so a close/kill/crash — or a failed offline save — never loses it. ----
        function bufferSnapshot() {
            return {
                v: 1, savedAt: Date.now(), currentTrackId: currentTrackId, name: currentTrackName, startTime: startTime, totalDist: totalDist,
                track: track, times: times, alts: alts, speeds: speeds, activities: activities,
                waypoints: waypoints.map(wpSer),
            };
        }
        function restoreBufferedTrack(buf) {
            if (trkState !== 'idle' || !buf || !Array.isArray(buf.track) || !buf.track.length) return;
            track = buf.track; times = buf.times || []; alts = buf.alts || [];
            speeds = buf.speeds || []; activities = buf.activities || []; totalDist = buf.totalDist || 0;
            currentTrackId = buf.currentTrackId || null; currentTrackName = buf.name || ''; // re-save UPDATES the same cloud row (no duplicate)
            (buf.waypoints || []).forEach(w => addWaypoint(w));
            redrawTrack();
            // show the recorded duration; arm pauseStart so CONTINUE doesn't count the closed gap
            const span = (times.length > 1) ? (Date.parse(times[times.length - 1]) - Date.parse(times[0])) : 0;
            startTime = Date.now() - (isFinite(span) && span > 0 ? span : 0);
            pauseStart = Date.now();
            updateDuration();
            setDist(totalDist);
            $('hud-top').classList.add('shown');
            if (window.RainRadar && RainRadar.setShifted) RainRadar.setShifted(true);
            setTrkState('paused'); // → CONTINUE | SPEICHERN
            try { if (track.length) map.fitBounds(L.latLngBounds(track), { padding: fitPad() }); } catch (e) { }
            TrackBuffer.saveNow(bufferSnapshot()); // keep it persisted across the restore
            toast('Ungesicherter Track wiederhergestellt: ' + track.length + ' Punkte. SPEICHERN nicht vergessen.');
        }
        const _importTok = new URLSearchParams(location.search).get('import');
        if (_importTok) {
            // A friend's "In meinen Tracker laden" link → import a copy. Strip the token first so a
            // reload doesn't import a second copy; the import outranks restoring the last track.
            try { history.replaceState(null, '', location.pathname); } catch (e) { }
            importShared(_importTok.trim());
        } else if (typeof TrackBuffer !== 'undefined') {
            // An in-progress recording wins; otherwise re-load the last track you had open.
            TrackBuffer.load().then(buf => { if (buf) restoreBufferedTrack(buf); else restoreLastLoaded(); });
        } else {
            restoreLastLoaded();
        }

        // ---- Stage 2: cloud autosync on the fly — upsert the row every SYNC_MS while recording.
        //      Offline ticks just fail and retry; the local buffer (Stage 1) stays the safety net. ----
        function autoTrackName() {
            return 'Track ' + new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        }
        let syncInflight = false, lastSync = 0, syncTimer = null;
        const SYNC_MS = 20000; // cloud update cadence while recording (battery/data friendly)
        async function doSync() {
            syncTimer = null;
            if (syncInflight || trkState === 'idle' || !track.length) return;
            if (totalDist < 80 && track.length < 15) return; // skip trivial tracks → no empty cloud rows
            syncInflight = true; lastSync = Date.now();
            try { await saveTrack(currentTrackName || autoTrackName(), 'recording'); }
            catch (e) { if (window.DebugWindow) DebugWindow.log('Sync: ' + (e.message || e)); } // offline → retry next tick
            syncInflight = false;
        }
        function scheduleSync() {
            if (syncTimer || syncInflight) return;
            syncTimer = setTimeout(doSync, Math.max(0, SYNC_MS - (Date.now() - lastSync)));
        }

        // ---- Stage 3: live position broadcast over Supabase Realtime *Broadcast* (channel
        //      'live:<token>'). No DB/publication change — Broadcast is ephemeral pub/sub; the
        //      persisted trail still comes from the Stage 2 row, so a viewer gets history + live. ----
        let liveOn = false, liveChannel = null, lastLiveMs = 0, liveTrailTimer = null;
        let liveRejoinTimer = null, liveWasInterrupted = false, liveNetWired = false; // auto-resume after a dead spot
        let liveName = (localStorage.getItem('tracker.liveName') || 'vsb');
        const LIVE_MS = 4000; // position broadcast cadence while live
        function updateLiveBadge() {
            const b = $('live-badge'); if (b) b.classList.toggle('on', liveOn);
            const mb = $('mb-live'); if (mb) mb.classList.toggle('active', liveOn);
        }
        // 'pos' = latest fix (throttled); 'trail' = whole path (so late viewers see the history).
        function broadcastLive(force) {
            if (!liveOn || !liveChannel || !track.length) return;
            const now = Date.now();
            if (!force && now - lastLiveMs < LIVE_MS) return;
            lastLiveMs = now;
            const i = track.length - 1;
            // While navigating, ride the ETA along on the same message → the viewer shows "Ankunft …"
            // in its header (note #3). null when no route → viewer hides the ETA line.
            const trip = (__nav && __nav.tripData) ? __nav.tripData([track[i][0], track[i][1]]) : null;
            try {
                liveChannel.send({
                    type: 'broadcast', event: 'pos', payload: {
                        lat: track[i][0], lng: track[i][1], t: times[i] || null,
                        speed: speeds[i] != null ? speeds[i] : null, activity: activities[i] || null,
                        remSec: trip ? Math.round(trip.remSec) : null, remM: trip ? Math.round(trip.remM) : null,
                    },
                });
            } catch (e) { /* channel not joined yet → the next fix retries */ }
        }
        function broadcastTrail() {
            if (!liveOn || !liveChannel || !track.length) return;
            const pts = track.map((p, i) => [p[0], p[1], times[i] || null, speeds[i] != null ? speeds[i] : null, activities[i] || null]);
            try { liveChannel.send({ type: 'broadcast', event: 'trail', payload: { pts: pts } }); } catch (e) { }
        }
        // ---- live MEDIA over the SAME channel: photo / voice / video. Photos ride as the FULL stored
        //      image (~130–400 KB JPEG, the same the share delivers); voice + video ride as their R2
        //      URLs (tiny), so a big clip never bloats the message — realtime caps a broadcast at 1 MB.
        //      liveMedia keeps the set (one entry per waypoint t) so late viewers are re-sent it (like
        //      the trail). dedup by t.
        let liveMedia = [];
        function broadcastOne(item) {
            if (!liveOn || !liveChannel || !item) return;
            try { liveChannel.send({ type: 'broadcast', event: item.event, payload: item.payload }); } catch (e) { }
        }
        function broadcastMedia() { liveMedia.forEach(broadcastOne); } // re-send all → late viewers catch up
        // Build the {event,payload} for a waypoint, or null if it can't ride live yet (a video still on a
        // local blob: URL is useless to a remote viewer until the R2 upload swapped it for a real URL).
        function liveItemFor(wp) {
            if (!wp || wp.lat == null) return null;
            const lat = wp.lat, lng = wp.lng, t = wp.t, title = wp.title || '', text = wp.text || '';
            if (wp.type === 'voice') {
                if (!wp.audio) return null;
                return { event: 'voice', payload: { lat, lng, t, title, text, type: 'voice', audio: wp.audio, dur: wp.dur || 0, mime: wp.mime || 'audio/webm' } };
            }
            if (wp.type === 'video') {
                if (!wp.video || /^blob:/.test(wp.video)) return null; // wait for the R2 URL
                return { event: 'video', payload: { lat, lng, t, title, text, type: 'video', video: wp.video, mime: wp.mime || 'video/mp4' } };
            }
            if (!wp.img) return null;
            return { event: 'photo', payload: { lat, lng, t, title, text, img: wp.img } };
        }
        function addLiveMedia(wp) {
            if (!liveOn || !liveChannel) return;
            const item = liveItemFor(wp); if (!item) return;
            const i = liveMedia.findIndex(x => x.payload.t === wp.t);
            if (i >= 0) liveMedia[i] = item; else liveMedia.push(item); // update on the AI-title / R2-URL re-send
            broadcastOne(item);
        }
        // LIVE: broadcast your position on a chosen PUBLIC channel name (default "vsb"). Anyone who
        // knows the name and opens view.html?live=<name> (or types it) sees you move. No DB, no token.
        function openLivePanel() {
            const inp = $('live-name'); if (inp) inp.value = liveName;
            showPanel('live-panel');
            if (inp) { inp.focus(); inp.select(); }
        }
        function beginLive(name, copied) {
            const canon = (name || '').trim().toLowerCase() || 'vsb';
            liveName = canon;
            try { localStorage.setItem('tracker.liveName', canon); } catch (e) { }
            if (!track.length) { toast('Erst aufzeichnen, dann LIVE.'); return; }
            liveOn = true; updateLiveBadge();
            liveMedia = [];            // fresh live session
            liveWasInterrupted = false;
            // Auto-resume: a tunnel / dead spot must NOT kill the broadcast for good. When the device
            // comes back online, force a rejoin. Wired once.
            if (!liveNetWired) {
                liveNetWired = true;
                window.addEventListener('online', () => { if (liveOn) scheduleRejoin(200); });
            }
            joinLive();
            if (liveTrailTimer) clearInterval(liveTrailTimer);
            // refresh the path every 15 s AND double as a watchdog: if the channel is no longer joined
            // (dropped in a dead spot) rebuild it, instead of silently sending into the void. Media is
            // NOT re-sent on a timer (that was the egress leak) — a (re)connecting viewer pulls it via 'request'.
            liveTrailTimer = setInterval(() => {
                if (!liveOn) return;
                if (liveChannel && liveChannel.state && liveChannel.state !== 'joined') { scheduleRejoin(0); return; }
                broadcastTrail();
            }, 15000);
            toast("Live auf '" + canon + "'" + (copied ? ' · Link kopiert ✓' : ' — Namen weitersagen'));
        }
        // (Re)create + subscribe the live channel. Called on start and on every rejoin (so a dropped
        // channel is rebuilt from scratch — the safest way to recover with supabase-js).
        async function joinLive() {
            try {
                const c = await ensureSb();
                try { if (liveChannel) c.removeChannel(liveChannel); } catch (e) { } // drop the stale channel first
                const ch = c.channel('live:' + liveName, { config: { broadcast: { self: false } } });
                // A (re)connecting viewer asks for the current state → re-send the whole trail + latest pos + media.
                ch.on('broadcast', { event: 'request' }, () => {
                    if (window.DebugWindow) DebugWindow.log('live: ◀ request → sende trail/pos/media (' + track.length + ' pts)');
                    broadcastTrail(); broadcastLive(true); waypoints.forEach(addLiveMedia);
                });
                ch.subscribe((status) => {
                    if (window.DebugWindow) DebugWindow.log('live: status=' + status + ' (live:' + liveName + ')');
                    if (status === 'SUBSCRIBED') {
                        if (liveWasInterrupted) { liveWasInterrupted = false; toast('Live wieder verbunden.'); }
                        updateLiveBadge();
                        broadcastTrail(); broadcastLive(true); waypoints.forEach(addLiveMedia);
                    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                        liveWasInterrupted = true; updateLiveBadge();
                        if (liveOn) scheduleRejoin(3000); // keep trying while we're still meant to be live
                    }
                });
                liveChannel = ch;
            } catch (e) {
                if (window.DebugWindow) DebugWindow.log('live: join-Fehler ' + (e.message || e));
                if (liveOn) scheduleRejoin(5000);
            }
        }
        // One pending rejoin at a time; `delay` ms before rebuilding the channel.
        function scheduleRejoin(delay) {
            if (!liveOn || liveRejoinTimer) return;
            liveRejoinTimer = setTimeout(() => { liveRejoinTimer = null; if (liveOn) joinLive(); }, delay || 3000);
        }
        function stopLive(silent) {
            if (liveTrailTimer) { clearInterval(liveTrailTimer); liveTrailTimer = null; }
            if (liveRejoinTimer) { clearTimeout(liveRejoinTimer); liveRejoinTimer = null; }
            if (liveChannel) {
                try { liveChannel.send({ type: 'broadcast', event: 'end', payload: {} }); } catch (e) { }
                try { liveChannel.unsubscribe(); } catch (e) { }
            }
            liveChannel = null; liveOn = false; liveWasInterrupted = false;
            updateLiveBadge();
            if (!silent) toast('Live beendet.');
        }

        // ---------------------------------------------------------------
        // Acquire a position: snap there at once, then keep refining until the
        // accuracy is good (or a timeout hits) — only then reveal the red dot.
        // ---------------------------------------------------------------
        function goToCurrentPosition(opts) {
            opts = opts || {};
            if (!('geolocation' in navigator)) {
                setStatus('Dieser Browser unterstützt keine Standortbestimmung.');
                return;
            }
            if (!window.isSecureContext) {
                setStatus('GPS braucht HTTPS oder localhost. Über file:// gibt es keine Position.');
                return;
            }
            if (acquireWatch != null) navigator.geolocation.clearWatch(acquireWatch);

            const GOOD_ACC = 15;       // metres: a great fix → settle at once
            const STABLE_MS = 3000;    // ms: accuracy stopped improving this long → settle at best
            const MAX_WAIT = 15000;    // ms: reveal anyway after this long
            const startedAt = Date.now();
            let best = null;
            let lastImproved = startedAt;
            let centred = false;

            setStatus('Warte auf bessere Positionsdaten …');

            function reveal() {
                if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
                if (!best) return;
                showDot();
                setStatus(`Position gefunden (±${Math.round(best.accuracy)} m).`);
            }

            acquireWatch = navigator.geolocation.watchPosition(
                pos => {
                    const here = [pos.coords.latitude, pos.coords.longitude];
                    const acc = pos.coords.accuracy != null ? pos.coords.accuracy : Infinity;
                    const now = Date.now();
                    // count it as progress only if accuracy drops meaningfully (ignore jitter)
                    if (!best || acc < best.accuracy - 0.5) { best = { here, accuracy: acc }; lastImproved = now; }

                    renderPosition(best.here, best.accuracy); // moves the still-hidden dot + accuracy readout

                    if (!centred) {
                        centred = true; // go to the position immediately on the first fix …
                        // … but NOT on start-up if we restored a saved viewport (keep where the user was).
                        if (opts.initial) { if (!viewRestored) map.setView(best.here, 16); }
                        else map.flyTo(best.here, Math.max(map.getZoom(), 16), { duration: 1.2 });
                    } else if (!(opts.initial && viewRestored)) {
                        map.panTo(best.here, { animate: true });
                    }

                    // settle once it is great, once it stops improving, or after the hard cap
                    const settle = best.accuracy <= GOOD_ACC
                        || (now - lastImproved) >= STABLE_MS
                        || (now - startedAt) > MAX_WAIT;
                    if (settle) reveal();
                    else setStatus(`Warte auf bessere Positionsdaten … (±${Math.round(best.accuracy)} m)`);
                },
                onError,
                { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 }
            );

            // safety net: reveal the best fix even if updates stop coming
            setTimeout(() => { if (acquireWatch != null) reveal(); }, MAX_WAIT + 500);
        }

        function centerOnPosition() {
            cancelNavOverview(); // manual re-centre supersedes any pending auto-glide
            clearHandMode();    // CENTER explicitly takes over → leave hand-mode (hide the resume arrow)
            fitMode = false;    // centring on the dot is the opposite of "keep the whole track fitted"
            setFollowing(true); // re-enable auto-follow (and hide the recenter button)
            // Already have a position → glide there smoothly
            if (posMarker) {
                if (window.DebugWindow) DebugWindow.log('centerOnPosition: flyTo dot, zoom ' + Math.max(map.getZoom(), 16));
                map.flyTo(posMarker.getLatLng(), Math.max(map.getZoom(), 16), { duration: 1.2 });
                showDot();
                return;
            }
            if (window.DebugWindow) DebugWindow.log('centerOnPosition: no posMarker → goToCurrentPosition');
            goToCurrentPosition({ initial: false });
        }

        async function clearTrack(silent) {
            // Guard against losing a recording by accident (silent skips the confirm). Note: the
            // only caller passes silent=true → the await is never reached there, so it stays sync.
            if (!silent && track.length && !(await uiConfirm('Aktuellen Track wirklich löschen?', { danger: true, okText: 'Löschen' }))) return;
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.clear();
            clearLoaded(); // a cleared/discarded track must not be restored on the next reload
            track = [];
            loadedBounds = null; // no multi-loaded overlay anymore → FIT hides
            times = [];
            alts = [];
            speeds = [];
            activities = [];
            totalDist = 0;
            lastFix = null;
            resetDem();
            trackLayer.clearLayers();
            clearWaypoints();
            setDist(0);
            setSpeed(0);
            setAlt(null);
            if (!tracking) { CyberClock.set(elTime, '00:00:00'); startTime = null; }
            if (!silent) toast('Track gelöscht.'); // silent clears (START / restore) shouldn't toast
        }

        // ---------------------------------------------------------------
        // Export as GPX (the standard GPS exchange format)
        // ---------------------------------------------------------------
        function buildGpx() {
            const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const name = 'Doc Alvers Tracker ' + (times[0] || '');
            const A = effectiveAlts(); // DEM-corrected when the DEM toggle is on, else raw GPS+baro
            const pts = track.map((p, i) =>
                `      <trkpt lat="${p[0].toFixed(7)}" lon="${p[1].toFixed(7)}">` +
                (A[i] != null ? `<ele>${A[i].toFixed(1)}</ele>` : '') +
                (times[i] ? `<time>${times[i]}</time>` : '') +
                `</trkpt>`
            ).join('\n');
            // Photo waypoints → standard <wpt> (must precede <trk> per the GPX schema)
            const wpts = waypoints.map(w =>
                `  <wpt lat="${w.lat.toFixed(7)}" lon="${w.lng.toFixed(7)}">` +
                (w.t ? `<time>${w.t}</time>` : '') +
                `<name>${esc(w.title || 'Foto')}</name>` +
                (w.text ? `<desc>${esc(w.text)}</desc>` : '') +
                `</wpt>`
            ).join('\n');
            return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Doc Alvers Mathe-Labor" xmlns="http://www.topografix.com/GPX/1/1">
${wpts}
  <trk>
    <name>${esc(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>`;
        }

        function exportGpx() {
            if (track.length < 2) { toast('Kein Track zum Exportieren.'); return; }
            const blob = new Blob([buildGpx()], { type: 'application/gpx+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `track-${new Date().toISOString().replace(/[:.]/g, '-')}.gpx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast('GPX exportiert (' + track.length + ' Punkte).');
        }

        // ---------------------------------------------------------------
        // Double-tap the clock → toggle fullscreen
        // ---------------------------------------------------------------
        function toggleFullscreen() {
            const d = document;
            const inFs = d.fullscreenElement || d.webkitFullscreenElement;
            if (!inFs) {
                const el = d.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen;
                if (req) req.call(el);
            } else {
                const exit = d.exitFullscreen || d.webkitExitFullscreen;
                if (exit) exit.call(d);
            }
        }

        let lastTapTime = 0;
        elTime.addEventListener('click', (e) => {
            e.stopPropagation(); // don't let the tap leak to the map underneath
            const now = Date.now();
            if (now - lastTapTime < 350) { toggleFullscreen(); lastTapTime = 0; } // second tap
            else lastTapTime = now;
        });

        // Re-fit the map after the viewport changes size on enter/leave fullscreen
        document.addEventListener('fullscreenchange', () => setTimeout(init, 120));
        document.addEventListener('webkitfullscreenchange', () => setTimeout(init, 120));

        // ===============================================================
        // Supabase — same project as VGP. The publishable key is public by
        // design; Row-Level-Security keeps each device's tracks private to
        // its anonymous auth.uid().
        // ===============================================================
        const SUPABASE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';
        let sb = null;

        // --- Sync-Code: a shared passphrase maps to ONE deterministic account, so several
        //     devices with the same code share their tracks. No code → anonymous (private). ---
        const SYNC_KEY = 'tracker.syncCode';
        function getSyncCode() { return localStorage.getItem(SYNC_KEY) || ''; }

        const EUR_PER_PHOTO = 0.0005; // ~0,05 ct per Gemini identification (Pl@ntNet is free)

        async function sha256hex(s) {
            const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
            return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
        }
        async function syncCreds(code) {
            const h = await sha256hex(code);
            // docalvers.de has valid MX → Supabase accepts the address (no mail is sent while
            // "Confirm email" is off). Local part is derived from the code.
            return { email: 't-' + h.slice(0, 32) + '@docalvers.de', password: 'p-' + code };
        }
        async function signInWithCode(code) {
            const { email, password } = await syncCreds(code);
            const first = await sb.auth.signInWithPassword({ email, password });
            if (first.error) {
                await sb.auth.signUp({ email, password }); // first device with this code → create it
                const re = await sb.auth.signInWithPassword({ email, password });
                if (re.error) throw new Error('Sync-Login fehlgeschlagen — „Confirm email" im Dashboard aus? (' + re.error.message + ')');
            }
        }

        async function ensureSb() {
            // Self-hosted lib loads same-origin before this runs; if it's still settling, wait briefly
            // (≤2 s) instead of hard-failing — robust on slow devices / first paint.
            for (let i = 0; i < 20 && !window.supabase; i++) await new Promise((r) => setTimeout(r, 100));
            if (!window.supabase) throw new Error('Supabase-Lib nicht geladen');
            if (!sb) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            const code = getSyncCode();
            const want = code ? (await syncCreds(code)).email : null; // null = anonymous identity
            const { data: { session } } = await sb.auth.getSession();
            const have = session && session.user ? (session.user.email || null) : undefined; // undefined = no session
            if (session && have === want) return sb; // already the right identity
            if (session) await sb.auth.signOut().catch(() => { });
            if (code) await signInWithCode(code);
            else {
                const { error } = await sb.auth.signInAnonymously();
                if (error) throw new Error('Anon-Login aus? ' + error.message);
            }
            return sb;
        }

        async function clearSyncCode() { localStorage.removeItem(SYNC_KEY); await ensureSb(); }

        // Connect to a code's shared account AND carry the current device's tracks over.
        // Crucial: read the current tracks BEFORE switching (switching signs the old session
        // out). Dedupe by name so re-connecting doesn't duplicate.
        async function connectSync(code) {
            await ensureSb();
            const { data: { session } } = await sb.auth.getSession();
            const have = session && session.user ? (session.user.email || null) : null;
            const want = (await syncCreds(code)).email;
            if (have === want) return -1; // already on this account
            const rows = (await sb.from('tracks').select('name, distance_m, points, waypoints')).data || [];
            await signInWithCode(code);           // create / sign into the account FIRST (throws on failure)
            localStorage.setItem(SYNC_KEY, code);  // persist the code ONLY after a successful login
            let n = 0;
            if (rows.length) {
                const known = new Set(((await sb.from('tracks').select('name')).data || []).map(r => r.name));
                const add = rows.filter(r => !known.has(r.name));
                if (add.length) {
                    const { error } = await sb.from('tracks')
                        .insert(add.map(r => ({ name: r.name, distance_m: r.distance_m, points: r.points, waypoints: r.waypoints })));
                    if (error) throw error;
                    n = add.length;
                }
            }
            return n;
        }

        // Save the current in-memory track. If a row already exists for this recording
        // (currentTrackId — set by the live autosync), UPDATE it instead of inserting a duplicate.
        // `status` ('recording' | 'done') hides in-progress tracks from the list; if that column
        // isn't migrated yet, we transparently retry without it (no regression to the old behaviour).
        async function saveTrack(name, status) {
            const c = await ensureSb();
            // [lat, lng, time, altitude(m), speed(km/h), activity] — alt/speed null when unknown
            const pts = track.map((p, i) => [p[0], p[1], times[i] || null, alts[i] != null ? alts[i] : null, speeds[i] != null ? speeds[i] : null, activities[i] || null]);
            // strip the live Leaflet marker reference before persisting
            const wps = waypoints.map(wpSer);
            const row = { name: name, distance_m: Math.round(totalDist), points: pts, waypoints: wps, status: status || 'done' };
            const missingCol = e => e && /status/i.test(e.message || ''); // 'status' column not migrated yet
            if (currentTrackId) {                                          // UPDATE the existing (live-synced) row
                let { error } = await c.from('tracks').update(row).eq('id', currentTrackId);
                if (missingCol(error)) { const { status: _s, ...bare } = row; ({ error } = await c.from('tracks').update(bare).eq('id', currentTrackId)); }
                if (error) throw error;
                return currentTrackId;
            }
            let { data, error } = await c.from('tracks').insert(row).select('id').single();
            if (missingCol(error)) { const { status: _s, ...bare } = row; ({ data, error } = await c.from('tracks').insert(bare).select('id').single()); }
            if (error) throw error;
            currentTrackId = data ? data.id : null;
            return currentTrackId;
        }

        // ---- Umkreis-Suche (Doc 2026-06-17): show only tracks whose START is within N km of here. ----
        let _lastTrackRows = [];      // last rows handed to renderTrackList → re-render when the radius changes
        let trackStartCache = null;   // id → [lat,lng] first point (lazy; rebuilt whenever the list is refreshed)
        let listRadiusKm = 0;         // 0 = Alle; else 10/20/30

        // Fetch ONLY each track's first point (server-side points->0 → tiny payload, NOT the heavy points
        // column → no egress blow-up like the base64 incident). Builds the id→[lat,lng] start map.
        async function loadTrackStarts() {
            const c = await ensureSb();
            const { data, error } = await c.from('tracks').select('id, startpt:points->0');
            if (error) throw error;
            const m = {};
            for (const r of (data || [])) {
                const p = r.startpt;
                if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') m[r.id] = [p[0], p[1]];
            }
            trackStartCache = m;
            if (window.DebugWindow) DebugWindow.log('umkreis: ' + Object.keys(m).length + ' Startpunkte geladen');
            return m;
        }

        async function listTracks() {
            trackStartCache = null;   // list refreshed → start points may have changed (new/removed track)
            const c = await ensureSb();
            // Show ALL saved tracks — never hide one by status (a tracker must not make tracks vanish).
            // list_tracks() RPC computes km · duration · photos server-side for EVERY track (old + new)
            // from the existing points/waypoints — WITHOUT loading those heavy columns. Falls back to
            // the basic select (km only) if the RPC isn't present yet.
            let { data, error } = await c.rpc('list_tracks');
            if (error) {
                ({ data, error } = await c.from('tracks')
                    .select('id, name, created_at, distance_m')
                    .order('created_at', { ascending: false }));
            }
            if (error) throw error;
            return data || [];
        }

        async function fetchTrack(id) {
            const c = await ensureSb();
            const { data, error } = await c.from('tracks').select('points, waypoints').eq('id', id).single();
            if (error) throw error;
            return { points: data.points || [], waypoints: data.waypoints || [] };
        }

        // Share a track: ensure it has an unguessable share token (owner-only RPC), then hand the
        // read-only view link to the OS share sheet (or clipboard). Revoke later = clear share_id.
        const SHARE_BASE = 'https://docalvers.de/tracker/view.html';
        async function shareTrack(id, name) {
            toast('Link wird erstellt …');
            let token;
            try {
                const c = await ensureSb();
                const { data, error } = await c.rpc('ensure_track_share', { p_track_id: id });
                if (error) throw error;
                token = data;
            } catch (e) { toast('Teilen fehlgeschlagen: ' + (e.message || e)); return; }
            if (!token) { toast('Kein Link (nicht dein Track?).'); return; }
            const url = SHARE_BASE + '?s=' + token;
            try {
                if (navigator.share) await navigator.share({ title: name || 'Track', text: name || 'Mein Track', url });
                else { await navigator.clipboard.writeText(url); toast('Link kopiert.'); }
            } catch (e) { /* user cancelled the share sheet → ignore */ }
        }

        // Bundle several tracks into ONE share link (?s=tok1,tok2,…) → view.html overlays them.
        async function shareMultiple(ids) {
            if (!ids.length) return;
            toast('Link wird erstellt …');
            const tokens = [];
            try {
                const c = await ensureSb();
                for (const id of ids) {
                    const { data, error } = await c.rpc('ensure_track_share', { p_track_id: id });
                    if (error) throw error;
                    if (data) tokens.push(data);
                }
            } catch (e) { toast('Teilen fehlgeschlagen: ' + (e.message || e)); return; }
            if (!tokens.length) { toast('Kein Link (nicht deine Tracks?).'); return; }
            const url = SHARE_BASE + '?s=' + tokens.join(',');
            try {
                if (navigator.share) await navigator.share({ title: tokens.length + ' Tracks', text: 'Meine Tracks', url });
                else { await navigator.clipboard.writeText(url); toast('Link kopiert.'); }
            } catch (e) { /* user cancelled */ }
        }

        // ⚠️ DEBUG / DEV SAFETY MODE — TEMPORARY, not the final behaviour.
        // While testing the tracker we keep cloud deletion OFF so NOTHING in Supabase can be lost
        // (Doc's call after two data-loss scares on 2026-06-07). Before production this must be
        // re-armed: set ALLOW_DELETE = true, or replace with a proper soft-delete / admin tool.
        // Gates removeTrack() → covers BOTH the LADEN × and the DISCARD button; while false the
        // × button isn't even rendered.
        const ALLOW_DELETE = true; // ← re-enabled on Doc's request (trash-can per row; still behind a "Track löschen?" confirm)
        async function removeTrack(id) {
            if (!ALLOW_DELETE) return; // hard gate: no row is ever deleted while disabled
            const c = await ensureSb();
            const { error } = await c.from('tracks').delete().eq('id', id);
            if (error) throw error;
        }

        // Plot a loaded track onto the map (replaces the current line + photo pins)
        function plotTrack(points, wps) {
            // Loading a track must NOT get yanked back to the live position: stop the initial
            // position-acquire watch and turn off auto-follow so the track stays in view.
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            setFollowing(false);
            const latlngs = points.map(p => [p[0], p[1]]);
            track = latlngs.map(ll => [ll[0], ll[1]]);
            times = points.map(p => p[2] || null);
            alts = points.map(p => (p[3] != null ? p[3] : null));   // older tracks have no p[3] → null
            resetDem(); // a freshly loaded track has no DEM lookup yet
            speeds = points.map(p => (p[4] != null ? p[4] : null));
            activities = points.map(p => (p[5] != null ? p[5] : null)); // travel mode (older tracks → null)
            totalDist = 0;
            for (let i = 1; i < latlngs.length; i++) totalDist += haversine(latlngs[i - 1], latlngs[i]);
            redrawTrack(); // speed-coloured
            clearWaypoints();
            (wps || []).forEach(w => addWaypoint(w));
            setDist(totalDist);
            // Loaded track has no live speed → show its AVERAGE (distance/time, same as the stats panel)
            // with a Ø symbol so it reads clearly as an average, not a live value.
            Hud.setSpeedAvg(trackStats().avgKmh);
            // show the loaded track's last known altitude (if any)
            const lastAlt = alts.slice().reverse().find(a => a != null);
            fusedAlt = (lastAlt != null) ? lastAlt : null;
            renderAltitude();
            if (latlngs.length) map.fitBounds(L.latLngBounds(latlngs), { padding: fitPad() });
            loadedBounds = null; // single load uses the live 'track' array for FIT, not a multi-overlay bound
            refreshRecenter(); // loaded track may have ≥10 pts → reveal the FIT button (moveend alone isn't reliable)
        }

        // ---- Multi-select: load several tracks at once (checkbox per row → coloured overlay) ----
        const selectedTracks = new Set();   // current checkbox selection
        const loadedTrackIds = new Set();   // ids on the map now → pre-checked when the panel reopens
        function updateLoadSel() {
            const btn = $('tl-loadsel'), acts = $('tl-actions');
            if (btn) btn.textContent = 'Laden (' + selectedTracks.size + ')';
            if (acts) acts.classList.toggle('show', selectedTracks.size > 0);
        }
        function deselectAll() {
            selectedTracks.clear();
            document.querySelectorAll('#track-list-items .tl-check').forEach((c) => { c.checked = false; });
            updateLoadSel();
        }
        // Overlay several loaded tracks, each in its own colour; fit the map to them all.
        function plotMultiple(loaded) {
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            setFollowing(false);
            trackLayer.clearLayers(); clearWaypoints();
            track = []; times = []; alts = []; speeds = []; activities = []; totalDist = 0;
            resetDem();
            currentTrackId = null; currentTrackName = '';
            const all = [];
            loaded.forEach((t) => {
                const pts = (t.points || []).filter(p => p && p[0] != null);
                if (pts.length) {
                    // Each overlaid track keeps its speed colours (hotline), exactly like a single
                    // load — never a flat per-track colour just because several are shown.
                    TrackRender.draw({
                        track: pts.map(p => [p[0], p[1]]),
                        times: pts.map(p => p[2] || null),
                        speeds: pts.map(p => (p[4] != null ? p[4] : null)),
                        activities: pts.map(p => (p[5] != null ? p[5] : null)),
                        layer: trackLayer, usesHotline,
                    });
                    pts.forEach(p => all.push([p[0], p[1]]));
                }
                (t.waypoints || []).forEach(w => addWaypoint(w));
            });
            setDist(0); setSpeed(0);
            loadedBounds = all.length ? L.latLngBounds(all) : null;
            if (all.length) map.fitBounds(loadedBounds, { padding: fitPad() });
            refreshRecenter(); // multi-loaded overlay → reveal the FIT button (track[] is empty for multi-load)
        }
        if ($('tl-deselect')) $('tl-deselect').addEventListener('click', deselectAll);
        if ($('tl-sharesel')) $('tl-sharesel').addEventListener('click', () => shareMultiple(Array.from(selectedTracks)));
        if ($('tl-loadsel')) $('tl-loadsel').addEventListener('click', async () => {
            const ids = Array.from(selectedTracks);
            if (!ids.length) return;
            toast('Lade ' + ids.length + ' Tracks …');
            const loaded = [];
            for (const id of ids) { try { loaded.push(await fetchTrack(id)); } catch (e) { /* skip a failed one */ } }
            loadedTrackIds.clear(); ids.forEach((id) => loadedTrackIds.add(id));   // remember for re-open
            persistLoaded(ids.map((id) => ({ id: id, name: '' })));                // survive a reload
            plotMultiple(loaded);
            hidePanels();
            toast(loaded.length + ' Tracks geladen.');
        });

        // ---- Persist the LAST LOADED track(s) across reloads. Stores just the id(s) (+ name for a
        //      single track) in localStorage; the data is re-fetched from the cloud on startup IF
        //      there is no in-progress recording buffer (a recording takes priority). clearTrack()
        //      forgets it, so a discarded/cleared track does not come back. ----
        const LAST_LOADED_KEY = 'tracker.lastLoaded';
        function persistLoaded(arr) {
            try { localStorage.setItem(LAST_LOADED_KEY, JSON.stringify(arr || [])); } catch (e) { /* quota / private mode */ }
        }
        function clearLoaded() {
            try { localStorage.removeItem(LAST_LOADED_KEY); } catch (e) { }
        }
        async function restoreLastLoaded() {
            let arr;
            try { arr = JSON.parse(localStorage.getItem(LAST_LOADED_KEY) || '[]'); } catch (e) { arr = []; }
            if (!Array.isArray(arr) || !arr.length) return;
            const ok = [];
            for (const it of arr) {
                try { const t = await fetchTrack(it.id); ok.push({ id: it.id, name: it.name || '', t: t }); }
                catch (e) { /* track gone / no access → skip it */ }
            }
            if (!ok.length) { clearLoaded(); return; } // all gone → forget
            loadedTrackIds.clear(); ok.forEach((o) => loadedTrackIds.add(o.id));
            if (ok.length === 1) {
                plotTrack(ok[0].t.points, ok[0].t.waypoints);
                currentTrackId = ok[0].id; currentTrackName = ok[0].name;
            } else {
                plotMultiple(ok.map((o) => o.t));
            }
            if (window.DebugWindow) DebugWindow.log('Geladenen Track wiederhergestellt (' + ok.length + ').');
        }

        // ---- Import a friend's shared track (?import=<token>) into MY account as a copy I own ----
        // Opened from the read-only viewer's "In meinen Tracker laden" button. We pull the shared row
        // via the SAME public RPC the viewer uses, plot it, then INSERT it as a fresh track under MY
        // login (currentTrackId=null → saveTrack inserts, it never touches the friend's row). It then
        // appears in "Tracks laden", survives a reload, and can be exported / overlaid with our own.
        async function importShared(token) {
            toast('Geteilten Track wird geladen …');
            let row;
            try {
                const c = await ensureSb();
                const { data, error } = await c.rpc('get_shared_track', { p_token: token });
                if (error) throw error;
                row = data;
            } catch (e) { toast('Import fehlgeschlagen: ' + (e.message || e)); return; }
            if (!row) { toast('Track nicht gefunden — Link ungültig oder widerrufen.'); return; }
            plotTrack(row.points || [], row.waypoints || []);
            currentTrackId = null;                          // not my row yet → save INSERTS a copy I own
            const name = row.name || autoTrackName();
            $('hud-top').classList.add('shown');            // reveal the header for the loaded track
            let id;
            try { id = await saveTrack(name, 'done'); }
            catch (e) { currentTrackName = name; toast('Geladen, Speichern fehlgeschlagen: ' + (e.message || e)); return; }
            currentTrackId = id; currentTrackName = name;
            loadedTrackIds.clear(); loadedTrackIds.add(id);
            persistLoaded([{ id: id, name: name }]);        // survive a reload like any loaded track
            toast('In deinen Tracker importiert: ' + name);
            // Refresh + reopen the "Tracks laden" list so the imported copy appears IMMEDIATELY
            // (pre-selected via loadedTrackIds) — before, it only showed after manually reopening.
            try { const rows = await listTracks(); renderTrackList(rows); showPanel('track-list'); } catch (e) { /* list refresh is best-effort */ }
        }

        // ---- Transient toast (the persistent status line was removed) ----
        let toastTimer = null;
        function toast(msg) {
            const t = $('toast');
            t.textContent = msg;
            t.classList.add('show');
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
        }

        // Styled in-app confirm — replaces the ugly native confirm(). Returns Promise<boolean>.
        // opts: { okText, cancelText, danger }  (danger → red OK button for destructive actions).
        function uiConfirm(message, opts) {
            opts = opts || {};
            return new Promise((resolve) => {
                const ov = document.createElement('div');
                ov.className = 'ui-modal-ov';
                ov.innerHTML =
                    '<div class="ui-modal" role="dialog" aria-modal="true">' +
                    '<div class="ui-modal-msg"></div>' +
                    '<div class="ui-modal-btns">' +
                    '<button type="button" class="ui-btn ui-btn-cancel"></button>' +
                    '<button type="button" class="ui-btn ' + (opts.danger ? 'ui-btn-danger' : 'ui-btn-ok') + '"></button>' +
                    '</div></div>';
                ov.querySelector('.ui-modal-msg').textContent = message;
                const cancel = ov.querySelector('.ui-btn-cancel');
                const ok = ov.querySelector('.ui-btn:last-child');
                cancel.textContent = opts.cancelText || 'Abbrechen';
                ok.textContent = opts.okText || 'OK';
                let done = false;
                function close(v) {
                    if (done) return;
                    done = true;
                    ov.classList.remove('shown');
                    document.removeEventListener('keydown', onKey);
                    setTimeout(() => ov.remove(), 200);
                    resolve(v);
                }
                function onKey(e) {
                    if (e.key === 'Escape') close(false);
                    else if (e.key === 'Enter') close(true);
                }
                cancel.onclick = () => close(false);
                ok.onclick = () => close(true);
                ov.onclick = (e) => { if (e.target === ov) close(false); };
                document.addEventListener('keydown', onKey);
                document.body.appendChild(ov);
                requestAnimationFrame(() => { ov.classList.add('shown'); ok.focus(); });
            });
        }

        // Styled single-line prompt (paste a value) — same look as uiConfirm, plus a text field.
        // Resolves the trimmed text, or null on cancel/empty.
        function uiPrompt(message, opts) {
            opts = opts || {};
            return new Promise((resolve) => {
                const ov = document.createElement('div');
                ov.className = 'ui-modal-ov';
                ov.innerHTML =
                    '<div class="ui-modal" role="dialog" aria-modal="true">' +
                    '<div class="ui-modal-msg"></div>' +
                    '<input type="text" class="ui-modal-input" aria-label="Eingabe" autocapitalize="off" autocomplete="off" spellcheck="false">' +
                    '<div class="ui-modal-btns">' +
                    '<button type="button" class="ui-btn ui-btn-cancel"></button>' +
                    '<button type="button" class="ui-btn ui-btn-ok"></button>' +
                    '</div></div>';
                ov.querySelector('.ui-modal-msg').textContent = message;
                const inp = ov.querySelector('.ui-modal-input');
                inp.placeholder = opts.placeholder || '';
                if (opts.value) inp.value = opts.value;
                const cancel = ov.querySelector('.ui-btn-cancel');
                const ok = ov.querySelector('.ui-btn-ok');
                cancel.textContent = opts.cancelText || 'Abbrechen';
                ok.textContent = opts.okText || 'OK';
                let done = false;
                function close(v) {
                    if (done) return;
                    done = true;
                    ov.classList.remove('shown');
                    document.removeEventListener('keydown', onKey);
                    setTimeout(() => ov.remove(), 200);
                    resolve(v);
                }
                function onKey(e) {
                    if (e.key === 'Escape') close(null);
                    else if (e.key === 'Enter') close(inp.value.trim() || null);
                }
                cancel.onclick = () => close(null);
                ok.onclick = () => close(inp.value.trim() || null);
                ov.onclick = (e) => { if (e.target === ov) close(null); };
                document.addEventListener('keydown', onKey);
                document.body.appendChild(ov);
                requestAnimationFrame(() => { ov.classList.add('shown'); inp.focus(); });
            });
        }

        // Pull a share token out of whatever the user pastes: a full view-link (…?s=token), a bare
        // token, or even a comma-bundle (we take the first). Returns null if nothing usable.
        function parseShareToken(input) {
            if (!input) return null;
            input = String(input).trim();
            try { const s = new URL(input).searchParams.get('s'); if (s) return s.split(',')[0].trim(); } catch (e) { /* not a URL */ }
            const m = input.match(/[?&]s=([^&\s]+)/);
            if (m) return decodeURIComponent(m[1]).split(',')[0].trim();
            return input.split(',')[0].trim() || null; // assume a bare token was pasted
        }

        // "Geteilten Track-Link laden" in the Tracks-laden panel: paste a friend's view-link → import
        // a copy into MY account (importShared does the fetch + save). See importShared above.
        if ($('tl-import')) $('tl-import').addEventListener('click', async () => {
            const link = await uiPrompt('Geteilten Track-Link einfügen:', { placeholder: 'https://…/view.html?s=…', okText: 'Laden' });
            if (!link) return;
            const tok = parseShareToken(link);
            if (!tok) { toast('Kein gültiger Link.'); return; }
            hidePanels();
            importShared(tok);
        });

        // ---- Foto-Spur / media subsystem → js/tracker-media.js (Phase-2 refactor 2026-06-09).
        //      Forward exports are hoisted functions delegating to the module (callers earlier in
        //      this file keep working); __media is created right below with the shared context. ----
        function loadUsage(...a) { return __media.loadUsage(...a); }
        function addWaypoint(...a) { return __media.addWaypoint(...a); }
        function clearWaypoints(...a) { return __media.clearWaypoints(...a); }
        function updateReburnButton(...a) { return __media.updateReburnButton(...a); }
        function reburnTrack(...a) { return __media.reburnTrack(...a); }
        __media = TrackerMedia({
            map, $, toast, ensureSb, wpSer, doSync, bufferSnapshot, addLiveMedia,
            SUPABASE_URL, SUPABASE_KEY, COL_ORANGE, EUR_PER_PHOTO,
            get lastFix() { return lastFix; },
            get tracking() { return tracking; },
            get posMarker() { return posMarker; },
            get currentTrackId() { return currentTrackId; }, set currentTrackId(v) { currentTrackId = v; },
            get waypoints() { return waypoints; }, set waypoints(v) { waypoints = v; },
            get wpMarkers() { return wpMarkers; }, set wpMarkers(v) { wpMarkers = v; },
            get fannedCluster() { return fannedCluster; }, set fannedCluster(v) { fannedCluster = v; },
        });
        // ---- Simple navigation → js/tracker-nav.js. Owns its own route/destination layers; the core
        //      only asks hasDestination() on START and clearRoute() on STOP (finish/discard). ----
        __nav = TrackerNav({
            map, $, toast, showPanel, hidePanels,
            get posMarker() { return posMarker; },
            // Dialog "STARTEN": from idle → begin recording + navigation (toggle then shows PAUSE);
            // while already recording (dialog reopened mid-trip) → just (re)route to the new destination.
            startTracking: () => {
                if (trkState === 'idle') beginTracking();
                else if (__nav && __nav.hasDestination()) __nav.startNavigation();
            },
        });
        // ---- Speed-limit sign → js/tracker-speedlimit.js. Position-driven (fed from onPosition),
        //      independent of navigation; owns its own #speed-sign badge. ----
        __speed = TrackerSpeedLimit({ $ });
        // ---- Compass / north indicator → js/tracker-compass.js. Owns its own #compass badge. ----
        __compass = TrackerCompass({ $ });
        // ---- Tankstellen-Spur → js/tracker-fuel.js. Position-driven; shows nearby fuel-station
        //      prices via the 'fuel-prices' Edge Function and glows green when one is notably cheap. ----
        __fuel = TrackerFuel({
            map, toast, SUPABASE_URL, SUPABASE_KEY, COL_GREEN, COL_ORANGE, COL_RED,
            navigateTo: (ll, name) => { if (__nav && __nav.navigateTo) __nav.navigateTo(ll, name); },
        });
        // ---- Points of Interest → js/tracker-poi.js. View-driven (Overpass/OSM, keyless); pins for the
        //      categories ticked in the POI panel; a pin tap routes there via tracker-nav.navigateTo. ----
        __poi = TrackerPoi({
            map, toast, showPanel, hidePanels,
            navigateTo: (ll, name) => { if (__nav && __nav.navigateTo) __nav.navigateTo(ll, name); },
            curPos: () => { const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng(); return ll ? [ll.lat, ll.lng] : null; },
        });
        // ===============================================================
        // Radial action popup (long-press / right-click) — style from worldclock
        // ===============================================================
        const miniStack = $('mini-stack');

        // Grey out track-dependent actions when there's no track to act on. BROADCAST stays usable
        // while live (so you can always stop). Called whenever the popup or settings panel opens.
        function refreshMenuState() {
            const has = !!(track && track.length);
            const dim = (id, off) => { const b = $(id); if (b) b.classList.toggle('disabled', off); };
            dim('mb-sharetrack', !has);
            dim('mb-live', !has && !liveOn);
            dim('mb-smooth', !has);
            dim('mb-dem', !has);
        }

        function trackerMenuLayout(stack, btns) {
            // Radial "Kreis": button centres lie on a true circle (x²+y²=R²) and fan to the RIGHT,
            // rows evenly spaced in y; the whole fan is shifted LEFT by dx so top & bottom align with
            // the hamburger, the middle bulges past it. R clears the HH's right edge. (Tracker geometry.)
            const r = $('menu-fab').getBoundingClientRect();
            stack.style.left = (r.left + r.width / 2) + 'px';   // origin = HH centre
            stack.style.top = (r.top + r.height / 2) + 'px';
            const n = btns.length, bh = 46, gap = 10, step = bh + gap, bw = 168;
            const halfH = (n - 1) * step / 2;
            const R = halfH + 44;
            const xMin = Math.sqrt(R * R - halfH * halfH);
            const dx = bw / 2 - r.width / 2 - xMin;
            btns.forEach((b, i) => {
                const y = i * step - halfH;
                const x = Math.sqrt(R * R - y * y) + dx;
                b.style.left = x + 'px';
                b.style.top = y + 'px';
            });
        }
        // Radial popup via the shared widget (js/radial-menu.js) — it owns open/close + the long-press /
        // right-click / outside-close mechanics; we supply the geometry, the per-open grey-out + guards.
        const radialMenu = RadialMenu({
            stack: miniStack,
            layout: trackerMenuLayout,
            onOpen: refreshMenuState,
            closeOnButtonTap: false,   // each menu button closes the popup itself
            longPress: 0,              // Doc: a long-press anywhere must NOT open the menu — only a tap on HH
            contextMenu: false,        // …and never open via contextmenu (Android long-press on a map tile <img> fires it)
            shouldOpen: (e) => {
                const t = e && e.target;
                if (t && t.closest && (t.closest('.wp-pin') || t.closest('#photo-lightbox'))) return false;
                if (fannedCluster) return false;                                    // a photo fan is open
                if ($('photo-lightbox').classList.contains('open')) return false;   // lightbox owns the screen
                return true;
            },
        });
        function openPopup() { radialMenu.open(); }
        function closePopup() { radialMenu.close(); }

        // ---- Overlay panels (track list + info) ----
        const ovBackdrop = $('ov-backdrop');
        function showPanel(id) {
            // One overlay at a time: close any open panel FIRST. Otherwise a panel opened
            // from inside another (e.g. "Info anzeigen" within Einstellungen) lands behind
            // it in the DOM stacking order and looks like nothing happened.
            document.querySelectorAll('.ov-panel.open').forEach(p => p.classList.remove('open'));
            ovBackdrop.classList.add('open');
            $(id).classList.add('open');
        }
        function hidePanels() {
            ovBackdrop.classList.remove('open');
            document.querySelectorAll('.ov-panel').forEach(p => p.classList.remove('open'));
        }
        ovBackdrop.addEventListener('click', hidePanels);
        $('list-close').addEventListener('click', hidePanels);

        // Umkreis-Filter buttons (Alle / 10 / 20 / 30 km). Lazy-loads each track's start point on first use
        // (cheap points->0 query), then re-renders the list filtered + sorted nearest-first around here.
        (function () {
            const seg = Array.from(document.querySelectorAll('.seg-btn[data-radius]'));
            if (!seg.length) return;
            const reflect = () => seg.forEach((b) => b.classList.toggle('active', (parseInt(b.getAttribute('data-radius'), 10) || 0) === listRadiusKm));
            seg.forEach((b) => b.addEventListener('click', async () => {
                listRadiusKm = parseInt(b.getAttribute('data-radius'), 10) || 0;
                reflect();
                if (listRadiusKm > 0 && !trackStartCache) {
                    toast('Umkreis: Startpunkte werden geladen …');
                    try { await loadTrackStarts(); } catch (e) { toast('Umkreis: Laden fehlgeschlagen.'); }
                }
                renderTrackList(_lastTrackRows);
            }));
            reflect();
        })();
        $('info-close').addEventListener('click', hidePanels);
        $('live-close').addEventListener('click', hidePanels);
        $('nav-close').addEventListener('click', hidePanels);
        // One button: start the live broadcast AND copy the viewer link in one tap.
        $('live-go').addEventListener('click', async () => {
            const v = ($('live-name').value || '').trim() || 'vsb';
            const url = new URL('view.html?live=' + encodeURIComponent(v.toLowerCase()), location.href).href;
            let copied = false;
            try { await navigator.clipboard.writeText(url); copied = true; } catch (e) {}
            hidePanels();
            beginLive(v, copied); // "Link kopiert ✓" rides on beginLive's (last) toast so it isn't overwritten
        });

        // ---- Popup actions ----

        // GPS-Nachbearbeitung Stufe 1.2 — non-destructive: toggles a despike+smooth pass on the
        // DISPLAYED line only (TrackSmooth). Stored data stays raw; tap again to see the original.
        $('mb-smooth').addEventListener('click', () => {
            hidePanels(); // GLÄTTEN now lives in the settings "Tracks" card → close it so the track is visible
            if (!track || !track.length) { toast('Kein Track geladen.'); return; }
            smoothOn = !smoothOn;
            $('mb-smooth').classList.toggle('active', smoothOn); // green when on (like the REGEN toggle)
            redrawTrack();
            toast(smoothOn ? 'Glättung an (nur Anzeige, Daten unberührt)' : 'Glättung aus');
        });

        // GPS-Nachbearbeitung Stufe 1.3 — DEM height: replace the noisy GPS+baro altitude with the
        // terrain elevation from a digital elevation model (Open-Meteo / Copernicus GLO-90). Async (one
        // network fetch, then cached). Non-destructive: fills demAlts[] and flips a display+GPX toggle;
        // the stored raw alts stay untouched. Tap again to switch back.
        $('mb-dem').addEventListener('click', async () => {
            hidePanels();
            if (demBusy) return;
            if (!track || !track.length) { toast('Kein Track geladen.'); return; }
            if (demOn) { // turn off → back to raw GPS+baro
                demOn = false;
                $('mb-dem').classList.remove('active');
                renderAltitude();
                toast('DEM-Höhe aus');
                return;
            }
            if (demAlts.length !== track.length) { // fetch once per loaded track, then it's cached
                if (typeof TrackDem === 'undefined') { toast('DEM-Modul fehlt.'); return; }
                demBusy = true;
                toast('DEM-Höhe: lade Gelände …');
                try {
                    demAlts = await TrackDem.elevations(track, (d, t) => { if (t > 1) toast('DEM-Höhe: ' + d + '/' + t + ' …'); });
                } catch (e) {
                    demBusy = false;
                    toast('DEM fehlgeschlagen (offline?).');
                    if (window.DebugWindow) DebugWindow.log('DEM: ' + (e && (e.message || e)));
                    return;
                }
                demBusy = false;
            }
            demOn = true;
            $('mb-dem').classList.add('active');
            renderAltitude();
            const dem = ascentDescent(demAlts), gps = ascentDescent(alts);
            toast('DEM-Höhe an · ↑ ' + dem.up + ' m  ↓ ' + dem.down + ' m  (GPS war ↑ ' + gps.up + ')');
        });

        $('mb-load').addEventListener('click', async () => {
            closePopup();
            toast('Lade Liste …');
            let rows;
            try { rows = await listTracks(); }
            catch (e) { toast('Laden fehlgeschlagen: ' + (e.message || e)); return; }
            renderTrackList(rows);
            showPanel('track-list');
        });

        // POI (FEAT-24): the radial "POI" entry opens a category checkbox panel à la LADEN. The flags
        // persist; the POI layer (tracker-poi.js) reads them and queries OSM/Overpass (keyless). The
        // sightseeing categories default ON, the rest OFF. "Tanken" is plain OSM amenity=fuel (station
        // locations, NO key needed) — Tankerkönig live prices stay a separate FEAT-26 enrichment.
        [['poi-cat-sights', 1], ['poi-cat-views', 1], ['poi-cat-historic', 1], ['poi-cat-nature', 1],
        ['poi-cat-service', 0], ['poi-cat-food', 0], ['poi-cat-lodging', 0], ['poi-cat-fuel', 0],
        ['poi-cat-speedcam', 0], ['poi-cat-feen', 0]].forEach(([id, def]) => {
            const el = $(id); if (!el) return;
            const saved = localStorage.getItem(id);
            el.checked = saved == null ? !!def : saved === '1';
            el.addEventListener('change', () => {
                localStorage.setItem(id, el.checked ? '1' : '0');
                if (__poi) __poi.refresh();   // category toggled → re-query the visible area
            });
        });
        // Fuel selectors (Doc 2026-06-19): two dropdowns behind "Tanken" — fuel type (the ⛽ price pins
        // show THIS fuel's price) and search range (1/2/5 km). __fuel.setFuelType/setRange persist to
        // localStorage themselves; here we just reflect the stored choice into the <select>s.
        (function () {
            const selType = $('fuel-type'), selRange = $('fuel-range');
            if (selType) {
                selType.value = (__fuel && __fuel.fuelType) || localStorage.getItem('trk-fuel-type') || 'e5';
                selType.addEventListener('change', () => { if (__fuel && __fuel.setFuelType) __fuel.setFuelType(selType.value); });
                if (window.CyberSelect) CyberSelect.enhance(selType); // theme-styled dropdown (native option list can't be styled)
            }
            if (selRange) {
                selRange.value = String((__fuel && __fuel.range) || localStorage.getItem('trk-fuel-rad') || 5);
                selRange.addEventListener('change', () => { if (__fuel && __fuel.setRange) __fuel.setRange(selRange.value); });
                if (window.CyberSelect) CyberSelect.enhance(selRange);
            }
        })();
        $('mb-poi').addEventListener('click', () => { closePopup(); showPanel('poi-panel'); if (__poi) __poi.refresh(); });
        $('poi-close').addEventListener('click', hidePanels);

        // SHARE TRACK (popup) — share the current track (same action as TEILEN)
        $('mb-sharetrack').addEventListener('click', () => {
            closePopup();
            if (loadedTrackIds.size > 1) { shareMultiple(Array.from(loadedTrackIds)); return; } // multi-load → one bundled link
            if (currentTrackId) { shareTrack(currentTrackId, currentTrackName); return; }        // single loaded/saved track
            toast('Erst einen Track laden oder speichern.');
        });
        $('mb-live').addEventListener('click', () => { closePopup(); if (liveOn) stopLive(); else openLivePanel(); });
        // Info card (settings) → open the GNSS-sources info panel
        $('set-info').addEventListener('click', () => { $('info-body').innerHTML = (gnssActive ? gnssLiveHtml() : '') + GNSS_INFO; showPanel('info-panel'); });
        // REGEN toggles the optional rain-radar overlay; reflect on/off on the button (.active).
        $('mb-rain').addEventListener('click', (e) => {
            const isOn = RainRadar.toggle();
            e.currentTarget.classList.toggle('active', isOn);
            localStorage.setItem(RAIN_KEY, isOn ? '1' : '0'); // persist REGEN across restarts
            toast(isOn ? 'Regenradar an' : 'Regenradar aus');
            closePopup();
        });
        $('menu-fab').addEventListener('click', () => openPopup());
        // Long-press / right-click must do NOTHING now (longPress:0 + contextMenu:false on the menu above).
        // But the widget used to swallow the native Android long-press menu ("Bild speichern" on map-tile
        // <img>s) via its own contextmenu handler — keep that suppressed so a long-press just does nothing.
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        $('zoom-in').addEventListener('click', () => { enterHandMode(); map.zoomIn(); });   // hand zoom → freeze auto
        $('zoom-out').addEventListener('click', () => { enterHandMode(); map.zoomOut(); }); // hand zoom → freeze auto
        // Resume arrow: back to the auto-mode that was active before the hand take-over (follow OR FIT).
        $('resume-fab').addEventListener('click', resumeAuto);
        // ONE button: tapping the FIT frame cycles FIT (whole → remaining → off); tapping the crosshair re-centres.
        $('recenter-fab').addEventListener('click', () => {
            clearHandMode(); // CENTER / FIT explicitly take over → leave hand-mode (hide the resume arrow)
            if (!$('recenter-fab').classList.contains('fit')) { centerOnPosition(); return; }   // crosshair → re-centre
            const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng();
            const rb = (ll && __nav && __nav.remainingBounds) ? __nav.remainingBounds([ll.lat, ll.lng]) : null;
            if (!fitMode) {                              // off → fit the whole track (live OR multi-loaded overlay)
                fitMode = 'all'; setFollowing(false);
                const fb = track.length > 1 ? L.latLngBounds(track) : loadedBounds;
                if (fb) { try { map.fitBounds(fb, { padding: fitPad() }); } catch (e) { } }
                toast('FIT: ganze Route');
            } else if (fitMode === 'all' && rb) {        // whole → remaining (only if a route exists)
                fitMode = 'remaining';
                try { map.fitBounds(rb, { padding: fitPad() }); } catch (e) { }
                toast('FIT: Reststrecke');
            } else {                                     // remaining (or no route) → off → re-centre on you (#3)
                fitMode = false;
                centerOnPosition();
                toast('FIT aus');
            }
            refreshRecenter();
        });

        // ---- Sync-Code ----
        function genCode() {
            const cs = 'abcdefghjkmnpqrstuvwxyz23456789'; // no ambiguous chars
            const a = new Uint8Array(12);
            crypto.getRandomValues(a);
            let s = '';
            for (let i = 0; i < 12; i++) { if (i && i % 4 === 0) s += '-'; s += cs[a[i] % cs.length]; }
            return s;
        }
        // Render the panel for the current state: connected → show the code; else → the entry actions.
        function updateSyncStatus() {
            const code = getSyncCode();
            const connected = !!code;
            $('sync-connected').hidden = !connected;
            $('sync-disconnected').hidden = connected;
            $('sync-confirm').hidden = true;   // always reset the disconnect confirmation
            if (connected) {
                $('sync-code-val').textContent = code;
            } else {
                $('sync-enter').hidden = true;   // collapse the code-entry section again
                $('sync-input').value = '';
            }
        }
        $('mb-settings').addEventListener('click', () => { closePopup(); updateSyncStatus(); loadUsage(); updateReburnButton(); refreshMenuState(); refreshRainStatus(); renderTrackStats(); showPanel('settings-panel'); });
        // Settings → Debug: live source-health dots for the rain radar (DWD + RainViewer).
        function refreshRainStatus() {
            const setDot = (id, st) => {
                const el = $(id); if (!el) return;
                el.classList.remove('ok', 'down', 'unknown');
                if (st === true) { el.classList.add('ok'); el.textContent = '●'; }
                else if (st === false) { el.classList.add('down'); el.textContent = '⊘'; }
                else { el.classList.add('unknown'); el.textContent = '…'; }
            };
            setDot('dbg-dwd-status', null); setDot('dbg-rv-status', null); // "probing…"
            if (window.RainRadar && RainRadar.checkHealth) {
                RainRadar.checkHealth().then((s) => { setDot('dbg-dwd-status', s.dwd); setDot('dbg-rv-status', s.rv); }).catch(() => { });
            }
        }
        $('mb-ziel').addEventListener('click', () => { closePopup(); if (__nav) __nav.openPanel(); });
        // Foto-Spur card → re-run the AI analysis on still-unrecognised photos
        $('set-reburn').addEventListener('click', async () => { await reburnTrack(); updateReburnButton(); });
        // "Code erzeugen" generates AND connects this device in one step
        $('sync-gen').addEventListener('click', async () => {
            toast('Verbinde …');
            try {
                await connectSync(genCode());
                updateSyncStatus();
                toast('Code erzeugt & verbunden.');
            } catch (e) { toast('Fehlgeschlagen: ' + (e.message || e)); }
        });
        // Tap the big code (in either the connected view or the disconnect confirmation) → copy
        async function copyActiveCode() {
            const code = getSyncCode();
            if (!code) return;
            try { await navigator.clipboard.writeText(code); toast('Code kopiert.'); }
            catch (e) { toast('Kopieren ging nicht.'); }
        }
        $('sync-code').addEventListener('click', copyActiveCode);
        $('sync-code-confirm').addEventListener('click', copyActiveCode);
        // Reveal the code-entry field only on demand
        $('sync-enter-toggle').addEventListener('click', () => {
            $('sync-enter').hidden = false;
            $('sync-input').focus();
        });
        $('settings-close').addEventListener('click', hidePanels);

        // Settings → Debug: show/hide the on-screen DebugWindow AND the bottom debug bar (BUILD + motion).
        // Both follow the same toggle; default OFF; persisted in localStorage.
        // DebugWindow.show/hide auto-init; we wire after DOMContentLoaded so its own init() ran first.
        (function () {
            const KEY = 'tracker.dbgWindow';
            function applyDebug(on) {
                document.body.classList.toggle('dbg-on', on); // bottom bar (#motion-dbg) visibility
                if (window.DebugWindow) (on ? DebugWindow.show() : DebugWindow.hide());
            }
            function wire() {
                const cb = $('dbg-window-toggle'); if (!cb || cb._wired) return; cb._wired = true;
                const on = localStorage.getItem(KEY) === '1'; // default OFF
                cb.checked = on;
                applyDebug(on);
                cb.addEventListener('change', () => {
                    localStorage.setItem(KEY, cb.checked ? '1' : '0');
                    applyDebug(cb.checked);
                });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
            else wire();
        })();

        // Settings → Debug: toggle the over-speed bell (state lives in the speed-limit module, persisted).
        (function () {
            function wire() {
                const cb = $('speed-bell-toggle'); if (!cb || cb._wired) return; cb._wired = true;
                cb.checked = !__speed || !__speed.bellEnabled || __speed.bellEnabled(); // default ON
                cb.addEventListener('change', () => { if (__speed && __speed.setBell) __speed.setBell(cb.checked); });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
            else wire();
        })();

        // Settings → Debug: mobile shortcut keys — tap fires the otherwise keyboard-only d/k/w handlers.
        // A toggle shows/hides the key row (default OFF, persisted).
        (function () {
            const KEY = 'tracker.scKeys';
            function applyKeys(on) {
                const row = $('sc-keys-row'); if (row) row.style.display = on ? '' : 'none';
            }
            function wire() {
                [['sc-d', 'd'], ['sc-k', 'k'], ['sc-w', 'w']].forEach(([id, key]) => {
                    const b = $(id); if (!b || b._wired) return; b._wired = true;
                    b.addEventListener('click', () => {
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true }));
                    });
                });
                const cb = $('sc-keys-toggle'); if (!cb || cb._wired) return; cb._wired = true;
                const on = localStorage.getItem(KEY) === '1'; // default OFF
                cb.checked = on;
                applyKeys(on);
                cb.addEventListener('change', () => {
                    localStorage.setItem(KEY, cb.checked ? '1' : '0');
                    applyKeys(cb.checked);
                });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
            else wire();
        })();

        // Settings cards are collapsible (default collapsed).
        // Collapsed → tapping anywhere on the card expands it (big touch target, easy on phones).
        // Expanded  → only the title bar collapses it, so body controls (checkboxes/buttons) keep working.
        $('settings-panel').addEventListener('click', (e) => {
            const card = e.target.closest('.set-card');
            if (!card) return;
            if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
            else if (e.target.closest('.set-card-title')) card.classList.add('collapsed');
        });
        $('sync-connect').addEventListener('click', async () => {
            const code = $('sync-input').value.trim();
            if (code.length < 4) { toast('Code zu kurz (min. 4 Zeichen).'); return; }
            toast('Verbinde …');
            try {
                const n = await connectSync(code);
                updateSyncStatus();
                toast(n > 0 ? ('Verbunden — ' + n + ' Track(s) übernommen.') : 'Verbunden.');
            } catch (e) { toast('Sync fehlgeschlagen: ' + (e.message || e)); }
        });
        // "Trennen" no longer disconnects directly → it opens the confirmation first
        $('sync-clear').addEventListener('click', () => {
            $('sync-code-confirm-val').textContent = getSyncCode();
            $('sync-connected').hidden = true;
            $('sync-confirm').hidden = false;
        });
        $('sync-clear-cancel').addEventListener('click', () => updateSyncStatus());
        // Only THIS actually disconnects
        $('sync-clear-confirm').addEventListener('click', async () => {
            toast('Trenne …');
            try { await clearSyncCode(); updateSyncStatus(); toast('Getrennt — dieses Gerät ist jetzt leer.'); }
            catch (e) { toast('Fehlgeschlagen: ' + (e.message || e)); }
        });

        function fmtDur(s) { const m = Math.round(s / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0') + ' h'; }
        // Track-list badge glyphs (our pin style): speaker for a voice note, camera for photos.
        const SPEAKER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        const CAMERA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
        const VIDEO_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>';
        const APPICON = '<img class="tl-appicon" src="icon.svg" alt="">'; // our app icon = the track badge
        function mkBadge(kind, svg, count) {
            const b = document.createElement('div');
            b.className = 'tl-badge ' + kind;
            b.innerHTML = svg;
            if (count) { const c = document.createElement('span'); c.className = 'tl-badge-n'; c.textContent = count; b.appendChild(c); }
            return b;
        }
        // Sort key = the track's REAL recording date, parsed from its name ("DD.MM., HH:MM"), NOT
        // created_at: an imported copy is created NOW but recorded earlier, so created_at would shove it
        // to the top. Year comes from the name if present, else inferred from created_at. A renamed track
        // with no date in its name falls back to created_at. Returns epoch ms.
        function trackDateMs(r) {
            const m = ((r && r.name) || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})?[\s,]*(\d{1,2}):(\d{2})/);
            if (m) {
                let yr = m[3] ? +m[3] : (r.created_at ? new Date(r.created_at).getFullYear() : new Date().getFullYear());
                if (yr < 100) yr += 2000;
                return new Date(yr, (+m[2]) - 1, +m[1], +m[4], +m[5]).getTime();
            }
            return (r && r.created_at) ? new Date(r.created_at).getTime() : 0;
        }
        function renderTrackList(rows) {
            const box = $('track-list-items');
            box.innerHTML = '';
            _lastTrackRows = (rows || []).slice();
            rows = _lastTrackRows.slice().sort((a, b) => trackDateMs(b) - trackDateMs(a)); // newest REAL date first
            // Umkreis filter: distance (km) from here to a track's start, or null if either is unknown.
            const here = posMarker && posMarker.getLatLng ? posMarker.getLatLng() : null;
            const distOf = (r) => {
                const s = trackStartCache && trackStartCache[r.id];
                return (here && s) ? haversine([here.lat, here.lng], s) / 1000 : null;
            };
            if (listRadiusKm > 0) {
                if (!here) { box.innerHTML = '<div class="tl-empty">Keine GPS-Position — die Umkreis-Suche braucht deinen Standort.</div>'; return; }
                rows = rows.filter((r) => { const d = distOf(r); return d != null && d <= listRadiusKm; })
                    .sort((a, b) => distOf(a) - distOf(b));   // nearest first when filtering by radius
                if (!rows.length) { box.innerHTML = '<div class="tl-empty">Keine Tracks im Umkreis von ' + listRadiusKm + ' km.</div>'; return; }
            }
            selectedTracks.clear(); loadedTrackIds.forEach((id) => selectedTracks.add(id)); updateLoadSel(); // pre-select the loaded tracks
            if (!rows.length) { box.innerHTML = '<div class="tl-empty">Noch keine gespeicherten Tracks.</div>'; return; }
            rows.forEach((r) => {
                const row = document.createElement('div');
                row.className = 'tl-row';
                const chk = document.createElement('input');                 // multi-select checkbox, before the icon
                chk.type = 'checkbox'; chk.className = 'tl-check'; chk.title = 'Für Mehrfach-Laden auswählen';
                chk.checked = selectedTracks.has(r.id);
                chk.addEventListener('change', () => { if (chk.checked) selectedTracks.add(r.id); else selectedTracks.delete(r.id); updateLoadSel(); });
                row.appendChild(chk);
                // sensible stats instead of the (redundant) date: km · duration · photos · Ø speed
                const isVoice = /^Sprachnotiz/i.test(r.name || '');   // one-point voice track
                const isVideo = /^Video/i.test(r.name || '');         // one-point video clip
                const isPoint = !r.distance_m;                        // 0 / null → single-point recording (km meaningless)
                const stats = [];
                if (!isPoint) {
                    stats.push((r.distance_m / 1000).toFixed(2) + ' km');
                    if (r.duration_s) stats.push(fmtDur(r.duration_s));
                    if (r.duration_s && r.distance_m) stats.push(((r.distance_m / 1000) / (r.duration_s / 3600)).toFixed(1) + ' km/h');
                }
                const dKm = distOf(r);
                if (listRadiusKm > 0 && dKm != null) stats.push('📍 ' + dKm.toFixed(1) + ' km');
                const main = document.createElement('div');
                main.className = 'tl-main';
                const nm = document.createElement('div'); nm.className = 'tl-name';
                nm.textContent = (r.name || '').replace(/^Track\s+/, '').replace(/^Sprachnotiz\s+/i, ''); // drop "Track "/"Sprachnotiz " → date stays prominent
                const mt = document.createElement('div'); mt.className = 'tl-meta';
                mt.textContent = stats.join(' · ');
                main.appendChild(nm);
                if (mt.textContent) main.appendChild(mt);   // skip an empty meta line
                // OUR badge BEFORE the name: blue speaker (voice note), green camera (single photo),
                // app-icon TRACK badge for a real track (a camera would lie when the track also holds voice).
                let badge;
                if (isVoice) badge = mkBadge('voice', SPEAKER_ICON, 0);
                else if (isVideo) badge = mkBadge('video', VIDEO_ICON, 0);
                else if (isPoint) badge = mkBadge('cam', CAMERA_ICON, 0);
                else badge = mkBadge('track', APPICON, r.photo_count);
                row.appendChild(badge);                     // row's first child → left of `main`
                main.addEventListener('click', async () => {
                    toast('Lade Track …');
                    try { const t = await fetchTrack(r.id); plotTrack(t.points, t.waypoints); currentTrackId = r.id; currentTrackName = r.name; loadedTrackIds.clear(); loadedTrackIds.add(r.id); persistLoaded([{ id: r.id, name: r.name }]); hidePanels(); toast(r.name + ' geladen.'); }
                    catch (e) { toast('Track laden fehlgeschlagen.'); }
                });
                const sh = document.createElement('button');
                sh.className = 'tl-share'; sh.title = 'Teilen';
                sh.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
                sh.addEventListener('click', (ev) => { ev.stopPropagation(); shareTrack(r.id, r.name); });
                row.appendChild(main); row.appendChild(sh);
                if (ALLOW_DELETE) { // cloud-delete disabled for now → no × button (see removeTrack)
                    const del = document.createElement('button');
                    del.className = 'tl-del'; del.title = 'Löschen';
                    del.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
                    del.addEventListener('click', async (ev) => {
                        ev.stopPropagation();
                        if (!(await uiConfirm('Track löschen?', { danger: true, okText: 'Löschen' }))) return;
                        try { await removeTrack(r.id); row.remove(); toast('Gelöscht.'); }
                        catch (e) { toast('Löschen fehlgeschlagen.'); }
                    });
                    row.appendChild(del);
                }
                box.appendChild(row);
            });
        }

        const GNSS_INFO =
            '<p>Dein Gerät bestimmt seine Position aus <b>mehreren Quellen gleichzeitig</b> und nimmt jeweils ' +
            'die beste — je nachdem, was gerade verfügbar und am genauesten ist.</p>' +
            '<h4>Satelliten · GNSS</h4>' +
            '<p>Globale Navigations-Satelliten-Systeme: Dein Gerät empfängt Signale mehrerer Satelliten und ' +
            'berechnet aus deren Laufzeiten die Position. Am genauesten (Meter), braucht aber freie Sicht zum ' +
            'Himmel. Mehrere Systeme zusammen (Multi-GNSS) → schneller und genauer:</p>' +
            '<h4>GPS · USA</h4>' +
            '<p>„Global Positioning System", betrieben von der <b>US Space Force</b>. Das älteste und ' +
            'bekannteste System, rund 31 Satelliten, seit 1978.</p>' +
            '<h4>GLONASS · Russland</h4>' +
            '<p>Russisches Gegenstück, betrieben von Roskosmos.</p>' +
            '<h4>Galileo · Europa</h4>' +
            '<p>Ziviles System der <b>EU/ESA</b> — sehr genau, kein Militär dahinter.</p>' +
            '<h4>Baidu · China</h4>' +
            '<p>Chinesisches System, seit 2020 global.</p>' +
            '<h4>QZSS · Japan &amp; NavIC · Indien</h4>' +
            '<p>Regionale Systeme, die GPS über Asien bzw. Indien ergänzen.</p>' +
            '<h4>WLAN</h4>' +
            '<p>Ohne GPS (z. B. am Laptop) schätzt das Gerät die Position aus den umliegenden WLAN-Routern: ' +
            'deren Kennungen werden in einer Datenbank (Apple/Google) nachgeschlagen, die weiß, wo sie stehen. ' +
            'Klappt auch drinnen, Genauigkeit etwa 20–50 m.</p>' +
            '<h4>Funkzelle</h4>' +
            '<p>Aus den Mobilfunk-Masten in Reichweite — grob (hunderte Meter bis Kilometer), dafür fast ' +
            'überall verfügbar.</p>' +
            '<h4>IP-Adresse</h4>' +
            '<p>Die gröbste Notlösung: ungefähr der Standort deines Internet-Anbieters. Kann zig Kilometer ' +
            'danebenliegen.</p>' +
            '<h4>Wer trägt bei?</h4>' +
            '<p>Welche Quelle gerade zu Deiner Positionsbestimmung beiträgt (und welche Satelliten), kann nur ' +
            'die native App zeigen (Android GnssStatus) — im Browser gibt die Standort-API das nicht her.</p>';

        // ---------------------------------------------------------------
        // Keep Leaflet sized correctly
        // ---------------------------------------------------------------
        function init() {
            map.invalidateSize();
        }
        window.addEventListener('resize', init);
        document.fonts.ready.then(init);
        setTimeout(init, 300);

        // ---------------------------------------------------------------
        // Native GNSS status — the REAL constellations feeding the fix
        // (Android GnssStatus via our GnssInfo plugin). On the web GnssInfo
        // is null → this stays inert and the accuracy heuristic is used.
        // ---------------------------------------------------------------
        const GnssInfo = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.GnssInfo) || null;
        const CON_NAMES = { GAL: 'Galileo', GPS: 'GPS', GLO: 'GLONASS', BDS: 'Baidu', QZS: 'QZSS', NAV: 'NavIC', SBAS: 'SBAS', '?': 'unbekannt' };
        let gnssListenerAdded = false;

        function conSortedByCount(obj) {
            const keys = Object.keys(obj || {});
            keys.sort((a, b) => obj[b] - obj[a]); // most-used first (in DE that's often Galileo)
            return keys;
        }
        // Always show this fixed set in fixed order (grey); the contributing ones turn green.
        // Fixed = stable: nothing reorders/appears/disappears → calm HUD (no flicker).
        const GNSS_ALL = ['GPS', 'GLO', 'GAL', 'BDS'];
        function renderGnssChip(d) {
            const used = (d && d.usedByConstellation) || {};
            const view = (d && d.viewByConstellation) || {}; // visible sats per constellation
            elSrc.innerHTML = GNSS_ALL
                .map(c => '<span class="sat' + ((used[c] || 0) > 0 ? ' on' : '') + '">' + CON_NAMES[c] + ' <span class="sat-n">' + (view[c] || 0) + '</span></span>')
                .join('<span class="sat-sep">&nbsp;&nbsp;</span>');
        }
        function gnssLiveHtml() {
            const d = gnssLatest; if (!d) return '';
            const used = d.usedByConstellation || {}, view = d.viewByConstellation || {};
            const rows = conSortedByCount(view).map(c =>
                '<p><b>' + (CON_NAMES[c] || c) + '</b>: ' + (used[c] || 0) + ' genutzt · ' + (view[c] || 0) + ' sichtbar</p>'
            ).join('');
            return '<h4>Wer trägt gerade bei? (live)</h4>' +
                '<p>' + (d.used || 0) + ' Satelliten in Nutzung, ' + (d.inView || 0) + ' sichtbar:</p>' + rows +
                '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:12px 0">';
        }
        function startGnss() {
            if (!GnssInfo) return; // web → no native GnssStatus
            if (!gnssListenerAdded) {
                GnssInfo.addListener('gnss', (d) => { gnssLatest = d; gnssActive = true; renderGnssChip(d); });
                gnssListenerAdded = true;
            }
            GnssInfo.start().catch(() => { }); // may reject until location permission is granted; retried on START
        }
        startGnss(); // best effort at load; also called from startTracking once permission is sure

        // ---------------------------------------------------------------
        // Travel mode (walk / run / bike / vehicle) — native Activity Recognition,
        // with a speed heuristic fallback on the web / before the first detection.
        // ---------------------------------------------------------------
        const ActRec = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.ActivityRecognition) || null;
        let currentActivity = 'unknown';
        let actListenerAdded = false;
        const MODE_ICON = { walking: '🚶', running: '🏃', on_bicycle: '🚴', in_vehicle: '🚗', still: '🧍', unknown: '📍' };

        function heuristicActivity(kmh) {
            if (kmh < 1.5) return 'still';
            if (kmh < 7) return 'walking';
            if (kmh < 14) return 'running';
            if (kmh < 32) return 'on_bicycle';
            return 'in_vehicle';
        }
        // Native detection wins once it has spoken; otherwise fall back to speed.
        function effectiveActivity() {
            return (ActRec && currentActivity !== 'unknown') ? currentActivity : heuristicActivity(shownSpeed);
        }
        function updateModeIcon() {
            const el = $('mode-icon');
            if (!el) return;
            const act = effectiveActivity();
            // Without a real GPS fix the MOVING guesses (walk/bike/car) are meaningless → hide them.
            // But "standing still" (0 km/h) is always a safe call → show 🧍 right away, no waiting.
            if (!gpsReal && act !== 'still') { el.style.display = 'none'; return; }
            el.style.display = '';
            const ic = MODE_ICON[act] || '📍';
            el.textContent = ic;
            // Re-centre only when the glyph actually changes (measuring per tick is wasteful).
            if (el.dataset.centered !== ic) { el.dataset.centered = ic; centerModeIcon(el); }
        }
        // MEASURED vertical centring (no eyeballing): we want the emoji's VISIBLE centre on
        // its line-box centre — which align-items:center already centres over the speed-col,
        // i.e. over BOTH HUD lines. Canvas measureText gives the metrics, all baseline-relative
        // (down = +):
        //   line-box centre → baseline = (fontDesc − fontAsc)/2     [line-height:1 box]
        //   baseline → glyph visible centre = (actDesc − actAsc)/2
        //   ⇒ glyph centre offset from box centre = (fontAsc − fontDesc)/2 + (actDesc − actAsc)/2
        // Translate by its negative. Divided by font-size → expressed in em, so it scales with
        // the clamp() size and survives resize/rotate. Falls back to the CSS nudge on old engines.
        function centerModeIcon(el) {
            try {
                const cs = getComputedStyle(el);
                const fpx = parseFloat(cs.fontSize) || 32;
                const ctx = centerModeIcon._ctx || (centerModeIcon._ctx = document.createElement('canvas').getContext('2d'));
                ctx.font = fpx + 'px ' + (cs.fontFamily || 'sans-serif');
                ctx.textBaseline = 'alphabetic';
                const m = ctx.measureText(el.textContent);
                const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
                const aa = m.actualBoundingBoxAscent, ad = m.actualBoundingBoxDescent;
                if ([fa, fd, aa, ad].some(v => typeof v !== 'number' || isNaN(v))) throw new Error('no TextMetrics');
                const ratio = (((fa - fd) + (ad - aa)) / 2) / fpx; // glyph-centre offset, in em
                el.style.transform = 'translateY(' + (-ratio).toFixed(4) + 'em) scaleX(-1)';
                if (window.DebugWindow) DebugWindow.log('mode-icon ' + el.textContent + ' centred: ' + (-ratio).toFixed(3) + 'em');
            } catch (e) {
                el.style.transform = ''; // drop inline → CSS translateY fallback applies
            }
        }
        async function startActivity() {
            if (!ActRec) { DebugWindow.log('🚶 ActRec: kein natives Plugin (web) → Speed-Heuristik'); return; } // web → heuristic only
            try {
                const p = await ActRec.requestPermission();
                DebugWindow.log('🚶 ActRec.requestPermission → granted=' + (p && p.granted));
                if (!p || !p.granted) return;
                if (!actListenerAdded) {
                    ActRec.addListener('activity', (d) => {
                        DebugWindow.log('🚶 ActRec event: type=' + (d && d.type) + ' conf=' + (d && d.confidence));
                        currentActivity = d.type || 'unknown';
                        updateModeIcon();
                    });
                    actListenerAdded = true;
                }
                await ActRec.start();
                DebugWindow.log('🚶 ActRec.start ✓ — warte auf Events …');
            } catch (e) { DebugWindow.log('🚶 ActRec FEHLER: ' + (e && (e.message || e))); /* heuristic fallback stays active */ }
        }
        async function stopActivity() { if (ActRec) { try { await ActRec.stop(); } catch (e) { } } }
        updateModeIcon();

        // On load: jump straight to the current position (no need to press centre),
        // then wait for better data before revealing the red dot.
        goToCurrentPosition({ initial: true });
        startAmbient(); // …and keep following live while idle (no recording needed) — Maps-style
    