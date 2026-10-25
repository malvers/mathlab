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
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Méthode de dichotomie', 'Intervall halbieren': 'Couper l’intervalle en deux', '5 Schritte': '5 étapes',
        'Schritt': 'Étape', 'Mitte $m$': 'Milieu $m$', 'Breite': 'Largeur',
        'x² auf [0; 2]': 'x² sur [0 ; 2]', '√x auf [0; 4]': '√x sur [0 ; 4]', 'sin x auf [0; π]': 'sin x sur [0 ; π]',
        'Rechtecke links': 'Rectangles à gauche', 'Rechtecke Mitte': 'Rectangles au milieu', 'Trapeze': 'Trapèzes', 'Verfahren': 'Méthode',
        'Anzahl der Streifen $n$': 'Nombre de bandes $n$', 'Flächeninhalt mit Streifen angenähert': 'Aire approchée par des bandes',
        '+100 Punkte': '+100 points', '+1 000 Punkte': '+1 000 points', '+10 000 Punkte': '+10 000 points',   // narrow space as the widget writes it
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Points au hasard dans le rectangle, points sous la parabole',
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
        // book fr-7 mathegy11-fr:
        // book fr-8 mathegy12-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-10 mathegy12lk-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · intervalle de départ $'], ['$ mit $f(', '$ avec $f('], ['$ und $f(', '$ et $f('],
        ['Näherung mit $n = ', 'Approximation avec $n = '], [' · genauer Wert $', ' · valeur exacte $'], [' · Fehler $', ' · erreur $'],
        ['$ · genauer Wert $', '$ · valeur exacte $'], ['$ · Fehler $', '$ · erreur $'],
        ['$ unter der Parabel. Rechteck: ', '$ sont sous la parabole. Rectangle : '],
        ['Schätzwert: $A', 'Estimation : $A'], [' · genau: $', ' · exact : $'], ['Wirf Zufallspunkte in das Rechteck ', 'Lance des points au hasard dans le rectangle '],
        ['. Der Anteil der Treffer unter ', '. La part des points tombés sous '], [' schätzt den Anteil der Fläche.', ' estime la part de l’aire.'],
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
        ['$: $A \\approx ', '$ : $A \\approx '],
        // book fr-7 mathegy11-fr:
        // book fr-8 mathegy12-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-10 mathegy12lk-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "Sur $500$ points, $160$ sont sous …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'Sur $' + n + '$ points, $'],
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // flaeche: a no-break space before the colon after "$n = …$" (the phrase turns the words)
        [/(Näherung mit \$n = [^$]*\$):/g, '$1 :'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
        // book fr-7 mathegy11-fr:
        // book fr-8 mathegy12-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-10 mathegy12lk-fr:
    ]
});
