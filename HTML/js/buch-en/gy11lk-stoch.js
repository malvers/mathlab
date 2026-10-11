/* js/buch-en/gy11lk-stoch.js — English for the widgets of js/buch-gy11lk-stoch.js:
 *   geburtstag, umkehrbaum, galton (book 9, mathegy11lk-en)
 * Loaded by the English editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // umkehrbaum: the names of the four outcomes in the three examples, inside the legend and the "in numbers" sentence
    const TERM = {
        'krank': 'ill', 'gesund': 'healthy', 'positiv': 'positive', 'negativ': 'negative',
        'Spam': 'spam', 'kein Spam': 'no spam', 'enthält „Gratis“': 'contains “free”', 'ohne „Gratis“': 'without “free”',
        'Maschine 1': 'machine 1', 'Maschine 2': 'machine 2', 'defekt': 'defective', 'in Ordnung': 'fine'
    };
    const term = s => (Object.prototype.hasOwnProperty.call(TERM, s) ? TERM[s] : s);

    window.BuchEN && BuchEN.add('gy11lk-stoch', {
        word: {
            // geburtstag
            'Personen $n$': 'People $n$', '1000 Klassen simulieren': 'Simulate 1000 classes',
            'Wahrscheinlichkeit für mindestens zwei gleiche Geburtstage in Abhängigkeit von der Zahl der Personen':
                'Probability of at least two shared birthdays depending on the number of people',
            // umkehrbaum
            'Schnelltest': 'Rapid test', 'Spamfilter': 'Spam filter', 'Zwei Maschinen': 'Two machines', 'von 10 000': 'out of 10,000',
            'Baumdiagramm: erst A, dann B': 'Tree diagram: first A, then B', 'Umgekehrtes Baumdiagramm: erst B, dann A': 'Inverted tree diagram: first B, then A',
            'Dieses Bild braucht js/buch-stochastik.js.': 'This picture needs js/buch-stochastik.js.',
            // galton
            'Nagelreihen $n$': 'Rows of pins $n$', 'nach rechts mit $p$': 'to the right with $p$', 'Leeren': 'Clear',
            'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Relative frequencies of the slots compared with the binomial distribution'
        },
        phrase: [
            // geburtstag (numbers are already English here: the number rules run first)
            ['$ günstige von $365^{', '$ favourable out of $365^{'],
            ['}$ gleich wahrscheinlichen Ergebnissen, also $P(\\text{alle verschieden}) \\approx ', '}$ equally likely outcomes, so $P(\\text{all different}) \\approx '],
            ['$P(\\text{mindestens zwei gleich}) = 1 - ', '$P(\\text{at least two the same}) = 1 - '],
            // umkehrbaum
            ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
                'The first tree gives the numerator and the denominator, the inverted tree shows the result on its upper branch after $B$.'],
            ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$: nothing can be calculated given $B$.'],
            // galton
            ['$ für $X \\sim B(', '$ for $X \\sim B('], ['Mittleres Fach $', 'Mean slot $'], ['$, Erwartungswert $n \\cdot p = ', '$, expected value $n \\cdot p = '],
            // the pieces of the sentences that a rule below translates as a whole (so tools/buch-en/check.mjs sees them translated, too)
            [' Geburtstage verschieden: $', ' birthdays different: $'], [' In 1000 simulierten Klassen hatten ', ' In 1000 simulated classes, '], [' einen doppelten Geburtstag.', ' had a shared birthday.'],
            ['kein Spam', 'no spam'], ['enthält „Gratis“', 'contains “free”'], ['ohne „Gratis“', 'without “free”'], ['Maschine 1', 'machine 1'], ['Maschine 2', 'machine 2'], ['in Ordnung', 'fine'],
            ['In Zahlen: Von ', 'In numbers: of '], [' Fällen mit „', ' cases with “'], ['“ sind ', '”, '],
            ['Galtonbrett mit ', 'Galton board with '], [' Nagelreihen', ' rows of pins'],
            [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' balls. Bars: relative frequency per slot, dots: $P(X = k)$ for $X \\sim B('],
            ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.', 'Let balls drop: each one hits $n$ pins and bounces right with $p$ each time.']
        ],
        rule: [
            // geburtstag: "Alle 23 Geburtstage verschieden: $…" and the simulation
            [/Alle (\d+) Geburtstage verschieden: \$/g, 'All $1 birthdays different: $'],
            [/ In 1,?000 simulierten Klassen hatten ([\d,]+) einen doppelten Geburtstag\./g, (m, k) => ' In 1000 simulated classes, ' + k + (k === '1' ? ' class' : '') + ' had a shared birthday.'],
            // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ."
            [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/,
                (m, a, na, b, nb) => '$A$: ' + term(a) + ', $\\overline{A}$: ' + term(na) + ', $B$: ' + term(b) + ', $\\overline{B}$: ' + term(nb) + '.'],
            // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“."
            [/In Zahlen: Von ([\d,]+) Fällen mit „(.+?)“ sind ([\d,]+) „(.+?)“\./g,
                (m, all, b, hit, a) => 'In numbers: of ' + all + ' cases with “' + term(b) + '”, ' + hit + ' are “' + term(a) + '”.'],
            // galton: the board in the aria label and the count of balls
            [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Galton board with ' + n + (n === '1' ? ' row' : ' rows') + ' of pins'],
            [/([\d,]+) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$/g, (m, k) => k + (k === '1' ? ' ball' : ' balls') + '. Bars: relative frequency per slot, dots: $']
        ]
    });
})();
