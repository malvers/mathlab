/**
 * INTEGRAL-REAKTOR ENGINE v2.0 (ULTRA-Standard)
 * Optimized for full-screen immersive rendering and glassmorphic UI integration.
 */

let state = {
    func: 'parabel',
    a: -2.0,
    b: 2.0,
    n: 10,
    mode: 'exact',
    view: {
        minX: -8,
        maxX: 8,
        minY: -2,
        maxY: 10
    }
};

function initEngine() {
    CyberCanvasInstance.init('reactor-canvas', state.view);
    
    // Wire up the engine's render loop to the canvas resize event
    CyberCanvasInstance.onResize = () => render();
    
    render();
}

// Global mapping shorthands for compatibility and brevity
const mapX = (x) => CyberCanvasInstance.mapX(x);
const mapY = (y) => CyberCanvasInstance.mapY(y);

function setMode(newMode) {
    state.mode = newMode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const txt = btn.innerText.toUpperCase();
        if (newMode === 'exact') {
            btn.classList.toggle('active', txt.includes('ANALYTISCH'));
        } else {
            btn.classList.toggle('active', txt.includes('BALKEN'));
        }
    });
    render();
}

function updateEngine() {
    const elA = document.getElementById('param-a');
    const elB = document.getElementById('param-b');
    const elN = document.getElementById('param-n');

    if (!elA || !elB || !elN) return;

    state.a = parseFloat(elA.value);
    state.b = parseFloat(elB.value);
    state.n = parseInt(elN.value);

    // Update floating value displays
    document.getElementById('val-a').innerText = state.a.toFixed(1);
    document.getElementById('val-b').innerText = state.b.toFixed(1);
    document.getElementById('val-n').innerText = state.n;

    const fObj = MathLibrary.get(state.func);
    if (fObj) {
        const tex = `\\displaystyle \\int_{${state.a.toFixed(1)}}^{${state.b.toFixed(1)}} ${fObj.tex_short || fObj.name} \\, dx`;
        CyberBranding.renderMath('formula-display', tex, { displayMode: true });
    }

    render();
}

function render() {
    if (!CyberCanvasInstance.ctx) return;
    CyberCanvasInstance.clear();

    CyberCanvasInstance.drawGrid({
        vignette: true,
        glow: true
    });

    drawIntegral();
    drawFunction();
    updateStats();
}

function drawFunction() {
    const fObj = MathLibrary.get(state.func);
    if (!fObj) return;
    const f = fObj.f;

    const ctx = CyberCanvasInstance.ctx;
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();

    const step = (state.view.maxX - state.view.minX) / 300; // Smoother curve
    for (let x = state.view.minX; x <= state.view.maxX; x += step) {
        const px = mapX(x);
        const py = mapY(f(x));
        if (x === state.view.minX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
}

function drawIntegral() {
    const fObj = MathLibrary.get(state.func);
    if (!fObj) return;
    const f = fObj.f;

    const a = Math.min(state.a, state.b);
    const b = Math.max(state.a, state.b);
    const n = state.n;
    const dx = (b - a) / n;

    const ctx = CyberCanvasInstance.ctx;
    ctx.save();

    if (state.mode === 'exact') {
        renderExact(f, a, b);
    } else if (state.mode === 'balken') {
        renderRiemann(f, a, b, n, dx, 'centered');
    }

    ctx.restore();
}

function renderExact(f, a, b) {
    const ctx = CyberCanvasInstance.ctx;
    const grad = ctx.createLinearGradient(0, mapY(4), 0, mapY(0));
    grad.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
    grad.addColorStop(1, 'rgba(157, 80, 187, 0.1)');

    ctx.fillStyle = grad;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 210, 255, 0.4)';

    ctx.beginPath();
    ctx.moveTo(mapX(a), mapY(0));
    const step = (b - a) / 100;
    for (let x = a; x <= b + step / 2; x += step) {
        ctx.lineTo(mapX(x), mapY(f(x)));
    }
    ctx.lineTo(mapX(b), mapY(0));
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function renderRiemann(f, a, b, n, dx, type) {
    const ctx = CyberCanvasInstance.ctx;
    if (type === 'centered') {
        // Draw N+1 centered bars for perfect symmetry and the "one more bar" look
        for (let i = 0; i <= n; i++) {
            const x = a + i * dx;
            const h = f(x);

            const barWidth = mapX(a + dx) - mapX(a);
            const rX = mapX(x) - barWidth / 2;
            const rY = mapY(Math.max(0, h));
            const rH = Math.abs(mapY(h) - mapY(0));

            const topY = h >= 0 ? mapY(h) : mapY(0);

            const grad = ctx.createLinearGradient(rX, topY, rX, topY + rH);
            grad.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
            grad.addColorStop(1, 'rgba(0, 210, 255, 0.1)');

            ctx.fillStyle = grad;
            ctx.fillRect(rX, topY, barWidth, rH);
        }
        return;
    }

    for (let i = 0; i < n; i++) {
        const x = a + i * dx;
        let h;
        if (type === 'left') h = f(x);
        else if (type === 'right') h = f(x + dx);
        else h = f(x + dx / 2); // Midpoint

        const rX = mapX(x);
        const rY = mapY(Math.max(0, h));
        const rW = mapX(x + dx) - rX;
        const rH = Math.abs(mapY(h) - mapY(0));

        const topY = h >= 0 ? mapY(h) : mapY(0);

        // Rect Gradient
        const grad = ctx.createLinearGradient(rX, topY, rX, topY + rH);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
        grad.addColorStop(1, 'rgba(0, 210, 255, 0.1)');

        ctx.fillStyle = grad;
        ctx.fillRect(rX, topY, rW, rH);
    }
}

function renderTrapez(f, a, b, n, dx) {
    const ctx = CyberCanvasInstance.ctx;
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.8)';
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
        const x1 = a + i * dx;
        const x2 = x1 + dx;
        const y1 = f(x1);
        const y2 = f(x2);

        const rX1 = mapX(x1);
        const rX2 = mapX(x2);
        const rY1 = mapY(y1);
        const rY2 = mapY(y2);
        const rZero = mapY(0);

        const grad = ctx.createLinearGradient(rX1, Math.min(rY1, rY2), rX1, rZero);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
        grad.addColorStop(1, 'rgba(157, 80, 187, 0.1)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(rX1, rZero);
        ctx.lineTo(rX1, rY1);
        ctx.lineTo(rX2, rY2);
        ctx.lineTo(rX2, rZero);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function updateStats() {
    const fObj = MathLibrary.get(state.func);
    if (!fObj) return;
    const f = fObj.f;

    const a = state.a;
    const b = state.b;
    const n = state.n;
    const dx = (b - a) / n;

    let approximate = 0;
    if (state.mode === 'balken') {
        for (let i = 0; i <= n; i++) approximate += f(a + i * dx) * dx;
    }

    // Exact Reference (Numerical High-Precision)
    let exact = 0;
    const highN = 2000;
    const highDx = (b - a) / highN;
    for (let i = 0; i < highN; i++) exact += f(a + (i + 0.5) * highDx) * highDx;

    // In exact mode, the "approximation" is the ground truth
    if (state.mode === 'exact') {
        approximate = exact;
    }

    const valEl = document.getElementById('integral-value');
    if (valEl) valEl.innerText = approximate.toFixed(3);

    const error = exact !== 0 ? Math.abs((approximate - exact) / exact) * 100 : 0;
    const errorEl = document.getElementById('error-display');
    if (errorEl) {
        errorEl.innerText = error.toFixed(2) + '%';
        errorEl.style.color = error < 5 ? '#ffcc00' : '#ff0055';
    }
}
