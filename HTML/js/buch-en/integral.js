/* js/buch-en/integral.js — English for the widgets of js/buch-integral.js:
 *   titelbild13, stammfunktion, bestand, integral, zwischenflaeche (book 3, mathe13-en)
 * Loaded by the English editions right after js/buch-integral.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('integral', {
    word: {
        // titelbild13
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Cover picture: bell curve over the histogram of a test with its rejection region, a plane in space with normal vector and a line',
        // stammfunktion
        'Konstante $C$': 'Constant $C$', 'Schar von Stammfunktionen': 'Family of antiderivatives', 'Die Funktion f': 'The function f',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).':
            'Top: antiderivatives F + C (the chosen one bright). Drag the point. Bottom: f. The gradient of F at the point is exactly the function value f(x₀).',
        // bestand
        'Wassertank': 'Water tank', 'Autofahrt': 'Car journey', 'Zuflussrate in l/min': 'Rate of inflow in l/min', 'Wasser in l': 'Water in l',
        'Änderungsrate mit Fläche': 'Rate of change with area', 'Rekonstruierter Bestand': 'Reconstructed total', 'Zeit $t$': 'Time $t$',
        'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.':
            'Until $t = 6$ water flows in, after that it flows out (negative rate of change). The total is greatest at $t = 6$.',
        'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.': 'The area under the velocity graph is the distance travelled.',
        // integral
        'Bestimmtes Integral zwischen zwei Grenzen': 'Definite integral between two limits',
        // zwischenflaeche
        'Parabel und Gerade': 'Parabola and line', 'Kubik und Parabel': 'Cubic and parabola', 'Sinus und Kosinus': 'Sine and cosine',
        'Funktionen': 'Functions', 'Fläche zwischen zwei Graphen': 'Area between two graphs',
        'Zu wenige Schnittstellen im Bild.': 'Too few points of intersection in the picture.',
    },
    phrase: [
        // stammfunktion
        ['$ · Stammfunktionen $F(x) = ', '$ · antiderivatives $F(x) = '], [' + C$, denn $F\'(x) = f(x)$.', ' + C$, because $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'At $x_0 = '], ['$: Steigung von $F$ $= f(', '$: gradient of $F$ $= f('], ['$, egal welches $C$.', '$, whatever $C$ is.'],
        // bestand
        ['$ · Anfangsbestand $', '$ · initial amount $'], ['Bestand nach $t = ', 'Total after $t = '],
        // integral
        ['Teilstücke zwischen den Nullstellen: ', 'Pieces between the zeros: '],
        ['Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ', 'Area between the graph and the $x$-axis: $A \\approx '],
        [' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.', ' · The integral is smaller because areas below the axis (red) count as negative.'],
        [' · Achtung: $a > b$ dreht das Vorzeichen.', ' · Careful: $a > b$ reverses the sign.'],
        // zwischenflaeche
        ['$ · Schnittstellen: ', '$ · points of intersection: '],
    ],
    rule: []
});
