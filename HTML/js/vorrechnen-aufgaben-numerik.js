// Block "Numerische Verfahren · Bisektion und Streifen" - week 21 of 2027, Mathe BGY 11, the plan's "Wahlbereich
// „Numerische Verfahren und Simulationen" I" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an
// den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks,
// easy to hard, after the week's quiz (mathetest11-numerik.html): the bisection for f(x) = x² - 2 on [1;2] step by step
// (the middle, its value, the next interval), how the interval shrinks (1/2^n, ten steps for 0.001), the area under
// f(x) = x from 0 to 2 by strips (lower and upper sum, their mean), under x² on [0;1] - and the nut: Heron's step for
// √2, far quicker than halving. Each task carries its setting in a sentence (aufgabenTexte).
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['nu-mitte',        '\\frac{1+2}{2}',                             ''],
        ['nu-wert',         '1{,}5^2-2',                                  ''],
        ['nu-vorzeichen',   '(1^2-2)\\cdot(2^2-2)',                       ''],
        ['nu-mitte-zwei',   '\\frac{1+1{,}5}{2}',                         ''],
        ['nu-wert-zwei',    '1{,}25^2-2',                                 ''],
        ['nu-mitte-drei',   '\\frac{1{,}25+1{,}5}{2}',                    ''],
        ['nu-wert-drei',    '1{,}375^2-2',                                ''],
        ['nu-laenge',       '\\frac{1}{2^3}',                             ''],
        ['nu-zehn',         '\\frac{1}{2^{10}}',                          ''],
        ['nu-dreieck',      '\\frac{1}{2}\\cdot 2\\cdot 2',               ''],
        ['nu-untersumme',   '0{,}5\\cdot(0+0{,}5+1+1{,}5)',               ''],
        ['nu-obersumme',    '0{,}5\\cdot(0{,}5+1+1{,}5+2)',               ''],
        ['nu-mittelwert',   '\\frac{1{,}5+2{,}5}{2}',                     ''],
        ['nu-probe',        '1{,}4142^2-2',                               ''],
        ['nu-kubik',        '1{,}5^3-5',                                  ''],
        ['nu-parabel-unten', '0{,}25\\cdot(0^2+0{,}25^2+0{,}5^2+0{,}75^2)', ''],
        ['nu-parabel-oben', '0{,}25\\cdot(0{,}25^2+0{,}5^2+0{,}75^2+1^2)', ''],
        ['nu-parabel-mitte', '\\frac{0{,}21875+0{,}46875}{2}',            ''],
        ['nu-schritte',     '\\left(\\frac{1}{2}\\right)^n=0{,}001',      'n'],
        ['nu-nuss',         '\\frac{1}{2}\\cdot\\left(1{,}5+\\frac{2}{1{,}5}\\right)', ''],
    );
    BLOECKE.push({ titel: 'Numerische Verfahren · Bisektion und Streifen', ab, bis: AUFGABEN.length, kw: 21, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'nu-mitte':         [['=1{,}5', '\\text{ausrechnen}']],
        'nu-wert':          [['=2{,}25-2', '\\text{quadrieren}'], ['=0{,}25', '\\text{ausrechnen}']],
        'nu-vorzeichen':    [['=(-1)\\cdot 2', '\\text{ausrechnen}'], ['=-2', '\\text{ausrechnen}']],
        'nu-mitte-zwei':    [['=1{,}25', '\\text{ausrechnen}']],
        'nu-wert-zwei':     [['=1{,}5625-2', '\\text{quadrieren}'], ['=-0{,}4375', '\\text{ausrechnen}']],
        'nu-mitte-drei':    [['=1{,}375', '\\text{ausrechnen}']],
        'nu-wert-drei':     [['=1{,}890625-2', '\\text{quadrieren}'], ['=-0{,}109375', '\\text{ausrechnen}']],
        'nu-laenge':        [['=\\frac{1}{8}', '\\text{Potenz ausrechnen}'], ['=0{,}125', '\\text{als Dezimalzahl}']],
        'nu-zehn':          [['=\\frac{1}{1024}', '\\text{Potenz ausrechnen}'], ['\\approx 0{,}00098', '\\text{Taschenrechner}']],
        'nu-dreieck':       [['=2', '\\text{ausrechnen}']],
        'nu-untersumme':    [['=0{,}5\\cdot 3', '\\text{addieren}'], ['=1{,}5', '\\text{ausrechnen}']],
        'nu-obersumme':     [['=0{,}5\\cdot 5', '\\text{addieren}'], ['=2{,}5', '\\text{ausrechnen}']],
        'nu-mittelwert':    [['=\\frac{4}{2}', '\\text{addieren}'], ['=2', '\\text{kürzen}']],
        'nu-probe':         [['\\approx 1{,}99996-2', '\\text{quadrieren}'], ['\\approx -0{,}00004', '\\text{ausrechnen}']],
        'nu-kubik':         [['=3{,}375-5', '\\text{Potenz ausrechnen}'], ['=-1{,}625', '\\text{ausrechnen}']],
        'nu-parabel-unten': [['=0{,}25\\cdot(0+0{,}0625+0{,}25+0{,}5625)', '\\text{quadrieren}'], ['=0{,}25\\cdot 0{,}875', '\\text{addieren}'],
                             ['=0{,}21875', '\\text{ausrechnen}']],
        'nu-parabel-oben':  [['=0{,}25\\cdot(0{,}0625+0{,}25+0{,}5625+1)', '\\text{quadrieren}'], ['=0{,}25\\cdot 1{,}875', '\\text{addieren}'],
                             ['=0{,}46875', '\\text{ausrechnen}']],
        'nu-parabel-mitte': [['=\\frac{0{,}6875}{2}', '\\text{addieren}'], ['=0{,}34375', '\\text{ausrechnen}']],
        'nu-schritte':      [['n=\\frac{\\ln 0{,}001}{\\ln\\frac{1}{2}}', '\\ln,\\ \\text{Potenzregel}'], ['n\\approx 9{,}97', '\\text{Taschenrechner}']],
        'nu-nuss':          [['\\approx\\frac{1}{2}\\cdot(1{,}5+1{,}3333)', '\\text{ausrechnen}'], ['\\approx\\frac{1}{2}\\cdot 2{,}8333', '\\text{addieren}'],
                             ['\\approx 1{,}4167', '\\text{ausrechnen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'nu-wert':
            '$f(1{,}5)=0{,}25>0$ und $f(1)=-1<0$: der Vorzeichenwechsel liegt zwischen $1$ und $1{,}5$. Dort geht die Bisektion weiter.' +
            '\n\nSo halbiert jeder Schritt das Intervall, in dem die Nullstelle $\\sqrt{2}$ sitzen muss.',
        'nu-obersumme':
            'Die Untersumme ($1{,}5$) ist zu klein, die Obersumme ($2{,}5$) zu groß – der wahre Wert $2$ liegt dazwischen.' +
            '\n\nMit doppelt so vielen Streifen rücken beide näher zusammen. Bei der Geraden trifft ihr Mittelwert den Wert sogar genau.',
        'nu-nuss':
            'Das Heron-Verfahren: aus einer Näherung $x$ für $\\sqrt{2}$ wird die bessere $\\frac{1}{2}\\left(x+\\frac{2}{x}\\right)$ – das Mittel aus $x$ und $\\frac{2}{x}$.' +
            '\n\nEin Schritt macht aus $1{,}5$ schon $1{,}4167$, der nächste $1{,}41422$. Die Bisektion braucht dafür zehn Schritte und mehr.',
    });
    aufgabenTexte({
        'nu-mitte':         'Bisektion für $f(x)=x^2-2$ auf $[1;2]$: welche Stelle wird zuerst geprüft?',
        'nu-wert':          'Bisektion für $f(x)=x^2-2$: wie groß ist $f(1{,}5)$?',
        'nu-vorzeichen':    'Hat $f(x)=x^2-2$ auf $[1;2]$ einen Vorzeichenwechsel? Berechne $f(1)\\cdot f(2)$ – negativ heißt ja.',
        'nu-mitte-zwei':    'Bisektion, zweiter Schritt: die Mitte von $[1;1{,}5]$.',
        'nu-wert-zwei':     'Bisektion für $f(x)=x^2-2$: wie groß ist $f(1{,}25)$?',
        'nu-mitte-drei':    'Bisektion, dritter Schritt: die Mitte von $[1{,}25;1{,}5]$.',
        'nu-wert-drei':     'Bisektion für $f(x)=x^2-2$: wie groß ist $f(1{,}375)$?',
        'nu-laenge':        'Wie lang ist das Intervall nach drei Bisektionsschritten, wenn es zuerst die Länge $1$ hatte?',
        'nu-zehn':          'Wie lang ist das Intervall nach zehn Bisektionsschritten (Startlänge $1$)?',
        'nu-dreieck':       'Die Fläche unter $f(x)=x$ von $0$ bis $2$ ist ein Dreieck. Wie groß ist sie genau?',
        'nu-untersumme':    'Fläche unter $f(x)=x$ von $0$ bis $2$ mit vier Streifen der Breite $0{,}5$: die Untersumme.',
        'nu-obersumme':     'Fläche unter $f(x)=x$ von $0$ bis $2$ mit vier Streifen der Breite $0{,}5$: die Obersumme.',
        'nu-mittelwert':    'Untersumme $1{,}5$ und Obersumme $2{,}5$: ihr Mittelwert.',
        'nu-probe':         'Probe der Näherung $1{,}4142$ für $\\sqrt{2}$: wie weit ist ihr Quadrat von $2$ entfernt?',
        'nu-kubik':         'Bisektion für $f(x)=x^3-5$ auf $[1;2]$: wie groß ist $f(1{,}5)$?',
        'nu-parabel-unten': 'Fläche unter $f(x)=x^2$ von $0$ bis $1$ mit vier Streifen der Breite $0{,}25$: die Untersumme.',
        'nu-parabel-oben':  'Fläche unter $f(x)=x^2$ von $0$ bis $1$ mit vier Streifen der Breite $0{,}25$: die Obersumme.',
        'nu-parabel-mitte': 'Untersumme $0{,}21875$ und Obersumme $0{,}46875$ unter der Parabel: ihr Mittelwert (genau wäre $\\frac{1}{3}$).',
        'nu-schritte':      'Nach wie vielen Bisektionsschritten ist ein Intervall der Länge $1$ auf $0{,}001$ geschrumpft?',
        'nu-nuss':          'Ein Schritt des Heron-Verfahrens für $\\sqrt{2}$ mit dem Startwert $1{,}5$.',
    });
})();
