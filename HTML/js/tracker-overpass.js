// js/tracker-overpass.js — single shared Overpass client (single source of truth, CLAUDE.md rule 7).
//
// Replaces the per-module copies of "mirror list + overpass() fetch + failover". Mirror rotation /
// per-mirror timeout / failover now live SERVER-SIDE in the `overpass` Edge Function — this helper just
// POSTs the Overpass QL there and returns the parsed JSON (or null), exactly the contract the old
// per-module overpass() helpers had. The browser no longer touches the public mirrors directly (no
// CORS / no client-network refusal / no per-client rate-limit on our origin).
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

    const DEFAULT_TIMEOUT_MS = 12000; // client-side guard around the single proxy call; the server fails
    //                                   over between mirrors internally within this budget.

    // queryOverpass(ql, opts?) → Promise<object|null>
    //   ql           : the Overpass QL string (e.g. '[out:json][timeout:8];way(around:25,...)[highway];out tags geom;')
    //   opts.timeout : ms before the client aborts (default 12000; speedprofile passes a larger value)
    //   opts.signal  : optional external AbortSignal (caller can cancel a stale request)
    //   opts.dbg     : optional logger(msg) for module-flavoured debug lines (e.g. street-quality '🛣️')
    // Returns the RAW Overpass JSON (object with .elements / .remark / …), or null on any failure —
    // matching what every old per-module overpass() returned, so call sites need no logic change.
    async function queryOverpass(ql, opts) {
        opts = opts || {};
        const dbg = typeof opts.dbg === 'function' ? opts.dbg : function () {};
        // The client waits a touch LONGER than the server's per-mirror race, so on a total miss the
        // server returns its clean 502 (→ null) instead of us aborting first. Both map to null anyway.
        const clientMs = opts.timeout || DEFAULT_TIMEOUT_MS;
        const serverMs = Math.max(3000, clientMs - 1500);
        const ctrl = new AbortController();
        const to = setTimeout(function () { ctrl.abort(); }, clientMs);
        // If the caller passed its own signal, abort our controller when theirs fires.
        if (opts.signal) {
            if (opts.signal.aborted) ctrl.abort();
            else opts.signal.addEventListener('abort', function () { ctrl.abort(); }, { once: true });
        }
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

    window.queryOverpass = queryOverpass;
})();
