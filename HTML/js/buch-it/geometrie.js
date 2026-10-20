/* js/buch-it/geometrie.js — Italian for the widgets of js/buch-geometrie.js.
 * Loaded by the Italian editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/geometrie.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('geometrie', {
    word: {
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:
        // titelbildgy9
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Copertina: triangolo rettangolo con i quadrati sui suoi lati, un rettangolo aureo con spirale, un cerchio tra due esagoni e una parabola',
        // kreisteil
        'Radius $r$': 'Raggio $r$', 'Mittelpunktswinkel $\\alpha$': 'Angolo al centro $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Cerchio con settore circolare e arco',
        'Kreisbogen': 'Arco', 'Kreisausschnitt': 'Settore circolare',

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    },
    phrase: [
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:
        // kreisteil
        ['Anteil am Vollkreis: $', 'Frazione del cerchio intero: $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Trascina l’estremo dell’arco. Per confronto il cerchio intero: $u \\approx '],

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    ],
    rule: [
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    ]
});
