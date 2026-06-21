// js/supa-gate.js — a tiny CENTRAL circuit breaker for ALL Supabase traffic (Doc 2026-06-21).
//
// The egress audit found several loops (share-viewer poll, track autosync, live realtime rejoin) that
// kept hitting Supabase even while the project was egress-LOCKED (HTTP 402 exceed_egress_quota) — no
// per-loop backoff. Instead of patching every loop, THIS is the one "off switch" Doc asked for: wrap the
// supabase-js client's fetch. A 402 (or the browser being offline) TRIPS the breaker; while it is open,
// every REST/RPC/Edge call short-circuits WITHOUT touching the network (zero egress) until a cooldown
// passes — then ONE call probes for recovery. Realtime (websocket) isn't fetch-based, so its rejoin loop
// asks SupaGate.ok() separately.
//
// The cooldown is exponential (1 min … 15 min) and the breaker is SHARED, so a long outage settles to
// ~1 probe / 15 min across the WHOLE app; a single good (2xx) response resets it to full speed.
// Classic global: window.SupaGate { gatedFetch, ok, open, note }.
(function (global) {
    'use strict';
    const MIN_MS = 60000, MAX_MS = 900000; // 1 min … 15 min
    let trippedUntil = 0, cooldown = 0;
    const dbg = (m) => { try { if (global.DebugWindow && DebugWindow.log) DebugWindow.log('supa-gate: ' + m); } catch (_) {} };
    const offline = () => (typeof navigator !== 'undefined' && navigator.onLine === false);

    function trip(why) {
        cooldown = cooldown ? Math.min(cooldown * 2, MAX_MS) : MIN_MS;
        trippedUntil = Date.now() + cooldown;
        dbg('TRIPPED ' + Math.round(cooldown / 1000) + 's (' + (why || '402') + ') → Supabase-Calls pausiert');
    }
    function reset() {
        if (cooldown) dbg('recovered → Calls wieder frei');
        cooldown = 0; trippedUntil = 0;
    }
    // Is the breaker currently blocking calls? (offline, or still within the cooldown window)
    function open() { return offline() || Date.now() < trippedUntil; }
    function ok() { return !open(); }

    // Drop-in fetch for supabase-js (createClient global.fetch). ALWAYS resolves with a Response on the
    // breaker path (never throws) so supabase-js turns it into a normal { data:null, error } for callers.
    async function gatedFetch(input, init) {
        if (offline()) {
            return new Response('{"error":"offline (supa-gate)"}', { status: 503, headers: { 'Content-Type': 'application/json' } });
        }
        if (Date.now() < trippedUntil) { // breaker open → no network, no egress
            return new Response('{"error":"supa-gate open"}', { status: 503, headers: { 'Content-Type': 'application/json' } });
        }
        const res = await fetch(input, init); // closed / half-open → real request (doubles as the recovery probe)
        if (res.status === 402) trip('402 exceed_egress_quota');
        else if (res.ok) reset();
        return res;
    }

    global.SupaGate = { gatedFetch: gatedFetch, ok: ok, open: open, note: trip };
})(window);
