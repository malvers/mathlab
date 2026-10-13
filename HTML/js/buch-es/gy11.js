/* js/buch-es/gy11.js — Spanish for the widgets of js/buch-gy11.js.
 * Loaded by the Spanish editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy11', {
    word: {
        // book es mathegy11-es (Turing)
        // titelbildgy11
        'Titelbild: Sekanten, die sich einer Tangente nähern, Tangenten des Newton-Verfahrens auf dem Weg zu einer Nullstelle, eine Ebene, die von einer Geraden durchstoßen wird, und die Balken einer Binomialverteilung':
            'Portada: secantes que se acercan a una tangente, tangentes del método de Newton camino de un cero, un plano atravesado por una recta y las barras de una distribución binomial',
        // kettenregel
        'Äußere Funktion u(z)': 'Función exterior u(z)', 'Innere Funktion v(x)': 'Función interior v(x)',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Función compuesta con la tangente en un punto desplazable',
        // matrixprodukt
        'Typen der Matrizen': 'Dimensiones de las matrices', 'Reihenfolge': 'Orden', 'Neue Zahlen': 'Números nuevos', 'nicht definiert': 'no definido',
        // drehmatrix
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'Una figura gira alrededor del origen con una matriz de giro',
        'Drehwinkel $\\varphi$': 'Ángulo de giro $\\varphi$',
        // newton
        'Newton-Verfahren: Tangenten führen zur Nullstelle': 'Método de Newton: las tangentes llevan al cero',
        'Nächster Schritt': 'Siguiente paso', '5 Schritte': '5 pasos',

        // book es mathegy11lk-es (Turing)

    },
    phrase: [
        // book es mathegy11-es (Turing)
        // kettenregel
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; exterior $u(z) = '], ['$, innen $v(x) = ', '$, interior $v(x) = '],
        ['An der Stelle $x_0 = ', 'En el punto $x_0 = '], ['$ ist $v(x_0) = ', '$ es $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$: ahí $f$ no está definida o no es derivable. Arrastra el punto un poco más.'],
        ['$, also $f\'(x_0) \\approx ', '$, así que $f\'(x_0) \\approx '],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0{,}0001$): $', '$. Comprobación con el cociente incremental ($h = 0{,}0001$): $'],
        // matrixprodukt
        ['$ hat den Typ $', '$ tiene la dimensión $'], ['$ den Typ $', '$ la dimensión $'],
        [' Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', ' filas: en este orden las matrices no son compatibles, el producto no existe.'],
        ['Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', 'en este orden las matrices no son compatibles, el producto no existe.'],
        ['Typen: $', 'Dimensiones: $'], ['$ · Klick auf ein Feld des Ergebnisses.', '$ · Haz clic en una casilla del resultado.'],
        ['$ ist nicht definiert.', '$ no está definido.'], ['$, ist also etwas ganz anderes.', '$, así que es algo completamente distinto.'],
        ['$ ergibt ', '$ da '], ['hier zufällig dasselbe', 'aquí, por casualidad, lo mismo'], ['andere Zahlen', 'otros números'],
        ['Andersherum: ', 'Al revés: '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' Para las matrices, la propiedad conmutativa no se cumple en general.'],
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · El giro es alrededor del origen, en sentido antihorario.'],
        // newton
        ['Bei $x_{', 'En $x_{'], ['}$ ist $f\'(x) = 0$: Die Tangente ist waagerecht, das Verfahren bricht ab.', '}$ es $f\'(x) = 0$: la tangente es horizontal, el método se detiene.'],
        ['Die Folge läuft weg: anderer Startwert.', 'La sucesión se escapa: prueba otro valor inicial.'], ['$ und $f\'(x) = ', '$ y $f\'(x) = '],
        ['$. Iteration: $x_{n+1}', '$. Iteración: $x_{n+1}'],
        ['$. Den Startwert verschiebst du mit dem weißen Punkt auf der $x$-Achse.', '$. El valor inicial lo desplazas con el punto blanco del eje $x$.'],

        // book es mathegy11lk-es (Turing)

    ],
    rule: [
        // book es mathegy11-es (Turing)
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$"
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, (m, p, i, q, j) => ' ' + p + ' tiene ' + i + (i === '1' ? ' columna' : ' columnas') + ', pero ' + q + ' tiene ' + j + (j === '1' ? ' fila: ' : ' filas: ')],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$/g, (m, i, p, j, q) => 'Fila ' + i + ' de $' + p + '$ por columna ' + j + ' de $' + q + '$'],

        // book es mathegy11lk-es (Turing)

    ]
});
