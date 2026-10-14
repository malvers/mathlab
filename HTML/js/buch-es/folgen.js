/* js/buch-es/folgen.js — Spanish for the widgets of js/buch-folgen.js.
 * Loaded by the Spanish editions right after js/buch-folgen.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('folgen', {
    word: {
        // book es mathegy10-es (Lovelace)
        // folge
        'arithmetisch': 'aritmética', 'geometrisch': 'geométrica', 'alternierend': 'alternada', 'Heron (√2)': 'Herón (√2)', 'Folge': 'Sucesión',
        'Anzahl der Glieder': 'Número de términos', 'Glieder einer Zahlenfolge als Punkte': 'Términos de una sucesión como puntos',
        'explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.': 'explícita: no hay una fórmula sencilla; la sucesión está definida de forma <b>recurrente</b>.',
        // epsilonschlauch
        'Breite $\\varepsilon$ des Schlauchs': 'Anchura $\\varepsilon$ de la franja',
        'Folgenglieder und ein Streifen um den Grenzwert': 'Términos de la sucesión y una franja alrededor del límite',
        // kreisparameter
        'Kreis': 'Círculo', 'Ellipse (Ausblick)': 'Elipse (perspectiva)',
        'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t': 'Un punto recorre una circunferencia, controlado por el parámetro t',
        'Parameter $t$ (Winkel)': 'Parámetro $t$ (ángulo)', 'Radius $r$': 'Radio $r$', 'Halbachse $a$': 'Semieje $a$', 'Halbachse $b$': 'Semieje $b$',

    },
    phrase: [
        // book es mathegy10-es (Lovelace)
        // folge (monotony, bounds and limit come after <b>Monotonie:</b> and so on)
        ['explizit: $', 'explícita: $'], ['rekursiv: $', 'recurrente: $'],
        ['<b>Monotonie:</b>', '<b>Monotonía:</b>'], ['<b>Schranken:</b>', '<b>Cotas:</b>'], ['<b>Grenzwert:</b>', '<b>Límite:</b>'],
        ['ab dem zweiten Glied ', 'a partir del segundo término, '], ['streng monoton <b>steigend</b>', 'estrictamente <b>creciente</b>'], ['streng monoton <b>fallend</b>', 'estrictamente <b>decreciente</b>'],
        ['$ wird immer kleiner', '$ se hace cada vez más pequeño'], ['<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', '<b>no</b> monótona: el signo cambia en cada término'],
        ['nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', 'acotada inferiormente ($a_n \\geq 2$), <b>no</b> acotada superiormente'],
        ['nach oben <b>nicht</b> beschränkt', '<b>no</b> acotada superiormente'], ['beschränkt: $', 'acotada: $'],
        ['kein Grenzwert: Die Glieder wachsen über jede Grenze.', 'sin límite: los términos superan cualquier valor.'],
        ['kein Grenzwert. Aber die Quotienten $', 'sin límite. Pero los cocientes $'], ['$ nähern sich dem goldenen Schnitt $', '$ se acercan al número áureo $'],
        ['Grenzwert $', 'límite $'], [', von beiden Seiten abwechselnd', ', alternando por los dos lados'],
        [', schon $a_5$ stimmt auf elf Nachkommastellen', '; ya $a_5$ coincide en once decimales'],
        // epsilonschlauch
        ['$ hat den Grenzwert $g = ', '$ tiene el límite $g = '], ['$. Schlauch: $', '$. Franja: $'], ['Ab $n_0 = ', 'A partir de $n_0 = '],
        ['$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor ', '$, <b>todos</b> los términos siguientes están en la franja; antes, '], ['keines außerhalb', 'ninguno queda fuera'],
        ['. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.',
            '. Haz $\\varepsilon$ más pequeño: $n_0$ se hace más grande, pero <b>siempre</b> hay uno. Eso es exactamente lo que significa «límite».'],
        // kreisparameter
        ['Probe: $', 'Comprobación: $'],
        ['$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.', '$. Cada valor de $t$ da un punto que está exactamente a $r$ del centro.'],
        ['Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.',
            'Con dos semiejes distintos, la circunferencia se estira en una dirección: una <b>elipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. Así giran los planetas alrededor del Sol.'],

    ],
    rule: [
        // book es mathegy10-es (Lovelace)
        // epsilonschlauch: "davor liegen 3 außerhalb"
        [/liegen 1 außerhalb/g, '1 queda fuera'], [/liegen (\d+) außerhalb/g, '$1 quedan fuera'],

    ]
});
