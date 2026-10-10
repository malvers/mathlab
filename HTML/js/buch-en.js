/* buch-en.js — English for the widgets of the textbooks, in the English editions (HTML/buch/<book>-en/, <html lang="en">).
 * Doc, 10.10.2026: "übersetz unser 1. Buch ins EN".
 *
 * The widget modules (js/buch-funktionen.js, buch-stochastik.js, …) and the add-ons in the header (Solita, "Fehler melden")
 * write German. They stay as they are - one source for every book - and this file translates what they write at the moment
 * they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label, placeholder and the text drawn on a canvas.
 * js/buch.js itself has its English words inline (Buch.t), numbers get a decimal point there (Buch.fmt).
 *
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its English
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation (points P(1 | 2) → P(1, 2), intervals [a; b] → [a, b])
 * When a German sentence in a widget changes, its English here falls back to German until the phrase is updated:
 * with ?debug, every string that still looks German is listed in the debug window ("[en] still German: …").
 * Only pages with <html lang="en"> load this file, before js/buch.js. German books never see it.
 */
(function () {
    'use strict';
    if (!/^en/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels ----------
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Graph of a function', 'Funktion': 'Function', 'Beispiel': 'Example', 'Summe': 'Total',
        'Zurücksetzen': 'Reset', 'Zurück': 'Undo', 'Tipp': 'Hint', 'Prüfen': 'Check', 'Umformung': 'Transformation',
        'linear': 'linear', 'exponentiell': 'exponential', 'quadratisch': 'quadratic', 'Modell': 'Model',
        // titelbild
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade': 'Cover picture: parabola, sine curve, exponential function and straight line',
        // detektiv
        'Graph der gewählten Funktion': 'Graph of the chosen function', 'Alle aufdecken': 'Uncover all', 'aufdecken': 'uncover',
        'Definitionsbereich': 'Domain', 'Wertebereich': 'Range', 'Nullstellen': 'Zeros', 'Monotonie': 'Monotonicity',
        'Symmetrie': 'Symmetry', 'Periodisch?': 'Periodic?', 'Asymptoten': 'Asymptotes', 'nein': 'no', 'keine': 'none',
        // wachstum
        'Sparen': 'Saving', 'Kernzerfall': 'Nuclear decay', 'Eigene Werte': 'Own values',
        'Lineares und exponentielles Wachstum': 'Linear and exponential growth', 'Startwert $a$': 'Starting value $a$',
        'linear: Änderung $m$ pro Schritt': 'linear: change $m$ per step', 'exponentiell: Faktor $q$': 'exponential: factor $q$',
        'Zeitraum': 'Period of time',
        // gerade, parabel, wurf
        'Gerade durch zwei verschiebbare Punkte': 'Line through two draggable points',
        'Streckfaktor $a$': 'Stretch factor $a$', 'Verschiebung nach rechts $d$': 'Shift to the right $d$', 'Verschiebung nach oben $e$': 'Shift upwards $e$',
        'Parabel mit verschiebbarem Scheitelpunkt': 'Parabola with a draggable vertex',
        'Abwurfhöhe $h_0$': 'Release height $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Release speed $v_0$', 'Höhe beim senkrechten Wurf': 'Height in a vertical throw',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Play', 'Anhalten': 'Pause', 'Winkel $\\alpha$': 'Angle $\\alpha$', 'Einheitskreis und Sinuskurve': 'Unit circle and sine curve',
        'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Factor $b$ (period $\\tfrac{2\\pi}{b}$)', 'Verschiebung $c$ nach rechts': 'Shift $c$ to the right',
        'Verschiebung $d$ nach oben': 'Shift $d$ upwards', 'Sinusfunktion mit Parametern': 'Sine function with parameters',
        'Tag des Jahres': 'Day of the year', 't in Tagen': 't in days', 'Stunden': 'hours', 'Tageslänge in Dresden': 'Length of the day in Dresden',
        // regression, anscombe
        'Kerze': 'Candle', 'Bremsweg': 'Braking distance', 'Abkühlen': 'Cooling', 'Weltbevölkerung': 'World population',
        'Brenndauer in h': 'Burning time in h', 'Länge in cm': 'Length in cm', 'Tempo in km/h': 'Speed in km/h', 'Bremsweg in m': 'Braking distance in m',
        'Zeit in min': 'Time in min', 'Jahr': 'Year', 'Mrd. Menschen': 'Billion people', 'Messreihe': 'Series of measurements',
        'Messpunkte und Regressionskurve': 'Measured points and regression curve', 'Messpunkte lassen sich verschieben': 'The measured points can be dragged',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'For an exponential model the values must be positive.',
        'Datensatz': 'Data set', 'Anscombe-Quartett': "Anscombe's quartet",
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Function and inverse function, reflected in y = x',
        'Basis $a$': 'Base $a$', 'rechte Seite $b$': 'right-hand side $b$', 'Lösen': 'Solve',
        'Die Basis muss positiv und von 1 verschieden sein.': 'The base must be positive and different from 1.',
        'Grundfunktion': 'Basic function', 'Grundfunktion und veränderte Funktion': 'Basic function and transformed function',
        'Das ist die Grundfunktion selbst.': 'That is the basic function itself.',
        'Graph, zu dem der Term gesucht ist': 'Graph whose term is wanted', 'Nächster Graph': 'Next graph',
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'e.g. −3 or :4 or −2x', 'Anwenden': 'Apply', 'Neue Gleichung': 'New equation',
        'Länge $a$': 'Length $a$', 'Länge $b$': 'Length $b$', 'Quadrat mit Seitenlänge a + b': 'Square with side length a + b',
        'Zylinder': 'Cylinder', 'Kegel': 'Cone', 'Kugel': 'Sphere', 'Körper': 'Solid', 'Höhe $h$ in cm': 'Height $h$ in cm', 'Skizze des Körpers': 'Sketch of the solid',
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Apply', 'Nächster Schritt': 'Next step', 'Neues LGS': 'New system',
        'Zeile + k · Zeile': 'row + k · row', 'Zeile · k': 'row · k', 'tauschen': 'swap', 'Zielzeile': 'Target row', 'zweite Zeile': 'Second row', 'Faktor k': 'Factor k',
        'Ziel I': 'target I', 'Ziel II': 'target II', 'Ziel III': 'target III', 'mit I': 'with I', 'mit II': 'with II', 'mit III': 'with III',
        'eine Lösung': 'one solution', 'keine Lösung': 'no solution', 'unendlich viele': 'infinitely many', 'Zwei Geraden': 'Two lines',
        'mit $r =$': 'with $r =$', 'Neue Matrizen': 'New matrices', 'Wähle eine Rechnung.': 'Choose a calculation.',
        '1 Schritt': '1 step', '10 Schritte': '10 steps', 'Vier Webseiten und ihre Links': 'Four web pages and their links',
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Bisection method', 'Intervall halbieren': 'Halve the interval', '5 Schritte': '5 steps',
        'Schritt': 'Step', 'Mitte $m$': 'Midpoint $m$', 'Breite': 'Width',
        'x² auf [0; 2]': 'x² on [0, 2]', '√x auf [0; 4]': '√x on [0, 4]', 'sin x auf [0; π]': 'sin x on [0, π]',
        'Rechtecke links': 'Left rectangles', 'Rechtecke Mitte': 'Midpoint rectangles', 'Trapeze': 'Trapeziums', 'Verfahren': 'Method',
        'Anzahl der Streifen $n$': 'Number of strips $n$', 'Flächeninhalt mit Streifen angenähert': 'Area approximated with strips',
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Random points in the rectangle, hits below the parabola',
        // stochastics: trees, rapid test, four-field trainer, simulator, goats
        'Baumdiagramm': 'Tree diagram', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Tree diagram: two balls without replacement',
        'Rot': 'Red', 'Blau': 'Blue', 'eine rote Kugel weniger': 'one red ball fewer', 'eine rote Kugel mehr': 'one more red ball',
        'eine blaue Kugel weniger': 'one blue ball fewer', 'eine blaue Kugel mehr': 'one more blue ball',
        'Anzahl der Züge': 'Number of draws', '2 Züge': '2 draws', '3 Züge': '3 draws', 'Ziehen': 'Drawing',
        'ohne Zurücklegen': 'without replacement', 'mit Zurücklegen': 'with replacement', 'Urne:': 'Urn:',
        'Ereignis wählen:': 'Choose an event:', 'Ereignis': 'Event', 'Baumdiagramm der Urne': 'Tree diagram of the urn', 'unmöglich': 'impossible',
        'beide Rot': 'both red', 'alle Rot': 'all red', 'genau einmal Rot': 'red exactly once', 'mindestens einmal Rot': 'red at least once',
        'keinmal Rot': 'never red', 'beide gleich': 'both the same', 'alle gleich': 'all the same', 'leeren': 'clear',
        'Anteil der Erkrankten': 'Proportion of people who are ill', 'Test erkennt Kranke (Sensitivität)': 'Test identifies the ill (sensitivity)',
        'Test erkennt Gesunde (Spezifität)': 'Test identifies the healthy (specificity)', 'Darstellung': 'Display',
        'Anzahlen (von 10 000)': 'Counts (out of 10,000)', 'Wahrscheinlichkeiten': 'Probabilities', 'Anzahlen': 'Counts',
        'positiv $T^+$': 'positive $T^+$', 'negativ $T^-$': 'negative $T^-$', 'krank $K$': 'ill $D$', 'gesund $\\overline{K}$': 'healthy $\\overline{D}$',
        'krank': 'ill', 'gesund': 'healthy', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Tree diagram: ill or healthy, then test result',
        'Neue Tafel': 'New table', 'A und B': 'A and B', 'A und nicht B': 'A and not B', 'nicht A und B': 'not A and B', 'nicht A und nicht B': 'not A and not B',
        'A gesamt': 'A total', 'nicht A gesamt': 'not A total', 'B gesamt': 'B total', 'nicht B gesamt': 'not B total', 'gesamt': 'total',
        'Münze': 'Coin', 'Würfel': 'Dice', 'Zwei Würfel': 'Two dice', 'Urne': 'Urn', 'Wappen': 'heads', 'Sechs': 'six', 'Augensumme 7': 'total score 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'both red (3 red, 2 blue, without replacement)',
        'mindestens eine Sechs in vier Würfen': 'at least one six in four rolls', 'Zufallsversuch': 'Random experiment', 'Durchführen:': 'Run:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Relative frequency depending on the number of trials',
        'VERSUCHE n': 'TRIALS n', 'TREFFER': 'HITS', 'REL. HÄUFIGKEIT': 'REL. FREQUENCY', 'WAHRSCHEINLICHKEIT': 'PROBABILITY',
        'Noch kein Versuch – starte mit +1 oder +10.': 'No trial yet – start with +1 or +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.': 'Behind one door there is a car, behind each of the other two a goat. Choose a door.',
        'Neues Spiel': 'New game', '1000 Spiele vom Rechner spielen lassen': 'Let the computer play 1,000 games',
        'Strategie': 'Strategy', 'Spiele': 'Games', 'Autos': 'Cars', 'Gewinnquote': 'Win rate',
        'du: bleiben': 'you: stay', 'du: wechseln': 'you: switch', 'Rechner: bleiben': 'computer: stay', 'Rechner: wechseln': 'computer: switch',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js)
        'Fehler melden': 'Report an error', 'Fehler melden: einsprechen oder tippen': 'Report an error: speak or type',
        'Schließen (Esc)': 'Close (Esc)', 'Schließen': 'Close', 'Einsprechen': 'Speak', 'Zuhören beenden': 'Stop listening',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'What is wrong or unclear? Just start speaking or type.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'For example: in exercise 3 it should be 12, not 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'Your browser does the speech recognition. Only the text and its place in the book are stored, no recording and no name.',
        'Senden': 'Send', 'Ich höre zu …': 'Listening …', 'Bitte erst etwas einsprechen oder tippen.': 'Please speak or type something first.',
        'Wird gesendet …': 'Sending …', 'Danke! Deine Meldung ist angekommen.': 'Thank you! Your report has arrived.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'There are too many reports right now. Please try again later.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'That did not work. Please try again later.',
        'Keine Verbindung. Bitte später noch einmal.': 'No connection. Please try again later.',
        'Frage sprechen': 'Speak your question', 'Passwort zeigen': 'Show password', 'Passwort verbergen': 'Hide password',
        'Stimme anhalten': 'Stop the voice', 'Frage senden': 'Send question', 'Passwort': 'Password',
        'Passwort – wird auf diesem Gerät gemerkt': 'Password – remembered on this device', 'Passwort bestätigen': 'Confirm password',
        'Das Passwort gilt nicht mehr.': 'The password is no longer valid.'
    };

    // ---------- pieces of sentences (German as in the widget source → English) ----------
    const PHRASE = [
        // detektiv
        [' (doppelt)', ' (double)'], ['fallend für ', 'decreasing for '], ['steigend für ', 'increasing for '],
        ['achsensymmetrisch zur $y$-Achse', 'symmetric about the $y$-axis'], ['punktsymmetrisch zum Ursprung', 'symmetric about the origin'],
        ['überall steigend', 'increasing everywhere'], ['fallend auf ', 'decreasing on '], ['(senkrecht)', '(vertical)'], ['(waagerecht)', '(horizontal)'],
        ['abwechselnd steigend und fallend', 'alternately increasing and decreasing'], ['ja, Periode ', 'yes, period '],
        ['$ für $x', '$ for $x'], ['$ mit $k', '$ with $k'], [' und fallend auf ', ' and decreasing on '], ['und', 'and'],
        // wachstum
        ['einfache Zinsen (30 € pro Jahr)', 'simple interest (€30 per year)'], ['Zinseszins (3 % pro Jahr)', 'compound interest (3% per year)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'linear: 6.25 percentage points less every day'],
        ['Jod-131: Halbwertszeit 8 Tage', 'iodine-131: half-life 8 days'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — in every step you multiply by <b>the same factor</b>'],
        [' — in jedem Schritt ', ' — in every step '], ['geht <b>gleich viel</b> weg', '<b>the same amount</b> is taken away'],
        [' wäre alles verbraucht.', ' everything would be used up.'], ['kommt <b>gleich viel</b> hinzu.', '<b>the same amount</b> is added.'],
        ['. Nach $', '. After $'], [', das sind ', ', that is '], [' % pro Schritt. ', '% per step. '],
        ['exponentiell', 'exponential'], ['Verdopplungszeit', 'Doubling time'], ['Halbwertszeit', 'Half-life'], ['Jahre', 'years'], ['Tage', 'days'], ['Schritte', 'steps'],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Both points lie vertically above each other. The line $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ is <b>not</b> the graph of a function.'],
        ['Steigung $m = ', 'Gradient $m = '], ['Achsenabschnitt $n = ', 'Intercept $n = '], ['$ (weißer Punkt)', '$ (white point)'],
        [' · Nullstelle $x_0 = ', ' · zero $x_0 = '], [' · waagerechte Gerade', ' · horizontal line'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'For $a = 0$ the graph is not a parabola but a straight line.'],
        ['eine (doppelte) Nullstelle: $x = ', 'one (double) zero: $x = '], ['Nullstellen: $x_1 = ', 'zeros: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Vertex form: $f(x) = '], [' · Scheitel $S(', ' · vertex $S('], ['Normalform: $f(x) = ', 'Standard form: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Highest point after $t_S = '], ['Aufprall nach $', 'Impact after $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ in radians · '], [' · Periode $p = ', ' · period $p = '], [' · Mittellinie $y = ', ' · midline $y = '],
        [' · Wertebereich $', ' · range $'], ['$ · am ', '$ · on '], [' min</b> Tageslicht', ' min</b> of daylight'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'When has the candle burnt down?'], ['Bremsweg bei 150 km/h?', 'Braking distance at 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', 'Temperature difference after 45 min?'], ['Prognose für 2050?', 'Forecast for 2050?'],
        ['Regressionsfunktion: $', 'Regression function: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;with $x$ = years since 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coefficient of determination $R^2 = '], ['(passt sehr gut)', '(fits very well)'], ['(passt gut)', '(fits well)'],
        ['(passt mäßig)', '(fits moderately)'], [' Das Modell sagt: $f(', ' The model says: $f('], ['Regressionsgerade: $', 'Regression line: $'],
        ['Datensatz', 'Data set'],
        // umkehr, expgleichung
        ['$ · Der Punkt $P(', '$ · The point $P('], ['$ auf $f$ wird zum Punkt $P', '$ on $f$ becomes the point $P'], ['$ auf $f^{-1}$.', '$ on $f^{-1}$.'],
        ['Keine Lösung: $', 'No solution: $'], ['^x$ ist immer positiv, kann also nie $', '^x$ is always positive, so it can never be $'],
        ['$ werden.', '$.'], ['Probe: $', 'Check: $'],
        // parameter
        [': strecken in $y$-Richtung', ': stretch in the $y$-direction'], [': verschieben in $y$-Richtung', ': shift in the $y$-direction'],
        [': stauchen in $x$-Richtung', ': compress in the $x$-direction'], [': verschieben in $x$-Richtung', ': shift in the $x$-direction'],
        ['gespiegelt an der $x$-Achse', 'reflected in the $x$-axis'], ['gespiegelt an der $y$-Achse', 'reflected in the $y$-axis'],
        [', in $x$-Richtung mit Faktor ', ', scaled in the $x$-direction by factor '], ['Der Graph ist ', 'The graph is '],
        // waage
        ['Gelöst: $x = ', 'Solved: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Check it: substitute the value into the first line.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Both sides are equal: every number is a solution, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradiction: there is no solution, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Type the transformation you want to apply to <b>both</b> sides.'],
        ['Das verstehe ich nicht. Beispiele: ', "I don't understand that. Examples: "], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'A number is missing after the operator.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplying or dividing by $x$ is not a safe transformation, $x$ could be $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'You must not divide by $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplying by $0$ turns every equation into $0 = 0$, and the information is lost.'],
        ['Bring alle $x$ auf eine Seite: ', 'Get all $x$ onto one side: '], ['Bring die Zahl auf die andere Seite: ', 'Move the number to the other side: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divide by the number in front of $x$: '],
        // binom, koerper
        ['Der häufigste Fehler: ', 'The most common mistake: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. In the picture the two blue rectangles are then missing, here '],
        ['$M = 2\\pi r h', '$L = 2\\pi r h'], ['$O = ', '$S = '], ['Mantellinie $s = ', 'Slant height $s = '],
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Done: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Echelon form reached. Now you can substitute from the bottom upwards or carry on with “Next step” (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Choose an operation and apply it, or let “Next step” help you.'],
        ['Wähle zwei verschiedene Zeilen.', 'Choose two different rows.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Enter a number for $k$, e.g. -2 or 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Multiplying by $0$ is not an equivalence transformation.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Adding a row to itself changes the solution set. Choose another row.'],
        ['Gleichung I ist fest: ', 'Equation I is fixed: '], ['. Verändere Gleichung II: ', '. Change equation II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'Equation II reads $0 = 0$, it restricts nothing.'], ['Gleichung II lautet $0 = ', 'Equation II reads $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: a contradiction, no solution.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exactly one solution</b>: the lines intersect at $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Infinitely many solutions</b>: both equations describe the same line.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>No solution</b>: the lines are parallel and distinct.'],
        ['Gleiche Stellen werden addiert.', 'Entries in the same position are added.'], ['Gleiche Stellen werden subtrahiert.', 'Entries in the same position are subtracted.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Every entry is multiplied by $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Rows become columns: a $2 \\times 3$ matrix becomes a $3 \\times 2$ matrix.'],
        ['Summe: $', 'Sum: $'],
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · starting interval $'], ['$ mit $f(', '$ with $f('], ['$ und $f(', '$ and $f('],
        ['Näherung mit $n = ', 'Approximation with $n = '], [' · genauer Wert $', ' · exact value $'], [' · Fehler $', ' · error $'],
        ['Punkte', 'points'], ['Von $', 'Of $'], ['$ Punkten liegen $', '$ points, $'], ['$ unter der Parabel. Rechteck: ', '$ lie below the parabola. Rectangle: '],
        ['Schätzwert: $A', 'Estimate: $A'], [' · genau: $', ' · exact: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Throw random points into the rectangle '],
        ['. Der Anteil der Treffer unter ', '. The proportion of hits below '], [' schätzt den Anteil der Fläche.', ' estimates the proportion of the area.'],
        // stochastics
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Click on the ends of the paths (on the right of the tree) or choose an event above. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'The book works out the path rules for you.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1st path rule</b> (multiply along the path):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2nd path rule</b> (add the paths):'],
        ['aber nur <b>', 'but only <b>'], ['</b> davon sind wirklich krank.', '</b> of them are really ill.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proportion of the ill among those who test positive: '],
        [' alles richtig', ' all correct'], ['richtig', 'correct'], ['Ereignis: <b>', 'Event: <b>'], ['Zuletzt: ', 'Latest: '],
        ['TÜR', 'DOOR'], ['Tür', 'Door'], ['Gewonnen – das Auto! ', 'You won – the car! '], ['Leider eine Ziege. ', 'Sorry, a goat. '],
        ['Du hast gewechselt.', 'You switched.'], ['Du bist geblieben.', 'You stayed.'],
        // header
        ['Fehler<br>melden', 'Report<br>error'], ['Zur Markierung in ', 'About the selection in '], ['Deine Frage an ', 'Your question to ']
    ];

    // ---------- word order and notation ----------
    const NUM = '-?[\\d.]+';
    const MON = { Jan: 'Jan', Feb: 'Feb', 'Mär': 'Mar', Apr: 'Apr', Mai: 'May', Jun: 'Jun', Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Okt: 'Oct', Nov: 'Nov', Dez: 'Dec' };
    const RULE = [
        // numbers first: thousands with a narrow space (toLocaleString('de-DE')) → 10,000; other narrow spaces → plain ones
        [/(\d) (?=\d{3}(?!\d))/g, '$1,'], [/ /g, ' '], [/(\d) (\d{3}) Punkte/g, '$1,$2 Punkte'],
        // decimal commas that the widget source writes by hand in TeX: 4{,}905 → 4.905
        [/(\d)\{,\}(\d)/g, '$1.$2'],
        // points: S(1 \mid 2) → S(1, 2) · intervals: [1;\,2] → [1, 2]
        [new RegExp('\\((' + NUM + ') \\\\mid (' + NUM + ')\\)', 'g'), '($1, $2)'],
        [new RegExp('\\[(' + NUM + ');\\\\,(' + NUM + ')\\]', 'g'), '[$1, $2]'],
        // dates of the day-length widget: "21. Mär" → "21 Mar"
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + MON[mo]],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'no zeros: the vertex lies ' + (a === 'über' ? 'above' : 'below') + ' the $x$-axis and the parabola opens ' + (b === 'oben' ? 'upwards' : 'downwards') + '.'],
        // wurf: "… in $8.84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$ at a height of $' + h + '$. '],
        // parameter
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => (w === 'gestreckt' ? 'stretched' : 'compressed') + ' in the $' + ax + '$-direction by factor $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' and stretched by factor $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => 'shifted $' + c + '$ ' + { links: 'to the left', rechts: 'to the right', oben: 'up', unten: 'down' }[d]],
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'There is no pivot left in column $1: the system has no or infinitely many solutions.'],
        [/Schritt (\d+):/g, 'Step $1:'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 of $2 correct'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Of 10,000 people, <b>' + n + '</b> test positive – '],
        [/(font-weight:700">)K(<\/text>)/g, '$1D$2'], [/(font-weight:700">)G(<\/text>)/g, '$1H$2'],
        // simulator: coin results W/Z → H/T
        [/(margin-right:10px">)W</g, '$1H<'], [/(margin-right:10px">)Z</g, '$1T<'],
        // goats
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'The host knows where the car is and opens door $1: a goat. Do you stay or switch?'],
        [/Bei Tür (\d) bleiben/g, 'Stay with door $1'], [/Zu Tür (\d) wechseln/g, 'Switch to door $1'],
        // header
        [/^Zu (?=\S)/, 'About '], [/\bFrag (Solita|Doc)\b/g, 'Ask $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Click: switch to $1'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Enter the password once, then $1 can answer.']
    ];
    // after the pieces: English typography for percent ("30 %" → "30%", "30\,\%" → "30\%")
    const POST = [[/(\d) %/g, '$1%'], [/\\,\\%/g, '\\%']];

    // ---------- the engine ----------
    const LETTER = 'A-Za-zÄÖÜäöüß';
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const MAP = new Map();
    PHRASE.forEach(([de, en]) => MAP.set(de, en));
    // one pass over the string: longest piece first, words never inside other words ("oben" not in "verschoben")
    const KEYS = Array.from(MAP.keys()).sort((a, b) => b.length - a.length);
    const ALT = KEYS.map(k => (new RegExp('^[' + LETTER + ']').test(k) ? '(?<![' + LETTER + '])' : '') + esc(k) +
        (new RegExp('[' + LETTER + ']$').test(k) ? '(?![' + LETTER + '])' : ''));
    const PHRASE_RE = ALT.length ? new RegExp(ALT.join('|'), 'g') : null;

    function word(s) {
        const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
        return Object.prototype.hasOwnProperty.call(WORD, m[2]) ? m[1] + WORD[m[2]] + m[3] : null;
    }
    const run = (s, list) => { list.forEach(([re, to]) => { s = s.replace(re, to); }); return s; };
    const pieces = s => PHRASE_RE ? s.replace(PHRASE_RE, k => MAP.get(k)) : s;
    function plain(s) {
        const w = word(s); if (w != null) return w;
        return run(pieces(run(s, RULE)), POST);
    }
    // the pieces never touch the inside of a tag (data-v="links" must stay "links"), except plain formatting tags,
    // which sentences run across ("geht <b>gleich viel</b> weg"): every other tag is parked while the pieces are replaced
    // a real tag starts with a letter or a slash: "$f(1) < 0$ und $f(2) > 0$" is maths, not a tag
    const TAG = /<(?=[A-Za-z\/!])(?!\/?(?:b|i|br)>)[^>]*>/g;
    const ATTR = /(\s(?:title|aria-label|placeholder|alt)=")([^"]*)(")/g;
    function html(s) {
        s = run(s, RULE);
        const tags = [];
        s = s.replace(TAG, t => '\u0001' + (tags.push(t) - 1) + '\u0002');
        s = run(pieces(s), POST);
        s = s.replace(/\u0001(\d+)\u0002/g, (m, i) => tags[+i]);
        // whole labels: the text between two tags, and the words in title, aria-label, placeholder, alt
        return s.split(/(<[A-Za-z\/!][^>]*>)/).map(part => {
            if (part[0] === '<') return part.replace(ATTR, (all, a, v, b) => a + plain(v) + b);
            const w = word(part); return w != null ? w : part;
        }).join('');
    }

    // remembered: a widget draws the same labels again and again
    const memo = { p: new Map(), h: new Map() };
    function tr(s, kind) {
        if (typeof s !== 'string' || !s || s.length > 20000 || !/[A-Za-zÄÖÜäöüß {]/.test(s)) return s;
        const m = memo[kind];
        let r = m.get(s);
        if (r === undefined) {
            r = kind === 'h' ? html(s) : plain(s);
            if (m.size > 5000) m.clear();
            m.set(s, r);
            if (DEBUG && /[äöüÄÖÜß]|\b(der|die|das|und|nicht|ist|mit|von|für|auf|eine?)\b/.test(r.replace(/<[^>]*>/g, ' ').replace(/\$[^$]*\$/g, ' '))) {
                try { if (window.Buch && Buch.dbg) Buch.dbg('[en] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160)); } catch (_) { }
                console.debug('[buch-en] still German:', r);
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    window.BuchEN = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p') };

    // ---------- where the widgets write ----------
    function hookSetter(proto, prop, kind) {
        const d = Object.getOwnPropertyDescriptor(proto, prop);
        if (!d || !d.set) return;
        Object.defineProperty(proto, prop, Object.assign({}, d, { set(v) { d.set.call(this, tr(v, kind)); } }));
    }
    hookSetter(Element.prototype, 'innerHTML', 'h');
    hookSetter(Node.prototype, 'textContent', 'p');
    hookSetter(HTMLElement.prototype, 'innerText', 'p');
    hookSetter(HTMLElement.prototype, 'title', 'p');
    hookSetter(HTMLInputElement.prototype, 'placeholder', 'p');
    hookSetter(HTMLTextAreaElement.prototype, 'placeholder', 'p');
    const insertHTML = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function (pos, s) { return insertHTML.call(this, pos, tr(s, 'h')); };
    const setAttr = Element.prototype.setAttribute;
    const TEXT_ATTR = { title: 1, 'aria-label': 1, placeholder: 1, alt: 1 };
    Element.prototype.setAttribute = function (name, v) { return setAttr.call(this, name, TEXT_ATTR[name] ? tr(String(v), 'p') : v); };

    // canvas: labels and numbers drawn by the widgets (a decimal comma between digits is always one there)
    const canvas = s => { if (typeof s !== 'string') return s; return tr(s, 'p').replace(/(\d),(\d)/g, '$1.$2'); };
    const C2D = CanvasRenderingContext2D.prototype;
    ['fillText', 'strokeText', 'measureText'].forEach(fn => {
        const orig = C2D[fn];
        C2D[fn] = function (s, ...rest) { return orig.call(this, canvas(s), ...rest); };
    });
})();
