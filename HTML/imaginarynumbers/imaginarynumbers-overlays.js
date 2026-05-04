(function (global) {
    const P = ImaginaryNumbersControls.PALETTE;
    const et = ImaginaryNumbersControls.escapeTexText;
    const fmtNum = ImaginaryNumbersMath.fmtNum;
    const mapRFromZ = ImaginaryNumbersMath.mapRFromZ;

    let memoKeys = {
        formula: '',
        absz: '',
        absr: '',
        magnitude: ''
    };

    function invalidateCnOverlaysMemo() {
        memoKeys.formula = '';
        memoKeys.absz = '';
        memoKeys.absr = '';
        memoKeys.magnitude = '';
        document.querySelectorAll('.cn-point-label').forEach((el) => {
            delete el.dataset.cnPointKey;
        });
    }

    function renderOverlay(elementId, memoKeyType, newMemoKey, buildTexFn, fallbackTextFn, displayMode = false) {
        if (memoKeys[memoKeyType] === newMemoKey) return;
        memoKeys[memoKeyType] = newMemoKey;

        const host = document.getElementById(elementId);
        if (!host || typeof katex === 'undefined') return;

        try {
            katex.render(buildTexFn(), host, { throwOnError: false, displayMode });
        } catch (_) {
            host.textContent = fallbackTextFn();
        }
    }

    // TeX Helpers for cleaner strings
    const Tex = {
        color: (hex, text) => `\\textcolor{${hex}}{${text}}`,
        val: (hex, numStr) => `\\textcolor{${hex}}{\\text{${et(numStr)}}}`,
        re: (inner) => `\\operatorname{re}(${inner})`,
        im: (inner) => `\\operatorname{im}(${inner})`,
        sqrt: (inner) => `\\sqrt{${inner}}`,
        frac: (num, den) => `\\dfrac{${num}}{${den}}`,
        sgn: (inner) => `\\operatorname{sgn}\\bigl(${inner}\\bigr)`,
        aligned: (rows) => `\\begin{aligned}${rows.join(' \\\\[0.4em]')}\\end{aligned}`
    };

    function updateCnFormulaOverlay(state, dragTarget) {
        const x = fmtNum(state.re);
        const y = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : 'sqrt';
        
        let memoKey, buildTex, fallback;

        if (dragTarget === 'z') {
            memoKey = `mode:z|${zm}`;
            buildTex = () => state.zMapMode === 'square' ? ImaginaryNumbersControls.texZSquare() : ImaginaryNumbersControls.texRSqrtZ();
            fallback = () => state.zMapMode === 'square' ? 'r = z²' : 'r = √z';
        } else {
            memoKey = `mode:idle|${zm}|${x}|${y}`;
            buildTex = () => `${Tex.color(P.VAR_Z, 'z')} = ${Tex.val(P.AXIS_RE, x)} + \\mathit{i}\\,${Tex.val(P.AXIS_IM, y)}`;
            fallback = () => `z = ${x} + i ${y}`;
        }

        renderOverlay('cn-formula-tex', 'formula', memoKey, buildTex, fallback, false);
    }

    function updateCnAbszOverlay(state) {
        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const rhos = fmtNum(Math.hypot(state.re, state.im));
        const memoKey = `absz|${xs}|${ys}`;

        const buildTex = () => `\\left|${Tex.color(P.VAR_Z, 'z')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, xs)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, ys)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, rhos)}`;
            
        const fallback = () => `|z| = √((${xs})² + (${ys})²) = ${rhos}`;

        renderOverlay('cn-formula-absz-tex', 'absz', memoKey, buildTex, fallback, false);
    }

    function updateCnAbsrOverlay(state) {
        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : 'sqrt';
        const memoKey = `absr|${zm}|${xs}|${ys}`;

        const w = mapRFromZ(state.re, state.im, state.zMapMode);
        const us = fmtNum(w.re);
        const vs = fmtNum(w.im);
        const absrs = fmtNum(Math.hypot(w.re, w.im));

        const buildTex = () => `\\left|${Tex.color(P.VAR_R, 'r')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, us)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, vs)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, absrs)}`;
            
        const fallback = () => `|r| = √((${us})² + (${vs})²) = ${absrs}`;

        renderOverlay('cn-formula-absr-tex', 'absr', memoKey, buildTex, fallback, false);
    }

    function updateCnMagnitudeOverlay(state) {
        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : 'sqrt';
        const memoKey = `mag|${zm}|${xs}|${ys}`;

        const rho = Math.hypot(state.re, state.im);
        const rhos = fmtNum(rho);
        const w = mapRFromZ(state.re, state.im, state.zMapMode);
        const us = fmtNum(w.re);
        const vs = fmtNum(w.im);

        const buildTex = () => {
            const re_r = Tex.color(P.AXIS_RE, Tex.re('r'));
            const im_r = Tex.color(P.AXIS_IM, Tex.im('r'));
            const vx = Tex.val(P.AXIS_RE, xs);
            const vy = Tex.val(P.AXIS_IM, ys);
            const vu = Tex.val(P.AXIS_RE, us);
            const vv = Tex.val(P.AXIS_IM, vs);
            const vrho = Tex.val(P.TITLE_MUTED, rhos);

            if (state.zMapMode === 'square') {
                if (rho < 1e-14) {
                    return Tex.aligned([
                        `&${re_r} \\,{=}\\, ${vx}^{2}-${vy}^{2} \\,{=}\\, 0`,
                        `&${im_r} \\,{=}\\, 2\\,\\cdot\\,${vx}\\,\\cdot\\,${vy} \\,{=}\\, 0`
                    ]);
                } else {
                    return Tex.aligned([
                        `&${re_r} \\quad ${vx}^{2}-${vy}^{2} \\,{=}\\, ${vu}`,
                        `&${im_r} \\quad 2\\,\\cdot\\,${vx}\\,\\cdot\\,${vy} \\,{=}\\, ${vv}`
                    ]);
                }
            } else if (rho < 1e-14) {
                return Tex.aligned([
                    `&${re_r} \\,{=}\\, 0`,
                    `&${im_r} \\,{=}\\, 0`
                ]);
            } else if (Math.abs(w.re) > 1e-12) {
                return Tex.aligned([
                    `&${re_r} \\quad ${Tex.sqrt(Tex.frac(`${vrho}+${vx}`, '2'))} \\,{=}\\, ${vu}`,
                    `&${im_r} \\quad ${Tex.frac(vy, `2\\,\\cdot\\,${vu}`)} \\,{=}\\, ${vv}`
                ]);
            } else {
                return Tex.aligned([
                    `&${re_r} \\,{=}\\, 0`,
                    `&${im_r} \\quad ${Tex.sgn(vy)}\\,${Tex.sqrt(Tex.frac(`|${Tex.color(P.VAR_Z, 'z')}|-${Tex.color(P.AXIS_RE, 'x')}`, '2'))} \\,{=}\\, ${Tex.sqrt(Tex.frac(`${vrho}-${vx}`, '2'))} \\,{=}\\, ${vv}`
                ]);
            }
        };

        const fallback = () => `re(r)=${us}, im(r)=${vs}`;

        renderOverlay('cn-formula-mag-tex', 'magnitude', memoKey, buildTex, fallback, true);
    }

    function ensureCnPointLabelsKatex(state) {
        if (typeof katex === 'undefined') return;
        const zEl = document.getElementById('cn-label-z');
        const rEl = document.getElementById('cn-label-r');
        const zm = state.zMapMode === 'square' ? 'sq' : 'sqrt';
        const key = `cn-pt-${zm}`;

        if (zEl && zEl.dataset.cnPointKey !== key) {
            zEl.innerHTML = '';
            const zTex = `\\textcolor{${P.VAR_Z}}{z}`;
            katex.render(zTex, zEl, { throwOnError: false, displayMode: false });
            zEl.dataset.cnPointKey = key;
        }
        if (rEl && rEl.dataset.cnPointKey !== key) {
            rEl.innerHTML = '';
            const rTex = state.zMapMode === 'square'
                ? ImaginaryNumbersControls.texZSquare()
                : ImaginaryNumbersControls.texRSqrtZ();
            katex.render(rTex, rEl, { throwOnError: false, displayMode: false });
            rEl.dataset.cnPointKey = key;
        }
    }

    function updateCnPointLabelOverlays(CC, ax, ay, sx, sy, s, state) {
        ensureCnPointLabelsKatex(state);
        const canvas = CC.canvas;
        const zEl = document.getElementById('cn-label-z');
        const rEl = document.getElementById('cn-label-r');
        if (!canvas || !zEl || !rEl) return;
        const ox = canvas.offsetLeft;
        const oy = canvas.offsetTop;
        const pad = 3 * s;
        const fz = Math.max(18, Math.round(21 * s)) + 'px';
        zEl.style.fontSize = fz;
        rEl.style.fontSize = fz;
        zEl.style.left = `${ox + ax + pad}px`;
        zEl.style.top = `${oy + ay - pad}px`;
        zEl.style.transform = 'translateY(-100%)';
        rEl.style.left = `${ox + sx + pad}px`;
        rEl.style.top = `${oy + sy - pad}px`;
        rEl.style.transform = 'translateY(-100%)';
    }

    function syncCnFormulaOverlayWidths() {
        const row = document.getElementById('cn-formula-row');
        const ids = ['cn-formula-overlay', 'cn-formula-magnitude', 'cn-formula-absz', 'cn-formula-absr'];
        const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
        if (!row || !els.length) return;

        els.forEach((el) => {
            el.style.display = 'inline-block';
            el.style.width = 'max-content';
            el.style.maxWidth = 'none';
        });
        let maxW = 0;
        els.forEach((el) => {
            maxW = Math.max(maxW, el.getBoundingClientRect().width);
        });
        els.forEach((el) => {
            el.style.display = '';
            el.style.width = '';
            el.style.maxWidth = '';
        });

        let px = Math.max(120, Math.ceil(maxW));
        row.style.setProperty('--cn-formula-unified-w', `${px}px`);
        let need = px;
        els.forEach((el) => {
            need = Math.max(need, el.scrollWidth);
        });
        if (need > px) {
            px = Math.ceil(need);
            row.style.setProperty('--cn-formula-unified-w', `${px}px`);
        }
    }

    let cnFormulaWidthResizeBound = false;
    function ensureCnFormulaWidthResizeListener() {
        if (cnFormulaWidthResizeBound) return;
        cnFormulaWidthResizeBound = true;
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeTimer = null;
                syncCnFormulaOverlayWidths();
            }, 120);
        });
    }

    global.ImaginaryNumbersOverlays = {
        invalidateCnOverlaysMemo,
        updateCnFormulaOverlay,
        updateCnAbszOverlay,
        updateCnAbsrOverlay,
        updateCnMagnitudeOverlay,
        updateCnPointLabelOverlays,
        syncCnFormulaOverlayWidths,
        ensureCnFormulaWidthResizeListener
    };
})(typeof window !== 'undefined' ? window : globalThis);
