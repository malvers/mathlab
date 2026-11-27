/* js/buch-pt/os5.js — Portuguese for the widgets of js/buch-os5.js.
 * Loaded by the Portuguese editions right after js/buch-os5.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('os5', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os5/*)
        // book pt-14 mathe5-pt:
        // titelbildos5
        'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
            'Capa: um cubo em perspetiva cavaleira e a sua planificação, um círculo com dois terços coloridos, uma borboleta refletida, números em escrita cuneiforme babilónica e uma reta numérica',
        // the helpers of the module (askRow, buttons, stepper), reported for every page that loads it
        'Zähler': 'Numerador', 'Nenner': 'Denominador', 'Ganzes': 'Todo', 'Zahl': 'Número',
        // the multiplication sign alone (the sheet of a written multiplication, the operator between the two inputs)
        '·': '×',
        // zahlenstrahlos5: reta numérica, antecessor / sucessor
        'Erkunden': 'Explorar', 'Ablesen': 'Ler', 'Modus': 'Modo', 'Einteilung': 'Graduação',
        'Welche Zahl ist markiert?': 'Que número está marcado?', 'Neue Aufgabe': 'Novo exercício',
        'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?':
            'Conta os traços a partir do número da esquerda. Quanto vale um passo de um traço ao seguinte?',
        'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.':
            'Arrasta o ponto ao longo da reta numérica. Quanto mais à direita, maior é o número.',
        // schriftlichos5: the algorithms in columns, transporte ("e vai um"), the two ways of subtracting: completar ("de 6 para 13 vão 7")
        // and desagrupar (1 dezena → 10 unidades)
        'Addieren': 'Adicionar', 'Subtrahieren': 'Subtrair', 'Multiplizieren': 'Multiplicar', 'Dividieren': 'Dividir',
        'Rechenart': 'Operação', 'Ergänzen': 'Completar', 'Entbündeln': 'Desagrupar', 'Verfahren': 'Método',
        'erste Zahl': 'primeiro número', 'zweite Zahl': 'segundo número',
        'Nächster Schritt': 'Próximo passo', 'Alles zeigen': 'Mostrar tudo', 'Von vorn': 'Do início',
        'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.': 'Escreve dois números, por exemplo 4738 e 1296.',
        'Bitte höchstens drei Stellen nach dem Komma.': 'No máximo três casas decimais, por favor.',
        'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.': 'Números com nove algarismos antes da vírgula, no máximo, por favor.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer. Gerechnet wird von rechts nach links.':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem: unidades por baixo de unidades. Calcula-se da direita para a esquerda.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer, Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf. Gerechnet wird von rechts nach links.':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem: unidades por baixo de unidades, vírgula por baixo de vírgula. As casas decimais que faltam preenches com zeros. Calcula-se da direita para a esquerda.',
        'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.':
            'O segundo número é maior do que o primeiro. Nos números naturais, esta subtração não é possível.',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem. Calcula-se da direita para a esquerda; ao completar, perguntas: quanto falta do número de baixo para o de cima?',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem, vírgula por baixo de vírgula. Calcula-se da direita para a esquerda; ao completar, perguntas: quanto falta do número de baixo para o de cima?',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem. Calcula-se da direita para a esquerda; ao desagrupar, trocas 1 da ordem seguinte por 10.',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Escreve os números uns por baixo dos outros, cada ordem por baixo da mesma ordem, vírgula por baixo de vírgula. Calcula-se da direita para a esquerda; ao desagrupar, trocas 1 da ordem seguinte por 10.',
        'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.':
            'Aqui, o segundo fator tem de ser um número natural. Troca os fatores, se for preciso.',
        'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.': 'No máximo sete algarismos no primeiro fator e três no segundo, por favor.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal.':
            'Escreve a conta numa linha. Multiplicas o primeiro fator por cada algarismo do segundo fator, um de cada vez.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal, zuerst ohne auf das Komma zu achten.':
            'Escreve a conta numa linha. Multiplicas o primeiro fator por cada algarismo do segundo fator, um de cada vez, primeiro sem te preocupares com a vírgula.',
        'Hier teilst du durch eine einstellige Zahl von 1 bis 9.': 'Aqui divides por um número de um só algarismo, de 1 a 9.',
        'Bitte höchstens acht Ziffern.': 'No máximo oito algarismos, por favor.',
        // vorrangos5: expressão numérica, prioridade das operações
        'Eigener Term': 'A tua expressão', 'Alle Schritte': 'Todos os passos',
        'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.':
            'São permitidos números naturais, + − × : e parênteses. Para × também podes escrever x ou *, para : também /.',
        'Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.':
            'Isto não é uma expressão completa. Verifica os números, os sinais de operação e os parênteses.',
        'Durch 0 kann man nicht teilen.': 'Não se pode dividir por 0.',
        'Unterstrichen ist, was als Nächstes gerechnet wird.': 'O que está sublinhado é o que se calcula a seguir.',
        'die letzte Rechnung': 'o último cálculo', 'Ergebnis': 'Resultado',
        // zehnerpotenzos5: potências de base 10, expoente
        'Zehnerpotenzen': 'Potências de base 10', 'Nullen abtrennen': 'Separar os zeros', 'Ansicht': 'Vista', 'Hochzahl': 'Expoente',
        'Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.':
            'O número não termina em zero. Aqui não se pode separar nenhuma potência de base 10.',
        'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.':
            'Antes do sinal de multiplicação já não há nenhum zero no fim: esta é a forma mais curta de escrever o número.',
        'So zeigt ein Taschenrechner mit 10 Stellen die Zahl:': 'É assim que uma calculadora de 10 algarismos mostra o número:',
        'Anzeige des Taschenrechners': 'Visor da calculadora', 'Die Zahl passt in die Anzeige.': 'O número cabe no visor.',
        // quadratos5: quadrado perfeito, raiz quadrada
        'Quadrieren': 'Elevar ao quadrado', 'Wurzel ziehen': 'Raiz quadrada', 'Richtung': 'Sentido', 'Seitenlänge n': 'Lado n',
        'Anzahl Plättchen': 'Número de quadradinhos', 'Bitte eine Zahl von 1 bis 440 eingeben.': 'Escreve um número de 1 a 440.',
        // probierenos5: equação, inequação, substituir
        'Aufgabe': 'Exercício', 'Einsetzen': 'Substituir', 'Alle Zahlen prüfen': 'Testar todos os números',
        'Zahlenstrahl mit den eingesetzten Zahlen': 'Reta numérica com os números testados',
        'stimmt!': 'está certo!', 'Nimm eine größere Zahl.': 'Experimenta um número maior.', 'Nimm eine kleinere Zahl.': 'Experimenta um número menor.',
        'erfüllt die Ungleichung.': 'é solução da inequação.', 'erfüllt sie nicht.': 'não é solução.',
        // teilbarkeitos5: critérios de divisibilidade, soma dos algarismos
        'Zufallszahl': 'Número aleatório', 'Alle Teiler': 'Todos os divisores',
        'Die 1 hat nur einen Teiler. Sie ist keine Primzahl.': 'O 1 só tem um divisor. Não é um número primo.',
        // bruchteilos5
        'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.':
            'O todo só se pode dividir em grupos iguais se for múltiplo do denominador. Por isso, avança aos saltos.',
        'Alle Gruppen: Das ist das Ganze.': 'Todos os grupos: é o todo.', 'Genau die Hälfte.': 'Exatamente metade.',
        // halbesos5
        'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes': 'Duas tiras de frações, uma por baixo da outra, com a marca de um meio',
        'Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.': 'Os comprimentos pintados são exatamente iguais: dois nomes para o mesmo número.',
        'Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.':
            'Aqui ajuda a imagem: a tira pintada mais comprida corresponde à fração maior. Poderás confirmá-lo com contas no 6.º ano, quando escreveres frações equivalentes.',
        // rundenos5
        'auf Ganze': 'às unidades', 'auf Zehntel': 'às décimas', 'auf Hundertstel': 'às centésimas', 'Runden': 'Arredondar', 'Neue Zahl': 'Novo número',
        'Der Zahlenstrahl zeigt nur den Ausschnitt zwischen den beiden möglichen Ergebnissen, wie unter einer Lupe. Zieh den Punkt.':
            'A reta numérica mostra só o troço entre os dois resultados possíveis, como se o visses à lupa. Arrasta o ponto.',
        // wuerfelnetzos5: planificação do cubo
        'Zufälliges Netz': 'Planificação aleatória', 'Alles löschen': 'Apagar tudo',
        'Tippe Quadrate an, um sie hinzuzufügen oder wegzunehmen. Sechs zusammenhängende Quadrate werden sofort geprüft.':
            'Toca nos quadrados para os acrescentar ou retirar. Seis quadrados ligados entre si são verificados logo.',
        'Ein Würfel hat 6 Flächen, also besteht jedes Würfelnetz aus 6 Quadraten.': 'Um cubo tem 6 faces; por isso, cada planificação do cubo é formada por 6 quadrados.',
        'Die Quadrate hängen nicht alle zusammen.': 'Os quadrados não estão todos ligados.',
        'Jedes Quadrat muss mit einer ganzen Kante an ein anderes stoßen.': 'Cada quadrado tem de tocar noutro ao longo de um lado inteiro.',
        'Kein Würfelnetz.': 'Não é uma planificação do cubo.',
        'Beim Falten würden die rot markierten Quadrate aufeinanderliegen, und eine Fläche des Würfels bliebe offen.':
            'Ao dobrar, os quadrados marcados a vermelho ficariam um sobre o outro e uma face do cubo ficaria aberta.',
        'Ein Würfelnetz!': 'É uma planificação do cubo!',
        'Die Zahlen zeigen, wie ein Spielwürfel beschriftet wäre: Gegenüberliegende Flächen haben dieselbe Farbe und ergeben zusammen 7.':
            'Os números mostram como seria numerado um dado: as faces opostas têm a mesma cor e somam 7.',
        // bandos5: friso, motivo, figuras geometricamente iguais
        'Fahne': 'Bandeira', 'Schlüssel': 'Chave', 'Blume': 'Flor', 'Motiv': 'Motivo', 'Bewegung': 'Movimento',
        'Verschieben': 'Translação', 'Spiegeln, senkrechte Achsen': 'Reflexão, eixos verticais', 'Spiegeln, waagerechte Achse': 'Reflexão, eixo horizontal',
        'Verschiebungspfeil': 'Seta da translação',
        'Alle Motive sind deckungsgleich: gleiche Form, gleiche Größe.': 'Todos os motivos são geometricamente iguais: a mesma forma, o mesmo tamanho.',
        // zahlzeichenos5: pau entalhado (Kerbholz), entalhe, tabela de contagem, escrita cuneiforme
        'Kerbholz und Strichliste': 'Pau entalhado e tabela de contagem', 'Babylonische Keilschrift': 'Escrita cuneiforme babilónica', 'Zahlzeichen': 'Numeração',
        'Auf 0': 'A zero', 'eins weniger': 'menos um', 'eins mehr': 'mais um',
        'Auf dem Kerbholz ist jede fünfte Kerbe länger. So muss man nicht jede einzelne Kerbe zählen, sondern nur die Bündel.':
            'No pau entalhado, cada quinto entalhe é mais comprido. Assim não é preciso contar os entalhes um a um, só os grupos.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os5/*)
        // book pt-14 mathe5-pt:
        // askRow: "✓ richtig" (the shared phrase of js/buch-pt.js), "✗ noch nicht"
        [' noch nicht', ' ainda não'],
        // zahlenstrahlos5
        ['Ein Schritt von Strich zu Strich ist ', 'Um passo de um traço ao seguinte vale '],
        ['Vorgänger ', 'Antecessor '], [', Nachfolger ', ', sucessor '],
        // schriftlichos5: the steps (the places in bold and the numbers are rules below); "Schreibe 2 und übertrage 1" → «Escreve 2 e vai 1»
        [' (Übertrag)', ' (transporte)'], [' (gemerkt)', ' (transporte)'], ['. Schreibe ', '. Escreve '], [' und übertrage ', ' e vai '],
        [' in die nächste Spalte.', ' para a coluna seguinte.'], [' Übertrag 1 in die nächste Spalte.', ' Vai 1 para a coluna seguinte.'],
        [' ist kleiner als ', ' é menor do que '], ['. Entbündle: ', '. Desagrupa: '], [', dann ', ', depois '],
        [' Eine Null ganz vorn schreibt man nicht.', ' Um zero à esquerda de tudo não se escreve.'],
        [', merke ', ', e vai '], ['. Das ist die letzte Ziffer: Schreibe ', '. É o último algarismo: escreve '], [' ganz hin.', ' por inteiro.'],
        ['Addiere die Teilprodukte stellengerecht, so wie sie stehen. Das ergibt ', 'Adiciona os produtos parciais, ordem por ordem, tal como estão escritos. Obténs '],
        [' Hinten hängst du Nullen an, das ändert den Wert nicht.', ' No fim acrescentas zeros; isso não altera o valor.'],
        [', denn ', ', porque '], ['Es bleibt nichts übrig.', 'Não sobra nada.'], ['Es bleibt ', 'Sobra '],
        [' Hier kommt das Komma: Setze es auch im Ergebnis.', ' Aqui vem a vírgula: põe-na também no resultado.'],
        [' Rest ', ' resto '], ['Überschlag: ', 'Estimativa: '], ['. Probe: ', '. Verificação: '], ['Probe: ', 'Verificação: '],
        ['Die Division geht nicht auf. ', 'A divisão não é exata. '],
        // vorrangos5: the reason of every step
        ['Klammer zuerst', 'primeiro os parênteses'], [', darin ', ', dentro deles '], ['Punkt vor Strich', '× e : antes de + e −'],
        ['von links nach rechts', 'da esquerda para a direita'],
        [' geht in den natürlichen Zahlen nicht.', ' não é possível nos números naturais.'],
        [' geht nicht ohne Rest auf. Wähle andere Zahlen.', ' não é uma divisão exata. Escolhe outros números.'],
        // zehnerpotenzos5
        ['Alle Schreibweisen: ', 'Todas as formas de escrever: '],
        ['Die Zahl ist zu lang. Der Rechner zeigt ', 'O número é demasiado comprido. A calculadora mostra '],
        // quadratos5, probierenos5
        ['Umgekehrt: ', 'Ao contrário: '], ['ist zu klein', 'é demasiado pequeno'], ['ist zu groß', 'é demasiado grande'],
        ['Einsetzen: ', 'Substituir: '], ['Lösung: ', 'Solução: '], ['. Mit der Umkehraufgabe geht es direkt: ', '. Com a operação inversa chega-se lá diretamente: '],
        ['Alle Lösungen: ', 'Todas as soluções: '], [', … und jede größere Zahl.', ', … e todos os números maiores.'],
        ['Bisher gefundene Lösungen: ', 'Soluções encontradas até agora: '], ['Noch keine Lösung gefunden.', 'Ainda não encontraste nenhuma solução.'],
        [' Eine Ungleichung hat oft viele Lösungen.', ' Uma inequação tem muitas vezes várias soluções.'],
        // teilbarkeitos5 (the sentences with numbers are rules below)
        ['Quersumme ', 'Soma dos algarismos: '],
        ['Durch 2 und durch 3 teilbar.', 'Divisível por 2 e por 3.'], ['Durch 2, aber nicht durch 3 teilbar.', 'Divisível por 2, mas não por 3.'],
        ['Durch 3, aber nicht durch 2 teilbar.', 'Divisível por 3, mas não por 2.'], ['Weder durch 2 noch durch 3 teilbar.', 'Não é divisível nem por 2 nem por 3.'],
        [' ist keine Primzahl.', ' não é um número primo.'],
        // bruchteilos5
        ['1. Teile das Ganze in ', '1. Divide o todo em '], [' gleich große Gruppen: ', ' grupos iguais: '],
        // halbesos5: the comparison with 1 and with one half
        ['<b>Vergleich mit 1:</b>', '<b>Comparação com 1:</b>'], ['<b>Vergleich mit einem Halben:</b>', '<b>Comparação com um meio:</b>'],
        [' ist weniger als ein Ganzes', ' é menor do que 1'], [' ist mehr als ein Ganzes', ' é maior do que 1'], [' ist genau ein Ganzes', ' é igual a 1'],
        [' ist weniger als ein Halbes', ' é menor do que um meio'], [' ist mehr als ein Halbes', ' é maior do que um meio'], [' ist genau ein Halbes', ' é igual a um meio'],
        // wuerfelnetzos5
        ['Wähle 6 Quadrate aus', 'Escolhe 6 quadrados'],
        // bandos5 (phrases: a word that starts with <b> is never looked up in innerHTML)
        ['<b>Verschiebung:</b> Jedes Motiv entsteht aus dem vorigen durch dieselbe Verschiebung nach rechts, um eine Kästchenbreite. Alle Motive zeigen in dieselbe Richtung.',
            '<b>Translação:</b> cada motivo obtém-se do anterior pela mesma translação para a direita, de uma quadrícula. Todos os motivos estão virados para o mesmo lado.'],
        ['<b>Spiegelung an senkrechten Achsen:</b> Jedes Motiv ist das Spiegelbild seines Nachbarn. Die grünen Linien sind die Spiegelachsen. Jedes zweite Motiv ist umgeklappt.',
            '<b>Reflexão em eixos verticais:</b> cada motivo é a imagem refletida do seu vizinho. As linhas verdes são os eixos de reflexão. Um motivo em cada dois está virado ao contrário.'],
        ['<b>Spiegelung an einer waagerechten Achse:</b> Die untere Reihe ist das Spiegelbild der oberen. Oben und unten ist vertauscht, links und rechts nicht.',
            '<b>Reflexão num eixo horizontal:</b> a fila de baixo é a imagem refletida da de cima. Cima e baixo trocam, esquerda e direita não.'],
        // zahlzeichenos5
        ['Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert.',
            'Uma cunha vertical vale 1, uma cunha deitada em ângulo vale 10. Cada posição para a esquerda vale 60 vezes mais.'],
        [' Eine leere Stelle hatte lange kein eigenes Zeichen: Man sah nur eine Lücke.', ' Durante muito tempo, uma posição vazia não teve símbolo próprio: via-se apenas um espaço.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-14 mathe5-pt:
        // Portuguese school notation on the OS 5 pages (this module is loaded only by mathe5-pt): × for the multiplication in plain
        // text between numbers ("4738 · 3", "3 cm · 4 cm"; TeX \cdot is the pt0 rule of geometrie.js); the dot as a separator stays
        [/(\d|\)|\bcm|\bm) · (?=[\d(]|[a-z]\b)/g, '$1 × '], [/>· (?=\d)/g, '>× '],
        // plain-text points: A(2 | 1) → A(2, 1), with a decimal comma A(1,5; 2) (as the TeX rule of js/buch-pt.js)
        [/\(([-−]?\d+(?:,\d+)?) \| ([-−]?\d+(?:,\d+)?)\)/g, (m, x, y) => '(' + x + (/,/.test(x + y) ? '; ' : ', ') + y + ')'],
        // the steppers: "Zähler kleiner", "Nenner A größer"
        [/^(Zähler|Nenner|Ganzes)( [AB])? (kleiner|größer)$/, (m, w, ab, d) => (d === 'kleiner' ? 'Diminuir ' : 'Aumentar ') +
            ({ 'Zähler': 'o numerador', 'Nenner': 'o denominador', 'Ganzes': 'o todo' })[w] + (ab || '')],
        // zahlenstrahlos5
        [/>Schritt (\d[\d\u202f ]*)</g, '>Passo $1<'],
        [/^Zahlenstrahl von (.+) bis (.+)$/, 'Reta numérica de $1 a $2'],
        [/(<p class="g-ok">)Richtig: /, '$1Certo: '],
        [/Von (\d[\d\u202f ]*) bis (\d[\d\u202f ]*) sind es 10 Schritte, einer ist (\d[\d\u202f ]*) groß\./, 'De $1 a $2 há 10 passos; cada um vale $3.'],
        [/Links steht (\d[\d\u202f ]*), rechts (\d[\d\u202f ]*)\. Dazwischen liegen 10 gleich große Schritte\./, 'À esquerda está $1, à direita $2. Entre eles há 10 passos iguais.'],
        [/Der Punkt liegt (\d+) Schritte? rechts von (\d[\d\u202f ]*)\./, (m, n, x) => 'O ponto está ' + n + (n === '1' ? ' passo' : ' passos') + ' à direita de ' + x + '.'],
        [/Die Zahl liegt zwischen (\d[\d\u202f ]*) und (\d[\d\u202f ]*)\./, 'O número está entre $1 e $2.'],
        // schriftlichos5: the order in bold before every step, "1 Zehner → 10 Einer" when an order is broken up (desagrupar)
        ...(() => {
            const P = { 'Tausendstel': ['milésima', 'milésimas'], 'Hundertstel': ['centésima', 'centésimas'], 'Zehntel': ['décima', 'décimas'],
                'Einer': ['unidade', 'unidades'], 'Zehner': ['dezena', 'dezenas'], 'Hunderter': ['centena', 'centenas'], 'Tausender': ['unidade de milhar', 'unidades de milhar'],
                'Zehntausender': ['dezena de milhar', 'dezenas de milhar'], 'Hunderttausender': ['centena de milhar', 'centenas de milhar'],
                'Million': ['unidade de milhão', 'unidades de milhão'], 'Millionen': ['unidade de milhão', 'unidades de milhão'],
                'Zehnmillionen': ['dezena de milhão', 'dezenas de milhão'], 'Hundertmillionen': ['centena de milhão', 'centenas de milhão'],
                'Milliarden': ['milhar de milhão', 'milhares de milhão'] };
            const ALT = Object.keys(P).sort((a, b) => b.length - a.length).join('|');
            const cap = s => s[0].toUpperCase() + s.slice(1);
            return [
                [new RegExp('<b>(' + ALT + '):</b>', 'g'), (m, k) => '<b>' + cap(P[k][1]) + ':</b>'],
                [new RegExp('1 (' + ALT + ') → 10 (' + ALT + ')', 'g'), (m, a, b) => '1 ' + P[a][0] + ' → 10 ' + P[b][1]],
            ];
        })(),
        [/Der letzte Übertrag (\d) kommt vorn ins Ergebnis\./, 'O último transporte, $1, escreve-se à esquerda, no resultado.'],
        // the complement way of Portuguese schools: "de 6 para 13 vão 7"
        [/(<\/b> )?Von (\d+) bis (\d+) sind (\d+)\./g, (m, b, x, y, r) => (b ? b + 'de ' : 'De ') + x + ' para ' + y + ' vão ' + r + '.'],
        [/\. Die letzte Ziffer steht genau unter der (\d) des zweiten Faktors\./, '. O último algarismo fica exatamente por baixo do $1 do segundo fator.'],
        [/Der erste Faktor hat (\d+) Stellen? nach dem Komma, also auch das Ergebnis: /, (m, n) => 'O primeiro fator tem ' + n + (n === '1' ? ' casa decimal' : ' casas decimais') +
            '; o resultado também: '],
        [/Teile von links nach rechts\. Frage bei jeder Stelle: Wie oft passt die (\d) hinein\?/, 'Divide da esquerda para a direita. Em cada ordem, pergunta: quantas vezes cabe o $1?'],
        [/Hole die (\d) herunter: (\d+)\. /, 'Baixa o $1: $2. '],
        [/In die (\d) passt die (\d) nicht, nimm die ersten (\d+) Ziffern: (\d+)\. /, 'O $2 não cabe no $1: usa os $3 primeiros algarismos, $4. '],
        [/Nach (\d+) Stellen hinter dem Komma wird abgebrochen\./, 'Para-se ao fim de $1 casas decimais.'],
        [/(<p class="g5-dim">)Schritt (\d+) von (\d+)</, '$1Passo $2 de $3<'],
        // zehnerpotenzos5: "Die Hochzahl 6 sagt: 6 Faktoren 10, also 6 Nullen. Das ist eine Million." (long scale: mil milhões, um bilião)
        [/Die Hochzahl (\d+) sagt: \d+ Faktor(?:en)? 10, also (?:eine Null|\d+ Nullen)\. Das ist <b>([^<]+)<\/b>\./, (m, n, w) => 'O expoente ' + n + ' indica ' +
            (n === '1' ? '1 fator 10, portanto um zero' : n + ' fatores 10, portanto ' + n + ' zeros') + '. É <b>' + ({ 'eins': 'um', 'zehn': 'dez', 'hundert': 'cem',
                'tausend': 'mil', 'zehntausend': 'dez mil', 'hunderttausend': 'cem mil', 'eine Million': 'um milhão', 'zehn Millionen': 'dez milhões',
                'hundert Millionen': 'cem milhões', 'eine Milliarde': 'mil milhões', 'zehn Milliarden': 'dez mil milhões', 'hundert Milliarden': 'cem mil milhões',
                'eine Billion': 'um bilião' }[w] || w) + '</b>.'],
        [/Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel (\d[\d\u202f ]*)\./, 'Escreve um número natural com 15 algarismos, no máximo, por exemplo $1.'],
        [/Du kannst noch (\d+) (?:Nullen|Null) mehr abtrennen\./, (m, n) => 'Ainda podes separar mais ' + n + (n === '1' ? ' zero.' : ' zeros.')],
        [/\$: Rücke das Komma um (\d+) Stellen nach rechts, dann hast du die Zahl\./, (m, n) => '$: desloca a vírgula ' + n + ' casas para a direita e obténs o número.'],
        // quadratos5
        [/^(\d+) mal (\d+) Plättchen(?: und (\d+) weitere)?$/, (m, a, b, x) => a + ' vezes ' + b + (a === '1' && b === '1' ? ' quadradinho' : ' quadradinhos') + (x ? ' e mais ' + x : '')],
        [/(\d+) Reihen? mit (?:je )?(\d+) Plättchen (?:ergeben|ergibt) ein Quadrat aus (\d+) Plättchen\./, (m, r, k, v) => r === '1'
            ? '1 fila de 1 quadradinho forma um quadrado de 1 quadradinho.' : r + ' filas de ' + k + ' quadradinhos formam um quadrado de ' + v + ' quadradinhos.'],
        [/(\d+) ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite (\d+)\./, '$1 é um quadrado perfeito: os quadradinhos formam um quadrado de lado $2.'],
        [/(\d+) ist keine Quadratzahl\./, '$1 não é um quadrado perfeito.'],
        [/Es bleiben (\d+) Plättchen übrig, zum nächsten Quadrat fehlen (\d+)\./, (m, a, b) => 'Sobra' + (a === '1' ? ' 1 quadradinho' : 'm ' + a + ' quadradinhos') +
            '; para o quadrado seguinte falta' + (b === '1' ? ' 1.' : 'm ' + b + '.')],
        [/\$ liegt zwischen (\d+) und (\d+)\./, '$$ está entre $1 e $2.'],
        // probierenos5
        [/ \((\d+) Zahlen\)\./, ' ($1 números).'],
        // teilbarkeitos5 (the rule for 4 before the general one): "Soma dos algarismos: 4 + 7 + 3 = 14, que é divisível por 3."
        [/Die letzte Ziffer (\d) ist (gerade|ungerade)\./, (m, d, g) => 'O último algarismo, ' + d + ', é ' + (g === 'gerade' ? 'par.' : 'ímpar.')],
        [/Die letzten zwei Ziffern bilden (\d+), das ist (nicht )?durch 4 teilbar\./, (m, x, n) => 'Os dois últimos algarismos formam ' + x + (n ? ', que não é divisível por 4.' : ', que é divisível por 4.')],
        [/ ist (nicht )?durch (\d+) teilbar\./g, (m, n, d) => (n ? ', que não é divisível por ' : ', que é divisível por ') + d + '.'],
        [/Die letzte Ziffer ist (\d)(, nicht 0 oder 5|, nicht 0)?\./g, (m, d, x) => 'O último algarismo é ' + d + (x ? (x.length > 9 ? ', não é 0 nem 5' : ', não é 0') : '') + '.'],
        [/<b>durch (\d+)( nicht)?:<\/b>/g, (m, d, n) => '<b>' + (n ? 'não divisível por ' : 'divisível por ') + d + ':</b>'],
        [/<b>Alle Teiler<\/b> \((\d+)\): /, '<b>Todos os divisores</b> ($1): '],
        [/(\d[\d\u202f ]*) ist eine Primzahl: genau zwei Teiler\./, '$1 é um número primo: tem exatamente dois divisores.'],
        [/Bitte eine natürliche Zahl von 1 bis (\d[\d\u202f ]*) eingeben\./, 'Escreve um número natural de 1 a $1.'],
        // bruchteilos5
        [/^(\d+) von (\d+) Gruppen zu je (\d+) (?:sind|ist) gefärbt$/, (m, z, n, k) => z + ' de ' + n + ' grupos de ' + k + (z === '1' ? ' está pintado' : ' estão pintados')],
        [/\$ von (\d+) sind (\d+)\./, '$$ de $1 são $2.'],
        [/\$ von (\d+)<\/p>/g, '$$ de $1</p>'],
        [/2\. Nimm (\d+) (?:Gruppe|Gruppen): /, (m, z) => '2. Toma ' + z + (z === '1' ? ' grupo: ' : ' grupos: ')],
        // halbesos5: the names of the parts (terços, quartos … onze avos)
        ...(() => {
            const N = { 'Ganze': ['inteiro', 'inteiros'], 'Halbe': ['meio', 'meios'], 'Drittel': ['terço', 'terços'], 'Viertel': ['quarto', 'quartos'],
                'Fünftel': ['quinto', 'quintos'], 'Sechstel': ['sexto', 'sextos'], 'Siebtel': ['sétimo', 'sétimos'], 'Achtel': ['oitavo', 'oitavos'],
                'Neuntel': ['nono', 'nonos'], 'Zehntel': ['décimo', 'décimos'], 'Elftel': ['onze avos', 'onze avos'], 'Zwölftel': ['doze avos', 'doze avos'] };
            const n = (k, w) => N[w] ? N[w][k === '1' ? 0 : 1] : w;
            return [
                [/<b>Gleicher Nenner:<\/b> Beide Male sind es (\S+), also gleich große Stücke\. Es kommt nur darauf an, wie viele: /, (m, w) =>
                    '<b>Denominador igual:</b> nos dois casos são ' + n('2', w) + ', portanto partes do mesmo tamanho. Só interessa quantas são: '],
                [/<b>Gleicher Zähler:<\/b> Beide Male sind es (\d+) (?:Stück|Stücke)\. (\S+) sind größer als (\S+): Je größer der Nenner, desto kleiner die Stücke\./, (m, k, a, b) =>
                    '<b>Numerador igual:</b> nos dois casos ' + (k === '1' ? 'é 1 parte' : 'são ' + k + ' partes') + '. Os ' + n('2', a) + ' são maiores do que os ' + n('2', b) +
                    ': quanto maior é o denominador, mais pequenas são as partes.'],
                [/<b>Was fehlt zum Ganzen\?<\/b> Bei A (?:fehlen|fehlt) (\d+) (\S+), bei B (\d+) (\S+)\. (\S+) sind kleiner, also fehlt bei (A|B) weniger\./, (m, a, wa, b, wb, w, x) =>
                    '<b>Quanto falta para a unidade?</b> Em A falta' + (a === '1' ? '' : 'm') + ' ' + a + ' ' + n(a, wa) + ', em B ' + b + ' ' + n(b, wb) + '. Os ' + n('2', w) +
                    ' são menores; portanto, em ' + x + ' falta menos.'],
            ];
        })(),
        [/, denn (\d+) ist (weniger|mehr|genau)(?: als)? die Hälfte von (\d+)\./, (m, a, w, b) => ', porque ' + a + ' é ' +
            ({ weniger: 'menos do que', mehr: 'mais do que', genau: 'exatamente' })[w] + ' metade de ' + b + '.'],
        // rundenos5
        [/>Mitte (?=\d)/g, '>Meio '],
        [/^Zahlenstrahl zwischen (.+) und (.+)$/, 'Reta numérica entre $1 e $2'],
        [/Gerundet auf (Ganze|Zehntel|Hundertstel)\. Entscheidend ist die Ziffer der (Zehntel|Hundertstel|Tausendstel): /, (m, a, b) => 'Arredondamento ' +
            ({ 'Ganze': 'às unidades', 'Zehntel': 'às décimas', 'Hundertstel': 'às centésimas' })[a] + '. O que decide é o algarismo das ' +
            ({ 'Zehntel': 'décimas', 'Hundertstel': 'centésimas', 'Tausendstel': 'milésimas' })[b] + ': '],
        [/Die Null am Ende bleibt stehen: Sie zeigt, dass auf (Zehntel|Hundertstel) gerundet wurde\./, (m, a) => 'O zero no fim fica: mostra que se arredondou ' +
            (a === 'Zehntel' ? 'às décimas.' : 'às centésimas.')],
        // wuerfelnetzos5
        [/^Gitter mit (\d+) ausgewählten Quadraten$/, (m, n) => 'Quadrícula com ' + n + (n === '1' ? ' quadrado escolhido' : ' quadrados escolhidos')],
        [/, es fehlen noch (\d)\./, ', ainda faltam $1.'],
        [/Das sind (\d+) Quadrate\. Ein Würfel hat nur 6 Flächen\./, 'São $1 quadrados. Um cubo só tem 6 faces.'],
        [/Gefunden: (\d+) von 11 verschiedenen Würfelnetzen\./, (m, n) => 'Encontraste ' + n + (n === '1' ? ' das' : ' das') + ' 11 planificações diferentes do cubo.'],
        // bandos5
        [/^Bandornament aus dem Motiv (\S+)$/, (m, k) => 'Friso com o motivo ' + ({ 'Fahne': 'bandeira', 'Schlüssel': 'chave', 'Blume': 'flor' }[k] || k)],
        // zahlzeichenos5
        [/^Kerbholz und Strichliste mit (\d+) Strichen$/, 'Pau entalhado e tabela de contagem com $1 traços'],
        [/(?:(\d+) Fünferbündel(?: und (\d+) einzelner? (?:Striche|Strich))?|(\d+) einzelner? (?:Striche|Strich))(: )?/, (m, b5, r1, r2, c) => {
            const t = r => r + (r === '1' ? ' traço solto' : ' traços soltos');
            return (b5 ? b5 + (b5 === '1' ? ' grupo de cinco' : ' grupos de cinco') + (r1 ? ' e ' + t(r1) : '') : t(r2)) + (c ? ': ' : '');
        }],
        [/^Die Zahl (\d+) in babylonischer Keilschrift$/, 'O número $1 em escrita cuneiforme babilónica'],
    ]
});
