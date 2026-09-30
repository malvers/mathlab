// Block "Wiederholung · Klassenarbeit 2" - week 4 of 2027, Mathe BGY 11, the plan's "Wiederholung + Klassenarbeit 2 (LB 3:
// Funktionen bis Logarithmus)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-ka2.html): parabolas and their zeros, the period of sin 4x, log_2 64, 3^x =
// 243, the inverse of 3x - 9, growth from 400 to 500, √72, √(x-1) = 3, the half-life 80·0.5^(t/3), sin x = 1/2,
// log_3(x-2) = 2 - and the nut 2^(x+1) = 3^x.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['k2-periode',      'p=\\frac{2\\pi}{4}',                         'p'],
        ['k2-log',          '\\log_2 64',                                 ''],
        ['k2-potenz',       '3^x=243',                                    'x'],
        ['k2-faktor',       'q=\\frac{500}{400}',                         'q'],
        ['k2-wurzel',       '\\sqrt{72}',                                 ''],
        ['k2-logsumme',     '\\log_5 25+\\log_5 5',                       ''],
        ['k2-anstieg',      'm=\\frac{10-2}{3-(-1)}',                     'm'],
        ['k2-umkehr',       'y=3x-9',                                     'x'],
        ['k2-verschoben',   '(x-2)^2+1',                                  ''],
        ['k2-abnahme',      '50\\cdot 0{,}9^2',                           ''],
        ['k2-doppelt',      'x^2+4x+4=0',                                 'x'],
        ['k2-wurzelgl',     '\\sqrt{x-1}=3',                              'x'],
        ['k2-nullstellen',  'x^2-3x-10=0',                                'x'],
        ['k2-normieren',    '2x^2-12x+10=0',                              'x'],
        ['k2-scheitel',     '(x+1)^2-3=0',                                'x'],
        ['k2-halbwert',     '80\\cdot 0{,}5^{t/3}=20',                    't'],
        ['k2-sinus',        '2\\sin x-1=0\\quad(0\\le x<2\\pi)',          'x'],
        ['k2-exp',          '3\\cdot 2^x=30',                             'x'],
        ['k2-loggl',        '\\log_3(x-2)=2\\quad(x>2)',                  'x'],
        ['k2-nuss',         '2^{x+1}=3^x',                                'x'],
    );
    BLOECKE.push({ titel: 'Wiederholung · Klassenarbeit 2', ab, bis: AUFGABEN.length, kw: 4 });
    Object.assign(LOESUNGEN, {
        'k2-periode':       [['p=\\frac{\\pi}{2}', '\\text{kürzen}']],
        'k2-log':           [['=\\log_2 2^6', '\\text{als Potenz schreiben}'], ['=6', '\\text{Logarithmus}']],
        'k2-potenz':        [['3^x=3^5', '\\text{als Potenz schreiben}'], ['x=5', '\\text{Exponenten vergleichen}']],
        'k2-faktor':        [['q=1{,}25', '\\text{ausrechnen}']],
        'k2-wurzel':        [['=\\sqrt{36\\cdot 2}', '\\text{zerlegen}'], ['=6\\sqrt{2}', '\\text{teilweise Wurzel ziehen}']],
        'k2-logsumme':      [['=2+1', '\\text{Logarithmus}'], ['=3', '\\text{ausrechnen}']],
        'k2-anstieg':       [['m=\\frac{8}{4}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'k2-umkehr':        [['y+9=3x', '+9'], ['x=\\frac{y+9}{3}', ':3']],
        'k2-verschoben':    [['=x^2-4x+4+1', '\\text{binomische Formel}'], ['=x^2-4x+5', '\\text{zusammenfassen}']],
        'k2-abnahme':       [['=50\\cdot 0{,}81', '\\text{Potenz ausrechnen}'], ['=40{,}5', '\\text{ausrechnen}']],
        'k2-doppelt':       [['(x+2)^2=0', '\\text{binomische Formel}'], ['x=-2', '\\sqrt{\\;}']],
        'k2-wurzelgl':      [['x-1=9', '\\text{quadrieren}'], ['x=10', '+1']],
        'k2-nullstellen':   [['x_{1,2}=\\frac{3}{2}\\pm\\sqrt{\\frac{9}{4}+10}', '\\text{pq-Formel}'],
                             ['x_{1,2}=\\frac{3}{2}\\pm\\frac{7}{2}', '\\text{Wurzel ziehen}'], ['x_1=5\\quad x_2=-2', '\\text{ausrechnen}']],
        'k2-normieren':     [['x^2-6x+5=0', ':2'], ['x_{1,2}=3\\pm\\sqrt{9-5}', '\\text{pq-Formel}'], ['x_{1,2}=3\\pm 2', '\\text{Wurzel ziehen}'],
                             ['x_1=5\\quad x_2=1', '\\text{ausrechnen}']],
        'k2-scheitel':      [['(x+1)^2=3', '+3'], ['x+1=\\sqrt{3}\\;\\vee\\;x+1=-\\sqrt{3}', '\\sqrt{\\;}'],
                             ['x_1\\approx 0{,}73\\quad x_2\\approx -2{,}73', '-1,\\ \\text{runden}']],
        'k2-halbwert':      [['0{,}5^{t/3}=0{,}25', ':80'], ['0{,}5^{t/3}=0{,}5^2', '\\text{als Potenz schreiben}'],
                             ['\\frac{t}{3}=2', '\\text{Exponenten vergleichen}'], ['t=6', '\\cdot 3']],
        'k2-sinus':         [['\\sin x=\\frac{1}{2}', '+1,\\ :2'], ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        'k2-exp':           [['2^x=10', ':3'], ['x=\\frac{\\ln 10}{\\ln 2}', '\\ln,\\ \\text{Potenzregel}'], ['x\\approx 3{,}32', '\\text{Taschenrechner}']],
        'k2-loggl':         [['x-2=3^2', '\\text{Definition}'], ['x-2=9', '\\text{ausrechnen}'], ['x=11', '+2']],
        'k2-nuss':          [['(x+1)\\ln 2=x\\ln 3', '\\ln,\\ \\text{Potenzregel}'], ['x\\ln 2+\\ln 2=x\\ln 3', '\\text{ausmultiplizieren}'],
                             ['\\ln 2=x(\\ln 3-\\ln 2)', '-x\\ln 2,\\ \\text{ausklammern}'], ['x=\\frac{\\ln 2}{\\ln 3-\\ln 2}', ':(\\ln 3-\\ln 2)'],
                             ['x\\approx 1{,}71', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'k2-halbwert':
            'In $N(t)=80\\cdot 0{,}5^{t/3}$ ist $3$ die Halbwertszeit: nach $3$ Zeiteinheiten ist der Exponent $1$, der Bestand halb so groß.' +
            '\n\nVon $80$ auf $20$ ist zweimal halbiert – also zwei Halbwertszeiten, $t=6$.',
        'k2-nuss':
            'Zwei verschiedene Basen: logarithmieren, dann ist es linear in $x$.' +
            '\n\nProbe: $2^{2{,}71}\\approx 6{,}5$ und $3^{1{,}71}\\approx 6{,}5$.',
    });
    aufgabenTexte({
        'k2-periode':    'Welche Periode hat $f(x)=\\sin(4x)$?',
        'k2-faktor':     'Ein Bestand wächst in einem Jahr von $400$ auf $500$. Wie groß ist der Wachstumsfaktor?',
        'k2-anstieg':    'Welchen Anstieg hat die Gerade durch $(-1\\mid 2)$ und $(3\\mid 10)$?',
        'k2-umkehr':     'Stelle nach $x$ um – das führt zur Umkehrfunktion von $f(x)=3x-9$.',
        'k2-verschoben': 'Der Graph von $f(x)=x^2$ wird um $2$ nach rechts und $1$ nach oben verschoben. Schreibe den Term ohne Klammer.',
        'k2-abnahme':    'Startwert $50$, jährlich $10\\,\\%$ weniger. Wie groß ist der Wert nach zwei Jahren?',
        'k2-scheitel':   'Welche Nullstellen hat $f(x)=(x+1)^2-3$?',
        'k2-halbwert':   'Ein Modell lautet $N(t)=80\\cdot 0{,}5^{t/3}$. Wann sind noch $20$ übrig?',
    });
})();
