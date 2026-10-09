/* buch-stochastik.js — interactive widgets for the stochastics chapters of the textbook (js/buch.js).
 *   baum-hero        decorative tree for the chapter opener
 *   baum             tree-diagram workshop: urn, with/without replacement, 2 or 3 draws, click path ends → event
 *   schnelltest      rapid test: sliders → four-field table and tree, share of the positives who are ill
 *   vierfeld-trainer fill in the missing cells of a four-field table, new table on request
 *   simulation       relative frequency over n against the probability (law of large numbers)
 *   ziegen           the goat problem: play it, or let the computer play a thousand times
 *   histo-hero       decorative histogram (binomial, or any weights) for a chapter opener (Klasse 12)
 *   unabhaengig      independence: sliders for P(A), P(B), P(A ∩ B), four-field table and the unit square
 *   zufallsgroesse   a random variable: bar chart, table, E(X), V(X), σ, fair or not, play it a thousand times
 *   binomial         B(n; p) as a histogram: P(X = k), P(X ≤ k), P(X ≥ k), P(a ≤ X ≤ b), μ and σ
 *   bernoulli-baum   the tree of a Bernoulli chain, every path with exactly k hits lit
 *   stichprobe       many samples from one population: the sample shares scatter around p (Klasse 13)
 *   signifikanztest  test of H0: p = p0, left/right/two-sided, rejection region, decision, error of the second kind
 * Looks: js/buch.css (section "Widgets of the stochastics chapters").
 */
