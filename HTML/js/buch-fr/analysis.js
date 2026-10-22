/* js/buch-fr/analysis.js — French for the widgets of js/buch-analysis.js.
 * Loaded by the French editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the covers of the start pages, the helpers of the module (the strings outside
 * every widget, which every book that loads it meets) and the block comments. Five books are translated at the same
 * time, each has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/analysis.js shows which
 * German strings the widgets write.
 */
window.BuchFR && BuchFR.add('analysis', {
    word: {
        // fr0: the cover of the start page (BGY 12 mathe12, FOS 12 mathefos12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Couverture : courbe avec sa tangente au point d’inflexion et sa dérivée, loi binomiale et un vecteur de l’espace',
        'Titelbild: Exponentialkurve mit Hochpunkt, Wendetangente und Rechtecken darunter, eine Hyperbel mit Asymptoten und ein Parallelogramm im Raum mit seinem Vektorprodukt':
            'Couverture : courbe exponentielle avec son maximum, sa tangente au point d’inflexion et des rectangles en dessous, une hyperbole avec ses asymptotes et un parallélogramme de l’espace avec son produit vectoriel',
        // fr0: the helpers of the module (outside every widget; check.mjs analysis/*), shared by the four books that load it
        'Karton mit ausgeschnittenen Ecken': 'Carton aux coins découpés',
        'Zylindrische Dose': 'Boîte de conserve cylindrique',
        'Gehege an einer Mauer': 'Enclos le long d’un mur',
        'Mauer': 'mur',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // fr0: the helpers of the module (outside every widget; check.mjs analysis/*), shared by the four books that load it
        // the rules of the derivative and integral tasks (ableiten, integrieren: "Tipp: …" and below the solution)
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Règle des puissances $(x^n)\' = n\\,x^{n-1}$ et règle du facteur constant : le facteur reste.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Règle de la somme : chaque terme se dérive séparément. Un terme constant disparaît.'],
        ['$\\sqrt{x} = x^{\\frac12}$, also $(\\sqrt{x})\' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.', '$\\sqrt{x} = x^{\\frac12}$, donc $(\\sqrt{x})\' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.'],
        ['$\\tfrac{1}{x} = x^{-1}$, also $(x^{-1})\' = -x^{-2} = -\\dfrac{1}{x^2}$.', '$\\tfrac{1}{x} = x^{-1}$, donc $(x^{-1})\' = -x^{-2} = -\\dfrac{1}{x^2}$.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.', 'La règle des puissances vaut aussi pour les exposants rationnels : $(x^r)\' = r\\,x^{r-1}$.'],
        ['$\\tfrac{1}{x^2} = x^{-2}$, also $(x^{-2})\' = -2x^{-3}$.', '$\\tfrac{1}{x^2} = x^{-2}$, donc $(x^{-2})\' = -2x^{-3}$.'],
        ['$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.', '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ et $(\\sin x)\' = \\cos x$.'],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Règle de la somme ; $\\mathrm{e}^x$ reste $\\mathrm{e}^x$ quand on dérive.'],
        ['$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.', '$(\\sin x)\' = \\cos x$, et $(c \\cdot x)\' = c$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.', 'Règle du produit $(u \\cdot v)\' = u\'v + uv\'$ avec $u = x$, $v = \\mathrm{e}^x$.'],
        ['Produktregel mit $u = ', 'Règle du produit avec $u = '],
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.', 'Règle des puissances à l’envers : augmenter l’exposant de 1, diviser par le nouvel exposant, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.'],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.', 'Règles de la somme et du facteur constant : chaque terme s’intègre séparément, un facteur reste. Une constante $a$ a pour primitive $ax$.'],
        ['$\\sqrt{x} = x^{\\frac12}$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$\\sqrt{x} = x^{\\frac12}$ : exposant $\\tfrac12 + 1 = \\tfrac32$ ; diviser par $\\tfrac32$, c’est multiplier par $\\tfrac23$.'],
        ['$\\tfrac{1}{x^2} = x^{-2}$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.', '$\\tfrac{1}{x^2} = x^{-2}$ : exposant $-1$, diviser par $-1$, donc $-x^{-1} = -\\tfrac1x$.'],
        ['$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$ : exposant $\\tfrac12$ ; diviser par $\\tfrac12$, c’est doubler.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.', 'La règle des puissances vaut pour tout exposant $r \\neq -1$ : $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.'],
        ['$\\mathrm{e}^x$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$\\mathrm{e}^x$ est sa propre dérivée, donc aussi sa propre primitive.'],
        ['Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.', 'L’exception de la règle des puissances : $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Pour $x > 0$, $\\ln x$ suffit.'],
        ['$(\\cos x)\' = -\\sin x$, also $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.', '$(\\cos x)\' = -\\sin x$, donc $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.'],
        ['$(\\sin x)\' = \\cos x$, also $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.', '$(\\sin x)\' = \\cos x$, donc $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.'],
        ['Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', 'Composée avec une fonction affine : $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Vérification : la règle de la chaîne donne le facteur $a$, que $\\tfrac1a$ compense.'],
        ['$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$ : d’abord la primitive de $\\sin$, puis diviser par la dérivée intérieure $a$.'],
        ['$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$ : règle des puissances pour la parenthèse, puis diviser par la dérivée intérieure.'],
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
