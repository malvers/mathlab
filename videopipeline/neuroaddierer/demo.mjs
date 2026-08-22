// Neuroaddierer demo — ONE continuous recording (training state lives only in-page), cut at marks.
export const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/na';
export const URL_ = 'https://docalvers.de/neuroaddierer.html';

export const NARRATION = {
  s1: 'Kann ein winziges neuronales Netz addieren lernen? Hier ist seine ganze Welt: acht Zeilen Wahrheitstabelle — ein Bit von a, ein Bit von b, ein Übertrag. Mehr bekommt es nie zu sehen.',
  s2: 'Das Netz selbst: drei Eingänge, fünf versteckte Neuronen, zwei Ausgänge. Fünfundzwanzig Synapsen, sieben Schwellen — zweiunddreißig Zahlen. Das ist alles.',
  s3: 'Am Anfang ist das Netz ein leeres Blatt. Wir lernen per Evolution: Jede Generation würfelt vierzehn Varianten, die beste überlebt. Schritt für Schritt sinkt der Fehler.',
  s4: 'Und dann: geschafft. Das Netz kann addieren — ohne eine einzige Ableitung, nur durch Versuch und Auslese.',
  s5: 'Genau hinsehen lohnt sich: Das Netz sagt nie exakt eins — es sagt null Komma siebenundneunzig. Erst das Runden macht daraus ein Bit. Und acht Kopien in Reihe rechnen damit jede Summe bis zweihundertfünfundfünfzig.',
  s6: 'Zum Vergleich: Backpropagation darf die Richtung ausrechnen, statt zu würfeln — und braucht nur ein Siebtel der Durchläufe. Orange gegen Weiß. Evolution gegen Analysis.',
  s7: 'Ein Netz aus zweiunddreißig Zahlen lernt das Rechnen. Probier es selbst — im Doc Alvers Mathe-Labor.',
};

export const SCENES = [
  { name: 'main', url: URL_, run: async (p, { mark }) => {
      await p.waitForTimeout(2200);
      // A: hover down the truth table (rows light up + net probes live)
      mark('A');
      await p.mouse.move(150, 112);
      for (let y = 112; y <= 218; y += 2) { await p.mouse.move(150, y); await p.waitForTimeout(150); }
      await p.waitForTimeout(1200);
      // B: the net formula overlay
      mark('B');
      await p.evaluate(() => { document.getElementById('net-help').style.display = 'flex'; });
      await p.waitForTimeout(8500);
      await p.evaluate(() => { document.getElementById('net-help').style.display = 'none'; });
      await p.waitForTimeout(800);
      // C: slow evolution, one generation per click
      mark('C');
      await p.$eval('#speed', (el) => { el.value = '1'; });
      for (let i = 0; i < 10; i++) { await p.click('#btn-step'); await p.waitForTimeout(850); }
      await p.waitForTimeout(800);
      // D: run to success
      mark('D');
      await p.click('#btn-learn');
      for (let i = 0; i < 100; i++) {
        await p.waitForTimeout(300);
        const t = await p.$eval('#btn-learn', (el) => el.textContent);
        if (/GESCHAFFT/i.test(t)) break;
      }
      mark('solved');
      await p.waitForTimeout(3000);
      // E: raw sigmoid outputs + the 8-net chain computing 200 + 55
      mark('E');
      await p.mouse.move(150, 212); await p.waitForTimeout(3500);   // row 1 1 1 → 0,97
      await p.mouse.move(640, 690);
      await p.evaluate(async () => {
        for (let i = 0; i < 197; i++) { document.getElementById('a-plus').click(); await new Promise((r) => setTimeout(r, 8)); }
      });
      await p.evaluate(async () => {
        for (let i = 0; i < 49; i++) { document.getElementById('b-plus').click(); await new Promise((r) => setTimeout(r, 12)); }
      });
      mark('chain');
      await p.waitForTimeout(4000);
      // F: backpropagation joins the chart
      mark('F');
      await p.click('#m-bp');
      await p.waitForTimeout(800);
      await p.click('#btn-learn');
      for (let i = 0; i < 60; i++) {
        await p.waitForTimeout(300);
        const t = await p.$eval('#btn-learn', (el) => el.textContent);
        if (/GESCHAFFT/i.test(t)) break;
      }
      mark('bpdone');
      await p.waitForTimeout(3500);
      // G: closing wide shot
      mark('G');
      await p.mouse.move(640, 700);
      await p.waitForTimeout(7000);
      mark('end');
  } },
];
