// Dreiecks-Billard (dreiecksbillard.html): a laser bounces inside a triangle, a curve on the rim shows its hits.
// Doc, 14.10.2026: OpenAI's preprint "Ergodicity of triangular billiards with an irrational angle" (25.09.2026) -
// if one angle is an irrational multiple of pi, the billiard flow is ergodic, so the hits spread evenly over the rim:
// equal windows get equal counts in the long run. The windows can be dragged and resized ("verschiebbar und in ihrer
// Größe veränderbar"); bars outside the rim show the hit density. Since 15.10.2026 the windows are off at first and
// switched on in their card, and the curve counts the hits themselves: it grows outward from the rim until the run
// reaches its goal and stops - an even spread then stands equally high all round. A rose beside the triangle shows the
// directions the laser flies in: that is where rational and irrational really differ (spikes or a round ring).
(function () {
    'use strict';

    function dbg(msg) { try { if (window.DebugWindow) DebugWindow.log('[billard] ' + msg); } catch (e) { } }

    const DEG = Math.PI / 180;
    const LAMBDA = [245, 194, 66], YPSILON = [176, 36, 24], PHI = [121, 158, 49], NEON = [0, 210, 255];
    const WHITE = [235, 238, 245];
    // six windows, two per side (Doc, 14.10.2026) - no red among them, red is the laser
    const WIN_COLORS = [PHI, NEON, LAMBDA, WHITE, [170, 120, 255], [255, 120, 190]];
    const NAMES = 'ABCDEF';
    const rgba = (c, a) => 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + a + ')';

    // The preset triangles. A tag marks an irrational angle; the others are shown as a fraction of 180°.
    const PRESETS = [
        { id: 'irr', label: 'α = 1 rad, β = √2 rad', a: 1, b: Math.SQRT2, tags: ['1 rad', '√2 rad', 'π − 1 − √2 rad'],
            hint: 'Alle drei Winkel irrational: Die Kurve wächst überall gleich hoch, die Rose wird ein runder Ring – der Laser ' +
                'fliegt in alle Richtungen.' },
        { id: 'right', label: 'Rechtwinklig, α = 1 rad', a: 1, b: Math.PI / 2, tags: ['1 rad', null, 'π/2 − 1 rad'],
            hint: 'Vom Satz gedeckt (zwei Winkel irrational) – aber die Kurve wird quälend langsam flach. ' +
                'Genau solche Dreiecke hatten in Simulationen Zweifel geweckt.' },
        { id: 'equi', label: 'Gleichseitig (60°, 60°, 60°)', a: 60 * DEG, b: 60 * DEG, tags: [null, null, null],
            hint: 'Rational und trotzdem flach: Der Laser kennt nur 6 Richtungen, die Symmetrie verteilt sie gleich ' +
                'auf alle Seiten. Die Rose zeigt sie als 6 Stacheln.' },
        { id: 'r30', label: '30°, 60°, 90°', a: 30 * DEG, b: 60 * DEG, tags: [null, null, null],
            hint: 'Rational: Jede Seite für sich wird gleichmäßig getroffen, aber die Seiten unterscheiden sich – ' +
                'je nach Startrichtung. Die Kurve hat Stufen, die Rose 12 Stacheln.' },
        { id: 'r45', label: '45°, 45°, 90°', a: 45 * DEG, b: 45 * DEG, tags: [null, null, null],
            hint: 'Rational: Jede Seite für sich gleichmäßig, die Seiten untereinander nicht. Ein neuer Schuss ' +
                'verschiebt die Stufen. Die Rose zeigt 8 Stacheln.' },
    ];
    const CUSTOM_HINT = 'Eigene Winkel. Im Rechner ist jede Zahl ein Bruch – „irrational“ heißt hier: kein Bruch ' +
        'mit kleinem Nenner.';

    const NB = 1 << 18;                     // fine bins along the whole rim: the windows count from these
    const NB_MIN = 16, NB_MAX = Math.round(0.3 * NB);
    const CURVE_MIN = 16, CURVE_BINS = 512; // the rim curve: at least / at most this many pieces all round
    const PER_BIN = 400;                    // ... and only as fine as gives every piece 400 hits at the end of a run
    // a run ends at its goal (Doc, 15.10.2026: "wir rechnen hunderttausend Schritte ... und dann stopp") - the goal
    // sets the scale, so the curve grows from the rim and stands at full height when the run is done
    const GOALS = [1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7];
    const TRAIL = 28;                       // laser segments shown fading
    const TRACE_CAP = 300000;               // the trace shows the first flights of a shot - redrawn on every zoom
    const TRACE_BUDGET = 12000;             // trace segments painted per frame
    const ZOOM_MAX = 1000;
    // ONE yardstick for window bars and rim curve: LINE_H px out from the rim is an even spread at the end of a run,
    // R_CAP times that the cap. Zero is the rim itself, so an empty stretch lies under the triangle's edge.
    const LINE_H = 36, R_CAP = 2;
    // the direction rose (Doc, 15.10.2026: "der Unterschied zwischen irrational und rational ist kaum sichtbar"): where
    // the laser hits the rim barely tells them apart, the directions it flies in do - a rational triangle knows only a
    // few (12, 8 or 6 spikes), an irrational one all of them (a round ring). Every flight adds its length to its
    // direction (time spent per direction, the flow's own measure), so an even spread is a circle.
    const DIR_BINS = 180;                   // 2° each
    const ROSE_CAP = 2.5;                   // spikes cut at 2.5 times the ring an even spread makes at the goal
    const ROSE_MIN = 180, ROSE_MAX = 120;   // room the corner beside the coach box needs; the rose's radius at most

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvas-container');
    const coach = document.getElementById('math-coach-box');
    // the trace and, while a zoom redraws it, the old picture scaled as a stand-in (the two canvases swap)
    let trace = document.createElement('canvas'), tctx = trace.getContext('2d');
    let prev = document.createElement('canvas'), pctx = prev.getContext('2d');

    let angA = PRESETS[0].a, angB = PRESETS[0].b, preset = PRESETS[0];
    let G = null;                           // geometry: { V, sides, P }
    let view = { k: 1, ox: 0, oy: 0, w: 1, h: 1 };
    // starts paused and slow - one gets into it step by step (Doc, 14.10.2026: "Startet das mal bitte nicht animiert")
    // the speed in round steps - 1 … 9, 10 … 90, … up to 9 million reflections per second (Doc, 14.10.2026: "warum
    // so eine krumme Zahl?" - the log slider ended at 6.309.573; 10 million did not fit beside the label)
    const SPEEDS = [];
    for (let d = 1; d <= 1e6; d *= 10) for (let m = 1; m <= 9; m++) SPEEDS.push(m * d);
    let running = false, speedI = SPEEDS.indexOf(5), traceOn = true;
    let goalI = GOALS.indexOf(1e5);
    let wins = [], sel = 0, winsTouched = false;
    // the windows only when switched on (Doc, 15.10.2026: "herausnehmen vielleicht nicht, aber einschaltbar machen")
    let winsOn = false;
    let linked = true;                      // all windows equally wide (Doc, 14.10.2026: A breiter ziehen, B geht mit)
    let drag = null, aim = null, pan = null, pinch = null;
    const pointers = new Map();
    let zoom = 1, midX = 0, midY = 0;      // zoom 1 = the whole triangle; (midX, midY) = math point in the middle
    let fitK = 1, fitX = 0, fitY = 0;       // scale and screen centre of the free area at zoom 1

    const fine = new Uint32Array(NB);
    const liveBins = new Float64Array(CURVE_BINS);
    const dirLen = new Float64Array(DIR_BINS);   // flight length per direction, for the rose
    let rose = null;                        // the rose on screen: { x, y, r }
    const sim = { x: 0, y: 0, vx: 1, vy: 0, side: -1, u: 0, hits: 0, steps: 0 };
    // a second cursor replays the shot from its start for the trace: the path is deterministic, so a zoom redraws it
    // sharp instead of blowing up pixels (Doc, 14.10.2026: "cooles Muster ... zoombar machen")
    const shot0 = { x: 0, y: 0, vx: 1, vy: 0 };
    const tr = { x: 0, y: 0, vx: 1, vy: 0, side: -1, u: 0, n: 0, dead: false };
    let traceView = { k: 1, ox: 0, oy: 0 }, traceDirty = false, traceAt = 0, preview = null;
    const trail = new Float64Array(2 * TRAIL);
    let trailHead = 0, trailLen = 0;

    // ---------------- geometry ----------------
    function buildTriangle(a, b) {
        const g = Math.PI - a - b;
        const lenAC = Math.sin(b) / Math.sin(g);                 // law of sines with |AB| = 1
        const V = [[0, 0], [1, 0], [lenAC * Math.cos(a), lenAC * Math.sin(a)]];   // counterclockwise
        const sides = [];
        let off = 0;
        for (let i = 0; i < 3; i++) {
            const p = V[i], q = V[(i + 1) % 3];
            const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
            // outward normal of a counterclockwise polygon: (dy, -dx) / L
            sides.push({ p, dx, dy, L, nx: dy / L, ny: -dx / L, off });
            off += L;
        }
        return { a, b, g, V, sides, P: off, A: 0.5 * V[2][1] };
    }

    const mod = (x, m) => ((x % m) + m) % m;

    function rimPoint(s) {
        s = mod(s, G.P);
        for (let i = 0; i < 3; i++) {
            const sd = G.sides[i];
            if (s <= sd.off + sd.L || i === 2) {
                const u = Math.min(1, Math.max(0, (s - sd.off) / sd.L));
                return { x: sd.p[0] + u * sd.dx, y: sd.p[1] + u * sd.dy, side: i };
            }
        }
    }

    // the rim from s to s + len as a polyline, corners included
    function rimPolyline(s, len) {
        const pts = [rimPoint(s)];
        const P = G.P, o1 = G.sides[1].off, o2 = G.sides[2].off;
        [o1, o2, P, P + o1, P + o2].forEach(v => {
            if (v > s && v < s + len) { const q = rimPoint(v); pts.push(q); }
        });
        pts.push(rimPoint(s + len));
        return pts;
    }

    const SX = x => view.ox + view.k * x;
    const SY = y => view.oy - view.k * y;
    const MX = sx => (sx - view.ox) / view.k;
    const MY = sy => (view.oy - sy) / view.k;

    function insideTri(x, y) {
        for (const sd of G.sides) {
            if (sd.dx * (y - sd.p[1]) - sd.dy * (x - sd.p[0]) < 0) return false;
        }
        return true;
    }

    // nearest rim position to a screen point: perimeter coordinate s and distance in px
    function nearestRim(mx, my) {
        let best = { s: 0, dist: Infinity };
        G.sides.forEach(sd => {
            const x0 = SX(sd.p[0]), y0 = SY(sd.p[1]);
            const ex = view.k * sd.dx, ey = -view.k * sd.dy;
            let t = ((mx - x0) * ex + (my - y0) * ey) / (ex * ex + ey * ey);
            t = Math.min(1, Math.max(0, t));
            const d = Math.hypot(mx - (x0 + t * ex), my - (y0 + t * ey));
            if (d < best.dist) best = { s: sd.off + t * sd.L, dist: d };
        });
        return best;
    }

    // ---------------- simulation ----------------
    function resetCounts() {
        fine.fill(0);
        dirLen.fill(0);
        sim.hits = 0;
        syncRunButton();
    }

    function pushTrail(x, y) {
        trail[2 * trailHead] = x; trail[2 * trailHead + 1] = y;
        trailHead = (trailHead + 1) % TRAIL;
        if (trailLen < TRAIL) trailLen++;
    }

    function shoot(x, y, theta) {
        resetCounts();
        sim.x = x; sim.y = y; sim.vx = Math.cos(theta); sim.vy = Math.sin(theta); sim.side = -1; sim.steps = 0;
        Object.assign(shot0, { x: sim.x, y: sim.y, vx: sim.vx, vy: sim.vy });
        trailLen = 0; trailHead = 0;
        pushTrail(x, y);
        preview = null;
        restartTrace();
    }

    function randomShot() {
        let r1 = Math.random(), r2 = Math.random();
        if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
        const [A, B, C] = G.V;
        shoot(A[0] + r1 * (B[0] - A[0]) + r2 * (C[0] - A[0]),
            A[1] + r1 * (B[1] - A[1]) + r2 * (C[1] - A[1]), Math.random() * 2 * Math.PI);
    }

    // one flight of a cursor (sim or tr) to the rim and the reflection there: the side it hit (u along it in st.u),
    // or -1 at a corner, where nothing moves
    function fly(st) {
        let best = Infinity, bi = -1, bu = 0;
        for (let i = 0; i < 3; i++) {
            if (i === st.side) continue;
            const sd = G.sides[i];
            const den = st.vx * sd.dy - st.vy * sd.dx;
            if (Math.abs(den) < 1e-15) continue;
            const wx = sd.p[0] - st.x, wy = sd.p[1] - st.y;
            const t = (wx * sd.dy - wy * sd.dx) / den;
            const u = (wx * st.vy - wy * st.vx) / den;
            if (t > 1e-12 && u >= -1e-9 && u <= 1 + 1e-9 && t < best) { best = t; bi = i; bu = u; }
        }
        if (bi < 0 || bu < 1e-10 || bu > 1 - 1e-10) return -1;
        const sd = G.sides[bi];
        st.x = sd.p[0] + bu * sd.dx; st.y = sd.p[1] + bu * sd.dy;
        const dot = st.vx * sd.nx + st.vy * sd.ny;
        st.vx -= 2 * dot * sd.nx; st.vy -= 2 * dot * sd.ny;
        const m = Math.hypot(st.vx, st.vy);
        st.vx /= m; st.vy /= m;
        st.side = bi; st.u = bu;
        return bi;
    }

    // one flight of the laser, counted; false if it ran into a corner
    function step() {
        const x0 = sim.x, y0 = sim.y, vx = sim.vx, vy = sim.vy;
        const bi = fly(sim);
        if (bi < 0) {
            // a corner has no reflection (a measure-zero event) - start a new shot
            dbg('Laser in eine Ecke gelaufen nach ' + sim.hits + ' Treffern – neuer Schuss');
            randomShot();
            return false;
        }
        const sd = G.sides[bi], bu = sim.u;
        sim.steps++;

        let k = Math.floor((sd.off + bu * sd.L) / G.P * NB);
        if (k >= NB) k = NB - 1;
        fine[k]++;
        sim.hits++;
        // the flight's length to its direction
        const d = Math.floor((Math.atan2(vy, vx) / (2 * Math.PI) + 1) * DIR_BINS) % DIR_BINS;
        dirLen[d] += Math.hypot(sim.x - x0, sim.y - y0);
        return true;
    }

    // ---------------- windows ----------------
    const winStart = w => w.b0 / NB * G.P;
    const winLen = w => w.nb / NB * G.P;

    function setWin(w, s0, len) {
        w.nb = Math.min(NB_MAX, Math.max(NB_MIN, Math.round(len / G.P * NB)));
        w.b0 = mod(Math.round(s0 / G.P * NB), NB);
    }

    function winCount(w) {
        let sum = 0;
        for (let i = 0; i < w.nb; i++) sum += fine[(w.b0 + i) & (NB - 1)];
        return sum;
    }

    function inWindow(s) {
        if (!winsOn) return -1;
        const b = s / G.P * NB;
        for (let i = 0; i < wins.length; i++) {
            if (mod(b - wins[i].b0, NB) < wins[i].nb) return i;
        }
        return -1;
    }

    function relabel() {
        wins.forEach((w, i) => { w.name = NAMES[i]; w.color = WIN_COLORS[i]; });
        if (sel >= wins.length) sel = wins.length - 1;
    }

    // two windows on every side, at a quarter and three quarters of it (Doc, 14.10.2026: "auf jede Seite zwei Fenster")
    function placeDefaultWindows() {
        const len = 0.03 * G.P;
        wins = [];
        G.sides.forEach(sd => [0.25, 0.75].forEach(u => {
            const w = {};
            setWin(w, sd.off + u * sd.L - len / 2, len);
            wins.push(w);
        }));
        sel = 0;
        relabel();
    }

    // linked widths: the others take the width of window i, each keeping its centre
    function followWidth(i) {
        if (!linked || !wins[i]) return;
        const nl = winLen(wins[i]);
        wins.forEach((o, j) => {
            if (j !== i) { const mid = winStart(o) + winLen(o) / 2; setWin(o, mid - nl / 2, nl); }
        });
    }

    function addWindow() {
        if (wins.length >= NAMES.length) return;
        const sd = G.sides[wins.length % 3], len = linked && wins[sel] ? winLen(wins[sel]) : 0.03 * G.P;
        const w = {};
        setWin(w, sd.off + 0.35 * sd.L - len / 2, len);
        wins.push(w);
        sel = wins.length - 1;
        winsTouched = true;
        relabel();
        syncWidthSlider();
    }

    function removeWindow() {
        if (wins.length <= 1) return;
        wins.splice(sel, 1);
        winsTouched = true;
        relabel();
        syncWidthSlider();
    }

    // ---------------- layout ----------------
    function layout() {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const W = Math.max(1, rect.width), H = Math.max(1, rect.height);
        canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        viewChanged();                                               // the old picture becomes the stand-in first
        trace.width = canvas.width; trace.height = canvas.height;   // resizing clears the trace
        view.w = W; view.h = H;
        if (!G) return;

        // the free area: beside the coach box or below it, whichever is bigger
        let L = 0, T = 0, AW = W, AH = H;
        rose = null;
        if (coach && coach.classList.contains('visible')) {
            const br = coach.getBoundingClientRect();
            const right = br.right - rect.left, bottom = br.bottom - rect.top;
            if ((W - right) * H >= W * (H - bottom)) { L = right; AW = W - right; } else { T = bottom; AH = H - bottom; }
            // the rose in the corner the coach box leaves: below it when the triangle sits beside it, else beside it
            const cw = L ? right : W - right, ch = L ? H - bottom : bottom;
            if (Math.min(cw, ch) >= ROSE_MIN) {
                rose = { x: (L ? 0 : right) + cw / 2, y: (L ? bottom : 0) + ch / 2, r: Math.min(ROSE_MAX, Math.min(cw, ch) / 2 - 30) };
            }
        }
        if (!rose) {
            // else a strip of the free area: on the right when it is wide, at the bottom when it is tall
            const sz = Math.min(2 * ROSE_MAX + 60, 0.3 * Math.max(AW, AH), Math.min(AW, AH));
            if (AW >= AH) { rose = { x: L + AW - sz / 2, y: T + AH / 2, r: sz / 2 - 30 }; AW -= sz; }
            else { rose = { x: L + AW / 2, y: T + AH - sz / 2, r: sz / 2 - 30 }; AH -= sz; }
        }
        if (rose.r < 30) rose = null;
        const M = R_CAP * LINE_H + 32;              // bars and curve up to the cap, the window letters beyond
        const xs = G.V.map(v => v[0]), ys = G.V.map(v => v[1]);
        const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
        const bw = xmax - xmin, bh = ymax - ymin;
        fitK = Math.max(10, Math.min((AW - 2 * M) / bw, (AH - 2 * M) / bh));
        fitX = L + AW / 2; fitY = T + AH / 2;
        applyView();
    }

    function fitCentre() {
        const xs = G.V.map(v => v[0]), ys = G.V.map(v => v[1]);
        return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    }

    function resetView() { zoom = 1; [midX, midY] = fitCentre(); }

    function applyView() {
        view.k = fitK * zoom;
        view.ox = fitX - view.k * midX;
        view.oy = fitY + view.k * midY;
    }

    // zoom by f around a screen point - the math point under it stays where it is
    function zoomAt(mx, my, f) {
        const nz = Math.min(ZOOM_MAX, Math.max(1, zoom * f));
        if (nz === zoom) return;
        const x = MX(mx), y = MY(my);
        zoom = nz;
        if (zoom === 1) [midX, midY] = fitCentre();
        else {
            const k = fitK * zoom;
            midX = (fitX - mx + k * x) / k;
            midY = (my + k * y - fitY) / k;
        }
        applyView();
        viewChanged();
    }

    function panBy(dx, dy) {
        midX -= dx / view.k; midY += dy / view.k;
        applyView();
        viewChanged();
    }

    function fitView() {
        resetView();
        applyView();
        viewChanged();
    }

    // ---------------- drawing ----------------
    // ---------------- trace ----------------
    // after a view change the trace waits a moment (a wheel sends many events), then redraws from the shot's start;
    // the old picture, scaled to the new view, stands in until the new one has as many flights
    function viewChanged() {
        if (!preview && tr.n > 0) {
            [trace, prev] = [prev, trace];
            [tctx, pctx] = [pctx, tctx];
            preview = { n: tr.n, k: traceView.k, ox: traceView.ox, oy: traceView.oy };
        }
        traceDirty = true;
        traceAt = performance.now() + 120;
    }

    function restartTrace() {
        traceDirty = true;
        traceAt = 0;
    }

    function paintTrace() {
        if (!traceOn || !G) return;
        if (traceDirty) {
            if (performance.now() < traceAt) return;
            traceDirty = false;
            if (trace.width !== canvas.width || trace.height !== canvas.height) {
                trace.width = canvas.width; trace.height = canvas.height;
            }
            tctx.setTransform(1, 0, 0, 1, 0, 0);
            tctx.clearRect(0, 0, trace.width, trace.height);
            Object.assign(tr, shot0, { side: -1, n: 0, dead: false });
            traceView = { k: view.k, ox: view.ox, oy: view.oy };
        }
        const target = Math.min(sim.steps, TRACE_CAP);
        if (!tr.dead && tr.n < target) {
            const dpr = window.devicePixelRatio || 1;
            tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            tctx.strokeStyle = rgba(LAMBDA, 0.07);
            tctx.lineWidth = 1;
            for (let i = 0; i < TRACE_BUDGET && tr.n < target; i++) {
                const x0 = tr.x, y0 = tr.y;
                if (fly(tr) < 0) { tr.dead = true; break; }
                tr.n++;
                tctx.beginPath();
                tctx.moveTo(SX(x0), SY(y0));
                tctx.lineTo(SX(tr.x), SY(tr.y));
                tctx.stroke();
            }
        }
        if (preview && (tr.n >= preview.n || tr.n >= target || tr.dead)) preview = null;
    }

    // a bar standing outward on side sd from u0 to u1, f = its height in LINE_H (1 = an even spread at the goal, cut at R_CAP);
    // every bar starts right at the rim - no thin gap, the same for all (Doc, 14.10.2026: "einheitlich")
    function bar(sd, u0, u1, f, fill) {
        const nx = sd.nx, ny = -sd.ny;                       // outward normal on screen
        const x0 = SX(sd.p[0] + u0 * sd.dx), y0 = SY(sd.p[1] + u0 * sd.dy);
        const x1 = SX(sd.p[0] + u1 * sd.dx), y1 = SY(sd.p[1] + u1 * sd.dy);
        const h0 = 0, h1 = Math.min(R_CAP, f) * LINE_H;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(x0 + nx * h0, y0 + ny * h0);
        ctx.lineTo(x1 + nx * h0, y1 + ny * h0);
        ctx.lineTo(x1 + nx * h1, y1 + ny * h1);
        ctx.lineTo(x0 + nx * h1, y0 + ny * h1);
        ctx.closePath();
        ctx.fill();
    }

    // the pieces of a window on the sides (a window may run round a corner): [{ sd, u0, u1 }]
    function winPieces(w) {
        const s0 = winStart(w), s1 = s0 + winLen(w), out = [];
        G.sides.forEach(sd => [0, G.P].forEach(k => {
            const a = Math.max(s0, sd.off + k), b = Math.min(s1, sd.off + sd.L + k);
            if (b > a) out.push({ sd, u0: (a - sd.off - k) / sd.L, u1: (b - sd.off - k) / sd.L });
        }));
        return out;
    }

    // ---------------- window bars and rim curve ----------------
    // The hits themselves, growing outward from the rim (Doc, 15.10.2026: "warum wachsen die denn nie von unten") - on
    // the scale of the run's end: at the goal an even spread stands LINE_H high all round, a 30-60-90 triangle shows
    // steps. No target line and no run-ahead any more (Doc: "die würde ich nicht zeigen").
    const goal = () => GOALS[goalI];

    // as many pieces of the rim as give each about PER_BIN hits at the end of the run - fixed for a run, so the curve
    // only grows and never jumps
    function curveBins() {
        let B = CURVE_MIN;
        while (B < CURVE_BINS && goal() / (2 * B) >= PER_BIN) B <<= 1;
        return B;
    }

    // one window, one bar (Doc, 14.10.2026: "ich will doch wissen, wie häufig treffe ich das Fenster A, B und C"):
    // its hits per length, on the same scale as the curve
    function drawWindowBars() {
        if (!sim.hits) return;
        wins.forEach(w => {
            const r = winCount(w) / (goal() * w.nb / NB);
            winPieces(w).forEach(pc => bar(pc.sd, pc.u0, pc.u1, r, rgba(w.color, 0.85)));
        });
    }

    // the rim curve - between the windows, or all round when they are off
    function drawRimLine() {
        if (!sim.hits) return;
        const B = curveBins(), per = NB / B, full = goal() / B;
        for (let b = 0; b < B; b++) {
            let sum = 0;
            for (let i = b * per, e = i + per; i < e; i++) sum += fine[i];
            liveBins[b] = sum / full;
        }
        const solid = new Path2D();
        G.sides.forEach(sd => {
            const nx = sd.nx, ny = -sd.ny;                           // outward normal on screen
            const n = 2 * Math.max(2, Math.ceil(sd.L / G.P * B));    // two points per piece
            let inRun = false;
            for (let j = 0; j <= n; j++) {
                const u = j / n, s = sd.off + Math.min(1 - 1e-9, Math.max(1e-9, u)) * sd.L;
                // the curve only outside the windows - inside, the bar shows it
                if (inWindow(s) < 0) {
                    const bx = SX(sd.p[0] + u * sd.dx), by = SY(sd.p[1] + u * sd.dy);
                    const hn = Math.min(R_CAP, liveBins[Math.min(B - 1, Math.floor(s / G.P * B))]) * LINE_H;
                    if (inRun) solid.lineTo(bx + nx * hn, by + ny * hn); else solid.moveTo(bx + nx * hn, by + ny * hn);
                    inRun = true;
                } else inRun = false;
            }
        });
        ctx.save();
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke(solid);
        ctx.restore();
    }

    function drawTriangle() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        G.V.forEach((v, i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, SX(v[0]), SY(v[1])));
        ctx.closePath();
        ctx.stroke();
    }

    // the angles on top of everything, each plate tucked into its corner without touching a side, with a small arc
    // at the vertex (Doc, 14.10.2026: "Winkel on top und schöner positionieren")
    function drawAngles() {
        const greek = ['α', 'β', 'γ'], ang = [G.a, G.b, G.g];
        const font = '600 13px Orbitron, sans-serif', h = 22, margin = 9, R = 18;
        ctx.save();
        ctx.font = font;
        G.V.forEach((v, i) => {
            const vx = SX(v[0]), vy = SY(v[1]);
            const unit = q => { const dx = SX(q[0]) - vx, dy = SY(q[1]) - vy, l = Math.hypot(dx, dy); return [dx / l, dy / l, l]; };
            const [e1x, e1y, l1] = unit(G.V[(i + 1) % 3]), [e2x, e2y, l2] = unit(G.V[(i + 2) % 3]);
            // normals of both sides, pointing into the wedge
            const d12 = e1x * e2x + e1y * e2y;
            let n1x = e2x - d12 * e1x, n1y = e2y - d12 * e1y, n2x = e1x - d12 * e2x, n2y = e1y - d12 * e2y;
            const ln1 = Math.hypot(n1x, n1y), ln2 = Math.hypot(n2x, n2y);
            n1x /= ln1; n1y /= ln1; n2x /= ln2; n2y /= ln2;
            let bx = e1x + e2x, by = e1y + e2y;
            const lb = Math.hypot(bx, by);
            bx /= lb; by /= lb;

            const text = greek[i] + ' = ' + fmt(ang[i] / DEG, 2) + '°';
            const w = ctx.measureText(text).width + 14;
            // walk out along the bisector until all four plate corners keep the margin to both sides
            const tMax = 0.45 * Math.min(l1, l2);
            let t = R + 6;
            for (; t < tMax; t += 1) {
                const cx = vx + t * bx, cy = vy + t * by;
                let ok = true;
                for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
                    const px = cx + sx * w / 2 - vx, py = cy + sy * h / 2 - vy;
                    if (px * n1x + py * n1y < margin || px * n2x + py * n2y < margin) { ok = false; break; }
                }
                if (ok) break;
            }

            // the arc at the vertex, the short way round from one side to the other
            const a1 = Math.atan2(e1y, e1x);
            let sweep = Math.atan2(e2y, e2x) - a1;
            if (sweep > Math.PI) sweep -= 2 * Math.PI;
            if (sweep < -Math.PI) sweep += 2 * Math.PI;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(vx, vy, R, a1, a1 + sweep, sweep < 0);
            ctx.stroke();

            plate(text, vx + t * bx, vy + t * by, 'rgba(255, 255, 255, 0.95)', font);
        });
        ctx.restore();
    }

    // a label on a dark plate: stays readable on the trace, however orange it gets
    function plate(text, x, y, color, font) {
        ctx.save();
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const w = ctx.measureText(text).width + 14, h = 22;
        ctx.fillStyle = 'rgba(8, 20, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 7);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.fillText(text, x, y + 1);
        ctx.restore();
    }

    function drawWindows() {
        wins.forEach((w, i) => {
            const pts = rimPolyline(winStart(w), winLen(w));
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = rgba(w.color, 1);
            ctx.shadowColor = rgba(w.color, 0.8);
            ctx.shadowBlur = 10;
            ctx.lineWidth = i === sel ? 8 : 6;
            ctx.beginPath();
            pts.forEach((q, j) => (j ? ctx.lineTo : ctx.moveTo).call(ctx, SX(q.x), SY(q.y)));
            ctx.stroke();
            ctx.restore();

            // end handles
            [pts[0], pts[pts.length - 1]].forEach(q => {
                ctx.beginPath();
                ctx.arc(SX(q.x), SY(q.y), i === sel ? 7 : 5.5, 0, 2 * Math.PI);
                ctx.fillStyle = rgba(w.color, 1);
                ctx.fill();
                if (i === sel) { ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'; ctx.lineWidth = 2; ctx.stroke(); }
            });

            // letter outside, beyond the bars (Doc, 14.10.2026: "A und B außen bitte") - also a move handle for
            // very small windows
            const t = tagPos(w);
            plate(w.name, t.x, t.y, rgba(w.color, 1), '700 14px Orbitron, sans-serif');
        });
    }

    function tagPos(w) {
        const q = rimPoint(winStart(w) + winLen(w) / 2);
        const sd = G.sides[q.side];
        const off = R_CAP * LINE_H + 16;                     // beyond the tallest bar; outward normal on screen: (nx, -ny)
        return { x: SX(q.x) + sd.nx * off, y: SY(q.y) - sd.ny * off };
    }

    // ---------------- direction rose ----------------
    function drawRose() {
        if (!rose) return;
        const { x, y, r } = rose, r0 = 0.42 * r, h = (r - r0) / ROSE_CAP;
        // what an even spread puts into one direction at the goal: goal flights of the mean free path pi A / P (Santaló)
        const full = goal() * Math.PI * G.A / G.P / DIR_BINS;
        ctx.save();
        ctx.fillStyle = 'rgba(8, 20, 42, 0.88)';
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r0, 0, 2 * Math.PI);
        ctx.stroke();
        if (sim.hits) {
            const line = new Path2D();
            for (let b = 0; b < DIR_BINS; b++) {
                const th = (b + 0.5) / DIR_BINS * 2 * Math.PI;
                const rr = r0 + Math.min(ROSE_CAP, dirLen[b] / full) * h;
                const px = x + rr * Math.cos(th), py = y - rr * Math.sin(th);
                if (b) line.lineTo(px, py); else line.moveTo(px, py);
            }
            line.closePath();
            // the ring between base circle and line, lightly filled
            const ring = new Path2D(line);
            ring.moveTo(x + r0, y);
            ring.arc(x, y, r0, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill(ring, 'evenodd');
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineJoin = 'round';
            ctx.stroke(line);
        }
        // where the laser flies right now
        if (!aim) {
            ctx.fillStyle = rgba(YPSILON, 1);
            ctx.beginPath();
            ctx.arc(x + r0 * sim.vx, y - r0 * sim.vy, 3.5, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
        plate('RICHTUNGEN', x, y + r + 16, 'rgba(255, 255, 255, 0.75)', '700 10px Orbitron, sans-serif');
    }

    function drawLaser() {
        // while a new shot is aimed the old laser is gone - dot, trail and arrow (Doc, 14.10.2026)
        if (trailLen < 1 || aim) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.shadowColor = rgba(YPSILON, 1);
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        const start = (trailHead - trailLen + TRAIL) % TRAIL;
        const px = j => trail[2 * ((start + j) % TRAIL)], py = j => trail[2 * ((start + j) % TRAIL) + 1];
        let lx = px(0), ly = py(0);
        for (let j = 1; j <= trailLen; j++) {
            const x = j < trailLen ? px(j) : sim.x, y = j < trailLen ? py(j) : sim.y;
            ctx.strokeStyle = rgba(YPSILON, 0.15 + 0.85 * j / trailLen);
            ctx.beginPath();
            ctx.moveTo(SX(lx), SY(ly));
            ctx.lineTo(SX(x), SY(y));
            ctx.stroke();
            lx = x; ly = y;
        }
        ctx.beginPath();
        ctx.arc(SX(sim.x), SY(sim.y), 4, 0, 2 * Math.PI);
        ctx.fillStyle = rgba(YPSILON, 1);
        ctx.fill();
        // before the first flight: the way to the first wall
        if (sim.steps === 0) {
            ctx.strokeStyle = rgba(YPSILON, 1);
            ctx.lineWidth = 2;
            aimLine(sim.x, sim.y, sim.vx, sim.vy);
        }
        ctx.restore();
    }

    // a dashed arrow from (x0, y0) to (x1, y1) in the current stroke and fill colour
    function arrow(x0, y0, x1, y1) {
        const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy);
        if (l <= 8) return;
        const ux = dx / l, uy = dy / l;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 12 * ux + 6 * uy, y1 - 12 * uy - 6 * ux);
        ctx.lineTo(x1 - 12 * ux - 6 * uy, y1 - 12 * uy + 6 * ux);
        ctx.closePath();
        ctx.fill();
    }

    // the aim line has no length of its own: it always runs from the start to the wall the laser hits first, while
    // aiming and after the release alike (Doc, 14.10.2026: the long drawn arrow jumped back to a short one)
    function aimLine(x, y, vx, vy) {
        const st = { x, y, vx, vy, side: -1, u: 0 };
        const x0 = SX(x), y0 = SY(y);
        if (fly(st) >= 0) arrow(x0, y0, SX(st.x), SY(st.y));
        else arrow(x0, y0, x0 + 46 * vx, y0 - 46 * vy);          // straight into a corner: a short arrow
    }

    function drawAim() {
        if (!aim) return;
        const x0 = SX(aim.x), y0 = SY(aim.y), dx = aim.cx - x0, dy = aim.cy - y0, l = Math.hypot(dx, dy);
        ctx.save();
        ctx.strokeStyle = rgba(YPSILON, 1);
        ctx.fillStyle = rgba(YPSILON, 1);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x0, y0, 5, 0, 2 * Math.PI);
        ctx.fill();
        if (l > 8) aimLine(aim.x, aim.y, dx / l, -dy / l);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, view.w, view.h);
        if (!G) return;
        if (traceOn) {
            if (preview) {
                const sc = view.k / preview.k, dpr = window.devicePixelRatio || 1;
                ctx.drawImage(prev, view.ox - sc * preview.ox, view.oy - sc * preview.oy, prev.width / dpr * sc, prev.height / dpr * sc);
            } else ctx.drawImage(trace, 0, 0, view.w, view.h);
        }
        if (winsOn) drawWindowBars();
        drawRimLine();
        drawTriangle();
        if (winsOn) drawWindows();
        drawLaser();
        drawAim();
        drawAngles();
        drawRose();
    }

    // ---------------- loop ----------------
    let lastPanel = 0, lastT = 0, carry = 0;
    function frame(now) {
        const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 0;
        lastT = now;
        if (running && G && !aim) {
            // reflections per second, the fraction carried to the next frame (a slow laser moves every few frames)
            carry += SPEEDS[speedI] * dt;
            const n = Math.min(200000, Math.floor(carry), Math.max(0, goal() - sim.hits));
            carry -= n;
            for (let i = 0; i < n; i++) {
                const x0 = sim.x, y0 = sim.y;
                if (!step()) break;
                if (n - i <= TRAIL) pushTrail(x0, y0);
            }
            // the goal reached: the run is done
            if (sim.hits >= goal()) { setRunning(false); carry = 0; dbg('Ziel erreicht: ' + fmtInt(sim.hits) + ' Treffer'); }
        }
        paintTrace();
        draw();
        if (now - lastPanel > 250) { lastPanel = now; updatePanel(); saveSettings(); }
        requestAnimationFrame(frame);
    }

    // ---------------- pointer ----------------
    const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const TOL_RIM = coarsePointer ? 34 : 24, TOL_H = coarsePointer ? 18 : 11;

    function local(e) {
        const r = canvas.getBoundingClientRect();
        return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }

    function hitWindow(mx, my) {
        if (!winsOn) return null;
        const order = wins.map((w, i) => i).sort((a, b) => (b === sel) - (a === sel));
        for (const i of order) {
            const t = tagPos(wins[i]);
            if (Math.hypot(mx - t.x, my - t.y) < 14) return { i, mode: 'move', grab: winLen(wins[i]) / 2 };
        }
        const r = nearestRim(mx, my);
        if (r.dist > TOL_RIM) return null;
        for (const i of order) {
            const w = wins[i], s0 = winStart(w), len = winLen(w);
            const rel = mod(r.s - s0 + G.P / 2, G.P) - G.P / 2;   // signed, relative to the window start
            const relPx = rel * view.k, lenPx = len * view.k;
            const hz = Math.min(TOL_H, lenPx / 3);
            if (relPx > -TOL_H && relPx < hz) return { i, mode: 'start' };
            if (relPx > lenPx - hz && relPx < lenPx + TOL_H) return { i, mode: 'end' };
            if (relPx >= hz && relPx <= lenPx - hz) return { i, mode: 'move', grab: rel };
        }
        return null;
    }

    function dragWindow(mx, my) {
        const w = wins[drag.i], s = nearestRim(mx, my).s, P = G.P;
        const minLen = NB_MIN / NB * P, maxLen = NB_MAX / NB * P;
        const s0 = winStart(w), len = winLen(w);
        if (drag.mode === 'move') {
            setWin(w, s - drag.grab, len);
        } else if (drag.mode === 'start') {
            const end = s0 + len;
            let nl = mod(end - s, P);
            if (nl > P / 2) nl = minLen;
            nl = Math.min(maxLen, Math.max(minLen, nl));
            setWin(w, end - nl, nl);
        } else {
            let nl = mod(s - s0, P);
            if (nl > P / 2) nl = minLen;
            setWin(w, s0, Math.min(maxLen, Math.max(minLen, nl)));
        }
        if (drag.mode !== 'move') followWidth(drag.i);
        winsTouched = true;
        syncWidthSlider();
    }

    // pointer: a window = move or resize it, inside the triangle = aim a new shot, outside (or with Shift, or the
    // middle button) = pan; two fingers pinch to zoom
    function pinchState() {
        const [a, b] = [...pointers.values()];
        return { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    canvas.addEventListener('pointerdown', e => {
        if (!G) return;
        const { mx, my } = local(e);
        pointers.set(e.pointerId, { x: mx, y: my });
        canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
        if (pointers.size === 2) {
            // the second finger: whatever the first one started is dropped
            drag = null; aim = null; pan = null;
            pinch = pinchState();
            return;
        }
        if (pointers.size > 2 || pinch) return;
        if (e.button === 1 || e.shiftKey) { pan = { x: mx, y: my }; canvas.style.cursor = 'grabbing'; return; }
        const hit = hitWindow(mx, my);
        if (hit) {
            drag = hit;
            sel = hit.i;
            syncWidthSlider();
            canvas.style.cursor = hit.mode === 'move' ? 'grabbing' : 'ew-resize';
            return;
        }
        const x = MX(mx), y = MY(my);
        if (insideTri(x, y)) aim = { x, y, cx: mx, cy: my };
        else { pan = { x: mx, y: my }; canvas.style.cursor = 'grabbing'; }
    });
    // no autoscroll on the middle button
    canvas.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });

    canvas.addEventListener('pointermove', e => {
        if (!G) return;
        const { mx, my } = local(e);
        if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: mx, y: my });
        if (pinch) {
            if (pointers.size < 2) return;
            const p = pinchState();
            if (pinch.d > 0 && p.d > 0) zoomAt(p.x, p.y, p.d / pinch.d);
            panBy(p.x - pinch.x, p.y - pinch.y);
            pinch = p;
            return;
        }
        if (pan) { panBy(mx - pan.x, my - pan.y); pan.x = mx; pan.y = my; return; }
        if (drag) { dragWindow(mx, my); return; }
        if (aim) { aim.cx = mx; aim.cy = my; return; }
        const hit = hitWindow(mx, my);
        canvas.style.cursor = hit ? (hit.mode === 'move' ? 'grab' : 'ew-resize')
            : (insideTri(MX(mx), MY(my)) ? 'crosshair' : 'grab');
    });

    function endPointer(e) {
        pointers.delete(e.pointerId);
        if (pinch) { if (pointers.size < 2) pinch = null; return; }
        if (pan) { pan = null; canvas.style.cursor = 'grab'; return; }
        if (drag) { drag = null; canvas.style.cursor = 'default'; }
        if (aim) {
            const dx = aim.cx - SX(aim.x), dy = aim.cy - SY(aim.y);
            const theta = Math.hypot(dx, dy) < 8 ? Math.random() * 2 * Math.PI : Math.atan2(-dy, dx);
            shoot(aim.x, aim.y, theta);
            dbg('Neuer Schuss bei (' + aim.x.toFixed(3) + ', ' + aim.y.toFixed(3) + '), Richtung ' + fmt(theta / DEG, 1) + '°');
            aim = null;
        }
    }
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);

    // wheel and trackpad (Doc, 14.10.2026: "denk ans Trackpad bitte"): a pinch zooms (it arrives as a wheel with
    // ctrlKey, in Safari as a gesture), two fingers pan, a mouse wheel zooms; over a window both change its width.
    // Window or view is decided when a gesture starts, so a window sliding under the fingers while panning stays as it is.
    let wheelLock = null, wheelT = 0;
    canvas.addEventListener('wheel', e => {
        if (!G) return;
        e.preventDefault();
        const { mx, my } = local(e);
        const unit = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? 400 : 1);
        const dx = e.deltaX * unit, dy = e.deltaY * unit;
        const now = performance.now();
        if (now - wheelT > 250) wheelLock = null;
        wheelT = now;
        if (e.ctrlKey) { zoomAt(mx, my, Math.exp(-dy * 0.01)); return; }
        // a trackpad reports wheelDeltaY = -3 * deltaY (Chrome, Safari), a mouse notch +-120; Firefox: lines = mouse
        const trackpad = dx !== 0 || (e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0);
        if (!wheelLock) {
            const hit = hitWindow(mx, my);
            wheelLock = hit ? { win: hit.i } : { view: true };
        }
        if (wheelLock.view) {
            if (trackpad) panBy(-dx, -dy);
            else zoomAt(mx, my, Math.exp(-dy * 0.0015));
            return;
        }
        const w = wins[wheelLock.win];
        if (!w) return;
        const len = winLen(w), mid = winStart(w) + len / 2;
        const nl = Math.min(NB_MAX / NB * G.P, Math.max(NB_MIN / NB * G.P, len * Math.exp(-dy * 0.0015)));
        setWin(w, mid - nl / 2, nl);
        followWidth(wheelLock.win);
        sel = wheelLock.win;
        winsTouched = true;
        syncWidthSlider();
    }, { passive: false });

    // Safari's own trackpad pinch
    let gestureScale = 1;
    canvas.addEventListener('gesturestart', e => { e.preventDefault(); gestureScale = 1; });
    canvas.addEventListener('gesturechange', e => {
        e.preventDefault();
        const { mx, my } = local(e);
        zoomAt(mx, my, e.scale / gestureScale);
        gestureScale = e.scale;
    });

    // keys: space = pause / go on, n = new shot, + / - / 0 = zoom (never with a modifier - Cmd-Shift-R stays free)
    document.addEventListener('keydown', e => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement.tagName)) return;
        if (e.key === ' ') { setRunning(!running); e.preventDefault(); }
        if (e.key === 'n' || e.key === 'N') { randomShot(); e.preventDefault(); }
        if (e.key === '+' || e.key === '=') { zoomAt(fitX, fitY, 1.5); e.preventDefault(); }
        if (e.key === '-') { zoomAt(fitX, fitY, 1 / 1.5); e.preventDefault(); }
        if (e.key === '0') { fitView(); e.preventDefault(); }
    });

    // ---------------- numbers ----------------
    function fmt(x, d) { return x.toFixed(d).replace('.', ','); }
    function fmtInt(n) { return Math.round(n).toLocaleString('de-DE'); }
    function fmtPct(f) {
        const p = f * 100;
        return (p >= 1 ? fmt(p, 1) : String(Number(p.toPrecision(2))).replace('.', ',')) + ' %';
    }
    // from a million on in words: 1 Million, 6 Millionen, 10 Millionen
    function fmtBig(v) { return v >= 1e6 ? (v === 1e6 ? '1 Million' : v / 1e6 + ' Millionen') : fmtInt(v); }
    function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }

    // an angle in words: a tag for the known irrational ones, else the fraction of 180°
    function angleText(rad, tag) {
        const deg = rad / DEG;
        if (tag) return fmt(deg, 2) + '° = ' + tag + ', <span class="db-irr">irrational</span>';
        const num = Math.round(deg * 100), g = gcd(num, 18000);
        const p = num / g, q = 18000 / g;
        const frac = q === 1 ? String(p) : p + '/' + q;
        const degText = Math.abs(deg - Math.round(deg)) < 1e-9 ? String(Math.round(deg)) : fmt(deg, 2);
        // Orbitron has no middle dot (an empty box) - the times sign it has
        return degText + '° = ' + frac + ' × 180°, <span class="db-rat">rational' + (q > 100 ? ', Nenner ' + fmtInt(q) : '') + '</span>';
    }

    // ---------------- panel ----------------
    // plus and minus as SVG: Orbitron draws them as tiny dots (icons are always SVG)
    const svgIcon = d => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" ' +
        'stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="' + d + '"/></svg>';
    const PLUS = svgIcon('M8 3v10M3 8h10'), MINUS = svgIcon('M3 8h10');
    let sliderA = null, sliderB = null, sliderW = null, speedRun = null;

    function sliderRef(id) {
        const group = document.getElementById(id).lastElementChild;
        return { input: group.querySelector('input'), display: group.querySelector('.val-display'), label: group.querySelector('.cyber-label') };
    }

    function setSlider(ref, val, text) {
        if (!ref) return;
        ref.input.value = val;
        ref.display.innerText = text;
    }

    function setRunning(on) {
        // a finished run starts over, the laser flies on from where it is
        if (on && sim.hits >= goal()) resetCounts();
        running = on;
        syncRunButton();
    }

    function syncRunButton() {
        if (speedRun) speedRun.textContent = running ? 'PAUSE' : (sim.hits && sim.hits >= goal() ? 'NOCHMAL' : 'START');
    }

    function onGoal(i) {
        goalI = Math.min(GOALS.length - 1, Math.max(0, Math.round(i)));
        const el = document.getElementById('db-goal-n');
        if (el) el.textContent = fmtInt(goal());
        if (running && sim.hits >= goal()) setRunning(false);
        syncRunButton();
    }

    function syncWidthSlider() {
        if (!sliderW || !wins[sel]) return;
        const f = wins[sel].nb / NB;
        setSlider(sliderW, Math.log10(f), fmtPct(f));
        sliderW.label.textContent = linked ? 'Breite (alle)' : 'Breite von ' + wins[sel].name;
    }

    function showAngles() {
        const el = document.getElementById('db-anginfo');
        if (!el) return;
        const tags = preset ? preset.tags : [null, null, null];
        el.innerHTML =
            '<div><b>α</b> = ' + angleText(G.a, tags[0]) + '</div>' +
            '<div><b>β</b> = ' + angleText(G.b, tags[1]) + '</div>' +
            '<div><b>γ</b> = ' + angleText(G.g, tags[2]) + '</div>' +
            '<div style="margin-top:6px">' + (preset ? preset.hint : CUSTOM_HINT) + '</div>';
    }

    function newTriangle() {
        G = buildTriangle(angA, angB);
        if (!winsTouched) placeDefaultWindows();
        resetView();
        layout();
        resetCounts();
        randomShot();
        showAngles();
        syncWidthSlider();
        dbg('Dreieck α = ' + fmt(G.a / DEG, 4) + '°, β = ' + fmt(G.b / DEG, 4) + '°, γ = ' + fmt(G.g / DEG, 4) + '°');
    }

    function applyPreset(id) {
        preset = PRESETS.find(p => p.id === id) || PRESETS[0];
        angA = preset.a; angB = preset.b;
        setSlider(sliderA, angA / DEG, fmt(angA / DEG, 2) + '°');
        setSlider(sliderB, angB / DEG, fmt(angB / DEG, 2) + '°');
        newTriangle();
    }

    function onAngleSlider(which, v) {
        preset = null;
        document.querySelectorAll('#db-presets input[type=radio]').forEach(r => { r.checked = false; });
        if (which === 'a') {
            angA = v * DEG;
            if (angA + angB > 179 * DEG) { angB = 179 * DEG - angA; setSlider(sliderB, angB / DEG, fmt(angB / DEG, 2) + '°'); }
        } else {
            angB = v * DEG;
            if (angA + angB > 179 * DEG) { angA = 179 * DEG - angB; setSlider(sliderA, angA / DEG, fmt(angA / DEG, 2) + '°'); }
        }
        newTriangle();
    }

    function updatePanel() {
        if (!G) return;
        CyberClock.digits('db-hits-n', sim.hits, { thousands: true });
        CyberClock.digits('db-zoom-n', fmt(zoom, 1), { minDigits: 3 });
        const t = document.getElementById('db-wintable');
        if (!t || !winsOn) return;
        // the rows are rebuilt only when they change; the numbers go into the digits widget, one fixed slot per digit
        // (Doc, 14.10.2026: "damit die gleich breit bleiben. Sonst springt das alles viel zu sehr")
        const key = wins.length + ':' + sel;
        if (t.dataset.key !== key) {
            t.dataset.key = key;
            let html = '<tr><th>FENSTER</th><th>BREITE %</th><th>TREFFER</th><th title="Treffer geteilt durch die erwarteten Treffer bei gleichmäßiger Verteilung">VERHÄLTNIS</th></tr>';
            wins.forEach((w, i) => {
                html += '<tr class="db-win' + (i === sel ? ' sel' : '') + '" data-i="' + i + '">' +
                    '<td><span class="db-sw" style="background:' + rgba(w.color, 1) + '"></span>' + w.name + '</td>' +
                    '<td><span id="db-w' + i + '-b"></span></td><td><span id="db-w' + i + '-t"></span></td>' +
                    '<td><span id="db-w' + i + '-r"></span></td></tr>';
            });
            t.innerHTML = html;
        }
        wins.forEach((w, i) => {
            const cnt = winCount(w), exp = sim.hits * w.nb / NB, p = w.nb / NB * 100;
            CyberClock.digits('db-w' + i + '-b', fmt(p, p >= 0.1 ? 2 : 4), { minDigits: 2 });
            CyberClock.digits('db-w' + i + '-t', cnt, { thousands: true });
            CyberClock.digits('db-w' + i + '-r', exp > 0 ? fmt(cnt / exp, 3) : '–', { style: { color: rgba(w.color, 1) } });
        });
    }

    function buildPanel() {
        CyberUI.createCard('ui-container', 'Dreieck',
            '<div id="db-presets"></div><div id="db-sa"></div><div id="db-sb"></div><div id="db-anginfo" class="db-info"></div>',
            '#f5c242');
        CyberUI.createRadioGroup('db-presets', 'Voreinstellung', PRESETS.map(p => ({ label: p.label, value: p.id })), preset ? preset.id : null, applyPreset);
        CyberUI.createSlider('db-sa', 'Winkel α', 1, 170, angA / DEG, 0.01, v => onAngleSlider('a', v), 'var(--neon-blue)', v => fmt(v, 2) + '°');
        CyberUI.createSlider('db-sb', 'Winkel β', 1, 170, angB / DEG, 0.01, v => onAngleSlider('b', v), 'var(--neon-blue)', v => fmt(v, 2) + '°');
        sliderA = sliderRef('db-sa');
        sliderB = sliderRef('db-sb');

        CyberUI.createCard('ui-container', 'Laser',
            '<div class="db-btn-grid"><button type="button" class="cyber-btn" id="db-run">START</button>' +
            '<button type="button" class="cyber-btn" id="db-shot">NEUER SCHUSS</button>' +
            '<button type="button" class="cyber-btn" id="db-zero">ZÄHLER 0</button></div>' +
            '<div id="db-speed"></div><div id="db-goal"></div><div id="db-checks"></div>' +
            '<div class="db-count">Treffer am Rand: <span id="db-hits-n"></span> von <b id="db-goal-n"></b></div>' +
            '<div class="db-info">Ins Dreieck tippen und ziehen: Startpunkt und Richtung. Leertaste = Start / Pause, N = neuer Schuss.</div>',
            '#f5c242');
        speedRun = document.getElementById('db-run');
        speedRun.addEventListener('click', () => setRunning(!running));
        document.getElementById('db-shot').addEventListener('click', randomShot);
        document.getElementById('db-zero').addEventListener('click', resetCounts);
        CyberUI.createSlider('db-speed', 'Reflexionen pro Sekunde', 0, SPEEDS.length - 1, speedI, 1, v => {
            speedI = Math.min(SPEEDS.length - 1, Math.max(0, Math.round(v)));
        },
            'var(--neon-blue)', v => fmtBig(SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, Math.round(v)))]));
        CyberUI.createSlider('db-goal', 'Treffer bis Stopp', 0, GOALS.length - 1, goalI, 1, onGoal,
            'var(--neon-blue)', v => fmtBig(GOALS[Math.min(GOALS.length - 1, Math.max(0, Math.round(v)))]));
        onGoal(goalI);
        CyberUI.createCheckbox('db-checks', 'Spur', traceOn, on => {
            traceOn = on;
            preview = null;
            if (on) restartTrace();
            else { tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, trace.width, trace.height); tr.n = 0; }
        });

        CyberUI.createCard('ui-container', 'Ansicht',
            '<div class="db-btn-grid"><button type="button" class="cyber-btn" id="db-zin" title="Hineinzoomen" aria-label="Hineinzoomen">' + PLUS + '</button>' +
            '<button type="button" class="cyber-btn" id="db-zout" title="Herauszoomen" aria-label="Herauszoomen">' + MINUS + '</button>' +
            '<button type="button" class="cyber-btn" id="db-zfit">GANZ</button></div>' +
            '<div class="db-count">Zoom: <span id="db-zoom-n"></span> ×</div>' +
            '<div class="db-info">Trackpad: Pinch = Zoom, zwei Finger = verschieben. Maus: Rad = Zoom, außerhalb des ' +
            'Dreiecks oder mit Shift ziehen = verschieben. Fon: zwei Finger. Die Spur zeigt die ersten 300.000 Flüge und ' +
            'wird nach jedem Zoom scharf neu gezeichnet.</div>',
            '#f5c242');
        document.getElementById('db-zin').addEventListener('click', () => zoomAt(fitX, fitY, 2));
        document.getElementById('db-zout').addEventListener('click', () => zoomAt(fitX, fitY, 0.5));
        document.getElementById('db-zfit').addEventListener('click', fitView);

        CyberUI.createCard('ui-container', 'Fenster',
            '<div id="db-winon"></div><div id="db-winbody"' + (winsOn ? '' : ' hidden') + '>' +
            '<table class="db-wins" id="db-wintable"></table><div id="db-link"></div><div id="db-sw"></div>' +
            '<div class="db-btn-grid two"><button type="button" class="cyber-btn" id="db-add">' + PLUS + '&nbsp;FENSTER</button>' +
            '<button type="button" class="cyber-btn" id="db-del">' + MINUS + '&nbsp;FENSTER</button></div>' +
            '<div class="db-info">Fenster ziehen = verschieben, die Enden ziehen oder darüber scrollen = Breite. ' +
            'Kleine Fenster am Buchstaben greifen.</div></div>',
            '#f5c242');
        // off: only the rim curve - on: the windows, their bars, the table and the width controls
        CyberUI.createCheckbox('db-winon', 'Fenster zeigen', winsOn, on => {
            winsOn = on;
            drag = null; wheelLock = null;
            document.getElementById('db-winbody').hidden = !on;
            buildCoach();
            updatePanel();
        });
        CyberUI.createSlider('db-sw', 'Breite von A', -4.2, Math.log10(0.3), Math.log10(0.03), 0.01, v => {
            const w = wins[sel];
            if (!w) return;
            const len = Math.pow(10, v) * G.P, mid = winStart(w) + winLen(w) / 2;
            setWin(w, mid - len / 2, len);
            followWidth(sel);
            winsTouched = true;
        }, 'var(--neon-blue)', v => fmtPct(Math.pow(10, v)));
        sliderW = sliderRef('db-sw');
        // off: each window keeps its own width - e.g. one shrinks towards zero next to a wide one
        CyberUI.createCheckbox('db-link', 'Gleich breit', linked, on => {
            linked = on;
            followWidth(sel);
            syncWidthSlider();
        });
        document.getElementById('db-add').addEventListener('click', addWindow);
        document.getElementById('db-del').addEventListener('click', removeWindow);
        document.getElementById('db-wintable').addEventListener('click', e => {
            const row = e.target.closest('tr.db-win');
            if (!row) return;
            sel = +row.dataset.i;
            syncWidthSlider();
            updatePanel();
        });
    }

    // ---------------- coach box ----------------
    function buildCoach() {
        const title = document.getElementById('coach-title-slot');
        if (title) title.textContent = 'LASER IM DREIECK';
        const body = document.getElementById('coach-content');
        if (!body) return;
        body.innerHTML =
            '<p><b>Satz</b> (OpenAI-Preprint, 25.09.2026): Ist ein Winkel ein irrationales Vielfaches von 180°, ' +
            'verteilen sich die Treffer des Lasers auf lange Sicht gleichmäßig über den Rand – für fast jeden Startschuss.</p>' +
            '<p>Ein Stück des Randes der Länge <span class="db-f" data-tex="b"></span> sollte dann ' +
            '<span class="db-f" data-tex="N\\cdot\\frac{b}{U}"></span> Treffer bekommen (<span class="db-f" data-tex="N"></span> ' +
            'alle Treffer, <span class="db-f" data-tex="U"></span> Umfang). Das Verhältnis geht gegen 1.</p>' +
            '<p>Die Kurve außen am Rand zählt die Treffer: Jeder Treffer legt seinem Stück des Randes etwas drauf, ' +
            'alles wächst nach außen' + (winsOn ? ', die Fensterbalken genauso' : '') + '. Der Lauf hält bei der ' +
            'eingestellten Zahl von Treffern an – ist die Verteilung gleichmäßig, steht die Kurve dann überall gleich hoch.</p>' +
            '<p>Die Rose zeigt die Flugrichtungen: Jeder Flug legt bei seiner Richtung etwas drauf, je länger, desto mehr. ' +
            'Im rationalen Dreieck kennt der Laser nur wenige Richtungen – Stacheln. Im irrationalen kommen alle vor – ein ' +
            'runder Ring. Das ist der eigentliche Unterschied: Der Satz sagt, Ort und Richtung werden gleichmäßig durchmischt.</p>';
        renderTex();
    }

    function renderTex() {
        if (!window.katex) return;
        document.querySelectorAll('[data-tex]').forEach(el => {
            try { katex.render(el.dataset.tex, el, { throwOnError: false }); } catch (e) { dbg('KaTeX: ' + e.message); }
        });
    }
    window.addEventListener('load', renderTex);

    // ---------------- settings, kept on this device ----------------
    // everything one can set survives a reload (Doc, 14.10.2026: "alles persistieren, was man da einstellen kann") -
    // the triangle, speed, goal, trace, bars, windows (on or off), linked widths, zoom and the last shot; not the run state, the lab
    // always starts paused
    const SAVE_KEY = 'dreiecksbillard';
    let lastSaved = '';

    function snapshot() {
        return JSON.stringify({
            v: 1, preset: preset ? preset.id : null, a: angA, b: angB, speedI, goalI, trace: traceOn,
            linked, winsOn, winsTouched, sel, wins: wins.map(w => ({ b0: w.b0, nb: w.nb })), zoom, midX, midY,
            shot: { x: shot0.x, y: shot0.y, th: Math.atan2(shot0.vy, shot0.vx) }
        });
    }

    function saveSettings() {
        if (!G) return;
        const snap = snapshot();
        if (snap === lastSaved) return;
        lastSaved = snap;
        try { localStorage.setItem(SAVE_KEY, snap); } catch (e) { /* no storage: nothing is kept */ }
    }

    function loadSettings() {
        let st = null;
        try { st = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { st = null; }
        if (!st || st.v !== 1) return null;
        const p = PRESETS.find(q => q.id === st.preset);
        if (p) { preset = p; angA = p.a; angB = p.b; }
        else if (st.preset === null && st.a > 0 && st.b > 0 && st.a + st.b < Math.PI) { preset = null; angA = st.a; angB = st.b; }
        if (Number.isInteger(st.speedI)) speedI = Math.min(SPEEDS.length - 1, Math.max(0, st.speedI));
        if (Number.isInteger(st.goalI)) goalI = Math.min(GOALS.length - 1, Math.max(0, st.goalI));
        if (typeof st.trace === 'boolean') traceOn = st.trace;
        if (typeof st.linked === 'boolean') linked = st.linked;
        if (typeof st.winsOn === 'boolean') winsOn = st.winsOn;
        if (st.winsTouched && Array.isArray(st.wins) && st.wins.length >= 1 && st.wins.length <= NAMES.length) {
            wins = st.wins.map(w => ({ b0: mod(Math.round(w.b0), NB), nb: Math.min(NB_MAX, Math.max(NB_MIN, Math.round(w.nb))) }));
            winsTouched = true;
            sel = Math.min(wins.length - 1, Math.max(0, st.sel | 0));
            relabel();
        }
        dbg('Einstellungen geladen');
        return st;
    }

    // after the first triangle: the kept view and the kept shot (the trace replays it - the same pattern again)
    function restoreViewAndShot(st) {
        if (!st) return;
        if (st.zoom >= 1 && isFinite(st.zoom) && isFinite(st.midX) && isFinite(st.midY)) {
            zoom = Math.min(ZOOM_MAX, st.zoom); midX = st.midX; midY = st.midY;
            applyView();
            viewChanged();
        }
        const sh = st.shot;
        if (sh && isFinite(sh.x) && isFinite(sh.y) && isFinite(sh.th) && insideTri(sh.x, sh.y)) shoot(sh.x, sh.y, sh.th);
    }

    // ---------------- start ----------------
    const kept = loadSettings();
    buildPanel();
    buildCoach();
    newTriangle();
    restoreViewAndShot(kept);
    window.addEventListener('pagehide', saveSettings);
    window.addEventListener('resize', () => { layout(); });
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => layout());
        ro.observe(container);
        if (coach) ro.observe(coach);
    }
    document.fonts.ready.then(() => layout());
    requestAnimationFrame(frame);
    dbg('bereit');
    window.Dreiecksbillard = { sim, fine, dirLen, get rose() { return rose; }, get wins() { return wins; }, get G() { return G; } };   // debug
})();
