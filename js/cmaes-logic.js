/**
 * CMA-ES Logic for Cyber-Labor
 * High-fidelity port of Nikolaus Hansen's purecma.py.
 * Provides professional-grade Covariance Matrix Adaptation Evolution Strategy.
 */

// --- MATH HELPERS ---

function dot(A, b, transpose = false) {
    if (!transpose) {
        return A.map(row => row.reduce((sum, val, j) => sum + val * b[j], 0));
    } else {
        const result = new Array(A[0].length).fill(0);
        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[0].length; j++) {
                result[j] += A[i][j] * b[i];
            }
        }
        return result;
    }
}

function plus(a, b) {
    return a.map((val, i) => val + b[i]);
}

function minus(a, b) {
    return a.map((val, i) => val - b[i]);
}

function eye(dimension) {
    const m = [];
    for (let i = 0; i < dimension; i++) {
        m[i] = new Array(dimension).fill(0);
        m[i][i] = 1;
    }
    return m;
}

function argsort(a) {
    return a.map((val, i) => i).sort((i, j) => a[i] - a[j]);
}

// --- EIGENDECOMPOSITION (tred2/tql2) ---

function eig(C) {
    const n = C.length;
    const V = C.map(row => [...row]);
    const d = new Array(n).fill(0);
    const e = new Array(n).fill(0);

    function tred2(n, V, d, e) {
        for (let j = 0; j < n; j++) {
            d[j] = V[n - 1][j];
        }

        for (let i = n - 1; i > 0; i--) {
            let scale = 0.0;
            let h = 0.0;
            for (let k = 0; k < i; k++) {
                scale += Math.abs(d[k]);
            }

            if (scale === 0.0) {
                e[i] = d[i - 1];
                for (let j = 0; j < i; j++) {
                    d[j] = V[i - 1][j];
                    V[i][j] = 0.0;
                    V[j][i] = 0.0;
                }
            } else {
                for (let k = 0; k < i; k++) {
                    d[k] /= scale;
                    h += d[k] * d[k];
                }
                let f = d[i - 1];
                let g = Math.sqrt(h);
                if (f > 0) g = -g;
                e[i] = scale * g;
                h -= f * g;
                d[i - 1] = f - g;
                for (let j = 0; j < i; j++) {
                    e[j] = 0.0;
                }

                for (let j = 0; j < i; j++) {
                    f = d[j];
                    V[j][i] = f;
                    g = e[j] + V[j][j] * f;
                    for (let k = j + 1; k < i; k++) {
                        g += V[k][j] * d[k];
                        e[k] += V[k][j] * f;
                    }
                    e[j] = g;
                }
                f = 0.0;
                for (let j = 0; j < i; j++) {
                    e[j] /= h;
                    f += e[j] * d[j];
                }
                let hh = f / (h + h);
                for (let j = 0; j < i; j++) {
                    e[j] -= hh * d[j];
                }
                for (let j = 0; j < i; j++) {
                    f = d[j];
                    g = e[j];
                    for (let k = j; k < i; k++) {
                        V[k][j] -= (f * e[k] + g * d[k]);
                    }
                    d[j] = V[i - 1][j];
                    V[i][j] = 0.0;
                }
            }
            d[i] = h;
        }

        for (let i = 0; i < n - 1; i++) {
            V[n - 1][i] = V[i][i];
            V[i][i] = 1.0;
            let h = d[i + 1];
            if (h !== 0.0) {
                for (let k = 0; k <= i; k++) {
                    d[k] = V[k][i + 1] / h;
                }
                for (let j = 0; j <= i; j++) {
                    let g = 0.0;
                    for (let k = 0; k <= i; k++) {
                        g += V[k][i + 1] * V[k][j];
                    }
                    for (let k = 0; k <= i; k++) {
                        V[k][j] -= g * d[k];
                    }
                }
            }
            for (let k = 0; k <= i; k++) {
                V[k][i + 1] = 0.0;
            }
        }
        for (let j = 0; j < n; j++) {
            d[j] = V[n - 1][j];
            V[n - 1][j] = 0.0;
        }
        V[n - 1][n - 1] = 1.0;
        e[0] = 0.0;
    }

    function tql2(n, d, e, V) {
        for (let i = 1; i < n; i++) {
            e[i - 1] = e[i];
        }
        e[n - 1] = 0.0;

        let f = 0.0;
        let tst1 = 0.0;
        const eps = Math.pow(2.0, -52.0);
        for (let l = 0; l < n; l++) {
            tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
            let m = l;
            while (m < n) {
                if (Math.abs(e[m]) <= eps * tst1) break;
                m++;
            }

            if (m > l) {
                let iiter = 0;
                while (true) {
                    iiter++;
                    let g = d[l];
                    let p = (d[l + 1] - g) / (2.0 * e[l]);
                    let r = Math.sqrt(p * p + 1.0);
                    if (p < 0) r = -r;
                    d[l] = e[l] / (p + r);
                    d[l + 1] = e[l] * (p + r);
                    let dl1 = d[l + 1];
                    let h = g - d[l];
                    for (let i = l + 2; i < n; i++) {
                        d[i] -= h;
                    }
                    f += h;

                    p = d[m];
                    let c = 1.0;
                    let c2 = c;
                    let c3 = c;
                    let el1 = e[l + 1];
                    let s = 0.0;
                    let s2 = 0.0;

                    for (let i = m - 1; i >= l; i--) {
                        c3 = c2;
                        c2 = c;
                        s2 = s;
                        g = c * e[i];
                        h = c * p;
                        r = Math.sqrt(p * p + e[i] * e[i]);
                        e[i + 1] = s * r;
                        s = e[i] / r;
                        c = p / r;
                        p = c * d[i] - s * g;
                        d[i + 1] = h + s * (c * g + s * d[i]);

                        for (let k = 0; k < n; k++) {
                            h = V[k][i + 1];
                            V[k][i + 1] = s * V[k][i] + c * h;
                            V[k][i] = c * V[k][i] - s * h;
                        }
                    }
                    p = -s * s2 * c3 * el1 * e[l] / dl1;
                    e[l] = s * p;
                    d[l] = c * p;

                    if (Math.abs(e[l]) <= eps * tst1) break;
                }
            }
            d[l] += f;
            e[l] = 0.0;
        }
    }

    tred2(n, V, d, e);
    tql2(n, d, e, V);
    return [d, V];
}

