// Block "Stochastik · Übung" - week 18 of 2027, Mathe BGY 11, the plan's "Übung Stochastik" (Doc, 30.09.2026: "Mach Tafeln
// und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben
// ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after the week's quiz (mathetest11-stochastik-uebung.html): an
// even number with a die, four coins (16 sequences, exactly two heads), the urn with 5 red and 5 blue, the wheel, two
// dice (sum 7, sum 12), independent events, the subscribers under 30, at least one six in four throws, the game with
// 2 € stake, the Skat deck - and the nut: both dice show six, given that at least one does. Each task carries its
// setting in a sentence (aufgabenTexte).
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['su-gerade',       '\\frac{3}{6}',                               ''],
        ['su-folgen',       '2^4',                                        ''],
        ['su-pfade',        '2^3',                                        ''],
        ['su-gegen',        '1-0{,}35',                                   ''],
        ['su-rad',          '\\frac{3}{3+5}',                             ''],
        ['su-herz',         '\\frac{8}{32}',                              ''],
        ['su-haeufigkeit',  '\\frac{154}{200}',                           ''],
        ['su-sieben',       '\\frac{6}{36}',                              ''],
        ['su-zwoelf',       '\\frac{1}{6}\\cdot\\frac{1}{6}',             ''],
        ['su-unabhaengig',  '0{,}4\\cdot 0{,}5',                          ''],
        ['su-abo',          '\\frac{50}{200}',                            ''],
        ['su-zweimal-kopf', '\\frac{6}{16}',                              ''],
        ['su-beide-rot',    '\\frac{5}{10}\\cdot\\frac{4}{9}',            ''],
        ['su-oder',         '0{,}4+0{,}5-0{,}2',                          ''],
        ['su-genau-zwei',   '3\\cdot\\left(\\frac{1}{2}\\right)^3',       ''],
        ['su-erwartung',    '0{,}25\\cdot 6-2',                           ''],
        ['su-fair',         '0{,}25x-2=0',                                'x'],
        ['su-zwei-herz',    '\\frac{8}{32}\\cdot\\frac{7}{31}',           ''],
        ['su-mindestens',   '1-\\left(\\frac{5}{6}\\right)^4',            ''],
        ['su-nuss',         '\\frac{\\frac{1}{36}}{\\frac{11}{36}}',      ''],
    );
    BLOECKE.push({ titel: 'Stochastik · Übung', ab, bis: AUFGABEN.length, kw: 18, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'su-gerade':        [['=\\frac{1}{2}', '\\text{kürzen}']],
        'su-folgen':        [['=16', '\\text{ausrechnen}']],
        'su-pfade':         [['=8', '\\text{ausrechnen}']],
        'su-gegen':         [['=0{,}65', '\\text{Gegenereignis}']],
        'su-rad':           [['=\\frac{3}{8}', '\\text{günstige durch mögliche}']],
        'su-herz':          [['=\\frac{1}{4}', '\\text{kürzen}']],
        'su-haeufigkeit':   [['=0{,}77', '\\text{ausrechnen}']],
        'su-sieben':        [['=\\frac{1}{6}', '\\text{kürzen}']],
        'su-zwoelf':        [['=\\frac{1}{36}', '\\text{Pfadregel}']],
        'su-unabhaengig':   [['=0{,}2', '\\text{ausrechnen}']],
        'su-abo':           [['=\\frac{1}{4}', '\\text{kürzen}'], ['=0{,}25', '\\text{als Dezimalzahl}']],
        'su-zweimal-kopf':  [['=\\frac{3}{8}', '\\text{kürzen}']],
        'su-beide-rot':     [['=\\frac{20}{90}', '\\text{Pfadregel}'], ['=\\frac{2}{9}', '\\text{kürzen}']],
        'su-oder':          [['=0{,}7', '\\text{ausrechnen}']],
        'su-genau-zwei':    [['=3\\cdot\\frac{1}{8}', '\\text{Potenz ausrechnen}'], ['=\\frac{3}{8}', '\\text{ausrechnen}']],
        'su-erwartung':     [['=1{,}5-2', '\\text{ausrechnen}'], ['=-0{,}5', '\\text{ausrechnen}']],
        'su-fair':          [['0{,}25x=2', '+2'], ['x=8', ':0{,}25']],
        'su-zwei-herz':     [['=\\frac{56}{992}', '\\text{Pfadregel}'], ['=\\frac{7}{124}', '\\text{kürzen}'], ['\\approx 0{,}056', '\\text{Taschenrechner}']],
        'su-mindestens':    [['=1-\\frac{625}{1296}', '\\text{Potenz ausrechnen}'], ['=\\frac{671}{1296}', '\\text{ausrechnen}'],
                             ['\\approx 0{,}518', '\\text{Taschenrechner}']],
        'su-nuss':          [['=\\frac{1}{36}\\cdot\\frac{36}{11}', '\\text{mit Kehrwert malnehmen}'], ['=\\frac{1}{11}', '\\text{kürzen}'],
                             ['\\approx 0{,}091', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'su-zweimal-kopf':
            'Vier Würfe haben $2^4=16$ gleich wahrscheinliche Folgen. Genau zweimal Kopf: KKZZ, KZKZ, KZZK, ZKKZ, ZKZK, ZZKK – sechs Stück.',
        'su-oder':
            '„$A$ oder $B$“: beide Wahrscheinlichkeiten addieren – dann ist der Fall „beides“ doppelt gezählt und wird einmal abgezogen.' +
            '\n\n$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. In der Vierfeldertafel: alles außer dem Feld unten rechts.',
        'su-nuss':
            '„Mindestens eine Sechs“ haben $11$ der $36$ Ergebnisse (nicht $12$: der Pasch zählt nur einmal), „zwei Sechsen“ nur eines.' +
            '\n\nBedingte Wahrscheinlichkeit: $P(\\text{beide}\\mid\\text{mindestens eine})=\\frac{1}{11}$ – nicht $\\frac{1}{6}$, wie man zuerst denkt.',
    });
    aufgabenTexte({
        'su-gerade':        'Wie groß ist die Wahrscheinlichkeit, mit einem fairen Würfel eine gerade Zahl zu werfen?',
        'su-folgen':        'Eine Münze wird viermal geworfen. Wie viele Ergebnisfolgen gibt es?',
        'su-pfade':         'Ein Baumdiagramm hat drei Stufen mit je zwei Ästen. Wie viele Pfade hat es?',
        'su-gegen':         '$P(A)=0{,}35$. Wie groß ist $P(\\overline{A})$?',
        'su-rad':           'Ein Glücksrad hat $3$ rote und $5$ weiße Felder gleicher Größe. Wie groß ist $P(\\text{rot})$?',
        'su-herz':          'Aus einem Skatblatt mit $32$ Karten wird eine gezogen. Wie groß ist $P(\\text{Herz})$?',
        'su-haeufigkeit':   'In einer Stichprobe von $200$ Befragten antworten $154$ mit Ja. Wie groß ist die relative Häufigkeit?',
        'su-sieben':        'Zwei Würfel: wie groß ist die Wahrscheinlichkeit für die Augensumme $7$ ($6$ von $36$ Ergebnissen)?',
        'su-zwoelf':        'Zwei Würfel: wie groß ist die Wahrscheinlichkeit für die Augensumme $12$?',
        'su-unabhaengig':   '$P(A)=0{,}4$ und $P(B)=0{,}5$, unabhängig. Wie groß ist $P(A\\cap B)$?',
        'su-abo':           'Von $500$ Personen sind $200$ jünger als $30$, davon $50$ Abonnenten. Wie groß ist $P(\\text{Abo}\\mid\\text{jung})$?',
        'su-zweimal-kopf':  'Vier Münzwürfe: $6$ der $16$ Folgen haben genau zweimal Kopf. Wie groß ist die Wahrscheinlichkeit?',
        'su-beide-rot':     'Urne mit $5$ roten und $5$ blauen Kugeln, zweimal ohne Zurücklegen: beide rot.',
        'su-oder':          '$P(A)=0{,}4$, $P(B)=0{,}5$, $P(A\\cap B)=0{,}2$. Wie groß ist $P(A\\cup B)$?',
        'su-genau-zwei':    'Drei Münzwürfe: wie groß ist die Wahrscheinlichkeit für genau zweimal Kopf (drei Pfade)?',
        'su-erwartung':     'Ein Spiel kostet $2$ € Einsatz und zahlt mit $P=0{,}25$ genau $6$ € aus. Wie groß ist der erwartete Gewinn?',
        'su-fair':          'Dasselbe Spiel mit $2$ € Einsatz und $P=0{,}25$: bei welcher Auszahlung $x$ wäre es fair?',
        'su-zwei-herz':     'Skatblatt mit $32$ Karten, zwei Karten ohne Zurücklegen: beide Herz.',
        'su-mindestens':    'Ein Würfel wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs?',
        'su-nuss':          'Zwei Würfel zeigen mindestens eine Sechs. Wie groß ist die Wahrscheinlichkeit, dass beide eine Sechs zeigen?',
    });
})();
