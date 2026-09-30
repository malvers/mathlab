// Block "Quadratische Gleichungen · ohne Hilfsmittel" - week 47 of Mathe BGY 11, the plan's "Quadratische Gleichungen ohne
// Hilfsmittel (überschaubares Zahlenmaterial)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer
// an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty
// tasks, easy to hard, after the week's quiz (mathetest11-quadratische-gleichungen.html): factoring out, the square
// root, the product form, the pq formula (x_{1,2} = -p/2 ± √((p/2)² - q)), one double solution and one without any,
// the rectangle with perimeter 20 and area 21, two numbers with sum 12 and product 35, and a nut with x in a
// denominator. Two solutions stand side by side, "x_1=3\quad x_2=-5" - the last step of a solution is its result
// (ergebnisSchritt, js/vorrechnen-rechenweg.js).
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['qg-ausklammern',  'x^2-7x=0',                                   'x'],
        ['qg-rein',         '2x^2-8=0',                                   'x'],
        ['qg-dreimal',      'x^2=3x',                                     'x'],
        ['qg-faktor',       '3x^2-12x=0',                                 'x'],
        ['qg-produkt',      'x^2-5x+6=0',                                 'x'],
        ['qg-klammer',      '(x-1)^2=9',                                  'x'],
        ['qg-doppelt',      'x^2-8x+16=0',                                'x'],
        ['qg-pq-plus',      'x^2+2x-15=0',                                'x'],
        ['qg-pq-minus',     'x^2-4x-5=0',                                 'x'],
        ['qg-nullstellen',  'x^2-2x-8=0',                                 'x'],
        ['qg-keine',        'x^2+2x+5=0',                                 'x'],
        ['qg-bruch-p',      'x^2+x-12=0',                                 'x'],
        ['qg-normieren',    '2x^2-4x-6=0',                                'x'],
        ['qg-ausmultipliziert', '(x-2)(x+6)',                             ''],
        ['qg-zerlegen',     'x^2-x-12',                                   ''],
        ['qg-eine-loesung', '\\left(\\frac{6}{2}\\right)^2-c=0',          'c'],
        ['qg-rechteck',     'x(10-x)=21',                                 'x'],
        ['qg-zahlen',       'x(12-x)=35',                                 'x'],
        ['qg-quadrate',     '(x+1)^2+(x-1)^2=10',                         'x'],
        ['qg-nuss',         '\\frac{6}{x}=x-1\\quad(x\\ne 0)',            'x'],
    );
    BLOECKE.push({ titel: 'Quadratische Gleichungen · ohne Hilfsmittel', ab, bis: AUFGABEN.length, kw: 47 });
    Object.assign(LOESUNGEN, {
        'qg-ausklammern':  [['x(x-7)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=7', '\\text{Nullprodukt}']],
        'qg-rein':         [['2x^2=8', '+8'], ['x^2=4', ':2'], ['x_1=2\\quad x_2=-2', '\\sqrt{\\;}']],
        'qg-dreimal':      [['x^2-3x=0', '-3x'], ['x(x-3)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=3', '\\text{Nullprodukt}']],
        'qg-faktor':       [['3x(x-4)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=4', '\\text{Nullprodukt}']],
        'qg-produkt':      [['(x-2)(x-3)=0', '\\text{faktorisieren}'], ['x_1=2\\quad x_2=3', '\\text{Nullprodukt}']],
        'qg-klammer':      [['x-1=3\\;\\vee\\;x-1=-3', '\\sqrt{\\;}'], ['x_1=4\\quad x_2=-2', '+1']],
        'qg-doppelt':      [['(x-4)^2=0', '\\text{binomische Formel}'], ['x=4', '\\sqrt{\\;}']],
        'qg-pq-plus':      [['x_{1,2}=-1\\pm\\sqrt{1+15}', '\\text{pq-Formel}'], ['x_{1,2}=-1\\pm 4', '\\text{Wurzel ziehen}'],
                            ['x_1=3\\quad x_2=-5', '\\text{ausrechnen}']],
        'qg-pq-minus':     [['x_{1,2}=2\\pm\\sqrt{4+5}', '\\text{pq-Formel}'], ['x_{1,2}=2\\pm 3', '\\text{Wurzel ziehen}'],
                            ['x_1=5\\quad x_2=-1', '\\text{ausrechnen}']],
        'qg-nullstellen':  [['x_{1,2}=1\\pm\\sqrt{1+8}', '\\text{pq-Formel}'], ['x_{1,2}=1\\pm 3', '\\text{Wurzel ziehen}'],
                            ['x_1=4\\quad x_2=-2', '\\text{ausrechnen}']],
        'qg-keine':        [['x_{1,2}=-1\\pm\\sqrt{1-5}', '\\text{pq-Formel}'], ['x_{1,2}=-1\\pm\\sqrt{-4}', '\\text{ausrechnen}'],
                            ['L=\\{\\}', '\\text{Wurzel aus negativer Zahl}']],
        'qg-bruch-p':      [['x_{1,2}=-\\frac{1}{2}\\pm\\sqrt{\\frac{1}{4}+12}', '\\text{pq-Formel}'],
                            ['x_{1,2}=-\\frac{1}{2}\\pm\\sqrt{\\frac{49}{4}}', '\\text{Hauptnenner}'],
                            ['x_{1,2}=-\\frac{1}{2}\\pm\\frac{7}{2}', '\\text{Wurzel ziehen}'], ['x_1=3\\quad x_2=-4', '\\text{ausrechnen}']],
        'qg-normieren':    [['x^2-2x-3=0', ':2'], ['x_{1,2}=1\\pm\\sqrt{1+3}', '\\text{pq-Formel}'], ['x_{1,2}=1\\pm 2', '\\text{Wurzel ziehen}'],
                            ['x_1=3\\quad x_2=-1', '\\text{ausrechnen}']],
        'qg-ausmultipliziert': [['=x^2+6x-2x-12', '\\text{ausmultiplizieren}'], ['=x^2+4x-12', '\\text{zusammenfassen}']],
        'qg-zerlegen':     [['=x^2-4x+3x-12', '\\text{aufspalten}'], ['=x(x-4)+3(x-4)', '\\text{ausklammern}'],
                            ['=(x-4)(x+3)', '\\text{ausklammern}']],
        'qg-eine-loesung': [['9-c=0', '\\text{ausrechnen}'], ['c=9', '+c']],
        'qg-rechteck':     [['10x-x^2=21', '\\text{ausmultiplizieren}'], ['x^2-10x+21=0', '\\text{umstellen}'],
                            ['x_{1,2}=5\\pm\\sqrt{25-21}', '\\text{pq-Formel}'], ['x_{1,2}=5\\pm 2', '\\text{Wurzel ziehen}'],
                            ['x_1=7\\quad x_2=3', '\\text{ausrechnen}']],
        'qg-zahlen':       [['12x-x^2=35', '\\text{ausmultiplizieren}'], ['x^2-12x+35=0', '\\text{umstellen}'],
                            ['x_{1,2}=6\\pm\\sqrt{36-35}', '\\text{pq-Formel}'], ['x_{1,2}=6\\pm 1', '\\text{Wurzel ziehen}'],
                            ['x_1=7\\quad x_2=5', '\\text{ausrechnen}']],
        'qg-quadrate':     [['x^2+2x+1+x^2-2x+1=10', '\\text{binomische Formeln}'], ['2x^2+2=10', '\\text{zusammenfassen}'],
                            ['2x^2=8', '-2'], ['x^2=4', ':2'], ['x_1=2\\quad x_2=-2', '\\sqrt{\\;}']],
        'qg-nuss':         [['6=x^2-x', '\\cdot x'], ['x^2-x-6=0', '\\text{umstellen}'],
                            ['x_{1,2}=\\frac{1}{2}\\pm\\sqrt{\\frac{1}{4}+6}', '\\text{pq-Formel}'],
                            ['x_{1,2}=\\frac{1}{2}\\pm\\frac{5}{2}', '\\text{Wurzel ziehen}'], ['x_1=3\\quad x_2=-2', '\\text{ausrechnen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'qg-keine':
            'Unter der Wurzel steht $\\left(\\frac{p}{2}\\right)^2-q=1-5=-4$. Aus einer negativen Zahl gibt es keine (reelle) Wurzel.' +
            '\n\nAm Graphen: die Parabel $y=x^2+2x+5=(x+1)^2+4$ hat ihren Scheitel bei $(-1\\mid 4)$ – sie schneidet die $x$-Achse nie.',
        'qg-rechteck':
            'Umfang $20$: zwei Seiten zusammen sind $10$, also $x$ und $10-x$. Fläche $x(10-x)=21$.' +
            '\n\nBeide Lösungen beschreiben dasselbe Rechteck: $7$ cm mal $3$ cm. Probe: $7\\cdot 3=21$ und $2\\cdot(7+3)=20$.',
        'qg-nuss':
            'Mal $x$ ist erlaubt, weil $x\\ne 0$ – durch $0$ darf man nicht teilen, also darf $x$ auch nicht $0$ sein.' +
            '\n\nProbe: $\\frac{6}{3}=2=3-1$ und $\\frac{6}{-2}=-3=-2-1$. Beide Lösungen gelten.',
    });
})();
