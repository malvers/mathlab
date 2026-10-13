/* js/buch-es/gy12lk.js — Spanish for the widgets of js/buch-gy12lk.js.
 * Loaded by the Spanish editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy12lk', {
    word: {
        // book es mathegy12lk-es (Turing)
        // titelbildgy12lk
        'Titelbild: ein Rotationskörper mit Kreisscheiben, ein Binomialhistogramm unter der Glockenkurve, zwei windschiefe Geraden mit ihrem kürzesten Verbindungsstück':
            'Portada: un cuerpo de revolución con discos, un histograma binomial bajo la campana y dos rectas que se cruzan con su segmento de unión más corto',
        // normalverteilung
        'Erwartungswert $\\mu$': 'Esperanza $\\mu$', 'Standardabweichung $\\sigma$': 'Desviación típica $\\sigma$', '$\\sigma$-Regeln': 'Reglas $\\sigma$',
        'Was wird berechnet?': '¿Qué se calcula?', 'Dichte': 'Densidad', 'Verteilungsfunktion': 'Función de distribución', 'Ansicht': 'Vista',
        'Dichtefunktion der Normalverteilung mit markierter Fläche': 'Función de densidad de la distribución normal con un área marcada',
        // moivre
        'Anzahl der Versuche $n$': 'Número de ensayos $n$', 'Trefferwahrscheinlichkeit $p$': 'Probabilidad de éxito $p$', 'Histogramm': 'Histograma', 'standardisiert': 'tipificado',
        'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung':
            'Histograma de la distribución binomial con la campana de la misma esperanza y la misma desviación típica',
        'erfüllt': 'se cumple', 'nicht erfüllt': 'no se cumple',
        // rotation
        'Kegel': 'Cono', 'Kugel': 'Esfera', 'Paraboloid': 'Paraboloide', 'Fass': 'Tonel', 'Welcher Körper?': '¿Qué cuerpo?', 'Kreisscheiben $n$': 'Discos $n$', 'aus': 'ninguno',
        'Ziehen zum Drehen': 'Arrastra para girar',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Cuerpo de revolución en un sistema de coordenadas en el espacio; se gira arrastrando',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Activa los discos: cada disco tiene el volumen $\\pi \\, r^2 \\, \\Delta x$ con $r = f(x)$.',
        // integralfunktion, uneigentlich
        'Welche Funktion?': '¿Qué función?', 'untere Grenze $a$': 'límite inferior $a$', 'obere Grenze $b$': 'límite superior $b$', 'Grenze': 'Límite',
        'Graph von f mit der Fläche von a bis x': 'Gráfica de f con el área de a a x', 'Graph der Integralfunktion mit Tangente': 'Gráfica de la función integral con la tangente',
        'f(x) = sin x': 'f(x) = sen x', '1/√x bei 0': '1/√x en 0', 'Fläche unter einer Kurve bis zu einer verschiebbaren Grenze': 'Área bajo una curva hasta un límite desplazable',
        // hesse2d
        'Richtung des Normalenvektors': 'Dirección del vector normal',
        'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade': 'Recta con el vector normal unitario, un punto P y su perpendicular a la recta',
        // simpson ("Trapez" as in js/buch-es/vektoren.js)
        'Anzahl der Streifen $n$ (gerade)': 'Número de franjas $n$ (par)', 'Graph mit Parabelbögen über je zwei Streifen': 'Gráfica con arcos de parábola sobre cada dos franjas',
        'Trapez': 'Trapecio', 'Fehler': 'Error',
        // abstand3d
        'Das 3D-Modul fehlt.': 'Falta el módulo 3D.', 'Beispiel 3': 'Ejemplo 3', 'Ursprungsgerade': 'Recta por el origen', 'P auf g': 'P en g',

    },
    phrase: [
        // book es mathegy12lk-es (Turing)
        // normalverteilung
        ['$ mit $\\mu = ', '$ con $\\mu = '], ['$ und $\\sigma = ', '$ y $\\sigma = '],
        ['Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.', 'Tipificar: $Z = \\dfrac{X - \\mu}{\\sigma}$ sigue la distribución normal estándar.'],
        ['. Das ist die gelbe Fläche.', '. Es el área amarilla.'], ['. Das ist der gelbe Anstieg der Verteilungsfunktion.', '. Es la subida amarilla de la función de distribución.'],
        // moivre
        ['Erwartungswert $\\mu = n', 'Esperanza $\\mu = n'], ['$, Standardabweichung $\\sigma = \\sqrt{', '$, desviación típica $\\sigma = \\sqrt{'],
        ['Laplace-Bedingung $\\sigma > 3$: ', 'Condición de Laplace $\\sigma > 3$: '],
        ['Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.',
            'Tipificado: cada barra se desplaza $\\mu$, su anchura se divide entre $\\sigma$ y su altura se multiplica por $\\sigma$. Para $n$ grande, todos los histogramas quedan sobre la misma curva $\\varphi$.'],
        ['Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $', 'Mayor desviación entre $P(X = k)$ y la campana en el punto $k$: $'],
        // rotation
        ['$ auf $[', '$ en $['], [']$ dreht sich um die $x$-Achse: ', ']$ gira alrededor del eje $x$: '], ['Summe der ', 'Suma de los '],
        [' Kreisscheiben (Radius in der Mitte jedes Streifens): $', ' discos (radio en el punto medio de cada franja): $'], ['$, Abweichung $', '$, desviación $'],
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x a la izquierda de a: la integral cuenta hacia atrás)'], ['An der Stelle $x = ', 'En $x = '],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'La tangente rosa a $I$ tiene la pendiente $'], ['$, und das ist genau $f(', '$, y eso es exactamente $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. Es el teorema fundamental: $I_a\'(x) = f(x)$.'],
        // hesse2d
        ['Hessesche Normalform: $', 'Forma normal de Hesse: $'], ['mit $|\\vec n_0| = 1$.', 'con $|\\vec n_0| = 1$.'], ['Punkt einsetzen: $', 'Sustituir el punto: $'],
        ['Abstand $d(P, g) \\approx ', 'Distancia $d(P, g) \\approx '], ['P liegt auf der Geraden.', 'P está en la recta.'],
        ['Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.', 'Positivo: P está en el lado hacia el que apunta $\\vec n_0$.'], ['Negativ: P liegt auf der anderen Seite.', 'Negativo: P está en el otro lado.'],
        // simpson
        ['$. Simpson mit $n = ', '$. Simpson con $n = '],
        ['Doppelt so viele Streifen: Trapezfehler etwa durch $', 'Con el doble de franjas, el error de los trapecios se divide aproximadamente entre $'], ['$, Simpsonfehler etwa durch $', '$, y el de Simpson, entre $'],
        ['$ geteilt. ', '$. '],
        ['Abbruchregel „zwei Simpson-Werte unterscheiden sich um weniger als $10^{-6}$“: ', 'Criterio de parada «dos valores de Simpson se diferencian en menos de $10^{-6}$»: '],
        ['erfüllt ab $n = ', 'se cumple a partir de $n = '], ['erst sehr spät erfüllt.', 'se cumple muy tarde.'],
        // abstand3d
        ['Lotfußpunkt: $\\big(', 'Pie de la perpendicular: $\\big('], ['$ gibt $t = ', '$ da $t = '], ['$, also $F(', '$, es decir, $F('], [')$ und $d(P, g) = ', ')$ y $d(P, g) = '],
        ['Kontrolle mit dem Vektorprodukt: $', 'Control con el producto vectorial: $'], ['. $P$ liegt auf $g$.', '. $P$ está en $g$.'],
        ['$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ', '$: las rectas son paralelas. Entonces su distancia es la distancia del punto $Q$ a $g$: $d '],
        [', sie sind identisch.', '; son coincidentes.'],
        ['$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ', '$ es perpendicular a las dos rectas, $|\\vec{n}| '],
        ['. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(', '. Distancia $0$: las rectas se <b>cortan</b> en $S('],
        ['. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(', '. <b>Se cruzan</b>; el segmento de unión más corto (rosa) une $F('], [')$ und $G(', ')$ y $G('],
        // uneigentlich
        [' (die Grenze liegt weit rechts außerhalb des Bildes)', ' (el límite está muy a la derecha, fuera de la figura)'], ['Grenzwert: $', 'Límite: $'],
        [': Die Fläche ist unbegrenzt, obwohl der Graph sich der Achse nähert.', ': el área no está acotada, aunque la gráfica se acerca al eje.'],
        [': Die unbegrenzte Fläche hat einen endlichen Inhalt.', ': la región no acotada tiene un área finita.'],

    ],
    rule: [
        // book es mathegy12lk-es (Turing)
        // normalverteilung: N(\mu;\ \sigma^2) → N(\mu, \sigma^2) · rotation: [0;\ 4] → [0, 4] (whole numbers only; with a decimal comma the semicolon stays)
        [/N\(\\mu;\\ \\sigma\^2\)/g, 'N(\\mu, \\sigma^2)'],
        [/\[(-?\d+);\\ (-?\d+)\]/g, '[$1, $2]'],

    ]
});
