// Die ganze Klasse im Blick — the spoken script. Own file so the text can be re-synthesised
// without touching the recording or the cut. First draft, 18.09.2026 (Doc: "was würde Solita
// sagen?") - not yet spoken, not yet released.
//
// PACE (Doc's review of the Würfelspiel film, 17.09.2026): run1 speaks at rate 0.92 and every
// sentence is followed by a 400 ms break. A break of 1200 ms or more is a stage direction -
// run2 performs the action inside it (the click, the tab switch, the submission).
//
// PEOPLE: never "Kind"/"Kinder" - "die Schülerin oder der Schüler", plural "Schülerinnen und
// Schüler", or a construction without the noun (Doc, 18.09.2026).
//
// WORDS: Studio voices refuse <lang> and ignore <phoneme>, so English is avoided or written the
// way German reads it. Avoided on purpose: "Mission Control", "Tab", "Handy"/"Phone", "Beamer".
// To check by ear in the first listen: "online"/"offline", "Live-Auswertung", "WLAN".
//
// THE GUARDRAILS from the plot's section C are binding here:
//   - forbidden: Überwachung, Spionage, "Bildschirm sperren", "anonym" for the slip codes
//     (they are pseudonymous) - the live dashboard itself is really without names or codes
//   - one new term per scene: Zettel-Code (s2, said once, then "der Code"), Lebenszeichen (s4),
//     weg (s5), offline (s7), Abbruch (s8), Live-Auswertung (s11). "weg" is a term from s5 on,
//     so no everyday "weg" anywhere else (s7 "ausfällt", s9 "entfallen")
//   - button names are set off by short breaks, never run into the sentence
//   - numbers only when the picture shows them; nothing promised a browser cannot do (s5)
//
// PROOFREAD by forloop-9c (18.09.2026): s5 "es fällt auf" read as "the device" -> "er fällt auf";
//   s4 order (click first, then name it) and "sieht sie erst nach der Abgabe" (s10 shows answers);
//   s3 full screen only "wo das Gerät es kann" (iPhone cannot); s9 the teacher page polls every
//   5 s -> "wenige Sekunden später"; s12 the server holds answers too -> "nur Codes, keine Namen".
//
// CHECKED AGAINST THE PAGES (18.09.2026):
//   s2  slips show alias + code + QR only when "Zettel ohne Klarname" is switched on -> run2
//       switches it before the camera reaches the cards
//   s4  heartbeat every 15 s plus 1.5 s after each answer (quiz-engine.js guardPing/guardProgress)
//   s7  "offline" after 45 s without a beat, or 90 s when the pupil had left (leistungstest.html)
//   s8  the abort reaches the pupil with the next heartbeat (<= 15 s); the wait is cut
//   s8  Doc's review of the film (18.09.2026, 2:28): how the teacher takes the abort back was unclear
//       -> Solita names the button, and the stage shows it in a label next to the cursor
//   s11 per question the dashboard prints "x richtig · y falsch = p %" and a bar
export const NARRATION = {
  // --- aufbauen -----------------------------------------------------------------------------
  // Title card over a still from scene 4 (the bar shows ".../24").
  s1: '<speak>Vierundzwanzig Schülerinnen und Schüler schreiben einen Test, alle auf dem eigenen Gerät. ' +
      '<break time="400ms"/> Und die Lehrkraft sieht dabei, was zählt: <break time="400ms"/> wer ' +
      'arbeitet, wer gerade nicht im Test ist, und wer schon fertig ist.</speak>',

  // The list, then the switch "Zettel ohne Klarname", the camera travels to the slips.
  s2: '<speak>Alles beginnt mit Zetteln. <break time="400ms"/> Links steht die Liste der Klasse: ' +
      'der echte Name, ein Deckname und ein Zettel-Code aus vier Zeichen. <break time="1300ms"/> Auf den ' +
      'Zettel für die Schülerin oder den Schüler kommen nur der Deckname, der Code und ein ' +
      '<say-as interpret-as="characters">QR</say-as>-Code. <break time="400ms"/> Die Liste mit den ' +
      'echten Namen verlässt den Rechner der Lehrkraft nie.</speak>',

  // Right side comes alive: the start screen with the slip code.
  s3: '<speak>Wer den Zettel scannt, landet direkt im eigenen Test. <break time="400ms"/> ' +
      'Die Fragen sind noch verdeckt. <break time="400ms"/> Erst mit dem Knopf <break time="200ms"/> ' +
      'Test starten <break time="200ms"/> geht es los, und wo das Gerät es kann, im Vollbild.</speak>',

  // Gap 1: "Test starten" + first answers. Gap 2: the background pupils start.
  s4: '<speak>Ein Tipp, und es geht los. <break time="1300ms"/> Links zeigt die Kachel jetzt: ' +
      '<break time="200ms"/> läuft, <break time="200ms"/> und die Zahl daneben zählt jede beantwortete ' +
      'Frage mit. <break time="400ms"/> Dafür schickt der Test regelmäßig ein kurzes Lebenszeichen. ' +
      '<break time="1300ms"/> Auch die anderen legen los, die Leiste oben zählt sie mit. ' +
      '<break time="400ms"/> Die Lehrkraft sieht, wie weit alle sind. <break time="400ms"/> ' +
      'Was geantwortet wird, sieht sie erst nach der Abgabe.</speak>',

  // --- umdrehen -----------------------------------------------------------------------------
  // Gap 1: the pupil switches to another window. Gap 2: the pill pulses on the left.
  s5: '<speak>Und dann schaut jemand kurz weg, in ein anderes Fenster. <break time="1300ms"/> ' +
      'Sofort wird der Test rot: Test unterbrochen. <break time="400ms"/> Links erscheint auf dieser ' +
      'Kachel eine rote Marke: weg. <break time="1300ms"/> Verhindern lässt sich so ein Wechsel nicht, ' +
      'aber er fällt auf. <break time="400ms"/> Ein zweites Gerät unter dem Tisch sieht allerdings ' +
      'niemand. <break time="400ms"/> Und unterbrochen ist nur der Test, nicht das Gerät.</speak>',

  // Gap: "Weiter mit dem Test".
  s6: '<speak>Der Knopf <break time="200ms"/> Weiter <break time="200ms"/> führt zurück in den Test, ' +
      'wie beim sächsischen Kompetenztest. <break time="1300ms"/> Die Unterbrechung bleibt aber ' +
      'stehen: einmal verlassen.</speak>',

  // A background pupil whose page closed in scene 4 turns "offline".
  s7: '<speak>Und wenn eine Seite ganz verschwindet, weil der Akku leer ist oder das WLAN ausfällt? ' +
      '<break time="400ms"/> Dann bleiben die Lebenszeichen aus, und links steht: offline.</speak>',

  // --- brechen ------------------------------------------------------------------------------
  // Gap 1: click on the tile, "Test abbrechen", second click. Gap 2: the pupil sees it.
  // Gap 3: "Abbruch zurücknehmen".
  s8: '<speak>Manchmal muss ein Test abgebrochen werden. <break time="400ms"/> Dafür hat die ' +
      'Lehrkraft einen roten Knopf, mit einer Rückfrage, damit nichts aus Versehen passiert. ' +
      '<break time="1300ms"/> Beim nächsten Lebenszeichen erfährt der Test davon: Test beendet, er wird ' +
      'nicht gewertet. <break time="1300ms"/> War es ein Irrtum, klickt die Lehrkraft auf ' +
      '<break time="200ms"/> Abbruch zurücknehmen. <break time="1300ms"/> Beim nächsten Lebenszeichen ' +
      'ist der Test wieder frei, und die Schülerin oder der Schüler kann weitermachen.</speak>',

  // --- auflösen -----------------------------------------------------------------------------
  // Gap: the remaining answers and "Abgeben".
  s9: '<speak>Jetzt noch die letzten Fragen, dann die Abgabe. <break time="1300ms"/> Das Ergebnis ' +
      'erscheint sofort, und wenige Sekunden später stehen links Punkte und Note. <break time="400ms"/> ' +
      'Einsammeln und Korrigieren entfallen.</speak>',

  // Gap: click on a tile, the question tiles open.
  s10: '<speak>Ein Klick zeigt jede Frage einzeln, <break time="1300ms"/> grün für richtig, rot ' +
       'für falsch. <break time="400ms"/> So sieht man nicht nur die Note, sondern die Stelle, an der ' +
       'es gehakt hat.</speak>',

  // Gap: switch to the live dashboard of the test page.
  s11: '<speak>Für die ganze Klasse gibt es die Live-Auswertung. <break time="1300ms"/> Oben die ' +
       'Punkte aller, ohne Namen und ohne Codes. <break time="400ms"/> Darunter jede Frage mit dem ' +
       'Anteil richtiger Antworten. <break time="400ms"/> Welche Frage die ganze Klasse ins ' +
       'Schleudern gebracht hat, sieht man auf einen Blick, auch groß an der Wand.</speak>',

  // Back to the tiles, fade to the title on dark blue.
  s12: '<speak>Und auf dem Server? <break time="400ms"/> Dort stehen nur Codes, keine Namen. ' +
       '<break time="400ms"/> Wer hinter einem Code steckt, weiß allein der Rechner der Lehrkraft. ' +
       '<break time="1300ms"/> Die ganze Klasse im Blick, im Doc Alvers Mathe-Labor.</speak>'
};
