// Würfelspiel (wuerfelspiel.html), part 2 of 9: the TeX subset drawn with the KaTeX fonts.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // A small TeX subset drawn with KaTeX's own fonts, so every number on the stage looks
        // exactly like the KaTeX in the coach box: digits, italic letters, \frac, \cdot,
        // \approx, \mid, \text{}, \mathbf{}, {,} and the usual spaces.
        const SYM = {
            cdot: '⋅', approx: '≈', mid: '∣', neq: '≠', le: '≤', ge: '≥', times: '×', to: '→',
            ldots: '…', lt: '<', gt: '>', pm: '±', Rightarrow: '⇒'
        };
        const REL = new Set(['=', '≈', '≠', '≤', '≥', '<', '>', '→', '⇒', '∣']);
        const BIN = new Set(['+', '−', '⋅', '×', '±']);

        function texParse(src) {
            const out = [];
            let i = 0;
            const readGroup = () => {
                while (src[i] === ' ') i++;
                if (src[i] !== '{') return src[i++] || '';
                let depth = 0;
                const start = i + 1;
                for (; i < src.length; i++) {
                    if (src[i] === '{') depth++;
                    else if (src[i] === '}' && --depth === 0) { i++; return src.slice(start, i - 1); }
                }
                return src.slice(start);
            };
            const ch = (s, font, cls) => out.push({ k: 'ch', s, font, cls });
            while (i < src.length) {
                const c = src[i];
                if (c === ' ') { i++; continue; }
                if (c === '\\') {
                    const mm = /^\\([a-zA-Z]+|.)/.exec(src.slice(i));
                    const name = mm ? mm[1] : '';
                    i += mm ? mm[0].length : 1;
                    if (name === 'frac' || name === 'tfrac' || name === 'dfrac') {
                        const n = readGroup(), d = readGroup();
                        out.push({ k: 'frac', num: texParse(n), den: texParse(d) });
                    } else if (name === 'text') {
                        out.push({ k: 'text', s: readGroup(), cls: 'ord' });
                    } else if (name === 'mathbf') {
                        const mark = list => list.forEach(a => { a.bold = true; if (a.k === 'frac') { mark(a.num); mark(a.den); } });
                        const inner = texParse(readGroup());
                        mark(inner);
                        inner.forEach(a => out.push(a));
                    } else if (name === ',') out.push({ k: 'space', em: 0.167 });
                    else if (name === ':') out.push({ k: 'space', em: 0.222 });
                    else if (name === ';') out.push({ k: 'space', em: 0.278 });
                    else if (name === 'quad') out.push({ k: 'space', em: 1 });
                    else if (name === '%') ch('%', 'main', 'ord');
                    else if (SYM[name]) {
                        const s = SYM[name];
                        ch(s, 'main', REL.has(s) ? 'rel' : (BIN.has(s) ? 'bin' : 'ord'));
                    } else ch(name, 'main', 'ord');
                    continue;
                }
                if (c === '{') {
                    // plain group - {,} is a decimal comma without the space after punctuation
                    texParse(readGroup()).forEach(a => { if (a.cls === 'punct') a.cls = 'ord'; out.push(a); });
                    continue;
                }
                i++;
                if (/[0-9.]/.test(c)) ch(c, 'main', 'ord');
                else if (/[A-Za-z]/.test(c)) ch(c, 'math', 'ord');
                else if (c === '-') ch('−', 'main', 'bin');
                else if (c === '+') ch('+', 'main', 'bin');
                else if (c === '=' || c === '<' || c === '>') ch(c, 'main', 'rel');
                else if (c === ',' || c === ';') ch(c, 'main', 'punct');
                else if (c === '(' || c === '[') ch(c, 'main', 'open');
                else if (c === ')' || c === ']') ch(c, 'main', 'close');
                else ch(c, 'main', REL.has(c) ? 'rel' : (BIN.has(c) ? 'bin' : 'ord'));
            }
            return out;
        }

        function texFont(a, size) {
            const w = a.bold ? 'bold ' : '';
            if (a.k === 'ch' && a.font === 'math') return w + 'italic ' + size + 'px KaTeX_Math, "Times New Roman", serif';
            return w + size + 'px KaTeX_Main, "Times New Roman", serif';
        }

        function layoutAtoms(atoms, size) {
            const items = [];
            let x = 0, asc = 0.7 * size, desc = 0.05 * size, prev = null;
            atoms.forEach(a => {
                if (a.k === 'space') { x += a.em * size; return; }
                let cls = a.k === 'frac' ? 'ord' : (a.cls || 'ord');
                if (cls === 'bin' && (!prev || prev === 'bin' || prev === 'rel' || prev === 'open' || prev === 'punct')) cls = 'ord';
                if (prev) {
                    if ((cls === 'rel' && prev !== 'open') || (prev === 'rel' && cls !== 'close')) x += 0.278 * size;
                    else if (cls === 'bin' || prev === 'bin') x += 0.222 * size;
                    else if (prev === 'punct') x += 0.167 * size;
                }
                if (a.k === 'frac') {
                    const fs = size * 0.8;
                    const N = layoutAtoms(a.num, fs), D = layoutAtoms(a.den, fs);
                    const pad = 0.12 * size, t = Math.max(1, 0.055 * size), gap = 0.14 * size, axis = -0.25 * size;
                    const w = Math.max(N.w, D.w) + 2 * pad;
                    const nb = axis - t / 2 - gap - N.desc;
                    const db = axis + t / 2 + gap + D.asc;
                    items.push({ kind: 'frac', x, w, N, D, nb, db, t, axis, pad });
                    asc = Math.max(asc, -(nb - N.asc));
                    desc = Math.max(desc, db + D.desc);
                    x += w;
                } else {
                    const font = texFont(a, size);
                    ctx.font = font;
                    const w = ctx.measureText(a.s).width;
                    items.push({ kind: 'ch', x, s: a.s, font });
                    if (/[()\[\]∣|gjpqy,;]/.test(a.s)) desc = Math.max(desc, 0.25 * size);
                    if (/[()\[\]∣|]/.test(a.s)) asc = Math.max(asc, 0.75 * size);
                    x += w;
                }
                prev = cls;
            });
            return { items, w: x, asc, desc };
        }

        const texCache = new Map();

        function texLayout(src, size) {
            const key = size + '|' + src;
            let L = texCache.get(key);
            if (!L) {
                L = layoutAtoms(texParse(src), size);
                if (texCache.size > 4000) texCache.clear();
                texCache.set(key, L);
            }
            return L;
        }

        function drawLayout(L, x0, base, color) {
            ctx.textBaseline = 'alphabetic';
            ctx.textAlign = 'left';
            L.items.forEach(it => {
                if (it.kind === 'ch') {
                    ctx.font = it.font;
                    ctx.fillStyle = color;
                    ctx.fillText(it.s, x0 + it.x, base);
                } else {
                    drawLayout(it.N, x0 + it.x + (it.w - it.N.w) / 2, base + it.nb, color);
                    drawLayout(it.D, x0 + it.x + (it.w - it.D.w) / 2, base + it.db, color);
                    ctx.fillStyle = color;
                    ctx.fillRect(x0 + it.x + it.pad * 0.5, base + it.axis - it.t / 2, it.w - it.pad, it.t);
                }
            });
        }

        // Draw TeX at (x, y). align: left | center | right, valign: baseline | middle | top
        function tex(src, x, y, size, color, o = {}) {
            const L = texLayout(String(src), size);
            let x0 = x;
            if (o.align === 'center') x0 = x - L.w / 2;
            else if (o.align === 'right') x0 = x - L.w;
            let base = y;
            if (o.valign === 'middle') base = y + (L.asc - L.desc) / 2;
            else if (o.valign === 'top') base = y + L.asc;
            if (o.bg) {
                const px = 0.28 * size, py = 0.16 * size;
                roundRect(x0 - px, base - L.asc - py, L.w + 2 * px, L.asc + L.desc + 2 * py, 0.3 * size);
                ctx.fillStyle = o.bg;
                ctx.fill();
                if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = 1.2; ctx.stroke(); }
            }
            drawLayout(L, x0, base, color);
            return { x: x0, w: L.w, top: base - L.asc, bottom: base + L.desc, base };
        }

        /* ------------------------------------------------------------ Rich text */
        // Outfit words with $math$ inside and **bold**, wrapped at a width. A "unit" is
        // everything between two spaces, so "$4$-mal" never breaks apart.
        function richUnits(str) {
            const segs = [];
            let bold = false, buf = '';
            const flush = () => { if (buf) { segs.push({ t: 'text', s: buf, bold }); buf = ''; } };
            for (let i = 0; i < str.length;) {
                if (str[i] === '$') {
                    flush();
                    const j = str.indexOf('$', i + 1);
                    segs.push({ t: 'math', s: str.slice(i + 1, j < 0 ? str.length : j), bold });
                    i = j < 0 ? str.length : j + 1;
                } else if (str.startsWith('**', i)) {
                    flush(); bold = !bold; i += 2;
                } else buf += str[i++];
            }
            flush();
            const units = [];
            let cur = [];
            const push = () => { if (cur.length) { units.push(cur); cur = []; } };
            segs.forEach(sg => {
                if (sg.t === 'math') { cur.push(sg); return; }
                sg.s.split(/(\s+)/).forEach(p => {
                    if (!p) return;
                    if (/^\s+$/.test(p)) { push(); if (p.indexOf('\n') >= 0) units.push('BR'); }
                    else cur.push({ t: 'text', s: p, bold: sg.bold });
                });
            });
            push();
            return units;
        }

        function richLayout(str, size, maxW = 1e9, o = {}) {
            const wordFont = b => (b ? '600 ' : '400 ') + size + 'px Outfit, sans-serif';
            ctx.font = wordFont(false);
            const sp = ctx.measureText(' ').width;
            const lines = [];
            const fresh = () => ({ parts: [], w: 0, asc: 0.78 * size, desc: 0.24 * size });
            let cur = fresh();
            richUnits(String(str)).forEach(u => {
                if (u === 'BR') { lines.push(cur); cur = fresh(); return; }
                const parts = u.map(p => {
                    if (p.t === 'math') {
                        const L = texLayout(p.bold ? '\\mathbf{' + p.s + '}' : p.s, size * (o.mathScale || 1.12));
                        return { t: 'm', L, w: L.w };
                    }
                    ctx.font = wordFont(p.bold);
                    return { t: 'w', s: p.s, font: wordFont(p.bold), w: ctx.measureText(p.s).width };
                });
                const uw = parts.reduce((s, p) => s + p.w, 0);
                if (cur.parts.length && cur.w + sp + uw > maxW) { lines.push(cur); cur = fresh(); }
                if (cur.parts.length) cur.w += sp;
                parts.forEach(p => {
                    p.x = cur.w;
                    cur.parts.push(p);
                    cur.w += p.w;
                    if (p.t === 'm') { cur.asc = Math.max(cur.asc, p.L.asc); cur.desc = Math.max(cur.desc, p.L.desc); }
                });
            });
            lines.push(cur);
            const gap = (o.lineGap != null ? o.lineGap : 0.32) * size;
            let h = 0, w = 0;
            lines.forEach((l, i) => { h += l.asc + l.desc + (i ? gap : 0); w = Math.max(w, l.w); });
            return { lines, w, h, gap };
        }

        // y is the top of the block; returns its height
        function rich(str, x, y, size, color, o = {}) {
            const R = richLayout(str, size, o.maxW, o);
            let top = y;
            R.lines.forEach(l => {
                const base = top + l.asc;
                const x0 = o.align === 'center' ? x - l.w / 2 : (o.align === 'right' ? x - l.w : x);
                l.parts.forEach(p => {
                    if (p.t === 'm') drawLayout(p.L, x0 + p.x, base, color);
                    else {
                        ctx.font = p.font;
                        ctx.fillStyle = color;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'alphabetic';
                        ctx.fillText(p.s, x0 + p.x, base);
                    }
                });
                top = base + l.desc + R.gap;
            });
            return R.h;
        }

        const richH = (str, size, maxW, o = {}) => richLayout(str, size, maxW, o).h;

        /* ----------------------------------------------------------- Primitives */
        function roundRect(x, y, w, h, r) {
            r = Math.max(0, Math.min(r, w / 2, h / 2));
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        function plate(x, y, w, h, edge) {
            roundRect(x, y, w, h, 16);
            ctx.fillStyle = C.plate;
            ctx.fill();
            ctx.strokeStyle = edge || C.plateEdge;
            ctx.lineWidth = edge ? 1.8 : 1.2;
            ctx.stroke();
        }
