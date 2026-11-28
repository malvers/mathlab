/* js/buch-fr/pruefung.js — French for the widgets of js/buch-pruefung.js.
 * Loaded by the French editions right after js/buch-pruefung.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/pruefung.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('pruefung', {
    word: {
        // book fr-24 pruefung-fr:
        // pruefungsuhr: "Pause" is French already, "Zurück" keeps the shared word « Annuler » of js/buch-fr.js (a whole label is
        // looked up before any rule runs); "Start" is a rule below, tied to the clock: « Départ » in gy7.js means a starting point
    },
    phrase: [
        // book fr-24 pruefung-fr:
    ],
    rule: [
        // book fr-24 pruefung-fr:
        // pruefungsuhr: the start button, in the widget's innerHTML and in go.textContent after a pause
        [/^Start$/, 'Démarrer'], [/(class="b-btn b-go">)Start</g, '$1Démarrer<'],
    ]
});
