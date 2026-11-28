/* js/buch-en/pruefung.js — English for the widgets of js/buch-pruefung.js.
 * Loaded by the English editions right after js/buch-pruefung.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('pruefung', {
    word: {
        // book 24 pruefung-en:
        // beverteilung: the parts of an exam come from data-teile in the German page
        'Teil A': 'Part A', 'Aufgabe 1': 'Task 1', 'Aufgabe 2': 'Task 2', 'Aufgabe 3': 'Task 3',
        'Stochastik': 'Statistics', 'Geometrie oder Algebra': 'Geometry or algebra'
    },
    phrase: [
        // book 24 pruefung-en:
    ],
    rule: [
        // book 24 pruefung-en:
        // pruefungsuhr: the second button "Zurück" resets the clock: "Reset", not the shared "Undo". Its label is parked as
        // \u0003n\u0004 before the rules run, and a word entry would rename every "Zurück" on the page (the Gauss
        // widget's undo in the print edition too), so this rule matches the clock's own markup only
        [/(<span class="b-uhr-zeit" role="timer"><\/span><button type="button" class="b-btn b-go">[^<]*<\/button><button type="button" class="b-btn">)(?:\u0003\d+\u0004|Zurück)(<\/button>)/, '$1Reset$2'],
    ]
});
