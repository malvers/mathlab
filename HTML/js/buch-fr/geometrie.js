/* js/buch-fr/geometrie.js — French for the widgets of js/buch-geometrie.js.
 * Loaded by the French editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. The Italian file js/buch-it/geometrie.js shows which German strings the widgets write.
 * OS 5 (mathe5-fr) loads this module only for its SVG helpers (Buch.geo), none of its widgets: nothing to translate yet.
 */
window.BuchFR && BuchFR.add('geometrie', {
    word: {
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // titelbildgy9 (the cover of GY 9)
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Couverture : triangle rectangle avec les carrés construits sur ses côtés, rectangle d’or avec sa spirale, cercle entre deux hexagones et parabole',
        // kreisteil (chapter 2): arc length ℓ and perimeter P, the French letters (rules below)
        'Radius $r$': 'Rayon $r$', 'Mittelpunktswinkel $\\alpha$': 'Angle au centre $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Cercle avec un secteur circulaire et un arc',
        'Kreisbogen': 'Arc', 'Kreisausschnitt': 'Secteur',
        // pythagoras (chapter 3.1): Kathetensatz and Höhensatz have Swiss-French names, France says "relations métriques"
        'Pythagoras': 'Pythagore', 'Kathetensatz': 'Théorème d’Euclide', 'Höhensatz': 'Théorème de la hauteur', 'Satz': 'Théorème', 'gleichschenklig': 'isocèle',
        'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.':
            'Déplace le point $C$. Il reste sur le cercle de diamètre $[AB]$, c’est pourquoi l’angle en $C$ est toujours droit.',
        'Rechtwinkliges Dreieck mit Quadraten über den Seiten': 'Triangle rectangle avec les carrés construits sur ses côtés',
        'Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.':
            'Les deux carrés construits sur les côtés de l’angle droit ont ensemble exactement l’aire du carré construit sur l’hypoténuse.',
        'Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.': 'Chaque carré construit sur un côté de l’angle droit a la même aire que le rectangle situé en dessous.',
        'Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.': 'Le carré de la hauteur a la même aire que le rectangle formé par les deux segments de l’hypoténuse.',
        // trigo (chapter 3.2): côté opposé, côté adjacent, hypoténuse
        'Sinus': 'Sinus', 'Kosinus': 'Cosinus', 'Tangens': 'Tangente', 'Verhältnis': 'Rapport', 'Winkel $\\alpha$': 'Angle $\\alpha$', 'Hypotenuse $c$': 'Hypoténuse $c$',
        'Gegenkathete a': 'côté opposé a', 'Ankathete b': 'côté adjacent b', 'Hypotenuse c': 'hypoténuse c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triangle rectangle avec l’angle alpha',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Modifie $c$ : le triangle devient plus grand ou plus petit, mais les trois rapports restent les mêmes. Ils ne dépendent que de l’angle.',
        // vieleck (chapter 3.2): the perimeter is P
        'Ecken verdoppeln': 'Doubler les sommets', 'Zurück auf 6': 'Revenir à 6', 'Anzahl der Ecken $n$': 'Nombre de sommets $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Cercle avec un polygone inscrit et un polygone circonscrit', 'innen': 'inscrit', 'außen': 'circonscrit',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Cercle de rayon $r = 1$, donc $P = 2\\pi$. Périmètre divisé par $2$ :',
        // spitzkoerper (chapter 3.3): apothème h_a, arête latérale ℓ, génératrice g (rules below)
        'Quadratische Pyramide': 'Pyramide à base carrée', 'Kreiskegel': 'Cône de révolution', 'Körper': 'Solide', 'Seitenhöhe': 'Apothème',
        'Seitenkante': 'Arête latérale', 'Hilfsdreieck': 'Triangle auxiliaire', 'Grundkante $a$': 'Arête de base $a$', 'Höhe $h$': 'Hauteur $h$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Pyramide à base carrée en perspective cavalière, avec le triangle auxiliaire',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cône de révolution en perspective cavalière, avec le triangle auxiliaire',
        // goldenerschnitt (chapter OP): section dorée, nombre d’or, the side of the pentagon is c (côté) as in chapter 3.2
        'Ansicht': 'Vue', 'Strecke teilen': 'Partager un segment', 'Goldenes Rechteck': 'Rectangle d’or', 'Pentagramm': 'Pentagramme',
        'Golden teilen': 'Partage doré', 'Quadrate abschneiden': 'Retirer des carrés',
        'Ganzes : größerer Teil': 'tout : grande partie', 'größerer : kleinerer Teil': 'grande : petite partie',
        'Strecke AB mit Teilungspunkt T': 'Segment [AB] avec le point de partage T',
        'Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.':
            'Les deux rapports sont égaux : c’est la section dorée, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.',
        'Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.': 'Déplace le point $T$ jusqu’à ce que les deux rapports soient égaux.',
        'Goldenes Rechteck, in Quadrate zerlegt, mit Spirale': 'Rectangle d’or découpé en carrés, avec sa spirale',
        'Regelmäßiges Fünfeck mit Pentagramm': 'Pentagone régulier avec son pentagramme', 'Seite': 'Côté',
        'größerer Teil': 'grande partie', 'kleinerer Teil': 'petite partie',
    },
    phrase: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // kreisteil (u, the German perimeter, is P in French)
        ['Anteil am Vollkreis: $', 'Part du cercle entier : $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Fais glisser l’extrémité de l’arc. Pour comparer, le cercle entier : $P \\approx '],
        // pythagoras: "$a^2 \\approx 9$ und $c \\times p \\approx …" (the products are \\times already: the rule below runs first)
        ['$ und $c \\times p \\approx ', '$ et $c \\times p \\approx '], ['$ und $c \\times q \\approx ', '$ et $c \\times q \\approx '], ['$ und $p \\times q \\approx ', '$ et $p \\times q \\approx '],
        // trigo: the words in the fractions
        ['\\text{Gegenkathete}', '\\text{côté opposé}'], ['\\text{Ankathete}', '\\text{côté adjacent}'], ['\\text{Hypotenuse}', '\\text{hypoténuse}'],
        // goldenerschnitt
        ['$\\overline{AB} = 10$ · größerer Teil $', '$AB = 10$ · grande partie $'], ['$ · kleinerer Teil $', '$ · petite partie $'],
        ['\\text{Ganzes}', '\\text{tout}'], ['\\text{größerer Teil}', '\\text{grande partie}'], ['\\text{kleinerer Teil}', '\\text{petite partie}'],
        [' $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $\\tfrac{d}{s} = \\Phi', ' $c$ et diagonale $d$ du pentagone régulier : $\\tfrac{d}{c} = \\Phi'],
        ['Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: ', 'Chaque diagonale est partagée par une autre selon la section dorée : '],
        ['$= \\Phi$, und der größere Teil ist genau so lang wie die Seite.', '$= \\Phi$, et la grande partie est exactement aussi longue que le côté.'],
    ],
    rule: [
        // book fr-11 mathe5-fr:
        // book fr-12 mathegy5-fr:
        // book fr-13 mathegy6-fr:
        // book fr-14 mathegy7-fr:
        // book fr-15 mathegy8-fr:
        // book fr-16 mathegy9-fr:
        // French school notation in the formulas the widgets write (Doc, 26.10.2026: always the local conventions), on every
        // page that loads this module - the GY 5-9 and OS 5 editions; BGY 11 and the round-2 books never load it.
        // × for the product, as js/buch-fr/gy5.js does: a phrase key that contains a product must therefore be written with \times
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // kreisteil: the arc length is ℓ ("Kreisbogen $b = \tfrac{\alpha}{360^\circ} …")
        [/(<\/span> )\$b = (?=\\tfrac\{\\alpha\}\{360\^\\circ\})/g, '$1$$\\ell = '],
        // surface area A (German O), lateral area A_L (German M, Mantel), base area 𝓑 (German G, Grundfläche): the formulas of
        // spitzkoerper and of koerper (js/buch-gleichungen.js, on the GY pages that load both modules)
        [/\$O = G \+ M/g, '$$A = \\mathcal{B} + A_L'],
        [/\$O = (?=2\\pi r\^2 \+ 2\\pi r h|\\pi r\^2 \+ \\pi r s|4 ?\\pi r\^2)/g, '$$A = '],
        [/\$M = (?=2\\pi r h|\\pi r s|4 \\times \\tfrac12 a)/g, '$$A_L = '],
        [/\$G = (?=a\^2|\\pi r\^2)/g, '$$\\mathcal{B} = '], [/\\tfrac13\\,G\\,h/g, '\\tfrac13\\,\\mathcal{B}\\,h'],
        // pythagoras: the area labels in the picture, c·q, c·p, p·q
        [/>([cp])·([pq])<\/text>/g, '>$1×$2</text>'],
        // vieleck: "Also $3{,}1… < \\pi < 3{,}2…$, Abstand $…$" (a rule with context instead of a bare piece 'Also $')
        [/Also \$([^$<]*) < \\pi < ([^$<]*)\$, Abstand \$/g, (m, lo, hi) => 'Donc $' + lo + ' < \\pi < ' + hi + '$, écart $'],
        // spitzkoerper and koerper: the slant height of the cone is g (génératrice) - after the rules for A and A_L above
        [/Mantellinie \$s = /g, 'Génératrice $$g = '], [/(\$A(?:_L)? = (?:\\pi r\^2 \+ )?\\pi r )s(?![a-zA-Z])/g, '$1g'],
        [/(<p style="margin:0;line-height:2">)\$s = (?=\\sqrt\{r\^2 \+ h\^2\})/g, '$1$$g = '],
        // spitzkoerper, the pyramid: apothème h_a (German h_s), arête latérale ℓ (German s)
        [/<p style="margin:0;line-height:2">\$h_s = [\s\S]*?<\/p>/g, m => m.replace(/h_s/g, 'h_a').replace('$s = \\sqrt{h^2', () => '$\\ell = \\sqrt{h^2')],
        // spitzkoerper, the labels in the picture: hₛ → hₐ, s → ℓ (pyramid) or g (cone)
        [/<svg viewBox="0 0 360 290" role="img" aria-label="(Quadratische Pyramide|Kreiskegel) im Schrägbild mit Hilfsdreieck">[\s\S]*?<\/svg>/g,
            (m, k) => m.replace(/>hₛ</g, '>hₐ<').replace(/>s<\/text>/g, k === 'Kreiskegel' ? '>g</text>' : '>ℓ</text>')],
        // goldenerschnitt: the golden rectangle ("Seiten $1{,}618 : 1$. …" and "Nach 5 Schnitten ist die lange Seite nur noch $…$ so lang. …")
        [/Seiten \$([^$]*) : 1\$\. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor \$\\Phi\$ verkleinert\./g,
            (m, r) => 'Côtés $' + r + ' : 1$. Si l’on retire le carré construit sur le petit côté, il reste de nouveau un rectangle d’or, réduit du facteur $\\Phi$.'],
        [/Nach (\d+) Schnitt(?:en)? ist die lange Seite nur noch \$([^$]*)\$ so lang\. Die Viertelkreise bilden die <b>goldene Spirale<\/b>\./g,
            (m, n, f) => 'Après ' + n + (n === '1' ? ' carré retiré' : ' carrés retirés') + ', le grand côté ne mesure plus que $' + f + '$ de sa longueur. Les quarts de cercle forment la <b>spirale d’or</b>.'],
        // goldenerschnitt, the pentagram: "grande partie</span> : <span …>petite partie" gets its no-break space
        [/(<\/span>) : (<span class="g-phi">)/g, '$1 : $2'],
    ]
});
