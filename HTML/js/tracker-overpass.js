// js/tracker-overpass.js — single shared Overpass client (single source of truth, CLAUDE.md rule 7).
//
// Replaces the per-module copies of "mirror list + overpass() fetch + failover". The PRIMARY path is the
// server-side `overpass` Edge Function, which races several public mirrors in parallel (no CORS / no
// client rate-limit / not at the mercy of the client's local network). This helper POSTs the Overpass QL
// there and returns the parsed JSON (or null) — exactly the contract the old per-module overpass()
// helpers had.
//
// RESILIENCE (Doc 2026-06-29 "Geschwindigkeits-Disaster"): the proxy is a single point of failure — if
// the Edge Function is down / cold-starting / its mirrors are all overloaded it returns a 502 and every
// consumer that has no fallback (street-quality, speed-profile, traffic, poi) collapses. So the fallback
// now lives HERE, centrally: when the proxy yields nothing we RACE the public mirrors DIRECTLY from the
// browser (all CORS-enabled + worldwide, verified 2026-06-29). One fix, every consumer survives. Modules
// must NOT keep their own mirror lists anymore — they all go through window.queryOverpass.
//
// Load order (tracker.html): this file MUST come before the modules that call window.queryOverpass
// (tracker-speedprofile / -speedlimit / -streetquality / -poi / -traffic).
(function () {
    'use strict';

    // Same Supabase project + publishable anon key already used across the client (tracker.js:1985-1986,
    // tracker-solita.js, view.html). PUBLIC BY DESIGN — RLS, not key secrecy, protects user data; this
    // call carries no user data anyway. No NEW secret is introduced (CLAUDE.md rule 18).
    const SUPABASE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';
    const ENDPOINT = SUPABASE_URL + '/functions/v1/overpass';

    // Direct public mirrors for the FALLBACK path (proxy returned nothing). Only CORS-enabled, WORLDWIDE
    // instances belong here — a browser can't read a response without `Access-Control-Allow-Origin`, and a
    // regional extract (e.g. the Swiss overpass.osm.ch) returns a fast EMPTY 200 that would falsely read as
    // "no road". Verified 2026-06-29: all three answer Dresden with real data + send ACAO:*. Fastest first.
    const DIRECT_MIRRORS = [
        'https://overpass.openstreetmap.fr/api/interpreter',
        'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
        'https://overpass-api.de/api/interpreter',
    ];

    const DEFAULT_TIMEOUT_MS = 12000; // client-side guard around the proxy call; the server fails over
    //                                   between mirrors internally within this budget.
    const DIRECT_TIMEOUT_MS = 9000;   // FLOOR for the per-mirror abort on the direct-fallback race; a heavier
    //                                   caller budget (opts.timeout) wins so a [timeout:25] corridor query
    //                                   isn't killed early on the fallback path.

    // queryOverpass(ql, opts?) → Promise<object|null>
    //   ql           : the Overpass QL string (e.g. '[out:json][timeout:8];way(around:25,...)[highway];out tags geom;')
    //   opts.timeout : ms before the client aborts the PROXY call (default 12000; speedprofile passes more)
    //   opts.signal  : optional external AbortSignal (caller can cancel a stale request)
    //   opts.dbg     : optional logger(msg) for module-flavoured debug lines (e.g. street-quality '🛣️')
    // Returns the RAW Overpass JSON (object with .elements / .remark / …), or null on total failure —
    // matching what every old per-module overpass() returned, so call sites need no logic change.
    async function queryOverpass(ql, opts) {
        opts = opts || {};
        const dbg = typeof opts.dbg === 'function' ? opts.dbg : function () {};

        // 1) PRIMARY: the shared server-side proxy (races mirrors server-side, no CORS / rate-limit).
        const viaProxy = await tryProxy(ql, opts, dbg);
        if (viaProxy) return viaProxy;

        // 2) FALLBACK: proxy down / all-mirror 502 / cold-start timeout → race the public mirrors directly
        //    from the browser. Keeps the live sign, street-quality, profile, traffic and poi alive even
        //    when the Edge Function itself is unavailable.
        dbg('Proxy ohne Antwort → direkte Mirror (Fallback)');
        return tryDirectRace(ql, opts, dbg);
    }

    // The proxy call. Resolves to parsed JSON on a clean 200, else null (any non-200 / timeout / error).
    async function tryProxy(ql, opts, dbg) {
        const clientMs = opts.timeout || DEFAULT_TIMEOUT_MS;
        // The client waits a touch LONGER than the server's per-mirror race, so on a total miss the server
        // returns its clean 502 (→ null) instead of us aborting first. Both map to null anyway.
        const serverMs = Math.max(3000, clientMs - 1500);
        const ctrl = new AbortController();
        const to = setTimeout(function () { ctrl.abort(); }, clientMs);
        linkSignal(opts.signal, ctrl);
        try {
            const r = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_KEY,
                },
                body: JSON.stringify({ data: ql, timeout: serverMs }),
                signal: ctrl.signal,
            });
            if (!r.ok) { dbg('overpass proxy → HTTP ' + r.status); return null; }
            return await r.json();
        } catch (e) {
            dbg('overpass proxy → ' + (e && e.name === 'AbortError' ? 'TIMEOUT' : (e && e.message) || 'Fehler'));
            return null;
        } finally {
            clearTimeout(to);
        }
    }

    // Race ALL direct mirrors at once (Promise.any) — the fallback path is already degraded, so the lowest
    // latency wins and a single dead/slow mirror can't wedge it. Returns the first clean JSON, or null if
    // every mirror failed. A 200 with a `remark` (Overpass overload) and no elements is treated as a miss
    // so it can't beat a healthy mirror's real answer.
    async function tryDirectRace(ql, opts, dbg) {
        const body = 'data=' + encodeURIComponent(ql);
        // Honour the caller's budget: heavy corridor/bbox/radius queries carry [timeout:25] and pass
        // ~26-28 s — a flat 9 s would abort them on every mirror and the fallback (the whole point of this
        // file) would do nothing for them. Racing in parallel means a bigger cap never STACKS: the fastest
        // healthy mirror still wins early; the larger cap only matters when the only responsive mirror
        // genuinely needs the time. 9 s stays as the floor for the light callers.
        const directMs = Math.max(DIRECT_TIMEOUT_MS, (opts.timeout || DEFAULT_TIMEOUT_MS) - 1000);
        const attempts = DIRECT_MIRRORS.map(function (url) {
            return tryDirectMirror(url, body, opts.signal, directMs, dbg);
        });
        try {
            return await promiseAny(attempts);
        } catch (e) {
            dbg('Overpass: alle direkten Mirror fehlgeschlagen');
            return null;
        }
    }

    // One direct mirror. Resolves with parsed JSON on a clean, non-empty 200; REJECTS otherwise (so the
    // race moves on to a healthier mirror). Aborts after timeoutMs.
    async function tryDirectMirror(url, body, signal, timeoutMs, dbg) {
        const host = url.replace(/^https?:\/\//, '').split('/')[0];
        const ctrl = new AbortController();
        const to = setTimeout(function () { ctrl.abort(); }, timeoutMs);
        linkSignal(signal, ctrl);
        try {
            const r = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body,
                signal: ctrl.signal,
            });
            if (!r.ok) throw new Error(host + ' HTTP ' + r.status);
            const j = await r.json();
            // Reject an overloaded mirror's empty "remark" reply so a healthy mirror can still win the race.
            if (j && j.remark && (!Array.isArray(j.elements) || j.elements.length === 0)) {
                throw new Error(host + ' remark/empty');
            }
            dbg('direkt ✓ ' + host);
            return j;
        } finally {
            clearTimeout(to);
        }
    }

    // Abort `ctrl` when the caller's external signal fires (cancel a stale request).
    function linkSignal(signal, ctrl) {
        if (!signal) return;
        if (signal.aborted) { ctrl.abort(); return; }
        signal.addEventListener('abort', function () { ctrl.abort(); }, { once: true });
    }

    // Promise.any shim — first FULFILLED wins; rejects only when ALL reject. (Native Promise.any exists in
    // every browser the tracker targets, but this keeps the helper self-contained and predictable.)
    function promiseAny(promises) {
        return new Promise(function (resolve, reject) {
            let pending = promises.length;
            if (!pending) { reject(new Error('no mirrors')); return; }
            const errors = [];
            promises.forEach(function (p) {
                Promise.resolve(p).then(resolve, function (e) {
                    errors.push(e);
                    if (--pending === 0) reject(new Error('all failed'));
                });
            });
        });
    }

    window.queryOverpass = queryOverpass;
})();
