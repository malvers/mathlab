// Block "Ausklang · Knobelaufgaben" - week 26 of 2027, Mathe BGY 11, the plan's "Ausklang" (Doc, 30.09.2026: "Mach Tafeln
// und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben
// ... wir haben 5 x 45 min"). Twenty brain-teasers after the week's quiz (mathetest11-ausklang.html), each with the
// calculation behind the surprise: bat and ball for 1.10 €, the water lilies that double daily, five machines and five
// parts, the squares on a 3×3 board, the train at 30 and 60 km/h, the zeros of 10!, the rope around the equator, the
// digit 9 up to 100, 2^100 against 100^10, the innkeeper's 30 €, diagonals of a twelve-gon, handshakes, paper folded
// 42 times, hens and rabbits, 1 + 2 + ... + 100, four people in a row, 0!, the odd numbers, the chessboard - and three
// consecutive numbers. Each task carries its setting in a sentence (aufgabenTexte).
// Every step checked with sympy (the same solutions, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['ak-seerosen',     '48-1',                                       ''],
        ['ak-quadrate',     '9+4+1',                                      ''],
        ['ak-wirt',         '25+3+2',                                     ''],
        ['ak-neunen',       '10+10',                                      ''],
        ['ak-reihe',        '4\\cdot 3\\cdot 2\\cdot 1',                  ''],
        ['ak-nullen',       '\\frac{10}{5}',                              ''],
        ['ak-fakultaet',    '\\frac{1!}{1}',                              ''],
        ['ak-ungerade',     '1+3+5+7+9',                                  ''],
        ['ak-maschinen',    '\\frac{100}{100}\\cdot 5',                   ''],
        ['ak-ball',         'x+(x+1)=1{,}10',                             'x'],
        ['ak-handschlaege', '\\frac{10\\cdot 9}{2}',                      ''],
        ['ak-diagonalen',   '\\frac{12\\cdot(12-3)}{2}',                  ''],
        ['ak-gauss',        '\\frac{100\\cdot 101}{2}',                   ''],
        ['ak-schach',       '2^8-1',                                      ''],
        ['ak-zug',          '\\frac{120}{2+1}',                           ''],
        ['ak-seil',         '\\frac{1}{2\\pi}',                           ''],
        ['ak-huehner',      '{\\begin{cases}x+y=20\\\\2x+4y=56\\end{cases}}', ''],
        ['ak-vergleich',    '\\frac{2^{100}}{100^{10}}',                  ''],
        ['ak-papier',       '0{,}1\\cdot 2^{42}',                         ''],
        ['ak-nuss',         'x+(x+1)+(x+2)=72',                           'x'],
    );
    wochenBlock('ausklang', ab, { kopf: 'knobeln' });
    Object.assign(LOESUNGEN, {
        'ak-seerosen':      [['=47', '\\text{ein Tag vorher}']],
        'ak-quadrate':      [['=14', '\\text{addieren}']],
        'ak-wirt':          [['=30', '\\text{addieren}']],
        'ak-neunen':        [['=20', '\\text{addieren}']],
        'ak-reihe':         [['=24', '\\text{ausrechnen}']],
        'ak-nullen':        [['=2', '\\text{kürzen}']],
        'ak-fakultaet':     [['=1', '\\text{ausrechnen}']],
        'ak-ungerade':      [['=25', '\\text{addieren}'], ['=5^2', '\\text{als Quadrat schreiben}']],
        'ak-maschinen':     [['=1\\cdot 5', '\\text{kürzen}'], ['=5', '\\text{ausrechnen}']],
        'ak-ball':          [['2x+1=1{,}10', '\\text{zusammenfassen}'], ['2x=0{,}10', '-1'], ['x=0{,}05', ':2']],
        'ak-handschlaege':  [['=\\frac{90}{2}', '\\text{ausrechnen}'], ['=45', '\\text{kürzen}']],
        'ak-diagonalen':    [['=\\frac{12\\cdot 9}{2}', '\\text{ausrechnen}'], ['=54', '\\text{ausrechnen}']],
        'ak-gauss':         [['=\\frac{10100}{2}', '\\text{ausrechnen}'], ['=5050', '\\text{kürzen}']],
        'ak-schach':        [['=256-1', '\\text{Potenz ausrechnen}'], ['=255', '\\text{ausrechnen}']],
        'ak-zug':           [['=\\frac{120}{3}', '\\text{ausrechnen}'], ['=40', '\\text{kürzen}']],
        'ak-seil':          [['\\approx 0{,}159', '\\text{Taschenrechner}']],
        'ak-huehner':       [['\\left(\\begin{array}{cc|c}1&1&20\\\\2&4&56\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&1&20\\\\0&2&16\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['x=12\\quad y=8', '\\text{rückwärts einsetzen}']],
        'ak-vergleich':     [['=\\frac{\\left(2^{10}\\right)^{10}}{100^{10}}', '\\text{Potenzgesetz}'], ['=\\left(\\frac{1024}{100}\\right)^{10}', '\\text{Potenzgesetz}'],
                             ['=10{,}24^{10}', '\\text{ausrechnen}']],
        'ak-papier':        [['\\approx 0{,}1\\cdot 4{,}4\\cdot 10^{12}', '2^{42}\\approx 4{,}4\\cdot 10^{12}'], ['\\approx 4{,}4\\cdot 10^{11}', '\\text{ausrechnen}']],
        'ak-nuss':          [['3x+3=72', '\\text{zusammenfassen}'], ['3x=69', '-3'], ['x=23', ':3']],
    });
    Object.assign(ERKLAERUNGEN, {
        'ak-ball':
            'Die schnelle Antwort „$10$ Cent“ ist falsch: dann kostete der Schläger $1{,}10$ € und beide zusammen $1{,}20$ €.' +
            '\n\nDer Ball kostet $5$ Cent, der Schläger $1{,}05$ € – zusammen $1{,}10$ €, und der Unterschied ist genau $1$ €.',
        'ak-zug':
            'Nicht $45$ km/h: hin dauert es $2$ Stunden, zurück nur $1$ Stunde. Auf der langsamen Strecke ist der Zug länger unterwegs.' +
            '\n\nDurchschnittsgeschwindigkeit heißt gesamter Weg durch gesamte Zeit: $120$ km in $3$ h, also $40$ km/h.',
        'ak-seil':
            'Umfang $U=2\\pi r$. Ein Meter mehr Umfang heißt $2\\pi(r+h)=2\\pi r+1$, also $h=\\frac{1}{2\\pi}$ – knapp $16$ cm.' +
            '\n\nDer Radius der Erde kommt in der Rechnung gar nicht vor: bei einem Fußball wäre es genauso viel.',
        'ak-papier':
            '$42$-mal gefaltet liegen $2^{42}$ Lagen übereinander, etwa $4{,}4$ Billionen. Mal $0{,}1$ mm sind das $4{,}4\\cdot 10^{11}$ mm.' +
            '\n\nDas sind $440\\,000$ km – weiter als bis zum Mond. Exponentielles Wachstum unterschätzt man immer.',
    });
    aufgabenTexte({
        'ak-seerosen':      'Eine Seerosenfläche verdoppelt sich täglich und bedeckt den See nach $48$ Tagen ganz. An welchem Tag war er halb bedeckt?',
        'ak-quadrate':      'Wie viele Quadrate enthält ein $3\\times 3$-Schachbrett? Es gibt $9$ kleine, $4$ mittlere und $1$ großes.',
        'ak-wirt':          'Drei Freunde zahlen $30$ €, der Wirt gibt $5$ € zurück: $25$ € behält der Wirt, $3$ € bekommen die Freunde, $2$ € der Bote. Wo ist der „fehlende“ Euro?',
        'ak-neunen':        'Wie oft kommt die Ziffer $9$ in den Seitenzahlen von $1$ bis $100$ vor? Zehnmal als Einer, zehnmal als Zehner.',
        'ak-reihe':         'Wie viele Möglichkeiten gibt es, vier Personen in eine Reihe zu setzen?',
        'ak-nullen':        'Wie viele Nullen stehen am Ende von $10!$? So viele, wie oft der Faktor $5$ vorkommt.',
        'ak-fakultaet':     'Warum ist $0!=1$? Aus $n!=n\\cdot(n-1)!$ folgt $0!=\\frac{1!}{1}$.',
        'ak-ungerade':      'Die Summe der ersten fünf ungeraden Zahlen.',
        'ak-maschinen':     'Fünf Maschinen brauchen für fünf Teile fünf Minuten – eine Maschine also fünf Minuten für ein Teil. Wie lange brauchen $100$ Maschinen für $100$ Teile?',
        'ak-ball':          'Ein Schläger und ein Ball kosten zusammen $1{,}10$ €. Der Schläger kostet $1$ € mehr als der Ball. Was kostet der Ball ($x$)?',
        'ak-handschlaege':  'Zehn Personen geben sich gegenseitig einmal die Hand. Wie viele Handschläge sind das?',
        'ak-diagonalen':    'Wie viele Diagonalen hat ein Zwölfeck? Von jeder Ecke gehen $12-3$ aus, jede wird doppelt gezählt.',
        'ak-gauss':         'Wie viel ist $1+2+3+\\ldots+100$? Der kleine Gauß rechnete $\\frac{n(n+1)}{2}$.',
        'ak-schach':        'Das Schachbrett mit den Reiskörnern: $1, 2, 4, \\ldots$ Wie viele Körner liegen auf den ersten acht Feldern zusammen?',
        'ak-zug':           'Ein Zug fährt $60$ km mit $30$ km/h hin und mit $60$ km/h zurück. Wie groß ist die Durchschnittsgeschwindigkeit?',
        'ak-seil':          'Ein Seil liegt straff um den Äquator und wird um $1$ m verlängert. Wie hoch (in m) schwebt es dann überall?',
        'ak-huehner':       'Ein Bauer hat $x$ Hühner und $y$ Kaninchen: $20$ Köpfe und $56$ Beine.',
        'ak-vergleich':     'Was ist größer, $2^{100}$ oder $100^{10}$? Berechne den Quotienten.',
        'ak-papier':        'Ein Blatt Papier ($0{,}1$ mm) wird $42$-mal gefaltet. Wie dick ist der Stapel in mm?',
        'ak-nuss':          'Drei aufeinanderfolgende Zahlen haben die Summe $72$. Wie heißt die kleinste?',
    });
})();
