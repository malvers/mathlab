/**
 * INTEGRAL-REAKTOR ENGINE v1.0
 * Logic for function calculation, integration methods, and canvas rendering.
 */

let canvas, ctx;
let width, height;
let state = {
    func: 'parabel',
    a: -2.0,
    b: 2.0,
    n: 10,
    mode: 'exact', // 'exact', 'left', 'right', 'trapez'
    view: {
        minX: -5,
        maxX: 5,
        minY: -2,
        maxY: 8
    }
};

function initEngine() {
    canvas = document.getElementById('reactor-canvas');
    ctx = canvas.getContext('2d');
    
    window.addEventListener('resize', resize);
    resize();
    render();
}

function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    render();
}

function setMode(newMode) {
    state.mode = newMode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === newMode.toLowerCase() || 
                                     (btn.innerText === 'EXAKT' && newMode === 'exact'));
    });
    render();
}

function updateEngine() {
    // state.func is now updated via the CyberUI dropdown callback
    state.a = parseFloat(document.getElementById('param-a').value);
    state.b = parseFloat(document.getElementById('param-b').value);
    state.n = parseInt(document.getElementById('param-n').value);

    // Update displays
    document.getElementById('val-a').innerText = state.a.toFixed(1);
    document.getElementById('val-b').innerText = state.b.toFixed(1);
    document.getElementById('val-n').innerText = state.n;
    
    const fObj = MathLibrary.get(state.func);
    if (fObj) {
        document.getElementById('formula-display').innerText = `∫ ${fObj.tex_short || fObj.name} dx`;
    }

    render();
}

// Coordinate Mapping
function mapX(x) {
    return (x - state.view.minX) / (state.view.maxX - state.view.minX) * width;
}

function mapY(y) {
    return height - (y - state.view.minY) / (state.view.maxY - state.view.minY) * height;
}

function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    drawGrid();
    drawIntegral();
    drawFunction();
    updateStats();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Vertical grid
    for (let x = state.view.minX; x <= state.view.maxX; x++) {
        const px = mapX(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
    }

    // Horizontal grid
    for (let y = Math.floor(state.view.minY); y <= state.view.maxY; y++) {
        const py = mapY(y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.lineWidth = 2;
    
    const xAxis = mapY(0);
    ctx.beginPath();
    ctx.moveTo(0, xAxis);
    ctx.lineTo(width, xAxis);
    ctx.stroke();

    const yAxis = mapX(0);
    ctx.beginPath();
    ctx.moveTo(yAxis, 0);
    ctx.lineTo(yAxis, height);
    ctx.stroke();
}

function drawFunction() {
    const fObj = MathLibrary.get(state.func);
    if (!fObj) return;
    const f = fObj.f;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const step = (state.view.maxX - state.view.minX) / 200;
    for (let x = state.view.minX; x <= state.view.maxX; x += step) {
        const px = mapX(x);
        const py = mapY(f(x));
        if (x === state.view.minX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawIntegral() {
    const fObj = MathLibrary.get(state.func);
    if (!fObj) return;
    const f = fObj.f;

    const a = Math.min(state.a, state.b);
    const b = Math.max(state.a, state.b);
    const n = state.n;
    const dx = (b - a) / n;

    ctx.save();
    
    if (state.mode === 'exact') {
        renderExact(f, a, b);
    } else if (state.mode === 'left') {
        renderRiemann(f, a, b, n, dx, 'left');
    } else if (state.mode === 'right') {
        renderRiemann(f, a, b, n, dx, 'right');
    } else if (state.mode === 'trapez') {
        renderTrapez(f, a, b, n, dx);
    }

    ctx.restore();
}

function renderExact(f, a, b) {
    const grad = ctx.createLinearGradient(0, mapY(4), 0, mapY(0));
    grad.addColorStop(0, 'rgba(0, 210, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 210, 255, 0.1)');

    ctx.fillStyle = grad;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0, 210, 255, 0.5)';
    
    ctx.beginPath();
    ctx.moveTo(mapX(a), mapY(0));
    for (let x = a; x <= b; x += (b - a) / 100) {
        ctx.lineTo(mapX(x), mapY(f(x)));
    }
    ctx.lineTo(mapX(b), mapY(0));
    ctx.closePath();
    ctx.fill();
}

function renderRiemann(f, a, b, n, dx, type) {
    ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.8)';
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
        const x = a + i * dx;
        const h = type === 'left' ? f(x) : f(x + dx);
        
        const rX = mapX(x);
        const rY = mapY(Math.max(0, h));
        const rW = mapX(x + dx) - rX;
        const rH = Math.abs(mapY(h) - mapY(0));
        
        const topY = h >= 0 ? mapY(h) : mapY(0);

        ctx.fillRect(rX, topY, rW, rH);
        ctx.strokeRect(rX, topY, rW, rH);
    }
}

function renderTrapez(f, a, b, n, dx) {
    ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.8)';
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
        const x1 = a + i * dx;
        const x2 = x1 + dx;
        const y1 = f(x1);
        const y2 = f(x2);

        ctx.beginPath();
        ctx.moveTo(mapX(x1), mapY(0));
        ctx.lineTo(mapX(x1), mapY(y1));
        ctx.lineTo(mapX(x2), mapY(y2));
        ctx.lineTo(mapX(x2), mapY(0));
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
    if (state.mode === 'left' || state.mode === 'exact') {
        for (let i = 0; i < n; i++) approximate += f(a + i * dx) * dx;
    } else if (state.mode === 'right') {
        for (let i = 0; i < n; i++) approximate += f(a + (i+1) * dx) * dx;
    } else if (state.mode === 'trapez') {
        for (let i = 0; i < n; i++) approximate += (f(a + i * dx) + f(a + (i+1) * dx)) / 2 * dx;
    }

    // "Exakte" Referenz (hohes N)
    let exact = 0;
    const highN = 1000;
    const highDx = (b - a) / highN;
    for (let i = 0; i < highN; i++) exact += f(a + (i + 0.5) * highDx) * highDx;

    document.getElementById('integral-value').innerText = approximate.toFixed(3);
    
    const error = exact !== 0 ? Math.abs((approximate - exact) / exact) * 100 : 0;
    const errorEl = document.getElementById('error-display');
    errorEl.innerText = error.toFixed(1) + '%';
    errorEl.style.color = error < 1 ? '#00ffcc' : error < 10 ? '#ffcc00' : '#ff0055';
}
