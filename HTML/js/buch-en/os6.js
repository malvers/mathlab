/* js/buch-en/os6.js — English for the widgets of js/buch-os6.js.
 * Loaded by the English editions right after js/buch-os6.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('os6', {
    word: {
        // titelbildos6
        'Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln':
            'Cover: a tangram square of seven pieces, a circle with three coloured quarters, a number line, the Tower of Hanoi and a solid made of cubes',
        // wuerfelbauos6 ("Mauer" is a rule below: analysis has the word "wall" in lower case)
        'Treppe': 'Stairs', 'Turm': 'Tower', 'Selbst bauen': 'Build your own', 'Körper': 'Solid', 'vorne': 'front',
        'Körper aus Würfeln im Schrägbild': 'Solid made of cubes in an oblique drawing',
        'Bauplan: Draufsicht mit den Höhen': 'Building plan: top view with the heights', 'Bauplan': 'Building plan',
        'von vorn': 'from the front', 'von rechts': 'from the right',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Tap a cell in the building plan: the number says how many cubes are stacked there (up to 3, then back to 0). Edge length 1 cm.',
        // hanoios6
        '3 Scheiben': '3 discs', '4 Scheiben': '4 discs', '5 Scheiben': '5 discs', '6 Scheiben': '6 discs',
        'Anzahl der Scheiben': 'Number of discs', 'Neu': 'New', 'Lösung zeigen': 'Show solution',
        'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.': 'Not allowed: a larger disc may never lie on a smaller one.',
        'Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.':
            'Move all the discs from A to C. First tap the peg you take from, then the target peg. Only one disc at a time, never a larger one on a smaller one.',
        // nimos6
        '15 Hölzer': '15 sticks', '21 Hölzer': '21 sticks', '30 Hölzer': '30 sticks', 'Anzahl der Hölzer': 'Number of sticks',
        'ohne Hilfe': 'no help', 'Vierer zeigen': 'show the fours', 'Hilfe': 'Help',
        'Nimm 1': 'Take 1', 'Nimm 2': 'Take 2', 'Nimm 3': 'Take 3',
        // tangramos6
        'Tangram: sieben Teile in einem Quadrat': 'Tangram: seven pieces in a square',
        // schiebeos6
        '3 × 3 · 8 Steine': '3 × 3 · 8 tiles', '4 × 4 · 15 Steine': '4 × 4 · 15 tiles', 'Mischen': 'Shuffle', 'Ordnen': 'Sort',
        'Geordnet. Tippe auf „Mischen“.': 'In order. Tap “Shuffle”.',
        'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.':
            'Tap a tile next to the gap and it slides in. Put the numbers in order, with the gap at the bottom right.',
        'Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.':
            'Green: the tile is already in the right place. The puzzle is only shuffled with legal moves, so every puzzle can be solved. If you swap two tiles instead, it never works out.',
        // augensummeos6 (the buttons as in gy6)
        '1-mal': 'Once', '10-mal': '10 times', '100-mal': '100 times', 'Löschen': 'Clear',
        'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme': 'The 36 outcomes of two dice with their total score',
        'Säulendiagramm: relative Häufigkeiten der Augensummen': 'Bar chart: relative frequencies of the total scores'
    },
    phrase: [
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · surface area '],
        // hanoios6, schiebeos6
        ['Züge:', 'Moves:'], ['Mindestens nötig:', 'Least number needed:'], ['Geschafft!', 'Done!'],
        ['Mit der kleinstmöglichen Zahl von Zügen.', 'With the smallest possible number of moves.'],
        // nimos6
        ['Du: ', 'You: '], ['Du hast das letzte Holz genommen und gewonnen!', 'You took the last stick and won!'],
        ['Der Computer hat das letzte Holz genommen.', 'The computer took the last stick.'], ['Probier es noch einmal.', 'Try again.'],
        ['Der Computer überlegt …', 'The computer is thinking …'], ['Du bist dran: Nimm 1, 2 oder 3 Hölzer.', 'Your turn: take 1, 2 or 3 sticks.'],
        ['Wer das letzte Holz nimmt, gewinnt.', 'Whoever takes the last stick wins.'],
        [' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.',
            ' The colours show groups of four counted from the end: always leave the computer a multiple of 4.'],
        // tangramos6
        ['großes Dreieck', 'large triangle'], ['mittleres Dreieck', 'medium triangle'], ['kleines Dreieck', 'small triangle'],
        ['Anteil am Quadrat: ', 'Share of the square: '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'If the square measures 4 cm × 4 cm, the piece has an area of '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Tap a piece. All seven together make up the whole square: '],
        // augensummeos6
        [' · zuletzt ', ' · last '], [' · im Gitter ', ' · in the grid '], [' von 36 Feldern, also ', ' of 36 cells, that is '],
        ['Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (',
            'Tap a cell or a bar. The dashed line shows the share of the cells. The 7 has the most cells ('],
        ['), die 2 und die 12 nur eins.', '), the 2 and the 12 only one each.']
    ],
    rule: [
        // wuerfelbauos6: the button "Mauer" and "7 Würfel · Volumen"
        [/(data-v="mauer">)Mauer</, '$1Wall<'],
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cube' : 'cubes') + ' · volume '],
        // hanoios6, schiebeos6, nimos6: numbers inside the sentences
        [/Turm von Hanoi mit (\d+) Scheiben/, 'Tower of Hanoi with $1 discs'],
        [/Es geht auch mit (\d+) Zügen\./, 'It can also be done in $1 moves.'],
        [/Geschafft in (\d+) Zügen!/, 'Done in $1 moves!'],
        [/Schiebepuzzle mit (\d+) Steinen/, 'Sliding puzzle with $1 tiles'],
        [/^(\d+) Hölzer liegen noch$/, (m, n) => n + (n === '1' ? ' stick is left' : ' sticks are left')],
        [/Noch <b>(\d+)<\/b> Hölzer\./, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'stick' : 'sticks') + ' left.'],
        // tangramos6: the square and the parallelogram as the name of the piece and in the list of pieces of equal area
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'square' : 'parallelogram') + b],
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => 'Just as large: ' + l.replace(/\bQuadrat\b/g, 'square').replace(/\bParallelogramm\b/g, 'parallelogram') + ' (lit up).'],
        // augensummeos6: "5 Würfe · zuletzt 3 + 4 = 7" and "Augensumme 7: 5-mal, relativ …"
        [/(<p style="margin:0">)(\d+) Würfe( · zuletzt |<\/p>)/, (m, a, n, b) => a + n + (n === '1' ? ' roll' : ' rolls') + b],
        [/Augensumme <b>(\d+)<\/b>: (\d+)-mal(, relativ )?/, (m, s, k, r) => 'Total score <b>' + s + '</b>: ' + (k === '1' ? 'once' : k + ' times') + (r ? ', relative frequency ' : '')]
    ]
});
