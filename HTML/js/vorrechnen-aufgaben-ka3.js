// Block "Wiederholung · Klassenarbeit 3" - week 19 of 2027, Mathe BGY 11, the plan's "Wiederholung + Klassenarbeit 3 (LB 4 +
// LB 1)" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben
// orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after the week's
// quiz (mathetest11-ka3.html): path and sum rule (coins, the urn with 4 red and 6 blue, online orders on account, five
// throws without a six), P(A∩B) and P(B|A), matrices (transposed, a multiple, the check of a solution as matrix times
// vector), and systems - x + 2y = 8, 3x - y = 3; one with infinitely many solutions, one with none, the mixture of 30 kg
// for 150 €, 3x3 by Gauss - the nut: a 3x3 system whose third equation is the sum of the first two. The systems and
// their steps are generated (no hand arithmetic). Each task carries its setting in a sentence (aufgabenTexte).
// Every step checked with sympy (a term the same value, a system the same solutions), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['k3-muenze',       '\\frac{1}{2}\\cdot\\frac{1}{2}',                                                ''],
        ['k3-pfade',        '3\\cdot 3',                                                                     ''],
        ['k3-eintraege',    '3\\cdot 4',                                                                     ''],
        ['k3-urne',         '\\frac{4}{10}\\cdot\\frac{4}{10}',                                              ''],
        ['k3-schnitt',      '0{,}3\\cdot 0{,}5',                                                             ''],
        ['k3-online',       '0{,}4\\cdot 0{,}75',                                                            ''],
        ['k3-bedingt',      '\\frac{0{,}15}{0{,}3}',                                                         ''],
        ['k3-transponiert', '\\begin{pmatrix}2&-1\\\\0&3\\end{pmatrix}^{\\mathsf{T}}',                        ''],
        ['k3-vielfaches',   '3\\cdot\\begin{pmatrix}1&-2\\end{pmatrix}',                                     ''],
        ['k3-ohne',         '\\frac{4}{10}\\cdot\\frac{3}{9}',                                               ''],
        ['k3-keine-sechs',  '\\left(\\frac{5}{6}\\right)^5',                                                 ''],
        ['k3-mindestens',   '1-\\left(\\frac{5}{6}\\right)^3',                                               ''],
        ['k3-probe',        '\\begin{pmatrix}1&1&1\\\\2&-1&3\\\\1&2&-1\\end{pmatrix}\\cdot\\begin{pmatrix}1\\\\0\\\\-2\\end{pmatrix}', ''],
        ['k3-symmetrisch',  '\\begin{pmatrix}2&-1\\\\0&3\\end{pmatrix}+\\begin{pmatrix}2&-1\\\\0&3\\end{pmatrix}^{\\mathsf{T}}', ''],
        ['k3-lgs',          '{\\begin{cases}x+2y=8\\\\3x-y=3\\end{cases}}',                                   ''],
        ['k3-mischung',     '{\\begin{cases}x+y=30\\\\4x+7y=150\\end{cases}}',                                ''],
        ['k3-viele',        '{\\begin{cases}2x+3y=12\\\\4x+6y=24\\end{cases}}',                               ''],
        ['k3-widerspruch',  '{\\begin{cases}x+y=3\\\\2x+2y=10\\end{cases}}',                                  ''],
        ['k3-drei',         '{\\begin{cases}x+y+z=2\\\\2x-y+z=2\\\\x+2y-z=5\\end{cases}}',                    ''],
        ['k3-nuss',         '{\\begin{cases}x+y+z=4\\\\x+2y+3z=9\\\\2x+3y+4z=13\\end{cases}}',                ''],
    );
    BLOECKE.push({ titel: 'Wiederholung · Klassenarbeit 3', ab, bis: AUFGABEN.length, kw: 19, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'k3-muenze':        [['=\\frac{1}{4}', '\\text{Pfadregel}']],
        'k3-pfade':         [['=9', '\\text{ausrechnen}']],
        'k3-eintraege':     [['=12', '\\text{Zeilen mal Spalten}']],
        'k3-urne':          [['=\\frac{16}{100}', '\\text{Pfadregel}'], ['=0{,}16', '\\text{als Dezimalzahl}']],
        'k3-schnitt':       [['=0{,}15', 'P(A)\\cdot P(B\\mid A)']],
        'k3-online':        [['=0{,}3', '\\text{Pfadregel}']],
        'k3-bedingt':       [['=0{,}5', '\\text{ausrechnen}']],
        'k3-transponiert':  [['=\\begin{pmatrix}2&0\\\\-1&3\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'k3-vielfaches':    [['=\\begin{pmatrix}3&-6\\end{pmatrix}', '\\text{jeder Eintrag mal 3}']],
        'k3-ohne':          [['=\\frac{12}{90}', '\\text{Pfadregel}'], ['=\\frac{2}{15}', '\\text{kürzen}']],
        'k3-keine-sechs':   [['=\\frac{3125}{7776}', '\\text{Potenz ausrechnen}'], ['\\approx 0{,}402', '\\text{Taschenrechner}']],
        'k3-mindestens':    [['=1-\\frac{125}{216}', '\\text{Potenz ausrechnen}'], ['=\\frac{91}{216}', '\\text{ausrechnen}'],
                             ['\\approx 0{,}421', '\\text{Taschenrechner}']],
        'k3-probe':         [['=\\begin{pmatrix}1+0-2\\\\2-0-6\\\\1+0+2\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}-1\\\\-4\\\\3\\end{pmatrix}', '\\text{ausrechnen}']],
        'k3-symmetrisch':   [['=\\begin{pmatrix}2&-1\\\\0&3\\end{pmatrix}+\\begin{pmatrix}2&0\\\\-1&3\\end{pmatrix}', '\\text{transponieren}'],
                             ['=\\begin{pmatrix}4&-1\\\\-1&6\\end{pmatrix}', '\\text{Eintrag für Eintrag}']],
        'k3-lgs':           [['\\left(\\begin{array}{cc|c}1&2&8\\\\3&-1&3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&2&8\\\\0&-7&-21\\end{array}\\right)', '\\text{II}-3\\cdot\\text{I}'],
                             ['x=2\\quad y=3', '\\text{rückwärts einsetzen}']],
        'k3-mischung':      [['\\left(\\begin{array}{cc|c}1&1&30\\\\4&7&150\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&1&30\\\\0&3&30\\end{array}\\right)', '\\text{II}-4\\cdot\\text{I}'],
                             ['x=20\\quad y=10', '\\text{rückwärts einsetzen}']],
        'k3-viele':         [['\\left(\\begin{array}{cc|c}2&3&12\\\\4&6&24\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}2&3&12\\\\0&0&0\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['x=6-\\frac{3t}{2}\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'k3-widerspruch':   [['\\left(\\begin{array}{cc|c}1&1&3\\\\2&2&10\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}1&1&3\\\\0&0&4\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['L=\\{\\}', '\\text{Widerspruch}']],
        'k3-drei':          [['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\2&-1&1&2\\\\1&2&-1&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-3&-1&-2\\\\0&1&-2&3\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-\\text{I}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-3&-1&-2\\\\0&0&-7&7\\end{array}\\right)', '3\\cdot\\text{III}+\\text{II}'],
                             ['x=2\\quad y=1\\quad z=-1', '\\text{rückwärts einsetzen}']],
        'k3-nuss':          [['\\left(\\begin{array}{ccc|c}1&1&1&4\\\\1&2&3&9\\\\2&3&4&13\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&4\\\\0&1&2&5\\\\0&1&2&5\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-2\\cdot\\text{I}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&4\\\\0&1&2&5\\\\0&0&0&0\\end{array}\\right)', '\\text{III}-\\text{II}'],
                             ['x=t-1\\quad y=5-2t\\quad z=t', '\\text{Nullzeile, Parameter }t']],
    });
    Object.assign(ERKLAERUNGEN, {
        'k3-probe':
            'Die Probe einer Lösung ist ein Produkt Matrix mal Vektor: jede Zeile ist eine Gleichung, in die die Lösung eingesetzt wird.' +
            '\n\nKommt rechts genau die rechte Seite des Systems heraus – hier $(-1\\mid -4\\mid 3)$ –, stimmt die Lösung $(1\\mid 0\\mid -2)$.',
        'k3-nuss':
            'Die dritte Gleichung ist die Summe der ersten beiden: $2x+3y+4z$ und $4+9=13$. Sie bringt nichts Neues – darum die Nullzeile.' +
            '\n\nEine Unbekannte bleibt frei, $z=t$. Aus der zweiten Zeile $y=5-2t$, aus der ersten $x=4-y-z=t-1$.' +
            '\n\nProbe mit $t=1$: $(0\\mid 3\\mid 1)$ erfüllt alle drei Gleichungen.',
    });
    aufgabenTexte({
        'k3-muenze':        'Wie groß ist die Wahrscheinlichkeit für zweimal Kopf bei zwei Münzwürfen?',
        'k3-pfade':         'Ein Baumdiagramm hat zwei Stufen mit je drei Ästen. Wie viele Pfade hat es?',
        'k3-eintraege':     'Ein System hat $3$ Gleichungen und $4$ Unbekannte. Wie viele Einträge hat die Koeffizientenmatrix?',
        'k3-urne':          'Urne mit $4$ roten und $6$ blauen Kugeln, zweimal mit Zurücklegen: beide rot.',
        'k3-schnitt':       '$P(A)=0{,}3$ und $P(B\\mid A)=0{,}5$. Wie groß ist $P(A\\cap B)$?',
        'k3-online':        '$40\\,\\%$ der Kunden bestellen online, davon zahlen $75\\,\\%$ per Rechnung. Welcher Anteil aller Kunden bestellt online und zahlt per Rechnung?',
        'k3-bedingt':       '$P(A)=0{,}3$ und $P(A\\cap B)=0{,}15$. Wie groß ist $P(B\\mid A)$?',
        'k3-transponiert':  'Transponiere die Matrix.',
        'k3-vielfaches':    'Berechne das Dreifache des Zeilenvektors.',
        'k3-ohne':          'Urne mit $4$ roten und $6$ blauen Kugeln, zweimal ohne Zurücklegen: beide rot.',
        'k3-keine-sechs':   'Wie groß ist die Wahrscheinlichkeit, bei fünf Würfen keine Sechs zu werfen?',
        'k3-mindestens':    'Wie groß ist die Wahrscheinlichkeit, bei drei Würfen mindestens eine Sechs zu werfen?',
        'k3-probe':         'Probe: ist $(1\\mid 0\\mid -2)$ die Lösung des Systems mit dieser Koeffizientenmatrix und der rechten Seite $(-1\\mid -4\\mid 3)$?',
        'k3-symmetrisch':   'Addiere die Matrix und ihre Transponierte.',
        'k3-lgs':           'Löse das System mit dem Gauß-Verfahren.',
        'k3-mischung':      'Ein Betrieb mischt $x$ kg zu $4$ €/kg und $y$ kg zu $7$ €/kg zu $30$ kg für insgesamt $150$ €.',
        'k3-viele':         'Löse das System. Was fällt an der zweiten Gleichung auf?',
        'k3-widerspruch':   'Löse das System. Was sagt die letzte Zeile der Stufenform?',
        'k3-drei':          'Löse das System mit dem Gauß-Verfahren.',
        'k3-nuss':          'Löse das System mit dem Gauß-Verfahren – und deute die Stufenform.',
    });
})();
