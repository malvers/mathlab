/* js/buch-es/trigonometrie.js — Spanish for the widgets of js/buch-trigonometrie.js.
 * Loaded by the Spanish editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('trigonometrie', {
    word: {
        // book es mathe10-es (Curie)
        // dreieck-hero, Geo
        'Geometrische Figur': 'Figura geométrica', 'Dreieck': 'Triángulo',
        // messkurve
        'Ebbe und Flut': 'Mareas', 'Riesenrad': 'Noria', 'EKG': 'ECG', 'Sonnenflecken': 'Manchas solares', 'Messreihe': 'Serie de medidas',
        'Marker auf zwei Hochpunkte': 'Marcadores en dos máximos', 'Messkurve mit zwei verschiebbaren Markern': 'Curva de medidas con dos marcadores móviles',
        't in h': 't en h', 't in min': 't en min', 't in s': 't en s',
        'Wasserstand in m': 'Nivel del agua en m', 'Höhe in m': 'Altura en m', 'Spannung in mV': 'Tensión en mV', 'Jahr': 'Año', 'Fleckenzahl': 'Número de manchas',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).':
            'Nivel del agua en un mareógrafo del mar del Norte, respecto al nivel medio (valores simplificados).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Altura de una cabina sobre el suelo: la noria tiene 50 m de diámetro, el eje está a 27 m de altura y una vuelta dura 20 minutos.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'Un electrocardiograma registra la tensión eléctrica del corazón (curva simplificada). Es periódica, pero no es una sinusoide.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Media mensual de las manchas solares como modelo suavizado con el ciclo de unos 11 años (valores simplificados, no la serie de medidas).',
        'Mittellage': 'nivel medio',
        // sinussatz
        'Höhe $h_c$': 'Altura $h_c$', 'Umkreis': 'Circunferencia circunscrita', 'Hilfslinie': 'Línea auxiliar', 'Dreieck mit verschiebbaren Ecken': 'Triángulo con vértices móviles',
        // kosinussatz
        'Dreieck mit Quadraten über den drei Seiten': 'Triángulo con cuadrados sobre los tres lados',
        // dreieckloeser: S = lado, W = ángulo
        'SSS': 'LLL', 'SWS': 'LAL', 'WSW': 'ALA', 'SSW': 'LLA', 'Gegeben': 'Datos', 'Das berechnete Dreieck': 'El triángulo calculado',
        'Kosinussatz': 'Teorema del coseno', 'Sinussatz': 'Teorema del seno', 'Winkelsumme': 'Suma de ángulos',
        'KOSINUSSATZ': 'TEOREMA DEL COSENO', 'SINUSSATZ': 'TEOREMA DEL SENO', 'WINKELSUMME': 'SUMA DE ÁNGULOS',
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$', 'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Winkel $\\beta$': 'Ángulo $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Ángulo $\\alpha$ (opuesto a $a$)',
        'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).':
            'No hay triángulo: cada lado tiene que ser más corto que los otros dos juntos (desigualdad triangular).',
        '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>':
            '$\\sin\\beta > 1$ es imposible: el lado $a$ es demasiado corto y ni siquiera llega a la otra semirrecta del ángulo. <b>No hay triángulo.</b>',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'ángulo comprendido $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triángulo a partir de dos lados y el ángulo comprendido',

        // book es mathegy10-es (Lovelace)
        // titelbildgy10
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Portada: una onda senoidal, una curva exponencial, un triángulo cualquiera con su circunferencia circunscrita y una sucesión que se acerca a su límite',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Circunferencia unidad con la recta tangente en el punto 1', 'Graph der Tangensfunktion mit Polstellen': 'Gráfica de la función tangente con polos',
        // pyramidekegel
        'Quadratische Pyramide': 'Pirámide cuadrangular', 'Kegel': 'Cono', 'Körper': 'Cuerpo', 'Höhe – Seitenhöhe': 'Altura – apotema', 'Höhe – Seitenkante': 'Altura – arista lateral',
        'Höhe – Mantellinie': 'Altura – generatriz', 'Rechtwinkliges Dreieck': 'Triángulo rectángulo', 'Grundkante $a$': 'Arista de la base $a$', 'Radius $r$': 'Radio $r$', 'Höhe $h$': 'Altura $h$',

    },
    phrase: [
        // book es mathe10-es (Curie)
        // messkurve
        ['Abstand der Marker: <b>$', 'Distancia entre los marcadores: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Si los dos marcadores están en máximos contiguos, esa distancia es el <b>período</b>.'],
        ['Größter Wert $', 'Valor máximo $'], ['$, kleinster Wert $', '$, valor mínimo $'], [' · Amplitude $', ' · Amplitud $'],
        // sinussatz
        ['Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\sin\\alpha = ', 'La altura por dos caminos: $h_c = b \\cdot \\sin\\alpha = '],
        ['$ und $h_c = a \\cdot \\sin\\beta \\approx ', '$ y $h_c = a \\cdot \\sin\\beta \\approx '],
        ['$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.', '$. Igualando y dividiendo se obtiene $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'Los tres cocientes son iguales al <b>diámetro de la circunferencia circunscrita</b>: $2r = '],
        // kosinussatz
        ['$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$\\gamma = 90^\\circ$: el término de corrección es cero y queda el <b>teorema de Pitágoras</b> $c^2 = a^2 + b^2$.'],
        ['$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', '$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, el cuadrado sobre $c$ es <b>menor</b> que los otros dos juntos.'],
        ['$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', '$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, el cuadrado sobre $c$ es <b>mayor</b> que los otros dos juntos.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Arrastra $C$ hasta que el ángulo mida exactamente $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Datos: '], ['drei Seiten', 'tres lados'], ['zwei Seiten und der eingeschlossene Winkel', 'dos lados y el ángulo comprendido'],
        ['eine Seite und die beiden anliegenden Winkel', 'un lado y los dos ángulos contiguos'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'dos lados y un ángulo opuesto a uno de ellos'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. Las letras son las habituales: $a$ está enfrente de $A$ y $\\alpha$ está en $A$.'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'No hay triángulo: los dos ángulos ya suman $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$, para $\\gamma$ no queda nada.'],
        ['\\text{ zu groß, }', '\\text{ demasiado grande, }'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Dos triángulos</b> encajan con los datos: el lado $a$ corta dos veces la semirrecta del ángulo. Es el caso ambiguo de LLA (el ángulo dado está enfrente del lado <b>más corto</b>).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Exactamente <b>un</b> triángulo: el ángulo está enfrente del lado <b>más largo</b> (o igual de largo), y entonces LLA tiene solución única.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Exactamente <b>un</b> triángulo: aquí $a$ solo toca la semirrecta del ángulo, y el triángulo es rectángulo.'],
        // dreiecksflaeche
        ['Höhe $h = b \\cdot \\sin\\gamma = ', 'Altura $h = b \\cdot \\sin\\gamma = '], ['$ Flächeneinheiten', '$ unidades de área'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · Con $90^\\circ$ el área es máxima.'], [' · Derselbe Flächeninhalt bei $', ' · La misma área con $'],
        ['^\\circ$, denn $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.', '^\\circ$, porque $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.'],

        // book es mathegy10-es (Lovelace)
        // tangensfunktion
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\tan\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$: aquí $\\cos\\alpha = 0$. El radio es paralelo a la recta tangente y $\\tan\\alpha$ <b>no está definida</b>. La gráfica tiene un <b>polo</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · En la circunferencia: la longitud del segmento sobre la recta tangente en $x = 1$'],
        [' (nach unten, also negativ)', ' (hacia abajo, es decir, negativa)'],
        // pyramidekegel
        ['Schrägbild einer quadratischen Pyramide', 'Perspectiva caballera de una pirámide cuadrada'], ['Schrägbild eines Kegels', 'Perspectiva caballera de un cono'], [' mit einem rechtwinkligen Dreieck', ' con un triángulo rectángulo'],
        ['Seitenhöhe $h_s', 'Apotema $h_s'], ['Neigungswinkel der Seitenfläche:', 'Ángulo de inclinación de la cara lateral:'],
        ['Seitenkante $s', 'Arista lateral $s'], ['$ mit der Diagonale $d', '$ con la diagonal $d'], ['Neigungswinkel der Seitenkante:', 'Ángulo de inclinación de la arista lateral:'],
        ['$ · Oberfläche $O', '$ · área total $O'], ['Mantellinie $s', 'Generatriz $s'],
        ['halber Öffnungswinkel:', 'mitad del ángulo de abertura:'], ['$ · Öffnungswinkel $2', '$ · ángulo de abertura $2'], ['$ · Mantel $M', '$ · superficie lateral $M'],

    ],
    rule: [
        // book es mathe10-es (Curie)
        // messkurve: the unit after the distance of the markers ("$11,0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ años</b>'],

        // book es mathegy10-es (Lovelace)

    ]
});
