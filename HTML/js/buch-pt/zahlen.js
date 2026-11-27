/* js/buch-pt/zahlen.js — Portuguese for the widgets of js/buch-zahlen.js.
 * Loaded by the Portuguese editions right after js/buch-zahlen.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-6-prep (15.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('zahlen', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs zahlen/*)
        // book pt-6 mathefos11-pt:
        // zahlenbereiche
        'Kleinster Bereich:': 'Menor conjunto:',
        'Nächste Zahl': 'Número seguinte',
        'DIE ZAHL': 'O NÚMERO',
        'Richtig!': 'Certo!',
        'In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.': 'A que conjunto numérico <b>mais pequeno</b> pertence? Toca num botão ou na figura.',
        'Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R': 'Conjuntos numéricos encaixados uns nos outros: N em Z em Q em R',
        // komplex
        'Rechenart': 'Operação',
        'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile': 'Plano de Argand com dois números complexos representados por setas',
        'Ergebnis': 'Resultado',
        // schaltung (the circuits are helpers of the module: CIRCUITS)
        'Reihe (UND)': 'Série (E)',
        'Parallel (ODER)': 'Paralelo (OU)',
        'Wechselschaltung': 'Circuito de escada',
        'Schaltung': 'Circuito',
        'Schalter $a$ umlegen': 'Mudar o interruptor $a$',
        'Schalter $b$ umlegen': 'Mudar o interruptor $b$',
        'Schalter a': 'Interruptor a',
        'Schalter b': 'Interruptor b',
        'Quelle': 'Fonte',
        'Stromkreis mit zwei Schaltern und einer Lampe': 'Circuito elétrico com dois interruptores e uma lâmpada',
        'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.': 'A lâmpada só acende se <b>ambos</b> os interruptores estiverem fechados.',
        'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.': 'A lâmpada acende se <b>pelo menos um</b> dos interruptores estiver fechado.',
        'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.': 'Escada: cada um dos dois interruptores pode acender e apagar a lâmpada. Ela acende quando os dois interruptores estão na <b>mesma</b> posição.',
        // book pt-13 mathegy9-pt:
        // book pt-20 mathegy10-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs zahlen/*)
        ['Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm',
            'Capa: duas retas e o seu ponto de interseção, uma parábola, uma função de terceiro grau com três zeros e um diagrama de barras'],
        // zahlenbereiche: why a number belongs to its set (helpers NUMS, SET_NAME) - "o número" is masculine
        ['eine natürliche Zahl', 'um número natural'],
        ['eine negative ganze Zahl', 'um número inteiro negativo'],
        ['ein Bruch, der keine ganze Zahl ist', 'uma fração que não é um número inteiro'],
        ['periodisch: ', 'dízima periódica: '],
        ['$ ist irrational: nicht abbrechend und nicht periodisch', '$ é irracional: dízima infinita não periódica'],
        ['$ ist irrational', '$ é irracional'],
        [' ist irrational', ' é irracional'],
        ['nicht abbrechend und nicht periodisch, also irrational', 'dízima infinita não periódica, logo irracional'],
        ['$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational', '$5$ não é um quadrado perfeito, logo $\\sqrt{5}$ é irracional'],
        ['der Betrag: ', 'o valor absoluto: '],
        ['natürliche Zahlen', 'números naturais'],
        ['ganze Zahlen', 'números inteiros'],
        ['rationale Zahlen', 'números racionais'],
        ['reelle Zahlen', 'números reais'],
        // book pt-6 mathefos11-pt:
        // zahlenbereiche: the answers
        ['$ liegt in $', '$ pertence a $'],
        ['. Damit liegt sie auch in jedem größeren Bereich.', '. Por isso pertence também a qualquer conjunto maior.'],
        ['Sie liegt zwar in $', 'Pertence de facto a $'],
        ['$, aber es gibt einen <b>kleineren</b> Bereich.', '$, mas há um conjunto <b>mais pequeno</b>.'],
        ['Nein, $', 'Não, $'],
        ['$ gehört nicht zu den ', '$ não pertence aos '],
        ['. Tipp: ', '. Dica: '],
        [' · Richtig: ', ' · certas: '],
        ['Richtig: ', 'Certas: '],
        ['Lässt sie sich als Bruch schreiben?', 'Pode escrever-se como fração?'],
        ['Rechne sie zuerst aus.', 'Calcula-o primeiro.'],
        // komplex
        ['\\text{(an der reellen Achse gespiegelt)}', '\\text{(refletido no eixo real)}'],
        [' · Betrag $', ' · módulo $'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.', 'Como $\\mathrm{i}^2 = -1$, a última parcela torna-se um número real. Os módulos multiplicam-se e os ângulos somam-se.'],
        // schaltung: L is the lamp (lâmpada)
        ['Term: $L = ', 'Expressão: $L = '],
        ['$ · jetzt: $a = ', '$ · agora: $a = '],
        ['$ → Lampe <b>', '$ → lâmpada <b>'],
        // book pt-13 mathegy9-pt:
        // book pt-20 mathegy10-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-6 mathefos11-pt:
        // zahlenbereiche: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, 'Certas: $1 de $2'],
        // schaltung: "Lampe <b>an</b>" / "<b>aus</b>" (the rules run before the pieces)
        [/Lampe <b>an<\/b>/g, 'Lampe <b>acesa</b>'], [/Lampe <b>aus<\/b>/g, 'Lampe <b>apagada</b>'],
        // book pt-13 mathegy9-pt:
        // book pt-20 mathegy10-pt:
    ]
});
