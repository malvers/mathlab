// Block "Monte-Carlo-Methode · Flächen aus dem Zufall" - week 22 of 2027, Mathe BGY 11, the plan's "Wahlbereich II:
// Monte-Carlo-Methode" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after
// the week's quiz (mathetest11-montecarlo.html): the quarter circle in the unit square (π/4), a point inside or
// outside by x² + y², π from 7830 of 10 000 throws, the figure with 35 % of the points in 20 cm², the lake on the map,
// the error 1/√n and how many throws for three places, the mean of several runs - and the nut: how many hits of 2000
// give 3.14. Each task carries its setting in a sentence (aufgabenTexte).
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['mc-innen',        '0{,}6^2+0{,}7^2',                            ''],
        ['mc-aussen',       '0{,}8^2+0{,}7^2',                            ''],
        ['mc-punkt',        '4\\cdot 0{,}37',                             ''],
        ['mc-figur',        '0{,}35\\cdot 20',                            ''],
        ['mc-hundert',      '4\\cdot\\frac{78}{100}',                     ''],
        ['mc-pi',           '4\\cdot\\frac{7830}{10000}',                 ''],
        ['mc-parabel',      '\\frac{3328}{10000}',                        ''],
        ['mc-risiko',       '\\frac{3}{200}',                             ''],
        ['mc-dreieck',      '0{,}5\\cdot 6\\cdot 4',                      ''],
        ['mc-verhaeltnis',  '\\frac{\\frac{\\pi}{4}}{1}',                 ''],
        ['mc-kreis',        '\\frac{\\pi\\cdot 2^2}{4^2}',                ''],
        ['mc-erwartet',     '5000\\cdot\\frac{\\pi}{4}',                  ''],
        ['mc-see',          '\\frac{420}{1000}\\cdot 600\\cdot 400',      ''],
        ['mc-mittel',       '\\frac{3{,}10+3{,}18+3{,}14+3{,}12}{4}',     ''],
        ['mc-abweichung',   '3{,}132-\\pi',                               ''],
        ['mc-fehler',       '\\frac{1}{\\sqrt{10000}}',                   ''],
        ['mc-rand',         '0{,}6^2+y^2=1\\quad(y>0)',                   'y'],
        ['mc-relativ',      '\\frac{3{,}1416-3{,}132}{3{,}1416}\\cdot 100', ''],
        ['mc-wuerfe',       '\\frac{1}{\\sqrt{n}}=0{,}001\\quad(n>0)',    'n'],
        ['mc-nuss',         '4\\cdot\\frac{k}{2000}=3{,}14',              'k'],
    );
    BLOECKE.push({ titel: 'Monte-Carlo-Methode · Flächen aus dem Zufall', ab, bis: AUFGABEN.length, kw: 22, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'mc-innen':         [['=0{,}36+0{,}49', '\\text{quadrieren}'], ['=0{,}85', '\\text{addieren}']],
        'mc-aussen':        [['=0{,}64+0{,}49', '\\text{quadrieren}'], ['=1{,}13', '\\text{addieren}']],
        'mc-punkt':         [['=1{,}48', '\\text{ausrechnen}']],
        'mc-figur':         [['=7', '\\text{ausrechnen}']],
        'mc-hundert':       [['=4\\cdot 0{,}78', '\\text{ausrechnen}'], ['=3{,}12', '\\text{ausrechnen}']],
        'mc-pi':            [['=4\\cdot 0{,}783', '\\text{ausrechnen}'], ['=3{,}132', '\\text{ausrechnen}']],
        'mc-parabel':       [['=0{,}3328', '\\text{ausrechnen}']],
        'mc-risiko':        [['=0{,}015', '\\text{ausrechnen}']],
        'mc-dreieck':       [['=12', '\\text{ausrechnen}']],
        'mc-verhaeltnis':   [['=\\frac{\\pi}{4}', '\\text{durch 1 teilen}'], ['\\approx 0{,}785', '\\text{Taschenrechner}']],
        'mc-kreis':         [['=\\frac{4\\pi}{16}', '\\text{ausrechnen}'], ['=\\frac{\\pi}{4}', '\\text{kürzen}']],
        'mc-erwartet':      [['=1250\\pi', '\\text{kürzen}'], ['\\approx 3927', '\\text{Taschenrechner}']],
        'mc-see':           [['=0{,}42\\cdot 240000', '\\text{ausrechnen}'], ['=100800', '\\text{ausrechnen}']],
        'mc-mittel':        [['=\\frac{12{,}54}{4}', '\\text{addieren}'], ['=3{,}135', '\\text{ausrechnen}']],
        'mc-abweichung':    [['\\approx 3{,}132-3{,}1416', '\\pi\\approx 3{,}1416'], ['\\approx -0{,}0096', '\\text{ausrechnen}']],
        'mc-fehler':        [['=\\frac{1}{100}', '\\text{Wurzel ziehen}'], ['=0{,}01', '\\text{als Dezimalzahl}']],
        'mc-rand':          [['y^2=0{,}64', '-0{,}36'], ['y=0{,}8', '\\sqrt{\\;}']],
        'mc-relativ':       [['\\approx\\frac{0{,}0096}{3{,}1416}\\cdot 100', '\\text{ausrechnen}'], ['\\approx 0{,}306', '\\text{Taschenrechner}']],
        'mc-wuerfe':        [['1=0{,}001\\sqrt{n}', '\\cdot\\sqrt{n}'], ['\\sqrt{n}=1000', ':0{,}001'], ['n=1000000', '\\text{quadrieren}']],
        'mc-nuss':          [['\\frac{k}{2000}=0{,}785', ':4'], ['k=1570', '\\cdot 2000']],
    });
    Object.assign(ERKLAERUNGEN, {
        'mc-pi':
            'Der Viertelkreis mit $r=1$ hat die Fläche $\\frac{\\pi}{4}$, das Einheitsquadrat die Fläche $1$. Der Anteil der Treffer schätzt also $\\frac{\\pi}{4}$.' +
            '\n\nMal $4$ gibt die Schätzung für $\\pi$: aus $7830$ von $10\\,000$ Würfen $3{,}132$ – auf zwei Stellen richtig, bei jedem Lauf etwas anders.',
        'mc-wuerfe':
            'Der Fehler fällt nur wie $\\frac{1}{\\sqrt{n}}$: für eine Stelle mehr braucht es hundertmal so viele Würfe.' +
            '\n\nFür drei sichere Nachkommastellen von $\\pi$ also etwa eine Million Würfe. Monte Carlo ist einfach, aber langsam.',
        'mc-see':
            'Die Karte zeigt ein Rechteck von $600$ m mal $400$ m. $420$ von $1000$ Zufallspunkten fallen in den See.' +
            '\n\nAlso bedeckt der See etwa $42\\,\\%$ des Rechtecks: rund $100\\,800\\ \\mathrm{m^2}$, gut $10$ Hektar. So misst man Flächen, für die es keine Formel gibt.',
    });
    aufgabenTexte({
        'mc-innen':         'Liegt der Punkt $(0{,}6\\mid 0{,}7)$ im Viertelkreis mit $r=1$? Berechne $x^2+y^2$ – kleiner als $1$ heißt drin.',
        'mc-aussen':        'Liegt der Punkt $(0{,}8\\mid 0{,}7)$ im Viertelkreis mit $r=1$? Berechne $x^2+y^2$.',
        'mc-punkt':         'Aus der Zufallszahl $0{,}37$ soll eine Koordinate zwischen $0$ und $4$ werden.',
        'mc-figur':         'Ein Rechteck ist $20\\ \\mathrm{cm^2}$ groß, $35\\,\\%$ der Zufallspunkte liegen in der Figur. Wie groß ist sie etwa?',
        'mc-hundert':       'Von $100$ Würfen liegen $78$ im Viertelkreis. Welche Schätzung für $\\pi$ ergibt das?',
        'mc-pi':            'Von $10\\,000$ Würfen liegen $7830$ im Viertelkreis. Welche Schätzung für $\\pi$ ergibt das?',
        'mc-parabel':       'Von $10\\,000$ Zufallspunkten im Einheitsquadrat liegen $3328$ unter der Parabel $y=x^2$. Wie groß ist die Fläche etwa?',
        'mc-risiko':        'Eine Firma simuliert $200$ Projektverläufe, $3$ enden mit Verlust. Wie groß ist das geschätzte Verlustrisiko?',
        'mc-dreieck':       'Die Hälfte der Zufallspunkte in einem Rechteck von $6$ cm mal $4$ cm liegt im Dreieck. Wie groß ist es?',
        'mc-verhaeltnis':   'Ein Viertelkreis mit $r=1$ liegt im Einheitsquadrat. Wie groß ist das Verhältnis der Flächen?',
        'mc-kreis':         'Ein Kreis mit $r=2$ liegt im Quadrat mit der Seite $4$. Welcher Anteil der Zufallspunkte trifft ihn?',
        'mc-erwartet':      'Wie viele von $5000$ Würfen landen etwa im Viertelkreis?',
        'mc-see':           'Auf einer Karte von $600$ m mal $400$ m fallen $420$ von $1000$ Zufallspunkten in den See. Wie groß ist er?',
        'mc-mittel':        'Vier Läufe schätzen $\\pi$ mit $3{,}10$, $3{,}18$, $3{,}14$ und $3{,}12$. Wie groß ist der Mittelwert?',
        'mc-abweichung':    'Wie weit liegt die Schätzung $3{,}132$ von $\\pi$ entfernt?',
        'mc-fehler':        'Wie groß ist der Fehler bei $10\\,000$ Würfen nach der Faustregel $\\frac{1}{\\sqrt{n}}$?',
        'mc-rand':          'Ein Punkt auf dem Rand des Viertelkreises hat $x=0{,}6$. Wie groß ist $y$?',
        'mc-relativ':       'Um wie viel Prozent weicht die Schätzung $3{,}132$ von $\\pi\\approx 3{,}1416$ ab?',
        'mc-wuerfe':        'Wie viele Würfe $n$ braucht es für einen Fehler von etwa $0{,}001$?',
        'mc-nuss':          'Wie viele Treffer $k$ unter $2000$ Würfen ergeben die Schätzung $3{,}14$?',
    });
})();
