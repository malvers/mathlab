// Morphing handwriting into typeset glyphs.
//
// Doc's dream, in his words: "meine in LT faden (morph nicht transp)" — the
// handwriting must DEFORM into the typeset form, not fade out while the printed
// version fades in. So nothing here touches opacity; every point travels.
//
// This is only possible because the mapping is already known: js/formel-erkennen.js
// pairs each stroke-group with its LaTeX token, so we know which ink becomes which
// glyph. morpheus/ had the morph but had to guess that pairing from geometry —
// which is exactly where it failed.
//
// Target shapes come from the same route morpheus uses as its fallback: render
// the glyph, then trace it with marching squares (morpheus/contours.js). Source
// and target are then resampled to the same number of points and interpolated.
//
// Needs, loaded before it: morpheus/geometry.js (resamplePolygon, centroid,
// bboxOf) and morpheus/contours.js (getContoursWithHoles, sortContoursCanonical).

(function (root) {
    'use strict';

    const CACHE = new Map();

    // Glyphs a mathematician expects: upright digits and operators, italic
    // letters - the same convention LaTeX follows.
    function fontFor(token) {
        const t = String(token);
        const italic = /^[a-zA-Z]$/.test(t) ? 'italic ' : '';
        return `${italic}400 %SIZE%px "Times New Roman", "Latin Modern Roman", serif`;
    }

    // What a token should look like on screen. LaTeX commands are drawn as the
    // symbol they stand for, not as their spelling.
    const GLYPH = {
        '\\cdot': '·', '\\times': '×', '\\div': '÷', '\\pm': '±',
        '\\pi': 'π', '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\theta': 'θ',
        '\\lambda': 'λ', '\\mu': 'μ', '\\sigma': 'σ', '\\omega': 'ω',
        '\\sqrt': '√', '\\sum': 'Σ', '\\int': '∫', '\\infty': '∞',
        '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
        '\\frac': '—', '\\cdots': '⋯',
    };

    function glyphOf(token) {
        const t = String(token || '').trim();
        return GLYPH[t] || t.replace(/^\\/, '');
    }

    // ── Target outline ──────────────────────────────────────────────────────
    // Render the glyph big, trace it, keep the outlines. Big because marching
    // squares works on pixels: too small and the curves go jagged.
    function zielKonturen(token, opts) {
        const o = Object.assign({ size: 220, pad: 40 }, opts || {});
        const key = token + '@' + o.size;
        if (CACHE.has(key)) return CACHE.get(key);

        const g = glyphOf(token);
        const W = o.size * 2, H = o.size * 2;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = fontFor(token).replace('%SIZE%', o.size);
        ctx.textAlign = 'center';
        // Alphabetic baseline, not "middle": that way a "y" keeps its descender
        // and every glyph can be placed on one shared baseline later.
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(g, W / 2, H * 0.72);

        const px = ctx.getImageData(0, 0, W, H).data;
        const grid = new Uint8Array(W * H);
        for (let i = 0, p = 0; i < px.length; i += 4, p++) grid[p] = px[i] > 128 ? 1 : 0;

        let polys = [];
        try {
            polys = getContoursWithHoles(grid, W, H) || [];
            if (typeof sortContoursCanonical === 'function') polys = sortContoursCanonical(polys);
        } catch (e) {
            polys = [];
        }
        polys = polys.filter(p => p && p.length >= 8);
        CACHE.set(key, polys);
        return polys;
    }

    // ── Bringing both sides into the same frame ─────────────────────────────
    function bbox(points) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of points) {
            const x = p[0] !== undefined ? p[0] : p.x, y = p[0] !== undefined ? p[1] : p.y;
            if (x < x0) x0 = x; if (y < y0) y0 = y;
            if (x > x1) x1 = x; if (y > y1) y1 = y;
        }
        return { x: x0, y: y0, w: Math.max(1e-6, x1 - x0), h: Math.max(1e-6, y1 - y0) };
    }

    // Place a glyph outline: ONE scale for the whole row, so every character comes
    // out at the same type size - a "3" tall, an "x" small, exactly as in a
    // typeset line. Squeezing each glyph into the box of its own handwriting
    // would make the "x" tiny just because Doc wrote it narrow, and that is the
    // opposite of his "alles auf eine Größe bringen".
    //
    // `skala` converts from the rendering canvas into page units; `mitteX` and
    // `grundlinie` say where this glyph sits.
    function platzieren(polys, skala, mitteX, grundlinie, renderMitte) {
        return polys.map(poly => poly.map(pt => {
            const x = pt[0] !== undefined ? pt[0] : pt.x, y = pt[0] !== undefined ? pt[1] : pt.y;
            return [(x - renderMitte.x) * skala + mitteX,
                    (y - renderMitte.y) * skala + grundlinie];
        }));
    }

    // Height of a reference glyph at a given render size - the yardstick that
    // turns "this row should be N pixels tall" into one scale for all glyphs.
    function referenzHoehe(size) {
        const polys = zielKonturen('8', { size });
        const all = [].concat(...polys);
        return all.length ? bbox(all).h : size * 0.7;
    }

    // Rotate a closed polygon so its first point is the one nearest to `pt`.
    // Without this the ink would visibly twist around the glyph on its way there.
    function startAt(poly, pt) {
        let best = 0, bestD = Infinity;
        for (let i = 0; i < poly.length; i++) {
            const dx = poly[i][0] - pt[0], dy = poly[i][1] - pt[1];
            const d = dx * dx + dy * dy;
            if (d < bestD) { bestD = d; best = i; }
        }
        return poly.slice(best).concat(poly.slice(0, best));
    }

    // ── Pairing the strokes with the outlines ───────────────────────────────
    // A symbol is a handful of open strokes; a glyph is one or more closed
    // outlines. Both get cut into the same number of pieces, longest to longest,
    // so the ink that carries the most length becomes the biggest part of the
    // letter.
    function paare(symbol, strokes, zielPolys, platz) {
        const quellen = symbol.strokeIdxs
            .map(i => strokes[i])
            .filter(s => s && s.points.length > 1)
            .map(s => s.points.map(p => [p.x, p.y]));
        if (!quellen.length || !zielPolys.length) return [];

        const ziele = platzieren(zielPolys, platz.skala, platz.mitteX, platz.grundlinie, platz.renderMitte);
        const laenge = pts => {
            let L = 0;
            for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
            return L;
        };
        const qs = quellen.map(p => ({ pts: p, L: laenge(p) })).sort((a, b) => b.L - a.L);
        const zs = ziele.map(p => ({ pts: p, L: laenge(p) })).sort((a, b) => b.L - a.L);

        const n = Math.max(qs.length, zs.length);
        const out = [];
        for (let i = 0; i < n; i++) {
            const q = qs[i % qs.length].pts;
            const z = zs[i % zs.length].pts;
            const N = Math.max(24, Math.min(160, Math.round((q.length + z.length) / 2)));
            const qq = resamplePolygon(q, N);
            const zz = startAt(resamplePolygon(z, N), qq[0]);
            out.push({ von: qq, nach: zz });
        }
        return out;
    }

    // Build everything needed to animate one row. Call once after recognition.
    function vorbereiten(line, strokes, zuordnung, opts) {
        const o = Object.assign({ hoehe: null, size: 220 }, opts || {});
        // One type size for the whole row. The yardstick is a reference digit, so
        // "3" comes out tall and "x" small - their natural proportions - instead
        // of each glyph being stretched into the box of its own handwriting.
        const zielHoehe = o.hoehe || median(line.symbols.map(s => s.bbox.h));
        const skala = zielHoehe / referenzHoehe(o.size);
        const renderMitte = { x: o.size, y: o.size * 2 * 0.72 };   // the baseline point
        // Sit the row on the baseline of the handwriting: a little above the
        // lowest ink, so descenders have room.
        const grundlinie = line.bbox.y + line.bbox.h * 0.82;

        return line.symbols.map((sym, i) => {
            const paar = zuordnung.paare[i];
            if (!paar) return null;
            const polys = zielKonturen(paar.token, { size: o.size });
            if (!polys.length) return null;
            const platz = { skala, mitteX: sym.bbox.x + sym.bbox.w / 2, grundlinie, renderMitte };
            return { token: paar.token, symbol: sym, teile: paare(sym, strokes, polys, platz) };
        }).filter(Boolean);
    }

    function median(vals) {
        if (!vals.length) return 0;
        const a = vals.slice().sort((x, y) => x - y), m = a.length >> 1;
        return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
    }

    // Smooth start and end - the morph should be "kaum merkbar", so it must not
    // jerk into motion.
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Draw one row at progress t (0 = handwriting, 1 = typeset).
    function zeichnen(ctx, vorbereitet, t, opts) {
        const o = Object.assign({ farbe: '#adff2f', zielFarbe: '#00d2ff', breite: 3 }, opts || {});
        const e = ease(Math.max(0, Math.min(1, t)));
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        vorbereitet.forEach(g => {
            g.teile.forEach(teil => {
                ctx.beginPath();
                for (let i = 0; i < teil.von.length; i++) {
                    const x = teil.von[i][0] + (teil.nach[i][0] - teil.von[i][0]) * e;
                    const y = teil.von[i][1] + (teil.nach[i][1] - teil.von[i][1]) * e;
                    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                }
                // The colour travels with the shape; no cross-fade, nothing is
                // drawn twice on top of itself.
                ctx.strokeStyle = mischen(o.farbe, o.zielFarbe, e);
                ctx.lineWidth = o.breite * (1 - e) + Math.max(1.5, o.breite * 0.6) * e;
                ctx.stroke();
            });
        });
        ctx.restore();
    }

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

    const api = { zielKonturen, vorbereiten, zeichnen, glyphOf, platzieren, referenzHoehe, ease };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.HandschriftMorph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
