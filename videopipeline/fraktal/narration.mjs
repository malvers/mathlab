// Fraktal — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the earlier films: roughly 147 words
// per minute, so the plot's 192 s of planned speech carry about 470 words.
//
// Audience: laypeople. Every number said out loud comes from fraktal/measure.mjs,
// which runs the very iteration the lab runs, in exact arithmetic — no textbook, no
// approximation, no library.
//
//   c = -0.2          bounded (100 000 steps checked)     -> s2
//   c =  0.35          8 steps                            -> s3, s4
//   c =  1.0           3 steps                            -> s4
//   c = -0.75 + 0.1i  33 steps                            -> s4, s8
//   eps 1e-2 -> 315 · 1e-3 -> 3143 · 1e-6 -> 3 141 593    -> s8, s9
//   N * eps: 3,3 · 3,15 · 3,143 · 3,1417 · … · 3,141593   -> s9
//
// SCENE 7 IS NOT WHAT THE PLOT SAYS, and it must not be spoken that way. The plot
// promises that the picture survives to 1e-15 and that the lab then switches to
// perturbation arithmetic and reaches 1e-80. Neither exists. Measured in
// fraktal/measure2.mjs and read straight out of mandelbrot.html:
//   - the fragment shader is `precision highp float` — 32 bit, ~7 decimal digits
//   - ZOOM_MAX = 200000, and the readout does stop dead at 200.000
//   - the escape loop is capped at 512 iterations, whatever the detail slider says
// There is no second, higher-precision path anywhere in the lab. So s7 says what is
// true and nothing more: this tool ends, the boundary does not. That is a better
// scene than the one that was planned, and it is the only honest one.
//
// SCENE 3 CANNOT USE c = 0.3 EITHER. The orbit view draws at most ORBIT_LEG_MAX = 10
// legs (mandelbrot.html:1198), and c = 0.3 needs twelve steps to escape - the film
// would be talking about a flight the picture never shows. c = 0.35 escapes after
// eight, which leaves two legs of headroom and still builds up visibly first
// (measure.mjs, "Kandidaten, die im 10-Schenkel-Budget fliehen"). Escaping too early
// is just as bad: c = 1 is out after three steps and there is nothing to watch. s4
// carries the same number, so the ramp the film shows is 3 - 8 - 33.
//
// Two bridges are load-bearing and must survive any recut: s8 ends on "unscheinbar"
// so that s9 can turn it over, and s9 only pays off if s2 has planted how ridiculous
// the rule is — square it, add c, again.
//
// Forbidden here on purpose (plot, section C): Hausdorff dimension, self-similarity in
// the technical sense, conformal maps, renormalisation, Feigenbaum. "Iteration" is a
// Schritt, "Orbit" is a Kette, "divergiert" is läuft davon. Numbers are spoken, not
// read: "gut dreitausend Schritte", never "3143".
export const NARRATION = {
  // --- Akt 1: die Frage ---------------------------------------------------------
  s1: 'Das hat niemand gezeichnet. Es gibt keine Kurve, die diesen Rand beschreibt, ' +
      'und keine Formel für die Form. Jeder einzelne Punkt der Ebene wurde gefragt — ' +
      'und die Antwort war ja oder nein. Was du siehst, ist eine Landkarte aus Antworten.',

  // the rule is read only now, after the chain has been seen running (plot rule 1)
  s2: '<speak>Das ist die Frage. Nimm einen Punkt und nenn ihn c. Fang bei null an: ' +
      'quadrieren, c dazu, von vorn. <break time="900ms"/> Hier liegt c mitten im Körper, ' +
      'bei minus zwei Zehnteln. Die Kette kriecht in einen Punkt hinein und rührt sich ' +
      'nicht mehr. <break time="700ms"/> Sie bleibt — also ist c drin. Im Bild: schwarz.</speak>',

  s3: '<speak>Jetzt derselbe Bildschirm, nur ein anderes c: plus null Komma drei fünf. ' +
      'Dieselbe Regel, dieselben Schritte. <break time="800ms"/> Und schau, was passiert. ' +
      'Die Glieder werden größer. Größer. Nach acht Schritten reißt die Kette den ' +
      'gestrichelten Kreis — Betrag zwei. Ab da gibt es kein Zurück. Das ist keine ' +
      'Faustregel, das ist bewiesen.</speak>',

  // --- die Umkehrung: aus Zählerständen wird das Bild ---------------------------
  s4: 'Drei Punkte, drei Ketten, drei Zähler. Ganz draußen: drei Schritte. Etwas näher: ' +
      'acht. Dicht am Rand: dreiunddreißig. Genau diese Zahl ist die Farbe. Die Bänder ' +
      'sind keine Höhenlinien und keine Deko, sie sind Wartezeiten. Und wo sie eng werden, ' +
      'springt die Zahl. Da ist der Rand.',

  s5: 'Also gehen wir hin. Jede Stufe tiefer bringt nicht Unschärfe, sondern mehr: ' +
      'Spiralen, Seepferdchen, und in jedem Seepferdchen wieder eines. Aber es wird teuer. ' +
      'Je näher am Rand, desto mehr Schritte braucht die Kette, bis überhaupt feststeht, ' +
      'ob sie flieht.',

  s6: 'Und jetzt dreh die Sache um. Halt c fest und lass stattdessen den Startpunkt ' +
      'wandern — dann gehört zu jedem c ein eigenes Bild, eine Julia-Menge. Nimm c aus dem ' +
      'Inneren: das Bild hängt zusammen. Nimm c von draußen: es zerfällt in Staub. Das ' +
      'Apfelmännchen ist gar kein Objekt. Es ist ein Inhaltsverzeichnis.',

  // Rewritten against the code. Everything here is read off mandelbrot.html or measured;
  // the planned 1e-15 and 1e-80 were not.
  s7: 'Nur: irgendwann ist Schluss. Nicht mit dem Rand — mit uns. Dieses Labor rechnet ' +
      'mit zweiunddreißig Bit, also gut sieben Stellen, und beim Zoomfaktor ' +
      'zweihunderttausend steht der Regler am Anschlag. Der Rand geht weiter, unser ' +
      'Zahlensystem nicht. Das ist keine Eigenschaft des Fraktals, das ist eine ' +
      'Eigenschaft des Werkzeugs.',

  // --- Akt 2: die eine Stelle ---------------------------------------------------
  s8: '<speak>Eine letzte Stelle. Die Einschnürung zwischen Körper und Kopf, c gleich ' +
      'minus drei Viertel. Von dort gehen wir senkrecht nach oben, in immer kleineren ' +
      'Abständen, und zählen mit. <break time="800ms"/> Ein Zehntel daneben: ' +
      'dreiunddreißig Schritte. Ein Hundertstel: dreihundertfünfzehn. Ein Tausendstel: ' +
      'gut dreitausend. <break time="600ms"/> Zehnmal näher, zehnmal mehr Schritte. ' +
      'Ordentlich — aber unscheinbar.</speak>',

  s9: '<speak>Bis man beides malnimmt. Schritte mal Abstand. <break time="900ms"/> ' +
      'Dreiunddreißig mal ein Zehntel: drei Komma drei. Dann drei Komma eins fünf. Dann ' +
      'drei Komma eins vier drei. <break time="700ms"/> Und weiter unten, bei einem ' +
      'Millionstel: drei Komma eins vier eins fünf neun drei. <break time="900ms"/> ' +
      'Hier ist kein Kreis. Kein Winkel, kein Umfang. Nur quadrieren und c dazu — und ' +
      'heraus fällt Pi.</speak>',

  s10: 'Ehrlich dazu: das ist eine Messung, kein Beweis. Den Beweis gibt es, er hat mit ' +
       'dem engen Kanal an genau dieser Stelle zu tun, und ich habe ihn hier nicht ' +
       'geführt. Was bleibt, ist eine Regel aus fünf Zeichen — und die Kreiszahl fällt ' +
       'hinten heraus.',
};
