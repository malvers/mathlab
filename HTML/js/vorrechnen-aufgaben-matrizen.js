// Block "Matrizen · Begriff und Schreibweise" - week 10 of 2027, Mathe BGY 11, the plan's "Matrizen: Begriff, spezielle
// Matrizen, Darstellung A·x = b" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon
// vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to
// hard, after the week's quiz (mathetest11-matrizen.html): the entries of a 4×5 matrix, equal matrices, transposing
// (a row becomes a column), a multiple, a sum, the unit and a diagonal matrix, matrix times vector - A·x written out,
// the requirement matrix of a plant, an upper triangular matrix - the system 2x + 3y = 7, x - y = 1 as A·x = b and as
// the augmented matrix, and the nut: how much of two products from the stock of two raw materials.
// Every step checked with sympy (a matrix term the same matrix, a system the same solutions), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['mx-anzahl',       '4\\cdot 5',                                                                   ''],
        ['mx-gleich',       'a+1=4',                                                                       'a'],
        ['mx-transponiert', '\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}^{\\mathsf{T}}',                        ''],
        ['mx-zeile',        '\\begin{pmatrix}1&2&3\\end{pmatrix}^{\\mathsf{T}}',                             ''],
        ['mx-rechteck',     '\\begin{pmatrix}1&2&3\\\\4&5&6\\end{pmatrix}^{\\mathsf{T}}',                    ''],
        ['mx-vielfaches',   '3\\cdot\\begin{pmatrix}1&-2\\\\0&4\\end{pmatrix}',                              ''],
        ['mx-summe',        '\\begin{pmatrix}1&0\\\\2&3\\end{pmatrix}+\\begin{pmatrix}4&1\\\\-2&0\\end{pmatrix}', ''],
        ['mx-differenz',    '\\begin{pmatrix}5&2\\\\1&7\\end{pmatrix}-\\begin{pmatrix}3&2\\\\4&1\\end{pmatrix}', ''],
        ['mx-einheit',      '\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}\\cdot\\begin{pmatrix}3\\\\5\\end{pmatrix}', ''],
        ['mx-diagonal',     '\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}\\cdot\\begin{pmatrix}4\\\\5\\end{pmatrix}', ''],
        ['mx-produkt',      '\\begin{pmatrix}2&3\\\\1&-1\\end{pmatrix}\\cdot\\begin{pmatrix}2\\\\1\\end{pmatrix}', ''],
        ['mx-produkt-minus', '\\begin{pmatrix}3&-1\\\\2&4\\end{pmatrix}\\cdot\\begin{pmatrix}2\\\\-1\\end{pmatrix}', ''],
        ['mx-dreieck',      '\\begin{pmatrix}1&2&3\\\\0&1&4\\\\0&0&2\\end{pmatrix}\\cdot\\begin{pmatrix}1\\\\1\\\\1\\end{pmatrix}', ''],
        ['mx-bedarf',       '\\begin{pmatrix}2&1&3\\\\1&4&2\\end{pmatrix}\\cdot\\begin{pmatrix}10\\\\5\\\\20\\end{pmatrix}', ''],
        ['mx-null',         '0\\cdot\\begin{pmatrix}2&-1\\\\3&5\\end{pmatrix}',                              ''],
        ['mx-summe-transponiert', '\\left(\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}+\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\right)^{\\mathsf{T}}', ''],
        ['mx-schreibweise', '{\\begin{cases}2x+3y=7\\\\x-y=1\\end{cases}}',                                  ''],
        ['mx-erweitert',    '{\\begin{cases}2x+3y=7\\\\x-y=1\\end{cases}}',                                  ''],
        ['mx-linear',       '2\\cdot\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}-3\\cdot\\begin{pmatrix}0&1\\\\1&1\\end{pmatrix}', ''],
        ['mx-nuss',         '{\\begin{cases}2x+y=40\\\\x+3y=45\\end{cases}}',                                ''],
    );
    wochenBlock('matrizen', ab, { kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'mx-anzahl':        [['=20', '\\text{Zeilen mal Spalten}']],
        'mx-gleich':        [['a=3', '-1']],
        'mx-transponiert':  [['=\\begin{pmatrix}1&3\\\\2&4\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'mx-zeile':         [['=\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix}', '\\text{Zeile wird Spalte}']],
        'mx-rechteck':      [['=\\begin{pmatrix}1&4\\\\2&5\\\\3&6\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'mx-vielfaches':    [['=\\begin{pmatrix}3\\cdot 1&3\\cdot(-2)\\\\3\\cdot 0&3\\cdot 4\\end{pmatrix}', '\\text{jeder Eintrag mal 3}'],
                             ['=\\begin{pmatrix}3&-6\\\\0&12\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-summe':         [['=\\begin{pmatrix}1+4&0+1\\\\2-2&3+0\\end{pmatrix}', '\\text{Eintrag für Eintrag}'],
                             ['=\\begin{pmatrix}5&1\\\\0&3\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-differenz':     [['=\\begin{pmatrix}5-3&2-2\\\\1-4&7-1\\end{pmatrix}', '\\text{Eintrag für Eintrag}'],
                             ['=\\begin{pmatrix}2&0\\\\-3&6\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-einheit':       [['=\\begin{pmatrix}1\\cdot 3+0\\cdot 5\\\\0\\cdot 3+1\\cdot 5\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}3\\\\5\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-diagonal':      [['=\\begin{pmatrix}2\\cdot 4+0\\cdot 5\\\\0\\cdot 4+3\\cdot 5\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}8\\\\15\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-produkt':       [['=\\begin{pmatrix}2\\cdot 2+3\\cdot 1\\\\1\\cdot 2-1\\cdot 1\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}7\\\\1\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-produkt-minus': [['=\\begin{pmatrix}3\\cdot 2-1\\cdot(-1)\\\\2\\cdot 2+4\\cdot(-1)\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}7\\\\0\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-dreieck':       [['=\\begin{pmatrix}1+2+3\\\\0+1+4\\\\0+0+2\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}6\\\\5\\\\2\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-bedarf':        [['=\\begin{pmatrix}2\\cdot 10+1\\cdot 5+3\\cdot 20\\\\1\\cdot 10+4\\cdot 5+2\\cdot 20\\end{pmatrix}', '\\text{Zeile mal Spalte}'],
                             ['=\\begin{pmatrix}85\\\\70\\end{pmatrix}', '\\text{ausrechnen}']],
        'mx-null':          [['=\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}', '\\text{jeder Eintrag mal 0}']],
        'mx-summe-transponiert': [['=\\begin{pmatrix}1&3\\\\4&4\\end{pmatrix}^{\\mathsf{T}}', '\\text{Eintrag für Eintrag}'],
                             ['=\\begin{pmatrix}1&4\\\\3&4\\end{pmatrix}', '\\text{Zeilen werden Spalten}']],
        'mx-schreibweise':  [['\\begin{pmatrix}2&3\\\\1&-1\\end{pmatrix}\\cdot\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}7\\\\1\\end{pmatrix}', 'A\\cdot\\vec{x}=\\vec{b}'],
                             ['x=2\\quad y=1', '\\text{lösen}']],
        'mx-erweitert':     [['\\left(\\begin{array}{cc|c}2&3&7\\\\1&-1&1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}2&3&7\\\\0&-5&-5\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I}'],
                             ['x=2\\quad y=1', '\\text{rückwärts einsetzen}']],
        'mx-linear':        [['=\\begin{pmatrix}2&0\\\\4&2\\end{pmatrix}-\\begin{pmatrix}0&3\\\\3&3\\end{pmatrix}', '\\text{Vielfache}'],
                             ['=\\begin{pmatrix}2&-3\\\\1&-1\\end{pmatrix}', '\\text{Eintrag für Eintrag}']],
        'mx-nuss':          [['\\left(\\begin{array}{cc|c}2&1&40\\\\1&3&45\\end{array}\\right)', '\\text{Koeffizientenmatrix}'],
                             ['\\left(\\begin{array}{cc|c}2&1&40\\\\0&5&50\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I}'],
                             ['x=15\\quad y=10', '\\text{rückwärts einsetzen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'mx-produkt':
            'Matrix mal Vektor: jede Zeile der Matrix mal den Vektor, Eintrag für Eintrag multipliziert und addiert.' +
            '\n\nErste Zeile: $2\\cdot 2+3\\cdot 1=7$. Zweite Zeile: $1\\cdot 2+(-1)\\cdot 1=1$.' +
            '\n\nDas ist genau das System $2x+3y=7$, $x-y=1$ mit $x=2$, $y=1$ eingesetzt.',
        'mx-bedarf':
            'Die Bedarfsmatrix sagt, wie viel von jedem Rohstoff (Zeilen) ein Stück jedes Produkts (Spalten) braucht. ' +
            'Mal den Stückzahlvektor ergibt den gesamten Rohstoffbedarf.' +
            '\n\nFür $10$, $5$ und $20$ Stück: $85$ Einheiten vom ersten und $70$ vom zweiten Rohstoff.',
        'mx-nuss':
            'Produkt A braucht $2$ kg vom Rohstoff R1 und $1$ kg von R2, Produkt B $1$ kg von R1 und $3$ kg von R2. ' +
            'Auf Lager sind $40$ kg R1 und $45$ kg R2. Wie viele Stück, damit alles aufgebraucht wird?' +
            '\n\nProbe: $2\\cdot 15+10=40$ und $15+3\\cdot 10=45$.',
    });
    aufgabenTexte({
        'mx-anzahl':     'Wie viele Einträge hat eine $4\\times 5$-Matrix?',
        'mx-gleich':     'Zwei Matrizen sind gleich, wenn alle Einträge übereinstimmen. Oben links steht $a+1$ und $4$. Wie groß ist $a$?',
        'mx-transponiert': 'Transponiere die Matrix.',
        'mx-zeile':      'Transponiere den Zeilenvektor.',
        'mx-rechteck':   'Transponiere die $2\\times 3$-Matrix.',
        'mx-einheit':    'Was macht die Einheitsmatrix mit einem Vektor?',
        'mx-diagonal':   'Was macht eine Diagonalmatrix mit einem Vektor?',
        'mx-produkt':    'Das System $2x+3y=7$, $x-y=1$ als $A\\cdot\\vec{x}$: setze $x=2$, $y=1$ ein.',
        'mx-dreieck':    'Eine obere Dreiecksmatrix mal den Vektor aus lauter Einsen.',
        'mx-bedarf':     'Bedarfsmatrix: zwei Rohstoffe (Zeilen) für drei Produkte (Spalten). Wie viel Rohstoff brauchen $10$, $5$ und $20$ Stück?',
        'mx-null':       'Eine Matrix wird mit $0$ multipliziert. Was entsteht?',
        'mx-schreibweise': 'Schreibe das System als $A\\cdot\\vec{x}=\\vec{b}$ und löse es.',
        'mx-erweitert':  'Schreibe das System als erweiterte Koeffizientenmatrix und löse es.',
        'mx-nuss':       'Produkt A braucht $2$ kg R1 und $1$ kg R2, Produkt B $1$ kg R1 und $3$ kg R2. Auf Lager: $40$ kg R1, $45$ kg R2. Wie viele Stück $x$ und $y$?',
    });
})();
