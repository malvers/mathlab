// Block "Lösungsmengen · keine, eine, unendlich viele" - week 12 of 2027, Mathe BGY 11, the plan's "Gauß-Übung; Diskussion
// der Lösungsmengen" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty systems after the week's quiz
// (mathetest11-loesungsmengen.html): exactly one solution, none (a row 0 = 5), infinitely many (a zero row - one
// unknown free as a parameter t), homogeneous systems, fewer equations than unknowns, the mixture with -3 litres, and
// the nut where the third equation is the sum of the first two. Every system and every step generated and checked
// with sympy (the same solutions as the task, a parameter solution solving the task for every t), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['lm-eine', '{\\begin{cases}x+y=4\\\\x-y=2\\end{cases}}', ''],
        ['lm-keine', '{\\begin{cases}x+y=4\\\\x+y=9\\end{cases}}', ''],
        ['lm-viele', '{\\begin{cases}x+y=4\\\\2x+2y=8\\end{cases}}', ''],
        ['lm-vielfaches', '{\\begin{cases}2x-y=3\\\\-4x+2y=-6\\end{cases}}', ''],
        ['lm-parallel', '{\\begin{cases}2x-y=3\\\\-4x+2y=5\\end{cases}}', ''],
        ['lm-gleiche', '{\\begin{cases}x+2y=5\\\\x+2y=5\\end{cases}}', ''],
        ['lm-homogen', '{\\begin{cases}x+2y=0\\\\3x-y=0\\end{cases}}', ''],
        ['lm-homogen-viele', '{\\begin{cases}x+2y=0\\\\2x+4y=0\\end{cases}}', ''],
        ['lm-eine-b', '{\\begin{cases}3x-2y=4\\\\x+y=3\\end{cases}}', ''],
        ['lm-negativ', '{\\begin{cases}x+y=10\\\\2x+5y=11\\end{cases}}', ''],
        ['lm-a-gleich-vier', '{\\begin{cases}x+2y=3\\\\2x+4y=5\\end{cases}}', ''],
        ['lm-drei-eine', '{\\begin{cases}x+y+z=3\\\\x-y+z=1\\\\x+y-z=1\\end{cases}}', ''],
        ['lm-drei-punkt', '{\\begin{cases}x+2y+3z=14\\\\y+2z=8\\\\x+y+2z=9\\end{cases}}', ''],
        ['lm-zwei-drei', '{\\begin{cases}x+y+z=6\\\\x-y+z=2\\end{cases}}', ''],
        ['lm-drei-keine', '{\\begin{cases}x+y+z=3\\\\x+y+z=5\\\\x-y=0\\end{cases}}', ''],
        ['lm-drei-viele', '{\\begin{cases}x+y+z=3\\\\2x+2y+2z=6\\\\x-y=0\\end{cases}}', ''],
        ['lm-drei-homogen', '{\\begin{cases}x+y+z=0\\\\x-y+2z=0\\\\2x+3z=0\\end{cases}}', ''],
        ['lm-prisma', '{\\begin{cases}x+y=2\\\\y+z=2\\\\x+2y+z=5\\end{cases}}', ''],
        ['lm-drei-viele-b', '{\\begin{cases}x+2y-z=1\\\\2x+4y-2z=2\\\\y+z=3\\end{cases}}', ''],
        ['lm-nuss', '{\\begin{cases}x+y+z=6\\\\x+2y+3z=14\\\\2x+3y+4z=20\\end{cases}}', ''],
    );
    BLOECKE.push({ titel: 'Lösungsmengen · keine, eine, unendlich viele', ab, bis: AUFGABEN.length, kw: 12, kopf: 'LGS lösen' });
    Object.assign(LOESUNGEN, {
        'lm-eine': [['\\left(\\begin{array}{cc|c}1&1&4\\\\1&-1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&4\\\\0&-2&-2\\end{array}\\right)', '\\text{II}-\\text{I}'], ['x=3\\quad y=1', '\\text{rückwärts einsetzen}']],
        'lm-keine': [['\\left(\\begin{array}{cc|c}1&1&4\\\\1&1&9\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&4\\\\0&0&5\\end{array}\\right)', '\\text{II}-\\text{I}'], ['L=\\{\\}', '\\text{Widerspruch}']],
        'lm-viele': [['\\left(\\begin{array}{cc|c}1&1&4\\\\2&2&8\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&4\\\\0&0&0\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'], ['x=4 - t\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'lm-vielfaches': [['\\left(\\begin{array}{cc|c}2&-1&3\\\\-4&2&-6\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}2&-1&3\\\\0&0&0\\end{array}\\right)', '\\text{II}+2\\cdot\\text{I}'], ['x=\\frac{t}{2} + \\frac{3}{2}\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'lm-parallel': [['\\left(\\begin{array}{cc|c}2&-1&3\\\\-4&2&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}2&-1&3\\\\0&0&11\\end{array}\\right)', '\\text{II}+2\\cdot\\text{I}'], ['L=\\{\\}', '\\text{Widerspruch}']],
        'lm-gleiche': [['\\left(\\begin{array}{cc|c}1&2&5\\\\1&2&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&2&5\\\\0&0&0\\end{array}\\right)', '\\text{II}-\\text{I}'], ['x=5 - 2 t\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'lm-homogen': [['\\left(\\begin{array}{cc|c}1&2&0\\\\3&-1&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&2&0\\\\0&-7&0\\end{array}\\right)', '\\text{II}-3\\cdot\\text{I}'], ['x=0\\quad y=0', '\\text{rückwärts einsetzen}']],
        'lm-homogen-viele': [['\\left(\\begin{array}{cc|c}1&2&0\\\\2&4&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&2&0\\\\0&0&0\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'], ['x=- 2 t\\quad y=t', '\\text{Nullzeile, Parameter }t']],
        'lm-eine-b': [['\\left(\\begin{array}{cc|c}3&-2&4\\\\1&1&3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}3&-2&4\\\\0&5&5\\end{array}\\right)', '3\\cdot\\text{II}-\\text{I}'], ['x=2\\quad y=1', '\\text{rückwärts einsetzen}']],
        'lm-negativ': [['\\left(\\begin{array}{cc|c}1&1&10\\\\2&5&11\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&10\\\\0&3&-9\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'], ['x=13\\quad y=-3', '\\text{rückwärts einsetzen}']],
        'lm-a-gleich-vier': [['\\left(\\begin{array}{cc|c}1&2&3\\\\2&4&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&2&3\\\\0&0&-1\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'], ['L=\\{\\}', '\\text{Widerspruch}']],
        'lm-drei-eine': [['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\1&-1&1&1\\\\1&1&-1&1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\0&-2&0&-2\\\\0&0&-2&-2\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-\\text{I}'], ['x=1\\quad y=1\\quad z=1', '\\text{rückwärts einsetzen}']],
        'lm-drei-punkt': [['\\left(\\begin{array}{ccc|c}1&2&3&14\\\\0&1&2&8\\\\1&1&2&9\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&2&3&14\\\\0&1&2&8\\\\0&-1&-1&-5\\end{array}\\right)', '\\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&2&3&14\\\\0&1&2&8\\\\0&0&1&3\\end{array}\\right)', '\\text{III}+\\text{II}'], ['x=1\\quad y=2\\quad z=3', '\\text{rückwärts einsetzen}']],
        'lm-zwei-drei': [['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\1&-1&1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&-2&0&-4\\end{array}\\right)', '\\text{II}-\\text{I}'], ['x=4 - t\\quad y=2\\quad z=t', '\\text{Nullzeile, Parameter }t']],
        'lm-drei-keine': [['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\1&1&1&5\\\\1&-1&0&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\0&0&0&2\\\\0&-2&-1&-3\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-\\text{I}'], ['L=\\{\\}', '\\text{Widerspruch}']],
        'lm-drei-viele': [['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\2&2&2&6\\\\1&-1&0&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&3\\\\0&0&0&0\\\\0&-2&-1&-3\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-\\text{I}'], ['x=\\frac{3}{2} - \\frac{t}{2}\\quad y=\\frac{3}{2} - \\frac{t}{2}\\quad z=t', '\\text{Nullzeile, Parameter }t']],
        'lm-drei-homogen': [['\\left(\\begin{array}{ccc|c}1&1&1&0\\\\1&-1&2&0\\\\2&0&3&0\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&0\\\\0&-2&1&0\\\\0&-2&1&0\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-2\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&0\\\\0&-2&1&0\\\\0&0&0&0\\end{array}\\right)', '\\text{III}-\\text{II}'], ['x=- \\frac{3 t}{2}\\quad y=\\frac{t}{2}\\quad z=t', '\\text{Nullzeile, Parameter }t']],
        'lm-prisma': [['\\left(\\begin{array}{ccc|c}1&1&0&2\\\\0&1&1&2\\\\1&2&1&5\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&0&2\\\\0&1&1&2\\\\0&1&1&3\\end{array}\\right)', '\\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&0&2\\\\0&1&1&2\\\\0&0&0&1\\end{array}\\right)', '\\text{III}-\\text{II}'], ['L=\\{\\}', '\\text{Widerspruch}']],
        'lm-drei-viele-b': [['\\left(\\begin{array}{ccc|c}1&2&-1&1\\\\2&4&-2&2\\\\0&1&1&3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&2&-1&1\\\\0&0&0&0\\\\0&1&1&3\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I}'], ['x=3 t - 5\\quad y=3 - t\\quad z=t', '\\text{Nullzeile, Parameter }t']],
        'lm-nuss': [['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\1&2&3&14\\\\2&3&4&20\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&1&2&8\\\\0&1&2&8\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-2\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&1&2&8\\\\0&0&0&0\\end{array}\\right)', '\\text{III}-\\text{II}'], ['x=t - 2\\quad y=8 - 2 t\\quad z=t', '\\text{Nullzeile, Parameter }t']],
    });
    Object.assign(ERKLAERUNGEN, {
        'lm-keine':
            'Die zweite Zeile wird $0x+0y=5$, also $0=5$ – ein Widerspruch. Kein Paar $(x\\mid y)$ erfüllt beide Gleichungen.' +
            '\n\nGeometrisch: zwei parallele Geraden, $y=4-x$ und $y=9-x$. Sie schneiden sich nie.',
        'lm-viele':
            'Die zweite Gleichung ist das Doppelte der ersten und sagt nichts Neues: es bleibt $0=0$.' +
            '\n\nEine Unbekannte ist frei: $y=t$, dann $x=4-t$. Für jedes $t$ eine Lösung – zum Beispiel $t=1$: $(3\\mid 1)$.',
        'lm-negativ':
            'Rechnerisch eindeutig: $x=13$, $y=-3$. Beim Mischen hieße das $-3$ Liter der zweiten Sorte – das geht nicht.' +
            '\n\nDie Mischung ist mit diesen Sorten nicht herstellbar. Die Rechnung stimmt, das Modell nicht.',
        'lm-nuss':
            'Die dritte Gleichung ist die Summe der ersten beiden: $(x+y+z)+(x+2y+3z)=2x+3y+4z$ und $6+14=20$.' +
            '\n\nSie bringt nichts Neues, darum die Nullzeile. Drei Ebenen, die sich in einer Geraden schneiden – unendlich viele Punkte.',
    });
})();
