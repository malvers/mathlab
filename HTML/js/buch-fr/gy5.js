/* js/buch-fr/gy5.js — French for the widgets of js/buch-gy5.js.
 * Loaded by the French editions right after js/buch-gy5.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language): × for the multiplication,
 * P for the perimeter (German u), A for the total area of a cuboid (German O), j for the day (German d), points as
 * (2 ; 3), place values C, D, U in every class (M C D U, d c m around the comma); number words in the 1990 rectified
 * spelling, every part joined by a hyphen, as French schools teach it since 2016.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/gy5.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy5', {
    word: {
        // book fr-11 mathe5-fr:
        // stellenwert5
        'MRD.': 'MDS', 'MILLIONEN': 'MILLIONS', 'TAUSENDER': 'MILLE', 'EINER': 'UNITÉS',
        'Zufallszahl': 'Nombre au hasard', 'Alles auf 0': 'Tout à 0', 'minus': 'moins',
        'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.':
            'Touche ▲ ou ▼ pour changer un chiffre. Chaque rang vaut dix fois plus que le rang juste à sa droite.',
        'Eine natürliche Zahl, keine Stelle nach dem Komma.': 'Un nombre entier, aucun chiffre après la virgule.',
        // zahlenstrahl5
        'Zehner': 'Dizaines', 'Hunderter': 'Centaines', 'Tausender': 'Milliers', 'Zehntausender': 'Dizaines de mille',
        'Hunderttausender': 'Centaines de mille', 'Millionen': 'Millions', 'Runden auf': 'Arrondir à', 'Neue Zahl': 'Nouveau nombre', 'Mitte': 'Milieu',
        'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.':
            'Fais glisser le point. S’il est exactement au milieu ou à sa droite, on arrondit vers le haut, sinon vers le bas.',
        // sieb5
        'Nächster Schritt': 'Étape suivante', 'Von vorn': 'Recommencer',
        'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.': 'Touche un nombre : tu vois tous ses diviseurs et sa décomposition en facteurs premiers.',
        'Starte das Sieb mit „Nächster Schritt“.': 'Lance le crible avec « Étape suivante ».',
        'Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.': 'Le 1 <b>n’est pas un nombre premier</b> : il n’a qu’un seul diviseur.',
        'Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.': 'Le 2 est le premier nombre premier. Tous ses multiples 4, 6, 8, … sont barrés.',
        'Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.': 'Le 3 est le nombre premier suivant. Ses multiples 6, 9, 12, … sont barrés.',
        'Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …': 'Le 5 est le nombre premier suivant. Barrés : 10, 15, 20, …',
        'Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.': 'Le 7 est le nombre premier suivant. Nouveaux barrés : 49, 77, 91 et les autres multiples.',
        'Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.':
            'Terminé ! Le nombre suivant serait 11, mais 11 × 11 = 121 dépasse déjà 100. Tous les nombres qui restent sont des <b>nombres premiers</b> : il y en a 25.',
        'Die 1 hat nur sich selbst als Teiler.': 'Le 1 n’a que lui-même comme diviseur.',
        'Zerlegung in Primfaktoren': 'Décomposition en facteurs premiers',
        // bruch5
        'Kreis': 'Cercle', 'Rechteck': 'Rectangle', 'Streifen': 'Bande', 'Bild': 'Représentation', 'Zähler': 'Numérateur', 'Nenner': 'Dénominateur',
        'weniger': 'moins', 'mehr': 'plus', 'Erweitern mit 2': 'Amplifier par 2', 'mit 3': 'par 3', 'Kürzen': 'Simplifier',
        // bruchstrahl5
        'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
            'Saisis des fractions comme 3/4 ou des nombres décimaux comme 0,7, aussi des nombres plus grands que 1, jusqu’à 3.',
        'Zahlenstrahl mit zwei Zahlen': 'Droite graduée avec deux nombres',
        'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Saisis deux nombres entre 0 et 3, par exemple 3/4 ou 0,7.',
        // winkel5
        'Messen': 'Mesurer', 'Schätzen': 'Estimer', 'Modus': 'Mode', 'Deine Schätzung': 'Ton estimation', 'Schätzung in Grad': 'Estimation en degrés',
        'Neuer Winkel': 'Nouvel angle', 'Bitte eine Zahl eingeben.': 'Saisis un nombre.', 'Ausgezeichnet': 'Excellent',
        'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.':
            'Fais glisser l’extrémité du deuxième côté. On mesure dans le sens inverse des aiguilles d’une montre, à partir du côté horizontal.',
        'Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.': 'Quelle est la mesure de cet angle ? Estime-la sans mesurer, puis touche « Vérifier ».',
        // spiegel5
        'Spiegelung': 'Symétrie', 'Verschiebung': 'Translation', 'Drehung': 'Rotation', 'Rätsel': 'Devinette', 'Bewegung': 'Mouvement',
        'Achse senkrecht': 'Axe vertical', 'waagerecht': 'horizontal', 'schräg': 'oblique', 'Achse': 'Axe', 'Drehwinkel': 'Angle de rotation',
        'Neues Rätsel': 'Nouvelle devinette',
        'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.':
            'Fais glisser l’axe de symétrie. Chaque point image est sur la perpendiculaire à l’axe, à la même distance de lui.',
        'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.': 'Fais glisser la pointe de la flèche : chaque point est déplacé selon la même flèche.',
        'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.':
            'Règle l’angle de rotation. On tourne dans le sens inverse des aiguilles d’une montre autour du centre O.',
        'Welche Bewegung bringt die gelbe Figur auf die grüne?': 'Quel mouvement amène la figure jaune sur la verte ?',
        'Figur und Bildfigur im Koordinatensystem': 'Figure et figure image dans le repère',
        'Tippe auf deine Antwort.': 'Touche ta réponse.',
        'Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.':
            'La figure image a la même taille, mais elle est <b>retournée</b> : le sens de parcours A → B → C → D s’inverse.',
        'Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.': 'Chaque point reste à la même distance de O. La figure n’est pas retournée.',
        // rechteck5
        'Zusammengesetzte Figur': 'Figure composée', 'Figur': 'Figure', 'Zerlegen': 'Décomposer', 'Ergänzen': 'Compléter', 'Weg': 'Méthode',
        'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.':
            'Fais glisser le coin. Un carreau mesure 1 cm de long et 1 cm de large, son aire est donc de 1 cm².',
        'Ein Quadrat: alle vier Seiten gleich lang.': 'Un carré : ses quatre côtés ont la même longueur.',
        'Zerlegen in zwei Rechtecke:': 'Décomposer en deux rectangles :',
        'Zum großen Rechteck ergänzen und das fehlende Stück abziehen:': 'Compléter en un grand rectangle et retirer le morceau qui manque :',
        'Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.':
            'Étonnant : le périmètre est le même que celui du rectangle entier, car la marche est aussi longue que les côtés qui manquent.',
        // quader5
        'Schrägbild': 'Perspective cavalière', 'Netz': 'Patron', 'Einheitswürfel': 'Cubes unités', 'Ansicht': 'Vue',
        'Länge a (cm)': 'Longueur a (cm)', 'Breite b (cm)': 'Largeur b (cm)', 'Höhe c (cm)': 'Hauteur c (cm)',
        'hinten': 'arrière', 'oben': 'dessus', 'vorn': 'avant', 'unten': 'dessous', 'links': 'gauche', 'rechts': 'droite',
        'Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.': 'Les faces opposées ont la même couleur : elles ont la même aire.',
        'Alle Kanten gleich lang: ein Würfel.': 'Toutes les arêtes ont la même longueur : c’est un cube.',
        // einheiten5
        'Länge': 'Longueur', 'Masse': 'Masse', 'Zeit': 'Durée', 'Fläche': 'Aire', 'Volumen': 'Volume', 'Größe': 'Grandeur',
        'Wert': 'Valeur', 'von Einheit': 'unité de départ', 'in Einheit': 'unité d’arrivée', 'in': 'en',
        'Bitte eine Zahl eingeben, zum Beispiel 3,5.': 'Saisis un nombre, par exemple 3,5.',
        'Gleiche Einheit, nichts zu tun.': 'Même unité, rien à faire.',
        // zahlschrift5
        'Ägypten': 'Égypte', 'Rom': 'Rome', 'Maya': 'Mayas', 'Zweiersystem': 'Binaire', 'Zahlschrift': 'Numération',
        'eins weniger': 'un de moins', 'eins mehr': 'un de plus',
        // komma5
        'Neu': 'Nouveau',
        'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
            'Quand on multiplie par 10, chaque chiffre avance d’un rang vers la gauche ; quand on divise, vers la droite. On dit en bref : la virgule se déplace.',
        'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'impossible : les chiffres sortiraient du tableau.',
        // mittel5
        'Ausgleichen': 'Égaliser', 'Neue Werte': 'Nouvelles valeurs', 'Säulen mit dem Mittelwert': 'Colonnes avec la moyenne',
        'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
            'Fais monter ou descendre les colonnes. « Égaliser » répartit tout équitablement : chaque colonne reçoit autant.',
        // koord5
        'Geraden ein/aus': 'Droites oui/non', 'Finde den Punkt': 'Trouve le point', 'Koordinatensystem mit vier Punkten': 'Repère avec quatre points',
        'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).':
            'Fais glisser les points. Ils s’accrochent aux nœuds du quadrillage. D’abord vers la droite (x), puis vers le haut (y).',
        'g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.': 'g ∥ h : les droites sont <b>parallèles</b>, elles ne se coupent jamais.',
        'g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.': 'g ⊥ h : les droites sont <b>perpendiculaires</b>.',
        'g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.':
            'g et h ne sont ni parallèles ni perpendiculaires. Essaie de les rendre parallèles ou perpendiculaires.',
        // symmetrie5
        'Achse waagerecht': 'Axe horizontal', 'zwei Achsen': 'deux axes', 'Punkt': 'Point', 'Symmetrie': 'Symétrie',
        'Leeren': 'Vider', 'Muster-Werkstatt': 'Atelier de motifs',
        'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.':
            'Touche des cases pour les colorier. Les cases symétriques se colorient toutes seules.',
        // linien5
        'erste Zahl': 'premier nombre', 'zweite Zahl': 'deuxième nombre',
        'Legen': 'Poser', 'Dazulegen': 'Ajouter', 'Bündeln': 'Regrouper', 'Alles bündeln': 'Tout regrouper',
        'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.':
            'Cinq jetons sur une ligne deviennent un jeton dans l’espace au-dessus, deux jetons dans un espace deviennent un jeton sur la ligne suivante. C’est ainsi qu’on calculait il y a 500 ans.',
        'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.': 'Tout est regroupé. On peut maintenant lire le résultat.',
        'Rot markiert: Hier muss noch gebündelt werden.': 'Marqué en rouge : ici, il faut encore regrouper.',
        'Linienbrett mit Rechenpfennigen': 'Table à calculer avec des jetons',
        // book fr-12 mathegy5-fr:
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // stellenwert5 (the number in words is a rule below)
        ['Als Zehnerbruch: ', 'En fraction décimale : '],
        // zahlenstrahl5
        ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'Avec 5, 6, 7, 8 ou 9, on arrondit <b>vers le haut</b>.'],
        ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'Avec 0, 1, 2, 3 ou 4, on arrondit <b>vers le bas</b>.'],
        // bruch5
        ['Null Teile: der Bruch hat den Wert 0.', 'Aucune part : la fraction vaut 0.'],
        ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Une fraction <b>inférieure à 1</b> : moins qu’une unité.'],
        ['Genau <b>ein Ganzes</b>.', 'Exactement <b>une unité</b>.'],
        ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Une fraction <b>supérieure à 1</b> : plus qu’une unité'],
        [', als gemischte Zahl $', ', soit en écriture mixte $'],
        ['Der Bruch lässt sich nicht weiter kürzen.', 'La fraction ne peut plus être simplifiée.'],
        ['Als Dezimalzahl: ', 'En nombre décimal : '], [' · in Prozent: ', ' · en pourcentage : '],
        ['Als Dezimalzahl ungefähr ', 'En nombre décimal, environ '],
        ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.',
            '. Le dénominateur a un facteur premier autre que 2 et 5 : c’est pourquoi l’écriture décimale ne s’arrête pas.'],
        // bruchstrahl5
        ['$ und $', '$ et $'], ['Jetzt vergleicht man nur die Zähler: ', 'Il suffit maintenant de comparer les numérateurs : '],
        ['Als Dezimalzahlen: ', 'En nombres décimaux : '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Plus à droite sur la droite graduée veut dire plus grand.'],
        // winkel5
        ['Deine Schätzung: ', 'Ton estimation : '],
        // spiegel5
        ['Spiegelachse ', 'Axe de symétrie '], ['schräg durch ', 'oblique passant par '],
        ['Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.',
            'Indice : si la figure est retournée, c’est une symétrie. Si tous les côtés sont orientés comme avant, c’est une translation.'],
        // einheiten5
        ['Rechnung: ', 'Calcul : '],
        ['Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.', 'On descend l’escalier vers l’unité plus petite : le nombre devient plus grand, on <b>multiplie</b>.'],
        ['Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.', 'On monte l’escalier vers l’unité plus grande : le nombre devient plus petit, on <b>divise</b>.'],
        ['Bei Flächen ist die Umrechnungszahl immer 100.', 'Pour les aires, on passe toujours d’une unité à l’autre par 100.'],
        ['Bei Volumen ist die Umrechnungszahl immer 1000.', 'Pour les volumes, on passe toujours d’une unité à l’autre par 1 000.'],
        ['Achtung: Bei der Zeit gibt es keine Zehnerschritte.', 'Attention : pour les durées, on ne passe pas d’une unité à l’autre par 10.'],
        // zahlschrift5
        ['Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.',
            'Chaque signe est écrit autant de fois qu’il le faut. L’ordre n’a pas d’importance, on n’a pas besoin de zéro. Bâton 1, anse 10, corde 100, lotus 1 000.'],
        ['I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.',
            'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1 000. Si un signe plus petit est placé devant un plus grand, on le soustrait : IV = 4, XC = 90, CM = 900.'],
        ['Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.',
            'Les Mayas comptaient par vingt. Point = 1, barre = 5. De bas en haut, chaque étage vaut vingt fois plus. Pour un étage vide, ils avaient un signe pour le zéro : le coquillage.'],
        ['Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.',
            'En binaire, il n’y a que les chiffres 0 et 1. Chaque rang vaut le double de celui qui est juste à sa droite. C’est ainsi que calculent les ordinateurs.'],
        // mittel5
        ['Mittelwert', 'Moyenne'], ['Summe: ', 'Somme : '], ['Geteilt durch die Anzahl: ', 'Divisée par le nombre de valeurs : '],
        ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'Ce qui dépassait la ligne (en gris pointillé) comble exactement les vides (en jaune).'],
        // koord5
        ['Getroffen! A liegt auf ', 'Gagné ! A est en '], ['<b>Aufgabe:</b> Zieh A auf den Punkt ', '<b>Consigne :</b> fais glisser A sur le point '],
        // book fr-12 mathegy5-fr:
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // French school notation: × for the multiplication, in TeX and in plain text between numbers; the dot as a separator stays
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        [/(\d|\)|\bcm|\bm) · (?=[\d(]|[a-z]\b)/g, '$1 × '], [/>· (?=\d)/g, '>× '],
        // plain-text points: A(2 | 1) → A(2 ; 1), the French school way (a no-break space before the semicolon)
        [/\(([-−]?\d+(?:,\d+)?) \| ([-−]?\d+(?:,\d+)?)\)/g, '($1 ; $2)'],
        // "Zahl" alone is a coin side in other modules: only as a label, a placeholder or before an input
        [/(<label[^>]*>)Zahl(<\/label>)/g, '$1Nombre$2'], [/^Zahl$/, 'nombre'], [/(<span class="b-ctrl">)Zahl (?=<input)/, '$1Nombre '],
        [/^Zahl ([A-Z])$/, 'Nombre $1'],
        // place value tables: C, D, U in every class (under MILLIARDS, MILLIONS, MILLE, UNITÉS); with a comma M C D U , d c m
        [/<table class="g5-sw[\s\S]*?<\/table>/g, t => {
            const dez = /g5-sw-dez/.test(t);
            const P = dez ? { ZT: 'DM', T: 'M', H: 'C', Z: 'D', E: 'U', z: 'd', h: 'c', t: 'm' }
                : { Mrd: 'U', HM: 'C', ZM: 'D', M: 'U', HT: 'C', ZT: 'D', T: 'U', H: 'C', Z: 'D', E: 'U' };
            return t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E|z|h|t)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' + (P[k] || k) + '</th>');
        }],
        // stellenwert5: the number in words, read from the number above it. French school spelling of 1990 (the reference of
        // the French programmes since 2016): every part joined by a hyphen, "et" in 21 … 71, vingt and cent with an s when
        // multiplied and at the end (also before million, a noun), never before mille, which never changes
        ...(() => {
            const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
                'dix-sept', 'dix-huit', 'dix-neuf'];
            const T = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
            const u100 = (n, end) => {
                if (n < 20) return U[n];
                const t = Math.floor(n / 10), u = n % 10;
                if (t < 7) return T[t] + (u === 1 ? '-et-un' : u ? '-' + U[u] : '');
                if (t === 7) return 'soixante-' + (u === 1 ? 'et-onze' : U[10 + u]);
                if (t === 8) return 'quatre-vingt' + (u ? '-' + U[u] : end ? 's' : '');
                return 'quatre-vingt-' + U[10 + u];
            };
            const u1000 = (n, end) => {
                const h = Math.floor(n / 100), r = n % 100;
                const c = h ? (h > 1 ? U[h] + '-' : '') + 'cent' + (h > 1 && !r && end ? 's' : '') : '';
                return c + (r ? (c ? '-' : '') + u100(r, end) : '');
            };
            const words = n => {
                if (!n) return 'zéro';
                const p = [], b = Math.floor(n / 1e12) % 1000, g = Math.floor(n / 1e9) % 1000, m = Math.floor(n / 1e6) % 1000, k = Math.floor(n / 1e3) % 1000, r = n % 1000;
                if (b) p.push(u1000(b, true) + '-billion' + (b > 1 ? 's' : ''));
                if (g) p.push(u1000(g, true) + '-milliard' + (g > 1 ? 's' : ''));
                if (m) p.push(u1000(m, true) + '-million' + (m > 1 ? 's' : ''));
                if (k) p.push(k === 1 ? 'mille' : u1000(k, false) + '-mille');
                if (r) p.push(u1000(r, true));
                return p.join('-');
            };
            // after the comma as one says it: 3,047 → trois virgule zéro quarante-sept
            const after = f => f.match(/^0*/)[0].split('').map(() => 'zéro').concat(/[1-9]/.test(f) ? [words(+f)] : []).join(' ');
            const num = s => +s.replace(/[\s. ]/g, '');
            const G = '\\d[\\d\\u202f]*';
            return [
                [new RegExp('(<p class="g5-big">)(' + G + ')(</p><p class="g5-word">)[^<]*'), (m, a, n, b) => a + n + b + words(num(n))],
                [new RegExp('(<p class="g5-big">)(' + G + '(?:,\\d+)?)(</p>[\\s\\S]*?<p class="g5-dim">)Gesprochen: [^<]*'), (m, a, n, b) => {
                    const [i, f] = n.split(',');
                    return a + n + b + 'Se lit : ' + words(num(i)) + (f ? ' virgule ' + after(f) : '');
                }],
            ];
        })(),
        [/Das sind (\d+) Stellen\./, 'C’est un nombre à $1 chiffres.'], [/Das ist 1 Stelle\./, 'C’est un nombre à 1 chiffre.'],
        // zahlenstrahl5
        [/Gerundet auf (Zehner|Hunderter|Tausender|Zehntausender|Hunderttausender|Millionen)\. Entscheidend ist die Ziffer rechts davon: /, (m, p) => 'Arrondi ' +
            ({ 'Zehner': 'à la dizaine', 'Hunderter': 'à la centaine', 'Tausender': 'au millier', 'Zehntausender': 'à la dizaine de mille',
                'Hunderttausender': 'à la centaine de mille', 'Millionen': 'au million' })[p] + '. C’est le chiffre juste à droite qui décide : '],
        [/^Zahlenstrahl mit der Zahl (.+) zwischen (.+) und (.+)$/, 'Droite graduée avec le nombre $1 entre $2 et $3'],
        // sieb5
        [/<b>Teiler von (\d+):<\/b> (.*?) \((\d+) Stück\)/, (m, n, l, k) => '<b>Diviseurs de ' + n + ' :</b> ' + l + ' (' + k + (k === '1' ? ' diviseur' : ' diviseurs') + ')'],
        [/(\d+) ist eine Primzahl<\/span>: genau zwei Teiler, 1 und (\d+)\./, '$1 est un nombre premier</span> : exactement deux diviseurs, 1 et $2.'],
        // bruch5
        [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'La fraction ' + z + '/' + n + ' représentée par ' +
            ({ 'Kreis': 'un disque', 'Streifen': 'une bande', 'Rechteck': 'un rectangle' })[f]],
        [/, genau (\d+) Ganze\./, ', exactement $1 unités.'],
        [/Kürzen mit (\d+) ergibt /, 'En simplifiant par $1, on obtient '],
        // bruchstrahl5
        [/Auf denselben Nenner (\d+) gebracht: /, 'Au même dénominateur $1 : '],
        // winkel5: the kinds of angle
        ...(() => {
            const K = { 'Nullwinkel': 'angle nul', 'spitzer Winkel': 'angle aigu', 'rechter Winkel': 'angle droit', 'stumpfer Winkel': 'angle obtus',
                'gestreckter Winkel': 'angle plat', 'überstumpfer Winkel': 'angle rentrant', 'Vollwinkel': 'angle plein' };
            const KS = Object.keys(K).join('|');
            return [
                [new RegExp('<p>Ein <b>(' + KS + ')</b>(: )?'), (m, k, c) => '<p>Un <b>' + K[k] + '</b>' + (c ? ' : ' : '')],
                [new RegExp('Es ist ein (' + KS + ')\\.'), (m, k) => 'C’est un ' + K[k] + '.'],
            ];
        })(),
        [/Tipp zum Messen: Miss den Rest bis zum Vollwinkel, (\d+)°, und rechne 360° − (\d+)°\./,
            'Astuce pour mesurer : mesure ce qui manque jusqu’à l’angle plein, $1°, et calcule 360° − $2°.'],
        [/, nur (\d+)° daneben!/, ' : seulement $1° d’écart !'], [/Gut, (\d+)° daneben\./, 'Bien, $1° d’écart.'],
        [/(\d+)° daneben\. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen\?/, '$1° d’écart. Compare avec 90° et 180° : où se situe l’angle ?'],
        [/^Winkel von (\d+) Grad$/, 'Angle de $1 degrés'],
        // spiegel5
        [/Jeder Punkt wandert (\d+) nach (links|rechts) und (\d+) nach (unten|oben)\./, (m, a, lr, b, du) => 'Chaque point se déplace de ' + a + ' vers la ' +
            (lr === 'links' ? 'gauche' : 'droite') + ' et de ' + b + ' vers le ' + (du === 'oben' ? 'haut' : 'bas') + '.'],
        // the centre of the rotation: O in French schools (German Z, Zentrum), in the picture and in the sentences
        [/Drehung um Z(\([^)]*\)) um (\d+)°\./, 'Rotation de $2° autour de O$1.'], [/(<text class="g-pt"[^>]*>)Z(<\/text>)/g, '$1O$2'],
        [/(Richtig, es ist|Nicht ganz\. Es ist) eine (Spiegelung|Verschiebung|Drehung)\./, (m, p, k) => (p[0] === 'R' ? 'Bravo, c’est une ' : 'Pas tout à fait. C’est une ') +
            ({ 'Spiegelung': 'symétrie', 'Verschiebung': 'translation', 'Drehung': 'rotation' })[k] + '.'],
        // rechteck5: P for the perimeter (German u, Umfang)
        [/^Rechteck aus (\d+) Einheitsquadraten$/, 'Rectangle formé de $1 carrés unités'],
        [/Das ist 1 Reihe mit (\d+) Kästchen\./, (m, k) => 'C’est 1 rangée de ' + k + (k === '1' ? ' carreau.' : ' carreaux.')],
        [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, (m, r, k) => 'Ce sont ' + r + ' rangées de ' + k + (k === '1' ? ' carreau' : ' carreaux') + ' chacune.'],
        [/<p>Zusammen (\d+) cm²/, '<p>Au total $1 cm²'],
        [/(<p class="g5-big">)u = /g, '$1P = '], [/\$u = /g, '$$P = '],
        // quader5: A for the total area (German O, Oberfläche)
        [/^Quader (\d+) mal (\d+) mal (\d+)$/, 'Pavé droit de $1 sur $2 sur $3'],
        [/(\d+) Schicht(?:en)? mit je (.+?) Würfeln\./, (m, c, x) => c + (c === '1' ? ' couche de ' : ' couches de ') + x + ' cubes chacune.'],
        [/(<p class="g5-big">)O = /g, '$1A = '], [/\$O = /g, '$$A = '],
        [/Alle 12 Kanten zusammen: /, 'Les 12 arêtes ensemble : '],
        // einheiten5: j for the day (German d)
        [/^Einheitentreppe (Länge|Masse|Zeit|Fläche|Volumen)$/, (m, k) => 'Escalier des unités ' +
            ({ 'Länge': 'de longueur', 'Masse': 'de masse', 'Zeit': 'de durée', 'Fläche': 'd’aire', 'Volumen': 'de volume' })[k]],
        [/(<option value="0">)d(<\/option>)/g, '$1j$2'], [/(<text class="g-pt"[^>]*>)d(<\/text>)/g, '$1j$2'], [/(\d) d(?= [=≈]|<\/p>)/g, '$1 j'],
        // zahlschrift5
        [/^Die Zahl (\d+) in (aegypten|rom|maya|binaer)$/, (m, v, k) => 'Le nombre ' + v + ' ' +
            ({ aegypten: 'en chiffres égyptiens', rom: 'en chiffres romains', maya: 'en chiffres mayas', binaer: 'en binaire' })[k]],
        // symmetrie5
        [/^Farbe (\d)$/, 'Couleur $1'],
        // koord5
        [/<\/span> geht durch A und B, (<span[^>]*>h<\/span>) durch C und D\./, '</span> passe par A et B, $1 par C et D.'],
        // linien5
        [/Fünf Pfennige auf der Linie (\d[\d ]*) werden zu einem im Feld (\d[\d ]*)\./, 'Cinq jetons sur la ligne $1 deviennent un jeton dans l’espace $2.'],
        [/Zwei Pfennige im Feld (\d[\d ]*) werden zu einem auf der Linie (\d[\d ]*)\./, 'Deux jetons dans l’espace $1 deviennent un jeton sur la ligne $2.'],
        [/(\d[\d ]*) ist gelegt\./, '$1 est posé.'],
        [/(\d[\d ]*) dazugelegt\. Jetzt muss gebündelt werden\./, '$1 ajouté. Il faut maintenant regrouper.'],
        // book fr-12 mathegy5-fr:
    ]
});
