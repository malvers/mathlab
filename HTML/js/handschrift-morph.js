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

    // The very fonts KaTeX sets with, so the morph ends in the same shapes the
    // formula below it shows. Doc asked why the "=" looked different: it was
    // Times New Roman against KaTeX's Computer Modern - two different faces, so
    // two different glyphs. KaTeX_Math is the italic one for variables,
    // KaTeX_Main the upright one for digits and operators, KaTeX_Caligraphic for
    // \mathcal. The files ship with the local KaTeX in morpheus/vendor.
    function fontFor(token) {
        const t = String(token);
        const istBuchstabe = /^[a-zA-Z]$/.test(t);
        const familie = istBuchstabe ? 'KaTeX_Math'
            : /^\\mathcal/.test(t) ? 'KaTeX_Caligraphic'
            : 'KaTeX_Main';
        // KaTeX_Math is declared as an italic face - without "italic" the browser
        // will not use it, and variables come out upright while the formula below
        // has them slanted.
        return `${istBuchstabe ? 'italic ' : ''}400 %SIZE%px "${familie}", "Times New Roman", serif`;
    }

    // Canvas draws nothing useful from a webfont that has not loaded yet - the
    // first glyph would come out in a fallback face and be traced wrong.
    async function schriftenBereit(size) {
        if (!document.fonts || !document.fonts.load) return;
        await Promise.all([
            `400 ${size}px "KaTeX_Main"`,
            `italic 400 ${size}px "KaTeX_Math"`,      // the italic face, see fontFor
            `400 ${size}px "KaTeX_Caligraphic"`,
        ].map(f => document.fonts.load(f).catch(() => {})));
    }

    // ── A stroke as an area ─────────────────────────────────────────────────
    // To fill the morph, both sides must be areas. A handwritten stroke is a
    // line, so it gets an outline: offset to the left along the way out, to the
    // right along the way back. Then a filled stroke morphs into a filled glyph,
    // with no fading anywhere.
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
            // Outlined, so the ink is an area like the glyph it becomes.
            .map(s => strichZuFlaeche(s.points.map(p => [p.x, p.y]), s.width));
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
        const grundlinie = line.bbox.y + line.bbox.h * 0.82;

        // Where each glyph ENDS UP is a typesetting question, not a handwriting
        // one. Putting the "(" where Doc drew it makes it collide with the "x",
        // because a set bracket is wider than his. So lay the row out properly:
        // measure every glyph, then walk from left to right with real spacing.
        const gesetzt = line.symbols.map((sym, i) => {
            const paar = zuordnung.paare[i];
            if (!paar) return null;
            const polys = zielKonturen(paar.token, { size: o.size });
            if (!polys.length) return null;
            const all = [].concat(...polys);
            const b = bbox(all);
            return { paar, polys, sym, breite: b.w * skala, versatz: (b.x + b.w / 2 - renderMitte.x) * skala };
        });

        // Operators breathe, digits and letters sit close - the usual convention.
        const luft = t => (/^[=+\-<>]$|^\\(times|cdot|div|pm|leq|geq|neq|approx)$/.test(t)
            ? zielHoehe * 0.28 : zielHoehe * 0.10);

        let x = line.bbox.x;
        const plaetze = gesetzt.map((g, i) => {
            if (!g) return null;
            const vorher = i > 0 && gesetzt[i - 1] ? Math.max(luft(gesetzt[i - 1].paar.token), luft(g.paar.token)) : 0;
            x += vorher;
            const mitteX = x + g.breite / 2 - g.versatz;
            x += g.breite;
            return mitteX;
        });

        return gesetzt.map((g, i) => {
            if (!g) return null;
            const platz = { skala, mitteX: plaetze[i], grundlinie, renderMitte };
            return { token: g.paar.token, symbol: g.sym, teile: paare(g.sym, strokes, g.polys, platz) };
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
        const o = Object.assign({ farbe: '#adff2f', zielFarbe: '#00d2ff' }, opts || {});
        const e = ease(Math.max(0, Math.min(1, t)));
        ctx.save();
        ctx.fillStyle = mischen(o.farbe, o.zielFarbe, e);
        vorbereitet.forEach(g => {
            // All pieces of one glyph in one path. Nonzero winding, NOT even-odd:
            // a glyph drawn with two strokes sends both onto the same outline,
            // and even-odd would cancel the two coincident areas out - which is
            // why x, +, 5 and y vanished. Holes still work, because the tracer
            // returns them wound the other way.
            ctx.beginPath();
            g.teile.forEach(teil => {
                for (let i = 0; i < teil.von.length; i++) {
                    const x = teil.von[i][0] + (teil.nach[i][0] - teil.von[i][0]) * e;
                    const y = teil.von[i][1] + (teil.nach[i][1] - teil.von[i][1]) * e;
                    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                }
                ctx.closePath();
            });
            ctx.fill();
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

    const api = { zielKonturen, vorbereiten, zeichnen, glyphOf, platzieren, referenzHoehe,
                  schriftenBereit, strichZuFlaeche, ease };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.HandschriftMorph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
