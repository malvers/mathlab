/* js/buch-en/spiele.js — English for the widgets of js/buch-spiele.js.
 * Loaded by the English editions right after js/buch-spiele.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('spiele', {
    word: {
        // book 10 mathegy10-en: verteilung (also book GY 8, mathegy8-en), spielstreuung, fairesspiel
        'Augensumme': 'Total score', 'Differenz': 'Difference', 'Maximum': 'Maximum', 'Anzahl Sechsen': 'Number of sixes', 'Zufallsgröße': 'Random variable',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Probability distribution as a bar chart',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'The 36 outcomes of two dice with the value of the random variable',
        '2. Würfel →': '2nd dice →',
        // spielstreuung
        'Münzwette': 'Coin bet', 'Glücksrad': 'Wheel of fortune', 'Los': 'Ticket', 'Spiel': 'Game', 'Noch einmal spielen': 'Play again',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Stake €1. Heads: €2 back, tails: nothing.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Stake €1. With probability $\\tfrac{1}{10}$ you get €10 back, otherwise nothing.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Stake €1. With probability $\\tfrac{1}{100}$ you get €100 back, otherwise nothing.',
        'Runde': 'Round', 'Kontostand in €': 'Balance in €', 'Kontostände von acht Spielern über hundert Runden': 'Balances of eight players over a hundred rounds',
        // fairesspiel
        'Beim Schulfest wirft man zwei Würfel. Ein <b>Pasch</b> (zwei gleiche Augenzahlen) bringt den ersten Preis, die <b>Augensumme 7</b> den zweiten, alles andere nichts. Der Einsatz ist in jedem Fall weg.':
            'At the school fair you throw two dice. A <b>double</b> (two equal scores) brings the first prize, the <b>total 7</b> the second, everything else nothing. The stake is gone in any case.',
        'Einsatz $e$': 'Stake $e$', 'Auszahlung bei Pasch': 'Payout for a double', 'Auszahlung bei Summe 7': 'Payout for the total 7',
        'Fairen Einsatz einstellen': 'Set the fair stake', '1000 Spiele': '1000 games',
        'Ergebnis': 'Result', 'Pasch': 'Double', 'Summe 7': 'Total 7', 'sonst': 'otherwise', 'Gewinn $x_i$ in €': 'Gain $x_i$ in €',
        'Lass das Spiel 1000-mal laufen und vergleiche den mittleren Gewinn mit dem Erwartungswert.': 'Let the game run 1000 times and compare the mean gain with the expected value.'
    },
    phrase: [
        // book 10 mathegy10-en
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'the total of the two scores'], ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'the difference between the two scores, the larger minus the smaller'],
        ['die größere der beiden Augenzahlen', 'the larger of the two scores'], ['wie viele der beiden Würfel eine Sechs zeigen', 'how many of the two dice show a six'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Tap a cell or a value.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' of the 36 equally likely outcomes belong to it. All the probabilities together add up to $1$.'],
        // spielstreuung
        ['Gewinn $X$ pro Spiel: $', 'Gain $X$ per game: $'], ['$ € mit $', '$ € with $'], [' = 0$: Das Spiel ist <b>fair</b>.', ' = 0$: the game is <b>fair</b>.'],
        ['Standardabweichung $\\sigma = \\sqrt{V(X)} \\approx ', 'Standard deviation $\\sigma = \\sqrt{V(X)} \\approx '],
        ['$ € · gestrichelt: $\\pm\\sigma\\sqrt{n}$, nach 100 Runden $\\pm ', '$ € · dashed: $\\pm\\sigma\\sqrt{n}$, after 100 rounds $\\pm '],
        ['Kontostände nach 100 Runden: ', 'Balances after 100 rounds: '],
        [' €. Gleicher Erwartungswert, aber je größer $\\sigma$, desto weiter liegen Gewinner und Verlierer auseinander: <b>$\\sigma$ misst das Risiko.</b>',
            ' €. The same expected value, but the larger $\\sigma$, the further apart the winners and losers are: <b>$\\sigma$ measures the risk.</b>'],
        // fairesspiel
        ['Das Spiel ist <b>fair</b>.', 'The game is <b>fair</b>.'],
        ['Für die Spielerin oder den Spieler <b>ungünstig</b>: Die Klasse verdient im Mittel ', '<b>Unfavourable</b> for the player: on average the class earns '],
        ['Für die Spielerin oder den Spieler <b>günstig</b>: Die Klasse verliert im Mittel ', '<b>Favourable</b> for the player: on average the class loses '],
        [' € pro Spiel.', ' € per game.'], [' Fair wäre der Einsatz $e = \\tfrac{', ' The fair stake would be $e = \\tfrac{'],
        [' €</b> pro Spiel (Erwartungswert ', ' €</b> per game (expected value ']
    ],
    rule: [
        // book 10 mathegy10-en
        // fairesspiel writes amounts with a decimal comma by hand and the number of games with toLocaleString('de-DE')
        [/(\d+),(\d{2}) € pro Spiel\./g, '€$1.$2 per game.'],
        [/Gespielt: (\d{1,3}(?:\.\d{3})*) Spiele, mittlerer Gewinn/g, (m, n) => 'Played: ' + n.replace(/\./g, ',') + ' games, mean gain']
    ]
});
