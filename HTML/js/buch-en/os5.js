/* js/buch-en/os5.js — English for the widgets of js/buch-os5.js (book mathe5-en, 26.10.2026):
 *   titelbildos5, zahlenstrahlos5, schriftlichos5, vorrangos5, zehnerpotenzos5, quadratos5, probierenos5, teilbarkeitos5,
 *   bruchteilos5, halbesos5, rundenos5, wuerfelnetzos5, bandos5, zahlzeichenos5
 * Loaded by the English editions right after js/buch-os5.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * British school notation (Doc, 26.10.2026: always the conventions of the target language): division ÷ (in TeX \div), as in the
 * English GY 5 book whose widgets the OS 5 book shares (js/buch-en/gy5.js), and multiplication × (in TeX \times) - in British
 * schools a raised dot between digits reads as a decimal point.
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    const BS = String.fromCharCode(92);
    // the places of the written calculations (schriftlichos5): headings, one of them, ten of them
    const PLACE = { Tausendstel: 'Thousandths', Hundertstel: 'Hundredths', Zehntel: 'Tenths', Einer: 'Ones', Zehner: 'Tens', Hunderter: 'Hundreds',
        Tausender: 'Thousands', Zehntausender: 'Ten thousands', Hunderttausender: 'Hundred thousands', Millionen: 'Millions',
        Zehnmillionen: 'Ten millions', Hundertmillionen: 'Hundred millions', Milliarden: 'Billions' };
    const ONE = { Hundertstel: 'hundredth', Zehntel: 'tenth', Einer: 'one', Zehner: 'ten', Hunderter: 'hundred', Tausender: 'thousand',
        Zehntausender: 'ten thousand', Hunderttausender: 'hundred thousand', Million: 'million', Zehnmillion: 'ten million',
        Hundertmillion: 'hundred million', Milliarden: 'billion' };
    const TENS = { Tausendstel: 'thousandths', Hundertstel: 'hundredths', Zehntel: 'tenths', Einer: 'ones', Zehner: 'tens', Hunderter: 'hundreds',
        Tausender: 'thousands', Zehntausender: 'ten thousands', Hunderttausender: 'hundred thousands', Millionen: 'millions',
        Zehnmillionen: 'ten millions', Hundertmillionen: 'hundred millions' };
    const PLACES = Object.keys(PLACE).join('|');
    // zehnerpotenzos5: 10^n in words
    const TENW = { eins: 'one', zehn: 'ten', hundert: 'a hundred', tausend: 'a thousand', zehntausend: 'ten thousand', hunderttausend: 'a hundred thousand',
        'eine Million': 'a million', 'zehn Millionen': 'ten million', 'hundert Millionen': 'a hundred million', 'eine Milliarde': 'a billion',
        'zehn Milliarden': 'ten billion', 'hundert Milliarden': 'a hundred billion', 'eine Billion': 'a trillion' };
    // halbesos5: the names of the pieces, plural and singular
    const NTH = { Ganze: 'wholes', Halbe: 'halves', Drittel: 'thirds', Viertel: 'quarters', 'Fünftel': 'fifths', Sechstel: 'sixths', Siebtel: 'sevenths',
        Achtel: 'eighths', Neuntel: 'ninths', Zehntel: 'tenths', Elftel: 'elevenths', 'Zwölftel': 'twelfths' };
    const NTH1 = { Ganze: 'whole', Halbe: 'half', Drittel: 'third', Viertel: 'quarter', 'Fünftel': 'fifth', Sechstel: 'sixth', Siebtel: 'seventh',
        Achtel: 'eighth', Neuntel: 'ninth', Zehntel: 'tenth', Elftel: 'eleventh', 'Zwölftel': 'twelfth' };
    const NTHS = Object.keys(NTH).join('|');
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const pieces = (n, w) => n + ' ' + (n === '1' ? NTH1[w] : NTH[w]);
    // rundenos5
    const TO = { Ganze: 'whole numbers', Zehntel: 'tenths', Hundertstel: 'hundredths' };
    const DIGIT = { Zehntel: 'tenths', Hundertstel: 'hundredths', Tausendstel: 'thousandths' };
    // bruchteilos5, halbesos5: the steppers
    const STEP = { 'Zähler': 'numerator', Nenner: 'denominator', Ganzes: 'whole' };
    // bandos5
    const MOTIF = { Fahne: 'flag', 'Schlüssel': 'key', Blume: 'flower' };
    const pl = (n, one, more) => n + ' ' + (n === '1' ? one : more);

    window.BuchEN && BuchEN.add('os5', {
        word: {
            // titelbildos5
            'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
                'Cover picture: a cube in an oblique drawing and its net, a circle with two coloured thirds, a reflected butterfly, Babylonian cuneiform numbers and a number line',
            // zahlenstrahlos5
            'Erkunden': 'Explore', 'Ablesen': 'Read off', 'Einteilung': 'Scale', 'Welche Zahl ist markiert?': 'Which number is marked?',
            'Neue Aufgabe': 'New exercise',
            'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?':
                'Count the marks from the number on the left. How big is one step from mark to mark?',
            'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.':
                'Drag the point along the number line. The further to the right, the bigger the number.',
            // schriftlichos5
            'Addieren': 'Adding', 'Subtrahieren': 'Subtracting', 'Multiplizieren': 'Multiplying', 'Dividieren': 'Dividing', 'Rechenart': 'Operation',
            'Verfahren': 'Method', 'Alles zeigen': 'Show all',
            'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.': 'Please enter two numbers, for example 4738 and 1296.',
            'Bitte höchstens drei Stellen nach dem Komma.': 'Please use at most three decimal places.',
            'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.': 'Please use numbers with at most nine digits before the decimal point.',
            'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.':
                'The second number is bigger than the first. With natural numbers this subtraction is not possible.',
            'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.':
                'Here the second factor must be a natural number. Swap the factors if necessary.',
            'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.': 'Please use at most seven digits in the first factor and three in the second.',
            'Hier teilst du durch eine einstellige Zahl von 1 bis 9.': 'Here you divide by a one-digit number from 1 to 9.',
            'Bitte höchstens acht Ziffern.': 'Please use at most eight digits.',
            // vorrangos5
            'Eigener Term': 'Your own expression', 'Alle Schritte': 'All steps', 'Ergebnis': 'Result',
            'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.':
                'You may use natural numbers, + − × ÷ and brackets. For × you can also type * or x, for ÷ also : or /.',
            'Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.':
                'That is not a complete expression. Check the numbers, the operation signs and the brackets.',
            'Unterstrichen ist, was als Nächstes gerechnet wird.': 'What is underlined is calculated next.',
            'Durch 0 kann man nicht teilen.': 'You cannot divide by 0.',
            // zehnerpotenzos5
            'Zehnerpotenzen': 'Powers of ten', 'Nullen abtrennen': 'Split off zeros', 'Hochzahl': 'Index',
            'Anzeige des Taschenrechners': 'Calculator display',
            'Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.': 'The number has no zero at the end. No power of ten can be split off here.',
            'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.':
                'There is no zero left at the end in front of the multiplication sign: this is the shortest way of writing it.',
            'So zeigt ein Taschenrechner mit 10 Stellen die Zahl:': 'This is how a calculator with 10 digits shows the number:',
            'Die Zahl passt in die Anzeige.': 'The number fits in the display.',
            // quadratos5
            'Quadrieren': 'Squaring', 'Wurzel ziehen': 'Square root', 'Richtung': 'Direction', 'Seitenlänge n': 'Side length n',
            'Anzahl Plättchen': 'Number of tiles', 'Bitte eine Zahl von 1 bis 440 eingeben.': 'Please enter a number from 1 to 440.',
            // probierenos5
            'Aufgabe': 'Problem', 'Einsetzen': 'Substitute', 'Alle Zahlen prüfen': 'Check all numbers',
            'Zahlenstrahl mit den eingesetzten Zahlen': 'Number line with the numbers you substituted',
            'erfüllt die Ungleichung.': 'satisfies the inequality.', 'erfüllt sie nicht.': 'does not satisfy it.',
            // teilbarkeitos5
            'Die 1 hat nur einen Teiler. Sie ist keine Primzahl.': '1 has only one factor. It is not a prime number.',
            // bruchteilos5
            'Ganzes': 'Whole',
            'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.':
                'The whole can only be shared into equal groups if it is a multiple of the denominator. That is why it jumps in steps.',
            'Alle Gruppen: Das ist das Ganze.': 'All the groups: that is the whole.', 'Genau die Hälfte.': 'Exactly half.',
            // halbesos5
            'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes': 'Two fraction strips one below the other, with the mark for one half',
            // rundenos5
            'auf Ganze': 'to whole numbers', 'auf Zehntel': 'to tenths', 'auf Hundertstel': 'to hundredths', 'Runden': 'Round',
            'Der Zahlenstrahl zeigt nur den Ausschnitt zwischen den beiden möglichen Ergebnissen, wie unter einer Lupe. Zieh den Punkt.':
                'The number line only shows the part between the two possible results, as if under a magnifying glass. Drag the point.',
            // wuerfelnetzos5
            'Zufälliges Netz': 'Random net', 'Alles löschen': 'Clear all',
            'Tippe Quadrate an, um sie hinzuzufügen oder wegzunehmen. Sechs zusammenhängende Quadrate werden sofort geprüft.':
                'Tap squares to add or remove them. Six connected squares are checked straight away.',
            'Ein Würfel hat 6 Flächen, also besteht jedes Würfelnetz aus 6 Quadraten.': 'A cube has 6 faces, so every net of a cube is made of 6 squares.',
            'Die Quadrate hängen nicht alle zusammen.': 'The squares are not all joined together.',
            'Jedes Quadrat muss mit einer ganzen Kante an ein anderes stoßen.': 'Every square must touch another one along a whole edge.',
            'Kein Würfelnetz.': 'Not a net of a cube.', 'Ein Würfelnetz!': 'A net of a cube!',
            'Beim Falten würden die rot markierten Quadrate aufeinanderliegen, und eine Fläche des Würfels bliebe offen.':
                'When you fold it, the squares marked in red would lie on top of each other, and one face of the cube would stay open.',
            'Die Zahlen zeigen, wie ein Spielwürfel beschriftet wäre: Gegenüberliegende Flächen haben dieselbe Farbe und ergeben zusammen 7.':
                'The numbers show how a dice would be numbered: opposite faces have the same colour and add up to 7.',
            // bandos5
            'Fahne': 'Flag', 'Schlüssel': 'Key', 'Blume': 'Flower', 'Motiv': 'Motif', 'Verschieben': 'Translate',
            'Spiegeln, senkrechte Achsen': 'Reflect, vertical lines', 'Spiegeln, waagerechte Achse': 'Reflect, horizontal line',
            'Verschiebungspfeil': 'Translation arrow',
            'Alle Motive sind deckungsgleich: gleiche Form, gleiche Größe.': 'All the motifs are congruent: the same shape and the same size.',
            // zahlzeichenos5
            'Kerbholz und Strichliste': 'Tally stick and tally chart', 'Babylonische Keilschrift': 'Babylonian cuneiform', 'Zahlzeichen': 'Numerals',
            'Auf 0': 'Back to 0',
            'Auf dem Kerbholz ist jede fünfte Kerbe länger. So muss man nicht jede einzelne Kerbe zählen, sondern nur die Bündel.':
                'On the tally stick every fifth notch is longer. That way you do not have to count every single notch, only the bundles.'
        },
        phrase: [
            // askRow (zahlenstrahlos5)
            ['noch nicht', 'not yet'],
            // zahlenstrahlos5
            ['Richtig: ', 'Correct: '], ['Ein Schritt von Strich zu Strich ist ', 'One step from mark to mark is '],
            // schriftlichos5: the first step
            ['Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer', 'Write the numbers one below the other, place under place: ones under ones'],
            ['Schreibe die Zahlen stellengerecht untereinander', 'Write the numbers one below the other, place under place'],
            [', Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf', ', decimal point under decimal point. Fill the missing places after the point with zeros'],
            [', Komma unter Komma', ', decimal point under decimal point'],
            ['. Gerechnet wird von rechts nach links.', '. You calculate from right to left.'],
            ['. Gerechnet wird von rechts nach links', '. You calculate from right to left'],
            [', beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.', '; to exchange, you swap 1 of the next place for 10.'],
            [', beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?', '; when you add on, you ask: how much is missing from the lower to the upper digit?'],
            ['Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal',
                'Write the calculation in one line. You multiply the first factor by each digit of the second factor in turn'],
            [', zuerst ohne auf das Komma zu achten.', ', at first without paying attention to the decimal point.'],
            // schriftlichos5: the steps
            [' (Übertrag)', ' (carry)'], [' (gemerkt)', ' (carried)'], [' und übertrage ', ' and carry '], [' in die nächste Spalte.', ' to the next column.'],
            [' Übertrag 1 in die nächste Spalte.', ' Carry 1 to the next column.'], [', merke ', ', carry '],
            ['. Das ist die letzte Ziffer: Schreibe ', '. That is the last digit: write '], [' ganz hin.', ' in full.'], ['Schreibe ', 'Write '],
            [' Eine Null ganz vorn schreibt man nicht.', ' A zero at the very front is not written.'],
            ['Addiere die Teilprodukte stellengerecht, so wie sie stehen. Das ergibt ', 'Add the partial products place by place, just as they are written. That gives '],
            [' Hinten hängst du Nullen an, das ändert den Wert nicht.', ' You add zeros at the end; that does not change the value.'],
            [', denn ', ', because '], ['Es bleibt nichts übrig.', 'Nothing is left over.'],
            [' Hier kommt das Komma: Setze es auch im Ergebnis.', ' Here comes the decimal point: put it in the result as well.'],
            ['Überschlag: ', 'Estimate: '], ['Probe: ', 'Check: '],
            // vorrangos5: the rule of each step
            ['Klammer zuerst', 'brackets first'], [', darin ', ', inside them '], ['Punkt vor Strich', '× and ÷ before + and −'],
            ['von links nach rechts', 'from left to right'], ['die letzte Rechnung', 'the last calculation'],
            [' geht nicht ohne Rest auf. Wähle andere Zahlen.', ' leaves a remainder. Choose other numbers.'],
            // zehnerpotenzos5
            ['Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel ', 'Please enter a natural number with at most 15 digits, for example '],
            ['Alle Schreibweisen: ', 'All the ways of writing it: '],
            // quadratos5
            ['Umgekehrt: ', 'The other way round: '],
            // probierenos5 (also quadratos5: "ist zu klein, … ist zu groß")
            ['Einsetzen: ', 'Substituting: '], ['stimmt!', 'is true!'], ['Lösung: ', 'Solution: '],
            ['. Mit der Umkehraufgabe geht es direkt: ', '. With the inverse operation you get there directly: '],
            ['ist zu klein', 'is too small'], ['ist zu groß', 'is too big'],
            ['Nimm eine größere Zahl.', 'Take a bigger number.'], ['Nimm eine kleinere Zahl.', 'Take a smaller number.'],
            ['Alle Lösungen: ', 'All solutions: '], [', … und jede größere Zahl.', ', … and every bigger number.'],
            ['Bisher gefundene Lösungen: ', 'Solutions found so far: '], ['Noch keine Lösung gefunden.', 'No solution found yet.'],
            [' Eine Ungleichung hat oft viele Lösungen.', ' An inequality often has many solutions.'],
            // teilbarkeitos5
            ['Quersumme ', 'Digit sum '], [' ist durch 3 teilbar.', ' is divisible by 3.'], [' ist nicht durch 3 teilbar.', ' is not divisible by 3.'],
            [' ist durch 9 teilbar.', ' is divisible by 9.'], [' ist nicht durch 9 teilbar.', ' is not divisible by 9.'],
            ['Die letzten zwei Ziffern bilden ', 'The last two digits make '],
            [', das ist durch 4 teilbar.', ', which is divisible by 4.'], [', das ist nicht durch 4 teilbar.', ', which is not divisible by 4.'],
            ['Die letzte Ziffer ist ', 'The last digit is '], [', nicht 0 oder 5.', ', not 0 or 5.'], [', nicht 0.', ', not 0.'],
            ['Durch 2 und durch 3 teilbar.', 'Divisible by 2 and by 3.'], ['Durch 2, aber nicht durch 3 teilbar.', 'Divisible by 2, but not by 3.'],
            ['Durch 3, aber nicht durch 2 teilbar.', 'Divisible by 3, but not by 2.'], ['Weder durch 2 noch durch 3 teilbar.', 'Divisible neither by 2 nor by 3.'],
            ['<b>Alle Teiler</b> (', '<b>All factors</b> ('],
            // halbesos5
            ['Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.', 'The coloured lengths are exactly the same: two names for the same number.'],
            ['<b>Vergleich mit 1:</b>', '<b>Comparing with 1:</b>'], ['<b>Vergleich mit einem Halben:</b>', '<b>Comparing with one half:</b>'],
            [' ist weniger als ein Ganzes', ' is less than one whole'], [' ist mehr als ein Ganzes', ' is more than one whole'], [' ist genau ein Ganzes', ' is exactly one whole'],
            [' ist weniger als ein Halbes', ' is less than one half'], [' ist mehr als ein Halbes', ' is more than one half'], [' ist genau ein Halbes', ' is exactly one half'],
            ['Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.',
                'Here the picture helps: the longer coloured strip belongs to the bigger fraction. You can work it out exactly in Year 6, when you expand fractions.'],
            // wuerfelnetzos5
            ['Beim Falten', 'When you fold it'],
            // bandos5
            ['<b>Verschiebung:</b> Jedes Motiv entsteht aus dem vorigen durch dieselbe Verschiebung nach rechts, um eine Kästchenbreite. Alle Motive zeigen in dieselbe Richtung.',
                '<b>Translation:</b> each motif comes from the one before by the same translation to the right, by the width of one box. All the motifs point in the same direction.'],
            ['<b>Spiegelung an senkrechten Achsen:</b> Jedes Motiv ist das Spiegelbild seines Nachbarn. Die grünen Linien sind die Spiegelachsen. Jedes zweite Motiv ist umgeklappt.',
                '<b>Reflection in vertical lines:</b> each motif is the mirror image of its neighbour. The green lines are the mirror lines. Every second motif is flipped over.'],
            ['<b>Spiegelung an einer waagerechten Achse:</b> Die untere Reihe ist das Spiegelbild der oberen. Oben und unten ist vertauscht, links und rechts nicht.',
                '<b>Reflection in a horizontal line:</b> the bottom row is the mirror image of the top one. Top and bottom are swapped, left and right are not.'],
            // zahlzeichenos5
            ['Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert.',
                'An upright wedge counts 1, a corner wedge 10. Each place to the left is worth 60 times as much.'],
            [' Eine leere Stelle hatte lange kein eigenes Zeichen: Man sah nur eine Lücke.', ' For a long time an empty place had no symbol of its own: you only saw a gap.']
        ],
        rule: [
            // TeX: thousands with a comma as in the English pages (4\,700 → 4{,}700), division as \div, multiplication as \times
            [new RegExp('([0-9])[' + BS + BS + '],(?=[0-9]{3}(?![0-9]))', 'g'), '$1{,}'],
            [/\$[^$]*\$/g, m => m.replace(/ (?::|÷) /g, ' ' + BS + 'div ').replace(new RegExp('[' + BS + BS + ']cdot(?![a-z])', 'g'), BS + 'times')],
            // plain text: 352 · 23 → 352 × 23, (36 − 4) · 5; the sign alone (schriftlichos5: the input row, the cell of the sheet, the cuneiform place values)
            [/([\d)]) · (?=[\d(a-z])/g, '$1 × '], [/^·$/, '×'], [/^:$/, '÷'], [/(<td[^>]*>)·(<\/td>)/g, '$1×$2'], [/(<text[^>]*>)· (?=\d)/g, '$1× '], [/(<button[^>]*>)· (?=\d)/g, '$1× '],
            // the labels "Zahl" of the text fields ("Zahl" alone is a coin side elsewhere)
            [/(<label class="b-ctrl" for="os5-[a-z]+-\d+">)Zahl(<\/label>)/, '$1Number$2'],
            // rechteck5, quader5 (js/buch-gy5.js): perimeter P (German u, Umfang) and surface area S (German O, Oberfläche); 3 cm · 4 cm → 3 cm × 4 cm
            [/(<p class="g5-big">)u = /g, '$1P = '], [/\$u = /g, () => '$P = '], [/(<p class="g5-big">)O = /g, '$1S = '], [/\$O = /g, () => '$S = '],
            [/(\d [a-z]{1,2}) · (?=\d)/g, '$1 × '],
            // winkel5 (js/buch-en/gy5.js says "full angle"): British pupils call 360° a full turn
            [/\bfull angle\b/g, 'full turn'],
            // zahlenstrahlos5
            [/(data-v="\d+">)Schritt (\d{1,3}(?: \d{3})*)(?=<)/g, (m, a, n) => a + 'Step ' + n.replace(/ /g, ',')],
            [/^Zahlenstrahl von (.+) bis (.+)$/, 'Number line from $1 to $2'],
            [/Von ([\d,.]+) bis ([\d,.]+) sind es 10 Schritte, einer ist ([\d,.]+) groß\./, 'From $1 to $2 there are 10 steps; each one is $3.'],
            [/Links steht ([\d,.]+), rechts ([\d,.]+)\. Dazwischen liegen 10 gleich große Schritte\./, 'On the left is $1, on the right $2. In between there are 10 equal steps.'],
            [/Der Punkt liegt (\d+) Schritte rechts von ([\d,.]+)\./, (m, k, a) => 'The point lies ' + pl(k, 'step', 'steps') + ' to the right of ' + a + '.'],
            [/Vorgänger ([^,<]+), Nachfolger ([\d,.]+)\./, 'Predecessor $1, successor $2.'],
            [/Die Zahl liegt zwischen ([\d,.]+) und ([\d,.]+)\./, 'The number lies between $1 and $2.'],
            // schriftlichos5: subtraction by adding on and by exchanging (rechteck5 has its own "Ergänzen", data-v="ergaenzen")
            [/(data-v="erg">)[^<]*</, '$1Adding on<'], [/(data-v="ent">)Entbündeln</, '$1Exchanging<'],
            [new RegExp('<b>(' + PLACES + '):<\\/b> ', 'g'), (m, p) => '<b>' + PLACE[p] + ':</b> '],
            [/Der letzte Übertrag (\d+) kommt vorn ins Ergebnis\./, 'The last carry, $1, goes at the front of the result.'],
            [/Von (\d+) bis (\d+) sind (\d+)\./, 'From $1 to $2 is $3.'],
            [/(\d+) ist kleiner als (\d+)\. Entbündle: ([^.]+)\./, (m, x, y, c) => x + ' is less than ' + y + '. Exchange: ' +
                c.split(', dann ').map(it => it.replace(/^1 (\S+) → 10 (\S+)$/, (mm, a, b) => '1 ' + (ONE[a] || a) + ' → 10 ' + (TENS[b] || b))).join(', then ') + '.'],
            [/Die letzte Ziffer steht genau unter der (\d) des zweiten Faktors\./, 'Its last digit goes exactly under the $1 of the second factor.'],
            [/Der erste Faktor hat (\d+) Stellen? nach dem Komma, also auch das Ergebnis: /, (m, n) => 'The first factor has ' +
                pl(n, 'decimal place', 'decimal places') + ', so the result has ' + (n === '1' ? 'one' : n) + ' as well: '],
            [/Teile von links nach rechts\. Frage bei jeder Stelle: Wie oft passt die (\d) hinein\?/, 'Divide from left to right. At each place ask: how many times does $1 go into it?'],
            [/Hole die (\d) herunter: (\d+)\. /, 'Bring down the $1: $2. '],
            [/In die (\d) passt die (\d) nicht, nimm die ersten (\d+) Ziffern: (\d+)\. /, '$2 does not go into $1, so take the first $3 digits: $4. '],
            [/Es bleibt (\d+)\./, '$1 is left over.'],
            [/ Rest (\d+)/g, ' remainder $1'], [/(<td class="os5-r">): /, '$1÷ '],
            [/Die Division geht nicht auf\. Nach (\d+) Stellen hinter dem Komma wird abgebrochen\./, 'The division does not work out exactly. It stops after $1 decimal places.'],
            [/Schritt (\d+) von (\d+)/, 'Step $1 of $2'],
            // vorrangos5: the terms on the buttons; the error of a subtraction
            [/(data-p="\d+">)([^<]*)/g, (m, a, t) => a + t.replace(/ : /g, ' ÷ ')],
            [/([\d,]+ − [\d,]+) geht in den natürlichen Zahlen nicht\./, '$1 is not possible with natural numbers.'],
            // zehnerpotenzos5
            [/Die Hochzahl (\d+) sagt: \d+ Faktoren 10, also (?:eine Null|\d+ Nullen)\. Das ist <b>([^<]+)<\/b>\./, (m, n, w) => 'The index ' + n + ' says: ' +
                (n === '1' ? '1 factor of 10, so one zero' : n + ' factors of 10, so ' + n + ' zeros') + '. That is <b>' + (TENW[w] || w) + '</b>.'],
            [/Du kannst noch (\d+) (?:Nullen|Null) mehr abtrennen\./, (m, n) => 'You can split off ' + pl(n, 'more zero', 'more zeros') + '.'],
            [/Die Zahl ist zu lang\. Der Rechner zeigt (\$[^$]+\$): Rücke das Komma um (\d+) Stellen nach rechts, dann hast du die Zahl\./,
                (m, t, n) => 'The number is too long. The calculator shows ' + t + ': move the decimal point ' + n + ' places to the right and you have the number.'],
            // quadratos5
            [/^(\d+) mal (\d+) Plättchen(?: und (\d+) weitere)?$/, (m, a, b, c) => a + ' by ' + b + ' tiles' + (c ? ' and ' + c + ' more' : '')],
            [/(\d+) Reihen mit je (\d+) Plättchen ergeben ein Quadrat aus (\d+) Plättchen\./, (m, a, b, c) => a === '1' ? '1 row of 1 tile makes a square of 1 tile.' :
                a + ' rows of ' + b + ' tiles each make a square of ' + c + ' tiles.'],
            [/(\d+) ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite (\d+)\./, '$1 is a square number: the tiles form a square with side $2.'],
            [/(\d+) ist keine Quadratzahl\./, '$1 is not a square number.'],
            [/Es bleiben (\d+) Plättchen übrig, zum nächsten Quadrat fehlen (\d+)\./, (m, a, b) => pl(a, 'tile is', 'tiles are') + ' left over; ' +
                b + ' ' + (b === '1' ? 'is' : 'are') + ' missing for the next square.'],
            [/(\$.sqrt\{[^}]+\}\$) liegt zwischen (\d+) und (\d+)\./, (m, t, a, b) => t + ' lies between ' + a + ' and ' + b + '.'],
            // probierenos5: "x : 6 = 9" on its button, "(14 Zahlen)"
            [/(<button type="button" data-v="\d+">)x : /, '$1x ÷ '],
            [/(>10<sup>x<\/sup> = )1 000</, '$11,000<'],
            [/ \((\d+) Zahlen\)\./, ' ($1 numbers).'],
            // teilbarkeitos5
            [/Bitte eine natürliche Zahl von 1 bis ([\d,]+) eingeben\./, 'Please enter a natural number from 1 to $1.'],
            [/Die letzte Ziffer (\d) ist (gerade|ungerade)\./, (m, d, g) => 'The last digit ' + d + ' is ' + (g === 'gerade' ? 'even.' : 'odd.')],
            [/<b>durch (\d+)( nicht)?:<\/b>/g, (m, d, n) => '<b>' + (n ? 'not divisible by ' : 'divisible by ') + d + ':</b>'],
            [/([\d,]+) ist eine Primzahl: genau zwei Teiler\./, '$1 is a prime number: exactly two factors.'],
            [/([\d,]+) ist keine Primzahl\./, '$1 is not a prime number.'],
            // bruchteilos5, halbesos5: the steppers
            [/^(Zähler|Nenner|Ganzes)( [AB])? (kleiner|größer)$/, (m, w, ab, d) => (d === 'kleiner' ? 'Decrease the ' : 'Increase the ') + STEP[w] + (ab ? ' of' + ab : '')],
            [/^(Zähler|Nenner) ([AB])$/, (m, w, ab) => cap(STEP[w]) + ' of ' + ab],
            // bruchteilos5
            [/^(\d+) von (\d+) Gruppen zu je (\d+) sind gefärbt$/, (m, z, n, k) => z + ' of ' + n + ' groups of ' + k + (z === '1' ? ' is' : ' are') + ' coloured'],
            [/(\$.tfrac\{\d+\}\{\d+\}\$) von (\d+) sind (\d+)\./, (m, f, g, r) => f + ' of ' + g + ' is ' + r + '.'],
            [/(\$.tfrac\{\d+\}\{\d+\}\$) von (\d+)/, (m, f, g) => f + ' of ' + g],
            [/1\. Teile das Ganze in (\d+) gleich große Gruppen: /, '1. Divide the whole into $1 equal groups: '],
            [/2\. Nimm (\d+) (?:Gruppe|Gruppen): /, (m, z) => '2. Take ' + pl(z, 'group', 'groups') + ': '],
            // halbesos5
            [new RegExp('<b>Gleicher Nenner:</b> Beide Male sind es (' + NTHS + '), also gleich große Stücke\\. Es kommt nur darauf an, wie viele: '),
                (m, w) => '<b>Same denominator:</b> both times they are ' + NTH[w] + ', so the pieces are the same size. All that matters is how many: '],
            [new RegExp('<b>Gleicher Zähler:</b> Beide Male sind es (\\d+) (?:Stück|Stücke)\\. (' + NTHS + ') sind größer als (' + NTHS + '): Je größer der Nenner, desto kleiner die Stücke\\.'),
                (m, n, a, b) => '<b>Same numerator:</b> both times it is ' + pl(n, 'piece', 'pieces') + '. ' + cap(NTH[a]) + ' are bigger than ' + NTH[b] +
                    ': the bigger the denominator, the smaller the pieces.'],
            [/, denn (\d+) ist (weniger|mehr|genau) als die Hälfte von (\d+)\./, (m, a, w, b) => ', because ' + a + ' is ' +
                (w === 'weniger' ? 'less than half' : w === 'mehr' ? 'more than half' : 'exactly half') + ' of ' + b + '.'],
            [new RegExp('<b>Was fehlt zum Ganzen\\?</b> Bei A fehlen (\\d+) (' + NTHS + '), bei B (\\d+) (' + NTHS + ')\\. (' + NTHS + ') sind kleiner, also fehlt bei ([AB]) weniger\\.'),
                (m, a, wa, b, wb, w, x) => '<b>What is missing to make a whole?</b> A is missing ' + pieces(a, wa) + ', B ' + pieces(b, wb) + '. ' + cap(NTH[w]) +
                    ' are smaller, so less is missing from ' + x + '.'],
            // rundenos5
            [/(>)Mitte (?=\d)/, '$1Middle '],
            [/^Zahlenstrahl zwischen (.+) und (.+)$/, 'Number line between $1 and $2'],
            [/Gerundet auf (Ganze|Zehntel|Hundertstel)\. Entscheidend ist die Ziffer der (Zehntel|Hundertstel|Tausendstel): /,
                (m, a, b) => 'Rounded to ' + TO[a] + '. What matters is the ' + DIGIT[b] + ' digit: '],
            [/Die Null am Ende bleibt stehen: Sie zeigt, dass auf (Zehntel|Hundertstel) gerundet wurde\./,
                (m, a) => 'The zero at the end stays: it shows that the number was rounded to ' + TO[a] + '.'],
            // wuerfelnetzos5
            [/^Gitter mit (\d+) ausgewählten Quadraten$/, (m, n) => 'Grid with ' + pl(n, 'square', 'squares') + ' selected'],
            [/Wähle 6 Quadrate aus(?:, es fehlen noch (\d+))?\./, (m, n) => 'Choose 6 squares' + (n ? ', ' + n + ' still missing' : '') + '.'],
            [/Das sind (\d+) Quadrate\. Ein Würfel hat nur 6 Flächen\./, 'That is $1 squares. A cube has only 6 faces.'],
            [/Gefunden: (\d+) von 11 verschiedenen Würfelnetzen\./, 'Found: $1 of the 11 different nets of a cube.'],
            // bandos5
            [/^Bandornament aus dem Motiv (Fahne|Schlüssel|Blume)$/, (m, k) => 'Frieze pattern from the ' + MOTIF[k] + ' motif'],
            // zahlzeichenos5
            [/^Kerbholz und Strichliste mit (\d+) Strichen$/, (m, n) => 'Tally stick and tally chart with ' + pl(n, 'mark', 'marks')],
            [/(\d+) Fünferbündel und (\d+) (?:einzelner Strich|einzelne Striche)/, (m, b, r) => pl(b, 'bundle of five', 'bundles of five') + ' and ' + pl(r, 'single mark', 'single marks')],
            [/(\d+) Fünferbündel/, (m, b) => pl(b, 'bundle of five', 'bundles of five')],
            [/(\d+) (?:einzelner Strich|einzelne Striche)/, (m, r) => pl(r, 'single mark', 'single marks')],
            [/^Die Zahl (\d+) in babylonischer Keilschrift$/, 'The number $1 in Babylonian cuneiform']
        ]
    });
})();
