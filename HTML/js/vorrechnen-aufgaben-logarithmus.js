// Block "Logarithmus · Begriff und Gesetze" - week 2 of 2027, Mathe BGY 11, the plan's "Umkehren der
// Exponentialfunktionen: Begriff Logarithmus, Eigenschaften" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ
// bitte ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45
// min"). Twenty tasks, easy to hard, after the week's quiz (mathetest11-logarithmus.html): log_2 8 as "2 hoch
// wie viel ist 8", log of 1 and of 1/9, 10^(log 7), the three laws (product, quotient, power), the change of base with
// ln, the Richter scale, equations log_a x = c - and the nut with two logarithms that become one.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['lg-acht',         '\\log_2 8',                                  ''],
        ['lg-tausend',      '\\log_{10} 1000',                            ''],
        ['lg-eins',         '\\log_5 1',                                  ''],
        ['lg-zweiunddreissig', '\\log_2 32',                              ''],
        ['lg-neuntel',      '\\log_3\\frac{1}{9}',                        ''],
        ['lg-zurueck',      '10^{\\log_{10} 7}',                          ''],
        ['lg-ln',           '\\ln e^3+\\ln 1',                            ''],
        ['lg-summe',        '\\log_3 9+\\log_3 3',                        ''],
        ['lg-produkt',      '\\log_2 4+\\log_2 8',                        ''],
        ['lg-quotient',     '\\log_2 48-\\log_2 3',                       ''],
        ['lg-potenz',       '\\log_3 9^5',                                ''],
        ['lg-gleichung',    '\\log_2 x=5\\quad(x>0)',                     'x'],
        ['lg-gleichung-minus', '\\log_3 x=-1\\quad(x>0)',                 'x'],
        ['lg-richter',      '\\frac{10^6}{10^4}',                         ''],
        ['lg-wechsel',      '\\log_2 10',                                 ''],
        ['lg-wechsel-fuenf', '\\log_5 20',                                ''],
        ['lg-basis',        '\\log_x 49=2\\quad(x>0)',                    'x'],
        ['lg-verschoben',   '\\log_2(x-3)=2\\quad(x>3)',                  'x'],
        ['lg-gesetze',      '2\\log_2 6-\\log_2 9',                       ''],
        ['lg-nuss',         '\\log_2 x+\\log_2(x+2)=3\\quad(x>0)',        'x'],
    );
    wochenBlock('logarithmus', ab);
    Object.assign(LOESUNGEN, {
        'lg-acht':          [['=\\log_2 2^3', '\\text{als Potenz schreiben}'], ['=3', '\\text{Logarithmus}']],
        'lg-tausend':       [['=\\log_{10} 10^3', '\\text{als Potenz schreiben}'], ['=3', '\\text{Logarithmus}']],
        'lg-eins':          [['=\\log_5 5^0', '\\text{als Potenz schreiben}'], ['=0', '\\text{Logarithmus}']],
        'lg-zweiunddreissig': [['=\\log_2 2^5', '\\text{als Potenz schreiben}'], ['=5', '\\text{Logarithmus}']],
        'lg-neuntel':       [['=\\log_3 3^{-2}', '\\text{als Potenz schreiben}'], ['=-2', '\\text{Logarithmus}']],
        'lg-zurueck':       [['=7', '\\text{Umkehrfunktion}']],
        'lg-ln':            [['=3+0', '\\ln e^a=a,\\ \\ln 1=0'], ['=3', '\\text{ausrechnen}']],
        'lg-summe':         [['=2+1', '\\text{Logarithmus}'], ['=3', '\\text{ausrechnen}']],
        'lg-produkt':       [['=\\log_2(4\\cdot 8)', '\\text{Produktregel}'], ['=\\log_2 32', '\\text{ausrechnen}'], ['=5', '\\text{Logarithmus}']],
        'lg-quotient':      [['=\\log_2\\frac{48}{3}', '\\text{Quotientenregel}'], ['=\\log_2 16', '\\text{kürzen}'], ['=4', '\\text{Logarithmus}']],
        'lg-potenz':        [['=5\\cdot\\log_3 9', '\\text{Potenzregel}'], ['=5\\cdot 2', '\\text{Logarithmus}'], ['=10', '\\text{ausrechnen}']],
        'lg-gleichung':     [['x=2^5', '\\text{Definition}'], ['x=32', '\\text{ausrechnen}']],
        'lg-gleichung-minus': [['x=3^{-1}', '\\text{Definition}'], ['x=\\frac{1}{3}', '\\text{Potenzgesetz}']],
        'lg-richter':       [['=10^{6-4}', '\\text{Potenzgesetz}'], ['=100', '\\text{ausrechnen}']],
        'lg-wechsel':       [['=\\frac{\\ln 10}{\\ln 2}', '\\text{Basiswechsel}'], ['\\approx 3{,}32', '\\text{Taschenrechner}']],
        'lg-wechsel-fuenf': [['=\\frac{\\ln 20}{\\ln 5}', '\\text{Basiswechsel}'], ['\\approx 1{,}86', '\\text{Taschenrechner}']],
        'lg-basis':         [['x^2=49', '\\text{Definition}'], ['x=7', '\\sqrt{\\;},\\ x>0']],
        'lg-verschoben':    [['x-3=2^2', '\\text{Definition}'], ['x-3=4', '\\text{ausrechnen}'], ['x=7', '+3']],
        'lg-gesetze':       [['=\\log_2 6^2-\\log_2 9', '\\text{Potenzregel}'], ['=\\log_2\\frac{36}{9}', '\\text{Quotientenregel}'],
                             ['=\\log_2 4', '\\text{kürzen}'], ['=2', '\\text{Logarithmus}']],
        'lg-nuss':          [['\\log_2(x(x+2))=3', '\\text{Produktregel}'], ['x(x+2)=8', '\\text{Definition}'], ['x^2+2x-8=0', '\\text{umstellen}'],
                             ['x_{1,2}=-1\\pm 3', '\\text{pq-Formel}'], ['x=2', '\\text{ausrechnen},\\ x>0']],
    });
    Object.assign(ERKLAERUNGEN, {
        'lg-acht':
            '$\\log_2 8$ fragt: $2$ hoch wie viel ist $8$? Antwort $3$, denn $2^3=8$.' +
            '\n\nDer Logarithmus ist ein Exponent – die Umkehrung von „hoch“.',
        'lg-richter':
            'Die Richterskala ist ein Zehnerlogarithmus: jede Stufe mehr heißt zehnmal so starke Ausschläge.' +
            '\n\nStärke $6$ gegen Stärke $4$ sind zwei Stufen, also $10\\cdot 10=100$-mal so stark – nicht $1{,}5$-mal.',
        'lg-nuss':
            'Die Produktregel macht aus zwei Logarithmen einen: $\\log_2 x+\\log_2(x+2)=\\log_2(x(x+2))$.' +
            '\n\n$x=-4$ löst zwar $x^2+2x-8=0$, aber $\\log_2(-4)$ gibt es nicht – der Logarithmus braucht positive Zahlen.' +
            '\n\nProbe mit $x=2$: $\\log_2 2+\\log_2 4=1+2=3$.',
    });
    aufgabenTexte({
        'lg-richter':    'Ein Erdbeben der Stärke $6$ im Vergleich zur Stärke $4$ (Richterskala, Zehnerlogarithmus): wie viel stärker?',
        'lg-wechsel':    'Wie rechnet man $\\log_2 10$ mit einem Taschenrechner ohne Basis-$2$-Taste?',
        'lg-zurueck':    'Was ergibt $10^{\\log_{10} 7}$?',
    });
})();
