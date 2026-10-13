/* js/buch-es/gy11lk-stoch.js — Spanish for the widgets of js/buch-gy11lk-stoch.js.
 * Loaded by the Spanish editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy11lk-stoch', {
    word: {
        // book es mathegy11lk-es (Turing)
        // geburtstag
        'Personen $n$': 'Personas $n$', '1000 Klassen simulieren': 'Simular 1000 clases',
        'Wahrscheinlichkeit für mindestens zwei gleiche Geburtstage in Abhängigkeit von der Zahl der Personen':
            'Probabilidad de que al menos dos personas cumplan años el mismo día, según el número de personas',
        // umkehrbaum
        'Schnelltest': 'Test rápido', 'Spamfilter': 'Filtro antispam', 'Zwei Maschinen': 'Dos máquinas', 'von 10 000': 'de cada 10 000',
        'Baumdiagramm: erst A, dann B': 'Diagrama de árbol: primero A, después B', 'Umgekehrtes Baumdiagramm: erst B, dann A': 'Diagrama de árbol invertido: primero B, después A',
        'Dieses Bild braucht js/buch-stochastik.js.': 'Esta figura necesita js/buch-stochastik.js.',
        // galton
        'Nagelreihen $n$': 'Filas de clavos $n$', 'nach rechts mit $p$': 'a la derecha con $p$', 'Leeren': 'Vaciar',
        'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Frecuencias relativas de las casillas comparadas con la distribución binomial',

    },
    phrase: [
        // book es mathegy11lk-es (Turing)
        // geburtstag
        ['$ günstige von $365^{', '$ casos favorables de $365^{'],
        ['}$ gleich wahrscheinlichen Ergebnissen, also $P(\\text{alle verschieden}) \\approx ', '}$ resultados igual de probables, así que $P(\\text{todos distintos}) \\approx '],
        ['$P(\\text{mindestens zwei gleich}) = 1 - ', '$P(\\text{al menos dos iguales}) = 1 - '],
        // umkehrbaum
        ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
            'El primer árbol da el numerador y el denominador; el árbol invertido muestra el resultado en su rama superior, detrás de $B$.'],
        ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$: bajo la condición $B$ no se puede calcular nada.'],
        // galton
        ['$ für $X \\sim B(', '$ para $X \\sim B('], ['Mittleres Fach $', 'Casilla media $'], ['$, Erwartungswert $n \\cdot p = ', '$, esperanza $n \\cdot p = '],
        // the pieces of the sentences that a rule below translates as a whole (so check.mjs sees them translated, too)
        [' Geburtstage verschieden: $', ' cumpleaños distintos: $'], [' In 1000 simulierten Klassen hatten ', ' En 1000 clases simuladas, '], [' einen doppelten Geburtstag.', ' tuvieron un cumpleaños repetido.'],
        ['kein Spam', 'no spam'], ['enthält „Gratis“', 'contiene “gratis”'], ['ohne „Gratis“', 'sin “gratis”'], ['Maschine 1', 'máquina 1'], ['Maschine 2', 'máquina 2'], ['in Ordnung', 'correcto'],
        ['In Zahlen: Von ', 'En números: de '], [' Fällen mit „', ' casos con «'], ['“ sind ', '», '],
        ['Galtonbrett mit ', 'Tablero de Galton con '], [' Nagelreihen', ' filas de clavos'],
        [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' bolas. Barras: frecuencia relativa por casilla; puntos: $P(X = k)$ para $X \\sim B('],
        ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.', 'Deja caer bolas: cada una choca con $n$ clavos y salta cada vez a la derecha con probabilidad $p$.'],

    ],
    rule: [
        // book es mathegy11lk-es (Turing)
        // geburtstag: "Alle 23 Geburtstage verschieden: $…" and the simulation (int() writes 1 000 with a space)
        [/Alle (\d+) Geburtstage verschieden: \$/g, 'Los $1 cumpleaños distintos: $'],
        [/ In 1000 simulierten Klassen hatten (\d[\d ]*?) einen doppelten Geburtstag\./g, (m, k) => ' En 1000 clases simuladas, ' + k + (k === '1' ? ' tuvo' : ' tuvieron') + ' un cumpleaños repetido.'],
        // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ." with the names of the three examples
        [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/, (m, a, na, b, nb) => {
            const T = { 'krank': 'enfermo', 'gesund': 'sano', 'positiv': 'positivo', 'negativ': 'negativo', 'Spam': 'spam', 'kein Spam': 'no spam', 'enthält „Gratis“': 'contiene “gratis”',
                'ohne „Gratis“': 'sin “gratis”', 'Maschine 1': 'máquina 1', 'Maschine 2': 'máquina 2', 'defekt': 'defectuoso', 'in Ordnung': 'correcto' }, t = s => T[s] || s;
            return '$A$: ' + t(a) + ', $\\overline{A}$: ' + t(na) + ', $B$: ' + t(b) + ', $\\overline{B}$: ' + t(nb) + '.';
        }],
        // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“."
        [/In Zahlen: Von (\d[\d ]*?) Fällen mit „(.+?)“ sind (\d[\d ]*?) „(.+?)“\./g, (m, all, b, hit, a) => {
            const T = { 'krank': 'enfermo', 'positiv': 'positivo', 'Spam': 'spam', 'enthält „Gratis“': 'contiene “gratis”', 'Maschine 1': 'máquina 1', 'defekt': 'defectuoso' }, t = s => T[s] || s;
            return 'En números: de ' + all + ' casos con «' + t(b) + '», ' + hit + ' son «' + t(a) + '».';
        }],
        // galton: the board in the aria label and the count of balls
        [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Tablero de Galton con ' + n + (n === '1' ? ' fila' : ' filas') + ' de clavos'],
        [/(\d[\d ]*?) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$/g, (m, k) => k + (k === '1' ? ' bola' : ' bolas') + '. Barras: frecuencia relativa por casilla; puntos: $'],

    ]
});
