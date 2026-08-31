// Ground truth for the Galton film.
//
// Part 1 is exact arithmetic: with 18 rows the bin counts follow a binomial
// distribution, and the film's whole claim ("the bell curve is not put there, it
// falls out") stands or dies on those numbers.
//
// Part 2 asks the lab what a recording can actually do with it — and it turns out
// two things in the feature description are not true of the code:
//   * there is NO Gaussian overlay drawn anywhere in galtonboard.html
//   * every 60th ball is NOT random: pickEmptyBinIndex() steers it into a bin that
//     is still empty (explorerEvery = 60). It is self-limiting — once every bin has
//     been hit, steering stops — but the FIRST ball in each outer bin is placed, not
//     won. A film about pure chance has to say so or the lab has to change.
import { chromium } from 'playwright';

const ROWS = 18;                                  // the lab's default
function binom(n) {
  const p = [1];
  for (let i = 0; i < n; i++) {
    const q = [1];
    for (let k = 0; k < p.length - 1; k++) q.push(p[k] + p[k + 1]);
    q.push(1);
    p.length = 0; p.push(...q);
  }
  return p;
}
const coeff = binom(ROWS);
const total = coeff.reduce((a, b) => a + b, 0);    // 2^18
console.log('=== Exakt: ' + ROWS + ' Reihen, ' + (ROWS + 1) + ' Fächer, 2^' + ROWS + ' = ' + total + ' Wege ===');
console.log('  Fach   Wege        Anteil      bei 1000 Kugeln');
coeff.forEach((c, i) => {
  const pr = c / total;
  if (i <= 3 || Math.abs(i - ROWS / 2) < 2 || i >= ROWS - 3) {
    console.log('  ' + String(i).padStart(4), String(c).padStart(9),
      (100 * pr).toFixed(4).padStart(10) + ' %', (1000 * pr).toFixed(2).padStart(14));
  }
});
const mean = ROWS / 2, sd = Math.sqrt(ROWS / 4);
console.log('  Mitte ' + mean + ' Fächer, Streuung ' + sd.toFixed(3) + ' Fächer');
console.log('  Aussenfach: ein Weg von ' + total + ' — im Schnitt eine Kugel alle ' +
  Math.round(total / 1) + ' Würfe.');
console.log('  Für EINE Kugel im Aussenfach braucht man also im Mittel ' +
  (total / 1000).toFixed(0) + ' Tausend Kugeln.');

/* how close is the binomial to the Gaussian here? the film claims they agree */
let maxDev = 0, at = 0;
coeff.forEach((c, i) => {
  const pr = c / total;
  const gz = Math.exp(-((i - mean) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
  const d = Math.abs(pr - gz);
  if (d > maxDev) { maxDev = d; at = i; }
});
console.log('  Groesster Abstand Binomial <-> Glockenkurve: ' + (100 * maxDev).toFixed(4) +
  ' Prozentpunkte (Fach ' + at + ')');

/* --- what the lab gives a recording --- */
const browser = await chromium.launch({ channel: 'chromium' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto('http://localhost:8765/galtonboard.html', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const reach = await page.evaluate(() => {
  const test = (n) => { try { return typeof eval(n); } catch (e) { return 'unreachable'; } };
  const ids = ['slider-rows', 'slider-spawn', 'slider-speed', 'slider-maxballs',
               'btn-play-pause', 'btn-reset', 'balls-counter-widget', 'board'];
  return {
    sim: test('sim'),
    dom: Object.fromEntries(ids.map((i) => [i, !!document.getElementById(i)])),
    sliders: Object.fromEntries(['slider-rows', 'slider-spawn', 'slider-speed', 'slider-maxballs']
      .map((i) => [i, (document.getElementById(i) || {}).value])),
  };
});
console.log('\n=== Was die Aufnahme im Lab erreichen kann ===');
console.log('  sim (der ganze Zustand):', reach.sim, '<- nur ueber die DOM-Regler steuerbar');
console.log('  DOM-Griffe:', JSON.stringify(reach.dom));
console.log('  Regler beim Start:', JSON.stringify(reach.sliders));

/* throughput: how fast do balls accumulate at the default and at full tilt? */
const counter = () => page.evaluate(() => {
  const el = document.getElementById('balls-counter-widget');
  return el ? parseInt(el.textContent.replace(/\D/g, ''), 10) || 0 : 0;
});
const setSlider = (id, v) => page.evaluate(([id, v]) => {
  const s = document.getElementById(id);
  s.value = String(v);
  s.dispatchEvent(new Event('input', { bubbles: true }));
  s.dispatchEvent(new Event('change', { bubbles: true }));
}, [id, v]);

console.log('\n=== Durchsatz (Kugeln pro Sekunde) ===');
for (const [label, spawn, speed, maxb] of [
  ['Auslieferung  ', 50, 1.0, 200],
  ['schnell       ', 10, 5.0, 500],
]) {
  await setSlider('slider-spawn', spawn);
  await setSlider('slider-speed', speed);
  await setSlider('slider-maxballs', maxb);
  await page.waitForTimeout(600);
  const a = await counter();
  await page.waitForTimeout(8000);
  const b = await counter();
  console.log('  ' + label, 'spawn ' + String(spawn).padStart(4) + ' ms, Tempo ' + speed +
    ', max ' + maxb + '  ->  ' + ((b - a) / 8).toFixed(1) + ' Kugeln/s');
}
console.log('  Fuer 10 000 Kugeln braucht es damit rund ' +
  '(siehe oben) — das entscheidet, was in einer Szene ueberhaupt zu zeigen ist.');
await browser.close();
