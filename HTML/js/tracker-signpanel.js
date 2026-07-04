// js/tracker-signpanel.js — FEAT-35 Phase 1: tap a missing sign in yourself.
//
// Double-tap the map → a vertical panel on the left. The chips are COMPOSABLE (Doc 2026-07-04): tap a
// NUMBER, then quickly a DAY-range and/or a TIME-range — taps within COMMIT_MS belong together and combine
// into ONE time-conditional sign ("20 · Mo–Fr 7–18"). A number alone → a plain limit. A short pause (or a
// tap outside) commits. Überholverbot / Maut / "× hier löschen" act immediately. The result is a LOCAL
// override in js/tracker-speedlimit.js, anchored at the GPS position, that wins over OSM — for the
// temporary / thinly-tagged signs OSM lacks. Keyless, offline. DB sync + OSM upload are later phases.
window.TrackerSignPanel = function (ctx) {
    const map = ctx.map;
    const speed = ctx.speed;
    const curPos = typeof ctx.curPos === 'function' ? ctx.curPos : () => null;
    const toast = typeof ctx.toast === 'function' ? ctx.toast : function () { };

    // The composable building blocks. Extend the day/time lists as more common windows come up.
    const NUMS = [5, 10, 20, 30, 40, 50, 60];
    const DAYS = [{ label: 'Mo–Fr', days: [1, 2, 3, 4, 5] }, { label: 'werktags', days: [1, 2, 3, 4, 5, 6] }];
    const TIMES = [{ label: '7–18', from: 420, to: 1080 }, { label: '6–20', from: 360, to: 1200 }];
    const COMMIT_MS = 1200; // taps closer together than this belong to the same sign

    let panel = null, backdrop = null, isOpen = false;
    let pending = null, timer = null;
    const selEls = { num: null, days: null, time: null }; // currently-highlighted chip per role

    // The two FRONT-view cars of the real Zeichen 276 (Doc's reference photo). The white disc + red ring come
    // from the .sp-chip frame. Left car RED (overtaking), right car dark charcoal (being passed) — a charcoal,
    // not #000, so it still honours "nie schwarz" while matching the authentic sign. Each: rounded body +
    // roof, a light windscreen band, two wheels peeking out below.
    // The OFFICIAL Zeichen 276 (Überholverbot), from Wikimedia Commons. German traffic signs are amtliche
    // Werke (§5 UrhG) → public domain, same basis as the Zebrastreifen sign already in the code. The sign
    // carries its own white disc + red ring, so its chip is frameless (see .sp-chip-overtake).
    const OVERTAKE_SVG = SIGN_UEBERHOLVERBOT(46);

    // ---- composition state -----------------------------------------------------------------------
    function resetPending() { pending = { limit: null, days: null, daysLabel: '', times: null, timeLabel: '' }; }
    function armCommit() { if (timer) clearTimeout(timer); timer = setTimeout(commit, COMMIT_MS); }
    function select(el, role) {
        if (selEls[role] && selEls[role] !== el) selEls[role].classList.remove('sp-sel');
        selEls[role] = el; if (el) el.classList.add('sp-sel');
    }
    function clearSel() { ['num', 'days', 'time'].forEach((r) => { if (selEls[r]) selEls[r].classList.remove('sp-sel'); selEls[r] = null; }); }

    function tapNum(v, el) { pending.limit = v; select(el, 'num'); armCommit(); }
    function tapDays(d, el) { pending.days = d.days; pending.daysLabel = d.label; select(el, 'days'); armCommit(); }
    function tapTime(t, el) { pending.times = [{ from: t.from, to: t.to }]; pending.timeLabel = t.label; select(el, 'time'); armCommit(); }

    // Turn the accumulated selection into an override. Called on the idle timer or a tap outside.
    function commit() {
        if (timer) { clearTimeout(timer); timer = null; }
        const p = pending;
        if (!p || p.limit == null) { close(); return; }            // nothing usable yet → just close
        const pos = curPos();
        if (!pos) { toast('Warte auf GPS-Fix …'); close(); return; }
        let desc, label;
        if (p.days || p.times) {
            // base = the limit shown now (else 50) so OUTSIDE the window the sign reads a sensible number.
            const base = (typeof speed.currentLimit === 'function' && typeof speed.currentLimit() === 'number')
                ? speed.currentLimit() : 50;
            desc = { raw: { base, rules: [{ limit: p.limit, days: p.days || null, times: p.times || null, wet: false }] } };
            label = p.limit + ' · ' + (p.daysLabel || 'täglich') + (p.timeLabel ? ' ' + p.timeLabel : '');
        } else {
            desc = { limit: p.limit }; label = 'Tempo ' + p.limit;
        }
        if (speed.setOverride && speed.setOverride(desc, pos)) toast(label + ' gesetzt');
        close();
    }

    // Advisory / clear act at once (they don't compose).
    function tapAdv(a) {
        const pos = curPos();
        if (!pos) { toast('Warte auf GPS-Fix …'); return; }
        if (speed.setOverride) speed.setOverride(a.noOvertake ? { noOvertake: true } : { toll: true }, pos);
        toast((a.noOvertake ? 'Überholverbot' : 'Maut') + ' gesetzt');
        close();
    }
    function tapClear() {
        const pos = curPos();
        if (!pos) { toast('Warte auf GPS-Fix …'); return; }
        const r = speed.clearOverridesNear && speed.clearOverridesNear(pos);
        toast(r ? 'Schild hier entfernt' : 'Kein eigenes Schild hier');
        close();
    }

    // ---- DOM -------------------------------------------------------------------------------------
    function disc(cls, html, onTap) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = cls; b.innerHTML = html;
        b.addEventListener('click', (e) => { e.stopPropagation(); onTap(b); });
        return b;
    }
    function build() {
        if (panel) return;
        backdrop = document.createElement('div');
        backdrop.id = 'sign-panel-backdrop';
        backdrop.addEventListener('click', commit); // tap outside → commit what's selected (or just close)

        panel = document.createElement('div');
        panel.id = 'sign-panel';
        NUMS.forEach((v) => panel.appendChild(disc('sp-chip sp-chip-num', '<span class="sp-num">' + v + '</span>', (el) => tapNum(v, el))));
        DAYS.forEach((d) => panel.appendChild(disc('sp-pill sp-pill-days', d.label, (el) => tapDays(d, el))));
        TIMES.forEach((t) => panel.appendChild(disc('sp-pill sp-pill-time', t.label, (el) => tapTime(t, el))));
        panel.appendChild(disc('sp-chip sp-chip-overtake', OVERTAKE_SVG, () => tapAdv({ noOvertake: true })));
        panel.appendChild(disc('sp-chip sp-chip-clear', '<span class="sp-clear">×</span>', () => tapClear()));

        document.body.appendChild(backdrop);
        document.body.appendChild(panel);
    }

    function open() { build(); resetPending(); clearSel(); isOpen = true; panel.classList.add('open'); backdrop.classList.add('open'); }
    function close() { if (!panel) return; if (timer) { clearTimeout(timer); timer = null; } isOpen = false; panel.classList.remove('open'); backdrop.classList.remove('open'); clearSel(); }
    function toggle() { isOpen ? close() : open(); }

    // Double-tap the map → open. dblclick already enters hand-mode (freeze auto-follow); opening the panel
    // on top of that is fine — drag/pinch/wheel still freeze, so no gesture is lost (Doc 2026-07-04).
    if (map && map.on) map.on('dblclick', toggle);

    return { open, close, toggle };
};
