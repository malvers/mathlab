/* js/buch-pt/gy12lk.js — Portuguese for the widgets of js/buch-gy12lk.js.
 * Loaded by the Portuguese editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy12lk', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy12lk/*)
        // the solids of rotation (BODIES of rotation) and the improper integrals (UFN of uneigentlich)
        'Kegel': 'Cone', 'Kugel': 'Esfera', 'Paraboloid': 'Paraboloide', 'Fass': 'Barril', '1/√x bei 0': '1/√x em 0',
        // book pt-5 mathe13lk-pt:
        // integralfunktion (lb3-2): Integralfunktion = função integral, untere Grenze = limite inferior, Hauptsatz = teorema fundamental
        'Welche Funktion?': 'Que função?', 'untere Grenze $a$': 'limite inferior $a$', 'Graph von f mit der Fläche von a bis x': 'Gráfico de f com a área de a até x',
        'Graph der Integralfunktion mit Tangente': 'Gráfico da função integral com a tangente',
        // rotation (lb3-4): Rotationskörper = sólido de revolução, Kreisscheibe = disco
        'Welcher Körper?': 'Que sólido?', 'Kreisscheiben $n$': 'Discos $n$', 'aus': 'desligado', 'Ziehen zum Drehen': 'Arrasta para rodar',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Sólido de revolução no referencial do espaço, roda-se arrastando',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Acrescenta discos: cada disco tem o volume $\\pi \\, r^2 \\, \\Delta x$ com $r = f(x)$.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy12lk/*)
        // book pt-5 mathe13lk-pt:
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x à esquerda de a: o integral conta para trás)'], ['An der Stelle $x = ', 'No ponto $x = '],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'A tangente cor-de-rosa a $I$ tem declive $'], ['$, und das ist genau $f(', '$, que é exatamente $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. É o teorema fundamental: $I_a\'(x) = f(x)$.'],
        // rotation
        ['$, Abweichung $', '$, desvio $'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // rotation: "$f(x) = …$ auf $[-2;\ 2]$ dreht sich um die $x$-Achse: " (the interval with ";\ ", which the engine rule does not read)
        [/\$ auf \$\[([^;\]$]*);\\ ([^\]$]*)\]\$ dreht sich um die \$x\$-Achse: /g,
            (m, a, b) => '$ em $[' + a + (/\{,\}/.test(a + b) ? '; ' : ', ') + b + ']$ roda em torno do eixo $Ox$: '],
        // rotation: "Summe der 12 Kreisscheiben (Radius in der Mitte jedes Streifens): "
        [/Summe der (\d+) Kreisscheiben \(Radius in der Mitte jedes Streifens\): /g, 'Soma dos $1 discos (raio no ponto médio de cada faixa): '],
    ]
});
