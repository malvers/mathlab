/* js/buch-es/gy7.js — Spanish for the widgets of js/buch-gy7.js.
 * Loaded by the Spanish editions right after js/buch-gy7.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy7', {
    word: {
        // book es mathegy7-es (Einstein)
        // shared: the solids, the 3D stage ("Würfel" is a rule below: in stochastics it is a die)
        'Quader': 'Ortoedro', 'Dreiecksprisma': 'Prisma triangular', 'Sechseckprisma': 'Prisma hexagonal', 'Quadratische Pyramide': 'Pirámide cuadrangular',
        'Quadr. Pyramide': 'Pirámide cuadr.', 'Dreieckspyramide': 'Pirámide triangular', 'Pyramidenstumpf': 'Tronco de pirámide', 'Tetraeder': 'Tetraedro',
        'Oktaeder': 'Octaedro', 'Dodekaeder': 'Dodecaedro', 'Ikosaeder': 'Icosaedro', 'Körper in 3D': 'Cuerpo en 3D', 'Ziehen zum Drehen': 'Arrastra para girar',
        'Von vorn': 'Empezar de nuevo', 'Alle Schritte': 'Todos los pasos', 'weniger': 'menos', 'mehr': 'más',
        // titelbildgy7
        'Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl':
            'Ilustración de la portada: una circunferencia con un triángulo rectángulo sobre el diámetro, una pirámide en perspectiva caballera, un icosaedro, un diagrama de sectores y una recta numérica con un número y su opuesto',
        // kreisgerade7
        'Passante': 'Recta exterior', 'Sekante': 'Secante', 'Tangente': 'Tangente',
        'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.':
            'Arrastra los dos puntos de la recta. Cuando la distancia $d$ se acerca al radio $r$, la recta se ajusta como tangente.',
        'Ein Kreis mit einer Passante, einer Sekante und einer Tangente': 'Una circunferencia con una recta exterior, una secante y una tangente',
        'Kreis mit einer verschiebbaren Geraden': 'Circunferencia con una recta que se puede mover',
        // dreieckkreise7
        'Umkreis': 'Circunscrita', 'Inkreis': 'Inscrita', 'Mittelsenkrechten': 'mediatrices', 'Winkelhalbierenden': 'bisectrices',
        'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.':
            'Arrastra los vértices. Cerca de $90^\\circ$, el ángulo del vértice que arrastras se ajusta como ángulo recto.',
        'Dreieck mit Umkreis': 'Triángulo con su circunferencia circunscrita', 'Dreieck mit Inkreis': 'Triángulo con su circunferencia inscrita',
        // kreiswinkel7
        'Thales': 'Tales', 'Peripheriewinkel': 'Ángulo inscrito', 'Sehnenviereck': 'Cuadrilátero inscrito', 'Satz': 'Teorema', 'Zentriwinkel': 'Ángulo central',
        'Beweisidee zeigen': 'Ver la idea de la demostración',
        'Satz des Thales: Dreieck über dem Durchmesser': 'Teorema de Tales: triángulo sobre el diámetro',
        'Peripheriewinkel und Zentriwinkel über einem Kreisbogen': 'Ángulo inscrito y ángulo central sobre un arco',
        'Sehnenviereck mit seinen vier Winkeln': 'Cuadrilátero inscrito con sus cuatro ángulos',
        // konstruktion7
        'Tangenten von P': 'Tangentes desde P', 'Dreieck aus c, α, β': 'Triángulo con c, α, β', 'Tangenten an zwei Kreise': 'Tangentes a dos circunferencias', 'Konstruktion': 'Construcción',
        '◀ Zurück': '◀ Atrás', 'Weiter ▶': 'Siguiente ▶', 'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Winkel $\\beta$': 'Ángulo $\\beta$',
        'Konstruktion der Tangenten von einem Punkt an einen Kreis': 'Construcción de las tangentes desde un punto a una circunferencia',
        'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln': 'Construcción de un triángulo a partir de un lado y dos ángulos',
        'Konstruktion der gemeinsamen Tangenten an zwei Kreise': 'Construcción de las tangentes comunes a dos circunferencias',
        // zahlengerade7
        'Addieren': 'Sumar', 'Subtrahieren': 'Restar', 'Rechenart': 'Operación', 'erste Zahl $a$': 'primer número $a$', 'zweite Zahl $b$': 'segundo número $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Arrastra los puntos $a$ y $b$ por la recta numérica. Se ajustan de medio en medio.',
        'Gegenzahlen': 'Opuestos', 'Zahlengerade mit rationalen Zahlen': 'Recta numérica con números racionales',
        'Rechnen als Bewegung auf der Zahlengeraden': 'Calcular como un movimiento por la recta numérica',
        // zahlbereiche7
        'Wohin gehört die Zahl?': '¿Dónde va el número?', 'Nächste Zahl': 'Siguiente número', 'DIE ZAHL': 'EL NÚMERO',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, pero no $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}^+$, pero no $\\mathbb{N}$',
        'nur $\\mathbb{Q}$': 'solo $\\mathbb{Q}$', 'Nur das Bild': 'Solo el dibujo', 'Teilmengen': 'Subconjuntos', 'Schnittmenge': 'Intersección', 'Vereinigung': 'Unión', 'Mengen': 'Conjuntos',
        'rationale Zahlen': 'números racionales', 'ganze Zahlen': 'números enteros', 'gebrochene Zahlen': 'números fraccionarios', 'natürliche': 'naturales',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Diagrama de conjuntos: números naturales, enteros, fraccionarios y racionales',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': '¿En qué parte del dibujo va? Toca un botón o el dibujo.',
        // vorzeichen7
        'Multiplizieren': 'Multiplicar', 'Potenzen': 'Potencias', 'Muster': 'Patrón', 'erster Faktor': 'primer factor', 'Nächste Zeile': 'Siguiente fila',
        'positiv': 'positivo', 'negativ': 'negativo', 'Die Ergebnisse auf der Zahlengeraden': 'Los resultados en la recta numérica',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'Una balanza en equilibrio: a la izquierda tres cajas x y dos pesas, a la derecha una caja x y seis pesas',
        // umstellen7
        '⇄ Seiten tauschen': '⇄ intercambiar los lados', 'Rechteck': 'Rectángulo', 'Umfang': 'Perímetro', 'Geschwindigkeit': 'Velocidad', 'Dichte': 'Densidad', 'Pyramide': 'Pirámide',
        'Formel': 'Fórmula', 'Nächster Schritt': 'Siguiente paso', 'umstellen nach': 'despejar',
        // prozent7
        'Grundwert $G$': 'Valor base $G$', 'Prozentsatz $p\\,\\%$': 'Tanto por ciento $p\\,\\%$', 'Änderung um': 'Variación',
        'Danach um denselben Prozentsatz zurück': 'Después, volver con el mismo tanto por ciento', 'Balken vor und nach der Änderung': 'Barras antes y después de la variación',
        'Nicht': 'No',
        // diagramm7
        'Wie kommst du zur Schule? Umfrage in einer Klasse': '¿Cómo vienes al instituto? Encuesta en una clase', 'Antworten': 'Respuestas', 'zu Fuß': 'a pie',
        'Fahrrad': 'bici', 'Bus, Bahn': 'autobús, tren', 'Auto': 'coche', 'Klassensprecherwahl: Stimmen': 'Elección de delegado de clase: votos', 'Stimmen': 'Votos',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Altura de un girasol, medida cada semana',
        'Säulendiagramm': 'Diagrama de barras', 'Liniendiagramm': 'Diagrama de líneas', 'Kreisdiagramm': 'Diagrama de sectores', 'Diagramm': 'Diagrama', 'Woche': 'Semana', 'Anteil': 'Parte', 'Winkel': 'Ángulo',
        // schraegbild7
        'Fichtenholz': 'Madera de abeto', 'Glas': 'Vidrio', 'Stahl': 'Acero', 'Schrägbild': 'Perspectiva', 'Zweitafelbild': 'Dos vistas', 'Wahre Länge': 'Verdadera magnitud',
        'Darstellung': 'Representación', 'Körper': 'Cuerpo', 'Grundkante $a$': 'Arista de la base $a$', 'Kante $b$': 'Arista $b$', 'Höhe $h$': 'Altura $h$', 'Stoff': 'Material',
        'Deckkante $b$': 'Arista superior $b$', 'Breite $b$': 'Anchura $b$', 'AUFRISS': 'ALZADO', 'GRUNDRISS': 'PLANTA',
        // faltnetz7
        'Falten': 'Plegar', '▶ Zusammenfalten': '▶ Plegar', '◀ Auffalten': '◀ Desplegar', 'Ein Netz faltet sich zu einem Körper': 'Un desarrollo plano se pliega y forma un cuerpo',
        // drittel7
        'Zusammenschieben': 'Juntar', '▶ Zusammenschieben': '▶ Juntar', '◀ Auseinander': '◀ Separar',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Tres pirámides iguales forman un cubo',
        // eckenwinkel7
        'Dreiecke': 'Triángulos', 'Quadrate': 'Cuadrados', 'Fünfecke': 'Pentágonos', 'Sechsecke': 'Hexágonos', 'Vieleck': 'Polígono', 'Anzahl an der Ecke': 'Número en el vértice',
        'flach': 'plano',
    },
    phrase: [
        // book es mathegy7-es (Einstein)
        // kreisgerade7 (the kind of line in bold is a rule)
        ['$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ', '$r = 3\\,\\text{cm}$ · distancia de la recta al centro: $d \\approx '],
        ['$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine ', '$d > r$: la recta <b>no</b> tiene ningún punto en común con la circunferencia. Es una '],
        ['$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine ',
            '$d = r$: la recta tiene <b>exactamente un</b> punto $B$ en común con la circunferencia, el punto de tangencia. Es una '],
        ['. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.', '. El radio $\\overline{MB}$ es perpendicular a ella.'],
        ['$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine ', '$d < r$: la recta corta la circunferencia en <b>dos</b> puntos, $S_1$ y $S_2$. Es una '],
        ['. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $', '. El segmento $\\overline{S_1S_2}$ es una <b>cuerda</b>, aquí de unos $'],
        ['$ lang.', '$.'], [' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.', ' La secante pasa por $M$: la cuerda es un diámetro.'],
        // dreieckkreise7
        ['Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.',
            'El triángulo es <b>rectángulo</b>: $U$ está justo en el punto medio del lado más largo. Es el teorema de Tales visto desde el otro lado.'],
        ['Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.', 'El triángulo es <b>obtusángulo</b>: $U$ está <b>fuera</b> del triángulo.'],
        ['Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.', 'El triángulo es <b>acutángulo</b>: $U$ está <b>dentro</b> del triángulo.'],
        ['Die drei ', 'Las tres '], [' schneiden sich in einem Punkt $U$. Er ist von allen drei Ecken gleich weit entfernt:', ' se cortan en un punto $U$. Está a la misma distancia de los tres vértices:'],
        [' schneiden sich in einem Punkt $I$. Er hat von allen drei <b>Seiten</b> denselben Abstand:', ' se cortan en un punto $I$. Está a la misma distancia de los tres <b>lados</b>:'],
        ['Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.', 'La circunferencia inscrita toca cada lado. $I$ está siempre dentro del triángulo.'],
        ['Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.', 'Los tres vértices están casi en línea recta. Aleja un vértice.'],
        // kreiswinkel7
        ['<b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.',
            '<b>Teorema de Tales:</b> si $C$ está en la circunferencia de diámetro $\\overline{AB}$, entonces el ángulo en $C$ es un ángulo recto.'],
        ['Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. ',
            'El segmento $\\overline{MC}$ divide el triángulo en dos triángulos <b>isósceles</b>, porque $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. '],
        ['Ihre Basiswinkel sind gleich: ', 'Sus ángulos de la base son iguales: '], ['$\\alpha$ bei $A$ und bei $C$', '$\\alpha$ en $A$ y en $C$'], ['$\\beta$ bei $B$ und bei $C$', '$\\beta$ en $B$ y en $C$'],
        ['Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.', 'Suma de ángulos: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, así que $\\gamma = \\alpha + \\beta = 90^\\circ$.'],
        ['<b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ',
            '<b>Teorema del ángulo central:</b> el ángulo central mide el doble que cualquier ángulo inscrito sobre el mismo arco. '],
        ['<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.',
            '<b>Teorema del ángulo inscrito:</b> todos los ángulos inscritos sobre el mismo arco son iguales. Mueve $P$ a lo largo de su arco.'],
        ['Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ',
            'Idea de la demostración: el diámetro que pasa por $P$ divide la figura en triángulos isósceles con el vértice en $M$. '],
        ['An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.',
            'En cada uno, el ángulo exterior en $M$ mide el doble que un ángulo de la base. Si $M$ no está entre los lados del ángulo, la demostración necesita distinguir casos.'],
        ['<b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.',
            '<b>Teorema de los ángulos opuestos del cuadrilátero inscrito:</b> en un cuadrilátero cuyos vértices están en una circunferencia, los ángulos opuestos suman $180^\\circ$.'],
        ['Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ',
            'Idea de la demostración: los cuatro radios dividen el cuadrilátero en cuatro triángulos isósceles. Cada ángulo del cuadrilátero está formado por dos ángulos de la base. '],
        ['$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ',
            '$\\alpha + \\gamma$ contiene cada uno de los cuatro ángulos de la base distintos exactamente una vez, y $\\beta + \\delta$ también. Así que las dos sumas son iguales, juntas $360^\\circ$, cada una $180^\\circ$. '],
        ['(So einfach geht es, wenn $M$ im Viereck liegt.)', '(Así de fácil es cuando $M$ está dentro del cuadrilátero.)'],
        // konstruktion7 ("SCHRITT 2 VON 5" is a rule)
        ['Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.', 'Se dan una circunferencia $k$ de centro $M$ y $r = 2$ cm y un punto $P$ fuera de $k$.'],
        ['Verbinde $M$ und $P$.', 'Une $M$ y $P$.'],
        ['Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.',
            'Construye la mediatriz de $\\overline{MP}$: dos arcos con centro en $M$ y en $P$ y el mismo radio. Corta $\\overline{MP}$ en el punto medio $H$.'],
        ['Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.', 'Dibuja la circunferencia de centro $H$ que pasa por $M$ y $P$: la circunferencia de Tales sobre $\\overline{MP}$.'],
        ['Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.',
            'Corta $k$ en $B_1$ y $B_2$. Por el teorema de Tales, los ángulos $\\angle MB_1P$ y $\\angle MB_2P$ son rectos.'],
        ['Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.',
            'Las rectas $PB_1$ y $PB_2$ son perpendiculares al radio en $B_1$ y $B_2$: son las dos tangentes desde $P$ a $k$.'],
        ['Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.',
            'Haz una figura de análisis y marca lo que se da: $c = 6$ cm, $\\alpha$ y $\\beta$. Es el caso ALA.'],
        ['Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.', 'Dibuja el segmento $\\overline{AB}$ con $c = 6$ cm.'],
        ['Trage in $A$ den Winkel $\\alpha$ an.', 'Lleva en $A$ el ángulo $\\alpha$.'], ['Trage in $B$ den Winkel $\\beta$ an.', 'Lleva en $B$ el ángulo $\\beta$.'],
        ['Die freien Schenkel schneiden sich im Punkt $C$.', 'Los lados libres de los ángulos se cortan en el punto $C$.'],
        ['Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.', 'Dibuja el triángulo $ABC$. Comprobación: mide $\\gamma$ y compáralo con $180^\\circ - \\alpha - \\beta$.'],
        ['Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.',
            'Se dan $k_1$ de centro $M_1$ y $r_1 = 2$ cm y $k_2$ de centro $M_2$ y $r_2 = 1$ cm. Se buscan las dos tangentes exteriores comunes.'],
        ['Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.', 'Dibuja la circunferencia auxiliar $h$ de centro $M_1$ y radio $r_1 - r_2 = 1$ cm.'],
        ['Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.',
            'Construye las tangentes desde $M_2$ a $h$ como en «Tangentes desde P»: la circunferencia de Tales sobre $\\overline{M_1M_2}$ corta $h$ en $T_1$ y $T_2$.'],
        ['Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.', 'Prolonga $M_1T_1$ y $M_1T_2$ hasta la circunferencia $k_1$: los puntos de tangencia $B_1$ y $B_2$.'],
        ['Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.',
            'Desplaza las tangentes auxiliares $r_2$ hacia fuera: las paralelas por $B_1$ y $B_2$ son las tangentes comunes. Tocan $k_2$ donde el radio es perpendicular a ellas.'],
        ['Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.',
            'Los lados libres de los ángulos no se cortan. Ese triángulo no existe, porque la suma de los ángulos de un triángulo es $180^\\circ$.'],
        ['Du kannst $P$ verschieben, in jedem Schritt.', 'Puedes mover $P$ en cada paso.'], ['Du kannst $M_2$ verschieben, in jedem Schritt.', 'Puedes mover $M_2$ en cada paso.'],
        // zahlengerade7
        [', denn ', ', porque '], [' liegt weiter <b>links</b>.', ' está más a la <b>izquierda</b>.'], ['Betrag: ', 'Valor absoluto: '], [', der Abstand von der Null · ', ', la distancia al cero · '],
        ['Gegenzahl: ', 'Opuesto: '], [', gespiegelt an der Null', ', reflejado respecto al cero'], ['Abstand von $a$ und $b$: $', 'Distancia entre $a$ y $b$: $'],
        ['Start bei $', 'Empieza en $'], ['$, dann $', '$, luego $'], ['nach <b>rechts</b>', 'hacia la <b>derecha</b>'], ['nach <b>links</b>', 'hacia la <b>izquierda</b>'],
        ['$ gar nicht.', '$: no se mueve.'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Restar un número es <b>sumar su opuesto</b>. '],
        ['Minus mal minus: Wer $', 'Menos por menos: quien resta $'], ['$ abzieht, geht nach rechts.', '$ va hacia la derecha.'],
        ['Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.', 'Sumar un número positivo: hacia la derecha. Sumar un número negativo: hacia la izquierda.'],
        // zahlbereiche7
        ['eine natürliche Zahl', 'un número natural'], [', also natürlich', ', así que natural'], ['der Betrag von $-4$ ist $4$', 'el valor absoluto de $-4$ es $4$'],
        ['ganz und negativ', 'entero y negativo'], ['ein Bruch ohne Minuszeichen', 'una fracción sin signo menos'], ['zwischen 2 und 3, nicht ganz', 'entre 2 y 3, no entero'],
        ['negativ und nicht ganz', 'negativo y no entero'],
        ['Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.',
            'Los números <b>enteros</b> $\\mathbb{Z}$ y los números <b>fraccionarios</b> $\\mathbb{Q}^+$ se solapan. En la parte común están los números <b>naturales</b> $\\mathbb{N}$. Todo junto está en los números <b>racionales</b> $\\mathbb{Q}$.'],
        ['<b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.',
            '<b>Subconjunto:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ y $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Todo número natural es también un número entero, pero no al revés: $-3 \\in \\mathbb{Z}$, pero $-3 \\notin \\mathbb{N}$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Intersección:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Son los números que están en los dos conjuntos: enteros <b>y</b> sin signo menos.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Unión:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ contiene todos los números que están en al menos uno de los dos conjuntos. Todavía no es todo $\\mathbb{Q}$: $-\\tfrac12$ no está en ninguno de los dos.'],
        ['<b>Richtig!</b> $', '<b>¡Correcto!</b> $'],
        ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', '¿Tiene el número un signo menos cuando lo calculas?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Calcula primero el número. ¿Es entero?'],
        // vorzeichen7 ("Von Zeile zu Zeile … kleiner/größer" is a rule)
        ['Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.', 'Exponente par: positivo. Exponente impar: negativo. Porque cada dos signos menos se anulan.'],
        ['Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.', 'Cuidado: $-2^2 = -(2 \\cdot 2) = -4$, pero $(-2)^2 = 4$. El paréntesis decide.'],
        ['Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.', '¿Cómo sigue el patrón? Piénsalo antes de descubrir la siguiente fila.'],
        ['. Damit das Muster weitergeht, muss $', '. Para que el patrón continúe, tiene que ser $'], ['$ sein.', '$.'],
        ['Plus mal minus ergibt minus.', 'Más por menos da menos.'], ['Minus mal minus ergibt plus. Minus mal plus ergibt minus.', 'Menos por menos da más. Menos por más da menos.'],
        // umstellen7 (the instruction sentence is a rule: the word order changes)
        ['Probe: ', 'Comprobación: '], ['Stahl, $', 'Acero, $'], ['Wasser, $', 'Agua, $'], ['Fertig. Mit Zahlen: ', 'Listo. Con números: '],
        // prozent7
        [' von 100 Feldern', ' de 100 casillas'], ['Hunderterfeld mit ', 'Cuadrícula de cien con '], [' gefärbten Feldern', ' casillas coloreadas'], [' und Prozentstreifen', ' y barra de porcentajes'],
        ['Grundwert $G = ', 'Valor base $G = '], ['$ · Prozentsatz $p\\,\\% = ', '$ · tanto por ciento $p\\,\\% = '], ['Prozentwert ', 'Valor porcentual '],
        ['\\,\\% \\text{ von } ', '\\,\\% \\text{ de } '], ['Die drei Grundaufgaben:', 'Los tres problemas básicos:'],
        ['vorher ', 'antes '], ['nachher ', 'después '], ['zurück ', 'vuelta '],
        ['Steigerung um $', 'Un aumento del $'], ['Senkung um $', 'Una disminución del $'],
        ['. Der Faktor ist $', '. El factor es $'], ['Neuer Wert: ', 'Valor nuevo: '], ['Zurückrechnen auf den Grundwert: $', 'Volver al valor base: $'],
        [' der alte Wert! Die zweiten $', ' es el valor anterior. El segundo $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ se refiere a otro valor base.'],
        // diagramm7 (the aria "<title> als Säulendiagramm" is a rule)
        ['Zusammen: ', 'En total: '], ['Antworten', 'respuestas'], ['Stimmen', 'votos'],
        [' = 100 % = 360°. Im Kreisdiagramm gehören zu 1 % genau 3,6°.', ' = 100 % = 360°. En el diagrama de sectores, al 1 % le corresponden exactamente 3,6°.'],
        ['Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.',
            'Un diagrama de líneas no encaja aquí: las categorías no tienen orden y entre ellas no hay valores intermedios.'],
        ['Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.',
            'Un diagrama de sectores no encaja aquí: muestra partes de un todo. Las alturas de las distintas semanas no forman juntas un todo con sentido.'],
        ['Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.', 'El diagrama de líneas encaja: muestra cómo cambia un valor a lo largo del tiempo.'],
        // schraegbild7 (the aria "Quader im Schrägbild" is a rule)
        [' · Ecken $', ' · vértices $'], ['$ · Kanten $', '$ · aristas $'], ['$ · Flächen $', '$ · caras $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Perspectiva caballera:</b> las aristas que van hacia atrás las dibujas con $45^\\circ$ y reducidas a la <b>mitad</b>. Todas las demás aristas tienen su longitud real. Las aristas ocultas son discontinuas.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Alzado</b> (arriba): el cuerpo visto de frente. <b>Planta</b> (abajo): visto desde arriba. Los puntos que se corresponden están en una <b>línea de referencia</b> perpendicular a la línea de tierra $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notación: $A\'$ en la planta, $A\'\'$ en el alzado.'],
        ['Die Seitenkante ', 'La arista lateral '], [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' está inclinada en el espacio. En las dos vistas aparece <b>acortada</b>. Gírala en la planta alrededor de $S\'$ hasta que quede paralela a la línea de tierra: $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'La línea de referencia lleva a $B_0\'\'$. El segmento '], [' zeigt die <b>wahre Länge</b>.', ' muestra la <b>verdadera magnitud</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Medido: $\\overline{SB} \\approx '],
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ es la altura de una cara lateral, medida aquí: $h_s \\approx '],
        ['$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$V = V_{\\text{grande}} - V_{\\text{pequeña}}$: completa el tronco hasta la pirámide entera (altura $'],
        ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) y resta la punta pequeña.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'Las cuatro caras laterales son trapecios de altura $h_s \\approx '],
        ['Masse aus ', 'Masa si es de '], ['Fichtenholz', 'madera de abeto'], ['Glas', 'vidrio'], ['Stahl', 'acero'],
        // faltnetz7
        ['Dreiecke', 'triángulos'], ['Dreieck', 'triángulo'], ['Vierecke', 'cuadriláteros'], ['Viereck', 'cuadrilátero'], ['Fünfecke', 'pentágonos'], ['Fünfeck', 'pentágono'],
        ['Sechsecke', 'hexágonos'], ['Sechseck', 'hexágono'],
        ['Ecken $e = ', 'Vértices $e = '], ['$ · Kanten $k = ', '$ · aristas $k = '], ['$ · Flächen $f = ', '$ · caras $f = '],
        ['Alle Flächen sind gleiche regelmäßige ', 'Todas las caras son '], [', an jeder Ecke stoßen ', ' regulares iguales; en cada vértice concurren '], [' zusammen.', '.'],
        // drittel7
        ['Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.',
            'El cubo tiene aristas de longitud $a$. Las tres pirámides tienen su vértice en la misma esquina del cubo. Cada una tiene como base un cuadrado con $G = a^2$ y la altura $h = a$.'],
        ['Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also ', 'Tres pirámides iguales llenan el cubo: $3 \\cdot V_{\\text{pirámide}} = a^3$, así que '],
        ['$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$', '$V_{\\text{pirámide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$'],
        // eckenwinkel7 ("So ist das <b>Ikosaeder</b> gebaut." and the aria are rules)
        ['Lücke ', 'hueco '], ['Jeder Innenwinkel: $', 'Cada ángulo interior: $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · en el vértice: $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. ', 'Menos de $360^\\circ$: si se cierra el hueco, se forma un vértice en el espacio. '],
        ['Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.',
            'Exactamente $360^\\circ$: los polígonos quedan planos en el plano, como un embaldosado. No se forma el vértice de un cuerpo.'],
        ['Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.', 'Más de $360^\\circ$: los polígonos se solapan. Con ellos no se puede plegar ningún vértice.'],
        ['Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.',
            'Columnas: cuántos polígonos hay en un vértice. Exactamente cinco casillas tienen una marca: hay exactamente cinco sólidos platónicos.'],
    ],
    rule: [
        // book es mathegy7-es (Einstein)
        // konstruktion7: "SCHRITT 2 VON 5"
        [/SCHRITT (\d+) VON (\d+)/g, (m, a, b) => 'PASO ' + a + ' DE ' + b],
        // kreisgerade7: the kind of line in bold, in the middle of a sentence ("Es una <b>recta exterior</b>.")
        [/>(Passante|Tangente|Sekante)<\/b>/g, (m, w) => '>' + { Passante: 'recta exterior', Tangente: 'tangente', Sekante: 'secante' }[w] + '</b>'],
        // dreieckkreise7: the heading over "Umkreis | Inkreis" (gy5 and gy6 have "Kreis" as a fraction shape: Círculo)
        [/^Kreis$/, () => 'Circunferencia'], [/>Kreis</g, () => '>Circunferencia<'],
        // zahlbereiche7: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, (m, a, b) => 'Aciertos: ' + a + ' de ' + b],
        // vorzeichen7: "Von Zeile zu Zeile wird das Ergebnis um 3 kleiner."
        [/Von Zeile zu Zeile wird das Ergebnis um 3 (kleiner|größer)(?=\.)/g, (m, w) => 'De fila en fila, el resultado ' + (w === 'kleiner' ? 'disminuye' : 'aumenta') + ' en 3'],
        // umstellen7: the instruction (Spanish starts with the variable), then the buttons "nach $b$" under "despejar"
        [/Die Formel \$([^$]+)\$ nach \$([^$]+)\$ umstellen: auf <b>beiden<\/b> Seiten dasselbe tun, bis \$([^$]+)\$ allein steht\./g,
            (m, f, v, w) => 'Despeja $' + v + '$ en la fórmula $' + f + '$: haz lo mismo en los <b>dos</b> lados hasta que $' + w + '$ quede despejada.'],
        [/\bnach \$([A-Za-z])\$/g, (m, v) => '$' + v + '$'],
        // prozent7: "Steigerung um $20\,\%$ heißt Steigerung <b>auf</b> $120\,\%$", "Danach um $20\,\%$ senken"
        [/\$ heißt (?:Steigerung|Senkung) <b>auf<\/b> \$/g, () => '$ significa pasar <b>al</b> $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen)/g, (m, p, v) => 'Después, ' + (v === 'senken' ? 'bajar' : 'subir') + ' un $' + p + '\\,\\%$'],
        // diagramm7: aria "<title> als Säulendiagramm"
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({
            'Wie kommst du zur Schule? Umfrage in einer Klasse': '¿Cómo vienes al instituto? Encuesta en una clase',
            'Klassensprecherwahl: Stimmen': 'Elección de delegado de clase: votos',
            'Höhe einer Sonnenblume, jede Woche gemessen': 'Altura de un girasol, medida cada semana'
        }[t] || t) + ' como ' + { Säulendiagramm: 'diagrama de barras', Liniendiagramm: 'diagrama de líneas', Kreisdiagramm: 'diagrama de sectores' }[c]],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({
            'Würfel': 'Cubo', 'Quader': 'Ortoedro', 'Dreiecksprisma': 'Prisma triangular', 'Sechseckprisma': 'Prisma hexagonal', 'Quadratische Pyramide': 'Pirámide cuadrangular',
            'Dreieckspyramide': 'Pirámide triangular', 'Pyramidenstumpf': 'Tronco de pirámide'
        }[b] || b) + (v === 'Schrägbild' ? ' en perspectiva caballera' : ' en dos vistas')],
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." (before the cube rule) and the aria "4 regelmäßige 3-Ecke an einer Ecke"
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'Así se construye el <b>' +
            ({ 'Tetraeder': 'tetraedro', 'Würfel': 'cubo', 'Oktaeder': 'octaedro', 'Dodekaeder': 'dodecaedro', 'Ikosaeder': 'icosaedro' }[s] || s) + '</b>.'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, (m, n, k) => n + ' polígonos regulares de ' + k + ' lados en un vértice'],
        // "Würfel" is a die in the stochastics dictionary: here it is the cube, as a whole label and in bold
        [/^Würfel$/, () => 'Cubo'], [/>Würfel</g, () => '>Cubo<'],
    ]
});
