// Block "Gauß-Verfahren · LGS ohne Hilfsmittel" - week 11 of 2027, Mathe BGY 11, the plan's "LGS mit 3 Gleichungen und
// 3 Unbekannten ohne Hilfsmittel: Gauß-Verfahren" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ...
// immer an den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min").
// Twenty systems, easy to hard, after the week's quiz (mathetest11-gauss.html): 2x2 first (x + y = 5, x - y = 1; the
// mixture x + y = 100, 3x + 5y = 380; the cinema, two lines), then 3x3 - already in steps, then by the Gauss method
// from the augmented matrix to the step form and back (tickets, three numbers, the parabola through three points),
// the nut with larger numbers. Every system and every step generated and checked with sympy (the same solutions as
// the task), every formula with KaTeX. A system is written "{\begin{cases}..\end{cases}}" - the braces keep its "="
// out of the board's "=" column.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['ga-plus', '{\\begin{cases}x+y=5\\\\x-y=1\\end{cases}}', ''],
        ['ga-zwei', '{\\begin{cases}2x+y=8\\\\x-y=1\\end{cases}}', ''],
        ['ga-einsetzen', '{\\begin{cases}3x+2y=12\\\\x=2\\end{cases}}', ''],
        ['ga-zahlen', '{\\begin{cases}x+y=20\\\\x-y=4\\end{cases}}', ''],
        ['ga-kino', '{\\begin{cases}2x+3y=31\\\\x+2y=18\\end{cases}}', ''],
        ['ga-geraden', '{\\begin{cases}x+y=5\\\\-2x+y=-1\\end{cases}}', ''],
        ['ga-mischung', '{\\begin{cases}x+y=100\\\\3x+5y=380\\end{cases}}', ''],
        ['ga-krumm', '{\\begin{cases}3x+4y=10\\\\2x-3y=1\\end{cases}}', ''],
        ['ga-stufe', '{\\begin{cases}x+y+z=6\\\\y+z=5\\\\z=3\\end{cases}}', ''],
        ['ga-stufe-zwei', '{\\begin{cases}x+2y-z=3\\\\y+2z=8\\\\2z=6\\end{cases}}', ''],
        ['ga-drei', '{\\begin{cases}x+y+z=6\\\\2x-y+z=3\\\\x+2y-z=2\\end{cases}}', ''],
        ['ga-drei-b', '{\\begin{cases}x+y+z=2\\\\x-y+2z=5\\\\2x+y-z=2\\end{cases}}', ''],
        ['ga-drei-c', '{\\begin{cases}x+2y+z=3\\\\2x-y+3z=13\\\\-x+y+z=-2\\end{cases}}', ''],
        ['ga-drei-d', '{\\begin{cases}x-y+z=7\\\\2x+y-z=-4\\\\3x+2y+z=3\\end{cases}}', ''],
        ['ga-eintritt', '{\\begin{cases}x+y+z=19\\\\2x+3y+z=39\\\\x+2y+2z=28\\end{cases}}', ''],
        ['ga-drei-zahlen', '{\\begin{cases}x+y+z=12\\\\x-y+z=4\\\\2x+y-z=2\\end{cases}}', ''],
        ['ga-parabel', '{\\begin{cases}x+y+z=2\\\\4x+2y+z=5\\\\x-y+z=2\\end{cases}}', ''],
        ['ga-halbe', '{\\begin{cases}2x+y+z=7\\\\x+2y+z=8\\\\x+y+2z=9\\end{cases}}', ''],
        ['ga-negativ', '{\\begin{cases}x+2y-z=-3\\\\2x-y+z=9\\\\x+y+z=4\\end{cases}}', ''],
        ['ga-nuss', '{\\begin{cases}x+4y-2z=7\\\\2x+y+3z=7\\\\3x-2y+z=-7\\end{cases}}', ''],
    );
    wochenBlock('gauss', ab, { kopf: 'LGS lösen' });
    Object.assign(LOESUNGEN, {
        'ga-plus': [['\\left(\\begin{array}{cc|c}1&1&5\\\\1&-1&1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&5\\\\0&-2&-4\\end{array}\\right)', '\\text{II}-\\text{I}'], ['x=3\\quad y=2', '\\text{rückwärts einsetzen}']],
        'ga-zwei': [['\\left(\\begin{array}{cc|c}2&1&8\\\\1&-1&1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}2&1&8\\\\0&-3&-6\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I}'], ['x=3\\quad y=2', '\\text{rückwärts einsetzen}']],
        'ga-einsetzen': [['\\left(\\begin{array}{cc|c}3&2&12\\\\1&0&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}3&2&12\\\\0&-2&-6\\end{array}\\right)', '3\\cdot\\text{II}-\\text{I}'], ['x=2\\quad y=3', '\\text{rückwärts einsetzen}']],
        'ga-zahlen': [['\\left(\\begin{array}{cc|c}1&1&20\\\\1&-1&4\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&20\\\\0&-2&-16\\end{array}\\right)', '\\text{II}-\\text{I}'], ['x=12\\quad y=8', '\\text{rückwärts einsetzen}']],
        'ga-kino': [['\\left(\\begin{array}{cc|c}2&3&31\\\\1&2&18\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}2&3&31\\\\0&1&5\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I}'], ['x=8\\quad y=5', '\\text{rückwärts einsetzen}']],
        'ga-geraden': [['\\left(\\begin{array}{cc|c}1&1&5\\\\-2&1&-1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&5\\\\0&3&9\\end{array}\\right)', '\\text{II}+2\\cdot\\text{I}'], ['x=2\\quad y=3', '\\text{rückwärts einsetzen}']],
        'ga-mischung': [['\\left(\\begin{array}{cc|c}1&1&100\\\\3&5&380\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}1&1&100\\\\0&2&80\\end{array}\\right)', '\\text{II}-3\\cdot\\text{I}'], ['x=60\\quad y=40', '\\text{rückwärts einsetzen}']],
        'ga-krumm': [['\\left(\\begin{array}{cc|c}3&4&10\\\\2&-3&1\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{cc|c}3&4&10\\\\0&-17&-17\\end{array}\\right)', '3\\cdot\\text{II}-2\\cdot\\text{I}'], ['x=2\\quad y=1', '\\text{rückwärts einsetzen}']],
        'ga-stufe': [['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&1&1&5\\\\0&0&1&3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['x=1\\quad y=2\\quad z=3', '\\text{rückwärts einsetzen}']],
        'ga-stufe-zwei': [['\\left(\\begin{array}{ccc|c}1&2&-1&3\\\\0&1&2&8\\\\0&0&2&6\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['x=2\\quad y=2\\quad z=3', '\\text{rückwärts einsetzen}']],
        'ga-drei': [['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\2&-1&1&3\\\\1&2&-1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&-3&-1&-9\\\\0&1&-2&-4\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&6\\\\0&-3&-1&-9\\\\0&0&-7&-21\\end{array}\\right)', '3\\cdot\\text{III}+\\text{II}'], ['x=1\\quad y=2\\quad z=3', '\\text{rückwärts einsetzen}']],
        'ga-drei-b': [['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\1&-1&2&5\\\\2&1&-1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-2&1&3\\\\0&-1&-3&-2\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-2\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-2&1&3\\\\0&0&-7&-7\\end{array}\\right)', '2\\cdot\\text{III}-\\text{II}'], ['x=2\\quad y=-1\\quad z=1', '\\text{rückwärts einsetzen}']],
        'ga-drei-c': [['\\left(\\begin{array}{ccc|c}1&2&1&3\\\\2&-1&3&13\\\\-1&1&1&-2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&2&1&3\\\\0&-5&1&7\\\\0&3&2&1\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}+\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&2&1&3\\\\0&-5&1&7\\\\0&0&13&26\\end{array}\\right)', '5\\cdot\\text{III}+3\\cdot\\text{II}'], ['x=3\\quad y=-1\\quad z=2', '\\text{rückwärts einsetzen}']],
        'ga-drei-d': [['\\left(\\begin{array}{ccc|c}1&-1&1&7\\\\2&1&-1&-4\\\\3&2&1&3\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&-1&1&7\\\\0&3&-3&-18\\\\0&5&-2&-18\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-3\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&-1&1&7\\\\0&3&-3&-18\\\\0&0&9&36\\end{array}\\right)', '3\\cdot\\text{III}-5\\cdot\\text{II}'], ['x=1\\quad y=-2\\quad z=4', '\\text{rückwärts einsetzen}']],
        'ga-eintritt': [['\\left(\\begin{array}{ccc|c}1&1&1&19\\\\2&3&1&39\\\\1&2&2&28\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&19\\\\0&1&-1&1\\\\0&1&1&9\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&19\\\\0&1&-1&1\\\\0&0&2&8\\end{array}\\right)', '\\text{III}-\\text{II}'], ['x=10\\quad y=5\\quad z=4', '\\text{rückwärts einsetzen}']],
        'ga-drei-zahlen': [['\\left(\\begin{array}{ccc|c}1&1&1&12\\\\1&-1&1&4\\\\2&1&-1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&12\\\\0&-2&0&-8\\\\0&-1&-3&-22\\end{array}\\right)', '\\text{II}-\\text{I},\\ \\text{III}-2\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&12\\\\0&-2&0&-8\\\\0&0&-6&-36\\end{array}\\right)', '2\\cdot\\text{III}-\\text{II}'], ['x=2\\quad y=4\\quad z=6', '\\text{rückwärts einsetzen}']],
        'ga-parabel': [['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\4&2&1&5\\\\1&-1&1&2\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-2&-3&-3\\\\0&-2&0&0\\end{array}\\right)', '\\text{II}-4\\cdot\\text{I},\\ \\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&1&1&2\\\\0&-2&-3&-3\\\\0&0&3&3\\end{array}\\right)', '\\text{III}-\\text{II}'], ['x=1\\quad y=0\\quad z=1', '\\text{rückwärts einsetzen}']],
        'ga-halbe': [['\\left(\\begin{array}{ccc|c}2&1&1&7\\\\1&2&1&8\\\\1&1&2&9\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}2&1&1&7\\\\0&3&1&9\\\\0&1&3&11\\end{array}\\right)', '2\\cdot\\text{II}-\\text{I},\\ 2\\cdot\\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}2&1&1&7\\\\0&3&1&9\\\\0&0&8&24\\end{array}\\right)', '3\\cdot\\text{III}-\\text{II}'], ['x=1\\quad y=2\\quad z=3', '\\text{rückwärts einsetzen}']],
        'ga-negativ': [['\\left(\\begin{array}{ccc|c}1&2&-1&-3\\\\2&-1&1&9\\\\1&1&1&4\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&2&-1&-3\\\\0&-5&3&15\\\\0&-1&2&7\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&2&-1&-3\\\\0&-5&3&15\\\\0&0&7&20\\end{array}\\right)', '5\\cdot\\text{III}-\\text{II}'], ['x=\\frac{17}{7}\\quad y=- \\frac{9}{7}\\quad z=\\frac{20}{7}', '\\text{rückwärts einsetzen}']],
        'ga-nuss': [['\\left(\\begin{array}{ccc|c}1&4&-2&7\\\\2&1&3&7\\\\3&-2&1&-7\\end{array}\\right)', '\\text{Koeffizientenmatrix}'], ['\\left(\\begin{array}{ccc|c}1&4&-2&7\\\\0&-7&7&-7\\\\0&-14&7&-28\\end{array}\\right)', '\\text{II}-2\\cdot\\text{I},\\ \\text{III}-3\\cdot\\text{I}'], ['\\left(\\begin{array}{ccc|c}1&4&-2&7\\\\0&-7&7&-7\\\\0&0&-7&-14\\end{array}\\right)', '\\text{III}-2\\cdot\\text{II}'], ['x=-1\\quad y=3\\quad z=2', '\\text{rückwärts einsetzen}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'ga-mischung':
            'Zwei Sorten, zusammen $100$ kg: $x+y=100$. Die erste kostet $3$ €/kg, die zweite $5$ €/kg, zusammen $380$ €: $3x+5y=380$.' +
            '\n\nMinus dreimal die erste Zeile lässt nur $y$ übrig: $2y=80$. Also $40$ kg der teuren und $60$ kg der billigen Sorte.',
        'ga-drei':
            'Ziel ist die Stufenform: unten nur noch $z$, darüber $y$ und $z$. Dazu fällt $x$ aus der II. und III. Zeile heraus, dann $y$ aus der III.' +
            '\n\nDann rückwärts: $-7z=-21$ gibt $z=3$, eingesetzt in $-3y-z=-9$ gibt $y=2$, und oben $x=6-2-3=1$.' +
            '\n\nProbe in allen drei Gleichungen: $1+2+3=6$, $2-2+3=3$, $1+4-3=2$.',
        'ga-parabel':
            'Die Parabel $y=ax^2+bx+c$ durch $(1\\mid 2)$, $(2\\mid 5)$ und $(-1\\mid 2)$: jeder Punkt gibt eine Gleichung für $a$, $b$, $c$.' +
            '\n\nHier heißen die Unbekannten $x$, $y$, $z$ – gemeint sind $a$, $b$, $c$. Ergebnis $a=1$, $b=0$, $c=1$: die Parabel $y=x^2+1$.',
    });
})();
