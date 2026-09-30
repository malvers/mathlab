// Block "Exponentialgleichungen · mit Logarithmus" - week 3 of 2027, Mathe BGY 11, the plan's "Exponentialgleichungen
// der Form a^x = b lösen" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-exponentialgleichungen.html): exact ones first (one base), then a^x = b by
// the logarithm, x = ln b / ln a, rounded to two places: the doubling at 5 %, half of it at 0.9 per day, the car that
// loses 15 % a year, the forest at -3 %, the bacteria 500·2^t = 8000, e^x - and two nuts with the unknown on both sides.
// Every step checked with sympy (the same solutions as the task, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['eg-zweiunddreissig', '2^x=32',                                  'x'],
        ['eg-siebenundzwanzigstel', '3^x=\\frac{1}{27}',                  'x'],
        ['eg-tausendstel',  '10^x=0{,}001',                               'x'],
        ['eg-e',            'e^x=1',                                      'x'],
        ['eg-plus-eins',    '3^{x+1}=81',                                 'x'],
        ['eg-vier-acht',    '4^x=8',                                      'x'],
        ['eg-faktor',       '2\\cdot 3^x=54',                             'x'],
        ['eg-bakterien',    '500\\cdot 2^t=8000',                         't'],
        ['eg-zwanzig',      '5^x=20',                                     'x'],
        ['eg-sieben',       '2^x=7',                                      'x'],
        ['eg-logarithmieren', '3^x=10',                                   'x'],
        ['eg-verdoppeln',   '1{,}05^n=2',                                 'n'],
        ['eg-halb',         '0{,}9^t=0{,}5',                              't'],
        ['eg-auto',         '0{,}85^n=0{,}5',                             'n'],
        ['eg-wald',         '0{,}97^n=0{,}8',                             'n'],
        ['eg-kapital',      '1000\\cdot 1{,}04^n=1500',                   'n'],
        ['eg-zerfall',      '80\\cdot 0{,}5^{t/3}=10',                    't'],
        ['eg-e-faktor',     '4e^{2x}=20',                                 'x'],
        ['eg-summe',        '2^x+2^{x+1}=24',                             'x'],
        ['eg-nuss',         '2^{x+3}=5^x',                                'x'],
    );
    BLOECKE.push({ titel: 'Exponentialgleichungen · mit Logarithmus', ab, bis: AUFGABEN.length, kw: 3 });
    Object.assign(LOESUNGEN, {
        'eg-zweiunddreissig': [['x=\\log_2 32', '\\text{Logarithmus}'], ['x=5', '2^5=32']],
        'eg-siebenundzwanzigstel': [['3^x=3^{-3}', '\\text{als Potenz schreiben}'], ['x=-3', '\\text{Exponenten vergleichen}']],
        'eg-tausendstel':   [['10^x=10^{-3}', '\\text{als Potenz schreiben}'], ['x=-3', '\\text{Exponenten vergleichen}']],
        'eg-e':             [['x=\\ln 1', '\\ln'], ['x=0', 'e^0=1']],
        'eg-plus-eins':     [['3^{x+1}=3^4', '\\text{als Potenz schreiben}'], ['x+1=4', '\\text{Exponenten vergleichen}'], ['x=3', '-1']],
        'eg-vier-acht':     [['2^{2x}=2^3', '\\text{als Potenz schreiben}'], ['2x=3', '\\text{Exponenten vergleichen}'], ['x=\\frac{3}{2}', ':2']],
        'eg-faktor':        [['3^x=27', ':2'], ['3^x=3^3', '\\text{als Potenz schreiben}'], ['x=3', '\\text{Exponenten vergleichen}']],
        'eg-bakterien':     [['2^t=16', ':500'], ['2^t=2^4', '\\text{als Potenz schreiben}'], ['t=4', '\\text{Exponenten vergleichen}']],
        'eg-zwanzig':       [['x=\\log_5 20', '\\text{Logarithmus}'], ['x=\\frac{\\ln 20}{\\ln 5}', '\\text{Basiswechsel}'],
                             ['x\\approx 1{,}86', '\\text{Taschenrechner}']],
        'eg-sieben':        [['x=\\log_2 7', '\\text{Logarithmus}'], ['x=\\frac{\\ln 7}{\\ln 2}', '\\text{Basiswechsel}'],
                             ['x\\approx 2{,}81', '\\text{Taschenrechner}']],
        'eg-logarithmieren': [['x\\cdot\\ln 3=\\ln 10', '\\ln,\\ \\text{Potenzregel}'], ['x=\\frac{\\ln 10}{\\ln 3}', ':\\ln 3'],
                             ['x\\approx 2{,}10', '\\text{Taschenrechner}']],
        'eg-verdoppeln':    [['n=\\frac{\\ln 2}{\\ln 1{,}05}', '\\ln,\\ \\text{Potenzregel}'], ['n\\approx 14{,}21', '\\text{Taschenrechner}']],
        'eg-halb':          [['t=\\frac{\\ln 0{,}5}{\\ln 0{,}9}', '\\ln,\\ \\text{Potenzregel}'], ['t\\approx 6{,}58', '\\text{Taschenrechner}']],
        'eg-auto':          [['n=\\frac{\\ln 0{,}5}{\\ln 0{,}85}', '\\ln,\\ \\text{Potenzregel}'], ['n\\approx 4{,}27', '\\text{Taschenrechner}']],
        'eg-wald':          [['n=\\frac{\\ln 0{,}8}{\\ln 0{,}97}', '\\ln,\\ \\text{Potenzregel}'], ['n\\approx 7{,}33', '\\text{Taschenrechner}']],
        'eg-kapital':       [['1{,}04^n=1{,}5', ':1000'], ['n=\\frac{\\ln 1{,}5}{\\ln 1{,}04}', '\\ln,\\ \\text{Potenzregel}'],
                             ['n\\approx 10{,}34', '\\text{Taschenrechner}']],
        'eg-zerfall':       [['0{,}5^{t/3}=0{,}125', ':80'], ['0{,}5^{t/3}=0{,}5^3', '\\text{als Potenz schreiben}'],
                             ['\\frac{t}{3}=3', '\\text{Exponenten vergleichen}'], ['t=9', '\\cdot 3']],
        'eg-e-faktor':      [['e^{2x}=5', ':4'], ['2x=\\ln 5', '\\ln'], ['x=\\frac{\\ln 5}{2}', ':2'], ['x\\approx 0{,}80', '\\text{Taschenrechner}']],
        'eg-summe':         [['2^x+2\\cdot 2^x=24', '\\text{Potenzgesetz}'], ['3\\cdot 2^x=24', '\\text{zusammenfassen}'], ['2^x=8', ':3'],
                             ['x=3', '2^3=8']],
        'eg-nuss':          [['(x+3)\\ln 2=x\\ln 5', '\\ln,\\ \\text{Potenzregel}'], ['x\\ln 2+3\\ln 2=x\\ln 5', '\\text{ausmultiplizieren}'],
                             ['3\\ln 2=x(\\ln 5-\\ln 2)', '-x\\ln 2,\\ \\text{ausklammern}'], ['x=\\frac{3\\ln 2}{\\ln 5-\\ln 2}', ':(\\ln 5-\\ln 2)'],
                             ['x\\approx 2{,}27', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'eg-verdoppeln':
            'Beide Seiten logarithmieren: $\\ln(1{,}05^n)=\\ln 2$, mit der Potenzregel $n\\cdot\\ln 1{,}05=\\ln 2$.' +
            '\n\nNach gut $14$ Jahren hat sich das Kapital verdoppelt. Faustregel: $70$ geteilt durch den Zinssatz, $\\frac{70}{5}=14$.',
        'eg-halb':
            '$\\ln 0{,}5$ und $\\ln 0{,}9$ sind beide negativ – ihr Quotient ist positiv. Nichts „umdrehen“: es ist eine Gleichung, keine Ungleichung.' +
            '\n\nProbe: $0{,}9^{6{,}58}\\approx 0{,}50$.',
        'eg-nuss':
            'Links Basis $2$, rechts Basis $5$ – kein gemeinsamer Exponent. Also logarithmieren, dann ist es eine lineare Gleichung in $x$.' +
            '\n\nAlle $x$-Terme auf eine Seite und $x$ ausklammern. Probe: $2^{5{,}27}\\approx 38{,}6$ und $5^{2{,}27}\\approx 38{,}6$.',
    });
    aufgabenTexte({
        'eg-bakterien':  'Eine Bakterienkultur wächst gemäß $N(t)=500\\cdot 2^t$ ($t$ in Stunden). Wann sind es $8000$?',
        'eg-verdoppeln': 'Ein Kapital wächst mit $5\\,\\%$ jährlich. Nach wie vielen Jahren hat es sich verdoppelt?',
        'eg-halb':       'Ein Stoff zerfällt mit dem Faktor $0{,}9$ pro Tag. Wann ist die Hälfte übrig?',
        'eg-auto':       'Ein Auto verliert jährlich $15\\,\\%$ an Wert. Wann ist es nur noch die Hälfte wert?',
        'eg-wald':       'Ein Waldbestand nimmt jährlich um $3\\,\\%$ ab. Nach wie vielen Jahren sind noch $80\\,\\%$ übrig?',
        'eg-kapital':    '$1000$ € werden mit $4\\,\\%$ verzinst. Nach wie vielen Jahren sind es $1500$ €?',
        'eg-zerfall':    'Von $80$ mg mit der Halbwertszeit $3$ Tage sind noch $10$ mg übrig. Wie viel Zeit ist vergangen?',
    });
})();
