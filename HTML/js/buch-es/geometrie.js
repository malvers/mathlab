/* js/buch-es/geometrie.js — Spanish for the widgets of js/buch-geometrie.js.
 * Loaded by the Spanish editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('geometrie', {
    word: {
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)
        // spitzkoerper
        'Quadratische Pyramide': 'Pirámide cuadrangular', 'Kreiskegel': 'Cono', 'Körper': 'Cuerpo', 'Seitenhöhe': 'Apotema', 'Seitenkante': 'Arista lateral',
        'Hilfsdreieck': 'Triángulo auxiliar', 'Grundkante $a$': 'Arista de la base $a$', 'Höhe $h$': 'Altura $h$', 'Radius $r$': 'Radio $r$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Pirámide cuadrangular en perspectiva caballera con triángulo auxiliar',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cono en perspectiva caballera con triángulo auxiliar',
        // trigo
        'Sinus': 'Seno', 'Kosinus': 'Coseno', 'Tangens': 'Tangente', 'Verhältnis': 'Razón', 'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Hypotenuse $c$': 'Hipotenusa $c$',
        'Gegenkathete a': 'cateto opuesto a', 'Ankathete b': 'cateto contiguo b', 'Hypotenuse c': 'hipotenusa c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triángulo rectángulo con el ángulo alfa',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Cambia $c$: el triángulo se hace más grande o más pequeño, pero las tres razones no cambian. Solo dependen del ángulo.',
        // vieleck
        'Ecken verdoppeln': 'Duplicar los vértices', 'Zurück auf 6': 'Volver a 6', 'Anzahl der Ecken $n$': 'Número de vértices $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Circunferencia con un polígono inscrito y otro circunscrito', 'innen': 'inscrito', 'außen': 'circunscrito',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Circunferencia con $r = 1$, por tanto $u = 2\\pi$. Perímetro dividido entre $2$:',

        // book es mathegy9-es (Curie)
        // goldenerschnitt
        'Ansicht': 'Vista',
        'Strecke teilen': 'Dividir el segmento', 'Goldenes Rechteck': 'Rectángulo áureo', 'Pentagramm': 'Pentagrama',
        'Golden teilen': 'Proporción áurea', 'Quadrate abschneiden': 'Cortar cuadrados',
        'Ganzes : größerer Teil': 'todo : parte mayor', 'größerer : kleinerer Teil': 'parte mayor : parte menor',
        'Strecke AB mit Teilungspunkt T': 'Segmento AB con el punto de división T',
        'Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.':
            'Las dos razones son iguales: proporción áurea, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.',
        'Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.': 'Arrastra el punto $T$ hasta que las dos razones sean iguales.',
        'Goldenes Rechteck, in Quadrate zerlegt, mit Spirale': 'Rectángulo áureo dividido en cuadrados, con una espiral',
        'Regelmäßiges Fünfeck mit Pentagramm': 'Pentágono regular con pentagrama', 'Seite': 'Lado',
        'größerer Teil': 'parte mayor', 'kleinerer Teil': 'parte menor',
        // pythagoras
        'Pythagoras': 'Pitágoras', 'Kathetensatz': 'Teorema del cateto', 'Höhensatz': 'Teorema de la altura', 'Satz': 'Teorema', 'gleichschenklig': 'isósceles',
        'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.':
            'Arrastra el punto $C$. Se queda sobre la circunferencia de Tales de $\\overline{AB}$; por eso el ángulo en $C$ siempre es recto.',
        'Rechtwinkliges Dreieck mit Quadraten über den Seiten': 'Triángulo rectángulo con cuadrados sobre los lados',
        'Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.':
            'Los dos cuadrados de los catetos tienen juntos exactamente el área del cuadrado de la hipotenusa.',
        'Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.': 'Cada cuadrado de un cateto es igual al rectángulo que tiene debajo.',
        'Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.': 'El cuadrado de la altura es igual al rectángulo formado por las dos proyecciones.',
        // kreisteil
        'Mittelpunktswinkel $\\alpha$': 'Ángulo central $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Círculo con un sector circular y un arco',
        'Kreisbogen': 'Arco', 'Kreisausschnitt': 'Sector circular',
        // titelbildgy9
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Portada: un triángulo rectángulo con los cuadrados sobre sus lados, un rectángulo áureo con espiral, una circunferencia entre dos hexágonos y una parábola',

    },
    phrase: [
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)
        // spitzkoerper
        [' im Schrägbild mit Hilfsdreieck', ' en perspectiva caballera con triángulo auxiliar'],
        // trigo
        ['\\text{Gegenkathete}', '\\text{cateto opuesto}'], ['\\text{Ankathete}', '\\text{cateto contiguo}'], ['\\text{Hypotenuse}', '\\text{hipotenusa}'],
        // vieleck
        ['Also $', 'Por tanto $'], ['$, Abstand $', '$, diferencia $'],

        // book es mathegy9-es (Curie)
        // goldenerschnitt
        ['$ · größerer Teil $', '$ · parte mayor $'], ['$ · kleinerer Teil $', '$ · parte menor $'],
        ['\\text{Ganzes}', '\\text{todo}'], ['\\text{größerer Teil}', '\\text{parte mayor}'], ['\\text{kleinerer Teil}', '\\text{parte menor}'],
        ['Seiten $', 'Lados $'],
        [' : 1$. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor $\\Phi$ verkleinert.',
            ' : 1$. Si se corta el cuadrado sobre el lado corto, queda otra vez un rectángulo áureo, reducido por el factor $\\Phi$.'],
        ['\\,\\%$ so lang. Die Viertelkreise bilden die <b>goldene Spirale</b>.', '\\,\\%$ de su longitud inicial. Los cuartos de circunferencia forman la <b>espiral áurea</b>.'],
        [' $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $', ' $s$ y diagonal $d$ del pentágono regular: $'],
        ['Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: ', 'Cada diagonal queda dividida por otra en la proporción áurea: '],
        ['$= \\Phi$, und der größere Teil ist genau so lang wie die Seite.', '$= \\Phi$, y la parte mayor mide exactamente lo mismo que el lado.'],
        // pythagoras
        ['$ und $', '$ y $'],
        // kreisteil
        ['Anteil am Vollkreis: $', 'Fracción del círculo completo: $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $', 'Arrastra el extremo del arco. Para comparar, el círculo entero: $'],

    ],
    rule: [
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)

        // book es mathegy9-es (Curie)
        // goldenerschnitt "Nach 5 Schnitten ist die lange Seite nur noch $…$ so lang."
        [/Nach (\d+) Schnitt(?:en)? ist die lange Seite nur noch \$/g, (m, n) => 'Después de ' + n + (+n > 1 ? ' cortes' : ' corte') + ', el lado largo solo mide el $'],

    ]
});
