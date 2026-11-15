/* js/buch-pt/finanz.js — Portuguese for the widgets of js/buch-finanz.js.
 * Loaded by the Portuguese editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-6-prep (15.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('finanz', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs finanz/*)
        // book pt-6 mathefos11-pt:
        // zins (letters K and p as on the German pages)
        'Startkapital $K_0$ in €': 'Capital inicial $K_0$ em €',
        'Zinssatz $p$': 'Taxa de juro $p$',
        'Laufzeit $n$': 'Prazo $n$',
        'Jahre': 'anos',
        'Kapital in €': 'Capital em €',
        'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung': 'O capital ano após ano: juro composto e juro simples',
        'mit Zinseszins &nbsp;': 'com juro composto &nbsp;',
        'einfache Verzinsung (die Zinsen werden nicht mitverzinst)': 'juro simples (os juros não rendem juros)',
        'doppeltes Startkapital': 'o dobro do capital inicial',
        // tilgung
        'Annuitätendarlehen': 'Amortização por anuidades',
        'Ratentilgung': 'Amortização constante',
        'Sparplan': 'Plano de poupança',
        'Modell': 'Modelo',
        'Kredit $S_0$ in €': 'Empréstimo $S_0$ em €',
        'Sparrate je Jahr $R$ in €': 'Depósito anual $R$ em €',
        'Zahlungen Jahr für Jahr als gestapelte Säulen': 'Pagamentos ano após ano em barras empilhadas',
        'Kapital am Anfang': 'Capital no início',
        'Zinsen': 'Juros',
        'Einzahlung': 'Depósito',
        'Kapital am Ende': 'Capital no fim',
        'Restschuld am Anfang': 'Dívida no início',
        'Tilgung': 'Amortização',
        'Rate': 'Prestação',
        'Restschuld am Ende': 'Dívida no fim',
        'eingezahlt &nbsp;': 'depositado &nbsp;',
        'Zinsen (Kapital am Jahresende)': 'juros (capital no fim do ano)',
        'Zinsen &nbsp;': 'juros &nbsp;',
        'Tilgung (zusammen: die Rate)': 'amortização (juntos: a prestação)',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs finanz/*)
        // book pt-6 mathefos11-pt:
        // zins
        ['Zinseszins: $', 'Juro composto: $'],
        ['Einfache Verzinsung: $', 'Juro simples: $'],
        ['$ € · Zinseszins bringt <b>', '$ € · o juro composto rende mais <b>'],
        ['</b> mehr', '</b>'],
        ['Verdopplung nach $n = ', 'Duplicação ao fim de $n = '],
        ['$ Jahren (Faustregel $', '$ anos (regra dos 72: $'],
        // tilgung
        ['Endkapital: $', 'Capital acumulado: $'],
        ['Eingezahlt: ', 'Depositado: '],
        [' · Zinsen: <b>', ' · juros: <b>'],
        ['</b> (Einzahlung jeweils am Jahresende)', '</b> (cada depósito no fim do ano)'],
        ['Annuität (jedes Jahr gleich): $', 'Anuidade (igual todos os anos): $'],
        ['Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>', 'Os juros diminuem todos os anos, a amortização cresce. Juros no total: <b>'],
        ['Tilgung (jedes Jahr gleich): $', 'Amortização (igual todos os anos): $'],
        ['$ € · erste Rate ', '$ € · primeira prestação '],
        [', letzte Rate ', ', última prestação '],
        ['Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>', 'A prestação desce, porque a dívida em falta e, com ela, os juros descem. Juros no total: <b>'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-6 mathefos11-pt:
        // slider values: "20 J." → "20 anos" (1 → "1 ano")
        [/^(\d+) J\.$/, (m, n) => n + (n === '1' ? ' ano' : ' anos')],
    ]
});
