import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

// seed notes before the page script runs
await p.addInitScript(() => {
  localStorage.setItem('svp-notes', JSON.stringify([
    { id: 'a', title: 'Fadenzahl', body: 'Ein <b>Muster</b> ist nicht die Fadenzahl.', fmt: 1, ts: 1756000000000, ord: 0 },
    { id: 'b', title: 'Lochkarte', body: 'Jacquard 1805, Programm auf Papier.', fmt: 0, ts: 1756000001000, ord: 1 },
    { id: 'c', title: 'Termine', body: 'Abi-Termine noch offen', fmt: 0, ts: 1756000002000, ord: 2 }
  ]));
});
await p.goto('http://localhost:8765/svp/notes.html');
await p.waitForTimeout(600);

// the page is locked without a cloud session — unlock the view for the test only
await p.evaluate(() => { document.body.classList.remove('locked'); });

const q = async (v) => {
  await p.fill('#note-search', v);
  await p.waitForTimeout(120);
  return p.evaluate(() => ({
    cards: [...document.querySelectorAll('.note-card')].map(c => c.querySelector('.note-title').value),
    allOpen: [...document.querySelectorAll('.note-card')].every(c => c.classList.contains('open')),
    count: document.getElementById('search-count').textContent,
    countHidden: document.getElementById('search-count').hidden,
    hint: document.getElementById('empty-hint').hidden ? null : document.getElementById('empty-hint').textContent,
    hits: (CSS.highlights.get('note-find') || { size: 0 }).size
  }));
};

console.log('empty  ', JSON.stringify(await q('')));
console.log('faden  ', JSON.stringify(await q('faden')));   // title + body hit in note a
console.log('PAPIER ', JSON.stringify(await q('PAPIER')));  // case-insensitive body hit
console.log('muster ', JSON.stringify(await q('muster')));  // inside rich-text markup
console.log('zzz    ', JSON.stringify(await q('zzz')));
console.log('cleared', JSON.stringify(await q('')));
console.log(errs.length ? errs.join('\n') : 'no errors');
await b.close();
