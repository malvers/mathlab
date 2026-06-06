// Rain-radar overlay ("Regenradar") with a TIME SLIDER for the Doc Alvers Tracker.
// Two free, NO-key sources, auto-picked by the map's position:
//   • Germany  → DWD RV product (1×1 km) — carries the radar nowcast forecast to +2 h
//   • elsewhere → RainViewer global mosaic — past ~2 h + nowcast ~30 min
//
// A self-contained bottom slider scrubs through time (◀ play ▶); the time label shows the
// clock time + a "jetzt / +45 min" hint. The overlay is OFF by default, opt-in via toggle().
//
// Frame discovery is done at RUNTIME by the app:
//   - RainViewer: one lightweight JSON call returns past[] + nowcast[] frames (time + path).
//   - DWD: the RV product is a WMS time-dimension layer. We request each 5-min step
//     (−15 … +120 min, rounded to the standard 5-min UTC radar cadence) as its own
//     WMS frame via the `time` parameter. Missing frames just render empty (graceful).
//
// Layer ordering: dedicated pane 'rain-radar' (zIndex 250) — above the OSM base (200),
// below the track (overlayPane 400) and photo pins (markerPane 600).
//
// Exposes window.RainRadar: init(map), toggle() -> bool, isOn().

(function (global) {
    'use strict';

    const PANE_NAME = 'rain-radar';
    const PANE_Z_INDEX = 250;
    const OPACITY = 0.6;
    const MS5 = 5 * 60 * 1000;

    // --- DWD (Germany, 1 km, no key). RV = nowcast/forecast product (+0…+2 h). ---
    const DWD_WMS = 'https://maps.dwd.de/geoserver/dwd/wms';
    const DWD_RV_LAYER = 'dwd:Radar_rv_product_1x1km_ger';
    const DWD_ATTR = '<a href="https://www.dwd.de/" target="_blank" rel="noopener">DWD</a>';
    const GERMANY = { s: 47.0, n: 55.5, w: 5.5, e: 15.5 }; // DWD coverage ≈ Germany + margin
    const FC_MIN = -15;   // slider start, minutes relative to now (a little past so "now" has data)
    const FC_MAX = 120;   // slider end → +2 h forecast

    // --- RainViewer (global fallback). ---
    const RV_API = 'https://api.rainviewer.com/public/weather-maps.json';
    const RV_ATTR = '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>';

    let map = null;
    let on = false;
    let layer = null;       // overlay layer currently on the map
    let provider = null;    // 'dwd' | 'rv'
    let frames = [];        // [{ t:<ms>, make:() => L.Layer }]
    let idx = 0;            // index of the frame currently shown
    let nowIdx = 0;         // index that represents "now"

    // slider UI
    let ui = null, slider = null, lbl = null, playBtn = null, playTimer = null;
    let vignette = null;    // soft screen-edge darkening while the radar is on (focus the middle)

    function dbg(m) {
        if (typeof DebugWindow !== 'undefined' && DebugWindow && DebugWindow.log) DebugWindow.log(m);
    }
    function inGermany(ll) {
        return !!ll && ll.lat >= GERMANY.s && ll.lat <= GERMANY.n && ll.lng >= GERMANY.w && ll.lng <= GERMANY.e;
    }
    function pickProvider() {
        return inGermany(map.getCenter()) ? 'dwd' : 'rv';
    }
    // ISO without milliseconds (what WMS time dimensions expect): 2026-06-06T08:35:00Z
    function isoMin(ms) {
        return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
    }

    // ---- per-frame layer factories ----
    function dwdLayer(ms) {
        return L.tileLayer.wms(DWD_WMS, {
            layers: DWD_RV_LAYER,
            format: 'image/png',
            transparent: true,
            version: '1.3.0',
            time: isoMin(ms),       // forwarded as a WMS query param (not a Leaflet option)
            interpolations: 'bilinear', // GeoServer renders the 1 km grid smoothed → soft gradients
                                        // instead of blocky cells (measured: WetterOnline-like look)
            pane: PANE_NAME,
            opacity: OPACITY,
            attribution: DWD_ATTR,
            maxZoom: 21,            // WMS renders every zoom on demand → crisp at any level
        });
    }
    function rvLayer(host, frame) {
        // 256 = tile size · 2 = colour scheme "universal blue" · 1_1 = smoothed + show-snow
        return L.tileLayer(host + frame.path + '/256/{z}/{x}/{y}/2/1_1.png', {
            pane: PANE_NAME,
            opacity: OPACITY,
            tileSize: 256,
            attribution: RV_ATTR,
            maxNativeZoom: 7,       // measured: z8+ returns a "Zoom Level Not Supported" placeholder
            maxZoom: 21,
            zIndex: 1,
        });
    }

    // Build the frame list for `which`. Returns true if a timeline was built.
    async function buildFrames(which) {
        frames = [];
        nowIdx = 0;
        if (which === 'dwd') {
            const t0 = Math.floor(Date.now() / MS5) * MS5; // now, rounded down to 5 min (UTC-safe)
            for (let mn = FC_MIN; mn <= FC_MAX; mn += 5) {
                const t = t0 + mn * 60000;
                frames.push({ t: t, make: (function (tt) { return function () { return dwdLayer(tt); }; })(t) });
                if (mn === 0) nowIdx = frames.length - 1;
            }
            return frames.length > 0;
        }
        // RainViewer
        const res = await fetch(RV_API, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const host = data.host;
        const past = (data.radar && data.radar.past) || [];
        const fore = (data.radar && data.radar.nowcast) || [];
        past.forEach(function (f) { frames.push({ t: f.time * 1000, make: function () { return rvLayer(host, f); } }); });
        nowIdx = Math.max(0, frames.length - 1); // last observed frame = "now"
        fore.forEach(function (f) { frames.push({ t: f.time * 1000, make: function () { return rvLayer(host, f); } }); });
        return frames.length > 0;
    }

    function frameLabel(i) {
        const f = frames[i];
        if (!f) return '';
        const d = new Date(f.t);
        const hh = ('0' + d.getHours()).slice(-2);
        const mm = ('0' + d.getMinutes()).slice(-2);
        const dmin = Math.round((f.t - Date.now()) / 60000);
        let rel;
        if (Math.abs(dmin) < 3) rel = 'jetzt';
        else if (dmin > 0) rel = '+' + dmin + ' min';
        else rel = dmin + ' min';
        return hh + ':' + mm + '  (' + rel + ')';
    }

    // Show frame i, swapping out the previous layer once the new one has painted.
    function showIndex(i) {
        if (!on || !map || !frames[i]) return;
        idx = i;
        let next;
        try { next = frames[i].make(); }
        catch (e) { dbg('RainRadar: Layer-Fehler ' + e); return; }
        next.addTo(map);
        const prev = layer;
        layer = next;
        provider = provider; // unchanged
        if (prev) {
            next.once('load', function () { if (prev !== layer) map.removeLayer(prev); });
            setTimeout(function () { if (prev !== layer && map.hasLayer(prev)) map.removeLayer(prev); }, 1200);
        }
        if (slider && slider.value !== String(i)) slider.value = String(i);
        if (lbl) lbl.textContent = frameLabel(i);
    }

    // ---- slider UI (self-contained, created only while the overlay is on) ----
    function buildUI() {
        removeUI();
        ui = document.createElement('div');
        ui.id = 'rain-slider';
        ui.style.cssText = 'position:fixed; left:50%; bottom:96px; transform:translateX(-50%);'
            + 'display:flex; align-items:center; gap:10px; padding:8px 12px; max-width:92vw; box-sizing:border-box;'
            + 'background:rgba(8,20,42,0.92); border:1px solid rgba(245,194,66,0.6); border-radius:12px;'
            + 'box-shadow:0 4px 16px rgba(0,0,0,0.5); z-index:1200; font-family:\'Orbitron\',sans-serif; color:#f5c242;';

        playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.textContent = '▶';
        playBtn.title = 'Abspielen';
        playBtn.style.cssText = 'flex:0 0 auto; width:32px; height:28px; border-radius:8px; cursor:pointer;'
            + 'background:transparent; border:1px solid rgba(245,194,66,0.7); color:#f5c242; font-size:13px;';
        playBtn.onclick = togglePlay;

        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = String(Math.max(0, frames.length - 1));
        slider.step = '1';
        slider.value = String(nowIdx);
        slider.style.cssText = 'flex:1 1 180px; min-width:130px; accent-color:#f5c242; cursor:pointer;';
        slider.oninput = function () { pause(); showIndex(parseInt(slider.value, 10)); };

        lbl = document.createElement('span');
        lbl.style.cssText = 'flex:0 0 auto; font-size:0.68rem; letter-spacing:0.04em; min-width:98px; text-align:right; white-space:nowrap;';

        ui.appendChild(playBtn);
        ui.appendChild(slider);
        ui.appendChild(lbl);
        document.body.appendChild(ui);
        lbl.textContent = frameLabel(nowIdx);
    }
    function removeUI() {
        pause();
        if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
        ui = slider = lbl = playBtn = null;
    }

    // Soft vignette over the map: bright in the middle, darkening towards the edges. It de-
    // emphasises the busy periphery — including DWD's magenta coverage boundary, which is baked
    // into the radar tiles and can't be thinned from here. Sits above the map (z 1), below the
    // HUD (z ≥ 500). Dark blue per house style (never pure black).
    function addVignette() {
        removeVignette();
        vignette = document.createElement('div');
        vignette.id = 'rain-vignette';
        vignette.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:300;'
            + 'background:radial-gradient(ellipse 80% 80% at 50% 44%, rgba(8,20,42,0) 48%,'
            + ' rgba(8,20,42,0.28) 76%, rgba(8,20,42,0.62) 100%);';
        document.body.appendChild(vignette);
    }
    function removeVignette() {
        if (vignette && vignette.parentNode) vignette.parentNode.removeChild(vignette);
        vignette = null;
    }

    function togglePlay() { if (playTimer) pause(); else play(); }
    function play() {
        if (playTimer || frames.length < 2) return;
        if (playBtn) playBtn.textContent = '⏸';
        playTimer = setInterval(function () {
            let n = idx + 1;
            if (n >= frames.length) n = 0;
            showIndex(n);
        }, 700);
    }
    function pause() {
        if (playTimer) { clearInterval(playTimer); playTimer = null; }
        if (playBtn) playBtn.textContent = '▶';
    }

    // Build the timeline for the current position and show it; fall back to a single
    // latest frame (no slider) if the timeline can't be built.
    async function start() {
        const which = pickProvider();
        let ok = false;
        try { ok = await buildFrames(which); }
        catch (e) { dbg('RainRadar: Frame-Aufbau fehlgeschlagen (' + (e && e.message ? e.message : e) + ')'); }
        if (!on) return;
        provider = which;
        addVignette();
        if (ok && frames.length) {
            buildUI();
            showIndex(nowIdx);
            dbg('RainRadar: an (' + (which === 'dwd' ? 'DWD +2h' : 'RainViewer') + ', ' + frames.length + ' Frames)');
            return;
        }
        // graceful fallback: just the most recent frame, no slider
        frames = [];
        try {
            if (which === 'dwd') {
                layer = dwdLayer(Date.now());
                layer.addTo(map);
            } else {
                const res = await fetch(RV_API, { cache: 'no-store' });
                const d = await res.json();
                const p = d.radar.past;
                layer = rvLayer(d.host, p[p.length - 1]);
                layer.addTo(map);
            }
            dbg('RainRadar: an (nur aktuell, kein Zeitverlauf)');
        } catch (e) { dbg('RainRadar: Fallback fehlgeschlagen ' + e); }
    }

    // Swap the source when the map is panned across the DE border (while on).
    function onMoveEnd() {
        if (!on || !map) return;
        if (pickProvider() !== provider) {
            if (layer) { map.removeLayer(layer); layer = null; }
            removeUI();
            start();
        }
    }

    function init(theMap) {
        map = theMap;
        if (!map.getPane(PANE_NAME)) {
            map.createPane(PANE_NAME);
            map.getPane(PANE_NAME).style.zIndex = PANE_Z_INDEX;
            map.getPane(PANE_NAME).style.pointerEvents = 'none';
        }
        map.on('moveend', onMoveEnd);
    }

    function isOn() { return on; }

    function toggle() {
        if (!map) { dbg('RainRadar: init(map) fehlt'); return false; }
        if (on) {
            on = false;
            removeUI();
            removeVignette();
            if (layer) { map.removeLayer(layer); layer = null; }
            frames = [];
            provider = null;
            dbg('RainRadar: aus');
        } else {
            on = true;
            start();
        }
        return on;
    }

    global.RainRadar = { init, toggle, isOn };
})(window);
