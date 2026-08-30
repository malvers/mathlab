// Fourier — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the BB84/Iris measurements:
// roughly 147 words per minute, so ~500 words carry the planned 204 s of speech.
//
// Audience: laypeople. Every number said out loud is measured in fourier/measure.mjs
// against the lab's own sampler and DFT — nothing here comes from a textbook.
//
// THE ONE TRAP, and it caught me first: "energy" is the share of the SQUARED radii.
// Its square root (the amplitude norm) looks friendlier and is a different number —
// the heart at two circles is 0.8 % energy but 9 % amplitude. This script speaks
// energy throughout; if a figure ever gets edited, re-check which of the two it is.
//
// Forbidden here on purpose (they belong to the sound film, not this one):
// Gibbs / overshoot / ringing — these curves have no jump, the radii fall like 1/k²,
// so the corner goes ROUND, not wavy. Also out: Hilbert space, orthogonality,
// basis functions, convolution. "Epicycle" is never said; they are "Kreise".
//
// Two bridges are load-bearing and must survive any recut: the last sentence of s4
// hands over to "who computed the radii?" in s5, and s11 only pays off if s6 (square
// at two circles) and s10 (heart at two circles) have both been seen.
export const NARRATION = {
  // --- Akt 1: aufbauen ---------------------------------------------------------
  s1: 'Diese Note wurde nicht gezeichnet. Sie wurde gedreht. Das hier sind die Kreise, ' +
      'die sie gemacht haben — tausend Stück, einer am anderen, und ganz vorne ein Stift. ' +
      'Und die Frage des ganzen Films lautet: Wie viele davon braucht man wirklich?',

  s2: 'Fangen wir ganz unten an, bei zwei Kreisen. Der erste dreht sich gar nicht. ' +
      'Er verschiebt nur — er ist der Schwerpunkt der Zeichnung. Der zweite dreht sich ' +
      'einmal pro Runde. Zusammen können die beiden genau eines: einen Kreis.',

  s3: 'Jetzt der dritte. Achte darauf, wohin er sich dreht: rückwärts. Und sofort wird aus ' +
      'dem Kreis eine schräge Ellipse. Ein Kreis vorwärts, einer rückwärts — darin steckt ' +
      'schon jede Streckung und jede Schräglage. Deshalb zählt das Labor nicht eins, zwei, ' +
      'drei, sondern null, plus eins, minus eins.',

  // bridge -> s5: the closing question is the only reason the next scene exists
  s4: 'Und jetzt alle auf einmal. Das Labor zählt hoch, von zwei Kreisen bis tausend, und ' +
      'lässt jede fertige Runde stehen. Sieh genau hin: Es wächst nichts an. Es wird ' +
      'schärfer. Jeder neue Kreis ist kleiner und dreht schneller — er bringt nicht die ' +
      'Form, er bringt das Detail. Bleibt eine Frage: Woher weiß das Labor, wie groß ' +
      'jeder einzelne Kreis sein muss?',

  // --- Die Umkehrung -----------------------------------------------------------
  s5: 'Es rät nicht. Es rechnet. Man legt tausend Punkte auf die Kurve und summiert ' +
      'einmal über alle. Heraus fallen für jede Drehzahl zwei Zahlen: wie groß der Kreis ' +
      'ist, und wo er startet. Das ist die Fourier-Transformation. Kein Probieren, ' +
      'ein Ablesen — und sie ist in einem Durchgang fertig.',

  // --- Akt 2: das Quadrat macht es kaputt --------------------------------------
  s6: 'Jetzt ein Quadrat. Wieder zwei Kreise — und jetzt schau auf den Stift. ' +
      'Er bewegt sich nicht. Beide Radien sind exakt null. Mehr Kreise heißt also ' +
      'nicht automatisch mehr Bild.',

  s7: 'Ein Kreis mehr. Und jetzt der Moment, um den es in diesem Film geht: ' +
      'Fast neunundneunzig Prozent der Energie stecken schon in diesen drei Kreisen. ' +
      'Und auf dem Schirm steht — ein Kreis. An den Flanken zu weit draußen, in den Ecken ' +
      'vierundsiebzig Pixel zu kurz. Prozente zählen die Fläche. Die Ecke zählen sie nicht.',

  s8: 'Vier Kreise. Fünf. Es passiert nichts. Erst der sechste beult die Flanken ein. ' +
      'Der Grund: Das Quadrat ist viermal dasselbe, und diese Symmetrie schlägt Löcher ' +
      'ins Spektrum. Es benutzt nur jeden vierten Kreis. Alle anderen haben Radius null.',

  s9: 'Und die Ecke? Die wird nie eine. Die Figur ist fünfhundertfünfzig Pixel groß. ' +
      'Bei drei Kreisen fehlen in der Ecke vierundsiebzig davon, bei zwölf sechsundzwanzig, ' +
      'bei hundert drei, bei vierhundert nicht einmal einer. Das fällt wie eins durch N: ' +
      'halb so rund kostet doppelt so viele Kreise. Kreise sind glatt — und eine endliche ' +
      'Summe glatter Dinge bleibt glatt.',

  // --- Das Herz: dieselbe Falle, ein anderer Grund -----------------------------
  s10: 'Ein Herz. Zwei Kreise — und wieder fast nichts: nicht einmal ein Prozent. ' +
       'Ein Klick, und es springt auf neunundneunzig. Ein einziger Kreis trägt ' +
       'achtundneunzig Prozent, und zwar der rückwärts laufende: Das Herz wird ' +
       'rechtsherum gezeichnet. Die Reihenfolge im Labor ist nicht die Rangfolge. ' +
       'Und wieder gilt — neunundneunzig Prozent, und es ist eine Ellipse. ' +
       'Die Kerbe kommt erst mit dem neunten Kreis.',

  s11: 'Halten wir die Zahl bei zwei fest und wechseln nur die Form. Note: ' +
       'zweiundsechzig Prozent. Quadrat: null. Herz: nicht einmal ein Prozent. ' +
       'Dieselben zwei Kreise, drei völlig verschiedene Antworten. Wie viel ein Kreis ' +
       'leistet, entscheidet nicht seine Nummer, sondern die Form.',

  // --- eingelöst ---------------------------------------------------------------
  s12: 'Und wozu das Ganze? Die Note besteht aus tausend Punkten — das sind zweitausend ' +
       'Zahlen. Zwanzig Kreise sind vierzig Zahlen, und der Unterschied im Bild sind im ' +
       'Mittel fünf Pixel. Fünfzig zu eins. Genau das macht JPEG, genau das macht MP3: ' +
       'in Kreise zerlegen und die kleinen wegwerfen. Dieselbe Rechnung zerlegt übrigens ' +
       'auch einen Ton. Aber das ist der nächste Film.',
};
