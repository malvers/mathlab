/* js/buch-en/gy12.js — English for the widgets of js/buch-gy12.js:
 *   schaetzen, summen (book 6, mathegy12-en)
 * Loaded by the English editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gy12', {
    word: {
        // schaetzen
        'Stichprobenumfang $n$': 'Sample size $n$', 'Neue Stichprobe': 'New sample', '+1000 Stichproben': '+1000 samples', 'Anzahl': 'Number',
        'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert': 'Fill quantities of the sample as a dot plot with their mean and the target value',
        'Sollwert': 'target',
        // summen
        // the same words as js/buch-en/numerik.js (book 1), whose widget flaeche shows them too
        'Rechtecke links': 'Left rectangles', 'Rechtecke rechts': 'Right rectangles', 'Rechtecke Mitte': 'Midpoint rectangles', 'Trapeze': 'Trapeziums',
        'Verfahren': 'Method', 'Anzahl der Streifen $n$': 'Number of strips $n$', 'Streifen unter einem Funktionsgraphen': 'Strips under the graph of a function',
        'Näherung': 'Approximation', 'Fehler': 'Error', 'Hier ist das Verfahren schon exakt.': 'Here the method is already exact.',
    },
    phrase: [
        // schaetzen
        [' Werte)', ' values)'], ['Stichprobe: ', 'Sample: '], ['Im Mittel über ', 'On average over '], [' Stichproben: $', ' samples: $'], ['(wahr: ', '(true: '],
        ['$s^2$ mit $\\tfrac{1}{n-1}$: $', '$s^2$ with $\\tfrac{1}{n-1}$: $'], ['$, mit $\\tfrac1n$: $', '$, with $\\tfrac1n$: $'],
        ['Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ', 'Dividing by $n$ comes out too low on average by the factor $\\tfrac{n-1}{n} = '],
        ['$ zu tief.', '$.'],
        ['Die Anlage füllt im Mittel $\\mu = ', 'On average the machine fills $\\mu = '], ['$ ml mit der Standardabweichung $\\sigma = ', '$ ml with the standard deviation $\\sigma = '],
        ['$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.', '$ ml. But the inspector does not know this: she estimates both from the sample.'],
        // summen: lower sum L_n and upper sum U_n in the English book (German U_n and O_n)
        ['Untersumme (grün) $U_{', 'Lower sum (green) $L_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · upper sum (red, on top) $U_{'], ['$ · Unterschied $', '$ · difference $'],
        ['Dazwischen liegt immer $', 'In between there is always $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. The more strips, the closer $L_n$ and $U_n$ move together; their common limit is the integral.'],
        ['Rechtecke links mit $n = ', 'Left rectangles with $n = '], ['Rechtecke rechts mit $n = ', 'Right rectangles with $n = '],
        ['Rechtecke Mitte mit $n = ', 'Midpoint rectangles with $n = '], ['Trapeze mit $n = ', 'Trapeziums with $n = '], ['$ · genauer Wert $', '$ · exact value $'], [' (ohne Stammfunktion, nur numerisch)', ' (no antiderivative, numerical only)'],
        ['Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $', 'Twice as many strips: the error gets smaller by about the factor $'], ['$ kleiner.', '$.'],
    ],
    rule: []
});
