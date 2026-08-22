// Grundrechenarten combined demo — 4 labs, 4 recordings, 6 narration scenes cut at marks.
export const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/gra';
const BASE = 'https://docalvers.de/';

export const NARRATION = {
  s1: 'Vier Grundrechenarten, vier Labore. Schriftlich rechnen wie auf Papier — aber jeder einzelne Schritt wird sichtbar, mit Erklärung zum Mitlesen.',
  s2: 'Die Addition: Einer plus Einer — wird es zweistellig, wandert die goldene Eins als Übertrag zur nächsten Spalte. Spalte für Spalte, bis das Ergebnis am Ende sogar um eine Stelle wächst.',
  s3: 'Die Subtraktion: Null minus eins geht nicht — also borgen wir uns zehn. Und wieder. Und wieder. Ein Domino aus geborgten Einsen, durch alle Spalten — übrig bleibt: neunundneunzigtausendneunhundertneunundneunzig.',
  s4: 'Die Multiplikation: Jede Ziffer des Multiplikators bekommt ihre eigene Farbe — und ihre eigene Zeile. Drei bunte Teilprodukte, sauber versetzt, und zusammen ergeben sie das Ergebnis.',
  s5: 'Und die Division: Wie oft passt die Sieben? Die goldene Klammer wandert durch den Dividenden, jede Ziffer kommt einzeln herunter — und ganz am Ende bleibt: Rest sechs.',
  s6: '<speak>Vier Labore, ein Prinzip: Du siehst jeden Schritt. Kostenlos auf doc alvers punkt <say-as interpret-as="characters">de</say-as> — probier sie aus.</speak>',
};

const step = (p) => p.evaluate(() => nextStep());

export const SCENES = [
  { name: 'add', url: BASE + 'addition.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);
      mark('intro');                       // untouched board + coach bubble
      await p.waitForTimeout(9500);
      await p.evaluate(() => { document.getElementById('s1-input').value = '987654'; document.getElementById('s2-input').value = '456789'; updateNumbers(); });
      mark('filled');
      await p.waitForTimeout(1800);
      for (let i = 0; i < 14; i++) { await step(p); await p.waitForTimeout(i % 2 === 0 ? 500 : 1050); }
      mark('done');
      await p.waitForTimeout(3500);
  } },
  { name: 'sub', url: BASE + 'subtraktion.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);
      await p.evaluate(() => { document.getElementById('s1-input').value = '100000'; document.getElementById('s2-input').value = '1'; updateNumbers(); });
      mark('filled');
      await p.waitForTimeout(1500);
      for (let i = 0; i < 13; i++) { await step(p); await p.waitForTimeout(950); }
      mark('done');
      await p.waitForTimeout(4000);
  } },
  { name: 'mult', url: BASE + 'multiplikation.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);        // default 456 x 789, fine mode ON
      mark('start');
      for (let i = 0; i < 8; i++) { await step(p); await p.waitForTimeout(900); }
      mark('goldrow');
      await p.evaluate(async () => { while (currentStep < stepSequence.length - 1) { nextStep(); await new Promise((r) => setTimeout(r, 350)); } });
      mark('total');
      await p.waitForTimeout(4000);
  } },
  { name: 'div', url: BASE + 'dividieren.html?lang=de', run: async (p, { mark }) => {
      await p.waitForTimeout(2500);
      await p.evaluate(() => { document.getElementById('div-input').value = '8546'; document.getElementById('dsor-input').value = '7'; updateValues(); });
      mark('filled');
      await p.waitForTimeout(1500);
      for (let i = 0; i < 8; i++) { await step(p); await p.waitForTimeout(1100); }
      mark('done');
      await p.waitForTimeout(2500);
      await p.evaluate(() => toggleSidebar());   // full-width beauty shot for the outro scene
      await p.waitForTimeout(1000);
      mark('wide');
      await p.waitForTimeout(8000);
      mark('end');
  } },
];
