/* js/buch-en/vektoren.js — English for the widgets of js/buch-vektoren.js:
 *   raum-hero, raum3d, skalarprodukt, viereck3d (book 2, mathe12-en) and the shared 3D stage
 * Loaded by the English editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('vektoren', {
    word: {
        // the 3D stage, raum-hero
        'Räumliches Koordinatensystem': 'Three-dimensional coordinate system', 'Ziehen zum Drehen': 'Drag to turn',
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Three-dimensional coordinate system with a point and its position vector',
        // raum3d
        'Punkte und Verbindungsvektor': 'Points and connecting vector', 'Summe und Differenz': 'Sum and difference', 'Vielfaches': 'Multiple',
        'Was wird gezeigt?': 'What is shown?', 'Mittelpunkt M zeigen': 'Show midpoint M', 'Summe oder Differenz': 'Sum or difference', 'Faktor $r$': 'Factor $r$',
        // skalarprodukt, viereck3d
        'Beispiele:': 'Examples:', 'spitzer Winkel': 'acute angle', 'orthogonal': 'orthogonal', 'stumpfer Winkel': 'obtuse angle', 'parallel': 'parallel',
        'Parallelogramm': 'Parallelogram', 'Rechteck': 'Rectangle', 'Raute': 'Rhombus', 'Quadrat': 'Square', 'Trapez': 'Trapezium',
    },
    phrase: [
        // raum3d
        ['Ortsvektoren $', 'Position vectors $'], ['Länge: $', 'Length: $'], ['Mittelpunkt: $', 'Midpoint: $'], ['$, also $', '$, so $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Subtracting means: attaching the opposite vector $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Adding means: attaching $\\vec{b}$ to the tip of $\\vec{a}$. The sum is the diagonal of the parallelogram.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'A negative factor reverses the direction.'], ['Mit $r = 0$ entsteht der Nullvektor.', 'With $r = 0$ you get the zero vector.'],
        [' Die Länge wird mit $|r| = ', ' The length is multiplied by $|r| = '], ['$ multipliziert: $', '$: $'],
        // skalarprodukt
        [' (stumpf: das Skalarprodukt ist negativ)', ' (obtuse: the scalar product is negative)'], [' (spitz: das Skalarprodukt ist positiv)', ' (acute: the scalar product is positive)'],
        [' (parallel, gleiche Richtung)', ' (parallel, same direction)'], ['Mit dem Nullvektor gibt es keinen Winkel.', 'There is no angle with the zero vector.'],
        // viereck3d
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'not a plane quadrilateral: the four points do not lie in one plane.'],
        ['ein <b>Quadrat</b>', 'a <b>square</b>'], ['ein <b>Rechteck</b>', 'a <b>rectangle</b>'], ['eine <b>Raute</b>', 'a <b>rhombus</b>'],
        ['ein <b>Parallelogramm</b>', 'a <b>parallelogram</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'a <b>trapezium</b> (one pair of parallel sides)'],
        ['ein allgemeines Viereck', 'a general quadrilateral'],
        ['$: gegenüberliegende Seiten parallel und gleich lang', '$: opposite sides parallel and of equal length'], ['$: rechter Winkel bei $A$', '$: right angle at $A$'],
        ['$: benachbarte Seiten gleich lang', '$: adjacent sides of equal length'], ['$: Diagonalen senkrecht zueinander', '$: diagonals perpendicular to each other'],
        ['$ und $|', '$ and $|'], ['$ABCD$ ist ', '$ABCD$ is '],
    ],
    rule: [
        // the inputs: "Vektor a, x-Koordinate", "Punkt A, y-Koordinate"
        [/\b(Vektor|Punkt) ([^,]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vector ' : 'Point ') + n + ', ' + c + '-coordinate'],
    ]
});
