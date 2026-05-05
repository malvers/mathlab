/**
 * Sidebar für das Lab imaginarynumbers (HTML/imaginarynumbers/ — nicht global).
 *
 * Farben: nur über PALETTE.* (Rollen, keine Farbnamen in Keys), dann applyPaletteCssVars().
 */
(function (global) {
    /**
     * Role-based colors — change hex here, not the keys.
     * VAR_Z: Point/Variable z | AXIS_RE: re-part | AXIS_IM: im-part | VAR_R: √z / r-card
     */
    /* Colors like angle diagram (corresponding / vertically opposite / alternate + yellow). */
    const PALETTE = Object.freeze({
        CARD_ACCENT: '#00B0F0',
        VAR_Z: '#ED1C24',
        AXIS_RE: '#FFC000',
        AXIS_IM: '#00B0F0',
        VAR_R: '#92D050',
        VAR_OMEGA: '#B026FF', // Purple for sum
        VAR_DIFF: '#FF8C00', // Orange for difference
        VAR_PRODUCT: '#38D9A9', // Teal for product
        VAR_QUOT: '#E056A0', // Pink for quotient
        TITLE_MUTED: '#e2e8f0',
    });

    /** Slightly darker edges (matching AXIS_RE / AXIS_IM). */
    const PALETTE_DIM = Object.freeze({
        AXIS_RE_EDGE: '#B88600',
        AXIS_IM_EDGE: '#0077A3',
    });

    const KATEX_OPTS = Object.freeze({ throwOnError: false, displayMode: false });

    const AXIS_RE_IM = [PALETTE.AXIS_RE, PALETTE.AXIS_IM];

    /** Below z- and r-card (not in z-card): KaTeX r = √(z) vs z² (only one active). */
    const ROOT_MAP_MODE_HTML = `
                <div id="cn-map-mode" class="cn-map-mode cyber-control-group">
                    <label class="cyber-checkbox-wrapper">
                        <input type="checkbox" id="cn-map-sqrt" class="cyber-checkbox">
                        <span id="cn-map-sqrt-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                    </label>
                    <label class="cyber-checkbox-wrapper">
                        <input type="checkbox" id="cn-map-sq" class="cyber-checkbox">
                        <span id="cn-map-sq-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                    </label>
                </div>`;

    const ROOT_MAP_MODE_WRAP_HTML = `
        <div id="cn-map-mode-wrap" class="cn-map-mode-wrap">
            ${ROOT_MAP_MODE_HTML}

            <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-sum" class="cyber-checkbox"> 
                    <span id="cn-check-sum-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                </label>
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-diff" class="cyber-checkbox"> 
                    <span id="cn-check-diff-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                </label>
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-prod" class="cyber-checkbox"> 
                    <span id="cn-check-prod-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                </label>
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-quot" class="cyber-checkbox"> 
                    <span id="cn-check-quot-tex" class="cyber-label" style="text-transform: none; font-size: 1.4rem;"></span>
                </label>
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-abs" class="cyber-checkbox"> 
                    <span class="cyber-label" style="text-transform: none; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                        <span id="cn-check-abs-math"></span>
                        <span id="cn-check-abs-tex"></span>
                    </span>
                </label>
                <label class="cyber-checkbox-wrapper">
                    <input type="checkbox" id="cn-check-dashed" class="cyber-checkbox"> 
                    <span id="cn-check-dashed-tex" class="cyber-label" style="text-transform: none; font-size: 1.1rem;"></span>
                </label>
            </div>
        </div>`;

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

    /** #RRGGBB → "r, g, b" for CSS rgba(var(--…-rgb), α) */
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
        setHexAndRgb('--cn-var-omega', P.VAR_OMEGA);
        setHexAndRgb('--cn-var-diff', P.VAR_DIFF);
        setHexAndRgb('--cn-var-product', P.VAR_PRODUCT);
        setHexAndRgb('--cn-var-quot', P.VAR_QUOT);
        setHexAndRgb('--cn-title-muted', P.TITLE_MUTED);
        root.style.setProperty('--cn-card-accent', P.CARD_ACCENT);
        root.style.setProperty('--cn-axis-re-dim', PALETTE_DIM.AXIS_RE_EDGE);
        root.style.setProperty('--cn-axis-im-dim', PALETTE_DIM.AXIS_IM_EDGE);
        root.style.setProperty('--cn-axis-re-dim-rgb', hexToRgbComma(PALETTE_DIM.AXIS_RE_EDGE));
        root.style.setProperty('--cn-axis-im-dim-rgb', hexToRgbComma(PALETTE_DIM.AXIS_IM_EDGE));
    }

    function texReImPair(reInner, imInner) {
        const reColor = reInner === 'r' ? PALETTE.VAR_R : (reInner === 'z' ? PALETTE.VAR_Z : PALETTE.AXIS_RE);
        const imColor = imInner === 'r' ? PALETTE.VAR_R : (imInner === 'z' ? PALETTE.VAR_Z : PALETTE.AXIS_IM);
        return [
            `\\textcolor{${PALETTE.AXIS_RE}}{\\mathit{re}\\,(\\textcolor{${reColor}}{${reInner}})}`,
            `\\textcolor{${PALETTE.AXIS_IM}}{\\mathit{im}\\,(\\textcolor{${imColor}}{${imInner}})}`,
        ];
    }

    /** Only \\textit{r} and \\textit{z} in role colors; = and sqrt neutral (TITLE_MUTED). */
    function texRSqrtZ() {
        return (
            `\\textcolor{${PALETTE.VAR_R}}{r}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{\\sqrt{\\textcolor{${PALETTE.VAR_Z}}{z}}}`
        );
    }

    /** r = z² — Exponent and = neutral, only z red. */
    function texZSquare() {
        return (
            `\\textcolor{${PALETTE.VAR_R}}{r}\\,` +
            `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
            `\\textcolor{${PALETTE.VAR_Z}}{z}^{\\textcolor{${PALETTE.TITLE_MUTED}}{2}}`
        );
    }

    /** Title row z-card as before: z ∈ ℂ */
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

        const rTex = texReImPair('r', 'r');
        const rFallbacks = ['re (r)', 'im (r)'];
        const labelIds = ['cn-r-tex-re', 'cn-r-tex-im'];
        labelIds.forEach((id, i) => {
            katexLabelOnce(document.getElementById(id), rTex[i], rFallbacks[i], 'li1');
        });

        const w = state.zMapMode === 'free' ? { re: state.rRe, im: state.rIm } : sqrtProviderRef(state.re, state.im);
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
        renderMapModeKatex(state);
    }

    function renderMapModeKatex(state) {
        const sqrtEl = document.getElementById('cn-map-sqrt-tex');
        const sqEl = document.getElementById('cn-map-sq-tex');
        const sumEl = document.getElementById('cn-check-sum-tex');
        const diffEl = document.getElementById('cn-check-diff-tex');
        const dashedEl = document.getElementById('cn-check-dashed-tex');
        const absEl = document.getElementById('cn-check-abs-tex');
        if (!sqrtEl || !sqEl) return;
        sqrtEl.textContent = '';
        sqEl.textContent = '';
        katexTry(sqrtEl, texRSqrtZ(), 'r = √(z)');
        katexTry(sqEl, texZSquare(), 'r = z²');
        if (sumEl) {
            const sumTex = 
                `\\Large ` +
                `\\textcolor{${PALETTE.VAR_OMEGA}}{\\omega}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
                `\\textcolor{${PALETTE.VAR_Z}}{z}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{+}\\,` +
                `\\textcolor{${PALETTE.VAR_R}}{r}`;
            katexTry(sumEl, sumTex, 'ω = z + r');
        }
        if (diffEl) {
            const diffTex = 
                `\\Large ` +
                `\\textcolor{${PALETTE.VAR_DIFF}}{\\delta}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
                `\\textcolor{${PALETTE.VAR_Z}}{z}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{-}\\,` +
                `\\textcolor{${PALETTE.VAR_R}}{r}`;
            katexTry(diffEl, diffTex, 'δ = z - r');
        }
        const prodEl = document.getElementById('cn-check-prod-tex');
        const quotEl = document.getElementById('cn-check-quot-tex');
        if (dashedEl) {
            dashedEl.textContent = 'Hilfslinien';
        }
        if (prodEl) {
            const prodTex = 
                `\\Large ` +
                `\\textcolor{${PALETTE.VAR_PRODUCT}}{\\mu}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
                `\\textcolor{${PALETTE.VAR_Z}}{z}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{\\cdot}\\,` +
                `\\textcolor{${PALETTE.VAR_R}}{r}`;
            katexTry(prodEl, prodTex, 'μ = z · r');
        }
        if (quotEl) {
            const quotTex = 
                `\\Large ` +
                `\\textcolor{${PALETTE.VAR_QUOT}}{\\nu}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{=}\\,` +
                `\\textcolor{${PALETTE.VAR_Z}}{z}\\,` +
                `\\textcolor{${PALETTE.TITLE_MUTED}}{/}\\,` +
                `\\textcolor{${PALETTE.VAR_R}}{r}`;
            katexTry(quotEl, quotTex, 'ν = z / r');
        }
        if (absEl) {
            const absTex = 
                `\\Large ` +
                `|\\textcolor{${PALETTE.VAR_Z}}{z}| \\, ` +
                `|\\textcolor{${PALETTE.VAR_R}}{r}| \\, ` +
                `|\\textcolor{${PALETTE.VAR_OMEGA}}{\\omega}| \\, ` +
                `|\\textcolor{${PALETTE.VAR_DIFF}}{\\delta}| \\, ` +
                `|\\textcolor{${PALETTE.VAR_PRODUCT}}{\\mu}| \\, ` +
                `|\\textcolor{${PALETTE.VAR_QUOT}}{\\nu}|`;
            katexTry(absEl, absTex, '|z| |r| |ω| |δ| |μ| |ν|');
        }
    }

    function setupParameterCard(options) {
        const { state, fmtNum, sqrtProvider } = options;

        if (typeof CyberUI === 'undefined' || typeof CyberUI.createCard !== 'function') return;

        applyPaletteCssVars();

        sqrtProviderRef = typeof sqrtProvider === 'function' ? sqrtProvider : null;

        CyberUI.createCard('ui-container', '', ROOT_Z_READOUT_HTML, PALETTE.VAR_Z);

        if (sqrtProviderRef) {
            CyberUI.createCard('ui-container', '', ROOT_READOUT_CARD_HTML, PALETTE.VAR_R);
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
