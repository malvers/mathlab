/* js/buch-it/numerik.js — Italian for the widgets of js/buch-numerik.js.
 * Loaded by the Italian editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/numerik.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('numerik', {
    word: {
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        'x² auf [0; 2]': 'x² in [0, 2]',
        '√x auf [0; 4]': '√x in [0, 4]',
        'sin x auf [0; π]': 'sin x in [0, π]',
        'Rechtecke links': 'Rettangoli a sinistra',
        'Rechtecke Mitte': 'Rettangoli punto medio',
        'Trapeze': 'Trapezi',
        'Verfahren': 'Metodo',
        'Anzahl der Streifen $n$': 'Numero di strisce $n$',
        'Flächeninhalt mit Streifen angenähert': 'Area approssimata con strisce',
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        ['Näherung mit $n = ', 'Approssimazione con $n = '],
        ['$ · genauer Wert $', '$ · valore esatto $'],
        [' · genauer Wert $', ' · valore esatto $'],
        ['$ · Fehler $', '$ · errore $'],
        [' · Fehler $', ' · errore $'],
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    ]
});
