/* js/buch-es/zahlen.js — Spanish for the widgets of js/buch-zahlen.js.
 * Loaded by the Spanish editions right after js/buch-zahlen.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('zahlen', {
    word: {
        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)
        // titelbildfos11
        'Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm':
            'Portada: dos rectas con su punto de intersección, una parábola, una función de tercer grado con tres ceros y un diagrama de barras',
        // zahlenbereiche
        'Kleinster Bereich:': 'Conjunto más pequeño:', 'Nächste Zahl': 'Siguiente número', 'DIE ZAHL': 'EL NÚMERO', 'Richtig!': '¡Correcto!',
        'In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.':
            '¿En qué conjunto numérico <b>más pequeño</b> está? Toca un botón o la figura.',
        'Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R': 'Conjuntos numéricos como conjuntos encajados: N en Z en Q en R',
        // komplex
        'Rechenart': 'Operación', 'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile': 'Plano de Gauss con dos números complejos como flechas',
        'Ergebnis': 'Resultado',
        // schaltung
        'Reihe (UND)': 'Serie (Y)', 'Parallel (ODER)': 'Paralelo (O)', 'Wechselschaltung': 'Circuito conmutado', 'Schaltung': 'Circuito',
        'Schalter $a$ umlegen': 'Accionar el interruptor $a$', 'Schalter $b$ umlegen': 'Accionar el interruptor $b$', 'Schalter a': 'Interruptor a', 'Schalter b': 'Interruptor b',
        'Quelle': 'Fuente', 'Stromkreis mit zwei Schaltern und einer Lampe': 'Circuito eléctrico con dos interruptores y una lámpara',
        'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.': 'La lámpara solo se enciende si los <b>dos</b> interruptores están cerrados.',
        'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.': 'La lámpara se enciende si <b>al menos uno</b> de los interruptores está cerrado.',
        'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.':
            'Escalera: cualquiera de los dos interruptores puede encender y apagar la lámpara. Se enciende si los dos interruptores están en la <b>misma</b> posición.',

        // book es mathegy10-es (Lovelace)

    },
    phrase: [
        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)
        // zahlenbereiche: why a number belongs to its set
        ['eine natürliche Zahl', 'un número natural'], ['eine negative ganze Zahl', 'un número entero negativo'],
        ['ein Bruch, der keine ganze Zahl ist', 'una fracción que no es un número entero'], ['periodisch: ', 'periódico: '],
        ['$ ist irrational: nicht abbrechend und nicht periodisch', '$ es irracional: ni exacto ni periódico'], [' ist irrational', ' es irracional'],
        ['nicht abbrechend und nicht periodisch, also irrational', 'ni exacto ni periódico, así que irracional'],
        ['$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational', '$5$ no es un cuadrado perfecto, así que $\\sqrt{5}$ es irracional'],
        ['der Betrag: ', 'el valor absoluto: '],
        ['natürliche Zahlen', 'números naturales'], ['ganze Zahlen', 'números enteros'], ['rationale Zahlen', 'números racionales'], ['reelle Zahlen', 'números reales'],
        // zahlenbereiche: the answers
        ['$ liegt in $', '$ está en $'], ['. Damit liegt sie auch in jedem größeren Bereich.', '. Por tanto, también está en cualquier conjunto mayor.'],
        ['Sie liegt zwar in $', 'Sí que está en $'], ['$, aber es gibt einen <b>kleineren</b> Bereich.', '$, pero hay un conjunto <b>más pequeño</b>.'],
        ['Nein, $', 'No, $'], ['$ gehört nicht zu den ', '$ no pertenece a los '], ['. Tipp: ', '. Pista: '],
        ['Lässt sie sich als Bruch schreiben?', '¿Se puede escribir como fracción?'], ['Rechne sie zuerst aus.', 'Calcúlalo primero.'],
        // komplex
        ['\\text{(an der reellen Achse gespiegelt)}', '\\text{(reflejado en el eje real)}'], [' · Betrag $', ' · módulo $'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.',
            'Como $\\mathrm{i}^2 = -1$, el último sumando se convierte en un número real. Los módulos se multiplican y los ángulos se suman.'],
        // schaltung: L is the lamp
        ['Term: $L = ', 'Expresión: $L = '], ['$ · jetzt: $a = ', '$ · ahora: $a = '], ['$ → Lampe <b>', '$ → lámpara <b>'],

        // book es mathegy10-es (Lovelace)

    ],
    rule: [
        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)
        // zahlenbereiche: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, 'Correctos: $1 de $2'],
        // schaltung: "Lampe <b>an</b>" / "<b>aus</b>" (the rules run before the pieces)
        [/Lampe <b>an<\/b>/g, 'Lampe <b>encendida</b>'], [/Lampe <b>aus<\/b>/g, 'Lampe <b>apagada</b>'],

        // book es mathegy10-es (Lovelace)

    ]
});
