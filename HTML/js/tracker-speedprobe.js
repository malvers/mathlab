// js/tracker-speedprobe.js — LOGGING-ONLY instrument (Doc 2026-06-30, "nie raten, messen").
//
// Question it answers with HONEST NUMBERS before we build anything: on the roads Doc actually drives, how
// often would a backward CARRY (a RAM ring of recently-seen confirmed limits) or a persistent per-way
// MEMORY have (a) AGREED with the live confirmed limit, and (b) COVERED a gap where the live query found
// no signed limit? High agreement + real coverage → Phase 1/2 worth building; else drop it cheaply.
//
// It is a pure OBSERVER: it only inspects the Overpass elements tracker-speedlimit.js ALREADY fetched per
// query, and writes counters + a simulated memory to its own localStorage keys. NO rendering, NO extra
// Overpass call, NO change to the sign / bell / fines. Read the running tally in the DEBUG window (📏) or
// from the console: window.__speedProbe.summary() · .stats() · .reset().
//
// Measurement honesty (per adversarial review 2026-06-30):
//  • liveConfirmed() mirrors the sign's pick() EXACTLY (bearing-aligned, but falls back to all candidates
//    when none align) so we score carry/memory against the SAME number the sign shows.
//  • AGREEMENT excludes trivial self-recall: the sign re-queries the same way every ~90 m, which would
//    otherwise let a value "agree with itself" ~100 %. Carry agreement requires a DIFFERENT way id;
//    memory agreement requires a genuinely OLD observation (a real return visit, not this segment).
window.TrackerSpeedProbe = function () {
    'use strict';
    const RING_MAX = 40;          // recent confirmed observations kept in RAM for the carry simulation
    const CARRY_MAX_M = 1500;     // a carried obs counts only within this straight-line distance of the path…
    const ALIGN_TOL = 40;         // …and only when its bearing aligns with travel (same gate as the live sign)
    const RECALL_MIN_AGE_MS = 120000; // a memory "recall" must be ≥2 min old → excludes the 5 s/90 m self-re-query
    const MEM_MAX = 6000;         // cap the simulated persistent map so localStorage can't grow unbounded
    const MEM_KEY = 'trk_speedprobe_mem';
    const STAT_KEY = 'trk_speedprobe_stats';
    const SUMMARY_EVERY = 15;     // emit a readable summary every N recorded queries

    // Same drivable highway classes the live sign trusts (tracker-speedlimit.js DRIVE_HW) — the memory map
    // is keyed only by drivable ways, so the gap-coverage lookup must restrict to the same set.
    const DRIVE_HW = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary',
        'unclassified', 'residential', 'living_street', 'service', 'road',
        'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link']);

    function dbg(m) { try { if (window.DebugWindow) DebugWindow.log('📏 ' + m); } catch (e) { } }
    function load(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v || d; } catch (e) { return d; } }
    function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

    const sessionStart = Date.now();         // memory learned before this is a genuine cross-trip recall
    const ring = [];                         // [{ pos:[lat,lng], brg, limit, id, t }]
    let mem = load(MEM_KEY, {});             // wayId -> { limit, t } — persists across sessions (the "Dresden gemerkt" sim)
    const stats = load(STAT_KEY, {
        queries: 0, confLive: 0,
        carryHit: 0, carryAgree: 0, carryDisagree: 0, carryCover: 0,
        memHit: 0, memAgree: 0, memDisagree: 0, memCover: 0,
    });

    // --- geometry (copies of the live sign's helpers; a shared tracker-geo.js is the Phase-2 refactor) ---
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
            if (d < min) { min = d; brg = bearingDeg(geom[i - 1], geom[i]); }
        }
        if (geom.length === 1) { const a = xy(geom[0].lat, geom[0].lon); min = Math.hypot(px[0] - a[0], px[1] - a[1]); }
        return { d: min, brg };
    }
    function bearingDeg(a, b) {
        const t = Math.PI / 180;
        const la1 = (a.lat != null ? a.lat : a[0]) * t, la2 = (b.lat != null ? b.lat : b[0]) * t;
        const dLon = ((b.lon != null ? b.lon : b[1]) - (a.lon != null ? a.lon : a[1])) * t;
        const y = Math.sin(dLon) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    function aligned(travel, seg, tol) {
        if (travel == null || seg == null) return true;
        const d = Math.abs(travel - seg) % 180;
        return Math.min(d, 180 - d) <= tol;
    }
    function haversine(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }

    // The nearest CONFIRMED way at p — mirrors the live sign's pick() EXACTLY: prefer bearing-aligned ways,
    // but if a heading exists and NONE align, fall back to all candidates (nearest wins), like the sign.
    function liveConfirmed(p, travelBrg, elements, resolveLimit) {
        const cands = [];
        for (const e of elements) {
            if (!e.tags || !e.geometry) continue;
            const lim = resolveLimit(e.tags);
            if (lim == null) continue;
            const ns = nearestSeg(p, e.geometry);
            cands.push({ lim, d: ns.d, way: e, ok: aligned(travelBrg, ns.brg, ALIGN_TOL) });
        }
        const pool = (travelBrg != null && cands.some((c) => c.ok)) ? cands.filter((c) => c.ok) : cands;
        let m = null, way = null, best = Infinity;
        for (const c of pool) if (c.d < best) { best = c.d; m = c.lim; way = c.way; }
        return { m, way };
    }
    // The nearest DRIVABLE way at p (matching the memory key space), for the gap-coverage lookup.
    function nearestWay(p, elements) {
        let way = null, best = Infinity;
        for (const e of elements) {
            if (!e.geometry || !e.tags || !DRIVE_HW.has(e.tags.highway)) continue;
            const ns = nearestSeg(p, e.geometry);
            if (ns.d < best) { best = ns.d; way = e; }
        }
        return way;
    }
    // What a backward carry WOULD show now: the newest aligned confirmed obs within CARRY_MAX_M straight-line
    // of the current fix. Returns the ring entry ({limit,id,…}) so the caller can exclude same-way self-recall.
    // NOTE: this is straight-line point distance (a coarse "recent along my path" proxy), not lateral-to-road.
    function carryAt(p, travelBrg) {
        for (let i = ring.length - 1; i >= 0; i--) {
            const r = ring[i];
            if (haversine(p, r.pos) > CARRY_MAX_M) continue;
            if (travelBrg != null && r.brg != null && !aligned(travelBrg, r.brg, ALIGN_TOL)) continue;
            return r;
        }
        return null;
    }
    function pushRing(o) { ring.push(o); if (ring.length > RING_MAX) ring.shift(); }
    // Returns true if a real save is warranted (limit changed for this id, or an eviction happened).
    function memSet(id, limit, t) {
        const prev = mem[id];
        const changed = !prev || prev.limit !== limit;
        mem[id] = { limit, t };
        const ids = Object.keys(mem);
        let evicted = false;
        if (ids.length > MEM_MAX) {
            ids.sort((a, b) => (mem[a].t || 0) - (mem[b].t || 0));
            for (let i = 0; i < ids.length - MEM_MAX; i++) { delete mem[ids[i]]; evicted = true; }
        }
        return changed || evicted;
    }

    // Called once per live query (NOT per GPS fix) from tracker-speedlimit.query() with the raw Overpass
    // elements it already fetched. Never throws into the caller (wrapped here AND at the call site).
    function record(p, travelBrg, elements, resolveLimit, nowMs) {
        try {
            if (!Array.isArray(elements) || typeof resolveLimit !== 'function') return;
            stats.queries++;
            const live = liveConfirmed(p, travelBrg, elements, resolveLimit);
            const carry = carryAt(p, travelBrg);

            if (live.m != null) {
                stats.confLive++;
                const id = live.way && live.way.id;
                // CARRY agreement — only across a DIFFERENT segment (exclude re-sampling the road you're on).
                if (carry && carry.id !== id) {
                    stats.carryHit++; if (carry.limit === live.m) stats.carryAgree++; else stats.carryDisagree++;
                }
                // MEMORY agreement — only a genuinely OLD obs (a real return visit), not this trip's own write.
                const mh = (id != null) ? mem[id] : null;
                if (mh && (nowMs - mh.t) > RECALL_MIN_AGE_MS) {
                    stats.memHit++; if (mh.limit === live.m) stats.memAgree++; else stats.memDisagree++;
                }
                // learn this confirmed observation into both the ring and the persistent map
                pushRing({ pos: p, brg: travelBrg, limit: live.m, id, t: nowMs });
                if (id != null && memSet(id, live.m, nowMs)) save(MEM_KEY, mem);
            } else {
                // live found no confirmed limit here → would carry / memory have COVERED the gap?
                if (carry) stats.carryCover++;
                const w = nearestWay(p, elements);
                if (w && w.id != null && mem[w.id] && (nowMs - mem[w.id].t) > RECALL_MIN_AGE_MS) stats.memCover++;
            }
            save(STAT_KEY, stats);
            if (stats.queries % SUMMARY_EVERY === 0) summary();
        } catch (e) { /* a probe must never disturb the sign */ }
    }

    function pct(n, d) { return d ? Math.round(100 * n / d) : 0; }
    function summary() {
        dbg('Sonde: ' + stats.queries + ' Abfragen · ' + stats.confLive + ' live-bestätigt | '
            + 'Carry ' + pct(stats.carryAgree, stats.carryHit) + '% stimmig (' + stats.carryHit + '), +' + stats.carryCover + ' Lücken | '
            + 'Memory ' + pct(stats.memAgree, stats.memHit) + '% stimmig (' + stats.memHit + '), +' + stats.memCover + ' Lücken | mem=' + Object.keys(mem).length);
    }
    function reset() { ring.length = 0; mem = {}; save(MEM_KEY, mem); Object.keys(stats).forEach((k) => { stats[k] = 0; }); save(STAT_KEY, stats); dbg('Sonde zurückgesetzt'); }

    return { record, summary, reset, stats: () => stats };
};
