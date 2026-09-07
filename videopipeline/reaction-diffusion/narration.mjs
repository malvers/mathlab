// Reaction-Diffusion demo — Solita's script. One file, because re-voicing must never
// force a re-record or a re-cut.
//
// The long <break> tags are STAGE DIRECTIONS, not padding: run2 performs the action
// inside them and finds them again through silencedetect on the finished mp3.
//
// Bound by the Leitplanken in HTML/drehbuch/reaction-diffusion.html, section C:
//   - three technical terms in the whole film: Diffusion (s3), Autokatalyse (s4),
//     Aktivator (s10). Nothing else gets a name.
//   - "Turing-Muster" not before s13.
//   - u and v are called Nahrung and Farbe, never "Substanz A und B".
//   - exactly two numbers are read out, both in s11: 0,110 and 0,115.
//   - the brake is depleted food, NOT a second chemical. Never "der Hemmstoff
//     wandert schneller" - the food wanders faster than what consumes it.
//   - s13 has to say that the lab computes Gray-Scott, not Turing's own model.
//   - s14 says "das Modell sagt voraus", never "es gilt immer".
export const NARRATION = {

  s1: '<speak>Ein dunkles Feld, und in der Mitte ein einziger Tropfen. Mehr ist nicht da. ' +
      '<break time="700ms"/> Und jetzt sieh zu, was er tut. Er wächst. Seine Mitte wird leer, ' +
      'aus dem Tropfen wird ein Ring. <break time="600ms"/> Und der Ring bleibt nicht rund.</speak>',

  s2: '<speak>Aus den Beulen werden Finger, die Finger teilen sich, biegen umeinander herum ' +
      'und weichen einander aus. <break time="2500ms"/> In ein paar Sekunden füllt ein Labyrinth ' +
      'den ganzen Rahmen. <break time="900ms"/> Niemand hat das gezeichnet. Es gibt keine Vorlage ' +
      'und keine Stelle im Programm, an der steht, wie das Ergebnis aussehen soll. ' +
      'Und trotzdem sieht es jedes Mal so aus.</speak>',

  s3: '<speak>Dahinter stecken zwei Stoffe. Nennen wir sie Nahrung und Farbe. ' +
      '<break time="700ms"/> Orange siehst du nur die Farbe. Das Dunkle dazwischen ist aber nicht ' +
      'leer — dort liegt die Nahrung, und die sieht man nie. <break time="600ms"/> Beide tun ' +
      'dasselbe: Sie verlaufen, langsam, in alle Richtungen. Dafür gibt es ein Wort. Diffusion.</speak>',

  s4: '<speak>Und es gibt genau vier Regeln. <break time="900ms"/> Erstens: Farbe frisst Nahrung ' +
      'und macht daraus mehr Farbe. <break time="1100ms"/> Zweitens: Farbe zerfällt von allein. ' +
      '<break time="1100ms"/> Drittens: Nahrung wird ständig nachgefüllt. <break time="1100ms"/> ' +
      'Viertens: Beide verlaufen. <break time="1000ms"/> Die erste Regel ist der Motor. Farbe macht ' +
      'mehr von sich selbst — dafür gibt es auch ein Wort: Autokatalyse. <break time="500ms"/> ' +
      'Vier Sätze. Mehr steht nicht im Programm.</speak>',

  s5: '<speak>Zwei davon kannst du einstellen. <break time="900ms"/> Der Regler für die Zufuhr ' +
      'bestimmt, wie schnell Nahrung nachkommt. <break time="1300ms"/> Der darunter, wie schnell ' +
      'Farbe wieder zerfällt. <break time="900ms"/> Beide Zahlen sind winzig. Und an ihnen hängt ' +
      'gleich alles.</speak>',

  // Chain measured, not chosen by taste: a preset change morphs the existing field,
  // and a low-FEED preset (Tupfen, Nebel, Chaos) kills a saturated one outright. This
  // order never drops below 88 % coverage at 4.2 s per rung.
  s6: '<speak>Sieh dir an, was diese zwei Zahlen anrichten. <break time="1000ms"/> ' +
      'Schlangen. <break time="4200ms"/> Koralle. <break time="4200ms"/> Gitter. ' +
      '<break time="4200ms"/> Pulsierend. <break time="4200ms"/> Flocken. ' +
      '<break time="3500ms"/> Jedes Mal dieselben vier Regeln. Verändert wurden nur die ' +
      'zwei Zahlen von eben. <break time="500ms"/> Ein Fingerbreit auf dem Regler trennt ' +
      'Punkte von Streifen.</speak>',

  s7: '<speak>Nur taugen die meisten Zahlen gar nichts. <break time="800ms"/> Ich ziehe die Zufuhr ' +
      'langsam herunter. <break time="2500ms"/> Das Muster wird blass, die Adern werden dünn, ' +
      'reißen — und das Feld ist leer. <break time="1800ms"/> Und leer bleibt es. Der weitaus ' +
      'größere Teil dieser Skala macht überhaupt nichts. <break time="500ms"/> Muster sind die ' +
      'Ausnahme, nicht die Regel.</speak>',

  s8: '<speak>Kaputtmachen kann man so ein Muster übrigens auch nicht. <break time="700ms"/> ' +
      'Ich male mit der Maus quer hindurch. <break time="2500ms"/> Und lasse los. ' +
      '<break time="1500ms"/> Die Spur wird nicht überdeckt, sie wird eingebaut. Nach ein paar ' +
      'Sekunden liegt dort wieder dasselbe Adernmuster wie überall.</speak>',

  s9: '<speak>Und noch etwas Ehrliches: Dieses Feld hat gar keinen Rand. <break time="800ms"/> ' +
      'Was oben hinausläuft, kommt unten wieder herein. Links ist rechts. ' +
      'Das Muster stößt nirgends an.</speak>',

  s10: '<speak>Bleibt die eigentliche Frage. Warum wird daraus überhaupt ein Muster, und nicht ' +
       'überall dasselbe Einerlei? <break time="900ms"/> Dort, wo Farbe entsteht, entsteht sofort ' +
       'noch mehr davon. Das ist der Aktivator, und er wirkt nur auf ganz kurze Strecke. ' +
       '<break time="800ms"/> Gleichzeitig saugt genau diese Stelle Nahrung aus einem viel ' +
       'größeren Umkreis ab — und nimmt sie damit allen Nachbarn weg. Denn die Nahrung wandert ' +
       'doppelt so schnell wie das, was sie verbraucht. <break time="900ms"/> ' +
       'Nah verstärken, weit bremsen. <break time="600ms"/> Daraus wird ein Abstand. Und ein ' +
       'Abstand, der sich überall wiederholt, ist ein Muster.</speak>',

  // Measured on the grid the lab really uses (264x180): a JUMP from 0.080 to 0.110
  // kills a finished pattern - coverage holds at ~62 % for 1.3 s, then falls to 16 % at
  // 2.0 s and is gone at 2.7 s. A slow ramp does NOT kill it: the pattern adapts and
  // survives past 0.140. The first take got this wrong, so the scene now shows the jump
  // and names the hysteresis instead of hiding it.
  s11: '<speak>Wenn das stimmt, dann muss ich dieses Muster töten können, indem ich den ' +
       'Unterschied wegnehme. Also mache ich die Farbe schneller — und zwar plötzlich, in ' +
       'einem einzigen Schritt. <break time="2200ms"/> Von null Komma null acht auf null ' +
       'Komma eins eins. <break time="2600ms"/> Eine Sekunde passiert nichts. ' +
       '<break time="1600ms"/> Und dann fällt alles in sich zusammen. <break time="1400ms"/> ' +
       'Und eine Merkwürdigkeit dazu, die ich selbst erst nachmessen musste: Schiebt man den ' +
       'Regler langsam höher statt plötzlich, gewöhnt sich das Muster daran und hält noch ' +
       'weit darüber aus. Kaputt geht es nur, wenn man es überrascht.</speak>',

  s12: '<speak>Zurück auf den alten Wert. Und noch einmal säen. <break time="3000ms"/> ' +
       'Vier Sekunden bleibt das Feld fast leer. <break time="2500ms"/> Dann kommt es wieder. ' +
       'Dieselbe Bedingung, dasselbe Muster — nur nicht dieselbe Zeichnung. ' +
       'Die Sorte wiederholt sich, das Bild nie.</speak>',

  s13: '<speak>Der Mann, der das vorhergesagt hat, hat es selbst nie gesehen. ' +
       '<break time="800ms"/> Alan Turing, neunzehnhundertzweiundfünfzig, in einer Arbeit über die ' +
       'chemische Grundlage der Formbildung. Er hat nicht beobachtet, er hat hergeleitet: dass zwei ' +
       'verschieden schnell wandernde Stoffe von allein Struktur machen müssen. ' +
       '<break time="800ms"/> Was hier rechnet, ist nicht sein eigenes Modell, sondern eine ' +
       'Reaktion von Gray und Scott, dreißig Jahre jünger. Bis so etwas wirklich im Reagenzglas ' +
       'gelang, vergingen achtunddreißig Jahre. ' +
       '<break time="600ms"/> Seitdem heißen solche Bilder Turing-Muster.</speak>',

  // s14 CUT on 06.09.2026, and not for length. The scene was to show that the same
  // rules on a narrow strip turn veins into cross bands - the argument behind a spotted
  // animal with a ringed tail. Measured at strip widths 8, 10, 12 and 14 cells: it does
  // not. The dot regime dies on a narrow strip, the vein regime gives a row of joined
  // cells, not clean bands. The claim is not filmable from this lab, so it is not filmed.
  // The film answers its own question in s10 and s11 instead.

  s15: '<speak>Zwei Regler, sechzehn Welten — und dazwischen alles, was noch niemand ausprobiert ' +
       'hat. <break time="700ms"/> Der interessanteste Teil dieses Labors ist der, den es noch ' +
       'nicht gibt. Probier ihn aus, im Doc Alvers Mathe-Labor auf doc alvers punkt ' +
       '<say-as interpret-as="characters">de</say-as>.</speak>',
};
