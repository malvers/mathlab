/* js/buch-fr/gy11lk-stoch.js — French for the widgets of js/buch-gy11lk-stoch.js.
 * Loaded by the French editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy11lk-stoch.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy11lk-stoch', {
    word: {
        // book fr-9 mathegy11lk-fr:
        // geburtstag
        'Personen $n$': 'Personnes $n$', '1000 Klassen simulieren': 'Simuler 1000 classes',
        'Wahrscheinlichkeit für mindestens zwei gleiche Geburtstage in Abhängigkeit von der Zahl der Personen':
            'Probabilité qu’au moins deux personnes soient nées le même jour, en fonction du nombre de personnes',
        // umkehrbaum
        'Schnelltest': 'Test rapide', 'Spamfilter': 'Filtre antispam', 'Zwei Maschinen': 'Deux machines', 'von 10 000': 'sur 10 000',
        'Baumdiagramm: erst A, dann B': 'Arbre pondéré : d’abord A, puis B', 'Umgekehrtes Baumdiagramm: erst B, dann A': 'Arbre inversé : d’abord B, puis A',
        'Dieses Bild braucht js/buch-stochastik.js.': 'Cette figure a besoin de js/buch-stochastik.js.',
        // galton
        'Nagelreihen $n$': 'Rangées de clous $n$', 'nach rechts mit $p$': 'vers la droite avec $p$', 'Leeren': 'Vider',
        'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Fréquences des cases comparées à la loi binomiale',
    },
    phrase: [
        // book fr-9 mathegy11lk-fr:
        // geburtstag
        ['$ günstige von $365^{', '$ cas favorables sur $365^{'],
        ['}$ gleich wahrscheinlichen Ergebnissen, also $P(\\text{alle verschieden}) \\approx ', '}$ issues équiprobables, donc $P(\\text{tous différents}) \\approx '],
        ['$P(\\text{mindestens zwei gleich}) = 1 - ', '$P(\\text{au moins deux identiques}) = 1 - '],
        // umkehrbaum
        ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
            'Le premier arbre donne le numérateur et le dénominateur, l’arbre inversé montre le résultat sur sa branche supérieure, après $B$.'],
        ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$ : sous la condition $B$, on ne peut rien calculer.'],
        // galton
        ['$ für $X \\sim B(', '$ pour $X \\sim B('], ['Mittleres Fach $', 'Case moyenne $'], ['$, Erwartungswert $n \\cdot p = ', '$, espérance $n \\cdot p = '],
        ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.', 'Lâche des billes : chacune heurte $n$ clous et part chaque fois vers la droite avec la probabilité $p$.'],
        // the pieces of the sentences that a rule below translates as a whole (so check.mjs sees them translated, too)
        [' Geburtstage verschieden: $', ' anniversaires différents : $'], [' In 1000 simulierten Klassen hatten ', ' Sur 1000 classes simulées, '], [' einen doppelten Geburtstag.', ' avaient un anniversaire commun.'],
        ['kein Spam', 'pas un spam'], ['enthält „Gratis“', 'contient « gratuit »'], ['ohne „Gratis“', 'sans « gratuit »'], ['Maschine 1', 'machine 1'], ['Maschine 2', 'machine 2'], ['in Ordnung', 'conforme'],
        ['In Zahlen: Von ', 'En effectifs : sur '], [' Fällen mit „', ' cas « '], ['“ sind ', ' », '],
        ['Galtonbrett mit ', 'Planche de Galton à '], [' Nagelreihen', ' rangées de clous'],
        [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' billes. Barres : fréquence par case, points : $P(X = k)$ pour $X \\sim B('],
    ],
    rule: [
        // book fr-9 mathegy11lk-fr:
        // geburtstag: "Alle 23 Geburtstage verschieden: $…" and the simulation (int() writes 1 000 with a space)
        [/Alle (\d+) Geburtstage verschieden: \$/g, 'Les $1 anniversaires sont tous différents : $'],
        [/ In 1000 simulierten Klassen hatten (\d[\d ]*?) einen doppelten Geburtstag\./g, (m, k) => ' Sur 1000 classes simulées, ' + k + (k === '0' || k === '1' ? ' avait' : ' avaient') + ' un anniversaire commun.'],
        // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ." with the names of the three examples
        [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/, (m, a, na, b, nb) => {
            const T = { 'krank': 'malade', 'gesund': 'sain', 'positiv': 'positif', 'negativ': 'négatif', 'Spam': 'spam', 'kein Spam': 'pas un spam', 'enthält „Gratis“': 'contient « gratuit »',
                'ohne „Gratis“': 'sans « gratuit »', 'Maschine 1': 'machine 1', 'Maschine 2': 'machine 2', 'defekt': 'défectueuse', 'in Ordnung': 'conforme' }, t = s => T[s] || s;
            return '$A$ : ' + t(a) + ', $\\overline{A}$ : ' + t(na) + ', $B$ : ' + t(b) + ', $\\overline{B}$ : ' + t(nb) + '.';
        }],
        // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“." - a French sentence for each of the three examples
        [/In Zahlen: Von (\d[\d ]*?) Fällen mit „(.+?)“ sind (\d[\d ]*?) „(.+?)“\./g, (m, all, b, hit, a) => {
            const one = hit === '0' || hit === '1';
            const T = { 'positiv': ['cas avec un test positif', one ? 'est malade' : 'sont malades'],
                'enthält „Gratis“': ['courriels qui contiennent « gratuit »', one ? 'est un spam' : 'sont des spams'],
                'defekt': ['pièces défectueuses', one ? 'vient de la machine 1' : 'viennent de la machine 1'] }[b];
            return T ? 'En effectifs : sur ' + all + ' ' + T[0] + ', ' + hit + ' ' + T[1] + '.' : 'En effectifs : sur ' + all + ' cas « ' + b + ' », ' + hit + ' cas « ' + a + ' ».';
        }],
        // galton: the board in the aria label and the count of balls
        [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Planche de Galton à ' + n + (n === '1' ? ' rangée' : ' rangées') + ' de clous'],
        [/(\d[\d ]*?) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$/g, (m, k) => k + (k === '0' || k === '1' ? ' bille' : ' billes') + '. Barres : fréquence par case, points : $'],
        // galton: B(n;\,p) with the French semicolon, as the book writes it: B(12\,;\,0{,}5)
        [/(\\sim B\()(\d+);\\,/g, '$1$2\\,;\\,'],
    ]
});
