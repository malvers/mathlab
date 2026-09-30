// Block "Modellieren · Anwendungsaufgaben" - week 9 of 2027, Mathe BGY 11, the plan's "Komplexe Anwendungsaufgaben
// Funktionen" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an den schon vorhandenen Aufgaben
// orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks, easy to hard, after the week's
// quiz (mathetest11-modellieren.html): the taxi 3.50 € + 2.20 €/km, the lake with 12 000 fish and +6 %, the phone
// tariff, a rate of change in cm/h, buses for 1000 people, the profit G(x) = -0.5x² + 40x - 300, the cooling drink
// T(t) = 20 + 60·0.9^t, two offers, a line from two measurements, a result that makes no sense (t = -3.2 h), the ticket
// price with the most revenue - and the nut: the largest field along a river with 100 m of fence.
// Every step checked with sympy (the same solutions as the task, "≈" by its rounding), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['mo-taxi',         'K=3{,}50+2{,}20\\cdot 12',                   'K'],
        ['mo-kuehl-start',  'T=20+60\\cdot 0{,}9^0',                      'T'],
        ['mo-handy',        '10+2\\cdot(8-5)',                            ''],
        ['mo-rate',         '\\frac{120-80}{5}',                          ''],
        ['mo-taxi-km',      '3{,}50+2{,}20x=25{,}50',                     'x'],
        ['mo-angebote',     '50+0{,}3x=20+0{,}5x',                        'x'],
        ['mo-busse',        '45n=1000',                                   'n'],
        ['mo-anstieg',      'm=\\frac{60-80}{6-2}',                       'm'],
        ['mo-achse',        '80=-5\\cdot 2+b',                            'b'],
        ['mo-negativ',      '-5t+20=36',                                  't'],
        ['mo-fische',       '12000\\cdot 1{,}06^2',                       ''],
        ['mo-zylinder',     'h=\\frac{2000}{\\pi\\cdot 10^2}',            'h'],
        ['mo-zinseszins',   '1000\\cdot 1{,}04^{10}',                     ''],
        ['mo-fische-wann',  '12000\\cdot 1{,}06^n=18000',                 'n'],
        ['mo-kuehl-wann',   '20+60\\cdot 0{,}9^t=50',                     't'],
        ['mo-gewinn',       '-0{,}5x^2+40x-300',                          ''],
        ['mo-schwelle',     '-0{,}5x^2+40x-300=0',                        'x'],
        ['mo-tickets',      'p(500-20p)',                                 ''],
        ['mo-feld',         'x(100-2x)',                                  ''],
        ['mo-nuss',         '0{,}9^t=\\frac{1}{6}',                       't'],
    );
    wochenBlock('modellieren', ab);
    Object.assign(LOESUNGEN, {
        'mo-taxi':          [['K=3{,}50+26{,}40', '\\text{ausrechnen}'], ['K=29{,}90', '\\text{ausrechnen}']],
        'mo-kuehl-start':   [['T=20+60', '0{,}9^0=1'], ['T=80', '\\text{ausrechnen}']],
        'mo-handy':         [['=10+6', '\\text{ausrechnen}'], ['=16', '\\text{ausrechnen}']],
        'mo-rate':          [['=\\frac{40}{5}', '\\text{ausrechnen}'], ['=8', '\\text{kürzen}']],
        'mo-taxi-km':       [['2{,}20x=22', '-3{,}50'], ['x=10', ':2{,}20']],
        'mo-angebote':      [['30=0{,}2x', '-20-0{,}3x'], ['x=150', ':0{,}2']],
        'mo-busse':         [['n=\\frac{1000}{45}', ':45'], ['n\\approx 22{,}2', '\\text{runden}']],
        'mo-anstieg':       [['m=\\frac{-20}{4}', '\\text{ausrechnen}'], ['m=-5', '\\text{kürzen}']],
        'mo-achse':         [['80=-10+b', '\\text{ausrechnen}'], ['b=90', '+10']],
        'mo-negativ':       [['-5t=16', '-20'], ['t=-3{,}2', ':(-5)']],
        'mo-fische':        [['=12000\\cdot 1{,}1236', '\\text{Potenz ausrechnen}'], ['=13483{,}2', '\\text{ausrechnen}']],
        'mo-zylinder':      [['h=\\frac{2000}{100\\pi}', '\\text{ausrechnen}'], ['h=\\frac{20}{\\pi}', '\\text{kürzen}'], ['h\\approx 6{,}37', '\\text{runden}']],
        'mo-zinseszins':    [['\\approx 1000\\cdot 1{,}4802', '\\text{Taschenrechner}'], ['\\approx 1480{,}2', '\\text{ausrechnen}']],
        'mo-fische-wann':   [['1{,}06^n=1{,}5', ':12000'], ['n=\\frac{\\ln 1{,}5}{\\ln 1{,}06}', '\\ln,\\ \\text{Potenzregel}'],
                             ['n\\approx 6{,}96', '\\text{Taschenrechner}']],
        'mo-kuehl-wann':    [['60\\cdot 0{,}9^t=30', '-20'], ['0{,}9^t=0{,}5', ':60'], ['t=\\frac{\\ln 0{,}5}{\\ln 0{,}9}', '\\ln,\\ \\text{Potenzregel}'],
                             ['t\\approx 6{,}58', '\\text{Taschenrechner}']],
        'mo-gewinn':        [['=-0{,}5(x^2-80x)-300', '\\text{ausklammern}'], ['=-0{,}5(x^2-80x+1600-1600)-300', '\\text{quadratische Ergänzung}'],
                             ['=-0{,}5(x-40)^2+800-300', '\\text{binomische Formel}'], ['=-0{,}5(x-40)^2+500', '\\text{zusammenfassen}']],
        'mo-schwelle':      [['x^2-80x+600=0', '\\cdot(-2)'], ['x_{1,2}=40\\pm\\sqrt{1600-600}', '\\text{pq-Formel}'],
                             ['x_{1,2}=40\\pm\\sqrt{1000}', '\\text{ausrechnen}'], ['x_1\\approx 71{,}62\\quad x_2\\approx 8{,}38', '\\text{runden}']],
        'mo-tickets':       [['=-20p^2+500p', '\\text{ausmultiplizieren}'], ['=-20(p^2-25p)', '\\text{ausklammern}'],
                             ['=-20(p^2-25p+156{,}25-156{,}25)', '\\text{quadratische Ergänzung}'], ['=-20(p-12{,}5)^2+3125', '\\text{binomische Formel}']],
        'mo-feld':          [['=-2x^2+100x', '\\text{ausmultiplizieren}'], ['=-2(x^2-50x)', '\\text{ausklammern}'],
                             ['=-2(x^2-50x+625-625)', '\\text{quadratische Ergänzung}'], ['=-2(x-25)^2+1250', '\\text{binomische Formel}']],
        'mo-nuss':          [['t=\\frac{\\ln\\frac{1}{6}}{\\ln 0{,}9}', '\\ln,\\ \\text{Potenzregel}'], ['t=\\frac{-\\ln 6}{\\ln 0{,}9}', '\\ln\\frac{1}{a}=-\\ln a'],
                             ['t\\approx 17{,}01', '\\text{Taschenrechner}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'mo-negativ':
            'Rechnerisch richtig, im Modell sinnlos: $t=-3{,}2$ Stunden läge vor dem Beginn der Messung.' +
            '\n\nZur vollständigen Lösung gehört der Satz dazu: Der Wasserstand $36$ cm wird im betrachteten Zeitraum nicht erreicht.',
        'mo-busse':
            '$22{,}2$ Busse gibt es nicht. Mit $22$ Bussen fahren nur $990$ Personen mit – es braucht $23$ Busse.' +
            '\n\nHier wird aufgerundet, nicht gerundet: das Ergebnis muss zur Frage passen.',
        'mo-nuss':
            'Das Getränk kühlt von $80$ °C auf $30$ °C, wenn $60\\cdot 0{,}9^t=10$ ist, also $0{,}9^t=\\frac{1}{6}$.' +
            '\n\nNach $17$ Minuten ist es trinkwarm. Bei $20$ °C käme es nie an: $0{,}9^t$ wird nie $0$ – die Raumtemperatur ist die Asymptote.',
    });
    aufgabenTexte({
        'mo-taxi':       'Ein Taxi kostet $3{,}50$ € Grundpreis und $2{,}20$ € je Kilometer. Was kostet eine Fahrt über $12$ km?',
        'mo-kuehl-start': 'Ein Kühlvorgang: $T(t)=20+60\\cdot 0{,}9^t$. Welche Temperatur hat das Getränk am Anfang?',
        'mo-handy':      'Ein Handytarif: $10$ € für $5$ GB, danach $2$ € je angefangenem GB. Was kosten $8$ GB?',
        'mo-rate':       'Der Wasserstand steigt in $5$ Stunden von $80$ cm auf $120$ cm. Wie groß ist die Änderungsrate in cm/h?',
        'mo-taxi-km':    'Das Taxi ($3{,}50$ € Grundpreis, $2{,}20$ € je km): wie weit kommt man für $25{,}50$ €?',
        'mo-angebote':   'Angebot A: $50$ € fest und $0{,}30$ € je Stück. Angebot B: $20$ € fest und $0{,}50$ € je Stück. Wann sind beide gleich teuer?',
        'mo-busse':      '$1000$ Personen sollen mit Bussen zu je $45$ Plätzen fahren. Wie viele Busse braucht es?',
        'mo-anstieg':    'Zwei Messungen: $(2\\mid 80)$ und $(6\\mid 60)$. Welchen Anstieg hat das lineare Modell?',
        'mo-achse':      'Das Modell $y=-5x+b$ geht durch $(2\\mid 80)$. Wie groß ist $b$?',
        'mo-negativ':    'Der Wasserstand ist $h(t)=-5t+20$ (cm, $t$ in h). Wann wäre er $36$ cm hoch?',
        'mo-fische':     'Ein See enthält $12\\,000$ Fische, der Bestand wächst um $6\\,\\%$ jährlich. Wie viele sind es nach zwei Jahren?',
        'mo-zylinder':   'In einen Zylinder mit $r=10$ cm fließen $2000\\ \\mathrm{cm^3}$ Wasser. Wie hoch steht es?',
        'mo-zinseszins': '$1000$ € werden zehn Jahre lang mit $4\\,\\%$ verzinst. Wie viel ist dann da?',
        'mo-fische-wann': 'Der Fischbestand von $12\\,000$ wächst um $6\\,\\%$ jährlich. Wann sind es $18\\,000$?',
        'mo-kuehl-wann': 'Das Getränk mit $T(t)=20+60\\cdot 0{,}9^t$: wann ist es $50$ °C warm?',
        'mo-gewinn':     'Der Gewinn $G(x)=-0{,}5x^2+40x-300$ soll maximal werden. Bringe den Term in die Scheitelform.',
        'mo-schwelle':   'Der Betrieb mit $G(x)=-0{,}5x^2+40x-300$: zwischen welchen Stückzahlen macht er Gewinn?',
        'mo-tickets':    'Beim Preis $p$ werden $500-20p$ Tickets verkauft. Bei welchem Preis ist die Einnahme $p(500-20p)$ am größten?',
        'mo-feld':       'Ein Feld am Fluss wird mit $100$ m Zaun auf drei Seiten eingefasst: Breite $x$, Länge $100-2x$. Welche Fläche ist höchstens möglich?',
        'mo-nuss':       'Das Getränk kühlt gemäß $T(t)=20+60\\cdot 0{,}9^t$. Wann ist es $30$ °C warm? Dann muss $0{,}9^t=\\frac{1}{6}$ sein.',
    });
})();
