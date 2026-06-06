// Optional rain-radar overlay ("Regenradar") for the Doc Alvers Tracker.
// Pulls free public radar tiles from RainViewer (https://www.rainviewer.com/api.html) —
// NO API key required. The overlay is OFF by default and is purely opt-in via toggle().
//
// Layer ordering: the radar tiles live in a DEDICATED Leaflet pane ('rain-radar') whose
// zIndex (250) sits ABOVE the OSM base tilePane (200) but BELOW the track polyline
// (overlayPane, 400) and the photo pins (markerPane, 600). So the radar never covers the
// GPS track or the photo markers — it only tints the basemap underneath them.
//
// Exposes a single global object, window.RainRadar, with:
//   init(map)  — store the map reference, create the pane (nothing visible yet)
//   toggle()   — add/remove the radar overlay; returns the new on/off state
//   isOn()     — boolean, whether the overlay is currently shown

(function (global) {
    'use strict';

    const API_URL = 'https://api.rainviewer.com/public/weather-maps.json';
    const PANE_NAME = 'rain-radar';
    const PANE_Z_INDEX = 250;     // between OSM tilePane (200) and track overlayPane (400)
    const TILE_OPACITY = 0.6;     // semi-transparent so the basemap stays readable
    const REFRESH_MS = 5 * 60 * 1000; // re-fetch the frame list every ~5 minutes
    const ATTRIBUTION = '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>';

    let map = null;
    let on = false;
    let layer = null;          // the current L.tileLayer (one observed radar frame)
    let refreshTimer = null;   // setInterval handle while the overlay is on
    let lastFrameTime = null;  // unix-ts of the frame currently shown (avoid needless re-adds)

    // Route log lines into the central debug window when it is present; otherwise no-op.
    function dbg(msg) {
        if (typeof DebugWindow !== 'undefined' && DebugWindow && DebugWindow.log) {
            DebugWindow.log(msg);
        }
    }

    // Build the Leaflet tile-URL template for one RainViewer radar frame.
    //   host  e.g. "https://tilecache.rainviewer.com"
    //   path  e.g. "/v2/radar/1700000000"
    // 256   = tile size
    // 2     = colour scheme "universal blue"
    // 1_1   = smoothed (1) + show-snow (1)
    function frameUrl(host, frame) {
        return `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    }

    // Fetch the radar manifest and return { host, frame } for the most recent OBSERVED
    // (past) frame, or null on any failure. Nowcast frames are intentionally ignored —
    // we only show what has actually been measured.
    async function fetchLatestFrame() {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const past = data && data.radar && data.radar.past;
        if (!Array.isArray(past) || past.length === 0) return null;
        return { host: data.host, frame: past[past.length - 1], count: past.length };
    }

    // Swap the displayed frame to the newest observed one. Adds a fresh tile layer first,
    // then removes the old one (so there's no visible blank flash between the two).
    async function refreshFrame() {
        if (!on || !map) return;
        let info;
        try {
            info = await fetchLatestFrame();
        } catch (e) {
            dbg('RainRadar: Abruf fehlgeschlagen (' + (e && e.message ? e.message : e) + ')');
            return;
        }
        if (!info) { dbg('RainRadar: keine Frames'); return; }
        if (info.frame.time === lastFrameTime && layer) return; // already showing the newest

        const next = L.tileLayer(frameUrl(info.host, info.frame), {
            pane: PANE_NAME,
            opacity: TILE_OPACITY,
            tileSize: 256,
            attribution: ATTRIBUTION,
            zIndex: 1,
        });
        next.addTo(map);
        const prev = layer;
        layer = next;
        lastFrameTime = info.frame.time;
        if (prev) {
            // Drop the previous frame once the new one has had a moment to paint.
            next.once('load', () => { if (prev !== layer) map.removeLayer(prev); });
            // Safety net in case 'load' never fires (e.g. fully cached / no tiles in view).
            setTimeout(() => { if (prev !== layer && map.hasLayer(prev)) map.removeLayer(prev); }, 2000);
        }
        dbg('RainRadar: an (' + info.count + ' Frames)');
    }

    function init(theMap) {
        map = theMap;
        // Dedicated pane so the overlay always renders below the track and pins.
        if (!map.getPane(PANE_NAME)) {
            map.createPane(PANE_NAME);
            map.getPane(PANE_NAME).style.zIndex = PANE_Z_INDEX;
            // Radar tiles must not swallow taps meant for the map/markers underneath.
            map.getPane(PANE_NAME).style.pointerEvents = 'none';
        }
    }

    function isOn() { return on; }

    // Turn the overlay on or off. Returns the resulting state (true = on).
    function toggle() {
        if (!map) { dbg('RainRadar: init(map) fehlt'); return false; }
        if (on) {
            on = false;
            if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
            if (layer) { map.removeLayer(layer); layer = null; }
            lastFrameTime = null;
            dbg('RainRadar: aus');
        } else {
            on = true;
            refreshFrame();                                    // load the first frame now
            refreshTimer = setInterval(refreshFrame, REFRESH_MS); // and keep it fresh
        }
        return on;
    }

    global.RainRadar = { init, toggle, isOn };
})(window);
