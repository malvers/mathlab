/* js/buch-it/gy11lk-vek.js — Italian for the widgets of js/buch-gy11lk-vek.js.
 * Loaded by the Italian editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy11lk-vek.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy11lk-vek', {
    word: {
        // book it-7 mathegy11lk-it:
        // koordsys3d
        'Zylinderkoordinaten': 'Coordinate cilindriche', 'Kugelkoordinaten': 'Coordinate sferiche', 'Welches Koordinatensystem?': 'Quale sistema di coordinate?',
        'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten': 'Un punto nello spazio con le sue coordinate cilindriche o sferiche',
        'Abstand $r$ zur $z$-Achse': 'Distanza $r$ dall’asse $z$', 'Winkel $\\varphi$': 'Angolo $\\varphi$', 'Höhe $z$': 'Altezza $z$',
        'Abstand $r$ zum Ursprung': 'Distanza $r$ dall’origine', 'Länge $\\varphi$': 'Longitudine $\\varphi$', 'Breite $\\vartheta$': 'Latitudine $\\vartheta$',
        // linabh3d
        'unabhängig': 'indipendenti', 'komplanar': 'complanari', 'zwei parallel': 'due paralleli',
        'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen': 'Tre vettori che partono dall’origine e il piano generato da due di essi',
        // varignon3d
        'eben': 'piano', 'räumlich': 'sghembo', 'nicht konvex': 'non convesso',
        'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten': 'Un quadrilatero nello spazio con il parallelogramma dei punti medi dei suoi lati',
        // ebenelim
        'Koordinatenform': 'Equazione cartesiana', 'Gerade und Ebene': 'Retta e piano',
        'Eine Ebene im Raum mit ihrem Spurdreieck': 'Un piano nello spazio con il suo triangolo delle tracce',
        // ebenenlage
        'Dach': 'Tetto', 'Spurgerade': 'Retta traccia', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Due piani nello spazio e la loro retta di intersezione',

    },
    phrase: [
        // book it-7 mathegy11lk-it:
        // koordsys3d
        ['Zylinderkoordinaten $(', 'Coordinate cilindriche $('], ['Kugelkoordinaten $(', 'Coordinate sferiche $('], ['Kartesisch: $P(', 'Cartesiane: $P('],
        ['Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.', 'Tutti i punti con lo stesso $r$ stanno su una superficie cilindrica intorno all’asse $z$.'],
        [' mit der Länge $\\varphi$ und der Breite $\\vartheta$', ', con la longitudine $\\varphi$ e la latitudine $\\vartheta$'],
        ['Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.',
            'Tutti i punti con lo stesso $r$ stanno su una sfera con centro nell’origine; sulla Terra $\\varphi$ e $\\vartheta$ sono la longitudine e la latitudine geografiche.'],
        // linabh3d
        ['\\vec{o}', '\\vec{0}'],   // the null vector as pupils write it here, not the German \vec{o}
        ['$ als Gleichungssystem: $', '$ come sistema di equazioni: $'],
        ['Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.',
            'Il metodo di Gauss porta alla matrice identità: solo $r = s = t = 0$ risolve il sistema. I vettori sono <b>linearmente indipendenti</b>, non stanno in uno stesso piano.'],
        ['Das System hat auch Lösungen mit Zahlen, die nicht alle null sind', 'Il sistema ha anche soluzioni con numeri non tutti nulli'], [', denn $', ', perché $'],
        ['. Die Vektoren sind <b>linear abhängig</b>: ', '. I vettori sono <b>linearmente dipendenti</b>: '],
        ['$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).', '$\\vec{c}$ giace nel piano di $\\vec{a}$ e $\\vec{b}$ (complanari).'],
        ['$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).', '$\\vec{a}$ e $\\vec{b}$ sono paralleli (collineari).'],
        // varignon3d
        ['Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $',
            'Vettori uguali: due lati opposti del quadrilatero dei punti medi sono paralleli e lunghi uguali, entrambi la metà della diagonale $AC$. Allo stesso modo $'],
        ['Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.', 'I vertici $A$, $B$, $C$, $D$ stanno in uno stesso piano.'],
        ['Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.', 'I vertici <b>non</b> stanno in uno stesso piano: un quadrilatero sghembo.'],
        [' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.', ' Il quadrilatero dei punti medi è comunque sempre un <b>parallelogramma</b> piano.'],
        // ebenelim
        ['$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.', '$\\vec{u}$ e $\\vec{v}$ sono linearmente dipendenti. Non generano un piano.'],
        ['Koordinatenweise: $', 'Coordinata per coordinata: $'], ['Die Zeilen mit ', 'Moltiplica le righe per '],
        [' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $', ' e sommale. Così spariscono i parametri: termini in $r$: $'], ['$s$-Glieder $', 'termini in $s$: $'],
        ['Koordinatenform: ', 'Equazione cartesiana: '], ['Koordinatenform $', 'Equazione cartesiana $'], ['$. Einsetzen von $Q(', '$. Sostituendo $Q('],
        ['$: <b>$Q$ liegt nicht in $E$</b>.', '$: <b>$Q$ non giace in $E$</b>.'],
        ['In der Parameterform gehört $Q$ zu $r = ', 'Nell’equazione parametrica a $Q$ corrispondono $r = '], ['$ und $s = ', '$ e $s = '],
        ['Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.', 'Il vettore direzione $\\vec{w}$ non può essere il vettore nullo.'],
        ['Immer wahr: <b>$g$ liegt in $E$</b>.', 'Sempre vero: <b>$g$ giace in $E$</b>.'],
        ['Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.', 'Una contraddizione: <b>$g$ è parallela a $E$</b> e non ha nessun punto in comune con esso.'],
        ['Genau eine Lösung $t = ', 'Esattamente una soluzione $t = '], ['$: <b>Durchstoßpunkt $S(', '$: <b>punto di intersezione $S('],
        // ebenenlage, and the inputs of its rows "E₁: [a] x + [b] y + [c] z = [d]"
        ['Koeffizient von x', 'coefficiente di x'], ['Koeffizient von y', 'coefficiente di y'], ['Koeffizient von z', 'coefficiente di z'], ['rechte Seite', 'termine noto'],
        ['Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.', 'Almeno uno dei coefficienti di $x$, $y$, $z$ deve essere diverso da zero, altrimenti non è un piano.'],
        ['Die linke Seite von $E_2$ ist das ', 'Il primo membro di $E_2$ è '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' volte il primo membro di $E_1$. A destra: $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'Le due equazioni sono equivalenti: <b>coincidenti</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'Il sistema non ha soluzioni: <b>paralleli</b> e distinti.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $',
            'I primi membri non sono multipli l’uno dell’altro: i piani si <b>intersecano</b> in una retta. Variabile libera $'],
        [' = t$, übrig bleibt für $', ' = t$; resta per $'], ['Gelöst: $', 'Risolto: $'], ['Schnittgerade: ', 'Retta di intersezione: '],
        ['. Ganzzahliger Richtungsvektor: $', '. Vettore direzione con numeri interi: $'],

    ],
    rule: [
        // book it-7 mathegy11lk-it:
        // koordsys3d: (r;\,\varphi;\,z) = (3;\,50^\circ;\,2{,}5) → (r, \varphi, z) = (3;\, 50^\circ;\, 2{,}5) - semicolons only with a decimal comma
        [/\(([^()$;]+);\\,([^()$;]+);\\,([^()$;]+)\)/g, (m, a, b, c) => /\{,\}/.test(a + b + c) ? '(' + a + ';\\, ' + b + ';\\, ' + c + ')' : '(' + a + ', ' + b + ', ' + c + ')'],
        // ebenelim: "Die Zeilen mit 1, 2 und 3 multiplizieren" (the pieces do the rest)
        [/(Die Zeilen mit [^<$]*?) und /g, '$1 e '],
        // ebenelim: "$g\colon \vec{x} = …$ in $x + y = 2$ einsetzen: " → "Sostituisci $g\colon …$ in $x + y = 2$: "
        [/(\$g\\colon \\vec\{x\} = [^$]*\$) in (\$[^$]*\$) einsetzen: /g, 'Sostituisci $1 in $2: '],
        // ebenenlage: "übrig bleibt für $x$ und $y$" → "… $x$ e $y$"
        [/(übrig bleibt für \$[xyz]\$) und \$([xyz])\$/g, (m, a, v) => a + ' e $' + v + '$'],

    ]
});
