/* js/buch-es/vektoren.js — Spanish for the widgets of js/buch-vektoren.js.
 * Loaded by the Spanish editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('vektoren', {
    word: {
        // book es-3 mathe13-es: the 3D stage, raum-hero
        'Räumliches Koordinatensystem': 'Sistema de coordenadas en el espacio', 'Ziehen zum Drehen': 'Arrastra para girar',
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Sistema de coordenadas en el espacio con un punto y su vector de posición',
        // book es-3 mathe13-es: geradenlage, ebene3d, pyramide
        'Beispiele:': 'Ejemplos:', 'schneidend': 'secantes', 'identisch': 'coincidentes', 'windschief': 'se cruzan',
        'Was wird gezeigt?': '¿Qué se muestra?', 'Parameter $t$': 'Parámetro $t$',
        'Ebene und Normalenvektor': 'Plano y vector normal', 'Liegt der Punkt in E?': '¿Está el punto en E?', 'Gerade schneidet Ebene': 'Recta que corta al plano',
        'Pyramide': 'Pirámide', 'Prisma (schief möglich)': 'Prisma (también oblicuo)', 'Körper': 'Cuerpo', 'Grundkante $a$': 'Arista de la base $a$',
        'Höhe $h$': 'Altura $h$', 'Verschiebung der Spitze in $x$': 'Desplazamiento del vértice en $x$',
        // book es-2 mathe12-es: the 3D stage, raum3d, skalarprodukt, viereck3d (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        'Punkte und Verbindungsvektor': 'Puntos y vector que los une',
        'Summe und Differenz': 'Suma y diferencia',
        'Vielfaches': 'Múltiplo',
        'Mittelpunkt M zeigen': 'Mostrar el punto medio M',
        'Summe oder Differenz': 'Suma o diferencia',
        'Faktor $r$': 'Factor $r$',
        'spitzer Winkel': 'ángulo agudo',
        'orthogonal': 'ortogonal',
        'stumpfer Winkel': 'ángulo obtuso',
        'Parallelogramm': 'Paralelogramo',
        'Rechteck': 'Rectángulo',
        'Raute': 'Rombo',
        'Quadrat': 'Cuadrado',
        'Trapez': 'Trapecio',

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)
        // kreuzprodukt (also for FOS 12, Lovelace 13.10.), lot3d, winkel3d
        'zwei Vektoren': 'dos vectores', 'Dachfläche': 'superficie del tejado', 'in der x-y-Ebene': 'en el plano x-y', 'Dreieck': 'Triángulo', 'Welche Fläche?': '¿Qué área?',
        'Punkt über E': 'Punto por encima de E', 'Ursprung': 'Origen', 'Punkt unter E': 'Punto por debajo de E', 'Punkt in E': 'Punto en E',
        'Spiegelpunkt P′ zeigen': 'Mostrar el punto simétrico P′', 'Konstante $d$ in $\\vec{n} \\circ \\vec{x} = d$': 'Constante $d$ en $\\vec{n} \\circ \\vec{x} = d$',
        'Gerade – Gerade': 'recta – recta', 'Gerade – Ebene': 'recta – plano', 'Ebene – Ebene': 'plano – plano', 'Welcher Winkel?': '¿Qué ángulo?',
        'spitz': 'agudo', 'stumpfe Vektoren': 'vectores con ángulo obtuso', 'senkrecht': 'perpendicular', 'schräg': 'oblicuo', 'Dach und Boden': 'tejado y suelo',

        // book es mathegy12lk-es (Turing)

        // book es mathefos12-es (Lovelace)
        // zentralprojektion
        'Abstand des Auges $a$': 'Distancia del ojo $a$', 'Fluchtlinien zeigen': 'Mostrar las líneas de fuga', 'Horizont': 'Horizonte',
        'Zieh den Fluchtpunkt V. Er liegt auf dem Horizont in Augenhöhe.': 'Arrastra el punto de fuga V. Está en el horizonte, a la altura de los ojos.',
        'Zentralprojektion eines Quaders und einer Pfostenreihe mit Fluchtpunkt': 'Proyección central de un ortoedro y de una hilera de postes con su punto de fuga',

    },
    phrase: [
        // book es-3 mathe13-es: gerade3d
        ['Der Richtungsvektor darf nicht der Nullvektor sein.', 'El vector director no puede ser el vector nulo.'],
        ['Punktprobe für $Q(', 'Prueba de pertenencia de $Q('], ['Alle Zeilen liefern $t = ', 'Todas las filas dan $t = '], ['$, also <b>$Q \\in g$</b>.', '$, así que <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'Las filas dan valores distintos de $t$, así que <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: keine', 'Puntos de traza: ninguno'], ['Spurpunkte: ', 'Puntos de traza: '],
        // book es-3 mathe13-es: geradenlage
        ['Richtungsvektoren dürfen nicht der Nullvektor sein.', 'Los vectores directores no pueden ser el vector nulo.'],
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'Los vectores directores son paralelos ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'El punto base $Q$ está en $g$: <b>coincidentes</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'El punto base $Q$ no está en $g$: <b>paralelas y distintas</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'No son paralelas. Igualando se obtiene $t = '], ['$: <b>schneidend</b> im Punkt $S(', '$: <b>secantes</b> en el punto $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ',
            'No son paralelas y el sistema de ecuaciones no tiene solución: <b>se cruzan</b>. Distancia mínima (rojo discontinuo) $\\approx '],
        // book es-3 mathe13-es: ebene3d
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.', '$\\vec{u}$ y $\\vec{v}$ son paralelos, no generan un plano.'],
        ['Normalenvektor $\\vec{n}', 'Vector normal $\\vec{n}'], ['$ · Koordinatenform: $', '$ · ecuación general: $'],
        ['Spurpunkte mit den Achsen: ', 'Puntos de traza con los ejes: '], ['Punktprobe: $', 'Prueba de pertenencia: $'],
        ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ está en $E$</b>.'], ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$: <b>$Q$ no está en $E$</b>. Distancia $\\approx '],
        ['$: Die Gerade ist parallel zur Ebene ', '$: la recta es paralela al plano '], ['und liegt in ihr.', 'y está contenida en él.'],
        ['und schneidet sie nicht.', 'y no lo corta.'], ['Einsetzen von $g$ in $E$: $t = ', 'Sustituyendo $g$ en $E$: $t = '],
        ['$, Schnittpunkt $S(', '$, punto de intersección $S('], ['$ · Schnittwinkel: $', '$ · ángulo de intersección: $'],
        // book es-3 mathe13-es: pyramide
        ['Grundfläche $G', 'Área de la base $G'], ['$, Spitze $S(', '$, vértice $S('], ['$, Höhe $h = ', '$, altura $h = '], ['$ (rot)', '$ (rojo)'],
        ['Volumen $V', 'Volumen $V'], [' · Mantel (4 Dreiecke, je $', ' · superficie lateral (4 triángulos, cada uno $'],
        [' · Mantel (4 Parallelogramme, je $', ' · superficie lateral (4 paralelogramos, cada uno $'],
        ['Oberfläche $O = ', 'Área total $O = '], [' (Prinzip von Cavalieri: auch schief)', ' (principio de Cavalieri: también oblicuo)'],
        [' · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.', ' · Si desplazas el vértice en horizontal, el volumen no cambia, la superficie lateral sí.'],
        ['$, Verschiebung der Deckfläche $\\vec{w} = ', '$, desplazamiento de la cara superior $\\vec{w} = '],
        // book es-2 mathe12-es: the 3D stage, raum3d, skalarprodukt, viereck3d (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        ['Mittelpunkt M zeigen', 'Mostrar el punto medio M'],
        ['Ortsvektoren $', 'Vectores de posición $'],
        ['$ · Verbindungsvektor $', '$ · vector que une los puntos $'],
        ['Länge: $', 'Longitud: $'],
        ['Mittelpunkt: $', 'Punto medio: $'],
        ['$, also $', '$, es decir, $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Restar significa: añadir el vector opuesto $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.', 'Sumar significa: colocar $\\vec{b}$ en el extremo de $\\vec{a}$. La suma es la diagonal del paralelogramo.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Un factor negativo invierte el sentido.'],
        ['Mit $r = 0$ entsteht der Nullvektor.', 'Con $r = 0$ se obtiene el vector nulo.'],
        [' Die Länge wird mit $|r| = ', ' La longitud se multiplica por $|r| = '],
        ['$ multipliziert: $', '$: $'],
        ['<b>orthogonal</b>', '<b>ortogonales</b>'],
        [' (stumpf: das Skalarprodukt ist negativ)', ' (obtuso: el producto escalar es negativo)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (agudo: el producto escalar es positivo)'],
        [' (parallel, gleiche Richtung)', ' (paralelos, mismo sentido)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Con el vector nulo no hay ángulo.'],
        ['$ABCD$ ist kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', '$ABCD$ no es un cuadrilátero plano: los cuatro puntos no están en un mismo plano.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'no es un cuadrilátero plano: los cuatro puntos no están en un mismo plano.'],
        ['ein <b>Quadrat</b>', 'un <b>cuadrado</b>'],
        ['ein <b>Rechteck</b>', 'un <b>rectángulo</b>'],
        ['eine <b>Raute</b>', 'un <b>rombo</b>'],
        ['ein <b>Parallelogramm</b>', 'un <b>paralelogramo</b>'],
        ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'un <b>trapecio</b> (un par de lados paralelos)'],
        ['ein allgemeines Viereck', 'un cuadrilátero cualquiera'],
        ['$: gegenüberliegende Seiten parallel und gleich lang', '$: lados opuestos paralelos y de igual longitud'],
        ['$: rechter Winkel bei $A$', '$: ángulo recto en $A$'],
        ['$: benachbarte Seiten gleich lang', '$: lados contiguos de igual longitud'],
        ['$: Diagonalen senkrecht zueinander', '$: diagonales perpendiculares entre sí'],
        ['$ und $|', '$ y $|'],
        ['$ABCD$ ist ', '$ABCD$ es '],

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)
        // kreuzprodukt
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel: Das Vektorprodukt ist der Nullvektor, sie spannen keine Fläche auf.',
            '$\\vec{u}$ y $\\vec{v}$ son paralelos: el producto vectorial es el vector nulo y no generan ningún área.'],
        ['$: Das Vektorprodukt steht senkrecht auf beiden Vektoren', '$: el producto vectorial es perpendicular a los dos vectores'],
        [' (im Bild verkürzt gezeichnet)', ' (en la figura, dibujado más corto)'], ['Dreieck: $A = ', 'Triángulo: $A = '], ['Parallelogramm: $A = ', 'Paralelogramo: $A = '],
        [' Flächeneinheiten', ' unidades de área'], ['$ und $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = ', '$ y $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = '],
        // lot3d
        ['Der Normalenvektor darf nicht der Nullvektor sein.', 'El vector normal no puede ser el vector nulo.'],
        ['$ · Lotgerade $l\\colon', '$ · recta perpendicular $l\\colon'], ['$l$ in $E$ einsetzen: $', 'Sustituir $l$ en $E$: $'], ['$ · Lotfußpunkt $F(', '$ · pie de la perpendicular $F('],
        ['$t = 0$: Der Punkt $P$ liegt selbst in der Ebene, sein Abstand ist $0$.', '$t = 0$: el propio punto $P$ está en el plano; su distancia es $0$.'],
        ['Abstand: $|', 'Distancia: $|'], ['$ · ohne Lotfußpunkt: $', '$ · sin el pie de la perpendicular: $'],
        ['Spiegelpunkt: $t$ verdoppeln, $', 'Punto simétrico: duplicar $t$, $'], ['$, also $P\'(', '$, es decir, $P\'('],
        // winkel3d
        ['Der Nullvektor hat keine Richtung, er liefert keinen Winkel.', 'El vector nulo no tiene dirección; no da ningún ángulo.'],
        ['$, also $\\varphi \\approx ', '$, es decir, $\\varphi \\approx '],
        ['Die Richtungsvektoren sind parallel: Die Geraden sind parallel oder identisch, sie schneiden sich nicht unter einem Winkel.',
            'Los vectores directores son paralelos: las rectas son paralelas o coincidentes y no se cortan formando un ángulo.'],
        ['Die Vektoren selbst schließen $', 'Los propios vectores forman $'],
        ['$ ein, also einen stumpfen Winkel. Die Geraden bilden den spitzen Nebenwinkel $180^\\circ - ', '$, es decir, un ángulo obtuso. Las rectas forman el ángulo agudo suplementario $180^\\circ - '],
        ['$; dafür steht der Betrag im Zähler.', '$; para eso está el valor absoluto en el numerador.'],
        ['Das Skalarprodukt ist $0$: Die Geraden schneiden sich senkrecht.', 'El producto escalar es $0$: las rectas se cortan perpendicularmente.'],
        ['Das Skalarprodukt ist positiv, der Winkel zwischen den Vektoren ist schon spitz.', 'El producto escalar es positivo: el ángulo entre los vectores ya es agudo.'],
        ['Winkel zwischen $\\vec{u}$ und dem Normalenvektor: $\\cos\\alpha = ', 'Ángulo entre $\\vec{u}$ y el vector normal: $\\cos\\alpha = '],
        ['Der Winkel zur Ebene ergänzt ihn zu $90^\\circ$: $', 'El ángulo con el plano es su complementario hasta $90^\\circ$: $'],
        ['. Das Skalarprodukt ist $0$: $g$ ist parallel zu $E$ oder liegt in $E$.', '. El producto escalar es $0$: $g$ es paralela a $E$ o está contenida en $E$.'],
        ['. $\\vec{u}$ ist ein Vielfaches von $\\vec{n}$: $g$ steht senkrecht auf $E$.', '. $\\vec{u}$ es múltiplo de $\\vec{n}$: $g$ es perpendicular a $E$.'],
        ['. Gelb gestrichelt: die Projektion von $g$ in die Ebene.', '. En amarillo discontinuo: la proyección de $g$ sobre el plano.'],
        ['Die Normalenvektoren sind parallel: Die Ebenen sind parallel oder identisch.', 'Los vectores normales son paralelos: los planos son paralelos o coincidentes.'],
        ['Weiß: die Schnittgerade $s$ mit dem Richtungsvektor $', 'En blanco: la recta de intersección $s$ con el vector director $'],
        ['$. Gemessen wird der Winkel senkrecht zu ihr, zwischen den beiden farbigen Linien in den Ebenen.', '$. El ángulo se mide perpendicularmente a ella, entre las dos líneas de color de los planos.'],
        ['Probe: $(\\vec{u} \\times \\vec{v}) \\circ \\vec{u} = ', 'Comprobación: $(\\vec{u} \\times \\vec{v}) \\circ \\vec{u} = '],

        // book es mathegy12lk-es (Turing)

        // book es mathefos12-es (Lovelace)
        // zentralprojektion
        ['Fluchtpunkt $V(', 'Punto de fuga $V('], [')$ · Bildebene vor dem Quader, Auge im Abstand $a = ', ')$ · plano del cuadro delante del ortoedro, ojo a la distancia $a = '],
        ['$ davor', '$ delante de él'],
        ['Alle Kanten, die in die Tiefe laufen, treffen sich in $V$. Kanten parallel zur Bildebene bleiben parallel und behalten ihr Verhältnis.',
            'Todas las aristas que van hacia el fondo se encuentran en $V$. Las aristas paralelas al plano del cuadro siguen siendo paralelas y conservan su proporción.'],
        ['Ein Pfosten in der Tiefe $z$ erscheint mit dem Faktor $\\dfrac{a}{a + z}$: bei $z = 8$ also $\\dfrac{', 'Un poste a la profundidad $z$ aparece con el factor $\\dfrac{a}{a + z}$: con $z = 8$, $\\dfrac{'],
        ['$ so hoch wie vorn.', '$ veces la altura que tendría delante.'],

    ],
    rule: [
        // book es-3 mathe13-es: the inputs "Vektor a, x-Koordinate" → "Vector a, coordenada x"; between the coordinate inputs
        // a semicolon, because an input may hold a decimal comma: ( 1 ; 2 ; 3 )
        [/\b(Vektor|Punkt) ([^,"]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vector ' : 'Punto ') + n + ', coordenada ' + c],
        [/(<span class="vk-par">)\|(<\/span>)/g, '$1;$2'],
        // geradenlage: the preset "parallel" means two lines (paralelas); a global word would also hit the vectors of other books
        [/(data-p="par">)parallel</g, '$1paralelas<'],
        // book es-2 mathe12-es: the 3D stage, raum3d, skalarprodukt, viereck3d (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        // skalarprodukt: the preset "parallel" means two vectors (paralelos), next to the rule of geradenlage above
        [/(data-p="para">)parallel</g, '$1paralelos<'],

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)
        // the preset "parallel" of the other widgets, next to the two rules of es-2 above (no global word: a whole label would be
        // parked by the engine before the rules and the rules would not see it): winkel3d line and plane (paralelos),
        // abstand3d two lines (paralelas), ebenenlage two planes (paralelos; the rule of geradenlage above has already made it paralelas)
        [/(data-p="flach">)parallel</g, '$1paralelos<'], [/(data-p="c">)parallel</g, '$1paralelas<'],
        [/(data-p="spur">[^<]*<\/button><button type="button" class="b-btn" data-p="par">)paralelas</g, '$1paralelos<'],

        // book es mathegy12lk-es (Turing)

        // book es mathefos12-es (Lovelace)

    ]
});
