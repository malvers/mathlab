/* js/buch-fr/gy7.js — French for the widgets of js/buch-gy7.js.
 * Loaded by the French editions right after js/buch-gy7.js; the engine and the shared words are in js/buch-fr.js.
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
 * js/buch-it/gy7.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy7', {
    word: {
        // book fr-14 mathegy7-fr:
        // shared: the solids and the 3D stage ("Würfel" is a die in other books: the cube is a rule below)
        'Quader': 'Pavé droit', 'Dreiecksprisma': 'Prisme triangulaire', 'Sechseckprisma': 'Prisme hexagonal', 'Quadratische Pyramide': 'Pyramide à base carrée',
        'Quadr. Pyramide': 'Pyramide carrée', 'Dreieckspyramide': 'Pyramide triangulaire', 'Pyramidenstumpf': 'Tronc de pyramide', 'Tetraeder': 'Tétraèdre',
        'Oktaeder': 'Octaèdre', 'Dodekaeder': 'Dodécaèdre', 'Ikosaeder': 'Icosaèdre', 'Körper in 3D': 'Solide en 3D', 'Ziehen zum Drehen': 'Fais glisser pour tourner',
        // titelbildgy7
        'Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl':
            'Couverture : un cercle avec un triangle rectangle sur un diamètre, une pyramide en perspective cavalière, un icosaèdre, un diagramme circulaire et une droite graduée avec un nombre et son opposé',
        // kreisgerade7 (the kind of line as a label: "Tangente" keeps its capital, as in gy11lk.js; the sentences end on it after an arrow)
        'Passante': 'Droite extérieure', 'Sekante': 'Sécante',
        'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.':
            'Fais glisser les deux points de la droite. Quand la distance $d$ s’approche du rayon $r$, la droite se cale en position de tangente.',
        'Ein Kreis mit einer Passante, einer Sekante und einer Tangente': 'Un cercle avec une droite extérieure, une sécante et une tangente',
        'Kreis mit einer verschiebbaren Geraden': 'Cercle et droite que l’on peut déplacer',
        // dreieckkreise7 (U, the centre of the circumcircle, is O in French schools: the label and the sentences)
        'Kreis': 'Cercle', 'Umkreis': 'Cercle circonscrit', 'Inkreis': 'Cercle inscrit', 'Dreieck mit Umkreis': 'Triangle et son cercle circonscrit',
        'Dreieck mit Inkreis': 'Triangle et son cercle inscrit',
        'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.':
            'Fais glisser les sommets. Près de $90^\\circ$, l’angle au sommet que tu déplaces se cale sur un angle droit.',
        'Die drei': 'Les trois', 'Mittelsenkrechten': 'médiatrices', 'Winkelhalbierenden': 'bissectrices',
        'schneiden sich in einem Punkt $U$. Er ist von allen drei Ecken gleich weit entfernt:': 'se coupent en un point $O$. Il est à la même distance des trois sommets :',
        'schneiden sich in einem Punkt $I$. Er hat von allen drei <b>Seiten</b> denselben Abstand:': 'se coupent en un point $I$. Il est à la même distance des trois <b>côtés</b> :',
        'Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.':
            'Le triangle est <b>rectangle</b> : $O$ est exactement au milieu du plus grand côté. C’est le théorème du demi-cercle vu de l’autre côté.',
        'Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.': 'Le triangle est <b>obtusangle</b> : $O$ est à l’<b>extérieur</b> du triangle.',
        'Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.': 'Le triangle est <b>acutangle</b> : $O$ est à l’<b>intérieur</b> du triangle.',
        'Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.': 'Le cercle inscrit touche chaque côté. $I$ est toujours à l’intérieur du triangle.',
        'Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.': 'Les trois sommets sont presque alignés. Éloigne un sommet.',
        // kreiswinkel7 (the German "Satz des Thales" is the French "théorème du demi-cercle": in France "théorème de Thalès" is the intercept theorem)
        'Thales': 'Demi-cercle', 'Peripheriewinkel': 'Angle inscrit', 'Sehnenviereck': 'Quadrilatère inscrit', 'Satz': 'Théorème', 'Zentriwinkel': 'Angle au centre',
        'Beweisidee zeigen': 'Idée de la démonstration',
        'Satz des Thales: Dreieck über dem Durchmesser': 'Théorème du demi-cercle : triangle inscrit dans un demi-cercle',
        'Peripheriewinkel und Zentriwinkel über einem Kreisbogen': 'Angle inscrit et angle au centre qui interceptent le même arc',
        'Sehnenviereck mit seinen vier Winkeln': 'Quadrilatère inscrit et ses quatre angles',
        'Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. Ihre Basiswinkel sind gleich:':
            'Le segment $[MC]$ partage le triangle en deux triangles <b>isocèles</b>, car $MA = MB = MC = r$. Leurs angles à la base sont égaux :',
        '$\\alpha$ bei $A$ und bei $C$': '$\\alpha$ en $A$ et en $C$', '$\\beta$ bei $B$ und bei $C$': '$\\beta$ en $B$ et en $C$',
        '. Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.':
            '. Somme des angles : $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, donc $\\gamma = \\alpha + \\beta = 90^\\circ$.',
        // konstruktion7 (the circle k is 𝒞 in French schools, k1 and k2 are 𝒞1 and 𝒞2, the auxiliary circle h is 𝒞′; the steps are whole list items)
        'Tangenten von P': 'Tangentes issues de P', 'Dreieck aus c, α, β': 'Triangle donné par c, α, β', 'Tangenten an zwei Kreise': 'Tangentes à deux cercles',
        // the row of four step buttons does not wrap (.b-ctrl) and must fit at 390 px: short labels; "Alle Schritte" and "Von vorn" are rules
        // below, as gy5.js and os5.js have longer words for them
        'Konstruktion': 'Construction', '◀ Zurück': '◀ Retour', 'Weiter ▶': 'Suite ▶',
        'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$',
        'Konstruktion der Tangenten von einem Punkt an einen Kreis': 'Construction des tangentes à un cercle issues d’un point',
        'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln': 'Construction d’un triangle à partir d’un côté et de deux angles',
        'Konstruktion der gemeinsamen Tangenten an zwei Kreise': 'Construction des tangentes communes à deux cercles',
        'Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.':
            'On donne un cercle $\\mathcal{C}$ de centre $M$ et de rayon $r = 2$ cm, et un point $P$ extérieur à $\\mathcal{C}$.',
        'Verbinde $M$ und $P$.': 'Trace le segment $[MP]$.',
        'Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.':
            'Construis la médiatrice de $[MP]$ : deux arcs de cercle de centres $M$ et $P$ et de même rayon. Elle coupe $[MP]$ en son milieu $H$.',
        'Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.': 'Trace le cercle de centre $H$ qui passe par $M$ et $P$ : le cercle de diamètre $[MP]$.',
        'Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.':
            'Il coupe $\\mathcal{C}$ en $B_1$ et $B_2$. D’après le théorème du demi-cercle, les angles $\\angle MB_1P$ et $\\angle MB_2P$ sont droits.',
        'Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.':
            'Les droites $(PB_1)$ et $(PB_2)$ sont perpendiculaires aux rayons en $B_1$ et $B_2$ : ce sont les deux tangentes à $\\mathcal{C}$ issues de $P$.',
        'Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.':
            'Fais une figure d’étude et marque les données : $c = 6$ cm, $\\alpha$ et $\\beta$. C’est le cas ACA : un côté et ses deux angles adjacents.',
        'Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.': 'Trace le segment $[AB]$ de longueur $c = 6$ cm.',
        'Trage in $A$ den Winkel $\\alpha$ an.': 'Reporte l’angle $\\alpha$ en $A$.', 'Trage in $B$ den Winkel $\\beta$ an.': 'Reporte l’angle $\\beta$ en $B$.',
        'Die freien Schenkel schneiden sich im Punkt $C$.': 'Les côtés libres des deux angles se coupent au point $C$.',
        'Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.':
            'Trace le triangle $ABC$. Vérification : mesure $\\gamma$ et compare avec $180^\\circ - \\alpha - \\beta$.',
        'Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.':
            'On donne le cercle $\\mathcal{C}_1$ de centre $M_1$ et de rayon $r_1 = 2$ cm, et le cercle $\\mathcal{C}_2$ de centre $M_2$ et de rayon $r_2 = 1$ cm. On cherche les deux tangentes communes extérieures.',
        'Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.': 'Trace le cercle auxiliaire $\\mathcal{C}\'$ de centre $M_1$ et de rayon $r_1 - r_2 = 1$ cm.',
        'Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.':
            'Construis les tangentes à $\\mathcal{C}\'$ issues de $M_2$ comme dans « Tangentes issues de P » : le cercle de diamètre $[M_1M_2]$ coupe $\\mathcal{C}\'$ en $T_1$ et $T_2$.',
        'Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.':
            'Prolonge $[M_1T_1]$ et $[M_1T_2]$ jusqu’au cercle $\\mathcal{C}_1$ : tu obtiens les points de contact $B_1$ et $B_2$.',
        'Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.':
            'Déplace les tangentes auxiliaires de $r_2$ vers l’extérieur : les parallèles passant par $B_1$ et $B_2$ sont les tangentes communes. Elles touchent $\\mathcal{C}_2$ là où le rayon leur est perpendiculaire.',
        'Du kannst $P$ verschieben, in jedem Schritt.': 'Tu peux déplacer $P$ à chaque étape.', 'Du kannst $M_2$ verschieben, in jedem Schritt.': 'Tu peux déplacer $M_2$ à chaque étape.',
    },
    phrase: [
        // book fr-14 mathegy7-fr:
        // kreisgerade7 (the label of the line follows an arrow; "$ lang." after the chord is cut by a rule below)
        ['$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ', '$r = 3\\,\\text{cm}$ · distance de la droite au centre : $d \\approx '],
        ['$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine ', '$d > r$ : la droite n’a <b>aucun</b> point commun avec le cercle → '],
        ['$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine ',
            '$d = r$ : la droite a <b>exactement un</b> point commun avec le cercle, le point de contact $B$ → '],
        ['. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.', '. Le rayon $[MB]$ est perpendiculaire à la tangente.'],
        ['$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine ', '$d < r$ : la droite coupe le cercle en <b>deux</b> points $S_1$ et $S_2$ → '],
        ['. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $', '. Le segment $[S_1S_2]$ est une <b>corde</b>, ici d’environ $'],
        [' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.', ' La sécante passe par $M$ : la corde est un diamètre.'],
        // kreiswinkel7: the proof ideas, one piece per line of the widget source
        ['Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ',
            'Idée de la démonstration : le diamètre qui passe par $P$ partage la figure en triangles isocèles de sommet principal $M$. '],
        ['An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.',
            'Dans chacun, l’angle extérieur en $M$ est le double d’un angle à la base. Si $M$ n’est pas entre les côtés de l’angle, la démonstration doit distinguer plusieurs cas.'],
        ['Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ',
            'Idée de la démonstration : les quatre rayons partagent le quadrilatère en quatre triangles isocèles. Chaque angle du quadrilatère est formé de deux angles à la base. '],
        ['$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ',
            '$\\alpha + \\gamma$ contient exactement une fois chacun des quatre angles à la base différents, et $\\beta + \\delta$ aussi. Les deux sommes sont donc égales ; ensemble, elles font $360^\\circ$, donc chacune $180^\\circ$. '],
        ['(So einfach geht es, wenn $M$ im Viereck liegt.)', '(C’est aussi simple quand $M$ est à l’intérieur du quadrilatère.)'],
        // kreiswinkel7: the theorems start with their name in bold (a word key cannot start with <b>)
        ['<b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.',
            '<b>Théorème du demi-cercle :</b> si $C$ est sur le cercle de diamètre $[AB]$, alors l’angle en $C$ est un angle droit.'],
        ['<b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ',
            '<b>Angle inscrit et angle au centre :</b> l’angle au centre est le double de tout angle inscrit qui intercepte le même arc. '],
        ['<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.',
            '<b>Angles inscrits :</b> tous les angles inscrits qui interceptent le même arc sont égaux. Fais glisser $P$ sur son arc.'],
        ['<b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.',
            '<b>Angles opposés d’un quadrilatère inscrit :</b> dans un quadrilatère dont les sommets sont sur un cercle, les angles opposés sont supplémentaires : leur somme vaut $180^\\circ$.'],
        // konstruktion7: the warning after "$\alpha + \beta = 190^\circ$"
        [': Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.',
            ' : les côtés libres ne se coupent pas. Un tel triangle n’existe pas, car la somme des angles d’un triangle vaut $180^\\circ$.'],
    ],
    rule: [
        // book fr-14 mathegy7-fr:
        // French school notation (as js/buch-fr/gy5.js): × for the product in every formula of the widgets. Rules run before the
        // phrases, so a phrase key of this block writes \times where the widget writes \cdot (a word key keeps \cdot)
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // kreisgerade7: "… ist eine <b>Sehne</b>, hier etwa $4,8 cm$ lang." - the French has no "lang"
        [/(ist eine <b>Sehne<\/b>, hier etwa \$[^$]+)\$ lang\./g, '$1$.'],
        // dreieckkreise7: the centre of the circumcircle is O (German U), in the picture and in the formula of the radius
        [/(<text class="g-pt"[^>]*>)U(<\/text>)/g, '$1O$2'],
        [/\\overline\{UA\} = \\overline\{UB\} = \\overline\{UC\}/g, 'OA = OB = OC'],
        // "Würfel" is a die in other books (js/buch-fr/stochastik.js): here it is always the cube, as a whole label and between two tags
        [/^Würfel$/, 'Cube'], [/>Würfel</g, '>Cube<'],
        // konstruktion7: "SCHRITT 2 VON 5"; the circle k is 𝒞 and the auxiliary circle h is 𝒞′ in the picture (only the labels drawn with
        // the class first: the height h of schraegbild7 carries its colour before the class and stays)
        [/SCHRITT (\d+) VON (\d+)/g, 'ÉTAPE $1 SUR $2'],
        // the step buttons of konstruktion7, umstellen7 and vorzeichen7 (rows that do not wrap)
        [/(<button type="button" class="b-btn" data-k="all">)Alle Schritte(<\/button>)/g, '$1Tout voir$2'],
        [/(<button type="button" class="b-btn" data-k="(?:0|reset)">)Von vorn(<\/button>)/g, '$1Début$2'],
        [/(<text class="g-side"[^>]*>)k(<\/text>)/g, '$1𝒞$2'], [/(<text class="g-side"[^>]*>)h(<\/text>)/g, '$1𝒞′$2'],
    ]
});
