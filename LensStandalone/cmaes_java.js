/**
 * OPTI-LENS Standalone (cmaes_java.js)
 * RESTORED STABLE VERSION (Prioritizing Back Optimization)
 */

class CMAES {
    constructor(xstart, sigma, popsize = null) {
        const N = xstart.length; this.N = N; this.xmean = [...xstart]; this.sigma = sigma;
        this.lambda = popsize || (4 + Math.floor(3 * Math.log(N))); this.mu = Math.floor(this.lambda / 2);
        this.weights = new Array(this.mu).fill(0).map((_, i) => Math.log(this.mu + 0.5) - Math.log(i + 1));
        const sumW = this.weights.reduce((a, b) => a + b, 0); this.weights = this.weights.map(w => w / sumW);
        this.mueff = 1 / this.weights.reduce((a, b) => a + b * b, 0);
        this.cc = (4 + this.mueff / N) / (N + 4 + 2 * this.mueff / N); this.cs = (this.mueff + 2) / (N + this.mueff + 5);
        this.c1 = 2 / (Math.pow(N + 1.3, 2) + this.mueff);
        this.cmu = Math.min(1 - this.c1, 2 * (this.mueff - 2 + 1 / this.mueff) / (Math.pow(N + 2, 2) + this.mueff));
        this.damps = 1 + 2 * Math.max(0, Math.sqrt((this.mueff - 1) / (N + 1)) - 1) + this.cs;
        this.pc = new Array(N).fill(0); this.ps = new Array(N).fill(0);
        this.B = this.eye(N); this.D = new Array(N).fill(1); this.C = this.eye(N); this.invsqrtC = this.eye(N);
        this.eigeneval = 0; this.chiN = Math.sqrt(N) * (1 - 1 / (4 * N) + 1 / (21 * N * N)); this.counteval = 0;
    }
    eye(dim) { return new Array(dim).fill(0).map((_, i) => { const row = new Array(dim).fill(0); row[i] = 1; return row; }); }
    ask() {
        const samples = [];
        for (let i = 0; i < this.lambda; i++) {
            const z = new Array(this.N).fill(0).map(() => this.randn());
            const y = this.B.map((row, r) => row.reduce((sum, b, c) => sum + b * this.D[c] * z[c], 0));
            samples.push(this.xmean.map((m, j) => m + this.sigma * y[j]));
        }
        return samples;
    }
    tell(arx, fitvals) {
        this.counteval += fitvals.length; const N = this.N; const indices = fitvals.map((v, i) => i).sort((a, b) => fitvals[a] - fitvals[b]);
        const xold = [...this.xmean];
        for (let i = 0; i < N; i++) { let sum = 0; for (let j = 0; j < this.mu; j++) sum += this.weights[j] * arx[indices[j]][i]; this.xmean[i] = sum; }
        const y = this.xmean.map((m, i) => (m - xold[i]) / this.sigma);
        const z = this.multiply(this.invsqrtC, y); const cs_factor = Math.sqrt(this.cs * (2 - this.cs) * this.mueff);
        for (let i = 0; i < N; i++) this.ps[i] = (1 - this.cs) * this.ps[i] + cs_factor * z[i];
        const ps_norm = Math.sqrt(this.ps.reduce((s, v) => s + v * v, 0));
        const hsig = ps_norm / Math.sqrt(1 - Math.pow(1 - this.cs, 2 * this.counteval / this.lambda)) / this.chiN < 1.4 + 2 / (N + 1);
        const cc_factor = Math.sqrt(this.cc * (2 - this.cc) * this.mueff);
        for (let i = 0; i < N; i++) this.pc[i] = (1 - this.cc) * this.pc[i] + (hsig ? cc_factor * y[i] : 0);
        const artmp = indices.slice(0, this.mu).map(idx => arx[idx].map((v, i) => (v - xold[i]) / this.sigma));
        const old_c1 = hsig ? this.c1 : this.c1 * (1 - this.cc * (2 - this.cc));
        for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) { let rank_mu = 0; for (let k = 0; k < this.mu; k++) rank_mu += this.weights[k] * artmp[k][i] * artmp[k][j];
                this.C[i][j] = (1 - this.c1 - this.cmu) * this.C[i][j] + this.c1 * (this.pc[i] * this.pc[j] + old_c1 * this.C[i][j]) + this.cmu * rank_mu; } }
        this.sigma *= Math.exp((this.cs / this.damps) * (ps_norm / this.chiN - 1));
        if (this.counteval - this.eigeneval > this.lambda / (this.c1 + this.cmu) / N / 10) this.updateEigensystem();
    }
    updateEigensystem() {
        this.eigeneval = this.counteval;
        for (let i = 0; i < this.N; i++) { for (let j = 0; j < i; j++) this.C[i][j] = this.C[j][i] = (this.C[i][j] + this.C[j][i]) / 2; }
        const res = this.decompose(this.C); this.B = res.V; this.D = res.d.map(v => Math.sqrt(Math.max(0, v)));
        for (let i = 0; i < this.N; i++) { for (let j = 0; j < this.N; j++) { let sum = 0; for (let k = 0; k < this.N; k++) sum += this.B[i][k] * (1 / (this.D[k] || 1e-10)) * this.B[j][k]; this.invsqrtC[i][j] = sum; } }
    }
    decompose(C) {
        const N = this.N; const V = this.eye(N); const d = new Array(N); const A = C.map(row => [...row]);
        for (let i = 0; i < N; i++) d[i] = A[i][i];
        for (let iter = 0; iter < 50; iter++) {
            let max_off = 0; for (let i = 0; i < N - 1; i++) { for (let j = i + 1; j < N; j++) max_off = Math.max(max_off, Math.abs(A[i][j])); }
            if (max_off < 1e-15) break;
            for (let i = 0; i < N - 1; i++) { for (let j = i + 1; j < N; j++) { const off = Math.abs(A[i][j]); if (off > 0) { const h = d[j] - d[i]; let t; if (Math.abs(h) + off === Math.abs(h)) t = A[i][j] / h; else { const theta = 0.5 * h / A[i][j]; t = 1 / (Math.abs(theta) + Math.sqrt(1 + theta * theta)); if (theta < 0) t = -t; }
                        const c = 1 / Math.sqrt(1 + t * t); const s = t * c; const tau = s / (1 + c); const temp = t * A[i][j]; d[i] -= temp; d[j] += temp; A[i][j] = 0;
                        for (let k = 0; k < i; k++) { const g = A[k][i], h = A[k][j]; A[k][i] = g - s * (h + g * tau); A[k][j] = h + s * (g - h * tau); }
                        for (let k = i + 1; k < j; k++) { const g = A[i][k], h = A[k][j]; A[i][k] = g - s * (h + g * tau); A[k][j] = h + s * (g - h * tau); }
                        for (let k = j + 1; k < N; k++) { const g = A[i][k], h = A[j][k]; A[i][k] = g - s * (h + g * tau); A[j][k] = h + s * (g - h * tau); }
                        for (let k = 0; k < N; k++) { const g = V[k][i], h = V[k][j]; V[k][i] = g - s * (h + g * tau); V[k][j] = h + s * (g - h * tau); } } } }
        }
        return { d, V };
    }
    multiply(m, v) { return m.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0)); }
    randn() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); }
}

