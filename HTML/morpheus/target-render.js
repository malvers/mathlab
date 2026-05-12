// Target rendering: Times digits + LaTeX text → polygons on digit-canvas.
//
// Reads/writes global state from morph.html's inline script:
//   selectedDigit, targetPolygon, timesFont, rawContour, savedPixels
// Reads global canvas contexts:
//   digitCtx, outlineCtx
// Uses helpers from other morpheus modules:
//   getContoursWithHoles, sortContoursCanonical (contours.js)
//   pathToPolygons (geometry.js)
//   regionColor (morph-engine.js)
//   clearMorphFigure, drawPolygon (defined in morph.html)
//
// External libs:
//   opentype (vector font path), katex (LaTeX → HTML),
//   html2canvas (HTML → canvas rendering), DebugWindow

// Max polygon vertex count per sub-region (downsampling cap)
const TARGET_MAX_PTS = 300;

// ── Times digit selection (vector via opentype, fallback canvas+marching) ───
function onDigitChange(d) {
    selectedDigit = d;
    clearMorphFigure();
    try {
        localStorage.setItem('morph-digit', String(d));
        localStorage.removeItem('morph-text');
        document.getElementById('text-input').value = '';
    } catch (_) {}
    digitCtx.clearRect(0, 0, 1000, 1000);

    if (timesFont) {
        // Vector render via opentype
        const fontSize = 640;
        const probe = timesFont.getPath(String(d), 0, 0, fontSize);
        const bbox = probe.getBoundingBox();
        const offsetX = 720 - (bbox.x1 + bbox.x2) / 2;
        const offsetY = 500 - (bbox.y1 + bbox.y2) / 2;
        const path = timesFont.getPath(String(d), offsetX, offsetY, fontSize);
        path.fill = '#F4C430';
        path.draw(digitCtx);
        targetPolygon = pathToPolygons(path, 8);
    } else {
        // Fallback: canvas fillText + Marching Squares extraction
        digitCtx.save();
        digitCtx.fillStyle = '#F4C430';
        digitCtx.font = 'bold 640px "Times New Roman", serif';
        digitCtx.textAlign = 'center';
        digitCtx.textBaseline = 'middle';
        digitCtx.fillText(String(d), 720, 500);
        digitCtx.restore();

        const imgData = digitCtx.getImageData(0, 0, 1000, 1000);
        const grid = new Uint8Array(1000 * 1000);
        for (let i = 0; i < 1000 * 1000; i++)
            grid[i] = imgData.data[i * 4 + 3] > 30 ? 1 : 0;
        const contours = getContoursWithHoles(grid, 1000, 1000);
        targetPolygon = contours.length ? contours : null;
    }

    // Sub-sample each sub-polygon to a max count
    if (targetPolygon) {
        targetPolygon = targetPolygon.map(poly => {
            if (poly.length <= TARGET_MAX_PTS) return poly;
            const step = poly.length / TARGET_MAX_PTS;
            const sub = [];
            for (let i = 0; i < TARGET_MAX_PTS; i++) sub.push(poly[Math.round(i * step)]);
            return sub;
        });
    }

    // Canonical sort — keeps region colors consistent across user/target/morph.
    if (targetPolygon) targetPolygon = sortContoursCanonical(targetPolygon);

    const total = targetPolygon ? targetPolygon.reduce((s, p) => s + p.length, 0) : 0;
    const el = document.getElementById('target-count');
    if (el) el.textContent = `${total} Vertices`;

    drawTargetPolygon();
    if (rawContour && savedPixels) drawPolygon();
}

// ── Free-text input (typed value or one of the LaTeX quick buttons) ─────────
function setTextInput(latex) {
    const input = document.getElementById('text-input');
    input.value = latex;
    try {
        localStorage.setItem('morph-text', latex);
        localStorage.removeItem('morph-digit');
    } catch (_) {}
    onTextInput(latex);
}

function onTextInput(text) {
    selectedDigit = null;
    clearMorphFigure();
    DebugWindow.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    if (!text || text.trim() === '') {
        DebugWindow.log('⊘ Empty input');
        digitCtx.clearRect(0, 0, 1000, 1000);
        targetPolygon = null;
        drawTargetPolygon();
        return;
    }
    renderLatexToCanvas(text);
}

// ── Extract polygons from rendered pixels on the digit-canvas ───────────────
function extractAndUpdatePolygon() {
    DebugWindow.log('📊 Extracting polygons (topology-aware)...');
    const imgData = digitCtx.getImageData(0, 0, 1000, 1000);
    const grid = new Uint8Array(1000 * 1000);
    for (let i = 0; i < 1000 * 1000; i++)
        grid[i] = imgData.data[i * 4 + 3] > 30 ? 1 : 0;
    const contours = getContoursWithHoles(grid, 1000, 1000);
    targetPolygon = contours.length ? contours : null;

    if (!targetPolygon) {
        DebugWindow.log('⚠️ No polygons detected');
        return;
    }

    DebugWindow.log(`✓ Found ${contours.length} contour(s) (outer + holes)`);
    const totalVerts = contours.reduce((s, c) => s + c.length, 0);
    DebugWindow.log(`  Total vertices: ${totalVerts}`);

    if (targetPolygon) {
        targetPolygon = targetPolygon.map(poly => {
            if (poly.length <= TARGET_MAX_PTS) return poly;
            const step = poly.length / TARGET_MAX_PTS;
            const sub = [];
            for (let i = 0; i < TARGET_MAX_PTS; i++) sub.push(poly[Math.round(i * step)]);
            return sub;
        });
    }

    if (targetPolygon) targetPolygon = sortContoursCanonical(targetPolygon);

    const total = targetPolygon ? targetPolygon.reduce((s, p) => s + p.length, 0) : 0;
    DebugWindow.log(`✓ Resampled to ${total} vertices (max: ${TARGET_MAX_PTS})`);

    const el = document.getElementById('target-count');
    if (el) el.textContent = `${total} Vertices`;
    const latVal = document.getElementById('lat-value');
    if (latVal && typeof classifyContours === 'function') {
        latVal.textContent = classifyContours(targetPolygon).outers.length;
    }
    drawTargetPolygon();
    if (rawContour && savedPixels) drawPolygon();
}

