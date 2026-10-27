/* js/buch-fr/os10.js — French for the widgets of js/buch-os10.js.
 * Loaded by the French editions right after js/buch-os10.js; the engine and the shared words are in js/buch-fr.js.
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
 * js/buch-it/os10.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os10', {
    word: {
        // book fr-21 mathe10-fr:
        // titelbildos10
        'Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel':
            'Couverture : un triangle avec les angles α, β et γ, une sinusoïde, une courbe exponentielle, un tronc de cône et un dé',
        // stumpfos10 (chapter 4.2): the frustum, the sliders, the materials (gy7 has 'Stahl' and 'Pyramidenstumpf' too, but
        // the pages of this book do not load it); the base areas are 𝓑₁, 𝓑₂ and the lateral area A_L, as the page text says
        'Kegelstumpf': 'Tronc de cône', 'Pyramidenstumpf': 'Tronc de pyramide', 'Material': 'Matériau',
        'Holz': 'Bois', 'Beton': 'Béton', 'Stahl': 'Acier',
        'Radius unten $R$': 'Rayon en bas $R$', 'Radius oben $r$': 'Rayon en haut $r$', 'Kante unten $a_1$': 'Arête en bas $a_1$', 'Kante oben $a_2$': 'Arête en haut $a_2$',
        'Kegelstumpf im Achsenschnitt und als Körper': 'Tronc de cône : coupe axiale et vue du solide',
        'Pyramidenstumpf im Achsenschnitt und als Körper': 'Tronc de pyramide : coupe axiale et vue du solide',
        'Oben und unten gleich groß: das ist ein Zylinder, $V = G \\cdot h$.': 'En haut et en bas, la même taille : c’est un cylindre, $V = \\mathcal{B} \\times h$.',
        'Oben und unten gleich groß: das ist ein Quader mit quadratischer Grundfläche, $V = G \\cdot h$.':
            'En haut et en bas, la même taille : c’est un pavé droit à base carrée, $V = \\mathcal{B} \\times h$.',
        // lohnos10 (chapter 4.1): the payslip; German "Lohnsteuer" is the income tax taken from the pay (prélèvement à la source)
        'Bruttolohn im Monat': 'Salaire brut mensuel', 'Lohnsteuer (angenommen)': 'Impôt sur le revenu (supposé)',
        'Rentenversicherung': 'Assurance retraite', 'Krankenversicherung': 'Assurance maladie', 'Pflegeversicherung': 'Assurance dépendance',
        'Arbeitslosen\u00adversicherung': 'Assurance chômage',
        'Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers':
            'Salaire brut réparti en net, impôt sur le revenu et cotisations sociales ; à droite de la ligne en pointillés, la part patronale',
        'Posten': 'Poste', 'Prozentsatz': 'Taux', 'Betrag im Monat': 'Montant mensuel', 'Lohnsteuer': 'Impôt sur le revenu', 'Nettolohn': 'Salaire net',
    },
    phrase: [
        // book fr-21 mathe10-fr:
        // stumpfos10: the volume as a difference, the material with its density
        ['Als Differenz: ', 'Par différence : '], ['ganzer Kegel', 'cône entier'], ['ganze Pyramide', 'pyramide entière'],
        [' (Höhe $', ' (hauteur $'], [' minus abgeschnittene Spitze ', ' moins la pointe coupée '],
        ['Holz (', 'Bois ('], ['Beton (', 'Béton ('], ['Stahl (', 'Acier ('], ['): Masse ', ') : masse '],
        // lohnos10: the legend under the bar
        ['Netto', 'Net'], ['Sozialabgaben', 'Cotisations sociales'], ['Arbeitgeberanteil', 'Part patronale'],
        ['gestrichelt: Ende des Bruttolohns ', 'en pointillés : fin du salaire brut '],
    ],
    rule: [
        // book fr-21 mathe10-fr:
        // stumpfos10, the cone: lateral area A_L and slant height g (js/buch-fr/geometrie.js has turned "Mantellinie $s = " into
        // "Génératrice $g = " already, on the page of chapter 4.2 that loads it)
        [/\$ cm, Mantel \$M = \\pi s \(R \+ r\)/g, '$$ cm, aire latérale $$A_L = \\pi g (R + r)'],
        // stumpfos10, the pyramid: the base areas 𝓑₁ and 𝓑₂ (German G₁, G₂)
        [/\\bigl\(G_1 \+ \\sqrt\{G_1 G_2\} \+ G_2\\bigr\)/g, '\\bigl(\\mathcal{B}_1 + \\sqrt{\\mathcal{B}_1 \\mathcal{B}_2} + \\mathcal{B}_2\\bigr)'],
        // lohnos10: the summary under the table, with the French no-break spaces before € and %
        [/Alle Sätze sind angenommen und vereinfacht\. Abzüge zusammen ([^€<]+) €, das sind ([^%<]+) % des Bruttolohns\. Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ([^€<]+) € im Monat\./g,
            (m, a, p, k) => 'Tous les taux sont supposés et simplifiés. Prélèvements au total : ' + a + ' €, soit ' + p + ' % du salaire brut. ' +
                'L’entreprise paie les cotisations sociales une seconde fois, comme part patronale : le poste lui coûte ' + k + ' € par mois.'],
    ]
});
