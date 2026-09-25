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
        barReach: 1.4,
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
                if (yGap(bb, sym.bbox) > lineHeight * o.yGapFactor) continue;

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
    function leseReihenfolge(symbols) {
        const baeren = symbols.filter(s => s.bruch);
        if (!baeren.length) return symbols.slice().sort((a, b) => a.bbox.x - b.bbox.x);

        const vergeben = new Set();
        const gruppen = baeren.map(bar => {
            const zaehler = [], nenner = [];
            symbols.forEach(s => {
                if (s === bar || s.bruch || vergeben.has(s)) return;
                const m = s.bbox.x + s.bbox.w / 2;
                if (m < bar.bbox.x || m > bar.bbox.x + bar.bbox.w) return;
                const my = s.bbox.y + s.bbox.h / 2;
                if (my < bar.bbox.y) { zaehler.push(s); vergeben.add(s); }
                else if (my > bar.bbox.y + bar.bbox.h) { nenner.push(s); vergeben.add(s); }
            });
            const lr = (a, b) => a.bbox.x - b.bbox.x;
            return { bar, folge: [bar, ...zaehler.sort(lr), ...nenner.sort(lr)] };
        });

        // Put each fraction where its bar sits in the row, keep the rest in place.
        const rest = symbols.filter(s => !s.bruch && !vergeben.has(s));
        const eintraege = rest.map(s => ({ x: s.bbox.x, folge: [s] }))
            .concat(gruppen.map(g => ({ x: g.bar.bbox.x, folge: g.folge })));
        eintraege.sort((a, b) => a.x - b.x);
        return [].concat(...eintraege.map(e => e.folge));
    }

    function analyse(strokes, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const entries = [];
        strokes.forEach((stroke, idx) => {
            if (!stroke.points || stroke.points.length === 0) return;
            const t = strokeTimes(stroke);
            entries.push({ idx, bbox: bboxOfPoints(stroke.points), tStart: t.start, tEnd: t.end });
        });
        if (!entries.length) return { symbols: [], lines: [] };

        let rows = splitStrokesIntoRows(entries, o);
        const lineHeight = median(entries.map(e => e.bbox.h)) || 1;

        const bruchIds = findeBruchstriche(entries, lineHeight, o);
        // A fraction spans rows by nature - numerator above, denominator below -
        // so the row splitter, which only sees vertical gaps, cuts the
        // denominator off. Put it back: whatever lies within a bar's span
        // belongs to the bar's row.
        if (bruchIds.size) {
            const zeileVon = new Map();
            rows.forEach((row, i) => row.forEach(e => zeileVon.set(e.idx, i)));
            const verschmelze = new Map();          // row -> row it joins
            for (const e of entries) {
                if (!bruchIds.has(e.idx)) continue;
                const b = e.bbox, heim = zeileVon.get(e.idx);
                for (const f of entries) {
                    if (f === e) continue;
                    const fb = f.bbox;
                    if (fb.x + fb.w < b.x || fb.x > b.x + b.w) continue;
                    const fm = fb.y + fb.h / 2;
                    const nah = (fm < b.y && b.y - fm < lineHeight * o.barReach) ||
                                (fm > b.y + b.h && fm - (b.y + b.h) < lineHeight * o.barReach);
                    const zeile = zeileVon.get(f.idx);
                    if (nah && zeile !== heim) verschmelze.set(zeile, heim);
                }
            }
            if (verschmelze.size) {
                const neu = [];
                rows.forEach((row, i) => {
                    const ziel = verschmelze.has(i) ? verschmelze.get(i) : i;
                    (neu[ziel] = neu[ziel] || []).push(...row);
                });
                rows = neu.filter(Boolean).map(r => r.sort((a, b) => a.idx - b.idx));
            }
        }
        const lines = [];
        const all = [];
        rows.forEach((row, lineIdx) => {
            const syms = leseReihenfolge(groupRowIntoSymbols(row, lineHeight, o, bruchIds));
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
        return { symbols: all, lines };
    }

    const api = { DEFAULTS, analyse, splitStrokesIntoRows, groupRowIntoSymbols,
                  findeBruchstriche, leseReihenfolge,
                  bboxOfPoints, bboxUnion, xOverlapRatio, xGap, yGap, median };

    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StrokeSymbols = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
