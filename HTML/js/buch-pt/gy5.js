/* js/buch-pt/gy5.js — Portuguese for the widgets of js/buch-gy5.js.
 * Loaded by the Portuguese editions right after js/buch-gy5.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy5', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy5/*)
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // bruch5 (chapter 1.1): "Erweitern" = multiplicar os dois termos (glossary pt-10, "amplificar" is avoided), "Kürzen" = simplificar
        'Erweitern mit 2': 'Multiplicar por 2', 'mit 3': 'por 3', 'Kürzen': 'Simplificar', 'weniger': 'menos', 'mehr': 'mais',
        'Null Teile: der Bruch hat den Wert 0.': 'Zero partes: a fração tem o valor 0.',
        'Der Bruch lässt sich nicht weiter kürzen.': 'A fração já é irredutível.',
        // bruchstrahl5 (chapter 1.1)
        'Zahl A': 'Número A', 'Zahl B': 'Número B', 'Zahlenstrahl mit zwei Zahlen': 'Reta numérica com dois números',
        'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.': 'Escreve frações como 3/4 ou números decimais como 0,7, também maiores do que 1, até 3.',
        'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Escreve dois números entre 0 e 3, por exemplo 3/4 ou 0,7.',
        // komma5 (chapter 1.2)
        'Neu': 'Recomeçar',
        'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
            'Ao multiplicar por 10, cada algarismo avança uma ordem para a esquerda; ao dividir, para a direita. Diz-se, para abreviar, que a vírgula se desloca.',
        'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'não é possível: os algarismos sairiam do quadro.',
        // mittel5 (chapter 1.3): the mean is a média
        'Ausgleichen': 'Igualar', 'Neue Werte': 'Novos valores', 'Mittelwert': 'Média', 'Säulen mit dem Mittelwert': 'Barras com a média',
        'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
            'Arrasta as barras para cima ou para baixo. «Igualar» reparte tudo de forma justa: cada barra fica com o mesmo.',
        'Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).': 'O que estava acima da linha (tracejado cinzento) preenche exatamente os espaços vazios (amarelo).',
        // winkelpaare5 (chapter 3.1): verticalmente opostos, suplementares (adjacentes), correspondentes, alternos internos (glossary pt-10)
        'Scheitelwinkel': 'Verticalmente opostos', 'Nebenwinkel': 'Suplementares', 'Stufenwinkel': 'Correspondentes', 'Wechselwinkel': 'Alternos internos',
        'Winkelpaar': 'Par de ângulos', 'Anderes Paar': 'Outro par', 'h kippen': 'Inclinar h',
        'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
            'Arrasta o ponto sobre a reta s para a rodar. Com «Inclinar h», g e h deixam de ser paralelas.',
        'Zwei Geraden g und h, geschnitten von s': 'Duas retas g e h, intersetadas pela secante s',
        // rechteck5 (chapter 3.2): the perimeter is P (German u), as Silva (pt-14) writes it
        'Zusammengesetzte Figur': 'Figura composta', 'Figur': 'Figura', 'Zerlegen': 'Decompor', 'Ergänzen': 'Completar', 'Weg': 'Método',
        'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.': 'Arrasta o vértice. Cada quadradinho tem 1 cm de comprimento e 1 cm de largura, ou seja, 1 cm² de área.',
        'Ein Quadrat: alle vier Seiten gleich lang.': 'Um quadrado: os quatro lados são iguais.',
        'Zerlegen in zwei Rechtecke:': 'Decompor em dois retângulos:',
        'Zum großen Rechteck ergänzen und das fehlende Stück abziehen:': 'Completar até ao retângulo grande e subtrair a parte que falta:',
        'Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.':
            'Surpreendente: o perímetro é igual ao do retângulo inteiro, porque o degrau tem o mesmo comprimento que os lados que faltam.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy5/*)
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // bruch5: the aria labels of the three pictures and the lines under the picture
        ['Kreisbild des Bruchs ', 'Representação circular da fração '], ['Streifenbild des Bruchs ', 'Representação em tira da fração '],
        ['Rechteckbild des Bruchs ', 'Representação retangular da fração '],
        ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Uma <b>fração própria</b>: menos do que uma unidade.'],
        ['Genau <b>ein Ganzes</b>.', 'Exatamente <b>uma unidade</b>.'],
        ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Uma <b>fração imprópria</b>: mais do que uma unidade'],
        [', als gemischte Zahl $', ', como numeral misto $'],
        ['Als Dezimalzahl: <b>', 'Como número decimal: <b>'], [' · in Prozent: <b>', ' · em percentagem: <b>'],
        ['Als Dezimalzahl ungefähr ', 'Como número decimal, aproximadamente '],
        ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.', '. O denominador tem um fator primo diferente de 2 e de 5; por isso, a dízima não termina.'],
        // bruchstrahl5: the comparison
        ['Jetzt vergleicht man nur die Zähler: ', 'Agora basta comparar os numeradores: '],
        ['Als Dezimalzahlen: A ≈ ', 'Como números decimais: A ≈ '],
        ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Mais à direita na reta numérica quer dizer maior.'],
        // mittel5: "Geteilt durch die Anzahl: 25 : 5 = 5" (the lines with a tag in front are rules)
        ['Geteilt durch die Anzahl: ', 'A dividir pelo número de valores: '],
        // winkelpaare5: the rule under the picture
        ['Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
            'Os ângulos verticalmente opostos ficam frente a frente no mesmo ponto de interseção. São <b>sempre iguais</b>.'],
        ['Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
            'Os ângulos suplementares adjacentes ficam lado a lado no mesmo ponto de interseção e formam juntos um ângulo raso: somam <b>sempre 180°</b>.'],
        ['Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ',
            'Os ângulos correspondentes ficam em pontos de interseção diferentes, do mesmo lado de s e do mesmo lado das retas. '],
        ['Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ',
            'Os ângulos alternos internos ficam em pontos de interseção diferentes, em lados diferentes de s e entre as retas. '],
        ['An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.', 'Em retas <b>paralelas</b>, são <b>iguais</b>.'],
        ['Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.', 'Como g e h <b>não são paralelas</b>, têm amplitudes diferentes.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // bruch5: "…, genau 2 Ganze." and "Kürzen mit 4 ergibt $…$."
        [/, genau (\d+) Ganze\./g, (m, n) => ', exatamente ' + n + ' unidades.'],
        [/Kürzen mit (\d+) ergibt \$/g, (m, n) => 'Dividindo os dois termos por ' + n + ', obtém-se $'],
        // bruchstrahl5: "Auf denselben Nenner 15 gebracht: $…$"
        [/Auf denselben Nenner (\d+) gebracht: \$/g, (m, n) => 'Reduzidas ao mesmo denominador ' + n + ': $'],
        // komma5: the place-value table with the Portuguese orders (DM UM C D U, d c m: décimas, centésimas, milésimas),
        // only in this table; the product sign × on the buttons and in the line "2,35 × 10 ="
        [/<table class="g5-sw g5-sw-dez"><tr>[\s\S]*?<\/tr>/g, m => m.replace(/(<th[^>]*>)(ZT|T|H|Z|E|z|h|t)(<\/th>)/g, (x, a, k, b) =>
            a + ({ ZT: 'DM', T: 'UM', H: 'C', Z: 'D', E: 'U', z: 'd', h: 'c', t: 'm' })[k] + b)],
        [/(<button type="button" class="b-btn" data-o="m" data-k="\d+">)· /g, '$1× '],
        [/^<p>([^<]*?) · (\d+) =<\/p>/, '<p>$1 × $2 =</p>'],
        // mittel5: "Mittelwert 5" and "Summe: 6 + 3 + … = 25" (a tag in front: rules, the pieces never see tags)
        [/(<p class="g5-big">)Mittelwert (?=\d)/g, '$1Média '], [/<p>Summe: (?=\d)/g, '<p>Soma: '],
        // winkelpaare5: "g und h sind (nicht) parallel."
        [/g und h sind (nicht )?parallel\./g, (m, n) => 'g e h ' + (n ? 'não são paralelas.' : 'são paralelas.')],
        // rechteck5: the aria label, the rows of squares, the perimeter P, the products × in the plain lines
        [/^Rechteck aus (\d+) Einheitsquadraten$/, (m, n) => 'Retângulo formado por ' + n + (n === '1' ? ' quadrado unitário' : ' quadrados unitários')],
        [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./g, (m, r, n) => 'São ' + r + ' filas com ' + n + ' quadradinhos cada uma.'],
        [/Das ist 1 Reihe mit (\d+) Kästchen\./g, (m, n) => 'É 1 fila com ' + n + (n === '1' ? ' quadradinho.' : ' quadradinhos.')],
        [/(<p class="g5-big">)u = (?=\d)/g, '$1P = '], [/\$u = 2 \\times a \+ 2 \\times b = /g, '$$P = 2 \\times a + 2 \\times b = '],
        [/<p>Zusammen (\d+) cm²<\/p>/g, '<p>Ao todo, $1 cm²</p>'], [/(\d) cm · (?=\d)/g, '$1 cm × '],
    ]
});
