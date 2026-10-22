/* js/buch-fr/integral.js — French for the widgets of js/buch-integral.js.
 * Loaded by the French editions right after js/buch-integral.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the cover of the start page and the block comments. Five books are translated at
 * the same time, each has its own comment line in word, phrase and rule - write only right below your book's line,
 * every entry ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/integral.js shows
 * which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('integral', {
    word: {
        // fr0: the cover of the start page (BGY 13 mathe13)
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Couverture : courbe en cloche sur l’histogramme d’un test avec sa zone de rejet, un plan de l’espace avec son vecteur normal et une droite',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        'Konstante $C$': 'Constante $C$',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).': 'En haut : primitives F + C (celle choisie en clair). Fais glisser le point. En bas : f. La pente de F au point est exactement la valeur f(x₀) de la fonction.',
        'Schar von Stammfunktionen': 'Famille de primitives',
        'Die Funktion f': 'La fonction f',
        'Wassertank': 'Cuve d’eau',
        'Zuflussrate in l/min': 'Débit entrant en l/min',
        'Wasser in l': 'Eau en l',
        'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.': 'Jusqu’à $t = 6$, l’eau entre, ensuite elle s’écoule (taux de variation négatif). La quantité est maximale en $t = 6$.',
        'Autofahrt': 'Trajet en voiture',
        'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.': 'L’aire sous la courbe de la vitesse est la distance parcourue.',
        'Änderungsrate mit Fläche': 'Taux de variation avec l’aire',
        'Rekonstruierter Bestand': 'Quantité reconstituée',
        'Zeit $t$': 'Temps $t$',
        'Bestimmtes Integral zwischen zwei Grenzen': 'Intégrale définie entre deux bornes',
        'Parabel und Gerade': 'Parabole et droite',
        'Kubik und Parabel': 'Cubique et parabole',
        'Sinus und Kosinus': 'Sinus et cosinus',
        'Funktionen': 'Fonctions',
        'Fläche zwischen zwei Graphen': 'Aire entre deux courbes',
        'Zu wenige Schnittstellen im Bild.': 'Trop peu de points d’intersection dans l’image.',
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        ['$ · Stammfunktionen $F(x) = ', '$ · primitives $F(x) = '],
        [' + C$, denn $F\'(x) = f(x)$.', ' + C$, car $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'En $x_0 = '],
        ['$: Steigung von $F$ $= f(', '$ : pente de $F$ $= f('],
        ['$, egal welches $C$.', '$, quel que soit $C$.'],
        ['$ · Anfangsbestand $', '$ · quantité initiale $'],
        ['Bestand nach $t = ', 'Quantité après $t = '],
        ['Teilstücke zwischen den Nullstellen: ', 'Morceaux entre les zéros : '],
        ['Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ', 'Aire entre la courbe et l’axe des $x$ : $A \\approx '],
        [' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.', ' · L’intégrale est plus petite, car les aires sous l’axe (en rouge) comptent négativement.'],
        [' · Achtung: $a > b$ dreht das Vorzeichen.', ' · Attention : $a > b$ change le signe.'],
        ['$ · Schnittstellen: ', '$ · intersections : '],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // bestand: a no-break space before the colon after "$t = …$" (the phrase below turns the words)
        [/(Bestand nach \$t = [^$]*\$):/g, '$1 :'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
