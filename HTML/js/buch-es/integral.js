/* js/buch-es/integral.js — Spanish for the widgets of js/buch-integral.js.
 * Loaded by the Spanish editions right after js/buch-integral.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Package ES0 put in only the cover of the start page; the book package (ES3, mathe13-es) fills in the rest, in its own block.
 */
window.BuchES && BuchES.add('integral', {
    word: {
        // es0: the cover of the start page
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Portada: curva de campana sobre el histograma de un contraste con su región de rechazo, un plano en el espacio con vector normal y una recta',
        // book es-3 mathe13-es: stammfunktion
        'Konstante $C$': 'Constante $C$', 'Schar von Stammfunktionen': 'Familia de primitivas', 'Die Funktion f': 'La función f',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).':
            'Arriba: primitivas F + C (la elegida, más clara). Arrastra el punto. Abajo: f. La pendiente de F en el punto es exactamente el valor de la función f(x₀).',
        // book es-3 mathe13-es: bestand
        'Wassertank': 'Depósito de agua', 'Autofahrt': 'Viaje en coche', 'Zuflussrate in l/min': 'Caudal de entrada en l/min', 'Wasser in l': 'Agua en l',
        'Änderungsrate mit Fläche': 'Tasa de variación con el área', 'Rekonstruierter Bestand': 'Cantidad reconstruida', 'Zeit $t$': 'Tiempo $t$',
        'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.':
            'Hasta $t = 6$ entra agua; después sale (tasa de variación negativa). La cantidad es máxima en $t = 6$.',
        'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.': 'El área bajo la gráfica de la velocidad es la distancia recorrida.',
        // book es-3 mathe13-es: integral
        'Bestimmtes Integral zwischen zwei Grenzen': 'Integral definida entre dos límites',
        // book es-3 mathe13-es: zwischenflaeche
        'Parabel und Gerade': 'Parábola y recta', 'Kubik und Parabel': 'Cúbica y parábola', 'Sinus und Kosinus': 'Seno y coseno',
        'Funktionen': 'Funciones', 'Fläche zwischen zwei Graphen': 'Área entre dos gráficas',
        'Zu wenige Schnittstellen im Bild.': 'Hay muy pocos puntos de intersección en la imagen.'
    },
    phrase: [
        // book es-3 mathe13-es: stammfunktion
        ['$ · Stammfunktionen $F(x) = ', '$ · primitivas $F(x) = '], [' + C$, denn $F\'(x) = f(x)$.', ' + C$, porque $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'En $x_0 = '], ['$: Steigung von $F$ $= f(', '$: pendiente de $F$ $= f('], ['$, egal welches $C$.', '$, sea cual sea $C$.'],
        // book es-3 mathe13-es: bestand
        ['$ · Anfangsbestand $', '$ · cantidad inicial $'], ['Bestand nach $t = ', 'Cantidad tras $t = '],
        // book es-3 mathe13-es: integral
        ['Teilstücke zwischen den Nullstellen: ', 'Tramos entre los ceros: '],
        ['Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ', 'Área entre la gráfica y el eje $x$: $A \\approx '],
        [' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.', ' · La integral es menor porque las áreas bajo el eje (rojo) cuentan como negativas.'],
        [' · Achtung: $a > b$ dreht das Vorzeichen.', ' · Atención: $a > b$ cambia el signo.'],
        // book es-3 mathe13-es: zwischenflaeche
        ['$ · Schnittstellen: ', '$ · puntos de intersección: ']
    ],
    rule: []
});
