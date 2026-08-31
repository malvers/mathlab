// Measure the fourier lab's real convergence: same sampler, same DFT, same N steps.
import { chromium } from 'playwright';

const NOTE_SVG = "M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.29a5.88,5.88,0,0,0-.81-.55,8.33,8.33,0,0,0-6.53-.41c-4.12,1.33-6.77,5.13-5.91,8.47a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.52c3.7-1.19,6.2-4.37,6.06-7.42,0,0,0,0,0,0V8.49c1,.12,2.37.33,3.82.64a11.17,11.17,0,0,1,4.06,1.46c1,.66.38,1.9.33,2a11.8,11.8,0,0,1-1.66,2,1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16Z";
const HEART_SVG = "M 0,60 C -40,60 -80,20 -80,-30 C -80,-80 -40,-110 0,-70 C 40,-110 80,-80 80,-30 C 80,20 40,60 0,60";
const STEPS = [2,3,4,5,6,7,8,9,10,12,14,16,18,20,30,40,50,100,200,300,400,500,1000];

const browser = await chromium.launch();
const page = await browser.newPage();
const out = await page.evaluate(({ NOTE_SVG, HEART_SVG, STEPS }) => {
    function sampleSVGPath(pathData, density, targetScale = 10) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", pathData);
        svg.appendChild(pathEl); document.body.appendChild(svg);
        const length = pathEl.getTotalLength();
        const raw = [];
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < density; i++) {
            const p = pathEl.getPointAtLength((i / density) * length);
            const x = p.x, y = -p.y;
            raw.push({ x, y });
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
        const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
        return raw.map(p => ({ x: (p.x - cx) * targetScale, y: (p.y - cy) * targetScale }));
    }
    function generateSquare(size, density) {
        const path = [];
        for (let i = 0; i < density; i++) path.push({ x: -size + (2*size*i)/density, y: size });
        for (let i = 0; i < density; i++) path.push({ x: size, y: size - (2*size*i)/density });
        for (let i = 0; i < density; i++) path.push({ x: size - (2*size*i)/density, y: -size });
        for (let i = 0; i < density; i++) path.push({ x: -size, y: -size + (2*size*i)/density });
        return path;
    }
    function dft(x) {
        const X = []; const N = x.length;
        for (let k = 0; k < N; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < N; n++) {
                const phi = (Math.PI * 2 * k * n) / N;
                re += x[n].re * Math.cos(phi) + x[n].im * Math.sin(phi);
                im += -x[n].re * Math.sin(phi) + x[n].im * Math.cos(phi);
            }
            re /= N; im /= N;
            let freq = k; if (freq > N/2) freq -= N;
            X.push({ re, im, freq, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
        }
        X.sort((a,b) => Math.abs(a.freq) - Math.abs(b.freq));
        return X;
    }
    function normalize(targetPath) {
        let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
        targetPath.forEach(p=>{minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);});
        const ax=(minX+maxX)/2, ay=(minY+maxY)/2;
        const range = Math.max(maxX-minX, maxY-minY, 1);
        const s = 550/range;
        return targetPath.map(p=>({ re:(p.x-ax)*s, im:(p.y-ay)*s }));
    }
    const SHAPES = {
        NOTE: normalize(sampleSVGPath(NOTE_SVG, 1000)),
        QUADRAT: normalize(generateSquare(150, 250)),
        HERZ: normalize(sampleSVGPath(HEART_SVG, 1000))
    };
    const res = {};
    for (const key of Object.keys(SHAPES)) {
        const z = SHAPES[key];
        const M = z.length;
        const F = dft(z);
        const total = Math.sqrt(F.reduce((s,c)=>s+c.amp*c.amp,0));
        const rows = [];
        for (const N of STEPS) {
            if (N > F.length) continue;
            // energy captured
            let e = 0; for (let i=0;i<N;i++) e += F[i].amp*F[i].amp;
            const energy = Math.sqrt(e)/total;
            // real reconstruction error, sampled at the same t as the shape points
            let maxErr = 0, sse = 0;
            for (let n = 0; n < M; n++) {
                const t = 2*Math.PI*n/M;
                let x=0,y=0;
                for (let i=0;i<N;i++){ const c=F[i]; const a=c.freq*t+c.phase; x+=c.amp*Math.cos(a); y+=c.amp*Math.sin(a); }
                const d = Math.hypot(x - z[n].re, y - z[n].im);
                if (d>maxErr) maxErr = d; sse += d*d;
            }
            rows.push({ N, energyPct: +(100*energy).toFixed(3), maxErrPx: +maxErr.toFixed(1),
                        rmsPx: +Math.sqrt(sse/M).toFixed(2) });
        }
        res[key] = {
            points: M,
            bbox: 550,
            top: F.slice(0,12).map(c=>({ freq:c.freq, amp:+c.amp.toFixed(1) })),
            rows
        };
    }
    return res;
}, { NOTE_SVG, HEART_SVG, STEPS });
await browser.close();
console.log(JSON.stringify(out, null, 1));
