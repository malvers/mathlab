// js/tracker-signpanel.js — FEAT-35 Phase 1: tap a missing sign in yourself.
//
// Double-tap the map → a vertical panel of the most important signs appears on the left. Tapping one
// stores a LOCAL override (js/tracker-speedlimit.js owns it) anchored at your current position, so the
// sign shows at once and wins over OSM — for the temporary / Baustellen / thinly-tagged signs OSM lacks
// (Doc 2026-07-04, Kötzschenbroder Str.: real "30 werktags 6-20h", nothing in OSM). Keyless, offline.
// Phase 2 (Supabase DB sync) and Phase 3 (upload to OSM/Overpass) come later — this is the input surface.
window.TrackerSignPanel = function (ctx) {
    const map = ctx.map;
    const speed = ctx.speed;
    const curPos = typeof ctx.curPos === 'function' ? ctx.curPos : () => null;
    const toast = typeof ctx.toast === 'function' ? ctx.toast : function () { };

    let panel = null, backdrop = null, isOpen = false;

    // The curated set (Doc 2026-07-04): the signs most often missing/temporary in OSM. `kind`:
    //  'limit' → a fixed km/h sign · 'time' → a werktags 6-20h → 30 window · 'adv' → Überholverbot ·
    //  'clear' → remove any override at this spot (back to live OSM).
    const SIGNS = [
        { key: '5', kind: 'limit', limit: 5, label: '5' },
        { key: '30', kind: 'limit', limit: 30, label: '30' },
        { key: '50', kind: 'limit', limit: 50, label: '50' },
        { key: '70', kind: 'limit', limit: 70, label: '70' },
        { key: '100', kind: 'limit', limit: 100, label: '100' },
        { key: 'w30', kind: 'time', limit: 30, label: '30', sub: 'wt' },
        { key: 'ov', kind: 'adv', noOvertake: true },
        { key: 'maut', kind: 'adv', toll: true, label: 'MAUT' },
        { key: 'clr', kind: 'clear', label: '×' },
    ];

    // A round traffic-sign disc, same road-sign look as #speed-sign, for the panel chips.
    const OVERTAKE_SVG = '<svg viewBox="0 0 48 48" width="30" height="30" aria-label="Überholverbot">'
        + '<circle cx="24" cy="24" r="21" fill="#fff" stroke="rgb(176,36,24)" stroke-width="5"/>'
        + '<rect x="8" y="20" width="14" height="9" rx="2" fill="rgb(176,36,24)"/>'
        + '<rect x="26" y="20" width="14" height="9" rx="2" fill="rgb(14,36,78)"/></svg>';

    function chipInner(s) {
        if (s.kind === 'adv' && s.noOvertake) return OVERTAKE_SVG;
        if (s.kind === 'adv' && s.toll) return '<span class="sp-maut">MAUT</span>';
        if (s.kind === 'clear') return '<span class="sp-clear">×</span>';
        return '<span class="sp-num">' + (s.label || '') + '</span>'
            + (s.sub ? '<span class="sp-sub">' + s.sub + '</span>' : '');
    }

    function build() {
        if (panel) return;
        backdrop = document.createElement('div');
        backdrop.id = 'sign-panel-backdrop';
        backdrop.addEventListener('click', close); // tap outside → close

        panel = document.createElement('div');
        panel.id = 'sign-panel';
        for (const s of SIGNS) {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'sp-chip sp-chip-' + s.kind + (s.key === 'clr' ? ' sp-chip-clear' : '');
            chip.innerHTML = chipInner(s);
            chip.addEventListener('click', (e) => { e.stopPropagation(); pick(s); });
            panel.appendChild(chip);
        }
        document.body.appendChild(backdrop);
        document.body.appendChild(panel);
    }

    // Turn a chip into an override descriptor and hand it to the speed module, anchored at the live GPS pos.
    function pick(s) {
        const pos = curPos();
        if (!pos) { toast('Warte auf GPS-Fix …'); return; }
        if (!speed) { close(); return; }

        if (s.kind === 'clear') {
            const removed = speed.clearOverridesNear && speed.clearOverridesNear(pos);
            toast(removed ? 'Schild hier entfernt' : 'Kein eigenes Schild hier');
            close(); return;
        }
        let desc = null, label = '';
        if (s.kind === 'limit') { desc = { limit: s.limit }; label = 'Tempo ' + s.limit; }
        else if (s.kind === 'time') {
            // werktags 6-20h → 30. "werktags" = Mo–Sa (Sa zählt); base = the limit shown now, else 50.
            const base = (typeof speed.currentLimit === 'function' && typeof speed.currentLimit() === 'number')
                ? speed.currentLimit() : 50;
            desc = { raw: { base, rules: [{ limit: s.limit, days: [1, 2, 3, 4, 5, 6], times: [{ from: 360, to: 1200 }], wet: false }] } };
            label = '30 · werktags 6–20';
        } else if (s.kind === 'adv' && s.noOvertake) { desc = { noOvertake: true }; label = 'Überholverbot'; }
        else if (s.kind === 'adv' && s.toll) { desc = { toll: true }; label = 'Maut'; }

        if (desc && speed.setOverride && speed.setOverride(desc, pos)) toast(label + ' gesetzt');
        close();
    }

    function open() { build(); isOpen = true; panel.classList.add('open'); backdrop.classList.add('open'); }
    function close() { if (!panel) return; isOpen = false; panel.classList.remove('open'); backdrop.classList.remove('open'); }
    function toggle() { isOpen ? close() : open(); }

    // Double-tap the map → open. dblclick already enters hand-mode (freeze auto-follow); opening the panel
    // on top of that is fine — drag/pinch/wheel still freeze, so no gesture is lost (Doc 2026-07-04).
    if (map && map.on) map.on('dblclick', toggle);

    return { open, close, toggle };
};
