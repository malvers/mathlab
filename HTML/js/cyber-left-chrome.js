/**
 * Wraps mini-rail + #side-panel in a shared zoom container (#cyber-left-chrome).
 * Enables body.cyber-shell-grid — see cyber-lab-overrides.css.
 *
 * Terminology (--cyber-left-scale): scales only the LEFT chrome strip, not canvas / “camera” zoom.
 * Lower values = narrower strip = wider main area; with a fixed pixel grid there, more cells = feels “further out”.
 *
 * Window sizing — proportionalChrome (default): left column keeps a fixed share of vw (sidebar vs main
 * stay proportional when shrinking). Alternative: proportionalChrome false → fit via minMainWidth.
 * Without arrow tuning: autoBaseline from fit (with proportional, already includes autoRelativeToFit).
 * With arrows (optional installArrowZoom): zoom = min(desired, fit), except viewportOnlyZoom — then always fit only.
 * clearManualZoom() clears manual target; configure({ viewportOnlyZoom: true }) disables arrow tuning.
 *
 * Window sizes: press P to open a menu (5 presets: desktop, iPad portrait/landscape, phone portrait/landscape).
 * resizeTo when allowed; sized popup otherwise. noopener is omitted on programmatic open so
 * window.open returns a real reference. Preset skip uses a tight px tolerance so “almost” sizes still open a popup.
 *
 * Load only where desired (e.g. template_minimal.html).
 *
 * Zoom bounds: DEFAULT_MIN … DEFAULT_MAX (arrows / setScale); fit capped upward by DEFAULT_MAX; optional clamp: false → SAFETY_*.
 * Collapsed sidebar: --cyber-left-natural-w switches to rail-only width; fit scale is derived from expanded chrome so --cyber-left-scale does not jump when toggling SB (same mini-rail ZF).
 */