const Physics = {
    FARE: 4000.0,
    angleBetween2Lines(l1, l2) {
        const dx1 = l1.x1 - l1.x2; const dy1 = l1.y1 - l1.y2;
        const dx2 = l2.x1 - l2.x2; const dy2 = l2.y1 - l2.y2;
        const m = dy1 * dy2 + dx1 * dx2;
        const d = Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2);
        return -Math.acos(m / (d || 1e-18));
    },
    lineIntersection2D(l1, l2, intersect) {
        const denom = (l1.x2 - l1.x1) * (l2.y2 - l2.y1) - (l1.y2 - l1.y1) * (l2.x2 - l2.x1);
        const rnum = (l1.y1 - l2.y1) * (l2.x2 - l2.x1) - (l1.x1 - l2.x1) * (l2.y2 - l2.y1);
        if (denom === 0) return false;
        const r = rnum / denom;
        const snum = (l1.y1 - l2.y1) * (l1.x2 - l1.x1) - (l1.x1 - l2.x1) * (l1.y2 - l1.y1);
        const s = snum / denom;
        if (r >= 0 && r <= 1 && s >= 0 && s <= 1) {
            intersect.x = l1.x1 + (l1.x2 - l1.x1) * r; intersect.y = l1.y1 + (l1.y2 - l1.y1) * r;
            return true;
        }
        return false;
    }
};

