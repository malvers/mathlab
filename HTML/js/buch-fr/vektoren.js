/* js/buch-fr/vektoren.js — French for the widgets of js/buch-vektoren.js.
 * Loaded by the French editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the helpers of the module (the strings outside every widget, which every book
 * that loads it meets) and the block comments. Five books are translated at the same time, each has its own comment
 * line in word, phrase and rule - write only right below your book's line, every entry ending with a comma, so the
 * books merge without a conflict. The Italian file js/buch-it/vektoren.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('vektoren', {
    word: {
        // fr0: the helpers of the module (outside every widget; check.mjs vektoren/*), shared by the three books that load it
        'Räumliches Koordinatensystem': 'Repère de l’espace',
        'Ziehen zum Drehen': 'Fais glisser pour tourner',
        'Beispiele:': 'Exemples :',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Repère de l’espace avec un point et son vecteur position',
        'Punkte und Verbindungsvektor': 'Points et vecteur AB',
        'orthogonal': 'orthogonaux',
        'Summe und Differenz': 'Somme et différence',
        'Vielfaches': 'Multiple',
        'Was wird gezeigt?': 'Qu’affiche-t-on ?',
        'Summe oder Differenz': 'Somme ou différence',
        'Faktor $r$': 'Facteur $r$',
        'spitzer Winkel': 'angle aigu',
        'stumpfer Winkel': 'angle obtus',
        'Parallelogramm': 'Parallélogramme',
        'Rechteck': 'Rectangle',
        'Raute': 'Losange',
        'Quadrat': 'Carré',
        'Trapez': 'Trapèze',
        // book fr-3 mathe13-fr:
        'Parameter $t$': 'Paramètre $t$',
        'Ebene und Normalenvektor': 'Plan et vecteur normal',
        'Liegt der Punkt in E?': 'Le point est-il dans E ?',
        'Gerade schneidet Ebene': 'Une droite coupe un plan',
        'identisch': 'confondues',
        'schneidend': 'sécantes',
        'windschief': 'non coplanaires',
        'Pyramide': 'Pyramide',
        'Prisma (schief möglich)': 'Prisme (éventuellement oblique)',
        'Körper': 'Solide',
        'Grundkante $a$': 'Arête de base $a$',
        'Höhe $h$': 'Hauteur $h$',
        'Verschiebung der Spitze in $x$': 'Déplacement du sommet en $x$',
        // raum-hero and the mode switch of ebene3d (also BGY 12: keep one copy when merging with fr-2)
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Repère de l’espace avec un point et son vecteur position',
        'Was wird gezeigt?': 'Qu’affiche-t-on ?',
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        ['Mittelpunkt M zeigen', 'Afficher le milieu M'],
        ['Länge: $', 'Longueur : $'],
        ['Mittelpunkt: $', 'Milieu : $'],
        ['$, also $', '$, donc $'],
        ['Ortsvektoren $\\vec{OA} = ', 'Vecteurs position $\\vec{OA} = '],
        ['$ · Verbindungsvektor $\\vec{AB}', '$ · vecteur $\\vec{AB}'],
        ['$ multipliziert: $|r', '$ : $|r'],
        [': $\\vec{a} \\perp \\vec{b}$', ' : $\\vec{a} \\perp \\vec{b}$'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Soustraire, c’est ajouter le vecteur opposé $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.', 'Additionner, c’est placer $\\vec{b}$ à l’extrémité de $\\vec{a}$. La somme est la diagonale du parallélogramme.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Un facteur négatif inverse le sens.'],
        ['Mit $r = 0$ entsteht der Nullvektor.', 'Avec $r = 0$, on obtient le vecteur nul.'],
        [' Die Länge wird mit $|r| = ', ' La longueur est multipliée par $|r| = '],
        [' (stumpf: das Skalarprodukt ist negativ)', ' (obtus : le produit scalaire est négatif)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (aigu : le produit scalaire est positif)'],
        [' (parallel, gleiche Richtung)', ' (colinéaires, même sens)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Avec le vecteur nul, il n’y a pas d’angle.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'pas un quadrilatère plan : les quatre points ne sont pas dans un même plan.'],
        ['ein <b>Quadrat</b>', 'un <b>carré</b>'],
        ['ein <b>Rechteck</b>', 'un <b>rectangle</b>'],
        ['eine <b>Raute</b>', 'un <b>losange</b>'],
        ['ein <b>Parallelogramm</b>', 'un <b>parallélogramme</b>'],
        ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'un <b>trapèze</b> (une paire de côtés parallèles)'],
        ['ein allgemeines Viereck', 'un quadrilatère quelconque'],
        ['$: gegenüberliegende Seiten parallel und gleich lang', '$ : côtés opposés parallèles et de même longueur'],
        ['$: rechter Winkel bei $A$', '$ : angle droit en $A$'],
        ['$ und $|', '$ et $|'],
        ['$: benachbarte Seiten gleich lang', '$ : côtés consécutifs de même longueur'],
        ['$: Diagonalen senkrecht zueinander', '$ : diagonales perpendiculaires'],
        ['$ABCD$ ist ', '$ABCD$ est '],
        ['$ABCD$ ist kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', '$ABCD$ n’est pas un quadrilatère plan : les quatre points ne sont pas dans un même plan.'],
        // book fr-3 mathe13-fr:
        ['Der Richtungsvektor darf nicht der Nullvektor sein.', 'Le vecteur directeur ne doit pas être le vecteur nul.'],
        ['Punktprobe für $Q(', 'Test d’appartenance pour $Q('],
        ['Alle Zeilen liefern $t = ', 'Toutes les lignes donnent $t = '],
        ['$, also <b>$Q \\in g$</b>.', '$, donc <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'Les lignes donnent des valeurs différentes de $t$, donc <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: keine', 'Points de percée : aucun'],
        ['Spurpunkte: ', 'Points de percée : '],
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.', '$\\vec{u}$ et $\\vec{v}$ sont colinéaires : ils ne définissent pas de plan.'],
        ['$ · Koordinatenform: $', '$ · équation cartésienne : $'],
        ['Spurpunkte mit den Achsen: ', 'Intersections avec les axes : '],
        ['Punktprobe: $', 'Test d’appartenance : $'],
        ['$: <b>$Q$ liegt in $E$</b>.', '$ : <b>$Q$ est dans $E$</b>.'],
        ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$ : <b>$Q$ n’est pas dans $E$</b>. Distance $\\approx '],
        ['$: Die Gerade ist parallel zur Ebene ', '$ : la droite est parallèle au plan '],
        ['und liegt in ihr.', 'et y est contenue.'],
        ['und schneidet sie nicht.', 'et ne le coupe pas.'],
        ['Einsetzen von $g$ in $E$: $t = ', 'En remplaçant $g$ dans $E$ : $t = '],
        ['$, Schnittpunkt $S(', '$, point d’intersection $S('],
        ['Richtungsvektoren dürfen nicht der Nullvektor sein.', 'Les vecteurs directeurs ne doivent pas être le vecteur nul.'],
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'Les vecteurs directeurs sont colinéaires ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'Le point $Q$ de $h$ est sur $g$ : <b>confondues</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'Le point $Q$ de $h$ n’est pas sur $g$ : <b>strictement parallèles</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'Non parallèles. En égalant, on obtient $t = '],
        ['$: <b>schneidend</b> im Punkt $S(', '$ : <b>sécantes</b> au point $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ', 'Non parallèles et le système n’a pas de solution : <b>non coplanaires</b>. Plus courte distance (pointillés rouges) $\\approx '],
        ['Grundfläche $G', 'Aire de la base $G'],
        ['$, Spitze $S(', '$, sommet $S('],
        ['$, Höhe $h = ', '$, hauteur $h = '],
        ['Volumen $V', 'Volume $V'],
        ['Oberfläche $O = ', 'Aire totale $O = '],
        [' · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.', ' · Si tu déplaces le sommet horizontalement, le volume reste le même, l’aire latérale non.'],
        ['$, Verschiebung der Deckfläche $\\vec{w} = ', '$, translation de la face supérieure $\\vec{w} = '],
        [' · Mantel (4 Parallelogramme, je $', ' · aire latérale (4 parallélogrammes, chacun $'],
        [' (Prinzip von Cavalieri: auch schief)', ' (principe de Cavalieri : même oblique)'],
        // ebene3d (the same keys as the it-5 block of js/buch-it/vektoren.js: FOS 12 may add them too, keep one copy)
        ['Normalenvektor $\\vec{n}', 'Vecteur normal $\\vec{n}'], ['$ · Schnittwinkel: $', '$ · angle d’intersection : $'],
        // pyramide: pieces the it-3 block left German
        [' · Mantel (4 Dreiecke, je $', ' · aire latérale (4 triangles, chacun $'], ['$ (rot)', '$ (en rouge)'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // fr0: the helpers of the module (outside every widget; check.mjs vektoren/*), shared by the three books that load it
        // the inputs "Vektor a, x-Koordinate" → "Vecteur a, coordonnée x"; between the coordinate inputs the French semicolon
        // instead of the German bar: A ( 1 ; 2 ; 3 ) (tools/buch-fr/glossaire.md, section 4)
        [/\b(Vektor|Punkt) ([^,"]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vecteur ' : 'Point ') + n + ', coordonnée ' + c],
        [/(<span class="vk-par">)\|(<\/span>)/g, '$1;$2'],
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // skalarprodukt: the preset "parallel" means two vectors (colinéaires)
        [/(data-p="para">)parallel</g, '$1colinéaires<'],
        // book fr-3 mathe13-fr:
        // geradenlage: the preset "parallel" means two lines (parallèles)
        [/(data-p="par">)parallel</g, '$1parallèles<'],
        // gerade3d: a no-break space before the colons after "$t = …$" and "$Q(…)$" (the phrases turn the words)
        [/(\$t = [^$]*\$): (\$X\()/g, '$1 : $2'],
        [/(Punktprobe für \$Q\([^$]*\)\$):/g, '$1 :'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
