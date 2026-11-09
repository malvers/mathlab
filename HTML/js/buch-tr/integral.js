/* js/buch-tr/integral.js — Turkish for the widgets of js/buch-integral.js.
 * Loaded by the Turkish editions right after js/buch-integral.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package tr2-prep (08.11.2026): the module's helpers (outside every widget) go below the tr0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('integral', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs integral/*)
        // book tr-3 mathe13-tr:
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs integral/*)
        // book tr-3 mathe13-tr:
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-3 mathe13-tr:
    ]
});
