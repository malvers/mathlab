/* js/buch-fr/funktionen.js — French for the widgets of js/buch-funktionen.js.
 * Loaded by the French editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the cover of the start page, the helpers of the module (the strings outside
 * every widget, which every book that loads it meets) and the block comments. Five books are translated at the same
 * time, each has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/funktionen.js shows which
 * German strings the widgets write.
 */
window.BuchFR && BuchFR.add('funktionen', {
    word: {
        // fr0: the cover of the start page (BGY 11 mathe11)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Couverture : parabole, sinusoïde, fonction exponentielle et droite',
        // fr0: the helpers of the module (outside every widget; check.mjs funktionen/*), shared by all five books
        // the cases and the reasons of parabelschar and funktion are whole labels (a table cell, a paragraph), so they are words,
        // keyed by the German as the widget writes it (a word is looked up before the point rule turns \mid into \,;\,)
        'Parabel': 'Parabole',
        'Liegende Spitze': 'V couché',
        'Liegende Parabel': 'Parabole couchée',
        'Wurzel': 'Racine carrée',
        'Hyperbel': 'Hyperbole',
        'Betrag': 'Valeur absolue',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.': 'À droite de $x = -1$, chaque droite verticale coupe la courbe deux fois : à $x = 1$ correspondent $y = 2$ et $y = -2$.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.': 'À $x = 2$ correspondent $y = 2$ et $y = -2$. Or une fonction associe à chaque $x$ exactement un $y$.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'deux zéros $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'un zéro (double) $x = 1$',
        'keine Nullstelle': 'aucun zéro',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Discriminant : pour $x^2 - 2x + a = 0$, on a $D = 1 - a$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'deux zéros $x = 0$ et $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'un zéro double $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).': 'Factoriser : $x^2 + ax = x(x + a) = 0$. Les sommets $S\\left(-\\tfrac{a}{2}\\,;\\,-\\tfrac{a^2}{4}\\right)$ sont tous sur la parabole $y = -x^2$ (en pointillés).',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'deux zéros $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'pas une parabole, mais la droite $y = -4$ : aucun zéro',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'ouverte vers le bas, de sommet $(0\\,;\\,-4)$ : aucun zéro',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.': '$kx^2 = 4$ n’a de solutions que pour $k > 0$. Le cas $k = 0$ doit être étudié à part, car alors $x^2$ disparaît.',
        'Zaun an der Mauer': 'Clôture le long d’un mur',
        'Rechteck mit Umfang 24 cm': 'Rectangle de périmètre 24 cm',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
