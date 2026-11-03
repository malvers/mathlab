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
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · Mzunguko ni kuzunguka nukta ya asili, kinyume na mwelekeo wa saa.'],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    ]
});
