// js/tracker-compass.js — a small north/compass indicator under the header.
//
// The map is north-up, so this tells you which way YOU are physically facing: it reads the device
// magnetometer (DeviceOrientation) and rotates the rose so "N" always points to real north. No key,
// no network. iOS needs an explicit permission grant inside a user gesture → enable() is called from
// the START tap. If the device has no compass, the widget simply stays hidden.
window.TrackerCompass = function (ctx) {
    const { $ } = ctx;
    let listening = false;

    function applyHeading(h) {
        const rose = $('compass-rose'); if (!rose) return;
        rose.style.transform = 'rotate(' + (-h) + 'deg)'; // turn the rose so N points to true north on screen
        const el = $('compass'); if (el) el.hidden = false; // reveal on the first real reading
    }

    function onOrient(e) {
        let h = null;
        if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
            h = e.webkitCompassHeading;                 // iOS: degrees clockwise from north
        } else if (e.absolute && typeof e.alpha === 'number') {
            h = (360 - e.alpha) % 360;                  // Android (absolute): alpha is CCW from north
        }
        if (h != null && !isNaN(h)) applyHeading(h);
    }

    function listen() {
        if (listening) return;
        listening = true;
        // 'deviceorientationabsolute' is the reliable, north-referenced one where supported.
        window.addEventListener('deviceorientationabsolute', onOrient, true);
        window.addEventListener('deviceorientation', onOrient, true);
    }

    // Must run inside a user gesture on iOS (the START tap). Elsewhere it just starts listening.
    function enable() {
        try {
            const D = window.DeviceOrientationEvent;
            if (D && typeof D.requestPermission === 'function') {
                D.requestPermission().then((s) => { if (s === 'granted') listen(); }).catch(() => { });
            } else {
                listen();
            }
        } catch (e) { /* no orientation support → widget stays hidden */ }
    }

    return { enable };
};
