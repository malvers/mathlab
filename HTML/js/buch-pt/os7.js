/* js/buch-pt/os7.js — Portuguese for the widgets of js/buch-os7.js.
 * Loaded by the Portuguese editions right after js/buch-os7.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('os7', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os7/*)
        // book pt-16 mathe7-pt:
        // titelbildos7
        'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm':
            'Capa: um quadrado de cem quadrículas com 25 iluminadas, uma pavimentação de hexágonos, uma reta numérica de menos 3 a 3, um prisma e um gráfico circular',
        // tageszinsos7 (the letters K, p %, t, Z stay German, as the page says; "90 Tage" in the picture: rule of js/buch-pt/gy6.js)
        'Kapital $K$': 'Capital $K$', 'Zinssatz $p\\,\\%$': 'Taxa de juro $p\\,\\%$', 'Tage $t$': 'Dias $t$', 'Jahr': 'Ano',
        'Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.':
            'Nos bancos, o ano bancário tem quase sempre 360 dias e cada mês 30 dias. Só no fim se arredonda ao cêntimo.',
        // quadrantos7 (the symmetric point P′ with respect to an axis or the origin; the sentences with the point are rules below)
        'nur P': 'só P', 'an der x-Achse': 'eixo Ox', 'an der y-Achse': 'eixo Oy', 'am Ursprung': 'origem', 'Spiegeln': 'Simetria',
        'An der x-Achse ändert die y-Koordinate ihr Vorzeichen.': 'Na simetria em relação ao eixo Ox, a ordenada y muda de sinal.',
        'An der y-Achse ändert die x-Koordinate ihr Vorzeichen.': 'Na simetria em relação ao eixo Oy, a abcissa x muda de sinal.',
        'Am Ursprung ändern beide Koordinaten ihr Vorzeichen.': 'Na simetria em relação à origem, as duas coordenadas mudam de sinal.',
        'Ziehe P. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).':
            'Arrasta P. Primeiro vem a abcissa x (para a direita ou para a esquerda), depois a ordenada y (para cima ou para baixo).',
        // the helpers of the module (the tilings and the materials, outside every widget; reported on the start page, which
        // loads os7 without gy7 - the same Portuguese as js/buch-pt/gy7.js)
        'Dreiecke': 'Triângulos', 'Quadrate': 'Quadrados', 'Sechsecke': 'Hexágonos', 'Fünfecke': 'Pentágonos', 'Fichtenholz': 'Madeira de abeto',
        // dichteos7 ('Stoff' and 'Breite $b$' are in js/buch-pt/gy7.js, 'Länge $a$' in gleichungen.js)
        'Holz': 'Madeira', 'Eis': 'Gelo', 'Aluminium': 'Alumínio', 'Eisen': 'Ferro', 'Gold': 'Ouro', 'Höhe $c$': 'Altura $c$',
        // parkettos7 ('Dreiecke', 'Quadrate', 'Fünfecke', 'Sechsecke' are words of js/buch-pt/gy7.js; the angles at a vertex are phrases)
        'Achtecke und Quadrate': 'Octógonos e quadrados', 'Sechsecke und Dreiecke': 'Hexágonos e triângulos', 'Parkett': 'Pavimentação',
        'Ein Parkett bedeckt die Ebene ohne Lücken und ohne Überlappung. Das geht nur, wenn die Winkel an jeder Ecke zusammen genau $360^\\circ$ ergeben. Mit nur einer Sorte regelmäßiger Vielecke klappt das bei Dreiecken, Quadraten und Sechsecken.':
            'Uma pavimentação cobre o plano sem deixar espaços vazios e sem sobreposições. Isso só é possível se os ângulos à volta de cada vértice somarem exatamente $360^\\circ$. Com um só tipo de polígonos regulares, consegue-se com triângulos, quadrados e hexágonos.',
        // escheros7
        'Parkett aus einer verformten Quadratkachel': 'Pavimentação com um ladrilho quadrado deformado',
        'Ziehe den <b>roten</b> Punkt: Die linke Kante biegt sich, die rechte Kante macht genau dieselbe Form. Ziehe den <b>lila</b> Punkt: Unten und oben ändern sich gemeinsam.':
            'Arrasta o ponto <b>vermelho</b>: o lado esquerdo curva-se e o lado direito toma exatamente a mesma forma. Arrasta o ponto <b>roxo</b>: o lado de baixo e o de cima mudam ao mesmo tempo.',
        'Was auf einer Seite weggenommen wird, kommt auf der gegenüberliegenden Seite dazu. Darum hat die Kachel immer denselben Flächeninhalt wie das Quadrat – und sie füllt die Ebene lückenlos.':
            'O que se tira de um lado junta-se ao lado oposto. Por isso, o ladrilho tem sempre a mesma área que o quadrado – e preenche o plano sem deixar espaços vazios.',
        'So arbeitete M. C. Escher: Er veränderte Kanten eines Vielecks, verschob oder drehte die Änderung auf eine andere Kante und malte in die Kachel ein Tier.':
            'Era assim que M. C. Escher trabalhava: alterava os lados de um polígono, deslocava ou rodava a alteração para outro lado e pintava um animal no ladrilho.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os7/*)
        // book pt-16 mathe7-pt:
        // tageszinsos7
        ['Jahreszinsen: ', 'Juros anuais: '],
        // quadrantos7
        ['Spiegelpunkt: ', 'Ponto simétrico: '],
        // dichteos7 (Dichte = massa volúmica; the cuboid floats or sinks)
        ['Volumen: ', 'Volume: '], ['Masse: ', 'Massa: '],
        ['Die Dichte ist kleiner als die von Wasser (', 'A massa volúmica é menor do que a da água ('], ['): Der Körper schwimmt.', '): o corpo flutua.'],
        ['Die Dichte ist größer als die von Wasser (', 'A massa volúmica é maior do que a da água ('], ['): Der Körper geht unter.', '): o corpo vai ao fundo.'],
        // parkettos7: the angles at one vertex
        ['An einer Ecke: ', 'Num vértice: '], ['6 Dreiecke: ', '6 triângulos: '], ['4 Quadrate: ', '4 quadrados: '], ['3 Sechsecke: ', '3 hexágonos: '],
        ['3 Fünfecke: ', '3 pentágonos: '], [' – es bleibt eine Lücke von ', ' – fica um espaço vazio de '], ['. 4 Fünfecke: ', '. 4 pentágonos: '], [', das ist zu viel.', ', é demasiado.'],
        ['2 Achtecke und 1 Quadrat: ', '2 octógonos e 1 quadrado: '], ['2 Sechsecke und 2 Dreiecke: ', '2 hexágonos e 2 triângulos: '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-16 mathe7-pt:
        // tageszinsos7: "1 Tag" / "90 Tage" on the slider, "1 Tag" in the picture (">90 Tage<" is a rule of gy6.js), "für 90 Tage:", the label of the picture
        [/^1 Tag$/, '1 dia'], [/^(\d+) Tage$/, '$1 dias'], [/>1 Tag</g, '>1 dia<'],
        [/für \$(\d+)\$ (Tag|Tage): /g, (m, t, w) => 'para $' + t + '$ ' + (w === 'Tag' ? 'dia' : 'dias') + ': '],
        [/Zinsjahr mit 360 Tagen, davon (\d+) Tage; Jahreszinsen und Tageszinsen als Säulen/,
            (m, t) => 'Ano bancário de 360 dias, dos quais ' + t + (t === '1' ? ' dia' : ' dias') + '; juros anuais e juros desses dias em barras'],
        // quadrantos7: "P(3 | 2)" in the label (also after the point rule of the engine), "$P(3, 2)$ liegt im I. Quadranten."
        [/Koordinatensystem mit vier Quadranten, Punkt P\((-?\d+)(?: \| |, )(-?\d+)\)/, 'Referencial com quatro quadrantes, ponto P($1, $2)'],
        [/\$ liegt (?=im |auf )/g, '$ situa-se '], [/\bim (I|II|III|IV)\. Quadranten/g, (m, q) => 'no ' + ({ I: '1.º', II: '2.º', III: '3.º', IV: '4.º' })[q] + ' quadrante'],
        [/\bauf einer Achse/g, 'sobre um eixo'],
        // dichteos7: the label of the picture and "Dichte von Eisen: " (massa volúmica do ferro)
        [/Quader aus (Holz|Eis|Aluminium|Eisen|Gold), (\d+) cm mal (\d+) cm mal (\d+) cm/, (m, st, a, b, c) => 'Paralelepípedo de ' +
            ({ Holz: 'madeira', Eis: 'gelo', Aluminium: 'alumínio', Eisen: 'ferro', Gold: 'ouro' })[st] + ', ' + a + ' cm por ' + b + ' cm por ' + c + ' cm'],
        [/Dichte von (Fichtenholz|Eis|Aluminium|Eisen|Gold): /, (m, st) => 'Massa volúmica ' +
            ({ Fichtenholz: 'da madeira de abeto', Eis: 'do gelo', Aluminium: 'do alumínio', Eisen: 'do ferro', Gold: 'do ouro' })[st] + ': '],
        // parkettos7: the name of the tiling in the label of the picture
        [/^Parkett: (Dreiecke|Quadrate|Sechsecke|Fünfecke|Achtecke und Quadrate|Sechsecke und Dreiecke)$/, (m, n) => 'Pavimentação: ' +
            ({ 'Dreiecke': 'triângulos', 'Quadrate': 'quadrados', 'Sechsecke': 'hexágonos', 'Fünfecke': 'pentágonos',
                'Achtecke und Quadrate': 'octógonos e quadrados', 'Sechsecke und Dreiecke': 'hexágonos e triângulos' })[n]],
    ]
});