// --- MATRIX CLASSES ---

class SquareMatrix extends Array {
    constructor(dimension) {
        super();
        for (let i = 0; i < dimension; i++) {
            const row = new Array(dimension).fill(0);
            row[i] = 1;
            this.push(row);
        }
    }

    multiplyWith(factor) {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this[i].length; j++) {
                this[i][j] *= factor;
            }
        }
        return this;
    }

    addOuter(b, factor = 1) {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this[i].length; j++) {
                this[i][j] += factor * b[i] * b[j];
            }
        }
        return this;
    }

    get diag() {
        return this.map((row, i) => row[i]);
    }
}

class DecomposingPositiveMatrix extends SquareMatrix {
    constructor(dimension) {
        super(dimension);
        this.eigenbasis = eye(dimension);
        this.eigenvalues = new Array(dimension).fill(1);
        this.condition_number = 1;
        this.invsqrt = eye(dimension);
        this.updated_eval = 0;
    }

    updateEigensystem(current_eval, lazy_gap_evals) {
        if (current_eval <= this.updated_eval + lazy_gap_evals) {
            return this;
        }
        this._enforceSymmetry();
        const [d, V] = eig(this);
        this.eigenvalues = d;
        this.eigenbasis = V;

        const minEV = Math.min(...this.eigenvalues);
        if (minEV <= 0) {
            console.error("The smallest eigenvalue is <= 0!", this.eigenvalues);
        }
        this.condition_number = Math.max(...this.eigenvalues) / Math.max(1e-18, minEV);

        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                for (let k = 0; k < this.length; k++) {
                    sum += this.eigenbasis[i][k] * this.eigenbasis[j][k] / Math.sqrt(this.eigenvalues[k]);
                }
                this.invsqrt[i][j] = this.invsqrt[j][i] = sum;
            }
        }
        this.updated_eval = current_eval;
        return this;
    }

    mahalanobisNorm(dx) {
        const z = dot(this.invsqrt, dx);
        return Math.sqrt(z.reduce((sum, val) => sum + val * val, 0));
    }

    _enforceSymmetry() {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < i; j++) {
                this[i][j] = this[j][i] = (this[i][j] + this[j][i]) / 2;
            }
        }
        return this;
    }
}

