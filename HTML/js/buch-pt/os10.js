/* js/buch-pt/os10.js — Portuguese for the widgets of js/buch-os10.js.
 * Loaded by the Portuguese editions right after js/buch-os10.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-18-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('os10', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os10/*)
        // book pt-19 mathe10-pt:
        // titelbildos10 (the die of chapter 3, as the other editions read it)
        'Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel':
            'Capa: um triângulo com os ângulos α, β e γ, uma sinusoide, uma curva exponencial, um tronco de cone e um dado',
        // stumpfos10 (chapter 4.2): the frustum, the sliders, the materials; the two bases A_1 (inferior) and A_2 (superior),
        // the base area A_b and the lateral area A_L as in GY 9 and the page text
        'Kegelstumpf': 'Tronco de cone', 'Pyramidenstumpf': 'Tronco de pirâmide', 'Material': 'Material', 'Körper': 'Sólido',
        'Holz': 'Madeira', 'Beton': 'Betão', 'Stahl': 'Aço',
        'Radius unten $R$': 'Raio inferior $R$', 'Radius oben $r$': 'Raio superior $r$', 'Kante unten $a_1$': 'Aresta inferior $a_1$', 'Kante oben $a_2$': 'Aresta superior $a_2$',
        'Höhe $h$': 'Altura $h$',
        'Kegelstumpf im Achsenschnitt und als Körper': 'Tronco de cone: corte axial e vista do sólido',
        'Pyramidenstumpf im Achsenschnitt und als Körper': 'Tronco de pirâmide: corte axial e vista do sólido',
        'Oben und unten gleich groß: das ist ein Zylinder, $V = G \\cdot h$.': 'Em cima e em baixo com a mesma medida: é um cilindro, $V = A_b \\times h$.',
        'Oben und unten gleich groß: das ist ein Quader mit quadratischer Grundfläche, $V = G \\cdot h$.':
            'Em cima e em baixo com a mesma medida: é um paralelepípedo de base quadrada, $V = A_b \\times h$.',
        // lohnos10 (chapter 4.1): the German payslip; Lohnsteuer is the income tax withheld from the pay (in Portugal the IRS)
        'Bruttolohn im Monat': 'Salário bruto mensal', 'Lohnsteuer (angenommen)': 'IRS (taxa suposta)',
        'Rentenversicherung': 'Seguro de reforma', 'Krankenversicherung': 'Seguro de saúde', 'Pflegeversicherung': 'Seguro de dependência',
        'Arbeitslosen\u00adversicherung': 'Seguro de desemprego',
        'Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers':
            'Salário bruto repartido em líquido, IRS e contribuições sociais; à direita da linha tracejada, a parte da entidade empregadora',
        'Posten': 'Rubrica', 'Prozentsatz': 'Taxa', 'Betrag im Monat': 'Montante mensal', 'Lohnsteuer': 'IRS', 'Nettolohn': 'Salário líquido',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os10/*)
        // book pt-19 mathe10-pt:
        // stumpfos10: the volume as a difference, the material with its density
        ['Als Differenz: ', 'Como diferença: '], ['ganzer Kegel', 'cone inteiro'], ['ganze Pyramide', 'pirâmide inteira'],
        [' (Höhe $', ' (altura $'], [' minus abgeschnittene Spitze ', ' menos a ponta cortada '],
        ['Holz (', 'Madeira ('], ['Beton (', 'Betão ('], ['Stahl (', 'Aço ('], ['): Masse ', '): massa '],
        // lohnos10: the legend under the bar
        ['Netto', 'Líquido'], ['Lohnsteuer', 'IRS'], ['Sozialabgaben', 'Contribuições sociais'], ['Arbeitgeberanteil', 'Parte da entidade empregadora'],
        // lohnos10: the summary under the table, in the pieces the widget writes
        ['Alle Sätze sind angenommen und vereinfacht. Abzüge zusammen ', 'Todas as taxas são supostas e simplificadas. Descontos no total: '],
        [' €, das sind ', ' €, ou seja, '], [' % des Bruttolohns. ', ' % do salário bruto. '],
        ['Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ',
            'A empresa paga as contribuições sociais mais uma vez, como parte da entidade empregadora: o posto de trabalho custa-lhe '],
        [' € im Monat.', ' € por mês.'],
        ['gestrichelt: Ende des Bruttolohns ', 'tracejado: fim do salário bruto '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-19 mathe10-pt:
        // stumpfos10, the cone: slant height g (geratriz) and lateral area A_L, as GY 9 and the page text
        [/Mantellinie \$s = \\sqrt\{h\^2 \+ \(R - r\)\^2\}/g, 'Geratriz $g = \\sqrt{h^2 + (R - r)^2}'],
        [/\$ cm, Mantel \$M = \\pi s \(R \+ r\)/g, '$ cm, área lateral $A_L = \\pi g (R + r)'],
        // stumpfos10, the pyramid: the areas of the two bases A_1 (inferior) and A_2 (superior), German G_1 and G_2
        [/\\bigl\(G_1 \+ \\sqrt\{G_1 G_2\} \+ G_2\\bigr\)/g, '\\bigl(A_1 + \\sqrt{A_1 A_2} + A_2\\bigr)'],
    ]
});
