// Block "Kopfrechnen · Tricks" (Doc, 30.09.2026: "bau mal in Vorrechnen ein" - after the picture
// (81² - 81)/90; then "im Pinterest gibt es viele solche Aufgaben ... schau mal bitte"). Terms that are hard
// the calculator's way and quick with the right idea - ausklammern, binomische Formeln, Potenzgesetze -
// easy to hard, in the style of those "ohne Taschenrechner" pictures (Pinterest itself shows nothing without
// a login; the tasks are the well-known kinds, the painting's one with its source). Loaded last by
// vorrechnen.html and decks/tafel.html, so the stored task index of the blocks before it stays where it was.
// No variable (third field ''): the head says the block's kopf, the result is the solution's last step. The
// task has no "=", so the first step stands beside it on its line, the next ones under it on the "=" column.
// Every step checked in Python with exact integers: it has exactly the value of the task. All formulas and
// operations render with the lab's KaTeX 0.16.8 (strict, no warnings).
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['t-25mal',       '25\\cdot 48',                                          ''],
        ['t-99mal',       '99\\cdot 101',                                         ''],
        ['t-quadrate',    '51^2-49^2',                                            ''],
        ['t-99quadrat',   '99^2',                                                 ''],
        ['t-zwanzig',     '\\frac{21^2-21}{42}',                                  ''],
        ['t-ausklammern', '\\frac{81^2-81}{90}',                                  ''],
        ['t-gemaelde',    '\\frac{10^2+11^2+12^2+13^2+14^2}{365}',                ''],
        ['t-hoch10',      '\\frac{2^{10}+2^{10}}{2^{11}}',                        ''],
        ['t-zehner',      '\\frac{2^{10}\\cdot 5^{10}}{10^9}',                    ''],
        ['t-1001',        '\\frac{1001^2-999^2}{4}',                              ''],
        ['t-fuenf',       '\\frac{5^6-5^4}{24}',                                  ''],
        ['t-jahr',        '\\frac{2^{2026}-2^{2025}}{2^{2024}}',                  ''],
        ['t-333',         '\\sqrt{111111-222}',                                   ''],
    );
    BLOECKE.push({ titel: 'Kopfrechnen · Tricks', ab, bis: AUFGABEN.length, kopf: 'ohne Taschenrechner' });
    Object.assign(LOESUNGEN, {
        't-25mal':       [['=25\\cdot 4\\cdot 12', '\\text{zerlegen}'],
                          ['=100\\cdot 12', '\\text{ausrechnen}'],
                          ['=1200', '\\text{ausrechnen}']],
        't-99mal':       [['=(100-1)\\cdot(100+1)', '\\text{zerlegen}'],
                          ['=100^2-1^2', '\\text{binomische Formel}'],
                          ['=10000-1', '\\text{ausrechnen}'],
                          ['=9999', '\\text{ausrechnen}']],
        't-quadrate':    [['=(51+49)\\cdot(51-49)', '\\text{binomische Formel}'],
                          ['=100\\cdot 2', '\\text{ausrechnen}'],
                          ['=200', '\\text{ausrechnen}']],
        't-99quadrat':   [['=(100-1)^2', '\\text{zerlegen}'],
                          ['=100^2-2\\cdot 100+1', '\\text{binomische Formel}'],
                          ['=10000-200+1', '\\text{ausrechnen}'],
                          ['=9801', '\\text{ausrechnen}']],
        't-zwanzig':     [['=\\frac{21\\cdot 21-21}{42}', '\\text{Potenz ausschreiben}'],
                          ['=\\frac{21\\cdot(21-1)}{42}', '\\text{ausklammern}'],
                          ['=\\frac{21\\cdot 20}{42}', '\\text{ausrechnen}'],
                          ['=\\frac{20}{2}', '\\text{kürzen mit }21'],
                          ['=10', '\\text{ausrechnen}']],
        't-ausklammern': [['=\\frac{81\\cdot 81-81}{90}', '\\text{Potenz ausschreiben}'],
                          ['=\\frac{81\\cdot(81-1)}{90}', '\\text{ausklammern}'],
                          ['=\\frac{81\\cdot 80}{90}', '\\text{ausrechnen}'],
                          ['=\\frac{81\\cdot 8}{9}', '\\text{kürzen mit }10'],
                          ['=9\\cdot 8', '\\text{kürzen mit }9'],
                          ['=72', '\\text{ausrechnen}']],
        't-gemaelde':    [['=\\frac{100+121+144+169+196}{365}', '\\text{ausrechnen}'],
                          ['=\\frac{365+365}{365}', '\\text{zusammenfassen}'],
                          ['=\\frac{2\\cdot 365}{365}', '\\text{zusammenfassen}'],
                          ['=2', '\\text{kürzen}']],
        't-hoch10':      [['=\\frac{2\\cdot 2^{10}}{2^{11}}', '\\text{zusammenfassen}'],
                          ['=\\frac{2^{11}}{2^{11}}', '\\text{Potenzgesetz}'],
                          ['=1', '\\text{kürzen}']],
        't-zehner':      [['=\\frac{(2\\cdot 5)^{10}}{10^9}', '\\text{Potenzgesetz}'],
                          ['=\\frac{10^{10}}{10^9}', '\\text{ausrechnen}'],
                          ['=10', '\\text{Potenzgesetz}']],
        't-1001':        [['=\\frac{(1001+999)\\cdot(1001-999)}{4}', '\\text{binomische Formel}'],
                          ['=\\frac{2000\\cdot 2}{4}', '\\text{ausrechnen}'],
                          ['=1000', '\\text{kürzen}']],
        't-fuenf':       [['=\\frac{5^4\\cdot 5^2-5^4}{24}', '\\text{Potenzgesetz}'],
                          ['=\\frac{5^4\\cdot(5^2-1)}{24}', '\\text{ausklammern}'],
                          ['=\\frac{5^4\\cdot 24}{24}', '\\text{ausrechnen}'],
                          ['=5^4', '\\text{kürzen}'],
                          ['=625', '\\text{ausrechnen}']],
        't-jahr':        [['=\\frac{2^{2025}\\cdot 2-2^{2025}}{2^{2024}}', '\\text{Potenzgesetz}'],
                          ['=\\frac{2^{2025}\\cdot(2-1)}{2^{2024}}', '\\text{ausklammern}'],
                          ['=\\frac{2^{2025}}{2^{2024}}', '\\text{ausrechnen}'],
                          ['=2', '\\text{Potenzgesetz}']],
        't-333':         [['=\\sqrt{111\\cdot 1001-111\\cdot 2}', '\\text{zerlegen}'],
                          ['=\\sqrt{111\\cdot(1001-2)}', '\\text{ausklammern}'],
                          ['=\\sqrt{111\\cdot 999}', '\\text{ausrechnen}'],
                          ['=\\sqrt{111\\cdot 9\\cdot 111}', '\\text{zerlegen}'],
                          ['=\\sqrt{9\\cdot 111^2}', '\\text{zusammenfassen}'],
                          ['=3\\cdot 111', '\\text{Wurzel ziehen}'],
                          ['=333', '\\text{ausrechnen}']],
    });
    // the painting (checked 30.09.2026: WikiArt, the Tretyakov Gallery's own title "Mental Arithmetic. In the Public
    // School of S. Rachinsky", 1895, the task on its blackboard)
    QUELLEN['t-gemaelde'] = 'Quelle: Nikolai Bogdanow-Belski, „Kopfrechnen. In der Volksschule von S. A. Ratschinski“, 1895, Tretjakow-Galerie Moskau';
    // the box behind the brain: single equations between text, so nothing for umformungenVorziehen to turn round
    Object.assign(ERKLAERUNGEN, {
        't-25mal':
            'Die 25 ist ein Viertel von 100, also $25\\cdot 4=100$. Darum die 48 als $4\\cdot 12$ schreiben:' +
            '$$25\\cdot 48=25\\cdot 4\\cdot 12=100\\cdot 12=1200$$',
        't-99mal':
            '99 und 101 liegen gleich weit neben der 100 – das ist die dritte binomische Formel' +
            '$$(a-b)\\cdot(a+b)=a^2-b^2$$' +
            'mit $a=100$ und $b=1$: $10000-1=9999$.',
        't-quadrate':
            'Zwei Quadrate voneinander abgezogen: die dritte binomische Formel rückwärts,' +
            '$$a^2-b^2=(a+b)\\cdot(a-b)$$' +
            'Hier ist $a+b=100$ und $a-b=2$ – fertig, ohne ein einziges Quadrat auszurechnen.',
        't-99quadrat':
            '99 ist $100-1$, und mit der zweiten binomischen Formel' +
            '$$(a-b)^2=a^2-2ab+b^2$$' +
            'wird daraus $10000-200+1=9801$.',
        't-zwanzig':
            'Die 21 steckt in beiden Teilen des Zählers – ausklammern:' +
            '$$21^2-21=21\\cdot(21-1)=21\\cdot 20$$' +
            'Der Nenner ist $42=21\\cdot 2$, die 21 kürzt sich weg: $\\frac{20}{2}=10$.',
        't-ausklammern':
            'Der lange Weg: $81^2=6561$, minus 81 gibt 6480, und das noch durch 90. Schneller: Die 81 steckt in ' +
            'beiden Teilen des Zählers – ausklammern:' +
            '$$81^2-81=81\\cdot 81-81\\cdot 1=81\\cdot(81-1)=81\\cdot 80$$' +
            'Jetzt kürzt sich fast alles weg: 80 und 90 mit 10, dann 81 und 9 mit 9:' +
            '$$\\frac{81\\cdot 80}{90}=\\frac{81\\cdot 8}{9}=9\\cdot 8=72$$' +
            'Allgemein: $a^2-a=a\\cdot(a-1)$ – das Produkt zweier aufeinanderfolgender Zahlen.',
        't-gemaelde':
            'Diese Aufgabe steht auf der Tafel in einem Gemälde von Nikolai Bogdanow-Belski (1895): Schüler einer ' +
            'Dorfschule rechnen sie im Kopf. Der Trick: Die ersten drei Quadrate ergeben zusammen genau 365,' +
            '$$100+121+144=365$$' +
            'und die letzten zwei auch:' +
            '$$169+196=365$$' +
            'Also $\\frac{2\\cdot 365}{365}=2$.',
        't-hoch10':
            'Zweimal dasselbe ist das Doppelte: $2^{10}+2^{10}=2\\cdot 2^{10}=2^{11}$ – und das durch $2^{11}$ ist 1.' +
            '\n\nDie Falle: $2^{10}+2^{10}$ ist weder $2^{20}$ noch $4^{10}$.',
        't-zehner':
            'Gleiche Hochzahl – dann dürfen die Grundzahlen zusammen:' +
            '$$a^n\\cdot b^n=(a\\cdot b)^n$$' +
            'Aus $2^{10}\\cdot 5^{10}$ wird $10^{10}$, eine 1 mit zehn Nullen. Durch $10^9$ bleibt 10.',
        't-1001':
            'Wieder die dritte binomische Formel:' +
            '$$1001^2-999^2=(1001+999)\\cdot(1001-999)=2000\\cdot 2$$' +
            'Durch 4 ergibt das 1000 – ohne dass man $1001^2$ je ausrechnen muss.',
        't-fuenf':
            'In $5^6$ steckt $5^4$, denn $5^6=5^4\\cdot 5^2$. Ausklammern:' +
            '$$5^6-5^4=5^4\\cdot(25-1)=5^4\\cdot 24$$' +
            'Die 24 kürzt sich gegen den Nenner, übrig bleibt $5^4=625$.',
        't-jahr':
            'Die Zahlen sind riesig, der Trick bleibt klein: $2^{2026}=2^{2025}\\cdot 2$, also' +
            '$$2^{2026}-2^{2025}=2^{2025}\\cdot(2-1)=2^{2025}$$' +
            'Durch $2^{2024}$ bleibt eine einzige 2.',
        't-333':
            'Das Muster: $111111=111\\cdot 1001$ und $222=111\\cdot 2$. Ausklammern:' +
            '$$111111-222=111\\cdot 999=111\\cdot 9\\cdot 111=9\\cdot 111^2$$' +
            'Die Wurzel daraus ist $3\\cdot 111=333$. Genauso ist $\\sqrt{1111-22}=33$ und $\\sqrt{11-2}=3$.',
    });
})();

