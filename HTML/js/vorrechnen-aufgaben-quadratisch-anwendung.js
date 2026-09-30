// Block "Quadratische Modelle · Anwendungen" - week 48 of Mathe BGY 11, the plan's "Anwendungen quadratischer Modelle"
// (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben
// orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after the week's
// quiz (mathetest11-quadratisch-anwendung.html): the stone from the tower, the throw h(x) = -0.05x² + x, the bridge
// h(x) = -0.01x² + 4, the enclosure with 40 m of fence, the profit G(x) = -x² + 60x - 500 and where it starts, the wall
// of 6 m, two numbers with sum 20 - maxima by completing the square, landings by the pq formula. What a model gives
// that makes no sense (a negative time or length) is dropped: "(t>0)" behind the task.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['anw-turm',        '45-5t^2=0\\quad(t>0)',                       't'],
        ['anw-kosten',      '0{,}5x^2+20=52\\quad(x>0)',                  'x'],
        ['anw-quadrat',     '(x+2)^2=49\\quad(x>0)',                      'x'],
        ['anw-bogen',       '-0{,}01x^2+4=0',                             'x'],
        ['anw-landet',      '-0{,}05x^2+x=0\\quad(x>0)',                  'x'],
        ['anw-wieder',      '-0{,}1x^2+2x+1{,}5=1{,}5',                   'x'],
        ['anw-hochpunkt',   'a\\cdot 3\\cdot(3-6)=9',                     'a'],
        ['anw-bruecke',     'a\\cdot 20^2+4=0',                           'a'],
        ['anw-produkt',     'x(20-x)',                                    ''],
        ['anw-rechteck',    'b(12-b)',                                    ''],
        ['anw-scheitel',    '-0{,}05x^2+x',                               ''],
        ['anw-gehege',      'x(40-2x)',                                   ''],
        ['anw-gewinn',      '-x^2+60x-500',                               ''],
        ['anw-mauer',       '-0{,}02x^2+0{,}8x',                          ''],
        ['anw-schwelle',    '-x^2+60x-500=0',                             'x'],
        ['anw-hoehe',       '-5t^2+20t=15',                               't'],
        ['anw-wurf',        '-5t^2+10t+15=0\\quad(t>0)',                  't'],
        ['anw-weg',         '5t^2+10t=40\\quad(t>0)',                     't'],
        ['anw-erloes',      'x(80-x)=40x+300',                            'x'],
        ['anw-diagonale',   'x^2+(x+2)^2=100\\quad(x>0)',                 'x'],
    );
    wochenBlock('quadratisch-anwendung', ab);
    Object.assign(LOESUNGEN, {
        'anw-turm':       [['-5t^2=-45', '-45'], ['t^2=9', ':(-5)'], ['t=3', '\\sqrt{\\;},\\ t>0']],
        'anw-kosten':     [['0{,}5x^2=32', '-20'], ['x^2=64', ':0{,}5'], ['x=8', '\\sqrt{\\;},\\ x>0']],
        'anw-quadrat':    [['x+2=7', '\\sqrt{\\;},\\ x>0'], ['x=5', '-2']],
        'anw-bogen':      [['-0{,}01x^2=-4', '-4'], ['x^2=400', ':(-0{,}01)'], ['x_1=20\\quad x_2=-20', '\\sqrt{\\;}']],
        'anw-landet':     [['x(1-0{,}05x)=0', '\\text{ausklammern}'], ['1-0{,}05x=0', '\\text{Nullprodukt},\\ x>0'],
                           ['0{,}05x=1', '+0{,}05x'], ['x=20', ':0{,}05']],
        'anw-wieder':     [['-0{,}1x^2+2x=0', '-1{,}5'], ['x(-0{,}1x+2)=0', '\\text{ausklammern}'],
                           ['x_1=0\\quad x_2=20', '\\text{Nullprodukt}']],
        'anw-hochpunkt':  [['-9a=9', '\\text{ausrechnen}'], ['a=-1', ':(-9)']],
        'anw-bruecke':    [['400a+4=0', '\\text{ausrechnen}'], ['400a=-4', '-4'], ['a=-0{,}01', ':400']],
        'anw-produkt':    [['=-x^2+20x', '\\text{ausmultiplizieren}'], ['=-(x^2-20x+100-100)', '\\text{quadratische Ergänzung}'],
                           ['=-(x-10)^2+100', '\\text{binomische Formel}']],
        'anw-rechteck':   [['=-b^2+12b', '\\text{ausmultiplizieren}'], ['=-(b^2-12b+36-36)', '\\text{quadratische Ergänzung}'],
                           ['=-(b-6)^2+36', '\\text{binomische Formel}']],
        'anw-scheitel':   [['=-0{,}05(x^2-20x)', '\\text{ausklammern}'], ['=-0{,}05(x^2-20x+100-100)', '\\text{quadratische Ergänzung}'],
                           ['=-0{,}05((x-10)^2-100)', '\\text{binomische Formel}'], ['=-0{,}05(x-10)^2+5', '\\text{ausmultiplizieren}']],
        'anw-gehege':     [['=-2x^2+40x', '\\text{ausmultiplizieren}'], ['=-2(x^2-20x)', '\\text{ausklammern}'],
                           ['=-2(x^2-20x+100-100)', '\\text{quadratische Ergänzung}'], ['=-2(x-10)^2+200', '\\text{binomische Formel}']],
        'anw-gewinn':     [['=-(x^2-60x)-500', '\\text{ausklammern}'], ['=-(x^2-60x+900-900)-500', '\\text{quadratische Ergänzung}'],
                           ['=-(x-30)^2+900-500', '\\text{binomische Formel}'], ['=-(x-30)^2+400', '\\text{zusammenfassen}']],
        'anw-mauer':      [['=-0{,}02(x^2-40x)', '\\text{ausklammern}'], ['=-0{,}02(x^2-40x+400-400)', '\\text{quadratische Ergänzung}'],
                           ['=-0{,}02(x-20)^2+8', '\\text{binomische Formel}']],
        'anw-schwelle':   [['x^2-60x+500=0', '\\cdot(-1)'], ['x_{1,2}=30\\pm\\sqrt{900-500}', '\\text{pq-Formel}'],
                           ['x_{1,2}=30\\pm 20', '\\text{Wurzel ziehen}'], ['x_1=50\\quad x_2=10', '\\text{ausrechnen}']],
        'anw-hoehe':      [['-5t^2+20t-15=0', '-15'], ['t^2-4t+3=0', ':(-5)'], ['t_{1,2}=2\\pm\\sqrt{4-3}', '\\text{pq-Formel}'],
                           ['t_{1,2}=2\\pm 1', '\\text{Wurzel ziehen}'], ['t_1=3\\quad t_2=1', '\\text{ausrechnen}']],
        'anw-wurf':       [['t^2-2t-3=0', ':(-5)'], ['t_{1,2}=1\\pm\\sqrt{1+3}', '\\text{pq-Formel}'], ['t_{1,2}=1\\pm 2', '\\text{Wurzel ziehen}'],
                           ['t=3', '\\text{ausrechnen},\\ t>0']],
        'anw-weg':        [['5t^2+10t-40=0', '-40'], ['t^2+2t-8=0', ':5'], ['t_{1,2}=-1\\pm\\sqrt{1+8}', '\\text{pq-Formel}'],
                           ['t_{1,2}=-1\\pm 3', '\\text{Wurzel ziehen}'], ['t=2', '\\text{ausrechnen},\\ t>0']],
        'anw-erloes':     [['80x-x^2=40x+300', '\\text{ausmultiplizieren}'], ['x^2-40x+300=0', '\\text{umstellen}'],
                           ['x_{1,2}=20\\pm\\sqrt{400-300}', '\\text{pq-Formel}'], ['x_{1,2}=20\\pm 10', '\\text{Wurzel ziehen}'],
                           ['x_1=30\\quad x_2=10', '\\text{ausrechnen}']],
        'anw-diagonale':  [['x^2+x^2+4x+4=100', '\\text{binomische Formel}'], ['2x^2+4x-96=0', '\\text{zusammenfassen}'],
                           ['x^2+2x-48=0', ':2'], ['x_{1,2}=-1\\pm\\sqrt{1+48}', '\\text{pq-Formel}'], ['x_{1,2}=-1\\pm 7', '\\text{Wurzel ziehen}'],
                           ['x=6', '\\text{ausrechnen},\\ x>0']],
    });
    Object.assign(ERKLAERUNGEN, {
        'anw-gehege':
            'Am Haus braucht das Gehege nur drei Seiten Zaun: zwei Breiten $x$ und eine Länge. Die Länge ist also $40-2x$, ' +
            'die Fläche $A(x)=x(40-2x)$.' +
            '\n\nDie Scheitelform $-2(x-10)^2+200$ zeigt: bei $x=10$ m ist die Fläche am größten, $200\\ \\mathrm{m^2}$ – ' +
            'die Länge ist dann $20$ m, doppelt so lang wie die Breite.',
        'anw-schwelle':
            'Gewinn heißt $G(x)>0$. Die Parabel ist nach unten geöffnet und hat die Nullstellen $10$ und $50$ – dazwischen liegt sie oben.' +
            '\n\nAlso Gewinn ab $11$ bis $49$ Stück. Das Maximum liegt genau in der Mitte, bei $30$ Stück.',
        'anw-diagonale':
            'Pythagoras im Rechteck: $a^2+b^2=d^2$ mit den Seiten $x$ und $x+2$ und der Diagonale $10$.' +
            '\n\n$x=-8$ ist eine Lösung der Gleichung, aber keine Länge – sie fällt weg. Probe: $6^2+8^2=36+64=100$.',
    });
    aufgabenTexte({
        'anw-turm':      'Ein Stein fällt von einem $45$ m hohen Turm: $h(t)=45-5t^2$. Wann schlägt er auf?',
        'anw-kosten':    'Die Kosten sind $K(x)=0{,}5x^2+20$. Bei welcher Stückzahl betragen sie $52$?',
        'anw-quadrat':   'Ein Quadrat wird an jeder Seite um $2$ m länger und hat dann $49\\ \\mathrm{m^2}$. Wie lang war die Seite?',
        'anw-bogen':     'Ein Brückenbogen hat die Form $h(x)=-0{,}01x^2+4$ (in m). Wo trifft er den Boden?',
        'anw-landet':    'Ein Wurf folgt $h(x)=-0{,}05x^2+x$ (in m). Wo landet der Ball?',
        'anw-wieder':    'Ein Wurf folgt $h(x)=-0{,}1x^2+2x+1{,}5$. Wo ist der Ball wieder auf der Abwurfhöhe $1{,}5$ m?',
        'anw-hochpunkt': 'Eine Parabel geht durch $(0\\mid 0)$ und $(6\\mid 0)$, ihr Hochpunkt liegt bei $y=9$: $y=a\\cdot x\\cdot(x-6)$ mit $x=3$. Wie groß ist $a$?',
        'anw-bruecke':   'Ein Brückenbogen ist $4$ m hoch und am Boden $40$ m breit: $y=ax^2+4$ mit $y=0$ bei $x=20$. Wie groß ist $a$?',
        'anw-produkt':   'Zwei Zahlen haben die Summe $20$. Wann ist ihr Produkt $x(20-x)$ am größten? Bringe es in die Scheitelform.',
        'anw-rechteck':  'Ein Rechteck hat den Umfang $24$ cm, die Breite $b$ und die Länge $12-b$. Bei welcher Breite ist die Fläche am größten?',
        'anw-scheitel':  'Der Wurf $h(x)=-0{,}05x^2+x$: wie hoch fliegt der Ball höchstens? Bringe den Term in die Scheitelform.',
        'anw-gehege':    'Ein rechteckiges Gehege am Haus wird mit $40$ m Zaun auf drei Seiten eingefasst: Breite $x$, Länge $40-2x$. Welche Fläche ist höchstens möglich?',
        'anw-gewinn':    'Der Gewinn eines Betriebs ist $G(x)=-x^2+60x-500$. Bei welcher Stückzahl ist er am größten, und wie groß?',
        'anw-mauer':     'Ein Wurf $h(x)=-0{,}02x^2+0{,}8x$ soll eine $6$ m hohe Mauer überqueren. Wie hoch liegt der Scheitel?',
        'anw-schwelle':  'Der Betrieb mit $G(x)=-x^2+60x-500$: zwischen welchen Stückzahlen macht er Gewinn?',
        'anw-hoehe':     'Ein Ball fliegt gemäß $h(t)=-5t^2+20t$. Wann ist er $15$ m hoch?',
        'anw-wurf':      'Ein Ball wird aus $15$ m Höhe nach oben geworfen: $h(t)=-5t^2+10t+15$. Wann landet er?',
        'anw-weg':       'Ein Fahrzeug fährt mit $10$ m/s und beschleunigt: $s(t)=5t^2+10t$. Wann hat es $40$ m zurückgelegt?',
        'anw-erloes':    'Der Erlös ist $x(80-x)$, die Kosten sind $40x+300$. Bei welchen Stückzahlen sind Erlös und Kosten gleich?',
        'anw-diagonale': 'Ein Rechteck hat die Seiten $x$ und $x+2$ und die Diagonale $10$ cm. Wie lang ist die kürzere Seite?',
    });
})();
