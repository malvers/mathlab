/* buch-lgs.js — widgets for Lernbereich 4 (linear systems and matrices) of the textbook (js/buch.js, js/buch-plot.js).
 *   gauss     3×3 system as an augmented matrix: own row operations or "next step" (Gauß, then Gauß-Jordan)
 *   geraden   two equations in two unknowns as two lines: one, no or infinitely many solutions
 *   matrizen  A + B, A − B, r·A, transpose for 2×3 matrices
 *   pagerank  four web pages, the rank as the limit of repeated multiplication (Brin & Page 1998)
 */
(function () {
    'use strict';
    const B = window.Buch;
    const { Frac, fmt, texNum, math, seg, div, Plot } = B;
    const W = B.widget;
    const ROM = ['I', 'II', 'III'];
    const RT = ROM.map(r => '\\text{' + r + '}');   // row names upright in TeX
    const ri = n => Math.floor(Math.random() * n);
    const pick = arr => arr[ri(arr.length)];

    function frac(s) {
        s = String(s).trim().replace(',', '.').replace(/[−–]/g, '-');
        let m = s.match(/^(-?\d+)\/(-?\d+)$/);
        if (m) return +m[2] ? new Frac(+m[1], +m[2]) : null;
        if (!/^-?\d*\.?\d+$/.test(s)) return null;
        const dec = (s.split('.')[1] || ''), den = Math.pow(10, dec.length);
        return new Frac(Math.round(parseFloat(s) * den), den);
    }
    const isZero = f => f.n === 0, isOne = f => f.n === f.d;

    /* ---------- Gauss elimination ---------- */
    W('gauss', function (box) {
        let M, hist, sol;
        box.innerHTML =
            '<div class="b-out" data-sys style="margin-bottom:10px"></div>' +
            '<div class="b-out b-scroll" data-mat style="overflow-x:auto"></div>' +
            '<div class="b-ctrls" style="margin:12px 0 6px" data-ops></div>' +
            '<div class="b-ctrls" style="margin:0 0 6px"><button type="button" class="b-btn b-go" data-run>Ausführen</button>' +
            '<button type="button" class="b-btn b-hintbtn" data-next>Nächster Schritt</button><button type="button" class="b-btn" data-undo>Zurück</button>' +
            '<button type="button" class="b-btn" data-new>Neues LGS</button></div>' +
            '<p class="b-help" data-msg aria-live="polite"></p>';
        const $ = s => box.querySelector(s);
        const ops = $('[data-ops]');
        const sOp = seg(ops, [['add', 'Zeile + k · Zeile'], ['mul', 'Zeile · k'], ['swap', 'tauschen']], 'add', () => form(), 'Umformung');
        const sT = seg(ops, ROM.map((r, i) => [i, 'Ziel ' + r]), 1, null, 'Zielzeile');
        const sS = seg(ops, ROM.map((r, i) => [i, 'mit ' + r]), 0, null, 'zweite Zeile');
        const kIn = document.createElement('input');
        kIn.className = 'b-in'; kIn.style.width = '90px'; kIn.placeholder = 'k'; kIn.setAttribute('aria-label', 'Faktor k'); kIn.value = '-2';
        ops.appendChild(kIn);
        function form() { const o = sOp.get(); sS.el.style.display = o === 'mul' ? 'none' : ''; kIn.style.display = o === 'swap' ? 'none' : ''; }
        function fresh() {
            // A = L·U with integer L (unit diagonal) and U: elimination then needs only whole-number factors
            const L = [[1, 0, 0], [pick([-2, -1, 1, 2, 3]), 1, 0], [pick([-2, -1, 1, 2]), pick([-2, -1, 1, 2]), 1]];
            const U = [[pick([1, 1, 2]), pick([-2, -1, 1, 2, 3]), pick([-3, -1, 1, 2])], [0, pick([1, -1, 2]), pick([-2, -1, 1, 3])], [0, 0, pick([1, 2, -1, 3])]];
            const A = [0, 1, 2].map(i => [0, 1, 2].map(j => L[i].reduce((s, _, k) => s + L[i][k] * U[k][j], 0)));
            sol = [ri(9) - 4, ri(9) - 4, ri(9) - 4];
            M = A.map(r => r.map(v => new Frac(v)).concat([new Frac(r.reduce((s, v, j) => s + v * sol[j], 0))]));
            hist = [{ M, op: '' }];
            show('');
        }
        const term = (cs) => {
            const names = ['x', 'y', 'z']; let s = '';
            cs.slice(0, 3).forEach((c, j) => {
                if (isZero(c)) return;
                const neg = c.n < 0, abs = new Frac(Math.abs(c.n), c.d);
                s += (s ? (neg ? ' - ' : ' + ') : (neg ? '-' : '')) + (isOne(abs) ? '' : abs.tex()) + names[j];
            });
            return (s || '0') + ' = ' + cs[3].tex();
        };
        function show(msg) {
            const m = hist[hist.length - 1].M;
            $('[data-sys]').innerHTML = '$\\begin{array}{rl} \\text{I} & ' + term(hist[0].M[0]) + ' \\\\ \\text{II} & ' + term(hist[0].M[1]) + ' \\\\ \\text{III} & ' + term(hist[0].M[2]) + '\\end{array}$';
            $('[data-mat]').innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:14px 26px;align-items:center">' + hist.slice(-3).map((h, i, arr) =>
                '<span>$' + (h.op ? '\\xrightarrow{\\;' + h.op + '\\;}' : '') + '\\left(\\begin{array}{rrr|r}' + h.M.map(r => r.map(v => v.tex()).join(' & ')).join(' \\\\ ') + '\\end{array}\\right)$</span>').join('') + '</div>';
            let m2 = msg;
            const st = status(m);
            if (st === 'done') m2 = '<span class="b-res">Fertig: $x = ' + m[0][3].tex() + '$, $y = ' + m[1][3].tex() + '$, $z = ' + m[2][3].tex() + '$.</span>';
            else if (st === 'stufe' && !msg) m2 = 'Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).';
            $('[data-msg]').innerHTML = m2 || 'Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.';
            math(box);
        }
        function status(m) {
            const low = isZero(m[1][0]) && isZero(m[2][0]) && isZero(m[2][1]);
            const diag = low && [0, 1, 2].every(i => isOne(m[i][i])) && isZero(m[0][1]) && isZero(m[0][2]) && isZero(m[1][2]);
            return diag ? 'done' : low ? 'stufe' : 'open';
        }
        const clone = m => m.map(r => r.slice());
        function push(m, op) { hist.push({ M: m, op }); show(''); }
        function addRow(m, t, s, k) { const n = clone(m); n[t] = n[t].map((v, j) => v.add(k.mul(m[s][j]))); return n; }
        const kTex = (k) => (k.n < 0 ? '-' : '+') + (isOne(new Frac(Math.abs(k.n), k.d)) ? '' : new Frac(Math.abs(k.n), k.d).tex() + '\\cdot ');
        function run() {
            const m = hist[hist.length - 1].M, o = sOp.get(), t = +sT.get(), s = +sS.get();
            if (o === 'swap') { if (t === s) return show('Wähle zwei verschiedene Zeilen.'); const n = clone(m); [n[t], n[s]] = [n[s], n[t]]; return push(n, RT[t] + '\\leftrightarrow ' + RT[s]); }
            const k = frac(kIn.value); if (!k) return show('Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.');
            if (o === 'mul') { if (isZero(k)) return show('Mit $0$ multiplizieren ist keine Äquivalenzumformung.'); const n = clone(m); n[t] = n[t].map(v => v.mul(k)); return push(n, RT[t] + ' \\cdot ' + (k.n < 0 ? '(' + k.tex() + ')' : k.tex())); }
            if (t === s) return show('Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.');
            push(addRow(m, t, s, k), RT[t] + kTex(k) + RT[s]);
        }
        function next() {
            const m = hist[hist.length - 1].M;
            for (let c = 0; c < 3; c++) {            // forward elimination
                if (isZero(m[c][c])) {
                    const r = [c + 1, c + 2].find(r => r < 3 && !isZero(m[r][c]));
                    if (r == null) return show('In Spalte ' + (c + 1) + ' gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen.');
                    const n = clone(m); [n[c], n[r]] = [n[r], n[c]]; return push(n, RT[c] + '\\leftrightarrow ' + RT[r]);
                }
                for (let r = c + 1; r < 3; r++) if (!isZero(m[r][c])) {
                    const k = new Frac(-m[r][c].n * m[c][c].d, m[r][c].d * m[c][c].n);
                    return push(addRow(m, r, c, k), RT[r] + kTex(k) + RT[c]);
                }
            }
            for (let c = 2; c >= 0; c--) {           // normalise, then clear upwards
                if (!isOne(m[c][c])) { const k = new Frac(m[c][c].d, m[c][c].n); const n = clone(m); n[c] = n[c].map(v => v.mul(k)); return push(n, RT[c] + ' \\cdot ' + (k.n < 0 ? '(' + k.tex() + ')' : k.tex())); }
                for (let r = c - 1; r >= 0; r--) if (!isZero(m[r][c])) { const k = new Frac(-m[r][c].n, m[r][c].d); return push(addRow(m, r, c, k), RT[r] + kTex(k) + RT[c]); }
            }
            show('');
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-run')) run();
            else if (b.hasAttribute('data-next')) next();
            else if (b.hasAttribute('data-new')) fresh();
            else if (b.hasAttribute('data-undo') && hist.length > 1) { hist.pop(); show(''); }
        });
        form(); fresh();
    });

    /* ---------- two lines ---------- */
    W('geraden', function (box) {
        const S = { a1: 1, b1: 1, c1: 4, a2: 1, b2: -1, c2: 0 };
        const ctr = div(box, 'b-ctrls');
        const PRE = { eine: [1, -1, 0], keine: [2, 2, 2], unendlich: [2, 2, 8] };
        seg(ctr, [['eine', 'eine Lösung'], ['keine', 'keine Lösung'], ['unendlich', 'unendlich viele']], 'eine', v => {
            [S.a2, S.b2, S.c2] = PRE[v]; ra.set(S.a2); rb.set(S.b2); rc.set(S.c2); render();
        }, 'Beispiel');
        const sl = div(box, '');
        B.div(sl, 'b-help', 'Gleichung I ist fest: $x + y = 4$. Verändere Gleichung II: $a\\,x + b\\,y = c$.');
        const ra = B.range(sl, { label: '$a$', min: -4, max: 4, step: 0.5, value: S.a2, onInput: v => { S.a2 = v; render(); } });
        const rb = B.range(sl, { label: '$b$', min: -4, max: 4, step: 0.5, value: S.b2, onInput: v => { S.b2 = v; render(); } });
        const rc = B.range(sl, { label: '$c$', min: -8, max: 8, step: 0.5, value: S.c2, onInput: v => { S.c2 = v; render(); } });
        math(sl);
        const plotBox = div(box, '');
        const p = new Plot(plotBox, { x: [-6, 8], y: [-5, 8], height: 320, equal: true, aria: 'Zwei Geraden' });
        const out = div(box, 'b-out');
        const line = (a, b, c, col) => Math.abs(b) > 1e-9 ? { fn: x => (c - a * x) / b, color: col } : (Math.abs(a) > 1e-9 ? { vline: c / a, color: col } : null);
        function render() {
            const { a1, b1, c1, a2, b2, c2 } = S, det = a1 * b2 - a2 * b1;
            const L = [line(a1, b1, c1, 'lambda'), line(a2, b2, c2, 'cyan')].filter(Boolean);
            let t;
            if (Math.abs(a2) < 1e-9 && Math.abs(b2) < 1e-9) t = Math.abs(c2) < 1e-9 ? 'Gleichung II lautet $0 = 0$, sie schränkt nichts ein.' : 'Gleichung II lautet $0 = ' + texNum(c2, 2) + '$: ein Widerspruch, keine Lösung.';
            else if (Math.abs(det) > 1e-9) {
                const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
                L.push({ pts: [[x, y]], color: 'white', r: 6 });
                t = '<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(' + texNum(x, 3) + ' \\mid ' + texNum(y, 3) + ')$.';
            } else {
                const same = Math.abs(a1 * c2 - a2 * c1) < 1e-9 && Math.abs(b1 * c2 - b2 * c1) < 1e-9;
                t = same ? '<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.' : '<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.';
            }
            p.draw(L);
            out.innerHTML = '<p style="margin:0 0 6px">$\\text{I: } x + y = 4 \\qquad \\text{II: } ' + texNum(a2, 2) + 'x ' + (b2 < 0 ? '-' : '+') + ' ' + texNum(Math.abs(b2), 2) + 'y = ' + texNum(c2, 2) + '$</p><p style="margin:0">' + t + '</p>';
            math(out);
        }
        render();
    });

    /* ---------- matrix operations ---------- */
    W('matrizen', function (box) {
        let A, Bm;
        box.innerHTML = '<div class="b-out" data-ab></div>' +
            '<div class="b-ctrls" style="margin:12px 0"><button type="button" class="b-btn" data-o="add">$A + B$</button><button type="button" class="b-btn" data-o="sub">$A - B$</button>' +
            '<button type="button" class="b-btn" data-o="mul">$r \\cdot A$</button><label class="b-ctrl" for="mx-r">mit $r =$</label><input class="b-in" id="mx-r" value="3" style="width:70px">' +
            '<button type="button" class="b-btn" data-o="tA">$A^T$</button><button type="button" class="b-btn" data-o="tB">$B^T$</button><button type="button" class="b-btn b-hintbtn" data-o="new">Neue Matrizen</button></div>' +
            '<div class="b-out" data-res>Wähle eine Rechnung.</div>';
        const $ = s => box.querySelector(s);
        const tex = (X, name) => (name ? name + ' = ' : '') + '\\begin{pmatrix}' + X.map(r => r.map(v => fmt(v, 3).replace(',', '{,}')).join(' & ')).join(' \\\\ ') + '\\end{pmatrix}';
        function fresh() {
            A = [0, 1].map(() => [0, 1, 2].map(() => ri(11) - 5)); Bm = [0, 1].map(() => [0, 1, 2].map(() => ri(11) - 5));
            $('[data-ab]').innerHTML = '$' + tex(A, 'A') + ' \\qquad ' + tex(Bm, 'B') + '$';
            $('[data-res]').textContent = 'Wähle eine Rechnung.';
            math(box);
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button[data-o]'); if (!b) return;
            const o = b.dataset.o; let r;
            if (o === 'new') return fresh();
            if (o === 'add') r = '$A + B = ' + tex(A.map((row, i) => row.map((v, j) => v + Bm[i][j]))) + '$ &nbsp; Gleiche Stellen werden addiert.';
            if (o === 'sub') r = '$A - B = ' + tex(A.map((row, i) => row.map((v, j) => v - Bm[i][j]))) + '$ &nbsp; Gleiche Stellen werden subtrahiert.';
            if (o === 'mul') { const k = B.parseAnswer($('#mx-r').value); if (isNaN(k)) return; r = '$' + texNum(k, 3) + ' \\cdot A = ' + tex(A.map(row => row.map(v => k * v))) + '$ &nbsp; Jeder Eintrag wird mit $r$ multipliziert.'; }
            if (o === 'tA') r = '$A^T = ' + tex([0, 1, 2].map(j => A.map(row => row[j]))) + '$ &nbsp; Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.';
            if (o === 'tB') r = '$B^T = ' + tex([0, 1, 2].map(j => Bm.map(row => row[j]))) + '$';
            $('[data-res]').innerHTML = r; math($('[data-res]'));
        });
        math(box); fresh();
    });

    /* ---------- PageRank ---------- */
    W('pagerank', function (box) {
        // links: A→B, A→C, B→C, C→A, D→C
        const N = ['A', 'B', 'C', 'D'], OUT = { A: ['B', 'C'], B: ['C'], C: ['A'], D: ['C'] }, d = 0.85;
        const POS = { A: [70, 60], B: [250, 60], C: [250, 200], D: [70, 200] };
        let v = [0.25, 0.25, 0.25, 0.25], step = 0;
        box.innerHTML = '<div class="b-two"><div class="b-svgbox" data-g></div><div><div class="b-out" data-v></div>' +
            '<div class="b-ctrls" style="margin:12px 0 0"><button type="button" class="b-btn b-go" data-s>1 Schritt</button><button type="button" class="b-btn" data-s10>10 Schritte</button><button type="button" class="b-btn b-hintbtn" data-r>Zurücksetzen</button></div></div></div>';
        const $ = s => box.querySelector(s);
        function iterate() {
            const n = N.map(() => (1 - d) / 4);
            N.forEach((p, i) => OUT[p].forEach(q => { n[N.indexOf(q)] += d * v[i] / OUT[p].length; }));
            v = n; step++;
        }
        function render() {
            let svg = '<defs><marker id="pr-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#7fd8ee"/></marker></defs>';
            N.forEach(p => OUT[p].forEach(q => {
                const [x1, y1] = POS[p], [x2, y2] = POS[q], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), o = 30;
                const bend = (p === 'C' && q === 'A') || (p === 'A' && q === 'C') ? (p === 'A' ? 18 : -18) : 0;
                const mx = (x1 + x2) / 2 - dy / L * bend, my = (y1 + y2) / 2 + dx / L * bend;
                svg += '<path d="M' + (x1 + dx / L * o) + ' ' + (y1 + dy / L * o) + ' Q' + mx + ' ' + my + ' ' + (x2 - dx / L * o) + ' ' + (y2 - dy / L * o) + '" fill="none" stroke="#7fd8ee" stroke-width="2" marker-end="url(#pr-arr)"/>';
            }));
            N.forEach((p, i) => {
                const [x, y] = POS[p], r = 16 + v[i] * 40;
                svg += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(245,194,66,0.2)" stroke="rgb(245,194,66)" stroke-width="2"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:17px">' + p + '</text>';
            });
            $('[data-g]').innerHTML = '<svg viewBox="0 0 320 260" width="320" height="260" style="min-width:0" role="img" aria-label="Vier Webseiten und ihre Links">' + svg + '</svg>';
            $('[data-v]').innerHTML = '<p style="margin:0 0 8px">Schritt ' + step + ':</p>$\\vec{v} = \\begin{pmatrix}' + v.map(x => texNum(x, 4)).join(' \\\\ ') + '\\end{pmatrix}$ &nbsp; (A, B, C, D)' +
                '<p style="margin:8px 0 0">Summe: $' + texNum(v.reduce((s, x) => s + x, 0), 4) + '$</p>';
            math($('[data-v]'));
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-s')) iterate();
            else if (b.hasAttribute('data-s10')) for (let i = 0; i < 10; i++) iterate();
            else if (b.hasAttribute('data-r')) { v = [0.25, 0.25, 0.25, 0.25]; step = 0; }
            render();
        });
        render();
    });
})();
