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
    // `atome` may be the atom list or a zuordnung. With a zuordnung that holds
    // (every handwritten symbol knows its typeset glyph) the grains of a symbol
    // go to ITS glyph only - Doc, 25.09.: "all at once, aber der a-Staub zu
    // a-LaTeX". It still is one cloud: every grain flies at the same time.
    // Without a zuordnung the whole row is paired as one.
    function tintenFlaecheVon(quellen) {
        let f = 0;
        quellen.forEach(s => {
            const w = s.width || 3;
            let l = 0;
            for (let i = 1; i < s.points.length; i++) l += Math.hypot(s.points[i].x - s.points[i - 1].x, s.points[i].y - s.points[i - 1].y);
            f += Math.max(l, w) * w;
        });
        return f;
    }

    function vorbereiten(line, strokes, atome, opts) {
        const o = Object.assign({ dichte: 0.5, seed: 7, wolke: 0.25, auftrieb: 0.25 }, opts || {});
        let paare = null;
        if (atome && atome.paare) {
            if (atome.passt) paare = atome.paare;
            atome = atome.paare.map(p => p.token);
        }
        atome = (atome || []).filter(a => a && typeof a === 'object');
        if (!atome.length || typeof HandschriftMorph === 'undefined') return null;
        const strich = i => strokes[i] && strokes[i].points.length ? strokes[i] : null;
        const alle = [].concat(...line.symbols.map(s => s.strokeIdxs)).map(strich).filter(Boolean);
        if (!alle.length) return null;
        const rnd = zufall(o.seed);

        const glyphen = [], nummer = new Map();
        atome.forEach(a => {
            const polys = HandschriftMorph.zielFlaechen(a).filter(q => q.length > 2);
            if (!polys.length) return;
            nummer.set(a, glyphen.length);
            glyphen.push({ atom: a, maske: glyphMaske(polys) });
        });
        if (!glyphen.length) return null;

        // what is paired with what: symbol -> its glyph, or the row as a whole
        let gruppen = null;
        if (paare) {
            gruppen = paare
                .map(p => ({ g: nummer.has(p.token) ? [nummer.get(p.token)] : [], quellen: p.symbol.strokeIdxs.map(strich).filter(Boolean) }))
                .filter(gr => gr.g.length && gr.quellen.length);
        }
        if (!gruppen || !gruppen.length) gruppen = [{ g: glyphen.map((_, k) => k), quellen: alle }];

        const koerner = [], rahmenListe = [];
        let tintenFlaeche = 0, flaeche = 0;
        for (const gr of gruppen) {
            const fl = gr.g.reduce((s, k) => s + glyphen[k].maske.flaeche, 0);
            // Doc: "die Anzahl der Punkte an der Fläche orientieren" - the ink's
            // area (length x pen width) and the glyphs' area, one density for
            // both; the bigger of the two sets the count
            const tf = tintenFlaecheVon(gr.quellen);
            tintenFlaeche += tf; flaeche += fl;
            const n = Math.max(12, Math.round(Math.max(fl, tf) * o.dichte));
            // targets: every glyph of the group gets its share by area
            const B = [], rB = [], gB = [];
            let rest = n;
            gr.g.forEach((k, j) => {
                const m = j === gr.g.length - 1 ? rest : Math.max(1, Math.round(n * glyphen[k].maske.flaeche / Math.max(1, fl)));
                rest -= m;
                if (m <= 0) return;
                const res = glyphKoerner(glyphen[k].maske, m, rnd);
                res.koerner.forEach(q => { B.push(q); rB.push(Math.max(0.6, res.d * 0.78)); gB.push(k); });
            });
            if (!B.length) continue;
            const tinte = tinteKoerner(gr.quellen, B.length, rnd).koerner;
            // grain size on the ink: the discs cover its area about twice over
            const rTinte = Math.sqrt(2 * tf / (Math.PI * B.length));
            // Doc: "gleich groß zoomen" - both clouds of the group into one unit frame
            const fa = rahmen(tinte), fb = rahmen(B);
            const An = tinte.map(q => ({ x: (q.x - fa.cx) / fa.sx, y: (q.y - fa.cy) / fa.sy }));
            const Bn = B.map(q => ({ x: (q.x - fb.cx) / fb.sx, y: (q.y - fb.cy) / fb.sy }));
            const zu = paaren(An, Bn, o.fenster);
            const gi = rahmenListe.length;
            rahmenListe.push(fa.cx, fa.cy, fa.sx, fa.sy, fb.cx, fb.cy, fb.sx, fb.sy);
            tinte.forEach((p, i) => koerner.push({
                p, qa: An[i], qb: Bn[zu[i]], gruppe: gi / 8,
                rVon: Math.max(0.6, Math.min(p.w * 0.5, rTinte)), rNach: rB[zu[i]], glyph: gB[zu[i]],
            }));
        }
        const N = koerner.length;
        if (!N) return null;

        // letter height of the row (median glyph height) - the unit for the
        // cloud's spread, lift and swirl; the ink's x range for the wave
        const hs = glyphen.map(g => g.maske.H / g.maske.k).sort((a, b) => a - b);
        const mass = hs[hs.length >> 1] || 20;
        let x0 = Infinity, x1 = -Infinity;
        koerner.forEach(k => { x0 = Math.min(x0, k.p.x); x1 = Math.max(x1, k.p.x); });

        // Doc, 25.09.: "bei Staub gehen immer noch Staubkörner wild durch". On
        // straight paths across the page they did: the pairing keeps paths
        // apart only in the shared unit frame, and a tall handwritten sum is not
        // the shape of the typeset one. So - as in strich-morph - each symbol
        // glides as a whole (its frame: centre, size) and every grain moves
        // inside that frame, where no two paths meet. The cloud is a small
        // displacement on top that swells to the middle and is gone at the end.
        const qa = new Float32Array(2 * N), qb = new Float32Array(2 * N), aus = new Float32Array(2 * N);
        const gruppe = new Int32Array(N), rahmenFeld = Float32Array.from(rahmenListe);
        const rVon = new Float32Array(N), rNach = new Float32Array(N), los = new Float32Array(N), glyph = new Int32Array(N);
        koerner.forEach((k, i) => {
            const p = k.p;
            qa[2 * i] = k.qa.x; qa[2 * i + 1] = k.qa.y;
            qb[2 * i] = k.qb.x; qb[2 * i + 1] = k.qb.y;
            gruppe[i] = k.gruppe;
            // the cloud: scattered, lifted
            aus[2 * i] = gauss(rnd) * o.wolke * mass;
            aus[2 * i + 1] = gauss(rnd) * o.wolke * mass * 0.7 - o.auftrieb * mass;
            rVon[i] = k.rVon;
            rNach[i] = k.rNach;
            los[i] = (p.x - x0) / Math.max(1, x1 - x0);         // the wave runs left to right
            glyph[i] = k.glyph;
        });
        return { N, qa, qb, aus, gruppe, rahmen: rahmenFeld, rVon, rNach, los, glyph, glyphen: glyphen.map(g => g.atom), mass, quellen: alle,
                 tintenFlaeche, flaeche, proZeichen: gruppen.length > 1 || !!paare };
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
            const e = ease(u[i]), hub = Math.sin(Math.PI * e);
            // the symbol's frame glides (centre linear, size geometric) ...
            const R = v.rahmen, g = 8 * v.gruppe[i];
            const cx = R[g] + (R[g + 4] - R[g]) * e, cy = R[g + 1] + (R[g + 5] - R[g + 1]) * e;
            const sx = R[g + 2] * Math.pow(R[g + 6] / R[g + 2], e), sy = R[g + 3] * Math.pow(R[g + 7] / R[g + 3], e);
            // ... and the grain moves inside it, plus the cloud's swell
            let x = cx + (v.qa[2 * i] + (v.qb[2 * i] - v.qa[2 * i]) * e) * sx + v.aus[2 * i] * hub;
            let y = cy + (v.qa[2 * i + 1] + (v.qb[2 * i + 1] - v.qa[2 * i + 1]) * e) * sy + v.aus[2 * i + 1] * hub;
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
