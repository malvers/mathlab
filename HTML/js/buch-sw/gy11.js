/* js/buch-sw/gy11.js — Swahili for the widgets of js/buch-gy11.js.
 * Loaded by the Swahili editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // drehmatrix (7.2): Drehmatrix = matriki ya mzunguko
        'Drehwinkel $\\varphi$': 'Pembe ya mzunguko $\\varphi$',
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'Umbo linazungushwa kuzunguka nukta ya asili kwa matriki ya mzunguko',
        // matrixprodukt (H2.1): the order of a matrix as Kenya writes it, 2 × 3 (Typ = daraja)
        'Typen der Matrizen': 'Madaraja ya matriki', 'Reihenfolge': 'Mpangilio', 'Neue Zahlen': 'Namba mpya', 'nicht definiert': 'haijafafanuliwa',
        '(2,2) · (2,2)': '2 × 2 · 2 × 2', '(2,3) · (3,1)': '2 × 3 · 3 × 1', '(2,3) · (3,2)': '2 × 3 · 3 × 2', '(3,3) · (3,1)': '3 × 3 · 3 × 1',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · Mzunguko ni kuzunguka nukta ya asili, kinyume na mwelekeo wa saa.'],
        // matrixprodukt ("Zeile 1 von $A$ mal Spalte 2 von $B$", the columns and rows sentence and "Typen:" are rules)
        ['$ hat den Typ $', '$ ina daraja $'], ['$ den Typ $', '$ daraja $'], ['$, ist also etwas ganz anderes.', '$, kwa hiyo ni kitu tofauti kabisa.'],
        ['$ · Klick auf ein Feld des Ergebnisses.', '$ · Bofya kisanduku cha jibu.'], ['$ ist nicht definiert.', '$ haijafafanuliwa.'],
        ['$ ergibt ', '$ inatoa '], ['hier zufällig dasselbe', 'hapa kwa bahati kitu kile kile'], ['andere Zahlen', 'namba nyingine'],
        ['Andersherum: ', 'Kwa mpangilio mwingine: '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' Kwa ujumla sheria ya kubadilishana haitumiki kwa matriki.'],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // matrixprodukt: the order $(2,3)$ → $2 \times 3$, "Typen: $(2,3) \cdot (3,2) = (2,2)$" → "Madaraja: $(2 \times 3) \cdot …$"
        [/Typen: \$([^$]*)\$/g, (m, t) => 'Madaraja: $' + t.replace(/\((\d+),(\d+)\)/g, '($1 \\times $2)') + '$'],
        [/\$\((\d+),(\d+)\)\$/g, (m, a, b) => '$' + a + ' \\times ' + b + '$'],
        [/\. ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht\./g,
            (m, p, n, q, k) => '. ' + p + ' ina safu wima ' + n + ', lakini ' + q + ' ina safu mlalo ' + k + ': kwa mpangilio huu matriki hazioani, zao halipo.'],
        [/Zeile (\d+) von \$([^$]+)\$ mal Spalte (\d+) von \$([^$]+)\$: /g, (m, i, p, j, q) => 'Safu mlalo ' + i + ' ya $' + p + '$ mara safu wima ' + j + ' ya $' + q + '$: '],
    ]
});
