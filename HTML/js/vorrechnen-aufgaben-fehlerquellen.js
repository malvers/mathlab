// Block "Fehlerquellen · richtig gerechnet" - week 20 of 2027, Mathe BGY 11, the plan's "Auswertung + Übung" after
// Klassenarbeit 3 (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). The week's quiz
// (mathetest11-fehlerquellen.html) shows twenty classic mistakes; at the board each is done right: (a+b)² with its
// middle term, √(a²+b²), the minus before a bracket, x² = 5x without dividing by x, (a+b)/a, 20 % off and 20 % on,
// the product rule of the logarithm, 2³·2⁴, √(x²), √x = -2, x² = 16 with both solutions, the slope, (2x)³, a
// probability above 1, sin 2x - and the nut: cancelling factors, not summands. The task's sentence names the mistake
// (aufgabenTexte). Every step checked with sympy (the same solutions, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['fq-klammer',      '-3(x-2)',                                    ''],
        ['fq-potenz',       '2^3\\cdot 2^4',                              ''],
        ['fq-hoch-drei',    '(2x)^3',                                     ''],
        ['fq-binom',        '(a+b)^2',                                    ''],
        ['fq-wurzel',       '\\sqrt{3^2+4^2}',                            ''],
        ['fq-betrag',       '\\sqrt{(-3)^2}',                             ''],
        ['fq-zwei',         'x^2=16',                                     'x'],
        ['fq-anstieg',      'm=\\frac{7-1}{4-1}',                         'm'],
        ['fq-bruch',        '\\frac{a+b}{a}',                             ''],
        ['fq-rabatt',       '100\\cdot 0{,}8\\cdot 1{,}2',                ''],
        ['fq-prozent',      '\\frac{96-100}{100}\\cdot 100',              ''],
        ['fq-definition',   'x-3=0',                                      'x'],
        ['fq-wahrscheinlichkeit', '0{,}7+0{,}5-0{,}4',                    ''],
        ['fq-log',          '\\log_{10} 2+\\log_{10} 5',                  ''],
        ['fq-teilen',       'x^2=5x',                                     'x'],
        ['fq-quadrieren',   '\\sqrt{x}=-2',                               'x'],
        ['fq-runden',       '\\frac{139}{40}',                            ''],
        ['fq-sinus',        '\\sin\\left(2\\cdot\\frac{\\pi}{2}\\right)-2\\sin\\frac{\\pi}{2}', ''],
        ['fq-halbwert',     '0{,}9^t=0{,}5',                              't'],
        ['fq-nuss',         '\\frac{x^2-9}{x-3}',                         ''],
    );
    wochenBlock('fehlerquellen', ab, { kopf: 'richtig rechnen' });
    Object.assign(LOESUNGEN, {
        'fq-klammer':       [['=-3x+6', '\\text{ausmultiplizieren}']],
        'fq-potenz':        [['=2^{3+4}', '\\text{Potenzgesetz}'], ['=2^7', '\\text{ausrechnen}'], ['=128', '\\text{ausrechnen}']],
        'fq-hoch-drei':     [['=2^3\\cdot x^3', '\\text{Potenzgesetz}'], ['=8x^3', '\\text{ausrechnen}']],
        'fq-binom':         [['=a^2+2ab+b^2', '\\text{binomische Formel}']],
        'fq-wurzel':        [['=\\sqrt{9+16}', '\\text{quadrieren}'], ['=\\sqrt{25}', '\\text{addieren}'], ['=5', '\\text{Wurzel ziehen}']],
        'fq-betrag':        [['=\\sqrt{9}', '\\text{quadrieren}'], ['=3', '\\text{Wurzel ziehen}']],
        'fq-zwei':          [['x_1=4\\quad x_2=-4', '\\sqrt{\\;}']],
        'fq-anstieg':       [['m=\\frac{6}{3}', '\\text{ausrechnen}'], ['m=2', '\\text{kürzen}']],
        'fq-bruch':         [['=\\frac{a}{a}+\\frac{b}{a}', '\\text{Bruch aufteilen}'], ['=1+\\frac{b}{a}', '\\text{kürzen}']],
        'fq-rabatt':        [['=80\\cdot 1{,}2', '\\text{ausrechnen}'], ['=96', '\\text{ausrechnen}']],
        'fq-prozent':       [['=\\frac{-4}{100}\\cdot 100', '\\text{ausrechnen}'], ['=-4', '\\text{kürzen}']],
        'fq-definition':    [['x=3', '+3']],
        'fq-wahrscheinlichkeit': [['=0{,}8', '\\text{ausrechnen}']],
        'fq-log':           [['=\\log_{10}(2\\cdot 5)', '\\text{Produktregel}'], ['=\\log_{10} 10', '\\text{ausrechnen}'], ['=1', '\\text{Logarithmus}']],
        'fq-teilen':        [['x^2-5x=0', '-5x'], ['x(x-5)=0', '\\text{ausklammern}'], ['x_1=0\\quad x_2=5', '\\text{Nullprodukt}']],
        'fq-quadrieren':    [['L=\\{\\}', '\\sqrt{x}\\ge 0']],
        'fq-runden':        [['=3{,}475', '\\text{ausrechnen}']],
        'fq-sinus':         [['=\\sin\\pi-2\\sin\\frac{\\pi}{2}', '\\text{ausrechnen}'], ['=0-2\\cdot 1', '\\text{Einheitskreis}'], ['=-2', '\\text{ausrechnen}']],
        'fq-halbwert':      [['t=\\frac{\\ln 0{,}5}{\\ln 0{,}9}', '\\ln,\\ \\text{Potenzregel}'], ['t\\approx 6{,}58', '\\text{Taschenrechner}']],
        'fq-nuss':          [['=\\frac{(x-3)(x+3)}{x-3}', '\\text{3. binomische Formel}'], ['=x+3', '\\text{kürzen},\\ x\\ne 3']],
    });
    Object.assign(ERKLAERUNGEN, {
        'fq-rabatt':
            'Die $20\\,\\%$ Aufschlag beziehen sich auf den reduzierten Preis, nicht auf den alten: $80\\cdot 1{,}2=96$.' +
            '\n\nAm Ende fehlen $4\\,\\%$: $0{,}8\\cdot 1{,}2=0{,}96$. Prozente addiert man nicht – man multipliziert ihre Faktoren.',
        'fq-teilen':
            'Wer durch $x$ teilt, bekommt $x=5$ und verliert die Lösung $x=0$. Durch eine Unbekannte teilt man nur, wenn sie sicher nicht $0$ ist.' +
            '\n\nSicher ist: alles auf eine Seite, ausklammern, Nullprodukt.',
        'fq-nuss':
            'Aus Summen kürzt man nicht: $\\frac{x^2-9}{x-3}$ ist nicht $x-3$ und nicht $x+3$ „durch Wegstreichen“.' +
            '\n\nErst faktorisieren, dann den gemeinsamen Faktor kürzen. Für $x=3$ ist der Term nicht definiert – das bleibt auch nach dem Kürzen so.',
    });
    aufgabenTexte({
        'fq-klammer':       'Fehler: $-3(x-2)=-3x-6$. Richtig ausmultiplizieren.',
        'fq-potenz':        'Fehler: $2^3\\cdot 2^4=2^{12}$. Exponenten werden addiert, nicht multipliziert.',
        'fq-hoch-drei':     'Fehler: $(2x)^3=2x^3$. Auch die $2$ wird potenziert.',
        'fq-binom':         'Fehler: $(a+b)^2=a^2+b^2$. Das gemischte Glied fehlt.',
        'fq-wurzel':        'Fehler: $\\sqrt{a^2+b^2}=a+b$. Mit $a=3$ und $b=4$ nachrechnen – es kommt nicht $7$ heraus.',
        'fq-betrag':        'Fehler: $\\sqrt{x^2}=x$ für alle $x$. Mit $x=-3$ nachrechnen.',
        'fq-zwei':          'Fehler: „$x^2=16$, also $x=4$“. Es gibt zwei Lösungen.',
        'fq-anstieg':       'Fehler: Anstieg $=\\frac{x_2-x_1}{y_2-y_1}$. Richtig für die Punkte $(1\\mid 1)$ und $(4\\mid 7)$: die $y$-Differenz steht oben.',
        'fq-bruch':         'Fehler: $\\frac{a+b}{a}=b$. Aus einer Summe wird nicht gekürzt.',
        'fq-rabatt':        'Fehler: „$20\\,\\%$ Rabatt, dann $20\\,\\%$ Aufschlag ergibt den alten Preis“. Mit $100$ € nachrechnen.',
        'fq-prozent':       'Der Preis ist von $100$ € auf $96$ € gefallen. Um wie viel Prozent?',
        'fq-definition':    'Fehler: „$f(x)=\\frac{1}{x-3}$ ist überall definiert“. Für welches $x$ wird der Nenner $0$?',
        'fq-wahrscheinlichkeit': 'Fehler: $P(A\\cup B)=0{,}7+0{,}5=1{,}2$. Eine Wahrscheinlichkeit ist höchstens $1$ – der doppelt gezählte Teil $P(A\\cap B)=0{,}4$ muss ab.',
        'fq-log':           'Fehler: $\\log(a+b)=\\log a+\\log b$. Richtig ist die Regel für das Produkt.',
        'fq-teilen':        'Fehler: bei $x^2=5x$ beide Seiten durch $x$ teilen. Richtig lösen.',
        'fq-quadrieren':    'Fehler: $\\sqrt{x}=-2$ durch Quadrieren zu $x=4$ lösen. Probe: $\\sqrt{4}=2$, nicht $-2$.',
        'fq-runden':        'Fehler: „Ergebnis: $3{,}47512$ Personen“. Auf $139$ Anmeldungen kommen $40$ Plätze je Bus – wie viele Busse?',
        'fq-sinus':         'Fehler: $\\sin(2x)=2\\sin x$. Mit $x=\\frac{\\pi}{2}$ die Differenz ausrechnen – sie ist nicht $0$.',
        'fq-halbwert':      'Ein Stoff zerfällt mit dem Faktor $0{,}9$ pro Tag. Wann ist die Hälfte übrig? (Fehler: beim Teilen durch $\\ln 0{,}9$ nichts „umdrehen“ – es ist eine Gleichung.)',
        'fq-nuss':          'Fehler: in $\\frac{x^2-9}{x-3}$ das $x$ und die $3$ „wegkürzen“. Richtig vereinfachen.',
    });
})();
