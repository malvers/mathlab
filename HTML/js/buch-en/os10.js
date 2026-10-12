/* js/buch-en/os10.js — English for the widgets of js/buch-os10.js.
 * Loaded by the English editions right after js/buch-os10.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('os10', {
    word: {
        // titelbildos10
        'Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel':
            'Cover: a triangle with the angles α, β and γ, a sine curve, an exponential curve, a frustum of a cone and a dice',
        // stumpfos10
        'Kegelstumpf': 'Frustum of a cone',
        'Radius unten $R$': 'Radius at the bottom $R$', 'Kante unten $a_1$': 'Edge at the bottom $a_1$',
        'Radius oben $r$': 'Radius at the top $r$', 'Kante oben $a_2$': 'Edge at the top $a_2$',
        'Holz': 'Wood', 'Beton': 'Concrete', 'Stahl': 'Steel', 'Zylinder': 'Cylinder',
        'Kegelstumpf im Achsenschnitt und als Körper': 'Frustum of a cone in axial section and as a solid',
        'Pyramidenstumpf im Achsenschnitt und als Körper': 'Frustum of a pyramid in axial section and as a solid',
        // lohnos10
        'Rentenversicherung': 'Pension insurance', 'Krankenversicherung': 'Health insurance', 'Pflegeversicherung': 'Long-term care insurance',
        'Arbeitslosen­versicherung': 'Unemployment insurance',
        'Bruttolohn im Monat': 'Gross wage per month', 'Lohnsteuer (angenommen)': 'Income tax (assumed)',
        'Netto': 'Net', 'Lohnsteuer': 'Income tax', 'Sozialabgaben': 'Social security contributions', 'Arbeitgeberanteil': 'Employer’s contribution',
        'Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers':
            'Gross wage split into net pay, income tax and social security contributions; to the right of the dashed line the employer’s share',
        'Posten': 'Item', 'Prozentsatz': 'Percentage', 'Betrag im Monat': 'Amount per month', 'Nettolohn': 'Net wage'
    },
    phrase: [
        // stumpfos10: the segment button (gy7 has "Frustum" as a word, which is not loaded here) and the sentences under the drawing
        ['Pyramidenstumpf', 'Frustum of a pyramid'],
        ['Als Differenz: ', 'As a difference: '], ['ganzer Kegel', 'whole cone'], ['ganze Pyramide', 'whole pyramid'], [' (Höhe $', ' (height $'],
        [' minus abgeschnittene Spitze ', ' minus the cut-off tip '], ['Mantellinie $s = ', 'Slant height $s = '], ['$ cm, Mantel $M = ', '$ cm, curved surface $M = '],
        ['Oben und unten gleich groß: das ist ein ', 'Top and bottom are the same size: this is a '], ['Oben und unten gleich groß: das ist ein Zylinder', 'Top and bottom are the same size: this is a cylinder'],
        ['Quader mit quadratischer Grundfläche', 'cuboid with a square base'],
        ['Holz (', 'Wood ('], ['Beton (', 'Concrete ('], ['Stahl (', 'Steel ('], ['): Masse ', '): mass '],
        [' im Achsenschnitt und als Körper', ' in axial section and as a solid'],
        // lohnos10: the legend under the bar and the sentence under the table
        ['Netto', 'Net'], ['Lohnsteuer', 'Income tax'], ['Sozialabgaben', 'Social security contributions'], ['Arbeitgeberanteil', 'Employer’s contribution'],
        ['gestrichelt: Ende des Bruttolohns ', 'dashed: end of the gross wage '],
        ['Alle Sätze sind angenommen und vereinfacht. Abzüge zusammen ', 'All rates are assumed and simplified. Total deductions '],
        [' % des Bruttolohns. ', '% of the gross wage. '],
        ['Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ',
            'The company pays the social security contributions a second time as the employer’s contribution: the job costs it '],
        [' im Monat.', ' a month.']
    ],
    rule: [
        // money: "223.20 €" (js/buch-os10.js writes the decimal point itself on English pages) → "€223.20"
        [/(?<![\d.,])(\d+(?:\.\d{2})?)[\u00a0 ]€/g, '€$1'],
        // the rates in the table: "9.3\u00a0%" → "9.3%" (js/buch-en.js does this only for a normal space)
        [/(\d)\u00a0%/g, '$1%'],
        // TeX thousands with a thin space: 15\,783 → 15{,}783 (after the decimal rule of js/buch-en.js)
        [/(?<=\d)\\,(?=\d{3}(?!\d))/g, '{,}']
    ]
});
