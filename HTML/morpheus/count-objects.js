// Count of *separate drawn objects* (topologically connected regions).
//
// A "8" has 3 contours (outer + 2 holes) but is ONE object.
// A "ii" has 2 contours (2 outers, no holes) and is TWO objects.
//
// We classify each contour in rawContours as either OUTER or HOLE
// by testing whether its centroid lies inside another contour
// (point-in-polygon). Contours that are inside another are holes;
// the rest are outers. The number of OUTERS = the number of objects.
//
// Reads global state: rawContours (set by extractOutline in user-draw.js).

// Ray-casting point-in-polygon (handles concave polygons).
function pointInPoly(pt, poly) {
    const [x, y] = pt;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Signed area via shoelace. Negative = clockwise, positive = counter-clockwise.
function signedArea(poly) {
    let s = 0;
    for (let i = 0; i < poly.length; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % poly.length];
        s += (x2 - x1) * (y2 + y1);
    }
    return s / 2;
}

// Classify each contour: outers + holes (with parent index).
// Returns { outers: [{idx, holes: [...holeIdxs]}], holes: [...] }
function classifyContours(contours) {
    if (!contours || contours.length === 0) return { outers: [], holes: [] };

    // Centroid of each contour
    const cs = contours.map(p => {
        let sx = 0, sy = 0;
        for (const [x, y] of p) { sx += x; sy += y; }
        return [sx / p.length, sy / p.length];
    });

    // For each contour, find its smallest enclosing parent (if any).
    // "Smallest enclosing" handles nested holes correctly (rare for letters).
    const parent = new Array(contours.length).fill(-1);
    for (let i = 0; i < contours.length; i++) {
        let bestParent = -1;
        let bestArea = Infinity;
        for (let j = 0; j < contours.length; j++) {
            if (i === j) continue;
            if (!pointInPoly(cs[i], contours[j])) continue;
            const a = Math.abs(signedArea(contours[j]));
            if (a < bestArea) { bestArea = a; bestParent = j; }
        }
        parent[i] = bestParent;
    }

    // Topological depth: outer if depth 0, hole if depth 1, nested hole if 2, etc.
    // For object-counting we only care: "is this contour at the top level (no parent)?"
    const outers = [];
    const holes = [];
    for (let i = 0; i < contours.length; i++) {
        if (parent[i] === -1) {
            outers.push({ idx: i, holes: [] });
        } else {
            holes.push({ idx: i, parent: parent[i] });
        }
    }
    // Attach holes to their outer parent
    for (const h of holes) {
        const outer = outers.find(o => o.idx === h.parent);
        if (outer) outer.holes.push(h.idx);
    }

    return { outers, holes };
}

// Number of distinct drawn objects.
function countDrawnObjects() {
    if (!rawContours || rawContours.length === 0) return 0;
    return classifyContours(rawContours).outers.length;
}

// Detailed info per object (each outer with its holes).
// Returns: [{ idx, vertexCount, area, holes: [{idx, vertexCount, area}] }, ...]
function getDrawnObjectDetails() {
    if (!rawContours || rawContours.length === 0) return [];
    const { outers } = classifyContours(rawContours);

    return outers.map(o => {
        const outerPoly = rawContours[o.idx];
        const outerArea = Math.round(Math.abs(signedArea(outerPoly)));
        return {
            idx: o.idx,
            vertexCount: outerPoly.length,
            area: outerArea,
            holes: o.holes.map(hIdx => {
                const holePoly = rawContours[hIdx];
                return {
                    idx: hIdx,
                    vertexCount: holePoly.length,
                    area: Math.round(Math.abs(signedArea(holePoly)))
                };
            })
        };
    });
}

// Pretty log summary (also writes to DebugWindow if present).
function logDrawnObjects() {
    const count = countDrawnObjects();
    if (count === 0) {
        const msg = '⊘ No objects drawn';
        console.log(msg);
        if (typeof DebugWindow !== 'undefined') DebugWindow.log(msg);
        return;
    }
    const details = getDrawnObjectDetails();
    const header = `📍 ${count} separate object${count > 1 ? 's' : ''} drawn`;
    console.log(header);
    if (typeof DebugWindow !== 'undefined') DebugWindow.log(header);
    details.forEach((d, i) => {
        const hStr = d.holes.length > 0
            ? ` with ${d.holes.length} hole${d.holes.length > 1 ? 's' : ''}`
            : '';
        const msg = `  Object ${i + 1}: ${d.vertexCount} verts, area ≈ ${d.area}px²${hStr}`;
        console.log(msg);
        if (typeof DebugWindow !== 'undefined') DebugWindow.log(msg);
    });
}
