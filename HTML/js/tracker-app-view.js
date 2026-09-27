// Doc Alvers Tracker - part 2 of 13: view fan, hand mode, basemap theme, keyboard, track statistics.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- View-fan open/close ----
        let fanOpen = false, fanTimer = null;
        function armFanTimeout() { clearFanTimeout(); fanTimer = setTimeout(closeFan, 4000); } // auto-collapse
        function clearFanTimeout() { if (fanTimer) { clearTimeout(fanTimer); fanTimer = null; } }
        function onFanOutside(e) { const fan = $('view-fan'); if (fan && !fan.contains(e.target)) closeFan(); }
        function openFan() {
            // No other mode to pick? Then there's nothing to fan — just (re-)apply the current mode
            // directly (e.g. follow → re-centre, fit → re-frame), like a plain button.
            if (buildFanOptions() === 0) { selectViewMode(currentMode()); return; }
            fanOpen = true;
            const fan = $('view-fan'); if (fan) fan.classList.add('open');
            document.addEventListener('pointerdown', onFanOutside, true); // tap outside → collapse
            armFanTimeout();
        }
        function closeFan() {
            if (!fanOpen) return;
            fanOpen = false;
            const fan = $('view-fan'); if (fan) fan.classList.remove('open');
            document.removeEventListener('pointerdown', onFanOutside, true);
            clearFanTimeout();
        }
        // Apply a picked mode, then collapse the fan. "hand" is a no-op (you're already in that view);
        // picking any non-hand mode leaves hand-mode → the transient hand option drops away next open.
        function selectViewMode(m) {
            closeFan();
            if (m === 'hand') return;
            if (m === 'follow') { centerOnPosition(); return; } // clears hand-mode + fit, re-follows
            clearHandMode();
            autoZoomHold = false; // picking a FIT mode is an explicit "resume auto" → let it re-frame the zoom
            const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng();
            if (m === 'fitall') {
                fitMode = 'all'; setFollowing(false);
                const fb = wholeRouteBounds(ll ? [ll.lat, ll.lng] : null);   // driven ∪ remaining (whole journey)
                if (fb) { try { map.fitBounds(fb, { padding: fitPad() }); } catch (e) { } }
                toast('FIT: ganze Route');
            } else if (m === 'fitrem') {
                const rb = (ll && __nav && __nav.remainingBounds) ? __nav.remainingBounds([ll.lat, ll.lng]) : null;
                fitMode = 'remaining'; setFollowing(false);
                if (rb) { try { map.fitBounds(rb, { padding: fitPad() }); } catch (e) { } }
                toast('FIT: Reststrecke');
            }
            refreshRecenter();
        }
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
                    : wholeRouteBounds(ll ? [ll.lat, ll.lng] : null);   // 'all' → driven ∪ remaining
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
        // (The position dot is an SVG circleMarker — Leaflet transforms it WITH the map during a zoom, so it
        // stays glued and crisp. We used to hard-hide it (opacity:0) on zoomstart and restore on zoomend, but
        // because .pos-marker has `transition: opacity 0.6s`, the dot then FADED back in after every zoom →
        // the "Punkt blinkt" Doc saw. Removed: the dot just zooms along, no blink (Doc 2026-06-24).)
        //
        // The recorded TRACK is drawn by Leaflet.hotline on a CANVAS (smooth speed gradient); Leaflet bitmap-
        // SCALES that canvas during a zoom (ugly "Bildpixel hochgezogen"), then redraws it crisp at zoomend.
        // So we hide the track canvas for the DURATION of the zoom and fade it back in cleanly once it's sharp
        // again (Doc 2026-06-24). SVG layers (nav route, dot) stay visible — they zoom as crisp vectors.
        function trackCanvases() { try { return map.getPanes().overlayPane.querySelectorAll('canvas'); } catch (e) { return []; } }
        map.on('zoomstart', () => { trackCanvases().forEach((c) => { c.style.transition = 'none'; c.style.opacity = '0'; }); });
        map.on('zoomend', () => {
            trackCanvases().forEach((c) => {
                requestAnimationFrame(() => { c.style.transition = 'opacity 0.25s ease'; c.style.opacity = '1'; }); // redrawn crisp → fade in
            });
        });

        // Basemap themes (Doc 2026-06-27): default AUTO — light (OSM) by day, dark (CARTO) at night, decided
        // from the sun's position at the current fix. Plain dark was too hard to read / see the streets while
        // driving in daylight. "Hell" / "Dunkel" force one design. CARTO dark_matter is the dark source; both
        // need the OSM credit, dark also CARTO.
        const BASEMAPS = {
            dark: {
                url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', sub: 'abcd', maxNativeZoom: 20, bg: 'rgb(8, 20, 42)',
                attrib: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &middot; &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
            },
            // Day, "lean" — CARTO Voyager: same OSM data, a navigation render (muted land, road hierarchy,
            // far fewer POIs) → much less cluttered than raw OSM Standard while driving (Doc 2026-07-06).
            lean: {
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', sub: 'abcd', maxNativeZoom: 20, bg: '',
                attrib: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &middot; &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
            },
            // Day, dense — raw OpenStreetMap Standard tiles (everything mappers put on the map).
            osm: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', sub: 'abc', maxNativeZoom: 19, bg: '',
                attrib: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
            },
        };
        const MAP_THEME_KEY = 'trk_map_theme';
        const MAP_PREFS = ['auto', 'light', 'dark'];
        // The DAY (light) basemap has two flavours, independent of the Auto/Hell/Dunkel brightness axis:
        // 'osm' = raw OSM Standard (default), 'lean' = CARTO Voyager (Google-Maps-lean, but fainter). Persisted.
        const DAY_STYLE_KEY = 'trk_day_style';
        const DAY_STYLES = ['osm', 'lean'];
        let dayStyle = DAY_STYLES.includes(localStorage.getItem(DAY_STYLE_KEY)) ? localStorage.getItem(DAY_STYLE_KEY) : 'osm'; // DEFAULT osm
        let themePref = MAP_PREFS.includes(localStorage.getItem(MAP_THEME_KEY)) ? localStorage.getItem(MAP_THEME_KEY) : 'auto'; // DEFAULT auto
        let mapTheme = 'osm';    // the RESOLVED basemap key on the map ('osm' | 'lean' | 'dark')
        let baseMap = null;
        let lastFix = null;        // last GPS fix { lat, lng, t } — declared here so the AUTO map theme can read it at init
        // DEBUG: hide the background map → judge the rain-radar colours with no terrain underneath.
        //   key 'k' → dark backdrop · key 'w' → white backdrop · same key again → map back on.
        let hgMode = 'on'; // 'on' | 'dark' | 'white'
        function makeBaseLayer(theme) {
            const b = BASEMAPS[theme] || BASEMAPS.light;
            return L.tileLayer(b.url, { subdomains: b.sub, maxNativeZoom: b.maxNativeZoom, maxZoom: 21 }); // upscales >maxNative so close photo pins separate
        }
        // AUTO day/night: true when the sun sits below civil twilight (-6°) at the current fix. Until we have
        // a GPS position, fall back to a plain clock rule (before 7h / from 21h local = night).
        function isNightNow() {
            const now = new Date();
            if (!lastFix) { const h = now.getHours(); return h < 7 || h >= 21; }
            const rad = Math.PI / 180;
            const start = new Date(now.getFullYear(), 0, 0);
            const doy = Math.floor((now - start) / 86400000);                          // day of year
            const decl = 23.44 * rad * Math.sin(2 * Math.PI * (doy - 81) / 365);        // solar declination (approx)
            const utcH = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
            const ha = (utcH + lastFix.lng / 15 - 12) * 15 * rad;                       // hour angle from local solar time
            const lat = lastFix.lat * rad;
            const elev = Math.asin(Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha));
            return elev < -6 * rad;
        }
        function resolveTheme(pref) {
            pref = MAP_PREFS.includes(pref) ? pref : 'auto';
            const wantDark = pref === 'dark' || (pref === 'auto' && isNightNow());
            return wantDark ? 'dark' : dayStyle; // 'dark' | 'lean' | 'osm'
        }
        // Apply the resolved theme to the map. No-op when it already matches (so the 5-min auto poll is cheap).
        function applyResolvedTheme() {
            const theme = resolveTheme(themePref);
            if (theme === mapTheme && baseMap) return;
            mapTheme = theme;
            if (baseMap) map.removeLayer(baseMap);
            baseMap = makeBaseLayer(theme);
            if (hgMode === 'on') { baseMap.addTo(map); map.getContainer().style.background = BASEMAPS[theme].bg; } // matching bg → no white flash between tiles
            const ab = document.querySelector('.attrib-body'); // keep the ⓘ credit correct per source (OSM, +CARTO when dark)
            if (ab) ab.innerHTML = BASEMAPS[theme].attrib;
        }
        // Set + persist the user PREFERENCE (auto/light/dark), then re-render the map.
        function setMapPref(pref) {
            themePref = MAP_PREFS.includes(pref) ? pref : 'auto';
            try { localStorage.setItem(MAP_THEME_KEY, themePref); } catch (e) { }
            applyResolvedTheme();
        }
        // Set + persist the DAY basemap flavour ('lean' | 'osm'); re-render live if a day map is showing.
        function setDayStyle(s) {
            dayStyle = DAY_STYLES.includes(s) ? s : 'lean';
            try { localStorage.setItem(DAY_STYLE_KEY, dayStyle); } catch (e) { }
            applyResolvedTheme();
        }
        applyResolvedTheme(); // initial basemap (auto → OSM day map by default)
        setInterval(() => { if (themePref === 'auto') applyResolvedTheme(); }, 5 * 60 * 1000); // flip at dusk/dawn while driving
        function applyHg(mode) {
            hgMode = mode;
            if (mode === 'on') { baseMap.addTo(map); map.getContainer().style.background = BASEMAPS[mapTheme].bg; }
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
        // Live "tail" (Doc 2026-06-30): the coloured track redraw is throttled (TRACK_REDRAW_MS) AND a
        // point is only recorded every minStep, so the DRAWN track lags behind the live position — leaving
        // an empty gap before the blue route, which redrawAhead trims to `here` every fix. Bridge it with a
        // small speed-coloured line from the last DRAWN point, through any un-drawn recent points, to the
        // live position, so the coloured track always reaches the dot. On its OWN map layer so the
        // throttled redrawTrack (clearLayers on trackLayer) can't wipe it mid-fix.
        let liveTailLine = null;   // the bridge segment (recording only)
        let lastDrawnIdx = 0;      // last track index included in the drawn coloured line
        function redrawTrack() {
            const t = (smoothOn && typeof TrackSmooth !== 'undefined' && TrackSmooth.smooth)
                ? TrackSmooth.smooth(track, times) : track;
            TrackRender.redraw({ track: t, times, speeds, activities, layer: trackLayer, usesHotline });
            lastDrawnIdx = track.length ? track.length - 1 : 0;
        }
        function clearLiveTail() { if (liveTailLine) { map.removeLayer(liveTailLine); liveTailLine = null; } }
        function updateLiveTail(here) {
            if (!tracking || !here || !track.length) { clearLiveTail(); return; }
            const from = Math.max(0, Math.min(lastDrawnIdx, track.length - 1));
            const tail = track.slice(from);                       // last drawn point + points since last redraw
            const data = tail.map((p, i) => {
                const kmh = speeds[from + i] != null ? speeds[from + i] : 0;
                return [p[0], p[1], TrackRender.speedToScale(kmh)];
            });
            data.push([here[0], here[1], TrackRender.speedToScale(shownSpeed)]); // …up to the live dot
            clearLiveTail();
            liveTailLine = usesHotline
                ? L.hotline(data, { weight: 5, outlineWidth: 1, outlineColor: 'rgba(8,20,42,0.6)', palette: TrackRender.SPEED_PALETTE, min: 0, max: 1 })
                : L.polyline(data.map((d) => [d[0], d[1]]), { color: TrackRender.COL_ORANGE, weight: 5, opacity: 0.9 });
            liveTailLine.addTo(map);
        }
        // Live recording calls redrawTrack on EVERY fix, and redrawTrack re-smooths + rebuilds the WHOLE track
        // (O(n)) each time → on a long drive that's thousands of segments rebuilt every second (CPU/GPU = battery).
        // Coalesce the live redraws to at most one per TRACK_REDRAW_MS; one-off redraws (load / toggle / glätten /
        // stop) still call redrawTrack() directly for an instant rebuild. (Doc 2026-06-26)
        const TRACK_REDRAW_MS = 2500;
        let _trackRedrawTimer = null, _trackRedrawLast = 0;
        function scheduleTrackRedraw() {
            if (_trackRedrawTimer) return;                       // a rebuild is already pending → it'll include this point
            const since = Date.now() - _trackRedrawLast;
            if (since >= TRACK_REDRAW_MS) { _trackRedrawLast = Date.now(); redrawTrack(); return; }
            _trackRedrawTimer = setTimeout(() => {
                _trackRedrawTimer = null; _trackRedrawLast = Date.now(); redrawTrack();
            }, TRACK_REDRAW_MS - since);
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
