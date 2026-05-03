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
 * Load only where desired (e.g. template.html).
 *
 * Zoom bounds: DEFAULT_MIN … DEFAULT_MAX (arrows / setScale); fit capped upward by DEFAULT_MAX; optional clamp: false → SAFETY_*.
 * Collapsed sidebar: --cyber-left-natural-w switches to rail-only width; fit scale is derived from expanded chrome so --cyber-left-scale does not jump when toggling SB (same mini-rail ZF).
 */
(function () {
    'use strict';

    var NATURAL_EXPANDED = 66 + 350;
    /** Rail-only width when SB collapsed — same 66px track as expanded chrome (single --cyber-left-scale applies to both). */
    var NATURAL_COLLAPSED = 66;

    var DEFAULT_MIN = 0.48;
    var DEFAULT_MAX = 1.35;
    var SAFETY_MIN = 0.05;
    var SAFETY_MAX = 10;

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
            (collapsed ? NATURAL_COLLAPSED : NATURAL_EXPANDED) + 'px'
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
            raw = (vw * frac * rel) / NATURAL_EXPANDED;
        } else {
            var avail = vw - CONFIG.minMainWidth;
            if (avail < 80) avail = 80;
            raw = avail / NATURAL_EXPANDED;
        }
        return Math.min(SAFETY_MAX, Math.max(SAFETY_MIN, Math.min(DEFAULT_MAX, raw)));
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

    function wrapChrome() {
        var rail = document.getElementById('mini-rail');
        var panel = document.getElementById('side-panel');
        if (!rail || !panel || document.getElementById('cyber-left-chrome')) return false;

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

        if (e.key === 'p' || e.key === 'P') {
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
