// Plausibility check for cross-pane outer matching.
//
// Each outer polygon gets a 5-dim shape descriptor (in NORMALIZED equation
// space — both panes' bboxes map to [-1,1]×[-1,1]):
//
//   size    — relative bbox area within the equation bbox (in [0,1])
//   elong   — max(w,h) / min(w,h) — clamped to [1, 10]
//   nx, ny  — centroid in [-1, 1] (position inside the formula)
//   fuzz    — perimeter² / (4π·area). 1.0 = perfect circle, higher = more
//             wiggly (compactness, ISO 11146-ish "form factor"). Hand-drawn
//             strokes land ~1.5–3, LaTeX glyphs ~1.2–2. Clamped to [1, 50].
//
// Pairwise plausibility = weighted similarity of those dimensions. Position
// dominates (a glyph at the top of the formula must pair with one near the
// top); size and elongation are next; fuzz is a tiebreaker. The hand vs.
// LaTeX is intentionally tolerated — small log-ratio differences shouldn't
// drop a match below the plausibility threshold.
//
// Orphans (pur nerds) — outers without a pair — are reported separately
// with their descriptor so the caller can flag them visually.

(function () {
    // ── Shape descriptor ────────────────────────────────────────────────────
    // outerPoly : the outer polygon's point list
    // holePolys : array of hole polygons (optional, default [])
    // eqBB      : the equation-bbox (for nx/ny/size normalisation)
    function shapeDescriptor(outerPoly, holePolys, eqBB) {
        const n = outerPoly.length;
        if (n < 3) return null;
        const holes = Array.isArray(holePolys) ? holePolys : [];
        let sx = 0, sy = 0;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let perimeter = 0;
        // Use BOTH shoelace variants:
        //  - signedArea (trapezoidal): for area only
        //  - acx2 / acy2 (Green's theorem with cross product): for the
        //    area-weighted centroid — captures mass distribution far better
        //    than the point-centroid (which is biased by vertex density).
        let sShoe = 0;
        let acx2 = 0, acy2 = 0;
        let cross2 = 0;
        for (let i = 0; i < n; i++) {
            const [x, y] = outerPoly[i];
            const [x2, y2] = outerPoly[(i + 1) % n];
            sx += x; sy += y;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            perimeter += Math.hypot(x2 - x, y2 - y);
            sShoe += (x2 - x) * (y2 + y);
            const cr = x * y2 - x2 * y;
            cross2 += cr;
            acx2 += (x + x2) * cr;
            acy2 += (y + y2) * cr;
        }
        const area = Math.max(1, Math.abs(sShoe) / 2);
        const w = Math.max(1, maxX - minX);
        const h = Math.max(1, maxY - minY);
        const eqW = Math.max(1, eqBB.w);
        const eqH = Math.max(1, eqBB.h);
        const pcx = sx / n;
        const pcy = sy / n;
        // Area-weighted centroid via Green's theorem. Falls back to point
        // centroid if the signed area is degenerate.
        const sa = cross2 / 2;
        let acx, acy;
        if (Math.abs(sa) > 1e-6) {
            acx = acx2 / (6 * sa);
            acy = acy2 / (6 * sa);
        } else {
            acx = pcx; acy = pcy;
        }
        const bboxCx = (minX + maxX) / 2;
        const bboxCy = (minY + maxY) / 2;
        // Mass distribution within bbox, signed in [-1, 1]:
        //   massX < 0 = mass leans LEFT (left of bbox center)
        //   massY < 0 = mass leans TOP  (above bbox center; Y grows down)
        // Critical for distinguishing visually similar letters whose loop is
        // placed differently (b vs p: bottom-heavy vs top-heavy in Y;
        // b vs d: right-leaning vs left-leaning in X).
        const massX = Math.max(-1, Math.min(1, 2 * (acx - bboxCx) / w));
        const massY = Math.max(-1, Math.min(1, 2 * (acy - bboxCy) / h));
        // Total hole-area as a fraction of outer area — distinguishes
        // e.g. "0" (large hole) from "o" with thicker stroke (smaller hole).
        let holeArea = 0;
        for (const hp of holes) {
            if (!hp || hp.length < 3) continue;
            let s = 0;
            for (let i = 0; i < hp.length; i++) {
                const [x, y] = hp[i];
                const [x2, y2] = hp[(i + 1) % hp.length];
                s += (x2 - x) * (y2 + y);
            }
            holeArea += Math.abs(s) / 2;
        }
        return {
            cx: pcx, cy: pcy, w, h, area, perimeter,
            nx: (pcx - eqBB.cx) / (eqW / 2),
            ny: (pcy - eqBB.cy) / (eqH / 2),
            size: Math.min(1, (w * h) / (eqW * eqH)),
            elong: Math.min(10, Math.max(w, h) / Math.min(w, h)),
            fuzz: Math.min(50, (perimeter * perimeter) / (4 * Math.PI * area)),
            holes: holes.length,
            holeFrac: Math.min(1, holeArea / area),
            massX, massY,
        };
    }

    function equationBBox(outerPolys) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of outerPolys) {
            for (const [x, y] of p) {
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
        }
        if (!isFinite(minX)) return { cx: 0, cy: 0, w: 1, h: 1 };
        return {
            cx: (minX + maxX) / 2,
            cy: (minY + maxY) / 2,
            w: maxX - minX,
            h: maxY - minY,
        };
    }

    // ── Pairwise plausibility ──────────────────────────────────────────────
    // Returns { score: 0..1, breakdown: {...} }.
    //
    // Six dimensions, weighted (in descending importance for typical-font
    // glyph matching where position is already roughly aligned):
    //   pos    (0.22) — centroid distance in normalised equation space
    //   mass   (0.30) — area-centroid offset within bbox (CRITICAL for b/p,
    //                   b/d, e/o, 6/9 — visually similar letters whose loop
    //                   or body is placed differently)
    //   size   (0.15) — relative area (log-ratio)
    //   holes  (0.12) — hole-count match + hole-area-fraction agreement
    //   elong  (0.13) — width-to-height ratio (log-ratio)
    //   fuzz   (0.08) — perimeter² / (4π·area), tolerant of hand-drawn noise
    function pairPlausibility(a, b) {
        const dx = a.nx - b.nx;
        const dy = (a.ny - b.ny) * 1.3;
        const pos = Math.max(0, 1 - Math.hypot(dx, dy) / 1.5);

        const sizeRatio = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
        const size = Math.max(0, 1 - sizeRatio / 1.5);

        const elongRatio = Math.abs(Math.log(a.elong / b.elong));
        const elong = Math.max(0, 1 - elongRatio / 1.0);

        const fuzzRatio = Math.abs(Math.log(a.fuzz / b.fuzz));
        const fuzz = Math.max(0, 1 - fuzzRatio / 1.0);

        // Mass: combined X+Y deviation, scaled so 1.0 (opposite side) = 0.
        const dmX = Math.abs(a.massX - b.massX);
        const dmY = Math.abs(a.massY - b.massY);
        const mass = Math.max(0, 1 - (dmX + dmY) / 1.5);

        // Holes: same count = 1.0, off-by-one = 0.5, off-by-two = 0.
        // Hole-area-fraction agreement further tunes it.
        const dh = Math.abs(a.holes - b.holes);
        const dhf = Math.abs(a.holeFrac - b.holeFrac);
        const holes = Math.max(0, 1 - dh / 2 - dhf * 0.5);

        const score = 0.22 * pos + 0.30 * mass + 0.15 * size + 0.12 * holes
                    + 0.13 * elong + 0.08 * fuzz;
        return { score, breakdown: { pos, mass, size, holes, elong, fuzz } };
    }

    // ── Shape-only plausibility ────────────────────────────────────────────
    // Ignores POSITION — pure shape comparison: mass distribution, size,
    // hole count, elongation, fuzziness. Used by the polygon-ring view where
    // the question is "which polygons LOOK alike?" regardless of formula
    // position. Re-normalised weights without the pos term.
    function shapeOnlyPlausibility(a, b) {
        const sizeRatio = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
        const size = Math.max(0, 1 - sizeRatio / 1.5);

        const elongRatio = Math.abs(Math.log(a.elong / b.elong));
        const elong = Math.max(0, 1 - elongRatio / 1.0);

        const fuzzRatio = Math.abs(Math.log(a.fuzz / b.fuzz));
        const fuzz = Math.max(0, 1 - fuzzRatio / 1.0);

        const dmX = Math.abs(a.massX - b.massX);
        const dmY = Math.abs(a.massY - b.massY);
        const mass = Math.max(0, 1 - (dmX + dmY) / 1.5);

        const dh = Math.abs(a.holes - b.holes);
        const dhf = Math.abs(a.holeFrac - b.holeFrac);
        const holes = Math.max(0, 1 - dh / 2 - dhf * 0.5);

        const score = 0.38 * mass + 0.20 * size + 0.18 * holes
                    + 0.14 * elong + 0.10 * fuzz;
        return { score, breakdown: { mass, size, holes, elong, fuzz } };
    }

    // ── Pairwise cost ──────────────────────────────────────────────────────
    // 1 - plausibility + veto terms. Vetoes catch fundamentally-incompatible
    // pairs and push their cost to ~∞ so Hungarian will not produce them:
    //   • elongation mismatch  > 3×       (e.g. "2" onto √-overbar)
    //   • size mismatch        > 10×      (e.g. "−" onto a digit's body)
    //   • hole-count mismatch  ≥ 2        (e.g. "8" onto "0")
    //   • mass-Y mismatch      > 0.5      (e.g. "b" onto "p" — opposite Y)
    //   • mass-X mismatch      > 0.7      (e.g. "b" onto "d" — mirrored)
    //   • hole-count differs by 1 AND
    //     one has none, other has one    (e.g. "c" onto "o", "n" onto "a")
    function pairCost(a, b) {
        const elongRatio = Math.abs(Math.log(a.elong / b.elong));
        const sizeRatio = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
        const dh = Math.abs(a.holes - b.holes);
        const dmY = Math.abs(a.massY - b.massY);
        const dmX = Math.abs(a.massX - b.massX);
        let veto = 0;
        if (elongRatio > Math.log(3))  veto += 1e6 * (elongRatio - Math.log(3));
        if (sizeRatio  > Math.log(10)) veto += 1e6 * (sizeRatio  - Math.log(10));
        if (dh >= 2)                   veto += 1e6 * (dh - 1);
        if (dmY > 0.5)                 veto += 5e5 * (dmY - 0.5);
        if (dmX > 0.7)                 veto += 5e5 * (dmX - 0.7);
        const { score } = pairPlausibility(a, b);
        return (1 - score) + veto;
    }

    // ── Run plausibility check ─────────────────────────────────────────────
    // Inputs:
    //   pngOuterPolys, latexOuterPolys : arrays of polygon point-lists
    //   pairing                        : array[N] where pairing[i] = j or -1
    //                                    meaning PNG-outer i is matched to
    //                                    LaTeX-outer j (or unmatched).
    // Returns:
    //   {
    //     pngDesc:    [shapeDescriptor, ...],
    //     latexDesc:  [shapeDescriptor, ...],
    //     matches:    [{pngIdx, latIdx, score, breakdown, verdict}],
    //     pngOrphans: [{idx, desc, reason}],
    //     latexOrphans:[{idx, desc, reason}],
    //     summary:    {avg, ok, suspect, png_orphans, latex_orphans}
    //   }
    //
    // verdict ∈ { 'ok', 'meh', 'suspect' } based on score:
    //   ≥0.70 = ok       (paint match line normally)
    //   ≥0.55 = meh      (paint match line muted; drop threshold is 0.55 so
    //                     anything in this range is borderline-kept)
    //   <0.55 = suspect  (would have been dropped — only shown if reported
    //                     pre-drop, e.g. in diagnostics)
    // pngDesc/latexDesc may be PASSED IN as pre-computed descriptors
    // (preferred — avoids duplicate work and guarantees the same descriptors
    // used by the matcher's cost function). Otherwise computed from the
    // outer polygon arrays without hole info (legacy fallback).
    function checkMatching(pngOuterPolys, latexOuterPolys, pairing, pngDescIn, latexDescIn) {
        const pBB = equationBBox(pngOuterPolys);
        const lBB = equationBBox(latexOuterPolys);
        const pngDesc = pngDescIn || pngOuterPolys.map(p => shapeDescriptor(p, [], pBB));
        const latexDesc = latexDescIn || latexOuterPolys.map(p => shapeDescriptor(p, [], lBB));

        const matches = [];
        const pngOrphans = [];
        const latexOrphans = [];
        const matchedLatex = new Set();

        for (let i = 0; i < pngDesc.length; i++) {
            const j = pairing && pairing[i] !== undefined ? pairing[i] : -1;
            const a = pngDesc[i];
            if (!a) continue;
            if (j < 0 || j >= latexDesc.length || !latexDesc[j]) {
                pngOrphans.push({ idx: i, desc: a, reason: 'no-pair' });
                continue;
            }
            matchedLatex.add(j);
            const { score, breakdown } = pairPlausibility(a, latexDesc[j]);
            const verdict = score >= 0.70 ? 'ok' : score >= 0.55 ? 'meh' : 'suspect';
            matches.push({
                pngIdx: i, latIdx: j, score, breakdown, verdict,
                descA: a, descB: latexDesc[j],
            });
        }

        for (let j = 0; j < latexDesc.length; j++) {
            if (!matchedLatex.has(j) && latexDesc[j]) {
                latexOrphans.push({ idx: j, desc: latexDesc[j], reason: 'no-pair' });
            }
        }

        const avg = matches.length
            ? matches.reduce((s, m) => s + m.score, 0) / matches.length : 0;
        const ok = matches.filter(m => m.verdict === 'ok').length;
        const suspect = matches.filter(m => m.verdict === 'suspect').length;

        return {
            pngDesc, latexDesc,
            matches, pngOrphans, latexOrphans,
            summary: {
                avg,
                ok,
                suspect,
                png_orphans: pngOrphans.length,
                latex_orphans: latexOrphans.length,
            },
        };
    }

    // ── Format a one-line debug summary for the DebugWindow ────────────────
    function summarize(report) {
        const s = report.summary;
        return `Plausibility: avg=${(s.avg * 100).toFixed(0)}% ok=${s.ok} suspect=${s.suspect} orphans png=${s.png_orphans} latex=${s.latex_orphans}`;
    }

    // ── Pretty-print one match for diagnostics ─────────────────────────────
    function describeMatch(m) {
        const p = (n) => n.toFixed(2);
        const a = m.descA, b = m.descB;
        const bk = m.breakdown;
        const pct = v => (v * 100).toFixed(0);
        return `[${m.verdict}] PNG#${m.pngIdx} (mY=${p(a.massY)},mX=${p(a.massX)},h=${a.holes},sz=${p(a.size)},el=${p(a.elong)}) ↔ LaTeX#${m.latIdx} (mY=${p(b.massY)},mX=${p(b.massX)},h=${b.holes},sz=${p(b.size)},el=${p(b.elong)}) score=${pct(m.score)}% [pos=${pct(bk.pos)} mass=${pct(bk.mass)} sz=${pct(bk.size)} h=${pct(bk.holes)} el=${pct(bk.elong)} fz=${pct(bk.fuzz)}]`;
    }

    function describeOrphan(o, side) {
        const p = (n) => n.toFixed(2);
        const d = o.desc;
        return `[orphan ${side}] #${o.idx} (nx=${p(d.nx)},ny=${p(d.ny)},mY=${p(d.massY)},mX=${p(d.massX)},h=${d.holes},sz=${p(d.size)},el=${p(d.elong)}) — ${o.reason}`;
    }

    // Expose
    if (typeof window !== 'undefined') {
        window.PlausibilCheck = {
            shapeDescriptor,
            equationBBox,
            pairPlausibility,
            shapeOnlyPlausibility,
            pairCost,
            checkMatching,
            summarize,
            describeMatch,
            describeOrphan,
        };
    }
})();