// Block "Kopfrechnen · Denkaufgaben" (Doc, 30.09.2026: "mach mehr solche Denkaufgaben ... die sind der Knaller") - the
// same kind, new ideas: tauschen, Paare bilden, gleiche Grundzahl, Teleskop. Easy to hard; every step checked in Python
// with exact fractions, every formula rendered with the lab's KaTeX (strict). The little Gauss gets his source as it is:
// Sartorius tells the story, but without the numbers 1 to 100 (Brian Hayes, "Gauss's Day of Reckoning", 2006).
// Doc, 01.10.2026 (four pictures: "Bau die doch bitte in die Decks ein (sinnvoll, logisch ;-)", "das auch", "auch"):
// 50^50/25^25 and 8^x = 4^2026 + 4^2026 (x = 1351) after the other powers, then the letters at the end - MATH (letters side by side are a product: 240, not
// the number word 2385 of the Ziffernrätsel), LOVE (the first binomial formula gives the products without the
// numbers) and x! = x^3 - x (ausklammern, the third one, then trying). Checked with sympy: every step holds in all four
// real solutions of LOVE, x = 5 is the only natural solution (x = 0 to 199). No source: the pictures circulate without
// one (searched 01.10.2026).
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['d-125',       '125\\cdot 56',                                                                                   ''],
        ['d-37',        '37\\cdot 99+37',                                                                                 ''],
        ['d-prozent',   '8\\,\\%\\text{ von }25',                                                                         ''],
        ['d-48mal52',   '48\\cdot 52',                                                                                    ''],
        ['d-65quadrat', '65^2',                                                                                           ''],
        ['d-wurzel',    '\\sqrt{16\\cdot 25\\cdot 36}',                                                                   ''],
        ['d-123123',    '\\frac{123123}{1001}',                                                                           ''],
        ['d-basis',     '\\frac{4^5}{2^9}',                                                                               ''],
        ['d-8hoch',     '\\frac{8^{10}}{4^{15}}',                                                                         ''],
        ['d-50hoch',    '\\frac{50^{50}}{25^{25}}',                                                                       ''],
        ['d-achthoch',  '8^x=4^{2026}+4^{2026}',                                                                          'x'],
        ['d-gauss',     '1+2+3+\\ldots+100',                                                                              ''],
        ['d-2026',      '2026^2-2025\\cdot 2027',                                                                         ''],
        ['d-teleskop',  '\\left(1-\\frac{1}{2}\\right)\\cdot\\left(1-\\frac{1}{3}\\right)\\cdot\\ldots\\cdot\\left(1-\\frac{1}{10}\\right)', ''],
        ['d-kehrsumme', '\\frac{1}{1\\cdot 2}+\\frac{1}{2\\cdot 3}+\\ldots+\\frac{1}{9\\cdot 10}',                         ''],
        // the systems in braces: their "=" stay out of the "=" column, the steps start under them
        ['d-math',      '{\\begin{cases}M=2\\\\A=M+1\\\\T=8\\\\H=T-A\\end{cases}\\quad MATH=\\,?}',                      ''],
        ['d-love',     '{\\begin{cases}L^2+O^2=122\\\\L+O=12\\\\V^2+E^2=170\\\\V+E=14\\end{cases}\\quad LOVE=\\,?}',    ''],
        ['d-fakultaet', 'x!=x^3-x',                                                                                       'x'],
    );
    BLOECKE.push({ titel: 'Kopfrechnen · Denkaufgaben', ab, bis: AUFGABEN.length, kopf: 'ohne Taschenrechner' });
    Object.assign(LOESUNGEN, {
        'd-125':       [['=125\\cdot 8\\cdot 7', '\\text{zerlegen}'],
                        ['=1000\\cdot 7', '\\text{ausrechnen}'],
                        ['=7000', '\\text{ausrechnen}']],
        'd-37':        [['=37\\cdot 99+37\\cdot 1', '\\text{zerlegen}'],
                        ['=37\\cdot(99+1)', '\\text{ausklammern}'],
                        ['=37\\cdot 100', '\\text{ausrechnen}'],
                        ['=3700', '\\text{ausrechnen}']],
        'd-prozent':   [['=\\frac{8}{100}\\cdot 25', '\\text{umschreiben}'],
                        ['=\\frac{25}{100}\\cdot 8', '\\text{vertauschen}'],
                        ['=\\frac{1}{4}\\cdot 8', '\\text{kürzen}'],
                        ['=2', '\\text{ausrechnen}']],
        'd-48mal52':   [['=(50-2)\\cdot(50+2)', '\\text{zerlegen}'],
                        ['=50^2-2^2', '\\text{binomische Formel}'],
                        ['=2500-4', '\\text{ausrechnen}'],
                        ['=2496', '\\text{ausrechnen}']],
        'd-65quadrat': [['=(60+5)^2', '\\text{zerlegen}'],
                        ['=60^2+2\\cdot 60\\cdot 5+5^2', '\\text{binomische Formel}'],
                        ['=3600+600+25', '\\text{ausrechnen}'],
                        ['=4225', '\\text{ausrechnen}']],
        'd-wurzel':    [['=\\sqrt{16}\\cdot\\sqrt{25}\\cdot\\sqrt{36}', '\\text{Wurzelgesetz}'],
                        ['=4\\cdot 5\\cdot 6', '\\text{Wurzel ziehen}'],
                        ['=120', '\\text{ausrechnen}']],
        'd-123123':    [['=\\frac{123\\cdot 1001}{1001}', '\\text{zerlegen}'],
                        ['=123', '\\text{kürzen}']],
        'd-basis':     [['=\\frac{(2^2)^5}{2^9}', '\\text{zerlegen}'],
                        ['=\\frac{2^{10}}{2^9}', '\\text{Potenzgesetz}'],
                        ['=2', '\\text{Potenzgesetz}']],
        'd-8hoch':     [['=\\frac{(2^3)^{10}}{(2^2)^{15}}', '\\text{zerlegen}'],
                        ['=\\frac{2^{30}}{2^{30}}', '\\text{Potenzgesetz}'],
                        ['=1', '\\text{kürzen}']],
        'd-50hoch':    [['=\\frac{(2\\cdot 25)^{50}}{25^{25}}', '\\text{zerlegen}'],
                        ['=\\frac{2^{50}\\cdot 25^{50}}{25^{25}}', '\\text{Potenzgesetz}'],
                        ['=2^{50}\\cdot 25^{25}', '\\text{kürzen}'],
                        ['=2^{50}\\cdot(5^2)^{25}', '\\text{zerlegen}'],
                        ['=2^{50}\\cdot 5^{50}', '\\text{Potenzgesetz}'],
                        ['=10^{50}', '\\text{Potenzgesetz}']],
        'd-achthoch':  [['8^x=2\\cdot 4^{2026}', '\\text{zusammenfassen}'],
                        ['(2^3)^x=2\\cdot(2^2)^{2026}', '\\text{zerlegen}'],
                        ['2^{3x}=2\\cdot 2^{4052}', '\\text{Potenzgesetz}'],
                        ['2^{3x}=2^{4053}', '\\text{Potenzgesetz}'],
                        ['3x=4053', '\\text{Exponentenvergleich}'],
                        ['x=1351', ':3']],
        'd-gauss':     [['=(1+100)+(2+99)+\\ldots+(50+51)', '\\text{Paare bilden}'],
                        ['=50\\cdot 101', '\\text{zusammenfassen}'],
                        ['=5050', '\\text{ausrechnen}']],
        'd-2026':      [['=2026^2-(2026-1)\\cdot(2026+1)', '\\text{zerlegen}'],
                        ['=2026^2-(2026^2-1)', '\\text{binomische Formel}'],
                        ['=2026^2-2026^2+1', '\\text{Klammer auflösen}'],
                        ['=1', '\\text{zusammenfassen}']],
        'd-teleskop':  [['=\\frac{1}{2}\\cdot\\frac{2}{3}\\cdot\\frac{3}{4}\\cdot\\ldots\\cdot\\frac{9}{10}', '\\text{ausrechnen}'],
                        ['=\\frac{1\\cdot 2\\cdot 3\\cdot\\ldots\\cdot 9}{2\\cdot 3\\cdot 4\\cdot\\ldots\\cdot 10}', '\\text{zusammenfassen}'],
                        ['=\\frac{1}{10}', '\\text{kürzen}']],
        'd-kehrsumme': [['=1-\\frac{1}{2}+\\frac{1}{2}-\\frac{1}{3}+\\ldots+\\frac{1}{9}-\\frac{1}{10}', '\\text{zerlegen}'],
                        ['=1-\\frac{1}{10}', '\\text{zusammenfassen}'],
                        ['=\\frac{9}{10}', '\\text{ausrechnen}']],
        'd-math':      [['A=3', '\\text{einsetzen}'],
                        ['H=5', '\\text{einsetzen}'],
                        ['MATH=2\\cdot 3\\cdot 8\\cdot 5', '\\text{einsetzen}'],
                        ['MATH=10\\cdot 24', '\\text{vertauschen}'],
                        ['MATH=240', '\\text{ausrechnen}']],
        'd-love':      [['(L+O)^2=144', '\\text{quadrieren}'],
                        ['L^2+2LO+O^2=144', '\\text{binomische Formel}'],
                        ['122+2LO=144', '\\text{einsetzen}'],
                        ['2LO=22', '-122'],
                        ['LO=11', ':2'],
                        ['VE=13', '\\text{genauso mit }V,\\,E'],
                        ['LOVE=11\\cdot 13', '\\text{einsetzen}'],
                        ['LOVE=143', '\\text{ausrechnen}']],
        'd-fakultaet': [['x!=x\\cdot(x^2-1)', '\\text{ausklammern}'],
                        ['x!=x\\cdot(x-1)\\cdot(x+1)', '\\text{binomische Formel}'],
                        ['x\\cdot(x-1)\\cdot(x-2)!=x\\cdot(x-1)\\cdot(x+1)', '\\text{zerlegen},\\;x\\ge 2'],
                        ['(x-2)!=x+1', ':x\\cdot(x-1)'],
                        ['x=5', '\\text{probieren}']],
    });
    // checked 30.09.2026 (Brian Hayes, "Gauss's Day of Reckoning", American Scientist, May-June 2006; Wikipedia)
    QUELLEN['d-gauss'] = 'Anekdote: W. Sartorius von Waltershausen, „Gauss zum Gedächtnis“, 1856 – die Zahlen 1 bis 100 stehen dort noch nicht (B. Hayes, American Scientist 2006)';
    Object.assign(ERKLAERUNGEN, {
        'd-125':
            'Die 125 ist ein Achtel von 1000, also $125\\cdot 8=1000$. Darum die 56 als $8\\cdot 7$ schreiben:' +
            '$$125\\cdot 56=125\\cdot 8\\cdot 7=1000\\cdot 7=7000$$',
        'd-37':
            'Die 37 kommt zweimal vor – einmal 99-mal und einmal allein, zusammen also 100-mal:' +
            '$$37\\cdot 99+37\\cdot 1=37\\cdot(99+1)=37\\cdot 100=3700$$',
        'd-prozent':
            'Prozent heißt „von Hundert“: $8\\,\\%$ von 25 ist $\\frac{8}{100}\\cdot 25$. Beim Malnehmen darf man tauschen – ' +
            'also ist es dasselbe wie $25\\,\\%$ von 8, ein Viertel von 8:' +
            '$$\\frac{8}{100}\\cdot 25=\\frac{25}{100}\\cdot 8=\\frac{1}{4}\\cdot 8=2$$' +
            'Das klappt immer: $x\\,\\%$ von $y$ ist $y\\,\\%$ von $x$.',
        'd-48mal52':
            'Wie bei $99\\cdot 101$: 48 und 52 liegen gleich weit neben der 50. Mit der dritten binomischen Formel' +
            '$$(50-2)\\cdot(50+2)=50^2-2^2=2500-4=2496$$',
        'd-65quadrat':
            'Mit der ersten binomischen Formel geht es immer. Für Zahlen mit 5 am Ende gibt es eine Abkürzung: die ' +
            'Zehnerziffer mal ihre Nachfolgerin, hier $6\\cdot 7=42$, und 25 dahinter – 4225. Genauso ist $35^2=1225$, ' +
            'weil $3\\cdot 4=12$.',
        'd-wurzel':
            'Nicht erst malnehmen! Unter der Wurzel stehen drei Quadratzahlen, und die Wurzel aus einem Produkt ist das ' +
            'Produkt der Wurzeln:' +
            '$$\\sqrt{a\\cdot b}=\\sqrt{a}\\cdot\\sqrt{b}$$' +
            'Also $4\\cdot 5\\cdot 6=120$. Der lange Weg hätte erst 14400 gebraucht.',
        'd-123123':
            'Es ist $1001=1000+1$, also $123\\cdot 1001=123000+123=123123$ – jede dreistellige Zahl zweimal ' +
            'hintereinander ist durch 1001 teilbar. Und weil $1001=7\\cdot 11\\cdot 13$, auch durch 7, 11 und 13.',
        'd-basis':
            'Verschiedene Grundzahlen, aber $4=2^2$. Dann ist $4^5=(2^2)^5=2^{10}$ – beim Potenzieren einer Potenz werden ' +
            'die Hochzahlen malgenommen. Und $2^{10}$ durch $2^9$ ist 2.',
        'd-8hoch':
            'Beides sind Zweierpotenzen: $8=2^3$ und $4=2^2$. Dann ist $8^{10}=2^{30}$ und $4^{15}=2^{30}$ – Zähler und ' +
            'Nenner sind gleich.',
        'd-50hoch':
            'Riesige Zahlen, aber $50=2\\cdot 25$. Dann ist' +
            '$$50^{50}=(2\\cdot 25)^{50}=2^{50}\\cdot 25^{50}$$' +
            'und durch $25^{25}$ bleibt $2^{50}\\cdot 25^{25}$. Jetzt noch $25=5^2$, also $25^{25}=5^{50}$ – dieselbe ' +
            'Hochzahl wie bei der 2, und die Grundzahlen dürfen zusammen:' +
            '$$2^{50}\\cdot 5^{50}=(2\\cdot 5)^{50}=10^{50}$$' +
            'Eine 1 mit fünfzig Nullen.\n\nDie Falle: $\\frac{50}{25}=2$ teilen und die Hochzahlen auch – das ergäbe ' +
            '$2^2$. Zusammenfassen darf man nur bei gleicher Grundzahl, $\\frac{a^m}{a^n}=a^{m-n}$, oder bei gleicher ' +
            'Hochzahl, $\\frac{a^n}{b^n}=\\left(\\frac{a}{b}\\right)^n$.',
        'd-achthoch':
            'Zweimal dasselbe ist das Doppelte: $4^{2026}+4^{2026}=2\\cdot 4^{2026}$. Jetzt alles als Zweierpotenz, mit ' +
            '$8=2^3$ und $4=2^2$:' +
            '$$2^{3x}=2\\cdot 2^{4052}=2^{4053}$$' +
            'Links und rechts dieselbe Grundzahl – also sind auch die Hochzahlen gleich:' +
            '$$3x=4053$$' +
            '$$x=1351$$' +
            'Die Falle heißt 2026: Wer die Grundzahlen addiert, schreibt $4^{2026}+4^{2026}=8^{2026}$. Das stimmt nur bei ' +
            'der Hochzahl 1 – schon $4^2+4^2=32$, aber $8^2=64$.',
        'd-gauss':
            'Der erste und der letzte Summand ergeben 101, der zweite und der vorletzte auch – und so weiter. Das sind ' +
            '50 Paare:' +
            '$$50\\cdot 101=5050$$' +
            'Allgemein: $1+2+\\ldots+n=\\frac{n\\cdot(n+1)}{2}$. Erzählt wird das vom neunjährigen Carl Friedrich Gauß – ' +
            'welche Zahlen er wirklich addieren sollte, ist aber nicht überliefert.',
        'd-2026':
            '2025 und 2027 liegen gleich weit neben 2026. Mit der dritten binomischen Formel ist ' +
            '$2025\\cdot 2027=2026^2-1$ – und dann bleibt von der ganzen Rechnung nur die 1 übrig. Das klappt mit jeder ' +
            'Zahl:' +
            '$$n^2-(n-1)\\cdot(n+1)=1$$',
        'd-teleskop':
            'Jede Klammer erst ausrechnen: $1-\\frac{1}{2}=\\frac{1}{2}$, $1-\\frac{1}{3}=\\frac{2}{3}$ und so weiter. ' +
            'Dann steht jeder Zähler auch im Nenner davor – 2 gegen 2, 3 gegen 3, bis 9 gegen 9. Übrig bleiben nur die 1 ' +
            'oben und die 10 unten.',
        'd-kehrsumme':
            'Der Trick:' +
            '$$\\frac{1}{n\\cdot(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$$' +
            'zum Beispiel $\\frac{1}{2\\cdot 3}=\\frac{1}{2}-\\frac{1}{3}=\\frac{1}{6}$. Schreibt man alle Brüche so, hebt ' +
            'sich fast alles auf, $-\\frac{1}{2}$ gegen $+\\frac{1}{2}$ und so weiter. Übrig bleibt ' +
            '$1-\\frac{1}{10}=\\frac{9}{10}$.',
        'd-math':
            'Erst die Buchstaben, von oben nach unten: $A=M+1=3$ und $H=T-A=8-3=5$. Und dann? In der Mathematik heißt ' +
            '$MATH$ dasselbe wie $M\\cdot A\\cdot T\\cdot H$ – Buchstaben nebeneinander werden malgenommen, wie bei $2ab$:' +
            '$$MATH=2\\cdot 3\\cdot 8\\cdot 5=240$$' +
            'Im Kopf geht es mit Vertauschen am schnellsten: $2\\cdot 5=10$ und $3\\cdot 8=24$, zusammen $10\\cdot 24=240$.' +
            '\n\nWer die Ziffern einfach hintereinander schreibt, erhält 2385 – so liest man $\\mathrm{MATH}$ bei den ' +
            'Ziffernrätseln, dort ist es eine vierstellige Zahl. In einer Rechnung mit $=$ und $+$ gilt aber die Regel ' +
            'der Algebra: 240.',
        'd-love':
            'Wie bei $MATH$ heißt $LOVE$ hier $L\\cdot O\\cdot V\\cdot E$. Die vier Zahlen braucht man dafür nicht einzeln, nur die Produkte $LO$ und $VE$. Die liefert die erste ' +
            'binomische Formel, sie verbindet die Summe mit den Quadraten:' +
            '$$(L+O)^2=L^2+2LO+O^2$$' +
            'Links steht $12^2=144$, rechts $122+2LO$. Also ist $2LO=22$ und $LO=11$. Genauso mit $V$ und $E$:' +
            '$$14^2=170+2VE$$' +
            'also $2VE=26$ und $VE=13$. Zusammen:' +
            '$$LOVE=LO\\cdot VE=11\\cdot 13=143$$' +
            '\n\nZum Weiterdenken: Die vier Zahlen gibt es auch. Summe 12 und Produkt 11 haben nur 1 und 11, Summe 14 ' +
            'und Produkt 13 nur 1 und 13. Welcher Buchstabe welche Zahl ist, verrät die Aufgabe nicht – das Produkt ist ' +
            'trotzdem immer 143. Und anders als bei den Ziffernrätseln dürfen hier zwei Buchstaben dieselbe Zahl sein: ' +
            'In jedem Paar steckt eine 1. Probe: $1^2+11^2=122$ und $1^2+13^2=170$.',
        'd-fakultaet':
            'Rechts lässt sich $x$ ausklammern, und was in der Klammer bleibt, ist die dritte binomische Formel:' +
            '$$x^3-x=x\\cdot(x^2-1)=x\\cdot(x-1)\\cdot(x+1)$$' +
            'Links steht auch ein Produkt, $x!=1\\cdot 2\\cdot\\ldots\\cdot(x-1)\\cdot x$. Ab $x=2$ lassen sich die beiden ' +
            'größten Faktoren abspalten – dann stehen $x$ und $x-1$ auf beiden Seiten:' +
            '$$x\\cdot(x-1)\\cdot(x-2)!=x\\cdot(x-1)\\cdot(x+1)$$' +
            'Für $x\\ge 2$ ist $x\\cdot(x-1)$ nicht 0, man darf dadurch teilen:' +
            '$$(x-2)!=x+1$$' +
            'Jetzt probieren: Für $x=2$, $3$, $4$ steht links 1, 1, 2 und rechts 3, 4, 5. Bei $x=5$ steht links $3!=6$ ' +
            'und rechts auch 6. Danach wird die linke Seite mit jedem Schritt mindestens viermal so groß, die rechte ' +
            'wächst nur um 1 – es kommt keine Lösung mehr.' +
            '\n\n$x=0$ und $x=1$ gehen nicht: $0!=1!=1$, rechts steht aber 0. Also ist $x=5$ die einzige Lösung. Probe:' +
            '$$5!=120=125-5$$',
    });
    // the picture's four answers, under the heading in the deck (TEXTE)
    aufgabenTexte({ 'd-achthoch': 'Zur Auswahl: 2026, 4052, 1013 oder 1351.' });
})();
