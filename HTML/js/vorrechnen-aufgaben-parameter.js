// Block "Parameter · verschieben, strecken, spiegeln" - week 8 of 2027, Mathe BGY 11, the plan's "Einfluss von Parametern:
// c·f(x), f(x)+c, f(c·x), f(x+c)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-parameter.html): what each parameter does to a point, a zero or the vertex -
// (x-4)², 2^x + 3, 0.5x², -x² + 2, f(3x), 5·f(x) keeps the zeros, √(x-4), a(x-3)² - 4 through a point, the vertex form
// by completing the square, sine with parameters - and the nut: for which a has ax² + 2x + 1 = 0 exactly one solution.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['pa-oben',         '2^0+3',                                      ''],
        ['pa-gestaucht',    '0{,}5\\cdot 4^2',                            ''],
        ['pa-rechts',       '(x-4)^2=0',                                  'x'],
        ['pa-links',        '(x+3)^2=0',                                  'x'],
        ['pa-wurzel',       '\\sqrt{x-4}=0',                              'x'],
        ['pa-scheitel',     '(x-2)^2+5',                                  ''],
        ['pa-sinus',        '2\\sin\\left(2\\cdot\\frac{\\pi}{4}\\right)', ''],
        ['pa-gespiegelt',   '-x^2+2=0',                                   'x'],
        ['pa-mal-fuenf',    '5(x^2-4)=0',                                 'x'],
        ['pa-gestaucht-x',  '(3x)^2-9=0',                                 'x'],
        ['pa-parabel-c',    '1=2^2+c',                                    'c'],
        ['pa-exp-rechts',   '2^{x-1}=8',                                  'x'],
        ['pa-exp-gestreckt', '3\\cdot 2^x+1=25',                          'x'],
        ['pa-ausmultiplizieren', '3(x-1)^2+2',                            ''],
        ['pa-punkt',        '4=a(5-3)^2-4',                               'a'],
        ['pa-sinus-oben',   '\\sin x+\\frac{1}{2}=1\\quad(0\\le x<2\\pi)', 'x'],
        ['pa-sinus-gestreckt', '3\\sin x-1=\\frac{1}{2}\\quad(0\\le x<2\\pi)', 'x'],
        ['pa-hyperbel',     '\\frac{2}{x+1}-1=0\\quad(x\\ne -1)',         'x'],
        ['pa-scheitelform', '2x^2+8x+3',                                  ''],
        ['pa-nuss',         '\\left(\\frac{1}{a}\\right)^2-\\frac{1}{a}=0\\quad(a\\ne 0)', 'a'],
    );
    wochenBlock('parameter', ab);
    Object.assign(LOESUNGEN, {
        'pa-oben':          [['=1+3', '2^0=1'], ['=4', '\\text{ausrechnen}']],
        'pa-gestaucht':     [['=0{,}5\\cdot 16', '\\text{Potenz ausrechnen}'], ['=8', '\\text{ausrechnen}']],
        'pa-rechts':        [['x-4=0', '\\sqrt{\\;}'], ['x=4', '+4']],
        'pa-links':         [['x+3=0', '\\sqrt{\\;}'], ['x=-3', '-3']],
        'pa-wurzel':        [['x-4=0', '\\text{quadrieren}'], ['x=4', '+4']],
        'pa-scheitel':      [['=x^2-4x+4+5', '\\text{binomische Formel}'], ['=x^2-4x+9', '\\text{zusammenfassen}']],
        'pa-sinus':         [['=2\\sin\\frac{\\pi}{2}', '\\text{ausrechnen}'], ['=2\\cdot 1', '\\text{Einheitskreis}'], ['=2', '\\text{ausrechnen}']],
        'pa-gespiegelt':    [['x^2=2', '+x^2'], ['x_1=\\sqrt{2}\\quad x_2=-\\sqrt{2}', '\\sqrt{\\;}']],
        'pa-mal-fuenf':     [['x^2-4=0', ':5'], ['x^2=4', '+4'], ['x_1=2\\quad x_2=-2', '\\sqrt{\\;}']],
        'pa-gestaucht-x':   [['9x^2=9', '+9,\\ \\text{Potenzgesetz}'], ['x^2=1', ':9'], ['x_1=1\\quad x_2=-1', '\\sqrt{\\;}']],
        'pa-parabel-c':     [['1=4+c', '\\text{ausrechnen}'], ['c=-3', '-4']],
        'pa-exp-rechts':    [['2^{x-1}=2^3', '\\text{als Potenz schreiben}'], ['x-1=3', '\\text{Exponenten vergleichen}'], ['x=4', '+1']],
        'pa-exp-gestreckt': [['3\\cdot 2^x=24', '-1'], ['2^x=8', ':3'], ['x=3', '2^3=8']],
        'pa-ausmultiplizieren': [['=3(x^2-2x+1)+2', '\\text{binomische Formel}'], ['=3x^2-6x+3+2', '\\text{ausmultiplizieren}'],
                             ['=3x^2-6x+5', '\\text{zusammenfassen}']],
        'pa-punkt':         [['4=4a-4', '\\text{ausrechnen}'], ['8=4a', '+4'], ['a=2', ':4']],
        'pa-sinus-oben':    [['\\sin x=\\frac{1}{2}', '-\\frac{1}{2}'], ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        'pa-sinus-gestreckt': [['3\\sin x=\\frac{3}{2}', '+1'], ['\\sin x=\\frac{1}{2}', ':3'],
                             ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        'pa-hyperbel':      [['\\frac{2}{x+1}=1', '+1'], ['2=x+1', '\\cdot(x+1)'], ['x=1', '-1']],
        'pa-scheitelform':  [['=2(x^2+4x)+3', '\\text{ausklammern}'], ['=2(x^2+4x+4-4)+3', '\\text{quadratische Ergänzung}'],
                             ['=2(x+2)^2-8+3', '\\text{binomische Formel}'], ['=2(x+2)^2-5', '\\text{zusammenfassen}']],
        'pa-nuss':          [['\\frac{1}{a^2}=\\frac{1}{a}', '+\\frac{1}{a}'], ['1=a', '\\cdot a^2'], ['a=1', '\\text{Seiten tauschen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'pa-mal-fuenf':
            'Strecken in $y$-Richtung ändert die Nullstellen nicht: wo $f(x)=0$ ist, ist auch $5\\cdot f(x)=0$.' +
            '\n\nDer Graph wird fünfmal so hoch – die Schnittpunkte mit der $x$-Achse bleiben, wo sie waren.',
        'pa-gestaucht-x':
            '$f(3x)$ staucht den Graphen in $x$-Richtung auf ein Drittel: $f(x)=x^2-9$ hat die Nullstellen $\\pm 3$, ' +
            '$f(3x)=(3x)^2-9$ die Nullstellen $\\pm 1$.',
        'pa-nuss':
            '$ax^2+2x+1=0$ geteilt durch $a$: $x^2+\\frac{2}{a}x+\\frac{1}{a}=0$. Genau eine Lösung heißt: unter der Wurzel der pq-Formel steht $0$, ' +
            'also $\\left(\\frac{1}{a}\\right)^2-\\frac{1}{a}=0$.' +
            '\n\nMit $a=1$: $x^2+2x+1=(x+1)^2=0$ – nur $x=-1$.',
    });
    aufgabenTexte({
        'pa-oben':       'Aus $f(x)=2^x$ wird $g(x)=2^x+3$. Wo schneidet $g$ die $y$-Achse?',
        'pa-gestaucht':  'Wie groß ist $f(4)$ für die gestauchte Parabel $f(x)=0{,}5x^2$?',
        'pa-rechts':     'Die Normalparabel wird um $4$ nach rechts verschoben. Wo liegt ihre Nullstelle?',
        'pa-links':      'Aus $f(x)=x^2$ wird $f(x+3)$. Wo liegt die Nullstelle?',
        'pa-wurzel':     'Aus $f(x)=\\sqrt{x}$ wird $g(x)=\\sqrt{x-4}$. Wo beginnt der Graph?',
        'pa-scheitel':   'Der Scheitel von $y=x^2$ wandert nach $(2\\mid 5)$: $y=(x-2)^2+5$. Schreibe den Term ohne Klammer.',
        'pa-sinus':      'Eine Sinuskurve mit doppelter Amplitude und halber Periode, $f(x)=2\\sin(2x)$: wie groß ist $f\\left(\\frac{\\pi}{4}\\right)$?',
        'pa-gespiegelt': 'Die Normalparabel wird an der $x$-Achse gespiegelt und um $2$ nach oben verschoben. Wo liegen die Nullstellen?',
        'pa-mal-fuenf':  'Welche Nullstellen hat $g(x)=5\\cdot f(x)$ mit $f(x)=x^2-4$?',
        'pa-gestaucht-x': 'Welche Nullstellen hat $f(3x)$ für $f(x)=x^2-9$?',
        'pa-parabel-c':  'Die Parabel $y=x^2+c$ geht durch $(2\\mid 1)$. Wie groß ist $c$?',
        'pa-punkt':      'Der Scheitel von $y=a(x-3)^2-4$ liegt bei $(3\\mid -4)$, die Parabel geht durch $(5\\mid 4)$. Wie groß ist $a$?',
        'pa-scheitelform': 'Bringe $f(x)=2x^2+8x+3$ in die Scheitelform.',
        'pa-nuss':       'Für welches $a$ hat $ax^2+2x+1=0$ genau eine Lösung? Unter der Wurzel der pq-Formel muss $0$ stehen.',
    });
})();
