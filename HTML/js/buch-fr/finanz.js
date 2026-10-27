/* js/buch-fr/finanz.js — French for the widgets of js/buch-finanz.js.
 * Loaded by the French editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the block comments. Five books are translated at the same time, each has its own
 * comment line in word, phrase and rule - write only right below your book's line, every entry ending with a comma, so
 * the books merge without a conflict. The Italian file js/buch-it/finanz.js shows which German strings the widgets
 * write.
 */
window.BuchFR && BuchFR.add('finanz', {
    word: {
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // zins
        'Startkapital $K_0$ in €': 'Capital de départ $K_0$ en €',
        'Zinssatz $p$': 'Taux d’intérêt $p$',
        'Laufzeit $n$': 'Durée $n$',
        'Jahre': 'années',
        'Jahr': 'Année',
        'Kapital in €': 'Capital en €',
        'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung': 'Le capital année après année : intérêts composés et intérêts simples',
        'mit Zinseszins &nbsp;': 'avec intérêts composés &nbsp;',
        'einfache Verzinsung (die Zinsen werden nicht mitverzinst)': 'intérêts simples (les intérêts ne rapportent pas d’intérêts)',
        'doppeltes Startkapital': 'double du capital de départ',
        // tilgung
        'Annuitätendarlehen': 'Annuités constantes',
        'Ratentilgung': 'Amortissement constant',
        'Sparplan': 'Plan d’épargne',
        'Kredit $S_0$ in €': 'Emprunt $S_0$ en €',
        'Sparrate je Jahr $R$ in €': 'Versement annuel $R$ en €',
        'Zahlungen Jahr für Jahr als gestapelte Säulen': 'Versements année après année en colonnes empilées',
        'Kapital am Anfang': 'Capital au début',
        'Zinsen': 'Intérêts',
        'Einzahlung': 'Versement',
        'Kapital am Ende': 'Capital à la fin',
        'Restschuld am Anfang': 'Capital restant dû au début',
        'Tilgung': 'Amortissement',
        'Rate': 'Échéance',
        'Restschuld am Ende': 'Capital restant dû à la fin',
        'eingezahlt &nbsp;': 'versé &nbsp;',
        'Zinsen (Kapital am Jahresende)': 'intérêts (capital en fin d’année)',
        'Zinsen &nbsp;': 'intérêts &nbsp;',
        'Tilgung (zusammen: die Rate)': 'amortissement (ensemble : l’échéance)',
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-18 mathe7-fr:
        // book fr-19 mathe8-fr:
        // book fr-21 mathe10-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // zins
        ['Zinseszins: $', 'Intérêts composés : $'],
        ['Einfache Verzinsung: $', 'Intérêts simples : $'],
        ['$ € · Zinseszins bringt <b>', '$ € · les intérêts composés rapportent <b>'],
        ['</b> mehr', '</b> de plus'],
        ['Verdopplung nach $n = ', 'Doublement au bout de $n = '],
        ['$ Jahren (Faustregel $', '$ ans (règle empirique $'],
        // tilgung
        ['Endkapital: $', 'Capital final : $'],
        ['Eingezahlt: ', 'Versé : '],
        [' · Zinsen: <b>', ' · intérêts : <b>'],
        ['</b> (Einzahlung jeweils am Jahresende)', '</b> (chaque versement en fin d’année)'],
        ['Annuität (jedes Jahr gleich): $', 'Annuité (la même chaque année) : $'],
        ['Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>', 'Les intérêts diminuent chaque année, l’amortissement augmente. Intérêts au total : <b>'],
        ['Tilgung (jedes Jahr gleich): $', 'Amortissement (le même chaque année) : $'],
        ['$ € · erste Rate ', '$ € · première échéance '],
        [', letzte Rate ', ', dernière échéance '],
        ['Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>', 'L’échéance diminue, car le capital restant dû et donc les intérêts diminuent. Intérêts au total : <b>'],
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-18 mathe7-fr:
        // book fr-19 mathe8-fr:
        // book fr-21 mathe10-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // slider values: "20 J." → "20 ans" (1 → "1 an")
        [/^(\d+) J\.$/, (m, n) => n + (n === '1' ? ' an' : ' ans')],
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-18 mathe7-fr:
        // book fr-19 mathe8-fr:
        // book fr-21 mathe10-fr:
    ]
});
