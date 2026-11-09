/* js/buch-nl/integral.js — Dutch for the widgets of js/buch-integral.js.
 * Loaded by the Dutch editions right after js/buch-integral.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package nl2-prep (08.11.2026): the module's helpers (outside every widget) go below the nl0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('integral', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs integral/*)
        // book nl-3 mathe13-nl:
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs integral/*)
        // book nl-3 mathe13-nl:
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-3 mathe13-nl:
    ]
});
