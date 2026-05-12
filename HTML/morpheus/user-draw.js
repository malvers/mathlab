// User drawing: handles freehand input on draw-canvas, extracts outlines,
// renders the user-polygon overlay.
//
// Reads/writes global state from morph.html's inline script:
//   isDrawing, savedPixels, rawContour, rawContours,
//   userMorphPoly, userMorphPolys, targetMorphPoly, targetMorphPolys,
//   morphRaf, selectedDigit
// Reads global canvas + context refs:
//   drawCanvas, drawCtx, morphCtx
// Uses helpers from other morpheus modules:
//   getContoursWithHoles, sortContoursCanonical (contours.js)
//   rdp, resamplePolygon, findSelfIntersections (geometry.js)
//   regionColor, getLargestTargetSubPoly (morph-engine.js)
//   drawTargetPolygon, onDigitChange (target-render.js)
//   scheduleAutoSave (defined in morph.html)
//   DebugWindow

// ── Init / clear ────────────────────────────────────────────────────────────
function initDraw() {
    drawCtx.fillStyle = '#000';
    drawCtx.fillRect(0, 0, 1000, 1000);
    drawCtx.strokeStyle = '#adff2f';
    const strokeEl = document.getElementById('stroke-slider');
    drawCtx.lineWidth = strokeEl ? +strokeEl.value : 6;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
}

function clearDraw() {
    // Stop any in-progress morph animation
    cancelAnimationFrame(morphRaf);
    morphRaf = null;
    savedPixels = null;
    rawContour = null;
    rawContours = null;
    userMorphPoly = null;
    userMorphPolys = null;
    document.getElementById('vert-count').textContent = '';
    try {
        localStorage.removeItem('morph-outline');
        localStorage.removeItem('morph-outlines');
    } catch (_) {}
    initDraw();
    // Also clear the times outline overlay (digit fill stays)
    const toggle = document.getElementById('poly-toggle');
    if (selectedDigit !== null && toggle) {
        const wasChecked = toggle.checked;
        toggle.checked = false;
        onDigitChange(selectedDigit);
        toggle.checked = wasChecked;
    }
    // Clear morphed figure
    morphCtx.clearRect(0, 0, 1000, 1000);
    targetMorphPoly = null;
    targetMorphPolys = null;
    const sl = document.getElementById('morph-slider');
    const mv = document.getElementById('morph-val');
    if (sl) sl.value = 0;
    if (mv) mv.textContent = 0;
}

function resetDrawState() {
    savedPixels = null;
    rawContour = null;
    rawContours = null;
    document.getElementById('vert-count').textContent = '';
    try {
        localStorage.removeItem('morph-outline');
        localStorage.removeItem('morph-outlines');
    } catch (_) {}
}

// Translate event → canvas pixel coordinates (handles CSS scaling).
function getPos(e) {
    const r = drawCanvas.getBoundingClientRect();
    const sx = drawCanvas.width / r.width;
    const sy = drawCanvas.height / r.height;
    const s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * sx, y: (s.clientY - r.top) * sy };
}

