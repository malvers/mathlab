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
    function groupRowIntoSymbols(entries, lineHeight, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const symbols = [];

        for (const e of entries) {
            const bb = e.bbox;
            let target = null;

            // Most recent first: that is where a multi-stroke glyph continues.
            for (let s = symbols.length - 1; s >= 0; s--) {
                const sym = symbols[s];
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

    function analyse(strokes, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const entries = [];
        strokes.forEach((stroke, idx) => {
            if (!stroke.points || stroke.points.length === 0) return;
            const t = strokeTimes(stroke);
            entries.push({ idx, bbox: bboxOfPoints(stroke.points), tStart: t.start, tEnd: t.end });
        });
        if (!entries.length) return { symbols: [], lines: [] };

        const rows = splitStrokesIntoRows(entries, o);
        const lineHeight = median(entries.map(e => e.bbox.h)) || 1;

        const lines = [];
        const all = [];
        rows.forEach((row, lineIdx) => {
            const syms = groupRowIntoSymbols(row, lineHeight, o)
                .sort((a, b) => a.bbox.x - b.bbox.x);          // reading order
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
                  bboxOfPoints, bboxUnion, xOverlapRatio, xGap, yGap, median };

    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StrokeSymbols = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
