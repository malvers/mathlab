/* js/buch-en/analysis.js — English for the widgets of js/buch-analysis.js:
 *   titelbild12, grenzwert, sekante, ableitungsgraph, kurve, tangente, ableiten, steckbrief, optimieren (book 2, mathe12-en)
 * Loaded by the English editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('analysis', {
    word: {
        // titelbild12
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Cover picture: curve with inflectional tangent and derivative, binomial distribution and a vector in space',
        // grenzwert
        'Annäherung, Schritt $k$': 'Approach, step $k$', 'Graph mit Annäherung an einen Grenzwert': 'Graph approaching a limit',
        'Annäherung:': 'Approach:', 'Richtung': 'Direction', '$x$ links': '$x$ left', '$x$ rechts': '$x$ right',
        // sekante
        'Abstand $h$ von $P$ zu $Q$': 'Distance $h$ from $P$ to $Q$', 'Tangente zeigen': 'Show tangent', 'Tangente ausblenden': 'Hide tangent',
        'Sekante durch P und Q nähert sich der Tangente': 'Secant through P and Q approaching the tangent',
        // ableitungsgraph
        'Ganzen Graphen von f′ zeigen': 'Show the whole graph of f′', 'Spur löschen': 'Clear trace',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Top: f with its tangent. Drag the point P. Bottom: every gradient of the tangent becomes a point of the graph of f′.',
        'Graph von f mit Tangente': 'Graph of f with its tangent', 'Graph der Ableitung f Strich': 'Graph of the derivative f dash',
        // kurve
        'Zeige auch:': 'Also show:', 'nur f': 'only f', 'f′ und f″': 'f′ and f″', 'Ableitungen zeigen': 'Show derivatives',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Graph of a cubic function with turning points and point of inflection',
        'Intervall': 'Interval', 'konstant': 'constant', 'steigt ↗': 'increases ↗', 'fällt ↘': 'decreases ↘', 'keine Extrempunkte': 'no turning points',
        // tangente
        'Tangente und Normale an einen Graphen': 'Tangent and normal to a graph',
        // ableiten
        'Potenzen': 'Powers', 'Summen': 'Sums', 'Wurzeln und Brüche': 'Roots and fractions', 'eˣ und sin x': 'eˣ and sin x',
        'Produkte': 'Products', 'Gemischt': 'Mixed', 'Aufgabenart': 'Type of exercise', 'Lösung': 'Solution', 'Neue Aufgabe': 'New exercise',
        'z. B. 6x^2 - 2 oder cos x': 'e.g. 6x^2 - 2 or cos x',
        // steckbrief
        'Parabel durch 3 Punkte': 'Parabola through 3 points', 'Kubisch: Extrempunkt + 2 Punkte': 'Cubic: turning point + 2 points',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Cubic: point of inflection with tangent + point', 'Bedingungen': 'Conditions',
        'Steigung im Wendepunkt $m$': 'Gradient at the point of inflection $m$', 'Funktion aus Bedingungen': 'Function from conditions',
        // optimieren
        'Schachtel': 'Box', 'Dose': 'Can', 'Zaun an der Mauer': 'Fence against a wall', 'Zielfunktion': 'Objective function',
        'Lösung mit der Ableitung': 'Solution with the derivative', 'Mauer': 'wall',
        'Karton mit ausgeschnittenen Ecken': 'Card with the corners cut out', 'Zylindrische Dose': 'Cylindrical can', 'Gehege an einer Mauer': 'Enclosure against a wall',
        'O in cm²': 'S in cm²',
        // book 3 mathe13-en: schar, gewinn
        'Funktionenschar': 'Family of functions', 'Ortskurve der Extrempunkte zeigen': 'Show the locus of the turning points',
        'Funktionenschar mit Ortskurve': 'Family of functions with locus', 'Hochpunkt': 'Maximum', 'Tiefpunkt': 'Minimum',
        'Verkaufspreis $p$ (€ pro Stück)': 'Selling price $p$ (€ per item)', 'x in Stück': 'x in items', 'Kosten, Erlös und Gewinn': 'Costs, revenue and profit',
        // book 5 mathefos12-en: titelbildfos12
        'Titelbild: Exponentialkurve mit Hochpunkt, Wendetangente und Rechtecken darunter, eine Hyperbel mit Asymptoten und ein Parallelogramm im Raum mit seinem Vektorprodukt':
            'Cover picture: exponential curve with maximum, inflectional tangent and rectangles below it, a hyperbola with asymptotes and a parallelogram in space with its cross product',
        // book 5 mathefos12-en: efunktion
        'Welche Basis?': 'Which base?', 'Zinseszins': 'Compound interest', 'Was wird gezeigt?': 'What is shown?',
        'Exponentialfunktionen und die Eulersche Zahl e': 'Exponential functions and Euler’s number e', 'Basis $a$': 'Base $a$', 'a = e setzen': 'Set a = e',
        'Faktor $a$': 'Factor $a$', 'im Exponenten $b$': 'in the exponent $b$', 'Verschiebung $c$': 'Shift $c$', 'Verzinsung': 'Interest added',
        'jährlich': 'yearly', 'halbjährlich': 'half-yearly', 'vierteljährlich': 'quarterly', 'monatlich': 'monthly', 'wöchentlich': 'weekly',
        'täglich': 'daily', 'stündlich': 'hourly', 'minütlich': 'every minute',
        // book 5 mathefos12-en: bruchfunktion
        'Polstelle': 'Pole', 'Lücke': 'Hole', 'ohne Vorzeichenwechsel': 'No change of sign', 'schiefe Asymptote': 'Oblique asymptote', 'Beispiele:': 'Examples:',
        'Graph einer gebrochenrationalen Funktion mit Polstellen, Lücken und Asymptoten': 'Graph of a rational function with poles, holes and asymptotes',
        'Zähler:': 'Numerator:', 'Nenner:': 'Denominator:', 'Grad des Zählers': 'Degree of the numerator', 'Grad des Nenners': 'Degree of the denominator',
        'Grad 0': 'Degree 0', 'Grad 1': 'Degree 1', 'Grad 2': 'Degree 2', 'Faktor $k$': 'Factor $k$',
        // book 6 mathegy12-en: titelbildgy12, integrieren, abstandmin
        'Titelbild: eine Fläche unter einer Kurve mit Trapezen, ein Histogramm mit rotem Ablehnungsbereich, eine Gerade durch eine Ebene mit ihrem Schnittwinkel und dem Normalenvektor':
            'Cover picture: an area under a curve with trapezia, a histogram with a red rejection region, a line through a plane with its angle of intersection and the normal vector',
        'Lineare Verkettung': 'Linear substitution', 'z. B. x^3/3 - 2x oder -cos(2x)/2': 'e.g. x^3/3 - 2x or -cos(2x)/2',
        'Gerade': 'Line', 'Parabel': 'Parabola', 'Wurzelkurve': 'Square root curve', 'Kurve:': 'Curve:',
        'Zieh den Punkt P. Der Schieber bewegt Q auf der Kurve, unten wächst und schrumpft der Abstand d(x).':
            'Drag the point P. The slider moves Q along the curve; below, the distance d(x) grows and shrinks.',
        'Kurve, Punkt P und der Punkt Q auf der Kurve mit ihrem Abstand': 'Curve, point P and the point Q on the curve with their distance',
        'Abstandsfunktion d(x) mit ihrem Minimum': 'Distance function d(x) with its minimum', '$x$-Koordinate von $Q$': '$x$-coordinate of $Q$',
        // book 6 mathegy12-en: geradenschar
        'Büschel': 'Pencil', 'Parallelen': 'Parallels', 'Gerade und Parabel': 'Line and parabola', 'Geradenschar': 'Family of lines',
        'Geradenschar mit der hervorgehobenen Geraden für den gewählten Parameter': 'Family of lines with the line for the chosen parameter highlighted',
        'Alle Geraden gehen durch $(2 \\mid 1)$: Für $x = 2$ fällt $a$ heraus. Der Parameter ist die Steigung, eine Gerade fehlt aber: die senkrechte $x = 2$.':
            'All the lines pass through $(2, 1)$: for $x = 2$, $a$ drops out. The parameter is the gradient, but one line is missing: the vertical line $x = 2$.',
        'Die Steigung ist immer $0{,}5$: Die Geraden sind parallel und haben keinen gemeinsamen Punkt. Der Parameter verschiebt sie.':
            'The gradient is always $0.5$: the lines are parallel and have no common point. The parameter shifts them.',
    },
    phrase: [
        // grenzwert
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'tends to $-\\infty$ from the left and to $+\\infty$ from the right: no limit, vertical asymptote $x = 1$'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.',
            '$f$ is not defined at $x = 1$, the graph has a hole there. The limit exists all the same: cancelling gives $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'grows without bound: $f(x) \\to \\infty$, no limit'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', '$f$ is not defined at $x = 0$. All the same, the values get arbitrarily close to 1.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'The graph oscillates about the $x$-axis, the swings get smaller and smaller.'],
        ['$ für $', '$ for $'], ['Waagerechte Asymptote: $y = ', 'Horizontal asymptote: $y = '],
        // sekante, ableitungsgraph, tangente
        ['$ mit $h = ', '$ with $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Gradient of the secant (difference quotient): $'],
        ['Tangentensteigung: $', 'Gradient of the tangent: $'],
        ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· For $h \\to 0$ the secant becomes the tangent.'], ['· Mach $h$ kleiner.', '· Make $h$ smaller.'],
        ['$ · Steigung in $P', '$ · gradient at $P'], ['$ · Berührpunkt $P', '$ · point of contact $P'], ['Tangente: $', 'Tangent: $'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normal (perpendicular to the tangent, $m_n = -\\tfrac{1}{m_t}$): $'],
        // kurve
        ['Hochpunkt $', 'Maximum $'], ['Tiefpunkt $', 'Minimum $'], [' · Sattelpunkt bei $x = ', ' · saddle point at $x = '],
        ['Wendepunkt $W', 'Point of inflection $W'], ['$: Dort ist $f\'\'(x) = 0$ und die Steigung ', '$: there $f\'\'(x) = 0$ and the gradient is '],
        ['am kleinsten.', 'smallest.'], ['am größten.', 'largest.'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'For $a = 0$, $f$ is a parabola (or a straight line) without a point of inflection.'],
        // ableiten: task, feedback and the rule given as a hint
        ['Leite ab: $f(x) = ', 'Differentiate: $f(x) = '],
        ['Das kann ich nicht lesen. Schreibe zum Beispiel ', "I can't read that. Write, for example, "],
        ['<b>Richtig!</b>', '<b>Correct!</b>'], ['Noch nicht. Tipp: ', 'Not yet. Hint: '],
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Power rule $(x^n)\' = n\\,x^{n-1}$ and constant multiple rule: the factor stays.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Sum rule: every term is differentiated separately. A constant term drops out.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.', 'The power rule also holds for rational exponents: $(x^r)\' = r\\,x^{r-1}$.'],
        ['$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.', '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ and $(\\sin x)\' = \\cos x$.'],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Sum rule; $\\mathrm{e}^x$ stays $\\mathrm{e}^x$ when you differentiate it.'],
        ['$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.', '$(\\sin x)\' = \\cos x$, and $(c \\cdot x)\' = c$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.', 'Product rule $(u \\cdot v)\' = u\'v + uv\'$ with $u = x$, $v = \\mathrm{e}^x$.'],
        ['Produktregel mit $u = ', 'Product rule with $u = '],
        // steckbrief
        ['Lösung: $f(x) = ', 'Solution: $f(x) = '], ['Ansatz: $f(x) = ', 'Approach: $f(x) = '], ['Probe: $', 'Check: $'],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Careful: at $E$, $f\'\'(x) = 0$, that is a saddle point, not a turning point.'],
        ['< 0$, also ein Hochpunkt.', '< 0$, so a maximum.'], ['> 0$, also ein Tiefpunkt.', '> 0$, so a minimum.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?',
            'With these conditions the system of equations has no unique solution. Two points with the same $x$?'],
        // optimieren
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
            'From a sheet of card measuring 30 cm × 20 cm, squares with side $x$ are cut out at the corners and the edges are folded up. For which $x$ is the volume of the open box largest?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
            'A cylindrical can is to hold 1 litre ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). For which radius $r$ do you need the least tin?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
            'With 60 m of fencing, a rectangular enclosure is to be marked out against a wall. The wall forms one side. What is the largest possible area?'],
        ['Bei $', 'At $'], ['$ ergibt $', '$ gives $'], ['$ mit $', '$ with $'],
        [' Die zweite Lösung $x \\approx ', ' The second solution $x \\approx '], ['$ liegt außerhalb von $0 < x < 10$.', '$ lies outside $0 < x < 10$.'],
        [' Dann ist $h = ', ' Then $h = '], ['$: Die beste Dose ist so hoch wie breit.', '$: the best can is as tall as it is wide.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' The side parallel to the wall is then $60 - 2 \\cdot 15 = 30\\,\\text{m}$ long.'],
        // the surface of the can is S in the English chapter
        ['O(r) = ', 'S(r) = '], ['O\'(r) = ', 'S\'(r) = '], ['$O \\approx', '$S \\approx'],
        // book 3 mathe13-en: schar
        ['keine Extrempunkte', 'no turning points'], ['Ortskurve aller Extrempunkte (violett): $', 'Locus of all turning points (violet): $'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.',
            'For $a \\le 0$ there are no turning points: $f_a\'(x) = 3x^2 - a$ then has no zero with a change of sign.'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Every parabola of the family passes through the origin, because $f_a(0) = 0$ for all $a$.'],
        // book 3 mathe13-en: gewinn
        ['Gewinnschwelle bei $x \\approx ', 'Break-even point at $x \\approx '], ['$, Gewinngrenze bei $x \\approx ', '$, profit limit at $x \\approx '],
        ['$ Stück.', '$ items.'], ['Gewinn ab $x \\approx ', 'Profit from $x \\approx '], ['Bei diesem Preis wird nie Gewinn gemacht.', 'At this price there is never a profit.'],
        ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Maximum profit: $G\'(x) = 0$ at $x \\approx '], ['$ Stück, $G \\approx ', '$ items, $G \\approx '],
        ['Kein positives Gewinnmaximum.', 'No positive maximum profit.'],
        // book 6 mathegy12-en: integrieren
        ['Bestimme eine Stammfunktion: $f(x) = ', 'Find an antiderivative: $f(x) = '],
        ['Noch nicht. Leite deine Lösung zur Probe ab. Tipp: ', 'Not yet. Differentiate your solution to check it. Hint: '],
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.',
            'Power rule backwards: raise the exponent by 1, divide by the new exponent, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.'],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.',
            'Sum and constant multiple rules: every term is integrated separately, a factor stays. A constant $a$ has the antiderivative $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: exponent $\\tfrac12 + 1 = \\tfrac32$, dividing by $\\tfrac32$ means multiplying by $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.', '$: exponent $-1$, divide by $-1$, so $-x^{-1} = -\\tfrac1x$.'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: exponent $\\tfrac12$, dividing by $\\tfrac12$ means doubling.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.',
            'The power rule holds for every exponent $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.'],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ is its own derivative, so it is also its own antiderivative.'],
        ['Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.',
            'The gap in the power rule: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. For $x > 0$, $\\ln x$ is enough.'],
        ['$, also $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.', '$, so $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.'],
        ['$, also $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.', '$, so $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.'],
        ['Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.',
            'Linear substitution: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Check: the chain rule gives the factor $a$, $\\tfrac1a$ cancels it.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: first the antiderivative of $\\sin$, then divide by the inner derivative $a$.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: power rule for the bracket, then divide by the inner derivative.'],
        // book 6 mathegy12-en: abstandmin
        ['Jetzt: $x = ', 'Now: $x = '], ['$ · am kleinsten bei $x \\approx ', '$ · smallest at $x \\approx '], ['$P$ liegt auf der Kurve, der Abstand ist $0$.', '$P$ lies on the curve, the distance is $0$.'],
        ['Die kürzeste Strecke (grün) steht senkrecht auf der Tangente: Winkel $\\approx ', 'The shortest segment (green) is perpendicular to the tangent: angle $\\approx '],
        ['^\\circ$. Deshalb heißt der Punkt auch Lotfußpunkt.', '^\\circ$. That is why the point is also called the foot of the perpendicular.'],
        ['Das Minimum liegt am Rand des Bereichs, dort muss die Strecke nicht senkrecht auf der Tangente stehen.',
            'The minimum lies at the edge of the domain; there the segment does not have to be perpendicular to the tangent.'],
        // book 6 mathegy12-en: geradenschar
        ['Schnitt mit $y = x^2 + 2$: $x^2 - ', 'Intersection with $y = x^2 + 2$: $x^2 - '], ['x + 1 = 0$, Diskriminante $a^2 - 4 = ', 'x + 1 = 0$, discriminant $a^2 - 4 = '],
        ['zwei Schnittpunkte.', 'two points of intersection.'], ['kein gemeinsamer Punkt.', 'no common point.'],
        ['genau ein Punkt, die Gerade <b>berührt</b> die Parabel in $x = ', 'exactly one point, the line <b>touches</b> the parabola at $x = '],
        ['$. Das passiert für $a = \\pm 2$.', '$. This happens for $a = \\pm 2$.'],
        // book 5 mathefos12-en: efunktion (numbers and points are already English here: the number rules run first)
        [' · Steigung in $(0, 1)$: $', ' · gradient at $(0, 1)$: $'],
        ['<b>Treffer:</b> Bei $a = \\mathrm{e} \\approx 2.71828$ ist die Steigung genau $1$ und $f\'(x) = f(x)$: Die Graphen von $f$ und $f\'$ liegen aufeinander.',
            '<b>Hit:</b> at $a = \\mathrm{e} \\approx 2.71828$ the gradient is exactly $1$ and $f\'(x) = f(x)$: the graphs of $f$ and $f\'$ lie on top of each other.'],
        ['Die Ableitung ist $f\'(x) = ', 'The derivative is $f\'(x) = '],
        [' \\cdot f(x)$, ein Vielfaches von $f$. Für welche Basis ist der Faktor genau $1$?', ' \\cdot f(x)$, a multiple of $f$. For which base is the factor exactly $1$?'],
        [' · Mit $a = 0$ oder $b = 0$ ist $f$ konstant.', ' · With $a = 0$ or $b = 0$, $f$ is constant.'],
        ['Schnittpunkt mit der $y$-Achse: $', 'Point of intersection with the $y$-axis: $'], [' · Nullstelle: ', ' · zero: '], ['$, also $x = ', '$, so $x = '],
        ['keine, denn $\\mathrm{e}^{bx} > 0$ kann nicht $', 'none, because $\\mathrm{e}^{bx} > 0$ cannot be $'], ['$ sein', '$'],
        ['Für $', 'For $'], ['$ geht $f(x) \\to ', '$, $f(x) \\to '], ['$: waagerechte Asymptote $y = ', '$: horizontal asymptote $y = '], ['$. Für $', '$. For $'],
        ['$f$ ist überall streng monoton ', '$f$ is everywhere strictly '], ['steigend', 'increasing'], ['fallend', 'decreasing'],
        [', weil $f\'(x)$ immer ', ', because $f\'(x)$ is always '], ['positiv ist.', 'positive.'], ['negativ ist.', 'negative.'],
        ['Ein Euro, 100 % Zinsen im Jahr, ', 'One euro, 100 % interest a year, added '], [' verzinst: ', ': '], ['-mal $\\tfrac{100\\,\\%}{', ' times $\\tfrac{100\\,\\%}{'],
        ['$, also $\\left(1 + \\tfrac{1}{', '$, so $\\left(1 + \\tfrac{1}{'],
        ['jährlich', 'yearly'], ['halbjährlich', 'half-yearly'], ['vierteljährlich', 'quarterly'], ['monatlich', 'monthly'], ['wöchentlich', 'weekly'],
        ['täglich', 'daily'], ['stündlich', 'hourly'], ['minütlich', 'every minute'],
        ['Je öfter verzinst wird, desto näher kommt das Guthaben an $\\mathrm{e} = 2.718281\\ldots$ heran, aber nie darüber: $',
            'The more often interest is added, the closer the balance gets to $\\mathrm{e} = 2.718281\\ldots$, but never beyond it: $'],
        // book 5 mathefos12-en: bruchfunktion
        ['Nullstelle des Zählers $', 'Zero of the numerator $'], ['Nullstelle des Nenners $', 'Zero of the denominator $'],
        ['Nach dem Kürzen steht kein $x$ mehr im Nenner: Der Graph ist ', 'After cancelling there is no $x$ left in the denominator: the graph is '],
        ['eine waagerechte Gerade', 'a horizontal straight line'], ['eine Gerade', 'a straight line'], ['Löchern', 'holes'], ['einem Loch', 'a hole'],
        ['Zählergrad kleiner als Nennergrad: waagerechte Asymptote $y = 0$, die $x$-Achse.', 'Degree of the numerator less than degree of the denominator: horizontal asymptote $y = 0$, the $x$-axis.'],
        ['Zählergrad gleich Nennergrad: waagerechte Asymptote $y = ', 'Degree of the numerator equal to degree of the denominator: horizontal asymptote $y = '],
        ['$ (Quotient der Leitkoeffizienten).', '$ (quotient of the leading coefficients).'],
        ['Zählergrad um 1 größer: Polynomdivision ergibt $f(x) = ', 'Degree of the numerator 1 higher: polynomial division gives $f(x) = '],
        ['$, schiefe Asymptote $y = ', '$, oblique asymptote $y = '],
        ['Kürzen: $f(x) = ', 'Cancelling: $f(x) = '], ['$ · hebbare Lücken', '$ · removable holes'], ['$ · hebbare Lücke', '$ · removable hole'],
        ['Nullstellen: ', 'Zeros: '], [' · Polstellen: ', ' · poles: '],
        [' mit Vorzeichenwechsel', ' with a change of sign'], [' ohne Vorzeichenwechsel', ' without a change of sign'], [' (senkrechte Asymptote)', ' (vertical asymptote)'],
    ],
    rule: [
        // ableiten: "3 von 5 gelöst"
        [/(\d+) von (\d+) gelöst/g, '$1 of $2 solved'],
        // book 6 mathegy12-en: abstandmin, the general point Q(x | f(x))
        [/\$Q\(x \\mid f\(x\)\)\$/g, '$Q(x, f(x))$'],
        // book 5 mathefos12-en: efunktion, "525.600-mal" (toLocaleString('de-DE')) → "525,600 times"
        [/(\d{1,3})\.(\d{3})(?=-mal )/g, '$1,$2'],
        // book 5 mathefos12-en: bruchfunktion, "… mit einem Loch." and "Nullstellen: keine" (the pieces alone are in tools/buch-en/known.json)
        [/ mit (Löchern|einem Loch)\./g, (m, w) => ' with ' + (w === 'Löchern' ? 'holes' : 'a hole') + '.'],
        [/(Nullstellen|Polstellen): keine(?![a-zäöüß])/g, '$1: none'],
    ]
});
