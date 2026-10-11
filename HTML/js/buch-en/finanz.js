/* js/buch-en/finanz.js — English for the widgets of js/buch-finanz.js:
 *   zins, tilgung (book 4, mathefos11-en)
 * Loaded by the English editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('finanz', {
    word: {
        // zins
        'Startkapital $K_0$ in €': 'Starting capital $K_0$ in €', 'Zinssatz $p$': 'Interest rate $p$', 'Laufzeit $n$': 'Term $n$',
        'Jahre': 'years', 'Kapital in €': 'Capital in €', 'Kapital Jahr für Jahr: Zinseszins und einfache Verzinsung': 'Capital year by year: compound and simple interest',
        'mit Zinseszins &nbsp;': 'with compound interest &nbsp;', 'einfache Verzinsung (die Zinsen werden nicht mitverzinst)': 'simple interest (the interest earns no interest)',
        'doppeltes Startkapital': 'double the starting capital',
        // tilgung
        'Annuitätendarlehen': 'Annuity loan', 'Ratentilgung': 'Equal repayments', 'Sparplan': 'Savings plan',
        'Kredit $S_0$ in €': 'Loan $S_0$ in €', 'Sparrate je Jahr $R$ in €': 'Savings per year $R$ in €', 'Jahr': 'Year',
        'Zahlungen Jahr für Jahr als gestapelte Säulen': 'Payments year by year as stacked bars',
        'Kapital am Anfang': 'Capital at the start', 'Zinsen': 'Interest', 'Einzahlung': 'Payment', 'Kapital am Ende': 'Capital at the end',
        'Restschuld am Anfang': 'Debt at the start', 'Tilgung': 'Repayment', 'Rate': 'Instalment', 'Restschuld am Ende': 'Debt at the end',
        'eingezahlt &nbsp;': 'paid in &nbsp;', 'Zinsen (Kapital am Jahresende)': 'interest (capital at the end of the year)',
        'Zinsen &nbsp;': 'interest &nbsp;', 'Tilgung (zusammen: die Rate)': 'repayment (together: the instalment)'
    },
    phrase: [
        // zins
        ['Zinseszins: $', 'Compound interest: $'], ['Einfache Verzinsung: $', 'Simple interest: $'],
        ['$ € · Zinseszins bringt <b>', '$ euros · compound interest brings <b>'], ['</b> mehr', '</b> more'],
        ['Verdopplung nach $n = ', 'Doubling after $n = '], ['$ Jahren (Faustregel $', '$ years (rule of thumb $'],
        // tilgung
        ['Endkapital: $', 'Final capital: $'], ['Eingezahlt: ', 'Paid in: '], [' · Zinsen: <b>', ' · interest: <b>'],
        ['</b> (Einzahlung jeweils am Jahresende)', '</b> (each payment at the end of the year)'],
        ['Annuität (jedes Jahr gleich): $', 'Annuity (the same every year): $'],
        ['Die Zinsen werden jedes Jahr kleiner, die Tilgung wächst. Zinsen insgesamt: <b>', 'The interest gets smaller every year, the repayment grows. Total interest: <b>'],
        ['Tilgung (jedes Jahr gleich): $', 'Repayment (the same every year): $'], ['$ € · erste Rate ', '$ euros · first instalment '], [', letzte Rate ', ', last instalment '],
        ['Die Rate sinkt, weil die Restschuld und damit die Zinsen sinken. Zinsen insgesamt: <b>',
            'The instalment falls because the outstanding debt, and with it the interest, falls. Total interest: <b>'],
        // an amount in TeX followed by the currency
        ['$ €', '$ euros']
    ],
    rule: [
        // money from toLocaleString('de-DE'): "12.345,67 €" → "€12,345.67"
        [/(-?)(\d{1,3}(?:\.\d{3})*),(\d{2}) €/g, (m, s, i, f) => s + '€' + i.replace(/\./g, ',') + '.' + f],
        // slider values: "20 J." → "20 yrs" (js/buch-finanz.js writes "5,000" and "3%" itself on English pages)
        [/^(\d+) J\.$/, '$1 yrs']
    ]
});
