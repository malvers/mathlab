// Shell — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the earlier films: roughly 147 words
// per minute. Eleven scenes, about 250 s of speech, film around 4:30 with the outro.
//
// MEASURED, NOTHING GUESSED (videopipeline/shell/measure.mjs, 1280x720):
//   chapter 1  ROWS 78,  3 lines/s  -> the page is full after 26 s
//   chapter 2  ROWS 183, 14 lines/s -> the V is complete after 13.1 s
//   chapter 3  the two inner fronts meet at line 81 = 5.8 s after the chapter starts
//              (deterministic - both seeds are placed from ROWS, no randomness)
//   chapter 4  9 lines/s, collision at 9.0 s, full after 20.4 s
//   chapters 5/6 differ in sigma ONLY: s_max = sigma/mu_s = 0.60 vs 0.80 (+33 %);
//              mu_s 0.015, nucleation 0.002 and D_a 0.4 stay - so "sonst nichts
//              geaendert" is literally true
//   VORRAT 0.3  pigment 2-8 % of a line, waves die at once ("Funken")
//   VORRAT 1.1  few broad waves, large tents
//   VORRAT 1.3  (beyond the slider's 1.1) the whole edge fires at once and keeps
//              doing so: lines alternate full/empty -> horizontal bands, no waves
//
// THE GUARDRAILS from the plot's section C are binding here:
//   - no formula before the picture: the two equations come in s6, after V, tent
//     and shadow have been SEEN
//   - one new term per scene: Protokoll (s2), Aktivator (s3), Substrat (s5)
//   - forbidden: Reaktions-Diffusions-System, Turing-Instabilitaet, Autokatalyse,
//     Morphogen, Bifurkation - this film has Vorrat, Welle, Zelt and Protokoll
//   - the cells never "want" anything; they fire, eat and recover
//   - chapter 5 is NOT called "Zickzack-Linien": what the picture shows at 0.6 are
//     scattered short wedges, so that is what she says
//   - the flood at 1.3 lies beyond the lab's slider and she says so
//
// The long SSML breaks are stage directions: run2 measures where she really falls
// silent (silencedetect) and performs the click or the slider move in that gap.
export const NARRATION = {
  // --- zuschauen ---------------------------------------------------------------
  // Hook on the finished tents of chapter 6 (pre-rolled, the ring buffer is full).
  s1: '<speak>Wer malt das Muster auf einer Meeresschnecke? <break time="900ms"/> Niemand. ' +
      'Kein Plan, keine Vorlage, kein Pinsel. <break time="700ms"/> Nur eine einzige Reihe ' +
      'Zellen — und die schreibt Protokoll. Dieses Muster hier hat ein Rechner wachsen lassen, ' +
      'nach zwei Regeln. Sehen wir zu, wie.</speak>',

  // Kernszene. Chapter 1 at 3 lines a second. The two long breaks are the clicks:
  // the cursor lands in the living cell row and a new wedge starts right there.
  s2: '<speak>Oben lebt die Mündungskante: eine einzige Reihe Zellen. Jede entscheidet nur: ' +
      'Pigment, ja oder nein. <break time="700ms"/> Ist die Zeile fertig, wandert sie nach ' +
      'unten und ist für immer Kalk. Quer liegt der Ort, nach unten läuft die Zeit. ' +
      '<break time="800ms"/> Ich zünde eine Zelle von Hand — hier. <break time="1500ms"/> ' +
      'Und hier. <break time="1500ms"/> Jeder Keil beginnt genau dort und genau dann. ' +
      'Kein Bild. Ein Protokoll.</speak>',

  // Kernszene. Chapter 2, one seed, the V.
  s3: '<speak>Ein einziger Zündpunkt. <break time="600ms"/> Der Aktivator verstärkt sich ' +
      'selbst und steckt seine Nachbarn an. Also läuft die Erregung nach links und nach ' +
      'rechts davon. <break time="700ms"/> Im Protokoll wird daraus ein V. Die Schräge ist ' +
      'nichts anderes als das Tempo der Welle: steiler heißt langsamer.</speak>',

  // Kernszene. Chapter 3. The 2.2 s break is the collision: run2 starts the chapter
  // so that line 81 lands exactly at the end of this pause.
  s4: '<speak>Zwei Zündpunkte. Die inneren Schenkel laufen aufeinander zu ' +
      '<break time="2200ms"/> und beim Treffen sind beide weg. Keine Welle geht durch die ' +
      'andere hindurch. <break time="800ms"/> Genau das ist die Spitze eines Zelts. Jede ' +
      'helle Spitze auf einer Schale ist ein Zusammenstoß, der lange zurückliegt.</speak>',

  // Kernszene. Chapter 4 with the substrate shadow.
  s5: '<speak>Warum sterben sie? <break time="700ms"/> Die grüne Kurve ist das Substrat — ' +
      'der Vorrat, den der Aktivator frisst. Hinter jeder Welle bleibt leergefressenes Land, ' +
      'im Protokoll grün. <break time="700ms"/> Deshalb kann eine Welle nie zurück. Und beim ' +
      'Treffen liegt vor jeder nur noch das Land, das die andere gerade leer gefressen hat. ' +
      'Kein Futter, keine Welle. <break time="800ms"/> Der Vorrat erholt sich langsam. Das ' +
      'ist die Uhr der Schale.</speak>',

  // --- erklaeren ---------------------------------------------------------------
  // Karte. The two equations, term by term - after all three pictures.
  s6: '<speak>Das Ganze passt in zwei Zeilen. <break time="900ms"/> Der Aktivator verstärkt ' +
      'sich selbst, solange Vorrat da ist. Er zerfällt von allein. Und ein wenig davon ' +
      'wandert zu den Nachbarn. <break time="900ms"/> Das Substrat kommt stetig nach, wird ' +
      'von der Welle gefressen und zerfällt ebenfalls. <break time="900ms"/> Mehr steht da ' +
      'nicht. Aufgeschrieben hat es Hans Meinhardt in Tübingen, für die Muster der ' +
      'Schneckenschalen.</speak>',

  // Chapter 5 at 24 lines a second, s_max 0.6.
  s7: '<speak>Jetzt zündet ab und zu eine Zelle von selbst — überall dort, wo der Vorrat ' +
      'sich erholt hat. <break time="800ms"/> Aber der Vorrat ist knapp: null Komma sechs. ' +
      'Die meisten Wellen finden kaum Futter und verlöschen nach einem kurzen Stück. Kleine ' +
      'Keile, weit verstreut. Nur hier und da kommt eine Welle weiter.</speak>',

  // Kernszene. The slider goes to 0.8 at the START of the long break; the protocol
  // keeps the old regime above and shows the new one below.
  s8: '<speak>Ein Drittel mehr Vorrat: null Komma acht. <break time="4500ms"/> Da — oben ' +
      'noch die Keile, unten die ersten Zelte. <break time="700ms"/> Sonst habe ich nichts ' +
      'geändert: gleiche Zündrate, gleiche Erholzeit, gleiches Wellentempo. Nur findet jetzt ' +
      'fast jede Zündung Futter, und die Wellen laufen, bis sie aufeinandertreffen. ' +
      '<break time="800ms"/> Zwei Muster. Ein Mechanismus. Eine Zahl.</speak>',

  // --- brechen -----------------------------------------------------------------
  // Kernszene. Slider to 0.3 at the start of the first long break, to 1.1 at the
  // start of the second.
  s9: '<speak>Und jetzt mache ich es kaputt. <break time="600ms"/> Vorrat auf null Komma ' +
      'drei — Hunger. <break time="3000ms"/> Die Zellen zünden noch, aber keine Welle kommt ' +
      'vom Fleck. Nur Funken. <break time="1500ms"/> Vorrat auf eins Komma eins — Überfluss. ' +
      '<break time="4000ms"/> Wenige, breite Wellen. Große Zelte.</speak>',

  // Kernszene. Beyond the slider: 1.3, set at the start of the long break.
  s10: '<speak>Und noch weiter — dort, wo der Regler im Labor längst Schluss hat: eins Komma ' +
       'drei. <break time="3000ms"/> Jetzt läuft keine Welle mehr. Die ganze Kante zündet auf ' +
       'einmal, immer wieder. Querstreifen. <break time="800ms"/> Das Muster braucht den ' +
       'Mangel. Zu wenig Vorrat: nichts. Zu viel: alles. Dazwischen liegt die Schnecke.</speak>',

  // Back to 0.8 at the start of the long break; the film ends on the tents.
  s11: '<speak>Zurück auf null Komma acht. <break time="2500ms"/> Eine Reihe Zellen, zwei ' +
       'Stoffe, ein Protokoll. Keile, Zelte, Streifen sind nicht drei Muster, sondern ein ' +
       'Mechanismus bei drei Nachschubraten. <break time="800ms"/> Was das Modell nicht kann: ' +
       'die großen Flächen mancher Schalen. Dafür fehlt ihm wohl ein dritter Stoff — ein Teil ' +
       'zwei. <break time="700ms"/> Probier es aus, im Doc Alvers Mathe-Labor auf doc alvers ' +
       'punkt <say-as interpret-as="characters">de</say-as>.</speak>',
};