// --- CMA-ES PARAMETERS ---

class CMAESParameters {
    constructor(N, popsize = null) {
        this.dimension = N;
        this.chiN = Math.sqrt(N) * (1 - 1 / (4 * N) + 1 / (21 * N * N));

        // Selection parameters
        if (popsize === null) {
            this.lam = 4 + Math.floor(3 * Math.log(N));
        } else {
            this.lam = popsize;
        }
        this.mu = Math.floor(this.lam / 2);

        const _weights = [];
        let w_sum = 0;
        for (let i = 0; i < this.lam; i++) {
            if (i < this.mu) {
                _weights[i] = Math.log(this.lam / 2 + 0.5) - Math.log(i + 1);
                w_sum += _weights[i];
            } else {
                _weights[i] = 0;
            }
        }
        this.weights = _weights.map(w => w / w_sum);

        const sumW = this.weights.slice(0, this.mu).reduce((a, b) => a + b, 0);
        const sumW2 = this.weights.slice(0, this.mu).reduce((a, b) => a + b * b, 0);
        this.mueff = sumW * sumW / sumW2;

        // Adaptation parameters
        this.cc = (4 + this.mueff / N) / (N + 4 + 2 * this.mueff / N);
        this.cs = (this.mueff + 2) / (N + this.mueff + 5);
        this.c1 = 2 / (Math.pow(N + 1.3, 2) + this.mueff);
        this.cmu = Math.min(1 - this.c1, 2 * (this.mueff - 2 + 1 / this.mueff) / (Math.pow(N + 2, 2) + this.mueff));
        this.damps = 2 * this.mueff / this.lam + 0.3 + this.cs;

        this.lazy_gap_evals = 0.5 * N * this.lam * Math.pow(this.c1 + this.cmu, -1) / (N * N);
    }
}

// --- MAIN CMA-ES CLASS ---

class CMAES {
    constructor(xstart, sigma, popsize = null, ftarget = null) {
        const N = xstart.length;
        this.params = new CMAESParameters(N, popsize);
        this.maxfevals = 1e3 * N * N;
        this.ftarget = ftarget;

        this.xmean = [...xstart];
        this.sigma = sigma;
        this.pc = new Array(N).fill(0);
        this.ps = new Array(N).fill(0);
        this.C = new DecomposingPositiveMatrix(N);
        this.counteval = 0;
        this.fitvals = [];
        this.best = { x: null, f: Infinity, evals: 0 };
    }

    ask() {
        this.C.updateEigensystem(this.counteval, this.params.lazy_gap_evals);
        const candidates = [];
        for (let k = 0; k < this.params.lam; k++) {
            const z = this.C.eigenvalues.map(ev => this.sigma * Math.sqrt(ev) * this.randn());
            const y = dot(this.C.eigenbasis, z);
            candidates.push(plus(this.xmean, y));
        }
        return candidates;
    }

