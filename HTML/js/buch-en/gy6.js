/* js/buch-en/gy6.js — English for the widgets of js/buch-gy6.js (book 14, mathegy6-en):
 *   titelbildgy6, bruchbild6, mengen6, bruchop6, vorrang6, probieren6, pfeile6, zufall6, darstellung6, proportional6,
 *   dreisatz6, winkelsumme6, konstruktion6, seitenwinkel6, linien6, flaeche6, vierecke6, prisma6, kreisdiagramm6,
 *   sieb6, primfaktor6
 * Loaded by the English editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // the steppers write "<label> kleiner" / "<label> größer" as aria-label
    const STEP = {
        'Zähler': 'numerator', 'Nenner': 'denominator', 'erster Zähler': 'first numerator', 'erster Nenner': 'first denominator',
        'zweiter Zähler': 'second numerator', 'zweiter Nenner': 'second denominator',
        'zu Fuß': 'on foot', 'Fahrrad': 'bike', 'Bus oder Bahn': 'bus or train', 'Auto': 'car'
    };
    // the special lines and their points (linien6)
    const LINE = { 'Mittelsenkrechten': 'perpendicular bisectors', 'Winkelhalbierende': 'angle bisectors', 'Höhen': 'altitudes', 'Seitenhalbierende': 'medians' };
    // the shapes (flaeche6, vierecke6, prisma6, konstruktion6)
    const SHAPE = {
        'Quadrat': 'square', 'Rechteck': 'rectangle', 'Raute': 'rhombus', 'Parallelogramm': 'parallelogram', 'gleichschenkliges Trapez': 'isosceles trapezium', 'gleichschenklige Trapez': 'isosceles trapezium',
        'Drachenviereck': 'kite', 'Trapez': 'trapezium', 'Viereck': 'quadrilateral', 'Dreieck': 'triangle',
        'Dreiecksprisma': 'triangular prism', 'Quader': 'cuboid', 'Trapezprisma': 'trapezium prism', 'Sechseckprisma': 'hexagonal prism'
    };
    const CASE = { sss: 'SSS', sws: 'SAS', wsw: 'ASA', SsW: 'SsA', www: 'AAA' };
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const an = s => (/^[aeiou]/.test(s) ? 'an ' : 'a ') + s;
    // the units of the rule of three (dreisatz6), singular for 1
    const UNIT = { Pumpen: ['pump', 'pumps'], Hefte: ['exercise book', 'exercise books'], Kaninchen: ['rabbit', 'rabbits'], Tage: ['day', 'days'] };

    window.BuchEN && BuchEN.add('gy6', {
        word: {
            // book 14 mathegy6-en: titelbildgy6
            'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
                'Cover picture: a circle with three coloured eighths, the prime numbers up to 30 as glowing dots, a triangle with its three angles and the parallel through the apex, a triangular prism as an oblique drawing',
            // book 14 mathegy6-en: bruchbild6
            'Zähler': 'Numerator', 'Nenner': 'Denominator', 'Kreis': 'Circle', 'Streifen': 'Strip', 'Bild': 'Image',
            'Der Bruch ist eine natürliche Zahl.': 'The fraction is a natural number.',
            // book 14 mathegy6-en: mengen6
            '0,5': '0.5', '2,5': '2.5', '4,0': '4.0',
            'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Set diagram: the natural numbers lie inside the fractional numbers',
            'Richtig.': 'Correct.', 'Noch nicht.': 'Not yet.', 'Noch einmal': 'Once more',
            'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Work out the value: is it a whole number with no remainder?',
            'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Does the number perhaps lie between two natural numbers?',
            'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'in $\\mathbb{N}$ (and so also in $\\mathbb{Q}^+$)',
            'nur in $\\mathbb{Q}^+$': 'only in $\\mathbb{Q}^+$',
            // book 14 mathegy6-en: bruchop6
            'mal': 'times', 'durch': 'divided by', 'Rechenart': 'Operation',
            'Zähler 1': 'Numerator 1', 'Nenner 1': 'Denominator 1', 'Zähler 2': 'Numerator 2', 'Nenner 2': 'Denominator 2',
            'erster Zähler': 'first numerator', 'erster Nenner': 'first denominator', 'zweiter Zähler': 'second numerator', 'zweiter Nenner': 'second denominator',
            'Das Ergebnis wäre kleiner als null.': 'The result would be less than zero.',
            'Für das Bild sind die Zahlen zu groß.': 'The numbers are too big for the picture.',
            'Das Bild zeigt nur Brüche bis 1.': 'The picture only shows fractions up to 1.',
            'Mal null ist null.': 'Times zero is zero.', 'Durch null kann man nicht teilen.': 'You cannot divide by zero.',
            '1. Bruch': '1st fraction', '2. Bruch': '2nd fraction', 'Ergebnis': 'Result',
            'Streifenbild der Rechnung': 'Strip picture of the calculation', 'Rechteckbild: ein Teil von einem Teil': 'Rectangle picture: a part of a part',
            'Wie oft passt der zweite Bruch in den ersten?': 'How many times does the second fraction fit into the first?',
            'Grün': 'Green',
            'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numerator times numerator, denominator times denominator. Simplifying first saves work.',
            'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'To divide by a fraction, you multiply by its reciprocal.',
            // book 14 mathegy6-en: vorrang6
            'Punkt vor Strich': 'Multiplication before addition', 'Klammern zuerst': 'Brackets first', 'Mit Komma': 'With decimals',
            'Von links nach rechts': 'From left to right', 'Rechenvorteil': 'Shortcut', 'Aufgabe': 'Problem',
            'Nächster Schritt': 'Next step', 'Von vorn': 'Start again', 'Jetzt:': 'Now:', 'Fertig.': 'Done.',
            'Jetzt die Strichrechnung.': 'Now the addition.',
            // book 14 mathegy6-en: probieren6
            'Einsetzen': 'Substitute', 'Alle Werte prüfen': 'Test all values',
            'Zahlenstrahl: grün erfüllt, rot nicht': 'Number line: green fits, red does not',
            'Passt.': 'It fits.', 'Passt nicht.': 'It does not fit.',
            'Probe: Einsetzen ergibt eine wahre Aussage.': 'Check: substituting gives a true statement.',
            'Die linke Seite ist zu klein.': 'The left-hand side is too small.', 'kleiner': 'less', 'größer': 'greater', 'Die linke Seite ist zu groß.': 'The left-hand side is too big.',
            // book 14 mathegy6-en: pfeile6
            'Schüler → Vorname': 'Pupil → first name', 'Vorname → Schüler': 'First name → pupil', 'Schüler → Sitzplatz': 'Pupil → seat',
            'Zahl → Teiler': 'Number → factor', 'Zahl → Doppeltes': 'Number → double', 'Zahl → Rest bei : 3': 'Number → remainder when divided by 3',
            'Zuordnung': 'Assignment', 'Platz 1': 'Seat 1', 'Platz 2': 'Seat 2', 'Platz 3': 'Seat 3', 'Platz 4': 'Seat 4',
            'Welche Art von Zuordnung ist das?': 'What kind of assignment is this?',
            'mehrdeutig': 'many-valued', 'eindeutig': 'single-valued', 'eineindeutig': 'one-to-one', 'eindeutig, aber nicht eineindeutig': 'single-valued, but not one-to-one',
            'Richtig:': 'Correct:', 'Nicht ganz.': 'Not quite.',
            // book 14 mathegy6-en: zufall6
            'Münze': 'Coin', 'Würfel': 'Dice', 'Versuch': 'Experiment',
            'Kopf': 'Heads', 'Zahl': 'Tails', 'Rot': 'Red', 'Blau': 'Blue',
            '1-mal': 'Once', '10-mal': '10 times', '100-mal': '100 times', 'Löschen': 'Clear',
            'Säulendiagramm der relativen Häufigkeiten': 'Bar chart of the relative frequencies',
            'absolut': 'absolute', 'relativ': 'relative',
            // book 14 mathegy6-en: darstellung6
            'Kerze': 'Candle', 'Temperatur': 'Temperature', 'Fahrradverleih': 'Bike hire', 'Zeile wählen': 'Choose a row',
            'Zeit in h': 'Time in h', 'Höhe in cm': 'Height in cm', 'Uhrzeit': 'Time of day', 'Temperatur in °C': 'Temperature in °C',
            'Leihzeit in h': 'Hire time in h', 'Preis in €': 'Price in €',
            'Wortform:': 'In words:', 'Tabelle:': 'Table:', 'Gleichung:': 'Equation:',
            'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'None. The temperature can only be measured, not calculated.',
            // book 14 mathegy6-en: proportional6
            'Äpfel': 'Apples', 'Kuchen': 'Cake', 'Taxi': 'Taxi',
            'direkt proportional': 'directly proportional', 'indirekt proportional': 'inversely proportional', 'keins von beiden': 'neither',
            'Masse in kg': 'Mass in kg', 'Personen': 'People', 'Stück pro Person': 'Pieces per person', 'Strecke in km': 'Distance in km',
            'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.':
                'The quotient $y : x$ is always $2.5$: <b>directly proportional</b>. The graph is a straight line through the origin.',
            'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.':
                'The product $x \\cdot y$ is always $24$: <b>inversely proportional</b>. Twice as many people, half as much cake.',
            'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.':
                'The more kilometres, the dearer. But the quotient changes: <b>not proportional</b>. The line does not go through the origin.',
            // book 14 mathegy6-en: dreisatz6
            'Pumpen': 'Pumps', 'Hefte': 'Exercise books', 'Futter': 'Food', 'Kaninchen': 'Rabbits', 'Tage': 'days', 'Antwort:': 'Answer:',
            'Schritt 1: Schreib auf, was du weißt.': 'Step 1: write down what you know.',
            'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Step 3: work up to the quantity you want.',
            // book 14 mathegy6-en: winkelsumme6
            'Beweisfigur': 'Proof figure',
            'Dreieck mit seinen Innenwinkeln': 'Triangle with its interior angles',
            'Dreieck mit seinen Innenwinkeln und der Parallelen durch C': 'Triangle with its interior angles and the parallel through C',
            'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.':
                'Drag the corners. The angles change, their sum stays the same. The values are rounded to whole degrees.',
            // book 14 mathegy6-en: konstruktion6
            'sss': 'SSS', 'sws': 'SAS', 'wsw': 'ASA', 'SsW': 'SsA', 'www': 'AAA', 'Gegeben': 'Given',
            'Seite $a$': 'Side $a$', 'Seite $b$': 'Side $b$', 'Seite $c$': 'Side $c$',
            'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$', 'Seite $a$ gegenüber $\\alpha$': 'Side $a$ opposite $\\alpha$',
            'Genau ein Dreieck.': 'Exactly one triangle.', 'Kein Dreieck.': 'No triangle.', 'Zwei Dreiecke.': 'Two triangles.',
            'Unendlich viele Dreiecke.': 'Infinitely many triangles.',
            'Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.':
                'The circles about $A$ with $r = b$ and about $B$ with $r = a$ intersect above $c$ in exactly one point.',
            'Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.': 'Measure off $b$ along the arm of $\\alpha$. The end point is $C$.',
            'Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.':
                'The circle about $B$ cuts the arm twice. The information does not fix the triangle.',
            'Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.': 'The opposite side $a$ is the longer one: $a \\geq c$.',
            'Der Kreis berührt den Schenkel nur.': 'The circle only touches the arm.',
            'Der Kreis um $B$ erreicht den Schenkel nicht.': 'The circle about $B$ does not reach the arm.',
            'Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.':
                'They all have the same shape, but different sizes. Three angles do not fix a triangle.',
            'Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.':
                'You know the third angle anyway: $\\gamma = 180^\\circ - \\alpha - \\beta$. A length is missing.',
            // book 14 mathegy6-en: seitenwinkel6
            'Dreieck aus drei Stäben': 'Triangle made of three sticks', 'Die Stäbe ergeben kein Dreieck': 'The sticks do not make a triangle',
            // book 14 mathegy6-en: linien6
            'Winkelhalbierende': 'Angle bisectors', 'Höhen': 'Altitudes', 'Seitenhalbierende': 'Medians', 'Linien': 'Lines',
            // book 14 mathegy6-en: flaeche6
            'Parallelogramm': 'Parallelogram', 'Dreieck': 'Triangle', 'Trapez': 'Trapezium', 'Drachenviereck': 'Kite', 'Figur': 'Shape',
            'Zerlegen und verschieben': 'Cut and move', 'Grundseite $g$': 'Base $g$', 'Höhe $h$': 'Height $h$',
            'Diagonale $e$': 'Diagonal $e$', 'Diagonale $f$': 'Diagonal $f$',
            // book 14 mathegy6-en: vierecke6
            'Quadrat': 'Square', 'Rechteck': 'Rectangle', 'Raute': 'Rhombus', 'Viereck': 'Quadrilateral', 'gleichschenkliges': 'Isosceles',
            'gleichschenkliges Trapez': 'Isosceles trapezium', 'Haus der Vierecke': 'House of quadrilaterals',
            'parallele Seiten': 'parallel sides', 'gleich lange Seiten': 'equal sides', 'rechte Winkel': 'right angles', 'Symmetrieachsen': 'lines of symmetry',
            'Diagonalen halbieren sich': 'diagonals bisect each other', 'Diagonalen senkrecht': 'diagonals perpendicular', 'Diagonalen gleich lang': 'diagonals equal',
            '2 Paare': '2 pairs', '1 Paar': '1 pair', 'alle vier': 'all four', 'je zwei gegenüber': 'opposite ones in pairs', 'keine nötig': 'none needed',
            'keins nötig': 'none needed', 'die beiden Schenkel': 'the two legs', 'je zwei benachbarte': 'adjacent ones in pairs',
            'nur eine die andere': 'one bisects the other', 'mindestens 1': 'at least 1', 'ja': 'yes', 'nein': 'no',
            'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.':
                'The <b>quadrilateral</b> is at the very bottom: it only needs four corners and four sides, nothing else.',
            'Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.':
                'Tap a quadrilateral in the house. What is further down is more general, what is further up has more properties.',
            // book 14 mathegy6-en: prisma6
            'Dreiecksprisma': 'Triangular prism', 'Quader': 'Cuboid', 'Trapezprisma': 'Trapezium prism', 'Sechseckprisma': 'Hexagonal prism',
            'Prisma': 'Prism', 'Schrägbild': 'Oblique drawing', 'Netz': 'Net',
            'Grundkante $a$': 'Base edge $a$', 'Höhe $h$ des Prismas': 'Height $h$ of the prism',
            'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.':
                'Cabinet projection: the base is at the front in true size. The edges going backwards run at $45^\\circ$ and are half as long. Hidden edges are dashed.',
            'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.':
                'The net consists of the two bases and the lateral surface. The lateral surface is a rectangle: as wide as the perimeter $u$, as high as $h$.',
            // book 14 mathegy6-en: kreisdiagramm6
            'zu Fuß': 'on foot', 'Fahrrad': 'bike', 'Bus oder Bahn': 'bus or train', 'Auto': 'car',
            'Kreisdiagramm: Wie kommst du zur Schule?': 'Pie chart: how do you get to school?',
            'Anzahl': 'Number', 'Prozent': 'Percentage', 'Winkel': 'Angle', 'zusammen': 'total',
            'Umfrage in einer Klasse: Wie kommst du zur Schule?': 'Survey in a class: how do you get to school?',
            // book 14 mathegy6-en: sieb6
            'Nächste Primzahl': 'Next prime', 'Alle Schritte': 'All steps',
            '1 ist keine Primzahl: Sie hat nur einen Teiler. Tipp auf „Nächste Primzahl“.': '1 is not a prime number: it has only one factor. Tap “Next prime”.',
            'Sieb des Eratosthenes: die Zahlen von 1 bis 100': 'Sieve of Eratosthenes: the numbers from 1 to 100',
            'Vielfache von 2': 'multiples of 2', 'von 3': 'of 3', 'von 5': 'of 5', 'von 7': 'of 7',
            // book 14 mathegy6-en: primfaktor6
            'Zahl $a$': 'Number $a$', 'Zahl $b$': 'Number $b$', 'ggT': 'HCF', 'kgV': 'LCM',
            'Gib für $a$ eine natürliche Zahl von 2 bis 9999 ein.': 'Enter a natural number from 2 to 9999 for $a$.'
        },
        phrase: [
            // book 14 mathegy6-en: bruchbild6
            ['Bruch: $', 'Fraction: $'], ['Bild des Bruches ', 'Picture of the fraction '], ['Dezimalzahl: $', 'Decimal: $'], ['Prozent: $', 'Percentage: $'],
            ['Null Teile von ', 'Zero parts of '], [' sind nichts: $0$.', ' are nothing: $0$.'],
            ['Der gekürzte Nenner ', 'The simplified denominator '],
            [' hat nur die Primfaktoren 2 und 5. Erweitern mit $', ' has only the prime factors 2 and 5. Expanding by $'],
            ['. Die Dezimalzahl <b>bricht ab</b>.', '. The decimal <b>terminates</b>.'],
            ['$ enthält den Primfaktor $', '$ contains the prime factor $'],
            ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
                '$. You cannot expand to 10, 100, 1000 …: the decimal is <b>recurring</b>.'],
            // book 14 mathegy6-en: mengen6
            ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 is a natural number, and every natural number is also a fractional number: '],
            [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' lies between 0 and 1. That is not a natural number.'],
            [' liegt zwischen 0 und 1.', ' lies between 0 and 1.'], [' liegt zwischen 2 und 3.', ' lies between 2 and 3.'],
            [' liegt zwischen 4 und 5.', ' lies between 4 and 5.'],
            ['. Der Bruch sieht nur anders aus als die 3.', '. The fraction just looks different from 3.'],
            ['In der Schule zählt die 0 zu den natürlichen Zahlen.', 'At school, 0 counts as a natural number.'],
            ['. Die Null nach dem Komma ändert nichts.', '. The zero after the decimal point changes nothing.'],
            ['$ und $', '$ and $'], [' und $', ' and $'], [', aber $', ', but $'], [': Wohin gehört <b>$', ': where does <b>$'],
            ['Alle Zahlen sind einsortiert', 'All the numbers are sorted'], [' gleich beim ersten Versuch richtig', ' right at the first attempt'],
            [': die natürlichen Zahlen $', ': the natural numbers $'],
            [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $', ': the fractional numbers, that is all numbers that can be written as a fraction $'],
            ['$ schreiben kann.', '$.'],
            ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Every natural number is also a fractional number: $'],
            // book 14 mathegy6-en: bruchop6
            ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
                '$: with fractional numbers this subtraction is not possible. You will meet negative numbers in Year 7.'],
            ['Hauptnenner: $', 'Lowest common denominator: $'], ['$ (das kleinste gemeinsame Vielfache von $', '$ (the lowest common multiple of $'],
            ['Erst gleichnamig machen, dann die Zähler addieren. Der Nenner bleibt.', 'First give the fractions a common denominator, then add the numerators. The denominator stays the same.'],
            ['Erst gleichnamig machen, dann die Zähler subtrahieren. Der Nenner bleibt.', 'First give the fractions a common denominator, then subtract the numerators. The denominator stays the same.'],
            ['Erst gleichnamig machen, dann die Zähler ', 'First give the fractions a common denominator, then the numerators: '],
            ['. Der Nenner bleibt.', '. The denominator stays the same.'],
            ['$ von $', '$ of $'], ['$ Kästchen. Das ist $', '$ squares. That is $'],
            ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
                '$: how many times does nothing fit into something? This question has no answer. You never divide by $0$.'],
            ['$ passt $', '$ fits $'], ['$-mal in $', '$ times into $'],
            // book 14 mathegy6-en: vorrang6 (the decimals already with a point)
            ['Punktrechnung zuerst: $', 'Multiplication first: $'], ['Hauptnenner 4: $', 'Common denominator 4: $'],
            ['Die Klammer zuerst: $', 'The bracket first: $'],
            ['Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.', 'Done. With the bracket the result is different from without.'],
            ['Punkt vor Strich: $', 'Multiplication before subtraction: $'],
            ['Fertig. Wer von links rechnet, erhält falsch $6$.', 'Done. Calculating from the left gives the wrong answer $6$.'],
            ['Zwei Punktrechnungen: die linke zuerst. $', 'Two divisions or multiplications: the left one first. $'],
            ['Distributivgesetz: $', 'Distributive law: take $'], ['$ ausklammern.', '$ outside a bracket.'],
            ['Fertig. Ohne Ausklammern: $', 'Done. Without the bracket: $'], ['$, mehr Arbeit.', '$, more work.'],
            // book 14 mathegy6-en: probieren6
            ['$, und $', '$, and $'],
            ['Gesucht sind alle Zahlen, für die die linke Seite kleiner als $', 'We are looking for all numbers for which the left-hand side is less than $'],
            ['Gesucht sind alle Zahlen, für die die linke Seite größer als $', 'We are looking for all numbers for which the left-hand side is greater than $'],
            ['Gesucht sind alle Zahlen, für die die linke Seite ', 'We are looking for all numbers for which the left-hand side is '],
            ['$ ist.', '$.'], ['Geprüft: ', 'Tested: '], [' Werten. ', ' values. '], ['Es passen: ', 'These fit: '], ['Bisher passt keiner.', 'None fits so far.'],
            // book 14 mathegy6-en: pfeile6
            ['Pfeildarstellung: ', 'Arrow diagram: '],
            ['Schüler → Vorname', 'Pupil → first name'], ['Vorname → Schüler', 'First name → pupil'], ['Schüler → Sitzplatz', 'Pupil → seat'],
            ['Zahl → Teiler', 'Number → factor'], ['Zahl → Doppeltes', 'Number → double'], ['Zahl → Rest bei : 3', 'Number → remainder when divided by 3'],
            ['Die Zuordnung ist mehrdeutig. ', 'The assignment is many-valued. '], ['Die Zuordnung ist ', 'The assignment is '],
            ['Die Zuordnung ist eindeutig, aber nicht eineindeutig. ', 'The assignment is single-valued, but not one-to-one. '],
            ['Die Zuordnung ist eineindeutig. ', 'The assignment is one-to-one. '],
            ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
                'Exactly one arrow starts at each element on the left, and exactly one arrow arrives at each element on the right. Backwards, too, the assignment is single-valued.'],
            ['Von jedem Element links geht genau ein Pfeil aus. ', 'Exactly one arrow starts at each element on the left. '],
            // book 14 mathegy6-en: zufall6
            ['Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance',
                'Relative frequency = absolute frequency : number of trials. The dashed line shows the chance'],
            [' Versuche', ' trials'],
            [' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)', ' (red is half the spinner, blue a third, green a sixth)'],
            ['. Je mehr Versuche, desto näher kommen die Säulen meistens heran.', '. The more trials, the closer the bars usually come to it.'],
            // book 14 mathegy6-en: darstellung6
            ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'A candle is 20 cm high. Every hour it burns down by 2.5 cm.'],
            ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'On an autumn day the temperature is measured every two hours.'],
            ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'Hiring a bike costs €3 per hour.'],
            ['Diagramm: ', 'Diagram: '], ['Gewählt: ', 'Chosen: '],
            ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
                'The candle burns evenly, also between the full hours. So you may join the points with a line.'],
            ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
                'The dashed line only joins the measured points. What happened in between is not known exactly.'],
            ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'You only pay for whole hours, so there are only single points.'],
            // book 14 mathegy6-en: proportional6
            ['Äpfel: 1 kg kostet 2,50 €', 'Apples: 1 kg costs €2.50'], ['24 Stück Kuchen werden gerecht verteilt', '24 pieces of cake are shared fairly'],
            ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Taxi: €3 basic fare and €2 per km'],
            ['Graph der Zuordnung ', 'Graph of the assignment: '], ['. Zieh den gelben Punkt.', '. Drag the yellow point.'],
            // book 14 mathegy6-en: dreisatz6
            ['3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?', '3 kg of apples cost €7.50. How much do 5 kg cost?'],
            ['4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?', '4 pumps empty a pool in 6 hours. How long do 3 pumps take?'],
            ['5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?', '5 exercise books cost €4. How much do 8 exercise books cost?'],
            ['Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?', 'A supply of food lasts 12 rabbits for 10 days. How long does it last 8 rabbits?'],
            ['5 kg Äpfel kosten 12,50 €.', '5 kg of apples cost €12.50.'], ['3 Pumpen brauchen 8 Stunden.', '3 pumps take 8 hours.'],
            ['8 Hefte kosten 6,40 €.', '8 exercise books cost €6.40.'], ['Für 8 Kaninchen reicht das Futter 15 Tage.', 'For 8 rabbits the food lasts 15 days.'],
            ['Schritt 2: Rechne auf eins zurück. ', 'Step 2: work back to one. '],
            ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'directly proportional: both sides are calculated with the same number.'],
            ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
                'inversely proportional: on the right you do the opposite calculation. “: 4” on the left becomes “· 4” on the right.'],
            ['<b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.',
                '<b>Congruence theorem SSS:</b> if two triangles agree in all three sides, then they are congruent.'],
            ['<b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.',
                '<b>Congruence theorem SAS:</b> if two triangles agree in two sides and the angle between them, then they are congruent.'],
            ['<b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.',
                '<b>Congruence theorem ASA:</b> if two triangles agree in one side and the two angles next to it, then they are congruent.'],
            ['<b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.',
                '<b>Congruence theorem SsA:</b> if two triangles agree in two sides and the angle opposite the <b>longer</b> side, then they are congruent.'],
            ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
                '<b>many-valued:</b> several arrows start at one element. <b>single-valued:</b> exactly one starts at each. <b>one-to-one:</b> single-valued, and single-valued backwards too.'],
            // book 14 mathegy6-en: winkelsumme6
            ['Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ',
                'The dashed line is parallel to $\\overline{AB}$. $\\alpha\'$ and $\\alpha$ are alternate angles at parallels, so they are equal. The same holds for $\\beta\'$ and $\\beta$. '],
            ['Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.',
                'Together with $\\gamma$, $\\alpha\'$ and $\\beta\'$ form a straight angle: $180^\\circ$.'],
            [' und der Parallelen durch C', ' and the parallel through C'],
            // book 14 mathegy6-en: konstruktion6
            ['Die freien Schenkel der Winkel schneiden sich in $C$. ', 'The free arms of the angles meet at $C$. '],
            ['. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.', '. Nothing is left for $\\gamma$, the arms move apart.'],
            ['$ ist schon $', '$ is already $'],
            ['Die beiden kürzeren Seiten sind zusammen ', 'The two shorter sides together are '], [' cm lang, die längste ', ' cm long, the longest is '],
            [' cm. Die Kreise treffen sich nicht.', ' cm. The circles do not meet.'], ['Die Kreise treffen sich nicht.', 'The circles do not meet.'], ['Die Kreise berühren sich nur auf der längsten Seite.', 'The circles only touch on the longest side.'], ['Konstruktion aus ', 'Construction from '],
            // book 14 mathegy6-en: seitenwinkel6
            ['Alle Seiten gleich lang: alle Winkel $60^\\circ$. ', 'All sides equal: all angles $60^\\circ$. '],
            ['Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.',
                'Two sides are equal: the triangle is isosceles, and the base angles are equal.'],
            ['Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.',
                'The two shorter sticks together are exactly as long as the longest: they lie flat on it. That is not a triangle.'],
            ['Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.', 'The two shorter sticks do not reach each other, however you turn them.'],
            [' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.', ' <b>Triangle inequality:</b> two sides together must always be longer than the third.'],
            // book 14 mathegy6-en: linien6
            ['Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.',
                'Every point of a perpendicular bisector is the same distance from the two corners. Their intersection $U$ is the same distance from <b>all three corners</b>: the centre of the circumcircle.'],
            [' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.', ' In an obtuse triangle $U$ lies outside.'],
            [' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.', ' In a right-angled triangle $U$ lies exactly on the longest side.'],
            [' Bei einem spitzwinkligen Dreieck liegt $U$ innen.', ' In an acute triangle $U$ lies inside.'],
            ['Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.',
                'Every point of an angle bisector is the same distance from the two arms. Their intersection $I$ is the same distance from <b>all three sides</b>: the centre of the incircle. It always lies inside.'],
            ['Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.',
                'An altitude is the perpendicular from a corner to the opposite side. The three altitudes meet in one point $H$.'],
            [' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).', ' In an obtuse triangle $H$ lies outside: you have to extend the sides (dashed).'],
            [' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.', ' In a right-angled triangle $H$ is the corner with the right angle.'],
            ['Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.',
                'A median joins a corner to the midpoint of the opposite side. Their intersection $S$ is the centroid: a cardboard triangle can be balanced there on the point of a needle.'],
            [' · Schnittpunkt $', ' · intersection $'], ['Umkreismittelpunkt', 'circumcentre'], ['Inkreismittelpunkt', 'incentre'],
            ['Höhenschnittpunkt', 'orthocentre'], ['Schwerpunkt', 'centroid'], ['Dreieck mit seinen ', 'Triangle with its '],
            // book 14 mathegy6-en: flaeche6
            [': zerlegen und verschieben', ': cut and move'],
            ['Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.',
                'The triangle that was cut off moves to the right. The parallelogram becomes a rectangle with the same base and the same height.'],
            ['Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.',
                'A copy of the triangle rotates about the midpoint of one side. Together the two make a parallelogram. The triangle is half of it.'],
            ['Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.',
                'A copy of the trapezium rotates about the midpoint of one leg. Together the two make a parallelogram with the base $a + c$.'],
            ['Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.',
                'The four triangles in the kite fold outwards. They fill exactly half of the rectangle made from the two diagonals.'],
            // book 14 mathegy6-en: prisma6
            ['Grundfläche $G', 'Base area $G'], ['$, Umfang der Grundfläche $u', '$, perimeter of the base $u'], ['Mantel $M', 'Lateral surface $M'],
            ['Oberfläche $O', 'Surface area $O'], ['Volumen $V', 'Volume $V'], ['Netz des ', 'Net of the '], ['s: zwei Grundflächen und der Mantel aus Rechtecken', ': two bases and the lateral surface made of rectangles'],
            [' im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang', ' as an oblique drawing: base at the front in true size, depth at 45 degrees and half as long'],
            // book 14 mathegy6-en: kreisdiagramm6
            ['Winkel = Anteil · 360°. ', 'Angle = part · 360°. '], ['Eine Person entspricht hier $', 'Here one person stands for $'],
            // book 14 mathegy6-en: sieb6
            ['Schon $', 'Already $'],
            ['$ ist größer als 100. Alles, was noch übrig ist, ist eine Primzahl. <b>Fertig: 25 Primzahlen bis 100.</b>',
                '$ is greater than 100. Everything that is left is a prime number. <b>Done: 25 prime numbers up to 100.</b>'],
            ['Gefunden: ', 'Found: '], [' Primzahlen. Gestrichen: ', ' prime numbers. Crossed out: '], [' Zahlen (', ' numbers ('],
            [' Kleinere Vielfache wie $', ' Smaller multiples such as $'], ['$ waren schon weg.', '$ were already gone.'],
            // book 14 mathegy6-en: primfaktor6
            ['$ ist eine <b>Primzahl</b>.', '$ is a <b>prime number</b>.'], ['Faktorbaum von ', 'Factor tree of '],
            ['Der ggT besteht aus den Primfaktoren, die in <b>beiden</b> Zerlegungen vorkommen. Das kgV enthält jeden Primfaktor so oft, wie er <b>höchstens</b> vorkommt. ',
                'The HCF consists of the prime factors that occur in <b>both</b> factorisations. The LCM contains each prime factor as often as it occurs <b>at most</b>. '],
            ['Damit kürzt man: $', 'This is how you simplify: $'],
            ['Die beiden Zahlen haben keinen gemeinsamen Teiler außer 1.', 'The two numbers have no common factor except 1.'],
            // book en mathe7-en (Turing): on pages that also load finanz, its rule turns "2,50 €" into "€2.50" before the pieces,
            // so proportional6 and dreisatz6 need their euro sentences a second time in that form
            ['Äpfel: 1 kg kostet €2.50', 'Apples: 1 kg costs €2.50'],
            ['3 kg Äpfel kosten €7.50. Wie viel kosten 5 kg?', '3 kg of apples cost €7.50. How much do 5 kg cost?'],
            ['5 kg Äpfel kosten €12.50.', '5 kg of apples cost €12.50.'], ['8 Hefte kosten €6.40.', '8 exercise books cost €6.40.']
        ],
        rule: [
            // book 14 mathegy6-en: a recurring decimal written by hand in TeX: 0{,}\overline{3} → 0.\overline{3}
            [/(\d)\{,\}(\\overline)/g, '$1.$2'],
            // the steppers' aria-labels: "Zähler kleiner" → "numerator: less"
            [/^(.+) (kleiner|größer)$/, (m, w, d) => STEP[w] ? cap(STEP[w]) + (d === 'kleiner' ? ': less' : ': more') : m],
            // bruchbild6
            [/^Bild des Bruches (\d+) durch (\d+)$/, 'Picture of the fraction $1 over $2'],
            // mengen6
            [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Number $1 of $2: where does <b>$3</b> belong?'],
            [/einsortiert, (\d+) von (\d+) gleich/g, 'einsortiert, $1 of $2 gleich'],
            // probieren6
            [/Geprüft: (\d+) von (\d+) Werten\. /g, 'Tested: $1 of $2 values. '],
            // pfeile6
            [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, '$2 arrows start at “$1”.'],
            [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g,
                'But $2 arrows arrive at “$1”, so backwards the assignment is not single-valued.'],
            // zufall6: the spinner, as everywhere
            [/>(\d+) Versuche</g, '>$1 trials<'], [/>Glücksrad</g, '>Spinner<'],
            // kreisdiagramm6: the column of the table (other books: proportion)
            [/>Anteil</g, '>Part<'],
            // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
            [/Gewählt: Uhrzeit /g, 'Gewählt: time of day '], [/ → Temperatur /g, ' → temperature '],
            // dreisatz6: the cells of the table, "7,50 €" → "€7.50", "4 Pumpen" → "4 pumps"
            [/>(\d+),(\d\d) €</g, '>€$1.$2<'], [/>([\d.]+) €</g, '>€$1<'],
            [/>([\d.]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => '>' + n + ' ' + UNIT[u][n === '1' ? 0 : 1] + '<'],
            // konstruktion6
            [/^Konstruktion aus (sss|sws|wsw|SsW|www)$/, (m, k) => 'Construction from ' + CASE[k]],
            // seitenwinkel6: the largest angle faces the longest side - the English sentence names the angle first
            [/Der <span class="g-lam">längsten Seite \$([abc])\$<\/span> liegt der <span class="g-lam">größte Winkel \$(\\[a-z]+)\$<\/span> gegenüber, der <span class="g-cy">kürzesten \$([abc])\$<\/span> der kleinste\. /g,
                (m, s1, w, s2) => 'The <span class="g-lam">largest angle $' + w + '$</span> lies opposite the <span class="g-lam">longest side $' + s1 + '$</span>, the smallest opposite the <span class="g-cy">shortest, $' + s2 + '$</span>. '],
            // linien6
            // linien6: "perpendicular bisectors" in other books, a button here
            [/>Mittelsenkrechten</g, '>Perpendicular bisectors<'],
            [/^Dreieck mit seinen (Mittelsenkrechten|Winkelhalbierende|Höhen|Seitenhalbierende)$/, (m, l) => 'Triangle with its ' + LINE[l]],
            // flaeche6
            [/^(Parallelogramm|Dreieck|Trapez|Drachenviereck): zerlegen und verschieben$/, (m, s) => cap(SHAPE[s]) + ': cut and move'],
            // vierecke6: "Jedes <b>Quadrat</b> ist auch ein Rechteck, eine Raute, …."
            [/Jede[s]? <b>([^<]+)<\/b> ist auch ([^<]+)\.<\/p>/g, (m, s, list) => 'Every <b>' + (SHAPE[s] || s) + '</b> is also ' +
                list.split(', ').map(x => { const k = x.replace(/^eine? /, ''); return SHAPE[k] ? an(SHAPE[k]) : x; }).join(', ') + '.</p>'],
            // prisma6
            [/^(Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma) im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang$/,
                (m, s) => cap(SHAPE[s]) + ' as an oblique drawing: base at the front in true size, depth at 45 degrees and half as long'],
            [/^Netz des (Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma)s: zwei Grundflächen und der Mantel aus Rechtecken$/,
                (m, s) => 'Net of the ' + SHAPE[s] + ': two bases and the lateral surface made of rectangles'],
            // sieb6
            [/Die \$(\d+)\$ ist nicht gestrichen, also eine Primzahl\. Gestrichen werden ihre Vielfachen ab \$([^$]+)\$: (\d+) Zahlen \(/g,
                (m, p, q, n) => '$' + p + '$ is not crossed out, so it is a prime number. Its multiples from $' + q + '$ on are crossed out: ' + n + ' numbers (']
        ]
    });
})();
