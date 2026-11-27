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
    ]
});
