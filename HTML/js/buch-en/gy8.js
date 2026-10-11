/* js/buch-en/gy8.js — English for the widgets of js/buch-gy8.js (book 12, mathegy8-en):
 *   titelbildgy8, termbaum8, binomformeln8, gluecksrad8, wegzeit8, lgs8, streckung8, aehnlich8, gulliver8, schatten8,
 *   rueckwaerts8, sammel8, mcpi8, ziffern8
 * Loaded by the English editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // termbaum8: the type of a term and its last operation
    const KIND = { 'Summe': 'sum', 'Differenz': 'difference', 'Produkt': 'product', 'Quotient': 'quotient', 'Potenz': 'power' };
    const LAST = { 'Summe': 'an addition', 'Differenz': 'a subtraction', 'Produkt': 'a multiplication', 'Quotient': 'a division', 'Potenz': 'raising to a power' };
    const PARTS = { 'Summanden': 'Summands', 'Minuend und Subtrahend': 'Minuend and subtrahend', 'Faktoren': 'Factors', 'Dividend und Divisor': 'Dividend and divisor' };
    // wegzeit8: what Mia is doing
    const DOING = { 'geht zu Fuß zur Haltestelle': 'walks to the bus stop', 'wartet an der Haltestelle': 'waits at the bus stop',
        'fährt mit dem Bus': 'travels on the bus', 'geht das letzte Stück zur Schule': 'walks the last bit to school' };
    const times = n => (n === '1' ? 'time' : 'times');

    window.BuchEN && BuchEN.add('gy8', {
        word: {
            // titelbildgy8
            'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
                'Cover picture: a triangle is stretched from a centre, a square made of a², twice ab and b², two lines with their point of intersection and a tree diagram',
            // termbaum8: the operation sign in the tree (the German book divides with ":")
            ':': '÷', 'Wert für $x$': 'Value of $x$',
            'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Tap a node: then its sub-term lights up.',
            // binomformeln8
            '1. Formel': '1st formula', '2. Formel': '2nd formula', '3. Formel': '3rd formula', 'Binomische Formel': 'Binomial formula',
            'Länge $a$': 'Length $a$', 'Länge $b$': 'Length $b$', 'Binomische Formel als Flächenbild': 'Binomial formula as a picture of areas',
            'Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.':
                'The large square consists of four parts: $a^2$, twice $ab$ and $b^2$. If you only calculate $a^2 + b^2$, you forget the two blue rectangles.',
            'Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.':
                'From the square $a^2$ you take away the two red strips $ab$. The green corner square $b^2$ is part of both strips, so you have taken it away twice. It comes back once: $+\\,b^2$.',
            'Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.':
                'The corner $b^2$ is cut out of the square $a^2$. The blue piece is turned and placed on the right: a rectangle with the sides $a + b$ and $a - b$ appears.',
            // gluecksrad8
            'Felder': 'Sectors', 'ein Feld weniger': 'one sector fewer', 'ein Feld mehr': 'one sector more',
            'gleich groß': 'equal size', 'verschieden groß': 'different sizes', 'Größe der Felder': 'Size of the sectors', 'Drehen': 'Spin',
            'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Tap sectors of the wheel: they form the event $E$ (yellow). Then spin the wheel.',
            // wegzeit8
            'Zeit $t$ in min': 'Time $t$ in min', 'Weg-Zeit-Diagramm des Schulwegs': 'Distance-time graph of the way to school',
            'Zuhause': 'Home', 'Haltestelle': 'Bus stop', 'Schule': 'School',
            'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'The way to school as a line, the dot shows where Mia is right now',
            'Mia ist in der Schule angekommen.': 'Mia has arrived at school.',
            // lgs8
            'Einsetzungsverfahren': 'Substitution', 'Gleichsetzungsverfahren': 'Equating', 'Additionsverfahren': 'Elimination', 'Verfahren': 'Method',
            'Nächster Schritt': 'Next step', 'Alle Schritte': 'All steps', 'Neues Gleichungssystem': 'New system of equations',
            'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'The two lines of the system of equations and their point of intersection',
            'Klammer auflösen und zusammenfassen.': 'Expand the brackets and simplify.',
            'Löse beide Gleichungen nach $y$ auf.': 'Rearrange both equations for $y$.',
            'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'The right-hand sides are both equal to $y$, so they are equal to each other: set them equal.',
            'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'All $x$ terms to the left, all numbers to the right, then divide.',
            'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Multiply so that the numbers in front of $y$ become opposites.',
            'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Add the two equations: $y$ drops out.',
            'Nach $x$ auflösen.': 'Solve for $x$.', 'Nach $y$ auflösen.': 'Solve for $y$.',
            // streckung8
            'Streckfaktor $k$': 'Scale factor $k$', 'Bild': 'Image', 'Verhältnis': 'Ratio', 'Winkel bei $A$': 'Angle at $A$', 'gleich': 'equal', 'Fläche': 'Area',
            'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
                'Drag $Z$, $A$, $B$ and $C$. The dashed rays start at $Z$ and pass through a point and its image point.',
            // aehnlich8
            'Ein Beispiel zeigen': 'Show an example', 'gegeben': 'given', 'dein Dreieck': 'your triangle',
            'Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen': 'A given triangle and a second triangle to compare',
            'klein': 'small', 'mittel': 'middle', 'groß': 'large', 'Winkel, gegeben': 'Angles, given', 'Winkel bei dir': 'Your angles', 'Seiten­verhältnis': 'Ratio of sides',
            'Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?':
                'Drag the yellow vertices onto the grid points. Can you make a triangle that is similar to the given one but lies differently?',
            // gulliver8
            'k = 12 (Gulliver)': 'k = 12 (Gulliver)', 'Streckfaktor': 'Scale factor', 'Einheitswürfel': 'Unit cube', 'großer Würfel': 'large cube', 'Faktor': 'Factor',
            'Kantenlänge': 'Edge length', 'Oberfläche': 'Surface area', 'Volumen': 'Volume',
            'Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.':
                'Gulliver is 12 times as tall as a Lilliputian. So his skin has $144$ times the area and his body $1728$ times the volume. In Jonathan Swift’s book the emperor’s mathematicians calculate in exactly this way and give him food for 1724 Lilliputians every day, four fewer than $12^3$.',
            // schatten8
            'Schattenmethode': 'Shadow method', 'Försterdreieck': 'Forester’s triangle', 'Methode': 'Method', 'Sonnenhöhe': 'Height of the sun',
            'Abstand $d$ zum Baum': 'Distance $d$ from the tree', 'Höhe ausrechnen': 'Calculate the height', 'Neuer Baum': 'New tree', 'Stab 2 m': 'Stick 2 m',
            'Baum und Stab mit ihren Schatten': 'Tree and stick with their shadows', 'Höhenmessung mit dem Försterdreieck': 'Measuring a height with the forester’s triangle',
            'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.':
                'The sun’s rays come in parallel. That is why the blue and the yellow triangle are similar: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',
            // rueckwaerts8
            'Rückwärts: ein Schritt': 'Backwards: one step', 'Neues Rätsel': 'New puzzle', 'Startzahl': 'Starting number',
            'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
                'Try a number in the first box, or calculate backwards: every operation is replaced by its inverse, plus by minus, times by divided by.',
            // sammel8
            'Größe des Albums': 'Size of the album', 'Eine Tüte öffnen': 'Open a packet', 'Bis das Album voll ist': 'Until the album is full',
            '1000 Alben': '1000 albums', 'Neues Album': 'New album', 'Mittelwert': 'Mean', 'Anzahl der Tüten bis zum vollen Album': 'Number of packets until the album is full',
            'Histogramm: wie viele Tüten 1000 Alben gebraucht haben': 'Histogram: how many packets 1000 albums needed',
            // mcpi8
            'Zufallspunkte in einem Quadrat, Treffer im Viertelkreis gelb': 'Random points in a square, hits in the quarter circle in yellow',
            'Noch keine Punkte. Lass es regnen!': 'No points yet. Let it rain!',
            // ziffern8
            'als Münze': 'as a coin', 'als Würfel': 'as a dice', 'Lesart': 'Reading', 'Neue Tabelle': 'New table',
            'Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.': 'Even digit (0, 2, 4, 6, 8) = heads, odd = tails. Every digit is a coin toss.',
            'Augenzahl': 'Score', 'absolut': 'absolute', 'relativ': 'relative'
        },
        phrase: [
            // lgs8 (a sentence that starts with <b> is no whole label for the engine)
            ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Check</b> in both equations, then the solution set.'],
            // termbaum8
            ['Rechenbaum des Terms ', 'Calculation tree of the term '],
            ['Für $x = ', 'For $x = '], ['$ hat er den Wert ', '$ it has the value '], ['. Gerechnet wird von unten nach oben.', '. The calculation goes from the bottom to the top.'],
            // gluecksrad8 (numbers are already English here: the number rules run first)
            ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'All sectors are the same size: a <b>Laplace experiment</b>. '],
            ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'The sectors are of <b>different sizes</b>: this is <b>not</b> a Laplace experiment. '],
            ['}$ wäre falsch. ', '}$ would be wrong. '], ['Es zählt der Anteil am ganzen Rad: ', 'What counts is the share of the whole wheel: '],
            ['Zuletzt: Feld <b>', 'Last spin: sector <b>'], [', $E$ ist eingetreten.', ', $E$ has occurred.'], [', $E$ ist nicht eingetreten.', ', $E$ has not occurred.'],
            [' · Wahrscheinlichkeit $P(E) \\approx ', ' · probability $P(E) \\approx '],
            // wegzeit8
            ['Der Graph steigt gleichmäßig.', 'The graph rises steadily.'],
            ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'The graph is horizontal: time passes, the distance stays the same.'],
            ['Hier steigt der Graph am steilsten.', 'Here the graph rises most steeply.'], ['Der Graph steigt flacher als beim ersten Fußweg.', 'The graph rises less steeply than on the first walk.'],
            ['Nach $t = ', 'After $t = '], ['$ min ist Mia ', '$ min, Mia is '], [' von zu Hause entfernt.', ' from home.'],
            // streckung8
            ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Central dilation of the triangle ABC from the centre Z with the factor '],
            ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'With $k = 0$ all image points fall on $Z$: the image is just a point.'],
            ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'With $k = 1$ every point stays where it is.'],
            ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'With $k = -1$ the dilation is a point reflection in $Z$.'],
            ['Bei negativem $k$ liegt jeder Bildpunkt auf der anderen Seite von $Z$. Die Bildstrecken sind $|k| = ', 'For negative $k$ every image point lies on the other side of $Z$. The image segments are $|k| = '],
            ['Eine <b>Vergrößerung</b>', 'An <b>enlargement</b>'], ['<b>Eine Verkleinerung</b>', '<b>A reduction</b>'],
            [': Jede Strecke wird $', ': every segment becomes $'], ['$-mal so lang, die Fläche $k^2 = ', '$ times as long, the area $k^2 = '],
            ['$-mal so lang.', '$ times as long.'], ['$-mal so groß.', '$ times as large.'], [' Alle Winkel bleiben gleich.', ' All angles stay the same.'],
            // aehnlich8
            ['Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.', 'The three points lie on a straight line: that is not a triangle.'],
            ['Ähnlich!', 'Similar!'], ['</b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor $k \\approx ', '</b> All angles agree, and all sides are stretched by the same factor $k \\approx '],
            ['$ gestreckt.', '$.'], [' Mit $k = 1$ sind die Dreiecke sogar kongruent.', ' With $k = 1$ the triangles are even congruent.'],
            ['Noch nicht ähnlich: ', 'Not similar yet: '], ['Nur ein Winkel stimmt.', 'only one angle agrees.'], ['Kein Winkel stimmt.', 'no angle agrees.'],
            [' Die Seitenverhältnisse sind verschieden.', ' The ratios of the sides are different.'],
            // gulliver8
            ['Alle Längen werden $', 'All lengths become $'], ['$-mal so groß, jede Fläche $', '$ times as large, every area $'], ['$-mal so groß, das Volumen $', '$ times as large, the volume $'],
            // schatten8 (1{,}6 is already 1.6 here)
            ['Gemessen: Der Stab ist $2$ m hoch, sein Schatten ist $s \\approx ', 'Measured: the stick is $2$ m tall, its shadow is $s \\approx '],
            ['$ m lang. Der Schatten des Baums ist $S \\approx ', '$ m long. The shadow of the tree is $S \\approx '], ['$ m lang.', '$ m long.'],
            ['. Tatsächlich ist der Baum $', '. In fact the tree is $'], ['$ m hoch.', '$ m tall.'],
            ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1.6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ',
                'You hold an isosceles right-angled triangle in front of your eye (eye level $1.6$ m) and sight along its long side. This line rises at $45^\\circ$: '],
            ['Auf $d = ', 'Over $d = '], ['$ m steigt sie um $', '$ m it rises by $'],
            ['Treffer!', 'Hit!'], ['</b> Du siehst genau die Spitze. ', '</b> You can see exactly the top. '],
            ['Du siehst den Baum in $', 'You see the tree at a height of $'], ['$ m Höhe, unter der Spitze: Geh weiter zurück.', '$ m, below the top: walk further back.'],
            ['Deine Peillinie geht über die Spitze hinweg: Geh näher heran.', 'Your line of sight passes over the top: walk closer.'],
            // rueckwaerts8
            ['$. Welche Zahl war es?', '$. What was the number?'], ['Richtig!', 'Correct!'], ['Das passt nicht.', 'That does not fit.'],
            ['Rückwärts von $', 'Backwards from $'], ['$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>', '$, with the inverse operations: the starting number is <b>'],
            // sammel8
            ['Voll!', 'Full!'], ['1000 Alben: Im Mittel brauchte man ', '1000 albums: on average you needed '], ['$ Tüten', '$ packets'],
            [' (am wenigsten $', ' (fewest $'], ['$, am meisten $', '$, most $'],
            ['Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $', 'You can also calculate it, with tools from the upper school: $'],
            // mcpi8
            ['Der Viertelkreis bedeckt $\\tfrac{\\pi}{4}$ des Quadrats, also ist ', 'The quarter circle covers $\\tfrac{\\pi}{4}$ of the square, so '], ['(Abweichung $', '(deviation $'],
            // ziffern8
            ['Wappen: $', 'Heads: $'], ['$ · Zahl: $', '$ · tails: $'], ['$ · relative Häufigkeit von Wappen: $', '$ · relative frequency of heads: $'],
            ['Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen (grau). So entstehen ', 'The digits 1 to 6 are scores, 0, 7, 8 and 9 are skipped (grey). That makes '],
            [' Würfe.', ' rolls.'],
            // the pieces of the sentences that a rule below translates as a whole (so tools/buch-en/check.mjs sees them translated, too)
            ['Summanden', 'Summands'], ['Minuend und Subtrahend', 'Minuend and subtrahend'], ['Faktoren', 'Factors'], ['Dividend und Divisor', 'Dividend and divisor'],
            ['Produkt', 'product'], ['Potenz', 'power'], ['Basis und Exponent', 'Base and exponent'],
            ['Der Term $', 'The term $'], ['</b>: Zuletzt wird ', '</b>: the last operation is '],
            ['Ausgewählt: ', 'Selected: '], ['der Teilterm $', 'the sub-term $'], [' mit dem Wert $', ' with the value $'],
            ['die Variable $x$ mit dem Wert $', 'the variable $x$ with the value $'], ['die Zahl $', 'the number $'],
            ['Glücksrad mit ', 'Spinner with '], [' Feldern', ' sectors'],
            ['Gedreht: $', 'Spun: $'], ['$-mal · $E$ eingetreten: $', '$ times · $E$ occurred: $'], ['$-mal · relative Häufigkeit ', '$ times · relative frequency '],
            ['geht zu Fuß zur Haltestelle', 'walks to the bus stop'], ['wartet an der Haltestelle', 'waits at the bus stop'],
            ['fährt mit dem Bus', 'travels on the bus'], ['geht das letzte Stück zur Schule', 'walks the last bit to school'],
            ['Löse Gleichung I nach $', 'Rearrange equation I for $'], ['$ auf.', '$.'], ['Setze das für $', 'Substitute this for $'], ['$ in Gleichung II ein.', '$ into equation II.'],
            ['$ auflösen.', '$.'], ['Setze $', 'Substitute $'], ['$ in die umgestellte Gleichung ein.', '$ into the rearranged equation.'],
            ['Setze $x = ', 'Substitute $x = '], ['$ in Gleichung I (umgestellt) ein.', '$ into equation I (rearranged).'], ['$ in Gleichung I ein.', '$ into equation I.'],
            [': erst selbst überlegen, dann aufdecken.', ': think it through yourself first, then reveal it.'],
            ['Ein Einheitswürfel und ein Würfel aus ', 'A unit cube and a cube made of '], [' hoch drei Einheitswürfeln', ' cubed unit cubes'],
            ['Ich denke mir eine Zahl und rechne: ', 'I think of a number and calculate: '], ['geteilt durch', 'divided by'], ['. Heraus kommt $', '. The result is $'],
            ['Mit $', 'With $'], ['$ kommt $', '$ you get $'],
            [' Bilder', ' stickers'], ['Geöffnet: $', 'Opened: $'], ['$ Tüten · im Album: $', '$ packets · in the album: $'], ['$ Bildern · doppelt: $', '$ stickers · duplicates: $'],
            ['Jede Tüte enthält ein Bild. Alle ', 'Every packet contains one sticker. All '],
            [' Bilder sind gleich häufig. Wie viele Tüten brauchst du, bis das Album voll ist?', ' stickers are equally common. How many packets do you need until the album is full?'],
            [' Punkte', ' points'], ['Von $', 'Of $'], ['$ Punkten liegen $', '$ points, $'], ['$ im Viertelkreis, das ist der Anteil $', '$ lie in the quarter circle, that is the share $'],
            ['$ ist ', '$ is '], ['Schritt ', 'Step '], [' von ', ' of '], ['$ von $', '$ of $'],
            // labels that tools/buch-en/check.mjs only sees inside a cut literal (the aria labels) or in two literals (Gulliver)
            ['Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm',
                'Cover picture: a triangle is stretched from a centre, a square made of a², twice ab and b², two lines with their point of intersection and a tree diagram'],
            ['Binomische Formel als Flächenbild', 'Binomial formula as a picture of areas'],
            ['Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen', 'A given triangle and a second triangle to compare'],
            ['Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. ',
                'Gulliver is 12 times as tall as a Lilliputian. So his skin has $144$ times the area and his body $1728$ times the volume. '],
            ['Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.',
                'In Jonathan Swift’s book the emperor’s mathematicians calculate in exactly this way and give him food for 1724 Lilliputians every day, four fewer than $12^3$.']
        ],
        rule: [
            // numbers in TeX: 10\,000 (from the widget) and 2,800 (from the number rules) → 10{,}000, 2{,}800
            [/(\d)\\,(\d{3})(?!\d)/g, '$1{,}$2'],
            [/\$(\d{1,3}(?:,\d{3})+)\$/g, (m, n) => '$' + n.replace(/,/g, '{,}') + '$'],
            // sets: \{1; 2; 3\} → \{1, 2, 3\} (inside one formula)
            [/\\\{([^$]*?)\\\}/g, (m, s) => '\\{' + s.replace(/; /g, ', ') + '\\}'],
            // termbaum8: the division sign of the term (x + 6) : 2, in the buttons, the aria label and the formulae
            [/\(x \+ 6\) : 2/g, '(x + 6) ÷ 2'],
            // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$."
            [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
                (m, t, k) => 'The term $' + t + '$ is a <b>' + KIND[k] + '</b>: the last operation is ' + LAST[k] + '. '],
            [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g, (m, p, a, b) => PARTS[p] + ': $' + a + '$ and $' + b + '$.'],
            [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, exponent $' + b + '$.'],
            [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$/g,
                (m, t, k) => 'Selected: the sub-term $' + t + '$, a ' + KIND[k] + ' with the value $'],
            // gluecksrad8: the aria label and "Gedreht: $12$-mal · $E$ eingetreten: $5$-mal · relative Häufigkeit …"
            [/Glücksrad mit (\d+) Feldern/g, 'Spinner with $1 sectors'],
            [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
                (m, a, b) => 'Spun: $' + a + '$ ' + times(a) + ' · $E$ occurred: $' + b + '$ ' + times(b) + ' · relative frequency '],
            // wegzeit8: "Sie fährt mit dem Bus: $300$ m pro Minute. "
            [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
                (m, d, v) => 'She ' + DOING[d] + (v ? ': $' + v + '$ m per minute. ' : '. ')],
            // lgs8: the steps with a variable or a number in them
            [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Rearrange equation I for $' + v + '$.'],
            [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Substitute this for $' + v + '$ into equation II.'],
            [/Setze \$([xy] = -?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v) => 'Substitute $' + v + '$ into the rearranged equation.'],
            [/Setze \$(x = -?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v) => 'Substitute $' + v + '$ into equation I (rearranged).'],
            [/Setze \$(x = -?\d+)\$ in Gleichung I ein\./g, (m, v) => 'Substitute $' + v + '$ into equation I.'],
            [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Step $1 of $2: think it through yourself first, then reveal it.'],
            // gulliver8: k = 1 changes nothing (instead of "1 times as large"), and the aria label
            [/Alle Längen werden \$1\$-mal so groß, jede Fläche \$1\^2 = 1\$-mal so groß, das Volumen \$1\^3 = 1\$-mal so groß\./g,
                'With $k = 1$ all lengths, areas and volumes stay as they are.'],
            [/Ein Einheitswürfel und ein Würfel aus (\d+) hoch drei Einheitswürfeln/g, 'A unit cube and a cube made of $1 cubed unit cubes'],
            // rueckwaerts8: the division sign in the chain, the puzzle in words, the try
            [/(<span class="rw8-op[^"]*">(?:← )?): /g, '$1÷ '],
            [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$/g,
                (m, ops) => 'I think of a number and calculate: ' + ops.replace(/geteilt durch/g, 'divided by').replace(/\bmal\b/g, 'times').replace(/, dann /g, ', then ') + '. The result is $'],
            [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'With $' + a + '$ you get $' + b + '$. '],
            // sammel8: the album in numbers (before the album sizes "10 Bilder")
            [/Jede Tüte enthält ein Bild\. Alle (\d+) Bilder sind gleich häufig\. Wie viele Tüten brauchst du, bis das Album voll ist\?/g,
                'Every packet contains one sticker. All $1 stickers are equally common. How many packets do you need until the album is full?'],
            [/Geöffnet: \$(\d+)\$ Tüten · im Album: \$(\d+)\$ von \$(\d+)\$ Bildern · doppelt: \$/g,
                (m, p, g, n) => 'Opened: $' + p + '$ ' + (p === '1' ? 'packet' : 'packets') + ' · in the album: $' + g + '$ of $' + n + '$ stickers · duplicates: $'],
            [/(\d+) Bilder\b/g, '$1 stickers'], [/title="Bild (\d+)"/g, 'title="Sticker $1"'],
            // mcpi8: the buttons and "Von $1{,}000$ Punkten liegen $791$ im Viertelkreis, das ist der Anteil $…"
            [/\+([\d,]+) Punkte</g, '+$1 points<'],
            [/Von \$([^$]*)\$ Punkten liegen \$([^$]*)\$ im Viertelkreis, das ist der Anteil \$/g,
                (m, a, b) => 'Of $' + a + '$ points, $' + b + '$ lie in the quarter circle, that is the share $']
        ]
    });
})();
