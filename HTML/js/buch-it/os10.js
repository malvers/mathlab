/* js/buch-it/os10.js — Italian for the widgets of js/buch-os10.js.
 * Loaded by the Italian editions right after js/buch-os10.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/os10.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('os10', {
    word: {
        // book it-20 mathe10-it:
        'Material': 'Materiale',
        'Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel': 'Copertina: un triangolo con gli angoli α, β e γ, una sinusoide, una curva esponenziale, un tronco di cono e un dado',
        'Kegelstumpf': 'Tronco di cono',
        'Radius unten $R$': 'Raggio inferiore $R$',
        'Kante unten $a_1$': 'Spigolo inferiore $a_1$',
        'Radius oben $r$': 'Raggio superiore $r$',
        'Kante oben $a_2$': 'Spigolo superiore $a_2$',
        'Holz': 'Legno',
        'Beton': 'Calcestruzzo',
        'Stahl': 'Acciaio',
        'Rentenversicherung': 'Assicurazione pensionistica',
        'Krankenversicherung': 'Assicurazione sanitaria',
        'Pflegeversicherung': 'Assicurazione per la non autosufficienza',
        'Arbeitslosen­versicherung': 'Assicurazione contro la disoccupazione',
        'Bruttolohn im Monat': 'Stipendio lordo mensile',
        'Lohnsteuer (angenommen)': 'Imposta sul reddito (ipotizzata)',
        'Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers': 'Stipendio lordo suddiviso in netto, imposta sul reddito e contributi sociali; a destra della linea tratteggiata la quota del datore di lavoro',
        'Posten': 'Voce',
        'Prozentsatz': 'Percentuale',
        'Betrag im Monat': 'Importo mensile',
        'Nettolohn': 'Stipendio netto',

    },
    phrase: [
        // book it-20 mathe10-it:
        ['Lohnsteuer', 'Imposta sul reddito'],
        ['Sozialabgaben', 'Contributi sociali'],
        ['Arbeitgeberanteil', 'Quota del datore di lavoro'],
        ['Pyramidenstumpf', 'Tronco di piramide'],
        ['Als Differenz: ', 'Come differenza: '],
        ['ganzer Kegel', 'cono intero'],
        ['ganze Pyramide', 'piramide intera'],
        [' (Höhe $', ' (altezza $'],
        [' minus abgeschnittene Spitze ', ' meno la punta tagliata '],
        ['$ cm, Mantel $M = ', '$ cm, superficie laterale $M = '],
        ['): Masse ', '): massa '],
        [' im Achsenschnitt und als Körper', ' in sezione assiale e come solido'],
        ['gestrichelt: Ende des Bruttolohns ', 'tratteggiata: fine dello stipendio lordo '],
        ['Alle Sätze sind angenommen und vereinfacht. Abzüge zusammen ', 'Tutte le aliquote sono ipotizzate e semplificate. Trattenute in tutto: '],
        [' % des Bruttolohns. ', ' % dello stipendio lordo. '],
        ['Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ', 'L’azienda paga i contributi sociali un’altra volta come quota del datore di lavoro: il posto le costa '],
        [' € im Monat.', ' € al mese.'],
        // stumpfos10: the whole sentences instead of the pieces of es (the gender after "ein")
        ['Oben und unten gleich groß: das ist ein Zylinder, $V = G \\cdot h$.', 'Sopra e sotto della stessa grandezza: è un cilindro, $V = G \\cdot h$.'],
        ['Oben und unten gleich groß: das ist ein Quader mit quadratischer Grundfläche, $V = G \\cdot h$.', 'Sopra e sotto della stessa grandezza: è un parallelepipedo a base quadrata, $V = G \\cdot h$.'],
        ['Kegelstumpf im Achsenschnitt und als Körper', 'Tronco di cono in sezione assiale e come solido'],

    ],
    rule: [
        // book it-20 mathe10-it:

    ]
});
