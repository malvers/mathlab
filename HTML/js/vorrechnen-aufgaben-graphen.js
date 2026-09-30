// Block "Graphen-Repertoire · Grundfunktionen" - week 5 of 2027, Mathe BGY 11, the plan's "Graphen-Repertoire ohne
// Hilfsmittel: x, x², √x, 1/x, 2^x, sin x" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an
// den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks,
// easy to hard, after the week's quiz (mathetest11-graphen.html): points on the basic graphs, 1/x for large x, (1/2)^x,
// where they meet - x and x², √x and x, 1/x and x - x³ = x with three solutions, even functions by f(-x), √x above x²
// between 0 and 1, 2^10 against 10², and the nut 1/x + 1/x² = 2.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['gr-wurzel',       'y=\\sqrt{9}',                                'y'],
        ['gr-parabel',      'y=-(-3)^2',                                  'y'],
        ['gr-hyperbel',     'y=\\frac{1}{1000}',                          'y'],
        ['gr-halb',         'y=\\left(\\frac{1}{2}\\right)^{-3}',          'y'],
        ['gr-kubik',        'x^3=-8',                                     'x'],
        ['gr-viertel',      '2^x=\\frac{1}{4}',                           'x'],
        ['gr-wurzel-plus',  '\\sqrt{x+4}=3',                              'x'],
        ['gr-hyperbel-rechts', '\\frac{1}{x-2}=1\\quad(x\\ne 2)',         'x'],
        ['gr-x-x2',         'x=x^2',                                      'x'],
        ['gr-kehrwert-x',   '\\frac{1}{x}=x\\quad(x\\ne 0)',              'x'],
        ['gr-vier-durch-x', '\\frac{4}{x}=x\\quad(x\\ne 0)',              'x'],
        ['gr-klammer',      '(x-1)^2-9=0',                                'x'],
        ['gr-gerade',       '(-x)^2+\\frac{1}{(-x)^2}',                   ''],
        ['gr-dazwischen',   '\\sqrt{0{,}25}-0{,}25^2',                    ''],
        ['gr-ueberholt',    '2^{10}-10^2',                                ''],
        ['gr-wurzel-x',     '\\sqrt{x}=x\\quad(x\\ge 0)',                 'x'],
        ['gr-drei',         'x^3=x',                                      'x'],
        ['gr-wurzel-halb',  '\\sqrt{x}=\\frac{x}{2}\\quad(x\\ge 0)',      'x'],
        ['gr-kehrwerte',    '\\frac{1}{x}=\\frac{1}{x^2}\\quad(x\\ne 0)', 'x'],
        ['gr-nuss',         '\\frac{1}{x}+\\frac{1}{x^2}=2\\quad(x\\ne 0)', 'x'],
    );
    BLOECKE.push({ titel: 'Graphen-Repertoire · Grundfunktionen', ab, bis: AUFGABEN.length, kw: 5 });
    Object.assign(LOESUNGEN, {
        'gr-wurzel':        [['y=3', '\\text{Wurzel ziehen}']],
        'gr-parabel':       [['y=-9', '\\text{Potenz vor Vorzeichen}']],
        'gr-hyperbel':      [['y=0{,}001', '\\text{ausrechnen}']],
        'gr-halb':          [['y=2^3', '\\text{Kehrwert}'], ['y=8', '\\text{ausrechnen}']],
        'gr-kubik':         [['x=-2', '\\sqrt[3]{\\;}']],
        'gr-viertel':       [['2^x=2^{-2}', '\\text{als Potenz schreiben}'], ['x=-2', '\\text{Exponenten vergleichen}']],
        'gr-wurzel-plus':   [['x+4=9', '\\text{quadrieren}'], ['x=5', '-4']],
        'gr-hyperbel-rechts': [['1=x-2', '\\cdot(x-2)'], ['x=3', '+2']],
        'gr-x-x2':          [['x^2-x=0', '-x'], ['x(x-1)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=1', '\\text{Nullprodukt}']],
        'gr-kehrwert-x':    [['1=x^2', '\\cdot x'], ['x_1=1\\quad x_2=-1', '\\sqrt{\\;}']],
        'gr-vier-durch-x':  [['4=x^2', '\\cdot x'], ['x_1=2\\quad x_2=-2', '\\sqrt{\\;}']],
        'gr-klammer':       [['(x-1)^2=9', '+9'], ['x-1=3\\;\\vee\\;x-1=-3', '\\sqrt{\\;}'], ['x_1=4\\quad x_2=-2', '+1']],
        'gr-gerade':        [['=x^2+\\frac{1}{x^2}', '\\text{gerade Potenzen}']],
        'gr-dazwischen':    [['=0{,}5-0{,}0625', '\\text{ausrechnen}'], ['=0{,}4375', '\\text{ausrechnen}']],
        'gr-ueberholt':     [['=1024-100', '\\text{Potenzen ausrechnen}'], ['=924', '\\text{ausrechnen}']],
        'gr-wurzel-x':      [['x=x^2', '\\text{quadrieren}'], ['x^2-x=0', '-x'], ['x(x-1)=0', '\\text{ausklammern}'],
                             ['x_1=0\\quad x_2=1', '\\text{Nullprodukt}']],
        'gr-drei':          [['x^3-x=0', '-x'], ['x(x^2-1)=0', '\\text{ausklammern}'], ['x(x-1)(x+1)=0', '\\text{3. binomische Formel}'],
                             ['x_1=0\\quad x_2=1\\quad x_3=-1', '\\text{Nullprodukt}']],
        'gr-wurzel-halb':   [['x=\\frac{x^2}{4}', '\\text{quadrieren}'], ['4x=x^2', '\\cdot 4'], ['x^2-4x=0', '-4x'],
                             ['x(x-4)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=4', '\\text{Nullprodukt}']],
        'gr-kehrwerte':     [['x^2=x', '\\cdot x^2'], ['x^2-x=0', '-x'], ['x(x-1)=0', '\\text{ausklammern}'], ['x=1', '\\text{Nullprodukt},\\ x\\ne 0']],
        'gr-nuss':          [['x+1=2x^2', '\\cdot x^2'], ['2x^2-x-1=0', '\\text{umstellen}'], ['x^2-\\frac{1}{2}x-\\frac{1}{2}=0', ':2'],
                             ['x_{1,2}=\\frac{1}{4}\\pm\\sqrt{\\frac{1}{16}+\\frac{1}{2}}', '\\text{pq-Formel}'],
                             ['x_{1,2}=\\frac{1}{4}\\pm\\frac{3}{4}', '\\text{Wurzel ziehen}'], ['x_1=1\\quad x_2=-\\frac{1}{2}', '\\text{ausrechnen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'gr-parabel':
            'Erst die Potenz, dann das Vorzeichen: $-(-3)^2=-(9)=-9$. Die Parabel $y=-x^2$ ist nach unten geöffnet.' +
            '\n\nAnders $(-3)^2=9$ – hier gehört das Minus mit in die Klammer.',
        'gr-dazwischen':
            'Zwischen $0$ und $1$ liegt $\\sqrt{x}$ über $x$ und $x$ über $x^2$: $\\sqrt{0{,}25}=0{,}5$, aber $0{,}25^2=0{,}0625$.' +
            '\n\nFür $x>1$ ist es umgekehrt. Bei $x=0$ und $x=1$ treffen sich alle drei.',
        'gr-kehrwerte':
            'Mal $x^2$ darf man, weil $x\\ne 0$. Die Lösung $x=0$ der Gleichung $x(x-1)=0$ fällt weg – bei $0$ ist $\\frac{1}{x}$ gar nicht definiert.' +
            '\n\nDie beiden Graphen treffen sich nur in $(1\\mid 1)$.',
    });
    aufgabenTexte({
        'gr-wurzel':     'Welcher Punkt mit $x=9$ liegt auf dem Graphen von $f(x)=\\sqrt{x}$?',
        'gr-parabel':    'Wie groß ist $f(-3)$ für $f(x)=-x^2$?',
        'gr-hyperbel':   'Welchen Wert hat $\\frac{1}{x}$ für $x=1000$?',
        'gr-halb':       'Wie groß ist $f(-3)$ für $f(x)=\\left(\\frac{1}{2}\\right)^x$?',
        'gr-x-x2':       'Wo schneiden sich $y=x$ und $y=x^2$?',
        'gr-kehrwert-x': 'Wo schneiden sich $y=\\frac{1}{x}$ und $y=x$?',
        'gr-gerade':     'Ist $f(x)=x^2+\\frac{1}{x^2}$ symmetrisch zur $y$-Achse? Setze $-x$ ein.',
        'gr-dazwischen': 'Bei $x=0{,}25$: wie weit liegt $\\sqrt{x}$ über $x^2$?',
        'gr-ueberholt':  'Bei $x=10$: wie weit liegt $2^x$ schon über $x^2$?',
        'gr-wurzel-x':   'Wo schneiden sich $y=\\sqrt{x}$ und $y=x$?',
        'gr-drei':       'Wo schneiden sich $y=x^3$ und $y=x$?',
        'gr-kehrwerte':  'Wo schneiden sich $y=\\frac{1}{x}$ und $y=\\frac{1}{x^2}$?',
    });
})();
