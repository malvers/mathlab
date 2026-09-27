// Würfelspiel (wuerfelspiel.html), part 3 of 9: captions, tap targets, the two stages, die states, cube and net.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // Column captions ("Zahl", "wie oft?", "Wahrscheinlichkeit", ...). One constant, so
        // they cannot drift apart. Doc, 18.09.2026, on the film at 1:01: the old 10 px sat
        // next to 16 px content and was unreadable on the screen in class.
        const CAP = 13;

        // Orbitron for headers and labels - never for numbers in the content
        function label(text, x, y, size, color, align = 'left', weight = 700) {
            ctx.font = weight + ' ' + size + 'px Orbitron, sans-serif';
            ctx.fillStyle = color;
            ctx.textAlign = align;
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);
        }

        function line(x1, y1, x2, y2, color, width, dash) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            if (dash) ctx.setLineDash(dash);
            ctx.stroke();
            if (dash) ctx.setLineDash([]);
        }

        function dot(x, y, r, fill, edge) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.fill();
            if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1.4; ctx.stroke(); }
        }

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;

        /* ----------------------------------------------------------------- Hits */
        // Every view registers its tap targets while drawing, in design coordinates.
        // An offset stack keeps sub-drawings (a tree inside a view) simple.
        const hits = [];
        const offs = [{ x: 0, y: 0 }];

        function addHit(x, y, w, h, fn, cursor = 'pointer') {
            const o = offs[offs.length - 1];
            hits.push({ x: x + o.x, y: y + o.y, w, h, fn, cursor });
        }

        function withOffset(x, y, fn) {
            const o = offs[offs.length - 1];
            offs.push({ x: o.x + x, y: o.y + y });
            ctx.save();
            ctx.translate(x, y);
            try { fn(); } finally { ctx.restore(); offs.pop(); }
        }

        /* ---------------------------------------------------------------- State */
        const S = {
            mode: 'rundgang',          // rundgang (the deck, station by station) | labor (own dice)
            step: 0,                   // rundgang: current station
            view: 'spiel',             // labor: current view
            lab: presetDice('deck'),   // labor: the dice being edited
            labPreset: 'deck',
            anim: null,                // running roll
            last: null,                // last finished roll { ia, ib, key }
            score: { key: '', n: 0, A: 0, B: 0, D: 0 },
            sel: 0,                    // selected path (path rule, table)
            err: 0,                    // typical errors: which one
            merge: { die: 'B', grouped: true, u: 1, t0: 0, from: 1 },
            countHi: { A: null, B: null },
            focus: null,               // 'A' | 'B' - Solita points at one die
            recipeHi: -1,
            rulesHi: -1,
            sim: { key: '', n: 0, a: 0, b: 0, d: 0, hx: [], ha: [], hb: [], pts: [], ptsAt: 0, running: false, until: 0 },
            efron: 'AB',
            showSolution: false
        };

        function diceNow() {
            if (S.mode === 'labor') return S.lab;
            const st = STATIONS[S.step];
            return presetDice(st.dice || 'deck');
        }

        const model = () => buildModel(diceNow());

        function tintOf(key, m, v) {
            const G = key === 'A' ? m.GA : m.GB;
            const i = Math.max(0, G.findIndex(g => g.v === v));
            return TINTS[key][i % TINTS[key].length];
        }

        /* ----------------------------------------------------------------- Roll */
        // Lena rolls first, then Mia - the two stages, one after the other
        const ROLL = { A: [0, 650], B: [760, 1410], total: 1520 };

        function rollDice() {
            const m = model();
            S.anim = {
                t0: performance.now(),
                ia: Math.floor(Math.random() * 6),
                ib: Math.floor(Math.random() * 6),
                seed: Math.floor(Math.random() * 997),
                key: m.key
            };
            closePicker();
            kick();
        }

        function finishRoll() {
            const an = S.anim;
            S.anim = null;
            const m = model();
            if (!an || an.key !== m.key) return;
            S.last = { ia: an.ia, ib: an.ib, key: an.key };
            if (S.score.key !== m.key) S.score = { key: m.key, n: 0, A: 0, B: 0, D: 0 };
            const a = m.A.faces[an.ia], b = m.B.faces[an.ib];
            S.score.n++;
            S.score[a > b ? 'A' : (a < b ? 'B' : 'D')]++;
            // the area view shows every round as a dot, so a roll by hand counts there too -
            // only there, so the other views keep their counters as they were
            if (viewKey() === 'flaeche') {
                if (S.sim.key !== m.key) simReset(m);
                simOne(S.sim, a, b, an.ia, an.ib);
            }
            dbg('Wurf ' + S.score.n + ': ' + m.A.name + ' ' + a + ' - ' + m.B.name + ' ' + b);
            refreshPanelLive();
        }

        // What a die shows right now: waiting, tumbling (random faces) or landed
        function dieShown(key, m, now) {
            const lastOk = S.last && S.last.key === m.key;
            const idle = lastOk ? (key === 'A' ? S.last.ia : S.last.ib) : 1;
            const an = S.anim;
            if (!an || an.key !== m.key) return { idx: idle, phase: lastOk ? 'done' : 'idle', p: 1 };
            const t = now - an.t0;
            const [s0, s1] = ROLL[key];
            const fin = key === 'A' ? an.ia : an.ib;
            if (t < s0) return { idx: idle, phase: 'wait', p: 0 };
            if (t >= s1) return { idx: fin, phase: 'done', p: 1 };
            const flick = Math.floor(t / 85) * 7 + an.seed + (key === 'A' ? 0 : 3);
            return { idx: (flick * 2654435761 >>> 0) % 6, phase: 'roll', p: (t - s0) / (s1 - s0) };
        }

        function rollOutcome(m) {
            if (!S.last || S.last.key !== m.key || S.anim) return null;
            const a = m.A.faces[S.last.ia], b = m.B.faces[S.last.ib];
            const i = m.GA.findIndex(g => g.v === a), j = m.GB.findIndex(g => g.v === b);
            return { a, b, i, j, k: i * m.GB.length + j, w: a > b ? 'A' : (a < b ? 'B' : 'D') };
        }

        /* --------------------------------------------------------------- Cube */
        // An isometric die: top face = the face that lies on top, the two visible sides are
        // real neighbours of it on the net (never its opposite face).
        function drawCube(cx, cy, s, key, m, idx, o = {}) {
            const die = key === 'A' ? m.A : m.B;
            const k = 0.866;
            const T0 = [cx, cy - s / 2], T1 = [cx + k * s, cy], T2 = [cx, cy + s / 2], T3 = [cx - k * s, cy];
            const down = p => [p[0], p[1] + s];
            const all = [0, 1, 2, 3, 4, 5];
            const fl = all.find(j => j !== idx && j !== OPP[idx]);
            const fri = all.find(j => j !== idx && j !== OPP[idx] && j !== fl && j !== OPP[fl]);
            const vec = (a, b) => [b[0] - a[0], b[1] - a[1]];
            const faces = [
                { pts: [T0, T1, T2, T3], idx, shade: 0, O: T0, u: vec(T0, T1), v: vec(T0, T3) },
                { pts: [T3, T2, down(T2), down(T3)], idx: fl, shade: 0.3, O: T3, u: vec(T3, T2), v: [0, s] },
                { pts: [T2, T1, down(T1), down(T2)], idx: fri, shade: 0.5, O: T2, u: vec(T2, T1), v: [0, s] }
            ];
            faces.forEach(f => {
                const val = die.faces[f.idx];
                const tint = tintOf(key, m, val);
                ctx.beginPath();
                f.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
                ctx.closePath();
                ctx.fillStyle = '#0d1b33';
                ctx.fill();
                ctx.fillStyle = 'rgba(' + tint + ', ' + (0.66 - f.shade * 0.4).toFixed(2) + ')';
                ctx.fill();
                ctx.fillStyle = 'rgba(0, 0, 0, ' + f.shade * 0.55 + ')';
                ctx.fill();
                ctx.strokeStyle = o.glow ? C.orange : 'rgba(225, 240, 255, 0.92)';
                ctx.lineWidth = o.glow ? 3 : 2.2;
                ctx.lineJoin = 'round';
                ctx.stroke();
                ctx.save();
                ctx.transform(f.u[0] / 100, f.u[1] / 100, f.v[0] / 100, f.v[1] / 100, f.O[0], f.O[1]);
                tex(String(val), 50, 50, 54, f.shade ? 'rgba(255, 255, 255, 0.78)' : '#ffffff', { align: 'center', valign: 'middle' });
                ctx.restore();
            });
        }

        // Cube with tumble: bounces and wobbles while rolling, a soft shadow below.
        // With WebGL the die is the real 3D one (Dice3D below) - the flat cube is only the fallback.
        function drawRollingCube(cx, cy, s, key, m, now, o = {}) {
            const st = dieShown(key, m, now);
            if (window.Dice3D && Dice3D.ok) {
                const off = offs[offs.length - 1];
                const bx = cx + off.x, by = cy + s / 2 + off.y;     // centre of the flat cube's box
                Dice3D.place(key, VIEW.ox + bx * VIEW.sc, VIEW.oy + by * VIEW.sc, 2.3 * s * VIEW.sc, { glow: !!o.glow });
                return st;
            }
            const p = st.p;
            const lift = st.phase === 'roll' ? Math.abs(Math.sin(p * Math.PI * 2.5)) * (1 - p) * 0.55 * s : 0;
            const rot = st.phase === 'roll' ? Math.sin(p * 17) * (1 - p) * 0.3 : 0;
            const baseY = cy + 1.5 * s + 0.12 * s;
            ctx.beginPath();
            ctx.ellipse(cx, baseY, 0.95 * s * (1 - lift / (2 * s)), 0.14 * s, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + (0.35 - lift / (4 * s)).toFixed(3) + ')';
            ctx.fill();
            ctx.save();
            ctx.translate(cx, cy + s);
            ctx.rotate(rot);
            ctx.translate(-cx, -(cy + s));
            drawCube(cx, cy - lift, s, key, m, st.idx, { glow: o.glow && st.phase === 'done' });
            ctx.restore();
            return st;
        }

        /* ---------------------------------------------------------------- Nets */
        function netCells(x, y, s) {
            return [[x, y], [x + s, y], [x + 2 * s, y], [x + s, y + s], [x + s, y + 2 * s], [x + s, y + 3 * s]];
        }

        // T-shaped net: three faces on top, three below the middle one (like the deck)
        function drawNet(x, y, s, key, m, o = {}) {
            const die = key === 'A' ? m.A : m.B;
            netCells(x, y, s).forEach(([cx, cy], idx) => {
                const v = die.faces[idx], tint = tintOf(key, m, v);
                const g = Math.max(1.5, s * 0.045);
                const lit = o.lit === idx, hl = o.hl != null && o.hl === v;
                roundRect(cx + g, cy + g, s - 2 * g, s - 2 * g, s * 0.14);
                ctx.fillStyle = '#0c1a31';
                ctx.fill();
                ctx.fillStyle = 'rgba(' + tint + ', ' + (lit || hl ? 0.75 : 0.42) + ')';
                ctx.fill();
                if (lit) {
                    ctx.save();
                    ctx.shadowColor = C.orange;
                    ctx.shadowBlur = 18;
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = Math.max(2.5, s * 0.06);
                    ctx.stroke();
                    ctx.restore();
                } else {
                    ctx.strokeStyle = hl ? 'rgb(' + tint + ')' : 'rgba(200, 225, 255, 0.6)';
                    ctx.lineWidth = hl ? Math.max(2.5, s * 0.06) : 1.3;
                    ctx.stroke();
                }
                tex(String(v), cx + s / 2, cy + s / 2, s * 0.46, '#ffffff', { align: 'center', valign: 'middle' });
                if (o.edit) addHit(cx, cy, s, s, h => openPicker(key, idx, h));
            });
        }

        // "$3$, $5$ und $7$ je $2$-mal" or "$4$ steht $4$-mal drauf, $6$ steht $2$-mal drauf"
        function countSentence(G) {
            const join = list => list.length === 1 ? list[0]
                : list.slice(0, -1).join(', ') + ' und ' + list[list.length - 1];
            if (G.length === 1) return '$' + G[0].v + '$ auf allen $6$ Flächen';
            if (G.every(g => g.c === G[0].c)) return join(G.map(g => '$' + g.v + '$')) + ' je $' + G[0].c + '$-mal';
            return join(G.map(g => '$' + g.v + '$: $' + g.c + '$-mal'));
        }

        /* ---------------------------------------------------------------- Tree */
        function treeGeom(m, o) {
            const nA = m.GA.length, nB = m.GB.length;
            const st1 = o.stage === 1;
            // SX: room left of the root for its name, as in the deck (Doc, 19.09.2026: "im Lab steht links nicht Start
            // an dem Startknoten, in der Präsentation schon")
            const SX = 50;
            const X0 = 24 + SX, X1 = 220 + SX, X2 = (st1 ? 220 : 430) + SX;
            const head = o.head != null ? o.head : 44;
            const L = st1 ? nA : nA * nB;
            const gap = st1 ? clamp(340 / nA, 52, 110) : (L <= 6 ? 58 : L <= 9 ? 48 : L <= 16 ? 38 : L <= 25 ? 31 : 26);
            const gapG = st1 ? 0 : (L <= 9 ? 16 : 8);
            const nodes1 = [], leaves = [];
            let y = head + gap / 2;
            m.GA.forEach((ga, i) => {
                if (st1) { nodes1.push({ i, y }); y += gap; return; }
                const y0 = y;
                m.GB.forEach((gb, j) => { leaves.push({ i, j, k: i * nB + j, y }); y += gap; });
                nodes1.push({ i, y: (y0 + y - gap) / 2 });
                y += gapG;
            });
            const bottom = (st1 ? y : y - gapG) - gap / 2;
            const rootY = (nodes1[0].y + nodes1[nodes1.length - 1].y) / 2;
            const fs = gap >= 50 ? 18 : gap >= 40 ? 16 : gap >= 32 ? 14 : 12;
            const k = fs / 18;
            const colW = { path: 112 * k + 10, p: 78 * k + 6, pct: 104 * k + 6 };
            let cx = X2 + (st1 ? 84 : 72);
            const colX = {};
            (o.cols || []).forEach(c => { colX[c] = cx + colW[c] / 2; cx += colW[c]; });
            const tagX = cx + 4;
            const w = Math.max(cx + 6, X2 + 80) + (o.tagRoom ? 100 : 0);
            const h = bottom + (o.legend ? 42 : 10);
            return { X0, X1, X2, head, nodes1, leaves, rootY, gap, fs, colX, colW, tagX, w, h, st1, bottom };
        }
