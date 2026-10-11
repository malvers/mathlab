/* js/buch-en/folgen.js — English for the widgets of js/buch-folgen.js.
 * Loaded by the English editions right after js/buch-folgen.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('folgen', {
    word: {
        // book 10 mathegy10-en: folge, epsilonschlauch, kreisparameter
        'arithmetisch': 'arithmetic', 'geometrisch': 'geometric', 'alternierend': 'alternating', 'Folge': 'Sequence',
        'Anzahl der Glieder': 'Number of terms', 'Glieder einer Zahlenfolge als Punkte': 'Terms of a sequence as points',
        'explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.': 'explicit: no simple formula; the sequence is defined <b>recursively</b>.',
        // epsilonschlauch
        '2 − 0,8ⁿ': '2 − 0.8ⁿ', 'Breite $\\varepsilon$ des Schlauchs': 'Width $\\varepsilon$ of the strip',
        'Folgenglieder und ein Streifen um den Grenzwert': 'Terms of the sequence and a strip around the limit',
        // kreisparameter
        'Kreis': 'Circle', 'Ellipse (Ausblick)': 'Ellipse (outlook)', 'Kurve': 'Curve', 'Abspielen': 'Play', 'Anhalten': 'Pause',
        'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t': 'A point runs round a circle, controlled by the parameter t',
        'Parameter $t$ (Winkel)': 'Parameter $t$ (angle)', 'Halbachse $a$': 'Semi-axis $a$', 'Halbachse $b$': 'Semi-axis $b$',
        'Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.':
            'With two different semi-axes the circle is stretched in one direction: an <b>ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. This is how planets go round the Sun.'
    },
    phrase: [
        // book 10 mathegy10-en
        // folge (monotony, bounds and limit come after <b>Monotonie:</b> and so on; decimal commas are points here already)
        ['explizit: $', 'explicit: $'], ['rekursiv: $', 'recursive: $'],
        ['<b>Monotonie:</b>', '<b>Monotonicity:</b>'], ['<b>Schranken:</b>', '<b>Bounds:</b>'], ['<b>Grenzwert:</b>', '<b>Limit:</b>'],
        ['ab dem zweiten Glied ', 'from the second term on '], ['streng monoton <b>steigend</b>', 'strictly <b>increasing</b>'], ['streng monoton <b>fallend</b>', 'strictly <b>decreasing</b>'],
        ['$ wird immer kleiner', '$ gets smaller and smaller'], ['<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', '<b>not</b> monotonic: the sign changes with every term'],
        ['nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', 'bounded below ($a_n \\geq 2$), <b>not</b> bounded above'],
        ['nach oben <b>nicht</b> beschränkt', '<b>not</b> bounded above'], ['beschränkt: $', 'bounded: $'],
        ['kein Grenzwert: Die Glieder wachsen über jede Grenze.', 'no limit: the terms grow beyond every bound.'],
        ['kein Grenzwert. Aber die Quotienten $', 'no limit. But the quotients $'], ['$ nähern sich dem goldenen Schnitt $', '$ approach the golden ratio $'],
        ['Grenzwert $', 'limit $'], [', von beiden Seiten abwechselnd', ', approached alternately from both sides'],
        [', schon $a_5$ stimmt auf elf Nachkommastellen', ', and already $a_5$ is right to eleven decimal places'],
        // epsilonschlauch
        ['$ hat den Grenzwert $g = ', '$ has the limit $g = '], ['$. Schlauch: $', '$. Strip: $'], ['Ab $n_0 = ', 'From $n_0 = '],
        ['$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor ', '$ on, <b>all</b> further terms lie in the strip; before that, '], ['keines außerhalb', 'none lies outside'],
        ['. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.',
            '. Make $\\varepsilon$ smaller: $n_0$ gets larger, but there <b>always</b> is one. That is exactly what “limit” means.'],
        // kreisparameter
        ['$ im Bogenmaß · ', '$ in radians · '], ['Probe: $', 'Check: $'],
        ['$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.', '$. Every value of $t$ gives a point that is exactly $r$ from the centre.']
    ],
    rule: [
        // book 10 mathegy10-en
        // epsilonschlauch: "davor liegen 3 außerhalb"
        [/liegen (\d+) außerhalb/g, '$1 lie outside']
    ]
});
