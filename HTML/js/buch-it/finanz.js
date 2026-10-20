/* js/buch-it/finanz.js — Italian for the widgets of js/buch-finanz.js.
 * Loaded by the Italian editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/finanz.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('finanz', {
    word: {
        // book it-4 mathefos11-it:
        // zins
        'Startkapital $K_0$ in €': 'Capitale iniziale $K_0$ in €', 'Zinssatz $p$': 'Tasso d’interesse $p$', 'Laufzeit $n$': 'Durata $n$',
        'Kapital in €': 'Capitale in €', 'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung': 'Capitale anno per anno: interesse composto e interesse semplice',
        'mit Zinseszins &nbsp;': 'con interesse composto &nbsp;', 'einfache Verzinsung (die Zinsen werden nicht mitverzinst)': 'interesse semplice (gli interessi non producono interessi)',
        'doppeltes Startkapital': 'doppio del capitale iniziale',
        // tilgung
        'Annuitätendarlehen': 'Rate costanti', 'Ratentilgung': 'Quote capitale costanti', 'Sparplan': 'Piano di risparmio',
        'Kredit $S_0$ in €': 'Prestito $S_0$ in €', 'Sparrate je Jahr $R$ in €': 'Versamento annuo $R$ in €',
        'Zahlungen Jahr für Jahr als gestapelte Säulen': 'Pagamenti anno per anno come colonne sovrapposte',
        'Kapital am Anfang': 'Capitale all’inizio', 'Zinsen': 'Interessi', 'Einzahlung': 'Versamento', 'Kapital am Ende': 'Capitale alla fine',
        'Restschuld am Anfang': 'Debito residuo all’inizio', 'Tilgung': 'Quota capitale', 'Rate': 'Rata', 'Restschuld am Ende': 'Debito residuo alla fine',
        'eingezahlt &nbsp;': 'versato &nbsp;', 'Zinsen (Kapital am Jahresende)': 'interessi (capitale a fine anno)',
        'Zinsen &nbsp;': 'interessi &nbsp;', 'Tilgung (zusammen: die Rate)': 'quota capitale (insieme: la rata)',

    },
    phrase: [
        // book it-4 mathefos11-it:
        // zins
        ['Zinseszins: $', 'Interesse composto: $'], ['Einfache Verzinsung: $', 'Interesse semplice: $'],
        ['$ € · Zinseszins bringt <b>', '$ € · l’interesse composto porta <b>'], ['</b> mehr', '</b> in più'],
        ['Verdopplung nach $n = ', 'Raddoppio dopo $n = '], ['$ Jahren (Faustregel $', '$ anni (regola empirica $'],
        // tilgung
        ['Endkapital: $', 'Montante: $'], ['Eingezahlt: ', 'Versato: '], [' · Zinsen: <b>', ' · interessi: <b>'],
        ['</b> (Einzahlung jeweils am Jahresende)', '</b> (ogni versamento a fine anno)'],
        ['Annuität (jedes Jahr gleich): $', 'Rata (uguale ogni anno): $'],
        ['Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>', 'Gli interessi diminuiscono ogni anno, la quota capitale cresce. Interessi in tutto: <b>'],
        ['Tilgung (jedes Jahr gleich): $', 'Quota capitale (uguale ogni anno): $'], ['$ € · erste Rate ', '$ € · prima rata '], [', letzte Rate ', ', ultima rata '],
        ['Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>',
            'La rata diminuisce perché diminuiscono il debito residuo e con esso gli interessi. Interessi in tutto: <b>'],

    ],
    rule: [
        // book it-4 mathefos11-it:
        // slider values: "20 J." → "20 anni" (1 → "1 anno")
        [/^(\d+) J\.$/, (m, n) => n + (n === '1' ? ' anno' : ' anni')],

    ]
});
