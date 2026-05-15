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

// Outline stroke width (controlled by Left/Right arrows)
let outlineWidth = 1.5;

// Bounding box of the rendered LaTeX formula (set by renderLatexToCanvas)
let formulaBbox = null;

// ── Times digit selection (vector via opentype, fallback canvas+marching) ───
function onDigitChange(d) {
    selectedDigit = d;
    clearMorphFigure();
    // try {
    //     localStorage.setItem('morph-digit', String(d));
    //     localStorage.removeItem('morph-text');
    //     document.getElementById('text-input').value = '';
    // } catch (_) {}
    digitCtx.clearRect(0, 0, 1000, 1000);
    formulaBbox = null;

    const scale = (typeof targetScale !== 'undefined') ? targetScale : 1.0;
    if (timesFont) {
        // Vector render via opentype
        const fontSize = 640 * scale;
        const probe = timesFont.getPath(String(d), 0, 0, fontSize);
        const bbox = probe.getBoundingBox();
        const offsetX = 760 - (bbox.x1 + bbox.x2) / 2;
        const offsetY = 500 - (bbox.y1 + bbox.y2) / 2;
        const path = timesFont.getPath(String(d), offsetX, offsetY, fontSize);
        path.fill = '#F4C430';
        path.draw(digitCtx);
        targetPolygon = pathToPolygons(path, 8);
    } else {
        // Fallback: canvas fillText + Marching Squares extraction
        digitCtx.save();
        digitCtx.fillStyle = '#F4C430';
        digitCtx.font = `bold ${640 * scale}px "Times New Roman", serif`;
        digitCtx.textAlign = 'center';
        digitCtx.textBaseline = 'middle';
        digitCtx.fillText(String(d), 760, 500);
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

    // Canonical sort — deterministic baseline; Hungarian (updateMatching)
    // assigns colours independently of storage order so it survives reshuffling.
    if (targetPolygon) targetPolygon = sortContoursCanonical(targetPolygon);

    // Digit path has no LaTeX → no reading-order; clear stale state.
    targetReadingOrder = targetPolygon ? new Array(targetPolygon.length).fill(-1) : [];
    katexAtomBboxes = null;

    if (typeof updateMatching === 'function') updateMatching();

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
    // try {
    //     localStorage.setItem('morph-text', latex);
    //     localStorage.removeItem('morph-digit');
    // } catch (_) {}
    onTextInput(latex);
}

function onTextInput(text) {
    selectedDigit = null;
    clearMorphFigure();
    // DebugWindow.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    if (!text || text.trim() === '') {
        // DebugWindow.log('⊘ Empty input');
        digitCtx.clearRect(0, 0, 1000, 1000);
        targetPolygon = null;
        formulaBbox = null;
        drawTargetPolygon();
        return;
    }
    renderLatexToCanvas(text);
}

