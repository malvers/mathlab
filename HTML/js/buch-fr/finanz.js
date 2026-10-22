/* js/buch-fr/finanz.js — French for the widgets of js/buch-finanz.js.
 * Loaded by the French editions right after js/buch-finanz.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the block comments. Five books are translated at the same time, each has its own
 * comment line in word, phrase and rule - write only right below your book's line, every entry ending with a comma, so
 * the books merge without a conflict. The Italian file js/buch-it/finanz.js shows which German strings the widgets
 * write.
 */
window.BuchFR && BuchFR.add('finanz', {
    word: {
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
