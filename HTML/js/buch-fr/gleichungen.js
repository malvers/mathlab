/* js/buch-fr/gleichungen.js — French for the widgets of js/buch-gleichungen.js.
 * Loaded by the French editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the rule for the solution set ($L$ → $S$) and the block comments. Five books are
 * translated at the same time, each has its own comment line in word, phrase and rule - write only right below your
 * book's line, every entry ending with a comma, so the books merge without a conflict. The Italian file
 * js/buch-it/gleichungen.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gleichungen', {
    word: {
        // book fr-1 mathe11-fr:
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'p. ex. −3 ou :4 ou −2x', 'Anwenden': 'Appliquer', 'Neue Gleichung': 'Nouvelle équation',
        'Länge $a$': 'Longueur $a$', 'Länge $b$': 'Longueur $b$', 'Quadrat mit Seitenlänge a + b': 'Carré de côté a + b',
        'Zylinder': 'Cylindre', 'Kegel': 'Cône', 'Kugel': 'Boule', 'Körper': 'Solide', 'Radius $r$ in cm': 'Rayon $r$ en cm',
        'Höhe $h$ in cm': 'Hauteur $h$ en cm', 'Skizze des Körpers': 'Croquis du solide',
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // binom
        'Länge $a$': 'Longueur $a$',
        'Länge $b$': 'Longueur $b$',
        'Quadrat mit Seitenlänge a + b': 'Carré de côté a + b',
        // waage
        'z. B. −3 oder :4 oder −2x': 'p. ex. −3 ou :4 ou −2x',
        'Anwenden': 'Appliquer',
        'Neue Gleichung': 'Nouvelle équation',
        // ungleichung
        'Relationszeichen': 'Signe d’inégalité',
        '$a$ (Zahl vor dem $x$)': '$a$ (nombre devant $x$)',
        '$c$ (rechte Seite)': '$c$ (membre de droite)',
        'durch eine negative Zahl: Das Zeichen dreht sich um!': 'par un nombre négatif : le sens de l’inégalité change !',
        'Zahlenstrahl mit der Lösungsmenge': 'Droite graduée avec l’ensemble des solutions',
        'Probe': 'Test',
        'wahr': 'vrai',
        'falsch': 'faux',
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // waage
        ['Gelöst: $x = ', 'Résolu : $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Fais la vérification : remplace $x$ par cette valeur dans la première ligne.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Les deux membres sont égaux : tout nombre est solution, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradiction : il n’y a aucune solution, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Écris la transformation que tu veux appliquer aux <b>deux</b> membres.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Je ne comprends pas. Exemples : '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Il manque un nombre après le signe d’opération.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplier ou diviser par $x$ n’est pas une transformation sûre : $x$ pourrait valoir $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'On ne peut pas diviser par $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplier par $0$ transforme toute équation en $0 = 0$, et l’information est perdue.'],
        ['Bring alle $x$ auf eine Seite: ', 'Mets tous les $x$ du même côté : '], ['Bring die Zahl auf die andere Seite: ', 'Fais passer le nombre de l’autre côté : '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divise par le nombre devant le $x$ : '],
        // binom, koerper ($M$ and $O$ stay as in the chapter text of lb2)
        ['Der häufigste Fehler: ', 'L’erreur la plus fréquente : '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. Sur la figure, il manque alors les deux rectangles bleus, ici '],
        ['Mantellinie $s = ', 'Génératrice $s = '],
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // binom
        ['Der häufigste Fehler: ', 'L’erreur la plus fréquente : '],
        ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. Sur la figure, il manque alors les deux rectangles bleus, ici '],
        // waage
        ['Gelöst: $x = ', 'Résolu : $x = '],
        ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Fais la vérification : remplace l’inconnue par cette valeur dans la première ligne.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Les deux membres sont égaux : tout nombre est solution, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradiction : il n’y a aucune solution, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Écris la transformation que tu veux appliquer aux <b>deux</b> membres.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Je ne comprends pas. Exemples : '],
        ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Il manque un nombre après le signe d’opération.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplier par $x$ ou diviser par $x$ n’est pas une transformation sûre : $x$ pourrait valoir $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'On n’a pas le droit de diviser par $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplier par $0$ transforme toute équation en $0 = 0$ : l’information est perdue.'],
        ['Bring alle $x$ auf eine Seite: ', 'Ramène tous les $x$ du même côté : '],
        ['Bring die Zahl auf die andere Seite: ', 'Fais passer le nombre de l’autre côté : '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divise par le nombre devant $x$ : '],
        // ungleichung
        ['heißt $', 'signifie $'],
        ['Das stimmt für jede Zahl: ', 'C’est vrai pour tout nombre : '],
        ['Das stimmt für keine Zahl: ', 'Ce n’est vrai pour aucun nombre : '],
        ['Zieh die <b>Probe</b> über den Zahlenstrahl. $x = ', 'Fais glisser le <b>test</b> le long de la droite graduée. $x = '],
        ['$ ist ', '$ est '],
        [': Die Zahl gehört zur Lösungsmenge.', ' : le nombre appartient à l’ensemble des solutions.'],
        [': Die Zahl gehört nicht dazu.', ' : le nombre n’en fait pas partie.'],
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // fr0: the solution set is S in the French books (glossaire, section 4), also in the widget sentences:
        // $L = \{…\}$, $L = \mathbb{R}$ → $S = …$ (BGY 11 and FOS 11 load this module)
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // ungleichung: "… Zahlenstrahl. $x = 1$: $…" gets its no-break space (before the pieces)
        [/(Zahlenstrahl\. \$x = [^$]*\$): \$/g, '$1 : $'],
        // book fr-5 mathefos12-fr:
    ]
});
