/* js/buch-es/numerik.js — Spanish for the widgets of js/buch-numerik.js.
 * Loaded by the Spanish editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('numerik', {
    word: {
        // book es-3 mathe13-es: flaeche
        'x² auf [0; 2]': 'x² en [0, 2]', '√x auf [0; 4]': '√x en [0, 4]', 'sin x auf [0; π]': 'sen x en [0, π]',
        'Rechtecke links': 'Rectángulos por la izquierda', 'Rechtecke Mitte': 'Rectángulos por el punto medio', 'Trapeze': 'Trapecios', 'Verfahren': 'Método',
        'Anzahl der Streifen $n$': 'Número de franjas $n$', 'Flächeninhalt mit Streifen angenähert': 'Área aproximada con franjas'
    },
    phrase: [
        // book es-3 mathe13-es: flaeche
        ['Näherung mit $n = ', 'Aproximación con $n = '], ['$ · genauer Wert $', '$ · valor exacto $'], ['$ · Fehler $', '$ · error $']
    ],
    rule: []
});
