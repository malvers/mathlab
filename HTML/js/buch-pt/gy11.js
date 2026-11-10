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
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
    ]
});
