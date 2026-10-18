/* js/buch-it/funktionen.js — Italian for the widgets of js/buch-funktionen.js.
 * Loaded by the Italian editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the cover of the start page; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/funktionen.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('funktionen', {
    word: {
        // it0: the cover of the start page
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Copertina: parabola, sinusoide, funzione esponenziale e retta',
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    ]
});
