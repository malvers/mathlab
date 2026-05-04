/**
 * Sidebar für das Lab imaginarynumbers (nur diese Seite — nicht global).
 *
 * Farben: nur über PALETTE.* (Rollen, keine Farbnamen in Keys), dann applyPaletteCssVars().
 */
(function (global) {
    /**
     * Rollen-basierte Farben — hier Hex ändern, nicht die Keys.
     * VAR_Z: Punkt/Variable z | AXIS_RE: re-Anteil | AXIS_IM: im-Anteil | VAR_R: √z / r-Karte
     */
    /* Farben wie Winkel-Diagramm (Stufenwinkel / Scheitelwinkel / Nebenwinkel + Gelb). */
    const PALETTE = Object.freeze({
        CARD_ACCENT: '#00B0F0',
        VAR_Z: '#ED1C24',
        AXIS_RE: '#FFC000',
        AXIS_IM: '#00B0F0',
        VAR_R: '#92D050',
        TITLE_MUTED: '#e2e8f0',
    });

    /** Etwas dunklere Ränder (zu AXIS_RE / AXIS_IM passend). */
    const PALETTE_DIM = Object.freeze({
        AXIS_RE_EDGE: '#B88600',
        AXIS_IM_EDGE: '#0077A3',
    });

    const KATEX_OPTS = Object.freeze({ throwOnError: false, displayMode: false });

    const AXIS_RE_IM = [PALETTE.AXIS_RE, PALETTE.AXIS_IM];

    /** Unter z- und r-Karte (nicht in der z-Karte): KaTeX r = √(z) vs z² (nur einer aktiv). */
    const ROOT_MAP_MODE_HTML = `
                <div id="cn-map-mode" class="cn-map-mode" role="radiogroup" aria-label="Abbildung z nach r">
                    <button type="button" id="cn-map-sqrt" class="cn-map-mode-btn" aria-pressed="true" aria-label="r gleich Wurzel aus z">
                        <span id="cn-map-sqrt-tex" class="cn-map-mode-tex"></span>
                    </button>
                    <button type="button" id="cn-map-sq" class="cn-map-mode-btn" aria-pressed="false" aria-label="z Quadrat">
                        <span id="cn-map-sq-tex" class="cn-map-mode-tex"></span>
                    </button>
                </div>`;

    const ROOT_MAP_MODE_WRAP_HTML = `<div id="cn-map-mode-wrap" class="cn-map-mode-wrap">${ROOT_MAP_MODE_HTML}</div>`;

    const ROOT_Z_READOUT_HTML = `
                <div id="cn-z-readout" class="cn-z-readout">
                    <div class="control-header cn-r-row">
                        <span id="cn-z-tex-re" class="cyber-label"></span>
                        <span id="cn-z-val-re" class="val-display"></span>
                    </div>
                    <div class="control-header cn-r-row">
                        <span id="cn-z-tex-im" class="cyber-label"></span>
                        <span id="cn-z-val-im" class="val-display"></span>
                    </div>
                </div>`;

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
        setHexAndRgb('--cn-title-muted', P.TITLE_MUTED);
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

    /** Nur \\textit{r} und \\textit{z} in Rollenfarben; = und Wurzel neutral (TITLE_MUTED). */
    function texRSqrtZ() {
        return (
            `\\textcolor{${PALETTE.VAR_R}}{r}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{\\sqrt{\\textcolor{${PALETTE.VAR_Z}}{z}}}`
        );
    }

    /** r = z² — Exponent wie = neutral, nur z rot. */
    function texZSquare() {
        return (
            `\\textcolor{${PALETTE.VAR_R}}{r}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
            `\\textcolor{${PALETTE.VAR_Z}}{z}^{\\textcolor{${PALETTE.TITLE_MUTED}}{2}}`
        );
    }

    /** Titelzeile z-Karte wie bisher: z ∈ ℂ */
    function texZInC() {
        return `\\textcolor{${PALETTE.VAR_Z}}{z}\\,\\textcolor{${PALETTE.TITLE_MUTED}}{\\in\\,\\mathbb{C}}`;
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
        renderZReadout(state, fmtNum);
        renderRReadout(state, fmtNum);
    }

    function renderZReadout(state, fmtNum) {
        if (typeof katex === 'undefined') return;
        const mount = document.getElementById('cn-z-readout');
        if (!mount) return;

        const card = mount.closest('.instrument-card');
        const titleHost = card?.querySelector('.instrument-title');
        if (titleHost && titleHost.dataset.cnZTitleVer !== 'v10') {
            katexTry(titleHost, texZInC(), 'z ∈ ℂ');
            titleHost.dataset.cnZTitleVer = 'v10';
        }

        const zTex = texReImPair('z', 'z');
        const zFallbacks = ['re (z)', 'im (z)'];
        const labelIds = ['cn-z-tex-re', 'cn-z-tex-im'];
        labelIds.forEach((id, i) => {
            katexLabelOnce(document.getElementById(id), zTex[i], zFallbacks[i], 'zli1');
        });

        const vals = [fmtNum(state.re), fmtNum(state.im)];
        renderTwoColoredValues(
            [document.getElementById('cn-z-val-re'), document.getElementById('cn-z-val-im')],
            AXIS_RE_IM,
            vals,
        );
    }

    function renderRReadout(state, fmtNum) {
        if (typeof katex === 'undefined' || !sqrtProviderRef) return;
        const mount = document.getElementById('cn-r-readout');
        if (!mount) return;

        const card = mount.closest('.instrument-card');
        const titleHost = card?.querySelector('.instrument-title');
        const titleVer = state.zMapMode === 'square' ? 'sq' : 'sqrt';
        if (titleHost && titleHost.dataset.cnRTitleVer !== titleVer) {
            katexTry(
                titleHost,
                state.zMapMode === 'square' ? texZSquare() : texRSqrtZ(),
                state.zMapMode === 'square' ? 'r = z²' : 'r = √z',
            );
            titleHost.dataset.cnRTitleVer = titleVer;
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
        renderValDisplays(state, fmtNum);
        renderMapModeKatex();
    }

    function renderMapModeKatex() {
        const sqrtEl = document.getElementById('cn-map-sqrt-tex');
        const sqEl = document.getElementById('cn-map-sq-tex');
        if (!sqrtEl || !sqEl) return;
        sqrtEl.textContent = '';
        sqEl.textContent = '';
        katexTry(sqrtEl, texRSqrtZ(), 'r = √(z)');
        katexTry(sqEl, texZSquare(), 'r = z²');
    }

    function setupParameterCard(options) {
        const { state, fmtNum, sqrtProvider } = options;

        if (typeof CyberUI === 'undefined' || typeof CyberUI.createCard !== 'function') return;

        applyPaletteCssVars();

        sqrtProviderRef = typeof sqrtProvider === 'function' ? sqrtProvider : null;

        CyberUI.createCard('ui-container', 'z', ROOT_Z_READOUT_HTML, PALETTE.VAR_Z);

        if (sqrtProviderRef) {
            CyberUI.createCard('ui-container', 'r', ROOT_READOUT_CARD_HTML, PALETTE.VAR_R);
        }

        const uiMount = document.getElementById('ui-container');
        if (uiMount && !document.getElementById('cn-map-mode-wrap')) {
            uiMount.insertAdjacentHTML('beforeend', ROOT_MAP_MODE_WRAP_HTML);
        }

        renderSidebarKatex(state, fmtNum);
    }

    global.ImaginaryNumbersControls = {
        PALETTE,
        applyPaletteCssVars,
        hexToRgbComma,
        escapeTexText,
        texRSqrtZ,
        texZSquare,
        texZInC,
        renderMapModeKatex,
        renderValDisplays,
        renderSidebarKatex,
        setupParameterCard,
        renderZReadout,
        renderRReadout,
    };
})(typeof window !== 'undefined' ? window : globalThis);
