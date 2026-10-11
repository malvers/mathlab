/* js/buch-en/exponential.js — English for the widgets of js/buch-exponential.js:
 *   wachstumsmodell, logfunktion, rechenschieber, verkettung, expanwendung, funktionsklassen, skizze (book 10, mathegy10-en)
 * Loaded by the English editions right after js/buch-exponential.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('exponential', {
    word: {
        // book 10 mathegy10-en
        // wachstumsmodell
        'beschränkt': 'bounded', 'logistisch': 'logistic',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Piggy bank: €50 at the start, and €20 is added every week.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Culture of bacteria: 200 bacteria, 30 % more every hour.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.':
            'A drink from the fridge (6 °C) warms up to room temperature (22 °C). Every minute the distance to room temperature shrinks by 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'A rumour at a school with 800 students: at the start 10 know it.',
        'Betrag in €': 'Amount in €', 'Anzahl': 'Number', 'Temperatur in °C': 'Temperature in °C', 'kennen es': 'know it',
        'Zunahme $d$ pro Schritt': 'Increase $d$ per step', 'Wachstumsfaktor $q$': 'Growth factor $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Fraction $k$ of the distance per step', 'Wachstumskonstante $k$': 'Growth constant $k$',
        'Anfangsbestand $B_0$': 'Initial stock $B_0$', 'Schranke $S$': 'Bound $S$', 'Anzahl der Schritte': 'Number of steps',
        'Bestand Schritt für Schritt': 'Stock step by step',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'The <b>difference</b> of consecutive values is constant.',
        // logfunktion
        'Basis $a$': 'Base $a$', 'Verschiebung $d$ nach rechts': 'Shift $d$ to the right', 'Verschiebung $e$ nach oben': 'Shift $e$ upwards',
        'Logarithmusfunktion mit Asymptote': 'Logarithmic function with asymptote', 'senkrechte Asymptote': 'vertical asymptote',
        'Die Basis $a = 1$ ist nicht erlaubt: $1^y$ ist immer $1$, man kann also nicht nach $y$ auflösen.':
            'The base $a = 1$ is not allowed: $1^y$ is always $1$, so you cannot solve for $y$.',
        // rechenschieber
        'Faktor $a$': 'Factor $a$', 'Faktor $b$': 'Factor $b$',
        'Rechenschieber: verschiebbare Zunge über einer festen Skala': 'Slide rule: a sliding tongue above a fixed scale',
        // verkettung
        'Verknüpfung:': 'Combination:', 'Verknüpfung': 'Combination', 'Funktion f': 'Function f', 'Funktion g': 'Function g',
        'Zwei Funktionen und ihre Verknüpfung': 'Two functions and their combination', 'Ergebnis': 'Result',
        // expanwendung
        'Sparen': 'Saving', 'Wochen': 'weeks', 'Minuten': 'minutes', 'Medikament': 'Drug', 'Bakterien': 'Bacteria', 'Sachverhalt': 'Situation',
        '2000 € werden mit 3 % pro Jahr verzinst.': '€2000 earns 3 % interest per year.',
        'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.': 'Carbon-14 decays with a half-life of 5730 years.',
        '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.': '400 mg of an active ingredient; the body breaks down 20 % of it every hour.',
        '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.': '500 bacteria; the number doubles every 3 hours.',
        'Zielwert $Z$': 'Target value $Z$', 'Wachstums- oder Zerfallskurve mit Zielwert': 'Curve of growth or decay with a target value',
        't in Jahre': 't in years', 't in Stunden': 't in hours',
        // funktionsklassen
        'ganzrational': 'polynomial', 'gebrochenrational': 'rational', 'Wurzel': 'Square root', 'logarithmisch': 'logarithmic', 'trigonometrisch': 'trigonometric',
        'Funktionsklasse': 'Class of functions', 'Typische Graphen der gewählten Funktionsklasse': 'Typical graphs of the chosen class of functions',
        'Definitionsbereich': 'Domain', 'Nullstellen': 'Zeros', 'Verlauf': 'Shape', 'Symmetrie': 'Symmetry', 'Besonderheit': 'Special feature',
        'Wertebereich': 'Range', 'Asymptote': 'Asymptote', 'Nullstelle und Asymptote': 'Zero and asymptote',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, for example $x^2$ or $x^3 - 3x$',
        'alle reellen Zahlen': 'all real numbers', 'höchstens $n$ Stück (Grad $n$)': 'at most $n$ of them (degree $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten':
            'for large $|x|$ the term with the highest exponent determines the shape; no asymptotes',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung':
            'only even exponents: symmetric about the $y$-axis; only odd ones: point-symmetric about the origin',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$':
            'a fraction with $x$ in the denominator, for example $\\tfrac{1}{x}$ or $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'all real numbers except the zeros of the denominator',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'travel time $t = \\tfrac{s}{v}$ for a fixed distance',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, shifted or stretched',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (for the basic type)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (for the basic type)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'inverse function of $y = x^2$ for $x \\geq 0$, no asymptote',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\cdot b^x$ with $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (for $a > 0$), so no zero',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'the $x$-axis; all graphs $b^x$ pass through $(0, 1)$',
        'Wachstum und Zerfall, Zinseszins': 'growth and decay, compound interest',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ with $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'zero $x = 1$, vertical asymptote: the $y$-axis',
        'Richterskala, Dezibel, pH-Wert': 'Richter scale, decibels, pH value',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\sin x$, $\\cos x$, $\\tan x$, also $a \\cdot \\sin(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'sine and cosine: all real numbers; tangent: without $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'sine and cosine: $-1 \\leq y \\leq 1$; tangent: all real numbers',
        'Schwingungen, Gezeiten, Tageslänge': 'oscillations, tides, length of the day',
        // skizze
        'Nächster Schritt': 'Next step', 'Graph zeigen': 'Show graph', 'Andere Funktion': 'Another function',
        'Skizze: charakteristische Punkte und Asymptoten': 'Sketch: characteristic points and asymptotes',
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Basic function $2^x$, shifted 4 <b>down</b>: horizontal asymptote $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Point of intersection with the $y$-axis: $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Zero: $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'One more point: $f(3) = 8 - 4 = 4$. Strictly increasing.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.':
            'Vertex form: vertex $S(1, 4)$, opening <b>downwards</b>, as wide as the standard parabola.',
        'Nullstellen: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, also $x = -1$ und $x = 3$.': 'Zeros: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, so $x = -1$ and $x = 3$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.':
            'Point of intersection with the $y$-axis: $f(0) = -1 + 4 = 3$, and reflected in $x = 1$ also $(2, 3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.':
            'Basic function $\\tfrac1x$, shifted 2 to the right: <b>pole</b> $x = 2$ with a vertical asymptote.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Shifted 1 up: horizontal asymptote $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Zero: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': '$y$-axis: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; to the right of the pole, for example $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.':
            'Basic function $\\log_2 x$, shifted 1 to the <b>left</b>: domain $x > -1$, vertical asymptote $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Zero: $x + 1 = 1 \\Rightarrow x = 0$. It is also the point of intersection with the $y$-axis.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'More points at powers of two: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Mean level $y = 1$, amplitude 2: the values lie between $-1$ and $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Period $2\\pi$ as for the sine. Maximum at $\\tfrac{\\pi}{2}$, minimum at $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'On the mean level at $0$, $\\pi$ and $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Factor out: $x(x^2 - 4) = x(x - 2)(x + 2)$, zeros $-2$, $0$ and $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.':
            'Only odd exponents: <b>point-symmetric</b> about the origin. For large $x$, $x^3$ decides: upwards on the right, downwards on the left.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Two points: $f(1) = -3$ and, by symmetry, $f(-1) = 3$.',
        'Jetzt die Punkte glatt verbinden und die Asymptoten beachten. So sieht der Graph aus.': 'Now join the points smoothly and mind the asymptotes. This is what the graph looks like.',
        'Überleg zuerst selbst: Welche Grundfunktion steckt darin? Wie ist sie verschoben oder gestreckt? Dann Schritt für Schritt aufdecken.':
            'Think it through yourself first: which basic function is hidden in it? How is it shifted or stretched? Then reveal it step by step.'
    },
    phrase: [
        // book 10 mathegy10-en
        // wachstumsmodell
        ['rekursiv: $B_0 = ', 'recursive: $B_0 = '], ['explizit: $', 'explicit: $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'The <b>quotient</b> of consecutive values is constant: '],
        [' % pro Schritt (Abnahme).', ' % per step (decrease).'], [' % pro Schritt.', ' % per step.'], ['Der Bestand bleibt gleich.', 'The stock stays the same.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'The <b>distance to the bound</b> shrinks by the factor $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$; the stock gets closer and closer to $S$ without exceeding it.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'At first the stock grows almost exponentially; near $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.',
            '$ it grows fastest, then the bound slows it down. There is no simple explicit formula for this step-by-step calculation: you calculate step by step, best with a spreadsheet.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Careful:</b> with such a large $k$ the stock jumps over the bound and oscillates.'],
        // logfunktion
        ['streng monoton <b>steigend</b> ($a > 1$)', 'strictly <b>increasing</b> ($a > 1$)'], ['streng monoton <b>fallend</b> ($0 < a < 1$)', 'strictly <b>decreasing</b> ($0 < a < 1$)'],
        ['Definitionsbereich $x > ', 'Domain $x > '], ['$ · Wertebereich: alle reellen Zahlen · ', '$ · range: all real numbers · '],
        ['Nullstelle: $', 'Zero: $'], ['$ · weiße Punkte: $(', '$ · white points: $('], [')$ und $(', ')$ and $('],
        [' · Gespiegelt an $y = x$ wird daraus die Exponentialfunktion $y = ', ' · Reflected in $y = x$, it becomes the exponential function $y = '],
        // rechenschieber
        ['Der Anfang der oberen Skala steht über $a = ', 'The start of the upper scale is above $a = '], ['$, der Läufer über $b = ', '$, the cursor above $b = '],
        ['$ auf der oberen Skala. Unten liest man ab: <b>$', '$ on the upper scale. Below you read off: <b>$'],
        [' · Weil $a \\cdot b > 10$ ist, steht hier der <b>rechte</b> Index über $a$, man liest $\\tfrac{a \\cdot b}{10}$ ab: $a \\cdot b = ',
            ' · Because $a \\cdot b > 10$, the <b>right-hand</b> index is above $a$ here, and you read off $\\tfrac{a \\cdot b}{10}$: $a \\cdot b = '],
        ['Längen auf der Skala sind Logarithmen: $\\lg ', 'Lengths on the scale are logarithms: $\\lg '],
        ['$. Aus dem Addieren der Längen wird ein Multiplizieren der Zahlen.', '$. Adding the lengths becomes multiplying the numbers.'],
        // verkettung
        ['Unter der Wurzel darf keine negative Zahl stehen.', 'There must be no negative number under the square root.'], ['Ein Nenner darf nicht null werden.', 'A denominator must not become zero.'],
        [' Darum muss man prüfen, für welche $x$ die innere Funktion einen erlaubten Wert liefert.', ' So you have to check for which $x$ the inner function gives an allowed value.'],
        ['Innere Funktion: $', 'Inner function: $'], ['$, äußere Funktion: $', '$, outer function: $'], ['$. Man setzt die innere in die äußere ein.', '$. You substitute the inner one into the outer one.'],
        ['Beim Quotienten fallen außerdem alle Stellen weg, an denen $g(x) = 0$ ist.', 'For the quotient, all points at which $g(x) = 0$ are also left out.'],
        ['Der Definitionsbereich ist der Bereich, in dem <b>beide</b> Funktionen definiert sind.', 'The domain is the set where <b>both</b> functions are defined.'],
        ['Im Allgemeinen ist $f(g(x)) \\neq g(f(x))$: Probier die andere Reihenfolge.', 'In general $f(g(x)) \\neq g(f(x))$: try the other order.'],
        // expanwendung: "Wann ist das Kapital auf 3000 €?", "Wann sind nur noch 50 mg übrig?"
        ['Wann ist das Kapital auf', 'When does the capital reach'], ['Wann ist der Anteil auf', 'When is the proportion down to'],
        ['Wann sind nur noch', 'When are only'], [' übrig', ' left'], ['Wann sind es', 'When are there'],
        // funktionsklassen: cells that begin with <b> are not looked up as whole labels
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>poles</b> with vertical asymptotes, often a horizontal asymptote'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>periodic</b>: period $2\\pi$ for sine and cosine, $\\pi$ for tangent'],
        // skizze
        ['Skizziere ohne Taschenrechner:', 'Sketch without a calculator:']
    ],
    rule: [
        // book 10 mathegy10-en
        // expanwendung: the unit after the result ("… ≈ 13.7$ Jahre"); large numbers in TeX come as 100\,000 → 100{,}000
        [/\$ Jahre<\/p>/g, '$ years</p>'], [/\$ Stunden<\/p>/g, '$ hours</p>'],
        [/(?<=\d)\\,(?=\d{3}(?!\d))/g, '{,}'],
        // skizze: "(Funktion 2 von 6)"
        [/\(Funktion (\d+) von (\d+)\)/g, '(function $1 of $2)']
    ]
});
