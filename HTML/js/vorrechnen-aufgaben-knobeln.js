// Block "Knobeln · Ziffernrätsel" (Doc, 28.09.2026: "Kannst Du solche Aufgaben auch machen für
// vorrechnen?" - after the picture MATH + ATH + TH + H = 5000, M + A + T + H = ?). Letters are digits,
// different letters different digits, no number starts with 0. Easy to hard, SEND + MORE = MONEY last.
// The steps are a deduction, not a chain of equivalences: a line may follow from an earlier one, and the
// note beside it says why (Einerstelle, "A ≤ 9", ...). No variable (third field ''), the head says what the
// block's kopf says. Checked by brute force over all digit assignments: the answer (last line) is the same in
// every solution and every step holds in every one - AB + BA = 121 has eight, but A + B = 11 in all of them.
// All formulas and notes render with the lab's KaTeX 0.16.8 (strict, no warnings).
// Three easy ones in front (Doc, 28.09.: "selbst die zweite Aufgabe und die erste Aufgabe sind schon ganz
// schön ... drei einfache vorne dran"): one letter with the tens given, one letter times 6, then two letters -
// each with exactly one solution (brute force).
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['k-einsa',    '\\mathrm{A}+\\mathrm{A}+\\mathrm{A}=\\mathrm{1A}',                                  ''],
        ['k-mal6',     '\\mathrm{A}\\cdot 6=\\mathrm{4A}',                                                  ''],
        ['k-ab5a',     '\\mathrm{AB}+\\mathrm{B}=\\mathrm{5A}',                                             ''],
        ['k-dreimal',  '\\mathrm{A}+\\mathrm{A}+\\mathrm{A}=\\mathrm{BA}',                                  ''],
        ['k-summe',    '\\mathrm{AB}+\\mathrm{BA}=121,\\quad A+B=\\,?',                                     ''],
        ['k-neun',     '\\mathrm{AB}\\cdot 9=\\mathrm{A0B}',                                                ''],
        ['k-cab',      '\\mathrm{AB}+\\mathrm{AB}+\\mathrm{AB}=\\mathrm{CAB}',                              ''],
        ['k-cac',      '\\mathrm{AB}+\\mathrm{BA}=\\mathrm{CAC}',                                           ''],
        ['k-abc',      '\\mathrm{AA}+\\mathrm{BB}+\\mathrm{CC}=\\mathrm{ABC}',                              ''],
        ['k-ccc',      '\\mathrm{ABC}+\\mathrm{ABC}+\\mathrm{ABC}=\\mathrm{CCC}',                           ''],
        ['k-1089',     '\\mathrm{ABCD}\\cdot 9=\\mathrm{DCBA}',                                             ''],
        ['k-math',     '\\mathrm{MATH}+\\mathrm{ATH}+\\mathrm{TH}+\\mathrm{H}=5000,\\quad M+A+T+H=\\,?',    ''],
        ['k-money',    '\\mathrm{SEND}+\\mathrm{MORE}=\\mathrm{MONEY}',                                     ''],
    );
    BLOECKE.push({ titel: 'Knobeln · Ziffernrätsel', ab, bis: AUFGABEN.length, kopf: 'Ziffern finden' });
    Object.assign(LOESUNGEN, {
        'k-einsa':    [['A\\cdot 3=10+A', '\\text{Stellenwerte}'],
                      ['A\\cdot 2=10', '-A'],
                      ['A=5', ':2']],
        'k-mal6':     [['A\\cdot 6=40+A', '\\text{Stellenwerte}'],
                      ['A\\cdot 5=40', '-A'],
                      ['A=8', ':5']],
        'k-ab5a':     [['A\\cdot 10+B\\cdot 2=50+A', '\\text{Stellenwerte}'],
                      ['A\\cdot 9+B\\cdot 2=50', '-A'],
                      ['A=4', '\\text{A gerade, }B\\le 9'],
                      ['B\\cdot 2=14', '\\text{einsetzen}'],
                      ['B=7', ':2'],
                      ['\\mathrm{AB}=47', '\\text{einsetzen}']],
        'k-dreimal':  [['A\\cdot 3=B\\cdot 10+A', '\\text{Stellenwerte}'],
                      ['A\\cdot 2=B\\cdot 10', '-A'],
                      ['A=B\\cdot 5', ':2'],
                      ['B=1', 'A\\le 9,\\;B\\ne 0'],
                      ['A=5', '\\text{einsetzen}'],
                      ['\\mathrm{BA}=15', '\\text{einsetzen}']],
        'k-summe':    [['A\\cdot 10+B+B\\cdot 10+A=121', '\\text{Stellenwerte}'],
                      ['A\\cdot 11+B\\cdot 11=121', '\\text{zusammenfassen}'],
                      ['A+B=11', ':11']],
        'k-neun':     [['A\\cdot 90+B\\cdot 9=A\\cdot 100+B', '\\text{Stellenwerte}'],
                      ['B\\cdot 8=A\\cdot 10', '-A\\cdot 90-B'],
                      ['B\\cdot 4=A\\cdot 5', ':2'],
                      ['A=4', '\\text{A durch 4 teilbar, }B\\le 9'],
                      ['B=5', '\\text{einsetzen}'],
                      ['\\mathrm{AB}=45', '\\text{einsetzen}']],
        'k-cab':      [['A\\cdot 30+B\\cdot 3=C\\cdot 100+A\\cdot 10+B', '\\text{Stellenwerte}'],
                      ['A\\cdot 20+B\\cdot 2=C\\cdot 100', '-A\\cdot 10-B'],
                      ['A\\cdot 10+B=C\\cdot 50', ':2'],
                      ['C=1', '\\text{AB ist zweistellig}'],
                      ['\\mathrm{AB}=50', '\\text{einsetzen}'],
                      ['\\mathrm{CAB}=150', '\\text{einsetzen}']],
        'k-cac':      [['A\\cdot 11+B\\cdot 11=C\\cdot 101+A\\cdot 10', '\\text{Stellenwerte}'],
                      ['C=1', '\\text{Summe kleiner als 200}'],
                      ['A\\cdot 11+B\\cdot 11=101+A\\cdot 10', '\\text{einsetzen}'],
                      ['A+B\\cdot 11=101', '-A\\cdot 10'],
                      ['B=9', '1\\le A\\le 9'],
                      ['A=2', '\\text{einsetzen}'],
                      ['\\mathrm{CAC}=121', '\\text{einsetzen}']],
        'k-abc':      [['A\\cdot 11+B\\cdot 11+C\\cdot 11=A\\cdot 100+B\\cdot 10+C', '\\text{Stellenwerte}'],
                      ['B+C\\cdot 10=A\\cdot 89', '-A\\cdot 11-B\\cdot 10-C'],
                      ['A=1', '\\text{links höchstens 99}'],
                      ['B+C\\cdot 10=89', '\\text{einsetzen}'],
                      ['\\mathrm{CB}=89', '\\text{Stellenwerte}'],
                      ['\\mathrm{ABC}=198', '\\text{einsetzen}']],
        'k-ccc':      [['A\\cdot 300+B\\cdot 30+C\\cdot 3=C\\cdot 111', '\\text{Stellenwerte}'],
                      ['A\\cdot 300+B\\cdot 30=C\\cdot 108', '-C\\cdot 3'],
                      ['A\\cdot 50+B\\cdot 5=C\\cdot 18', ':6'],
                      ['C=5', '\\text{links durch 5 teilbar, }C\\ne 0'],
                      ['A\\cdot 50+B\\cdot 5=90', '\\text{einsetzen}'],
                      ['A\\cdot 10+B=18', ':5'],
                      ['\\mathrm{ABC}=185', '\\text{Stellenwerte}']],
        'k-1089':     [['A=1', '\\text{Produkt höchstens vierstellig}'],
                      ['D=9', 'D\\cdot 9\\text{ endet auf }1'],
                      ['B=0', 'B\\le 1,\\;B\\ne A'],
                      ['C=8', 'C\\cdot 9+8\\text{ endet auf }0'],
                      ['\\mathrm{ABCD}=1089', '\\text{Probe: }1089\\cdot 9=9801']],
        'k-math':     [['M\\cdot 1000+A\\cdot 200+T\\cdot 30+H\\cdot 4=5000', '\\text{Stellenwerte}'],
                      ['H=5', '\\text{Einerstelle}'],
                      ['M\\cdot 1000+A\\cdot 200+T\\cdot 30+20=5000', '\\text{einsetzen}'],
                      ['M\\cdot 1000+A\\cdot 200+T\\cdot 30=4980', '-20'],
                      ['M\\cdot 100+A\\cdot 20+T\\cdot 3=498', ':10'],
                      ['T=6', 'T\\cdot 3\\text{ endet auf }8'],
                      ['M\\cdot 100+A\\cdot 20+18=498', '\\text{einsetzen}'],
                      ['M\\cdot 100+A\\cdot 20=480', '-18'],
                      ['M\\cdot 5+A=24', ':20'],
                      ['M=3', 'A\\le 9,\\;A\\ne M'],
                      ['A=9', '\\text{einsetzen}'],
                      ['M+A+T+H=23', '\\text{addieren}']],
        'k-money':    [['M=1', '\\text{Übertrag}'],
                      ['O=0', 'O\\le 1,\\;O\\ne M'],
                      ['S=9', '\\text{Hunderter ohne Übertrag}'],
                      ['N=E+1', '\\text{Hunderterstelle}'],
                      ['R=8', '\\text{Zehnerstelle, }R\\ne S'],
                      ['D+E=Y+10', '\\text{Einerstelle}'],
                      ['E=5', '\\text{übrig }2\\ldots 7,\\;D+E\\ge 12'],
                      ['N=6', '\\text{einsetzen}'],
                      ['D=7', 'D+5\\ge 12'],
                      ['Y=2', '\\text{einsetzen}'],
                      ['\\mathrm{MONEY}=10652', '\\text{einsetzen}']],
    });
    // Every task also stands "untereinander" on the board (SCHEMATA, Doc 28.09.), as on paper: the rows
    // right-aligned digit by digit, the sign right before the last row, a rule, the result. The two products
    // have none ("lass es bei den beiden Produkten links oben weg")
    Object.assign(SCHEMATA, {
        'k-einsa':   { zeilen: ['A', 'A', 'A'], zeichen: '+', ergebnis: '1A' },
        'k-ab5a':    { zeilen: ['AB', 'B'], zeichen: '+', ergebnis: '5A' },
        'k-dreimal': { zeilen: ['A', 'A', 'A'], zeichen: '+', ergebnis: 'BA' },
        'k-summe':   { zeilen: ['AB', 'BA'], zeichen: '+', ergebnis: '121' },
        'k-cab':     { zeilen: ['AB', 'AB', 'AB'], zeichen: '+', ergebnis: 'CAB' },
        'k-cac':     { zeilen: ['AB', 'BA'], zeichen: '+', ergebnis: 'CAC' },
        'k-abc':     { zeilen: ['AA', 'BB', 'CC'], zeichen: '+', ergebnis: 'ABC' },
        'k-ccc':     { zeilen: ['ABC', 'ABC', 'ABC'], zeichen: '+', ergebnis: 'CCC' },
        'k-math':    { zeilen: ['MATH', 'ATH', 'TH', 'H'], zeichen: '+', ergebnis: '5000' },
        'k-money':   { zeilen: ['SEND', 'MORE'], zeichen: '+', ergebnis: 'MONEY' },
    });
    // Doc, 28.09.: "Blende mir hier im Preview einen ausführlichen Erklärungstext ein" - the reasoning behind
    // the steps above, for Doc under the preview (ERKLAERUNGEN, js/vorrechnen-aufgaben.js); every claim checked
    // against the steps and by hand (which digits are left, which cases fall away)
    Object.assign(ERKLAERUNGEN, {
        // each derivation as a chain of equations set off, with its operation behind it (Doc, 28.09.: "ordentliche
        // Gleichungen ... und natürlich LaTeX", "hinter die Gleichung immer die Operation") - $$equation | op$$
        'k-einsa':
            '$\\mathrm{1A}$ ist zweistellig: 1 Zehner und A Einer. Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 3=10+A | \\text{Stellenwerte}$$' +
            '$$A\\cdot 2=10 | -A$$' +
            '$$A=5 | :2$$' +
            'Probe:$$5+5+5=15$$',
        'k-mal6':
            '$\\mathrm{4A}$ heißt 4 Zehner und A Einer. Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 6=40+A | \\text{Stellenwerte}$$' +
            '$$A\\cdot 5=40 | -A$$' +
            '$$A=8 | :5$$' +
            'Es geht auch mit Probieren: Welche Ziffer mal 6 endet wieder auf dieselbe Ziffer? 2, 4, 6 und 8 ' +
            '($12$, $24$, $36$, $48$) – und mit 4 vorne steht nur$$8\\cdot 6=48$$',
        'k-ab5a':
            'Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 10+B\\cdot 2=50+A | \\text{Stellenwerte}$$' +
            '$$A\\cdot 9+B\\cdot 2=50 | -A$$' +
            '$B\\cdot 2$ ist gerade, also muss auch $A\\cdot 9$ gerade sein: $A$ ist gerade. Und $B\\cdot 2$ liegt ' +
            'zwischen 0 und 18, also $A\\cdot 9$ zwischen 32 und 50 – das sind 36 und 45, gerade ist nur $A=4$:' +
            '$$36+B\\cdot 2=50 | \\text{einsetzen}$$' +
            '$$B\\cdot 2=14 | -36$$' +
            '$$B=7 | :2$$' +
            'Also $\\mathrm{AB}=47$. Probe:$$47+7=54$$',
        'k-dreimal':
            '$\\mathrm{BA}$ ist zweistellig: B Zehner und A Einer. Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 3=B\\cdot 10+A | \\text{Stellenwerte}$$' +
            '$$A\\cdot 2=B\\cdot 10 | -A$$' +
            '$$A=B\\cdot 5 | :2$$' +
            '$A$ ist eine Ziffer, also höchstens 9, und $B$ steht vorne, ist also nicht 0. Das lässt nur $B=1$ und $A=5$. ' +
            'Probe:$$5+5+5=15$$',
        'k-summe':
            'Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 10+B+B\\cdot 10+A=121 | \\text{Stellenwerte}$$' +
            '$$A\\cdot 11+B\\cdot 11=121 | \\text{zusammenfassen}$$' +
            '$$A+B=11 | :11$$' +
            'Welche Ziffern es sind, verrät die Aufgabe nicht: $29+92$, $38+83$, $47+74$, $56+65$ und dieselben Paare ' +
            'andersherum – acht Lösungen. In allen ist die Summe 11, und nur danach ist gefragt.\n\n' +
            'Zum Weiterdenken: Zahl plus Spiegelzahl ist immer ein Vielfaches von 11.',
        'k-neun':
            'Links die zweistellige Zahl $\\mathrm{AB}$ mal 9, rechts die dreistellige $\\mathrm{A0B}$ mit null Zehnern. ' +
            'Mit Stellenwerten heißt die Aufgabe' +
            '$$(A\\cdot 10+B)\\cdot 9=A\\cdot 100+B | \\text{Stellenwerte}$$' +
            '$$A\\cdot 90+B\\cdot 9=A\\cdot 100+B | \\text{ausmultiplizieren}$$' +
            '$$B\\cdot 8=A\\cdot 10 | -A\\cdot 90-B$$' +
            '$$B\\cdot 4=A\\cdot 5 | :2$$' +
            'Links steht ein Vielfaches von 4 – dann muss auch $A\\cdot 5$ durch 4 teilbar sein, und weil 5 und 4 keinen ' +
            'gemeinsamen Teiler haben, ist $A$ selbst durch 4 teilbar: $A=4$ oder $A=8$. Mit $A=8$ wäre $B=10$, keine ' +
            'Ziffer. Also $A=4$:' +
            '$$B\\cdot 4=20 | \\text{einsetzen}$$' +
            '$$B=5 | :4$$' +
            'Probe:$$45\\cdot 9=405$$',
        'k-cab':
            'Dreimal die zweistellige Zahl $\\mathrm{AB}$ ergibt die dreistellige $\\mathrm{CAB}$ – hinten steht wieder ' +
            '$\\mathrm{AB}$. Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 30+B\\cdot 3=C\\cdot 100+A\\cdot 10+B | \\text{Stellenwerte}$$' +
            '$$A\\cdot 20+B\\cdot 2=C\\cdot 100 | -A\\cdot 10-B$$' +
            '$$A\\cdot 10+B=C\\cdot 50 | :2$$' +
            'Links steht genau $\\mathrm{AB}$. Es ist zweistellig, also höchstens 99, und $C$ steht vorne, ist also nicht 0. ' +
            'Nur $C=1$ passt: $\\mathrm{AB}=50$ und $\\mathrm{CAB}=150$. Die 0 ist erlaubt – sie steht ja nicht vorne. ' +
            'Probe:$$50+50+50=150$$',
        'k-cac':
            'Links wie bei der Aufgabe mit 121, rechts $\\mathrm{CAC}$ mit C Hundertern, A Zehnern und C Einern:' +
            '$$A\\cdot 11+B\\cdot 11=C\\cdot 101+A\\cdot 10 | \\text{Stellenwerte}$$' +
            'Zwei zweistellige Zahlen ergeben zusammen weniger als 200, also ist $C=1$:' +
            '$$A\\cdot 11+B\\cdot 11=101+A\\cdot 10 | \\text{einsetzen}$$' +
            '$$A+B\\cdot 11=101 | -A\\cdot 10$$' +
            '$A$ liegt zwischen 1 und 9, also muss $B\\cdot 11$ zwischen 92 und 100 liegen. Das schafft nur $B=9$ mit 99:' +
            '$$A+99=101 | \\text{einsetzen}$$' +
            '$$A=2 | -99$$' +
            'Also $\\mathrm{CAC}=121$. Probe:$$29+92=121$$',
        'k-abc':
            'Eine Schnapszahl wie $\\mathrm{AA}$ ist $A\\cdot 11$ – A Zehner und A Einer. Mit Stellenwerten heißt die Aufgabe' +
            '$$A\\cdot 11+B\\cdot 11+C\\cdot 11=A\\cdot 100+B\\cdot 10+C | \\text{Stellenwerte}$$' +
            '$$B+C\\cdot 10=A\\cdot 89 | -A\\cdot 11-B\\cdot 10-C$$' +
            'Links steht die zweistellige Zahl $\\mathrm{CB}$, höchstens 99; rechts ein Vielfaches von 89. Das geht nur ' +
            'mit $A=1$:' +
            '$$B+C\\cdot 10=89 | \\text{einsetzen}$$' +
            'Also $\\mathrm{CB}=89$: $C=8$, $B=9$, und $\\mathrm{ABC}=198$. Probe:$$11+99+88=198$$',
        'k-ccc':
            'Dreimal $\\mathrm{ABC}$ ergibt die Schnapszahl $\\mathrm{CCC}$, also $C\\cdot 111$. Mit Stellenwerten heißt ' +
            'die Aufgabe' +
            '$$A\\cdot 300+B\\cdot 30+C\\cdot 3=C\\cdot 111 | \\text{Stellenwerte}$$' +
            '$$A\\cdot 300+B\\cdot 30=C\\cdot 108 | -C\\cdot 3$$' +
            '$$A\\cdot 50+B\\cdot 5=C\\cdot 18 | :6$$' +
            'Links steht ein Vielfaches von 5, also muss $C\\cdot 18$ durch 5 teilbar sein – das geht nur mit $C=0$ oder ' +
            '$C=5$, und $C=0$ scheidet aus, vorne steht keine 0. Mit $C=5$:' +
            '$$A\\cdot 50+B\\cdot 5=90 | \\text{einsetzen}$$' +
            '$$A\\cdot 10+B=18 | :5$$' +
            'Also $\\mathrm{AB}=18$ und $\\mathrm{ABC}=185$. Probe:$$185\\cdot 3=555$$',
        'k-1089':
            'Eine vierstellige Zahl mal 9 soll vierstellig bleiben und rückwärts herauskommen. Schon' +
            '$$1112\\cdot 9=10008$$' +
            'ist fünfstellig – also ist $\\mathrm{ABCD}$ höchstens 1111: $A=1$, und $B$ ist höchstens 1.\n\n' +
            'Das Ergebnis $\\mathrm{DCBA}$ endet auf $A=1$. Die Einerstelle von $D\\cdot 9$ ist 1 nur für $D=9$ ' +
            '(81, Übertrag 8). $B$ ist höchstens 1 und nicht gleich $A$, also $B=0$.\n\n' +
            'Zehnerstelle: $C\\cdot 9$ plus Übertrag 8 muss auf $B=0$ enden, und $C\\cdot 9+8$ endet auf 0 nur für ' +
            '$C=8$ (80). Also $\\mathrm{ABCD}=1089$. Probe, rückwärts gelesen:$$1089\\cdot 9=9801$$',
        'k-math':
            'Stellenwerte, Spalte für Spalte: M steht einmal als Tausender, A zweimal als Hunderter, T dreimal als ' +
            'Zehner, H viermal als Einer:' +
            '$$M\\cdot 1000+A\\cdot 200+T\\cdot 30+H\\cdot 4=5000 | \\text{Stellenwerte}$$' +
            'Einerstelle: $H\\cdot 4$ endet auf 0, also $H=0$ oder $H=5$. Mit $H=0$ müsste auch $T\\cdot 3$ auf 0 enden, ' +
            'also $T=0$ – zweimal dieselbe Ziffer, verboten. Also $H=5$:' +
            '$$M\\cdot 1000+A\\cdot 200+T\\cdot 30+20=5000 | \\text{einsetzen}$$' +
            '$$M\\cdot 1000+A\\cdot 200+T\\cdot 30=4980 | -20$$' +
            '$$M\\cdot 100+A\\cdot 20+T\\cdot 3=498 | :10$$' +
            '$T\\cdot 3$ endet auf 8, also $T=6$:' +
            '$$M\\cdot 100+A\\cdot 20+18=498 | \\text{einsetzen}$$' +
            '$$M\\cdot 100+A\\cdot 20=480 | -18$$' +
            '$$M\\cdot 5+A=24 | :20$$' +
            '$A$ ist höchstens 9, also $M=3$ mit $A=9$ ($M=4$ gäbe $A=4=M$). Gefragt:' +
            '$$M+A+T+H=3+9+6+5=23$$' +
            'Probe:$$3965+965+65+5=5000$$',
        // Doc, 28.09.: "10 versteh ich ja noch nicht mal mit Erklärung ... und was ist Y ???" - column by column,
        // as one adds on paper (the sum itself stands on the board, SCHEMATA); Y gets a step of its own
        'k-money':
            'Ganz vorne: Zwei vierstellige Zahlen ergeben höchstens 19998 – die fünfte Ziffer $M$ ist nur der ' +
            'Übertrag: $M=1$. Die Tausenderspalte $S+1$ (plus Übertrag) ergibt also 10 oder 11, und $O$ ist deren ' +
            'Einer: $O=0$, denn die 1 hat schon $M$.\n\n' +
            'Hunderter: $E+0$ soll $N$ ergeben, aber $N\\ne E$. Also kommt von den Zehnern eine 1 dazu:' +
            '$$N=E+1$$' +
            'Nach vorne geht kein Übertrag (sonst $E=9$ und $N=0$ wie $O$), also' +
            '$$S+1=10 | \\text{Tausenderspalte}$$' +
            '$$S=9 | -1$$' +
            'Zehner: $N+R$ plus Übertrag $c$ von den Einern ergibt $E+10$:' +
            '$$N+R+c=E+10 | \\text{Zehnerspalte}$$' +
            '$$E+1+R+c=E+10 | N=E+1$$' +
            '$$R=9-c | -E-1-c$$' +
            'Die 9 hat schon $S$, also $c=1$ und $R=8$.\n\n' +
            'Einer:$$D+E=Y+10 | \\text{Einerspalte}$$' +
            '$Y$ ist die Einerziffer von $D+E$, die 1 geht als Übertrag $c$ weiter. Frei sind noch 2 bis 7, und ' +
            '$Y\\ge 2$ heißt $D+E\\ge 12$. Das geht nur mit $E=5$, $N=6$, $D=7$ ($E=2,3,4$: $D$ zu groß; $E=6$: $N=7$, ' +
            'kein $D$ frei; $E=7$: $N=8$ wie $R$). Dann' +
            '$$7+5=Y+10 | \\text{einsetzen}$$' +
            '$$Y=2 | -10$$' +
            'Probe:$$9567+1085=10652$$',
    });
    // Doc, 28.09.: "ganz ans Ende ... als letzten Satz ... in alphabetischer Reihenfolge, welche Werte die
    // einzelnen Buchstaben annehmen" - the values, sorted A to Z here (put back into every task: it holds, and
    // no two letters share a digit). AB + BA = 121 has eight solutions: what holds instead.
    const WERTE = {
        'k-einsa':   { A: 5 },
        'k-mal6':    { A: 8 },
        'k-ab5a':    { A: 4, B: 7 },
        'k-dreimal': { A: 5, B: 1 },
        'k-neun':    { A: 4, B: 5 },
        'k-cab':     { A: 5, B: 0, C: 1 },
        'k-cac':     { A: 2, B: 9, C: 1 },
        'k-abc':     { A: 1, B: 9, C: 8 },
        'k-ccc':     { A: 1, B: 8, C: 5 },
        'k-1089':    { A: 1, B: 0, C: 8, D: 9 },
        'k-math':    { M: 3, A: 9, T: 6, H: 5 },
        'k-money':   { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
    };
    Object.entries(WERTE).forEach(([slug, w]) => {
        ERKLAERUNGEN[slug] += '\n\nDie Werte: ' + Object.keys(w).sort().map(b => '$' + b + '=' + w[b] + '$').join(', ') + '.';
    });
    // SEND + MORE = MONEY is Dudeney's (checked 28.09.2026: Strand Magazine vol. 68, July 1924, pp. 97 and 214)
    QUELLEN['k-money'] = 'Quelle: Henry E. Dudeney, The Strand Magazine 68, Juli 1924, S. 97 (Lösung S. 214)';
    ERKLAERUNGEN['k-summe'] += '\n\nDie Werte: nicht eindeutig – $A$ von 2 bis 9 und $B=11-A$.';
    // Doc, 28.09.: a dot wherever a number stands with a letter - "damit klar ist, das ist ja jetzt ein ganz
    // anderer Typ von Aufgaben" - the letter first ("A mal zehn": A = 5 reads 5 · 10), and the dot's gaps
    // "gefühlte 10 %" tighter: KaTeX keeps 4 mu a side for the operator, 0.5 mu less there (-12.5 %)
    // Doc, 28.09.: over every digit of a number written in letters its place value, very small ("schreib da
    // ganz klein drüber 10 1 (etc.)", then "zu groß", "grau") - in the tasks: AB gets 10 and 1, MONEY 10000 down
    // to 1. Grey, and half size is KaTeX's smallest: js/vorrechnen.css takes them further down by that grey.
    // As powers of ten, 10^3 for 1000 (Doc: "1000 -> 10^3 (hoch 3) probier mal das Muster"): all as wide as "10",
    // the exponent a size smaller (scriptstyle, its exponent scriptscript). Then: "bei den ersten 5 ... 100 10 1
    // dann Potenz" - the easier tasks written out, the last five as powers
    const AUSGESCHRIEBEN = 8;                // the three easy ones in front and the first five after them
    // The A of Computer Modern reaches 0.716, the flat capitals 0.683 (measured in KaTeX_Main; O, S, C overshoot
    // a little, as round letters do) - Doc, 28.09.: "ich denke nur das A ist höher ... bissl kleiner". In the
    // number words it goes as \textrm (the same font, a class of its own), js/vorrechnen.css sets it at 95.4 %.
    // A digit there ("die 0 zu klein": 0.666 against 0.683) goes as \textup, set like the round O (to 0.705).
    const buchstabe = z => z === 'A' ? '\\textrm{A}' : /\d/.test(z) ? '\\textup{' + z + '}' : '\\mathrm{' + z + '}';
    // The exponent takes no width (\mathrlap): the "10" stands centred over its letter, the power hangs out to the
    // right - centred as a whole, 10³ sat left of the letter (Doc, 28.09.: "sitzen nicht x-symmetrisch").
    const stellen = (w, potenz) => [...w].map((z, i) => {
        const k = w.length - 1 - i;
        return '\\overset{\\color{#8a93a3}\\scriptstyle ' + (potenz ? '10^{\\mathrlap{' + k + '}}' : 10 ** k) + '}' +
            '{' + buchstabe(z) + '\\vphantom{\\mathrm{A}}}';        // vphantom: over the 0 at letter height
    }).join('');
    // one letter is a number word too: the H of MATH + ATH + TH + H, the A of A + A + A ("warum hat H keine?")
    AUFGABEN.slice(ab).forEach((a, j) => {
        a[1] = a[1].replace(/\\mathrm\{([A-Z0-9]+)\}/g, (_, w) => stellen(w, j >= AUSGESCHRIEBEN));
    });
    const ENG = '\\mkern-0.5mu\\cdot\\mkern-0.5mu ';
    const woerter = s => s.replace(/\\mathrm\{([A-Z0-9]{2,})\}/g, (_, w) => [...w].map(buchstabe).join(''));
    AUFGABEN.slice(ab).forEach(([slug]) => LOESUNGEN[slug].forEach(z => {
        z[0] = woerter(z[0].replace(/\\cdot /g, ENG));
        z[1] = z[1].replace(/\\cdot /g, ENG);
    }));
})();
