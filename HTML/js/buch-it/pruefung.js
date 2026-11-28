/* js/buch-it/pruefung.js — Italian for the widgets of js/buch-pruefung.js.
 * Loaded by the Italian editions right after js/buch-pruefung.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/pruefung.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('pruefung', {
    word: {
        // book it-24 pruefung-it:
        // pruefungsuhr: the pause label of the clock ('Zurück', the reset, is a rule below)
        'Pause': 'Pausa',
    },
    phrase: [
        // book it-24 pruefung-it:
        // pruefungsuhr: the start button of a stopwatch; a phrase and not a word, because js/buch-it/gy7.js has the
        // word 'Start' → 'Partenza' for the start point of its number line (different meaning, never on the same page)
        ['Start', 'Avvia'],
    ],
    rule: [
        // book it-24 pruefung-it:
        // pruefungsuhr: the second button "Zurück" resets the clock: "Azzera", not the shared "Annulla". Its label is parked as
        // \u0003n\u0004 before the rules run, and a word entry would rename every "Zurück" on the page (the Gauss
        // widget's undo in the print edition too), so this rule matches the clock's own markup only
        [/(<span class="b-uhr-zeit" role="timer"><\/span><button type="button" class="b-btn b-go">[^<]*<\/button><button type="button" class="b-btn">)(?:\u0003\d+\u0004|Zurück)(<\/button>)/, '$1Azzera$2'],
    ]
});
