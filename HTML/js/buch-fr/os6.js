/* js/buch-fr/os6.js — French for the widgets of js/buch-os6.js.
 * Loaded by the French editions right after js/buch-os6.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/os6.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os6', {
    word: {
        // book fr-11 mathe5-fr:
        // the helpers of the module (the pieces of the tangram), reported for every page that loads it
        'Quadrat': 'Carré', 'Parallelogramm': 'Parallélogramme',
        // wuerfelbauos6 ("Mauer" is a rule below: analysis has the word "mur" in lower case)
        'Treppe': 'Escalier', 'Turm': 'Tour', 'Selbst bauen': 'Construire soi-même', 'Körper': 'Solide', 'vorne': 'devant',
        'Körper aus Würfeln im Schrägbild': 'Solide fait de cubes en perspective cavalière',
        'Bauplan: Draufsicht mit den Höhen': 'Plan de construction : vue de dessus avec les hauteurs', 'Bauplan': 'Plan',
        'von vorn': 'vue de face', 'von rechts': 'vue de droite',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Touche une case du plan : le nombre indique combien de cubes sont empilés à cet endroit (jusqu’à 3, puis de nouveau 0). Longueur d’arête : 1 cm.',
        // book fr-17 mathe6-fr:
        // titelbildos6
        'Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln':
            'Couverture : un carré de tangram en sept pièces, un disque avec trois quarts colorés, une droite graduée, la tour de Hanoï et un solide fait de cubes',
        // hanoios6 (pegs: tiges, discs: disques, moves: coups)
        '3 Scheiben': '3 disques', '4 Scheiben': '4 disques', '5 Scheiben': '5 disques', '6 Scheiben': '6 disques',
        'Anzahl der Scheiben': 'Nombre de disques', 'Lösung zeigen': 'Voir la solution',
        'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.': 'Interdit : un disque plus grand ne doit jamais être posé sur un plus petit.',
        'Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.':
            'Amène tous les disques de A vers C. Touche d’abord la tige où tu prends le disque, puis la tige d’arrivée. Un seul disque à la fois, jamais un plus grand sur un plus petit.',
        // nimos6 (the French "jeu des allumettes")
        '15 Hölzer': '15 allumettes', '21 Hölzer': '21 allumettes', '30 Hölzer': '30 allumettes', 'Anzahl der Hölzer': 'Nombre d’allumettes',
        'ohne Hilfe': 'sans aide', 'Vierer zeigen': 'montrer les groupes de quatre', 'Hilfe': 'Aide',
        'Nimm 1': 'Prends 1', 'Nimm 2': 'Prends 2', 'Nimm 3': 'Prends 3',
        // tangramos6
        'Tangram: sieben Teile in einem Quadrat': 'Tangram : sept pièces dans un carré',
        // schiebeos6 (the French "taquin")
        '3 × 3 · 8 Steine': '3 × 3 · 8 carreaux', '4 × 4 · 15 Steine': '4 × 4 · 15 carreaux', 'Mischen': 'Mélanger', 'Ordnen': 'Remettre en ordre',
        'Geordnet. Tippe auf „Mischen“.': 'En ordre. Touche « Mélanger ».',
        'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.':
            'Touche un carreau à côté de la case vide : il glisse dedans. Range les nombres dans l’ordre, la case vide en bas à droite.',
        'Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.':
            'En vert : le carreau est déjà à sa place. On ne mélange qu’avec des coups permis, c’est pourquoi chaque taquin peut être résolu. Si l’on échange deux carreaux, en revanche, on n’y arrive plus jamais.',
        // augensummeos6 (1-mal … 100-mal, Löschen: js/buch-fr/gy6.js)
        'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme': 'Les 36 issues de deux dés avec la somme de leurs points',
        'Säulendiagramm: relative Häufigkeiten der Augensummen': 'Diagramme en colonnes : fréquences des sommes des points',
        // book fr-18 mathe7-fr:
        // tangramos6 (4.1): an identical copy of the fr-17 entries (Voisin, OS 6) for the pages of this book - keep one copy when merging
        'Tangram: sieben Teile in einem Quadrat': 'Tangram : sept pièces dans un carré',
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // the helpers of the module (the pieces of the tangram)
        ['großes Dreieck', 'grand triangle'], ['mittleres Dreieck', 'triangle moyen'], ['kleines Dreieck', 'petit triangle'],
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · aire totale '],
        // book fr-17 mathe6-fr:
        // hanoios6, schiebeos6
        ['Züge:', 'Coups :'], ['Mindestens nötig:', 'Minimum nécessaire :'], ['Geschafft!', 'Réussi !'],
        ['Mit der kleinstmöglichen Zahl von Zügen.', 'Avec le plus petit nombre de coups possible.'],
        // nimos6
        ['Du: ', 'Toi : '], ['Computer: ', 'Ordinateur : '], ['Du hast das letzte Holz genommen und gewonnen!', 'Tu as pris la dernière allumette et tu as gagné !'],
        ['Der Computer hat das letzte Holz genommen.', 'L’ordinateur a pris la dernière allumette.'], ['Probier es noch einmal.', 'Réessaie.'],
        ['Der Computer überlegt …', 'L’ordinateur réfléchit…'], ['Du bist dran: Nimm 1, 2 oder 3 Hölzer.', 'À toi : prends 1, 2 ou 3 allumettes.'],
        ['Wer das letzte Holz nimmt, gewinnt.', 'Celui qui prend la dernière allumette gagne.'],
        [' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.',
            ' Les couleurs montrent des groupes de quatre en partant de la fin : laisse toujours à l’ordinateur un multiple de 4.'],
        // tangramos6 (the pieces: helpers of fr-11 above)
        ['Anteil am Quadrat: ', 'Part du carré : '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'Si le carré mesure 4 cm × 4 cm, la pièce a une aire de '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Touche une pièce. Les sept pièces ensemble forment le carré entier : '],
        // augensummeos6
        [' · zuletzt ', ' · le dernier : '], [' · im Gitter ', ' · dans la grille '], [' von 36 Feldern, also ', ' cases sur 36, soit '],
        ['Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (',
            'Touche une case ou une colonne. La ligne en pointillés montre la part des cases. Le 7 a le plus de cases ('],
        ['), die 2 und die 12 nur eins.', '), le 2 et le 12 une seule.'],
        // book fr-18 mathe7-fr:
        // tangramos6 (4.1): an identical copy of the fr-17 entries (Voisin, OS 6) for the pages of this book - keep one copy when merging
        ['Anteil am Quadrat: ', 'Part du carré : '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'Si le carré mesure 4 cm × 4 cm, la pièce a une aire de '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Touche une pièce. Les sept pièces ensemble forment le carré entier : '],
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // wuerfelbauos6: the button "Mauer" and "7 Würfel · Volumen"
        [/(data-v="mauer">)Mauer</, '$1Mur<'],
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cube' : 'cubes') + ' · volume '],
        // book fr-17 mathe6-fr:
        // hanoios6, schiebeos6, nimos6: numbers inside the sentences
        [/Turm von Hanoi mit (\d+) Scheiben/, 'Tour de Hanoï avec $1 disques'],
        [/Es geht auch mit (\d+) Zügen\./, 'C’est possible aussi en $1 coups.'],
        [/Geschafft in (\d+) Zügen!/, (m, n) => 'Réussi en ' + n + (n === '1' ? ' coup' : ' coups') + ' !'],
        [/Schiebepuzzle mit (\d+) Steinen/, 'Taquin à $1 carreaux'],
        [/^(\d+) Hölzer liegen noch$/, (m, n) => n === '0' ? 'Il ne reste aucune allumette' : 'Il reste ' + n + (n === '1' ? ' allumette' : ' allumettes')],
        [/Noch <b>(\d+)<\/b> Hölzer\./, (m, n) => n === '0' ? 'Il ne reste <b>aucune</b> allumette.' : 'Il reste <b>' + n + '</b> ' + (n === '1' ? 'allumette.' : 'allumettes.')],
        // tangramos6: the square and the parallelogram in lower case like the triangles, as the name of the piece and in
        // the list of the pieces of equal area
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'carré' : 'parallélogramme') + b],
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => 'Même aire : ' + l.replace(/\bQuadrat\b/g, 'carré').replace(/\bParallelogramm\b/g, 'parallélogramme') + ' (en surbrillance).'],
        // augensummeos6: "5 Würfe · zuletzt 3 + 4 = 7" and "Augensumme 7: 5-mal, relativ …"
        [/(<p style="margin:0">)(\d+) Würfe( · zuletzt |<\/p>)/, (m, a, n, b) => a + n + (n === '0' || n === '1' ? ' lancer' : ' lancers') + b],
        [/Augensumme <b>(\d+)<\/b>: (\d+)-mal(, relativ )?/, (m, s, k, r) => 'Somme des points <b>' + s + '</b> : ' + k + ' fois' + (r ? ', fréquence ' : '')],
        // book fr-18 mathe7-fr:
        // tangramos6 (4.1): an identical copy of the fr-17 entries (Voisin, OS 6) for the pages of this book - keep one copy when merging
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'carré' : 'parallélogramme') + b],
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => 'Même aire : ' + l.replace(/\bQuadrat\b/g, 'carré').replace(/\bParallelogramm\b/g, 'parallélogramme') + ' (en surbrillance).'],
    ]
});
