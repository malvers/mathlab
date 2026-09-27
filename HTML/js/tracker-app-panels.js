// Doc Alvers Tracker - part 12 of 13: popup actions, settings and sync code.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- Popup actions ----

        // Non-destructive display smoothing (despike+smooth pass on the DISPLAYED line only,
        // TrackSmooth). Stored data stays raw. Toggle — invoked from a track's ⋯ menu.
        function toggleSmooth() {
            if (!track || !track.length) { toast('Kein Track geladen.'); return; }
            smoothOn = !smoothOn;
            const b = $('mb-smooth'); if (b) b.classList.toggle('active', smoothOn);
            redrawTrack();
            toast(smoothOn ? 'Glättung an (nur Anzeige, Daten unberührt)' : 'Glättung aus');
        }

        // GPS-Nachbearbeitung Stufe 1.3 — DEM height: replace the noisy GPS+baro altitude with the
        // terrain elevation from a digital elevation model (Open-Meteo / Copernicus GLO-90). Async (one
        // network fetch, then cached). Non-destructive: fills demAlts[] and flips a display+GPX toggle;
        // the stored raw alts stay untouched. Toggle — invoked from a track's ⋯ menu.
        async function toggleDem() {
            if (demBusy) return;
            if (!track || !track.length) { toast('Kein Track geladen.'); return; }
            if (demOn) { // turn off → back to raw GPS+baro
                demOn = false;
                const b = $('mb-dem'); if (b) b.classList.remove('active');
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
            const b = $('mb-dem'); if (b) b.classList.add('active');
            renderAltitude();
            const dem = ascentDescent(demAlts), gps = ascentDescent(alts);
            toast('DEM-Höhe an · ↑ ' + dem.up + ' m  ↓ ' + dem.down + ' m  (GPS war ↑ ' + gps.up + ')');
        }

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
        ['poi-cat-service', 0], ['poi-cat-food', 0], ['poi-cat-lodging', 0],
        ['poi-cat-speedcam', 0], ['poi-cat-feen', 0]].forEach(([id, def]) => {
            const el = $(id); if (!el) return;
            const saved = localStorage.getItem(id);
            el.checked = saved == null ? !!def : saved === '1';
            el.addEventListener('change', () => {
                localStorage.setItem(id, el.checked ? '1' : '0');
                if (__poi) __poi.refresh();   // category toggled → re-query the visible area
            });
        });
        // "Tankstelle" drives the SEPARATE fuel-PRICE layer (js/tracker-fuel.js), not an Overpass fetch — so
        // toggling it OFF hides the station pins AND their prices (Doc 2026-06-23: vorher lief der Preis-Layer
        // auf eigenem Key trk-fuel-on weiter → POI-Schalter aus, trotzdem sichtbar). Checkbox ⇄ __fuel.enabled.
        (function () {
            const cb = $('poi-cat-fuel'); if (!cb) return;
            cb.checked = !!(__fuel && __fuel.enabled);
            cb.addEventListener('change', () => {
                if (!__fuel) { toast('Tankstellen nicht verfügbar.'); cb.checked = false; return; }
                __fuel.setEnabled(cb.checked);   // off → layer.clearLayers() + update() bails → keine Pins, keine Preise
                toast(cb.checked ? 'Tankstellen an' : 'Tankstellen aus');
            });
        })();
        // "Verkehr" is a POI category that drives the SEPARATE live-Autobahn traffic module
        // (js/tracker-traffic.js), not an Overpass fetch. Its checkbox mirrors/sets __traffic.enabled
        // (key trk-traffic-on) — so it can't sit in the generic loop above (no __poi.refresh, own key).
        (function () {
            const cb = $('poi-cat-traffic'); if (!cb) return;
            cb.checked = !!(__traffic && __traffic.enabled);
            cb.addEventListener('change', () => {
                if (!__traffic) { toast('Verkehr nicht verfügbar.'); cb.checked = false; return; }
                __traffic.setEnabled(cb.checked);
                toast(cb.checked ? 'Verkehr an' : 'Verkehr aus');
            });
        })();
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
        // Fotos / Videos / Voice: hide-or-show OUR own media pins (declutter overlaid tracks). These are
        // NOT Overpass categories — they drive the media layer's filter (js/tracker-media.js), not __poi.
        // Each row gets a mini pin icon in the SAME colours as its map badge (camera green · video
        // purple · mic blue), so the panel reads as one legend with the POI categories below.
        const MEDIA_IC = {
            photo: { c: 'poi-photo', ic: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
            video: { c: 'poi-video', ic: '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>' },
            voice: { c: 'poi-voice', ic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' },
        };
        [['media-photo', 'photo'], ['media-video', 'video'], ['media-voice', 'voice']].forEach(([id, kind]) => {
            const el = $(id); if (!el) return;
            el.checked = localStorage.getItem('trk-media-' + kind) !== '0';   // default ON (all shown)
            el.addEventListener('change', () => { if (__media && __media.setMediaVisible) __media.setMediaVisible(kind, el.checked); });
            const span = el.closest('.set-row') && el.closest('.set-row').querySelector('span');
            const m = MEDIA_IC[kind];
            if (span && m && !span.querySelector('.poi-cat-ic')) {
                span.insertAdjacentHTML('afterbegin',
                    '<span class="poi-cat-ic poi-pin ' + m.c + '" aria-hidden="true">'
                    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                    + 'stroke-linecap="round" stroke-linejoin="round">' + m.ic + '</svg></span>');
            }
        });
        $('mb-poi').addEventListener('click', () => { closePopup(); showPanel('poi-panel'); if (__poi) __poi.refresh(); });
        $('mb-checklist').addEventListener('click', () => { closePopup(); location.href = 'hikingchecklist.html'; }); // Wander-Checkliste (Doc 2026-07-23)
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
        $('zoom-in').addEventListener('click', () => { autoZoomHold = true; map.zoomIn(); });   // manual zoom HOLDS; no hand-mode
        $('zoom-out').addEventListener('click', () => { autoZoomHold = true; map.zoomOut(); }); // manual zoom HOLDS; no hand-mode
        // View-fan: the trigger opens the fan — but only when there's more than ONE destination to choose.
        // With a single valid destination (e.g. crosshair + no track), fanning out one option is just noise
        // → apply it directly (tap = re-centre). "hand" is not a destination, so it's never counted here NOR
        // shown as an option. In hand-mode (custom view) a tap OPENS the fan with the escapes you can pick —
        // crosshair / fit whole / fit remaining (Doc 2026-06-23); the hand icon stays the closed-state trigger
        // and is hidden while the fan is open (CSS) so it never sits among the options.
        $('recenter-fab').addEventListener('click', () => {
            if (fanOpen) { closeFan(); return; }
            const valid = validModes();
            const offered = ['follow', 'fitall', 'fitrem'].filter((m) => valid[m]);
            if (offered.length <= 1) { if (offered[0]) selectViewMode(offered[0]); return; }
            openFan();
        });
        document.querySelectorAll('#view-fan .vf-opt').forEach((b) => {
            b.addEventListener('click', () => selectViewMode(b.dataset.mode));
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
        $('mb-settings').addEventListener('click', () => { closePopup(); updateSyncStatus(); loadUsage(); updateReburnButton(); refreshMenuState(); refreshRainStatus(); showPanel('settings-panel'); }); // Strecke-Stats → per-track ⋯ menu now
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
        // "Nicht analysierte Fotos" card removed from settings (Doc 2026-07-06); reburnTrack() stays in
        // code (reachable if we resurface it later). Guard so the missing button can't crash init.
        if ($('set-reburn')) $('set-reburn').addEventListener('click', async () => { await reburnTrack(); updateReburnButton(); });
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

        // Settings → Debug: routing engine for the whole navigation — ORS (default) ↔ OSRM (persisted in nav).
        (function () {
            function wire() {
                const cb = $('route-engine-toggle'); if (!cb || cb._wired) return; cb._wired = true;
                cb.checked = !__nav || !__nav.getEngine || __nav.getEngine() === 'ors'; // default ORS
                cb.addEventListener('change', () => {
                    if (__nav && __nav.setEngine) __nav.setEngine(cb.checked ? 'ors' : 'osrm');
                    toast(cb.checked ? 'Navigation: ORS' : 'Navigation: OSRM');
                });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
            else wire();
        })();

        // Settings: map design — Auto (light by day, dark at night via sun) · Hell · Dunkel. Persisted; default Auto.
        (function () {
            function wire() {
                const seg = Array.from(document.querySelectorAll('.seg-btn[data-maptheme]'));
                if (!seg.length || seg[0]._wired) return;
                const reflect = () => seg.forEach((b) => b.classList.toggle('active', b.getAttribute('data-maptheme') === themePref));
                seg.forEach((b) => {
                    b._wired = true;
                    b.addEventListener('click', () => {
                        const p = b.getAttribute('data-maptheme');
                        setMapPref(p);
                        reflect();
                        toast(p === 'auto' ? 'Karte: Auto (hell/dunkel nach Sonne)' : p === 'dark' ? 'Karte: dunkel' : 'Karte: hell');
                    });
                });
                reflect();
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
            else wire();
        })();

        // Settings: day-map style — Schlank (CARTO Voyager) · OSM (Standard). Persisted; default Schlank.
        (function () {
            function wire() {
                const seg = Array.from(document.querySelectorAll('.seg-btn[data-daystyle]'));
                if (!seg.length || seg[0]._wired) return;
                const reflect = () => seg.forEach((b) => b.classList.toggle('active', b.getAttribute('data-daystyle') === dayStyle));
                seg.forEach((b) => {
                    b._wired = true;
                    b.addEventListener('click', () => {
                        const s = b.getAttribute('data-daystyle');
                        setDayStyle(s);
                        reflect();
                        toast(s === 'osm' ? 'Kartenstil: OSM (dichter)' : 'Kartenstil: schlank (Voyager)');
                    });
                });
                reflect();
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
            // Classify a track as 🚗 Auto vs 🚶 zu Fuß from its average speed (distance ÷ duration — the
            // only speed signal a list row carries). Doc's tracks split cleanly: hikes ~4–5 km/h, drives
            // >20, so one threshold is robust. '' when there's no usable duration (one-point items or a
            // row the list_tracks() RPC didn't enrich).
            const FOOT_MAX_KMH = 14;                 // ≤ this ⇒ on foot (walk/run); above ⇒ vehicle
            function trackModeIcon(r) {
                if (!r.distance_m || !r.duration_s) return '';
                const kmh = (r.distance_m / 1000) / (r.duration_s / 3600);
                if (!(kmh > 0)) return '';
                return kmh > FOOT_MAX_KMH ? '🚗' : '🚶';
            }

            // Builds ONE track row (checkbox · badge · name/meta · share · delete). Returned so it can
            // sit either directly in the list or inside a folder section's body.
            function buildTrackRow(r) {
                const row = document.createElement('div');
                row.className = 'tl-row';
                const chk = document.createElement('input');                 // multi-select checkbox, before the icon
                chk.type = 'checkbox'; chk.className = 'tl-check'; chk.title = 'Auswählen (Laden · Teilen · Gruppieren)';
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
                    if (r.photo_count) stats.push('📷 ' + r.photo_count);   // was on the (now-removed) badge
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
                // No leading badge (Doc 2026-07-07): the grouping folders (Zu Fuß · Auto · Fotos · Videos ·
                // Voice) already say what a row is, so the per-row icon was redundant. Photo count moved
                // into the meta line above.
                // Load on a tap ANYWHERE on the row (except the checkbox or the action buttons, which
                // handle themselves).
                row.addEventListener('click', async (ev) => {
                    if (ev.target.closest('.tl-check, .tl-acts, button')) return;
                    toast('Lade Track …');
                    try { const t = await fetchTrack(r.id); plotTrack(t.points, t.waypoints); currentTrackId = r.id; currentTrackName = r.name; loadedTrackIds.clear(); loadedTrackIds.add(r.id); persistLoaded([{ id: r.id, name: r.name }]); hidePanels(); toast(r.name + ' geladen.'); }
                    catch (e) { toast('Track laden fehlgeschlagen.'); }
                });
                // One ⋯ menu per row holds EVERY track action (Laden · Statistik · Teilen · Verschieben ·
                // Aus Ordner · GPX-Export · Glätten · Höhe · Löschen) — replaces the old share/×/trash icons.
                const menuBtn = document.createElement('button');
                menuBtn.className = 'tl-menu-btn'; menuBtn.title = 'Aktionen'; menuBtn.setAttribute('aria-label', 'Aktionen');
                menuBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>';
                menuBtn.addEventListener('click', (ev) => { ev.stopPropagation(); openTrackMenu(r, row); });
                row.appendChild(main); row.appendChild(menuBtn);
                return row;
            }

            // Long-press (hold ~500 ms, touch or mouse) on a folder header → select/deselect ALL its
            // tracks at once. Suppresses the click that would otherwise toggle the collapse.
            function attachLongPress(el, onLong) {
                let timer = null, longFired = false, sx = 0, sy = 0;
                const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
                el.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; longFired = false; cancel(); timer = setTimeout(() => { longFired = true; onLong(); }, 500); });
                el.addEventListener('pointermove', (e) => { if (timer && (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10)) cancel(); });
                el.addEventListener('pointerup', cancel);
                el.addEventListener('pointerleave', cancel);
                el.addEventListener('pointercancel', cancel);
                el.addEventListener('click', (e) => { if (longFired) { e.stopImmediatePropagation(); e.preventDefault(); longFired = false; } }, true); // eat the collapse-click after a long-press
            }
            // Toggle-select every track in a folder (checks/unchecks all its row checkboxes).
            function selectToggleFolder(kids, body) {
                const ids = kids.map((r) => r.id);
                if (!ids.length) return;
                const allSel = ids.every((id) => selectedTracks.has(id));
                ids.forEach((id) => { if (allSel) selectedTracks.delete(id); else selectedTracks.add(id); });
                body.querySelectorAll('.tl-check').forEach((c) => { c.checked = !allSel; });
                updateLoadSel();
                toast(allSel ? 'Auswahl aufgehoben' : (ids.length + ' ausgewählt'));
            }

            // Total distance of a folder's real tracks → a muted "xx.x km" after the name (Doc idea).
            // null when nothing measurable (media-only folders), so the caller just skips it.
            function folderKmSpan(kids) {
                const m = kids.reduce((s, r) => s + (r.distance_m || 0), 0);
                if (!(m > 0)) return null;
                const el = document.createElement('span'); el.className = 'tl-fold-km';
                el.textContent = (m / 1000).toFixed(1) + ' km';
                return el;
            }

            // Builds a collapsible folder section: header (caret · folder · name · km · count · rename · dissolve)
            // plus a body holding its track rows.
            function buildFolderSection(folder, kids) {
                const sec = document.createElement('div');
                sec.className = 'tl-folder';
                if (!_openFolders.has(folder.id)) sec.classList.add('collapsed');   // default closed
                const head = document.createElement('div'); head.className = 'tl-folder-head';
                const caret = document.createElement('span'); caret.className = 'tl-fold-caret'; caret.textContent = '▾';
                // OUR folder pin (gold circle + folder glyph), matching the auto-folder icons — not an emoji.
                const ic = document.createElement('span'); ic.className = 'tl-fold-ic poi-cat-ic poi-pin poi-folder'; ic.setAttribute('aria-hidden', 'true');
                ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
                const nm = document.createElement('div'); nm.className = 'tl-fold-name'; nm.textContent = folder.name;
                const cnt = document.createElement('span'); cnt.className = 'tl-fold-count'; cnt.textContent = kids.length;
                // One ⋯ menu per folder (Umbenennen · Teilen · Website erstellen · Auflösen) — replaces the
                // separate share/pencil/× icons, matching the per-track ⋯.
                const menuBtn = document.createElement('button'); menuBtn.className = 'tl-fold-menu'; menuBtn.title = 'Ordner-Aktionen'; menuBtn.setAttribute('aria-label', 'Ordner-Aktionen');
                menuBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>';
                const km = folderKmSpan(kids);
                head.appendChild(caret); head.appendChild(ic); head.appendChild(nm); if (km) head.appendChild(km); head.appendChild(cnt); head.appendChild(menuBtn);
                const body = document.createElement('div'); body.className = 'tl-folder-body';
                kids.forEach((r) => body.appendChild(buildTrackRow(r)));
                attachLongPress(head, () => selectToggleFolder(kids, body)); // hold → (de)select all in folder
                head.addEventListener('click', () => {
                    const nowCollapsed = sec.classList.toggle('collapsed');
                    if (nowCollapsed) _openFolders.delete(folder.id); else _openFolders.add(folder.id);
                    saveOpenFolders();
                });
                menuBtn.addEventListener('click', (ev) => { ev.stopPropagation(); openFolderMenu(folder, kids, nm); });
                sec.appendChild(head); sec.appendChild(body);
                return sec;
            }

            // Builds an AUTO folder (Fotos / Videos / Voice) for loose single-point media. Membership is
            // derived from the item type (not stored), so there's no rename/dissolve — just collapse +
            // share. `key` is a stable string used to remember its collapsed state.
            function buildVirtualSection(key, iconSpec, name, kids) {
                const sec = document.createElement('div');
                sec.className = 'tl-folder tl-folder-auto';
                if (!_openFolders.has(key)) sec.classList.add('collapsed');   // default closed
                const head = document.createElement('div'); head.className = 'tl-folder-head';
                const caret = document.createElement('span'); caret.className = 'tl-fold-caret'; caret.textContent = '▾';
                // OUR icon: the app icon for the routes folder, else the coloured POI pin glyph.
                const ic = document.createElement('span'); ic.setAttribute('aria-hidden', 'true');
                if (iconSpec.app) {
                    ic.className = 'tl-fold-ic tl-fold-app';
                    ic.innerHTML = APPICON;   // our app icon = the track badge
                } else {
                    ic.className = 'tl-fold-ic poi-cat-ic poi-pin ' + iconSpec.c;
                    ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconSpec.ic + '</svg>';
                }
                const nm = document.createElement('div'); nm.className = 'tl-fold-name'; nm.textContent = name;
                const cnt = document.createElement('span'); cnt.className = 'tl-fold-count'; cnt.textContent = kids.length;
                const shr = document.createElement('button'); shr.className = 'tl-fold-shr'; shr.title = 'Alle teilen';
                shr.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
                const km = folderKmSpan(kids);   // null for media folders (0 km) → auto-hidden; shown for route folders
                head.appendChild(caret); head.appendChild(ic); head.appendChild(nm); if (km) head.appendChild(km); head.appendChild(cnt); head.appendChild(shr);
                const body = document.createElement('div'); body.className = 'tl-folder-body';
                kids.forEach((r) => body.appendChild(buildTrackRow(r)));
                attachLongPress(head, () => selectToggleFolder(kids, body)); // hold → (de)select all in folder
                head.addEventListener('click', () => {
                    const nowCollapsed = sec.classList.toggle('collapsed');
                    if (nowCollapsed) _openFolders.delete(key); else _openFolders.add(key);
                    saveOpenFolders();
                });
                shr.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const ids = kids.map((r) => r.id);
                    if (!ids.length) return;
                    shareMultiple(ids, name);
                });
                sec.appendChild(head); sec.appendChild(body);
                return sec;
            }

            // Folders group only in "Alle" mode — a radius search stays a flat nearest-first list.
            const groupingOn = listRadiusKm === 0;
            const validFolderIds = new Set(_folders.map((f) => f.id));
            const inFolder = (r) => groupingOn && r.folder_id && validFolderIds.has(r.folder_id);
            if (groupingOn) {
                _folders.forEach((f) => box.appendChild(buildFolderSection(f, rows.filter((r) => r.folder_id === f.id))));
            }
            const loose = rows.filter((r) => !inFolder(r));
            if (!groupingOn) { loose.forEach((r) => box.appendChild(buildTrackRow(r))); return; }
            // Auto-tuck loose single-point media (a lone photo, a video clip, a voice note — no real GPS
            // route) into Fotos / Videos / Voice so they don't clutter the route list. Everything else
            // (real tracks) stays flat above them. Same type test as the row badges.
            const isVoiceR = (r) => /^Sprachnotiz/i.test(r.name || '');
            const isVideoR = (r) => /^Video/i.test(r.name || '');
            const isPhotoR = (r) => !r.distance_m && !isVoiceR(r) && !isVideoR(r);
            const photos = loose.filter(isPhotoR);
            const videos = loose.filter(isVideoR);
            const voices = loose.filter(isVoiceR);
            const tracks = loose.filter((r) => !isPhotoR(r) && !isVideoR(r) && !isVoiceR(r));   // real GPS routes
            // OUR pin icons (route · camera green · video purple · mic blue) — same set as the POI panel.
            const AUTO_IC = {
                track: { app: true },   // our app icon (icon.svg), same badge as a real track row
                photo: { c: 'poi-photo', ic: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
                video: { c: 'poi-video', ic: '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>' },
                voice: { c: 'poi-voice', ic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' },
                foot: { c: 'poi-foot', ic: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>' },   // Zu Fuß — Lucide footprints
                drive: { c: 'poi-drive', ic: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>' },   // Auto — Lucide car
            };
            // Real routes are split by the SAME avg-speed classifier as the row 🚶/🚗 glyph: on-foot vs
            // vehicle. Unknown-duration routes (no usable Ø speed) default to "Zu Fuß". Media below.
            const footTracks = tracks.filter((r) => trackModeIcon(r) !== '🚗');
            const driveTracks = tracks.filter((r) => trackModeIcon(r) === '🚗');
            if (footTracks.length) box.appendChild(buildVirtualSection('auto-foot', AUTO_IC.foot, 'Zu Fuß', footTracks));
            if (driveTracks.length) box.appendChild(buildVirtualSection('auto-drive', AUTO_IC.drive, 'Auto', driveTracks));
            if (photos.length) box.appendChild(buildVirtualSection('auto-photo', AUTO_IC.photo, 'Fotos', photos));
            if (videos.length) box.appendChild(buildVirtualSection('auto-video', AUTO_IC.video, 'Videos', videos));
            if (voices.length) box.appendChild(buildVirtualSection('auto-voice', AUTO_IC.voice, 'Voice', voices));
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
