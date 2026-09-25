// Handwriting morphing into type - as STROKES, all the way.
//
// Doc, 25.09.2026, about the first morph: "alles durchdringt sich". It moved
// areas: each pen stroke was outlined into a thin ribbon and that ribbon was
// dragged point by point onto the closed outline of the glyph. A ribbon's two
// sides cannot land on one outline without crossing half-way, and glyphs with
// holes (a, b, 4) made it worse: spikes, wedges, torn letters. Libraries do not
// fix that - flubber lists holes, self-intersection and open lines as unsolved,
// GSAP's rotational morph still maps outline to outline.
//
// So this does not morph areas at all. A pen stroke IS a line; a glyph has one
// too - its skeleton (medial axis). The pen line bends into the skeleton line,
// and while it does, its width grows from the pen's to the width the glyph has
// at that very spot (distance transform). At the end the skeleton, drawn that
// wide, IS the glyph - measured on KaTeX glyphs incl. ∑, π and the root sign:
// indistinguishable by eye, the difference is edge pixels (slightly rounder
// serifs). Nothing ever has to be squeezed onto anything, and nothing fades.
//
// Two more things from the shape-blending literature:
//   - Motion and deformation are interpolated apart: each glyph glides as a
//     whole (centre, scale) and deforms in its own frame. Neighbours no longer
//     fly through each other.
//   - Glyphs start one after the other, left to right, like writing.
//
// Needs, loaded before it: morpheus/vendor/trace_skeleton.js (TraceSkeleton)
// and js/handschrift-morph.js (glyph outlines for the final frame).

