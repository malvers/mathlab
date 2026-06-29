// js/tracker-speedlimit.js — show the current road's speed limit (OSM maxspeed via Overpass).
//
// Position-driven, independent of navigation: on each GPS fix (throttled) it asks Overpass for the
// road you're on and shows a round speed-limit sign. If your smoothed speed exceeds the limit, the
// sign turns red. Free + key-less (CLAUDE.md rule 18). Best-effort: Overpass can be slow/rate-limited,
// so failures are silent and the last known limit stays on screen.
window.TrackerSpeedLimit = function (ctx) {
    const { $ } = ctx;
    // Optional route speed profile (js/tracker-speedprofile.js): while navigating it gives the limit
    // INSTANTLY at the exact switch point (and lets us skip live Overpass polling). Attached after init
    // via setProfile() so creation order doesn't matter.
    let profile = ctx.profile || null;

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
    let curConfirmed = true; // is curLimit a mapped/signed limit (true) or only the generic legal default (false)?
    let lastRoad = null;    // { ref, name, highway } of the nearest road (for tracker-traffic) — null until first query
    // The over-speed chime = the SMALL bell from glocken.html (its sample), so it sounds identical.
    const BELL_URL = '../resources/bells/wingsoarstudio-anvil-bell-2-wav-485668.mp3';
    let actx = null;        // Web Audio context (lazily unlocked on START)
    let bellBuf = null;     // decoded small-bell sample
    let bellLoading = false;
    let lastBing = 0;       // timestamp of the last chime, for the repeat throttle
    let lastSpeedKmh = 0;   // most recent smoothed speed (km/h) — for the fines panel on a sign tap
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

    // The generic "legal default" zone tags — these say only "it's a city/rural/motorway road", NOT that
    // a real sign was seen. Trusting them as a SOLID number showed 50 on streets that are actually Tempo-30
    // zones whose 30-sign just isn't mapped (Doc 2026-06-30: "30-Zone zeigt 50"). wayLimit() therefore
    // still drops them so a confirmed/signed limit is never invented. BUT dropping them entirely left the
    // live sign at "?" almost always (most German roads carry ONLY this generic hint), so genericDefault()
    // below re-surfaces them as an explicitly UNCONFIRMED value (dimmed, dashed ring) — honest, not
    // confidently-wrong (Doc 2026-06-29, OTWA's idea).
    const GENERIC_DEFAULT = /^DE:(urban|rural|motorway)$/i;
    function implicitLimit(v) {
        if (!v || GENERIC_DEFAULT.test(v)) return null; // generic default → not a confirmed limit
        return parseMax(v);                              // specific zone (DE:30, living_street, …) → trust
    }

    // The generic legal default for a drivable way that carries ONLY the implicit zone hint (no explicit
    // maxspeed, no specific zone): DE:urban→50, DE:rural→100, DE:motorway→'none'. number | 'none' | null.
    // Shown UNCONFIRMED so it can't masquerade as a mapped sign; a confirmed wayLimit() always takes
    // precedence. null when there isn't even a generic hint (truly unknown → "?").
    const DE_GENERIC = { 'DE:urban': 50, 'DE:rural': 100, 'DE:motorway': 'none' };
    function genericDefault(tags) {
        if (!tags || !DRIVE_HW.has(tags.highway)) return null;
        const t = tags['maxspeed:type'] || tags['zone:maxspeed'] || tags['source:maxspeed'];
        return (t && Object.prototype.hasOwnProperty.call(DE_GENERIC, t)) ? DE_GENERIC[t] : null;
    }

    // A way's limit. Trust only what's actually SIGNED: an explicit `maxspeed`, or a SPECIFIC implicit
    // zone (e.g. a tagged 30-zone, living_street). The generic urban/rural/motorway defaults are dropped
    // (see above) so we never overwrite an unmapped 30-zone with a wrong 50. number | 'none' | null.
    function wayLimit(tags) {
        if (!tags || !DRIVE_HW.has(tags.highway)) return null;
        const explicit = parseMax(tags.maxspeed);
        if (explicit != null) return explicit;
        return implicitLimit(tags['maxspeed:type'])
            ?? implicitLimit(tags['zone:maxspeed'])
            ?? implicitLimit(tags['source:maxspeed']);
    }

    // Font-metric auto-fit: measure the glyphs with a canvas and pick the largest font size whose text
    // width still fits the disc's usable inner area. Replaces the old fixed clamp/.s3 guess that left
    // "120/130" either overflowing or too small — now ANY string is sized to fill the sign exactly.
    const fitCanvas = document.createElement('canvas').getContext('2d');
    function fitSignText(el, txt) {
        // Disc is 44px with a 5px ring → ~34px inner Ø; keep a hair of padding so glyphs never kiss the ring.
        const inner = 30;
        let size = 19; // upper bound for 1–2 digit signs (fills the disc without touching the ring)
        fitCanvas.font = '700 ' + size + 'px Arial, Helvetica, sans-serif';
        const w = fitCanvas.measureText(txt).width;
        if (w > inner) size = Math.max(10, Math.floor(size * inner / w)); // scale down only, never below 10px
        el.style.fontSize = size + 'px';
    }

    // confirmed: true = a mapped/signed limit (solid sign); false = the generic legal default (dimmed +
    // dashed ring so it reads "probably, not confirmed"); omitted → treated as confirmed (legacy callers).
    function setSign(limit, over, confirmed) {
        const el = $('speed-sign'); if (!el) return;
        // 'none' (OSM maxspeed=none, Autobahn unbegrenzt) → 'c' (Lichtgeschwindigkeit, das echte Limit).
        // null (limit unknown — no OSM hint, e.g. in the browser) → '?' so it reads "unbekannt", not "unbegrenzt".
        const txt = (limit === 'none') ? 'c' : (limit == null) ? '?' : String(limit);
        el.textContent = txt;
        el.classList.toggle('cee', txt === 'c'); // 'c' is an x-height glyph → sits low; nudge it up a tick (see CSS)
        el.classList.toggle('s3', txt.length >= 3); // 3-digit limits (100/120/130) → tighter letter-spacing (see CSS)
        el.classList.toggle('over', !!over && limit !== 'none');
        // Unconfirmed = the generic legal default, not a mapped sign → dimmed + dashed ring (see CSS).
        el.classList.toggle('unconfirmed', confirmed === false && limit != null);
        fitSignText(el, txt); // size the glyphs to the disc via measured metrics (overrides the CSS font-size)
        el.hidden = false;
    }

    // Min distance (m) from point p=[lat,lng] to a way's geometry (array of {lat,lon}). Cheap
    // equirectangular projection + point-to-segment — good enough at street scale. Returns the nearest
    // distance (m) AND the compass bearing of that nearest segment, so the caller can reject ways whose
    // direction doesn't match where you're actually driving (a crossing / perpendicular road).
    function nearestSeg(p, geom) {
        if (!geom || geom.length < 1) return { d: Infinity, brg: null };
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (la, lo) => [lo * 111320 * k, la * 110540];
        const px = xy(p[0], p[1]);
        let min = Infinity, brg = null;
        for (let i = 1; i < geom.length; i++) {
            const a = xy(geom[i - 1].lat, geom[i - 1].lon), b = xy(geom[i].lat, geom[i].lon);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((px[0] - a[0]) * dx + (px[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(px[0] - (a[0] + t * dx), px[1] - (a[1] + t * dy));
            if (d < min) { min = d; brg = bearingDeg(geom[i - 1], geom[i]); } // bearing of the closest segment
        }
        if (geom.length === 1) { const a = xy(geom[0].lat, geom[0].lon); min = Math.hypot(px[0] - a[0], px[1] - a[1]); }
        return { d: min, brg };
    }

    // Compass bearing a→b in degrees [0,360). a/b are {lat,lon} (way nodes) or [lat,lng] (GPS) — read both.
    function bearingDeg(a, b) {
        const t = Math.PI / 180;
        const la1 = (a.lat != null ? a.lat : a[0]) * t, la2 = (b.lat != null ? b.lat : b[0]) * t;
        const dLon = ((b.lon != null ? b.lon : b[1]) - (a.lon != null ? a.lon : a[1])) * t;
        const y = Math.sin(dLon) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    // True when two bearings run along the same line (direction-agnostic: a road is the same whether you
    // drive it N→S or S→N), within `tol` degrees. Used to keep the sign on the road you're travelling.
    function aligned(travel, seg, tol) {
        if (travel == null || seg == null) return true; // no reliable heading → don't filter
        let d = Math.abs(travel - seg) % 180;
        return Math.min(d, 180 - d) <= tol;
    }

    // All Overpass access goes through the shared client (js/tracker-overpass.js), which owns the proxy +
    // direct-mirror fallback centrally (single source of truth, CLAUDE.md rule 7). Returns JSON or null.
    function overpass(q) {
        return window.queryOverpass(q, { timeout: QUERY_TIMEOUT_MS, dbg });
    }

    const ALIGN_TOL = 40;   // a candidate road may differ from the travel direction by at most this (deg)

    async function query(p, travelBrg) {
        fetching = true;
        // ALL drivable ways within 30 m (not only those carrying an explicit `maxspeed`): most German
        // roads have none and only hint the zone via maxspeed:type/zone:maxspeed → wayLimit() resolves
        // those to the legal default.
        const q = '[out:json][timeout:8];way(around:30,' + p[0] + ',' + p[1] + ')[highway];out tags geom;';
        try {
            const j = await overpass(q);
            if (!j) { dbg('Overpass: keine Antwort → letztes Schild bleibt'); return; }
            // Collect ways with a CONFIRMED signed limit (cands) and, separately, ways carrying only the
            // generic legal default (dflt) — each with its distance + whether it runs along our heading.
            const cands = [], dflt = [];
            let ways = 0, refTags = null, refD = Infinity;
            for (const e of (j.elements) || []) {
                ways++;
                const ns = nearestSeg(p, e.geometry);
                if (e.tags && e.tags.ref && ns.d < refD) { refD = ns.d; refTags = e.tags; }
                const ok = aligned(travelBrg, ns.brg, ALIGN_TOL);
                const m = wayLimit(e.tags);
                if (m != null) { cands.push({ m, d: ns.d, tags: e.tags, ok }); continue; }
                const g = genericDefault(e.tags);
                if (g != null) dflt.push({ m: g, d: ns.d, tags: e.tags, ok });
            }
            // With a reliable heading we ONLY trust ways that run along it (kills the perpendicular crossing
            // / parallel side-street that used to steal the sign and show a wrong number). Without a heading
            // (slow / cold start) fall back to all candidates, nearest wins.
            const haveHeading = travelBrg != null;
            const pick = (arr) => {
                const pool = (haveHeading && arr.some((c) => c.ok)) ? arr.filter((c) => c.ok) : arr;
                let m = null, d = Infinity, tags = null;
                for (const c of pool) if (c.d < d) { d = c.d; m = c.m; tags = c.tags; }
                return { m, d, tags };
            };
            const conf = pick(cands);
            const def = pick(dflt);

            const roadTags = conf.tags || def.tags || refTags;
            if (roadTags) lastRoad = { ref: roadTags.ref || null, name: roadTags.name || null, highway: roadTags.highway || null };

            // 1) a confirmed/signed limit wins — solid sign.
            if (conf.m != null) {
                dbg('Limit: ' + conf.m + ' (' + Math.round(conf.d) + ' m' + (haveHeading ? ', i. Fahrtricht.' : '') + ')');
                curLimit = conf.m; curConfirmed = true;
                setSign(conf.m, false, true);
                return;
            }
            // 2) no signed limit → fall back to the generic legal default, shown UNCONFIRMED (dimmed/dashed).
            if (def.m != null) {
                dbg('Default (unbestätigt): ' + def.m + ' (' + Math.round(def.d) + ' m' + (haveHeading ? ', i. Fahrtricht.' : '') + ')');
                curLimit = def.m; curConfirmed = false;
                setSign(def.m, false, false);
                return;
            }
            // 3) nothing usable (untagged, or only crossing roads) → don't blank a previously good sign.
            dbg('Limit: ' + ways + ' Wege, kein (impliziter) Tag → kein Update');
            return;
        } catch (e) { /* parse error → keep the last known sign */ }
        finally { fetching = false; }
    }

    // Called from the core on every GPS fix: update the over-limit colour every time (cheap), and
    // re-query Overpass only when throttle + movement allow.
    function update(here, still, speedKmh) {
        // Route profile first: if we're navigating a profiled route, take the precomputed limit for this
        // exact position — instant + accurate switch points — and skip Overpass entirely this fix. A
        // `null` from limitAt means "on route but no data here" → fall through to live polling for that
        // gap; `undefined` means "no profile / off route" → normal live polling.
        let fromProfile = false;
        if (here && profile && profile.hasRoute && profile.hasRoute()) {
            const pl = profile.limitAt(here);
            if (pl !== undefined && pl !== null) { curLimit = pl; curConfirmed = true; setSign(pl, false, true); fromProfile = true; }
        }
        if (speedKmh != null) lastSpeedKmh = speedKmh; // remember for the fines panel (sign tap)
        if (typeof curLimit === 'number' && speedKmh != null) {
            setSign(curLimit, speedKmh > curLimit + OVER_TOL_KMH, curConfirmed);
            // The audible bell only on a CONFIRMED (mapped/signed) limit — never assert an over-speed
            // chime on the merely-probable generic default (it might be an unmapped 30-zone; an audible
            // "you're 10 over 50" would be confidently-wrong, Doc 2026-06-29). The dimmed sign still shows.
            if (curConfirmed && speedKmh > curLimit + BING_OVER_KMH) {
                if (Date.now() - lastBing > BING_REPEAT_MS) { bing(); lastBing = Date.now(); }
            } else if (speedKmh <= curLimit) {
                lastBing = 0; // back to legal → re-arm so the next exceedance chimes immediately
            }
        }
        if (fromProfile) return; // the route profile already set the sign → don't poll Overpass this fix
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
        // Travel bearing over the leg since the last query (a long, stable baseline). Only trust it when
        // we've actually moved a bit and aren't crawling — GPS heading is noise at walking pace.
        let travelBrg = null;
        if (lastPos && speedKmh != null && speedKmh >= 10 && haversine(here, lastPos) >= 20) {
            travelBrg = bearingDeg(lastPos, here);
        }
        lastQ = now; lastPos = here;
        query(here, travelBrg);
    }

    function clear() { curLimit = null; curConfirmed = true; lastRoad = null; lastPos = null; lastBing = 0; setSign(null, false); }

    function setBell(on) { bellOn = !!on; try { localStorage.setItem(BELL_KEY, bellOn ? '1' : '0'); } catch (e) { } }
    function bellEnabled() { return bellOn; }

    setSign(null, false); // show the ∞ default right away, before the first GPS fix (Doc 2026-06-18)

    // resolveLimit: the SAME tag→limit logic the profile must use so its numbers match the live sign.
    // setProfile: attach the route profile after init (creation order independent).
    return {
        update, clear, unlockAudio, setBell, bellEnabled, currentRoad: () => lastRoad,
        currentLimit: () => curLimit, currentConfirmed: () => curConfirmed, lastSpeed: () => lastSpeedKmh,
        resolveLimit: wayLimit, setProfile: (p) => { profile = p; },
    };
};
