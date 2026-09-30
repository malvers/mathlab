// Block "Matrizenoperationen · Probe und Anwendung" - week 14 of 2027, Mathe BGY 11, the plan's "Größere LGS mit CAS;
// Matrizenoperationen: Addition, skalare Multiplikation, Transponieren" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen
// für das SJ bitte ... immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben
// 5 x 45 min"). The large systems go to the CAS; at the board, after the week's quiz (mathetest11-cas-lgs.html): the
// operations by hand - multiple, sum, difference, transposed twice, A + A^T is symmetric, (A + B)^T - the check of an
// (CAS) solution as matrix times vector, requirement and price times quantities, and 3x3 systems by Gauss: a mixture,
// one with a negative share (what the CAS reports must be read). Easy to hard.
// Every step checked with sympy (a matrix term the same matrix, a system the same solutions), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['ca-vielfaches',   '2\\cdot\\begin{pmatrix}1&3\\\\0&-2\\end{pmatrix}',                              ''],
        ['ca-transponiert', '\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}^{\\mathsf{T}}',                        ''],
        ['ca-summe',        '\\begin{pmatrix}1&0\\\\2&3\\end{pmatrix}+\\begin{pmatrix}4&1\\\\-2&0\\end{pmatrix}', ''],
        ['ca-null',         '0\\cdot\\begin{pmatrix}2&-1&4\\\\3&0&5\\\\1&1&1\\end{pmatrix}',                 ''],
        ['ca-neutral',      '\\begin{pmatrix}3&-1\\\\2&5\\end{pmatrix}+\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}', ''],
        ['ca-format',       '\\begin{pmatrix}1&2&3&4&5\\\\6&7&8&9&0\\end{pmatrix}^{\\mathsf{T}}',              ''],
        ['ca-zweimal',      '\\left(\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}^{\\mathsf{T}}\\right)^{\\mathsf{T}}', ''],
        ['ca-halbe',        '\\frac{1}{2}\\cdot\\begin{pmatrix}4&-6\\\\2&8\\end{pmatrix}',                    ''],
        ['ca-kombination',  '3\\cdot\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}-2\\cdot\\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}', ''],
        ['ca-symmetrisch',  '\\begin{pmatrix}1&2\\\\0&3\\end{pmatrix}+\\begin{pmatrix}1&2\\\\0&3\\end{pmatrix}^{\\mathsf{T}}', ''],
        ['ca-preis',        '\\begin{pmatrix}2&5&3\\end{pmatrix}\\cdot\\begin{pmatrix}10\\\\4\\\\6\\end{pmatrix}', ''],
        ['ca-bedarf',       '\\begin{pmatrix}1&2\\\\3&1\\\\2&2\\end{pmatrix}\\cdot\\begin{pmatrix}20\\\\30\\end{pmatrix}', ''],
        ['ca-probe-zwei',   '\\begin{pmatrix}3&4\\\\2&-3\\end{pmatrix}\\cdot\\begin{pmatrix}2\\\\1\\end{pmatrix}', ''],
        ['ca-probe',        '\\begin{pmatrix}1&1&1\\\\2&-1&1\\\\1&2&-1\\end{pmatrix}\\cdot\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix}', ''],
        ['ca-summe-transponiert', '\\left(\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}+\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\right)^{\\mathsf{T}}', ''],
        ['ca-drei',         '{\\begin{cases}2x+y-z=3\\\\x-y+2z=5\\\\3x+2y+z=10\\end{cases}}',               ''],
        ['ca-mischung',     '{\\begin{cases}x+y+z=10\\\\2x+3y+5z=37\\\\y-z=-3\\end{cases}}',                ''],
        ['ca-negativ',      '{\\begin{cases}x+y+z=10\\\\x+2y+4z=20\\\\x+3y+9z=40\\end{cases}}',             ''],
        ['ca-gleiche-zeilen', '{\\begin{cases}x+y+z=6\\\\x+y+z=6\\\\x-y=0\\end{cases}}',                    ''],
        ['ca-nuss',         '\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}^{\\mathsf{T}}-\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}', ''],
    );
    BLOECKE.push({ titel: 'Matrizenoperationen · Probe und Anwendung', ab, bis: AUFGABEN.length, kw: 14, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'ca-vielfaches':    [['=\\begin{pmatrix}2&6\\\\0&-4\\end{pmatrix}', '\\text{jeder Eintrag mal 2}']],
        'ca-transponiert':  [['=\\begin{pmatrix}1&3\\\\2&4\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'ca-summe':         [['=\\begin{pmatrix}1+4&0+1\\\\2-2&3+0\\end{pmatrix}', '\\text{Eintrag für Eintrag}'],
                             ['=\\begin{pmatrix}5&1\\\\0&3\\end{pmatrix}', '\\text{ausrechnen}']],
        'ca-null':          [['=\\begin{pmatrix}0&0&0\\\\0&0&0\\\\0&0&0\\end{pmatrix}', '\\text{jeder Eintrag mal 0}']],
        'ca-neutral':       [['=\\begin{pmatrix}3&-1\\\\2&5\\end{pmatrix}', '\\text{Nullmatrix ändert nichts}']],
        'ca-format':        [['=\\begin{pmatrix}1&6\\\\2&7\\\\3&8\\\\4&9\\\\5&0\\end{pmatrix}', '2\\times 5\\ \\text{wird}\\ 5\\times 2']],
        'ca-zweimal':       [['=\\begin{pmatrix}1&3\\\\2&4\\end{pmatrix}^{\\mathsf{T}}', '\\text{innen transponieren}'],
                             ['=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}', '\\text{wieder transponieren}']],
        'ca-halbe':         [['=\\begin{pmatrix}2&-3\\\\1&4\\end{pmatrix}', '\\text{jeder Eintrag mal}\\ \\frac{1}{2}']],
        'ca-kombination':   [['=\\begin{pmatrix}3&6\\\\0&3\\end{pmatrix}-\\begin{pmatrix}2&2\\\\2&0\\end{pmatrix}', '\\text{Vielfache}'],
                             ['=\\begin{pmatrix}1&4\\\\-2&3\\end{pmatrix}', '\\text{Eintrag für Eintrag}']],
        'ca-symmetrisch':   [['=\\begin{pmatrix}1&2\\\\0&3\\end{pmatrix}+\\begin{pmatrix}1&0\\\\2&3\\end{pmatrix}', '\\text{transponieren}'],
                             ['=\\begin{pmatrix}2&2\\\\2&6\\end{pmatrix}', '\\text{Eintrag für Eintrag}']],
        'ca-preis':         [['=\\begin{pmatrix}2\\cdot 10+5\\cdot 4+3\\cdot 6\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}58\\end{pmatrix}', '\\text{ausrechnen}']],
        'ca-bedarf':        [['=\\begin{pmatrix}1\\cdot 20+2\\cdot 30\\\\3\\cdot 20+1\\cdot 30\\\\2\\cdot 20+2\\cdot 30\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}80\\\\90\\\\100\\end{pmatrix}', '\\text{ausrechnen}']],
        'ca-probe-zwei':    [['=\\begin{pmatrix}3\\cdot 2+4\\cdot 1\\\\2\\cdot 2-3\\cdot 1\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}10\\\\1\\end{pmatrix}', '\\text{ausrechnen}']],
        'ca-probe':         [['=\\begin{pmatrix}1+2+3\\\\2-2+3\\\\1+4-3\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}6\\\\3\\\\2\\end{pmatrix}', '\\text{ausrechnen}']],
        'ca-summe-transponiert': [['=\\begin{pmatrix}1&3\\\\4&4\\end{pmatrix}^{\\mathsf{T}}', '\\text{Eintrag für Eintrag}'],
                             ['=\\begin{pmatrix}1&4\\\\3&4\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'ca-drei':          [['\\left(\\begin{array}{ccc|c}2&1&-1&3\\\\1&-1&2&5\\\\3&2&1&10\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}2&1&-1&3\\\\0&-3&5&7\\\\0&1&5&11\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I},\\ 2\\cdot\\text{III}-3\\cdot\\text{I}'],
                             ['\\left(\\begin{array}{ccc|c}2&1&-1&3\\\\0&-3&5&7\\\\0&0&20&40\\end{array}\\right)', '3\\cdot\\text{III}+\\text{II}'],
                             ['x=2\\quad y=1\\quad z=2', '\\text{rückwärts einsetzen}']],
        'ca-mischung':      [['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\2&3&5&37\\\\0&1&-1&-3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\0&1&3&17\\\\0&1&-1&-3\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\0&1&3&17\\\\0&0&-4&-20\\end{array}\\right)', '\\text{III}-\\text{II}'],
                             ['x=3\\quad y=2\\quad z=5', '\\text{rückwärts einsetzen}']],
        'ca-negativ':       [['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\1&2&4&20\\\\1&3&9&40\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\0&1&3&10\\\\0&2&8&30\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-\\text{I}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&10\\\\0&1&3&10\\\\0&0&2&10\\end{array}\\right)', '\\text{III}-2\\cdot\\text{II}'],
                             ['x=10\\quad y=-5\\quad z=5', '\\text{rückwärts einsetzen}']],
        'ca-gleiche-zeilen': [['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\1&1&1&6\\\\1&-1&0&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&0&0&0\\\\0&-2&-1&-6\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-\\text{I}'],
                             ['x=3-\\frac{t}{2}\\quad y=3-\\frac{t}{2}\\quad z=t', '\\text{Nullzeile, Parameter }t']],
        'ca-nuss':          [['=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}-\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}', '\\text{transponieren}'],
                             ['=\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}', '\\text{Eintrag für Eintrag}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'ca-symmetrisch':
            'Symmetrisch heißt: $A^{\\mathsf{T}}=A$ – gespiegelt an der Hauptdiagonale bleibt alles gleich.' +
            '\n\n$A+A^{\\mathsf{T}}$ ist immer symmetrisch, egal wie $A$ aussieht. Hier stehen die beiden $2$ spiegelbildlich.',
        'ca-negativ':
            'Das CAS liefert $x=10$, $y=-5$, $z=5$. Als Mischung dreier Sorten hieße das $-5$ Liter der zweiten Sorte.' +
            '\n\nDie Rechnung ist richtig – aber die Mischung lässt sich mit diesen Sorten nicht herstellen. Das zu erkennen bleibt Ihre Aufgabe.',
        'ca-nuss':
            'Die Matrix ist symmetrisch: transponiert ist sie dieselbe. Darum bleibt nach dem Abziehen die Nullmatrix.' +
            '\n\nUmgekehrt: $A^{\\mathsf{T}}-A$ ist genau dann die Nullmatrix, wenn $A$ symmetrisch ist.',
    });
    aufgabenTexte({
        'ca-format':     'Welches Format hat $A^{\\mathsf{T}}$, wenn $A$ das Format $2\\times 5$ hat?',
        'ca-zweimal':    'Was gilt für $\\left(A^{\\mathsf{T}}\\right)^{\\mathsf{T}}$?',
        'ca-neutral':    'Was ist das neutrale Element der Matrizenaddition?',
        'ca-symmetrisch': 'Addiere die Matrix und ihre Transponierte. Was fällt am Ergebnis auf?',
        'ca-preis':      'Preise $2$ €, $5$ €, $3$ € (Zeile) mal Stückzahlen $10$, $4$, $6$ (Spalte): was kostet der Einkauf?',
        'ca-bedarf':     'Drei Rohstoffe (Zeilen) für zwei Produkte (Spalten): wie viel Rohstoff brauchen $20$ und $30$ Stück?',
        'ca-probe-zwei': 'Probe: löst $(2\\mid 1)$ das System $3x+4y=10$, $2x-3y=1$?',
        'ca-probe':      'Probe der CAS-Lösung $(1\\mid 2\\mid 3)$: Koeffizientenmatrix mal Lösungsvektor muss die rechte Seite $(6\\mid 3\\mid 2)$ geben.',
        'ca-drei':       'Löse das System mit dem Gauß-Verfahren.',
        'ca-mischung':   'Drei Sorten ($x$, $y$, $z$ Liter) ergeben $10$ Liter; die Preise $2$, $3$, $5$ €/l ergeben $37$ €; von der zweiten Sorte sind es $3$ Liter weniger als von der dritten.',
        'ca-negativ':    'Das CAS löst ein Mischungsproblem mit drei Sorten. Was sagt das Ergebnis?',
        'ca-gleiche-zeilen': 'Die Koeffizientenmatrix hat zwei gleiche Zeilen. Was bedeutet das für die Lösung?',
        'ca-nuss':       'Eine symmetrische Matrix: was bleibt, wenn man sie von ihrer Transponierten abzieht?',
    });
})();
