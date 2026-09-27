// Würfelspiel (wuerfelspiel.html), part 5 of 9: the result in parts, the area view, the error catalogue.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // The whole result, cut into equal parts: 5 green and 4 red cells of 9
        function drawBar(m, x, y, w) {
            const q = 36 / gcd(gcd(gcd(m.nA, m.nB), m.nD), 36);
            const parts = [[m.nA * q / 36, 'rgba(121, 158, 49, 0.9)'], [m.nB * q / 36, 'rgba(224, 106, 94, 0.85)'], [m.nD * q / 36, 'rgba(159, 180, 214, 0.5)']];
            const cells = [];
            parts.forEach(([n, col]) => { for (let i = 0; i < n; i++) cells.push(col); });
            const gap = q <= 12 ? 4 : (q <= 36 ? 2 : 0);
            const cw = (w - gap * (q - 1)) / q;
            cells.forEach((col, i) => {
                roundRect(x + i * (cw + gap), y, cw, 26, Math.min(5, cw / 3));
                ctx.fillStyle = col;
                ctx.fill();
            });
            return q;
        }

        function summeLines(m) {
            const L = [];
            const eq = (who, list, res) => '$P(\\text{' + who + '}) =$ ' + sumUnits(list.map(p => p.f), { result: res, pct: true });
            L.push({ s: eq(m.A.name + ' gewinnt', m.winA, m.pA), c: C.greenHi, size: 19 });
            L.push({ s: 'Gegenprobe: ' + eq(m.B.name + ' gewinnt', m.winB, m.pB), c: C.redHi, size: 17 });
            if (m.draws.length) L.push({ s: eq('unentschieden', m.draws, m.pD), c: C.soft, size: 17 });
            const tot = [m.pA, m.pB].concat(m.draws.length ? [m.pD] : []);
            L.push({ s: 'Kontrolle: $' + tot.map(fr).join(' + ') + ' = 1$', c: C.text, size: 17 });
            L.push({
                s: m.draws.length
                    ? 'Gleiche Zahlen auf beiden Würfeln: **Unentschieden** ist möglich.'
                    : 'Kein Unentschieden: Die Würfel haben **keine gemeinsame Zahl**.',
                c: C.soft, size: 15
            });
            return L;
        }

        function drawSumme(m, W, H, tall) {
            const g = treeGeom(m, TREE_S);
            drawTree(m, g, Object.assign({ win: true }, TREE_S));
            const px = tall ? 16 : g.w + 24, py = tall ? g.h + 10 : 20;
            const pw = tall ? W - 32 : W - g.w - 34;
            plate(px, py, pw, tall ? H - py - 10 : 450, 'rgba(121, 158, 49, 0.55)');
            label('SUMMENREGEL', px + 20, py + 26, 12, C.greenHi, 'left');
            rich('Alle Wege zum selben Ereignis **addieren**', px + 20, py + 44, 16, C.soft, { maxW: pw - 40 });
            let yy = py + 84;
            summeLines(m).forEach(l => { yy += rich(l.s, px + 20, yy, l.size, l.c, { maxW: pw - 40 }) + 16; });
            const q = drawBar(m, px + 20, yy + 4, pw - 40);
            if (q <= 36) {
                rich('$' + m.nA * q / 36 + '$ von $' + q + '$ gleich großen Teilen für **' + m.A.name + '**', px + 20, yy + 40, 15, C.soft, { maxW: pw - 40 });
            }
        }

        /* --------------------------------------------------- Flächenmodell */
        // The whole game as an area: A's six faces run to the right, B's six run down, so each of
        // the 36 equally likely face pairs is one cell - green where A wins, red where B wins, grey
        // where both show the same number. Thin lines separate single faces, thick lines the blocks
        // of equal numbers, and every block carries its probability from the model. The dots are
        // the rounds the simulation (or a roll by hand) really played.
        function sizeFlaeche(m, tall) { return tall ? { w: 520, h: 740 } : { w: 560, h: 580 }; }

        // Column (row) values in group order, so equal numbers stand next to each other
        function faceCols(G) {
            const out = [];
            G.forEach(g => { for (let k = 0; k < g.c; k++) out.push(g.v); });
            return out;
        }

        // Which column (row) a single face of the net owns - a real roll lands in its own cell
        let slotCache = { key: '', A: null, B: null };

        function faceSlots(m) {
            if (slotCache.key !== m.key) {
                const build = (faces, G) => {
                    const start = new Map();
                    let acc = 0;
                    G.forEach(g => { start.set(g.v, acc); acc += g.c; });
                    const used = new Map();
                    return faces.map(v => {
                        const k = used.get(v) || 0;
                        used.set(v, k + 1);
                        return start.get(v) + k;
                    });
                };
                slotCache = { key: m.key, A: build(m.A.faces, m.GA), B: build(m.B.faces, m.GB) };
            }
            return slotCache;
        }

        function drawFlaeche(m, W, H) {
            addHit(0, 0, W, H, () => rollDice());
            const padX = 30, padB = 12, titleTop = 28, capH = 80;
            // the number tiles sit on a strip left of and above the square - sized from the square
            const rough = Math.min(W - 2 * padX - 52, H - titleTop - capH - padB - 52);
            const t = clamp(rough / 6 * 0.66, 20, 44);
            const strip = t + 12;
            const Sq = Math.min(W - 2 * padX - strip, H - titleTop - capH - padB - strip);
            const c = Sq / 6;
            const X0 = Math.max(padX + strip, (W - Sq + strip) / 2);
            const Y0 = titleTop + strip + Math.max(0, (H - titleTop - strip - Sq - capH - padB) / 2);
            const colA = faceCols(m.GA), colB = faceCols(m.GB);
            const offA = [], offB = [];
            let acc = 0;
            m.GA.forEach(g => { offA.push(acc); acc += g.c; });
            acc = 0;
            m.GB.forEach(g => { offB.push(acc); acc += g.c; });

            // one cell per face pair: green A wins, red B wins, grey a draw (the grey of the bar)
            colA.forEach((a, i) => colB.forEach((b, j) => {
                ctx.fillStyle = a > b ? 'rgba(121, 158, 49, 0.46)' : (a < b ? 'rgba(176, 36, 24, 0.46)' : 'rgba(159, 180, 214, 0.5)');
                ctx.fillRect(X0 + i * c, Y0 + j * c, c, c);
            }));

            // thin lines between single faces, thick lines around the blocks of equal numbers
            for (let k = 1; k < 6; k++) {
                line(X0 + k * c, Y0, X0 + k * c, Y0 + Sq, 'rgba(157, 232, 255, 0.14)', 1);
                line(X0, Y0 + k * c, X0 + Sq, Y0 + k * c, 'rgba(157, 232, 255, 0.14)', 1);
            }
            const thick = 'rgba(225, 240, 255, 0.72)';
            offA.slice(1).forEach(o => line(X0 + o * c, Y0, X0 + o * c, Y0 + Sq, thick, 2));
            offB.slice(1).forEach(o => line(X0, Y0 + o * c, X0 + Sq, Y0 + o * c, thick, 2));
            ctx.strokeStyle = thick;
            ctx.lineWidth = 2;
            ctx.strokeRect(X0, Y0, Sq, Sq);

            // the rounds that were really played, each in the cell of its two faces
            const sm = S.sim.key === m.key ? S.sim : null;
            const sl = faceSlots(m);
            if (sm && sm.pts.length) {
                const r = clamp(c * 0.028, 1.1, 2.4);    // finer dots: up to 4000 of them
                sm.pts.forEach(p => {
                    const a = m.A.faces[p.a], b = m.B.faces[p.b];
                    ctx.beginPath();
                    ctx.arc(X0 + (sl.A[p.a] + p.u) * c, Y0 + (sl.B[p.b] + p.v) * c, r, 0, Math.PI * 2);
                    ctx.fillStyle = a > b ? 'rgba(200, 240, 130, 0.9)' : (a < b ? 'rgba(255, 150, 135, 0.9)' : 'rgba(226, 238, 252, 0.9)');
                    ctx.fill();
                });
            }

            // the last roll by hand: its cell lights up
            if (S.last && S.last.key === m.key && !S.anim) {
                ctx.strokeStyle = C.orange;
                ctx.lineWidth = 2.6;
                ctx.strokeRect(X0 + sl.A[S.last.ia] * c + 2, Y0 + sl.B[S.last.ib] * c + 2, c - 4, c - 4);
            }

            // probability of each block, one size for all so the blocks stay comparable - the plate
            // covers at most about half a block, so colours and dots still show (36 single cells)
            let fs = 30;
            m.paths.forEach(p => {
                const L = texLayout(fr(p.f), 100);
                const pw = L.w / 100 + 0.56, ph = (L.asc + L.desc) / 100 + 0.32;   // plate per unit of size
                fs = Math.min(fs, 0.52 * p.ca * c / pw, 0.52 * p.cb * c / ph);
            });
            fs = Math.round(fs);
            if (fs >= 10) {
                m.paths.forEach(p => {
                    tex(fr(p.f), X0 + (offA[p.i] + p.ca / 2) * c, Y0 + (offB[p.j] + p.cb / 2) * c, fs, '#ffffff',
                        { align: 'center', valign: 'middle', bg: C.labelBg });
                });
            }

            // the numbers along the edges, in the colours of the dice
            const tile = (v, tint, cx, cy) => {
                roundRect(cx - t / 2, cy - t / 2, t, t, Math.min(7, t / 5));
                ctx.fillStyle = 'rgba(' + tint + ', 0.5)';
                ctx.fill();
                ctx.strokeStyle = 'rgb(' + tint + ')';
                ctx.lineWidth = 1.4;
                ctx.stroke();
                tex(String(v), cx, cy, Math.round(t * 0.58), '#ffffff', { align: 'center', valign: 'middle' });
            };
            colA.forEach((v, i) => tile(v, tintOf('A', m, v), X0 + (i + 0.5) * c, Y0 - strip / 2 - 2));
            colB.forEach((v, j) => tile(v, tintOf('B', m, v), X0 - strip / 2 - 2, Y0 + (j + 0.5) * c));
            label(m.A.name.toUpperCase() + '  →', X0, titleTop - 10, 16, C.orange, 'left');
            ctx.save();
            ctx.translate(Math.max(10, X0 - t - 20), Y0);
            ctx.rotate(Math.PI / 2);
            label(m.B.name.toUpperCase() + '  →', 0, 0, 16, C.cyan, 'left');
            ctx.restore();

            // two lines below: the exact share from the model, then what the dice did
            const capY = Y0 + Sq + 18;
            const exact = [[X0, 'left', 'grün: $' + fr(m.pA) + '$', C.greenHi], [X0 + Sq, 'right', 'rot: $' + fr(m.pB) + '$', C.redHi]];
            if (m.nD) exact.push([X0 + Sq / 2, 'center', 'grau: $' + fr(m.pD) + '$', C.soft]);
            exact.forEach(([x, align, s, col]) => rich(s, x, capY, 17, col, { align }));
            const n = sm ? sm.n : 0;
            const rolled = n
                ? 'gewürfelt: $' + intTex(sm.a) + '$ von $' + intTex(n) + '$ $\\approx ' + decTex(sm.a / n, 3) + '$'
                : 'gewürfelt: noch keine Runde';
            const y2 = capY + 38;
            rich(rolled, X0, y2, 16, C.text);
            if (m.nD && n) {
                const tie = 'unentschieden: $' + intTex(sm.d) + '$';
                if (richLayout(rolled, 16).w + richLayout(tie, 16).w + 24 < Sq) rich(tie, X0 + Sq, y2, 16, C.soft, { align: 'right' });
            }
        }

        /* --------------------------------------------------- Typische Fehler */
        const ERR_KEYS = ['gleich', 'addiert', 'vergessen', 'multipliziert', 'einweg'];
        const ERR_LABELS = ['FALSCHE AST-WAHRSCHEINLICHKEIT', 'ENTLANG ADDIERT', 'WEG VERGESSEN', 'WEGE MULTIPLIZIERT', 'NUR EIN WEG'];

        // Every error is computed on the dice at hand, so the lab shows the same mistakes
        // on any pair - for Lena and Mia it reproduces the deck slide word for word.
        function errorCase(m, e) {
            const A = m.A.name, B = m.B.name;
            const P = who => '$P(\\text{' + who + ' gewinnt}) =$ ';
            const right = P(A) + sumUnits(m.winA.map(p => p.f), { result: m.pA });
            const noWin = !m.winA.length;
            switch (ERR_KEYS[e]) {
                case 'gleich': {
                    const nB = m.GB.length;
                    const naive = F(1, nB);
                    const big = m.GB.reduce((x, g) => g.c > x.c ? g : x, m.GB[0]);
                    const wrongP = p => mulF(F(p.ca, 6), naive);
                    const wrongWin = m.winA.map(wrongP);
                    return {
                        title: gen(B) + ' $' + big.v + '$ mit $' + fr(naive) + '$ statt $' + fr(big.f) + '$',
                        applies: !eqF(big.f, naive),
                        labelB: () => ({ tex: fr(naive), color: C.redHi }),
                        pTex: p => ({ tex: fr(wrongP(p)), color: C.redHi }),
                        wrong: [P(A) + sumUnits(wrongWin)],
                        right: [right],
                        why: 'Nicht die verschiedenen Zahlen zählen, sondern die **Flächen**: Die $' + big.v + '$ steht auf $' + big.c + '$ von $6$ Flächen.'
                    };
                }
                case 'addiert': {
                    const p0 = m.paths[0];
                    const add = p => addF(F(p.ca, 6), F(p.cb, 6));
                    const all = sumF(m.paths.map(add));
                    return {
                        title: 'Entlang eines Weges **addiert** statt multipliziert',
                        applies: true,
                        pTex: p => ({ tex: fr(add(p)), color: C.redHi }),
                        wrong: ['Weg $(' + p0.a + ' \\mid ' + p0.b + ')$: $' + fr(F(p0.ca, 6)) + ' + ' + fr(F(p0.cb, 6)) + ' = ' + fr(add(p0)) + '$',
                            'alle Wege zusammen: $' + fr(all) + '$'],
                        right: ['Weg $(' + p0.a + ' \\mid ' + p0.b + ')$: $' + fr(F(p0.ca, 6)) + ' \\cdot ' + fr(F(p0.cb, 6)) + ' = ' + fr(p0.f) + '$',
                            'alle Wege zusammen: $1$'],
                        why: 'Alle Wege zusammen müssen $1$ ergeben. Entlang eines Weges wird **multipliziert**.'
                    };
                }
                case 'vergessen': {
                    const f = m.winA.slice().sort((x, y) => (x.b - y.b) || (x.a - y.a)).pop();
                    const rest = m.winA.filter(p => p !== f);
                    return {
                        title: f ? 'Den Weg $\\mathbf{(' + f.a + ' \\mid ' + f.b + ')}$ vergessen' : 'Einen Weg vergessen',
                        applies: m.winA.length >= 2,
                        decor: p => (f && p.k === f.k) ? { line: C.redHi, dash: [7, 6], width: 2.6, text: C.redHi, tag: 'vergessen' } : null,
                        wrong: [P(A) + sumUnits(rest.map(p => p.f))],
                        right: [right],
                        why: f ? 'Die $' + f.a + '$ ist größer als die $' + f.b + '$, also gehört auch dieser Weg dazu.' : ''
                    };
                }
                case 'multipliziert': {
                    const prod = m.winA.reduce((s, p) => mulF(s, p.f), F(1, 1));
                    const big = prod.q > 1e9;
                    return {
                        title: 'Die Wege für ' + gen(A) + ' Sieg **multipliziert** statt addiert',
                        applies: m.winA.length >= 2,
                        decor: p => p.w === 'A' ? { line: C.redHi, width: 2.6, text: C.redHi } : null,
                        wrong: [P(A) + '$' + m.winA.map(p => fr(p.f)).join(' \\cdot ') + (big ? ' \\approx 0' : ' = ' + fr(prod) + ' ' + pctEq(prod)) + '$'],
                        right: [right],
                        why: 'Verschiedene Wege schließen sich aus: Sie werden **addiert**. Malnehmen macht das Ergebnis nur kleiner.'
                    };
                }
                default: {
                    const one = m.winA[0];
                    return {
                        title: 'Nur **einen** Weg genommen statt alle',
                        applies: m.winA.length >= 2,
                        decor: p => (p.w === 'A' && one && p.k !== one.k) ? { line: C.redHi, dash: [7, 6], width: 2.6, text: C.redHi, tag: 'fehlt' } : null,
                        wrong: one ? [P(A) + '$' + fr(one.f) + ' ' + pctEq(one.f) + '$'] : [],
                        right: [right],
                        why: '**' + A + '** gewinnt auf $' + m.winA.length + '$ Wegen, und alle gehören in die Summe.'
                    };
                }
            }
        }

        const TREE_F = { stage: 2, cols: ['path', 'p'], tagRoom: true };

        function sizeFehler(m, tall) {
            const g = treeGeom(m, TREE_F);
            return tall ? { w: Math.max(g.w, 470) + 20, h: g.h + 440 } : { w: g.w + 470, h: Math.max(g.h, 440) + 10 };
        }

        function drawFehler(m, W, H, tall) {
            const E = errorCase(m, S.err);
            const g = treeGeom(m, TREE_F);
            drawTree(m, g, Object.assign({ win: true, labelB: E.labelB, pTex: E.pTex, decor: E.decor }, TREE_F));
            const px = tall ? 16 : g.w + 24, py = tall ? g.h + 10 : 20;
            const pw = tall ? W - 32 : W - g.w - 34;
            plate(px, py, pw, tall ? H - py - 10 : 420, 'rgba(224, 106, 94, 0.55)');
            label('FEHLER ' + (S.err + 1) + ' VON 5', px + 20, py + 26, 12, C.redHi, 'left');
            let yy = py + 46;
            yy += rich(E.title, px + 20, yy, 19, '#ffffff', { maxW: pw - 40 }) + 18;
            if (!E.applies) {
                rich('Bei diesen Würfeln fällt der Fehler nicht auf. Probiere die Würfel aus dem Deck.', px + 20, yy, 16, C.soft, { maxW: pw - 40 });
                return;
            }
            label('FALSCH', px + 20, yy + 8, 11, C.redHi, 'left');
            yy += 22;
            E.wrong.forEach(s => { yy += rich(s, px + 20, yy, 17, C.redHi, { maxW: pw - 40 }) + 10; });
            yy += 8;
            label('RICHTIG', px + 20, yy + 8, 11, C.greenHi, 'left');
            yy += 22;
            E.right.forEach(s => { yy += rich(s, px + 20, yy, 17, C.greenHi, { maxW: pw - 40 }) + 10; });
            yy += 8;
            rich(E.why, px + 20, yy, 16, C.text, { maxW: pw - 40 });
        }

        /* ------------------------------------------------ Merksatz & Rezept */
        const MERKSATZ = 'Entlang eines Pfades wird **multipliziert** — verschiedene Pfade zum selben Ereignis werden **addiert**.';
        const RECIPE = [
            { s: '**1.** Würfelnetze zählen: Wie oft steht jede Zahl drauf?', go: 'zaehlen' },
            { s: '**2.** Wahrscheinlichkeit je Zahl: Anzahl durch $6$, dann kürzen', go: 'zaehlen' },
            { s: '**3.** Baum zeichnen: erst Stufe $1$, dann an **jedes** Ende Stufe $2$', go: 'stufe2' },
            { s: '**4.** Pfadregel: entlang eines Weges **malnehmen**', go: 'pfad' },
            { s: '**5.** Summenregel: alle passenden Wege **addieren**', go: 'summe' }
        ];

        function sizeRezept(m, tall) { return tall ? { w: 520, h: 900 } : { w: 860, h: 600 }; }

        function drawRezept(m, W) {
            const mw = W - 68;
            const mh = 58 + richH(MERKSATZ, 24, mw) + 22;
            plate(10, 10, W - 20, mh, 'rgba(245, 194, 66, 0.7)');
            label('MERKSATZ', 34, 38, 13, C.orange, 'left');
            rich(MERKSATZ, 34, 60, 24, '#ffffff', { maxW: mw });
            let y = mh + 40;
            label('DAS REZEPT IN FÜNF SCHRITTEN', 20, y, 13, C.cyan, 'left');
            y += 20;
            RECIPE.forEach((r, i) => {
                const hi = S.recipeHi === i;
                const th = richH(r.s, 19, W - 130);
                const rowH = Math.max(58, th + 26);
                roundRect(10, y, W - 20, rowH, 12);
                ctx.fillStyle = hi ? 'rgba(245, 194, 66, 0.16)' : 'rgba(10, 24, 48, 0.72)';
                ctx.fill();
                ctx.strokeStyle = hi ? C.orange : 'rgba(0, 210, 255, 0.22)';
                ctx.lineWidth = hi ? 2 : 1.2;
                ctx.stroke();
                rich(r.s, 30, y + (rowH - th) / 2, 19, hi ? '#ffffff' : C.text, { maxW: W - 130 });
                ctx.font = '600 22px Outfit, sans-serif';
                ctx.fillStyle = C.cyan;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('→', W - 44, y + rowH / 2);
                addHit(10, y, W - 20, rowH, () => jumpToView(r.go));
                y += rowH + 12;
            });
        }

        /* ------------------------------------------------------- Simulation */
        function simReset(m) {
            S.sim = { key: m.key, n: 0, a: 0, b: 0, d: 0, hx: [], ha: [], hb: [], pts: [], ptsAt: 0, running: false, until: 0 };
        }
