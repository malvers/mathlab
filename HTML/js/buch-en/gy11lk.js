/* js/buch-en/gy11lk.js — English for the widgets of js/buch-gy11lk.js:
 *   titelbildgy11lk, epsdelta, stetigkeit, linapprox, ablnachdef, produktregel, randextrema, drehraum, verflechtung, rettung, fixpunkt
 *   (book 9, mathegy11lk-en)
 * Loaded by the English editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('gy11lk', {
    word: {
        // titelbildgy11lk
        'Titelbild: eine Kurve mit Tangente, der Epsilon-Delta-Streifen um einen Punkt und eine Fixpunktiteration als Spinnennetz':
            'Cover picture: a curve with its tangent, the epsilon-delta strip around a point and a fixed-point iteration as a cobweb',
        // epsdelta
        'x² bei 1': 'x² at 1', '(x² − 4)/(x − 2) bei 2': '(x² − 4)/(x − 2) at 2', 'sin x / x bei 0': 'sin x / x at 0', '√x bei 4': '√x at 4', 'Sprung bei 0': 'Jump at 0',
        'Streifenbreite $\\varepsilon$': 'Strip width $\\varepsilon$',
        'Graph mit einem waagerechten Streifen der Breite Epsilon um den Grenzwert und einem senkrechten Streifen der Breite Delta um die Stelle':
            'Graph with a horizontal strip of width epsilon around the limit and a vertical strip of width delta around the point',
        // stetigkeit
        'zwei Parabel- und Geradenstücke': 'Parabola and line pieces', 'Gerade und Wurzel': 'Line and root', 'Lücke füllen': 'Filling the gap',
        'Funktionswert $b$ an der Stelle 1': 'Function value $b$ at the point 1',
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Piecewise-defined function with a joining point',
        // linapprox
        'eˣ bei 0': 'eˣ at 0', 'sin x bei 0': 'sin x at 0', 'ln x bei 1': 'ln x at 1',
        'Ausschnitt: halbe Breite $r$': 'Window: half-width $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Graph of a function and its tangent in a window that can be made smaller',
        // ablnachdef
        'Basis $a$': 'Base $a$', 'Schrittweite $h = 10^{-k}$': 'Step size $h = 10^{-k}$', '$a = e$ setzen': 'Set $a = e$', 'Tangente': 'Tangent',
        'Graph von a hoch x mit Sekante durch (0|1) und Tangente': 'Graph of a to the power x with the secant through (0, 1) and the tangent',
        // produktregel
        'Zuwachs $h$ von $x$': 'Increase $h$ of $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Rectangle with the sides u and v and its increase made of two strips and a corner',
        // randextrema
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Graph of a function with an interval and its local and global extrema',
        'linker Rand $a$': 'left end $a$', 'rechter Rand $b$': 'right end $b$',
        'lokales Maximum': 'local maximum', 'lokales Minimum': 'local minimum', 'Rand': 'end point', 'Art': 'Kind',
        'Globales Maximum': 'Global maximum', 'globales Minimum': 'global minimum',
        // drehraum
        'Dieses Bild braucht js/buch-vektoren.js.': 'This picture needs js/buch-vektoren.js.',
        'Drehachse:': 'Axis of rotation:', 'Drehachse': 'Axis of rotation', 'x-Achse': 'x-axis', 'y-Achse': 'y-axis', 'z-Achse': 'z-axis',
        'Drehwinkel $\\varphi$': 'Angle of rotation $\\varphi$',
        'Ein Haus wird im Raum um eine Koordinatenachse gedreht': 'A house is rotated in space about a coordinate axis',
        // verflechtung (the names as in the text of chapter 2: cocoa, sugar, milk, dark and milk chocolate, units)
        'Kakao': 'Cocoa', 'Zucker': 'Sugar', 'Milch': 'Milk', 'Zartbitter': 'Dark chocolate', 'Vollmilch': 'Milk chocolate',
        'Tafeln „Classic“ $e_1$': 'Bars of “Classic” $e_1$', 'Boxen „Mix“ $e_2$': 'Boxes of “Mix” $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Gozinto graph: three raw materials, two intermediate products, two final products, the quantities needed on the arrows',
        // rettung
        'Tempo im Sand $v_1$ (m/s)': 'Speed on the sand $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Speed in the water $v_2$ (m/s)', 'Wasser': 'Water',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Beach and water: the lifeguard’s path from A via the point P on the water line to the swimmer B',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'The time T as a function of the point x at which she goes into the water',
        // fixpunkt
        'Funktion φ': 'Function φ', 'Nächster Schritt': 'Next step', '10 Schritte': '10 steps',
        'Fixpunktiteration: Spinnennetz zwischen dem Graphen von φ und der Geraden y = x': 'Fixed-point iteration: cobweb between the graph of φ and the line y = x'
    },
    phrase: [
        // epsdelta
        ['\\text{ rechts, } ', '\\text{ on the right, } '], ['\\text{ links, also } ', '\\text{ on the left, so } '],
        ['$, Behauptung: $', '$, claim: $'], ['$. Orange: alle $y$ mit $|y - ', '$. Orange: all $y$ with $|y - '],
        ['Blau: Für alle $x \\neq ', 'Blue: for all $x \\neq '], ['$ mit $|x - ', '$ with $|x - '],
        ['| < \\delta$ liegt $f(x)$ im orangen Streifen. Das größte passende $\\delta$ ist hier etwa ', '| < \\delta$, $f(x)$ lies in the orange strip. The largest $\\delta$ that works here is about '],
        [' (exakt: $', ' (exact: $'],
        ['. Mach $\\varepsilon$ kleiner: Es gibt immer noch ein $\\delta > 0$. Genau das heißt „Grenzwert“.', '. Make $\\varepsilon$ smaller: there is still a $\\delta > 0$. That is exactly what “limit” means.'],
        ['Kein $\\delta$ passt:', 'No $\\delta$ works:'],
        ['So nah man der 0 von links auch kommt, dort ist $f(x) = -1$, also mindestens 2 vom behaupteten Grenzwert entfernt. Für $\\varepsilon < 2$ scheitert jede Wahl. Die Funktion hat bei 0 keinen Grenzwert, nur einseitige.',
            'However close to 0 you come from the left, there $f(x) = -1$, so it is at least 2 away from the claimed limit. For $\\varepsilon < 2$ every choice fails. The function has no limit at 0, only one-sided ones.'],
        // stetigkeit
        ['Stetig an der Stelle ', 'Continuous at the point '],
        ['linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            'left-hand limit, right-hand limit and function value agree. The graph can be drawn without lifting the pen.'],
        ['Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', 'Jump:</b> the one-sided limits are different, the graph jumps by '],
        ['. Stetig wird $f$ nur für $', '. $f$ only becomes continuous for $'],
        ['Hebbare Unstetigkeit:</b> Der Grenzwert ', 'Removable discontinuity:</b> the limit '], [' existiert, aber der Funktionswert ist ', ' exists, but the function value is '],
        ['. Mit $b = ', '. With $b = '], ['$ wird die Lücke geschlossen.', '$ the gap is closed.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tangent at $x_0 = '], ['$, also $f(x_0 + h) \\approx ', '$, so $f(x_0 + h) \\approx '],
        ['Am Rand des Ausschnitts ($h = \\pm', 'At the edge of the window ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$) the tangent differs by at most '],
        [' ab, das sind ', ', that is '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' per unit of $h$. Make $r$ smaller: the error shrinks faster than $h$; zoomed in, the curve looks like its tangent.'],
        // ablnachdef (the number rules have already made (0 \mid 1) into (0, 1))
        [': Es genügt, den Grenzwert von $\\dfrac{a^h - 1}{h}$ für $h \\to 0$ zu kennen, den Anstieg in $(0, 1)$.',
            ': it is enough to know the limit of $\\dfrac{a^h - 1}{h}$ for $h \\to 0$, the gradient at $(0, 1)$.'],
        ['Für $a = ', 'For $a = '], ['$ geht der Quotient gegen $\\ln a \\approx ', '$ the quotient tends to $\\ln a \\approx '],
        ['$, also $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. ', '$, so $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. '],
        ['Für $a = e$ ist der Grenzwert genau 1: ', 'For $a = e$ the limit is exactly 1: '],
        ['Bei welcher Basis ist der Grenzwert genau 1?', 'For which base is the limit exactly 1?'],
        // produktregel (1{,}5 is already 1.5 here)
        ['$ bei $x = 1.5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:', '$ at $x = 1.5$. If $x$ grows by $h$, the area $u \\cdot v$ grows by two strips and a corner:'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $', 'For $h \\to 0$ the corner $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ tends to $0 \\cdot v\'$, what remains is $'],
        ['$: die <b>Produktregel</b>.', '$: the <b>product rule</b>.'],
        // randextrema
        ['$ auf $[', '$ on $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.', ']$. Candidates: the points with $f\'(x) = 0$ and a change of sign inside, plus the two end points.'],
        [' auf dem Intervall. ', ' on the interval. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'A global extremum lies at an <b>end point</b>: there $f\'$ is not zero.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Here both global extrema lie inside.'],
        // drehraum
        ['Drehung um die ', 'Rotation about the '], ['-Achse um ', '-axis by '],
        ['$. Die Koordinate längs der Drehachse bleibt gleich, ', '$. The coordinate along the axis of rotation stays the same, '],
        ['die beiden anderen werden wie in der Ebene gedreht.', 'the other two are rotated as in the plane.'],
        // verflechtung
        ['Zwischenprodukte: $', 'Intermediate products: $'], ['Rohstoffe: $', 'Raw materials: $'], ['In einem Schritt: $', 'In one step: $'],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $', '$ gives the raw materials needed per final product, and $'],
        ['Für ', 'For '], [' Tafeln und ', ' bars and '], [' Boxen braucht man ', ' boxes you need '],
        [' ME Kakao, ', ' units of cocoa, '], [' ME Zucker und ', ' units of sugar and '], [' ME Milch', ' units of milk'], [' ME', ' units'],
        // rettung
        ['Bei $x = ', 'At $x = '], ['$ m braucht sie ', '$ m she needs '], [' s, am schnellsten ist sie bei ', ' s; she is fastest at '],
        ['$ m</b> mit ', '$ m</b> with '], [' s (grün).', ' s (green).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Angles to the normal: on the sand $\\alpha = '], ['$, im Wasser $\\beta = ', '$, in the water $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. At the optimum $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: '],
        ['$ und $\\dfrac{\\sin ', '$ and $\\dfrac{\\sin '], ['$, das Brechungsgesetz.', '$, the law of refraction.'],
        // fixpunkt
        ['Hier ist $\\varphi\'(x^*) = 0$: Die Folge konvergiert extrem schnell, die Zahl der richtigen Stellen verdoppelt sich etwa bei jedem Schritt (das ist das Newton-Verfahren für $x^2 - 2 = 0$).',
            'Here $\\varphi\'(x^*) = 0$: the sequence converges extremely fast, the number of correct digits roughly doubles with every step (this is Newton’s method for $x^2 - 2 = 0$).'],
        ['Wegen $|\\varphi\'(x^*)| < 1$ ist der Fixpunkt <b>anziehend</b>: Nahe bei $x^*$ schrumpft der Fehler bei jedem Schritt etwa um diesen Faktor.',
            'Because $|\\varphi\'(x^*)| < 1$, the fixed point is <b>attracting</b>: close to $x^*$ the error shrinks by about this factor with every step.'],
        [' Weil $\\varphi\' < 0$ ist, springt die Folge um den Fixpunkt herum (Spirale).', ' Because $\\varphi\' < 0$, the sequence jumps around the fixed point (spiral).'],
        [' Weil $\\varphi\' > 0$ ist, nähert sie sich von einer Seite (Treppe).', ' Because $\\varphi\' > 0$, it approaches from one side (staircase).'],
        ['Hier ist $|\\varphi\'(x^*)| = 1$: Der Satz sagt nichts. Bei $\\varphi(x) = \\tfrac2x$ springt die Folge ewig zwischen zwei Werten hin und her, ein Zyklus.',
            'Here $|\\varphi\'(x^*)| = 1$: the theorem says nothing. For $\\varphi(x) = \\tfrac2x$ the sequence jumps back and forth between two values for ever, a cycle.'],
        ['Wegen $|\\varphi\'(x^*)| > 1$ ist der Fixpunkt <b>abstoßend</b>: Selbst ganz nahe bei $x^*$ wächst der Fehler, die Folge läuft weg.',
            'Because $|\\varphi\'(x^*)| > 1$, the fixed point is <b>repelling</b>: even very close to $x^*$ the error grows, the sequence runs away.'],
        ['$ mit $\\varphi(x) = ', '$ with $\\varphi(x) = '], ['$, Fixpunkt $x^* \\approx ', '$, fixed point $x^* \\approx '],
        ['$ (grün), $|\\varphi\'(x^*)| \\approx ', '$ (green), $|\\varphi\'(x^*)| \\approx '], ['\\text{sehr groß}', '\\text{very large}']
    ],
    rule: [
        // randextrema: the interval [-2;\, 3] with a space after \, → [-2, 3]
        [/\[(-?[\d.]+);\\, (-?[\d.]+)\]/g, '[$1, $2]']
    ]
});
