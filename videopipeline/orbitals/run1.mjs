// Atomorbitale demo — very didactic, visible cursor clicks, one continuous recording.
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';
import fs from 'fs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('orb');

export const NARRATION = {
  s1: 'Wie sieht ein Atom wirklich aus? Vergiss das Bild von kleinen Kugeln, die wie Planeten ihre Bahnen ziehen — das hier kommt der Wahrheit viel näher. Du schaust auf ein Atomorbital: die Form des Raums, in dem sich ein Elektron aufhält. Das Labor dreht die Form automatisch für dich, damit du sie von allen Seiten sehen kannst.',
  s2: 'Fangen wir ganz einfach an. Ich klicke oben auf die Orbital-Auswahl — hier stehen sechsunddreißig Formen zur Wahl — und nehme die allererste: Y null null. Eine perfekte Kugel. So ist das Elektron im einfachsten Fall um den Atomkern verteilt: nicht auf einer Bahn — sondern rundherum, überall gleichzeitig.',
  s3: 'Einen Schritt weiter: die Hantel. Zwei Keulen, zwei Farben — und die Farben bedeuten etwas! Türkis heißt: Die Quantenwelle schwingt ins Plus. Gold heißt: ins Minus. Und genau dazwischen, wo die Keulen sich berühren, liegt eine unsichtbare Ebene, auf der das Elektron niemals zu finden ist. Sie heißt Knotenebene.',
  s4: 'Jetzt wird es hübsch: das Kleeblatt — vier Keulen, die sich immer abwechseln, Plus, Minus, Plus, Minus. Und diese Form hier hat sogar zwei Keulen und einen goldenen Ring in der Mitte. Das ist keine Fantasie — genau diese Formen stecken in jedem einzelnen Atom um dich herum.',
  s5: 'Und jetzt der wichtigste Moment im ganzen Video. Ich schalte die Wahrscheinlichkeitswolke ein — und die glatte Hülle verwandelt sich in zweihunderttausend leuchtende Pünktchen. Jeder Punkt ist ein möglicher Aufenthaltsort des Elektrons: Wo die Wolke dicht ist, ist es oft. Wo sie dünn ist, fast nie. Das Elektron ist kein Kügelchen auf einer Bahn — es IST diese Wolke.',
  s6: 'Ein kurzer Blick hinter die Kulissen: Ich stelle die Auflösung ganz nach unten — und plötzlich siehst du, dass der Computer die ganze Form aus lauter kleinen Dreiecken baut! Drehe ich die Auflösung wieder hoch, wird die Fläche glatt. Mehr Dreiecke bedeuten mehr Rechenarbeit — so entsteht jede Drei-D-Grafik.',
  s7: 'Es geht noch wilder. Hohe Orbitale sehen aus wie Blüten mit vielen Blättern. Und wirf mal einen Blick nach links oben: Dort steht die echte mathematische Formel zu jeder Form — und je komplizierter das Orbital, desto länger wird sie. Das ist die Mathematik hinter der Schönheit.',
  s8: '<speak>Und jetzt du: Mit der Maus kannst du ziehen, drehen und zoomen — der Zoom-Faktor läuft live mit. Die Escape-Taste setzt alles zurück. Probier es selbst aus — kostenlos, im Doc Alvers Mathe-Labor auf doc alvers punkt <say-as interpret-as="characters">de</say-as>.</speak>',
};

const durs = await synthScenes(NARRATION, { outDir: OUT });
fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
const d = (k, pad = 2.5) => Math.max(6, durs[k] * 1000 + pad * 1000);

await runScenes([
  { name: 'main', url: 'https://docalvers.de/orbitals.html?lang=de', run: async (p, { mark }) => {
      await p.waitForSelector('#formula-tex .katex', { timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(2500);
      await p.evaluate(() => { const e = document.getElementById('kff-error'); if (e && !e.hidden) throw new Error('KFF error visible'); });
      const trigger = p.locator('#orbital-trigger');
      const opt = (n) => p.locator(`#orbital-dropdown-panel .kff-orbital-option[data-index="${n}"]`);

      mark('s1');                                  // default Y2,-2 auto-rotating
      await p.waitForTimeout(d('s1'));

      mark('s2');                                  // dropdown → sphere Y0,0
      await trigger.click(); await p.waitForTimeout(1200);
      await opt(0).click(); await p.waitForTimeout(d('s2') - 2200);

      mark('s3');                                  // dumbbell Y1,-1
      await trigger.click(); await p.waitForTimeout(1000);
      await opt(1).click(); await p.waitForTimeout(d('s3') - 2000);

      mark('s4');                                  // cloverleaf then ring
      await trigger.click(); await p.waitForTimeout(1000);
      await opt(7).click(); await p.waitForTimeout(d('s4') / 2);
      await trigger.click(); await p.waitForTimeout(1000);
      await opt(4).click(); await p.waitForTimeout(d('s4') / 2 - 2000);

      mark('s5');                                  // probability cloud + slow drag
      await p.locator('.kff-prob-switch-row').click();
      await p.waitForTimeout(2500);
      await p.mouse.move(700, 420); await p.mouse.down();
      for (let i = 0; i < 40; i++) { await p.mouse.move(700 + i * 4, 420 + Math.sin(i / 6) * 30); await p.waitForTimeout(90); }
      await p.mouse.up();
      await p.waitForTimeout(Math.max(2000, d('s5') - 9000));

      mark('s6');                                  // triangles: resolution low → smooth
      await p.locator('.kff-prob-switch-row').click();   // cloud off
      await p.waitForTimeout(1200);
      await p.mouse.click(720, 640);               // blur controls, focus canvas area
      await p.waitForTimeout(500);
      await p.keyboard.press('0');                 // resolution 10
      await p.waitForTimeout(4500);
      await p.keyboard.press('2');                 // resolution 200
      await p.waitForTimeout(Math.max(2500, d('s6') - 6700));

      mark('s7');                                  // high-l flower + growing formula
      await trigger.click(); await p.waitForTimeout(1000);
      await opt(25).click(); await p.waitForTimeout(d('s7') - 2000);

      mark('s8');                                  // zoom + Esc reset
      await p.mouse.move(720, 400);
      for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -140); await p.waitForTimeout(220); }
      await p.waitForTimeout(1800);
      for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, 160); await p.waitForTimeout(200); }
      await p.waitForTimeout(1200);
      await p.keyboard.press('Escape');
      await p.waitForTimeout(Math.max(2500, d('s8') - 9500));
      mark('end');
  } },
], { outDir: OUT, showCursor: true });
console.log('ORB RECORD DONE');
