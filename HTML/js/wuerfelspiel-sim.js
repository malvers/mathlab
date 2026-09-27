// Würfelspiel (wuerfelspiel.html), part 6 of 9: the simulation ring.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // The area view keeps the newest SIM_PTS rounds as dots in a ring: once it is full, every
        // new round pushes out the oldest, so the dots keep moving across the whole area in the
        // Dauerlauf instead of freezing (Doc, 18.09.2026: "sonst passiert irgendwann nix" - "mehr").
        const SIM_PTS = 4000;
        // A Dauerlauf batch can be 20 000 rounds; replacing all 4000 dots every frame is TV noise.
        // Once the ring is full, at most this many dots per batch are exchanged (~7000 per second).
        const SIM_TURNOVER = 120;

        // One round into the simulation: counters, the dot for the area view, the curve for the chart.
        // ia, ib = the face indices that came up, a, b = their numbers, dot = keep a dot for it
        function simOne(sm, a, b, ia, ib, dot = true) {
            sm.n++;
            if (a > b) sm.a++; else if (a < b) sm.b++; else sm.d++;
            if (dot) {
                // spread over the whole cell - a margin left visible gaps between the cells
                const u = 0.04 + 0.92 * Math.random(), v = 0.04 + 0.92 * Math.random();
                if (sm.pts.length < SIM_PTS) sm.pts.push({ a: ia, b: ib, u, v });
                else {
                    const p = sm.pts[sm.ptsAt];                 // reuse the object: no garbage per round
                    p.a = ia; p.b = ib; p.u = u; p.v = v;
                    sm.ptsAt = (sm.ptsAt + 1) % SIM_PTS;
                }
            }
            const lastX = sm.hx.length ? sm.hx[sm.hx.length - 1] : 0;
            if (sm.n <= 200 || sm.n >= lastX * 1.01) {
                sm.hx.push(sm.n);
                sm.ha.push(sm.a / sm.n);
                sm.hb.push(sm.b / sm.n);
            }
        }

        function simRun(count) {
            const m = model();
            if (S.sim.key !== m.key) simReset(m);
            const sm = S.sim, fa = m.A.faces, fb = m.B.faces;
            const stride = Math.max(1, Math.floor(count / SIM_TURNOVER));
            for (let i = 0; i < count && sm.n < 1e7; i++) {
                const ia = Math.floor(Math.random() * 6), ib = Math.floor(Math.random() * 6);
                simOne(sm, fa[ia], fb[ib], ia, ib, sm.pts.length < SIM_PTS || i % stride === 0);
            }
        }

        function simToggle(on) {
            const m = model();
            if (S.sim.key !== m.key) simReset(m);
            S.sim.running = on != null ? on : !S.sim.running;
            if (S.sim.running) kick();
            refreshPanelLive();
        }

        function sizeSim(m, tall) { return tall ? { w: 540, h: 900 } : { w: 980, h: 480 }; }

        function drawChart(m, x, y, w, h) {
            plate(x, y, w, h);
            const L = x + 62, R = x + w - 64, T = y + 30, B = y + h - 58;
            const sm = S.sim.key === m.key ? S.sim : null;
            [0, 0.25, 0.5, 0.75, 1].forEach(v => {
                const yy = B - v * (B - T);
                line(L, yy, R, yy, 'rgba(157, 232, 255, 0.12)', 1);
                tex(v === 0 ? '0' : (v === 1 ? '1' : decTex(v, 2)), L - 10, yy, 14, C.soft, { align: 'right', valign: 'middle' });
            });
            const nMax = Math.max(10, Math.pow(10, Math.ceil(Math.log10(Math.max(10, sm ? sm.n : 10)))));
            const X = n => L + Math.log10(n) / Math.log10(nMax) * (R - L);
            for (let p = 1; p <= nMax; p *= 10) {
                const xx = X(p);
                line(xx, T, xx, B, 'rgba(157, 232, 255, 0.12)', 1);
                tex(intTex(p), xx, B + 20, 14, C.soft, { align: 'center', valign: 'middle' });
            }
            label('RUNDEN', (L + R) / 2, B + 44, CAP, C.soft, 'center', 400);
            const yP = v => B - v * (B - T);
            const yA = yP(valF(m.pA)), yB = yP(valF(m.pB));
            line(L, yA, R, yA, 'rgba(160, 212, 70, 0.75)', 1.6, [8, 6]);
            line(L, yB, R, yB, 'rgba(224, 106, 94, 0.75)', 1.6, [8, 6]);
            const sep = Math.abs(yA - yB) < 34 ? (yA <= yB ? -1 : 1) * (17 - Math.abs(yA - yB) / 2) : 0;
            tex(fr(m.pA), R + 10, yA + sep, 16, C.greenHi, { valign: 'middle' });
            tex(fr(m.pB), R + 10, yB - sep, 16, C.redHi, { valign: 'middle' });
            if (!sm || !sm.hx.length) return;
            [[sm.ha, C.greenHi], [sm.hb, C.redHi]].forEach(([ys, col]) => {
                ctx.beginPath();
                sm.hx.forEach((n, i) => {
                    const px = X(n), py = yP(ys[i]);
                    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                });
                ctx.strokeStyle = col;
                ctx.lineWidth = 2.2;
                ctx.lineJoin = 'round';
                ctx.stroke();
            });
        }

        function drawSim(m, W, H, tall) {
            addHit(0, 0, W, H, () => simToggle());
            const sm = S.sim.key === m.key ? S.sim : { n: 0, a: 0, b: 0, d: 0 };
            const pw = tall ? W - 20 : 330, ph = tall ? 390 : H - 20;
            plate(10, 10, pw, ph);
            label('SIMULATION', 30, 36, 12, C.orange, 'left');
            let yy = 56;
            const row = (s, col, size = 18) => { yy += rich(s, 30, yy, size, col, { maxW: pw - 40 }) + 12; };
            row('Runden: $' + intTex(sm.n) + '$', '#ffffff');
            row('**' + m.A.name + '** gewinnt: $' + intTex(sm.a) + '$', C.greenHi);
            row('**' + m.B.name + '** gewinnt: $' + intTex(sm.b) + '$', C.redHi);
            if (m.draws.length) row('unentschieden: $' + intTex(sm.d) + '$', C.soft);
            yy += 6;
            label('RELATIVE HÄUFIGKEIT', 30, yy + 6, CAP, C.soft, 'left', 400);
            yy += 20;
            const rel = sm.n ? sm.a / sm.n : 0;
            row(sm.n ? '$\\frac{' + intTex(sm.a) + '}{' + intTex(sm.n) + '} \\approx ' + decTex(rel, 3) + '$' : '$-$', C.greenHi, 20);
            label('WAHRSCHEINLICHKEIT', 30, yy + 6, CAP, C.soft, 'left', 400);
            yy += 20;
            row('$' + fr(m.pA) + ' \\approx ' + decTex(valF(m.pA), 3) + '$', C.greenHi, 20);
            if (sm.n) row('Abweichung: $' + decTex(Math.abs(rel - valF(m.pA)), 3) + '$', C.soft, 16);
            if (tall) drawChart(m, 10, ph + 30, W - 20, H - ph - 40);
            else drawChart(m, pw + 30, 10, W - pw - 40, H - 20);
        }

        /* ------------------------------------------------------ Efron-Würfel */
        const EFRON_POS = { A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] };
        const EFRON_ARROWS = ['AB', 'BC', 'CD', 'DA'];

        function efronModel(pair) {
            return buildModel({ a: { name: 'Würfel ' + pair[0], faces: EFRON[pair[0]] }, b: { name: 'Würfel ' + pair[1], faces: EFRON[pair[1]] } });
        }

        function sizeEfron(m, tall) { return tall ? { w: 540, h: 960 } : { w: 920, h: 560 }; }

        function drawEfron(m, W, H, tall) {
            const s = 30, netW = 3 * s, netH = 4 * s;
            const pos = k => {
                const [c, r] = EFRON_POS[k];
                return { x: 30 + c * 380, y: 56 + r * 330 };
            };
            const models = {};
            EFRON_ARROWS.forEach(p => { models[p] = efronModel(p); });
            ['A', 'B', 'C', 'D'].forEach(k => {
                const p = pos(k);
                const pm = efronModel(k + 'A');
                label('WÜRFEL ' + k, p.x + netW / 2, p.y - 22, 13, S.efron.indexOf(k) >= 0 ? C.orange : C.cyan, 'center');
                drawNet(p.x, p.y, s, 'A', pm, {});
            });
            EFRON_ARROWS.forEach(pair => {
                const a = pos(pair[0]), b = pos(pair[1]);
                const ax = a.x + netW / 2, ay = a.y + netH / 2, bx = b.x + netW / 2, by = b.y + netH / 2;
                const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
                const ux = dx / len, uy = dy / len, cut = Math.abs(ux) > 0.5 ? 92 : 104;
                const x1 = ax + ux * cut, y1 = ay + uy * cut, x2 = bx - ux * cut, y2 = by - uy * cut;
                const on = S.efron === pair;
                const col = on ? C.orange : 'rgba(157, 232, 255, 0.75)';
                line(x1, y1, x2, y2, col, on ? 3.4 : 2);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - ux * 16 - uy * 9, y2 - uy * 16 + ux * 9);
                ctx.lineTo(x2 - ux * 16 + uy * 9, y2 - uy * 16 - ux * 9);
                ctx.closePath();
                ctx.fillStyle = col;
                ctx.fill();
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                tex(fr(models[pair].pA), mx, my, 22, on ? C.orange : '#ffffff', { align: 'center', valign: 'middle', bg: C.labelBg, edge: col });
                addHit(mx - 50, my - 40, 100, 80, () => pickEfron(pair));
            });
            ctx.font = '600 17px Outfit, sans-serif';
            ctx.fillStyle = C.orange;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Wer zuerst wählt, verliert!', 30 + 190 + netW / 2, 56 + 165 + netH / 2);

            const px = tall ? 10 : 560, py = tall ? 560 : 10, pw = tall ? W - 20 : W - 570, ph = tall ? H - 570 : H - 20;
            plate(px, py, pw, ph);
            label('FUN FACTS', px + 20, py + 26, 12, C.orange, 'left');
            let yy = py + 48;
            const row = (str, col, size = 16) => { yy += rich(str, px + 20, yy, size, col, { maxW: pw - 40 }) + 14; };
            row('Würfel gibt es seit mindestens $5000$ Jahren, schon im alten Orient wurde gewürfelt.', C.text);
            row('Der Statistiker **Bradley Efron** erfand vier Würfel: A schlägt B, B schlägt C, C schlägt D und D wieder A, jedes Mal mit $\\frac{2}{3}$.', C.text);
            row('Solche Würfel heißen **nicht-transitiv**: Zu jedem Würfel gibt es einen besseren.', C.text);
            const pm = models[S.efron];
            yy += 4;
            label('WÜRFEL ' + S.efron[0] + ' GEGEN WÜRFEL ' + S.efron[1], px + 20, yy + 6, 11, C.orange, 'left');
            yy += 22;
            row('$P(' + S.efron[0] + '\\text{ schlägt }' + S.efron[1] + ') =$ ' + sumUnits(pm.winA.map(p => p.f), { result: pm.pA }), C.greenHi, 18);
            if (S.mode === 'rundgang') {
                const deck = buildModel(presetDice('deck'));
                row('Unser Spiel ist harmloser: Mit $' + fr(deck.pA) + '$ ist **Lena** nur knapp im Vorteil.', C.soft, 15);
            } else {
                row('Pfeil antippen: Das Paar wird in das Labor geladen.', C.soft, 15);
            }
        }

        /* -------------------------------------------------- Zwillingsaufgabe */
        function sizeZwilling(m, tall) {
            if (S.showSolution) {
                const g = treeGeom(m, TREE_P);
                return { w: g.w + 20, h: g.h + 80 };
            }
            return tall ? { w: 460, h: 880 } : { w: 820, h: 470 };
        }

        function drawZwilling(m, W, H, tall) {
            if (S.showSolution) {
                const g = treeGeom(m, TREE_P);
                drawTree(m, g, Object.assign({ win: true }, TREE_P));
                rich('$P(\\text{' + m.A.name + ' gewinnt}) =$ ' + sumUnits(m.winA.map(p => p.f), { result: m.pA, pct: true }),
                    24, g.h + 16, 22, C.greenHi, { maxW: W - 40 });
                return;
            }
            const s = 62;
            const nets = tall ? [['A', W / 2 - 1.5 * s, 50], ['B', W / 2 - 1.5 * s, 420]] : [['A', 60, 50], ['B', W - 60 - 3 * s, 50]];
            nets.forEach(([key, x, y]) => {
                const die = key === 'A' ? m.A : m.B;
                label(dieTitle(die.name).toUpperCase(), x + 1.5 * s, y - 24, 14, key === 'A' ? C.orange : C.cyan, 'center');
                drawNet(x, y, s, key, m, {});
            });
            const tx = tall ? 20 : 300, ty = tall ? 700 : 70, tw = tall ? W - 40 : W - 600;
            let yy = ty;
            [['**a)** Baumdiagramm zeichnen, an jeden Ast die Wahrscheinlichkeit', C.text],
            ['**b)** $P(\\text{' + m.A.name + ' gewinnt}) = \\;?$', C.text],
            ['Erst selbst rechnen, dann **Lösung zeigen**.', C.soft]].forEach(([str, col]) => {
                yy += rich(str, tx, yy, 18, col, { maxW: tw }) + 22;
            });
        }

        /* ---------------------------------------------------------- Registry */
        const VIEWS = {
            spiel: { name: 'Das Spiel', size: sizeSpiel, draw: drawSpiel },
            netze: { name: 'Würfelnetze', size: sizeNetze, draw: drawNetze },
            zweistufig: { name: 'Zweistufig', size: sizeZweistufig, draw: drawZweistufig },
            zaehlen: { name: 'Würfel lesen', size: sizeZaehlen, draw: drawZaehlen },
            merge: { name: 'Äste zusammenfassen', size: sizeMerge, draw: drawMerge },
            stufe1: { name: 'Baum: Stufe 1', size: sizeStufe1, draw: drawStufe1 },
            stufe2: { name: 'Baum: Stufe 2', size: sizeStufe2, draw: drawStufe2 },
            pfad: { name: 'Pfadregel', size: sizePfad, draw: drawPfad },
            tabelle: { name: 'Wer gewinnt?', size: sizeTabelle, draw: drawTabelle },
            summe: { name: 'Summenregel', size: sizeSumme, draw: drawSumme },
            flaeche: { name: 'Flächenmodell', size: sizeFlaeche, draw: drawFlaeche },
            fehler: { name: 'Typische Fehler', size: sizeFehler, draw: drawFehler },
            rezept: { name: 'Merksatz & Rezept', size: sizeRezept, draw: drawRezept },
            sim: { name: 'Simulation', size: sizeSim, draw: drawSim },
            efron: { name: 'Efron-Würfel', size: sizeEfron, draw: drawEfron },
            zwilling: { name: 'Zwillingsaufgabe', size: sizeZwilling, draw: drawZwilling }
        };

        const viewName = k => T('view_' + k, VIEWS[k].name);

        const LAB_VIEWS = ['spiel', 'netze', 'zweistufig', 'zaehlen', 'merge', 'stufe1', 'stufe2', 'pfad', 'tabelle', 'summe', 'flaeche', 'fehler', 'sim', 'efron'];

        /* ========================================================= RUNDGANG */
