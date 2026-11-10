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
        // skalarprodukt, viereck3d (lb5-2): Skalarprodukt = produto escalar (u · v), orthogonal = perpendiculares, spitz / stumpf = agudo /
        // obtuso, Raute = losango, Viereck = quadrilátero
        'spitzer Winkel': 'ângulo agudo', 'orthogonal': 'perpendiculares', 'stumpfer Winkel': 'ângulo obtuso', 'parallel': 'colineares',
        'Parallelogramm': 'Paralelogramo', 'Rechteck': 'Retângulo', 'Raute': 'Losango', 'Quadrat': 'Quadrado', 'Trapez': 'Trapézio',
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // gerade3d, ebene3d (wp1-1): Parametergleichung = equação vetorial, Richtungsvektor = vetor diretor, Spurpunkte = traços (line) /
        // pontos de interseção com os eixos (plane), Normalenvektor = vetor normal, Koordinatenform = equação cartesiana; the names g, E stay
        // as the widgets draw them
        'Parameter $t$': 'Parâmetro $t$', 'Der Richtungsvektor darf nicht der Nullvektor sein.': 'O vetor diretor não pode ser o vetor nulo.',
        'Ebene und Normalenvektor': 'Plano e vetor normal', 'Liegt der Punkt in E?': 'O ponto pertence a E?', 'Gerade schneidet Ebene': 'Reta interseta plano',
        '$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.': '$\\vec{u}$ e $\\vec{v}$ são colineares, não definem um plano.',
        // geradenlage (wp1-2): identisch = coincidentes, echt parallel = estritamente paralelas, schneidend = concorrentes, windschief = não
        // complanares; "parallel" stays "colineares" as a word (vectors, pt-2): the preset button of lines and planes is a rule below
        'schneidend': 'concorrentes', 'identisch': 'coincidentes', 'windschief': 'não complanares',
        'Richtungsvektoren dürfen nicht der Nullvektor sein.': 'Os vetores diretores não podem ser o vetor nulo.',
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
        // skalarprodukt, viereck3d
        ['$ und $', '$ e $'], [', also $', ', logo $'], [' (stumpf: das Skalarprodukt ist negativ)', ' (obtuso: o produto escalar é negativo)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (agudo: o produto escalar é positivo)'], [' (parallel, gleiche Richtung)', ' (colineares, com o mesmo sentido)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Com o vetor nulo não há ângulo.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'não é um quadrilátero plano: os quatro pontos não estão num mesmo plano.'],
        ['ein <b>Quadrat</b>', 'um <b>quadrado</b>'], ['ein <b>Rechteck</b>', 'um <b>retângulo</b>'], ['eine <b>Raute</b>', 'um <b>losango</b>'],
        ['ein <b>Parallelogramm</b>', 'um <b>paralelogramo</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'um <b>trapézio</b> (um par de lados paralelos)'],
        ['ein allgemeines Viereck', 'um quadrilátero qualquer'], ['$: gegenüberliegende Seiten parallel und gleich lang', '$: lados opostos paralelos e iguais'],
        ['$: rechter Winkel bei $A$', '$: ângulo reto em $A$'], ['$: benachbarte Seiten gleich lang', '$: lados consecutivos iguais'],
        ['$: Diagonalen senkrecht zueinander', '$: diagonais perpendiculares'], ['$ABCD$ ist ', '$[ABCD]$ é '],
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // gerade3d, ebene3d
        ['Punktprobe für $Q(', 'Pertença de $Q('], ['Alle Zeilen liefern $t = ', 'Todas as linhas dão $t = '], ['$, also <b>$Q \\in g$</b>.', '$, logo <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'As linhas dão valores diferentes de $t$, logo <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: keine', 'Traços: nenhum'], ['Spurpunkte: ', 'Traços: '],
        ['Normalenvektor $\\vec{n} = \\vec{u} \\times \\vec{v} = ', 'Vetor normal $\\vec{n} = \\vec{u} \\times \\vec{v} = '], ['$ · Koordinatenform: $', '$ · equação cartesiana: $'],
        ['Spurpunkte mit den Achsen: ', 'Pontos de interseção com os eixos: '], ['Punktprobe: $', 'Pertença: $'], ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ pertence a $E$</b>.'],
        ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$: <b>$Q$ não pertence a $E$</b>. Distância $\\approx '],
        [': Die Gerade ist parallel zur Ebene und liegt in ihr.', ': a reta é paralela ao plano e está contida nele.'],
        [': Die Gerade ist parallel zur Ebene und schneidet sie nicht.', ': a reta é estritamente paralela ao plano e não o interseta.'],
        ['Einsetzen von $g$ in $E$: $t = ', 'Substituindo $g$ em $E$: $t = '], ['$, Schnittpunkt $S(', '$, ponto de interseção $S('], ['$ · Schnittwinkel: $', '$ · ângulo: $'],
        // geradenlage: whole sentences, so the bold words are Portuguese before the labels between tags are looked up
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'Os vetores diretores são colineares ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'O ponto $Q$ pertence a $g$: <b>coincidentes</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'O ponto $Q$ não pertence a $g$: <b>estritamente paralelas</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'Não são paralelas. Igualando obtém-se $t = '], ['$: <b>schneidend</b> im Punkt $S(', '$: <b>concorrentes</b> no ponto $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ',
            'Não são paralelas e o sistema é impossível: <b>não complanares</b>. Distância mínima (a tracejado vermelho) $\\approx '],
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
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // the sine is sen in Portuguese schools, also on the pages that load vektoren without funktionen (Schnittwinkel of ebene3d, geradenlage …)
        [/\\sin(?![a-zA-Z])/g, '\\operatorname{sen}'],
        // presetRow (geradenlage, ebenenlage): the button "parallel" means lines (paralelas) or planes (paralelos), not vectors (colineares);
        // the engine has already put the whole label aside as \u0003n\u0004, so the rule replaces that mark (ebenenlage: the button after "spur")
        [/(data-p="spur">[^<]*<\/button><button type="button" class="b-btn" data-p="par">)(?:\u0003\d+\u0004|parallel)/g, '$1paralelos'],
        [/(data-p="par">)(?:\u0003\d+\u0004|parallel)(?=<\/button>)/g, '$1paralelas'],
    ]
});