(function () {
    'use strict';

    // Chrome's own menu (save image, copy image, inspect ...) never comes up in a lab: a right click or a long
    // press on the touch board opened it over the canvas (Doc, 28.09.2026: "das dumme Menu von Chrome ... unbedingt
    // überschreiben (nix)"; the decks do the same in decks/deck.js). Here: every page with the lab shell. A lab's own
    // menus (right click on a canvas, the name panel ...) still open; text fields keep theirs, to paste.
    window.addEventListener('contextmenu', function (e) {
        if (e.target.closest && e.target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return;
        e.preventDefault();
    });

    /**
     * The middle dot "·" (and ⋅ ∙) is always a round one from Times New Roman, in every lab with this shell (Doc,
     * 04.11.2026: "Ich möchte damit immer Punkte sehen. Mit Times New Roman"; 12.11.2026, token-lab "·ist": "macht bitte
     * Punkte immer Times (rund)") - Orbitron and Raleway draw it as a small square. The decks do it with 'Deck Punkt' in
     * deck.css; the labs have no shared font stack, so every web font face of the page gets a twin with the same family,
     * weight and style that holds only these three characters from Times. Added through document.fonts, the twin comes
     * after the CSS faces and wins for them; same descriptors, so no weight or other letter changes. Monospace faces
     * keep their own dot (columns), KaTeX keeps its own (formulas).
     */
    var DOTS = 'U+00B7, U+22C5, U+2219';
    var _dotTwins = {};
    function roundDots() {
        if (!document.fonts || typeof FontFace === 'undefined') return;
        var faces = [];
        document.fonts.forEach(function (f) { faces.push(f); });
        faces.forEach(function (f) {
            var fam = String(f.family || '').replace(/^["']|["']$/g, '');
            if (!fam || f.unicodeRange === DOTS || /^KaTeX|Mono|^Lab Ziffern$|^Deck Punkt$|Times/i.test(fam)) return;
            var key = fam + '|' + f.weight + '|' + f.style + '|' + f.stretch;
            if (_dotTwins[key]) return;
            _dotTwins[key] = true;
            var bold = (parseInt(String(f.weight), 10) || 400) >= 600;
            var src = bold ? "local('Times New Roman Bold'), local('TimesNewRomanPS-BoldMT'), local('Times Bold')"
                : "local('Times New Roman'), local('TimesNewRomanPSMT'), local('Times')";
            try {
                var twin = new FontFace(fam, src, { weight: f.weight, style: f.style, stretch: f.stretch, unicodeRange: DOTS });
                document.fonts.add(twin);
                twin.load().catch(function () {});
            } catch (e) { /* a face this browser cannot copy: its own dot stays */ }
        });
    }
    roundDots();
    document.addEventListener('DOMContentLoaded', roundDots);
    window.addEventListener('load', roundDots);

    /**
     * Lab shown on a deck slide (iframe inside .labframe, also in the presenter view clones):
     * the mini-rail is always gone there (Doc, 17.09.2026) - the deck has its own navigation.
     * The rail column collapses to 0 and the sidebar sits flush at the left edge.
     * The coach box rides the sidebar's scale there: its text is a fixed 16 px, and once the lab takes the
     * whole slide the narrower frame shrinks the sidebar - the coach looked far too big (Doc, 17.09.2026).
     */
    var IN_DECK = (function () {
        try {
            var f = window.frameElement;
            return !!(f && f.closest && f.closest('.labframe'));
        } catch (e) {
            return false; // cross-origin parent: not one of our decks
        }
    })();

    function applyDeckLayout() {
        if (!IN_DECK) return;
        var root = document.documentElement;
        root.classList.add('cyber-in-deck');
        root.style.setProperty('--cyber-rail-w', '0px');
        var rail = document.getElementById('mini-rail');
        if (rail) rail.style.setProperty('display', 'none', 'important');
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.setProperty('margin-left', '0', 'important'); // no rail border to overlap
        var coach = document.getElementById('math-coach-box');
        if (coach) coach.style.setProperty('zoom', 'var(--cyber-left-scale, 1)');
    }
    applyDeckLayout();

    /**
     * Natural widths come from CSS custom properties defined in
     * cyber-lab-overrides.css (:root): --cyber-rail-w, --cyber-sidebar-w.
     * We read them live so resizing the sidebar centrally propagates here
     * without touching this file.
     */
    function _cssPx(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        var n = parseFloat(v);
        return Number.isFinite(n) && n > 0 ? n : fallback;
    }
    function getRailWidth() {
        return IN_DECK ? 0 : _cssPx('--cyber-rail-w', 66);
    }
    function getNaturalExpanded() {
        return getRailWidth() + _cssPx('--cyber-sidebar-w', 356);
    }
    /** Rail-only width when SB collapsed — same rail track as expanded chrome (single --cyber-left-scale applies to both). */
    function getNaturalCollapsed() {
        return getRailWidth();
    }
    /**
     * Upper bound for the auto-fit scale: ensures the inner transform-scaled
     * chrome never renders wider than --cyber-left-cap (otherwise it would
     * be clipped by the outer overflow:hidden when cap < natural).
     */
    function getMaxAutoScale() {
        var cap = _cssPx('--cyber-left-cap', 472);
        var natural = getNaturalExpanded();
        if (!(natural > 0)) return 1.0;
        return Math.min(1.0, cap / natural);
    }

    var DEFAULT_MIN = 0.48;
    var DEFAULT_MAX = 1.12; // Caps left chrome at --cyber-left-cap on big windows
    var SAFETY_MIN = 0.05;
    var SAFETY_MAX = 1.12; // Hard cap — prevents any code path (manual zoom, etc.) from growing beyond --cyber-left-cap

    /**
     * proportionalChrome: left width ≈ vw × leftViewportFraction × autoRelativeToFit.
     * Higher values = wider chrome = narrower main area (grid feels less “mini”).
     */
    var CONFIG = {
        minMainWidth: 400,
        autoRelativeToFit: 0.68,
        proportionalChrome: true,
        leftViewportFractionExpanded: 0.33,
        leftViewportFractionCollapsed: 0.102,
        /** true: auto fit only — no manual zoom layer (stable proportion). */
        viewportOnlyZoom: false,
    };

    /** null = always window-fit only; else target scale (clamped to fit when window is narrow). */
    var _manualDesiredScale = null;

    var _resizeRaf = null;

    /** Width available for proportional chrome math (respects pinch-zoom when supported). */
    function layoutViewportWidth() {
        var vv = window.visualViewport;
        if (vv && vv.width > 0) return vv.width;
        return window.innerWidth || document.documentElement.clientWidth || 1024;
    }

    function syncNaturalWidth() {
        var panel = document.getElementById('side-panel');
        if (!panel || !document.getElementById('cyber-left-chrome')) return;
        var collapsed = panel.classList.contains('collapsed');
        document.documentElement.style.setProperty(
            '--cyber-left-natural-w',
            (collapsed ? getNaturalCollapsed() : getNaturalExpanded()) + 'px'
        );
    }

    /**
     * Fit scale for chrome transform. Uses expanded chrome width + expanded viewport fraction always,
     * so collapsing SB does not change --cyber-left-scale (mini-rail stays same apparent size).
     */
    function getFitScale() {
        var vw = layoutViewportWidth();

        var raw;
        if (CONFIG.proportionalChrome) {
            var frac = CONFIG.leftViewportFractionExpanded;
            if (frac == null || !Number.isFinite(frac)) frac = 0.3;
            frac = Math.min(0.48, Math.max(0.04, frac));
            var rel = CONFIG.autoRelativeToFit;
            if (!Number.isFinite(rel) || rel <= 0) rel = 1;
            rel = Math.min(1, Math.max(0.35, rel));
            raw = (vw * frac * rel) / getNaturalExpanded();
        } else {
            var avail = vw - CONFIG.minMainWidth;
            if (avail < 80) avail = 80;
            raw = avail / getNaturalExpanded();
        }
        // Upper cap = cap / natural (≤ 1.0) — keeps rendered chrome ≤ --cyber-left-cap on big windows.
        return Math.min(getMaxAutoScale(), Math.max(SAFETY_MIN, raw));
    }

    function publishResolvedScale() {
        if (!document.getElementById('cyber-left-chrome')) return;
        syncNaturalWidth();
        var fit = getFitScale();
        var autoBaseline;
        if (CONFIG.proportionalChrome) {
            autoBaseline = fit;
        } else {
            var rel = CONFIG.autoRelativeToFit;
            if (!Number.isFinite(rel) || rel <= 0) rel = 1;
            rel = Math.min(1, Math.max(0.35, rel));
            autoBaseline = fit * rel;
        }
        var s =
            CONFIG.viewportOnlyZoom || _manualDesiredScale == null
                ? autoBaseline
                : Math.min(_manualDesiredScale, fit);
        // narrow screen: the chrome is a drawer over the lab, as large as the width allows (see installDrawer)
        if (isDrawerMode()) s = getDrawerScale();
        s = Math.min(SAFETY_MAX, Math.max(SAFETY_MIN, s));
        document.documentElement.style.setProperty('--cyber-left-scale', String(s));
        window.dispatchEvent(
            new CustomEvent('cyber-left-chrome-zoom', {
                detail: {
                    scale: s,
                    fitScale: fit,
                    autoBaseline: autoBaseline,
                    manual: _manualDesiredScale,
                },
            })
        );
    }

    function scheduleViewportReflow() {
        if (_resizeRaf != null) return;
        _resizeRaf = requestAnimationFrame(function () {
            _resizeRaf = null;
            publishResolvedScale();
        });
    }

    /**
     * Narrow screens - a phone upright, or held across (width ≤ 700 px or height ≤ 480 px): the lab takes the whole
     * width and the left chrome (mini-rail + side panel) becomes a drawer behind one ☰ button top left, at a readable
     * size (Doc, 12.11.2026: "auch den zweiten Punkt kann sie gerne so machen"). Until then the chrome shrank with the
     * window: at 390 px to a fifth of its size, 88 px wide, its buttons 11 px. Laptop and beamer stay as they were; a lab
     * on a deck slide (IN_DECK) never gets the drawer. The layout switch itself is CSS (@media below), so a lab's own
     * resize handler already measures the new stage; JS adds the button, the open state and the drawer's scale.
     */
    var NARROW_MQ = '(max-width: 700px), (max-height: 480px)';
    var DRAWER_GAP = 56; // px of the lab left visible right of the open drawer - a tap there closes it
    var _narrowMql = null;

    function isDrawerMode() {
        return !!_narrowMql && _narrowMql.matches && document.documentElement.classList.contains('cyber-drawer');
    }

    /** Drawer scale: rail + panel fill the width up to DRAWER_GAP, never wider than the desktop cap. */
    function getDrawerScale() {
        var vw = document.documentElement.clientWidth || window.innerWidth || 390; // layout viewport: pinch zoom leaves it
        return Math.min(getMaxAutoScale(), (vw - DRAWER_GAP) / getNaturalExpanded());
    }

    var DRAWER_CSS =
        '.cyber-drawer-btn{display:none;position:fixed;z-index:2102;top:max(14px,env(safe-area-inset-top));' +
        'left:max(7px,env(safe-area-inset-left));width:48px;height:48px;margin:0;padding:0;align-items:center;' +
        'justify-content:center;color:#fff;background:rgba(15,23,42,.85);border:1px solid rgba(0,210,255,.3);' +
        'border-radius:6px;box-shadow:0 4px 15px rgba(0,0,0,.4);cursor:pointer;touch-action:manipulation;' +
        '-webkit-tap-highlight-color:transparent}' +
        '.cyber-drawer-btn svg{width:26px;height:26px;stroke-width:1.5;filter:drop-shadow(0 0 5px rgba(0,210,255,.3))}' +
        '.cyber-drawer-btn .ico-close,html.cyber-drawer-open .cyber-drawer-btn .ico-menu{display:none}' +
        'html.cyber-drawer-open .cyber-drawer-btn .ico-close{display:block}' +
        '.cyber-drawer-scrim{position:fixed;inset:0;z-index:2099;background:rgba(0,0,10,.5);opacity:0;visibility:hidden;' +
        'transition:opacity .28s,visibility 0s linear .28s}' +
        '@media ' + NARROW_MQ + '{' +
        'html.cyber-drawer body.cyber-shell-grid{grid-template-columns:0 minmax(0,1fr)!important;' +
        'grid-template-rows:minmax(0,100vh)!important;grid-template-rows:minmax(0,100dvh)!important;' +
        'height:100vh!important;height:100dvh!important;max-height:100vh!important;max-height:100dvh!important}' +
        // a lab with the optional right rail keeps its third column
        'html.cyber-drawer body.cyber-shell-grid:has(>#right-rail){grid-template-columns:0 minmax(0,1fr) ' +
        'calc(var(--cyber-rail-w) * min(var(--cyber-left-scale,1),1.12))!important}' +
        // the stage is always the second column here - also over a lab's own old narrow rule (mandelbrot: row 2 at ≤ 560 px)
        'html.cyber-drawer body.cyber-shell-grid>#main-content{grid-column:2!important;grid-row:1!important;' +
        'height:100vh!important;height:100dvh!important}' +
        'html.cyber-drawer body.cyber-shell-grid>#cyber-left-chrome{position:fixed!important;top:0;left:0;' +
        'height:100vh;height:100dvh;transform:translateX(-100%);visibility:hidden;' +
        'transition:transform .28s cubic-bezier(.16,1,.3,1),visibility 0s linear .28s}' +
        'html.cyber-drawer.cyber-drawer-open body.cyber-shell-grid>#cyber-left-chrome{transform:none;visibility:visible;' +
        'box-shadow:0 0 40px rgba(0,0,0,.6);transition:transform .28s cubic-bezier(.16,1,.3,1)}' +
        'html.cyber-drawer body.cyber-shell-grid #cyber-left-chrome-inner{' +
        'height:calc(100dvh / min(var(--cyber-left-scale,1),1.12))}' +
        'html.cyber-drawer .cyber-drawer-btn{display:flex}' +
        'html.cyber-drawer.cyber-drawer-open .cyber-drawer-scrim{opacity:1;visibility:visible;transition:opacity .28s}' +
        // the coach box sat top left where the button is now: it moves down under it
        'html.cyber-drawer #math-coach-box{top:72px}' +
        '}' +
        '@media (prefers-reduced-motion:reduce){html.cyber-drawer body.cyber-shell-grid>#cyber-left-chrome,' +
        '.cyber-drawer-scrim{transition:none!important}}';

    var ICON_MENU =
        '<svg class="ico-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
        '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    var ICON_CLOSE =
        '<svg class="ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
        '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

    function setDrawer(open) {
        var root = document.documentElement;
        var btn = document.querySelector('.cyber-drawer-btn');
        var chrome = document.getElementById('cyber-left-chrome');
        open = !!open && isDrawerMode();
        if (open) {
            // in the drawer the side panel is always open: the drawer itself is what folds away
            var panel = document.getElementById('side-panel');
            if (panel && panel.classList.contains('collapsed')) panel.classList.remove('collapsed');
            publishResolvedScale();
        } else if (chrome && document.activeElement && chrome.contains(document.activeElement) && btn) {
            btn.focus(); // focus must not stay inside a hidden drawer
        }
        root.classList.toggle('cyber-drawer-open', open);
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    /** A page that hides the whole chrome itself (?widget of token-lab, wortvorhersage ...) gets no button either. */
    function syncDrawerButton() {
        var btn = document.querySelector('.cyber-drawer-btn');
        var chrome = document.getElementById('cyber-left-chrome');
        if (!btn || !chrome) return;
        btn.style.visibility = getComputedStyle(chrome).display === 'none' ? 'hidden' : '';
    }

    function installDrawer() {
        if (IN_DECK || document.querySelector('.cyber-drawer-btn') || !window.matchMedia) return;
        var root = document.documentElement;
        var style = document.createElement('style');
        style.id = 'cyber-drawer-css';
        style.textContent = DRAWER_CSS;
        document.head.appendChild(style);
        root.classList.add('cyber-drawer');
        _narrowMql = window.matchMedia(NARROW_MQ);

        var railToggle = document.querySelector('#mini-rail .nav-btn[onclick*="toggleSidebar"]');
        var label = (railToggle && railToggle.getAttribute('title')) || 'Menü';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cyber-drawer-btn';
        btn.title = label;
        btn.setAttribute('aria-label', label);
        btn.setAttribute('aria-controls', 'cyber-left-chrome');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = ICON_MENU + ICON_CLOSE;
        btn.addEventListener('click', function () {
            setDrawer(!root.classList.contains('cyber-drawer-open'));
        });
        var scrim = document.createElement('div');
        scrim.className = 'cyber-drawer-scrim';
        scrim.addEventListener('click', function () {
            setDrawer(false);
        });
        document.body.appendChild(scrim);
        document.body.appendChild(btn);

        // the rail's own ☰ would fold the panel inside the drawer: in drawer mode it closes the drawer instead
        window.addEventListener('click', function (e) {
            if (!isDrawerMode() || !e.target.closest) return;
            if (!e.target.closest('#mini-rail .nav-btn[onclick*="toggleSidebar"]')) return;
            e.stopPropagation();
            e.preventDefault();
            setDrawer(false);
        }, true);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && root.classList.contains('cyber-drawer-open')) setDrawer(false);
        });
        var onChange = function () {
            if (!_narrowMql.matches) setDrawer(false);
            publishResolvedScale();
            syncDrawerButton();
        };
        if (_narrowMql.addEventListener) _narrowMql.addEventListener('change', onChange);
        else if (_narrowMql.addListener) _narrowMql.addListener(onChange);
        window.addEventListener('load', syncDrawerButton);
        syncDrawerButton();
    }

    function wrapChrome() {
        var rail = document.getElementById('mini-rail');
        var panel = document.getElementById('side-panel');
        if (!rail || !panel || document.getElementById('cyber-left-chrome')) return false;
        applyDeckLayout(); // script loaded before the markup: rail/panel only exist now

        var outer = document.createElement('div');
        outer.id = 'cyber-left-chrome';
        var inner = document.createElement('div');
        inner.id = 'cyber-left-chrome-inner';

        rail.parentNode.insertBefore(outer, rail);
        outer.appendChild(inner);
        inner.appendChild(rail);
        inner.appendChild(panel);

        document.body.classList.add('cyber-shell-grid');
        _manualDesiredScale = null;

        var mo = new MutationObserver(function () {
            publishResolvedScale();
        });
        mo.observe(panel, { attributes: true, attributeFilter: ['class'] });

        window.addEventListener('resize', scheduleViewportReflow);
        window.addEventListener('orientationchange', function () {
            setTimeout(publishResolvedScale, 180);
        });
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', scheduleViewportReflow);
        }

        installDrawer();
        publishResolvedScale();

        return true;
    }

    var _windowPresetsInstalled = false;
    var MENU_ID = 'cyber-window-size-menu-root';

    /** Five outer-window targets (menu + applyWindowSizePreset). */
    var WINDOW_SIZE_MENU_ITEMS = [
        { w: 1400, h: 900, title: 'Desktop' },
        { w: 1080, h: 1440, title: 'iPad Hochformat' },
        /** 12.9" iPad Pro logical landscape; fits common laptop availHeight better than 1440×1080. */
        { w: 1366, h: 1024, title: 'iPad Querformat' },
        { w: 390, h: 844, title: 'Phone Hochformat' },
        { w: 844, h: 390, title: 'Phone Querformat' },
    ];

    function closeWindowSizeMenu() {
        var el = document.getElementById(MENU_ID);
        if (el) el.remove();
    }

    function openWindowSizeMenu() {
        closeWindowSizeMenu();
        var root = document.createElement('div');
        root.id = MENU_ID;
        root.style.cssText =
            'position:fixed;inset:0;z-index:2147483645;background:rgba(5,11,24,0.75);' +
            'display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';

        var card = document.createElement('div');
        card.style.cssText =
            'max-width:420px;width:100%;background:rgba(15,23,42,0.96);' +
            'border:1px solid rgba(0,210,255,0.45);border-radius:14px;padding:18px 20px;' +
            'box-shadow:0 20px 60px rgba(0,0,0,0.55);font-family:Orbitron,system-ui,sans-serif;';
        card.addEventListener('click', function (ev) {
            ev.stopPropagation();
        });

        var head = document.createElement('div');
        head.textContent = 'Fenstergröße';
        head.style.cssText =
            'font-size:0.75rem;letter-spacing:0.12em;color:rgba(0,210,255,0.95);' +
            'margin-bottom:10px;text-transform:uppercase;';

        var sub = document.createElement('div');
        sub.textContent = 'P oder Esc schließen';
        sub.style.cssText = 'font-size:0.62rem;color:rgba(255,255,255,0.42);margin-bottom:16px;';

        card.appendChild(head);
        card.appendChild(sub);

        WINDOW_SIZE_MENU_ITEMS.forEach(function (item) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.style.cssText =
                'display:block;width:100%;text-align:left;margin-bottom:10px;padding:12px 14px;' +
                'border-radius:10px;border:1px solid rgba(0,210,255,0.28);' +
                'background:rgba(0,210,255,0.07);color:#e2e8f0;cursor:pointer;font-family:inherit;';
            var t0 = document.createElement('strong');
            t0.style.color = '#00d2ff';
            t0.style.fontSize = '0.8rem';
            t0.textContent = item.title;
            var t1 = document.createElement('div');
            t1.style.opacity = '0.88';
            t1.style.fontSize = '0.72rem';
            t1.style.marginTop = '4px';
            t1.textContent = item.w + ' × ' + item.h;
            btn.appendChild(t0);
            btn.appendChild(t1);
            btn.addEventListener('click', function () {
                applyWindowSizePreset(item);
                closeWindowSizeMenu();
            });
            card.appendChild(btn);
        });

        root.addEventListener('click', function () {
            closeWindowSizeMenu();
        });
        root.appendChild(card);
        document.body.appendChild(root);
    }

    function toggleWindowSizeMenu() {
        if (document.getElementById(MENU_ID)) closeWindowSizeMenu();
        else openWindowSizeMenu();
    }

    /**
     * Cap outer width/height so window.open / resizeTo stay on screen (e.g. iPad presets vs short availHeight).
     */
    function clampOuterToAvailScreen(width, height) {
        if (!Number.isFinite(width) || !Number.isFinite(height)) {
            return { w: width, h: height };
        }
        var sw = window.screen.availWidth;
        var sh = window.screen.availHeight;
        if (!Number.isFinite(sw) || !Number.isFinite(sh) || sw < 320 || sh < 320) {
            return {
                w: Math.max(200, Math.round(width)),
                h: Math.max(200, Math.round(height)),
            };
        }
        var pad = 8;
        var maxW = Math.max(240, sw - pad);
        var maxH = Math.max(240, sh - pad);
        return {
            w: Math.max(200, Math.min(Math.round(width), maxW)),
            h: Math.max(200, Math.min(Math.round(height), maxH)),
        };
    }

    /**
     * Popup feature string. When omitNoopener is true, noopener/noreferrer are skipped so
     * window.open returns a real Window reference (for reliable null checks after open).
     */
    function buildWindowOpenFeatureString(width, height, minimalPopupUi, omitNoopener) {
        var o = clampOuterToAvailScreen(width, height);
        width = o.w;
        height = o.h;
        var sw = window.screen.availWidth;
        var sh = window.screen.availHeight;
        var left = Math.max(0, Math.round((sw - width) / 2));
        var top = Math.max(0, Math.round((sh - height) / 2));
        var parts = [
            'width=' + width,
            'height=' + height,
            'left=' + left,
            'top=' + top,
        ];
        if (minimalPopupUi) {
            parts.push(
                'popup=yes',
                'menubar=no',
                'toolbar=no',
                'location=no',
                'status=no'
            );
        }
        if (!omitNoopener) {
            parts.push('noopener', 'noreferrer');
        }
        return parts.join(',');
    }

    /** Shown when the browser ignores resizeTo (normal tab / file URL). */
    function showWindowPresetBlockedToast(preset) {
        var id = 'cyber-window-preset-blocked-toast';
        var old = document.getElementById(id);
        if (old) old.remove();

        var wrap = document.createElement('div');
        wrap.id = id;
        wrap.setAttribute('role', 'alert');

        var title = document.createElement('strong');
        title.textContent = 'Fenstergröße blockiert';

        var detail = document.createElement('div');
        detail.style.marginTop = '8px';
        detail.style.fontSize = '13px';
        detail.style.opacity = '0.95';
        detail.style.lineHeight = '1.45';
        detail.textContent =
            'Dieser Tab darf die äußere Größe nicht ändern (resizeTo). Ziel: ' +
            preset.w +
            '×' +
            preset.h +
            '.';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Neues Fenster mit dieser Größe';
        btn.style.cssText =
            'margin-top:14px;padding:10px 16px;font:inherit;font-weight:600;cursor:pointer;border-radius:10px;' +
            'border:2px solid #fecaca;background:#450a0a;color:#fef2f2;width:100%;';

        wrap.appendChild(title);
        wrap.appendChild(detail);
        wrap.appendChild(btn);
        wrap.style.cssText =
            'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(92vw,440px);' +
            'z-index:2147483646;background:#991b1b;border:2px solid #fecaca;color:#fef2f2;padding:18px 22px;' +
            'border-radius:12px;font-family:system-ui,Segoe UI,sans-serif;font-size:15px;' +
            'box-shadow:0 16px 48px rgba(0,0,0,0.5);';

        document.body.appendChild(wrap);

        var hideTimer = setTimeout(function () {
            wrap.style.opacity = '0';
            wrap.style.transition = 'opacity 0.4s ease';
            setTimeout(function () {
                if (wrap.parentNode) wrap.remove();
            }, 420);
        }, 14000);

        btn.addEventListener('click', function () {
            clearTimeout(hideTimer);
            var feat = buildWindowOpenFeatureString(preset.w, preset.h, true, true);
            var opened = window.open(window.location.href, '_blank', feat);
            if (wrap.parentNode) wrap.remove();
            if (!opened) {
                alert(
                    'Popup wurde blockiert. In der Adresszeiste Pop-ups für diese Seite erlauben.'
                );
            }
        });
    }

    function applyWindowSizePreset(p) {
        if (!p || !Number.isFinite(p.w) || !Number.isFinite(p.h)) return;
        /** Tight: a loose match (e.g. 800×400 vs 844×390) must still open a sized popup. */
        var skipIfAlreadyTol = 10;
        var outer = clampOuterToAvailScreen(p.w, p.h);
        var owBefore = window.outerWidth;
        var ohBefore = window.outerHeight;
        if (
            Math.abs(owBefore - outer.w) <= skipIfAlreadyTol &&
            Math.abs(ohBefore - outer.h) <= skipIfAlreadyTol
        ) {
            setTimeout(function () {
                window.dispatchEvent(new Event('resize'));
                publishResolvedScale();
            }, 100);
            return;
        }

        // Open before resizeTo: resize/move can consume transient user activation; noopener
        // would make window.open return null even when a window opened.
        var feat0 = buildWindowOpenFeatureString(p.w, p.h, true, true);
        var openedPopup = window.open(window.location.href, '_blank', feat0);

        try {
            window.resizeTo(outer.w, outer.h);
            var nw = window.outerWidth;
            var nh = window.outerHeight;
            var left = Math.max(0, Math.round((window.screen.availWidth - nw) / 2));
            var top = Math.max(0, Math.round((window.screen.availHeight - nh) / 2));
            try {
                window.moveTo(left, top);
            } catch (_) {}
        } catch (_) {}

        if (!openedPopup) {
            showWindowPresetBlockedToast(p);
        }

        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
            publishResolvedScale();
        }, 100);
    }

    /** Block real text entry only — not input[type=range] (slider focus). */
    function isTextEntryTarget(el) {
        if (!el || typeof el.closest !== 'function') return false;
        if (el.closest('textarea, select, [contenteditable="true"]')) return true;
        var inp = el.closest('input');
        if (!inp) return false;
        var typ = (inp.type || '').toLowerCase();
        if (
            typ === 'range' ||
            typ === 'checkbox' ||
            typ === 'radio' ||
            typ === 'button' ||
            typ === 'submit' ||
            typ === 'reset' ||
            typ === 'file' ||
            typ === 'color' ||
            typ === 'hidden'
        )
            return false;
        return true;
    }

    function onWindowPresetKeydown(e) {
        if (!document.getElementById('cyber-left-chrome')) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        if (document.getElementById(MENU_ID)) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeWindowSizeMenu();
                return;
            }
        }

        if (isTextEntryTarget(e.target)) return;

        if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            toggleWindowSizeMenu();
        }
    }

    function installWindowSizePresets() {
        if (_windowPresetsInstalled) return;
        _windowPresetsInstalled = true;
        document.addEventListener('keydown', onWindowPresetKeydown, true);
    }

    function boot() {
        wrapChrome();
        if (document.getElementById('cyber-left-chrome')) {
            installWindowSizePresets();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    /** Retry wrap + window menu installer after full load (late scripts / unusual parse order). */
    function bootOnLoad() {
        wrapChrome();
        if (document.getElementById('cyber-left-chrome')) {
            installWindowSizePresets();
        }
    }
    window.addEventListener('load', bootOnLoad);

    function getScale() {
        var raw = getComputedStyle(document.documentElement).getPropertyValue('--cyber-left-scale').trim();
        var n = parseFloat(raw);
        return Number.isFinite(n) ? n : 1;
    }

    /**
     * Sets manual desired zoom (clamped to current fit).
     * opts.followViewportOnly: true → clear manual, window fit only.
     */
    function setScale(v, opts) {
        opts = opts || {};
        if (opts.followViewportOnly === true) {
            _manualDesiredScale = null;
            publishResolvedScale();
            return getScale();
        }

        if (CONFIG.viewportOnlyZoom) {
            publishResolvedScale();
            return getScale();
        }

        var s = Number(v);
        if (!Number.isFinite(s)) return getScale();

        if (opts.clamp === false) {
            s = Math.min(SAFETY_MAX, Math.max(SAFETY_MIN, s));
        } else {
            var min = opts.min != null ? opts.min : DEFAULT_MIN;
            var max = opts.max != null ? opts.max : DEFAULT_MAX;
            s = Math.min(max, Math.max(min, s));
        }

        _manualDesiredScale = s;
        publishResolvedScale();
        return getScale();
    }

    function clearManualZoom() {
        _manualDesiredScale = null;
        publishResolvedScale();
    }

    function configure(o) {
        if (!o) return;
        if (o.minMainWidth != null) {
            CONFIG.minMainWidth = Math.max(200, Number(o.minMainWidth) || CONFIG.minMainWidth);
        }
        if (o.autoRelativeToFit != null) {
            var ar = Number(o.autoRelativeToFit);
            if (Number.isFinite(ar)) {
                CONFIG.autoRelativeToFit = Math.min(1, Math.max(0.35, ar));
            }
        }
        if (o.proportionalChrome != null) CONFIG.proportionalChrome = !!o.proportionalChrome;
        if (o.leftViewportFractionExpanded != null) {
            var fe = Number(o.leftViewportFractionExpanded);
            if (Number.isFinite(fe)) {
                CONFIG.leftViewportFractionExpanded = Math.min(0.48, Math.max(0.05, fe));
            }
        }
        if (o.leftViewportFractionCollapsed != null) {
            var fc = Number(o.leftViewportFractionCollapsed);
            if (Number.isFinite(fc)) {
                CONFIG.leftViewportFractionCollapsed = Math.min(0.35, Math.max(0.03, fc));
            }
        }
        if (o.viewportOnlyZoom != null) {
            CONFIG.viewportOnlyZoom = !!o.viewportOnlyZoom;
            if (CONFIG.viewportOnlyZoom) _manualDesiredScale = null;
        }
        publishResolvedScale();
    }

    /**
     * ↑ zoom in, ↓ zoom out. Optional ←→ with opts.horizontalSteps.
     */
    function installArrowZoom(opts) {
        opts = opts || {};
        if (CONFIG.viewportOnlyZoom) {
            return function noopUninstall() {};
        }
        var step = opts.step != null ? opts.step : 0.06;
        var fine = opts.fine != null ? opts.fine : step * 0.5;
        var min = opts.min != null ? opts.min : DEFAULT_MIN;
        var max = opts.max != null ? opts.max : DEFAULT_MAX;
        var clampOpt =
            opts.clamp === false ? { clamp: false } : { min: min, max: max };
        var horizontal = !!opts.horizontalSteps;

        function onKey(e) {
            if (!document.getElementById('cyber-left-chrome')) return;
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (isTextEntryTarget(e.target)) return;

            var delta = 0;
            if (e.key === 'ArrowUp') delta = step;
            else if (e.key === 'ArrowDown') delta = -step;
            else if (horizontal && e.key === 'ArrowRight') delta = fine;
            else if (horizontal && e.key === 'ArrowLeft') delta = -fine;
            else return;

            e.preventDefault();
            setScale(getScale() + delta, clampOpt);
        }

        document.addEventListener('keydown', onKey);
        return function uninstall() {
            document.removeEventListener('keydown', onKey);
        };
    }

    window.CyberLeftChrome = {
        syncNaturalWidth: syncNaturalWidth,
        getFitScale: getFitScale,
        getScale: getScale,
        setScale: setScale,
        clearManualZoom: clearManualZoom,
        configure: configure,
        publishResolvedScale: publishResolvedScale,
        installArrowZoom: installArrowZoom,
        installWindowSizePresets: installWindowSizePresets,
        applyWindowSizePreset: applyWindowSizePreset,
        openWindowSizeMenu: openWindowSizeMenu,
        closeWindowSizeMenu: closeWindowSizeMenu,
        toggleWindowSizeMenu: toggleWindowSizeMenu,
    };
})();
