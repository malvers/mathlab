/* js/buch-fr/gy11lk-vek.js — French for the widgets of js/buch-gy11lk-vek.js.
 * Loaded by the French editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy11lk-vek.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy11lk-vek', {
    word: {
        // book fr-9 mathegy11lk-fr:
        // koordsys3d
        'Zylinderkoordinaten': 'Coordonnées cylindriques', 'Kugelkoordinaten': 'Coordonnées sphériques', 'Welches Koordinatensystem?': 'Quel système de coordonnées ?',
        'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten': 'Un point de l’espace avec ses coordonnées cylindriques ou sphériques',
        'Abstand $r$ zur $z$-Achse': 'Distance $r$ à l’axe des $z$', 'Winkel $\\varphi$': 'Angle $\\varphi$', 'Höhe $z$': 'Hauteur $z$',
        'Abstand $r$ zum Ursprung': 'Distance $r$ à l’origine', 'Länge $\\varphi$': 'Longitude $\\varphi$', 'Breite $\\vartheta$': 'Latitude $\\vartheta$',
        // linabh3d (vectors: masculine plural)
        'unabhängig': 'indépendants', 'komplanar': 'coplanaires', 'zwei parallel': 'deux colinéaires',
        'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen': 'Trois vecteurs partant de l’origine et le plan engendré par deux d’entre eux',
        // varignon3d (a quadrilateral whose vertices are not in one plane is a "quadrilatère gauche")
        'eben': 'plan', 'räumlich': 'gauche', 'nicht konvex': 'non convexe',
        'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten': 'Un quadrilatère de l’espace avec le parallélogramme des milieux de ses côtés',
        // ebenelim
        'Koordinatenform': 'Équation cartésienne', 'Gerade und Ebene': 'Droite et plan',
        'Eine Ebene im Raum mit ihrem Spurdreieck': 'Un plan de l’espace avec son triangle des traces',
        // ebenenlage ("schneidend" and "identisch" are the feminine words of js/buch-fr/vektoren.js for lines; the rule below
        // makes them masculine for the planes of this widget)
        'Dach': 'Toit', 'Spurgerade': 'Trace', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Deux plans de l’espace et leur droite d’intersection',
    },
    phrase: [
        // book fr-9 mathegy11lk-fr:
        // koordsys3d (the rule below writes the triples with the French semicolon)
        ['Zylinderkoordinaten $(', 'Coordonnées cylindriques $('], ['Kugelkoordinaten $(', 'Coordonnées sphériques $('], ['Kartesisch: $P(', 'Coordonnées cartésiennes : $P('],
        ['Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.', 'Tous les points de même $r$ sont sur une surface cylindrique autour de l’axe des $z$.'],
        [' mit der Länge $\\varphi$ und der Breite $\\vartheta$', ', avec la longitude $\\varphi$ et la latitude $\\vartheta$'],
        ['Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.',
            'Tous les points de même $r$ sont sur une sphère de centre l’origine ; sur la Terre, $\\varphi$ et $\\vartheta$ sont la longitude et la latitude géographiques.'],
        // linabh3d
        ['$ als Gleichungssystem: $', '$ sous forme de système : $'],
        ['Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.',
            'La méthode de Gauss mène à la matrice identité : seul $r = s = t = 0$ résout le système. Les vecteurs sont <b>linéairement indépendants</b>, ils ne sont pas coplanaires.'],
        ['Das System hat auch Lösungen mit Zahlen, die nicht alle null sind', 'Le système a aussi des solutions avec des nombres qui ne sont pas tous nuls'], [', denn $', ', car $'],
        ['. Die Vektoren sind <b>linear abhängig</b>: ', '. Les vecteurs sont <b>linéairement dépendants</b> : '],
        ['$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).', '$\\vec{c}$ est dans le plan de $\\vec{a}$ et $\\vec{b}$ (coplanaires).'],
        ['$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).', '$\\vec{a}$ et $\\vec{b}$ sont parallèles (colinéaires).'],
        // varignon3d
        ['Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $',
            'Vecteurs égaux : deux côtés opposés du quadrilatère des milieux sont parallèles et de même longueur, chacun deux fois plus court que la diagonale $AC$. De même, $'],
        ['Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.', 'Les sommets $A$, $B$, $C$, $D$ sont dans un même plan.'],
        ['Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.', 'Les sommets ne sont <b>pas</b> dans un même plan : un quadrilatère gauche.'],
        [' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.', ' Le quadrilatère des milieux est pourtant toujours un <b>parallélogramme</b> plan.'],
        // ebenelim (the rules below turn "Die Zeilen mit …", "… einsetzen:", "Spurpunkte: keine" and the colon after $Q(…)$ first)
        ['$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.', '$\\vec{u}$ et $\\vec{v}$ sont linéairement dépendants. Ils n’engendrent pas de plan.'],
        ['Koordinatenweise: $', 'Coordonnée par coordonnée : $'], ['Die Zeilen mit ', 'Multiplier les lignes par '],
        [' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $', ', puis les additionner. Les paramètres disparaissent alors : termes en $r$ : $'], ['$s$-Glieder $', 'termes en $s$ : $'],
        ['Koordinatenform: ', 'Équation cartésienne : '], ['. Spurpunkte: ', '. Points d’intersection avec les axes : '], ['Koordinatenform $', 'Équation cartésienne $'],
        ['$. Einsetzen von $Q(', '$. En remplaçant par $Q('],
        ['$: <b>$Q$ liegt in $E$</b>.', '$ : <b>$Q$ est dans $E$</b>.'], ['$: <b>$Q$ liegt nicht in $E$</b>.', '$ : <b>$Q$ n’est pas dans $E$</b>.'],
        ['In der Parameterform gehört $Q$ zu $r = ', 'Dans la représentation paramétrique, $Q$ correspond à $r = '], ['$ und $s = ', '$ et $s = '],
        ['Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.', 'Le vecteur directeur $\\vec{w}$ ne doit pas être le vecteur nul.'],
        ['$, also $', '$, donc $'],
        ['Immer wahr: <b>$g$ liegt in $E$</b>.', 'Toujours vrai : <b>$g$ est contenue dans $E$</b>.'],
        ['Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.', 'Une contradiction : <b>$g$ est parallèle à $E$</b> et n’a aucun point commun avec lui.'],
        ['Genau eine Lösung $t = ', 'Exactement une solution $t = '], ['$: <b>Durchstoßpunkt $S(', '$ : <b>point d’intersection $S('],
        // ebenenlage, and the inputs of its rows "E₁: [a] x + [b] y + [c] z = [d]"
        ['Koeffizient von x', 'coefficient de x'], ['Koeffizient von y', 'coefficient de y'], ['Koeffizient von z', 'coefficient de z'], ['rechte Seite', 'second membre'],
        ['Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.', 'Au moins un des coefficients de $x$, $y$, $z$ doit être non nul, sinon ce n’est pas un plan.'],
        ['Die linke Seite von $E_2$ ist das ', 'Le premier membre de $E_2$ vaut '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' fois le premier membre de $E_1$. À droite : $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'Les deux équations sont équivalentes : plans <b>confondus</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'Le système n’a aucune solution : plans <b>parallèles</b> et distincts.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $',
            'Les premiers membres ne sont pas multiples l’un de l’autre : les plans se <b>coupent</b> selon une droite. Variable libre $'],
        [' = t$, übrig bleibt für $', ' = t$ ; il reste pour $'], ['Gelöst: $', 'Solution : $'], ['Schnittgerade: ', 'Droite d’intersection : '],
        ['. Ganzzahliger Richtungsvektor: $', '. Vecteur directeur à coordonnées entières : $'],
    ],
    rule: [
        // book fr-9 mathegy11lk-fr:
        // koordsys3d: (r;\,\varphi;\,z) = (3;\,50^\circ;\,2{,}5) → (r\,;\,\varphi\,;\,z) = (3\,;\,50^\circ\,;\,2{,}5)
        [/\(([^()$;]*[^()$;,\s]);\\,([^()$;]*[^()$;,\s]);\\,([^()$;]*[^()$;,\s])\)/g, '($1\\,;\\,$2\\,;\\,$3)'],
        // ebenelim: "Die Zeilen mit 1, 2 und 3 multiplizieren" (the pieces do the rest)
        [/(Die Zeilen mit [^<$]*?) und /g, '$1 et '],
        // ebenelim: "$g\colon \vec{x} = …$ in $x + y = 2$ einsetzen: " → "On remplace $g\colon …$ dans $x + y = 2$ : "
        [/(\$g\\colon \\vec\{x\} = [^$]*\$) in (\$[^$]*\$) einsetzen: /g, 'On remplace $1 dans $2 : '],
        // ebenelim: "Spurpunkte: keine" (a plane parallel to all three axes cannot be, so this is only a guard) and the colon after $Q(…)$
        [/\. Spurpunkte: keine(?=<\/p>)/g, '. Points d’intersection avec les axes : aucun'],
        [/(Einsetzen von \$Q\([^$]*\)\$): \$/g, '$1 : $'],
        // ebenenlage: "übrig bleibt für $x$ und $y$: " → "… $x$ et $y$ : "
        [/(übrig bleibt für \$[xyz]\$) und \$([xyz])\$: /g, (m, a, v) => a + ' et $' + v + '$ : '],
        // ebenenlage: the example buttons are planes - masculine "sécants", "confondus" (js/buch-fr/vektoren.js has the feminine
        // words for lines). The words are already parked as \u0003n\u0004 when the rules run, so the rule writes the French
        // itself; only the preset row of this widget has the button data-p="dach"
        [/^[\s\S]*data-p="dach"[\s\S]*$/, s => s.replace(/(data-p="(sch|ide)">)\u0003\d+\u0004/g, (m, b, k) => b + (k === 'sch' ? 'sécants' : 'confondus'))],
    ]
});
