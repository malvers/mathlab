// Reading-order inference: gives each contour a "reading position index" that
// reflects how a human would read the formula (left-to-right, with numerators
// before denominators in fractions). When user and target both have these,
// the cost in matching.js gets a strong order-distance term — which is the
// only signal that can distinguish two identical symbols (e.g. ∂…∂).
//
// Two independent producers:
//   • User side  — inferSpatialReadingOrder(contours): pure geometry, detects
//                  horizontal "fraction bars" and groups what's above/below.
//   • Target side — extractKatexAtomBboxes(wrapperEl): walks the KaTeX DOM in
//                  reading order (special-casing .mfrac, which renders denom
//                  first in DOM but is read numerator-first). Then
//                  assignContoursToAtoms() maps each contour to its atom.
//
// Reads helpers from other morpheus modules:
//   bboxOf, centroid (geometry.js)

// ── User side: spatial reading-order ────────────────────────────────────────
// Strategy:
//   1. Detect candidate fraction bars (high width:height ratio, with stuff
//      both above AND below them in the same X-band).
//   2. Each fraction is its own "unit": numerator contours (left→right),
//      then bar, then denominator contours (left→right).
//   3. Non-fraction contours are singleton units.
//   4. Sort all units by leftmost X. Flatten to a single order sequence.
function inferSpatialReadingOrder(contours) {
    if (!contours || contours.length === 0) return [];

    const items = contours.map((c, i) => {
        const bb = bboxOf(c);
        const ctr = centroid(c);
        return {
            idx: i,
            cx: ctr[0], cy: ctr[1],
            w: bb.maxX - bb.minX,
            h: bb.maxY - bb.minY,
            minX: bb.minX, maxX: bb.maxX,
            minY: bb.minY, maxY: bb.maxY,
        };
    });

    // Detect fraction bars
    const fractionGroups = [];
    const claimed = new Set();
    for (const cand of items) {
        if (claimed.has(cand.idx)) continue;
        const aspect = cand.w / Math.max(cand.h, 1);
        // Bar must be substantially wider than tall AND reasonably long
        if (aspect < 4 || cand.w < 40) continue;

        const xLo = cand.minX, xHi = cand.maxX;
        const xPad = 30; // small slop for off-by-pixel
        const above = [], below = [];
        for (const other of items) {
            if (other.idx === cand.idx || claimed.has(other.idx)) continue;
            if (other.cx < xLo - xPad || other.cx > xHi + xPad) continue;
            if (other.cy < cand.minY - 5) above.push(other);
            else if (other.cy > cand.maxY + 5) below.push(other);
        }
        // Real fraction bar must have content on BOTH sides
        // (this excludes "=" bars, which only have each other).
        if (above.length === 0 || below.length === 0) continue;

        above.sort((a, b) => a.cx - b.cx);
        below.sort((a, b) => a.cx - b.cx);
        fractionGroups.push({ bar: cand, num: above, den: below });
        claimed.add(cand.idx);
        for (const a of above) claimed.add(a.idx);
        for (const b of below) claimed.add(b.idx);
    }

    // Build units: each unit is either a single non-fraction contour or a fraction
    const units = [];
    for (const item of items) {
        if (claimed.has(item.idx)) continue;
        units.push({ leftX: item.minX, order: [item.idx] });
    }
    for (const fg of fractionGroups) {
        const ord = [];
        for (const n of fg.num) ord.push(n.idx);
        ord.push(fg.bar.idx);
        for (const d of fg.den) ord.push(d.idx);
        units.push({ leftX: fg.bar.minX, order: ord });
    }
    units.sort((a, b) => a.leftX - b.leftX);

    const result = new Array(contours.length).fill(-1);
    let pos = 0;
    for (const u of units) {
        for (const idx of u.order) result[idx] = pos++;
    }
    return result;
}

// ── Target side: KaTeX DOM → ordered atom bboxes ───────────────────────────
// Returns an array of atoms in reading order. Each atom has:
//   { text, bbox: { minX, minY, maxX, maxY }, className }
// Bboxes are RELATIVE to wrapperEl (subtract wrapperEl.getBoundingClientRect).
// Call BEFORE html2canvas; transform later with the same scale+offset that
// drawImage(canvas, ...) uses to blit the rendered KaTeX onto digit-canvas.
function extractKatexAtomBboxes(wrapperEl) {
    if (!wrapperEl) return [];
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const out = [];

    // Skip .katex-mathml — it's the hidden accessibility duplicate.
    const visualRoot = wrapperEl.querySelector('.katex-html') || wrapperEl;
    walkAtomsReadingOrder(visualRoot, out, wrapperRect);
    return out;
}

