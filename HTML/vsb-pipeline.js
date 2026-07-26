// VSB seal pipeline — full in-browser port of tools/vsb (Python) so the
// workbench is self-contained: master SVG -> print PNG, wood STLs, stitch DST.
// Runs in the browser (worker) AND in node (verification against the Python
// reference outputs). All math mirrors the Python ops 1:1 — including
// Python semantics for int() (trunc), round() (half-even) and %/// (floor).
'use strict';

const VSB = (() => {

    // ---------- Python semantics helpers ----------
    const trunc = Math.trunc;
    function pyRound(x) {           // round half to even, like Python round()
        const f = Math.floor(x), d = x - f;
        if (d < 0.5) return f;
        if (d > 0.5) return f + 1;
        return (f % 2 === 0) ? f : f + 1;
    }
    const pyMod = (a, n) => ((a % n) + n) % n;
    const pyFloorDiv = (a, n) => Math.floor(a / n);

    // ---------- master SVG parsing (mirrors parse_beziers / parse_ring_radii) ----------
    function pathD(svg, pid) {   // d of the path with this id, attribute order agnostic
        const tag = svg.match(new RegExp('<path\\b[^>]*\\bid="' + pid + '"[^>]*>'));
        if (!tag) return null;
        const d = tag[0].match(/\bd="([^"]*)"/);
        return d ? d[1] : null;
    }
    function parseBeziers(svg, pid, res) {   // res: 0.04 raster, 0.05 stick
        const d0 = pathD(svg, pid);
        if (!d0) return [];
        const m = [null, d0];
        const loops = []; let cur = null;
        const rx = /([MCZ])([-\d. ]*)/g; let c;
        while ((c = rx.exec(m[1])) !== null) {
            const nm = c[2].trim() ? c[2].trim().split(/\s+/).map(Number) : [];
            if (c[1] === 'M') {
                if (cur && cur.length > 2) loops.push(cur);
                cur = [[nm[0], nm[1]]];
            } else if (c[1] === 'C') {
                const [x0, y0] = cur[cur.length - 1];
                const c1 = [nm[0], nm[1]], c2 = [nm[2], nm[3]], p3 = [nm[4], nm[5]];
                const L = Math.hypot(p3[0] - x0, p3[1] - y0) + Math.hypot(c1[0] - x0, c1[1] - y0)
                    + Math.hypot(c2[0] - p3[0], c2[1] - p3[1]);
                const n = Math.max(3, trunc(L / res));
                for (let k = 1; k <= n; k++) {
                    const t = k / n, mt = 1 - t;
                    cur.push([mt * mt * mt * x0 + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * p3[0],
                        mt * mt * mt * y0 + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * p3[1]]);
                }
            } else {
                if (cur && cur.length > 2) loops.push(cur);
                cur = null;
            }
        }
        if (cur && cur.length > 2) loops.push(cur);
        return loops;
    }

    function parseRingRadii(svg, pid) {
        const d0 = pathD(svg, pid);
        if (!d0) return null;
        const rr = [...d0.matchAll(/A\s*([\d.]+)/g)].map(x => Number(x[1]));
        if (!rr.length) return null;
        return [Math.max(...rr), Math.min(...rr)];
    }

    function parseMaster(svg) {
        const LET = parseBeziers(svg, 'lettering', 0.04);
        const TREE = parseBeziers(svg, 'tree', 0.04);
        const RINGS = [parseRingRadii(svg, 'ring-outer'), parseRingRadii(svg, 'ring-inner'),
            parseRingRadii(svg, 'tree-ring')].filter(Boolean);
        return { LET, TREE, RINGS };
    }

    // ---------- rasterizer (mirrors render(); returns subsample COUNTS 0..ss*ss) ----------
    // Python thresholds the float mean only at >=0.5, and counts/(ss*ss) is exact
    // for that comparison, so counts >= ss*ss/2 is bit-identical to the reference.
    function render(N, x0mm, y0mm, span, loopsList, rings, ss) {
        ss = ss || 2;
        const N2 = N * ss, k = N2 / span, C = 75.0;
        // polygon edge crossings bucketed per subrow (same crossing math as Python)
        const rowsx = new Array(N2); // lazily created arrays
        for (const loops of loopsList) for (const lp of loops) {
            const n = lp.length;
            for (let i = 0; i < n; i++) {
                const x1 = (lp[i][0] - x0mm) * k, y1 = (lp[i][1] - y0mm) * k;
                const j = (i + 1) % n;
                const x2 = (lp[j][0] - x0mm) * k, y2 = (lp[j][1] - y0mm) * k;
                if (y1 === y2) continue;
                const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
                const lo = Math.max(0, trunc(Math.ceil(ya - 0.5)));
                const hi = Math.min(N2 - 1, trunc(Math.floor(yb + 0.5)));
                for (let yy = lo; yy <= hi; yy++) {
                    const yc = yy + 0.5;
                    if ((y1 <= yc && yc < y2) || (y2 <= yc && yc < y1)) {
                        (rowsx[yy] || (rowsx[yy] = [])).push(x1 + (yc - y1) / (y2 - y1) * (x2 - x1));
                    }
                }
            }
        }
        const out = new Uint8Array(N * N);
        const row = new Uint8Array(N2);
        const pr = rings.map(([ro, ri]) => [ro * k, ri * k]);
        const cx = (C - x0mm) * k, cy = (C - y0mm) * k;
        for (let Y = 0; Y < N; Y++) {
            for (let s = 0; s < ss; s++) {
                const y = Y * ss + s;
                row.fill(0);
                for (const [pro, pri] of pr) {
                    const d2 = (y + 0.5 - cy) * (y + 0.5 - cy);
                    if (d2 > pro * pro) continue;
                    const h1 = Math.sqrt(pro * pro - d2);
                    if (d2 < pri * pri) {
                        const h0 = Math.sqrt(pri * pri - d2);
                        let a = Math.max(0, trunc(cx - h1)), b = Math.min(N2 - 1, trunc(cx - h0));
                        for (let x = a; x <= b; x++) row[x] = 1;
                        a = Math.max(0, trunc(cx + h0)); b = Math.min(N2 - 1, trunc(cx + h1));
                        for (let x = a; x <= b; x++) row[x] = 1;
                    } else {
                        const a = Math.max(0, trunc(cx - h1)), b = Math.min(N2 - 1, trunc(cx + h1));
                        for (let x = a; x <= b; x++) row[x] = 1;
                    }
                }
                const xs = rowsx[y];
                if (xs) {
                    xs.sort((a, b) => a - b);
                    for (let j = 0; j + 1 < xs.length; j += 2) {
                        const xa = Math.max(0, trunc(Math.ceil(xs[j] - 0.5)));
                        const xb = Math.min(N2 - 1, trunc(Math.floor(xs[j + 1] - 0.5)));
                        for (let x = xa; x <= xb; x++) row[x] ^= 1;
                    }
                }
                // accumulate ss subcolumns into the output row
                const o = Y * N;
                for (let X = 0; X < N; X++) {
                    let acc = out[o + X];
                    for (let t = 0; t < ss; t++) acc += row[X * ss + t];
                    out[o + X] = acc;
                }
            }
        }
        return { counts: out, thr: ss * ss / 2 };  // motif = counts >= thr
    }

    // ---------- PNG writer (8-bit gray, filter 0, pHYs 1200 dpi) ----------
    const CRC_T = (() => {
        const t = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            t[n] = c >>> 0;
        }
        return t;
    })();
    function crc32(buf) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
    }
    function chunk(type, data) {
        const out = new Uint8Array(12 + data.length);
        const dv = new DataView(out.buffer);
        dv.setUint32(0, data.length);
        for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
        out.set(data, 8);
        const body = out.subarray(4, 8 + data.length);
        dv.setUint32(8 + data.length, crc32(body));
        return out;
    }
    async function deflateBytes(raw) {
        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
            const zlib = require('zlib');
            return new Uint8Array(zlib.deflateSync(Buffer.from(raw), { level: 6 }));
        }
        const cs = new CompressionStream('deflate');
        const resp = new Response(new Blob([raw]).stream().pipeThrough(cs));
        return new Uint8Array(await resp.arrayBuffer());
    }
    async function grayPNG(pix, N, dpi) {
        const raw = new Uint8Array(N * (N + 1));
        for (let y = 0; y < N; y++) raw.set(pix.subarray(y * N, (y + 1) * N), y * (N + 1) + 1);
        const idat = await deflateBytes(raw);
        const ihdr = new Uint8Array(13); const dv = new DataView(ihdr.buffer);
        dv.setUint32(0, N); dv.setUint32(4, N); ihdr[8] = 8; // bit depth, gray
        const ppm = pyRound(dpi / 0.0254);
        const phys = new Uint8Array(9); const dv2 = new DataView(phys.buffer);
        dv2.setUint32(0, ppm); dv2.setUint32(4, ppm); phys[8] = 1;
        const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
        const parts = [sig, chunk('IHDR', ihdr), chunk('pHYs', phys), chunk('IDAT', idat),
            chunk('IEND', new Uint8Array(0))];
        const total = parts.reduce((s, p) => s + p.length, 0);
        const out = new Uint8Array(total); let o = 0;
        for (const p of parts) { out.set(p, o); o += p.length; }
        return out;
    }

    // ---------- 1) print raster + PNG ----------
    function printRaster(M) {
        const N = 7370;
        const { counts, thr } = render(N, -3.0, -3.0, 156.0, [M.LET, M.TREE], M.RINGS);
        const img = new Uint8Array(N * N);
        for (let i = 0; i < img.length; i++) img[i] = counts[i] >= thr ? 0 : 255;
        return { img, N };
    }
    async function makePrintPNG(M) {
        const { img, N } = printRaster(M);
        return grayPNG(img, N, 1200);
    }

    // ---------- 2) tree mask (592, true = motif) ----------
    function treeMask592(M) {
        const N = 592;
        const { counts, thr } = render(N, 36.0, 36.0, 78.0, [M.TREE], [M.RINGS[2]]);
        const tm = new Uint8Array(N * N);
        for (let i = 0; i < tm.length; i++) tm[i] = counts[i] >= thr ? 1 : 0;
        return tm;
    }

    // ---------- 3) wood heightfield (2000px / 104mm frame) ----------
    function makeHeightfield(M) {
        const NW = 2000;
        const { counts, thr } = render(NW, -3.0, -3.0, 156.0, [M.LET, M.TREE], M.RINGS);
        const h16 = new Uint16Array(NW * NW);
        const mm_pp = 104.0 / NW;
        for (let y = 0; y < NW; y++) {
            const dy = (y + 0.5) * mm_pp - 52.0;
            for (let x = 0; x < NW; x++) {
                const dx = (x + 0.5) * mm_pp - 52.0;
                const disc = Math.hypot(dx, dy) <= 50.0;
                const H = (counts[y * NW + x] >= thr) && disc ? 8.0 : (disc ? 6.0 : 1.0);
                h16[y * NW + x] = trunc(H / 8.0 * 65535);
            }
        }
        return h16;
    }

    // ---------- 4) STL pair (mirrors vsb_stl.py exactly) ----------
    function buildSTLs(h16) {
        const NS = 1000, PAD = 20, SIZE = 104.0, NST = NS + 2 * PAD;
        // H: /65535, downsample 2x2 mean, flip vertically, pad 20 zeros
        const Hb = new Float64Array(NST * NST);
        for (let i = 0; i < NS; i++) {
            const src = NS - 1 - i;                 // [::-1] flip
            for (let j = 0; j < NS; j++) {
                const y0 = src * 2, x0 = j * 2;
                const s = (h16[y0 * 2000 + x0] + h16[y0 * 2000 + x0 + 1]
                    + h16[(y0 + 1) * 2000 + x0] + h16[(y0 + 1) * 2000 + x0 + 1]) / 65535.0;
                Hb[(i + PAD) * NST + (j + PAD)] = s / 4.0;
            }
        }
        const sig = 2.0, K = new Float64Array(13);
        let ks = 0;
        for (let t = -6; t <= 6; t++) { K[t + 6] = Math.exp(-0.5 * (t / sig) * (t / sig)); ks += K[t + 6]; }
        for (let t = 0; t < 13; t++) K[t] /= ks;
        function smooth(Z) {
            const A = new Float64Array(NST * NST), B = new Float64Array(NST * NST);
            for (let i = 0; i < NST; i++)             // along rows
                for (let j = 0; j < NST; j++) {
                    let s = 0;
                    for (let t = -6; t <= 6; t++) {
                        const jj = j + t;
                        if (jj >= 0 && jj < NST) s += Z[i * NST + jj] * K[6 - t];
                    }
                    A[i * NST + j] = s;
                }
            for (let j = 0; j < NST; j++)             // along columns
                for (let i = 0; i < NST; i++) {
                    let s = 0;
                    for (let t = -6; t <= 6; t++) {
                        const ii = i + t;
                        if (ii >= 0 && ii < NST) s += A[ii * NST + j] * K[6 - t];
                    }
                    B[i * NST + j] = s;
                }
            return B;
        }
        function remap(fLow, fHigh) {
            const Z = new Float64Array(NST * NST);
            for (let i = 0; i < NST * NST; i++) {
                const h = Hb[i];
                Z[i] = h <= 0.75 ? fLow(h) : fHigh(h);
            }
            return smooth(Z);
        }
        function build(Zf, header) {
            const E = NST - (NST % 2), ND = E / 2;
            const Zd = new Float64Array(ND * ND);
            for (let i = 0; i < ND; i++)
                for (let j = 0; j < ND; j++)
                    Zd[i * ND + j] = (Zf[(2 * i) * NST + 2 * j] + Zf[(2 * i) * NST + 2 * j + 1]
                        + Zf[(2 * i + 1) * NST + 2 * j] + Zf[(2 * i + 1) * NST + 2 * j + 1]) / 4.0;
            const xd = new Float64Array(ND);
            for (let i = 0; i < ND; i++) xd[i] = (i * 2 + 0.5) * (SIZE / (NST - 1));
            const x00 = xd[0], sp = SIZE / (xd[ND - 1] - xd[0]);
            for (let i = 0; i < ND; i++) xd[i] = (xd[i] - x00) * sp;
            const V = [];
            const tri = (a, b, c) => V.push(a, b, c);
            for (let i = 0; i < ND - 1; i++)
                for (let j = 0; j < ND - 1; j++) {
                    const z00 = Zd[i * ND + j], z10 = Zd[i * ND + j + 1],
                        z01 = Zd[(i + 1) * ND + j], z11 = Zd[(i + 1) * ND + j + 1];
                    const p00 = [xd[j], xd[i], z00], p10 = [xd[j + 1], xd[i], z10],
                        p01 = [xd[j], xd[i + 1], z01], p11 = [xd[j + 1], xd[i + 1], z11];
                    if (Math.abs(z00 - z11) <= Math.abs(z10 - z01)) {
                        tri(p00, p10, p11); tri(p00, p11, p01);
                    } else {
                        tri(p00, p10, p01); tri(p10, p11, p01);
                    }
                }
            const quad = (a, b, c, d) => { tri(a, b, c); tri(a, c, d); };
            for (let j = 0; j < ND - 1; j++) {
                quad([xd[j], 0, 0], [xd[j], 0, Zd[j]], [xd[j + 1], 0, Zd[j + 1]], [xd[j + 1], 0, 0]);
                quad([xd[j + 1], SIZE, 0], [xd[j + 1], SIZE, Zd[(ND - 1) * ND + j + 1]],
                    [xd[j], SIZE, Zd[(ND - 1) * ND + j]], [xd[j], SIZE, 0]);
                quad([0, xd[j + 1], 0], [0, xd[j + 1], Zd[(j + 1) * ND]], [0, xd[j], Zd[j * ND]], [0, xd[j], 0]);
                quad([SIZE, xd[j], 0], [SIZE, xd[j], Zd[j * ND + ND - 1]],
                    [SIZE, xd[j + 1], Zd[(j + 1) * ND + ND - 1]], [SIZE, xd[j + 1], 0]);
            }
            const P = [];
            for (let j = 0; j < ND - 1; j++) P.push([xd[j], 0.0]);
            for (let i = 0; i < ND - 1; i++) P.push([SIZE, xd[i]]);
            for (let j = ND - 1; j > 0; j--) P.push([xd[j], SIZE]);
            for (let i = ND - 1; i > 0; i--) P.push([0.0, xd[i]]);
            const Cn = [SIZE / 2, SIZE / 2, 0.0];
            for (let t = 0; t < P.length; t++) {
                const a = P[t], b = P[(t + 1) % P.length];
                tri(Cn, [b[0], b[1], 0.0], [a[0], a[1], 0.0]);
            }
            const nt = V.length / 3;
            const buf = new ArrayBuffer(84 + nt * 50);
            const dv = new DataView(buf);
            const u8 = new Uint8Array(buf);
            for (let i = 0; i < header.length && i < 80; i++) u8[i] = header.charCodeAt(i);
            dv.setUint32(80, nt, true);
            let o = 84;
            for (let t = 0; t < nt; t++) {
                const a = V[3 * t], b = V[3 * t + 1], c = V[3 * t + 2];
                const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
                const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
                let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
                const ln = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
                nx /= ln; ny /= ln; nz /= ln;
                dv.setFloat32(o, nx, true); dv.setFloat32(o + 4, ny, true); dv.setFloat32(o + 8, nz, true);
                let p = o + 12;
                for (const q of [a, b, c]) {
                    dv.setFloat32(p, q[0], true); dv.setFloat32(p + 4, q[1], true);
                    dv.setFloat32(p + 8, q[2], true); p += 12;
                }
                dv.setUint16(o + 48, 0, true);
                o += 50;
            }
            return { bytes: new Uint8Array(buf), tris: nt };
        }
        const Zr = remap(h => 1.0 + h * (5.0 / 0.75), h => 6.0 + (h - 0.75) * (2.0 / 0.25));
        const Ze = remap(h => 1.0 + h * (7.0 / 0.75), h => 8.0 - (h - 0.75) * (2.0 / 0.25));
        return {
            raised: build(Zr, 'VSB seal O100/104mm, smoothed, mean-decimated, adaptive mesh'),
            engraved: build(Ze, 'VSB seal ENGRAVED O100/104mm, smoothed, mean-decimated, adaptive mesh')
        };
    }

    // ---------- 5) stick generator (mirrors vsb_stick.py, master-based path) ----------
    function makeStick(svg, M, tm592) {
        const SCALE = 1.2, CX = 50.0 * SCALE, CY = 50.0 * SCALE, R_BASE = 36.0 * SCALE;
        const N = 592;

        // -- master lettering loops (finer flattening: L/0.05) --
        const masterLoops = pid => parseBeziers(svg, pid, 0.05);

        // -- the fine-scan satin engine on unbent outlines --
        function regionSatin(loopsLocal, bottom) {
            const PITCH = 0.38, PULL = 0.18, MINW = 1.0;
            const FSCAN = 0.07, STEP = Math.max(1, pyRound(PITCH / FSCAN));
            let ymin = Infinity, ymax = -Infinity;
            for (const lp of loopsLocal) for (const p of lp) {
                if (p[1] < ymin) ymin = p[1];
                if (p[1] > ymax) ymax = p[1];
            }
            ymin -= 0.1; ymax += 0.1;
            const edges = [];
            for (const P of loopsLocal)
                for (let i = 0; i < P.length; i++) {
                    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
                    if (y1 !== y2) edges.push([y1, y2, x1, x2]);
                }
            const rows = [];
            for (let y = ymin; y <= ymax; y += FSCAN) {
                const xs = [];
                for (const [y1, y2, x1, x2] of edges)
                    if ((y1 <= y && y < y2) || (y2 <= y && y < y1))
                        xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
                xs.sort((a, b) => a - b);
                const ivs = [];
                for (let k = 0; k + 1 < xs.length; k += 2) {
                    const a = xs[k], b = xs[k + 1];
                    if (ivs.length && a - ivs[ivs.length - 1][1] < 0.1) {
                        const last = ivs[ivs.length - 1];
                        last[1] = Math.max(last[1], b);
                    } else ivs.push([a, b]);
                }
                rows.push([y, ivs.map(v => [v[0], v[1]])]);
            }
            const patches = []; let active = [];
            for (const [y, ivs] of rows) {
                const used = new Array(ivs.length).fill(false); const nxt = [];
                for (const pa of active) {
                    const [la, lb] = pa.last;
                    let best = -1, bo = -Infinity;
                    for (let i = 0; i < ivs.length; i++) {
                        if (used[i]) continue;
                        const [a, b] = ivs[i];
                        if (a < lb && la < b) {
                            const ov = Math.min(lb, b) - Math.max(la, a);
                            if (ov > bo) { bo = ov; best = i; }
                        }
                    }
                    if (best >= 0) {
                        const [a, b] = ivs[best];
                        if (bo < 0.55 * Math.max(lb - la, b - a)) best = -1;
                    }
                    if (best >= 0) {
                        used[best] = true;
                        pa.rows.push([y, [ivs[best][0], ivs[best][1]]]);
                        pa.last = [ivs[best][0], ivs[best][1]];
                        nxt.push(pa);
                    } else patches.push(pa.rows);
                }
                for (let i = 0; i < ivs.length; i++)
                    if (!used[i]) nxt.push({ rows: [[y, [ivs[i][0], ivs[i][1]]]], last: [ivs[i][0], ivs[i][1]] });
                active = nxt;
            }
            for (const pa of active) patches.push(pa.rows);
            const bend = (px, py) => {
                const a = px / R_BASE;
                if (!bottom) return [CX + (R_BASE + py) * Math.sin(a), CY - (R_BASE + py) * Math.cos(a)];
                return [CX + (R_BASE - py) * Math.sin(a), CY + (R_BASE - py) * Math.cos(a)];
            };
            const widen = (a0, b0) => {
                let a = a0 - PULL, b = b0 + PULL;
                if (b - a < MINW) {
                    const m = (a + b) / 2.0;
                    a = Math.max(m - MINW / 2, a0 - 0.15); b = Math.min(m + MINW / 2, b0 + 0.15);
                }
                return [a, b];
            };
            const every = (arr, n) => arr.filter((_, i) => i % n === 0);
            const seqs = [];
            for (const rows_ of patches) {
                if (!rows_.length) continue;
                const hspan = (rows_[rows_.length - 1][0] - rows_[0][0]) + FSCAN;
                let ws = 0;
                for (const [, [a, b]] of rows_) ws += b - a;
                const wmean = ws / rows_.length;
                if (wmean > 2.0 * hspan && wmean > 2.2) {
                    let xs0 = Infinity, xs1 = -Infinity;
                    for (const [, [a, b]] of rows_) {
                        if (a < xs0) xs0 = a;
                        if (b > xs1) xs1 = b;
                    }
                    const cols = [];
                    for (let x = xs0 + PITCH / 2; x < xs1; x += PITCH) {
                        let s0 = Infinity, s1 = -Infinity, hit = false;
                        for (const [y, [a, b]] of rows_)
                            if (a <= x && x <= b) {
                                hit = true;
                                if (y < s0) s0 = y;
                                if (y > s1) s1 = y;
                            }
                        if (hit) {
                            let ya = s0 - PULL, yb = s1 + PULL;
                            if (yb - ya < MINW) {
                                const m = (ya + yb) / 2.0;
                                ya = Math.max(m - MINW / 2, s0 - 0.15); yb = Math.min(m + MINW / 2, s1 + 0.15);
                            }
                            cols.push([x, [ya, yb]]);
                        }
                    }
                    if (!cols.length) continue;
                    const under = [];
                    if (cols.length >= 3) {
                        every(cols, 4).forEach(([x, [ya, yb]], k) => {
                            let ia = ya + 0.3, ib = yb - 0.3;
                            if (ib <= ia) ia = ib = (ya + yb) / 2.0;
                            const pair = k % 2 === 0 ? [[x, ia], [x, ib]] : [[x, ib], [x, ia]];
                            for (const p of pair) under.push(bend(p[0], p[1]));
                        });
                    }
                    const satin = [];
                    cols.slice().reverse().forEach(([x, [ya, yb]], k) => {
                        const pair = k % 2 === 0 ? [[x, ya], [x, yb]] : [[x, yb], [x, ya]];
                        for (const p of pair) satin.push(bend(p[0], p[1]));
                    });
                    seqs.push(under.concat(satin));
                    continue;
                }
                let emit = every(rows_, STEP);
                if (emit[emit.length - 1][0] !== rows_[rows_.length - 1][0]) emit = emit.concat([rows_[rows_.length - 1]]);
                const under = [];
                if (emit.length >= 3) {
                    every(emit, 4).forEach(([y, [a0, b0]], k) => {
                        const [a, b] = widen(a0, b0);
                        let ia = a + 0.3, ib = b - 0.3;
                        if (ib <= ia) ia = ib = (a + b) / 2.0;
                        const pair = k % 2 === 0 ? [[ia, y], [ib, y]] : [[ib, y], [ia, y]];
                        for (const p of pair) under.push(bend(p[0], p[1]));
                    });
                }
                const satin = [];
                emit.slice().reverse().forEach(([y, [a0, b0]], k) => {
                    const [a, b] = widen(a0, b0);
                    const pair = k % 2 === 0 ? [[a, y], [b, y]] : [[b, y], [a, y]];
                    for (const p of pair) satin.push(bend(p[0], p[1]));
                });
                seqs.push(under.concat(satin));
            }
            return seqs;
        }

        function masterLetterSatin() {
            const U = SCALE / 1.5;
            const tops = [], bots = [];
            for (const lp of masterLoops('lettering')) {
                let cy = 0;
                for (const p of lp) cy += p[1];
                cy /= lp.length;
                (cy < 75.0 ? tops : bots).push(lp);
            }
            const unbend = (loops, bottom) => loops.map(lp => lp.map(([x, y]) => {
                const dx = (x - 75.0) * U, dy = (y - 75.0) * U;
                const r = Math.hypot(dx, dy);
                if (!bottom) {
                    const ang = Math.atan2(dx, -dy);
                    return [ang * R_BASE, r - R_BASE];
                }
                const ang = Math.atan2(dx, dy);
                return [ang * R_BASE, R_BASE - r];
            }));
            return [regionSatin(unbend(tops, false), false), regionSatin(unbend(bots, true), true)];
        }
        const [motto, vsb] = masterLetterSatin();

        // -- tree fill from the 592 mask --
        const tm = Uint8Array.from(tm592);   // working copy (dust removal mutates)
        const idxOf = (y, x) => y * N + x;
        // dust removal: 4-connected regions < 0.25 mm^2
        {
            const lab = new Uint8Array(N * N);
            const A_PX = 0.105 * 0.105;
            for (let sy = 0; sy < N; sy++) for (let sx = 0; sx < N; sx++) {
                if (!tm[idxOf(sy, sx)] || lab[idxOf(sy, sx)]) continue;
                const stack = [[sy, sx]]; lab[idxOf(sy, sx)] = 1; const px = [];
                while (stack.length) {
                    const [y, x] = stack.pop(); px.push([y, x]);
                    for (const [ny, nx] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]])
                        if (ny >= 0 && ny < N && nx >= 0 && nx < N && tm[idxOf(ny, nx)] && !lab[idxOf(ny, nx)]) {
                            lab[idxOf(ny, nx)] = 1; stack.push([ny, nx]);
                        }
                }
                if (px.length * A_PX < 0.25) for (const [y, x] of px) tm[idxOf(y, x)] = 0;
            }
        }
        const RES = 0.1, NP_ = trunc(100.0 * SCALE / RES);
        const TX0 = 24.0 * SCALE, TS = 52.0 * SCALE;
        // bilinear resample of tm onto the RES grid (same index math as numpy code)
        const treeMask = new Uint8Array(NP_ * NP_);
        {
            const fx = new Float64Array(NP_);
            for (let i = 0; i < NP_; i++) fx[i] = (((i + 0.5) * RES) - TX0) / TS * (N - 1);
            const idx = [];
            for (let i = 0; i < NP_; i++) if (fx[i] >= 0 && fx[i] <= N - 1) idx.push(i);
            for (const r of idx) {
                const yf = fx[r], y0 = trunc(yf), y1 = Math.min(y0 + 1, N - 1), wy = yf - y0;
                for (const cI of idx) {
                    const xf = fx[cI], x0 = Math.floor(xf), x1 = Math.min(x0 + 1, N - 1), wx = xf - x0;
                    const row = (tm[idxOf(y0, x0)] * (1 - wx) + tm[idxOf(y0, x1)] * wx) * (1 - wy)
                        + (tm[idxOf(y1, x0)] * (1 - wx) + tm[idxOf(y1, x1)] * wx) * wy;
                    if (row >= 0.5) treeMask[r * NP_ + cI] = 1;
                }
            }
        }
        // dilate/erode with WRAP (numpy roll semantics)
        function dilate(m, px, n) {
            const o = Uint8Array.from(m);
            for (let dx = -px; dx <= px; dx++)
                for (let dy = -px; dy <= px; dy++) {
                    if (dx * dx + dy * dy > px * px || (dx === 0 && dy === 0)) continue;
                    for (let y = 0; y < n; y++) {
                        const sy = pyMod(y - dy, n);
                        for (let x = 0; x < n; x++) {
                            if (m[sy * n + pyMod(x - dx, n)]) o[y * n + x] = 1;
                        }
                    }
                }
            return o;
        }
        function erode(m, px, n) {
            const inv = new Uint8Array(m.length);
            for (let i = 0; i < m.length; i++) inv[i] = m[i] ? 0 : 1;
            const d = dilate(inv, px, n);
            const o = new Uint8Array(m.length);
            for (let i = 0; i < m.length; i++) o[i] = d[i] ? 0 : 1;
            return o;
        }
        {   // pre-open narrow green channels (<0.4mm) by locally slimming the gold
            const narrow = new Uint8Array(NP_ * NP_);
            const cl = erode(dilate(treeMask, 2, NP_), 2, NP_);
            for (let i = 0; i < narrow.length; i++) narrow[i] = cl[i] && !treeMask[i] ? 1 : 0;
            const thick = dilate(erode(treeMask, 2, NP_), 2, NP_);
            const dn2 = dilate(narrow, 2, NP_), dn1 = dilate(narrow, 1, NP_);
            for (let i = 0; i < treeMask.length; i++)
                if (treeMask[i] && ((dn2[i] && thick[i]) || dn1[i])) treeMask[i] = 0;
        }
        function fill(mask, pitchPx, stitchMm, transpose, stagger) {
            const at = (r, c) => transpose ? mask[c * NP_ + r] : mask[r * NP_ + c];
            const rowsOrder = [];
            const segsD = new Map();
            for (let r = 0; r < NP_; r += pitchPx) {
                const segs = [];
                let prev = at(r, 0);
                let start = prev ? 0 : -1;
                for (let c = 1; c < NP_; c++) {
                    const v = at(r, c);
                    if (v && !prev) start = c;
                    else if (!v && prev) {
                        if (c - start >= 2) segs.push([start, c]);
                        start = -1;
                    }
                    prev = v;
                }
                if (prev && NP_ - start >= 2) segs.push([start, NP_]);
                segsD.set(r, segs); rowsOrder.push(r);
            }
            const patches = []; let active = [];
            for (const r of rowsOrder) {
                const news = segsD.get(r);
                const used = new Array(news.length).fill(false); const nxt = [];
                for (const pa of active) {
                    const [la, lb] = pa.last;
                    let best = -1, bo = -Infinity;
                    for (let i = 0; i < news.length; i++) {
                        if (used[i]) continue;
                        const [a, b] = news[i];
                        if (a < lb && la < b) {
                            const ov = Math.min(lb, b) - Math.max(la, a);
                            if (ov > bo) { bo = ov; best = i; }
                        }
                    }
                    if (best >= 0) {
                        const [a, b] = news[best];
                        if (bo < 0.62 * Math.max(lb - la, b - a)) best = -1;
                    }
                    if (best >= 0) {
                        used[best] = true;
                        pa.rows.push([r, news[best]]); pa.last = news[best]; nxt.push(pa);
                    } else patches.push(pa.rows);
                }
                for (let i = 0; i < news.length; i++)
                    if (!used[i]) nxt.push({ rows: [[r, news[i]]], last: news[i] });
                active = nxt;
            }
            for (const pa of active) patches.push(pa.rows);
            const seqs = [];
            for (const rows_ of patches) {
                if (!rows_.length) continue;
                const pts = [];
                rows_.forEach(([r, [a, b]], k) => {
                    const u = (r + 0.5) * RES, xa = (a + 0.5) * RES, xb = (b - 0.5) * RES;
                    const n = Math.max(1, trunc((xb - xa) / stitchMm));
                    const ph = stagger ? (k % 3) / 3.0 * stitchMm : 0;
                    let ln = [xa];
                    for (let i = 1; i <= n; i++) {
                        const v = xa + ph + i * stitchMm;
                        if (v < xb) ln.push(Math.min(xb, v));
                    }
                    ln.push(xb);
                    if (k % 2) ln = ln.reverse();
                    for (const v of ln) pts.push(transpose ? [u, v] : [v, u]);
                });
                seqs.push(pts);
            }
            return seqs;
        }
        const treeUnder = fill(treeMask, 15, 2.0, true, false);
        const treeFill = fill(treeMask, 3, 3.0, false, true);

        function chaikin(loop, it) {
            it = it === undefined ? 2 : it;
            for (let n = 0; n < it; n++) {
                const o = [];
                for (let i = 0; i < loop.length; i++) {
                    const p = loop[i], q = loop[(i + 1) % loop.length];
                    o.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]]);
                    o.push([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
                }
                loop = o;
            }
            return loop;
        }
        function marching(mask, cell) {
            const n = N;
            const Mb = (y, x) => (y >= 1 && y <= n && x >= 1 && x <= n) ? mask[(y - 1) * n + (x - 1)] : 0;
            const TAB = { 1: [['L', 'B']], 2: [['B', 'R']], 3: [['L', 'R']], 4: [['R', 'T']], 5: [['L', 'T'], ['R', 'B']], 6: [['B', 'T']], 7: [['L', 'T']], 8: [['T', 'L']], 9: [['T', 'B']], 10: [['T', 'R'], ['B', 'L']], 11: [['T', 'R']], 12: [['R', 'L']], 13: [['R', 'B']], 14: [['B', 'L']] };
            const segs = new Map();   // "x,y" -> [targets]; insertion-ordered like a py dict
            const keyOf = p => p[0] + ',' + p[1];
            for (let i = 0; i < n + 1; i++)
                for (let j = 0; j < n + 1; j++) {
                    const code = (Mb(i, j) << 3) | (Mb(i, j + 1) << 2) | (Mb(i + 1, j + 1) << 1) | Mb(i + 1, j);
                    if (code === 0 || code === 15) continue;
                    const pts = { T: [j + 0.5, i], B: [j + 0.5, i + 1], L: [j, i + 0.5], R: [j + 1, i + 0.5] };
                    for (const [a, b] of TAB[code]) {
                        const ka = keyOf(pts[a]);
                        if (!segs.has(ka)) segs.set(ka, { p: pts[a], t: [] });
                        segs.get(ka).t.push(pts[b]);
                    }
                }
            const loops = [];
            while (segs.size) {
                const stKey = segs.keys().next().value;
                const st = segs.get(stKey).p;
                const lp = [st];
                let cur = segs.get(stKey).t.pop();
                if (!segs.get(stKey).t.length) segs.delete(stKey);
                while (keyOf(cur) !== stKey && segs.has(keyOf(cur))) {
                    lp.push(cur);
                    const e = segs.get(keyOf(cur));
                    const nx = e.t.pop();
                    if (!e.t.length) segs.delete(keyOf(cur));
                    cur = nx;
                }
                if (lp.length > 10) loops.push(lp.map(([x, y]) => [(x - 1) * cell, (y - 1) * cell]));
            }
            return loops;
        }
        function resample(loop, step) {
            const pts = [loop[0]];
            for (let i = 1; i <= loop.length; i++) {
                let a = pts[pts.length - 1];
                const b = loop[i % loop.length];
                let d = Math.hypot(b[0] - a[0], b[1] - a[1]);
                while (d >= step) {
                    a = [a[0] + (b[0] - a[0]) / d * step, a[1] + (b[1] - a[1]) / d * step];
                    pts.push(a);
                    d = Math.hypot(b[0] - a[0], b[1] - a[1]);
                }
            }
            return pts;
        }
        const bean = loop => {
            const o = [];
            for (let i = 0; i < loop.length - 1; i++) o.push(loop[i], loop[i + 1], loop[i], loop[i + 1]);
            return o;
        };
        const ALLOW = dilate(treeMask, 2, NP_);
        const inGold = p => {
            const gx = trunc(p[0] / RES), gy = trunc(p[1] / RES);
            return gx >= 0 && gx < NP_ && gy >= 0 && gy < NP_ && !!ALLOW[gy * NP_ + gx];
        };
        function segOk(a, b) {
            const n = trunc(Math.max(2, Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.15));
            for (let i = 0; i <= n; i++) {
                const t = i / n;
                if (!inGold([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])) return false;
            }
            return true;
        }
        function clipGold(P) {
            const pieces = []; let cur = [P[0]];
            for (let i = 1; i < P.length; i++) {
                if (segOk(P[i - 1], P[i])) cur.push(P[i]);
                else {
                    if (cur.length >= 3) pieces.push(cur);
                    cur = [P[i]];
                }
            }
            if (cur.length >= 3) pieces.push(cur);
            return pieces;
        }
        const treeOut = [];
        const CTR = TX0 + TS / 2.0;
        for (const L of marching(tm, 1.0)) {
            const per = L.length * 0.105 * SCALE;
            if (per < 2.5) continue;
            const P = resample(chaikin(L).map(([x, y]) => [TX0 + x * (52 * SCALE / N), TX0 + y * (52 * SCALE / N)]), 0.9);
            if (per > 15) {
                for (const pc of clipGold(P)) treeOut.push(bean(pc));
            } else {
                let cx = 0, cy = 0;
                for (const p of P) { cx += p[0]; cy += p[1]; }
                cx /= P.length; cy /= P.length;
                if (Math.hypot(cx - CTR, cy - CTR) < 0.80 * TS / 2.0)
                    for (const pc of clipGold(P)) treeOut.push(pc);
            }
        }
        function satinRing(r1, r2, step) {
            step = step || 0.19;
            r1 *= SCALE; r2 *= SCALE;
            const n = trunc(2 * Math.PI * r2 / step);
            const out = [];
            for (let i = 0; i <= n; i++) {
                const r = i % 2 === 0 ? r2 : r1;
                out.push([CX + r * Math.sin(2 * Math.PI * i / n), CY - r * Math.cos(2 * Math.PI * i / n)]);
            }
            return out;
        }
        function nearOrder(sq) {
            if (!sq.length) return [];
            const rest = sq.slice(); const out = [rest.shift()];
            while (rest.length) {
                const last = out[out.length - 1][out[out.length - 1].length - 1];
                let k = 0, bd = Infinity;
                for (let i = 0; i < rest.length; i++) {
                    const d = Math.hypot(rest[i][0][0] - last[0], rest[i][0][1] - last[1]);
                    if (d < bd) { bd = d; k = i; }
                }
                out.push(rest.splice(k, 1)[0]);
            }
            return out;
        }
        const G = {
            ringe: [satinRing(46.75, 49.25), satinRing(42.6, 43.4)],
            baum_underlay: nearOrder(treeUnder),
            baum_fuellung: nearOrder(treeFill),
            baum_kontur: treeOut,
            motto: nearOrder(motto),
            vsb: nearOrder(vsb)
        };
        const seqs = [].concat(G.ringe, G.baum_underlay, G.baum_fuellung, G.baum_kontur, G.motto, G.vsb);
        const TREE_I0 = G.ringe.length;
        const TREE_I1 = TREE_I0 + G.baum_underlay.length + G.baum_fuellung.length + G.baum_kontur.length;

        // -- DST encode --
        function encVal(v) {
            const d = {}; let rest = v;
            for (const base of [1, 3, 9, 27, 81]) {
                let q = pyMod(rest, 3);
                if (q === 2) { q = -1; rest += 3; }
                d[base] = q; rest = pyFloorDiv(rest, 3);
            }
            return d;
        }
        function enc(dx, dy, jump) {
            const X = encVal(dx), Y = encVal(dy);
            let b1 = 0, b2 = 0, b3 = 0;
            const s1 = [[0x80, Y[1] === 1], [0x40, Y[1] === -1], [0x20, Y[9] === 1], [0x10, Y[9] === -1], [0x08, X[9] === -1], [0x04, X[9] === 1], [0x02, X[1] === -1], [0x01, X[1] === 1]];
            for (const [bit, c] of s1) if (c) b1 |= bit;
            const s2 = [[0x80, Y[3] === 1], [0x40, Y[3] === -1], [0x20, Y[27] === 1], [0x10, Y[27] === -1], [0x08, X[27] === -1], [0x04, X[27] === 1], [0x02, X[3] === -1], [0x01, X[3] === 1]];
            for (const [bit, c] of s2) if (c) b2 |= bit;
            b3 |= 0x03;
            const s3 = [[0x20, Y[81] === 1], [0x10, Y[81] === -1], [0x08, X[81] === -1], [0x04, X[81] === 1], [0x80, !!jump]];
            for (const [bit, c] of s3) if (c) b3 |= bit;
            return [b1, b2, b3];
        }
        const recs = []; const cur = [0.0, 0.0];
        const emit = (dx, dy, jump) => { recs.push(enc(dx, dy, jump)); cur[0] += dx; cur[1] += dy; };
        function moveto(p, jump) {
            const tx = p[0] * 10.0, ty = -p[1] * 10.0;
            for (;;) {
                const dx = trunc(pyRound(tx - cur[0])), dy = trunc(pyRound(ty - cur[1]));
                if (Math.abs(dx) <= 121 && Math.abs(dy) <= 121) { emit(dx, dy, jump); return; }
                emit(Math.max(-121, Math.min(121, dx)), Math.max(-121, Math.min(121, dy)), true);
            }
        }
        const lock = () => { for (const d of [6, -6, 6, -6]) emit(d, 0, false); };
        const trim = () => { for (const [dx, dy] of [[3, 3], [-6, -6], [3, 3]]) emit(dx, dy, true); };
        let first = true;
        seqs.forEach((sq, si) => {
            if (!sq.length) return;
            const hop = first ? 0 : Math.hypot(sq[0][0] * 10 - cur[0], -sq[0][1] * 10 - cur[1]);
            let cut = hop > 25;
            if (!cut && !first && TREE_I0 <= si && si < TREE_I1 && hop > 6) {
                const a = [cur[0] / 10.0, -cur[1] / 10.0];
                cut = !segOk(a, sq[0]);
            }
            if (!first && cut) { lock(); trim(); }
            moveto(sq[0], !first);
            if (first || cut) lock();
            first = false;
            for (let i = 1; i < sq.length; i++) moveto(sq[i], false);
        });
        lock();
        recs.push([0x00, 0x00, 0xF3]);
        let x0 = seqs[0][0][0] * 10, y0 = -seqs[0][0][1] * 10;
        let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
        for (const s of seqs) for (const p of s) {
            const x = p[0] * 10, y = -p[1] * 10;
            if (x < xmin) xmin = x;
            if (x > xmax) xmax = x;
            if (y < ymin) ymin = y;
            if (y > ymax) ymax = y;
        }
        const pad = (v, n) => String(v).padStart(n, ' ');
        const hdrStr = 'LA:VSBSEAL \rST:' + pad(recs.length - 1, 7) + '\rCO:  1\r+X:' + pad(trunc(xmax - x0), 5)
            + '\r-X:' + pad(trunc(x0 - xmin), 5) + '\r+Y:' + pad(trunc(ymax - y0), 5) + '\r-Y:' + pad(trunc(y0 - ymin), 5)
            + '\rAX:+    0\rAY:+    0\rMX:+    0\rMY:+    0\rPD:******\r';
        const dst = new Uint8Array(512 + recs.length * 3);
        dst.fill(0x20, 0, 512);
        for (let i = 0; i < hdrStr.length; i++) dst[i] = hdrStr.charCodeAt(i);
        dst[hdrStr.length] = 0x1a;
        for (let i = 0; i < recs.length; i++) {
            dst[512 + 3 * i] = recs[i][0]; dst[512 + 3 * i + 1] = recs[i][1]; dst[512 + 3 * i + 2] = recs[i][2];
        }
        // viewer data (same structure as vsb-stick-daten.js)
        const round2 = v => Math.round(v * 100) / 100;
        const groups = {};
        for (const k of Object.keys(G)) groups[k] = G[k].map(sq => sq.map(p => [round2(p[0]), round2(p[1])]));
        const viewer = { size_mm: 100.0 * SCALE, disc_r: 49.0 * SCALE, tree_x: TX0, tree_s: TS, groups };
        return { dst, viewer, stitches: recs.length - 1, tm };
    }

    // ---------- top level ----------
    function runAll(svg) {
        const M = parseMaster(svg);
        const print = printRaster(M);
        const h16 = makeHeightfield(M);
        const stls = buildSTLs(h16);
        const tm = treeMask592(M);
        const stick = makeStick(svg, M, tm);
        return { M, print, h16, stls, stick };
    }

    return { parseMaster, render, printRaster, makePrintPNG, grayPNG, treeMask592, makeHeightfield, buildSTLs, makeStick, runAll };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = VSB;
