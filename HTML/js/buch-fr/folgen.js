/* js/buch-fr/folgen.js — French for the widgets of js/buch-folgen.js.
 * Loaded by the French editions right after js/buch-folgen.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/folgen.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('folgen', {
    word: {
        // book fr-6 mathegy10-fr:
        // folge (the sequences SEQ and LIM are helpers of the module, reported for every page that loads it)
        'arithmetisch': 'arithmétique', 'geometrisch': 'géométrique', 'alternierend': 'alternée', 'Heron (√2)': 'Héron (√2)', 'Folge': 'Suite',
        'Anzahl der Glieder': 'Nombre de termes', 'Glieder einer Zahlenfolge als Punkte': 'Termes d’une suite représentés par des points',
        'explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.': 'explicite : pas de formule simple, la suite est définie <b>par récurrence</b>.',
        // epsilonschlauch
        'Breite $\\varepsilon$ des Schlauchs': 'Largeur $\\varepsilon$ de la bande', 'Folgenglieder und ein Streifen um den Grenzwert': 'Termes de la suite et une bande autour de la limite',
        // kreisparameter
        'Kreis': 'Cercle', 'Ellipse (Ausblick)': 'Ellipse (perspective)', 'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t': 'Un point parcourt un cercle, piloté par le paramètre t',
        'Parameter $t$ (Winkel)': 'Paramètre $t$ (angle)', 'Radius $r$': 'Rayon $r$', 'Halbachse $a$': 'Demi-axe $a$', 'Halbachse $b$': 'Demi-axe $b$',
        'Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.':
            'Avec deux demi-axes différents, le cercle est étiré dans une direction : une <b>ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. C’est ainsi que les planètes tournent autour du Soleil.',
    },
    phrase: [
        // book fr-6 mathegy10-fr:
        // folge: "<b>Monotonie:</b> streng monoton …" - the cells begin with <b>, so they are pieces, not whole labels
        ['explizit: $', 'explicite : $'], ['rekursiv: $', 'par récurrence : $'],
        ['<b>Monotonie:</b> ', '<b>Sens de variation :</b> '], ['<b>Schranken:</b> ', '<b>Bornes :</b> '], ['<b>Grenzwert:</b> ', '<b>Limite :</b> '],
        ['streng monoton <b>steigend</b>: $a_{n+1} - a_n = 3 > 0$', 'strictement <b>croissante</b>, car $a_{n+1} - a_n = 3 > 0$'],
        ['nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', 'minorée ($a_n \\geq 2$), <b>non</b> majorée'],
        ['kein Grenzwert: Die Glieder wachsen über jede Grenze.', 'aucune, les termes dépassent toute borne.'],
        ['streng monoton <b>fallend</b>: $\\tfrac{a_{n+1}}{a_n} = 0{,}5 < 1$', 'strictement <b>décroissante</b>, car $\\tfrac{a_{n+1}}{a_n} = 0{,}5 < 1$'],
        ['beschränkt: $0 < a_n \\leq 8$', 'bornée, $0 < a_n \\leq 8$'], ['Grenzwert $0$', '$0$'],
        ['streng monoton <b>fallend</b>: $\\tfrac1n$ wird immer kleiner', 'strictement <b>décroissante</b>, car $\\tfrac1n$ devient de plus en plus petit'],
        ['beschränkt: $1 < a_n \\leq 2$', 'bornée, $1 < a_n \\leq 2$'], ['Grenzwert $1$', '$1$'],
        ['<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', '<b>non</b> monotone, car le signe change à chaque terme'],
        ['beschränkt: $-1 \\leq a_n \\leq \\tfrac12$', 'bornée, $-1 \\leq a_n \\leq \\tfrac12$'], ['Grenzwert $0$, von beiden Seiten abwechselnd', '$0$, approchée alternativement des deux côtés'],
        ['ab dem zweiten Glied streng monoton <b>steigend</b>', 'strictement <b>croissante</b> à partir du deuxième terme'], ['nach oben <b>nicht</b> beschränkt', '<b>non</b> majorée'],
        ['kein Grenzwert. Aber die Quotienten $\\tfrac{a_{n+1}}{a_n}$ nähern sich dem goldenen Schnitt $1{,}618\\ldots$', 'aucune. Mais les quotients $\\tfrac{a_{n+1}}{a_n}$ se rapprochent du nombre d’or $1{,}618\\ldots$'],
        ['ab dem zweiten Glied streng monoton <b>fallend</b>', 'strictement <b>décroissante</b> à partir du deuxième terme'], ['beschränkt: $1 \\leq a_n \\leq 1{,}5$', 'bornée, $1 \\leq a_n \\leq 1{,}5$'],
        ['Grenzwert $\\sqrt2 \\approx 1{,}414214$, schon $a_5$ stimmt auf elf Nachkommastellen', '$\\sqrt2 \\approx 1{,}414214$ ; dès $a_5$, onze décimales sont justes'],
        // epsilonschlauch (the sentence with the number of terms outside: rule below)
        ['$ hat den Grenzwert $g = ', '$ a pour limite $g = '], ['$. Schlauch: $', '$. Bande : $'], ['Ab $n_0 = ', 'À partir de $n_0 = '],
        ['. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.',
            '. Rends $\\varepsilon$ plus petit : $n_0$ devient plus grand, mais il en existe <b>toujours</b> un. C’est exactement ce que signifie « limite ».'],
        // kreisparameter ("Probe: $" and "$ im Bogenmaß · " are in js/buch-fr/funktionen.js)
        ['$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.', '$. Chaque valeur de $t$ donne un point situé exactement à la distance $r$ du centre.'],
    ],
    rule: [
        // book fr-6 mathegy10-fr:
        // epsilonschlauch: "$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor liegen 5 außerhalb." (or "keines außerhalb")
        [/\$ liegen <b>alle<\/b> weiteren Glieder im Schlauch, davor (?:liegen (\d+) außerhalb|keines außerhalb)\./g,
            (m, k) => '$, <b>tous</b> les termes suivants sont dans la bande' + (!k ? ', aucun n’est en dehors avant.' : k === '1' ? ', le premier est en dehors.' : ', les ' + k + ' premiers sont en dehors.')],
    ]
});
