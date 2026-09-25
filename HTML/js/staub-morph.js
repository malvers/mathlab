// Handwriting turns to dust, and the dust settles into the typeset formula.
//
// Doc, 25.09.2026 (Plan B): "wir pulverisieren meine Linie und lassen aus dem
// Pulver LaTeX entstehen" - and then: "beim Pulver brauchen wir nur eine
// Wolke: Linie -> Pulver -> LaTeX".
//
// So a whole row is ONE cloud. Its ink is sampled into N grains (along the pen
// strokes, inside the pen's width), its typeset glyphs into the same N grains
// (spread over their areas). Which grain goes where is Doc's other idea: zoom
// both to the same size, then pair the points so that as few paths as possible
// cross. With squared distance as the cost, an assignment in which no swap of
// two partners is cheaper has a neat property - on straight paths no two
// grains are ever at the same place at the same time.
//
// Each grain flies from its ink spot through a spot in the cloud (between the
// two, scattered and lifted a little) to its glyph spot. It leaves when the
// "wave" reaches it, left to right. A glyph snaps to its true outline once all
// of its grains have arrived.
//
// Nothing here needs the grouping to be right - only the typeset atoms and
// the row's strokes. Needs, loaded before it: js/handschrift-morph.js.

(function (root) {
    'use strict';

    // Seeded, so the same row always crumbles the same way.
    function zufall(seed) {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const gauss = rnd => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());

    // ── Grains on the ink ───────────────────────────────────────────────────
    // Stratified along the total pen length, each grain somewhere inside the
    // pen's width. A tap (dot) has no length; it counts as long as it is wide.
    function tinteKoerner(quellen, n, rnd) {
        const teile = [];
        let L = 0;
        quellen.forEach(s => {
            const w = s.width || 3, p = s.points;
            let eigen = 0;
            for (let i = 1; i < p.length; i++) eigen += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
            if (eigen < w) { teile.push({ tupf: p[0], w, l: w, L0: L }); L += w; return; }
            for (let i = 1; i < p.length; i++) {
                const l = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
                if (l <= 0) continue;
                teile.push({ a: p[i - 1], b: p[i], w, l, L0: L });
                L += l;
            }
        });
        const out = [];
        let j = 0;
        for (let k = 0; k < n; k++) {
            const s = (k + rnd()) / n * L;
            while (j < teile.length - 1 && teile[j].L0 + teile[j].l < s) j++;
            const t = teile[j], f = Math.max(0, Math.min(1, (s - t.L0) / t.l));
            const x = t.tupf ? t.tupf.x : t.a.x + (t.b.x - t.a.x) * f;
            const y = t.tupf ? t.tupf.y : t.a.y + (t.b.y - t.a.y) * f;
            const wi = rnd() * Math.PI * 2, ra = Math.sqrt(rnd()) * t.w * 0.4;
            out.push({ x: x + Math.cos(wi) * ra, y: y + Math.sin(wi) * ra, w: t.w });
        }
        return { koerner: out, L };
    }

    // ── Grains on a glyph ───────────────────────────────────────────────────
    // The outline is filled on a scratch canvas; the grains sit on a jittered
    // grid inside it, spaced so that about n of them fit.
    function glyphMaske(polys) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        polys.forEach(p => p.forEach(q => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }));
        const k = Math.max(1, Math.min(4, 240 / Math.max(1, x1 - x0, y1 - y0)));   // raster px per page px
        const W = Math.ceil((x1 - x0) * k) + 4, H = Math.ceil((y1 - y0) * k) + 4;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.fillStyle = '#fff';
        g.beginPath();
        polys.forEach(p => { p.forEach((q, i) => { const X = (q[0] - x0) * k + 2, Y = (q[1] - y0) * k + 2; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.closePath(); });
        g.fill();
        const px = g.getImageData(0, 0, W, H).data;
        const m = new Uint8Array(W * H);
        let P = 0;
        for (let i = 0; i < W * H; i++) if (px[i * 4 + 3] > 127) { m[i] = 1; P++; }
        return { m, W, H, k, x0, y0, flaeche: P / (k * k) };
    }

    function glyphKoerner(maske, n, rnd) {
        const { m, W, H, k, x0, y0, flaeche } = maske;
        let d = Math.sqrt(flaeche / Math.max(1, n)), pts = [];
        for (let runde = 0; runde < 4; runde++) {
            pts = [];
            const st = d * k;
            for (let gy = st / 2; gy < H; gy += st) for (let gx = st / 2; gx < W; gx += st) {
                const X = gx + (rnd() - 0.5) * st * 0.7, Y = gy + (rnd() - 0.5) * st * 0.7;
                const xi = Math.round(X), yi = Math.round(Y);
                if (xi >= 0 && yi >= 0 && xi < W && yi < H && m[yi * W + xi]) pts.push({ X, Y });
            }
            if (Math.abs(pts.length - n) <= Math.max(2, n * 0.03)) break;
            d *= Math.sqrt(Math.max(1, pts.length) / n);
        }
        // exactly n: drop at random, or add random ink pixels
        for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = pts[i]; pts[i] = pts[j]; pts[j] = t; }
        pts.length = Math.min(pts.length, n);
        for (let guard = 0; pts.length < n && guard < n * 400; guard++) {
            const X = rnd() * W, Y = rnd() * H;
            if (m[Math.floor(Y) * W + Math.floor(X)]) pts.push({ X, Y });
        }
        while (pts.length < n) pts.push(pts[pts.length % Math.max(1, pts.length)] || { X: W / 2, Y: H / 2 });
        return { koerner: pts.map(p => ({ x: x0 + (p.X - 2) / k, y: y0 + (p.Y - 2) / k })), d };
    }

    // ── Zoom both to the same size, pair with few crossings ─────────────────
    function rahmen(pts) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        pts.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); });
        const w = x1 - x0, h = y1 - y0, g = Math.max(w, h, 1e-6);
        return { x0, x1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, sx: Math.max(w, g * 0.1), sy: Math.max(h, g * 0.1) };
    }

    // Start from both clouds sorted by x, then swap partners as long as a swap
    // makes the sum of squared distances smaller. A row is long and flat, so
    // only grains close in x are compared (fenster) - that is where the swaps
    // that matter are, and it keeps a row of thousands of grains fast.
    function paaren(A, B, fenster) {
        const n = A.length, F = fenster || 80;
        const ia = A.map((_, i) => i).sort((i, j) => A[i].x - A[j].x || A[i].y - A[j].y);
        const ib = B.map((_, i) => i).sort((i, j) => B[i].x - B[j].x || B[i].y - B[j].y);
        const zu = new Int32Array(n);
        ia.forEach((a, r) => { zu[a] = ib[r]; });
        const c = (i, j) => { const dx = A[i].x - B[j].x, dy = A[i].y - B[j].y; return dx * dx + dy * dy; };
        for (let runde = 0; runde < 50; runde++) {
            let getauscht = 0;
            for (let r = 0; r < n; r++) {
                const i = ia[r];
                for (let q = r + 1; q < Math.min(n, r + F); q++) {
                    const j = ia[q], bi = zu[i], bj = zu[j];
                    if (c(i, bj) + c(j, bi) < c(i, bi) + c(j, bj) - 1e-12) { zu[i] = bj; zu[j] = bi; getauscht++; }
                }
            }
            if (!getauscht) break;
        }
        return zu;
    }

    // ── Preparing a row ─────────────────────────────────────────────────────
    // `atome` may be the atom list or a zuordnung (then its tokens are used).
    function vorbereiten(line, strokes, atome, opts) {
        const o = Object.assign({ dichte: 0.5, seed: 7, wolke: 0.25, auftrieb: 0.25 }, opts || {});
        if (atome && atome.paare) atome = atome.paare.map(p => p.token);
        atome = (atome || []).filter(a => a && typeof a === 'object');
        if (!atome.length || typeof HandschriftMorph === 'undefined') return null;
        const idxs = [].concat(...line.symbols.map(s => s.strokeIdxs));
        const quellen = idxs.map(i => strokes[i]).filter(s => s && s.points.length);
        if (!quellen.length) return null;
        const rnd = zufall(o.seed);

        const glyphen = atome.map(a => {
            const polys = HandschriftMorph.zielFlaechen(a).filter(q => q.length > 2);
            return polys.length ? { atom: a, maske: glyphMaske(polys) } : null;
        }).filter(Boolean);
        const flaeche = glyphen.reduce((s, g) => s + g.maske.flaeche, 0);
        // Doc: "die Anzahl der Punkte an der Fläche orientieren" - the ink's
        // area (length x pen width) and the glyphs' area, one density for both;
        // the bigger of the two sets the count
        let tintenFlaeche = 0;
        quellen.forEach(s => {
            const w = s.width || 3;
            let l = 0;
            for (let i = 1; i < s.points.length; i++) l += Math.hypot(s.points[i].x - s.points[i - 1].x, s.points[i].y - s.points[i - 1].y);
            tintenFlaeche += Math.max(l, w) * w;
        });
        const n = Math.max(60, Math.round(Math.max(flaeche, tintenFlaeche) * o.dichte));

        // targets: every glyph gets its share by area
        const B = [], rNachG = [], glyphVon = [];
        let rest = n;
        glyphen.forEach((g, k) => {
            const m = k === glyphen.length - 1 ? rest : Math.max(1, Math.round(n * g.maske.flaeche / flaeche));
            rest -= m;
            if (m <= 0) return;
            const res = glyphKoerner(g.maske, m, rnd);
            res.koerner.forEach(q => { B.push(q); rNachG.push(Math.max(0.6, res.d * 0.78)); glyphVon.push(k); });
        });
        const N = B.length;
        const tinte = tinteKoerner(quellen, N, rnd).koerner;
        // grain size on the ink: N discs cover its area about twice over
        const rTinte = Math.sqrt(2 * tintenFlaeche / (Math.PI * N));

        // Doc: "gleich groß zoomen" - both clouds into the same unit frame
        const fa = rahmen(tinte), fb = rahmen(B);
        const An = tinte.map(q => ({ x: (q.x - fa.cx) / fa.sx, y: (q.y - fa.cy) / fa.sy }));
        const Bn = B.map(q => ({ x: (q.x - fb.cx) / fb.sx, y: (q.y - fb.cy) / fb.sy }));
        const zu = paaren(An, Bn, o.fenster);

        // letter height of the row (median glyph height) - the unit for the
        // cloud's spread, lift and swirl
        const hs = glyphen.map(g => g.maske.H / g.maske.k).sort((a, b) => a - b);
        const mass = hs[hs.length >> 1] || 20;

        const a = new Float32Array(2 * N), b = new Float32Array(2 * N), c = new Float32Array(2 * N);
        const rVon = new Float32Array(N), rNach = new Float32Array(N), los = new Float32Array(N), glyph = new Int32Array(N);
        for (let i = 0; i < N; i++) {
            const p = tinte[i], q = B[zu[i]];
            a[2 * i] = p.x; a[2 * i + 1] = p.y;
            b[2 * i] = q.x; b[2 * i + 1] = q.y;
            // the cloud: half way, scattered, lifted
            const mx = (p.x + q.x) / 2 + gauss(rnd) * o.wolke * mass;
            const my = (p.y + q.y) / 2 + gauss(rnd) * o.wolke * mass * 0.7 - o.auftrieb * mass;
            // control point of a quadratic curve that passes the cloud spot at u = 0.5
            c[2 * i] = 2 * mx - (p.x + q.x) / 2;
            c[2 * i + 1] = 2 * my - (p.y + q.y) / 2;
            rVon[i] = Math.max(0.6, Math.min(p.w * 0.5, rTinte));
            rNach[i] = rNachG[zu[i]];
            los[i] = (p.x - fa.x0) / Math.max(1, fa.x1 - fa.x0);     // the wave runs left to right
            glyph[i] = glyphVon[zu[i]];
        }
        return { N, a, b, c, rVon, rNach, los, glyph, glyphen: glyphen.map(g => g.atom), mass, quellen, tintenFlaeche, flaeche };
    }

    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function mischen(a, b, t) {
        const p = c => { const m = c.match(/\d+/g); if (m && m.length >= 3) return m.slice(0, 3).map(Number);
            const h = c.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
        const A = p(a), B = p(b);
        return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
    }

    // Draw a row at progress t (0 = ink, 1 = typeset). Every grain has its own
    // window of the timeline (the wave, staffel); on the way it is dust - small,
    // carried by a smooth swirl (the same field for neighbours).
    function zeichnen(ctx, v, t, opts) {
        if (!v) return;
        const o = Object.assign({ farbe: '#adff2f', zielFarbe: '#00d2ff', staffel: 0.25, wirbel: 0.1, staub: 0.8, stufen: 8 }, opts || {});
        const dauer = 1 - o.staffel, M = v.mass;
        if (t <= 0) {
            ctx.save();
            ctx.strokeStyle = o.farbe; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            v.quellen.forEach(s => {
                ctx.lineWidth = s.width || 3;
                ctx.beginPath(); s.points.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y));
                if (s.points.length === 1) ctx.lineTo(s.points[0].x + 0.01, s.points[0].y);
                ctx.stroke();
            });
            ctx.restore();
            return;
        }
        // a glyph is done when its last grain has arrived
        const fertig = new Uint8Array(v.glyphen.length).fill(1);
        const u = new Float32Array(v.N);
        for (let i = 0; i < v.N; i++) {
            u[i] = Math.max(0, Math.min(1, (t - o.staffel * v.los[i]) / dauer));
            if (u[i] < 1) fertig[v.glyph[i]] = 0;
        }
        ctx.save();
        ctx.fillStyle = o.zielFarbe;
        ctx.beginPath();
        v.glyphen.forEach((atom, k) => {
            if (!fertig[k]) return;
            HandschriftMorph.zielFlaechen(atom).forEach(poly => { poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); });
        });
        ctx.fill();
        // grains, bucketed by colour so a frame is a handful of fills
        const pfade = Array.from({ length: o.stufen }, () => new Path2D());
        for (let i = 0; i < v.N; i++) {
            if (fertig[v.glyph[i]]) continue;
            const e = ease(u[i]), f = 1 - e;
            let x = f * f * v.a[2 * i] + 2 * e * f * v.c[2 * i] + e * e * v.b[2 * i];
            let y = f * f * v.a[2 * i + 1] + 2 * e * f * v.c[2 * i + 1] + e * e * v.b[2 * i + 1];
            const hub = Math.sin(Math.PI * e);
            const bx = x / M, by = y / M;
            x += Math.sin(2.3 * by + 1.1 * bx) * o.wirbel * M * hub;
            y += Math.cos(1.9 * bx - 1.4 * by) * o.wirbel * M * hub;
            // ink-sized -> dust-sized -> glyph-sized
            const r = e < 0.5 ? v.rVon[i] + (o.staub - v.rVon[i]) * (e / 0.5)
                              : o.staub + (v.rNach[i] - o.staub) * ((e - 0.5) / 0.5);
            const p = pfade[Math.min(o.stufen - 1, Math.floor(e * o.stufen))];
            p.moveTo(x + r, y);
            p.arc(x, y, Math.max(0.4, r), 0, Math.PI * 2);
        }
        pfade.forEach((p, k) => { ctx.fillStyle = mischen(o.farbe, o.zielFarbe, (k + 0.5) / o.stufen); ctx.fill(p); });
        ctx.restore();
    }

    const api = { vorbereiten, zeichnen, paaren, zufall, ease };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StaubMorph = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
