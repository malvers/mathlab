/* js/buch-fr/funktionen.js — French for the widgets of js/buch-funktionen.js.
 * Loaded by the French editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the cover of the start page, the helpers of the module (the strings outside
 * every widget, which every book that loads it meets) and the block comments. Five books are translated at the same
 * time, each has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/funktionen.js shows which
 * German strings the widgets write.
 */
window.BuchFR && BuchFR.add('funktionen', {
    word: {
        // fr0: the cover of the start page (BGY 11 mathe11)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Couverture : parabole, sinusoïde, fonction exponentielle et droite',
        // fr0: the helpers of the module (outside every widget; check.mjs funktionen/*), shared by all five books
        // the cases and the reasons of parabelschar and funktion are whole labels (a table cell, a paragraph), so they are words,
        // keyed by the German as the widget writes it (a word is looked up before the point rule turns \mid into \,;\,)
        'Parabel': 'Parabole',
        'Liegende Spitze': 'V couché',
        'Liegende Parabel': 'Parabole couchée',
        'Wurzel': 'Racine carrée',
        'Hyperbel': 'Hyperbole',
        'Betrag': 'Valeur absolue',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.': 'À droite de $x = -1$, chaque droite verticale coupe la courbe deux fois : à $x = 1$ correspondent $y = 2$ et $y = -2$.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.': 'À $x = 2$ correspondent $y = 2$ et $y = -2$. Or une fonction associe à chaque $x$ exactement un $y$.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'deux zéros $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'un zéro (double) $x = 1$',
        'keine Nullstelle': 'aucun zéro',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Discriminant : pour $x^2 - 2x + a = 0$, on a $D = 1 - a$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'deux zéros $x = 0$ et $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'un zéro double $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).': 'Factoriser : $x^2 + ax = x(x + a) = 0$. Les sommets $S\\left(-\\tfrac{a}{2}\\,;\\,-\\tfrac{a^2}{4}\\right)$ sont tous sur la parabole $y = -x^2$ (en pointillés).',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'deux zéros $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'pas une parabole, mais la droite $y = -4$ : aucun zéro',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'ouverte vers le bas, de sommet $(0\\,;\\,-4)$ : aucun zéro',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.': '$kx^2 = 4$ n’a de solutions que pour $k > 0$. Le cas $k = 0$ doit être étudié à part, car alors $x^2$ disparaît.',
        'Zaun an der Mauer': 'Clôture le long d’un mur',
        'Rechteck mit Umfang 24 cm': 'Rectangle de périmètre 24 cm',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // wachstum
        'Sparen': 'Épargne',
        'Kernzerfall': 'Désintégration radioactive',
        'Eigene Werte': 'Valeurs libres',
        'Lineares und exponentielles Wachstum': 'Croissance linéaire et croissance exponentielle',
        'Startwert $a$': 'Valeur de départ $a$',
        'linear: Änderung $m$ pro Schritt': 'linéaire : variation $m$ par pas',
        'exponentiell: Faktor $q$': 'exponentielle : facteur $q$',
        'Zeitraum': 'Durée',
        'einfache Zinsen (30 € pro Jahr):': 'intérêts simples (30 € par an) :',
        'Zinseszins (3 % pro Jahr):': 'intérêts composés (3 % par an) :',
        'linear: jeden Tag 6,25 Prozentpunkte weniger:': 'linéaire : 6,25 points de pourcentage de moins chaque jour :',
        'Jod-131: Halbwertszeit 8 Tage:': 'iode 131 : demi-vie de 8 jours :',
        'linear:': 'linéaire :',
        'exponentiell:': 'exponentielle :',
        // funktion
        'Kurve': 'Courbe',
        'Zieh den türkisen Punkt unten: Die senkrechte Gerade wandert mit. Wie oft trifft sie die Kurve?': 'Déplace le point turquoise en bas : la droite verticale le suit. Combien de fois coupe-t-elle la courbe ?',
        'Kurve mit verschiebbarer senkrechter Gerade': 'Courbe avec une droite verticale déplaçable',
        'Ist die Kurve der Graph einer Funktion?': 'Est-ce la courbe d’une fonction ?',
        'keine Funktion': 'pas une fonction',
        'Richtig.': 'Correct.',
        'Nicht ganz.': 'Pas tout à fait.',
        'Entscheide mit den Knöpfen. Danach siehst du Definitions- und Wertebereich.': 'Décide avec les boutons. Ensuite, tu verras l’ensemble de définition et l’ensemble des images.',
        // gerade
        'Gerade durch zwei verschiebbare Punkte': 'Droite passant par deux points déplaçables',
        // regression
        'Kerze': 'Bougie',
        'Brenndauer in h': 'Durée de combustion en h',
        'Länge in cm': 'Longueur en cm',
        'Bremsweg': 'Distance de freinage',
        'Tempo in km/h': 'Vitesse en km/h',
        'Bremsweg in m': 'Distance de freinage en m',
        'Abkühlen': 'Refroidissement',
        'Zeit in min': 'Temps en min',
        'ΔT in °C': 'ΔT en °C',
        'Weltbevölkerung': 'Population mondiale',
        'Jahr': 'Année',
        'Mrd. Menschen': 'Milliards d’habitants',
        'Messreihe': 'Série de mesures',
        'Messpunkte und Regressionskurve': 'Points de mesure et courbe de régression',
        'Messpunkte lassen sich verschieben': 'On peut déplacer les points de mesure',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Pour un modèle exponentiel, les valeurs doivent être positives.',
        // lage (the examples are the buttons)
        'schneidend': 'sécantes',
        'orthogonal': 'perpendiculaires',
        'parallel': 'parallèles',
        'identisch': 'confondues',
        '$g$: Anstieg $m_1$': '$g$ : coefficient directeur $m_1$',
        '$g$: Achsenabschnitt $n_1$': '$g$ : ordonnée à l’origine $n_1$',
        '$h$: Anstieg $m_2$': '$h$ : coefficient directeur $m_2$',
        '$h$: Achsenabschnitt $n_2$': '$h$ : ordonnée à l’origine $n_2$',
        'Zwei Geraden und ihre Lage zueinander': 'Deux droites et leur position relative',
        // parabel
        'Streckfaktor $a$': 'Coefficient d’étirement $a$',
        'Verschiebung nach rechts $d$': 'Translation vers la droite $d$',
        'Verschiebung nach oben $e$': 'Translation vers le haut $e$',
        'Parabel mit verschiebbarem Scheitelpunkt': 'Parabole avec un sommet déplaçable',
        // wurf
        'Abwurfhöhe $h_0$': 'Hauteur de lancer $h_0$',
        'Abwurfgeschwindigkeit $v_0$': 'Vitesse initiale $v_0$',
        'Höhe beim senkrechten Wurf': 'Hauteur lors d’un lancer vertical',
        'h in m': 'h en m',
        't in s': 't en s',
        // parabelschar
        'Funktionenschar': 'Famille de fonctions',
        'Parameter': 'Paramètre',
        'Schar von Parabeln mit einem hervorgehobenen Mitglied': 'Famille de paraboles avec un membre mis en évidence',
        // ganzrational
        'Vielfachheit': 'Multiplicité',
        'Vielfachheit kleiner': 'Multiplicité plus petite',
        'Vielfachheit größer': 'Multiplicité plus grande',
        'Faktor $a$': 'Facteur $a$',
        'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.': 'Déplace les zéros sur l’axe des $x$. Une multiplicité 0 supprime le facteur du premier degré.',
        'Ganzrationale Funktion mit verschiebbaren Nullstellen': 'Fonction polynôme avec des zéros déplaçables',
        // book fr-5 mathefos12-fr:
        // regression
        'Kerze': 'Bougie', 'Brenndauer in h': 'Durée de combustion en h', 'Länge in cm': 'Longueur en cm', 'Bremsweg': 'Distance de freinage',
        'Tempo in km/h': 'Vitesse en km/h', 'Bremsweg in m': 'Distance de freinage en m', 'Abkühlen': 'Refroidissement', 'Zeit in min': 'Temps en min',
        'ΔT in °C': 'ΔT en °C', 'Weltbevölkerung': 'Population mondiale', 'Jahr': 'Année', 'Mrd. Menschen': 'Milliards d’habitants', 'Messreihe': 'Série de mesures',
        'Messpunkte und Regressionskurve': 'Points mesurés et courbe d’ajustement', 'Messpunkte lassen sich verschieben': 'Les points mesurés peuvent être déplacés',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Pour un modèle exponentiel, les valeurs doivent être positives.',
        // ganzrational
        'Vielfachheit': 'Multiplicité', 'Vielfachheit kleiner': 'Multiplicité plus petite', 'Vielfachheit größer': 'Multiplicité plus grande', 'Faktor $a$': 'Facteur $a$',
        'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.': 'Fais glisser les zéros sur l’axe des $x$. La multiplicité 0 retire le facteur linéaire.',
        'Ganzrationale Funktion mit verschiebbaren Nullstellen': 'Fonction polynôme aux zéros déplaçables',
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // wachstum
        ['Jahre', 'ans'],
        ['Tage', 'jours'],
        ['Schritte', 'pas'],
        ['einfache Zinsen (30 € pro Jahr)', 'intérêts simples (30 € par an)'],
        ['Zinseszins (3 % pro Jahr)', 'intérêts composés (3 % par an)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'linéaire : 6,25 points de pourcentage de moins chaque jour'],
        ['Jod-131: Halbwertszeit 8 Tage', 'iode 131 : demi-vie de 8 jours'],
        ['$ — in jedem Schritt ', '$ — à chaque pas, '],
        ['geht <b>gleich viel</b> weg', 'on retire <b>la même quantité</b>'],
        ['. Nach $', '. Au bout de $'],
        [' wäre alles verbraucht.', ', tout serait épuisé.'],
        ['kommt <b>gleich viel</b> hinzu.', 'on ajoute <b>la même quantité</b>.'],
        ['$ — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', '$ — à chaque pas, on multiplie par <b>le même facteur</b>'],
        [', das sind ', ', soit '],
        [' % pro Schritt. ', ' % par pas. '],
        ['Verdopplungszeit', 'Temps de doublement'],
        ['Halbwertszeit', 'Demi-vie'],
        // funktion
        ['$ · Bei $x = ', '$ · En $x = '],
        ['$ trifft die Senkrechte die Kurve <b>', '$, la verticale coupe la courbe <b>'],
        ['gar nicht', 'aucune fois'],
        ['genau einmal', 'exactement une fois'],
        ['$ und $y = ', '$ et $y = '],
        ['$ und $', '$ et $'],
        ['Jede senkrechte Gerade trifft die Kurve höchstens einmal: eine Funktion. ', 'Chaque droite verticale coupe la courbe au plus une fois : c’est une fonction. '],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Les deux points sont sur une même verticale. La droite $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ <b>n’est pas</b> la courbe d’une fonction.'],
        ['Steigung $m = ', 'Coefficient directeur $m = '],
        ['Achsenabschnitt $n = ', 'Ordonnée à l’origine $n = '],
        ['$ (weißer Punkt)', '$ (point blanc)'],
        [' · Nullstelle $x_0 = ', ' · zéro $x_0 = '],
        [' · waagerechte Gerade', ' · droite horizontale'],
        // regression
        ['Wann ist die Kerze abgebrannt?', 'Quand la bougie sera-t-elle consumée ?'],
        ['Bremsweg bei 150 km/h?', 'Distance de freinage à 150 km/h ?'],
        ['Temperaturunterschied nach 45 min?', 'Écart de température au bout de 45 min ?'],
        ['Prognose für 2050?', 'Prévision pour 2050 ?'],
        ['Regressionsfunktion: $', 'Fonction de régression : $'],
        [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;avec $x$ = années depuis 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coefficient de détermination $R^2 = '],
        ['(passt sehr gut)', '(très bon ajustement)'],
        ['(passt gut)', '(bon ajustement)'],
        ['(passt mäßig)', '(ajustement moyen)'],
        [' Das Modell sagt: $f(', ' Le modèle prévoit : $f('],
        // lage
        ['Gleicher Anstieg und gleicher Achsenabschnitt: <b>identisch</b>. Jeder Punkt ist gemeinsam.', 'Même coefficient directeur et même ordonnée à l’origine : <b>confondues</b>. Tous les points sont communs.'],
        ['Gleicher Anstieg $m_1 = m_2$, verschiedene Achsenabschnitte: <b>parallel</b>. Es gibt keinen Schnittpunkt.', 'Même coefficient directeur $m_1 = m_2$, ordonnées à l’origine différentes : <b>parallèles</b>. Il n’y a pas de point d’intersection.'],
        ['$: Die Geraden sind <b>orthogonal</b> (senkrecht zueinander).', '$ : les droites sont <b>perpendiculaires</b> (orthogonales).'],
        ['Verschiedene Anstiege: Die Geraden <b>schneiden</b> sich.', 'Coefficients directeurs différents : les droites sont <b>sécantes</b>.'],
        ['Gleichsetzen: $', 'En égalant : $'],
        ['$ ergibt $x = ', '$ donne $x = '],
        ['$, also ', '$, donc '],
        [' · Schnittwinkel $', ' · angle d’intersection $'],
        ['parallel zur $x$-Achse', 'parallèle à l’axe des $x$'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Pour $a = 0$, la courbe n’est pas une parabole, mais une droite.'],
        ['eine (doppelte) Nullstelle: $x = ', 'un zéro (double) : $x = '],
        ['Nullstellen: $x_1 = ', 'Zéros : $x_1 = '],
        ['Nullstellen: $', 'zéros : $'],
        ['Scheitelpunktform: $f(x) = ', 'Forme canonique : $f(x) = '],
        [' · Scheitel $S(', ' · sommet $S('],
        ['Normalform: $f(x) = ', 'Forme développée : $f(x) = '],
        ['keine Nullstelle', 'aucun zéro'],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Point le plus haut au bout de $t_S = '],
        ['$ Höhe. ', '$ de hauteur. '],
        ['Aufprall nach $', 'Impact au bout de $'],
        // parabelschar
        ['$ für $', '$ pour $'],
        [' · Scheitel $(', ' · sommet $('],
        // ganzrational
        [': einfach → ', ' : simple → '],
        [': doppelt → ', ' : double → '],
        [': dreifach → ', ' : triple → '],
        [': vierfach → ', ' : quadruple → '],
        [': fünffach → ', ' : quintuple → '],
        [': sechsfach → ', ' : sextuple → '],
        [': siebenfach → ', ' : septuple → '],
        [': achtfach → ', ' : octuple → '],
        [': neunfach → ', ' : nonuple → '],
        ['fünffach', 'quintuple'],
        ['Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse', 'changement de signe, la courbe <b>coupe</b> l’axe des $x$'],
        ['Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)', 'changement de signe, la courbe coupe l’axe des $x$ <b>en s’aplatissant</b> (point d’inflexion à tangente horizontale)'],
        ['kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse', 'pas de changement de signe, la courbe <b>touche</b> l’axe des $x$'],
        ['$ · Grad $', '$ · degré $'],
        ['Für $x \\to +\\infty$ geht $f(x) \\to ', 'Quand $x \\to +\\infty$, $f(x) \\to '],
        ['$, für $x \\to -\\infty$ geht $f(x) \\to ', '$ ; quand $x \\to -\\infty$, $f(x) \\to '],
        ['Es entscheidet nur der Summand mit der höchsten Potenz: $', 'Seul le terme de plus haut degré décide : $'],
        // book fr-5 mathefos12-fr:
        // regression
        ['Wann ist die Kerze abgebrannt?', 'Quand la bougie est-elle consumée ?'], ['Bremsweg bei 150 km/h?', 'Distance de freinage à 150 km/h ?'],
        ['Temperaturunterschied nach 45 min?', 'Écart de température après 45 min ?'], ['Prognose für 2050?', 'Prévision pour 2050 ?'],
        ['Regressionsfunktion: $', 'Fonction d’ajustement : $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;avec $x$ = années depuis 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coefficient de détermination $R^2 = '], ['(passt sehr gut)', '(convient très bien)'], ['(passt gut)', '(convient bien)'],
        ['(passt mäßig)', '(convient moyennement)'], [' Das Modell sagt: $f(', ' Le modèle prévoit : $f('],
        // ganzrational: "$x = -2$: einfach → Vorzeichenwechsel, …" (le zéro: simple, double, triple …)
        [': einfach → ', ' : simple → '], [': doppelt → ', ' : double → '], [': dreifach → ', ' : triple → '], [': vierfach → ', ' : quadruple → '],
        [': fünffach → ', ' : quintuple → '], [': sechsfach → ', ' : sextuple → '], [': siebenfach → ', ' : septuple → '], [': achtfach → ', ' : octuple → '],
        [': neunfach → ', ' : nonuple → '],
        ['Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse', 'changement de signe, la courbe <b>coupe</b> l’axe des $x$'],
        ['Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)', 'changement de signe, la courbe coupe l’axe des $x$ <b>à plat</b> (point d’inflexion à tangente horizontale)'],
        ['kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse', 'pas de changement de signe, la courbe <b>touche</b> l’axe des $x$'],
        ['$ · Grad $', '$ · degré $'], ['$, für $x \\to -\\infty$ geht $f(x) \\to ', '$ ; pour $x \\to -\\infty$, $f(x) \\to '],
        ['Es entscheidet nur der Summand mit der höchsten Potenz: $', 'Seul le terme de plus haut degré décide : $'],
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // funktion: "die Kurve <b>2-mal</b>"
        [/<b>(\d+)-mal<\/b>/g, '<b>$1 fois</b>'],
        // lage: "$g$</span>: $" gets its no-break space
        [/(\$[gh]\$<\/span>): \$/g, '$1 : $'],
        // wachstum: "Nach $16$ Tagen wäre alles verbraucht." and "Halbwertszeit: $8$ Tage."
        [/\. Nach \$([^$]*)\$ (Jahre|Tage|Schritte)n wäre alles verbraucht\./g, (m, x, u) => '. Au bout de $' + x + '$ ' + { Jahre: 'ans', Tage: 'jours', Schritte: 'pas' }[u] + ', tout serait épuisé.'],
        [/(Verdopplungszeit|Halbwertszeit): \$/g, (m, w) => (w === 'Verdopplungszeit' ? 'Temps de doublement' : 'Demi-vie') + ' : $'],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'aucun zéro : le sommet est ' + (a === 'über' ? 'au-dessus' : 'au-dessous') + ' de l’axe des $x$ et la parabole est tournée vers ' + (b === 'oben' ? 'le haut' : 'le bas') + '.'],
        // wurf: "… in $8{,}84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$, à une hauteur de $' + h + '$. '],
        // book fr-5 mathefos12-fr:
    ]
});
