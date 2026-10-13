/* js/buch-es/funktionen.js — Spanish for the widgets of js/buch-funktionen.js.
 * Loaded by the Spanish editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Package ES0 put in the cover of the start page; ES1 (mathe11-es) the BGY 11 widgets, in its own block.
 */
window.BuchES && BuchES.add('funktionen', {
    word: {
        // es0: the cover of the start page
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Portada: parábola, curva seno, función exponencial y recta',
        // book es-1 mathe11-es: titelbild, detektiv, wachstum, gerade, parabel, wurf, einheitskreis, sinus, tageslaenge,
        // regression, anscombe, umkehr, expgleichung, parameter, graphquiz (graph and the plot axis: js/buch-es.js)
        // detektiv ("keine" stands for no zeros, no symmetry, no asymptotes: "no tiene" fits all three genders)
        'Graph der gewählten Funktion': 'Gráfica de la función elegida', 'Alle aufdecken': 'Mostrar todo', 'aufdecken': 'mostrar',
        'Definitionsbereich': 'Dominio', 'Wertebereich': 'Recorrido', 'Nullstellen': 'Ceros', 'Monotonie': 'Monotonía',
        'Symmetrie': 'Simetría', 'Periodisch?': '¿Periódica?', 'Asymptoten': 'Asíntotas', 'nein': 'no', 'keine': 'no tiene',
        // wachstum
        'Sparen': 'Ahorro', 'Kernzerfall': 'Desintegración nuclear', 'Eigene Werte': 'Valores propios',
        'Lineares und exponentielles Wachstum': 'Crecimiento lineal y exponencial', 'Startwert $a$': 'Valor inicial $a$',
        'linear: Änderung $m$ pro Schritt': 'lineal: variación $m$ por paso', 'exponentiell: Faktor $q$': 'exponencial: factor $q$',
        'Zeitraum': 'Intervalo de tiempo',
        // gerade, parabel, wurf
        'Gerade durch zwei verschiebbare Punkte': 'Recta que pasa por dos puntos desplazables',
        'Streckfaktor $a$': 'Factor de estiramiento $a$', 'Verschiebung nach rechts $d$': 'Desplazamiento a la derecha $d$',
        'Verschiebung nach oben $e$': 'Desplazamiento hacia arriba $e$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Parábola con vértice desplazable',
        'Abwurfhöhe $h_0$': 'Altura de lanzamiento $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Velocidad de lanzamiento $v_0$',
        'Höhe beim senkrechten Wurf': 'Altura en el lanzamiento vertical', 't in s': 't en s', 'h in m': 'h en m',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Reproducir', 'Anhalten': 'Pausa', 'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Einheitskreis und Sinuskurve': 'Circunferencia goniométrica y curva seno',
        'Amplitude $a$': 'Amplitud $a$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Factor $b$ (período $\\tfrac{2\\pi}{b}$)',
        'Verschiebung $c$ nach rechts': 'Desplazamiento $c$ a la derecha', 'Verschiebung $d$ nach oben': 'Desplazamiento $d$ hacia arriba',
        'Sinusfunktion mit Parametern': 'Función seno con parámetros',
        'Tag des Jahres': 'Día del año', 't in Tagen': 't en días', 'Stunden': 'horas', 'Tageslänge in Dresden': 'Duración del día en Dresde',
        // regression, anscombe
        'Kerze': 'Vela', 'Bremsweg': 'Distancia de frenado', 'Abkühlen': 'Enfriamiento', 'Weltbevölkerung': 'Población mundial',
        'Brenndauer in h': 'Tiempo de combustión en h', 'Länge in cm': 'Longitud en cm', 'Tempo in km/h': 'Velocidad en km/h',
        'Bremsweg in m': 'Distancia de frenado en m', 'Zeit in min': 'Tiempo en min', 'ΔT in °C': 'ΔT en °C', 'Jahr': 'Año',
        'Mrd. Menschen': 'Miles de millones de personas', 'Messreihe': 'Serie de medidas',
        'Messpunkte und Regressionskurve': 'Puntos medidos y curva de regresión', 'Messpunkte lassen sich verschieben': 'Los puntos medidos se pueden desplazar',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Para un modelo exponencial, los valores deben ser positivos.',
        'Datensatz': 'Conjunto de datos', 'Anscombe-Quartett': 'Cuarteto de Anscombe',
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Función y función inversa, reflejadas respecto a y = x',
        'Basis $a$': 'Base $a$', 'rechte Seite $b$': 'segundo miembro $b$', 'Lösen': 'Resolver',
        'Die Basis muss positiv und von 1 verschieden sein.': 'La base debe ser positiva y distinta de 1.',
        'Grundfunktion': 'Función básica', 'Grundfunktion und veränderte Funktion': 'Función básica y función transformada',
        'Das ist die Grundfunktion selbst.': 'Es la propia función básica.',
        'Graph, zu dem der Term gesucht ist': 'Gráfica de la que se busca la expresión', 'Nächster Graph': 'Siguiente gráfica',
        // helpers outside the widgets (CURVES, SCHAREN, EXT of funktion, parabelschar, extremwert): check.mjs reads them for every page
        'Parabel': 'Parábola', 'Liegende Spitze': 'V tumbada', 'Liegende Parabel': 'Parábola tumbada', 'Wurzel': 'Raíz cuadrada',
        'Hyperbel': 'Hipérbola', 'Betrag': 'Valor absoluto', 'Zaun an der Mauer': 'Valla junto al muro', 'Rechteck mit Umfang 24 cm': 'Rectángulo de perímetro 24 cm',
        // book es-3 mathe13-es: helpers of the module (curves of the vertical line test, families of parabolas, extreme values), reported for every page that loads it
        'Parabel': 'Parábola',
        'Liegende Spitze': 'V tumbada',
        'Liegende Parabel': 'Parábola tumbada',
        'Wurzel': 'Raíz cuadrada',
        'Hyperbel': 'Hipérbola',
        'Betrag': 'Valor absoluto',
        'Zaun an der Mauer': 'Valla junto al muro',
        'Rechteck mit Umfang 24 cm': 'Rectángulo de perímetro 24 cm',
        // book es-2 mathe12-es: helpers (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.': 'A $x = 2$ le corresponden $y = 2$ e $y = -2$. Pero una función asigna a cada $x$ exactamente un $y$.',

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)

        // book es mathegy9-es (Curie)

        // book es mathegy11-es (Turing)
        // ganzrational
        'Vielfachheit': 'Multiplicidad', 'Vielfachheit kleiner': 'Menor multiplicidad', 'Vielfachheit größer': 'Mayor multiplicidad', 'Faktor $a$': 'Factor $a$',
        'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.': 'Arrastra los ceros por el eje $x$. La multiplicidad 0 quita el factor lineal.',
        'Ganzrationale Funktion mit verschiebbaren Nullstellen': 'Función polinómica con ceros desplazables',

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    },
    phrase: [
        // parameter: c = 0 in f(c·x) (second check, 12.10.2026)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', 'con $c = 0$, $g(x) = f(0)$ es constante'],
        // book es-1 mathe11-es
        // detektiv
        [' (doppelt)', ' (doble)'], ['fallend für ', 'decreciente para '], ['steigend für ', 'creciente para '],
        ['achsensymmetrisch zur $y$-Achse', 'simétrica respecto al eje $y$'], ['punktsymmetrisch zum Ursprung', 'simétrica respecto al origen'],
        ['überall steigend', 'siempre creciente'], ['fallend auf ', 'decreciente en '], [' und fallend auf ', ' y decreciente en '],
        [' (senkrecht) und ', ' (vertical) y '], ['(waagerecht)', '(horizontal)'], ['$ und $', '$ y $'],
        ['abwechselnd steigend und fallend', 'alternativamente creciente y decreciente'], ['ja, Periode ', 'sí, período '],
        ['$ für $x', '$ para $x'], ['$ mit $k', '$ con $k'],
        // wachstum
        ['einfache Zinsen (30 € pro Jahr)', 'interés simple (30 € al año)'], ['Zinseszins (3 % pro Jahr)', 'interés compuesto (3 % al año)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'lineal: cada día 6,25 puntos porcentuales menos'],
        ['Jod-131: Halbwertszeit 8 Tage', 'yodo-131: período de semidesintegración de 8 días'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — en cada paso se multiplica por <b>el mismo factor</b>'],
        [' — in jedem Schritt ', ' — en cada paso '], ['geht <b>gleich viel</b> weg', 'se resta <b>la misma cantidad</b>'],
        [' wäre alles verbraucht.', ' se habría agotado todo.'], ['kommt <b>gleich viel</b> hinzu.', 'se suma <b>la misma cantidad</b>.'],
        ['. Nach $', '. Después de $'], [', das sind ', ', es decir, '], [' % pro Schritt. ', ' % por paso. '],
        ['linear', 'lineal'], ['exponentiell', 'exponencial'], ['Verdopplungszeit', 'Tiempo de duplicación'], ['Halbwertszeit', 'Período de semidesintegración'],
        ['Jahre', 'años'], ['Tage', 'días'], ['Schritte', 'pasos'], ['Jahren', 'años'], ['Tagen', 'días'], ['Schritten', 'pasos'],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Los dos puntos están en la misma vertical. La recta $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ <b>no</b> es la gráfica de una función.'],
        ['Steigung $m = ', 'Pendiente $m = '], ['Achsenabschnitt $n = ', 'Ordenada en el origen $n = '], ['$ (weißer Punkt)', '$ (punto blanco)'],
        [' · Nullstelle $x_0 = ', ' · cero $x_0 = '], [' · waagerechte Gerade', ' · recta horizontal'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Para $a = 0$ la gráfica no es una parábola, sino una recta.'],
        ['eine (doppelte) Nullstelle: $x = ', 'un cero (doble): $x = '], ['Nullstellen: $x_1 = ', 'ceros: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Forma canónica: $f(x) = '], [' · Scheitel $S(', ' · vértice $S('], ['Normalform: $f(x) = ', 'Forma general: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Punto más alto tras $t_S = '], ['Aufprall nach $', 'Impacto tras $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ en radianes · '], ['Amplitude $|a| = ', 'Amplitud $|a| = '], [' · Periode $p = ', ' · período $p = '],
        [' · Mittellinie $y = ', ' · línea media $y = '], [' · Wertebereich $', ' · recorrido $'], ['$ · am ', '$ · el '],
        [' min</b> Tageslicht', ' min</b> de luz diurna'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', '¿Cuándo se habrá consumido la vela?'], ['Bremsweg bei 150 km/h?', '¿Distancia de frenado a 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', '¿Diferencia de temperatura tras 45 min?'], ['Prognose für 2050?', '¿Previsión para 2050?'],
        ['Regressionsfunktion: $', 'Función de regresión: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;con $x$ = años desde 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coeficiente de determinación $R^2 = '], ['(passt sehr gut)', '(se ajusta muy bien)'], ['(passt gut)', '(se ajusta bien)'],
        ['(passt mäßig)', '(se ajusta regular)'], [' Das Modell sagt: $f(', ' El modelo predice: $f('], ['Regressionsgerade: $', 'Recta de regresión: $'],
        ['Datensatz', 'Conjunto de datos'],
        // umkehr, expgleichung
        ['$ · Der Punkt $P(', '$ · El punto $P('], ['$ auf $f$ wird zum Punkt $P', '$ de $f$ se convierte en el punto $P'], ['$ auf $f^{-1}$.', '$ de $f^{-1}$.'],
        ['Keine Lösung: $', 'Sin solución: $'], ['Probe: $', 'Comprobación: $'],
        // parameter
        [': strecken in $y$-Richtung', ': estirar en la dirección $y$'], [': verschieben in $y$-Richtung', ': desplazar en la dirección $y$'],
        [': stauchen in $x$-Richtung', ': comprimir en la dirección $x$'], [': verschieben in $x$-Richtung', ': desplazar en la dirección $x$'],
        ['gespiegelt an der $x$-Achse', 'reflejada respecto al eje $x$'], ['gespiegelt an der $y$-Achse', 'reflejada respecto al eje $y$'],
        [', in $x$-Richtung mit Faktor ', ', escalada en la dirección $x$ con factor '], ['Der Graph ist ', 'La gráfica está '],
        // helpers: SCHAREN (parabelschar)
        ['zwei Nullstellen ', 'dos ceros '], ['eine (doppelte) Nullstelle ', 'un cero (doble) '], ['eine doppelte Nullstelle ', 'un cero doble '],
        ['keine Nullstelle', 'ningún cero'], ['Diskriminante: $', 'Discriminante: $'], ['$ hat $D = ', '$ tiene $D = '], ['Ausklammern: $', 'Sacando factor común: $'],
        ['$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).',
            '$. Los vértices $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ están todos sobre la parábola $y = -x^2$ (discontinua).'],
        ['keine Parabel, sondern die Gerade $y = -4$', 'no es una parábola, sino la recta $y = -4$'],
        ['nach unten geöffnet mit dem Scheitel ', 'abierta hacia abajo con el vértice '],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.',
            '$kx^2 = 4$ solo tiene soluciones para $k > 0$. El caso $k = 0$ hay que estudiarlo aparte, porque entonces desaparece el $x^2$.'],
        // book es-3 mathe13-es: helpers of the module (curves of the vertical line test, families of parabolas, extreme values), reported for every page that loads it
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: ', 'A la derecha de $x = -1$, cada recta vertical corta la curva dos veces: '],
        ['Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'Pero una función asigna a cada $x$ exactamente un $y$.'],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'dos ceros $x = 0$ y $x = -a$'],
        ['zwei Nullstellen ', 'dos ceros '],
        ['eine (doppelte) Nullstelle ', 'un cero (doble) '],
        ['eine doppelte Nullstelle ', 'un cero doble '],
        ['keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', 'no es una parábola, sino la recta $y = -4$: ningún cero'],
        [': keine Nullstelle', ': ningún cero'],
        ['keine Nullstelle', 'ningún cero'],
        ['Diskriminante: $', 'Discriminante: $'],
        ['$ hat $D = ', '$ tiene $D = '],
        ['Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).', 'Sacando factor común: $x^2 + ax = x(x + a) = 0$. Los vértices $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ están todos sobre la parábola $y = -x^2$ (discontinua).'],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.', '$kx^2 = 4$ solo tiene soluciones para $k > 0$. El caso $k = 0$ hay que estudiarlo aparte, porque entonces desaparece el $x^2$.'],
        // book es-2 mathe12-es: helpers (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.', 'A la derecha de $x = -1$, cada recta vertical corta la curva dos veces: a $x = 1$ le corresponden $y = 2$ e $y = -2$.'],
        ['Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'A $x = 2$ le corresponden $y = 2$ e $y = -2$. Pero una función asigna a cada $x$ exactamente un $y$.'],

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)

        // book es mathegy9-es (Curie)

        // book es mathegy11-es (Turing)
        // ganzrational
        [': einfach → ', ': simple → '], [': doppelt → ', ': doble → '], [': dreifach → ', ': triple → '], [': vierfach → ', ': cuádruple → '],
        [': fünffach → ', ': quíntuple → '], [': sechsfach → ', ': séxtuple → '], [': siebenfach → ', ': séptuple → '], [': achtfach → ', ': óctuple → '],
        [': neunfach → ', ': nónuple → '],
        ['Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse', 'cambio de signo, la gráfica <b>corta</b> el eje $x$'],
        ['Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)', 'cambio de signo, la gráfica corta el eje $x$ <b>de forma plana</b> (punto de silla)'],
        ['kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse', 'sin cambio de signo, la gráfica <b>toca</b> el eje $x$'],
        ['$ · Grad $', '$ · grado $'], ['Für $x \\to +\\infty$ geht $f(x) \\to ', 'Para $x \\to +\\infty$, $f(x) \\to '],
        ['$, für $x \\to -\\infty$ geht $f(x) \\to ', '$; para $x \\to -\\infty$, $f(x) \\to '],
        ['Es entscheidet nur der Summand mit der höchsten Potenz: $', 'Solo decide el sumando de mayor potencia: $'],

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    ],
    rule: [
        // book es-1 mathe11-es
        // tageslaenge: "21. Jun" → "21 jun"
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'ene', Feb: 'feb', 'Mär': 'mar', Apr: 'abr', Mai: 'may', Jun: 'jun', Jul: 'jul', Aug: 'ago', Sep: 'sep', Okt: 'oct', Nov: 'nov', Dez: 'dic' }[mo]],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'sin ceros: el vértice está ' + (a === 'über' ? 'por encima' : 'por debajo') + ' del eje $x$ y la parábola se abre hacia ' + (b === 'oben' ? 'arriba' : 'abajo') + '.'],
        // wurf: "… in $8{,}84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$ a una altura de $' + h + '$. '],
        // expgleichung
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ siempre es positivo, así que nunca puede valer $' + b + '$.'],
        // parameter
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => (w === 'gestreckt' ? 'estirada' : 'comprimida') + ' en la dirección $' + ax + '$ con factor $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' y estirada con factor $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => 'desplazada $' + c + '$ ' + { links: 'hacia la izquierda', rechts: 'hacia la derecha', oben: 'hacia arriba', unten: 'hacia abajo' }[d]],
        // graphquiz score: "3 richtig" → "3 aciertos" (the shared "richtig" → "correcto" would not agree with the number)
        [/^(\d+) richtig$/, (m, n) => n + (n === '1' ? ' acierto' : ' aciertos')],
        // helpers: CURVES (funktion) - whole sentences as rules, before the header rule "^Zu " → "Sobre " of js/buch-es.js
        [/Rechts von \$x = -1\$ trifft jede senkrechte Gerade die Kurve zweimal: Zu \$x = 1\$ gehören \$y = 2\$ und \$y = -2\$\./g,
            'A la derecha de $x = -1$, cada recta vertical corta la curva dos veces: a $x = 1$ le corresponden $y = 2$ e $y = -2$.'],
        [/Zu \$x = 2\$ gehören \$y = 2\$ und \$y = -2\$\. Eine Funktion ordnet jedem \$x\$ aber genau ein \$y\$ zu\./g,
            'A $x = 2$ le corresponden $y = 2$ e $y = -2$. Pero una función asigna a cada $x$ exactamente un $y$.'],
        // book es-3 mathe13-es: "Zu $x = 2$ gehören $y = 2$ und $y = -2$." - before the header rule "Zu …" → "Sobre …" of js/buch-es.js
        [/(: )?\bZu (\$x = [^$]+\$) gehören (\$y = [^$]+\$) und (\$y = [^$]+\$)\./g, (m, c, x, y1, y2) => (c ? ': a ' : 'A ') + x + ' le corresponden ' + y1 + ' e ' + y2 + '.'],

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)

        // book es mathegy9-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    ]
});
