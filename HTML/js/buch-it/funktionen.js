/* js/buch-it/funktionen.js — Italian for the widgets of js/buch-funktionen.js.
 * Loaded by the Italian editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the cover of the start page; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/funktionen.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('funktionen', {
    word: {
        // it0: the cover of the start page
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Copertina: parabola, sinusoide, funzione esponenziale e retta',
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        'Parabel': 'Parabola',
        'Liegende Spitze': 'V coricata',
        'Liegende Parabel': 'Parabola coricata',
        'Wurzel': 'Radice quadrata',
        'Hyperbel': 'Iperbole',
        'Betrag': 'Valore assoluto',
        'Zaun an der Mauer': 'Recinzione lungo il muro',
        'Rechteck mit Umfang 24 cm': 'Rettangolo di perimetro 24 cm',
        // book it-3 mathe13-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        ['$. Die Scheitel $S', '$. I vertici $S'],
        [' liegen alle auf der Parabel $y = -x^2$ (gestrichelt).', ' stanno tutti sulla parabola $y = -x^2$ (tratteggiata).'],
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.', 'A destra di $x = -1$ ogni retta verticale taglia la curva due volte: a $x = 1$ corrispondono $y = 2$ e $y = -2$.'],
        ['Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'A $x = 2$ corrispondono $y = 2$ e $y = -2$. Ma una funzione associa a ogni $x$ esattamente un $y$.'],
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: ', 'A destra di $x = -1$ ogni retta verticale taglia la curva due volte: '],
        ['Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'Ma una funzione associa a ogni $x$ esattamente un $y$.'],
        ['$ und $y = ', '$ e $y = '],
        ['$ und $', '$ e $'],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'due zeri $x = 0$ e $x = -a$'],
        ['zwei Nullstellen ', 'due zeri '],
        ['eine (doppelte) Nullstelle ', 'uno zero (doppio) '],
        ['eine doppelte Nullstelle ', 'uno zero doppio '],
        ['keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', 'non una parabola, ma la retta $y = -4$: nessuno zero'],
        ['keine Parabel, sondern die Gerade $y = -4$', 'non una parabola, ma la retta $y = -4$'],
        [': keine Nullstelle', ': nessuno zero'],
        ['keine Nullstelle', 'nessuno zero'],
        ['Diskriminante: $', 'Discriminante: $'],
        ['$ hat $D = ', '$ ha $D = '],
        ['Ausklammern: $', 'Raccogliendo a fattor comune: $'],
        ['nach unten geöffnet mit dem Scheitel ', 'rivolta verso il basso con il vertice '],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.', '$kx^2 = 4$ ha soluzioni solo per $k > 0$. Il caso $k = 0$ va studiato a parte, perché allora $x^2$ sparisce.'],
        // book it-3 mathe13-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // helpers: CURVES (funktion) - the whole sentences, before the header rule "^Zu " of js/buch-it.js
        [/(: )?\bZu (\$x = [^$]+\$) gehören (\$y = [^$]+\$) und (\$y = [^$]+\$)\./g, (m, c, x, y1, y2) => (c ? ': a ' : 'A ') + x + ' corrispondono ' + y1 + ' e ' + y2 + '.'],
        // book it-3 mathe13-it:
    ]
});
