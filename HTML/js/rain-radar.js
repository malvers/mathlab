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
    const OPACITY = 1;   // full opacity — Doc likes the punchy look ("sieht irre aus")
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
    let baseLayer = null;   // RainViewer "fill" under DWD so the whole view is covered, not just DE

    function dbg(m) {
        if (typeof DebugWindow !== 'undefined' && DebugWindow && DebugWindow.log) DebugWindow.log(m);
    }
    function inGermany(ll) {
        return !!ll && ll.lat >= GERMANY.s && ll.lat <= GERMANY.n && ll.lng >= GERMANY.w && ll.lng <= GERMANY.e;
    }
    // In Germany: sharp DWD 1 km (+2 h forecast) on TOP, with a RainViewer base underneath so the
    // rest of the view (NL, FR, …) is filled too. Elsewhere: RainViewer only. Set false → RV only.
    const USE_DWD_IN_DE = true;
    // DWD (sharp DE) kicks in as soon as Germany overlaps the VIEW at all — not just when the
    // map is centred there — so partial-DE views still get the sharp 1 km over the German part.
    function germanyInView() {
        if (!map) return false;
        const b = map.getBounds();
        return b.getSouth() < GERMANY.n && b.getNorth() > GERMANY.s
            && b.getWest() < GERMANY.e && b.getEast() > GERMANY.w;
    }
    function pickProvider() {
        return (USE_DWD_IN_DE && germanyInView()) ? 'dwd' : 'rv';
    }
    // ISO without milliseconds (what WMS time dimensions expect): 2026-06-06T08:35:00Z
    function isoMin(ms) {
        return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
    }

    // ---- client-side pixel filter for the DWD tiles -------------------------------
    // DWD's WMS style bakes TWO non-precipitation things into every radar tile:
    //   • a GREY no-data mask outside the radar range — measured RGB ≈126–141 (achromatic,
    //     alpha ~80); it veils the whole map outside coverage.
    //   • a MAGENTA coverage-boundary line ("Reichweitengrenze") — measured SYMMETRIC
    //     magenta peaking at FF00FF (R≈B, very low G).
    // We set both to full transparency on a canvas so ONLY the real rain stays and the OSM
    // base shows through everywhere else.
    //
    // CRUCIAL: the DWD colour ramp ALSO uses magenta/violet for EXTREME precipitation
    // (legend: …→red(240,0,0)→(192,0,144)→(96,0,192)→blue). Those MUST stay. They are
    // ASYMMETRIC (R−B≈48 / B−R≈96); the boundary line is SYMMETRIC (|R−B| small). So the
    // |R−B| ≤ 36 test strips the line while KEEPING the heaviest-rain cells. Every threshold
    // here was measured from real tiles + GetLegendGraphic — not guessed.
    const BOUNDARY_GREY = 205;        // recolour the boundary line to a light neutral grey…
    const BOUNDARY_ALPHA_SCALE = 1.0; // …keeping its full alpha for now (DEBUG: find the line, then dial down)
    function filterDwdPixels(d) {
        for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] === 0) continue;                       // already transparent
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
            const mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
            // 1) grey no-data mask → transparent (achromatic mid-grey; precip is always saturated)
            if (mx - mn < 30) {
                const avg = (r + g + b) / 3;
                if (avg >= 85 && avg <= 170) { d[i + 3] = 0; continue; }
            }
            // 2) magenta boundary line → faint neutral grey (symmetric R≈B, low G) so it stays
            //    as a quiet orientation hint. Extreme-precip magenta/violet are asymmetric
            //    (|R−B|>36) → untouched.
            if (r > 140 && b > 120 && g < r - 35 && g < b - 25 && (r > b ? r - b : b - r) <= 36) {
                d[i] = d[i + 1] = d[i + 2] = BOUNDARY_GREY;
                d[i + 3] = Math.round(d[i + 3] * BOUNDARY_ALPHA_SCALE);
            }
        }
    }

    // A DWD WMS layer that pushes every tile through filterDwdPixels() on a canvas before it
    // is shown. Built lazily so Leaflet (L) is guaranteed loaded. CORS on maps.dwd.de is
    // 'Access-Control-Allow-Origin: *' (measured) → the crossOrigin canvas read is allowed.
    //
    // GOTCHA (measured): Leaflet's _abortLoading() prunes every tile of a zoom level being
    // left whose `tile.complete` is not truthy. A real <img> reports complete===true once
    // loaded, so it is retained as parent coverage during a zoom; a <canvas> has NO `complete`
    // property → Leaflet treats every loaded canvas tile as "still loading" and removes it the
    // instant you zoom → the whole DWD layer blanks out. Fix: stamp `complete = true` on the
    // canvas once it is ready, so it survives _abortLoading just like an <img> would.
    let FilteredDwdWMS = null;
    function ensureFilteredClass() {
        if (FilteredDwdWMS || typeof L === 'undefined') return FilteredDwdWMS;
        FilteredDwdWMS = L.TileLayer.WMS.extend({
            createTile: function (coords, done) {
                const tile = document.createElement('canvas');
                const size = this.getTileSize();
                tile.width = size.x;
                tile.height = size.y;
                const ctx = tile.getContext('2d', { willReadFrequently: true });
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function () {
                    try {
                        ctx.drawImage(img, 0, 0, size.x, size.y);
                        const id = ctx.getImageData(0, 0, size.x, size.y);
                        filterDwdPixels(id.data);
                        ctx.putImageData(id, 0, 0);
                    } catch (e) {
                        // tainted canvas / decode issue → fall back to the unfiltered tile
                        try { ctx.clearRect(0, 0, size.x, size.y); ctx.drawImage(img, 0, 0, size.x, size.y); } catch (_) {}
                    }
                    tile.complete = true;   // make Leaflet's _abortLoading keep it across zooms
                    done(null, tile);
                };
                img.onerror = function (e) { tile.complete = true; done(e, tile); };
                img.src = this.getTileUrl(coords);
                return tile;
            }
        });
        return FilteredDwdWMS;
    }

    // ---- per-frame layer factories ----
    function dwdLayer(ms) {
        const opts = {
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
            zIndex: 5,              // sits ABOVE the RainViewer base (zIndex 1)
            crossOrigin: 'anonymous',
        };
        const Cls = ensureFilteredClass();
        return Cls ? new Cls(DWD_WMS, opts) : L.tileLayer.wms(DWD_WMS, opts);
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

    // Latest observed RainViewer frame as a single layer — the global base under the DWD
    // overlay so areas outside DWD's German coverage are still filled (NL, FR, …).
    async function rvCurrentLayer() {
        const res = await fetch(RV_API, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const past = (data.radar && data.radar.past) || [];
        if (!past.length) return null;
        return rvLayer(data.host, past[past.length - 1]);
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
        return hh + ':' + mm;
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
        // Idle = light/neutral; active = orange. Applies to the slider, PLAY and the time label.
        const SLIDER_IDLE = 'rgba(255,255,255,0.45)', SLIDER_ACTIVE = '#f5c242';
        ui = document.createElement('div');
        ui.id = 'rain-slider';
        ui.style.cssText = 'position:fixed; left:50%; top:20px; transform:translateX(-50%);'
            + 'display:flex; flex-direction:column; align-items:stretch; gap:6px; padding:8px 12px; max-width:92vw; box-sizing:border-box;'
            + 'background:rgba(8,20,42,0.92); border:none; border-radius:12px;'
            + 'box-shadow:0 4px 16px rgba(0,0,0,0.5); z-index:1200; font-family:\'Orbitron\',sans-serif; color:#f5c242;';

        playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.textContent = '▶';
        playBtn.title = 'Abspielen';
        playBtn.style.cssText = 'flex:0 0 auto; width:32px; height:28px; border-radius:8px; cursor:pointer;'
            + 'background:transparent; border:none; color:' + SLIDER_IDLE + '; font-size:13px;';
        playBtn.onclick = togglePlay;

        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = String(Math.max(0, frames.length - 1));
        slider.step = '1';
        slider.value = String(nowIdx);
        // Slider, PLAY and the time label stay light/neutral when idle; turn orange only while
        // the user is dragging/selecting the timeline.
        slider.style.cssText = 'flex:1 1 180px; min-width:130px; accent-color:' + SLIDER_IDLE + '; cursor:pointer;';
        const sliderActive = () => { slider.style.accentColor = SLIDER_ACTIVE; playBtn.style.color = SLIDER_ACTIVE; if (lbl) lbl.style.color = SLIDER_ACTIVE; };
        const sliderIdle = () => { slider.style.accentColor = SLIDER_IDLE; playBtn.style.color = SLIDER_IDLE; if (lbl) lbl.style.color = SLIDER_IDLE; };
        slider.addEventListener('pointerdown', sliderActive);
        slider.addEventListener('focus', sliderActive);
        slider.addEventListener('pointerup', sliderIdle);
        slider.addEventListener('pointercancel', sliderIdle);
        slider.addEventListener('blur', sliderIdle);
        slider.oninput = function () { pause(); showIndex(parseInt(slider.value, 10)); };

        lbl = document.createElement('span');
        lbl.style.cssText = 'flex:0 0 auto; font-size:0.68rem; letter-spacing:0.04em; min-width:98px; text-align:right; white-space:nowrap; color:' + SLIDER_IDLE + ';';

        // Controls stay on one row; a build-time readout sits UNDER them so Doc can see
        // at a glance whether the freshly-pushed version has reached the device yet.
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; gap:10px;';
        row.appendChild(playBtn);
        row.appendChild(slider);
        row.appendChild(lbl);

        // document.lastModified = the served HTML's Last-Modified header → the real build/
        // deploy time. It updates by itself once the new file clears the Pages cache.
        const build = document.createElement('div');
        build.style.cssText = 'font-size:0.56rem; letter-spacing:0.05em; text-align:center;'
            + ' white-space:nowrap; color:rgba(255,255,255,0.6);';
        const lm = new Date(document.lastModified);
        const pad = (n) => String(n).padStart(2, '0');
        build.textContent = isNaN(lm.getTime())
            ? 'BUILD ' + (document.lastModified || '?')
            : 'BUILD ' + pad(lm.getDate()) + '.' + pad(lm.getMonth() + 1) + '. '
              + pad(lm.getHours()) + ':' + pad(lm.getMinutes()) + ':' + pad(lm.getSeconds());

        ui.appendChild(row);
        ui.appendChild(build);
        document.body.appendChild(ui);
        lbl.textContent = frameLabel(nowIdx);
    }
    function removeUI() {
        pause();
        if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
        ui = slider = lbl = playBtn = null;
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
        // DWD only covers Germany → lay a RainViewer base underneath so the rest of the view
        // (NL, FR, …) stays filled. The slider/+2 h forecast drives the DWD layer on top.
        if (which === 'dwd' && !baseLayer) {
            try { const b = await rvCurrentLayer(); if (b && on) { baseLayer = b; baseLayer.addTo(map); } }
            catch (e) { dbg('RainRadar: RainViewer-Basis fehlgeschlagen (' + (e && e.message ? e.message : e) + ')'); }
        }
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
            if (baseLayer) { map.removeLayer(baseLayer); baseLayer = null; }
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
            if (layer) { map.removeLayer(layer); layer = null; }
            if (baseLayer) { map.removeLayer(baseLayer); baseLayer = null; }
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
