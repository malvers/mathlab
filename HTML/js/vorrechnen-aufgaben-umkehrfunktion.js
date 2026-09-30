// Block "Umkehrfunktionen · Wurzeln" - week 1 of 2027, Mathe BGY 11, the plan's "Umkehren von Funktionen: Beziehung
// Funktion ↔ Umkehrfunktion; Umkehren der Potenzfunktionen" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ
// bitte ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45
// min"). Twenty tasks, easy to hard, after the week's quiz (mathetest11-umkehrfunktion.html): y = f(x) solved for x
// (then x and y swap - the explanations say it), x² only for x ≥ 0, the cube root, roots as powers, √50 and √72
// partly drawn, √x = 7, √(x²) = |x|, and the nut √(x+6) = x where squaring brings in a false solution.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['uk-sieben',       '\\sqrt{x}=7',                                'x'],
        ['uk-summe',        '\\sqrt{81}+\\sqrt{16}',                      ''],
        ['uk-linear',       'y=2x+6',                                     'x'],
        ['uk-minus',        'y=3x-9',                                     'x'],
        ['uk-bruch',        'y=\\frac{x}{4}+1',                           'x'],
        ['uk-quadrat',      'y=x^2\\quad(x\\ge 0)',                       'x'],
        ['uk-kubik',        'y=x^3',                                      'x'],
        ['uk-verschoben',   '\\sqrt{x-1}=3',                              'x'],
        ['uk-fuenfzig',     '\\sqrt{50}',                                 ''],
        ['uk-zweiundsiebzig', '\\sqrt{72}',                               ''],
        ['uk-drittel',      '\\sqrt[3]{x^2}',                             ''],
        ['uk-potenzen',     '\\sqrt{x}\\cdot\\sqrt[3]{x}',                ''],
        ['uk-wert',         '10=2x+6',                                    'x'],
        ['uk-kehrwert',     'y=\\frac{1}{x}\\quad(x\\ne 0)',              'x'],
        ['uk-wurzel-plus',  '\\sqrt{x}+3=8',                              'x'],
        ['uk-wurzel-linear', '\\sqrt{2x+3}=5',                            'x'],
        ['uk-parabel',      'y=(x-2)^2\\quad(x\\ge 2)',                   'x'],
        ['uk-zaehler',      'y=\\frac{2x-1}{3}',                          'x'],
        ['uk-betrag',       '\\sqrt{x^2}=5',                              'x'],
        ['uk-nuss',         '\\sqrt{x+6}=x\\quad(x\\ge 0)',               'x'],
    );
    wochenBlock('umkehrfunktion', ab);
    Object.assign(LOESUNGEN, {
        'uk-sieben':        [['x=49', '\\text{quadrieren}']],
        'uk-summe':         [['=9+4', '\\text{Wurzel ziehen}'], ['=13', '\\text{ausrechnen}']],
        'uk-linear':        [['y-6=2x', '-6'], ['x=\\frac{y-6}{2}', ':2']],
        'uk-minus':         [['y+9=3x', '+9'], ['x=\\frac{y+9}{3}', ':3']],
        'uk-bruch':         [['y-1=\\frac{x}{4}', '-1'], ['x=4(y-1)', '\\cdot 4']],
        'uk-quadrat':       [['x=\\sqrt{y}', '\\sqrt{\\;},\\ x\\ge 0']],
        'uk-kubik':         [['x=\\sqrt[3]{y}', '\\sqrt[3]{\\;}']],
        'uk-verschoben':    [['x-1=9', '\\text{quadrieren}'], ['x=10', '+1']],
        'uk-fuenfzig':      [['=\\sqrt{25\\cdot 2}', '\\text{zerlegen}'], ['=5\\sqrt{2}', '\\text{teilweise Wurzel ziehen}']],
        'uk-zweiundsiebzig': [['=\\sqrt{36\\cdot 2}', '\\text{zerlegen}'], ['=6\\sqrt{2}', '\\text{teilweise Wurzel ziehen}']],
        'uk-drittel':       [['=x^{2/3}', '\\text{Wurzel als Potenz}']],
        'uk-potenzen':      [['=x^{1/2}\\cdot x^{1/3}', '\\text{Wurzel als Potenz}'], ['=x^{1/2+1/3}', '\\text{Potenzgesetz}'],
                             ['=x^{5/6}', '\\text{Hauptnenner}']],
        'uk-wert':          [['4=2x', '-6'], ['x=2', ':2']],
        'uk-kehrwert':      [['xy=1', '\\cdot x'], ['x=\\frac{1}{y}', ':y']],
        'uk-wurzel-plus':   [['\\sqrt{x}=5', '-3'], ['x=25', '\\text{quadrieren}']],
        'uk-wurzel-linear': [['2x+3=25', '\\text{quadrieren}'], ['2x=22', '-3'], ['x=11', ':2']],
        'uk-parabel':       [['x-2=\\sqrt{y}', '\\sqrt{\\;},\\ x\\ge 2'], ['x=\\sqrt{y}+2', '+2']],
        'uk-zaehler':       [['3y=2x-1', '\\cdot 3'], ['3y+1=2x', '+1'], ['x=\\frac{3y+1}{2}', ':2']],
        'uk-betrag':        [['x^2=25', '\\text{quadrieren}'], ['x_1=5\\quad x_2=-5', '\\sqrt{\\;}']],
        'uk-nuss':          [['x+6=x^2', '\\text{quadrieren}'], ['x^2-x-6=0', '\\text{umstellen}'],
                             ['x_{1,2}=\\frac{1}{2}\\pm\\frac{5}{2}', '\\text{pq-Formel}'], ['x=3', '\\text{ausrechnen},\\ x\\ge 0']],
    });
    Object.assign(ERKLAERUNGEN, {
        'uk-linear':
            'Die Umkehrfunktion macht rückgängig, was $f$ tut. Nach $x$ umstellen: $x=\\frac{y-6}{2}$.' +
            '\n\nDann die Namen tauschen: $f^{-1}(x)=\\frac{x-6}{2}$. Der Graph ist an der Geraden $y=x$ gespiegelt.' +
            '\n\nProbe: $f(1)=8$ und $f^{-1}(8)=\\frac{8-6}{2}=1$.',
        'uk-betrag':
            '$\\sqrt{x^2}$ ist nicht $x$, sondern $|x|$: für $x=-5$ ist $\\sqrt{(-5)^2}=\\sqrt{25}=5$.' +
            '\n\nDarum hat $\\sqrt{x^2}=5$ zwei Lösungen, $5$ und $-5$.',
        'uk-nuss':
            'Quadrieren ist keine Äquivalenzumformung: aus $a=b$ folgt $a^2=b^2$, aber nicht umgekehrt. Es kann Lösungen hinzubringen.' +
            '\n\nProbe mit $x=-2$: links $\\sqrt{4}=2$, rechts $-2$ – falsch. Mit $x=3$: $\\sqrt{9}=3$ – richtig. Die Probe gehört dazu.',
    });
    aufgabenTexte({
        'uk-linear':     'Stelle nach $x$ um – das führt zur Umkehrfunktion von $f(x)=2x+6$.',
        'uk-minus':      'Stelle nach $x$ um – das führt zur Umkehrfunktion von $f(x)=3x-9$.',
        'uk-quadrat':    'Die Umkehrfunktion von $f(x)=x^2$ für $x\\ge 0$.',
        'uk-kubik':      'Die Umkehrfunktion von $f(x)=x^3$.',
        'uk-fuenfzig':   'Vereinfache so weit wie möglich.',
        'uk-drittel':    'Schreibe als Potenz.',
        'uk-potenzen':   'Schreibe als eine Potenz von $x$.',
        'uk-wert':       'Für $f(x)=2x+6$: welches $x$ gehört zum Wert $10$, also $f^{-1}(10)$?',
        'uk-kehrwert':   'Die Umkehrfunktion von $f(x)=\\frac{1}{x}$ – sie ist ihre eigene.',
        'uk-parabel':    'Die Umkehrfunktion von $f(x)=(x-2)^2$ für $x\\ge 2$.',
    });
})();
