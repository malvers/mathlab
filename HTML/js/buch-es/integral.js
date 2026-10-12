/* js/buch-es/integral.js — Spanish for the widgets of js/buch-integral.js.
 * Loaded by the Spanish editions right after js/buch-integral.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Package ES0 put in only the cover of the start page; the book package (ES3, mathe13-es) fills in the rest, in its own block.
 */
window.BuchES && BuchES.add('integral', {
    word: {
        // es0: the cover of the start page
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Portada: curva de campana sobre el histograma de un contraste con su región de rechazo, un plano en el espacio con vector normal y una recta'
    },
    phrase: [
    ],
    rule: []
});
