/* js/buch-en/trigonometrie.js — English for the widgets of js/buch-trigonometrie.js.
 * Loaded by the English editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('trigonometrie', {
    word: {
        // book 10 mathegy10-en: titelbildgy10, dreieck-hero, messkurve, sinussatz, kosinussatz, dreieckloeser, dreiecksflaeche, tangensfunktion, pyramidekegel
        'Geometrische Figur': 'Geometric figure', 'Dreieck': 'Triangle',
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Cover picture: a sine wave, an exponential curve, a general triangle with its circumcircle and a sequence approaching its limit',
        // messkurve
        'Ebbe und Flut': 'Ebb and flow', 'Riesenrad': 'Ferris wheel', 'EKG': 'ECG', 'Sonnenflecken': 'Sunspots', 'Messreihe': 'Series of measurements',
        'Marker auf zwei Hochpunkte': 'Markers onto two peaks', 'Messkurve mit zwei verschiebbaren Markern': 'Measured curve with two movable markers',
        'Wasserstand in m': 'Water level in m', 'Höhe in m': 'Height in m', 'Spannung in mV': 'Voltage in mV', 'Jahr': 'Year', 'Fleckenzahl': 'Number of spots',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).': 'Water level at a tide gauge on the North Sea, relative to the mean level (simplified values).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Height of a gondola above the ground: the wheel has a diameter of 50 m, the axle is 27 m high, and one turn takes 20 minutes.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'An electrocardiogram records the electrical voltage at the heart (simplified curve). Periodic, but not a sine curve.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Monthly mean of the sunspots as a smoothed model with the cycle of about 11 years (simplified values, not the measured series).',
        'Mittellage': 'mean level',
        // sinussatz
        'Höhe $h_c$': 'Height $h_c$', 'Umkreis': 'Circumcircle', 'Hilfslinie': 'Auxiliary line', 'Dreieck mit verschiebbaren Ecken': 'Triangle with movable vertices',
        // kosinussatz
        'Dreieck mit Quadraten über den drei Seiten': 'Triangle with squares on the three sides',
        // dreieckloeser
        'SWS': 'SAS', 'WSW': 'ASA', 'SSW': 'SSA', 'Gegeben': 'Given', 'Das berechnete Dreieck': 'The calculated triangle',
        'Kosinussatz': 'Cosine rule', 'Sinussatz': 'Sine rule', 'Winkelsumme': 'Angle sum', 'KOSINUSSATZ': 'COSINE RULE', 'SINUSSATZ': 'SINE RULE', 'WINKELSUMME': 'ANGLE SUM',
        'Seite $a$': 'Side $a$', 'Seite $b$': 'Side $b$', 'Seite $c$': 'Side $c$', 'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Angle $\\alpha$ (opposite $a$)',
        'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).': 'No triangle: every side must be shorter than the other two together (triangle inequality).',
        '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>':
            '$\\sin\\beta > 1$ is impossible: side $a$ is too short and does not even reach the other arm of the angle. <b>No triangle.</b>',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'included angle $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triangle from two sides and the included angle',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Unit circle with the tangent at the point 1', 'Graph der Tangensfunktion mit Polstellen': 'Graph of the tangent function with poles',
        // pyramidekegel
        'Quadratische Pyramide': 'Square pyramid', 'Kegel': 'Cone', 'Körper': 'Solid', 'Höhe – Seitenhöhe': 'Height – height of a side face', 'Höhe – Seitenkante': 'Height – lateral edge',
        'Höhe – Mantellinie': 'Height – slant height', 'Rechtwinkliges Dreieck': 'Right-angled triangle', 'Grundkante $a$': 'Base edge $a$', 'Höhe $h$': 'Height $h$'
    },
    phrase: [
        // book 10 mathegy10-en
        // messkurve
        ['Abstand der Marker: <b>$', 'Distance between the markers: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · If both markers lie on neighbouring peaks, this is the <b>period</b>.'],
        ['Größter Wert $', 'Largest value $'], ['$, kleinster Wert $', '$, smallest value $'],
        // sinussatz
        ['Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\sin\\alpha = ', 'The height from two directions: $h_c = b \\cdot \\sin\\alpha = '],
        ['$ und $h_c = a \\cdot \\sin\\beta \\approx ', '$ and $h_c = a \\cdot \\sin\\beta \\approx '],
        ['$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.', '$. Equating and dividing gives $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'All three quotients are equal to the <b>diameter of the circumcircle</b>: $2r = '],
        // kosinussatz
        ['$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$\\gamma = 90^\\circ$: the correction term is zero, and what remains is <b>Pythagoras’ theorem</b> $c^2 = a^2 + b^2$.'],
        ['$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', '$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, the square on $c$ is <b>smaller</b> than the other two together.'],
        ['$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', '$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, the square on $c$ is <b>larger</b> than the other two together.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Drag $C$ until the angle is exactly $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Given: '], ['drei Seiten', 'three sides'], ['zwei Seiten und der eingeschlossene Winkel', 'two sides and the included angle'],
        ['eine Seite und die beiden anliegenden Winkel', 'one side and the two adjacent angles'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'two sides and an angle opposite one of the sides'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. The labels are the usual ones: $a$ lies opposite $A$, and $\\alpha$ is at $A$.'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'No triangle: the two angles already add up to $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$, so there is nothing left for $\\gamma$.'],
        ['\\text{ zu groß, }', '\\text{ too large, }'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Two triangles</b> fit the data: side $a$ cuts the arm of the angle twice. This is the ambiguous case of SSA (the given angle lies opposite the <b>shorter</b> side).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Exactly <b>one</b> triangle: the angle lies opposite the <b>longer</b> (or equally long) side, and then SSA is unique.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Exactly <b>one</b> triangle: here $a$ only touches the arm of the angle, and the triangle is right-angled.'],
        // dreiecksflaeche
        ['Höhe $h = b \\cdot \\sin\\gamma = ', 'Height $h = b \\cdot \\sin\\gamma = '], ['$ Flächeneinheiten', '$ square units'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · At $90^\\circ$ the area is largest.'], [' · Derselbe Flächeninhalt bei $', ' · The same area at $'],
        ['^\\circ$, denn $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.', '^\\circ$, because $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.'],
        // tangensfunktion
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\tan\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$: here $\\cos\\alpha = 0$. The radius runs parallel to the tangent, so $\\tan\\alpha$ is <b>not defined</b>. The graph has a <b>pole</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · On the circle: the length of the segment on the tangent at $x = 1$'],
        [' (nach unten, also negativ)', ' (downwards, so negative)'],
        // pyramidekegel
        ['Schrägbild einer quadratischen Pyramide', 'Oblique view of a square pyramid'], ['Schrägbild eines Kegels', 'Oblique view of a cone'], [' mit einem rechtwinkligen Dreieck', ' with a right-angled triangle'],
        ['Seitenhöhe $h_s', 'Height of a side face $h_s'], ['Neigungswinkel der Seitenfläche:', 'Angle of inclination of the side face:'],
        ['Seitenkante $s', 'Lateral edge $s'], ['$ mit der Diagonale $d', '$ with the diagonal $d'], ['Neigungswinkel der Seitenkante:', 'Angle of inclination of the lateral edge:'],
        ['Volumen $V', 'Volume $V'], ['$ · Oberfläche $O', '$ · surface area $O'], ['Mantellinie $s', 'Slant height $s'],
        ['halber Öffnungswinkel:', 'half the opening angle:'], ['$ · Öffnungswinkel $2', '$ · opening angle $2'], ['$ · Mantel $M', '$ · curved surface $M']
    ],
    rule: [
        // book 10 mathegy10-en
        // messkurve: the unit after the distance of the markers ("$11.0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ years</b>']
    ]
});
