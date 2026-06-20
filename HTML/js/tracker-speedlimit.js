// js/tracker-speedlimit.js — show the current road's speed limit (OSM maxspeed via Overpass).
//
// Position-driven, independent of navigation: on each GPS fix (throttled) it asks Overpass for the
// road you're on and shows a round speed-limit sign. If your smoothed speed exceeds the limit, the
// sign turns red. Free + key-less (CLAUDE.md rule 18). Best-effort: Overpass can be slow/rate-limited,
// so failures are silent and the last known limit stays on screen.
window.TrackerSpeedLimit = function (ctx) {
    const { $ } = ctx;

    // Several public Overpass mirrors — the main one is often slow / rate-limited (HTTP 429), which
    // left the sign blank even on tagged roads. We try them in order until one answers (CLAUDE.md
    // rule 18: all key-less). Order is rotated each call so we don't always hammer the same mirror.
    const OVERPASS_MIRRORS = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.private.coffee/api/interpreter',
    ];
    let mirrorRot = 0;
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

    // Optional one-liner into the existing DebugWindow so Doc can tell "no tag on this road" apart
    // from "Overpass unreachable" without adding any new on-screen element.
    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('🛑 ' + msg); } catch (e) { } }

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
        const zone = v.match(/^[A-Z]{2}:(\d+)$/i);                   // zone tags like "DE:30" → 30
        if (zone) return parseInt(zone[1], 10);
        const mph = v.match(/^(\d+)\s*mph$/i);
        if (mph) return Math.round(parseInt(mph[1], 10) * 1.60934); // "30 mph" → km/h
        return null; // other implicit/conditional tags → unknown (show nothing rather than guess)
    }

    // Road types whose limit we want to show — exclude footways, cycleways, tracks etc. so a parallel
    // path can never steal the sign for the road you're actually driving on.
    const DRIVE_HW = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary',
        'unclassified', 'residential', 'living_street', 'service', 'road',
        'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link']);

    // A way's limit, EXPLICIT first then IMPLICIT. In Germany most roads carry NO `maxspeed` tag —
    // they only hint the zone via maxspeed:type / zone:maxspeed / source:maxspeed (e.g. "DE:urban" →
    // 50, "DE:rural" → 100). Reading those is what makes the sign appear on ordinary streets, not
    // just the rare explicitly-tagged ones. Returns number | 'none' | null (unknown → no sign).
    function wayLimit(tags) {
        if (!tags || !DRIVE_HW.has(tags.highway)) return null;
        const explicit = parseMax(tags.maxspeed);
        if (explicit != null) return explicit;
        // Implicit zone hints, in order of how trustworthy they are for the legal default.
        return parseMax(tags['maxspeed:type'])
            ?? parseMax(tags['zone:maxspeed'])
            ?? parseMax(tags['source:maxspeed']);
    }

    function setSign(limit, over) {
        const el = $('speed-sign'); if (!el) return;
        // 'none' (OSM maxspeed=none, Autobahn unbegrenzt) → 'c' (Lichtgeschwindigkeit, das echte Limit).
        // null (limit unknown — no OSM hint, e.g. in the browser) → '?' so it reads "unbekannt", not "unbegrenzt".
        const txt = (limit === 'none') ? 'c' : (limit == null) ? '?' : String(limit);
        el.textContent = txt;
        el.classList.toggle('cee', txt === 'c'); // 'c' is an x-height glyph → sits low; nudge it up a tick (see CSS)
        el.classList.toggle('s3', txt.length >= 3); // 3-digit limits (100/120/130) → smaller, tighter font to fit the disc
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

    // POST the query to each mirror in turn (rotated start) until one answers; abort a stuck request
    // after QUERY_TIMEOUT_MS. Returns the parsed JSON, or null if every mirror failed.
    async function overpass(q) {
        for (let i = 0; i < OVERPASS_MIRRORS.length; i++) {
            const url = OVERPASS_MIRRORS[(mirrorRot + i) % OVERPASS_MIRRORS.length];
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), QUERY_TIMEOUT_MS);
            try {
                const r = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'data=' + encodeURIComponent(q),
                    signal: ctrl.signal,
                });
                if (!r.ok) continue;            // 429/5xx → try the next mirror
                const j = await r.json();
                mirrorRot = (mirrorRot + i) % OVERPASS_MIRRORS.length; // stick with the one that worked
                return j;
            } catch (e) { /* timeout/offline/parse → next mirror */ }
            finally { clearTimeout(to); }
        }
        return null;
    }

    async function query(p) {
        fetching = true;
        // ALL drivable ways within 35 m (not only those carrying an explicit `maxspeed`): most German
        // roads have none and only hint the zone via maxspeed:type/zone:maxspeed → wayLimit() resolves
        // those to the legal default. We then pick the NEAREST way that yields a limit, so a parallel
        // road / ramp / crossing can't steal the wrong sign (Doc bug 2026-06-11).
        const q = '[out:json][timeout:8];way(around:35,' + p[0] + ',' + p[1] + ')[highway];out tags geom;';
        try {
            const j = await overpass(q);
            if (!j) { dbg('Overpass: alle Mirror fehlgeschlagen → letztes Schild bleibt'); return; }
            let best = null, bestD = Infinity, ways = 0;
            for (const e of (j.elements) || []) {
                ways++;
                const m = wayLimit(e.tags);
                if (m == null) continue;
                const d = distToWay(p, e.geometry);
                if (d < bestD) { bestD = d; best = m; } // nearest road with a resolvable limit wins
            }
            if (best == null) {                 // road untagged → don't blank a previously good sign
                dbg('Limit: ' + ways + ' Wege, keiner mit (impliziter) Begrenzung → kein Tag');
                return;
            }
            dbg('Limit: ' + best + ' (' + Math.round(bestD) + ' m)');
            curLimit = best;
            setSign(best, false);
        } catch (e) { /* parse error → keep the last known sign */ }
        finally { fetching = false; }
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
        // Once we HAVE a limit, only re-query after real travel (limits change per road segment, so no
        // point hammering Overpass on the same one). But while we still have NO limit — cold start, or a
        // failed/empty earlier query — keep retrying on the 5 s throttle so the sign appears quickly
        // instead of staying "?" until 90 m of travel (Doc 2026-06-20: "?" stuck while walking slowly).
        if (curLimit != null && lastPos && haversine(here, lastPos) < MIN_MOVE_M) return;
        lastQ = now; lastPos = here;
        query(here);
    }

    function clear() { curLimit = null; lastPos = null; lastBing = 0; setSign(null, false); }

    function setBell(on) { bellOn = !!on; try { localStorage.setItem(BELL_KEY, bellOn ? '1' : '0'); } catch (e) { } }
    function bellEnabled() { return bellOn; }

    setSign(null, false); // show the ∞ default right away, before the first GPS fix (Doc 2026-06-18)

    return { update, clear, unlockAudio, setBell, bellEnabled };
};
