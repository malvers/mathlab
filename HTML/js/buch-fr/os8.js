/* js/buch-fr/os8.js — French for the widgets of js/buch-os8.js.
 * Loaded by the French editions right after js/buch-os8.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/os8.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os8', {
    word: {
        // book fr-19 mathe8-fr:
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Couverture : deux droites sécantes, un cylindre de révolution en perspective cavalière, une homothétie, un arbre pondéré et un plateau de pédalier',
        // termwertos8 (the sentences with "Für $x = …$" are rules below)
        'Termpaar': 'Paire d’expressions', 'Einsetzen: $x$': 'Valeur de $x$',
        // flaecheos8 ('Länge $b$' as in js/buch-fr/gleichungen.js, 'Darstellung' as in js/buch-fr/gy7.js: modules this page does not load)
        'Term': 'Expression', 'Darstellung': 'Représentation', 'mit Zahlen': 'avec des nombres', 'mit x': 'avec x',
        'Faktor $a$': 'Facteur $a$', 'Länge $b$': 'Longueur $b$', 'Länge $c$': 'Longueur $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Rectangle de hauteur a partagé en deux parties : a fois (b plus c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Rectangle de hauteur a partagé en deux parties : a fois (b moins c)',
        // linearos8: the collège letters a (German m) and b (German n), as BuchFR.college does for gerade and lage
        'Steigung $m$': 'Coefficient directeur $a$', 'y-Achsenabschnitt $n$': 'Ordonnée à l’origine $b$',
        'Graph einer proportionalen Funktion mit Steigungsdreieck': 'Courbe d’une fonction linéaire avec le triangle de pente',
        'Graph einer linearen Funktion mit Steigungsdreieck': 'Courbe d’une fonction affine avec le triangle de pente',
        'Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.': 'La courbe est une droite qui passe par l’origine $(0\\,;\\,0)$.',
        // lgsgrafos8 ('Nächster Schritt', 'Von vorn' as in js/buch-fr/gy5.js and gy6.js, modules this page does not load)
        'Gleichungssystem': 'Système d’équations', 'Nächster Schritt': 'Étape suivante', 'Alle Schritte': 'Toutes les étapes', 'Von vorn': 'Recommencer',
        'Zwei Geraden eines Gleichungssystems im Koordinatensystem': 'Deux droites d’un système d’équations dans un repère',
        'Unendlich viele Lösungen.': 'Une infinité de solutions.', 'Keine Lösung: $L = \\{\\,\\}$': 'Aucune solution : $S = \\{\\,\\}$',
        // tarifos8
        'Handy': 'Téléphone', 'Strom': 'Électricité', 'Carsharing': 'Autopartage', 'Minuten': 'minutes', 'kWh im Jahr': 'kWh par an', 'Kilometer': 'kilomètres',
        '€ pro Minute': '€ par minute', '€ pro kWh': '€ par kWh', '€ pro km': '€ par km',
        'Tarif A: Grundgebühr': 'Tarif A : abonnement', 'Tarif B: Grundgebühr': 'Tarif B : abonnement',
        'Tarif A: € pro Minute': 'Tarif A : € par minute', 'Tarif B: € pro Minute': 'Tarif B : € par minute',
        'Tarif A: € pro kWh': 'Tarif A : € par kWh', 'Tarif B: € pro kWh': 'Tarif B : € par kWh',
        'Tarif A: € pro km': 'Tarif A : € par km', 'Tarif B: € pro km': 'Tarif B : € par km',
        'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch': 'Coût des tarifs A et B en fonction de la consommation',
        // kreisflaecheos8 (the perimeter is P, as everywhere in the French editions)
        'Anzahl der Stücke $n$': 'Nombre de parts $n$',
        // rosetteos8
        'Hilfslinien ein/aus': 'Traits de construction oui/non', 'Zweiter Ring ein/aus': 'Deuxième rangée oui/non', 'Anzahl der Blätter $n$': 'Nombre de pétales $n$',
        'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.':
            'Avec 6 pétales, tout tombe juste : le rayon se reporte exactement six fois sur le cercle. Chaque arc centré en l’un des points passe par le centre et par les deux points voisins. Les pétales se touchent tout juste.',
        // zylinderos8 (the French letters of GY 9: base 𝓑, lateral area A_L, total area A, perimeter P; 'Schrägbild', 'Netz',
        // 'Größe' as in js/buch-fr/gy7.js and gy5.js, modules this page does not load; 'Körper', 'Radius $r$', 'Höhe $h$' are in geometrie.js)
        'Kreiszylinder': 'Cylindre plein', 'Hohlzylinder': 'Cylindre creux', 'Schrägbild': 'Perspective cavalière', 'Netz': 'Patron',
        'Material': 'Matériau', 'Holz': 'Bois', 'Aluminium': 'Aluminium', 'Stahl': 'Acier', 'Innenradius $r_i$': 'Rayon intérieur $r_i$',
        'Mantel': 'Surface latérale', 'u = 2πr': 'P = 2πr', 'Größe': 'Grandeur', 'Formel und Wert': 'Formule et valeur',
        'Grundfläche (Kreisring)': 'Base (couronne)', 'Außenmantel': 'Surface latérale extérieure', 'Innenmantel': 'Surface latérale intérieure',
        'Oberfläche': 'Aire totale', 'Volumen': 'Volume', 'Grundfläche': 'Aire de la base',
        'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.':
            'La surface latérale est un rectangle : aussi large que le périmètre du cercle de base, aussi haut que le cylindre.',
        'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.':
            'En perspective cavalière, le cercle de base devient une ellipse aplatie. Les traits cachés sont en pointillés.',
    },
    phrase: [
        // book fr-19 mathe8-fr:
        // termwertos8
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'La même valeur sur toutes les lignes. Le tableau ne le démontre pas, mais une transformation le montre : les expressions sont <b>équivalentes</b>.'],
        // flaecheos8 (the products are \times already: the rule of js/buch-fr/geometrie.js runs before the pieces)
        ['Ausmultiplizieren: ', 'Développer : '], ['Ausklammern, von rechts nach links gelesen: $', 'Factoriser, en lisant de droite à gauche : $'],
        ['Vom ganzen Rechteck $a \\times b$ wird der schraffierte Streifen $a \\times c$ abgezogen.', 'Du rectangle entier $a \\times b$, on retire la bande hachurée $a \\times c$.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'Le rectangle entier a la même aire que ses deux parties réunies.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Chaque terme entre les parenthèses est multiplié par le facteur $a$.'],
        // linearos8
        ['Der Graph verläuft <b>waagerecht</b>.', 'La courbe est <b>horizontale</b>.'],
        ['Jede Stelle ist eine Nullstelle.', 'Tout nombre est un zéro.'], ['Es gibt keine Nullstelle.', 'Il n’y a aucun zéro.'],
        ['Nullstelle (türkis): $0 = ', 'Zéro (turquoise) : $0 = '], ['$, also $x_0 = ', '$, donc $x_0 = '],
        ['Schnittpunkt mit der y-Achse (weiß): $', 'Point d’intersection avec l’axe des ordonnées (blanc) : $'],
        // lgsgrafos8 (after the point rule, every \mid is the French semicolon already; the letter b of the collège for the German n)
        ['<b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ', '<b>Étape 1 :</b> isoler $y$ dans les deux équations : $y = '],
        ['$ und $y = ', '$ et $y = '],
        ['<b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0\\,;\\,n)$, dann mit dem Steigungsdreieck weiter.',
            '<b>Étape 2 :</b> tracer les deux droites : partir de $(0\\,;\\,b)$, puis continuer avec le triangle de pente.'],
        ['$. Probe: $', '$. Vérification : $'], ['Genau eine Lösung: $S = ', 'Exactement une solution : $S = '],
        ['<b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.',
            '<b>Étape 3 :</b> les deux équations décrivent <b>la même droite</b>. Chacun de ses points vérifie les deux équations.'],
        ['<b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.',
            '<b>Étape 3 :</b> même coefficient directeur, ordonnées à l’origine différentes : les droites sont <b>parallèles</b> et ne se coupent jamais.'],
        // tarifos8
        ['Tarif A: $y = ', 'Tarif A : $y = '], ['Tarif B: $y = ', 'Tarif B : $y = '],
        ['($x$ in Minuten, $y$ in €)', '($x$ en minutes, $y$ en €)'], ['($x$ in kWh im Jahr, $y$ in €)', '($x$ en kWh par an, $y$ en €)'],
        ['($x$ in Kilometer, $y$ in €)', '($x$ en kilomètres, $y$ en €)'],
        ['Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ', 'Les deux tarifs coûtent autant par unité, les droites sont parallèles. '],
        ['Die Tarife sind gleich teuer.', 'Les deux tarifs coûtent autant.'],
        ['Gleichsetzen: $', 'En égalant : $'], ['$ ergibt $x \\approx ', '$ donne $x \\approx '], ['$. Dann kosten beide etwa $', '$. Les deux coûtent alors environ $'],
        // kreisflaecheos8 (the products are \times already)
        ['\\,\\%$ von $r$), ', '\\,\\%$ de $r$), '],
        ['seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\times r$. Je mehr Stücke, desto genauer stimmt es:',
            'sa longueur est la moitié du périmètre, $\\dfrac{P}{2} = \\pi \\times r$. Plus il y a de parts, plus c’est exact :'],
        // rosetteos8
        ['Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ',
            'Chaque pétale est formé de deux arcs de cercle de rayon $r$ qui vont du centre à un point du cercle. Les points partagent le cercle en '],
        ['Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.', 'Comme chaque pétale a une largeur de $60^\\circ$, il reste des trous avec moins de 6 pétales.'],
        ['Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.', 'Comme chaque pétale a une largeur de $60^\\circ$, les pétales se chevauchent quand il y en a plus de 6.'],
        // zylinderos8: the mass row
        ['Masse (Holz, $', 'Masse (bois, $'], ['Masse (Aluminium, $', 'Masse (aluminium, $'], ['Masse (Stahl, $', 'Masse (acier, $'],
    ],
    rule: [
        // book fr-19 mathe8-fr:
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$" / "und $…$." on the second line, the verdict and "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = ([^$]+)\$ ist \$/g, 'Pour $x = $1$ : $'],
        [/(<p style="margin:4px 0 0">)und \$/g, '$1et $'],
        [/Für \$x = ([^$]+)\$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig<\/b>\./g, 'Pour $x = $1$, les valeurs sont différentes : les expressions <b>ne sont pas équivalentes</b>.'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' Qu’elles coïncident sur ' + n + (n === '1' ? ' ligne' : ' lignes') + ' ne suffit pas.'],
        // flaecheos8: "Probe mit $x = 5$: $3 \times (5 + 2) = 21$ und $3 \times 5 + 6 = 21$."
        [/Probe mit \$x = ([^$]+)\$: (\$[^$]+\$) und (\$[^$]+\$)\./g, 'Vérification avec $x = $1$ : $2 et $3.'],
        // linearos8: the trend sentence, and the slope triangle's label on the canvas ("m = 0,5" → "a = 0,5", the collège letter)
        [/Der Graph <b>steigt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach oben\./g, 'La courbe <b>monte</b> : quand on avance de 1 vers la droite, elle monte de $1.'],
        [/Der Graph <b>fällt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach unten\./g, 'La courbe <b>descend</b> : quand on avance de 1 vers la droite, elle descend de $1.'],
        [/^m = (?=[-−]?\d)/, 'a = '],
        // lgsgrafos8, tarifos8: the example buttons; the solution set is S (gleichungen.js, which this page does not load, has its own rule)
        [/\bBeispiel (\d+)\b/g, 'Exemple $1'],
        [/\$L = (?=\\\{)/g, () => '$S = '],
        // lgsgrafos8: the point is read off without a letter (I and II are the equations here)
        [/<b>Schritt 3:<\/b> Schnittpunkt ablesen: \$S\(/g, () => '<b>Étape 3 :</b> lire le point d’intersection : $('],
        // tarifos8
        [/Die Geraden schneiden sich nicht bei positivem Verbrauch: Tarif ([AB]) ist immer günstiger\./g, 'Les droites ne se coupent pas pour une consommation positive : le tarif $1 est toujours le plus avantageux.'],
        [/Tarif ([AB]) ist immer günstiger\./g, 'Le tarif $1 est toujours le plus avantageux.'],
        [/Bis etwa ([\d.,]+) (min|kWh|km) ist Tarif ([AB]) günstiger, darüber Tarif ([AB])\./g, 'Jusqu’à environ $1 $2, le tarif $3 est plus avantageux, au-delà le tarif $4.'],
        // kreisflaecheos8: the picture's label "u : 2 = π · r" and the sentences with the number of pieces
        [/>u : 2 = π · r</g, '>P : 2 = π × r<'],
        [/Ein Kreis in (\d+) Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt/g, 'Un disque découpé en $1 parts posées côte à côte, tête-bêche'],
        [/Die (\d+) Stücke bilden fast ein Rechteck\. Seine Höhe ist fast der Radius \$r\$ \(hier \$/g, 'Les $1 parts forment presque un rectangle. Sa hauteur est presque le rayon $r$ (ici $'],
        // rosetteos8
        [/Rosette mit (\d+) Blättern, mit dem Zirkel konstruiert/g, 'Rosace à $1 pétales construite au compas'],
        [/ gleiche Teile von je \$([\d{},]+)\^\\circ\$\. /g, (m, d) => ' parties égales de $' + d + '^\\circ$ chacune. '],
        // zylinderos8: the picture's label, and the letters of the table (A_G → 𝓑, A_M → A_L, A_Mi → A_L,i, O → A), tied to its table with "A_G = \pi" (the labels between two tags are parked as words before the rules run)
        [/(Hohlzylinder|Kreiszylinder) mit dem Radius ([\d,]+) cm und der Höhe ([\d,]+) cm/g,
            (m, k, r, h) => (k === 'Hohlzylinder' ? 'Cylindre creux' : 'Cylindre') + ' de rayon ' + r + ' cm et de hauteur ' + h + ' cm'],
        [/<table class="b-table g-tab">(?:(?!<\/table>)[\s\S])*?A_G = \\pi[\s\S]*?<\/table>/g,
            t => t.replace(/A_\{Mi\}/g, 'A_{L,i}').replace(/A_\{?M\}?/g, 'A_L').replace(/A_G/g, '\\mathcal{B}').replace(/\$O = /g, '$A = ').replace(/2 \\mathcal\{B\}/g, '2\\mathcal{B}')],
    ]
});
