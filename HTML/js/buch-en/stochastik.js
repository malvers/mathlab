/* js/buch-en/stochastik.js — English for the widgets of js/buch-stochastik.js:
 *   baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
 * Loaded by the English editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('stochastik', {
    word: {
        // stochastics: trees, rapid test, four-field trainer, simulator, goats
        'Baumdiagramm': 'Tree diagram', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Tree diagram: two balls without replacement',
        'Rot': 'Red', 'Blau': 'Blue', 'eine rote Kugel weniger': 'one red ball fewer', 'eine rote Kugel mehr': 'one more red ball',
        'eine blaue Kugel weniger': 'one blue ball fewer', 'eine blaue Kugel mehr': 'one more blue ball',
        'Anzahl der Züge': 'Number of draws', '2 Züge': '2 draws', '3 Züge': '3 draws', 'Ziehen': 'Drawing',
        'ohne Zurücklegen': 'without replacement', 'mit Zurücklegen': 'with replacement', 'Urne:': 'Urn:',
        'Ereignis wählen:': 'Choose an event:', 'Ereignis': 'Event', 'Baumdiagramm der Urne': 'Tree diagram of the urn', 'unmöglich': 'impossible',
        'beide Rot': 'both red', 'alle Rot': 'all red', 'genau einmal Rot': 'red exactly once', 'mindestens einmal Rot': 'red at least once',
        'keinmal Rot': 'never red', 'beide gleich': 'both the same', 'alle gleich': 'all the same', 'leeren': 'clear',
        'Anteil der Erkrankten': 'Proportion of people who are ill', 'Test erkennt Kranke (Sensitivität)': 'Test identifies the ill (sensitivity)',
        'Test erkennt Gesunde (Spezifität)': 'Test identifies the healthy (specificity)', 'Darstellung': 'Display',
        'Anzahlen (von 10 000)': 'Counts (out of 10,000)', 'Wahrscheinlichkeiten': 'Probabilities', 'Anzahlen': 'Counts',
        'positiv $T^+$': 'positive $T^+$', 'negativ $T^-$': 'negative $T^-$', 'krank $K$': 'ill $D$', 'gesund $\\overline{K}$': 'healthy $\\overline{D}$',
        'krank': 'ill', 'gesund': 'healthy', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Tree diagram: ill or healthy, then test result',
        'Neue Tafel': 'New table', 'A und B': 'A and B', 'A und nicht B': 'A and not B', 'nicht A und B': 'not A and B', 'nicht A und nicht B': 'not A and not B',
        'A gesamt': 'A total', 'nicht A gesamt': 'not A total', 'B gesamt': 'B total', 'nicht B gesamt': 'not B total', 'gesamt': 'total',
        'Münze': 'Coin', 'Würfel': 'Dice', 'Zwei Würfel': 'Two dice', 'Urne': 'Urn', 'Wappen': 'heads', 'Sechs': 'six', 'Augensumme 7': 'total score 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'both red (3 red, 2 blue, without replacement)',
        'mindestens eine Sechs in vier Würfen': 'at least one six in four rolls', 'Zufallsversuch': 'Random experiment', 'Durchführen:': 'Run:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Relative frequency depending on the number of trials',
        'VERSUCHE n': 'TRIALS n', 'TREFFER': 'HITS', 'REL. HÄUFIGKEIT': 'REL. FREQUENCY', 'WAHRSCHEINLICHKEIT': 'PROBABILITY',
        'Noch kein Versuch – starte mit +1 oder +10.': 'No trial yet – start with +1 or +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.': 'Behind one door there is a car, behind each of the other two a goat. Choose a door.',
        'Neues Spiel': 'New game', '1000 Spiele vom Rechner spielen lassen': 'Let the computer play 1,000 games',
        'Strategie': 'Strategy', 'Spiele': 'Games', 'Autos': 'Cars', 'Gewinnquote': 'Win rate',
        'du: bleiben': 'you: stay', 'du: wechseln': 'you: switch', 'Rechner: bleiben': 'computer: stay', 'Rechner: wechseln': 'computer: switch',
        // histo-hero, unabhaengig, zufallsgroesse, binomial, bernoulli-baum (book 2, mathe12-en)
        'Histogramm einer Binomialverteilung': 'Histogram of a binomial distribution',
        'Unabhängig machen': 'Make independent', 'Unvereinbar machen': 'Make mutually exclusive',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Unit square: share of A in B and in not B',
        'Drei Münzen': 'Three coins', 'Augensumme': 'Total score', 'Glücksrad': 'Spinner', 'Zufallsgröße': 'Random variable',
        'Einsatz': 'Stake', 'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Probability distribution as a bar chart',
        'Spielen:': 'Play:', 'SPIELE n': 'GAMES n', 'MITTELWERT': 'MEAN', 'ERWARTUNGSWERT': 'EXPECTED VALUE', 'LETZTE': 'LATEST',
        'Anzahl der Versuche $n$': 'Number of trials $n$', 'Trefferwahrscheinlichkeit $p$': 'Probability of a hit $p$',
        'Was wird berechnet?': 'What is calculated?', 'Histogramm der Binomialverteilung': 'Histogram of the binomial distribution',
        'Stufen $n$:': 'Stages $n$:', 'Anzahl der Stufen': 'Number of stages', 'Genau $k$ Treffer:': 'Exactly $k$ hits:',
        'Anzahl der Treffer': 'Number of hits', 'Baumdiagramm einer Bernoulli-Kette': 'Tree diagram of a Bernoulli chain',
        // book 3 mathe13-en: stichprobe, signifikanztest
        'Anteil in der Grundgesamtheit $p$': 'Proportion in the population $p$', 'Stichprobenumfang $n$': 'Sample size $n$',
        'Stichproben ziehen:': 'Draw samples:', 'Verteilung der relativen Häufigkeiten vieler Stichproben': 'Distribution of the relative frequencies of many samples',
        'Noch keine Stichprobe gezogen.': 'No sample drawn yet.',
        'Nullhypothese $p_0$': 'Null hypothesis $p_0$', 'linksseitig': 'left-tailed', 'rechtsseitig': 'right-tailed', 'zweiseitig': 'two-tailed',
        'Art des Tests': 'Type of test', 'Signifikanzniveau $\\alpha$:': 'Significance level $\\alpha$:', 'Signifikanzniveau': 'Significance level',
        'Beobachtete Trefferzahl $k$': 'Observed number of hits $k$', 'Fehler 2. Art zeigen: wahres $p$ =': 'Show type II error: true $p$ =',
        'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich': 'Binomial distribution under the null hypothesis with rejection region',
        // book 4 mathefos11-en: venn, urne, pascal
        'Ein Glücksrad hat 12 gleich große Felder: $\\Omega = \\{1; 2; \\ldots; 12\\}$. Wähle eine Vorlage oder stell $A$ und $B$ selbst zusammen: Ereignis wählen, dann Zahlen antippen.':
            'A spinner has 12 equal sectors: $\\Omega = \\{1, 2, \\ldots, 12\\}$. Choose a template or put $A$ and $B$ together yourself: choose the event, then tap the numbers.',
        'gerade · Vielfaches von 3': 'even · multiple of 3', 'Primzahl · größer als 6': 'prime · greater than 6', 'unvereinbar': 'mutually exclusive',
        'Vorlage': 'Template', '$A$ bearbeiten': 'Edit $A$', '$B$ bearbeiten': 'Edit $B$', 'Ereignis bearbeiten': 'Edit event',
        'Verknüpfung:': 'Combination:', 'Verknüpfung': 'Combination', 'Mengendiagramm der Ereignisse A und B': 'Venn diagram of the events A and B',
        'Kugeln $n$': 'Balls $n$', 'Ziehungen $k$': 'Draws $k$', 'n kleiner': 'n smaller', 'n größer': 'n larger', 'k kleiner': 'k smaller', 'k größer': 'k larger',
        'mit Reihenfolge': 'with order', 'ohne Reihenfolge': 'without order', 'Reihenfolge': 'Order',
        'ohne Zurücklegen': 'without replacement', 'mit Zurücklegen': 'with replacement', 'Zurücklegen': 'Replacement', 'Einmal ziehen': 'Draw once', 'URNE': 'URN',
        '$n$ (Zeile)': '$n$ (row)', '$k$ (Stelle)': '$k$ (position)', 'Pascalsches Dreieck bis zur Zeile 10': 'Pascal’s triangle up to row 10',
    },
    phrase: [
        // stochastics
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Click on the ends of the paths (on the right of the tree) or choose an event above. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'The book works out the path rules for you.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1st path rule</b> (multiply along the path):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2nd path rule</b> (add the paths):'],
        ['aber nur <b>', 'but only <b>'], ['</b> davon sind wirklich krank.', '</b> of them are really ill.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proportion of the ill among those who test positive: '],
        [' alles richtig', ' all correct'], ['Ereignis: <b>', 'Event: <b>'], ['Zuletzt: ', 'Latest: '],
        ['TÜR', 'DOOR'], ['Tür', 'Door'], ['Gewonnen – das Auto! ', 'You won – the car! '], ['Leider eine Ziege. ', 'Sorry, a goat. '],
        ['Du hast gewechselt.', 'You switched.'], ['Du bist geblieben.', 'You stayed.'],
        // unabhaengig
        ['$ und $P(A \\cap B) = ', '$ and $P(A \\cap B) = '],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.',
            '<b>Independent:</b> whether $B$ happens or not, the share of $A$ stays the same. In the square the boundary is at the same height in both columns.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.',
            '<b>Mutually exclusive</b> ($A \\cap B = \\emptyset$) and therefore <b>dependent</b>: if $B$ happens, $A$ can no longer happen.'],
        ['<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ', '<b>Dependent:</b> $B$ changes the probability of $A$ '],
        ['nach oben.', 'upwards.'], ['nach unten.', 'downwards.'],
        // zufallsgroesse
        ['Augensumme zweier Würfel', 'total score of two dice'], ['Anzahl Wappen', 'number of heads'], ['Augenzahl', 'score'],
        ['Gewinn = Auszahlung − Einsatz', 'gain = payout − stake'], ['Gewinn bei 1 € Einsatz', 'gain with a stake of €1'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Payouts €0, €1, €2, €10 with the probabilities '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.',
            ' You bet €1 on a number, then three dice are rolled. For every dice showing your number you win €1, otherwise your stake is lost.'],
        ['Erwartungswert: $E(X)', 'Expected value: $E(X)'], [' · Das Spiel ist <b>fair</b>.', ' · The game is <b>fair</b>.'],
        [' · Auf lange Sicht <b>verlierst</b> du im Mittel ', ' · In the long run you <b>lose</b> on average '],
        [' · Auf lange Sicht <b>gewinnst</b> du im Mittel ', ' · In the long run you <b>win</b> on average '], [' € pro Spiel.', ' € per game.'],
        ['Varianz: $V(X)', 'Variance: $V(X)'], ['$ · Standardabweichung: $', '$ · standard deviation: $'],
        // binomial
        ['$X$ ist binomialverteilt mit $n = ', '$X$ is binomially distributed with $n = '], ['$ und $p = ', '$ and $p = '],
        ['Erwartungswert $\\mu', 'Expected value $\\mu'], ['$ · Standardabweichung $', '$ · standard deviation $'],
        // bernoulli-baum
        ['Pfade mit genau ', 'Paths with exactly '], [' Treffern: $', ' hits: $'], ['$ · jeder hat die Wahrscheinlichkeit $', '$ · each has the probability $'],
        ['Formel von Bernoulli: $P(X = ', "Bernoulli's formula: $P(X = "],
        // book 3 mathe13-en: stichprobe
        [' Stichproben vom Umfang ', ' samples of size '], [' · letzte: $h = ', ' · latest: $h = '],
        ['Mittelwert der $h$: $', 'Mean of the $h$: $'], ['$ · Standardabweichung der $h$: $', '$ · standard deviation of the $h$: $'],
        ['Theorie: $', 'Theory: $'], ['$. Viermal so großes $n$ halbiert die Streuung.', '$. An $n$ four times as large halves the spread.'],
        // book 3 mathe13-en: signifikanztest
        ['$ gegen $H_1\\colon ', '$ against $H_1\\colon '], ['Ablehnungsbereich (rot): $', 'Rejection region (red): $'],
        ['$ · tatsächliche Irrtumswahrscheinlichkeit $\\approx ', '$ · actual probability of error $\\approx '], ['Beobachtet $k = ', 'Observed $k = '],
        ['<b>$H_0$ wird abgelehnt.</b> Das Ergebnis ist signifikant.', '<b>$H_0$ is rejected.</b> The result is significant.'],
        ['<b>$H_0$ wird nicht abgelehnt.</b> Das beweist aber nicht, dass $H_0$ stimmt.', '<b>$H_0$ is not rejected.</b> But that does not prove that $H_0$ is true.'],
        ['Ist in Wahrheit $p = ', 'If in truth $p = '], ['$ (violett), wird $H_0$ mit $\\beta \\approx ', '$ (violet), $H_0$ is wrongly kept with $\\beta \\approx '],
        ['$ fälschlich beibehalten (Fehler 2. Art).', '$ (type II error).'],
        // book 4 mathefos11-en: venn
        ['($A$ oder $B$ (oder beide))', '($A$ or $B$ (or both))'], ['($A$ und $B$)', '($A$ and $B$)'], ['(nicht $A$)', '(not $A$)'],
        ['(weder $A$ noch $B$)', '(neither $A$ nor $B$)'], ['(nicht $A$ und nicht $B$)', '(not $A$ and not $B$)'], ['(nicht beide)', '(not both)'],
        ['(nicht $A$ oder nicht $B$)', '(not $A$ or not $B$)'], ['Additionssatz: $', 'Addition rule: $'],
        [' · $A$ und $B$ sind <b>unvereinbar</b> ($A \\cap B = \\emptyset$), es wird nichts doppelt gezählt.', ' · $A$ and $B$ are <b>mutually exclusive</b> ($A \\cap B = \\emptyset$), nothing is counted twice.'],
        ['Gegenereignis: $', 'Complementary event: $'], ['Die Zahlen, die in beiden Ereignissen liegen.', 'The numbers that lie in both events.'],
        ['$A \\cap B = \\emptyset$: Die Ereignisse sind <b>unvereinbar</b>, sie können nicht zusammen eintreten.', '$A \\cap B = \\emptyset$: the events are <b>mutually exclusive</b>, they cannot occur together.'],
        ['Regel von de Morgan: $', 'De Morgan’s law: $'], ['$. Wähle die andere Seite und vergleiche: Es ist dieselbe Menge.', '$. Choose the other side and compare: it is the same set.'],
        // book 4 mathefos11-en: urne
        ['Variation mit Wiederholung', 'Variation with repetition'], ['Permutation (alle Kugeln, mit Reihenfolge)', 'Permutation (all balls, with order)'],
        ['Variation ohne Wiederholung', 'Variation without repetition'], ['Kombination ohne Wiederholung', 'Combination without repetition'],
        ['Kombination mit Wiederholung', 'Combination with repetition'], ['</b> · Beispiel: ', '</b> · example: '], ['Anzahl der Möglichkeiten: ', 'Number of possibilities: '],
        ['Gezogen: <b>', 'Drawn: <b>'], ['Ergebnisse als Tupel $(\\ldots)$: Die Reihenfolge zählt.', 'Outcomes as tuples $(\\ldots)$: the order counts.'],
        ['Ergebnisse als Mengen $\\{\\ldots\\}$: Die Reihenfolge zählt nicht.', 'Outcomes as sets $\\{\\ldots\\}$: the order does not count.'],
        [' Genau dafür gibt es die Formel.', ' That is exactly what the formula is for.'],
        // book 4 mathefos11-en: pascal
        [': So viele Möglichkeiten gibt es, $', ': that is how many ways there are to choose $'], ['$ aus $', '$ from $'], ['$ auszuwählen.', '$.'],
        ['Summenregel (grün umrandet): $', 'Sum rule (outlined in green): $'], ['Symmetrie (gestrichelt): $', 'Symmetry (dashed): $'],
        ['Die Mitte der Zeile: $', 'The middle of the row: $'], ['}$ ist hier sein eigenes Spiegelbild.', '}$ is its own mirror image here.'],
    ],
    rule: [
        // bernoulli-baum: the paths are labelled T (Treffer) and N (Niete) → H (hit) and M (miss)
        [/(<text\b[^>]*>)([TN]{1,4})(<\/text>)/g, (m, a, k, b) => a + k.replace(/T/g, 'H').replace(/N/g, 'M') + b],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 of $2 correct'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Of 10,000 people, <b>' + n + '</b> test positive – '],
        [/(font-weight:700">)K(<\/text>)/g, '$1D$2'], [/(font-weight:700">)G(<\/text>)/g, '$1H$2'],
        // simulator: coin results W/Z → H/T
        [/(margin-right:10px">)W</g, '$1H<'], [/(margin-right:10px">)Z</g, '$1T<'],
        // goats
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'The host knows where the car is and opens door $1: a goat. Do you stay or switch?'],
        [/Bei Tür (\d) bleiben/g, 'Stay with door $1'], [/Zu Tür (\d) wechseln/g, 'Switch to door $1'],
        // book 4 mathefos11-en: venn, sets in TeX "\{2;\,4\}" → "\{2,\,4\}"; urne, outcomes "(1; 2)" and "{1; 2}" → "(1, 2)"
        [/(\d);\\,(?=\d)/g, '$1,\\,'], [/[({]\d+(?:; \d+)+[)}]/g, m => m.replace(/; /g, ', ')],
        // book 4 mathefos11-en: urne, the examples and the count
        [/ein Zahlenschloss mit (\d+) Rädern zu je (\d+) Ziffern/g, 'a combination lock with $1 wheels of $2 digits each'],
        [/(\d+) Personen stellen sich in eine Reihe/g, '$1 people stand in a row'],
        [/ein Siegerpodest: (\d+) von (\d+) Startern auf die Plätze 1 bis (\d+)/g, 'a podium: $1 of $2 starters on places 1 to $3'],
        [/Lotto: (\d+) aus (\d+) Zahlen, die Reihenfolge der Ziehung zählt nicht/g, 'Lottery: $1 from $2 numbers, the order of the draw does not count'],
        [/(\d+) Kugeln Eis aus (\d+) Sorten, eine Sorte darf mehrfach vorkommen/g, '$1 scoops of ice cream from $2 flavours, a flavour may occur more than once'],
        [/(\d{1,3}(?:\.\d{3})*) Möglichkeiten sind zu viele zum Auflisten\./g, (m, c) => c.replace(/\./g, ',') + ' possibilities are too many to list.'],
        // book 4 mathefos11-en: pascal, "$, denn $2$ auswählen heißt $3$ weglassen."
        [/\$, denn \$(\d+)\$ auswählen heißt \$(\d+)\$ weglassen\./g, (m, k, r) => '$, because choosing $' + k + '$ means leaving out $' + r + '$.'],
    ]
});
