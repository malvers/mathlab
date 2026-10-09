/* buch-stochastik.js — interactive widgets for the stochastics chapters of the textbook (js/buch.js).
 *   baum-hero        decorative tree for the chapter opener
 *   baum             tree-diagram workshop: urn, with/without replacement, 2 or 3 draws, click path ends → event
 *   schnelltest      rapid test: sliders → four-field table and tree, share of the positives who are ill
 *   vierfeld-trainer fill in the missing cells of a four-field table, new table on request
 *   simulation       relative frequency over n against the probability (law of large numbers)
 *   ziegen           the goat problem: play it, or let the computer play a thousand times
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
})();