(function (root) {
    'use strict';

    const R = 220;                      // render size for glyphs, as in handschrift-morph
    const N = 48;                       // points per matched line
    const CACHE = new Map();

    // ── Glyph → skeleton lines with a radius at every point ─────────────────
    function binaerbild(zeichnen, W, H) {
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#fff';
        zeichnen(x);
        const px = x.getImageData(0, 0, W, H).data;
        const bin = new Array(W * H);
        for (let i = 0; i < W * H; i++) bin[i] = px[i * 4] > 128 ? 1 : 0;
        return bin;
    }

    // Distance to the nearest background pixel, chamfer 3-4 (divide by 3 for px).
    function abstand(bin, W, H) {
        const d = new Float32Array(W * H);
        for (let i = 0; i < W * H; i++) d[i] = bin[i] ? 1e9 : 0;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const i = y * W + x; if (!d[i]) continue;
            if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 3);
            if (y > 0) d[i] = Math.min(d[i], d[i - W] + 3);
            if (x > 0 && y > 0) d[i] = Math.min(d[i], d[i - W - 1] + 4);
            if (x < W - 1 && y > 0) d[i] = Math.min(d[i], d[i - W + 1] + 4);
        }
        for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
            const i = y * W + x; if (!d[i]) continue;
            if (x < W - 1) d[i] = Math.min(d[i], d[i + 1] + 3);
            if (y < H - 1) d[i] = Math.min(d[i], d[i + W] + 3);
            if (x < W - 1 && y < H - 1) d[i] = Math.min(d[i], d[i + W + 1] + 4);
            if (x > 0 && y < H - 1) d[i] = Math.min(d[i], d[i + W - 1] + 4);
        }
        return d;
    }

    const lang = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); return L; };

    // The tracer hands back fragments; join them into long lines. Ends that meet
    // are one node; through a node of two the line simply continues, through a
    // junction it continues in the straightest direction - so an "x" becomes two
    // diagonals, not four half-arms.
    function ketten(polys, tol, radAn) {
        const segs = polys.filter(p => p.length >= 2).map(p => p.map(q => ({ x: q[0], y: q[1] })));
        const knoten = [];
        const knotenVon = pt => {
            for (let k = 0; k < knoten.length; k++) if (Math.hypot(knoten[k].x - pt.x, knoten[k].y - pt.y) <= tol) return k;
            knoten.push({ x: pt.x, y: pt.y }); return knoten.length - 1;
        };
        let kanten = segs.map(p => ({ p, a: knotenVon(p[0]), b: knotenVon(p[p.length - 1]), frei: true }));
        // Spurs. The tracer leaves short dead ends where a stroke comes to a
        // point or turns sharply - into the tip of the root's V, at its tick -
        // and turns plain corners into crossings. A dead end shorter than three
        // times the stroke's half width where it branches off goes; the serifs
        // of the typeface go with it, and Doc does not write serifs anyway.
        // Only at a corner, though: a short arm that leaves a line running
        // straight through the node is a real stroke - the bar of an f or a t.
        const wegVon = (k, n) => {          // direction out of node n along edge k
            const p = k.a === n ? k.p : k.p.slice().reverse(), m = Math.min(6, p.length - 1);
            const dx = p[m].x - p[0].x, dy = p[m].y - p[0].y, L = Math.hypot(dx, dy) || 1;
            return { x: dx / L, y: dy / L };
        };
        if (radAn) {
            for (let runde = 0; runde < 2; runde++) {
                const g = new Array(knoten.length).fill(0);
                kanten.forEach(k => { g[k.a]++; g[k.b]++; });
                const weg = new Set();
                kanten.forEach(k => {
                    const offen = g[k.a] === 1 ? k.b : g[k.b] === 1 ? k.a : -1;   // the end that branches off
                    if (offen < 0 || g[offen] < 3) return;
                    if (lang(k.p) >= 3 * radAn(knoten[offen].x, knoten[offen].y)) return;
                    const andere = kanten.filter(e => e !== k && (e.a === offen || e.b === offen)).map(e => wegVon(e, offen));
                    for (let i = 0; i < andere.length; i++) for (let j = i + 1; j < andere.length; j++)
                        if (andere[i].x * andere[j].x + andere[i].y * andere[j].y < -0.85) return;   // straight through
                    weg.add(k);
                });
                kanten = kanten.filter(k => !weg.has(k));
            }
        }
        // How many line ends meet at a node. Where exactly two meet it is just a
        // corner, however sharp - the root's tick, its V, its turn into the bar
        // (Doc, 25.09.: "stimmt mit dem Wurzelzeichen was fundamental nicht" -
        // the root came apart in three pieces and morphed into an x).
        const grad = new Array(knoten.length).fill(0);
        kanten.forEach(k => { grad[k.a]++; grad[k.b]++; });
        const richtungAm = (p, amEnde) => {
            const n = Math.min(6, p.length - 1);
            const A = amEnde ? p[p.length - 1 - n] : p[n], B = amEnde ? p[p.length - 1] : p[0];
            const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
            return { x: dx / L, y: dy / L };         // pointing OUT of the segment at that end
        };
        const out = [];
        for (const start of kanten) {
            if (!start.frei) continue;
            start.frei = false;
            let pts = start.p.slice();
            // grow at both ends
            for (const seite of ['ende', 'anfang']) {
                let knot = seite === 'ende' ? start.b : start.a;
                for (let guard = 0; guard < 50; guard++) {
                    const hier = seite === 'ende' ? richtungAm(pts, true) : richtungAm(pts, false);
                    let best = null;
                    for (const k of kanten) {
                        if (!k.frei || (k.a !== knot && k.b !== knot)) continue;
                        const vorwaerts = k.a === knot;      // walk k from a to b
                        const q = vorwaerts ? k.p : k.p.slice().reverse();
                        const weg = richtungAm(q, false);    // out of k at its near end, i.e. into k reversed
                        const cos = -(hier.x * weg.x + hier.y * weg.y);   // straight on = 1
                        if (!best || cos > best.cos) best = { k, q, cos };
                    }
                    // a corner always goes on; at a crossing only straight on
                    if (!best || (grad[knot] > 2 && best.cos < 0.2)) break;
                    best.k.frei = false;
                    if (seite === 'ende') { pts = pts.concat(best.q.slice(1)); knot = best.k.a === knot ? best.k.b : best.k.a; }
                    else { pts = best.q.slice().reverse().concat(pts.slice(1)); knot = best.k.a === knot ? best.k.b : best.k.a; }
                }
            }
            if (lang(pts) >= 3) out.push(pts);
        }
        return out;
    }

    // The pieces of a glyph (8-connected), and in each the pixel deepest inside.
    function stuecke(bin, W, H, d) {
        const label = new Int32Array(W * H), tief = [];
        let n = 0;
        const stapel = [];
        for (let i0 = 0; i0 < W * H; i0++) {
            if (!bin[i0] || label[i0]) continue;
            n++;
            let groesse = 0, best = i0;
            label[i0] = n; stapel.push(i0);
            while (stapel.length) {
                const i = stapel.pop(), x = i % W, y = (i - x) / W;
                groesse++;
                if (d[i] > d[best]) best = i;
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                    const xx = x + dx, yy = y + dy;
                    if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
                    const j = yy * W + xx;
                    if (bin[j] && !label[j]) { label[j] = n; stapel.push(j); }
                }
            }
            tief[n] = { i: best, groesse };
        }
        return { label, tief, n };
    }

    function skelettAus(bin, W, H, umrechnen) {
        const d = abstand(bin, W, H);
        const sk = TraceSkeleton.fromBoolArray(bin.slice(), W, H);
        const rad = (x, y) => d[Math.max(0, Math.min(H - 1, Math.round(y))) * W + Math.max(0, Math.min(W - 1, Math.round(x)))] / 3;
        const linien = ketten(sk.polylines || [], 2.5, rad);
        // A dot thins down to nothing and the tracer leaves it out - the i's
        // and j's dot, \cdot had no line at all (Doc's sheet of centre lines,
        // 25.09.). Every piece of the glyph without a line gets one: a single
        // spot where it is deepest, as wide as the piece.
        const st = stuecke(bin, W, H, d);
        const hat = new Uint8Array(st.n + 1);
        linien.forEach(l => l.forEach(q => {
            const x = Math.round(q.x), y = Math.round(q.y);
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                const xx = x + dx, yy = y + dy;
                if (xx >= 0 && yy >= 0 && xx < W && yy < H && st.label[yy * W + xx]) hat[st.label[yy * W + xx]] = 1;
            }
        }));
        for (let c = 1; c <= st.n; c++) {
            if (hat[c] || st.tief[c].groesse < 6) continue;            // covered, or antialiasing dust
            const i = st.tief[c].i, x = i % W, y = (i - x) / W;
            linien.push([{ x, y }, { x: x + 0.5, y }]);
        }
        return linien.map(p => p.map(q => umrechnen(q.x, q.y, rad(q.x, q.y))));
    }

    // Skeleton of a text atom, in the same frame as the glyph outlines of
    // handschrift-morph: relative to the pen position, at R px.
    function textSkelett(atom) {
        const key = 'T|' + atom.font.family + '|' + atom.font.style + '|' + atom.text;
        if (CACHE.has(key)) return CACHE.get(key);
        const W = R * 3, H = R * 2, X0 = R * 0.5, Y0 = R * 1.3;
        const bin = binaerbild(x => {
            x.font = `${atom.font.style === 'italic' ? 'italic ' : ''}400 ${R}px "${atom.font.family}", "Times New Roman", serif`;
            x.textAlign = 'left'; x.textBaseline = 'alphabetic';
            x.fillText(atom.text, X0, Y0);
        }, W, H);
        const lines = skelettAus(bin, W, H, (x, y, r) => ({ x: x - X0, y: y - Y0, r }));
        CACHE.set(key, lines);
        return lines;
    }

    // Skeleton of an SVG atom (root, arrow), relative to its box (0..1) - the
    // outline polygons come from HandschriftMorph.svgVorbereiten.
    function svgSkelett(atom) {
        const key = 'S|' + atom.svg + '|' + (atom.box.w / atom.box.h).toFixed(3);
        if (CACHE.has(key)) return CACHE.get(key);
        const Hi = 300, Wi = Math.max(40, Math.round(Hi * atom.box.w / atom.box.h)), P = 8;
        const bin = binaerbild(x => {
            x.beginPath();
            (atom.normPolys || []).forEach(p => p.forEach((q, i) => {
                const X = P + q[0] * Wi, Y = P + q[1] * Hi; i ? x.lineTo(X, Y) : x.moveTo(X, Y);
            }));
            x.fill('evenodd');
        }, Wi + 2 * P, Hi + 2 * P);
        const lines = skelettAus(bin, Wi + 2 * P, Hi + 2 * P, (x, y, r) => ({ x: (x - P) / Wi, y: (y - P) / Hi, r: r / Hi }));
        CACHE.set(key, lines);
        return lines;
    }

    // Target lines of one atom, in page coordinates, radius in page px.
    function zielLinien(atom) {
        if (atom.art === 'line') {
            const b = atom.box, y = b.y + b.h / 2, r = Math.max(0.75, b.h / 2);
            return [[{ x: b.x, y, r }, { x: b.x + b.w, y, r }]];
        }
        if (atom.art === 'svg') {
            const b = atom.box;
            return svgSkelett(atom).map(l => l.map(q => ({ x: b.x + q.x * b.w, y: b.y + q.y * b.h, r: q.r * b.h })));
        }
        const s = atom.font.size / R;
        return textSkelett(atom).map(l => l.map(q => ({ x: atom.left + q.x * s, y: atom.baseline + q.y * s, r: q.r * s })));
    }

    // ── Resampling and matching ─────────────────────────────────────────────
    function nachLaenge(pts, n) {
        if (pts.length === 1) return Array.from({ length: n }, () => Object.assign({}, pts[0]));
        const cum = [0];
        for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
        const L = cum[cum.length - 1] || 1, out = [];
        let j = 1;
        for (let k = 0; k < n; k++) {
            const s = L * k / (n - 1);
            while (j < pts.length - 1 && cum[j] < s) j++;
            const a = pts[j - 1], b = pts[j], seg = (cum[j] - cum[j - 1]) || 1, f = Math.max(0, Math.min(1, (s - cum[j - 1]) / seg));
            out.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, r: a.r + (b.r - a.r) * f });
        }
        return out;
    }

    function rahmen(lines) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        lines.forEach(l => l.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }));
        const w = Math.max(1e-6, x1 - x0), h = Math.max(1e-6, y1 - y0);
        return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, s: Math.max(w, h) };
    }

    // Pair the pen lines of one symbol with the skeleton lines of its glyph.
    // Compared in each side's own frame, so shape decides, not position. Each
    // target may be taken in either direction. Left over pen lines shrink into
    // the glyph; left over skeleton lines grow out of the ink.
    function paare(quellen, ziele) {
        const fq = rahmen(quellen), fz = rahmen(ziele);
        const Q = quellen.map(l => nachLaenge(l, N)), Z = ziele.map(l => nachLaenge(l, N));
        const norm = (p, f) => ({ x: (p.x - f.cx) / f.s, y: (p.y - f.cy) / f.s });
        const kosten = (q, z) => { let s = 0; for (let i = 0; i < N; i++) { const a = norm(q[i], fq), b = norm(z[i], fz); s += Math.hypot(a.x - b.x, a.y - b.y); } return s / N; };
        const kand = [];
        Q.forEach((q, i) => Z.forEach((z, j) => {
            const zr = z.slice().reverse();
            const c1 = kosten(q, z), c2 = kosten(q, zr);
            kand.push(c1 <= c2 ? { i, j, c: c1, z } : { i, j, c: c2, z: zr });
        }));
        kand.sort((a, b) => a.c - b.c);
        const qFrei = new Set(Q.map((_, i) => i)), zFrei = new Set(Z.map((_, j) => j)), out = [];
        for (const k of kand) {
            if (!qFrei.has(k.i) || !zFrei.has(k.j)) continue;
            qFrei.delete(k.i); zFrei.delete(k.j);
            out.push({ von: Q[k.i], nach: k.z });
        }
        // ink with no line to go to: it shrinks onto the nearest glyph point
        const alleZ = Z.flat();
        qFrei.forEach(i => {
            const mitte = Q[i][N >> 1];
            let best = alleZ[0], bd = Infinity;
            alleZ.forEach(p => { const d = Math.hypot(p.x - mitte.x, p.y - mitte.y); if (d < bd) { bd = d; best = p; } });
            out.push({ von: Q[i], nach: Array.from({ length: N }, () => ({ x: best.x, y: best.y, r: 0 })) });
        });
        // glyph lines with no ink: they grow out of the nearest ink point
        const alleQ = Q.flat();
        zFrei.forEach(j => {
            const z = Z[j];
            let best = alleQ[0], bd = Infinity, ende = 0;
            [z[0], z[N - 1]].forEach((e, k) => alleQ.forEach(p => { const d = Math.hypot(p.x - e.x, p.y - e.y); if (d < bd) { bd = d; best = p; ende = k; } }));
            const zz = ende ? z.slice().reverse() : z;
            out.push({ von: Array.from({ length: N }, () => ({ x: best.x, y: best.y, r: 0 })), nach: zz });
        });
        return { teile: out, fq, fz };
    }

    // ── Preparing a row ─────────────────────────────────────────────────────
    function vorbereiten(line, strokes, zuordnung) {
        return zuordnung.paare.map((p, idx) => {
            const atom = p.token;
            if (!atom || typeof atom !== 'object') return null;
            const ziele = zielLinien(atom).filter(l => l.length);
            if (!ziele.length) return null;
            const quellen = p.symbol.strokeIdxs
                .map(i => strokes[i])
                .filter(s => s && s.points.length)
                .map(s => { const r = Math.max(1, (s.width || 3) / 2); return s.points.map(q => ({ x: q.x, y: q.y, r })); });
            if (!quellen.length) return null;
            const { teile, fq, fz } = paare(quellen, ziele);
            // the glyph's own frame (centre + size) for gliding
            const bq = rahmen(quellen), bz = rahmen(ziele);
            return { atom, idx, teile, von: bq, nach: bz };
        }).filter(Boolean);
    }

    // Smooth start and end - "kaum merkbar" must not jerk into motion.
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function mischen(a, b, t) {
        const p = c => { const m = c.match(/\d+/g); if (m && m.length >= 3) return m.slice(0, 3).map(Number);
            const h = c.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
        const A = p(a), B = p(b);
        return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
    }

    // Draw a row at progress t. Staggered: glyph k starts a little after glyph
    // k-1, left to right. Each point: glyph frame glides (centre linear, size
    // geometric), shape interpolated in that frame, radius interpolated.
    function zeichnen(ctx, vorbereitet, t, opts) {
        const o = Object.assign({ farbe: '#adff2f', zielFarbe: '#00d2ff', staffel: 0.35 }, opts || {});
        const n = vorbereitet.length;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        vorbereitet.forEach((g, k) => {
            const start = n > 1 ? o.staffel * k / (n - 1) : 0;
            const lt = Math.max(0, Math.min(1, (t - start) / (1 - o.staffel)));
            const e = ease(lt);
            const farbe = mischen(o.farbe, o.zielFarbe, e);
            if (e >= 1 && typeof HandschriftMorph !== 'undefined') {
                // at rest: the true outline, not the skeleton's rounder copy
                ctx.fillStyle = farbe;
                ctx.beginPath();
                HandschriftMorph.zielFlaechen(g.atom).forEach(poly => { poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); });
                ctx.fill();
                return;
            }
            const cx = g.von.cx + (g.nach.cx - g.von.cx) * e, cy = g.von.cy + (g.nach.cy - g.von.cy) * e;
            const sc = g.von.s * Math.pow(g.nach.s / g.von.s, e);
            ctx.strokeStyle = farbe;
            ctx.fillStyle = farbe;
            for (const teil of g.teile) {
                let prev = null;
                for (let i = 0; i < N; i++) {
                    const a = teil.von[i], b = teil.nach[i];
                    const qx = (a.x - g.von.cx) / g.von.s + (((b.x - g.nach.cx) / g.nach.s) - ((a.x - g.von.cx) / g.von.s)) * e;
                    const qy = (a.y - g.von.cy) / g.von.s + (((b.y - g.nach.cy) / g.nach.s) - ((a.y - g.von.cy) / g.von.s)) * e;
                    const p = { x: cx + qx * sc, y: cy + qy * sc, r: a.r + (b.r - a.r) * e };
                    if (prev) {
                        ctx.lineWidth = Math.max(0.5, prev.r + p.r);
                        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
                    } else if (p.r > 0.3) {
                        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                    }
                    prev = p;
                }
            }
        });
        ctx.restore();
    }

    const api = { vorbereiten, zeichnen, zielLinien, textSkelett, svgSkelett, ketten, ease };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StrichMorph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
