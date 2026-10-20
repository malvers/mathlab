/* js/buch-it/gy11.js — Italian for the widgets of js/buch-gy11.js.
 * Loaded by the Italian editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy11.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy11', {
    word: {
        // book it-6 mathegy11-it:
        // titelbildgy11
        'Titelbild: Sekanten, die sich einer Tangente nähern, Tangenten des Newton-Verfahrens auf dem Weg zu einer Nullstelle, eine Ebene, die von einer Geraden durchstoßen wird, und die Balken einer Binomialverteilung':
            'Copertina: secanti che si avvicinano a una tangente, tangenti del metodo di Newton in cammino verso uno zero, un piano attraversato da una retta e le barre di una distribuzione binomiale',
        // kettenregel
        'Äußere Funktion u(z)': 'Funzione esterna u(z)', 'Innere Funktion v(x)': 'Funzione interna v(x)',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Funzione composta con la tangente in un punto che si può spostare',
        // matrixprodukt
        'Typen der Matrizen': 'Dimensioni delle matrici', 'Reihenfolge': 'Ordine', 'Neue Zahlen': 'Nuovi numeri', 'nicht definiert': 'non definito',
        // drehmatrix
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'Una figura ruota attorno all’origine con una matrice di rotazione',
        'Drehwinkel $\\varphi$': 'Angolo di rotazione $\\varphi$',
        // newton (wb2 does not load js/buch-it/lgs.js, so "Nächster Schritt" is here as well, same Italian)
        'Newton-Verfahren: Tangenten führen zur Nullstelle': 'Metodo di Newton: le tangenti portano allo zero',
        'Nächster Schritt': 'Passo successivo',

        // book it-7 mathegy11lk-it:
        // kettenregel (chapter 1.3), matrixprodukt and drehmatrix (chapter 2), newton (Wahlbereich 2) - the same widgets as in mathegy11-it (block it-6)

    },
    phrase: [
        // book it-6 mathegy11-it:
        // kettenregel
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; esterna $u(z) = '], ['$, innen $v(x) = ', '$, interna $v(x) = '],
        ['An der Stelle $x_0 = ', 'Nel punto $x_0 = '], ['$ ist $v(x_0) = ', '$ si ha $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$: lì $f$ non è definita o non è derivabile. Sposta il punto ancora un po’.'],
        ['$, also $f\'(x_0) \\approx ', '$, quindi $f\'(x_0) \\approx '],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0{,}0001$): $', '$. Controllo con il rapporto incrementale ($h = 0{,}0001$): $'],
        // matrixprodukt
        ['$ hat den Typ $', '$ ha dimensione $'], ['$ den Typ $', '$ ha dimensione $'],
        [' Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', ' righe: in quest’ordine le matrici non sono compatibili, il prodotto non esiste.'],
        ['Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', 'in quest’ordine le matrici non sono compatibili, il prodotto non esiste.'],
        ['Typen: $', 'Dimensioni: $'], ['$ · Klick auf ein Feld des Ergebnisses.', '$ · Clicca su una casella del risultato.'],
        ['$ ist nicht definiert.', '$ non è definito.'], ['$, ist also etwas ganz anderes.', '$, quindi è tutt’altra cosa.'],
        ['$ ergibt ', '$ dà '], ['hier zufällig dasselbe', 'qui, per caso, lo stesso risultato'], ['andere Zahlen', 'altri numeri'],
        ['Andersherum: ', 'Al contrario: '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' Per le matrici la proprietà commutativa in generale non vale.'],
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · La rotazione avviene attorno all’origine, in senso antiorario.'],
        // newton
        ['Bei $x_{', 'In $x_{'], ['}$ ist $f\'(x) = 0$: Die Tangente ist waagerecht, das Verfahren bricht ab.', '}$ si ha $f\'(x) = 0$: la tangente è orizzontale, il metodo si interrompe.'],
        ['Die Folge läuft weg: anderer Startwert.', 'La successione si allontana: prova un altro valore iniziale.'], ['$ und $f\'(x) = ', '$ e $f\'(x) = '],
        ['$. Iteration: $x_{n+1}', '$. Iterazione: $x_{n+1}'],
        ['$. Den Startwert verschiebst du mit dem weißen Punkt auf der $x$-Achse.', '$. Il valore iniziale lo sposti con il punto bianco sull’asse $x$.'],

        // book it-7 mathegy11lk-it:
        // kettenregel
        // matrixprodukt
        // drehmatrix
        // newton

    ],
    rule: [
        // book it-6 mathegy11-it:
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$"
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, (m, p, i, q, j) => ' ' + p + ' ha ' + i + (i === '1' ? ' colonna' : ' colonne') + ', ma ' + q + ' ha ' + j + (j === '1' ? ' riga: ' : ' righe: ')],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$/g, (m, i, p, j, q) => 'Riga ' + i + ' di $' + p + '$ per colonna ' + j + ' di $' + q + '$'],

        // book it-7 mathegy11lk-it:
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$"
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, (m, p, i, q, j) => ' ' + p + ' ha ' + i + (i === '1' ? ' colonna' : ' colonne') + ', ma ' + q + ' ha ' + j + (j === '1' ? ' riga: ' : ' righe: ')],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$/g, (m, i, p, j, q) => 'Riga ' + i + ' di $' + p + '$ per colonna ' + j + ' di $' + q + '$'],

    ]
});
