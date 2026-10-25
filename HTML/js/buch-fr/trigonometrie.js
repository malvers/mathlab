/* js/buch-fr/trigonometrie.js — French for the widgets of js/buch-trigonometrie.js.
 * Loaded by the French editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/trigonometrie.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('trigonometrie', {
    word: {
        // book fr-6 mathegy10-fr:
        // titelbildgy10
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Couverture : une sinusoïde, une courbe exponentielle, un triangle quelconque avec son cercle circonscrit et une suite qui s’approche de sa limite',
        // the helpers of the module (Geo, messkurve data), reported for every page that loads it
        'Geometrische Figur': 'Figure géométrique', 'Dreieck': 'Triangle',
        'Ebbe und Flut': 'Marées', 'Riesenrad': 'Grande roue', 'EKG': 'ECG', 'Sonnenflecken': 'Taches solaires',
        'Marker auf zwei Hochpunkte': 'Repères sur deux maximums', 'Messkurve mit zwei verschiebbaren Markern': 'Courbe de mesures avec deux repères déplaçables',
        't in h': 't en h', 't in min': 't en min', 't in s': 't en s',
        'Wasserstand in m': 'Hauteur d’eau en m', 'Höhe in m': 'Hauteur en m', 'Spannung in mV': 'Tension en mV', 'Jahr': 'Année', 'Fleckenzahl': 'Nombre de taches',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).':
            'Hauteur d’eau mesurée à une échelle de marée de la mer du Nord, par rapport au niveau moyen (valeurs simplifiées).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Hauteur d’une nacelle au-dessus du sol : la roue a un diamètre de 50 m, son axe est à 27 m de haut, un tour dure 20 minutes.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'Un électrocardiogramme enregistre la tension électrique du cœur (courbe simplifiée). Périodique, mais pas une sinusoïde.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Moyenne mensuelle des taches solaires, en modèle lissé avec le cycle d’environ 11 ans (valeurs simplifiées, pas la série de mesures).',
        'Mittellage': 'axe médian',
        // sinussatz, kosinussatz
        'Höhe $h_c$': 'Hauteur $h_c$', 'Umkreis': 'Cercle circonscrit', 'Hilfslinie': 'Tracé auxiliaire', 'Dreieck mit verschiebbaren Ecken': 'Triangle à sommets déplaçables',
        'Dreieck mit Quadraten über den drei Seiten': 'Triangle avec des carrés construits sur les trois côtés',
        // dreieckloeser: S = side (côté), W = angle - in French C and A, as in "CCC, CAC, ACA"
        'SSS': 'CCC', 'SWS': 'CAC', 'WSW': 'ACA', 'SSW': 'CCA', 'Gegeben': 'Données', 'Das berechnete Dreieck': 'Le triangle calculé',
        'Kosinussatz': 'Loi des cosinus', 'Sinussatz': 'Loi des sinus', 'Winkelsumme': 'Somme des angles',
        'KOSINUSSATZ': 'LOI DES COSINUS', 'SINUSSATZ': 'LOI DES SINUS', 'WINKELSUMME': 'SOMME DES ANGLES',
        'Seite $a$': 'Côté $a$', 'Seite $b$': 'Côté $b$', 'Seite $c$': 'Côté $c$', 'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Angle $\\alpha$ (opposé à $a$)',
        'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).':
            'Pas de triangle : chaque côté doit être plus court que les deux autres réunis (inégalité triangulaire).',
        '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>':
            '$\\sin\\beta > 1$ est impossible : le côté $a$ est trop court, il n’atteint même pas l’autre côté de l’angle. <b>Pas de triangle.</b>',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'Angle compris $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triangle donné par deux côtés et l’angle compris entre eux',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Cercle trigonométrique et sa tangente au point d’abscisse 1', 'Graph der Tangensfunktion mit Polstellen': 'Courbe de la fonction tangente et ses pôles',
        // pyramidekegel
        'Quadratische Pyramide': 'Pyramide à base carrée', 'Kegel': 'Cône', 'Körper': 'Solide', 'Höhe – Seitenhöhe': 'Hauteur – apothème', 'Höhe – Seitenkante': 'Hauteur – arête latérale',
        'Höhe – Mantellinie': 'Hauteur – génératrice', 'Rechtwinkliges Dreieck': 'Triangle rectangle', 'Grundkante $a$': 'Arête de base $a$', 'Radius $r$': 'Rayon $r$', 'Höhe $h$': 'Hauteur $h$',
    },
    phrase: [
        // book fr-6 mathegy10-fr:
        // messkurve
        ['Abstand der Marker: <b>$', 'Écart entre les repères : <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Si les deux repères sont sur deux maximums voisins, c’est la <b>période</b>.'],
        ['Größter Wert $', 'Plus grande valeur $'], ['$, kleinster Wert $', '$, plus petite valeur $'],
        // sinussatz
        ['Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\sin\\alpha = ', 'La hauteur calculée de deux façons : $h_c = b \\cdot \\sin\\alpha = '],
        ['$ und $h_c = a \\cdot \\sin\\beta \\approx ', '$ et $h_c = a \\cdot \\sin\\beta \\approx '],
        ['$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.', '$. En égalant et en divisant, on obtient $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'Les trois quotients sont égaux au <b>diamètre du cercle circonscrit</b> : $2r = '],
        // kosinussatz
        ['$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$\\gamma = 90^\\circ$ : le terme de correction est nul, il reste le <b>théorème de Pythagore</b> $c^2 = a^2 + b^2$.'],
        ['$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', '$\\gamma < 90^\\circ$ : $\\cos\\gamma > 0$, le carré construit sur $c$ est <b>plus petit</b> que les deux autres réunis.'],
        ['$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', '$\\gamma > 90^\\circ$ : $\\cos\\gamma < 0$, le carré construit sur $c$ est <b>plus grand</b> que les deux autres réunis.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Déplace $C$ jusqu’à ce que l’angle mesure exactement $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Données : '], ['drei Seiten', 'trois côtés'], ['zwei Seiten und der eingeschlossene Winkel', 'deux côtés et l’angle compris entre eux'],
        ['eine Seite und die beiden anliegenden Winkel', 'un côté et les deux angles adjacents'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'deux côtés et un angle opposé à l’un de ces côtés'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. Les notations sont les notations habituelles : $a$ est le côté opposé à $A$, $\\alpha$ est l’angle en $A$.'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'Pas de triangle : les deux angles font déjà $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$ à eux deux, il ne reste rien pour $\\gamma$.'],
        ['\\text{ zu groß, }', '\\text{ trop grand, }'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Deux triangles</b> correspondent aux données : le côté $a$ coupe deux fois l’autre côté de l’angle. C’est le cas ambigu de CCA (l’angle donné est opposé au côté le <b>plus court</b>).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Exactement <b>un</b> triangle : l’angle est opposé au côté le <b>plus long</b> (ou de même longueur), alors CCA donne une solution unique.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Exactement <b>un</b> triangle : ici, $a$ touche seulement l’autre côté de l’angle, le triangle est rectangle.'],
        // dreiecksflaeche
        ['Höhe $h = b \\cdot \\sin\\gamma = ', 'Hauteur $h = b \\cdot \\sin\\gamma = '], ['$ Flächeneinheiten', '$ unités d’aire'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · Pour $90^\\circ$, l’aire est maximale.'], [' · Derselbe Flächeninhalt bei $', ' · Même aire pour $'],
        ['^\\circ$, denn $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.', '^\\circ$, car $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.'],
        // tangensfunktion
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\tan\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$ : ici, $\\cos\\alpha = 0$. Le rayon est parallèle à la tangente, $\\tan\\alpha$ <b>n’est pas défini</b>. La courbe a un <b>pôle</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · Sur le cercle : la longueur du segment sur la tangente en $x = 1$'],
        [' (nach unten, also negativ)', ' (vers le bas, donc négative)'],
        // pyramidekegel
        ['Schrägbild einer quadratischen Pyramide', 'Perspective cavalière d’une pyramide à base carrée'], ['Schrägbild eines Kegels', 'Perspective cavalière d’un cône'], [' mit einem rechtwinkligen Dreieck', ' avec un triangle rectangle'],
        ['Seitenhöhe $h_a', 'Apothème $h_a'], ['Neigungswinkel der Seitenfläche:', 'Angle d’inclinaison de la face latérale :'],
        ['Seitenkante $s', 'Arête latérale $s'], ['$ mit der Diagonale $d', '$ avec la diagonale $d'], ['Neigungswinkel der Seitenkante:', 'Angle d’inclinaison de l’arête latérale :'],
        ['$ · Oberfläche $O', '$ · aire totale $O'], ['Mantellinie $s', 'Génératrice $s'], ['Volumen $V', 'Volume $V'],
        ['halber Öffnungswinkel:', 'Demi-angle au sommet :'], ['$ · Öffnungswinkel $2', '$ · angle au sommet $2'], ['$ · Mantel $M', '$ · aire latérale $M'],
    ],
    rule: [
        // book fr-6 mathegy10-fr:
        // messkurve: the unit after the distance of the markers ("$11,0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ ans</b>'],
    ]
});
