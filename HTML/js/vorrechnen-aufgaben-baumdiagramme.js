// Block "Baumdiagramme · Pfadregeln" - week 15 of 2027, Mathe BGY 11, the plan's "Mehrstufige Zufallsversuche I:
// Baumdiagramme, Pfadregeln" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-baumdiagramme.html): along a path the probabilities are multiplied, several
// paths are added - the coin, the urn with 3 red and 2 blue balls with and without putting back, two dice, the
// complement for "at least once", two machines with 2 % and 5 % rejects, the medical test - and the nut: how many
// throws until a six is more likely than not. Each task carries its setting in a sentence (aufgabenTexte,
// js/vorrechnen-aufgaben.js): on the board stands only the term.
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['bd-muenze',       '\\frac{1}{2}\\cdot\\frac{1}{2}',                             ''],
        ['bd-rot',          '\\frac{3}{3+2}',                                             ''],
        ['bd-pfade',        '8\\cdot 8',                                                  ''],
        ['bd-mit',          '\\frac{3}{5}\\cdot\\frac{3}{5}',                             ''],
        ['bd-ohne',         '\\frac{3}{5}\\cdot\\frac{2}{4}',                             ''],
        ['bd-sechsen',      '\\frac{1}{6}\\cdot\\frac{1}{6}',                             ''],
        ['bd-weiss-schwarz', '\\frac{4}{10}\\cdot\\frac{6}{9}',                           ''],
        ['bd-summe',        '\\frac{9}{25}+\\frac{6}{25}+\\frac{6}{25}+\\frac{4}{25}',    ''],
        ['bd-verschieden',  '\\frac{3}{5}\\cdot\\frac{2}{5}+\\frac{2}{5}\\cdot\\frac{3}{5}', ''],
        ['bd-eine-sechs',   '\\frac{1}{6}\\cdot\\frac{5}{6}+\\frac{5}{6}\\cdot\\frac{1}{6}', ''],
        ['bd-ohne-verschieden', '\\frac{3}{5}\\cdot\\frac{2}{4}+\\frac{2}{5}\\cdot\\frac{3}{4}', ''],
        ['bd-mindestens',   '1-\\left(\\frac{1}{2}\\right)^3',                            ''],
        ['bd-nie',          '\\left(\\frac{5}{6}\\right)^3',                              ''],
        ['bd-mindestens-sechs', '1-\\left(\\frac{5}{6}\\right)^2',                        ''],
        ['bd-ausschuss',    '0{,}6\\cdot 0{,}02+0{,}4\\cdot 0{,}05',                      ''],
        ['bd-test',         '0{,}01\\cdot 0{,}99',                                        ''],
        ['bd-positiv',      '0{,}01\\cdot 0{,}99+0{,}99\\cdot 0{,}05',                    ''],
        ['bd-drei-rot',     '\\frac{5}{8}\\cdot\\frac{4}{7}\\cdot\\frac{3}{6}',           ''],
        ['bd-treffer',      'p^2=0{,}49\\quad(p>0)',                                      'p'],
        ['bd-nuss',         '1-\\left(\\frac{5}{6}\\right)^n=0{,}5',                      'n'],
    );
    wochenBlock('baumdiagramme', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'bd-muenze':        [['=\\frac{1}{4}', '\\text{Pfadregel}']],
        'bd-rot':           [['=\\frac{3}{5}', '\\text{günstige durch mögliche}']],
        'bd-pfade':         [['=64', '\\text{ausrechnen}']],
        'bd-mit':           [['=\\frac{9}{25}', '\\text{Pfadregel}'], ['=0{,}36', '\\text{als Dezimalzahl}']],
        'bd-ohne':          [['=\\frac{6}{20}', '\\text{Pfadregel}'], ['=\\frac{3}{10}', '\\text{kürzen}']],
        'bd-sechsen':       [['=\\frac{1}{36}', '\\text{Pfadregel}']],
        'bd-weiss-schwarz': [['=\\frac{24}{90}', '\\text{Pfadregel}'], ['=\\frac{4}{15}', '\\text{kürzen}']],
        'bd-summe':         [['=\\frac{25}{25}', '\\text{addieren}'], ['=1', '\\text{kürzen}']],
        'bd-verschieden':   [['=\\frac{6}{25}+\\frac{6}{25}', '\\text{Pfadregel}'], ['=\\frac{12}{25}', '\\text{Summenregel}']],
        'bd-eine-sechs':    [['=\\frac{5}{36}+\\frac{5}{36}', '\\text{Pfadregel}'], ['=\\frac{10}{36}', '\\text{Summenregel}'], ['=\\frac{5}{18}', '\\text{kürzen}']],
        'bd-ohne-verschieden': [['=\\frac{6}{20}+\\frac{6}{20}', '\\text{Pfadregel}'], ['=\\frac{12}{20}', '\\text{Summenregel}'], ['=\\frac{3}{5}', '\\text{kürzen}']],
        'bd-mindestens':    [['=1-\\frac{1}{8}', '\\text{Potenz ausrechnen}'], ['=\\frac{7}{8}', '\\text{ausrechnen}']],
        'bd-nie':           [['=\\frac{125}{216}', '\\text{Potenz ausrechnen}'], ['\\approx 0{,}579', '\\text{Taschenrechner}']],
        'bd-mindestens-sechs': [['=1-\\frac{25}{36}', '\\text{Potenz ausrechnen}'], ['=\\frac{11}{36}', '\\text{ausrechnen}']],
        'bd-ausschuss':     [['=0{,}012+0{,}02', '\\text{Pfadregel}'], ['=0{,}032', '\\text{Summenregel}']],
        'bd-test':          [['=0{,}0099', '\\text{Pfadregel}']],
        'bd-positiv':       [['=0{,}0099+0{,}0495', '\\text{Pfadregel}'], ['=0{,}0594', '\\text{Summenregel}']],
        'bd-drei-rot':      [['=\\frac{60}{336}', '\\text{Pfadregel}'], ['=\\frac{5}{28}', '\\text{kürzen}']],
        'bd-treffer':       [['p=0{,}7', '\\sqrt{\\;}']],
        'bd-nuss':          [['\\left(\\frac{5}{6}\\right)^n=0{,}5', '\\text{umstellen}'], ['n=\\frac{\\ln 0{,}5}{\\ln\\frac{5}{6}}', '\\ln,\\ \\text{Potenzregel}'],
                             ['n\\approx 3{,}80', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'bd-ohne':
            'Ohne Zurücklegen ändert sich der zweite Ast: nach einer roten Kugel sind nur noch $2$ rote unter $4$ Kugeln.' +
            '\n\nMit Zurücklegen wäre es $\\frac{3}{5}\\cdot\\frac{3}{5}=\\frac{9}{25}=0{,}36$ – etwas mehr als $0{,}3$.',
        'bd-mindestens':
            '„Mindestens einmal Kopf“ hat sieben Pfade – das Gegenteil nur einen: dreimal Zahl, $\\left(\\frac{1}{2}\\right)^3=\\frac{1}{8}$.' +
            '\n\nAlso über das Gegenereignis: $1-\\frac{1}{8}=\\frac{7}{8}$.',
        'bd-nuss':
            'Nach $3$ Würfen ist eine Sechs noch nicht wahrscheinlicher als keine ($1-\\left(\\frac{5}{6}\\right)^3\\approx 0{,}42$), nach $4$ Würfen schon ($\\approx 0{,}52$).' +
            '\n\n$n\\approx 3{,}8$ heißt also: ab dem vierten Wurf. Aufrunden, nicht runden.',
    });
    aufgabenTexte({
        'bd-muenze':        'Eine faire Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für zweimal Kopf?',
        'bd-rot':           'In einer Urne liegen $3$ rote und $2$ blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, eine rote zu ziehen?',
        'bd-pfade':         'Ein Glücksrad mit $8$ gleichen Feldern wird zweimal gedreht. Wie viele Pfade hat das Baumdiagramm?',
        'bd-mit':           'Urne mit $3$ roten und $2$ blauen Kugeln, zweimal ziehen mit Zurücklegen: zweimal rot.',
        'bd-ohne':          'Urne mit $3$ roten und $2$ blauen Kugeln, zweimal ziehen ohne Zurücklegen: zweimal rot.',
        'bd-sechsen':       'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für zwei Sechsen?',
        'bd-weiss-schwarz': 'Urne mit $4$ weißen und $6$ schwarzen Kugeln, ohne Zurücklegen: erst weiß, dann schwarz.',
        'bd-summe':         'Urne mit $3$ roten und $2$ blauen Kugeln, zweimal mit Zurücklegen: alle vier Pfade zusammen.',
        'bd-verschieden':   'Urne mit $3$ roten und $2$ blauen Kugeln, zweimal mit Zurücklegen: zwei verschiedene Farben.',
        'bd-eine-sechs':    'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für genau eine Sechs?',
        'bd-ohne-verschieden': 'Urne mit $3$ roten und $2$ blauen Kugeln, zweimal ohne Zurücklegen: zwei verschiedene Farben.',
        'bd-mindestens':    'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens einmal Kopf?',
        'bd-nie':           'Ein Würfel wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit, nie eine Sechs zu werfen?',
        'bd-mindestens-sechs': 'Ein Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs?',
        'bd-ausschuss':     'Maschine A liefert $60\\,\\%$ der Teile mit $2\\,\\%$ Ausschuss, Maschine B $40\\,\\%$ mit $5\\,\\%$. Wie groß ist der Ausschuss insgesamt?',
        'bd-test':          '$1\\,\\%$ der Personen ist krank, der Test erkennt $99\\,\\%$ der Kranken. Wie groß ist die Wahrscheinlichkeit für „krank und positiv“?',
        'bd-positiv':       '$1\\,\\%$ ist krank, der Test erkennt $99\\,\\%$ davon; von den Gesunden testet er $5\\,\\%$ falsch positiv. Wie groß ist die Wahrscheinlichkeit für einen positiven Test?',
        'bd-drei-rot':      'Urne mit $5$ roten und $3$ blauen Kugeln, dreimal ziehen ohne Zurücklegen: dreimal rot.',
        'bd-treffer':       'Ein Schütze trifft zweimal hintereinander mit der Wahrscheinlichkeit $0{,}49$. Wie groß ist seine Trefferwahrscheinlichkeit $p$ pro Schuss?',
        'bd-nuss':          'Wie oft muss man würfeln, damit mindestens eine Sechs mit der Wahrscheinlichkeit $0{,}5$ dabei ist?',
    });
})();
