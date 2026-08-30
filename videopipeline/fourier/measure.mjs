// Ground truth for every number the film says out loud. Same sampler and same DFT
// the lab uses (js/fourier-logic.js), 1000 points per shape, 550 px footprint.
//
// Two different "how much is captured" measures get mixed up easily, so both are
// printed side by side:
//   ampPct    = |first N| / |all|            (vector-norm share, the sqrt one)
//   energyPct = sum amp^2 up to N / total    (the real energy share)
// The film speaks energyPct. maxErr/rms are the only measures that say anything
// about how the picture actually looks.
import { chromium } from 'playwright';

const NOTE_SVG = "M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.29a5.88,5.88,0,0,0-.81-.55,8.33,8.33,0,0,0-6.53-.41c-4.12,1.33-6.77,5.13-5.91,8.47a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.52c3.7-1.19,6.2-4.37,6.06-7.42,0,0,0,0,0,0V8.49c1,.12,2.37.33,3.82.64a11.17,11.17,0,0,1,4.06,1.46c1,.66.38,1.9.33,2a11.8,11.8,0,0,1-1.66,2,1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16Z";
const HEART_SVG = "M 0,60 C -40,60 -80,20 -80,-30 C -80,-80 -40,-110 0,-70 C 40,-110 80,-80 80,-30 C 80,20 40,60 0,60";
const STEPS = [2,3,4,5,6,7,8,9,10,12,14,16,18,20,30,40,50,100,200,300,400,500,1000];

const browser = await chromium.launch();
const page = await browser.newPage();
const out = await page.evaluate(({ NOTE_SVG, HEART_SVG, STEPS }) => {
    function sampleSVGPath(d, density, targetScale = 10) {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        const el = document.createElementNS(ns, "path");
        el.setAttribute("d", d); svg.appendChild(el); document.body.appendChild(svg);
        const len = el.getTotalLength(); const raw = [];
        let a = Infinity, b = -Infinity, c = Infinity, e = -Infinity;
        for (let i = 0; i < density; i++) {
            const p = el.getPointAtLength((i / density) * len);
            const x = p.x, y = -p.y; raw.push({ x, y });
            a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); e = Math.max(e, y);
        }
        const cx = (a + b) / 2, cy = (c + e) / 2;
        return raw.map(p => ({ x: (p.x - cx) * targetScale, y: (p.y - cy) * targetScale }));
    }
    function generateSquare(size, density) {
        const p = [];
        for (let i = 0; i < density; i++) p.push({ x: -size + (2*size*i)/density, y: size });
        for (let i = 0; i < density; i++) p.push({ x: size, y: size - (2*size*i)/density });
        for (let i = 0; i < density; i++) p.push({ x: size - (2*size*i)/density, y: -size });
        for (let i = 0; i < density; i++) p.push({ x: -size, y: -size + (2*size*i)/density });
        return p;
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
    function norm(path) {
        let a=Infinity,b=-Infinity,c=Infinity,e=-Infinity;
        path.forEach(p=>{a=Math.min(a,p.x);b=Math.max(b,p.x);c=Math.min(c,p.y);e=Math.max(e,p.y);});
        const ax=(a+b)/2, ay=(c+e)/2, s = 550/Math.max(b-a, e-c, 1);
        return path.map(p=>({ re:(p.x-ax)*s, im:(p.y-ay)*s }));
    }
    const SHAPES = {
        NOTE: norm(sampleSVGPath(NOTE_SVG, 1000)),
        QUADRAT: norm(generateSquare(150, 250)),
        HERZ: norm(sampleSVGPath(HEART_SVG, 1000))
    };
    const res = {};
    for (const key of Object.keys(SHAPES)) {
        const z = SHAPES[key], M = z.length, F = dft(z);
        const tot2 = F.reduce((s,c)=>s+c.amp*c.amp,0);
        const rows = [];
        for (const N of STEPS) {
            if (N > F.length) continue;
            let e2 = 0; for (let i=0;i<N;i++) e2 += F[i].amp*F[i].amp;
            let maxErr = 0, sse = 0;
            for (let n = 0; n < M; n++) {
                const t = 2*Math.PI*n/M;
                let x=0,y=0;
                for (let i=0;i<N;i++){ const c=F[i]; const a=c.freq*t+c.phase; x+=c.amp*Math.cos(a); y+=c.amp*Math.sin(a); }
                const d = Math.hypot(x - z[n].re, y - z[n].im);
                if (d>maxErr) maxErr = d; sse += d*d;
            }
            rows.push({ N, ampPct:+(100*Math.sqrt(e2/tot2)).toFixed(3),
                        energyPct:+(100*e2/tot2).toFixed(3),
                        maxErrPx:+maxErr.toFixed(1), rmsPx:+Math.sqrt(sse/M).toFixed(2) });
        }
        // share of the single biggest circle, and the biggest ones by amplitude
        const big = [...F].sort((a,b)=>b.amp-a.amp).slice(0,4)
                          .map(c=>({ freq:c.freq, amp:+c.amp.toFixed(1), energyPct:+(100*c.amp*c.amp/tot2).toFixed(2) }));
        res[key] = { top: F.slice(0,8).map(c=>({freq:c.freq, amp:+c.amp.toFixed(1)})), big, rows };
    }
    return res;
}, { NOTE_SVG, HEART_SVG, STEPS });
await browser.close();

const KEY = [2,3,4,5,6,10,12,20,50,100,400,1000];
for (const k of Object.keys(out)) {
  console.log('\n==== ' + k);
  console.log('  groesste Kreise:', JSON.stringify(out[k].big));
  console.log('  N     Amp%    Energie%   maxErr   rms');
  for (const r of out[k].rows) if (KEY.includes(r.N))
    console.log('  ' + String(r.N).padStart(4), String(r.ampPct).padStart(7), String(r.energyPct).padStart(10),
                String(r.maxErrPx).padStart(8), String(r.rmsPx).padStart(7));
}

// ready-to-paste DATA block for HTML/drehbuch/fourier.html
console.log('\n\n---- DATA block ----');
for (const k of ['NOTE','QUADRAT','HERZ']) {
  const rows = out[k].rows.map(r => '[' + r.N + ',' + r.energyPct + ',' + r.maxErrPx + ']');
  const lines = [];
  for (let i = 0; i < rows.length; i += 6) lines.push(rows.slice(i, i + 6).join(','));
  console.log('    ' + (k + ':').padEnd(9) + '[' + lines.join(',\n              ') + '],');
}
