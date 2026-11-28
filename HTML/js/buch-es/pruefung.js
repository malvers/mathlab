/* js/buch-es/pruefung.js — Spanish for the widgets of js/buch-pruefung.js.
 * Loaded by the Spanish editions right after js/buch-pruefung.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('pruefung', {
    word: {
        // book es-24 pruefung-es:
        // beverteilung: the parts of an exam (data-teile in the overview chapters)
        'Teil A': 'Parte A', 'Analysis': 'Análisis', 'Geometrie oder Algebra': 'Geometría o álgebra', 'Stochastik': 'Probabilidad',
        'Aufgabe 1': 'Ejercicio 1', 'Aufgabe 2': 'Ejercicio 2', 'Aufgabe 3': 'Ejercicio 3',
        // pruefungsuhr: the clock of a rehearsal ('Start' as in js/buch-es/gy7.js)
        'Start': 'Inicio', 'Pause': 'Pausa',
    },
    phrase: [
        // book es-24 pruefung-es:
    ],
    rule: [
        // book es-24 pruefung-es:
        // pruefungsuhr: its second button "Zurück" resets the clock, so "Reiniciar" and not the shared "Deshacer" (undo);
        // the label is already parked as \u0003n\u0004 when the rules run, and only the clock ends with two b-btn buttons
        [/(<button type="button" class="b-btn">)\u0003\d+\u0004(<\/button>)$/, '$1Reiniciar$2'],
    ]
});
