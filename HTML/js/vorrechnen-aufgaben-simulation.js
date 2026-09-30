// Block "Simulation · Zufall mit dem Rechner" - week 17 of 2027, Mathe BGY 11, the plan's "Simulation von Zufallsversuchen
// mit digitalen Medien" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen
// Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after
// the week's quiz (mathetest11-simulation.html): relative frequency against probability (95 sixes in 600 throws), a
// die from a random number, the wheel 50/30/20 on [0;1), the expected value of a die and of a game (fair or not), the
// birthday problem for two and three people, how the error shrinks like 1/√n, and the nut: at least one six in four
// throws, what a simulation would estimate. Each task carries its setting in a sentence (aufgabenTexte).
// Every step checked with sympy (a term the same value, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['si-erwartet',     '600\\cdot\\frac{1}{6}',                      ''],
        ['si-haeufigkeit',  '\\frac{95}{600}',                            ''],
        ['si-anteil',       '\\frac{154}{200}',                           ''],
        ['si-anzahl',       '0{,}3\\cdot 200',                            ''],
        ['si-wuerfel',      '6\\cdot 0{,}73',                             ''],
        ['si-grenze',       '0{,}5+0{,}3',                                ''],
        ['si-schaetzen',    '\\frac{1512}{5000}',                         ''],
        ['si-abweichung',   '0{,}504-0{,}5',                              ''],
        ['si-mittel',       '\\frac{0{,}48+0{,}52+0{,}51+0{,}49}{4}',     ''],
        ['si-erwartungswert', '\\frac{1+2+3+4+5+6}{6}',                   ''],
        ['si-spiel',        '0{,}2\\cdot 10+0{,}8\\cdot(-3)',             ''],
        ['si-einsatz',      '0{,}25\\cdot 6-2',                           ''],
        ['si-fair',         '0{,}2\\cdot 10-0{,}8x=0',                    'x'],
        ['si-summe-sieben', '\\frac{6}{36}',                              ''],
        ['si-muenzen',      '\\left(\\frac{1}{2}\\right)^{10}',           ''],
        ['si-geburtstag',   '1-\\frac{364}{365}',                         ''],
        ['si-geburtstag-drei', '1-\\frac{364}{365}\\cdot\\frac{363}{365}', ''],
        ['si-fehler',       '\\frac{1}{\\sqrt{10000}}',                   ''],
        ['si-laeufe',       '\\frac{1}{\\sqrt{n}}=0{,}01\\quad(n>0)',     'n'],
        ['si-nuss',         '1-\\left(\\frac{5}{6}\\right)^4',            ''],
    );
    BLOECKE.push({ titel: 'Simulation · Zufall mit dem Rechner', ab, bis: AUFGABEN.length, kw: 17, kopf: 'berechnen' });
    Object.assign(LOESUNGEN, {
        'si-erwartet':      [['=100', '\\text{ausrechnen}']],
        'si-haeufigkeit':   [['=\\frac{19}{120}', '\\text{kürzen}'], ['\\approx 0{,}158', '\\text{Taschenrechner}']],
        'si-anteil':        [['=0{,}77', '\\text{ausrechnen}']],
        'si-anzahl':        [['=60', '\\text{ausrechnen}']],
        'si-wuerfel':       [['=4{,}38', '\\text{ausrechnen}']],
        'si-grenze':        [['=0{,}8', '\\text{ausrechnen}']],
        'si-schaetzen':     [['=0{,}3024', '\\text{ausrechnen}']],
        'si-abweichung':    [['=0{,}004', '\\text{ausrechnen}']],
        'si-mittel':        [['=\\frac{2}{4}', '\\text{addieren}'], ['=0{,}5', '\\text{kürzen}']],
        'si-erwartungswert': [['=\\frac{21}{6}', '\\text{addieren}'], ['=3{,}5', '\\text{kürzen}']],
        'si-spiel':         [['=2-2{,}4', '\\text{ausrechnen}'], ['=-0{,}4', '\\text{ausrechnen}']],
        'si-einsatz':       [['=1{,}5-2', '\\text{ausrechnen}'], ['=-0{,}5', '\\text{ausrechnen}']],
        'si-fair':          [['2-0{,}8x=0', '\\text{ausrechnen}'], ['2=0{,}8x', '+0{,}8x'], ['x=2{,}5', ':0{,}8']],
        'si-summe-sieben':  [['=\\frac{1}{6}', '\\text{kürzen}'], ['\\approx 0{,}167', '\\text{Taschenrechner}']],
        'si-muenzen':       [['=\\frac{1}{1024}', '\\text{Potenz ausrechnen}'], ['\\approx 0{,}001', '\\text{Taschenrechner}']],
        'si-geburtstag':    [['=\\frac{1}{365}', '\\text{ausrechnen}'], ['\\approx 0{,}0027', '\\text{Taschenrechner}']],
        'si-geburtstag-drei': [['\\approx 1-0{,}9918', '\\text{Taschenrechner}'], ['\\approx 0{,}0082', '\\text{ausrechnen}']],
        'si-fehler':        [['=\\frac{1}{100}', '\\text{Wurzel ziehen}'], ['=0{,}01', '\\text{als Dezimalzahl}']],
        'si-laeufe':        [['1=0{,}01\\sqrt{n}', '\\cdot\\sqrt{n}'], ['\\sqrt{n}=100', ':0{,}01'], ['n=10000', '\\text{quadrieren}']],
        'si-nuss':          [['=1-\\frac{625}{1296}', '\\text{Potenz ausrechnen}'], ['=\\frac{671}{1296}', '\\text{ausrechnen}'],
                             ['\\approx 0{,}518', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'si-haeufigkeit':
            'Erwartet wären $100$ Sechsen in $600$ Würfen, $\\frac{1}{6}\\approx 0{,}167$. Gefallen sind $95$, also $0{,}158$.' +
            '\n\nDas ist kein Beweis für einen gezinkten Würfel – solche Abweichungen sind bei $600$ Würfen normal. ' +
            'Das Gesetz der großen Zahlen sagt nur: auf lange Sicht nähert sich die relative Häufigkeit der Wahrscheinlichkeit.',
        'si-wuerfel':
            'Die Zufallszahl $0{,}73$ liegt zwischen $0$ und $1$. Mal $6$ gibt $4{,}38$, abgerundet $4$, plus $1$: die gewürfelte Augenzahl ist $5$.' +
            '\n\nSo wird aus jeder Zufallszahl in $[0;1)$ eine der Zahlen $1$ bis $6$, jede gleich oft.',
        'si-laeufe':
            'Faustregel: der Fehler einer Simulation mit $n$ Läufen liegt in der Größenordnung $\\frac{1}{\\sqrt{n}}$.' +
            '\n\nFür zwei sichere Nachkommastellen braucht es also etwa $10\\,000$ Läufe. Zehnmal genauer kostet hundertmal so viele Läufe.',
    });
    aufgabenTexte({
        'si-erwartet':      'Ein Würfel wird $600$-mal geworfen. Wie viele Sechsen sind zu erwarten?',
        'si-haeufigkeit':   'In $600$ Würfen fiel $95$-mal die Sechs. Wie groß ist die relative Häufigkeit?',
        'si-anteil':        'In einer Stichprobe von $200$ Befragten antworten $154$ mit Ja. Wie groß ist die relative Häufigkeit?',
        'si-anzahl':        'Ein Ereignis mit der Wahrscheinlichkeit $0{,}3$ wird $200$-mal simuliert. Wie oft tritt es etwa ein?',
        'si-wuerfel':       'Ein Würfelwurf aus der Zufallszahl $0{,}73$: erst mal $6$, dann abrunden und $1$ dazu.',
        'si-grenze':        'Ein Glücksrad mit den Anteilen $50\\,\\%$, $30\\,\\%$, $20\\,\\%$ auf $[0;1)$: wo endet der zweite Abschnitt?',
        'si-schaetzen':     'In $5000$ Simulationsläufen trat das Ereignis $1512$-mal ein. Welcher Schätzwert ergibt sich für die Wahrscheinlichkeit?',
        'si-abweichung':    'Eine Simulation mit $50\\,000$ Läufen liefert $0{,}504$ statt $0{,}5$. Wie groß ist die Abweichung?',
        'si-mittel':        'Vier Simulationen liefern $0{,}48$, $0{,}52$, $0{,}51$ und $0{,}49$. Wie groß ist der Mittelwert?',
        'si-erwartungswert': 'Welche Augenzahl zeigt ein fairer Würfel im Mittel?',
        'si-spiel':         'Man gewinnt mit $P=0{,}2$ zehn Euro, sonst verliert man drei Euro. Wie groß ist der erwartete Gewinn pro Spiel?',
        'si-einsatz':       'Ein Spiel kostet $2$ € Einsatz und zahlt mit $P=0{,}25$ genau $6$ € aus. Wie groß ist der erwartete Gewinn?',
        'si-fair':          'Man gewinnt mit $P=0{,}2$ zehn Euro. Wie viel darf man sonst verlieren ($x$ Euro), damit das Spiel fair ist?',
        'si-summe-sieben':  'Zwei Würfel: $6$ der $36$ Ergebnisse haben die Augensumme $7$. Wie groß ist die Wahrscheinlichkeit?',
        'si-muenzen':       'Zehn Münzen werden geworfen. Wie groß ist die Wahrscheinlichkeit für zehnmal Kopf?',
        'si-geburtstag':    'Zwei Personen: wie groß ist die Wahrscheinlichkeit, dass sie am selben Tag Geburtstag haben?',
        'si-geburtstag-drei': 'Drei Personen: wie groß ist die Wahrscheinlichkeit, dass mindestens zwei am selben Tag Geburtstag haben?',
        'si-fehler':        'Wie groß ist der Fehler einer Simulation mit $10\\,000$ Läufen nach der Faustregel $\\frac{1}{\\sqrt{n}}$?',
        'si-laeufe':        'Wie viele Läufe $n$ braucht eine Simulation für einen Fehler von etwa $0{,}01$?',
        'si-nuss':          'Ein Würfel wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs – der Wert, den eine Simulation schätzen würde?',
    });
})();
