// SVP-Erklärvideo für Schüler — Solita, sichtbare Klicks, eine durchgehende Aufnahme.
import fs from 'fs';
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('svp');

export const NARRATION = {
  s1: 'Hallo! Hier findet ihr eure Stoffverteilungspläne — von der Oberschule über das Berufliche Gymnasium bis zur Fachoberschule. Ein Klick, und ihr seht euer ganzes Schuljahr auf einen Blick.',
  s2: 'Nehmen wir Informatik, Klasse elf. Oben stehen die Lernbereiche aus dem sächsischen Lehrplan — mit ihren Unterrichtsstunden. Und darunter beginnt der eigentliche Plan.',
  s3: 'Woche für Woche: Kalenderwoche, Thema, Inhalte. So wisst ihr immer, was als Nächstes kommt — und könnt vorausschauend lernen.',
  s4: 'Jede Zeile lässt sich aufklappen. Darin stecken die Details — und Materialien: Videos, interaktive Labore, Übungen. Ganz wichtig: Diese Materialien sind Angebote! Freiwillig, zum Üben, zum Vertiefen, zum Neugierig-Bleiben.',
  s5: 'Ihr seht außerdem, in welchen Wochen Leistungen wie Klassenarbeiten geplant sind — als grobe Orientierung übers Jahr.',
  s6: '<speak>Und das Wichtigste zum Schluss: Alles, was für Tests und den Unterricht verbindlich ist, postet euch Doc Alvers direkt in euer Team bei Microsoft Teams. Teams ist die offizielle Quelle — dieser Plan ist euer Kompass. Viel Erfolg im Schuljahr!</speak>',
};
const durs = await synthScenes(NARRATION, { outDir: OUT });
fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
const d = (k, pad = 2.2) => durs[k] * 1000 + pad * 1000;

await runScenes([
  { name: 'main', url: 'https://docalvers.de/svp/index.html', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);
      mark('s1');                             // index: cursor strolls over the subject cards
      await p.mouse.move(300, 420);
      await p.mouse.move(640, 440, { steps: 40 });
      await p.mouse.move(1000, 420, { steps: 40 });
      await p.mouse.move(640, 620, { steps: 40 });
      await p.waitForTimeout(Math.max(1500, d('s1') - 5000));
      await p.mouse.move(575, 65, { steps: 25 });   // INF 11 pill
      await p.waitForTimeout(600);

      mark('s2');
      await p.locator('a[href="informatik/inf.html"]').first().click();
      await p.waitForLoadState('load');
      await p.waitForTimeout(1500);
      await p.locator('a[href="inf11.html"]').first().click();
      await p.waitForLoadState('load');
      await p.waitForTimeout(1500);
      await p.mouse.move(640, 500);
      await p.waitForTimeout(d('s2') - 3500);

      mark('s3');                             // slow scroll through the weeks
      for (let i = 0; i < 24; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(Math.max(120, (d('s3') - 2000) / 24 - 40)); }
      await p.waitForTimeout(1800);

      mark('s4');                             // back to top, expand row 1 with materials
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'smooth' }));
      await p.waitForTimeout(1500);
      const row = p.locator('#plan-table tr').nth(1);
      await row.scrollIntoViewIfNeeded();
      await row.click();
      await p.waitForTimeout(1200);
      await p.mouse.move(900, 520, { steps: 30 });   // hover across the material links
      await p.mouse.move(900, 600, { steps: 30 });
      await p.waitForTimeout(Math.max(2000, d('s4') - 5500));

      mark('s5');                             // scroll to the Klassenarbeit week
      await p.evaluate(() => {
        const tr = Array.from(document.querySelectorAll('#plan-table tr')).find((r) => /Klassenarbeit/.test(r.textContent || ''));
        if (tr) tr.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      await p.waitForTimeout(1600);
      await p.evaluate(() => {
        const tr = Array.from(document.querySelectorAll('#plan-table tr')).find((r) => /Klassenarbeit/.test(r.textContent || ''));
        if (tr) { const rect = tr.getBoundingClientRect(); window.__karow = rect.top + rect.height / 2; }
      });
      const y = await p.evaluate(() => window.__karow || 400);
      await p.mouse.move(700, y, { steps: 25 });
      await p.waitForTimeout(Math.max(2000, d('s5') - 3500));

      mark('s6');                             // back to the top header while the Teams message plays
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'smooth' }));
      await p.waitForTimeout(1600);
      await p.mouse.move(640, 680, { steps: 20 });
      await p.waitForTimeout(Math.max(2500, d('s6') - 3000));
      mark('end');
  } },
], { outDir: OUT, showCursor: true });
console.log('SVP RECORD DONE');
