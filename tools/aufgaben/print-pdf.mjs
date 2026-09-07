#!/usr/bin/env node
// Worksheet -> A4 PDF, solutions on their own page (the print CSS in the sheet does that).
//   node tools/aufgaben/print-pdf.mjs HTML/aufgaben/<name>.html HTML/aufgaben/<name>.pdf
// Uses the Playwright Chromium from videopipeline/node_modules - nothing else gets installed.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [src, out] = process.argv.slice(2).map((p) => resolve(p));
if (!src || !out) {
  console.error('usage: print-pdf.mjs <sheet.html> <out.pdf>');
  process.exit(1);
}
const { chromium } = await import(new URL('../../videopipeline/node_modules/playwright/index.mjs', import.meta.url).href);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// every $...$ is rendered by KaTeX on load - wait until the formulas are in
await page.waitForFunction(() => document.querySelectorAll('.katex').length > 0);
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
console.log(out, '- katex:', await page.evaluate(() => document.querySelectorAll('.katex').length));
await browser.close();
