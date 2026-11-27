/* js/buch-pt/gy8.js — Portuguese for the widgets of js/buch-gy8.js.
 * Loaded by the Portuguese editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-11-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gy8', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy8/*)
        // book pt-12 mathegy8-pt:
        // titelbildgy8
        'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
            'Capa: um triângulo ampliado a partir de um centro, um quadrado formado por a², duas vezes ab e b², duas retas com o seu ponto de interseção e um diagrama em árvore',
        // termbaum8 (Term = expressão, as in tools/buch-pt/glossario.md)
        'Term': 'Expressão', 'Wert für $x$': 'Valor de $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Toca num nó: a sua subexpressão acende-se.',
        // binomformeln8 (the binomial formulas are the casos notáveis)
        '1. Formel': '1.º caso', '2. Formel': '2.º caso', '3. Formel': '3.º caso', 'Binomische Formel': 'Caso notável',
        'Binomische Formel als Flächenbild': 'Caso notável como figura de áreas',
        'Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.':
            'O quadrado grande é formado por quatro partes: $a^2$, duas vezes $ab$ e $b^2$. Quem calcula só $a^2 + b^2$ esquece-se dos dois retângulos azuis.',
        'Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.':
            'Ao quadrado $a^2$ tiras as duas faixas vermelhas $ab$. O quadrado verde do canto, $b^2$, está nas duas faixas, por isso tiraste-o duas vezes. Uma vez volta a entrar: $+\\,b^2$.',
        'Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.':
            'Do quadrado $a^2$ recorta-se o canto $b^2$. A parte azul é rodada e colocada à direita: obtém-se um retângulo de lados $a + b$ e $a - b$.',
        // gluecksrad8 (Feld = setor da roleta)
        'Felder': 'Setores', 'ein Feld weniger': 'menos um setor', 'ein Feld mehr': 'mais um setor',
        'gleich groß': 'iguais', 'verschieden groß': 'diferentes', 'Größe der Felder': 'Tamanho dos setores', 'Drehen': 'Rodar',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Toca em setores da roleta: formam o acontecimento $E$ (a amarelo). Depois faz girar a roleta.',
        // ziffern8 (coin faces as in the other pt books: face nacional / face europeia; "Würfel" is the die here)
        'als Münze': 'como moeda', 'als Würfel': 'como dado', 'Lesart': 'Leitura', 'Neue Tabelle': 'Nova tabela',
        'Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.': 'Algarismo par (0, 2, 4, 6, 8) = face nacional, ímpar = face europeia. Cada algarismo é um lançamento da moeda.',
        'Augenzahl': 'Número de pintas', 'absolut': 'absoluta', 'relativ': 'relativa',
        // wegzeit8 (the distance is d, as in the chapter text: «$d = 80t$»)
        'Zeit $t$ in min': 'Tempo $t$ em min', 't in min': 't em min', 'Weg-Zeit-Diagramm des Schulwegs': 'Gráfico distância-tempo do caminho para a escola',
        'Zuhause': 'Casa', 'Haltestelle': 'Paragem', 'Schule': 'Escola',
        'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'O caminho para a escola como um segmento; o ponto mostra onde está a Mia',
        'Mia ist in der Schule angekommen.': 'A Mia chegou à escola.',
        // lgs8 (methods as in tools/buch-pt/glossario.md, mathefos11-pt; 'Nächster Schritt' is in js/buch-pt/lgs.js)
        'Einsetzungsverfahren': 'Substituição', 'Gleichsetzungsverfahren': 'Igualação', 'Additionsverfahren': 'Adição ordenada', 'Verfahren': 'Método',
        'Alle Schritte': 'Todos os passos', 'Neues Gleichungssystem': 'Novo sistema',
        'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'As duas retas do sistema e o seu ponto de interseção',
        'Klammer auflösen und zusammenfassen.': 'Desembaraça de parênteses e reduz os termos semelhantes.',
        'Löse beide Gleichungen nach $y$ auf.': 'Resolve as duas equações em ordem a $y$.',
        'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'Os segundos membros são ambos iguais a $y$, logo são iguais entre si: igualar.',
        'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'Todos os $x$ para a esquerda, todos os números para a direita, depois divide.',
        'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Multiplica de modo que os coeficientes de $y$ fiquem simétricos.',
        'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Adiciona as duas equações membro a membro: $y$ desaparece.',
        'Nach $x$ auflösen.': 'Resolve em ordem a $x$.', 'Nach $y$ auflösen.': 'Resolve em ordem a $y$.',
        // streckung8 (homotetia de centro O e razão k: the centre Z is O, rules below)
        'Streckfaktor $k$': 'Razão $k$', 'Original': 'Figura original', 'Verhältnis': 'Razão', 'Winkel bei $A$': 'Ângulo em $A$', 'gleich': 'igual', 'Fläche': 'Área',
        'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
            'Arrasta $O$, $A$, $B$ e $C$. As semirretas a tracejado começam em $O$ e passam por cada ponto e pela sua imagem.',
        // aehnlich8 (the verdicts with k: rules below; the table head "Seiten­verhältnis" has a soft hyphen)
        'Ein Beispiel zeigen': 'Mostrar um exemplo', 'gegeben': 'dado', 'dein Dreieck': 'o teu triângulo',
        'Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen': 'Um triângulo dado e um segundo triângulo para comparar',
        'klein': 'pequeno', 'mittel': 'médio', 'groß': 'grande', 'Winkel, gegeben': 'Ângulos dados', 'Winkel bei dir': 'Os teus ângulos', 'Seiten\u00adverhältnis': 'Razão dos lados',
        'Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.': 'Os três pontos estão alinhados: isto não é um triângulo.',
        'Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?':
            'Arrasta os vértices amarelos para os pontos da quadrícula. Consegues fazer um triângulo semelhante ao dado, mas colocado de outra maneira?',
        // gulliver8 (the sentence for the other k: a rule below)
        'Streckfaktor': 'Razão', 'großer Würfel': 'cubo grande', 'Faktor': 'Fator',
        'Kantenlänge': 'Aresta', 'Oberfläche': 'Área total', 'Volumen': 'Volume',
        'Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.':
            'O Gulliver é 12 vezes mais alto do que um liliputiano. A sua pele tem, por isso, uma área $144$ vezes maior e o seu corpo um volume $1728$ vezes maior. Em Jonathan Swift, os matemáticos do imperador fazem exatamente esta conta e dão-lhe todos os dias comida para 1724 liliputianos, menos quatro do que $12^3$.',
        // schatten8 (the shadows s, S stay: sombra)
        'Schattenmethode': 'Método das sombras', 'Försterdreieck': 'Triângulo do guarda-florestal', 'Methode': 'Método', 'Sonnenhöhe': 'Altura do Sol',
        'Abstand $d$ zum Baum': 'Distância $d$ à árvore', 'Höhe ausrechnen': 'Calcular a altura', 'Neuer Baum': 'Nova árvore', 'Stab 2 m': 'Vara 2 m',
        'Baum und Stab mit ihren Schatten': 'Árvore e vara com as suas sombras', 'Höhenmessung mit dem Försterdreieck': 'Medição da altura com o triângulo do guarda-florestal',
        'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.':
            'Os raios de sol chegam paralelos. Por isso, o triângulo azul e o triângulo amarelo são semelhantes: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',
        'Deine Peillinie geht über die Spitze hinweg: Geh näher heran.': 'A tua linha de mira passa por cima do topo: aproxima-te.',
        // rueckwaerts8 ('Richtig!' as in js/buch-pt/zahlen.js)
        'Rückwärts: ein Schritt': 'Para trás: um passo', 'Neues Rätsel': 'Novo enigma', 'Startzahl': 'Número inicial', 'Richtig!': 'Certo!',
        'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
            'Experimenta um número na primeira caixa ou calcula para trás: cada operação é substituída pela sua inversa, mais por menos, vezes por a dividir.',
        // mcpi8 (the counts: a rule below)
        'Zufallspunkte in einem Quadrat, Treffer im Viertelkreis gelb': 'Pontos aleatórios num quadrado, a amarelo os que caem no quarto de círculo',
        'Noch keine Punkte. Lass es regnen!': 'Ainda não há pontos. Faz chover!',
        // sammel8 (Bilder = cromos, Tüten = saquetas, Album = caderneta; the sentences with numbers: rules below)
        'Größe des Albums': 'Tamanho da caderneta', 'Eine Tüte öffnen': 'Abrir uma saqueta', 'Bis das Album voll ist': 'Até a caderneta estar completa',
        '1000 Alben': '1000 cadernetas', 'Neues Album': 'Nova caderneta', 'Mittelwert': 'Média', 'Voll!': 'Completa!',
        'Anzahl der Tüten bis zum vollen Album': 'Número de saquetas até completar a caderneta',
        'Histogramm: wie viele Tüten 1000 Alben gebraucht haben': 'Histograma: quantas saquetas foram precisas para 1000 cadernetas',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy8/*)
        // book pt-12 mathegy8-pt:
        // termbaum8 (the sentences with the term in them are rules below; these pieces let check.mjs see them translated)
        ['Rechenbaum des Terms ', 'Árvore de cálculo da expressão '], ['. Gerechnet wird von unten nach oben.', '. Calcula-se de baixo para cima.'],
        ['Summanden', 'Parcelas'], ['Minuend und Subtrahend', 'Aditivo e subtrativo'], ['Faktoren', 'Fatores'], ['Dividend und Divisor', 'Dividendo e divisor'],
        // streckung8 (the sentences with k: rules below)
        ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Homotetia do triângulo ABC de centro O e razão '],
        ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'Com $k = 0$, todas as imagens coincidem com $O$: a imagem é apenas um ponto.'],
        ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'Com $k = 1$, cada ponto fica onde está.'],
        ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'Com $k = -1$, a homotetia é a reflexão central de centro $O$.'],
        [' Alle Winkel bleiben gleich.', ' Todos os ângulos se mantêm.'],
        // schatten8
        ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ',
            'Seguras um triângulo retângulo isósceles à frente do olho (olhos a $1{,}6$ m de altura) e fazes pontaria ao longo do lado maior. Esta linha sobe com um ângulo de $45^\\circ$: '],
        ['Treffer!</b> Du siehst genau die Spitze. ', 'Em cheio!</b> Vês exatamente o topo. '],
        // mcpi8
        ['Der Viertelkreis bedeckt $\\tfrac{\\pi}{4}$ des Quadrats, also ist ', 'O quarto de círculo cobre $\\tfrac{\\pi}{4}$ do quadrado, portanto '], ['(Abweichung $', '(desvio $'],
        // sammel8
        ['Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $', 'Também se pode calcular, com ferramentas do secundário: $'],
        // lgs8 (a sentence that starts with <b> is no whole label for the engine)
        ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Verificação</b> nas duas equações, depois o conjunto-solução.'],
        // wegzeit8 (where Mia is: a rule below)
        ['Der Graph steigt gleichmäßig.', 'O gráfico sobe de forma regular.'],
        ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'O gráfico é horizontal: o tempo passa, a distância mantém-se.'],
        ['Hier steigt der Graph am steilsten.', 'Aqui o gráfico é o mais inclinado.'], ['Der Graph steigt flacher als beim ersten Fußweg.', 'O gráfico é menos inclinado do que no primeiro percurso a pé.'],
        [' von zu Hause entfernt.', ' de casa.'], ['geht zu Fuß zur Haltestelle', 'vai a pé até à paragem'], ['wartet an der Haltestelle', 'espera na paragem'],
        ['fährt mit dem Bus', 'vai de autocarro'], ['geht das letzte Stück zur Schule', 'faz a pé o último troço até à escola'],
        // gluecksrad8 (the counts and the last spin are rules below)
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Todos os setores são iguais: uma <b>experiência de Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'Os setores são <b>diferentes</b>: <b>não</b> é uma experiência de Laplace. '],
        ['}$ wäre falsch. ', '}$ estaria errado. '], ['Es zählt der Anteil am ganzen Rad: ', 'O que conta é a parte da roleta inteira: '],
        [', $E$ ist eingetreten.', ', $E$ ocorreu.'], [', $E$ ist nicht eingetreten.', ', $E$ não ocorreu.'],
        [' · Wahrscheinlichkeit $P(E) \\approx ', ' · probabilidade $P(E) \\approx '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-12 mathegy8-pt:
        // termbaum8: the product node is drawn as a dot; Portuguese pupils write × (the same text style as + − :)
        [/<circle cx="([\d.]+)" cy="([\d.]+)" r="4\.2" style="fill:rgb\(245,194,66\)"\/>/g,
            (m, x, y) => '<text class="tb8-op" x="' + x + '" y="' + (Math.round((+y + 1) * 10) / 10) + '" text-anchor="middle" dominant-baseline="middle">×</text>'],
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$." and the selected node
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'A expressão $' + t + '$ é ' + ({ Summe: 'uma <b>soma</b>', Differenz: 'uma <b>diferença</b>', Produkt: 'um <b>produto</b>', Quotient: 'um <b>quociente</b>', Potenz: 'uma <b>potência</b>' })[k] +
                ': a última operação é ' + ({ Summe: 'uma adição', Differenz: 'uma subtração', Produkt: 'uma multiplicação', Quotient: 'uma divisão', Potenz: 'uma potenciação' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Parcelas', 'Minuend und Subtrahend': 'Aditivo e subtrativo', 'Faktoren': 'Fatores', 'Dividend und Divisor': 'Dividendo e divisor' })[p] + ': $' + a + '$ e $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, expoente $' + b + '$.'],
        [/Für \$x = ([^$]*)\$ hat er den Wert /g, (m, v) => 'Para $x = ' + v + '$, tem o valor '],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$([^$]*)\$\./g,
            (m, t, k, v) => 'Selecionada: a subexpressão $' + t + '$, ' + ({ Summe: 'uma soma', Differenz: 'uma diferença', Produkt: 'um produto', Quotient: 'um quociente', Potenz: 'uma potência' })[k] + ' com o valor $' + v + '$.'],
        [/Ausgewählt: die Variable \$x\$ mit dem Wert \$([^$]*)\$\./g, (m, v) => 'Selecionada: a variável $x$, com o valor $' + v + '$.'],
        [/Ausgewählt: die Zahl \$([^$]*)\$\./g, (m, v) => 'Selecionado: o número $' + v + '$.'],
        // waage (js/buch-gleichungen.js, chapter 1.2): its parser takes × as well, so the example shows the Portuguese sign
        [/<code>·2<\/code>/g, '<code>×2</code>'],
        // sets of whole numbers written by the widgets (gluecksrad8 …): Portuguese schools separate the elements with commas
        [/\\\{((?:\d+|\\ldots)(?:; (?:\d+|\\ldots))+)\\\}/g, (m, l) => '\\{' + l.replace(/; /g, ', ') + '\\}'],
        // the same in plain text (urne of js/buch-stochastik.js lists its outcomes as {2; 3} and (1; 2))
        [/(?<!\\)([{(])(\d+(?:; \d+)+)([})])/g, (m, a, l, b) => a + l.replace(/; /g, ', ') + b],
        // gluecksrad8: the number of elements is written #E, #Ω in Portuguese schools (tools/buch-pt/glossario.md, mathefos11-pt)
        [/\|E\|/g, '\\#E'], [/\|\\Omega\|/g, '\\#\\Omega'],
        // ziffern8: the coin count and the dice
        [/Wappen: \$(\d+)\$ · Zahl: \$(\d+)\$ · relative Häufigkeit von Wappen: \$/g, (m, a, b) => 'Face nacional: $' + a + '$ · face europeia: $' + b + '$ · frequência relativa da face nacional: $'],
        [/Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen \(grau\)\. So entstehen (\d+) Würfe\./g,
            'Os algarismos de 1 a 6 são as pintas do dado; 0, 7, 8 e 9 são saltados (a cinzento). Assim obtêm-se $1 lançamentos.'],
        // lgs8: the solution set C.S. (as the rule of js/buch-pt/gleichungen.js, which chapter 3.3 does not load); the set rule of
        // js/buch-pt.js has already turned the bar of its point into a colon: $L = \{(2 \mid 3)\}$ → \{(2 : 3)\} → \{(2, 3)\}
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$\\text{C.S.} = '], [/\\\{\((-?\d+) : (-?\d+)\)\\\}/g, '\\{($1, $2)\\}'],
        // lgs8: the steps with a variable or a number in them
        [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Resolve a equação I em ordem a $' + v + '$.'],
        [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Substitui $' + v + '$ por essa expressão na equação II.'],
        [/Setze \$([xy]) = (-?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v, a) => 'Substitui $' + v + '$ por $' + a + '$ na equação resolvida.'],
        [/Setze \$([xy]) = (-?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v, a) => 'Substitui $' + v + '$ por $' + a + '$ na equação I (resolvida).'],
        [/Setze \$([xy]) = (-?\d+)\$ in Gleichung I ein\./g, (m, v, a) => 'Substitui $' + v + '$ por $' + a + '$ na equação I.'],
        [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Passo $1 de $2: pensa primeiro por ti, depois revela.'],
        // streckung8: the centre O (letter of the drawing and of the lengths \overline{OA}), "Bild" in the table head, the sentences with k
        [/(<text class="g-pt" [^>]*>)Z(<\/text>)/g, '$1O$2'], [/\\overline\{Z([ABC])\}/g, '\\overline{O$1}'], [/<th>Bild<\/th>/g, '<th>Imagem</th>'],
        [/Bei negativem \$k\$ liegt jeder Bildpunkt auf der anderen Seite von \$Z\$\. Die Bildstrecken sind \$\|k\| = ([^$]*)\$-mal so lang\./g,
            (m, k) => 'Com $k$ negativo, cada imagem fica do outro lado de $O$. Os segmentos imagem medem $|k| = ' + k + '$ vezes o comprimento original.'],
        [/(Eine <b>Vergrößerung<\/b>|<b>Eine Verkleinerung<\/b>): Jede Strecke wird \$([^$]*)\$-mal so lang, die Fläche \$k\^2 = ([^$]*)\$-mal so groß\./g,
            (m, w, a, b) => (/Vergr/.test(w) ? 'Uma <b>ampliação</b>' : '<b>Uma redução</b>') + ': cada segmento passa a medir $' + a + '$ vezes o comprimento, a área $k^2 = ' + b + '$ vezes a área.'],
        // aehnlich8: the verdicts
        [/Ähnlich!<\/b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor \$k \\approx ([^$]*)\$ gestreckt\./g,
            (m, k) => 'Semelhantes!</b> Todos os ângulos são iguais e todos os lados foram multiplicados pela mesma razão $k \\approx ' + k + '$.'],
        [/ Mit \$k = 1\$ sind die Dreiecke sogar kongruent\./g, ' Com $k = 1$, os triângulos são mesmo geometricamente iguais.'],
        [/Noch nicht ähnlich: (Nur ein Winkel stimmt|Kein Winkel stimmt)\. Die Seitenverhältnisse sind verschieden\./g,
            (m, w) => 'Ainda não são semelhantes: ' + (w[0] === 'N' ? 'só um ângulo é igual' : 'nenhum ângulo é igual') + '. As razões entre os lados são diferentes.'],
        // gulliver8: k = 1 changes nothing, the other k, and the aria label
        [/Alle Längen werden \$1\$-mal so groß, jede Fläche \$1\^2 = 1\$-mal so groß, das Volumen \$1\^3 = 1\$-mal so groß\./g, 'Com $k = 1$, os comprimentos, as áreas e o volume não mudam.'],
        [/Alle Längen werden \$(\d+)\$-mal so groß, jede Fläche \$(\d+\^2 = \d+)\$-mal so groß, das Volumen \$(\d+\^3 = \d+)\$-mal so groß\./g,
            (m, a, b, c) => 'Todos os comprimentos ficam $' + a + '$ vezes maiores, cada área $' + b + '$ vezes maior, o volume $' + c + '$ vezes maior.'],
        [/>Einheitswürfel</g, '>Cubo unitário<'],
        [/Ein Einheitswürfel und ein Würfel aus (\d+) hoch drei Einheitswürfeln/g, 'Um cubo unitário e um cubo formado por $1 × $1 × $1 cubos unitários'],
        // schatten8: the measured lengths, the forester's triangle (the shadows s, S stay: sombra)
        [/Gemessen: Der Stab ist \$2\$ m hoch, sein Schatten ist \$s \\approx ([^$]*)\$ m lang\. Der Schatten des Baums ist \$S \\approx ([^$]*)\$ m lang\./g,
            (m, a, b) => 'Medições: a vara tem $2$ m de altura e a sua sombra $s \\approx ' + a + '$ m de comprimento. A sombra da árvore tem $S \\approx ' + b + '$ m de comprimento.'],
        [/\. Tatsächlich ist der Baum \$([^$]*)\$ m hoch\./g, (m, h) => '. Na realidade, a árvore tem $' + h + '$ m de altura.'],
        [/Auf \$d = ([^$]*)\$ m steigt sie um \$([^$]*)\$ m\./g, (m, a, b) => 'em $d = ' + a + '$ m, sobe $' + b + '$ m.'],
        [/Du siehst den Baum in \$([^$]*)\$ m Höhe, unter der Spitze: Geh weiter zurück\./g, (m, h) => 'Vês a árvore a $' + h + '$ m de altura, abaixo do topo: recua mais.'],
        // rueckwaerts8: × in the chain of operations, the puzzle in words, the try and the backward solution
        [/(class="rw8-op[^"]*">(?:← )?)·/g, '$1×'],
        [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$([^$]*)\$\. Welche Zahl war es\?/g,
            (m, ops, e) => 'Penso num número e calculo: ' + ops.replace(/geteilt durch/g, 'a dividir por').replace(/\bmal\b/g, 'vezes').replace(/\bminus\b/g, 'menos').replace(/\bplus\b/g, 'mais').replace(/, dann /g, ', depois ') +
                '. O resultado é $' + e + '$. Que número era?'],
        [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'Com $' + a + '$ obtém-se $' + b + '$. '],
        [/Das passt nicht\./g, 'Não dá.'],
        [/Rückwärts von \$([^$]*)\$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>/g, (m, e) => 'Para trás a partir de $' + e + '$, com as operações inversas: o número inicial é <b>'],
        // mcpi8: the buttons "+100 Punkte" and the sentence "Von $1000$ Punkten liegen $791$ im Viertelkreis, das ist der Anteil $…"
        [/\+(\d[\d ]*) Punkte</g, '+$1 pontos<'],
        [/Von \$([^$]*)\$ Punkten liegen \$([^$]*)\$ im Viertelkreis, das ist der Anteil \$/g, (m, a, b) => 'Dos $' + a + '$ pontos, $' + b + '$ estão no quarto de círculo, ou seja, a fração $'],
        // sammel8: the album in numbers (the sentence rules before the album sizes "10 Bilder")
        [/Jede Tüte enthält ein Bild\. Alle (\d+) Bilder sind gleich häufig\. Wie viele Tüten brauchst du, bis das Album voll ist\?/g,
            'Cada saqueta traz um cromo. Os $1 cromos são todos igualmente frequentes. De quantas saquetas precisas até a caderneta estar completa?'],
        [/Geöffnet: \$(\d+)\$ Tüten · im Album: \$(\d+)\$ von \$(\d+)\$ Bildern · doppelt: \$/g,
            (m, p, g, n) => 'Abertas: $' + p + '$ ' + (p === '1' ? 'saqueta' : 'saquetas') + ' · na caderneta: $' + g + '$ de $' + n + '$ cromos · repetidos: $'],
        [/1000 Alben: Im Mittel brauchte man <span class="b-res">\$([^$]*)\$ Tüten<\/span> \(am wenigsten \$(\d+)\$, am meisten \$(\d+)\$\)\. /g,
            (m, a, b, c) => '1000 cadernetas: em média foram precisas <span class="b-res">$' + a + '$ saquetas</span> (no mínimo $' + b + '$, no máximo $' + c + '$). '],
        [/(\d+) Bilder\b/g, '$1 cromos'], [/title="Bild (\d+)"/g, 'title="Cromo $1"'],
        // wegzeit8: the axis label "s in m" is d here (js/buch-pt/integral.js has "s in m" as a word, so a rule and no second word)
        [/^s in m$/, 'd em m'], [/>s in m</g, '>d em m<'],
        // wegzeit8: "Nach $t = 5$ min ist Mia <span …>$400$ m</span> von zu Hause entfernt." and "Sie fährt mit dem Bus: $300$ m pro Minute. "
        [/Nach \$t = ([^$]*)\$ min ist Mia (<span class="b-res">\$[^$]*\$ m<\/span>) von zu Hause entfernt\./g, (m, t, d) => 'Ao fim de $t = ' + t + '$ min, a Mia está a ' + d + ' de casa.'],
        [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
            (m, d, v) => ({ 'geht zu Fuß zur Haltestelle': 'Vai a pé até à paragem', 'wartet an der Haltestelle': 'Espera na paragem', 'fährt mit dem Bus': 'Vai de autocarro',
                'geht das letzte Stück zur Schule': 'Faz a pé o último troço até à escola' })[d] + (v ? ': $' + v + '$ m por minuto. ' : '. ')],
        // gluecksrad8: the aria label, the last spin and the counts
        [/Glücksrad mit (\d+) Feldern/g, 'Roleta com $1 setores'],
        [/Zuletzt: Feld <b>(\d+)<\/b>, \$E\$ ist (nicht )?eingetreten\./g, (m, f, n) => 'Último giro: setor <b>' + f + '</b>, $E$ ' + (n ? 'não ocorreu.' : 'ocorreu.')],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
            (m, a, b) => 'Giros: $' + a + '$ · $E$ ocorreu: $' + b + '$ vezes · frequência relativa '],
    ]
});
