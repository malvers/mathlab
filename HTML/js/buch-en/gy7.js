/* js/buch-en/gy7.js — English for the widgets of js/buch-gy7.js (book 13, mathegy7-en):
 *   titelbildgy7, kreisgerade7, dreieckkreise7, kreiswinkel7, konstruktion7, zahlengerade7, zahlbereiche7, vorzeichen7,
 *   waagebild7, umstellen7, prozent7, diagramm7, schraegbild7, faltnetz7, drittel7, eckenwinkel7 and the shared 3D stage
 * Loaded by the English editions right after js/buch-gy7.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
(function () {
    // the solids of the shared list BODY, lower case for the middle of a sentence
    const BODY = {
        'Würfel': 'cube', 'Quader': 'cuboid', 'Dreiecksprisma': 'triangular prism', 'Sechseckprisma': 'hexagonal prism', 'Quadratische Pyramide': 'square-based pyramid',
        'Quadr. Pyramide': 'square pyramid', 'Dreieckspyramide': 'triangular pyramid', 'Pyramidenstumpf': 'frustum of a pyramid', 'Tetraeder': 'tetrahedron',
        'Oktaeder': 'octahedron', 'Dodekaeder': 'dodecahedron', 'Ikosaeder': 'icosahedron'
    };
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const TITLE = {
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'How do you get to school? Survey in a class',
        'Klassensprecherwahl: Stimmen': 'Election of the class representative: votes',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Height of a sunflower, measured every week'
    };
    const CHART = { 'Säulendiagramm': 'bar chart', 'Liniendiagramm': 'line graph', 'Kreisdiagramm': 'pie chart' };
    const word = {
        // shared: the solids, the 3D stage
        'Quader': 'Cuboid', 'Dreiecksprisma': 'Triangular prism', 'Sechseckprisma': 'Hexagonal prism', 'Quadratische Pyramide': 'Square pyramid',
        'Quadr. Pyramide': 'Square pyramid', 'Dreieckspyramide': 'Triangular pyramid', 'Pyramidenstumpf': 'Frustum', 'Tetraeder': 'Tetrahedron', 'Oktaeder': 'Octahedron',
        'Dodekaeder': 'Dodecahedron', 'Ikosaeder': 'Icosahedron', 'Körper in 3D': 'Solid in 3D', 'Ziehen zum Drehen': 'Drag to turn',
        'Von vorn': 'Start again', 'Alle Schritte': 'All steps', 'weniger': 'fewer', 'mehr': 'more',
        // titelbildgy7
        'Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl':
            'Cover picture: a circle with a right-angled triangle on the diameter, a pyramid in oblique drawing, an icosahedron, a pie chart and a number line with a number and its opposite',
        // kreisgerade7
        'Passante': 'External line', 'Sekante': 'Secant', 'Tangente': 'Tangent',
        'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.':
            'Drag the two points of the line. When the distance $d$ comes close to the radius $r$, the line snaps into place as a tangent.',
        'Ein Kreis mit einer Passante, einer Sekante und einer Tangente': 'A circle with an external line, a secant and a tangent',
        'Kreis mit einer verschiebbaren Geraden': 'Circle with a line that can be moved',
        // dreieckkreise7
        'Umkreis': 'Circumcircle', 'Inkreis': 'Incircle', 'Kreis': 'Circle', 'Mittelsenkrechten': 'perpendicular bisectors', 'Winkelhalbierenden': 'angle bisectors',
        'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.':
            'Drag the corners. Near $90^\\circ$ the angle at the corner you are dragging snaps into place as a right angle.',
        'Dreieck mit Umkreis': 'Triangle with circumcircle', 'Dreieck mit Inkreis': 'Triangle with incircle',
        // kreiswinkel7
        'Thales': 'Thales', 'Peripheriewinkel': 'Inscribed angle', 'Sehnenviereck': 'Cyclic quadrilateral', 'Satz': 'Theorem', 'Zentriwinkel': 'Central angle',
        'Beweisidee zeigen': 'Show the idea of the proof',
        'Satz des Thales: Dreieck über dem Durchmesser': 'Thales’ theorem: triangle on the diameter',
        'Peripheriewinkel und Zentriwinkel über einem Kreisbogen': 'Inscribed angle and central angle over an arc',
        'Sehnenviereck mit seinen vier Winkeln': 'Cyclic quadrilateral with its four angles',
        // konstruktion7
        'Tangenten von P': 'Tangents from P', 'Dreieck aus c, α, β': 'Triangle from c, α, β', 'Tangenten an zwei Kreise': 'Tangents to two circles', 'Konstruktion': 'Construction',
        '◀ Zurück': '◀ Back', 'Weiter ▶': 'Next ▶', 'Winkel $\\alpha$': 'Angle $\\alpha$', 'Winkel $\\beta$': 'Angle $\\beta$',
        'Konstruktion der Tangenten von einem Punkt an einen Kreis': 'Construction of the tangents from a point to a circle',
        'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln': 'Construction of a triangle from one side and two angles',
        'Konstruktion der gemeinsamen Tangenten an zwei Kreise': 'Construction of the common tangents to two circles',
        // zahlengerade7
        'Addieren': 'Adding', 'Subtrahieren': 'Subtracting', 'Rechenart': 'Operation', 'erste Zahl $a$': 'first number $a$', 'zweite Zahl $b$': 'second number $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Drag the points $a$ and $b$ on the number line. They snap into place in half steps.',
        'Gegenzahlen': 'Opposite numbers', 'Zahlengerade mit rationalen Zahlen': 'Number line with rational numbers', '−7,5': '−7.5',
        'Rechnen als Bewegung auf der Zahlengeraden': 'Calculating as a movement along the number line', 'gar nicht': 'not at all',
        // zahlbereiche7
        'Wohin gehört die Zahl?': 'Where does the number belong?', 'Nächste Zahl': 'Next number', 'DIE ZAHL': 'THE NUMBER',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, but not $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}^+$, but not $\\mathbb{N}$',
        'nur $\\mathbb{Q}$': 'only $\\mathbb{Q}$', 'Nur das Bild': 'Picture only', 'Teilmengen': 'Subsets', 'Schnittmenge': 'Intersection', 'Vereinigung': 'Union', 'Mengen': 'Sets',
        'rationale Zahlen': 'rational numbers', 'ganze Zahlen': 'integers', 'gebrochene Zahlen': 'fractions', 'natürliche': 'natural',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Set diagram: natural numbers, integers, fractions and rational numbers',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': 'Which part of the picture does it belong in? Tap a button or the picture.',
        '2,5': '2.5', '0,1': '0.1', '−0,75': '−0.75', '−2,5': '−2.5',
        // vorzeichen7
        'Multiplizieren': 'Multiplying', 'Potenzen': 'Powers', 'Muster': 'Pattern', 'erster Faktor': 'first factor', 'Nächste Zeile': 'Next row',
        'positiv': 'positive', 'negativ': 'negative', 'Die Ergebnisse auf der Zahlengeraden': 'The results on the number line',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'A balanced pair of scales: on the left three boxes x and two weights, on the right one box x and six weights',
        // umstellen7
        '⇄ Seiten tauschen': '⇄ swap sides', 'Rechteck': 'Rectangle', 'Umfang': 'Perimeter', 'Geschwindigkeit': 'Speed', 'Dichte': 'Density', 'Pyramide': 'Pyramid',
        'Formel': 'Formula', 'Nächster Schritt': 'Next step', 'umstellen nach': 'rearrange for',
        // prozent7
        'Grundwert $G$': 'Base value $G$', 'Prozentsatz $p\\,\\%$': 'Percentage rate $p\\,\\%$', 'Änderung um': 'Change by',
        'Danach um denselben Prozentsatz zurück': 'Then back by the same percentage', 'Balken vor und nach der Änderung': 'Bars before and after the change',
        'Steigerung': 'increase', 'Senkung': 'decrease', 'Nicht': 'Not',
        // diagramm7
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'How do you get to school? Survey in a class', 'Antworten': 'Answers', 'zu Fuß': 'on foot',
        'Fahrrad': 'bike', 'Bus, Bahn': 'bus, train', 'Auto': 'car', 'Klassensprecherwahl: Stimmen': 'Election of the class representative: votes', 'Stimmen': 'Votes',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Height of a sunflower, measured every week',
        'Säulendiagramm': 'Bar chart', 'Liniendiagramm': 'Line graph', 'Kreisdiagramm': 'Pie chart', 'Diagramm': 'Chart', 'Woche': 'Week', 'Anteil': 'Proportion', 'Winkel': 'Angle',
        // schraegbild7
        'Fichtenholz': 'Spruce', 'Glas': 'Glass', 'Stahl': 'Steel', 'Schrägbild': 'Oblique drawing', 'Zweitafelbild': 'Two-view drawing', 'Wahre Länge': 'True length',
        'Darstellung': 'Display', 'Körper': 'Solid', 'Grundkante $a$': 'Base edge $a$', 'Kante $b$': 'Edge $b$', 'Höhe $h$': 'Height $h$', 'Stoff': 'Material',
        'Deckkante $b$': 'Top edge $b$', 'Breite $b$': 'Width $b$', 'AUFRISS': 'FRONT VIEW', 'GRUNDRISS': 'TOP VIEW',
        // faltnetz7
        'Falten': 'Fold', '▶ Zusammenfalten': '▶ Fold up', '◀ Auffalten': '◀ Unfold', 'Ein Netz faltet sich zu einem Körper': 'A net folds into a solid',
        // drittel7
        'Zusammenschieben': 'Push together', '▶ Zusammenschieben': '▶ Push together', '◀ Auseinander': '◀ Apart',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Three equal pyramids make a cube',
        // eckenwinkel7
        'Dreiecke': 'Triangles', 'Quadrate': 'Squares', 'Fünfecke': 'Pentagons', 'Sechsecke': 'Hexagons', 'Vieleck': 'Polygon', 'Anzahl an der Ecke': 'Number at the corner',
        'flach': 'flat',
    };
    const phrase = [
        // kreisgerade7
        ['$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ', '$r = 3\\,\\text{cm}$ · distance of the line from the centre: $d \\approx '],
        ['$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine ', '$d > r$: The line has <b>no</b> point in common with the circle. It is an '],
        ['$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine ',
            '$d = r$: The line has <b>exactly one</b> point $B$ in common with the circle, the point of contact. It is a '],
        ['. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.', '. The radius $\\overline{MB}$ is perpendicular to it.'],
        ['$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine ', '$d < r$: The line cuts the circle in <b>two</b> points $S_1$ and $S_2$. It is a '],
        ['. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $', '. The line segment $\\overline{S_1S_2}$ is a <b>chord</b>, here about $'],
        ['$ lang.', '$ long.'], [' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.', ' The secant passes through $M$: the chord is a diameter.'],
        // dreieckkreise7
        ['Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.',
            'The triangle is <b>right-angled</b>: $U$ lies exactly at the midpoint of the longest side. That is Thales’ theorem seen from the other side.'],
        ['Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.', 'The triangle is <b>obtuse-angled</b>: $U$ lies <b>outside</b> the triangle.'],
        ['Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.', 'The triangle is <b>acute-angled</b>: $U$ lies <b>inside</b> the triangle.'],
        ['Die drei ', 'The three '], [' schneiden sich in einem Punkt $U$. Er ist von allen drei Ecken gleich weit entfernt:', ' intersect in one point $U$. It is the same distance from all three corners:'],
        [' schneiden sich in einem Punkt $I$. Er hat von allen drei <b>Seiten</b> denselben Abstand:', ' intersect in one point $I$. It is the same distance from all three <b>sides</b>:'],
        ['Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.', 'The incircle touches every side. $I$ always lies inside the triangle.'],
        ['Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.', 'The three corners lie almost on one line. Drag a corner further away.'],
        ['Dreieck mit ', 'Triangle with '],
        // kreiswinkel7
        ['<b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.',
            '<b>Thales’ theorem:</b> If $C$ lies on the circle over the diameter $\\overline{AB}$, then the angle at $C$ is a right angle.'],
        ['Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. ',
            'The line segment $\\overline{MC}$ divides the triangle into two <b>isosceles</b> triangles, because $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. '],
        ['Ihre Basiswinkel sind gleich: ', 'Their base angles are equal: '], ['$\\alpha$ bei $A$ und bei $C$', '$\\alpha$ at $A$ and at $C$'], ['$\\beta$ bei $B$ und bei $C$', '$\\beta$ at $B$ and at $C$'],
        ['Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.', 'Angle sum: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, so $\\gamma = \\alpha + \\beta = 90^\\circ$.'],
        ['<b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ',
            '<b>Central angle theorem:</b> The central angle is twice as big as every inscribed angle over the same arc. '],
        ['<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.',
            '<b>Inscribed angle theorem:</b> All inscribed angles over the same arc are equal. Drag $P$ back and forth along its arc.'],
        ['Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ',
            'Idea of the proof: the diameter through $P$ divides the figure into isosceles triangles with the apex $M$. '],
        ['An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.',
            'In each of them the exterior angle at $M$ is twice as big as a base angle. If $M$ does not lie between the arms, the proof needs a distinction of cases.'],
        ['<b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.',
            '<b>Theorem on the opposite angles in a cyclic quadrilateral:</b> In a quadrilateral whose corners lie on a circle, opposite angles add up to $180^\\circ$.'],
        ['Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ',
            'Idea of the proof: the four radii divide the quadrilateral into four isosceles triangles. Every angle of the quadrilateral is made up of two base angles. '],
        ['$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ',
            '$\\alpha + \\gamma$ contains each of the four different base angles exactly once, and so does $\\beta + \\delta$. So both sums are equal, together $360^\\circ$, each $180^\\circ$. '],
        ['(So einfach geht es, wenn $M$ im Viereck liegt.)', '(It is this simple when $M$ lies inside the quadrilateral.)'],
        // konstruktion7
        ['Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.', 'Given are a circle $k$ with centre $M$ and $r = 2$ cm and a point $P$ outside $k$.'],
        ['Verbinde $M$ und $P$.', 'Join $M$ and $P$.'],
        ['Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.',
            'Construct the perpendicular bisector of $\\overline{MP}$: two arcs round $M$ and $P$ with the same radius. It cuts $\\overline{MP}$ at the midpoint $H$.'],
        ['Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.', 'Draw the circle with centre $H$ through $M$ and $P$, the Thales circle over $\\overline{MP}$.'],
        ['Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.',
            'It cuts $k$ at $B_1$ and $B_2$. By Thales’ theorem the angles $\\angle MB_1P$ and $\\angle MB_2P$ are right angles.'],
        ['Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.',
            'The lines $PB_1$ and $PB_2$ are perpendicular to the radius at $B_1$ and $B_2$: these are the two tangents from $P$ to $k$.'],
        ['Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.',
            'Make a sketch and mark what is given: $c = 6$ cm, $\\alpha$ and $\\beta$. This is the case ASA.'],
        ['Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.', 'Draw the line segment $\\overline{AB}$ with $c = 6$ cm.'],
        ['Trage in $A$ den Winkel $\\alpha$ an.', 'At $A$, draw the angle $\\alpha$.'], ['Trage in $B$ den Winkel $\\beta$ an.', 'At $B$, draw the angle $\\beta$.'],
        ['Die freien Schenkel schneiden sich im Punkt $C$.', 'The free arms intersect at the point $C$.'],
        ['Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.', 'Draw the triangle $ABC$. Check: measure $\\gamma$ and compare with $180^\\circ - \\alpha - \\beta$.'],
        ['Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.',
            'Given are $k_1$ with centre $M_1$ and $r_1 = 2$ cm and $k_2$ with centre $M_2$ and $r_2 = 1$ cm. The two common outer tangents are required.'],
        ['Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.', 'Draw the auxiliary circle $h$ with centre $M_1$ and radius $r_1 - r_2 = 1$ cm.'],
        ['Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.',
            'Construct the tangents from $M_2$ to $h$ as in “Tangents from P”: the Thales circle over $\\overline{M_1M_2}$ cuts $h$ at $T_1$ and $T_2$.'],
        ['Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.', 'Extend $M_1T_1$ and $M_1T_2$ as far as the circle $k_1$: the points of contact $B_1$ and $B_2$.'],
        ['Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.',
            'Move the auxiliary tangents outwards by $r_2$: the parallels through $B_1$ and $B_2$ are the common tangents. They touch $k_2$ where the radius is perpendicular to them.'],
        ['Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.',
            'The free arms do not intersect. There is no such triangle, because the angle sum in a triangle is $180^\\circ$.'],
        ['Du kannst $P$ verschieben, in jedem Schritt.', 'You can move $P$, in every step.'], ['Du kannst $M_2$ verschieben, in jedem Schritt.', 'You can move $M_2$, in every step.'],
        // zahlengerade7
        [', denn ', ', because '], [' liegt weiter <b>links</b>.', ' lies further to the <b>left</b>.'], ['Betrag: ', 'Absolute value: '], [', der Abstand von der Null · ', ', the distance from zero · '],
        ['Gegenzahl: ', 'Opposite number: '], [', gespiegelt an der Null', ', reflected at zero'], ['Abstand von $a$ und $b$: $', 'Distance between $a$ and $b$: $'],
        ['Start bei $', 'Start at $'], ['$, dann $', '$, then $'], ['nach <b>rechts</b>', 'to the <b>right</b>'], ['nach <b>links</b>', 'to the <b>left</b>'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Subtracting a number means <b>adding its opposite number</b>. '],
        ['Minus mal minus: Wer $', 'Minus times minus: anyone who subtracts $'], ['$ abzieht, geht nach rechts.', '$ goes to the right.'],
        ['Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.', 'Adding a positive number: to the right. Adding a negative number: to the left.'],
        // zahlbereiche7
        ['eine natürliche Zahl', 'a natural number'], [', also natürlich', ', so natural'], ['der Betrag von $-4$ ist $4$', 'the absolute value of $-4$ is $4$'],
        ['ganz und negativ', 'whole and negative'], ['ein Bruch ohne Minuszeichen', 'a fraction without a minus sign'], ['zwischen 2 und 3, nicht ganz', 'between 2 and 3, not whole'],
        ['negativ und nicht ganz', 'negative and not whole'],
        ['Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.',
            'The <b>integers</b> $\\mathbb{Z}$ and the <b>fractions</b> $\\mathbb{Q}^+$ overlap. In the overlap lie the <b>natural</b> numbers $\\mathbb{N}$. Everything together lies in the <b>rational</b> numbers $\\mathbb{Q}$.'],
        ['<b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.',
            '<b>Subset:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ and $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Every natural number is also an integer, but not the other way round: $-3 \\in \\mathbb{Z}$, but $-3 \\notin \\mathbb{N}$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Intersection:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. These are the numbers that lie in both sets: whole <b>and</b> without a minus sign.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Union:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ contains all the numbers that lie in at least one of the two sets. That is not quite $\\mathbb{Q}$ yet: $-\\tfrac12$ lies in neither of them.'],
        ['<b>Richtig!</b> $', '<b>Correct!</b> $'], ['. · Richtig: ', '. · Correct: '], [' · Richtig: ', ' · Correct: '], ['Richtig: ', 'Correct: '], [' von ', ' of '],
        ['Noch nicht. Tipp: ', 'Not yet. Hint: '], ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', 'Does the number have a minus sign when you work it out?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Work the number out first. Is it whole?'],
        // vorzeichen7
        ['Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.', 'Even exponent: positive. Odd exponent: negative. Because every two minus signs cancel out.'],
        ['Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.', 'Careful: $-2^2 = -(2 \\cdot 2) = -4$, but $(-2)^2 = 4$. The brackets decide.'],
        ['Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.', 'How does the pattern continue? Think before you uncover the next row.'],
        ['Von Zeile zu Zeile wird das Ergebnis um 3 ', 'From row to row the result gets 3 '], ['kleiner', 'smaller'], ['größer', 'bigger'],
        ['. Damit das Muster weitergeht, muss $', '. For the pattern to continue, $'], ['$ sein.', '$ must hold.'],
        ['Plus mal minus ergibt minus.', 'Plus times minus gives minus.'], ['Minus mal minus ergibt plus. Minus mal plus ergibt minus.', 'Minus times minus gives plus. Minus times plus gives minus.'],
        // umstellen7
        ['Probe: ', 'Check: '], ['Stahl, $', 'Steel, $'], ['Wasser, $', 'Water, $'],
        ['Die Formel $', 'Rearrange the formula $'], ['$ nach $', '$ for $'], ['$ umstellen: auf <b>beiden</b> Seiten dasselbe tun, bis $', '$: do the same on <b>both</b> sides until $'],
        ['$ allein steht.', '$ is on its own.'], ['nach $', 'for $'], ['Fertig. Mit Zahlen: ', 'Done. With numbers: '],
        // prozent7
        [' von 100 Feldern', ' of 100 squares'], ['Hunderterfeld mit ', 'Hundred square with '], [' gefärbten Feldern', ' coloured squares'], [' und Prozentstreifen', ' and percentage bar'],
        ['Grundwert $G = ', 'Base value $G = '], ['$ · Prozentsatz $p\\,\\% = ', '$ · percentage rate $p\\,\\% = '], ['Prozentwert ', 'Percentage amount '],
        ['\\,\\% \\text{ von } ', '\\,\\% \\text{ of } '], ['Die drei Grundaufgaben:', 'The three basic problems:'],
        ['vorher ', 'before '], ['nachher ', 'after '], ['zurück ', 'back '],
        ['Steigerung um $', 'An increase by $'], ['Senkung um $', 'A decrease by $'], [' heißt ', ' means '], [' <b>auf</b> $', ' <b>to</b> $'],
        ['. Der Faktor ist $', '. The multiplier is $'], ['Neuer Wert: ', 'New value: '], ['Zurückrechnen auf den Grundwert: $', 'Working back to the base value: $'],
        ['Danach ', 'Then '], ['\\,\\%$ senken', '\\,\\%$ down'], ['\\,\\%$ erhöhen', '\\,\\%$ up'],
        [' der alte Wert! Die zweiten $', ' the old value! The second $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ refer to a different base value.'],
        // diagramm7
        [' als ', ' as a '], ['Klassensprecherwahl: Stimmen', 'Election of the class representative: votes'], ['Zusammen: ', 'Together: '], ['Antworten', 'answers'], ['Stimmen', 'votes'],
        [' = 100 % = 360°. Im Kreisdiagramm gehören zu 1 % genau 3,6°.', ' = 100% = 360°. In a pie chart, 1% corresponds to exactly 3.6°.'],
        ['Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.',
            'A line graph does not fit here: the categories have no order, and there are no values in between them.'],
        ['Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.',
            'A pie chart does not fit here: it shows parts of a whole. The heights of the individual weeks do not add up to a meaningful whole.'],
        ['Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.', 'The line graph fits: it shows how a value changes over time.'],
        // schraegbild7
        [' im Schrägbild', ' in an oblique drawing'], [' im Zweitafelbild', ' in a two-view drawing'],
        [' · Ecken $', ' · vertices $'], ['$ · Kanten $', '$ · edges $'], ['$ · Flächen $', '$ · faces $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Oblique drawing:</b> you draw edges that go backwards at $45^\\circ$ and shortened to <b>half</b>. All the other edges have their true length. Hidden edges are dashed.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Front view</b> (top): the solid from the front. <b>Top view</b> (bottom): from above. Points that belong together lie on a <b>projection line</b> perpendicular to the folding line $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Labels: $A\'$ in the top view, $A\'\'$ in the front view.'],
        ['Die Seitenkante ', 'The lateral edge '], [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' slopes in space. It appears <b>shortened</b> in both views. Turn it about $S\'$ in the top view until it is parallel to the folding line: $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'The projection line leads to $B_0\'\'$. The line segment '], [' zeigt die <b>wahre Länge</b>.', ' shows the <b>true length</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Measured: $\\overline{SB} \\approx '],
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ is the height of a lateral face, measured here: $h_s \\approx '],
        ['$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$V = V_{\\text{large}} - V_{\\text{small}}$: complete the frustum to the whole pyramid (height $'],
        ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) and subtract the small top.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'The four lateral faces are trapeziums with the height $h_s \\approx '],
        ['Masse aus ', 'Mass if made of '], ['Fichtenholz', 'spruce'], ['Glas', 'glass'], ['Stahl', 'steel'],
        // faltnetz7
        ['Dreiecke', 'triangles'], ['Dreieck', 'triangle'], ['Vierecke', 'quadrilaterals'], ['Viereck', 'quadrilateral'], ['Fünfecke', 'pentagons'], ['Fünfeck', 'pentagon'],
        ['Sechsecke', 'hexagons'], ['Sechseck', 'hexagon'],
        ['Ecken $e = ', 'Vertices $e = '], ['$ · Kanten $k = ', '$ · edges $k = '], ['$ · Flächen $f = ', '$ · faces $f = '],
        ['Alle Flächen sind gleiche regelmäßige ', 'All faces are equal regular '], [', an jeder Ecke stoßen ', ', and at every corner '], [' zusammen.', ' meet.'],
        // drittel7
        ['Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.',
            'The cube has the edge length $a$. All three pyramids have their apex at the same corner of the cube. Each has a square with $G = a^2$ as its base and the height $h = a$.'],
        ['Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also ', 'Three equal pyramids fill the cube: $3 \\cdot V_{\\text{pyramid}} = a^3$, so '],
        ['$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$', '$V_{\\text{pyramid}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$'],
        // eckenwinkel7
        ['Lücke ', 'gap '], ['Jeder Innenwinkel: $', 'Each interior angle: $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · at the corner: $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. So ist ', 'Less than $360^\\circ$: if you close the gap, a corner in space is formed. This is how the '],
        [' gebaut.', ' is built.'],
        ['Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.',
            'Exactly $360^\\circ$: the polygons lie flat in the plane, a tiling. No corner of a solid is formed.'],
        ['Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.', 'More than $360^\\circ$: the polygons overlap. No corner can be folded from them.'],
        ['Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.',
            'Columns: how many polygons at a corner. Exactly five cells have a tick: there are exactly five Platonic solids.'],
        [' regelmäßige ', ' regular '], ['-Ecke an einer Ecke', '-gons at one corner'],
    ];
    const rule = [
        // konstruktion7: "SCHRITT 2 VON 5"
        [/SCHRITT (\d+) VON (\d+)/g, 'STEP $1 OF $2'],
        // kreisgerade7: the kind of line in bold, in the middle of a sentence
        [/>(Passante|Tangente|Sekante)<\/b>/g, (m, w) => '>' + { Passante: 'external line', Tangente: 'tangent', Sekante: 'secant' }[w] + '</b>'],
        // zahlbereiche7: "Richtig: 3 von 5"
        [/(Richtig: \d+) von (\d+)/g, '$1 of $2'],
        // umstellen7: the division step "| :a" and the buttons "nach $b$"
        [/\\big\|\\; :/g, '\\big|\\; \\div '], [/\bnach \$([A-Za-z])\$/g, (m, v) => 'for $' + v + '$'],
        // prozent7: "Steigerung um $20\,\%$ heißt Steigerung auf …", "Danach um $20\,\%$ senken", division ":" in "… : 1{,}2"
        [/\$ heißt (Steigerung|Senkung) <b>auf<\/b> \$/g, (m, w) => '$ means ' + (w === 'Steigerung' ? 'an increase' : 'a decrease') + ' <b>to</b> $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen)/g, (m, p, v) => 'Then ' + (v === 'senken' ? 'decrease' : 'increase') + ' by $' + p + '\\,\\%$'],
        [/(\\text\{[^}]*\}) : (?=\d)/g, '$1 \\div '],
        // diagramm7: aria "<title> als Säulendiagramm"
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => (TITLE[t] || t) + ' as a ' + CHART[c]],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => cap(BODY[b] || b) + (v === 'Schrägbild' ? ' in an oblique drawing' : ' in a two-view drawing')],
        // faltnetz7, schraegbild7: "Masse aus Glas" → "Mass if made of glass"; the solid in bold at the start stays a label
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." and the aria "4 regelmäßige 3-Ecke an einer Ecke"
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'So ist <b>' + (BODY[s] || s) + '</b> gebaut.'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, '$1 regular $2-gons at one corner'],
        // "Würfel" is a die in the stochastics dictionary: here it is the cube, as a whole label and in bold
        [/^Würfel$/, 'Cube'], [/>Würfel</g, '>Cube<'],
    ];
    window.BuchEN && BuchEN.add('gy7', { word, phrase, rule });
})();
