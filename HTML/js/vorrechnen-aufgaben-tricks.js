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
