// Block "Wachstum und Zerfall · Exponentialgleichungen" - the first block of the week (Doc, 30.09.2026: "ich hätte gern
// pro Woche Vorrechnen von 10 (20?) Aufgaben zum Thema ... einen Button pro Woche und das Deck pro Woche", for Mathe
// BGY 11 only: "Ich mache Mathe nur BGY 11 ... dafür!", "mach ab 42 bitte" - weeks 42 and 43 are the autumn holidays,
// so it is week 44, the plan's "Wachstum und Zerfall II: Exponentialfunktionen"). Twenty equations - "mach pro Woche
// immer 20 Aufgaben ... wir haben 5 x 45 min" - easy to hard: six with one power to recognise (1 and 1/8 among them),
// ten with a factor, a shifted exponent, a base to rewrite, growth and decay, compound interest and a half-life, four
// nuts. Without logarithms, as the week's quiz (mathetest11-exponential.html): both sides as powers of one base, then
// the exponents compared. The week (kw) opens the block in the lab on its first start then, and decks/tafel.html?kw=44
// is its deck (the pill in the plan's week).
// Every step was checked with sympy: it has exactly the solution set of the task (q > 0 where it is a growth factor,
// written behind the task), the last one isolates the variable.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['e-32',          '2^x=32',                                                   'x'],
        ['e-81',          '3^x=81',                                                   'x'],
        ['e-null',        '7^x=1',                                                    'x'],
        ['e-kehrwert',    '2^x=\\frac{1}{8}',                                         'x'],
        ['e-faktor',      '5\\cdot 2^x=40',                                           'x'],
        ['e-halb',        '\\left(\\frac{1}{2}\\right)^x=\\frac{1}{16}',              'x'],
        ['e-plus-eins',   '2^{x+1}=64',                                               'x'],
        ['e-minus-eins',  '3^{x-1}=27',                                               'x'],
        ['e-fuenf',       '5^{2x}=125',                                               'x'],
        ['e-vier',        '4^x=32',                                                   'x'],
        ['e-bestand',     '200\\cdot 1{,}5^n=450',                                    'n'],
        ['e-zerfall',     '800\\cdot 0{,}5^n=100',                                    'n'],
        ['e-anfang',      'N_0\\cdot 3^4=162',                                        'N_0'],
        ['e-zins',        '1102{,}5=K_0\\cdot 1{,}05^2',                              'K_0'],
        ['e-wachstum',    '1000\\cdot q^2=1210\\quad(q>0)',                           'q'],
        ['e-halbwert',    '400\\cdot\\left(\\frac{1}{2}\\right)^{t/5}=50',            't'],
        ['e-doppelt',     '2^x+2^x=64',                                               'x'],
        ['e-ausklammern', '3^{x+2}-3^x=72',                                           'x'],
        ['e-wurzel',      '2^x=\\sqrt{8}',                                            'x'],
        ['e-basen',       '4^x=8^{x-1}',                                              'x'],
    );
    BLOECKE.push({ titel: 'Wachstum und Zerfall · Exponentialgleichungen', ab, bis: AUFGABEN.length, kw: 44 });
    Object.assign(LOESUNGEN, {
        'e-32':          [['2^x=2^5', '\\text{als Potenz schreiben}'], ['x=5', '\\text{Exponenten vergleichen}']],
        'e-81':          [['3^x=3^4', '\\text{als Potenz schreiben}'], ['x=4', '\\text{Exponenten vergleichen}']],
        'e-null':        [['7^x=7^0', '\\text{als Potenz schreiben}'], ['x=0', '\\text{Exponenten vergleichen}']],
        'e-kehrwert':    [['2^x=\\frac{1}{2^3}', '\\text{als Potenz schreiben}'], ['2^x=2^{-3}', '\\text{Potenzgesetz}'],
                          ['x=-3', '\\text{Exponenten vergleichen}']],
        'e-faktor':      [['2^x=8', ':5'], ['2^x=2^3', '\\text{als Potenz schreiben}'], ['x=3', '\\text{Exponenten vergleichen}']],
        'e-halb':        [['\\left(\\frac{1}{2}\\right)^x=\\left(\\frac{1}{2}\\right)^4', '\\text{als Potenz schreiben}'],
                          ['x=4', '\\text{Exponenten vergleichen}']],
        'e-plus-eins':   [['2^{x+1}=2^6', '\\text{als Potenz schreiben}'], ['x+1=6', '\\text{Exponenten vergleichen}'], ['x=5', '-1']],
        'e-minus-eins':  [['3^{x-1}=3^3', '\\text{als Potenz schreiben}'], ['x-1=3', '\\text{Exponenten vergleichen}'], ['x=4', '+1']],
        'e-fuenf':       [['5^{2x}=5^3', '\\text{als Potenz schreiben}'], ['2x=3', '\\text{Exponenten vergleichen}'], ['x=\\frac{3}{2}', ':2']],
        'e-vier':        [['(2^2)^x=2^5', '\\text{als Potenz schreiben}'], ['2^{2x}=2^5', '\\text{Potenzgesetz}'],
                          ['2x=5', '\\text{Exponenten vergleichen}'], ['x=\\frac{5}{2}', ':2']],
        'e-bestand':     [['1{,}5^n=2{,}25', ':200'], ['1{,}5^n=1{,}5^2', '\\text{als Potenz schreiben}'], ['n=2', '\\text{Exponenten vergleichen}']],
        'e-zerfall':     [['0{,}5^n=0{,}125', ':800'], ['0{,}5^n=0{,}5^3', '\\text{als Potenz schreiben}'], ['n=3', '\\text{Exponenten vergleichen}']],
        'e-anfang':      [['N_0\\cdot 81=162', '\\text{ausrechnen}'], ['N_0=2', ':81']],
        'e-zins':        [['1102{,}5=K_0\\cdot 1{,}1025', '\\text{ausrechnen}'], ['K_0=1000', ':1{,}1025']],
        'e-wachstum':    [['q^2=1{,}21', ':1000'], ['q=1{,}1', '\\sqrt{\\;}']],
        'e-halbwert':    [['\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{1}{8}', ':400'],
                          ['\\left(\\frac{1}{2}\\right)^{t/5}=\\left(\\frac{1}{2}\\right)^3', '\\text{als Potenz schreiben}'],
                          ['\\frac{t}{5}=3', '\\text{Exponenten vergleichen}'], ['t=15', '\\cdot 5']],
        'e-doppelt':     [['2\\cdot 2^x=64', '\\text{zusammenfassen}'], ['2^x=32', ':2'], ['2^x=2^5', '\\text{als Potenz schreiben}'],
                          ['x=5', '\\text{Exponenten vergleichen}']],
        'e-ausklammern': [['9\\cdot 3^x-3^x=72', '\\text{Potenzgesetz}'], ['8\\cdot 3^x=72', '\\text{zusammenfassen}'], ['3^x=9', ':8'],
                          ['3^x=3^2', '\\text{als Potenz schreiben}'], ['x=2', '\\text{Exponenten vergleichen}']],
        'e-wurzel':      [['2^x=8^{1/2}', '\\text{Wurzel als Potenz}'], ['2^x=\\left(2^3\\right)^{1/2}', '\\text{als Potenz schreiben}'],
                          ['2^x=2^{3/2}', '\\text{Potenzgesetz}'], ['x=\\frac{3}{2}', '\\text{Exponenten vergleichen}']],
        'e-basen':       [['\\left(2^2\\right)^x=\\left(2^3\\right)^{x-1}', '\\text{als Potenz schreiben}'],
                          ['2^{2x}=2^{3x-3}', '\\text{Potenzgesetz}'], ['2x=3x-3', '\\text{Exponenten vergleichen}'], ['-x=-3', '-3x'],
                          ['x=3', ':(-1)']],
    });
    // the nuts: what trips one up, and a check by numbers (every number checked by hand)
    Object.assign(ERKLAERUNGEN, {
        'e-doppelt':
            'Die Falle: $2^x+2^x$ ist weder $2^{2x}$ noch $4^x$. Zwei gleiche Summanden sind das Doppelte, ' +
            '$2^x+2^x=2\\cdot 2^x$ – wie $a+a=2a$.' +
            '\n\nProbe mit $x=5$: $2^5+2^5=32+32=64$. Wer $4^x=64$ rechnet, bekommt $x=3$ – und $2^3+2^3=16$, nicht $64$.',
        'e-ausklammern':
            'Der Trick: $3^{x+2}=3^x\\cdot 3^2=9\\cdot 3^x$, das Potenzgesetz $a^{m+n}=a^m\\cdot a^n$. Links steht dann ' +
            'neunmal $3^x$ weniger einmal $3^x$, also $8\\cdot 3^x$.' +
            '\n\nNicht: $3^{x+2}-3^x=3^2$. Exponenten werden nur beim Multiplizieren addiert – beim Subtrahieren passiert ' +
            'mit ihnen nichts.' +
            '\n\nProbe mit $x=2$: $3^4-3^2=81-9=72$.',
        'e-wurzel':
            'Eine Wurzel ist eine Potenz: $\\sqrt{8}=8^{1/2}$. Und $8=2^3$, also ' +
            '$\\sqrt{8}=\\left(2^3\\right)^{1/2}=2^{3/2}$ – das Potenzgesetz $(a^m)^n=a^{m\\cdot n}$.' +
            '\n\nDer Exponent darf ein Bruch sein: $x=\\frac{3}{2}$. Probe: $2^{3/2}=2\\cdot 2^{1/2}=2\\sqrt{2}\\approx 2{,}83$, ' +
            'und $\\sqrt{8}\\approx 2{,}83$.',
    });
    aufgabenTexte({
        'e-bestand':     'Ein Bestand von $200$ wächst pro Schritt auf das $1{,}5$-Fache. Nach wie vielen Schritten $n$ sind es $450$?',
        'e-zerfall':     'Von $800$ mg halbiert sich die Menge in jedem Schritt. Nach wie vielen Schritten $n$ sind noch $100$ mg da?',
        'e-anfang':      'Ein Bestand verdreifacht sich viermal und ist dann $162$. Wie groß war er am Anfang?',
        'e-zins':        'Ein Kapital ist nach zwei Jahren mit $5\\,\\%$ Zinsen auf $1102{,}50$ € gewachsen. Wie groß war es am Anfang?',
        'e-wachstum':    '$1000$ € wachsen in zwei Jahren auf $1210$ €. Wie groß ist der jährliche Wachstumsfaktor $q$?',
        'e-halbwert':    '$400$ mg eines Stoffes zerfallen mit der Halbwertszeit $5$ Tage. Nach welcher Zeit $t$ sind noch $50$ mg übrig?',
    });
})();
