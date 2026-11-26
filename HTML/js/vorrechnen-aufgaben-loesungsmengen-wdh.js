// Block "Lösungsmengen · Wiederholung" - week 48 of Mathe BGY 11, before the quadratic models of that week (Doc,
// 16.11.2026: "nochmal ... Wiederholung zum Thema Lösungsmengen machen, wie man das schreibt und wie man rausfindet, was
// das so ist"; 23.11.2026: "Vorrechnen-Aufgaben zu Lösungsmengen."). Fifteen tasks, easy to hard, every solution ending
// with its solution set as in the deck decks/mathe11-loesungsmengen.html: one solution L={4}, none L={} (the false
// statement 3=-1), all L=\mathbb{R} (the true statement 0=0), two systems and a pair L={(3|2)} with their none and
// infinitely many, then quadratic: x^2=9, x^2 = a negative number, factoring out (not dividing by x), the pq formula
// with two, one and no solution, the domain of a fraction D=\mathbb{R}\setminus\{...\} with one candidate outside it,
// and the root equation where only the Probe throws out the second candidate. Several elements stand by ";" in the
// order of size, L=\{-2;6\} - the comma is the decimal sign.
// Every step checked with sympy (tools/vorrechnen/pruefe.sh 48: the same solutions as the task, the domain the task's,
// the solution set exactly the task's), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['lsm-linear',      '3x+5=17',                                    'x'],
        ['lsm-keine',       '2x+3=2x-1',                                  'x'],
        ['lsm-alle',        '3(x-2)+6=3x',                                'x'],
        ['lsm-lgs-eine',    '{\\begin{cases}x+y=5\\\\x-y=1\\end{cases}}', ''],
        ['lsm-lgs-keine',   '{\\begin{cases}x+2y=4\\\\x+2y=1\\end{cases}}', ''],
        ['lsm-lgs-viele',   '{\\begin{cases}x-y=2\\\\3x-3y=6\\end{cases}}', ''],
        ['lsm-quadrat',     'x^2=9',                                      'x'],
        ['lsm-negativ',     'x^2+5=1',                                    'x'],
        ['lsm-ausklammern', 'x^2=5x',                                     'x'],
        ['lsm-pq',          'x^2-4x-12=0',                                'x'],
        ['lsm-doppelt',     'x^2-6x+9=0',                                 'x'],
        ['lsm-pq-keine',    'x^2+4x+8=0',                                 'x'],
        ['lsm-bruch',       '\\frac{15}{x}=x+2',                          'x'],
        ['lsm-ausschluss',  '\\frac{x^2+2x}{x+4}=\\frac{8}{x+4}',         'x'],
        ['lsm-probe',       '\\sqrt{2x+3}=x',                             'x'],
    );
    wochenBlock('loesungsmengen-wdh', ab, { kopf: 'LGS lösen' });
    Object.assign(LOESUNGEN, {
        'lsm-linear':      [['3x=12', '-5'], ['x=4', ':3'], ['L=\\{4\\}', '']],
        'lsm-keine':       [['3=-1', '-2x'], ['L=\\{\\}', '\\text{falsche Aussage}']],
        'lsm-alle':        [['3x-6+6=3x', '\\text{ausmultiplizieren}'], ['3x=3x', '\\text{zusammenfassen}'], ['0=0', '-3x'],
                            ['L=\\mathbb{R}', '\\text{wahre Aussage}']],
        'lsm-lgs-eine':    [['2x=6', '\\text{I}+\\text{II}'], ['x=3', ':2'], ['3+y=5', '\\text{in I einsetzen}'], ['y=2', '-3'],
                            ['L=\\{(3\\mid 2)\\}', '']],
        'lsm-lgs-keine':   [['0=3', '\\text{I}-\\text{II}'], ['L=\\{\\}', '\\text{falsche Aussage}']],
        'lsm-lgs-viele':   [['0=0', '\\text{II}-3\\cdot\\text{I}'], ['x=2+t\\quad y=t', '\\text{wahre Aussage},\\ y=t'],
                            ['L=\\{(2+t\\mid t)\\},\\ t\\in\\mathbb{R}', '']],
        'lsm-quadrat':     [['x_1=3\\quad x_2=-3', '\\sqrt{\\;}'], ['L=\\{-3;3\\}', '']],
        'lsm-negativ':     [['x^2=-4', '-5'], ['L=\\{\\}', 'x^2\\ge 0']],
        'lsm-ausklammern': [['x^2-5x=0', '-5x'], ['x(x-5)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=5', '\\text{Nullprodukt}'],
                            ['L=\\{0;5\\}', '']],
        'lsm-pq':          [['x_{1,2}=2\\pm\\sqrt{4+12}', '\\text{pq-Formel}'], ['x_{1,2}=2\\pm 4', '\\text{Wurzel ziehen}'],
                            ['x_1=6\\quad x_2=-2', '\\text{ausrechnen}'], ['L=\\{-2;6\\}', '\\text{der Größe nach}']],
        'lsm-doppelt':     [['x_{1,2}=3\\pm\\sqrt{9-9}', '\\text{pq-Formel}'], ['x_{1,2}=3\\pm 0', '\\text{Wurzel ziehen}'],
                            ['x=3', '\\text{ausrechnen}'], ['L=\\{3\\}', '']],
        'lsm-pq-keine':    [['x_{1,2}=-2\\pm\\sqrt{4-8}', '\\text{pq-Formel}'], ['x_{1,2}=-2\\pm\\sqrt{-4}', '\\text{ausrechnen}'],
                            ['L=\\{\\}', '\\text{Wurzel aus negativer Zahl}']],
        'lsm-bruch':       [['D=\\mathbb{R}\\setminus\\{0\\}', '\\text{Nenner}\\ne 0'], ['15=x^2+2x', '\\cdot x'],
                            ['x^2+2x-15=0', '-15'], ['x_{1,2}=-1\\pm\\sqrt{1+15}', '\\text{pq-Formel}'],
                            ['x_{1,2}=-1\\pm 4', '\\text{Wurzel ziehen}'], ['x_1=3\\quad x_2=-5', '\\text{ausrechnen}'],
                            ['L=\\{-5;3\\}', '3\\in D,\\ -5\\in D']],
        'lsm-ausschluss':  [['D=\\mathbb{R}\\setminus\\{-4\\}', '\\text{Nenner}\\ne 0'], ['x^2+2x=8', '\\cdot(x+4)'],
                            ['x^2+2x-8=0', '-8'], ['x_{1,2}=-1\\pm\\sqrt{1+8}', '\\text{pq-Formel}'],
                            ['x_{1,2}=-1\\pm 3', '\\text{Wurzel ziehen}'], ['x_1=2\\quad x_2=-4', '\\text{ausrechnen}'],
                            ['L=\\{2\\}', '-4\\notin D']],
        'lsm-probe':       [['2x+3=x^2', '\\text{quadrieren}'], ['x^2-2x-3=0', '\\text{umstellen}'],
                            ['x_{1,2}=1\\pm\\sqrt{1+3}', '\\text{pq-Formel}'], ['x_{1,2}=1\\pm 2', '\\text{Wurzel ziehen}'],
                            ['x_1=3\\quad x_2=-1', '\\text{ausrechnen}'], ['L=\\{3\\}', '\\text{Probe: }\\sqrt{1}=1\\ne -1']],
    });
    Object.assign(ERKLAERUNGEN, {
        'lsm-linear':
            'Die Lösungsmenge $L$ sammelt alle Zahlen, die die Gleichung wahr machen. Hier ist es genau eine: $L=\\{4\\}$.' +
            '\n\nProbe: $3\\cdot 4+5=17$.',
        'lsm-keine':
            'Links und rechts steht $2x$ – es fällt weg, übrig bleibt $3=-1$. Das stimmt für kein $x$: eine falsche Aussage.' +
            '\n\nDie Lösungsmenge ist leer: $L=\\{\\}$. Man schreibt auch $L=\\emptyset$ – beides heißt leere Menge. ' +
            'Vorsicht: $\\{0\\}$ ist nicht leer, darin liegt die Zahl $0$.',
        'lsm-alle':
            'Übrig bleibt $0=0$ – das stimmt immer, egal welches $x$ man einsetzt: eine wahre Aussage.' +
            '\n\nJede reelle Zahl ist Lösung: $L=\\mathbb{R}$. Probe mit $x=10$: $3\\cdot 8+6=30=3\\cdot 10$.',
        'lsm-lgs-eine':
            'Die Lösung eines Systems ist ein Paar, also steht ein Paar in der Menge: $L=\\{(3\\mid 2)\\}$ – erst $x$, dann $y$.' +
            '\n\nProbe in beiden Gleichungen: $3+2=5$ und $3-2=1$.',
        'lsm-lgs-keine':
            'Dieselbe linke Seite, verschiedene rechte: $x+2y$ kann nicht zugleich $4$ und $1$ sein. Abziehen gibt $0=3$ – falsch.' +
            '\n\nGeometrisch: zwei parallele Geraden, sie schneiden sich nie. $L=\\{\\}$.',
        'lsm-lgs-viele':
            'Die zweite Gleichung ist das Dreifache der ersten und sagt nichts Neues: es bleibt $0=0$.' +
            '\n\n$y=t$ ist frei wählbar, dann ist $x=2+t$. Jedes Paar $(2+t\\mid t)$ ist eine Lösung, etwa $(2\\mid 0)$ mit ' +
            '$t=0$ oder $(3\\mid 1)$ mit $t=1$ – unendlich viele, eine ganze Gerade.',
        'lsm-negativ':
            'Ein Quadrat ist nie negativ: $x^2\\ge 0$ für jedes $x$. Also gibt es kein $x$ mit $x^2=-4$, $L=\\{\\}$.',
        'lsm-ausklammern':
            'Nicht durch $x$ teilen! Aus $x^2=5x$ würde $x=5$ – und die Lösung $x=0$ ginge verloren, denn durch $0$ darf man ' +
            'nicht teilen.' +
            '\n\nDarum alles auf eine Seite und ausklammern: ein Produkt ist $0$, wenn ein Faktor $0$ ist. $L=\\{0;5\\}$.',
        'lsm-pq':
            'In der Menge stehen die Zahlen der Größe nach, getrennt durch ein Semikolon: $L=\\{-2;6\\}$.' +
            '\n\nKein Komma: das ist schon das Dezimalzeichen – $\\{2{,}5\\}$ ist eine Zahl, $\\{2;5\\}$ sind zwei.',
        'lsm-doppelt':
            'Unter der Wurzel steht $0$: $\\left(\\frac{p}{2}\\right)^2-q=9-9=0$. Beide Lösungen fallen zusammen.' +
            '\n\nIn der Menge steht die Zahl trotzdem nur einmal: $L=\\{3\\}$, nicht $\\{3;3\\}$. Am Graphen: die Parabel ' +
            '$y=(x-3)^2$ berührt die $x$-Achse in ihrem Scheitel $(3\\mid 0)$.',
        'lsm-pq-keine':
            'Unter der Wurzel steht $\\left(\\frac{p}{2}\\right)^2-q=4-8=-4$. Aus einer negativen Zahl gibt es keine (reelle) Wurzel.' +
            '\n\nAm Graphen: $y=x^2+4x+8=(x+2)^2+4$ hat den Scheitel $(-2\\mid 4)$ – die Parabel schneidet die $x$-Achse nie.',
        'lsm-bruch':
            'Zuerst die Definitionsmenge: durch $0$ darf man nicht teilen, also $x\\ne 0$ und $D=\\mathbb{R}\\setminus\\{0\\}$ – ' +
            'alle reellen Zahlen ohne die $0$. Erst dann ist mal $x$ erlaubt.' +
            '\n\nBeide Kandidaten liegen in $D$. Probe: $\\frac{15}{3}=5=3+2$ und $\\frac{15}{-5}=-3=-5+2$.',
        'lsm-ausschluss':
            'Der Nenner $x+4$ darf nicht $0$ sein: $x\\ne -4$, also $D=\\mathbb{R}\\setminus\\{-4\\}$.' +
            '\n\nDie Rechnung liefert $2$ und $-4$. Aber $-4$ liegt nicht in $D$ – eingesetzt stünde unten $-4+4=0$. Es fällt ' +
            'weg: $L=\\{2\\}$. Probe mit $2$: $\\frac{4+4}{6}=\\frac{8}{6}$.',
        'lsm-probe':
            'Quadrieren ist keine Äquivalenzumformung: aus $a=b$ folgt $a^2=b^2$, aber nicht umgekehrt – es können Lösungen ' +
            'dazukommen. Darum ist hier die Probe Pflicht.' +
            '\n\n$x=3$: $\\sqrt{2\\cdot 3+3}=\\sqrt{9}=3$, stimmt. $x=-1$: $\\sqrt{2\\cdot(-1)+3}=\\sqrt{1}=1\\ne -1$, fällt weg. ' +
            'Also $L=\\{3\\}$.',
    });
    aufgabenTexte({
        'lsm-bruch':      'Bestimme zuerst die Definitionsmenge $D$, dann die Lösungsmenge $L$.',
        'lsm-ausschluss': 'Bestimme zuerst die Definitionsmenge $D$, dann die Lösungsmenge $L$.',
        'lsm-probe':      'Löse die Gleichung und mache die Probe.',
    });
})();
