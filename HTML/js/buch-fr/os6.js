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
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // the helpers of the module (the pieces of the tangram)
        ['großes Dreieck', 'grand triangle'], ['mittleres Dreieck', 'triangle moyen'], ['kleines Dreieck', 'petit triangle'],
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · aire totale '],
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // wuerfelbauos6: the button "Mauer" and "7 Würfel · Volumen"
        [/(data-v="mauer">)Mauer</, '$1Mur<'],
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cube' : 'cubes') + ' · volume '],
    ]
});
