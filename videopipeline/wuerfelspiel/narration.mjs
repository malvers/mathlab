// Würfelspiel — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut.
//
// DOC'S REVIEW OF THE FIRST CUT (17.09.2026, kritik.json from tools/filmkritik.py):
//   1:09 "Solita spricht zu schnell, das muss langsamer gehen, wir reden über Schülerinnen
//        und Schüler, also langsamer, Pausen machen"
//        -> run1 speaks at rate 0.92 AND every sentence is followed by a 400 ms break.
//   6:03 "man sagt nicht 'einem halb' sondern 'ein halb'"
//        -> every dative was rewritten so the fraction stands as "ein Halb".
//   7:08 "woher wissen die denn, wer den ersten schlägt? das ist noch nicht klar"
//        -> s20 now says how to read the circle: the arrow pointing AT a die comes from
//           the one that beats it.
//   8:25 "viele Sachen müsste sie englisch aussprechen"
//        -> Studio voices REFUSE <lang> (HTTP 400) and ACCEPT <phoneme> but ignore it - Doc
//           still heard a German "Laaab". The only thing that works is spelling the word the
//           way German reads it: "Läbb" (Doc picked it by ear from three samples).
//
// DOC'S REVIEW OF THE LIVE TOUR (19.09.2026, tour-kritik-r1):
//   02 · 0:02 "die Stimme ist wieder langsam, das ist 92 %, man sollte mal 96 % probieren" -> run1 RATE 0.96
//   22 · 0:26 "Haltet das Video jetzt an" -> "Haltet hier an" ("dann passt es für Film und hier", the tour holds there)
//   24        Solita IS Solita (18.09.): "erkläre ich" instead of "erklärt Solita"; "Läbb" was never spoken so far
//
// CUES: a break of 1200 ms or more is a stage direction - run2 finds it with
// silencedetect (d = 1.0) and performs the action inside it. The 400 ms sentence pauses
// stay well below that threshold, even with the slower rate.
//
// CHECKED AGAINST THE LAB'S OWN ARITHMETIC (buildModel, errorCase, drawBar), 17.09.2026:
//   Lena 3,3,5,5,7,7 vs Mia 4,4,4,4,6,6 ...... P(Lena) = 2/9 + 2/9 + 1/9 = 5/9 (55,6 %), Mia 4/9
//   error 1 (Mia 1/2 each) ..................... 1/6 + 1/6 + 1/6 = 1/2
//   error 2 (added along a path) ............... (3|4) = 1/3 + 2/3 = 1, all six paths = 5
//   error 3 (forgot (7|6)) ..................... 2/9 + 2/9 = 4/9
//   error 4 (multiplied) ....................... 2/9 * 2/9 * 1/9 = 4/729 (0,5 %)
//   error 5 (one path) ......................... (5|4) = 2/9 (22,2 %)
//   Mia 4,4,4,6,6,6 ............................ P(Lena) = 1/6 + 1/6 + 1/6 = 1/2
//   two normal dice ............................ 5/12, 5/12, draw 6/36 = 1/6
//   Efron A 4,4,4,4,0,0 B 3 C 2,2,2,2,6,6 D 5,5,5,1,1,1: every arrow 2/3;
//     D vs A: (5|4) = 1/2 * 2/3 = 1/3, wins 1/6 + 1/6 + 1/3 = 2/3
//   Paul 1,1,5,5,6,6 vs Jonas 2,2,2,4,4,4 ...... 4 * 1/6 = 2/3 (66,7 %)
//   simulation: at 200 000 rounds the share scatters by 0,0011 (1 sigma) around 5/9
//
// THE GUARDRAILS from the plot's section C are binding here:
//   - forbidden: Ergebnismenge, Omega, Laplace, bedingte Wahrscheinlichkeit, Erwartungswert,
//     "Glück" as an explanation
//   - one new term per scene: zweistufig (s4), unabhängig (s7), Pfadregel (s8),
//     Summenregel (s10), relative Häufigkeit (s12), nicht transitiv (s20)
//   - nothing random is ever named: no roll result in s1/s2/s4/s24, no pair in s18
//   - fractions are spoken, percentages only where the picture shows them
export const NARRATION = {
  // --- spielen und zählen ------------------------------------------------------------
  // Station 1. Three rolls: at the start, in the first and in the second gap.
  s1: '<speak>Zwei Würfel, zwei Spielerinnen. <break time="400ms"/> Lena würfelt zuerst, dann Mia, und wer ' +
      'die größere Zahl oben hat, gewinnt die Runde. <break time="1300ms"/> Die Würfel sind allerdings ' +
      'selbst beschriftet: <break time="400ms"/> Auf Lenas Würfel stehen nur Drei, Fünf und Sieben, auf ' +
      'Mias Würfel nur Vier und Sechs. <break time="1300ms"/> Wer ist im Vorteil? <break time="500ms"/> ' +
      'Ein paar Runden verraten es nicht. <break time="400ms"/> Mal gewinnt die eine, mal die andere. ' +
      '<break time="600ms"/> Kann man es ausrechnen, bevor überhaupt gewürfelt wird?</speak>',

  // Station 2. One roll in the gap: the top face lights up in the net.
  s2: '<speak>Klappen wir die Würfel einmal auf. <break time="500ms"/> Ein Würfel ist nicht drei Zahlen, ' +
      'er ist sechs Flächen. <break time="500ms"/> Bei Lena steht jede Zahl zweimal. <break time="400ms"/> ' +
      'Bei Mia steht die Vier viermal und die Sechs nur zweimal. <break time="400ms"/> Gleiche Zahlen haben ' +
      'die gleiche Farbe. <break time="1300ms"/> Und bei jedem Wurf leuchtet im Netz die Fläche auf, die ' +
      'gerade oben liegt.</speak>',

  // Station 4 (Würfel lesen). Lena's block is framed first, Mia's from the gap on.
  s3: '<speak>Weil jede Fläche gleich oft nach oben kommt, müssen wir nur zählen. <break time="600ms"/> ' +
      'Lenas Drei steht auf zwei von sechs Flächen: <break time="400ms"/> zwei Sechstel, also ein Drittel. ' +
      '<break time="400ms"/> Für die Fünf und die Sieben genauso. <break time="1300ms"/> Jetzt Mia, und ' +
      'hier steckt die erste Falle. <break time="500ms"/> Mia hat zwar nur zwei verschiedene Zahlen, aber ' +
      'nicht jede kommt in der Hälfte der Würfe. <break time="500ms"/> Die Vier steht auf vier Flächen: ' +
      '<break time="400ms"/> vier Sechstel, also zwei Drittel. <break time="400ms"/> Die Sechs bekommt ein ' +
      'Drittel. <break time="600ms"/> Zur Kontrolle ergibt jeder Würfel zusammen genau eins.</speak>',

  // --- der Baum ------------------------------------------------------------------------
  // Station 3 (Zweistufig). A roll in each gap; the dot walks stage by stage.
  s4: '<speak>Eine Runde besteht aus zwei Würfen nacheinander, erst Lena, dann Mia. <break time="500ms"/> ' +
      'Das heißt zweistufig, und im Baum sind das zwei Ebenen von Ästen. <break time="1300ms"/> Schau dem ' +
      'Punkt zu: Er läuft erst durch Lenas Stufe, dann durch Mias. <break time="1700ms"/> Jeder Weg von ' +
      'links nach rechts ist genau ein möglicher Ausgang einer Runde.</speak>',

  // Station 5. Mia's six branches merge in gap 1; Lena's in gap 2.
  s5: '<speak>Jetzt der wichtigste Trick. <break time="500ms"/> Man könnte für Mias Würfel sechs Äste ' +
      'zeichnen, an jedem ein Sechstel. <break time="400ms"/> Falsch ist das nicht, nur unübersichtlich. ' +
      '<break time="1400ms"/> Gleiche Zahlen kommen auf einen Ast: <break time="400ms"/> Die vier Sechstel ' +
      'der Vier werden zu zwei Dritteln, die zwei Sechstel der Sechs zu einem Drittel. ' +
      '<break time="1400ms"/> Bei Lena werden aus sechs Ästen drei. <break time="500ms"/> Und immer gilt: ' +
      'Die Äste, die an einem Punkt starten, ergeben zusammen eins.</speak>',

  // Station 6. Notbremse.
  s6: '<speak>Damit beginnt der Baum. <break time="500ms"/> Vom Startpunkt gehen drei Äste ab, zur Drei, ' +
      'zur Fünf und zur Sieben, an jedem ein Drittel. <break time="400ms"/> Das sind jeweils rund ' +
      'dreiunddreißig Prozent.</speak>',

  // Station 7.
  s7: '<speak>An jedes dieser drei Enden hängen wir Mias zwei Äste: <break time="400ms"/> zwei Drittel zur ' +
      'Vier, ein Drittel zur Sechs. <break time="400ms"/> Überall dieselben. <break time="600ms"/> Denn Mia ' +
      'würfelt immer mit demselben Würfel, ganz egal, was Lena gerade hat. <break time="500ms"/> Die beiden ' +
      'Würfe sind unabhängig. <break time="600ms"/> Drei mal zwei: Es gibt sechs Wege durch den Baum.</speak>',

  // Station 8. Path (3|4) selected from the start, path (3|6) in the gap.
  s8: '<speak>Wie wahrscheinlich ist ein einzelner Weg? <break time="500ms"/> Nehmen wir Drei, Vier: Lena ' +
      'würfelt die Drei, Mia die Vier. <break time="600ms"/> In einem Drittel aller Runden hat Lena die ' +
      'Drei. <break time="400ms"/> Und davon hat Mia in zwei Dritteln die Vier. <break time="500ms"/> Zwei ' +
      'Drittel von einem Drittel sind zwei Neuntel. <break time="500ms"/> Von heißt hier mal: Entlang eines ' +
      'Weges wird malgenommen. <break time="400ms"/> Das ist die Pfadregel. <break time="1400ms"/> Der Weg ' +
      'Drei, Sechs: ein Drittel mal ein Drittel, ein Neuntel. <break time="600ms"/> Und alle sechs Wege ' +
      'zusammen ergeben wieder eins.</speak>',

  // Station 9. Frame on (5|4) in gap 1, (7|4) two seconds later, (7|6) in gap 2.
  s9: '<speak>Wer gewinnt auf welchem Weg? <break time="400ms"/> Die Tabelle geht alle sechs Ausgänge ' +
      'durch. <break time="1300ms"/> Lena gewinnt mit Fünf gegen Vier und mit Sieben gegen Vier. ' +
      '<break time="1300ms"/> Und mit Sieben gegen Sechs! <break time="500ms"/> Genau diesen dritten Weg ' +
      'übersieht man gern, weil die Sechs so groß aussieht.</speak>',

  // Station 10.
  s10: '<speak>Jetzt kommen die drei grünen Wege zusammen. <break time="500ms"/> Verschiedene Wege zum ' +
       'selben Ziel werden addiert: Das ist die Summenregel. <break time="600ms"/> Zwei Neuntel plus zwei ' +
       'Neuntel plus ein Neuntel: <break time="400ms"/> Lena gewinnt mit fünf Neunteln, rund ' +
       'fünfundfünfzig Komma sechs Prozent. <break time="600ms"/> Die Gegenprobe: Mia bekommt vier Neuntel, ' +
       'und zusammen ist das eins. <break time="500ms"/> Unentschieden gibt es nicht, denn die beiden ' +
       'Würfel haben keine gemeinsame Zahl. <break time="600ms"/> Im Balken sind das fünf von neun gleich ' +
       'großen Teilen. <break time="400ms"/> Knapp, aber auf Dauer.</speak>',

  // Station 12 (Rezept). The five steps light up one by one after the gap.
  s11: '<speak>Alles bisher passt in einen Satz: <break time="400ms"/> Entlang eines Pfades wird ' +
       'multipliziert, verschiedene Pfade zum selben Ereignis werden addiert. <break time="1400ms"/> Und in ' +
       'fünf Schritte: <break time="400ms"/> zählen, teilen, Baum zeichnen, malnehmen, addieren.</speak>',

  // --- nachprüfen ----------------------------------------------------------------------
  // Station 13 (Simulation). EINE RUNDE, HUNDERT, TAUSEND, DAUERLAUF in the four gaps;
  // the run is stopped once 200 000 rounds are through.
  s12: '<speak>Aber stimmt das wirklich? <break time="400ms"/> Lassen wir den Computer würfeln. ' +
       '<break time="1300ms"/> Eine Runde sagt gar nichts. <break time="1300ms"/> Hundert Runden: Die ' +
       'Kurven zittern noch. <break time="1300ms"/> Tausend Runden: schon ruhiger. <break time="1300ms"/> ' +
       'Und jetzt im Dauerlauf. <break time="500ms"/> Lenas Anteil an allen Runden, die relative ' +
       'Häufigkeit, legt sich immer enger an die gestrichelte Linie bei fünf Neunteln. ' +
       '<break time="600ms"/> Nach über zweihunderttausend Runden ist die Abweichung kleiner als ein ' +
       'Hundertstel. <break time="500ms"/> Nie genau, aber immer näher.</speak>',

  // --- falsch rechnen ------------------------------------------------------------------
  // Station 11 (Typische Fehler), error 1.
  s13: '<speak>Zeit für Fehler. <break time="500ms"/> Der häufigste zuerst: Mia hat zwei Zahlen, also ' +
       'bekommt jede die Hälfte. <break time="600ms"/> Dann steht an Mias Ästen überall ein Halb, und für ' +
       'Lena kommt genau ein Halb heraus. <break time="500ms"/> Klingt vernünftig, und genau das macht den ' +
       'Fehler gefährlich. <break time="600ms"/> Die Simulation eben hat aber nicht ein Halb gezeigt, ' +
       'sondern fünf Neuntel. <break time="500ms"/> Flächen zählen, nicht Zahlen.</speak>',

  // error 2 - Kernszene.
  s14: '<speak>Fehler zwei: Entlang eines Weges wird addiert statt malgenommen. <break time="600ms"/> Dann ' +
       'hat der Weg Drei, Vier ein Drittel plus zwei Drittel, also eins. <break time="500ms"/> Und alle ' +
       'Wege zusammen ergeben fünf. <break time="700ms"/> Eine Wahrscheinlichkeit von fünf gibt es nicht. ' +
       '<break time="500ms"/> Mehr als eins geht nie, und die Kontrolle entlarvt den Fehler auf einen ' +
       'Blick.</speak>',

  // error 3.
  s15: '<speak>Fehler drei: ein Weg vergessen. <break time="500ms"/> Rot gestrichelt ist Sieben gegen ' +
       'Sechs, genau der Weg von eben. <break time="600ms"/> Ohne ihn hätte Lena nur vier Neuntel, genau ' +
       'wie Mia. <break time="400ms"/> Und vier Neuntel plus vier Neuntel ist nicht eins.</speak>',

  // errors 4 and 5 - Notbremse. Error 5 is chosen in the gap.
  s16: '<speak>Fehler vier: Die drei Wege werden malgenommen statt addiert. <break time="500ms"/> Heraus ' +
       'kommen vier Siebenhundertneunundzwanzigstel, ein halbes Prozent. <break time="500ms"/> Das ist ' +
       'kleiner als jeder einzelne Weg, obwohl Lena auf jedem davon gewinnt. <break time="1400ms"/> Und ' +
       'Fehler fünf: nur ein einziger Weg, zwei Neuntel. <break time="400ms"/> Das ist bloß ein Teil des ' +
       'Ganzen.</speak>',

  // --- Würfel umbauen ------------------------------------------------------------------
  // Labor. Key m right after the first sentence, Würfelnetze in gap 1, the tap on
  // Mia's 4 and the picker's 6 inside gap 2, Summenregel in gap 3.
  s17: '<speak>Bis hierher waren die Würfel vorgegeben. <break time="500ms"/> Mit der Taste M geht es ins ' +
       'Labor, und dort gehören sie dir. <break time="1400ms"/> Ein Tipp auf ein Feld in Mias Netz, und aus ' +
       'einer Vier wird eine Sechs. <break time="1700ms"/> Mias Würfel hat jetzt dreimal die Vier und ' +
       'dreimal die Sechs, und alle Ansichten rechnen sofort mit. <break time="1400ms"/> Die Summenregel ' +
       'sagt jetzt: Für Lena steht genau ein Halb. <break time="600ms"/> Eine einzige Fläche geändert, und ' +
       'das Spiel ist fair.</speak>',

  // ZUFÄLLIG at the start, TAUSCHEN in the gap. Notbremse. No numbers: the pair is random.
  s18: '<speak>Der Knopf Zufällig baut ein ganz neues Würfelpaar, und alle Brüche springen um. ' +
       '<break time="1400ms"/> Tauschen lässt den anderen Würfel zuerst rollen. <break time="500ms"/> Die ' +
       'Wahrscheinlichkeiten tauschen dabei nur die Plätze.</speak>',

  // Preset "Zwei normale Spielwürfel" at the start, Summenregel stays.
  s19: '<speak>Und zwei ganz normale Spielwürfel? <break time="500ms"/> Anna gegen Ben, beide mit Eins bis ' +
       'Sechs. <break time="600ms"/> Man würde fünfzig zu fünfzig erwarten. <break time="500ms"/> Aber Anna ' +
       'gewinnt nur mit fünf Zwölfteln, und Ben ebenso. <break time="600ms"/> Der Rest ist grau: Weil beide ' +
       'Würfel dieselben Zahlen tragen, endet ein Sechstel aller Runden unentschieden. ' +
       '<break time="600ms"/> Fünf Zwölftel plus fünf Zwölftel plus ein Sechstel, das ist wieder ' +
       'eins.</speak>',

  // --- Intuition brechen ---------------------------------------------------------------
  // Station 14. Arrows light A-B, then B-C and C-D along the sentence, D-A in gap 2.
  // The last part answers Doc's question at 7:08: how does the second player know?
  s20: '<speak>Zum Schluss vier Würfel, die sich der Statistiker Bradley Efron ausgedacht hat. ' +
       '<break time="1300ms"/> Würfel A schlägt Würfel B mit zwei Dritteln. <break time="400ms"/> B ' +
       'schlägt C, und C schlägt D, jedes Mal mit zwei Dritteln. <break time="1300ms"/> Und D? ' +
       '<break time="400ms"/> D schlägt wieder A, auch mit zwei Dritteln. <break time="600ms"/> Einen ' +
       'besten Würfel gibt es hier nicht: Zu jedem gibt es einen, der ihn schlägt. <break time="500ms"/> ' +
       'Solche Würfel heißen nicht transitiv. <break time="600ms"/> Deshalb verliert, wer zuerst wählt. ' +
       '<break time="500ms"/> Und woher weiß der Zweite, welchen er nehmen muss? <break time="500ms"/> Der ' +
       'Kreis sagt es ihm: Auf jeden Würfel zeigt genau ein Pfeil, und der kommt von dem Würfel, der ihn ' +
       'schlägt. <break time="500ms"/> Wählst du C, nehme ich B.</speak>',

  // Labor again: the pair D-A is loaded at the start, Pfadregel in gap 1, Summenregel in gap 2.
  s21: '<speak>Ist das ein Trick? <break time="400ms"/> Rechnen wir D gegen A im Labor nach. ' +
       '<break time="1300ms"/> Würfel D zeigt Eins oder Fünf, jeweils zur Hälfte. <break time="400ms"/> ' +
       'Würfel A zeigt Null oder Vier. <break time="500ms"/> Der Weg Fünf, Vier: ein Halb mal zwei ' +
       'Drittel, ein Drittel. <break time="1400ms"/> Alle Wege, auf denen D gewinnt, addiert: ein Sechstel ' +
       'plus ein Sechstel plus ein Drittel, zwei Drittel. <break time="600ms"/> Dasselbe Rezept wie bei ' +
       'Lena und Mia. <break time="500ms"/> Das Überraschende steckt allein in den Zahlen auf den ' +
       'Flächen.</speak>',

  // --- jetzt ihr -----------------------------------------------------------------------
  // Station 15. After her last word the picture holds five seconds (THINK in run2).
  s22: '<speak>Und jetzt ihr. <break time="500ms"/> Paul hat einen Würfel mit zweimal Eins, zweimal Fünf ' +
       'und zweimal Sechs. <break time="500ms"/> Jonas hat dreimal die Zwei und dreimal die Vier. ' +
       '<break time="700ms"/> Erstens: Zeichnet das Baumdiagramm und schreibt an jeden Ast die ' +
       'Wahrscheinlichkeit. <break time="600ms"/> Zweitens: Wie wahrscheinlich gewinnt Paul? ' +
       '<break time="700ms"/> Das Rezept habt ihr. <break time="500ms"/> Haltet hier an.</speak>',

  // Key l at the start: the solution tree.
  s23: '<speak>Hier ist die Lösung. <break time="500ms"/> Paul hat drei Zahlen, jede mit einem Drittel. ' +
       '<break time="400ms"/> Jonas hat zwei Zahlen, jede bekommt ein Halb. <break time="500ms"/> Jeder Weg ' +
       'ist also ein Sechstel. <break time="700ms"/> Mit der Eins verliert Paul immer. ' +
       '<break time="400ms"/> Mit der Fünf und der Sechs gewinnt er immer, gegen die Zwei und gegen die ' +
       'Vier. <break time="500ms"/> Das sind vier Wege: vier Sechstel, also zwei Drittel, rund ' +
       'sechsundsechzig Komma sieben Prozent. <break time="600ms"/> Wer das hatte: Das Rezept sitzt.</speak>',

  // Back to station 1, one last roll, then the outro cards. "Lab" in English (Doc, 8:25).
  s24: '<speak>Im Läbb erkläre ich alle fünfzehn Stationen des ' +
       'Rundgangs selbst, und im Labor warten die Würfel auf eure eigenen Zahlen. <break time="700ms"/> ' +
       'Probiert es aus, im Doc Alvers Mathe-Labor auf doc alvers punkt ' +
       '<say-as interpret-as="characters">de</say-as>.</speak>',
};
