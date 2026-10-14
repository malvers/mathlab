/* js/buch-es/komplex.js — Spanish for the widgets of js/buch-komplex.js.
 * Loaded by the Spanish editions right after js/buch-komplex.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('komplex', {
    word: {
        // book es mathegy10-es (Lovelace)
        // quadkomplex, zeiger
        'Parabel y = x² + px + q': 'Parábola y = x² + px + q', 'Die beiden Lösungen in der Gaußschen Zahlenebene': 'Las dos soluciones en el plano de Gauss',
        'Betrag und Argument': 'Módulo y argumento', 'mal $\\mathrm{i}$': 'por $\\mathrm{i}$', 'Quadrat $z^2$': 'Cuadrado $z^2$', 'Ansicht': 'Vista',
        'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene': 'Número complejo como flecha en el plano de Gauss',

    },
    phrase: [
        // book es mathegy10-es (Lovelace)
        // quadkomplex
        ['$ · Diskriminante $D = ', '$ · discriminante $D = '],
        ['$: zwei reelle Lösungen $x_{1,2} = ', '$: dos soluciones reales $x_{1,2} = '], ['$, die Parabel schneidet die $x$-Achse zweimal.', '$; la parábola corta el eje $x$ dos veces.'],
        ['$: genau eine Lösung $x = ', '$: exactamente una solución $x = '], ['$, die Parabel berührt die $x$-Achse.', '$; la parábola toca el eje $x$.'],
        ['$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ', '$: ninguna solución real; la parábola queda por encima del eje $x$. En $\\mathbb{C}$: $z_{1,2} = '],
        ['\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.', '\\,\\mathrm{i}$, dos números <b>complejos conjugados</b>, simétricos respecto del eje real.'],
        ['Vieta stimmt auch hier: $z_1 + z_2 = ', 'Vieta también se cumple aquí: $z_1 + z_2 = '], [' = -p$ und $z_1 \\cdot z_2 = ', ' = -p$ y $z_1 \\cdot z_2 = '],
        // zeiger
        ['$ · Realteil $', '$ · parte real $'], ['$, Imaginärteil $', '$, parte imaginaria $'], ['Betrag $|z| = \\sqrt{', 'Módulo $|z| = \\sqrt{'],
        ['$ (Pythagoras) · Argument $\\varphi \\approx ', '$ (Pitágoras) · argumento $\\varphi \\approx '],
        ['^\\circ$, der Winkel zur positiven reellen Achse', '^\\circ$, el ángulo con el semieje real positivo'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $', 'Como $\\mathrm{i}^2 = -1$, la flecha <b>gira</b> $90^\\circ$ <b>en sentido contrario a las agujas del reloj</b> y el módulo sigue siendo $'],
        ['$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.', '$. Multiplicar cuatro veces por $\\mathrm{i}$ da una vuelta completa: $\\mathrm{i}^4 = 1$.'],
        ['Der Betrag wird quadriert ($', 'El módulo se eleva al cuadrado ($'], ['$), das Argument verdoppelt ($\\approx ', '$) y el argumento se duplica ($\\approx '],

    ],
    rule: [
        // book es mathegy10-es (Lovelace)

    ]
});
