/* js/buch-fr/os9.js — French for the widgets of js/buch-os9.js.
 * Loaded by the French editions right after js/buch-os9.js; the engine and the shared words are in js/buch-fr.js.
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
 * js/buch-it/os9.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os9', {
    word: {
        // book fr-20 mathe9-fr:
        // titelbildos9 (the cover)
        'Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel':
            'Couverture : un triangle rectangle avec les carrés construits sur ses côtés, la parabole d’un lancer, un cône et une boule',
        // abstandos9 (chapter 1.1): the distance PQ, no bar in French
        'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse': 'Deux points déplaçables et leur distance comme hypoténuse',
        'Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.':
            'Le segment $[PQ]$ est l’hypoténuse d’un triangle rectangle dont les côtés de l’angle droit sont parallèles aux axes.',
        // umkehros9 (chapter 1.1); the same words as js/buch-fr/trigonometrie.js, which chapter 1.1 does not load
        'Seite $a$': 'Côté $a$', 'Seite $b$': 'Côté $b$', 'Seite $c$': 'Côté $c$',
        'Kein Dreieck möglich': 'Aucun triangle possible', 'Aus diesen Seiten entsteht kein Dreieck.': 'Ces côtés ne forment pas de triangle.',
        'Zwei Seiten zusammen müssen länger sein als die dritte.': 'Deux côtés réunis doivent être plus longs que le troisième.',
        'Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.':
            'Égalité : d’après la réciproque du théorème de Pythagore, le triangle est rectangle en $C$.',
        'Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.': 'Des nombres entiers tels que $a^2 + b^2 = c^2$ s’appellent des triplets pythagoriciens.',
        // rwdreieckos9 (chapter 1.2): côté opposé, côté adjacent, hypoténuse; "Gegeben" as in js/buch-fr/trigonometrie.js
        '$c$ und $\\alpha$': '$c$ et $\\alpha$', '$b$ und $\\alpha$': '$b$ et $\\alpha$', '$a$ und $\\alpha$': '$a$ et $\\alpha$',
        '$a$ und $b$': '$a$ et $b$', '$a$ und $c$': '$a$ et $c$', 'Gegeben': 'Données',
        'Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.': 'Le côté de l’angle droit $a$ doit être plus court que l’hypoténuse $c$.',
        'Rechtwinkliges Dreieck mit dem rechten Winkel bei C': 'Triangle rectangle en C',
        'Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.':
            'Le côté opposé à $\\alpha$ est $a$, le côté adjacent est $b$, l’hypoténuse est $c$. La calculatrice est en mode DEG.',
        // steigungos9 (chapter 1.3): pente, angle d’inclinaison
        'Steigung in Prozent': 'Pente en pourcentage', '100 m waagerecht': '100 m à l’horizontale',
        '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.': '100 % correspondent exactement à $45^\\circ$ : on monte autant qu’on avance.',
        'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.':
            'Plus de 100 %, c’est plus raide que $45^\\circ$ : cela n’existe que pour les escaliers et les trains de montagne.',
        'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.':
            'Le pourcentage n’augmente pas dans la même proportion que l’angle : un pourcentage double ne donne pas un angle double.',
        // dachos9 (chapter 1.3): French letters - largeur ℓ, longueur L, chevron c (German b, l, s); rules below
        'Hausbreite $b$': 'Largeur de la maison $\\ell$', 'Dachneigung $\\alpha$': 'Inclinaison du toit $\\alpha$', 'Hauslänge $l$': 'Longueur de la maison $L$',
        'Firsthöhe': 'Hauteur du faîtage', 'Sparrenlänge': 'Longueur des chevrons',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'La hauteur partage le pignon en deux triangles rectangles identiques. Les débords du toit ne sont pas comptés ici.',
        // kugelos9 (chapter 2.2): the table rows; "Volumen" and "Oberfläche" as in js/buch-fr/gy8.js, which OS 9 does not load
        'Radius gegeben': 'Rayon donné', 'Volumen gegeben': 'Volume donné', 'Volumen $V$': 'Volume $V$', 'Radius': 'Rayon',
        'Volumen': 'Volume', 'Oberfläche': 'Aire totale', 'Zylinder darum': 'Cylindre autour',
        'Eine Kugel in einem Zylinder, der genau um sie passt': 'Une boule dans le cylindre qui l’entoure exactement',
        'Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.':
            'La boule remplit toujours exactement les $\\tfrac{2}{3}$ du cylindre qui l’entoure. C’est Archimède qui l’a découvert.',
        // turmos9 (chapter 2.3): cylindre + cône (génératrice g, base 𝓑) or + demi-boule; "Zylinder", "Kegel" as in js/buch-fr/gleichungen.js
        'Turm: Zylinder + Kegel': 'Tour : cylindre + cône', 'Silo: Zylinder + Halbkugel': 'Silo : cylindre + demi-boule',
        'Höhe des Zylinders $h$': 'Hauteur du cylindre $h$', 'Höhe des Kegels $h_K$': 'Hauteur du cône $h_{\\text{cône}}$',
        'Turm aus einem Zylinder mit einem Kegeldach': 'Tour formée d’un cylindre et d’un toit conique',
        'Silo aus einem Zylinder mit einer Halbkugel als Dach': 'Silo formé d’un cylindre avec une demi-boule comme toit',
        'Zylinder': 'Cylindre', 'Kegel': 'Cône', 'Halbkugel': 'Demi-boule', 'Mantellinie': 'Génératrice',
        'Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.':
            'L’aire totale ne compte que les faces extérieures : le disque supérieur du cylindre est à l’intérieur et ne compte pas.',
        // parabelos9 (chapters 3.1, 3.2): parabole de référence, sommet, forme canonique, forme normalisée
        'Form': 'Forme', 'Graph einer quadratischen Funktion mit Scheitelpunkt': 'Courbe d’une fonction du second degré et son sommet',
        'Streckfaktor $a$': 'Coefficient $a$', 'Verschiebung $c$': 'Translation $c$',
        '$d$ (nach links, wenn positiv)': '$d$ (vers la gauche si positif)', '$e$ (nach oben, wenn positiv)': '$e$ (vers le haut si positif)',
        // quadglos9 (chapter 3.2): formule de résolution, discriminant D
        'Drei Parabeln mit zwei, einer und keiner Nullstelle': 'Trois paraboles avec deux zéros, un zéro et aucun zéro',
        'Parabel y = x² + p x + q mit ihren Nullstellen': 'Parabole y = x² + p x + q et ses zéros',
        // fibonaccios9 (chapter OP): nombres de Fibonacci, quotients, nombre d’or
        'Anzahl der Fibonacci-Zahlen $n$': 'Nombre de termes de Fibonacci $n$', 'Wert': 'Valeur',
        'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618': 'Les quotients de nombres de Fibonacci voisins s’approchent du nombre 1,618',
        'Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.':
            'Chaque nombre est la somme des deux précédents. Les quotients passent alternativement au-dessus et au-dessous de la ligne verte $\\Phi \\approx 1{,}618$ et s’en rapprochent de plus en plus.',
        // spannweiteos9 (chapter 4): étendue (the row is a rule below: js/buch-fr/daten.js has "Spannweite" with its letter $e$), médiane, moyenne
        'Ausreißer zu A (5,8 m)': 'Ajouter une valeur aberrante à A (5,8 m)', 'GRUPPE A': 'GROUPE A', 'GRUPPE B': 'GROUPE B',
        'Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite': 'Longueurs de saut de deux groupes, avec la moyenne et l’étendue',
        'kleinster Wert': 'plus petite valeur', 'größter Wert': 'plus grande valeur', 'Zentralwert': 'Médiane',
        'Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.':
            'Ligne blanche : moyenne. Le crochet sous les points va de la plus petite à la plus grande valeur ; sa longueur est l’étendue. Valeurs inventées.',
    },
    phrase: [
        // book fr-20 mathe9-fr:
        // abstandos9
        ['$\\overline{PQ} = \\sqrt{\\Delta x^2 + \\Delta y^2}', '$PQ = \\sqrt{\\Delta x^2 + \\Delta y^2}'],
        // umkehros9: "$a^2 + b^2 = 9 + 16 = 25$ und $c^2 = 25$."
        ['$ und $c^2 = ', '$ et $c^2 = '],
        // steigungos9: "$12\\,\\%$ Steigung: auf 100 m waagerecht 12 m höher, also $\\tan \\alpha = …"
        ['\\,\\%$ Steigung: auf 100 m waagerecht ', '\\,\\%$ de pente : sur 100 m à l’horizontale, '], [' m höher, also $\\tan \\alpha', ' m plus haut, donc $\\tan \\alpha'],
        ['Steigungswinkel: $\\alpha = \\tan^{-1}(', 'Angle d’inclinaison : $\\alpha = \\tan^{-1}('],
        // dachos9: the formulas after the \\cdot → \\times rule of js/buch-fr/geometrie.js
        ['$h = \\tfrac{b}{2} \\times \\tan \\alpha = ', '$h = \\tfrac{\\ell}{2} \\times \\tan \\alpha = '],
        ['$s = \\dfrac{b/2}{\\cos \\alpha} \\approx ', '$c = \\dfrac{\\ell/2}{\\cos \\alpha} \\approx '], ['$2 \\times s \\times l \\approx ', '$2 \\times c \\times L \\approx '],
        // pyramidekegel (js/buch-trigonometrie.js, chapters 2.1 and 2.2): after the rules of js/buch-fr/geometrie.js and the one below the
        // surface areas are A and A_L, so the pieces of js/buch-fr/trigonometrie.js ("$ · Oberfläche $O", "$ · Mantel $M") no longer match
        ['$ · Oberfläche $A = ', '$ · aire totale $A = '], ['$ · Mantel $A_L = ', '$ · aire latérale $A_L = '],
        // kugelos9 and turmos9: the volume of the cylinder V_cyl (German V_Z, Zylinder)
        ['$V_Z = ', '$V_{\\text{cyl}} = '],
        // turmos9: V_cône, h_cône, V_demi-boule, 𝓑 (German V_K, h_K, V_H, A_G), the slant height g
        ['$V_K = \\tfrac{1}{3}\\pi r^2 h_K', '$V_{\\text{cône}} = \\tfrac{1}{3}\\pi r^2 h_{\\text{cône}}'], ['$s = \\sqrt{r^2 + h_K^2}', '$g = \\sqrt{r^2 + h_{\\text{cône}}^2}'],
        ['$V_H = ', '$V_{\\text{demi-boule}} = '], ['$A_G + 2\\pi r h + ', '$\\mathcal{B} + 2\\pi r h + '], ['\\pi r s \\approx ', '\\pi r g \\approx '],
        // parabelos9
        ['Quadratische Ergänzung: $y = x^2', 'Mise sous forme canonique : $y = x^2'],
        ['$: Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.', '$ : pour $a = 0$, la courbe n’est plus une parabole, mais une droite horizontale.'],
        ['$ · Scheitelpunkt $S(', '$ · sommet $S('], ['$ (weiß)', '$ (en blanc)'], ['Wertebereich: $y ', 'Ensemble des images : $y '],
        ['Nullstellen (türkis): ', 'Zéros (en turquoise) : '], ['genau eine, $x_0 = ', 'un seul, $x_0 = '],
        ['keine, die Parabel trifft die x-Achse nicht', 'aucun, la parabole ne coupe pas l’axe des abscisses'],
        // quadglos9
        [' &nbsp; mit $p = ', ' &nbsp; avec $p = '],
        ['<b>Zwei Lösungen</b>, weil die Diskriminante $D = ', '<b>Deux solutions</b>, car le discriminant vaut $D = '], [' &gt; 0$ ist: $x_1 ', ' &gt; 0$ : $x_1 '],
        ['<b>Genau eine Lösung</b>, weil $D = 0$ ist: $x = ', '<b>Exactement une solution</b>, car $D = 0$ : $x = '],
        ['$. Der Scheitelpunkt liegt auf der x-Achse.', '$. Le sommet est sur l’axe des abscisses.'],
        ['<b>Keine Lösung</b>, weil $D = ', '<b>Aucune solution</b>, car $D = '],
        [' &lt; 0$ ist: Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.',
            ' &lt; 0$ : on ne peut pas extraire la racine carrée d’un nombre négatif. La parabole est entièrement au-dessus de l’axe des abscisses.'],
        // fibonaccios9
        ['Fibonacci-Zahlen: ', 'Nombres de Fibonacci : '],
    ],
    rule: [
        // book fr-20 mathe9-fr:
        // umkehros9: the triangle's aria-label and the angle at C when a² + b² ≠ c²
        [/^Dreieck mit den Seiten (\d+), (\d+) und (\d+)$/, 'Triangle de côtés $1, $2 et $3'],
        [/Nicht gleich: Der Winkel bei \$C\$ ist (kleiner|größer) als \$90\^\\circ\$, nämlich etwa \$/g,
            (m, k) => 'Pas d’égalité : l’angle en $C$ est ' + (k === 'kleiner' ? 'plus petit' : 'plus grand') + ' que $90^\\circ$, il mesure environ $'],
        // steigungos9: the aria-label of the slope triangle
        [/^Steigungsdreieck einer Straße mit (\d+) Prozent Steigung$/, 'Triangle de pente d’une route, pente de $1 %'],
        // dachos9: in the picture the rafter is c (chevron) and the width ℓ (largeur), then the aria-label
        [/<svg viewBox="0 0 320 320" role="img" aria-label="Querschnitt eines Satteldachs mit Neigung \d+ Grad">[\s\S]*?<\/svg>/g,
            m => m.replace(/>s<\/text>/g, '>c</text>').replace(/>b = /g, '>ℓ = ')],
        [/^Querschnitt eines Satteldachs mit Neigung (\d+) Grad$/, 'Coupe d’un toit à deux pans incliné de $1 degrés'],
        // dachos9: the roof area (js/buch-fr/vektoren.js has "Dachfläche" as one roof face, « pan de toit »)
        [/<td>Dachfläche<\/td><td>\$2 \\times s/g, '<td>Surface du toit</td><td>$$2 \\times s'],
        // pyramidekegel (js/buch-trigonometrie.js, only OS 9 loads this file): the French school letters of js/buch-fr/geometrie.js -
        // arête latérale ℓ (German s), aire totale A (German O); the cone's génératrice g and A, A_L come from the rules there
        [/Seitenkante \$s = (\\sqrt\{h\^2 \+ \\left\(\\tfrac\{d\}\{2\}\\right\)\^2\})\$ mit der Diagonale \$d = a\\sqrt2 \\approx ([^$]*)\$: \$s \\approx /g,
            (m, f, d) => 'Arête latérale $\\ell = ' + f + '$ avec la diagonale $d = a\\sqrt2 \\approx ' + d + '$ : $\\ell \\approx '],
        [/\$ · Oberfläche \$O = (?=a\^2 \+ 4)/g, '$$ · Oberfläche $$A = '],
        [/<svg viewBox="0 0 520 330" role="img" aria-label="Schrägbild (einer quadratischen Pyramide|eines Kegels) mit einem rechtwinkligen Dreieck">[\s\S]*/g,
            (m, k) => m.replace(/>s<\/text>/g, k === 'eines Kegels' ? '>g</text>' : '>ℓ</text>')],
        // turmos9: the slant height of the cone roof in the picture is g
        [/<svg viewBox="0 0 320 340" role="img" aria-label="Turm aus einem Zylinder mit einem Kegeldach">[\s\S]*?<\/svg>/g, m => m.replace(/>s<\/text>/g, '>g</text>')],
        // parabelos9: opening and shape of the parabola (feminine in French), the vertex as minimum or maximum, the sense of variation
        [/Die Parabel ist nach (oben|unten) geöffnet und (so weit wie die Normalparabel|enger als die Normalparabel \(gestreckt\)|weiter als die Normalparabel \(gestaucht\))\. Der Scheitelpunkt ist ein <b>(Minimum|Maximum)<\/b>\./g,
            (m, o, f, x) => 'La parabole est ouverte vers le ' + (o === 'oben' ? 'haut' : 'bas') + ' et ' + ({
                'so weit wie die Normalparabel': 'aussi large que la parabole de référence',
                'enger als die Normalparabel (gestreckt)': 'plus étroite que la parabole de référence (étirée)',
                'weiter als die Normalparabel (gestaucht)': 'plus large que la parabole de référence (comprimée)' })[f] +
                '. Le sommet correspond à un <b>' + x.toLowerCase() + '</b>.'],
        [/(Fallend|Steigend) für \$x &lt; ([^$]*)\$, (steigend|fallend) für \$x &gt; /g,
            (m, a, x, b) => (a === 'Fallend' ? 'Décroissante' : 'Croissante') + ' pour $x &lt; ' + x + '$, ' + (b === 'steigend' ? 'croissante' : 'décroissante') + ' pour $x &gt; '],
        // spannweiteos9: the table row "Spannweite" in bold, without the letter $e$ of the streuung table (this widget renders no TeX)
        [/<td><b>Spannweite<\/b><\/td>/g, '<td><b>Étendue</b></td>'],
    ]
});
