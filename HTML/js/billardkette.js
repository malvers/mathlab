// Billard-Kette (billardkette.html): exponential instability in a row of billiard balls.
// Doc, 15.11.2026, the day after the talk at "Physik am Samstag" (TU Dresden): "bauen wir ein Lab?" - the slide showed
// alpha_n ≈ alpha_0 · (a/d)^n with a/d = 2. On the slide d is the ball's diameter and a the free gap between two balls
// (the dimension line runs from the white ball's right edge to the red ball's left edge), and Doc's own sketch has the
// same a: x = a·sin(alpha_0) = d·sin(alpha_1). So the centres lie a + d apart, the struck ball's direction grows by
// a/d per collision, and a/d < 1 is a real table - the error then shrinks (his margin question "4 < 5?").
//
// Every collision is computed exactly: the moving ball's path meets the circle of radius d round the next centre,
// the struck ball (same mass, elastic, no friction or spin) runs along the line of centres at that moment.
// Own geometry instead of a physics engine: Matter.js and the like step in time with a contact tolerance (slop 0.05)
// and no continuous collision detection - a start error of 1e-14 degrees would drown in it; the closed form below
// keeps the full double precision (relative error about 1e-16 per collision).
(function () {
    'use strict';

    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('[billardkette] ' + msg); } catch (e) { } }

    // ---------------- constants ----------------
    const DEG = Math.PI / 180;
    const LAMBDA = 'rgb(245, 194, 66)', YPSILON = 'rgb(176, 36, 24)', PHI = 'rgb(121, 158, 49)', NEON = '#00d2ff';
    const INK = 'rgba(255, 255, 255, 0.9)', INK2 = 'rgba(255, 255, 255, 0.62)', INK3 = 'rgba(255, 255, 255, 0.35)';
    const NAVY = 'rgb(8, 20, 42)';
    const POOL_D_MM = 57.15;                 // a pool ball: 2 1/4 inch (WPA equipment specification)
    const Q_MAX = 6, N_MIN = 3, N_MAX = 60, E0_MIN = -16, E0_MAX = 0, EX_MAX = 15;
    const LONG_RUN = 200000;                 // how far the "enough balls" count looks ahead
    const AIM_NS = [10, 20, 50];
    const PRESETS = [
        { id: 'folie', q: 2, label: 'a/d = 2 (Folie)' },
        { id: 'grenze', q: 1, label: 'a/d = 1 (Grenze)' },
        { id: 'vier', q: 0.8, label: 'a = 4, d = 5 (a/d = 0,8)' },
        { id: 'pendel', q: 0, label: 'a = 0 (Kugeln berühren sich)' },
    ];
    // what an aiming error can be compared with (metres; textbook sizes, sources in the dialog)
    const SIZES = [
        { m: 1e-2, like: 'so groß wie ein Zentimeter', less: 'kleiner als ein Zentimeter', note: '10 mm' },
        { m: 1e-3, like: 'so groß wie ein Millimeter', less: 'kleiner als ein Millimeter', note: '1 mm' },
        { m: 7e-5, like: 'so dick wie ein Haar', less: 'dünner als ein Haar', note: '≈ 0,07 mm' },
        { m: 7.5e-6, like: 'so groß wie ein rotes Blutkörperchen', less: 'kleiner als ein rotes Blutkörperchen', note: '≈ 7,5 µm' },
        { m: 5.5e-7, like: 'so lang wie eine Wellenlänge grünen Lichts', less: 'kürzer als eine Wellenlänge grünen Lichts', note: '≈ 550 nm' },
        { m: 1e-7, like: 'so groß wie ein Grippevirus', less: 'kleiner als ein Grippevirus', note: '≈ 100 nm' },
        { m: 1e-10, like: 'so groß wie ein Atom', less: 'kleiner als ein Atom', note: '≈ 0,1 nm' },
        { m: 1.4e-14, like: 'so groß wie ein Goldatomkern', less: 'kleiner als ein Goldatomkern', note: '≈ 14 fm' },
        { m: 1.7e-15, like: 'so groß wie ein Proton', less: 'kleiner als ein Proton', note: '≈ 1,7 fm' },
        { m: 1.6e-35, like: 'so groß wie die Planck-Länge', less: 'kleiner als die Planck-Länge', note: '1,6·10⁻³⁵ m' },
    ];
    const BALL = {
        white: { hi: '#ffffff', base: 'rgb(236, 236, 230)', lo: 'rgb(150, 158, 172)' },
        red: { hi: 'rgb(236, 120, 104)', base: YPSILON, lo: 'rgb(90, 14, 8)' },
        blue: { hi: 'rgb(130, 160, 255)', base: 'rgb(40, 74, 200)', lo: 'rgb(14, 26, 96)' },
        black: { hi: 'rgb(100, 112, 140)', base: 'rgb(20, 28, 46)', lo: 'rgb(6, 10, 22)' },
    };

    // ---------------- state ----------------
    let q = 2, nBalls = 8, e0 = Math.log10(0.3), ex = 0;
    let ch = null;                           // the computed chain
    let phase = 'set';                       // 'set': balls in place, paths shown | 'run': the shot | 'done'
    let plan = null, t0 = 0, tau = 0, raf = 0;
    let hoverN = null;

    const container = document.getElementById('canvas-container');
    const coach = document.getElementById('math-coach-box');
    const stage = document.getElementById('bk-stage');
    const main = document.getElementById('bk-main');
    const row2 = document.getElementById('bk-row2');
    const spacer = document.getElementById('bk-spacer');
    const tableBox = document.getElementById('bk-tablebox');
    const chartBox = document.getElementById('bk-chartbox');
    const dataBox = document.getElementById('bk-databox');
    const tableWrap = document.getElementById('bk-tablewrap');
    const chartWrap = document.getElementById('bk-chartwrap');
    const cv = document.getElementById('canvas'), ctx = cv.getContext('2d');
    const cc = document.getElementById('bk-chart'), cctx = cc.getContext('2d');
    let tw = 1, th = 1, cw = 1, chh = 1;     // css sizes of the two canvases

    // ---------------- physics ----------------
    // One collision, exact (lengths in diameters, d = 1): a ball leaves its resting centre at angle al to the row,
    // the next ball rests at distance c = a/d + 1 on the row. The path meets the circle of radius 1 round the next
    // centre after the distance t, the smaller root of t² − 2tc·cos(al) + c² − 1 = 0, written without cancellation.
    // The struck ball then runs along the line of centres. Returns null when the path misses (c·|sin al| ≥ 1).
    function collide(al, c) {
        const s = Math.sin(al), co = Math.cos(al);
        if (c * Math.abs(s) >= 1 || co <= 0) return null;
        const t = (c * c - 1) / (c * co + Math.sqrt(1 - c * c * s * s));
        const px = t * co, py = t * s;           // centre of the moving ball at the contact
        const nx = c - px, ny = -py;             // line of centres (length 1 = d)
        return { t, px, py, nx, ny, al1: Math.atan2(ny, nx) };
    }

    function computeChain() {
        const c = q + 1, al0 = Math.pow(10, e0) * DEG;
        const moving = [];
        let al = al0, v = 1, hits = 0, missed = false;
        for (let k = 0; k < nBalls; k++) {
            const m = { k, X: k * c, al, v, ux: Math.cos(al), uy: Math.sin(al), offset: c * Math.abs(Math.sin(al)) };
            moving.push(m);
            if (k === nBalls - 1) { m.free = true; m.offset = null; break; }   // the last ball rolls on
            const r = collide(al, c);
            if (!r) { m.free = true; m.miss = true; missed = true; break; }
            m.t = r.t; m.cx = m.X + r.px; m.cy = r.py;
            // what the striker keeps: the part of its velocity across the line of centres (equal masses, elastic)
            const nl = Math.hypot(r.nx, r.ny) || 1, nx = r.nx / nl, ny = r.ny / nl;
            const dot = m.ux * nx + m.uy * ny;
            m.wx = v * (m.ux - dot * nx); m.wy = v * (m.uy - dot * ny);
            v *= dot;
            al = r.al1; hits++;
        }
        // the same row with as many balls as it takes: after how many collisions does it break?
        let longHits;
        {
            let a = al0, k = 0, never = false;
            for (; k < LONG_RUN; k++) {
                const r = collide(a, c);
                if (!r) break;
                a = r.al1;
                if (a === 0 || (q < 1 && Math.abs(a) < al0 * 1e-3)) { never = true; break; }   // shrinking: never
            }
            longHits = never ? Infinity : (k >= LONG_RUN ? null : k);           // null: more than LONG_RUN
        }
        const alStar = Math.asin(1 / c);                 // the largest angle that still meets the next ball
        const nF = q > 1 ? Math.log(1 / (c * al0)) / Math.log(q) : null;
        ch = { c, al0, moving, hits, missed, longHits, alStar, nF };
    }

    // the largest start error with which n collisions in a row all hit - exact, by bisection on log(alpha_0)
    // (the map alpha -> |alpha'| is increasing, so the number of hits falls with the start error)
    function needAlpha(n, c) {
        const hitsUpTo = al0 => {
            let a = al0;
            for (let k = 0; k < n; k++) { const r = collide(a, c); if (!r) return k; a = r.al1; }
            return n;
        };
        const top = Math.asin(1 / c);
        if (hitsUpTo(top * (1 - 1e-12)) >= n) return top;
        let lo = Math.log(1e-300), hi = Math.log(top);
        for (let i = 0; i < 160; i++) {
            const mid = 0.5 * (lo + hi);
            if (hitsUpTo(Math.exp(mid)) >= n) lo = mid; else hi = mid;
        }
        return Math.exp(lo);
    }

    // ---------------- numbers ----------------
    const comma = s => s.replace('.', ',');
    const fmtInt = n => Math.round(n).toLocaleString('de-DE');
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    function fmtSig(x, sig) {
        if (x === 0) return '0';
        const e = Math.floor(Math.log10(Math.abs(x)));
        return comma(x.toFixed(clamp(sig - 1 - e, 0, 20)));
    }
    function fmtQ(v) { return comma(v.toFixed(2)); }
    // a positive value with sig significant digits: plain from 0.01 to 9999, else mantissa and power of ten
    function sciSplit(v, sig) {
        if (v === 0) return { plain: '0' };
        if (!(v > 0) || !isFinite(v)) return { plain: '–' };
        let e = Math.floor(Math.log10(v));
        if (e >= -2 && e < 4) return { plain: fmtSig(v, sig) };
        let ms = (v / Math.pow(10, e)).toFixed(sig - 1);
        if (parseFloat(ms) >= 10) { e += 1; ms = (v / Math.pow(10, e)).toFixed(sig - 1); }
        return { mant: comma(ms), exp: e };
    }
    // HTML: in KaTeX_Main the times dot is U+22C5 and the minus U+2212; in Orbitron (slider values) "·" and "-"
    function sciHTML(v, sig, unit, orb) {
        const s = sciSplit(v, sig);
        unit = unit || '';
        if (s.plain !== undefined) return s.plain + unit;
        return s.mant + (orb ? '·' : '⋅') + '10<sup>' + (s.exp < 0 ? (orb ? '-' : '−') : '') + Math.abs(s.exp) + '</sup>' + unit;
    }
    // the same for the canvas: parts for richDraw
    function sciParts(v, sig, unit) {
        const s = sciSplit(v, sig);
        unit = unit || '';
        if (s.plain !== undefined) return [{ s: s.plain + unit, f: 'rm' }];
        return [{ s: s.mant + '⋅10', f: 'rm' }, { s: (s.exp < 0 ? '−' : '') + Math.abs(s.exp), f: 'rm', sup: true }, { s: unit, f: 'rm' }];
    }
    function fmtLen(m) {
        const units = [[1, 'm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-12, 'pm'], [1e-15, 'fm']];
        for (const [f, u] of units) if (m >= f) return fmtSig(m / f, 2) + '&nbsp;' + u;
        return sciHTML(m, 2, '&nbsp;m');
    }
    function roundNice(x) { const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(x)) - 1)); return fmtInt(Math.round(x / p) * p); }
    function compareSize(m) {
        let best = SIZES[0], bl = Infinity;
        SIZES.forEach(s => { const l = Math.abs(Math.log10(m / s.m)); if (l < bl) { bl = l; best = s; } });
        const r = m / best.m;
        if (r >= 0.5 && r <= 2) return 'etwa ' + best.like + ' (' + best.note + ')';
        if (r < 1) return best.less + ' (' + best.note + '): nur 1/' + roundNice(1 / r) + ' davon';
        return roundNice(r) + '-mal ' + best.like + ' (' + best.note + ')';
    }
    const stoesse = n => (n === 1 ? '1 Stoß' : fmtInt(n) + ' Stößen');
    function ballKind(k) { return k === 0 ? 'white' : k === nBalls - 1 ? 'black' : k === nBalls - 2 ? 'blue' : 'red'; }
    function ballName(k) {
        const kind = ballKind(k);
        if (kind === 'white') return 'die weiße Kugel';
        if (kind === 'black') return 'die schwarze Kugel';
        if (kind === 'blue') return 'die blaue Kugel';
        return nBalls - 3 === 1 ? 'die rote Kugel' : 'die ' + k + '. rote Kugel';
    }

    // ---------------- TeX-like text on a canvas ----------------
    // parts [{ s, f, sup, sub, color }] - f: 'mi' italic letter (KaTeX_Math), 'rm' upright number or sign (KaTeX_Main),
    // 'tx' words (Outfit), 'or' labels (Orbitron)
    function partFont(p, px) {
        const sz = (p.sup || p.sub ? px * 0.7 : px).toFixed(1);
        if (p.f === 'mi') return 'italic ' + sz + 'px KaTeX_Math, serif';
        if (p.f === 'tx') return sz + 'px Outfit, sans-serif';
        if (p.f === 'or') return sz + 'px Orbitron, sans-serif';
        return sz + 'px KaTeX_Main, serif';
    }
    function richWidth(c, parts, px) {
        let w = 0;
        parts.forEach(p => { c.font = partFont(p, px); w += c.measureText(p.s).width; });
        return w;
    }
    function richDraw(c, parts, x, y, px, align, color) {
        const w = richWidth(c, parts, px);
        let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
        c.textAlign = 'left';
        c.textBaseline = 'alphabetic';
        parts.forEach(p => {
            c.font = partFont(p, px);
            c.fillStyle = p.color || color;
            c.fillText(p.s, cx, y + (p.sup ? -px * 0.4 : p.sub ? px * 0.22 : 0));
            cx += c.measureText(p.s).width;
        });
        return w;
    }

    // Liang-Barsky: the part of a segment inside a rectangle (the paths can be stretched far beyond the table)
    function clipSeg(x1, y1, x2, y2, r) {
        let a = 0, b = 1;
        const dx = x2 - x1, dy = y2 - y1;
        const p = [-dx, dx, -dy, dy], d = [x1 - r.x, r.x + r.w - x1, y1 - r.y, r.y + r.h - y1];
        for (let i = 0; i < 4; i++) {
            if (p[i] === 0) { if (d[i] < 0) return null; continue; }
            const t = d[i] / p[i];
            if (p[i] < 0) { if (t > b) return null; if (t > a) a = t; } else { if (t < a) return null; if (t < b) b = t; }
        }
        return [x1 + a * dx, y1 + a * dy, x1 + b * dx, y1 + b * dy];
    }

    // ---------------- the shot in time ----------------
    function makePlan() {
        let total = 0;
        ch.moving.forEach(m => { if (!m.free) total += m.t / Math.max(m.v, 1e-9); });
        const V = Math.max(7, total / 4.5);          // diameters per second at full speed - a long row runs faster
        let T = 0;
        ch.moving.forEach(m => {
            m.T0 = T;
            if (!m.free) { m.T1 = T + Math.max(0.05, m.t / (V * m.v)); T = m.T1; }
        });
        return { V, tEnd: T + 2.4 };
    }

    // where ball k is at time tt of the shot (lengths in d; the row is the x axis)
    function ballAt(k, tt) {
        const X = k * ch.c, m = ch.moving[k];
        if (!m || !plan || tt <= m.T0) return [X, 0];
        if (m.free) { const s = (tt - m.T0) * plan.V * m.v; return [X + s * m.ux, s * m.uy]; }
        if (tt < m.T1) { const f = (tt - m.T0) / (m.T1 - m.T0); return [X + f * (m.cx - X), f * m.cy]; }
        const s = (tt - m.T1) * plan.V;
        return [m.cx + s * m.wx, m.cy + s * m.wy];
    }

    // ---------------- the table ----------------
    function tableGeom() {
        const W = tw, H = th;
        const rail = Math.round(clamp(Math.min(W, H) * 0.04, 7, 16));
        const cl = { x: rail, y: rail, w: W - 2 * rail, h: H - 2 * rail };
        const c = ch.c;
        const xL = 2.6, xR = (nBalls - 1) * c + Math.max(2.4, 0.6 * c);
        let k = cl.w / (xL + xR);
        k = clamp(Math.min(k, (cl.h - 84) / 2.2, 90), 2.2, 90);
        const ox = cl.x + (cl.w - (xL + xR) * k) / 2 + xL * k;
        const y0 = cl.y + cl.h * 0.56;
        return { W, H, rail, cl, k, r: k / 2, ox, y0, E: Math.pow(10, ex), c };
    }

    function drawBall(x, y, r, kind) {
        const col = BALL[kind];
        ctx.save();
        ctx.fillStyle = 'rgba(8, 20, 42, 0.35)';
        ctx.beginPath(); ctx.ellipse(x + r * 0.18, y + r * 0.22, r * 1.02, r * 0.95, 0, 0, 2 * Math.PI); ctx.fill();
        const g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r * 1.05);
        g.addColorStop(0, col.hi); g.addColorStop(0.42, col.base); g.addColorStop(1, col.lo);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
        ctx.restore();
    }

    function drawCue(g, tt) {
        // the cue's distance behind the white ball in d: resting 0.35, drawn back, then the strike at tt = 0
        let gap = 0.35;
        if (phase !== 'set') {
            if (tt < -0.55) gap = 0.35;
            else if (tt < -0.15) { const f = (tt + 0.55) / 0.4; gap = 0.35 + 1.5 * (1 - (1 - f) * (1 - f)); }
            else if (tt < 0) { const f = (tt + 0.15) / 0.15; gap = 1.85 * (1 - f * f); }
            else gap = 0;
        }
        const ang = Math.atan2(g.E * Math.sin(ch.al0), Math.cos(ch.al0));   // on screen, with the stretch
        const ux = Math.cos(ang), uy = -Math.sin(ang);
        const tipD = g.r + gap * g.k + 1;
        const tx = g.ox - ux * tipD, ty = g.y0 - uy * tipD;
        const len = Math.max(18 * g.k, g.ox + 40);
        const w0 = clamp(0.16 * g.k, 1.5, 6), w1 = clamp(0.3 * g.k, 3, 11);
        const nx = -uy, ny = ux;
        const at = f => [tx - ux * len * f, ty - uy * len * f];
        const seg = (f0, f1, col) => {
            const [ax, ay] = at(f0), [bx, by] = at(f1);
            const wa = w0 + (w1 - w0) * f0, wb = w0 + (w1 - w0) * f1;
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.moveTo(ax + nx * wa / 2, ay + ny * wa / 2); ctx.lineTo(bx + nx * wb / 2, by + ny * wb / 2);
            ctx.lineTo(bx - nx * wb / 2, by - ny * wb / 2); ctx.lineTo(ax - nx * wa / 2, ay - ny * wa / 2);
            ctx.closePath(); ctx.fill();
        };
        seg(0, 0.012, 'rgb(70, 120, 190)');        // the chalked tip
        seg(0.012, 0.6, 'rgb(238, 228, 200)');     // light shaft as on the slide
        seg(0.6, 1, 'rgb(28, 30, 40)');            // dark butt
    }

    function drawTable() {
        if (!ch) return;
        const g = tableGeom();
        const { cl, k, r, ox, y0, E } = g;
        const SX = x => ox + k * x, SY = y => y0 - k * E * y;
        ctx.clearRect(0, 0, g.W, g.H);

        // rail and cloth
        ctx.fillStyle = 'rgb(14, 36, 78)';
        roundRect(ctx, 0.5, 0.5, g.W - 1, g.H - 1, 12); ctx.fill();
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.35)'; ctx.lineWidth = 1; ctx.stroke();
        const cg = ctx.createRadialGradient(cl.x + cl.w / 2, cl.y + cl.h / 2, 10, cl.x + cl.w / 2, cl.y + cl.h / 2, Math.max(cl.w, cl.h) * 0.65);
        cg.addColorStop(0, 'rgb(22, 116, 70)'); cg.addColorStop(1, 'rgb(10, 74, 46)');
        ctx.fillStyle = cg;
        roundRect(ctx, cl.x, cl.y, cl.w, cl.h, 6); ctx.fill();

        ctx.save();
        roundRect(ctx, cl.x, cl.y, cl.w, cl.h, 6); ctx.clip();
        // the aiming line through all centres, as on the slide
        ctx.strokeStyle = 'rgba(8, 20, 42, 0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cl.x, y0); ctx.lineTo(cl.x + cl.w, y0); ctx.stroke();

        // dimension lines d and a under the white ball and the first gap
        const dimY = y0 + r + clamp(k * 0.35, 9, 16);
        const xa = SX(-0.5), xb = SX(0.5), xc = SX(g.c - 0.5);
        ctx.strokeStyle = 'rgba(8, 20, 42, 0.85)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(xa, dimY); ctx.lineTo(xc, dimY);
        [xa, xb, xc].forEach(x => { ctx.moveTo(x, dimY - 5); ctx.lineTo(x, dimY + 5); });
        ctx.stroke();
        const dpx = clamp(k * 0.45, 13, 20);
        richDraw(ctx, [{ s: 'd', f: 'mi' }], (xa + xb) / 2, dimY + dpx + 3, dpx, 'center', 'rgb(8, 20, 42)');
        if (xc - xb > dpx) richDraw(ctx, [{ s: 'a', f: 'mi' }], (xb + xc) / 2, dimY + dpx + 3, dpx, 'center', 'rgb(8, 20, 42)');

        const tt = phase === 'set' ? null : tau;
        const ms = ch.moving;
        const pathW = clamp(k * 0.06, 1.2, 2.4);

        // the paths: in the set-up all of them, during the shot what has been run so far
        ctx.lineCap = 'round';
        ms.forEach(m => {
            const pts = [[m.X, 0]];
            if (tt === null) {
                if (m.free) { const L = 1e6; pts.push([m.X + L * m.ux, L * m.uy]); }
                else pts.push([m.cx, m.cy]);
            } else {
                if (tt <= m.T0) return;
                if (!m.free && tt > m.T1) pts.push([m.cx, m.cy]);
                pts.push(ballAt(m.k, tt));
            }
            ctx.setLineDash(m.miss ? [6, 5] : []);
            for (let i = 0; i + 1 < pts.length; i++) {
                const s = clipSeg(SX(pts[i][0]), SY(pts[i][1]), SX(pts[i + 1][0]), SY(pts[i + 1][1]), cl);
                if (!s) continue;
                // the run to the next ball bright; what the striker keeps afterwards (sideways, frictionless) faint
                const after = i > 0;
                ctx.strokeStyle = m.miss ? YPSILON : after ? 'rgba(245, 194, 66, 0.3)' : LAMBDA;
                ctx.lineWidth = m.miss ? pathW + 0.6 : after ? Math.max(1, pathW * 0.6) : pathW;
                ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke();
            }
        });
        ctx.setLineDash([]);

        // the balls - kept on the cloth when they reach the cushion
        const missIdx = ch.missed ? ch.hits + 1 : -1;
        for (let i = 0; i < nBalls; i++) {
            const p = tt === null ? [i * g.c, 0] : ballAt(i, tt);
            const x = clamp(SX(p[0]), cl.x + r, cl.x + cl.w - r), y = clamp(SY(p[1]), cl.y + r, cl.y + cl.h - r);
            drawBall(x, y, Math.max(r, 1.6), ballKind(i));
        }
        // the ball that is missed: a red ring (once the shot has got there)
        const missShown = missIdx > 0 && (tt === null || tt >= ms[ch.hits].T0 + 0.25);
        if (missShown) {
            ctx.strokeStyle = YPSILON; ctx.lineWidth = clamp(k * 0.08, 2, 3.5);
            ctx.beginPath(); ctx.arc(SX(missIdx * g.c), y0, Math.max(r, 1.6) + clamp(k * 0.12, 3, 7), 0, 2 * Math.PI); ctx.stroke();
        }
        ctx.restore();

        // the cue lies over the rail
        drawCue(g, tt === null ? -1 : tt);

        // labels as on the slide: alpha_0 over the white ball, the factor over each struck ball, the angle below it
        const fpx = clamp(k * 0.42, 12, 18), apx = clamp(k * 0.3, 10, 13.5);
        const yF = Math.max(cl.y + fpx + 2, y0 - r - apx - 14), yA = yF + apx + 5;
        const sp = k * g.c;
        const stepF = Math.max(1, Math.ceil(fpx * 3.4 / sp)), stepA = Math.max(1, Math.ceil(apx * 6.4 / sp));
        ctx.save();
        ctx.shadowColor = 'rgba(8, 20, 42, 0.9)'; ctx.shadowBlur = 4;
        ms.forEach(m => {
            if (tt !== null && tt < m.T0) return;
            const x = SX(m.X), aDeg = Math.abs(m.al) / DEG;
            if (m.k === 0) {
                richDraw(ctx, [{ s: 'α', f: 'mi' }, { s: '0', f: 'rm', sub: true }], x, yF, fpx, 'center', LAMBDA);
                richDraw(ctx, sciParts(aDeg, 2, '°'), x, yA, apx, 'center', INK);
                return;
            }
            const prev = Math.abs(ms[m.k - 1].al);
            // thinned out when the balls stand close; the last moving ball always gets its label, its neighbour gives way
            const lastK = ms.length - 1, last = m.k === lastK;
            if (last || (m.k % stepF === 0 && lastK - m.k >= stepF)) {
                const f = prev > 0 ? Math.abs(m.al) / prev : 0;
                richDraw(ctx, [{ s: '⋅ ' + (prev > 0 ? fmtFactor(f) : '0'), f: 'rm' }], x, yF, fpx, 'center', INK);
            }
            if (last || (m.k % stepA === 0 && lastK - m.k >= stepA)) richDraw(ctx, sciParts(aDeg, 2, '°'), x, yA, apx, 'center', INK2);
        });
        if (missShown) {
            // below the missed ball, clear of the labels above the row
            const x = SX(missIdx * g.c), tpx = clamp(k * 0.24, 9, 11);
            const yTag = y0 + Math.max(r, 1.6) + clamp(k * 0.12, 3, 7) + tpx / 2 + 10;
            const xt = clamp(x, cl.x + 52, cl.x + cl.w - 52);
            drawTag(xt, yTag, 'VERFEHLT', tpx);
            richDraw(ctx, [{ s: 'Versatz ', f: 'tx' }].concat(sciParts(ch.moving[ch.hits].offset, 3, '')).concat([{ s: 'd', f: 'mi' }]),
                xt, yTag + tpx / 2 + apx + 8, apx, 'center', INK);
        }
        ctx.restore();

        // true to scale, or how much the cross direction is stretched
        const npx = clamp(k * 0.22, 9, 11);
        const parts = E === 1 ? [{ s: 'MASSSTABSGETREU', f: 'or' }]
            : ex <= 3 ? [{ s: 'QUER ' + fmtInt(E) + '-FACH ÜBERHÖHT', f: 'or' }]
                : [{ s: 'QUER 10', f: 'or' }, { s: String(ex), f: 'or', sup: true }, { s: '-FACH ÜBERHÖHT', f: 'or' }];
        ctx.save();
        ctx.shadowColor = 'rgba(8, 20, 42, 0.9)'; ctx.shadowBlur = 4;
        richDraw(ctx, parts, cl.x + cl.w - 10, cl.y + npx + 8, npx, 'right', E === 1 ? INK2 : LAMBDA);
        ctx.restore();
    }

    function fmtFactor(f) {
        let s = f.toFixed(2);
        s = s.replace(/\.?0+$/, '');
        return comma(s);
    }

    function drawTag(x, yMid, text, px) {
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.font = px + 'px Orbitron, sans-serif';
        const w = ctx.measureText(text).width + 12, h = px + 8;
        ctx.fillStyle = YPSILON;
        roundRect(ctx, x - w / 2, yMid - h / 2, w, h, 4); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, x, yMid + 1);
        ctx.restore();
    }

    function roundRect(c, x, y, w, h, r) {
        c.beginPath();
        c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
    }

    // ---------------- the chart ----------------
    let chartGeom = null;
    function drawChart() {
        if (!ch) return;
        const W = cw, H = chh;
        cctx.clearRect(0, 0, W, H);
        const al0d = ch.al0 / DEG, starD = ch.alStar / DEG;
        const nMax = Math.max(1, nBalls - 1);
        const exact = ch.moving.map(m => Math.abs(m.al) / DEG);
        const formula = n => al0d * Math.pow(q, n);
        const vals = [starD];
        exact.forEach(v => { if (v > 0) vals.push(v); });
        for (let n = 0; n <= nMax; n++) { const v = formula(n); if (v > 0 && v <= 90) vals.push(v); }
        let hi = Math.ceil(Math.log10(Math.max(...vals)) + 0.02);
        let lo = Math.floor(Math.log10(Math.min(...vals)) - 0.02);
        if (hi - lo < 2) lo = hi - 2;
        lo = Math.max(lo, hi - 40);

        const padL = 56, padR = 14, padT = 16, padB = 36;
        const x0 = padL, x1 = W - padR, yT = padT, yB = H - padB;
        if (x1 - x0 < 40 || yB - yT < 40) return;
        const X = n => x0 + (x1 - x0) * n / nMax;
        const Y = v => yB - (yB - yT) * (Math.log10(v) - lo) / (hi - lo);
        chartGeom = { x0, x1, yT, yB, nMax, X };

        // grid: every decade a hair line, labels as many as fit
        const decs = hi - lo, stepY = [1, 2, 3, 4, 5, 10].find(s => (yB - yT) * s / decs >= 24) || 10;
        cctx.lineWidth = 1;
        for (let e = lo; e <= hi; e++) {
            const y = yB - (yB - yT) * (e - lo) / decs;
            cctx.strokeStyle = 'rgba(255, 255, 255, ' + ((e - lo) % stepY === 0 ? 0.1 : 0.04) + ')';
            cctx.beginPath(); cctx.moveTo(x0, y); cctx.lineTo(x1, y); cctx.stroke();
            if ((e - lo) % stepY === 0) {
                const parts = e === 0 ? [{ s: '1°', f: 'rm' }] : e === 1 ? [{ s: '10°', f: 'rm' }] :
                    [{ s: '10', f: 'rm' }, { s: (e < 0 ? '−' : '') + Math.abs(e), f: 'rm', sup: true }, { s: '°', f: 'rm' }];
                richDraw(cctx, parts, x0 - 8, y + 4, 12, 'right', INK2);
            }
        }
        const stepX = [1, 2, 5, 10, 20].find(s => (x1 - x0) * s / nMax >= 26) || 20;
        for (let n = 0; n <= nMax; n += stepX) {
            const x = X(n);
            cctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            cctx.beginPath(); cctx.moveTo(x, yT); cctx.lineTo(x, yB); cctx.stroke();
            richDraw(cctx, [{ s: String(n), f: 'rm' }], x, yB + 16, 12, 'center', INK2);
        }
        cctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        cctx.beginPath(); cctx.moveTo(x0, yT); cctx.lineTo(x0, yB); cctx.lineTo(x1, yB); cctx.stroke();
        richDraw(cctx, [{ s: 'Stoß ', f: 'tx' }, { s: 'n', f: 'mi' }], x1, yB + 32, 12, 'right', INK2);

        cctx.save();
        cctx.beginPath(); cctx.rect(x0, yT - 2, x1 - x0 + 2, yB - yT + 4); cctx.clip();
        // the break: the path no longer meets the next ball once (a + d)·sin(alpha) ≥ d
        const ys = Y(starD);
        cctx.strokeStyle = YPSILON; cctx.lineWidth = 2; cctx.setLineDash([7, 5]);
        cctx.beginPath(); cctx.moveTo(x0, ys); cctx.lineTo(x1, ys); cctx.stroke();
        cctx.setLineDash([]);
        // where the formula says it breaks
        if (ch.nF !== null && ch.nF >= 0 && ch.nF <= nMax) {
            cctx.strokeStyle = INK3; cctx.lineWidth = 1; cctx.setLineDash([3, 4]);
            cctx.beginPath(); cctx.moveTo(X(ch.nF), yT); cctx.lineTo(X(ch.nF), yB); cctx.stroke();
            cctx.setLineDash([]);
        }
        // the formula: a straight line on the log scale
        cctx.strokeStyle = PHI; cctx.lineWidth = 2; cctx.lineJoin = 'round';
        cctx.beginPath();
        let started = false;
        for (let n = 0; n <= nMax; n++) {
            const v = formula(n);
            if (!(v > 0)) { started = false; continue; }
            const x = X(n), y = Math.max(-1e4, Y(v));
            if (!started) { cctx.moveTo(x, y); started = true; } else cctx.lineTo(x, y);
        }
        cctx.stroke();
        // the exact angles, dots with a ring of the surface colour
        exact.forEach((v, n) => {
            if (!(v > 0)) return;
            const x = X(n), y = Y(v);
            if (y < yT - 6 || y > yB + 6) return;
            const miss = ch.moving[n].miss;
            cctx.fillStyle = LAMBDA; cctx.strokeStyle = 'rgb(10, 20, 40)'; cctx.lineWidth = 2;
            cctx.beginPath(); cctx.arc(x, y, 4.5, 0, 2 * Math.PI); cctx.fill(); cctx.stroke();
            if (miss) {
                cctx.strokeStyle = YPSILON; cctx.lineWidth = 2.5;
                cctx.beginPath(); cctx.arc(x, y, 8.5, 0, 2 * Math.PI); cctx.stroke();
            }
        });
        cctx.restore();

        // direct labels in text ink: the break line and the formula's break
        richDraw(cctx, [{ s: 'Abriss: Versatz = ', f: 'tx' }, { s: 'd', f: 'mi' }], x0 + 8, ys - 7, 12, 'left', INK);
        if (ch.nF !== null && ch.nF >= 0 && ch.nF <= nMax) {
            const right = X(ch.nF) > x1 - 90;
            richDraw(cctx, [{ s: 'n', f: 'mi' }, { s: ' ≈ ' + fmtSig(ch.nF, 3), f: 'rm' }], X(ch.nF) + (right ? -6 : 6), yT + 12, 12, right ? 'right' : 'left', INK2);
        }
        if (q === 0) richDraw(cctx, [{ s: 'ab Stoß 1: ', f: 'tx' }, { s: 'α', f: 'mi' }, { s: ' = 0 – der Fehler ist weg', f: 'tx' }], x0 + 10, yB - 10, 12, 'left', INK);

        // hover: a crosshair and the values of one collision
        if (hoverN !== null && hoverN <= nMax) {
            const x = X(hoverN);
            cctx.strokeStyle = 'rgba(0, 210, 255, 0.55)'; cctx.lineWidth = 1;
            cctx.beginPath(); cctx.moveTo(x, yT); cctx.lineTo(x, yB); cctx.stroke();
            const rows = [[{ s: 'Stoß ', f: 'tx' }, { s: 'n', f: 'mi' }, { s: ' = ' + hoverN, f: 'rm' }]];
            if (hoverN < exact.length) rows.push([{ s: 'exakt  ', f: 'tx' }].concat(sciParts(exact[hoverN], 4, '°')));
            else rows.push([{ s: 'nicht mehr getroffen', f: 'tx' }]);
            rows.push([{ s: 'Formel  ', f: 'tx' }].concat(sciParts(formula(hoverN), 4, '°')));
            const bw = Math.max(...rows.map(r => richWidth(cctx, r, 13))) + 20, bh = rows.length * 19 + 12;
            let bx = x + 12;
            if (bx + bw > W - 4) bx = x - 12 - bw;
            const by = yT + 6;
            cctx.fillStyle = 'rgba(10, 20, 40, 0.94)'; cctx.strokeStyle = 'rgba(0, 210, 255, 0.35)';
            roundRect(cctx, bx, by, bw, bh, 6); cctx.fill(); cctx.stroke();
            rows.forEach((r, i) => richDraw(cctx, r, bx + 10, by + 22 + i * 19, 13, 'left', INK));
        }
    }

    // ---------------- the numbers ----------------
    function buildData() {
        const tb = document.getElementById('bk-rows');
        if (!tb) return;
        const al0d = ch.al0 / DEG;
        let html = '';
        ch.moving.forEach((m, n) => {
            const exD = Math.abs(m.al) / DEG, F = al0d * Math.pow(q, n);
            let dev;
            if (n === 0) dev = '0';
            else if (!(F > 0)) dev = '–';
            else {
                const r = (exD - F) / F;
                dev = Math.abs(r) < 1e-14 ? '&lt;&thinsp;10<sup>−12</sup>&thinsp;%' : (r < 0 ? '−' : '+') + sciHTML(Math.abs(r) * 100, 2, '&thinsp;%');
            }
            let off;
            if (m.offset === null) off = '<span class="bk-muted">letzte Kugel</span>';
            else off = sciHTML(m.offset, 3) + (m.miss ? ' <span class="bk-tag">VERFEHLT</span>' : '');
            const col = BALL[ballKind(n)].base;
            html += '<tr data-n="' + n + '" class="' + (m.miss ? 'miss' : '') + (n === hoverN ? ' hl' : '') + '">' +
                '<td>' + n + '</td><td><span class="bk-dot" style="background:' + col + '"></span></td>' +
                '<td>' + sciHTML(exD, 4, '°') + '</td><td>' + sciHTML(F, 4, '°') + '</td>' +
                '<td class="bk-dev">' + dev + '</td><td>' + off + '</td></tr>';
        });
        tb.innerHTML = html;
        const note = document.getElementById('bk-note');
        if (note) {
            note.innerHTML = 'Versatz = Abstand der Bahn vom Mittelpunkt der nächsten Kugel, <span data-tex="(a+d)\\cdot\\sin|\\alpha_n|"></span>, ' +
                'in Vielfachen von <span data-tex="d"></span>. Ab 1 läuft die Kugel vorbei. Das Vorzeichen von ' +
                '<span data-tex="\\alpha"></span> wechselt bei jedem Stoß – die Kugeln weichen abwechselnd nach links und rechts aus.';
            renderTex(note);
        }
    }

    function highlightRow() {
        document.querySelectorAll('#bk-rows tr').forEach(tr => tr.classList.toggle('hl', +tr.dataset.n === hoverN));
    }

    // ---------------- status and result ----------------
    function updateStatus() {
        const st = document.getElementById('bk-status');
        const res = document.getElementById('bk-res');
        const all = nBalls - 1;
        let s;
        if (ch.missed) {
            s = (ch.hits === 0 ? '<b>Abriss sofort:</b> ' : '<b>Abriss nach ' + stoesse(ch.hits) + ':</b> ') +
                ballName(ch.hits) + ' verfehlt ' + ballName(ch.hits + 1) + '.';
        } else {
            s = '<b>Alle ' + fmtInt(all) + ' Stöße treffen.</b>' +
                (q === 0 ? ' Der Fehler ist nach dem ersten Stoß weg.' : q < 1 ? ' Der Fehler schrumpft.' : q === 1 ? ' Der Fehler bleibt gleich.' : '');
        }
        if (st) st.innerHTML = s;
        if (!res) return;
        let h = '<div>Faktor je Stoß: <span data-tex="a/d = ' + fmtQ(q).replace(',', '{,}') + '"></span></div>';
        if (q > 1) {
            const lh = ch.longHits;
            h += '<div>Abriss exakt: <b>nach ' + (lh === null ? 'mehr als ' + stoesse(LONG_RUN) : stoesse(lh)) + '</b>' +
                (lh !== null && lh > all ? ' <span class="bk-small">(mit ' + nBalls + ' Kugeln läuft die Reihe durch)</span>' : '') + '</div>';
            const nf = Math.max(0, Math.ceil(ch.nF));
            h += '<div>Formel: <span data-tex="n \\approx ' + fmtSig(ch.nF, 3).replace(',', '{,}') + '"></span> → nach ' + stoesse(nf) + '</div>';
            if (lh !== null && lh !== nf) {
                h += '<div class="bk-small">Die Formel rechnet mit kleinen Winkeln. Zuletzt sind die Winkel groß, dann wächst der ' +
                    'Fehler schneller als <span data-tex="a/d"></span> – die Reihe reißt ' + (nf - lh === 1 ? 'einen Stoß' : (nf - lh) + ' Stöße') + ' früher.</div>';
            }
        } else if (q === 1) {
            const lh = ch.longHits;
            h += '<div>Für kleine Winkel bleibt der Fehler gleich (Faktor 1).</div>';
            h += '<div class="bk-small">Exakt wachsen große Winkel ganz langsam: Die Reihe reißt ' +
                (lh === null ? 'erst nach mehr als ' + stoesse(LONG_RUN) : 'erst nach ' + stoesse(lh)) + ' ab.</div>';
        } else if (q > 0) {
            h += '<div>Der Fehler schrumpft bei jedem Stoß – die Reihe reißt nie ab.</div>';
        } else {
            h += '<div>Die Kugeln berühren sich: Nach dem ersten Stoß ist der Fehler weg, <span data-tex="\\alpha_1 = 0"></span>.</div>';
        }
        res.innerHTML = h;
        renderTex(res);
    }

    // ---------------- "Wie genau müsste man zielen?" ----------------
    function openAim() {
        const body = document.getElementById('bk-aim-body');
        const c = q + 1, dMM = POOL_D_MM, aMM = q * dMM;
        let h = '<p>Echte Pool-Kugeln: <span data-tex="d = 57{,}15\\,\\text{mm}"></span>, Lücke <span data-tex="a = ' +
            fmtSig(aMM, 4).replace(',', '{,}') + '\\,\\text{mm}"></span> (<span data-tex="a/d = ' + fmtQ(q).replace(',', '{,}') + '"></span>). ' +
            'Damit <span data-tex="n"></span> Stöße hintereinander treffen, muss der Anfangsfehler kleiner sein als</p>' +
            '<div class="bk-aim-formula" data-tex="\\alpha_0 < \\frac{d}{a+d}\\cdot\\left(\\frac{d}{a}\\right)^{n-1}" data-display="1"></div>';
        if (q <= 1) {
            h += '<p>Bei <span data-tex="a/d \\le 1"></span> wächst der Fehler nicht – fast jeder Anfangsfehler reicht. ' +
                'Die Formel gilt nur für <span data-tex="a > d"></span>; unten stehen die exakten Werte.</p>';
        }
        AIM_NS.forEach(n => {
            const need = needAlpha(n, c), needD = need / DEG;
            const lin = (1 / c) * Math.pow(1 / q, n - 1), linD = lin / DEG;
            const off = aMM / 1000 * Math.tan(need);            // metres sideways after the gap a
            let val = '<span data-tex="\\alpha_0 <"></span> <span class="bk-num">' + sciHTML(needD, 3, '°') + '</span>';
            if (q > 1) val += ' <span class="bk-small">(Formel: <span class="bk-num">' + sciHTML(linD, 3, '°') + '</span>)</span>';
            if (q > 0) val += '<br>Seitlich nach der Lücke <span data-tex="a"></span>: <span class="bk-num">' + fmtLen(off) + '</span> – ' + compareSize(off);
            else val += '<br>Die Kugeln berühren sich: Jeder Fehler unter 90° reicht.';
            h += '<div class="bk-aim-row"><div class="bk-aim-n">' + n + ' STÖSSE</div><div class="bk-aim-val">' + val + '</div>' +
                '<button type="button" class="cyber-btn" data-n="' + n + '" title="' + (n + 1) + ' Kugeln, Anfangsfehler knapp darunter">ZEIGEN</button></div>';
        });
        h += '<p class="bk-aim-src">Exakt = Kreisgeometrie Stoß für Stoß, die Grenze per Intervallhalbierung gesucht. ' +
            'Jeder Stoß mehr verlangt einen <span data-tex="a/d"></span>-mal genaueren Schuss. Größen: Pool-Kugel 2¼ Zoll = 57,15 mm (WPA-Norm); ' +
            'Haar 0,02–0,18 mm; rotes Blutkörperchen ≈ 7,5 µm; grünes Licht 550 nm; Grippevirus 80–120 nm; Atom ≈ 0,1 nm; ' +
            'Goldkern ≈ 14 fm; Proton ≈ 1,7 fm (Ladungsradius 0,841 fm, CODATA 2018); Planck-Länge 1,616·10⁻³⁵ m (CODATA 2018).</p>';
        body.innerHTML = h;
        renderTex(body);
        body.querySelectorAll('button[data-n]').forEach(b => b.addEventListener('click', () => showN(+b.dataset.n)));
        document.getElementById('bk-aim').hidden = false;
        document.getElementById('bk-aim-x').focus();
        dbg('Zielgenauigkeit für a/d = ' + q);
    }

    function closeAim() { const el = document.getElementById('bk-aim'); if (el) el.hidden = true; }

    // "ZEIGEN": n + 1 balls and a start error just below the limit - the row makes exactly its n collisions
    function showN(n) {
        const need = needAlpha(n, q + 1) / DEG;
        nBalls = clamp(n + 1, N_MIN, N_MAX);
        e0 = clamp(Math.log10(need * 0.8), E0_MIN, E0_MAX);
        syncSliders();
        closeAim();
        changed();
        shoot();
    }

    // ---------------- panel ----------------
    const refs = {};
    function sliderRef(id) {
        const group = document.getElementById(id).lastElementChild;
        return { input: group.querySelector('input'), display: group.querySelector('.val-display'), group };
    }
    const fmtE0 = v => sciHTML(Math.pow(10, v), 2, '°', true);
    const fmtEx = v => (v <= 3 ? fmtInt(Math.pow(10, v)) : '10<sup>' + v + '</sup>') + '-fach';

    function syncSliders() {
        refs.q.input.value = q; refs.q.display.textContent = fmtQ(q);
        refs.n.input.value = nBalls; refs.n.display.textContent = String(nBalls);
        refs.e0.input.value = e0; refs.e0.display.innerHTML = fmtE0(e0);
        refs.ex.input.value = ex; refs.ex.display.innerHTML = fmtEx(ex);
        syncPresets();
    }

    function syncPresets() {
        document.querySelectorAll('#bk-presets input[type=radio]').forEach(r => {
            const p = PRESETS.find(pp => pp.id === r.value);
            r.checked = !!p && Math.abs(p.q - q) < 1e-9;
        });
    }

    function buildPanel() {
        CyberUI.createCard('ui-container', 'Kugelreihe',
            '<div id="bk-presets"></div><div id="bk-q"></div><div id="bk-n"></div>' +
            '<div class="bk-info"><b>a</b> = Lücke zwischen zwei Kugeln, <b>d</b> = Durchmesser – wie auf der Folie.</div>', '#f5c242');
        CyberUI.createRadioGroup('bk-presets', 'Voreinstellung', PRESETS.map(p => ({ label: p.label, value: p.id })), 'folie', id => {
            const p = PRESETS.find(pp => pp.id === id);
            if (!p) return;
            q = p.q;
            syncSliders();
            changed();
        });
        CyberUI.createSlider('bk-q', 'Lücke durch Durchmesser a/d', 0, Q_MAX, q, 0.01, v => {
            q = clamp(Math.round(v * 100) / 100, 0, Q_MAX);
            syncPresets();
            changed();
        }, 'var(--neon-blue)', v => fmtQ(+v));
        refs.q = sliderRef('bk-q');
        const tick = (v, label, cls) => '<span class="' + (cls || '') + '" style="left: calc(8px + (100% - 16px) * ' + (v / Q_MAX) + ')">' + label + '</span>';
        refs.q.group.insertAdjacentHTML('beforeend', '<div class="bk-ticks" aria-hidden="true">' + tick(0, '0') + tick(1, '1') + tick(2, '2 FOLIE', 'bk-slide') + tick(Q_MAX, String(Q_MAX)) + '</div>');
        CyberUI.createSlider('bk-n', 'Anzahl Kugeln', N_MIN, N_MAX, nBalls, 1, v => {
            nBalls = clamp(Math.round(v), N_MIN, N_MAX);
            changed();
        }, 'var(--neon-blue)', v => String(Math.round(v)));
        refs.n = sliderRef('bk-n');

        CyberUI.createCard('ui-container', 'Stoß',
            '<div id="bk-e0"></div><div id="bk-ex"></div>' +
            '<div class="bk-btn-grid"><button type="button" class="cyber-btn" id="bk-shot">STOSS</button>' +
            '<button type="button" class="cyber-btn" id="bk-reset">AUFSTELLEN</button></div>' +
            '<div class="bk-info">Leertaste = Stoß. Die Überhöhung streckt nur die Querrichtung – so werden winzige Winkel sichtbar; ' +
            'die Kugeln bleiben rund.</div>', '#f5c242');
        CyberUI.createSlider('bk-e0', 'Anfangsfehler α₀', E0_MIN, E0_MAX, e0, 0.01, v => {
            e0 = clamp(v, E0_MIN, E0_MAX);
            refs.e0.display.innerHTML = fmtE0(e0);
            changed();
        }, 'var(--neon-blue)', v => String(v));
        refs.e0 = sliderRef('bk-e0');
        CyberUI.createSlider('bk-ex', 'Überhöhung quer', 0, EX_MAX, ex, 1, v => {
            ex = clamp(Math.round(v), 0, EX_MAX);
            refs.ex.display.innerHTML = fmtEx(ex);
            save();
            drawTable();
        }, 'var(--neon-blue)', v => String(v));
        refs.ex = sliderRef('bk-ex');
        document.getElementById('bk-shot').addEventListener('click', shoot);
        document.getElementById('bk-reset').addEventListener('click', () => { setUp(); drawTable(); });

        CyberUI.createCard('ui-container', 'Ergebnis',
            '<div class="bk-res" id="bk-res"></div>' +
            '<div class="bk-btn-grid one"><button type="button" class="cyber-btn" id="bk-aimbtn">WIE GENAU MÜSSTE MAN ZIELEN?</button></div>', '#f5c242');
        document.getElementById('bk-aimbtn').addEventListener('click', openAim);
        syncSliders();
    }

    // ---------------- coach box ----------------
    function buildCoach() {
        const body = document.getElementById('coach-content');
        if (!body) return;
        body.innerHTML =
            '<p>Die weiße Kugel startet mit einem winzigen Richtungsfehler <span data-tex="\\alpha_0"></span>. Nach der Lücke ' +
            '<span data-tex="a"></span> trifft sie die nächste Kugel leicht seitlich – die läuft entlang der Verbindungslinie der ' +
            'Mittelpunkte weiter, schiefer als zuvor (<span data-tex="d"></span> = Durchmesser).</p>' +
            '<p>Aus <span data-tex="x = a\\sin\\alpha_0 = d\\sin\\alpha_1"></span> folgt für kleine Winkel ' +
            '<span data-tex="\\alpha_1 \\approx \\tfrac{a}{d}\\,\\alpha_0"></span>, nach <span data-tex="n"></span> Stößen</p>' +
            '<div class="bk-coach-f" data-tex="\\alpha_n \\approx \\alpha_0\\cdot\\left(\\frac{a}{d}\\right)^{n}" data-display="1"></div>' +
            '<p>Die Reihe reißt ab, sobald die Bahn die nächste Kugel verfehlt, also bei <span data-tex="(a+d)\\sin\\alpha_n \\ge d"></span>:</p>' +
            '<div class="bk-coach-f" data-tex="n \\approx \\frac{\\ln\\frac{d}{(a+d)\\,\\alpha_0}}{\\ln\\frac{a}{d}}" data-display="1"></div>' +
            '<p><b>Und wenn <span data-tex="a/d < 1"></span>, z. B. 4 &lt; 5?</b> Dann ist die Lücke kleiner als eine Kugel, und der ' +
            'Fehler schrumpft bei jedem Stoß (<span data-tex="\\cdot\\,0{,}8"></span>) – die Reihe ist stabil. <span data-tex="a = d"></span> ' +
            'ist die Grenze (Faktor 1). Berühren sich die Kugeln (<span data-tex="a = 0"></span>, Kugelstoßpendel), ist der Fehler nach ' +
            'dem ersten Stoß weg.</p>';
        renderTex(body);
    }

    function buildLegend() {
        const el = document.getElementById('bk-legend');
        if (!el) return;
        el.innerHTML =
            '<span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="' + LAMBDA + '" stroke="rgb(10, 20, 40)" stroke-width="2"/></svg>exakt (Kreisgeometrie)</span>' +
            '<span><svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5 H21" stroke="' + PHI + '" stroke-width="2"/></svg>Formel <span data-tex="\\alpha_0\\cdot(a/d)^n"></span></span>' +
            '<span><svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5 H21" stroke="' + YPSILON + '" stroke-width="2" stroke-dasharray="6 4"/></svg>Abriss</span>';
        renderTex(el);
    }

    function renderTex(root) {
        if (!window.katex) { dbg('KaTeX fehlt'); return; }
        (root || document).querySelectorAll('[data-tex]').forEach(el => {
            try { katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: !!el.dataset.display }); } catch (e) { dbg('KaTeX: ' + e.message); }
        });
    }

    // ---------------- flow ----------------
    function setUp() {
        phase = 'set'; plan = null;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    function changed() {
        computeChain();
        setUp();
        drawTable();
        drawChart();
        buildData();
        updateStatus();
        save();
    }

    function shoot() {
        plan = makePlan();
        phase = 'run';
        t0 = performance.now() + 600;                // the cue draws back for 0.6 s first
        tau = -0.6;
        if (!raf) raf = requestAnimationFrame(frame);
        dbg('Stoß: a/d = ' + q + ', ' + nBalls + ' Kugeln, α0 = ' + Math.pow(10, e0).toExponential(3) + '°, ' +
            (ch.missed ? 'Abriss nach ' + ch.hits : 'alle ' + ch.hits + ' Stöße'));
    }

    function frame(now) {
        raf = 0;
        if (phase !== 'run') return;
        tau = (now - t0) / 1000;
        if (tau >= plan.tEnd) { tau = plan.tEnd; phase = 'done'; }
        drawTable();
        if (phase === 'run') raf = requestAnimationFrame(frame);
    }

    // ---------------- layout ----------------
    function sizeCanvas(c, g) {
        const wrap = c.parentElement, dpr = window.devicePixelRatio || 1;
        const w = Math.max(1, wrap.clientWidth), h = Math.max(1, wrap.clientHeight);
        c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        return [w, h];
    }

    let laying = false;
    function layoutStage() {
        if (laying) return;
        laying = true;
        const W = container.clientWidth, H = container.clientHeight;
        const cr = container.getBoundingClientRect(), st = container.scrollTop;
        const rel = el => {
            const b = el.getBoundingClientRect();
            return { l: b.left - cr.left, t: b.top - cr.top + st, r: b.right - cr.left, b: b.bottom - cr.top + st };
        };
        const co = rel(coach);
        const brandEl = document.querySelector('.canvas-branding');
        const brandB = brandEl ? rel(brandEl).b + 10 : 0;            // the title top right stays free
        const open = !coach.classList.contains('collapsed');
        const padX = W <= 700 ? 12 : 24, padT = 10;
        stage.style.paddingLeft = stage.style.paddingRight = padX + 'px';
        const inner = W - 2 * padX;
        const wide = W >= 900;
        // the coach box floats top left: with room, everything else goes into a column beside it, else below it
        const beside = wide && open && inner - (co.r - padX) - 16 >= 560;
        let mainTop;
        if (beside) {
            stage.style.flexDirection = 'row';
            spacer.style.width = Math.round(co.r - padX) + 'px';
            spacer.style.height = '';
            main.style.marginTop = Math.max(0, Math.round(brandB - padT)) + 'px';
            mainTop = Math.max(padT, brandB);
        } else {
            stage.style.flexDirection = 'column';
            spacer.style.width = '';
            spacer.style.height = Math.round(Math.max(co.b, brandB) - padT) + 'px';
            main.style.marginTop = '';
            mainTop = Math.max(co.b, brandB) + 16;
        }
        if (wide) {
            // fixed panel heights, the canvases fill them; the chart and the numbers take what is left of the screen
            const tH = Math.round(beside ? clamp(H * 0.44, 300, 480) : clamp(H * 0.42, 260, 460));
            tableBox.style.height = tH + 'px'; tableWrap.style.flex = ''; tableWrap.style.height = '';
            row2.style.gridTemplateColumns = 'minmax(0, 1.25fr) minmax(0, 1fr)';
            row2.style.height = Math.round(Math.max(330, H - mainTop - tH - 16 - 24)) + 'px';
            chartBox.style.height = ''; chartWrap.style.flex = ''; chartWrap.style.height = '';
            dataBox.style.height = ''; dataBox.style.maxHeight = '';
        } else {
            // a phone: the panels stack, each as tall as it needs, and the stage scrolls
            tableBox.style.height = 'auto';
            tableWrap.style.flex = 'none'; tableWrap.style.height = Math.round(clamp(inner * 0.56, 190, 320)) + 'px';
            row2.style.gridTemplateColumns = 'minmax(0, 1fr)';
            row2.style.height = 'auto';
            chartBox.style.height = 'auto';
            chartWrap.style.flex = 'none'; chartWrap.style.height = Math.round(clamp(inner * 0.75, 240, 340)) + 'px';
            dataBox.style.height = 'auto'; dataBox.style.maxHeight = '520px';
        }
        [tw, th] = sizeCanvas(cv, ctx);
        [cw, chh] = sizeCanvas(cc, cctx);
        drawTable();
        drawChart();
        laying = false;
    }

    // ---------------- input ----------------
    function chartHover(e) {
        if (!chartGeom) return;
        const r = cc.getBoundingClientRect(), x = e.clientX - r.left;
        const g = chartGeom;
        if (x < g.x0 - 10 || x > g.x1 + 10) { if (hoverN !== null) { hoverN = null; drawChart(); highlightRow(); } return; }
        const n = clamp(Math.round((x - g.x0) / (g.x1 - g.x0) * g.nMax), 0, g.nMax);
        if (n !== hoverN) { hoverN = n; drawChart(); highlightRow(); }
    }
    cc.addEventListener('pointermove', chartHover);
    cc.addEventListener('pointerdown', chartHover);
    cc.addEventListener('pointerleave', () => { hoverN = null; drawChart(); highlightRow(); });
    document.getElementById('bk-rows').addEventListener('pointerover', e => {
        const tr = e.target.closest('tr[data-n]');
        if (!tr) return;
        const n = +tr.dataset.n;
        if (n !== hoverN) { hoverN = n; drawChart(); highlightRow(); }
    });
    document.getElementById('bk-data').addEventListener('pointerleave', () => { hoverN = null; drawChart(); highlightRow(); });
    document.getElementById('bk-play').addEventListener('click', shoot);
    document.getElementById('bk-aim-x').addEventListener('click', closeAim);
    document.getElementById('bk-aim').addEventListener('click', e => { if (e.target.id === 'bk-aim') closeAim(); });

    // keys: space = shot, Esc closes the dialog (never with a modifier - Cmd-Shift-R stays the browser's)
    document.addEventListener('keydown', e => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === 'Escape' && !document.getElementById('bk-aim').hidden) { closeAim(); e.preventDefault(); return; }
        if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
        if (e.key === ' ') { shoot(); e.preventDefault(); }
    });

    // ---------------- settings, kept on this device ----------------
    const SAVE_KEY = 'billardkette';
    function save() {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, q, n: nBalls, e0, ex })); } catch (e) { /* no storage */ }
    }
    function load() {
        let st = null;
        try { st = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { st = null; }
        if (!st || st.v !== 1) return;
        if (isFinite(st.q)) q = clamp(st.q, 0, Q_MAX);
        if (isFinite(st.n)) nBalls = clamp(Math.round(st.n), N_MIN, N_MAX);
        if (isFinite(st.e0)) e0 = clamp(st.e0, E0_MIN, E0_MAX);
        if (isFinite(st.ex)) ex = clamp(Math.round(st.ex), 0, EX_MAX);
        dbg('Einstellungen geladen');
    }

    // ---------------- start ----------------
    load();
    buildPanel();
    buildCoach();
    buildLegend();
    renderTex(document.getElementById('bk-data'));
    computeChain();
    buildData();
    updateStatus();
    layoutStage();
    window.addEventListener('resize', layoutStage);
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => layoutStage());
        ro.observe(container);
        ro.observe(coach);
    }
    // the canvas labels are set in the KaTeX fonts - draw again once they are there
    Promise.all(['italic 16px KaTeX_Math', '16px KaTeX_Main', '12px Orbitron', '12px Outfit'].map(f => document.fonts.load(f).catch(() => null)))
        .then(() => { drawTable(); drawChart(); });
    document.fonts.ready.then(() => layoutStage());
    // the coach box glides to its place (on a phone it moves down below the menu button, transition 0.5 s) -
    // a ResizeObserver does not see a move, so lay out again when it has arrived
    coach.addEventListener('transitionend', () => layoutStage());
    new MutationObserver(() => setTimeout(layoutStage, 30)).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setTimeout(layoutStage, 700);
    dbg('bereit');
    // debug and tests
    window.Billardkette = {
        get chain() { return ch; }, collide, needAlpha,
        set(o) { if ('q' in o) q = o.q; if ('n' in o) nBalls = o.n; if ('e0' in o) e0 = o.e0; if ('ex' in o) ex = o.ex; syncSliders(); changed(); },
        shoot, openAim, closeAim, get phase() { return phase; }
    };
})();
