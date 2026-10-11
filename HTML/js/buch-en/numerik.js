/* js/buch-en/numerik.js — English for the widgets of js/buch-numerik.js:
 *   bisektion, flaeche, mc-flaeche
 * Loaded by the English editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('numerik', {
    word: {
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Bisection method', 'Intervall halbieren': 'Halve the interval', '5 Schritte': '5 steps',
        'Schritt': 'Step', 'Mitte $m$': 'Midpoint $m$', 'Breite': 'Width',
        'x² auf [0; 2]': 'x² on [0, 2]', '√x auf [0; 4]': '√x on [0, 4]', 'sin x auf [0; π]': 'sin x on [0, π]',
        'Rechtecke links': 'Left rectangles', 'Rechtecke Mitte': 'Midpoint rectangles', 'Trapeze': 'Trapeziums', 'Verfahren': 'Method',
        'Anzahl der Streifen $n$': 'Number of strips $n$', 'Flächeninhalt mit Streifen angenähert': 'Area approximated with strips',
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Random points in the rectangle, hits below the parabola',
    },
    phrase: [
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · starting interval $'], ['$ mit $f(', '$ with $f('], ['$ und $f(', '$ and $f('],
        ['Näherung mit $n = ', 'Approximation with $n = '], [' · genauer Wert $', ' · exact value $'], [' · Fehler $', ' · error $'],
        ['Punkte', 'points'], ['Von $', 'Of $'], ['$ Punkten liegen $', '$ points, $'], ['$ unter der Parabel. Rechteck: ', '$ lie below the parabola. Rectangle: '],
        ['Schätzwert: $A', 'Estimate: $A'], [' · genau: $', ' · exact: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Throw random points into the rectangle '],
        ['. Der Anteil der Treffer unter ', '. The proportion of hits below '], [' schätzt den Anteil der Fläche.', ' estimates the proportion of the area.'],
    ],
    rule: []
});
