// js/tracker-speedlimit.js — show the current road's speed limit (OSM maxspeed via Overpass).
//
// Position-driven, independent of navigation: on each GPS fix (throttled) it asks Overpass for the
// road you're on and shows a round speed-limit sign. If your smoothed speed exceeds the limit, the
// sign turns red. Free + key-less (CLAUDE.md rule 18). Best-effort: Overpass can be slow/rate-limited,
// so failures are silent and the last known limit stays on screen.
window.TrackerSpeedLimit = function (ctx) {
    const { $ } = ctx;

    const OVERPASS = 'https://overpass-api.de/api/interpreter';
    const MIN_INTERVAL_MS = 5000;  // never query Overpass more often than this (was 15 s → too laggy when driving)
    const MIN_MOVE_M = 90;         // …and only after this much travel — limits change per road segment
    const QUERY_TIMEOUT_MS = 9000; // abort a stuck request so `fetching` can never freeze the sign forever
    const OVER_TOL_KMH = 3;        // grace before turning the sign red (GPS speed noise)
    const BING_OVER_KMH = 8;      // play the bell once you're this many km/h over the limit (absolute)
    const BING_REPEAT_MS = 12000;  // …and re-remind at most this often while still over

    let lastQ = 0;          // timestamp of the last Overpass query
    let lastPos = null;     // [lat,lng] at the last query
    let fetching = false;   // a query is in flight
    let curLimit = null;    // number (km/h) | 'none' (unlimited) | null (unknown)
    // The over-speed chime = the SMALL bell from glocken.html (its sample), so it sounds identical.
    const BELL_URL = '../resources/bells/wingsoarstudio-anvil-bell-2-wav-485668.mp3';
    let actx = null;        // Web Audio context (lazily unlocked on START)
    let bellBuf = null;     // decoded small-bell sample
    let bellLoading = false;
    let lastBing = 0;       // timestamp of the last chime, for the repeat throttle
    const BELL_KEY = 'trk_speed_bell';
    let bellOn = localStorage.getItem(BELL_KEY) !== '0'; // over-speed chime on/off (Settings→Debug), default ON

    function loadBell() {
        if (bellBuf || bellLoading || !actx) return;
        bellLoading = true;
        fetch(BELL_URL)
            .then((r) => r.arrayBuffer())
            .then((buf) => actx.decodeAudioData(buf))
            .then((decoded) => { bellBuf = decoded; })
            .catch(() => { /* keep bellBuf null → bing() uses the synth fallback */ })
            .finally(() => { bellLoading = false; });
    }

    // Play the small glocken bell. If the sample isn't ready (slow/offline), fall back to a short
    // synthesised bell so there is always an audible cue. Silent until unlockAudio() ran on START.
    function bing() {
        if (!actx || !bellOn) return;
        try {
            if (actx.state === 'suspended') actx.resume();
            if (bellBuf) {
                const src = actx.createBufferSource(); src.buffer = bellBuf;
                const g = actx.createGain(); g.gain.value = 0.85;
                src.connect(g); g.connect(actx.destination);
                src.start();
                return;
            }
            bingSynth();
        } catch (e) { /* audio not available → no chime */ }
    }

    function bingSynth() {
        const now = actx.currentTime;
        const master = actx.createGain();
        master.gain.value = 0.22;
        master.connect(actx.destination);
        [{ f: 1046, g: 1.0, d: 1.1 }, { f: 1568, g: 0.5, d: 0.9 },
         { f: 2093, g: 0.3, d: 0.7 }, { f: 2637, g: 0.18, d: 0.5 }].forEach((p) => {
            const o = actx.createOscillator(); o.type = 'sine'; o.frequency.value = p.f;
            const g = actx.createGain();
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(p.g, now + 0.005);
            g.gain.exponentialRampToValueAtTime(0.0001, now + p.d);
            o.connect(g); g.connect(master);
            o.start(now); o.stop(now + p.d + 0.05);
        });
    }

    // Must be called from within a user gesture (the START tap) so mobile browsers allow audio.
    function unlockAudio() {
        try {
            if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
            if (actx.state === 'suspended') actx.resume();
            loadBell();
        } catch (e) { actx = null; }
    }

    function haversine(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }

    // OSM maxspeed string → km/h number, 'none' (Autobahn unlimited), or null (unknown).
    // German implicit zone tags resolve to their legal default (so e.g. "DE:rural" shows 100, not blank).
    const DE_ZONE = { 'DE:urban': 50, 'DE:rural': 100, 'DE:motorway': 'none',
                      'DE:living_street': 7, 'DE:walk': 7, 'DE:bicycle_road': 30 };
    function parseMax(v) {
        if (!v) return null;
        if (/^\d+$/.test(v)) return parseInt(v, 10);                 // "50", "100"
        if (Object.prototype.hasOwnProperty.call(DE_ZONE, v)) return DE_ZONE[v]; // "DE:urban" → 50 …
        if (/\bnone\b/i.test(v)) return 'none';                      // "none" → unlimited
        if (/walk/i.test(v)) return 7;                              // "walk" ≈ Schrittgeschwindigkeit
        const mph = v.match(/^(\d+)\s*mph$/i);
        if (mph) return Math.round(parseInt(mph[1], 10) * 1.60934); // "30 mph" → km/h
        return null; // other implicit/conditional tags → unknown (show nothing rather than guess)
    }

    function setSign(limit, over) {
        const el = $('speed-sign'); if (!el) return;
        if (limit == null) { el.hidden = true; el.classList.remove('over'); return; }
        el.textContent = (limit === 'none') ? 'c' : String(limit); // 'none' = Autobahn unbegrenzt → c (Lichtgeschwindigkeit, das echte Limit)
        el.classList.toggle('over', !!over && limit !== 'none');
        el.hidden = false;
    }

    // Min distance (m) from point p=[lat,lng] to a way's geometry (array of {lat,lon}). Cheap
    // equirectangular projection + point-to-segment — good enough at street scale.
    function distToWay(p, geom) {
        if (!geom || geom.length < 1) return Infinity;
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (la, lo) => [lo * 111320 * k, la * 110540];
        const px = xy(p[0], p[1]);
        let min = Infinity;
        for (let i = 1; i < geom.length; i++) {
            const a = xy(geom[i - 1].lat, geom[i - 1].lon), b = xy(geom[i].lat, geom[i].lon);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((px[0] - a[0]) * dx + (px[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            min = Math.min(min, Math.hypot(px[0] - (a[0] + t * dx), px[1] - (a[1] + t * dy)));
        }
        if (geom.length === 1) { const a = xy(geom[0].lat, geom[0].lon); min = Math.hypot(px[0] - a[0], px[1] - a[1]); }
        return min;
    }

    async function query(p) {
        fetching = true;
        // Ways with a maxspeed within 35 m — we then pick the NEAREST (by geometry), not the first,
        // so a parallel road / ramp / crossing can't steal the wrong limit (Doc bug 2026-06-11).
        const q = '[out:json][timeout:8];way(around:35,' + p[0] + ',' + p[1] + ')[highway][maxspeed];out tags geom;';
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), QUERY_TIMEOUT_MS); // never let a stuck request freeze the sign
        try {
            const r = await fetch(OVERPASS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'data=' + encodeURIComponent(q),
                signal: ctrl.signal,
            });
            const j = await r.json();
            let best = null, bestD = Infinity;
            for (const e of (j && j.elements) || []) {
                const m = e.tags && parseMax(e.tags.maxspeed);
                if (m == null) continue;
                const d = distToWay(p, e.geometry);
                if (d < bestD) { bestD = d; best = m; } // nearest road with a parseable limit wins
            }
            curLimit = best;
            setSign(best, false);
        } catch (e) { /* timeout/offline/parse error → keep the last known sign */ }
        finally { clearTimeout(to); fetching = false; }
    }

    // Called from the core on every GPS fix: update the over-limit colour every time (cheap), and
    // re-query Overpass only when throttle + movement allow.
    function update(here, still, speedKmh) {
        if (typeof curLimit === 'number' && speedKmh != null) {
            setSign(curLimit, speedKmh > curLimit + OVER_TOL_KMH);
            // 8 km/h over the limit → the small bell. Re-reminds every BING_REPEAT_MS while still over.
            if (speedKmh > curLimit + BING_OVER_KMH) {
                if (Date.now() - lastBing > BING_REPEAT_MS) { bing(); lastBing = Date.now(); }
            } else if (speedKmh <= curLimit) {
                lastBing = 0; // back to legal → re-arm so the next exceedance chimes immediately
            }
        }
        // query while moving; ALSO do one query when we still have no limit (e.g. a standing cold
        // start) so the sign shows immediately on a known road, not only once you start driving.
        if (!here || fetching) return;
        if (still && curLimit != null) return;
        const now = Date.now();
        if (now - lastQ < MIN_INTERVAL_MS) return;
        if (lastPos && haversine(here, lastPos) < MIN_MOVE_M) return;
        lastQ = now; lastPos = here;
        query(here);
    }

    function clear() { curLimit = null; lastPos = null; lastBing = 0; setSign(null, false); }

    function setBell(on) { bellOn = !!on; try { localStorage.setItem(BELL_KEY, bellOn ? '1' : '0'); } catch (e) { } }
    function bellEnabled() { return bellOn; }

    return { update, clear, unlockAudio, setBell, bellEnabled };
};
