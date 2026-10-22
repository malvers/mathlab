/* js/buch-fr/analysis.js — French for the widgets of js/buch-analysis.js.
 * Loaded by the French editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the covers of the start pages, the helpers of the module (the strings outside
 * every widget, which every book that loads it meets) and the block comments. Five books are translated at the same
 * time, each has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/analysis.js shows which
 * German strings the widgets write.
 */
window.BuchFR && BuchFR.add('analysis', {
    word: {
        // fr0: the cover of the start page (BGY 12 mathe12, FOS 12 mathefos12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Couverture : courbe avec sa tangente au point d’inflexion et sa dérivée, loi binomiale et un vecteur de l’espace',
        'Titelbild: Exponentialkurve mit Hochpunkt, Wendetangente und Rechtecken darunter, eine Hyperbel mit Asymptoten und ein Parallelogramm im Raum mit seinem Vektorprodukt':
            'Couverture : courbe exponentielle avec son maximum, sa tangente au point d’inflexion et des rectangles en dessous, une hyperbole avec ses asymptotes et un parallélogramme de l’espace avec son produit vectoriel',
        // fr0: the helpers of the module (outside every widget; check.mjs analysis/*), shared by the four books that load it
        'Karton mit ausgeschnittenen Ecken': 'Carton aux coins découpés',
        'Zylindrische Dose': 'Boîte de conserve cylindrique',
        'Gehege an einer Mauer': 'Enclos le long d’un mur',
        'Mauer': 'mur',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        'Spur löschen': 'Effacer la trace',
        'Neue Aufgabe': 'Nouvel exercice',
        'Annäherung, Schritt $k$': 'Approche, étape $k$',
        'Graph mit Annäherung an einen Grenzwert': 'Courbe qui s’approche d’une limite',
        'Annäherung:': 'Approche :',
        'Richtung': 'Sens',
        '$x$ links': '$x$ à gauche',
        '$x$ rechts': '$x$ à droite',
        'Abstand $h$ von $P$ zu $Q$': 'Écart $h$ entre $P$ et $Q$',
        'Tangente zeigen': 'Afficher la tangente',
        'Tangente ausblenden': 'Masquer la tangente',
        'Sekante durch P und Q nähert sich der Tangente': 'La sécante passant par P et Q s’approche de la tangente',
        'Ganzen Graphen von f′ zeigen': 'Afficher toute la courbe de f′',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.': 'En haut : f avec sa tangente. Déplace le point P. En bas : chaque pente de tangente devient un point de la courbe de f′.',
        'Graph von f mit Tangente': 'Courbe de f avec sa tangente',
        'Graph der Ableitung f Strich': 'Courbe de la dérivée f prime',
        'Potenzen': 'Puissances',
        'Summen': 'Sommes',
        'Wurzeln und Brüche': 'Racines et fractions',
        'eˣ und sin x': 'eˣ et sin x',
        'Produkte': 'Produits',
        'Gemischt': 'Mélangé',
        'Aufgabenart': 'Type d’exercice',
        'Lösung': 'Solution',
        'Zeige auch:': 'Afficher aussi :',
        'f′ und f″': 'f′ et f″',
        'Ableitungen zeigen': 'Afficher les dérivées',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Courbe d’une fonction de degré 3 avec extremums et point d’inflexion',
        'fällt ↘': 'décroît ↘',
        'nur f': 'seulement f',
        'steigt ↗': 'croît ↗',
        'konstant': 'constante',
        'x in cm': 'x en cm',
        'V in cm³': 'V en cm³',
        'r in cm': 'r en cm',
        'O in cm²': 'O en cm²',
        'x in m': 'x en m',
        'A in m²': 'A en m²',
        'Intervall': 'Intervalle',
        'Tangente und Normale an einen Graphen': 'Tangente et normale à une courbe',
        'Parabel durch 3 Punkte': 'Parabole par 3 points',
        'Kubisch: Extrempunkt + 2 Punkte': 'Degré 3 : extremum + 2 points',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Degré 3 : point d’inflexion avec tangente + point',
        'Bedingungen': 'Conditions',
        'Steigung im Wendepunkt $m$': 'Pente au point d’inflexion $m$',
        'Funktion aus Bedingungen': 'Fonction à partir de conditions',
        'Schachtel': 'Boîte',
        'Maximum': 'Maximum',
        'Dose': 'Boîte de conserve',
        'Minimum': 'Minimum',
        'Zaun an der Mauer': 'Clôture le long d’un mur',
        'Problem': 'Problème',
        'Zielfunktion': 'Fonction à optimiser',
        'Lösung mit der Ableitung': 'Solution par la dérivée',
        'z. B. 6x^2 - 2 oder cos x': 'p. ex. 6x^2 - 2 ou cos x',
        // book fr-3 mathe13-fr:
        'Funktionenschar': 'Famille de fonctions',
        'Funktionenschar mit Ortskurve': 'Famille de fonctions avec lieu des points',
        'Parameter $a$': 'Paramètre $a$',
        'Verkaufspreis $p$ (€ pro Stück)': 'Prix de vente $p$ (€ par unité)',
        'x in Stück': 'x en unités',
        'Kosten, Erlös und Gewinn': 'Coût, recette et bénéfice',
        // schar: the short labels of the extrema (also BGY 12, kurve: keep one copy when merging with fr-2)
        'Hochpunkt': 'Maximum', 'Tiefpunkt': 'Minimum', 'keine Extrempunkte': 'aucun extremum',
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // fr0: the helpers of the module (outside every widget; check.mjs analysis/*), shared by the four books that load it
        // the rules of the derivative and integral tasks (ableiten, integrieren: "Tipp: …" and below the solution)
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Règle des puissances $(x^n)\' = n\\,x^{n-1}$ et règle du facteur constant : le facteur reste.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Règle de la somme : chaque terme se dérive séparément. Un terme constant disparaît.'],
        ['$\\sqrt{x} = x^{\\frac12}$, also $(\\sqrt{x})\' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.', '$\\sqrt{x} = x^{\\frac12}$, donc $(\\sqrt{x})\' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.'],
        ['$\\tfrac{1}{x} = x^{-1}$, also $(x^{-1})\' = -x^{-2} = -\\dfrac{1}{x^2}$.', '$\\tfrac{1}{x} = x^{-1}$, donc $(x^{-1})\' = -x^{-2} = -\\dfrac{1}{x^2}$.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.', 'La règle des puissances vaut aussi pour les exposants rationnels : $(x^r)\' = r\\,x^{r-1}$.'],
        ['$\\tfrac{1}{x^2} = x^{-2}$, also $(x^{-2})\' = -2x^{-3}$.', '$\\tfrac{1}{x^2} = x^{-2}$, donc $(x^{-2})\' = -2x^{-3}$.'],
        ['$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.', '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ et $(\\sin x)\' = \\cos x$.'],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Règle de la somme ; $\\mathrm{e}^x$ reste $\\mathrm{e}^x$ quand on dérive.'],
        ['$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.', '$(\\sin x)\' = \\cos x$, et $(c \\cdot x)\' = c$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.', 'Règle du produit $(u \\cdot v)\' = u\'v + uv\'$ avec $u = x$, $v = \\mathrm{e}^x$.'],
        ['Produktregel mit $u = ', 'Règle du produit avec $u = '],
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.', 'Règle des puissances à l’envers : augmenter l’exposant de 1, diviser par le nouvel exposant, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.'],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.', 'Règles de la somme et du facteur constant : chaque terme s’intègre séparément, un facteur reste. Une constante $a$ a pour primitive $ax$.'],
        ['$\\sqrt{x} = x^{\\frac12}$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$\\sqrt{x} = x^{\\frac12}$ : exposant $\\tfrac12 + 1 = \\tfrac32$ ; diviser par $\\tfrac32$, c’est multiplier par $\\tfrac23$.'],
        ['$\\tfrac{1}{x^2} = x^{-2}$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.', '$\\tfrac{1}{x^2} = x^{-2}$ : exposant $-1$, diviser par $-1$, donc $-x^{-1} = -\\tfrac1x$.'],
        ['$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$ : exposant $\\tfrac12$ ; diviser par $\\tfrac12$, c’est doubler.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.', 'La règle des puissances vaut pour tout exposant $r \\neq -1$ : $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.'],
        ['$\\mathrm{e}^x$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$\\mathrm{e}^x$ est sa propre dérivée, donc aussi sa propre primitive.'],
        ['Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.', 'L’exception de la règle des puissances : $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Pour $x > 0$, $\\ln x$ suffit.'],
        ['$(\\cos x)\' = -\\sin x$, also $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.', '$(\\cos x)\' = -\\sin x$, donc $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.'],
        ['$(\\sin x)\' = \\cos x$, also $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.', '$(\\sin x)\' = \\cos x$, donc $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.'],
        ['Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', 'Composée avec une fonction affine : $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Vérification : la règle de la chaîne donne le facteur $a$, que $\\tfrac1a$ compense.'],
        ['$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$ : d’abord la primitive de $\\sin$, puis diviser par la dérivée intérieure $a$.'],
        ['$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$ : règle des puissances pour la parenthèse, puis diviser par la dérivée intérieure.'],
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        ['$ mit $', '$ avec $'],
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$', 'vers $-\\infty$ à gauche, vers $+\\infty$ à droite : pas de limite, asymptote verticale $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'croît au-delà de toute borne : $f(x) \\to \\infty$, pas de limite'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', 'En $x = 0$, $f$ n’est pas définie. Les valeurs s’approchent pourtant autant qu’on veut de 1.'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.', 'En $x = 1$, $f$ n’est pas définie : la courbe y a un trou. La limite existe pourtant : en simplifiant, $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'La courbe oscille autour de l’axe des abscisses, et les oscillations deviennent de plus en plus petites.'],
        ['Waagerechte Asymptote: $y = ', 'Asymptote horizontale : $y = '],
        ['$ mit $h = ', '$ avec $h = '],
        ['Tangentensteigung: $', 'Pente de la tangente : $'],
        ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· Pour $h \\to 0$, la sécante devient la tangente.'],
        ['· Mach $h$ kleiner.', '· Diminue $h$.'],
        ['$ · Steigung in $P', '$ · pente en $P'],
        ['Leite ab: $f(x) = ', 'Dérive : $f(x) = '],
        ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Je ne peux pas lire cela. Écris par exemple '],
        ['<b>Richtig!</b>', '<b>Correct !</b>'],
        ['Noch nicht. Tipp: ', 'Pas encore. Indice : '],
        [' · Sattelpunkt bei $x = ', ' · point d’inflexion à tangente horizontale en $x = '],
        ['Wendepunkt $W', 'Point d’inflexion $W'],
        ['Hochpunkt $', 'Maximum $'],
        ['Tangente: $', 'Tangente : $'],
        ['$: $f\'(', '$ : $f\'('],
        ['Tiefpunkt $', 'Minimum $'],
        ['keine Extrempunkte', 'pas d’extremum'],
        ['Sekantensteigung (Differenzenquotient): $', 'Pente de la sécante (taux d’accroissement) : $'],
        ['$ ergibt $', '$ donne $'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung ', '$ : là, $f\'\'(x) = 0$ et la pente est '],
        ['am kleinsten', 'minimale'],
        ['am größten', 'maximale'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Pour $a = 0$, $f$ est une parabole (ou une droite) sans point d’inflexion.'],
        ['$ · Berührpunkt $P', '$ · point de contact $P'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normale (perpendiculaire à la tangente, $m_n = -\\tfrac{1}{m_t}$) : $'],
        ['Lösung: $f(x) = ', 'Solution : $f(x) = '],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Attention : en $E$, $f\'\'(x) = 0$ ; c’est un point d’inflexion à tangente horizontale, pas un extremum.'],
        ['Probe: $', 'Vérification : $'],
        ['< 0$, also ein Hochpunkt.', '< 0$, donc un maximum.'],
        ['> 0$, also ein Tiefpunkt.', '> 0$, donc un minimum.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?', 'Avec ces conditions, le système d’équations n’a pas de solution unique. Deux points de même abscisse $x$ ?'],
        ['Ansatz: $f(x) = ', 'Mise en équation : $f(x) = '],
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?', 'Dans un carton de 30 cm × 20 cm, on découpe aux coins des carrés de côté $x$ et on relève les bords. Pour quelle valeur de $x$ le volume de la boîte ouverte est-il maximal ?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?', 'Une boîte de conserve cylindrique doit contenir 1 litre ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Pour quel rayon $r$ faut-il le moins de tôle ?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?', 'Avec 60 m de clôture, on veut délimiter un enclos rectangulaire le long d’un mur. Le mur forme un côté. Quelle aire maximale peut-on obtenir ?'],
        [' Die zweite Lösung $x \\approx ', ' La seconde solution $x \\approx '],
        ['$ liegt außerhalb von $0 < x < 10$.', '$ est en dehors de $0 < x < 10$.'],
        [' Dann ist $h = ', ' Alors $h = '],
        ['$: Die beste Dose ist so hoch wie breit.', '$ : la meilleure boîte est aussi haute que large.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' Le côté parallèle au mur mesure alors $60 - 2 \\cdot 15 = 30\\,\\text{m}$.'],
        // book fr-3 mathe13-fr:
        [' Ortskurve der Extrempunkte zeigen', ' Afficher le lieu des extremums'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.', 'Pour $a \\le 0$, il n’y a pas d’extremum : $f_a\'(x) = 3x^2 - a$ n’a alors aucun zéro avec changement de signe.'],
        [' mit Vorzeichenwechsel', ' avec changement de signe'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Chaque parabole de la famille passe par l’origine, car $f_a(0) = 0$ pour tout $a$.'],
        ['Ortskurve aller Extrempunkte (violett): $', 'Lieu de tous les extremums (en violet) : $'],
        ['Gewinnschwelle bei $x \\approx ', 'Seuil de rentabilité en $x \\approx '],
        ['$, Gewinngrenze bei $x \\approx ', '$, limite de rentabilité en $x \\approx '],
        ['$ Stück, $G \\approx ', '$ unités, $G \\approx '],
        ['$ Stück.', '$ unités.'],
        ['Gewinn ab $x \\approx ', 'Bénéfice à partir de $x \\approx '],
        ['Bei diesem Preis wird nie Gewinn gemacht.', 'À ce prix, on ne fait jamais de bénéfice.'],
        ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Bénéfice maximal : $G\'(x) = 0$ en $x \\approx '],
        ['Kein positives Gewinnmaximum.', 'Pas de bénéfice maximal positif.'],
        // schar: the list of extrema after other text, and the note with its "$. " in front (wins over a shorter piece "$. Für $" of another book)
        ['Hochpunkt $', 'Maximum $'], ['Tiefpunkt $', 'Minimum $'], ['keine Extrempunkte', 'aucun extremum'],
        ['$. Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.',
            '$. Pour $a \\le 0$, il n’y a pas d’extremum : $f_a\'(x) = 3x^2 - a$ n’a alors aucun zéro avec changement de signe.'],
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // kurve: the sliders "$a$ (vor $x^3$)" → "$a$ (coefficient de $x^3$)"
        [/\(vor (\$x(?:\^\d)?\$)\)/g, '(coefficient de $1)'],
        // ableiten: "3 von 5 gelöst"
        [/(\d+) von (\d+) gelöst/g, '$1 sur $2 résolus'],
        // grenzwert: "$f(x) = …$ für $x \to …$"; optimieren: "Bei $x = 2\,\text{cm}$: $V \approx …$" and "(Maximum)."
        [/\$ für \$x \\to /g, '$ pour $x \\to '],
        [/(<p style="margin:0">)Bei (\$[^$]*\$): \$/g, '$1Pour $2\u00a0: $'],
        [/ \((Maximum|Minimum)\)\./g, (m, k) => ' (' + k.toLowerCase() + ').'],
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
