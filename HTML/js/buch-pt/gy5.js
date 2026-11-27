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
        // Portuguese school notation of the 2.º ciclo (as GY 6, pt-10): × for the product (the plain-text rule is in os5.js),
        // P for the perimeter (German u), A for the total area of a cuboid (German O), the centre of a rotation O (German Z),
        // place values C D U in every class, UM C D U , d c m around the comma (quadro de ordens e classes)
        'Zahl': 'Número',
        // stellenwert5
        'MRD.': 'MIL MILH.', 'MILLIONEN': 'MILHÕES', 'TAUSENDER': 'MILHARES', 'EINER': 'UNIDADES',
        'Zufallszahl': 'Número aleatório', 'Alles auf 0': 'Tudo a 0', 'plus': 'mais', 'minus': 'menos',
        'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.':
            'Toca em ▲ ou ▼ para mudar um algarismo. Cada ordem vale dez vezes mais do que a ordem imediatamente à sua direita.',
        'Eine natürliche Zahl, keine Stelle nach dem Komma.': 'Um número natural, sem casas decimais.',
        // zahlenstrahl5: arredondar às dezenas, … (por excesso / por defeito)
        'Zehner': 'Dezenas', 'Hunderter': 'Centenas', 'Tausender': 'Milhares', 'Zehntausender': 'Dezenas de milhar',
        'Hunderttausender': 'Centenas de milhar', 'Millionen': 'Milhões', 'Runden auf': 'Arredondar', 'Neue Zahl': 'Novo número', 'Mitte': 'Meio',
        'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.':
            'Arrasta o ponto. Se estiver exatamente no meio ou à direita dele, arredonda-se por excesso; senão, por defeito.',
        // sieb5
        'Nächster Schritt': 'Próximo passo', 'Von vorn': 'Do início',
        'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.': 'Toca num número: vês todos os seus divisores e a sua decomposição em fatores primos.',
        'Starte das Sieb mit „Nächster Schritt“.': 'Começa o crivo com «Próximo passo».',
        'Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.': 'O 1 <b>não é um número primo</b>: tem um único divisor.',
        'Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.': 'O 2 é o primeiro número primo. Todos os seus múltiplos 4, 6, 8, … estão riscados.',
        'Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.': 'O 3 é o número primo seguinte. Os seus múltiplos 6, 9, 12, … estão riscados.',
        'Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …': 'O 5 é o número primo seguinte. Riscados: 10, 15, 20, …',
        'Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.': 'O 7 é o número primo seguinte. Novos riscados: 49, 77, 91 e os outros múltiplos.',
        'Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.':
            'Terminado! O número seguinte seria o 11, mas 11 × 11 = 121 já é maior do que 100. Todos os números que restam são <b>números primos</b>: são 25.',
        'Die 1 hat nur sich selbst als Teiler.': 'O 1 só tem o próprio 1 como divisor.',
        'Zerlegung in Primfaktoren': 'Decomposição em fatores primos',
        // bruch5: fração própria / imprópria, numeral misto; "erweitern" = multiplicar os dois termos (glossary, GY 6)
        'Kreis': 'Círculo', 'Rechteck': 'Retângulo', 'Streifen': 'Tira', 'Bild': 'Representação', 'Zähler': 'Numerador', 'Nenner': 'Denominador',
        'weniger': 'menos', 'mehr': 'mais', 'Erweitern mit 2': 'Termos × 2', 'mit 3': '× 3', 'Kürzen': 'Simplificar',
        // bruchstrahl5
        'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
            'Escreve frações como 3/4 ou números decimais como 0,7, também números maiores do que 1, até 3.',
        'Zahlenstrahl mit zwei Zahlen': 'Reta numérica com dois números',
        'Zahl A': 'Número A', 'Zahl B': 'Número B',
        'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Escreve dois números entre 0 e 3, por exemplo 3/4 ou 0,7.',
        // winkel5: amplitude, lado, ângulo nulo / agudo / reto / obtuso / raso / côncavo / giro (the rules below)
        'Messen': 'Medir', 'Schätzen': 'Estimar', 'Modus': 'Modo', 'Deine Schätzung': 'A tua estimativa', 'Schätzung in Grad': 'Estimativa em graus',
        'Neuer Winkel': 'Novo ângulo', 'Bitte eine Zahl eingeben.': 'Escreve um número.', 'Ausgezeichnet': 'Excelente',
        'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.':
            'Arrasta a extremidade do segundo lado. Mede-se no sentido contrário ao dos ponteiros do relógio, a partir do lado horizontal.',
        'Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.': 'Qual é a amplitude deste ângulo? Estima sem medir e toca em «Verificar».',
        // spiegel5: reflexão axial, eixo de reflexão, translação, rotação de centro O ("schräg" is a rule below: vektoren has «oblíquos»)
        'Spiegelung': 'Reflexão', 'Verschiebung': 'Translação', 'Drehung': 'Rotação', 'Rätsel': 'Enigma', 'Bewegung': 'Movimento',
        'Achse senkrecht': 'Eixo vertical', 'waagerecht': 'horizontal', 'Achse': 'Eixo', 'Drehwinkel': 'Amplitude da rotação',
        'Neues Rätsel': 'Novo enigma',
        'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.':
            'Arrasta o eixo de reflexão. Cada ponto imagem está na perpendicular ao eixo, à mesma distância dele.',
        'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.': 'Arrasta a ponta da seta: cada ponto desloca-se segundo a mesma seta.',
        'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.':
            'Escolhe a amplitude da rotação. Roda-se no sentido contrário ao dos ponteiros do relógio, em torno do ponto O.',
        'Welche Bewegung bringt die gelbe Figur auf die grüne?': 'Que movimento leva a figura amarela até à verde?',
        'Figur und Bildfigur im Koordinatensystem': 'Figura e figura imagem no referencial',
        'Tippe auf deine Antwort.': 'Toca na tua resposta.',
        'Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.':
            'A figura imagem tem o mesmo tamanho, mas está <b>virada ao contrário</b>: o sentido A → B → C → D inverte-se.',
        'Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.': 'Cada ponto fica à mesma distância de O. A figura não fica virada ao contrário.',
        // rechteck5
        'Zusammengesetzte Figur': 'Figura composta', 'Figur': 'Figura', 'Zerlegen': 'Decompor', 'Ergänzen': 'Completar', 'Weg': 'Método',
        'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.':
            'Arrasta o vértice. Cada quadrícula tem 1 cm de comprimento e 1 cm de largura; a sua área é, portanto, 1 cm².',
        'Ein Quadrat: alle vier Seiten gleich lang.': 'Um quadrado: os quatro lados têm o mesmo comprimento.',
        'Zerlegen in zwei Rechtecke:': 'Decompor em dois retângulos:',
        'Zum großen Rechteck ergänzen und das fehlende Stück abziehen:': 'Completar até formar um retângulo grande e subtrair a parte que falta:',
        'Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.':
            'Surpreendente: o perímetro é igual ao do retângulo inteiro, porque o degrau tem o mesmo comprimento que os lados que faltam.',
        // quader5: paralelepípedo, perspetiva cavaleira, planificação, cubos unitários; the faces of the net
        'Schrägbild': 'Perspetiva cavaleira', 'Netz': 'Planificação', 'Einheitswürfel': 'Cubos unitários', 'Ansicht': 'Vista',
        'Länge a (cm)': 'Comprimento a (cm)', 'Breite b (cm)': 'Largura b (cm)', 'Höhe c (cm)': 'Altura c (cm)',
        'hinten': 'trás', 'oben': 'cima', 'vorn': 'frente', 'unten': 'baixo', 'links': 'esquerda', 'rechts': 'direita',
        'Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.': 'As faces opostas têm a mesma cor: têm a mesma área.',
        'Alle Kanten gleich lang: ein Würfel.': 'Todas as arestas têm o mesmo comprimento: é um cubo.',
        // einheiten5: the day stays d (dia)
        'Länge': 'Comprimento', 'Masse': 'Massa', 'Zeit': 'Tempo', 'Fläche': 'Área', 'Volumen': 'Volume', 'Größe': 'Grandeza',
        'Wert': 'Valor', 'von Einheit': 'unidade de partida', 'in Einheit': 'unidade de chegada', 'in': 'para',
        'Bitte eine Zahl eingeben, zum Beispiel 3,5.': 'Escreve um número, por exemplo 3,5.',
        'Gleiche Einheit, nichts zu tun.': 'A mesma unidade: não há nada a fazer.',
        // zahlschrift5
        'Ägypten': 'Egito', 'Rom': 'Roma', 'Maya': 'Maias', 'Zweiersystem': 'Binário', 'Zahlschrift': 'Numeração',
        'eins weniger': 'menos um', 'eins mehr': 'mais um',
        // komma5 (the button "Neu" is pt-15's «Recomeçar»: it resets the number, as the "Neu" of hanoios6 and nimos6)
        'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
            'Ao multiplicar por 10, cada algarismo avança uma ordem para a esquerda; ao dividir, para a direita. Diz-se, abreviando: a vírgula desloca-se.',
        'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'impossível: os algarismos sairiam do quadro.',
        // mittel5
        'Ausgleichen': 'Igualar', 'Neue Werte': 'Novos valores', 'Säulen mit dem Mittelwert': 'Barras com a média',
        'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
            'Arrasta as barras para cima ou para baixo. «Igualar» distribui tudo de forma justa: cada barra fica com o mesmo.',
        // koord5: referencial, pontos A(2, 3)
        'Geraden ein/aus': 'Retas sim/não', 'Finde den Punkt': 'Encontra o ponto', 'Koordinatensystem mit vier Punkten': 'Referencial com quatro pontos',
        'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).':
            'Arrasta os pontos. Encaixam nos pontos da quadrícula. Primeiro para a direita (x), depois para cima (y).',
        'g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.': 'g ∥ h: as retas são <b>paralelas</b>, nunca se intersetam.',
        'g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.': 'g ⊥ h: as retas são <b>perpendiculares</b>.',
        'g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.':
            'g e h não são paralelas nem perpendiculares. Tenta pô-las paralelas ou perpendiculares.',
        // symmetrie5 (the button "Leeren" is a rule below: gy11lk-stoch has «Esvaziar» for the urn)
        'Achse waagerecht': 'Eixo horizontal', 'zwei Achsen': 'dois eixos', 'Punkt': 'Ponto', 'Symmetrie': 'Simetria', 'Beispiel': 'Exemplo',
        'Muster-Werkstatt': 'Oficina de padrões',
        'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.':
            'Toca nas quadrículas para as pintar. As quadrículas simétricas pintam-se sozinhas.',
        // linien5: tábua de linhas, fichas de cálculo (Adam Ries)
        'erste Zahl': 'primeiro número', 'zweite Zahl': 'segundo número',
        'Legen': 'Colocar', 'Dazulegen': 'Juntar', 'Bündeln': 'Agrupar', 'Alles bündeln': 'Agrupar tudo',
        'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.':
            'Cinco fichas numa linha passam a ser uma ficha no espaço de cima; duas fichas num espaço passam a ser uma na linha seguinte. Era assim que se calculava há 500 anos.',
        'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.': 'Tudo agrupado. Agora já se pode ler o resultado.',
        'Rot markiert: Hier muss noch gebündelt werden.': 'Marcado a vermelho: aqui ainda é preciso agrupar.',
        'Linienbrett mit Rechenpfennigen': 'Tábua de linhas com fichas de cálculo',
        // book pt-15 mathe6-pt:
        // merge os5-os8-pt (27.11.2026): one Portuguese per German string - bruch5, bruchstrahl5, komma5, mittel5, rechteck5 and
        // quader5 are translated once, in pt-14 above (the lower block; "Mittelwert" is its phrase, the buttons of bruch5 are
        // «Termos × 2», «× 3»); only the reset button of komma5 is this block's «Recomeçar»
        // komma5 (chapter 1.2): "Neu" resets to the start value (hanoios6 and nimos6 have the same reset button)
        'Neu': 'Recomeçar',
        // winkelpaare5 (chapter 3.1): verticalmente opostos, suplementares (adjacentes), correspondentes, alternos internos (glossary pt-10)
        'Scheitelwinkel': 'Verticalmente opostos', 'Nebenwinkel': 'Suplementares', 'Stufenwinkel': 'Correspondentes', 'Wechselwinkel': 'Alternos internos',
        'Winkelpaar': 'Par de ângulos', 'Anderes Paar': 'Outro par', 'h kippen': 'Inclinar h',
        'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
            'Arrasta o ponto sobre a reta s para a rodar. Com «Inclinar h», g e h deixam de ser paralelas.',
        'Zwei Geraden g und h, geschnitten von s': 'Duas retas g e h, intersetadas pela secante s',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy5/*)
        // book pt-14 mathe5-pt:
        // stellenwert5 (the number in words is a rule below)
        ['Als Zehnerbruch: ', 'Em fração decimal: '],
        // zahlenstrahl5 (and rundenos5 of js/buch-os5.js)
        ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'Com 5, 6, 7, 8 ou 9, arredonda-se <b>por excesso</b>.'],
        ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'Com 0, 1, 2, 3 ou 4, arredonda-se <b>por defeito</b>.'],
        // bruch5
        ['Null Teile: der Bruch hat den Wert 0.', 'Zero partes: a fração vale 0.'],
        ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Uma <b>fração própria</b>: menos do que a unidade.'],
        ['Genau <b>ein Ganzes</b>.', 'Exatamente <b>a unidade</b>.'],
        ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Uma <b>fração imprópria</b>: mais do que a unidade'],
        [', als gemischte Zahl $', ', em numeral misto $'],
        ['Der Bruch lässt sich nicht weiter kürzen.', 'A fração já não se pode simplificar mais.'],
        ['Als Dezimalzahl: ', 'Em número decimal: '], [' · in Prozent: ', ' · em percentagem: '],
        ['Als Dezimalzahl ungefähr ', 'Em número decimal, aproximadamente '],
        ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.',
            '. O denominador tem um fator primo diferente de 2 e de 5; por isso, a dízima não termina.'],
        // bruchstrahl5
        ['$ und $', '$ e $'], ['Jetzt vergleicht man nur die Zähler: ', 'Agora basta comparar os numeradores: '],
        ['Als Dezimalzahlen: ', 'Em números decimais: '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Mais à direita na reta numérica quer dizer maior.'],
        // winkel5
        ['Deine Schätzung: ', 'A tua estimativa: '],
        // spiegel5
        ['Spiegelachse ', 'Eixo de reflexão '], ['schräg durch ', 'oblíquo, passa por '],
        ['Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.',
            'Dica: se a figura estiver virada ao contrário, é uma reflexão. Se todos os lados apontarem na mesma direção que antes, é uma translação.'],
        // einheiten5
        ['Rechnung: ', 'Cálculo: '],
        ['Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.', 'Desce-se a escada para a unidade mais pequena: o número fica maior, <b>multiplica-se</b>.'],
        ['Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.', 'Sobe-se a escada para a unidade maior: o número fica menor, <b>divide-se</b>.'],
        ['Bei Flächen ist die Umrechnungszahl immer 100.', 'Nas áreas, o fator de conversão é sempre 100.'],
        ['Bei Volumen ist die Umrechnungszahl immer 1000.', 'Nos volumes, o fator de conversão é sempre 1000.'],
        ['Achtung: Bei der Zeit gibt es keine Zehnerschritte.', 'Atenção: no tempo, as unidades não vão de 10 em 10.'],
        // zahlschrift5: the Egyptian signs traço, arco, corda, flor de lótus (as the chapter W)
        ['Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.',
            'Cada símbolo escreve-se tantas vezes quantas forem precisas. A ordem não importa e não é preciso zero. Traço 1, arco 10, corda 100, flor de lótus 1000.'],
        ['I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.',
            'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Se um símbolo menor estiver antes de um maior, subtrai-se: IV = 4, XC = 90, CM = 900.'],
        ['Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.',
            'Os maias contavam de vinte em vinte. Ponto = 1, traço = 5. De baixo para cima, cada nível vale vinte vezes mais. Para um nível vazio tinham um símbolo para o zero: a concha.'],
        ['Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.',
            'No sistema binário só há os algarismos 0 e 1. Cada ordem vale o dobro da que está imediatamente à sua direita. É assim que os computadores calculam.'],
        // mittel5
        ['Mittelwert', 'Média'], ['Summe: ', 'Soma: '], ['Geteilt durch die Anzahl: ', 'A dividir pelo número de valores: '],
        ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'O que estava acima da linha (cinzento, tracejado) preenche exatamente os espaços vazios (amarelo).'],
        // koord5
        ['Getroffen! A liegt auf ', 'Acertaste! A está em '], ['<b>Aufgabe:</b> Zieh A auf den Punkt ', '<b>Tarefa:</b> arrasta A até ao ponto '],
        // quader5
        ['Alle 12 Kanten zusammen: ', 'As 12 arestas juntas: '],
        // book pt-15 mathe6-pt:
        // (merge os5-os8-pt: the lines of bruch5, bruchstrahl5 and mittel5 are pt-14's above, its rule writes the aria labels of bruch5)
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
        // quader5: the sum of the edges with × (mathe6-pt has no os5.js, whose rule turns " · " into " × " on the OS 5 pages)
        ['Alle 12 Kanten zusammen: 4 \\times (a + b + c) = ', 'As 12 arestas juntas: 4 \\times (a + b + c) = '], ['Alle 12 Kanten zusammen: 4 · (a + b + c) = ', 'As 12 arestas juntas: 4 × (a + b + c) = '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-14 mathe5-pt:
        // stellenwert5, the place value table of whole numbers (quadro de ordens e classes): C D U in every class under MIL MILH.,
        // MILHÕES, MILHARES, UNIDADES (the table with a comma, g5-sw-dez, is the pt-15 rule: DM UM C D U d c m)
        [/<table class="g5-sw">[\s\S]*?<\/table>/g, t => {
            const P = { Mrd: 'U', HM: 'C', ZM: 'D', M: 'U', HT: 'C', ZT: 'D', T: 'U', H: 'C', Z: 'D', E: 'U' };
            return t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' + P[k] + '</th>');
        }],
        // stellenwert5: the number in words, read from the number above it, as Portuguese schools write it (long scale:
        // 10^9 mil milhões, 10^12 um bilião); "e" between hundreds, tens and units, and before the last group of three when it is
        // below 100 or a round hundred (mil e duzentos, um milhão e trezentos mil, mil duzentos e trinta); a decimal number is read
        // as the school reads it: 3,047 → três unidades e quarenta e sete milésimas
        ...(() => {
            const U = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze',
                'dezasseis', 'dezassete', 'dezoito', 'dezanove'];
            const T = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
            const H = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
            // feminine (unidades, décimas …): uma, duas, duzentas …
            const fem = s => s.replace(/\bum\b/g, 'uma').replace(/\bdois\b/g, 'duas').replace(/entos\b/g, 'entas');
            const u1000 = n => {
                if (n === 100) return 'cem';
                const h = Math.floor(n / 100), r = n % 100, p = [];
                if (h) p.push(H[h]);
                if (r) p.push(r < 20 ? U[r] : T[Math.floor(r / 10)] + (r % 10 ? ' e ' + U[r % 10] : ''));
                return p.join(' e ');
            };
            const join = parts => parts.map(([w], i) => (i && i === parts.length - 1 && !/^e /.test(w) && (parts[i][1] < 100 || parts[i][1] % 100 === 0) ? 'e ' : '') + w).join(' ');
            const words = n => {
                if (!n) return 'zero';
                const g = [0, 1, 2, 3, 4].map(k => Math.floor(n / Math.pow(1000, k)) % 1000);
                const parts = [];
                if (g[4]) parts.push([g[4] === 1 ? 'um bilião' : u1000(g[4]) + ' biliões', g[4]]);
                if (g[3]) parts.push([(g[3] === 1 ? 'mil' : u1000(g[3]) + ' mil') + (g[2] ? '' : ' milhões'), g[3]]);
                if (g[2]) parts.push([(g[2] === 1 && !g[3] ? 'um milhão' : (g[3] && (g[2] < 100 || g[2] % 100 === 0) ? 'e ' : '') + u1000(g[2]) + ' milhões'), g[2]]);
                if (g[1]) parts.push([g[1] === 1 ? 'mil' : u1000(g[1]) + ' mil', g[1]]);
                if (g[0]) parts.push([u1000(g[0]), g[0]]);
                return join(parts);
            };
            const ORD = ['', 'décima', 'centésima', 'milésima'];
            const num = s => +s.replace(/[\s. ]/g, '');
            const G = '\\d[\\d\\u202f]*';
            return [
                [new RegExp('(<p class="g5-big">)(' + G + ')(</p><p class="g5-word">)[^<]*'), (m, a, n, b) => a + n + b + words(num(n))],
                [new RegExp('(<p class="g5-big">)(' + G + '(?:,\\d+)?)(</p>[\\s\\S]*?<p class="g5-dim">)Gesprochen: [^<]*'), (m, a, n, b) => {
                    const [i, f = ''] = n.split(','), d = f.replace(/0+$/, ''), iv = num(i), fv = d ? +d : 0;
                    const ip = iv ? fem(words(iv)) + (iv === 1 ? ' unidade' : ' unidades') : '';
                    const fp = d ? fem(words(fv)) + ' ' + ORD[d.length] + (fv === 1 ? '' : 's') : '';
                    return a + n + b + 'Lê-se: ' + (ip && fp ? ip + ' e ' + fp : ip || fp || 'zero');
                }],
            ];
        })(),
        [/Das sind (\d+) Stellen\./, 'É um número de $1 algarismos.'], [/Das ist 1 Stelle\./, 'É um número de 1 algarismo.'],
        // zahlenstrahl5
        [/Gerundet auf (Zehner|Hunderter|Tausender|Zehntausender|Hunderttausender|Millionen)\. Entscheidend ist die Ziffer rechts davon: /, (m, p) => 'Arredondamento ' +
            ({ 'Zehner': 'às dezenas', 'Hunderter': 'às centenas', 'Tausender': 'aos milhares', 'Zehntausender': 'às dezenas de milhar',
                'Hunderttausender': 'às centenas de milhar', 'Millionen': 'aos milhões' })[p] + '. O que decide é o algarismo imediatamente à direita: '],
        [/^Zahlenstrahl mit der Zahl (.+) zwischen (.+) und (.+)$/, 'Reta numérica com o número $1 entre $2 e $3'],
        // sieb5
        [/<b>Teiler von (\d+):<\/b> (.*?) \((\d+) Stück\)/, (m, n, l, k) => '<b>Divisores de ' + n + ':</b> ' + l + ' (' + k + (k === '1' ? ' divisor' : ' divisores') + ')'],
        [/(\d+) ist eine Primzahl<\/span>: genau zwei Teiler, 1 und (\d+)\./, '$1 é um número primo</span>: tem exatamente dois divisores, 1 e $2.'],
        // bruch5
        [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'A fração ' + z + '/' + n + ' representada ' +
            ({ 'Kreis': 'num círculo', 'Streifen': 'numa tira', 'Rechteck': 'num retângulo' })[f]],
        [/, genau (\d+) Ganze\./, ', exatamente $1 unidades.'],
        [/Kürzen mit (\d+) ergibt /, 'Simplificando por $1, obtém-se '],
        // bruchstrahl5
        [/Auf denselben Nenner (\d+) gebracht: /, 'Reduzidas ao mesmo denominador $1: '],
        // winkel5: the kinds of angle (ângulo côncavo between 180° and 360°, ângulo giro 360°)
        ...(() => {
            const K = { 'Nullwinkel': 'ângulo nulo', 'spitzer Winkel': 'ângulo agudo', 'rechter Winkel': 'ângulo reto', 'stumpfer Winkel': 'ângulo obtuso',
                'gestreckter Winkel': 'ângulo raso', 'überstumpfer Winkel': 'ângulo côncavo', 'Vollwinkel': 'ângulo giro' };
            const KS = Object.keys(K).join('|');
            return [
                [new RegExp('<p>Ein <b>(' + KS + ')</b>(: )?'), (m, k, c) => '<p>Um <b>' + K[k] + '</b>' + (c ? ': ' : '')],
                [new RegExp('Es ist ein (' + KS + ')\\.'), (m, k) => 'É um ' + K[k] + '.'],
            ];
        })(),
        [/Tipp zum Messen: Miss den Rest bis zum Vollwinkel, (\d+)°, und rechne 360° − (\d+)°\./,
            'Dica para medir: mede o que falta até ao ângulo giro, $1°, e calcula 360° − $2°.'],
        [/, nur (\d+)° daneben!/, ', apenas $1° de diferença!'], [/Gut, (\d+)° daneben\./, 'Bem, $1° de diferença.'],
        [/(\d+)° daneben\. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen\?/, '$1° de diferença. Compara com 90° e 180°: onde fica o ângulo?'],
        [/^Winkel von (\d+) Grad$/, 'Ângulo de $1 graus'],
        // spiegel5: the axis button "schräg" (vektoren has the plural «oblíquos»), the steps of a translation, the centre O
        [/(data-v="schraeg">)schräg(?=<)/g, '$1oblíquo'],
        [/Jeder Punkt wandert (\d+) nach (links|rechts) und (\d+) nach (unten|oben)\./, (m, a, lr, b, du) => 'Cada ponto desloca-se ' + a + ' para a ' +
            (lr === 'links' ? 'esquerda' : 'direita') + ' e ' + b + ' para ' + (du === 'oben' ? 'cima' : 'baixo') + '.'],
        [/Drehung um Z(\([^)]*\)) um (\d+)°\./, 'Rotação de centro O$1 e amplitude $2°.'], [/(<text class="g-pt"[^>]*>)Z(<\/text>)/g, '$1O$2'],
        [/(Richtig, es ist|Nicht ganz\. Es ist) eine (Spiegelung|Verschiebung|Drehung)\./, (m, p, k) => (p[0] === 'R' ? 'Certo, é uma ' : 'Não é bem assim. É uma ') +
            ({ 'Spiegelung': 'reflexão', 'Verschiebung': 'translação', 'Drehung': 'rotação' })[k] + '.'],
        // rechteck5: P for the perimeter (German u, Umfang); the aria label, "$u = 2 × a + 2 × b = …" and the products are pt-15's
        // rules below (narrow: a bare "$u = " / "$O = " also met prisma6 of gy6 and the circle of geometrie on the OS 6 pages)
        [/Das ist 1 Reihe mit (\d+) Kästchen\./, (m, k) => 'É 1 fila com ' + k + (k === '1' ? ' quadrícula.' : ' quadrículas.')],
        [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, (m, r, k) => 'São ' + r + ' filas com ' + k + (k === '1' ? ' quadrícula' : ' quadrículas') + ' cada uma.'],
        [/<p>Zusammen (\d+) cm²/, '<p>No total, $1 cm²'],
        [/(<p class="g5-big">)u = /g, '$1P = '],
        // quader5: A for the total area (German O, Oberfläche; área total A as GY 6); the layers of cubes and "$O = 2 × (ab + ac + bc)"
        // are pt-15's rules below
        [/^Quader (\d+) mal (\d+) mal (\d+)$/, 'Paralelepípedo de $1 por $2 por $3'],
        [/(<p class="g5-big">)O = /g, '$1A = '],
        // einheiten5
        [/^Einheitentreppe (Länge|Masse|Zeit|Fläche|Volumen)$/, (m, k) => 'Escada das unidades de ' +
            ({ 'Länge': 'comprimento', 'Masse': 'massa', 'Zeit': 'tempo', 'Fläche': 'área', 'Volumen': 'volume' })[k]],
        // zahlschrift5
        [/^Die Zahl (\d+) in (aegypten|rom|maya|binaer)$/, (m, v, k) => 'O número ' + v + ' em numeração ' +
            ({ aegypten: 'egípcia', rom: 'romana', maya: 'maia', binaer: 'binária' })[k]],
        // symmetrie5: the button "Leeren" (gy11lk-stoch has «Esvaziar» for the urn), the colours
        [/(data-a="clear">)Leeren(?=<)/g, '$1Limpar'],
        [/^Farbe (\d)$/, 'Cor $1'],
        // koord5
        [/<\/span> geht durch A und B, (<span[^>]*>h<\/span>) durch C und D\./, '</span> passa por A e B, $1 por C e D.'],
        // linien5
        [/Fünf Pfennige auf der Linie (\d[\d\u202f ]*) werden zu einem im Feld (\d[\d\u202f ]*)\./, 'Cinco fichas na linha $1 passam a ser uma no espaço $2.'],
        [/Zwei Pfennige im Feld (\d[\d\u202f ]*) werden zu einem auf der Linie (\d[\d\u202f ]*)\./, 'Duas fichas no espaço $1 passam a ser uma na linha $2.'],
        [/(\d[\d\u202f ]*) ist gelegt\./, '$1 está colocado.'],
        [/(\d[\d\u202f ]*) dazugelegt\. Jetzt muss gebündelt werden\./, '$1 juntado. Agora é preciso agrupar.'],
        // book pt-15 mathe6-pt:
        // (merge os5-os8-pt: bruch5, bruchstrahl5 and mittel5 are pt-14's rules above)
        // komma5: the place-value table with the Portuguese orders (DM UM C D U, d c m: décimas, centésimas, milésimas),
        // only in this table; the product sign × on the buttons and in the line "2,35 × 10 ="
        [/<table class="g5-sw g5-sw-dez"><tr>[\s\S]*?<\/tr>/g, m => m.replace(/(<th[^>]*>)(ZT|T|H|Z|E|z|h|t)(<\/th>)/g, (x, a, k, b) =>
            a + ({ ZT: 'DM', T: 'UM', H: 'C', Z: 'D', E: 'U', z: 'd', h: 'c', t: 'm' })[k] + b)],
        [/(<button type="button" class="b-btn" data-o="m" data-k="\d+">)· /g, '$1× '],
        [/^<p>([^<]*?) · (\d+) =<\/p>/, '<p>$1 × $2 =</p>'],
        // winkelpaare5: "g und h sind (nicht) parallel."
        [/g und h sind (nicht )?parallel\./g, (m, n) => 'g e h ' + (n ? 'não são paralelas.' : 'são paralelas.')],
        // rechteck5 (for both OS books; the rows, "u = …" in big and the total are pt-14's): the aria label with the singular,
        // the perimeter P only in its own formula, the products × in the plain lines
        [/^Rechteck aus (\d+) Einheitsquadraten$/, (m, n) => 'Retângulo formado por ' + n + (n === '1' ? ' quadrado unitário' : ' quadrados unitários')],
        [/\$u = 2 \\times a \+ 2 \\times b = /g, '$$P = 2 \\times a + 2 \\times b = '],
        [/(\d) cm · (?=\d)/g, '$1 cm × '],
        // quader5 (for both OS books; the aria label and "O = …" in big are pt-14's): the layers of unit cubes with ×, in pt-14's
        // words, and the total area A only in its own formula
        [/(\d+) Schicht(?:en)? mit je (\d+) · (\d+) = (\d+) Würfeln\./g, (m, c, a, b, n) => c + (c === '1' ? ' camada' : ' camadas') + ' de ' + a + ' × ' + b + ' = ' + n + ' cubos cada uma.'],
        [/\$O = 2 \\times \(ab \+ ac \+ bc\)/g, '$$A = 2 \\times (ab + ac + bc)'],
    ]
});
