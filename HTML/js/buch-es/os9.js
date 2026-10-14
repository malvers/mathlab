/* js/buch-es/os9.js — Spanish for the widgets of js/buch-os9.js.
 * Loaded by the Spanish editions right after js/buch-os9.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 3, 14.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('os9', {
    word: {
        // book es mathe9-es (Einstein)
        // titelbildos9
        'Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel':
            'Portada: un triángulo rectángulo con cuadrados sobre sus lados, la parábola de un lanzamiento, un cono y una esfera',
        // steigungos9
        'Steigung in Prozent': 'Pendiente en porcentaje', '100 m waagerecht': '100 m en horizontal',
        '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.': 'El 100 % son exactamente $45^\\circ$: se sube lo mismo que se avanza.',
        'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.':
            'Más del 100 % es más empinado que $45^\\circ$; eso solo lo tienen las escaleras y los trenes de montaña.',
        'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.':
            'El porcentaje no crece al mismo ritmo que el ángulo: el doble de porcentaje no es el doble de ángulo.',
        // parabelos9
        'Streckfaktor $a$': 'Factor de estiramiento $a$', 'Verschiebung $c$': 'Desplazamiento $c$',
        '$d$ (nach links, wenn positiv)': '$d$ (hacia la izquierda si es positivo)', '$e$ (nach oben, wenn positiv)': '$e$ (hacia arriba si es positivo)',
        'Graph einer quadratischen Funktion mit Scheitelpunkt': 'Gráfica de una función cuadrática con su vértice',
        // quadglos9
        'Drei Parabeln mit zwei, einer und keiner Nullstelle': 'Tres parábolas con dos ceros, uno y ninguno',
        'Parabel y = x² + p x + q mit ihren Nullstellen': 'Parábola y = x² + p x + q con sus ceros',
        // kugelos9
        'Radius gegeben': 'Radio dado', 'Volumen gegeben': 'Volumen dado', 'Gegeben': 'Datos', 'Volumen $V$': 'Volumen $V$', 'Radius $r$': 'Radio $r$',
        'Eine Kugel in einem Zylinder, der genau um sie passt': 'Una esfera dentro de un cilindro que la envuelve justo',
        'Radius': 'Radio', 'Oberfläche': 'Área total', 'Volumen': 'Volumen', 'Zylinder darum': 'Cilindro que la envuelve',
        'Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.':
            'La esfera llena siempre exactamente $\\tfrac{2}{3}$ del cilindro que la envuelve. Lo descubrió Arquímedes.',
        // turmos9
        'Turm: Zylinder + Kegel': 'Torre: cilindro + cono', 'Silo: Zylinder + Halbkugel': 'Silo: cilindro + semiesfera', 'Körper': 'Cuerpo',
        'Höhe des Zylinders $h$': 'Altura del cilindro $h$', 'Höhe des Kegels $h_K$': 'Altura del cono $h_K$',
        'Turm aus einem Zylinder mit einem Kegeldach': 'Torre formada por un cilindro con un tejado cónico',
        'Silo aus einem Zylinder mit einer Halbkugel als Dach': 'Silo formado por un cilindro con una semiesfera como tejado',
        'Zylinder': 'Cilindro', 'Kegel': 'Cono', 'Halbkugel': 'Semiesfera', 'Mantellinie': 'Generatriz',
        'Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.':
            'Al área total solo pertenecen las caras exteriores: el círculo superior del cilindro queda por dentro y no cuenta.',
        // spannweiteos9
        'Ausreißer zu A (5,8 m)': 'Valor atípico en A (5,8 m)', 'Ausreißer weg': 'Quitar valor atípico', 'Streuung von B': 'Dispersión de B',
        'GRUPPE A': 'GRUPO A', 'GRUPPE B': 'GRUPO B',
        'kleinster Wert': 'valor menor', 'größter Wert': 'valor mayor', 'Spannweite': 'Rango', 'Mittelwert': 'Media', 'Zentralwert': 'Mediana',
        'Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite': 'Saltos de longitud de dos grupos con su media y su rango',
        'Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.':
            'Línea blanca: media. El corchete bajo los puntos va del valor menor al mayor; su longitud es el rango. Valores inventados.',
        // fibonaccios9
        'Anzahl der Fibonacci-Zahlen $n$': 'Cantidad de números de Fibonacci $n$', 'Quotient': 'Cociente', 'Wert': 'Valor',
        'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618': 'Los cocientes de números de Fibonacci vecinos se acercan al número 1,618',
        'Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.':
            'Cada número es la suma de los dos anteriores. Los cocientes saltan alternativamente por encima y por debajo de la línea verde $\\Phi \\approx 1{,}618$ y se acercan cada vez más a ella.',
        // abstandos9
        'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse': 'Dos puntos móviles y su distancia como hipotenusa',
        'Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.':
            'El segmento es la hipotenusa de un triángulo rectángulo; los catetos son paralelos a los ejes.',
        // umkehros9
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$',
        'Kein Dreieck möglich': 'No hay triángulo posible', 'Aus diesen Seiten entsteht kein Dreieck.': 'Con estos lados no se forma ningún triángulo.',
        'Zwei Seiten zusammen müssen länger sein als die dritte.': 'Dos lados juntos tienen que ser más largos que el tercero.',
        'Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.':
            'Iguales: por el recíproco del teorema de Pitágoras, el triángulo tiene un ángulo recto en $C$.',
        'Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.': 'Los números enteros con $a^2 + b^2 = c^2$ se llaman ternas pitagóricas.',
        // rwdreieckos9
        'Winkel $\\alpha$': 'Ángulo $\\alpha$',
        'Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.': 'El cateto $a$ tiene que ser más corto que la hipotenusa $c$.',
        'Rechtwinkliges Dreieck mit dem rechten Winkel bei C': 'Triángulo rectángulo con el ángulo recto en C',
        'Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.':
            'El cateto opuesto de $\\alpha$ es $a$, el contiguo es $b$ y la hipotenusa es $c$. La calculadora está en DEG.',
        // dachos9
        'Hausbreite $b$': 'Ancho de la casa $b$', 'Dachneigung $\\alpha$': 'Inclinación del tejado $\\alpha$', 'Hauslänge $l$': 'Largo de la casa $l$',
        'Firsthöhe': 'Altura de la cumbrera', 'Sparrenlänge': 'Longitud de los cabios',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'La altura divide el hastial en dos triángulos rectángulos iguales. Los aleros no se cuentan aquí.',
    },
    phrase: [
        // book es mathe9-es (Einstein)
        // steigungos9: "$12\,\%$ Steigung: auf 100 m waagerecht 12 m höher, also $\tan\alpha = …$" and the angle under it
        ['$ Steigung: auf 100 m waagerecht ', '$ de pendiente: en 100 m en horizontal se sube '], [' m höher, also ', ' m, así que '],
        ['Steigungswinkel: ', 'Ángulo de inclinación: '],
        // parabelos9: the sentences under the graph
        [' · Scheitelpunkt ', ' · vértice '], ['(weiß)', '(blanco)'], ['Quadratische Ergänzung: ', 'Completar el cuadrado: '],
        ['Die Parabel ist nach oben geöffnet und ', 'La parábola está abierta hacia arriba y es '], ['Die Parabel ist nach unten geöffnet und ', 'La parábola está abierta hacia abajo y es '],
        ['so weit wie die Normalparabel', 'tan ancha como la parábola normal'], ['enger als die Normalparabel (gestreckt)', 'más estrecha que la parábola normal (estirada)'],
        ['weiter als die Normalparabel (gestaucht)', 'más ancha que la parábola normal (comprimida)'],
        ['. Der Scheitelpunkt ist ein <b>Minimum</b>.', '. El vértice es un <b>mínimo</b>.'], ['. Der Scheitelpunkt ist ein <b>Maximum</b>.', '. El vértice es un <b>máximo</b>.'],
        ['Wertebereich: ', 'Recorrido: '], ['Fallend für ', 'Decreciente para '], ['Steigend für ', 'Creciente para '],
        ['steigend für ', 'creciente para '], ['fallend für ', 'decreciente para '],
        ['Nullstellen (türkis): ', 'Ceros (turquesa): '], ['genau eine, ', 'exactamente uno, '], ['keine, die Parabel trifft die x-Achse nicht', 'ninguno, la parábola no toca el eje x'],
        [': Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.', ': para $a = 0$ la gráfica ya no es una parábola, sino una recta horizontal.'],
        // quadglos9: the equation, the formula and the number of solutions
        ['$ &nbsp; mit $p = ', '$ &nbsp; con $p = '],
        ['<b>Zwei Lösungen</b>, weil die Diskriminante ', '<b>Dos soluciones</b>, porque el discriminante es '], [' &gt; 0$ ist: ', ' &gt; 0$: '],
        ['<b>Genau eine Lösung</b>, weil $D = 0$ ist: ', '<b>Exactamente una solución</b>, porque $D = 0$: '],
        ['. Der Scheitelpunkt liegt auf der x-Achse.', '. El vértice está sobre el eje x.'],
        ['<b>Keine Lösung</b>, weil ', '<b>Ninguna solución</b>, porque '],
        [' &lt; 0$ ist: Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.',
            ' &lt; 0$: no se puede sacar la raíz de un número negativo. La parábola está toda por encima del eje x.'],
        // dachos9: the table cell (vektoren.js has the word "Dachfläche" as "superficie del tejado")
        ['Dachfläche', 'Superficie del tejado'],
        // fibonaccios9
        ['Fibonacci-Zahlen: ', 'Números de Fibonacci: '],
        // umkehros9
        ['$ und $c^2 = ', '$ y $c^2 = '],
        ['Nicht gleich: Der Winkel bei $C$ ist kleiner als ', 'No son iguales: el ángulo en $C$ es menor que '],
        ['Nicht gleich: Der Winkel bei $C$ ist größer als ', 'No son iguales: el ángulo en $C$ es mayor que '], [', nämlich etwa ', ', en concreto, unos '],
        // rwdreieckos9: the choice of what is given ("$c$ und $\alpha$")
        ['$ und $', '$ y $'],
    ],
    rule: [
        // book es mathe9-es (Einstein)
        // aria labels with a number in the middle
        [/^Steigungsdreieck einer Straße mit (\d+) Prozent Steigung$/, 'Triángulo de pendiente de una carretera con una pendiente del $1 por ciento'],
        [/^Dreieck mit den Seiten (\d+), (\d+) und (\d+)$/, 'Triángulo de lados $1, $2 y $3'],
        [/^Querschnitt eines Satteldachs mit Neigung (\d+) Grad$/, 'Sección de un tejado a dos aguas con una inclinación de $1 grados'],
    ]
});
