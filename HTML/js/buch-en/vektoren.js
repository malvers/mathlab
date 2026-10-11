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
        // book 3 mathe13-en: geradenlage, ebene3d, pyramide
        'schneidend': 'intersecting', 'identisch': 'identical', 'windschief': 'skew',
        'Ebene und Normalenvektor': 'Plane and normal vector', 'Liegt der Punkt in E?': 'Does the point lie in E?', 'Gerade schneidet Ebene': 'Line meets plane',
        'Pyramide': 'Pyramid', 'Prisma (schief möglich)': 'Prism (may be oblique)', 'Körper': 'Solid', 'Grundkante $a$': 'Base edge $a$',
        'Höhe $h$': 'Height $h$', 'Verschiebung der Spitze in $x$': 'Shift of the apex in $x$',
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
        // book 3 mathe13-en: gerade3d
        ['Der Richtungsvektor darf nicht der Nullvektor sein.', 'The direction vector must not be the zero vector.'],
        ['Punktprobe für $Q(', 'Point test for $Q('], ['Alle Zeilen liefern $t = ', 'Every row gives $t = '], ['$, also <b>$Q \\in g$</b>.', '$, so <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'The rows give different values for $t$, so <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: ', 'Trace points: '], ['Spurpunkte: keine', 'Trace points: none'],
        // book 3 mathe13-en: geradenlage
        ['Richtungsvektoren dürfen nicht der Nullvektor sein.', 'Direction vectors must not be the zero vector.'],
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'The direction vectors are parallel ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'The point $Q$ lies on $g$: <b>identical</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'The point $Q$ does not lie on $g$: <b>parallel and distinct</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'Not parallel. Equating gives $t = '], ['$: <b>schneidend</b> im Punkt $S(', '$: <b>intersecting</b> at the point $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ',
            'Not parallel and the system of equations has no solution: <b>skew</b>. Shortest distance (red, dashed) $\\approx '],
        // book 3 mathe13-en: ebene3d
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.', '$\\vec{u}$ and $\\vec{v}$ are parallel, they do not span a plane.'],
        ['Normalenvektor $\\vec{n}', 'Normal vector $\\vec{n}'], ['$ · Koordinatenform: $', '$ · coordinate form: $'],
        ['Spurpunkte mit den Achsen: ', 'Trace points on the axes: '], ['Punktprobe: $', 'Point test: $'],
        ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ lies in $E$</b>.'], ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$: <b>$Q$ does not lie in $E$</b>. Distance $\\approx '],
        ['$: Die Gerade ist parallel zur Ebene ', '$: the line is parallel to the plane '], ['und liegt in ihr.', 'and lies in it.'],
        ['und schneidet sie nicht.', 'and does not meet it.'], ['Einsetzen von $g$ in $E$: $t = ', 'Substituting $g$ into $E$: $t = '],
        ['$, Schnittpunkt $S(', '$, point of intersection $S('], ['$ · Schnittwinkel: $', '$ · angle of intersection: $'],
        // book 3 mathe13-en: pyramide
        ['Grundfläche $G', 'Base area $G'], ['$, Spitze $S(', '$, apex $S('], ['$, Höhe $h = ', '$, height $h = '], ['$ (rot)', '$ (red)'],
        ['Volumen $V', 'Volume $V'], [' · Mantel (4 Dreiecke, je $', ' · lateral surface (4 triangles, each $'],
        [' · Mantel (4 Parallelogramme, je $', ' · lateral surface (4 parallelograms, each $'],
        ['Oberfläche $O = ', 'Surface area $O = '], [' (Prinzip von Cavalieri: auch schief)', " (Cavalieri's principle: oblique as well)"],
        [' · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.', ' · If you move the apex horizontally, the volume stays the same, the lateral surface does not.'],
        ['$, Verschiebung der Deckfläche $\\vec{w} = ', '$, shift of the top face $\\vec{w} = '],
    ],
    rule: [
        // the inputs: "Vektor a, x-Koordinate", "Punkt A, y-Koordinate"
        [/\b(Vektor|Punkt) ([^,]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vector ' : 'Point ') + n + ', ' + c + '-coordinate'],
        // book 3 mathe13-en: points in space S(1 \mid 2 \mid 3) → S(1, 2, 3), and the same in the coordinate inputs ( 1 | 2 | 3 )
        [/\((-?[\d.]+) \\mid (-?[\d.]+) \\mid (-?[\d.]+)\)/g, '($1, $2, $3)'], [/(<span class="vk-par">)\|(<\/span>)/g, '$1,$2'],
    ]
});
