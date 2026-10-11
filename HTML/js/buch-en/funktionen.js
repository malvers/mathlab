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
        // book 4 mathefos11-en: funktion, lage, parabelschar, ganzrational
        'Parabel': 'Parabola', 'Liegende Spitze': 'Sideways V', 'Liegende Parabel': 'Sideways parabola', 'Wurzel': 'Square root', 'Hyperbel': 'Hyperbola',
        'Betrag': 'Absolute value', 'Kurve': 'Curve', 'Kurve mit verschiebbarer senkrechter Gerade': 'Curve with a draggable vertical line',
        'Zieh den türkisen Punkt unten: Die senkrechte Gerade wandert mit. Wie oft trifft sie die Kurve?':
            'Drag the turquoise point at the bottom: the vertical line moves with it. How often does it meet the curve?',
        'Ist die Kurve der Graph einer Funktion?': 'Is the curve the graph of a function?', 'keine Funktion': 'not a function',
        'Richtig.': 'Correct.', 'Nicht ganz.': 'Not quite.',
        'Entscheide mit den Knöpfen. Danach siehst du Definitions- und Wertebereich.': 'Decide with the buttons. Then you will see the domain and range.',
        'schneidend': 'intersecting', 'identisch': 'identical',
        '$g$: Anstieg $m_1$': '$g$: gradient $m_1$', '$g$: Achsenabschnitt $n_1$': '$g$: intercept $n_1$',
        '$h$: Anstieg $m_2$': '$h$: gradient $m_2$', '$h$: Achsenabschnitt $n_2$': '$h$: intercept $n_2$',
        'Zwei Geraden und ihre Lage zueinander': 'Two lines and their relative position',
        'Funktionenschar': 'Family of functions', 'Schar von Parabeln mit einem hervorgehobenen Mitglied': 'Family of parabolas with one highlighted member',
        'Vielfachheit': 'Multiplicity', 'Vielfachheit kleiner': 'Lower multiplicity', 'Vielfachheit größer': 'Higher multiplicity', 'Faktor $a$': 'Factor $a$',
        'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.': 'Drag the zeros along the $x$-axis. Multiplicity 0 removes the linear factor.',
        'Ganzrationale Funktion mit verschiebbaren Nullstellen': 'Polynomial function with draggable zeros',
        // book 11 mathegy9-en: potenzfunktion
        'Verwandte zeigen': 'Show relatives', 'Graph einer Potenzfunktion': 'Graph of a power function', 'Exponent': 'Exponent',
        'Nullstelle': 'Zero', 'Polstelle': 'Pole', 'Gemeinsame Punkte': 'Common points',
        'keine, $f$ ist nur für $x \\geq 0$ definiert': 'none, $f$ is only defined for $x \\geq 0$',
        'achsensymmetrisch zur $y$-Achse, denn $f(-x) = f(x)$': 'symmetric about the $y$-axis, because $f(-x) = f(x)$',
        'punktsymmetrisch zum Ursprung, denn $f(-x) = -f(x)$': 'symmetric about the origin, because $f(-x) = -f(x)$',
        'steigt für $x \\geq 0$': 'increasing for $x \\geq 0$', 'steigt überall': 'increasing everywhere',
        'fällt für $x < 0$, steigt für $x > 0$': 'decreasing for $x < 0$, increasing for $x > 0$',
        'steigt für $x < 0$, fällt für $x > 0$': 'increasing for $x < 0$, decreasing for $x > 0$',
        'fällt für $x < 0$ und fällt für $x > 0$': 'decreasing for $x < 0$ and decreasing for $x > 0$',
        '$x = 0$, ohne Vorzeichenwechsel': '$x = 0$, without a change of sign', '$x = 0$, mit Vorzeichenwechsel': '$x = 0$, with a change of sign',
        'senkrecht $x = 0$, waagerecht $y = 0$': 'vertical $x = 0$, horizontal $y = 0$',
        // book 11 mathegy9-en: extremwert
        'Zaun an der Mauer': 'Fence against a wall', 'Rechteck mit Umfang 24 cm': 'Rectangle with perimeter 24 cm', 'Aufgabe': 'Problem',
        'Seite $x$': 'Side $x$', 'Flächeninhalt in Abhängigkeit von x': 'Area as a function of x', 'MAUER': 'WALL',
        'Rechteckiges Gehege an einer Mauer mit 40 m Zaun': 'Rectangular pen against a wall with 40 m of fencing',
        'Rechteck mit festem Umfang 24 cm': 'Rectangle with a fixed perimeter of 24 cm',
        'Zielgröße $A = x \\cdot (40 - 2x)$, Nebenbedingung: Zaunlänge $x + (40 - 2x) + x = 40$.':
            'Target quantity $A = x \\cdot (40 - 2x)$, constraint: length of fence $x + (40 - 2x) + x = 40$.',
        'Scheitelpunktform: $A(x) = -2x^2 + 40x = -2(x - 10)^2 + 200$': 'Vertex form: $A(x) = -2x^2 + 40x = -2(x - 10)^2 + 200$',
        'Maximum: $x = 10\\,\\text{m}$, Breite $20\\,\\text{m}$, $A = 200\\,\\text{m}^2$.': 'Maximum: $x = 10\\,\\text{m}$, width $20\\,\\text{m}$, $A = 200\\,\\text{m}^2$.',
        'Such die größte Fläche. Sie liegt am Scheitel der Parabel.': 'Find the largest area. It is at the vertex of the parabola.',
        'Zielgröße $A = x \\cdot y$, Nebenbedingung $2x + 2y = 24$, also $y = 12 - x$.': 'Target quantity $A = x \\cdot y$, constraint $2x + 2y = 24$, so $y = 12 - x$.',
        'Scheitelpunktform: $A(x) = -x^2 + 12x = -(x - 6)^2 + 36$': 'Vertex form: $A(x) = -x^2 + 12x = -(x - 6)^2 + 36$',
        'Maximum: das Quadrat mit $6\\,\\text{cm}$ Seitenlänge, $A = 36\\,\\text{cm}^2$.': 'Maximum: the square with side length $6\\,\\text{cm}$, $A = 36\\,\\text{cm}^2$.',
        'Welches Rechteck mit Umfang $24\\,\\text{cm}$ hat die größte Fläche?': 'Which rectangle with perimeter $24\\,\\text{cm}$ has the largest area?',
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
        // book 4 mathefos11-en: funktion
        ['$ · Bei $x = ', '$ · At $x = '], ['$ trifft die Senkrechte die Kurve <b>', '$ the vertical line meets the curve <b>'],
        ['gar nicht', 'not at all'], ['genau einmal', 'exactly once'], ['$ und $y = ', '$ and $y = '],
        ['Jede senkrechte Gerade trifft die Kurve höchstens einmal: eine Funktion. ', 'Every vertical line meets the curve at most once: a function. '],
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.',
            'To the right of $x = -1$ every vertical line meets the curve twice: $x = 1$ has both $y = 2$ and $y = -2$.'],
        ['Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.',
            '$x = 2$ has both $y = 2$ and $y = -2$. But a function assigns exactly one $y$ to every $x$.'],
        // book 4 mathefos11-en: lage
        ['Gleicher Anstieg und gleicher Achsenabschnitt: <b>identisch</b>. Jeder Punkt ist gemeinsam.', 'Same gradient and same intercept: <b>identical</b>. Every point is shared.'],
        ['Gleicher Anstieg $m_1 = m_2$, verschiedene Achsenabschnitte: <b>parallel</b>. Es gibt keinen Schnittpunkt.',
            'Same gradient $m_1 = m_2$, different intercepts: <b>parallel</b>. There is no point of intersection.'],
        ['$: Die Geraden sind <b>orthogonal</b> (senkrecht zueinander).', '$: the lines are <b>orthogonal</b> (perpendicular to each other).'],
        ['Verschiedene Anstiege: Die Geraden <b>schneiden</b> sich.', 'Different gradients: the lines <b>intersect</b>.'],
        ['Gleichsetzen: $', 'Setting equal: $'], ['$ ergibt $x = ', '$ gives $x = '], ['$, also ', '$, so '], [' · Schnittwinkel $', ' · angle of intersection $'],
        ['parallel zur $x$-Achse', 'parallel to the $x$-axis'],
        // book 4 mathefos11-en: parabelschar
        ['$ für $', '$ for $'], ['Nullstellen: $', 'Zeros: $'], ['keine Nullstelle', 'no zero'], [' · Scheitel $(', ' · vertex $('],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'two zeros $x = 0$ and $x = -a$'], ['zwei Nullstellen ', 'two zeros '],
        ['eine (doppelte) Nullstelle ', 'one (double) zero '], ['eine doppelte Nullstelle ', 'one double zero '],
        ['keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', 'not a parabola but the line $y = -4$: no zero'],
        ['nach unten geöffnet mit dem Scheitel ', 'opens downwards with the vertex '], [': keine Nullstelle', ': no zero'],
        ['Diskriminante: $', 'Discriminant: $'], ['$ hat $D = ', '$ has $D = '], ['Ausklammern: $', 'Factoring out: $'],
        ['$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).',
            '$. The vertices $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ all lie on the parabola $y = -x^2$ (dashed).'],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.',
            '$kx^2 = 4$ only has solutions for $k > 0$. The case $k = 0$ has to be looked at separately, because then the $x^2$ disappears.'],
        // book 4 mathefos11-en: ganzrational
        [': einfach → ', ': single → '], [': doppelt → ', ': double → '], [': dreifach → ', ': triple → '], [': vierfach → ', ': fourfold → '],
        [': fünffach → ', ': fivefold → '], [': sechsfach → ', ': sixfold → '], [': siebenfach → ', ': sevenfold → '], [': achtfach → ', ': eightfold → '],
        [': neunfach → ', ': ninefold → '],
        ['Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse', 'change of sign, the graph <b>cuts</b> the $x$-axis'],
        ['Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)', 'change of sign, the graph cuts the $x$-axis <b>flat</b> (saddle point)'],
        ['kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse', 'no change of sign, the graph <b>touches</b> the $x$-axis'],
        ['$ · Grad $', '$ · degree $'], ['Für $x \\to +\\infty$ geht $f(x) \\to ', 'For $x \\to +\\infty$, $f(x) \\to '],
        ['$, für $x \\to -\\infty$ geht $f(x) \\to ', '$, for $x \\to -\\infty$, $f(x) \\to '],
        ['Es entscheidet nur der Summand mit der höchsten Potenz: $', 'Only the term with the highest power decides: $'],
        // book 11 mathegy9-en: extremwert
        ['Jetzt: $A(', 'Now: $A('],
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
        // book 4 mathefos11-en: funktion, "die Kurve <b>2-mal</b>"
        [/<b>(\d+)-mal<\/b>/g, '<b>$1 times</b>'],
    ]
});
