// Block "Das unendlich Große · Hilbert, Cantor, Zenon" - week 24 of 2027, Mathe BGY 11, the plan's "Exkurs: Das unendlich
// Große (Hilbert-Hotel, Cantor)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). The week's quiz
// (mathetest11-unendlich.html) asks about the ideas; at the board goes what can be calculated in them: the guests of
// Hilbert's hotel moving from n to n+1 and to 2n, counting the integers, 1/n getting small, the sum 1/2 + 1/4 + 1/8 +
// ... creeping up to 1, 0.999... = 1 by 10x - x, periodic decimals as fractions, Achilles and the tortoise, Euclid's
// number 2·3·5·7 + 1 - and the nut: the sum of the geometric series. Each task carries its setting in a sentence
// (aufgabenTexte). Every step checked with sympy, every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['un-umzug',        '7+1',                                        ''],
        ['un-gerade',       '2n=100',                                     'n'],
        ['un-neue-gaeste',  '2k-1=37',                                    'k'],
        ['un-ganze',        '2\\cdot 5+1',                                ''],
        ['un-kehrwert',     '\\frac{1}{1000}',                            ''],
        ['un-kehrwert-n',   '\\frac{1}{n}=0{,}0001\\quad(n>0)',           'n'],
        ['un-grenzwert',    '\\frac{1000+1}{1000}',                       ''],
        ['un-drei',         '\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}',     ''],
        ['un-vier',         '\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\frac{1}{16}', ''],
        ['un-rest',         '1-\\frac{15}{16}',                           ''],
        ['un-zehn',         '1-\\left(\\frac{1}{2}\\right)^{10}',         ''],
        ['un-euklid-klein', '2\\cdot 3\\cdot 5+1',                        ''],
        ['un-euklid',       '2\\cdot 3\\cdot 5\\cdot 7+1',                ''],
        ['un-neun',         '10x-x=9',                                    'x'],
        ['un-drittel',      '10x-x=3',                                    'x'],
        ['un-periode',      '100x-x=12',                                  'x'],
        ['un-zenon',        '90+9+0{,}9+0{,}09',                          ''],
        ['un-achilles',     '10t=90+t',                                   't'],
        ['un-reihe',        '\\frac{\\frac{1}{2}}{1-\\frac{1}{2}}',       ''],
        ['un-nuss',         '\\frac{0{,}9}{1-0{,}1}',                     ''],
    );
    wochenBlock('unendlich', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'un-umzug':         [['=8', '\\text{ausrechnen}']],
        'un-gerade':        [['n=50', ':2']],
        'un-neue-gaeste':   [['2k=38', '+1'], ['k=19', ':2']],
        'un-ganze':         [['=11', '\\text{ausrechnen}']],
        'un-kehrwert':      [['=0{,}001', '\\text{ausrechnen}']],
        'un-kehrwert-n':    [['1=0{,}0001n', '\\cdot n'], ['n=10000', ':0{,}0001']],
        'un-grenzwert':     [['=\\frac{1001}{1000}', '\\text{ausrechnen}'], ['=1{,}001', '\\text{als Dezimalzahl}']],
        'un-drei':          [['=\\frac{4}{8}+\\frac{2}{8}+\\frac{1}{8}', '\\text{Hauptnenner}'], ['=\\frac{7}{8}', '\\text{addieren}']],
        'un-vier':          [['=\\frac{8}{16}+\\frac{4}{16}+\\frac{2}{16}+\\frac{1}{16}', '\\text{Hauptnenner}'], ['=\\frac{15}{16}', '\\text{addieren}']],
        'un-rest':          [['=\\frac{1}{16}', '\\text{ausrechnen}']],
        'un-zehn':          [['=1-\\frac{1}{1024}', '\\text{Potenz ausrechnen}'], ['=\\frac{1023}{1024}', '\\text{ausrechnen}']],
        'un-euklid-klein':  [['=30+1', '\\text{ausrechnen}'], ['=31', '\\text{ausrechnen}']],
        'un-euklid':        [['=210+1', '\\text{ausrechnen}'], ['=211', '\\text{ausrechnen}']],
        'un-neun':          [['9x=9', '\\text{zusammenfassen}'], ['x=1', ':9']],
        'un-drittel':       [['9x=3', '\\text{zusammenfassen}'], ['x=\\frac{1}{3}', ':9']],
        'un-periode':       [['99x=12', '\\text{zusammenfassen}'], ['x=\\frac{12}{99}', ':99'], ['x=\\frac{4}{33}', '\\text{kürzen}']],
        'un-zenon':         [['=99{,}99', '\\text{addieren}']],
        'un-achilles':      [['9t=90', '-t'], ['t=10', ':9']],
        'un-reihe':         [['=\\frac{\\frac{1}{2}}{\\frac{1}{2}}', '\\text{ausrechnen}'], ['=1', '\\text{kürzen}']],
        'un-nuss':          [['=\\frac{0{,}9}{0{,}9}', '\\text{ausrechnen}'], ['=1', '\\text{kürzen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'un-gerade':
            'Jeder natürlichen Zahl $n$ wird die gerade Zahl $2n$ zugeordnet – und umgekehrt. Keine bleibt übrig.' +
            '\n\nDarum gibt es genauso viele gerade Zahlen wie natürliche Zahlen, obwohl die geraden nur „die Hälfte“ sind. Beim Unendlichen ist ein Teil nicht kleiner als das Ganze.',
        'un-neun':
            'Für $x=0{,}999\\ldots$ ist $10x=9{,}999\\ldots$ – beim Abziehen heben sich alle Neunen hinter dem Komma weg: $10x-x=9$.' +
            '\n\nAlso $x=1$. $0{,}\\overline{9}$ und $1$ sind dieselbe Zahl, zweimal verschieden geschrieben.',
        'un-achilles':
            'Achilles läuft $10$ m/s, die Schildkröte $1$ m/s mit $90$ m Vorsprung. Zenon zählt unendlich viele Etappen: $90$ m, $9$ m, $0{,}9$ m, …' +
            '\n\nIhre Summe ist aber endlich, $100$ m – nach $10$ s ist die Schildkröte eingeholt. Unendlich viele Summanden können eine endliche Summe haben.',
    });
    aufgabenTexte({
        'un-umzug':         'Hilberts Hotel ist voll, ein neuer Gast kommt. Jeder zieht von Zimmer $n$ nach $n+1$. Wohin zieht der Gast aus Zimmer $7$?',
        'un-gerade':        'Unendlich viele neue Gäste: jeder zieht von Zimmer $n$ nach $2n$. Wer zieht in Zimmer $100$?',
        'un-neue-gaeste':   'Die neuen Gäste bekommen die ungeraden Zimmer: der $k$-te das Zimmer $2k-1$. Welcher Gast bekommt Zimmer $37$?',
        'un-ganze':         'Die ganzen Zahlen abzählen: $0, 1, -1, 2, -2, \\ldots$ – die Zahl $-k$ steht an der Stelle $2k+1$. An welcher Stelle steht $-5$?',
        'un-kehrwert':      'Wie groß ist $\\frac{1}{n}$ für $n=1000$?',
        'un-kehrwert-n':    'Ab welchem $n$ ist $\\frac{1}{n}$ nur noch $0{,}0001$?',
        'un-grenzwert':     'Wie groß ist $\\frac{n+1}{n}$ für $n=1000$? Wohin geht der Wert für immer größere $n$?',
        'un-drei':          'Die ersten drei Summanden von $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\ldots$',
        'un-vier':          'Die ersten vier Summanden von $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\ldots$',
        'un-rest':          'Wie viel fehlt nach vier Summanden noch bis $1$?',
        'un-zehn':          'Die ersten zehn Summanden von $\\frac{1}{2}+\\frac{1}{4}+\\ldots$ ergeben $1-\\left(\\frac{1}{2}\\right)^{10}$.',
        'un-euklid-klein':  'Euklids Beweis für unendlich viele Primzahlen: das Produkt der Primzahlen $2$, $3$, $5$ plus $1$.',
        'un-euklid':        'Euklids Zahl aus $2$, $3$, $5$, $7$: keine dieser Primzahlen teilt sie.',
        'un-neun':          'Für $x=0{,}999\\ldots$ gilt $10x=9{,}999\\ldots$ Löse $10x-x=9$.',
        'un-drittel':       'Für $x=0{,}333\\ldots$ gilt $10x=3{,}333\\ldots$ Löse $10x-x=3$.',
        'un-periode':       'Für $x=0{,}1212\\ldots$ gilt $100x=12{,}1212\\ldots$ Löse $100x-x=12$.',
        'un-zenon':         'Achilles holt die Schildkröte ein: die ersten vier Etappen in Metern.',
        'un-achilles':      'Achilles läuft $10$ m/s, die Schildkröte $1$ m/s mit $90$ m Vorsprung. Nach welcher Zeit $t$ sind beide am selben Ort?',
        'un-reihe':         'Die unendliche Summe $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\ldots$ nach der Formel $\\frac{a}{1-q}$ mit $a=\\frac{1}{2}$, $q=\\frac{1}{2}$.',
        'un-nuss':          '$0{,}999\\ldots=0{,}9+0{,}09+0{,}009+\\ldots$ nach der Formel $\\frac{a}{1-q}$ mit $a=0{,}9$, $q=0{,}1$.',
    });
})();