// ── Outline extraction (pixel → polygons) ───────────────────────────────────
function extractOutline() {
    DebugWindow.log('▶ extractOutline called');
    try {
        const imgData = drawCtx.getImageData(0, 0, 1000, 1000);
        savedPixels = imgData;

        const grid = new Uint8Array(1000 * 1000);
        let filledCount = 0;
        for (let i = 0; i < 1000 * 1000; i++) {
            const v = imgData.data[i * 4] > 30 ? 1 : 0;
            grid[i] = v;
            if (v) filledCount++;
        }
        DebugWindow.log(`  grid: ${filledCount} filled pixels`);

        // Topology-aware extraction: get ALL contours (outer + holes)
        const rawList = getContoursWithHoles(grid, 1000, 1000);
        DebugWindow.log(`  getContoursWithHoles → ${rawList.length} contour(s)`);

        // Compute area (shoelace) of every contour for debug + filtering
        const polyArea = poly => {
            let a = 0;
            for (let i = 0; i < poly.length; i++) {
                const [x1, y1] = poly[i];
                const [x2, y2] = poly[(i + 1) % poly.length];
                a += (x2 - x1) * (y2 + y1);
            }
            return Math.abs(a) / 2;
        };
        const areas = rawList.map(polyArea);
        // Log sorted desc so big shapes come first
        const sortedAreas = [...areas].sort((a, b) => b - a).map(Math.round);
        DebugWindow.log(`  areas (px²): ${sortedAreas.join(', ')}`);

        // Filter out tiny specks (noise) — CAUTION: threshold tuned to keep
        // intentional small dots (i-dot, j-dot, periods) intact.
        const MIN_AREA = 100;
        const filtered = rawList.filter((_, i) => areas[i] >= MIN_AREA);
        const dropped = rawList.length - filtered.length;
        if (dropped > 0) DebugWindow.log(`  ⚠ dropped ${dropped} tiny contour(s) (< ${MIN_AREA}px²)`);

        rawContours = sortContoursCanonical(filtered);

        if (!rawContours || rawContours.length === 0) {
            rawContour = null;
            document.getElementById('vert-count').textContent = 'Nichts gefunden';
            DebugWindow.log('⚠️ extractOutline: no contours found');
            return;
        }

        // Pick the largest as the "main" contour (used for morphing reference)
        rawContour = rawContours[0];
        for (const c of rawContours) {
            if (c.length > rawContour.length) rawContour = c;
        }
        DebugWindow.log(`✓ extractOutline: ${rawContours.length} contour(s), largest=${rawContour.length} pts`);

        if (rawContour.length < 3) {
            document.getElementById('vert-count').textContent = 'Nichts gefunden';
            return;
        }

        try {
            localStorage.setItem('morph-outline', JSON.stringify(rawContour));
            localStorage.setItem('morph-outlines', JSON.stringify(rawContours));
        } catch (_) {}
        drawPolygon();
        if (selectedDigit !== null) drawTargetPolygon();
        // Topological object count (separate drawn shapes, not contours)
        if (typeof logDrawnObjects === 'function') logDrawnObjects();
        DebugWindow.log('✓ extractOutline done');
    } catch (e) {
        DebugWindow.log(`❌ extractOutline error: ${e.message}`);
        console.error('extractOutline error:', e);
    }
}

