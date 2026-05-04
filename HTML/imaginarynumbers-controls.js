/**
 * Sidebar + Slider für das Lab imaginarynumbers (nur diese Seite — nicht global).
 *
 * Farben: nur über PALETTE.* (Rollen, keine Farbnamen in Keys), dann applyPaletteCssVars().
 */
(function (global) {
    /**
     * Rollen-basierte Farben — hier Hex ändern, nicht die Keys.
     * VAR_Z: Punkt/Variable z | AXIS_RE: re-Anteil | AXIS_IM: im-Anteil | VAR_R: √z / r-Karte
     */
    const PALETTE = Object.freeze({
        CARD_ACCENT: '#00d2ff',
        VAR_Z: '#ef4444',
        AXIS_RE: '#facc15',
        AXIS_IM: '#22d3ee',
        VAR_R: '#38bdf8',
        TITLE_MUTED: '#e2e8f0',
    });

    /** Etwas dunklere Ränder für Slider-Knöpfe (zu AXIS_RE / AXIS_IM passend). */
    const PALETTE_DIM = Object.freeze({
        AXIS_RE_EDGE: '#a16207',
        AXIS_IM_EDGE: '#0e7490',
    });

    const KATEX_OPTS = Object.freeze({ throwOnError: false, displayMode: false });

    const AXIS_RE_IM = [PALETTE.AXIS_RE, PALETTE.AXIS_IM];

    const Z_SLIDER_DEFS = Object.freeze([
        { label: 're (x)', key: 're', color: PALETTE.AXIS_RE },
        { label: 'im (y)', key: 'im', color: PALETTE.AXIS_IM },
    ]);

    const ROOT_READOUT_CARD_HTML = `
                <div id="cn-r-readout" class="cn-r-readout">
                    <div class="control-header cn-r-row">
                        <span id="cn-r-tex-re" class="cyber-label"></span>
                        <span id="cn-r-val-re" class="val-display"></span>
                    </div>
                    <div class="control-header cn-r-row">
                        <span id="cn-r-tex-im" class="cyber-label"></span>
                        <span id="cn-r-val-im" class="val-display"></span>
                    </div>
                </div>
                `;

    function escapeTexText(s) {
        return String(s)
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');
    }

    /** #RRGGBB → "r, g, b" für CSS rgba(var(--…-rgb), α) */
    function hexToRgbComma(hex) {
        const h = String(hex).replace('#', '');
        if (h.length !== 6) return '0, 0, 0';
        return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ');
    }

    function applyPaletteCssVars() {
        const P = PALETTE;
        const root = document.documentElement;
        const setHexAndRgb = (varName, hex) => {
            root.style.setProperty(varName, hex);
            root.style.setProperty(`${varName}-rgb`, hexToRgbComma(hex));
        };

        setHexAndRgb('--cn-var-z', P.VAR_Z);
        setHexAndRgb('--cn-axis-re', P.AXIS_RE);
        setHexAndRgb('--cn-axis-im', P.AXIS_IM);
        setHexAndRgb('--cn-var-r', P.VAR_R);
        root.style.setProperty('--cn-title-muted', P.TITLE_MUTED);
        root.style.setProperty('--cn-card-accent', P.CARD_ACCENT);
        root.style.setProperty('--cn-axis-re-dim', PALETTE_DIM.AXIS_RE_EDGE);
        root.style.setProperty('--cn-axis-im-dim', PALETTE_DIM.AXIS_IM_EDGE);
        root.style.setProperty('--cn-axis-re-dim-rgb', hexToRgbComma(PALETTE_DIM.AXIS_RE_EDGE));
        root.style.setProperty('--cn-axis-im-dim-rgb', hexToRgbComma(PALETTE_DIM.AXIS_IM_EDGE));
    }

    function texReImPair(reInner, imInner) {
        return [
            `\\textcolor{${PALETTE.AXIS_RE}}{\\mathit{re}\\,(${reInner})}`,
            `\\textcolor{${PALETTE.AXIS_IM}}{\\mathit{im}\\,(${imInner})}`,
        ];
    }

    function sidebarTexLabels() {
        return texReImPair('x', 'y');
    }

    /** r-Teil in VAR_R, Radikand z in VAR_Z */
    function texRSqrtZ() {
        return `\\textcolor{${PALETTE.VAR_R}}{r}\\,{=}\\,\\sqrt{\\textcolor{${PALETTE.VAR_Z}}{z}}`;
    }

    function katexTry(el, tex, fallbackText) {
        if (!el || typeof katex === 'undefined') return;
        el.textContent = '';
        try {
            katex.render(tex, el, KATEX_OPTS);
        } catch (_) {
            el.textContent = fallbackText;
        }
    }

    function katexColoredNumeric(el, colorHex, displayStr) {
        katexTry(
            el,
            `\\textcolor{${colorHex}}{\\text{${escapeTexText(displayStr)}}}`,
            displayStr,
        );
    }

    function katexLabelOnce(el, tex, fallbackText, ver = 'li1') {
        if (!el || typeof katex === 'undefined') return;
        if (el.dataset.cnTexVer === ver) return;
        el.style.fontFamily = 'inherit';
        katexTry(el, tex, fallbackText);
        el.dataset.cnTexVer = ver;
    }

    /** @type {((re: number, im: number) => { re: number; im: number }) | null} */
    let sqrtProviderRef = null;

    function renderTwoColoredValues(elements, colors, displayStrings) {
        elements.forEach((el, i) => {
            if (!el || colors[i] === undefined) return;
            katexColoredNumeric(el, colors[i], displayStrings[i]);
        });
    }

    function renderValDisplays(state, fmtNum) {
        if (typeof katex === 'undefined') return;
        const wrap = document.getElementById('cn-sliders');
        if (!wrap) return;
        const groups = wrap.querySelectorAll('.cyber-control-group');
        const values = Z_SLIDER_DEFS.map((row) => fmtNum(state[row.key]));
        groups.forEach((g, i) => {
            const d = g.querySelector('.val-display');
            if (!d || AXIS_RE_IM[i] === undefined) return;
            katexColoredNumeric(d, AXIS_RE_IM[i], values[i]);
        });
        renderRReadout(state, fmtNum);
    }

    function renderRReadout(state, fmtNum) {
        if (typeof katex === 'undefined' || !sqrtProviderRef) return;
        const mount = document.getElementById('cn-r-readout');
        if (!mount) return;

        const card = mount.closest('.instrument-card');
        const titleHost = card?.querySelector('.instrument-title');
        if (titleHost && titleHost.dataset.cnRTitleVer !== 'v6') {
            katexTry(titleHost, texRSqrtZ(), 'r = √z');
            titleHost.dataset.cnRTitleVer = 'v6';
        }

        const rTex = texReImPair('r', 'r');
        const rFallbacks = ['re (r)', 'im (r)'];
        const labelIds = ['cn-r-tex-re', 'cn-r-tex-im'];
        labelIds.forEach((id, i) => {
            katexLabelOnce(document.getElementById(id), rTex[i], rFallbacks[i], 'li1');
        });

        const w = sqrtProviderRef(state.re, state.im);
        const vals = [fmtNum(w.re), fmtNum(w.im)];
        renderTwoColoredValues(
            [document.getElementById('cn-r-val-re'), document.getElementById('cn-r-val-im')],
            AXIS_RE_IM,
            vals,
        );
    }

    function renderSidebarKatex(state, fmtNum) {
        if (typeof katex === 'undefined') return;
        const card = document.getElementById('cn-sliders')?.closest('.instrument-card');
        const titleHost = card?.querySelector('.instrument-title');
        if (titleHost) {
            titleHost.textContent = '';
            katexTry(
                titleHost,
                `\\textcolor{${PALETTE.VAR_Z}}{z}\\,\\textcolor{${PALETTE.TITLE_MUTED}}{\\in\\,\\mathbb{C}}`,
                'z ∈ ℂ',
            );
        }
        const labelTex = sidebarTexLabels();
        const zFallbacks = ['re (x)', 'im (y)'];
        document.querySelectorAll('#cn-sliders .cyber-label').forEach((el, i) => {
            if (!labelTex[i]) return;
            el.textContent = '';
            el.style.fontFamily = 'inherit';
            katexTry(el, labelTex[i], zFallbacks[i]);
        });
        renderValDisplays(state, fmtNum);
    }

    function bindSliderKatexRefresh(state, fmtNum) {
        const wrap = document.getElementById('cn-sliders');
        if (!wrap) return;
        wrap.querySelectorAll('input.cyber-slider[type="range"]').forEach((inp) => {
            inp.addEventListener('input', () => {
                requestAnimationFrame(() => renderValDisplays(state, fmtNum));
            });
        });
    }

    function setupParameterCard(options) {
        const { state, fmtNum, sliderMin, sliderMax, step, onSliderChange, sqrtProvider } = options;

        if (typeof CyberUI === 'undefined' || typeof CyberUI.createCard !== 'function') return;

        applyPaletteCssVars();

        sqrtProviderRef = typeof sqrtProvider === 'function' ? sqrtProvider : null;

        CyberUI.createCard(
            'ui-container',
            'z ∈ ℂ',
            '<div id="cn-sliders"></div>',
            PALETTE.CARD_ACCENT,
        );

        Z_SLIDER_DEFS.forEach((row) => {
            CyberUI.createSlider(
                'cn-sliders',
                row.label,
                sliderMin,
                sliderMax,
                state[row.key],
                step,
                (v) => {
                    state[row.key] = v;
                    onSliderChange();
                },
                row.color,
            );
        });

        if (sqrtProviderRef) {
            CyberUI.createCard('ui-container', 'r', ROOT_READOUT_CARD_HTML, PALETTE.VAR_R);
        }

        renderSidebarKatex(state, fmtNum);
        bindSliderKatexRefresh(state, fmtNum);
    }

    global.ImaginaryNumbersControls = {
        PALETTE,
        applyPaletteCssVars,
        hexToRgbComma,
        escapeTexText,
        texRSqrtZ,
        renderValDisplays,
        renderSidebarKatex,
        bindSliderKatexRefresh,
        setupParameterCard,
        renderRReadout,
    };
})(typeof window !== 'undefined' ? window : globalThis);
