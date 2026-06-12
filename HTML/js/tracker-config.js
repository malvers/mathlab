// js/tracker-config.js — live remote config (Modell 1): poll a static JSON on the site and apply it
// via CSS variables. No backend, no secrets. Edit HTML/config.json → commit + push → it is served at
// docalvers.de/config.json → the app picks it up on the next poll (no reload). Presentation only.
window.TrackerConfig = (function () {
    const URL = '../config.json';     // HTML/config.json → docalvers.de/config.json (Pages root = HTML/)
    const POLL_MS = 20000;            // gentle heartbeat; ETag makes unchanged checks a 304 (no download)
    let etag = null, timer = null;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('cfg: ' + m); };

    // Map config → CSS custom properties on :root. Missing/null keys keep the CSS default (fallback).
    function applyConfig(cfg) {
        if (!cfg || typeof cfg !== 'object') return;
        const root = document.documentElement.style;
        const set = (name, val) => { if (val != null) root.setProperty(name, String(val)); };
        const colors = (cfg.theme && cfg.theme.colors) || {};
        set('--cfg-stat-color', colors.statColor);          // the orange numbers under the clock
        dbg('applied --cfg-stat-color=' + (root.getPropertyValue('--cfg-stat-color') || '(unset)'));
        const nb = cfg.navBanner || {};
        set('--cfg-nav-bg', nb.bg);                          // nav banner background ("mach es grün")
        set('--cfg-nav-z', nb.zIndex);                       // z-order ("ganz nach unten")
        set('--cfg-nav-dy', nb.offsetY != null ? nb.offsetY + 'px' : null); // "ein Stück nach Süden"
        const ct = cfg.controls || {};
        set('--cfg-controls-color', ct.color);   // START/PAUSE/STOP text colour (was unreadable dark)
        set('--cfg-controls-weight', ct.weight); // …and its weight
    }

    async function poll() {
        try {
            const headers = etag ? { 'If-None-Match': etag } : {};
            const r = await fetch(URL, { headers, cache: 'no-store' });
            if (r.status === 304) { dbg('304 unchanged'); return; }  // nothing to do
            if (!r.ok) { dbg('HTTP ' + r.status); return; }
            etag = r.headers.get('ETag') || etag;
            const cfg = await r.json();
            dbg('fetched v' + (cfg && cfg.version) + ' statColor=' + (cfg && cfg.theme && cfg.theme.colors && cfg.theme.colors.statColor));
            applyConfig(cfg);
        } catch (e) { dbg('ERR ' + (e && (e.message || e))); }
    }

    function start() {
        if (timer) return;
        poll();                                              // apply once on load …
        timer = setInterval(poll, POLL_MS);                  // … then poll
        document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); }); // snappier on focus
    }

    start();
    return { start, applyConfig };
})();
