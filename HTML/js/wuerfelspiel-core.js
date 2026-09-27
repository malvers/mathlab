// Würfelspiel (wuerfelspiel.html), part 1 of 9: sidebar, i18n helper, dbg, branding and UI init, canvas, palette, presets, fractions.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        function toggleSidebar() {
            const panel = document.getElementById('side-panel');
            panel.classList.toggle('collapsed');
            if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
                CyberLeftChrome.publishResolvedScale();
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                if (typeof init === 'function') init();
                if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
                    CyberLeftChrome.publishResolvedScale();
                }
            }, 400);
        }

        // CyberI18n.get() returns the key itself when it is missing - only getOr() gives a fallback.
        // Placeholders like {a} are filled in the translation and in the German fallback alike.
        const T = (k, fb, rep) => {
            let s = (typeof CyberI18n !== 'undefined' && CyberI18n.getOr)
                ? CyberI18n.getOr('wuerfel.' + k, fb) : fb;
            if (rep) Object.keys(rep).forEach(p => { s = s.split('{' + p + '}').join(rep[p]); });
            return s;
        };

        function dbg(m) { try { if (window.DebugWindow) DebugWindow.log('🎲 ' + m); } catch (e) { } }

        CyberBranding.init({
            useExternalStyles: true,
            title: CyberI18n.get('ui.coach_title'),
            subtitle: T('subtitle', 'Das Würfelspiel'),
        });
        CyberUI.init();

        if (window.CyberLeftChrome && typeof CyberLeftChrome.configure === 'function') {
            CyberLeftChrome.configure({ viewportOnlyZoom: true });
        }

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('canvas-container');

        /* ------------------------------------------------------------ Colours */
        // House palette: lambda orange, upsilon red, phi green
        const C = {
            orange: 'rgb(245, 194, 66)',
            red: 'rgb(176, 36, 24)',
            green: 'rgb(121, 158, 49)',
            greenHi: 'rgb(160, 212, 70)',
            redHi: '#e06a5e',
            cyan: '#9de8ff',
            neon: '#00d2ff',
            text: '#dbe8f7',
            soft: '#9fb4d6',
            branch: 'rgba(157, 232, 255, 0.8)',
            mutedLine: 'rgba(159, 180, 214, 0.3)',
            plate: 'rgba(8, 18, 38, 0.72)',
            plateEdge: 'rgba(0, 210, 255, 0.22)',
            labelBg: 'rgba(6, 14, 30, 0.9)'
        };

        // Equal numbers share a colour. Same order as the deck figures:
        // Lena 3 orange, 5 green, 7 blue - Mia 4 blue, 6 red.
        const TINTS = {
            A: ['245, 194, 66', '121, 158, 49', '90, 150, 255', '180, 120, 255', '0, 210, 255', '255, 120, 170'],
            B: ['90, 150, 255', '224, 106, 94', '180, 120, 255', '0, 210, 255', '245, 194, 66', '121, 158, 49']
        };

        /* ------------------------------------------------------------- Dice */
        // Faces in net order: three on top, then the column below the middle one.
        // Opposite faces: top0-top2, top1-col1, col0-col2.
        const OPP = [2, 4, 0, 5, 1, 3];

        const PRESETS = {
            deck: { label: 'Deck: Lena gegen Mia', a: { name: 'Lena', faces: [3, 5, 3, 7, 5, 7] }, b: { name: 'Mia', faces: [4, 6, 4, 4, 6, 4] } },
            zwilling: { label: 'Zwillingsaufgabe: Paul gegen Jonas', a: { name: 'Paul', faces: [1, 5, 1, 6, 5, 6] }, b: { name: 'Jonas', faces: [2, 4, 2, 4, 2, 4] } },
            normal: { label: 'Zwei normale Spielwürfel', a: { name: 'Anna', faces: [2, 1, 5, 3, 6, 4] }, b: { name: 'Ben', faces: [2, 1, 5, 3, 6, 4] } },
            efronAB: { label: 'Efron: A gegen B', efron: 'AB' },
            efronBC: { label: 'Efron: B gegen C', efron: 'BC' },
            efronCD: { label: 'Efron: C gegen D', efron: 'CD' },
            efronDA: { label: 'Efron: D gegen A', efron: 'DA' }
        };

        // Bradley Efron's four non-transitive dice: A beats B, B beats C, C beats D, D beats A - each with 2/3
        const EFRON = { A: [4, 0, 4, 4, 0, 4], B: [3, 3, 3, 3, 3, 3], C: [2, 6, 2, 2, 6, 2], D: [5, 1, 5, 1, 5, 1] };

        function presetDice(id) {
            const p = PRESETS[id];
            if (p.efron) {
                const x = p.efron[0], y = p.efron[1];
                return { a: { name: 'Würfel ' + x, faces: EFRON[x].slice() }, b: { name: 'Würfel ' + y, faces: EFRON[y].slice() } };
            }
            return { a: { name: p.a.name, faces: p.a.faces.slice() }, b: { name: p.b.name, faces: p.b.faces.slice() } };
        }

        // German genitive for the die titles: Lenas, Jonas', but "Würfel A" stays as it is
        const isDieName = n => /^Würfel /.test(n);
        const gen = n => isDieName(n) ? n : (/[sxzß]$/.test(n) ? n + '’' : n + 's');
        const dieTitle = n => isDieName(n) ? n : gen(n) + ' Würfel';
        const WORDS = ['null', 'eine', 'zwei', 'drei', 'vier', 'fünf', 'sechs'];
        const WORDS_M = ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs'];

        /* ------------------------------------------------------------ Fractions */
        const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
        const F = (p, q) => { if (p === 0) return { p: 0, q: 1 }; const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };
        const addF = (x, y) => F(x.p * y.q + y.p * x.q, x.q * y.q);
        const mulF = (x, y) => F(x.p * y.p, x.q * y.q);
        const valF = f => f.p / f.q;
        const eqF = (x, y) => x.p === y.p && x.q === y.q;

        // TeX of a fraction: 1 stays 1, 2/9 becomes \frac{2}{9}
        const fr = f => f.q === 1 ? String(f.p) : '\\frac{' + f.p + '}{' + f.q + '}';

        // German decimals in TeX: 55{,}6
        function decTex(x, digits) {
            return x.toFixed(digits).replace('.', '{,}');
        }

        // "\approx 55{,}6\,\%" or "= 50\,\%" when one decimal is exact
        function pctEq(f) {
            const exact = (f.p * 1000) % f.q === 0;
            let s = decTex(100 * valF(f), 1);
            if (exact) s = s.replace(/\{,\}0$/, '');
            return (exact ? '= ' : '\\approx ') + s + '\\,\\%';
        }

        function pctTex(f) {
            return pctEq(f).replace(/^(= |\\approx )/, '');
        }

        // Big counts get a thin space every three digits: 12\,345
        function intTex(n) {
            const s = String(n);
            return s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
        }

        /* ---------------------------------------------------------------- Model */
        function groups(faces) {
            const m = new Map();
            faces.forEach(v => m.set(v, (m.get(v) || 0) + 1));
            return [...m.entries()].sort((x, y) => x[0] - y[0]).map(([v, c], i) => ({ v, c, i, f: F(c, 6) }));
        }

        let modelCache = { key: '', m: null };

        function buildModel(dice) {
            const key = JSON.stringify(dice);
            if (modelCache.key === key) return modelCache.m;
            const GA = groups(dice.a.faces), GB = groups(dice.b.faces);
            const paths = [];
            GA.forEach((ga, i) => GB.forEach((gb, j) => {
                const w = ga.v > gb.v ? 'A' : (ga.v < gb.v ? 'B' : 'D');
                paths.push({ i, j, k: paths.length, a: ga.v, b: gb.v, ca: ga.c, cb: gb.c, n36: ga.c * gb.c, f: F(ga.c * gb.c, 36), w });
            }));
            const n36 = w => paths.filter(p => p.w === w).reduce((s, p) => s + p.n36, 0);
            const m = {
                key, A: dice.a, B: dice.b, GA, GB, paths,
                winA: paths.filter(p => p.w === 'A'),
                winB: paths.filter(p => p.w === 'B'),
                draws: paths.filter(p => p.w === 'D'),
                nA: n36('A'), nB: n36('B'), nD: n36('D')
            };
            m.pA = F(m.nA, 36);
            m.pB = F(m.nB, 36);
            m.pD = F(m.nD, 36);
            modelCache = { key, m };
            return m;
        }

        // A sum of path probabilities as TeX pieces, one piece per term so long sums can wrap.
        // Up to three terms are written out (2/9 + 2/9 + 1/9), longer sums are grouped (4 · 1/6).
        function sumPieces(fracs) {
            if (!fracs.length) return ['0'];
            if (fracs.length <= 3) return fracs.map(fr);
            const order = [], count = new Map();
            fracs.forEach(f => {
                const k = f.p + '/' + f.q;
                if (!count.has(k)) { count.set(k, 0); order.push(f); }
                count.set(k, count.get(k) + 1);
            });
            return order.map(f => {
                const c = count.get(f.p + '/' + f.q);
                return c === 1 ? fr(f) : c + ' \\cdot ' + fr(f);
            });
        }

        const sumF = fracs => fracs.reduce((s, f) => addF(s, f), F(0, 1));

        // "$\frac29 +$ $\frac29 +$ $\frac19 =$ $\frac59$" - operators trail their term so a line
        // break never leaves a lonely "+" at the start of a line
        function sumUnits(fracs, opts = {}) {
            const pieces = sumPieces(fracs);
            const res = opts.result || sumF(fracs);
            const out = pieces.map((p, i) => '$' + p + (i < pieces.length - 1 ? ' +' : '') + '$');
            const single = fracs.length === 1 && pieces[0] === fr(res);
            if (!single) {
                out[out.length - 1] = out[out.length - 1].replace(/\$$/, ' =$');
                out.push('$' + fr(res) + '$');
            }
            if (opts.pct) out[out.length - 1] = out[out.length - 1].replace(/\$$/, ' ' + pctEq(res) + '$');
            return out.join(' ');
        }

        /* ----------------------------------------------------------- Canvas TeX */
