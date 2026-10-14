/* js/buch-es/os7.js — Spanish for the widgets of js/buch-os7.js.
 * Loaded by the Spanish editions right after js/buch-os7.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 3, 14.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
(function () {
    // book es mathe7-es (Einstein): the names of the tilings (parkettos7) and the materials (dichteos7), used by the rules below
    const TILING = { 'Dreiecke': 'Triángulos', 'Quadrate': 'Cuadrados', 'Sechsecke': 'Hexágonos', 'Fünfecke': 'Pentágonos',
        'Achtecke und Quadrate': 'Octógonos y cuadrados', 'Sechsecke und Dreiecke': 'Hexágonos y triángulos' };
    const MATERIAL = { 'Holz': 'madera', 'Fichtenholz': 'madera de abeto', 'Eis': 'hielo', 'Aluminium': 'aluminio', 'Eisen': 'hierro', 'Gold': 'oro' };
    window.BuchES && BuchES.add('os7', {
        word: {
            // book es mathe7-es (Einstein)
            // titelbildos7
            'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm':
                'Portada: una tabla de cien con 25 casillas iluminadas, una teselación de hexágonos, una recta numérica de menos 3 a 3, un prisma y un diagrama de sectores',
            // tageszinsos7
            'Kapital $K$': 'Capital $K$', 'Zinssatz $p\\,\\%$': 'Tipo de interés $p\\,\\%$', 'Tage $t$': 'Días $t$', 'Jahr': 'Año', '360 Tage': '360 días',
            'Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.':
                'En los bancos, el año de intereses suele tener 360 días y cada mes 30 días. Solo al final se redondea a céntimos enteros.',
            // dichteos7 (Holz as in os10, Stoff as in gy7, the lengths as in gy8 and gy7)
            'Holz': 'Madera', 'Eis': 'Hielo', 'Aluminium': 'Aluminio', 'Eisen': 'Hierro', 'Gold': 'Oro', 'Stoff': 'Material',
            'Länge $a$': 'Longitud $a$', 'Breite $b$': 'Anchura $b$', 'Höhe $c$': 'Altura $c$',
            // quadrantos7
            'nur P': 'solo P', 'an der x-Achse': 'en el eje x', 'an der y-Achse': 'en el eje y', 'am Ursprung': 'en el origen', 'Spiegeln': 'Reflejar',
            'An der x-Achse ändert die y-Koordinate ihr Vorzeichen.': 'Al reflejar en el eje x, la coordenada y cambia de signo.',
            'An der y-Achse ändert die x-Koordinate ihr Vorzeichen.': 'Al reflejar en el eje y, la coordenada x cambia de signo.',
            'Am Ursprung ändern beide Koordinaten ihr Vorzeichen.': 'Al reflejar en el origen, las dos coordenadas cambian de signo.',
            'Ziehe P. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).':
                'Arrastra P. Primero va la coordenada x (hacia la derecha o la izquierda) y después la coordenada y (hacia arriba o hacia abajo).',
            // parkettos7 (the four single names as in gy7)
            'Dreiecke': 'Triángulos', 'Quadrate': 'Cuadrados', 'Sechsecke': 'Hexágonos', 'Fünfecke': 'Pentágonos',
            'Achtecke und Quadrate': 'Octógonos y cuadrados', 'Sechsecke und Dreiecke': 'Hexágonos y triángulos', 'Parkett': 'Teselación',
            'Ein Parkett bedeckt die Ebene ohne Lücken und ohne Überlappung. Das geht nur, wenn die Winkel an jeder Ecke zusammen genau $360^\\circ$ ergeben. Mit nur einer Sorte regelmäßiger Vielecke klappt das bei Dreiecken, Quadraten und Sechsecken.':
                'Una teselación cubre el plano sin huecos y sin solaparse. Eso solo funciona si los ángulos en cada vértice suman exactamente $360^\\circ$. Con un solo tipo de polígono regular funciona con triángulos, cuadrados y hexágonos.',
            // escheros7
            'Parkett aus einer verformten Quadratkachel': 'Teselación con una tesela cuadrada deformada',
            'Ziehe den <b>roten</b> Punkt: Die linke Kante biegt sich, die rechte Kante macht genau dieselbe Form. Ziehe den <b>lila</b> Punkt: Unten und oben ändern sich gemeinsam.':
                'Arrastra el punto <b>rojo</b>: el lado izquierdo se curva y el lado derecho toma exactamente la misma forma. Arrastra el punto <b>lila</b>: abajo y arriba cambian a la vez.',
            'Was auf einer Seite weggenommen wird, kommt auf der gegenüberliegenden Seite dazu. Darum hat die Kachel immer denselben Flächeninhalt wie das Quadrat – und sie füllt die Ebene lückenlos.':
                'Lo que se quita en un lado se añade en el lado opuesto. Por eso la tesela tiene siempre la misma área que el cuadrado, y llena el plano sin huecos.',
            'So arbeitete M. C. Escher: Er veränderte Kanten eines Vielecks, verschob oder drehte die Änderung auf eine andere Kante und malte in die Kachel ein Tier.':
                'Así trabajaba M. C. Escher: modificaba lados de un polígono, trasladaba o giraba el cambio a otro lado y pintaba un animal dentro de la tesela.',
        },
        phrase: [
            // book es mathe7-es (Einstein)
            // tageszinsos7
            ['Jahreszinsen: ', 'Intereses anuales: '],
            // dichteos7
            ['Masse: ', 'Masa: '],
            ['Die Dichte ist kleiner als die von Wasser (', 'La densidad es menor que la del agua ('], ['): Der Körper schwimmt.', '): el cuerpo flota.'],
            ['Die Dichte ist größer als die von Wasser (', 'La densidad es mayor que la del agua ('], ['): Der Körper geht unter.', '): el cuerpo se hunde.'],
            // quadrantos7
            ['Spiegelpunkt: ', 'Punto imagen: '],
            // parkettos7: the angles at one vertex
            ['An einer Ecke: ', 'En un vértice: '], ['6 Dreiecke: ', '6 triángulos: '], ['4 Quadrate: ', '4 cuadrados: '], ['3 Sechsecke: ', '3 hexágonos: '],
            ['3 Fünfecke: ', '3 pentágonos: '], [' – es bleibt eine Lücke von ', ' – queda un hueco de '], ['. 4 Fünfecke: ', '. 4 pentágonos: '], [', das ist zu viel.', ', y eso es demasiado.'],
            ['2 Achtecke und 1 Quadrat: ', '2 octógonos y 1 cuadrado: '], ['2 Sechsecke und 2 Dreiecke: ', '2 hexágonos y 2 triángulos: '],
        ],
        rule: [
            // book es mathe7-es (Einstein)
            // tageszinsos7: "90 Tage", "1 Tag" on the slider and in the picture, "für $90$ Tage:", the label of the picture
            [/^1 Tag$/, '1 día'], [/^(\d+) Tage$/, '$1 días'], [/>1 Tag</g, '>1 día<'], [/>(\d+) Tage</g, '>$1 días<'],
            [/für \$(\d+)\$ (Tag|Tage): /, (m, t, w) => 'para $' + t + '$ ' + (w === 'Tag' ? 'día' : 'días') + ': '],
            [/Zinsjahr mit 360 Tagen, davon (\d+) Tage; Jahreszinsen und Tageszinsen als Säulen/,
                (m, t) => 'Año de intereses de 360 días, de ellos ' + t + (t === '1' ? ' día' : ' días') + '; intereses del año y de los días como barras'],
            // dichteos7: the label of the picture and the density sentence
            [/Quader aus (\S+), (\d+) cm mal (\d+) cm mal (\d+) cm/, (m, s, a, b, c) => 'Ortoedro de ' + (MATERIAL[s] || s) + ', ' + a + ' cm por ' + b + ' cm por ' + c + ' cm'],
            [/Dichte von (Fichtenholz|Eis|Aluminium|Eisen|Gold): /, (m, s) => 'Densidad ' + (s === 'Fichtenholz' ? 'de la ' : 'del ') + MATERIAL[s] + ': '],
            // quadrantos7: "P(3 | 2)" in the label, "liegt im I. Quadranten"
            [/Koordinatensystem mit vier Quadranten, Punkt P\((-?\d+) \| (-?\d+)\)/, 'Sistema de coordenadas con cuatro cuadrantes, punto P($1, $2)'],
            [/\$ liegt (im|auf)/, '$ está $1'], [/im (I|II|III|IV)\. Quadranten/g, 'en el cuadrante $1'], [/auf einer Achse/g, 'sobre un eje'],
            // parkettos7: the name of the tiling as the title and in the label of the picture
            [/(<p style="margin:0"><b>)([^<]+)(<\/b><\/p><p style="margin:8px 0 0">An einer Ecke)/, (m, a, n, b) => a + (TILING[n] || n) + b],
            [/^Parkett: (.+)$/, (m, n) => 'Teselación: ' + (TILING[n] || n).toLowerCase()],
        ]
    });
})();
