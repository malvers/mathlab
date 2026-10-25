/* js/buch-fr/gy11.js — French for the widgets of js/buch-gy11.js.
 * Loaded by the French editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy11.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy11', {
    word: {
        // book fr-7 mathegy11-fr:
        // titelbildgy11
        'Titelbild: Sekanten, die sich einer Tangente nähern, Tangenten des Newton-Verfahrens auf dem Weg zu einer Nullstelle, eine Ebene, die von einer Geraden durchstoßen wird, und die Balken einer Binomialverteilung':
            'Couverture : des sécantes qui s’approchent d’une tangente, les tangentes de la méthode de Newton en route vers un zéro, un plan percé par une droite et les barres d’une loi binomiale',
        // kettenregel
        'Äußere Funktion u(z)': 'Fonction extérieure u(z)', 'Innere Funktion v(x)': 'Fonction intérieure v(x)',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Fonction composée avec la tangente en un point que l’on peut déplacer',
        // matrixprodukt (lb2 does not load js/buch-fr/stochastik.js, so "Reihenfolge" is here as well, same French)
        'Typen der Matrizen': 'Tailles des matrices', 'Reihenfolge': 'Ordre', 'Neue Zahlen': 'Nouveaux nombres', 'nicht definiert': 'non défini',
        // drehmatrix
        'Eine Figur wird mit einer Drehmatrix um den Ursprung gedreht': 'Une figure tourne autour de l’origine grâce à une matrice de rotation',
        'Drehwinkel $\\varphi$': 'Angle de rotation $\\varphi$',
        // newton (wb2 does not load js/buch-fr/lgs.js, so "Nächster Schritt" is here as well, same French)
        'Newton-Verfahren: Tangenten führen zur Nullstelle': 'Méthode de Newton : les tangentes mènent au zéro',
        'Nächster Schritt': 'Étape suivante',
        // book fr-9 mathegy11lk-fr:
        // kettenregel (chapter 1.3), matrixprodukt and drehmatrix (chapter 2), newton (Wahlbereich 2) - the same widgets as in mathegy11-fr (block fr-7)
        // matrixprodukt
        // drehmatrix
        // newton (wb2 does not load js/buch-fr/lgs.js, so "Nächster Schritt" is here as well, the same French)
    },
    phrase: [
        // book fr-7 mathegy11-fr:
        // kettenregel
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; extérieure $u(z) = '], ['$, innen $v(x) = ', '$, intérieure $v(x) = '],
        ['An der Stelle $x_0 = ', 'En $x_0 = '], ['$: $v(x_0) = ', '$ : $v(x_0) = '], ['$ ist $v(x_0) = ', '$, on a $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$ : là, $f$ n’est pas définie ou pas dérivable. Déplace encore le point.'],
        ['$, also $f\'(x_0) \\approx ', '$, donc $f\'(x_0) \\approx '],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0{,}0001$): $', '$. Vérification avec le taux d’accroissement ($h = 0{,}0001$) : $'],
        // matrixprodukt
        ['$ hat den Typ $', '$ est de taille $'], ['$ den Typ $', '$ de taille $'],
        [' Zeilen: Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', ' lignes : dans cet ordre, les matrices ne sont pas compatibles, le produit n’existe pas.'],
        ['Die Matrizen sind in dieser Reihenfolge nicht verkettet, das Produkt gibt es nicht.', 'dans cet ordre, les matrices ne sont pas compatibles, le produit n’existe pas.'],
        ['Typen: $', 'Tailles : $'], ['$ · Klick auf ein Feld des Ergebnisses.', '$ · Clique sur une case du résultat.'],
        ['$ ist nicht definiert.', '$ n’est pas défini.'], ['$, ist also etwas ganz anderes.', '$, c’est donc tout autre chose.'],
        ['$ ergibt ', '$ donne '], ['hier zufällig dasselbe', 'ici, par hasard, le même résultat'], ['andere Zahlen', 'd’autres nombres'],
        ['Andersherum: ', 'Dans l’autre ordre : '], [' Das Kommutativgesetz gilt für Matrizen im Allgemeinen nicht.', ' En général, le produit de deux matrices n’est pas commutatif.'],
        // drehmatrix
        ['$ · Gedreht wird um den Ursprung gegen den Uhrzeigersinn.', '$ · La rotation se fait autour de l’origine, dans le sens inverse des aiguilles d’une montre.'],
        // newton
        ['Bei $x_{', 'En $x_{'], ['}$ ist $f\'(x) = 0$: Die Tangente ist waagerecht, das Verfahren bricht ab.', '}$, $f\'(x) = 0$ : la tangente est horizontale, la méthode s’arrête.'],
        ['Die Folge läuft weg: anderer Startwert.', 'La suite s’éloigne : choisis une autre valeur de départ.'], ['$ und $f\'(x) = ', '$ et $f\'(x) = '],
        ['$. Iteration: $x_{n+1}', '$. Itération : $x_{n+1}'],
        ['$. Den Startwert verschiebst du mit dem weißen Punkt auf der $x$-Achse.', '$. Tu déplaces la valeur de départ avec le point blanc sur l’axe des abscisses.'],
        // book fr-9 mathegy11lk-fr:
        // kettenregel (the rule below puts the no-break space before the colon of "An der Stelle $x_0 = …$:")
        // matrixprodukt (the rules below turn the sentences with numbers; the pieces " Spalten, ", " aber ", "Zeile ", " von $", "$ mal Spalte " are for check.mjs)
        [' Spalten, ', ' colonnes, '], [' aber ', ' mais '],
        ['Zeile ', 'Ligne '], [' von $', ' de $'], ['$ mal Spalte ', '$ fois colonne '],
        // drehmatrix
        // newton
    ],
    rule: [
        // book fr-7 mathegy11-fr:
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$"
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, (m, p, i, q, j) => ' ' + p + ' a ' + i + (i === '1' ? ' colonne' : ' colonnes') + ', mais ' + q + ' a ' + j + (j === '1' ? ' ligne : ' : ' lignes : ')],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$:/g, (m, i, p, j, q) => 'Ligne ' + i + ' de $' + p + '$ fois colonne ' + j + ' de $' + q + '$ :'],
        // book fr-9 mathegy11lk-fr:
        // kettenregel: "An der Stelle $x_0 = 0{,}5$: $v(x_0) = …" → the no-break space before the colon
        [/(An der Stelle \$x_0 = [^$]*\$): \$/g, '$1 : $'],
        // matrixprodukt: "A hat 2 Spalten, B aber 3 Zeilen: …" and "Zeile 1 von $A$ mal Spalte 2 von $B$: …"
        [/ ([AB]) hat (\d+) Spalten, ([AB]) aber (\d+) Zeilen: /g, (m, p, i, q, j) => ' ' + p + ' a ' + i + (i === '1' ? ' colonne' : ' colonnes') + ', mais ' + q + ' a ' + j + (j === '1' ? ' ligne : ' : ' lignes : ')],
        [/Zeile (\d+) von \$([AB])\$ mal Spalte (\d+) von \$([AB])\$: /g, (m, i, p, j, q) => 'Ligne ' + i + ' de $' + p + '$ fois colonne ' + j + ' de $' + q + '$ : '],
    ]
});
