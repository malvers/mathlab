// Block "Vermischte Übungen · Grundlagen sichern" - week 23 of 2027, Mathe BGY 11, the plan's "Vertiefung: vermischte
// Übungen (Grundlagen für Jgst. 12 sichern)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an
// den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks,
// easy to hard, across the year, after the week's quiz (mathetest11-vermischt.html): 5x - 7 = 2x + 8, A = πr² for r,
// the zeros of x² - 6x + 5, log_3 81, the factor after three years at 2 %, the period of sin(x/3), x + y = 10 and
// x - y = 4, two sixes, where √(2x - 6) is defined, the inverse of x/2 + 4, (2x+5)(2x-5), the cylinder's side, the
// vertex of x² + 4x + 1, 2^x = 64, a fair coin game, x⁶/x², f(-x) for x³ + 2x, x² + 1 = 0 - and the nut, a root
// equation with a false solution. Every step checked with sympy, every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['vm-linear',       '5x-7=2x+8',                                  'x'],
        ['vm-potenz',       '2^x=64',                                     'x'],
        ['vm-log',          '\\log_3 81',                                 ''],
        ['vm-sechsen',      '\\frac{1}{6}\\cdot\\frac{1}{6}',             ''],
        ['vm-kuerzen',      '\\frac{x^6}{x^2}',                           ''],
        ['vm-binom',        '(2x+5)(2x-5)',                               ''],
        ['vm-definition',   '2x-6=0',                                     'x'],
        ['vm-erwartung',    '0{,}5\\cdot 2+0{,}5\\cdot(-2)',              ''],
        ['vm-faktor',       '1{,}02^3',                                   ''],
        ['vm-periode',      'p=\\frac{2\\pi}{\\frac{1}{3}}',              'p'],
        ['vm-mantel',       'M=2\\pi\\cdot 4\\cdot 5',                    'M'],
        ['vm-umkehr',       'y=\\frac{x}{2}+4',                           'x'],
        ['vm-kreis',        'A=\\pi r^2\\quad(r>0)',                      'r'],
        ['vm-symmetrie',    '(-x)^3+2(-x)',                               ''],
        ['vm-keine',        'x^2+1=0',                                    'x'],
        ['vm-lgs',          '{\\begin{cases}x+y=10\\\\x-y=4\\end{cases}}', ''],
        ['vm-nullstellen',  'x^2-6x+5=0',                                 'x'],
        ['vm-scheitel',     'x^2+4x+1',                                   ''],
        ['vm-exp',          '3\\cdot 1{,}5^x=20',                         'x'],
        ['vm-nuss',         '\\sqrt{2x+1}=x-1\\quad(x\\ge 1)',            'x'],
    );
    wochenBlock('vermischt', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'vm-linear':        [['3x-7=8', '-2x'], ['3x=15', '+7'], ['x=5', ':3']],
        'vm-potenz':        [['2^x=2^6', '\\text{als Potenz schreiben}'], ['x=6', '\\text{Exponenten vergleichen}']],
        'vm-log':           [['=\\log_3 3^4', '\\text{als Potenz schreiben}'], ['=4', '\\text{Logarithmus}']],
        'vm-sechsen':       [['=\\frac{1}{36}', '\\text{Pfadregel}']],
        'vm-kuerzen':       [['=x^{6-2}', '\\text{Potenzgesetz}'], ['=x^4', '\\text{ausrechnen}']],
        'vm-binom':         [['=(2x)^2-5^2', '\\text{3. binomische Formel}'], ['=4x^2-25', '\\text{ausrechnen}']],
        'vm-definition':    [['2x=6', '+6'], ['x=3', ':2']],
        'vm-erwartung':     [['=1-1', '\\text{ausrechnen}'], ['=0', '\\text{ausrechnen}']],
        'vm-faktor':        [['\\approx 1{,}0612', '\\text{Taschenrechner}']],
        'vm-periode':       [['p=2\\pi\\cdot 3', '\\text{durch Bruch teilen}'], ['p=6\\pi', '\\text{ausrechnen}']],
        'vm-mantel':        [['M=40\\pi', '\\text{ausrechnen}'], ['M\\approx 125{,}7', '\\text{runden}']],
        'vm-umkehr':        [['y-4=\\frac{x}{2}', '-4'], ['x=2(y-4)', '\\cdot 2']],
        'vm-kreis':         [['r^2=\\frac{A}{\\pi}', ':\\pi'], ['r=\\sqrt{\\frac{A}{\\pi}}', '\\sqrt{\\;}']],
        'vm-symmetrie':     [['=-x^3-2x', '\\text{ungerade Potenzen}'], ['=-(x^3+2x)', '\\text{ausklammern}']],
        'vm-keine':         [['x^2=-1', '-1'], ['L=\\{\\}', '\\text{Quadrat nie negativ}']],
        'vm-lgs':           [['\\left(\\begin{array}{cc|c}1&1&10\\\\1&-1&4\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&1&10\\\\0&-2&-6\\end{array}\\right)', '\\text{II}-\\text{I}'],
                             ['x=7\\quad y=3', '\\text{rückwärts einsetzen}']],
        'vm-nullstellen':   [['x_{1,2}=3\\pm\\sqrt{9-5}', '\\text{pq-Formel}'], ['x_{1,2}=3\\pm 2', '\\text{Wurzel ziehen}'], ['x_1=5\\quad x_2=1', '\\text{ausrechnen}']],
        'vm-scheitel':      [['=x^2+4x+4-3', '\\text{quadratische Ergänzung}'], ['=(x+2)^2-3', '\\text{binomische Formel}']],
        'vm-exp':           [['1{,}5^x=\\frac{20}{3}', ':3'], ['x=\\frac{\\ln\\frac{20}{3}}{\\ln 1{,}5}', '\\ln,\\ \\text{Potenzregel}'],
                             ['x\\approx 4{,}68', '\\text{Taschenrechner}']],
        'vm-nuss':          [['2x+1=x^2-2x+1', '\\text{quadrieren}'], ['x^2-4x=0', '\\text{umstellen}'], ['x(x-4)=0', '\\text{ausklammern}'],
                             ['x=4', '\\text{Nullprodukt},\\ x\\ge 1']],
    });
    Object.assign(ERKLAERUNGEN, {
        'vm-nuss':
            'Die rechte Seite $x-1$ muss mindestens $0$ sein, weil eine Wurzel nie negativ ist – darum $x\\ge 1$.' +
            '\n\n$x=0$ löst zwar $x(x-4)=0$, aber nicht die Ausgangsgleichung: $\\sqrt{1}=1$, rechts steht $-1$. Probe mit $x=4$: $\\sqrt{9}=3=4-1$.',
    });
    aufgabenTexte({
        'vm-log':           'Wie groß ist $\\log_3 81$?',
        'vm-sechsen':       'Wie groß ist die Wahrscheinlichkeit für zwei Sechsen bei zwei Würfen?',
        'vm-kuerzen':       'Vereinfache für $x\\ne 0$.',
        'vm-binom':         'Multipliziere aus.',
        'vm-definition':    'Für $f(x)=\\sqrt{2x-6}$ muss $2x-6\\ge 0$ sein. Wo beginnt der Definitionsbereich?',
        'vm-erwartung':     'Münzspiel: Kopf bringt $2$ €, Zahl kostet $2$ €. Wie groß ist der Erwartungswert?',
        'vm-faktor':        'Ein Kapital wächst mit $2\\,\\%$ jährlich. Wie groß ist der Wachstumsfaktor nach drei Jahren?',
        'vm-periode':       'Welche Periode hat $f(x)=\\sin\\left(\\frac{x}{3}\\right)$?',
        'vm-mantel':        'Ein Zylinder hat $r=4$ cm und $h=5$ cm. Wie groß ist seine Mantelfläche?',
        'vm-umkehr':        'Stelle nach $x$ um – das führt zur Umkehrfunktion von $f(x)=\\frac{x}{2}+4$.',
        'vm-symmetrie':     'Welche Symmetrie hat $f(x)=x^3+2x$? Setze $-x$ ein.',
        'vm-lgs':           'Löse das System.',
        'vm-scheitel':      'Wo liegt der Scheitel von $f(x)=x^2+4x+1$? Bringe den Term in die Scheitelform.',
    });
})();
