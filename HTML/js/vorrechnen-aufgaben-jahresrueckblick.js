// Block "Jahresrückblick · Ausblick Klasse 12" - week 25 of 2027, Mathe BGY 11, the plan's "Jahresrückblick; Ausblick
// Jgst. 12: Diskrete Zufallsgrößen, Differenzialrechnung" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte
// ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min").
// Twenty tasks, easy to hard, after the week's quiz (mathetest11-jahresrueckblick.html): 3(x-4) = 2x+1, E = ½mv² for
// v, the zeros of x² - 7x + 12, doubling every 8 hours, log_2 128, period and highest value of 3 sin(2x) + 1, a 2x2
// system and one with the row 0 = 0, at least one six in two throws, the sphere with r = 6 cm, (3x²)³, the expected
// value of a die, x² + 4 = 0 - and the look ahead: the mean rate of change of x² on [1;3], and the nut: the difference
// quotient (x+h)² - x² over h, which becomes the derivative in year 12.
// Every step checked with sympy (the same solutions, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['jr-linear',       '3(x-4)=2x+1',                                'x'],
        ['jr-log',          '\\log_2 128',                                ''],
        ['jr-periode',      'p=\\frac{2\\pi}{2}',                         'p'],
        ['jr-verdoppeln',   '2^{24/8}',                                   ''],
        ['jr-erwartung',    '\\frac{1+2+3+4+5+6}{6}',                     ''],
        ['jr-potenz',       '(3x^2)^3',                                   ''],
        ['jr-umkehr',       '10^x=1000',                                  'x'],
        ['jr-keine',        'x^2+4=0',                                    'x'],
        ['jr-hoechster',    '3\\sin\\left(2\\cdot\\frac{\\pi}{4}\\right)+1', ''],
        ['jr-sechs',        '1-\\left(\\frac{5}{6}\\right)^2',            ''],
        ['jr-verschoben',   '(x-3)^2+2',                                  ''],
        ['jr-kugel',        'V=\\frac{4}{3}\\pi\\cdot 6^3',               'V'],
        ['jr-energie',      'E=\\frac{1}{2}mv^2\\quad(v>0)',              'v'],
        ['jr-lgs',          '{\\begin{cases}x+y=4\\\\2x-y=5\\end{cases}}', ''],
        ['jr-nullzeile',    '{\\begin{cases}x+2y=4\\\\2x+4y=8\\end{cases}}', ''],
        ['jr-nullstellen',  'x^2-7x+12=0',                                'x'],
        ['jr-sinus',        '\\sin x=\\frac{\\sqrt{3}}{2}\\quad(0\\le x<2\\pi)', 'x'],
        ['jr-exp',          '500\\cdot 1{,}03^n=1000',                    'n'],
        ['jr-aenderung',    '\\frac{3^2-1^2}{3-1}',                       ''],
        ['jr-nuss',         '\\frac{(x+h)^2-x^2}{h}',                     ''],
    );
    wochenBlock('jahresrueckblick', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'jr-linear':        [['3x-12=2x+1', '\\text{ausmultiplizieren}'], ['x-12=1', '-2x'], ['x=13', '+12']],
        'jr-log':           [['=\\log_2 2^7', '\\text{als Potenz schreiben}'], ['=7', '\\text{Logarithmus}']],
        'jr-periode':       [['p=\\pi', '\\text{kürzen}']],
        'jr-verdoppeln':    [['=2^3', '\\text{ausrechnen}'], ['=8', '\\text{ausrechnen}']],
        'jr-erwartung':     [['=\\frac{21}{6}', '\\text{addieren}'], ['=3{,}5', '\\text{kürzen}']],
        'jr-potenz':        [['=3^3\\cdot(x^2)^3', '\\text{Potenzgesetz}'], ['=27x^6', '\\text{ausrechnen}']],
        'jr-umkehr':        [['x=\\log_{10} 1000', '\\text{Logarithmus}'], ['x=3', '10^3=1000']],
        'jr-keine':         [['x^2=-4', '-4'], ['L=\\{\\}', '\\text{Quadrat nie negativ}']],
        'jr-hoechster':     [['=3\\sin\\frac{\\pi}{2}+1', '\\text{ausrechnen}'], ['=3\\cdot 1+1', '\\text{Einheitskreis}'], ['=4', '\\text{ausrechnen}']],
        'jr-sechs':         [['=1-\\frac{25}{36}', '\\text{Potenz ausrechnen}'], ['=\\frac{11}{36}', '\\text{ausrechnen}']],
        'jr-verschoben':    [['=x^2-6x+9+2', '\\text{binomische Formel}'], ['=x^2-6x+11', '\\text{zusammenfassen}']],
        'jr-kugel':         [['V=\\frac{4}{3}\\pi\\cdot 216', '\\text{Potenz ausrechnen}'], ['V=288\\pi', '\\text{kürzen}'], ['V\\approx 904{,}8', '\\text{runden}']],
        'jr-energie':       [['2E=mv^2', '\\cdot 2'], ['v^2=\\frac{2E}{m}', ':m'], ['v=\\sqrt{\\frac{2E}{m}}', '\\sqrt{\\;}']],
        'jr-lgs':           [['\\left(\\begin{array}{cc|c}1&1&4\\\\2&-1&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&1&4\\\\0&-3&-3\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['x=3\\quad y=1', '\\text{rückwärts einsetzen}']],
        'jr-nullzeile':     [['\\left(\\begin{array}{cc|c}1&2&4\\\\2&4&8\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&2&4\\\\0&0&0\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['x=4-2t\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'jr-nullstellen':   [['x_{1,2}=\\frac{7}{2}\\pm\\sqrt{\\frac{49}{4}-12}', '\\text{pq-Formel}'],
                             ['x_{1,2}=\\frac{7}{2}\\pm\\frac{1}{2}', '\\text{Wurzel ziehen}'], ['x_1=4\\quad x_2=3', '\\text{ausrechnen}']],
        'jr-sinus':         [['x_1=\\frac{\\pi}{3}\\quad x_2=\\pi-\\frac{\\pi}{3}', '\\text{Einheitskreis, Symmetrie}'],
                             ['x_1=\\frac{\\pi}{3}\\quad x_2=\\frac{2\\pi}{3}', '\\text{ausrechnen}']],
        'jr-exp':           [['1{,}03^n=2', ':500'], ['n=\\frac{\\ln 2}{\\ln 1{,}03}', '\\ln,\\ \\text{Potenzregel}'], ['n\\approx 23{,}45', '\\text{Taschenrechner}']],
        'jr-aenderung':     [['=\\frac{9-1}{2}', '\\text{ausrechnen}'], ['=\\frac{8}{2}', '\\text{ausrechnen}'], ['=4', '\\text{kürzen}']],
        'jr-nuss':          [['=\\frac{x^2+2xh+h^2-x^2}{h}', '\\text{binomische Formel}'], ['=\\frac{2xh+h^2}{h}', '\\text{zusammenfassen}'],
                             ['=\\frac{h(2x+h)}{h}', '\\text{ausklammern}'], ['=2x+h', '\\text{kürzen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'jr-aenderung':
            'Die mittlere Änderungsrate von $f(x)=x^2$ zwischen $x=1$ und $x=3$: Unterschied der Funktionswerte durch Unterschied der Stellen.' +
            '\n\nDas ist der Anstieg der Sekante durch $(1\\mid 1)$ und $(3\\mid 9)$ – derselbe Bruch wie beim Anstieg einer Geraden.',
        'jr-nuss':
            'Der Differenzenquotient: die mittlere Änderungsrate von $f(x)=x^2$ zwischen $x$ und $x+h$.' +
            '\n\nWird $h$ immer kleiner, bleibt $2x$ übrig – der Anstieg der Parabel an der Stelle $x$. Das ist die Ableitung, das große Thema der Klasse 12.' +
            '\n\nProbe mit $x=1$, $h=2$: $2\\cdot 1+2=4$, wie in der Aufgabe davor.',
    });
    aufgabenTexte({
        'jr-log':           'Wie groß ist $\\log_2 128$?',
        'jr-periode':       'Welche Periode hat $f(x)=3\\sin(2x)+1$?',
        'jr-verdoppeln':    'Ein Bestand verdoppelt sich alle $8$ Stunden. Auf das Wievielfache wächst er an einem Tag?',
        'jr-erwartung':     'Wie groß ist der Erwartungswert beim Wurf eines fairen Würfels?',
        'jr-potenz':        'Vereinfache.',
        'jr-umkehr':        'Die Umkehrfunktion von $f(x)=10^x$ ist der Zehnerlogarithmus. Für welches $x$ ist $10^x=1000$?',
        'jr-hoechster':     'Wie groß ist der höchste Wert von $f(x)=3\\sin(2x)+1$? Er wird bei $x=\\frac{\\pi}{4}$ erreicht.',
        'jr-sechs':         'Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs bei zwei Würfen?',
        'jr-verschoben':    '$g(x)=f(x-3)+2$ mit $f(x)=x^2$: schreibe $g$ ohne Klammer.',
        'jr-kugel':         'Wie groß ist das Volumen einer Kugel mit $r=6$ cm?',
        'jr-lgs':           'Löse das System.',
        'jr-nullzeile':     'Löse das System. Was bedeutet die Zeile $0=0$?',
        'jr-exp':           'Ein Kapital von $500$ € wächst mit $3\\,\\%$ jährlich. Nach wie vielen Jahren sind es $1000$ €?',
        'jr-aenderung':     'Ausblick Klasse 12: die mittlere Änderungsrate von $f(x)=x^2$ zwischen $x=1$ und $x=3$.',
        'jr-nuss':          'Ausblick Klasse 12: die mittlere Änderungsrate von $f(x)=x^2$ zwischen $x$ und $x+h$ – der Differenzenquotient.',
    });
})();
