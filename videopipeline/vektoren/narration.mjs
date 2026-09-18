// Vektoren — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut.
//
// SAME RULES AS THE WÜRFELSPIEL FILM after Doc's review (17.09.2026):
//   - rate 0.92 and a 400 ms break after every sentence: "wir reden über Schülerinnen
//     und Schüler, also langsamer, Pausen machen"
//   - a break of 1200 ms or more is a stage direction; run2 finds it with silencedetect
//     (d = 1.0) and acts inside it
//   - English words are spelled the way German reads them - Studio voices refuse <lang>
//     and ignore <phoneme> ([[reference_solita_english_words]])
//
// CHECKED AGAINST THE LAB (vektoren.html, 17.09.2026) - every number below is what the
// lab itself prints:
//   Kapitel 1  P(3|2), A(-4|-2), B(-1|1), AB = B - A = (3|3)
//   Kapitel 2  a = (4|1), b = (1|3), a + b = (5|4)
//   Kapitel 3  a = (4|3), |a| = sqrt(16+9) = 5, a0 = (0,8|0,6)
//   Kapitel 4  1*(3|1) + 1*(1|2) = (4|3), Determinante 5 -> linear unabhängig,
//              "a parallel b machen" -> Determinante 0, Ziel T(5|4) unerreichbar
//   Kapitel 5  g: x = (1|1|0) + r*(2|1|1), x(1) = (3|2|1)
//   Kapitel 6  E: 2x + 3y + z = 6, n = (2|3|1), Spurpunkte auf den Achsen
//   Kapitel 7  g: x = (0|0|4) + r*(1|0|-1), Ebene z = 0, n o u = -1 -> ein Schnittpunkt
//   Kapitel 8  a = (4|0|0), b = (2|3|1), a o b = 4*2 + 0*3 + 0*1 = 8
//   Kapitel 9  a x b = (0|0|9), Probe beide Skalarprodukte 0, Fläche 9
//   Kapitel 10 X(1|4|3), g durch den Ursprung mit Richtung (1|1|0)
//   Kapitel 11 X(2|1|4) an der Ebene x + y + z = 3, Lotgerade mit r = -4/3
export const NARRATION = {
  // --- Begriff -------------------------------------------------------------------------
  // Kapitel 1. P is dragged in the first gap, the pale copies appear in the second.
  s1: '<speak>Was ist eigentlich ein Vektor? <break time="500ms"/> Hier liegt der Punkt P, und vom Ursprung ' +
      'zeigt ein Pfeil auf ihn. <break time="400ms"/> Man nennt ihn den Ortsvektor von P. ' +
      '<break time="1300ms"/> Ziehen wir P umher, laufen seine beiden Zahlen mit: die Schritte nach rechts ' +
      'und nach oben. <break time="1400ms"/> Und jetzt der wichtigste Satz des Films: Ein Punkt ist eine ' +
      'Stelle. <break time="400ms"/> Ein Vektor ist eine Verschiebung. <break time="500ms"/> Deshalb darf ' +
      'derselbe Pfeil überall im Bild stehen — die blassen hier sind alle derselbe Vektor.</speak>',

  // Kapitel 1. B is dragged in gap 1, then A follows in gap 2.
  s2: '<speak>Zwei Punkte, A und B. <break time="400ms"/> Der Pfeil von A nach B heißt Verbindungsvektor. ' +
      '<break time="1300ms"/> Seine Zahlen bekommt man, indem man die Koordinaten abzieht: B minus A. ' +
      '<break time="500ms"/> Spitze minus Fuß. <break time="1400ms"/> Und weil nur der Unterschied zählt, ' +
      'ändert sich gar nichts, wenn beide Punkte gemeinsam wandern.</speak>',

  // --- Rechnen -------------------------------------------------------------------------
  // Kapitel 2. Subtraction is switched on in the second gap.
  s3: '<speak>Zwei Pfeile kann man addieren. <break time="500ms"/> Dazu hängt man b mit dem Fuß an die ' +
      'Spitze von a — der Pfeil vom Start zum Ende ist die Summe. <break time="1300ms"/> Rechnerisch ist es ' +
      'dasselbe: erste Zahl plus erste Zahl, zweite plus zweite. <break time="500ms"/> Zusammen spannen die ' +
      'beiden ein Parallelogramm auf, und die Summe ist seine Diagonale. <break time="1400ms"/> Und die ' +
      'Differenz? <break time="400ms"/> a minus b ist der Pfeil von der Spitze von b zur Spitze von a. ' +
      '<break time="400ms"/> Wieder Spitze minus Fuß, wie eben.</speak>',

  // Kapitel 2, Vielfaches. Notbremse. Three button presses in the gaps.
  s4: '<speak>Ein Vektor mal einer Zahl: <break time="1300ms"/> Mit zwei wird der Pfeil doppelt so lang. ' +
      '<break time="1300ms"/> Mit null schrumpft er zum Punkt. <break time="1300ms"/> Und mit minus eins ' +
      'zeigt er genau andersherum. <break time="500ms"/> Die Länge ändert sich, die Gerade, auf der er ' +
      'liegt, bleibt.</speak>',

  // Kapitel 3.
  s5: '<speak>Wie lang ist ein Pfeil? <break time="500ms"/> Das gestrichelte Dreieck verrät es: vier nach ' +
      'rechts, drei nach oben. <break time="400ms"/> Nach Pythagoras ist die Länge fünf. ' +
      '<break time="500ms"/> Diese Länge heißt Betrag, und sie ist eine Zahl, kein Pfeil. ' +
      '<break time="1400ms"/> Teilt man den Vektor durch seine Länge, bleibt die reine Richtung übrig: der ' +
      'Einheitsvektor. <break time="500ms"/> Er ist genau eins lang, und deshalb landet seine Spitze immer ' +
      'auf dem Kreis, egal wie weit ich a hinausziehe.</speak>',

  // --- Jeden Punkt erreichen -----------------------------------------------------------
  // Kapitel 4. Sliders in the gaps, then "Ziel treffen".
  s6: '<speak>Jetzt zwei Pfeile gleichzeitig. <break time="500ms"/> Ich gehe r Schritte in Richtung a und ' +
      'dann s Schritte in Richtung b. <break time="1300ms"/> So eine Kombination aus Strecken und Addieren ' +
      'heißt Linearkombination. <break time="1400ms"/> Und jetzt das Erstaunliche: Mit diesen beiden ' +
      'Pfeilen erreiche ich jeden Punkt der Ebene. <break time="500ms"/> Auch das Ziel T — und zwar auf ' +
      'genau eine Art. <break time="500ms"/> Die Zahl daneben, die Determinante, ist fünf und nicht null. ' +
      '<break time="400ms"/> Das heißt: linear unabhängig.</speak>',

  // Kapitel 4, der Bruch.
  s7: '<speak>Und wenn die beiden Pfeile in dieselbe Richtung zeigen? <break time="1400ms"/> Dann ist die ' +
      'Determinante null, und aus der ganzen Ebene wird eine einzige Gerade. <break time="500ms"/> Alles, ' +
      'was ich noch erreichen kann, liegt auf dieser Linie — T liegt nicht mehr darauf. ' +
      '<break time="500ms"/> Zwei parallele Pfeile sagen dasselbe. <break time="400ms"/> Genau das heißt ' +
      'linear abhängig.</speak>',

  // --- In den Raum ---------------------------------------------------------------------
  // Kapitel 5. Camera pan, slider, then the point test in the last gap.
  s8: '<speak>Alles, was wir bisher gemacht haben, gilt genauso im Raum — nur mit drei Zahlen statt zwei. ' +
      '<break time="1400ms"/> Eine Gerade schreibt man dann so: ein Startpunkt, plus r mal eine Richtung. ' +
      '<break time="500ms"/> Das heißt Parameterform. <break time="1400ms"/> Jedes r gibt einen Punkt auf ' +
      'der Geraden; ich schiebe ihn einfach daran entlang. <break time="1400ms"/> Und ob ein Punkt auf der ' +
      'Geraden liegt, prüft man genauso: Gibt es ein r, das in allen drei Zeilen passt? <break time="500ms"/> ' +
      'Beim einen ja, beim anderen nein.</speak>',

  // --- Senkrecht messen ----------------------------------------------------------------
  // Kapitel 8.
  s9: '<speak>Zwei Pfeile kann man auch miteinander multiplizieren — auf zwei ganz verschiedene Arten. ' +
      '<break time="500ms"/> Die erste heißt Skalarprodukt: <break time="400ms"/> Man multipliziert ' +
      'zeilenweise und addiert alles. <break time="400ms"/> Hier kommt acht heraus. <break time="500ms"/> ' +
      'Heraus kommt eine Zahl, kein Pfeil. <break time="1400ms"/> Und diese Zahl misst, wie sehr die beiden ' +
      'in dieselbe Richtung zeigen. <break time="1400ms"/> Stehen sie senkrecht aufeinander, ist sie genau ' +
      'null. <break time="500ms"/> Diesen Test brauchen wir gleich noch zweimal.</speak>',

  // Kapitel 9.
  s10: '<speak>Die zweite Art ist das Kreuzprodukt. <break time="500ms"/> Dabei kommt ein Pfeil heraus, und ' +
       'zwar einer, der auf beiden senkrecht steht. <break time="1400ms"/> Die Probe macht das ' +
       'Skalarprodukt von eben: <break time="400ms"/> beide Male null, also wirklich senkrecht. ' +
       '<break time="1400ms"/> Und die Länge dieses Pfeils ist genau die Fläche des Parallelogramms, das a ' +
       'und b aufspannen. <break time="500ms"/> Hier also neun.</speak>',

  // Kapitel 6.
  s11: '<speak>Eine Ebene kann man auf zwei Arten aufschreiben. <break time="500ms"/> In der ' +
       'Koordinatenform steht sie als Gleichung: zwei x plus drei y plus z gleich sechs. ' +
       '<break time="1400ms"/> Und die drei Zahlen davor sind kein Zufall — sie bilden den Normalenvektor, ' +
       'der senkrecht auf der Ebene steht. <break time="1400ms"/> Ändere ich sie, kippt die ganze Ebene mit. ' +
       '<break time="500ms"/> Daneben steht dieselbe Ebene in Parameterform: ein Punkt und zwei Richtungen.</speak>',

  // Kapitel 7.
  s12: '<speak>Trifft eine Gerade diese Ebene? <break time="1400ms"/> Dafür genügt ein Skalarprodukt: das ' +
       'der Normalen mit der Richtung der Geraden. <break time="500ms"/> Hier ist es nicht null, also gibt ' +
       'es genau einen Schnittpunkt. <break time="1400ms"/> Und wenn es null wird, steht die Richtung ' +
       'senkrecht auf der Normalen. <break time="500ms"/> Dann läuft die Gerade parallel an der Ebene ' +
       'vorbei und trifft sie nie.</speak>',

  // Kapitel 10 und 11.
  s13: '<speak>Bleibt die Frage: Wie weit ist ein Punkt von etwas entfernt? <break time="500ms"/> Abstand ' +
       'heißt immer senkrecht messen. <break time="1400ms"/> Vom Punkt aus fällt ein Lot auf die Gerade; wo ' +
       'es auftrifft, liegt der Lotfußpunkt, und die Strecke dorthin ist der Abstand. ' +
       '<break time="1400ms"/> Bei einer Ebene ist es dasselbe in Grün: Ich schicke vom Punkt aus eine ' +
       'Hilfsgerade in Richtung der Normalen los und schaue, wo sie die Ebene trifft. <break time="500ms"/> ' +
       'Mehr steckt hinter keiner Abstandsformel.</speak>',

  // Abspann.
  s14: '<speak>Elf Kapitel, ein einziges Werkzeug: Pfeile, die man aneinanderhängen, strecken und ' +
       'miteinander multiplizieren kann. <break time="500ms"/> Probier es aus, im Doc Alvers Mathe-Labor ' +
       'auf doc alvers punkt <say-as interpret-as="characters">de</say-as>.</speak>',
};
