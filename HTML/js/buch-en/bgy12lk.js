/* js/buch-en/bgy12lk.js — English for the widgets of js/buch-bgy12lk.js:
 *   titelbildbgy12lk, verteilungsfunktion (book mathe12lk-en)
 * Loaded by the English editions right after js/buch-bgy12lk.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('bgy12lk', {
    word: {
        // verteilungsfunktion
        'Drei Münzen': 'Three coins', 'Würfel': 'Dice', 'Glücksrad': 'Spinner', 'Zufallsgröße': 'Random variable',
        'Gesuchte Wahrscheinlichkeit': 'Probability wanted',
        'Wahrscheinlichkeitsfunktion als Stabdiagramm': 'Probability function as a bar chart',
        'Verteilungsfunktion als Treppenfunktion': 'Distribution function as a step function'
    },
    phrase: [
        // titelbildbgy12lk: the aria-label sits in a string piece that starts inside the <svg> tag, so it is a phrase, not a word
        ['Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt',
            'Cover picture: a distribution function as a staircase over its bars, a curve with the tangent that replaces it at the point of contact, and a triangular pyramid with its centroid'],
        // verteilungsfunktion: "$X$ = " + the name of the random variable + the sentence below
        ['Anzahl Wappen bei drei Münzwürfen', 'number of heads in three coin tosses'],
        ['Augenzahl eines Würfels', 'score of a dice'],
        ['Gewinn in € (Auszahlung minus 2 € Einsatz)', 'gain in € (payout minus the €2 stake)'],
        ['. Oben die Wahrscheinlichkeitsfunktion $x_i \\mapsto P(X = x_i)$, unten die Verteilungsfunktion $F(x) = P(X \\le x)$.',
            '. Above, the probability function $x_i \\mapsto P(X = x_i)$; below, the distribution function $F(x) = P(X \\le x)$.']
    ],
    rule: []
});
