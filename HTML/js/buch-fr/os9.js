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
        'Firsthöhe': 'Hauteur du faîtage', 'Sparrenlänge': 'Longueur des chevrons', 'Dachfläche': 'Surface du toit',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'La hauteur partage le pignon en deux triangles rectangles identiques. Les débords du toit ne sont pas comptés ici.',
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
    ]
});
