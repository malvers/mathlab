/* js/buch-es/daten.js — Spanish for the widgets of js/buch-daten.js.
 * Loaded by the Spanish editions right after js/buch-daten.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('daten', {
    word: {
        // book es mathegy7-es (Einstein)
        // achsentrick (also used by GY 9)
        'Abgeschnittene Achse': 'Eje cortado', 'Bild statt Balken': 'Dibujo en vez de barra', 'Achse beginnt bei': 'El eje empieza en', 'Trick': 'Truco',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Diagrama de barras: socios de un club deportivo',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'El eje no empieza en cero. Con barras eso siempre engaña, porque el ojo compara sus alturas. En los diagramas de líneas es habitual que el eje empiece más arriba, pero entonces con un signo de corte bien visible.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Eje desde cero: las alturas se pueden comparar con honestidad.',
        '2020: 100 Mio. €': '2020: 100 mill. €', '2025: 200 Mio. €': '2025: 200 mill. €',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Dos símbolos de dinero; el segundo, el doble de alto y el doble de ancho',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'La facturación se ha <b>duplicado</b>. El dibujo de la derecha es el doble de alto, pero también el doble de ancho.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'El ojo compara áreas: $2 \\cdot 2 = 4$, el dibujo parece <b>cuatro veces</b> más grande. Dibujado como cuerpo, incluso $2^3 = 8$ veces.',

        // book es mathegy9-es (Curie)
        'Stadt am Meer': 'Ciudad junto al mar', 'Stadt im Binnenland': 'Ciudad del interior',
        // mittelwerte (achsentrick: Einstein's block mathegy7-es)
        'Ausreißer dazu (75 min)': 'Añadir valor atípico (75 min)', 'Ausreißer weg': 'Quitar valor atípico', 'Fahrzeit in min': 'Tiempo de viaje en min',
        'Median': 'Mediana', 'Mittelwert': 'Media', 'Modalwert': 'Moda',
        'Punktdiagramm der Fahrzeiten mit Median und Mittelwert': 'Diagrama de puntos de los tiempos de viaje con la mediana y la media',
        'Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.':
            'Arrastra los puntos. Un solo camino largo desplaza mucho la media y apenas la mediana.',
        // streuung
        'Streuung von B': 'Dispersión de B', 'Monatsmittel in °C': 'Media mensual en °C',
        'A · STADT AM MEER': 'A · CIUDAD JUNTO AL MAR', 'B · STADT IM BINNENLAND': 'B · CIUDAD DEL INTERIOR',
        'Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung': 'Dos series de datos con la misma media y distinta dispersión',
        'Spannweite': 'Rango', 'Varianz $s^2$': 'Varianza $s^2$',
        'Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.':
            'La misma media anual, un clima muy distinto. La franja clara va de $\\bar{x} - s$ a $\\bar{x} + s$. Valores de modelo, no datos medidos.',
        // histogramm
        'absolute Häufigkeit': 'Frecuencia absoluta', 'relative Häufigkeit': 'Frecuencia relativa', 'Häufigkeit': 'Frecuencia',
        'Klassenbreite': 'Anchura de las clases', 'Erste Klasse ab': 'Primera clase desde', 'Körpergröße in cm': 'Estatura en cm',
        'Histogramm der Körpergrößen': 'Histograma de las estaturas',
        'Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.':
            'Las clases muy estrechas muestran casi solo valores sueltos, y las muy anchas lo difuminan todo. Entre medias se reconoce la forma de la distribución.',

    },
    phrase: [
        // book es mathegy7-es (Einstein)
        // achsentrick
        ['Mitglieder eines Sportvereins. Die letzte Säule <b>wirkt</b> ', 'Socios de un club deportivo. La última barra <b>parece</b> '],
        ['-mal so hoch wie die erste.', ' veces más alta que la primera.'], ['Tatsächlich: $', 'En realidad: $'], ['$, also ein Plus von ', '$, es decir, un aumento del '],

        // book es mathegy9-es (Curie)
        // mittelwerte
        ['Geordnet ($n = ', 'Ordenados ($n = '], ['keiner (jeder Wert kommt nur einmal vor)', 'ninguna (cada valor aparece una sola vez)'],

    ],
    rule: [
        // book es mathegy7-es (Einstein)

        // book es mathegy9-es (Curie)
        // mittelwerte: several modes "15 und 18 min"
        // not after "zwischen": "liegt zwischen 2 und 3." has its own phrases in gy6 and gy7, which this rule would break on pages loading both (OS 7)
        [/(?<!zwischen [-−]?\d*)(\d) und (?=\d)/g, '$1 y '],
        // histogramm: "8 Klassen der Breite 5 cm · häufigste Klasse $[165;\,170)$ mit 10 von 40 Werten (25,0 %)"
        [/(\d+) Klassen der Breite (\d+) cm · häufigste Klasse \$\[(\d+)(?:;\\,|, )(\d+)\)\$ mit (\d+) von (\d+) Werten \(/g,
            '$1 clases de anchura $2 cm · clase más frecuente $[$3, $4)$ con $5 de $6 valores ('],

    ]
});
