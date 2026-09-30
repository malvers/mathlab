// Block "Periodische Vorgänge · Amplitude und Periode" - week 50 of Mathe BGY 11, the plan's "Periodische Vorgänge II:
// Sinusfunktion vertieft" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-sinus2.html): the period 2π/b, amplitude and middle from the highest and the
// lowest value, 50 Hz and 440 Hz, the tides h(t) = 3 sin(π/6 t) + 5, the big wheel, sin(x - π/2), and equations
// a·sin(bx) + d = c in their range - the nut with sin(2x) = √3/2.
// Every step checked with sympy (the same solutions in the range, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['s2-periode-zwei',  'p=\\frac{2\\pi}{2}',                                         'p'],
        ['s2-periode-halb',  'p=\\frac{2\\pi}{\\frac{1}{2}}',                              'p'],
        ['s2-frequenz',      'T=\\frac{1}{50}',                                            'T'],
        ['s2-hoechster',     'f=2\\sin\\frac{\\pi}{2}+5',                                  'f'],
        ['s2-amplitude',     'a=\\frac{16-8}{2}',                                          'a'],
        ['s2-mitte',         'd=\\frac{16+8}{2}',                                          'd'],
        ['s2-verschoben',    '\\sin\\left(\\pi-\\frac{\\pi}{2}\\right)',                   ''],
        ['s2-schwingungen',  'n=\\frac{2\\pi}{\\frac{2\\pi}{3}}',                          'n'],
        ['s2-flut',          'h=3\\sin\\left(\\frac{\\pi}{6}\\cdot 3\\right)+5',           'h'],
        ['s2-ebbe',          'h=3\\sin\\left(\\frac{\\pi}{6}\\cdot 9\\right)+5',           'h'],
        ['s2-gezeiten',      'p=\\frac{2\\pi}{\\frac{\\pi}{6}}',                           'p'],
        ['s2-kreisfrequenz', '\\omega=2\\pi\\cdot 440',                                    '\\omega'],
        ['s2-b',             '\\frac{2\\pi}{b}=4\\quad(b>0)',                              'b'],
        ['s2-streckung',     '3\\sin x=\\frac{3}{2}\\quad(0\\le x<2\\pi)',                 'x'],
        ['s2-anheben',       '\\sin x+2=\\frac{5}{2}\\quad(0\\le x<2\\pi)',                'x'],
        ['s2-gespiegelt',    '-4\\sin x=2\\quad(0\\le x<2\\pi)',                           'x'],
        ['s2-doppelt',       '\\sin(2x)=0\\quad(0\\le x<\\pi)',                            'x'],
        ['s2-riesenrad',     'h=20\\sin\\left(\\frac{\\pi}{15}\\cdot 5\\right)+22',        'h'],
        ['s2-wasser',        '3\\sin\\left(\\frac{\\pi}{6}t\\right)+5=\\frac{13}{2}\\quad(0\\le t<12)', 't'],
        ['s2-nuss',          '2\\sin(2x)=\\sqrt{3}\\quad(0\\le x<\\pi)',                   'x'],
    );
    BLOECKE.push({ titel: 'Periodische Vorgänge · Amplitude und Periode', ab, bis: AUFGABEN.length, kw: 50 });
    Object.assign(LOESUNGEN, {
        's2-periode-zwei':   [['p=\\pi', '\\text{kürzen}']],
        's2-periode-halb':   [['p=2\\pi\\cdot 2', '\\text{durch Bruch teilen}'], ['p=4\\pi', '\\text{ausrechnen}']],
        's2-frequenz':       [['T=0{,}02', '\\text{ausrechnen}']],
        's2-hoechster':      [['f=2\\cdot 1+5', '\\text{Einheitskreis}'], ['f=7', '\\text{ausrechnen}']],
        's2-amplitude':      [['a=\\frac{8}{2}', '\\text{ausrechnen}'], ['a=4', '\\text{kürzen}']],
        's2-mitte':          [['d=\\frac{24}{2}', '\\text{ausrechnen}'], ['d=12', '\\text{kürzen}']],
        's2-verschoben':     [['=\\sin\\frac{\\pi}{2}', '\\text{ausrechnen}'], ['=1', '\\text{Einheitskreis}']],
        's2-schwingungen':   [['n=2\\pi\\cdot\\frac{3}{2\\pi}', '\\text{durch Bruch teilen}'], ['n=3', '\\text{kürzen}']],
        's2-flut':           [['h=3\\sin\\frac{\\pi}{2}+5', '\\text{ausrechnen}'], ['h=3\\cdot 1+5', '\\text{Einheitskreis}'], ['h=8', '\\text{ausrechnen}']],
        's2-ebbe':           [['h=3\\sin\\frac{3\\pi}{2}+5', '\\text{ausrechnen}'], ['h=3\\cdot(-1)+5', '\\text{Einheitskreis}'],
                              ['h=2', '\\text{ausrechnen}']],
        's2-gezeiten':       [['p=2\\pi\\cdot\\frac{6}{\\pi}', '\\text{durch Bruch teilen}'], ['p=12', '\\text{kürzen}']],
        's2-kreisfrequenz':  [['\\omega=880\\pi', '\\text{ausrechnen}'], ['\\omega\\approx 2765', '\\text{runden}']],
        's2-b':              [['2\\pi=4b', '\\cdot b'], ['b=\\frac{\\pi}{2}', ':4']],
        's2-streckung':      [['\\sin x=\\frac{1}{2}', ':3'], ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        's2-anheben':        [['\\sin x=\\frac{1}{2}', '-2'], ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        's2-gespiegelt':     [['\\sin x=-\\frac{1}{2}', ':(-4)'], ['x_1=\\frac{7\\pi}{6}\\quad x_2=\\frac{11\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        's2-doppelt':        [['2x=0\\;\\vee\\;2x=\\pi', '\\text{Nullstellen des Sinus}'], ['x_1=0\\quad x_2=\\frac{\\pi}{2}', ':2']],
        's2-riesenrad':      [['h=20\\sin\\frac{\\pi}{3}+22', '\\text{ausrechnen}'], ['h=20\\cdot\\frac{\\sqrt{3}}{2}+22', '\\text{Einheitskreis}'],
                              ['h=10\\sqrt{3}+22', '\\text{kürzen}'], ['h\\approx 39{,}3', '\\text{runden}']],
        's2-wasser':         [['3\\sin\\left(\\frac{\\pi}{6}t\\right)=\\frac{3}{2}', '-5'], ['\\sin\\left(\\frac{\\pi}{6}t\\right)=\\frac{1}{2}', ':3'],
                              ['\\frac{\\pi}{6}t=\\frac{\\pi}{6}\\;\\vee\\;\\frac{\\pi}{6}t=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}'],
                              ['t_1=1\\quad t_2=5', ':\\frac{\\pi}{6}']],
        's2-nuss':           [['\\sin(2x)=\\frac{\\sqrt{3}}{2}', ':2'],
                              ['2x=\\frac{\\pi}{3}\\;\\vee\\;2x=\\frac{2\\pi}{3}', '\\text{Einheitskreis, Symmetrie}'],
                              ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{\\pi}{3}', ':2']],
    });
    Object.assign(ERKLAERUNGEN, {
        's2-amplitude':
            'Die Amplitude ist der halbe Abstand zwischen dem höchsten und dem tiefsten Wert: $a=\\frac{16-8}{2}=4$ Stunden.' +
            '\n\nDie Mittellage liegt genau dazwischen: $d=\\frac{16+8}{2}=12$ Stunden. Das Modell: $L(t)=4\\sin(\\ldots)+12$.',
        's2-wasser':
            'Ein Tag hat zwei Fluten – hier aber nur $0\\le t<12$, eine Periode. In ihr ist das Wasser zweimal $6{,}5$ m tief: ' +
            'steigend nach $1$ h, fallend nach $5$ h.' +
            '\n\nProbe: $3\\sin\\frac{\\pi}{6}+5=3\\cdot\\frac{1}{2}+5=6{,}5$.',
        's2-nuss':
            'Weil $x$ nur von $0$ bis $\\pi$ läuft, läuft $2x$ von $0$ bis $2\\pi$ – einmal ganz herum. ' +
            'Darum hat $\\sin(2x)=\\frac{\\sqrt{3}}{2}$ genau zwei Lösungen für $2x$.' +
            '\n\nErst am Ende durch $2$ teilen: $2x=\\frac{\\pi}{3}$ gibt $x=\\frac{\\pi}{6}$.',
    });
    aufgabenTexte({
        's2-periode-zwei': 'Welche Periode hat $f(x)=\\sin(2x)$? ($p=\\frac{2\\pi}{b}$)',
        's2-periode-halb': 'Welche Periode hat $f(x)=\\sin\\left(\\frac{x}{2}\\right)$?',
        's2-frequenz':   'Eine Wechselspannung hat $50$ Schwingungen pro Sekunde. Wie lang ist eine Periode (in s)?',
        's2-hoechster':  'Wie groß ist der höchste Wert von $f(x)=2\\sin x+5$?',
        's2-amplitude':  'Die Tageslänge schwankt zwischen $8$ h und $16$ h. Wie groß ist die Amplitude?',
        's2-mitte':      'Die Tageslänge schwankt zwischen $8$ h und $16$ h. Wie groß ist der Mittelwert?',
        's2-verschoben': 'Wie groß ist $f(\\pi)$ für $f(x)=\\sin\\left(x-\\frac{\\pi}{2}\\right)$?',
        's2-schwingungen': 'Wie viele Schwingungen macht $f(x)=\\sin(3x)$ im Intervall $0\\le x<2\\pi$?',
        's2-flut':       'Die Wassertiefe ist $h(t)=3\\sin\\left(\\frac{\\pi}{6}t\\right)+5$ (in m, $t$ in h). Wie tief ist es bei $t=3$?',
        's2-ebbe':       'Dasselbe Modell $h(t)=3\\sin\\left(\\frac{\\pi}{6}t\\right)+5$: wie tief ist es bei $t=9$?',
        's2-gezeiten':   'Das Modell $h(t)=3\\sin\\left(\\frac{\\pi}{6}t\\right)+5$: wie lang ist eine Gezeitenperiode (in h)?',
        's2-kreisfrequenz': 'Ein Ton hat die Frequenz $440$ Hz. Wie groß ist $\\omega=2\\pi f$ im Modell $y=A\\sin(\\omega t)$?',
        's2-b':          'Eine Schwingung soll die Periode $4$ haben. Wie groß ist $b$ in $\\sin(bx)$?',
        's2-riesenrad':  'Ein Riesenrad: $h(t)=20\\sin\\left(\\frac{\\pi}{15}t\\right)+22$ (in m, $t$ in s). Wie hoch ist die Gondel nach $5$ s?',
        's2-wasser':     'Das Gezeitenmodell $h(t)=3\\sin\\left(\\frac{\\pi}{6}t\\right)+5$: wann ist das Wasser $6{,}5$ m tief?',
    });
})();
