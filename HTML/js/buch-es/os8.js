/* js/buch-es/os8.js — Spanish for the widgets of js/buch-os8.js.
 * Loaded by the Spanish editions right after js/buch-os8.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('os8', {
    word: {
        // book es mathe8-es (Curie)
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Portada: dos rectas que se cortan, un cilindro en perspectiva caballera, una homotecia, un diagrama de árbol y un plato de bicicleta',
        // kreisflaecheos8
        'Anzahl der Stücke $n$': 'Número de trozos $n$',
        // zylinderos8
        'Kreiszylinder': 'Cilindro', 'Hohlzylinder': 'Cilindro hueco', 'Körper': 'Cuerpo', 'Schrägbild': 'Perspectiva', 'Netz': 'Desarrollo',
        'Darstellung': 'Representación', 'Material': 'Material', 'Holz': 'Madera', 'Aluminium': 'Aluminio', 'Stahl': 'Acero',
        'Radius $r$': 'Radio $r$', 'Innenradius $r_i$': 'Radio interior $r_i$', 'Höhe $h$': 'Altura $h$', 'Mantel': 'Superficie lateral',
        'Grundfläche (Kreisring)': 'Base (corona circular)', 'Außenmantel': 'Superficie lateral exterior', 'Innenmantel': 'Superficie lateral interior',
        'Oberfläche': 'Área total', 'Volumen': 'Volumen', 'Grundfläche': 'Área de la base', 'Größe': 'Magnitud', 'Formel und Wert': 'Fórmula y valor',
        'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.':
            'La superficie lateral es un rectángulo: tan ancho como la longitud de la circunferencia de la base y tan alto como el cilindro.',
        'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.':
            'En la perspectiva caballera, el círculo de la base se convierte en una elipse aplanada. Las líneas ocultas son discontinuas.',
        // stromos8
        'Verbrauch im Jahr': 'Consumo al año', 'Arbeitspreis in ct/kWh': 'Precio de la energía en ct/kWh', 'Grundpreis im Monat': 'Término fijo al mes',
        'Abschlag im Monat': 'Pago a cuenta al mes', 'Kosten': 'Costes', 'gezahlt': 'pagado',
        'Balken: Jahreskosten aus Arbeitspreis und Grundpreis gegen die gezahlten Abschläge':
            'Barras: costes anuales de precio de la energía y término fijo frente a los pagos a cuenta realizados',
        'Arbeitspreis': 'Precio de la energía', 'Grundpreis': 'Término fijo', 'Jahreskosten': 'Costes anuales', 'Abschläge': 'Pagos a cuenta',
        // fahrrados8
        'Reifengröße': 'Medida del neumático', 'Kettenblatt vorn (Zähne)': 'Plato delantero (dientes)', 'Ritzel hinten (Zähne)': 'Piñón trasero (dientes)',
        'Trittfrequenz (pro Minute)': 'Cadencia (por minuto)', 'Übersetzung': 'Relación de transmisión', 'Radumfang': 'Perímetro de la rueda',
        'Weg pro Kurbelumdrehung': 'Recorrido por pedalada', 'Geschwindigkeit': 'Velocidad', 'Kurbelumdrehungen pro km': 'Pedaladas por km',
        'Vereinfacht ist hier der Raddurchmesser die Zollangabe mal $2{,}54\\,\\text{cm}$. Großes Kettenblatt und kleines Ritzel: schnell, aber schwer zu treten.':
            'Para simplificar, aquí el diámetro de la rueda es la medida en pulgadas por $2{,}54\\,\\text{cm}$. Plato grande y piñón pequeño: rápido, pero cuesta pedalear.',
        // termwertos8
        'Termpaar': 'Par de expresiones', 'Einsetzen: $x$': 'Sustituir: $x$',
        // flaecheos8
        'Term': 'Expresión', 'mit Zahlen': 'con números', 'mit x': 'con x', 'Faktor $a$': 'Factor $a$', 'Länge $b$': 'Longitud $b$', 'Länge $c$': 'Longitud $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Rectángulo de altura a, dividido en dos partes: a por (b más c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Rectángulo de altura a, dividido en dos partes: a por (b menos c)',
        // linearos8
        'Steigung $m$': 'Pendiente $m$', 'y-Achsenabschnitt $n$': 'Ordenada en el origen $n$',
        'Graph einer proportionalen Funktion mit Steigungsdreieck': 'Gráfica de una función de proporcionalidad con el triángulo de pendiente',
        'Graph einer linearen Funktion mit Steigungsdreieck': 'Gráfica de una función lineal con el triángulo de pendiente',
        'Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.': 'La gráfica es una recta que pasa por el origen $(0, 0)$.',
        // lgsgrafos8
        'Gleichungssystem': 'Sistema de ecuaciones', 'Nächster Schritt': 'Siguiente paso', 'Alle Schritte': 'Todos los pasos', 'Von vorn': 'Empezar de nuevo',
        'Zwei Geraden eines Gleichungssystems im Koordinatensystem': 'Dos rectas de un sistema de ecuaciones en el sistema de coordenadas',
        'Unendlich viele Lösungen.': 'Infinitas soluciones.', 'Keine Lösung: $L = \\{\\,\\}$': 'Ninguna solución: $S = \\{\\,\\}$',
        // tarifos8
        'Beispiel': 'Ejemplo', 'Handy': 'Móvil', 'Strom': 'Luz', 'Carsharing': 'Coche compartido',
        'Minuten': 'minutos', 'kWh im Jahr': 'kWh al año', 'Kilometer': 'kilómetros',
        'Tarif A: Grundgebühr': 'Tarifa A: cuota fija', 'Tarif B: Grundgebühr': 'Tarifa B: cuota fija',
        'Tarif A: € pro Minute': 'Tarifa A: € por minuto', 'Tarif B: € pro Minute': 'Tarifa B: € por minuto',
        'Tarif A: € pro kWh': 'Tarifa A: € por kWh', 'Tarif B: € pro kWh': 'Tarifa B: € por kWh',
        'Tarif A: € pro km': 'Tarifa A: € por km', 'Tarif B: € pro km': 'Tarifa B: € por km',
        'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch': 'Costes de las tarifas A y B según el consumo',
        // rosetteos8
        'Hilfslinien ein/aus': 'Líneas auxiliares sí/no', 'Zweiter Ring ein/aus': 'Segundo anillo sí/no', 'Anzahl der Blätter $n$': 'Número de pétalos $n$',
        'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.':
            'Con 6 pétalos todo encaja exactamente: el radio se puede llevar seis veces sobre la circunferencia. Cada arco alrededor de uno de los puntos pasa por el centro y por los dos puntos vecinos. Los pétalos justo se tocan.',
        // zaehlenos8
        'Anordnungen': 'Ordenaciones', 'Zählprinzip': 'Principio de multiplicación', 'Art': 'Tipo', 'Anzahl der Personen $n$': 'Número de personas $n$',
        'Zahlenschloss': 'Candado de combinación', 'Menü': 'Menú', 'Outfit': 'Conjunto',
        'Kombinationen': 'combinaciones', 'Menüs': 'menús', 'Outfits': 'conjuntos',
        'Vorspeise': 'Primer plato', 'Hauptgericht': 'Segundo plato', 'Nachtisch': 'Postre', 'T-Shirt': 'Camiseta', 'Hose': 'Pantalón', 'Schuhe': 'Zapatos',
        '1. Ring: Möglichkeiten': '1.er anillo: opciones', '2. Ring: Möglichkeiten': '2.º anillo: opciones', '3. Ring: Möglichkeiten': '3.er anillo: opciones',
        'Vorspeise: Möglichkeiten': 'Primer plato: opciones', 'Hauptgericht: Möglichkeiten': 'Segundo plato: opciones', 'Nachtisch: Möglichkeiten': 'Postre: opciones',
        'T-Shirt: Möglichkeiten': 'Camiseta: opciones', 'Hose: Möglichkeiten': 'Pantalón: opciones', 'Schuhe: Möglichkeiten': 'Zapatos: opciones',
        'Das sind zu viele, um sie alle aufzuschreiben. Bei 4 Personen sind es noch 24.': 'Son demasiadas para escribirlas todas. Con 4 personas todavía son 24.',
        // raumos8
        'Länge $a$': 'Longitud $a$', 'Breite $b$': 'Anchura $b$', 'Raumhöhe $h$': 'Altura de la habitación $h$', 'Türen': 'Puertas', 'Fenster': 'Ventanas',
        'Verschnitt beim Boden': 'Recortes en el suelo',
        'Grundriss eines Zimmers und seine vier Wände nebeneinander, mit Türen und Fenstern': 'Plano de una habitación y sus cuatro paredes una al lado de otra, con puertas y ventanas',
        'Bodenfläche': 'Superficie del suelo', 'Wandfläche': 'Superficie de las paredes', 'Farbe (2 Anstriche)': 'Pintura (2 manos)', 'Material zusammen': 'Material en total',
        'Luftraum des Zimmers': 'Volumen de aire de la habitación',
        // reifenos8
        'Reifen': 'Neumático', 'Reifenbreite': 'Anchura del neumático', 'Raddurchmesser': 'Diámetro de la rueda', 'in Zoll': 'en pulgadas', 'Umdrehungen pro km': 'Vueltas por km',
    },
    phrase: [
        // book es mathe8-es (Curie)
        // kreisflaecheos8
        ['\\,\\%$ von $r$), ', '\\,\\%$ de $r$), '],
        ['seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\cdot r$. Je mehr Stücke, desto genauer stimmt es:',
            'su longitud es la mitad de la circunferencia $\\dfrac{u}{2} = \\pi \\cdot r$. Cuantos más trozos, más exacto resulta:'],
        // zylinderos8: the mass row
        ['Masse (Holz, $', 'Masa (madera, $'], ['Masse (Aluminium, $', 'Masa (aluminio, $'], ['Masse (Stahl, $', 'Masa (acero, $'],
        // stromos8
        ['Kosten und Abschläge sind genau gleich.', 'Los costes y los pagos a cuenta son exactamente iguales.'],
        ['<b>Nachzahlung</b>: $', '<b>Pago pendiente</b>: $'], ['$. Die Abschläge waren zu niedrig.', '$. Los pagos a cuenta fueron demasiado bajos.'],
        ['<b>Guthaben</b>: $', '<b>Saldo a favor</b>: $'], ['$ werden zurückgezahlt.', '$ se devuelven.'],
        [' Ein passender neuer Abschlag wäre etwa $', ' Un nuevo pago a cuenta adecuado sería de unos $'], ['$ im Monat.', '$ al mes.'],
        // termwertos8
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'El mismo valor en todas las filas. La tabla no lo demuestra, pero una transformación lo muestra: las expresiones son <b>equivalentes</b>.'],
        ['Für $x = ', 'Para $x = '], ['$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig</b>.', '$ los valores son distintos: las expresiones <b>no son equivalentes</b>.'],
        ['und $', 'y $'],
        // flaecheos8
        ['Ausmultiplizieren: ', 'Desarrollar: '], ['Ausklammern, von rechts nach links gelesen: $', 'Sacar factor común, leído de derecha a izquierda: $'],
        ['Probe mit $x = ', 'Comprobación con $x = '], ['$ und $', '$ y $'],
        ['Vom ganzen Rechteck $a \\cdot b$ wird der schraffierte Streifen $a \\cdot c$ abgezogen.', 'Del rectángulo entero $a \\cdot b$ se quita la franja rayada $a \\cdot c$.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'El rectángulo entero es igual de grande que sus dos partes juntas.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Cada sumando del paréntesis se multiplica por el factor $a$.'],
        // linearos8
        ['Der Graph verläuft <b>waagerecht</b>.', 'La gráfica es <b>horizontal</b>.'],
        ['Jede Stelle ist eine Nullstelle.', 'Todo $x$ es un cero.'], ['Es gibt keine Nullstelle.', 'No hay ningún cero.'],
        ['Nullstelle (türkis): $0 = ', 'Cero (turquesa): $0 = '], ['$, also $x_0 = ', '$, por tanto $x_0 = '],
        ['Schnittpunkt mit der y-Achse (weiß): $', 'Punto de corte con el eje y (blanco): $'],
        // lgsgrafos8
        ['<b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ', '<b>Paso 1:</b> despeja $y$ en las dos ecuaciones: $y = '], ['$ und $y = ', '$ e $y = '],
        ['<b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0 \\mid n)$, dann mit dem Steigungsdreieck weiter.',
            '<b>Paso 2:</b> dibuja las dos rectas: empieza en $(0, n)$ y sigue con el triángulo de pendiente.'],
        ['<b>Schritt 3:</b> Schnittpunkt ablesen: $S(', '<b>Paso 3:</b> lee el punto de corte: $S('], ['$. Probe: $', '$. Comprobación: $'],
        ['Genau eine Lösung: $S = ', 'Exactamente una solución: $S = '],
        ['<b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.',
            '<b>Paso 3:</b> las dos ecuaciones describen <b>la misma recta</b>. Todo punto de ella cumple las dos ecuaciones.'],
        ['<b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.',
            '<b>Paso 3:</b> la misma pendiente, distintas ordenadas en el origen: las rectas son <b>paralelas</b> y nunca se cortan.'],
        // tarifos8
        ['Tarif A: $y = ', 'Tarifa A: $y = '], ['Tarif B: $y = ', 'Tarifa B: $y = '],
        ['($x$ in Minuten, $y$ in €)', '($x$ en minutos, $y$ en €)'], ['($x$ in kWh im Jahr, $y$ in €)', '($x$ en kWh al año, $y$ en €)'],
        ['($x$ in Kilometer, $y$ in €)', '($x$ en kilómetros, $y$ en €)'],
        ['Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ', 'Las dos tarifas cuestan lo mismo por unidad, las rectas son paralelas. '],
        ['Die Tarife sind gleich teuer.', 'Las tarifas cuestan lo mismo.'],
        ['Gleichsetzen: $', 'Igualando: $'], ['$ ergibt $x \\approx ', '$ da $x \\approx '], ['$. Dann kosten beide etwa $', '$. Entonces las dos cuestan unos $'],
        ['Die Geraden schneiden sich nicht bei positivem Verbrauch: ', 'Las rectas no se cortan para un consumo positivo: '],
        // rosetteos8
        ['Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ',
            'Cada pétalo está formado por dos arcos de circunferencia de radio $r$ que van del centro a un punto de la circunferencia. Los puntos dividen la circunferencia en '],
        ['Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.', 'Como cada pétalo mide $60^\\circ$ de ancho, con menos de 6 pétalos quedan huecos.'],
        ['Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.', 'Como cada pétalo mide $60^\\circ$ de ancho, con más de 6 los pétalos se solapan.'],
        // zaehlenos8
        ['Die Wahrscheinlichkeit, dass eine zufällige Sitzordnung genau die alphabetische ist: $', 'La probabilidad de que un orden de asientos al azar sea exactamente el alfabético: $'],
        ['Vorspeise: ', 'Primer plato: '], ['Hauptgericht: ', 'Segundo plato: '], ['Nachtisch: ', 'Postre: '], ['T-Shirt: ', 'Camiseta: '], ['Hose: ', 'Pantalón: '], ['Schuhe: ', 'Zapatos: '],
        ['$ Kombinationen', '$ combinaciones'], ['$ Menüs', '$ menús'], ['$ Outfits', '$ conjuntos'],
        ['Für jede Wahl im ersten Schritt gibt es alle Möglichkeiten des zweiten, für jede dieser Kombinationen alle des dritten: Die Anzahlen werden multipliziert.',
            'Para cada elección del primer paso están todas las opciones del segundo, y para cada una de estas combinaciones, todas las del tercero: los números se multiplican.'],
        [' Wer die Kombination rät, trifft beim ersten Versuch mit der Wahrscheinlichkeit $', ' Quien adivina la combinación acierta al primer intento con la probabilidad $'],
        // raumos8
        ['Annahmen: Laminat im Paket zu ', 'Supuestos: tarima laminada en paquetes de '],
        [' m² für 21,90 €, Tür 1,8 m², Fenster 1,56 m², 1 ℓ Farbe reicht für 7 m², Eimer zu 5 ℓ für 24,95 €. Pakete und Eimer gibt es nur ganz: Es wird aufgerundet.',
            ' m² por 21,90 €, puerta 1,8 m², ventana 1,56 m², 1 ℓ de pintura cubre 7 m², botes de 5 ℓ por 24,95 €. Los paquetes y los botes solo se venden enteros: se redondea hacia arriba.'],
        // reifenos8
        ['Aufschrift auf dem Reifen: ', 'Inscripción en el neumático: '], [' (Breite in mm, dann Felgendurchmesser in mm)', ' (anchura en mm, después diámetro de la llanta en mm)'],
    ],
    rule: [
        // book es mathe8-es (Curie)
        // kreisflaecheos8
        [/Ein Kreis in (\d+) Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt/g, 'Un círculo cortado en $1 trozos y los trozos colocados uno al lado de otro, alternándose'],
        [/Die (\d+) Stücke bilden fast ein Rechteck\. Seine Höhe ist fast der Radius \$r\$ \(hier \$/g, 'Los $1 trozos forman casi un rectángulo. Su altura es casi el radio $r$ (aquí $'],
        // zylinderos8: "Kreiszylinder mit dem Radius 3 cm und der Höhe 8 cm"
        [/(Hohlzylinder|Kreiszylinder) mit dem Radius ([\d,]+) cm und der Höhe ([\d,]+) cm/g,
            (m, k, r, h) => (k === 'Hohlzylinder' ? 'Cilindro hueco' : 'Cilindro') + ' de radio ' + r + ' cm y altura ' + h + ' cm'],
        // fahrrados8, reifenos8: "28 Zoll" on the buttons, the chain drive
        [/(\d+) Zoll\b/g, '$1 pulgadas'],
        [/Kettenantrieb: Kettenblatt mit (\d+) Zähnen, Ritzel mit (\d+) Zähnen und das Hinterrad/g, 'Transmisión por cadena: plato de $1 dientes, piñón de $2 dientes y la rueda trasera'],
        [/Kettenblatt (\d+)/g, 'Plato $1'], [/Ritzel (\d+)/g, 'Piñón $1'],
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$" and "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = ([^$]+)\$ ist \$/g, 'Para $x = $1$: $'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' Que coincidan en ' + n + (n === '1' ? ' fila' : ' filas') + ' no basta.'],
        // linearos8
        [/Der Graph <b>steigt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach oben\./g, 'La gráfica <b>crece</b>: si avanzas 1 hacia la derecha, sube $1.'],
        [/Der Graph <b>fällt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach unten\./g, 'La gráfica <b>decrece</b>: si avanzas 1 hacia la derecha, baja $1.'],
        // lgsgrafos8: the solution set is S (glosario); the same rule is in gy8.js and gleichungen.js for pages that load them
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        // lgsgrafos8, tarifos8, zaehlenos8: the example buttons
        [/\bBeispiel (\d+)\b/g, 'Ejemplo $1'],
        // tarifos8
        [/Tarif ([AB]) ist immer günstiger\./g, 'La tarifa $1 es siempre más barata.'],
        [/Bis etwa ([\d.,]+) (min|kWh|km) ist Tarif ([AB]) günstiger, darüber Tarif ([AB])\./g, 'Hasta unos $1 $2 es más barata la tarifa $3; por encima, la tarifa $4.'],
        // rosetteos8
        [/Rosette mit (\d+) Blättern, mit dem Zirkel konstruiert/g, 'Roseta de $1 pétalos, construida con compás'],
        [/ gleiche Teile von je \$([\d{},]+)\^\\circ\$\. /g, (m, d) => ' partes iguales de $' + d + '^\\circ$ cada una. '],
        // zaehlenos8
        [/(\d+) Personen auf (\d+) Plätzen: Für den ersten Platz gibt es (\d+) Möglichkeiten, für den zweiten noch (\d+), und so weiter bis zum letzten Platz\./g,
            '$1 personas en $2 asientos: para el primer asiento hay $3 opciones, para el segundo quedan $4, y así hasta el último asiento.'],
        [/([123])\. Ring: /g, (m, n) => ['1.er', '2.º', '3.er'][+n - 1] + ' anillo: '],
        // raumos8
        [/Wände abgewickelt: ([\d,]+) m lang, ([\d,]+) m hoch/g, 'Paredes desplegadas: $1 m de largo, $2 m de alto'],
        [/mit (\d+) % Verschnitt/g, 'con un $1 % de recortes'],
        [/ → (\d+) Pakete zu \$/g, (m, n) => ' → ' + n + (n === '1' ? ' paquete' : ' paquetes') + ' de $'],
        [/(\d+) Eimer zu 5 ℓ/g, (m, n) => n + (n === '1' ? ' bote' : ' botes') + ' de 5 ℓ'],
        // reifenos8
        [/Laufrad mit Felge (\d+) mm und Reifen (\d+) mm breit/g, 'Rueda con llanta de $1 mm y neumático de $2 mm de ancho'],
        [/Die Zollangabe ist eher ein Name: Ein „(\d+)-Zoll-Rad“ hat hier \$([\d{},]+)\$ Zoll\. Genauer ist die Millimeterangabe\./g,
            (m, n, z) => 'La medida en pulgadas es más bien un nombre: una «rueda de ' + n + ' pulgadas» tiene aquí $' + z + '$ pulgadas. La medida en milímetros es más exacta.'],
    ]
});
