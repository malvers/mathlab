/* js/buch-en/geometrie.js — English for the widgets of js/buch-geometrie.js:
 *   titelbildgy9, pythagoras, trigo, kreisteil, vieleck, goldenerschnitt, spitzkoerper (book 11, mathegy9-en)
 * Loaded by the English editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('geometrie', {
    word: {
        // book 11 mathegy9-en: titelbildgy9
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Cover picture: a right-angled triangle with the squares on its sides, a golden rectangle with a spiral, a circle between two hexagons and a parabola',
        // book 11 mathegy9-en: pythagoras
        'Kathetensatz': 'Leg theorem', 'Höhensatz': 'Altitude theorem', 'Satz': 'Theorem', 'gleichschenklig': 'isosceles',
        'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.':
            'Drag the point $C$. It stays on the Thales circle over $\\overline{AB}$, so the angle at $C$ is always a right angle.',
        'Rechtwinkliges Dreieck mit Quadraten über den Seiten': 'Right-angled triangle with squares on its sides',
        'Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.':
            'Together the two squares on the legs have exactly the area of the square on the hypotenuse.',
        'Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.': 'Each square on a leg is as large as the rectangle below it.',
        'Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.':
            'The square on the height is as large as the rectangle made from the two segments of the hypotenuse.',
        // book 11 mathegy9-en: trigo
        'Sinus': 'Sine', 'Kosinus': 'Cosine', 'Tangens': 'Tangent', 'Verhältnis': 'Ratio', 'Winkel $\\alpha$': 'Angle $\\alpha$',
        'Gegenkathete a': 'opposite a', 'Ankathete b': 'adjacent b', 'Rechtwinkliges Dreieck mit Winkel alpha': 'Right-angled triangle with angle alpha',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Change $c$: the triangle becomes larger or smaller, but the three ratios stay the same. They depend only on the angle.',
        // book 11 mathegy9-en: kreisteil
        'Mittelpunktswinkel $\\alpha$': 'Angle at the centre $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Circle with a sector and an arc',
        'Kreisbogen': 'Arc', 'Kreisausschnitt': 'Sector',
        // book 11 mathegy9-en: vieleck
        'Ecken verdoppeln': 'Double the vertices', 'Zurück auf 6': 'Back to 6', 'Anzahl der Ecken $n$': 'Number of vertices $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Circle with inscribed and circumscribed polygon', 'innen': 'inside', 'außen': 'outside',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Circle with $r = 1$, so $u = 2\\pi$. Perimeter divided by $2$:',
        // book 11 mathegy9-en: goldenerschnitt
        'Strecke teilen': 'Divide a segment', 'Goldenes Rechteck': 'Golden rectangle', 'Pentagramm': 'Pentagram', 'Ansicht': 'View',
        'Golden teilen': 'Golden ratio', 'Quadrate abschneiden': 'Cut off squares',
        'Ganzes : größerer Teil': 'whole : larger part', 'größerer : kleinerer Teil': 'larger : smaller part',
        'Strecke AB mit Teilungspunkt T': 'Segment AB with dividing point T',
        'Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.':
            'Both ratios are equal: the golden ratio, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1.618$.',
        'Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.': 'Drag the point $T$ until the two ratios are equal.',
        'Goldenes Rechteck, in Quadrate zerlegt, mit Spirale': 'Golden rectangle cut into squares, with a spiral',
        'Regelmäßiges Fünfeck mit Pentagramm': 'Regular pentagon with pentagram', 'Seite': 'Side',
        'größerer Teil': 'larger part', 'kleinerer Teil': 'smaller part',
        // book 11 mathegy9-en: spitzkoerper
        'Quadratische Pyramide': 'Square pyramid', 'Kreiskegel': 'Cone', 'Körper': 'Solid', 'Seitenhöhe': 'Slant height', 'Seitenkante': 'Lateral edge',
        'Hilfsdreieck': 'Auxiliary triangle', 'Grundkante $a$': 'Base edge $a$', 'Höhe $h$': 'Height $h$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Square pyramid in oblique view with auxiliary triangle',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cone in oblique view with auxiliary triangle'
    },
    phrase: [
        // book 11 mathegy9-en: pythagoras
        ['$ und $', '$ and $'],
        // book 11 mathegy9-en: trigo
        ['\\text{Gegenkathete}', '\\text{opposite}'], ['\\text{Ankathete}', '\\text{adjacent}'], ['\\text{Hypotenuse}', '\\text{hypotenuse}'],
        // book 11 mathegy9-en: kreisteil
        ['Anteil am Vollkreis: $', 'Fraction of the full circle: $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $', 'Drag the end of the arc. For comparison, the whole circle: $'],
        // book 11 mathegy9-en: vieleck
        ['Also $', 'So $'], ['$, Abstand $', '$, difference $'],
        // book 11 mathegy9-en: goldenerschnitt
        ['$ · größerer Teil $', '$ · larger part $'], ['$ · kleinerer Teil $', '$ · smaller part $'],
        ['\\text{Ganzes}', '\\text{whole}'], ['\\text{größerer Teil}', '\\text{larger part}'], ['\\text{kleinerer Teil}', '\\text{smaller part}'],
        ['Seiten $', 'Sides $'],
        [' : 1$. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor $\\Phi$ verkleinert.',
            ' : 1$. If you cut off the square on the short side, a golden rectangle is left again, smaller by the factor $\\Phi$.'],
        ['\\,\\%$ so lang. Die Viertelkreise bilden die <b>goldene Spirale</b>.', '\\,\\%$ as long. The quarter circles form the <b>golden spiral</b>.'],
        [' $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $', ' $s$ and diagonal $d$ of the regular pentagon: $'],
        ['Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: ', 'Every diagonal is divided by another in the golden ratio: '],
        ['$= \\Phi$, und der größere Teil ist genau so lang wie die Seite.', '$= \\Phi$, and the larger part is exactly as long as the side.'],
        // book 11 mathegy9-en: spitzkoerper
        [' im Schrägbild mit Hilfsdreieck', ' in oblique view with auxiliary triangle']
    ],
    rule: [
        // book 11 mathegy9-en: goldenerschnitt "Nach 5 Schnitten ist die lange Seite nur noch $…$ so lang." (the pieces alone are in tools/buch-en/known.json)
        [/Nach (\d+) Schnitt(?:en)? ist die lange Seite nur noch \$/g, (m, n) => 'After ' + n + ' cut' + (+n > 1 ? 's' : '') + ' the long side is only $']
    ]
});
