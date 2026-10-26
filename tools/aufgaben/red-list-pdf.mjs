#!/usr/bin/env node
// Red/orange plan lists ("Das kann drankommen") -> A4 PDF: all questions first, then all solutions.
//   node tools/aufgaben/red-list-pdf.mjs
// Doc, 26.10.2026: "Download PDF" in the head of the list, no print dialog - so the PDF is built
// here, beforehand, and the button in svp-plan-aufgaben.js only links to it. Every plan row whose
// redBtn names a PDF gets one: "pdf" in its JSON file (redBtn.src) or redBtn.pdf for inline items,
// both relative to the plan page. A list shared by several plans is built once.
// Run it again after a list changes. Uses the Playwright Chromium from videopipeline/node_modules.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SVP = path.join(ROOT, 'HTML/svp');
const KATEX = path.join(ROOT, 'HTML/morpheus/vendor/katex');

/* Same counting walk as tools/build-plan-suchindex.mjs: the literal from `window.PLAN = [`
   to its closing bracket, skipping strings and comments. */
function planLiteral(src) {
    const start = src.indexOf('window.PLAN');
    if (start < 0) return null;
    const open = src.indexOf('[', start);
    if (open < 0) return null;
    let tiefe = 0, quote = null;
    for (let i = open; i < src.length; i++) {
        const c = src[i], n = src[i + 1];
        if (quote) {
            if (c === '\\') { i++; continue; }
            if (c === quote) quote = null;
            continue;
        }
        if (c === '\'' || c === '"' || c === '`') { quote = c; continue; }
        if (c === '/' && n === '/') { i = src.indexOf('\n', i); if (i < 0) return null; continue; }
        if (c === '/' && n === '*') { i = src.indexOf('*/', i); if (i < 0) return null; i++; continue; }
        if (c === '[' || c === '{') tiefe++;
        else if (c === ']' || c === '}') { tiefe--; if (!tiefe) return src.slice(open, i + 1); }
    }
    return null;
}

function plans(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function (e) {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? plans(p) : (e.name.endsWith('.html') ? [p] : []);
    });
}

