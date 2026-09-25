// Reading the typeset formula back out of KaTeX: where each glyph sits, in
// which font, at which size, on which baseline.
//
// This is the piece that was missing. Handwriting can only morph into a
// formula if something says where numerator, denominator, index and exponent
// belong - and the only thing that knows is the typesetter. So KaTeX renders the
// LaTeX, and this module walks the result and returns one atom per visible
// glyph, in READING order, with its exact geometry. The morph then has real
// targets instead of a row of glyphs on one baseline.
//
// Facts this is built on (measured on KaTeX's DOM, 25.09.2026):
//   - a leaf span carries font-family, font-style and the effective font-size
//     (a subscript really is 36.3px next to a 72.6px base);
//   - inside .mfrac the DENOMINATOR comes first in the DOM, then the bar, then
//     the numerator - reading order is bar, numerator, denominator;
//   - KaTeX inserts zero-width struts (U+200B at 1px) that must be dropped;
//   - getBoundingClientRect() gives the line box, not the ink, so the baseline
//     is probed with a zero-size inline-block aligned to it.
//
// Convention shared with js/stroke-symbols.js: a fraction reads
// bar → numerator (left to right) → denominator (left to right).
//
// An atom:
//   { art: 'text', text, font: { family, style, size }, left, baseline, box }
//   { art: 'line',                                                      box }
// with all coordinates relative to the host element's top-left corner.

(function (root) {
    'use strict';

    const LINE_CLASSES = /(^|\s)(frac-line|sqrt-line|overline-line|underline-line)(\s|$)/;

    function isStrut(el, text) {
        const t = text.replace(/​/g, '').trim();
        if (!t) return true;
        const size = parseFloat(getComputedStyle(el).fontSize);
        return !(size > 2);
    }

    // The baseline of a text span: a zero-size inline-block aligned to the
    // baseline sits exactly on it. Inserted, measured, removed.
    function probeBaseline(el) {
        const probe = document.createElement('span');
        probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;';
        el.appendChild(probe);
        const y = probe.getBoundingClientRect().top;
        el.removeChild(probe);
        return y;
    }

    function textLeafOf(el) {
        // A leaf holds exactly its own text and no element child with text.
        let own = '';
        for (const ch of el.childNodes) {
            if (ch.nodeType === 3) own += ch.textContent;
            else if (ch.nodeType === 1 && (ch.textContent || '').replace(/​/g, '').trim()) return null;
        }
        return own;
    }

    function walk(el, out, origin, stats) {
        if (!el || el.nodeType !== 1) return;
        if (el.classList.contains('katex-mathml')) return;       // hidden accessibility twin

        if (el.tagName === 'svg' || el.tagName === 'SVG') {       // radicals, tall delimiters
            stats.svg++;
            return;
        }

        if (LINE_CLASSES.test(el.className || '')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0.5) {
                out.push({ art: 'line', box: { x: r.left - origin.x, y: r.top - origin.y, w: r.width, h: Math.max(r.height, 1) } });
            }
            return;
        }

        // Stacked constructs: order the cells by where they are, not by DOM order.
        if (el.classList.contains('mfrac') || el.classList.contains('msupsub')) {
            const vlist = el.querySelector(':scope .vlist');
            if (vlist) {
                const cells = Array.from(vlist.children)
                    .map(c => ({ el: c, top: c.getBoundingClientRect().top }))
                    .sort((a, b) => a.top - b.top);
                if (el.classList.contains('mfrac')) {
                    // bar first, then numerator (topmost), then denominator
                    const bar = cells.find(c => c.el.querySelector('.frac-line') || LINE_CLASSES.test(c.el.className || ''));
                    if (bar) walk(bar.el, out, origin, stats);
                    for (const c of cells) if (c !== bar) walk(c.el, out, origin, stats);
                } else {
                    for (const c of cells) walk(c.el, out, origin, stats);   // superscript above subscript
                }
                return;
            }
        }

        const own = textLeafOf(el);
        if (own !== null && own.length) {
            if (isStrut(el, own)) return;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            out.push({
                art: 'text',
                text: own.replace(/​/g, ''),
                font: {
                    family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
                    style: cs.fontStyle,
                    size: parseFloat(cs.fontSize),
                },
                left: r.left - origin.x,
                baseline: probeBaseline(el) - origin.y,
                box: { x: r.left - origin.x, y: r.top - origin.y, w: r.width, h: r.height },
            });
            return;
        }

        for (const ch of el.children) walk(ch, out, origin, stats);
    }

    // The boxes are only right once the KaTeX faces are in memory. Measured
    // before that, they are the fallback font's metrics - "=" came out 68 px
    // wide where Computer Modern makes it 94. Digits happened to match, which is
    // what made this hard to spot.
    async function schriftenLaden(host) {
        if (!document.fonts || !document.fonts.load) return;
        const specs = new Set();
        host.querySelectorAll('*').forEach(el => {
            if (!el.childNodes.length) return;
            const cs = getComputedStyle(el);
            const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
            if (!/^KaTeX/.test(fam)) return;
            specs.add(`${cs.fontStyle === 'italic' ? 'italic ' : ''}${cs.fontWeight} ${cs.fontSize} "${fam}"`);
        });
        await Promise.all([...specs].map(sp => document.fonts.load(sp).catch(() => {})));
        try { await document.fonts.ready; } catch (_) {}
    }

    // Render `latex` into `host` (any element; may be visibility:hidden but not
    // display:none) and return its atoms in reading order.
    async function atomeAusLatex(latex, host, opts) {
        const o = Object.assign({ fontSize: 100 }, opts || {});
        host.innerHTML = '';
        host.style.fontSize = o.fontSize + 'px';
        try { katex.render(latex, host, { throwOnError: false, displayMode: false }); }
        catch (e) { return { atome: [], fehler: e.message, svg: 0 }; }
        await schriftenLaden(host);

        const rootEl = host.querySelector('.katex-html') || host;
        const r = host.getBoundingClientRect();
        const origin = { x: r.left, y: r.top };
        const out = [];
        const stats = { svg: 0 };
        walk(rootEl, out, origin, stats);
        return { atome: out, svg: stats.svg, box: { w: r.width, h: r.height }, fontSize: o.fontSize };
    }

    // Move and scale a set of atoms as one rigid block - used to fit the
    // measured formula onto the handwriting without rendering it twice.
    function transformiere(atome, skala, dx, dy) {
        return atome.map(a => {
            const b = { x: a.box.x * skala + dx, y: a.box.y * skala + dy, w: a.box.w * skala, h: a.box.h * skala };
            if (a.art === 'line') return { art: 'line', box: b };
            return {
                art: 'text', text: a.text,
                font: { family: a.font.family, style: a.font.style, size: a.font.size * skala },
                left: a.left * skala + dx, baseline: a.baseline * skala + dy, box: b,
            };
        });
    }

    // Ink extent of a set of atoms (line boxes are generous, but good enough to
    // fit the formula onto the handwriting).
    function umfang(atome) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const a of atome) {
            x0 = Math.min(x0, a.box.x); y0 = Math.min(y0, a.box.y);
            x1 = Math.max(x1, a.box.x + a.box.w); y1 = Math.max(y1, a.box.y + a.box.h);
        }
        return atome.length ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
    }

    const api = { atomeAusLatex, transformiere, umfang };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.KatexAtome = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
