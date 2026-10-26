/* js/buch-fr/os5.js — French for the widgets of js/buch-os5.js.
 * Loaded by the French editions right after js/buch-os5.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language): × for the multiplication
 * (never the German dot), P for the perimeter, place values U, D, C; number words in the 1990 rectified spelling, every
 * part joined by a hyphen (« quatre-millions-vingt-six-mille-cinq-cent-quatre-vingt-dix-neuf »).
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it.
 */
window.BuchFR && BuchFR.add('os5', {
    word: {
        // book fr-11 mathe5-fr:
        // titelbildos5
        'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
            'Couverture : un cube en perspective cavalière et son patron, un disque avec deux tiers colorés, un papillon et son symétrique, des nombres en écriture cunéiforme babylonienne et une droite graduée',
        // the helpers of the module (askRow, buttons, stepper), reported for every page that loads it
        'Zähler': 'Numérateur', 'Nenner': 'Dénominateur', 'Ganzes': 'Le tout',
        // the multiplication dot alone (the sheet of a written multiplication, the operator between the two inputs)
        '·': '×',
        // zahlenstrahlos5
        'Erkunden': 'Explorer', 'Ablesen': 'Lire', 'Modus': 'Mode', 'Einteilung': 'Graduation',
        'Welche Zahl ist markiert?': 'Quel nombre est marqué ?', 'Neue Aufgabe': 'Nouvel exercice',
        'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?':
            'Compte les traits à partir du nombre de gauche. Combien vaut un pas d’un trait au suivant ?',
        'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.':
            'Fais glisser le point sur la droite graduée. Plus il est à droite, plus le nombre est grand.',
        // schriftlichos5
        'Addieren': 'Addition', 'Subtrahieren': 'Soustraction', 'Multiplizieren': 'Multiplication', 'Dividieren': 'Division',
        'Rechenart': 'Opération', 'Ergänzen': 'Compléter', 'Entbündeln': 'Casser', 'Verfahren': 'Méthode',
        'erste Zahl': 'premier nombre', 'zweite Zahl': 'deuxième nombre',
        'Nächster Schritt': 'Étape suivante', 'Alles zeigen': 'Tout afficher', 'Von vorn': 'Recommencer',
        'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.': 'Saisis deux nombres, par exemple 4738 et 1296.',
        'Bitte höchstens drei Stellen nach dem Komma.': 'Trois chiffres au plus après la virgule, s’il te plaît.',
        'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.': 'Des nombres de neuf chiffres au plus avant la virgule, s’il te plaît.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer. Gerechnet wird von rechts nach links.':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang : unités sous unités. On calcule de droite à gauche.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer, Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf. Gerechnet wird von rechts nach links.':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang : unités sous unités, virgule sous virgule. Complète par des zéros les chiffres qui manquent après la virgule. On calcule de droite à gauche.',
        'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.':
            'Le deuxième nombre est plus grand que le premier. Avec les nombres entiers naturels, cette soustraction est impossible.',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang. On calcule de droite à gauche ; en complétant, tu te demandes : combien faut-il ajouter au chiffre du bas pour arriver à celui du haut ?',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang, virgule sous virgule. On calcule de droite à gauche ; en complétant, tu te demandes : combien faut-il ajouter au chiffre du bas pour arriver à celui du haut ?',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang. On calcule de droite à gauche ; en cassant, tu échanges 1 du rang suivant contre 10.',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Écris les nombres l’un sous l’autre, chaque chiffre sous le chiffre de même rang, virgule sous virgule. On calcule de droite à gauche ; en cassant, tu échanges 1 du rang suivant contre 10.',
        'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.':
            'Ici, le deuxième facteur doit être un nombre entier. Échange les facteurs si nécessaire.',
        'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.': 'Sept chiffres au plus dans le premier facteur et trois dans le deuxième, s’il te plaît.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal.':
            'Écris le calcul sur une ligne. Tu multiplies le premier facteur successivement par chaque chiffre du deuxième facteur.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal, zuerst ohne auf das Komma zu achten.':
            'Écris le calcul sur une ligne. Tu multiplies le premier facteur successivement par chaque chiffre du deuxième facteur, d’abord sans t’occuper de la virgule.',
        'Hier teilst du durch eine einstellige Zahl von 1 bis 9.': 'Ici, tu divises par un nombre à un chiffre, de 1 à 9.',
        'Bitte höchstens acht Ziffern.': 'Huit chiffres au plus, s’il te plaît.',
        // vorrangos5
        'Eigener Term': 'Ton expression', 'Alle Schritte': 'Toutes les étapes',
        'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.':
            'Sont autorisés : les nombres entiers, + − × : et les parenthèses. Pour ×, tu peux aussi taper x ou *, pour :, aussi /.',
        'Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.':
            'Ce n’est pas une expression complète. Vérifie les nombres, les signes d’opération et les parenthèses.',
        'Durch 0 kann man nicht teilen.': 'On ne peut pas diviser par 0.',
        'Unterstrichen ist, was als Nächstes gerechnet wird.': 'Ce qui est souligné se calcule à l’étape suivante.',
        'die letzte Rechnung': 'le dernier calcul', 'Ergebnis': 'Résultat',
        // zehnerpotenzos5
        'Zehnerpotenzen': 'Puissances de dix', 'Nullen abtrennen': 'Séparer les zéros', 'Ansicht': 'Vue', 'Hochzahl': 'Exposant',
        'Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.':
            'Ce nombre ne se termine pas par un zéro. On ne peut pas en séparer une puissance de dix.',
        'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.':
            'Devant le signe ×, il n’y a plus de zéro final : c’est l’écriture la plus courte.',
        'So zeigt ein Taschenrechner mit 10 Stellen die Zahl:': 'Voici comment une calculatrice à 10 chiffres affiche ce nombre :',
        'Anzeige des Taschenrechners': 'Écran de la calculatrice', 'Die Zahl passt in die Anzeige.': 'Le nombre tient sur l’écran.',
        // quadratos5
        'Quadrieren': 'Élever au carré', 'Wurzel ziehen': 'Racine carrée', 'Richtung': 'Sens', 'Seitenlänge n': 'Côté n',
        'Anzahl Plättchen': 'Nombre de carreaux', 'Bitte eine Zahl von 1 bis 440 eingeben.': 'Saisis un nombre de 1 à 440.',
        // probierenos5
        'Aufgabe': 'Exercice', 'Einsetzen': 'Essayer', 'Alle Zahlen prüfen': 'Tester tous les nombres',
        'Zahlenstrahl mit den eingesetzten Zahlen': 'Droite graduée avec les nombres essayés',
        'stimmt!': 'c’est juste !', 'Nimm eine größere Zahl.': 'Prends un nombre plus grand.', 'Nimm eine kleinere Zahl.': 'Prends un nombre plus petit.',
        'erfüllt die Ungleichung.': 'vérifie l’inéquation.', 'erfüllt sie nicht.': 'ne la vérifie pas.',
        // teilbarkeitos5
        'Zufallszahl': 'Nombre au hasard', 'Alle Teiler': 'Tous les diviseurs',
        'Die 1 hat nur einen Teiler. Sie ist keine Primzahl.': 'Le 1 n’a qu’un seul diviseur. Ce n’est pas un nombre premier.',
        // bruchteilos5
        'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.':
            'Le tout ne se partage en groupes égaux que si c’est un multiple du dénominateur. C’est pourquoi il avance par sauts.',
        'Alle Gruppen: Das ist das Ganze.': 'Tous les groupes : c’est le tout.', 'Genau die Hälfte.': 'Exactement la moitié.',
        // halbesos5
        'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes': 'Deux bandes de fractions l’une sous l’autre, avec le repère d’un demi',
        'Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.': 'Les longueurs coloriées sont exactement égales : deux noms pour le même nombre.',
        'Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.':
            'Ici, c’est l’image qui aide : la bande coloriée la plus longue correspond à la plus grande fraction. Tu pourras le vérifier par le calcul en 6e année, quand tu mettras les fractions au même dénominateur.',
        // rundenos5
        'auf Ganze': 'à l’unité', 'auf Zehntel': 'au dixième', 'auf Hundertstel': 'au centième', 'Runden': 'Arrondir', 'Neue Zahl': 'Nouveau nombre',
        'Der Zahlenstrahl zeigt nur den Ausschnitt zwischen den beiden möglichen Ergebnissen, wie unter einer Lupe. Zieh den Punkt.':
            'La droite graduée ne montre que la portion entre les deux résultats possibles, comme sous une loupe. Fais glisser le point.',
        // wuerfelnetzos5
        'Zufälliges Netz': 'Patron au hasard', 'Alles löschen': 'Tout effacer',
        'Tippe Quadrate an, um sie hinzuzufügen oder wegzunehmen. Sechs zusammenhängende Quadrate werden sofort geprüft.':
            'Touche des carrés pour les ajouter ou les enlever. Six carrés reliés sont vérifiés tout de suite.',
        'Ein Würfel hat 6 Flächen, also besteht jedes Würfelnetz aus 6 Quadraten.': 'Un cube a 6 faces, donc chaque patron de cube est formé de 6 carrés.',
        'Die Quadrate hängen nicht alle zusammen.': 'Les carrés ne sont pas tous reliés.',
        'Jedes Quadrat muss mit einer ganzen Kante an ein anderes stoßen.': 'Chaque carré doit toucher un autre carré par un côté entier.',
        'Kein Würfelnetz.': 'Ce n’est pas un patron de cube.',
        'Beim Falten würden die rot markierten Quadrate aufeinanderliegen, und eine Fläche des Würfels bliebe offen.':
            'En pliant, les carrés marqués en rouge se superposeraient, et une face du cube resterait ouverte.',
        'Ein Würfelnetz!': 'Un patron de cube !',
        'Die Zahlen zeigen, wie ein Spielwürfel beschriftet wäre: Gegenüberliegende Flächen haben dieselbe Farbe und ergeben zusammen 7.':
            'Les nombres montrent comment serait numéroté un dé à jouer : les faces opposées ont la même couleur et leur somme fait 7.',
        // bandos5
        'Fahne': 'Drapeau', 'Schlüssel': 'Clé', 'Blume': 'Fleur', 'Motiv': 'Motif', 'Bewegung': 'Mouvement',
        'Verschieben': 'Translation', 'Spiegeln, senkrechte Achsen': 'Symétrie, axes verticaux', 'Spiegeln, waagerechte Achse': 'Symétrie, axe horizontal',
        'Verschiebungspfeil': 'Flèche de translation',
        'Alle Motive sind deckungsgleich: gleiche Form, gleiche Größe.': 'Tous les motifs sont superposables : même forme, même taille.',
        // zahlzeichenos5
        'Kerbholz und Strichliste': 'Bâton à encoches et traits', 'Babylonische Keilschrift': 'Écriture cunéiforme babylonienne', 'Zahlzeichen': 'Numération',
        'Auf 0': 'Remise à 0', 'eins weniger': 'un de moins', 'eins mehr': 'un de plus',
        'Auf dem Kerbholz ist jede fünfte Kerbe länger. So muss man nicht jede einzelne Kerbe zählen, sondern nur die Bündel.':
            'Sur le bâton, une encoche sur cinq est plus longue. Ainsi, on n’a pas besoin de compter chaque encoche, seulement les paquets.',
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // askRow: "✓ richtig" (the shared phrase of js/buch-fr.js), "✗ noch nicht"
        [' noch nicht', ' pas encore'],
        // zahlenstrahlos5
        ['Ein Schritt von Strich zu Strich ist ', 'Un pas d’un trait au suivant vaut '],
        ['Vorgänger ', 'Prédécesseur '], [', Nachfolger ', ', successeur '],
        // schriftlichos5: the steps (the places in bold and the numbers are rules below)
        [' (Übertrag)', ' (retenue)'], [' (gemerkt)', ' (retenue)'], ['. Schreibe ', '. Écris '], [' und übertrage ', ' et retiens '],
        [' in die nächste Spalte.', ' pour la colonne suivante.'], [' Übertrag 1 in die nächste Spalte.', ' Retiens 1 pour la colonne suivante.'],
        [' ist kleiner als ', ' est plus petit que '], ['. Entbündle: ', '. Casse : '], [', dann ', ', puis '],
        [' Eine Null ganz vorn schreibt man nicht.', ' On n’écrit pas de zéro tout à gauche.'],
        [', merke ', ', retiens '], ['. Das ist die letzte Ziffer: Schreibe ', '. C’est le dernier chiffre : écris '], [' ganz hin.', ' en entier.'],
        ['Addiere die Teilprodukte stellengerecht, so wie sie stehen. Das ergibt ', 'Additionne les produits partiels, chiffre sous chiffre, tels qu’ils sont placés. Cela donne '],
        [' Hinten hängst du Nullen an, das ändert den Wert nicht.', ' Tu ajoutes des zéros à la fin : cela ne change pas la valeur.'],
        [', denn ', ', car '], ['Es bleibt nichts übrig.', 'Il ne reste rien.'], ['Es bleibt ', 'Il reste '],
        [' Hier kommt das Komma: Setze es auch im Ergebnis.', ' Ici vient la virgule : place-la aussi dans le résultat.'],
        [' Rest ', ' reste '], ['Überschlag: ', 'Ordre de grandeur : '], ['. Probe: ', '. Vérification : '], ['Probe: ', 'Vérification : '],
        ['Die Division geht nicht auf. ', 'La division ne tombe pas juste. '],
        // vorrangos5: the reason of every step
        ['Klammer zuerst', 'Parenthèses d’abord'], [', darin ', ', à l’intérieur '], ['Punkt vor Strich', '× et : avant + et −'],
        ['von links nach rechts', 'de gauche à droite'],
        [' geht in den natürlichen Zahlen nicht.', ' est impossible avec les nombres entiers naturels.'],
        [' geht nicht ohne Rest auf. Wähle andere Zahlen.', ' ne tombe pas juste. Choisis d’autres nombres.'],
        // zehnerpotenzos5
        ['Alle Schreibweisen: ', 'Toutes les écritures : '],
        ['Die Zahl ist zu lang. Der Rechner zeigt ', 'Le nombre est trop long. La calculatrice affiche '],
        // quadratos5, probierenos5
        ['Umgekehrt: ', 'Inversement : '], ['ist zu klein', 'est trop petit'], ['ist zu groß', 'est trop grand'],
        ['Einsetzen: ', 'Essai : '], ['Lösung: ', 'Solution : '], ['. Mit der Umkehraufgabe geht es direkt: ', '. Avec l’opération inverse, on y arrive directement : '],
        ['Alle Lösungen: ', 'Toutes les solutions : '], [', … und jede größere Zahl.', ', … et tous les nombres plus grands.'],
        ['Bisher gefundene Lösungen: ', 'Solutions trouvées jusqu’ici : '], ['Noch keine Lösung gefunden.', 'Aucune solution trouvée pour l’instant.'],
        [' Eine Ungleichung hat oft viele Lösungen.', ' Une inéquation a souvent beaucoup de solutions.'],
        // teilbarkeitos5 (the sentences with numbers are rules below)
        ['Quersumme ', 'Somme des chiffres : '],
        ['Durch 2 und durch 3 teilbar.', 'Divisible par 2 et par 3.'], ['Durch 2, aber nicht durch 3 teilbar.', 'Divisible par 2, mais pas par 3.'],
        ['Durch 3, aber nicht durch 2 teilbar.', 'Divisible par 3, mais pas par 2.'], ['Weder durch 2 noch durch 3 teilbar.', 'Divisible ni par 2 ni par 3.'],
        [' ist keine Primzahl.', ' n’est pas un nombre premier.'],
        // bruchteilos5
        ['1. Teile das Ganze in ', '1. Partage le tout en '], [' gleich große Gruppen: ', ' groupes égaux : '],
        // halbesos5: the comparison with 1 and with one half
        ['<b>Vergleich mit 1:</b>', '<b>Comparaison avec 1 :</b>'], ['<b>Vergleich mit einem Halben:</b>', '<b>Comparaison avec un demi :</b>'],
        [' ist weniger als ein Ganzes', ' est plus petit que 1'], [' ist mehr als ein Ganzes', ' est plus grand que 1'], [' ist genau ein Ganzes', ' est égal à 1'],
        [' ist weniger als ein Halbes', ' est plus petit qu’un demi'], [' ist mehr als ein Halbes', ' est plus grand qu’un demi'], [' ist genau ein Halbes', ' est égal à un demi'],
        // rundenos5 (and zahlenstrahl5 of js/buch-gy5.js)
        ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'Avec 5, 6, 7, 8 ou 9, on arrondit <b>vers le haut</b>.'],
        ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'Avec 0, 1, 2, 3 ou 4, on arrondit <b>vers le bas</b>.'],
        // wuerfelnetzos5
        ['Wähle 6 Quadrate aus', 'Choisis 6 carrés'],
        // bandos5 (phrases: a word that starts with <b> is never looked up in innerHTML)
        ['<b>Verschiebung:</b> Jedes Motiv entsteht aus dem vorigen durch dieselbe Verschiebung nach rechts, um eine Kästchenbreite. Alle Motive zeigen in dieselbe Richtung.',
            '<b>Translation :</b> chaque motif s’obtient à partir du précédent par la même translation vers la droite, d’une largeur de case. Tous les motifs sont orientés dans le même sens.'],
        ['<b>Spiegelung an senkrechten Achsen:</b> Jedes Motiv ist das Spiegelbild seines Nachbarn. Die grünen Linien sind die Spiegelachsen. Jedes zweite Motiv ist umgeklappt.',
            '<b>Symétrie par rapport à des axes verticaux :</b> chaque motif est le symétrique de son voisin. Les lignes vertes sont les axes de symétrie. Un motif sur deux est retourné.'],
        ['<b>Spiegelung an einer waagerechten Achse:</b> Die untere Reihe ist das Spiegelbild der oberen. Oben und unten ist vertauscht, links und rechts nicht.',
            '<b>Symétrie par rapport à un axe horizontal :</b> la rangée du bas est le symétrique de celle du haut. Le haut et le bas sont échangés, mais pas la gauche et la droite.'],
        // zahlzeichenos5
        ['Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert.',
            'Un clou vertical vaut 1, un chevron vaut 10. Chaque position vers la gauche vaut 60 fois plus.'],
        [' Eine leere Stelle hatte lange kein eigenes Zeichen: Man sah nur eine Lücke.', ' Pendant longtemps, une position vide n’avait pas de signe à elle : on voyait seulement un espace.'],
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // French school notation: × for the multiplication, in TeX and in plain text between numbers ("4 738 · 3", "3 cm · 4 cm");
        // the dot as a separator ("Würfel · Volumen", "CHAPITRE 1.2 · DOMAINE") stays
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        [/(\d|\)|\bcm|\bm) · (?=[\d(]|[a-z]\b)/g, '$1 × '], [/>· (?=\d)/g, '>× '],
        // "Zahl" alone is a coin side in other modules: only as a label, a placeholder or before an input
        [/(<label[^>]*>)Zahl(<\/label>)/g, '$1Nombre$2'], [/^Zahl$/, 'nombre'],
        // the steppers: "Zähler kleiner", "Nenner A größer"
        [/^(Zähler|Nenner|Ganzes)( [AB])? (kleiner|größer)$/, (m, w, ab, d) => (d === 'kleiner' ? 'Diminuer ' : 'Augmenter ') +
            ({ 'Zähler': 'le numérateur', 'Nenner': 'le dénominateur', 'Ganzes': 'le tout' })[w] + (ab || '')],
        // zahlenstrahlos5
        [/>Schritt (\d[\d  ]*)</g, '>Pas de $1<'],
        [/^Zahlenstrahl von (.+) bis (.+)$/, 'Droite graduée de $1 à $2'],
        [/(<p class="g-ok">)Richtig: /, '$1Correct : '],
        [/Von (\d[\d ]*) bis (\d[\d ]*) sind es 10 Schritte, einer ist (\d[\d ]*) groß\./, 'De $1 à $2, il y a 10 pas ; chacun vaut $3.'],
        [/Links steht (\d[\d ]*), rechts (\d[\d ]*)\. Dazwischen liegen 10 gleich große Schritte\./, 'À gauche, il y a $1, à droite $2. Entre les deux, il y a 10 pas égaux.'],
        [/Der Punkt liegt (\d+) Schritte? rechts von (\d[\d ]*)\./, 'Le point est $1 pas à droite de $2.'],
        [/Die Zahl liegt zwischen (\d[\d ]*) und (\d[\d ]*)\./, 'Le nombre est compris entre $1 et $2.'],
        // schriftlichos5: the place in bold before every step, "1 Zehner → 10 Einer" when a place is broken up
        ...(() => {
            const P = { 'Tausendstel': ['millième', 'millièmes'], 'Hundertstel': ['centième', 'centièmes'], 'Zehntel': ['dixième', 'dixièmes'],
                'Einer': ['unité', 'unités'], 'Zehner': ['dizaine', 'dizaines'], 'Hunderter': ['centaine', 'centaines'], 'Tausender': ['millier', 'milliers'],
                'Zehntausender': ['dizaine de mille', 'dizaines de mille'], 'Hunderttausender': ['centaine de mille', 'centaines de mille'],
                'Million': ['million', 'millions'], 'Millionen': ['million', 'millions'], 'Zehnmillionen': ['dizaine de millions', 'dizaines de millions'],
                'Hundertmillionen': ['centaine de millions', 'centaines de millions'], 'Milliarden': ['milliard', 'milliards'] };
            const ALT = Object.keys(P).sort((a, b) => b.length - a.length).join('|');
            const cap = s => s[0].toUpperCase() + s.slice(1);
            return [
                [new RegExp('<b>(' + ALT + '):</b>', 'g'), (m, k) => '<b>' + cap(P[k][1]) + ' :</b>'],
                [new RegExp('1 (' + ALT + ') → 10 (' + ALT + ')', 'g'), (m, a, b) => '1 ' + P[a][0] + ' → 10 ' + P[b][1]],
            ];
        })(),
        [/Der letzte Übertrag (\d) kommt vorn ins Ergebnis\./, 'La dernière retenue, $1, s’écrit tout à gauche du résultat.'],
        [/(<\/b> )?Von (\d+) bis (\d+) sind (\d+)\./g, (m, b, x, y, r) => (b ? b + 'de ' : 'De ') + x + ' jusqu’à ' + y + ', il y a ' + r + '.'],
        [/\. Die letzte Ziffer steht genau unter der (\d) des zweiten Faktors\./, '. Le dernier chiffre se place juste sous le $1 du deuxième facteur.'],
        [/Der erste Faktor hat (\d+) Stellen? nach dem Komma, also auch das Ergebnis: /, (m, n) => 'Le premier facteur a ' + n + (n === '1' ? ' chiffre' : ' chiffres') + ' après la virgule, le résultat aussi : '],
        [/Teile von links nach rechts\. Frage bei jeder Stelle: Wie oft passt die (\d) hinein\?/, 'Divise de gauche à droite. À chaque étape, demande-toi : combien de fois y a-t-il $1 ?'],
        [/Hole die (\d) herunter: (\d+)\. /, 'Abaisse le $1 : $2. '],
        [/In die (\d) passt die (\d) nicht, nimm die ersten (\d+) Ziffern: (\d+)\. /, 'Dans $1, il n’y a pas $2 : prends les $3 premiers chiffres, $4. '],
        [/Nach (\d+) Stellen hinter dem Komma wird abgebrochen\./, 'On s’arrête à $1 chiffres après la virgule.'],
        [/(<p class="g5-dim">)Schritt (\d+) von (\d+)</, '$1Étape $2 sur $3<'],
        // zehnerpotenzos5: "Die Hochzahl 6 sagt: 6 Faktoren 10, also 6 Nullen. Das ist eine Million." (number words: 1990 spelling)
        [/Die Hochzahl (\d+) sagt: \d+ Faktor(?:en)? 10, also (?:eine Null|\d+ Nullen)\. Das ist <b>([^<]+)<\/b>\./, (m, n, w) => 'L’exposant ' + n + ' indique ' + n +
            (n === '1' ? ' facteur 10, donc un zéro' : ' facteurs 10, donc ' + n + ' zéros') + '. C’est <b>' + ({ 'eins': 'un', 'zehn': 'dix', 'hundert': 'cent', 'tausend': 'mille',
                'zehntausend': 'dix-mille', 'hunderttausend': 'cent-mille', 'eine Million': 'un-million', 'zehn Millionen': 'dix-millions', 'hundert Millionen': 'cent-millions',
                'eine Milliarde': 'un-milliard', 'zehn Milliarden': 'dix-milliards', 'hundert Milliarden': 'cent-milliards', 'eine Billion': 'un-billion' }[w] || w) + '</b>.'],
        [/Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel (\d[\d  ]*)\./, 'Saisis un nombre entier de 15 chiffres au plus, par exemple $1.'],
        [/Du kannst noch (\d+) (?:Nullen|Null) mehr abtrennen\./, (m, n) => 'Tu peux encore séparer ' + n + (n === '1' ? ' zéro.' : ' zéros.')],
        [/\$: Rücke das Komma um (\d+) Stellen nach rechts, dann hast du die Zahl\./, (m, n) => '$ : décale la virgule de ' + n + ' rangs vers la droite, et tu retrouves le nombre.'],
        // quadratos5
        [/^(\d+) mal (\d+) Plättchen(?: und (\d+) weitere)?$/, (m, a, b, x) => a + ' fois ' + b + (a === '1' ? ' carreau' : ' carreaux') + (x ? ' et ' + x + ' de plus' : '')],
        [/(\d+) Reihen? mit (?:je )?(\d+) Plättchen (?:ergeben|ergibt) ein Quadrat aus (\d+) Plättchen\./, (m, r, k, v) => r === '1'
            ? '1 rangée de 1 carreau forme un carré de 1 carreau.' : r + ' rangées de ' + k + ' carreaux forment un carré de ' + v + ' carreaux.'],
        [/(\d+) ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite (\d+)\./, '$1 est un carré parfait : les carreaux forment un carré de côté $2.'],
        [/(\d+) ist keine Quadratzahl\./, '$1 n’est pas un carré parfait.'],
        [/Es bleiben (\d+) Plättchen übrig, zum nächsten Quadrat fehlen (\d+)\./, (m, a, b) => 'Il reste ' + a + (a === '1' ? ' carreau' : ' carreaux') + ' ; il en manque ' + b + ' pour le carré suivant.'],
        [/\$ liegt zwischen (\d+) und (\d+)\./, (m, a, b) => '$ est compris entre ' + a + ' et ' + b + '.'],
        // probierenos5
        [/ \((\d+) Zahlen\)\./, ' ($1 nombres).'],
        // teilbarkeitos5 (the rule for 4 before the general one)
        [/Die letzte Ziffer (\d) ist (gerade|ungerade)\./, (m, d, g) => 'Le dernier chiffre, ' + d + ', est ' + (g === 'gerade' ? 'pair.' : 'impair.')],
        [/Die letzten zwei Ziffern bilden (\d+), das ist (nicht )?durch 4 teilbar\./, (m, x, n) => 'Les deux derniers chiffres forment ' + x + (n ? ', qui n’est pas divisible par 4.' : ', qui est divisible par 4.')],
        [/ ist (nicht )?durch (\d+) teilbar\./g, (m, n, d) => (n ? ', non divisible par ' : ', divisible par ') + d + '.'],
        [/Die letzte Ziffer ist (\d)(, nicht 0 oder 5|, nicht 0)?\./g, (m, d, x) => 'Le dernier chiffre est ' + d + (x ? (x.length > 9 ? ', ce n’est ni 0 ni 5' : ', ce n’est pas 0') : '') + '.'],
        [/<b>durch (\d+)( nicht)?:<\/b>/g, (m, d, n) => '<b>' + (n ? 'pas par ' : 'par ') + d + ' :</b>'],
        [/<b>Alle Teiler<\/b> \((\d+)\): /, '<b>Tous les diviseurs</b> ($1) : '],
        [/(\d[\d ]*) ist eine Primzahl: genau zwei Teiler\./, '$1 est un nombre premier : exactement deux diviseurs.'],
        [/Bitte eine natürliche Zahl von 1 bis (\d[\d  ]*) eingeben\./, 'Saisis un nombre entier de 1 à $1.'],
        // bruchteilos5
        [/^(\d+) von (\d+) Gruppen zu je (\d+) (?:sind|ist) gefärbt$/, (m, z, n, k) => z + (+z > 1 ? ' groupes sur ' : ' groupe sur ') + n + ', de ' + k + ' chacun, ' + (+z > 1 ? 'sont coloriés' : 'est colorié')],
        [/\$ von (\d+) sind (\d+)\./, (m, g, r) => '$ de ' + g + ', c’est ' + r + '.'],
        [/\$ von (\d+)<\/p>/g, (m, g) => '$ de ' + g + '</p>'],
        [/2\. Nimm (\d+) (?:Gruppe|Gruppen): /, (m, z) => '2. Prends ' + z + (z === '0' || z === '1' ? ' groupe : ' : ' groupes : ')],
        // halbesos5: the names of the parts (Drittel, Viertel …)
        ...(() => {
            const N = { 'Ganze': ['entier', 'entiers'], 'Halbe': ['demi', 'demis'], 'Drittel': ['tiers', 'tiers'], 'Viertel': ['quart', 'quarts'],
                'Fünftel': ['cinquième', 'cinquièmes'], 'Sechstel': ['sixième', 'sixièmes'], 'Siebtel': ['septième', 'septièmes'], 'Achtel': ['huitième', 'huitièmes'],
                'Neuntel': ['neuvième', 'neuvièmes'], 'Zehntel': ['dixième', 'dixièmes'], 'Elftel': ['onzième', 'onzièmes'], 'Zwölftel': ['douzième', 'douzièmes'] };
            const n = (k, w) => N[w] ? N[w][k === '1' ? 0 : 1] : w;
            return [
                [/<b>Gleicher Nenner:<\/b> Beide Male sind es (\S+), also gleich große Stücke\. Es kommt nur darauf an, wie viele: /, (m, w) =>
                    '<b>Même dénominateur :</b> les deux fois, ce sont des ' + n('2', w) + ', donc des parts de même taille. Seul compte leur nombre : '],
                [/<b>Gleicher Zähler:<\/b> Beide Male sind es (\d+) (?:Stück|Stücke)\. (\S+) sind größer als (\S+): Je größer der Nenner, desto kleiner die Stücke\./, (m, k, a, b) =>
                    '<b>Même numérateur :</b> les deux fois, il y a ' + k + (k === '1' ? ' part' : ' parts') + '. Les ' + n('2', a) + ' sont plus grands que les ' + n('2', b) +
                    ' : plus le dénominateur est grand, plus les parts sont petites.'],
                [/<b>Was fehlt zum Ganzen\?<\/b> Bei A (?:fehlen|fehlt) (\d+) (\S+), bei B (\d+) (\S+)\. (\S+) sind kleiner, also fehlt bei (A|B) weniger\./, (m, a, wa, b, wb, w, x) =>
                    '<b>Que manque-t-il pour faire 1 ?</b> À A, il manque ' + a + ' ' + n(a, wa) + ', à B ' + b + ' ' + n(b, wb) + '. Les ' + n('2', w) +
                    ' sont plus petits, donc il manque moins à ' + x + '.'],
            ];
        })(),
        [/, denn (\d+) ist (weniger|mehr|genau)(?: als)? die Hälfte von (\d+)\./, (m, a, w, b) => ', car ' + a + ' est ' +
            ({ weniger: 'moins que', mehr: 'plus que', genau: 'exactement' })[w] + ' la moitié de ' + b + '.'],
        // rundenos5
        [/>Mitte (?=\d)/g, '>Milieu '],
        [/^Zahlenstrahl zwischen (.+) und (.+)$/, 'Droite graduée entre $1 et $2'],
        [/Gerundet auf (Ganze|Zehntel|Hundertstel)\. Entscheidend ist die Ziffer der (Zehntel|Hundertstel|Tausendstel): /, (m, a, b) => 'Arrondi ' +
            ({ 'Ganze': 'à l’unité', 'Zehntel': 'au dixième', 'Hundertstel': 'au centième' })[a] + '. C’est le chiffre des ' +
            ({ 'Zehntel': 'dixièmes', 'Hundertstel': 'centièmes', 'Tausendstel': 'millièmes' })[b] + ' qui décide : '],
        [/Die Null am Ende bleibt stehen: Sie zeigt, dass auf (Zehntel|Hundertstel) gerundet wurde\./, (m, a) => 'Le zéro final reste écrit : il montre qu’on a arrondi ' +
            (a === 'Zehntel' ? 'au dixième.' : 'au centième.')],
        // wuerfelnetzos5
        [/^Gitter mit (\d+) ausgewählten Quadraten$/, (m, n) => 'Quadrillage avec ' + n + (+n > 1 ? ' carrés choisis' : ' carré choisi')],
        [/, es fehlen noch (\d)\./, ', il en manque encore $1.'],
        [/Das sind (\d+) Quadrate\. Ein Würfel hat nur 6 Flächen\./, 'Cela fait $1 carrés. Un cube n’a que 6 faces.'],
        [/Gefunden: (\d+) von 11 verschiedenen Würfelnetzen\./, (m, n) => (+n > 1 ? 'Trouvés : ' + n + ' patrons de cube différents' : 'Trouvé : ' + n + ' patron de cube') + ' sur les 11 qui existent.'],
        // bandos5
        [/^Bandornament aus dem Motiv (\S+)$/, (m, k) => 'Frise avec le motif ' + ({ 'Fahne': 'drapeau', 'Schlüssel': 'clé', 'Blume': 'fleur' }[k] || k)],
        // zahlzeichenos5
        [/^Kerbholz und Strichliste mit (\d+) Strichen$/, 'Bâton à encoches et traits de comptage : $1 traits'],
        [/(?:(\d+) Fünferbündel(?: und (\d+) einzelner? (?:Striche|Strich))?|(\d+) einzelner? (?:Striche|Strich))(: )?/, (m, b5, r1, r2, c) => {
            const t = r => r + (r === '0' || r === '1' ? ' trait isolé' : ' traits isolés');
            return (b5 ? b5 + (b5 === '1' ? ' paquet de cinq' : ' paquets de cinq') + (r1 ? ' et ' + t(r1) : '') : t(r2)) + (c ? ' : ' : '');
        }],
        [/^Die Zahl (\d+) in babylonischer Keilschrift$/, 'Le nombre $1 en écriture cunéiforme babylonienne'],
    ]
});