/* "Stoffverteilungsplan Informatik 11 | SJ 2026/27" -> "Informatik 11" and "SJ 2026/27" */
function planName(src) {
    const t = (src.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const [name, sj] = t.split('|').map(function (x) { return x.trim(); });
    return { name: name.replace(/^Stoffverteilungsplan\s+/, ''), sj: sj || '' };
}

const lists = new Map();
for (const file of plans(SVP)) {
    const src = fs.readFileSync(file, 'utf8');
    const lit = src.includes('redBtn') && planLiteral(src);
    if (!lit) continue;
    let rows;
    try { rows = vm.runInNewContext('(' + lit + ')'); }
    catch (e) { console.error(path.relative(ROOT, file) + ': PLAN not readable - ' + e.message); continue; }
    for (const row of rows) {
        const cfg = row && row.redBtn;
        if (!cfg) continue;
        let items = cfg.items || [], pdf = cfg.pdf, info = cfg.info, title = cfg.title || cfg.label;
        if (cfg.src) {
            const d = JSON.parse(fs.readFileSync(path.join(path.dirname(file), cfg.src), 'utf8'));
            items = Array.isArray(d) ? d : (d.items || []);
            pdf = pdf || d.pdf;
            info = info || d.info;
            title = d.title || title;   // a list shared by plans with different buttons names itself
        }
        if (!pdf) continue;
        const out = path.join(path.dirname(file), pdf);
        const plan = planName(src);
        if (!lists.has(out)) lists.set(out, { title, items, info, names: [], sj: plan.sj });
        const l = lists.get(out);
        if (!l.names.includes(plan.name)) l.names.push(plan.name);
    }
}

const esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

function page(l) {
    const q = function (it) { return typeof it === 'string' ? it : it.q; };
    const tasks = l.items.map(function (it) { return '<li><div class="m">' + esc(q(it)) + '</div></li>'; }).join('\n');
    const sols = l.items.map(function (it) {
        return '<li><div class="m q">' + esc(q(it)) + '</div>' +
            (it && it.a ? '<div class="m a">' + esc(it.a) + '</div>' : '') + '</li>';
    }).join('\n');
    return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<title>${esc(l.title)}</title>
<link rel="stylesheet" href="${pathToFileURL(path.join(KATEX, 'katex.min.css')).href}">
<script src="${pathToFileURL(path.join(KATEX, 'katex.min.js')).href}"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* palette and type of the worksheets (aufgaben/*-textaufgaben.html), light because it gets printed */
@page { size: A4; margin: 15mm 16mm 17mm; }
:root { --ink: #0E244E; --body: #2C3C60; --muted: #6E7E9F; --red: #B02418; --green: #799E31; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Raleway, system-ui, sans-serif; color: var(--body); font-size: 10.5pt; line-height: 1.45; }
.brand, h1, h2 { font-family: Orbitron, system-ui, sans-serif; }
.brand { font-size: 7.5pt; letter-spacing: 0.14em; color: var(--muted); }
h1 { font-size: 14pt; color: var(--ink); margin: 3px 0 2px; font-weight: 700; }
.sub { font-size: 9pt; color: var(--muted); margin-bottom: 10px; }
.info { font-weight: 600; color: var(--ink); margin: -6px 0 10px; }
h2 { font-size: 10.5pt; letter-spacing: 0.08em; color: var(--red); border-bottom: 1.5px solid var(--red);
     padding-bottom: 3px; margin: 12px 0 8px; }
ol { padding-left: 2em; }
li { margin: 0 0 7px; break-inside: avoid; }
li::marker { color: var(--red); font-weight: 700; }
.loesungen { break-before: page; }
.loesungen .q { font-size: 9pt; color: var(--muted); }
.loesungen .a { white-space: pre-line; margin-top: 2px; padding-left: 8px; border-left: 2px solid var(--green); }
.katex { font-size: 1.04em; white-space: nowrap; }
</style></head><body>
<div class="brand">DOC ALVERS MATHE-LABOR</div>
<h1>${esc(l.title)}</h1>
<div class="sub">${esc(l.names.join(' · '))}${l.sj ? ' · ' + esc(l.sj) : ''} · ${l.items.length} Aufgaben</div>
${l.info ? '<div class="m info">' + esc(l.info) + '</div>' : ''}
<h2>AUFGABEN</h2>
<ol>${tasks}</ol>
<section class="loesungen"><h2>LÖSUNGEN</h2>
<ol>${sols}</ol></section>
<script>
/* $...$ as in the plan (setMathText): text between the dollars is KaTeX, the rest stays text */
document.querySelectorAll('.m').forEach(function (el) {
    el.innerHTML = el.innerHTML.split(/\\$([^$]+)\\$/).map(function (part, i) {
        if (!(i % 2)) return part;
        const t = document.createElement('textarea'); t.innerHTML = part;
        return katex.renderToString(t.value, { throwOnError: false });
    }).join('');
});
</script></body></html>`;
}

/* node_modules is not in git: in a worktree it lives only in the main checkout */
function playwright() {
    const rel = 'videopipeline/node_modules/playwright/index.mjs';
    if (fs.existsSync(path.join(ROOT, rel))) return path.join(ROOT, rel);
    const common = execSync('git rev-parse --git-common-dir', { cwd: ROOT }).toString().trim();
    return path.join(path.resolve(ROOT, common), '..', rel);
}
const { chromium } = await import(pathToFileURL(playwright()).href);
const browser = await chromium.launch();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'red-list-pdf-'));
for (const [out, l] of lists) {
    const html = path.join(tmp, path.basename(out, '.pdf') + '.html');
    fs.writeFileSync(html, page(l));
    const p = await browser.newPage();
    await p.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
    await p.evaluate(function () { return document.fonts.ready; });
    const errors = await p.evaluate(function () { return document.querySelectorAll('.katex-error').length; });
    await p.pdf({
        path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: '<div style="width:100%;font:7pt sans-serif;color:#6E7E9F;text-align:center">' +
            '<span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    });
    const pages = (fs.readFileSync(out, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(path.relative(ROOT, out), '-', l.items.length, 'items,', pages, 'pages,', errors, 'KaTeX errors,',
        Math.round(fs.statSync(out).size / 1024), 'KB');
    await p.close();
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
