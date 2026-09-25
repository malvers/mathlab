// Morphing handwriting into the typeset formula - rebuilt 25.09.2026.
//
// Doc's dream, in his words: "meine in LT faden (morph nicht transp)". The
// handwriting must DEFORM into the typeset form, not fade out while a printed
// copy fades in. Nothing here touches opacity; every point travels.
//
// What the first version got wrong: it laid the target glyphs out itself, on one
// baseline, left to right. That is a formula setter that knows nothing - no
// fractions, no indices, no exponents. "F = m1 m2 / r^2 G" came out as a flat
// row. The rebuild does not set anything: KaTeX sets the formula and
// js/katex-atome.js reads back where every glyph landed, in which font and at
// which size. Those atoms are the targets. Numerator up, denominator down, index
// small - because that is where the typesetter put them.
//
// The pairing (which ink becomes which glyph) comes from js/formel-erkennen.js:
// stroke symbols and atoms are both in reading order, one for one.
//
// Target outlines are traced from the very KaTeX fonts the atom names, so the
// morph ends in the same shapes the formula is set in.
//
// Needs, loaded before it: morpheus/geometry.js (resamplePolygon) and
// morpheus/contours.js (getContoursWithHoles, sortContoursCanonical).

(function (root) {
    'use strict';

    const RENDER = 220;          // px; traced big so the curves stay smooth
    const CACHE = new Map();

    // ── A glyph's outline, relative to its own text origin ──────────────────
    // Drawn left-aligned on the alphabetic baseline, so a point (x, y) in the
    // result means "x right of the pen position, y below the baseline" at RENDER
    // px. Placing it under a KaTeX atom is then origin + point * (size / RENDER)
    // - the same font, so the same metrics, so it lands where KaTeX put it.
    function glyphKonturen(text, font) {
        const key = `${font.family}|${font.style}|${text}`;
        if (CACHE.has(key)) return CACHE.get(key);

        const W = RENDER * 3, H = RENDER * 2;
        const X0 = RENDER * 0.5, Y0 = RENDER * 1.3;          // origin inside the canvas
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = `${font.style === 'italic' ? 'italic ' : ''}400 ${RENDER}px "${font.family}", "Times New Roman", serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(text, X0, Y0);

        const px = ctx.getImageData(0, 0, W, H).data;
        const grid = new Uint8Array(W * H);
        for (let i = 0, p = 0; i < px.length; i += 4, p++) grid[p] = px[i] > 128 ? 1 : 0;

        let polys = [];
        try {
            polys = getContoursWithHoles(grid, W, H) || [];
            if (typeof sortContoursCanonical === 'function') polys = sortContoursCanonical(polys);
        } catch (e) { polys = []; }
        polys = polys.filter(p => p && p.length >= 8)
            .map(poly => poly.map(pt => [(pt[0] !== undefined ? pt[0] : pt.x) - X0,
                                          (pt[1] !== undefined ? pt[1] : pt.y) - Y0]));
        CACHE.set(key, polys);
        return polys;
    }

    // Fonts must be in memory before tracing, or the first glyph is measured in
    // a fallback face. The atom names the face; KaTeX_Math is an italic face.
    async function schriftenBereit(atome) {
        if (!document.fonts || !document.fonts.load) return;
        const seen = new Set();
        const jobs = [];
        for (const a of atome || []) {
            if (a.art !== 'text') continue;
            const spec = `${a.font.style === 'italic' ? 'italic ' : ''}400 ${RENDER}px "${a.font.family}"`;
            if (seen.has(spec)) continue;
            seen.add(spec);
            jobs.push(document.fonts.load(spec).catch(() => {}));
        }
        await Promise.all(jobs);
    }

    // ── The target shape of one atom, in page coordinates ───────────────────
    function zielFlaechen(atom) {
        if (atom.art === 'line') {
            const b = atom.box;
            const h = Math.max(b.h, 1.5);
            return [[[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + h], [b.x, b.y + h]]];
        }
        const s = atom.font.size / RENDER;
        return glyphKonturen(atom.text, atom.font)
            .map(poly => poly.map(p => [p[0] * s + atom.left, p[1] * s + atom.baseline]));
    }

    // ── A stroke as an area ─────────────────────────────────────────────────
    // To fill the morph, both sides must be areas. A handwritten stroke is a
    // line, so it gets an outline: offset to the left along the way out, to the
    // right along the way back.
    function strichZuFlaeche(pts, breite) {
        const halb = Math.max(1.2, (breite || 3) / 2);
        const links = [], rechts = [];
        for (let i = 0; i < pts.length; i++) {
            const vor = pts[Math.max(0, i - 1)], nach = pts[Math.min(pts.length - 1, i + 1)];
            const dx = nach[0] - vor[0], dy = nach[1] - vor[1];
            const L = Math.hypot(dx, dy) || 1;
            const nx = -dy / L * halb, ny = dx / L * halb;
            links.push([pts[i][0] + nx, pts[i][1] + ny]);
            rechts.push([pts[i][0] - nx, pts[i][1] - ny]);
        }
        return links.concat(rechts.reverse());
    }

    // Rotate a closed polygon so its first point is the one nearest `pt` -
    // otherwise the ink visibly twists around the glyph on its way there.
    function startAt(poly, pt) {
        let best = 0, bestD = Infinity;
        for (let i = 0; i < poly.length; i++) {
            const dx = poly[i][0] - pt[0], dy = poly[i][1] - pt[1];
            const d = dx * dx + dy * dy;
            if (d < bestD) { bestD = d; best = i; }
        }
        return poly.slice(best).concat(poly.slice(0, best));
    }

    function laenge(pts) {
        let L = 0;
        for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        return L;
    }

    // ── Pairing one symbol's strokes with one atom's outlines ───────────────
    // A symbol is a handful of strokes; a glyph is one or more closed outlines.
    // Longest to longest, so the ink that carries the most length becomes the
    // biggest part of the letter. When the counts differ, the extra side is
    // cycled - with nonzero fill two coincident areas simply cover each other.
    function paare(symbol, strokes, ziele) {
        const quellen = symbol.strokeIdxs
            .map(i => strokes[i])
            .filter(s => s && s.points.length > 1)
            .map(s => strichZuFlaeche(s.points.map(p => [p.x, p.y]), s.width));
        if (!quellen.length || !ziele.length) return [];

        const qs = quellen.map(p => ({ pts: p, L: laenge(p) })).sort((a, b) => b.L - a.L);
        const zs = ziele.map(p => ({ pts: p, L: laenge(p) })).sort((a, b) => b.L - a.L);
        const n = Math.max(qs.length, zs.length);
        const out = [];
        for (let i = 0; i < n; i++) {
            const q = qs[i % qs.length].pts, z = zs[i % zs.length].pts;
            const N = Math.max(32, Math.min(200, Math.round((q.length + z.length) / 2)));
            const qq = resamplePolygon(q, N);
            const zz = startAt(resamplePolygon(z, N), qq[0]);
            out.push({ von: qq, nach: zz });
        }
        return out;
    }

    // Everything needed to animate one row. `zuordnung.paare[i]` pairs
    // line.symbols[i] with an atom (as `token`, see formel-erkennen.ordneZu).
    function vorbereiten(line, strokes, zuordnung) {
        return zuordnung.paare.map(p => {
            const atom = p.token;
            if (!atom || typeof atom !== 'object') return null;
            const ziele = zielFlaechen(atom);
            if (!ziele.length) return null;
            return { atom, symbol: p.symbol, teile: paare(p.symbol, strokes, ziele) };
        }).filter(Boolean);
    }

    // Smooth start and end: "kaum merkbar" must not jerk into motion.
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function mischen(a, b, t) {
        const p = c => {
            const m = c.match(/\d+/g);
            if (m && m.length >= 3) return m.slice(0, 3).map(Number);
            const h = c.replace('#', '');
            return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
        };
        const A = p(a), B = p(b);
        return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
    }

    // Draw one row at progress t (0 = handwriting, 1 = typeset). Filled, nonzero
    // winding: a glyph written with two strokes sends both onto the same
    // outline, and even-odd would cancel them out. Holes survive because the
    // tracer winds them the other way.
    function zeichnen(ctx, vorbereitet, t, opts) {
        const o = Object.assign({ farbe: '#adff2f', zielFarbe: '#00d2ff' }, opts || {});
        const e = ease(Math.max(0, Math.min(1, t)));
        ctx.save();
        ctx.fillStyle = mischen(o.farbe, o.zielFarbe, e);
        for (const g of vorbereitet) {
            ctx.beginPath();
            for (const teil of g.teile) {
                for (let i = 0; i < teil.von.length; i++) {
                    const x = teil.von[i][0] + (teil.nach[i][0] - teil.von[i][0]) * e;
                    const y = teil.von[i][1] + (teil.nach[i][1] - teil.von[i][1]) * e;
                    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                }
                ctx.closePath();
            }
            ctx.fill();
        }
        ctx.restore();
    }

    const api = { glyphKonturen, zielFlaechen, vorbereiten, zeichnen, schriftenBereit, strichZuFlaeche, ease, RENDER };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.HandschriftMorph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
