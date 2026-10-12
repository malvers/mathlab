/* js/buch-en/gy5.js — English for the widgets of js/buch-gy5.js (book 15, mathegy5-en):
 *   titelbildgy5, stellenwert5, zahlenstrahl5, sieb5, bruch5, bruchstrahl5, winkel5, winkelpaare5, spiegel5, rechteck5, quader5,
 *   einheiten5, zahlschrift5, komma5, mittel5, koord5, symmetrie5, linien5
 * Loaded by the English editions right after js/buch-gy5.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // English number words with the British "and": 607 018 → six hundred and seven thousand and eighteen
    const ONE = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
        'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const TEN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const DIGIT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const u100 = n => n < 20 ? ONE[n] : TEN[Math.floor(n / 10)] + (n % 10 ? '-' + ONE[n % 10] : '');
    const u1000 = n => { const h = Math.floor(n / 100), r = n % 100; return (h ? ONE[h] + ' hundred' + (r ? ' and ' : '') : '') + (r ? u100(r) : ''); };
    function words(n) {
        if (!n) return 'zero';
        const parts = [];
        [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']].forEach(([p, w]) => { const k = Math.floor(n / p) % 1000; if (k) parts.push(u1000(k) + ' ' + w); });
        const r = n % 1000;
        if (r) parts.push((parts.length && r < 100 ? 'and ' : '') + u1000(r));
        return parts.join(' ');
    }
    // the column heads of the place value tables (stellenwert5, komma5)
    const PLACE = { Mrd: 'B', HM: 'HM', ZM: 'TM', M: 'M', HT: 'HTh', ZT: 'TTh', T: 'Th', H: 'H', Z: 'T', E: 'O', z: 't', h: 'h', t: 'th' };
    const ROUND = { Zehner: 'ten', Hunderter: 'hundred', Tausender: 'thousand', Zehntausender: 'ten thousand', Hunderttausender: 'hundred thousand', Millionen: 'million' };
    const KIND = { 'Nullwinkel': 'zero angle', 'spitzer Winkel': 'acute angle', 'rechter Winkel': 'right angle', 'stumpfer Winkel': 'obtuse angle',
        'gestreckter Winkel': 'straight angle', 'überstumpfer Winkel': 'reflex angle', 'Vollwinkel': 'full angle' };
    const KINDS = Object.keys(KIND).join('|');
    const art = k => (/^[aeiou]/.test(KIND[k]) ? 'an ' : 'a ') + KIND[k];
    const MOVE = { Spiegelung: 'reflection', Verschiebung: 'translation', Drehung: 'rotation' };
    const QTY = { 'Länge': 'length', Masse: 'mass', Zeit: 'time', 'Fläche': 'area', Volumen: 'volume' };
    const SCRIPT = { aegypten: 'Egyptian numerals', rom: 'Roman numerals', maya: 'Maya numerals', binaer: 'the binary system' };
    const FORM = { Kreis: 'circle', Streifen: 'strip', Rechteck: 'rectangle' };

    window.BuchEN && BuchEN.add('gy5', {
        word: {
            // titelbildgy5
            'Titelbild: ein Quader aus Einheitswürfeln, ein Kreis mit drei Achteln, ein Winkel mit Skala, ein gespiegelter Drachen, ein Zahlenstrahl und Maya-Ziffern':
                'Cover picture: a cuboid made of unit cubes, a circle with three eighths, an angle with a scale, a reflected kite, a number line and Maya numerals',
            // stellenwert5
            'MRD.': 'BN', 'MILLIONEN': 'MILLIONS', 'TAUSENDER': 'THOUSANDS', 'EINER': 'ONES',
            'Zufallszahl': 'Random number', 'Alles auf 0': 'All to 0',
            'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.':
                'Tap ▲ or ▼ to change a digit. Every place is worth ten times as much as the place to its right.',
            // zahlenstrahl5
            'Zehner': 'Tens', 'Hunderter': 'Hundreds', 'Tausender': 'Thousands', 'Zehntausender': 'Ten thousands', 'Hunderttausender': 'Hundred thousands',
            'Millionen': 'Millions', 'Runden auf': 'Round to', 'Neue Zahl': 'New number', 'Mitte': 'Middle',
            'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.':
                'Drag the point. If it lies exactly in the middle or to the right of it, you round up, otherwise you round down.',
            // sieb5
            'Nächster Schritt': 'Next step', 'Von vorn': 'Start again',
            'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.': 'Tap a number: you see all its factors and its prime factorisation.',
            'Die 1 hat nur sich selbst als Teiler.': '1 has only itself as a factor.',
            'Zerlegung in Primfaktoren': 'Prime factorisation',
            // bruch5
            'Kreis': 'Circle', 'Rechteck': 'Rectangle', 'Streifen': 'Strip', 'Bild': 'Image', 'Zähler': 'Numerator', 'Nenner': 'Denominator',
            'Erweitern mit 2': 'Expand by 2', 'mit 3': 'by 3', 'Kürzen': 'Simplify', 'weniger': 'fewer', 'mehr': 'more',
            // bruchstrahl5
            'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
                'Enter fractions such as 3/4 or decimals such as 0.7, also numbers greater than 1, up to 3.',
            'Zahlenstrahl mit zwei Zahlen': 'Number line with two numbers',
            'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Please enter two numbers between 0 and 3, for example 3/4 or 0.7.',
            // winkel5
            'Messen': 'Measure', 'Schätzen': 'Estimate', 'Modus': 'Mode', 'Deine Schätzung': 'Your estimate', 'Schätzung in Grad': 'Estimate in degrees',
            'Prüfen': 'Check', 'Neuer Winkel': 'New angle',
            'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.':
                'Drag the end of the second arm. Angles are measured anticlockwise, starting from the horizontal arm.',
            'Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.': 'How big is this angle? Estimate without measuring and tap “Check”.',
            'Bitte eine Zahl eingeben.': 'Please enter a number.', 'Ausgezeichnet': 'Excellent',
            // winkelpaare5
            'Scheitelwinkel': 'Vertically opposite', 'Nebenwinkel': 'Adjacent', 'Stufenwinkel': 'Corresponding', 'Wechselwinkel': 'Alternate',
            'Winkelpaar': 'Pair of angles', 'Anderes Paar': 'Another pair', 'h kippen': 'Tilt h',
            'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
                'Drag the point on the line s to turn it. With “Tilt h”, g and h are no longer parallel.',
            'Zwei Geraden g und h, geschnitten von s': 'Two lines g and h, cut by s',
            // spiegel5
            'Spiegelung': 'Reflection', 'Verschiebung': 'Translation', 'Drehung': 'Rotation', 'Rätsel': 'Puzzle', 'Bewegung': 'Transformation',
            'Achse senkrecht': 'Vertical line', 'waagerecht': 'horizontal', 'Achse': 'Mirror line', 'Drehwinkel': 'Angle of rotation',
            'Neues Rätsel': 'New puzzle',
            'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.':
                'Drag the mirror line. Every image point lies on the perpendicular to the mirror line, the same distance from it.',
            'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.': 'Drag the arrowhead: every point is translated by the same arrow.',
            'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.': 'Set the angle of rotation. The figure is rotated anticlockwise about the point Z.',
            'Welche Bewegung bringt die gelbe Figur auf die grüne?': 'Which transformation takes the yellow figure onto the green one?',
            'Figur und Bildfigur im Koordinatensystem': 'Figure and image in the coordinate system',
            'Tippe auf deine Antwort.': 'Tap your answer.',
            // rechteck5
            'Zusammengesetzte Figur': 'Composite figure', 'Figur': 'Shape', 'Zerlegen': 'Split up', 'Ergänzen': 'Complete', 'Weg': 'Method',
            'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.': 'Drag the corner. One square is 1 cm long and 1 cm wide, so its area is 1 cm².',
            // quader5
            'Schrägbild': 'Oblique drawing', 'Netz': 'Net', 'Einheitswürfel': 'Unit cube', 'Ansicht': 'View',
            'Länge a (cm)': 'Length a (cm)', 'Breite b (cm)': 'Width b (cm)', 'Höhe c (cm)': 'Height c (cm)',
            'hinten': 'back', 'oben': 'top', 'vorn': 'front', 'unten': 'bottom', 'links': 'left', 'rechts': 'right',
            // einheiten5
            'Länge': 'Length', 'Masse': 'Mass', 'Zeit': 'Time', 'Fläche': 'Area', 'Volumen': 'Volume', 'Größe': 'Quantity',
            'Wert': 'Value', 'von Einheit': 'from unit', 'in Einheit': 'into unit',
            'Bitte eine Zahl eingeben, zum Beispiel 3,5.': 'Please enter a number, for example 3.5.',
            // zahlschrift5
            'Ägypten': 'Egypt', 'Rom': 'Rome', 'Maya': 'Maya', 'Zweiersystem': 'Binary', 'Zahlschrift': 'Number script',
            'eins weniger': 'one less', 'eins mehr': 'one more',
            // komma5
            'Neu': 'New',
            'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
                'When you multiply by 10, every digit moves one place to the left; when you divide, it moves to the right. In short: the decimal point moves.',
            'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'not possible: the digits would fall out of the table.',
            // mittel5
            'Ausgleichen': 'Level out', 'Neue Werte': 'New values', 'Mittelwert': 'Mean', 'Säulen mit dem Mittelwert': 'Bars with the mean',
            'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
                'Drag the bars higher or lower. “Level out” shares everything out fairly: every bar gets the same amount.',
            // koord5
            'Geraden ein/aus': 'Lines on/off', 'Finde den Punkt': 'Find the point', 'Koordinatensystem mit vier Punkten': 'Coordinate system with four points',
            'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).':
                'Drag the points. They snap onto the grid points. First to the right (x), then up (y).',
            // symmetrie5
            'Achse waagerecht': 'Horizontal line', 'zwei Achsen': 'two lines', 'Punkt': 'Point', 'Symmetrie': 'Symmetry',
            'Leeren': 'Clear', 'Beispiel': 'Example', 'Muster-Werkstatt': 'Pattern workshop',
            'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.': 'Tap squares to colour them. The reflected squares are coloured automatically as well.',
            // linien5
            'erste Zahl': 'first number', 'zweite Zahl': 'second number',
            'Legen': 'Lay out', 'Dazulegen': 'Add', 'Bündeln': 'Bundle', 'Alles bündeln': 'Bundle all',
            'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.':
                'Five counters on a line become one counter in the space above, two counters in a space become one on the next line. That is how people calculated 500 years ago.',
            'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.': 'All bundled. Now you can read off the result.',
            'Rot markiert: Hier muss noch gebündelt werden.': 'Marked red: bundling is still needed here.',
            'Linienbrett mit Rechenpfennigen': 'Line board with counters'
        },
        phrase: [
            // stellenwert5
            ['Als Zehnerbruch: ', 'As a decimal fraction: '], ['Eine natürliche Zahl, keine Stelle nach dem Komma.', 'A natural number, no places after the decimal point.'],
            // zahlenstrahl5
            ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'With 5, 6, 7, 8 or 9 you <b>round up</b>.'],
            ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'With 0, 1, 2, 3 or 4 you <b>round down</b>.'],
            // sieb5
            ['Starte das Sieb mit „Nächster Schritt“.', 'Start the sieve with “Next step”.'],
            ['Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.', '1 is <b>not a prime number</b>: it has only one single factor.'],
            ['Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.', '2 is the first prime number. All its multiples 4, 6, 8, … are crossed out.'],
            ['Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.', '3 is the next prime number. Its multiples 6, 9, 12, … are crossed out.'],
            ['Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …', '5 is the next prime number. Crossed out: 10, 15, 20, …'],
            ['Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.', '7 is the next prime number. Newly crossed out: 49, 77, 91 and the other multiples.'],
            ['Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.',
                'Done! The next number would be 11, but 11 · 11 = 121 is already over 100. All the remaining numbers are <b>prime numbers</b>: there are 25 of them.'],
            // bruch5
            ['Null Teile: der Bruch hat den Wert 0.', 'No parts: the fraction has the value 0.'],
            ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'A <b>proper fraction</b>: less than one whole.'],
            ['Genau <b>ein Ganzes</b>.', 'Exactly <b>one whole</b>.'],
            ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'An <b>improper fraction</b>: more than one whole'],
            [', als gemischte Zahl $', ', as a mixed number $'],
            ['Der Bruch lässt sich nicht weiter kürzen.', 'The fraction cannot be simplified any further.'],
            ['Als Dezimalzahl: ', 'As a decimal: '], [' · in Prozent: ', ' · as a percentage: '],
            ['Als Dezimalzahl ungefähr ', 'As a decimal, roughly '],
            ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.', '. The denominator has a prime factor other than 2 and 5, so the decimal never ends.'],
            // bruchstrahl5
            ['Jetzt vergleicht man nur die Zähler: ', 'Now you only compare the numerators: '],
            ['Als Dezimalzahlen: ', 'As decimals: '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Further to the right on the number line means bigger.'],
            // winkel5
            ['Deine Schätzung: ', 'Your estimate: '],
            // winkelpaare5
            ['Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
                'Vertically opposite angles lie opposite each other at the same point of intersection. They are <b>always equal</b>.'],
            ['Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
                'Adjacent angles lie next to each other at the same point of intersection and together form a straight angle: they <b>always add up to 180°</b>.'],
            ['Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ',
                'Corresponding angles lie at different points of intersection on the same side of s and on the same side of the lines. '],
            ['Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ',
                'Alternate angles lie at different points of intersection on different sides of s and between the lines. '],
            ['An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.', 'At <b>parallel</b> lines they are <b>equal</b>.'],
            ['Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.', 'Because g and h are <b>not parallel</b>, they are different sizes.'],
            // spiegel5
            ['Spiegelachse ', 'Mirror line '], ['schräg durch ', 'slanting through '],
            ['Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.',
                'The image is the same size but <b>flipped over</b>: the orientation A → B → C → D is reversed.'],
            ['Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.', 'Every point stays the same distance from Z. The figure is not flipped over.'],
            ['Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.',
                'Tip: if the figure is flipped over, it is a reflection. If all the sides point in the same direction as before, it is a translation.'],
            // rechteck5
            ['Ein Quadrat: alle vier Seiten gleich lang.', 'A square: all four sides are equal in length.'],
            ['Zerlegen in zwei Rechtecke:', 'Splitting up into two rectangles:'],
            ['Zum großen Rechteck ergänzen und das fehlende Stück abziehen:', 'Complete it to make the big rectangle and take away the missing piece:'],
            ['Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.',
                'Amazing: the perimeter is the same as for the whole rectangle, because the step is just as long as the missing sides.'],
            // quader5
            ['Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.', 'Opposite faces have the same colour: they are the same size.'],
            ['Alle 12 Kanten zusammen: ', 'All 12 edges together: '], ['Alle Kanten gleich lang: ein Würfel.', 'All edges equal in length: a cube.'],
            // einheiten5
            ['Rechnung: ', 'Calculation: '],
            ['Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.', 'Down the staircase to the smaller unit: the number gets bigger, so you <b>multiply</b>.'],
            ['Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.', 'Up the staircase to the larger unit: the number gets smaller, so you <b>divide</b>.'],
            ['Gleiche Einheit, nichts zu tun.', 'Same unit, nothing to do.'],
            ['Bei Flächen ist die Umrechnungszahl immer 100.', 'For areas the conversion factor is always 100.'],
            ['Bei Volumen ist die Umrechnungszahl immer 1000.', 'For volumes the conversion factor is always 1000.'],
            ['Achtung: Bei der Zeit gibt es keine Zehnerschritte.', 'Careful: with time there are no steps of ten.'],
            // zahlschrift5
            ['Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.',
                'Each symbol is written as often as it is needed. The order does not matter, and you do not need a zero. Stroke 1, hobble 10, coil of rope 100, lotus flower 1000.'],
            ['I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.',
                'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. If a smaller symbol stands in front of a larger one, it is subtracted: IV = 4, XC = 90, CM = 900.'],
            ['Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.',
                'The Maya counted in twenties. Dot = 1, bar = 5. From the bottom up, each level is worth twenty times as much. For an empty level they had a symbol for zero, the shell.'],
            ['Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.',
                'In the binary system there are only the digits 0 and 1. Each place is worth twice as much as the one to its right. That is how computers calculate.'],
            // mittel5
            ['Mittelwert', 'Mean'], ['Summe: ', 'Sum: '], ['Geteilt durch die Anzahl: ', 'Divided by how many there are: '],
            ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'What was above the line (dashed grey) fills exactly the gaps (yellow).'],
            // koord5
            ['g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.', 'g ∥ h: the lines are <b>parallel</b>; they never intersect.'],
            ['g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.', 'g ⊥ h: the lines are <b>perpendicular</b> to each other.'],
            ['g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.', 'g and h are neither parallel nor perpendicular. Try to make them parallel or perpendicular.']
        ],
        rule: [
            // plain-text points: A(2 | 1) → A(2, 1)
            [/\((-?\d+(?:\.\d+)?) \| (-?\d+(?:\.\d+)?)\)/g, '($1, $2)'],
            // place value tables: English column heads
            [/<table class="g5-sw[\s\S]*?<\/table>/g, t => t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E|z|h|t)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' + PLACE[k] + '</th>')],
            // stellenwert5: the number in words, read from the number above it
            [/(<p class="g5-big">)([\d,]+)(<\/p><p class="g5-word">)[^<]*/, (m, a, n, b) => a + n + b + words(+n.replace(/,/g, ''))],
            [/(<p class="g5-big">)([\d,]*\d(?:\.\d+)?)(<\/p>[\s\S]*?<p class="g5-dim">)Gesprochen: [^<]*/, (m, a, n, b) => {
                const [i, f] = n.replace(/,/g, '').split('.');
                return a + n + b + 'Read aloud: ' + words(+i) + (f ? ' point ' + [...f].map(d => DIGIT[+d]).join(' ') : '');
            }],
            [/Das sind (\d+) Stellen\./, 'The number has $1 digits.'],
            // zahlenstrahl5
            [/Gerundet auf (Zehner|Hunderter|Tausender|Zehntausender|Hunderttausender|Millionen)\. Entscheidend ist die Ziffer rechts davon: /,
                (m, p) => 'Rounded to the nearest ' + ROUND[p] + '. What matters is the digit to the right of that place: '],
            [/^Zahlenstrahl mit der Zahl (.+) zwischen (.+) und (.+)$/, 'Number line with the number $1 between $2 and $3'],
            // sieb5
            [/<b>Teiler von (\d+):<\/b> (.*?) \((\d+) Stück\)/, (m, n, l, k) => '<b>Factors of ' + n + ':</b> ' + l + ' (' + k + (k === '1' ? ' factor)' : ' factors)')],
            [/(\d+) ist eine Primzahl<\/span>: genau zwei Teiler, 1 und (\d+)\./, '$1 is a prime number</span>: exactly two factors, 1 and $2.'],
            // bruch5
            [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'The fraction ' + z + '/' + n + ' as a ' + FORM[f]],
            [/, genau (\d+) Ganze\./, ', exactly $1 wholes.'],
            [/Kürzen mit (\d+) ergibt /, 'Simplifying by $1 gives '],
            // bruchstrahl5, einheiten5: the start value in the input field
            [/( value=")(\d+),(\d{1,2})(")/g, '$1$2.$3$4'],
            [/^Zahl ([A-Z])$/, 'Number $1'],
            [/Auf denselben Nenner (\d+) gebracht: /, 'With the common denominator $1: '],
            // winkel5
            [new RegExp('<p>Ein <b>(' + KINDS + ')</b>'), (m, k) => { const [a, ...w] = art(k).split(' '); return '<p>' + a.charAt(0).toUpperCase() + a.slice(1) + ' <b>' + w.join(' ') + '</b>'; }],
            [new RegExp('Es ist ein (' + KINDS + ')\\.'), (m, k) => 'It is ' + art(k) + '.'],
            [/Tipp zum Messen: Miss den Rest bis zum Vollwinkel, (\d+)°, und rechne 360° − (\d+)°\./,
                'Tip for measuring: measure what is missing to make a full angle, $1°, and calculate 360° − $2°.'],
            [/, nur (\d+)° daneben!/, ', only $1° off!'], [/Gut, (\d+)° daneben\./, 'Good, $1° off.'],
            [/(\d+)° daneben\. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen\?/, '$1° off. Compare with 90° and 180°: where does the angle lie in relation to them?'],
            [/^Winkel von (\d+) Grad$/, 'Angle of $1 degrees'],
            // the vertex S (Scheitel) is V
            [/(<text class="g-pt"[^>]*>)S(<\/text>)/, '$1V$2'],
            // winkelpaare5
            [/g und h sind (nicht )?parallel\./, (m, n) => 'g and h are ' + (n ? 'not ' : '') + 'parallel.'],
            // spiegel5
            [/Jeder Punkt wandert (\d+) nach (links|rechts) und (\d+) nach (unten|oben)\./,
                (m, a, lr, b, du) => 'Every point moves ' + a + ' to the ' + (lr === 'links' ? 'left' : 'right') + ' and ' + b + ' ' + (du === 'oben' ? 'up' : 'down') + '.'],
            [/Drehung um Z(\([^)]*\)) um (\d+)°\./, 'Rotation about Z$1 through $2°.'],
            [/(data-v="schraeg">)schräg</, '$1slanting<'],
            [/(Richtig, es ist|Nicht ganz\. Es ist) eine (Spiegelung|Verschiebung|Drehung)\./,
                (m, p, k) => (p[0] === 'R' ? 'Correct, it is' : 'Not quite. It is') + ' a ' + MOVE[k] + '.'],
            // rechteck5
            [/^Rechteck aus (\d+) Einheitsquadraten$/, 'Rectangle made of $1 unit squares'],
            [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, 'That is $1 rows of $2 squares each.'],
            [/<p>Zusammen (\d+) cm²/, '<p>Together $1 cm²'],
            // quader5
            [/^Quader (\d+) mal (\d+) mal (\d+)$/, 'Cuboid $1 by $2 by $3'],
            [/(\d+) Schicht(en)? mit je (.+?) Würfeln\./, (m, c, en, x) => c + ' layer' + (en ? 's' : '') + ' of ' + x + ' cubes each.'],
            // einheiten5, komma5, mittel5: division with ÷
            [/(\d) : (?=\d)/g, '$1 ÷ '], [/(<(?:text|button)[^>]*>): (?=\d)/g, '$1÷ '],
            [/^Einheitentreppe (Länge|Masse|Zeit|Fläche|Volumen)$/, (m, k) => 'Unit staircase for ' + QTY[k]],
            // zahlschrift5 ("Zahl" alone is a coin side elsewhere)
            [/^Die Zahl (\d+) in (aegypten|rom|maya|binaer)$/, (m, v, k) => 'The number ' + v + ' in ' + SCRIPT[k]],
            [/(<label for="[^"]*">)Zahl(<\/label>)/, '$1Number$2'], [/^Zahl$/, 'Number'],
            // symmetrie5
            [/^Farbe (\d)$/, 'Colour $1'],
            // koord5
            [/<\/span> geht durch A und B, (<span[^>]*>h<\/span>) durch C und D\./, '</span> passes through A and B, $1 through C and D.'],
            [/Getroffen! A liegt auf /, 'Hit! A is on '], [/<b>Aufgabe:<\/b> Zieh A auf den Punkt /, '<b>Task:</b> Drag A onto the point '],
            // linien5
            [/(<span class="b-ctrl">)Zahl (?=<input)/, '$1Number '],
            [/Fünf Pfennige auf der Linie ([\d,]+) werden zu einem im Feld ([\d,]+)\./, 'Five counters on the line $1 become one in the space $2.'],
            [/Zwei Pfennige im Feld ([\d,]+) werden zu einem auf der Linie ([\d,]+)\./, 'Two counters in the space $1 become one on the line $2.'],
            [/([\d,]+) ist gelegt\./, '$1 is laid out.'],
            [/([\d,]+) dazugelegt\. Jetzt muss gebündelt werden\./, '$1 added. Now you have to bundle.']
        ]
    });
})();
