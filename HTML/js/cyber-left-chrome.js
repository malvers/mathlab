/**
 * Mini-Rail + #side-panel in einen gemeinsamen Zoom-Container (#cyber-left-chrome).
 * Aktiviert body.cyber-shell-grid — Styles in cyber-lab-overrides.css.
 *
 * Begriffsklarstellung (--cyber-left-scale): Nur SKALIERUNG der LINKEN CHROME-Leiste, nicht Canvas-/„Kamera“-Zoom.
 * Kleinere Werte = schmalere Leiste = breitere Hauptfläche; bei festem Pixel-Raster dort oft „mehr Maschen“ = wirkt weiter draußen.
 *
 * Fenstergröße — proportionalChrome (Standard): linke Spalte hat festen Anteil von vw (Sidebar vs. Hauptbereich
 * bleiben beim Verkleinern gleich proportional). Alternative: proportionalChrome false → Fit über minMainWidth.
 * Ohne Pfeilanpassung: autoBaseline aus Fit (bei proportional bereits inkl. autoRelativeToFit).
 * Mit Pfeilen (optional installArrowZoom): Zoom = min(Wunsch, Fit), außer viewportOnlyZoom — dann immer nur Fit.
 * clearManualZoom() löscht manuellen Wunsch; configure({ viewportOnlyZoom: true }) verhindert Pfeilanpassung.
 *
 * Nur laden wo gewünscht (z. B. template.html).
 *
 * Zoom-Grenzen: DEFAULT_MIN … DEFAULT_MAX (Pfeile / setScale); Fit nach oben mit DEFAULT_MAX begrenzt; optional clamp: false → SAFETY_*.
 */
(function () {
    'use strict';

    var NATURAL_EXPANDED = 66 + 350;
    var NATURAL_COLLAPSED = 66;

    var DEFAULT_MIN = 0.48;
    var DEFAULT_MAX = 1.35;
    var SAFETY_MIN = 0.05;
    var SAFETY_MAX = 10;

    /**
     * proportionalChrome: linke Breite ≈ vw × leftViewportFraction × autoRelativeToFit.
     * Höhere Werte = breitere Chrome = schmalerer Hauptbereich (Raster wirkt weniger „Mini-Maschen“).
     */
    var CONFIG = {
        minMainWidth: 400,
        autoRelativeToFit: 0.68,
        proportionalChrome: true,
        leftViewportFractionExpanded: 0.33,
        leftViewportFractionCollapsed: 0.102,
        /** true: immer nur automatischer Fit — keine manuelle Zoomschicht (proportion stabil). */
        viewportOnlyZoom: false,
    };

    /** null = immer nur Fit der Fenstergröße; sonst Zielscale (wird bei schmalem Fenster auf Fit begrenzt) */
    var _manualDesiredScale = null;

    var _resizeRaf = null;

    function syncNaturalWidth() {
        var panel = document.getElementById('side-panel');
        if (!panel || !document.getElementById('cyber-left-chrome')) return;
        var collapsed = panel.classList.contains('collapsed');
        document.documentElement.style.setProperty(
            '--cyber-left-natural-w',
            (collapsed ? NATURAL_COLLAPSED : NATURAL_EXPANDED) + 'px'
        );
    }

    /** Fit-Skalierung für automatischen Zoom (Anteil vw oder klassische Reserve). */
    function getFitScale() {
        var panel = document.getElementById('side-panel');
        var collapsed = panel && panel.classList.contains('collapsed');
        var natural = collapsed ? NATURAL_COLLAPSED : NATURAL_EXPANDED;
        var vw = window.innerWidth || document.documentElement.clientWidth || 1024;

        var raw;
        if (CONFIG.proportionalChrome) {
            var frac = collapsed
                ? CONFIG.leftViewportFractionCollapsed
                : CONFIG.leftViewportFractionExpanded;
            if (frac == null || !Number.isFinite(frac)) frac = collapsed ? 0.09 : 0.3;
            frac = Math.min(0.48, Math.max(0.04, frac));
            var rel = CONFIG.autoRelativeToFit;
            if (!Number.isFinite(rel) || rel <= 0) rel = 1;
            rel = Math.min(1, Math.max(0.35, rel));
            raw = (vw * frac * rel) / natural;
        } else {
            var avail = vw - CONFIG.minMainWidth;
            if (avail < 80) avail = 80;
            raw = avail / natural;
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

        publishResolvedScale();

        return true;
    }

    function boot() {
        wrapChrome();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function getScale() {
        var raw = getComputedStyle(document.documentElement).getPropertyValue('--cyber-left-scale').trim();
        var n = parseFloat(raw);
        return Number.isFinite(n) ? n : 1;
    }

    /**
     * Setzt manuellen Wunsch-Zoom (wird gegen aktuellen Fit begrenzt).
     * opts.followViewportOnly: true → manual löschen, nur noch Fenster-Fit.
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
     * ↑ Zoom rein, ↓ Zoom raus. Optional ←→ mit opts.horizontalSteps.
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
            var el = e.target;
            if (
                el &&
                el.closest &&
                el.closest('input, textarea, select, [contenteditable="true"]')
            )
                return;

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
    };
})();
