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
        // the examples of randextrema (the sine is "sen")
        'sin x + x/2': 'sen x + x/2',
        // book pt-4 mathe12lk-pt:
        // stetigkeit (lb2-1): stetig = contínua, Sprungstelle = descontinuidade de salto, hebbare Unstetigkeit = descontinuidade removível
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Função definida por ramos com um ponto de junção',
        // linapprox (lb2-2): lineare Approximation = aproximação linear, Ausschnitt = janela
        'Ausschnitt: halbe Breite $r$': 'Janela: meia largura $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Gráfico da função e tangente numa janela que se pode diminuir',
        // produktregel (lb2-4): Produktregel = regra do produto, Zuwachs = acréscimo, Streifen = faixa, Ecke = canto
        'Zuwachs $h$ von $x$': 'Acréscimo $h$ de $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Retângulo de lados u e v e o seu acréscimo, formado por duas faixas e um canto',
        // randextrema (lb2-5): lokal / global = relativo / absoluto, Rand = fronteira (extremo do intervalo)
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Gráfico da função com um intervalo e os seus extremos relativos e absolutos',
        'linker Rand $a$': 'Extremo esquerdo $a$', 'rechter Rand $b$': 'Extremo direito $b$', 'lokales Maximum': 'máximo relativo',
        'lokales Minimum': 'mínimo relativo', 'Rand': 'fronteira', 'Art': 'Tipo', 'Globales Maximum': 'Máximo absoluto', 'globales Minimum': 'mínimo absoluto',
        // rettung (lb2-8): Rettungsschwimmerin = nadadora-salvadora, Lot = perpendicular, Brechungsgesetz = lei da refração
        'Tempo im Sand $v_1$ (m/s)': 'Velocidade na areia $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Velocidade na água $v_2$ (m/s)',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Praia e água: o caminho da nadadora-salvadora de A, passando pelo ponto P na linha de água, até ao nadador B',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'O tempo T em função do ponto x em que ela entra na água',
        'Sand': 'Areia', 'Wasser': 'Água',
        // book pt-5 mathe13lk-pt:
        // verflechtung (wp2-2): the chocolate factory; its helpers (GZ, outside the widget) here, as the pt0 part of gy11lk belongs to
        // book pt-4; ME (Mengeneinheiten) = u.q. (unidades de quantidade) by the phrase in bgy13lk.js
        'Kakao': 'Cacau', 'Zucker': 'Açúcar', 'Milch': 'Leite', 'Zartbitter': 'Negro', 'Vollmilch': 'De leite', 'Classic': 'Classic', 'Mix': 'Mix',
        'Tafeln „Classic“ $e_1$': 'Tabletes «Classic» $e_1$', 'Boxen „Mix“ $e_2$': 'Caixas «Mix» $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Gozintograma: três matérias-primas, dois produtos intermédios, dois produtos finais; nas setas, as quantidades necessárias',
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
        // produktregel
        ['$ bei $x = 1{,}5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:',
            '$ em $x = 1{,}5$. Se $x$ cresce $h$, a área $u \\cdot v$ cresce duas faixas e um canto:'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $u\\,v\' + u\'\\,v = ',
            'Quando $h \\to 0$, o canto $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ tende para $0 \\cdot v\'$ e fica $u\\,v\' + u\'\\,v = '],
        ['$: die <b>Produktregel</b>.', '$: a <b>regra do produto</b>.'],
        // randextrema
        ['$ auf $[', '$ em $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.',
            ']$. Candidatos: os pontos interiores com $f\'(x) = 0$ e mudança de sinal, e ainda os dois extremos do intervalo.'],
        [' auf dem Intervall. ', ' no intervalo. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'Um extremo absoluto está na <b>fronteira</b>: aí $f\'$ não é zero.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Aqui os dois extremos absolutos estão no interior.'],
        // rettung (the rules have already turned \sin into \operatorname{sen}: both forms below)
        ['Bei $x = ', 'Em $x = '], ['$ m braucht sie ', '$ m, ela demora '], [' s, am schnellsten ist sie bei <b>$x \\approx ', ' s; é mais rápida em <b>$x \\approx '],
        ['$ m</b> mit ', '$ m</b>, com '], [' s (grün).', ' s (a verde).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Ângulos com a perpendicular: na areia, $\\alpha = '], ['$, im Wasser $\\beta = ', '$; na água, $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\operatorname{sen}\\alpha}{v_1} = \\dfrac{\\operatorname{sen}\\beta}{v_2}$: ', '$. No ótimo, $\\dfrac{\\operatorname{sen}\\alpha}{v_1} = \\dfrac{\\operatorname{sen}\\beta}{v_2}$: '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. No ótimo, $\\dfrac{\\operatorname{sen}\\alpha}{v_1} = \\dfrac{\\operatorname{sen}\\beta}{v_2}$: '],
        ['$, das Brechungsgesetz.', '$: a lei da refração.'],
        // book pt-5 mathe13lk-pt:
        // verflechtung
        ['Zwischenprodukte: $\\vec{z} = B \\cdot \\vec{e} = ', 'Produtos intermédios: $\\vec{z} = B \\cdot \\vec{e} = '], ['Rohstoffe: $\\vec{r} = A \\cdot \\vec{z} = ', 'matérias-primas: $\\vec{r} = A \\cdot \\vec{z} = '],
        ['In einem Schritt: $C = A \\cdot B = ', 'Num só passo: $C = A \\cdot B = '],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $C \\cdot \\vec{e} = ', '$ dá as necessidades de matérias-primas por produto final, e $C \\cdot \\vec{e} = '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // linapprox: "… höchstens um 0,0123 ab, das sind 0,0246 pro Einheit von $h$" (the separable verb "weicht … ab")
        [/ ab, das sind ([^ <]+) pro Einheit von \$h\$/g, ', ou seja, $1 por unidade de $h$'],
        // randextrema: the interval "[0;\, 6]" has a space after \, (the interval rule of js/buch-pt.js wants none): [0, 6], [0{,}5; 6]
        [/\[([-−]?\d+(?:\{,\}\d+)?);\\, ([-−]?\d+(?:\{,\}\d+)?)\](?=\$\. Kandidaten)/g, (m, x, y) => '[' + x + (/\{,\}/.test(x + y) ? '; ' : ', ') + y + ']'],
        // book pt-5 mathe13lk-pt:
        // verflechtung: "Für 10 Tafeln und 5 Boxen braucht man <b>… ME Kakao, … ME Zucker und … ME Milch</b>."
        [/Für (\d+) Tafeln und (\d+) Boxen braucht man <b>(\d+) ME Kakao, (\d+) ME Zucker und (\d+) ME Milch<\/b>\./g,
            'Para $1 tabletes e $2 caixas são precisas <b>$3 u.q. de cacau, $4 u.q. de açúcar e $5 u.q. de leite</b>.'],
    ]
});
