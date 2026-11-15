/**
 * pdf-aufloesung.mjs — the effective resolution of every raster image in a PDF, page by page
 *
 *     node tools/kdp/pdf-aufloesung.mjs <datei.pdf> [--alle]      (lists the images under 300 ppi, --alle every image)
 *     import { bildAufloesung } from './pdf-aufloesung.mjs'         (used by druckcheck.mjs)
 *
 * Doc, 15.11.2026, after the KDP manuscript of mathegy12lk went up with the old, blurred cover wall "Alle 24 Lehrbücher"
 * (its pages 3-240 came from the file of 08.11.): "stellt bitte unbedingt sicher, dass nie wieder im Buch dort hochgeht mit
 * diesen schlecht aufgelösten Grafiken." Effective resolution = the image's pixels divided by the size it is drawn at on
 * the page (ppi). Needs only qpdf (already required by kdp.mjs): its JSON gives the objects and the raw streams; the page
 * content and the form XObjects are inflated here and walked for q / Q / cm / Do, so an image inside a form (Chromium
 * groups transparency that way) is measured with the full transformation.
 */
import { execFileSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const mul = (m, n) => [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2],
    m[2] * n[1] + m[3] * n[3], m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];

// the operands and operators of a content stream; strings, arrays and dictionaries are skipped as one operand
function* tokens(s) {
    let i = 0;
    const n = s.length, ws = c => c === 32 || c === 10 || c === 13 || c === 9 || c === 12 || c === 0;
    const delim = c => ws(c) || '()<>[]{}/%'.includes(String.fromCharCode(c));
    while (i < n) {
        const c = s.charCodeAt(i);
        if (ws(c)) { i++; continue; }
        if (c === 37) { while (i < n && s[i] !== '\n' && s[i] !== '\r') i++; continue; }          // % comment
        if (c === 40) {                                                                               // ( string )
            let d = 0;
            for (; i < n; i++) {
                if (s[i] === '\\') { i++; continue; }
                if (s[i] === '(') d++;
                else if (s[i] === ')' && --d === 0) { i++; break; }
            }
            yield { op: false, v: null }; continue;
        }
        if (s.startsWith('<<', i) || s.startsWith('>>', i)) { i += 2; continue; }                    // dictionary bounds
        if (c === 60) { i = s.indexOf('>', i) + 1 || n; yield { op: false, v: null }; continue; }   // <hex>
        if (c === 91 || c === 93 || c === 123 || c === 125) { i++; continue; }                        // [ ] { }
        let j = i + 1;
        while (j < n && !delim(s.charCodeAt(j))) j++;
        const t = s.slice(i, j);
        i = j;
        if (c === 47) yield { op: false, v: t };                                                      // /Name
        else if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) yield { op: false, v: +t };
        else if (t === 'BI') {                                                                        // inline image: skip to EI
            const e = s.indexOf('EI', s.indexOf('ID', i));
            i = e < 0 ? n : e + 2;
        } else yield { op: true, v: t };
    }
}

/** every raster image drawn in the PDF: { page, w, h, wIn, hIn, ppi } (ppi = the lower of both directions) */
export function bildAufloesung(file) {
    const json = JSON.parse(execFileSync('qpdf', ['--json=2', '--json-stream-data=inline', '--decode-level=none', file],
        { maxBuffer: 1 << 30 }).toString());
    const objs = json.qpdf[1];
    const get = ref => objs['obj:' + ref] || {};
    const dictOf = o => o.stream ? o.stream.dict : o.value;
    const deref = v => (typeof v === 'string' && / 0 R$/.test(v)) ? dictOf(get(v)) : v;
    const data = o => {
        let b = Buffer.from(o.stream.data || '', 'base64');
        const f = [].concat(o.stream.dict['/Filter'] || []);
        if (f.includes('/FlateDecode')) b = inflateSync(b);
        return b.toString('latin1');
    };
    const out = [], seen = new Set();
    const walk = (src, resources, ctm, page, depth) => {
        const xo = deref(deref(resources)?.['/XObject']) || {};
        const stack = [];
        let m = ctm, ops = [];
        for (const t of tokens(src)) {
            if (!t.op) { ops.push(t.v); continue; }
            if (t.v === 'q') stack.push(m);
            else if (t.v === 'Q') m = stack.pop() || ctm;
            else if (t.v === 'cm' && ops.length >= 6) m = mul(ops.slice(-6).map(Number), m);
            else if (t.v === 'Do' && typeof ops[ops.length - 1] === 'string') {
                const ref = xo[ops[ops.length - 1]], o = get(ref), d = o.stream?.dict;
                if (d?.['/Subtype'] === '/Image') {
                    const wPt = Math.hypot(m[0], m[1]), hPt = Math.hypot(m[2], m[3]);
                    if (wPt > 0 && hPt > 0) {
                        const w = +d['/Width'], h = +d['/Height'], wIn = wPt / 72, hIn = hPt / 72;
                        out.push({ page, w, h, wIn, hIn, ppi: Math.min(w / wIn, h / hIn), ref });
                    }
                } else if (d?.['/Subtype'] === '/Form' && depth < 12) {
                    const fm = (d['/Matrix'] || [1, 0, 0, 1, 0, 0]).map(Number);
                    walk(data(o), d['/Resources'] || resources, mul(fm, m), page, depth + 1);
                }
            }
            ops = [];
        }
    };
    json.pages.forEach((p, i) => {
        const po = dictOf(get(p.object));
        let res = po['/Resources'], parent = po['/Parent'];
        while (!res && parent) { const pd = deref(parent); res = pd['/Resources']; parent = pd['/Parent']; }   // inherited
        const src = p.contents.map(r => data(get(r))).join('\n');
        walk(src, res, [1, 0, 0, 1, 0, 0], i + 1, 0);
    });
    return out;
}

// thresholds for druckcheck.mjs, measured 15.11.2026: the blurred cover wall of 08.11. was 72 ppi (CSS pixels, never
// re-rendered for print), the frozen 2D canvases are ~310 ppi (deviceScaleFactor 3.2), the WebGL figures ~192 ppi (their
// renderers cap the pixel ratio at 2). Under 150 ppi a printed pixel is 0.17 mm and more - stair steps on every edge at
// reading distance, the wall's look -> error, the upload stops. 150-299 is below the 300 dpi KDP asks for -> warning,
// listed with its page so it can be raised (the WebGL figures: a higher pixel ratio in print)
export const FEHLER_PPI = 150, WARN_PPI = 300;
// images drawn smaller than this (in inch, both sides) are ignored: decorative dots and hairlines, never visible pixels
export const MIN_INCH = 0.25;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    const file = process.argv[2], alle = process.argv.includes('--alle');
    if (!file) { console.error('usage: node tools/kdp/pdf-aufloesung.mjs <datei.pdf> [--alle]'); process.exit(1); }
    const r = bildAufloesung(file);
    for (const b of r) {
        if (!alle && b.ppi >= WARN_PPI) continue;
        console.log('S. ' + b.page + ': ' + b.w + '×' + b.h + ' px auf ' + b.wIn.toFixed(2) + '×' + b.hIn.toFixed(2) + ' in = ' + Math.round(b.ppi) + ' ppi');
    }
    console.log(r.length + ' Bilder, ' + r.filter(b => b.ppi < FEHLER_PPI && Math.max(b.wIn, b.hIn) >= MIN_INCH).length + ' unter ' + FEHLER_PPI + ' ppi');
}
