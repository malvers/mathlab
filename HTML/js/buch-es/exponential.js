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

        // book es mathegy10-es (offen)

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

        // book es mathegy10-es (offen)

    ],
    rule: [
        // book es mathe10-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathegy10-es (offen)

    ]
});
