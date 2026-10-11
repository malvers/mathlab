/* js/buch-en/lgs.js — English for the widgets of js/buch-lgs.js:
 *   gauss, geraden, matrizen, pagerank
 * Loaded by the English editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('lgs', {
    word: {
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Apply', 'Nächster Schritt': 'Next step', 'Neues LGS': 'New system',
        'Zeile + k · Zeile': 'row + k · row', 'Zeile · k': 'row · k', 'tauschen': 'swap', 'Zielzeile': 'Target row', 'zweite Zeile': 'Second row', 'Faktor k': 'Factor k',
        'Ziel I': 'target I', 'Ziel II': 'target II', 'Ziel III': 'target III', 'mit I': 'with I', 'mit II': 'with II', 'mit III': 'with III',
        'eine Lösung': 'one solution', 'keine Lösung': 'no solution', 'unendlich viele': 'infinitely many', 'Zwei Geraden': 'Two lines',
        'mit $r =$': 'with $r =$', 'Neue Matrizen': 'New matrices', 'Wähle eine Rechnung.': 'Choose a calculation.',
        '1 Schritt': '1 step', '10 Schritte': '10 steps', 'Vier Webseiten und ihre Links': 'Four web pages and their links',
    },
    phrase: [
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Done: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Echelon form reached. Now you can substitute from the bottom upwards or carry on with “Next step” (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Choose an operation and apply it, or let “Next step” help you.'],
        ['Wähle zwei verschiedene Zeilen.', 'Choose two different rows.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Enter a number for $k$, e.g. -2 or 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Multiplying by $0$ is not an equivalence transformation.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Adding a row to itself changes the solution set. Choose another row.'],
        ['Gleichung I ist fest: ', 'Equation I is fixed: '], ['. Verändere Gleichung II: ', '. Change equation II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'Equation II reads $0 = 0$, it restricts nothing.'], ['Gleichung II lautet $0 = ', 'Equation II reads $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: a contradiction, no solution.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exactly one solution</b>: the lines intersect at $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Infinitely many solutions</b>: both equations describe the same line.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>No solution</b>: the lines are parallel and distinct.'],
        ['Gleiche Stellen werden addiert.', 'Entries in the same position are added.'], ['Gleiche Stellen werden subtrahiert.', 'Entries in the same position are subtracted.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Every entry is multiplied by $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Rows become columns: a $2 \\times 3$ matrix becomes a $3 \\times 2$ matrix.'],
        ['Summe: $', 'Sum: $'],
    ],
    rule: [
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'There is no pivot left in column $1: the system has no or infinitely many solutions.'],
        [/Schritt (\d+):/g, 'Step $1:'],
    ]
});
