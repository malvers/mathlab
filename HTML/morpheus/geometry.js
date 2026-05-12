// Pure geometry helpers — no external state, no DOM access.
// Loaded as a plain script (no module) so functions are in global scope.

// ── Point/line distance ──────────────────────────────────────────────────────
function ptLineDist([px, py], [ax, ay], [bx, by]) {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    return Math.abs(dy * px - dx * py + bx * ay - by * ax) / Math.sqrt(len2);
}

// ── Ramer–Douglas–Peucker simplification ─────────────────────────────────────
function rdp(pts, eps) {
    if (pts.length < 3) return pts.slice();
    let maxD = 0, idx = 1;
    for (let i = 1; i < pts.length - 1; i++) {
        const d = ptLineDist(pts[i], pts[0], pts[pts.length - 1]);
        if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > eps) {
        const l = rdp(pts.slice(0, idx + 1), eps);
        const r = rdp(pts.slice(idx), eps);
        return [...l.slice(0, -1), ...r];
    }
    return [pts[0], pts[pts.length - 1]];
}

// ── Resample a polygon to exactly n evenly-spaced points along its perimeter ──
function resamplePolygon(poly, n) {
    if (poly.length < 2 || n < 2) return poly.slice();
    const cumLens = [0];
    for (let i = 0; i < poly.length; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % poly.length];
        cumLens.push(cumLens[cumLens.length - 1] + Math.hypot(x2 - x1, y2 - y1));
    }
    const totalLen = cumLens[cumLens.length - 1];
    if (totalLen === 0) return poly.slice();
    const result = [];
    for (let k = 0; k < n; k++) {
        const targetDist = (k * totalLen) / n;
        let segIdx = 0;
        while (segIdx < poly.length && cumLens[segIdx + 1] < targetDist) segIdx++;
        if (segIdx >= poly.length) segIdx = poly.length - 1;
        const segStart = cumLens[segIdx];
        const segLen = cumLens[segIdx + 1] - segStart;
        const t = segLen > 0 ? (targetDist - segStart) / segLen : 0;
        const [x1, y1] = poly[segIdx];
        const [x2, y2] = poly[(segIdx + 1) % poly.length];
        result.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
    return result;
}

// ── Self-intersection check (returns crossing-pairs [i, j]) ──────────────────
// Adjacent edges (sharing an endpoint) are skipped.
function findSelfIntersections(poly) {
    const n = poly.length;
    if (n < 4) return [];
    const ccw = (p, q, r) =>
        (q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]);
    const intersect = (a, b, c, d) => {
        const d1 = ccw(c, d, a), d2 = ccw(c, d, b);
        const d3 = ccw(a, b, c), d4 = ccw(a, b, d);
        return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
               ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
    };
    const crosses = [];
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 2; j < n - 1; j++) {
            if (i === 0 && j === n - 2) continue;
            if (intersect(poly[i], poly[i + 1], poly[j], poly[j + 1])) {
                crosses.push([i, j]);
            }
        }
    }
    return crosses;
}

// ── Centroid and bounding boxes ──────────────────────────────────────────────
function centroid(poly) {
    if (!poly || poly.length === 0) return [0, 0];
    let sx = 0, sy = 0;
    for (const [x, y] of poly) { sx += x; sy += y; }
    return [sx / poly.length, sy / poly.length];
}

function bboxOf(poly) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, y] of poly) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY };
}

function bboxOfMultiPoly(polys) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of polys) {
        for (const [x, y] of p) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    return { minX, maxX, minY, maxY };
}

// ── Bezier sampling + opentype path → polygons ───────────────────────────────
function sampleQuadratic(p0, p1, p2, n) {
    const pts = [];
    for (let i = 1; i <= n; i++) {
        const t = i / n, mt = 1 - t;
        pts.push([
            mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
            mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]
        ]);
    }
    return pts;
}

function sampleCubic(p0, p1, p2, p3, n) {
    const pts = [];
    for (let i = 1; i <= n; i++) {
        const t = i / n, mt = 1 - t;
        pts.push([
            mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0],
            mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1]
        ]);
    }
    return pts;
}

function pathToPolygons(path, samplesPerCurve = 30) {
    const polys = [];
    let cur = null;
    let cx = 0, cy = 0, sx = 0, sy = 0;
    for (const cmd of path.commands) {
        switch (cmd.type) {
            case 'M':
                if (cur && cur.length) polys.push(cur);
                cur = [[cmd.x, cmd.y]];
                cx = sx = cmd.x; cy = sy = cmd.y;
                break;
            case 'L':
                cur.push([cmd.x, cmd.y]);
                cx = cmd.x; cy = cmd.y;
                break;
            case 'Q':
                cur.push(...sampleQuadratic([cx, cy], [cmd.x1, cmd.y1], [cmd.x, cmd.y], samplesPerCurve));
                cx = cmd.x; cy = cmd.y;
                break;
            case 'C':
                cur.push(...sampleCubic([cx, cy], [cmd.x1, cmd.y1], [cmd.x2, cmd.y2], [cmd.x, cmd.y], samplesPerCurve));
                cx = cmd.x; cy = cmd.y;
                break;
            case 'Z':
                cx = sx; cy = sy;
                break;
        }
    }
    if (cur && cur.length) polys.push(cur);
    return polys;
}