    tell(arx, fitvals) {
        this.counteval += fitvals.length;
        const N = this.xmean.length;
        const par = this.params;
        const xold = [...this.xmean];

        // Sort by fitness
        const indices = argsort(fitvals);
        const sorted_arx = indices.map(i => arx[i]);
        this.fitvals = indices.map(i => fitvals[i]);

        if (this.fitvals[0] < this.best.f) {
            this.best = { x: [...sorted_arx[0]], f: this.fitvals[0], evals: this.counteval };
        }

        // Recombination
        for (let i = 0; i < N; i++) {
            let sum = 0;
            for (let k = 0; k < par.mu; k++) {
                sum += par.weights[k] * sorted_arx[k][i];
            }
            this.xmean[i] = sum;
        }

        // Cumulation
        const y = minus(this.xmean, xold);
        const z = dot(this.C.invsqrt, y);
        const csn = Math.sqrt(par.cs * (2 - par.cs) * par.mueff) / this.sigma;
        for (let i = 0; i < N; i++) {
            this.ps[i] = (1 - par.cs) * this.ps[i] + csn * z[i];
        }

        const normPs2 = this.ps.reduce((sum, val) => sum + val * val, 0);
        const hsig = (normPs2 / N / (1 - Math.pow(1 - par.cs, 2 * this.counteval / par.lam))) < (2 + 4 / (N + 1));
        const ccn = Math.sqrt(par.cc * (2 - par.cc) * par.mueff) / this.sigma;
        for (let i = 0; i < N; i++) {
            this.pc[i] = (1 - par.cc) * this.pc[i] + ccn * (hsig ? 1 : 0) * y[i];
        }

        // Adapt Covariance Matrix C
        const c1a = par.c1 * (1 - (hsig ? 0 : 1) * par.cc * (2 - par.cc));
        const sumW = par.weights.reduce((a, b) => a + b, 0);
        this.C.multiplyWith(1 - c1a - par.cmu * sumW);
        this.C.addOuter(this.pc, par.c1);
        for (let k = 0; k < par.lam; k++) {
            const wk = par.weights[k];
            if (wk > 0) {
                const dx = minus(sorted_arx[k], xold);
                this.C.addOuter(dx, wk * par.cmu / (this.sigma * this.sigma));
            }
        }

        // Adapt Step-size sigma
        const cn = par.cs / par.damps;
        this.sigma *= Math.exp(Math.min(1, cn * (normPs2 / N - 1) / 2));
    }

    stop() {
        if (this.counteval >= this.maxfevals) return { maxfevals: this.maxfevals };
        if (this.ftarget !== null && this.fitvals.length > 0 && this.fitvals[0] <= this.ftarget) return { ftarget: this.ftarget };
        if (this.C.condition_number > 1e14) return { condition: this.C.condition_number };
        if (this.fitvals.length > 1 && (this.fitvals[this.fitvals.length - 1] - this.fitvals[0]) < 1e-12) return { tolfun: 1e-12 };
        return null;
    }

    randn() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}

// --- CYBER-LAB GEOMETRIC HELPERS ---

