/* js/buch-fr/numerik.js — French for the widgets of js/buch-numerik.js.
 * Loaded by the French editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-fr.js.
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
 * the books merge without a conflict. The Italian file js/buch-it/numerik.js shows which German strings the widgets
 * write.
 */
window.BuchFR && BuchFR.add('numerik', {
    word: {
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        'x² auf [0; 2]': 'x² sur [0 ; 2]',
        '√x auf [0; 4]': '√x sur [0 ; 4]',
        'sin x auf [0; π]': 'sin x sur [0 ; π]',
        'Rechtecke links': 'Rectangles à gauche',
        'Rechtecke Mitte': 'Rectangles au milieu',
        'Trapeze': 'Trapèzes',
        'Verfahren': 'Méthode',
        'Anzahl der Streifen $n$': 'Nombre de bandes $n$',
        'Flächeninhalt mit Streifen angenähert': 'Aire approchée par des bandes',
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
        // flaeche
        'x² auf [0; 2]': 'x² sur [0 ; 2]', '√x auf [0; 4]': '√x sur [0 ; 4]', 'sin x auf [0; π]': 'sin x sur [0 ; π]',
        'Rechtecke links': 'Rectangles à gauche', 'Rechtecke Mitte': 'Rectangles au milieu', 'Trapeze': 'Trapèzes', 'Verfahren': 'Méthode',
        'Anzahl der Streifen $n$': 'Nombre de bandes $n$', 'Flächeninhalt mit Streifen angenähert': 'Aire approchée par des bandes',
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        ['Näherung mit $n = ', 'Approximation avec $n = '],
        ['$ · genauer Wert $', '$ · valeur exacte $'],
        [' · genauer Wert $', ' · valeur exacte $'],
        ['$ · Fehler $', '$ · erreur $'],
        [' · Fehler $', ' · erreur $'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
        ['Näherung mit $n = ', 'Approximation avec $n = '], ['$ · genauer Wert $', '$ · valeur exacte $'], ['$ · Fehler $', '$ · erreur $'],
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // flaeche: a no-break space before the colon after "$n = …$" (the phrase turns the words)
        [/(Näherung mit \$n = [^$]*\$):/g, '$1 :'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
