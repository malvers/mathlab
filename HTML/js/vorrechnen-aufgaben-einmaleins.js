// Block "Eins mal eins · Aufwärmen" (Doc, 02.10.2026: "ein ganz einfachen Aufgabenblock. Der beginnt mit einmal eins.
// Eins plus eins. Eins geteilt durch eins. Eins geteilt durch null. Und hier klatscht es erst einmal. Dann ... tausend
// mal tausend? ... tausend mal eine Million? ... 20 Aufgaben, die schon schwerer werden. Aber auch irgendwie ein bisschen
// Fun", "neun mal neun ist 81. Und dann kannst du drei Aufgaben später fragen, wie viel ist 81 durch neun?") - for
// Informatik 9, a deck by theme (SAMMLUNGEN einmaleins) pinned to that plan's week 40. Every task that comes back
// stands three after its partner: 9·9 and 81:9, 11·11 and 121:11, 111·111 and 12321:111, 12345679·9 and 111111111:9.
// No variable (third field ''): the head says the block's kopf, the result is the solution's last step; 1:0 has none
// but the words. Numbers of five digits and more in groups of three (\,), as in the other blocks' texts. Every step
// checked in Python with exact fractions, every formula rendered with the lab's KaTeX (strict). Loaded last by
// vorrechnen.html and decks/tafel.html, so the stored task index of the blocks before it stays where it was.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['em-mal',        '1\\cdot 1',                              ''],
        ['em-plus',       '1+1',                                    ''],
        ['em-durch',      '1:1',                                    ''],
        ['em-null',       '1:0',                                    ''],
        ['em-million',    '1000\\cdot 1000',                        ''],
        ['em-milliarde',  '1000\\cdot 1\\,000\\,000',               ''],
        ['em-neun',       '9\\cdot 9',                              ''],
        ['em-null-oben',  '0:1',                                    ''],
        ['em-billion',    '1\\,000\\,000\\cdot 1\\,000\\,000',      ''],
        ['em-81',         '81:9',                                   ''],
        ['em-elf',        '11\\cdot 11',                            ''],
        ['em-kilo',       '2^{10}',                                 ''],
        ['em-111',        '111\\cdot 111',                          ''],
        ['em-121',        '121:11',                                 ''],
        ['em-halb',       '0{,}5\\cdot 0{,}5',                      ''],
        ['em-12321',      '12\\,321:111',                           ''],
        ['em-zauber',     '12\\,345\\,679\\cdot 9',                 ''],
        ['em-durch-halb', '1:0{,}5',                                ''],
        ['em-mega',       '1024\\cdot 1024',                        ''],
        ['em-rueckwaerts', '111\\,111\\,111:9',                     ''],
    );
    BLOECKE.push({ titel: 'Eins mal eins · Aufwärmen', ab, bis: AUFGABEN.length, kopf: 'ohne Taschenrechner' });
    Object.assign(LOESUNGEN, {
        'em-mal':         [['=1', '\\text{ausrechnen}']],
        'em-plus':        [['=2', '\\text{ausrechnen}']],
        'em-durch':       [['=1', '\\text{ausrechnen}']],
        'em-null':        [['\\text{nicht definiert}', '\\text{durch null teilt man nicht}']],
        'em-million':     [['=1\\,000\\,000', '\\text{Nullen zusammenzählen}']],
        'em-milliarde':   [['=1\\,000\\,000\\,000', '\\text{Nullen zusammenzählen}']],
        'em-neun':        [['=81', '\\text{Einmaleins}']],
        'em-null-oben':   [['=0', '\\text{Probe: }0\\cdot 1=0']],
        'em-billion':     [['=1\\,000\\,000\\,000\\,000', '\\text{Nullen zusammenzählen}']],
        'em-81':          [['=9', '\\text{Probe: }9\\cdot 9=81']],
        'em-elf':         [['=11\\cdot 10+11', '\\text{zerlegen}'],
                           ['=110+11', '\\text{ausrechnen}'],
                           ['=121', '\\text{ausrechnen}']],
        'em-kilo':        [['=2^5\\cdot 2^5', '\\text{zerlegen}'],
                           ['=32\\cdot 32', '\\text{ausrechnen}'],
                           ['=1024', '\\text{ausrechnen}']],
        'em-111':         [['=111\\cdot 100+111\\cdot 10+111', '\\text{zerlegen}'],
                           ['=11\\,100+1110+111', '\\text{ausrechnen}'],
                           ['=12\\,321', '\\text{ausrechnen}']],
        'em-121':         [['=11', '\\text{Probe: }11\\cdot 11=121']],
        'em-halb':        [['=\\frac{1}{2}\\cdot\\frac{1}{2}', '\\text{als Bruch}'],
                           ['=\\frac{1}{4}', '\\text{ausrechnen}'],
                           ['=0{,}25', '\\text{als Dezimalzahl}']],
        'em-12321':       [['=111', '\\text{Probe: }111\\cdot 111=12\\,321']],
        'em-zauber':      [['=12\\,345\\,679\\cdot(10-1)', '\\text{zerlegen}'],
                           ['=123\\,456\\,790-12\\,345\\,679', '\\text{ausmultiplizieren}'],
                           ['=111\\,111\\,111', '\\text{ausrechnen}']],
        'em-durch-halb':  [['=1:\\frac{1}{2}', '\\text{als Bruch}'],
                           ['=1\\cdot 2', '\\text{mal Kehrwert}'],
                           ['=2', '\\text{ausrechnen}']],
        'em-mega':        [['=1024\\cdot 1000+1024\\cdot 24', '\\text{zerlegen}'],
                           ['=1\\,024\\,000+24\\,576', '\\text{ausrechnen}'],
                           ['=1\\,048\\,576', '\\text{ausrechnen}']],
        'em-rueckwaerts': [['=12\\,345\\,679', '\\text{Aufgabe 17 rückwärts}']],
    });
    // the box behind the brain: single equations between text, so nothing for umformungenVorziehen to turn round
    Object.assign(ERKLAERUNGEN, {
        'em-null':
            'Teilen heißt rückwärts malnehmen: $1:1=1$, weil $1\\cdot 1=1$. Für $1:0$ bräuchte man eine Zahl, die mal 0 ' +
            'die 1 ergibt:' +
            '$$x\\cdot 0=1$$' +
            'Die gibt es nicht – alles mal 0 ist 0. Darum ist $1:0$ nicht definiert, und der Taschenrechner zeigt einen ' +
            'Fehler.' +
            '\n\nAuch in Programmen knallt es hier: „Division by zero“ bringt viele Programme zum Absturz.',
        'em-million':
            'Nullen zählen: $1000$ hat drei Nullen, zweimal drei sind sechs. Eine 1 mit sechs Nullen ist eine Million.',
        'em-milliarde':
            'Drei Nullen und sechs Nullen sind neun Nullen – eine Milliarde.' +
            '\n\nAchtung beim Englischen: Eine Milliarde heißt dort „one billion“.',
        'em-null-oben':
            'Andersherum geht es: Gesucht ist die Zahl, die mal 1 die 0 ergibt – das ist die 0. Probe: $0\\cdot 1=0$.' +
            '\n\nNull durch etwas ist 0, etwas durch null gibt es nicht (Aufgabe 4).',
        'em-billion':
            'Sechs Nullen und sechs Nullen sind zwölf Nullen: eine Billion, eine Million Millionen.' +
            '\n\nDie Falle: Auf Englisch ist „one billion“ nur unsere Milliarde. Unsere Billion heißt dort „one trillion“.',
        'em-81':
            'Das Einmaleins rückwärts – Aufgabe 7 war $9\\cdot 9=81$. Jede Teilung lässt sich so prüfen: Ergebnis mal ' +
            'Teiler muss wieder die Zahl geben.',
        'em-elf':
            'Mal 11 ist mal 10 und noch einmal dazu:' +
            '$$11\\cdot 11=110+11=121$$' +
            'Der Trick für zweistellige Zahlen mal 11: die beiden Ziffern auseinanderziehen und ihre Summe in die Mitte ' +
            'schreiben. $11\\cdot 11$: $1\\ (1+1)\\ 1 = 121$, $11\\cdot 23$: $2\\ (2+3)\\ 3 = 253$.',
        'em-kilo':
            'Zehnmal die 2 malgenommen: $2^5=32$, und $32\\cdot 32=1024$.' +
            '\n\nIn der Informatik begegnet einem die $1024$ ständig: Ein Rechner zählt in Zweierpotenzen, und $2^{10}=1024$ ' +
            'liegt ganz nah an 1000. Darum hatte ein Kilobyte früher 1024 Byte statt 1000 – heute heißt das genau ' +
            'genommen Kibibyte (KiB).',
        'em-111':
            'Zerlegen und stellenweise addieren:' +
            '$$111\\cdot 111=11\\,100+1110+111=12\\,321$$' +
            'Vorwärts und rückwärts dieselbe Zahl – ein Palindrom. Das Muster geht weiter: $11\\cdot 11=121$, ' +
            '$1111\\cdot 1111=1\\,234\\,321$, bis $111\\,111\\,111\\cdot 111\\,111\\,111=12\\,345\\,678\\,987\\,654\\,321$.',
        'em-121':
            'Rückwärts gerechnet – Aufgabe 11 war $11\\cdot 11=121$.',
        'em-halb':
            'Die Hälfte von einer Hälfte ist ein Viertel:' +
            '$$\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{4}=0{,}25$$' +
            'Malnehmen macht nicht immer größer: Mit einer Zahl kleiner als 1 wird das Ergebnis kleiner.',
        'em-12321':
            'Rückwärts gerechnet – Aufgabe 13 war $111\\cdot 111=12\\,321$.',
        'em-zauber':
            'Mal 9 ist mal 10 und einmal weg:' +
            '$$123\\,456\\,790-12\\,345\\,679=111\\,111\\,111$$' +
            'Schau genau hin: In $12\\,345\\,679$ fehlt die 8. Mal 18 ergibt $222\\,222\\,222$, mal 27 ergibt ' +
            '$333\\,333\\,333$ – und so weiter bis mal 81.',
        'em-durch-halb':
            'Wie oft passt eine Hälfte in 1? Zweimal. Geteilt durch einen Bruch heißt: mal seinen Kehrwert,' +
            '$$1:\\frac{1}{2}=1\\cdot 2=2$$' +
            'Teilen macht nicht immer kleiner: Durch eine Zahl kleiner als 1 wird das Ergebnis größer.',
        'em-mega':
            'Zerlegen in $1000+24$:' +
            '$$1024\\cdot 1000+1024\\cdot 24=1\\,024\\,000+24\\,576=1\\,048\\,576$$' +
            'Das ist $2^{10}\\cdot 2^{10}=2^{20}$: so viele Byte hat ein Mebibyte (MiB), 1024 Kibibyte.',
        'em-rueckwaerts':
            'Rückwärts gerechnet – Aufgabe 17 war $12\\,345\\,679\\cdot 9=111\\,111\\,111$. Wer sich die Zahl ohne 8 ' +
            'gemerkt hat, ist sofort fertig.',
    });
})();
