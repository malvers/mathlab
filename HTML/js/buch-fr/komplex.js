/* js/buch-fr/komplex.js — French for the widgets of js/buch-komplex.js.
 * Loaded by the French editions right after js/buch-komplex.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/komplex.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('komplex', {
    word: {
        // book fr-6 mathegy10-fr:
        // quadkomplex
        'Parabel y = x² + px + q': 'Parabole y = x² + px + q', 'Die beiden Lösungen in der Gaußschen Zahlenebene': 'Les deux solutions dans le plan complexe',
        // zeiger ("Betrag" of a complex number: module)
        'Betrag und Argument': 'Module et argument', 'mal $\\mathrm{i}$': 'fois $\\mathrm{i}$', 'Quadrat $z^2$': 'Carré $z^2$', 'Ansicht': 'Vue',
        'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene': 'Nombre complexe représenté par une flèche dans le plan complexe',
    },
    phrase: [
        // book fr-6 mathegy10-fr:
        // quadkomplex
        ['$ · Diskriminante $D = \\left(\\tfrac{p}{2}\\right)^2 - q = ', '$ · discriminant $D = \\left(\\tfrac{p}{2}\\right)^2 - q = '],
        ['$D > 0$: zwei reelle Lösungen $x_{1,2} = ', '$D > 0$ : deux solutions réelles $x_{1,2} = '], ['$, die Parabel schneidet die $x$-Achse zweimal.', '$, la parabole coupe l’axe des $x$ deux fois.'],
        ['$D = 0$: genau eine Lösung $x = ', '$D = 0$ : exactement une solution $x = '], ['$, die Parabel berührt die $x$-Achse.', '$, la parabole touche l’axe des $x$.'],
        ['$D < 0$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ', '$D < 0$ : pas de solution réelle, la parabole reste au-dessus de l’axe des $x$. Dans $\\mathbb{C}$ : $z_{1,2} = '],
        ['\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.', '\\,\\mathrm{i}$, deux nombres complexes <b>conjugués</b>, symétriques par rapport à l’axe réel.'],
        ['Vieta stimmt auch hier: $z_1 + z_2 = ', 'Les relations de Viète valent ici aussi : $z_1 + z_2 = '], [' = -p$ und $z_1 \\cdot z_2 = ', ' = -p$ et $z_1 \\cdot z_2 = '],
        // zeiger
        ['$ · Realteil $', '$ · partie réelle $'], ['$, Imaginärteil $', '$, partie imaginaire $'], ['Betrag $|z| = \\sqrt{', 'Module $|z| = \\sqrt{'],
        ['$ (Pythagoras) · Argument $\\varphi \\approx ', '$ (Pythagore) · argument $\\varphi \\approx '], ['^\\circ$, der Winkel zur positiven reellen Achse', '^\\circ$, l’angle avec l’axe réel positif'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $',
            'Comme $\\mathrm{i}^2 = -1$, la flèche tourne de $90^\\circ$ <b>dans le sens inverse des aiguilles d’une montre</b>, le module reste $'],
        ['$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.', '$. Multiplier quatre fois par $\\mathrm{i}$ donne un tour complet : $\\mathrm{i}^4 = 1$.'],
        ['Der Betrag wird quadriert ($', 'Le module est élevé au carré ($'], ['$), das Argument verdoppelt ($\\approx ', '$), l’argument est doublé ($\\approx '],
    ],
    rule: [
        // book fr-6 mathegy10-fr:
    ]
});
