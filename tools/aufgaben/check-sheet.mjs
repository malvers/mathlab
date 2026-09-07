#!/usr/bin/env node
// Checks a generated Textaufgaben sheet the way the browser will see it:
//   node tools/aufgaben/check-sheet.mjs HTML/aufgaben/*.html
// - every $...$ passage renders in KaTeX with throwOnError (the vendor copy the page loads)
// - exactly three tasks, AFB I, II, III in this order, 2-4 parts each, one solution paragraph per part
// - no control characters (a "\a" in a Python string is a BEL and shows as a blank box)
// Exit code 1 on the first sheet with findings; prints one line per sheet otherwise.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const katex = require(path.join(HERE, '..', '..', 'HTML', 'morpheus', 'vendor', 'katex', 'katex.min.js'));

const files = process.argv.slice(2);
if (!files.length) { console.error('usage: check-sheet.mjs <sheet.html> ...'); process.exit(1); }

const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
let bad = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const findings = [];
  for (let i = 0; i < html.length; i++) {
    const c = html.charCodeAt(i);
    if (c < 32 && c !== 10 && c !== 9) { findings.push(`control char U+${c.toString(16).padStart(4, '0')} at ${i}`); break; }
  }
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const tasks = main.match(/<section class="task afb(\d)">/g) || [];
  const afbs = tasks.map((t) => +t.match(/afb(\d)/)[1]);
  if (afbs.join() !== '1,2,3') findings.push(`tasks/AFB order: [${afbs.join(',')}] (want 1,2,3)`);
  const partCounts = [...main.matchAll(/<ol class="parts">([\s\S]*?)<\/ol>/g)].map((m) => (m[1].match(/<li>/g) || []).length);
  const solCounts = [...main.matchAll(/<div class="sol">([\s\S]*?)<\/div>/g)].map((m) => (m[1].match(/<p><b>[a-d]\)<\/b>/g) || []).length);
  partCounts.forEach((n, i) => {
    if (n < 2 || n > 4) findings.push(`task ${i + 1}: ${n} parts`);
    if (solCounts[i] !== n) findings.push(`task ${i + 1}: ${n} parts but ${solCounts[i]} solution paragraphs`);
  });
  if (!/Doc Alvers Mathe-Labor/.test(html)) findings.push('brand line missing');
  if (/<a class="btn" href="[^"]*\.pdf"/.test(html)) findings.push('PDF button present - sheets are HTML only');
  // formulas as the page's own script sees them: text nodes split on $...$
  const text = unescape(main.replace(/<[^>]+>/g, ' '));
  const formulas = [...text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
  if (formulas.length < 6) findings.push(`only ${formulas.length} formulas - is the sheet really typeset?`);
  for (const f of formulas) {
    try { katex.renderToString(f, { throwOnError: true, displayMode: false }); }
    catch (e) { findings.push(`KaTeX: ${f}  ->  ${e.message.split('\n')[0]}`); }
  }
  if (/\$\s*\$/.test(text)) findings.push('empty $$');
  const odd = (text.match(/\$/g) || []).length % 2;
  if (odd) findings.push('odd number of $ - a formula is not closed');
  if (findings.length) { bad++; console.log(`!! ${file}\n   ` + findings.join('\n   ')); }
  else console.log(`ok ${path.basename(file)}  (${formulas.length} Formeln, Teilaufgaben ${partCounts.join('/')})`);
}
process.exit(bad ? 1 : 0);
