// solita-sync.js — cross-device conversation sync for Solita (single shared log).
//
// Solita is gated by ONE shared password (LABAI_PASSWORD), so browser + Pixel are the same user "Doc".
// Without sync, each device keeps its history in its own localStorage/origin and the threads diverge.
// This module keeps ONE shared log server-side (Supabase, one private row) and follows Doc across devices.
//
// Privacy: the client NEVER touches the table directly (it's RLS deny-all). Everything goes through the
// password-gated 'solita-sync' edge function (service role) — the same gate as the 'claude' proxy.
//
// Edge contract (POST, header x-app-pass):
//   { action:'pull' }                            -> { ok, history, summary, rev }
//   { action:'push', history, summary, baseRev } -> { ok, history, summary, rev }   (server is authoritative;
//      it merges so no turn is lost even if Doc spoke on two devices between syncs).
//
// Host wiring (solita-core.js): init({endpoint, anonKey, getPwd, onRemote}); call pull() once after login,
// and push(history, summary) after every turn (Brain's onPersist). onRemote(history, summary) is invoked
// whenever the server returns a log that differs from what we sent (i.e. it merged in the other device's
// turns) so the host can adopt it and re-render.
(function () {
    const REV_KEY = 'solita_rev';

    let endpoint = '', anonKey = '', getPwd = function () { return ''; }, onRemote = function () { };
    let rev = 0;
    try { rev = parseInt(localStorage.getItem(REV_KEY) || '0', 10) || 0; } catch (e) { }

    // Trailing-push state: at most one request in flight; if a push arrives mid-flight, remember the latest
    // and fire once the current one settles → the final history always reaches the server.
    let inflight = false, pending = false, lastH = null, lastS = '';

    function setRev(r) { rev = r | 0; try { localStorage.setItem(REV_KEY, String(rev)); } catch (e) { } }

    function call(body) {
        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey,
                'x-app-pass': getPwd(),
            },
            body: JSON.stringify(body),
        }).then(function (r) {
            if (!r.ok) throw new Error('sync ' + r.status);
            return r.json();
        });
    }

    // Adopt the server's authoritative state when it differs from what this device last knew.
    function adopt(d) {
        if (!d || typeof d.rev !== 'number') return;
        setRev(d.rev);
        if (Array.isArray(d.history)) onRemote(d.history, d.summary || '');
    }

    function flush() {
        inflight = true; pending = false;
        var h = lastH || [], s = lastS || '';
        return call({ action: 'push', history: h, summary: s, baseRev: rev })
            .then(function (d) { adopt(d); })
            .catch(function () { /* offline / not deployed yet → the next turn retries with full history */ })
            .then(function () { inflight = false; if (pending) flush(); });
    }

    const SolitaSync = {
        init: function (cfg) {
            cfg = cfg || {};
            endpoint = cfg.endpoint || '';
            anonKey = cfg.anonKey || '';
            if (typeof cfg.getPwd === 'function') getPwd = cfg.getPwd;
            if (typeof cfg.onRemote === 'function') onRemote = cfg.onRemote;
            return SolitaSync;
        },
        // Read the shared server log (read-only). Adopts it via onRemote if it differs.
        pull: function () {
            return call({ action: 'pull' }).then(function (d) { adopt(d); return d; });
        },
        // Queue a push of the full local log; coalesced + trailing so the latest state always lands.
        push: function (history, summary) {
            lastH = history || []; lastS = summary || '';
            if (inflight) { pending = true; return; }
            return flush();
        },
        getRev: function () { return rev; },
    };

    window.SolitaSync = SolitaSync;
})();
