/**
 * countDrawnObjects()
 * Returns the total number of distinct shapes/regions drawn on the canvas.
 * Counts: outer contours + holes (all sub-polygons in rawContours)
 */
function countDrawnObjects() {
    if (!rawContours || rawContours.length === 0) {
        return 0;
    }
    return rawContours.length;
}

/**
 * getDrawnObjectDetails()
 * Returns detailed info about each drawn object (region).
 * [{ idx: 0, vertexCount: 42, area: 15000, role: 'outer|hole' }, ...]
 */
function getDrawnObjectDetails() {
    if (!rawContours || rawContours.length === 0) {
        return [];
    }

    const details = [];

    // Find largest (the outer contour)
    let largestIdx = 0;
    for (let i = 1; i < rawContours.length; i++) {
        if (rawContours[i].length > rawContours[largestIdx].length) {
            largestIdx = i;
        }
    }

    for (let i = 0; i < rawContours.length; i++) {
        const poly = rawContours[i];
        const verts = poly.length;
        const role = (i === largestIdx) ? 'outer' : 'hole';

        // Rough area via shoelace formula
        let area = 0;
        for (let j = 0; j < verts; j++) {
            const [x1, y1] = poly[j];
            const [x2, y2] = poly[(j + 1) % verts];
            area += (x2 - x1) * (y2 + y1);
        }
        area = Math.abs(area) / 2;

        details.push({ idx: i, vertexCount: verts, area: Math.round(area), role });
    }

    return details;
}

/**
 * Logs a formatted summary of drawn objects to the console and debug window.
 */
function logDrawnObjects() {
    const count = countDrawnObjects();
    const details = getDrawnObjectDetails();

    if (count === 0) {
        const msg = '⊘ No objects drawn';
        console.log(msg);
        if (typeof DebugWindow !== 'undefined') DebugWindow.log(msg);
        return;
    }

    const header = `📍 Drawn objects: ${count} region(s)`;
    console.log(header);
    if (typeof DebugWindow !== 'undefined') DebugWindow.log(header);

    details.forEach(d => {
        const msg = `  [${d.idx}] ${d.role.toUpperCase()} — ${d.vertexCount} vertices, area ≈ ${d.area}px²`;
        console.log(msg);
        if (typeof DebugWindow !== 'undefined') DebugWindow.log(msg);
    });
}