const CMAESLogic = {
    getPerimeter: function (points) {
        let p = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            p += Math.hypot(p2.x - p1.x, p2.y - p1.y);
        }
        return p;
    },

    getArea: function (points) {
        let a = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            a += (p1.x * p2.y) - (p2.x * p1.y);
        }
        return Math.abs(a) / 2;
    },

    getCentroid: function (points) {
        let cx = 0, cy = 0;
        points.forEach(p => { cx += p.x; cy += p.y; });
        return { x: cx / points.length, y: cy / points.length };
    },

    rescaleToPerimeter: function (points, targetU) {
        const currentU = this.getPerimeter(points);
        if (currentU === 0) return points;
        const factor = targetU / currentU;
        const center = this.getCentroid(points);
        return points.map(p => ({
            x: center.x + (p.x - center.x) * factor,
            y: center.y + (p.y - center.y) * factor
        }));
    },

    // --- BENCHMARK FUNCTIONS (from Hansen's ff class) ---

    // --- OPTICAL PHYSICS ENGINE (v6.8) ---

    findIntersection: function (x, y, dx, dy, points) {
        let bestT = Infinity;
        let bestHit = null;

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            // Ray: R = P + t*D
            // Segment: S = A + u*(B-A)
            const x1 = p1.x, y1 = p1.y;
            const x2 = p2.x, y2 = p2.y;
            const x3 = x, y3 = y;
            const x4 = x + dx, y4 = y + dy;

            const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (den === 0) continue; // Parallel

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

            if (t >= 0 && t <= 1 && u > 0.0001) {
                if (u < bestT) {
                    bestT = u;
                    bestHit = {
                        x: x3 + u * dx,
                        y: y3 + u * dy,
                        t: u,
                        edgeIndex: i
                    };
                }
            }
        }
        return bestHit;
    },

    getNormal: function (edgeIndex, points) {
        const p1 = points[edgeIndex];
        const p2 = points[(edgeIndex + 1) % points.length];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        // Outward normal for a CCW polygon
        const len = Math.hypot(dx, dy);
        return { x: dy / len, y: -dx / len };
    },

    refract: function (dir, normal, n1, n2) {
        let dot = dir.x * normal.x + dir.y * normal.y;
        let n = normal;
        if (dot > 0) {
            n = { x: -normal.x, y: -normal.y };
            dot = -dot;
        }
        const r = n1 / n2;
        const c1 = -dot;
        const c2sq = 1 - r * r * (1 - c1 * c1);
        if (c2sq < 0) return null; // Total internal reflection
        const c2 = Math.sqrt(c2sq);
        return {
            x: r * dir.x + (r * c1 - c2) * n.x,
            y: r * dir.y + (r * c1 - c2) * n.y
        };
    },

    getLensFitness: function (points, targetFocusX = 3) {
        const rayCount = 15;
        const startX = -4.0;
        const nLens = 1.5;
        const hLens = 3.6;
        let totalError = 0;
        let validRays = 0;

        for (let i = 0; i < rayCount; i++) {
            const startY = (i - (rayCount - 1) / 2) * (hLens / rayCount * 0.95); 
            const dir = { x: 1, y: 0 };

            // 1. Entry
            const entry = this.findIntersection(startX, startY, dir.x, dir.y, points);
            if (!entry) { totalError += 10; continue; }

            const normal1 = this.getNormal(entry.edgeIndex, points);
            // Flip normal if it points towards the ray (entry)
            const dot = normal1.x * dir.x + normal1.y * dir.y;
            const actualNormal1 = dot > 0 ? { x: -normal1.x, y: -normal1.y } : normal1;

            const rayIn = this.refract(dir, actualNormal1, 1.0, nLens);
            if (!rayIn) { totalError += 10; continue; }

            // 2. Exit
            const exit = this.findIntersection(entry.x + rayIn.x * 0.001, entry.y + rayIn.y * 0.001, rayIn.x, rayIn.y, points);
            if (!exit) { totalError += 10; continue; }

            const normal2 = this.getNormal(exit.edgeIndex, points);
            const dot2 = normal2.x * rayIn.x + normal2.y * rayIn.y;
            const actualNormal2 = dot2 < 0 ? { x: -normal2.x, y: -normal2.y } : normal2;

            const rayOut = this.refract(rayIn, actualNormal2, nLens, 1.0);
            if (!rayOut) { totalError += 10; continue; }

            // 3. Focal Error
            // Find y-intercept at targetFocusX
            // Equation: y = y_exit + (rayOut.y / rayOut.x) * (targetX - x_exit)
            if (Math.abs(rayOut.x) < 0.001) { totalError += 10; continue; }

            const focusY = exit.y + (rayOut.y / rayOut.x) * (targetFocusX - exit.x);
            totalError += focusY * focusY; // Distance squared from y=0
            validRays++;
        }

        if (validRays === 0) return -1000;
        return -totalError;
    },

    rosenbrock: function (x) {
        let n = x.length;
        if (n < 2) throw new Error("Dimension must be > 1 for Rosenbrock");
        let sum = 0;
        for (let i = 0; i < n - 1; i++) {
            sum += 100 * Math.pow(Math.pow(x[i], 2) - x[i + 1], 2) + Math.pow(x[i] - 1, 2);
        }
        return sum;
    },

    sphere: function (x) {
        return x.reduce((sum, val) => sum + val * val, 0);
    },

    tablet: function (x) {
        let sum = x[0] * x[0] * 1e6;
        for (let i = 1; i < x.length; i++) {
            sum += x[i] * x[i];
        }
        return sum;
    },

    elli: function (x) {
        let n = x.length;
        let sum = 0;
        let aratio = 1e3;
        for (let i = 0; i < n; i++) {
            sum += Math.pow(x[i], 2) * Math.pow(aratio, (2 * i) / (n - 1));
        }
        return sum;
    }
};

// Export for module systems or keep global for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CMAES, CMAESParameters, CMAESLogic };
}
module.exports = { CMAES, CMAESParameters, CMAESLogic };

