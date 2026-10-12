/* js/buch-en/gy11lk-vek.js — English for the widgets of js/buch-gy11lk-vek.js:
 *   koordsys3d, linabh3d, varignon3d, ebenelim, ebenenlage (book 9, mathegy11lk-en, chapters 3.1–3.3)
 * Loaded by the English editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-en.js,
 * the 3D stage, the coordinate inputs and points S(1 \mid 2 \mid 3) → S(1, 2, 3) in js/buch-en/vektoren.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gy11lk-vek', {
    word: {
        // koordsys3d
        'Zylinderkoordinaten': 'Cylindrical coordinates', 'Kugelkoordinaten': 'Spherical coordinates', 'Welches Koordinatensystem?': 'Which coordinate system?',
        'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten': 'A point in space with its cylindrical or spherical coordinates',
        'Abstand $r$ zur $z$-Achse': 'Distance $r$ from the $z$-axis', 'Winkel $\\varphi$': 'Angle $\\varphi$', 'Höhe $z$': 'Height $z$',
        'Abstand $r$ zum Ursprung': 'Distance $r$ from the origin', 'Länge $\\varphi$': 'Longitude $\\varphi$', 'Breite $\\vartheta$': 'Latitude $\\vartheta$',
        // linabh3d
        'unabhängig': 'independent', 'komplanar': 'coplanar', 'zwei parallel': 'two parallel',
        'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen': 'Three vectors from the origin and the plane spanned by two of them',
        // varignon3d
        'eben': 'flat', 'räumlich': 'in space', 'nicht konvex': 'not convex',
        'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten': 'A quadrilateral in space with the parallelogram of the midpoints of its sides',
        // ebenelim
        'Koordinatenform': 'Coordinate form', 'Gerade und Ebene': 'Line and plane', 'keine': 'none',
        'Eine Ebene im Raum mit ihrem Spurdreieck': 'A plane in space with its trace triangle',
        // ebenenlage
        'Dach': 'Roof', 'Spurgerade': 'Trace line', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Two planes in space and their line of intersection',
    },
    phrase: [
        // koordsys3d
        ['Zylinderkoordinaten $(', 'Cylindrical coordinates $('], ['Kugelkoordinaten $(', 'Spherical coordinates $('], ['Kartesisch: $P(', 'Cartesian: $P('],
        ['Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.', 'All points with the same $r$ lie on the curved surface of a cylinder about the $z$-axis.'],
        [' mit der Länge $\\varphi$ und der Breite $\\vartheta$', ' with longitude $\\varphi$ and latitude $\\vartheta$'],
        ['Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.',
            'All points with the same $r$ lie on a sphere about the origin; on the Earth, $\\varphi$ and $\\vartheta$ are the geographical longitude and latitude.'],
        // linabh3d
        ['$ als Gleichungssystem: $', '$ as a system of equations: $'],
        ['Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.',
            'Gaussian elimination leads to the identity matrix: only $r = s = t = 0$ solves the system. The vectors are <b>linearly independent</b>; they do not lie in one plane.'],
        ['Das System hat auch Lösungen mit Zahlen, die nicht alle null sind', 'The system also has solutions with numbers that are not all zero'], [', denn $', ', because $'],
        ['. Die Vektoren sind <b>linear abhängig</b>: ', '. The vectors are <b>linearly dependent</b>: '],
        ['$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).', '$\\vec{c}$ lies in the plane of $\\vec{a}$ and $\\vec{b}$ (coplanar).'],
        ['$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).', '$\\vec{a}$ and $\\vec{b}$ are parallel (collinear).'],
        // varignon3d
        ['Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $',
            'Equal vectors: two opposite sides of the midpoint quadrilateral are parallel and of equal length, both half as long as the diagonal $AC$. Likewise $'],
        ['Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.', 'The corners $A$, $B$, $C$, $D$ lie in one plane.'],
        ['Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.', 'The corners do <b>not</b> lie in one plane: a quadrilateral in space.'],
        [' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.', ' Even so, the midpoint quadrilateral is always a plane <b>parallelogram</b>.'],
        // ebenelim
        ['$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.', '$\\vec{u}$ and $\\vec{v}$ are linearly dependent. They do not span a plane.'],
        ['Koordinatenweise: $', 'Coordinate by coordinate: $'], ['Die Zeilen mit ', 'Multiply the rows by '],
        [' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $', ' and add them. Then the parameters drop out: $r$ terms $'], ['$s$-Glieder $', '$s$ terms $'],
        ['Koordinatenform: ', 'Coordinate form: '], ['Koordinatenform $', 'Coordinate form $'], ['$. Einsetzen von $Q(', '$. Substituting $Q('],
        ['$: <b>$Q$ liegt nicht in $E$</b>.', '$: <b>$Q$ does not lie in $E$</b>.'],
        ['In der Parameterform gehört $Q$ zu $r = ', 'In the parametric form, $Q$ belongs to $r = '], ['$ und $s = ', '$ and $s = '],
        ['Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.', 'The direction vector $\\vec{w}$ must not be the zero vector.'],
        ['$ einsetzen: $', '$: $'],
        ['Immer wahr: <b>$g$ liegt in $E$</b>.', 'Always true: <b>$g$ lies in $E$</b>.'],
        ['Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.', 'A contradiction: <b>$g$ is parallel to $E$</b> and has no point in common with it.'],
        ['Genau eine Lösung $t = ', 'Exactly one solution $t = '], ['$: <b>Durchstoßpunkt $S(', '$: <b>point of intersection $S('],
        // ebenenlage, and the inputs of its rows "E₁: [a] x + [b] y + [c] z = [d]"
        ['Koeffizient von x', 'coefficient of x'], ['Koeffizient von y', 'coefficient of y'], ['Koeffizient von z', 'coefficient of z'], ['rechte Seite', 'right-hand side'],
        ['Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.', 'At least one coefficient of $x$, $y$, $z$ must be non-zero, otherwise it is not a plane.'],
        ['Die linke Seite von $E_2$ ist das ', 'The left-hand side of $E_2$ is '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' times the left-hand side of $E_1$. On the right: $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'Both equations are equivalent: <b>identical</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'The system has no solution: <b>parallel</b> and distinct.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $',
            'The left-hand sides are not multiples: the planes <b>intersect</b> in a line. Free variable $'],
        [' = t$, übrig bleibt für $', ' = t$; what remains for $'], ['Gelöst: $', 'Solved: $'], ['Schnittgerade: ', 'Line of intersection: '],
        ['. Ganzzahliger Richtungsvektor: $', '. Direction vector with whole numbers: $'],
    ],
    rule: [
        // koordsys3d: (r;\,\varphi;\,z) = (3;\,50^\circ;\,2.5) → (r,\,\varphi,\,z) = (3,\,50^\circ,\,2.5)
        [/\(([^()$;]+);\\,([^()$;]+);\\,([^()$;]+)\)/g, '($1,\\,$2,\\,$3)'],
        // ebenelim: "Die Zeilen mit 1, 2 und 3 multiplizieren" (the pieces do the rest)
        [/(Die Zeilen mit [^<$]*?) und /g, '$1 and '],
        // ebenelim: "$g\colon \vec{x} = …$ in $x + y = 2$ einsetzen: " → "Substitute $g\colon …$ into $x + y = 2$: "
        [/(\$g\\colon \\vec\{x\} = [^$]*\$) in (\$[^$]*\$) einsetzen: /g, 'Substitute $1 into $2: '],
        // ebenenlage: "übrig bleibt für $x$ und $y$"
        [/(übrig bleibt für \$[xyz]\$) und \$/g, '$1 and $'],
    ]
});
