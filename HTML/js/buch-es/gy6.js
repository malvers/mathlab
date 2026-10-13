/* js/buch-es/gy6.js — Spanish for the widgets of js/buch-gy6.js (mathegy6-es):
 *   titelbildgy6, bruchbild6, mengen6, bruchop6, vorrang6, probieren6, pfeile6, zufall6, darstellung6, proportional6,
 *   dreisatz6, winkelsumme6, konstruktion6, seitenwinkel6, linien6, flaeche6, vierecke6, prisma6, kreisdiagramm6,
 *   sieb6, primfaktor6
 * Loaded by the Spanish editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
(function () {
    // the steppers write "<label> kleiner" / "<label> größer" as aria-label
    const STEP = {
        'Zähler': 'numerador', 'Nenner': 'denominador', 'erster Zähler': 'primer numerador', 'erster Nenner': 'primer denominador',
        'zweiter Zähler': 'segundo numerador', 'zweiter Nenner': 'segundo denominador',
        'zu Fuß': 'a pie', 'Fahrrad': 'bici', 'Bus oder Bahn': 'autobús o tren', 'Auto': 'coche'
    };
    // the special lines (linien6)
    const LINE = { 'Mittelsenkrechten': 'mediatrices', 'Winkelhalbierende': 'bisectrices', 'Höhen': 'alturas', 'Seitenhalbierende': 'medianas' };
    // the shapes (flaeche6, vierecke6, prisma6): every Spanish name is masculine ("un", "todo")
    const SHAPE = {
        'Quadrat': 'cuadrado', 'Rechteck': 'rectángulo', 'Raute': 'rombo', 'Parallelogramm': 'paralelogramo', 'gleichschenkliges Trapez': 'trapecio isósceles',
        'gleichschenklige Trapez': 'trapecio isósceles', 'Drachenviereck': 'deltoide', 'Trapez': 'trapecio', 'Viereck': 'cuadrilátero', 'Dreieck': 'triángulo',
        'Dreiecksprisma': 'prisma triangular', 'Quader': 'ortoedro', 'Trapezprisma': 'prisma trapezoidal', 'Sechseckprisma': 'prisma hexagonal'
    };
    // the congruence theorems: L = lado, A = ángulo; LlA = two sides and the angle opposite the longer one (German SsW)
    const CASE = { sss: 'LLL', sws: 'LAL', wsw: 'ALA', SsW: 'LlA', www: 'AAA' };
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    // the units of the rule of three (dreisatz6), singular for 1
    const UNIT = { Pumpen: ['bomba', 'bombas'], Hefte: ['cuaderno', 'cuadernos'], Kaninchen: ['conejo', 'conejos'], Tage: ['día', 'días'] };

    window.BuchES && BuchES.add('gy6', {
        word: {
            // book es mathegy6-es (Einstein)
            // titelbildgy6
            'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
                'Ilustración de la portada: un círculo con tres octavos de colores, los números primos hasta 30 como puntos luminosos, un triángulo con sus tres ángulos y la paralela por el vértice superior, un prisma triangular en perspectiva caballera',
            // bruchbild6
            'Zähler': 'Numerador', 'Nenner': 'Denominador', 'Kreis': 'Círculo', 'Streifen': 'Tira', 'Bild': 'Figura',
            'Der Bruch ist eine natürliche Zahl.': 'La fracción es un número natural.',
            // mengen6
            'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagrama de Venn: los números naturales están dentro de los números fraccionarios',
            'Richtig.': 'Correcto.', 'Noch nicht.': 'Todavía no.', 'Noch einmal': 'Otra vez',
            'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcula el valor: ¿es un número entero, sin resto?',
            'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': '¿Está quizá el número entre dos números naturales?',
            'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'en $\\mathbb{N}$ (y, por tanto, también en $\\mathbb{Q}^+$)',
            'nur in $\\mathbb{Q}^+$': 'solo en $\\mathbb{Q}^+$',
            // bruchop6
            'mal': 'por', 'durch': 'entre', 'Rechenart': 'Operación',
            'Zähler 1': 'Numerador 1', 'Nenner 1': 'Denominador 1', 'Zähler 2': 'Numerador 2', 'Nenner 2': 'Denominador 2',
            'erster Zähler': 'primer numerador', 'erster Nenner': 'primer denominador', 'zweiter Zähler': 'segundo numerador', 'zweiter Nenner': 'segundo denominador',
            'Das Ergebnis wäre kleiner als null.': 'El resultado sería menor que cero.',
            'Für das Bild sind die Zahlen zu groß.': 'Los números son demasiado grandes para la figura.',
            'Das Bild zeigt nur Brüche bis 1.': 'La figura solo muestra fracciones hasta 1.',
            'Mal null ist null.': 'Por cero da cero.', 'Durch null kann man nicht teilen.': 'No se puede dividir entre cero.',
            '1. Bruch': '1.ª fracción', '2. Bruch': '2.ª fracción', 'Ergebnis': 'Resultado',
            'Streifenbild der Rechnung': 'El cálculo como tira', 'Rechteckbild: ein Teil von einem Teil': 'Rectángulo: una parte de una parte',
            'Wie oft passt der zweite Bruch in den ersten?': '¿Cuántas veces cabe la segunda fracción en la primera?',
            'Grün': 'Verde',
            'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numerador por numerador, denominador por denominador. Simplificar antes ahorra trabajo.',
            'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Para dividir entre una fracción, se multiplica por su inversa.',
            // vorrang6
            'Punkt vor Strich': 'Multiplicar antes que sumar', 'Klammern zuerst': 'Primero los paréntesis', 'Mit Komma': 'Con decimales',
            'Von links nach rechts': 'De izquierda a derecha', 'Rechenvorteil': 'Truco de cálculo', 'Aufgabe': 'Ejercicio',
            'Nächster Schritt': 'Siguiente paso', 'Von vorn': 'Empezar de nuevo', 'Jetzt:': 'Ahora:', 'Fertig.': 'Listo.',
            'Jetzt die Strichrechnung.': 'Ahora las sumas y restas.',
            // probieren6
            'Einsetzen': 'Sustituir', 'Alle Werte prüfen': 'Comprobar todos los valores',
            'Zahlenstrahl: grün erfüllt, rot nicht': 'Recta numérica: en verde los que cumplen, en rojo los que no',
            'Passt.': 'Cumple.', 'Passt nicht.': 'No cumple.',
            'Probe: Einsetzen ergibt eine wahre Aussage.': 'Comprobación: al sustituir sale una igualdad verdadera.',
            'Die linke Seite ist zu klein.': 'El miembro izquierdo es demasiado pequeño.', 'kleiner': 'menor', 'größer': 'mayor',
            'Die linke Seite ist zu groß.': 'El miembro izquierdo es demasiado grande.',
            // pfeile6
            'Schüler → Vorname': 'Alumno → nombre', 'Vorname → Schüler': 'Nombre → alumno', 'Schüler → Sitzplatz': 'Alumno → asiento',
            'Zahl → Teiler': 'Número → divisor', 'Zahl → Doppeltes': 'Número → doble', 'Zahl → Rest bei : 3': 'Número → resto al dividir entre 3',
            'Zuordnung': 'Correspondencia', 'Platz 1': 'Asiento 1', 'Platz 2': 'Asiento 2', 'Platz 3': 'Asiento 3', 'Platz 4': 'Asiento 4',
            'Welche Art von Zuordnung ist das?': '¿Qué tipo de correspondencia es?',
            'mehrdeutig': 'no unívoca', 'eindeutig': 'unívoca', 'eineindeutig': 'biunívoca', 'eindeutig, aber nicht eineindeutig': 'unívoca, pero no biunívoca',
            'Richtig:': 'Correcto:', 'Nicht ganz.': 'No exactamente.',
            // zufall6
            'Münze': 'Moneda', 'Würfel': 'Dado', 'Versuch': 'Experimento',
            'Kopf': 'Cara', 'Zahl': 'Cruz', 'Rot': 'Rojo',
            '1-mal': '1 vez', '10-mal': '10 veces', '100-mal': '100 veces', 'Löschen': 'Borrar',
            'Säulendiagramm der relativen Häufigkeiten': 'Diagrama de barras de las frecuencias relativas',
            'absolut': 'absoluta', 'relativ': 'relativa',
            // darstellung6
            'Kerze': 'Vela', 'Temperatur': 'Temperatura', 'Fahrradverleih': 'Alquiler de bicis', 'Zeile wählen': 'Elegir un valor',
            'Zeit in h': 'Tiempo en h', 'Höhe in cm': 'Altura en cm', 'Uhrzeit': 'Hora', 'Temperatur in °C': 'Temperatura en °C',
            'Leihzeit in h': 'Tiempo de alquiler en h', 'Preis in €': 'Precio en €',
            'Wortform:': 'Con palabras:', 'Tabelle:': 'Tabla:', 'Gleichung:': 'Ecuación:',
            'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'Ninguna. La temperatura solo se puede medir, no calcular.',
            // proportional6
            'Äpfel': 'Manzanas', 'Kuchen': 'Tarta', 'Taxi': 'Taxi',
            'direkt proportional': 'directamente proporcional', 'indirekt proportional': 'inversamente proporcional', 'keins von beiden': 'ninguna de las dos',
            'Masse in kg': 'Masa en kg', 'Personen': 'Personas', 'Stück pro Person': 'Trozos por persona', 'Strecke in km': 'Distancia en km',
            'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.':
                'El cociente $y : x$ es siempre $2{,}5$: <b>directamente proporcional</b>. La gráfica es una recta que pasa por el origen.',
            'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.':
                'El producto $x \\cdot y$ es siempre $24$: <b>inversamente proporcional</b>. El doble de personas, la mitad de tarta.',
            'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.':
                'Cuantos más kilómetros, más caro. Pero el cociente cambia: <b>no es proporcional</b>. La recta no pasa por el origen.',
            // dreisatz6
            'Pumpen': 'Bombas', 'Hefte': 'Cuadernos', 'Futter': 'Comida', 'Kaninchen': 'Conejos', 'Tage': 'días', 'Antwort:': 'Respuesta:',
            'Schritt 1: Schreib auf, was du weißt.': 'Paso 1: anota lo que sabes.',
            'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Paso 3: calcula hasta la cantidad buscada.',
            // winkelsumme6
            'Beweisfigur': 'Figura de la demostración',
            'Dreieck mit seinen Innenwinkeln': 'Triángulo con sus ángulos interiores',
            'Dreieck mit seinen Innenwinkeln und der Parallelen durch C': 'Triángulo con sus ángulos interiores y la paralela por C',
            'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.':
                'Arrastra los vértices. Los ángulos cambian, pero su suma no. Los valores están redondeados a grados enteros.',
            // konstruktion6
            'sss': 'LLL', 'sws': 'LAL', 'wsw': 'ALA', 'SsW': 'LlA', 'www': 'AAA', 'Gegeben': 'Datos',
            'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$',
            'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Winkel $\\beta$': 'Ángulo $\\beta$', 'Seite $a$ gegenüber $\\alpha$': 'Lado $a$ opuesto a $\\alpha$',
            'Genau ein Dreieck.': 'Exactamente un triángulo.', 'Kein Dreieck.': 'Ningún triángulo.', 'Zwei Dreiecke.': 'Dos triángulos.',
            'Unendlich viele Dreiecke.': 'Infinitos triángulos.',
            'Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.':
                'Las circunferencias de centro $A$ y $r = b$ y de centro $B$ y $r = a$ se cortan por encima de $c$ en exactamente un punto.',
            'Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.': 'Se lleva $b$ sobre el lado de $\\alpha$. El extremo es $C$.',
            'Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.':
                'La circunferencia de centro $B$ corta el lado dos veces. Los datos no determinan el triángulo.',
            'Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.': 'El lado opuesto $a$ es el mayor: $a \\geq c$.',
            'Der Kreis berührt den Schenkel nur.': 'La circunferencia solo toca el lado.',
            'Der Kreis um $B$ erreicht den Schenkel nicht.': 'La circunferencia de centro $B$ no llega al lado.',
            'Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.':
                'Todos tienen la misma forma, pero distinto tamaño. Tres ángulos no determinan un triángulo.',
            'Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.':
                'El tercer ángulo ya se conoce: $\\gamma = 180^\\circ - \\alpha - \\beta$. Falta una longitud.',
            // seitenwinkel6
            'Dreieck aus drei Stäben': 'Triángulo de tres varillas', 'Die Stäbe ergeben kein Dreieck': 'Las varillas no forman un triángulo',
            // linien6
            'Winkelhalbierende': 'Bisectrices', 'Höhen': 'Alturas', 'Seitenhalbierende': 'Medianas', 'Linien': 'Rectas',
            // flaeche6
            'Parallelogramm': 'Paralelogramo', 'Dreieck': 'Triángulo', 'Trapez': 'Trapecio', 'Drachenviereck': 'Deltoide', 'Figur': 'Figura',
            'Zerlegen und verschieben': 'Cortar y mover', 'Grundseite $g$': 'Base $g$', 'Höhe $h$': 'Altura $h$',
            'Diagonale $e$': 'Diagonal $e$', 'Diagonale $f$': 'Diagonal $f$',
            // vierecke6 ("gleichschenkliges" / "Trapez" in two lines: a rule below puts them in Spanish order)
            'Quadrat': 'Cuadrado', 'Rechteck': 'Rectángulo', 'Raute': 'Rombo', 'Viereck': 'Cuadrilátero',
            'gleichschenkliges Trapez': 'Trapecio isósceles', 'Haus der Vierecke': 'Casa de los cuadriláteros',
            'parallele Seiten': 'lados paralelos', 'gleich lange Seiten': 'lados iguales', 'rechte Winkel': 'ángulos rectos', 'Symmetrieachsen': 'ejes de simetría',
            'Diagonalen halbieren sich': 'las diagonales se cortan en su punto medio', 'Diagonalen senkrecht': 'diagonales perpendiculares', 'Diagonalen gleich lang': 'diagonales iguales',
            '2 Paare': '2 pares', '1 Paar': '1 par', 'alle vier': 'los cuatro', 'je zwei gegenüber': 'los opuestos, de dos en dos', 'keine nötig': 'no hace falta',
            'keins nötig': 'no hace falta', 'die beiden Schenkel': 'los dos lados no paralelos', 'je zwei benachbarte': 'los contiguos, de dos en dos',
            'nur eine die andere': 'solo una a la otra', 'mindestens 1': 'al menos 1', 'ja': 'sí', 'nein': 'no',
            'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.':
                'El <b>cuadrilátero</b> está abajo del todo: solo necesita cuatro vértices y cuatro lados, nada más.',
            'Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.':
                'Toca un cuadrilátero de la casa. Lo que está más abajo es más general; lo que está más arriba tiene más propiedades.',
            // prisma6
            'Dreiecksprisma': 'Prisma triangular', 'Quader': 'Ortoedro', 'Trapezprisma': 'Prisma trapezoidal', 'Sechseckprisma': 'Prisma hexagonal',
            'Prisma': 'Prisma', 'Schrägbild': 'Perspectiva', 'Netz': 'Desarrollo',
            'Grundkante $a$': 'Arista de la base $a$', 'Höhe $h$ des Prismas': 'Altura $h$ del prisma',
            'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.':
                'Perspectiva caballera: la base está delante, en su tamaño real. Las aristas que van hacia atrás forman $45^\\circ$ y miden la mitad. Las aristas ocultas son discontinuas.',
            'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.':
                'El desarrollo está formado por las dos bases y la superficie lateral. La superficie lateral es un rectángulo: tan ancho como el perímetro $u$ y tan alto como $h$.',
            // kreisdiagramm6
            'zu Fuß': 'a pie', 'Fahrrad': 'bici', 'Bus oder Bahn': 'autobús o tren', 'Auto': 'coche',
            'Kreisdiagramm: Wie kommst du zur Schule?': 'Diagrama de sectores: ¿cómo vas al colegio?',
            'Anzahl': 'Cantidad', 'Prozent': 'Porcentaje', 'Winkel': 'Ángulo', 'zusammen': 'total',
            'Umfrage in einer Klasse: Wie kommst du zur Schule?': 'Encuesta en una clase: ¿cómo vas al colegio?',
            // sieb6
            'Nächste Primzahl': 'Siguiente primo', 'Alle Schritte': 'Todos los pasos',
            '1 ist keine Primzahl: Sie hat nur einen Teiler. Tipp auf „Nächste Primzahl“.': 'El 1 no es primo: solo tiene un divisor. Toca «Siguiente primo».',
            'Sieb des Eratosthenes: die Zahlen von 1 bis 100': 'Criba de Eratóstenes: los números del 1 al 100',
            'Vielfache von 2': 'múltiplos de 2', 'von 3': 'de 3', 'von 5': 'de 5', 'von 7': 'de 7',
            // primfaktor6
            'Zahl $a$': 'Número $a$', 'Zahl $b$': 'Número $b$', 'ggT': 'm.c.d.', 'kgV': 'm.c.m.',
            'Gib für $a$ eine natürliche Zahl von 2 bis 9999 ein.': 'Escribe para $a$ un número natural del 2 al 9999.',

        },
        phrase: [
            // book es mathegy6-es (Einstein)
            // bruchbild6
            ['Bruch: $', 'Fracción: $'], ['Bild des Bruches ', 'Figura de la fracción '], ['Dezimalzahl: $', 'Número decimal: $'], ['Prozent: $', 'Porcentaje: $'],
            ['Null Teile von ', 'Cero partes de '], [' sind nichts: $0$.', ' no son nada: $0$.'],
            ['Der gekürzte Nenner ', 'El denominador simplificado '],
            [' hat nur die Primfaktoren 2 und 5. Erweitern mit $', ' solo tiene los factores primos 2 y 5. Amplificar por $'],
            ['. Die Dezimalzahl <b>bricht ab</b>.', '. El número decimal <b>es exacto</b>.'],
            ['$ enthält den Primfaktor $', '$ contiene el factor primo $'],
            ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
                '$. No se puede amplificar hasta 10, 100, 1000 …: el número decimal es <b>periódico</b>.'],
            // mengen6
            ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 es un número natural, y todo número natural es también un número fraccionario: '],
            [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' está entre 0 y 1. No es un número natural.'],
            [' liegt zwischen 0 und 1.', ' está entre 0 y 1.'], [' liegt zwischen 2 und 3.', ' está entre 2 y 3.'],
            [' liegt zwischen 4 und 5.', ' está entre 4 y 5.'],
            ['. Der Bruch sieht nur anders aus als die 3.', '. La fracción es el 3, solo que escrito de otra forma.'],
            ['In der Schule zählt die 0 zu den natürlichen Zahlen.', 'En el colegio, el 0 cuenta como número natural.'],
            ['. Die Null nach dem Komma ändert nichts.', '. El cero después de la coma no cambia nada.'],
            ['$ und $', '$ y $'], [' und $', ' y $'], [', aber $', ', pero $'],
            [': die natürlichen Zahlen $', ': los números naturales $'],
            [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $', ': los números fraccionarios, es decir, todos los números que se pueden escribir como fracción $'],
            ['$ schreiben kann.', '$.'],
            ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Todo número natural es también un número fraccionario: $'],
            // bruchop6
            ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
                '$: con los números fraccionarios esta resta no es posible. Los números negativos los conocerás en 7.º curso.'],
            ['Hauptnenner: $', 'Mínimo común denominador: $'], ['$ (das kleinste gemeinsame Vielfache von $', '$ (el mínimo común múltiplo de $'],
            ['Erst gleichnamig machen, dann die Zähler addieren. Der Nenner bleibt.', 'Primero se pasa a común denominador y luego se suman los numeradores. El denominador se queda igual.'],
            ['Erst gleichnamig machen, dann die Zähler subtrahieren. Der Nenner bleibt.', 'Primero se pasa a común denominador y luego se restan los numeradores. El denominador se queda igual.'],
            ['$ von $', '$ de $'], ['$ Kästchen. Das ist $', '$ cuadraditos. Es decir, $'],
            ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
                '$: ¿cuántas veces cabe nada en algo? Esa pregunta no tiene respuesta. Entre $0$ no se divide nunca.'],
            ['$ passt $', '$ cabe $'], ['$-mal in $', '$ veces en $'],
            // vorrang6
            ['Punktrechnung zuerst: $', 'Primero multiplicar y dividir: $'], ['Hauptnenner 4: $', 'Común denominador 4: $'],
            ['Die Klammer zuerst: $', 'Primero el paréntesis: $'],
            ['Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.', 'Listo. Con el paréntesis sale otra cosa que sin él.'],
            ['Punkt vor Strich: $', 'Multiplicar y dividir antes que sumar y restar: $'],
            ['Fertig. Wer von links rechnet, erhält falsch $6$.', 'Listo. Quien calcula de izquierda a derecha obtiene, por error, $6$.'],
            ['Zwei Punktrechnungen: die linke zuerst. $', 'Dos multiplicaciones o divisiones: primero la de la izquierda. $'],
            ['Distributivgesetz: $', 'Propiedad distributiva: se saca $'], ['$ ausklammern.', '$ factor común.'],
            ['Fertig. Ohne Ausklammern: $', 'Listo. Sin sacar factor común: $'], ['$, mehr Arbeit.', '$, más trabajo.'],
            // probieren6
            ['$, und $', '$, y $'],
            ['Gesucht sind alle Zahlen, für die die linke Seite kleiner als $', 'Se buscan todos los números para los que el miembro izquierdo es menor que $'],
            ['Gesucht sind alle Zahlen, für die die linke Seite größer als $', 'Se buscan todos los números para los que el miembro izquierdo es mayor que $'],
            ['$ ist.', '$.'], ['Es passen: ', 'Cumplen: '], ['Bisher passt keiner.', 'De momento no cumple ninguno.'],
            // pfeile6
            ['Pfeildarstellung: ', 'Diagrama de flechas: '],
            ['Schüler → Vorname', 'Alumno → nombre'], ['Vorname → Schüler', 'Nombre → alumno'], ['Schüler → Sitzplatz', 'Alumno → asiento'],
            ['Zahl → Teiler', 'Número → divisor'], ['Zahl → Doppeltes', 'Número → doble'], ['Zahl → Rest bei : 3', 'Número → resto al dividir entre 3'],
            ['Die Zuordnung ist mehrdeutig. ', 'La correspondencia es no unívoca. '],
            ['Die Zuordnung ist eindeutig, aber nicht eineindeutig. ', 'La correspondencia es unívoca, pero no biunívoca. '],
            ['Die Zuordnung ist eineindeutig. ', 'La correspondencia es biunívoca. '],
            ['Die Zuordnung ist ', 'La correspondencia es '],
            ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
                'De cada elemento de la izquierda sale exactamente una flecha, y a cada uno de la derecha llega exactamente una. También al revés la correspondencia es unívoca.'],
            ['Von jedem Element links geht genau ein Pfeil aus. ', 'De cada elemento de la izquierda sale exactamente una flecha. '],
            // zufall6
            ['Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance',
                'Frecuencia relativa = frecuencia absoluta : número de experimentos. La línea discontinua muestra la probabilidad'],
            [' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)', ' (el rojo es media ruleta; el azul, un tercio; el verde, un sexto)'],
            ['. Je mehr Versuche, desto näher kommen die Säulen meistens heran.', '. Cuantos más experimentos, más se acercan las barras, casi siempre.'],
            // darstellung6
            ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'Una vela mide 20 cm de alto. Cada hora se consume 2,5 cm.'],
            ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'Un día de otoño se mide la temperatura cada dos horas.'],
            ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'Alquilar una bici cuesta 3 € por hora.'],
            ['Diagramm: ', 'Gráfica: '], ['Gewählt: ', 'Elegido: '],
            ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
                'La vela se consume de forma regular, también entre las horas en punto. Por eso se pueden unir los puntos con una línea.'],
            ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
                'La línea discontinua solo une los puntos medidos. Lo que pasó entre ellos no se sabe con exactitud.'],
            ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'Solo se cobran horas enteras; por eso solo hay puntos sueltos.'],
            // proportional6
            ['Äpfel: 1 kg kostet 2,50 €', 'Manzanas: 1 kg cuesta 2,50 €'], ['24 Stück Kuchen werden gerecht verteilt', 'Se reparten 24 trozos de tarta a partes iguales'],
            ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Taxi: 3 € de bajada de bandera y 2 € por km'],
            ['Graph der Zuordnung ', 'Gráfica de la correspondencia: '], ['. Zieh den gelben Punkt.', '. Arrastra el punto amarillo.'],
            // dreisatz6
            ['3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?', '3 kg de manzanas cuestan 7,50 €. ¿Cuánto cuestan 5 kg?'],
            ['4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?', '4 bombas vacían una piscina en 6 horas. ¿Cuánto tardan 3 bombas?'],
            ['5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?', '5 cuadernos cuestan 4 €. ¿Cuánto cuestan 8 cuadernos?'],
            ['Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?', 'Una reserva de comida alcanza para 12 conejos durante 10 días. ¿Cuánto dura para 8 conejos?'],
            ['5 kg Äpfel kosten 12,50 €.', '5 kg de manzanas cuestan 12,50 €.'], ['3 Pumpen brauchen 8 Stunden.', '3 bombas tardan 8 horas.'],
            ['8 Hefte kosten 6,40 €.', '8 cuadernos cuestan 6,40 €.'], ['Für 8 Kaninchen reicht das Futter 15 Tage.', 'Para 8 conejos, la comida dura 15 días.'],
            ['Schritt 2: Rechne auf eins zurück. ', 'Paso 2: reduce a la unidad. '],
            ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'directamente proporcional: los dos lados se calculan con el mismo número.'],
            ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
                'inversamente proporcional: a la derecha se hace la operación contraria. «: 4» a la izquierda se convierte en «· 4» a la derecha.'],
            // konstruktion6
            ['<b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.',
                '<b>Criterio LLL:</b> si dos triángulos coinciden en los tres lados, entonces son congruentes.'],
            ['<b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.',
                '<b>Criterio LAL:</b> si dos triángulos coinciden en dos lados y el ángulo comprendido entre ellos, entonces son congruentes.'],
            ['<b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.',
                '<b>Criterio ALA:</b> si dos triángulos coinciden en un lado y los dos ángulos contiguos a él, entonces son congruentes.'],
            ['<b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.',
                '<b>Criterio LlA:</b> si dos triángulos coinciden en dos lados y en el ángulo opuesto al lado <b>mayor</b>, entonces son congruentes.'],
            ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
                '<b>no unívoca:</b> de un elemento salen varias flechas. <b>unívoca:</b> de cada uno sale exactamente una. <b>biunívoca:</b> unívoca, y también unívoca al revés.'],
            ['Die freien Schenkel der Winkel schneiden sich in $C$. ', 'Los lados libres de los ángulos se cortan en $C$. '],
            ['. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.', '. Para $\\gamma$ no queda nada: los lados se separan.'],
            ['$ ist schon $', '$ ya es $'],
            ['Die beiden kürzeren Seiten sind zusammen ', 'Los dos lados más cortos miden juntos '], [' cm lang, die längste ', ' cm; el más largo, '],
            [' cm. Die Kreise treffen sich nicht.', ' cm. Las circunferencias no se cortan.'], ['Die Kreise treffen sich nicht.', 'Las circunferencias no se cortan.'],
            ['Die Kreise berühren sich nur auf der längsten Seite.', 'Las circunferencias solo se tocan sobre el lado más largo.'], ['Konstruktion aus ', 'Construcción a partir de '],
            // winkelsumme6
            ['Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ',
                'La línea discontinua es paralela a $\\overline{AB}$. $\\alpha\'$ y $\\alpha$ son ángulos alternos entre paralelas, así que son iguales. Lo mismo $\\beta\'$ y $\\beta$. '],
            ['Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.',
                'Junto con $\\gamma$, $\\alpha\'$ y $\\beta\'$ forman un ángulo llano: $180^\\circ$.'],
            [' und der Parallelen durch C', ' y la paralela por C'],
            // seitenwinkel6
            ['Alle Seiten gleich lang: alle Winkel $60^\\circ$. ', 'Todos los lados iguales: todos los ángulos miden $60^\\circ$. '],
            ['Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.',
                'Dos lados son iguales: el triángulo es isósceles y los ángulos de la base son iguales.'],
            ['Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.',
                'Las dos varillas más cortas miden juntas exactamente lo mismo que la más larga: quedan tumbadas sobre ella. Eso no es un triángulo.'],
            ['Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.', 'Las dos varillas más cortas no llegan a tocarse, las gires como las gires.'],
            [' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.', ' <b>Desigualdad triangular:</b> dos lados juntos tienen que ser siempre más largos que el tercero.'],
            // linien6
            ['Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.',
                'Cada punto de una mediatriz está a la misma distancia de los dos vértices. Su punto de corte $U$ está a la misma distancia de <b>los tres vértices</b>: es el centro de la circunferencia circunscrita.'],
            [' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.', ' En un triángulo obtusángulo, $U$ está fuera.'],
            [' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.', ' En un triángulo rectángulo, $U$ está justo sobre el lado más largo.'],
            [' Bei einem spitzwinkligen Dreieck liegt $U$ innen.', ' En un triángulo acutángulo, $U$ está dentro.'],
            ['Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.',
                'Cada punto de una bisectriz está a la misma distancia de los dos lados del ángulo. Su punto de corte $I$ está a la misma distancia de <b>los tres lados</b>: es el centro de la circunferencia inscrita. Siempre está dentro.'],
            ['Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.',
                'Una altura es la perpendicular desde un vértice al lado opuesto. Las tres alturas se cortan en un punto $H$.'],
            [' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).', ' En el triángulo obtusángulo, $H$ está fuera: hay que prolongar los lados (discontinuo).'],
            [' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.', ' En el triángulo rectángulo, $H$ es el vértice del ángulo recto.'],
            ['Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.',
                'Una mediana une un vértice con el punto medio del lado opuesto. Su punto de corte $S$ es el baricentro: un triángulo de cartón se puede equilibrar ahí sobre la punta de una aguja.'],
            [' · Schnittpunkt $', ' · punto de corte $'], ['Umkreismittelpunkt', 'circuncentro'], ['Inkreismittelpunkt', 'incentro'],
            ['Höhenschnittpunkt', 'ortocentro'], ['Schwerpunkt', 'baricentro'],
            // flaeche6
            ['Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.',
                'El triángulo recortado se desplaza a la derecha. El paralelogramo se convierte en un rectángulo con la misma base y la misma altura.'],
            ['Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.',
                'Una copia del triángulo gira alrededor del punto medio de un lado. Juntos forman un paralelogramo. El triángulo es la mitad.'],
            ['Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.',
                'Una copia del trapecio gira alrededor del punto medio de un lado no paralelo. Juntos forman un paralelogramo de base $a + c$.'],
            ['Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.',
                'Los cuatro triángulos del deltoide se abren hacia fuera. Llenan exactamente la mitad del rectángulo formado por las dos diagonales.'],
            // prisma6
            ['Grundfläche $G', 'Área de la base $G'], ['$, Umfang der Grundfläche $u', '$, perímetro de la base $u'], ['Mantel $M', 'Superficie lateral $M'],
            ['Oberfläche $O', 'Área total $O'], ['Volumen $V', 'Volumen $V'],
            // kreisdiagramm6
            ['Winkel = Anteil · 360°. ', 'Ángulo = parte · 360°. '], ['Eine Person entspricht hier $', 'Aquí una persona corresponde a $'],
            // sieb6
            ['Schon $', 'Ya $'],
            ['$ ist größer als 100. Alles, was noch übrig ist, ist eine Primzahl. <b>Fertig: 25 Primzahlen bis 100.</b>',
                '$ es mayor que 100. Todo lo que queda es un número primo. <b>Listo: 25 números primos hasta 100.</b>'],
            ['Gefunden: ', 'Encontrados: '], [' Primzahlen. Gestrichen: ', ' números primos. Tachados: '],
            [' Kleinere Vielfache wie $', ' Los múltiplos menores, como $'], ['$ waren schon weg.', '$, ya estaban tachados.'],
            // primfaktor6
            ['$ ist eine <b>Primzahl</b>.', '$ es un <b>número primo</b>.'], ['Faktorbaum von ', 'Árbol de factores de '],
            ['Der ggT besteht aus den Primfaktoren, die in <b>beiden</b> Zerlegungen vorkommen. Das kgV enthält jeden Primfaktor so oft, wie er <b>höchstens</b> vorkommt. ',
                'El m.c.d. está formado por los factores primos que aparecen en <b>las dos</b> descomposiciones. El m.c.m. contiene cada factor primo tantas veces como aparece <b>como máximo</b>. '],
            ['Damit kürzt man: $', 'Con él se simplifica: $'],
            ['Die beiden Zahlen haben keinen gemeinsamen Teiler außer 1.', 'Los dos números no tienen ningún divisor común aparte del 1.'],

        ],
        rule: [
            // book es mathegy6-es (Einstein)
            // the steppers' aria-labels: "Zähler kleiner" → "Numerador: menos"
            [/^(.+) (kleiner|größer)$/, (m, w, d) => STEP[w] ? cap(STEP[w]) + (d === 'kleiner' ? ': menos' : ': más') : m],
            // bruchbild6
            [/^Bild des Bruches (\d+) durch (\d+)$/, 'Figura de la fracción $1/$2'],
            // mengen6
            [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Número $1 de $2: ¿dónde va <b>$3</b>?'],
            [/Alle Zahlen sind einsortiert(?:, (\d+) von (\d+) gleich beim ersten Versuch richtig)?\./g,
                (m, a, b) => 'Todos los números están clasificados' + (a ? ': ' + a + ' de ' + b + ' bien al primer intento' : '') + '.'],
            // bruchop6: "… dann die Zähler addieren / subtrahieren." (the whole sentences are phrases; this is the joined form)
            [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g,
                (m, v) => 'Primero se pasa a común denominador y luego se ' + (v === 'addieren' ? 'suman' : 'restan') + ' los numeradores. El denominador se queda igual.'],
            // probieren6
            [/Geprüft: (\d+) von (\d+) Werten\. /g, 'Comprobados: $1 de $2 valores. '],
            // pfeile6
            [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, 'De «$1» salen $2 flechas.'],
            [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g,
                'Pero a «$1» llegan $2 flechas; al revés, la correspondencia no es unívoca.'],
            // zufall6: the spinner is "ruleta" (glossary)
            [/>(\d+) Versuche</g, (m, n) => '>' + n + (n === '1' ? ' experimento' : ' experimentos') + '<'], [/>Glücksrad</g, '>Ruleta<'],
            // kreisdiagramm6: the column of the table
            [/>Anteil</g, '>Parte<'],
            // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
            [/Gewählt: Uhrzeit /g, 'Gewählt: hora '], [/ → Temperatur /g, ' → temperatura '],
            // dreisatz6: "4 Pumpen" → "4 bombas", "1 Tage" → "1 día"
            [/>([\d.,]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => '>' + n + ' ' + UNIT[u][n === '1' ? 0 : 1] + '<'],
            // konstruktion6
            [/^Konstruktion aus (sss|sws|wsw|SsW|www)$/, (m, k) => 'Construcción a partir de ' + CASE[k]],
            // seitenwinkel6: the largest angle lies opposite the longest side
            [/Der <span class="g-lam">längsten Seite \$([abc])\$<\/span> liegt der <span class="g-lam">größte Winkel \$(\\[a-z]+)\$<\/span> gegenüber, der <span class="g-cy">kürzesten \$([abc])\$<\/span> der kleinste\. /g,
                (m, s1, w, s2) => 'Frente al <span class="g-lam">lado más largo, $' + s1 + '$,</span> está el <span class="g-lam">ángulo mayor, $' + w + '$</span>; frente al <span class="g-cy">más corto, $' + s2 + '$,</span> el menor. '],
            // linien6
            [/>Mittelsenkrechten</g, '>Mediatrices<'],
            [/^Dreieck mit seinen (Mittelsenkrechten|Winkelhalbierende|Höhen|Seitenhalbierende)$/, (m, l) => 'Triángulo con sus ' + LINE[l]],
            // flaeche6
            [/^(Parallelogramm|Dreieck|Trapez|Drachenviereck): zerlegen und verschieben$/, (m, s) => cap(SHAPE[s]) + ': cortar y mover'],
            // vierecke6: the two-line label "gleichschenkliges / Trapez" (the second line may already be a translated label)
            [/(<text class="g6-nodetxt"[^>]*>)gleichschenkliges(<\/text>[^<]*<text class="g6-nodetxt"[^>]*>)(?:Trapez|\u0003\d+\u0004)(<\/text>)/g, '$1Trapecio$2isósceles$3'],
            // vierecke6: "Jedes <b>Quadrat</b> ist auch ein Rechteck, eine Raute, …."
            [/Jede[s]? <b>([^<]+)<\/b> ist auch ([^<]+)\.<\/p>/g, (m, s, list) => 'Todo <b>' + (SHAPE[s] || s) + '</b> es también ' +
                list.split(', ').map(x => { const k = x.replace(/^eine? /, ''); return SHAPE[k] ? 'un ' + SHAPE[k] : x; }).join(', ') + '.</p>'],
            // prisma6
            [/^(Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma) im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang$/,
                (m, s) => cap(SHAPE[s]) + ' en perspectiva caballera: la base delante en su tamaño real, la profundidad a 45 grados y a la mitad'],
            [/^Netz des (Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma)s: zwei Grundflächen und der Mantel aus Rechtecken$/,
                (m, s) => 'Desarrollo del ' + SHAPE[s] + ': dos bases y la superficie lateral, hecha de rectángulos'],
            // sieb6
            [/Die \$(\d+)\$ ist nicht gestrichen, also eine Primzahl\. Gestrichen werden ihre Vielfachen ab \$([^$]+)\$: (\d+) Zahlen \(/g,
                (m, p, q, n) => 'El $' + p + '$ no está tachado, así que es primo. Se tachan sus múltiplos a partir de $' + q + '$: ' + n + ' números ('],
            [/ Primzahlen\. Gestrichen: /g, ' números primos. Tachados: '],

        ]
    });
})();
