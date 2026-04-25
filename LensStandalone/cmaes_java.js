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
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let rank_mu = 0; for (let k = 0; k < this.mu; k++) rank_mu += this.weights[k] * artmp[k][i] * artmp[k][j];
                this.C[i][j] = (1 - this.c1 - this.cmu) * this.C[i][j] + this.c1 * (this.pc[i] * this.pc[j] + old_c1 * this.C[i][j]) + this.cmu * rank_mu;
            }
        }
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
            for (let i = 0; i < N - 1; i++) {
                for (let j = i + 1; j < N; j++) {
                    const off = Math.abs(A[i][j]); if (off > 0) {
                        const h = d[j] - d[i]; let t; if (Math.abs(h) + off === Math.abs(h)) t = A[i][j] / h; else { const theta = 0.5 * h / A[i][j]; t = 1 / (Math.abs(theta) + Math.sqrt(1 + theta * theta)); if (theta < 0) t = -t; }
                        const c = 1 / Math.sqrt(1 + t * t); const s = t * c; const tau = s / (1 + c); const temp = t * A[i][j]; d[i] -= temp; d[j] += temp; A[i][j] = 0;
                        for (let k = 0; k < i; k++) { const g = A[k][i], h = A[k][j]; A[k][i] = g - s * (h + g * tau); A[k][j] = h + s * (g - h * tau); }
                        for (let k = i + 1; k < j; k++) { const g = A[i][k], h = A[k][j]; A[i][k] = g - s * (h + g * tau); A[k][j] = h + s * (g - h * tau); }
                        for (let k = j + 1; k < N; k++) { const g = A[i][k], h = A[j][k]; A[i][k] = g - s * (h + g * tau); A[j][k] = h + s * (g - h * tau); }
                        for (let k = 0; k < N; k++) { const g = V[k][i], h = V[k][j]; V[k][i] = g - s * (h + g * tau); V[k][j] = h + s * (g - h * tau); }
                    }
                }
            }
        }
        return { d, V };
    }
    multiply(m, v) { return m.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0)); }
    randn() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); }
}

const Physics = {
    FARE: 4000.0,
    normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y) || 1e-18;
        return { x: v.x / len, y: v.y / len };
    },
    dot(a, b) { return a.x * b.x + a.y * b.y; },
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
    },
    rayHitParam(ray, seg) {
        const denom = (ray.x2 - ray.x1) * (seg.y2 - seg.y1) - (ray.y2 - ray.y1) * (seg.x2 - seg.x1);
        if (denom === 0) return null;
        const rnum = (ray.y1 - seg.y1) * (seg.x2 - seg.x1) - (ray.x1 - seg.x1) * (seg.y2 - seg.y1);
        const snum = (ray.y1 - seg.y1) * (ray.x2 - ray.x1) - (ray.x1 - seg.x1) * (ray.y2 - ray.y1);
        const r = rnum / denom;
        const s = snum / denom;
        if (r < 0 || r > 1 || s < 0 || s > 1) return null;
        return r;
    },
    refractRayClosestSurface(ray, points, startIdx, segCount, nFrom, nTo, outLen) {
        let bestR = Infinity;
        let bestJ = -1;
        for (let j = 0; j < segCount; j++) {
            const seg = {
                x1: points[startIdx + j].x, y1: points[startIdx + j].y,
                x2: points[startIdx + j + 1].x, y2: points[startIdx + j + 1].y
            };
            const t = this.rayHitParam(ray, seg);
            if (t !== null && t > 1e-9 && t < bestR) {
                bestR = t;
                bestJ = j;
            }
        }
        if (bestJ < 0) return null;
        const seg = {
            x1: points[startIdx + bestJ].x, y1: points[startIdx + bestJ].y,
            x2: points[startIdx + bestJ + 1].x, y2: points[startIdx + bestJ + 1].y
        };
        const refr = this.refractRayThroughSegment(ray, seg, nFrom, nTo, outLen);
        if (refr) refr.legIndex = bestJ;
        return refr;
    },
    segmentIntersectionStrict(l1, l2, eps = 1e-6) {
        const denom = (l1.x2 - l1.x1) * (l2.y2 - l2.y1) - (l1.y2 - l1.y1) * (l2.x2 - l2.x1);
        if (Math.abs(denom) < eps) return false;

        const rnum = (l1.y1 - l2.y1) * (l2.x2 - l2.x1) - (l1.x1 - l2.x1) * (l2.y2 - l2.y1);
        const snum = (l1.y1 - l2.y1) * (l1.x2 - l1.x1) - (l1.x1 - l2.x1) * (l1.y2 - l1.y1);
        const r = rnum / denom;
        const s = snum / denom;
        return r > eps && r < 1 - eps && s > eps && s < 1 - eps;
    },
    refractRayThroughSegment(ray, seg, nFrom, nTo, outLen) {
        const hit = { x: 0, y: 0 };
        if (!this.lineIntersection2D(ray, seg, hit)) return null;

        const incident = this.normalize({ x: ray.x2 - ray.x1, y: ray.y2 - ray.y1 });
        const tangent = this.normalize({ x: seg.x2 - seg.x1, y: seg.y2 - seg.y1 });
        let normal = { x: -tangent.y, y: tangent.x };
        if (this.dot(incident, normal) > 0) normal = { x: -normal.x, y: -normal.y };

        const eta = nFrom / nTo;
        const cosi = -this.dot(normal, incident);
        const k = 1 - eta * eta * (1 - cosi * cosi);
        if (k < 0) return null;

        const tx = eta * incident.x + (eta * cosi - Math.sqrt(k)) * normal.x;
        const ty = eta * incident.y + (eta * cosi - Math.sqrt(k)) * normal.y;
        const t = this.normalize({ x: tx, y: ty });
        return {
            hit,
            refracted: { x1: hit.x, y1: hit.y, x2: hit.x + t.x * outLen, y2: hit.y + t.y * outLen }
        };
    }
};