// ── LaTeX → pixels (via KaTeX HTML → html2canvas) ───────────────────────────
function renderLatexToCanvas(text) {
    digitCtx.clearRect(0, 0, 1000, 1000);
    DebugWindow.log(`📝 Input: "${text}"`);
    DebugWindow.log(`KaTeX: ${typeof katex !== 'undefined' ? '✓' : '✗'} | html2canvas: ${typeof html2canvas !== 'undefined' ? '✓' : '✗'}`);

    if (typeof katex === 'undefined') {
        DebugWindow.log('⚠️ KaTeX not loaded');
        renderPlainText(text);
        return;
    }
    if (typeof html2canvas === 'undefined') {
        DebugWindow.log('⚠️ html2canvas not loaded');
        renderPlainText(text);
        return;
    }

    // Special case: `\sqrt` alone → `\surd` (just the symbol, no bar)
    let processedText = text.trim();
    if (processedText === '\\sqrt') {
        processedText = '\\surd';
        DebugWindow.log('🔄 Converting \\sqrt → \\surd (root symbol only)');
    }

    try {
        DebugWindow.log('🔄 Rendering KaTeX...');
        const html = katex.renderToString(processedText, { throwOnError: true, displayMode: true });
        DebugWindow.log('✓ KaTeX HTML generated');

        // Offscreen wrapper with KaTeX HTML
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        wrapper.style.cssText = `
            position: fixed;
            left: -10000px;
            top: 0;
            background: transparent;
            color: #F4C430;
            font-size: 400px;
            padding: 60px;
            display: inline-block;
            line-height: 1;
        `;
        document.body.appendChild(wrapper);

        // Let the browser lay it out before snapshotting
        setTimeout(() => {
            const rect = wrapper.getBoundingClientRect();
            DebugWindow.log(`DOM size: ${Math.round(rect.width)}×${Math.round(rect.height)}px`);

            html2canvas(wrapper, {
                backgroundColor: null,
                scale: 1,
                logging: false,
                width: rect.width,
                height: rect.height
            }).then(canvas => {
                DebugWindow.log(`✓ html2canvas: ${canvas.width}×${canvas.height}px`);

                // Match Times digit size (~640px tall) — halved for formulas
                const maxW = 450, maxH = 400;
                const scale = Math.min(maxW / canvas.width, maxH / canvas.height);
                const w = canvas.width * scale;
                const h = canvas.height * scale;
                const x = 720 - w / 2;
                const y = 500 - h / 2;

                digitCtx.drawImage(canvas, x, y, w, h);
                document.body.removeChild(wrapper);
                DebugWindow.log(`✓ Drawn at (${Math.round(x)},${Math.round(y)}) ${Math.round(w)}×${Math.round(h)}px`);
                extractAndUpdatePolygon();
            }).catch(err => {
                DebugWindow.log(`❌ html2canvas error: ${err.message}`);
                document.body.removeChild(wrapper);
                renderPlainText(text);
            });
        }, 50);
    } catch (e) {
        DebugWindow.log(`❌ KaTeX error: ${e.message}`);
        renderPlainText(text);
    }
}

function renderPlainText(text) {
    DebugWindow.log(`📄 Fallback to plain text: "${text}"`);
    digitCtx.clearRect(0, 0, 1000, 1000);
    digitCtx.save();
    digitCtx.fillStyle = '#F4C430';
    const fontSize = 640;
    digitCtx.font = `bold ${fontSize}px "Times New Roman", serif`;
    digitCtx.textAlign = 'center';
    digitCtx.textBaseline = 'middle';
    digitCtx.fillText(text, 720, 500);
    digitCtx.restore();
    DebugWindow.log('✓ Text rendered');
    extractAndUpdatePolygon();
}

// ── Outline overlay (rendered on outline-canvas, not digit-canvas) ──────────
function drawTargetPolygon() {
    outlineCtx.clearRect(0, 0, 1000, 1000);
    if (!targetPolygon) return;

    const showLines = document.getElementById('lines-toggle')?.checked ?? true;
    const showPoints = document.getElementById('points-toggle')?.checked ?? true;
    if (!showLines && !showPoints) return;

    outlineCtx.save();
    outlineCtx.lineWidth = 2;
    outlineCtx.lineCap = 'round';
    outlineCtx.lineJoin = 'round';
    for (let i = 0; i < targetPolygon.length; i++) {
        const color = regionColor(i);
        const poly = targetPolygon[i];
        if (showLines) {
            outlineCtx.strokeStyle = color;
            outlineCtx.beginPath();
            outlineCtx.moveTo(poly[0][0], poly[0][1]);
            for (let j = 1; j < poly.length; j++) outlineCtx.lineTo(poly[j][0], poly[j][1]);
            outlineCtx.closePath();
            outlineCtx.stroke();
        }
        if (showPoints) {
            outlineCtx.fillStyle = color;
            for (const [x, y] of poly) {
                outlineCtx.beginPath();
                outlineCtx.arc(x, y, 1.6, 0, Math.PI * 2);
                outlineCtx.fill();
            }
        }
    }
    outlineCtx.restore();
}
