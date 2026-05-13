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
    function shapeDescriptor(poly, eqBB) {
        const n = poly.length;
        if (n < 3) return null;
        let sx = 0, sy = 0;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let perimeter = 0;
        let signedArea = 0;
        for (let i = 0; i < n; i++) {
            const [x, y] = poly[i];
            const [x2, y2] = poly[(i + 1) % n];
            sx += x; sy += y;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            perimeter += Math.hypot(x2 - x, y2 - y);
            signedArea += (x2 - x) * (y2 + y);
        }
        const area = Math.max(1, Math.abs(signedArea) / 2);
        const w = Math.max(1, maxX - minX);
        const h = Math.max(1, maxY - minY);
        const eqW = Math.max(1, eqBB.w);
        const eqH = Math.max(1, eqBB.h);
        const cx = sx / n;
        const cy = sy / n;
        return {
            cx, cy, w, h, area, perimeter,
            nx: (cx - eqBB.cx) / (eqW / 2),
            ny: (cy - eqBB.cy) / (eqH / 2),
            size: Math.min(1, (w * h) / (eqW * eqH)),
            elong: Math.min(10, Math.max(w, h) / Math.min(w, h)),
            fuzz: Math.min(50, (perimeter * perimeter) / (4 * Math.PI * area)),
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
    // Returns { score: 0..1, breakdown: { pos, size, elong, fuzz } }
    function pairPlausibility(a, b) {
        // Position: euclidean distance in [-1,1]×[-1,1]. Y slightly weighted
        // so a top glyph doesn't pair with a bottom glyph just because X is close.
        const dx = a.nx - b.nx;
        const dy = (a.ny - b.ny) * 1.3;
        const posDist = Math.hypot(dx, dy);
        const pos = Math.max(0, 1 - posDist / 1.5);

        // Size: log-ratio of relative areas, tolerated up to ~e^1.5 (4.5×).
        const sizeRatio = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
        const size = Math.max(0, 1 - sizeRatio / 1.5);

        // Elongation: log-ratio, tolerated up to ~e^1.0 (2.7×).
        const elongRatio = Math.abs(Math.log(a.elong / b.elong));
        const elong = Math.max(0, 1 - elongRatio / 1.0);

        // Fuzziness: log-ratio, hand-drawn IS fuzzier, tolerated up to ~e^1.0.
        const fuzzRatio = Math.abs(Math.log(a.fuzz / b.fuzz));
        const fuzz = Math.max(0, 1 - fuzzRatio / 1.0);

        // Weighted sum — position dominates.
        const score = 0.50 * pos + 0.25 * size + 0.15 * elong + 0.10 * fuzz;
        return { score, breakdown: { pos, size, elong, fuzz } };
    }

    // ── Pairwise cost ──────────────────────────────────────────────────────
    // 1 - plausibility, with HARD vetoes that drive the cost to ~∞ when shapes
    // are fundamentally incompatible (e.g. a "2" mapped onto a √ overbar):
    //   • elongation mismatch > 3× (log diff > log 3 ≈ 1.1)
    //   • size mismatch > 10× (log diff > log 10 ≈ 2.3)
    //
    // Without vetoes the Hungarian solver will still gladly pair anything to
    // anything to minimise TOTAL cost. The vetoes make those impossible pairs
    // prohibitively expensive so it picks a non-pair instead.
    function pairCost(a, b) {
        const elongRatio = Math.abs(Math.log(a.elong / b.elong));
        const sizeRatio = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
        let veto = 0;
        if (elongRatio > Math.log(3)) veto += 1e6 * (elongRatio - Math.log(3));
        if (sizeRatio  > Math.log(10)) veto += 1e6 * (sizeRatio  - Math.log(10));
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
    //   ≥0.45 = meh      (paint match line muted)
    //   <0.45 = suspect  (paint match line in warning red)
    function checkMatching(pngOuterPolys, latexOuterPolys, pairing) {
        const pBB = equationBBox(pngOuterPolys);
        const lBB = equationBBox(latexOuterPolys);
        const pngDesc = pngOuterPolys.map(p => shapeDescriptor(p, pBB));
        const latexDesc = latexOuterPolys.map(p => shapeDescriptor(p, lBB));

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
            const verdict = score >= 0.70 ? 'ok' : score >= 0.45 ? 'meh' : 'suspect';
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
        return `[${m.verdict}] PNG#${m.pngIdx} (nx=${p(a.nx)},ny=${p(a.ny)},sz=${p(a.size)},el=${p(a.elong)},fz=${p(a.fuzz)}) ↔ LaTeX#${m.latIdx} (nx=${p(b.nx)},ny=${p(b.ny)},sz=${p(b.size)},el=${p(b.elong)},fz=${p(b.fuzz)}) score=${(m.score * 100).toFixed(0)}% [pos=${(bk.pos*100).toFixed(0)} sz=${(bk.size*100).toFixed(0)} el=${(bk.elong*100).toFixed(0)} fz=${(bk.fuzz*100).toFixed(0)}]`;
    }

    function describeOrphan(o, side) {
        const p = (n) => n.toFixed(2);
        const d = o.desc;
        return `[orphan ${side}] #${o.idx} (nx=${p(d.nx)},ny=${p(d.ny)},sz=${p(d.size)},el=${p(d.elong)},fz=${p(d.fuzz)}) — ${o.reason}`;
    }

    // Expose
    if (typeof window !== 'undefined') {
        window.PlausibilCheck = {
            shapeDescriptor,
            equationBBox,
            pairPlausibility,
            pairCost,
            checkMatching,
            summarize,
            describeMatch,
            describeOrphan,
        };
    }
})();
