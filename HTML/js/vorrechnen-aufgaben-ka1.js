// Block "Wiederholung · Klassenarbeit 1" - week 45 of Mathe BGY 11, the plan's "Wiederholung + Klassenarbeit 1 (LB 2 +
// LB 3: Grundlagen)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after
// the week's quiz (mathetest11-ka1.html): linear equations, formulas, the binomial formulas, x² = 121, a power, per
// cent, the cylinder, zero, slope, compound interest - and a nut with two squares that cancel.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['ka1-linear',      '4x+9=x-6',                                   'x'],
        ['ka1-nullstelle',  '-3x+12=0',                                   'x'],
        ['ka1-anstieg',     'm=\\frac{11-3}{6-2}',                        'm'],
        ['ka1-binom',       '(x-6)^2',                                    ''],
        ['ka1-faktor',      'x^2-100',                                    ''],
        ['ka1-quadrat',     'x^2=121',                                    'x'],
        ['ka1-potenz',      '5^x=625',                                    'x'],
        ['ka1-kapital',     'K=2000\\cdot 1{,}04^2',                      'K'],
        ['ka1-zylinder',    'V=\\pi\\cdot 2^2\\cdot 5',                   'V'],
        ['ka1-klammer',     '2(3x-4)=4(x+1)',                             'x'],
        ['ka1-dreieck',     'A=\\frac{1}{2}gh',                           'h'],
        ['ka1-gerade',      '11=2\\cdot 6+b',                             'b'],
        ['ka1-prozent',     '250\\cdot\\left(1-\\frac{p}{100}\\right)=200', 'p'],
        ['ka1-hoehe',       '100\\pi=\\pi\\cdot 5^2\\cdot h',             'h'],
        ['ka1-kuerzen',     '\\frac{(2x)^3}{4x}',                         ''],
        ['ka1-kegel',       'V=\\frac{1}{3}\\pi r^2 h',                   'h'],
        ['ka1-exp',         '3\\cdot 2^x=96',                             'x'],
        ['ka1-brueche',     '\\frac{x+2}{3}=\\frac{x-1}{2}',              'x'],
        ['ka1-klammerquadrat', '(x-3)^2=16',                              'x'],
        ['ka1-nuss',        '(x+2)^2-(x-2)^2=24',                         'x'],
    );
    BLOECKE.push({ titel: 'Wiederholung · Klassenarbeit 1', ab, bis: AUFGABEN.length, kw: 45 });
    Object.assign(LOESUNGEN, {
        'ka1-linear':      [['3x+9=-6', '-x'], ['3x=-15', '-9'], ['x=-5', ':3']],
        'ka1-nullstelle':  [['-3x=-12', '-12'], ['x=4', ':(-3)']],
        'ka1-anstieg':     [['m=\\frac{8}{4}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'ka1-binom':       [['=x^2-2\\cdot 6x+6^2', '\\text{binomische Formel}'], ['=x^2-12x+36', '\\text{ausrechnen}']],
        'ka1-faktor':      [['=x^2-10^2', '\\text{als Quadrat schreiben}'], ['=(x+10)(x-10)', '\\text{3. binomische Formel}']],
        'ka1-quadrat':     [['x_1=11\\quad x_2=-11', '\\sqrt{\\;}']],
        'ka1-potenz':      [['5^x=5^4', '\\text{als Potenz schreiben}'], ['x=4', '\\text{Exponenten vergleichen}']],
        'ka1-kapital':     [['K=2000\\cdot 1{,}0816', '\\text{Potenz ausrechnen}'], ['K=2163{,}2', '\\text{ausrechnen}']],
        'ka1-zylinder':    [['V=\\pi\\cdot 4\\cdot 5', '\\text{Potenz ausrechnen}'], ['V=20\\pi', '\\text{zusammenfassen}'],
                            ['V\\approx 62{,}8', '\\text{runden}']],
        'ka1-klammer':     [['6x-8=4x+4', '\\text{ausmultiplizieren}'], ['2x-8=4', '-4x'], ['2x=12', '+8'], ['x=6', ':2']],
        'ka1-dreieck':     [['2A=gh', '\\cdot 2'], ['h=\\frac{2A}{g}', ':g']],
        'ka1-gerade':      [['11=12+b', '\\text{ausrechnen}'], ['b=-1', '-12']],
        'ka1-prozent':     [['1-\\frac{p}{100}=0{,}8', ':250'], ['-\\frac{p}{100}=-0{,}2', '-1'], ['\\frac{p}{100}=0{,}2', '\\cdot(-1)'],
                            ['p=20', '\\cdot 100']],
        'ka1-hoehe':       [['100\\pi=25\\pi h', '\\text{ausrechnen}'], ['h=4', ':25\\pi']],
        'ka1-kuerzen':     [['=\\frac{8x^3}{4x}', '\\text{Potenzgesetz}'], ['=2x^2', '\\text{kürzen}']],
        'ka1-kegel':       [['3V=\\pi r^2 h', '\\cdot 3'], ['h=\\frac{3V}{\\pi r^2}', ':\\pi r^2']],
        'ka1-exp':         [['2^x=32', ':3'], ['2^x=2^5', '\\text{als Potenz schreiben}'], ['x=5', '\\text{Exponenten vergleichen}']],
        'ka1-brueche':     [['2(x+2)=3(x-1)', '\\cdot 6'], ['2x+4=3x-3', '\\text{ausmultiplizieren}'], ['-x+4=-3', '-3x'],
                            ['-x=-7', '-4'], ['x=7', ':(-1)']],
        'ka1-klammerquadrat': [['x-3=4\\;\\vee\\;x-3=-4', '\\sqrt{\\;}'], ['x_1=7\\quad x_2=-1', '+3']],
        'ka1-nuss':        [['(x^2+4x+4)-(x^2-4x+4)=24', '\\text{binomische Formeln}'], ['8x=24', '\\text{zusammenfassen}'],
                            ['x=3', ':8']],
    });
    Object.assign(ERKLAERUNGEN, {
        'ka1-quadrat':
            'Zwei Lösungen: $11^2=121$ und $(-11)^2=121$. Wer nur $x=11$ schreibt, verliert die Hälfte.' +
            '\n\nDie Wurzel $\\sqrt{121}=11$ ist immer positiv – das Minus kommt von der Gleichung, nicht von der Wurzel.',
        'ka1-nuss':
            'Die Quadrate heben sich weg: $x^2-x^2=0$ und $4-4=0$. Übrig bleibt $4x-(-4x)=8x$.' +
            '\n\nAchtung beim Minus vor der Klammer: $-(x^2-4x+4)=-x^2+4x-4$ – alle drei Vorzeichen drehen sich.' +
            '\n\nProbe mit $x=3$: $5^2-1^2=25-1=24$.',
    });
    aufgabenTexte({
        'ka1-nullstelle': 'Wo liegt die Nullstelle von $f(x)=-3x+12$?',
        'ka1-anstieg':   'Welchen Anstieg hat die Gerade durch $(2\\mid 3)$ und $(6\\mid 11)$?',
        'ka1-binom':     'Multipliziere aus.',
        'ka1-faktor':    'Faktorisiere.',
        'ka1-kapital':   'Ein Kapital von $2000$ € wächst mit $4\\,\\%$ pro Jahr. Wie viel ist nach zwei Jahren da?',
        'ka1-zylinder':  'Wie groß ist das Volumen eines Zylinders mit $r=2$ cm und $h=5$ cm?',
        'ka1-gerade':    'Die Gerade $y=2x+b$ geht durch den Punkt $(6\\mid 11)$. Wie groß ist $b$?',
        'ka1-prozent':   'Ein Preis fällt von $250$ € auf $200$ €. Um wie viel Prozent $p$?',
        'ka1-hoehe':     'Ein Zylinder hat $V=100\\pi\\ \\mathrm{cm^3}$ und $r=5$ cm. Wie hoch ist er?',
        'ka1-kuerzen':   'Vereinfache für $x\\ne 0$.',
        'ka1-kegel':     'Stelle die Formel für das Kegelvolumen nach der Höhe um.',
    });
})();
