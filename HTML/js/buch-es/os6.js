/* js/buch-es/os6.js — Spanish for the widgets of js/buch-os6.js.
 * Loaded by the Spanish editions right after js/buch-os6.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('os6', {
    word: {
        // book es mathe6-es (Turing)
        // titelbildos6
        'Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln':
            'Portada: un cuadrado de tangram de siete piezas, un círculo con tres cuartos de colores, una recta numérica, la torre de Hanói y un cuerpo hecho de cubos',
        // wuerfelbauos6 ("Mauer" is a rule below: analysis has the word "muro" in lower case)
        'Treppe': 'Escalera', 'Turm': 'Torre', 'Selbst bauen': 'Construye el tuyo', 'Körper': 'Cuerpo', 'vorne': 'delante',
        'Körper aus Würfeln im Schrägbild': 'Cuerpo hecho de cubos en perspectiva caballera',
        'Bauplan: Draufsicht mit den Höhen': 'Plano de construcción: vista desde arriba con las alturas', 'Bauplan': 'Plano de construcción',
        'von vorn': 'de frente', 'von rechts': 'desde la derecha',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Toca una casilla del plano: el número dice cuántos cubos hay apilados allí (hasta 3, después otra vez 0). Longitud de la arista: 1 cm.',
        // hanoios6
        '3 Scheiben': '3 discos', '4 Scheiben': '4 discos', '5 Scheiben': '5 discos', '6 Scheiben': '6 discos',
        'Anzahl der Scheiben': 'Número de discos', 'Neu': 'Nuevo', 'Lösung zeigen': 'Mostrar la solución',
        'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.': 'No está permitido: un disco más grande nunca puede estar sobre uno más pequeño.',
        'Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.':
            'Lleva todos los discos de A a C. Toca primero la varilla de la que coges y después la varilla de destino. Siempre un solo disco, nunca uno más grande sobre uno más pequeño.',
        // nimos6
        '15 Hölzer': '15 palillos', '21 Hölzer': '21 palillos', '30 Hölzer': '30 palillos', 'Anzahl der Hölzer': 'Número de palillos',
        'ohne Hilfe': 'sin ayuda', 'Vierer zeigen': 'mostrar los grupos de cuatro', 'Hilfe': 'Ayuda',
        'Nimm 1': 'Coge 1', 'Nimm 2': 'Coge 2', 'Nimm 3': 'Coge 3',
        // tangramos6
        'Tangram: sieben Teile in einem Quadrat': 'Tangram: siete piezas en un cuadrado',
        // schiebeos6
        '3 × 3 · 8 Steine': '3 × 3 · 8 fichas', '4 × 4 · 15 Steine': '4 × 4 · 15 fichas', 'Mischen': 'Mezclar', 'Ordnen': 'Ordenar',
        'Geordnet. Tippe auf „Mischen“.': 'Ordenado. Toca «Mezclar».',
        'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.':
            'Toca una ficha junto al hueco y se desliza dentro. Ordena los números, con el hueco abajo a la derecha.',
        'Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.':
            'Verde: la ficha ya está en su sitio. Solo se mezcla con movimientos permitidos, por eso todos los rompecabezas tienen solución. Si en cambio se intercambian dos fichas, ya no sale nunca.',
        // augensummeos6 (the buttons as in gy6)
        '1-mal': '1 vez', '10-mal': '10 veces', '100-mal': '100 veces', 'Löschen': 'Borrar',
        'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme': 'Los 36 resultados de dos dados con su suma de puntos',
        'Säulendiagramm: relative Häufigkeiten der Augensummen': 'Diagrama de barras: frecuencias relativas de las sumas de puntos',
    },
    phrase: [
        // book es mathe6-es (Turing)
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · área total '],
        // hanoios6, schiebeos6
        ['Züge:', 'Movimientos:'], ['Mindestens nötig:', 'Mínimo necesario:'], ['Geschafft!', '¡Conseguido!'],
        ['Mit der kleinstmöglichen Zahl von Zügen.', 'Con el menor número posible de movimientos.'],
        // nimos6
        ['Du: ', 'Tú: '], ['Computer: ', 'Ordenador: '], ['Du hast das letzte Holz genommen und gewonnen!', '¡Has cogido el último palillo y has ganado!'],
        ['Der Computer hat das letzte Holz genommen.', 'El ordenador ha cogido el último palillo.'], ['Probier es noch einmal.', 'Inténtalo otra vez.'],
        ['Der Computer überlegt …', 'El ordenador está pensando …'], ['Du bist dran: Nimm 1, 2 oder 3 Hölzer.', 'Te toca: coge 1, 2 o 3 palillos.'],
        ['Wer das letzte Holz nimmt, gewinnt.', 'Gana quien coge el último palillo.'],
        [' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.',
            ' Los colores muestran grupos de cuatro contados desde el final: deja siempre al ordenador un múltiplo de 4.'],
        // tangramos6
        ['großes Dreieck', 'triángulo grande'], ['mittleres Dreieck', 'triángulo mediano'], ['kleines Dreieck', 'triángulo pequeño'],
        ['Anteil am Quadrat: ', 'Parte del cuadrado: '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'Si el cuadrado mide 4 cm × 4 cm, la pieza mide '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Toca una pieza. Las siete juntas forman el cuadrado entero: '],
        // augensummeos6
        [' · zuletzt ', ' · la última, '], [' · im Gitter ', ' · en la cuadrícula '], [' von 36 Feldern, also ', ' de 36 casillas, es decir, '],
        ['Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (',
            'Toca una casilla o una barra. La línea discontinua muestra la parte de las casillas. El 7 tiene más casillas que ningún otro ('],
        ['), die 2 und die 12 nur eins.', '); el 2 y el 12, solo una cada uno.'],
    ],
    rule: [
        // book es mathe6-es (Turing)
        // wuerfelbauos6: the button "Mauer" and "7 Würfel · Volumen"
        [/(data-v="mauer">)Mauer</, '$1Muro<'],
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cubo' : 'cubos') + ' · volumen '],
        // hanoios6, schiebeos6, nimos6: numbers inside the sentences
        [/Turm von Hanoi mit (\d+) Scheiben/, 'Torre de Hanói con $1 discos'],
        [/Es geht auch mit (\d+) Zügen\./, 'También se puede con $1 movimientos.'],
        [/Geschafft in (\d+) Zügen!/, '¡Conseguido en $1 movimientos!'],
        [/Schiebepuzzle mit (\d+) Steinen/, 'Rompecabezas deslizante con $1 fichas'],
        [/^(\d+) Hölzer liegen noch$/, (m, n) => n === '1' ? 'Queda 1 palillo' : 'Quedan ' + n + ' palillos'],
        [/Noch <b>(\d+)<\/b> Hölzer\./, (m, n) => (n === '1' ? 'Queda' : 'Quedan') + ' <b>' + n + '</b> ' + (n === '1' ? 'palillo.' : 'palillos.')],
        // tangramos6: the square and the parallelogram as the name of the piece and in the list of pieces of equal area
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'cuadrado' : 'paralelogramo') + b],
        // all piece names are masculine in Spanish; one twin or several
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => {
            const one = !l.includes(',');
            return (one ? 'Igual de grande: ' : 'Igual de grandes: ') + l.replace(/\bQuadrat\b/g, 'cuadrado').replace(/\bParallelogramm\b/g, 'paralelogramo') + (one ? ' (iluminado).' : ' (iluminados).');
        }],
        // augensummeos6: "5 Würfe · zuletzt 3 + 4 = 7" and "Augensumme 7: 5-mal, relativ …"
        [/(<p style="margin:0">)(\d+) Würfe( · zuletzt |<\/p>)/, (m, a, n, b) => a + n + (n === '1' ? ' tirada' : ' tiradas') + b],
        [/Augensumme <b>(\d+)<\/b>: (\d+)-mal(, relativ )?/, (m, s, k, r) => 'Suma de puntos <b>' + s + '</b>: ' + (k === '1' ? '1 vez' : k + ' veces') + (r ? ', frecuencia relativa ' : '')],
    ]
});