const App = {
    canvas: null, ctx: null,
    points: [], basePoints: [], focus: { x: 1275, y: 380 },
    es: null, generation: 0, fitness: 0, penalty: 0, calls: 0,
    nLens: 1.60, nAir: 1.0, sigma: 0.1, ppsSide: 13,
    paused: true, dragging: null, showRays: true, showPoints: true,
    offsetX: 200, offsetY: 180, perimeter: 400,
    LEG_PENALTY_WEIGHT: 0.75,
    legPenalty: 0,
    EDGE_GAP_PENALTY_WEIGHT: 1.0,
    HARD_MIN_GAP: 18,
    SOFT_MIN_GAP: 45,
    edgeGapPenalty: 0,
    zoom: 1.0, panX: 0, panY: 0,
    MIN_ZOOM: 1.0, MAX_ZOOM: 10,
    SIDEBAR_RIGHT_GAP: 320,
    focusOscillate: false,
    focusBaseY: 0,
    focusOscPhase: 0,
    FOCUS_OSC_AMP: 180,
    FOCUS_OSC_SPEED: 0.015,

    init() {
        this.canvas = document.getElementById('lensCanvas');
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('resize', () => this.resize()); this.resize();
        document.getElementById('btn-play').onclick = () => this.togglePlay();
        document.getElementById('btn-reset').onclick = () => this.reset();
        const btnResetView = document.getElementById('btn-reset-view');
        if (btnResetView) btnResetView.onclick = () => this.resetView();
        const frontCheck = document.getElementById('check-front');
        const backCheck = document.getElementById('check-back');
        const symmetryCheck = document.getElementById('check-symmetry');
        if (frontCheck) frontCheck.onchange = () => this.reset();
        if (backCheck) backCheck.onchange = () => this.reset();
        if (symmetryCheck) symmetryCheck.onchange = () => this.reset();
        const pointsCheck = document.getElementById('check-points');
        if (pointsCheck) {
            this.showPoints = pointsCheck.checked;
            pointsCheck.onchange = () => { this.showPoints = pointsCheck.checked; };
        }
        const oscCheck = document.getElementById('check-oscillate');
        if (oscCheck) {
            this.focusOscillate = oscCheck.checked;
            oscCheck.onchange = () => {
                this.focusOscillate = oscCheck.checked;
                if (this.focusOscillate) {
                    this.focusBaseY = this.focus.y;
                    this.focusOscPhase = 0;
                } else {
                    this.focus.y = this.focusBaseY;
                }
            };
        }
        document.getElementById('slider-n').oninput = (e) => { this.nLens = parseFloat(e.target.value); document.getElementById('val-n').innerText = this.nLens.toFixed(2); };
        document.getElementById('slider-sigma').oninput = (e) => { this.sigma = parseFloat(e.target.value); document.getElementById('val-sigma').innerText = this.sigma.toFixed(3); if (this.es) this.es.sigma = this.sigma; };
        this.canvas.onmousedown = (e) => this.handleMouseDown(e);
        window.onmousemove = (e) => this.handleMouseMove(e);
        window.onmouseup = () => this.handleMouseUp();
        window.onkeydown = (e) => this.handleKeyDown(e);
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        this.reset(); this.animate();
    },
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; },
    screenToWorld(sx, sy) {
        const rect = this.canvas.getBoundingClientRect();
        const cx = sx - rect.left;
        const cy = sy - rect.top;
        return {
            x: (cx - this.panX) / this.zoom,
            y: (cy - this.panY) / this.zoom
        };
    },
    handleWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const newZoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, this.zoom * factor));
        const realFactor = newZoom / this.zoom;
        this.panX = cx - (cx - this.panX) * realFactor;
        this.panY = cy - (cy - this.panY) * realFactor;
        this.zoom = newZoom;
    },
    resetView() { this.zoom = 1.0; this.panX = 0; this.panY = 0; },
    getFocusDefaultX() {
        const cb = document.getElementById('check-symmetry');
        if (cb) {
            const card = cb.closest('.glass-card');
            if (card) {
                const rect = card.getBoundingClientRect();
                if (rect.width > 0) return rect.right;
            }
        }
        return this.canvas ? this.canvas.width - 20 : 1275;
    },
    syncControlUI() {
        const frontCheck = document.getElementById('check-front');
        const backCheck = document.getElementById('check-back');
        const symmetryCheck = document.getElementById('check-symmetry');
        if (!frontCheck || !backCheck || !symmetryCheck) return;

        if (symmetryCheck.checked) {
            frontCheck.checked = false;
            backCheck.checked = true;
            frontCheck.disabled = true;
            backCheck.disabled = true;
        } else {
            frontCheck.disabled = false;
            backCheck.disabled = false;
        }
    },
    reset() {
        this.syncControlUI();
        this.points = []; const w = 150; const space = this.perimeter / (this.ppsSide - 1);
        for (let i = 0; i < this.ppsSide; i++) this.points.push({ x: this.offsetX - w / 2, y: this.offsetY + i * space });
        for (let i = 0; i < this.ppsSide; i++) this.points.push({ x: this.offsetX + w / 2, y: this.offsetY + this.perimeter - i * space });
        this.basePoints = this.points.map(p => ({ ...p }));
        this.focus = { x: this.getFocusDefaultX(), y: this.offsetY + this.perimeter / 2 };
        this.focusBaseY = this.focus.y;
        this.focusOscPhase = 0;
        this.es = null;
        this.generation = 0; this.calls = 0;
        this.fitness = 0; this.penalty = 0; this.legPenalty = 0; this.edgeGapPenalty = 0;
        const sigmaSlider = document.getElementById('slider-sigma');
        if (sigmaSlider) this.sigma = parseFloat(sigmaSlider.value);
        this.paused = true;
        const btn = document.getElementById('btn-play'); if (btn) btn.innerHTML = 'START';
        this.updateFlags();
        this.fitness = this.calcPathAndQuality(this.points);
        this.updateTelemetry();
    },
    updateFlags() {
        this.syncControlUI();
        const f = document.getElementById('check-front');
        const b = document.getElementById('check-back');
        const sym = document.getElementById('check-symmetry');
        const isSymmetry = sym ? sym.checked : false;
        const doFront = isSymmetry ? false : (f ? f.checked : false);
        const doBack = isSymmetry ? true : (b ? b.checked : true);

        let dim = 0;
        if (isSymmetry) dim = this.ppsSide;
        else {
            if (doFront) dim += this.ppsSide;
            if (doBack) dim += this.ppsSide;
        }

        const d = document.getElementById('val-dim'); if (d) d.innerText = dim;
        return { doFront, doBack, dim, isSymmetry };
    },
    togglePlay() {
        if (!this.es) {
            const flags = this.updateFlags();
            this.es = new CMAES(new Array(flags.dim).fill(0), this.sigma, 20);
        }
        this.paused = !this.paused;
        const btn = document.getElementById('btn-play'); if (btn) btn.innerHTML = this.paused ? 'START' : 'PAUSE';
    },
    toLens(vec, points) {
        const newPoints = points.map(p => ({ ...p }));
        const flags = this.updateFlags();
        let cursor = 0;
        if (flags.isSymmetry) {
            const backOffset = this.ppsSide;
            for (let i = 0; i < this.ppsSide; i++) {
                const backIdx = backOffset + (this.ppsSide - 1 - i);
                const baseFrontX = this.basePoints[i].x;
                const baseBackX = this.basePoints[backIdx].x;
                const midX = (baseFrontX + baseBackX) / 2;
                const backX = this.basePoints[backIdx].x + vec[cursor++];
                newPoints[backIdx].x = backX;
                newPoints[i].x = 2 * midX - backX;
            }
            return newPoints;
        }
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
        const raysGlass = [];
        let missingRays = 0;

        // 1. Check Front/Back gap. Below HARD_MIN_GAP -> KO (degenerate vertex).
        //    Below SOFT_MIN_GAP -> accumulate smooth penalty so the optimizer
        //    keeps the lens edges from collapsing to a singular point.
        const backOffset = this.ppsSide;
        let gapDeficitSum = 0;
        for (let i = 0; i < this.ppsSide; i++) {
            const backIdx = backOffset + (this.ppsSide - 1 - i);
            const gap = points[backIdx].x - points[i].x;
            if (gap < this.HARD_MIN_GAP) return 1e20;
            if (gap < this.SOFT_MIN_GAP) gapDeficitSum += this.SOFT_MIN_GAP - gap;
        }
        this.edgeGapPenalty = gapDeficitSum / this.ppsSide;

        // Strahlen berechnen: Eingang -> Inter (Glas)
        for (let i = 0; i < this.ppsSide - 1; i++) raysIn.push({ x1: -fare, y1: this.offsetY + i * space + space / 2, x2: fare, y2: this.offsetY + i * space + space / 2 });
        for (let i = 0; i < raysIn.length; i++) {
            const ray = raysIn[i];
            const refr = Physics.refractRayClosestSurface(ray, points, 0, this.ppsSide - 1, this.nAir, this.nLens, fare);
            if (refr) {
                ray.x2 = refr.hit.x; ray.y2 = refr.hit.y;
                raysInter.push({ ray: refr.refracted, frontLeg: refr.legIndex });
            } else {
                missingRays++;
            }
        }

        let legDeviationSum = 0;
        for (let i = 0; i < raysInter.length; i++) {
            const item = raysInter[i];
            const ray = item.ray;
            const expectedBackLeg = (this.ppsSide - 2) - item.frontLeg;
            const frontHit = { x: ray.x1, y: ray.y1 };
            const refr = Physics.refractRayClosestSurface(ray, points, backOffset, this.ppsSide - 1, this.nLens, this.nAir, fare);
            if (refr) {
                ray.x2 = refr.hit.x; ray.y2 = refr.hit.y;
                raysOut.push(refr.refracted);
                raysGlass.push({ x1: frontHit.x, y1: frontHit.y, x2: refr.hit.x, y2: refr.hit.y });
                legDeviationSum += Math.abs(refr.legIndex - expectedBackLeg);
            } else {
                missingRays++;
            }
        }

        // Penalize rays that cross while they travel inside the lens body.
        for (let i = 0; i < raysGlass.length; i++) {
            for (let j = i + 1; j < raysGlass.length; j++) {
                if (Physics.segmentIntersectionStrict(raysGlass[i], raysGlass[j])) return 1e25;
            }
        }

        if (missingRays > 0) return 1e20;

        if (raysOut.length === 0) return 1e20;
        for (let i = 0; i < raysOut.length; i++) {
            const r = raysOut[i];
            const dx = r.x2 - r.x1;
            const dy = r.y2 - r.y1;
            if (Math.abs(dx) < 1e-9) return 1e20;
            const tFocus = (this.focus.x - r.x1) / dx;
            // Penalize rays that do not propagate toward the focus plane.
            if (tFocus < 0) return 1e20;
            const yAtFocus = r.y1 + tFocus * dy;
            qualityFocus += Math.pow(this.focus.y - yAtFocus, 2);
        }
        let penalty = 0;
        for (let i = 0; i < raysInter.length; i++) { const r = raysInter[i].ray; penalty += Math.pow(r.x2 - r.x1, 2) + Math.pow(r.y2 - r.y1, 2); }
        this.penalty = Math.sqrt(penalty) / (this.ppsSide - 1);
        const q = Math.sqrt(qualityFocus) / raysOut.length;
        this.legPenalty = raysOut.length > 0 ? legDeviationSum / raysOut.length : 0;
        this.fitness = q + 0.25 * this.penalty + this.LEG_PENALTY_WEIGHT * this.legPenalty + this.EDGE_GAP_PENALTY_WEIGHT * this.edgeGapPenalty;
        return this.fitness;
    },
    displayInterval() {
        if (this.generation < 100) return 1;
        if (this.generation < 500) return 10;
        return 100;
    },
    shouldDisplay() {
        return this.generation % this.displayInterval() === 0;
    },
    step() {
        if (this.paused || !this.es) return;
        const samples = this.es.ask();
        const fits = samples.map(s => this.calcPathAndQuality(this.toLens(s, this.points)));
        this.es.tell(samples, fits);
        this.points = this.toLens(this.es.xmean, this.points);
        this.generation++; this.calls = this.es.counteval; this.sigma = this.es.sigma;
        if (this.shouldDisplay()) this.updateTelemetry();
    },
    updateTelemetry() {
        const g = document.getElementById('val-gen'); if (g) g.innerText = this.generation;
        const f = document.getElementById('val-fit'); if (f) f.innerText = this.fitness.toFixed(6);
        const p = document.getElementById('val-penalty'); if (p) p.innerText = this.penalty.toFixed(3);
        const c = document.getElementById('val-calls'); if (c) c.innerText = this.calls;
        const s = document.getElementById('val-sigma'); if (s) s.innerText = this.sigma.toFixed(5);
    },
    animate() {
        if (this.focusOscillate) {
            this.focusOscPhase += this.FOCUS_OSC_SPEED;
            this.focus.y = this.focusBaseY + this.FOCUS_OSC_AMP * Math.sin(this.focusOscPhase);
        }
        this.step();
        if (this.paused || this.shouldDisplay() || this.focusOscillate) this.draw();
        requestAnimationFrame(() => this.animate());
    },
    draw() {
        const { ctx, canvas } = this; if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(this.panX, this.panY);
        ctx.scale(this.zoom, this.zoom);
        const inv = 1 / this.zoom;
        ctx.beginPath(); ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
        ctx.closePath(); ctx.fillStyle = "rgba(0, 242, 255, 0.15)"; ctx.fill(); ctx.strokeStyle = "#00f2ff"; ctx.lineWidth = 2 * inv; ctx.stroke();
        this.drawMidline();
        if (this.showRays) this.drawPreview();
        ctx.beginPath(); ctx.strokeStyle = "#ffcc00"; ctx.lineWidth = 2 * inv; ctx.arc(this.focus.x, this.focus.y, 8 * inv, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.focus.x - 12 * inv, this.focus.y); ctx.lineTo(this.focus.x + 12 * inv, this.focus.y);
        ctx.moveTo(this.focus.x, this.focus.y - 12 * inv); ctx.lineTo(this.focus.x, this.focus.y + 12 * inv); ctx.stroke();
        if (this.showPoints) {
            this.points.forEach(p => { ctx.beginPath(); ctx.fillStyle = "#ff3344"; ctx.arc(p.x, p.y, 3 * inv, 0, Math.PI * 2); ctx.fill(); });
        }
        ctx.restore();
    },
    drawPreview() {
        const ctx = this.ctx; const space = this.perimeter / (this.ppsSide - 1); const fare = Physics.FARE; const backOffset = this.ppsSide;
        for (let i = 0; i < this.ppsSide - 1; i++) {
            const rayIn = { x1: 0, y1: this.offsetY + i * space + space / 2, x2: fare, y2: this.offsetY + i * space + space / 2 };
            const refrIn = Physics.refractRayClosestSurface(rayIn, this.points, 0, this.ppsSide - 1, this.nAir, this.nLens, fare);
            if (!refrIn) continue;
            const intersect = refrIn.hit;
            ctx.beginPath(); ctx.strokeStyle = "rgba(255, 204, 0, 0.4)"; ctx.moveTo(rayIn.x1, rayIn.y1); ctx.lineTo(intersect.x, intersect.y); ctx.stroke();
            const rayInter = refrIn.refracted;
            const refrOut = Physics.refractRayClosestSurface(rayInter, this.points, backOffset, this.ppsSide - 1, this.nLens, this.nAir, fare);
            if (!refrOut) continue;
            const intersectB = refrOut.hit;
            ctx.beginPath(); ctx.strokeStyle = "rgba(0, 242, 255, 0.8)"; ctx.moveTo(intersect.x, intersect.y); ctx.lineTo(intersectB.x, intersectB.y); ctx.stroke();
            ctx.beginPath(); ctx.strokeStyle = "rgba(255, 204, 0, 0.8)"; ctx.moveTo(intersectB.x, intersectB.y);
            ctx.lineTo(refrOut.refracted.x2, refrOut.refracted.y2); ctx.stroke();
        }
    },
    drawMidline() {
        const ctx = this.ctx;
        const backOffset = this.ppsSide;
        if (!ctx || this.points.length < backOffset + this.ppsSide) return;
        ctx.beginPath();
        for (let i = 0; i < this.ppsSide; i++) {
            const backIdx = backOffset + (this.ppsSide - 1 - i);
            const x = 0.5 * (this.points[i].x + this.points[backIdx].x);
            const y = this.points[i].y;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        const inv = 1 / this.zoom;
        ctx.strokeStyle = "rgba(255, 204, 0, 0.5)";
        ctx.lineWidth = 1.5 * inv;
        ctx.setLineDash([6 * inv, 6 * inv]);
        ctx.stroke();
        ctx.setLineDash([]);
    },
    handleMouseDown(e) {
        const w = this.screenToWorld(e.clientX, e.clientY);
        this.focus.x = w.x; this.focus.y = w.y;
        this.focusBaseY = w.y;
        this.focusOscPhase = 0;
        this.dragging = { type: 'focus' };
    },
    handleMouseMove(e) {
        if (!this.dragging) return;
        const w = this.screenToWorld(e.clientX, e.clientY);
        if (this.dragging.type === 'focus') {
            this.focus.x = w.x; this.focus.y = w.y;
            this.focusBaseY = w.y;
            this.focusOscPhase = 0;
        }
        else if (this.dragging.type === 'vertex') { this.points[this.dragging.index].x = w.x; this.points[this.dragging.index].y = w.y; }
    },
    handleMouseUp() { this.dragging = null; },
    handleKeyDown(e) {
        if (e.code === 'Space') { e.preventDefault(); this.togglePlay(); return; }
    }
};
window.onload = () => App.init();
