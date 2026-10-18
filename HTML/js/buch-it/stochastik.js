/* js/buch-it/stochastik.js — Italian for the widgets of js/buch-stochastik.js.
 * Loaded by the Italian editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/stochastik.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('stochastik', {
    word: {
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        'Anzahlen (von 10 000)': 'Frequenze (su 10 000)',
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagramma ad albero: due palline senza reimmissione',
        'Baumdiagramm': 'Diagramma ad albero',
        'gerade · Vielfaches von 3': 'pari · multiplo di 3',
        'Primzahl · größer als 6': 'primo · maggiore di 6',
        'Anteil der Erkrankten': 'Proporzione di malati',
        'Test erkennt Kranke (Sensitivität)': 'Il test riconosce i malati (sensibilità)',
        'Test erkennt Gesunde (Spezifität)': 'Il test riconosce i sani (specificità)',
        'positiv $T^+$': 'positivo $T^+$',
        'negativ $T^-$': 'negativo $T^-$',
        'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagramma ad albero: malato o sano, poi il risultato del test',
        'Unabhängig machen': 'Rendi indipendenti',
        'Unvereinbar machen': 'Rendi incompatibili',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Quadrato unitario: parte di A in B e in non B',
        'A und B': 'A e B',
        'A und nicht B': 'A e non B',
        'nicht A und B': 'non A e B',
        'nicht A und nicht B': 'non A e non B',
        'A gesamt': 'totale di A',
        'nicht A gesamt': 'totale di non A',
        'B gesamt': 'totale di B',
        'nicht B gesamt': 'totale di non B',
        'Darstellung': 'Rappresentazione',
        'Wahrscheinlichkeiten': 'Probabilità',
        'Anzahlen': 'Frequenze assolute',
        'Neue Tafel': 'Nuova tabella',
        'Drei Münzen': 'Tre monete',
        'Augensumme': 'Somma dei punti',
        'Glücksrad': 'Ruota della fortuna',
        'Zufallsgröße': 'Variabile aleatoria',
        'Einsatz': 'Puntata',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribuzione di probabilità come diagramma a barre',
        'Spielen:': 'Gioca:',
        'SPIELE n': 'PARTITE n',
        'MITTELWERT': 'MEDIA',
        'LETZTE': 'ULTIME',
        'Stufen $n$:': 'Stadi $n$:',
        'Anzahl der Stufen': 'Numero di stadi',
        'Trefferwahrscheinlichkeit $p$': 'Probabilità di successo $p$',
        'Genau $k$ Treffer:': 'Esattamente $k$ successi:',
        'Anzahl der Treffer': 'Numero di successi',
        'Baumdiagramm einer Bernoulli-Kette': 'Diagramma ad albero di uno schema di Bernoulli',
        'Anzahl der Versuche $n$': 'Numero di prove $n$',
        'Was wird berechnet?': 'Che cosa si calcola?',
        'Histogramm der Binomialverteilung': 'Istogramma della distribuzione binomiale',
        'unvereinbar': 'incompatibili',
        // book it-3 mathe13-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o entrambi)'],
        ['$A$ und $B$', '$A$ e $B$'],
        ['nicht $A$', 'non $A$'],
        ['weder $A$ noch $B$', 'né $A$ né $B$'],
        ['nicht $A$ und nicht $B$', 'non $A$ e non $B$'],
        ['nicht beide', 'non entrambi'],
        ['nicht $A$ oder nicht $B$', 'non $A$ o non $B$'],
        ['gerade · Vielfaches von 3', 'pari · multiplo di 3'],
        ['Primzahl · größer als 6', 'primo · maggiore di 6'],
        ['Positiv getestet werden <b>', 'Risultano positive <b>'],
        ['</b> von 10 000 Personen – ', '</b> persone su 10 000 – '],
        ['aber nur <b>', 'ma solo <b>'],
        ['</b> davon sind wirklich krank.', '</b> di queste sono davvero malate.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proporzione di malati tra i positivi al test: '],
        ['$ und $P(A \\cap B) = ', '$ e $P(A \\cap B) = '],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.', '<b>Indipendenti:</b> che $B$ si verifichi o no, la parte di $A$ resta la stessa. Nel quadrato il confine si trova alla stessa altezza in entrambe le colonne.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.', '<b>Incompatibili</b> ($A \\cap B = \\emptyset$) e quindi <b>dipendenti</b>: se si verifica $B$, $A$ non può più verificarsi.'],
        ['<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ', '<b>Dipendenti:</b> $B$ modifica la probabilità di $A$ '],
        ['nach oben', 'verso l’alto'],
        ['nach unten', 'verso il basso'],
        [' alles richtig', ' tutto corretto'],
        ['Histogramm einer Binomialverteilung', 'Istogramma di una distribuzione binomiale'],
        ['Augenzahl', 'punteggio'],
        ['Anzahl Wappen', 'numero di teste'],
        ['Augensumme zweier Würfel', 'somma dei punti di due dadi'],
        ['Gewinn = Auszahlung − Einsatz', 'guadagno = vincita − puntata'],
        ['Gewinn bei 1 € Einsatz', 'guadagno con una puntata di 1 €'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Vincite di 0 €, 1 €, 2 € e 10 € con le probabilità '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.', ' Punti 1 € su un numero e si lanciano tre dadi. Per ogni dado che mostra il tuo numero vinci 1 €; se non esce nessuno, perdi la puntata.'],
        ['Erwartungswert: $E(X)', 'Valore atteso: $E(X)'],
        [' · Das Spiel ist <b>fair</b>.', ' · Il gioco è <b>equo</b>.'],
        [' · Auf lange Sicht <b>verlierst</b> du im Mittel ', ' · A lungo andare in media <b>perdi</b> '],
        [' € pro Spiel.', ' € a partita.'],
        [' · Auf lange Sicht <b>gewinnst</b> du im Mittel ', ' · A lungo andare in media <b>vinci</b> '],
        ['Varianz: $V(X)', 'Varianza: $V(X)'],
        ['Pfade mit genau ', 'Percorsi con esattamente '],
        ['$ · jeder hat die Wahrscheinlichkeit $', '$ · ciascuno ha la probabilità $'],
        ['Formel von Bernoulli: $P(X = ', 'Formula di Bernoulli: $P(X = '],
        ['$X$ ist binomialverteilt mit $n = ', '$X$ ha una distribuzione binomiale con $n = '],
        ['$ und $p = ', '$ e $p = '],
        ['Erwartungswert $\\mu', 'Valore atteso $\\mu'],
        // book it-3 mathe13-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // letters in the trees: K/G (krank/gesund) → M/S (malato/sano), coins W/Z (Wappen/Zahl) → T/C (testa/croce); R/B stay (rosso/blu)
        [/(font-weight:700">)K(<\/text>)/g, '$1M$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(margin-right:10px">)W</g, '$1T<'], [/(margin-right:10px">)Z</g, '$1C<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 su $2 corrette'],
        // rapid test: "Positiv getestet werden <b>670</b> von 10 000 Personen – "
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Su 10 000 persone, <b>' + n + '</b> risultano positive, '],
        // zufallsgroesse: the dice button ("Würfel" has two meanings, so no global word); Bernoulli trees: T/N (Treffer/Niete) → S/I (successo/insuccesso)
        [/(<button type="button" data-v="wuerfel">)Würfel(<\/button>)/g, '$1Dado$2'],
        [/(<text\b[^>]*>)([TN]{1,4})(<\/text>)/g, (m, a, k, b) => a + k.replace(/T/g, 'S').replace(/N/g, 'I') + b],
        [/Pfade mit genau 1 Treffern: \$/g, 'Percorsi con esattamente 1 successo: $'],
        // book it-3 mathe13-it:
    ]
});
