// js/tracker-config.js — live remote config (Modell 1): poll a static JSON on the site and apply it
// via CSS variables. No backend, no secrets. Edit HTML/config.json → commit + push → it is served at
// docalvers.de/config.json → the app picks it up on the next poll (no reload). Presentation only.
window.TrackerConfig = (function () {
    const URL = '../config.json';     // HTML/config.json → docalvers.de/config.json (Pages root = HTML/)
    const POLL_MS = 20000;            // gentle heartbeat; each poll cache-busts so a change shows within one tick
    let timer = null;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('cfg: ' + m); };

    // Build a token lookup from cfg._palette (the brand vocabulary, config v6+): each token name and
    // each of its aka-synonyms (e.g. "phi" / "gruen" / "φ") maps to its rgb. Empty if _palette absent.
    function buildPalette(cfg) {
        const out = {}, p = (cfg && cfg._palette) || {};
        for (const name in p) {
            if (name[0] === '_') continue;                   // skip _note and other doc keys
            const entry = p[name];
            if (!entry || !entry.rgb) continue;
            out[name.toLowerCase()] = entry.rgb;             // token name → rgb
            (entry.aka || []).forEach(a => { out[String(a).toLowerCase()] = entry.rgb; }); // synonyms → rgb
        }
        return out;
    }

    // Resolve a colour value: a bare palette-token name ("phi", "orange", "λ") → its rgb; anything else
    // (raw "rgb(...)" / "#hex") is returned unchanged. Backward-compatible — raw values are not token
    // names, so they pass straight through; this lets config use tokens as the single source of truth.
    function colour(palette, val) {
        if (typeof val !== 'string') return val;
        return palette[val.trim().toLowerCase()] || val;
    }

    // Map config → CSS custom properties on :root. Missing/null keys keep the CSS default (fallback).
    function applyConfig(cfg) {
        if (!cfg || typeof cfg !== 'object') return;
        const root = document.documentElement.style;
        const set = (name, val) => { if (val != null) root.setProperty(name, String(val)); };
        const pal = buildPalette(cfg);                       // named brand tokens (_palette), if present
        const colors = (cfg.theme && cfg.theme.colors) || {};
        set('--cfg-stat-color', colour(pal, colors.statColor));    // the orange numbers under the clock
        dbg('applied --cfg-stat-color=' + (root.getPropertyValue('--cfg-stat-color') || '(unset)'));
        set('--cfg-clock-color', colour(pal, colors.clockColor));  // the clock digits (Solita: "mach die Uhr gruen")
        const nb = cfg.navBanner || {};
        set('--cfg-nav-bg', colour(pal, nb.bg));             // nav banner background ("mach es grün")
        set('--cfg-nav-z', nb.zIndex);                       // z-order, a number ("ganz nach unten")
        set('--cfg-nav-dy', nb.offsetY != null ? nb.offsetY + 'px' : null); // "ein Stück nach Süden"
        const ct = cfg.controls || {};
        set('--cfg-controls-color', colour(pal, ct.color));  // START/PAUSE/STOP text colour (was unreadable dark)
        set('--cfg-controls-weight', ct.weight);             // …and its weight, a number
    }

    async function poll() {
        try {
            // Cache-bust the URL. `cache:'no-store'` only bypasses the BROWSER cache, NOT GitHub Pages' Fastly
            // CDN (Cache-Control: max-age=600). Worse, the old If-None-Match/ETag let the CDN answer 304
            // "unchanged" from its stale copy → a fresh config.json could stay invisible up to ~10 min (Doc:
            // "die Uhr ist immer noch grün"). A unique query per poll = a fresh CDN key → the change shows
            // within one poll (≤20 s). config.json is tiny, so dropping the 304 optimisation costs nothing.
            const r = await fetch(URL + (URL.indexOf('?') < 0 ? '?' : '&') + '_=' + Date.now(), { cache: 'no-store' });
            if (!r.ok) { dbg('HTTP ' + r.status); return; }
            const cfg = await r.json();
            dbg('fetched v' + (cfg && cfg.version) + ' clockColor=' + (cfg && cfg.theme && cfg.theme.colors && cfg.theme.colors.clockColor));
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
