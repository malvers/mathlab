/* js/buch-fr/lgs.js — French for the widgets of js/buch-lgs.js.
 * Loaded by the French editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the block comments. Five books are translated at the same time, each has its own
 * comment line in word, phrase and rule - write only right below your book's line, every entry ending with a comma, so
 * the books merge without a conflict. The Italian file js/buch-it/lgs.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('lgs', {
    word: {
        // book fr-1 mathe11-fr:
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Appliquer', 'Nächster Schritt': 'Étape suivante', 'Neues LGS': 'Nouveau système',
        'Zeile + k · Zeile': 'ligne + k · ligne', 'Zeile · k': 'ligne · k', 'tauschen': 'échanger', 'Zielzeile': 'Ligne cible', 'zweite Zeile': 'Deuxième ligne', 'Faktor k': 'Facteur k',
        'Ziel I': 'cible I', 'Ziel II': 'cible II', 'Ziel III': 'cible III', 'mit I': 'avec I', 'mit II': 'avec II', 'mit III': 'avec III',
        'eine Lösung': 'une solution', 'keine Lösung': 'aucune solution', 'unendlich viele': 'une infinité', 'Zwei Geraden': 'Deux droites',
        'mit $r =$': 'avec $r =$', 'Neue Matrizen': 'Nouvelles matrices', 'Wähle eine Rechnung.': 'Choisis un calcul.',
        '1 Schritt': '1 étape', '10 Schritte': '10 étapes', 'Vier Webseiten und ihre Links': 'Quatre pages web et leurs liens',
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // geraden
        'eine Lösung': 'une solution',
        'keine Lösung': 'aucune solution',
        'unendlich viele': 'une infinité',
        'Zwei Geraden': 'Deux droites',
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Terminé : $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Forme échelonnée atteinte. Tu peux maintenant remplacer de bas en haut ou continuer à transformer avec « Étape suivante » (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Choisis une transformation et applique-la, ou fais-toi aider par « Étape suivante ».'],
        ['Wähle zwei verschiedene Zeilen.', 'Choisis deux lignes différentes.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Saisis un nombre pour $k$, p. ex. -2 ou 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Multiplier par $0$ n’est pas une transformation équivalente.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Ajouter une ligne à elle-même change l’ensemble des solutions. Choisis une autre ligne.'],
        ['Gleichung I ist fest: ', 'L’équation I est fixe : '], ['. Verändere Gleichung II: ', '. Modifie l’équation II : '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'L’équation II s’écrit $0 = 0$ : elle n’impose rien.'], ['Gleichung II lautet $0 = ', 'L’équation II s’écrit $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$ : une contradiction, aucune solution.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exactement une solution</b> : les droites se coupent en $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Une infinité de solutions</b> : les deux équations décrivent la même droite.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Aucune solution</b> : les droites sont parallèles et distinctes.'],
        ['Gleiche Stellen werden addiert.', 'On additionne les éléments placés au même endroit.'], ['Gleiche Stellen werden subtrahiert.', 'On soustrait les éléments placés au même endroit.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Chaque élément est multiplié par $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Les lignes deviennent des colonnes : une matrice $2 \\times 3$ devient une matrice $3 \\times 2$.'],
        ['Summe: $', 'Somme : $'],
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // geraden
        ['Gleichung I ist fest: ', 'L’équation I est fixe : '],
        ['. Verändere Gleichung II: ', '. Modifie l’équation II : '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'L’équation II s’écrit $0 = 0$ : elle n’impose aucune condition.'],
        ['Gleichung II lautet $0 = ', 'L’équation II s’écrit $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$ : une contradiction, aucune solution.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exactement une solution</b> : les droites se coupent en $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Une infinité de solutions</b> : les deux équations décrivent la même droite.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Aucune solution</b> : les droites sont parallèles et distinctes.'],
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'Dans la colonne $1, il n’y a plus de pivot : le système n’a aucune solution ou en a une infinité.'],
        [/Schritt (\d+):/g, 'Étape $1 :'],
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
