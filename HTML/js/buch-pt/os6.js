/* js/buch-pt/os6.js — Portuguese for the widgets of js/buch-os6.js.
 * Loaded by the Portuguese editions right after js/buch-os6.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-14-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('os6', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os6/*)
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // tangramos6 (the pieces are phrases below; 'Quadrat' and 'Parallelogramm' are words of js/buch-pt/gy6.js)
        'Tangram: sieben Teile in einem Quadrat': 'Tangram: sete peças num quadrado',
        // the helpers of the module (labels of wuerfelbauos6, reported on every page that loads os6; the same words as pt-14 and pt-15)
        'Treppe': 'Escada', 'Turm': 'Torre', 'Mauer': 'Muro', 'Selbst bauen': 'Construir',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os6/*)
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // tangramos6: the pieces (helpers of the module, outside the widget) and the sentences
        ['großes Dreieck', 'triângulo grande'], ['mittleres Dreieck', 'triângulo médio'], ['kleines Dreieck', 'triângulo pequeno'],
        ['Anteil am Quadrat: ', 'Parte do quadrado: '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'Se o quadrado medir 4 cm × 4 cm, a peça tem '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Toca numa peça. As sete peças juntas formam o quadrado inteiro: '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // tangramos6: the square and the parallelogram in lower case like the triangles, as the name of the piece and in the
        // list of the pieces of equal area (the triangles of that list are phrases)
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'quadrado' : 'paralelogramo') + b],
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => 'Com a mesma área: ' + l.replace(/\bQuadrat\b/g, 'quadrado').replace(/\bParallelogramm\b/g, 'paralelogramo') + ' (com destaque a claro).'],
    ]
});
