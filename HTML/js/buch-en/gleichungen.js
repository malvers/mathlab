/* js/buch-en/gleichungen.js — English for the widgets of js/buch-gleichungen.js:
 *   waage, binom, koerper
 * Loaded by the English editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gleichungen', {
    word: {
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'e.g. −3 or :4 or −2x', 'Anwenden': 'Apply', 'Neue Gleichung': 'New equation',
        'Länge $a$': 'Length $a$', 'Länge $b$': 'Length $b$', 'Quadrat mit Seitenlänge a + b': 'Square with side length a + b',
        'Zylinder': 'Cylinder', 'Kegel': 'Cone', 'Kugel': 'Sphere', 'Körper': 'Solid', 'Höhe $h$ in cm': 'Height $h$ in cm', 'Skizze des Körpers': 'Sketch of the solid',
    },
    phrase: [
        // waage
        ['Gelöst: $x = ', 'Solved: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Check it: substitute the value into the first line.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Both sides are equal: every number is a solution, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradiction: there is no solution, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Type the transformation you want to apply to <b>both</b> sides.'],
        ['Das verstehe ich nicht. Beispiele: ', "I don't understand that. Examples: "], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'A number is missing after the operator.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplying or dividing by $x$ is not a safe transformation, $x$ could be $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'You must not divide by $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplying by $0$ turns every equation into $0 = 0$, and the information is lost.'],
        ['Bring alle $x$ auf eine Seite: ', 'Get all $x$ onto one side: '], ['Bring die Zahl auf die andere Seite: ', 'Move the number to the other side: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divide by the number in front of $x$: '],
        // binom, koerper
        ['Der häufigste Fehler: ', 'The most common mistake: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. In the picture the two blue rectangles are then missing, here '],
        ['$M = 2\\pi r h', '$L = 2\\pi r h'], ['$O = ', '$S = '], ['Mantellinie $s = ', 'Slant height $s = '],
    ],
    rule: []
});
