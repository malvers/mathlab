/* js/buch-en/os8.js — English for the widgets of js/buch-os8.js.
 * Loaded by the English editions right after js/buch-os8.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('os8', {
    word: {
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Cover: two intersecting lines, a cylinder in an oblique drawing, a central dilation, a tree diagram and a chainring',
        // kreisflaecheos8
        'Anzahl der Stücke $n$': 'Number of pieces $n$',
        // zylinderos8
        'Kreiszylinder': 'Cylinder', 'Hohlzylinder': 'Hollow cylinder', 'Körper': 'Solid', 'Schrägbild': 'Oblique drawing', 'Netz': 'Net',
        'Darstellung': 'Display', 'Material': 'Material', 'Holz': 'Wood', 'Aluminium': 'Aluminium', 'Stahl': 'Steel',
        'Radius $r$': 'Radius $r$', 'Innenradius $r_i$': 'Inner radius $r_i$', 'Höhe $h$': 'Height $h$', 'Mantel': 'Curved surface',
        'Grundfläche (Kreisring)': 'Base (annulus)', 'Außenmantel': 'Outer curved surface', 'Innenmantel': 'Inner curved surface',
        'Oberfläche': 'Surface area', 'Volumen': 'Volume', 'Grundfläche': 'Base area', 'Größe': 'Quantity', 'Formel und Wert': 'Formula and value',
        'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.':
            'The curved surface is a rectangle: as wide as the circumference of the base circle, as high as the cylinder.',
        'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.':
            'In the oblique drawing the base circle becomes a flat ellipse. Hidden lines are dashed.',
        // stromos8
        'Verbrauch im Jahr': 'Consumption per year', 'Arbeitspreis in ct/kWh': 'Unit price in ct/kWh', 'Grundpreis im Monat': 'Standing charge per month',
        'Abschlag im Monat': 'Instalment per month', 'Kosten': 'Costs', 'gezahlt': 'paid',
        'Balken: Jahreskosten aus Arbeitspreis und Grundpreis gegen die gezahlten Abschläge':
            'Bars: yearly costs from the unit price and the standing charge against the instalments paid',
        'Arbeitspreis': 'Unit price', 'Grundpreis': 'Standing charge', 'Jahreskosten': 'Yearly costs', 'Abschläge': 'Instalments',
        // fahrrados8
        'Reifengröße': 'Tyre size', 'Kettenblatt vorn (Zähne)': 'Chainring at the front (teeth)', 'Ritzel hinten (Zähne)': 'Sprocket at the back (teeth)',
        'Trittfrequenz (pro Minute)': 'Cadence (per minute)', 'Übersetzung': 'Gear ratio', 'Radumfang': 'Wheel circumference',
        'Weg pro Kurbelumdrehung': 'Distance per crank turn', 'Geschwindigkeit': 'Speed', 'Kurbelumdrehungen pro km': 'Crank turns per km',
        'Vereinfacht ist hier der Raddurchmesser die Zollangabe mal $2{,}54\\,\\text{cm}$. Großes Kettenblatt und kleines Ritzel: schnell, aber schwer zu treten.':
            'To keep it simple, the wheel diameter here is the size in inches times $2.54\\,\\text{cm}$. Big chainring and small sprocket: fast, but hard to pedal.',
        // termwertos8
        'Termpaar': 'Pair of terms', 'Einsetzen: $x$': 'Substitute: $x$',
        // flaecheos8
        'Term': 'Term', 'mit Zahlen': 'with numbers', 'mit x': 'with x', 'Faktor $a$': 'Factor $a$', 'Länge $b$': 'Length $b$', 'Länge $c$': 'Length $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Rectangle with the height a, split into two parts: a times (b plus c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Rectangle with the height a, split into two parts: a times (b minus c)',
        // linearos8
        'Steigung $m$': 'Gradient $m$', 'y-Achsenabschnitt $n$': 'y-intercept $n$',
        'Graph einer proportionalen Funktion mit Steigungsdreieck': 'Graph of a proportional function with a gradient triangle',
        'Graph einer linearen Funktion mit Steigungsdreieck': 'Graph of a linear function with a gradient triangle',
        'Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.': 'The graph is a straight line through the origin $(0, 0)$.',
        // lgsgrafos8
        'Gleichungssystem': 'System of equations', 'Nächster Schritt': 'Next step', 'Alle Schritte': 'All steps', 'Von vorn': 'Start again',
        'Zwei Geraden eines Gleichungssystems im Koordinatensystem': 'Two lines of a system of equations in the coordinate system',
        'Unendlich viele Lösungen.': 'Infinitely many solutions.', 'parallel': 'parallel', 'identisch': 'identical',
        // tarifos8
        'Beispiel': 'Example', 'Handy': 'Mobile phone', 'Strom': 'Electricity', 'Carsharing': 'Car sharing',
        'Minuten': 'minutes', 'kWh im Jahr': 'kWh per year', 'Kilometer': 'kilometres',
        'Tarif A: Grundgebühr': 'Tariff A: basic fee', 'Tarif B: Grundgebühr': 'Tariff B: basic fee',
        'Tarif A: € pro Minute': 'Tariff A: € per minute', 'Tarif B: € pro Minute': 'Tariff B: € per minute',
        'Tarif A: € pro kWh': 'Tariff A: € per kWh', 'Tarif B: € pro kWh': 'Tariff B: € per kWh',
        'Tarif A: € pro km': 'Tariff A: € per km', 'Tarif B: € pro km': 'Tariff B: € per km',
        'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch': 'Costs of the tariffs A and B depending on the consumption',
        // rosetteos8
        'Hilfslinien ein/aus': 'Construction lines on/off', 'Zweiter Ring ein/aus': 'Second ring on/off', 'Anzahl der Blätter $n$': 'Number of petals $n$',
        'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.':
            'With 6 petals everything fits exactly: the radius can be marked off six times on the circle. Every arc around one of the points passes through the centre and the two neighbouring points. The petals just touch.',
        // zaehlenos8
        'Anordnungen': 'Arrangements', 'Zählprinzip': 'Counting principle', 'Art': 'Kind', 'Anzahl der Personen $n$': 'Number of people $n$',
        'Zahlenschloss': 'Combination lock', 'Menü': 'Menu', 'Outfit': 'Outfit',
        'Kombinationen': 'combinations', 'Menüs': 'menus', 'Outfits': 'outfits',
        'Vorspeise': 'Starter', 'Hauptgericht': 'Main course', 'Nachtisch': 'Dessert', 'T-Shirt': 'T-shirt', 'Hose': 'Trousers', 'Schuhe': 'Shoes',
        '1. Ring: Möglichkeiten': '1st ring: options', '2. Ring: Möglichkeiten': '2nd ring: options', '3. Ring: Möglichkeiten': '3rd ring: options',
        'Vorspeise: Möglichkeiten': 'Starter: options', 'Hauptgericht: Möglichkeiten': 'Main course: options', 'Nachtisch: Möglichkeiten': 'Dessert: options',
        'T-Shirt: Möglichkeiten': 'T-shirt: options', 'Hose: Möglichkeiten': 'Trousers: options', 'Schuhe: Möglichkeiten': 'Shoes: options',
        'Das sind zu viele, um sie alle aufzuschreiben. Bei 4 Personen sind es noch 24.': 'That is too many to write them all down. With 4 people there are still 24.',
        // raumos8
        'Länge $a$': 'Length $a$', 'Breite $b$': 'Width $b$', 'Raumhöhe $h$': 'Room height $h$', 'Türen': 'Doors', 'Fenster': 'Windows',
        'Verschnitt beim Boden': 'Waste on the floor',
        'Grundriss eines Zimmers und seine vier Wände nebeneinander, mit Türen und Fenstern': 'Floor plan of a room and its four walls side by side, with doors and windows',
        'Bodenfläche': 'Floor area', 'Wandfläche': 'Wall area', 'Farbe (2 Anstriche)': 'Paint (2 coats)', 'Material zusammen': 'Materials in total',
        'Luftraum des Zimmers': 'Volume of air in the room',
        // reifenos8
        'Reifen': 'Tyre', 'Reifenbreite': 'Tyre width', 'Raddurchmesser': 'Wheel diameter', 'in Zoll': 'in inches', 'Umdrehungen pro km': 'Turns per km'
    },
    phrase: [
        // kreisflaecheos8
        ['\\,\\%$ von $r$), seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\cdot r$. Je mehr Stücke, desto genauer stimmt es:',
            '\\,\\%$ of $r$), its length is half the circumference $\\dfrac{u}{2} = \\pi \\cdot r$. The more pieces, the more exactly it fits:'],
        // zylinderos8: the mass row
        ['Masse (Holz, $', 'Mass (wood, $'], ['Masse (Aluminium, $', 'Mass (aluminium, $'], ['Masse (Stahl, $', 'Mass (steel, $'],
        // stromos8
        ['Kosten und Abschläge sind genau gleich.', 'Costs and instalments are exactly the same.'],
        ['<b>Nachzahlung</b>: $', '<b>Back payment</b>: $'], ['$. Die Abschläge waren zu niedrig.', '$. The instalments were too low.'],
        ['<b>Guthaben</b>: $', '<b>Credit</b>: $'], ['$ werden zurückgezahlt.', '$ will be paid back.'],
        [' Ein passender neuer Abschlag wäre etwa $', ' A suitable new instalment would be about $'], ['$ im Monat.', '$ a month.'],
        // termwertos8
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'The same value in every row. The table does not prove it, but a transformation shows: the terms are <b>equivalent</b>.'],
        ['Für $x = ', 'For $x = '], ['$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig</b>.', '$ the values are different: the terms are <b>not equivalent</b>.'],
        ['und $', 'and $'],
        // flaecheos8
        ['Ausmultiplizieren: ', 'Multiplying out: '], ['Ausklammern, von rechts nach links gelesen: $', 'Factorising, read from right to left: $'],
        ['Probe mit $x = ', 'Check with $x = '], ['$ und $', '$ and $'],
        ['Vom ganzen Rechteck $a \\cdot b$ wird der schraffierte Streifen $a \\cdot c$ abgezogen.', 'From the whole rectangle $a \\cdot b$ the hatched strip $a \\cdot c$ is taken away.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'The whole rectangle is as large as its two parts together.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Every term in the bracket is multiplied by the factor $a$.'],
        // linearos8
        ['Der Graph verläuft <b>waagerecht</b>.', 'The graph is <b>horizontal</b>.'],
        ['Jede Stelle ist eine Nullstelle.', 'Every $x$ is a zero.'], ['Es gibt keine Nullstelle.', 'There is no zero.'],
        ['Nullstelle (türkis): $0 = ', 'Zero (turquoise): $0 = '], ['$, also $x_0 = ', '$, so $x_0 = '],
        ['Schnittpunkt mit der y-Achse (weiß): $', 'Point of intersection with the y-axis (white): $'],
        // lgsgrafos8
        ['<b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ', '<b>Step 1:</b> solve both equations for $y$: $y = '], ['$ und $y = ', '$ and $y = '],
        ['<b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0 \\mid n)$, dann mit dem Steigungsdreieck weiter.',
            '<b>Step 2:</b> draw both lines: start at $(0, n)$, then go on with the gradient triangle.'],
        ['<b>Schritt 3:</b> Schnittpunkt ablesen: $S(', '<b>Step 3:</b> read off the point of intersection: $S('], ['$. Probe: $', '$. Check: $'],
        ['Genau eine Lösung: $L = ', 'Exactly one solution: $L = '],
        ['<b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.',
            '<b>Step 3:</b> both equations describe <b>the same line</b>. Every point on it satisfies both equations.'],
        ['<b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.',
            '<b>Step 3:</b> the same gradient, different y-intercepts: the lines are <b>parallel</b> and never intersect.'],
        ['Keine Lösung: $', 'No solution: $'],
        // tarifos8
        ['Tarif A: $y = ', 'Tariff A: $y = '], ['Tarif B: $y = ', 'Tariff B: $y = '],
        ['($x$ in Minuten, $y$ in €)', '($x$ in minutes, $y$ in €)'], ['($x$ in kWh im Jahr, $y$ in €)', '($x$ in kWh per year, $y$ in €)'],
        ['($x$ in Kilometer, $y$ in €)', '($x$ in kilometres, $y$ in €)'],
        ['Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ', 'Both tariffs cost the same per unit, the lines are parallel. '],
        ['Die Tarife sind gleich teuer.', 'The tariffs cost the same.'],
        ['Gleichsetzen: $', 'Setting equal: $'], ['$ ergibt $x \\approx ', '$ gives $x \\approx '], ['$. Dann kosten beide etwa $', '$. Then both cost about $'],
        ['Die Geraden schneiden sich nicht bei positivem Verbrauch: ', 'The lines do not intersect for a positive consumption: '],
        // rosetteos8
        ['Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ',
            'Each petal consists of two circular arcs with the radius $r$ from the centre to a point on the circle. The points divide the circle into '],
        [' gleiche Teile von je $', ' equal parts of $'], ['^\\circ$. ', '^\\circ$ each. '],
        ['Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.', 'Because every petal is $60^\\circ$ wide, there are gaps with fewer than 6 petals.'],
        ['Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.', 'Because every petal is $60^\\circ$ wide, the petals overlap with more than 6.'],
        // zaehlenos8
        ['Die Wahrscheinlichkeit, dass eine zufällige Sitzordnung genau die alphabetische ist: $', 'The probability that a random seating order is exactly the alphabetical one: $'],
        ['Vorspeise: ', 'Starter: '], ['Hauptgericht: ', 'Main course: '], ['Nachtisch: ', 'Dessert: '], ['T-Shirt: ', 'T-shirt: '], ['Hose: ', 'Trousers: '], ['Schuhe: ', 'Shoes: '],
        ['$ Kombinationen', '$ combinations'], ['$ Menüs', '$ menus'], ['$ Outfits', '$ outfits'],
        ['Für jede Wahl im ersten Schritt gibt es alle Möglichkeiten des zweiten, für jede dieser Kombinationen alle des dritten: Die Anzahlen werden multipliziert.',
            'For every choice in the first step there are all the options of the second, for each of these combinations all those of the third: the numbers are multiplied.'],
        [' Wer die Kombination rät, trifft beim ersten Versuch mit der Wahrscheinlichkeit $', ' Anyone who guesses the combination gets it right at the first attempt with the probability $'],
        // raumos8
        ['Annahmen: Laminat im Paket zu ', 'Assumptions: laminate in packs of '],
        [' m² für 21,90 €, Tür 1,8 m², Fenster 1,56 m², 1 ℓ Farbe reicht für 7 m², Eimer zu 5 ℓ für 24,95 €. Pakete und Eimer gibt es nur ganz: Es wird aufgerundet.',
            ' m² for €21.90, door 1.8 m², window 1.56 m², 1 ℓ of paint covers 7 m², tins of 5 ℓ for €24.95. Packs and tins only come whole: round up.'],
        // reifenos8
        ['Aufschrift auf dem Reifen: ', 'Marking on the tyre: '], [' (Breite in mm, dann Felgendurchmesser in mm)', ' (width in mm, then rim diameter in mm)']
    ],
    rule: [
        // money: "12.5 €" (fmt writes the decimal point on English pages and drops the trailing zero) → "€12.50"; in TeX "12.5\,\text{€}" → "\text{€}12.50".
        // Whole numbers only when the string is just the amount (slider values "70 €"): sentences of gy6 and stochastik
        // ("Taxi: 3 € Grundgebühr …") are pieces in their own files, which must still find "3 €"
        [/^(\d+)(?:\.(\d+))?[  ]€$/, (m, i, f) => '€' + i + (f ? '.' + (f.length === 1 ? f + '0' : f) : '')],
        [/(?<![\d.,])(\d+)\.(\d+)[  ]€/g, (m, i, f) => '€' + i + '.' + (f.length === 1 ? f + '0' : f)],
        [/(?<![\d.])(\d+)(?:\.(\d+))?\\,\\text\{€\}/g, (m, i, f) => '\\text{€}' + i + (f ? '.' + (f.length === 1 ? f + '0' : f) : '')],
        // TeX thousands with a thin space: 1\,000\,000 → 1{,}000{,}000 (after the decimal rule of js/buch-en.js)
        [/(?<=\d)\\,(?=\d{3}(?!\d))/g, '{,}'],
        // kreisflaecheos8
        [/Ein Kreis in (\d+) Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt/g, 'A circle cut into $1 pieces, the pieces laid side by side alternately'],
        [/Die (\d+) Stücke bilden fast ein Rechteck\. Seine Höhe ist fast der Radius \$r\$ \(hier \$/g, 'The $1 pieces almost form a rectangle. Its height is almost the radius $r$ (here $'],
        // zylinderos8: "Kreiszylinder mit dem Radius 3 cm und der Höhe 8 cm"
        [/(Hohlzylinder|Kreiszylinder) mit dem Radius ([\d.]+) cm und der Höhe ([\d.]+) cm/g,
            (m, k, r, h) => (k === 'Hohlzylinder' ? 'Hollow cylinder' : 'Cylinder') + ' with the radius ' + r + ' cm and the height ' + h + ' cm'],
        // fahrrados8, reifenos8: "28 Zoll" on the buttons, the chain drive
        [/(\d+) Zoll\b/g, '$1-inch'],
        [/Kettenantrieb: Kettenblatt mit (\d+) Zähnen, Ritzel mit (\d+) Zähnen und das Hinterrad/g, 'Chain drive: chainring with $1 teeth, sprocket with $2 teeth and the rear wheel'],
        [/Kettenblatt (\d+)/g, 'Chainring $1'], [/Ritzel (\d+)/g, 'Sprocket $1'],
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$" and "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = (-?[\d.]+)\$ ist \$/g, 'For $x = $1$: $'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' That they agree in ' + n + (n === '1' ? ' row' : ' rows') + ' is not enough.'],
        // linearos8
        [/Der Graph <b>steigt<\/b>: Geht man 1 nach rechts, geht es ([\d.]+) nach oben\./g, 'The graph <b>rises</b>: if you go 1 to the right, it goes $1 up.'],
        [/Der Graph <b>fällt<\/b>: Geht man 1 nach rechts, geht es ([\d.]+) nach unten\./g, 'The graph <b>falls</b>: if you go 1 to the right, it goes $1 down.'],
        // lgsgrafos8, tarifos8, zaehlenos8: the example buttons
        [/\bBeispiel (\d+)\b/g, 'Example $1'],
        // tarifos8
        [/Tarif ([AB]) ist immer günstiger\./g, 'Tariff $1 is always cheaper.'],
        [/Bis etwa ([\d.]+) (min|kWh|km) ist Tarif ([AB]) günstiger, darüber Tarif ([AB])\./g, 'Up to about $1 $2, tariff $3 is cheaper, above that tariff $4.'],
        // rosetteos8
        [/Rosette mit (\d+) Blättern, mit dem Zirkel konstruiert/g, 'Rosette with $1 petals, constructed with compasses'],
        // zaehlenos8
        [/(\d+) Personen auf (\d+) Plätzen: Für den ersten Platz gibt es (\d+) Möglichkeiten, für den zweiten noch (\d+), und so weiter bis zum letzten Platz\./g,
            '$1 people on $2 seats: for the first seat there are $3 options, for the second $4 more, and so on up to the last seat.'],
        [/([123])\. Ring: /g, (m, n) => ['1st', '2nd', '3rd'][+n - 1] + ' ring: '],
        // raumos8
        [/Wände abgewickelt: ([\d.]+) m lang, ([\d.]+) m hoch/g, 'Walls unrolled: $1 m long, $2 m high'],
        [/mit (\d+) % Verschnitt/g, 'with $1% waste'],
        [/ → (\d+) Pakete zu \$/g, (m, n) => ' → ' + n + (n === '1' ? ' pack' : ' packs') + ' of $'],
        [/(\d+) Eimer zu 5 ℓ/g, (m, n) => n + (n === '1' ? ' tin' : ' tins') + ' of 5 ℓ'],
        // reifenos8
        [/Laufrad mit Felge (\d+) mm und Reifen (\d+) mm breit/g, 'Wheel with a $1 mm rim and a $2 mm wide tyre'],
        [/Die Zollangabe ist eher ein Name: Ein „(\d+)-Zoll-Rad“ hat hier \$([\d.]+)\$ Zoll\. Genauer ist die Millimeterangabe\./g,
            (m, n, z) => 'The size in inches is more of a name: a “' + n + '-inch wheel” is $' + z + '$ inches here. The size in millimetres is more exact.']
    ]
});
