/* js/buch-es/gy8.js — Spanish for the widgets of js/buch-gy8.js.
 * Loaded by the Spanish editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy8', {
    word: {
        // book es mathegy8-es (Curie)
        // titelbildgy8
        'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
            'Imagen de portada: un triángulo ampliado desde un centro, un cuadrado formado por a², dos veces ab y b², dos rectas con su punto de intersección y un diagrama de árbol',
        // termbaum8
        'Term': 'Expresión', 'Wert für $x$': 'Valor de $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Toca un nodo: se ilumina su subexpresión.',
        // binomformeln8
        '1. Formel': '1.ª identidad', '2. Formel': '2.ª identidad', '3. Formel': '3.ª identidad', 'Binomische Formel': 'Identidad notable',
        'Länge $a$': 'Longitud $a$', 'Länge $b$': 'Longitud $b$', 'Binomische Formel als Flächenbild': 'Identidad notable como figura de áreas',
        'Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.':
            'El cuadrado grande está formado por cuatro partes: $a^2$, dos veces $ab$ y $b^2$. Quien solo calcula $a^2 + b^2$ olvida los dos rectángulos azules.',
        'Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.':
            'Al cuadrado $a^2$ le quitas las dos franjas rojas $ab$. El cuadrado verde de la esquina, $b^2$, está en las dos franjas, así que lo has quitado dos veces. Una vez vuelve: $+\\,b^2$.',
        'Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.':
            'Del cuadrado $a^2$ se recorta la esquina $b^2$. La pieza azul se gira y se coloca a la derecha: sale un rectángulo de lados $a + b$ y $a - b$.',
        // gluecksrad8
        'Felder': 'Sectores', 'ein Feld weniger': 'un sector menos', 'ein Feld mehr': 'un sector más',
        'gleich groß': 'iguales', 'verschieden groß': 'distintos', 'Größe der Felder': 'Tamaño de los sectores', 'Drehen': 'Girar',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Toca sectores de la ruleta: forman el suceso $E$ (en amarillo). Después gira la ruleta.',
        // wegzeit8
        'Zeit $t$ in min': 'Tiempo $t$ en min', 't in min': 't en min', 's in m': 's en m', 'Weg-Zeit-Diagramm des Schulwegs': 'Diagrama distancia-tiempo del camino al colegio',
        'Zuhause': 'Casa', 'Haltestelle': 'Parada', 'Schule': 'Colegio',
        'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'El camino al colegio como segmento; el punto muestra dónde está Mia ahora',
        'Mia ist in der Schule angekommen.': 'Mia ha llegado al colegio.',
        // lgs8
        'Einsetzungsverfahren': 'Sustitución', 'Gleichsetzungsverfahren': 'Igualación', 'Additionsverfahren': 'Reducción', 'Verfahren': 'Método',
        'Nächster Schritt': 'Siguiente paso', 'Alle Schritte': 'Todos los pasos', 'Neues Gleichungssystem': 'Nuevo sistema',
        'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'Las dos rectas del sistema y su punto de intersección',
        'Klammer auflösen und zusammenfassen.': 'Quita el paréntesis y simplifica.',
        'Löse beide Gleichungen nach $y$ auf.': 'Despeja $y$ en las dos ecuaciones.',
        'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'Los dos segundos miembros son iguales a $y$, así que son iguales entre sí: se igualan.',
        'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'Todas las $x$ a la izquierda, todos los números a la derecha, después divide.',
        'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Multiplica de modo que los números delante de $y$ sean opuestos.',
        'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Suma las dos ecuaciones: $y$ desaparece.',
        'Nach $x$ auflösen.': 'Despeja $x$.', 'Nach $y$ auflösen.': 'Despeja $y$.',
        // streckung8
        'Streckfaktor $k$': 'Razón de homotecia $k$', 'Original': 'Original', 'Bild': 'Imagen', 'Verhältnis': 'Razón', 'Winkel bei $A$': 'Ángulo en $A$', 'gleich': 'igual', 'Fläche': 'Área',
        'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
            'Arrastra $Z$, $A$, $B$ y $C$. Las semirrectas discontinuas parten de $Z$ y pasan por cada punto y su imagen.',
        // aehnlich8
        'Ein Beispiel zeigen': 'Mostrar un ejemplo', 'gegeben': 'dado', 'dein Dreieck': 'tu triángulo',
        'Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen': 'Un triángulo dado y un segundo triángulo para comparar',
        'klein': 'pequeño', 'mittel': 'mediano', 'groß': 'grande', 'Winkel, gegeben': 'Ángulos del dado', 'Winkel bei dir': 'Tus ángulos', 'Seiten­verhältnis': 'Razón de los lados',
        'Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?':
            'Arrastra los vértices amarillos a los puntos de la cuadrícula. ¿Consigues un triángulo semejante al dado, pero en otra posición?',
        // gulliver8
        'k = 12 (Gulliver)': 'k = 12 (Gulliver)', 'Streckfaktor': 'Razón', 'Einheitswürfel': 'Cubo unidad', 'großer Würfel': 'Cubo grande', 'Faktor': 'Factor',
        'Kantenlänge': 'Arista', 'Oberfläche': 'Área total', 'Volumen': 'Volumen',
        'Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.':
            'Gulliver es 12 veces más alto que un liliputiense. Por eso su piel tiene $144$ veces más superficie y su cuerpo $1728$ veces más volumen. En el libro de Jonathan Swift, los matemáticos del emperador calculan exactamente así y le dan cada día comida para 1724 liliputienses, cuatro menos que $12^3$.',
        // schatten8
        'Schattenmethode': 'Método de la sombra', 'Försterdreieck': 'Triángulo del guardabosques', 'Methode': 'Método', 'Sonnenhöhe': 'Altura del sol',
        'Abstand $d$ zum Baum': 'Distancia $d$ al árbol', 'Höhe ausrechnen': 'Calcular la altura', 'Neuer Baum': 'Árbol nuevo', 'Stab 2 m': 'Vara 2 m',
        'Baum und Stab mit ihren Schatten': 'Árbol y vara con sus sombras', 'Höhenmessung mit dem Försterdreieck': 'Medir una altura con el triángulo del guardabosques',
        'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.':
            'Los rayos del sol llegan paralelos. Por eso el triángulo azul y el amarillo son semejantes: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',
        // rueckwaerts8
        'Rückwärts: ein Schritt': 'Hacia atrás: un paso', 'Neues Rätsel': 'Nuevo acertijo', 'Startzahl': 'Número inicial',
        'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
            'Prueba un número en la primera casilla o calcula hacia atrás: cada operación se sustituye por su inversa, sumar por restar, multiplicar por dividir.',
        // sammel8
        'Größe des Albums': 'Tamaño del álbum', 'Eine Tüte öffnen': 'Abrir un sobre', 'Bis das Album voll ist': 'Hasta llenar el álbum',
        '1000 Alben': '1000 álbumes', 'Neues Album': 'Álbum nuevo', 'Mittelwert': 'Media', 'Anzahl der Tüten bis zum vollen Album': 'Número de sobres hasta llenar el álbum',
        'Histogramm: wie viele Tüten 1000 Alben gebraucht haben': 'Histograma: cuántos sobres necesitaron 1000 álbumes',
        // mcpi8
        'Zufallspunkte in einem Quadrat, Treffer im Viertelkreis gelb': 'Puntos aleatorios en un cuadrado, los aciertos en el cuarto de círculo en amarillo',
        'Noch keine Punkte. Lass es regnen!': 'Todavía no hay puntos. ¡Que llueva!',
        // ziffern8
        'als Münze': 'como moneda', 'als Würfel': 'como dado', 'Lesart': 'Lectura', 'Neue Tabelle': 'Tabla nueva',
        'Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.': 'Cifra par (0, 2, 4, 6, 8) = cara, impar = cruz. Cada cifra es un lanzamiento de moneda.',
        'Augenzahl': 'Puntuación', 'absolut': 'absoluta', 'relativ': 'relativa',

        // book es mathe10-es (Curie)

    },
    phrase: [
        // book es mathegy8-es (Curie)
        // lgs8 (a sentence that starts with <b> is no whole label for the engine)
        ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Comprobación</b> en las dos ecuaciones; después, el conjunto solución.'],
        // termbaum8
        ['Rechenbaum des Terms ', 'Árbol de cálculo de la expresión '],
        ['Für $x = ', 'Para $x = '], ['$ hat er den Wert ', '$ tiene el valor '], ['. Gerechnet wird von unten nach oben.', '. Se calcula de abajo arriba.'],
        // gluecksrad8
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Todos los sectores son iguales: un <b>experimento de Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'Los sectores son de <b>distinto tamaño</b>: <b>no</b> es un experimento de Laplace. '],
        ['}$ wäre falsch. ', '}$ sería incorrecto. '], ['Es zählt der Anteil am ganzen Rad: ', 'Lo que cuenta es la parte de toda la ruleta: '],
        ['Zuletzt: Feld <b>', 'Última tirada: sector <b>'], [', $E$ ist eingetreten.', ', $E$ ha ocurrido.'], [', $E$ ist nicht eingetreten.', ', $E$ no ha ocurrido.'],
        [' · Wahrscheinlichkeit $P(E) \\approx ', ' · probabilidad $P(E) \\approx '],
        // wegzeit8
        ['Der Graph steigt gleichmäßig.', 'La gráfica sube de manera uniforme.'],
        ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'La gráfica es horizontal: el tiempo pasa y la distancia no cambia.'],
        ['Hier steigt der Graph am steilsten.', 'Aquí la gráfica sube con más pendiente.'], ['Der Graph steigt flacher als beim ersten Fußweg.', 'La gráfica sube menos que en el primer tramo a pie.'],
        ['Nach $t = ', 'Tras $t = '], ['$ min ist Mia ', '$ min, Mia está a '], [' von zu Hause entfernt.', ' de casa.'],
        // streckung8
        ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Homotecia del triángulo ABC con centro Z y razón '],
        ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'Con $k = 0$ todos los puntos imagen caen en $Z$: la imagen es solo un punto.'],
        ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'Con $k = 1$ cada punto se queda donde está.'],
        ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'Con $k = -1$ la homotecia es una simetría central respecto a $Z$.'],
        ['Bei negativem $k$ liegt jeder Bildpunkt auf der anderen Seite von $Z$. Die Bildstrecken sind $|k| = ', 'Con $k$ negativo, cada punto imagen queda al otro lado de $Z$. Las longitudes se multiplican por $|k| = '],
        ['Eine <b>Vergrößerung</b>', 'Una <b>ampliación</b>'], ['<b>Eine Verkleinerung</b>', '<b>Una reducción</b>'],
        [': Jede Strecke wird $', ': cada longitud se multiplica por $'], ['$-mal so lang, die Fläche $k^2 = ', '$, el área por $k^2 = '],
        ['$-mal so lang.', '$.'], ['$-mal so groß.', '$.'], [' Alle Winkel bleiben gleich.', ' Todos los ángulos se conservan.'],
        // aehnlich8
        ['Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.', 'Los tres puntos están en una recta: no es un triángulo.'],
        ['Ähnlich!', '¡Semejantes!'], ['</b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor $k \\approx ', '</b> Todos los ángulos coinciden y todos los lados se han multiplicado por el mismo factor $k \\approx '],
        ['$ gestreckt.', '$.'], [' Mit $k = 1$ sind die Dreiecke sogar kongruent.', ' Con $k = 1$ los triángulos son incluso congruentes.'],
        ['Noch nicht ähnlich: ', 'Todavía no son semejantes: '], ['Nur ein Winkel stimmt.', 'solo coincide un ángulo.'], ['Kein Winkel stimmt.', 'no coincide ningún ángulo.'],
        [' Die Seitenverhältnisse sind verschieden.', ' Las razones entre los lados son distintas.'],
        // gulliver8
        ['Alle Längen werden $', 'Todas las longitudes se multiplican por $'], ['$-mal so groß, jede Fläche $', '$, cada área por $'], ['$-mal so groß, das Volumen $', '$, el volumen por $'],
        // schatten8
        ['Gemessen: Der Stab ist $2$ m hoch, sein Schatten ist $s \\approx ', 'Medido: la vara mide $2$ m de alto y su sombra $s \\approx '],
        ['$ m lang. Der Schatten des Baums ist $S \\approx ', '$ m. La sombra del árbol mide $S \\approx '], ['$ m lang.', '$ m.'],
        ['. Tatsächlich ist der Baum $', '. En realidad, el árbol mide $'], ['$ m hoch.', '$ m.'],
        ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ',
            'Sostienes un triángulo rectángulo isósceles delante del ojo (a una altura de $1{,}6$ m) y miras a lo largo de su lado más largo. Esa línea sube con un ángulo de $45^\\circ$: '],
        ['Auf $d = ', 'En $d = '], ['$ m steigt sie um $', '$ m sube $'],
        ['Treffer!', '¡Acierto!'], ['</b> Du siehst genau die Spitze. ', '</b> Ves justo la copa. '],
        ['Du siehst den Baum in $', 'Ves el árbol a $'], ['$ m Höhe, unter der Spitze: Geh weiter zurück.', '$ m de altura, por debajo de la copa: aléjate más.'],
        ['Deine Peillinie geht über die Spitze hinweg: Geh näher heran.', 'Tu línea de mira pasa por encima de la copa: acércate más.'],
        // rueckwaerts8
        ['$. Welche Zahl war es?', '$. ¿Qué número era?'], ['Richtig!', '¡Correcto!'], ['Das passt nicht.', 'No encaja.'],
        ['Rückwärts von $', 'Hacia atrás desde $'], ['$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>', '$, con las operaciones inversas: el número inicial es <b>'],
        // sammel8
        ['Voll!', '¡Lleno!'], ['1000 Alben: Im Mittel brauchte man ', '1000 álbumes: de media hicieron falta '], ['$ Tüten', '$ sobres'],
        [' (am wenigsten $', ' (como mínimo $'], ['$, am meisten $', '$, como máximo $'],
        ['Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $', 'También se puede calcular, con herramientas de bachillerato: $'],
        // mcpi8
        ['Der Viertelkreis bedeckt $\\tfrac{\\pi}{4}$ des Quadrats, also ist ', 'El cuarto de círculo cubre $\\tfrac{\\pi}{4}$ del cuadrado, así que '], ['(Abweichung $', '(desviación $'],
        // ziffern8
        ['Wappen: $', 'Cara: $'], ['$ · Zahl: $', '$ · cruz: $'], ['$ · relative Häufigkeit von Wappen: $', '$ · frecuencia relativa de cara: $'],
        ['Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen (grau). So entstehen ', 'Las cifras del 1 al 6 son puntuaciones; 0, 7, 8 y 9 se saltan (en gris). Así salen '],
        [' Würfe.', ' tiradas.'],
        // the pieces of the sentences that a rule below translates as a whole (so tools/buch-en/check.mjs sees them translated, too)
        ['Summanden', 'Sumandos'], ['Minuend und Subtrahend', 'Minuendo y sustraendo'], ['Faktoren', 'Factores'], ['Dividend und Divisor', 'Dividendo y divisor'],
        ['Differenz', 'diferencia'], ['Produkt', 'producto'], ['Quotient', 'cociente'], ['Potenz', 'potencia'], ['Basis und Exponent', 'Base y exponente'],
        ['Der Term $', 'La expresión $'], ['</b>: Zuletzt wird ', '</b>: lo último es '],
        ['Ausgewählt: ', 'Selección: '], ['der Teilterm $', 'la subexpresión $'], [' mit dem Wert $', ' con el valor $'],
        ['die Variable $x$ mit dem Wert $', 'la variable $x$ con el valor $'], ['die Zahl $', 'el número $'],
        ['Basis $', 'Base $'], ['$, Exponent $', '$, exponente $'], ['$ und $', '$ y $'],
        ['Glücksrad mit ', 'Ruleta con '], [' Feldern', ' sectores'],
        ['Gedreht: $', 'Giros: $'], ['$-mal · $E$ eingetreten: $', '$ · $E$ ha ocurrido $'], ['$-mal · relative Häufigkeit ', '$ veces · frecuencia relativa '],
        ['geht zu Fuß zur Haltestelle', 'va a pie a la parada'], ['wartet an der Haltestelle', 'espera en la parada'],
        ['fährt mit dem Bus', 'va en autobús'], ['geht das letzte Stück zur Schule', 'recorre a pie el último tramo hasta el colegio'],
        ['Löse Gleichung I nach $', 'Despeja $'], ['$ auf.', '$.'], ['Setze das für $', 'Sustituye $'], ['$ in Gleichung II ein.', '$ por esa expresión en la ecuación II.'],
        ['$ auflösen.', '$.'], ['Setze $', 'Sustituye $'], ['$ in die umgestellte Gleichung ein.', '$ en la ecuación despejada.'],
        ['Setze $x = ', 'Sustituye $x = '], ['$ in Gleichung I (umgestellt) ein.', '$ en la ecuación I (despejada).'], ['$ in Gleichung I ein.', '$ en la ecuación I.'],
        [': erst selbst überlegen, dann aufdecken.', ': piénsalo tú primero y después descúbrelo.'],
        ['Ein Einheitswürfel und ein Würfel aus ', 'Un cubo unidad y un cubo de '], [' hoch drei Einheitswürfeln', ' al cubo cubos unidad'],
        ['Ich denke mir eine Zahl und rechne: ', 'Pienso un número y calculo: '], ['geteilt durch', 'entre'], ['. Heraus kommt $', '. El resultado es $'],
        ['Mit $', 'Con $'], ['$ kommt $', '$ sale $'], ['$ heraus. ', '$. '],
        [' Bilder', ' cromos'], ['Geöffnet: $', 'Abiertos: $'], ['$ Tüten · im Album: $', '$ sobres · en el álbum: $'], ['$ Bildern · doppelt: $', '$ cromos · repetidos: $'],
        ['Jede Tüte enthält ein Bild. Alle ', 'Cada sobre contiene un cromo. Los '],
        [' Bilder sind gleich häufig. Wie viele Tüten brauchst du, bis das Album voll ist?', ' cromos son igual de frecuentes. ¿Cuántos sobres necesitas hasta llenar el álbum?'],
        [' Punkte', ' puntos'], ['Von $', 'De $'], ['$ Punkten liegen $', '$ puntos, $'], ['$ im Viertelkreis, das ist der Anteil $', '$ están en el cuarto de círculo, es decir, la proporción $'],
        ['$ ist ', '$ es '], ['Schritt ', 'Paso '], [' von ', ' de '], ['$ von $', '$ de $'],
        // labels that tools/buch-en/check.mjs only sees inside a cut literal (the aria labels) or in two literals (Gulliver)
        ['Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm',
            'Imagen de portada: un triángulo ampliado desde un centro, un cuadrado formado por a², dos veces ab y b², dos rectas con su punto de intersección y un diagrama de árbol'],
        ['Binomische Formel als Flächenbild', 'Identidad notable como figura de áreas'],
        ['Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen', 'Un triángulo dado y un segundo triángulo para comparar'],
        ['Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. ',
            'Gulliver es 12 veces más alto que un liliputiense. Por eso su piel tiene $144$ veces más superficie y su cuerpo $1728$ veces más volumen. '],
        ['Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.',
            'En el libro de Jonathan Swift, los matemáticos del emperador calculan exactamente así y le dan cada día comida para 1724 liliputienses, cuatro menos que $12^3$.'],

        // book es mathe10-es (Curie)

    ],
    rule: [
        // book es mathegy8-es (Curie)
        // sets of whole numbers: \{1; 2; 3\} → \{1, 2, 3\} (with a decimal comma the semicolon stays)
        [/\\\{([^$]*?)\\\}/g, (m, s) => /\d(?:,|\{,\})\d/.test(s) ? m : '\\{' + s.replace(/; /g, ', ') + '\\}'],
        // lgs8: the solution set is S in the Spanish books (glosario: conjunto solución S)
        [/L = \\\{\(/g, 'S = \\{('],
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$."
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'La expresión $' + t + '$ es ' + ({ Summe: 'una <b>suma</b>', Differenz: 'una <b>diferencia</b>', Produkt: 'un <b>producto</b>', Quotient: 'un <b>cociente</b>', Potenz: 'una <b>potencia</b>' })[k] +
                ': lo último es ' + ({ Summe: 'sumar', Differenz: 'restar', Produkt: 'multiplicar', Quotient: 'dividir', Potenz: 'elevar a una potencia' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Sumandos', 'Minuend und Subtrahend': 'Minuendo y sustraendo', 'Faktoren': 'Factores', 'Dividend und Divisor': 'Dividendo y divisor' })[p] + ': $' + a + '$ y $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, exponente $' + b + '$.'],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$/g,
            (m, t, k) => 'Selección: la subexpresión $' + t + '$, ' + ({ Summe: 'una suma', Differenz: 'una diferencia', Produkt: 'un producto', Quotient: 'un cociente', Potenz: 'una potencia' })[k] + ', con el valor $'],
        // gluecksrad8: the aria label and "Gedreht: $12$-mal · $E$ eingetreten: $5$-mal · relative Häufigkeit …"
        [/Glücksrad mit (\d+) Feldern/g, 'Ruleta con $1 sectores'],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
            (m, a, b) => 'Giros: $' + a + '$ · $E$ ha ocurrido $' + b + '$ ' + (b === '1' ? 'vez' : 'veces') + ' · frecuencia relativa '],
        // wegzeit8: "Sie fährt mit dem Bus: $300$ m pro Minute. "
        [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
            (m, d, v) => ({ 'geht zu Fuß zur Haltestelle': 'Va a pie a la parada', 'wartet an der Haltestelle': 'Espera en la parada', 'fährt mit dem Bus': 'Va en autobús',
                'geht das letzte Stück zur Schule': 'Recorre a pie el último tramo hasta el colegio' })[d] + (v ? ': $' + v + '$ m por minuto. ' : '. ')],
        // lgs8: the steps with a variable or a number in them
        [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Despeja $' + v + '$ en la ecuación I.'],
        [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Sustituye $' + v + '$ por esa expresión en la ecuación II.'],
        [/Setze \$([xy] = -?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v) => 'Sustituye $' + v + '$ en la ecuación despejada.'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v) => 'Sustituye $' + v + '$ en la ecuación I (despejada).'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I ein\./g, (m, v) => 'Sustituye $' + v + '$ en la ecuación I.'],
        [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Paso $1 de $2: piénsalo tú primero y después descúbrelo.'],
        // gulliver8: k = 1 changes nothing, and the aria label
        [/Alle Längen werden \$1\$-mal so groß, jede Fläche \$1\^2 = 1\$-mal so groß, das Volumen \$1\^3 = 1\$-mal so groß\./g,
            'Con $k = 1$ las longitudes, las áreas y los volúmenes no cambian.'],
        [/Ein Einheitswürfel und ein Würfel aus (\d+) hoch drei Einheitswürfeln/g, 'Un cubo unidad y un cubo de $1 × $1 × $1 cubos unidad'],
        // rueckwaerts8: the puzzle in words and the try
        [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$/g,
            (m, ops) => 'Pienso un número y calculo: ' + ops.replace(/geteilt durch/g, 'entre').replace(/\bmal\b/g, 'por').replace(/\bplus\b/g, 'más').replace(/\bminus\b/g, 'menos').replace(/, dann /g, ', luego ') + '. El resultado es $'],
        [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'Con $' + a + '$ sale $' + b + '$. '],
        // sammel8: the album in numbers (before the album sizes "10 Bilder")
        [/Jede Tüte enthält ein Bild\. Alle (\d+) Bilder sind gleich häufig\. Wie viele Tüten brauchst du, bis das Album voll ist\?/g,
            'Cada sobre contiene un cromo. Los $1 cromos son igual de frecuentes. ¿Cuántos sobres necesitas hasta llenar el álbum?'],
        [/Geöffnet: \$(\d+)\$ Tüten · im Album: \$(\d+)\$ von \$(\d+)\$ Bildern · doppelt: \$/g,
            (m, p, g, n) => 'Abiertos: $' + p + '$ ' + (p === '1' ? 'sobre' : 'sobres') + ' · en el álbum: $' + g + '$ de $' + n + '$ cromos · repetidos: $'],
        [/(\d+) Bilder\b/g, '$1 cromos'], [/title="Bild (\d+)"/g, 'title="Cromo $1"'],
        // mcpi8: the buttons and "Von $1.000$ Punkten liegen $791$ im Viertelkreis, das ist der Anteil $…"
        [/\+([\d.]+) Punkte</g, '+$1 puntos<'],
        [/Von \$([^$]*)\$ Punkten liegen \$([^$]*)\$ im Viertelkreis, das ist der Anteil \$/g,
            (m, a, b) => 'De $' + a + '$ puntos, $' + b + '$ están en el cuarto de círculo, es decir, la proporción $'],

        // book es mathe10-es (Curie)

    ]
});
