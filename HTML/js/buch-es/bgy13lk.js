/* js/buch-es/bgy13lk.js — Spanish for the widgets of js/buch-bgy13lk.js.
 * Loaded by the Spanish editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Local notation: the identity matrix is I (as in mathe11-es), so the German E of the widgets becomes I here,
 * the Leontief inverse (I − A)⁻¹; quantity units ME are "u." (unidades, as in mathegy11lk-es).
 * Each book has its own block in each section: entries go right below the book's comment line, every entry ends with a comma.
 */
window.BuchES && BuchES.add('bgy13lk', {
    word: {
        // book es mathe13lk-es (Bayer)
        // titelbildbgy13lk
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Portada: trapecios bajo una curva, una campana de Gauss con la región de rechazo en rojo, un ciclo huevo, larva, escarabajo',
        // matrixinverse
        'nicht invertierbar': 'no invertible', 'Beispielmatrix': 'Matriz de ejemplo',
        'Nächster Schritt': 'Siguiente paso', 'Alle Schritte': 'Todos los pasos', 'Von vorn': 'Empezar de nuevo',
        // leontief
        'Markt': 'Mercado', 'Landwirtschaft': 'Agricultura', 'Industrie': 'Industria', 'Dienstleistung': 'Servicios',
        // uebergang
        'Käferpopulation': 'Población de escarabajos', 'Kundenwanderung': 'Migración de clientes',
        '1 Schritt': '1 paso', '10 Schritte': '10 pasos', 'Zurück auf Start': 'Volver al inicio',
        'Eier': 'Huevos', 'Larven': 'Larvas', 'Käfer': 'Escarabajos',
        'Verlauf der drei Klassen über die Schritte n': 'Evolución de las tres clases a lo largo de los pasos n',
        'Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen':
            'Grafo de transición con tres estados y las proporciones de transición en las flechas',
        // biquadratisch
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'La parábola h(z) = z² + p·z + q con sus ceros',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'La gráfica de f(x) = x⁴ + p·x² + q con sus ceros',
    },
    phrase: [
        // book es mathe13lk-es (Bayer)
        // matrixinverse: the steps of the scheme (A | E) and the result
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'Junto a $A$ está la matriz identidad $I$. Objetivo: obtener $I$ a la izquierda con las mismas transformaciones de filas que a la derecha.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr. <b>$A$ ist nicht invertierbar.</b>',
            'A la izquierda ya no se puede obtener la matriz identidad: una fila se anula entera a la izquierda o en una columna ya no queda ningún número $\\neq 0$. <b>$A$ no es invertible.</b>'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'A la izquierda está $I$, a la derecha está $A^{-1}$.'],
        ['. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $', '. Comprobación: $A \\cdot A^{-1} = I$; por ejemplo, primera fila por primera columna: $'],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'El sistema de ecuaciones $A \\cdot \\vec{x} = '],
        ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ tiene la solución $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'La tercera fila de $A$ es la suma de las dos primeras. Entonces $A \\cdot \\vec{x} = \\vec{b}$ no tiene ninguna solución o tiene infinitas, nunca exactamente una.'],
        ['Weiter mit „Nächster Schritt“.', 'Sigue con «Siguiente paso».'],
        // leontief: sliders, the input-output table and the result
        ['Endnachfrage Landwirtschaft', 'Demanda final de agricultura'], ['Endnachfrage Industrie', 'Demanda final de industria'],
        ['Endnachfrage Dienstleistung', 'Demanda final de servicios'],
        ['Zeile: liefernder Sektor, Spalte: empfangender Sektor. L = Landwirtschaft, I = Industrie, D = Dienstleistung. Summe = Produktion, alle Angaben gerundet in ME.',
            'Fila: sector que suministra; columna: sector que recibe. A = agricultura, I = industria, S = servicios. Total = producción; todos los datos redondeados, en u.'],
        ['Technologiematrix $A = ', 'Matriz tecnológica $A = '], [', Leontief-Inverse $(E - A)^{-1}', ', inversa de Leontief $(I - A)^{-1}'],
        ['$\\vec{x} = (E - A)^{-1}', '$\\vec{x} = (I - A)^{-1}'],
        ['. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ',
            '. Cada fila de la tabla cuadra: las entregas a los tres sectores más la demanda final dan la producción. '],
        // uebergang: slider, the state in words, the stochastic matrix
        ['Eier je Käfer', 'Huevos por escarabajo'],
        ['(Eier ', '(huevos '], [', Larven ', ', larvas '], [', Käfer ', ', escarabajos '], ['Anbieter', 'proveedor'],
        ['. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.',
            '. Al crecer $n$, las columnas de $P^n$ se igualan: se acercan a la <b>matriz límite</b>, cuyas columnas son todas el <b>vector fijo</b>.'],
        ['Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: ', 'Vector fijo a partir de $P \\cdot \\vec{v} = \\vec{v}$ y $v_1 + v_2 + v_3 = 1$: '],
        ['. Langfristig: ', '. A largo plazo: '], [' der Kundschaft, egal wie es anfing.', ' de la clientela, empiece como empiece.'],
        // biquadratisch
        ['Koeffizient $p$', 'Coeficiente $p$'], ['Koeffizient $q$', 'Coeficiente $q$'],
        ['$ wird mit $z = x^2$ zu $z^2', '$ se convierte con $z = x^2$ en $z^2'], [', Diskriminante $\\tfrac', ', discriminante $\\tfrac'],
        [' liefert $x = \\pm', ' da $x = \\pm'], [' liefert $x = 0$', ' da $x = 0$'],
        [' liefert nichts, denn $x^2$ ist nie negativ', ' no da nada, porque $x^2$ nunca es negativo'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'ninguna solución $z$, el discriminante es negativo'],
        ['Keine Lösung', 'Ninguna solución'], ['Eine Lösung', 'Una solución'],
    ],
    rule: [
        // book es mathe13lk-es (Bayer)
        // matrixinverse: "Schritt 2 von 7: …", the row operations with the Roman row names
        [/Schritt (\d+) von (\d+): /g, 'Paso $1 de $2: '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, 'Intercambiar las filas $1 y $2 para que en la columna $3 no quede un cero arriba.'],
        [/Zeile (I{1,3}) durch (\$[^$]*\$) teilen: Das Pivotelement wird 1\./g, (m, r, p) => 'Dividir la fila ' + r + ' entre ' + p + ': el pivote pasa a ser 1.'],
        [/In Spalte (\d) Nullen erzeugen: /g, 'Obtener ceros en la columna $1: '],
        // leontief: slider values "120 ME", the total, the sector letters L, I, D → A (agricultura), I, S (servicios) in the table
        [/^([\d.]+) ME$/, '$1 u.'],
        [/Insgesamt werden ([\d.]+) ME erzeugt, damit ([\d.]+) ME den Markt erreichen\./g, 'En total se producen $1 u. para que $2 u. lleguen al mercado.'],
        [/<th><\/th><th>L<\/th><th>I<\/th><th>D<\/th>/g, '<th></th><th>A</th><th>I</th><th>S</th>'],
        [/<th>L<\/th>(?=<td>)/g, '<th>A</th>'], [/<th>D<\/th>(?=<td>)/g, '<th>S</th>'],
        // uebergang: U³ = a·b·f·E with the identity I, and the three endings of the sentence
        [/(\$U\^3 = a \\cdot b \\cdot f \\cdot )E = ([^$]*?) \\cdot E\$: Nach jeweils drei Schritten ist jede Klasse /g,
            (m, a, q) => a + 'I = ' + q + ' \\cdot I$: cada tres pasos, cada clase '],
        [/<b>genau so groß wie vorher<\/b>, die Population schwankt zyklisch\./g, '<b>tiene exactamente el mismo tamaño que antes</b>: la población oscila de forma cíclica.'],
        [/um den Faktor ([\d,]+) <b>gewachsen<\/b>\./g, 'ha <b>crecido</b> en un factor $1.'],
        [/auf das ([\d,]+)-Fache <b>geschrumpft<\/b>, die Population stirbt langfristig aus\./g, 'se ha <b>reducido</b> a $1 veces su tamaño: a largo plazo la población se extingue.'],
        // biquadratisch: "<b>2 Lösungen</b>"
        [/<b>(\d) Lösungen<\/b>/g, '<b>$1 soluciones</b>'],
    ]
});
