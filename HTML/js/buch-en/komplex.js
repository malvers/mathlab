/* js/buch-en/komplex.js — English for the widgets of js/buch-komplex.js.
 * Loaded by the English editions right after js/buch-komplex.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('komplex', {
    word: {
        // book 10 mathegy10-en: quadkomplex, zeiger
        'Parabel y = x² + px + q': 'Parabola y = x² + px + q', 'Die beiden Lösungen in der Gaußschen Zahlenebene': 'The two solutions in the complex plane',
        'Betrag und Argument': 'Modulus and argument', 'mal $\\mathrm{i}$': 'times $\\mathrm{i}$', 'Quadrat $z^2$': 'Square $z^2$', 'Ansicht': 'View',
        'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene': 'Complex number as an arrow in the complex plane'
    },
    phrase: [
        // book 10 mathegy10-en
        // quadkomplex
        ['$ · Diskriminante $D = ', '$ · discriminant $D = '],
        ['$: zwei reelle Lösungen $x_{1,2} = ', '$: two real solutions $x_{1,2} = '], ['$, die Parabel schneidet die $x$-Achse zweimal.', '$; the parabola cuts the $x$-axis twice.'],
        ['$: genau eine Lösung $x = ', '$: exactly one solution $x = '], ['$, die Parabel berührt die $x$-Achse.', '$; the parabola touches the $x$-axis.'],
        ['$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ', '$: no real solution; the parabola stays above the $x$-axis. In $\\mathbb{C}$: $z_{1,2} = '],
        ['\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.', '\\,\\mathrm{i}$, two <b>complex conjugate</b> numbers, mirror images in the real axis.'],
        ['Vieta stimmt auch hier: $z_1 + z_2 = ', 'Vieta holds here too: $z_1 + z_2 = '], [' = -p$ und $z_1 \\cdot z_2 = ', ' = -p$ and $z_1 \\cdot z_2 = '],
        // zeiger
        ['$ · Realteil $', '$ · real part $'], ['$, Imaginärteil $', '$, imaginary part $'], ['Betrag $|z| = \\sqrt{', 'Modulus $|z| = \\sqrt{'],
        ['^\\circ$, der Winkel zur positiven reellen Achse', '^\\circ$, the angle to the positive real axis'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $', 'Because $\\mathrm{i}^2 = -1$, the arrow is <b>rotated anticlockwise</b> through $90^\\circ$, and the modulus stays $'],
        ['$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.', '$. Multiplying by $\\mathrm{i}$ four times gives a full turn: $\\mathrm{i}^4 = 1$.'],
        ['Der Betrag wird quadriert ($', 'The modulus is squared ($'], ['$), das Argument verdoppelt ($\\approx ', '$), the argument is doubled ($\\approx ']
    ],
    rule: []
});
