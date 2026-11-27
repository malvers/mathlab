/* js/buch-pt/gy7.js — Portuguese for the widgets of js/buch-gy7.js.
 * Loaded by the Portuguese editions right after js/buch-gy7.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-11-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Rules run before the phrases: geometrie.js turns \cdot into \times and the pt0 rules below turn ℕ into ℕ₀, so a
 * phrase key is written with \times, \mathbb{N}_0 and \mathbb{Q}_0^+ (a word key keeps the German form).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gy7', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy7/*)
        // the solids and the 3D stage ("Würfel" is a die in other books: the cube is a rule below)
        'Quader': 'Paralelepípedo', 'Dreiecksprisma': 'Prisma triangular', 'Sechseckprisma': 'Prisma hexagonal', 'Quadratische Pyramide': 'Pirâmide quadrangular',
        'Quadr. Pyramide': 'Pirâmide quadr.', 'Dreieckspyramide': 'Pirâmide triangular', 'Pyramidenstumpf': 'Tronco de pirâmide', 'Tetraeder': 'Tetraedro',
        'Oktaeder': 'Octaedro', 'Dodekaeder': 'Dodecaedro', 'Ikosaeder': 'Icosaedro', 'Körper in 3D': 'Sólido em 3D', 'Ziehen zum Drehen': 'Arrasta para rodar',
        // book pt-11 mathegy7-pt:
        // titelbildgy7
        'Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl':
            'Capa: uma circunferência com um triângulo retângulo cujo lado maior é um diâmetro, uma pirâmide em perspetiva cavaleira, um icosaedro, um gráfico circular e uma reta numérica com um número e o seu simétrico',
        // kreisgerade7 (Passante = reta exterior; the label of the line follows an arrow, so its capital fits)
        'Passante': 'Reta exterior', 'Sekante': 'Secante',
        'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.':
            'Arrasta os dois pontos da reta. Quando a distância $d$ se aproxima do raio $r$, a reta fixa-se na posição de tangente.',
        'Ein Kreis mit einer Passante, einer Sekante und einer Tangente': 'Uma circunferência com uma reta exterior, uma secante e uma tangente',
        'Kreis mit einer verschiebbaren Geraden': 'Circunferência com uma reta que se pode deslocar',
        // dreieckkreise7 (the circumcentre is O in Portuguese schools, German U: the label and the sentences; "Kreis" is a rule below,
        // gy6.js has the word for the circle of its fractions)
        'Umkreis': 'Circunscrita', 'Inkreis': 'Inscrita', 'Dreieck mit Umkreis': 'Triângulo e circunferência circunscrita',
        'Dreieck mit Inkreis': 'Triângulo e circunferência inscrita',
        'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.':
            'Arrasta os vértices. Perto de $90^\\circ$, o ângulo no vértice que arrastas fixa-se num ângulo reto.',
        'Die drei': 'As três', 'Winkelhalbierenden': 'bissetrizes',
        'schneiden sich in einem Punkt $U$. Er ist von allen drei Ecken gleich weit entfernt:': 'cortam-se num ponto $O$, que está à mesma distância dos três vértices:',
        'schneiden sich in einem Punkt $I$. Er hat von allen drei <b>Seiten</b> denselben Abstand:': 'cortam-se num ponto $I$, que está à mesma distância dos três <b>lados</b>:',
        'Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.':
            'O triângulo é <b>retângulo</b>: $O$ fica exatamente no ponto médio do lado maior. É o teorema de Tales visto ao contrário.',
        'Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.': 'O triângulo é <b>obtusângulo</b>: $O$ fica <b>fora</b> do triângulo.',
        'Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.': 'O triângulo é <b>acutângulo</b>: $O$ fica <b>dentro</b> do triângulo.',
        'Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.': 'A circunferência inscrita toca em todos os lados. $I$ fica sempre dentro do triângulo.',
        'Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.': 'Os três vértices estão quase alinhados. Afasta um dos vértices.',
        // kreiswinkel7 ("Satz des Thales" stays the teorema de Tales, the page says once that Portugal often gives that name to another theorem)
        'Thales': 'Tales', 'Peripheriewinkel': 'Ângulo inscrito', 'Sehnenviereck': 'Quadrilátero inscrito', 'Satz': 'Teorema', 'Zentriwinkel': 'Ângulo ao centro',
        'Beweisidee zeigen': 'Ideia da demonstração',
        'Satz des Thales: Dreieck über dem Durchmesser': 'Teorema de Tales: triângulo inscrito numa semicircunferência',
        'Peripheriewinkel und Zentriwinkel über einem Kreisbogen': 'Ângulo inscrito e ângulo ao centro que abrangem o mesmo arco',
        'Sehnenviereck mit seinen vier Winkeln': 'Quadrilátero inscrito e os seus quatro ângulos',
        'Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. Ihre Basiswinkel sind gleich:':
            'O segmento $[MC]$ divide o triângulo em dois triângulos <b>isósceles</b>, porque $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. Os seus ângulos da base são iguais:',
        '$\\alpha$ bei $A$ und bei $C$': '$\\alpha$ em $A$ e em $C$', '$\\beta$ bei $B$ und bei $C$': '$\\beta$ em $B$ e em $C$',
        '. Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.':
            '. Soma dos ângulos: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, portanto $\\gamma = \\alpha + \\beta = 90^\\circ$.',
        // konstruktion7 (the circle k is 𝒞, k1 and k2 are 𝒞1 and 𝒞2, the auxiliary circle h is 𝒞′; the steps are whole list items;
        // the row of four step buttons does not wrap: "Alle Schritte" and "Von vorn" are short rules below)
        'Tangenten von P': 'Tangentes por P', 'Dreieck aus c, α, β': 'Triângulo dados c, α, β', 'Tangenten an zwei Kreise': 'Tangentes a duas circunferências',
        'Konstruktion': 'Construção', '◀ Zurück': '◀ Anterior', 'Weiter ▶': 'Seguinte ▶',
        'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Winkel $\\beta$': 'Ângulo $\\beta$',
        'Konstruktion der Tangenten von einem Punkt an einen Kreis': 'Construção das tangentes a uma circunferência que passam por um ponto',
        'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln': 'Construção de um triângulo dados um lado e dois ângulos',
        'Konstruktion der gemeinsamen Tangenten an zwei Kreise': 'Construção das tangentes comuns a duas circunferências',
        'Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.':
            'São dados uma circunferência $\\mathcal{C}$ de centro $M$ e raio $r = 2$ cm e um ponto $P$ exterior a $\\mathcal{C}$.',
        'Verbinde $M$ und $P$.': 'Traça o segmento $[MP]$.',
        'Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.':
            'Constrói a mediatriz de $[MP]$: dois arcos de circunferência de centros $M$ e $P$ com o mesmo raio. Ela corta $[MP]$ no ponto médio $H$.',
        'Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.': 'Traça a circunferência de centro $H$ que passa por $M$ e $P$: a circunferência de Tales de diâmetro $[MP]$.',
        'Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.':
            'Ela corta $\\mathcal{C}$ em $B_1$ e $B_2$. Pelo teorema de Tales, os ângulos $M\\hat{B}_1P$ e $M\\hat{B}_2P$ são retos.',
        'Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.':
            'As retas $PB_1$ e $PB_2$ são perpendiculares aos raios em $B_1$ e $B_2$: são as duas tangentes a $\\mathcal{C}$ que passam por $P$.',
        'Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.':
            'Faz um esboço e marca o que é dado: $c = 6$ cm, $\\alpha$ e $\\beta$. É o caso ALA: um lado e os dois ângulos adjacentes.',
        'Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.': 'Traça o segmento $[AB]$ com $c = 6$ cm.',
        'Trage in $A$ den Winkel $\\alpha$ an.': 'Marca em $A$ o ângulo $\\alpha$.', 'Trage in $B$ den Winkel $\\beta$ an.': 'Marca em $B$ o ângulo $\\beta$.',
        'Die freien Schenkel schneiden sich im Punkt $C$.': 'Os lados livres dos dois ângulos cortam-se no ponto $C$.',
        'Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.':
            'Traça o triângulo $[ABC]$. Verificação: mede $\\gamma$ e compara com $180^\\circ - \\alpha - \\beta$.',
        'Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.':
            'São dadas a circunferência $\\mathcal{C}_1$ de centro $M_1$ e raio $r_1 = 2$ cm e a circunferência $\\mathcal{C}_2$ de centro $M_2$ e raio $r_2 = 1$ cm. Procuram-se as duas tangentes comuns exteriores.',
        'Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.': 'Traça a circunferência auxiliar $\\mathcal{C}\'$ de centro $M_1$ e raio $r_1 - r_2 = 1$ cm.',
        'Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.':
            'Constrói as tangentes a $\\mathcal{C}\'$ que passam por $M_2$, como em «Tangentes por P»: a circunferência de Tales de diâmetro $[M_1M_2]$ corta $\\mathcal{C}\'$ em $T_1$ e $T_2$.',
        'Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.':
            'Prolonga $[M_1T_1]$ e $[M_1T_2]$ até à circunferência $\\mathcal{C}_1$: obténs os pontos de tangência $B_1$ e $B_2$.',
        'Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.':
            'Desloca as tangentes auxiliares $r_2$ para fora: as paralelas que passam por $B_1$ e $B_2$ são as tangentes comuns. Tocam em $\\mathcal{C}_2$ no ponto em que o raio lhes é perpendicular.',
        'Du kannst $P$ verschieben, in jedem Schritt.': 'Podes deslocar $P$ em cada passo.', 'Du kannst $M_2$ verschieben, in jedem Schritt.': 'Podes deslocar $M_2$ em cada passo.',
        // zahlengerade7 (Betrag: valor absoluto, Gegenzahl: simétrico)
        'Gegenzahlen': 'Simétricos', 'Start': 'Partida', 'Addieren': 'Adicionar', 'Subtrahieren': 'Subtrair', 'Rechenart': 'Operação',
        'erste Zahl $a$': 'primeiro número $a$', 'zweite Zahl $b$': 'segundo número $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Arrasta os pontos $a$ e $b$ na reta numérica. Fixam-se de meia em meia unidade.',
        'Zahlengerade mit rationalen Zahlen': 'Reta numérica com números racionais', 'Rechnen als Bewegung auf der Zahlengeraden': 'Calcular é deslocar-se na reta numérica',
        'Betrag:': 'Valor absoluto:', ', der Abstand von der Null · Gegenzahl:': ', a distância ao zero · simétrico:', ', gespiegelt an der Null': ', a imagem refletida em relação ao zero',
        'Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.': 'Adicionar um número positivo: para a direita. Adicionar um número negativo: para a esquerda.',
        // zahlbereiche7 (ℕ₀, ℤ, ℚ₀⁺ and ℚ: the German ℕ and ℚ⁺ count 0, rules in pt0 above; the words keep the German form)
        'Wohin gehört die Zahl?': 'Onde fica o número?', 'Nächste Zahl': 'Número seguinte', 'DIE ZAHL': 'O NÚMERO',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, mas não $\\mathbb{N}_0$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}_0^+$, mas não $\\mathbb{N}_0$',
        'nur $\\mathbb{Q}$': 'só $\\mathbb{Q}$', 'Nur das Bild': 'Só a figura', 'Teilmengen': 'Subconjuntos', 'Schnittmenge': 'Interseção', 'Vereinigung': 'Reunião', 'Mengen': 'Conjuntos',
        'rationale Zahlen': 'números racionais', 'ganze Zahlen': 'números inteiros', 'gebrochene Zahlen': 'racionais não negativos', 'natürliche': 'naturais e o 0',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Diagrama de Venn: números naturais e o zero, inteiros, racionais não negativos e racionais',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': 'Em que parte da figura fica? Toca num botão ou na figura.',
        'Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.':
            'Os números <b>inteiros</b> $\\mathbb{Z}$ e os <b>racionais não negativos</b> $\\mathbb{Q}_0^+$ sobrepõem-se. Na parte comum ficam os números <b>naturais e o zero</b>, $\\mathbb{N}_0$. Tudo junto está contido nos números <b>racionais</b> $\\mathbb{Q}$.',
        // vorzeichen7 ("Von Zeile zu Zeile …" is a rule below)
        'Multiplizieren': 'Multiplicar', 'Potenzen': 'Potências', 'Muster': 'Padrão', 'erster Faktor': 'primeiro fator', 'Nächste Zeile': 'Próxima linha',
        'positiv': 'positivo', 'negativ': 'negativo', 'Die Ergebnisse auf der Zahlengeraden': 'Os resultados na reta numérica',
        'Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.': 'Como continua o padrão? Pensa antes de mostrares a próxima linha.',
        'Plus mal minus ergibt minus.': 'Mais vezes menos dá menos.', 'Minus mal minus ergibt plus. Minus mal plus ergibt minus.': 'Menos vezes menos dá mais. Menos vezes mais dá menos.',
        'Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.': 'Expoente par: positivo. Expoente ímpar: negativo. Porque cada par de sinais menos se anula.',
        'Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.': 'Atenção: $-2^2 = -(2 \\times 2) = -4$, mas $(-2)^2 = 4$. São os parênteses que decidem.',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'Uma balança em equilíbrio: à esquerda três caixas x e dois pesos, à direita uma caixa x e seis pesos',
        // umstellen7 (Portuguese letters: P for the perimeter, d for the distance, A_b for the base of the pyramid - rules below; "Dichte" is a
        // rule: gy12lk.js has the word for the density of a distribution)
        'Rechteck': 'Retângulo', 'Nächster Schritt': 'Próximo passo', 'Umfang': 'Perímetro', 'Geschwindigkeit': 'Velocidade', 'Formel': 'Fórmula', '⇄ Seiten tauschen': '⇄ Trocar os membros',
        'umstellen nach': 'em ordem a', 'Pyramide': 'Pirâmide',
        // prozent7 (the letters G, W, p stay, as in mathefos11-pt; the page names them once; the sentences with numbers are rules below)
        'Grundwert $G$': 'Valor de referência $G$', 'Prozentsatz $p\\,\\%$': 'Percentagem $p\\,\\%$', 'Änderung um': 'Variação de',
        'Danach um denselben Prozentsatz zurück': 'Depois a mesma percentagem no sentido inverso', 'Balken vor und nach der Änderung': 'Barras antes e depois da variação',
        'Die drei Grundaufgaben:<br>$W = p\\,\\% \\cdot G$ · $p\\,\\% = \\dfrac{W}{G}$ · $G = \\dfrac{W}{p\\,\\%}$':
            'Os três problemas básicos:<br>$W = p\\,\\% \\times G$ · $p\\,\\% = \\dfrac{W}{G}$ · $G = \\dfrac{W}{p\\,\\%}$',
        'Neuer Wert:': 'Novo valor:', 'Nicht': 'Não',
        // diagramm7 (one data set as bar, line or pie chart; the names of the class election get Portuguese names with the same initials)
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Como vens para a escola? Inquérito numa turma', 'Antworten': 'Respostas', 'zu Fuß': 'A pé',
        'Fahrrad': 'Bicicleta', 'Bus, Bahn': 'Autocarro, comboio', 'Auto': 'Carro', 'Klassensprecherwahl: Stimmen': 'Eleição do delegado de turma: votos', 'Stimmen': 'Votos',
        'Anna': 'Ana', 'Ben': 'Bruno', 'Cem': 'Carla', 'Dana': 'Diogo',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Altura de um girassol, medida todas as semanas',
        'Säulendiagramm': 'Gráfico de barras', 'Liniendiagramm': 'Gráfico de linhas', 'Kreisdiagramm': 'Gráfico circular', 'Diagramm': 'Gráfico',
        'Woche': 'Semana', 'Winkel': 'Ângulo', 'weniger': 'menos', 'mehr': 'mais',
        'Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.':
            'Um gráfico de linhas não serve aqui: as categorias não têm ordem, e entre elas não há valores intermédios.',
        'Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.':
            'Um gráfico circular não serve aqui: mostra partes de um todo. As alturas das várias semanas, somadas, não formam um todo com sentido.',
        'Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.': 'O gráfico de linhas serve: mostra como um valor varia ao longo do tempo.',
        // schraegbild7 (Zweitafelbild: dupla projeção ortogonal, Aufriss / Grundriss: projeção frontal / horizontal, Rissachse: eixo x12,
        // Ordnungslinie: linha de chamada, wahre Länge: verdadeira grandeza; the points keep P′ and P″)
        'Körper': 'Sólido', 'Schrägbild': 'Perspetiva cavaleira', 'Zweitafelbild': 'Dupla projeção', 'Wahre Länge': 'Verdadeira grandeza', 'Darstellung': 'Representação',
        'Kante $b$': 'Aresta $b$', 'Deckkante $b$': 'Aresta superior $b$', 'Breite $b$': 'Largura $b$', 'Grundkante $a$': 'Aresta da base $a$', 'Höhe $h$': 'Altura $h$',
        'AUFRISS': 'FRONTAL', 'GRUNDRISS': 'HORIZONTAL', '$\\overline{SB}$': '$[SB]$', '$\\overline{S\'\'B_0\'\'}$': '$[S\'\'B_0\'\']$',
        // faltnetz7
        'Falten': 'Dobrar', '▶ Zusammenfalten': '▶ Dobrar', '◀ Auffalten': '◀ Desdobrar', 'Ein Netz faltet sich zu einem Körper': 'Uma planificação dobra-se e forma um sólido',
        // schraegbild7 with data-calc: the materials (the formulas get the Portuguese letters by a rule below)
        'Stoff': 'Material', 'Fichtenholz': 'Madeira de abeto', 'Glas': 'Vidro', 'Stahl': 'Aço',
        // drittel7
        'Zusammenschieben': 'Juntar', '▶ Zusammenschieben': '▶ Juntar', '◀ Auseinander': '◀ Separar',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Três pirâmides iguais formam um cubo',
        'Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.':
            'O cubo tem aresta $a$. As três pirâmides têm o vértice no mesmo vértice do cubo. Cada uma tem como base um quadrado de área $A_b = a^2$ e altura $h = a$.',
        'Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also':
            'Três pirâmides iguais enchem o cubo: $3 \\times V_{\\text{pirâmide}} = a^3$, portanto',
        '$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$': '$V_{\\text{pirâmide}} = \\tfrac13 \\times a^2 \\times a = \\tfrac13 \\times A_b \\times h$',
        // eckenwinkel7 (regular polygons around one vertex)
        'Dreiecke': 'Triângulos', 'Quadrate': 'Quadrados', 'Fünfecke': 'Pentágonos', 'Sechsecke': 'Hexágonos', 'Vieleck': 'Polígono', 'Anzahl an der Ecke': 'Número no vértice', 'flach': 'plano',
        'Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.':
            'Exatamente $360^\\circ$: os polígonos ficam assentes no plano, como um pavimento. Não se forma nenhum vértice de um sólido.',
        'Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.': 'Mais de $360^\\circ$: os polígonos sobrepõem-se. Assim não se consegue dobrar um vértice.',
        'Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.':
            'Colunas: quantos polígonos há num vértice. Exatamente cinco casas têm um visto: há exatamente cinco sólidos platónicos.',
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy7/*)
        // book pt-11 mathegy7-pt:
        // kreisgerade7 (the label of the line follows an arrow; "$ lang." after the chord is cut by a rule below)
        ['$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ', '$r = 3\\,\\text{cm}$ · distância da reta ao centro: $d \\approx '],
        ['$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine ', '$d > r$: a reta não tem <b>nenhum</b> ponto em comum com a circunferência → '],
        ['$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine ',
            '$d = r$: a reta tem <b>exatamente um</b> ponto em comum com a circunferência, o ponto de tangência $B$ → '],
        ['. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.', '. O raio $[MB]$ é perpendicular à tangente.'],
        ['$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine ', '$d < r$: a reta corta a circunferência em <b>dois</b> pontos, $S_1$ e $S_2$ → '],
        ['. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $', '. O segmento $[S_1S_2]$ é uma <b>corda</b>, aqui com cerca de $'],
        [' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.', ' A secante passa por $M$: a corda é um diâmetro.'],
        // kreiswinkel7: the proof ideas, one piece per line of the widget source
        ['Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ',
            'Ideia da demonstração: o diâmetro que passa por $P$ divide a figura em triângulos isósceles com o vértice $M$ oposto à base. '],
        ['An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.',
            'Em cada um, o ângulo externo em $M$ é o dobro de um ângulo da base. Se $M$ não estiver entre os lados do ângulo, a demonstração precisa de uma análise de casos.'],
        ['Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ',
            'Ideia da demonstração: os quatro raios dividem o quadrilátero em quatro triângulos isósceles. Cada ângulo do quadrilátero é formado por dois ângulos da base. '],
        ['$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ',
            '$\\alpha + \\gamma$ contém cada um dos quatro ângulos da base diferentes exatamente uma vez, e $\\beta + \\delta$ também. As duas somas são, portanto, iguais; juntas dão $360^\\circ$, cada uma $180^\\circ$. '],
        ['(So einfach geht es, wenn $M$ im Viereck liegt.)', '(É assim tão simples quando $M$ está dentro do quadrilátero.)'],
        // kreiswinkel7: the theorems start with their name in bold (a word key cannot start with <b>)
        ['<b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.',
            '<b>Teorema de Tales:</b> se $C$ está na circunferência de diâmetro $[AB]$, então o ângulo em $C$ é reto.'],
        ['<b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ',
            '<b>Ângulo ao centro e ângulo inscrito:</b> o ângulo ao centro é o dobro de qualquer ângulo inscrito que abrange o mesmo arco. '],
        ['<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.',
            '<b>Ângulos inscritos:</b> todos os ângulos inscritos que abrangem o mesmo arco têm a mesma amplitude. Arrasta $P$ ao longo do seu arco.'],
        ['<b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.',
            '<b>Ângulos opostos de um quadrilátero inscrito:</b> num quadrilátero cujos vértices estão sobre uma circunferência, os ângulos opostos são suplementares: somam $180^\\circ$.'],
        // konstruktion7: the warning after "$\alpha + \beta = 190^\circ$"
        [': Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.',
            ': os lados livres não se cortam. Não existe um triângulo assim, porque a soma dos ângulos internos de um triângulo é $180^\\circ$.'],
        // zahlengerade7: order, distance, and adding as a move
        ['b$, denn $', 'b$, porque $'], [' liegt weiter <b>links</b>.', ' está mais à <b>esquerda</b>.'], ['Abstand von $a$ und $b$: $', 'Distância entre $a$ e $b$: $'],
        ['Start bei $', 'Partida em $'], ['$, dann $', '$, depois $'], ['nach <b>rechts</b>', 'para a <b>direita</b>'], ['nach <b>links</b>', 'para a <b>esquerda</b>'],
        ['$ gar nicht.', '$: não se mexe.'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Subtrair um número é <b>adicionar o seu simétrico</b>. '],
        ['Minus mal minus: Wer $', 'Menos vezes menos: quem subtrai $'], ['$ abzieht, geht nach rechts.', '$ vai para a direita.'],
        // zahlbereiche7: why a number belongs to its set, the hint and the set operations (after the ℕ₀ rule)
        ['<b>Richtig!</b> $', '<b>Certo!</b> $'], ['eine natürliche Zahl', 'um número natural'], [', also natürlich', ', portanto natural'],
        ['der Betrag von $-4$ ist $4$', 'o valor absoluto de $-4$ é $4$'], ['ganz und negativ', 'inteiro e negativo'], ['ein Bruch ohne Minuszeichen', 'uma fração sem sinal menos'],
        ['zwischen 2 und 3, nicht ganz', 'entre 2 e 3, não é inteiro'], ['negativ und nicht ganz', 'negativo e não inteiro'],
        ['Noch nicht. Tipp: ', 'Ainda não. Dica: '], ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', 'O número tem sinal menos depois de o calculares?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Calcula primeiro o número. É inteiro?'],
        ['<b>Teilmenge:</b> $\\mathbb{N}_0 \\subset \\mathbb{Z}$, $\\mathbb{N}_0 \\subset \\mathbb{Q}_0^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}_0^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}_0$.',
            '<b>Subconjunto:</b> $\\mathbb{N}_0 \\subset \\mathbb{Z}$, $\\mathbb{N}_0 \\subset \\mathbb{Q}_0^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ e $\\mathbb{Q}_0^+ \\subset \\mathbb{Q}$. Todo o número de $\\mathbb{N}_0$ é também um número inteiro, mas não o contrário: $-3 \\in \\mathbb{Z}$, mas $-3 \\notin \\mathbb{N}_0$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}_0^+ = \\mathbb{N}_0$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Interseção:</b> $\\mathbb{Z} \\cap \\mathbb{Q}_0^+ = \\mathbb{N}_0$. São os números que estão nos dois conjuntos: inteiros <b>e</b> sem sinal menos.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}_0^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Reunião:</b> $\\mathbb{Z} \\cup \\mathbb{Q}_0^+$ contém todos os números que estão em pelo menos um dos dois conjuntos. Ainda não é todo o $\\mathbb{Q}$: $-\\tfrac12$ não está em nenhum dos dois.'],
        // umstellen7: the end of the steps and the check with numbers
        ['Fertig. Mit Zahlen: ', 'Pronto. Com números: '], ['. Probe: ', '. Verificação: '], ['Stahl, $\\varrho', 'Aço, $\\varrho'], ['Wasser, $\\varrho', 'Água, $\\varrho'],
        // prozent7: the bars, the check, the way back
        ['vorher ', 'antes '], ['nachher ', 'depois '], ['zurück ', 'de volta '], ['Probe: $', 'Verificação: $'],
        ['Zurückrechnen auf den Grundwert: $', 'Voltar ao valor de referência: $'],
        [' der alte Wert! Die zweiten $', ' o valor antigo! Os segundos $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ referem-se a outro valor de referência.'],
        // diagramm7: the chart title in bold above the table (a part that starts with <b> is no word)
        ['Wie kommst du zur Schule? Umfrage in einer Klasse', 'Como vens para a escola? Inquérito numa turma'],
        ['Klassensprecherwahl: Stimmen', 'Eleição do delegado de turma: votos'], ['Höhe einer Sonnenblume, jede Woche gemessen', 'Altura de um girassol, medida todas as semanas'],
        // schraegbild7: the counts under the name of the solid, the three representations
        [' · Ecken $', ' · vértices $'], ['$ · Kanten $', '$ · arestas $'], ['$ · Flächen $', '$ · faces $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Perspetiva cavaleira:</b> as arestas que vão para trás desenham-se a $45^\\circ$ e reduzidas a <b>metade</b>. Todas as outras arestas ficam em verdadeira grandeza. As arestas invisíveis desenham-se a tracejado.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Projeção frontal</b> (em cima): o sólido visto de frente. <b>Projeção horizontal</b> (em baixo): visto de cima. As duas projeções de um ponto estão numa <b>linha de chamada</b>, perpendicular ao eixo $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notação: $A\'$ na projeção horizontal, $A\'\'$ na projeção frontal.'],
        ['Die Seitenkante ', 'A aresta lateral '],
        [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' é oblíqua no espaço. Nas duas projeções aparece <b>encurtada</b>. Roda-a na projeção horizontal em torno de $S\'$, até ficar paralela ao eixo $x_{12}$: $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'A linha de chamada leva a $B_0\'\'$. O segmento '], [' zeigt die <b>wahre Länge</b>.', ' mostra a <b>verdadeira grandeza</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Medido: $\\overline{SB} \\approx '],
        // faltnetz7: Euler with the Portuguese letters V, A, F (vértices, arestas, faces)
        ['Ecken $e = ', 'Vértices $V = '], ['$ · Kanten $k = ', '$ · arestas $A = '], ['$ · Flächen $f = ', '$ · faces $F = '],
        // schraegbild7 with data-calc (h_s stays: the height of a lateral face, o apótema)
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ é a altura de uma face lateral (o apótema), aqui medida: $h_s \\approx '],
        ['$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$: completa o tronco até à pirâmide inteira (altura $'], ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) e subtrai a pirâmide pequena do topo.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'As quatro faces laterais são trapézios de altura $h_s \\approx '],
        // eckenwinkel7 ("So ist das <b>Ikosaeder</b> gebaut." is a rule)
        ['Jeder Innenwinkel: $', 'Cada ângulo interno: $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · no vértice: $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. ', 'Menos de $360^\\circ$: fechando o espaço vazio, forma-se um vértice no espaço. '],
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // Portuguese school notation (Doc, 26.10.2026: always the local conventions), as js/buch-pt/gy6.js: ℕ starts at 1 in Portugal,
        // so the German ℕ (with 0) is ℕ₀ and the German ℚ⁺ (with 0) is ℚ₀⁺ (números racionais não negativos), also in the SVG labels
        [/\\mathbb\{N\}(?!_)/g, '\\mathbb{N}_0'], [/\\mathbb\{Q\}\^\+/g, '\\mathbb{Q}_0^+'],
        [/>ℕ<\/text>/g, '>ℕ₀</text>'], [/>ℚ⁺<\/text>/g, '>ℚ₀⁺</text>'],
        [/>ℕ ⊂ ℤ, ℕ ⊂ ℚ⁺</g, '>ℕ₀ ⊂ ℤ, ℕ₀ ⊂ ℚ₀⁺<'],
        // an angle by three points is written with a hat on the vertex: ∠APB → A\hat{P}B (tools/buch-pt/glossario.md, mathegy6-pt)
        [/\\angle ([A-Z](?:_\d)?)([A-Z])(_\d)?([A-Z](?:_\d)?)/g, (m, a, v, i, c) => a + '\\hat{' + v + '}' + (i || '') + c],
        // book pt-11 mathegy7-pt:
        // dreieckkreise7: "Die drei <span>Mittelsenkrechten</span> schneiden sich …" - lower case inside the sentence; a rule, because
        // the word 'Mittelsenkrechten' is the button label "Mediatrizes" of GY 6; the aria label "Kreis" of the switch (gy6: "Círculo")
        [/(<span class="g-cy">)Mittelsenkrechten(?=<\/span>)/g, '$1mediatrizes'], [/^Kreis$/, 'Circunferência'],
        // kreisgerade7: "… ist eine <b>Sehne</b>, hier etwa $4,8 cm$ lang." - the Portuguese has no "lang" at the end
        [/(ist eine <b>Sehne<\/b>, hier etwa \$[^$]+)\$ lang\./g, '$1$.'],
        // dreieckkreise7: the circumcentre is O (German U), in the picture and in the formula of the radius
        [/(<text class="g-pt"[^>]*>)U(<\/text>)/g, '$1O$2'],
        [/\\overline\{UA\} = \\overline\{UB\} = \\overline\{UC\}/g, '\\overline{OA} = \\overline{OB} = \\overline{OC}'],
        // "Würfel" is a die in other books (js/buch-pt/stochastik.js, gy6.js): here it is always the cube, as a whole label and between two tags
        [/^Würfel$/, 'Cubo'], [/>Würfel</g, '>Cubo<'],
        // konstruktion7: "SCHRITT 2 VON 5"; the circle k is 𝒞 and the auxiliary circle h is 𝒞′ in the picture (only the labels drawn with
        // the class first: the height h of schraegbild7 carries its colour before the class and stays)
        [/SCHRITT (\d+) VON (\d+)/g, 'PASSO $1 DE $2'],
        // the step buttons of konstruktion7, umstellen7 and vorzeichen7 (rows that do not wrap: short labels; gy6.js and bgy13lk.js have
        // longer words for them)
        [/(<button type="button" class="b-btn" data-k="all">)Alle Schritte(<\/button>)/g, '$1Tudo$2'],
        [/(<button type="button" class="b-btn" data-k="(?:0|reset)">)Von vorn(<\/button>)/g, '$1Início$2'],
        [/(<text class="g-side"[^>]*>)k(<\/text>)/g, '$1𝒞$2'], [/(<text class="g-side"[^>]*>)h(<\/text>)/g, '$1𝒞′$2'],
        // zahlbereiche7: "Richtig: 3 von 5" as in js/buch-pt/zahlen.js
        [/Richtig: (\d+) von (\d+)/g, 'Certas: $1 de $2'],
        // vorzeichen7: "Von Zeile zu Zeile wird das Ergebnis um 3 kleiner. Damit das Muster weitergeht, muss $3 \times (-1) = -3$ sein."
        [/Von Zeile zu Zeile wird das Ergebnis um 3 (kleiner|größer)\. Damit das Muster weitergeht, muss \$([^$]+)\$ sein\./g,
            (m, w, f) => 'De linha para linha, o resultado ' + (w === 'kleiner' ? 'diminui' : 'aumenta') + ' 3. Para o padrão continuar, tem de ser $' + f + '$.'],
        // umstellen7: the instruction, and the Portuguese letters in every formula of the output (u → P, s → d, G → A_b)
        [/^<p class="b-help" style="margin:0 0 4px">Die Formel \$([^$]+)\$ nach \$([^$]+)\$ umstellen: auf <b>beiden<\/b> Seiten dasselbe tun, bis \$[^$]+\$ allein steht\.<\/p>([\s\S]*)$/,
            (m, f, v, rest) => {
                const map = /^u = /.test(f) ? [/\bu\b/g, 'P'] : /^v = \\dfrac\{s\}/.test(f) ? [/\bs\b/g, 'd'] : /\\tfrac13 \\times G/.test(f) ? [/\bG\b/g, 'A_b'] : null;
                const fix = t => map ? t.replace(/\$[^$]*\$/g, x => x.replace(map[0], map[1])) : t;
                return '<p class="b-help" style="margin:0 0 4px">' + fix('Resolve a fórmula $' + f + '$ em ordem a $' + v + '$: faz o mesmo nos <b>dois</b> membros, até $' + v + '$ ficar sozinho.') + '</p>' + fix(rest);
            }],
        // umstellen7: the buttons "nach $b$" after the label "em ordem a" (s and G of the formulas are d and A_b), the formula "Dichte"
        [/(<button type="button" data-v="([A-Za-z])">)nach \$\2\$(<\/button>)/g, (m, a, v, c) => a + '$' + ({ s: 'd', G: 'A_b' }[v] || v) + '$' + c],
        [/(<button type="button" data-v="4">)Dichte(<\/button>)/g, '$1Massa volúmica$2'],
        // prozent7: the hundred square, the values, increase "um" / "auf", the way back
        [/(\d+) von 100 Feldern/g, '$1 de 100 quadrículas'],
        [/^Hunderterfeld mit (\d+) gefärbten Feldern( und Prozentstreifen)?$/, (m, n, s) => 'Quadrado de cem quadrículas com ' + n + ' pintadas' + (s ? ' e faixa de percentagem' : '')],
        [/Grundwert \$G = ([^$]+)\$ · Prozentsatz \$p\\,\\% = ([^$]+)\$/g, 'Valor de referência $G = $1$ · percentagem $p\\,\\% = $2$'],
        [/Prozentwert (<span class="g-lam">)\$W = (\d+)\\,\\% \\text\{ von \} /g, 'Valor da percentagem $1$W = $2\\,\\% \\text{ de } '],
        [/(Steigerung|Senkung) um \$(\d+)\\,\\%\$ heißt (?:Steigerung|Senkung) <b>auf<\/b> \$(\d+)\\,\\%\$\. Der Faktor ist \$/g,
            (m, k, a, b) => (k === 'Steigerung' ? 'Um aumento de' : 'Uma diminuição de') + ' $' + a + '\\,\\%$ significa passar <b>para</b> $' + b + '\\,\\%$. O fator é $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen): /g, (m, p, v) => 'Depois ' + (v === 'senken' ? 'diminuir' : 'aumentar') + ' $' + p + '\\,\\%$: '],
        // diagramm7: the column "Anteil" holds percentages (gy6.js has the word "Fração" for its pie chart), the aria "<title> als
        // Säulendiagramm" and the line under the table
        [/<th>Anteil<\/th>/g, '<th>Percentagem</th>'],
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({ Säulendiagramm: 'Gráfico de barras', Liniendiagramm: 'Gráfico de linhas',
            Kreisdiagramm: 'Gráfico circular' }[c]) + ': ' + ({ 'Wie kommst du zur Schule? Umfrage in einer Klasse': 'como vens para a escola? Inquérito numa turma',
            'Klassensprecherwahl: Stimmen': 'eleição do delegado de turma, votos', 'Höhe einer Sonnenblume, jede Woche gemessen': 'altura de um girassol, medida todas as semanas' }[t] || t)],
        [/Zusammen: (\d+) (Antworten|Stimmen) = 100 % = 360°\. Im Kreisdiagramm gehören zu 1 % genau 3,6°\./g,
            (m, n, u) => 'Total: ' + n + (u === 'Antworten' ? ' respostas' : ' votos') + ' = 100 % = 360°. No gráfico circular, a 1 % correspondem exatamente 3,6°.'],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({ 'Würfel': 'Cubo', 'Quader': 'Paralelepípedo', 'Dreiecksprisma': 'Prisma triangular', 'Sechseckprisma': 'Prisma hexagonal',
            'Quadratische Pyramide': 'Pirâmide quadrangular', 'Dreieckspyramide': 'Pirâmide triangular', 'Pyramidenstumpf': 'Tronco de pirâmide' }[b] || b) +
            (v === 'Schrägbild' ? ' em perspetiva cavaleira' : ' em dupla projeção ortogonal (projeções frontal e horizontal)')],
        // faltnetz7: "6 Vierecke", "1 Viereck, 4 Dreiecke" after the name, Euler's V − A + F, the sentence about the regular solids
        [/(\d+) (Dreiecke?|Vierecke?|Fünfecke?|Sechsecke?)(?=, |<\/p>)/g, (m, n, w) => n + ' ' + ({ 'Dreieck': 'triângulo', 'Dreiecke': 'triângulos', 'Viereck': 'quadrilátero',
            'Vierecke': 'quadriláteros', 'Fünfeck': 'pentágono', 'Fünfecke': 'pentágonos', 'Sechseck': 'hexágono', 'Sechsecke': 'hexágonos' }[w])],
        [/\$e - k \+ f = /g, '$V - A + F = '],
        [/Alle Flächen sind gleiche regelmäßige (Dreiecke|Vierecke|Fünfecke|Sechsecke), an jeder Ecke stoßen (\d+) zusammen\./g, (m, w, n) => 'Todas as faces são ' +
            { 'Dreiecke': 'triângulos equiláteros', 'Vierecke': 'quadrados', 'Fünfecke': 'pentágonos regulares', 'Sechsecke': 'hexágonos regulares' }[w] + ' iguais; em cada vértice juntam-se ' + n + '.'],
        // schraegbild7 with data-calc (the output ends with "Masse aus …"): the Portuguese letters in its formulas - área da base A_b (German G),
        // área lateral A_L (M), área total A (O), perímetro da base P_b (u); V_groß, V_klein; then the material of the mass
        [/[\s\S]*Masse aus [\s\S]*/, s => s.replace(/\$[^$]*\$/g, x => x.replace(/\\text\{groß\}/g, '\\text{grande}').replace(/\\text\{klein\}/g, '\\text{pequena}')
            .replace(/(?<![A-Za-z\\_])G(?![A-Za-z])/g, 'A_b').replace(/(?<![A-Za-z\\_])M(?![A-Za-z])/g, 'A_L').replace(/(?<![A-Za-z\\_])O(?![A-Za-z])/g, 'A')
            .replace(/(?<![A-Za-z\\_])u(?![A-Za-z])/g, 'P_b'))],
        [/Masse aus (Fichtenholz|Glas|Stahl) \(/g, (m, s) => 'Massa, se for de ' + { 'Fichtenholz': 'madeira de abeto', 'Glas': 'vidro', 'Stahl': 'aço' }[s] + ' ('],
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." (the cube may already be "Cubo" from the rule above), the gap, the aria
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'É assim que se forma o <b>' + ({ 'Tetraeder': 'tetraedro', 'Würfel': 'cubo',
            'Cubo': 'cubo', 'Oktaeder': 'octaedro', 'Dodekaeder': 'dodecaedro', 'Ikosaeder': 'icosaedro' }[s] || s) + '</b>.'],
        [/>Lücke (\d+)°</g, '>Espaço $1°<'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, (m, n, k) => n + ' polígonos regulares de ' + k + ' lados num vértice'],
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
    ]
});
