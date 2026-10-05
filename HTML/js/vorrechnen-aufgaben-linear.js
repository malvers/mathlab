// Block "Lineare Funktionen · Anstieg und Achsenabschnitt" - week 41 of Mathe BGY 11, next to the deck
// decks/mathe11-linear.html and its quizzes mathetest11-linear(-2).html (Doc, 05.10.2026: "für Vorrechnen heute Mathe
// elf lineare Funktion ... Mach mir bitte 20 Aufgaben dazu", then "Mach noch fünf dazu ... berechne den Schnittpunkt
// zweier linearer Funktionen, berechne die Nullstellen"). Twenty tasks, easy to hard, in the class's notation
// f(x) = mx + n, numbers other than the deck's and the quizzes': a value, the slope from two points (rising, falling,
// a fraction), a zero, a point test that fails, n from slope and point, the tariff 8 € + 0.09 €/min, the burning candle,
// a line in the form 2x + 3y = 6, two tariffs, where two lines meet, Grundpreis and km price from two taxi bills,
// interpolating, Fahrenheit rearranged - and the nut: where Celsius and Fahrenheit show the same number.
// Then five behind them, 21 to 25, where the board shows nothing but the line or the two lines and the head says what to
// do (KOEPFE) - the setting up is the class's part (Doc, same day: "du schreibst eine lineare Gleichung auf und sagst,
// berechne die Nullstellen. Du schreibst zwei lineare Gleichungen auf und sagst, berechne den Schnittpunkt"). Two lines
// are a system, written "{\begin{cases}..\end{cases}}" as in the Gauss block; the working ends at the point S(x | y).
// And two more, 26 and 27, the same way: y = mx + n and a point, "Achsenabschnitt berechnen" (Doc: "bitte noch zwei
// dazu, wo man den Achsenabschnitt berechnen muss").
// Loaded before the other week 41 block (wurzeln), so the lab opens this one first in that week.
// Every step checked with sympy (tools/vorrechnen/pruefe.sh 41), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['li-wert',          'y=3\\cdot 4-2',                              'y'],
        ['li-anstieg',       'm=\\frac{11-3}{6-2}',                        'm'],
        ['li-fallend',       'm=\\frac{-5-7}{3-(-1)}',                     'm'],
        ['li-gebrochen',     'm=\\frac{2-5}{4-(-2)}',                      'm'],
        ['li-nullstelle',    '3x-12=0',                                    'x'],
        ['li-punktprobe',    '-3\\cdot(-2)+1',                             ''],
        ['li-n',             '1=3\\cdot 2+n',                              'n'],
        ['li-tarif',         'K=8+0{,}09\\cdot 250',                       'K'],
        ['li-tarif-wann',    '8+0{,}09x=26',                               'x'],
        ['li-kerze',         '24-1{,}5t=0',                                't'],
        ['li-nullstelle-bruch', '-\\frac{2}{3}x+4=0',                      'x'],
        ['li-parallel',      '2=\\frac{3}{4}\\cdot(-4)+n',                 'n'],
        ['li-form',          '2x+3y=6',                                    'y'],
        ['li-tarife',        '6+0{,}12x=15+0{,}06x',                       'x'],
        ['li-schnitt',       '2x-1=-x+5',                                  'x'],
        ['li-taxi-m',        'm=\\frac{44-28}{20-12}',                     'm'],
        ['li-taxi-n',        '28=2\\cdot 12+n',                            'n'],
        ['li-interpolieren', 'y=30+\\frac{50-30}{6-2}\\cdot(5-2)',         'y'],
        ['li-fahrenheit',    'F=1{,}8C+32',                                'C'],
        ['li-nuss',          'C=1{,}8C+32',                                'C'],
        ['li-nullstelle-fallend', 'y=-4x+10',                              ''],
        ['li-schnitt-zwei',  '{\\begin{cases}y=3x-4\\\\y=x+2\\end{cases}}',       ''],
        ['li-nullstelle-negativ', 'y=0{,}5x+3',                            ''],
        ['li-schnitt-bruch', '{\\begin{cases}y=\\frac{1}{2}x+1\\\\y=-x+7\\end{cases}}', ''],
        ['li-schnitt-negativ', '{\\begin{cases}y=-2x+3\\\\y=4x+15\\end{cases}}',  ''],
        ['li-achse',         'y=-2x+n\\quad P(4\\mid 1)',                  ''],
        ['li-achse-bruch',   'y=\\frac{3}{4}x+n\\quad P(-8\\mid 1)',        ''],
    );
    wochenBlock('linear', ab);
    Object.assign(KOEPFE, {
        'li-nullstelle-fallend': 'Nullstelle berechnen',
        'li-nullstelle-negativ': 'Nullstelle berechnen',
        'li-schnitt-zwei':       'Schnittpunkt berechnen',
        'li-schnitt-bruch':      'Schnittpunkt berechnen',
        'li-schnitt-negativ':    'Schnittpunkt berechnen',
        'li-achse':              'Achsenabschnitt berechnen',
        'li-achse-bruch':        'Achsenabschnitt berechnen',
    });
    Object.assign(LOESUNGEN, {
        'li-wert':          [['y=12-2', '\\text{ausrechnen}'], ['y=10', '\\text{ausrechnen}']],
        'li-anstieg':       [['m=\\frac{8}{4}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'li-fallend':       [['m=\\frac{-12}{4}', '\\text{ausrechnen}'], ['m=-3', '\\text{kürzen}']],
        'li-gebrochen':     [['m=\\frac{-3}{6}', '\\text{ausrechnen}'], ['m=-\\frac{1}{2}', '\\text{kürzen}']],
        'li-nullstelle':    [['3x=12', '+12'], ['x=4', ':3']],
        'li-punktprobe':    [['=6+1', '\\text{ausrechnen}'], ['=7', '\\text{ausrechnen}']],
        'li-n':             [['1=6+n', '\\text{ausrechnen}'], ['n=-5', '-6']],
        'li-tarif':         [['K=8+22{,}50', '\\text{ausrechnen}'], ['K=30{,}50', '\\text{ausrechnen}']],
        'li-tarif-wann':    [['0{,}09x=18', '-8'], ['x=200', ':0{,}09']],
        'li-kerze':         [['-1{,}5t=-24', '-24'], ['t=16', ':(-1{,}5)']],
        'li-nullstelle-bruch': [['-\\frac{2}{3}x=-4', '-4'], ['x=6', '\\cdot\\left(-\\frac{3}{2}\\right)']],
        'li-parallel':      [['2=-3+n', '\\text{ausrechnen}'], ['n=5', '+3']],
        'li-form':          [['3y=-2x+6', '-2x'], ['y=-\\frac{2}{3}x+2', ':3']],
        'li-tarife':        [['6+0{,}06x=15', '-0{,}06x'], ['0{,}06x=9', '-6'], ['x=150', ':0{,}06']],
        'li-schnitt':       [['3x-1=5', '+x'], ['3x=6', '+1'], ['x=2', ':3']],
        'li-taxi-m':        [['m=\\frac{16}{8}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'li-taxi-n':        [['28=24+n', '\\text{ausrechnen}'], ['n=4', '-24']],
        'li-interpolieren': [['y=30+\\frac{20}{4}\\cdot 3', '\\text{ausrechnen}'], ['y=30+5\\cdot 3', '\\text{kürzen}'], ['y=45', '\\text{ausrechnen}']],
        'li-fahrenheit':    [['F-32=1{,}8C', '-32'], ['C=\\frac{F-32}{1{,}8}', ':1{,}8']],
        'li-nuss':          [['-0{,}8C=32', '-1{,}8C'], ['C=-40', ':(-0{,}8)']],
        'li-nullstelle-fallend': [['-4x+10=0', 'y=0'], ['-4x=-10', '-10'], ['x=\\frac{5}{2}', ':(-4)']],
        'li-schnitt-zwei':  [['3x-4=x+2', '\\text{gleichsetzen}'], ['2x-4=2', '-x'], ['2x=6', '+4'], ['x=3', ':2'],
                             ['y=3+2', '\\text{einsetzen}'], ['y=5', '\\text{ausrechnen}'], ['S(3\\mid 5)', '\\text{Schnittpunkt}']],
        'li-nullstelle-negativ': [['0{,}5x+3=0', 'y=0'], ['0{,}5x=-3', '-3'], ['x=-6', ':0{,}5']],
        'li-schnitt-bruch': [['\\frac{1}{2}x+1=-x+7', '\\text{gleichsetzen}'], ['\\frac{3}{2}x+1=7', '+x'], ['\\frac{3}{2}x=6', '-1'],
                             ['x=4', '\\cdot\\frac{2}{3}'], ['y=-4+7', '\\text{einsetzen}'], ['y=3', '\\text{ausrechnen}'],
                             ['S(4\\mid 3)', '\\text{Schnittpunkt}']],
        'li-schnitt-negativ': [['-2x+3=4x+15', '\\text{gleichsetzen}'], ['3=6x+15', '+2x'], ['-12=6x', '-15'], ['x=-2', ':6'],
                             ['y=-2\\cdot(-2)+3', '\\text{einsetzen}'], ['y=7', '\\text{ausrechnen}'], ['S(-2\\mid 7)', '\\text{Schnittpunkt}']],
        'li-achse':         [['1=-2\\cdot 4+n', 'P\\text{ einsetzen}'], ['1=-8+n', '\\text{ausrechnen}'], ['n=9', '+8']],
        'li-achse-bruch':   [['1=\\frac{3}{4}\\cdot(-8)+n', 'P\\text{ einsetzen}'], ['1=-6+n', '\\text{ausrechnen}'], ['n=7', '+6']],
    });
    Object.assign(ERKLAERUNGEN, {
        'li-gebrochen':
            'Ein Anstieg von $m=-\\frac{1}{2}$ heißt im Steigungsdreieck: zwei Schritte nach rechts, einen nach unten.' +
            '\n\nNegativ heißt fallend. Der Betrag $\\frac{1}{2}$ ist kleiner als $1$, die Gerade fällt also flacher als die Winkelhalbierende.',
        'li-punktprobe':
            'Der Graph hat bei $x=-2$ den Wert $7$, der Punkt aber die $y$-Koordinate $8$. Wegen $7\\ne 8$ liegt $P(-2\\mid 8)$ nicht auf dem Graphen,' +
            ' sondern eine Einheit darüber.' +
            '\n\nDie Punktprobe ist immer dasselbe: $x$ einsetzen, ausrechnen, mit $y$ vergleichen.',
        'li-n':
            'Mit $n=-5$ lautet die Gleichung $y=3x-5$.' +
            '\n\nProbe mit dem Punkt: $3\\cdot 2-5=1$.',
        'li-kerze':
            'Nach $16$ Stunden ist die Kerze abgebrannt. Die Nullstelle ist hier der Zeitpunkt, an dem das Modell endet.' +
            '\n\nFür $t>16$ käme eine negative Höhe heraus. Das Modell gilt also nur für $0\\le t\\le 16$.',
        'li-form':
            'Jetzt kann man ablesen: Anstieg $m=-\\frac{2}{3}$, Achsenabschnitt $n=2$.' +
            '\n\nIn der Form $2x+3y=6$ sieht man keins von beiden. Darum zuerst nach $y$ umstellen.',
        'li-tarife':
            'Bei $150$ Minuten kosten beide Tarife $24$ €.' +
            '\n\nWer weniger telefoniert, nimmt A (kleine Grundgebühr), wer mehr telefoniert, nimmt B (kleiner Minutenpreis).' +
            ' Der Schnittpunkt ist die Entscheidungsgrenze.',
        'li-schnitt':
            '$x=2$ ist erst die halbe Antwort. Der $y$-Wert kommt durch Einsetzen in eine der beiden Gleichungen: $y=2\\cdot 2-1=3$.' +
            '\n\nDie Geraden schneiden sich in $S(2\\mid 3)$. Probe mit der anderen: $-2+5=3$.',
        'li-taxi-n':
            'Grundpreis $4$ €, Kilometerpreis $2$ €: $K(x)=2x+4$.' +
            '\n\nProbe mit der zweiten Rechnung: $2\\cdot 20+4=44$.',
        'li-interpolieren':
            'Linear interpolieren heißt: man unterstellt, dass es zwischen den beiden Messungen gleichmäßig läuft.' +
            '\n\nDer Anstieg ist $5$ Liter pro Minute. Von $x=2$ bis $x=5$ sind es drei Schritte, also $30+15=45$ Liter.',
        'li-fahrenheit':
            'Die Falle: erst teilen, dann $32$ abziehen. $\\frac{F}{1{,}8}-32$ ist falsch, denn die $32$ hängt nicht am $1{,}8$.' +
            '\n\nBeim Umstellen wird rückwärts gerechnet: zuletzt kam $+32$ dazu, also wird das zuerst rückgängig gemacht.' +
            '\n\nBeispiel: $77$ °F sind $\\frac{77-32}{1{,}8}=\\frac{45}{1{,}8}=25$ °C.',
        'li-nullstelle-fallend':
            'Nullstelle heißt: $y=0$. Also wird $0$ eingesetzt und nach $x$ aufgelöst.' +
            '\n\nDie Nullstelle muss nicht ganzzahlig sein: $x=\\frac{5}{2}=2{,}5$. Der Graph schneidet die $x$-Achse im Punkt $N(2{,}5\\mid 0)$.' +
            ' Vorsicht beim Teilen durch $-4$: minus durch minus gibt plus.',
        'li-schnitt-zwei':
            'Im Schnittpunkt haben beide Geraden dasselbe $y$ – darum die rechten Seiten gleichsetzen.' +
            '\n\nGleichsetzen liefert nur $x$. Den $y$-Wert gibt eine der beiden Gleichungen, hier die zweite: $y=3+2=5$.' +
            ' Probe mit der ersten: $3\\cdot 3-4=5$.',
        'li-nullstelle-negativ':
            'Durch $0{,}5$ teilen heißt mal $2$ nehmen: $-3:0{,}5=-6$.' +
            '\n\nDie Gerade steigt und startet bei $n=3$ über der $x$-Achse – also liegt die Nullstelle links vom Ursprung, bei $N(-6\\mid 0)$.',
        'li-schnitt-bruch':
            'Aus $\\frac{1}{2}x$ und $x$ werden zusammen $\\frac{3}{2}x$. Durch $\\frac{3}{2}$ teilen heißt mal $\\frac{2}{3}$ nehmen.' +
            '\n\nDer $y$-Wert aus der zweiten Gleichung: $y=-4+7=3$. Probe mit der ersten: $\\frac{1}{2}\\cdot 4+1=3$.',
        'li-schnitt-negativ':
            'Das $x$ auf die Seite bringen, wo mehr davon steht – dann bleibt der Faktor positiv: $6x$ statt $-6x$.' +
            '\n\nDer $y$-Wert aus der ersten Gleichung: $y=-2\\cdot(-2)+3=4+3=7$. Probe mit der zweiten: $4\\cdot(-2)+15=7$.',
        'li-achse':
            'Der Punkt liegt auf der Geraden, also erfüllen seine Koordinaten die Gleichung: $x=4$ und $y=1$ einsetzen, dann nach $n$ auflösen.' +
            '\n\nDie Gerade heißt $y=-2x+9$ und schneidet die $y$-Achse bei $(0\\mid 9)$. Probe: $-2\\cdot 4+9=1$.',
        'li-achse-bruch':
            'Vorsicht mit dem Vorzeichen: $\\frac{3}{4}\\cdot(-8)=-6$. Das $x$ des Punktes ist negativ, darum in Klammern einsetzen.' +
            '\n\nDie Gerade heißt $y=\\frac{3}{4}x+7$. Probe: $\\frac{3}{4}\\cdot(-8)+7=-6+7=1$.',
        'li-nuss':
            'Bei $-40$ Grad zeigen beide Skalen dieselbe Zahl: $1{,}8\\cdot(-40)+32=-72+32=-40$.' +
            '\n\nGeometrisch ist das der Schnittpunkt der Geraden $F=1{,}8C+32$ mit der Winkelhalbierenden $F=C$.' +
            ' Weil die Anstiege verschieden sind ($1{,}8$ und $1$), gibt es genau einen solchen Punkt.',
    });
    aufgabenTexte({
        'li-wert':          'Gegeben ist $f(x)=3x-2$. Berechne $f(4)$.',
        'li-anstieg':       'Welchen Anstieg hat die Gerade durch $P(2\\mid 3)$ und $Q(6\\mid 11)$?',
        'li-fallend':       'Welchen Anstieg hat die Gerade durch $P(-1\\mid 7)$ und $Q(3\\mid -5)$?',
        'li-gebrochen':     'Welchen Anstieg hat die Gerade durch $P(-2\\mid 5)$ und $Q(4\\mid 2)$?',
        'li-nullstelle':    'Wo liegt die Nullstelle von $f(x)=3x-12$?',
        'li-punktprobe':    'Liegt der Punkt $P(-2\\mid 8)$ auf dem Graphen von $f(x)=-3x+1$? Setze $x=-2$ ein.',
        'li-n':             'Eine Gerade hat den Anstieg $m=3$ und geht durch $P(2\\mid 1)$. Bestimme $n$.',
        'li-tarif':         'Ein Tarif kostet $8$ € Grundgebühr und $0{,}09$ € je Minute. Was zahlt man für $250$ Minuten?',
        'li-tarif-wann':    'Derselbe Tarif ($8$ € Grundgebühr, $0{,}09$ € je Minute): wie viele Minuten bekommt man für $26$ €?',
        'li-kerze':         'Eine Kerze ist $24$ cm hoch und brennt jede Stunde $1{,}5$ cm ab: $h(t)=24-1{,}5t$. Wann ist sie abgebrannt?',
        'li-nullstelle-bruch': 'Wo liegt die Nullstelle von $f(x)=-\\frac{2}{3}x+4$?',
        'li-parallel':      'Die Gerade $g$ ist parallel zu $y=\\frac{3}{4}x-1$ und geht durch $P(-4\\mid 2)$. Bestimme $n$.',
        'li-form':          'Bringe $2x+3y=6$ in die Form $y=mx+n$. Wie groß sind Anstieg und Achsenabschnitt?',
        'li-tarife':        'Tarif A: $6$ € Grundgebühr und $0{,}12$ € je Minute. Tarif B: $15$ € Grundgebühr und $0{,}06$ € je Minute. Ab wann lohnt sich B?',
        'li-schnitt':       'Wo schneiden sich die Geraden $g\\colon y=2x-1$ und $h\\colon y=-x+5$?',
        'li-taxi-m':        'Zwei Taxirechnungen: $12$ km kosten $28$ €, $20$ km kosten $44$ €. Wie hoch ist der Preis je Kilometer?',
        'li-taxi-n':        'Dasselbe Taxi kostet $2$ € je Kilometer, $12$ km kosten $28$ €. Wie hoch ist der Grundpreis?',
        'li-interpolieren': 'Ein Tank enthält nach $2$ Minuten $30$ Liter, nach $6$ Minuten $50$ Liter. Wie viel ist es nach $5$ Minuten, linear interpoliert?',
        'li-fahrenheit':    'Für Fahrenheit gilt $F=1{,}8C+32$. Stelle die Formel nach $C$ um.',
        'li-nullstelle-fallend': 'Berechne die Nullstelle der Geraden $y=-4x+10$.',
        'li-schnitt-zwei':  'Berechne den Schnittpunkt der Geraden $y=3x-4$ und $y=x+2$.',
        'li-nullstelle-negativ': 'Berechne die Nullstelle der Geraden $y=0{,}5x+3$.',
        'li-schnitt-bruch': 'Berechne den Schnittpunkt der Geraden $y=\\frac{1}{2}x+1$ und $y=-x+7$.',
        'li-schnitt-negativ': 'Berechne den Schnittpunkt der Geraden $y=-2x+3$ und $y=4x+15$.',
        'li-achse':         'Die Gerade $y=-2x+n$ geht durch $P(4\\mid 1)$. Berechne den Achsenabschnitt $n$.',
        'li-achse-bruch':   'Die Gerade $y=\\frac{3}{4}x+n$ geht durch $P(-8\\mid 1)$. Berechne den Achsenabschnitt $n$.',
        'li-nuss':          'Bei welcher Temperatur zeigen Celsius und Fahrenheit dieselbe Zahl? Setze $F=C$.',
    });
})();
