/* js/buch-en/zahlen.js — English for the widgets of js/buch-zahlen.js:
 *   titelbildfos11, zahlenbereiche, komplex, schaltung (book 4, mathefos11-en)
 * Loaded by the English editions right after js/buch-zahlen.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('zahlen', {
    word: {
        // titelbildfos11
        'Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm':
            'Cover picture: two lines with their point of intersection, a parabola, a function of degree three with three zeros and a bar chart',
        // zahlenbereiche
        'Kleinster Bereich:': 'Smallest set:', 'Nächste Zahl': 'Next number', 'DIE ZAHL': 'THE NUMBER', 'Richtig!': 'Correct!',
        'In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.':
            'Which is the <b>smallest</b> number set it belongs to? Tap a button or the picture.',
        'Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R': 'Number sets as nested sets: N in Z in Q in R',
        // komplex
        'Rechenart': 'Operation', 'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile': 'The complex plane with two complex numbers as arrows',
        'Ergebnis': 'Result',
        // schaltung
        'Reihe (UND)': 'Series (AND)', 'Parallel (ODER)': 'Parallel (OR)', 'Wechselschaltung': 'Two-way switch', 'Schaltung': 'Circuit',
        'Schalter $a$ umlegen': 'Flip switch $a$', 'Schalter $b$ umlegen': 'Flip switch $b$', 'Schalter a': 'Switch a', 'Schalter b': 'Switch b',
        'Quelle': 'Source', 'Stromkreis mit zwei Schaltern und einer Lampe': 'Circuit with two switches and a lamp',
        'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.': 'The lamp only lights up if <b>both</b> switches are closed.',
        'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.': 'The lamp lights up if <b>at least one</b> of the switches is closed.',
        'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.':
            'Staircase: either of the two switches can turn the lamp on and off. It lights up when both switches are in the <b>same</b> position.'
    },
    phrase: [
        // zahlenbereiche: why a number belongs to its set
        ['eine natürliche Zahl', 'a natural number'], ['eine negative ganze Zahl', 'a negative integer'],
        ['ein Bruch, der keine ganze Zahl ist', 'a fraction that is not an integer'], ['periodisch: ', 'recurring: '],
        ['$ ist irrational: nicht abbrechend und nicht periodisch', '$ is irrational: neither terminating nor recurring'], [' ist irrational', ' is irrational'],
        ['nicht abbrechend und nicht periodisch, also irrational', 'neither terminating nor recurring, so irrational'],
        ['$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational', '$5$ is not a square number, so $\\sqrt{5}$ is irrational'],
        ['der Betrag: ', 'the absolute value: '],
        ['natürliche Zahlen', 'natural numbers'], ['ganze Zahlen', 'integers'], ['rationale Zahlen', 'rational numbers'], ['reelle Zahlen', 'real numbers'],
        // zahlenbereiche: the answers
        ['$ liegt in $', '$ lies in $'], ['. Damit liegt sie auch in jedem größeren Bereich.', '. So it also lies in every larger set.'],
        ['Sie liegt zwar in $', 'It does lie in $'], ['$, aber es gibt einen <b>kleineren</b> Bereich.', '$, but there is a <b>smaller</b> set.'],
        ['Nein, $', 'No, $'], ['$ gehört nicht zu den ', '$ does not belong to the '], ['. Tipp: ', '. Hint: '],
        ['Lässt sie sich als Bruch schreiben?', 'Can it be written as a fraction?'], ['Rechne sie zuerst aus.', 'Work it out first.'],
        // komplex
        ['\\text{(an der reellen Achse gespiegelt)}', '\\text{(reflected in the real axis)}'], [' · Betrag $', ' · absolute value $'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.',
            'Because $\\mathrm{i}^2 = -1$, the last term becomes a real number. The absolute values multiply, the angles add.'],
        // schaltung
        ['$ · jetzt: $a = ', '$ · now: $a = '], ['$ → Lampe <b>', '$ → lamp <b>']
    ],
    rule: [
        // zahlenbereiche: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, 'Correct: $1 of $2'],
        // schaltung: "Lampe <b>an</b>" / "<b>aus</b>"
        [/Lampe <b>an<\/b>/g, 'Lampe <b>on</b>'], [/Lampe <b>aus<\/b>/g, 'Lampe <b>off</b>']
    ]
});
