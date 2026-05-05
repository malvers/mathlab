(function (global) {
    const P = ImaginaryNumbersControls.PALETTE;
    const et = ImaginaryNumbersControls.escapeTexText;
    const fmtNum = ImaginaryNumbersMath.fmtNum;
    const mapRFromZ = ImaginaryNumbersMath.mapRFromZ;

    function rPointFromState(state) {
        if (state.zMapMode === 'free') {
            return { re: state.rRe, im: state.rIm };
        }
        return mapRFromZ(state.re, state.im, state.zMapMode);
    }

    let memoKeys = {
        formula: '',
        absz: '',
        absr: '',
        absw: '',
        absd: '',
        absp: '',
        magnitude: '',
        sum: '',
        diff: ''
    };

    function invalidateCnOverlaysMemo() {
        memoKeys.formula = '';
        memoKeys.absz = '';
        memoKeys.absr = '';
        memoKeys.absw = '';
        memoKeys.absd = '';
        memoKeys.absp = '';
        memoKeys.magnitude = '';
        memoKeys.sum = '';
        memoKeys.diff = '';
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
        re: (inner) => `\\mathit{re}\\,(${inner})`,
        im: (inner) => `\\mathit{im}\\,(${inner})`,
        sqrt: (inner) => `\\sqrt{${inner}}`,
        frac: (num, den) => `\\dfrac{${num}}{${den}}`,
        sgn: (inner) => `\\operatorname{sgn}\\bigl(${inner}\\bigr)`,
        aligned: (rows) => `\\begin{aligned}${rows.join(' \\\\[0.4em]')}\\end{aligned}`
    };

    function updateCnFormulaOverlay(state, dragTarget) {
        const host = document.getElementById('cn-formula-tex');
        if (!host) return;

        // In free mode, don't show any formula overlay
        if (state.zMapMode === 'free') {
            host.textContent = '';
            return;
        }

        const x = fmtNum(state.re);
        const y = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        
        let memoKey, buildTex, fallback;

        if (dragTarget === 'z' && state.zMapMode !== 'free') {
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
        const host = document.getElementById('cn-formula-absz');
        if (!host) return;

        if (!state.showAbsBoxes) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

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
        const host = document.getElementById('cn-formula-absr');
        if (!host) return;

        if (!state.showAbsBoxes) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `absr|${zm}|${xs}|${ys}`;

        const w = rPointFromState(state);
        const us = fmtNum(w.re);
        const vs = fmtNum(w.im);
        const absrs = fmtNum(Math.hypot(w.re, w.im));

        const buildTex = () => `\\left|${Tex.color(P.VAR_R, 'r')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, us)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, vs)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, absrs)}`;
            
        const fallback = () => `|r| = √((${us})² + (${vs})²) = ${absrs}`;

        renderOverlay('cn-formula-absr-tex', 'absr', memoKey, buildTex, fallback, false);
    }

    function updateCnAbswOverlay(state) {
        const host = document.getElementById('cn-formula-absw');
        if (!host) return;

        if (!state.showAbsBoxes || !state.showSum) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const rPt = rPointFromState(state);
        const wx = state.re + rPt.re;
        const wy = state.im + rPt.im;
        const wxs = fmtNum(wx);
        const wys = fmtNum(wy);
        const absws = fmtNum(Math.hypot(wx, wy));

        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `absw|${zm}|${fmtNum(state.re)}|${fmtNum(state.im)}`;

        const buildTex = () => `\\left|${Tex.color(P.VAR_OMEGA, '\\omega')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, wxs)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, wys)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, absws)}`;
            
        const fallback = () => `|ω| = √((${wxs})² + (${wys})²) = ${absws}`;

        renderOverlay('cn-formula-absw-tex', 'absw', memoKey, buildTex, fallback, false);
    }

    function updateCnAbspOverlay(state) {
        const host = document.getElementById('cn-formula-absp');
        if (!host) return;

        if (!state.showAbsBoxes || !state.showProd) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const rPt = rPointFromState(state);
        const p = ImaginaryNumbersMath.multiplyComplex(state.re, state.im, rPt.re, rPt.im);
        const px = fmtNum(p.re);
        const py = fmtNum(p.im);
        const absp = fmtNum(Math.hypot(p.re, p.im));

        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `absp|${zm}|${fmtNum(state.re)}|${fmtNum(state.im)}`;

        const buildTex = () => `\\left|${Tex.color(P.VAR_PRODUCT, '\\mu')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, px)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, py)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, absp)}`;
        const fallback = () => `|μ| = √((${px})² + (${py})²) = ${absp}`;

        renderOverlay('cn-formula-absp-tex', 'absp', memoKey, buildTex, fallback, false);
    }

    function updateCnMagnitudeOverlay(state) {
        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `mag|${zm}|${xs}|${ys}`;

        const rho = Math.hypot(state.re, state.im);
        const rhos = fmtNum(rho);
        const w = rPointFromState(state);
        const us = fmtNum(w.re);
        const vs = fmtNum(w.im);

        const buildTex = () => {
            const re_r = Tex.color(P.AXIS_RE, `\\mathit{re}\\,(\\textcolor{${P.VAR_R}}{r})`);
            const im_r = Tex.color(P.AXIS_IM, `\\mathit{im}\\,(\\textcolor{${P.VAR_R}}{r})`);
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

    function updateCnSumOverlay(state) {
        const host = document.getElementById('cn-formula-sum');
        if (!host) return;

        if (!state.showSum) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `sum|${zm}|${xs}|${ys}`;

        const rPt = rPointFromState(state);
        const us = fmtNum(rPt.re);
        const vs = fmtNum(rPt.im);
        
        const wx = fmtNum(state.re + rPt.re);
        const wy = fmtNum(state.im + rPt.im);

        const buildTex = () => {
            const omega = Tex.color(P.VAR_OMEGA, '\\omega');
            const re_w = Tex.color(P.AXIS_RE, `\\mathit{re}\\,(${omega})`);
            const im_w = Tex.color(P.AXIS_IM, `\\mathit{im}\\,(${omega})`);
            const zRe = Tex.val(P.AXIS_RE, xs);
            const zIm = Tex.val(P.AXIS_IM, ys);
            const rRe = Tex.val(P.VAR_R, us);
            const rIm = Tex.val(P.VAR_R, vs);
            const wRe = Tex.val(P.AXIS_RE, wx);
            const wIm = Tex.val(P.AXIS_IM, wy);
            
            return Tex.aligned([
                `&${re_w} \\quad ${zRe} \\,+\\, ${rRe} \\,{=}\\, ${wRe}`,
                `&${im_w} \\quad ${zIm} \\,+\\, ${rIm} \\,{=}\\, ${wIm}`
            ]);
        };

        const fallback = () => `re(ω)=${wx}, im(ω)=${wy}`;

        renderOverlay('cn-formula-sum-tex', 'sum', memoKey, buildTex, fallback, true);
    }

    function updateCnProdOverlay(state) {
        const host = document.getElementById('cn-formula-prod');
        if (!host) return;

        if (!state.showProd) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `prod|${zm}|${xs}|${ys}`;

        const rPt = rPointFromState(state);
        const us = fmtNum(rPt.re);
        const vs = fmtNum(rPt.im);
        const p = ImaginaryNumbersMath.multiplyComplex(state.re, state.im, rPt.re, rPt.im);
        const px = fmtNum(p.re);
        const py = fmtNum(p.im);

        const buildTex = () => {
            const mu = Tex.color(P.VAR_PRODUCT, '\\mu');
            const re_p = Tex.color(P.AXIS_RE, `\\mathit{re}\\,(${mu})`);
            const im_p = Tex.color(P.AXIS_IM, `\\mathit{im}\\,(${mu})`);
            const zRe = Tex.val(P.AXIS_RE, xs);
            const zIm = Tex.val(P.AXIS_IM, ys);
            const rRe = Tex.val(P.VAR_R, us);
            const rIm = Tex.val(P.VAR_R, vs);
            const pRe = Tex.val(P.AXIS_RE, px);
            const pIm = Tex.val(P.AXIS_IM, py);
            return Tex.aligned([
                `&${re_p} \\quad ${zRe} \\cdot \\; ${rRe} \,{=}\, ${pRe}`,
                `&${im_p} \\quad ${zIm} \\cdot \\; ${rIm} \,{=}\, ${pIm}`
            ]);
        };

        const fallback = () => `re(μ)=${px}, im(μ)=${py}`;

        renderOverlay('cn-formula-prod-tex', 'prod', memoKey, buildTex, fallback, true);
    }

    function updateCnDiffOverlay(state) {
        const host = document.getElementById('cn-formula-diff');
        if (!host) return;

        if (!state.showDiff) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const xs = fmtNum(state.re);
        const ys = fmtNum(state.im);
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `diff|${zm}|${xs}|${ys}`;

        const rPt = rPointFromState(state);
        const us = fmtNum(rPt.re);
        const vs = fmtNum(rPt.im);
        
        const dx = fmtNum(state.re - rPt.re);
        const dy = fmtNum(state.im - rPt.im);

        const buildTex = () => {
            const delta = Tex.color(P.VAR_DIFF, '\\delta');
            const re_d = Tex.color(P.AXIS_RE, `\\mathit{re}\\,(${delta})`);
            const im_d = Tex.color(P.AXIS_IM, `\\mathit{im}\\,(${delta})`);
            const zRe = Tex.val(P.AXIS_RE, xs);
            const zIm = Tex.val(P.AXIS_IM, ys);
            const rRe = Tex.val(P.VAR_R, us);
            const rIm = Tex.val(P.VAR_R, vs);
            const dRe = Tex.val(P.AXIS_RE, dx);
            const dIm = Tex.val(P.AXIS_IM, dy);
            
            return Tex.aligned([
                `&${re_d} \\quad ${zRe} \\,-\\, ${rRe} \\,{=}\\, ${dRe}`,
                `&${im_d} \\quad ${zIm} \\,-\\, ${rIm} \\,{=}\\, ${dIm}`
            ]);
        };

        const fallback = () => `re(δ)=${dx}, im(δ)=${dy}`;

        renderOverlay('cn-formula-diff-tex', 'diff', memoKey, buildTex, fallback, true);
    }

    function updateCnAbsdOverlay(state) {
        const host = document.getElementById('cn-formula-absd');
        if (!host) return;

        if (!state.showAbsBoxes || !state.showDiff) {
            host.style.display = 'none';
            return;
        }
        host.style.display = '';

        const rPt = rPointFromState(state);
        const dx = state.re - rPt.re;
        const dy = state.im - rPt.im;
        const dxs = fmtNum(dx);
        const dys = fmtNum(dy);
        const absds = fmtNum(Math.hypot(dx, dy));

        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const memoKey = `absd|${zm}|${fmtNum(state.re)}|${fmtNum(state.im)}`;

        const buildTex = () => `\\left|${Tex.color(P.VAR_DIFF, '\\delta')}\\right| \\,{=}\\, ` +
            `\\sqrt{\\textstyle${Tex.val(P.AXIS_RE, dxs)}^{2}\\,+\\,${Tex.val(P.AXIS_IM, dys)}^{2}} ` +
            `\\,{=}\\, ${Tex.val(P.TITLE_MUTED, absds)}`;
            
        const fallback = () => `|δ| = √((${dxs})² + (${dys})²) = ${absds}`;

        renderOverlay('cn-formula-absd-tex', 'absd', memoKey, buildTex, fallback, false);
    }

    function ensureCnPointLabelsKatex(state) {
        if (typeof katex === 'undefined') return;
        const zEl = document.getElementById('cn-label-z');
        const rEl = document.getElementById('cn-label-r');
        const wEl = document.getElementById('cn-label-w');
        const dEl = document.getElementById('cn-label-d');
        const pEl = document.getElementById('cn-label-p');
        const zm = state.zMapMode === 'square' ? 'sq' : state.zMapMode === 'free' ? 'free' : 'sqrt';
        const key = `cn-pt-${zm}-${state.showSum}-${state.showDiff}-${state.showProd}`;

        if (zEl && zEl.dataset.cnPointKey !== key) {
            zEl.innerHTML = '';
            const zTex = `\\textcolor{${P.VAR_Z}}{z}`;
            katex.render(zTex, zEl, { throwOnError: false, displayMode: false });
            zEl.dataset.cnPointKey = key;
        }
        if (rEl && rEl.dataset.cnPointKey !== key) {
            rEl.innerHTML = '';
            const rTex = state.zMapMode === 'free'
                ? `\\textcolor{${P.VAR_R}}{r}`
                : state.zMapMode === 'square'
                    ? ImaginaryNumbersControls.texZSquare()
                    : ImaginaryNumbersControls.texRSqrtZ();
            katex.render(rTex, rEl, { throwOnError: false, displayMode: false });
            rEl.dataset.cnPointKey = key;
        }
        if (wEl && wEl.dataset.cnPointKey !== key) {
            wEl.innerHTML = '';
            if (state.showSum) {
                const wTex = `\\textcolor{${P.VAR_OMEGA}}{\\omega}`;
                katex.render(wTex, wEl, { throwOnError: false, displayMode: false });
            }
            wEl.dataset.cnPointKey = key;
        }
        if (dEl && dEl.dataset.cnPointKey !== key) {
            dEl.innerHTML = '';
            if (state.showDiff) {
                const dTex = (
                    `\\textcolor{${P.VAR_DIFF}}{\\delta}` +
                    `\\textcolor{${P.TITLE_MUTED}}{=}` +
                    `\\textcolor{${P.VAR_Z}}{z}` +
                    `\\textcolor{${P.TITLE_MUTED}}{-}` +
                    `\\textcolor{${P.VAR_R}}{r}`
                );
                katex.render(dTex, dEl, { throwOnError: false, displayMode: false });
            }
            dEl.dataset.cnPointKey = key;
        }
        if (pEl && pEl.dataset.cnPointKey !== key) {
            pEl.innerHTML = '';
            if (state.showProd) {
                const pTex = `\\textcolor{${P.VAR_PRODUCT}}{\\mu}`;
                katex.render(pTex, pEl, { throwOnError: false, displayMode: false });
            }
            pEl.dataset.cnPointKey = key;
        }
    }

    function updateCnPointLabelOverlays(CC, ax, ay, sx, sy, wx, wy, dx, dy, px, py, s, state) {
        ensureCnPointLabelsKatex(state);
        const canvas = CC.canvas;
        const zEl = document.getElementById('cn-label-z');
        const rEl = document.getElementById('cn-label-r');
        const wEl = document.getElementById('cn-label-w');
        const dEl = document.getElementById('cn-label-d');
        const pEl = document.getElementById('cn-label-p');
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
        
        if (wEl) {
            if (state.showSum) {
                wEl.style.display = '';
                wEl.style.fontSize = fz;
                wEl.style.left = `${ox + wx + pad}px`;
                wEl.style.top = `${oy + wy - pad}px`;
                wEl.style.transform = 'translateY(-100%)';
            } else {
                wEl.style.display = 'none';
            }
        }

        if (dEl) {
            if (state.showDiff) {
                dEl.style.display = '';
                dEl.style.fontSize = fz;
                dEl.style.left = `${ox + dx + pad}px`;
                dEl.style.top = `${oy + dy - pad}px`;
                dEl.style.transform = 'translateY(-100%)';
            } else {
                dEl.style.display = 'none';
            }
        }

        if (pEl) {
            if (state.showProd) {
                pEl.style.display = '';
                pEl.style.fontSize = fz;
                pEl.style.left = `${ox + px + pad}px`;
                pEl.style.top = `${oy + py - pad}px`;
                pEl.style.transform = 'translateY(-100%)';
            } else {
                pEl.style.display = 'none';
            }
        }
    }

    function syncCnFormulaOverlayWidths() {
        const row = document.getElementById('cn-formula-row');
        const rowBottom = document.getElementById('cn-formula-row-bottom');
        const ids = ['cn-formula-overlay', 'cn-formula-magnitude', 'cn-formula-absz', 'cn-formula-absr', 'cn-formula-absw', 'cn-formula-absd', 'cn-formula-absp', 'cn-formula-sum', 'cn-formula-prod'];
        
        // Only process elements that are not explicitly hidden
        const els = ids.map((id) => document.getElementById(id)).filter(el => el && el.style.display !== 'none');
        
        if (!els.length) return;

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
        if (row) row.style.setProperty('--cn-formula-unified-w', `${px}px`);
        if (rowBottom) rowBottom.style.setProperty('--cn-formula-unified-w', `${px}px`);
        let need = px;
        els.forEach((el) => {
            need = Math.max(need, el.scrollWidth);
        });
        if (need > px) {
            px = Math.ceil(need);
            if (row) row.style.setProperty('--cn-formula-unified-w', `${px}px`);
            if (rowBottom) rowBottom.style.setProperty('--cn-formula-unified-w', `${px}px`);
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
        updateCnAbswOverlay,
        updateCnAbspOverlay,
        updateCnAbsdOverlay,
        updateCnMagnitudeOverlay,
        updateCnSumOverlay,
        updateCnProdOverlay,
        updateCnDiffOverlay,
        updateCnPointLabelOverlays,
        syncCnFormulaOverlayWidths,
        ensureCnFormulaWidthResizeListener
    };
})(typeof window !== 'undefined' ? window : globalThis);


