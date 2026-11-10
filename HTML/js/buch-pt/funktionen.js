/* js/buch-pt/funktionen.js — Portuguese for the widgets of js/buch-funktionen.js.
 * Loaded by the Portuguese editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the pt0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('funktionen', {
    word: {
        // pt0: the cover of the start page (BGY 11 mathe11)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade': 'Capa: parábola, sinusoide, função exponencial e reta',
        // pt0: the helpers of the module (outside every widget; check.mjs funktionen/*): the cases and reasons of parabelschar
        // and funktion are whole labels, keyed by the German as the widget writes it (a word is looked up before the point rule)
        'Parabel': 'Parábola', 'Liegende Spitze': 'Cúspide deitada', 'Liegende Parabel': 'Parábola deitada', 'Wurzel': 'Raiz quadrada',
        'Hyperbel': 'Hipérbole', 'Betrag': 'Módulo',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.': 'À direita de $x = -1$, cada reta vertical interseta a curva duas vezes: a $x = 1$ correspondem $y = 2$ e $y = -2$.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.': 'A $x = 2$ correspondem $y = 2$ e $y = -2$. Mas uma função faz corresponder a cada $x$ exatamente um $y$.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'dois zeros $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'um zero (duplo) $x = 1$',
        'keine Nullstelle': 'nenhum zero',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Binómio discriminante: para $x^2 - 2x + a = 0$, $\\Delta = 4 - 4a = 4(1 - a)$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'dois zeros $x = 0$ e $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'um zero duplo $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).': 'Pôr em evidência: $x^2 + ax = x(x + a) = 0$. Os vértices $V\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ estão todos sobre a parábola $y = -x^2$ (a tracejado).',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'dois zeros $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'não é uma parábola, mas a reta $y = -4$: nenhum zero',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'concavidade voltada para baixo, vértice $(0, -4)$: nenhum zero',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.': '$kx^2 = 4$ só tem soluções para $k > 0$. O caso $k = 0$ tem de ser estudado à parte, porque então o $x^2$ desaparece.',
        'Zaun an der Mauer': 'Vedação junto a um muro',
        'Rechteck mit Umfang 24 cm': 'Retângulo de perímetro 24 cm',
        // book pt-1 mathe11-pt:
        // detektiv, wachstum, gerade, parabel, wurf, einheitskreis, sinus, tageslaenge, regression, anscombe, umkehr, expgleichung,
        // parameter, graphquiz (graph and the plot axis: js/buch-pt.js)
        // detektiv ("keine" stands for no zeros, no symmetry, no asymptotes: "não tem" fits all three)
        // the sine is "sen" in Portuguese schools (the TeX rule below; the labels of detektiv and parameter)
        'sin x': 'sen x',
        'Graph der gewählten Funktion': 'Gráfico da função escolhida', 'Alle aufdecken': 'Mostrar tudo', 'aufdecken': 'mostrar',
        'Definitionsbereich': 'Domínio', 'Wertebereich': 'Contradomínio', 'Nullstellen': 'Zeros', 'Monotonie': 'Monotonia',
        'Symmetrie': 'Simetria', 'Periodisch?': 'Periódica?', 'Asymptoten': 'Assíntotas', 'nein': 'não', 'keine': 'não tem',
        // wachstum
        'Sparen': 'Poupança', 'Kernzerfall': 'Decaimento radioativo', 'Eigene Werte': 'Os teus valores',
        'Lineares und exponentielles Wachstum': 'Crescimento linear e crescimento exponencial', 'Startwert $a$': 'Valor inicial $a$',
        'linear: Änderung $m$ pro Schritt': 'linear: variação $m$ por passo', 'exponentiell: Faktor $q$': 'exponencial: fator $q$',
        'Zeitraum': 'Período de tempo',
        // gerade, parabel, wurf (vertex form a(x − h)² + k with the vertex V(h, k), as lb3-3 writes it)
        'Gerade durch zwei verschiebbare Punkte': 'Reta que passa por dois pontos móveis',
        'Streckfaktor $a$': 'Coeficiente $a$', 'Verschiebung nach rechts $d$': 'Translação para a direita $h$',
        'Verschiebung nach oben $e$': 'Translação para cima $k$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Parábola com vértice móvel',
        'Abwurfhöhe $h_0$': 'Altura de lançamento $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Velocidade de lançamento $v_0$',
        'Höhe beim senkrechten Wurf': 'Altura num lançamento vertical', 't in s': 't em s', 'h in m': 'h em m',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Reproduzir', 'Anhalten': 'Pausa', 'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Einheitskreis und Sinuskurve': 'Círculo trigonométrico e sinusoide',
        'Amplitude $a$': 'Amplitude $a$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Fator $b$ (período $\\tfrac{2\\pi}{b}$)',
        'Verschiebung $c$ nach rechts': 'Translação $c$ para a direita', 'Verschiebung $d$ nach oben': 'Translação $d$ para cima',
        'Sinusfunktion mit Parametern': 'Função seno com parâmetros',
        'Tag des Jahres': 'Dia do ano', 't in Tagen': 't em dias', 'Stunden': 'horas', 'Tageslänge in Dresden': 'Duração do dia em Dresden',
        // regression, anscombe
        'Kerze': 'Vela', 'Bremsweg': 'Distância de travagem', 'Abkühlen': 'Arrefecimento', 'Weltbevölkerung': 'População mundial',
        'Brenndauer in h': 'Tempo de combustão em h', 'Länge in cm': 'Comprimento em cm', 'Tempo in km/h': 'Velocidade em km/h',
        'Bremsweg in m': 'Distância de travagem em m', 'Zeit in min': 'Tempo em min', 'ΔT in °C': 'ΔT em °C', 'Jahr': 'Ano', 'Mrd. Menschen': 'Mil milhões de pessoas',
        'Messreihe': 'Série de medições',
        'Messpunkte und Regressionskurve': 'Pontos medidos e curva de regressão', 'Messpunkte lassen sich verschieben': 'Os pontos medidos podem ser deslocados',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Para um modelo exponencial, os valores têm de ser positivos.',
        'Datensatz': 'Conjunto de dados', 'Anscombe-Quartett': 'Quarteto de Anscombe',
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Função e função inversa, simétricas em relação a y = x',
        'Basis $a$': 'Base $a$', 'rechte Seite $b$': 'segundo membro $b$', 'Lösen': 'Resolver',
        'Die Basis muss positiv und von 1 verschieden sein.': 'A base tem de ser positiva e diferente de 1.',
        'Grundfunktion': 'Função de referência', 'Grundfunktion und veränderte Funktion': 'Função de referência e função transformada',
        'Das ist die Grundfunktion selbst.': 'É a própria função de referência.',
        'Graph, zu dem der Term gesucht ist': 'Gráfico cuja expressão se procura', 'Nächster Graph': 'Gráfico seguinte',
        // book pt-2 mathe12-pt:
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs funktionen/*): none so far
        // book pt-1 mathe11-pt:
        // parameter: c = 0 in f(c·x)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', 'com $c = 0$, $g(x) = f(0)$ é constante'],
        // detektiv
        [' (doppelt)', ' (duplo)'], ['fallend für ', 'decrescente para '], ['steigend für ', 'crescente para '],
        ['achsensymmetrisch zur $y$-Achse', 'simétrica em relação ao eixo $Oy$ (função par)'], ['punktsymmetrisch zum Ursprung', 'simétrica em relação à origem (função ímpar)'],
        ['überall steigend', 'crescente em todo o domínio'], ['fallend auf ', 'decrescente em '], [' und fallend auf ', ' e decrescente em '],
        [' (senkrecht) und ', ' (vertical) e '], ['(waagerecht)', '(horizontal)'], ['$ und $', '$ e $'],
        ['abwechselnd steigend und fallend', 'alternadamente crescente e decrescente'], ['ja, Periode ', 'sim, período '],
        ['$ für $x', '$ para $x'], ['$ mit $k', '$ com $k'],
        // wachstum
        ['einfache Zinsen (30 € pro Jahr)', 'juros simples (30 € por ano)'], ['Zinseszins (3 % pro Jahr)', 'juros compostos (3 % ao ano)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'linear: todos os dias menos 6,25 pontos percentuais'],
        ['Jod-131: Halbwertszeit 8 Tage', 'iodo-131: tempo de meia-vida de 8 dias'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — em cada passo multiplica-se pelo <b>mesmo fator</b>'],
        [' — in jedem Schritt ', ' — em cada passo '], ['geht <b>gleich viel</b> weg', 'sai <b>a mesma quantidade</b>'],
        [' wäre alles verbraucht.', ' estaria tudo gasto.'], ['kommt <b>gleich viel</b> hinzu.', 'junta-se <b>a mesma quantidade</b>.'],
        ['. Nach $', '. Ao fim de $'], [', das sind ', ', ou seja, '], [' % pro Schritt. ', ' % por passo. '],
        ['linear', 'linear'], ['exponentiell', 'exponencial'], ['Verdopplungszeit', 'Tempo de duplicação'], ['Halbwertszeit', 'Tempo de meia-vida'],
        ['Verdopplungszeit: ', 'Tempo de duplicação: '], ['Halbwertszeit: ', 'Tempo de meia-vida: '],
        ['Jahre', 'anos'], ['Tage', 'dias'], ['Schritte', 'passos'], ['Jahren', 'anos'], ['Tagen', 'dias'], ['Schritten', 'passos'],
        // gerade (y = mx + b: declive m, ordenada na origem b)
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Os dois pontos estão na mesma vertical. A reta $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ <b>não</b> é o gráfico de uma função.'],
        ['Steigung $m = ', 'Declive $m = '], ['Achsenabschnitt $n = ', 'Ordenada na origem $b = '], ['$ (weißer Punkt)', '$ (ponto branco)'],
        [' · Nullstelle $x_0 = ', ' · zero $x_0 = '], [' · waagerechte Gerade', ' · reta horizontal'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Para $a = 0$, o gráfico não é uma parábola, mas uma reta.'],
        ['eine (doppelte) Nullstelle: $x = ', 'um zero (duplo): $x = '], ['Nullstellen: $x_1 = ', 'zeros: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Forma canónica: $f(x) = '], [' · Scheitel $S(', ' · vértice $V('], ['Normalform: $f(x) = ', 'Forma geral: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Ponto mais alto ao fim de $t_V = '], ['Aufprall nach $', 'Impacto ao fim de $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ em radianos · '], ['Amplitude $|a| = ', 'Amplitude $|a| = '], [' · Periode $p = ', ' · período $p = '],
        [' · Mittellinie $y = ', ' · linha média $y = '], [' · Wertebereich $', ' · contradomínio $'], ['$ · am ', '$ · a '],
        [' min</b> Tageslicht', ' min</b> de luz do dia'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'Quando acaba de arder a vela?'], ['Bremsweg bei 150 km/h?', 'Distância de travagem a 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', 'Diferença de temperatura ao fim de 45 min?'], ['Prognose für 2050?', 'Previsão para 2050?'],
        ['Regressionsfunktion: $', 'Função de regressão: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;com $x$ = anos desde 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coeficiente de determinação $R^2 = '], ['(passt sehr gut)', '(ajusta-se muito bem)'], ['(passt gut)', '(ajusta-se bem)'],
        ['(passt mäßig)', '(ajusta-se razoavelmente)'], [' Das Modell sagt: $f(', ' O modelo dá: $f('], ['Regressionsgerade: $', 'Reta de regressão: $'],
        ['Datensatz', 'Conjunto de dados'],
        // umkehr, expgleichung (the points get the Portuguese comma from js/buch-pt.js)
        ['$ · Der Punkt $P(', '$ · O ponto $P('], ['$ auf $f$ wird zum Punkt $P', '$ de $f$ passa a ser o ponto $P'], ['$ auf $f^{-1}$.', '$ de $f^{-1}$.'],
        ['Keine Lösung: $', 'Sem solução: $'], ['Probe: $', 'Verificação: $'],
        // parameter ("Der Graph ist …": o gráfico, masculine)
        ['gespiegelt an der $x$-Achse', 'refletido em relação ao eixo $Ox$'], ['gespiegelt an der $y$-Achse', 'refletido em relação ao eixo $Oy$'],
        [', in $x$-Richtung mit Faktor ', ', com o coeficiente horizontal '], ['Der Graph ist ', 'O gráfico é '],
        // parameter: the slider labels "$c \cdot f(x)$: strecken in $y$-Richtung"
        [': strecken in $y$-Richtung', ': dilatar na vertical'], [': verschieben in $y$-Richtung', ': deslocar na vertical'],
        [': stauchen in $x$-Richtung', ': contrair na horizontal'], [': verschieben in $x$-Richtung', ': deslocar na horizontal'],
        // book pt-2 mathe12-pt:
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-1 mathe11-pt:
        // the sine is written sen in Portuguese schools: \sin x → \operatorname{sen} x (einheitskreis, sinus, tageslaenge, graphquiz)
        [/\\sin(?![a-zA-Z])/g, '\\operatorname{sen}'],
        // gerade: lines y = mx + b in Portuguese schools (German y = mx + n), the zero -b/m
        [/-\\tfrac\{n\}\{m\}/g, '-\\tfrac{b}{m}'],
        // tageslaenge: "21. Jun" → "21 de jun."
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' de ' + { Jan: 'jan.', Feb: 'fev.', 'Mär': 'mar.', Apr: 'abr.', Mai: 'mai.', Jun: 'jun.', Jul: 'jul.', Aug: 'ago.', Sep: 'set.', Okt: 'out.', Nov: 'nov.', Dez: 'dez.' }[mo]],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'nenhum zero: o vértice está ' + (a === 'über' ? 'acima' : 'abaixo') + ' do eixo $Ox$ e a parábola tem a concavidade voltada para ' + (b === 'oben' ? 'cima' : 'baixo') + '.'],
        // wurf: "… in $8{,}84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$, a uma altura de $' + h + '$. '],
        // expgleichung
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ é sempre positivo, logo nunca pode ser $' + b + '$.'],
        // expgleichung, umkehr: the common logarithm is log in Portuguese schools, not lg
        [/\\lg(?![a-z])/g, '\\log'],
        // parameter (o gráfico: masculine)
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => (w === 'gestreckt' ? 'dilatado' : 'contraído') + (ax === 'y' ? ' na vertical' : ' na horizontal') + ' com o coeficiente $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' e dilatado com o coeficiente $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestaucht/g, (m, f) => ' e contraído com o coeficiente $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => 'deslocado $' + c + '$ ' + (c === '1' ? 'unidade' : 'unidades') + ' ' + { links: 'para a esquerda', rechts: 'para a direita', oben: 'para cima', unten: 'para baixo' }[d]],
        // graphquiz score: "3 richtig" → "3 certas" (the shared "richtig" → "certo" would not agree with the number)
        [/^(\d+) richtig$/, (m, n) => n + (n === '1' ? ' certa' : ' certas')],
        // book pt-2 mathe12-pt:
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // matrices (a pmatrix with &) become \left(\begin{matrix} … \end{matrix}\right) before the rule of vektoren.js (pt-2) writes every
        // pmatrix as a row vector: it would turn the rotation matrix of drehmatrix (lb7-2) and the matrices of uebergang (abi) into broken TeX;
        // the picture is the same. funktionen.js loads before vektoren.js on those pages.
        [/\\begin\{pmatrix\}((?:(?!\\end\{pmatrix\})[^&])*&(?:(?!\\end\{pmatrix\})[\s\S])*?)\\end\{pmatrix\}/g, '\\left(\\begin{matrix}$1\\end{matrix}\\right)'],
    ]
});