// ── Extract polygons from rendered pixels on the digit-canvas ───────────────
function extractAndUpdatePolygon() {
    // DebugWindow.log('📊 Extracting polygons (topology-aware)...');
    const imgData = digitCtx.getImageData(0, 0, 1000, 1000);
    const grid = new Uint8Array(1000 * 1000);
    for (let i = 0; i < 1000 * 1000; i++)
        grid[i] = imgData.data[i * 4 + 3] > 30 ? 1 : 0;
    const contours = getContoursWithHoles(grid, 1000, 1000);
    targetPolygon = contours.length ? contours : null;

    if (!targetPolygon) {
        // DebugWindow.log('⚠️ No polygons detected');
        return;
    }

    // DebugWindow.log(`✓ Found ${contours.length} contour(s) (outer + holes)`);
    const totalVerts = contours.reduce((s, c) => s + c.length, 0);
    // DebugWindow.log(`  Total vertices: ${totalVerts}`);

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

    // Map each target contour to its KaTeX atom (captured pre-html2canvas
    // and transformed to digit-canvas coords). The atom's reading-order
    // position is what lets matching.js distinguish duplicate symbols.
    if (targetPolygon && typeof assignContoursToAtoms === 'function'
        && katexAtomBboxes && katexAtomBboxes.length > 0) {
        targetReadingOrder = assignContoursToAtoms(targetPolygon, katexAtomBboxes);
        const haveOrder = targetReadingOrder.some(v => v >= 0);
        // DebugWindow.log(`📖 target reading-order: ${haveOrder ? '[' + targetReadingOrder.join(',') + ']' : '(none)'} | ${katexAtomBboxes.length} atom(s)`);
    } else {
        targetReadingOrder = targetPolygon ? new Array(targetPolygon.length).fill(-1) : [];
    }

    if (typeof updateMatching === 'function') updateMatching();

    const total = targetPolygon ? targetPolygon.reduce((s, p) => s + p.length, 0) : 0;
    // DebugWindow.log(`✓ Resampled to ${total} vertices (max: ${TARGET_MAX_PTS})`);

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
    // DebugWindow.log(`📝 Input: "${text}"`);
    // DebugWindow.log(`KaTeX: ${typeof katex !== 'undefined' ? '✓' : '✗'} | html2canvas: ${typeof html2canvas !== 'undefined' ? '✓' : '✗'}`);

    if (typeof katex === 'undefined') {
        // DebugWindow.log('⚠️ KaTeX not loaded');
        renderPlainText(text);
        return;
    }
    if (typeof html2canvas === 'undefined') {
        // DebugWindow.log('⚠️ html2canvas not loaded');
        renderPlainText(text);
        return;
    }

    // Special case: `\sqrt` alone → `\surd` (just the symbol, no bar)
    let processedText = text.trim();
    if (processedText === '\\sqrt') {
        processedText = '\\surd';
        // DebugWindow.log('🔄 Converting \\sqrt → \\surd (root symbol only)');
    }

    try {
        // DebugWindow.log('🔄 Rendering KaTeX...');
        const html = katex.renderToString(processedText, { throwOnError: true, displayMode: true });
        // DebugWindow.log('✓ KaTeX HTML generated');

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
            // DebugWindow.log(`DOM size: ${Math.round(rect.width)}×${Math.round(rect.height)}px`);

            // Capture reading-order atoms from the live DOM BEFORE html2canvas
            // (after which the wrapper is destroyed). Bboxes are wrapper-relative
            // and get transformed to digit-canvas coords below.
            const rawAtoms = (typeof extractKatexAtomBboxes === 'function')
                ? extractKatexAtomBboxes(wrapper) : [];
            // DebugWindow.log(`🔤 KaTeX atoms in reading order: ${rawAtoms.map(a => a.text).join(' ')}`);

            html2canvas(wrapper, {
                backgroundColor: null,
                scale: 1,
                logging: false,
                width: rect.width,
                height: rect.height
            }).then(canvas => {
                // DebugWindow.log(`✓ html2canvas: ${canvas.width}×${canvas.height}px`);

                // Find actual content bounding box (trim padding)
                const canvasCtx = canvas.getContext('2d');
                const imgData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 30) {
                        const idx = i / 4;
                        const x = idx % canvas.width;
                        const y = Math.floor(idx / canvas.width);
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }

                // Use content bbox or fallback to full canvas
                const contentW = maxX >= minX ? maxX - minX + 1 : canvas.width;
                const contentH = maxY >= minY ? maxY - minY + 1 : canvas.height;
                const contentX = maxX >= minX ? minX : 0;
                const contentY = maxY >= minY ? minY : 0;

                // Match Times digit size (~640px tall) — halved for formulas
                const ts = (typeof targetScale !== 'undefined') ? targetScale : 1.0;
                const maxW = 450 * ts, maxH = 400 * ts;
                const scale = Math.min(maxW / contentW, maxH / contentH);
                const w = contentW * scale;
                const h = contentH * scale;
                const x = 760 - w / 2;
                const y = 500 - h / 2;

                // Apply the same blit transform to the atom bboxes — they now
                // live in digit-canvas coords and can be overlapped with the
                // contours that extractAndUpdatePolygon will produce.
                katexAtomBboxes = (typeof transformAtomBboxes === 'function')
                    ? transformAtomBboxes(rawAtoms, scale, x, y) : null;

                digitCtx.drawImage(canvas, contentX, contentY, contentW, contentH, x, y, w, h);
                formulaBbox = { x, y, w, h };
                document.body.removeChild(wrapper);
                // DebugWindow.log(`✓ Drawn at (${Math.round(x)},${Math.round(y)}) ${Math.round(w)}×${Math.round(h)}px`);
                extractAndUpdatePolygon();
            }).catch(err => {
                // DebugWindow.log(`❌ html2canvas error: ${err.message}`);
                document.body.removeChild(wrapper);
                renderPlainText(text);
            });
        }, 50);
    } catch (e) {
        // DebugWindow.log(`❌ KaTeX error: ${e.message}`);
        renderPlainText(text);
    }
}

function renderPlainText(text) {
    // DebugWindow.log(`📄 Fallback to plain text: "${text}"`);
    digitCtx.clearRect(0, 0, 1000, 1000);
    digitCtx.save();
    digitCtx.fillStyle = '#F4C430';
    const ts = (typeof targetScale !== 'undefined') ? targetScale : 1.0;
    const fontSize = 640 * ts;
    digitCtx.font = `bold ${fontSize}px "Times New Roman", serif`;
    digitCtx.textAlign = 'center';
    digitCtx.textBaseline = 'middle';
    digitCtx.fillText(text, 760, 500);
    digitCtx.restore();
    // Plain-text fallback has no KaTeX structure → no atom bboxes.
    katexAtomBboxes = null;
    // DebugWindow.log('✓ Text rendered');
    extractAndUpdatePolygon();
}

