// "1+1=2" lab demo — narration + choreography (pipeline reference: ../worldclock/demo.mjs)
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/e1';
const URL_ = 'https://docalvers.de/einsundeinsgleichzwei.html';

export const NARRATION = {
  s1: 'Was passiert eigentlich in einem Computer, wenn er eins plus eins rechnet? Dieses Labor zeigt es dir — auf vier Ebenen: vom Programm über Assembler und Maschinencode bis zu den Schaltkreisen. Noch ist die Maschine leer.',
  s2: 'Wir setzen a auf eins und b auf eins. Sofort füllt sich die ganze Leiter — und jede Zahl behält ihre Farbe, vom Code bis zum letzten Bit.',
  s3: 'Und jetzt: die ganze Reise. Der Compiler übersetzt in Assembler-Befehle. Der Assembler macht daraus Bytes — und diese Bytes sind schon die Bit-Reihen. Dann rechnen acht Volladdierer, der Übertrag rieselt nach links — und das Ergebnis wandert zurück nach oben: eins null im Binärsystem. Zwei.',
  s4: 'Und was steckt in so einem Volladdierer? Nur fünf Gatter: zweimal exklusiv-oder, zweimal und, einmal oder. Mehr braucht Addieren nicht.',
  s5: 'Geht das auch groß? Zweihundert plus fünfundfünfzig — diesmal Schritt für Schritt. Mit jedem Klick rechnet ein Addierer und reicht seinen Übertrag nach links weiter. Am Ende: zweihundertfünfundfünfzig — alle acht Bits auf eins.',
  s6: 'Und ganz unten, im Physischen? Ein Bit ist nichts als Spannung: an oder aus. Ungefähr ein Volt. Das ist die ganze Magie.',
  s7: '<speak>Von der <say-as interpret-as="characters">KI</say-as>, die den Code schreibt, bis zum Stromschalter: Das ist der ganze Weg von eins plus eins gleich zwei. Probier es aus — im Doc Alvers Mathe-Labor.</speak>',
};

const settle = (p) => p.waitForTimeout(2000);   // masthead fade-in reflows the ladder

export const SCENES = [
  { name: 's1', url: URL_, run: async (p) => {   // pristine ladder
      await settle(p); await p.waitForTimeout(13000);
  } },
  { name: 's2', url: URL_, run: async (p, { mark }) => {   // 1 + 1 + colour hover
      await settle(p); await p.waitForTimeout(1500);
      await p.click('#a-plus'); mark('a'); await p.waitForTimeout(1200);
      await p.click('#b-plus'); mark('b'); await p.waitForTimeout(1800);
      await p.hover('#a-val'); mark('hover'); await p.waitForTimeout(3200);
      await p.hover('#b-val'); await p.waitForTimeout(2500);
      await p.mouse.move(640, 680); await p.waitForTimeout(2500);
  } },
  { name: 's3', url: URL_, run: async (p, { mark }) => {   // the full journey at speed 2
      await settle(p);
      await p.click('#a-plus'); await p.click('#b-plus');
      await p.$eval('#speed', (el) => { el.value = '2'; });
      await p.waitForTimeout(2000);
      await p.click('#btn-play'); mark('play');
      await p.waitForTimeout(22200); mark('done');
      await p.waitForTimeout(3000);
  } },
  { name: 's4', url: URL_, run: async (p, { mark }) => {   // the five gates (help overlay)
      await settle(p);
      await p.click('#a-plus'); await p.click('#b-plus');
      await p.waitForTimeout(1500);
      await p.evaluate(() => { document.getElementById('va-help').style.display = 'flex'; }); mark('open');
      await p.waitForTimeout(9500);
      await p.evaluate(() => { document.getElementById('va-help').style.display = 'none'; });
      await p.waitForTimeout(1500);
  } },
  { name: 's5', url: URL_, run: async (p, { mark }) => {   // 200 + 55 stepped with carry
      await settle(p);
      await p.evaluate(async () => {   // race the counters up — visible fast counting
        for (let i = 0; i < 200; i++) { document.getElementById('a-plus').click(); await new Promise((r) => setTimeout(r, 9)); }
      }); mark('a200');
      await p.evaluate(async () => {
        for (let i = 0; i < 55; i++) { document.getElementById('b-plus').click(); await new Promise((r) => setTimeout(r, 14)); }
      }); mark('b55');
      await p.waitForTimeout(1200);
      for (let i = 0; i < 8; i++) { await p.click('#btn-step'); await p.waitForTimeout(950); }
      mark('stepped');
      await p.waitForTimeout(2500);
  } },
  { name: 's6', url: URL_, run: async (p, { mark }) => {   // a bit is just voltage
      await settle(p);
      await p.click('#a-plus'); await p.click('#b-plus');
      await p.waitForTimeout(1500);
      await p.click('#chk-strom'); mark('strom');
      await p.waitForTimeout(11000);
  } },
  { name: 's7', url: URL_, run: async (p, { mark }) => {   // full ladder incl. AI prologue
      await settle(p);
      await p.click('#a-plus'); await p.click('#b-plus');
      await p.click('#chk-strom');
      await p.waitForTimeout(1200);
      await p.click('#chk-ki'); mark('ki');
      await p.waitForTimeout(11000);
  } },
];

export default { NARRATION, SCENES, OUT, URL_ };
