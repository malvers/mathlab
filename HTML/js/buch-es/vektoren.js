/* js/buch-es/vektoren.js — Spanish for the widgets of js/buch-vektoren.js.
 * Loaded by the Spanish editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Points in space (1 \mid 2 \mid 3) → (1, 2, 3) are done by the point rules of js/buch-es.js.
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('vektoren', {
    word: {
        // book es-2 mathe12-es: the 3D stage, raum-hero, raum3d, skalarprodukt, viereck3d
        'Räumliches Koordinatensystem': 'Sistema de coordenadas en el espacio', 'Ziehen zum Drehen': 'Arrastra para girar',
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Sistema de coordenadas en el espacio con un punto y su vector de posición',
        'Punkte und Verbindungsvektor': 'Puntos y vector que los une', 'Summe und Differenz': 'Suma y diferencia', 'Vielfaches': 'Múltiplo',
        'Was wird gezeigt?': '¿Qué se muestra?', 'Mittelpunkt M zeigen': 'Mostrar el punto medio M', 'Summe oder Differenz': 'Suma o diferencia',
        'Faktor $r$': 'Factor $r$',
        'Beispiele:': 'Ejemplos:', 'spitzer Winkel': 'ángulo agudo', 'orthogonal': 'ortogonal', 'stumpfer Winkel': 'ángulo obtuso', 'parallel': 'paralelos',
        'Parallelogramm': 'Paralelogramo', 'Rechteck': 'Rectángulo', 'Raute': 'Rombo', 'Quadrat': 'Cuadrado', 'Trapez': 'Trapecio',
    },
    phrase: [
        // book es-2 mathe12-es: raum3d
        ['Mittelpunkt M zeigen', 'Mostrar el punto medio M'], ['Ortsvektoren $', 'Vectores de posición $'], ['$ · Verbindungsvektor $', '$ · vector que une los puntos $'],
        ['Länge: $', 'Longitud: $'], ['Mittelpunkt: $', 'Punto medio: $'], ['$, also $', '$, es decir, $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Restar significa: añadir el vector opuesto $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Sumar significa: colocar $\\vec{b}$ en el extremo de $\\vec{a}$. La suma es la diagonal del paralelogramo.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Un factor negativo invierte el sentido.'], ['Mit $r = 0$ entsteht der Nullvektor.', 'Con $r = 0$ se obtiene el vector nulo.'],
        [' Die Länge wird mit $|r| = ', ' La longitud se multiplica por $|r| = '], ['$ multipliziert: $', '$: $'],
        // book es-2 mathe12-es: skalarprodukt
        ['<b>orthogonal</b>', '<b>ortogonales</b>'],
        [' (stumpf: das Skalarprodukt ist negativ)', ' (obtuso: el producto escalar es negativo)'], [' (spitz: das Skalarprodukt ist positiv)', ' (agudo: el producto escalar es positivo)'],
        [' (parallel, gleiche Richtung)', ' (paralelos, mismo sentido)'], ['Mit dem Nullvektor gibt es keinen Winkel.', 'Con el vector nulo no hay ángulo.'],
        // book es-2 mathe12-es: viereck3d ("$ABCD$ ist " + kind; the negative one needs its own word order)
        ['$ABCD$ ist kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', '$ABCD$ no es un cuadrilátero plano: los cuatro puntos no están en un mismo plano.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'no es un cuadrilátero plano: los cuatro puntos no están en un mismo plano.'],
        ['ein <b>Quadrat</b>', 'un <b>cuadrado</b>'], ['ein <b>Rechteck</b>', 'un <b>rectángulo</b>'], ['eine <b>Raute</b>', 'un <b>rombo</b>'],
        ['ein <b>Parallelogramm</b>', 'un <b>paralelogramo</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'un <b>trapecio</b> (un par de lados paralelos)'],
        ['ein allgemeines Viereck', 'un cuadrilátero cualquiera'],
        ['$: gegenüberliegende Seiten parallel und gleich lang', '$: lados opuestos paralelos y de igual longitud'], ['$: rechter Winkel bei $A$', '$: ángulo recto en $A$'],
        ['$: benachbarte Seiten gleich lang', '$: lados contiguos de igual longitud'], ['$: Diagonalen senkrecht zueinander', '$: diagonales perpendiculares entre sí'],
        ['$ und $|', '$ y $|'], ['$ABCD$ ist ', '$ABCD$ es '],
    ],
    rule: [
        // book es-2 mathe12-es: the coordinate inputs, aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/\b(Vektor|Punkt) ([^,"<]+), ([xyz])-Koordinate\b/g, (m, k, n, c) => (k === 'Vektor' ? 'Vector ' : 'Punto ') + n + ', coordenada ' + c],
        // and their separator "( 2 | 1 | 3 )" → "( 2, 1, 3 )" (only inside this span class, never on bare digits)
        [/(<span class="vk-par">)\|(<\/span>)/g, '$1,$2'],
    ]
});
