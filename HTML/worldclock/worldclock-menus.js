// worldclock-menus.js — the two half-circle touch menus (left = mode/date, right = sky-layer toggles).
// Loaded AFTER worldclock.js: these IIFEs run immediately and read/write its globals — skyTarget, starLangDE,
// CW, debugDayOffset, show* toggles — plus setDirection / getDisplayTime / window.toggleGlobe.
// Extracted from worldclock.js (Phase 3 refactor) — behaviour unchanged.

// --- Touch control menu: a left-edge hamburger opens a right-facing half-circle of buttons. ---
// Standalone (no imports); same scope as the state lets above, so the buttons read/write
// skyTarget / starLangDE / useGlobe / CW / debugDayOffset directly. (skyView is fixed at 1 =
// Stadthimmel/dome — the astronomically correct local sky — so there is no projection toggle.)
(function () {
    const stack = document.getElementById('mini-stack');
    if (!stack) return;
    const hamb   = document.getElementById('wc-menu-btn');
    const bSky   = document.getElementById('wc-mb-sky');
    const bLang  = document.getElementById('wc-mb-lang');
    const bGlobe = document.getElementById('wc-mb-globe');
    const bDir   = document.getElementById('wc-mb-dir');
    const bToday = document.getElementById('wc-mb-today');
    const bMoon  = document.getElementById('wc-mb-moon');   // planetarium-only on/off toggles
    const bNeb   = document.getElementById('wc-mb-nebula');

    // Two-line buttons: light the active option (cyan), dim the other. First span = "on" state.
    function setActive(btn, firstActive) {
        if (!btn) return;
        const opts = btn.querySelectorAll('.opt');
        if (opts.length < 2) return;
        opts[0].classList.toggle('is-active', !!firstActive);
        opts[1].classList.toggle('is-active', !firstActive);
    }
    function refreshLabels() {
        setActive(bSky,   !!skyTarget);        // PLANETARIUM (on) ↔ UHR
        setActive(bLang,  !!starLangDE);       // DEUTSCH ↔ LATEIN
        setActive(bGlobe, !!window.useGlobe);  // GLOBUS ↔ UHR
        setActive(bDir,   !!CW);               // SÜD-VIEW (CW) ↔ NORD-VIEW (CCW)
        if (bMoon) bMoon.classList.toggle('off', !showMoon);     // single-line toggles: off = dimmed
        if (bNeb)  bNeb.classList.toggle('off', !showDeepsky);
        if (bToday) {
            const to = bToday.querySelectorAll('.opt');
            if (to.length >= 2) {
                if (debugDayOffset === 0) {           // already on today → show the date, active (cyan)
                    const d = getDisplayTime();
                    to[0].textContent = 'HEUTE';
                    to[1].textContent = String(d.getDate()).padStart(2, '0') + '.' +
                                        String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
                    bToday.classList.remove('action');
                } else {                              // stepped away → offer the reset (orange action)
                    to[0].textContent = 'ZURÜCK ZU';
                    to[1].textContent = 'HEUTE';
                    bToday.classList.add('action');
                }
            }
        }
    }

    function clearPositions() {
        stack.querySelectorAll('.mini-btn').forEach(b => { b.style.left = ''; b.style.top = ''; });
    }

    // Half-circle anchored at the left-edge hamburger: items fan out to the right (−90°…+90°).
    function open() {
        const H = 260, cxC = 56, bulge = 106, rowGap = 50;  // even vertical gaps + a gentle sin bulge to the right (rowGap > button height ⇒ never overlaps); ends (top/bottom) sit at cxC, only the bulged middle three move with `bulge`
        stack.style.left = '8px';
        stack.style.top  = (window.innerHeight / 2 - H / 2) + 'px';
        refreshLabels();
        stack.classList.add('popup');
        if (hamb) hamb.classList.add('open');
        // Mode-specific buttons: GLOBUS + SÜD/NORD only in clock mode; MOND + NEBEL only in the planetarium.
        if (bGlobe) bGlobe.style.display = skyTarget ? 'none' : '';
        if (bDir)   bDir.style.display   = skyTarget ? 'none' : '';
        if (bMoon)  bMoon.style.display  = skyTarget ? '' : 'none';
        if (bNeb)   bNeb.style.display   = skyTarget ? '' : 'none';
        const btns = Array.from(stack.querySelectorAll('.mini-btn')).filter(b => b.style.display !== 'none');
        const n = btns.length;
        btns.forEach((b, i) => {
            const t = n > 1 ? i / (n - 1) : 0.5;                          // 0 (top) … 1 (bottom)
            b.style.left = (cxC + Math.sin(t * Math.PI) * bulge) + 'px';  // ends flush left, middle bulges right
            b.style.top  = (H / 2 + (i - (n - 1) / 2) * rowGap) + 'px';   // equal vertical gaps
        });
    }
    function close() {
        stack.classList.remove('popup');
        if (hamb) hamb.classList.remove('open');
        clearPositions();
    }
    function toggle() { stack.classList.contains('popup') ? close() : open(); }

    // primary trigger: the hamburger (tap)
    if (hamb) hamb.addEventListener('click', () => toggle());

    // alternates: right-click (desktop) + long-press (touch) open the same left-anchored menu
    window.addEventListener('contextmenu', e => { e.preventDefault(); open(); });
    let lpTimer = null, lpX = 0, lpY = 0;
    document.addEventListener('touchstart', e => {
        if (e.target.closest('button, input, label')) return;
        if (stack.classList.contains('popup')) return;
        const t = e.touches[0]; lpX = t.clientX; lpY = t.clientY;
        clearTimeout(lpTimer);
        lpTimer = setTimeout(() => { open(); lpTimer = null; }, 550);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (Math.abs(t.clientX - lpX) > 8 || Math.abs(t.clientY - lpY) > 8) { clearTimeout(lpTimer); lpTimer = null; }
    }, { passive: true });
    document.addEventListener('touchend',    () => { clearTimeout(lpTimer); lpTimer = null; });
    document.addEventListener('touchcancel', () => { clearTimeout(lpTimer); lpTimer = null; });

    // close on button tap inside (after the action) or on a click/tap outside (but not on the hamburger)
    stack.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('mousedown', e => {
        if (!stack.classList.contains('popup')) return;
        if (stack.contains(e.target)) return;
        if (hamb && hamb.contains(e.target)) return;   // the hamburger toggles itself
        close();
    });

    // actions — mirror the keyboard handlers exactly
    if (bSky)   bSky.addEventListener('click',   () => { skyTarget = skyTarget ? 0 : 1; refreshLabels(); });
    if (bLang)  bLang.addEventListener('click',  () => { starLangDE = !starLangDE;       refreshLabels(); });
    if (bGlobe) bGlobe.addEventListener('click', () => { window.toggleGlobe();            refreshLabels(); });
    if (bDir)   bDir.addEventListener('click',   () => { setDirection(!CW);               refreshLabels(); });
    if (bToday) bToday.addEventListener('click', () => { debugDayOffset = 0; });
    // on/off toggles: flip + restyle, keep the menu open (stopPropagation prevents the close-on-tap)
    if (bMoon) bMoon.addEventListener('click', (e) => { e.stopPropagation(); showMoon = !showMoon; refreshLabels(); });
    if (bNeb)  bNeb.addEventListener('click',  (e) => { e.stopPropagation(); showDeepsky = !showDeepsky; refreshLabels(); });
})();

