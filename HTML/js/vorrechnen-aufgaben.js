// The tasks of the Vorrechnen lab: what is on the board in class, in blocks, and the
// solution of each step by step. One source for vorrechnen.html (the board) and
// decks/tafel.html?aufgaben (all tasks as a deck, with Solita - Doc, 27.09.2026: "mach das
// ganze Deck fertig"). Plain globals, loaded before the page's own script.

// Doc, 25.09. evening: without "Meine Beispiele" the head strip holds a
// task to work through in class - year 11, revision, rearranging
// equations from easy to harder. [slug, LaTeX, solve for]
const AUFGABEN = [
    ['plus',        'x+7=12',                                     'x'],
    ['mal',         '4x=28',                                      'x'],
    ['zwei-schritte', '3x+5=20',                                  'x'],
    ['beidseitig',  '7x-4=3x+8',                                  'x'],
    ['klammer',     '5(x-2)=3x+6',                                'x'],
    ['klammern',    '3(2x+1)-2(x-4)=19',                          'x'],
    ['bruch',       '\\frac{x}{4}+3=7',                           'x'],
    ['zaehler',     '\\frac{2x-1}{3}=5',                          'x'],
    ['brueche',     '\\frac{x}{2}+\\frac{x}{3}=10',               'x'],
    ['nenner',      '\\frac{6}{x-1}=2',                           'x'],
    ['geschwindigkeit', 'v=\\frac{s}{t}',                         't'],
    ['ohm',         'U=R\\cdot I',                                'R'],
    ['gerade',      'y=mx+b',                                     'm'],
    ['dreieck',     'A=\\frac{g\\cdot h}{2}',                     'h'],
    ['trapez',      'A=\\frac{a+c}{2}\\cdot h',                   'a'],
    ['parameter',   'ax+b=cx+d',                                  'x'],
    ['energie',     'E=\\frac{1}{2}mv^2',                         'v'],
    ['gravitation', 'F=G\\frac{m_1 m_2}{r^2}',                    'r'],
    ['pendel',      'T=2\\pi\\sqrt{\\frac{l}{g}}',                'g'],
    ['linse',       '\\frac{1}{f}=\\frac{1}{g}+\\frac{1}{b}',     'b'],
    // Level 2 (Doc, 26.09. night: "komplexere Umstellungen ... Level 2,
    // Anforderungsbereich 2"): brackets on both sides, fractions, x in the
    // denominator, formulas of physics, a variable twice, compound interest
    ['klammern2', '4(2x-3)-3(x+1)=2(x-6)',                           'x'],
    ['brueche2',  '\\frac{x+1}{3}-\\frac{x-2}{4}=2',                 'x'],
    ['brueche3',  '\\frac{x+3}{2}-\\frac{x-1}{3}=\\frac{x+7}{4}',    'x'],
    ['kreuz',     '\\frac{3}{x+2}=\\frac{5}{x-2}',                   'x'],
    ['xnenner',   '\\frac{2}{x}+\\frac{3}{2x}=\\frac{7}{4}',         'x'],
    ['fall',      'v=\\sqrt{2gh}',                                   'h'],
    ['bremsweg',  'v^2=v_0^2+2as',                                   's'],
    ['waerme',    'Q=cm(T_2-T_1)',                                   'T_2'],
    ['kinematik', 's=v_0 t+\\frac{1}{2}at^2',                        'a'],
    ['gas',       '\\frac{p_1 V_1}{T_1}=\\frac{p_2 V_2}{T_2}',       'T_2'],
    ['kegel',     'V=\\frac{1}{3}\\pi r^2 h',                        'r'],
    ['dichte',    '\\rho=\\frac{m}{a^3}',                            'a'],
    ['energie2',  'E=\\frac{1}{2}mv^2+mgh',                          'v'],
    ['ring',      'A=\\pi(r_a^2-r_i^2)',                             'r_i'],
    ['parallel',  'R=\\frac{R_1 R_2}{R_1+R_2}',                      'R_1'],
    ['zweimal',   'y=\\frac{x+a}{x-a}',                              'x'],
    ['zins',      'K=K_0\\left(1+\\frac{p}{100}\\right)^2',          'p'],
    // Level 3 (Doc: "für wirklich echte Nüsse"): binomial formulas, squares that
    // cancel, x and x² in denominators, powers, logarithms, mixing, three resistors,
    // Doppler, Kepler, time dilation - every step still an equivalence
    ['binom3',      '(x+3)^2-(x-2)^2=35',                                        'x'],
    ['kreuz3',      '\\frac{2x+1}{x-3}=\\frac{2x-5}{x-1}',                       'x'],
    ['nenner3',     '\\frac{x}{x-1}-\\frac{2}{x+1}=1',                           'x'],
    ['nenner4',     '\\frac{3}{x}+\\frac{x+1}{x^2}=\\frac{2}{x}',                'x'],
    ['potenz',      '2^{x+1}+2^x=48',                                            'x'],
    ['zerfall',     'N=N_0 e^{-\\lambda t}',                                     't'],
    ['zinsen',      'K=K_0\\left(1+\\frac{p}{100}\\right)^n',                    'n'],
    ['mischung',    'c_1 m_1(T_1-T_M)=c_2 m_2(T_M-T_2)',                         'T_M'],
    ['drei',        '\\frac{1}{R}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\frac{1}{R_3}', 'R_2'],
    ['doppler',     'f_E=f_S\\frac{c}{c-v}',                                     'v'],
    ['kepler',      '\\frac{T_1^2}{T_2^2}=\\frac{a_1^3}{a_2^3}',                 'a_2'],
    ['zeit',        't=\\frac{t_0}{\\sqrt{1-\\frac{v^2}{c^2}}}',                 'v'],
];
// The tasks in blocks: ◀ ▶ and the arrow keys stay within one, the counter counts
// within it, the panel shows each under its small title. kw (optional): the calendar
// week the block is for - the lab opens it once at the first start in that week. kopf (optional):
// what the head says over a task without a variable (default "vereinfachen")
const BLOECKE = [
    { titel: 'Level 1', ab: 0, bis: 20 },
    { titel: 'Level 2 · Anforderungsbereich II', ab: 20, bis: 37 },
    { titel: 'Level 3 · echte Nüsse', ab: 37, bis: AUFGABEN.length },
];
function aufgabenBlock(i) { return BLOECKE.find(b => i >= b.ab && i < b.bis) || BLOECKE[0]; }
// Doc, 28.09.: "Blende mir hier im Preview einen ausführlichen Erklärungstext ein ... oben rechts x zum
// wegklicken (pro Aufgabe)" - a task's explanation for Doc, by its slug: paragraphs split by a blank line,
// formulas between $...$ (KaTeX). A block's file adds its own; a task without one shows none.
const ERKLAERUNGEN = {};
// Doc, 28.09. (over SEND + MORE = MONEY): the task written "untereinander", as on paper - grey on the board,
// top left under "Aufgabe x / y", for the class too (the head layer is mirrored); by slug: { zeilen, zeichen,
// ergebnis } - the rows, the sign before the last one, the result (schemaHtml, js/vorrechnen-rechenweg.js)
const SCHEMATA = {};
// Doc, 28.09.: a task's source, small and grey right above the line to the writing field (on the beamer too) -
// "schreib's über die Trennlinie ... das ist eine Quelle"; by slug, plain text
const QUELLEN = {};
// Doc, 26.09.: "Gib mir bitte pro Aufgabe ... den jeweils nächsten Schritt in Grau,
// so dass ich ihn nachschreiben könnte, dass ich da keine Fehler mache" - the
// solution of each task, step by step: [equation, operation]. Every step was
// checked with sympy: the same solution as the task, it follows from the line
// before by its operation, and the last line isolates the variable.
const LOESUNGEN = {
    'plus':            [['x=5', '-7']],
    'mal':             [['x=7', ':4']],
    'zwei-schritte':   [['3x=15', '-5'], ['x=5', ':3']],
    'beidseitig':      [['4x-4=8', '-3x'], ['4x=12', '+4'], ['x=3', ':4']],
    'klammer':         [['5x-10=3x+6', '\\text{ausmultiplizieren}'], ['2x-10=6', '-3x'], ['2x=16', '+10'], ['x=8', ':2']],
    'klammern':        [['6x+3-2x+8=19', '\\text{ausmultiplizieren}'], ['4x+11=19', '\\text{zusammenfassen}'], ['4x=8', '-11'], ['x=2', ':4']],
    'bruch':           [['\\frac{x}{4}=4', '-3'], ['x=16', '\\cdot 4']],
    'zaehler':         [['2x-1=15', '\\cdot 3'], ['2x=16', '+1'], ['x=8', ':2']],
    'brueche':         [['3x+2x=60', '\\cdot 6'], ['5x=60', '\\text{zusammenfassen}'], ['x=12', ':5']],
    'nenner':          [['6=2(x-1)', '\\cdot(x-1)'], ['3=x-1', ':2'], ['x=4', '+1']],
    'geschwindigkeit': [['v\\cdot t=s', '\\cdot t'], ['t=\\frac{s}{v}', ':v']],
    'ohm':             [['R=\\frac{U}{I}', ':I']],
    'gerade':          [['y-b=mx', '-b'], ['m=\\frac{y-b}{x}', ':x']],
    'dreieck':         [['2A=g\\cdot h', '\\cdot 2'], ['h=\\frac{2A}{g}', ':g']],
    'trapez':          [['2A=(a+c)\\cdot h', '\\cdot 2'], ['\\frac{2A}{h}=a+c', ':h'], ['a=\\frac{2A}{h}-c', '-c']],
    'parameter':       [['ax-cx+b=d', '-cx'], ['ax-cx=d-b', '-b'], ['(a-c)x=d-b', '\\text{ausklammern}'], ['x=\\frac{d-b}{a-c}', ':(a-c)']],
    'energie':         [['2E=mv^2', '\\cdot 2'], ['\\frac{2E}{m}=v^2', ':m'], ['v=\\sqrt{\\frac{2E}{m}}', '\\sqrt{\\;}']],
    'gravitation':     [['F\\cdot r^2=G m_1 m_2', '\\cdot r^2'], ['r^2=\\frac{G m_1 m_2}{F}', ':F'], ['r=\\sqrt{\\frac{G m_1 m_2}{F}}', '\\sqrt{\\;}']],
    'pendel':          [['T^2=4\\pi^2\\cdot\\frac{l}{g}', '\\text{quadrieren}'], ['T^2\\cdot g=4\\pi^2 l', '\\cdot g'], ['g=\\frac{4\\pi^2 l}{T^2}', ':T^2']],
    'linse':           [['\\frac{1}{f}-\\frac{1}{g}=\\frac{1}{b}', '-\\frac{1}{g}'], ['\\frac{g-f}{fg}=\\frac{1}{b}', '\\text{Hauptnenner}'], ['b=\\frac{fg}{g-f}', '\\text{Kehrwert}']],
    // level 2 - checked the same way (tools: scratchpad loesungen/pruefe2.py)
    'klammern2': [['8x-12-3x-3=2x-12', '\\text{ausmultiplizieren}'], ['5x-15=2x-12', '\\text{zusammenfassen}'], ['3x-15=-12', '-2x'], ['3x=3', '+15'], ['x=1', ':3']],
    'brueche2':  [['4(x+1)-3(x-2)=24', '\\cdot 12'], ['4x+4-3x+6=24', '\\text{ausmultiplizieren}'], ['x+10=24', '\\text{zusammenfassen}'], ['x=14', '-10']],
    'brueche3':  [['6(x+3)-4(x-1)=3(x+7)', '\\cdot 12'], ['6x+18-4x+4=3x+21', '\\text{ausmultiplizieren}'], ['2x+22=3x+21', '\\text{zusammenfassen}'], ['22=x+21', '-2x'], ['x=1', '-21']],
    'kreuz':     [['3(x-2)=5(x+2)', '\\cdot(x+2)(x-2)'], ['3x-6=5x+10', '\\text{ausmultiplizieren}'], ['-2x-6=10', '-5x'], ['-2x=16', '+6'], ['x=-8', ':(-2)']],
    'xnenner':   [['8+6=7x', '\\cdot 4x'], ['14=7x', '\\text{zusammenfassen}'], ['x=2', ':7']],
    'fall':      [['v^2=2gh', '\\text{quadrieren}'], ['h=\\frac{v^2}{2g}', ':2g']],
    'bremsweg':  [['v^2-v_0^2=2as', '-v_0^2'], ['s=\\frac{v^2-v_0^2}{2a}', ':2a']],
    'waerme':    [['\\frac{Q}{cm}=T_2-T_1', ':cm'], ['T_2=\\frac{Q}{cm}+T_1', '+T_1']],
    'kinematik': [['s-v_0 t=\\frac{1}{2}at^2', '-v_0 t'], ['2(s-v_0 t)=at^2', '\\cdot 2'], ['a=\\frac{2(s-v_0 t)}{t^2}', ':t^2']],
    'gas':       [['p_1 V_1 T_2=p_2 V_2 T_1', '\\cdot T_1 T_2'], ['T_2=\\frac{p_2 V_2 T_1}{p_1 V_1}', ':p_1 V_1']],
    'kegel':     [['3V=\\pi r^2 h', '\\cdot 3'], ['\\frac{3V}{\\pi h}=r^2', ':\\pi h'], ['r=\\sqrt{\\frac{3V}{\\pi h}}', '\\sqrt{\\;}']],
    'dichte':    [['\\rho a^3=m', '\\cdot a^3'], ['a^3=\\frac{m}{\\rho}', ':\\rho'], ['a=\\sqrt[3]{\\frac{m}{\\rho}}', '\\sqrt[3]{\\;}']],
    'energie2':  [['E-mgh=\\frac{1}{2}mv^2', '-mgh'], ['2(E-mgh)=mv^2', '\\cdot 2'], ['\\frac{2(E-mgh)}{m}=v^2', ':m'], ['v=\\sqrt{\\frac{2(E-mgh)}{m}}', '\\sqrt{\\;}']],
    'ring':      [['\\frac{A}{\\pi}=r_a^2-r_i^2', ':\\pi'], ['\\frac{A}{\\pi}+r_i^2=r_a^2', '+r_i^2'], ['r_i^2=r_a^2-\\frac{A}{\\pi}', '-\\frac{A}{\\pi}'], ['r_i=\\sqrt{r_a^2-\\frac{A}{\\pi}}', '\\sqrt{\\;}']],
    'parallel':  [['R(R_1+R_2)=R_1 R_2', '\\cdot(R_1+R_2)'], ['R R_1+R R_2=R_1 R_2', '\\text{ausmultiplizieren}'], ['R R_2=R_1 R_2-R R_1', '-R R_1'], ['R R_2=R_1(R_2-R)', '\\text{ausklammern}'], ['R_1=\\frac{R R_2}{R_2-R}', ':(R_2-R)']],
    'zweimal':   [['y(x-a)=x+a', '\\cdot(x-a)'], ['yx-ya=x+a', '\\text{ausmultiplizieren}'], ['yx-ya-x=a', '-x'], ['yx-x=a+ya', '+ya'], ['(y-1)x=a(1+y)', '\\text{ausklammern}'], ['x=\\frac{a(1+y)}{y-1}', ':(y-1)']],
    'zins':      [['\\frac{K}{K_0}=\\left(1+\\frac{p}{100}\\right)^2', ':K_0'], ['\\sqrt{\\frac{K}{K_0}}=1+\\frac{p}{100}', '\\sqrt{\\;}'], ['\\sqrt{\\frac{K}{K_0}}-1=\\frac{p}{100}', '-1'], ['p=100\\left(\\sqrt{\\frac{K}{K_0}}-1\\right)', '\\cdot 100']],
    // level 3 - checked the same way (scratchpad loesungen/pruefe3.py)
    'binom3':      [['x^2+6x+9-(x^2-4x+4)=35', '\\text{binomische Formeln}'], ['10x+5=35', '\\text{zusammenfassen}'], ['10x=30', '-5'], ['x=3', ':10']],
    'kreuz3':      [['(2x+1)(x-1)=(2x-5)(x-3)', '\\cdot(x-3)(x-1)'], ['2x^2-x-1=2x^2-11x+15', '\\text{ausmultiplizieren}'], ['-x-1=-11x+15', '-2x^2'], ['10x-1=15', '+11x'], ['10x=16', '+1'], ['x=\\frac{8}{5}', ':10']],
    'nenner3':     [['x(x+1)-2(x-1)=(x-1)(x+1)', '\\cdot(x-1)(x+1)'], ['x^2+x-2x+2=x^2-1', '\\text{ausmultiplizieren}'], ['x^2-x+2=x^2-1', '\\text{zusammenfassen}'], ['-x+2=-1', '-x^2'], ['-x=-3', '-2'], ['x=3', ':(-1)']],
    'nenner4':     [['3x+x+1=2x', '\\cdot x^2'], ['4x+1=2x', '\\text{zusammenfassen}'], ['2x+1=0', '-2x'], ['2x=-1', '-1'], ['x=-\\frac{1}{2}', ':2']],
    'potenz':      [['2\\cdot 2^x+2^x=48', '\\text{Potenzgesetz}'], ['3\\cdot 2^x=48', '\\text{zusammenfassen}'], ['2^x=16', ':3'], ['x=4', '\\log_2']],
    'zerfall':     [['\\frac{N}{N_0}=e^{-\\lambda t}', ':N_0'], ['\\ln\\frac{N}{N_0}=-\\lambda t', '\\ln'], ['t=\\frac{1}{\\lambda}\\ln\\frac{N_0}{N}', ':(-\\lambda)']],
    'zinsen':      [['\\frac{K}{K_0}=\\left(1+\\frac{p}{100}\\right)^n', ':K_0'], ['\\ln\\frac{K}{K_0}=n\\ln\\left(1+\\frac{p}{100}\\right)', '\\ln'], ['n=\\frac{\\ln\\frac{K}{K_0}}{\\ln\\left(1+\\frac{p}{100}\\right)}', ':\\ln\\left(1+\\frac{p}{100}\\right)']],
    'mischung':    [['c_1 m_1 T_1-c_1 m_1 T_M=c_2 m_2 T_M-c_2 m_2 T_2', '\\text{ausmultiplizieren}'], ['c_1 m_1 T_1=c_2 m_2 T_M-c_2 m_2 T_2+c_1 m_1 T_M', '+c_1 m_1 T_M'], ['c_1 m_1 T_1+c_2 m_2 T_2=c_2 m_2 T_M+c_1 m_1 T_M', '+c_2 m_2 T_2'], ['c_1 m_1 T_1+c_2 m_2 T_2=(c_1 m_1+c_2 m_2)T_M', '\\text{ausklammern}'], ['T_M=\\frac{c_1 m_1 T_1+c_2 m_2 T_2}{c_1 m_1+c_2 m_2}', ':(c_1 m_1+c_2 m_2)']],
    'drei':        [['\\frac{1}{R}-\\frac{1}{R_1}=\\frac{1}{R_2}+\\frac{1}{R_3}', '-\\frac{1}{R_1}'], ['\\frac{1}{R}-\\frac{1}{R_1}-\\frac{1}{R_3}=\\frac{1}{R_2}', '-\\frac{1}{R_3}'], ['\\frac{R_1 R_3-R R_3-R R_1}{R R_1 R_3}=\\frac{1}{R_2}', '\\text{Hauptnenner}'], ['R_2=\\frac{R R_1 R_3}{R_1 R_3-R R_3-R R_1}', '\\text{Kehrwert}']],
    'doppler':     [['f_E(c-v)=f_S c', '\\cdot(c-v)'], ['f_E c-f_E v=f_S c', '\\text{ausmultiplizieren}'], ['-f_E v=f_S c-f_E c', '-f_E c'], ['v=\\frac{f_E c-f_S c}{f_E}', ':(-f_E)']],
    'kepler':      [['T_1^2 a_2^3=T_2^2 a_1^3', '\\cdot T_2^2 a_2^3'], ['a_2^3=\\frac{T_2^2 a_1^3}{T_1^2}', ':T_1^2'], ['a_2=a_1\\sqrt[3]{\\frac{T_2^2}{T_1^2}}', '\\sqrt[3]{\\;}']],
    'zeit':        [['t^2=\\frac{t_0^2}{1-\\frac{v^2}{c^2}}', '\\text{quadrieren}'], ['t^2\\left(1-\\frac{v^2}{c^2}\\right)=t_0^2', '\\cdot\\left(1-\\frac{v^2}{c^2}\\right)'], ['1-\\frac{v^2}{c^2}=\\frac{t_0^2}{t^2}', ':t^2'], ['1=\\frac{t_0^2}{t^2}+\\frac{v^2}{c^2}', '+\\frac{v^2}{c^2}'], ['1-\\frac{t_0^2}{t^2}=\\frac{v^2}{c^2}', '-\\frac{t_0^2}{t^2}'], ['c^2\\left(1-\\frac{t_0^2}{t^2}\\right)=v^2', '\\cdot c^2'], ['v=c\\sqrt{1-\\frac{t_0^2}{t^2}}', '\\sqrt{\\;}']],
};
