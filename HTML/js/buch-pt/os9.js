/* js/buch-pt/os9.js — Portuguese for the widgets of js/buch-os9.js.
 * Loaded by the Portuguese editions right after js/buch-os9.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-18-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('os9', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os9/*)
        // book pt-18 mathe9-pt:
        // titelbildos9 (the cover)
        'Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel':
            'Capa: um triângulo retângulo com quadrados construídos sobre os lados, a parábola de um lançamento, um cone e uma esfera',
        // abstandos9 (chapter 1.1): the length of [PQ] stays $\overline{PQ}$, as Portuguese schools write it
        'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse': 'Dois pontos que podes deslocar e a distância entre eles como hipotenusa',
        'Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.':
            'O segmento é a hipotenusa de um triângulo retângulo cujos catetos são paralelos aos eixos.',
        // umkehros9 (chapter 1.1): "Seite $a$" as in js/buch-pt/gy6.js (Lado), which this page does not load
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$',
        'Kein Dreieck möglich': 'Não há triângulo possível', 'Aus diesen Seiten entsteht kein Dreieck.': 'Com estes lados não se forma um triângulo.',
        'Zwei Seiten zusammen müssen länger sein als die dritte.': 'Dois lados juntos têm de ser maiores do que o terceiro.',
        'Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.':
            'Iguais: pelo recíproco do teorema de Pitágoras, o triângulo tem um ângulo reto em $C$.',
        'Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.': 'Números inteiros com $a^2 + b^2 = c^2$ chamam-se ternos pitagóricos.',
        // rwdreieckos9 (chapter 1.2): cateto oposto, cateto adjacente, hipotenusa; "Gegeben" as in js/buch-pt/gy6.js (Dados)
        '$c$ und $\\alpha$': '$c$ e $\\alpha$', '$b$ und $\\alpha$': '$b$ e $\\alpha$', '$a$ und $\\alpha$': '$a$ e $\\alpha$',
        '$a$ und $b$': '$a$ e $b$', '$a$ und $c$': '$a$ e $c$', 'Gegeben': 'Dados',
        'Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.': 'O cateto $a$ tem de ser mais curto do que a hipotenusa $c$.',
        'Rechtwinkliges Dreieck mit dem rechten Winkel bei C': 'Triângulo retângulo com o ângulo reto em C',
        'Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.':
            'O cateto oposto a $\\alpha$ é $a$, o cateto adjacente é $b$ e a hipotenusa é $c$. A calculadora está em DEG.',
        // steigungos9 (chapter 1.3): inclinação em percentagem, ângulo de inclinação
        'Steigung in Prozent': 'Inclinação em percentagem', '100 m waagerecht': '100 m na horizontal',
        '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.': '100 % são exatamente $45^\\circ$: sobe-se tanto quanto se avança.',
        'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.':
            'Mais de 100 % é mais íngreme do que $45^\\circ$; isso só existe em escadas e em comboios de montanha.',
        'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.':
            'A percentagem não cresce na mesma proporção que o ângulo: o dobro da percentagem não é o dobro do ângulo.',
        // dachos9 (chapter 1.3): largura l and comprimento c of the house (German b, l), the rafter s; rules below
        'Hausbreite $b$': 'Largura da casa $l$', 'Dachneigung $\\alpha$': 'Inclinação do telhado $\\alpha$', 'Hauslänge $l$': 'Comprimento da casa $c$',
        'Firsthöhe': 'Altura da cumeeira', 'Sparrenlänge': 'Comprimento das varas',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'A altura divide a empena em dois triângulos retângulos iguais. Os beirais não estão incluídos no cálculo.',
        // kugelos9 (chapter 2.2): "Volumen" and "Oberfläche" as in js/buch-pt/gy8.js and os8.js, which OS 9 does not load
        'Radius gegeben': 'Raio dado', 'Volumen gegeben': 'Volume dado', 'Volumen $V$': 'Volume $V$', 'Radius': 'Raio',
        'Volumen': 'Volume', 'Oberfläche': 'Área total', 'Zylinder darum': 'Cilindro à volta',
        'Eine Kugel in einem Zylinder, der genau um sie passt': 'Uma esfera dentro do cilindro em que encaixa exatamente',
        'Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.':
            'A esfera ocupa sempre exatamente $\\tfrac{2}{3}$ do cilindro em que encaixa. Foi Arquimedes quem o descobriu.',
        // turmos9 (chapter 2.3): cylinder + cone (geratriz g, base A_b) or + hemisphere; "Zylinder" as in js/buch-pt/gleichungen.js ("Kegel" is a rule below)
        'Turm: Zylinder + Kegel': 'Torre: cilindro + cone', 'Silo: Zylinder + Halbkugel': 'Silo: cilindro + semiesfera',
        'Höhe des Zylinders $h$': 'Altura do cilindro $h$', 'Höhe des Kegels $h_K$': 'Altura do cone $h_{\\text{cone}}$',
        'Turm aus einem Zylinder mit einem Kegeldach': 'Torre formada por um cilindro com um telhado cónico',
        'Silo aus einem Zylinder mit einer Halbkugel als Dach': 'Silo formado por um cilindro com uma semiesfera como telhado',
        'Zylinder': 'Cilindro', 'Halbkugel': 'Semiesfera', 'Mantellinie': 'Geratriz',
        'Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.':
            'Na área total só entram as faces exteriores: a base superior do cilindro fica no interior e não conta.',
        // parabelos9 (chapters 3.1, 3.2): parábola de referência, vértice V, forma canónica; "Streckfaktor $a$" as in js/buch-pt/funktionen.js;
        // the form x² + px + q becomes x² + bx + c (the sliders are a rule below)
        'Form': 'Forma', 'Graph einer quadratischen Funktion mit Scheitelpunkt': 'Gráfico de uma função quadrática com o vértice',
        'Streckfaktor $a$': 'Coeficiente $a$', 'Verschiebung $c$': 'Translação $c$', '$y = x^2 + p x + q$': '$y = x^2 + b x + c$',
        '$d$ (nach links, wenn positiv)': '$d$ (para a esquerda, se positivo)', '$e$ (nach oben, wenn positiv)': '$e$ (para cima, se positivo)',
        // quadglos9 (chapter 3.2): fórmula resolvente with a = 1, b, c and the binómio discriminante Δ (rule below)
        'Drei Parabeln mit zwei, einer und keiner Nullstelle': 'Três parábolas com dois zeros, um zero e nenhum zero',
        'Parabel y = x² + p x + q mit ihren Nullstellen': 'Parábola y = x² + bx + c e os seus zeros',
        // fibonaccios9 (chapter O): números de Fibonacci, quocientes, número de ouro
        'Anzahl der Fibonacci-Zahlen $n$': 'Quantidade de números de Fibonacci $n$', 'Wert': 'Valor', 'Quotient': 'Quociente',
        'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618': 'Os quocientes de números de Fibonacci vizinhos aproximam-se do número 1,618',
        'Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.':
            'Cada número é a soma dos dois anteriores. Os quocientes saltam alternadamente para cima e para baixo da linha verde $\\Phi \\approx 1{,}618$ e aproximam-se cada vez mais dela.',
        // spannweiteos9 (chapter 4): amplitude, média, mediana ("Spannweite", "Mittelwert", "Ausreißer weg", "Streuung von B" in js/buch-pt/daten.js)
        'Ausreißer zu A (5,8 m)': 'Juntar um valor atípico a A (5,8 m)', 'GRUPPE A': 'GRUPO A', 'GRUPPE B': 'GRUPO B',
        'Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite': 'Saltos em comprimento de dois grupos, com a média e a amplitude',
        'kleinster Wert': 'menor valor', 'größter Wert': 'maior valor', 'Zentralwert': 'Mediana',
        'Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.':
            'Linha branca: média. O parêntese por baixo dos pontos vai do menor ao maior valor; o seu comprimento é a amplitude. Valores inventados.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os9/*)
        // book pt-18 mathe9-pt:
        // umkehros9: "$a^2 + b^2 = 9 + 16 = 25$ und $c^2 = 25$."
        ['$ und $c^2 = ', '$ e $c^2 = '],
        // steigungos9 (the \tan rule of js/buch-pt/geometrie.js runs before the pieces: \operatorname{tg})
        ['\\,\\%$ Steigung: auf 100 m waagerecht ', '\\,\\%$ de inclinação: em 100 m na horizontal sobe-se '], [' m höher, also $\\operatorname{tg} \\alpha', ' m, portanto $\\operatorname{tg} \\alpha'],
        ['Steigungswinkel: $\\alpha = \\operatorname{tg}^{-1}(', 'Ângulo de inclinação: $\\alpha = \\operatorname{tg}^{-1}('],
        // dachos9: the formulas after the \cdot → \times and \tan rules of js/buch-pt/geometrie.js; width l, length c
        ['$h = \\tfrac{b}{2} \\times \\operatorname{tg} \\alpha = ', '$h = \\tfrac{l}{2} \\times \\operatorname{tg} \\alpha = '],
        ['$s = \\dfrac{b/2}{\\cos \\alpha} \\approx ', '$s = \\dfrac{l/2}{\\cos \\alpha} \\approx '], ['$2 \\times s \\times l \\approx ', '$2 \\times s \\times c \\approx '],
        // kugelos9: the total area A_T (as GY 9) and the volume of the cylinder V_cil (German O, V_Z)
        ['$O = 4\\pi r^2 \\approx ', '$A_T = 4\\pi r^2 \\approx '], ['$V_Z = ', '$V_{\\text{cil}} = '],
        // turmos9: V_cone, h_cone, V_semiesf, the base A_b and the slant height g (German V_K, h_K, V_H, A_G, s)
        ['$V_K = \\tfrac{1}{3}\\pi r^2 h_K', '$V_{\\text{cone}} = \\tfrac{1}{3}\\pi r^2 h_{\\text{cone}}'], ['$s = \\sqrt{r^2 + h_K^2}', '$g = \\sqrt{r^2 + h_{\\text{cone}}^2}'],
        ['$V_H = ', '$V_{\\text{semiesf}} = '], ['$A_G + 2\\pi r h + ', '$A_b + 2\\pi r h + '], ['\\pi r s \\approx ', '\\pi r g \\approx '],
        // parabelos9: the vertex V (the point rule of js/buch-pt.js writes the comma)
        ['Quadratische Ergänzung: $y = x^2', 'Completar o quadrado: $y = x^2'],
        ['$: Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.', '$: para $a = 0$, o gráfico já não é uma parábola, mas sim uma reta horizontal.'],
        ['$ · Scheitelpunkt $S(', '$ · vértice $V('], ['$ (weiß)', '$ (a branco)'], ['Wertebereich: $y ', 'Contradomínio: $y '],
        ['Nullstellen (türkis): ', 'Zeros (a turquesa): '], ['genau eine, $x_0 = ', 'exatamente um, $x_0 = '],
        ['keine, die Parabel trifft die x-Achse nicht', 'nenhum, a parábola não interseta o eixo das abcissas'],
        // fibonaccios9
        ['Fibonacci-Zahlen: ', 'Números de Fibonacci: '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-18 mathe9-pt:
        // umkehros9: the triangle's aria-label and the angle at C when a² + b² ≠ c²
        [/^Dreieck mit den Seiten (\d+), (\d+) und (\d+)$/, 'Triângulo com os lados $1, $2 e $3'],
        [/Nicht gleich: Der Winkel bei \$C\$ ist (kleiner|größer) als \$90\^\\circ\$, nämlich etwa \$/g,
            (m, k) => 'Diferentes: o ângulo em $C$ é ' + (k === 'kleiner' ? 'menor' : 'maior') + ' do que $90^\\circ$, mede cerca de $'],
        // steigungos9: the aria-label of the slope triangle
        [/^Steigungsdreieck einer Straße mit (\d+) Prozent Steigung$/, 'Triângulo de inclinação de uma estrada com $1 % de inclinação'],
        // dachos9: in the picture the width is l (largura), then the aria-label and the roof area (vektoren.js has "Dachfläche" as one roof face)
        [/<svg viewBox="0 0 320 320" role="img" aria-label="Querschnitt eines Satteldachs mit Neigung \d+ Grad">[\s\S]*?<\/svg>/g, m => m.replace(/>b = /g, '>l = ')],
        [/^Querschnitt eines Satteldachs mit Neigung (\d+) Grad$/, 'Corte de um telhado de duas águas com $1 graus de inclinação'],
        [/<td>Dachfläche<\/td>(?=<td>\$2 \\times s)/g, '<td>Área do telhado</td>'],
        // turmos9: the table row "Kegel" (no word, see pyramidekegel in js/buch-pt/trigonometrie.js)
        [/<td>Kegel<\/td>/g, '<td>Cone</td>'],
        // turmos9: the slant height of the cone roof in the picture is g (geratriz)
        [/<svg viewBox="0 0 320 340" role="img" aria-label="Turm aus einem Zylinder mit einem Kegeldach">[\s\S]*?<\/svg>/g, m => m.replace(/>s<\/text>/g, '>g</text>')],
        // parabelos9, quadglos9: the sliders p, q of the form x² + px + q are b, c (tied to their range rows; komplex.js has its own $p$)
        [/(<label for="b-r\d+">)\$([pq])\$(?=<\/label><input class="b-slider" id="b-r\d+" type="range" min="-(?:6|10|12)" max="(?:6|10|12)" step="(?:0\.5|1)")/g,
            (m, l, k) => l + (k === 'p' ? '$b$' : '$c$')],
        // parabelos9: opening and shape of the parabola, the vertex as minimum or maximum, the monotony
        [/Die Parabel ist nach (oben|unten) geöffnet und (so weit wie die Normalparabel|enger als die Normalparabel \(gestreckt\)|weiter als die Normalparabel \(gestaucht\))\. Der Scheitelpunkt ist ein <b>(Minimum|Maximum)<\/b>\./g,
            (m, o, f, x) => 'A parábola tem a concavidade voltada para ' + (o === 'oben' ? 'cima' : 'baixo') + ' e é ' + ({
                'so weit wie die Normalparabel': 'tão larga como a parábola de referência',
                'enger als die Normalparabel (gestreckt)': 'mais estreita do que a parábola de referência (dilatada)',
                'weiter als die Normalparabel (gestaucht)': 'mais larga do que a parábola de referência (contraída)' })[f] +
                '. O vértice é um <b>' + (x === 'Minimum' ? 'mínimo' : 'máximo') + '</b>.'],
        [/(Fallend|Steigend) für \$x &lt; ([^$]*)\$, (steigend|fallend) für \$x &gt; /g,
            (m, a, x, b) => (a === 'Fallend' ? 'Decrescente' : 'Crescente') + ' para $x &lt; ' + x + '$, ' + (b === 'steigend' ? 'crescente' : 'decrescente') + ' para $x &gt; '],
        // quadglos9: the Portuguese fórmula resolvente with a = 1, b = p, c = q and the binómio discriminante Δ = b² − 4ac = 4 × D
        // (Portuguese school notation instead of the German p-q formula; the solutions x₁, x₂ stay as the widget computes them)
        [/ &nbsp; mit \$p = (-?\d+)\$, \$q = (-?\d+)\$<\/p><p style="margin:6px 0 0">\$x_\{1,2\} = [^$]*\$<\/p><p style="margin:6px 0 0"><b>(Zwei Lösungen|Genau eine Lösung|Keine Lösung)<\/b>, weil (?:die Diskriminante )?\$D = [^$]*\$ ist: ([\s\S]*)$/,
            (m, p, q, k, rest) => {
                const b = +p, c = +q, D = b * b - 4 * c, par = v => v < 0 ? '(' + v + ')' : String(v);
                const head = ' &nbsp; com $a = 1$, $b = ' + b + '$, $c = ' + c + '$</p><p style="margin:6px 0 0">$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} = \\dfrac{' + (-b) +
                    ' \\pm \\sqrt{' + par(b) + '^2 - 4 \\times 1 \\times ' + par(c) + '}}{2} = \\dfrac{' + (-b) + ' \\pm \\sqrt{' + D + '}}{2}$</p><p style="margin:6px 0 0">';
                if (k === 'Zwei Lösungen') return head + '<b>Duas soluções</b>, porque o binómio discriminante é $\\Delta = ' + D + ' &gt; 0$: ' + rest;
                if (k === 'Genau eine Lösung') return head + '<b>Exatamente uma solução</b>, porque $\\Delta = 0$: ' +
                    rest.replace('. Der Scheitelpunkt liegt auf der x-Achse.', '. O vértice está sobre o eixo das abcissas.');
                return head + '<b>Nenhuma solução</b>, porque $\\Delta = ' + D + ' &lt; 0$: ' +
                    rest.replace('Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.',
                        'um número negativo não tem raiz quadrada. A parábola está toda acima do eixo das abcissas.');
            }],
    ]
});
