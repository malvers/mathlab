/* js/buch-pt/folgen.js — Portuguese for the widgets of js/buch-folgen.js.
 * Loaded by the Portuguese editions right after js/buch-folgen.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-18-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('folgen', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs folgen/*)
        // book pt-20 mathegy10-pt:
        // folge (the sequences SEQ and LIM are helpers of the module, reported for every page that loads it)
        'arithmetisch': 'aritmética', 'geometrisch': 'geométrica', 'alternierend': 'alternada', 'Heron (√2)': 'Herão (√2)', 'Folge': 'Sucessão',
        'Anzahl der Glieder': 'Número de termos', 'Glieder einer Zahlenfolge als Punkte': 'Termos de uma sucessão representados por pontos',
        'explizit: keine einfache Formel, die Folge ist <b>rekursiv</b> festgelegt.': 'termo geral: não há uma fórmula simples, a sucessão é definida <b>por recorrência</b>.',
        // epsilonschlauch
        'Breite $\\varepsilon$ des Schlauchs': 'Largura $\\varepsilon$ da faixa', 'Folgenglieder und ein Streifen um den Grenzwert': 'Termos da sucessão e uma faixa em torno do limite',
        // kreisparameter
        'Kreis': 'Círculo', 'Ellipse (Ausblick)': 'Elipse (perspetiva)', 'Ein Punkt läuft auf einem Kreis, gesteuert vom Parameter t': 'Um ponto percorre uma circunferência, comandado pelo parâmetro t',
        'Parameter $t$ (Winkel)': 'Parâmetro $t$ (ângulo)', 'Radius $r$': 'Raio $r$', 'Halbachse $a$': 'Semieixo $a$', 'Halbachse $b$': 'Semieixo $b$',
        'Mit zwei verschiedenen Halbachsen wird der Kreis in einer Richtung gestreckt: eine <b>Ellipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. So laufen Planeten um die Sonne.':
            'Com dois semieixos diferentes, a circunferência é dilatada numa direção: uma <b>elipse</b>, $\\tfrac{x^2}{a^2} + \\tfrac{y^2}{b^2} = 1$. É assim que os planetas giram em torno do Sol.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs folgen/*)
        // book pt-20 mathegy10-pt:
        // folge: "<b>Monotonie:</b> streng monoton …" - the cells begin with <b>, so they are pieces, not whole labels
        ['explizit: $', 'termo geral: $'], ['rekursiv: $', 'por recorrência: $'],
        ['<b>Monotonie:</b> ', '<b>Monotonia:</b> '], ['<b>Schranken:</b> ', '<b>Majorantes e minorantes:</b> '], ['<b>Grenzwert:</b> ', '<b>Limite:</b> '],
        ['streng monoton <b>steigend</b>: $a_{n+1} - a_n = 3 > 0$', 'estritamente <b>crescente</b>: $a_{n+1} - a_n = 3 > 0$'],
        ['nach unten beschränkt ($a_n \\geq 2$), nach oben <b>nicht</b> beschränkt', 'minorada ($a_n \\geq 2$), <b>não</b> majorada'],
        ['kein Grenzwert: Die Glieder wachsen über jede Grenze.', 'não existe (finito), os termos ultrapassam qualquer valor.'],
        ['streng monoton <b>fallend</b>: $\\tfrac{a_{n+1}}{a_n} = 0{,}5 < 1$', 'estritamente <b>decrescente</b>: $\\tfrac{a_{n+1}}{a_n} = 0{,}5 < 1$'],
        ['beschränkt: $0 < a_n \\leq 8$', 'limitada: $0 < a_n \\leq 8$'], ['Grenzwert $0$', '$0$'],
        ['streng monoton <b>fallend</b>: $\\tfrac1n$ wird immer kleiner', 'estritamente <b>decrescente</b>: $\\tfrac1n$ fica cada vez menor'],
        ['beschränkt: $1 < a_n \\leq 2$', 'limitada: $1 < a_n \\leq 2$'], ['Grenzwert $1$', '$1$'],
        ['<b>nicht</b> monoton: Das Vorzeichen wechselt bei jedem Glied', '<b>não</b> monótona: o sinal muda em cada termo'],
        ['beschränkt: $-1 \\leq a_n \\leq \\tfrac12$', 'limitada: $-1 \\leq a_n \\leq \\tfrac12$'], ['Grenzwert $0$, von beiden Seiten abwechselnd', '$0$, alternadamente pelos dois lados'],
        ['ab dem zweiten Glied streng monoton <b>steigend</b>', 'estritamente <b>crescente</b> a partir do segundo termo'], ['nach oben <b>nicht</b> beschränkt', '<b>não</b> majorada'],
        ['kein Grenzwert. Aber die Quotienten $\\tfrac{a_{n+1}}{a_n}$ nähern sich dem goldenen Schnitt $1{,}618\\ldots$', 'não existe. Mas os quocientes $\\tfrac{a_{n+1}}{a_n}$ aproximam-se do número de ouro $1{,}618\\ldots$'],
        ['ab dem zweiten Glied streng monoton <b>fallend</b>', 'estritamente <b>decrescente</b> a partir do segundo termo'], ['beschränkt: $1 \\leq a_n \\leq 1{,}5$', 'limitada: $1 \\leq a_n \\leq 1{,}5$'],
        ['Grenzwert $\\sqrt2 \\approx 1{,}414214$, schon $a_5$ stimmt auf elf Nachkommastellen', '$\\sqrt2 \\approx 1{,}414214$; já $a_5$ está certo em onze casas decimais'],
        // epsilonschlauch (the sentence with the number of terms outside: rule below)
        ['$ hat den Grenzwert $g = ', '$ tem limite $g = '], ['$. Schlauch: $', '$. Faixa: $'], ['Ab $n_0 = ', 'A partir de $n_0 = '],
        ['. Mach $\\varepsilon$ kleiner: $n_0$ wird größer, aber es gibt <b>immer</b> eins. Genau das bedeutet „Grenzwert“.',
            '. Torna $\\varepsilon$ menor: $n_0$ fica maior, mas há <b>sempre</b> um. É exatamente isto que significa «limite».'],
        // kreisparameter
        ['$. Jeder Wert von $t$ liefert einen Punkt, der genau $r$ vom Mittelpunkt entfernt ist.', '$. Cada valor de $t$ dá um ponto que está exatamente à distância $r$ do centro.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-20 mathegy10-pt:
        // epsilonschlauch: "$ liegen <b>alle</b> weiteren Glieder im Schlauch, davor liegen 5 außerhalb." (or "keines außerhalb")
        [/\$ liegen <b>alle<\/b> weiteren Glieder im Schlauch, davor (?:liegen (\d+) außerhalb|keines außerhalb)\./g,
            (m, k) => '$, <b>todos</b> os termos seguintes estão na faixa' + (!k ? ' e antes nenhum está fora.' : k === '1' ? '; antes, 1 termo está fora.' : '; antes, ' + k + ' termos estão fora.')],
    ]
});
