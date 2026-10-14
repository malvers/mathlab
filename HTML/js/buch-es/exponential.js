/* js/buch-es/exponential.js — Spanish for the widgets of js/buch-exponential.js.
 * Loaded by the Spanish editions right after js/buch-exponential.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('exponential', {
    word: {
        // book es mathe10-es (Curie)
        // wachstumsmodell
        'beschränkt': 'acotado', 'logistisch': 'logístico',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Hucha: 50 € al principio, y cada semana se añaden 20 €.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Cultivo de bacterias: 200 bacterias, cada hora un 30 % más.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.':
            'Una bebida sacada de la nevera (6 °C) se calienta hasta la temperatura ambiente (22 °C). Cada minuto, la diferencia con la temperatura ambiente se reduce un 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'Un rumor en un colegio con 800 alumnas y alumnos: al principio lo conocen 10.',
        'Betrag in €': 'Importe en €', 'Anzahl': 'Cantidad', 'Temperatur in °C': 'Temperatura en °C', 'kennen es': 'lo conocen', 'Wochen': 'semanas', 'Minuten': 'minutos',
        'Zunahme $d$ pro Schritt': 'Aumento $d$ por paso', 'Wachstumsfaktor $q$': 'Factor de crecimiento $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Fracción $k$ de la diferencia por paso', 'Wachstumskonstante $k$': 'Constante de crecimiento $k$',
        'Anfangsbestand $B_0$': 'Cantidad inicial $B_0$', 'Schranke $S$': 'Cota $S$', 'Anzahl der Schritte': 'Número de pasos',
        'Bestand Schritt für Schritt': 'La cantidad paso a paso',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'La <b>diferencia</b> entre valores consecutivos es constante.',
        // funktionsklassen ('Wurzel' is in js/buch-es/funktionen.js, loaded on the same page)
        'ganzrational': 'polinómica', 'gebrochenrational': 'racional', 'logarithmisch': 'logarítmica', 'trigonometrisch': 'trigonométrica',
        'Funktionsklasse': 'Tipo de función', 'Typische Graphen der gewählten Funktionsklasse': 'Gráficas típicas del tipo de función elegido',
        'Verlauf': 'Forma de la gráfica', 'Besonderheit': 'Particularidad', 'Asymptote': 'Asíntota', 'Nullstelle und Asymptote': 'Cero y asíntota', 'Term': 'Expresión',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, por ejemplo $x^2$ o $x^3 - 3x$',
        'alle reellen Zahlen': 'todos los números reales', 'höchstens $n$ Stück (Grad $n$)': 'como mucho $n$ (grado $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten':
            'para $|x|$ grande, el sumando con el exponente mayor determina la forma; sin asíntotas',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung':
            'solo exponentes pares: simétrica respecto al eje $y$; solo impares: simétrica respecto al origen',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$':
            'una fracción con $x$ en el denominador, por ejemplo $\\tfrac{1}{x}$ o $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'todos los números reales salvo los ceros del denominador',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'tiempo de viaje $t = \\tfrac{s}{v}$ con una distancia fija',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, desplazada o estirada',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (en el tipo básico)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (en el tipo básico)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'función inversa de $y = x^2$ para $x \\geq 0$, sin asíntota',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\cdot b^x$ con $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (para $a > 0$), por tanto sin ceros',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'el eje $x$; todas las gráficas $b^x$ pasan por $(0, 1)$',
        'Wachstum und Zerfall, Zinseszins': 'crecimiento y decrecimiento, interés compuesto',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ con $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'cero $x = 1$, asíntota vertical: el eje $y$',
        'Richterskala, Dezibel, pH-Wert': 'escala de Richter, decibelios, valor del pH',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\sin x$, $\\cos x$, $\\tan x$, también $a \\cdot \\sin(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'seno y coseno: todos los números reales; tangente: sin $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'seno y coseno: $-1 \\leq y \\leq 1$; tangente: todos los números reales',
        'Schwingungen, Gezeiten, Tageslänge': 'oscilaciones, mareas, duración del día',

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy10-es (Lovelace)
        // logfunktion
        'Verschiebung $d$ nach rechts': 'Traslación $d$ a la derecha', 'Verschiebung $e$ nach oben': 'Traslación $e$ hacia arriba',
        'Logarithmusfunktion mit Asymptote': 'Función logarítmica con asíntota', 'senkrechte Asymptote': 'asíntota vertical',
        'Die Basis $a = 1$ ist nicht erlaubt: $1^y$ ist immer $1$, man kann also nicht nach $y$ auflösen.':
            'La base $a = 1$ no está permitida: $1^y$ es siempre $1$, así que no se puede despejar $y$.',
        // rechenschieber
        'Faktor $b$': 'Factor $b$',
        'Rechenschieber: verschiebbare Zunge über einer festen Skala': 'Regla de cálculo: una reglilla deslizante sobre una escala fija',
        // verkettung
        'Verknüpfung:': 'Combinación:', 'Verknüpfung': 'Combinación', 'Funktion f': 'Función f', 'Funktion g': 'Función g',
        'Zwei Funktionen und ihre Verknüpfung': 'Dos funciones y su combinación', 'Ergebnis': 'Resultado',
        // expanwendung
        'Medikament': 'Medicamento', 'Bakterien': 'Bacterias', 'Sachverhalt': 'Situación',
        '2000 € werden mit 3 % pro Jahr verzinst.': '2000 € se remuneran al 3 % anual.',
        'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.': 'El carbono-14 se desintegra con un período de semidesintegración de 5730 años.',
        '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.': '400 mg de un principio activo; el cuerpo elimina el 20 % cada hora.',
        '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.': '500 bacterias; su número se duplica cada 3 horas.',
        'Zielwert $Z$': 'Valor objetivo $Z$', 'Wachstums- oder Zerfallskurve mit Zielwert': 'Curva de crecimiento o de decrecimiento con valor objetivo',
        't in Jahre': 't en años', 't in Stunden': 't en horas',
        // skizze
        'Nächster Schritt': 'Siguiente paso', 'Graph zeigen': 'Mostrar la gráfica', 'Andere Funktion': 'Otra función',
        'Skizze: charakteristische Punkte und Asymptoten': 'Esbozo: puntos característicos y asíntotas',
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Función básica $2^x$, trasladada 4 hacia <b>abajo</b>: asíntota horizontal $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Punto de corte con el eje $y$: $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Cero: $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'Un punto más: $f(3) = 8 - 4 = 4$. Estrictamente creciente.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.':
            'Forma canónica: vértice $S(1, 4)$, abierta hacia <b>abajo</b>, igual de ancha que la parábola normal.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.':
            'Punto de corte con el eje $y$: $f(0) = -1 + 4 = 3$; reflejado en $x = 1$, también $(2, 3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.':
            'Función básica $\\tfrac1x$, trasladada 2 a la derecha: <b>polo</b> $x = 2$ con asíntota vertical.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Trasladada 1 hacia arriba: asíntota horizontal $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Cero: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': 'Eje $y$: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; a la derecha del polo, por ejemplo $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.':
            'Función básica $\\log_2 x$, trasladada 1 a la <b>izquierda</b>: dominio $x > -1$, asíntota vertical $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Cero: $x + 1 = 1 \\Rightarrow x = 0$. Es a la vez el punto de corte con el eje $y$.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'Más puntos en potencias de dos: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Línea media $y = 1$, amplitud 2: los valores están entre $-1$ y $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Período $2\\pi$, como en el seno. Máximo en $\\tfrac{\\pi}{2}$, mínimo en $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'Sobre la línea media en $0$, $\\pi$ y $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Sacar factor común: $x(x^2 - 4) = x(x - 2)(x + 2)$, ceros $-2$, $0$ y $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.':
            'Solo exponentes impares: <b>simétrica respecto al origen</b>. Para $x$ grandes decide $x^3$: a la derecha hacia arriba, a la izquierda hacia abajo.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Dos puntos: $f(1) = -3$ y, por simetría, $f(-1) = 3$.',
        'Jetzt die Punkte glatt verbinden und die Asymptoten beachten. So sieht der Graph aus.': 'Ahora une los puntos sin aristas y ten en cuenta las asíntotas. Así es la gráfica.',
        'Überleg zuerst selbst: Welche Grundfunktion steckt darin? Wie ist sie verschoben oder gestreckt? Dann Schritt für Schritt aufdecken.':
            'Piensa primero tú: ¿qué función básica se esconde? ¿Cómo está trasladada o dilatada? Después, descúbrelo paso a paso.',

    },
    phrase: [
        // book es mathe10-es (Curie)
        // wachstumsmodell
        ['rekursiv: $B_0 = ', 'recursiva: $B_0 = '], ['explizit: $', 'explícita: $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'El <b>cociente</b> entre valores consecutivos es constante: '],
        [' % pro Schritt (Abnahme).', ' % por paso (disminución).'], [' % pro Schritt.', ' % por paso.'], ['Der Bestand bleibt gleich.', 'La cantidad no cambia.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'La <b>diferencia con la cota</b> se reduce con el factor $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$; la cantidad se acerca cada vez más a $S$ sin superarla.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'Al principio la cantidad crece casi de forma exponencial; cerca de $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.',
            '$ crece más deprisa, y después la cota la frena. Para este cálculo paso a paso no hay una fórmula explícita sencilla: se calcula paso a paso, mejor con una hoja de cálculo.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Atención:</b> con una $k$ tan grande, la cantidad salta por encima de la cota y oscila.'],
        // funktionsklassen: cells that begin with <b> are not looked up as whole labels
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>polos</b> con asíntotas verticales, a menudo una asíntota horizontal'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>periódica</b>: período $2\\pi$ en el seno y el coseno, $\\pi$ en la tangente'],

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy10-es (Lovelace)
        // logfunktion
        ['streng monoton <b>steigend</b> ($a > 1$)', 'estrictamente <b>creciente</b> ($a > 1$)'], ['streng monoton <b>fallend</b> ($0 < a < 1$)', 'estrictamente <b>decreciente</b> ($0 < a < 1$)'],
        ['Definitionsbereich $x > ', 'Dominio $x > '], ['$ · Wertebereich: alle reellen Zahlen · ', '$ · recorrido: todos los números reales · '],
        ['Nullstelle: $', 'Cero: $'], ['$ · weiße Punkte: $(', '$ · puntos blancos: $('],
        [' · Gespiegelt an $y = x$ wird daraus die Exponentialfunktion $y = ', ' · Reflejada en $y = x$, se convierte en la función exponencial $y = '],
        // rechenschieber
        ['Der Anfang der oberen Skala steht über $a = ', 'El comienzo de la escala superior está sobre $a = '], ['$, der Läufer über $b = ', '$, el cursor sobre $b = '],
        ['$ auf der oberen Skala. Unten liest man ab: <b>$', '$ de la escala superior. Abajo se lee: <b>$'],
        [' · Weil $a \\cdot b > 10$ ist, steht hier der <b>rechte</b> Index über $a$, man liest $\\tfrac{a \\cdot b}{10}$ ab: $a \\cdot b = ',
            ' · Como $a \\cdot b > 10$, aquí el índice <b>derecho</b> está sobre $a$ y se lee $\\tfrac{a \\cdot b}{10}$: $a \\cdot b = '],
        ['Längen auf der Skala sind Logarithmen: $\\lg ', 'Las longitudes en la escala son logaritmos: $\\lg '],
        ['$. Aus dem Addieren der Längen wird ein Multiplizieren der Zahlen.', '$. Sumar las longitudes se convierte en multiplicar los números.'],
        // verkettung
        ['Unter der Wurzel darf keine negative Zahl stehen.', 'Bajo la raíz no puede haber un número negativo.'], ['Ein Nenner darf nicht null werden.', 'Un denominador no puede valer cero.'],
        [' Darum muss man prüfen, für welche $x$ die innere Funktion einen erlaubten Wert liefert.', ' Por eso hay que comprobar para qué $x$ la función interior da un valor permitido.'],
        ['Innere Funktion: $', 'Función interior: $'], ['$, äußere Funktion: $', '$, función exterior: $'], ['$. Man setzt die innere in die äußere ein.', '$. Se sustituye la interior en la exterior.'],
        ['Beim Quotienten fallen außerdem alle Stellen weg, an denen $g(x) = 0$ ist.', 'En el cociente quedan fuera, además, todos los puntos en los que $g(x) = 0$.'],
        ['Der Definitionsbereich ist der Bereich, in dem <b>beide</b> Funktionen definiert sind.', 'El dominio es el conjunto en el que están definidas <b>las dos</b> funciones.'],
        ['Im Allgemeinen ist $f(g(x)) \\neq g(f(x))$: Probier die andere Reihenfolge.', 'En general, $f(g(x)) \\neq g(f(x))$: prueba el otro orden.'],
        // expanwendung: "Wann ist das Kapital auf 3000 €?", "Wann sind nur noch 50 mg übrig?" - the Spanish question mark opens in the phrase
        ['Wann ist das Kapital auf', '¿Cuándo llega el capital a'], ['Wann ist der Anteil auf', '¿Cuándo baja la proporción al'],
        ['Wann sind nur noch', '¿Cuándo quedan solo'], [' übrig', ' en el cuerpo'], ['Wann sind es', '¿Cuándo hay'],
        // skizze
        ['Skizziere ohne Taschenrechner:', 'Esboza sin calculadora:'],

    ],
    rule: [
        // book es mathe10-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy10-es (Lovelace)
        // expanwendung: the unit after the result ("… ≈ 13,7$ Jahre"); skizze: "(Funktion 2 von 6)"
        [/\$ Jahre<\/p>/g, '$ años</p>'], [/\$ Stunden<\/p>/g, '$ horas</p>'],
        [/\(Funktion (\d+) von (\d+)\)/g, '(función $1 de $2)'],

    ]
});
