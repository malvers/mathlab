/* js/buch-en/funktionen.js — English for the widgets of js/buch-funktionen.js:
 *   titelbild, detektiv, wachstum, gerade, parabel, wurf, einheitskreis, sinus, tageslaenge,
 *   regression, anscombe, umkehr, expgleichung, parameter, graphquiz
 * Loaded by the English editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('funktionen', {
    word: {
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
    },
    phrase: [
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
    ],
    rule: [
        // dates of the day-length widget: "21. Mär" → "21 Mar"
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'Jan', Feb: 'Feb', 'Mär': 'Mar', Apr: 'Apr', Mai: 'May', Jun: 'Jun', Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Okt: 'Oct', Nov: 'Nov', Dez: 'Dec' }[mo]],
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
    ]
});
