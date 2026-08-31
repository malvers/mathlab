import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const b = await chromium.launch(); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const html = readFileSync('/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/fbf5b96b-2547-46c7-8e08-dd1296998866/scratchpad/fourier-drehbuch.html', 'utf8');
await p.setContent('<!doctype html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body>');
await p.waitForTimeout(1200);
console.log(JSON.stringify(await p.evaluate(() => ({
  scenes: document.querySelectorAll('.scene').length,
  tl: document.querySelectorAll('.timeline i').length,
  rows: document.querySelectorAll('.tbl tbody tr').length,
  film: document.querySelectorAll('.budget dd')[2].firstChild.textContent
}))));
console.log(errs.length ? errs.join('\n') : 'no errors');
await b.close();
