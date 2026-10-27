/* js/buch-fr/os7.js — French for the widgets of js/buch-os7.js.
 * Loaded by the French editions right after js/buch-os7.js; the engine and the shared words are in js/buch-fr.js.
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
 * js/buch-it/os7.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os7', {
    word: {
        // book fr-18 mathe7-fr:
        // titelbildos7
        'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm':
            'Couverture : une grille de cent cases dont 25 sont allumées, un pavage d’hexagones, une droite graduée de moins 3 à 3, un prisme et un diagramme circulaire',
        // tageszinsos7 (French letters: capital C, taux t %, jours j, intérêts I - German K, p %, t, Z; the formulas are rules below)
        'Kapital $K$': 'Capital $C$', 'Zinssatz $p\\,\\%$': 'Taux d’intérêt $t\\,\\%$', 'Tage $t$': 'Jours $j$', '360 Tage': '360 jours',
        'Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.':
            'Pour les banques, une année bancaire compte le plus souvent 360 jours et chaque mois 30 jours. On n’arrondit au centime qu’à la fin.',
    },
    phrase: [
        // book fr-18 mathe7-fr:
        // tageszinsos7
        ['Jahreszinsen: ', 'Intérêts annuels : '],
    ],
    rule: [
        // book fr-18 mathe7-fr:
        // tageszinsos7: "90 Tage", "1 Tag" on the slider and in the picture, the formulas with the French letters, the label of the picture
        [/^1 Tag$/, '1 jour'], [/^(\d+) Tage$/, '$1 jours'], [/>1 Tag</g, '>1 jour<'], [/>(\d+) Tage</g, '>$1 jours<'],
        [/\$Z = K \\(?:cdot|times) \\dfrac\{p\}\{100\} = /g, '$I = C \\times \\dfrac{t}{100} = '],
        [/für \$(\d+)\$ (Tag|Tage): \$Z = /g, (m, t, w) => 'pour $' + t + '$ ' + (w === 'Tag' ? 'jour' : 'jours') + ' : $I = '],
        [/Zinsjahr mit 360 Tagen, davon (\d+) Tage; Jahreszinsen und Tageszinsen als Säulen/,
            (m, t) => 'Année bancaire de 360 jours, dont ' + t + (t === '1' ? ' jour' : ' jours') + ' ; intérêts annuels et intérêts de ces jours en colonnes'],
    ]
});
