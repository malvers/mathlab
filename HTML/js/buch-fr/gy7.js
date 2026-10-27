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
        'Die drei': 'Les trois', 'Winkelhalbierenden': 'bissectrices',
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
        // zahlengerade7 (Betrag: valeur absolue, Gegenzahl: opposé)
        'Gegenzahlen': 'Opposés', 'Start': 'Départ', 'Addieren': 'Addition', 'Subtrahieren': 'Soustraction', 'Rechenart': 'Opération',
        'erste Zahl $a$': 'premier nombre $a$', 'zweite Zahl $b$': 'deuxième nombre $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Fais glisser les points $a$ et $b$ sur la droite graduée. Ils se calent de demi-unité en demi-unité.',
        'Zahlengerade mit rationalen Zahlen': 'Droite graduée avec des nombres rationnels', 'Rechnen als Bewegung auf der Zahlengeraden': 'Calculer, c’est se déplacer sur la droite graduée',
        'Betrag:': 'Valeur absolue :', ', der Abstand von der Null · Gegenzahl:': ', la distance à zéro · opposé :', ', gespiegelt an der Null': ', le symétrique par rapport à zéro',
        'Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.': 'Ajouter un nombre positif : vers la droite. Ajouter un nombre négatif : vers la gauche.',
        // zahlbereiche7 (N, Z, Q+ and Q: entiers naturels, entiers relatifs, rationnels positifs, nombres rationnels; the words of zahlen.js where they exist)
        'Wohin gehört die Zahl?': 'Où va ce nombre ?', 'Nächste Zahl': 'Nombre suivant', 'DIE ZAHL': 'LE NOMBRE',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, mais pas $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}_+$, mais pas $\\mathbb{N}$',
        'nur $\\mathbb{Q}$': 'seulement $\\mathbb{Q}$', 'Nur das Bild': 'Figure seule', 'Teilmengen': 'Sous-ensembles', 'Schnittmenge': 'Intersection', 'Vereinigung': 'Réunion', 'Mengen': 'Ensembles',
        'rationale Zahlen': 'nombres rationnels', 'ganze Zahlen': 'entiers relatifs', 'gebrochene Zahlen': 'rationnels positifs', 'natürliche': 'naturels',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Diagramme de Venn : entiers naturels, entiers relatifs, rationnels positifs et nombres rationnels',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': 'Dans quelle partie de la figure va-t-il ? Touche un bouton ou la figure.',
        'Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.':
            'Les <b>entiers relatifs</b> $\\mathbb{Z}$ et les <b>rationnels positifs</b> $\\mathbb{Q}_+$ se chevauchent. Dans la partie commune se trouvent les <b>entiers naturels</b> $\\mathbb{N}$. Le tout est contenu dans les <b>nombres rationnels</b> $\\mathbb{Q}$.',
        // vorzeichen7 (the products of the rows get their × by the rule above; "Von Zeile zu Zeile …" is a rule below)
        'Multiplizieren': 'Multiplication', 'Potenzen': 'Puissances', 'Muster': 'Régularité', 'erster Faktor': 'premier facteur', 'Nächste Zeile': 'Ligne suivante',
        'positiv': 'positif', 'negativ': 'négatif', 'Die Ergebnisse auf der Zahlengeraden': 'Les résultats sur la droite graduée',
        'Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.': 'Comment la suite continue-t-elle ? Réfléchis avant de découvrir la ligne suivante.',
        'Plus mal minus ergibt minus.': 'Plus par moins donne moins.', 'Minus mal minus ergibt plus. Minus mal plus ergibt minus.': 'Moins par moins donne plus. Moins par plus donne moins.',
        'Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.': 'Exposant pair : positif. Exposant impair : négatif. Car les signes moins s’annulent deux à deux.',
        'Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.': 'Attention : $-2^2 = -(2 \\times 2) = -4$, mais $(-2)^2 = 4$. Ce sont les parenthèses qui décident.',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'Une balance en équilibre : à gauche trois boîtes x et deux poids, à droite une boîte x et six poids',
        // umstellen7 (French letters: P for the perimeter, d for the distance, 𝓑 for the base of the pyramid - a rule below; "Dichte" is a rule:
        // gy12lk.js has the word for the density of a distribution)
        'Rechteck': 'Rectangle', 'Nächster Schritt': 'Étape suivante', 'Umfang': 'Périmètre', 'Geschwindigkeit': 'Vitesse', 'Formel': 'Formule', '⇄ Seiten tauschen': '⇄ échanger les membres', 'umstellen nach': 'isoler',
        // prozent7 (French letters: valeur de référence V, taux t %, part P - German G, p %, W; the sentences with numbers are rules below)
        'Grundwert $G$': 'Valeur de référence $V$', 'Prozentsatz $p\\,\\%$': 'Taux $t\\,\\%$', 'Änderung um': 'Variation de',
        'Danach um denselben Prozentsatz zurück': 'Puis le même taux en sens inverse', 'Balken vor und nach der Änderung': 'Barres avant et après la variation',
        'Die drei Grundaufgaben:<br>$W = p\\,\\% \\cdot G$ · $p\\,\\% = \\dfrac{W}{G}$ · $G = \\dfrac{W}{p\\,\\%}$':
            'Les trois problèmes types :<br>$P = t\\,\\% \\times V$ · $t\\,\\% = \\dfrac{P}{V}$ · $V = \\dfrac{P}{t\\,\\%}$',
        'Neuer Wert:': 'Nouvelle valeur :', 'Nicht': 'Pas',
        // diagramm7 (one data set as bar, line or pie chart)
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Comment viens-tu à l’école ? Sondage dans une classe', 'Antworten': 'Réponses', 'zu Fuß': 'À pied',
        'Fahrrad': 'À vélo', 'Bus, Bahn': 'Bus, train', 'Auto': 'En voiture', 'Klassensprecherwahl: Stimmen': 'Élection du délégué de classe : voix', 'Stimmen': 'Voix',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Hauteur d’un tournesol, mesurée chaque semaine',
        'Säulendiagramm': 'Diagramme en colonnes', 'Liniendiagramm': 'Diagramme en ligne brisée', 'Kreisdiagramm': 'Diagramme circulaire', 'Diagramm': 'Diagramme',
        'Woche': 'Semaine', 'Anteil': 'Proportion', 'Winkel': 'Angle', 'weniger': 'moins', 'mehr': 'plus',
        'Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.':
            'Un diagramme en ligne brisée ne convient pas ici : les catégories n’ont pas d’ordre, et il n’y a pas de valeurs intermédiaires entre elles.',
        'Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.':
            'Un diagramme circulaire ne convient pas ici : il montre des parts d’un tout. Les hauteurs des différentes semaines ne forment pas ensemble un tout qui ait un sens.',
        'Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.': 'Le diagramme en ligne brisée convient : il montre comment une valeur évolue au cours du temps.',
        // schraegbild7 (Zweitafelbild: épure, Aufriss / Grundriss: vue de face / vue de dessus, Rissachse: ligne de terre, Ordnungslinie: ligne de rappel,
        // wahre Länge: vraie grandeur; the points keep P′ and P″)
        'Körper': 'Solide', 'Schrägbild': 'Perspective cavalière', 'Zweitafelbild': 'Épure', 'Wahre Länge': 'Vraie grandeur', 'Darstellung': 'Représentation',
        'Kante $b$': 'Arête $b$', 'Deckkante $b$': 'Arête supérieure $b$', 'Breite $b$': 'Largeur $b$', 'Grundkante $a$': 'Arête de base $a$', 'Höhe $h$': 'Hauteur $h$',
        'AUFRISS': 'DE FACE', 'GRUNDRISS': 'DE DESSUS', '$\\overline{SB}$': '$[SB]$', '$\\overline{S\'\'B_0\'\'}$': '$[S\'\'B_0\'\']$',
        // faltnetz7
        'Falten': 'Pliage', '▶ Zusammenfalten': '▶ Plier', '◀ Auffalten': '◀ Déplier', 'Ein Netz faltet sich zu einem Körper': 'Un patron se plie pour former un solide',
        // schraegbild7 with data-calc: the materials (the formulas get the French letters by a rule below)
        'Stoff': 'Matériau', 'Fichtenholz': 'Épicéa', 'Glas': 'Verre', 'Stahl': 'Acier',
        // drittel7
        'Zusammenschieben': 'Assembler', '▶ Zusammenschieben': '▶ Assembler', '◀ Auseinander': '◀ Séparer',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Trois pyramides identiques forment un cube',
        'Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.':
            'Le cube a des arêtes de longueur $a$. Les trois pyramides ont leur sommet au même sommet du cube. Chacune a pour base un carré d’aire $\\mathcal{B} = a^2$ et pour hauteur $h = a$.',
        'Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also':
            'Trois pyramides identiques remplissent le cube : $3 \\times V_{\\text{pyramide}} = a^3$, donc',
        '$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$': '$V_{\\text{pyramide}} = \\tfrac13 \\times a^2 \\times a = \\tfrac13 \\times \\mathcal{B} \\times h$',
        // eckenwinkel7 (regular polygons around one vertex)
        'Dreiecke': 'Triangles', 'Quadrate': 'Carrés', 'Fünfecke': 'Pentagones', 'Sechsecke': 'Hexagones', 'Vieleck': 'Polygone', 'Anzahl an der Ecke': 'Nombre au sommet', 'flach': 'plat',
        'Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.':
            'Exactement $360^\\circ$ : les polygones sont à plat dans le plan, comme un pavage. On n’obtient pas de sommet de solide.',
        'Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.': 'Plus de $360^\\circ$ : les polygones se chevauchent. On ne peut pas en plier un sommet.',
        'Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.':
            'Colonnes : combien de polygones à un sommet. Exactement cinq cases sont cochées : il existe exactement cinq solides de Platon.',
        // book fr-18 mathe7-fr:
        // book fr-19 mathe8-fr:
        // book fr-20 mathe9-fr:
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
        // zahlengerade7: order, distance, and adding as a move
        ['b$, denn $', 'b$, car $'], [' liegt weiter <b>links</b>.', ' est plus à <b>gauche</b>.'], ['Abstand von $a$ und $b$: $', 'Distance entre $a$ et $b$ : $'],
        ['Start bei $', 'Départ en $'], ['$, dann $', '$, puis $'], ['nach <b>rechts</b>', 'vers la <b>droite</b>'], ['nach <b>links</b>', 'vers la <b>gauche</b>'],
        ['$ gar nicht.', '$ : on ne bouge pas.'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Soustraire un nombre, c’est <b>ajouter son opposé</b>. '],
        ['Minus mal minus: Wer $', 'Moins par moins : soustraire $'], ['$ abzieht, geht nach rechts.', '$, c’est aller vers la droite.'],
        // zahlbereiche7: why a number belongs to its set ("le nombre" is masculine), the hint and the set operations
        ['<b>Richtig!</b> $', '<b>Correct !</b> $'], ['eine natürliche Zahl', 'un entier naturel'], [', also natürlich', ', donc naturel'],
        ['der Betrag von $-4$ ist $4$', 'la valeur absolue de $-4$ est $4$'], ['ganz und negativ', 'entier et négatif'], ['ein Bruch ohne Minuszeichen', 'une fraction sans signe moins'],
        ['zwischen 2 und 3, nicht ganz', 'entre 2 et 3, pas entier'], ['negativ und nicht ganz', 'négatif et pas entier'],
        ['Noch nicht. Tipp: ', 'Pas encore. Indice : '], ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', 'Le nombre a-t-il un signe moins quand tu le calcules ?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Calcule d’abord le nombre. Est-il entier ?'],
        ['<b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}_+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}_+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.',
            '<b>Sous-ensemble :</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}_+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ et $\\mathbb{Q}_+ \\subset \\mathbb{Q}$. Tout entier naturel est aussi un entier relatif, mais pas l’inverse : $-3 \\in \\mathbb{Z}$, mais $-3 \\notin \\mathbb{N}$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}_+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Intersection :</b> $\\mathbb{Z} \\cap \\mathbb{Q}_+ = \\mathbb{N}$. Ce sont les nombres qui sont dans les deux ensembles : entiers <b>et</b> sans signe moins.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}_+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Réunion :</b> $\\mathbb{Z} \\cup \\mathbb{Q}_+$ contient tous les nombres qui sont dans au moins un des deux ensembles. Ce n’est pas encore tout $\\mathbb{Q}$ : $-\\tfrac12$ n’est dans aucun des deux.'],
        // umstellen7: the end of the steps and the check with numbers
        ['Fertig. Mit Zahlen: ', 'Terminé. Avec des nombres : '], ['. Probe: ', '. Vérification : '], ['Stahl, $\\varrho', 'Acier, $\\varrho'], ['Wasser, $\\varrho', 'Eau, $\\varrho'],
        // prozent7: the bars, the check, the way back
        ['vorher ', 'avant '], ['nachher ', 'après '], ['zurück ', 'retour '], ['Probe: $', 'Vérification : $'],
        ['Zurückrechnen auf den Grundwert: $', 'Retour à la valeur de référence : $'],
        [' der alte Wert! Die zweiten $', ' l’ancienne valeur ! Les $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ du retour portent sur une autre valeur de référence.'],
        // diagramm7: the chart title in bold above the table (a part that starts with <b> is no word)
        ['Wie kommst du zur Schule? Umfrage in einer Klasse', 'Comment viens-tu à l’école ? Sondage dans une classe'],
        ['Klassensprecherwahl: Stimmen', 'Élection du délégué de classe : voix'], ['Höhe einer Sonnenblume, jede Woche gemessen', 'Hauteur d’un tournesol, mesurée chaque semaine'],
        // schraegbild7: the counts under the name of the solid, the three representations
        [' · Ecken $', ' · sommets $'], ['$ · Kanten $', '$ · arêtes $'], ['$ · Flächen $', '$ · faces $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Perspective cavalière :</b> les arêtes qui partent vers l’arrière (les fuyantes) sont tracées à $45^\\circ$ et réduites de <b>moitié</b>. Toutes les autres arêtes sont en vraie grandeur. Les arêtes cachées sont en pointillés.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Vue de face</b> (en haut) : le solide vu de devant. <b>Vue de dessus</b> (en bas) : vu d’en haut. Les points qui se correspondent sont sur une <b>ligne de rappel</b> perpendiculaire à la ligne de terre $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notation : $A\'$ dans la vue de dessus, $A\'\'$ dans la vue de face.'],
        ['Die Seitenkante ', 'L’arête latérale '],
        [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' est oblique dans l’espace. Dans les deux vues, elle paraît <b>raccourcie</b>. Fais-la tourner autour de $S\'$ dans la vue de dessus, jusqu’à ce qu’elle soit parallèle à la ligne de terre : $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'La ligne de rappel mène à $B_0\'\'$. Le segment '], [' zeigt die <b>wahre Länge</b>.', ' est en <b>vraie grandeur</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Mesuré : $SB \\approx '],
        // faltnetz7: Euler with the French letters S, A, F (sommets, arêtes, faces)
        ['Ecken $e = ', 'Sommets $S = '], ['$ · Kanten $k = ', '$ · arêtes $A = '], ['$ · Flächen $f = ', '$ · faces $F = '],
        // schraegbild7 with data-calc (after the rule that gives the French letters: h_s is h_a there)
        ['$h_a$ ist die Höhe einer Seitenfläche, hier gemessen: $h_a \\approx ', '$h_a$ est l’apothème, la hauteur d’une face latérale, ici mesurée : $h_a \\approx '],
        ['$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$ : complète le tronc en une pyramide entière (hauteur $'], ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) et retire la petite pointe.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_a \\approx ', 'Les quatre faces latérales sont des trapèzes de hauteur $h_a \\approx '],
        // eckenwinkel7 ("So ist das <b>Ikosaeder</b> gebaut." is a rule)
        ['Jeder Innenwinkel: $', 'Chaque angle intérieur : $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · au sommet : $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. ', 'Moins de $360^\\circ$ : si l’on referme le vide, on obtient un sommet dans l’espace. '],
        // book fr-18 mathe7-fr:
        // book fr-19 mathe8-fr:
        // book fr-20 mathe9-fr:
    ],
    rule: [
        // book fr-14 mathegy7-fr:
        // French school notation (as js/buch-fr/gy5.js): × for the product in every formula of the widgets. Rules run before the
        // phrases, so a phrase key of this block writes \times where the widget writes \cdot (a word key keeps \cdot)
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // the French write the plus below: \\mathbb{Q}_+ and ℚ₊ for the German \\mathbb{Q}^+ and ℚ⁺ (Doc, 26.10.2026:
        // always the local conventions) - before the phrases, so a phrase key of this block writes _+
        [/\\mathbb\{Q\}\^\+/g, '\\mathbb{Q}_+'], [/ℚ⁺/g, 'ℚ₊'],
        // dreieckkreise7: "Die drei <span>Mittelsenkrechten</span> schneiden sich …" - lower case inside the sentence; a rule,
        // because the word 'Mittelsenkrechten' is the button label « Médiatrices » of GY 6 (merge of 26.10.2026)
        [/(<span class="g-cy">)Mittelsenkrechten(?=<\/span>)/g, '$1médiatrices'],
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
        // zahlbereiche7: "Richtig: 3 von 5" as in js/buch-fr/zahlen.js, and the colon after the number in "<b>Richtig!</b> $7$: …"
        [/Richtig: (\d+) von (\d+)/g, 'Bonnes réponses : $1 sur $2'], [/(<b>Richtig!<\/b> \$[^$]*\$): /g, '$1 : '],
        // vorzeichen7: "Von Zeile zu Zeile wird das Ergebnis um 3 kleiner. Damit das Muster weitergeht, muss $3 \times (-1) = -3$ sein."
        [/Von Zeile zu Zeile wird das Ergebnis um 3 (kleiner|größer)\. Damit das Muster weitergeht, muss \$([^$]+)\$ sein\./g,
            (m, w, f) => 'D’une ligne à l’autre, le résultat ' + (w === 'kleiner' ? 'diminue' : 'augmente') + ' de 3. Pour que la suite continue, il faut avoir $' + f + '$.'],
        // umstellen7: the instruction, and the French letters in every formula of the output (u → P, s → d, G → 𝓑); the colon between
        // two formulas of the check gets its no-break space
        [/^<p class="b-help" style="margin:0 0 4px">Die Formel \$([^$]+)\$ nach \$([^$]+)\$ umstellen: auf <b>beiden<\/b> Seiten dasselbe tun, bis \$[^$]+\$ allein steht\.<\/p>([\s\S]*)$/,
            (m, f, v, rest) => {
                const map = /^u = /.test(f) ? [/\bu\b/g, 'P'] : /^v = \\dfrac\{s\}/.test(f) ? [/\bs\b/g, 'd'] : /\\tfrac13 \\times G/.test(f) ? [/\bG\b/g, '\\mathcal{B}'] : null;
                const fix = t => map ? t.replace(/\$[^$]*\$/g, x => x.replace(map[0], map[1])) : t;
                return '<p class="b-help" style="margin:0 0 4px">' + fix('Isoler $' + v + '$ dans la formule $' + f + '$ : faire la même chose dans les <b>deux</b> membres, jusqu’à ce que $' + v + '$ soit seul.') + '</p>' + fix(rest).replace(/\$: (?=\$)/g, '$ : ');
            }],
        // umstellen7: the buttons "nach $b$" under "isoler" (s and G of the formulas are d and 𝓑), the formula "Dichte"
        [/(<button type="button" data-v="([A-Za-z])">)nach \$\2\$(<\/button>)/g, (m, a, v, c) => a + 'isoler $' + ({ s: 'd', G: '\\mathcal{B}' }[v] || v) + '$' + c],
        [/(<button type="button" data-v="4">)Dichte(<\/button>)/g, '$1Masse volumique$2'],
        // prozent7: the hundred square, the values with the French letters V, t %, P, increase "um" / "auf", the way back
        [/(\d+) von 100 Feldern/g, '$1 cases sur 100'],
        [/^Hunderterfeld mit (\d+) gefärbten Feldern( und Prozentstreifen)?$/, (m, n, s) => 'Grille de cent cases dont ' + n + ' colorées' + (s ? ', et bande de pourcentage' : '')],
        [/Grundwert \$G = ([^$]+)\$ · Prozentsatz \$p\\,\\% = ([^$]+)\$/g, 'Valeur de référence $V = $1$ · taux $t\\,\\% = $2$'],
        [/Prozentwert (<span class="g-lam">)\$W = (\d+)\\,\\% \\text\{ von \} /g, 'Part $1$P = $2\\,\\% \\text{ de } '],
        [/(Steigerung|Senkung) um \$(\d+)\\,\\%\$ heißt (?:Steigerung|Senkung) <b>auf<\/b> \$(\d+)\\,\\%\$\. Der Faktor ist \$/g,
            (m, k, a, b) => (k === 'Steigerung' ? 'Augmenter' : 'Diminuer') + ' de $' + a + '\\,\\%$, c’est passer <b>à</b> $' + b + '\\,\\%$. Le coefficient multiplicateur est $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen): /g, (m, p, v) => 'Puis ' + (v === 'senken' ? 'diminuer' : 'augmenter') + ' de $' + p + '\\,\\%$ : '],
        // diagramm7: the aria "<title> als Säulendiagramm" and the line under the table
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({ Säulendiagramm: 'Diagramme en colonnes', Liniendiagramm: 'Diagramme en ligne brisée',
            Kreisdiagramm: 'Diagramme circulaire' }[c]) + ' : ' + ({ 'Wie kommst du zur Schule? Umfrage in einer Klasse': 'comment viens-tu à l’école ? Sondage dans une classe',
            'Klassensprecherwahl: Stimmen': 'élection du délégué de classe, voix', 'Höhe einer Sonnenblume, jede Woche gemessen': 'hauteur d’un tournesol, mesurée chaque semaine' }[t] || t)],
        [/Zusammen: (\d+) (Antworten|Stimmen) = 100 % = 360°\. Im Kreisdiagramm gehören zu 1 % genau 3,6°\./g,
            (m, n, u) => 'Total : ' + n + (u === 'Antworten' ? ' réponses' : ' voix') + ' = 100 % = 360°. Dans le diagramme circulaire, 1 % correspond exactement à 3,6°.'],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({ 'Würfel': 'Cube', 'Quader': 'Pavé droit', 'Dreiecksprisma': 'Prisme triangulaire', 'Sechseckprisma': 'Prisme hexagonal',
            'Quadratische Pyramide': 'Pyramide à base carrée', 'Dreieckspyramide': 'Pyramide triangulaire', 'Pyramidenstumpf': 'Tronc de pyramide' }[b] || b) +
            (v === 'Schrägbild' ? ' en perspective cavalière' : ' : épure (vue de face et vue de dessus)')],
        // faltnetz7: "6 Vierecke", "1 Viereck, 4 Dreiecke" after the name, the colon after the name, Euler's S − A + F, the sentence about the regular solids
        [/(\d+) (Dreiecke?|Vierecke?|Fünfecke?|Sechsecke?)(?=, |<\/p>)/g, (m, n, w) => n + ' ' + ({ 'Dreieck': 'triangle', 'Dreiecke': 'triangles', 'Viereck': 'quadrilatère',
            'Vierecke': 'quadrilatères', 'Fünfeck': 'pentagone', 'Fünfecke': 'pentagones', 'Sechseck': 'hexagone', 'Sechsecke': 'hexagones' }[w])],
        [/(<p style="margin:0"><b>[^<]+<\/b>): /g, '$1 : '], [/\$e - k \+ f = /g, '$S - A + F = '],
        [/Alle Flächen sind gleiche regelmäßige (Dreiecke|Vierecke|Fünfecke|Sechsecke), an jeder Ecke stoßen (\d+) zusammen\./g, (m, w, n) => 'Toutes les faces sont des ' +
            { 'Dreiecke': 'triangles équilatéraux', 'Vierecke': 'carrés', 'Fünfecke': 'pentagones réguliers', 'Sechsecke': 'hexagones réguliers' }[w] + ' identiques ; chaque sommet en réunit ' + n + '.'],
        // schraegbild7 with data-calc (the output ends with "Masse aus …"): the French letters in its formulas - aire de la base 𝓑 (German G),
        // aire latérale A_L (M), aire totale A (O), périmètre P (u), apothème h_a (h_s); V_groß, V_klein; then the material of the mass
        [/[\s\S]*Masse aus [\s\S]*/, s => s.replace(/\$[^$]*\$/g, x => x.replace(/h_s/g, 'h_a').replace(/\\text\{groß\}/g, '\\text{grande}').replace(/\\text\{klein\}/g, '\\text{petite}')
            .replace(/(?<![A-Za-z\\])G(?![A-Za-z])/g, '\\mathcal{B}').replace(/(?<![A-Za-z\\])M(?![A-Za-z])/g, 'A_L').replace(/(?<![A-Za-z\\])O(?![A-Za-z])/g, 'A')
            .replace(/(?<![A-Za-z\\])u(?![A-Za-z])/g, 'P')).replace(/\$\): \$/g, '$) : $')],
        [/Masse aus (Fichtenholz|Glas|Stahl) \(/g, (m, s) => 'Masse en ' + { 'Fichtenholz': 'épicéa', 'Glas': 'verre', 'Stahl': 'acier' }[s] + ' ('],
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." (the cube may already be "Cube" from the rule above), the gap, the aria
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'C’est ainsi qu’est construit ' + ({ 'Tetraeder': 'le <b>tétraèdre</b>', 'Würfel': 'le <b>cube</b>',
            'Cube': 'le <b>cube</b>', 'Oktaeder': 'l’<b>octaèdre</b>', 'Dodekaeder': 'le <b>dodécaèdre</b>', 'Ikosaeder': 'l’<b>icosaèdre</b>' }[s] || '<b>' + s + '</b>') + '.'],
        [/>Lücke (\d+)°</g, '>Vide $1°<'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, (m, n, k) => n + ' polygones réguliers à ' + k + ' côtés autour d’un sommet'],
        // book fr-18 mathe7-fr:
        // faltnetz7 on a page that also loads js/buch-fr/gy6.js (OS 7, OS 8): the zufall6 rule of gy6.js turns every button
        // data-v="wuerfel" into the die "Dé" before the cube rule above runs - the solid gets its "Cube" back, tied to its neighbours
        [/(data-v="wuerfel">)Dé(<\/button><button type="button" data-v="quader">)/g, '$1Cube$2'],
        [/(data-v="tetraeder">[^<]*<\/button><button type="button" data-v="wuerfel">)Dé(<)/g, '$1Cube$2'],
        // book fr-19 mathe8-fr:
        // book fr-20 mathe9-fr:
    ]
});
