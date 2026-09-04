// Galton — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the earlier films: roughly 147 words
// per minute. The plot (HTML/drehbuch/galton.html) plans 189 s of speech over 10
// scenes, so the text below stays near 460 words.
//
// MEASURED, NOTHING GUESSED (videopipeline/galton/measure.mjs + measure2.mjs):
//   18 rows, 19 bins, 2^18 = 262 144 paths - 48 620 into the middle, exactly 1 to the edge
//   mean 9 bins, width sqrt(18/4) = 2.121 bins
//   largest gap binomial <-> Gaussian: 0.2593 percentage points, at the middle bin
//   throughput at full tilt 60.0 balls/s -> 1000 balls in 17 s; one edge ball would
//     take 262 144 / 60 = 73 min
//   flight time of one ball: tempo 5 -> 2.0 s, 2 -> 4.2 s, 1 -> 7.5 s, 0.5 -> 14.1 s
//   at 1000 balls the peak sits off-centre in 26 % of runs; neighbouring bins differ
//     by 19 % on average - so the bell is jagged and is called jagged
//
// THE GUARDRAILS from the plot's section C are binding here:
//   - no formula before a picture: the binomial coefficients arrive in s4 as COUNTED
//     PATHS, never as "n over k"
//   - one new term per scene: Wegezaehlung (s4), Breite (s7), and the central limit
//     theorem is named exactly once, in s8, as "Summen sehen am Ende alle gleich aus"
//   - forbidden: Momente, charakteristische Funktion, Lindeberg-Bedingung, Stirling
//   - the ball never "decides": no will, no intention, just 50/50 at every peg
//   - the bell is an approximation. s10 says how far off it is instead of "genau"
//   - not "sauber", not "symmetrisch": at 1000 balls it visibly is neither
//
// TWO NUMBERS ARE READ OFF THE SCREEN, so they must stay on it: the counter at 1000
// (s3) and the 73 minutes on the card (s6). Everything else is arithmetic that holds
// no matter which run ends up in the cut.
//
// s7 SHOWS THE TWO BOARDS ONE AFTER THE OTHER, not side by side: changing the row
// slider rebuilds the board and wipes the statistics (rebuildBoard/resetStats), so a
// single take cannot hold both at once. The text therefore names the numbers instead
// of pointing left and right.
export const NARRATION = {
  // --- zuschauen ---------------------------------------------------------------
  // Kernszene. One ball at tempo 0.5: 14.1 s for eighteen pegs, 0.78 s per decision.
  // The breaks sit on the bounces, so she is never ahead of the ball.
  s1: '<speak>Eine einzige Kugel. Achtzehn Reihen Nägel. <break time="700ms"/> ' +
      'An jedem Nagel geht es nach links oder nach rechts. Fifty-fifty. Ohne Vorliebe, ' +
      'ohne Gedächtnis. <break time="900ms"/> Links. Rechts. Rechts. Links. ' +
      '<break time="800ms"/> Achtzehnmal. Und wo sie unten liegen bleibt, ist nichts ' +
      'anderes als die Bilanz aus achtzehn Münzwürfen.</speak>',

  s2: '<speak>Ein Dutzend Kugeln. <break time="800ms"/> Und? Nichts. Hier zwei ' +
      'nebeneinander, da eine Lücke, daneben wieder nichts. <break time="700ms"/> ' +
      'Zwölfmal Zufall sieht aus wie Zufall. Wer hier schon eine Glocke sieht, ' +
      'sieht sie hinein.</speak>',

  // Kernszene. The board fills at 60 balls a second, so a thousand takes 16.7 s and
  // NO intermediate count can ever be spoken in time: "bei hundert" needs two seconds
  // to say, by which time three hundred have fallen. The first draft named hundred and
  // three hundred and was wrong on screen both times. Now the only number spoken is
  // the thousand, and the long break before it is the cue run2 waits on - by then the
  // board is held at 1001 and the figure stands still while she says it.
  // The thousand is ANNOUNCED at the top, where it is an intention and cannot be
  // contradicted by the counter, and the arrival is "und da steht sie" after the long
  // break - by which time the board really is held at 1001 and standing still. Saying
  // "bei tausend" mid-run put the word on a counter reading nine hundred.
  s3: '<speak>Jetzt alle Regler auf Anschlag — tausend Kugeln. ' +
      '<break time="2500ms"/> Erst ist das nur ein Haufen. <break time="3000ms"/> ' +
      'Dann schiebt sich langsam eine Form heraus. <break time="6000ms"/> Und da steht ' +
      'sie: eine Glocke. Zackig, ein bisschen schief — aber unverkennbar. ' +
      '<break time="700ms"/> Niemand hat sie hingelegt. Keine einzige dieser Kugeln ' +
      'wusste von ihr.</speak>',

  // --- erklären ----------------------------------------------------------------
  // Karte. Wegezaehlung. The numbers grow on screen while she counts along.
  s4: '<speak>Warum ausgerechnet diese Form? <break time="800ms"/> Zählen wir nach. ' +
      'An jeden Nagel schreiben wir, auf wie vielen Wegen man ihn überhaupt erreicht. ' +
      '<break time="700ms"/> Oben eine Eins. Dann eins, eins. Dann eins, zwei, eins. ' +
      'Jede Zahl ist die Summe der beiden über ihr. <break time="900ms"/> So wächst es ' +
      'durch das ganze Brett — und unten steht: eins, achtzehn, hundertdreiundfünfzig, ' +
      'und in der Mitte achtundvierzigtausendsechshundertzwanzig.</speak>',

  // Karte. Kernszene: probability as bookkeeping.
  s5: '<speak>Zwei Fächer nebeneinandergelegt. <break time="800ms"/> In die Mitte ' +
      'führen achtundvierzigtausendsechshundertzwanzig Wege. <break time="700ms"/> ' +
      'Ganz nach außen führt genau einer: achtzehnmal dieselbe Richtung. ' +
      '<break time="900ms"/> Das Außenfach ist nicht unwahrscheinlich, weil das ' +
      'Schicksal es nicht mag. Sondern weil dorthin nur ein einziger Weg führt. ' +
      'Wahrscheinlichkeit ist hier reine Buchhaltung.</speak>',

  // Karte. Kernszene. The clock on the card runs to 73 minutes while she speaks.
  s6: '<speak>Was kostet dieser eine Weg? <break time="700ms"/> Insgesamt gibt es ' +
      'zweihundertzweiundsechzigtausend Wege durch das Brett, und genau einer endet ' +
      'ganz außen. <break time="900ms"/> Bei sechzig Kugeln pro Sekunde — dem Anschlag ' +
      'dieses Labors — wären das im Mittel dreiundsiebzig Minuten. Für eine einzige ' +
      'Kugel. <break time="1000ms"/> Deshalb bleiben die Ränder leer. Das ist keine ' +
      'Schlamperei. Das ist das Ergebnis.</speak>',

  // Notbremse. Two boards, one after the other - the row slider wipes the statistics,
  // so they cannot stand side by side. Each board needs 8.3 s for its five hundred
  // balls, and the two long breaks are exactly the cues run2 waits on: the first
  // covers the first board filling, the second covers the switch and the second fill.
  // The first draft had a 1.2 s gap here and she announced the second board while the
  // first was still running.
  s7: '<speak>Vierzehn Reihen, fünfhundert Kugeln. <break time="6500ms"/> Und jetzt ' +
      'achtundzwanzig Reihen — doppelt so viele Nägel. <break time="7000ms"/> Die ' +
      'Glocke wird breiter, klar. Aber nicht doppelt so breit: nur um das ' +
      'Eins-Komma-Vier-Fache. <break time="600ms"/> Die Breite wächst mit der Wurzel. ' +
      'Deshalb wirkt sie auf dem größeren Brett schlanker.</speak>',

  // --- verallgemeinern und brechen ----------------------------------------------
  // Karte. The one place the central limit theorem gets named, and only in words.
  s8: '<speak>Würfelsummen. Körpergrößen. Messfehler. <break time="900ms"/> Drei Dinge, ' +
      'die nichts miteinander zu tun haben — und jedes Mal dieselbe Kurve. ' +
      '<break time="800ms"/> Die Glocke kommt nicht vom Galton-Brett. Sie kommt vom ' +
      'Summieren. Wenn viele kleine Beiträge zusammenkommen, die nichts voneinander ' +
      'wissen, sehen Summen am Ende alle gleich aus.</speak>',

  // Karte. Kernszene: where it breaks. This is the scene that protects against
  // applying the bell where it does not belong.
  s9: '<speak>Und wo gilt das nicht? <break time="800ms"/> Beim Vermögen zum Beispiel. ' +
      'Kein Buckel in der Mitte, sondern ein Schwanz, der nicht abreißen will. ' +
      '<break time="900ms"/> Die Glocke braucht Beiträge, die ungefähr gleich viel ' +
      'wiegen. Wo ein einziger alle anderen erschlagen kann, kommt sie nicht.</speak>',

  // Lab. The curve is blended in with btn-curve. Rule 5: how far off, not "genau".
  s10: '<speak>Zurück auf das Brett. Und jetzt die Kurve dazu. <break time="1200ms"/> ' +
       'Nichts wird angepasst. Mitte neun, Breite gut zwei Fächer — das stand fest, ' +
       'bevor die erste Kugel gefallen ist. <break time="700ms"/> Ganz genau trifft sie ' +
       'nicht; in der Mitte fehlt ein Viertel Prozentpunkt. <break time="900ms"/> ' +
       'Achtzehnmal links oder rechts. Mehr war es nie.</speak>',
};
