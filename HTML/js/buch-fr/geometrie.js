/* js/buch-fr/geometrie.js — French for the widgets of js/buch-geometrie.js.
 * Loaded by the French editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. The Italian file js/buch-it/geometrie.js shows which German strings the widgets write.
 * OS 5 (mathe5-fr) loads this module only for its SVG helpers (Buch.geo), none of its widgets: nothing to translate yet.
 */
window.BuchFR && BuchFR.add('geometrie', {
    word: {
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
    ]
});
