/* js/buch-en/bgy13lk.js — English for the widgets of js/buch-bgy13lk.js:
 *   titelbildbgy13lk, matrixinverse, leontief, uebergang, biquadratisch (book mathe13lk-en)
 * Loaded by the English editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * The identity matrix is I in English (E in German), as in mathe11-en: (A | E) → (A | I), (E - A)^{-1} → (I - A)^{-1}.
 * The Leontief sectors L, I, D become A (agriculture), I (industry), S (services).
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('bgy13lk', {
    word: {
        // matrixinverse
        'nicht invertierbar': 'not invertible', 'Beispielmatrix': 'Example matrix', 'Alle Schritte': 'All steps', 'Von vorn': 'Start again',
        // leontief
        'Endnachfrage Landwirtschaft $y_1$': 'Final demand, agriculture $y_1$', 'Endnachfrage Industrie $y_2$': 'Final demand, industry $y_2$',
        'Endnachfrage Dienstleistung $y_3$': 'Final demand, services $y_3$', 'Markt': 'Market',
        // uebergang
        'Käferpopulation': 'Beetle population', 'Kundenwanderung': 'Customers switching', 'Eier je Käfer $f$': 'Eggs per beetle $f$',
        'Verlauf der drei Klassen über die Schritte n': 'Course of the three stages over the steps n',
        '1 Schritt': '1 step', '10 Schritte': '10 steps', 'Zurück auf Start': 'Back to start',
        'Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen': 'Transition graph with three states and the transition proportions on the arrows',
        'Eier': 'Eggs', 'Larven': 'Larvae', 'Käfer': 'Beetles',
        // biquadratisch
        'Koeffizient $p$': 'Coefficient $p$', 'Koeffizient $q$': 'Coefficient $q$',
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'The parabola h(z) = z² + p·z + q with its zeros',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'The graph of f(x) = x⁴ + p·x² + q with its zeros'
    },
    phrase: [
        // titelbildbgy13lk: the aria-label sits in a string piece that starts inside the <svg> tag, so it is a phrase
        ['Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer',
            'Cover picture: trapeziums under a curve, a bell curve with a red rejection region, a cycle egg, larva, beetle'],
        // matrixinverse: the steps (the ones with numbers and row names are rules below)
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'Next to $A$ is the identity matrix $I$. Goal: produce $I$ on the left, with the same row operations as on the right.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr.',
            'The identity matrix can no longer be produced on the left: a row becomes all zeros on the left, or a column has no number $\\neq 0$ left.'],
        ['$A$ ist nicht invertierbar.', '$A$ is not invertible.'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'On the left is $I$, on the right is $A^{-1}$.'],
        ['$. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $', '$. Check: $A \\cdot A^{-1} = I$, for example first row times first column: $'],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'The system of equations $A \\cdot \\vec{x} = '],
        ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ has the solution $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'The third row of $A$ is the sum of the first two. Then $A \\cdot \\vec{x} = \\vec{b}$ has either no solution or infinitely many, never exactly one.'],
        ['Weiter mit „Nächster Schritt“.', 'Continue with “Next step”.'],
        // leontief
        ['Zeile: liefernder Sektor, Spalte: empfangender Sektor. ', 'Row: supplying sector, column: receiving sector. '],
        ['. Summe = Produktion, alle Angaben gerundet in ME.', '. Total = production, all figures rounded, in units.'],
        ['Technologiematrix $A = ', 'Technology matrix $A = '],
        ['$, Leontief-Inverse $(E - A)^{-1} \\approx ', '$, Leontief inverse $(I - A)^{-1} \\approx '],
        ['$\\vec{x} = (E - A)^{-1} \\cdot \\vec{y} \\approx ', '$\\vec{x} = (I - A)^{-1} \\cdot \\vec{y} \\approx '],
        ['$. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ',
            '$. Every row of the table balances: deliveries to the three sectors plus final demand make up the production. '],
        [' ME', ' units'],
        // uebergang: the names in the sentences, the beetles and the customers
        ['Anbieter A', 'Provider A'], ['Anbieter B', 'Provider B'], ['Anbieter C', 'Provider C'],
        ['Eier', 'eggs'], ['Larven', 'larvae'], ['Käfer', 'beetles'],
        ['$U^3 = a \\cdot b \\cdot f \\cdot E = ', '$U^3 = a \\cdot b \\cdot f \\cdot I = '],
        [' \\cdot E$: Nach jeweils drei Schritten ist jede Klasse ', ' \\cdot I$: after every three steps each stage '],
        ['<b>genau so groß wie vorher</b>, die Population schwankt zyklisch.', 'is <b>exactly as large as before</b>; the population fluctuates in a cycle.'],
        ['$. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.',
            '$. As $n$ grows, the columns of $P^n$ become equal: they approach the <b>limit matrix</b>, whose columns are all the <b>fixed vector</b>.'],
        ['Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx ',
            'Fixed vector from $P \\cdot \\vec{v} = \\vec{v}$ and $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx '],
        ['$. Langfristig: ', '$. In the long run: '], [' der Kundschaft, egal wie es anfing.', ' of the customers, no matter how it started.'],
        // biquadratisch
        ['$ wird mit $z = x^2$ zu $z^2', '$ turns, with $z = x^2$, into $z^2'], [', Diskriminante $\\tfrac{p^2}{4} - q = ', ', discriminant $\\tfrac{p^2}{4} - q = '],
        [' liefert $x = \\pm', ' gives $x = \\pm'], [' liefert $x = 0$', ' gives $x = 0$'],
        [' liefert nichts, denn $x^2$ ist nie negativ', ' gives nothing, because $x^2$ is never negative'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'no solution $z$, the discriminant is negative'],
        ['Keine Lösung', 'No solution'], ['Eine Lösung', 'One solution'], [' Lösungen', ' solutions']
    ],
    rule: [
        // matrixinverse: "Schritt 2 von 7: …", swapping, dividing, clearing a column
        [/Schritt (\d+) von (\d+): /, (m, a, b) => 'Step ' + a + ' of ' + b + ': '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./, (m, a, b, c) => 'Swap rows ' + a + ' and ' + b + ' so that there is no zero at the top of column ' + c + '.'],
        [/Zeile (I{1,3}) durch \$([^$]*)\$ teilen: Das Pivotelement wird 1\./, (m, a, p) => 'Divide row ' + a + ' by $' + p + '$: the pivot becomes 1.'],
        [/In Spalte (\d) Nullen erzeugen: /, (m, c) => 'Make zeros in column ' + c + ': '],
        // leontief: the sector letters L, I, D → A, I, S in the table and its key, the totals
        [/<th>L<\/th><th>I<\/th><th>D<\/th>/, '<th>A</th><th>I</th><th>S</th>'], [/<tr><th>L<\/th>/, '<tr><th>A</th>'], [/<tr><th>D<\/th>/, '<tr><th>S</th>'],
        [/L = Landwirtschaft, I = Industrie, D = Dienstleistung/, 'A = agriculture, I = industry, S = services'],
        [/Insgesamt werden ([\d.,]+) ME erzeugt, damit ([\d.,]+) ME den Markt erreichen\./, (m, a, b) => 'In total ' + a + ' units are produced so that ' + b + ' units reach the market.'],
        // uebergang: growing and shrinking after three steps
        [/um den Faktor ([\d.,]+) <b>gewachsen<\/b>\./, (m, q) => 'has <b>grown</b> by a factor of ' + q + '.'],
        [/auf das ([\d.,]+)-Fache <b>geschrumpft<\/b>, die Population stirbt langfristig aus\./, (m, q) => 'has <b>shrunk</b> to ' + q + ' times its size; the population dies out in the long run.']
    ]
});
