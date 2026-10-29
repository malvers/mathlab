/* js/buch-fr/bgy13lk.js — French for the widgets of js/buch-bgy13lk.js.
 * Loaded by the French editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md (Einheitsmatrix E: matrice identité I, as js/buch-fr/gy11.js; ME: u.).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 */
window.BuchFR && BuchFR.add('bgy13lk', {
    word: {
        // book fr-23 mathe13lk-fr:
        // titelbildbgy13lk
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Couverture : des trapèzes sous une courbe, une courbe en cloche avec une zone de rejet rouge, un cycle œuf, larve, coléoptère',
        // matrixinverse ('Nächster Schritt', 'Alle Schritte', 'Von vorn' as in js/buch-fr/gy6.js, a module these pages do not load)
        'nicht invertierbar': 'non inversible', 'Beispielmatrix': 'Matrice d’exemple',
        'Nächster Schritt': 'Étape suivante', 'Alle Schritte': 'Toutes les étapes', 'Von vorn': 'Recommencer',
        // leontief ('Summe' is 'Total' in js/buch-fr.js)
        'Markt': 'Marché',
        // uebergang: the stages in the graph (the beetle node widens to an ellipse for « Coléoptères »), the buttons as in js/buch-fr/lgs.js
        'Eier': 'Œufs', 'Larven': 'Larves', 'Käfer': 'Coléoptères',
        'Käferpopulation': 'Population de coléoptères', 'Kundenwanderung': 'Mouvements de clientèle',
        '1 Schritt': '1 étape', '10 Schritte': '10 étapes', 'Zurück auf Start': 'Retour au départ',
        'Verlauf der drei Klassen über die Schritte n': 'Évolution des trois classes au fil des étapes n',
        'Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen': 'Graphe de transition à trois états, avec les proportions de transition sur les flèches',
        // biquadratisch
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'La parabole h(z) = z² + p·z + q avec ses zéros',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'La courbe de f(x) = x⁴ + p·x² + q avec ses zéros',
        'Keine Lösung': 'Aucune solution', 'Eine Lösung': 'Une solution',
    },
    phrase: [
        // book fr-23 mathe13lk-fr:
        // matrixinverse (the step counter and the row operations with numbers are rules below)
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'À côté de $A$ se trouve la matrice identité $I$. Objectif : obtenir $I$ à gauche, avec les mêmes opérations sur les lignes qu’à droite.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr. <b>$A$ ist nicht invertierbar.</b>',
            'On ne peut plus obtenir la matrice identité à gauche : une ligne devient entièrement nulle à gauche, ou il n’y a plus de nombre $\\neq 0$ dans une colonne. <b>$A$ n’est pas inversible.</b>'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'À gauche se trouve $I$, à droite $A^{-1}$.'],
        ['. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $', '. Vérification : $A \\cdot A^{-1} = I$, par exemple la première ligne fois la première colonne : $'],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'Le système $A \\cdot \\vec{x} = '],
        ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ a pour solution $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'La troisième ligne de $A$ est la somme des deux premières. Alors $A \\cdot \\vec{x} = \\vec{b}$ n’a aucune solution ou une infinité de solutions, jamais exactement une.'],
        ['Weiter mit „Nächster Schritt“.', 'Continue avec « Étape suivante ».'],
        // leontief: the sectors agriculture (Agr), industrie (Ind), services (Serv); ME: u. (unités de quantité) as js/buch-fr/gy11lk.js
        ['Endnachfrage Landwirtschaft', 'Demande finale de l’agriculture'], ['Endnachfrage Industrie', 'Demande finale de l’industrie'],
        ['Endnachfrage Dienstleistung', 'Demande finale des services'], ['Endnachfrage ', 'Demande finale '],
        ['Landwirtschaft', 'agriculture'], ['Industrie', 'industrie'], ['Dienstleistung', 'services'], [' ME', ' u.'],
        ['Zeile: liefernder Sektor, Spalte: empfangender Sektor. ', 'Ligne : secteur qui livre, colonne : secteur qui reçoit. '],
        ['. Summe = Produktion, alle Angaben gerundet in ME.', '. Total = production, toutes les valeurs sont arrondies, en u.'],
        ['Technologiematrix $A = ', 'Matrice technologique $A = '], ['$, Leontief-Inverse $(E - A)^{-1} \\approx ', '$, inverse de Leontief $(I - A)^{-1} \\approx '],
        ['$\\vec{x} = (E - A)^{-1} \\cdot \\vec{y} \\approx ', '$\\vec{x} = (I - A)^{-1} \\cdot \\vec{y} \\approx '],
        ['. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ',
            '. Chaque ligne du tableau est équilibrée : les livraisons aux trois secteurs plus la demande finale donnent la production. '],
        ['Insgesamt werden ', 'Au total, '], [' ME erzeugt, damit ', ' u. sont produites pour que '], [' ME den Markt erreichen.', ' u. arrivent sur le marché.'],
        // uebergang: in sentences the stages are « œufs, larves, coléoptères »; the providers « fournisseur A, B, C »
        ['Eier je Käfer $f$', 'Œufs par coléoptère $f$'],
        ['Eier ', 'œufs '], ['Larven ', 'larves '], ['Käfer ', 'coléoptères '],
        ['Anbieter A', 'fournisseur A'], ['Anbieter B', 'fournisseur B'], ['Anbieter C', 'fournisseur C'],
        ['$: Nach jeweils drei Schritten ist jede Klasse ', '$ : après chaque série de trois étapes, chaque classe est '],
        ['<b>genau so groß wie vorher</b>, die Population schwankt zyklisch.', '<b>exactement aussi grande qu’avant</b>, la population varie de façon cyclique.'],
        ['um den Faktor ', 'multipliée par '], [' <b>gewachsen</b>.', ' : la population <b>croît</b>.'],
        ['auf das ', 'multipliée par '], ['-Fache <b>geschrumpft</b>, die Population stirbt langfristig aus.', ' : elle <b>diminue</b>, et la population finit par s’éteindre.'],
        ['. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.',
            '. Quand $n$ augmente, les colonnes de $P^n$ deviennent égales : elles se rapprochent de la <b>matrice limite</b>, dont toutes les colonnes sont le <b>vecteur fixe</b>.'],
        ['Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx ', 'Vecteur fixe tiré de $P \\cdot \\vec{v} = \\vec{v}$ et $v_1 + v_2 + v_3 = 1$ : $\\vec{v} \\approx '],
        ['$. Langfristig: ', '$. À long terme : '], [' der Kundschaft, egal wie es anfing.', ' de la clientèle, quel que soit le départ.'],
        // biquadratisch
        ['Koeffizient $p$', 'Coefficient $p$'], ['Koeffizient $q$', 'Coefficient $q$'],
        [' liefert $x = \\pm', ' donne $x = \\pm'], [' liefert $x = 0$', ' donne $x = 0$'], [' liefert nichts, denn $x^2$ ist nie negativ', ' ne donne rien, car $x^2$ n’est jamais négatif'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'aucune solution $z$, le discriminant est négatif'],
        ['$ wird mit $z = x^2$ zu $z^2', '$ devient, avec $z = x^2$, $z^2'], [' = 0$, Diskriminante $\\tfrac{p^2}{4} - q = ', ' = 0$, discriminant $\\tfrac{p^2}{4} - q = '],
        [' Lösungen', ' solutions'],
    ],
    rule: [
        // book fr-23 mathe13lk-fr:
        // matrixinverse: "Schritt 2 von 6: ", the row swap, the pivot and the zeros of a column (roman row numbers I, II, III)
        [/Schritt (\d+) von (\d+): /g, 'Étape $1 sur $2 : '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, 'Échanger les lignes $1 et $2, pour que la colonne $3 ne commence pas par un zéro.'],
        [/Zeile (I{1,3}) durch \$([^$]*)\$ teilen: Das Pivotelement wird 1\./g, (m, r, p) => 'Diviser la ligne ' + r + ' par $' + p + '$ : le pivot devient 1.'],
        [/In Spalte (\d) Nullen erzeugen: \$/g, 'Faire apparaître des zéros dans la colonne $1 : $'],
        // leontief: the sector letters of the table and the help line, only in this widget's table
        // (Agr, Ind, Serv: one letter A would clash with the technology matrix A next to the table)
        [/^(<p class="b-help" style="margin:0 0 6px">Zeile: liefernder Sektor[\s\S]*)$/, m => m.replace(/<th>L<\/th>/g, '<th>Agr</th>').replace(/<th>I<\/th>/g, '<th>Ind</th>')
            .replace(/<th>D<\/th>/g, '<th>Serv</th>').replace('L = Landwirtschaft, I = Industrie, D = Dienstleistung', 'Agr = Landwirtschaft, Ind = Industrie, Serv = Dienstleistung')],
        // uebergang: the identity matrix is I in French ("U^3 = a · b · f · E = 1 · E")
        [/(U\^3 = a \\cdot b \\cdot f \\cdot )E = ([^$]*) \\cdot E\$/g, (m, a, q) => a + 'I = ' + q + ' \\cdot I$'],
        // biquadratisch: the solution set {−2 ; −1 ; 1 ; 2} with the French semicolon
        [/(x \\in \\\{)([\s\S]*?)(\\\})/g, (m, a, b, c) => a + b.replace(/;\\ /g, '\\,;\\,') + c],
        // biquadratisch: French spacing before the semicolon between the z values and before the colon after the count
        [/; \$z = /g, '\u00a0; $z = '], [/<\/b>: \$x \\in /g, '</b>\u00a0: $x \\in '],
    ]
});
