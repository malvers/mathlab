/* js/buch-it/gy11lk-stoch.js — Italian for the widgets of js/buch-gy11lk-stoch.js.
 * Loaded by the Italian editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy11lk-stoch.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy11lk-stoch', {
    word: {
        // book it-7 mathegy11lk-it:
        // geburtstag
        'Personen $n$': 'Persone $n$', '1000 Klassen simulieren': 'Simula 1000 classi',
        'Wahrscheinlichkeit für mindestens zwei gleiche Geburtstage in Abhängigkeit von der Zahl der Personen':
            'Probabilità che almeno due persone compiano gli anni lo stesso giorno, in funzione del numero di persone',
        // umkehrbaum
        'Schnelltest': 'Test rapido', 'Spamfilter': 'Filtro antispam', 'Zwei Maschinen': 'Due macchine', 'von 10 000': 'su 10 000',
        'Baumdiagramm: erst A, dann B': 'Diagramma ad albero: prima A, poi B', 'Umgekehrtes Baumdiagramm: erst B, dann A': 'Diagramma ad albero inverso: prima B, poi A',
        'Dieses Bild braucht js/buch-stochastik.js.': 'Questa figura richiede js/buch-stochastik.js.',
        // galton
        'Nagelreihen $n$': 'File di chiodi $n$', 'nach rechts mit $p$': 'a destra con $p$', 'Leeren': 'Svuota',
        'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Frequenze relative delle caselle a confronto con la distribuzione binomiale',

    },
    phrase: [
        // book it-7 mathegy11lk-it:
        // geburtstag
        ['$ günstige von $365^{', '$ casi favorevoli su $365^{'],
        ['}$ gleich wahrscheinlichen Ergebnissen, also $P(\\text{alle verschieden}) \\approx ', '}$ esiti equiprobabili, quindi $P(\\text{tutti diversi}) \\approx '],
        ['$P(\\text{mindestens zwei gleich}) = 1 - ', '$P(\\text{almeno due uguali}) = 1 - '],
        // umkehrbaum
        ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
            'Il primo albero fornisce numeratore e denominatore, l’albero inverso mostra il risultato sul suo ramo superiore, dopo $B$.'],
        ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$: sotto la condizione $B$ non si può calcolare niente.'],
        // galton
        ['$ für $X \\sim B(', '$ per $X \\sim B('], ['Mittleres Fach $', 'Casella media $'], ['$, Erwartungswert $n \\cdot p = ', '$, valore atteso $n \\cdot p = '],
        // the pieces of the sentences that a rule below translates as a whole (so check.mjs sees them translated, too)
        [' Geburtstage verschieden: $', ' compleanni diversi: $'], [' In 1000 simulierten Klassen hatten ', ' Su 1000 classi simulate, '], [' einen doppelten Geburtstag.', ' avevano due compleanni uguali.'],
        ['kein Spam', 'non spam'], ['enthält „Gratis“', 'contiene «gratis»'], ['ohne „Gratis“', 'senza «gratis»'], ['Maschine 1', 'macchina 1'], ['Maschine 2', 'macchina 2'], ['in Ordnung', 'funzionante'],
        ['In Zahlen: Von ', 'In numeri: su '], [' Fällen mit „', ' casi con «'], ['“ sind ', '», '],
        ['Galtonbrett mit ', 'Macchina di Galton con '], [' Nagelreihen', ' file di chiodi'],
        [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' palline. Barre: frequenza relativa per casella, punti: $P(X = k)$ per $X \\sim B('],
        ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.', 'Fai cadere delle palline: ognuna urta $n$ chiodi e ogni volta salta a destra con probabilità $p$.'],

    ],
    rule: [
        // book it-7 mathegy11lk-it:
        // geburtstag: "Alle 23 Geburtstage verschieden: $…" and the simulation (int() writes 1 000 with a space)
        [/Alle (\d+) Geburtstage verschieden: \$/g, 'Tutti i $1 compleanni diversi: $'],
        [/ In 1000 simulierten Klassen hatten (\d[\d ]*?) einen doppelten Geburtstag\./g, (m, k) => ' Su 1000 classi simulate, ' + k + (k === '1' ? ' aveva' : ' avevano') + ' due compleanni uguali.'],
        // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ." with the names of the three examples
        [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/, (m, a, na, b, nb) => {
            const T = { 'krank': 'malato', 'gesund': 'sano', 'positiv': 'positivo', 'negativ': 'negativo', 'Spam': 'spam', 'kein Spam': 'non spam', 'enthält „Gratis“': 'contiene «gratis»',
                'ohne „Gratis“': 'senza «gratis»', 'Maschine 1': 'macchina 1', 'Maschine 2': 'macchina 2', 'defekt': 'difettoso', 'in Ordnung': 'funzionante' }, t = s => T[s] || s;
            return '$A$: ' + t(a) + ', $\\overline{A}$: ' + t(na) + ', $B$: ' + t(b) + ', $\\overline{B}$: ' + t(nb) + '.';
        }],
        // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“."
        [/In Zahlen: Von (\d[\d ]*?) Fällen mit „(.+?)“ sind (\d[\d ]*?) „(.+?)“\./g, (m, all, b, hit, a) => {
            const T = { 'krank': 'malato', 'positiv': 'positivo', 'Spam': 'spam', 'enthält „Gratis“': 'contiene «gratis»', 'Maschine 1': 'macchina 1', 'defekt': 'difettoso' }, t = s => T[s] || s;
            return 'In numeri: su ' + all + ' casi con «' + t(b) + '», ' + hit + ' sono «' + t(a) + '».';
        }],
        // galton: the board in the aria label and the count of balls
        [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Macchina di Galton con ' + n + (n === '1' ? ' fila' : ' file') + ' di chiodi'],
        [/(\d[\d ]*?) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$/g, (m, k) => k + (k === '1' ? ' pallina' : ' palline') + '. Barre: frequenza relativa per casella, punti: $'],

    ]
});
