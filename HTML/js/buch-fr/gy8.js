/* js/buch-fr/gy8.js — French for the widgets of js/buch-gy8.js.
 * Loaded by the French editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/gy8.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy8', {
    word: {
        // book fr-15 mathegy8-fr:
        // titelbildgy8
        'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
            'Couverture : un triangle agrandi à partir d’un centre, un carré formé de a², deux fois ab et b², deux droites avec leur point d’intersection et un arbre pondéré',
        // termbaum8 ('Term' → 'Expression' is in js/buch-fr/exponential.js, which this book does not load)
        'Term': 'Expression', 'Wert für $x$': 'Valeur de $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Touche un nœud : sa sous-expression s’allume.',
    },
    phrase: [
        // book fr-15 mathegy8-fr:
        // termbaum8 (the sentences with the term in them are rules below; these pieces let check.mjs see them translated)
        ['Rechenbaum des Terms ', 'Arbre de calcul de l’expression '], ['. Gerechnet wird von unten nach oben.', '. On calcule du bas vers le haut.'],
        ['Summanden', 'Termes'], ['Minuend und Subtrahend', 'Premier et second terme'], ['Faktoren', 'Facteurs'], ['Dividend und Divisor', 'Dividende et diviseur'],
    ],
    rule: [
        // book fr-15 mathegy8-fr:
        // French school notation (Doc, 26.10.2026, as OS 5 in js/buch-fr/gy5.js): × for the product, in TeX and in plain text
        // between two numbers; on every page of this book (the dot as a separator stays)
        [/\\cdot(?![a-zA-Z])/g, '\\times'], [/(\d|\)) · (?=[\d(])/g, '$1 × '],
        // termbaum8: the product node is drawn as a dot; French pupils write × (the same text style as + − :)
        [/<circle cx="([\d.]+)" cy="([\d.]+)" r="4\.2" style="fill:rgb\(245,194,66\)"\/>/g,
            (m, x, y) => '<text class="tb8-op" x="' + x + '" y="' + (Math.round((+y + 1) * 10) / 10) + '" text-anchor="middle" dominant-baseline="middle">×</text>'],
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$." and the selected node
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'L’expression $' + t + '$ est ' + ({ Summe: 'une <b>somme</b>', Differenz: 'une <b>différence</b>', Produkt: 'un <b>produit</b>', Quotient: 'un <b>quotient</b>', Potenz: 'une <b>puissance</b>' })[k] +
                ' : la dernière opération est ' + ({ Summe: 'une addition', Differenz: 'une soustraction', Produkt: 'une multiplication', Quotient: 'une division', Potenz: 'l’élévation à la puissance' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Termes', 'Minuend und Subtrahend': 'Premier et second terme', 'Faktoren': 'Facteurs', 'Dividend und Divisor': 'Dividende et diviseur' })[p] + ' : $' + a + '$ et $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, exposant $' + b + '$.'],
        [/Für \$x = ([^$]*)\$ hat er den Wert /g, (m, v) => 'Pour $x = ' + v + '$, elle a la valeur '],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$([^$]*)\$\./g,
            (m, t, k, v) => 'Sélection : la sous-expression $' + t + '$, ' + ({ Summe: 'une somme', Differenz: 'une différence', Produkt: 'un produit', Quotient: 'un quotient', Potenz: 'une puissance' })[k] + ' de valeur $' + v + '$.'],
        [/Ausgewählt: die Variable \$x\$ mit dem Wert \$([^$]*)\$\./g, (m, v) => 'Sélection : la variable $x$, de valeur $' + v + '$.'],
        [/Ausgewählt: die Zahl \$([^$]*)\$\./g, (m, v) => 'Sélection : le nombre $' + v + '$.'],
    ]
});