// Is this element a leaf with visible content?
// - has non-empty text AND no element child contributes text, OR
// - is a .frac-line (visible bar, no text).
function isAtomLeaf(el) {
    if (!el || el.nodeType !== 1) return false;
    const hasFracLine = el.classList && el.classList.contains('frac-line');
    const txt = (el.textContent || '').trim();
    if (txt.length === 0) return hasFracLine;
    for (const child of el.children) {
        if ((child.textContent || '').trim().length > 0) return false;
    }
    return true;
}

// Pre-order DFS, but inside .mfrac we visit children of the inner .vlist
// in TOP-DOWN visual order (numerator first → frac-line → denominator),
// which inverts KaTeX's DOM order (which is denom-first for layout reasons).
function walkAtomsReadingOrder(el, out, wrapperRect) {
    if (!el || el.nodeType !== 1) return;
    // Skip MathML accessibility tree wherever we re-encounter it.
    if (el.classList && el.classList.contains('katex-mathml')) return;

    if (el.classList && el.classList.contains('mfrac')) {
        const vlist = el.querySelector('.vlist');
        if (vlist) {
            const subs = Array.from(vlist.children);
            // Sort by actual rendered top — smaller top = higher = numerator.
            subs.sort((a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            for (const sub of subs) walkAtomsReadingOrder(sub, out, wrapperRect);
            return;
        }
        // Fallthrough if .vlist missing — let it walk in DOM order.
    }

    if (isAtomLeaf(el)) {
        const r = el.getBoundingClientRect();
        if (r.width > 1 && r.height > 1) {
            out.push({
                text: (el.textContent || '').trim() || 'frac-line',
                className: el.className || '',
                bbox: {
                    minX: r.left - wrapperRect.left,
                    minY: r.top - wrapperRect.top,
                    maxX: r.right - wrapperRect.left,
                    maxY: r.bottom - wrapperRect.top,
                },
            });
        }
        return;
    }

    for (const child of el.children) {
        walkAtomsReadingOrder(child, out, wrapperRect);
    }
}

// Transform wrapper-relative bboxes to drawCanvas coordinates using the same
// scale + offset that drawImage(canvas, x, y, w, h) used to blit the rendered
// KaTeX onto digit-canvas. (canvas was html2canvas(wrapper), so canvas pixel
// (cx, cy) = wrapper-relative pixel (cx, cy).)
function transformAtomBboxes(atoms, scale, offsetX, offsetY) {
    return atoms.map(a => ({
        ...a,
        bbox: {
            minX: offsetX + a.bbox.minX * scale,
            minY: offsetY + a.bbox.minY * scale,
            maxX: offsetX + a.bbox.maxX * scale,
            maxY: offsetY + a.bbox.maxY * scale,
        },
    }));
}

// Assign each target contour to its best-overlapping atom. Returns an array
// `order[i]` = atom index in reading order for contour i (or -1 if no overlap).
function assignContoursToAtoms(contours, atoms) {
    if (!contours || !atoms || atoms.length === 0) {
        return new Array(contours ? contours.length : 0).fill(-1);
    }
    const N = contours.length;
    const order = new Array(N).fill(-1);
    for (let i = 0; i < N; i++) {
        const cb = bboxOf(contours[i]);
        const ca = (cb.maxX - cb.minX) * (cb.maxY - cb.minY);
        let bestIdx = -1, bestScore = 0;
        for (let s = 0; s < atoms.length; s++) {
            const sb = atoms[s].bbox;
            const ox = Math.max(0, Math.min(cb.maxX, sb.maxX) - Math.max(cb.minX, sb.minX));
            const oy = Math.max(0, Math.min(cb.maxY, sb.maxY) - Math.max(cb.minY, sb.minY));
            const overlap = ox * oy;
            // Score: overlap area normalized by contour area. Robust to differently
            // sized bboxes — what matters is "how much of contour is inside atom".
            const score = ca > 0 ? overlap / ca : 0;
            if (score > bestScore) { bestScore = score; bestIdx = s; }
        }
        // Require at least 25% of contour area to be inside the atom bbox.
        if (bestScore >= 0.25) order[i] = bestIdx;
    }
    return order;
}
