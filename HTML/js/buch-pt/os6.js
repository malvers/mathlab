/* js/buch-pt/os6.js — Portuguese for the widgets of js/buch-os6.js.
 * Loaded by the Portuguese editions right after js/buch-os6.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('os6', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs os6/*)
        // book pt-14 mathe5-pt:
        // the helpers of the module (the pieces of the tangram), reported for every page that loads it
        'Quadrat': 'Quadrado', 'Parallelogramm': 'Paralelogramo',
        // wuerfelbauos6: sólido formado por cubos, planta com as alturas, vistas (área total, as GY 6)
        'Treppe': 'Escada', 'Turm': 'Torre', 'Mauer': 'Muro', 'Selbst bauen': 'Construir', 'Körper': 'Sólido', 'vorne': 'frente',
        'Körper aus Würfeln im Schrägbild': 'Sólido formado por cubos, em perspetiva cavaleira',
        'Bauplan: Draufsicht mit den Höhen': 'Planta: vista de cima com as alturas', 'Bauplan': 'Planta',
        'von vorn': 'vista de frente', 'von rechts': 'vista da direita',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Toca numa casa da planta: o número diz quantos cubos estão empilhados nesse sítio (até 3, depois outra vez 0). Aresta de 1 cm.',
        // book pt-15 mathe6-pt:
        // the tangram pieces and the cube buildings (helpers of the module, outside every widget)
        'großes Dreieck': 'triângulo grande', 'mittleres Dreieck': 'triângulo médio', 'kleines Dreieck': 'triângulo pequeno',
        'Quadrat': 'Quadrado', 'Parallelogramm': 'Paralelogramo', 'Treppe': 'Escada', 'Turm': 'Torre', 'Mauer': 'Muro', 'Selbst bauen': 'Construir',
        // wuerfelbauos6 (chapter 4): planta, vistas de frente e da direita
        'vorne': 'frente', 'Körper aus Würfeln im Schrägbild': 'Sólido feito de cubos em perspetiva cavaleira', 'Bauplan: Draufsicht mit den Höhen': 'Planta: vista de cima com as alturas',
        'Bauplan': 'Planta', 'von vorn': 'de frente', 'von rechts': 'da direita',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Toca num quadrado da planta: o número diz quantos cubos estão empilhados ali (até 3, depois outra vez 0). Aresta de 1 cm.',
        // tangramos6 (chapter O)
        'Tangram: sieben Teile in einem Quadrat': 'Tangram: sete peças num quadrado',
        // hanoios6 (chapter O): discos, hastes, jogadas
        '3 Scheiben': '3 discos', '4 Scheiben': '4 discos', '5 Scheiben': '5 discos', '6 Scheiben': '6 discos', 'Anzahl der Scheiben': 'Número de discos',
        'Lösung zeigen': 'Mostrar a solução', 'Mit der kleinstmöglichen Zahl von Zügen.': 'Com o menor número possível de jogadas.',
        'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.': 'Não é permitido: um disco maior nunca pode ficar em cima de um menor.',
        'Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.':
            'Leva todos os discos de A para C. Toca primeiro na haste de onde tiras e depois na haste de destino. Só um disco de cada vez, nunca um maior em cima de um menor.',
        // nimos6 (chapter O): paus, tirar
        '15 Hölzer': '15 paus', '21 Hölzer': '21 paus', '30 Hölzer': '30 paus', 'Anzahl der Hölzer': 'Número de paus', 'ohne Hilfe': 'sem ajuda',
        'Vierer zeigen': 'Mostrar grupos de 4', 'Hilfe': 'Ajuda', 'Nimm 1': 'Tira 1', 'Nimm 2': 'Tira 2', 'Nimm 3': 'Tira 3',
        'Der Computer überlegt …': 'O computador está a pensar…', 'Du bist dran: Nimm 1, 2 oder 3 Hölzer.': 'É a tua vez: tira 1, 2 ou 3 paus.',
        // schiebeos6 (chapter O): o puzzle de deslizar
        '3 × 3 · 8 Steine': '3 × 3 · 8 peças', '4 × 4 · 15 Steine': '4 × 4 · 15 peças', 'Größe': 'Tamanho', 'Mischen': 'Baralhar', 'Ordnen': 'Ordenar',
        'Geordnet. Tippe auf „Mischen“.': 'Por ordem. Toca em «Baralhar».',
        'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.':
            'Toca numa peça ao lado do espaço vazio, e ela desliza para lá. Põe os números por ordem, com o espaço vazio em baixo à direita.',
        'Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.':
            'Verde: a peça já está no sítio certo. Só se baralha com jogadas permitidas; por isso, qualquer puzzle tem solução. Se, pelo contrário, se trocarem duas peças, nunca mais dá.',
        // augensummeos6 (chapter O): a soma das pintas de dois dados
        '1-mal': '1 vez', '10-mal': '10 vezes', '100-mal': '100 vezes', 'Löschen': 'Apagar',
        'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme': 'Os 36 resultados de dois dados, com a soma das pintas',
        'Säulendiagramm: relative Häufigkeiten der Augensummen': 'Gráfico de barras: frequências relativas das somas das pintas',
        // book pt-16 mathe7-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs os6/*)
        // book pt-14 mathe5-pt:
        // the helpers of the module (the pieces of the tangram)
        ['großes Dreieck', 'triângulo grande'], ['mittleres Dreieck', 'triângulo médio'], ['kleines Dreieck', 'triângulo pequeno'],
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · área total '],
        // book pt-15 mathe6-pt:
        // titelbildos6 (the cover)
        ['Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln',
            'Capa: um quadrado de tangram com sete peças, um círculo com três quartos coloridos, uma reta numérica, a Torre de Hanói e um sólido feito de cubos'],
        // tangramos6: the lines under the piece's name
        ['Anteil am Quadrat: $', 'Parte do quadrado: $'], ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil $', 'Se o quadrado tiver 4 cm × 4 cm, a peça tem $'],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: $', 'Toca numa peça. As sete juntas formam o quadrado inteiro: $'],
        // hanoios6 and schiebeos6: the count of the moves
        ['Züge: <b>', 'Jogadas: <b>'], ['Mindestens nötig: $', 'Mínimo necessário: $'], ['<b>Geschafft!</b>', '<b>Conseguiste!</b>'],
        // nimos6: the end of the game and the help line
        ['Du hast das letzte Holz genommen und gewonnen!', 'Tiraste o último pau e ganhaste!'], ['Der Computer hat das letzte Holz genommen.', 'O computador tirou o último pau.'],
        [' Probier es noch einmal.', ' Tenta outra vez.'], ['Wer das letzte Holz nimmt, gewinnt.', 'Quem tirar o último pau ganha.'],
        [' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.', ' As cores mostram grupos de 4 a partir do fim: deixa sempre ao computador um múltiplo de 4.'],
        // augensummeos6: the help line around the list of the six ways to make 7
        ['Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (', 'Toca numa casa ou numa barra. A linha tracejada mostra a parte das casas. O 7 tem mais casas ('],
        ['), die 2 und die 12 nur eins.', '), o 2 e o 12 só uma.'],
        // book pt-16 mathe7-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-14 mathe5-pt:
        // wuerfelbauos6: "7 Würfel · Volumen 7 cm³"
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cubo' : 'cubos') + ' · volume '],
        // book pt-15 mathe6-pt:
        // wuerfelbauos6: "<b>7</b> Würfel · Volumen $7 cm³$ · Oberfläche $30 cm²$" (cubos · volume · área total, as Silva writes it)
        [/<b>(\d+)<\/b> Würfel · Volumen \$/g, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cubo' : 'cubos') + ' · volume $'], [/\$ · Oberfläche \$/g, '$$ · área total $$'],
        // tangramos6: the bold name of the piece in lower case, like "triângulo grande", and the pieces of the same area
        // (the same wording as pt-16 mathe7-pt)
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm|großes Dreieck|mittleres Dreieck|kleines Dreieck)(<\/b><\/p>)/g, (m, a, t, b) => a +
            ({ 'Quadrat': 'quadrado', 'Parallelogramm': 'paralelogramo', 'großes Dreieck': 'triângulo grande', 'mittleres Dreieck': 'triângulo médio', 'kleines Dreieck': 'triângulo pequeno' })[t] + b],
        [/Genauso groß: ([^<]+?) \(hell markiert\)\./g, (m, list) => 'Com a mesma área: ' + list.split(', ').map(t =>
            ({ 'Quadrat': 'quadrado', 'Parallelogramm': 'paralelogramo', 'großes Dreieck': 'triângulo grande', 'mittleres Dreieck': 'triângulo médio', 'kleines Dreieck': 'triângulo pequeno' })[t] || t).join(', ') +
            ' (com destaque a claro).'],
        // hanoios6
        [/^Turm von Hanoi mit (\d+) Scheiben$/, 'Torre de Hanói com $1 discos'], [/Es geht auch mit (\d+) Zügen\./g, 'Também é possível com $1 jogadas.'],
        // nimos6: the log "Du: 1 · Computer: 3", the picture, "Noch 17 Hölzer."
        [/\bDu: (?=\d)/g, 'Tu: '], [/\bComputer: (?=\d)/g, 'Computador: '],
        [/^(\d+) Hölzer liegen noch$/, (m, n) => (n === '1' ? 'Ainda há 1 pau' : 'Ainda há ' + n + ' paus')],
        [/<p style="margin:0">Noch <b>(\d+)<\/b> Hölzer\.<\/p>/g, (m, n) => '<p style="margin:0">Ainda há <b>' + n + '</b> ' + (n === '1' ? 'pau' : 'paus') + '.</p>'],
        // schiebeos6
        [/^Schiebepuzzle mit (\d+) Steinen$/, 'Puzzle de deslizar com $1 peças'],
        [/<b>Geschafft in (\d+) Zügen!<\/b>/g, (m, n) => '<b>Conseguiste em ' + n + (n === '1' ? ' jogada!' : ' jogadas!') + '</b>'],
        // augensummeos6: "100 Würfe · zuletzt 3 + 4 = 7", "Augensumme 7: 17-mal, relativ $…$", " · im Gitter 6 von 36 Feldern, also $…$"
        [/<p style="margin:0">(\d+) Würfe/g, (m, n) => '<p style="margin:0">' + n + (n === '1' ? ' lançamento' : ' lançamentos')], [/ · zuletzt (?=\d)/g, ' · o último: '],
        [/Augensumme <b>(\d+)<\/b>: (\d+)-mal(, relativ \$)?/g, (m, s, k, r) => 'Soma <b>' + s + '</b>: ' + k + (k === '1' ? ' vez' : ' vezes') + (r ? ', relativa $' : '')],
        [/ · im Gitter (\d+) von 36 Feldern, also \$/g, (m, w) => ' · na grelha, ' + w + (w === '1' ? ' casa' : ' casas') + ' de 36, ou seja, $'],
        // book pt-16 mathe7-pt:
    ]
});