(function () {
    'use strict';
    const { Frac, fmt, texNum, pct, math, dbg } = window.Buch;
    const W = window.Buch.widget;

    function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
    function rnd(n) { return Math.floor(Math.random() * n); }
    const int = n => Math.round(n).toLocaleString('de-DE').replace(/\./g, '\u202f');
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    /* ---------- tree drawing (shared by the widgets) ----------
     * node: { key, edge (text on the branch), cls ('r' | 'b' | 'root' | ''), label (letter in the circle),
     *         zero (branch with probability 0), children: [...] }
     * opt:  { stepX, spacing, leafW, leaf(node) → svg content of the leaf box, on(key) → highlight edge, click }
     */
    function treeSVG(root, opt) {
        const stepX = opt.stepX || 170, spacing = opt.spacing || 56, leafW = opt.leafW || 150;
        const pad = 20, x0 = 26;
        const leaves = [];
        let depth = 0;
        (function walk(n, d) {
            n.d = d; depth = Math.max(depth, d);
            if (n.children && n.children.length) n.children.forEach(c => walk(c, d + 1));
            else leaves.push(n);
        })(root, 0);
        leaves.forEach((l, i) => { l.y = pad + spacing * (i + 0.5); });
        (function place(n) {
            n.x = x0 + n.d * stepX;
            if (n.children && n.children.length) {
                n.children.forEach(place);
                n.y = n.children.reduce((s, c) => s + c.y, 0) / n.children.length;
            }
        })(root);
        const width = x0 + depth * stepX + 24 + leafW + 6;
        const height = pad * 2 + spacing * leaves.length;
        let edges = '', labels = '', nodes = '', leafG = '';
        (function draw(n) {
            (n.children || []).forEach(c => {
                const on = opt.on && opt.on(c.key);
                edges += '<line class="st-edge' + (c.zero ? ' zero' : '') + (on ? ' on' : '') + '" x1="' + n.x + '" y1="' + n.y + '" x2="' + c.x + '" y2="' + c.y + '"/>';
                if (c.edge != null) {
                    const mx = (n.x + c.x) / 2, my = (n.y + c.y) / 2;
                    const w = 10 + String(c.edge).length * 8.4;
                    labels += '<rect class="st-p-bg" x="' + (mx - w / 2) + '" y="' + (my - 11) + '" width="' + w + '" height="22" rx="5"/>' +
                        '<text class="st-p" x="' + mx + '" y="' + (my + 5) + '" text-anchor="middle">' + esc(c.edge) + '</text>';
                }
                draw(c);
            });
            const r = n.d === 0 ? 7 : 12;
            nodes += '<circle class="st-node-' + (n.cls || 'root') + '" cx="' + n.x + '" cy="' + n.y + '" r="' + r + '"/>';
            if (n.label) nodes += '<text x="' + n.x + '" y="' + (n.y + 4.5) + '" text-anchor="middle" style="fill:#fff;font-size:12px;font-weight:700">' + esc(n.label) + '</text>';
            if (!(n.children && n.children.length) && opt.leaf) {
                const lx = n.x + 20, ly = n.y - 15;
                const on = opt.on && opt.on(n.key);
                leafG += '<g class="st-leaf' + (on ? ' on' : '') + '" data-key="' + esc(n.key) + '" transform="translate(' + lx + ',' + ly + ')">' +
                    '<rect width="' + leafW + '" height="30" rx="7"/>' + opt.leaf(n, leafW) + '</g>';
            }
        })(root);
        const minW = Math.min(width, opt.minW != null ? opt.minW : 560);
        return '<svg class="st-tree" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" style="min-width:' + minW + 'px" role="img" aria-label="' + esc(opt.aria || 'Baumdiagramm') + '">' +
            edges + labels + nodes + leafG + '</svg>';
    }

    /* ---------- chapter opener: a quiet tree with one path lit ---------- */
    W('baum-hero', function (box) {
        const f = (n, d) => n + '/' + d;
        const root = { key: '', children: [
            { key: 'R', cls: 'r', label: 'R', edge: f(3, 5), children: [
                { key: 'RR', cls: 'r', label: 'R', edge: f(2, 4) },
                { key: 'RB', cls: 'b', label: 'B', edge: f(2, 4) }] },
            { key: 'B', cls: 'b', label: 'B', edge: f(2, 5), children: [
                { key: 'BR', cls: 'r', label: 'R', edge: f(3, 4) },
                { key: 'BB', cls: 'b', label: 'B', edge: f(1, 4) }] }] };
        box.innerHTML = treeSVG(root, {
            stepX: 130, spacing: 50, leafW: 92, minW: 0, aria: 'Baumdiagramm: zwei Kugeln ohne Zurücklegen',
            on: k => 'RB'.startsWith(k) && k.length > 0,
            leaf: (n, w) => '<text x="10" y="20">' + n.key + '</text><text class="st-leaf-p" x="' + (w - 10) + '" y="20" text-anchor="end">' +
                { RR: '3/10', RB: '3/10', BR: '3/10', BB: '1/10' }[n.key] + '</text>'
        });
    });

    /* ---------- tree-diagram workshop ---------- */
    W('baum', function (box) {
        const S = { r: 3, b: 2, stages: 2, replace: false, sel: new Set(), ev: -1 };
        box.innerHTML =
            '<div class="b-ctrls">' +
            '<div class="b-ctrl"><span class="st-ball r"></span> Rot <span class="b-stepper"><button type="button" data-d="r-" aria-label="eine rote Kugel weniger">−</button><output data-o="r"></output><button type="button" data-d="r+" aria-label="eine rote Kugel mehr">+</button></span></div>' +
            '<div class="b-ctrl"><span class="st-ball b"></span> Blau <span class="b-stepper"><button type="button" data-d="b-" aria-label="eine blaue Kugel weniger">−</button><output data-o="b"></output><button type="button" data-d="b+" aria-label="eine blaue Kugel mehr">+</button></span></div>' +
            '<div class="b-seg" role="group" aria-label="Anzahl der Züge"><button type="button" data-st="2">2 Züge</button><button type="button" data-st="3">3 Züge</button></div>' +
            '<div class="b-seg" role="group" aria-label="Ziehen"><button type="button" data-rp="0">ohne Zurücklegen</button><button type="button" data-rp="1">mit Zurücklegen</button></div>' +
            '</div>' +
            '<div class="b-ctrl" style="margin:0 0 10px">Urne: <span class="st-urn" data-urn></span></div>' +
            '<div class="b-svgbox b-scroll" data-tree></div>' +
            '<div class="b-ctrls" style="margin:12px 0 10px"><span class="b-ctrl">Ereignis wählen:</span><div class="b-seg" data-ev role="group" aria-label="Ereignis"></div></div>' +
            '<div class="b-out" data-res></div>';
        const $ = s => box.querySelector(s);

        function build(prefix, r, b, d) {
            if (d === S.stages) return [];
            const tot = r + b, out = [];
            [['R', r, 'r'], ['B', b, 'b']].forEach(([L, k, cls]) => {
                const p = new Frac(k, tot);
                const node = { key: prefix + L, cls, label: L, p, raw: [k, tot], edge: k + '/' + tot, zero: k === 0 };
                const r2 = S.replace ? r : r - (L === 'R' ? 1 : 0), b2 = S.replace ? b : b - (L === 'B' ? 1 : 0);
                node.children = k === 0 ? [] : build(prefix + L, r2, b2, d + 1);
                if (k === 0 && d + 1 < S.stages) node.children = [];   // impossible branch ends here
                out.push(node);
            });
            return out;
        }
        function leavesOf(n, acc = [], path = []) {
            (n.children || []).forEach(c => {
                const p2 = path.concat([c]);
                if (c.children && c.children.length) leavesOf(c, acc, p2);
                else acc.push({ key: c.key, path: p2, full: c.key.length === S.stages });
            });
            return acc;
        }
        const EVENTS = () => {
            const n = S.stages, all = n === 2 ? 'beide' : 'alle';
            return [
                [all + ' Rot', k => /^R+$/.test(k)],
                ['genau einmal Rot', k => (k.match(/R/g) || []).length === 1],
                ['mindestens einmal Rot', k => k.includes('R')],
                ['keinmal Rot', k => !k.includes('R')],
                [all + ' gleich', k => /^(R+|B+)$/.test(k)],
                ['leeren', null]
            ];
        };
        function render() {
            $('[data-o="r"]').textContent = S.r; $('[data-o="b"]').textContent = S.b;
            box.querySelectorAll('[data-st]').forEach(x => x.classList.toggle('on', +x.dataset.st === S.stages));
            box.querySelectorAll('[data-rp]').forEach(x => x.classList.toggle('on', !!+x.dataset.rp === S.replace));
            $('[data-urn]').innerHTML = '<span class="st-ball r"></span>'.repeat(S.r) + '<span class="st-ball b"></span>'.repeat(S.b);
            const root = { key: '', children: build('', S.r, S.b, 0) };
            const leaves = leavesOf(root).filter(l => l.full && l.path.every(n => !n.zero));
            const prob = {};
            leaves.forEach(l => { prob[l.key] = l.path.reduce((a, n) => a.mul(n.p), new Frac(1)); });
            [...S.sel].forEach(k => { if (!prob[k]) S.sel.delete(k); });
            $('[data-tree]').innerHTML = treeSVG(root, {
                stepX: S.stages === 2 ? 190 : 165, spacing: S.stages === 2 ? 58 : 46, leafW: 156,
                aria: 'Baumdiagramm der Urne',
                on: k => [...S.sel].some(s => s.startsWith(k)),
                leaf: (n, w) => {
                    if (!prob[n.key]) return '<text x="10" y="20" style="fill:#6d8199">unmöglich</text>';
                    let t = '<text x="10" y="20">';
                    for (const ch of n.key) t += '<tspan style="fill:' + (ch === 'R' ? '#ff8a7e' : '#7cc0ff') + ';font-weight:700">' + ch + '</tspan>';
                    t += '</text><text class="st-leaf-p" x="' + (w - 10) + '" y="20" text-anchor="end">' + prob[n.key].n + '/' + prob[n.key].d + '</text>';
                    return t;
                }
            });
            const evBox = $('[data-ev]');
            evBox.innerHTML = EVENTS().map((e, i) => '<button type="button" data-e="' + i + '"' + (i === S.ev && e[1] ? ' class="on"' : '') + '>' + e[0] + '</button>').join('');
            // result: event as a set of paths, rule 1 for each path, rule 2 for the event
            const keys = Object.keys(prob).filter(k => S.sel.has(k));
            if (!keys.length) {
                $('[data-res]').innerHTML = 'Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ' +
                    'Das Buch rechnet dir die Pfadregeln vor.';
                return;
            }
            const word = k => k.split('').join('');
            const lines = keys.map(k => {
                const leaf = leaves.find(l => l.key === k);
                return '$P(\\text{' + word(k) + '}) = ' + leaf.path.map(n => '\\tfrac{' + n.raw[0] + '}{' + n.raw[1] + '}').join(' \\cdot ') + ' = ' + prob[k].tex() + '$';
            });
            let sum = new Frac(0); keys.forEach(k => { sum = sum.add(prob[k]); });
            let html = '<p style="margin:0 0 6px"><b>1. Pfadregel</b> (multiplizieren entlang des Pfades):</p><p style="margin:0 0 10px">' + lines.join('<br>') + '</p>';
            if (keys.length > 1) {
                html += '<p style="margin:0 0 6px"><b>2. Pfadregel</b> (Pfade addieren):</p>' +
                    '<p style="margin:0">$P(E) = ' + keys.map(k => prob[k].tex()).join(' + ') + ' = ' + sum.tex() +
                    (sum.d !== 1 ? ' \\approx ' + texNum(sum.value, 4) : '') + '$</p>';
            } else if (prob[keys[0]].d !== 1) {
                html += '<p style="margin:0">$\\approx ' + texNum(sum.value, 4) + '$</p>';
            }
            $('[data-res]').innerHTML = html;
            math($('[data-res]'));
        }
        box.addEventListener('click', e => {
            const t = e.target.closest('button, .st-leaf');
            if (!t || !box.contains(t)) return;
            if (t.dataset.d) {
                const [c, op] = [t.dataset.d[0], t.dataset.d[1]];
                S[c] = Math.max(1, Math.min(9, S[c] + (op === '+' ? 1 : -1)));
            } else if (t.dataset.st) {
                S.stages = +t.dataset.st; S.sel.clear(); S.ev = -1;
            } else if (t.dataset.rp != null) {
                S.replace = !!+t.dataset.rp;
            } else if (t.dataset.e != null) {
                const ev = EVENTS()[+t.dataset.e];
                S.sel.clear(); S.ev = +t.dataset.e;
                if (ev[1]) {
                    const all = [];
                    (function gen(p) { if (p.length === S.stages) { all.push(p); return; } gen(p + 'R'); gen(p + 'B'); })('');
                    all.filter(ev[1]).forEach(k => S.sel.add(k));
                }
            } else if (t.classList.contains('st-leaf')) {
                const k = t.dataset.key; S.ev = -1;
                if (S.sel.has(k)) S.sel.delete(k); else S.sel.add(k);
            } else return;
            // without replacement the urn must hold enough balls for every draw
            if (!S.replace && S.r + S.b < S.stages) S.b = S.stages - S.r;
            render();
        });
        render();
    });

    /* ---------- rapid test: four-field table + tree ---------- */
    W('schnelltest', function (box) {
        const N = 10000;
        const S = { p: 0.02, se: 0.95, sp: 0.95, rel: false };
        box.innerHTML =
            '<div class="b-range"><label for="st-p">Anteil der Erkrankten</label><input class="b-slider" id="st-p" type="range" min="0.001" max="0.3" step="0.001"><output data-o="p"></output></div>' +
            '<div class="b-range"><label for="st-se">Test erkennt Kranke (Sensitivität)</label><input class="b-slider" id="st-se" type="range" min="0.5" max="0.999" step="0.001"><output data-o="se"></output></div>' +
            '<div class="b-range"><label for="st-sp">Test erkennt Gesunde (Spezifität)</label><input class="b-slider" id="st-sp" type="range" min="0.5" max="0.999" step="0.001"><output data-o="sp"></output></div>' +
            '<div class="b-ctrls" style="margin:10px 0 12px"><div class="b-seg" role="group" aria-label="Darstellung"><button type="button" data-rel="0">Anzahlen (von 10 000)</button><button type="button" data-rel="1">Wahrscheinlichkeiten</button></div></div>' +
            '<div class="b-two"><div class="b-table-wrap" data-tab></div><div class="b-svgbox b-scroll" data-tree></div></div>' +
            '<div class="b-out" data-res style="margin-top:14px"></div>';
        const $ = s => box.querySelector(s);
        $('#st-p').value = S.p; $('#st-se').value = S.se; $('#st-sp').value = S.sp;
        box.querySelectorAll('input[type=range]').forEach(inp => inp.addEventListener('input', () => {
            S[inp.id.slice(3)] = parseFloat(inp.value); render();
        }));
        box.addEventListener('click', e => {
            const b = e.target.closest('[data-rel]'); if (!b) return;
            S.rel = !!+b.dataset.rel; render();
        });
        function render() {
            $('[data-o="p"]').textContent = pct(S.p, 1);
            $('[data-o="se"]').textContent = pct(S.se, 1);
            $('[data-o="sp"]').textContent = pct(S.sp, 1);
            box.querySelectorAll('[data-rel]').forEach(x => x.classList.toggle('on', !!+x.dataset.rel === S.rel));
            // whole people, so that every row and column adds up
            const K = Math.round(N * S.p), Kp = Math.round(K * S.se), Kn = K - Kp;
            const G = N - K, Gn = Math.round(G * S.sp), Gp = G - Gn;
            const v = x => S.rel ? fmt(x / N, 4) : int(x);
            $('[data-tab]').innerHTML =
                '<table class="b-table"><thead><tr><th></th><th>positiv $T^+$</th><th>negativ $T^-$</th><th class="b-sum">Summe</th></tr></thead><tbody>' +
                '<tr><th>krank $K$</th><td class="b-hot">' + v(Kp) + '</td><td>' + v(Kn) + '</td><td class="b-sum">' + v(K) + '</td></tr>' +
                '<tr><th>gesund $\\overline{K}$</th><td class="b-hot">' + v(Gp) + '</td><td>' + v(Gn) + '</td><td class="b-sum">' + v(G) + '</td></tr>' +
                '<tr><th class="b-sum">Summe</th><td class="b-sum b-hot">' + v(Kp + Gp) + '</td><td class="b-sum">' + v(Kn + Gn) + '</td><td class="b-sum">' + v(N) + '</td></tr>' +
                '</tbody></table>';
            const e = (x) => fmt(x, 3);
            const root = { key: '', children: [
                { key: 'K', cls: 'r', label: 'K', edge: e(S.p), children: [
                    { key: 'K+', cls: 'r', label: '+', edge: e(S.se) },
                    { key: 'K-', cls: 'b', label: '−', edge: e(1 - S.se) }] },
                { key: 'G', cls: 'b', label: 'G', edge: e(1 - S.p), children: [
                    { key: 'G+', cls: 'r', label: '+', edge: e(1 - S.sp) },
                    { key: 'G-', cls: 'b', label: '−', edge: e(S.sp) }] }] };
            const cnt = { 'K+': Kp, 'K-': Kn, 'G+': Gp, 'G-': Gn };
            $('[data-tree]').innerHTML = treeSVG(root, {
                stepX: 120, spacing: 50, leafW: 112, minW: 400, aria: 'Baumdiagramm: krank oder gesund, dann Testergebnis',
                on: k => k.endsWith('+') || k === 'K' || k === 'G',
                leaf: (n, w) => '<text x="10" y="20">' + (n.key[0] === 'K' ? 'krank' : 'gesund') + '</text>' +
                    '<text class="st-leaf-p" x="' + (w - 10) + '" y="20" text-anchor="end">' + v(cnt[n.key]) + '</text>'
            });
            const share = Kp + Gp > 0 ? Kp / (Kp + Gp) : 0;
            $('[data-res]').innerHTML =
                '<p style="margin:0 0 6px">Positiv getestet werden <b>' + (int(Kp + Gp)) + '</b> von 10 000 Personen – ' +
                'aber nur <b>' + int(Kp) + '</b> davon sind wirklich krank.</p>' +
                '<p style="margin:0">Anteil der Kranken unter den positiv Getesteten: ' +
                '$\\dfrac{' + Kp + '}{' + (Kp + Gp) + '} \\approx ' + texNum(share * 100, 1) + '\\,\\%$</p>';
            math(box);
        }
        render();
    });

    /* ---------- four-field trainer ---------- */
    W('vierfeld-trainer', function (box) {
        // cells: AB, AnB, nAB, nAnB, A, nA, B, nB, N  (n = not)
        const PATTERNS = [['AB', 'A', 'B'], ['AB', 'AnB', 'nAB'], ['A', 'B', 'nAnB'], ['AB', 'nAnB', 'A'], ['AnB', 'nAB', 'B']];
        const NAMES = { AB: 'A und B', AnB: 'A und nicht B', nAB: 'nicht A und B', nAnB: 'nicht A und nicht B', A: 'A gesamt', nA: 'nicht A gesamt', B: 'B gesamt', nB: 'nicht B gesamt', N: 'gesamt' };
        let T = null, given = null, rel = false;
        box.innerHTML =
            '<div class="b-ctrls"><div class="b-seg" role="group" aria-label="Darstellung"><button type="button" data-rel="0">Anzahlen</button><button type="button" data-rel="1">Wahrscheinlichkeiten</button></div>' +
            '<button type="button" class="b-btn" data-new>Neue Tafel</button></div>' +
            '<div class="b-table-wrap" data-tab></div>' +
            '<div class="b-ctrls" style="margin:12px 0 0"><button type="button" class="b-btn b-go" data-check>Prüfen</button><span class="b-fb" data-fb aria-live="polite"></span></div>';
        const $ = s => box.querySelector(s);
        function fresh() {
            const N = 20 * (10 + rnd(16));                        // 200 … 500
            const r5 = x => Math.max(5, Math.round(x / 5) * 5);
            const A = r5(N * (0.25 + Math.random() * 0.45)), B = r5(N * (0.25 + Math.random() * 0.45));
            const lo = Math.max(5, A + B - N + 5), hi = Math.min(A, B) - 5;
            const AB = r5(lo + Math.random() * Math.max(0, hi - lo));
            T = { AB, AnB: A - AB, nAB: B - AB, nAnB: N - A - B + AB, A, nA: N - A, B, nB: N - B, N };
            if (Object.values(T).some(x => x <= 0)) return fresh();
            given = new Set(PATTERNS[rnd(PATTERNS.length)].concat(['N']));
            draw();
        }
        function shown(k) { return rel ? fmt(T[k] / T.N, 4) : String(T[k]); }
        function cell(k) {
            if (given.has(k)) return '<td class="b-hot">' + shown(k) + '</td>';
            return '<td><input class="b-in" data-k="' + k + '" type="text" inputmode="decimal" autocomplete="off" aria-label="' + NAMES[k] + '"></td>';
        }
        function draw() {
            box.querySelectorAll('[data-rel]').forEach(x => x.classList.toggle('on', !!+x.dataset.rel === rel));
            $('[data-tab]').innerHTML =
                '<table class="b-table"><thead><tr><th></th><th>$B$</th><th>$\\overline{B}$</th><th class="b-sum">Summe</th></tr></thead><tbody>' +
                '<tr><th>$A$</th>' + cell('AB') + cell('AnB') + cell('A') + '</tr>' +
                '<tr><th>$\\overline{A}$</th>' + cell('nAB') + cell('nAnB') + cell('nA') + '</tr>' +
                '<tr><th class="b-sum">Summe</th>' + cell('B') + cell('nB') + cell('N') + '</tr></tbody></table>';
            $('[data-fb]').innerHTML = '';
            math($('[data-tab]'));
        }
        function check() {
            let ok = 0, all = 0;
            box.querySelectorAll('input[data-k]').forEach(inp => {
                all++;
                const want = rel ? T[inp.dataset.k] / T.N : T[inp.dataset.k];
                const good = window.Buch.matches(inp.value, String(want), rel ? 0.0006 : 0);
                inp.classList.toggle('ok', good); inp.classList.toggle('bad', !good && inp.value.trim() !== '');
                if (good) ok++;
            });
            const fb = $('[data-fb]');
            fb.className = 'b-fb ' + (ok === all ? 'ok' : 'bad');
            fb.innerHTML = (ok === all ? window.Buch.icon.ok + ' alles richtig' : window.Buch.icon.bad + ' ' + ok + ' von ' + all + ' richtig');
            dbg('trainer ' + ok + '/' + all);
        }
        box.addEventListener('click', e => {
            const t = e.target.closest('button'); if (!t) return;
            if (t.dataset.rel != null) { rel = !!+t.dataset.rel; draw(); }
            else if (t.hasAttribute('data-new')) fresh();
            else if (t.hasAttribute('data-check')) check();
        });
        box.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) check(); });
        fresh();
    });

    /* ---------- simulation: relative frequency against probability ---------- */
    W('simulation', function (box) {
        const EXP = [
            { id: 'muenze', name: 'Münze', ev: 'Wappen', p: 1 / 2, ptex: '\\tfrac12',
              run: () => { const w = Math.random() < 0.5; return [w, w ? 'W' : 'Z']; } },
            { id: 'wuerfel', name: 'Würfel', ev: 'Sechs', p: 1 / 6, ptex: '\\tfrac16',
              run: () => { const d = 1 + rnd(6); return [d === 6, String(d)]; } },
            { id: 'summe', name: 'Zwei Würfel', ev: 'Augensumme 7', p: 1 / 6, ptex: '\\tfrac{6}{36}',
              run: () => { const a = 1 + rnd(6), b = 1 + rnd(6); return [a + b === 7, a + '+' + b]; } },
            { id: 'urne', name: 'Urne', ev: 'beide rot (3 rot, 2 blau, ohne Zurücklegen)', p: 3 / 10, ptex: '\\tfrac{3}{10}',
              run: () => { const u = ['R', 'R', 'R', 'B', 'B']; const i = rnd(5); const x = u.splice(i, 1)[0]; const y = u[rnd(4)]; return [x === 'R' && y === 'R', x + y]; } },
            { id: 'mere', name: 'De Méré', ev: 'mindestens eine Sechs in vier Würfen', p: 671 / 1296, ptex: '1-\\left(\\tfrac56\\right)^4',
              run: () => { const w = [1, 2, 3, 4].map(() => 1 + rnd(6)); return [w.includes(6), w.join('')]; } }
        ];
        let ex = EXP[1], hits = 0, hist = [], last = [];
        box.innerHTML =
            '<div class="b-ctrls"><div class="b-seg" role="group" aria-label="Zufallsversuch" data-exp>' +
            EXP.map(x => '<button type="button" data-x="' + x.id + '">' + x.name + '</button>').join('') + '</div></div>' +
            '<p class="b-help" style="margin:-4px 0 12px" data-ev></p>' +
            '<div class="b-ctrls"><span class="b-ctrl">Durchführen:</span>' +
            [1, 10, 100, 1000].map(n => '<button type="button" class="b-btn" data-n="' + n + '">+' + int(n) + '</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-reset>Zurücksetzen</button></div>' +
            '<div class="b-canvasbox"><canvas aria-label="Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche"></canvas></div>' +
            '<div class="st-last" data-last></div>' +
            '<div class="st-sim-stats">' +
            '<div class="st-stat"><span class="st-stat-k">VERSUCHE n</span><span class="st-stat-v" data-s="n">0</span></div>' +
            '<div class="st-stat"><span class="st-stat-k">TREFFER</span><span class="st-stat-v" data-s="h">0</span></div>' +
            '<div class="st-stat"><span class="st-stat-k">REL. HÄUFIGKEIT</span><span class="st-stat-v lambda" data-s="r">–</span></div>' +
            '<div class="st-stat"><span class="st-stat-k">WAHRSCHEINLICHKEIT</span><span class="st-stat-v" data-s="p"></span></div>' +
            '</div>';
        const $ = s => box.querySelector(s);
        const canvas = box.querySelector('canvas'), ctx = canvas.getContext('2d');
        function reset() { hits = 0; hist = []; last = []; }
        function run(n) {
            for (let i = 0; i < n; i++) {
                const [hit, txt] = ex.run();
                if (hit) hits++;
                hist.push(hits / (hist.length + 1));
                last.push([hit, txt]);
            }
            if (last.length > 14) last = last.slice(-14);
            if (hist.length > 200000) { hist = hist.slice(-200000); }
        }
        function stats() {
            box.querySelectorAll('[data-x]').forEach(b => b.classList.toggle('on', b.dataset.x === ex.id));
            $('[data-ev]').innerHTML = 'Ereignis: <b>' + ex.ev + '</b>';
            $('[data-s="n"]').textContent = int(hist.length);
            $('[data-s="h"]').textContent = int(hits);
            $('[data-s="r"]').textContent = hist.length ? fmt(hits / hist.length, 4) : '–';
            $('[data-s="p"]').innerHTML = '$' + ex.ptex + ' \\approx ' + texNum(ex.p, 4) + '$';
            $('[data-last]').innerHTML = last.length ? 'Zuletzt: ' + last.map(([h, t]) =>
                '<span style="color:' + (h ? 'rgb(245,194,66)' : '#8fa3bd') + ';margin-right:10px">' + t + '</span>').join('') : 'Noch kein Versuch – starte mit +1 oder +10.';
            math($('[data-s="p"]'));
        }
        function draw() {
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.clientWidth, h = canvas.clientHeight;
            if (!w || !h) return;
            canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            const L = 50, R = 14, T = 14, B = 30, pw = w - L - R, ph = h - T - B;
            const Y = v => T + ph * (1 - v);
            ctx.font = '13px "Lab Ziffern", Raleway, sans-serif';
            ctx.textBaseline = 'middle';
            // grid and y-axis
            [0, 0.25, 0.5, 0.75, 1].forEach(v => {
                ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(L + pw, Y(v)); ctx.stroke();
                ctx.fillStyle = '#8fa3bd'; ctx.textAlign = 'right';
                ctx.fillText(fmt(v, 2), L - 8, Y(v));
            });
            const n = hist.length;
            const nMax = Math.max(10, n);
            const X = i => L + pw * (i / nMax);
            // x-axis ticks: 1-2-5 steps
            const raw = nMax / 5, mag = Math.pow(10, Math.floor(Math.log10(raw)));
            const step = [1, 2, 5, 10].map(f => f * mag).find(s => s >= raw) || raw;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            for (let t = 0; t <= nMax + 1e-9; t += step) {
                ctx.fillStyle = '#8fa3bd'; ctx.fillText(int(t), X(t), T + ph + 8);
                ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.moveTo(X(t), T); ctx.lineTo(X(t), T + ph); ctx.stroke();
            }
            ctx.textAlign = 'left'; ctx.fillStyle = '#6d8199'; ctx.fillText('n', L + pw - 10, T + ph + 8);
            // probability
            ctx.setLineDash([7, 6]); ctx.strokeStyle = 'rgb(245,194,66)'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(L, Y(ex.p)); ctx.lineTo(L + pw, Y(ex.p)); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = 'rgb(245,194,66)'; ctx.textBaseline = 'bottom'; ctx.textAlign = 'right';
            ctx.fillText('P = ' + fmt(ex.p, 4), L + pw - 4, Y(ex.p) - 4);
            if (!n) return;
            // relative frequency: one point per pixel column at most
            ctx.strokeStyle = '#7fd8ee'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            ctx.beginPath();
            const cols = Math.max(1, Math.floor(pw));
            if (n <= cols) {
                for (let i = 0; i < n; i++) { const x = X(i + 1), y = Y(hist[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
            } else {
                for (let c = 0; c <= cols; c++) {
                    const i = Math.min(n - 1, Math.floor(c / cols * (n - 1)));
                    const x = X(i + 1), y = Y(hist[i]); c ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                }
            }
            ctx.stroke();
            ctx.fillStyle = '#7fd8ee'; ctx.beginPath(); ctx.arc(X(n), Y(hist[n - 1]), 4, 0, Math.PI * 2); ctx.fill();
        }
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.dataset.x) { ex = EXP.find(x => x.id === b.dataset.x); reset(); }
            else if (b.dataset.n) run(+b.dataset.n);
            else if (b.hasAttribute('data-reset')) reset();
            else return;
            stats(); draw();
        });
        addEventListener('resize', draw);
        if (window.ResizeObserver) new ResizeObserver(draw).observe(canvas);
        stats(); draw();
    });

    /* ---------- the goat problem ---------- */
    W('ziegen', function (box) {
        const CAR = '🚗', GOAT = '🐐';
        const score = { stay: [0, 0], swap: [0, 0], simStay: [0, 0], simSwap: [0, 0] };
        let car, pick, shown, phase;
        box.innerHTML =
            '<div class="st-doors">' + [0, 1, 2].map(i => '<button type="button" class="st-door" data-door="' + i + '" aria-label="Tür ' + (i + 1) + '"><span class="st-door-no">TÜR ' + (i + 1) + '</span><span data-in></span></button>').join('') + '</div>' +
            '<p class="st-say" data-say aria-live="polite"></p>' +
            '<div class="st-say-acts" data-acts></div>' +
            '<div class="b-out" style="margin-top:16px"><div class="b-table-wrap"><table class="b-table" data-tab></table></div>' +
            '<div class="b-ctrls" style="margin:12px 0 0"><button type="button" class="b-btn" data-sim>1000 Spiele vom Rechner spielen lassen</button></div></div>';
        const $ = s => box.querySelector(s);
        const doors = Array.from(box.querySelectorAll('.st-door'));
        function newGame() {
            car = rnd(3); pick = null; shown = null; phase = 'pick';
            doors.forEach(d => { d.className = 'st-door'; d.querySelector('[data-in]').textContent = ''; d.disabled = false; });
            $('[data-say]').textContent = 'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.';
            $('[data-acts]').innerHTML = '';
        }
        function open(i) { doors[i].classList.add('open'); doors[i].querySelector('[data-in]').textContent = i === car ? CAR : GOAT; }
        function choose(i) {
            if (phase !== 'pick') return;
            pick = i; phase = 'decide';
            doors[i].classList.add('picked');
            const goats = [0, 1, 2].filter(d => d !== pick && d !== car);
            shown = goats[rnd(goats.length)];
            open(shown); doors[shown].disabled = true;
            const other = [0, 1, 2].find(d => d !== pick && d !== shown);
            $('[data-say]').textContent = 'Der Moderator weiß, wo das Auto steht, und öffnet Tür ' + (shown + 1) + ': eine Ziege. Bleibst du oder wechselst du?';
            $('[data-acts]').innerHTML = '<button type="button" class="b-btn" data-act="stay">Bei Tür ' + (pick + 1) + ' bleiben</button>' +
                '<button type="button" class="b-btn b-go" data-act="swap" data-to="' + other + '">Zu Tür ' + (other + 1) + ' wechseln</button>';
        }
        function finish(how, to) {
            const final = how === 'swap' ? to : pick;
            [0, 1, 2].forEach(open);
            doors.forEach(d => { d.disabled = true; d.classList.remove('picked'); });
            doors[final].classList.add('picked');
            const won = final === car;
            if (won) doors[final].classList.add('won');
            score[how][0]++; if (won) score[how][1]++;
            $('[data-say]').textContent = (won ? 'Gewonnen – das Auto! ' : 'Leider eine Ziege. ') + (how === 'swap' ? 'Du hast gewechselt.' : 'Du bist geblieben.');
            $('[data-acts]').innerHTML = '<button type="button" class="b-btn b-go" data-act="new">Neues Spiel</button>';
            table();
        }
        function simulate() {
            for (let k = 0; k < 1000; k++) {
                const c = rnd(3), p = rnd(3);
                score.simStay[0]++; if (p === c) score.simStay[1]++;
                score.simSwap[0]++; if (p !== c) score.simSwap[1]++;   // switching wins exactly when the first pick was wrong
            }
            table();
        }
        function row(name, s) {
            return '<tr><th>' + name + '</th><td>' + int(s[0]) + '</td><td>' + int(s[1]) + '</td><td class="b-hot">' + (s[0] ? pct(s[1] / s[0], 1) : '–') + '</td></tr>';
        }
        function table() {
            $('[data-tab]').innerHTML = '<thead><tr><th>Strategie</th><th>Spiele</th><th>Autos</th><th>Gewinnquote</th></tr></thead><tbody>' +
                row('du: bleiben', score.stay) + row('du: wechseln', score.swap) +
                row('Rechner: bleiben', score.simStay) + row('Rechner: wechseln', score.simSwap) + '</tbody>';
        }
        box.addEventListener('click', e => {
            const d = e.target.closest('.st-door');
            if (d && !d.disabled) { choose(+d.dataset.door); return; }
            const b = e.target.closest('button[data-act], button[data-sim]'); if (!b) return;
            if (b.hasAttribute('data-sim')) simulate();
            else if (b.dataset.act === 'new') newGame();
            else finish(b.dataset.act, +b.dataset.to);
        });
        newGame(); table();
    });
    /* =========================== Klasse 12: random variables and the binomial distribution =========================== */
    const B = window.Buch, div = B.div;
    function binom(n, k) { if (k < 0 || k > n) return 0; let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return c; }
    function pmf(n, p, k) { return binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }
    function cdf(n, p, k) { let s = 0; for (let i = 0; i <= Math.min(k, n); i++) s += pmf(n, p, i); return Math.min(1, s); }
    window.Buch.binom = { coef: binom, pmf, cdf };

    /* ---------- chapter opener: a quiet histogram with a lit region ---------- */
    // data-n / data-p: B(n; p) · or data-w="1,2,3,…" (weights) with data-x0 (first value): any distribution
    W('histo-hero', function (box) {
        const d = box.dataset, w = d.w ? d.w.split(',').map(Number) : null;
        const n = w ? w.length - 1 : +(d.n || 20), p = +(d.p || 0.35), x0 = +(d.x0 || 0), lo = +(d.lo || 5), hi = +(d.hi || 9), step = +(d.step || 5);
        const P = k => w ? w[k] : pmf(n, p, k);
        const Wd = 520, Ht = 240, bw = Wd / (n + 1), max = Math.max(...Array.from({ length: n + 1 }, (_, k) => P(k)));
        let bars = '';
        for (let k = 0; k <= n; k++) {
            const h = P(k) / max * (Ht - 40), on = k + x0 >= lo && k + x0 <= hi;
            bars += '<rect x="' + (k * bw + 2).toFixed(1) + '" y="' + (Ht - 22 - h).toFixed(1) + '" width="' + (bw - 4).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" style="' +
                (on ? 'fill:rgba(245,194,66,0.55);stroke:rgb(245,194,66)' : 'fill:rgba(127,216,238,0.18);stroke:rgba(127,216,238,0.6)') + ';stroke-width:1.2"/>';
            if ((k + x0) % step === 0) bars += '<text x="' + (k * bw + bw / 2).toFixed(1) + '" y="' + (Ht - 6) + '" text-anchor="middle" style="fill:#8fa3bd;font:12px Raleway,sans-serif">' + (k + x0) + '</text>';
        }
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" role="img" aria-label="Histogramm einer Binomialverteilung">' +
            '<line x1="0" y1="' + (Ht - 22) + '" x2="' + Wd + '" y2="' + (Ht - 22) + '" style="stroke:rgba(255,255,255,0.4);stroke-width:1"/>' + bars + '</svg>';
    });

    /* ---------- independence: four-field table and the unit square (mosaic) ---------- */
    W('unabhaengig', function (box) {
        const S = { a: 0.4, b: 0.5, ab: 0.3 };
        const sl = div(box, '');
        B.range(sl, { label: '$P(A)$', min: 0.05, max: 0.95, step: 0.05, value: S.a, fmt: v => fmt(v, 2), onInput: v => { S.a = v; fix(); render(); } });
        B.range(sl, { label: '$P(B)$', min: 0.05, max: 0.95, step: 0.05, value: S.b, fmt: v => fmt(v, 2), onInput: v => { S.b = v; fix(); render(); } });
        const rab = B.range(sl, { label: '$P(A \\cap B)$', min: 0, max: 0.95, step: 0.01, value: S.ab, fmt: v => fmt(v, 2), onInput: v => { S.ab = v; fix(); render(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<button type="button" class="b-btn" data-u>Unabhängig machen</button><button type="button" class="b-btn" data-x>Unvereinbar machen</button>';
        acts.querySelector('[data-u]').addEventListener('click', () => { S.ab = Math.round(S.a * S.b * 100) / 100; fix(); render(); });
        acts.querySelector('[data-x]').addEventListener('click', () => { S.ab = 0; fix(); render(); });
        const wrap = div(box, 'st-ind');
        const sq = div(wrap, 'st-ind-sq'), tab = div(wrap, 'b-table-wrap');
        const out = div(box, 'b-out');
        function fix() {                                         // P(A ∩ B) must fit into both events
            const lo = Math.max(0, S.a + S.b - 1), hi = Math.min(S.a, S.b);
            S.ab = Math.min(hi, Math.max(lo, S.ab)); rab.set(S.ab);
        }
        function render() {
            const { a, b, ab } = S, aB = a - ab, Ab = b - ab, AB = 1 - a - b + ab;
            const pBA = ab / b, pnBA = aB / (1 - b), ind = Math.abs(ab - a * b) < 0.0051;
            const Z = 300, wb = b * Z;
            // mosaic: column B (left, width P(B)) and not-B; in each column A at the bottom with the conditional probability
            const col = (x, w, pA, lab) => '<rect x="' + x + '" y="' + (Z - pA * Z) + '" width="' + w + '" height="' + pA * Z + '" style="fill:rgba(245,194,66,0.45);stroke:rgb(245,194,66)"/>' +
                '<rect x="' + x + '" y="0" width="' + w + '" height="' + (Z - pA * Z) + '" style="fill:rgba(127,216,238,0.12);stroke:rgba(127,216,238,0.6)"/>' +
                '<text x="' + (x + w / 2) + '" y="' + (Z + 18) + '" text-anchor="middle" style="fill:#cfd8e6;font:italic 14px Raleway,sans-serif">' + lab + '</text>';
            sq.innerHTML = '<svg viewBox="-30 -10 340 340" role="img" aria-label="Einheitsquadrat: Anteil von A in B und in nicht B">' + col(0, wb, pBA, 'B') + col(wb, Z - wb, pnBA, 'B̄') +
                '<line x1="0" y1="' + (Z - a * Z) + '" x2="' + Z + '" y2="' + (Z - a * Z) + '" style="stroke:#e2665a;stroke-width:1.5;stroke-dasharray:6 5"/>' +
                '<text x="-8" y="' + (Z - a * Z + 4) + '" text-anchor="end" style="fill:#e2665a;font:13px Raleway,sans-serif">P(A)</text></svg>';
            const c = x => '$' + texNum(x, 2) + '$';
            tab.innerHTML = '<table class="b-table" style="min-width:0"><tr><th></th><th>$B$</th><th>$\\overline{B}$</th><th>Summe</th></tr>' +
                '<tr><th>$A$</th><td>' + c(ab) + '</td><td>' + c(aB) + '</td><td>' + c(a) + '</td></tr>' +
                '<tr><th>$\\overline{A}$</th><td>' + c(Ab) + '</td><td>' + c(AB) + '</td><td>' + c(1 - a) + '</td></tr>' +
                '<tr><th>Summe</th><td>' + c(b) + '</td><td>' + c(1 - b) + '</td><td>$1$</td></tr></table>';
            out.innerHTML = '<p style="margin:0 0 6px">$P(A) \\cdot P(B) = ' + texNum(a, 2) + ' \\cdot ' + texNum(b, 2) + ' = ' + texNum(a * b, 4) + '$ und $P(A \\cap B) = ' + texNum(ab, 2) + '$</p>' +
                '<p style="margin:0 0 6px">$P_B(A) = \\dfrac{P(A \\cap B)}{P(B)} \\approx ' + texNum(pBA, 3) + '$ · $P_{\\overline{B}}(A) \\approx ' + texNum(pnBA, 3) + '$ · $P(A) = ' + texNum(a, 2) + '$</p>' +
                '<p style="margin:0">' + (ind ? '<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.'
                    : ab === 0 ? '<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.'
                    : '<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ' + (pBA > a ? 'nach oben' : 'nach unten') + '.') + '</p>';
            math(tab); math(out);
        }
        fix(); render(); math(sl);
    });

    /* ---------- a random variable: distribution, expected value, variance, simulation ---------- */
    W('zufallsgroesse', function (box) {
        const F = (n, d) => [n, d];
        const P = {
            wuerfel: { k: 'Würfel', x: 'Augenzahl', v: [1, 2, 3, 4, 5, 6], p: Array(6).fill(F(1, 6)), draw: () => 1 + rnd(6) },
            muenzen: { k: 'Drei Münzen', x: 'Anzahl Wappen', v: [0, 1, 2, 3], p: [F(1, 8), F(3, 8), F(3, 8), F(1, 8)], draw: () => [0, 1, 2].reduce(s => s + rnd(2), 0) },
            summe: { k: 'Augensumme', x: 'Augensumme zweier Würfel', v: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], p: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map(c => F(c, 36)), draw: () => 2 + rnd(6) + rnd(6) },
            rad: { k: 'Glücksrad', x: 'Gewinn = Auszahlung − Einsatz', pay: [0, 1, 2, 10], p: [F(1, 2), F(1, 4), F(1, 8), F(1, 8)], stake: 2, unit: ' €',
                draw() { const r = Math.random(); return (r < 0.5 ? 0 : r < 0.75 ? 1 : r < 0.875 ? 2 : 10) - this.stake; } },
            chuck: { k: 'Chuck-a-luck', x: 'Gewinn bei 1 € Einsatz', v: [-1, 1, 2, 3], p: [F(125, 216), F(75, 216), F(15, 216), F(1, 216)], unit: ' €',
                draw() { const z = 1 + rnd(6); const k = [0, 1, 2].filter(() => 1 + rnd(6) === z).length; return k ? k : -1; } }
        };
        let key = 'wuerfel', n = 0, sum = 0, last = [];
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, Object.keys(P).map(k => [k, P[k].k]), key, v => { key = v; reset(); render(); }, 'Zufallsgröße');
        const help = div(box, 'b-help');
        const stakeBox = div(box, '');
        B.range(stakeBox, { label: 'Einsatz', min: 0.5, max: 3, step: 0.25, value: P.rad.stake, fmt: v => fmt(v, 2) + ' €', onInput: v => { P.rad.stake = v; reset(); render(); } });
        const plot = new B.Plot(div(box, ''), { height: 240, yLabel: 'P', aria: 'Wahrscheinlichkeitsverteilung als Stabdiagramm' });
        const tab = div(box, 'b-table-wrap');
        const sim = div(box, '');
        sim.innerHTML = '<div class="b-ctrls" style="margin-top:12px"><span class="b-ctrl">Spielen:</span>' +
            [1, 10, 100, 1000].map(k => '<button type="button" class="b-btn" data-n="' + k + '">+' + int(k) + '</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-reset>Zurücksetzen</button></div>' +
            '<div class="st-sim-stats"><div class="st-stat"><span class="st-stat-k">SPIELE n</span><span class="st-stat-v" data-s="n">0</span></div>' +
            '<div class="st-stat"><span class="st-stat-k">MITTELWERT</span><span class="st-stat-v lambda" data-s="m">–</span></div>' +
            '<div class="st-stat"><span class="st-stat-k">ERWARTUNGSWERT</span><span class="st-stat-v" data-s="e"></span></div>' +
            '<div class="st-stat"><span class="st-stat-k">LETZTE</span><span class="st-stat-v" data-s="l" style="font-size:0.95rem">–</span></div></div>';
        const out = div(box, 'b-out');
        out.style.marginTop = '12px';
        sim.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-reset')) reset();
            else { const G = P[key], k = +b.dataset.n; for (let i = 0; i < k; i++) { const x = G.draw(); sum += x; n++; last.push(x); } last = last.slice(-8); }
            stats();
        });
        function reset() { n = 0; sum = 0; last = []; }
        function vals(G) { return G.pay ? G.pay.map(a => a - G.stake) : G.v; }
        function ev() {
            const G = P[key], v = vals(G), p = G.p.map(([a, b]) => a / b);
            const mu = v.reduce((s, x, i) => s + x * p[i], 0), V = v.reduce((s, x, i) => s + (x - mu) ** 2 * p[i], 0);
            return { G, v, p, mu, V, sd: Math.sqrt(V) };
        }
        function stats() {
            const { G, mu } = ev(), u = G.unit || '';
            box.querySelector('[data-s="n"]').textContent = int(n);
            box.querySelector('[data-s="m"]').textContent = n ? fmt(sum / n, 3) + u : '–';
            box.querySelector('[data-s="e"]').textContent = fmt(mu, 4) + u;
            box.querySelector('[data-s="l"]').textContent = last.length ? last.map(x => fmt(x, 2)).join(' · ') : '–';
        }
        function render() {
            const { G, v, p, mu, V, sd } = ev();
            stakeBox.style.display = G.pay ? '' : 'none';
            help.innerHTML = '$X$ = ' + G.x + '.' + (G.pay ? ' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten $\\tfrac12$, $\\tfrac14$, $\\tfrac18$, $\\tfrac18$.' : '') +
                (key === 'chuck' ? ' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.' : '');
            math(help);
            const lo = Math.min(...v), hi = Math.max(...v), padX = Math.max(1, (hi - lo) * 0.1);
            plot.view([lo - padX, hi + padX], [0, Math.max(...p) * 1.25]);
            plot.draw(v.map((x, i) => ({ seg: [[x, 0], [x, p[i]]], color: 'cyan', width: 5 }))
                .concat([{ pts: v.map((x, i) => [x, p[i]]), color: 'cyan', r: 4 }, { vline: mu, color: 'lambda' }, { text: 'μ', at: [mu, Math.max(...p) * 1.12], color: 'lambda' }]));
            const r4 = x => texNum(x, 4);
            tab.innerHTML = '<table class="b-table" style="min-width:0"><tr><th>$x_i$</th>' + v.map(x => '<td>' + texWrap(r4(x)) + '</td>').join('') + '</tr>' +
                '<tr><th>$P(X = x_i)$</th>' + G.p.map(([a, b]) => '<td>$\\tfrac{' + a + '}{' + b + '}$</td>').join('') + '</tr>' +
                '<tr><th>$x_i \\cdot P$</th>' + v.map((x, i) => '<td>' + texWrap(r4(x * p[i])) + '</td>').join('') + '</tr>' +
                '<tr><th>$(x_i - \\mu)^2 \\cdot P$</th>' + v.map((x, i) => '<td>' + texWrap(r4((x - mu) ** 2 * p[i])) + '</td>').join('') + '</tr></table>';
            out.innerHTML = '<p style="margin:0 0 6px">Erwartungswert: $E(X) = \\mu = \\sum x_i \\cdot P(X = x_i) \\approx ' + r4(mu) + '$' +
                (G.unit ? (Math.abs(mu) < 1e-9 ? ' · Das Spiel ist <b>fair</b>.' : mu < 0 ? ' · Auf lange Sicht <b>verlierst</b> du im Mittel ' + texWrap(r4(-mu)) + ' € pro Spiel.' : ' · Auf lange Sicht <b>gewinnst</b> du im Mittel ' + texWrap(r4(mu)) + ' € pro Spiel.') : '') + '</p>' +
                '<p style="margin:0">Varianz: $V(X) = \\sum (x_i - \\mu)^2 \\cdot P(X = x_i) \\approx ' + r4(V) + '$ · Standardabweichung: $\\sigma = \\sqrt{V(X)} \\approx ' + r4(sd) + '$</p>';
            math(tab); math(out);
            stats();
        }
        const texWrap = t => '$' + t + '$';
        render();
    });

    /* ---------- the binomial distribution: histogram, single and cumulative probabilities ---------- */
    W('binomial', function (box) {
        const S = { n: 20, p: 0.3, mode: 'eq', k: 6, a: 4, b: 8 };
        const sl = div(box, '');
        B.range(sl, { label: 'Anzahl der Versuche $n$', min: 1, max: 100, step: 1, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; clamp(); render(); } });
        B.range(sl, { label: 'Trefferwahrscheinlichkeit $p$', min: 0.01, max: 0.99, step: 0.01, value: S.p, fmt: v => fmt(v, 2), onInput: v => { S.p = v; render(); } });
        const ctl = div(box, 'b-ctrls');
        B.seg(ctl, [['eq', '$P(X = k)$'], ['le', '$P(X \\le k)$'], ['ge', '$P(X \\ge k)$'], ['ab', '$P(a \\le X \\le b)$']], S.mode, v => { S.mode = v; render(); }, 'Was wird berechnet?');
        math(ctl);
        const kBox = div(box, ''), abBox = div(box, '');
        const rk = B.range(kBox, { label: '$k$', min: 0, max: S.n, step: 1, value: S.k, fmt: v => String(v), onInput: v => { S.k = v; render(); } });
        const ra = B.range(abBox, { label: '$a$', min: 0, max: S.n, step: 1, value: S.a, fmt: v => String(v), onInput: v => { S.a = Math.min(v, S.b); render(); } });
        const rb = B.range(abBox, { label: '$b$', min: 0, max: S.n, step: 1, value: S.b, fmt: v => String(v), onInput: v => { S.b = Math.max(v, S.a); render(); } });
        const plot = new B.Plot(div(box, ''), { height: 280, yLabel: 'P', xLabel: 'k', aria: 'Histogramm der Binomialverteilung' });
        const out = div(box, 'b-out');
        function clamp() {
            [rk, ra, rb].forEach(r => { r.input.max = S.n; });
            S.k = Math.min(S.k, S.n); S.a = Math.min(S.a, S.n); S.b = Math.min(S.b, S.n);
            rk.set(S.k); ra.set(S.a); rb.set(S.b);
        }
        function render() {
            const { n, p, mode } = S, q = 1 - p, mu = n * p, sd = Math.sqrt(n * p * q);
            kBox.style.display = mode === 'ab' ? 'none' : ''; abBox.style.display = mode === 'ab' ? '' : 'none';
            const inSel = k => mode === 'eq' ? k === S.k : mode === 'le' ? k <= S.k : mode === 'ge' ? k >= S.k : k >= S.a && k <= S.b;
            const on = [], off = [];
            let max = 0, x0 = n, x1 = 0;
            for (let k = 0; k <= n; k++) {
                const P = pmf(n, p, k); max = Math.max(max, P);
                if (P > 1e-4) { x0 = Math.min(x0, k); x1 = Math.max(x1, k); }
                (inSel(k) ? on : off).push([k - 0.42, k + 0.42, P]);
            }
            const sel = [S.k, S.a, S.b].filter(v => v <= n);
            x0 = Math.min(x0, ...sel); x1 = Math.max(x1, ...sel);
            plot.view([x0 - 0.8, x1 + 0.8], [0, max * 1.2]);
            plot.draw([{ rects: off, color: 'cyan' }, { rects: on, color: 'lambda' }, { vline: mu, color: 'red' }, { text: 'μ', at: [mu, max * 1.1], color: 'red' },
                { vline: mu - sd }, { vline: mu + sd }]);
            const pt = texNum(p, 2), qt = texNum(q, 2), k = S.k;
            let tex;
            if (mode === 'eq') tex = 'P(X = ' + k + ') = \\binom{' + n + '}{' + k + '} \\cdot ' + pt + '^{' + k + '} \\cdot ' + qt + '^{' + (n - k) + '} \\approx ' + texNum(pmf(n, p, k), 4);
            else if (mode === 'le') tex = 'P(X \\le ' + k + ') = \\sum_{i=0}^{' + k + '} \\binom{' + n + '}{i} \\cdot ' + pt + '^{i} \\cdot ' + qt + '^{' + n + '-i} \\approx ' + texNum(cdf(n, p, k), 4);
            else if (mode === 'ge') tex = 'P(X \\ge ' + k + ') = 1 - P(X \\le ' + (k - 1) + ') \\approx ' + texNum(k ? 1 - cdf(n, p, k - 1) : 1, 4);
            else tex = 'P(' + S.a + ' \\le X \\le ' + S.b + ') = P(X \\le ' + S.b + ') - P(X \\le ' + (S.a - 1) + ') \\approx ' + texNum(cdf(n, p, S.b) - (S.a ? cdf(n, p, S.a - 1) : 0), 4);
            out.innerHTML = '<p style="margin:0 0 6px">$X$ ist binomialverteilt mit $n = ' + n + '$ und $p = ' + pt + '$.</p>' +
                '<p style="margin:0 0 6px">$' + tex + '$</p>' +
                '<p style="margin:0">Erwartungswert $\\mu = n \\cdot p = ' + texNum(mu, 2) + '$ · Standardabweichung $\\sigma = \\sqrt{n \\cdot p \\cdot (1 - p)} \\approx ' + texNum(sd, 3) + '$</p>';
            math(out);
        }
        render();
    });

    /* ---------- Bernoulli chain as a tree: all paths with exactly k hits ---------- */
    W('bernoulli-baum', function (box) {
        const S = { n: 3, p: 0.3, k: 1 };
        const ctl = div(box, 'b-ctrls');
        ctl.innerHTML = '<span class="b-ctrl">Stufen $n$:</span>';
        B.seg(ctl, [[2, '2'], [3, '3'], [4, '4']], S.n, v => { S.n = +v; S.k = Math.min(S.k, S.n); kSeg(); render(); }, 'Anzahl der Stufen');
        const kc = div(box, 'b-ctrls');
        B.range(div(box, ''), { label: 'Trefferwahrscheinlichkeit $p$', min: 0.05, max: 0.95, step: 0.05, value: S.p, fmt: v => fmt(v, 2), onInput: v => { S.p = v; render(); } });
        const tree = div(box, 'b-svgbox b-scroll');
        const out = div(box, 'b-out');
        function kSeg() {
            kc.innerHTML = '<span class="b-ctrl">Genau $k$ Treffer:</span>';
            B.seg(kc, Array.from({ length: S.n + 1 }, (_, k) => [k, String(k)]), S.k, v => { S.k = +v; render(); }, 'Anzahl der Treffer');
            math(kc);
        }
        function render() {
            const { n, p, k } = S, ps = fmt(p, 2), qs = fmt(1 - p, 2);
            const build = (key, d) => d === n ? [] : [['T', ps, 'r'], ['N', qs, 'b']].map(([L, e, cls]) => ({ key: key + L, cls, label: L, edge: e, children: build(key + L, d + 1) }));
            const hits = key => (key.match(/T/g) || []).length;
            const on = key => { const t = hits(key); return t <= k && k - t <= n - key.length; };
            tree.innerHTML = treeSVG({ key: '', children: build('', 0) }, {
                stepX: n === 4 ? 105 : 130, spacing: n === 4 ? 34 : 44, leafW: 118, minW: 0, aria: 'Baumdiagramm einer Bernoulli-Kette',
                on: key => key.length === n ? hits(key) === k : on(key),
                leaf: (node, w) => '<text x="10" y="20">' + node.key + '</text><text class="st-leaf-p" x="' + (w - 10) + '" y="20" text-anchor="end">' + fmt(Math.pow(p, hits(node.key)) * Math.pow(1 - p, n - hits(node.key)), 4) + '</text>'
            });
            const c = binom(n, k), pathP = Math.pow(p, k) * Math.pow(1 - p, n - k);
            out.innerHTML = '<p style="margin:0 0 6px">Pfade mit genau ' + k + ' Treffern: $\\binom{' + n + '}{' + k + '} = ' + c + '$ · jeder hat die Wahrscheinlichkeit $' + texNum(p, 2) + '^{' + k + '} \\cdot ' + texNum(1 - p, 2) + '^{' + (n - k) + '} \\approx ' + texNum(pathP, 4) + '$</p>' +
                '<p style="margin:0">Formel von Bernoulli: $P(X = ' + k + ') = \\binom{' + n + '}{' + k + '} \\cdot p^{' + k + '} \\cdot (1 - p)^{' + (n - k) + '} \\approx ' + texNum(c * pathP, 4) + '$</p>';
            math(out);
        }
        kSeg(); render(); math(ctl);
    });
    /* =========================== Klasse 13: samples and significance tests =========================== */
    /* ---------- many samples from one population: how much do the sample shares scatter? ---------- */
    W('stichprobe', function (box) {
        const S = { p: 0.3, n: 50, shares: [], last: null };
        const sl = div(box, '');
        B.range(sl, { label: 'Anteil in der Grundgesamtheit $p$', min: 0.05, max: 0.95, step: 0.05, value: S.p, fmt: v => fmt(v, 2), onInput: v => { S.p = v; S.shares = []; S.last = null; render(); } });
        B.range(sl, { label: 'Stichprobenumfang $n$', min: 10, max: 500, step: 10, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; S.shares = []; S.last = null; render(); } });
        const acts = div(box, 'b-ctrls');
        acts.innerHTML = '<span class="b-ctrl">Stichproben ziehen:</span>' + [1, 10, 100, 1000].map(k => '<button type="button" class="b-btn" data-k="' + k + '">+' + int(k) + '</button>').join('') +
            '<button type="button" class="b-btn b-hintbtn" data-reset>Zurücksetzen</button>';
        const plot = new B.Plot(div(box, ''), { height: 240, x: [0, 1], y: [0, 1], xLabel: 'h', yLabel: '', aria: 'Verteilung der relativen Häufigkeiten vieler Stichproben' });
        const out = div(box, 'b-out');
        acts.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-reset')) { S.shares = []; S.last = null; }
            else for (let i = 0; i < +b.dataset.k; i++) { let h = 0; for (let j = 0; j < S.n; j++) if (Math.random() < S.p) h++; S.last = h / S.n; S.shares.push(S.last); }
            render();
        });
        function render() {
            const m = S.shares.length, bin = 0.02, bins = new Array(50).fill(0);
            S.shares.forEach(h => { bins[Math.min(49, Math.floor(h / bin + 1e-9))]++; });
            const max = Math.max(1, ...bins);
            const sdT = Math.sqrt(S.p * (1 - S.p) / S.n);
            plot.view([0, 1], [0, 1.15]);
            const rects = bins.map((c, i) => [i * bin + 0.002, (i + 1) * bin - 0.002, c / max]).filter(r => r[2] > 0);
            plot.draw([{ rects, color: 'cyan' }, { vline: S.p, color: 'red' }, { text: 'p', at: [S.p, 1.05], color: 'red' }].concat(S.last != null ? [{ pts: [[S.last, 0]], color: 'lambda', r: 6 }] : []));
            const mean = m ? S.shares.reduce((a, b) => a + b, 0) / m : NaN;
            const sd = m > 1 ? Math.sqrt(S.shares.reduce((a, h) => a + (h - mean) ** 2, 0) / (m - 1)) : NaN;
            out.innerHTML = '<p style="margin:0 0 6px">' + (m ? int(m) + ' Stichproben vom Umfang ' + S.n + ' · letzte: $h = ' + texNum(S.last, 3) + '$ (gold)' : 'Noch keine Stichprobe gezogen.') + '</p>' +
                '<p style="margin:0">' + (m > 1 ? 'Mittelwert der $h$: $' + texNum(mean, 3) + '$ · Standardabweichung der $h$: $' + texNum(sd, 4) + '$ · ' : '') +
                'Theorie: $\\sqrt{\\tfrac{p(1-p)}{n}} \\approx ' + texNum(sdT, 4) + '$. Viermal so großes $n$ halbiert die Streuung.</p>';
            math(out);
        }
        render(); math(sl);
    });

    /* ---------- significance test for a binomial proportion, errors of the first and second kind ---------- */
    W('signifikanztest', function (box) {
        const S = { n: 50, p0: 0.5, alpha: 0.05, side: 'r', k: 31, beta: false, p1: 0.65 };
        const sl = div(box, '');
        B.range(sl, { label: 'Stichprobenumfang $n$', min: 10, max: 200, step: 5, value: S.n, fmt: v => String(v), onInput: v => { S.n = v; clamp(); render(); } });
        B.range(sl, { label: 'Nullhypothese $p_0$', min: 0.05, max: 0.95, step: 0.05, value: S.p0, fmt: v => fmt(v, 2), onInput: v => { S.p0 = v; render(); } });
        const c1 = div(box, 'b-ctrls');
        c1.innerHTML = '<span class="b-ctrl">Test:</span>';
        B.seg(c1, [['l', 'linksseitig'], ['r', 'rechtsseitig'], ['z', 'zweiseitig']], S.side, v => { S.side = v; render(); }, 'Art des Tests');
        const c2 = div(box, 'b-ctrls');
        c2.innerHTML = '<span class="b-ctrl">Signifikanzniveau $\\alpha$:</span>';
        B.seg(c2, [['0.01', '1 %'], ['0.05', '5 %'], ['0.1', '10 %']], '0.05', v => { S.alpha = +v; render(); }, 'Signifikanzniveau');
        const rk = B.range(div(box, ''), { label: 'Beobachtete Trefferzahl $k$', min: 0, max: S.n, step: 1, value: S.k, fmt: v => String(v), onInput: v => { S.k = v; render(); } });
        const c3 = div(box, 'b-ctrls');
        c3.innerHTML = '<label class="b-ctrl"><input type="checkbox"> Fehler 2. Art zeigen: wahres $p$ =</label>';
        const pBox = div(c3, '');
        pBox.style.flex = '1 1 220px';
        B.range(pBox, { label: '', min: 0.05, max: 0.95, step: 0.05, value: S.p1, fmt: v => fmt(v, 2), onInput: v => { S.p1 = v; render(); } });
        c3.querySelector('input').addEventListener('change', e => { S.beta = e.target.checked; render(); });
        const plot = new B.Plot(div(box, ''), { height: 290, yLabel: 'P', xLabel: 'k', aria: 'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich' });
        const out = div(box, 'b-out');
        function clamp() { rk.input.max = S.n; S.k = Math.min(S.k, S.n); rk.set(S.k); }
        // rejection region: right {k ≥ r}, left {k ≤ l}, both: α/2 on each side
        function region() {
            const { n, p0, alpha, side } = S;
            let l = -1, r = n + 1;
            const a = side === 'z' ? alpha / 2 : alpha;
            if (side !== 'r') { while (l + 1 <= n && cdf(n, p0, l + 1) <= a) l++; }
            if (side !== 'l') { while (r - 1 >= 0 && 1 - cdf(n, p0, r - 2) <= a) r--; }
            return { l, r };
        }
        function render() {
            const { n, p0, k } = S, { l, r } = region();
            const inA = x => x <= l || x >= r;
            const acc = [], rej = [], alt = [];
            let max = 0, x0 = n, x1 = 0;
            for (let x = 0; x <= n; x++) {
                const P = pmf(n, p0, x); max = Math.max(max, P);
                if (P > 1e-4 || (S.beta && pmf(n, S.p1, x) > 1e-4)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
                (inA(x) ? rej : acc).push([x - 0.4, x + 0.4, P]);
                if (S.beta) { const Q = pmf(n, S.p1, x); max = Math.max(max, Q); alt.push([x - 0.25, x + 0.25, Q]); }
            }
            x0 = Math.min(x0, k); x1 = Math.max(x1, k);
            plot.view([x0 - 1, x1 + 1], [0, max * 1.2]);
            plot.draw([{ rects: acc, color: 'cyan' }, { rects: rej, color: 'red' }].concat(S.beta ? [{ rects: alt, color: 'violet' }] : [])
                .concat([{ pts: [[k, 0]], color: 'lambda', r: 7 }, { text: 'k', at: [k, 0], color: 'lambda', dy: -10 }]));
            const alphaReal = (l >= 0 ? cdf(n, p0, l) : 0) + (r <= n ? 1 - cdf(n, p0, r - 1) : 0);
            let beta = 0;
            if (S.beta) for (let x = l + 1; x < r; x++) beta += pmf(n, S.p1, x);
            const H1 = S.side === 'l' ? 'p < ' + texNum(p0, 2) : S.side === 'r' ? 'p > ' + texNum(p0, 2) : 'p \\neq ' + texNum(p0, 2);
            const regTex = S.side === 'l' ? '\\{0, \\ldots, ' + l + '\\}' : S.side === 'r' ? '\\{' + r + ', \\ldots, ' + n + '\\}' : '\\{0, \\ldots, ' + l + '\\} \\cup \\{' + r + ', \\ldots, ' + n + '\\}';
            const reject = inA(k);
            out.innerHTML = '<p style="margin:0 0 6px">$H_0\\colon p = ' + texNum(p0, 2) + '$ gegen $H_1\\colon ' + H1 + '$ · $n = ' + n + '$, $\\alpha = ' + texNum(S.alpha * 100, 0) + '\\,\\%$</p>' +
                '<p style="margin:0 0 6px">Ablehnungsbereich (rot): $\\overline{A} = ' + regTex + '$ · tatsächliche Irrtumswahrscheinlichkeit $\\approx ' + texNum(alphaReal, 4) + '$</p>' +
                '<p style="margin:0 0 6px">Beobachtet $k = ' + k + '$: ' + (reject ? '<b>$H_0$ wird abgelehnt.</b> Das Ergebnis ist signifikant.' : '<b>$H_0$ wird nicht abgelehnt.</b> Das beweist aber nicht, dass $H_0$ stimmt.') + '</p>' +
                (S.beta ? '<p style="margin:0">Ist in Wahrheit $p = ' + texNum(S.p1, 2) + '$ (violett), wird $H_0$ mit $\\beta \\approx ' + texNum(beta, 4) + '$ fälschlich beibehalten (Fehler 2. Art).</p>' : '');
            math(out);
        }
        render(); math(sl); math(c2); math(c3);
    });
})();
