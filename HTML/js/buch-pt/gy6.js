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
        // proportional6
        'direkt proportional': 'diretamente proporcional', 'indirekt proportional': 'inversamente proporcional', 'keins von beiden': 'nenhuma das duas',
        'Äpfel': 'Maçãs', 'Kuchen': 'Bolo', 'Taxi': 'Táxi', 'Beispiel': 'Exemplo',
        'Masse in kg': 'Massa em kg', 'Personen': 'Pessoas', 'Stück pro Person': 'Fatias por pessoa', 'Strecke in km': 'Distância em km',
        // dreisatz6 (the amounts with their unit, "4 Pumpen", and the arrows "↓ · 5" are rules below)
        'Pumpen': 'Bombas', 'Hefte': 'Cadernos', 'Futter': 'Ração', 'Antwort:': 'Resposta:',
        '3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?': '3 kg de maçãs custam 7,50 €. Quanto custam 5 kg?',
        '4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?': '4 bombas esvaziam um tanque em 6 horas. Quanto tempo levam 3 bombas?',
        '5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?': '5 cadernos custam 4 €. Quanto custam 8 cadernos?',
        'Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?': 'Uma reserva de ração chega para 12 coelhos durante 10 dias. Para quantos dias chega, se forem 8 coelhos?',
        '5 kg Äpfel kosten 12,50 €.': '5 kg de maçãs custam 12,50 €.', '3 Pumpen brauchen 8 Stunden.': '3 bombas levam 8 horas.',
        '8 Hefte kosten 6,40 €.': '8 cadernos custam 6,40 €.', 'Für 8 Kaninchen reicht das Futter 15 Tage.': 'Para 8 coelhos, a ração chega para 15 dias.',
        'Schritt 1: Schreib auf, was du weißt.': 'Passo 1: escreve o que sabes.', 'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Passo 3: calcula o valor para a quantidade pedida.',
        // winkelsumme6
        'Dreieck': 'Triângulo', 'Beweisfigur': 'Figura da demonstração', 'Ansicht': 'Vista',
        'Dreieck mit seinen Innenwinkeln': 'Triângulo com os seus ângulos internos',
        'Dreieck mit seinen Innenwinkeln und der Parallelen durch C': 'Triângulo com os seus ângulos internos e a paralela que passa por C',
        'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.':
            'Arrasta os vértices. Os ângulos mudam, a soma fica. Os valores estão arredondados ao grau.',
        // konstruktion6: the Portuguese criteria LLL, LAL, ALA (L lado, A ângulo); LLA = two sides and the angle opposite the larger one (German SsW)
        'sss': 'LLL', 'sws': 'LAL', 'wsw': 'ALA', 'SsW': 'LLA', 'www': 'AAA', 'Gegeben': 'Dados',
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$',
        'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Winkel $\\beta$': 'Ângulo $\\beta$', 'Seite $a$ gegenüber $\\alpha$': 'Lado $a$ oposto a $\\alpha$',
        'Genau ein Dreieck.': 'Exatamente um triângulo.', 'Kein Dreieck.': 'Nenhum triângulo.', 'Zwei Dreiecke.': 'Dois triângulos.',
        'Unendlich viele Dreiecke.': 'Infinitos triângulos.',
        'Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.':
            'As circunferências de centro $A$ e raio $r = b$ e de centro $B$ e raio $r = a$ cortam-se acima de $c$ num só ponto.',
        'Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.': 'Sobre o lado do ângulo $\\alpha$ marca-se o comprimento $b$. A extremidade é $C$.',
        'Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.':
            'A circunferência de centro $B$ corta duas vezes o lado do ângulo. Os dados não definem o triângulo.',
        'Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.': 'O lado oposto $a$ é o maior: $a \\geq c$.',
        'Der Kreis berührt den Schenkel nur.': 'A circunferência só toca o lado do ângulo.',
        'Der Kreis um $B$ erreicht den Schenkel nicht.': 'A circunferência de centro $B$ não chega ao lado do ângulo.',
        'Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.':
            'Todos têm a mesma forma, mas tamanhos diferentes. Três ângulos não definem um triângulo.',
        'Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.':
            'O terceiro ângulo já se conhece de qualquer forma: $\\gamma = 180^\\circ - \\alpha - \\beta$. Falta um comprimento.',
        // seitenwinkel6
        'Dreieck aus drei Stäben': 'Triângulo formado por três paus', 'Die Stäbe ergeben kein Dreieck': 'Os paus não formam um triângulo',
        // linien6 (Portuguese letters: O for the circumcentre, G for the centroid; rules below)
        'Mittelsenkrechten': 'Mediatrizes', 'Winkelhalbierende': 'Bissetrizes', 'Höhen': 'Alturas', 'Seitenhalbierende': 'Medianas', 'Linien': 'Retas',
        // flaeche6 (Portuguese letters: the base b of the parallelogram and the triangle, German g; rules below)
        'Parallelogramm': 'Paralelogramo', 'Trapez': 'Trapézio', 'Drachenviereck': 'Papagaio', 'Figur': 'Figura',
        'Zerlegen und verschieben': 'Decompor e deslocar', 'Grundseite $g$': 'Base $b$', 'Höhe $h$': 'Altura $h$',
        'Diagonale $e$': 'Diagonal $e$', 'Diagonale $f$': 'Diagonal $f$',
        // vierecke6 ("gleichschenkliges" / "Trapez" in two lines: a rule below puts them in Portuguese order; every Portuguese name is masculine)
        'Quadrat': 'Quadrado', 'Rechteck': 'Retângulo', 'Raute': 'Losango', 'Viereck': 'Quadrilátero',
        'gleichschenkliges Trapez': 'Trapézio isósceles', 'Haus der Vierecke': 'Casa dos quadriláteros',
        'parallele Seiten': 'lados paralelos', 'gleich lange Seiten': 'lados iguais', 'rechte Winkel': 'ângulos retos', 'Symmetrieachsen': 'eixos de simetria',
        'Diagonalen halbieren sich': 'diagonais bissetam-se', 'Diagonalen senkrecht': 'diagonais perpendiculares', 'Diagonalen gleich lang': 'diagonais iguais',
        '2 Paare': '2 pares', '1 Paar': '1 par', 'alle vier': 'os quatro', 'je zwei gegenüber': 'os opostos, dois a dois', 'keine nötig': 'não obrigatório',
        'keins nötig': 'não obrigatório', 'die beiden Schenkel': 'os dois lados não paralelos', 'je zwei benachbarte': 'os consecutivos, dois a dois',
        'nur eine die andere': 'uma bisseta a outra', 'mindestens 1': 'pelo menos 1', 'ja': 'sim', 'nein': 'não',
        'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.':
            'O <b>quadrilátero</b> está lá em baixo: só precisa de quatro vértices e quatro lados, mais nada.',
        'Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.':
            'Toca num quadrilátero da casa. O que está mais abaixo é mais geral, o que está mais acima tem mais propriedades.',
        // prisma6 (Portuguese letters as js/buch-pt/vektoren.js: A_b area of the base, P_b perimeter of the base, A_L lateral area, A total area;
        // German G, u, M, O - rules below, also in the two pictures)
        'Dreiecksprisma': 'Prisma triangular', 'Quader': 'Paralelepípedo', 'Trapezprisma': 'Prisma trapezoidal', 'Sechseckprisma': 'Prisma hexagonal',
        'Prisma': 'Prisma', 'Schrägbild': 'Perspetiva cavaleira', 'Netz': 'Planificação',
        'Grundkante $a$': 'Aresta da base $a$', 'Höhe $h$ des Prismas': 'Altura $h$ do prisma',
        'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.':
            'Perspetiva cavaleira: a base fica à frente em verdadeira grandeza. As arestas que vão para trás fazem $45^\\circ$ e têm metade do comprimento. As arestas escondidas estão a tracejado.',
        'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.':
            'A planificação é formada pelas duas bases e pela superfície lateral. A superfície lateral é um retângulo: tão largo como o perímetro $P_b$ da base, tão alto como $h$.',
        // kreisdiagramm6 (the columns "Anzahl" and "Prozent" are rules below: short heads keep the table inside its box)
        'zu Fuß': 'A pé', 'Fahrrad': 'Bicicleta', 'Bus oder Bahn': 'Autocarro ou comboio', 'Auto': 'Carro',
        'zu Fuß kleiner': 'A pé: diminuir', 'zu Fuß größer': 'A pé: aumentar', 'Fahrrad kleiner': 'Bicicleta: diminuir', 'Fahrrad größer': 'Bicicleta: aumentar',
        'Bus oder Bahn kleiner': 'Autocarro ou comboio: diminuir', 'Bus oder Bahn größer': 'Autocarro ou comboio: aumentar', 'Auto kleiner': 'Carro: diminuir', 'Auto größer': 'Carro: aumentar',
        'Kreisdiagramm: Wie kommst du zur Schule?': 'Gráfico circular: como vens para a escola?',
        'Anteil': 'Fração', 'Winkel': 'Ângulo', 'zusammen': 'Total',
        'Umfrage in einer Klasse: Wie kommst du zur Schule?': 'Inquérito numa turma: como vens para a escola?',
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
        // proportional6 (after the rule × for the product)
        ['Graph der Zuordnung ', 'Gráfico da correspondência: '],
        ['Äpfel: 1 kg kostet 2,50 €', 'Maçãs: 1 kg custa 2,50 €'], ['24 Stück Kuchen werden gerecht verteilt', '24 fatias de bolo são repartidas igualmente'],
        ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Táxi: 3 € de bandeirada e 2 € por km'], ['. Zieh den gelben Punkt.', '. Arrasta o ponto amarelo.'],
        ['Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.',
            'O quociente $y : x$ é sempre $2{,}5$: <b>proporcionalidade direta</b>. O gráfico é uma reta que passa pela origem.'],
        ['Das Produkt $x \\times y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.',
            'O produto $x \\times y$ é sempre $24$: <b>proporcionalidade inversa</b>. O dobro das pessoas, metade do bolo.'],
        ['Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.',
            'Quanto mais quilómetros, mais caro. Mas o quociente muda: <b>não proporcional</b>. A reta não passa pela origem.'],
        // dreisatz6
        ['Schritt 2: Rechne auf eins zurück. ', 'Passo 2: calcula o valor para uma unidade. '],
        ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'proporcionalidade direta: dos dois lados faz-se a conta com o mesmo número.'],
        ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
            'proporcionalidade inversa: à direita faz-se a conta inversa. O «: 4» da esquerda passa a «× 4» à direita.'],
        // winkelsumme6 (the segment \overline{AB} of the German book: the line AB in Portuguese)
        ['Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ',
            'A linha tracejada é paralela à reta $AB$. $\\alpha\'$ e $\\alpha$ são ângulos alternos internos formados por retas paralelas, portanto têm a mesma amplitude. O mesmo acontece com $\\beta\'$ e $\\beta$. '],
        ['Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.', 'Juntamente com $\\gamma$, $\\alpha\'$ e $\\beta\'$ formam um ângulo raso: $180^\\circ$.'],
        // konstruktion6: the criteria, the sentences with a computed number
        ['<b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.',
            '<b>Critério LLL:</b> se dois triângulos têm os três lados iguais, então são geometricamente iguais.'],
        ['<b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.',
            '<b>Critério LAL:</b> se dois triângulos têm iguais dois lados e o ângulo por eles formado, então são geometricamente iguais.'],
        ['<b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.',
            '<b>Critério ALA:</b> se dois triângulos têm iguais um lado e os dois ângulos adjacentes a esse lado, então são geometricamente iguais.'],
        ['<b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.',
            '<b>Critério LLA:</b> se dois triângulos têm iguais dois lados e o ângulo oposto ao <b>maior</b> desses lados, então são geometricamente iguais.'],
        ['Die freien Schenkel der Winkel schneiden sich in $C$. ', 'Os lados livres dos ângulos cortam-se em $C$. '],
        ['. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.', '. Para $\\gamma$ não sobra nada: os lados dos ângulos afastam-se um do outro.'],
        ['$\\alpha + \\beta$ ist schon $', '$\\alpha + \\beta$ já é $'],
        ['Die Kreise berühren sich nur auf der längsten Seite.', 'As circunferências só se tocam sobre o lado maior.'],
        ['Die Kreise treffen sich nicht.', 'As circunferências não se cortam.'],
        // seitenwinkel6
        ['Alle Seiten gleich lang: alle Winkel $60^\\circ$. ', 'Todos os lados iguais: todos os ângulos com $60^\\circ$. '],
        ['Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.',
            'Dois lados são iguais: o triângulo é isósceles, e os ângulos da base têm a mesma amplitude.'],
        ['Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.',
            'Os dois paus mais curtos, juntos, têm exatamente o comprimento do mais comprido: ficam deitados sobre ele. Isto não é um triângulo.'],
        ['Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.', 'Os dois paus mais curtos não chegam um ao outro, rode-se como se rodar.'],
        [' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.', ' <b>Desigualdade triangular:</b> dois lados juntos têm de ser sempre maiores do que o terceiro.'],
        // linien6: the aria label and the explanations (O and G as in Portuguese schools)
        ['Dreieck mit seinen Mittelsenkrechten', 'Triângulo com as suas mediatrizes'], ['Dreieck mit seinen Winkelhalbierende', 'Triângulo com as suas bissetrizes'],
        ['Dreieck mit seinen Höhen', 'Triângulo com as suas alturas'], ['Dreieck mit seinen Seitenhalbierende', 'Triângulo com as suas medianas'],
        ['Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.',
            'Cada ponto de uma mediatriz está à mesma distância dos dois vértices. O seu ponto de interseção $O$ está à mesma distância dos <b>três vértices</b>: é o centro da circunferência circunscrita.'],
        [' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.', ' Num triângulo obtusângulo, $O$ fica no exterior.'],
        [' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.', ' No triângulo retângulo, $O$ fica exatamente sobre o lado maior.'],
        [' Bei einem spitzwinkligen Dreieck liegt $U$ innen.', ' Num triângulo acutângulo, $O$ fica no interior.'],
        ['Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.',
            'Cada ponto de uma bissetriz está à mesma distância dos dois lados do ângulo. O seu ponto de interseção $I$ está à mesma distância dos <b>três lados</b>: é o centro da circunferência inscrita. Fica sempre no interior.'],
        ['Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.',
            'Uma altura é a perpendicular traçada de um vértice para o lado oposto. As três alturas cortam-se num ponto $H$.'],
        [' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).', ' No triângulo obtusângulo, $H$ fica no exterior: é preciso prolongar os lados (a tracejado).'],
        [' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.', ' No triângulo retângulo, $H$ é o vértice do ângulo reto.'],
        ['Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.',
            'Uma mediana une um vértice ao ponto médio do lado oposto. O seu ponto de interseção $G$ é o baricentro: um triângulo de cartão pode equilibrar-se aí na ponta de uma agulha.'],
        // flaeche6 (after the rule × for the product)
        ['Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.',
            'O triângulo cortado desliza para a direita. O paralelogramo passa a ser um retângulo com a mesma base e a mesma altura.'],
        ['Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.',
            'Uma cópia do triângulo roda em torno do ponto médio de um lado. Juntos, os dois formam um paralelogramo. O triângulo é metade dele.'],
        ['Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.',
            'Uma cópia do trapézio roda em torno do ponto médio de um lado não paralelo. Juntos, os dois formam um paralelogramo de base $a + c$.'],
        ['Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.',
            'Os quatro triângulos do papagaio dobram-se para fora. Preenchem exatamente metade do retângulo formado pelas duas diagonais.'],
        // prisma6 (after the rule × for the product; "Grundfläche $G" is a rule below)
        ['$, Umfang der Grundfläche $u', '$, perímetro da base $P_b'], ['Mantel $M = u', 'Área lateral $A_L = P_b'],
        ['Oberfläche $O = 2 \\times G + M', 'Área total $A = 2 \\times A_b + A_L'], ['Volumen $V = G \\times h', 'Volume $V = A_b \\times h'],
        // kreisdiagramm6
        ['Winkel = Anteil · 360°. ', 'Ângulo = fração × 360°. '], ['Eine Person entspricht hier $', 'Aqui, uma pessoa corresponde a $'],
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
        // dreisatz6: "4 Pumpen" → "4 bombas", "1 Kaninchen" → "1 coelho"; the arrows "↓ · 5" → "↓ × 5"
        [/>([\d.,]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => '>' + n + ' ' +
            ({ 'Pumpen': ['bomba', 'bombas'], 'Hefte': ['caderno', 'cadernos'], 'Kaninchen': ['coelho', 'coelhos'], 'Tage': ['dia', 'dias'] })[u][n === '1' ? 0 : 1] + '<'],
        [/(↓ )· (?=\d)/g, '$1× '],
        // konstruktion6: the sentence with the two lengths, the picture's aria label
        [/Die beiden kürzeren Seiten sind zusammen ([\d,]+) cm lang, die längste ([\d,]+) cm\. /g, 'Os dois lados mais curtos medem juntos $1 cm, o mais comprido $2 cm. '],
        [/^Konstruktion aus (sss|sws|wsw|SsW|www)$/, (m, k) => 'Construção a partir de ' + ({ sss: 'LLL', sws: 'LAL', wsw: 'ALA', SsW: 'LLA', www: 'AAA' })[k]],
        // seitenwinkel6: the largest angle lies opposite the longest side
        [/Der <span class="g-lam">längsten Seite \$([abc])\$<\/span> liegt der <span class="g-lam">größte Winkel \$(\\[a-z]+)\$<\/span> gegenüber, der <span class="g-cy">kürzesten \$([abc])\$<\/span> der kleinste\. /g,
            (m, s1, w, s2) => 'Ao <span class="g-lam">lado maior $' + s1 + '$</span> opõe-se o <span class="g-lam">ângulo maior $' + w + '$</span>, ao <span class="g-cy">lado menor $' + s2 + '$</span> o ângulo menor. '],
        // linien6: the Portuguese letters of the points (O circumcentre, G centroid), the line under the buttons
        [/(r="5.5" fill="#F5C242"\/><text class="g-pt"[^>]*>)([US])(<\/text>)/g, (m, a, p, b) => a + (p === 'U' ? 'O' : 'G') + b],
        [/ · Schnittpunkt \$([UIHS])\$: (Umkreismittelpunkt|Inkreismittelpunkt|Höhenschnittpunkt|Schwerpunkt)/g, (m, p, w) => ' · ponto de interseção $' +
            ({ U: 'O', I: 'I', H: 'H', S: 'G' })[p] + '$: ' + ({ 'Umkreismittelpunkt': 'circuncentro', 'Inkreismittelpunkt': 'incentro',
                'Höhenschnittpunkt': 'ortocentro', 'Schwerpunkt': 'baricentro' })[w]],
        // flaeche6: the base b (German g) in the formulas, the aria label of the picture
        [/\$A = (\\tfrac12 \\times )?g \\times h = /g, '$$A = $1b \\times h = '],
        [/^(Parallelogramm|Dreieck|Trapez|Drachenviereck): zerlegen und verschieben$/, (m, s) =>
            ({ 'Parallelogramm': 'Paralelogramo', 'Dreieck': 'Triângulo', 'Trapez': 'Trapézio', 'Drachenviereck': 'Papagaio' })[s] + ': decompor e deslocar'],
        // vierecke6: the two-line label "gleichschenkliges / Trapez" (the second line may already be a translated label)
        [/(<text class="g6-nodetxt"[^>]*>)gleichschenkliges(<\/text>[^<]*<text class="g6-nodetxt"[^>]*>)(?:Trapez|\u0003\d+\u0004)(<\/text>)/g, '$1Trapézio$2isósceles$3'],
        // vierecke6: "Jedes <b>Quadrat</b> ist auch ein Rechteck, eine Raute, …" - every Portuguese name is masculine ("todo o", "um")
        [/Jede[s]? <b>([^<]+)<\/b> ist auch ([^<]+)\.<\/p>/g, (m, s, list) => {
            const N = { 'Quadrat': 'quadrado', 'Rechteck': 'retângulo', 'Raute': 'losango', 'Parallelogramm': 'paralelogramo', 'gleichschenkliges Trapez': 'trapézio isósceles',
                'gleichschenklige Trapez': 'trapézio isósceles', 'Drachenviereck': 'papagaio', 'Trapez': 'trapézio', 'Viereck': 'quadrilátero' };
            const L = list.split(', ').map(x => { const k = x.replace(/^eine?s? /, ''); return N[k] ? 'um ' + N[k] : x; });
            return 'Todo o <b>' + (N[s] || s) + '</b> é também ' + (L.length > 1 ? L.slice(0, -1).join(', ') + ' e ' + L[L.length - 1] : L[0]) + '.</p>';
        }],
        // prisma6: the first line of the results (a rule: js/buch-pt/vektoren.js has a phrase "Grundfläche $G = |…" of its own)
        [/Grundfläche \$G (= |\\approx )/g, 'Área da base $$A_b $1'],
        // prisma6: the letters in the two pictures (G → A_b, M → A_L, with a subscript), only inside the prism pictures
        [/(aria-label="[^"]*(?:im Schrägbild: Grundfläche vorn in wahrer Größe|zwei Grundflächen und der Mantel aus Rechtecken)[^"]*"[\s\S]*?<\/svg>)/g, m =>
            m.replace(/(<text class="g-area"[^>]*>)G(<\/text>)/g, '$1A<tspan dy="4" font-size="0.7em">b</tspan>$2')
                .replace(/(<text class="g-area"[^>]*>)M(<\/text>)/g, '$1A<tspan dy="4" font-size="0.7em">L</tspan>$2')],
        [/^(Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma) im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang$/, (m, s) =>
            ({ 'Dreiecksprisma': 'Prisma triangular', 'Quader': 'Paralelepípedo', 'Trapezprisma': 'Prisma trapezoidal', 'Sechseckprisma': 'Prisma hexagonal' })[s] +
            ' em perspetiva cavaleira: a base à frente em verdadeira grandeza, a profundidade a 45 graus e com metade do comprimento'],
        [/^Netz des (Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma)s: zwei Grundflächen und der Mantel aus Rechtecken$/, (m, s) => 'Planificação do ' +
            ({ 'Dreiecksprisma': 'prisma triangular', 'Quader': 'paralelepípedo', 'Trapezprisma': 'prisma trapezoidal', 'Sechseckprisma': 'prisma hexagonal' })[s] +
            ': duas bases e a superfície lateral formada por retângulos'],
        // kreisdiagramm6: the count column (the pupils) and the percent column, short so the table keeps "Ângulo" inside its box
        [/<th>Anzahl<\/th>/g, '<th>Alunos</th>'], [/<th>Prozent<\/th>/g, '<th>%</th>'],
    ]
});
