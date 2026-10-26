/* js/buch-fr/gy8.js — French for the widgets of js/buch-gy8.js.
 * Loaded by the French editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/gy8.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy8', {
    word: {
        // book fr-15 mathegy8-fr:
        // titelbildgy8
        'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
            'Couverture : un triangle agrandi à partir d’un centre, un carré formé de a², deux fois ab et b², deux droites avec leur point d’intersection et un arbre pondéré',
        // termbaum8 ('Term' → 'Expression' is in js/buch-fr/exponential.js, which this book does not load)
        'Term': 'Expression', 'Wert für $x$': 'Valeur de $x$',
        // ziffern8 ('Augenzahl' is a phrase in js/buch-fr/stochastik.js; the table head is a whole word here)
        'als Münze': 'comme une pièce', 'als Würfel': 'comme un dé', 'Lesart': 'Lecture', 'Neue Tabelle': 'Nouveau tableau',
        'Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.': 'Chiffre pair (0, 2, 4, 6, 8) = face, impair = pile. Chaque chiffre est un lancer de pièce.',
        'Augenzahl': 'Numéro', 'absolut': 'effectif', 'relativ': 'fréquence',
        // wegzeit8 (the distance is d, as in the chapter text: « loi distance-temps $d = 5t$ »)
        'Zeit $t$ in min': 'Temps $t$ en min', 't in min': 't en min', 'Weg-Zeit-Diagramm des Schulwegs': 'Diagramme distance-temps du trajet de l’école',
        'Zuhause': 'Maison', 'Haltestelle': 'Arrêt', 'Schule': 'École',
        'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'Le trajet de l’école comme un segment ; le point montre où se trouve Mia',
        'Mia ist in der Schule angekommen.': 'Mia est arrivée à l’école.',
        // lgs8 ('Nächster Schritt' is in js/buch-fr/lgs.js, which chapter 3.3 loads)
        'Einsetzungsverfahren': 'Substitution', 'Gleichsetzungsverfahren': 'Comparaison', 'Additionsverfahren': 'Combinaison', 'Verfahren': 'Méthode',
        'Alle Schritte': 'Toutes les étapes', 'Neues Gleichungssystem': 'Nouveau système',
        'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'Les deux droites du système et leur point d’intersection',
        'Klammer auflösen und zusammenfassen.': 'Développe et réduis.',
        'Löse beide Gleichungen nach $y$ auf.': 'Isole $y$ dans les deux équations.',
        'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'Les membres de droite sont tous les deux égaux à $y$, donc égaux entre eux : on les égale.',
        'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'Tous les $x$ à gauche, tous les nombres à droite, puis divise.',
        'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Multiplie de sorte que les nombres devant $y$ deviennent opposés.',
        'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Additionne les deux équations : $y$ disparaît.',
        'Nach $x$ auflösen.': 'Isole $x$.', 'Nach $y$ auflösen.': 'Isole $y$.',
        // streckung8 (the centre Z is O in French, the lengths are written OA, AB: rules below)
        'Streckfaktor $k$': 'Rapport $k$', 'Original': 'Figure initiale', 'Verhältnis': 'Rapport', 'Winkel bei $A$': 'Angle en $A$', 'gleich': 'égal', 'Fläche': 'Aire',
        'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
            'Fais glisser $O$, $A$, $B$ et $C$. Les demi-droites en pointillés partent de $O$ et passent par chaque point et par son image.',
        // gluecksrad8
        'Felder': 'Secteurs', 'ein Feld weniger': 'un secteur de moins', 'ein Feld mehr': 'un secteur de plus',
        'gleich groß': 'de même taille', 'verschieden groß': 'de tailles différentes', 'Größe der Felder': 'Taille des secteurs', 'Drehen': 'Tourner',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Touche des secteurs de la roue : ils forment l’événement $E$ (en jaune). Puis fais tourner la roue.',
        // binomformeln8 (the binomial formulas are the identités remarquables; 'Länge $a$', 'Länge $b$' are in js/buch-fr/gleichungen.js)
        '1. Formel': '1re identité', '2. Formel': '2e identité', '3. Formel': '3e identité', 'Binomische Formel': 'Identité remarquable',
        'Binomische Formel als Flächenbild': 'Identité remarquable vue comme une figure d’aires',
        'Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.':
            'Le grand carré est formé de quatre parties : $a^2$, deux fois $ab$ et $b^2$. Qui calcule seulement $a^2 + b^2$ oublie les deux rectangles bleus.',
        'Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.':
            'Du carré $a^2$, tu enlèves les deux bandes rouges $ab$. Le petit carré vert du coin, $b^2$, se trouve dans les deux bandes : tu l’as donc enlevé deux fois. Il revient une fois : $+\\,b^2$.',
        'Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.':
            'Dans le carré $a^2$, on découpe le coin $b^2$. La partie bleue est tournée et placée à droite : on obtient un rectangle de côtés $a + b$ et $a - b$.',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Touche un nœud : sa sous-expression s’allume.',
    },
    phrase: [
        // book fr-15 mathegy8-fr:
        // termbaum8 (the sentences with the term in them are rules below; these pieces let check.mjs see them translated)
        ['Rechenbaum des Terms ', 'Arbre de calcul de l’expression '], ['. Gerechnet wird von unten nach oben.', '. On calcule du bas vers le haut.'],
        ['Summanden', 'Termes'], ['Minuend und Subtrahend', 'Premier et second terme'], ['Faktoren', 'Facteurs'], ['Dividend und Divisor', 'Dividende et diviseur'],
        // streckung8 (the sentences with k: rules below)
        ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Homothétie du triangle ABC, de centre O et de rapport '],
        ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'Avec $k = 0$, tous les points images sont confondus avec $O$ : l’image n’est plus qu’un point.'],
        ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'Avec $k = 1$, chaque point reste à sa place.'],
        ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'Avec $k = -1$, l’homothétie est la symétrie centrale de centre $O$.'],
        [' Alle Winkel bleiben gleich.', ' Tous les angles sont conservés.'],
        // lgs8 (a sentence that starts with <b> is no whole label for the engine)
        ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Vérification</b> dans les deux équations, puis l’ensemble des solutions.'],
        // wegzeit8 (where Mia is: a rule below)
        ['Der Graph steigt gleichmäßig.', 'La courbe monte régulièrement.'],
        ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'La courbe est horizontale : le temps passe, la distance reste la même.'],
        ['Hier steigt der Graph am steilsten.', 'C’est ici que la courbe monte le plus fort.'], ['Der Graph steigt flacher als beim ersten Fußweg.', 'La courbe monte moins fort que sur le premier trajet à pied.'],
        [' von zu Hause entfernt.', ' de chez elle.'], ['geht zu Fuß zur Haltestelle', 'va à pied jusqu’à l’arrêt'], ['wartet an der Haltestelle', 'attend à l’arrêt'],
        ['fährt mit dem Bus', 'prend le bus'], ['geht das letzte Stück zur Schule', 'fait à pied le dernier bout de chemin jusqu’à l’école'],
        // gluecksrad8 (the counts and the last spin are rules below)
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Tous les secteurs ont la même taille : c’est une <b>expérience de Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'Les secteurs sont <b>de tailles différentes</b> : ce <b>n’est pas</b> une expérience de Laplace. '],
        ['}$ wäre falsch. ', '}$ serait faux. '], ['Es zählt der Anteil am ganzen Rad: ', 'Ce qui compte, c’est la part de la roue entière : '],
        [', $E$ ist eingetreten.', ', $E$ s’est réalisé.'], [', $E$ ist nicht eingetreten.', ', $E$ ne s’est pas réalisé.'],
        [' · Wahrscheinlichkeit $P(E) \\approx ', ' · probabilité $P(E) \\approx '],
    ],
    rule: [
        // book fr-15 mathegy8-fr:
        // French school notation (Doc, 26.10.2026, as OS 5 in js/buch-fr/gy5.js): × for the product, in TeX and in plain text
        // between two numbers; on every page of this book (the dot as a separator stays)
        [/\\cdot(?![a-zA-Z])/g, '\\times'], [/(\d|\)) · (?=[\d(])/g, '$1 × '],
        // waage (js/buch-gleichungen.js, chapter 1.2): its parser takes × as well, so the example shows the French sign
        [/<code>·2<\/code>/g, '<code>×2</code>'],
        // termbaum8: the product node is drawn as a dot; French pupils write × (the same text style as + − :)
        [/<circle cx="([\d.]+)" cy="([\d.]+)" r="4\.2" style="fill:rgb\(245,194,66\)"\/>/g,
            (m, x, y) => '<text class="tb8-op" x="' + x + '" y="' + (Math.round((+y + 1) * 10) / 10) + '" text-anchor="middle" dominant-baseline="middle">×</text>'],
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$." and the selected node
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'L’expression $' + t + '$ est ' + ({ Summe: 'une <b>somme</b>', Differenz: 'une <b>différence</b>', Produkt: 'un <b>produit</b>', Quotient: 'un <b>quotient</b>', Potenz: 'une <b>puissance</b>' })[k] +
                ' : la dernière opération est ' + ({ Summe: 'une addition', Differenz: 'une soustraction', Produkt: 'une multiplication', Quotient: 'une division', Potenz: 'l’élévation à la puissance' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Termes', 'Minuend und Subtrahend': 'Premier et second terme', 'Faktoren': 'Facteurs', 'Dividend und Divisor': 'Dividende et diviseur' })[p] + ' : $' + a + '$ et $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, exposant $' + b + '$.'],
        [/Für \$x = ([^$]*)\$ hat er den Wert /g, (m, v) => 'Pour $x = ' + v + '$, elle a la valeur '],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$([^$]*)\$\./g,
            (m, t, k, v) => 'Sélection : la sous-expression $' + t + '$, ' + ({ Summe: 'une somme', Differenz: 'une différence', Produkt: 'un produit', Quotient: 'un quotient', Potenz: 'une puissance' })[k] + ' de valeur $' + v + '$.'],
        [/Ausgewählt: die Variable \$x\$ mit dem Wert \$([^$]*)\$\./g, (m, v) => 'Sélection : la variable $x$, de valeur $' + v + '$.'],
        [/Ausgewählt: die Zahl \$([^$]*)\$\./g, (m, v) => 'Sélection : le nombre $' + v + '$.'],
        // sets of whole numbers written by the widgets (gluecksrad8, venn …): a thin space on both sides of every semicolon, as in the chapter text
        [/\\\{((?:\d+|\\ldots)(?:; (?:\d+|\\ldots))+)\\\}/g, (m, l) => '\\{' + l.replace(/; /g, '\\,;\\,') + '\\}'],
        // the same in plain text (urne of js/buch-stochastik.js lists its outcomes as {2; 3} and (1; 2)): a no-break space before the semicolon
        [/(?<!\\)([{(])(\d+(?:; \d+)+)([})])/g, (m, a, l, b) => a + l.replace(/; /g, ' ; ') + b],
        // ziffern8: the coin count and the dice
        [/Wappen: \$(\d+)\$ · Zahl: \$(\d+)\$ · relative Häufigkeit von Wappen: \$/g, (m, a, b) => 'Face : $' + a + '$ · pile : $' + b + '$ · fréquence de face : $'],
        [/Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen \(grau\)\. So entstehen (\d+) Würfe\./g,
            'Les chiffres de 1 à 6 sont les numéros du dé ; on saute 0, 7, 8 et 9 (en gris). On obtient ainsi $1 lancers.'],
        // lgs8: the solution set is S (as the rule of js/buch-fr/gleichungen.js, which chapter 3.3 does not load), and its point
        // gets the French semicolon although it stands inside a set: $L = \{(2 \mid 3)\}$
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '], [/\\\{\((-?\d+) \\mid (-?\d+)\)\\\}/g, '\\{($1\\,;\\,$2)\\}'],
        // lgs8: the steps with a variable or a number in them
        [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Isole $' + v + '$ dans l’équation I.'],
        [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Remplace $' + v + '$ par cette expression dans l’équation II.'],
        [/Setze \$([xy]) = (-?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v, a) => 'Remplace $' + v + '$ par $' + a + '$ dans l’équation transformée.'],
        [/Setze \$([xy]) = (-?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v, a) => 'Remplace $' + v + '$ par $' + a + '$ dans l’équation I transformée.'],
        [/Setze \$([xy]) = (-?\d+)\$ in Gleichung I ein\./g, (m, v, a) => 'Remplace $' + v + '$ par $' + a + '$ dans l’équation I.'],
        [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Étape $1 sur $2 : réfléchis d’abord toi-même, puis dévoile.'],
        // streckung8: the centre O (letter of the drawing), the lengths OA, AB instead of \overline{ZA}, "Bild" in the table head,
        // and the sentences with k
        [/(<text class="g-pt" [^>]*>)Z(<\/text>)/g, '$1O$2'], [/\\overline\{Z([ABC])\}/g, 'O$1'], [/\\overline\{([ABC]{2})\}/g, '$1'], [/<th>Bild<\/th>/g, '<th>Image</th>'],
        [/Bei negativem \$k\$ liegt jeder Bildpunkt auf der anderen Seite von \$Z\$\. Die Bildstrecken sind \$\|k\| = ([^$]*)\$-mal so lang\./g,
            (m, k) => 'Pour $k$ négatif, chaque point image est de l’autre côté de $O$. Les segments images sont $|k| = ' + k + '$ fois plus longs.'],
        [/(Eine <b>Vergrößerung<\/b>|<b>Eine Verkleinerung<\/b>): Jede Strecke wird \$([^$]*)\$-mal so lang, die Fläche \$k\^2 = ([^$]*)\$-mal so groß\./g,
            (m, w, a, b) => (/Vergr/.test(w) ? 'Un <b>agrandissement</b>' : '<b>Une réduction</b>') + ' : chaque longueur est multipliée par $' + a + '$, l’aire par $k^2 = ' + b + '$.'],
        // geraden (js/buch-lgs.js, chapter 3.3): the point of intersection is I in the chapter text (S is the solution set)
        [/<b>Genau eine Lösung<\/b>: Die Geraden schneiden sich in \$S\(/g, '<b>Exactement une solution</b> : les droites se coupent en $I('],
        // wegzeit8: the axis label "s in m" is d here (js/buch-fr/integral.js has "s en m" as a word, so a rule and no second word)
        [/^s in m$/, 'd en m'], [/>s in m</g, '>d en m<'],
        // wegzeit8: "Nach $t = 5$ min ist Mia <span …>$400$ m</span> von zu Hause entfernt." and "Sie fährt mit dem Bus: $300$ m pro Minute. "
        [/Nach \$t = ([^$]*)\$ min ist Mia (<span class="b-res">\$[^$]*\$ m<\/span>) von zu Hause entfernt\./g, (m, t, d) => 'Après $t = ' + t + '$ min, Mia est à ' + d + ' de chez elle.'],
        [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
            (m, d, v) => ({ 'geht zu Fuß zur Haltestelle': 'Elle va à pied jusqu’à l’arrêt', 'wartet an der Haltestelle': 'Elle attend à l’arrêt', 'fährt mit dem Bus': 'Elle prend le bus',
                'geht das letzte Stück zur Schule': 'Elle fait à pied le dernier bout de chemin jusqu’à l’école' })[d] + (v ? ' : $' + v + '$ m par minute. ' : '. ')],
        // gluecksrad8: the aria label, the last spin and the counts (relative frequency f, as in the chapter text)
        [/Glücksrad mit (\d+) Feldern/g, 'Roue de loterie à $1 secteurs'],
        [/Zuletzt: Feld <b>(\d+)<\/b>, \$E\$ ist (nicht )?eingetreten\./g, (m, f, n) => 'Dernier tour : secteur <b>' + f + '</b>, $E$ ' + (n ? 'ne s’est pas réalisé.' : 's’est réalisé.')],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit (?:\$h\(E\))?/g,
            (m, a, b) => 'Tours de roue : $' + a + '$ · $E$ réalisé : $' + b + '$ fois · fréquence ' + (/\$h/.test(m) ? '$f(E)' : '')],
    ]
});
