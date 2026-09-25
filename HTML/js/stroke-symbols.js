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
        // Overlap below strongOverlap is weak evidence: Doc's bracket and the x
        // written into it overlap 0.48, the two strokes of a glyph as little as
        // 0.46. The pause separates them - within a glyph 210-255 ms, to the
        // neighbour from 297 ms (corpus, 25.09.2026).
        strongOverlap: 0.7,
        weakOverlapMs: 280,
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

    // The yardstick for every distance in here. Not the median of ALL stroke
    // heights: bars, minus signs and the two strokes of every "=" are flat, and
    // in a formula with fractions they are a third of the strokes - they pulled
    // the median down until a numerator counted as out of reach of its own bar
    // and the two bars of an "=" as too far apart to be one glyph (corpus,
    // 25.09.2026: probes 11 and 17). So flat strokes and specks are left out.
    function typischeHoehe(entries) {
        const hs = entries.map(e => e.bbox)
            .filter(b => b.w / b.h <= 2.5 && Math.max(b.w, b.h) >= 6)
            .map(b => b.h);
        return median(hs.length ? hs : entries.map(e => e.bbox.h)) || 1;
    }

    // ── Ink, not boxes ──────────────────────────────────────────────────────
    // A big glyph's bounding box contains plenty that is not part of it: the
    // lower limit of a sum sign sits inside the sign's box (corpus probe 22).
    // Whether a late stroke belongs is decided by the ink: does it cross or
    // touch the strokes already there?
    function duenn(pts, max) {
        if (pts.length <= max) return pts;
        const step = (pts.length - 1) / (max - 1), out = [];
        for (let i = 0; i < max; i++) out.push(pts[Math.round(i * step)]);
        return out;
    }

    function schneiden(p1, p2, p3, p4) {
        const d = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
        return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
    }

    function beruehrt(pts, strokeListe, nah) {
        if (!pts || !strokeListe) return false;
        const A = duenn(pts, 48);
        for (const other of strokeListe) {
            const B = duenn(other, 48);
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B.length; j++) {
                    if (Math.hypot(A[i].x - B[j].x, A[i].y - B[j].y) < nah) return true;
                    if (i && j && schneiden(A[i - 1], A[i], B[j - 1], B[j])) return true;
                }
            }
        }
        return false;
    }

    // Vertical overlap as a fraction of the lower of the two boxes.
    function yOverlapRatio(a, b) {
        const overlap = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        return overlap <= 0 ? 0 : overlap / Math.min(a.h, b.h);
    }

    // Left to right - except where two symbols share their columns, and there
    // the pen decides. Doc's prime in f'(x) sits above the start of the bracket,
    // so by x it came after "("; he wrote it before, and so does LaTeX.
    function linksNachRechts(list) {
        const out = list.slice().sort((a, b) => a.bbox.x - b.bbox.x);
        for (let i = 1; i < out.length; i++) {
            for (let j = i; j > 0; j--) {
                const p = out[j - 1], q = out[j];
                if (xOverlapRatio(p.bbox, q.bbox) < 0.5) break;
                if (p.tStart === null || q.tStart === null || !(q.tStart < p.tStart)) break;
                out[j - 1] = q; out[j] = p;
            }
        }
        return out;
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
            // Length is not what makes a bar: Doc's bar over a single digit is
            // 0.86 line heights wide (probe 11). What makes it one is ink above
            // AND below. A short one needs that ink close, so a minus between
            // two lines of a calculation does not qualify.
            if (b.w < lineHeight * 0.6) continue;
            const reach = lineHeight * (b.w < lineHeight * o.barMinWidth ? 1.4 : o.barReach);

            let drueber = false, drunter = false;
            for (const f of entries) {
                if (f === e) continue;
                const fb = f.bbox;
                // Evidence is a glyph, not another flat stroke: the lower bar of
                // an "=" has the upper one above it, the underline of a ± has the
                // big fraction bar below it (probe 21) - neither is a fraction.
                if (fb.w / fb.h > 4) continue;
                // Centred over or under it - an exponent overhanging from the
                // left does not count (the 2 of a^2, probe 08) ...
                const fx = fb.x + fb.w / 2;
                if (fx < b.x || fx > b.x + b.w) continue;
                // ... and never ink that CROSSES it: that is the other stroke of
                // a "+" (probe 08), not a numerator.
                if (beruehrt(f.pts, [e.pts], 0)) continue;
                const fm = fb.y + fb.h / 2;
                if (fm < b.y && b.y - fm < reach) drueber = true;
                if (fm > b.y + b.h && fm - (b.y + b.h) < reach) drunter = true;
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
        const h = typischeHoehe(entries);

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
        // A dot is small AND compact. A small dash is not a dot: the "=" of a
        // lower limit is two of them, and treating them as i-dots tore it apart
        // (corpus probes 17, 22).
        const tiny = b => b.w < lineHeight * o.dotSize && b.h < lineHeight * o.dotSize &&
                          b.w / b.h <= 3 && b.h / b.w <= 3;
        const punkte = [];

        for (const e of entries) {
            const bb = e.bbox;
            // A fraction bar is its own symbol and takes nobody with it - it
            // overlaps every glyph of the fraction horizontally, so without this
            // it would swallow the whole term.
            if (bar.has(e.idx)) {
                symbols.push({ strokeIdxs: [e.idx], bbox: bb, tStart: e.tStart, tEnd: e.tEnd, bruch: true, pts: [e.pts] });
                continue;
            }
            // Dots are placed last, onto what is below them - see below. But
            // only a FREE dot is a dot: the little lead-in hook of Doc's root
            // sign is just as small and compact, and touches the upstroke it
            // belongs to (probe 21). An i-dot floats.
            if (tiny(bb) && !symbols.some(sym => !sym.bruch && yGap(bb, sym.bbox) < lineHeight * 0.1 &&
                    xGap(bb, sym.bbox) < lineHeight * 0.1 && beruehrt(e.pts, sym.pts, lineHeight * 0.08))) {
                punkte.push(e); continue;
            }
            let target = null;

            // A long flat line that is not a fraction bar - a root's vinculum, an
            // overline - joins only the root sign at whose tip it starts (Doc
            // draws it right after the sign, or after the radicand: probe 21).
            // And nothing joins it by overlap: the radicand lies right under
            // it, fully inside its columns, and is not part of it.
            const langeLinie = b => b.w / b.h > 4 && b.w > lineHeight * 1.5;
            if (langeLinie(bb)) {
                const links = e.pts.reduce((m, p) => p.x < m.x ? p : m, e.pts[0]);
                for (let s = symbols.length - 1; s >= 0 && !target; s--) {
                    const sym = symbols[s];
                    if (sym.bruch || sym.linie) continue;
                    const spitze = { x: sym.bbox.x + sym.bbox.w, y: sym.bbox.y };
                    if (Math.hypot(links.x - spitze.x, links.y - spitze.y) < lineHeight * 0.45 &&
                        links.x >= sym.bbox.x + sym.bbox.w * 0.5) target = sym;
                }
                if (target) {
                    target.strokeIdxs.push(e.idx);
                    target.bbox = bboxUnion(target.bbox, bb);
                    target.pts.push(e.pts);
                    if (e.tEnd !== null) target.tEnd = e.tEnd;
                } else {
                    symbols.push({ strokeIdxs: [e.idx], bbox: bb, tStart: e.tStart, tEnd: e.tEnd, pts: [e.pts], linie: true });
                }
                continue;
            }

            // Most recent first: that is where a multi-stroke glyph continues.
            for (let s = symbols.length - 1; s >= 0; s--) {
                const sym = symbols[s];
                if (sym.bruch || sym.linie) continue;    // never merge into a bar or a long line
                const yg = yGap(bb, sym.bbox);
                if (yg > lineHeight * o.yGapFactor) continue;
                if (yg > lineHeight * o.touchGap) {
                    // Not touching vertically: only the second bar of an "="
                    // still belongs - or the underline of a ±, ≤, ≥: short, flat,
                    // right under the glyph just written, no wider than it.
                    // A "0" under an integral overlaps it sideways and sits
                    // close - and is another symbol.
                    const flat = b => b.w / b.h > 2.2;       // a handwritten "=" bar can be short and thick (Doc's: 2.9)
                    const unterstrich = s === symbols.length - 1 && flat(bb) && !flat(sym.bbox) &&
                        bb.y > sym.bbox.y + sym.bbox.h * 0.5 && yg < lineHeight * 0.8 &&   // Doc's sits 0.6 below (probe 21)
                        bb.w <= sym.bbox.w * 1.3 && xOverlapRatio(bb, sym.bbox) >= 0.6;
                    if (!(flat(bb) && flat(sym.bbox) && yg < lineHeight * o.barGap) && !unterstrich) continue;
                }

                // Has the pen started another symbol since this one? Then boxes
                // are no evidence any more - only ink that crosses or touches it
                // still belongs (a t-bar, the slash of ≠). Doc writes the parts
                // of a glyph in one go (199 ms median between them).
                if (s < symbols.length - 1) {
                    if (xOverlapRatio(bb, sym.bbox) >= 0 && beruehrt(e.pts, sym.pts, lineHeight * 0.1)) { target = sym; break; }
                    if (bb.x > sym.bbox.x + sym.bbox.w + lineHeight) break;
                    continue;
                }

                // Inside a big glyph's box without touching its ink: the radicand
                // under a root's vinculum, a letter written into a large bracket.
                // A new symbol, however quickly it followed.
                const drin = bb.x >= sym.bbox.x - 2 && bb.x + bb.w <= sym.bbox.x + sym.bbox.w + 2 &&
                             bb.y >= sym.bbox.y - 2 && bb.y + bb.h <= sym.bbox.y + sym.bbox.h + 2;
                if (drin && sym.bbox.w > 1.5 * bb.w && sym.bbox.h > 1.2 * bb.h &&
                    !beruehrt(e.pts, sym.pts, lineHeight * 0.06)) continue;

                const ratio = xOverlapRatio(bb, sym.bbox);
                // Merely near is only enough side by side on the same level. An
                // exponent follows its base quickly and closely too - but it is
                // raised: in a^2 the 2 overlaps the a vertically by a few pixels
                // (corpus probe 08), the parts of one glyph overlap far more.
                // An exponent is raised AND clearly smaller - the i over the 2 in
                // 2^i is 40 % of it. Two parts of one glyph can be offset too (the
                // two strokes of Doc's "4", 122 and 136 px), but are of a size.
                const kleiner = Math.min(bb.h, sym.bbox.h) < 0.6 * Math.max(bb.h, sym.bbox.h);
                const versetzt = Math.abs(centreY(bb) - centreY(sym.bbox)) > 0.35 * Math.max(bb.h, sym.bbox.h);
                const near = xGap(bb, sym.bbox) <= lineHeight * o.xGapFactor &&
                             yOverlapRatio(bb, sym.bbox) >= 0.25 && !(kleiner && versetzt);
                const gap = (e.tStart !== null && sym.tEnd !== null) ? e.tStart - sym.tEnd : null;
                const soonAfter = (gap === null) || gap <= o.sameSymbolMs;

                // Overlapping strokes may join after a longer pause (a bar crossed
                // later); merely adjacent ones must follow quickly, or they are
                // the next glyph.
                const quick = (gap === null) || gap <= o.nearOnlyMs;
                const knapp = (gap === null) || gap <= o.weakOverlapMs;
                if (ratio >= o.strongOverlap && soonAfter) { target = sym; break; }
                if (ratio >= o.xOverlapRatio && knapp) { target = sym; break; }
                if (quick && near) { target = sym; break; }
                if (ratio >= o.lateJoinRatio) { target = sym; break; }   // dot added later
                // The pen has clearly moved past this symbol - stop looking back.
                if (bb.x > sym.bbox.x + sym.bbox.w + lineHeight) break;
            }

            if (target) {
                target.strokeIdxs.push(e.idx);
                target.bbox = bboxUnion(target.bbox, bb);
                target.pts.push(e.pts);
                if (e.tEnd !== null) target.tEnd = e.tEnd;
            } else {
                symbols.push({ strokeIdxs: [e.idx], bbox: bb, tStart: e.tStart, tEnd: e.tEnd, pts: [e.pts] });
            }
        }

        // The dot of an i or j belongs to the stem right below it, whenever it
        // was set - Doc sets it after the stem, or after the whole word. Done
        // last, when every stem exists. A dot with nothing directly below it
        // (a multiplication dot sits beside its neighbours, not above) stays a
        // symbol of its own. Corpus: sin, lim, e^{i\pi} (probes 14, 15, 18).
        for (const e of punkte) {
            const cx = e.bbox.x + e.bbox.w / 2, unterkante = e.bbox.y + e.bbox.h;
            let best = null;
            for (const sym of symbols) {
                if (sym.bruch) continue;
                const slack = lineHeight * 0.25;
                if (cx < sym.bbox.x - slack || cx > sym.bbox.x + sym.bbox.w + slack) continue;
                if (unterkante > sym.bbox.y + sym.bbox.h * 0.3) continue;      // must sit above it
                const abstand = sym.bbox.y - unterkante;
                if (abstand > lineHeight * 1.2) continue;
                if (!best || abstand < best.abstand) best = { sym, abstand };
            }
            if (best) {
                const sym = best.sym;
                sym.strokeIdxs.push(e.idx);
                sym.bbox = bboxUnion(sym.bbox, e.bbox);
                sym.pts.push(e.pts);
                if (e.tEnd !== null && (sym.tEnd === null || e.tEnd > sym.tEnd)) sym.tEnd = e.tEnd;
            } else {
                symbols.push({ strokeIdxs: [e.idx], bbox: e.bbox, tStart: e.tStart, tEnd: e.tEnd, pts: [e.pts] });
            }
        }
        return symbols;
    }

    // ── Raised and lowered rows ─────────────────────────────────────────────
    // An exponent written high, or a limit above a sum sign, can end up as a row
    // of its own: its centre is far enough up. It is not a new line of the
    // calculation - it is narrow, and it almost touches the row it belongs to
    // (corpus: e^{i\pi}, probe 14; ∞ over ∑, probe 22).
    function verbindeHochTief(rows, lineHeight) {
        const box = r => {
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            r.forEach(e => { x0 = Math.min(x0, e.bbox.x); y0 = Math.min(y0, e.bbox.y);
                             x1 = Math.max(x1, e.bbox.x + e.bbox.w); y1 = Math.max(y1, e.bbox.y + e.bbox.h); });
            return { x0, y0, x1, y1, w: x1 - x0 };
        };
        let changed = true;
        while (changed && rows.length > 1) {
            changed = false;
            const bs = rows.map(box);
            for (let i = 0; i < rows.length - 1; i++) {
                const a = bs[i], b = bs[i + 1];
                const gap = b.y0 - a.y1;
                if (gap > lineHeight * 0.45) continue;
                const [schmal, breit] = a.w < b.w ? [a, b] : [b, a];
                if (schmal.w > breit.w * 0.5) continue;
                if (schmal.x0 < breit.x0 - lineHeight || schmal.x1 > breit.x1 + lineHeight) continue;
                rows.splice(i, 2, rows[i].concat(rows[i + 1]).sort((p, q) => p.idx - q.idx));
                changed = true;
                break;
            }
        }
        return rows;
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
        // An operator with limits: tall and narrow like an integral sign - or
        // anything with something clearly smaller stacked right above or below
        // it inside its own columns. A handwritten sum sign is as wide as it is
        // tall, so "tall and narrow" alone never caught it (corpus probe 17).
        const gestapelt = a => symbols.some(s => s !== a && !s.bruch &&
            s.bbox.h < a.bbox.h * 0.75 &&
            s.bbox.x + s.bbox.w / 2 >= a.bbox.x && s.bbox.x + s.bbox.w / 2 <= a.bbox.x + a.bbox.w &&
            yGap(s.bbox, a.bbox) > lh * o.touchGap && yGap(s.bbox, a.bbox) < lh * o.barReach);
        const istOperator = s => !s.bruch && s.bbox.h > lh * o.opMinHeight &&
            (s.bbox.h / s.bbox.w > o.opMinRatio || gestapelt(s));
        const anker = symbols.filter(s => s.bruch || istOperator(s));
        if (!anker.length) return linksNachRechts(symbols);

        const vergeben = new Set();
        const gruppen = [];
        // Bars claim first (numerator, denominator), then the tall operators
        // (upper limit, lower limit). A tall glyph that claims nothing - a
        // bracket, a "y" - is not an anchor at all and stays in the row.
        for (const a of anker.filter(s => s.bruch).concat(anker.filter(s => !s.bruch))) {
            if (vergeben.has(a)) continue;               // claimed by an outer fraction already
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
            gruppen.push({ x: a.bbox.x, folge: [a, ...linksNachRechts(oben), ...linksNachRechts(unten)] });
        }
        // Merge the stacked groups into the row by position - WITHOUT sorting the
        // row again: that re-sort by x undid the pen-order tie-break and put
        // Doc's prime behind the bracket (probe 13).
        const rest = linksNachRechts(symbols.filter(s => !vergeben.has(s)));
        const gs = gruppen.sort((p, q) => p.x - q.x);
        const out = [];
        let gi = 0;
        for (const s of rest) {
            while (gi < gs.length && gs[gi].x <= s.bbox.x) out.push(...gs[gi++].folge);
            out.push(s);
        }
        while (gi < gs.length) out.push(...gs[gi++].folge);
        return out;
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
        // Merging: the closest pair in BOTH directions, vertical distance counting
        // double - stacked things are different glyphs (a numerator and its
        // denominator have no horizontal gap at all, and got merged, probe 11) -
        // and a pair that was not written one after the other costs extra.
        const lh = typischeHoehe(entries);
        const nacheinander = (a, b) => {
            const ta = a.tEnd, tb = b.tStart, tc = b.tEnd, td = a.tStart;
            if (ta === null || tb === null) return true;
            return Math.min(Math.abs(tb - ta), Math.abs(td - tc)) < 1200;
        };
        while (syms.length > soll && guard--) {
            let best = null;
            for (let i = 0; i < syms.length; i++) {
                for (let k = i + 1; k < syms.length; k++) {
                    const a = syms[i], b = syms[k];
                    if (a.bruch || b.bruch) continue;
                    const cost = Math.hypot(xGap(a.bbox, b.bbox), 2 * yGap(a.bbox, b.bbox)) +
                                 (nacheinander(a, b) ? 0 : lh * 0.5);
                    if (!best || cost < best.cost) best = { cost, a, b };
                }
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
            out.push({ idx, bbox: bboxOfPoints(stroke.points), tStart: t.start, tEnd: t.end, pts: stroke.points });
        });
        return out;
    }

    // ── A long line drawn in pieces ─────────────────────────────────────────
    // Doc draws long lines in two strokes: the fraction bar of the p-q formula,
    // and the vinculum of its root, left half then right half, overlapping a
    // little (corpus probe 21). Flat, level, end to end: one line. The two bars
    // of an "=" are not pieces - they lie ABOVE each other and overlap almost
    // completely sideways.
    function stueckeZusammen(entries, lh) {
        const flach = e => e.bbox.w / e.bbox.h > 4 && e.bbox.w > lh * 0.5;
        const weg = new Set(), out = [];
        for (const a of entries) {
            if (weg.has(a.idx)) continue;
            if (!flach(a)) { out.push(a); continue; }
            const m = Object.assign({}, a, { mit: [] });
            let weiter = true;
            while (weiter) {
                weiter = false;
                for (const b of entries) {
                    if (b === a || weg.has(b.idx) || !flach(b)) continue;
                    if (xGap(b.bbox, m.bbox) > lh * 0.3) continue;
                    if (xOverlapRatio(b.bbox, m.bbox) > 0.5) continue;
                    // Level - or meeting at the join: Doc's right half sags 18 px
                    // but its ink starts where the left half ends.
                    const dy = Math.abs(centreY(b.bbox) - centreY(m.bbox));
                    if (dy > lh * 0.25 && !(dy <= lh * 0.6 && beruehrt(b.pts, [m.pts], lh * 0.25))) continue;
                    weg.add(b.idx);
                    m.mit.push(b.idx);
                    m.bbox = bboxUnion(m.bbox, b.bbox);
                    m.pts = m.pts.concat(b.pts);
                    if (b.tStart !== null && (m.tStart === null || b.tStart < m.tStart)) m.tStart = b.tStart;
                    if (b.tEnd !== null && (m.tEnd === null || b.tEnd > m.tEnd)) m.tEnd = b.tEnd;
                    weiter = true;
                }
            }
            out.push(m);
        }
        return out;
    }

    // Symbols carry the pieces again, so every stroke index is accounted for.
    function stueckeAufloesen(symbols, entries) {
        const mit = new Map(entries.filter(e => e.mit && e.mit.length).map(e => [e.idx, e.mit]));
        if (!mit.size) return;
        symbols.forEach(s => { s.strokeIdxs = s.strokeIdxs.flatMap(i => [i, ...(mit.get(i) || [])]); });
    }

    // Re-group one row to a known glyph count and put it back in reading order.
    // Returns the new symbols (or the old ones if the count cannot be reached).
    function nachjustieren(line, strokes, soll, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const entries = eintraege(strokes);
        const lh = typischeHoehe(entries);
        const neu = abgleichen(line.symbols, entries, soll);
        if (neu.length !== soll) return line.symbols;
        const geordnet = leseReihenfolge(neu, lh, o);
        geordnet.forEach((sy, i) => { sy.readIdx = i; sy.lineIdx = line.lineIdx; });
        return geordnet;
    }

    function analyse(strokes, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        const roh = eintraege(strokes);
        if (!roh.length) return { symbols: [], lines: [], lineHeight: 1 };
        const lineHeight = typischeHoehe(roh);
        const entries = stueckeZusammen(roh, lineHeight);

        let rows = splitStrokesIntoRows(entries, o);

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
        rows = verbindeHochTief(rows, lineHeight);
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
        stueckeAufloesen(all, entries);
        // Rows came out top to bottom; that is also the order they were written in
        // for a calculation worked downwards.
        return { symbols: all, lines, lineHeight };
    }

    const api = { DEFAULTS, analyse, splitStrokesIntoRows, groupRowIntoSymbols,
                  findeBruchstriche, leseReihenfolge, verbindeUeberbrueckte, verbindeHochTief, abgleichen, nachjustieren, eintraege,
                  typischeHoehe, linksNachRechts,
                  bboxOfPoints, bboxUnion, xOverlapRatio, yOverlapRatio, xGap, yGap, median };

    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.StrokeSymbols = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