// --- Right-edge mirror menu: on/off toggles for the sky overlays (left-facing half-circle). ---
(function () {
    const stack = document.getElementById('mini-stack-r');
    if (!stack) return;
    const hamb = document.getElementById('wc-menu-btn-r');
    const map = [
        ['wc-tg-conlines', () => showConstLines, v => { showConstLines = v; }],
        ['wc-tg-connames', () => showConstNames, v => { showConstNames = v; }],
        ['wc-tg-ecliptic', () => showEcliptic,   v => { showEcliptic   = v; }],
        ['wc-tg-planets',  () => showPlanets,    v => { showPlanets    = v; }],
        ['wc-tg-zodiac',   () => showZodiac,     v => { showZodiac     = v; }],
    ];
    function refreshToggles() {
        for (const [id, get] of map) {
            const b = document.getElementById(id);
            if (b) b.classList.toggle('off', !get());   // off = dimmed grey, on = cyan
        }
    }
    // Half-circle anchored at the right edge: items fan out to the LEFT (mirror of the left menu).
    function open() {
        const H = 260, cxC = 56, bulge = 106, rowGap = 50, W = 320;
        stack.style.left = (window.innerWidth - 8 - W) + 'px';
        stack.style.top  = (window.innerHeight / 2 - H / 2) + 'px';
        refreshToggles();
        stack.classList.add('popup');
        if (hamb) hamb.classList.add('open');
        const btns = Array.from(stack.querySelectorAll('.mini-btn'));
        const n = btns.length;
        btns.forEach((b, i) => {
            const t = n > 1 ? i / (n - 1) : 0.5;
            b.style.left = (W - cxC - Math.sin(t * Math.PI) * bulge) + 'px';  // ends flush right, middle bulges left
            b.style.top  = (H / 2 + (i - (n - 1) / 2) * rowGap) + 'px';
        });
    }
    function close() {
        stack.classList.remove('popup');
        if (hamb) hamb.classList.remove('open');
        stack.querySelectorAll('.mini-btn').forEach(b => { b.style.left = ''; b.style.top = ''; });
    }
    function toggle() { stack.classList.contains('popup') ? close() : open(); }
    if (hamb) hamb.addEventListener('click', () => toggle());
    // each toggle flips its layer and stays open (so several can be flipped in a row)
    for (const [id, get, set] of map) {
        const b = document.getElementById(id);
        if (b) b.addEventListener('click', (e) => { e.stopPropagation(); set(!get()); refreshToggles(); });
    }
    // close on a click/tap outside (but not on its hamburger)
    document.addEventListener('mousedown', e => {
        if (!stack.classList.contains('popup')) return;
        if (stack.contains(e.target)) return;
        if (hamb && hamb.contains(e.target)) return;
        close();
    });
})();
