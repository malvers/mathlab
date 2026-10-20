/* js/buch-it/spiele.js — Italian for the widgets of js/buch-spiele.js.
 * Loaded by the Italian editions right after js/buch-spiele.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/spiele.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('spiele', {
    word: {
        // book it-13 mathegy8-it:
        // verteilung (Augensumme, Glücksrad, Zufallsgröße: js/buch-it/stochastik.js), and the module constants of spielstreuung that tools/buch-en/check.mjs reads for every page
        'Differenz': 'Differenza', 'Maximum': 'Massimo', 'Anzahl Sechsen': 'Numero di sei',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribuzione di probabilità come diagramma a barre',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'I 36 esiti di due dadi con il valore della variabile aleatoria',
        '2. Würfel →': '2° dado →',
        'Münzwette': 'Scommessa sulla moneta', 'Los': 'Biglietto della lotteria',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Puntata 1 €. Testa: ti restituiscono 2 €, croce: niente.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Puntata 1 €. Con probabilità $\\tfrac{1}{10}$ ti restituiscono 10 €, altrimenti niente.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Puntata 1 €. Con probabilità $\\tfrac{1}{100}$ ti restituiscono 100 €, altrimenti niente.',

        // book it-15 mathegy10-it:
        // verteilung and the module constants of spielstreuung (reported for every page that loads the module)
        'Differenz': 'Differenza', 'Maximum': 'Massimo', 'Anzahl Sechsen': 'Numero di sei',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'I 36 esiti di due dadi con il valore della variabile aleatoria',
        '2. Würfel →': '2° dado →',
        'Münzwette': 'Scommessa con la moneta', 'Glücksrad': 'Ruota della fortuna', 'Los': 'Biglietto',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Puntata 1 €. Testa: ti restituiscono 2 €, croce: niente.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Puntata 1 €. Con probabilità $\\tfrac{1}{10}$ ti restituiscono 10 €, altrimenti niente.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Puntata 1 €. Con probabilità $\\tfrac{1}{100}$ ti restituiscono 100 €, altrimenti niente.',
        // spielstreuung
        'Spiel': 'Gioco', 'Noch einmal spielen': 'Gioca ancora', 'Runde': 'Partita', 'Kontostand in €': 'Saldo in €',
        'Kontostände von acht Spielern über hundert Runden': 'Saldi di otto giocatori nel corso di cento partite',
        // fairesspiel
        'Beim Schulfest wirft man zwei Würfel. Ein <b>Pasch</b> (zwei gleiche Augenzahlen) bringt den ersten Preis, die <b>Augensumme 7</b> den zweiten, alles andere nichts. Der Einsatz ist in jedem Fall weg.':
            'Alla festa della scuola si lanciano due dadi. Un <b>doppio</b> (due punteggi uguali) dà il primo premio, la <b>somma dei punti 7</b> il secondo, tutto il resto niente. La puntata si perde in ogni caso.',
        'Einsatz $e$': 'Puntata $e$', 'Auszahlung bei Pasch': 'Vincita con un doppio', 'Auszahlung bei Summe 7': 'Vincita con la somma 7',
        'Fairen Einsatz einstellen': 'Imposta la puntata equa', 'Pasch': 'Doppio', 'Summe 7': 'Somma 7', 'sonst': 'altro', 'Gewinn $x_i$ in €': 'Guadagno $x_i$ in €',
        'Lass das Spiel 1000-mal laufen und vergleiche den mittleren Gewinn mit dem Erwartungswert.': 'Fai girare il gioco 1000 volte e confronta il guadagno medio con il valore atteso.',

        // book it-16 mathe6-it:

        // book it-20 mathe10-it:

    },
    phrase: [
        // book it-13 mathegy8-it:
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'la somma dei due punteggi'], ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'la distanza tra i due punteggi, il maggiore meno il minore'],
        ['die größere der beiden Augenzahlen', 'il maggiore dei due punteggi'], ['wie viele der beiden Würfel eine Sechs zeigen', 'quanti dei due dadi mostrano un sei'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Tocca una casella o un valore.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' dei 36 esiti ugualmente probabili ne fanno parte. Tutte le probabilità insieme danno $1$.'],

        // book it-15 mathegy10-it:
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'la somma dei due punteggi'], ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'la distanza tra i due punteggi, il maggiore meno il minore'],
        ['die größere der beiden Augenzahlen', 'il maggiore dei due punteggi'], ['wie viele der beiden Würfel eine Sechs zeigen', 'quanti dei due dadi mostrano un sei'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Tocca una casella o un valore.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' dei 36 esiti ugualmente probabili gli appartengono. Tutte le probabilità insieme danno $1$.'],
        // spielstreuung
        ['Gewinn $X$ pro Spiel: $', 'Guadagno $X$ per partita: $'], ['$ € mit $', '$ € con $'], [' = 0$: Das Spiel ist <b>fair</b>.', ' = 0$: il gioco è <b>equo</b>.'],
        ['Standardabweichung $\\sigma = \\sqrt{V(X)} \\approx ', 'Deviazione standard $\\sigma = \\sqrt{V(X)} \\approx '],
        ['$ € · gestrichelt: $\\pm\\sigma\\sqrt{n}$, nach 100 Runden $\\pm ', '$ € · tratteggiato: $\\pm\\sigma\\sqrt{n}$, dopo 100 partite $\\pm '],
        ['Kontostände nach 100 Runden: ', 'Saldi dopo 100 partite: '],
        [' €. Gleicher Erwartungswert, aber je größer $\\sigma$, desto weiter liegen Gewinner und Verlierer auseinander: <b>$\\sigma$ misst das Risiko.</b>',
            ' €. Stesso valore atteso, ma più grande è $\\sigma$, più vincitori e perdenti sono lontani: <b>$\\sigma$ misura il rischio.</b>'],
        // fairesspiel
        ['Das Spiel ist <b>fair</b>.', 'Il gioco è <b>equo</b>.'],
        ['Für die Spielerin oder den Spieler <b>ungünstig</b>: Die Klasse verdient im Mittel ', '<b>Sfavorevole</b> per chi gioca: la classe guadagna in media '],
        ['Für die Spielerin oder den Spieler <b>günstig</b>: Die Klasse verliert im Mittel ', '<b>Favorevole</b> per chi gioca: la classe perde in media '],
        [' € pro Spiel.', ' € a partita.'], [' Fair wäre der Einsatz $e = \\tfrac{', ' Equa sarebbe la puntata $e = \\tfrac{'],
        ['Gespielt: ', 'Partite giocate: '], [' Spiele, mittlerer Gewinn <b>', ', guadagno medio <b>'], [' €</b> pro Spiel (Erwartungswert ', ' €</b> per partita (valore atteso '],

        // book it-16 mathe6-it:

        // book it-20 mathe10-it:

    ],
    rule: [
        // book it-13 mathegy8-it:
        // verteilung: one outcome takes the singular
        [/· 1 der 36 gleich wahrscheinlichen Ergebnisse gehören dazu\./g, '· 1 dei 36 esiti ugualmente probabili ne fa parte.'],

        // book it-15 mathegy10-it:
        // verteilung: one outcome takes the singular
        [/· 1 der 36 gleich wahrscheinlichen Ergebnisse gehören dazu\./g, '· 1 dei 36 esiti ugualmente probabili gli appartiene.'],

        // book it-16 mathe6-it:

        // book it-20 mathe10-it:

    ]
});
