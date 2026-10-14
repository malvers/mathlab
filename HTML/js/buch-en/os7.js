/* js/buch-en/os7.js — English for the widgets of js/buch-os7.js.
 * Loaded by the English editions right after js/buch-os7.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // the names of the tilings (parkettos7), the materials (dichteos7) and the quadrants (quadrantos7), used by the rules below
    const TILING = { 'Dreiecke': 'Triangles', 'Quadrate': 'Squares', 'Sechsecke': 'Hexagons', 'Fünfecke': 'Pentagons',
        'Achtecke und Quadrate': 'Octagons and squares', 'Sechsecke und Dreiecke': 'Hexagons and triangles' };
    const MATERIAL = { 'Holz': 'wood', 'Fichtenholz': 'spruce wood', 'Eis': 'ice', 'Aluminium': 'aluminium', 'Eisen': 'iron', 'Gold': 'gold' };
    window.BuchEN && BuchEN.add('os7', {
        word: {
            // titelbildos7
            'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm':
                'Cover: a hundred square with 25 lit cells, a tiling of hexagons, a number line from minus 3 to 3, a prism and a pie chart',
            // tageszinsos7
            'Kapital $K$': 'Capital $K$', 'Zinssatz $p\\,\\%$': 'Interest rate $p\\,\\%$', 'Tage $t$': 'Days $t$', 'Jahr': 'Year', '360 Tage': '360 days',
            'Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.':
                'At banks an interest year usually has 360 days and every month 30 days. Rounding to whole cents only happens at the end.',
            // dichteos7 (Holz as in os10, Stoff as in gy7)
            'Holz': 'Wood', 'Eis': 'Ice', 'Aluminium': 'Aluminium', 'Eisen': 'Iron', 'Gold': 'Gold', 'Stoff': 'Material',
            'Länge $a$': 'Length $a$', 'Breite $b$': 'Width $b$', 'Höhe $c$': 'Height $c$',
            // quadrantos7
            'nur P': 'only P', 'an der x-Achse': 'in the x-axis', 'an der y-Achse': 'in the y-axis', 'am Ursprung': 'in the origin', 'Spiegeln': 'Reflect',
            'An der x-Achse ändert die y-Koordinate ihr Vorzeichen.': 'Reflecting in the x-axis changes the sign of the y-coordinate.',
            'An der y-Achse ändert die x-Koordinate ihr Vorzeichen.': 'Reflecting in the y-axis changes the sign of the x-coordinate.',
            'Am Ursprung ändern beide Koordinaten ihr Vorzeichen.': 'Reflecting in the origin changes the sign of both coordinates.',
            'Ziehe P. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).':
                'Drag P. First comes the x-coordinate (to the right or left), then the y-coordinate (up or down).',
            // parkettos7 (the four single names as in gy7)
            'Dreiecke': 'Triangles', 'Quadrate': 'Squares', 'Sechsecke': 'Hexagons', 'Fünfecke': 'Pentagons',
            'Achtecke und Quadrate': 'Octagons and squares', 'Sechsecke und Dreiecke': 'Hexagons and triangles', 'Parkett': 'Tiling',
            'Ein Parkett bedeckt die Ebene ohne Lücken und ohne Überlappung. Das geht nur, wenn die Winkel an jeder Ecke zusammen genau $360^\\circ$ ergeben. Mit nur einer Sorte regelmäßiger Vielecke klappt das bei Dreiecken, Quadraten und Sechsecken.':
                'A tiling covers the plane without gaps and without overlaps. That only works if the angles at every vertex add up to exactly $360^\\circ$. With only one kind of regular polygon it works for triangles, squares and hexagons.',
            // escheros7
            'Parkett aus einer verformten Quadratkachel': 'Tiling made of a deformed square tile',
            'Ziehe den <b>roten</b> Punkt: Die linke Kante biegt sich, die rechte Kante macht genau dieselbe Form. Ziehe den <b>lila</b> Punkt: Unten und oben ändern sich gemeinsam.':
                'Drag the <b>red</b> point: the left edge bends, and the right edge takes exactly the same shape. Drag the <b>purple</b> point: the bottom and the top change together.',
            'Was auf einer Seite weggenommen wird, kommt auf der gegenüberliegenden Seite dazu. Darum hat die Kachel immer denselben Flächeninhalt wie das Quadrat – und sie füllt die Ebene lückenlos.':
                'What is taken away on one side is added on the opposite side. That is why the tile always has the same area as the square – and it fills the plane without gaps.',
            'So arbeitete M. C. Escher: Er veränderte Kanten eines Vielecks, verschob oder drehte die Änderung auf eine andere Kante und malte in die Kachel ein Tier.':
                'This is how M. C. Escher worked: he changed edges of a polygon, moved or turned the change onto another edge and painted an animal into the tile.'
        },
        phrase: [
            // tageszinsos7
            ['Jahreszinsen: ', 'Interest for the year: '],
            // dichteos7
            ['Volumen: ', 'Volume: '], ['Masse: ', 'Mass: '],
            ['Die Dichte ist kleiner als die von Wasser (', 'The density is less than that of water ('], ['): Der Körper schwimmt.', '): the solid floats.'],
            ['Die Dichte ist größer als die von Wasser (', 'The density is greater than that of water ('], ['): Der Körper geht unter.', '): the solid sinks.'],
            // quadrantos7
            ['Spiegelpunkt: ', 'Image point: '],
            // parkettos7: the angles at one vertex
            ['An einer Ecke: ', 'At one vertex: '], ['6 Dreiecke: ', '6 triangles: '], ['4 Quadrate: ', '4 squares: '], ['3 Sechsecke: ', '3 hexagons: '],
            ['3 Fünfecke: ', '3 pentagons: '], [' – es bleibt eine Lücke von ', ' – leaving a gap of '], ['. 4 Fünfecke: ', '. 4 pentagons: '], [', das ist zu viel.', ', that is too much.'],
            ['2 Achtecke und 1 Quadrat: ', '2 octagons and 1 square: '], ['2 Sechsecke und 2 Dreiecke: ', '2 hexagons and 2 triangles: ']
        ],
        rule: [
            // tageszinsos7: "90 Tage", "1 Tag" on the slider and in the picture, "für $90$ Tage:", the label of the picture
            [/^1 Tag$/, '1 day'], [/^(\d+) Tage$/, '$1 days'], [/>1 Tag</g, '>1 day<'], [/>(\d+) Tage</g, '>$1 days<'],
            [/für \$(\d+)\$ (Tag|Tage): /, (m, t, w) => 'for $' + t + '$ ' + (w === 'Tag' ? 'day' : 'days') + ': '],
            [/Zinsjahr mit 360 Tagen, davon (\d+) Tage; Jahreszinsen und Tageszinsen als Säulen/,
                (m, t) => 'Interest year of 360 days, ' + t + (t === '1' ? ' day' : ' days') + ' of it; interest for the year and for the days as bars'],
            // money: "72.00 €" (fmt writes the decimal point on English pages) → "€72.00", as in os10
            [/(?<![\d.,])(\d+(?:\.\d{2})?)[  ]€/g, '€$1'],
            // dichteos7: the label of the picture and the density sentence
            [/Quader aus (\S+), (\d+) cm mal (\d+) cm mal (\d+) cm/, (m, s, a, b, c) => 'Cuboid of ' + (MATERIAL[s] || s) + ', ' + a + ' cm by ' + b + ' cm by ' + c + ' cm'],
            [/Dichte von (Fichtenholz|Eis|Aluminium|Eisen|Gold): /, (m, s) => 'Density of ' + MATERIAL[s] + ': '],
            // quadrantos7: "P(3 | 2)" in the label, "liegt im I. Quadranten"
            [/Koordinatensystem mit vier Quadranten, Punkt P\((-?\d+) \| (-?\d+)\)/, 'Coordinate system with four quadrants, point P($1, $2)'],
            [/\$ liegt (im|auf)/, '$ lies $1'], [/im (I|II|III|IV)\. Quadranten/g, 'in quadrant $1'], [/auf einer Achse/g, 'on an axis'],
            // parkettos7: the name of the tiling as the title and in the label of the picture
            [/(<p style="margin:0"><b>)([^<]+)(<\/b><\/p><p style="margin:8px 0 0">An einer Ecke)/, (m, a, n, b) => a + (TILING[n] || n) + b],
            [/^Parkett: (.+)$/, (m, n) => 'Tiling: ' + (TILING[n] || n).toLowerCase()]
        ]
    });
})();
