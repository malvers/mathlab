/* js/buch-fr/gy6.js — French for the widgets of js/buch-gy6.js.
 * Loaded by the French editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-fr.js.
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
 * js/buch-it/gy6.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy6', {
    word: {
        // book fr-13 mathegy6-fr:
        // titelbildgy6
        'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
            'Illustration de couverture : un disque avec trois huitièmes colorés, les nombres premiers jusqu’à 30 comme des points lumineux, un triangle avec ses trois angles et la parallèle passant par le sommet du haut, un prisme à base triangulaire en perspective cavalière',
        // bruchbild6 (the same words as bruch5 in js/buch-fr/gy5.js)
        'Zähler': 'Numérateur', 'Nenner': 'Dénominateur', 'Kreis': 'Cercle', 'Streifen': 'Bande', 'Bild': 'Représentation',
        'Der Bruch ist eine natürliche Zahl.': 'La fraction est un entier naturel.',
        // mengen6
        'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagramme de Venn : les entiers naturels sont à l’intérieur des nombres rationnels positifs',
        'Richtig.': 'Correct.', 'Noch nicht.': 'Pas encore.', 'Noch einmal': 'Recommencer',
        'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcule la valeur : est-ce un nombre entier, sans reste ?',
        'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Ce nombre ne serait-il pas entre deux entiers naturels ?',
        'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'dans $\\mathbb{N}$ (et donc aussi dans $\\mathbb{Q}^+$)',
        'nur in $\\mathbb{Q}^+$': 'seulement dans $\\mathbb{Q}^+$',
        'In der Schule zählt die 0 zu den natürlichen Zahlen.': 'À l’école, 0 fait partie des entiers naturels.',
        // bruchop6
        'plus': 'plus', 'minus': 'moins', 'mal': 'fois', 'durch': 'divisé par', 'Rechenart': 'Opération',
        'Zähler 1': 'Numérateur 1', 'Nenner 1': 'Dénominateur 1', 'Zähler 2': 'Numérateur 2', 'Nenner 2': 'Dénominateur 2',
        'Das Ergebnis wäre kleiner als null.': 'Le résultat serait plus petit que zéro.',
        'Für das Bild sind die Zahlen zu groß.': 'Les nombres sont trop grands pour la figure.',
        'Das Bild zeigt nur Brüche bis 1.': 'La figure ne montre que des fractions jusqu’à 1.',
        'Mal null ist null.': 'Zéro fois un nombre, c’est zéro.', 'Durch null kann man nicht teilen.': 'On ne peut pas diviser par zéro.',
        '1. Bruch': '1re fraction', '2. Bruch': '2e fraction', 'Ergebnis': 'Résultat', 'Grün': 'Vert',
        'Streifenbild der Rechnung': 'Le calcul représenté par des bandes', 'Rechteckbild: ein Teil von einem Teil': 'Rectangle : une part d’une part',
        'Wie oft passt der zweite Bruch in den ersten?': 'Combien de fois la deuxième fraction tient-elle dans la première ?',
        'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numérateur fois numérateur, dénominateur fois dénominateur. Simplifier avant fait gagner du travail.',
        'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Pour diviser par une fraction, on multiplie par son inverse.',
        // vorrang6 (the steps; "Jetzt:" and the sentences with a formula are phrases)
        'Punkt vor Strich': '× et : avant + et −', 'Klammern zuerst': 'Parenthèses d’abord', 'Mit Komma': 'Avec une virgule',
        'Von links nach rechts': 'De gauche à droite', 'Rechenvorteil': 'Calcul astucieux', 'Aufgabe': 'Exercice',
        'Nächster Schritt': 'Étape suivante', 'Von vorn': 'Recommencer', 'Fertig.': 'Terminé.',
        'Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.': 'Terminé. Avec la parenthèse, on n’obtient pas la même chose que sans.',
        'Fertig. Wer von links rechnet, erhält falsch $6$.': 'Terminé. Qui calcule simplement de gauche à droite trouve, à tort, $6$.',
        'Jetzt die Strichrechnung.': 'l’addition.',
        'Distributivgesetz: $\\tfrac25$ ausklammern.': 'distributivité : on met $\\tfrac25$ en facteur.',
        // probieren6
        'Einsetzen': 'Essayer', 'Alle Werte prüfen': 'Tester toutes les valeurs',
        'Zahlenstrahl: grün erfüllt, rot nicht': 'Droite graduée : en vert les valeurs qui conviennent, en rouge les autres',
        'Passt.': 'Convient.', 'Passt nicht.': 'Ne convient pas.',
        'Probe: Einsetzen ergibt eine wahre Aussage.': 'Vérification : en remplaçant, on obtient une égalité vraie.',
        'Die linke Seite ist zu klein.': 'Le membre de gauche est trop petit.', 'Die linke Seite ist zu groß.': 'Le membre de gauche est trop grand.',
        // pfeile6
        'Schüler → Vorname': 'Élève → prénom', 'Vorname → Schüler': 'Prénom → élève', 'Schüler → Sitzplatz': 'Élève → place',
        'Zahl → Teiler': 'Nombre → diviseurs', 'Zahl → Doppeltes': 'Nombre → double', 'Zahl → Rest bei : 3': 'Nombre → reste de la division par 3',
        'Zuordnung': 'Correspondance', 'Platz 1': 'Place 1', 'Platz 2': 'Place 2', 'Platz 3': 'Place 3', 'Platz 4': 'Place 4',
        'Welche Art von Zuordnung ist das?': 'De quel type de correspondance s’agit-il ?',
        'mehrdeutig': 'non univoque', 'eindeutig': 'univoque', 'eineindeutig': 'biunivoque',
        'Richtig:': 'Correct :', 'Nicht ganz.': 'Pas tout à fait.',
        // zufall6 ("Würfel" and the coin side "Zahl" are rules below: "Würfel" is also the cube, "Zahl" also a number)
        'Münze': 'Pièce', 'Glücksrad': 'Roue de loterie', 'Versuch': 'Expérience', 'Kopf': 'Face', 'Rot': 'Rouge', 'Blau': 'Bleu',
        '1-mal': '1 fois', '10-mal': '10 fois', '100-mal': '100 fois', 'Löschen': 'Effacer',
        'Säulendiagramm der relativen Häufigkeiten': 'Diagramme en colonnes des fréquences',
        'absolut': 'effectif', 'relativ': 'fréquence', 'in %': 'en %',
        // darstellung6
        'Kerze': 'Bougie', 'Temperatur': 'Température', 'Fahrradverleih': 'Location de vélos', 'Zeile wählen': 'Choisir une valeur',
        'Zeit in h': 'Durée en h', 'Höhe in cm': 'Hauteur en cm', 'Uhrzeit': 'Heure', 'Temperatur in °C': 'Température en °C',
        'Leihzeit in h': 'Durée de location en h', 'Preis in €': 'Prix en €',
        'Wortform:': 'En mots :', 'Tabelle:': 'Tableau :', 'Gleichung:': 'Équation :',
        'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'Aucune. La température se mesure, elle ne se calcule pas.',
        // proportional6
        'Äpfel': 'Pommes', 'Kuchen': 'Gâteau', 'Taxi': 'Taxi',
        'direkt proportional': 'proportionnel', 'indirekt proportional': 'inversement proportionnel', 'keins von beiden': 'ni l’un ni l’autre',
        'Masse in kg': 'Masse en kg', 'Personen': 'Personnes', 'Stück pro Person': 'Parts par personne', 'Strecke in km': 'Distance en km',
        'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.':
            'Le quotient $y : x$ vaut toujours $2{,}5$ : c’est <b>proportionnel</b>. Le graphique est une droite qui passe par l’origine.',
        'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.':
            'Le produit $x \\times y$ vaut toujours $24$ : c’est <b>inversement proportionnel</b>. Deux fois plus de personnes, deux fois moins de gâteau.',
        'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.':
            'Plus il y a de kilomètres, plus c’est cher. Mais le quotient change : ce n’est <b>pas proportionnel</b>. La droite ne passe pas par l’origine.',
        // dreisatz6
        'Pumpen': 'Pompes', 'Hefte': 'Cahiers', 'Futter': 'Nourriture', 'Antwort:': 'Réponse :',
        '3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?': '3 kg de pommes coûtent 7,50 €. Combien coûtent 5 kg ?',
        '4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?': '4 pompes vident un bassin en 6 heures. Combien de temps faut-il à 3 pompes ?',
        '5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?': '5 cahiers coûtent 4 €. Combien coûtent 8 cahiers ?',
        'Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?': 'Une réserve de nourriture suffit à 12 lapins pendant 10 jours. Combien de temps suffit-elle à 8 lapins ?',
        '5 kg Äpfel kosten 12,50 €.': '5 kg de pommes coûtent 12,50 €.', '3 Pumpen brauchen 8 Stunden.': '3 pompes mettent 8 heures.',
        '8 Hefte kosten 6,40 €.': '8 cahiers coûtent 6,40 €.', 'Für 8 Kaninchen reicht das Futter 15 Tage.': 'Pour 8 lapins, la nourriture suffit 15 jours.',
        'Schritt 1: Schreib auf, was du weißt.': 'Étape 1 : écris ce que tu sais.', 'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Étape 3 : calcule la valeur pour la quantité cherchée.',
        // winkelsumme6
        'Dreieck': 'Triangle', 'Beweisfigur': 'Figure de la démonstration', 'Ansicht': 'Vue',
        'Dreieck mit seinen Innenwinkeln': 'Triangle avec ses trois angles',
        'Dreieck mit seinen Innenwinkeln und der Parallelen durch C': 'Triangle avec ses trois angles et la parallèle passant par C',
        'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.':
            'Fais glisser les sommets. Les angles changent, leur somme reste la même. Les valeurs sont arrondies au degré près.',
        // konstruktion6: C côté, A angle; CcA = two sides and the angle opposite the larger one C (German SsW)
        'sss': 'CCC', 'sws': 'CAC', 'wsw': 'ACA', 'SsW': 'CcA', 'www': 'AAA', 'Gegeben': 'Données',
        'Seite $a$': 'Côté $a$', 'Seite $b$': 'Côté $b$', 'Seite $c$': 'Côté $c$',
        'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$', 'Seite $a$ gegenüber $\\alpha$': 'Côté $a$ opposé à $\\alpha$',
        'Genau ein Dreieck.': 'Exactement un triangle.', 'Kein Dreieck.': 'Aucun triangle.', 'Zwei Dreiecke.': 'Deux triangles.',
        'Unendlich viele Dreiecke.': 'Une infinité de triangles.',
        'Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.':
            'Le cercle de centre $A$ et de rayon $r = b$ et le cercle de centre $B$ et de rayon $r = a$ se coupent au-dessus de $c$ en exactement un point.',
        'Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.': 'Sur le côté de l’angle $\\alpha$, on reporte la longueur $b$. L’extrémité est $C$.',
        'Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.':
            'Le cercle de centre $B$ coupe deux fois le côté de l’angle. Les données ne déterminent pas le triangle.',
        'Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.': 'Le côté opposé $a$ est le plus grand : $a \\geq c$.',
        'Der Kreis berührt den Schenkel nur.': 'Le cercle touche seulement le côté de l’angle.',
        'Der Kreis um $B$ erreicht den Schenkel nicht.': 'Le cercle de centre $B$ n’atteint pas le côté de l’angle.',
        'Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.':
            'Ils ont tous la même forme, mais des tailles différentes. Trois angles ne déterminent pas un triangle.',
        'Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.':
            'On connaît de toute façon le troisième angle : $\\gamma = 180^\\circ - \\alpha - \\beta$. Il manque une longueur.',
        // seitenwinkel6
        'Dreieck aus drei Stäben': 'Triangle formé de trois baguettes', 'Die Stäbe ergeben kein Dreieck': 'Les baguettes ne forment pas de triangle',
        // linien6 (French letters: O for the circumcentre, G for the centroid; rules below)
        'Mittelsenkrechten': 'Médiatrices', 'Winkelhalbierende': 'Bissectrices', 'Höhen': 'Hauteurs', 'Seitenhalbierende': 'Médianes', 'Linien': 'Droites',
        // flaeche6 (French letters: the base b of the parallelogram and the triangle, German g; rules below)
        'Parallelogramm': 'Parallélogramme', 'Trapez': 'Trapèze', 'Drachenviereck': 'Cerf-volant', 'Figur': 'Figure',
        'Zerlegen und verschieben': 'Découper et déplacer', 'Grundseite $g$': 'Base $b$', 'Höhe $h$': 'Hauteur $h$',
        'Diagonale $e$': 'Diagonale $e$', 'Diagonale $f$': 'Diagonale $f$',
        // vierecke6 ("gleichschenkliges" / "Trapez" in two lines: a rule below puts them in French order)
        'Quadrat': 'Carré', 'Rechteck': 'Rectangle', 'Raute': 'Losange', 'Viereck': 'Quadrilatère',
        'gleichschenkliges Trapez': 'Trapèze isocèle', 'Haus der Vierecke': 'Maison des quadrilatères',
        'parallele Seiten': 'côtés parallèles', 'gleich lange Seiten': 'côtés de même longueur', 'rechte Winkel': 'angles droits', 'Symmetrieachsen': 'axes de symétrie',
        'Diagonalen halbieren sich': 'diagonales de même milieu', 'Diagonalen senkrecht': 'diagonales perpendiculaires', 'Diagonalen gleich lang': 'diagonales de même longueur',
        '2 Paare': '2 paires', '1 Paar': '1 paire', 'alle vier': 'les quatre', 'je zwei gegenüber': 'opposés deux à deux', 'keine nötig': 'non exigé',
        'keins nötig': 'non exigé', 'die beiden Schenkel': 'les deux côtés obliques', 'je zwei benachbarte': 'consécutifs deux à deux',
        'nur eine die andere': 'l’une coupe l’autre en son milieu', 'mindestens 1': 'au moins 1', 'ja': 'oui', 'nein': 'non',
        'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.':
            'Le <b>quadrilatère</b> est tout en bas : il lui faut seulement quatre sommets et quatre côtés, rien d’autre.',
        'Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.':
            'Touche un quadrilatère de la maison. Ce qui est plus bas est plus général, ce qui est plus haut a plus de propriétés.',
        // prisma6 (French letters: B base area, P perimeter of the base, A_L lateral area, A total area; German G, u, M, O)
        'Dreiecksprisma': 'Prisme triangulaire', 'Quader': 'Pavé droit', 'Trapezprisma': 'Prisme trapézoïdal', 'Sechseckprisma': 'Prisme hexagonal',
        'Prisma': 'Prisme', 'Schrägbild': 'Perspective cavalière', 'Netz': 'Patron',
        'Grundkante $a$': 'Arête de base $a$', 'Höhe $h$ des Prismas': 'Hauteur $h$ du prisme',
        'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.':
            'Perspective cavalière : la base est devant, en vraie grandeur. Les arêtes fuyantes sont tracées à $45^\\circ$ et réduites de moitié. Les arêtes cachées sont en pointillés.',
        'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.':
            'Le patron est formé des deux bases et de la surface latérale. La surface latérale est un rectangle : aussi large que le périmètre $P$ de la base, aussi haut que $h$.',
    },
    phrase: [
        // book fr-13 mathegy6-fr:
        // bruchbild6
        ['Bruch: $', 'Fraction : $'], ['Dezimalzahl: $', 'Écriture décimale : $'], ['Prozent: $', 'Pourcentage : $'],
        ['Der gekürzte Nenner ', 'Le dénominateur simplifié '],
        [' hat nur die Primfaktoren 2 und 5. ', ' n’a que les facteurs premiers 2 et 5. '],
        ['. Die Dezimalzahl <b>bricht ab</b>.', '. L’écriture décimale <b>s’arrête</b>.'],
        ['$ enthält den Primfaktor $', '$ contient le facteur premier $'],
        ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
            '$. Impossible d’amplifier pour obtenir 10, 100, 1 000… : l’écriture décimale est <b>périodique</b>.'],
        // mengen6: the reasons of the twelve numbers
        ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 est un entier naturel, et tout entier naturel est aussi un nombre rationnel positif : '],
        [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' est compris entre 0 et 1. Ce n’est pas un entier naturel.'],
        [' liegt zwischen 0 und 1.', ' est compris entre 0 et 1.'], [' liegt zwischen 2 und 3.', ' est compris entre 2 et 3.'],
        [' liegt zwischen 4 und 5.', ' est compris entre 4 et 5.'],
        ['. Der Bruch sieht nur anders aus als die 3.', '. La fraction n’est qu’une autre écriture de 3.'],
        ['. Die Null nach dem Komma ändert nichts.', '. Le zéro après la virgule ne change rien.'],
        // mengen6: the text under the diagram before the first answer
        [': die natürlichen Zahlen $0, 1, 2, 3, \\dots$', ' : les entiers naturels $0\\,;\\,1\\,;\\,2\\,;\\,3\\,;\\,\\dots$'],
        [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $\\tfrac{p}{q}$ schreiben kann.',
            ' : les nombres rationnels positifs, c’est-à-dire tous les nombres qu’on peut écrire sous forme de fraction $\\tfrac{p}{q}$.'],
        ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Tout entier naturel est aussi un nombre rationnel positif : $'],
        // bruchop6
        ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
            '$ : avec les nombres rationnels positifs, cette soustraction est impossible. Tu découvriras les nombres négatifs en 7e année.'],
        ['Hauptnenner: $', 'Dénominateur commun : $'],
        ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
            '$ : combien de fois « rien » tient-il dans quelque chose ? Cette question n’a pas de réponse. On ne divise jamais par $0$.'],
        // vorrang6
        ['<b>Jetzt:</b> ', '<b>Maintenant :</b> '], ['Punktrechnung zuerst: $', 'la multiplication d’abord : $'], ['Hauptnenner 4: $', 'dénominateur commun 4 : $'],
        ['Die Klammer zuerst: $', 'la parenthèse d’abord : $'], ['Punkt vor Strich: $', 'la multiplication avant la soustraction : $'],
        ['Zwei Punktrechnungen: die linke zuerst. $', 'deux opérations prioritaires : celle de gauche d’abord. $'],
        ['Fertig. Ohne Ausklammern: $', 'Terminé. Sans mettre en facteur : $'], ['$, mehr Arbeit.', '$, c’est plus de travail.'],
        // probieren6
        ['Es passen: ', 'Conviennent : '], ['Bisher passt keiner.', 'Aucune valeur ne convient pour l’instant.'],
        // pfeile6: the labels inside the picture's aria label, the reasons
        ['Pfeildarstellung: ', 'Diagramme sagittal : '],
        ['Schüler → Vorname', 'élève → prénom'], ['Vorname → Schüler', 'prénom → élève'], ['Schüler → Sitzplatz', 'élève → place'],
        ['Zahl → Teiler', 'nombre → diviseurs'], ['Zahl → Doppeltes', 'nombre → double'], ['Zahl → Rest bei : 3', 'nombre → reste de la division par 3'],
        ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
            'De chaque élément de gauche part exactement une flèche, et chaque élément de droite en reçoit exactement une. Dans l’autre sens aussi, la correspondance est univoque.'],
        ['Von jedem Element links geht genau ein Pfeil aus. ', 'De chaque élément de gauche part exactement une flèche. '],
        ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
            '<b>non univoque :</b> d’un élément partent plusieurs flèches. <b>univoque :</b> de chacun en part exactement une. <b>biunivoque :</b> univoque, et univoque aussi dans l’autre sens.'],
        // zufall6
        ['Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance',
            'Fréquence = effectif : nombre d’essais. La ligne en pointillés montre la probabilité'],
        [' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)', ' (le rouge occupe la moitié de la roue, le bleu un tiers, le vert un sixième)'],
        ['. Je mehr Versuche, desto näher kommen die Säulen meistens heran.', '. Plus il y a d’essais, plus les colonnes s’en approchent, en général.'],
        // darstellung6
        ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'Une bougie mesure 20 cm de haut. Chaque heure, elle diminue de 2,5 cm.'],
        ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'Un jour d’automne, on mesure la température toutes les deux heures.'],
        ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'Louer un vélo coûte 3 € par heure.'],
        ['Diagramm: ', 'Graphique : '], ['Gewählt: ', 'Choisi : '],
        ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
            'La bougie se consume régulièrement, même entre les heures pleines. C’est pourquoi on peut relier les points par une ligne.'],
        ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
            'La ligne en pointillés relie seulement les points mesurés. Ce qui s’est passé entre deux mesures, on ne le sait pas exactement.'],
        ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'On ne paie que des heures entières : c’est pourquoi il n’y a que des points isolés.'],
        // proportional6: the question inside the picture's aria label and above the table
        ['Äpfel: 1 kg kostet 2,50 €', 'Pommes : 1 kg coûte 2,50 €'], ['24 Stück Kuchen werden gerecht verteilt', '24 parts de gâteau sont partagées équitablement'],
        ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Taxi : 3 € de prise en charge et 2 € par km'],
        ['Graph der Zuordnung ', 'Graphique de la correspondance : '], ['. Zieh den gelben Punkt.', '. Fais glisser le point jaune.'],
        // dreisatz6
        ['Schritt 2: Rechne auf eins zurück. ', 'Étape 2 : passe par l’unité. '],
        ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'Proportionnalité : on fait le même calcul des deux côtés.'],
        ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
            'Proportionnalité inverse : à droite, on fait le calcul inverse. « : 4 » à gauche devient « × 4 » à droite.'],
        // winkelsumme6
        ['Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ',
            'La ligne en pointillés est parallèle à $(AB)$. $\\alpha\'$ et $\\alpha$ sont des angles alternes-internes formés par des parallèles, donc ils ont la même mesure. De même pour $\\beta\'$ et $\\beta$. '],
        ['Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.', 'Avec $\\gamma$, $\\alpha\'$ et $\\beta\'$ forment un angle plat : $180^\\circ$.'],
        // konstruktion6: the theorems, the sentences with a computed number
        ['<b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.',
            '<b>Cas d’égalité CCC :</b> si deux triangles ont leurs trois côtés de même longueur, alors ils sont égaux.'],
        ['<b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.',
            '<b>Cas d’égalité CAC :</b> si deux triangles ont deux côtés de même longueur et l’angle compris entre eux de même mesure, alors ils sont égaux.'],
        ['<b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.',
            '<b>Cas d’égalité ACA :</b> si deux triangles ont un côté de même longueur et les deux angles adjacents à ce côté de même mesure, alors ils sont égaux.'],
        ['<b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.',
            '<b>Cas d’égalité CcA :</b> si deux triangles ont deux côtés de même longueur et la même mesure pour l’angle opposé au <b>plus grand</b> de ces côtés, alors ils sont égaux.'],
        ['Die freien Schenkel der Winkel schneiden sich in $C$. ', 'Les côtés libres des angles se coupent en $C$. '],
        ['. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.', '. Il ne reste rien pour $\\gamma$ : les côtés des angles s’écartent l’un de l’autre.'],
        ['$\\alpha + \\beta$ ist schon $', '$\\alpha + \\beta$ vaut déjà $'],
        ['Die Kreise berühren sich nur auf der längsten Seite.', 'Les cercles se touchent seulement sur le plus long côté.'],
        ['Die Kreise treffen sich nicht.', 'Les cercles ne se coupent pas.'],
        // seitenwinkel6
        ['Alle Seiten gleich lang: alle Winkel $60^\\circ$. ', 'Tous les côtés ont la même longueur : tous les angles mesurent $60^\\circ$. '],
        ['Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.',
            'Deux côtés ont la même longueur : le triangle est isocèle, et ses angles à la base ont la même mesure.'],
        ['Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.',
            'Les deux baguettes les plus courtes sont ensemble exactement aussi longues que la plus longue : elles restent à plat sur elle. Ce n’est pas un triangle.'],
        ['Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.', 'Les deux baguettes les plus courtes ne se rejoignent pas, quelle que soit la façon dont on les tourne.'],
        [' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.', ' <b>Inégalité triangulaire :</b> deux côtés ensemble doivent toujours être plus longs que le troisième.'],
        // linien6
        ['Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.',
            'Chaque point d’une médiatrice est à la même distance des deux sommets. Leur point d’intersection $O$ est à la même distance des <b>trois sommets</b> : c’est le centre du cercle circonscrit.'],
        [' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.', ' Dans un triangle obtusangle, $O$ est à l’extérieur.'],
        [' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.', ' Dans un triangle rectangle, $O$ est exactement sur le plus long côté.'],
        [' Bei einem spitzwinkligen Dreieck liegt $U$ innen.', ' Dans un triangle acutangle, $O$ est à l’intérieur.'],
        ['Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.',
            'Chaque point d’une bissectrice est à la même distance des deux côtés de l’angle. Leur point d’intersection $I$ est à la même distance des <b>trois côtés</b> : c’est le centre du cercle inscrit. Il est toujours à l’intérieur.'],
        ['Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.',
            'Une hauteur est la perpendiculaire abaissée d’un sommet sur le côté opposé. Les trois hauteurs se coupent en un point $H$.'],
        [' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).', ' Dans un triangle obtusangle, $H$ est à l’extérieur : il faut prolonger les côtés (en pointillés).'],
        [' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.', ' Dans un triangle rectangle, $H$ est le sommet de l’angle droit.'],
        ['Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.',
            'Une médiane relie un sommet au milieu du côté opposé. Leur point d’intersection $G$ est le centre de gravité : on peut y faire tenir en équilibre un triangle en carton sur la pointe d’une aiguille.'],
        // flaeche6
        ['Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.',
            'Le triangle découpé glisse vers la droite. Le parallélogramme devient un rectangle de même base et de même hauteur.'],
        ['Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.',
            'Une copie du triangle tourne autour du milieu d’un côté. Ensemble, les deux forment un parallélogramme. Le triangle en est la moitié.'],
        ['Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.',
            'Une copie du trapèze tourne autour du milieu d’un côté oblique. Ensemble, les deux forment un parallélogramme de base $a + c$.'],
        ['Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.',
            'Les quatre triangles du cerf-volant se rabattent vers l’extérieur. Ils remplissent exactement la moitié du rectangle formé par les deux diagonales.'],
        // prisma6 (after the rule × for \cdot)
        ['Grundfläche $G', 'Aire de la base $B'], ['$, Umfang der Grundfläche $u', '$, périmètre de la base $P'], ['Mantel $M = u', 'Aire latérale $A_L = P'],
        ['Oberfläche $O = 2 \\times G + M', 'Aire totale $A = 2 \\times B + A_L'], ['Volumen $V = G \\times h', 'Volume $V = B \\times h'],
    ],
    rule: [
        // book fr-13 mathegy6-fr:
        // French school notation (Doc, 26.10.2026: always the conventions of the target language): × for the product
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // the steppers' aria-labels: "Zähler kleiner" → "Numérateur : diminuer"
        [/^(Zähler|Nenner|erster Zähler|erster Nenner|zweiter Zähler|zweiter Nenner|zu Fuß|Fahrrad|Bus oder Bahn|Auto) (kleiner|größer)$/, (m, w, d) => ({
            'Zähler': 'Numérateur', 'Nenner': 'Dénominateur', 'erster Zähler': 'Premier numérateur', 'erster Nenner': 'Premier dénominateur',
            'zweiter Zähler': 'Deuxième numérateur', 'zweiter Nenner': 'Deuxième dénominateur',
            'zu Fuß': 'À pied', 'Fahrrad': 'À vélo', 'Bus oder Bahn': 'Bus ou train', 'Auto': 'En voiture' })[w] + (d === 'kleiner' ? ' : diminuer' : ' : augmenter')],
        // bruchbild6
        [/^Bild des Bruches (\d+) durch (\d+)$/, 'La fraction $1/$2 en image'],
        [/Erweitern mit \$(\d+)\$: /, 'On amplifie par $$$1$$ : '],
        [/Null Teile von (\d+) sind nichts: \$0\$\./, 'Zéro part sur $1, ce n’est rien : $0$.'],
        // mengen6
        [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Nombre $1 sur $2 : où va <b>$3</b> ?'],
        [/Alle Zahlen sind einsortiert(?:, (\d+) von (\d+) gleich beim ersten Versuch richtig)?\./g,
            (m, a, b) => 'Tous les nombres sont rangés' + (a ? ' : ' + a + ' sur ' + b + ' justes du premier coup' : '') + '.'],
        [/(\\in \\mathbb\{Q\}\^\+\$) und \$/g, '$1 et $'], [/(\\in \\mathbb\{Q\}\^\+\$), aber \$/g, '$1, mais $'],
        // bruchop6
        [/\(das kleinste gemeinsame Vielfache von \$(\d+)\$ und \$(\d+)\$\)/g, (m, a, b) => '(le plus petit multiple commun de $' + a + '$ et $' + b + '$)'],
        [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g, (m, v) =>
            'On met d’abord au même dénominateur, puis on ' + (v === 'addieren' ? 'additionne' : 'soustrait') + ' les numérateurs. Le dénominateur reste le même.'],
        [/(<span class="g-phi">)(?:Grün|\u0003\d+\u0004)(<\/span>): \$(\d+)\$ von \$(\d+)\$ Kästchen\. Das ist (\$[^$]*\$) von (\$[^$]*\$)\./g, (m, s1, s2, a, b, x, y) =>
            s1 + 'Vert' + s2 + ' : $' + a + '$ cases sur $' + b + '$. C’est ' + x + ' de ' + y + '.'],
        [/(\$[^$]*\$) passt (\$[^$]*\$)-mal in (\$[^$]*\$)\./g, (m, x, k, y) => x + ' tient ' + k + ' fois dans ' + y + '.'],
        // probieren6
        [/(\$[a-z] = [^$]*\$): &nbsp; /g, '$1 : &nbsp; '], [/(\$[^$]*\$), und (\$[^$]*\$)<\/p>/g, '$1, et $2</p>'],
        [/Gesucht sind alle Zahlen, für die die linke Seite (kleiner|größer) als (\$[^$]*\$) ist\./g, (m, r, x) =>
            'On cherche tous les nombres pour lesquels le membre de gauche est ' + (r === 'kleiner' ? 'inférieur' : 'supérieur') + ' à ' + x + '.'],
        [/Geprüft: (\d+) von (\d+) Werten\. /g, (m, a, b) => (a === '1' ? 'Valeur testée : 1 sur ' : 'Valeurs testées : ' + a + ' sur ') + b + '. '],
        // pfeile6
        [/Die Zuordnung ist (mehrdeutig|eindeutig, aber nicht eineindeutig|eineindeutig)\. /g, (m, k) => 'La correspondance est ' +
            ({ 'mehrdeutig': 'non univoque', 'eindeutig, aber nicht eineindeutig': 'univoque, mais pas biunivoque', 'eineindeutig': 'biunivoque' })[k] + '. '],
        [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, 'De « $1 » partent $2 flèches.'],
        [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g,
            'Mais « $1 » reçoit $2 flèches : dans l’autre sens, la correspondance n’est donc pas univoque.'],
        // zufall6: the die (the cube of other books has the same word), the coin side "Zahl", the table head, the number of trials
        [/(data-v="wuerfel">)(?:Würfel|\u0003\d+\u0004)(<)/g, '$1Dé$2'],
        [/(<td>|<text class="d-num"[^>]*>)Zahl(<\/)/g, '$1Pile$2'],
        [/(g6-tab"><tr><th>)(?:Ergebnis|\u0003\d+\u0004)(<\/th><th>)/g, '$1Issue$2'],
        [/>(\d+) Versuche</g, (m, n) => '>' + n + (n === '0' || n === '1' ? ' essai' : ' essais') + '<'],
        // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
        [/Gewählt: Uhrzeit /g, 'Gewählt: heure '], [/ → Temperatur /g, ' → température '],
        // dreisatz6: "4 Pumpen" → "4 pompes", "1 Kaninchen" → "1 lapin"; the arrows "↓ · 5" → "↓ × 5"
        [/>([\d.,]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => '>' + n + ' ' +
            ({ 'Pumpen': ['pompe', 'pompes'], 'Hefte': ['cahier', 'cahiers'], 'Kaninchen': ['lapin', 'lapins'], 'Tage': ['jour', 'jours'] })[u][n === '1' ? 0 : 1] + '<'],
        [/(↓ )· (?=\d)/g, '$1× '],
        // konstruktion6
        [/Die beiden kürzeren Seiten sind zusammen ([\d,]+) cm lang, die längste ([\d,]+) cm\. /g, 'Les deux côtés les plus courts mesurent ensemble $1 cm, le plus long $2 cm. '],
        [/^Konstruktion aus (sss|sws|wsw|SsW|www)$/, (m, k) => 'Construction à partir de ' + ({ sss: 'CCC', sws: 'CAC', wsw: 'ACA', SsW: 'CcA', www: 'AAA' })[k]],
        // seitenwinkel6: the largest angle lies opposite the longest side
        [/Der <span class="g-lam">längsten Seite \$([abc])\$<\/span> liegt der <span class="g-lam">größte Winkel \$(\\[a-z]+)\$<\/span> gegenüber, der <span class="g-cy">kürzesten \$([abc])\$<\/span> der kleinste\. /g,
            (m, s1, w, s2) => 'Le <span class="g-lam">plus grand angle $' + w + '$</span> est opposé au <span class="g-lam">plus long côté $' + s1 + '$</span>, le plus petit au <span class="g-cy">plus court $' + s2 + '$</span>. '],
        // linien6: the French letters of the points (O circumcentre, G centroid), the line under the buttons, the aria label
        [/(r="5.5" fill="#F5C242"\/><text class="g-pt"[^>]*>)([US])(<\/text>)/g, (m, a, p, b) => a + (p === 'U' ? 'O' : 'G') + b],
        [/ · Schnittpunkt \$([UIHS])\$: (Umkreismittelpunkt|Inkreismittelpunkt|Höhenschnittpunkt|Schwerpunkt)/g, (m, p, w) => ' · point d’intersection $' +
            ({ U: 'O', I: 'I', H: 'H', S: 'G' })[p] + '$ : ' + ({ 'Umkreismittelpunkt': 'centre du cercle circonscrit', 'Inkreismittelpunkt': 'centre du cercle inscrit',
                'Höhenschnittpunkt': 'orthocentre', 'Schwerpunkt': 'centre de gravité' })[w]],
        [/^Dreieck mit seinen (Mittelsenkrechten|Winkelhalbierende|Höhen|Seitenhalbierende)$/, (m, l) => 'Triangle avec ses ' +
            ({ 'Mittelsenkrechten': 'médiatrices', 'Winkelhalbierende': 'bissectrices', 'Höhen': 'hauteurs', 'Seitenhalbierende': 'médianes' })[l]],
        // flaeche6: the base b (German g) in the formulas, the aria label of the picture
        [/\$A = (\\tfrac12 \\times )?g \\times h = /g, '$$A = $1b \\times h = '],
        [/^(Parallelogramm|Dreieck|Trapez|Drachenviereck): zerlegen und verschieben$/, (m, s) =>
            ({ 'Parallelogramm': 'Parallélogramme', 'Dreieck': 'Triangle', 'Trapez': 'Trapèze', 'Drachenviereck': 'Cerf-volant' })[s] + ' : découper et déplacer'],
        // vierecke6: the two-line label "gleichschenkliges / Trapez" (the second line may already be a translated label)
        [/(<text class="g6-nodetxt"[^>]*>)gleichschenkliges(<\/text>[^<]*<text class="g6-nodetxt"[^>]*>)(?:Trapez|\u0003\d+\u0004)(<\/text>)/g, '$1Trapèze$2isocèle$3'],
        // vierecke6: "Jedes <b>Quadrat</b> ist auch ein Rechteck, eine Raute, …" - every French name is masculine ("tout", "un")
        [/Jede[s]? <b>([^<]+)<\/b> ist auch ([^<]+)\.<\/p>/g, (m, s, list) => {
            const N = { 'Quadrat': 'carré', 'Rechteck': 'rectangle', 'Raute': 'losange', 'Parallelogramm': 'parallélogramme', 'gleichschenkliges Trapez': 'trapèze isocèle',
                'gleichschenklige Trapez': 'trapèze isocèle', 'Drachenviereck': 'cerf-volant', 'Trapez': 'trapèze', 'Viereck': 'quadrilatère' };
            return 'Tout <b>' + (N[s] || s) + '</b> est aussi ' + list.split(', ').map(x => { const k = x.replace(/^eine?s? /, ''); return N[k] ? 'un ' + N[k] : x; }).join(', ') + '.</p>';
        }],
        // prisma6: the letters in the two pictures (G → B, M → A with a subscript L), only inside the prism pictures
        [/(aria-label="[^"]*(?:im Schrägbild: Grundfläche vorn in wahrer Größe|zwei Grundflächen und der Mantel aus Rechtecken)[^"]*"[\s\S]*?<\/svg>)/g, m =>
            m.replace(/(<text class="g-area"[^>]*>)G(<\/text>)/g, '$1B$2').replace(/(<text class="g-area"[^>]*>)M(<\/text>)/g, '$1A<tspan dy="4" font-size="0.7em">L</tspan>$2')],
        [/^(Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma) im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang$/, (m, s) =>
            ({ 'Dreiecksprisma': 'Prisme triangulaire', 'Quader': 'Pavé droit', 'Trapezprisma': 'Prisme trapézoïdal', 'Sechseckprisma': 'Prisme hexagonal' })[s] +
            ' en perspective cavalière : la base devant en vraie grandeur, la profondeur à 45 degrés et réduite de moitié'],
        [/^Netz des (Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma)s: zwei Grundflächen und der Mantel aus Rechtecken$/, (m, s) => 'Patron du ' +
            ({ 'Dreiecksprisma': 'prisme triangulaire', 'Quader': 'pavé droit', 'Trapezprisma': 'prisme trapézoïdal', 'Sechseckprisma': 'prisme hexagonal' })[s] +
            ' : deux bases et la surface latérale faite de rectangles'],
    ]
});
