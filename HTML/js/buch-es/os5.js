/* js/buch-es/os5.js — Spanish for the widgets of js/buch-os5.js.
 * Loaded by the Spanish editions right after js/buch-os5.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('os5', {
    word: {
        // book es mathe5-es (Wonenburger)
        // titelbildos5
        'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
            'Portada: un cubo en perspectiva caballera y su desarrollo, un círculo con dos tercios de colores, una mariposa reflejada, números babilonios en escritura cuneiforme y una recta numérica',
    },
    phrase: [
    ],
    rule: []
});
