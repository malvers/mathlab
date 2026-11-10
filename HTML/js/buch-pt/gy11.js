/* js/buch-pt/gy11.js — Portuguese for the widgets of js/buch-gy11.js.
 * Loaded by the Portuguese editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy11', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy11/*)
        // the outer functions of kettenregel: the sine is "sen" in Portuguese schools
        'sin z': 'sen z',
        // book pt-4 mathe12lk-pt:
        // kettenregel (lb2-4): Kettenregel = regra da cadeia, äußere / innere Funktion = função exterior / interior
        'Äußere Funktion u(z)': 'Função exterior u(z)', 'Innere Funktion v(x)': 'Função interior v(x)',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Função composta com a tangente num ponto que se pode deslocar',
        // book pt-5 mathe13lk-pt:
        // matrixprodukt (wp2-1): Typ (2, 3) = tipo 2 × 3 (Portuguese schools), verkettet = compatíveis, Kommutativgesetz = propriedade comutativa
        'Typen der Matrizen': 'Tipos das matrizes', 'Reihenfolge': 'Ordem', 'Neue Zahlen': 'Novos números', 'nicht definiert': 'não definido',
        '(2,2) · (2,2)': '(2 × 2) · (2 × 2)', '(2,3) · (3,1)': '(2 × 3) · (3 × 1)', '(2,3) · (3,2)': '(2 × 3) · (3 × 2)', '(3,3) · (3,1)': '(3 × 3) · (3 × 1)',
        'hier zufällig dasselbe': 'aqui, por acaso, o mesmo', 'andere Zahlen': 'outros números',
        // drehmatrix (lb7-2): Drehmatrix = matriz de rotação
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'Uma figura é rodada em torno da origem com uma matriz de rotação',
        'Drehwinkel $\\varphi$': 'Ângulo de rotação $\\varphi$',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy11/*)
        // book pt-4 mathe12lk-pt:
        // kettenregel
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; exterior $u(z) = '], ['$, innen $v(x) = ', '$, interior $v(x) = '],
        ['An der Stelle $x_0 = ', 'No ponto $x_0 = '], ['$ ist $v(x_0) = ', '$ tem-se $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$: aí $f$ não está definida ou não é derivável. Arrasta o ponto para outro sítio.'],
        ["$, also $f'(x_0) \\approx ", "$, logo $f'(x_0) \\approx "],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0{,}0001$): $', '$. Verificação com a razão incremental ($h = 0{,}0001$): $'],
        // book pt-5 mathe13lk-pt:
        // matrixprodukt
        ['$ ist nicht definiert.', '$ não está definido.'], ['$ ergibt hier zufällig dasselbe.', '$ dá aqui, por acaso, o mesmo.'], ['$ ergibt andere Zahlen.', '$ dá outros números.'],
        ['Andersherum: ', 'Pela ordem inversa: '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' Em geral, a propriedade comutativa não vale para matrizes.'],
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · A rotação é feita em torno da origem, no sentido contrário ao dos ponteiros do relógio.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // matrixprodukt: the types in TeX "(2,3)" → "2 × 3", only inside the sentences of this widget (never a bare digit pattern)
        [/\$([AB])\$ hat den Typ \$\((\d),(\d)\)\$, \$([AB])\$ den Typ \$\((\d),(\d)\)\$\. ([AB]) hat (\d) Spalten, ([AB]) aber (\d) Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht\./g,
            (m, p, a, b, q, c, d, p2, s, q2, z) => '$' + p + '$ é do tipo $' + a + ' \\times ' + b + '$ e $' + q + '$ do tipo $' + c + ' \\times ' + d + '$. ' + p2 + ' tem ' + s + (s === '1' ? ' coluna' : ' colunas') +
                ', mas ' + q2 + ' tem ' + z + (z === '1' ? ' linha' : ' linhas') + ': por esta ordem, as matrizes não são compatíveis e o produto não existe.'],
        [/Typen: \$\((\d),(\d)\) \\cdot \((\d),(\d)\) = \((\d),(\d)\)\$ · Klick auf ein Feld des Ergebnisses\./g,
            (m, a, b, c, d, e, f) => 'Tipos: $(' + a + ' \\times ' + b + ') \\cdot (' + c + ' \\times ' + d + ') = ' + e + ' \\times ' + f + '$ · Clica num elemento do resultado.'],
        [/Zeile (\d) von \$([AB])\$ mal Spalte (\d) von \$([AB])\$: /g, 'Linha $1 de $$$2$$ vezes coluna $3 de $$$4$$: '],
        [/\$([AB]) \\cdot ([AB])\$ hat den Typ \$\((\d),(\d)\)\$, ist also etwas ganz anderes\./g, (m, a, b, c, d) => '$' + a + ' \\cdot ' + b + '$ é do tipo $' + c + ' \\times ' + d + '$: é algo completamente diferente.'],
    ]
});
