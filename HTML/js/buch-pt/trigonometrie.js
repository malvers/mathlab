/* js/buch-pt/trigonometrie.js — Portuguese for the widgets of js/buch-trigonometrie.js.
 * Loaded by the Portuguese editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-18-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('trigonometrie', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // pyramidekegel (chapters 2.1, 2.2 of OS 9): apótema a_p, aresta lateral ℓ, geratriz g, A_b, A_L, A_T as in js/buch-pt/geometrie.js pt-13
        // (spitzkoerper); "Grundkante $a$", "Radius $r$", "Höhe $h$", "Körper" are words there, the button "Quadratische Pyramide" a rule there
        'Kegel': 'Cone', 'Höhe – Seitenhöhe': 'Altura – apótema', 'Höhe – Seitenkante': 'Altura – aresta lateral', 'Höhe – Mantellinie': 'Altura – geratriz',
        'Rechtwinkliges Dreieck': 'Triângulo retângulo',
        // the body button, as js/buch-pt/gy7.js has it (GY 10 lb3-2 loads only this module; with geometrie.js loaded the word comes first, so
        // spitzkoerper shows «Pirâmide quadrangular» there too)
        'Quadratische Pyramide': 'Pirâmide quadrangular',
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // pyramidekegel: the pieces after the \cdot → \times and \tan → \operatorname{tg} rules of js/buch-pt/geometrie.js (loaded on these pages);
        // "$M = \pi r s \approx", "$O = \pi r^2 + \pi r s \approx" are pieces of geometrie.js (spitzkoerper)
        ['Schrägbild einer quadratischen Pyramide', 'Pirâmide quadrangular regular em perspetiva cavaleira'], ['Schrägbild eines Kegels', 'Cone em perspetiva cavaleira'],
        [' mit einem rechtwinkligen Dreieck', ', com um triângulo retângulo'],
        ['Seitenhöhe $h_s = ', 'Apótema $a_p = '], ['Neigungswinkel der Seitenfläche:', 'Ângulo de inclinação da face lateral:'],
        ['Neigungswinkel der Seitenkante:', 'Ângulo de inclinação da aresta lateral:'], ['Mantellinie $s = ', 'Geratriz $g = '],
        ['Volumen $V = \\tfrac13 ', 'Volume $V = \\tfrac13 '], ['· Oberfläche ', '· área total '], ['· Mantel ', '· superfície lateral '],
        ['$O = a^2 + 4 \\times \\tfrac12 a h_s = a^2 + 2a\\,h_s \\approx ', '$A_T = a^2 + 4 \\times \\tfrac12 a\\,a_p = a^2 + 2a\\,a_p \\approx '],
        ['halber Öffnungswinkel:', 'Semiângulo de abertura:'], ['$ · Öffnungswinkel $2', '$ · ângulo de abertura $2'],
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-18 mathe9-pt:
        // pyramidekegel: the side edge ℓ (aresta lateral, German s) with the diagonal d
        [/Seitenkante \$s = (\\sqrt\{h\^2 \+ \\left\(\\tfrac\{d\}\{2\}\\right\)\^2\})\$ mit der Diagonale \$d = a\\sqrt2 \\approx ([^$]*)\$: \$s \\approx /g,
            (m, f, d) => 'Aresta lateral $\\ell = ' + f + '$, com a diagonal $d = a\\sqrt2 \\approx ' + d + '$: $\\ell \\approx '],
        // pyramidekegel, the labels in its own picture (only this SVG): hₐ → aₚ (apótema), s → ℓ (aresta lateral) or g (geratriz)
        [/<svg viewBox="0 0 520 330" role="img" aria-label="Schrägbild (einer quadratischen Pyramide|eines Kegels) mit einem rechtwinkligen Dreieck">[\s\S]*?<\/svg>/g,
            (m, k) => m.replace(/>hₐ</g, '>aₚ<').replace(/>s<\/text>/g, k === 'eines Kegels' ? '>g</text>' : '>ℓ</text>')],
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
    ]
});