// ── Render user polygon overlay (multi-region with colors + crossings) ──────
function drawPolygon() {
    if ((!rawContour && !rawContours) || !savedPixels) return;
    drawCtx.putImageData(savedPixels, 0, 0);

    const showPoly = document.getElementById('poly-toggle')?.checked ?? true;
    const eps = +(document.getElementById('eps-slider')?.value ?? 1);

    const contours = (rawContours && rawContours.length > 0)
        ? rawContours
        : (rawContour && rawContour.length >= 3 ? [rawContour] : []);
    if (contours.length === 0) return;

    // Largest contour = the one resampled to match target (for morphing)
    let largestIdx = 0;
    for (let i = 1; i < contours.length; i++) {
        if (contours[i].length > contours[largestIdx].length) largestIdx = i;
    }

    const targetLargest = getLargestTargetSubPoly();
    let totalRdpVerts = 0, totalFinalVerts = 0, totalCrosses = 0;
    let resampled = false;
    userMorphPoly = null;

    drawCtx.save();
    drawCtx.lineWidth = 1;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    for (let ci = 0; ci < contours.length; ci++) {
        const rc = contours[ci];
        if (!rc || rc.length < 3) continue;

        let poly = rdp(rc, eps);
        totalRdpVerts += poly.length;

        // Only the largest is resampled to match target's vertex count
        if (ci === largestIdx && targetLargest && targetLargest.length >= 3) {
            let openPoly = poly;
            if (poly.length > 1 &&
                poly[0][0] === poly[poly.length - 1][0] &&
                poly[0][1] === poly[poly.length - 1][1]) {
                openPoly = poly.slice(0, -1);
            }
            poly = resamplePolygon(openPoly, targetLargest.length);
            resampled = true;
            userMorphPoly = poly.slice();
        }

        // Close polygon if needed
        if (poly.length > 2) {
            const [fx, fy] = poly[0];
            const [lx, ly] = poly[poly.length - 1];
            if ((fx - lx) ** 2 + (fy - ly) ** 2 > 4) {
                poly = [...poly, poly[0]];
            }
        }

        const isClosed = poly.length > 2 &&
            poly[0][0] === poly[poly.length - 1][0] &&
            poly[0][1] === poly[poly.length - 1][1];
        const verts = isClosed ? poly.slice(0, -1) : poly;
        totalFinalVerts += verts.length;

        const color = regionColor(ci);

        if (showPoly) {
            const showLines = document.getElementById('lines-toggle')?.checked ?? true;
            const showPoints = document.getElementById('points-toggle')?.checked ?? true;
            if (showLines) {
                drawCtx.strokeStyle = color;
                drawCtx.lineWidth = 2;
                drawCtx.beginPath();
                drawCtx.moveTo(poly[0][0], poly[0][1]);
                for (let i = 1; i < poly.length; i++) drawCtx.lineTo(poly[i][0], poly[i][1]);
                drawCtx.closePath();
                drawCtx.stroke();
            }
            if (showPoints) {
                drawCtx.fillStyle = color;
                for (const [x, y] of verts) {
                    drawCtx.beginPath();
                    drawCtx.arc(x, y, 1.6, 0, Math.PI * 2);
                    drawCtx.fill();
                }
            }
        }

        // Per-polygon self-intersection check (red highlighting)
        const crosses = findSelfIntersections(poly);
        if (crosses.length > 0) {
            totalCrosses += crosses.length;
            drawCtx.save();
            drawCtx.strokeStyle = 'rgba(255, 0, 0, 0.95)';
            drawCtx.lineWidth = 2;
            const seen = new Set();
            for (const [i, j] of crosses) {
                for (const k of [i, j]) {
                    if (seen.has(k)) continue;
                    seen.add(k);
                    drawCtx.beginPath();
                    drawCtx.moveTo(poly[k][0],     poly[k][1]);
                    drawCtx.lineTo(poly[k + 1][0], poly[k + 1][1]);
                    drawCtx.stroke();
                }
            }
            drawCtx.restore();
        }
    }

    drawCtx.restore();

    const countText = resampled
        ? `${totalRdpVerts} → ${totalFinalVerts} Vertices (${contours.length} loops)`
        : `${totalFinalVerts} Vertices (${contours.length} loops)`;
    const crossText = totalCrosses > 0 ? `  ⚠ ${totalCrosses} Cross${totalCrosses > 1 ? 'es' : ''}` : '';
    document.getElementById('vert-count').textContent = countText + crossText;
}

// ── Hide / show user art (used during morphing) ─────────────────────────────
function hideUserOutline() {
    drawCtx.save();
    drawCtx.fillStyle = '#000';
    drawCtx.fillRect(0, 0, 1000, 1000);
    drawCtx.restore();
}

function showUserOutline() {
    if (savedPixels) drawCtx.putImageData(savedPixels, 0, 0);
    if (rawContour && savedPixels) drawPolygon();
}

// ── Install drawing event listeners on draw-canvas ──────────────────────────
// Called once at boot, after drawCanvas + drawCtx are defined.
function setupUserDrawingEvents() {
    drawCanvas.addEventListener('mousedown', e => {
        if (savedPixels) { drawCtx.putImageData(savedPixels, 0, 0); resetDrawState(); }
        isDrawing = true;
        drawCtx.beginPath();
        const p = getPos(e); drawCtx.moveTo(p.x, p.y);
    });
    drawCanvas.addEventListener('mousemove', e => {
        if (!isDrawing) return;
        const p = getPos(e); drawCtx.lineTo(p.x, p.y); drawCtx.stroke();
        scheduleAutoSave();
    });
    drawCanvas.addEventListener('mouseup',    () => { isDrawing = false; });
    drawCanvas.addEventListener('mouseleave', () => { isDrawing = false; });

    drawCanvas.addEventListener('touchstart', e => {
        e.preventDefault();
        if (savedPixels) { drawCtx.putImageData(savedPixels, 0, 0); resetDrawState(); }
        isDrawing = true;
        drawCtx.beginPath();
        const p = getPos(e); drawCtx.moveTo(p.x, p.y);
    }, { passive: false });
    drawCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!isDrawing) return;
        const p = getPos(e); drawCtx.lineTo(p.x, p.y); drawCtx.stroke();
        scheduleAutoSave();
    }, { passive: false });
    drawCanvas.addEventListener('touchend', () => { isDrawing = false; });
}
