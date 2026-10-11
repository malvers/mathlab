/* js/buch-en/gy12lk.js — English for the widgets of js/buch-gy12lk.js:
 *   titelbildgy12lk, normalverteilung, moivre, rotation, integralfunktion, hesse2d, simpson, abstand3d, uneigentlich (book 7, mathegy12lk-en)
 * Loaded by the English editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gy12lk', {
    word: {
        // titelbildgy12lk
        'Titelbild: ein Rotationskörper mit Kreisscheiben, ein Binomialhistogramm unter der Glockenkurve, zwei windschiefe Geraden mit ihrem kürzesten Verbindungsstück':
            'Cover picture: a solid of revolution with circular slices, a binomial histogram under the bell curve, two skew lines with their shortest connecting segment',
        // normalverteilung
        'Erwartungswert $\\mu$': 'Expected value $\\mu$', 'Standardabweichung $\\sigma$': 'Standard deviation $\\sigma$', '$\\sigma$-Regeln': '$\\sigma$ rules',
        'Was wird berechnet?': 'What is calculated?', 'Dichte': 'Density', 'Verteilungsfunktion': 'Distribution function', 'Ansicht': 'View',
        'Dichtefunktion der Normalverteilung mit markierter Fläche': 'Density function of the normal distribution with a marked area',
        // moivre
        'Anzahl der Versuche $n$': 'Number of trials $n$', 'Trefferwahrscheinlichkeit $p$': 'Probability of a hit $p$', 'Histogramm': 'Histogram', 'standardisiert': 'standardised',
        'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung':
            'Histogram of the binomial distribution with the bell curve of the same expected value and standard deviation',
        'erfüllt': 'met', 'nicht erfüllt': 'not met',
        // rotation
        'Kegel': 'Cone', 'Kugel': 'Sphere', 'Paraboloid': 'Paraboloid', 'Fass': 'Barrel', 'Welcher Körper?': 'Which solid?', 'Kreisscheiben $n$': 'Circular slices $n$', 'aus': 'off', 'Ziehen zum Drehen': 'Drag to turn',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Solid of revolution in a three-dimensional coordinate system, turn it by dragging',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Switch on circular slices: every slice has the volume $\\pi \\, r^2 \\, \\Delta x$ with $r = f(x)$.',
        // integralfunktion, uneigentlich
        'Welche Funktion?': 'Which function?', 'untere Grenze $a$': 'lower limit $a$', 'obere Grenze $b$': 'upper limit $b$', 'Grenze': 'Limit',
        'Graph von f mit der Fläche von a bis x': 'Graph of f with the area from a to x', 'Graph der Integralfunktion mit Tangente': 'Graph of the integral function with tangent',
        '1/√x bei 0': '1/√x at 0', 'Fläche unter einer Kurve bis zu einer verschiebbaren Grenze': 'Area under a curve up to a limit you can move',
        // hesse2d
        'Richtung des Normalenvektors': 'Direction of the normal vector',
        'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade': 'Line with unit normal vector, a point P and its perpendicular to the line',
        // simpson
        'Anzahl der Streifen $n$ (gerade)': 'Number of strips $n$ (even)', 'Graph mit Parabelbögen über je zwei Streifen': 'Graph with parabolic arcs over every two strips',
        'Trapez': 'Trapezium',
        // abstand3d
        'Das 3D-Modul fehlt.': 'The 3D module is missing.', 'Beispiel 1': 'Example 1', 'Beispiel 2': 'Example 2', 'P auf g': 'P on g',
    },
    phrase: [
        // normalverteilung
        ['$ mit $\\mu = ', '$ with $\\mu = '], ['$ und $\\sigma = ', '$ and $\\sigma = '],
        ['Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.', 'Standardising: $Z = \\dfrac{X - \\mu}{\\sigma}$ has the standard normal distribution.'],
        ['. Das ist die gelbe Fläche.', '. That is the yellow area.'], ['. Das ist der gelbe Anstieg der Verteilungsfunktion.', '. That is the yellow rise of the distribution function.'],
        // moivre
        ['Erwartungswert $\\mu = n', 'Expected value $\\mu = n'], ['$, Standardabweichung $\\sigma = \\sqrt{', '$, standard deviation $\\sigma = \\sqrt{'],
        ['Laplace-Bedingung $\\sigma > 3$: ', 'Laplace condition $\\sigma > 3$: '],
        ['Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.',
            'Standardised: every bar is shifted by $\\mu$, its width divided by $\\sigma$ and its height multiplied by $\\sigma$. For large $n$ all histograms lie on the same curve $\\varphi$.'],
        ['Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $', 'Largest deviation between $P(X = k)$ and the bell curve at $k$: $'],
        // rotation
        ['$ auf $[', '$ on $['], [']$ dreht sich um die $x$-Achse: ', ']$ rotates about the $x$-axis: '], ['Summe der ', 'Sum of the '],
        [' Kreisscheiben (Radius in der Mitte jedes Streifens): $', ' circular slices (radius in the middle of each strip): $'], ['$, Abweichung $', '$, deviation $'],
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x to the left of a: the integral counts backwards)'], ['An der Stelle $x = ', 'At $x = '],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'The pink tangent to $I$ has the gradient $'], ['$, und das ist genau $f(', '$, and that is exactly $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. That is the fundamental theorem: $I_a\'(x) = f(x)$.'],
        // hesse2d
        ['Hessesche Normalform: $', 'Hesse normal form: $'], ['mit $|\\vec n_0| = 1$.', 'with $|\\vec n_0| = 1$.'], ['Punkt einsetzen: $', 'Substitute the point: $'],
        ['Abstand $d(P, g) \\approx ', 'Distance $d(P, g) \\approx '], ['P liegt auf der Geraden.', 'P lies on the line.'],
        ['Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.', 'Positive: P lies on the side that $\\vec n_0$ points to.'], ['Negativ: P liegt auf der anderen Seite.', 'Negative: P lies on the other side.'],
        // simpson
        ['$. Simpson mit $n = ', '$. Simpson with $n = '],
        ['Doppelt so viele Streifen: Trapezfehler etwa durch $', 'Twice as many strips: trapezium error divided by about $'], ['$, Simpsonfehler etwa durch $', '$, Simpson error by about $'],
        ['$ geteilt. ', '$. '],
        ['Abbruchregel „zwei Simpson-Werte unterscheiden sich um weniger als $10^{-6}$“: ', 'Stopping rule “two Simpson values differ by less than $10^{-6}$”: '],
        ['erfüllt ab $n = ', 'met from $n = '], ['erst sehr spät erfüllt.', 'met only very late.'],
        // abstand3d
        ['Lotfußpunkt: $\\big(', 'Foot of the perpendicular: $\\big('], ['$ gibt $t = ', '$ gives $t = '], ['$, also $F(', '$, so $F('], [')$ und $d(P, g) = ', ')$ and $d(P, g) = '],
        ['Kontrolle mit dem Vektorprodukt: $', 'Check with the cross product: $'], ['. $P$ liegt auf $g$.', '. $P$ lies on $g$.'],
        ['$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ', '$: the lines are parallel. Then their distance is the distance of the point $Q$ from $g$: $d '],
        [', sie sind identisch.', ', they are identical.'],
        ['$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ', '$ is perpendicular to both lines, $|\\vec{n}| '],
        ['. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(', '. Distance $0$: the lines <b>intersect</b> at $S('],
        ['. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(', '. <b>Skew</b>; the shortest connecting segment (pink) joins $F('], [')$ und $G(', ')$ and $G('],
        // uneigentlich
        [' (die Grenze liegt weit rechts außerhalb des Bildes)', ' (the limit lies far to the right, outside the picture)'], ['Grenzwert: $', 'Limit: $'],
        [': Die Fläche ist unbegrenzt, obwohl der Graph sich der Achse nähert.', ': the area is unbounded, although the graph approaches the axis.'],
        [': Die unbegrenzte Fläche hat einen endlichen Inhalt.', ': the unbounded area has a finite size.'],
    ],
    rule: [
        // normalverteilung: N(\mu;\ \sigma^2) → N(\mu, \sigma^2)
        [/N\(\\mu;\\ \\sigma\^2\)/g, 'N(\\mu, \\sigma^2)'],
        // rotation: [0;\ 4] → [0, 4] · abstand3d (also without js/buch-en/vektoren.js): F(1 \mid 2 \mid 3) → F(1, 2, 3)
        [/\[(-?[\d.]+);\\ (-?[\d.]+)\]/g, '[$1, $2]'],
        [/\((-?[\d.]+) \\mid (-?[\d.]+) \\mid (-?[\d.]+)\)/g, '($1, $2, $3)'],
    ]
});
