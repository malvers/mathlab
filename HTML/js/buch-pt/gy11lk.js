/* js/buch-pt/gy11lk.js — Portuguese for the widgets of js/buch-gy11lk.js.
 * Loaded by the Portuguese editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy11lk', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk/*)
        // the examples of epsdelta, stetigkeit, linapprox ("bei 1" = "em 1"), the products of verflechtung
        // ("Classic" and "Mix" stay as product names)
        'x² bei 1': 'x² em 1', '(x² − 4)/(x − 2) bei 2': '(x² − 4)/(x − 2) em 2', 'sin x / x bei 0': 'sen x / x em 0', '√x bei 4': '√x em 4',
        'Sprung bei 0': 'Salto em 0', 'zwei Parabel- und Geradenstücke': 'parábola e reta', 'Parameter $a$': 'Parâmetro $a$',
        'Gerade und Wurzel': 'reta e raiz', 'Lücke füllen': 'preencher a lacuna', 'Funktionswert $b$ an der Stelle 1': 'Valor da função $b$ no ponto 1',
        'eˣ bei 0': 'eˣ em 0', 'sin x bei 0': 'sen x em 0', 'ln x bei 1': 'ln x em 1',
        'Kakao': 'Cacau', 'Zucker': 'Açúcar', 'Milch': 'Leite', 'Zartbitter': 'Negro', 'Vollmilch': 'De leite', 'Classic': 'Classic', 'Mix': 'Mix',
        // book pt-4 mathe12lk-pt:
        // stetigkeit (lb2-1): stetig = contínua, Sprungstelle = descontinuidade de salto, hebbare Unstetigkeit = descontinuidade removível
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Função definida por ramos com um ponto de junção',
        // linapprox (lb2-2): lineare Approximation = aproximação linear, Ausschnitt = janela
        'Ausschnitt: halbe Breite $r$': 'Janela: meia largura $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Gráfico da função e tangente numa janela que se pode diminuir',
        // book pt-5 mathe13lk-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk/*)
        // book pt-4 mathe12lk-pt:
        // stetigkeit
        ['<b>Stetig an der Stelle ', '<b>Contínua no ponto '],
        [':</b> linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            ':</b> o limite à esquerda, o limite à direita e o valor da função coincidem. O gráfico desenha-se sem levantar o lápis.'],
        ['<b>Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', '<b>Descontinuidade de salto:</b> os limites laterais são diferentes e o gráfico salta '],
        ['. Stetig wird $f$ nur für $', '. $f$ só fica contínua para $'], ['<b>Hebbare Unstetigkeit:</b> Der Grenzwert ', '<b>Descontinuidade removível:</b> o limite '],
        [' existiert, aber der Funktionswert ist ', ' existe, mas o valor da função é '], ['. Mit $b = ', '. Com $b = '], ['$ wird die Lücke geschlossen.', '$, a lacuna fica preenchida.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tangente em $x_0 = '], ['$, also $f(x_0 + h)', '$, logo $f(x_0 + h)'],
        ['Am Rand des Ausschnitts ($h = \\pm', 'Na borda da janela ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$), a tangente afasta-se da curva no máximo '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' por unidade de $h$. Diminui $r$: o erro encolhe mais depressa do que $h$ e, vista de muito perto, a curva parece a sua tangente.'],
        ['. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            '. Diminui $r$: o erro encolhe mais depressa do que $h$ e, vista de muito perto, a curva parece a sua tangente.'],
        // book pt-5 mathe13lk-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // linapprox: "… höchstens um 0,0123 ab, das sind 0,0246 pro Einheit von $h$" (the separable verb "weicht … ab")
        [/ ab, das sind ([^ <]+) pro Einheit von \$h\$/g, ', ou seja, $1 por unidade de $h$'],
        // book pt-5 mathe13lk-pt:
    ]
});
