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
    ],
    rule: [
        // ableiten: "3 von 5 gelöst"
        [/(\d+) von (\d+) gelöst/g, '$1 of $2 solved'],
    ]
});
