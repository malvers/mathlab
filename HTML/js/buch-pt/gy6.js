/* js/buch-pt/gy6.js — Portuguese for the widgets of js/buch-gy6.js.
 * Loaded by the Portuguese editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-7-prep (22.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gy6', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy6/*)
        // titelbildgy6 (the cover of GY 6)
        'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
            'Capa: um círculo com três oitavos coloridos, os números primos até 30 como pontos luminosos, um triângulo com os seus três ângulos e a paralela que passa pelo vértice de cima, um prisma triangular em perspetiva cavaleira',
        // book pt-10 mathegy6-pt:
        // bruchbild6: numerador, denominador; a whole number ≥ 1 (0 has its own sentence)
        'Zähler': 'Numerador', 'Nenner': 'Denominador', 'Kreis': 'Círculo', 'Streifen': 'Tira', 'Bild': 'Representação',
        'Der Bruch ist eine natürliche Zahl.': 'A fração é um número natural.',
        'Zähler kleiner': 'Diminuir o numerador', 'Zähler größer': 'Aumentar o numerador', 'Nenner kleiner': 'Diminuir o denominador', 'Nenner größer': 'Aumentar o denominador',
        // mengen6: ℕ₀ and ℚ₀⁺ as in Portuguese schools (the rules below); the reasons of the twelve numbers
        'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagrama de Venn: os números naturais e o zero estão dentro dos números racionais não negativos',
        'Richtig.': 'Certo.', 'Noch nicht.': 'Ainda não.', 'Noch einmal': 'Outra vez',
        'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcula o valor: é um número inteiro, sem resto?',
        'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Será que o número fica entre dois números naturais?',
        'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'em $\\mathbb{N}_0$ (e portanto também em $\\mathbb{Q}_0^+$)',
        'nur in $\\mathbb{Q}^+$': 'só em $\\mathbb{Q}_0^+$',
        '5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: $5 = \\tfrac51$.':
            '5 é um número natural, e cada número natural é também um número racional não negativo: $5 = \\tfrac51$.',
        '$\\tfrac34$ liegt zwischen 0 und 1. Das ist keine natürliche Zahl.': '$\\tfrac34$ fica entre 0 e 1. Não é um número natural.',
        '$0{,}5 = \\tfrac12$ liegt zwischen 0 und 1.': '$0{,}5 = \\tfrac12$ fica entre 0 e 1.',
        '$\\tfrac{12}{4} = 3$. Der Bruch sieht nur anders aus als die 3.': '$\\tfrac{12}{4} = 3$. A fração só tem um aspeto diferente do 3.',
        'In der Schule zählt die 0 zu den natürlichen Zahlen.': 'Em Portugal, o 0 não é um número natural, mas pertence a $\\mathbb{N}_0 = \\{0, 1, 2, \\dots\\}$.',
        '$2{,}5$ liegt zwischen 2 und 3.': '$2{,}5$ fica entre 2 e 3.',
        '$\\tfrac{10}{5} = 2$.': '$\\tfrac{10}{5} = 2$.',
        '$\\tfrac13 = 0{,}\\overline{3}$ liegt zwischen 0 und 1.': '$\\tfrac13 = 0{,}(3)$ fica entre 0 e 1.',
        '$4{,}0 = 4$. Die Null nach dem Komma ändert nichts.': '$4{,}0 = 4$. O zero depois da vírgula não muda nada.',
        '$\\tfrac92 = 4{,}5$ liegt zwischen 4 und 5.': '$\\tfrac92 = 4{,}5$ fica entre 4 e 5.',
        '$\\mathbb{N}$: die natürlichen Zahlen $0, 1, 2, 3, \\dots$<br>$\\mathbb{Q}^+$: die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $\\tfrac{p}{q}$ schreiben kann.<br>Jede natürliche Zahl ist auch eine gebrochene Zahl: $\\mathbb{N} \\subset \\mathbb{Q}^+$.':
            '$\\mathbb{N}_0$: os números naturais e o zero, $0, 1, 2, 3, \\dots$<br>$\\mathbb{Q}_0^+$: os números racionais não negativos, ou seja, todos os números que se podem escrever como fração $\\tfrac{p}{q}$.<br>Cada número natural é também um número racional não negativo: $\\mathbb{N}_0 \\subset \\mathbb{Q}_0^+$.',
        // bruchop6: the four operations ("a dividir" as Portuguese pupils read ":")
        'plus': 'mais', 'minus': 'menos', 'mal': 'vezes', 'durch': 'a dividir', 'Rechenart': 'Operação',
        'Zähler 1': 'Numerador 1', 'Nenner 1': 'Denominador 1', 'Zähler 2': 'Numerador 2', 'Nenner 2': 'Denominador 2',
        'erster Zähler kleiner': 'Diminuir o primeiro numerador', 'erster Zähler größer': 'Aumentar o primeiro numerador',
        'erster Nenner kleiner': 'Diminuir o primeiro denominador', 'erster Nenner größer': 'Aumentar o primeiro denominador',
        'zweiter Zähler kleiner': 'Diminuir o segundo numerador', 'zweiter Zähler größer': 'Aumentar o segundo numerador',
        'zweiter Nenner kleiner': 'Diminuir o segundo denominador', 'zweiter Nenner größer': 'Aumentar o segundo denominador',
        'Das Ergebnis wäre kleiner als null.': 'O resultado seria menor do que zero.',
        'Für das Bild sind die Zahlen zu groß.': 'Os números são grandes demais para a figura.',
        'Das Bild zeigt nur Brüche bis 1.': 'A figura só mostra frações até 1.',
        'Mal null ist null.': 'Vezes zero dá zero.', 'Durch null kann man nicht teilen.': 'Não se pode dividir por zero.',
        '1. Bruch': '1.ª fração', '2. Bruch': '2.ª fração', 'Ergebnis': 'Resultado', 'Grün': 'Verde',
        'Streifenbild der Rechnung': 'A conta representada em tiras', 'Rechteckbild: ein Teil von einem Teil': 'Retângulo: uma parte de uma parte',
        'Wie oft passt der zweite Bruch in den ersten?': 'Quantas vezes cabe a segunda fração na primeira?',
        'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numerador vezes numerador, denominador vezes denominador. Simplificar antes poupa trabalho.',
        'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Para dividir por uma fração, multiplica-se pelo seu inverso.',
        // vorrang6: the five sums and the steps (a step after "Agora:" starts in lower case; "Jetzt:" and the steps with a formula are phrases)
        'Punkt vor Strich': '× e : antes de + e −', 'Klammern zuerst': 'Parênteses primeiro', 'Mit Komma': 'Com vírgula',
        'Von links nach rechts': 'Da esquerda para a direita', 'Rechenvorteil': 'Cálculo inteligente', 'Aufgabe': 'Exercício',
        'Nächster Schritt': 'Próximo passo', 'Von vorn': 'Do início', 'Fertig.': 'Pronto.',
        'Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.': 'Pronto. Com os parênteses o resultado é diferente do que sem eles.',
        'Fertig. Wer von links rechnet, erhält falsch $6$.': 'Pronto. Quem calcula só da esquerda para a direita obtém, erradamente, $6$.',
        'Jetzt die Strichrechnung.': 'a adição.',
        'Distributivgesetz: $\\tfrac25$ ausklammern.': 'pela propriedade distributiva, pôr $\\tfrac25$ em evidência.',
        // probieren6
        'Einsetzen': 'Substituir', 'Alle Werte prüfen': 'Testar todos os valores',
        'Zahlenstrahl: grün erfüllt, rot nicht': 'Reta numérica: a verde os valores que servem, a vermelho os outros',
        'Passt.': 'Serve.', 'Passt nicht.': 'Não serve.',
        'Probe: Einsetzen ergibt eine wahre Aussage.': 'Verificação: ao substituir, obtém-se uma afirmação verdadeira.',
        'Die linke Seite ist zu klein.': 'O membro da esquerda é demasiado pequeno.', 'Die linke Seite ist zu groß.': 'O membro da esquerda é demasiado grande.',
        // pfeile6: Portuguese names for the pupils (the rules below name them in the reasons too), não unívoca / unívoca / biunívoca
        'Schüler → Vorname': 'Aluno → nome próprio', 'Vorname → Schüler': 'Nome próprio → aluno', 'Schüler → Sitzplatz': 'Aluno → lugar',
        'Zahl → Teiler': 'Número → divisores', 'Zahl → Doppeltes': 'Número → dobro', 'Zahl → Rest bei : 3': 'Número → resto da divisão por 3',
        'Lena Berg': 'Rita Costa', 'Tom Klein': 'Tiago Lopes', 'Lena Roth': 'Rita Silva', 'Max Vogel': 'Rui Gomes', 'Lena': 'Rita', 'Max': 'Rui', 'Tom': 'Tiago',
        'Zuordnung': 'Correspondência', 'Platz 1': 'Lugar 1', 'Platz 2': 'Lugar 2', 'Platz 3': 'Lugar 3', 'Platz 4': 'Lugar 4',
        'Welche Art von Zuordnung ist das?': 'Que tipo de correspondência é esta?',
        'mehrdeutig': 'não unívoca', 'eindeutig': 'unívoca', 'eineindeutig': 'biunívoca',
        'Richtig:': 'Certo:', 'Nicht ganz.': 'Não exatamente.',
        // zufall6 (the die and the coin side "Zahl" are rules below: "Würfel" is also the cube, "Zahl" also a number; Kopf/Zahl of a
        // euro coin = face nacional / face europeia, as in the other pt books)
        'Münze': 'Moeda', 'Glücksrad': 'Roleta', 'Versuch': 'Experiência', 'Kopf': 'Face nacional', 'Rot': 'Vermelha', 'Blau': 'Azul',
        '1-mal': '1 vez', '10-mal': '10 vezes', '100-mal': '100 vezes', 'Löschen': 'Apagar',
        'Säulendiagramm der relativen Häufigkeiten': 'Gráfico de barras das frequências relativas',
        'absolut': 'absoluta', 'relativ': 'relativa', 'in %': 'em %',
        // darstellung6
        'Kerze': 'Vela', 'Temperatur': 'Temperatura', 'Fahrradverleih': 'Aluguer de bicicletas', 'Zeile wählen': 'Escolher uma coluna',
        'Zeit in h': 'Tempo em h', 'Höhe in cm': 'Altura em cm', 'Uhrzeit': 'Hora', 'Temperatur in °C': 'Temperatura em °C',
        'Leihzeit in h': 'Tempo de aluguer em h', 'Preis in €': 'Preço em €',
        'Wortform:': 'Por palavras:', 'Tabelle:': 'Tabela:', 'Gleichung:': 'Equação:',
        'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'Nenhuma. A temperatura só se pode medir, não calcular.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy6/*)
        // book pt-10 mathegy6-pt:
        // bruchbild6 (after the rules: × for the product, the period in brackets)
        ['Bruch: $', 'Fração: $'], ['Dezimalzahl: $', 'Número decimal: $'], ['Prozent: $', 'Percentagem: $'],
        ['Der gekürzte Nenner ', 'O denominador da fração irredutível, '],
        [' hat nur die Primfaktoren 2 und 5. Erweitern mit $', ', só tem os fatores primos 2 e 5. Multiplicando os dois termos por $'],
        ['. Die Dezimalzahl <b>bricht ab</b>.', '. A dízima é <b>finita</b>.'],
        [' enthält den Primfaktor $', ', contém o fator primo $'],
        ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.', '$. Não há fração equivalente com denominador 10, 100, 1000 …: a dízima é <b>infinita periódica</b>.'],
        // mengen6: "$5 \\in \\mathbb{Q}_0^+$ und $5 \\in \\mathbb{N}_0$", "…, aber $x \\notin \\mathbb{N}_0$"
        ['$ und $', '$ e $'], [', aber $', ', mas $'],
        // bruchop6
        ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
            '$: nos números racionais não negativos esta subtração não é possível. Os números negativos vais conhecê-los no 7.º ano.'],
        ['Hauptnenner: $', 'Menor denominador comum: $'], ['$ (das kleinste gemeinsame Vielfache von $', '$ (o mínimo múltiplo comum de $'],
        ['$ von $', '$ de $'], ['$ Kästchen. Das ist $', '$ quadradinhos. É $'],
        ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
            '$: quantas vezes cabe nada em alguma coisa? Esta pergunta não tem resposta. Nunca se divide por $0$.'],
        ['$ passt $', '$ cabe $'], ['$-mal in $', '$ vezes em $'],
        // vorrang6 (after the rule × for the product)
        ['<b>Jetzt:</b> ', '<b>Agora:</b> '], ['Punktrechnung zuerst: $', 'primeiro a multiplicação: $'], ['Hauptnenner 4: $', 'denominador comum 4: $'],
        ['Die Klammer zuerst: $', 'primeiro os parênteses: $'], ['Punkt vor Strich: $', 'a multiplicação antes da subtração: $'],
        ['Zwei Punktrechnungen: die linke zuerst. $', 'há uma divisão e uma multiplicação, primeiro a da esquerda. $'],
        ['Fertig. Ohne Ausklammern: $', 'Pronto. Sem pôr em evidência: $'], ['$, mehr Arbeit.', '$, dá mais trabalho.'],
        // probieren6: "$x = 2$: $… = …$, und $… < …$"
        [', und $', ', e $'], ['Es passen: ', 'Servem: '], ['Bisher passt keiner.', 'Por enquanto, nenhum serve.'],
        // pfeile6: the labels inside the picture's aria label, the reasons
        ['Pfeildarstellung: ', 'Diagrama de setas: '],
        ['Schüler → Vorname', 'aluno → nome próprio'], ['Vorname → Schüler', 'nome próprio → aluno'], ['Schüler → Sitzplatz', 'aluno → lugar'],
        ['Zahl → Teiler', 'número → divisores'], ['Zahl → Doppeltes', 'número → dobro'], ['Zahl → Rest bei : 3', 'número → resto da divisão por 3'],
        ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
            'De cada elemento da esquerda parte exatamente uma seta, e a cada elemento da direita chega exatamente uma. Também no sentido inverso a correspondência é unívoca.'],
        ['Von jedem Element links geht genau ein Pfeil aus. ', 'De cada elemento da esquerda parte exatamente uma seta. '],
        ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
            '<b>não unívoca:</b> de um elemento partem várias setas. <b>unívoca:</b> de cada um parte exatamente uma. <b>biunívoca:</b> unívoca, e também unívoca no sentido inverso.'],
        // zufall6
        ['Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance',
            'Frequência relativa = frequência absoluta : número de experiências. A linha tracejada mostra a probabilidade'],
        [' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)', ' (o vermelho é metade da roleta, o azul um terço, o verde um sexto)'],
        ['. Je mehr Versuche, desto näher kommen die Säulen meistens heran.', '. Quanto mais experiências, mais perto ficam geralmente as barras.'],
        // darstellung6
        ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'Uma vela tem 20 cm de altura. Em cada hora gasta 2,5 cm.'],
        ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'Num dia de outono mede-se a temperatura de duas em duas horas.'],
        ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'O aluguer de uma bicicleta custa 3 € por hora.'],
        ['Diagramm: ', 'Gráfico: '], ['Gewählt: ', 'Escolhido: '],
        ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
            'A vela arde de forma regular, também entre as horas certas. Por isso podem unir-se os pontos com uma linha.'],
        ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
            'A linha tracejada só une os pontos medidos. O que aconteceu entre eles não se sabe ao certo.'],
        ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'Só se pagam horas inteiras, por isso há apenas pontos isolados.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // Portuguese school notation (Doc, 26.10.2026: always the local conventions): the period of a repeating decimal in
        // brackets, 0,(3) and 0,1(6) instead of the German bar (only digits under the bar, never a segment \overline{AB})
        [/\\overline\{(\d+)\}/g, '($1)'],
        // ℕ starts at 1 in Portugal: the German ℕ (with 0) is ℕ₀, the German ℚ⁺ (with 0) is ℚ₀⁺ (números racionais não negativos)
        [/\\mathbb\{N\}(?!_)/g, '\\mathbb{N}_0'], [/\\mathbb\{Q\}\^\+/g, '\\mathbb{Q}_0^+'],
        [/>ℕ<\/text>/g, '>ℕ₀</text>'], [/>ℚ⁺<\/text>/g, '>ℚ₀⁺</text>'],
        // book pt-10 mathegy6-pt:
        // bruchbild6: the picture's name and the sentence for zero parts
        [/Bild des Bruches (\d+) durch (\d+)/g, 'Representação da fração $1/$2'],
        [/Null Teile von (\d+) sind nichts: \$0\$\./g, 'Zero partes em $1 não é nada: $$0$$.'],
        // mengen6: the question and the end
        [/Zahl (\d+) von (\d+): Wohin gehört <b>/g, 'Número $1 de $2: onde fica <b>'],
        [/Alle Zahlen sind einsortiert, (\d+) von (\d+) gleich beim ersten Versuch richtig\./g, 'Todos os números estão arrumados, $1 de $2 certos logo à primeira.'],
        [/Alle Zahlen sind einsortiert\./g, 'Todos os números estão arrumados.'],
        // bruchop6: "Erst gleichnamig machen, dann die Zähler addieren. Der Nenner bleibt."
        [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g,
            (m, v) => 'Primeiro reduzir ao mesmo denominador, depois ' + (v === 'addieren' ? 'adicionar' : 'subtrair') + ' os numeradores. O denominador fica.'],
        // probieren6: the inequalities and the count of the values tried
        [/Gesucht sind alle Zahlen, für die die linke Seite (kleiner|größer) als (\$[^$]*\$) ist\./g, (m, r, x) =>
            'Procuram-se todos os números para os quais o membro da esquerda é ' + (r === 'kleiner' ? 'menor' : 'maior') + ' do que ' + x + '.'],
        [/Geprüft: (\d+) von (\d+) Werten\. /g, (m, a, b) => (a === '1' ? 'Valor testado: 1 de ' : 'Valores testados: ' + a + ' de ') + b + '. '],
        // pfeile6: the type and the reasons, with the Portuguese names of the pupils
        [/Die Zuordnung ist (mehrdeutig|eindeutig, aber nicht eineindeutig|eineindeutig)\. /g, (m, k) => 'A correspondência é ' +
            ({ 'mehrdeutig': 'não unívoca', 'eindeutig, aber nicht eineindeutig': 'unívoca, mas não biunívoca', 'eineindeutig': 'biunívoca' })[k] + '. '],
        [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, (m, x, n) => 'De «' + ({ 'Lena': 'Rita', 'Max': 'Rui', 'Tom': 'Tiago' }[x] || x) + '» partem ' + n + ' setas.'],
        [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g, (m, x, n) =>
            'Mas ' + (/^\d/.test(x) ? 'ao «' + x : ({ 'Lena': 'à «Rita', 'Max': 'ao «Rui', 'Tom': 'ao «Tiago' }[x] || 'a «' + x)) + '» chegam ' + n +
            ' setas, portanto, no sentido inverso, a correspondência não é unívoca.'],
        // zufall6: the die (the cube of other books has the same word), the coin side "Zahl", the number of trials
        [/(data-v="wuerfel">)(?:Würfel|\u0003\d+\u0004)(<\/button><button type="button" data-v="rad">)/g, '$1Dado$2'],
        [/(<td>|<text class="d-num"[^>]*>)Zahl(<\/)/g, '$1Face europeia$2'],
        [/>(\d+) Versuche</g, (m, n) => '>' + n + (n === '1' ? ' experiência' : ' experiências') + '<'],
        // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
        [/Gewählt: Uhrzeit /g, 'Gewählt: hora '], [/ → Temperatur /g, ' → temperatura '],
    ]
});