// ── Outline overlay (rendered on outline-canvas, not digit-canvas) ──────────
function drawTargetPolygon() {
    outlineCtx.clearRect(0, 0, 1000, 1000);

    const showLines = document.getElementById('points-toggle')?.checked ?? true;
    const showPoints = document.getElementById('lines-toggle')?.checked ?? true;
    // DebugWindow.log(`  drawTargetPolygon: LINIE=${showLines}, PUNKTE=${showPoints}`);

    // Bounding boxes (count as "lines" — follow LINIE switch).
    // Source of truth for the user bbox is savedPixels when available
    // (so PIXEL OFF doesn't make it disappear); fall back to live draw-canvas.
    if (showLines) {
        // User formula bbox — pixel-level scan of saved/live drawing.
        const src = (typeof savedPixels !== 'undefined' && savedPixels)
            ? savedPixels
            : ((typeof drawCanvasHasContent === 'function' && drawCanvasHasContent())
                ? drawCtx.getImageData(0, 0, 1000, 1000)
                : null);
        if (src) {
            const data = src.data;
            let minX = 1000, minY = 1000, maxX = -1, maxY = -1;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 30 || data[i + 1] > 30 || data[i + 2] > 30) {
                    const idx = i / 4;
                    const x = idx % 1000;
                    const y = Math.floor(idx / 1000);
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
            if (maxX >= minX && maxY >= minY) {
                outlineCtx.save();
                outlineCtx.strokeStyle = '#adff2f';
                outlineCtx.lineWidth = outlineWidth;
                outlineCtx.lineCap = 'round';
                outlineCtx.lineJoin = 'round';
                outlineCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                outlineCtx.restore();
            }
        }

        // LaTeX formula bbox.
        if (formulaBbox) {
            outlineCtx.save();
            outlineCtx.strokeStyle = '#00d2ff';
            outlineCtx.lineWidth = outlineWidth;
            outlineCtx.lineCap = 'round';
            outlineCtx.lineJoin = 'round';
            outlineCtx.strokeRect(formulaBbox.x, formulaBbox.y, formulaBbox.w, formulaBbox.h);
            outlineCtx.restore();
        }
    }

    if (!targetPolygon) return;

    // POLYGONE FÜLLEN: paint all target sub-polygons into a single evenodd
    // path so inner holes XOR-cancel from outer fills.
    const showFill = document.getElementById('fill-toggle')?.checked ?? false;
    // DebugWindow.log(`    → drawTargetPolygon fill check: showFill=${showFill}, polys=${targetPolygon.length}`);
    if (showFill) {
        outlineCtx.save();
        outlineCtx.fillStyle = '#F4C430';
        outlineCtx.beginPath();
        let drawn = 0;
        for (const poly of targetPolygon) {
            if (!poly || poly.length < 3) continue;
            outlineCtx.moveTo(poly[0][0], poly[0][1]);
            for (let j = 1; j < poly.length; j++) outlineCtx.lineTo(poly[j][0], poly[j][1]);
            outlineCtx.closePath();
            drawn++;
        }
        outlineCtx.fill('evenodd');
        outlineCtx.restore();
        // DebugWindow.log(`    → drawTargetPolygon FILL drawn for ${drawn} polys`);
    }

    if (!showLines && !showPoints) return;

    outlineCtx.save();
    outlineCtx.lineWidth = outlineWidth;
    outlineCtx.lineCap = 'round';
    outlineCtx.lineJoin = 'round';
    let linesDrawn = 0, pointsDrawn = 0;
    for (let i = 0; i < targetPolygon.length; i++) {
        const cIdx = (typeof targetColorIdx !== 'undefined' && targetColorIdx[i] !== undefined)
            ? targetColorIdx[i] : i;
        const color = regionColor(cIdx);
        const poly = targetPolygon[i];
        if (showLines) {
            linesDrawn++;
            outlineCtx.strokeStyle = color;
            outlineCtx.beginPath();
            outlineCtx.moveTo(poly[0][0], poly[0][1]);
            for (let j = 1; j < poly.length; j++) outlineCtx.lineTo(poly[j][0], poly[j][1]);
            outlineCtx.closePath();
            outlineCtx.stroke();
        }
        if (showPoints) {
            pointsDrawn++;
            outlineCtx.fillStyle = color;
            for (const [x, y] of poly) {
                outlineCtx.beginPath();
                outlineCtx.arc(x, y, outlineWidth, 0, Math.PI * 2);
                outlineCtx.fill();
            }
        }
    }
    if (linesDrawn > 0 || pointsDrawn > 0) {
        // DebugWindow.log(`    → target: ${linesDrawn} polygons with lines, ${pointsDrawn} with points`);
    }
    outlineCtx.restore();
}
