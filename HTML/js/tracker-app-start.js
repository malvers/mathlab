// Doc Alvers Tracker - part 13 of 13: Leaflet sizing, GPS status list, travel mode, and the calls that start the app.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

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

        // A friend's ?import= link or the last opened track. Moved here from the live part (split of
        // 27.09.2026): importShared and restoreLastLoaded live in tracker-app-tracks.js, which loads after
        // the live part - a call at load time must come from a later file than the functions it calls.
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

        // On load: jump straight to the current position (no need to press centre),
        // then wait for better data before revealing the red dot.
        goToCurrentPosition({ initial: true });
        startAmbient(); // …and keep following live while idle (no recording needed) — Maps-style
    
