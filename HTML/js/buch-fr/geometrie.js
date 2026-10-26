/* js/buch-fr/geometrie.js — French for the widgets of js/buch-geometrie.js.
 * Loaded by the French editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. The Italian file js/buch-it/geometrie.js shows which German strings the widgets write.
 * OS 5 (mathe5-fr) loads this module only for its SVG helpers (Buch.geo), none of its widgets: nothing to translate yet.
 */
window.BuchFR && BuchFR.add('geometrie', {
    word: {
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // titelbildgy9 (the cover of GY 9)
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Couverture : triangle rectangle avec les carrés construits sur ses côtés, rectangle d’or avec sa spirale, cercle entre deux hexagones et parabole',
        // kreisteil (chapter 2): arc length ℓ and perimeter P, the French letters (rules below)
        'Radius $r$': 'Rayon $r$', 'Mittelpunktswinkel $\\alpha$': 'Angle au centre $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Cercle avec un secteur circulaire et un arc',
        'Kreisbogen': 'Arc', 'Kreisausschnitt': 'Secteur',
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // kreisteil (u, the German perimeter, is P in French)
        ['Anteil am Vollkreis: $', 'Part du cercle entier : $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Fais glisser l’extrémité de l’arc. Pour comparer, le cercle entier : $P \\approx '],
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // French school notation in the formulas the widgets write (Doc, 26.10.2026: always the local conventions), on every
        // page that loads this module - the GY 5-9 and OS 5 editions; BGY 11 and the round-2 books never load it.
        // × for the product, as js/buch-fr/gy5.js does: a phrase key that contains a product must therefore be written with \times
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // kreisteil: the arc length is ℓ ("Kreisbogen $b = \tfrac{\alpha}{360^\circ} …")
        [/(<\/span> )\$b = (?=\\tfrac\{\\alpha\}\{360\^\\circ\})/g, '$1$$\\ell = '],
        // surface area A (German O), lateral area A_L (German M, Mantel), base area 𝓑 (German G, Grundfläche): the formulas of
        // spitzkoerper and of koerper (js/buch-gleichungen.js, on the GY pages that load both modules)
        [/\$O = G \+ M/g, '$$A = \\mathcal{B} + A_L'],
        [/\$O = (?=2\\pi r\^2 \+ 2\\pi r h|\\pi r\^2 \+ \\pi r s|4 ?\\pi r\^2)/g, '$$A = '],
        [/\$M = (?=2\\pi r h|\\pi r s|4 \\times \\tfrac12 a)/g, '$$A_L = '],
        [/\$G = (?=a\^2|\\pi r\^2)/g, '$$\\mathcal{B} = '], [/\\tfrac13\\,G\\,h/g, '\\tfrac13\\,\\mathcal{B}\\,h'],
    ]
});
