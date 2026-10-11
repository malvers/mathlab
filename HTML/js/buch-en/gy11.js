/* js/buch-en/gy11.js — English for the widgets of js/buch-gy11.js:
 *   titelbildgy11, kettenregel, matrixprodukt, drehmatrix, newton (book 8, mathegy11-en)
 * Loaded by the English editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gy11', {
    word: {
        // titelbildgy11
        'Titelbild: Sekanten, die sich einer Tangente nähern, Tangenten des Newton-Verfahrens auf dem Weg zu einer Nullstelle, eine Ebene, die von einer Geraden durchstoßen wird, und die Balken einer Binomialverteilung':
            'Cover picture: secants approaching a tangent, tangents of Newton’s method on the way to a zero, a plane pierced by a line, and the bars of a binomial distribution',
        // kettenregel
        'Äußere Funktion u(z)': 'Outer function u(z)', 'Innere Funktion v(x)': 'Inner function v(x)', '−0,5x': '−0.5x',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Composite function with a tangent at a movable point',
        // matrixprodukt
        'Typen der Matrizen': 'Types of the matrices', 'Reihenfolge': 'Order', 'Neue Zahlen': 'New numbers', 'nicht definiert': 'not defined',
        // drehmatrix
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'A figure is rotated about the origin with a rotation matrix',
        'Drehwinkel $\\varphi$': 'Angle of rotation $\\varphi$',
        // newton
        'Funktion': 'Function', 'Newton-Verfahren: Tangenten führen zur Nullstelle': 'Newton’s method: tangents lead to the zero',
        'Nächster Schritt': 'Next step', '5 Schritte': '5 steps', 'Zurücksetzen': 'Reset'
    },
    phrase: [
        // kettenregel (numbers are already English here: the number rules run first)
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; outer $u(z) = '], ['$, innen $v(x) = ', '$, inner $v(x) = '],
        ['An der Stelle $x_0 = ', 'At the point $x_0 = '], ['$ ist $v(x_0) = ', '$, $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$: there $f$ is not defined or not differentiable. Drag the point further.'],
        ['$, also $f\'(x_0) \\approx ', '$, so $f\'(x_0) \\approx '],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0.0001$): $', '$. Check with the difference quotient ($h = 0.0001$): $'],
        // matrixprodukt
        ['$ hat den Typ $', '$ has the type $'], ['$ den Typ $', '$ the type $'],
        [' Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', ' rows: the matrices are not compatible in this order, so the product does not exist.'],
        ['Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', 'the matrices are not compatible in this order, so the product does not exist.'],
        ['Typen: $', 'Types: $'], ['$ · Klick auf ein Feld des Ergebnisses.', '$ · click on a cell of the result.'],
        ['$ ist nicht definiert.', '$ is not defined.'], ['$, ist also etwas ganz anderes.', '$, so it is something completely different.'],
        ['$ ergibt ', '$ gives '], ['hier zufällig dasselbe', 'the same here, by chance'], ['andere Zahlen', 'different numbers'],
        ['Andersherum: ', 'The other way round: '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' The commutative law does not hold for matrices in general.'],
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · The rotation is about the origin, anticlockwise.'],
        // newton
        ['Bei $x_{', 'At $x_{'], ['}$ ist $f\'(x) = 0$: Die Tangente ist waagerecht, das Verfahren bricht ab.', '}$, $f\'(x) = 0$: the tangent is horizontal, the method stops.'],
        ['Die Folge läuft weg: anderer Startwert.', 'The sequence runs away: try another start value.'], ['$ und $f\'(x) = ', '$ and $f\'(x) = '],
        ['$. Den Startwert verschiebst du mit dem weißen Punkt auf der $x$-Achse.', '$. You move the start value with the white point on the $x$-axis.']
    ],
    rule: [
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$" (the pieces alone are in tools/buch-en/known.json)
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, ' $1 has $2 columns, but $3 has $4 rows: '],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$/g, (m, i, p, j, q) => 'Row ' + i + ' of $' + p + '$ times column ' + j + ' of $' + q + '$']
    ]
});
