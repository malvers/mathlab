// Doc Alvers Tracker - part 3 of 13: tracking state, waypoint shape, geometry helpers.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

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
        let temps = [];            // ambient temperature in °C per point (Open-Meteo; null if unknown)
        let currentTrackId = null; // DB id of the loaded/just-saved track (for the menu "TEILEN")
        let currentTrackName = '';
        let totalDist = 0;         // metres
        let startTime = null;      // ms
        let timerId = null;
        lastFix = null;            // { lat, lng, t } — declared above (near the basemap theme)
        let waypoints = [];        // Foto-/Voice-Spur: [{type, lat, lng, t, img|audio, dur, mime, title, text, _marker}]
        // Canonical waypoint → DB/buffer shape: pass ALL fields through (photo `img` and voice
        // `audio`/`dur`/`type` alike), only drop the runtime-only Leaflet marker. Future fields
        // (e.g. a transcript) ride along for free — single source, no per-field enumeration.
        function wpSer(w, forSync) {
            const o = Object.assign({}, w); delete o._marker;
            delete o._blob;                                         // never serialize the raw video File
            delete o._trackId;                                      // runtime-only: which DB row holds this wp (for corrections)
            if (o._pending) { o.video = null; delete o._pending; }  // un-uploaded video → no dead blob: URL
            // CLOUD sync copy ONLY: drop un-uploaded base64 (a failed R2 upload leaves a data: URL in
            // img/audio). Otherwise it re-POSTs hundreds of KB on EVERY 20 s autosync tick (egress audit fix E).
            // The LOCAL TrackBuffer calls wpSer(w) without forSync → keeps the base64 so the photo is never lost.
            if (forSync) {
                if (typeof o.img === 'string' && o.img.startsWith('data:')) o.img = null;
                if (typeof o.audio === 'string' && o.audio.startsWith('data:')) o.audio = null;
                if (typeof o.video === 'string' && o.video.startsWith('data:')) o.video = null;
            }
            return o;
        }
        let wpMarkers = [];
        let fannedCluster = null;  // spiderfy: a photo fan is open (set by tracker-media); core reads it to gate the radial menu
        let __media = null;        // Foto-Spur module instance (js/tracker-media.js)        // their Leaflet markers (kept for clearing)
        let __nav = null;          // simple-navigation module instance (js/tracker-nav.js)
        let __speed = null;        // speed-limit sign module instance (js/tracker-speedlimit.js)
        let __fines = null;        // German speeding-fine panel (js/tracker-fines.js)
        let __speedprofile = null; // per-route speed-limit profile (js/tracker-speedprofile.js)
        let __streetq = null;      // desktop road-quality hover tip (js/tracker-streetquality.js)
        let __compass = null;      // north/compass module instance (js/tracker-compass.js)
        let __fuel = null;         // fuel-station price layer (js/tracker-fuel.js)
        let __poi = null;          // points-of-interest layer (js/tracker-poi.js)
        let __traffic = null;      // live Autobahn traffic layer (js/tracker-traffic.js)
        let __hazards = null;      // point-hazard pins + voraus-warning (js/tracker-hazards.js)
        let __sun = null;          // golden hour / sun position line (js/tracker-sun.js, FEAT-2)
        let __signpanel = null;    // tap-in-a-sign panel (js/tracker-signpanel.js, FEAT-35)
        let __sim = null;          // desk navigation simulator (js/tracker-navsim.js), only with ?sim=1
        let simMode = false;       // true while the simulator drives synthetic fixes → suppress cloud sync/broadcast
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

        // Banner extras (satellites #gps-chip + sunrise/sunset flanks) auto-hide 8 s after they appear;
        // tapping the clock brings them back for another 8 s, then they fade again (Doc 2026-07-06). The
        // clock and stat tiles stay put. Pure UI: a class on #hud-top drives the CSS; no data path touched.
        const BANNER_HIDE_MS = 8000;
        const elHudTop = $('hud-top');
        let bannerHideTimer = null;
        function armBannerHide() {
            if (bannerHideTimer) clearTimeout(bannerHideTimer);
            bannerHideTimer = setTimeout(() => {
                if (!elHudTop) return;
                // Slide the whole header up by exactly the satellite row's height, so hiding it leaves no gap
                // (Doc 2026-07-06). Measured live (survives orientation changes); the CSS transform transition
                // does the slow slide. #gps-chip keeps its layout box while faded, so offsetHeight is valid.
                // Set on :root so BOTH the header (slide-up transform) and the nav-banner (which is a sibling,
                // not a child, of #hud-top) can read it and move up by the same amount.
                const chip = $('gps-chip');
                if (chip) document.documentElement.style.setProperty('--hud-shift', chip.offsetHeight + 'px');
                elHudTop.classList.add('hud-collapsed');
            }, BANNER_HIDE_MS);
        }
        function showBannerExtras() {
            if (elHudTop) elHudTop.classList.remove('hud-collapsed');
            armBannerHide();
        }
        // Header clock gestures: a SHORT tap re-shows OTWA's banner extras (+ re-arms the 8 s collapse);
        // a LONG-PRESS (500 ms) toggles the FULL-UI idle auto-hide via the shared `pinned` flag
        // (window.setUiPinned, tracker-media.js) — pinned = nothing fades. Turning auto-hide ON hides the
        // whole HUD right away instead of waiting out the idle timer (Doc 2026-07-06). #hud-top is
        // pointer-events:none, so the clock is the header's interactive target; the long-press click is
        // swallowed so it never also re-shows the extras.
        if (elTime) {
            elTime.addEventListener('click', showBannerExtras);
            let uiLongFired = false, uiTimer = null;
            const uiCancel = () => { if (uiTimer) { clearTimeout(uiTimer); uiTimer = null; } };
            elTime.addEventListener('pointerdown', () => {
                uiLongFired = false; uiCancel();
                uiTimer = setTimeout(() => {
                    uiLongFired = true;
                    const nowPinned = localStorage.getItem('tracker_ui_pinned') === '1'; // shared source of truth
                    const enableAutoHide = nowPinned; // currently pinned → this long-press turns auto-hide ON
                    if (typeof window.setUiPinned === 'function') window.setUiPinned(!nowPinned);
                    if (enableAutoHide) document.body.classList.add('ui-idle'); // auto-hide on → hide everything now
                    toast(enableAutoHide ? 'Auto-Ausblenden: an' : 'Alles fixiert — nichts blendet aus');
                }, 500);
            });
            elTime.addEventListener('pointerup', uiCancel);
            elTime.addEventListener('pointercancel', uiCancel);
            elTime.addEventListener('pointerleave', uiCancel);
            elTime.addEventListener('click', (e) => { if (uiLongFired) { e.stopImmediatePropagation(); e.preventDefault(); uiLongFired = false; } }, true);
        }
        armBannerHide(); // start the first 8 s countdown on load

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
        // "Actively navigating" = a destination is set AND a route is actually drawn/guiding — NOT merely an
        // armed destination. The last destination is restored on reload (nav.restoreLastRoute), so
        // hasDestination() alone stays true while you just stand there → the DISTANCE tile showed 0 instead of
        // the idle temperature, and this idle clock froze (Doc 2026-07-07). routePoints() is null until
        // startNavigation draws the line (the ETA preview does not set it), so it cleanly means "really guiding".
        function navActive() { return !!(__nav && __nav.hasDestination && __nav.hasDestination() && __nav.routePoints && __nav.routePoints()); }
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
