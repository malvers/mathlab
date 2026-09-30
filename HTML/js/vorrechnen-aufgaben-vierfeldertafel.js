// Block "Vierfeldertafel · bedingte Wahrscheinlichkeit" - week 16 of 2027, Mathe BGY 11, the plan's "Mehrstufige
// Zufallsversuche II: Vierfeldertafeln" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den
// schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy
// to hard, after the week's quiz (mathetest11-vierfeldertafel.html): the class of 30 with 18 wearing glasses, inner and
// outer fields, the complement, P(B|A) = P(A∩B)/P(A) - sporty non-smokers, old diesel cars, Spanish and French -
// independence by P(A)·P(B), the total probability, and the medical test read backwards: P(ill | positive) is only
// about 1/6. Each task carries its setting in a sentence (aufgabenTexte): on the board stands only the term.
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['vf-jungen-brille', '18-8',                                      ''],
        ['vf-ohne-brille',  '14-8',                                       ''],
        ['vf-jungen-ohne',  '(30-14)-(18-8)',                             ''],
        ['vf-gegen',        '1-0{,}35',                                   ''],
        ['vf-rand',         '0{,}2+0{,}3',                                ''],
        ['vf-innen',        '0{,}5-0{,}2',                                ''],
        ['vf-ecke',         '1-0{,}5-0{,}4+0{,}2',                        ''],
        ['vf-anteil',       '\\frac{8}{30}',                              ''],
        ['vf-bedingt',      '\\frac{30}{40}',                             ''],
        ['vf-diesel',       '\\frac{30}{120}',                            ''],
        ['vf-spanisch',     '\\frac{0{,}3}{0{,}6}',                       ''],
        ['vf-feld',         '\\frac{x}{40}=0{,}75',                       'x'],
        ['vf-unabhaengig',  '0{,}5\\cdot 0{,}4',                          ''],
        ['vf-abhaengig',    '0{,}3-0{,}5\\cdot 0{,}4',                    ''],
        ['vf-schnitt',      '0{,}4\\cdot 0{,}75',                         ''],
        ['vf-umgekehrt',    '\\frac{30}{70}',                             ''],
        ['vf-total',        '0{,}4\\cdot 0{,}75+0{,}6\\cdot 0{,}5',       ''],
        ['vf-positiv',      '0{,}01\\cdot 0{,}99+0{,}99\\cdot 0{,}05',    ''],
        ['vf-krank',        '\\frac{0{,}0099}{0{,}0594}',                 ''],
        ['vf-nuss',         '\\frac{0{,}4\\cdot 0{,}75}{0{,}4\\cdot 0{,}75+0{,}6\\cdot 0{,}5}', ''],
    );
    wochenBlock('vierfeldertafel', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'vf-jungen-brille': [['=10', '\\text{Randfeld minus Innenfeld}']],
        'vf-ohne-brille':   [['=6', '\\text{Randfeld minus Innenfeld}']],
        'vf-jungen-ohne':   [['=16-10', '\\text{Randfelder}'], ['=6', '\\text{ausrechnen}']],
        'vf-gegen':         [['=0{,}65', '\\text{Gegenereignis}']],
        'vf-rand':          [['=0{,}5', '\\text{Zeilensumme}']],
        'vf-innen':         [['=0{,}3', '\\text{Randfeld minus Innenfeld}']],
        'vf-ecke':          [['=0{,}3', '\\text{ausrechnen}']],
        'vf-anteil':        [['=\\frac{4}{15}', '\\text{kürzen}'], ['\\approx 0{,}267', '\\text{Taschenrechner}']],
        'vf-bedingt':       [['=\\frac{3}{4}', '\\text{kürzen}'], ['=0{,}75', '\\text{als Dezimalzahl}']],
        'vf-diesel':        [['=\\frac{1}{4}', '\\text{kürzen}'], ['=0{,}25', '\\text{als Dezimalzahl}']],
        'vf-spanisch':      [['=0{,}5', '\\text{ausrechnen}']],
        'vf-feld':          [['x=30', '\\cdot 40']],
        'vf-unabhaengig':   [['=0{,}2', '\\text{ausrechnen}']],
        'vf-abhaengig':     [['=0{,}3-0{,}2', '\\text{ausrechnen}'], ['=0{,}1', '\\text{ausrechnen}']],
        'vf-schnitt':       [['=0{,}3', 'P(A)\\cdot P(B\\mid A)']],
        'vf-umgekehrt':     [['=\\frac{3}{7}', '\\text{kürzen}'], ['\\approx 0{,}429', '\\text{Taschenrechner}']],
        'vf-total':         [['=0{,}3+0{,}3', '\\text{Pfadregel}'], ['=0{,}6', '\\text{Summenregel}']],
        'vf-positiv':       [['=0{,}0099+0{,}0495', '\\text{Pfadregel}'], ['=0{,}0594', '\\text{Summenregel}']],
        'vf-krank':         [['=\\frac{1}{6}', '\\text{kürzen}'], ['\\approx 0{,}167', '\\text{Taschenrechner}']],
        'vf-nuss':          [['=\\frac{0{,}3}{0{,}3+0{,}3}', '\\text{ausrechnen}'], ['=\\frac{0{,}3}{0{,}6}', '\\text{ausrechnen}'], ['=0{,}5', '\\text{kürzen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'vf-unabhaengig':
            'Unabhängig heißt: $P(A\\cap B)=P(A)\\cdot P(B)$. Hier ist $0{,}5\\cdot 0{,}4=0{,}2$ – genau der Wert im Innenfeld.' +
            '\n\nAlso sind $A$ und $B$ unabhängig: ob $A$ eintritt, ändert nichts an der Wahrscheinlichkeit von $B$.',
        'vf-krank':
            'Der Test ist zu $99\\,\\%$ treffsicher – und trotzdem ist nur jede sechste positiv getestete Person krank.' +
            '\n\nDer Grund: es gibt viel mehr Gesunde. Von $10\\,000$ Personen sind $100$ krank ($99$ positiv) und $9900$ gesund ($495$ falsch positiv). ' +
            '$99$ von $594$ Positiven sind krank.' +
            '\n\n$P(\\text{krank}\\mid\\text{positiv})$ ist nicht $P(\\text{positiv}\\mid\\text{krank})$.',
        'vf-nuss':
            'Der Satz von Bayes in einer Zeile: der Pfad über $A$ geteilt durch alle Pfade, die zu $B$ führen.' +
            '\n\n$P(A\\mid B)=\\frac{P(A)\\cdot P(B\\mid A)}{P(B)}$ – oben das Innenfeld, unten das Randfeld der Vierfeldertafel.',
    });
    aufgabenTexte({
        'vf-jungen-brille': 'In einer Klasse tragen $18$ von $30$ Personen eine Brille, davon sind $8$ Mädchen. Wie viele Jungen tragen eine Brille?',
        'vf-ohne-brille':   'Von den $14$ Mädchen der Klasse tragen $8$ eine Brille. Wie viele Mädchen tragen keine?',
        'vf-jungen-ohne':   'Klasse mit $30$ Personen, $14$ Mädchen, $18$ Brillen, davon $8$ bei Mädchen. Wie viele Jungen tragen keine Brille?',
        'vf-gegen':         '$P(A)=0{,}35$. Wie groß ist $P(\\overline{A})$?',
        'vf-rand':          '$P(A\\cap B)=0{,}2$ und $P(A\\cap\\overline{B})=0{,}3$. Wie groß ist $P(A)$?',
        'vf-innen':         '$P(A)=0{,}5$ und $P(A\\cap B)=0{,}2$. Wie groß ist $P(A\\cap\\overline{B})$?',
        'vf-ecke':          '$P(A)=0{,}5$, $P(B)=0{,}4$, $P(A\\cap B)=0{,}2$. Wie groß ist $P(\\overline{A}\\cap\\overline{B})$?',
        'vf-anteil':        'In der Klasse mit $30$ Personen tragen $8$ Mädchen eine Brille. Wie groß ist ihr Anteil an der Klasse?',
        'vf-bedingt':       'Von $100$ Personen sind $40$ sportlich, davon $30$ Nichtraucher. Wie groß ist $P(\\text{Nichtraucher}\\mid\\text{sportlich})$?',
        'vf-diesel':        'Von $200$ Fahrzeugen sind $120$ Diesel, davon $30$ älter als zehn Jahre. Wie groß ist $P(\\text{alt}\\mid\\text{Diesel})$?',
        'vf-spanisch':      '$60\\,\\%$ lernen Spanisch, $30\\,\\%$ Spanisch und Französisch. Wie groß ist $P(\\text{Französisch}\\mid\\text{Spanisch})$?',
        'vf-feld':          'Von $40$ sportlichen Personen sind $75\\,\\%$ Nichtraucher. Wie viele sind das?',
        'vf-unabhaengig':   '$P(A)=0{,}5$, $P(B)=0{,}4$, $P(A\\cap B)=0{,}2$. Sind $A$ und $B$ unabhängig? Berechne $P(A)\\cdot P(B)$.',
        'vf-abhaengig':     '$P(A)=0{,}5$, $P(B)=0{,}4$, $P(A\\cap B)=0{,}3$. Wie weit liegt $P(A\\cap B)$ von $P(A)\\cdot P(B)$ entfernt?',
        'vf-schnitt':       '$P(A)=0{,}4$ und $P(B\\mid A)=0{,}75$. Wie groß ist $P(A\\cap B)$?',
        'vf-umgekehrt':     'Von $100$ Personen sind $70$ Nichtraucher, $30$ davon sportlich. Wie groß ist $P(\\text{sportlich}\\mid\\text{Nichtraucher})$?',
        'vf-total':         '$P(A)=0{,}4$, $P(B\\mid A)=0{,}75$, $P(B\\mid\\overline{A})=0{,}5$. Wie groß ist $P(B)$?',
        'vf-positiv':       '$1\\,\\%$ ist krank, der Test erkennt $99\\,\\%$ davon und testet $5\\,\\%$ der Gesunden falsch positiv. Wie groß ist $P(\\text{positiv})$?',
        'vf-krank':         'Derselbe Test: $P(\\text{krank und positiv})=0{,}0099$, $P(\\text{positiv})=0{,}0594$. Wie groß ist $P(\\text{krank}\\mid\\text{positiv})$?',
        'vf-nuss':          '$P(A)=0{,}4$, $P(B\\mid A)=0{,}75$, $P(B\\mid\\overline{A})=0{,}5$. Wie groß ist $P(A\\mid B)$?',
    });
})();
