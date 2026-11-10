/* js/buch-pt/gy11lk-stoch.js — Portuguese for the widgets of js/buch-gy11lk-stoch.js.
 * Loaded by the Portuguese editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy11lk-stoch', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk-stoch/*)
        // book pt-4 mathe12lk-pt:
        // umkehrbaum (lb1-1): the tree and the inverted tree, three examples
        'Schnelltest': 'Teste rápido', 'Spamfilter': 'Filtro de spam', 'Zwei Maschinen': 'Duas máquinas', 'von 10 000': 'em 10 000',
        'Spam': 'spam', 'Baumdiagramm: erst A, dann B': 'Diagrama em árvore: primeiro A, depois B',
        'Umgekehrtes Baumdiagramm: erst B, dann A': 'Diagrama em árvore inverso: primeiro B, depois A',
        'Dieses Bild braucht js/buch-stochastik.js.': 'Esta figura precisa de js/buch-stochastik.js.',
        // galton (lb1-3): Galtonbrett = tabuleiro de Galton, Nagelreihen = filas de pregos, Fach = compartimento
        'Nagelreihen $n$': 'Filas de pregos $n$', 'nach rechts mit $p$': 'para a direita com $p$', 'Leeren': 'Esvaziar',
        'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Frequências relativas dos compartimentos comparadas com a distribuição binomial',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk-stoch/*)
        // book pt-4 mathe12lk-pt:
        // umkehrbaum
        ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
            'A primeira árvore dá o numerador e o denominador; a árvore inversa mostra o resultado no seu ramo de cima, depois de $B$.'],
        ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$: a condição $B$ é impossível, não há nada a calcular.'],
        // the pieces of the sentences that a rule below translates as a whole (so check.mjs sees them translated, too)
        ['kein Spam', 'não é spam'], ['enthält „Gratis“', 'contém «grátis»'], ['ohne „Gratis“', 'sem «grátis»'], ['Maschine 1', 'máquina 1'],
        ['Maschine 2', 'máquina 2'], ['in Ordnung', 'sem defeito'], ['In Zahlen: Von ', 'Em números: de '], [' Fällen mit „', ' casos com «'], ['“ sind ', '», '],
        // galton
        ['$ für $X \\sim B(', '$ para $X \\sim B('], ['Mittleres Fach $', 'Compartimento médio $'], ['$, Erwartungswert $n \\cdot p = ', '$, valor médio $n \\cdot p = '],
        ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.',
            'Deixa cair bolas: cada uma bate em $n$ pregos e salta de cada vez para a direita com probabilidade $p$.'],
        ['Galtonbrett mit ', 'Tabuleiro de Galton com '], [' Nagelreihen', ' filas de pregos'],
        [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' bolas. Barras: frequência relativa por compartimento, pontos: $P(X = k)$ para $X \\sim B('],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // umkehrbaum: the sliders P_A(B), P_{not A}(B) are P(B|A), P(B|not A) in Portuguese schools (P_B(A) has its rule in stochastik)
        [/P_A\(B\)/g, 'P(B|A)'], [/P_\{\\overline\{A\}\}\(B\)/g, 'P(B|\\overline{A})'],
        // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ." with the names of the three examples
        [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/, (m, a, na, b, nb) => {
            const T = { 'krank': 'doente', 'gesund': 'saudável', 'positiv': 'positivo', 'negativ': 'negativo', 'Spam': 'spam', 'kein Spam': 'não é spam',
                'enthält „Gratis“': 'contém «grátis»', 'ohne „Gratis“': 'sem «grátis»', 'Maschine 1': 'máquina 1', 'Maschine 2': 'máquina 2',
                'defekt': 'defeituosa', 'in Ordnung': 'sem defeito' }, t = x => T[x] || x;
            return '$A$: ' + t(a) + ', $\\overline{A}$: ' + t(na) + ', $B$: ' + t(b) + ', $\\overline{B}$: ' + t(nb) + '.';
        }],
        // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“." - a Portuguese sentence for each of the three examples
        [/In Zahlen: Von (\d[\d .]*?) Fällen mit „(.+?)“ sind (\d[\d .]*?) „(.+?)“\./g, (m, all, b, hit, a) => {
            const one = hit === '1';
            const T = { 'positiv': ['casos com teste positivo', one ? 'está doente' : 'estão doentes'],
                'enthält „Gratis“': ['e-mails que contêm «grátis»', one ? 'é spam' : 'são spam'],
                'defekt': ['peças defeituosas', one ? 'vem da máquina 1' : 'vêm da máquina 1'] }[b];
            return T ? 'Em números: de ' + all + ' ' + T[0] + ', ' + hit + ' ' + T[1] + '.' : 'Em números: de ' + all + ' casos com «' + b + '», ' + hit + ' são «' + a + '».';
        }],
        // galton: the board in the aria label and the count of balls
        [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Tabuleiro de Galton com ' + n + (n === '1' ? ' fila' : ' filas') + ' de pregos'],
        [/(\d[\d .]*?) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$/g, (m, k) => k + (k === '1' ? ' bola' : ' bolas') + '. Barras: frequência relativa por compartimento, pontos: $'],
    ]
});
