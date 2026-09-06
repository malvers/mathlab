// Brahmagupta — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the earlier films: roughly 147 words
// per minute. The plot (HTML/drehbuch/brahmagupta.html) plans 280 s of speech over 15
// scenes, so the text below stays near 690 words.
//
// MEASURED, NOTHING GUESSED (50 000 random configurations, verify-proof.mjs):
//   diagonals perpendicular          worst deviation 8.1e-13 degrees
//   angle chain FAM = MBC = CME = FMA worst deviation 9.9e-13 degrees
//   |AF| = |FD|, relative to |AD|     worst deviation 6.3e-14
//   |AF| = |FD| = |FM|                worst deviation 6.3e-14
//   step 7 relation FDM = FMD         worst deviation 8.7e-13 degrees
//   So "in jeder Lage" is not a figure of speech here - it is the measurement.
//
// THE GUARDRAILS from the plot's section C are binding here:
//   - forbidden: "offensichtlich", "trivial", "man sieht leicht" - those three words
//     are exactly where learners fall out of a proof
//   - the angles at M in s8 are SCHEITELWINKEL, never Wechselwinkel (the classroom
//     handout has it wrong; the film has it right)
//   - numbers only relationally: never "fuenfundfuenfzig Grad", always "dieselbe Zahl".
//     The single exception is the difference |AF| - |FD|, which reads 0.000 on screen
//     and is spoken as "null Komma null null null" in s4
//   - one new term per scene: Sehnenviereck (s2), Peripheriewinkelsatz (s5),
//     Innenwinkelsatz (s6), Scheitelwinkel (s8), gleichschenklig (s10)
//   - one letter, one meaning: M is where the diagonals cross, E the foot on BC,
//     F the point on AD - as in the classroom handout. The SATZ mode calls the
//     crossing P; that name never appears in the film
//   - segments are spoken as "von F nach A", never as "F A" - the Studio voice runs
//     two single letters together into a word
//
// s4 IS THE PIVOT and must not be softened: everything before it is measurement,
// everything after it is proof. It is also the only place where the film says out
// loud that the lab alone proves nothing.
export const NARRATION = {
  // --- aufbauen -----------------------------------------------------------------
  // Kernszene. Dragging C slowly through eight or nine positions; she must not be
  // ahead of the drag, hence the long break before "Bleiben gleich".
  s1: '<speak>Schau auf die beiden unteren Zahlen links. <break time="600ms"/> ' +
      'Ich ziehe an der Ecke C, und alles gerät in Bewegung: Das Viereck kippt, ' +
      'die Diagonalen drehen sich, der Punkt E wandert die Seite entlang. ' +
      '<break time="900ms"/> Und die beiden Zahlen? <break time="700ms"/> ' +
      'Bleiben gleich. <break time="600ms"/> In jeder Lage.</speak>',

  // The figure is built up piece by piece; each break is one element appearing.
  s2: '<speak>Drei Dinge stehen in diesem Bild, und nur drei. <break time="700ms"/> ' +
      'Vier Ecken, die alle auf einem Kreis liegen — so etwas heißt Sehnenviereck. ' +
      '<break time="700ms"/> Die beiden Diagonalen. <break time="600ms"/> ' +
      'Und da, wo sie sich kreuzen, im Punkt M, ein rechter Winkel. ' +
      '<break time="800ms"/> Mehr dürfen wir gleich nicht benutzen.</speak>',

  s3: '<speak>Vom Punkt M aus fällen wir das Lot auf die Seite von B nach C. ' +
      'Es trifft sie im Punkt E und läuft weiter, quer durch die Figur, bis zur ' +
      'Gegenseite — in den Punkt F. <break time="800ms"/> Und die Behauptung lautet: ' +
      'F liegt in der Mitte. <break time="600ms"/> Nicht ungefähr. Genau.</speak>',

  // --- umdrehen -----------------------------------------------------------------
  // Kernszene, der Dreh. Ten fast drags, then the hard stop.
  s4: '<speak>Also probieren wir es aus. Zehn Vierecke, flach, spitz, fast ' +
      'quadratisch — und die Differenz der beiden Hälften bleibt bei null Komma ' +
      'null null null. <break time="900ms"/> Und trotzdem ist das kein Beweis. ' +
      '<break time="800ms"/> Zehn Lagen sind zehn Lagen. Es gibt unendlich viele, ' +
      'und ich habe zehn gesehen. <break time="700ms"/> Ein Beweis muss über alle ' +
      'reden — auch über die, die nie jemand zieht.</speak>',

  // --- die Kette ----------------------------------------------------------------
  s5: '<speak>Fangen wir an. <break time="600ms"/> Diese Sehne hier, von D nach C. ' +
      'Der Winkel bei A schaut auf sie — und der Winkel bei B ebenfalls. ' +
      '<break time="800ms"/> Beide zeigen dieselbe Zahl, und zwar in jeder Lage. ' +
      'Das ist der Peripheriewinkelsatz: Wer von irgendwo auf dem Kreis auf dieselbe ' +
      'Sehne blickt, sieht denselben Winkel. <break time="600ms"/> Diese Gleichheit ' +
      'ist nicht gemessen. Sie ist vom Kreis geerbt.</speak>',

  s6: '<speak>Zweiter Schritt, zwei Dreiecke. <break time="600ms"/> In diesem hier ' +
      'ist der Winkel bei M ein rechter. Für die beiden anderen bleiben zusammen ' +
      'neunzig Grad. <break time="700ms"/> Und in diesem, bei E, steht genau ' +
      'dasselbe: neunzig Grad, aufzuteilen auf zwei Winkel. <break time="600ms"/> ' +
      'Der Innenwinkelsatz, mehr steckt nicht dahinter.</speak>',

  s7: '<speak>Und jetzt schau auf die Ecke C. <break time="700ms"/> Der grüne Winkel ' +
      'dort kommt in beiden Dreiecken vor — es ist derselbe Winkel, E liegt ja auf ' +
      'der Strecke von B nach C. <break time="800ms"/> Zwei Winkel aber, die ' +
      'denselben Rest zu neunzig Grad ergänzen, müssen gleich groß sein.</speak>',

  s8: '<speak>Der vierte Schritt ist der billigste von allen. <break time="600ms"/> ' +
      'Zwei Geraden kreuzen sich in M, und gegenüber liegt derselbe Winkel. ' +
      'Scheitelwinkel. <break time="700ms"/> Dafür brauchen wir weder den Kreis noch ' +
      'den rechten Winkel.</speak>',

  s9: '<speak>Jetzt zählen wir zusammen. <break time="800ms"/> Der Winkel bei A ist ' +
      'so groß wie der bei B. Der bei B so groß wie der eine bei M. Und der so groß ' +
      'wie der andere bei M. <break time="900ms"/> Vier Winkel, vier verschiedene ' +
      'Gründe — und überall dieselbe Zahl.</speak>',

  // Kernszene: hier wird aus Winkeln eine Laenge.
  s10: '<speak>Dieses Dreieck hier, aus A, F und M. <break time="700ms"/> Zwei seiner ' +
       'Winkel sind gleich groß: der bei A und der bei M. Ein Dreieck mit zwei ' +
       'gleichen Winkeln ist gleichschenklig — und dann sind auch zwei seiner Seiten ' +
       'gleich lang: von F nach A und von F nach M. <break time="800ms"/> Aus einer ' +
       'Aussage über Winkel ist gerade eine über Längen geworden. Darum ging es die ' +
       'ganze Zeit.</speak>',

  s11: '<speak>Die andere Hälfte machst Du. <break time="700ms"/> Dasselbe Spiel für ' +
       'das Dreieck aus D, F und M — diesmal über der Sehne von A nach B. ' +
       '<break time="900ms"/> Probier es erst selbst. <break time="800ms"/> Und wenn ' +
       'Du die Lösung sehen willst: Ein Haken genügt.</speak>',

  s12: '<speak>Von F nach M ist so lang wie von F nach A. Von F nach M ist so lang ' +
       'wie von F nach D. <break time="900ms"/> Also sind die beiden Hälften gleich ' +
       'lang. F ist die Mitte. <break time="900ms"/> Und das gilt jetzt nicht für ' +
       'zehn Lagen, sondern für jede — weil keine andere möglich ist.</speak>',

  // --- brechen ------------------------------------------------------------------
  // Kernszene. Der Haken faellt waehrend der ersten Pause.
  s13: '<speak>Und jetzt machen wir es kaputt. <break time="700ms"/> Ich nehme den ' +
       'rechten Winkel weg — die Diagonalen kreuzen sich schief. <break time="900ms"/> ' +
       'Zurück zu Schritt zwei. Das Dreieck bei E hat seinen rechten Winkel behalten, ' +
       'das andere nicht: Seine beiden Winkel ergeben zusammen keine neunzig Grad mehr. ' +
       '<break time="900ms"/> Damit fehlt die Brücke zwischen den beiden Paaren — und ' +
       'F ist nicht mehr die Mitte. Das Glied ist gerissen.</speak>',

  s14: '<speak>Und ohne Kreis? <break time="700ms"/> Der rechte Winkel bleibt, aber ' +
       'D verlässt den Kreis. <break time="700ms"/> Diesmal reißt es ganz vorn: Die ' +
       'beiden Winkel über der Sehne von D nach C zeigen verschiedene Zahlen. Kein ' +
       'Kreis, kein Peripheriewinkelsatz. <break time="800ms"/> Zwei Voraussetzungen, ' +
       'zwei Bruchstellen — und der Satz hält genau so lange, wie beide halten.</speak>',

  s15: '<speak>Beide Haken zurück, und die Kette trägt wieder. <break time="800ms"/> ' +
       'Dieser Satz ist rund vierzehnhundert Jahre alt: Brahmagupta, Indien, siebtes ' +
       'Jahrhundert. <break time="700ms"/> Neu ist nur, dass Du ihn selbst nachlaufen ' +
       'kannst — Schritt für Schritt, im Doc Alvers Mathe-Labor.</speak>'
};
