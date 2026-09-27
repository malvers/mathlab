// Würfelspiel (wuerfelspiel.html), part 4 of 9: node sizes and the views with their design sizes.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // How big a number at a node may be: as large as the row allows (Doc 17.09.: "sehr klein")
        const valSize = (g) => Math.min(g.fs + 6, Math.round(g.gap * 0.62));

        // Fraction on a branch: above the line when it climbs, below when it falls
        function branchLabel(x1, y1, x2, y2, src, size, color, t) {
            const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
            const px = x1 + dx * t, py = y1 + dy * t;
            const L = texLayout(src, size);
            let nx, ny;
            if (Math.abs(dy) < 0.5) { nx = 0; ny = -1; }
            else if (dy < 0) { nx = dy / len; ny = -dx / len; }
            else { nx = -dy / len; ny = dx / len; }
            const hw = L.w / 2 + 0.28 * size, hh = (L.asc + L.desc) / 2 + 0.16 * size;
            const dist = hh * Math.abs(ny) + hw * Math.abs(nx) + 3;
            tex(src, px + nx * dist, py + ny * dist, size, color, { align: 'center', valign: 'middle', bg: C.labelBg });
        }

        function drawTree(m, g, o = {}) {
            const H = Object.assign({
                s1: '1. Stufe: ' + m.A.name, s2: '2. Stufe: ' + m.B.name,
                path: 'Pfad', p: 'Wahrsch.', pct: 'in %'
            }, o.headers || {});
            const sel = (o.sel != null && o.sel >= 0 && !g.st1) ? m.paths[o.sel] : null;
            const rows = g.st1
                ? g.nodes1.map(n => ({ y: n.y, f: m.GA[n.i].f, p: null, k: -1 }))
                : g.leaves.map(l => ({ y: l.y, f: m.paths[l.k].f, p: m.paths[l.k], k: l.k }));

            if (o.bands) {
                roundRect(g.X0 - 14, 4, g.X1 - g.X0 + 24, g.bottom + 4, 14);
                ctx.fillStyle = 'rgba(245, 194, 66, 0.07)';
                ctx.fill();
                roundRect(g.X1 + 16, 4, g.X2 - g.X1 + 40, g.bottom + 4, 14);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.07)';
                ctx.fill();
            }

            // centred on the bands drawn above (X0-14 .. X1+10 and X1+16 .. X2+40), not next to them
            label(H.s1, g.st1 ? g.X1 : (g.X0 + g.X1) / 2 - 2, 20, 12, C.orange, 'center');
            if (!g.st1) label(H.s2, (g.X1 + g.X2) / 2 + 36, 20, 12, C.cyan, 'center');
            Object.keys(g.colX).forEach(c => label(H[c], g.colX[c], 20, 11, C.soft, 'center', 400));

            // row highlights: the selected path and the path of the last roll
            const band = (r, fill, edge) => {
                roundRect(g.X2 - 22, r.y - g.gap / 2 + 3, g.w - g.X2 + 18 - (o.tagRoom ? 100 : 0), g.gap - 6, 10);
                ctx.fillStyle = fill;
                ctx.fill();
                ctx.strokeStyle = edge;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            };
            if (sel) band(rows.find(r => r.k === sel.k), 'rgba(245, 194, 66, 0.10)', 'rgba(245, 194, 66, 0.5)');
            if (o.glowK != null && o.glowK >= 0) {
                const r = rows.find(q => q.k === o.glowK);
                if (r) band(r, 'rgba(0, 210, 255, 0.10)', 'rgba(157, 232, 255, 0.55)');
            }

            g.nodes1.forEach(n => {
                const on = (sel && sel.i === n.i) || (o.selI === n.i);
                line(g.X0, g.rootY, g.X1, n.y, on ? C.orange : C.branch, on ? 3.6 : 2);
            });
            if (!g.st1) {
                g.leaves.forEach(l => {
                    const p = m.paths[l.k], n = g.nodes1[l.i];
                    let col = C.branch, w = 1.7, dash = null;
                    if (o.win) {
                        if (p.w === 'A') { col = C.green; w = 2.8; } else { col = C.mutedLine; w = 1.4; }
                    }
                    const d = o.decor ? o.decor(p) : null;
                    if (d && d.line) { col = d.line; w = d.width || 2.6; dash = d.dash || null; }
                    if (sel && sel.k === l.k) { col = C.orange; w = 3.6; dash = null; }
                    line(g.X1, n.y, g.X2, l.y, col, w, dash);
                });
            }

            if (o.walk) {
                const n = g.nodes1[o.walk.i];
                const t1 = clamp(o.walk.t, 0, 1);
                const ex = g.X0 + (g.X1 - g.X0) * t1, ey = g.rootY + (n.y - g.rootY) * t1;
                line(g.X0, g.rootY, ex, ey, C.orange, 4);
                let px = ex, py = ey;
                if (!g.st1 && o.walk.t > 1) {
                    const leaf = g.leaves.find(l => l.i === o.walk.i && l.j === o.walk.j);
                    const t2 = clamp(o.walk.t - 1, 0, 1);
                    px = g.X1 + (g.X2 - g.X1) * t2;
                    py = n.y + (leaf.y - n.y) * t2;
                    line(g.X1, n.y, px, py, C.orange, 4);
                }
                ctx.save();
                ctx.shadowColor = C.orange;
                ctx.shadowBlur = 16;
                dot(px, py, 8, C.orange, '#ffffff');
                ctx.restore();
            }

            if (o.probs !== false) {
                g.nodes1.forEach(n => {
                    branchLabel(g.X0, g.rootY, g.X1, n.y, fr(m.GA[n.i].f), g.fs + 3, C.text, 0.5);
                });
                if (!g.st1) {
                    g.leaves.forEach(l => {
                        const gb = m.GB[l.j], n = g.nodes1[l.i];
                        const ov = o.labelB ? o.labelB(gb) : null;
                        branchLabel(g.X1, n.y, g.X2, l.y, ov ? ov.tex : fr(gb.f), g.fs + 1, ov ? ov.color : C.text, 0.58);
                    });
                }
            }

            dot(g.X0, g.rootY, 5.5, C.neon, '#ffffff');
            tex('\\text{Start}', g.X0 - 20, g.rootY, valSize(g) - 2, '#ffffff', { align: 'right', valign: 'middle' });
            g.nodes1.forEach(n => {
                const ga = m.GA[n.i];
                dot(g.X1, n.y, 6.5, 'rgb(' + TINTS.A[n.i % 6] + ')', '#ffffff');
                if (g.st1) tex(String(ga.v), g.X1 + 16, n.y, valSize(g) + 2, '#ffffff', { valign: 'middle' });
                else tex(String(ga.v), g.X1 - 5, n.y - 15, valSize(g), '#ffffff', { align: 'right', bg: C.labelBg });
            });
            g.leaves.forEach(l => {
                const p = m.paths[l.k], gb = m.GB[l.j];
                dot(g.X2, l.y, 5.5, 'rgb(' + TINTS.B[l.j % 6] + ')', '#ffffff');
                tex(String(gb.v), g.X2 + 14, l.y, valSize(g), o.win && p.w === 'A' ? C.greenHi : '#ffffff', { valign: 'middle' });
            });

            rows.forEach(r => {
                const d = r.p && o.decor ? o.decor(r.p) : null;
                const col = (d && d.text) ? d.text : (o.win && r.p && r.p.w === 'A' ? C.greenHi : C.text);
                const mid = { align: 'center', valign: 'middle' };
                if (g.colX.path && r.p) tex('(' + r.p.a + ' \\mid ' + r.p.b + ')', g.colX.path, r.y, g.fs - 1, col, mid);
                if (g.colX.p) {
                    const ov = (r.p && o.pTex) ? o.pTex(r.p) : null;
                    tex(ov ? ov.tex : fr(r.f), g.colX.p, r.y, g.fs + 3, ov ? ov.color : col, mid);
                }
                if (g.colX.pct) tex(pctTex(r.f), g.colX.pct, r.y, g.fs - 2, col, mid);
                if (d && d.tag) {
                    ctx.font = '600 ' + (g.fs - 2) + 'px Outfit, sans-serif';
                    ctx.fillStyle = d.line || C.redHi;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(d.tag, g.tagX, r.y);
                }
                if (o.onRow && r.k >= 0) addHit(g.X1 + 40, r.y - g.gap / 2, g.w - g.X1 - 40, g.gap, () => o.onRow(r.k));
            });

            if (o.legend && m.winA.length) {
                rich('grün: **' + m.A.name + '** gewinnt', g.X0, g.bottom + 14, 15, C.greenHi);
            }
        }

        /* ============================================================== VIEWS */
        // Every view has a design size (landscape and, where it helps, portrait) and draws in
        // design coordinates. render() scales it into the free part of the stage.

        /* ------------------------------------------------------- Das Spiel */
        function sizeSpiel(m, tall) { return tall ? { w: 520, h: 900 } : { w: 940, h: 570 }; }

        function drawChips(items, cx, y, maxW, hiIdx) {
            const size = 16, padX = 14, h = 36, arrow = 30;
            ctx.font = '600 ' + size + 'px Outfit, sans-serif';
            const ws = items.map(t => ctx.measureText(t).width + 2 * padX);
            const total = ws.reduce((s, w) => s + w, 0) + arrow * (items.length - 1);
            const row = total <= maxW;
            let x = cx - total / 2, yy = y;
            items.forEach((t, i) => {
                const w = ws[i];
                const x0 = row ? x : cx - w / 2;
                roundRect(x0, yy, w, h, h / 2);
                const on = i === hiIdx;
                ctx.fillStyle = on ? 'rgba(245, 194, 66, 0.22)' : 'rgba(10, 24, 48, 0.8)';
                ctx.fill();
                ctx.strokeStyle = on ? C.orange : 'rgba(157, 232, 255, 0.35)';
                ctx.lineWidth = on ? 2 : 1.2;
                ctx.stroke();
                ctx.font = '600 ' + size + 'px Outfit, sans-serif';
                ctx.fillStyle = on ? C.orange : C.text;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(t, x0 + w / 2, yy + h / 2 + 1);
                if (i < items.length - 1) {
                    ctx.fillStyle = C.soft;
                    if (row) ctx.fillText('→', x0 + w + arrow / 2, yy + h / 2 + 1);
                    else ctx.fillText('↓', cx, yy + h + 11);
                }
                if (row) x += w + arrow; else yy += h + 22;
            });
            return row ? h : yy - y - 22;
        }

        function drawSpiel(m, W, H, tall, now) {
            addHit(0, 0, W, H, () => rollDice());
            const s = 108;
            const pA = tall ? [W / 2, 140] : [240, 180];
            const pB = tall ? [W / 2, 500] : [700, 180];
            const out = rollOutcome(m);
            label(m.A.name.toUpperCase(), pA[0], pA[1] - s / 2 - 42, 20, C.orange, 'center');
            label(m.B.name.toUpperCase(), pB[0], pB[1] - s / 2 - 42, 20, C.cyan, 'center');
            drawRollingCube(pA[0], pA[1], s, 'A', m, now, { glow: out && out.w === 'A' });
            drawRollingCube(pB[0], pB[1], s, 'B', m, now, { glow: out && out.w === 'B' });

            const symY = tall ? 360 : pA[1] + s / 2 + 10;
            if (out) {
                tex(out.w === 'A' ? '>' : (out.w === 'B' ? '<' : '='), W / 2, symY, 76,
                    out.w === 'A' ? C.greenHi : (out.w === 'B' ? C.redHi : C.soft), { align: 'center', valign: 'middle' });
            } else {
                tex('?', W / 2, symY, 64, 'rgba(157, 180, 214, 0.5)', { align: 'center', valign: 'middle' });
            }

            let msg, col = C.text, phase = -1;
            const an = S.anim && S.anim.key === m.key ? S.anim : null;
            if (an) {
                const t = now - an.t0;
                phase = t < ROLL.B[0] ? 0 : 1;
                msg = (phase === 0 ? m.A.name : m.B.name) + ' würfelt ...';
                col = C.soft;
            } else if (out) {
                phase = 2;
                msg = out.w === 'D' ? 'Unentschieden!' : (out.w === 'A' ? m.A.name : m.B.name) + ' gewinnt!';
                col = out.w === 'A' ? C.greenHi : (out.w === 'B' ? C.redHi : C.soft);
            } else {
                msg = 'Tippen zum Würfeln';
                col = C.soft;
            }
            const yRes = tall ? 740 : 410;
            label(msg.toUpperCase(), W / 2, yRes, 22, col, 'center');

            const hi = S.rulesHi >= 0 ? S.rulesHi : phase;
            // chips and the score line keep their distance from the result (Doc, 19.09.2026: "die drei Buttons und
            // Runde ... nach unten") - still inside the view's 570 / 900 units
            const chipsY = yRes + 64;
            const ch = drawChips([m.A.name + ' würfelt', 'dann ' + m.B.name, 'größere Zahl gewinnt'], W / 2, chipsY, W - 40, hi);

            const sc = S.score;
            if (sc.key === m.key && sc.n > 0) {
                let str = 'Runden: $' + intTex(sc.n) + '$ · **' + m.A.name + '**: $' + intTex(sc.A) + '$ · **' + m.B.name + '**: $' + intTex(sc.B) + '$';
                if (sc.D) str += ' · unentschieden: $' + intTex(sc.D) + '$';
                rich(str, W / 2, chipsY + ch + 20, 16, C.soft, { align: 'center', maxW: W - 40 });
            }
        }

        /* ---------------------------------------------------- Die Würfelnetze */
        function sizeNetze(m, tall) { return tall ? { w: 420, h: 880 } : { w: 800, h: 480 }; }

        function drawNetze(m, W, H, tall, now) {
            addHit(0, 0, W, H, () => rollDice());
            const s = 64;
            const nets = tall
                ? [['A', W / 2 - 1.5 * s, 62], ['B', W / 2 - 1.5 * s, 472]]
                : [['A', 40, 62], ['B', W - 40 - 3 * s, 62]];
            nets.forEach(([key, x, y]) => {
                const die = key === 'A' ? m.A : m.B, G = key === 'A' ? m.GA : m.GB;
                label(dieTitle(die.name).toUpperCase(), x + 1.5 * s, y - 28, 14, key === 'A' ? C.orange : C.cyan, 'center');
                const st = dieShown(key, m, now);
                drawNet(x, y, s, key, m, {
                    lit: (st.phase === 'done' || st.phase === 'roll') ? st.idx : null,
                    hl: S.countHi[key],
                    edit: S.mode === 'labor'
                });
                rich(countSentence(G), x + 1.5 * s, y + 4 * s + 18, 16, C.text, { align: 'center', maxW: 3.8 * s });
            });
            if (!tall) {
                drawRollingCube(W / 2, 108, 42, 'A', m, now, {});
                drawRollingCube(W / 2, 262, 42, 'B', m, now, {});
                label(m.A.name.toUpperCase(), W / 2, 50, 11, C.orange, 'center');
                label(m.B.name.toUpperCase(), W / 2, 206, 11, C.cyan, 'center');
            }
            const note = S.mode === 'labor'
                ? 'Gleiche Zahlen, gleiche Farbe. **Feld im Netz antippen:** neue Zahl wählen.'
                : 'Gleiche Zahlen, gleiche Farbe. **Tippen:** würfeln, die obere Fläche leuchtet.';
            rich(note, W / 2, H - 36, 15, C.soft, { align: 'center', maxW: W - 30 });
        }

        /* ------------------------------------------------------- Zweistufig */
        const TREE_Z = m => ({
            stage: 2, cols: ['path'], head: 112, bands: true, probs: false,
            headers: { s1: 'Stufe 1: ' + gen(m.A.name) + ' Wurf', s2: 'Stufe 2: ' + gen(m.B.name) + ' Wurf', path: 'Ausgang' }
        });

        function sizeZweistufig(m) {
            const g = treeGeom(m, TREE_Z(m));
            return { w: g.w + 10, h: g.h + 60 };
        }

        function drawZweistufig(m, W, H, tall, now) {
            addHit(0, 0, W, H, () => rollDice());
            const o = TREE_Z(m);
            const g = treeGeom(m, o);
            const an = S.anim && S.anim.key === m.key ? S.anim : null;
            if (an) {
                const t = now - an.t0;
                const tw = t < ROLL.A[1] ? t / ROLL.A[1] : (t < ROLL.B[0] ? 1 : 1 + (t - ROLL.B[0]) / (ROLL.B[1] - ROLL.B[0]));
                const a = m.A.faces[an.ia], b = m.B.faces[an.ib];
                o.walk = { i: m.GA.findIndex(x => x.v === a), j: m.GB.findIndex(x => x.v === b), t: clamp(tw, 0, 2) };
            }
            const out = rollOutcome(m);
            if (out) { o.sel = out.k; }
            drawTree(m, g, o);
            drawRollingCube((g.X0 + g.X1) / 2 - 2, 52, 34, 'A', m, now, {});
            drawRollingCube((g.X1 + g.X2) / 2 + 36, 52, 34, 'B', m, now, {});
            let str;
            if (out) {
                str = 'Ausgang $(' + out.a + ' \\mid ' + out.b + ')$: ' +
                    (out.w === 'D' ? '**unentschieden**' : '**' + (out.w === 'A' ? m.A.name : m.B.name) + '** gewinnt');
            } else {
                str = an ? 'Der Weg entsteht Stufe für Stufe ...' : '**Tippen:** würfeln und den Weg verfolgen';
            }
            rich(str, 24, g.h + 12, 17, out ? (out.w === 'A' ? C.greenHi : (out.w === 'B' ? C.redHi : C.soft)) : C.soft, { maxW: W - 40 });
        }

        /* ----------------------------------------------------- Die Würfel lesen */
        function countWarn(G) {
            if (G.length < 2 || G.every(g => g.c === G[0].c)) return null;
            const big = G.reduce((x, g) => g.c > x.c ? g : x, G[0]);
            const naive = F(1, G.length);
            if (eqF(big.f, naive)) return null;
            return '**Achtung:** Die $' + big.v + '$ steht **$' + big.c + '$-mal** drauf, also $' + fr(big.f) +
                '$ und nicht $' + fr(naive) + '$!';
        }

        const COUNT_W = 450;

        function countBlockH(m, key) {
            const G = key === 'A' ? m.GA : m.GB;
            return 62 + 26 + 46 * G.length + 14 + 34 + (countWarn(G) ? 58 : 0);
        }

        function drawCountBlock(m, key, x, y) {
            const w = COUNT_W;
            const die = key === 'A' ? m.A : m.B, G = key === 'A' ? m.GA : m.GB;
            const colr = key === 'A' ? C.orange : C.cyan;
            const hB = countBlockH(m, key);
            if (S.focus === key) {
                roundRect(x - 14, y - 12, w + 28, hB + 12, 16);
                ctx.strokeStyle = 'rgba(245, 194, 66, 0.75)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            label(dieTitle(die.name).toUpperCase(), x, y + 10, 14, colr, 'left');
            rich('sechs Flächen, ' + (G.length === 1 ? 'eine Zahl' : WORDS[G.length] + ' Zahlen'), x, y + 26, 15, C.soft);
            const s = 24;
            drawNet(x + w - 3 * s, y, s, key, m, { hl: S.countHi[key], edit: S.mode === 'labor' });

            const cw = [72, 138, w - 3 * s - 20 - 210];
            const ty = y + 62;
            label('Zahl', x + cw[0] / 2, ty + 10, CAP, C.soft, 'center', 400);
            label('wie oft?', x + cw[0] + 8, ty + 10, CAP, C.soft, 'left', 400);
            label('Wahrscheinlichkeit', x + cw[0] + cw[1], ty + 10, CAP, C.soft, 'left', 400);
            line(x, ty + 24, x + cw[0] + cw[1] + cw[2], ty + 24, 'rgba(157, 232, 255, 0.3)', 1);
            G.forEach((gg, r) => {
                const ry = ty + 26 + r * 46, cy = ry + 23;
                const tint = TINTS[key][r % 6];
                const hi = S.countHi[key] === gg.v;
                if (hi) {
                    roundRect(x - 6, ry + 2, cw[0] + cw[1] + cw[2] + 12, 42, 9);
                    ctx.fillStyle = 'rgba(' + tint + ', 0.18)';
                    ctx.fill();
                }
                roundRect(x + 12, ry + 7, 48, 32, 7);
                ctx.fillStyle = 'rgba(' + tint + ', 0.45)';
                ctx.fill();
                ctx.strokeStyle = 'rgb(' + tint + ')';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                tex(String(gg.v), x + 36, cy, 20, '#ffffff', { align: 'center', valign: 'middle' });
                const str = '$' + gg.c + '$-mal von $6$';
                rich(str, x + cw[0] + 8, cy - richH(str, 16) / 2, 16, C.text);
                const raw = '\\frac{' + gg.c + '}{6}';
                tex(eqF(gg.f, { p: gg.c, q: 6 }) ? raw : raw + ' = ' + fr(gg.f), x + cw[0] + cw[1], cy, 18, C.text, { valign: 'middle' });
                addHit(x - 6, ry, w + 12, 46, () => { S.countHi[key] = hi ? null : gg.v; render(); });
            });
            let yy = ty + 26 + 46 * G.length + 14;
            rich('Kontrolle: ' + sumUnits(G.map(g => g.f)), x, yy, 16, C.greenHi, { maxW: w });
            yy += 34;
            const warn = countWarn(G);
            if (warn) rich(warn, x, yy, 16, C.redHi, { maxW: w });
        }

        function sizeZaehlen(m, tall) {
            const hA = countBlockH(m, 'A'), hB = countBlockH(m, 'B');
            return tall ? { w: COUNT_W + 30, h: hA + hB + 70 } : { w: 2 * COUNT_W + 80, h: Math.max(hA, hB) + 30 };
        }

        function drawZaehlen(m, W, H, tall) {
            if (tall) {
                drawCountBlock(m, 'A', 15, 20);
                drawCountBlock(m, 'B', 15, 20 + countBlockH(m, 'A') + 40);
            } else {
                drawCountBlock(m, 'A', 20, 20);
                drawCountBlock(m, 'B', W - COUNT_W - 20, 20);
            }
        }

        /* ----------------------------------------------- Äste zusammenfassen */
        const MERGE_MS = 650;

        function mergeU(now) {
            const mg = S.merge, target = mg.grouped ? 1 : 0;
            if (!mg.t0) return target;
            const p = (now - mg.t0) / MERGE_MS;
            if (p >= 1) { mg.t0 = 0; return target; }
            return mg.from + (target - mg.from) * ease(p);
        }

        function toggleMerge(grouped) {
            const now = performance.now();
            const cur = mergeU(now);
            S.merge.grouped = grouped != null ? grouped : !S.merge.grouped;
            S.merge.from = cur;
            S.merge.t0 = now;
            kick();
            refreshPanelLive();
        }

        function sizeMerge(m, tall) { return tall ? { w: 470, h: 900 } : { w: 920, h: 480 }; }

        function drawMerge(m, W, H, tall, now) {
            addHit(0, 0, W, H, () => toggleMerge());
            const key = S.merge.die;
            const die = key === 'A' ? m.A : m.B, G = key === 'A' ? m.GA : m.GB;
            const u = mergeU(now);
            const top = 84, span = 360, X0 = 36, X1 = 300, rootY = top + span / 2;
            const sorted = die.faces.slice().sort((a, b) => a - b);
            const y6 = i => top + (i + 0.5) * span / 6;
            const yG = gi => top + (gi + 0.5) * span / G.length;
            const words = G.length === 1 ? 'EIN AST' : WORDS[G.length].toUpperCase() + ' ÄSTE';
            label(dieTitle(die.name).toUpperCase(), 20, 22, 14, key === 'A' ? C.orange : C.cyan, 'left');
            label(u < 0.5 ? 'SECHS ÄSTE, JE EIN SECHSTEL' : words + ', GLEICHE ZAHLEN ZUSAMMEN', 20, 50, 12, C.soft, 'left', 400);

            const ys = sorted.map((v, i) => {
                const gi = G.findIndex(g => g.v === v);
                return { v, gi, y: y6(i) + (yG(gi) - y6(i)) * u };
            });
            ys.forEach(b => line(X0, rootY, X1, b.y, 'rgba(' + TINTS[key][b.gi % 6] + ', 0.95)', 2.2 + 1.4 * u));
            dot(X0, rootY, 5.5, C.neon, '#ffffff');
            if (u === 0) {
                ys.forEach(b => branchLabel(X0, rootY, X1, b.y, '\\frac{1}{6}', 15, C.text, 0.66));
            } else if (u === 1) {
                G.forEach((g, gi) => branchLabel(X0, rootY, X1, yG(gi), fr(g.f), 18, C.text, 0.55));
            }
            const drawn = new Set();
            ys.forEach(b => {
                const k = u === 1 ? 'g' + b.gi : 'f' + b.y.toFixed(1);
                if (drawn.has(k)) return;
                drawn.add(k);
                dot(X1, b.y, 6, 'rgb(' + TINTS[key][b.gi % 6] + ')', '#ffffff');
                tex(String(b.v), X1 + 14, b.y, 19, '#ffffff', { valign: 'middle' });
            });

            const px = tall ? 20 : 420, py = tall ? top + span + 40 : 70, pw = tall ? W - 40 : W - 440;
            plate(px, py, pw, tall ? H - py - 20 : 380);
            label('SECHSTEL ADDIEREN', px + 20, py + 26, 12, C.orange, 'left');
            let yy = py + 50;
            G.forEach((g, gi) => {
                let s;
                if (g.c === 1) s = '$' + g.v + '$: $\\frac{1}{6}$';
                else {
                    s = '$' + g.v + '$: $' + Array(g.c).fill('\\frac{1}{6}').join(' + ') + ' = \\frac{' + g.c + '}{6}' +
                        (eqF(g.f, { p: g.c, q: 6 }) ? '' : ' = ' + fr(g.f)) + '$';
                }
                yy += rich(s, px + 20, yy, 18, 'rgb(' + TINTS[key][gi % 6] + ')', { maxW: pw - 40 }) + 12;
            });
            yy += 6;
            yy += rich('zusammen: ' + sumUnits(G.map(g => g.f)), px + 20, yy, 18, C.greenHi, { maxW: pw - 40 }) + 14;
            rich('Die Äste, die an **einem Punkt** starten, ergeben zusammen immer $1$.', px + 20, yy, 16, C.soft, { maxW: pw - 40 });
        }

        /* ------------------------------------------------------ Stufe 1 und 2 */
        const TREE_1 = { stage: 1, cols: ['p', 'pct'] };

        function sizeStufe1(m) {
            const g = treeGeom(m, TREE_1);
            return { w: g.w + 10, h: g.h + 50 };
        }

        function drawStufe1(m, W, H) {
            const g = treeGeom(m, TREE_1);
            drawTree(m, g, TREE_1);
            rich('Kontrolle: ' + sumUnits(m.GA.map(x => x.f)), 24, g.h + 8, 17, C.greenHi, { maxW: W - 40 });
        }

        const TREE_2 = { stage: 2, cols: [] };

        function stufe2Lines(m) {
            const nA = m.GA.length, nB = m.GB.length;
            const list = m.GB.map(x => '$' + fr(x.f) + '$ bei der $' + x.v + '$');
            return [
                'An **jedes** Ende von Stufe $1$ kommen ' + gen(m.B.name) + ' Äste.',
                'Überall dieselben: ' + list.join(', ') + '.',
                'Die Würfe sind **unabhängig**: ' + gen(m.A.name) + ' Ergebnis ändert nichts an ' + gen(m.B.name) + ' Würfel.',
                '$' + nA + ' \\cdot ' + nB + ' = ' + nA * nB + '$ **Wege** durch den Baum'
            ];
        }

        function sizeStufe2(m, tall) {
            const g = treeGeom(m, TREE_2);
            return tall ? { w: Math.max(g.w, 440) + 20, h: g.h + 330 } : { w: g.w + 400, h: Math.max(g.h, 360) + 10 };
        }

        function drawStufe2(m, W, H, tall) {
            const g = treeGeom(m, TREE_2);
            drawTree(m, g, TREE_2);
            const px = tall ? 16 : g.w + 30, py = tall ? g.h + 10 : 30;
            const pw = tall ? W - 32 : W - g.w - 40;
            plate(px, py, pw, tall ? H - py - 10 : 330);
            label('STUFE 2', px + 20, py + 26, 12, C.cyan, 'left');
            let yy = py + 50;
            stufe2Lines(m).forEach((s, i) => {
                yy += rich(s, px + 20, yy, i === 3 ? 22 : 17, i === 3 ? C.orange : C.text, { maxW: pw - 40 }) + 16;
            });
        }

        /* -------------------------------------------------------- Pfadregel */
        const TREE_P = { stage: 2, cols: ['path', 'p', 'pct'], legend: true };

        function sizePfad(m, tall) {
            const g = treeGeom(m, TREE_P);
            return tall ? { w: g.w + 20, h: g.h + 330 } : { w: g.w + 390, h: Math.max(g.h, 360) + 10 };
        }

        function allPathsLine(m) {
            return 'alle Wege: ' + sumUnits(m.paths.map(p => p.f));
        }

        function drawPfad(m, W, H, tall) {
            if (S.sel == null || S.sel < 0 || S.sel >= m.paths.length) S.sel = 0;
            const g = treeGeom(m, TREE_P);
            drawTree(m, g, Object.assign({ win: true, sel: S.sel, onRow: k => { S.sel = k; render(); } }, TREE_P));
            const p = m.paths[S.sel];
            const px = tall ? 16 : g.w + 24, py = tall ? g.h + 10 : 30;
            const pw = tall ? W - 32 : W - g.w - 34;
            plate(px, py, pw, tall ? H - py - 10 : 340, 'rgba(245, 194, 66, 0.55)');
            label('PFADREGEL', px + 20, py + 26, 12, C.orange, 'left');
            rich('Weg $(' + p.a + ' \\mid ' + p.b + ')$: alle Äste **malnehmen**', px + 20, py + 46, 16, C.soft, { maxW: pw - 40 });
            tex(fr(F(p.ca, 6)) + ' \\cdot ' + fr(F(p.cb, 6)) + ' = ' + fr(p.f), px + 20, py + 120, 32, '#ffffff');
            tex(pctEq(p.f), px + 20, py + 170, 22, C.text);
            const who = p.w === 'D' ? 'unentschieden' : '**' + (p.w === 'A' ? m.A.name : m.B.name) + '** gewinnt';
            rich('Auf diesem Weg: ' + who, px + 20, py + 190, 16, p.w === 'A' ? C.greenHi : (p.w === 'B' ? C.redHi : C.soft), { maxW: pw - 40 });
            label('KONTROLLE', px + 20, py + 246, 11, C.soft, 'left', 400);
            rich(allPathsLine(m), px + 20, py + 262, 17, C.greenHi, { maxW: pw - 40 });
        }

        /* ------------------------------------------------------ Wer gewinnt? */
        function tableGeom(m) {
            const L = m.paths.length;
            const rh = L <= 9 ? 46 : L <= 16 ? 36 : 28;
            const fs = rh >= 46 ? 18 : rh >= 36 ? 15 : 13;
            const cols = [
                { h: 'Weg', w: 130 }, { h: m.A.name, w: 100 }, { h: m.B.name, w: 100 },
                { h: 'Wer gewinnt?', w: 180 }, { h: 'Wahrsch.', w: 120 }
            ];
            const w = cols.reduce((s, c) => s + c.w, 0);
            return { rh, fs, cols, w, h: 50 + L * rh + 80 };
        }

        function sizeTabelle(m) {
            const t = tableGeom(m);
            return { w: t.w + 40, h: t.h + 20 };
        }

        function drawTabelle(m, W) {
            const t = tableGeom(m);
            const x0 = 20, y0 = 16;
            let cx = x0;
            t.cols.forEach(c => { label(c.h.toUpperCase(), cx + c.w / 2, y0 + 18, 11, C.soft, 'center', 400); cx += c.w; });
            line(x0, y0 + 40, x0 + t.w, y0 + 40, 'rgba(157, 232, 255, 0.4)', 1.2);
            m.paths.forEach((p, r) => {
                const ry = y0 + 44 + r * t.rh, cy = ry + t.rh / 2;
                if (r % 2) { ctx.fillStyle = 'rgba(157, 232, 255, 0.04)'; ctx.fillRect(x0, ry, t.w, t.rh); }
                let x = x0;
                const cell = i => { const c = t.cols[i]; const cxm = x + c.w / 2; x += c.w; return cxm; };
                const winCol = p.w === 'A' ? C.greenHi : (p.w === 'B' ? C.redHi : C.soft);
                tex('\\mathbf{(' + p.a + ' \\mid ' + p.b + ')}', cell(0), cy, t.fs, '#ffffff', { align: 'center', valign: 'middle' });
                tex(String(p.a), cell(1), cy, t.fs, C.text, { align: 'center', valign: 'middle' });
                tex(String(p.b), cell(2), cy, t.fs, C.text, { align: 'center', valign: 'middle' });
                const wx = x, ww = t.cols[3].w;
                roundRect(wx + 12, ry + 5, ww - 24, t.rh - 10, 8);
                ctx.fillStyle = p.w === 'A' ? 'rgba(121, 158, 49, 0.30)' : (p.w === 'B' ? 'rgba(176, 36, 24, 0.28)' : 'rgba(159, 180, 214, 0.14)');
                ctx.fill();
                ctx.font = '600 ' + (t.fs - 1) + 'px Outfit, sans-serif';
                ctx.fillStyle = winCol;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.w === 'D' ? 'unentschieden' : (p.w === 'A' ? m.A.name : m.B.name), cell(3), cy + 1);
                tex(fr(p.f), cell(4), cy, t.fs, C.text, { align: 'center', valign: 'middle' });
                if (S.sel === p.k) {
                    roundRect(x0 - 4, ry + 1, t.w + 8, t.rh - 2, 9);
                    ctx.strokeStyle = C.orange;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                addHit(x0, ry, t.w, t.rh, () => { S.sel = p.k; render(); });
            });
            const yb = y0 + 44 + m.paths.length * t.rh + 16;
            const list = m.winA.map(p => '$(' + p.a + ' \\mid ' + p.b + ')$').join(', ');
            const str = m.winA.length
                ? '**' + m.A.name + '** gewinnt auf $' + m.winA.length + '$ ' + (m.winA.length === 1 ? 'Weg' : 'Wegen') + ': ' + list
                : '**' + m.A.name + '** gewinnt auf keinem Weg.';
            rich(str, x0, yb, 17, C.greenHi, { maxW: t.w });
        }

        /* ----------------------------------------------------- Summenregel */
        const TREE_S = { stage: 2, cols: ['path', 'p'], legend: true };

        function sizeSumme(m, tall) {
            const g = treeGeom(m, TREE_S);
            return tall ? { w: Math.max(g.w, 460) + 20, h: g.h + 470 } : { w: g.w + 470, h: Math.max(g.h, 470) + 10 };
        }
