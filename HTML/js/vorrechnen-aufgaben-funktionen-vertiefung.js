// Block "Funktionen · Vertiefung" - week 51 of Mathe BGY 11, the plan's "Vertiefung / Übung: Funktionen" (Doc,
// 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben orientieren!",
// "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after the week's quiz
// (mathetest11-funktionen-vertiefung.html): two phone tariffs, slope from two points, growth by 15 % and halving every
// ten years, a parameter from a point, 1/x, even and odd by f(-x), zeros of shifted parabolas, where a line meets a
// parabola - and the nut where it only touches.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['fv-tarif',        '0{,}20x=12',                                 'x'],
        ['fv-tarife',       '5+0{,}1x=0{,}2x',                            'x'],
        ['fv-anstieg',      'm=\\frac{10-(-2)}{4-0}',                     'm'],
        ['fv-bestand',      '200\\cdot 1{,}15^2',                         ''],
        ['fv-halbieren',    'N=800\\cdot\\left(\\frac{1}{2}\\right)^{30/10}', 'N'],
        ['fv-wert',         '4\\cdot\\left(\\frac{1}{2}\\right)^3',       ''],
        ['fv-potenz',       '3^x=243',                                    'x'],
        ['fv-parameter',    '40=a\\cdot 2^3',                             'a'],
        ['fv-hyperbel',     '\\frac{1}{x}=4\\quad(x\\ne 0)',              'x'],
        ['fv-hyperbel-plus', '\\frac{2}{x}+1=5\\quad(x\\ne 0)',           'x'],
        ['fv-gerade',       '(-x)^4-2(-x)^2',                             ''],
        ['fv-ungerade',     '(-x)^3+(-x)',                                ''],
        ['fv-nullstellen',  '-x^2+4=0',                                   'x'],
        ['fv-verschoben',   '(x+3)^2-1=0',                                'x'],
        ['fv-scheitel',     'x^2-6x+5',                                   ''],
        ['fv-kapital',      '5000\\cdot 1{,}08^2',                        ''],
        ['fv-schnitt',      '2x+3=x^2',                                   'x'],
        ['fv-schnitt-zwei', 'x^2=x+6',                                    'x'],
        ['fv-schnitt-wurzel', '2x+1=x^2',                                 'x'],
        ['fv-beruehren',    'x^2+1=2x',                                   'x'],
    );
    wochenBlock('funktionen-vertiefung', ab);
    Object.assign(LOESUNGEN, {
        'fv-tarif':         [['x=60', ':0{,}20']],
        'fv-tarife':        [['5=0{,}1x', '-0{,}1x'], ['x=50', ':0{,}1']],
        'fv-anstieg':       [['m=\\frac{12}{4}', '\\text{ausrechnen}'], ['m=3', '\\text{kürzen}']],
        'fv-bestand':       [['=200\\cdot 1{,}3225', '\\text{Potenz ausrechnen}'], ['=264{,}5', '\\text{ausrechnen}']],
        'fv-halbieren':     [['N=800\\cdot\\left(\\frac{1}{2}\\right)^3', '\\text{ausrechnen}'], ['N=800\\cdot\\frac{1}{8}', '\\text{Potenz ausrechnen}'],
                             ['N=100', '\\text{ausrechnen}']],
        'fv-wert':          [['=4\\cdot\\frac{1}{8}', '\\text{Potenz ausrechnen}'], ['=\\frac{1}{2}', '\\text{kürzen}']],
        'fv-potenz':        [['3^x=3^5', '\\text{als Potenz schreiben}'], ['x=5', '\\text{Exponenten vergleichen}']],
        'fv-parameter':     [['40=8a', '\\text{ausrechnen}'], ['a=5', ':8']],
        'fv-hyperbel':      [['1=4x', '\\cdot x'], ['x=\\frac{1}{4}', ':4']],
        'fv-hyperbel-plus': [['\\frac{2}{x}=4', '-1'], ['2=4x', '\\cdot x'], ['x=\\frac{1}{2}', ':4']],
        'fv-gerade':        [['=x^4-2x^2', '\\text{gerade Potenzen}']],
        'fv-ungerade':      [['=-x^3-x', '\\text{ungerade Potenzen}'], ['=-(x^3+x)', '\\text{ausklammern}']],
        'fv-nullstellen':   [['-x^2=-4', '-4'], ['x^2=4', '\\cdot(-1)'], ['x_1=2\\quad x_2=-2', '\\sqrt{\\;}']],
        'fv-verschoben':    [['(x+3)^2=1', '+1'], ['x+3=1\\;\\vee\\;x+3=-1', '\\sqrt{\\;}'], ['x_1=-2\\quad x_2=-4', '-3']],
        'fv-scheitel':      [['=x^2-6x+9-4', '\\text{quadratische Ergänzung}'], ['=(x-3)^2-4', '\\text{binomische Formel}']],
        'fv-kapital':       [['=5000\\cdot 1{,}1664', '\\text{Potenz ausrechnen}'], ['=5832', '\\text{ausrechnen}']],
        'fv-schnitt':       [['x^2-2x-3=0', '-2x-3'], ['x_{1,2}=1\\pm\\sqrt{1+3}', '\\text{pq-Formel}'], ['x_{1,2}=1\\pm 2', '\\text{Wurzel ziehen}'],
                             ['x_1=3\\quad x_2=-1', '\\text{ausrechnen}']],
        'fv-schnitt-zwei':  [['x^2-x-6=0', '-x-6'], ['x_{1,2}=\\frac{1}{2}\\pm\\sqrt{\\frac{1}{4}+6}', '\\text{pq-Formel}'],
                             ['x_{1,2}=\\frac{1}{2}\\pm\\frac{5}{2}', '\\text{Wurzel ziehen}'], ['x_1=3\\quad x_2=-2', '\\text{ausrechnen}']],
        'fv-schnitt-wurzel': [['x^2-2x-1=0', '-2x-1'], ['x_{1,2}=1\\pm\\sqrt{1+1}', '\\text{pq-Formel}'], ['x_{1,2}=1\\pm\\sqrt{2}', '\\text{ausrechnen}'],
                             ['x_1\\approx 2{,}41\\quad x_2\\approx -0{,}41', '\\text{runden}']],
        'fv-beruehren':     [['x^2-2x+1=0', '-2x'], ['(x-1)^2=0', '\\text{binomische Formel}'], ['x=1', '\\sqrt{\\;}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'fv-tarife':
            'Tarif A kostet $5$ € Grundgebühr und $0{,}10$ € je Minute, Tarif B nur $0{,}20$ € je Minute.' +
            '\n\nBei $50$ Minuten kosten beide $10$ €. Wer weniger telefoniert, nimmt B, wer mehr telefoniert, A.',
        'fv-gerade':
            'Setzt man $-x$ ein und es kommt wieder $f(x)$ heraus, ist der Graph symmetrisch zur $y$-Achse.' +
            '\n\nDas passiert, wenn nur gerade Potenzen vorkommen: $(-x)^4=x^4$ und $(-x)^2=x^2$.',
        'fv-beruehren':
            'Nur eine Lösung: die Gerade $y=2x$ schneidet die Parabel $y=x^2+1$ nicht, sie berührt sie im Punkt $(1\\mid 2)$ – eine Tangente.' +
            '\n\nMit der pq-Formel sieht man es an der Wurzel: $1\\pm\\sqrt{1-1}=1\\pm 0$.',
    });
    aufgabenTexte({
        'fv-tarif':      'Tarif B kostet $0{,}20$ € je Minute, Tarif A $12$ € fest. Nach wie vielen Minuten kosten beide gleich viel?',
        'fv-tarife':     'Tarif A: $5$ € Grundgebühr und $0{,}10$ € je Minute. Tarif B: $0{,}20$ € je Minute. Wann sind sie gleich teuer?',
        'fv-anstieg':    'Eine Gerade schneidet die $y$-Achse bei $-2$ und geht durch $(4\\mid 10)$. Wie groß ist ihr Anstieg?',
        'fv-bestand':    'Startwert $200$, Zunahme $15\\,\\%$ pro Jahr. Wie groß ist der Bestand nach zwei Jahren?',
        'fv-halbieren':  'Eine Größe von $800$ halbiert sich alle $10$ Jahre. Wie groß ist sie nach $30$ Jahren?',
        'fv-wert':       'Ein Graph geht durch $(0\\mid 4)$ und halbiert sich pro Schritt. Wie groß ist der Wert bei $x=3$?',
        'fv-parameter':  'Eine Exponentialfunktion $f(x)=a\\cdot 2^x$ geht durch $(3\\mid 40)$. Wie groß ist $a$?',
        'fv-hyperbel':   'Für welches $x$ ist $f(x)=\\frac{1}{x}$ gleich $4$?',
        'fv-gerade':     'Welche Symmetrie hat $f(x)=x^4-2x^2$? Setze $-x$ ein.',
        'fv-ungerade':   'Welche Symmetrie hat $f(x)=x^3+x$? Setze $-x$ ein.',
        'fv-nullstellen': 'Welche Nullstellen hat $f(x)=-x^2+4$?',
        'fv-verschoben': 'Welche Nullstellen hat $g(x)=(x+3)^2-1$?',
        'fv-scheitel':   'Welchen Wertebereich hat $f(x)=x^2-6x+5$? Bringe den Term in die Scheitelform.',
        'fv-kapital':    '$5000$ € werden mit $8\\,\\%$ jährlich verzinst. Wie viel ist nach zwei Jahren da?',
        'fv-schnitt':    'Wo schneiden sich $f(x)=2x+3$ und $g(x)=x^2$?',
        'fv-schnitt-zwei': 'Wo schneiden sich $f(x)=x^2$ und $g(x)=x+6$?',
        'fv-schnitt-wurzel': 'Wo schneiden sich $f(x)=2x+1$ und $g(x)=x^2$?',
        'fv-beruehren':  'Wo treffen sich die Parabel $y=x^2+1$ und die Gerade $y=2x$?',
    });
})();
