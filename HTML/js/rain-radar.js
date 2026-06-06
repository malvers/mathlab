// Optional rain-radar overlay ("Regenradar") for the Doc Alvers Tracker.
// Two free, NO-key sources, auto-picked by the map's position:
//   • Germany  → DWD 1×1 km radar (WMS) — sharp at any zoom; transparent where it's dry
//   • elsewhere → RainViewer global mosaic — coarse (native max zoom 7, then upscaled)
// The overlay is OFF by default and purely opt-in via toggle().
//
// Layer ordering: the radar lives in a DEDICATED Leaflet pane ('rain-radar') whose zIndex
// (250) sits ABOVE the OSM base tilePane (200) but BELOW the track polyline (overlayPane,
// 400) and the photo pins (markerPane, 600) — so it tints the basemap, never the track.
//
// Exposes one global, window.RainRadar:
//   init(map)  — store the map, create the pane, watch for border crossings
//   toggle()   — add/remove the overlay; returns the new on/off state
//   isOn()     — boolean

(function (global) {
    'use strict';

    const PANE_NAME = 'rain-radar';
    const PANE_Z_INDEX = 250;          // between OSM tilePane (200) and track overlayPane (400)
    const TILE_OPACITY = 0.6;
    const REFRESH_MS = 5 * 60 * 1000;  // both sources update ~every 5 min

    // --- RainViewer (global fallback) ---
    const RV_API = 'https://api.rainviewer.com/public/weather-maps.json';
    const RV_ATTR = '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>';

    // --- DWD (Germany, 1 km, free, no key) ---
    const DWD_WMS = 'https://maps.dwd.de/geoserver/dwd/wms';
    const DWD_LAYER = 'dwd:Niederschlagsradar'; // measured: dry areas render transparent (alpha 0)
    const DWD_ATTR = '<a href="https://www.dwd.de/" target="_blank" rel="noopener">DWD</a>';
    // DWD national radar coverage (≈ Germany + a margin). Inside → use DWD, else RainViewer.
    const GERMANY = { s: 47.0, n: 55.5, w: 5.5, e: 15.5 };

    let map = null;
    let on = false;
    let layer = null;        // the overlay layer currently on the map
    let provider = null;     // 'dwd' | 'rainviewer' — which source is showing

    let refreshTimer = null;

    // Route log lines into the central debug window when present; otherwise no-op.
    function dbg(msg) {
        if (typeof DebugWindow !== 'undefined' && DebugWindow && DebugWindow.log) DebugWindow.log(msg);
    }

    function inGermany(ll) {
        return !!ll && ll.lat >= GERMANY.s && ll.lat <= GERMANY.n && ll.lng >= GERMANY.w && ll.lng <= GERMANY.e;
    }
    // Which source fits the current map centre?
    function pickProvider() {
        return inGermany(map.getCenter()) ? 'dwd' : 'rainviewer';
    }

    // --- DWD: WMS layer of the latest radar frame. A changing extra param busts the tile
    //     cache so a long-open overlay still refreshes to the newest 5-min frame. ---
    function makeDwdLayer() {
        return L.tileLayer.wms(DWD_WMS, {
            layers: DWD_LAYER,
            format: 'image/png',
            transparent: true,
            version: '1.3.0',
            pane: PANE_NAME,
            opacity: TILE_OPACITY,
            attribution: DWD_ATTR,
            maxZoom: 21,            // upscale the 1 km grid when zoomed in close
            cacheBust: Date.now(),  // not a Leaflet option → forwarded as a WMS query param
        });
    }

    // --- RainViewer: tile layer of the most recent OBSERVED frame (nowcast ignored). ---
    function rvUrl(host, frame) {
        // 256 = tile size · 2 = colour scheme "universal blue" · 1_1 = smoothed + show-snow
        return host + frame.path + '/256/{z}/{x}/{y}/2/1_1.png';
    }
    async function makeRainViewerLayer() {
        const res = await fetch(RV_API, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const past = data && data.radar && data.radar.past;
        if (!Array.isArray(past) || past.length === 0) return null;
        const frame = past[past.length - 1];
        return L.tileLayer(rvUrl(data.host, frame), {
            pane: PANE_NAME,
            opacity: TILE_OPACITY,
            tileSize: 256,
            attribution: RV_ATTR,
            // RainViewer radar only exists up to z7 (measured — z8+ returns a placeholder).
            maxNativeZoom: 7,
            maxZoom: 21,
            zIndex: 1,
        });
    }

    // Build the overlay for `which`, add it, then drop the previous one (no blank flash).
    async function show(which) {
        if (!on || !map) return;
        let next;
        try {
            next = which === 'dwd' ? makeDwdLayer() : await makeRainViewerLayer();
        } catch (e) {
            dbg('RainRadar: Abruf fehlgeschlagen (' + (e && e.message ? e.message : e) + ')');
            return;
        }
        if (!next) { dbg('RainRadar: keine Daten'); return; }
        if (!on) return; // toggled off while awaiting
        next.addTo(map);
        const prev = layer;
        layer = next;
        provider = which;
        if (prev) {
            next.once('load', () => { if (prev !== layer) map.removeLayer(prev); });
            setTimeout(() => { if (prev !== layer && map.hasLayer(prev)) map.removeLayer(prev); }, 2000);
        }
        dbg('RainRadar: an (' + (which === 'dwd' ? 'DWD 1 km' : 'RainViewer') + ')');
    }

    // Periodic refresh: re-pick the source (you may have moved) and pull the newest frame.
    function refresh() {
        if (on && map) show(pickProvider());
    }

    // While on, swap the source when the map is panned across the DE border.
    function onMoveEnd() {
        if (on && map && pickProvider() !== provider) show(pickProvider());
    }

    function init(theMap) {
        map = theMap;
        if (!map.getPane(PANE_NAME)) {
            map.createPane(PANE_NAME);
            map.getPane(PANE_NAME).style.zIndex = PANE_Z_INDEX;
            // Radar tiles must not swallow taps meant for the map/markers underneath.
            map.getPane(PANE_NAME).style.pointerEvents = 'none';
        }
        map.on('moveend', onMoveEnd);
    }

    function isOn() { return on; }

    // Turn the overlay on or off. Returns the resulting state (true = on).
    function toggle() {
        if (!map) { dbg('RainRadar: init(map) fehlt'); return false; }
        if (on) {
            on = false;
            if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
            if (layer) { map.removeLayer(layer); layer = null; }
            provider = null;
            dbg('RainRadar: aus');
        } else {
            on = true;
            show(pickProvider());                          // load now…
            refreshTimer = setInterval(refresh, REFRESH_MS); // …and keep it fresh
        }
        return on;
    }

    global.RainRadar = { init, toggle, isOn };
})(window);
