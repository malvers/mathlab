// Linse — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. ~147 words per minute.
//
// Every number said out loud is measured in linse/measure.mjs and measure2.mjs
// against the running lab, using the lab's own Physics.refractRayClosestSurface.
//
// THE RULE THAT MATTERS MOST HERE: no intention verbs. The optimiser does not
// "want", "try", "learn" or "understand" anything. It rolls dice and keeps what
// measures better. Every sentence has to survive that test.
//
// Also forbidden (they belong to a CMA-ES film, not this one): covariance matrix
// adaptation, eigenvalues, step-size control, rank-mu update, selection pressure.
// "CMA-ES" is said exactly once, in s3, and translated in the same breath.
//
// And: the measured ray error reads 0.00 px, which is BELOW DISPLAY PRECISION,
// not mathematically zero. s5 and s9 say "under a hundredth of a pixel".
//
// MEASURED SPREAD over five runs (measure3.mjs) - this is why the early rounds are
// described in words, not numbers: round 20 lands anywhere between 40 and 62 px,
// round 50 between 4.5 and 10.2, round 100 between 0.13 and 0.63, round 200 at 0.00
// every time. And the breakout in s6 came at 498, 512, 615, 869 - and once not at
// all within 4000 rounds. s6 therefore says "somewhere beyond round five hundred"
// and s7 says out loud that it is not guaranteed.
//
// Two bridges are load-bearing: the last sentence of s6 asks the question s7
// answers, and s10 only pays off if s1 has planted "nobody showed it a lens".
export const NARRATION = {
  // --- Akt 1: das Rohmaterial ---------------------------------------------------
  s1: 'Das ist keine Linse. Das ist ein Klotz Glas, hundertsiebenundsechzig Pixel dick, ' +
      'mit zwei schnurgeraden Kanten. Von links kommen zwölf Lichtstrahlen, rechts steht ' +
      'ein Fadenkreuz — da sollen sie hin. Sie gehen weit daneben: im Schnitt um ' +
      'hundertvier Pixel, bei einer Linsenhöhe von dreihundertzweiundsechzig. ' +
      'Und niemand in diesem Programm weiß, wie eine Linse aussieht.',

  s2: 'Damit sich etwas verbessern lässt, muss man erst sagen können, wie schlecht es ist. ' +
      'Also: zwölf Strahlen, zwölf Abstände zum Brennpunkt. Quadrieren, mitteln, Wurzel ziehen. ' +
      'Fertig ist eine einzige Zahl. Mehr braucht das ganze Verfahren nicht — kein Modell ' +
      'einer Linse, keine Formel für Brechkraft. Nur ein Maßband.',

  s3: '<speak>Und jetzt wird gewürfelt. Aus der aktuellen Form entstehen zwanzig leicht ' +
      'abgewandelte Linsen, jede bekommt ihre Zahl. Die schlechten fliegen raus, aus den ' +
      'guten wird die nächste Form. <break time="400ms"/> Das Verfahren heißt ' +
      '<say-as interpret-as="characters">CMA</say-as>-<say-as interpret-as="characters">ES</say-as>, ' +
      'und das Besondere daran ist: nicht nur die Linsen werden besser, sondern auch die ' +
      'Richtung, in die überhaupt gewürfelt wird. Es will nichts. Es behält, was besser misst.</speak>',

  // --- Akt 2: die Linse entsteht ------------------------------------------------
  s4: 'Drei Runden pro Sekunde, damit man jede einzelne sieht. Die geraden Kanten fangen an ' +
      'sich zu beulen, die Strahlen schwenken zum Fadenkreuz. Nach zwanzig Runden ist der ' +
      'Fehler weniger als halb so groß. Geplant ist daran nichts. Das ist ' +
      'zwanzigmal würfeln, messen, das Beste behalten — und das zwanzigmal hintereinander.',

  s5: 'Jetzt zehn Runden pro Sekunde. Nach fünfzig Runden sind es noch wenige Pixel, nach ' +
      'hundert unter einem — die zwölf Strahlen laufen sichtbar durch einen Punkt. ' +
      'Hundert Runden, zweitausend geprüfte Linsen. Herausgekommen ist eine Form, die ' +
      'Menschen erst im dreizehnten Jahrhundert gefunden haben. Und nirgends im Programm ' +
      'steht das Wort Linse.',

  // bridge -> s7: the closing question is the only reason the next scene exists
  s6: 'Aber es hört nicht auf. Vierzig Runden pro Sekunde, die Linse steht scheinbar still — ' +
      'und dann, irgendwann jenseits von Runde fünfhundert, verformt sie sich mit einem Ruck. Sie wird dünn und ' +
      'stark gewölbt: von hundertneunundsiebzig auf achtundsechzig Pixel Dicke. ' +
      'Die Bewertung fällt von zwölf Komma vier auf vier Komma vier. ' +
      'Die Strahlen trafen doch längst perfekt. Warum wirft sie eine fertige Linse weg?',

  s7: 'Weil die Bewertung zwei Dinge zählt. Das eine ist, wie weit die Strahlen danebengehen. ' +
      'Das andere ist, wie weit das Licht durch das Glas läuft. Solange die Bündelung schlecht ' +
      'ist, fällt der zweite Posten gar nicht auf. Ist sie perfekt, bleibt nur noch er übrig — ' +
      'und ab da wird Glas weggespart. Erst scharf, dann sparsam — man bekommt eben genau das, ' +
      'was man misst. Und weil hier gewürfelt wird, steht auch nicht fest, wann dieser Sprung ' +
      'kommt: in fünf Läufen einmal bei fünfhundert, einmal bei achthundertsiebzig — und einmal gar nicht.',

  // --- Akt 3: spielen -----------------------------------------------------------
  s8: 'Dreimal von vorn, nur die Brechzahl ist anders. Bei eins Komma zwei bleibt die Linse ' +
      'hundertvierzehn Pixel dick, bei eins Komma sechs achtundsechzig, bei zwei nur noch ' +
      'neunundfünfzig. Je stärker das Glas bricht, desto weniger davon braucht man. ' +
      'Das weiß jeder Optiker — hier hat es nur niemand gesagt.',

  s9: 'Und jetzt das Beste. Der Brennpunkt fängt an zu wandern, über die ganze Höhe der Linse. ' +
      'Ein normales Rechenverfahren wäre hier fertig und ratlos: das Ergebnis stimmt nicht mehr. ' +
      'Dieses hier läuft einfach weiter. Es würfelt weiter, es misst weiter — und die Linse ' +
      'verformt sich mit. Nach zwei Sekunden Einschwingen bleibt sie unter sechs Pixeln hinter ' +
      'einem Ziel, das über dreihundertzweiundsechzig Pixel schwingt.',

  s10: 'Halten wir fest, was in diesem Programm nicht steht: keine Brennweitenformel, ' +
       'kein Linsenschliff, keine Optik-Tabelle. Es darf eine Form verändern, und es kann ' +
       'messen, wie weit es daneben liegt. Das reicht. ' +
       'Und deshalb ist das hier eigentlich kein Film über Linsen — Linsen lagen nur zufällig ' +
       'im Weg. Alles, wofür man hinschreiben kann, was gut heißt, lässt sich so finden.',
};
