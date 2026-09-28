// Block "Wurzeln · Stolperfallen" (Doc, 28.09.2026: "mach mal für Vorrechnen NEUE Aufgaben dieser
// Art (nicht heute einhängen)" - after the picture (√10+√10)/√10 = 2). Terms with roots that look like
// one thing and are another, easy to hard. Loaded right after vorrechnen-aufgaben.js by vorrechnen.html
// and decks/tafel.html (Doc, 28.09.: "einhängen"). No variable (third field ''): the head says
// "vereinfachen", the result is the solution's last step. The task has no "=", so it ends at the
// "=" axis and the steps ("= ...") start on it. The block is for week 41 (kw) - the lab opens it then.
// Every step was checked with sympy: it has exactly the value of the task. All formulas and
// operations render with the lab's KaTeX 0.16.8 (strict, no warnings).
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['w-drei',      '\\frac{\\sqrt{7}+\\sqrt{7}+\\sqrt{7}}{\\sqrt{7}}',            ''],
        ['w-halb',      '\\frac{\\sqrt{10}}{\\sqrt{10}+\\sqrt{10}}',                   ''],
        ['w-quadrat',   '(\\sqrt{3}+\\sqrt{3})^2',                                     ''],
        ['w-summe',     '\\sqrt{9+16}-\\sqrt{9}-\\sqrt{16}',                           ''],
        ['w-bruch',     '\\frac{\\sqrt{9}+\\sqrt{16}}{\\sqrt{9+16}}',                  ''],
        ['w-doppelt',   '\\sqrt{\\sqrt{81}}+\\sqrt{\\sqrt{16}}',                       ''],
        ['w-vier',      '\\frac{\\sqrt{2}+\\sqrt{2}+\\sqrt{2}+\\sqrt{2}}{\\sqrt{8}}',  ''],
        ['w-acht',      '\\frac{\\sqrt{8}+\\sqrt{2}}{\\sqrt{2}}',                      ''],
        ['w-minus',     '\\frac{\\sqrt{50}-\\sqrt{2}}{\\sqrt{2}}',                     ''],
        ['w-sieben',    '\\frac{\\sqrt{18}+\\sqrt{32}}{\\sqrt{2}}',                    ''],
        ['w-eins',      '\\frac{\\sqrt{27}+\\sqrt{12}}{\\sqrt{75}}',                   ''],
        ['w-gesetz',    '\\sqrt{12}\\cdot\\sqrt{3}-\\sqrt{12}:\\sqrt{3}',              ''],
        ['w-produkt',   '\\frac{\\sqrt{6}\\cdot\\sqrt{15}}{\\sqrt{10}}',               ''],
        ['w-potenz',    '\\frac{(\\sqrt{2})^6}{\\sqrt{2}\\cdot\\sqrt{8}}',             ''],
        ['w-binom',     '(\\sqrt{5}+\\sqrt{3})(\\sqrt{5}-\\sqrt{3})',                  ''],
        ['w-achtzehn',  '(\\sqrt{2}+\\sqrt{8})^2',                                     ''],
        ['w-kubik',     '\\frac{\\sqrt[3]{16}+\\sqrt[3]{2}}{\\sqrt[3]{2}}',            ''],
        ['w-nenner',    '\\frac{\\sqrt{10}\\cdot\\sqrt{10}}{\\sqrt{10}+\\sqrt{10}}',   ''],
        ['w-rational',  '\\frac{1}{\\sqrt{2}-1}-\\sqrt{2}',                            ''],
        ['w-nuss',      '\\frac{\\sqrt{3}+1}{\\sqrt{3}-1}',                            ''],
    );
    BLOECKE.push({ titel: 'Wurzeln · Stolperfallen', ab, bis: AUFGABEN.length, kw: 41 });
    Object.assign(LOESUNGEN, {
        'w-drei':      [['=\\frac{3\\sqrt{7}}{\\sqrt{7}}', '\\text{zusammenfassen}'], ['=3', '\\text{kürzen}']],
        'w-halb':      [['=\\frac{\\sqrt{10}}{2\\sqrt{10}}', '\\text{zusammenfassen}'], ['=\\frac{1}{2}', '\\text{kürzen}']],
        'w-quadrat':   [['=(2\\sqrt{3})^2', '\\text{zusammenfassen}'], ['=4\\cdot 3', '\\text{Potenzgesetz}'], ['=12', '\\text{ausrechnen}']],
        'w-summe':     [['=\\sqrt{25}-\\sqrt{9}-\\sqrt{16}', '\\text{zusammenfassen}'], ['=5-3-4', '\\text{Wurzel ziehen}'], ['=-2', '\\text{ausrechnen}']],
        'w-bruch':     [['=\\frac{\\sqrt{9}+\\sqrt{16}}{\\sqrt{25}}', '\\text{zusammenfassen}'], ['=\\frac{3+4}{5}', '\\text{Wurzel ziehen}'], ['=\\frac{7}{5}', '\\text{ausrechnen}']],
        'w-doppelt':   [['=\\sqrt{9}+\\sqrt{4}', '\\text{Wurzel ziehen}'], ['=3+2', '\\text{Wurzel ziehen}'], ['=5', '\\text{ausrechnen}']],
        'w-vier':      [['=\\frac{4\\sqrt{2}}{\\sqrt{8}}', '\\text{zusammenfassen}'], ['=\\frac{4\\sqrt{2}}{\\sqrt{4\\cdot 2}}', '\\text{zerlegen}'], ['=\\frac{4\\sqrt{2}}{\\sqrt{4}\\cdot\\sqrt{2}}', '\\text{Wurzelgesetz}'], ['=\\frac{4\\sqrt{2}}{2\\sqrt{2}}', '\\text{Wurzel ziehen}'], ['=2', '\\text{kürzen}']],
        'w-acht':      [['=\\frac{2\\sqrt{2}+\\sqrt{2}}{\\sqrt{2}}', '\\text{teilweise Wurzel ziehen}'], ['=\\frac{3\\sqrt{2}}{\\sqrt{2}}', '\\text{zusammenfassen}'], ['=3', '\\text{kürzen}']],
        'w-minus':     [['=\\frac{5\\sqrt{2}-\\sqrt{2}}{\\sqrt{2}}', '\\text{teilweise Wurzel ziehen}'], ['=\\frac{4\\sqrt{2}}{\\sqrt{2}}', '\\text{zusammenfassen}'], ['=4', '\\text{kürzen}']],
        'w-sieben':    [['=\\frac{3\\sqrt{2}+4\\sqrt{2}}{\\sqrt{2}}', '\\text{teilweise Wurzel ziehen}'], ['=\\frac{7\\sqrt{2}}{\\sqrt{2}}', '\\text{zusammenfassen}'], ['=7', '\\text{kürzen}']],
        'w-eins':      [['=\\frac{3\\sqrt{3}+2\\sqrt{3}}{5\\sqrt{3}}', '\\text{teilweise Wurzel ziehen}'], ['=\\frac{5\\sqrt{3}}{5\\sqrt{3}}', '\\text{zusammenfassen}'], ['=1', '\\text{kürzen}']],
        'w-gesetz':    [['=\\sqrt{36}-\\sqrt{4}', '\\text{Wurzelgesetz}'], ['=6-2', '\\text{Wurzel ziehen}'], ['=4', '\\text{ausrechnen}']],
        'w-produkt':   [['=\\sqrt{\\frac{6\\cdot 15}{10}}', '\\text{Wurzelgesetz}'], ['=\\sqrt{9}', '\\text{ausrechnen}'], ['=3', '\\text{Wurzel ziehen}']],
        'w-potenz':    [['=\\frac{8}{\\sqrt{2}\\cdot\\sqrt{8}}', '\\text{Potenzgesetz}'], ['=\\frac{8}{\\sqrt{16}}', '\\text{Wurzelgesetz}'], ['=\\frac{8}{4}', '\\text{Wurzel ziehen}'], ['=2', '\\text{kürzen}']],
        'w-binom':     [['=(\\sqrt{5})^2-(\\sqrt{3})^2', '\\text{binomische Formel}'], ['=5-3', '\\text{Wurzel ziehen}'], ['=2', '\\text{ausrechnen}']],
        'w-achtzehn':  [['=(\\sqrt{2}+2\\sqrt{2})^2', '\\text{teilweise Wurzel ziehen}'], ['=(3\\sqrt{2})^2', '\\text{zusammenfassen}'], ['=9\\cdot 2', '\\text{Potenzgesetz}'], ['=18', '\\text{ausrechnen}']],
        'w-kubik':     [['=\\frac{2\\sqrt[3]{2}+\\sqrt[3]{2}}{\\sqrt[3]{2}}', '\\text{teilweise Wurzel ziehen}'], ['=\\frac{3\\sqrt[3]{2}}{\\sqrt[3]{2}}', '\\text{zusammenfassen}'], ['=3', '\\text{kürzen}']],
        'w-nenner':    [['=\\frac{10}{2\\sqrt{10}}', '\\text{zusammenfassen}'], ['=\\frac{5}{\\sqrt{10}}', '\\text{kürzen}'], ['=\\frac{5\\sqrt{10}}{10}', '\\text{erweitern mit }\\sqrt{10}'], ['=\\frac{\\sqrt{10}}{2}', '\\text{kürzen}']],
        'w-rational':  [['=\\frac{\\sqrt{2}+1}{(\\sqrt{2}-1)(\\sqrt{2}+1)}-\\sqrt{2}', '\\text{erweitern mit }(\\sqrt{2}+1)'], ['=\\frac{\\sqrt{2}+1}{2-1}-\\sqrt{2}', '\\text{binomische Formel}'], ['=\\sqrt{2}+1-\\sqrt{2}', '\\text{ausrechnen}'], ['=1', '\\text{zusammenfassen}']],
        'w-nuss':      [['=\\frac{(\\sqrt{3}+1)^2}{(\\sqrt{3}-1)(\\sqrt{3}+1)}', '\\text{erweitern mit }(\\sqrt{3}+1)'], ['=\\frac{3+2\\sqrt{3}+1}{3-1}', '\\text{binomische Formel}'], ['=\\frac{4+2\\sqrt{3}}{2}', '\\text{zusammenfassen}'], ['=2+\\sqrt{3}', '\\text{kürzen}']],
    });
})();
