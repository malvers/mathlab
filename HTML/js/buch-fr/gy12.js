/* js/buch-fr/gy12.js — French for the widgets of js/buch-gy12.js.
 * Loaded by the French editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy12.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy12', {
    word: {
        // book fr-8 mathegy12-fr:
        // summen (5.2, OP): the same words as js/buch-fr/numerik.js (widget flaeche), which the pages of LB 5 do not load
        'Rechtecke links': 'Rectangles à gauche', 'Rechtecke rechts': 'Rectangles à droite', 'Rechtecke Mitte': 'Rectangles au milieu', 'Trapeze': 'Trapèzes',
        'Verfahren': 'Méthode', 'Anzahl der Streifen $n$': 'Nombre de bandes $n$', 'Streifen unter einem Funktionsgraphen': 'Bandes sous une courbe',
        'Hier ist das Verfahren schon exakt.': 'Ici, la méthode est déjà exacte.',
        // schaetzen (6): 'Stichprobenumfang $n$' is in js/buch-fr/stochastik.js
        'Neue Stichprobe': 'Nouvel échantillon', '+1000 Stichproben': '+1000 échantillons', 'Anzahl': 'Nombre',
        'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert': 'Volumes de remplissage de l’échantillon en diagramme à points, avec leur moyenne et la valeur nominale',
        'Sollwert': 'valeur nominale',
        // book fr-10 mathegy12lk-fr:
        // summen: the same words as js/buch-fr/numerik.js (widget flaeche), which the pages of LB 5 do not load
        // schaetzen ('Stichprobenumfang $n$' is in js/buch-fr/stochastik.js, which the same page loads)
    },
    phrase: [
        // book fr-8 mathegy12-fr:
        // summen: the letters U_n and O_n stay as in the German book (the page says where they come from)
        ['Untersumme (grün) $U_{', 'Somme inférieure (en vert) $U_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · somme supérieure (en rouge, au-dessus) $O_{'],
        ['$ · Unterschied $', '$ · différence $'], ['Dazwischen liegt immer $', 'Entre les deux se trouve toujours $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. Plus il y a de bandes, plus $U_n$ et $O_n$ se rapprochent ; leur limite commune est l’intégrale.'],
        ['Rechtecke links mit $n = ', 'Rectangles à gauche avec $n = '], ['Rechtecke rechts mit $n = ', 'Rectangles à droite avec $n = '],
        ['Rechtecke Mitte mit $n = ', 'Rectangles au milieu avec $n = '], ['Trapeze mit $n = ', 'Trapèzes avec $n = '], ['$ · genauer Wert $', '$ · valeur exacte $'],
        [' (ohne Stammfunktion, nur numerisch)', ' (sans primitive, seulement numériquement)'],
        // schaetzen
        [' Werte)', ' valeurs)'], ['Stichprobe: ', 'Échantillon : '], ['Im Mittel über ', 'En moyenne sur '], [' Stichproben: $', ' échantillons : $'], ['(wahr: ', '(vraie valeur : '],
        ['$s^2$ mit $\\tfrac{1}{n-1}$: $', '$s^2$ avec $\\tfrac{1}{n-1}$ : $'], ['$, mit $\\tfrac1n$: $', '$, avec $\\tfrac1n$ : $'],
        ['Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ', 'En moyenne, la division par $n$ donne une valeur trop basse d’un facteur $\\tfrac{n-1}{n} = '],
        ['$ zu tief.', '$.'],
        ['Die Anlage füllt im Mittel $\\mu = ', 'En moyenne, la machine remplit $\\mu = '], ['$ ml mit der Standardabweichung $\\sigma = ', '$ ml avec l’écart type $\\sigma = '],
        ['$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.', '$ ml. Mais la contrôleuse ne le sait pas : elle estime les deux à partir de l’échantillon.'],
        // book fr-10 mathegy12lk-fr:
        // summen: the letters U_n and O_n stay as in the German book (the chapter text says where they come from)
        ['Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $', 'Deux fois plus de bandes : l’erreur est divisée environ par $'], ['$ kleiner.', '$.'],
        // schaetzen
    ],
    rule: [
        // book fr-8 mathegy12-fr:
        // summen: a no-break space before the colon after "$n = …$" (the phrases turn the words), the factor of the error
        [/((?:Rechtecke (?:links|rechts|Mitte)|Trapeze) mit \$n = [^$]*\$):/g, '$1 :'],
        [/Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor \$([^$]*)\$ kleiner\./g, (m, k) => 'Deux fois plus de bandes : l’erreur devient environ $' + k + '$ fois plus petite.'],
        // summen: the head of the error table; no global word 'Fehler' - it would hang on the header button "Fehler<br>melden"
        [/<th>Näherung<\/th><th>Fehler<\/th>/g, '<th>Approximation</th><th>Erreur</th>'],
        // schaetzen: the list of the sample ("498,2; 503,1") gets the French no-break space before its semicolons
        [/(Stichprobe: [^<]*)/g, m => m.replace(/; /g, ' ; ')],
        // book fr-10 mathegy12lk-fr:
        // summen: the colon after "Rechtecke links mit $n = 4$"; the head of the error table (no bare word 'Fehler': the header button "Fehler<br>melden")
        [/((?:Rechtecke (?:links|rechts|Mitte)|Trapeze) mit \$n = \d+\$):/g, '$1 :'],
        [/<th>Näherung<\/th><th>Fehler<\/th>/g, '<th>Approximation</th><th>Erreur</th>'],
        // schaetzen: the values of the sample "498,2; 503,1; …" with a no-break space before each semicolon (the numbers have a decimal comma)
        [/(Stichprobe: )([^<]*)/g, (m, a, b) => a + b.replace(/; /g, ' ; ')],
    ]
});
