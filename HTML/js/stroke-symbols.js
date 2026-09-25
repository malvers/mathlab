// Grouping pen strokes into symbols, and symbols into lines.
//
// Why this exists: morpheus/ does the same job from PIXELS — it rasterises the
// drawing, pulls contours out with marching squares and then tries to guess the
// reading order back out of the geometry (reading-order.js) before matching with
// the Hungarian algorithm. That throws away what the pen already knew: an "=" is
// two strokes written one after the other, an "x" is two crossing strokes, and
// the 3 in "3(x+5y)" was drawn before the bracket. Contours cannot tell "=" from
// two minus signs on different lines; stroke order and timing can.
//
// So: keep the strokes, group them, and let the reading order fall out of the
// order they were written in. No model involved — this is pure geometry plus the
// clock, which means it can be tested without an API key and without a tablet.
//
// Order matters: lines are split FIRST. Grouping by x alone would glue every
// glyph to the one directly above it on the next line.
//
// A stroke is { points: [{x, y, t}], width } with t in ms (performance.now()).
// Everything here is pure: same strokes in, same symbols out.

(function (root) {
    'use strict';

    const DEFAULTS = {
        // Lines: split where the gap between stroke centres exceeds this multiple
        // of the typical stroke height.
        lineGapFactor: 1.15,
        // Same symbol when the x-ranges overlap by at least this fraction of the
        // narrower one ("=" and "x" overlap almost fully)…
        xOverlapRatio: 0.45,
        // …or when they are merely this close, measured against the line height.
        // Needed because an upright stroke (the stem of a "5", a "1") is a couple
        // of pixels wide, so overlap ratios say nothing useful about it.
        xGapFactor: 0.28,
        // Closeness alone is not enough: in cramped writing the gap BETWEEN two
        // glyphs can be smaller than the gap inside one. What separates them is
        // the clock - the parts of one glyph follow each other far faster than
        // the jump to the next, where the pen lifts and travels. So a merge on
        // proximity alone must happen within this many ms.
        nearOnlyMs: 250,
        // A stroke starting within this many ms of the previous one is still the
        // same symbol - the second bar of an "=", the cross of a "+".
        sameSymbolMs: 900,
        // A stroke added later may still join, but must overlap clearly (the dot
        // on an "i", a bar crossed afterwards).
        lateJoinRatio: 0.60,
        // Strokes never join across a vertical gap wider than this multiple of the
        // line height - that is a different row of the calculation.
        yGapFactor: 0.95,
        // A fraction bar is long and flat. Width/height above this, and wider
        // than barMinWidth x line height, makes it a candidate…
        barRatio: 4.0,
        barMinWidth: 1.2,
        // …but only a candidate: a minus sign looks the same. What settles it is
        // ink ABOVE and BELOW, within this multiple of the line height.
        barReach: 2.2,         // a numerator is often written high above the bar
        // A tall symbol (integral, sum) with ink near its top or bottom, within
        // its span, is a big operator with limits: read operator, upper limit,
        // lower limit - the order \int_a^b lists them in.
        opMinHeight: 1.5,      // × line height, for reading order within a row
        opMinRatio: 1.7,       // height / width
        opReachX: 0.4,         // slack beyond the operator's span, × its width
        // Pulling a neighbouring ROW into an operator's row is riskier - a tall
        // "y" must not swallow the next line of a calculation - so that needs a
        // really tall stroke and a small claimed one.
        opRowMinHeight: 2.2,   // × line height
        opLimitMax: 0.6,       // claimed stroke's height, × the operator's
        // Merging across a vertical gap is only for dots (the i) and stacked
        // bars (the =). Anything else that does not touch vertically is another
        // symbol - a "0" written under an integral sign is its lower limit.
        touchGap: 0.12,        // × line height: closer than this counts as touching
        dotSize: 0.32,         // × line height
        barGap: 0.7,           // × line height, the two bars of "=" (measured 0.13 on Doc's, 0.54 synthetic)
        // Two rows are one row when a stroke bridges them - the integral sign
        // reaches from its upper limit down to its lower one.
        bridgeOverlap: 0.3,
    };

    function bboxOfPoints(points) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of points) {
            if (p.x < x0) x0 = p.x;
            if (p.y < y0) y0 = p.y;
            if (p.x > x1) x1 = p.x;
            if (p.y > y1) y1 = p.y;
        }
        return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
    }

    function bboxUnion(a, b) {
        const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y);
        const x1 = Math.max(a.x + a.w, b.x + b.w), y1 = Math.max(a.y + a.h, b.y + b.h);
        return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }

    function centreY(bb) { return bb.y + bb.h / 2; }

    // Overlap of the two x-ranges as a fraction of the narrower box; 0 when they
    // share no column at all.
    function xOverlapRatio(a, b) {
        const overlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        return overlap <= 0 ? 0 : overlap / Math.min(a.w, b.w);
    }

    // Horizontal gap between two boxes; 0 when they overlap.
    function xGap(a, b) {
        return Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w));
    }

    // Vertical gap between two boxes; 0 when they overlap.
    function yGap(a, b) {
        return Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
    }

    function median(values) {
        if (!values.length) return 0;
        const s = values.slice().sort((a, b) => a - b);
        const m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    }

    function strokeTimes(stroke) {
        const pts = stroke.points;
        const t0 = pts.length ? pts[0].t : undefined;
        const t1 = pts.length ? pts[pts.length - 1].t : undefined;
        return { start: (typeof t0 === 'number') ? t0 : null,
                 end: (typeof t1 === 'number') ? t1 : null };
    }

    // ── Fraction bars ───────────────────────────────────────────────────────
    // Telling a fraction bar from a minus sign cannot be done from the stroke
    // alone - they are the same gesture. The difference is what surrounds it:
    // a bar has ink above AND below it. Once known, a bar must never swallow its
    // neighbours (it overlaps every one of them horizontally), and it gives the
    // row a structure: numerator over denominator.
    function findeBruchstriche(entries, lineHeight, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const ids = new Set();
        for (const e of entries) {
            const b = e.bbox;
            if (b.w / b.h < o.barRatio) continue;
            if (b.w < lineHeight * o.barMinWidth) continue;

            const mitte = b.x + b.w / 2;
            let drueber = false, drunter = false;
            for (const f of entries) {
                if (f === e) continue;
                const fb = f.bbox;
                // must sit within the bar's span, not beside it
                if (fb.x + fb.w < b.x || fb.x > b.x + b.w) continue;
                const fm = fb.y + fb.h / 2;
                if (fm < b.y && b.y - fm < lineHeight * o.barReach) drueber = true;
                if (fm > b.y + b.h && fm - (b.y + b.h) < lineHeight * o.barReach) drunter = true;
                if (drueber && drunter) break;
            }
            if (drueber && drunter) ids.add(e.idx);
        }
        return ids;
    }

    // ── Step 1: strokes → rows ──────────────────────────────────────────────
    // Purely vertical: cluster stroke centres, split on gaps. Done before any
    // symbol grouping, otherwise the "3" of line two joins the "3" of line one.
    function splitStrokesIntoRows(entries, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        if (!entries.length) return [];
        // Typical glyph height: tall strokes (a bracket) and flat ones (a bar)
        // both occur, so the median is steadier than the mean.
        const h = median(entries.map(e => e.bbox.h)) || 1;

        const byY = entries.slice().sort((a, b) => centreY(a.bbox) - centreY(b.bbox));
        const rows = [];
        let current = [byY[0]];
        for (let i = 1; i < byY.length; i++) {
            const gap = centreY(byY[i].bbox) - centreY(byY[i - 1].bbox);
            if (gap > h * o.lineGapFactor) { rows.push(current); current = [byY[i]]; }
            else current.push(byY[i]);
        }
        rows.push(current);
        // Back into writing order inside each row.
        return rows.map(r => r.slice().sort((a, b) => a.idx - b.idx));
    }

    // ── Step 2: strokes of one row → symbols ────────────────────────────────
    // Walks in writing order. Each stroke joins the symbol it overlaps or sits
    // right next to, otherwise it opens a new one.
    function groupRowIntoSymbols(entries, lineHeight, opts, bruchIds) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const bar = bruchIds || new Set();
        const symbols = [];

        for (const e of entries) {
            const bb = e.bbox;
            // A fraction bar is its own symbol and takes nobody with it - it
            // overlaps every glyph of the fraction horizontally, so without this
            // it would swallow the whole term.
            if (bar.has(e.idx)) {
                symbols.push({ strokeIdxs: [e.idx], bbox: bb, tStart: e.tStart, tEnd: e.tEnd, bruch: true });
                continue;
            }
            let target = null;

            // Most recent first: that is where a multi-stroke glyph continues.
            for (let s = symbols.length - 1; s >= 0; s--) {
                const sym = symbols[s];
                if (sym.bruch) continue;                 // never merge into a bar
                const yg = yGap(bb, sym.bbox);
                if (yg > lineHeight * o.yGapFactor) continue;
                if (yg > lineHeight * o.touchGap) {
                    // Not touching vertically: only a dot (the i, the j) or the
                    // second bar of an "=" still belongs. A "0" under an integral
                    // overlaps it sideways and sits close - and is another symbol.
                    const tiny = b => b.w < lineHeight * o.dotSize && b.h < lineHeight * o.dotSize;
                    const flat = b => b.w / b.h > 2.2;       // a handwritten "=" bar can be short and thick (Doc's: 2.9)
                    const dot = tiny(bb) || tiny(sym.bbox);
                    const bars = flat(bb) && flat(sym.bbox) && yg < lineHeight * o.barGap;
                    if (!dot && !bars) continue;
                }

                const ratio = xOverlapRatio(bb, sym.bbox);
                const near = xGap(bb, sym.bbox) <= lineHeight * o.xGapFactor;
                const gap = (e.tStart !== null && sym.tEnd !== null) ? e.tStart - sym.tEnd : null;
                const soonAfter = (gap === null) || gap <= o.sameSymbolMs;

                // Overlapping strokes may join after a longer pause (a bar crossed
                // later); merely adjacent ones must follow quickly, or they are
                // the next glyph.
                const quick = (gap === null) || gap <= o.nearOnlyMs;
                if (soonAfter && ratio >= o.xOverlapRatio) { target = sym; break; }
                if (quick && near) { target = sym; break; }
                if (ratio >= o.lateJoinRatio) { target = sym; break; }   // dot added later
                // The pen has clearly moved past this symbol - stop looking back.
                if (bb.x > sym.bbox.x + sym.bbox.w + lineHeight) break;
            }

            if (target) {
                target.strokeIdxs.push(e.idx);
                target.bbox = bboxUnion(target.bbox, bb);
                if (e.tEnd !== null) target.tEnd = e.tEnd;
            } else {
                symbols.push({ strokeIdxs: [e.idx], bbox: bb, tStart: e.tStart, tEnd: e.tEnd });
            }
        }
        return symbols;
    }

    // ── Reading order with fractions ────────────────────────────────────────
    // Left to right is only right while nothing is stacked. A fraction reads
    // bar first, then everything above it, then everything below - the order
    // \frac{...}{...} puts them in. Symbols that sit within a bar's span are
    // claimed by it; the rest of the row keeps its left-to-right order, with the
    // whole fraction taking the bar's place in that sequence.
    function leseReihenfolge(symbols, lineHeight, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const lh = lineHeight || median(symbols.map(s => s.bbox.h)) || 1;
        const istOperator = s => !s.bruch && s.bbox.h > lh * o.opMinHeight && s.bbox.h / s.bbox.w > o.opMinRatio;
        const anker = symbols.filter(s => s.bruch || istOperator(s));
        if (!anker.length) return symbols.slice().sort((a, b) => a.bbox.x - b.bbox.x);

        const vergeben = new Set();
        const gruppen = [];
        // Bars claim first (numerator, denominator), then the tall operators
        // (upper limit, lower limit). A tall glyph that claims nothing - a
        // bracket, a "y" - is not an anchor at all and stays in the row.
        for (const a of anker.filter(s => s.bruch).concat(anker.filter(s => !s.bruch))) {
            const oben = [], unten = [];
            const slack = a.bbox.w * (a.bruch ? 0.15 : o.opReachX);
            const x0 = a.bbox.x - slack, x1 = a.bbox.x + a.bbox.w + slack;
            symbols.forEach(s => {
                if (s === a || vergeben.has(s) || s.bruch) return;
                const m = s.bbox.x + s.bbox.w / 2;
                if (m < x0 || m > x1) return;
                const my = s.bbox.y + s.bbox.h / 2;
                if (a.bruch) {
                    if (my < a.bbox.y) { oben.push(s); vergeben.add(s); }
                    else if (my > a.bbox.y + a.bbox.h) { unten.push(s); vergeben.add(s); }
                } else {
                    // Limits sit at the ends of a tall operator, not beside its middle.
                    if (my < a.bbox.y + a.bbox.h * 0.35) { oben.push(s); vergeben.add(s); }
                    else if (my > a.bbox.y + a.bbox.h * 0.65) { unten.push(s); vergeben.add(s); }
                }
            });
            if (!a.bruch && !oben.length && !unten.length) continue;
            vergeben.add(a);
            const lr = (p, q) => p.bbox.x - q.bbox.x;
            gruppen.push({ x: a.bbox.x, folge: [a, ...oben.sort(lr), ...unten.sort(lr)] });
        }
        const rest = symbols.filter(s => !vergeben.has(s));
        const eintraege = rest.map(s => ({ x: s.bbox.x, folge: [s] })).concat(gruppen);
        eintraege.sort((p, q) => p.x - q.x);
        return [].concat(...eintraege.map(e => e.folge));
    }

    // Rows are one row when a stroke reaches into both: the integral sign spans
    // from its upper limit down to its lower one, and the row splitter, which
    // only sees gaps between stroke centres, had cut the limit off.
    function verbindeUeberbrueckte(rows, o) {
        const extent = r => {
            let y0 = Infinity, y1 = -Infinity;
            r.forEach(e => { y0 = Math.min(y0, e.bbox.y); y1 = Math.max(y1, e.bbox.y + e.bbox.h); });
            return { y0, y1 };
        };
        let changed = true;
        while (changed && rows.length > 1) {
            changed = false;
            const ext = rows.map(extent);
            outer: for (let i = 0; i < rows.length - 1; i++) {
                const a = ext[i], b = ext[i + 1];
                for (const e of rows[i].concat(rows[i + 1])) {
                    const t = e.bbox.y, bt = e.bbox.y + e.bbox.h;
                    const ovA = Math.min(bt, a.y1) - Math.max(t, a.y0);
                    const ovB = Math.min(bt, b.y1) - Math.max(t, b.y0);
                    const needA = Math.min(e.bbox.h, a.y1 - a.y0) * o.bridgeOverlap;
                    const needB = Math.min(e.bbox.h, b.y1 - b.y0) * o.bridgeOverlap;
                    if (ovA > needA && ovB > needB) {
                        rows.splice(i, 2, rows[i].concat(rows[i + 1]).sort((p, q) => p.idx - q.idx));
                        changed = true;
                        break outer;
                    }
                }
            }
        }
        return rows;
    }

    // The typesetter knows how many glyphs there are. When the grouping found
    // a different number, it is the grouping that gives way: too few symbols,
    // and the one whose strokes are furthest apart sideways is split there; too
    // many, and the two closest neighbours are merged. Bars are never touched.
    function abgleichen(symbols, entries, soll) {
        const byIdx = new Map(entries.map(e => [e.idx, e]));
        const mk = es => ({
            strokeIdxs: es.map(e => e.idx),
            bbox: es.map(e => e.bbox).reduce((a, c) => bboxUnion(a, c)),
            tStart: Math.min(...es.map(e => e.tStart === null ? Infinity : e.tStart)),
            tEnd: Math.max(...es.map(e => e.tEnd === null ? -Infinity : e.tEnd)),
            nachjustiert: true,
        });
        let syms = symbols.map(s => Object.assign({}, s, { strokeIdxs: s.strokeIdxs.slice() }));
        let guard = 24;
        while (syms.length < soll && guard--) {
            let best = null;
            for (const sy of syms) {
                if (sy.bruch || sy.strokeIdxs.length < 2) continue;
                const es = sy.strokeIdxs.map(i => byIdx.get(i)).filter(Boolean).sort((a, b) => a.bbox.x - b.bbox.x);
                for (let k = 1; k < es.length; k++) {
                    const gap = es[k].bbox.x - (es[k - 1].bbox.x + es[k - 1].bbox.w);
                    if (!best || gap > best.gap) best = { sy, gap, links: es.slice(0, k), rechts: es.slice(k) };
                }
            }
            if (!best) break;
            syms.splice(syms.indexOf(best.sy), 1, mk(best.links), mk(best.rechts));
        }
        while (syms.length > soll && guard--) {
            const byX = syms.slice().sort((a, b) => a.bbox.x - b.bbox.x);
            let best = null;
            for (let k = 1; k < byX.length; k++) {
                if (byX[k].bruch || byX[k - 1].bruch) continue;
                const gap = xGap(byX[k - 1].bbox, byX[k].bbox);
                if (!best || gap < best.gap) best = { gap, a: byX[k - 1], b: byX[k] };
            }
            if (!best) break;
            const es = best.a.strokeIdxs.concat(best.b.strokeIdxs).map(i => byIdx.get(i)).filter(Boolean);
            syms = syms.filter(x => x !== best.a && x !== best.b).concat([mk(es)]);
        }
        return syms;
    }

    function eintraege(strokes) {
        const out = [];
        strokes.forEach((stroke, idx) => {
            if (!stroke.points || stroke.points.length === 0) return;
            const t = strokeTimes(stroke);
            out.push({ idx, bbox: bboxOfPoints(stroke.points), tStart: t.start, tEnd: t.end });
        });
        return out;
    }

    // Re-group one row to a known glyph count and put it back in reading order.
    // Returns the new symbols (or the old ones if the count cannot be reached).
    function nachjustieren(line, strokes, soll, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const entries = eintraege(strokes);
        const lh = median(entries.map(e => e.bbox.h)) || 1;
        const neu = abgleichen(line.symbols, entries, soll);
        if (neu.length !== soll) return line.symbols;
        const geordnet = leseReihenfolge(neu, lh, o);
        geordnet.forEach((sy, i) => { sy.readIdx = i; sy.lineIdx = line.lineIdx; });
        return geordnet;
    }

    function analyse(strokes, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const entries = eintraege(strokes);
        if (!entries.length) return { symbols: [], lines: [], lineHeight: 1 };

        let rows = splitStrokesIntoRows(entries, o);
        const lineHeight = median(entries.map(e => e.bbox.h)) || 1;

        const bruchIds = findeBruchstriche(entries, lineHeight, o);
        // Stacked constructs span rows by nature - numerator over denominator, a
        // limit above an integral sign - and the row splitter, which only sees
        // vertical gaps, cuts them apart. Anchors pull them back: a fraction bar
        // claims what lies within its span above and below; a really tall
        // stroke claims small things within its span (plus slack) near its top
        // or bottom.
        const anker = entries.filter(e => bruchIds.has(e.idx) ||
            (e.bbox.h > lineHeight * o.opRowMinHeight && e.bbox.h / e.bbox.w > o.opMinRatio));
        if (anker.length && rows.length > 1) {
            const zeileVon = new Map();
            rows.forEach((row, i) => row.forEach(e => zeileVon.set(e.idx, i)));
            const verschmelze = new Map();          // row -> row it joins
            for (const e of anker) {
                const b = e.bbox, heim = zeileVon.get(e.idx);
                const istBar = bruchIds.has(e.idx);
                const slack = istBar ? 0 : b.w * o.opReachX;
                for (const f of entries) {
                    if (f === e) continue;
                    const fb = f.bbox, fm = fb.y + fb.h / 2, fx = fb.x + fb.w / 2;
                    if (fx < b.x - slack || fx > b.x + b.w + slack) continue;
                    if (!istBar && fb.h > b.h * o.opLimitMax) continue;
                    const nah = (fm < b.y && b.y - fm < lineHeight * o.barReach) ||
                                (fm > b.y + b.h && fm - (b.y + b.h) < lineHeight * o.barReach);
                    const zeile = zeileVon.get(f.idx);
                    if (nah && zeile !== heim) verschmelze.set(zeile, heim);
                }
            }
            if (verschmelze.size) {
                const neu = [];
                rows.forEach((row, i) => {
                    let ziel = i;
                    for (let g = 0; g < 8 && verschmelze.has(ziel); g++) ziel = verschmelze.get(ziel);
                    (neu[ziel] = neu[ziel] || []).push(...row);
                });
                rows = neu.filter(Boolean).map(r => r.sort((a, b) => a.idx - b.idx));
            }
        }
        rows = verbindeUeberbrueckte(rows, o);
        const lines = [];
        const all = [];
        rows.forEach((row, lineIdx) => {
            const syms = leseReihenfolge(groupRowIntoSymbols(row, lineHeight, o, bruchIds), lineHeight, o);
            syms.forEach((s, i) => {
                s.readIdx = i;
                s.lineIdx = lineIdx;
                s.writeIdx = all.length;                       // order across the page
                all.push(s);
            });
            lines.push({
                lineIdx,
                symbols: syms,
                bbox: syms.reduce((acc, s) => acc ? bboxUnion(acc, s.bbox) : s.bbox, null),
                tEnd: Math.max(...syms.map(s => s.tEnd === null ? -Infinity : s.tEnd)),
            });
        });
        // Rows came out top to bottom; that is also the order they were written in
        // for a calculation worked downwards.
        return { symbols: all, lines, lineHeight };
    }

    const api = { DEFAULTS, analyse, splitStrokesIntoRows, groupRowIntoSymbols,
                  findeBruchstriche, leseReihenfolge, verbindeUeberbrueckte, abgleichen, nachjustieren, eintraege,
                  bboxOfPoints, bboxUnion, xOverlapRatio, xGap, yGap, median };

    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StrokeSymbols = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
