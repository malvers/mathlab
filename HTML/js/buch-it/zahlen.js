/* js/buch-it/zahlen.js — Italian for the widgets of js/buch-zahlen.js.
 * Loaded by the Italian editions right after js/buch-zahlen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/zahlen.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('zahlen', {
    word: {
        // book it-4 mathefos11-it:
        // titelbildfos11
        'Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm':
            'Copertina: due rette con il loro punto di intersezione, una parabola, una funzione di terzo grado con tre zeri e un diagramma a colonne',
        // zahlenbereiche
        'Kleinster Bereich:': 'Insieme più piccolo:', 'Nächste Zahl': 'Numero successivo', 'DIE ZAHL': 'IL NUMERO', 'Richtig!': 'Giusto!',
        'In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.':
            'In quale insieme numerico <b>più piccolo</b> sta? Tocca un pulsante o la figura.',
        'Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R': 'Insiemi numerici come insiemi uno dentro l’altro: N in Z in Q in R',
        // komplex
        'Rechenart': 'Operazione', 'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile': 'Piano di Gauss con due numeri complessi come frecce',
        'Ergebnis': 'Risultato',
        // schaltung
        'Reihe (UND)': 'Serie (E)', 'Parallel (ODER)': 'Parallelo (O)', 'Wechselschaltung': 'Deviatori', 'Schaltung': 'Circuito',
        'Schalter $a$ umlegen': 'Aziona l’interruttore $a$', 'Schalter $b$ umlegen': 'Aziona l’interruttore $b$', 'Schalter a': 'Interruttore a', 'Schalter b': 'Interruttore b',
        'Quelle': 'Fonte', 'Stromkreis mit zwei Schaltern und einer Lampe': 'Circuito elettrico con due interruttori e una lampadina',
        'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.': 'La lampadina si accende solo se <b>entrambi</b> gli interruttori sono chiusi.',
        'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.': 'La lampadina si accende se <b>almeno uno</b> degli interruttori è chiuso.',
        'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.':
            'Scale: ciascuno dei due interruttori può accendere e spegnere la lampadina. Si accende se i due interruttori sono nella <b>stessa</b> posizione.',

    },
    phrase: [
        // book it-4 mathefos11-it:
        // zahlenbereiche: why a number belongs to its set
        ['eine natürliche Zahl', 'un numero naturale'], ['eine negative ganze Zahl', 'un numero intero negativo'],
        ['ein Bruch, der keine ganze Zahl ist', 'una frazione che non è un numero intero'], ['periodisch: ', 'periodico: '],
        ['$ ist irrational: nicht abbrechend und nicht periodisch', '$ è irrazionale: né limitato né periodico'], [' ist irrational', ' è irrazionale'],
        ['nicht abbrechend und nicht periodisch, also irrational', 'né limitato né periodico, quindi irrazionale'],
        ['$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational', '$5$ non è un quadrato perfetto, quindi $\\sqrt{5}$ è irrazionale'],
        ['der Betrag: ', 'il valore assoluto: '],
        ['natürliche Zahlen', 'numeri naturali'], ['ganze Zahlen', 'numeri interi'], ['rationale Zahlen', 'numeri razionali'], ['reelle Zahlen', 'numeri reali'],
        // zahlenbereiche: the answers
        ['$ liegt in $', '$ sta in $'], ['. Damit liegt sie auch in jedem größeren Bereich.', '. Quindi sta anche in ogni insieme più grande.'],
        ['Sie liegt zwar in $', 'È vero che sta in $'], ['$, aber es gibt einen <b>kleineren</b> Bereich.', '$, ma c’è un insieme <b>più piccolo</b>.'],
        ['Nein, $', 'No, $'], ['$ gehört nicht zu den ', '$ non appartiene ai '], ['. Tipp: ', '. Suggerimento: '],
        ['Lässt sie sich als Bruch schreiben?', 'Si può scrivere come frazione?'], ['Rechne sie zuerst aus.', 'Prima calcolalo.'],
        // komplex
        ['\\text{(an der reellen Achse gespiegelt)}', '\\text{(simmetrico rispetto all’asse reale)}'], [' · Betrag $', ' · modulo $'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.',
            'Poiché $\\mathrm{i}^2 = -1$, l’ultimo addendo diventa un numero reale. I moduli si moltiplicano, gli angoli si sommano.'],
        // schaltung: L is the lamp
        ['Term: $L = ', 'Espressione: $L = '], ['$ · jetzt: $a = ', '$ · ora: $a = '], ['$ → Lampe <b>', '$ → lampadina <b>'],

    ],
    rule: [
        // book it-4 mathefos11-it:
        // zahlenbereiche: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, 'Giuste: $1 su $2'],
        // schaltung: "Lampe <b>an</b>" / "<b>aus</b>" (the rules run before the pieces)
        [/Lampe <b>an<\/b>/g, 'Lampe <b>accesa</b>'], [/Lampe <b>aus<\/b>/g, 'Lampe <b>spenta</b>'],

    ]
});
