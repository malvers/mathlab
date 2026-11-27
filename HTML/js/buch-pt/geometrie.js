/* js/buch-pt/geometrie.js — Portuguese for the widgets of js/buch-geometrie.js.
 * Loaded by the Portuguese editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-7-prep (22.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('geometrie', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs geometrie/*)
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
        // titelbildgy9 (the cover of GY 9)
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Capa: um triângulo retângulo com os quadrados construídos sobre os seus lados, um retângulo de ouro com uma espiral, um círculo entre dois hexágonos e uma parábola',
        // kreisteil (chapter 2): the arc length is ℓ and the perimeter P (German b, u; the phrases below)
        'Radius $r$': 'Raio $r$', 'Mittelpunktswinkel $\\alpha$': 'Ângulo ao centro $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Círculo com um setor circular e um arco',
        'Kreisbogen': 'Arco', 'Kreisausschnitt': 'Setor circular',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs geometrie/*)
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
        // kreisteil (the product is \times already: the pt0 rule runs before the phrases)
        ['Anteil am Vollkreis: $', 'Parte do círculo completo: $'],
        [' $b = \\tfrac{\\alpha}{360^\\circ} \\times 2\\pi r', ' $\\ell = \\tfrac{\\alpha}{360^\\circ} \\times 2\\pi r'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Arrasta a extremidade do arco. Para comparar, o círculo inteiro: $P \\approx '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // Portuguese school notation in the formulas the widgets write (Doc, 26.10.2026: always the local conventions), on every
        // page that loads this module (the Gymnasium 5-9 and Oberschule editions): × for the product, as in the 2.º ciclo;
        // a phrase key that contains a product must therefore be written with \times
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
    ]
});
