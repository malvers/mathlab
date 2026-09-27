// Doc Alvers Tracker - part 11 of 13: wiring of the feature modules (media, nav, speed, poi, ...), the overlay panels.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

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
            get compass() { return __compass; },   // camera viewing direction for a photo → identify view-cone (BUG-8)
            get tracking() { return tracking; },
            get posMarker() { return posMarker; },
            get currentTrackId() { return currentTrackId; }, set currentTrackId(v) { currentTrackId = v; },
            get waypoints() { return waypoints; }, set waypoints(v) { waypoints = v; },
            get wpMarkers() { return wpMarkers; }, set wpMarkers(v) { wpMarkers = v; },
            get fannedCluster() { return fannedCluster; }, set fannedCluster(v) { fannedCluster = v; },
        });
        // ---- Simple navigation → js/tracker-nav.js. Owns its own route/destination layers; the core
        //      only asks hasDestination() on START and clearRoute() on STOP (finish/discard). ----
        // ---- Per-route speed-limit profile → js/tracker-speedprofile.js. Built by nav when a route is
        //      computed; feeds the speed-sign so it switches limits exactly at the precomputed points and
        //      draws change-point badges on the route. Created BEFORE nav (passed in) + the sign. ----
        __speedprofile = (typeof TrackerSpeedProfile !== 'undefined') ? TrackerSpeedProfile({ map }) : null;
        __nav = TrackerNav({
            map, $, toast, showPanel, hidePanels,
            speedProfile: __speedprofile,
            apiUrl: SUPABASE_URL, apiKey: SUPABASE_KEY,   // → `reroute` Edge Function (ORS) when REROUTE_ENGINE='ors'
            get posMarker() { return posMarker; },
            // Lazy handle to the traffic module (built AFTER nav) → a reroute can pull active closures and
            // pass them to ORS as avoid_polygons, so it routes AROUND a Sperrung instead of only warning.
            get traffic() { return __traffic; },
            // Dialog "STARTEN": from idle → begin recording + navigation (toggle then shows PAUSE);
            // while already recording (dialog reopened mid-trip) → just (re)route to the new destination.
            startTracking: () => {
                // Simulator: STARTEN only (re)computes the route from the car — never begin real recording/GPS.
                if (simMode) { if (__nav && __nav.hasDestination()) __nav.startNavigation(); return; }
                if (trkState === 'idle') beginTracking();
                else if (__nav && __nav.hasDestination()) __nav.startNavigation();
            },
            // Arrived at the nav destination → pause the recording (Doc 2026-06-25), so the trip stops at the
            // goal showing CONTINUE/SPEICHERN/VERWERFEN. Only while actually recording (no-op in the sim/idle).
            onArrive: () => { if (trkState === 'recording') pauseTracking(); },
            // ---- Cross-device nav prefs (Home + recent destinations) → public.nav_prefs, one row per user,
            //      RLS auth.uid()=user_id (same isolation as tracks). Roams under the SAME sync code only.
            //      All cloud failures are swallowed → localStorage stays the working store, sync is a bonus.
            cloudPrefsLoad: async () => {
                try {
                    const c = await ensureSb(); if (!c) return null;
                    const { data } = await c.from('nav_prefs').select('home, history').maybeSingle();
                    return data || null;
                } catch (e) { return null; }
            },
            cloudPrefsSave: async (patch) => {
                try {
                    const c = await ensureSb(); if (!c) return;
                    const { data: { user } } = await c.auth.getUser(); if (!user) return;
                    await c.from('nav_prefs').upsert(
                        Object.assign({ user_id: user.id, updated_at: new Date().toISOString() }, patch),
                        { onConflict: 'user_id' });
                } catch (e) { /* offline / table not migrated yet → localStorage still holds it */ }
            },
        });
        // ---- Speed-limit sign → js/tracker-speedlimit.js. Position-driven (fed from onPosition),
        //      independent of navigation; owns its own #speed-sign badge. ----
        // Logging-only measurement probe (js/tracker-speedprobe.js): tallies whether a backward-carry /
        // persistent memory would agree/cover the live limit, so Phase 1/2 are decided with numbers, not a
        // guess (Doc 2026-06-30). No behaviour change. Read via window.__speedProbe in the console.
        const __speedprobe = (typeof TrackerSpeedProbe !== 'undefined') ? TrackerSpeedProbe() : null;
        window.__speedProbe = __speedprobe; // console access: __speedProbe.summary() · .stats() · .reset()
        __speed = TrackerSpeedLimit({ $, profile: __speedprofile, probe: __speedprobe, isWet: () => ambientWet });
        // Give the profile the SAME tag→limit resolver the sign uses, so its precomputed numbers match.
        if (__speedprofile && __speed.resolveLimit) __speedprofile.setResolver(__speed.resolveLimit);
        // …and the generic legal default (DE:urban=50 …). The profile carries a CONFIRMED limit forward across
        // untagged gaps; this lets it STOP that carry where the road's own generic default contradicts it, so a
        // rural 100 can't bleed into the city and override the honest dimmed sign (Doc 2026-07-06).
        if (__speedprofile && __speedprofile.setGeneric && __speed.resolveGeneric) __speedprofile.setGeneric(__speed.resolveGeneric);
        // …and the SAME conditional evaluator + equality key, so a time-conditional limit (e.g. a school
        // zone's "30 Mo-Fr 6-17") is resolved at display time and compared correctly (Doc 2026-06-30).
        if (__speedprofile && __speed.evalLimit) __speedprofile.setEval(__speed.evalLimit, __speed.limitKey);
        // ---- Bußgeld-Risiko → js/tracker-fines.js. Tapping the speed-limit sign opens a panel that
        //      prices a ticket (€ / Punkte / Fahrverbot) from the static BKatV table for the live
        //      speed-over-limit. Keyless + offline-safe; most useful when the sign is red. ----
        if (typeof TrackerFines !== 'undefined') {
            __fines = TrackerFines({ $, showPanel, speed: __speed });
            const signEl = $('speed-sign');
            if (signEl) signEl.addEventListener('click', () => __fines.show());
            const fc = $('fines-close'); if (fc) fc.addEventListener('click', hidePanels);
        }
        // ---- Road-quality hover tip → js/tracker-streetquality.js. Mouse-only (Mac): rest the cursor on
        //      the map → Overpass tells us the road's OSM surface/smoothness in a small tooltip. No-op on
        //      touch (no hover there). ----
        __streetq = (typeof TrackerStreetQuality !== 'undefined') ? TrackerStreetQuality({ map, speed: __speed }) : null;
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
        // ---- Verkehrs-Spur → js/tracker-traffic.js. Position-driven; live German-Autobahn closures /
        //      roadworks / warnings (verkehr.autobahn.de, keyless) as pins; warns on a closure on the route. ----
        __traffic = (typeof TrackerTraffic !== 'undefined') ? TrackerTraffic({
            map, toast,
            navigateTo: (ll, name) => { if (__nav && __nav.navigateTo) __nav.navigateTo(ll, name); },
            speed: __speed, nav: __nav, voice: (window.SolitaVoice || null),
            apiUrl: SUPABASE_URL, apiKey: SUPABASE_KEY,   // Phase 2: TomTom proxy (abroad only; graceful until deployed)
        }) : null;
        // ---- Point hazards → js/tracker-hazards.js. Position-driven; OSM level-crossings / stop / give-way /
        //      zebra as map pins, with a "voraus"-toast for the safety-critical ones. Key-less Overpass. ----
        __hazards = (typeof TrackerHazards !== 'undefined') ? TrackerHazards({ map, toast, nav: () => __nav }) : null;
        // ---- Golden hour / sun position → js/tracker-sun.js (FEAT-2). Fills the #sun-line in the HUD header,
        //      glows during the golden/blue hour. Position-driven + self-ticking once a minute. ----
        __sun = (typeof TrackerSun !== 'undefined') ? TrackerSun({ $, toast }) : null;
        // ---- Sign panel → js/tracker-signpanel.js (FEAT-35 Phase 1). Double-tap the map → a left column of
        //      the most important signs; a tap writes a LOCAL override into __speed (wins over OSM) for the
        //      temporary / thinly-tagged signs OSM lacks. DB sync + OSM upload are later phases. ----
        __signpanel = (typeof TrackerSignPanel !== 'undefined') ? TrackerSignPanel({
            map, toast, speed: __speed,
            curPos: () => { const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng(); return ll ? [ll.lat, ll.lng] : null; },
        }) : null;
        // ---- Desk navigation simulator → js/tracker-navsim.js. Only with ?sim=1 in the URL. Feeds synthetic
        //      GPS fixes through the REAL onPosition pipeline (so reroute/guidance behave 1:1), while simMode
        //      suppresses cloud sync/broadcast so no fake data ever reaches Supabase. ----
        if (typeof TrackerNavSim !== 'undefined' && /[?&]sim(=1|=true)?(&|$)/.test(location.search)) {
            __sim = TrackerNavSim({
                map, $, toast, nav: __nav,
                feed: (pos) => onPosition(pos),                  // synthetic W3C position → full real pipeline
                setSim: (on) => { simMode = !!on; },             // gate cloud side-effects while driving
                curPos: () => { const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng(); return ll ? [ll.lat, ll.lng] : null; },
            });
        }
        // VERKEHR now lives as a POI category ("Verkehr") — its checkbox reflects/sets __traffic.enabled
        // (wired in the POI panel block below). The module self-restores its enabled flag from localStorage.
        // ===============================================================
        // Radial action popup (long-press / right-click) — style from worldclock
        // ===============================================================
        const miniStack = $('mini-stack');

        // Grey out track-dependent actions when there's no track to act on. BROADCAST stays usable
        // while live (so you can always stop). Called whenever the popup or settings panel opens.
        function refreshMenuState() {
            const has = !!(track && track.length);
            // A loaded GROUP (plotMultiple) leaves `track` empty but is still shareable — it lives in
            // loadedTrackIds. So SHARE follows "single track OR loaded group"; Live/Smooth/DEM stay
            // bound to the single `track` array (they operate on its points).
            const hasShare = has || loadedTrackIds.size > 0;
            const dim = (id, off) => { const b = $(id); if (b) b.classList.toggle('disabled', off); };
            dim('mb-sharetrack', !hasShare);
            dim('mb-live', !has && !liveOn && !lastFix);   // broadcast needs only a GPS fix now, not a recording
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
