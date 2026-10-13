/* js/buch-es/gy11lk.js — Spanish for the widgets of js/buch-gy11lk.js.
 * Loaded by the Spanish editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy11lk', {
    word: {
        // book es mathegy11lk-es (Turing)
        // titelbildgy11lk
        'Titelbild: eine Kurve mit Tangente, der Epsilon-Delta-Streifen um einen Punkt und eine Fixpunktiteration als Spinnennetz':
            'Portada: una curva con su tangente, la franja épsilon-delta alrededor de un punto y una iteración de punto fijo en forma de telaraña',
        // epsdelta
        'x² bei 1': 'x² en 1', '(x² − 4)/(x − 2) bei 2': '(x² − 4)/(x − 2) en 2', 'sin x / x bei 0': 'sen x / x en 0', '√x bei 4': '√x en 4', 'Sprung bei 0': 'Salto en 0',
        'Streifenbreite $\\varepsilon$': 'Anchura de la franja $\\varepsilon$',
        'Graph mit einem waagerechten Streifen der Breite Epsilon um den Grenzwert und einem senkrechten Streifen der Breite Delta um die Stelle':
            'Gráfica con una franja horizontal de anchura épsilon alrededor del límite y una franja vertical de anchura delta alrededor del punto',
        // stetigkeit
        'zwei Parabel- und Geradenstücke': 'Trozos de parábola y recta', 'Parameter $a$': 'Parámetro $a$', 'Gerade und Wurzel': 'Recta y raíz', 'Lücke füllen': 'Rellenar el hueco',
        'Funktionswert $b$ an der Stelle 1': 'Valor de la función $b$ en el punto 1',
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Función definida a trozos con un punto de unión',
        // linapprox
        'eˣ bei 0': 'eˣ en 0', 'sin x bei 0': 'sen x en 0', 'ln x bei 1': 'ln x en 1',
        'Ausschnitt: halbe Breite $r$': 'Ventana: semianchura $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Gráfica de una función y su tangente en una ventana que se puede reducir',
        // ablnachdef
        'Schrittweite $h = 10^{-k}$': 'Paso $h = 10^{-k}$', '$a = e$ setzen': 'Poner $a = e$', 'Tangente': 'Tangente',
        'Graph von a hoch x mit Sekante durch (0|1) und Tangente': 'Gráfica de a elevado a x con la secante por (0, 1) y la tangente',
        // produktregel
        'Zuwachs $h$ von $x$': 'Incremento $h$ de $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Rectángulo de lados u y v y su incremento, formado por dos franjas y una esquina',
        // randextrema
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Gráfica de una función con un intervalo y sus extremos locales y globales',
        'linker Rand $a$': 'extremo izquierdo $a$', 'rechter Rand $b$': 'extremo derecho $b$',
        'lokales Maximum': 'máximo local', 'lokales Minimum': 'mínimo local', 'Rand': 'extremo del intervalo', 'Art': 'Tipo',
        'Globales Maximum': 'Máximo global', 'globales Minimum': 'mínimo global',
        // drehraum
        'Dieses Bild braucht js/buch-vektoren.js.': 'Esta imagen necesita js/buch-vektoren.js.',
        'Drehachse:': 'Eje de giro:', 'Drehachse': 'Eje de giro', 'x-Achse': 'eje x', 'y-Achse': 'eje y', 'z-Achse': 'eje z',
        'Ein Haus wird im Raum um eine Koordinatenachse gedreht': 'Una casa gira en el espacio alrededor de un eje de coordenadas',
        // verflechtung (names as in the text of chapter 2: cacao, azúcar, leche, chocolate negro y con leche; "Classic" and "Mix" stay as product names)
        'Kakao': 'Cacao', 'Zucker': 'Azúcar', 'Milch': 'Leche', 'Zartbitter': 'Negro', 'Vollmilch': 'Con leche',
        'Tafeln „Classic“ $e_1$': 'Tabletas «Classic» $e_1$', 'Boxen „Mix“ $e_2$': 'Cajas «Mix» $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Grafo de Gozinto: tres materias primas, dos productos intermedios, dos productos finales y, en las flechas, las cantidades necesarias',
        // rettung
        'Tempo im Sand $v_1$ (m/s)': 'Velocidad en la arena $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Velocidad en el agua $v_2$ (m/s)', 'Sand': 'Arena', 'Wasser': 'Agua', 'T in s': 'T en s',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Playa y agua: el camino de la socorrista desde A, pasando por el punto P de la orilla, hasta el bañista B',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'El tiempo T en función del punto x en el que entra en el agua',
        // fixpunkt
        'Funktion φ': 'Función φ', 'Nächster Schritt': 'Siguiente paso', '10 Schritte': '10 pasos',
        'Fixpunktiteration: Spinnennetz zwischen dem Graphen von φ und der Geraden y = x': 'Iteración de punto fijo: telaraña entre la gráfica de φ y la recta y = x',

    },
    phrase: [
        // book es mathegy11lk-es (Turing)
        // epsdelta
        ['\\text{ rechts, } ', '\\text{ por la derecha, } '], ['\\text{ links, also } ', '\\text{ por la izquierda; así que } '],
        ['$, Behauptung: $', '$; afirmación: $'], ['$. Orange: alle $y$ mit $|y - ', '$. Naranja: todos los $y$ con $|y - '],
        ['Blau: Für alle $x \\neq ', 'Azul: para todo $x \\neq '], ['$ mit $|x - ', '$ con $|x - '],
        ['| < \\delta$ liegt $f(x)$ im orangen Streifen. Das größte passende $\\delta$ ist hier etwa ', '| < \\delta$, $f(x)$ está en la franja naranja. El mayor $\\delta$ que sirve es aquí aproximadamente '],
        [' (exakt: $', ' (exactamente: $'],
        ['. Mach $\\varepsilon$ kleiner: Es gibt immer noch ein $\\delta > 0$. Genau das heißt „Grenzwert“.', '. Haz $\\varepsilon$ más pequeño: sigue habiendo un $\\delta > 0$. Eso es exactamente lo que significa «límite».'],
        ['Kein $\\delta$ passt:', 'Ningún $\\delta$ sirve:'],
        ['So nah man der 0 von links auch kommt, dort ist $f(x) = -1$, also mindestens 2 vom behaupteten Grenzwert entfernt. Für $\\varepsilon < 2$ scheitert jede Wahl. Die Funktion hat bei 0 keinen Grenzwert, nur einseitige.',
            'Por mucho que uno se acerque a 0 por la izquierda, allí $f(x) = -1$, es decir, está al menos a 2 del límite afirmado. Para $\\varepsilon < 2$ falla cualquier elección. La función no tiene límite en 0, solo límites laterales.'],
        // stetigkeit
        ['Stetig an der Stelle ', 'Continua en el punto '],
        ['linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            'el límite por la izquierda, el límite por la derecha y el valor de la función coinciden. La gráfica se puede dibujar sin levantar el lápiz.'],
        ['Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', 'Salto:</b> los límites laterales son distintos; la gráfica salta '],
        ['. Stetig wird $f$ nur für $', '. $f$ solo se hace continua para $'],
        ['Hebbare Unstetigkeit:</b> Der Grenzwert ', 'Discontinuidad evitable:</b> el límite '], [' existiert, aber der Funktionswert ist ', ' existe, pero el valor de la función es '],
        ['. Mit $b = ', '. Con $b = '], ['$ wird die Lücke geschlossen.', '$ se cierra el hueco.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tangente en $x_0 = '], ['$, also $f(x_0 + h) \\approx ', '$, así que $f(x_0 + h) \\approx '],
        ['Am Rand des Ausschnitts ($h = \\pm', 'En el borde de la ventana ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$) la tangente se desvía como máximo '],
        [' ab, das sind ', ', es decir, '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' por unidad de $h$. Reduce $r$: el error disminuye más deprisa que $h$; vista de cerca, la curva parece su tangente.'],
        // ablnachdef (the point rule has already made (0 \mid 1) into (0, 1))
        [': Es genügt, den Grenzwert von $\\dfrac{a^h - 1}{h}$ für $h \\to 0$ zu kennen, den Anstieg in $(0, 1)$.',
            ': basta con conocer el límite de $\\dfrac{a^h - 1}{h}$ para $h \\to 0$, la pendiente en $(0, 1)$.'],
        ['Für $a = ', 'Para $a = '], ['$ geht der Quotient gegen $\\ln a \\approx ', '$ el cociente tiende a $\\ln a \\approx '],
        ['$, also $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. ', '$, así que $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. '],
        ['Für $a = e$ ist der Grenzwert genau 1: ', 'Para $a = e$ el límite es exactamente 1: '],
        ['Bei welcher Basis ist der Grenzwert genau 1?', '¿Con qué base es el límite exactamente 1?'],
        // produktregel
        ['$ bei $x = 1{,}5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:', '$ en $x = 1{,}5$. Si $x$ aumenta en $h$, el área $u \\cdot v$ aumenta en dos franjas y una esquina:'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $', 'Para $h \\to 0$, la esquina $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ tiende a $0 \\cdot v\'$ y queda $'],
        ['$: die <b>Produktregel</b>.', '$: la <b>regla del producto</b>.'],
        // randextrema
        ['$ auf $[', '$ en $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.', ']$. Candidatos: los puntos interiores con $f\'(x) = 0$ y cambio de signo, más los dos extremos del intervalo.'],
        [' auf dem Intervall. ', ' en el intervalo. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'Un extremo global está en un <b>extremo del intervalo</b>: allí $f\'$ no es cero.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Aquí los dos extremos globales están en el interior.'],
        // drehraum: "Drehung um die x-Achse um 90°"
        ['Drehung um die ', 'Giro alrededor del eje '], ['-Achse um ', ' de '],
        ['$. Die Koordinate längs der Drehachse bleibt gleich, ', '$. La coordenada a lo largo del eje de giro no cambia; '],
        ['die beiden anderen werden wie in der Ebene gedreht.', 'las otras dos giran como en el plano.'],
        // verflechtung
        ['Zwischenprodukte: $', 'Productos intermedios: $'], ['Rohstoffe: $', 'materias primas: $'], ['In einem Schritt: $', 'En un solo paso: $'],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $', '$ da las materias primas necesarias por producto final, y $'],
        ['Für ', 'Para '], [' Tafeln und ', ' tabletas y '], [' Boxen braucht man ', ' cajas hacen falta '],
        [' ME Kakao, ', ' unidades de cacao, '], [' ME Zucker und ', ' unidades de azúcar y '], [' ME Milch', ' unidades de leche'], [' ME', ' u.'],
        // rettung
        ['Bei $x = ', 'Con $x = '], ['$ m braucht sie ', '$ m necesita '], [' s, am schnellsten ist sie bei ', ' s; es más rápida con '],
        ['$ m</b> mit ', '$ m</b>, con '], [' s (grün).', ' s (en verde).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Ángulos con la normal: en la arena $\\alpha = '], ['$, im Wasser $\\beta = ', '$, en el agua $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. En el óptimo se cumple $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: '],
        ['$ und $\\dfrac{\\sin ', '$ y $\\dfrac{\\sin '], ['$, das Brechungsgesetz.', '$: la ley de la refracción.'],
        // fixpunkt
        ['Hier ist $\\varphi\'(x^*) = 0$: Die Folge konvergiert extrem schnell, die Zahl der richtigen Stellen verdoppelt sich etwa bei jedem Schritt (das ist das Newton-Verfahren für $x^2 - 2 = 0$).',
            'Aquí $\\varphi\'(x^*) = 0$: la sucesión converge muy deprisa y el número de cifras correctas se duplica aproximadamente en cada paso (es el método de Newton para $x^2 - 2 = 0$).'],
        ['Wegen $|\\varphi\'(x^*)| < 1$ ist der Fixpunkt <b>anziehend</b>: Nahe bei $x^*$ schrumpft der Fehler bei jedem Schritt etwa um diesen Faktor.',
            'Como $|\\varphi\'(x^*)| < 1$, el punto fijo es <b>atractivo</b>: cerca de $x^*$, el error se reduce en cada paso aproximadamente en ese factor.'],
        [' Weil $\\varphi\' < 0$ ist, springt die Folge um den Fixpunkt herum (Spirale).', ' Como $\\varphi\' < 0$, la sucesión salta alrededor del punto fijo (espiral).'],
        [' Weil $\\varphi\' > 0$ ist, nähert sie sich von einer Seite (Treppe).', ' Como $\\varphi\' > 0$, se acerca por un solo lado (escalera).'],
        ['Hier ist $|\\varphi\'(x^*)| = 1$: Der Satz sagt nichts. Bei $\\varphi(x) = \\tfrac2x$ springt die Folge ewig zwischen zwei Werten hin und her, ein Zyklus.',
            'Aquí $|\\varphi\'(x^*)| = 1$: el teorema no dice nada. Con $\\varphi(x) = \\tfrac2x$, la sucesión salta eternamente entre dos valores: un ciclo.'],
        ['Wegen $|\\varphi\'(x^*)| > 1$ ist der Fixpunkt <b>abstoßend</b>: Selbst ganz nahe bei $x^*$ wächst der Fehler, die Folge läuft weg.',
            'Como $|\\varphi\'(x^*)| > 1$, el punto fijo es <b>repulsivo</b>: incluso muy cerca de $x^*$ el error crece y la sucesión se escapa.'],
        ['$ mit $\\varphi(x) = ', '$ con $\\varphi(x) = '], ['$, Fixpunkt $x^* \\approx ', '$, punto fijo $x^* \\approx '],
        ['$ (grün), $|\\varphi\'(x^*)| \\approx ', '$ (en verde), $|\\varphi\'(x^*)| \\approx '], ['\\text{sehr groß}', '\\text{muy grande}'],

    ],
    rule: [
        // book es mathegy11lk-es (Turing)
        // randextrema: the interval "[-2;\, 3]" (a space after \,) → "[-2, 3]"; with a decimal comma the semicolon stays
        [/\[([-−]?\d+(?:\{,\}\d+)?);\\, ([-−]?\d+(?:\{,\}\d+)?)\]/g, (m, a, b) => /,/.test(a + b) ? m : '[' + a + ', ' + b + ']'],

    ]
});
