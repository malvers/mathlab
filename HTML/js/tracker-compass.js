// js/tracker-compass.js — a small north/compass indicator under the header.
//
// The map is north-up, so this tells you which way YOU are physically facing: it reads the device
// magnetometer (DeviceOrientation) and rotates the rose so "N" always points to real north. No key,
// no network. iOS needs an explicit permission grant inside a user gesture → enable() is called from
// the START tap (and from the first tap anywhere). On Android/desktop no permission is needed, so we
// start listening immediately — the compass works even when idle (not recording). If the device has no
// compass, the widget simply stays hidden.
window.TrackerCompass = function (ctx) {
    const { $ } = ctx;
    let listening = false;
    let gotAbsolute = false; // once a true north-referenced reading arrives, ignore relative fallbacks
    let sawEvent = false;    // did ANY orientation event ever fire? (WebView/permission diagnosis)
    let watchdog = null;
    const dbg = (m) => { if (window.DebugWindow && window.DebugWindow.log) window.DebugWindow.log('compass: ' + m); };

    function applyHeading(h) {
        const rose = $('compass-rose'); if (!rose) return;
        rose.style.transform = 'rotate(' + (-h) + 'deg)'; // turn the rose so N points to true north on screen
        const el = $('compass'); if (el) el.hidden = false; // reveal on the first real reading
    }

    function onOrient(e) {
        if (!sawEvent) {                          // log the very first event so we can see what the device sends
            sawEvent = true;
            if (watchdog) { clearTimeout(watchdog); watchdog = null; }
            dbg('1. Ereignis: absolute=' + e.absolute + ' alpha=' + (typeof e.alpha === 'number' ? e.alpha.toFixed(0) : e.alpha) +
                ' webkit=' + (typeof e.webkitCompassHeading === 'number' ? e.webkitCompassHeading.toFixed(0) : 'n/a'));
        }
        let h = null, abs = false;
        if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
            h = e.webkitCompassHeading;                 // iOS: degrees clockwise from north (north-referenced)
            abs = true;
        } else if (e.absolute && typeof e.alpha === 'number') {
            h = (360 - e.alpha) % 360;                  // Android (absolute): alpha is CCW from north
            abs = true;
        } else if (!gotAbsolute && typeof e.alpha === 'number') {
            // Last resort: a non-absolute reading (no true-north reference). May drift, but a moving rose
            // is better than a frozen one — used only until a real absolute reading takes over.
            h = (360 - e.alpha) % 360;
        }
        if (abs) gotAbsolute = true;
        if (h != null && !isNaN(h)) applyHeading(h);
    }

    function listen() {
        if (listening) return;
        listening = true;
        // 'deviceorientationabsolute' is the reliable, north-referenced one where supported.
        window.addEventListener('deviceorientationabsolute', onOrient, true);
        window.addEventListener('deviceorientation', onOrient, true);
        dbg('höre auf Orientierung …');
        // Watchdog: if no event arrives, the sensor isn't reaching this context (typical in the Android
        // WebView/APK, or motion sensors blocked in the browser) → say so plainly instead of failing silently.
        if (watchdog) clearTimeout(watchdog);
        watchdog = setTimeout(function () {
            if (!sawEvent) dbg('KEINE Sensordaten in 4 s — Kompass nicht verfügbar (WebView/APK oder Bewegungssensor blockiert?)');
        }, 4000);
    }

    // Must run inside a user gesture on iOS (the START tap / first tap). Elsewhere it just starts listening.
    function enable() {
        try {
            const D = window.DeviceOrientationEvent;
            if (D && typeof D.requestPermission === 'function') {
                D.requestPermission()
                    .then((s) => { dbg('Permission: ' + s); if (s === 'granted') listen(); })
                    .catch((e) => dbg('Permission-Fehler: ' + (e && e.message || e)));
            } else {
                listen();
            }
        } catch (e) { dbg('keine Orientierungs-Unterstützung'); }
    }

    // Auto-start so the compass works even when idle (not recording). On Android/desktop no permission is
    // needed → listen right away. On iOS a user gesture is required → arm the first tap anywhere as the
    // trigger (one-shot); the START tap also calls enable(), whichever comes first.
    (function autoStart() {
        try {
            const D = window.DeviceOrientationEvent;
            if (!D) { dbg('DeviceOrientationEvent fehlt — kein Kompass'); return; }
            if (typeof D.requestPermission === 'function') {
                const once = () => { window.removeEventListener('pointerdown', once, true); enable(); };
                window.addEventListener('pointerdown', once, true);
                dbg('iOS — warte auf erste Berührung für Permission');
            } else {
                listen(); // Android/desktop: no permission gate
            }
        } catch (e) { /* no orientation support → widget stays hidden */ }
    })();

    return { enable };
};
