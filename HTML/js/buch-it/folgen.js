/* js/buch-it/folgen.js — Italian for the widgets of js/buch-folgen.js.
 * Loaded by the Italian editions right after js/buch-folgen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/folgen.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('folgen', {
    word: {
        // book it-15 mathegy10-it:
        // folge
        'arithmetisch': 'aritmetica', 'geometrisch': 'geometrica', 'alternierend': 'a segni alterni', 'Heron (√2)': 'Erone (√2)', 'Folge': 'Successione',
        'Anzahl der Glieder': 'Numero di termini', 'Glieder einer Zahlenfolge als Punkte': 'Termini di una successione come punti',
        'explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.': 'esplicita: nessuna formula semplice, la successione è definita in modo <b>ricorsivo</b>.',
        // epsilonschlauch
        'Breite $\\varepsilon$ des Schlauchs': 'Ampiezza $\\varepsilon$ della striscia',
        'Folgenglieder und ein Streifen um den Grenzwert': 'Termini della successione e una striscia intorno al limite',
        // kreisparameter
        'Kreis': 'Circonferenza', 'Ellipse (Ausblick)': 'Ellisse (prospettiva)',
        'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t': 'Un punto percorre una circonferenza, guidato dal parametro t',
        'Parameter $t$ (Winkel)': 'Parametro $t$ (angolo)', 'Radius $r$': 'Raggio $r$', 'Halbachse $a$': 'Semiasse $a$', 'Halbachse $b$': 'Semiasse $b$',

    },
    phrase: [
        // book it-15 mathegy10-it:
        // folge (monotony, bounds and limit come after <b>Monotonie:</b> and so on)
        ['explizit: $', 'esplicita: $'], ['rekursiv: $', 'ricorsiva: $'],
        ['<b>Monotonie:</b>', '<b>Monotonia:</b>'], ['<b>Schranken:</b>', '<b>Limitatezza:</b>'], ['<b>Grenzwert:</b>', '<b>Limite:</b>'],
        ['ab dem zweiten Glied ', 'dal secondo termine in poi '], ['streng monoton <b>steigend</b>', 'strettamente <b>crescente</b>'], ['streng monoton <b>fallend</b>', 'strettamente <b>decrescente</b>'],
        ['$ wird immer kleiner', '$ diventa sempre più piccolo'], ['<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', '<b>non</b> monotona: il segno cambia a ogni termine'],
        ['nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', 'limitata inferiormente ($a_n \\geq 2$), superiormente <b>non</b> limitata'],
        ['nach oben <b>nicht</b> beschränkt', 'superiormente <b>non</b> limitata'], ['beschränkt: $', 'limitata: $'],
        ['kein Grenzwert: Die Glieder wachsen über jede Grenze.', 'nessun limite: i termini superano qualsiasi valore.'],
        ['kein Grenzwert. Aber die Quotienten $', 'nessun limite. Ma i quozienti $'], ['$ nähern sich dem goldenen Schnitt $', '$ si avvicinano al numero aureo $'],
        ['Grenzwert $', 'limite $'], [', von beiden Seiten abwechselnd', ', alternando dai due lati'],
        [', schon $a_5$ stimmt auf elf Nachkommastellen', ', già $a_5$ coincide per undici decimali'],
        // epsilonschlauch
        ['$ hat den Grenzwert $g = ', '$ ha il limite $g = '], ['$. Schlauch: $', '$. Striscia: $'], ['Ab $n_0 = ', 'A partire da $n_0 = '],
        ['$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor ', '$ <b>tutti</b> i termini successivi stanno nella striscia, prima '], ['keines außerhalb', 'nessuno resta fuori'],
        ['. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.',
            '. Rendi $\\varepsilon$ più piccolo: $n_0$ diventa più grande, ma ce n’è <b>sempre</b> uno. È esattamente questo che significa «limite».'],
        // kreisparameter
        ['$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.', '$. Ogni valore di $t$ dà un punto che dista esattamente $r$ dal centro.'],
        ['Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.',
            'Con due semiassi diversi la circonferenza viene dilatata in una direzione: un’<b>ellisse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. Così i pianeti girano intorno al Sole.'],

    ],
    rule: [
        // book it-15 mathegy10-it:
        // epsilonschlauch: "davor liegen 3 außerhalb"
        [/liegen 1 außerhalb/g, '1 resta fuori'], [/liegen (\d+) außerhalb/g, '$1 restano fuori'],

    ]
});
