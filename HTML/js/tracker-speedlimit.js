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
    // Optional logging-only measurement probe (js/tracker-speedprobe.js): observes each query's result to
    // tally how often a backward-carry / persistent memory WOULD agree/cover — no behaviour change.
    const probe = ctx.probe || null;
    // Is the road currently wet? (Open-Meteo precipitation, fed from tracker.js.) Drives the "bei Nässe"
    // conditional limit (maxspeed:conditional=… @ wet). Defaults to "dry" when no signal is wired.
    const isWet = (typeof ctx.isWet === 'function') ? ctx.isWet : (() => false);

    const MIN_INTERVAL_MS = 5000;  // never query Overpass more often than this (was 15 s → too laggy when driving)
    const MIN_MOVE_M = 90;         // …and only after this much travel — limits change per road segment
    const QUERY_TIMEOUT_MS = 9000; // abort a stuck request so `fetching` can never freeze the sign forever
    const OVER_TOL_KMH = 3;        // grace before turning the sign red (GPS speed noise)
    const BING_OVER_KMH = 8;      // play the bell once you're this many km/h over the limit (absolute)
    const BING_REPEAT_MS = 12000;  // …and re-remind at most this often while still over

    let lastQ = 0;          // timestamp of the last Overpass query
    let lastPos = null;     // [lat,lng] at the last query
    let fetching = false;   // a query is in flight
    let curLimit = null;    // number (km/h) | 'none' (unlimited) | null (unknown) — the value shown NOW
    let curRaw = null;      // the raw resolved value when time-conditional ({base,rules}); null when static
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

    // ---- time-conditional limits (maxspeed:conditional) ------------------------------------------
    // OSM tags a school-zone / night limit as e.g. `maxspeed=50` + `maxspeed:conditional=30 @ (Mo-Fr
    // 06:00-17:00)`: the base holds, BUT inside the window the lower value is the real legal limit. Such a
    // limit is TIME-VARYING — it must be evaluated at display time, never baked in (esp. since the route
    // profile caches for 60 days). wayLimit() returns a structured value { base, rules } for these ways;
    // evalLimit() resolves it against the current clock; limitKey() is a stable equality key so the
    // profile's de-flicker / change-point compare still works (Doc 2026-06-30: "Pfotenhauerstraße zeigt 50,
    // ist aber werktags 6-17 Tempo 30"). Best-effort: only the common "<value> @ (<weekdays> <HH:MM-HH:MM>)"
    // form is honoured; anything we can't evaluate (wet/snow, holidays) is dropped, never guessed.
    const DOW = { mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6, su: 0 }; // JS Date.getDay(): Sun=0 … Sat=6

    // Weekday tokens in a condition → sorted array of getDay() ints, or null = "every day" (no weekday
    // given). A plain ARRAY, not a Set: the profile caches the conditional value as JSON and a Set would
    // serialize to {} (→ a crash on cache reload). Sorted + de-duped so limitKey() is stable.
    function parseDays(cond) {
        const re = /\b(Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(Mo|Tu|We|Th|Fr|Sa|Su))?\b/gi;
        let m, set = null;
        while ((m = re.exec(cond))) {
            set = set || new Set();
            const a = DOW[m[1].toLowerCase()];
            if (m[2]) { // a range like Mo-Fr or Fr-Su (cyclic; treat Sunday as 7 for ordering)
                const ai = a === 0 ? 7 : a, b0 = DOW[m[2].toLowerCase()], bi = b0 === 0 ? 7 : b0;
                const end = bi >= ai ? bi : bi + 7;
                for (let d = ai; d <= end; d++) set.add(d % 7);
            } else set.add(a);
        }
        return set ? [...set].sort((x, y) => x - y) : null;
    }
    // HH:MM-HH:MM ranges (comma-separated allowed) → [{from,to}] in minutes, or null = "all day".
    function parseTimes(cond) {
        const re = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g;
        let m, out = null;
        while ((m = re.exec(cond))) {
            out = out || [];
            out.push({ from: (+m[1]) * 60 + (+m[2]), to: (+m[3]) * 60 + (+m[4]) });
        }
        return out;
    }
    // "<value> @ (<condition>)" rules, ';'-separated. Drops any rule we can't honour (a non-time condition
    // like "wet", or a holiday clause we can't evaluate) so we never invent a window.
    function parseConditional(str) {
        if (!str) return [];
        const rules = [];
        for (const part of String(str).split(';')) {
            const at = part.split('@');
            if (at.length !== 2) continue;
            const limit = parseMax(at[0].trim());
            if (limit == null) continue;                       // unparseable value → skip
            const cond = at[1].trim().replace(/^\(/, '').replace(/\)$/, '').trim();
            const days = parseDays(cond);
            const times = parseTimes(cond);
            const wet = /\bwet\b/i.test(cond);                   // "@ wet" → applies only when the road is wet
            if (days == null && times == null && !wet) continue; // pure unhandleable condition → can't honour
            if (/\bPH\b/i.test(cond) && days == null && !wet) continue;  // holiday-only clause → can't evaluate
            rules.push({ limit, days, times, wet });
        }
        return rules;
    }
    function ruleActive(rule, date) {
        if (rule.wet && !isWet()) return false;            // "@ wet" rule only applies on a wet road
        if (rule.days && rule.days.indexOf(date.getDay()) < 0) return false;
        if (rule.times) {
            const mins = date.getHours() * 60 + date.getMinutes();
            let inWin = false;
            for (const w of rule.times) {
                if (w.from <= w.to) { if (mins >= w.from && mins < w.to) inWin = true; }
                else if (mins >= w.from || mins < w.to) inWin = true; // window crosses midnight
            }
            if (!inWin) return false;
        }
        return true;
    }
    // Resolve a limit value to the number/'none'/null that applies NOW. Plain values pass through; a
    // structured { base, rules } returns the first active rule's limit, else its base. date defaults to now.
    function evalLimit(v, date) {
        if (!v || typeof v !== 'object') return v;             // number | 'none' | null
        if (!Array.isArray(v.rules)) return v.base != null ? v.base : null;
        const d = date || new Date();
        for (const r of v.rules) if (ruleActive(r, d)) return r.limit;
        return v.base != null ? v.base : null;
    }
    // Stable equality key for any limit value (used by the profile's de-flicker / change-point compare).
    function limitKey(v) {
        if (!v || typeof v !== 'object') return String(v);
        const rs = (v.rules || []).map((r) =>
            r.limit + (r.wet ? '@wet' : '') + '@' + (r.days ? r.days.join('') : '*') + ':' +
            (r.times ? r.times.map((t) => t.from + '-' + t.to).join(',') : '*')).join(';');
        return 'C|' + String(v.base) + '|' + rs;
    }
    // Readable form of a possibly-conditional limit for the debug window.
    function fmtLimit(v) {
        return (v && typeof v === 'object') ? (evalLimit(v) + ' [bedingt ' + limitKey(v) + ']') : String(v);
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
    // (see above) so we never overwrite an unmapped 30-zone with a wrong 50. A way carrying a
    // `maxspeed:conditional` returns a structured { base, rules } so the time window is evaluated at display
    // time (evalLimit), not frozen now. number | 'none' | { base, rules } | null.
    function wayLimit(tags) {
        if (!tags || !DRIVE_HW.has(tags.highway)) return null;
        const base = parseMax(tags.maxspeed)
            ?? implicitLimit(tags['maxspeed:type'])
            ?? implicitLimit(tags['zone:maxspeed'])
            ?? implicitLimit(tags['source:maxspeed']);
        const cond = tags['maxspeed:conditional'];
        if (cond) {
            const rules = parseConditional(cond);
            // Only wrap as conditional when we have a base to fall back to OUTSIDE the window — otherwise the
            // sign would read "?" off-window, worse than the live poll's generic default. With no base we
            // still honour the window (base:null → off-window null lets the caller fall through).
            if (rules.length) return { base: base != null ? base : null, rules };
        }
        return base; // static number | 'none' | null
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

    // ---- road advisories: Überholverbot (overtaking=no) + Maut (toll=yes) ------------------------------
    // Read from the SAME resolved-road tags as the limit → near-free, no extra query. ADVISORY ONLY: OSM
    // tags these sparsely, so "no badge" does NOT mean "allowed". Small icons under the speed sign, drawn
    // with inline styles (no CSS dependency). Dark-blue, not black (CLAUDE.md); never orange.
    let curNoOvertake = false, curToll = false, advEl = null;
    const NO_OVERTAKE_SVG = '<svg viewBox="0 0 48 48" width="34" height="34" aria-label="Überholverbot">'
        + '<circle cx="24" cy="24" r="21" fill="#fff" stroke="rgb(176,36,24)" stroke-width="5"/>'
        + '<rect x="8" y="20" width="14" height="9" rx="2" fill="rgb(176,36,24)"/>'   // overtaking car (red)
        + '<rect x="26" y="20" width="14" height="9" rx="2" fill="rgb(14,36,78)"/>'   // car being passed (dark blue, not black)
        + '</svg>';
    const TOLL_BADGE = '<div style="background:rgb(14,36,78);color:#fff;font:700 11px Arial,sans-serif;'
        + 'padding:3px 7px;border-radius:7px;letter-spacing:.5px;box-shadow:0 2px 8px rgba(8,20,42,.5)">MAUT</div>';
    function ensureAdv() {
        if (advEl) return advEl;
        advEl = document.createElement('div');
        advEl.id = 'road-adv';
        advEl.style.cssText = ['position:fixed', 'left:13px', 'top:50%',
            'transform:translateY(calc(-50% + 100px))', 'z-index:600', 'display:none',
            'flex-direction:column', 'gap:6px', 'align-items:center', 'pointer-events:none'].join(';');
        document.body.appendChild(advEl);
        return advEl;
    }
    function setAdvisories(noOv, toll) {
        curNoOvertake = !!noOv; curToll = !!toll;
        const el = ensureAdv();
        let html = '';
        if (curNoOvertake) html += '<div style="filter:drop-shadow(0 2px 6px rgba(8,20,42,0.5))">' + NO_OVERTAKE_SVG + '</div>';
        if (curToll) html += TOLL_BADGE;
        el.innerHTML = html;
        el.style.display = (curNoOvertake || curToll) ? 'flex' : 'none';
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
            // Logging-only measurement (never disturbs the sign): does carry/memory agree/cover here?
            // Pass a NOW-resolved resolver so the probe scores against the same number the sign shows:
            // a time-conditional way (wayLimit → {base,rules}) is evaluated against the current clock.
            if (probe) {
                try {
                    const resolveNow = (tags) => { const v = wayLimit(tags); return (v && typeof v === 'object') ? evalLimit(v) : v; };
                    probe.record(p, travelBrg, j.elements || [], resolveNow, Date.now());
                } catch (e) { }
            }
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
            // Road advisories from the resolved road (not refTags, which may be a different ref-bearing way).
            const advTags = conf.tags || def.tags;
            if (advTags) setAdvisories(advTags.overtaking === 'no', advTags.toll === 'yes');

            // 1) a confirmed/signed limit wins — solid sign. A conditional way keeps its raw {base,rules} in
            //    curRaw so update() re-evaluates the window as the clock crosses it (even while parked).
            if (conf.m != null) {
                curRaw = (typeof conf.m === 'object') ? conf.m : null;
                curLimit = evalLimit(conf.m); curConfirmed = true;
                dbg('Limit: ' + fmtLimit(conf.m) + ' (' + Math.round(conf.d) + ' m' + (haveHeading ? ', i. Fahrtricht.' : '') + ')');
                setSign(curLimit, false, true);
                return;
            }
            // 2) no signed limit → fall back to the generic legal default, shown UNCONFIRMED (dimmed/dashed).
            if (def.m != null) {
                dbg('Default (unbestätigt): ' + def.m + ' (' + Math.round(def.d) + ' m' + (haveHeading ? ', i. Fahrtricht.' : '') + ')');
                curRaw = null; curLimit = def.m; curConfirmed = false;
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
            const pl = profile.limitAt(here); // already time-evaluated by the profile (it owns the clock)
            if (pl !== undefined && pl !== null) { curRaw = null; curLimit = pl; curConfirmed = true; setSign(pl, false, true); fromProfile = true; }
        }
        if (speedKmh != null) lastSpeedKmh = speedKmh; // remember for the fines panel (sign tap)
        // A time-conditional live limit must follow the clock even with no new query (e.g. parked across the
        // 17:00 school-zone boundary) → re-evaluate the cached raw value each fix.
        if (!fromProfile && curRaw) curLimit = evalLimit(curRaw);
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

    function clear() { curLimit = null; curRaw = null; curConfirmed = true; lastRoad = null; lastPos = null; lastBing = 0; setSign(null, false); setAdvisories(false, false); }

    function setBell(on) { bellOn = !!on; try { localStorage.setItem(BELL_KEY, bellOn ? '1' : '0'); } catch (e) { } }
    function bellEnabled() { return bellOn; }

    setSign(null, false); // show the ∞ default right away, before the first GPS fix (Doc 2026-06-18)

    // resolveLimit: the SAME tag→limit logic the profile must use so its numbers match the live sign.
    // evalLimit/limitKey: the profile uses these to evaluate a conditional value at display time and to
    // compare values when de-flickering / deriving change points (CLAUDE.md rule 7, single source of truth).
    // setProfile: attach the route profile after init (creation order independent).
    return {
        update, clear, unlockAudio, setBell, bellEnabled, currentRoad: () => lastRoad,
        currentLimit: () => curLimit, currentConfirmed: () => curConfirmed, lastSpeed: () => lastSpeedKmh,
        currentNoOvertake: () => curNoOvertake, currentToll: () => curToll,
        resolveLimit: wayLimit, evalLimit, limitKey, setProfile: (p) => { profile = p; },
    };
};
