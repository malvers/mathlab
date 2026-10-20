/* js/buch-it/komplex.js — Italian for the widgets of js/buch-komplex.js.
 * Loaded by the Italian editions right after js/buch-komplex.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/komplex.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('komplex', {
    word: {
        // book it-15 mathegy10-it:
        // quadkomplex, zeiger
        'Parabel y = x² + px + q': 'Parabola y = x² + px + q', 'Die beiden Lösungen in der Gaußschen Zahlenebene': 'Le due soluzioni nel piano di Gauss',
        'Betrag und Argument': 'Modulo e argomento', 'mal $\\mathrm{i}$': 'per $\\mathrm{i}$', 'Quadrat $z^2$': 'Quadrato $z^2$', 'Ansicht': 'Vista',
        'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene': 'Numero complesso come freccia nel piano di Gauss',

    },
    phrase: [
        // book it-15 mathegy10-it:
        // quadkomplex
        ['$ · Diskriminante $D = ', '$ · discriminante $D = '],
        ['$: zwei reelle Lösungen $x_{1,2} = ', '$: due soluzioni reali $x_{1,2} = '], ['$, die Parabel schneidet die $x$-Achse zweimal.', '$, la parabola taglia l’asse $x$ due volte.'],
        ['$: genau eine Lösung $x = ', '$: esattamente una soluzione $x = '], ['$, die Parabel berührt die $x$-Achse.', '$, la parabola tocca l’asse $x$.'],
        ['$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ', '$: nessuna soluzione reale, la parabola resta sopra l’asse $x$. In $\\mathbb{C}$: $z_{1,2} = '],
        ['\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.', '\\,\\mathrm{i}$, due numeri <b>complessi coniugati</b>, simmetrici rispetto all’asse reale.'],
        ['Vieta stimmt auch hier: $z_1 + z_2 = ', 'Viète vale anche qui: $z_1 + z_2 = '], [' = -p$ und $z_1 \\cdot z_2 = ', ' = -p$ e $z_1 \\cdot z_2 = '],
        // zeiger
        ['$ · Realteil $', '$ · parte reale $'], ['$, Imaginärteil $', '$, parte immaginaria $'], ['Betrag $|z| = \\sqrt{', 'Modulo $|z| = \\sqrt{'],
        ['$ (Pythagoras) · Argument $\\varphi \\approx ', '$ (Pitagora) · argomento $\\varphi \\approx '],
        ['^\\circ$, der Winkel zur positiven reellen Achse', '^\\circ$, l’angolo con il semiasse reale positivo'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $', 'Poiché $\\mathrm{i}^2 = -1$, la freccia viene <b>ruotata</b> di $90^\\circ$ <b>in senso antiorario</b>, il modulo resta $'],
        ['$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.', '$. Moltiplicare quattro volte per $\\mathrm{i}$ dà un giro completo: $\\mathrm{i}^4 = 1$.'],
        ['Der Betrag wird quadriert ($', 'Il modulo viene elevato al quadrato ($'], ['$), das Argument verdoppelt ($\\approx ', '$), l’argomento raddoppiato ($\\approx '],

    ],
    rule: [
        // book it-15 mathegy10-it:

    ]
});
