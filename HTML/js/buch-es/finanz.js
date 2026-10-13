/* js/buch-es/finanz.js — Spanish for the widgets of js/buch-finanz.js.
 * Loaded by the Spanish editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('finanz', {
    word: {
        // book es mathe10-es (Curie)

        // book es mathefos11-es (Lovelace)
        // zins
        'Startkapital $K_0$ in €': 'Capital inicial $K_0$ en €', 'Zinssatz $p$': 'Tipo de interés $p$', 'Laufzeit $n$': 'Plazo $n$',
        'Jahre': 'años', 'Kapital in €': 'Capital en €', 'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung': 'Capital año a año: interés compuesto e interés simple',
        'mit Zinseszins &nbsp;': 'con interés compuesto &nbsp;', 'einfache Verzinsung (die Zinsen werden nicht mitverzinst)': 'interés simple (los intereses no producen intereses)',
        'doppeltes Startkapital': 'doble del capital inicial',
        // tilgung
        'Annuitätendarlehen': 'Préstamo por anualidades', 'Ratentilgung': 'Cuotas de capital constantes', 'Sparplan': 'Plan de ahorro',
        'Kredit $S_0$ in €': 'Préstamo $S_0$ en €', 'Sparrate je Jahr $R$ in €': 'Aportación anual $R$ en €', 'Jahr': 'Año',
        'Zahlungen Jahr für Jahr als gestapelte Säulen': 'Pagos año a año como barras apiladas',
        'Kapital am Anfang': 'Capital al principio', 'Zinsen': 'Intereses', 'Einzahlung': 'Aportación', 'Kapital am Ende': 'Capital al final',
        'Restschuld am Anfang': 'Deuda pendiente al principio', 'Tilgung': 'Amortización', 'Rate': 'Cuota', 'Restschuld am Ende': 'Deuda pendiente al final',
        'eingezahlt &nbsp;': 'aportado &nbsp;', 'Zinsen (Kapital am Jahresende)': 'intereses (capital al final del año)',
        'Zinsen &nbsp;': 'intereses &nbsp;', 'Tilgung (zusammen: die Rate)': 'amortización (juntas: la cuota)',

        // book es mathegy10-es (offen)

    },
    phrase: [
        // book es mathe10-es (Curie)

        // book es mathefos11-es (Lovelace)
        // zins
        ['Zinseszins: $', 'Interés compuesto: $'], ['Einfache Verzinsung: $', 'Interés simple: $'],
        ['$ € · Zinseszins bringt <b>', '$ € · el interés compuesto aporta <b>'], ['</b> mehr', '</b> más'],
        ['Verdopplung nach $n = ', 'Se duplica tras $n = '], ['$ Jahren (Faustregel $', '$ años (regla práctica $'],
        // tilgung
        ['Endkapital: $', 'Capital final: $'], ['Eingezahlt: ', 'Aportado: '], [' · Zinsen: <b>', ' · intereses: <b>'],
        ['</b> (Einzahlung jeweils am Jahresende)', '</b> (cada aportación al final del año)'],
        ['Annuität (jedes Jahr gleich): $', 'Anualidad (igual cada año): $'],
        ['Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>', 'Los intereses bajan cada año y la amortización crece. Intereses en total: <b>'],
        ['Tilgung (jedes Jahr gleich): $', 'Amortización (igual cada año): $'], ['$ € · erste Rate ', '$ € · primera cuota '], [', letzte Rate ', ', última cuota '],
        ['Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>',
            'La cuota baja porque bajan la deuda pendiente y, con ella, los intereses. Intereses en total: <b>'],

        // book es mathegy10-es (offen)

    ],
    rule: [
        // book es mathe10-es (Curie)

        // book es mathefos11-es (Lovelace)
        // slider values: "20 J." → "20 años"
        [/^(\d+) J\.$/, '$1 años'],

        // book es mathegy10-es (offen)

    ]
});
