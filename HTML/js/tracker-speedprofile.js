// js/tracker-speedprofile.js — precomputed speed-limit profile for the ACTIVE navigation route.
//
// Problem it solves (Doc 2026-06-28): the live #speed-sign (tracker-speedlimit.js) polls Overpass per
// GPS fix. Leaving a town the 50→100 switch lands LATE (we sample too rarely) and frequent sampling
// costs. But while navigating we already KNOW the whole route — so we can resolve the limit for the
// ENTIRE line ONCE, mark every change point on the route, and then switch the sign EXACTLY at the
// point from the precomputed profile (instant, accurate, zero further Overpass calls). The profile is
// CACHED per route (start/dest/mode) so a frequently-driven stretch is never recomputed.
//
// Free + key-less (CLAUDE.md rule 18): one Overpass "corridor" query (way(around:…, <route polyline>))
// reuses the SAME limit resolver as the live sign, so the numbers always agree. Best-effort: if
// Overpass fails the profile simply doesn't build and the live sign keeps polling as before.
window.TrackerSpeedProfile = function (ctx) {
    const { map } = ctx;

    // Re-enabled 2026-06-30 after fixing the REAL regression OTWA had to park around. The profile (instant,
    // accurate switch points + route badges) worked originally; my 9c87f12 added two things on top of the
    // good direction-filter: (a) a HARD alignment reject (no aligned way → null → carryForward backfilled
    // the PRECEDING limit) and (b) despeckle() (dissolved any run < 50 m into the previous limit). Together
    // they turned a real short Tempo-30 (Paradiesstraße) into a carried solid 50 that overrode the live
    // sign. Fix: limitsFromWays now PREFERS an aligned way but never blanks when only a misaligned one is in
    // the corridor (so the road you're on is never lost → no wrong carry), and despeckle is GONE (a genuine
    // short zone must survive). carryForward then only ever holds a REAL resolved limit. Instant-switching
    // (limitAt) restored; badges back.
    const ENABLED = true;

    const QUERY_TIMEOUT_MS = 28000;   // > the server-side [timeout:25] below; a whole-route corridor is big
    const CORRIDOR_M = 25;            // ways within this distance of the route count
    const ALIGN_TOL = 40;            // a corridor way may differ from the local route direction by at most this (deg)
    const ANTI_JUT_M = 60;           // a short A-B-A limit reversion under this (junction jut) is dissolved
    const JUNC_SNAP_M = 45;          // pull a change point back onto a junction node within this along-route gap
    const MAX_VERTS = 2500;           // guard: very long routes are downsampled for resolution (cost/time)
    const MAX_CORRIDOR_PTS = 800;     // cap the around-polyline length so the query body stays sane
    const CACHE_PREFIX = 'trk_speedprofile_';
    const CACHE_VERSION = 8;          // v8: generic-default barrier — stop carrying a confirmed limit into a
    //                                   contradicting zone (rural 100 no longer bleeds into town); null gap CPs.
    //                                   v7: snap onto the shared-node junction (any road switch, not just sharp bends)
    //                                   v6: snap change points onto the junction turn (signs stand AT the Ampel)
    //                                   v5: rebuild after bisection-refined change points (see refineChangePoints)
    //                                   so already-driven routes drop their coarse-vertex cache and re-pin exactly.
    //                                   v4 was: no despeckle; prefer-aligned-never-blank.
    const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 60; // 60 days — OSM limits change rarely

    let resolveLimit = null;          // injected from the live sign so the logic is identical (setResolver)
    let resolveGeneric = null;        // genericDefault(tags) from the live sign — the road's generic legal
    //                                   default (DE:urban=50 …). Only used to BREAK the carry-forward where a
    //                                   carried confirmed limit contradicts the local default (setGeneric).
    let evalAt = null;                // evalLimit(value, date) from the live sign — resolves a conditional now
    let limKey = null;                // limitKey(value) from the live sign — stable equality for compares
    let routePts = null;              // the route [[lat,lng]…] the current profile is aligned to
    let vertexLimit = null;           // carry-forward limit per route vertex: number | 'none' | null
    let changePoints = [];            // [{lat,lng,limit,along}] where the limit changes — drawn on the route.
    //                                   `along` = distance (m) along the route → limitAt switches EXACTLY there
    //                                   (not snapped to the nearest coarse vertex), matching the refined badge.
    let routeCum = null;              // cumulative route distance (m) per vertex → project a position to `along`
    let markers = null;               // Leaflet layerGroup of the change-point badges
    let buildGen = 0;                 // bumped per build so a slow Overpass answer can't apply to a newer route

    function setResolver(fn) { resolveLimit = fn; }
    function setGeneric(fn) { resolveGeneric = fn; }
    // Inject the live sign's conditional evaluator + equality key so a time-conditional limit is resolved at
    // display time (limitAt/badge) and compared correctly when de-flickering / deriving change points.
    function setEval(evalFn, keyFn) { evalAt = evalFn; limKey = keyFn; }
    // Equality that understands a structured conditional value (falls back to === before setEval ran).
    function sameLimit(a, b) { return limKey ? limKey(a) === limKey(b) : a === b; }
    // Resolve a possibly-conditional value to the number/'none'/null that applies NOW (identity if no eval).
    function evalNow(v) { return evalAt ? evalAt(v, new Date()) : v; }
    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('🚦 ' + msg); } catch (e) { } }

    function hasRoute() { return !!(vertexLimit && vertexLimit.length && routePts && routePts.length); }

    // ---- geometry helpers (equirectangular; same approach as tracker-speedlimit / nav) -------------
    // Min distance (m) from point p to a way's geometry, PLUS the compass bearing of the nearest segment.
    // The bearing lets limitsFromWays reject ways that cross/parallel the route instead of running along it
    // (the crossing Tempo-30 side street that produced the 30↔50 badge-pulk, Doc 2026-06-29). { d, brg }.
    function distToWay(p, geom) {
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
            if (d < min) { min = d; brg = bearingDeg(geom[i - 1], geom[i]); }
        }
        if (geom.length === 1) { const a = xy(geom[0].lat, geom[0].lon); min = Math.hypot(px[0] - a[0], px[1] - a[1]); }
        return { d: min, brg };
    }

    // Bearing a→b in degrees [0,360). a/b are {lat,lon} way nodes or [lat,lng] route points (reads both).
    // (Same math as tracker-speedlimit.bearingDeg — a small pure helper kept local; folding the shared
    // geometry into one geo-util is a worthwhile later refactor but out of scope for this fix.)
    function bearingDeg(a, b) {
        const t = Math.PI / 180;
        const la1 = (a.lat != null ? a.lat : a[0]) * t, la2 = (b.lat != null ? b.lat : b[0]) * t;
        const dLon = ((b.lon != null ? b.lon : b[1]) - (a.lon != null ? a.lon : a[1])) * t;
        const y = Math.sin(dLon) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    // True when two bearings run along the same line (direction-agnostic), within `tol` degrees.
    function aligned(a, b, tol) {
        if (a == null || b == null) return true;       // no reliable heading → don't filter
        const d = Math.abs(a - b) % 180;
        return Math.min(d, 180 - d) <= tol;
    }
    // Local route segment bearings at vertex vi: incoming (vi-1→vi) and outgoing (vi→vi+1). Either may be
    // absent (route end) or null (coincident vertex). Checking BOTH — not their smoothed average — keeps the
    // filter correct at a sharp bend on a single OSM way, where the averaged direction would wrongly reject
    // the road's own segment (and shift/drop a change point that often sits right at the corner).
    function routeBearingsAt(pts, vi) {
        const out = [];
        if (vi > 0) { const b = segBearing(pts[vi - 1], pts[vi]); if (b != null) out.push(b); }
        if (vi < pts.length - 1) { const b = segBearing(pts[vi], pts[vi + 1]); if (b != null) out.push(b); }
        return out;
    }
    // Bearing of a route segment, or null if its endpoints coincide — compared by VALUE (adjacent vertices
    // are distinct array objects, so a reference check would never catch a there-and-back duplicate vertex
    // and bearingDeg would then return a spurious 0°/north).
    function segBearing(a, b) {
        if (!a || !b || (a[0] === b[0] && a[1] === b[1])) return null;
        return bearingDeg(a, b);
    }
    // True if the way bearing aligns with ANY local route segment (or if we have no route direction at all).
    function alignedAny(brgs, wayBrg, tol) {
        if (!brgs.length) return true;
        for (const b of brgs) if (aligned(b, wayBrg, tol)) return true;
        return false;
    }

    // Distance (m) of an arbitrary point PROJECTED along the route (nearest segment + in-segment fraction).
    // The along-route position lets limitAt switch at the exact change-point distance rather than snapping
    // to a coarse vertex — so a refined switch point on a sparse straight actually takes effect where it is.
    function projectAlong(here) {
        const k = Math.cos(here[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const p = xy(here);
        let bi = 1, bd = Infinity, bt = 0;
        for (let i = 1; i < routePts.length; i++) {
            const a = xy(routePts[i - 1]), b = xy(routePts[i]);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
            if (d < bd) { bd = d; bi = i; bt = t; }
        }
        return routeCum[bi - 1] + bt * (routeCum[bi] - routeCum[bi - 1]);
    }
    // Give each change point its along-route distance (projected onto the current geometry) so limitAt can
    // do a pure distance lookup. Recomputed on every build/cache-load (the route geometry may have jittered).
    function attachAlong(cps) {
        if (!routeCum) return cps;
        for (const c of cps) c.along = projectAlong([c.lat, c.lng]);
        return cps;
    }

    // The precomputed limit at the current position: number | 'none' (unlimited) | null (on route but
    // unknown — let the live sign fall back) | undefined (no profile / off route). Switches EXACTLY at the
    // refined change-point distance (the profile's whole point), not at the nearest coarse vertex. Before the
    // first change point → null (leading gap; live sign falls back). Correctness rests on limitsFromWays NOT
    // mis-resolving (prefer-aligned-but-never-blank) and on refineChangePoints only moving a clean crossover.
    function limitAt(here) {
        if (!hasRoute() || !here || !routeCum) return undefined;
        if (!changePoints.length) return null;   // on route, nothing resolved → live sign falls back
        const s = projectAlong(here);
        let v = null;
        for (const c of changePoints) { if (c.along <= s) v = c.limit; else break; }
        if (v == null) return null;               // still ahead of the first known limit → gap
        return evalNow(v);                         // resolve a conditional {base,rules} against the clock NOW
    }

    // ---- Overpass --------------------------------------------------------------------------------
    // Goes through the shared client (js/tracker-overpass.js): proxy first, direct-mirror fallback if the
    // proxy is down — same single source of truth as the live sign (CLAUDE.md rule 7). JSON or null.
    function overpass(q) {
        return window.queryOverpass(q, { timeout: QUERY_TIMEOUT_MS, dbg });
    }

    // ---- cache -----------------------------------------------------------------------------------
    // Key by mode + start/dest rounded to ~110 m so the SAME everyday route hits the cache even though
    // the GPS start point jitters a few metres each time. Stored value = the change points (compact).
    function cacheKey(meta) {
        const r = (x) => (Math.round(x * 1000) / 1000).toFixed(3);
        const s = meta.start, d = meta.dest;
        return CACHE_PREFIX + (meta.mode || 'car') + '|' + r(s[0]) + ',' + r(s[1]) + '|' + r(d[0]) + ',' + r(d[1]);
    }
    function cacheGet(meta) {
        try {
            const raw = localStorage.getItem(cacheKey(meta));
            if (!raw) return null;
            const o = JSON.parse(raw);
            if (!o || o.v !== CACHE_VERSION || !Array.isArray(o.cps)) return null;
            if (o.t && (Date.now() - o.t) > CACHE_TTL_MS) return null;
            return o.cps;
        } catch (e) { return null; }
    }
    function cachePut(meta, cps) {
        try { localStorage.setItem(cacheKey(meta), JSON.stringify({ v: CACHE_VERSION, t: Date.now(), cps })); } catch (e) { }
    }

    // ---- build the per-vertex limit array --------------------------------------------------------
    // Resolve a raw limit for each route vertex from the corridor ways, then CARRY FORWARD across gaps
    // so a short untagged stretch doesn't blank the sign. Returns the carry-forward array.
    function limitsFromWays(pts, ways) {
        const conf = new Array(pts.length).fill(null);  // confirmed/signed limit per vertex (null where none)
        const gen = new Array(pts.length).fill(null);   // the road's generic legal default per vertex (for the barrier)
        for (let vi = 0; vi < pts.length; vi++) {
            const p = pts[vi];
            // PREFER a way that runs ALONG the route (kills the crossing/parallel side street that caused the
            // 30↔50 badge-pulk) — but NEVER blank when only a misaligned limit-way is in the corridor: a hard
            // reject backfilled null → carryForward dragged the PRECEDING limit over a real Tempo-30 (the
            // Paradiesstraße 50-over-30 bug). So: best aligned wins; else fall back to the nearest limit-way
            // (the road you're physically on is the nearest), so the real local limit is never lost.
            const routeBrgs = routeBearingsAt(pts, vi);
            let aLim = null, aD = Infinity, anyLim = null, anyD = Infinity;      // confirmed limit
            let aGen = null, aGD = Infinity, anyGen = null, anyGD = Infinity;    // generic default (same aligned-preferred rule)
            for (const w of ways) {
                const lim = resolveLimit ? resolveLimit(w.tags) : null;
                const g = resolveGeneric ? resolveGeneric(w.tags) : null;
                if (lim == null && g == null) continue;    // neither a confirmed nor a generic-default way → ignore
                const nw = distToWay(p, w.geometry);
                if (nw.d > CORRIDOR_M + 10) continue;       // outside the corridor → not our road
                const al = alignedAny(routeBrgs, nw.brg, ALIGN_TOL);
                if (lim != null) {
                    if (nw.d < anyD) { anyD = nw.d; anyLim = lim; }
                    if (al && nw.d < aD) { aD = nw.d; aLim = lim; }
                }
                if (g != null) {
                    if (nw.d < anyGD) { anyGD = nw.d; anyGen = g; }
                    if (al && nw.d < aGD) { aGD = nw.d; aGen = g; }
                }
            }
            conf[vi] = (aLim != null) ? aLim : anyLim;      // aligned preferred, nearest as a never-blank fallback
            gen[vi] = (aGen != null) ? aGen : anyGen;
        }
        return carryForwardBarrier(conf, gen);
    }
    // Carry a confirmed limit forward across untagged gaps — the original behaviour so a short untagged stretch
    // doesn't blank the sign — but STOP the carry where the road's OWN generic legal default contradicts it.
    // Leaving a town the rural limit must not bleed into the city: the urban stretch tags only DE:urban=50,
    // which resolveLimit (wayLimit) drops to null → without a barrier the previous 100 got dragged straight
    // through, shown as a CONFIRMED (solid) sign, overriding the honest dimmed 50 (Doc 2026-07-06 „da steht
    // hundert, das ist falsch"). At such a spot we emit null instead → deriveChangePoints marks a gap →
    // limitAt returns null there → the LIVE sign falls back to ITS unconfirmed generic default. We never
    // inject the generic value as a profile limit: the profile only ever shows CONFIRMED signs, and a generic
    // default must stay unconfirmed (it might be an unmapped 30-zone). A genuinely untagged gap with no
    // generic hint (gen==null) still carries as before — nothing contradicts the carry there.
    function carryForwardBarrier(conf, gen) {
        const out = conf.slice();
        let last = null;
        for (let i = 0; i < out.length; i++) {
            if (out[i] != null) { last = out[i]; continue; }            // an own confirmed limit here → carry it on
            if (last != null && gen[i] != null && !sameLimit(gen[i], last)) {
                last = null;                                            // generic default disagrees → break the carry
                out[i] = null;                                          // …and leave a real gap for the live sign
            } else {
                out[i] = last;                                          // agrees, or no generic hint → carry as before
            }
        }
        return out;
    }

    // ---- de-jut ---------------------------------------------------------------------------------
    // Cumulative along-route distance (m) per vertex.
    function segMeters(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }
    function cumDist(pts) {
        const cd = new Array(pts.length).fill(0);
        for (let i = 1; i < pts.length; i++) cd[i] = cd[i - 1] + segMeters(pts[i - 1], pts[i]);
        return cd;
    }
    // Remove a junction "jut": where a crossing road's limit briefly juts into the route at an intersection
    // you get a SHORT A-B-A reversion (e.g. 30-50-30 as the Serkowitzer 50 clips the corner, Doc 2026-07-01).
    // Dissolve a run of B back into A ONLY when it is a genuine reversion (same limit A both sides) AND short
    // (< ANTI_JUT_M). This is deliberately narrower than the old despeckle: it never touches a real transition
    // (A-B-C) or a long zone, so a genuine short Tempo-30 (50-30-…, not a reversion) survives.
    function deJut(pts, limits) {
        if (pts.length < 3 || pts.length !== limits.length) return limits;
        const cd = cumDist(pts);
        const out = limits.slice();
        let i = 0;
        while (i < out.length) {
            let j = i + 1;
            while (j < out.length && sameLimit(out[j], out[i])) j++;
            const len = (j < out.length ? cd[j] : cd[cd.length - 1]) - cd[i];
            if (i > 0 && j < out.length && out[i] != null && out[i - 1] != null
                && sameLimit(out[i - 1], out[j]) && len < ANTI_JUT_M) {
                const a = out[i - 1];
                for (let k = i; k < j; k++) out[k] = a;   // A-B-A, short → dissolve the jut back to A
            }
            i = j;
        }
        return out;
    }

    // Change points = vertices where the carry-forward limit first differs from the previous one.
    // Each carries its vertex index `i` so refineChangePoints can bisect the bracket [i-1, i]; `i` is
    // stripped again during refinement so the cached point stays lean.
    // A transition TO null (a barrier gap opened by carryForwardBarrier) is emitted as a change point with
    // limit:null so limitAt returns null there and the live sign takes over — otherwise the preceding limit
    // would keep applying right through the gap. A LEADING null run (before the first real limit) emits
    // nothing (limitAt returns null there anyway).
    function deriveChangePoints(pts, limits) {
        const cps = [];
        let prev = undefined;                                          // undefined = nothing emitted yet
        for (let i = 0; i < pts.length; i++) {
            const v = limits[i];
            if (prev === undefined && v == null) continue;             // skip the leading gap
            if (!sameLimit(v, prev)) { cps.push({ lat: pts[i][0], lng: pts[i][1], limit: v, i }); prev = v; }
        }
        return cps;
    }

    // ---- change-point refinement (no extra Overpass) ---------------------------------------------
    // deriveChangePoints snaps each switch to a ROUTE VERTEX. On a straight road the ORS polyline has
    // sparse vertices (a maxspeed-only split node is collinear → not emitted), so the coarse point can
    // sit 100 m+ from the real sign — exactly the "zu spät / ungenau" Doc saw in fast-forward. We already
    // hold every way's full geometry from the ONE corridor query, so we pin the exact spot by BISECTING
    // the straight segment between the two bracketing vertices and re-resolving the limit at the midpoint
    // from those same ways: pure geometry, ZERO extra queries (Doc 2026-07-02). For a very long route that
    // was vertex-downsampled the bracket is only approximate, but never worse than the coarse vertex.
    const REFINE_ITERS = 8;   // bisection steps → segment/256; ≤ ~1 m even on a long sparse straight

    // Resolve the limit at an arbitrary point from the already-fetched corridor ways, mirroring
    // limitsFromWays' prefer-aligned-but-never-blank rule. `brgs` = local route direction(s) for the filter.
    function resolveAtPoint(p, brgs, ways) {
        let aLim = null, aD = Infinity, anyLim = null, anyD = Infinity;
        for (const w of ways) {
            const lim = resolveLimit ? resolveLimit(w.tags) : null;
            if (lim == null) continue;
            const nw = distToWay(p, w.geometry);
            if (nw.d > CORRIDOR_M + 10) continue;
            if (nw.d < anyD) { anyD = nw.d; anyLim = lim; }
            if (alignedAny(brgs, nw.brg, ALIGN_TOL) && nw.d < aD) { aD = nw.d; aLim = lim; }
        }
        return (aLim != null) ? aLim : anyLim;
    }
    // Move each change point onto the precise crossover between its two bracketing route vertices.
    function refineChangePoints(pts, cps, ways) {
        for (const c of cps) {
            const i = c.i; delete c.i;                 // index only needed here; keep the cached point lean
            if (i == null || i <= 0) continue;
            const a = pts[i - 1], b = pts[i];
            const sb = segBearing(a, b);
            const brgs = sb != null ? [sb] : routeBearingsAt(pts, i);
            const limA = resolveAtPoint(a, brgs, ways);
            const limB = resolveAtPoint(b, brgs, ways);
            // Only a CLEAN single crossover (old limit at a, new limit at b) is safe to bisect; anything
            // else (gap, sampling artefact, multi-change) → leave the coarse vertex, never invent a spot.
            if (sameLimit(limA, c.limit) || !sameLimit(limB, c.limit)) continue;
            let lo = a, hi = b;                        // limit(lo)=old, limit(hi)=new
            for (let k = 0; k < REFINE_ITERS; k++) {
                const mid = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
                if (sameLimit(resolveAtPoint(mid, brgs, ways), c.limit)) hi = mid; else lo = mid;
            }
            c.lat = hi[0]; c.lng = hi[1];              // hi = first point already carrying the new limit
        }
        return cps;
    }

    // Distance (m) from a point to the nearest route segment — keeps a junction candidate ON the route.
    function distToRoute(p) {
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const q = xy(p);
        let bd = Infinity;
        for (let i = 1; i < routePts.length; i++) {
            const a = xy(routePts[i - 1]), b = xy(routePts[i]);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(q[0] - (a[0] + t * dx), q[1] - (a[1] + t * dy));
            if (d < bd) bd = d;
        }
        return bd;
    }
    // Every road-to-road switch (X→Y) puts the sign AT the junction, but OSM's maxspeed crossover — hence the
    // bisected point — can sit a few metres past it (Doc 2026-07-03: "immer wenn ich von einer Straße mit X auf
    // Y wechsle"). A junction = an OSM node SHARED by ≥2 corridor ways (where roads meet) lying ON the route —
    // angle-independent, so a straight-through junction (you switch roads without a sharp bend) counts too. If
    // one sits just BEHIND a change point (≤ JUNC_SNAP_M), pull the point back onto it. A limit change with no
    // junction behind it (an Ortstafel mid-road) is left exactly where the bisection put it. Needs routeCum.
    function snapToJunctions(pts, cps, ways) {
        if (!routeCum || !ways || !ways.length) return cps;
        const cnt = new Map();                                     // rounded coord → {ll, n} across corridor ways
        for (const w of ways) {
            if (!Array.isArray(w.geometry)) continue;
            for (const nd of w.geometry) {
                const key = nd.lat.toFixed(5) + ',' + nd.lon.toFixed(5);
                let e = cnt.get(key);
                if (!e) { e = { ll: [nd.lat, nd.lon], n: 0 }; cnt.set(key, e); }
                e.n++;
            }
        }
        const junc = [];                                           // shared nodes that actually sit on the route
        for (const e of cnt.values()) if (e.n >= 2 && distToRoute(e.ll) <= 8) junc.push(e.ll);
        if (!junc.length) return cps;
        for (const c of cps) {
            const sc = projectAlong([c.lat, c.lng]);
            let best = null, bestAlong = -1;
            for (const j of junc) {
                if (Math.abs(j[0] - c.lat) > 0.001 || Math.abs(j[1] - c.lng) > 0.0015) continue;   // ~100 m prefilter
                const sj = projectAlong(j);
                const gap = sc - sj;                               // >0 → junction j is behind the change point
                if (gap < -2 || gap > JUNC_SNAP_M) continue;       // only a junction just behind, within reach
                if (sj > bestAlong) { bestAlong = sj; best = j; }  // nearest junction behind
            }
            if (best) {
                dbg('Tempo-' + c.limit + ' an Kreuzung gezogen (' + Math.round(sc - bestAlong) + ' m ←)');
                c.lat = best[0]; c.lng = best[1];
            }
        }
        return cps;
    }

    // Rebuild the per-vertex array from cached change points by walking the route and switching the
    // limit each time we pass a change point (projected onto the current geometry). Lets a cached
    // profile align to a freshly-fetched route whose start jittered slightly.
    function limitsFromChangePoints(pts, cps) {
        if (!cps.length) return new Array(pts.length).fill(null);
        // along-route distance of each change point (nearest projection), and of each vertex.
        const cpIdx = cps.map((c) => nearestIdxOn(pts, [c.lat, c.lng]));
        const out = new Array(pts.length).fill(null);
        for (let i = 0; i < pts.length; i++) {
            let lim = null;
            for (let c = 0; c < cps.length; c++) { if (cpIdx[c] <= i) lim = cps[c].limit; else break; }
            out[i] = lim;
        }
        // Walking the change points already carries each limit forward to the next switch — including a
        // null (barrier) change point, which must STAY null through its gap (a trailing carryForward would
        // wrongly refill it with the preceding limit, re-introducing the rural-100-into-town bug on reload).
        return out;
    }
    function nearestIdxOn(pts, here) {
        const k = Math.cos(here[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const p = xy(here);
        let bi = 0, bd = Infinity;
        for (let i = 0; i < pts.length; i++) {
            const a = xy(pts[i]);
            const d = Math.hypot(p[0] - a[0], p[1] - a[1]);
            if (d < bd) { bd = d; bi = i; }
        }
        return bi;
    }

    // ---- markers ---------------------------------------------------------------------------------
    function badgeHtml(limit) {
        const cond = limit && typeof limit === 'object';   // time-conditional {base,rules}
        const shown = evalNow(limit);                       // the value active at draw time
        const txt = (shown === 'none') ? '∞' : (shown == null ? '?' : String(shown));
        const small = txt.length >= 3 ? ' sp-badge-s3' : '';
        // A conditional badge is drawn ONCE (its number can go stale through the day); the live #speed-sign
        // stays authoritative. Mark it so CSS can hint "time-dependent" (dashed ring).
        return '<div class="sp-badge' + small + (cond ? ' sp-badge-cond' : '') + '">' + txt + '</div>';
    }
    function drawMarkers(cps) {
        clearMarkers();
        markers = L.layerGroup();
        for (const c of cps) {
            if (c.limit == null) continue;   // a barrier gap-start has no sign to show (the live sign takes over there)
            const icon = L.divIcon({ className: 'sp-badge-wrap', html: badgeHtml(c.limit), iconSize: [26, 26], iconAnchor: [13, 13] });
            L.marker([c.lat, c.lng], { icon, interactive: false, keyboard: false, pane: 'markerPane' }).addTo(markers);
        }
        markers.addTo(map);
    }
    function clearMarkers() { if (markers) { map.removeLayer(markers); markers = null; } }

    // ---- public: build / clear -------------------------------------------------------------------
    // meta = { mode, start:[lat,lng], dest:[lat,lng] }. Fire-and-forget from nav after drawRoute().
    async function build(pts, meta) {
        const gen = ++buildGen;
        if (!ENABLED) { clear(); return; }   // parked → live sign owns the limit, no badges (see top)
        if (!pts || pts.length < 2 || !resolveLimit) { clear(); return; }
        routePts = pts.slice();
        routeCum = cumDist(routePts);   // for projecting a position (and each change point) to along-route metres

        // 1) cache hit → align cached change points to this geometry, no Overpass.
        const cached = cacheGet(meta);
        if (cached) {
            vertexLimit = limitsFromChangePoints(routePts, cached);
            changePoints = attachAlong(cached);
            drawMarkers(changePoints);
            dbg('Profil aus Cache: ' + changePoints.length + ' Umschaltpunkte');
            return;
        }

        // 2) miss → ONE corridor query for the whole route. Downsample the around-polyline if very long.
        const corridorPts = downsample(routePts, MAX_CORRIDOR_PTS);
        let coords = '';
        for (const p of corridorPts) coords += ',' + p[0] + ',' + p[1];
        const q = '[out:json][timeout:25];way(around:' + CORRIDOR_M + coords + ')[highway];out tags geom;';
        const j = await overpass(q);
        if (gen !== buildGen) return;                 // a newer route superseded us → drop this answer
        if (!j || !j.elements) { dbg('Overpass-Korridor fehlgeschlagen → Live-Schild bleibt aktiv'); return; }
        const ways = j.elements.filter((e) => e.tags && e.geometry);

        // Resolve per-vertex (downsample the resolution set for very long routes to bound cost).
        const resAt = downsampleIdx(routePts.length, MAX_VERTS);
        const sub = resAt.map((i) => routePts[i]);
        const subLimits = limitsFromWays(sub, ways);
        // expand the sub-sampled limits onto every vertex, then dissolve short junction juts (A-B-A).
        vertexLimit = deJut(routePts, expandToAll(routePts.length, resAt, subLimits));
        changePoints = snapToJunctions(routePts, refineChangePoints(routePts, deriveChangePoints(routePts, vertexLimit), ways), ways);
        if (gen !== buildGen) return;
        cachePut(meta, changePoints);        // cache stays lean ({lat,lng,limit}) — `along` is derived per load
        attachAlong(changePoints);
        drawMarkers(changePoints);
        dbg('Profil berechnet: ' + changePoints.length + ' Umschaltpunkte (' + ways.length + ' Wege)');
    }

    function clear() { buildGen++; routePts = null; routeCum = null; vertexLimit = null; changePoints = []; clearMarkers(); }

    // ---- small array utilities -------------------------------------------------------------------
    function downsample(arr, maxN) {
        if (arr.length <= maxN) return arr;
        const step = arr.length / maxN, out = [];
        for (let i = 0; i < arr.length; i += step) out.push(arr[Math.floor(i)]);
        if (out[out.length - 1] !== arr[arr.length - 1]) out.push(arr[arr.length - 1]);
        return out;
    }
    function downsampleIdx(n, maxN) {
        if (n <= maxN) { const a = []; for (let i = 0; i < n; i++) a.push(i); return a; }
        const step = n / maxN, out = [];
        for (let i = 0; i < n; i += step) out.push(Math.floor(i));
        if (out[out.length - 1] !== n - 1) out.push(n - 1);
        return out;
    }
    // Map limits sampled at indices `idx` back onto all n vertices — each sample fills the span up to the
    // next one. The samples come already carried (carryForwardBarrier) so a null sample is a real barrier
    // gap: it must STAY null across its span (no trailing carryForward, which would refill it and drag the
    // preceding limit through the gap again). idx always starts at 0, so there is no leading null to fill.
    function expandToAll(n, idx, sampled) {
        const out = new Array(n).fill(null);
        for (let s = 0; s < idx.length; s++) {
            const from = idx[s], to = (s + 1 < idx.length) ? idx[s + 1] : n;
            for (let i = from; i < to; i++) out[i] = sampled[s];
        }
        return out;
    }

    return { build, clear, limitAt, hasRoute, setResolver, setGeneric, setEval };
};
