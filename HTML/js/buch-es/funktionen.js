/* js/buch-es/funktionen.js — Spanish for the widgets of js/buch-funktionen.js.
 * Loaded by the Spanish editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Package ES0 put in only the cover of the start page; the book package (ES1, mathe11-es) fills in the rest, in its own block.
 */
window.BuchES && BuchES.add('funktionen', {
    word: {
        // es0: the cover of the start page
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Portada: parábola, curva seno, función exponencial y recta',
        // book es-3 mathe13-es: helpers of the module (curves of the vertical line test, families of parabolas, extreme values), reported for every page that loads it
        'Parabel': 'Parábola',
        'Liegende Spitze': 'V tumbada',
        'Liegende Parabel': 'Parábola tumbada',
        'Wurzel': 'Raíz cuadrada',
        'Hyperbel': 'Hipérbola',
        'Betrag': 'Valor absoluto',
        'Zaun an der Mauer': 'Valla junto al muro',
        'Rechteck mit Umfang 24 cm': 'Rectángulo de perímetro 24 cm'
    },
    phrase: [
        // book es-3 mathe13-es: helpers of the module (curves of the vertical line test, families of parabolas, extreme values), reported for every page that loads it
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: ', 'A la derecha de $x = -1$, cada recta vertical corta la curva dos veces: '],
        ['Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'Pero una función asigna a cada $x$ exactamente un $y$.'],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'dos ceros $x = 0$ y $x = -a$'],
        ['zwei Nullstellen ', 'dos ceros '],
        ['eine (doppelte) Nullstelle ', 'un cero (doble) '],
        ['eine doppelte Nullstelle ', 'un cero doble '],
        ['keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', 'no es una parábola, sino la recta $y = -4$: ningún cero'],
        ['nach unten geöffnet mit dem Scheitel ', 'abierta hacia abajo con el vértice '],
        [': keine Nullstelle', ': ningún cero'],
        ['keine Nullstelle', 'ningún cero'],
        ['Diskriminante: $', 'Discriminante: $'],
        ['$ hat $D = ', '$ tiene $D = '],
        ['Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).', 'Sacando factor común: $x^2 + ax = x(x + a) = 0$. Los vértices $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ están todos sobre la parábola $y = -x^2$ (discontinua).'],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.', '$kx^2 = 4$ solo tiene soluciones para $k > 0$. El caso $k = 0$ hay que estudiarlo aparte, porque entonces desaparece el $x^2$.']
    ],
    rule: [
        // book es-3 mathe13-es: "Zu $x = 2$ gehören $y = 2$ und $y = -2$." - before the header rule "Zu …" → "Sobre …" of js/buch-es.js
        [/(: )?\bZu (\$x = [^$]+\$) gehören (\$y = [^$]+\$) und (\$y = [^$]+\$)\./g, (m, c, x, y1, y2) => (c ? ': a ' : 'A ') + x + ' le corresponden ' + y1 + ' e ' + y2 + '.']
    ]
});