const App = {
    canvas: null, ctx: null,
    points: [], basePoints: [], focus: { x: 850, y: 380 },
    es: null, generation: 0, fitness: 0, penalty: 0, calls: 0,
    nLens: 0.80, nAir: 1.0, sigma: 0.1, ppsSide: 23,
    paused: true, dragging: null, showRays: true,
    offsetX: 200, offsetY: 180, perimeter: 400,

    init() {
        this.canvas = document.getElementById('lensCanvas');
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('resize', () => this.resize()); this.resize();
        document.getElementById('btn-play').onclick = () => this.togglePlay();
        document.getElementById('btn-reset').onclick = () => this.reset();
        document.getElementById('slider-n').oninput = (e) => { this.nLens = parseFloat(e.target.value); document.getElementById('val-n').innerText = this.nLens.toFixed(2); };
        document.getElementById('slider-sigma').oninput = (e) => { this.sigma = parseFloat(e.target.value); document.getElementById('val-sigma').innerText = this.sigma.toFixed(3); if (this.es) this.es.sigma = this.sigma; };
        this.canvas.onmousedown = (e) => this.handleMouseDown(e);
        window.onmousemove = (e) => this.handleMouseMove(e);
        window.onmouseup = () => this.handleMouseUp();
        window.onkeydown = (e) => this.handleKeyDown(e);
        this.reset(); this.animate();
    },
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; },
    reset() {
        this.points = []; const w = 150; const space = this.perimeter / (this.ppsSide - 1);
        for (let i = 0; i < this.ppsSide; i++) this.points.push({ x: this.offsetX - w/2, y: this.offsetY + i * space });
        for (let i = 0; i < this.ppsSide; i++) this.points.push({ x: this.offsetX + w/2, y: this.offsetY + this.perimeter - i * space });
        this.basePoints = this.points.map(p => ({ ...p }));
        this.focus = { x: 850, y: this.offsetY + this.perimeter / 2 };
        this.es = null; this.generation = 0; this.fitness = 0; this.penalty = 0; this.calls = 0; this.paused = true;
        const btn = document.getElementById('btn-play'); if(btn) btn.innerHTML = 'START';
        this.updateFlags();
    },
    updateFlags() {
        const f = document.getElementById('check-front');
        const b = document.getElementById('check-back');
        const doFront = f ? f.checked : false;
        const doBack = b ? b.checked : true;
        
        let dim = 0;
        if (doFront) dim += this.ppsSide;
        if (doBack) dim += this.ppsSide;
        
        const d = document.getElementById('val-dim'); if(d) d.innerText = dim;
        return { doFront, doBack, dim };
    },
    togglePlay() {
        if (!this.es) {
            const flags = this.updateFlags();
            this.es = new CMAES(new Array(flags.dim).fill(0), this.sigma, 20);
        }
        this.paused = !this.paused; 
        const btn = document.getElementById('btn-play'); if(btn) btn.innerHTML = this.paused ? 'START' : 'PAUSE';
    },
    toLens(vec, points) {
        const newPoints = points.map(p => ({ ...p }));
        const flags = this.updateFlags();
        let cursor = 0;
        if (flags.doFront) {
            for (let i = 0; i < this.ppsSide; i++) {
                newPoints[i].x = this.basePoints[i].x + vec[cursor++];
            }
        }
        if (flags.doBack) {
            const backOffset = this.ppsSide;
            for (let i = 0; i < this.ppsSide; i++) {
                newPoints[backOffset + i].x = this.basePoints[backOffset + i].x + vec[cursor++];
            }
        }
        return newPoints;
    },
    calcPathAndQuality(points) {
        let qualityFocus = 0; const raysIn = []; const raysInter = []; const raysOut = [];
        const space = this.perimeter / (this.ppsSide - 1); const fare = Physics.FARE;
        let missingRays = 0;

        // 1. Check for Self-Intersection (Front crossing Back) -> MUERTO
        for (let i = 0; i < this.ppsSide; i++) {
            if (points[i].x >= points[this.ppsSide + i].x - 5) return 1e20;
        }

        for (let i = 0; i < this.ppsSide - 1; i++) raysIn.push({ x1: -fare, y1: this.offsetY + i * space + space/2, x2: fare, y2: this.offsetY + i * space + space/2 });
        for (let i = 0; i < raysIn.length; i++) {
            const ray = raysIn[i]; let hitFront = false;
            for (let j = 0; j < this.ppsSide - 1; j++) {
                const seg = { x1: points[j].x, y1: points[j].y, x2: points[j+1].x, y2: points[j+1].y };
                const intersect = { x: 0, y: 0 };
                if (Physics.lineIntersection2D(ray, seg, intersect)) {
                    ray.x2 = intersect.x; ray.y2 = intersect.y;
                    const angleIn = Physics.angleBetween2Lines(ray, seg) + Math.PI/2;
                    const arg = (this.nAir / this.nLens) * Math.sin(angleIn);
                    if (Math.abs(arg) <= 1.0) {
                        const angleOut = Math.asin(arg); const dy = Math.sin(angleIn - angleOut) * fare;
                        raysInter.push({ x1: intersect.x, y1: intersect.y, x2: intersect.x + fare, y2: intersect.y - dy });
                        hitFront = true;
                    }
                    break;
                }
            }
            if (!hitFront) missingRays++;
        }
        
        const backOffset = this.ppsSide;
        for (let i = 0; i < raysInter.length; i++) {
            const ray = raysInter[i]; let hitBack = false;
            for (let j = 0; j < this.ppsSide - 1; j++) {
                const seg = { x1: points[backOffset+j].x, y1: points[backOffset+j].y, x2: points[backOffset+j+1].x, y2: points[backOffset+j+1].y };
                const intersect = { x: 0, y: 0 };
                if (Physics.lineIntersection2D(ray, seg, intersect)) {
                    ray.x2 = intersect.x; ray.y2 = intersect.y;
                    const angleIn = Physics.angleBetween2Lines(ray, seg) + Math.PI/2;
                    const arg = (this.nLens / this.nAir) * Math.sin(angleIn);
                    if (Math.abs(arg) <= 1.0) {
                        const angleOut = Math.asin(arg); const dy = Math.sin(angleIn - angleOut) * fare;
                        raysOut.push({ x1: intersect.x, y1: intersect.y, x2: intersect.x + fare, y2: intersect.y - dy });
                        hitBack = true;
                    }
                    break;
                }
            }
            if (!hitBack) missingRays++;
        }

        // 2. Missing Ray Penalty -> MUERTO
        if (missingRays > 0) return 1e20;

        for (let i = 0; i < raysOut.length; i++) {
            const r = raysOut[i]; const dx = r.x2 - r.x1; const dy = r.y2 - r.y1; const l2 = dx*dx + dy*dy;
            const t = ((this.focus.x - r.x1) * dx + (this.focus.y - r.y1) * dy) / (l2 || 1e-18);
            const px = r.x1 + t * dx; const py = r.y1 + t * dy;
            qualityFocus += Math.pow(this.focus.x - px, 2) + Math.pow(this.focus.y - py, 2);
        }
        let penalty = 0;
        for (let i = 0; i < raysInter.length; i++) { const r = raysInter[i]; penalty += Math.pow(r.x2 - r.x1, 2) + Math.pow(r.y2 - r.y1, 2); }
        this.penalty = Math.sqrt(penalty) / (this.ppsSide - 1);
        const q = Math.sqrt(qualityFocus) / this.ppsSide;
        this.fitness = q + this.penalty; 
        return qualityFocus;
    },
    step() {
        if (this.paused || !this.es) return;
        const samples = this.es.ask();
        const fits = samples.map(s => this.calcPathAndQuality(this.toLens(s, this.points)));
        this.es.tell(samples, fits);
        this.points = this.toLens(this.es.xmean, this.points);
        this.generation++; this.calls = this.es.counteval; this.sigma = this.es.sigma;
        this.updateTelemetry();
    },
    updateTelemetry() {
        const g = document.getElementById('val-gen'); if(g) g.innerText = this.generation;
        const f = document.getElementById('val-fit'); if(f) f.innerText = this.fitness.toFixed(6);
        const p = document.getElementById('val-penalty'); if(p) p.innerText = this.penalty.toFixed(3);
        const c = document.getElementById('val-calls'); if(c) c.innerText = this.calls;
        const s = document.getElementById('val-sigma'); if(s) s.innerText = this.sigma.toFixed(5);
    },
    animate() { this.step(); this.draw(); requestAnimationFrame(() => this.animate()); },
    draw() {
        const { ctx, canvas } = this; if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath(); ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
        ctx.closePath(); ctx.fillStyle = "rgba(0, 242, 255, 0.15)"; ctx.fill(); ctx.strokeStyle = "#00f2ff"; ctx.lineWidth = 2; ctx.stroke();
        if (this.showRays) this.drawPreview();
        ctx.beginPath(); ctx.strokeStyle = "#ffcc00"; ctx.lineWidth = 2; ctx.arc(this.focus.x, this.focus.y, 8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.focus.x - 12, this.focus.y); ctx.lineTo(this.focus.x + 12, this.focus.y);
        ctx.moveTo(this.focus.x, this.focus.y - 12); ctx.lineTo(this.focus.x, this.focus.y + 12); ctx.stroke();
        this.points.forEach(p => { ctx.beginPath(); ctx.fillStyle = "#ff3344"; ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); });
    },
    drawPreview() {
        const ctx = this.ctx; const space = this.perimeter / (this.ppsSide - 1); const fare = Physics.FARE; const backOffset = this.ppsSide;
        for (let i = 0; i < this.ppsSide - 1; i++) {
            const rayIn = { x1: 0, y1: this.offsetY + i * space + space/2, x2: fare, y2: this.offsetY + i * space + space/2 };
            for (let j = 0; j < this.ppsSide - 1; j++) {
                const seg = { x1: this.points[j].x, y1: this.points[j].y, x2: this.points[j+1].x, y2: this.points[j+1].y };
                const intersect = { x: 0, y: 0 };
                if (Physics.lineIntersection2D(rayIn, seg, intersect)) {
                    ctx.beginPath(); ctx.strokeStyle = "rgba(255, 204, 0, 0.4)"; ctx.moveTo(rayIn.x1, rayIn.y1); ctx.lineTo(intersect.x, intersect.y); ctx.stroke();
                    const angleIn = Physics.angleBetween2Lines(rayIn, seg) + Math.PI/2;
                    const arg = (this.nAir / this.nLens) * Math.sin(angleIn);
                    if (Math.abs(arg) <= 1.0) {
                        const angleOut = Math.asin(arg); const dy = Math.sin(angleIn - angleOut) * fare;
                        const rayInter = { x1: intersect.x, y1: intersect.y, x2: intersect.x + fare, y2: intersect.y - dy };
                        for (let k = 0; k < this.ppsSide - 1; k++) {
                            const segB = { x1: this.points[backOffset+k].x, y1: this.points[backOffset+k].y, x2: this.points[backOffset+k+1].x, y2: this.points[backOffset+k+1].y };
                            const intersectB = { x: 0, y: 0 };
                            if (Physics.lineIntersection2D(rayInter, segB, intersectB)) {
                                ctx.beginPath(); ctx.strokeStyle = "rgba(0, 242, 255, 0.8)"; ctx.moveTo(intersect.x, intersect.y); ctx.lineTo(intersectB.x, intersectB.y); ctx.stroke();
                                const angleInB = Physics.angleBetween2Lines(rayInter, segB) + Math.PI/2;
                                const argB = (this.nLens / this.nAir) * Math.sin(angleInB);
                                if (Math.abs(argB) <= 1.0) {
                                    const angleOutB = Math.asin(argB); const dyB = Math.sin(angleInB - angleOutB) * fare;
                                    ctx.beginPath(); ctx.strokeStyle = "rgba(255, 204, 0, 0.8)"; ctx.moveTo(intersectB.x, intersectB.y);
                                    ctx.lineTo(intersectB.x + fare, intersectB.y - dyB); ctx.stroke();
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    },
    handleMouseDown(e) {
        const mx = e.clientX, my = e.clientY;
        this.focus.x = mx; this.focus.y = my;
        this.dragging = { type: 'focus' };
    },
    handleMouseMove(e) { if (!this.dragging) return; if (this.dragging.type === 'focus') { this.focus.x = e.clientX; this.focus.y = e.clientY; } else if (this.dragging.type === 'vertex') { this.points[this.dragging.index].x = e.clientX; this.points[this.dragging.index].y = e.clientY; } },
    handleMouseUp() { this.dragging = null; },
    handleKeyDown(e) {
        if (e.code === 'Space') this.togglePlay();
        if (e.code === 'Escape') this.reset();
        if (e.key === 'r' || e.key === 'R') this.showRays = !this.showRays;
        if (e.key === '1') { document.getElementById('check-front').checked = true; document.getElementById('check-back').checked = false; this.reset(); }
        if (e.key === '2') { document.getElementById('check-front').checked = false; document.getElementById('check-back').checked = true; this.reset(); }
        if (e.key === '3') { document.getElementById('check-front').checked = true; document.getElementById('check-back').checked = true; this.reset(); }
        // 4 was Symmetry, now disabled
    }
};
window.onload = () => App.init();
