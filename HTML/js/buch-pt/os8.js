/* js/buch-pt/os8.js — Portuguese for the widgets of js/buch-os8.js.
 * Loaded by the Portuguese editions right after js/buch-os8.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('os8', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os8/*)
        // book pt-17 mathe8-pt:
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Capa: duas retas concorrentes, um cilindro em perspetiva cavaleira, uma homotetia, um diagrama em árvore e um prato de bicicleta',
        // termwertos8 (the sentences with "Für $x = …$" are rules below)
        'Termpaar': 'Par de expressões', 'Einsetzen: $x$': 'Valor de $x$',
        // flaecheos8 ('Term', 'Darstellung', 'Länge $b$' as in js/buch-pt/gy7.js, gy8.js and gleichungen.js: modules this page does not load)
        'Term': 'Expressão', 'Darstellung': 'Representação', 'mit Zahlen': 'com números', 'mit x': 'com x',
        'Faktor $a$': 'Fator $a$', 'Länge $b$': 'Comprimento $b$', 'Länge $c$': 'Comprimento $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Retângulo de altura a dividido em duas partes: a vezes (b mais c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Retângulo de altura a dividido em duas partes: a vezes (b menos c)',
        // linearos8: declive m and ordenada na origem b (German n), as the pt books write y = mx + b
        'Steigung $m$': 'Declive $m$', 'y-Achsenabschnitt $n$': 'Ordenada na origem $b$',
        'Graph einer proportionalen Funktion mit Steigungsdreieck': 'Gráfico de uma função de proporcionalidade direta com o triângulo de declive',
        'Graph einer linearen Funktion mit Steigungsdreieck': 'Gráfico de uma função afim com o triângulo de declive',
        'Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.': 'O gráfico é uma reta que passa pela origem $(0, 0)$.',
        // lgsgrafos8 ('Nächster Schritt', 'Alle Schritte', 'Von vorn' as in js/buch-pt/gy6.js and gy7.js, modules this page does not load)
        'Gleichungssystem': 'Sistema de equações', 'Nächster Schritt': 'Próximo passo', 'Alle Schritte': 'Todos os passos', 'Von vorn': 'Do início',
        'Zwei Geraden eines Gleichungssystems im Koordinatensystem': 'Duas retas de um sistema de equações num referencial',
        'Unendlich viele Lösungen.': 'Infinitas soluções (sistema possível e indeterminado).',
        'Keine Lösung: $L = \\{\\,\\}$': 'Nenhuma solução (sistema impossível): $\\text{C.S.} = \\{\\,\\}$',
        // tarifos8
        'Handy': 'Telemóvel', 'Strom': 'Eletricidade', 'Carsharing': 'Carsharing', 'Minuten': 'minutos', 'kWh im Jahr': 'kWh por ano', 'Kilometer': 'quilómetros',
        '€ pro Minute': '€ por minuto', '€ pro kWh': '€ por kWh', '€ pro km': '€ por km',
        'Tarif A: Grundgebühr': 'Tarifário A: mensalidade', 'Tarif B: Grundgebühr': 'Tarifário B: mensalidade',
        'Tarif A: € pro Minute': 'Tarifário A: € por minuto', 'Tarif B: € pro Minute': 'Tarifário B: € por minuto',
        'Tarif A: € pro kWh': 'Tarifário A: € por kWh', 'Tarif B: € pro kWh': 'Tarifário B: € por kWh',
        'Tarif A: € pro km': 'Tarifário A: € por km', 'Tarif B: € pro km': 'Tarifário B: € por km',
        'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch': 'Custo dos tarifários A e B em função do consumo',
        // kreisflaecheos8 (the perimeter is P, as everywhere in the pt editions)
        'Anzahl der Stücke $n$': 'Número de pedaços $n$',
        // rosetteos8
        'Hilfslinien ein/aus': 'Linhas auxiliares sim/não', 'Zweiter Ring ein/aus': 'Segundo anel sim/não', 'Anzahl der Blätter $n$': 'Número de pétalas $n$',
        'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.':
            'Com 6 pétalas, tudo encaixa na perfeição: o raio cabe exatamente seis vezes sobre a circunferência. Cada arco centrado num dos pontos passa pelo centro e pelos dois pontos vizinhos. As pétalas tocam-se mesmo à justa.',
        // zylinderos8 (the letters of the pt books: base A_b, lateral area A_L, total area A_T, perimeter P; 'Schrägbild', 'Netz', 'Oberfläche',
        // 'Volumen' as in js/buch-pt/gy6.js and gy7.js, modules this page does not load; 'Radius $r$', 'Höhe $h$', 'Körper' are in geometrie.js)
        'Kreiszylinder': 'Cilindro maciço', 'Hohlzylinder': 'Cilindro oco', 'Schrägbild': 'Perspetiva cavaleira', 'Netz': 'Planificação',
        'Material': 'Material', 'Holz': 'Madeira', 'Aluminium': 'Alumínio', 'Stahl': 'Aço', 'Innenradius $r_i$': 'Raio interior $r_i$',
        'Mantel': 'Superfície lateral', 'u = 2πr': 'P = 2πr', 'Größe': 'Grandeza', 'Formel und Wert': 'Fórmula e valor',
        'Grundfläche (Kreisring)': 'Base (coroa circular)', 'Außenmantel': 'Superfície lateral exterior', 'Innenmantel': 'Superfície lateral interior',
        'Oberfläche': 'Área total', 'Volumen': 'Volume', 'Grundfläche': 'Área da base',
        'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.':
            'A superfície lateral é um retângulo: tão largo como o perímetro da circunferência da base e tão alto como o cilindro.',
        'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.':
            'Na perspetiva cavaleira, a circunferência da base passa a ser uma elipse achatada. As linhas invisíveis são tracejadas.',
        // zaehlenos8 (the persons are the letters A, B, C …; the rings of the lock are «rodas»)
        'Anordnungen': 'Ordenações', 'Zählprinzip': 'Princípio fundamental da contagem', 'Art': 'Tipo', 'Anzahl der Personen $n$': 'Número de pessoas $n$',
        'Zahlenschloss': 'Cadeado de código', 'Menü': 'Menu', 'Outfit': 'Maneira de se vestir', 'Kombinationen': 'combinações', 'Menüs': 'menus', 'Outfits': 'maneiras de se vestir',
        '1. Ring': '1.ª roda', '2. Ring': '2.ª roda', '3. Ring': '3.ª roda',
        'Vorspeise': 'Entrada', 'Hauptgericht': 'Prato principal', 'Nachtisch': 'Sobremesa', 'T-Shirt': 'T-shirt', 'Hose': 'Calças', 'Schuhe': 'Sapatilhas',
        '1. Ring: Möglichkeiten': '1.ª roda: possibilidades', '2. Ring: Möglichkeiten': '2.ª roda: possibilidades', '3. Ring: Möglichkeiten': '3.ª roda: possibilidades',
        'Vorspeise: Möglichkeiten': 'Entrada: possibilidades', 'Hauptgericht: Möglichkeiten': 'Prato principal: possibilidades', 'Nachtisch: Möglichkeiten': 'Sobremesa: possibilidades',
        'T-Shirt: Möglichkeiten': 'T-shirt: possibilidades', 'Hose: Möglichkeiten': 'Calças: possibilidades', 'Schuhe: Möglichkeiten': 'Sapatilhas: possibilidades',
        'Das sind zu viele, um sie alle aufzuschreiben. Bei 4 Personen sind es noch 24.': 'São demasiadas para as escrever todas. Com 4 pessoas ainda são 24.',
        // stromos8 (Abschlag: pagamento mensal, Nachzahlung: acerto a pagar, Guthaben: crédito)
        'Verbrauch im Jahr': 'Consumo anual', 'Arbeitspreis in ct/kWh': 'Preço da energia em cêntimos/kWh', 'Grundpreis im Monat': 'Termo fixo por mês',
        'Abschlag im Monat': 'Pagamento mensal', 'Kosten': 'Custo', 'gezahlt': 'pago',
        'Balken: Jahreskosten aus Arbeitspreis und Grundpreis gegen die gezahlten Abschläge': 'Barras: custo anual (energia e termo fixo) comparado com os pagamentos mensais feitos',
        'Arbeitspreis': 'Energia', 'Grundpreis': 'Termo fixo', 'Jahreskosten': 'Custo anual', 'Abschläge': 'Pagamentos mensais',
        'Kosten und Abschläge sind genau gleich.': 'O custo e os pagamentos mensais são exatamente iguais.',
        // raumos8 ('Länge $a$', 'Breite $b$' as in js/buch-pt/gleichungen.js and gy7.js, which this page does not load)
        'Länge $a$': 'Comprimento $a$', 'Breite $b$': 'Largura $b$', 'Raumhöhe $h$': 'Pé-direito $h$', 'Türen': 'Portas', 'Fenster': 'Janelas',
        'Verschnitt beim Boden': 'Desperdício no chão',
        'Grundriss eines Zimmers und seine vier Wände nebeneinander, mit Türen und Fenstern': 'Planta de um quarto e as suas quatro paredes lado a lado, com portas e janelas',
        'Bodenfläche': 'Área do chão', 'Wandfläche': 'Área das paredes', 'Farbe (2 Anstriche)': 'Tinta (2 demãos)', 'Material zusammen': 'Material no total',
        'Luftraum des Zimmers': 'Volume de ar do quarto',
        // fahrrados8 (prato, carreto, cadência, relação de transmissão; the wheel's circumference is P)
        'Reifengröße': 'Medida da roda', 'Kettenblatt vorn (Zähne)': 'Prato à frente (dentes)', 'Ritzel hinten (Zähne)': 'Carreto atrás (dentes)',
        'Trittfrequenz (pro Minute)': 'Cadência (pedaladas por minuto)', 'Übersetzung': 'Relação de transmissão', 'Radumfang': 'Perímetro da roda',
        'Weg pro Kurbelumdrehung': 'Distância por pedalada', 'Geschwindigkeit': 'Velocidade', 'Kurbelumdrehungen pro km': 'Pedaladas por km',
        'Vereinfacht ist hier der Raddurchmesser die Zollangabe mal $2{,}54\\,\\text{cm}$. Großes Kettenblatt und kleines Ritzel: schnell, aber schwer zu treten.':
            'Para simplificar, aqui o diâmetro da roda é a medida em polegadas vezes $2{,}54\\,\\text{cm}$. Prato grande e carreto pequeno: rápido, mas custa a pedalar.',
        // reifenos8
        'Reifen': 'Pneu', 'Reifenbreite': 'Largura do pneu', 'Raddurchmesser': 'Diâmetro da roda', 'in Zoll': 'em polegadas', 'Umdrehungen pro km': 'Voltas da roda por km',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os8/*)
        // book pt-17 mathe8-pt:
        // termwertos8
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'Em todas as linhas o mesmo valor. A tabela não o prova, mas uma transformação mostra-o: as expressões são <b>equivalentes</b>.'],
        // flaecheos8 (the products are \times already: the rule of js/buch-pt/geometrie.js runs before the pieces)
        ['Ausmultiplizieren: ', 'Desenvolver: '], ['Ausklammern, von rechts nach links gelesen: $', 'Pôr em evidência, lido da direita para a esquerda: $'],
        ['Vom ganzen Rechteck $a \\times b$ wird der schraffierte Streifen $a \\times c$ abgezogen.', 'Ao retângulo inteiro $a \\times b$ tira-se a faixa tracejada $a \\times c$.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'O retângulo inteiro tem a mesma área que as suas duas partes juntas.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Cada parcela dentro dos parênteses é multiplicada pelo fator $a$.'],
        // linearos8
        ['Der Graph verläuft <b>waagerecht</b>.', 'O gráfico é <b>horizontal</b>.'],
        ['Jede Stelle ist eine Nullstelle.', 'Todos os números são zeros.'], ['Es gibt keine Nullstelle.', 'Não há zeros.'],
        ['Nullstelle (türkis): $0 = ', 'Zero (turquesa): $0 = '], ['$, also $x_0 = ', '$, portanto $x_0 = '],
        ['Schnittpunkt mit der y-Achse (weiß): $', 'Ponto de interseção com o eixo $Oy$ (branco): $'],
        // lgsgrafos8 (after the point rule of js/buch-pt.js the point is (0, n) already; the ordenada na origem is b)
        ['<b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ', '<b>Passo 1:</b> resolver as duas equações em ordem a $y$: $y = '],
        ['$ und $y = ', '$ e $y = '],
        ['<b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0, n)$, dann mit dem Steigungsdreieck weiter.',
            '<b>Passo 2:</b> desenhar as duas retas: começar em $(0, b)$ e continuar com o triângulo de declive.'],
        ['$. Probe: $', '$. Verificação: $'], ['Genau eine Lösung: $', 'Exatamente uma solução (sistema possível e determinado): $'],
        ['<b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.',
            '<b>Passo 3:</b> as duas equações descrevem <b>a mesma reta</b>. Todos os seus pontos satisfazem as duas equações.'],
        ['<b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.',
            '<b>Passo 3:</b> o mesmo declive e ordenadas na origem diferentes: as retas são <b>paralelas</b> e nunca se intersetam.'],
        // tarifos8
        ['Tarif A: $y = ', 'Tarifário A: $y = '], ['Tarif B: $y = ', 'Tarifário B: $y = '],
        ['($x$ in Minuten, $y$ in €)', '($x$ em minutos, $y$ em €)'], ['($x$ in kWh im Jahr, $y$ in €)', '($x$ em kWh por ano, $y$ em €)'],
        ['($x$ in Kilometer, $y$ in €)', '($x$ em quilómetros, $y$ em €)'],
        ['Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ', 'Os dois tarifários custam o mesmo por unidade; as retas são paralelas. '],
        ['Die Tarife sind gleich teuer.', 'Os dois tarifários custam o mesmo.'],
        ['Gleichsetzen: $', 'Igualando: $'], ['$ ergibt $x \\approx ', '$ dá $x \\approx '], ['$. Dann kosten beide etwa $', '$. Nesse caso, os dois custam cerca de $'],
        // kreisflaecheos8 (the products are \times already)
        ['\\,\\%$ von $r$), ', '\\,\\%$ de $r$), '],
        ['seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\times r$. Je mehr Stücke, desto genauer stimmt es:',
            'o seu comprimento é metade do perímetro, $\\dfrac{P}{2} = \\pi \\times r$. Quanto mais pedaços, mais exato fica:'],
        // rosetteos8
        ['Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ',
            'Cada pétala é formada por dois arcos de raio $r$ que vão do centro a um ponto da circunferência. Os pontos dividem a circunferência em '],
        ['Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.', 'Como cada pétala tem $60^\\circ$ de largura, com menos de 6 pétalas ficam espaços vazios.'],
        ['Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.', 'Como cada pétala tem $60^\\circ$ de largura, com mais de 6 as pétalas sobrepõem-se.'],
        // zylinderos8: the mass row
        ['Masse (Holz, $', 'Massa (madeira, $'], ['Masse (Aluminium, $', 'Massa (alumínio, $'], ['Masse (Stahl, $', 'Massa (aço, $'],
        // zaehlenos8
        ['Die Wahrscheinlichkeit, dass eine zufällige Sitzordnung genau die alphabetische ist: $', 'A probabilidade de uma ordem ao acaso ser exatamente a alfabética: $'],
        ['Vorspeise: ', 'Entrada: '], ['Hauptgericht: ', 'Prato principal: '], ['Nachtisch: ', 'Sobremesa: '], ['T-Shirt: ', 'T-shirt: '], ['Hose: ', 'Calças: '], ['Schuhe: ', 'Sapatilhas: '],
        ['$ Kombinationen', '$ combinações'], ['$ Menüs', '$ menus'], ['$ Outfits', '$ maneiras de se vestir'],
        ['Für jede Wahl im ersten Schritt gibt es alle Möglichkeiten des zweiten, für jede dieser Kombinationen alle des dritten: Die Anzahlen werden multipliziert.',
            'Para cada escolha no primeiro passo há todas as possibilidades do segundo e, para cada uma destas combinações, todas as do terceiro: multiplicam-se os números de possibilidades.'],
        [' Wer die Kombination rät, trifft beim ersten Versuch mit der Wahrscheinlichkeit $', ' Quem tenta adivinhar o código acerta à primeira com a probabilidade $'],
        // stromos8
        ['<b>Nachzahlung</b>: $', '<b>Acerto a pagar</b>: $'], ['$. Die Abschläge waren zu niedrig.', '$. Os pagamentos mensais foram baixos demais.'],
        ['<b>Guthaben</b>: $', '<b>Crédito</b>: $'], ['$ werden zurückgezahlt.', '$ são devolvidos.'],
        [' Ein passender neuer Abschlag wäre etwa $', ' Um novo pagamento mensal adequado seria de cerca de $'], ['$ im Monat.', '$ por mês.'],
        // raumos8 (litres: L, as Portuguese schools write them)
        ['Annahmen: Laminat im Paket zu ', 'Pressupostos: piso flutuante em embalagens de '],
        [' m² für 21,90 €, Tür 1,8 m², Fenster 1,56 m², 1 ℓ Farbe reicht für 7 m², Eimer zu 5 ℓ für 24,95 €. Pakete und Eimer gibt es nur ganz: Es wird aufgerundet.',
            ' m² a 21,90 €, porta 1,8 m², janela 1,56 m², 1 L de tinta chega para 7 m², latas de 5 L a 24,95 €. Embalagens e latas só se vendem inteiras: arredonda-se por excesso.'],
        // reifenos8
        ['Aufschrift auf dem Reifen: ', 'Inscrição no pneu: '], [' (Breite in mm, dann Felgendurchmesser in mm)', ' (largura em mm, depois diâmetro da jante em mm)'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-17 mathe8-pt:
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$" / "und $…$." on the second line, the verdict and "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = ([^$]+)\$ ist \$/g, 'Para $x = $1$: $'],
        [/(<p style="margin:4px 0 0">)und \$/g, '$1e $'],
        [/Für \$x = ([^$]+)\$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig<\/b>\./g, 'Para $x = $1$, os valores são diferentes: as expressões <b>não são equivalentes</b>.'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' Coincidirem em ' + n + (n === '1' ? ' linha' : ' linhas') + ' não chega.'],
        // flaecheos8: "Probe mit $x = 5$: $3 \times (5 + 2) = 21$ und $3 \times 5 + 6 = 21$."
        [/Probe mit \$x = ([^$]+)\$: (\$[^$]+\$) und (\$[^$]+\$)\./g, 'Verificação com $x = $1$: $2 e $3.'],
        // linearos8: the trend sentence
        [/Der Graph <b>steigt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach oben\./g, 'O gráfico <b>sobe</b>: quando se avança 1 para a direita, sobe $1.'],
        [/Der Graph <b>fällt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach unten\./g, 'O gráfico <b>desce</b>: quando se avança 1 para a direita, desce $1.'],
        // lgsgrafos8, tarifos8, zaehlenos8: the example buttons
        [/\bBeispiel (\d+)\b/g, 'Exemplo $1'],
        // lgsgrafos8: the solution set C.S. (as js/buch-pt/gleichungen.js, which this page does not load) and the point read off without a letter
        [/\$L = (?=\\\{)/g, '$\\text{C.S.} = '],
        [/<b>Schritt 3:<\/b> Schnittpunkt ablesen: \$S\(/g, '<b>Passo 3:</b> ler o ponto de interseção: $('],
        // tarifos8
        [/Die Geraden schneiden sich nicht bei positivem Verbrauch: Tarif ([AB]) ist immer günstiger\./g, 'As retas não se intersetam para consumos positivos: o tarifário $1 é sempre mais barato.'],
        [/Tarif ([AB]) ist immer günstiger\./g, 'O tarifário $1 é sempre mais barato.'],
        [/Bis etwa ([\d.,]+) (min|kWh|km) ist Tarif ([AB]) günstiger, darüber Tarif ([AB])\./g, 'Até cerca de $1 $2, o tarifário $3 é mais barato; a partir daí, o tarifário $4.'],
        // kreisflaecheos8: the picture's label "u : 2 = π · r" and the sentences with the number of pieces
        [/>u : 2 = π · r</g, '>P : 2 = π × r<'],
        [/Ein Kreis in (\d+) Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt/g, 'Um círculo cortado em $1 pedaços, postos lado a lado, alternadamente'],
        [/Die (\d+) Stücke bilden fast ein Rechteck\. Seine Höhe ist fast der Radius \$r\$ \(hier \$/g, 'Os $1 pedaços formam quase um retângulo. A sua altura é quase o raio $r$ (aqui $'],
        // rosetteos8
        [/Rosette mit (\d+) Blättern, mit dem Zirkel konstruiert/g, 'Roseta de $1 pétalas construída com o compasso'],
        [/ gleiche Teile von je \$([\d{},]+)\^\\circ\$\. /g, (m, d) => ' partes iguais de $' + d + '^\\circ$ cada uma. '],
        // zylinderos8: the picture's label, and the letters of the table (A_G → A_b, A_M → A_L, A_Mi → A_L,i, O → A_T), tied to its table with "A_G = \pi"
        [/(Hohlzylinder|Kreiszylinder) mit dem Radius ([\d,]+) cm und der Höhe ([\d,]+) cm/g,
            (m, k, r, h) => (k === 'Hohlzylinder' ? 'Cilindro oco' : 'Cilindro') + ' de raio ' + r + ' cm e altura ' + h + ' cm'],
        [/<table class="b-table g-tab">(?:(?!<\/table>)[\s\S])*?A_G = \\pi[\s\S]*?<\/table>/g,
            t => t.replace(/A_\{Mi\}/g, 'A_{L,i}').replace(/A_\{?M\}?/g, 'A_L').replace(/A_G/g, 'A_b').replace(/\$O = /g, '$A_T = ')],
        // zaehlenos8: "3 Personen auf 3 Plätzen: …" and the rings of the lock in the summary line "1. Ring: 10 · 2. Ring: 10 · …"
        [/(\d+) Personen auf (\d+) Plätzen: Für den ersten Platz gibt es (\d+) Möglichkeiten, für den zweiten noch (\d+), und so weiter bis zum letzten Platz\./g,
            '$1 pessoas em $2 lugares: para o primeiro lugar há $3 possibilidades, para o segundo ainda $4, e assim sucessivamente até ao último lugar.'],
        [/([123])\. Ring: /g, '$1.ª roda: '],
        // raumos8: the unrolled walls, the waste, the packs and tins, the litre (ℓ → L)
        [/Wände abgewickelt: ([\d,]+) m lang, ([\d,]+) m hoch/g, 'Paredes planificadas: $1 m de comprimento, $2 m de altura'],
        [/mit (\d+) % Verschnitt/g, 'com $1 % de desperdício'],
        [/ → (\d+) Pakete zu \$/g, (m, n) => ' → ' + n + (n === '1' ? ' embalagem' : ' embalagens') + ' a $'],
        [/\\,\\ell\$ → (\d+) Eimer zu 5 ℓ/g, (m, n) => '\\,\\text{L}$ → ' + n + (n === '1' ? ' lata' : ' latas') + ' de 5 L'],
        // fahrrados8: the chain drive, the labels in the picture, the letter P of the circumference (u in the German table)
        [/Kettenantrieb: Kettenblatt mit (\d+) Zähnen, Ritzel mit (\d+) Zähnen und das Hinterrad/g, 'Transmissão por corrente: prato de $1 dentes, carreto de $2 dentes e a roda de trás'],
        [/>Kettenblatt (\d+)</g, '>Prato $1<'], [/>Ritzel (\d+)</g, '>Carreto $1<'],
        [/\$u = \\pi \\times (?=[\d{},]+\\,\\text\{cm\})/g, '$P = \\pi \\times '], [/\$i \\times u \\approx /g, '$i \\times P \\approx '],
        // reifenos8: the wheel in the picture and the remark on the inch size (before the inch buttons below)
        [/Laufrad mit Felge (\d+) mm und Reifen (\d+) mm breit/g, 'Roda com jante de $1 mm e pneu de $2 mm de largura'],
        [/Die Zollangabe ist eher ein Name: Ein „(\d+)-Zoll-Rad“ hat hier \$([\d{},]+)\$ Zoll\. Genauer ist die Millimeterangabe\./g,
            (m, n, z) => 'A medida em polegadas é mais um nome: uma «roda de ' + n + ' polegadas» tem aqui $' + z + '$ polegadas. A medida em milímetros é mais exata.'],
        // fahrrados8, reifenos8: "28 Zoll" on the buttons
        [/(\d+) Zoll\b/g, '$1 polegadas'],
    ]
});
