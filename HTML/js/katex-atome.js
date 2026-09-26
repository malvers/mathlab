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

    // One SVG atom: its VISIBLE box (a root's SVG is 400em wide and clipped by
    // a .hide-tail span - the span is what shows), a label for reading, and a
    // self-contained copy of the markup, white on transparent, for tracing.
    function svgAtom(svg, origin) {
        const clip = svg.parentElement && svg.parentElement.classList.contains('hide-tail')
            ? svg.parentElement : svg;
        const r = clip.getBoundingClientRect();
        if (r.width < 0.5 || r.height < 0.5) return null;
        const label = svg.closest('.sqrt') ? '√' : svg.closest('.accent') ? '→' : '▭';
        const kopie = svg.cloneNode(true);
        kopie.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        kopie.setAttribute('width', '%W%');
        kopie.setAttribute('height', '%H%');
        kopie.setAttribute('style', 'color:#fff;fill:#fff');
        kopie.querySelectorAll('path, line, rect, polygon').forEach(p => {
            if (!p.getAttribute('fill') || p.getAttribute('fill') === 'currentColor') p.setAttribute('fill', '#fff');
            if (p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none') p.setAttribute('stroke', '#fff');
        });
        return {
            art: 'svg', text: label,
            box: { x: r.left - origin.x, y: r.top - origin.y, w: r.width, h: r.height },
            svg: new XMLSerializer().serializeToString(kopie),
        };
    }

    let _mess = null;
    function messKontext() {
        if (!_mess) _mess = document.createElement('canvas').getContext('2d');
        return _mess;
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

        // Radicals, vector arrows, tall delimiters: KaTeX draws them as SVG, not
        // as text. Each becomes one atom; its outline is traced from the SVG
        // itself when the morph needs it (HandschriftMorph.svgVorbereiten).
        if (el.tagName === 'svg' || el.tagName === 'SVG') {
            if (!stats.gesehen.has(el)) {
                stats.gesehen.add(el);
                const a = svgAtom(el, origin);
                if (a) { out.push(a); stats.svg++; }
            }
            return;
        }

        // A root is written sign first, then what is under it - but KaTeX puts
        // the radicand first in the DOM. So the sign goes out before anything
        // else inside it (corpus probes 20, 21).
        if (el.classList.contains('sqrt')) {
            el.querySelectorAll('svg').forEach(sv => walk(sv, out, origin, stats));
        }

        if (LINE_CLASSES.test(el.className || '')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0.5) {
                out.push({ art: 'line', box: { x: r.left - origin.x, y: r.top - origin.y, w: r.width, h: Math.max(r.height, 1) } });
            }
            return;
        }

        // Limits above and below an operator (\sum, \lim in display style):
        // written operator first, then what is above it, then what is below -
        // KaTeX lists them bottom, operator, top. The operator's cell is the one
        // not set in the small (mtight) size.
        if (el.classList.contains('op-limits')) {
            const vlist = el.querySelector(':scope .vlist');
            if (vlist) {
                const cells = Array.from(vlist.children)
                    .map(c => ({ el: c, top: c.getBoundingClientRect().top }))
                    .sort((a, b) => a.top - b.top);
                const basis = cells.find(c => !c.el.querySelector('.mtight'));
                if (basis) walk(basis.el, out, origin, stats);
                for (const c of cells) if (c !== basis) walk(c.el, out, origin, stats);
                return;
            }
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
            textAtome(own, el, el.getBoundingClientRect(), out, origin);
            return;
        }

        // Mixed content: KaTeX sets \log as the text "lo" plus a span for the
        // "g" (its italic correction). Walking only the element children lost
        // the bare text - "log_2 8 = 3" morphed into "g_2 8 = 3" (Doc, 25.09.).
        for (const ch of el.childNodes) {
            if (ch.nodeType === 1) { walk(ch, out, origin, stats); continue; }
            if (ch.nodeType !== 3 || !ch.textContent.replace(/​/g, '').trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(ch);
            textAtome(ch.textContent, el, range.getBoundingClientRect(), out, origin);
        }
    }

    // Atoms for a run of text set in `el`'s face, whose box is `r`.
    // "lim", "sin", "log" are ONE run in KaTeX but three letters under the pen -
    // one atom each, or the counts never match (corpus probes 12, 15, 18). Each
    // letter's pen position comes from the font's own advances, the same face
    // the run is set in.
    function textAtome(roh, el, r, out, origin) {
        const cs = getComputedStyle(el);
        const font = {
            family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
            style: cs.fontStyle,
            size: parseFloat(cs.fontSize),
        };
        const text = roh.replace(/​/g, '');
        const left = r.left - origin.x, top = r.top - origin.y;
        const baseline = probeBaseline(el) - origin.y;
        const zeichen = Array.from(text).filter(c => c.trim());
        if (zeichen.length > 1) {
            const m = messKontext();
            m.font = `${font.style === 'italic' ? 'italic ' : ''}${cs.fontWeight} ${font.size}px "${font.family}"`;
            let vor = '';
            for (const c of Array.from(text)) {
                const x = left + m.measureText(vor).width;
                const w = m.measureText(c).width;
                vor += c;
                if (!c.trim()) continue;
                out.push({ art: 'text', text: c, font, left: x, baseline,
                           box: { x, y: top, w, h: r.height } });
            }
            return;
        }
        out.push({ art: 'text', text, font, left, baseline,
                   box: { x: left, y: top, w: r.width, h: r.height } });
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
    // display: set in display style (\displaystyle) - limits above and below
    // \sum, full-size fractions - the way a formula is written by hand.
    async function atomeAusLatex(latex, host, opts) {
        const o = Object.assign({ fontSize: 100, display: false }, opts || {});
        host.innerHTML = '';
        host.style.fontSize = o.fontSize + 'px';
        try { katex.render((o.display ? '\\displaystyle ' : '') + latex, host, { throwOnError: false, displayMode: false }); }
        catch (e) { return { atome: [], fehler: e.message, svg: 0 }; }
        await schriftenLaden(host);

        const rootEl = host.querySelector('.katex-html') || host;
        const r = host.getBoundingClientRect();
        const origin = { x: r.left, y: r.top };
        const out = [];
        const stats = { svg: 0, gesehen: new Set() };
        walk(rootEl, out, origin, stats);
        return { atome: out, svg: stats.svg, box: { w: r.width, h: r.height }, fontSize: o.fontSize };
    }

    // Move and scale a set of atoms as one rigid block - used to fit the
    // measured formula onto the handwriting without rendering it twice.
    function transformiere(atome, skala, dx, dy) {
        return atome.map(a => {
            const b = { x: a.box.x * skala + dx, y: a.box.y * skala + dy, w: a.box.w * skala, h: a.box.h * skala };
            if (a.art === 'line') return { art: 'line', box: b };
            if (a.art === 'svg') return { art: 'svg', text: a.text, svg: a.svg, box: b };
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
