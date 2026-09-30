// Block "Periodische Vorgänge · Sinus am Einheitskreis" - week 49 of Mathe BGY 11, the plan's "Periodische Vorgänge I:
// Sinusfunktion" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after
// the week's quiz (mathetest11-sinus1.html): degrees and radians, arcs b = α·r, the values of sine at 0, π/2, π, 3π/2,
// the period 2π, sin x = c in 0 ≤ x < 2π - one, two or no solutions, the second by the symmetry about π/2 - and a nut
// with sine squared. The range stands behind the task: "(0\le x<2\pi)".
// Every step checked with sympy (the same solutions in the range, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['s1-neunzig',      '\\frac{90}{180}\\cdot\\pi',                                  ''],
        ['s1-sechzig',      'x=\\frac{60}{180}\\cdot\\pi',                                'x'],
        ['s1-grad',         '\\alpha=\\frac{\\pi}{3}\\cdot\\frac{180}{\\pi}',             '\\alpha'],
        ['s1-dreiviertel',  '\\alpha=\\frac{3\\pi}{2}\\cdot\\frac{180}{\\pi}',            '\\alpha'],
        ['s1-werte',        '\\sin\\frac{\\pi}{2}+\\sin\\pi',                             ''],
        ['s1-werte-minus',  '2\\sin\\frac{3\\pi}{2}+\\sin 0',                             ''],
        ['s1-bogen',        'b=\\frac{\\pi}{3}\\cdot 3',                                  'b'],
        ['s1-bogen-lang',   'b=\\frac{2\\pi}{3}\\cdot 6',                                 'b'],
        ['s1-periode',      '\\sin(x+2\\pi)-\\sin x',                                     ''],
        ['s1-null',         '\\sin x=0\\quad(0\\le x<2\\pi)',                             'x'],
        ['s1-eins',         '\\sin x=1\\quad(0\\le x<2\\pi)',                             'x'],
        ['s1-minus-eins',   '2\\sin x=-2\\quad(0\\le x<2\\pi)',                           'x'],
        ['s1-keine',        '\\sin x=2',                                                  'x'],
        ['s1-riesenrad',    'h=20+18\\sin\\frac{\\pi}{2}',                                'h'],
        ['s1-halb',         '\\sin x=\\frac{1}{2}\\quad(0\\le x<2\\pi)',                  'x'],
        ['s1-umstellen',    '2\\sin x-1=0\\quad(0\\le x<2\\pi)',                          'x'],
        ['s1-wurzel',       '\\sin x=\\frac{\\sqrt{2}}{2}\\quad(0\\le x<2\\pi)',          'x'],
        ['s1-minus-halb',   '\\sin x=-\\frac{1}{2}\\quad(0\\le x<2\\pi)',                 'x'],
        ['s1-pythagoras',   '\\sin^2 x+\\cos^2 x',                                        ''],
        ['s1-nuss',         '2\\sin^2(x)=\\sin(x)\\quad(0\\le x<2\\pi)',                  'x'],
    );
    BLOECKE.push({ titel: 'Periodische Vorgänge · Sinus am Einheitskreis', ab, bis: AUFGABEN.length, kw: 49 });
    Object.assign(LOESUNGEN, {
        's1-neunzig':      [['=\\frac{1}{2}\\cdot\\pi', '\\text{kürzen}'], ['=\\frac{\\pi}{2}', '\\text{zusammenfassen}']],
        's1-sechzig':      [['x=\\frac{1}{3}\\cdot\\pi', '\\text{kürzen}'], ['x=\\frac{\\pi}{3}', '\\text{zusammenfassen}']],
        's1-grad':         [['\\alpha=\\frac{180}{3}', '\\pi\\ \\text{kürzen}'], ['\\alpha=60', '\\text{ausrechnen}']],
        's1-dreiviertel':  [['\\alpha=\\frac{3\\cdot 180}{2}', '\\pi\\ \\text{kürzen}'], ['\\alpha=270', '\\text{ausrechnen}']],
        's1-werte':        [['=1+0', '\\text{Einheitskreis}'], ['=1', '\\text{ausrechnen}']],
        's1-werte-minus':  [['=2\\cdot(-1)+0', '\\text{Einheitskreis}'], ['=-2', '\\text{ausrechnen}']],
        's1-bogen':        [['b=\\pi', '\\text{kürzen}']],
        's1-bogen-lang':   [['b=4\\pi', '\\text{ausrechnen}'], ['b\\approx 12{,}57', '\\text{runden}']],
        's1-periode':      [['=\\sin x-\\sin x', '\\text{Periode}\\ 2\\pi'], ['=0', '\\text{zusammenfassen}']],
        's1-null':         [['x_1=0\\quad x_2=\\pi', '\\text{Einheitskreis}']],
        's1-eins':         [['x=\\frac{\\pi}{2}', '\\text{Einheitskreis}']],
        's1-minus-eins':   [['\\sin x=-1', ':2'], ['x=\\frac{3\\pi}{2}', '\\text{Einheitskreis}']],
        's1-keine':        [['L=\\{\\}', '-1\\le\\sin x\\le 1']],
        's1-riesenrad':    [['h=20+18\\cdot 1', '\\text{Einheitskreis}'], ['h=38', '\\text{ausrechnen}']],
        's1-halb':         [['x_1=\\frac{\\pi}{6}\\quad x_2=\\pi-\\frac{\\pi}{6}', '\\text{Einheitskreis, Symmetrie}'],
                            ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{ausrechnen}']],
        's1-umstellen':    [['2\\sin x=1', '+1'], ['\\sin x=\\frac{1}{2}', ':2'], ['x_1=\\frac{\\pi}{6}\\quad x_2=\\frac{5\\pi}{6}', '\\text{Einheitskreis, Symmetrie}']],
        's1-wurzel':       [['x_1=\\frac{\\pi}{4}\\quad x_2=\\pi-\\frac{\\pi}{4}', '\\text{Einheitskreis, Symmetrie}'],
                            ['x_1=\\frac{\\pi}{4}\\quad x_2=\\frac{3\\pi}{4}', '\\text{ausrechnen}']],
        's1-minus-halb':   [['x_1=\\pi+\\frac{\\pi}{6}\\quad x_2=2\\pi-\\frac{\\pi}{6}', '\\text{Einheitskreis, Symmetrie}'],
                            ['x_1=\\frac{7\\pi}{6}\\quad x_2=\\frac{11\\pi}{6}', '\\text{ausrechnen}']],
        's1-pythagoras':   [['=1', '\\text{Pythagoras am Einheitskreis}']],
        's1-nuss':         [['2\\sin^2(x)-\\sin(x)=0', '-\\sin(x)'], ['\\sin(x)\\cdot(2\\sin(x)-1)=0', '\\text{ausklammern}'],
                            ['\\sin x=0\\;\\vee\\;\\sin x=\\frac{1}{2}', '\\text{Nullprodukt}'],
                            ['x_1=0\\quad x_2=\\pi\\quad x_3=\\frac{\\pi}{6}\\quad x_4=\\frac{5\\pi}{6}', '\\text{Einheitskreis}']],
    });
    Object.assign(ERKLAERUNGEN, {
        's1-halb':
            'Am Einheitskreis ist $\\sin x$ die Höhe des Punkts. Die Höhe $\\frac{1}{2}$ hat er zweimal: bei $\\frac{\\pi}{6}$ ($30°$) ' +
            'und gespiegelt an der $y$-Achse bei $\\pi-\\frac{\\pi}{6}=\\frac{5\\pi}{6}$ ($150°$).' +
            '\n\nDer Taschenrechner gibt nur die erste: $\\sin^{-1}(0{,}5)=30°$. Die zweite muss man selbst finden.',
        's1-keine':
            'Der Punkt auf dem Einheitskreis ist höchstens $1$ hoch und mindestens $-1$ tief: $-1\\le\\sin x\\le 1$.' +
            '\n\n$\\sin x=2$ geht also nie – die Gleichung hat keine Lösung.',
        's1-nuss':
            'Nicht durch $\\sin(x)$ teilen! Dabei gingen die Lösungen mit $\\sin x=0$ verloren, $0$ und $\\pi$.' +
            '\n\nAusklammern und das Nullprodukt geben alle vier: $0$, $\\frac{\\pi}{6}$, $\\frac{5\\pi}{6}$ und $\\pi$.',
    });
    aufgabenTexte({
        's1-neunzig':    'Wie lautet $90°$ im Bogenmaß?',
        's1-sechzig':    'Wie lautet $60°$ im Bogenmaß?',
        's1-grad':       'Wie viel Grad sind $\\frac{\\pi}{3}$?',
        's1-dreiviertel': 'Wie viel Grad sind $\\frac{3\\pi}{2}$?',
        's1-bogen':      'Wie lang ist der Kreisbogen zum Winkel $\\frac{\\pi}{3}$ auf einem Kreis mit $r=3$? ($b=\\alpha\\cdot r$)',
        's1-bogen-lang': 'Wie lang ist der Kreisbogen zum Winkel $\\frac{2\\pi}{3}$ auf einem Kreis mit $r=6$?',
        's1-periode':    'Was ändert sich am Sinus nach einer vollen Umdrehung?',
        's1-riesenrad':  'Ein Riesenrad: Achse in $20$ m Höhe, Radius $18$ m. Wie hoch ist die Gondel ganz oben?',
        's1-pythagoras': 'Was ergeben $\\sin^2 x$ und $\\cos^2 x$ zusammen?',
    });
})();
