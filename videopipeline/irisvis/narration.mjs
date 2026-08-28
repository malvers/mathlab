// Conway's Iris — the spoken script. Kept in its own file so the text can be
// re-synthesised (run1) without touching the recording (run2) or the cut (run3).
// The music bed is 360 s, so the finished film has to stay below that: ~330 s of
// speech + ~1.4 s of air per scene + the outro cards.
export const NARRATION = {
  s1: 'Diese Bühne ist leer. Kein Bild, keine Animation — nur ein Hinweis: Drücke T. Also gut: T. ' +
      'Ein Dreieck. Irgendeins. Drei Ecken, drei Seiten. Mehr haben wir nicht. Mehr brauchen wir auch nicht.',

  s2: 'Die Ecken heißen A, B und C. Und die Seiten sind eingefärbt — merk dir das: ' +
      'Rot liegt gegenüber von A, Grün gegenüber von B, Orange gegenüber von C.',

  s3: 'Jetzt die Idee, und sie ist verblüffend einfach. An der Ecke A stoßen zwei Seiten zusammen. ' +
      'Ich verlängere beide über die Ecke hinaus — nicht irgendwie weit, sondern genau so weit, wie die ' +
      'Seite gegenüber lang ist. Gegenüber von A liegt Rot. Also sind beide Verlängerungen rot und genau so lang.',

  s4: 'Dasselbe an B: dort liegt Grün gegenüber, also zwei grüne Stücke. Und an C das Orange. ' +
      'Sechs Verlängerungen, sechs neue Punkte — entstanden an drei verschiedenen Ecken, mit drei ' +
      'verschiedenen Längen. Sie haben nichts miteinander zu tun.',

  s5: 'Taste C. Alle sechs liegen auf einem einzigen Kreis. Nicht ungefähr — exakt. Das ist der Satz von ' +
      'John Conway, und er gilt für jedes Dreieck, das es gibt. Ich ziehe eine Ecke irgendwohin: der Kreis bleibt.',

  s6: 'Und wo liegt der Mittelpunkt? Taste I verrät es: Es ist der Inkreismittelpunkt — der Punkt, der von ' +
      'allen drei Seiten gleich weit weg ist. Der große Kreis außen und der kleine Kreis innen haben ' +
      'denselben Mittelpunkt.',

  s7: 'Warum? Taste G zeichnet die drei Lote: Von I bis zu jeder Seite ist es derselbe Abstand — der ' +
      'Inkreisradius r. Taste L zeigt die drei Sehnen mit ihren Mittelsenkrechten; alle drei treffen sich in I. ' +
      'Gleich lange Sehnen, gleicher Abstand vom Mittelpunkt — mehr braucht der Beweis nicht. Oben die Formel, ' +
      'darunter der gemessene Abstand der sechs Punkte vom Kreis: zehn hoch minus dreizehn. Also exakt.',

  s8: 'Jetzt wird gespielt. Der Regler d verlängert alles noch weiter, an jeder Ecke gleich viel. ' +
      'Die sechs Punkte wandern nach außen, der Kreis wächst mit — aber sie bleiben auf ihm. Immer. ' +
      'Es öffnet und schließt sich wie eine Pupille. Deshalb: Conways Iris.',

  s9: 'Jetzt verbinden wir die sechs Punkte — nicht mit Strichen, sondern mit Kreisbögen. Taste W. ' +
      'Sechs Bögen, jeder um eine Ecke geschlagen, abwechselnd ein großer und ein kleiner. Mit D zeichnet ' +
      'die Kurve sich selbst, wie ein Scheibenwischer, der einmal rundherum wischt.',

  s10: 'Diese Kurve kann etwas, das man kaum glaubt: Sie ist in jeder Richtung gleich breit. Zwei mal s plus d. ' +
       'In den Messwerten steht die gemessene Breite — über alle Richtungen ändert sie sich erst in der vierten ' +
       'Stelle. Der Grund: An jeder Ecke gehören ein großer und ein kleiner Bogen zusammen, und ihre Radien ' +
       'addieren sich immer zur selben Zahl.',

  s11: 'Und jetzt der Trick: Dreieck gleichseitig, dann d ganz nach unten, bis die kleinen Bögen zu Punkten ' +
       'schrumpfen. Übrig bleibt die berühmteste Kurve konstanter Breite überhaupt: das Reuleaux-Dreieck. ' +
       'Die Form, mit der man ein quadratisches Loch bohren kann.',

  s12: 'Eine Kurve, die überall gleich breit ist, passt in ein Quadrat mit genau dieser Seitenlänge — in jeder ' +
       'Drehlage. Ich schalte das Quadrat ein und lasse es rotieren. Achte auf die Ränder: Die Kurve berührt sie, ' +
       'aber sie steht nie über.',

  // The 1800 ms break is a real cue: run1 finds it with silencedetect, run2 presses X exactly
  // there — and the sweep really is over before the sentence ends. Deliberately NOT promising
  // a visible cloud of candidates: the lab draws the last generation, and by then CMA-ES has
  // converged, so the six dots sit on top of each other. What you do see is the winner.
  s13: '<speak>Aber wo genau muss das Quadrat liegen? Wir rechnen es nicht aus — wir lassen es suchen. ' +
       'Taste X startet eine Evolutionsstrategie namens <say-as interpret-as="characters">CMAES</say-as>.' +
       '<break time="1800ms"/> Und weg ist sie. Der ganze Suchlauf über eine Vierteldrehung dauert keine ' +
       'Sekunde. Also noch einmal, in Zeitlupe und ganz nah dran.<break time="500ms"/> Bei jedem Winkel ' +
       'streut der Algorithmus eine Generation von Kandidaten aus — mögliche Mittelpunkte des Quadrats. ' +
       'Wer weniger Kurve überstehen lässt, ist besser, und die nächste Generation wird um die Besten herum ' +
       'gestreut. Der violette Punkt ist der jeweilige Gewinner. Zwei Grad weiter, und die Suche beginnt von ' +
       'vorn — warm gestartet beim letzten Treffer.</speak>',

  s14: 'Die rote Linie ist die Spur, die der Mittelpunkt des Quadrats dabei zieht. Winzig — also zoome ich hinein. ' +
       'Da ist sie: eine kleine geschlossene Schleife. Das Quadrat sitzt nicht fest, es wandert beim Drehen mit. ' +
       'Links läuft mit, wie viele Auswertungen die Suche brauchte — und wie weit sie vom exakten Optimum weg ist: ' +
       'praktisch null.',

  s15: 'Und was sucht der Algorithmus da ab? Die Heatmap malt die Landschaft. Für jeden Punkt die Frage: ' +
       'Wie viel Kurve stünde über, wenn das Quadrat hier läge? Grün heißt, nichts steht über. Gelb, dann rot: ' +
       'immer mehr. Ein Trichter mit genau einem tiefsten Punkt — denn eine Kurve konstanter Breite passt in ihr ' +
       'Quadrat an genau einer Stelle. Und die Landschaft dreht sich mit.',

  s16: 'Die Farben bestimmst du selbst. Befehlstaste plus C öffnet den Farbverlaufs-Editor — ein eigenes Fenster, ' +
       'das du hinschieben kannst, wohin du willst. Trenner ziehen, Doppelklick setzt einen neuen, links und ' +
       'rechts getrennt einfärben. Die Heatmap folgt sofort.',

  s17: 'Zwei Dinge noch. Skala fest sorgt dafür, dass dieselbe Farbe bei jedem Dreieck dasselbe bedeutet — ' +
       'erst dann kann man zwei Bilder vergleichen. Und Befehlstaste plus B macht die Bühne hell, ' +
       'für den Beamer im Klassenzimmer.',

  s18: '<speak>Ein neues Dreieck, zufällig — und alles rechnet neu: Kreis, Kurve, Quadrat, Suche. ' +
       'H zeigt alle Tasten, Null setzt zurück. Conways Iris — probier es selbst aus, kostenlos im ' +
       'Doc Alvers Mathe-Labor auf doc alvers punkt ' +
       '<say-as interpret-as="characters">de</say-as>.</speak>',
};
