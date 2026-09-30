// Block "Regression · Modelle aus Messwerten" - week 52 of Mathe BGY 11, the plan's "Regression mit digitalen Hilfsmitteln:
// linear, quadratisch, exponentiell" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den
// schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). The week's quiz
// (mathetest11-regression.html) asks mostly what a regression does; at the board goes the craft behind it: a line and
// an exponential model through two measured points, constant difference or constant quotient, predictions, the
// deviation of one point and the sum of squares, the cooling drink, a parabola through three points. Easy to hard.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['rg-anstieg',      'm=\\frac{8-2}{4-1}',                         'm'],
        ['rg-achse',        '2=2\\cdot 1+b',                              'b'],
        ['rg-quotient',     'q=\\frac{10}{5}',                            'q'],
        ['rg-vorhersage-exp', '5\\cdot 2^3',                              ''],
        ['rg-vorhersage-lin', 'y=2{,}1\\cdot 10+3{,}4',                   'y'],
        ['rg-mittel',       '\\frac{1+2+3+4}{4}',                         ''],
        ['rg-abweichung',   'r=7{,}2-(2\\cdot 3+1)',                      'r'],
        ['rg-quadratsumme', '0{,}2^2+(-0{,}3)^2+0{,}1^2',                 ''],
        ['rg-gerade-m',     'm=\\frac{13-5}{6-2}',                        'm'],
        ['rg-gerade-b',     '5=2\\cdot 2+b',                              'b'],
        ['rg-prozent',      'p=(1{,}04-1)\\cdot 100',                     'p'],
        ['rg-fehler',       '\\frac{102-100}{100}\\cdot 100',             ''],
        ['rg-extrapolation', 'y=0{,}5\\cdot 200+20',                      'y'],
        ['rg-exp-q',        '12=3\\cdot q^2\\quad(q>0)',                  'q'],
        ['rg-exp-faktor',   'q=\\frac{18}{6}',                            'q'],
        ['rg-exp-start',    '6=a\\cdot 3',                                'a'],
        ['rg-abkuehlung',   'T=20+60\\cdot 0{,}9^2',                      'T'],
        ['rg-abkuehlung-wann', '20+60\\cdot 0{,}5^t=35',                  't'],
        ['rg-parabel',      '10=a\\cdot 2^2+2',                           'a'],
        ['rg-drei-punkte',  '4a+2(1-a)+1=5',                              'a'],
    );
    wochenBlock('regression', ab);
    Object.assign(LOESUNGEN, {
        'rg-anstieg':       [['m=\\frac{6}{3}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'rg-achse':         [['2=2+b', '\\text{ausrechnen}'], ['b=0', '-2']],
        'rg-quotient':      [['q=2', '\\text{kürzen}']],
        'rg-vorhersage-exp': [['=5\\cdot 8', '\\text{Potenz ausrechnen}'], ['=40', '\\text{ausrechnen}']],
        'rg-vorhersage-lin': [['y=21+3{,}4', '\\text{ausrechnen}'], ['y=24{,}4', '\\text{ausrechnen}']],
        'rg-mittel':        [['=\\frac{10}{4}', '\\text{ausrechnen}'], ['=2{,}5', '\\text{kürzen}']],
        'rg-abweichung':    [['r=7{,}2-7', '\\text{Modellwert}'], ['r=0{,}2', '\\text{ausrechnen}']],
        'rg-quadratsumme':  [['=0{,}04+0{,}09+0{,}01', '\\text{quadrieren}'], ['=0{,}14', '\\text{ausrechnen}']],
        'rg-gerade-m':      [['m=\\frac{8}{4}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'rg-gerade-b':      [['5=4+b', '\\text{ausrechnen}'], ['b=1', '-4']],
        'rg-prozent':       [['p=0{,}04\\cdot 100', '\\text{ausrechnen}'], ['p=4', '\\text{ausrechnen}']],
        'rg-fehler':        [['=\\frac{2}{100}\\cdot 100', '\\text{ausrechnen}'], ['=2', '\\text{kürzen}']],
        'rg-extrapolation': [['y=100+20', '\\text{ausrechnen}'], ['y=120', '\\text{ausrechnen}']],
        'rg-exp-q':         [['q^2=4', ':3'], ['q=2', '\\sqrt{\\;}']],
        'rg-exp-faktor':    [['q=3', '\\text{kürzen}']],
        'rg-exp-start':     [['a=2', ':3']],
        'rg-abkuehlung':    [['T=20+60\\cdot 0{,}81', '\\text{Potenz ausrechnen}'], ['T=20+48{,}6', '\\text{ausrechnen}'], ['T=68{,}6', '\\text{ausrechnen}']],
        'rg-abkuehlung-wann': [['60\\cdot 0{,}5^t=15', '-20'], ['0{,}5^t=0{,}25', ':60'], ['0{,}5^t=0{,}5^2', '\\text{als Potenz schreiben}'],
                               ['t=2', '\\text{Exponenten vergleichen}']],
        'rg-parabel':       [['10=4a+2', '\\text{ausrechnen}'], ['8=4a', '-2'], ['a=2', ':4']],
        'rg-drei-punkte':   [['4a+2-2a+1=5', '\\text{ausmultiplizieren}'], ['2a+3=5', '\\text{zusammenfassen}'], ['2a=2', '-3'], ['a=1', ':2']],
    });
    Object.assign(ERKLAERUNGEN, {
        'rg-quadratsumme':
            'Die Abweichungen der Messpunkte vom Modell sind $0{,}2$, $-0{,}3$ und $0{,}1$. Einfach addiert gäbe das $0$ – ' +
            'als passte das Modell perfekt. Quadriert zählt jede Abweichung positiv.' +
            '\n\nDie Regression sucht das Modell, bei dem diese Quadratsumme am kleinsten ist: die Methode der kleinsten Quadrate.',
        'rg-drei-punkte':
            'Die Parabel $y=ax^2+bx+c$ soll durch $(0\\mid 1)$, $(1\\mid 2)$ und $(2\\mid 5)$ gehen.' +
            '\n\n$(0\\mid 1)$ gibt $c=1$. $(1\\mid 2)$ gibt $a+b+1=2$, also $b=1-a$. $(2\\mid 5)$ gibt $4a+2b+1=5$ – ' +
            'mit $b=1-a$ eingesetzt steht nur noch $a$ da.' +
            '\n\nErgebnis $a=1$, $b=0$, $c=1$: die Parabel $y=x^2+1$. Genau das macht der Rechner bei „quadratischer Regression“ durch drei Punkte.',
    });
    aufgabenTexte({
        'rg-anstieg':    'Messwerte $(1\\mid 2)$ und $(4\\mid 8)$: welchen Anstieg hat die Gerade durch sie?',
        'rg-achse':      'Die Gerade $y=2x+b$ geht durch $(1\\mid 2)$. Wie groß ist $b$?',
        'rg-quotient':   'Messwerte $(0\\mid 5)$, $(1\\mid 10)$, $(2\\mid 20)$: welcher Quotient liegt zwischen zwei Werten?',
        'rg-vorhersage-exp': 'Das Modell $y=5\\cdot 2^x$: welchen Wert sagt es für $x=3$ voraus?',
        'rg-vorhersage-lin': 'Eine lineare Regression liefert $y=2{,}1x+3{,}4$. Welchen Wert sagt sie für $x=10$ voraus?',
        'rg-mittel':     'Wie groß ist der Mittelwert der $x$-Werte $1$, $2$, $3$, $4$?',
        'rg-abweichung': 'Das Modell $y=2x+1$ sagt für $x=3$ einen Wert voraus, gemessen wurden $7{,}2$. Wie groß ist die Abweichung?',
        'rg-quadratsumme': 'Drei Messpunkte weichen um $0{,}2$, $-0{,}3$ und $0{,}1$ vom Modell ab. Wie groß ist die Summe der Quadrate?',
        'rg-gerade-m':   'Messwerte $(2\\mid 5)$ und $(6\\mid 13)$: welchen Anstieg hat die Gerade durch sie?',
        'rg-gerade-b':   'Die Gerade $y=2x+b$ geht durch $(2\\mid 5)$. Wie groß ist $b$?',
        'rg-prozent':    'Ein exponentielles Modell hat den Faktor $q=1{,}04$. Wie viel Prozent Zunahme sind das?',
        'rg-fehler':     'Das Modell sagt $102$ voraus, gemessen wurden $100$. Um wie viel Prozent liegt es daneben?',
        'rg-extrapolation': 'Ein Modell $y=0{,}5x+20$ aus Messwerten zwischen $x=0$ und $x=50$ wird für $x=200$ benutzt. Welchen Wert liefert es? (Extrapolation – mit Vorsicht.)',
        'rg-exp-q':      'Ein exponentielles Modell $y=3\\cdot q^x$ geht durch $(2\\mid 12)$. Wie groß ist $q$?',
        'rg-exp-faktor': 'Messwerte $(1\\mid 6)$ und $(2\\mid 18)$: welcher Faktor liegt zwischen ihnen?',
        'rg-exp-start':  'Das Modell $y=a\\cdot 3^x$ geht durch $(1\\mid 6)$. Wie groß ist $a$?',
        'rg-abkuehlung': 'Ein Getränk kühlt gemäß $T(t)=20+60\\cdot 0{,}9^t$ ab. Wie warm ist es nach $2$ Minuten?',
        'rg-abkuehlung-wann': 'Ein Getränk kühlt gemäß $T(t)=20+60\\cdot 0{,}5^t$ ab. Wann ist es $35$ °C warm?',
        'rg-parabel':    'Eine Parabel $y=ax^2+2$ geht durch $(2\\mid 10)$. Wie groß ist $a$?',
        'rg-drei-punkte': 'Die Parabel $y=ax^2+bx+c$ durch $(0\\mid 1)$, $(1\\mid 2)$, $(2\\mid 5)$: mit $c=1$ und $b=1-a$ bleibt eine Gleichung für $a$.',
    });
})();
