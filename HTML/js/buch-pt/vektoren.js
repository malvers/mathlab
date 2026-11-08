/* js/buch-pt/vektoren.js — Portuguese for the widgets of js/buch-vektoren.js.
 * Loaded by the Portuguese editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package pt2-prep (08.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('vektoren', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // the 3D stage and the coordinate inputs: Vektor = vetor, Punkt = ponto; the bars between the inputs "( 2 | -1 | 1 )" become
        // commas, as Portuguese writes coordinates (2, -1, 1)
        'Räumliches Koordinatensystem': 'Referencial do espaço', 'Ziehen zum Drehen': 'Arrasta para rodar', 'Beispiele:': 'Exemplos:', '|': ',',
        // book pt-2 mathe12-pt:
        // raum-hero, raum3d (lb5-1): Ortsvektor = vetor posição, Verbindungsvektor = vetor AB (extremidade menos origem), Betrag = norma,
        // Mittelpunkt = ponto médio M, Nullvektor = vetor nulo, Vielfaches = múltiplo; the notation by the rules below
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Referencial do espaço com um ponto e o seu vetor posição',
        'Punkte und Verbindungsvektor': 'Pontos e vetor AB', 'Summe und Differenz': 'Soma e diferença', 'Vielfaches': 'Múltiplo',
        'Was wird gezeigt?': 'O que é mostrado?', 'Mittelpunkt M zeigen': 'Mostrar o ponto médio M', 'Summe oder Differenz': 'Soma ou diferença',
        'Faktor $r$': 'Fator $r$',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // book pt-2 mathe12-pt:
        // raum3d (the rules below have already written \overrightarrow{AB}, the norm \|…\| and the coordinates in a row)
        ['Ortsvektoren $\\overrightarrow{OA} = ', 'Vetores posição $\\overrightarrow{OA} = '], ['$ · Verbindungsvektor $\\overrightarrow{AB}', '$ · vetor $\\overrightarrow{AB}'],
        ['Länge: $\\|\\overrightarrow{AB}\\|', 'Norma: $\\|\\overrightarrow{AB}\\|'],
        ['Mittelpunkt: $\\overrightarrow{OM} = \\tfrac12\\,(\\overrightarrow{OA} + \\overrightarrow{OB})$, also $',
            'Ponto médio: $\\overrightarrow{OM} = \\tfrac12\\,(\\overrightarrow{OA} + \\overrightarrow{OB})$, logo $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Subtrair é juntar o vetor simétrico $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Somar é encostar $\\vec{b}$ à extremidade de $\\vec{a}$. A soma é a diagonal do paralelogramo.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Um fator negativo inverte o sentido.'], ['Mit $r = 0$ entsteht der Nullvektor.', 'Com $r = 0$ obtém-se o vetor nulo.'],
        [' Die Länge wird mit $|r| = ', ' O comprimento fica multiplicado por $|r| = '], ['$ multipliziert: $|r \\cdot \\vec{a}|', '$: $\\|r \\cdot \\vec{a}\\|'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-2 mathe12-pt:
        // the coordinate inputs: aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/^(Vektor|Punkt) (\S+), ([xyz])-Koordinate$/, (m, w, n, ax) => (w === 'Vektor' ? 'Vetor ' : 'Ponto ') + n + ', coordenada ' + ax],
        // Portuguese school notation for vectors (as on the pages): the norm ‖a‖ (German |a|), the vector of two points with a long
        // arrow, \overrightarrow{AB} (German \vec{AB}), the coordinates in a row (2, -1, 1) instead of a column, with semicolons as soon as
        // a coordinate has a decimal comma, and the scalar product u · v (German u ∘ v; degrees "^\circ" have no space before and stay)
        [/\|(\\vec\{[^{}]*\})\|/g, '\\|$1\\|'],
        [/\\vec\{([A-Z]{2})\}/g, '\\overrightarrow{$1}'],
        [/\\begin\{pmatrix\}\s*((?:(?!\\end\{pmatrix\})[\s\S])*?)\s*\\end\{pmatrix\}/g,
            (m, inner) => '(' + inner.split(/\s*\\\\\s*/).join(/\{,\}|\d,\d/.test(inner) ? '; ' : ', ') + ')'],
        [/ \\circ /g, ' \\cdot '],
    ]
});
