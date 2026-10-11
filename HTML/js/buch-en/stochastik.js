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
    ],
    rule: [
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
    ]
});
