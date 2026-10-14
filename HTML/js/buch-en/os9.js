/* js/buch-en/os9.js — English for the widgets of js/buch-os9.js.
 * Loaded by the English editions right after js/buch-os9.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('os9', {
    word: {
        // titelbildos9
        'Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel':
            'Cover: a right triangle with squares on its sides, the parabola of a throw, a cone and a sphere',
        // steigungos9
        'Steigung in Prozent': 'Gradient in percent', '100 m waagerecht': '100 m horizontally',
        '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.': '100% is exactly $45^\\circ$: the road goes up as far as it goes forward.',
        'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.':
            'More than 100% is steeper than $45^\\circ$; only stairs and mountain railways are that steep.',
        'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.':
            'The percentage does not grow at the same rate as the angle: double the percentage is not double the angle.',
        // parabelos9
        'Streckfaktor $a$': 'Stretch factor $a$', 'Verschiebung $c$': 'Shift $c$',
        '$d$ (nach links, wenn positiv)': '$d$ (to the left if positive)', '$e$ (nach oben, wenn positiv)': '$e$ (upwards if positive)',
        'Graph einer quadratischen Funktion mit Scheitelpunkt': 'Graph of a quadratic function with its vertex',
        // quadglos9
        'Drei Parabeln mit zwei, einer und keiner Nullstelle': 'Three parabolas with two zeros, one zero and no zero',
        'Parabel y = x² + p x + q mit ihren Nullstellen': 'Parabola y = x² + p x + q with its zeros',
        // kugelos9
        'Radius gegeben': 'Radius given', 'Volumen gegeben': 'Volume given', 'Gegeben': 'Given', 'Volumen $V$': 'Volume $V$',
        'Eine Kugel in einem Zylinder, der genau um sie passt': 'A sphere in a cylinder that fits exactly around it',
        'Oberfläche': 'Surface area', 'Volumen': 'Volume', 'Zylinder darum': 'Cylinder around it',
        'Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.':
            'The sphere always fills exactly $\\tfrac{2}{3}$ of the cylinder that fits around it. Archimedes discovered this.',
        // turmos9
        'Turm: Zylinder + Kegel': 'Tower: cylinder + cone', 'Silo: Zylinder + Halbkugel': 'Silo: cylinder + hemisphere', 'Körper': 'Solid',
        'Höhe des Zylinders $h$': 'Height of the cylinder $h$', 'Höhe des Kegels $h_K$': 'Height of the cone $h_K$',
        'Turm aus einem Zylinder mit einem Kegeldach': 'Tower made of a cylinder with a conical roof',
        'Silo aus einem Zylinder mit einer Halbkugel als Dach': 'Silo made of a cylinder with a hemisphere as its roof',
        'Zylinder': 'Cylinder', 'Kegel': 'Cone', 'Halbkugel': 'Hemisphere', 'Mantellinie': 'Slant height',
        'Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.':
            'Only the outer faces belong to the surface area: the top circle of the cylinder lies inside and does not count.',
        // spannweiteos9
        'Ausreißer zu A (5,8 m)': 'Outlier for A (5.8 m)', 'Ausreißer weg': 'Remove outlier', 'Streuung von B': 'Spread of B',
        'GRUPPE A': 'GROUP A', 'GRUPPE B': 'GROUP B',
        'kleinster Wert': 'smallest value', 'größter Wert': 'largest value', 'Spannweite': 'Range', 'Mittelwert': 'Mean', 'Zentralwert': 'Median',
        'Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite': 'Long jumps of two groups with mean and range',
        'Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.':
            'White line: mean. The bracket below the dots reaches from the smallest to the largest value, its length is the range. Made-up values.',
        // fibonaccios9
        'Anzahl der Fibonacci-Zahlen $n$': 'Number of Fibonacci numbers $n$', 'Quotient': 'Quotient', 'Wert': 'Value',
        'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618': 'Quotients of neighbouring Fibonacci numbers approach the number 1.618',
        'Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.':
            'Every number is the sum of the two before it. The quotients jump alternately above and below the green line $\\Phi \\approx 1.618$ and get closer and closer to it.',
        // abstandos9
        'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse': 'Two movable points and their distance as the hypotenuse',
        'Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.':
            'The line segment is the hypotenuse of a right triangle, the legs run parallel to the axes.',
        // umkehros9
        'Seite $a$': 'Side $a$', 'Seite $b$': 'Side $b$', 'Seite $c$': 'Side $c$',
        'Kein Dreieck möglich': 'No triangle possible', 'Aus diesen Seiten entsteht kein Dreieck.': 'These sides do not make a triangle.',
        'Zwei Seiten zusammen müssen länger sein als die dritte.': 'Any two sides together must be longer than the third.',
        'Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.':
            'Equal: by the converse of Pythagoras’ theorem the triangle has a right angle at $C$.',
        'Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.': 'Whole numbers with $a^2 + b^2 = c^2$ are called Pythagorean triples.',
        // rwdreieckos9
        'Winkel $\\alpha$': 'Angle $\\alpha$',
        'Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.': 'The leg $a$ must be shorter than the hypotenuse $c$.',
        'Rechtwinkliges Dreieck mit dem rechten Winkel bei C': 'Right triangle with the right angle at C',
        'Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.':
            'The opposite side of $\\alpha$ is $a$, the adjacent side is $b$, the hypotenuse is $c$. The calculator is set to DEG.',
        // dachos9
        'Hausbreite $b$': 'Width of the house $b$', 'Dachneigung $\\alpha$': 'Pitch of the roof $\\alpha$', 'Hauslänge $l$': 'Length of the house $l$',
        'Firsthöhe': 'Height of the ridge', 'Sparrenlänge': 'Length of the rafters',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'The height divides the gable into two equal right triangles. Roof overhangs are not included here.'
    },
    phrase: [
        // steigungos9: "$12\,\%$ Steigung: auf 100 m waagerecht 12 m höher, also $\tan\alpha = …$" and the angle under it
        ['$ Steigung: auf 100 m waagerecht ', '$ gradient: over 100 m horizontally '], [' m höher, also ', ' m higher, so '],
        ['Steigungswinkel: ', 'Angle of inclination: '],
        // parabelos9: the sentences under the graph
        [' · Scheitelpunkt ', ' · vertex '], ['(weiß)', '(white)'], ['Quadratische Ergänzung: ', 'Completing the square: '],
        ['Die Parabel ist nach oben geöffnet und ', 'The parabola opens upwards and is '], ['Die Parabel ist nach unten geöffnet und ', 'The parabola opens downwards and is '],
        ['so weit wie die Normalparabel', 'as wide as the standard parabola'], ['enger als die Normalparabel (gestreckt)', 'narrower than the standard parabola (stretched)'],
        ['weiter als die Normalparabel (gestaucht)', 'wider than the standard parabola (compressed)'],
        ['. Der Scheitelpunkt ist ein <b>Minimum</b>.', '. The vertex is a <b>minimum</b>.'], ['. Der Scheitelpunkt ist ein <b>Maximum</b>.', '. The vertex is a <b>maximum</b>.'],
        ['Wertebereich: ', 'Range: '], ['Fallend für ', 'Decreasing for '], ['Steigend für ', 'Increasing for '],
        ['steigend für ', 'increasing for '], ['fallend für ', 'decreasing for '],
        ['Nullstellen (türkis): ', 'Zeros (turquoise): '], ['genau eine, ', 'exactly one, '], ['keine, die Parabel trifft die x-Achse nicht', 'none, the parabola does not meet the x-axis'],
        [': Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.', ': for $a = 0$ the graph is no longer a parabola but a horizontal line.'],
        // quadglos9: the equation, the formula and the number of solutions
        ['$ &nbsp; mit $p = ', '$ &nbsp; with $p = '],
        ['<b>Zwei Lösungen</b>, weil die Diskriminante ', '<b>Two solutions</b>, because the discriminant is '], [' &gt; 0$ ist: ', ' &gt; 0$: '],
        ['<b>Genau eine Lösung</b>, weil $D = 0$ ist: ', '<b>Exactly one solution</b>, because $D = 0$: '],
        ['. Der Scheitelpunkt liegt auf der x-Achse.', '. The vertex lies on the x-axis.'],
        ['<b>Keine Lösung</b>, weil ', '<b>No solution</b>, because '],
        [' &lt; 0$ ist: Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.',
            ' &lt; 0$: you cannot take the square root of a negative number. The parabola lies entirely above the x-axis.'],
        // dachos9: the table cell (vektoren.js has the word "Dachfläche" as "roof surface")
        ['Dachfläche', 'Roof area'],
        // fibonaccios9
        ['Fibonacci-Zahlen: ', 'Fibonacci numbers: '],
        // umkehros9
        ['$ und $c^2 = ', '$ and $c^2 = '],
        ['Nicht gleich: Der Winkel bei $C$ ist kleiner als ', 'Not equal: the angle at $C$ is smaller than '],
        ['Nicht gleich: Der Winkel bei $C$ ist größer als ', 'Not equal: the angle at $C$ is larger than '], [', nämlich etwa ', ', namely about '],
        // rwdreieckos9: the choice of what is given ("$c$ und $\alpha$")
        ['$ und $', '$ and $']
    ],
    rule: [
        // aria labels with a number in the middle
        [/^Steigungsdreieck einer Straße mit (\d+) Prozent Steigung$/, 'Gradient triangle of a road with a $1 percent gradient'],
        [/^Dreieck mit den Seiten (\d+), (\d+) und (\d+)$/, 'Triangle with the sides $1, $2 and $3'],
        [/^Querschnitt eines Satteldachs mit Neigung (\d+) Grad$/, 'Cross-section of a gable roof with a pitch of $1 degrees']
    ]
});
