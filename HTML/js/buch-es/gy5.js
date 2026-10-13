/* js/buch-es/gy5.js — Spanish for the widgets of js/buch-gy5.js (mathegy5-es):
 *   titelbildgy5, stellenwert5, zahlenstrahl5, sieb5, bruch5, bruchstrahl5, winkel5, winkelpaare5, spiegel5, rechteck5, quader5,
 *   einheiten5, zahlschrift5, komma5, mittel5, koord5, symmetrie5, linien5
 * Loaded by the Spanish editions right after js/buch-gy5.js; the engine and the shared words are in js/buch-es.js.
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
    // Spanish number words: 4 738 216 → cuatro millones setecientos treinta y ocho mil doscientos dieciséis,
    // 3 017 008 000 → tres mil diecisiete millones ocho mil; "un" and "veintiún" before mil and millones
    const ONE = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce',
        'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
        'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const TEN = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const HUN = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const DIGIT = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const apo = (w, a) => a ? w.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un') : w;
    const u100 = (n, a) => apo(n < 30 ? ONE[n] : TEN[Math.floor(n / 10)] + (n % 10 ? ' y ' + ONE[n % 10] : ''), a);
    const u1000 = (n, a) => n === 100 ? 'cien' : [HUN[Math.floor(n / 100)], n % 100 ? u100(n % 100, a) : ''].filter(Boolean).join(' ');
    const u1e6 = (n, a) => { const t = Math.floor(n / 1000), r = n % 1000; return [t ? (t === 1 ? 'mil' : u1000(t, true) + ' mil') : '', r ? u1000(r, a) : ''].filter(Boolean).join(' '); };
    function words(n) {
        if (!n) return 'cero';
        const m = Math.floor(n / 1e6), r = n % 1e6;
        return [m ? (m === 1 ? 'un millón' : u1e6(m, true) + ' millones') : '', r ? u1e6(r, false) : ''].filter(Boolean).join(' ');
    }
    const num = s => +s.replace(/[\s .]/g, '');
    // the column heads of the place value tables (stellenwert5, komma5): U, D, C, UM, DM, CM, UMi …; d, c, m after the comma
    const PLACE = { Mrd: 'MMi', HM: 'CMi', ZM: 'DMi', M: 'UMi', HT: 'CM', ZT: 'DM', T: 'UM', H: 'C', Z: 'D', E: 'U', z: 'd', h: 'c', t: 'm' };
    const ROUND = { Zehner: 'las decenas', Hunderter: 'las centenas', Tausender: 'las unidades de millar', Zehntausender: 'las decenas de millar',
        Hunderttausender: 'las centenas de millar', Millionen: 'los millones' };
    const KIND = { 'Nullwinkel': 'ángulo nulo', 'spitzer Winkel': 'ángulo agudo', 'rechter Winkel': 'ángulo recto', 'stumpfer Winkel': 'ángulo obtuso',
        'gestreckter Winkel': 'ángulo llano', 'überstumpfer Winkel': 'ángulo cóncavo', 'Vollwinkel': 'ángulo completo' };
    const KINDS = Object.keys(KIND).join('|');
    const MOVE = { Spiegelung: 'una reflexión', Verschiebung: 'una traslación', Drehung: 'un giro' };
    const QTY = { 'Länge': 'longitud', Masse: 'masa', Zeit: 'tiempo', 'Fläche': 'superficie', Volumen: 'volumen' };
    const SCRIPT = { aegypten: 'numeración egipcia', rom: 'numeración romana', maya: 'numeración maya', binaer: 'el sistema binario' };
    const FORM = { Kreis: 'círculo', Streifen: 'tira', Rechteck: 'rectángulo' };
    const pl = (n, one, many) => (+n === 1 ? one : many);
    // a number as the widget writes it, grouped with a narrow no-break space: 4 738 216
    const G = '\\d[\\d\\u202f]*';

    window.BuchES && BuchES.add('gy5', {
        word: {
            // book es mathegy5-es (Einstein)
            // titelbildgy5
            'Titelbild: ein Quader aus Einheitswürfeln, ein Kreis mit drei Achteln, ein Winkel mit Skala, ein gespiegelter Drachen, ein Zahlenstrahl und Maya-Ziffern':
                'Ilustración de la portada: un ortoedro hecho de cubos unidad, un círculo con tres octavos, un ángulo con escala, una cometa reflejada, una recta numérica y cifras mayas',
            // stellenwert5
            'MRD.': 'MIL MILL.', 'MILLIONEN': 'MILLONES', 'TAUSENDER': 'MILLARES', 'EINER': 'UNIDADES',
            'Zufallszahl': 'Número al azar', 'Alles auf 0': 'Todo a 0',
            'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.':
                'Toca ▲ o ▼ para cambiar una cifra. Cada posición vale diez veces más que la posición de su derecha.',
            // zahlenstrahl5
            'Zehner': 'Decenas', 'Hunderter': 'Centenas', 'Tausender': 'Unidades de millar', 'Zehntausender': 'Decenas de millar',
            'Hunderttausender': 'Centenas de millar', 'Millionen': 'Millones', 'Runden auf': 'Redondear a', 'Neue Zahl': 'Número nuevo', 'Mitte': 'Mitad',
            'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.':
                'Arrastra el punto. Si está justo en la mitad o a su derecha, se redondea hacia arriba; si no, hacia abajo.',
            // sieb5
            'Nächster Schritt': 'Siguiente paso', 'Von vorn': 'Empezar de nuevo',
            'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.': 'Toca un número: verás todos sus divisores y su descomposición en factores primos.',
            'Die 1 hat nur sich selbst als Teiler.': 'El 1 solo tiene como divisor a sí mismo.',
            'Zerlegung in Primfaktoren': 'Descomposición en factores primos',
            // bruch5
            'Kreis': 'Círculo', 'Rechteck': 'Rectángulo', 'Streifen': 'Tira', 'Bild': 'Figura', 'Zähler': 'Numerador', 'Nenner': 'Denominador',
            'Erweitern mit 2': 'Amplificar por 2', 'mit 3': 'por 3', 'Kürzen': 'Simplificar', 'weniger': 'menos', 'mehr': 'más',
            // bruchstrahl5
            'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
                'Escribe fracciones como 3/4 o decimales como 0,7, también números mayores que 1, hasta 3.',
            'Zahlenstrahl mit zwei Zahlen': 'Recta numérica con dos números',
            'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Escribe dos números entre 0 y 3, por ejemplo 3/4 o 0,7.',
            // winkel5
            'Messen': 'Medir', 'Schätzen': 'Estimar', 'Modus': 'Modo', 'Deine Schätzung': 'Tu estimación', 'Schätzung in Grad': 'Estimación en grados',
            'Neuer Winkel': 'Ángulo nuevo',
            'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.':
                'Arrastra el extremo del segundo lado. Se mide en sentido contrario a las agujas del reloj, a partir del lado horizontal.',
            'Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.': '¿Cuánto mide este ángulo? Estímalo sin medir y toca «Comprobar».',
            'Bitte eine Zahl eingeben.': 'Escribe un número, por favor.', 'Ausgezeichnet': 'Excelente',
            // winkelpaare5
            'Scheitelwinkel': 'Opuestos por el vértice', 'Nebenwinkel': 'Adyacentes', 'Stufenwinkel': 'Correspondientes', 'Wechselwinkel': 'Alternos',
            'Winkelpaar': 'Par de ángulos', 'Anderes Paar': 'Otro par', 'h kippen': 'Inclinar h',
            'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
                'Arrastra el punto de la recta s para girarla. Con «Inclinar h», g y h dejan de ser paralelas.',
            'Zwei Geraden g und h, geschnitten von s': 'Dos rectas g y h cortadas por s',
            // spiegel5
            'Spiegelung': 'Reflexión', 'Verschiebung': 'Traslación', 'Drehung': 'Giro', 'Rätsel': 'Acertijo', 'Bewegung': 'Movimiento',
            'Achse senkrecht': 'Eje vertical', 'waagerecht': 'horizontal', 'Achse': 'Eje', 'Drehwinkel': 'Ángulo de giro',
            'Neues Rätsel': 'Acertijo nuevo',
            'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.':
                'Arrastra el eje de simetría. Cada punto imagen está en la perpendicular al eje, a la misma distancia de él.',
            'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.': 'Arrastra la punta de la flecha: cada punto se traslada según la misma flecha.',
            'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.':
                'Ajusta el ángulo de giro. Se gira en sentido contrario a las agujas del reloj alrededor del punto Z.',
            'Welche Bewegung bringt die gelbe Figur auf die grüne?': '¿Qué movimiento lleva la figura amarilla sobre la verde?',
            'Figur und Bildfigur im Koordinatensystem': 'Figura y figura imagen en el sistema de coordenadas',
            'Tippe auf deine Antwort.': 'Toca tu respuesta.',
            // rechteck5
            'Zusammengesetzte Figur': 'Figura compuesta', 'Figur': 'Figura', 'Zerlegen': 'Descomponer', 'Ergänzen': 'Completar', 'Weg': 'Método',
            'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.':
                'Arrastra la esquina. Un cuadradito mide 1 cm de largo y 1 cm de ancho, así que su área es 1 cm².',
            // quader5
            'Schrägbild': 'Perspectiva', 'Netz': 'Desarrollo', 'Einheitswürfel': 'Cubos unidad', 'Ansicht': 'Vista',
            'Länge a (cm)': 'Largo a (cm)', 'Breite b (cm)': 'Ancho b (cm)', 'Höhe c (cm)': 'Alto c (cm)',
            'hinten': 'detrás', 'oben': 'arriba', 'vorn': 'delante', 'unten': 'abajo', 'links': 'izquierda', 'rechts': 'derecha',
            // einheiten5
            'Länge': 'Longitud', 'Masse': 'Masa', 'Zeit': 'Tiempo', 'Fläche': 'Superficie', 'Volumen': 'Volumen', 'Größe': 'Magnitud',
            'Wert': 'Valor', 'von Einheit': 'de la unidad', 'in Einheit': 'a la unidad',
            'Bitte eine Zahl eingeben, zum Beispiel 3,5.': 'Escribe un número, por ejemplo 3,5.',
            // zahlschrift5
            'Ägypten': 'Egipto', 'Rom': 'Roma', 'Maya': 'Maya', 'Zweiersystem': 'Sistema binario', 'Zahlschrift': 'Numeración',
            'eins weniger': 'uno menos', 'eins mehr': 'uno más',
            // komma5
            'Neu': 'Nuevo',
            'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
                'Al multiplicar por 10, cada cifra se desplaza una posición a la izquierda; al dividir, a la derecha. En pocas palabras: la coma se desplaza.',
            'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'no es posible: las cifras se saldrían de la tabla.',
            // mittel5
            'Ausgleichen': 'Igualar', 'Neue Werte': 'Valores nuevos', 'Mittelwert': 'Media', 'Säulen mit dem Mittelwert': 'Barras con la media',
            'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
                'Arrastra las barras hacia arriba o hacia abajo. «Igualar» lo reparte todo con justicia: cada barra recibe lo mismo.',
            // koord5
            'Geraden ein/aus': 'Rectas sí/no', 'Finde den Punkt': 'Encuentra el punto', 'Koordinatensystem mit vier Punkten': 'Sistema de coordenadas con cuatro puntos',
            'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).':
                'Arrastra los puntos. Se ajustan a los puntos de la cuadrícula. Primero hacia la derecha (x), después hacia arriba (y).',
            // symmetrie5
            'Achse waagerecht': 'Eje horizontal', 'zwei Achsen': 'dos ejes', 'Punkt': 'Punto', 'Symmetrie': 'Simetría',
            'Leeren': 'Vaciar', 'Muster-Werkstatt': 'Taller de patrones',
            'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.':
                'Toca cuadraditos para colorearlos. Los cuadraditos reflejados se colorean solos.',
            // linien5
            'erste Zahl': 'primer número', 'zweite Zahl': 'segundo número',
            'Legen': 'Colocar', 'Dazulegen': 'Añadir', 'Bündeln': 'Agrupar', 'Alles bündeln': 'Agrupar todo',
            'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.':
                'Cinco fichas en una línea se convierten en una ficha en el espacio de encima; dos fichas en un espacio, en una ficha en la línea siguiente. Así se calculaba hace 500 años.',
            'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.': 'Todo agrupado. Ahora se puede leer el resultado.',
            'Rot markiert: Hier muss noch gebündelt werden.': 'Marcado en rojo: aquí todavía hay que agrupar.',
            'Linienbrett mit Rechenpfennigen': 'Tablero de líneas con fichas de cálculo',

        },
        phrase: [
            // book es mathegy5-es (Einstein)
            // stellenwert5
            ['Als Zehnerbruch: ', 'Como fracción decimal: '], ['Eine natürliche Zahl, keine Stelle nach dem Komma.', 'Un número natural, sin cifras después de la coma.'],
            // zahlenstrahl5
            ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'Con 5, 6, 7, 8 o 9 se <b>redondea hacia arriba</b>.'],
            ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'Con 0, 1, 2, 3 o 4 se <b>redondea hacia abajo</b>.'],
            // sieb5
            ['Starte das Sieb mit „Nächster Schritt“.', 'Pon en marcha la criba con «Siguiente paso».'],
            ['Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.', 'El 1 <b>no es un número primo</b>: solo tiene un divisor.'],
            ['Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.', 'El 2 es el primer número primo. Todos sus múltiplos 4, 6, 8, … están tachados.'],
            ['Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.', 'El 3 es el siguiente número primo. Sus múltiplos 6, 9, 12, … están tachados.'],
            ['Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …', 'El 5 es el siguiente número primo. Tachados: 10, 15, 20, …'],
            ['Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.', 'El 7 es el siguiente número primo. Nuevos tachados: 49, 77, 91 y los otros múltiplos.'],
            ['Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.',
                '¡Listo! El siguiente número sería el 11, pero 11 · 11 = 121 ya pasa de 100. Todos los números que quedan son <b>números primos</b>: son 25.'],
            // bruch5
            ['Null Teile: der Bruch hat den Wert 0.', 'Ninguna parte: la fracción vale 0.'],
            ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Una <b>fracción propia</b>: menos que un entero.'],
            ['Genau <b>ein Ganzes</b>.', 'Exactamente <b>un entero</b>.'],
            ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Una <b>fracción impropia</b>: más que un entero'],
            [', als gemischte Zahl $', ', como número mixto $'],
            ['Der Bruch lässt sich nicht weiter kürzen.', 'La fracción no se puede simplificar más.'],
            ['Als Dezimalzahl: ', 'Como número decimal: '], [' · in Prozent: ', ' · en porcentaje: '],
            ['Als Dezimalzahl ungefähr ', 'Como número decimal, aproximadamente '],
            ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.',
                '. El denominador tiene un factor primo distinto de 2 y de 5; por eso el número decimal no se acaba.'],
            // bruchstrahl5
            ['$ und $', '$ y $'],
            ['Jetzt vergleicht man nur die Zähler: ', 'Ahora solo se comparan los numeradores: '],
            ['Als Dezimalzahlen: ', 'Como números decimales: '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Más a la derecha en la recta numérica significa mayor.'],
            // winkel5
            ['Deine Schätzung: ', 'Tu estimación: '],
            // winkelpaare5
            ['Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
                'Los ángulos opuestos por el vértice están enfrentados en el mismo punto de intersección. <b>Siempre son iguales</b>.'],
            ['Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
                'Los ángulos adyacentes están uno junto a otro en el mismo punto de intersección y juntos forman un ángulo llano: <b>siempre suman 180°</b>.'],
            ['Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ',
                'Los ángulos correspondientes están en puntos de intersección distintos, al mismo lado de s y al mismo lado de las rectas. '],
            ['Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ',
                'Los ángulos alternos están en puntos de intersección distintos, a distinto lado de s y entre las rectas. '],
            ['An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.', 'Si las rectas son <b>paralelas</b>, son <b>iguales</b>.'],
            ['Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.', 'Como g y h <b>no son paralelas</b>, no son iguales.'],
            // spiegel5
            ['Spiegelachse ', 'Eje de simetría '], ['schräg durch ', 'oblicuo por '],
            ['Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.',
                'La figura imagen tiene el mismo tamaño, pero está <b>dada la vuelta</b>: el sentido de recorrido A → B → C → D se invierte.'],
            ['Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.', 'Cada punto sigue a la misma distancia de Z. La figura no se da la vuelta.'],
            ['Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.',
                'Pista: si la figura está dada la vuelta, es una reflexión. Si todos los lados apuntan en la misma dirección que antes, es una traslación.'],
            // rechteck5
            ['Ein Quadrat: alle vier Seiten gleich lang.', 'Un cuadrado: los cuatro lados miden lo mismo.'],
            ['Zerlegen in zwei Rechtecke:', 'Descomponer en dos rectángulos:'],
            ['Zum großen Rechteck ergänzen und das fehlende Stück abziehen:', 'Completar hasta el rectángulo grande y restar el trozo que falta:'],
            ['Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.',
                'Sorprendente: el perímetro es igual que el del rectángulo entero, porque el escalón mide lo mismo que los lados que faltan.'],
            // quader5
            ['Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.', 'Las caras opuestas tienen el mismo color: son iguales.'],
            ['Alle 12 Kanten zusammen: ', 'Las 12 aristas juntas: '], ['Alle Kanten gleich lang: ein Würfel.', 'Todas las aristas miden lo mismo: un cubo.'],
            // einheiten5
            ['Rechnung: ', 'Cálculo: '],
            ['Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.', 'Escalera abajo, hacia la unidad menor: el número aumenta, se <b>multiplica</b>.'],
            ['Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.', 'Escalera arriba, hacia la unidad mayor: el número disminuye, se <b>divide</b>.'],
            ['Gleiche Einheit, nichts zu tun.', 'Misma unidad: no hay nada que hacer.'],
            ['Bei Flächen ist die Umrechnungszahl immer 100.', 'En las superficies, el factor de conversión es siempre 100.'],
            ['Bei Volumen ist die Umrechnungszahl immer 1000.', 'En los volúmenes, el factor de conversión es siempre 1000.'],
            ['Achtung: Bei der Zeit gibt es keine Zehnerschritte.', 'Atención: en el tiempo no hay pasos de diez.'],
            // zahlschrift5
            ['Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.',
                'Cada signo se escribe tantas veces como haga falta. El orden da igual y no se necesita el cero. Trazo 1, asa 10, cuerda 100, flor de loto 1000.'],
            ['I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.',
                'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Si un signo menor va delante de uno mayor, se resta: IV = 4, XC = 90, CM = 900.'],
            ['Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.',
                'Los mayas contaban de veinte en veinte. Punto = 1, raya = 5. De abajo arriba, cada nivel vale veinte veces más. Para un nivel vacío tenían un signo para el cero: la concha.'],
            ['Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.',
                'En el sistema binario solo existen las cifras 0 y 1. Cada posición vale el doble que la de su derecha. Así calculan los ordenadores.'],
            // mittel5
            ['Mittelwert', 'Media'], ['Summe: ', 'Suma: '], ['Geteilt durch die Anzahl: ', 'Dividido entre el número de valores: '],
            ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'Lo que estaba por encima de la línea (gris discontinuo) llena exactamente los huecos (amarillo).'],
            // koord5
            ['g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.', 'g ∥ h: las rectas son <b>paralelas</b>, nunca se cortan.'],
            ['g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.', 'g ⊥ h: las rectas son <b>perpendiculares</b>.'],
            ['g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.', 'g y h no son ni paralelas ni perpendiculares. Intenta ponerlas paralelas o perpendiculares.'],

        ],
        rule: [
            // book es mathegy5-es (Einstein)
            // plain-text points: A(2 | 1) → A(2, 1), A(1,5 | 2) → A(1,5; 2)
            [/\((-?\d+(?:,\d+)?) \| (-?\d+(?:,\d+)?)\)/g, (m, a, b) => '(' + a + (/,/.test(a + b) ? '; ' : ', ') + b + ')'],
            // place value tables: Spanish column heads
            [/<table class="g5-sw[\s\S]*?<\/table>/g, t => t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E|z|h|t)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' + PLACE[k] + '</th>')],
            // stellenwert5: the number in words, read from the number above it
            [new RegExp('(<p class="g5-big">)(' + G + ')(</p><p class="g5-word">)[^<]*'), (m, a, n, b) => a + n + b + words(num(n))],
            [new RegExp('(<p class="g5-big">)(' + G + '(?:,\\d+)?)(</p>[\\s\\S]*?<p class="g5-dim">)Gesprochen: [^<]*'), (m, a, n, b) => {
                const [i, f] = n.split(',');
                return a + n + b + 'Se lee: ' + words(num(i)) + (f ? ' coma ' + [...f].map(d => DIGIT[+d]).join(' ') : '');
            }],
            [/Das sind (\d+) Stellen\./, (m, n) => 'El número tiene ' + n + ' ' + pl(n, 'cifra', 'cifras') + '.'],
            // zahlenstrahl5
            [/Gerundet auf (Zehner|Hunderter|Tausender|Zehntausender|Hunderttausender|Millionen)\. Entscheidend ist die Ziffer rechts davon: /,
                (m, p) => 'Redondeado a ' + ROUND[p] + '. Lo que decide es la cifra de su derecha: '],
            [/^Zahlenstrahl mit der Zahl (.+) zwischen (.+) und (.+)$/, 'Recta numérica con el número $1 entre $2 y $3'],
            // sieb5
            [/<b>Teiler von (\d+):<\/b> (.*?) \((\d+) Stück\)/, (m, n, l, k) => '<b>Divisores de ' + n + ':</b> ' + l + ' (' + k + ' ' + pl(k, 'divisor', 'divisores') + ')'],
            [/(\d+) ist eine Primzahl<\/span>: genau zwei Teiler, 1 und (\d+)\./, '$1 es un número primo</span>: exactamente dos divisores, 1 y $2.'],
            // bruch5
            [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'La fracción ' + z + '/' + n + ' como ' + FORM[f]],
            [/, genau (\d+) Ganze\./, ', exactamente $1 enteros.'],
            [/Kürzen mit (\d+) ergibt /, 'Al simplificar por $1 se obtiene '],
            // bruchstrahl5
            [/^Zahl ([A-Z])$/, 'Número $1'],
            [/Auf denselben Nenner (\d+) gebracht: /, 'Con el denominador común $1: '],
            // winkel5
            [new RegExp('<p>Ein <b>(' + KINDS + ')</b>'), (m, k) => '<p>Un <b>' + KIND[k] + '</b>'],
            [new RegExp('Es ist ein (' + KINDS + ')\\.'), (m, k) => 'Es un ' + KIND[k] + '.'],
            [/Tipp zum Messen: Miss den Rest bis zum Vollwinkel, (\d+)°, und rechne 360° − (\d+)°\./,
                'Pista para medir: mide lo que falta hasta el ángulo completo, $1°, y calcula 360° − $2°.'],
            [/, nur (\d+)° daneben!/, ': ¡solo $1° de diferencia!'], [/Gut, (\d+)° daneben\./, 'Bien, $1° de diferencia.'],
            [/(\d+)° daneben\. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen\?/, '$1° de diferencia. Compara con 90° y 180°: ¿dónde está el ángulo respecto a ellos?'],
            [/^Winkel von (\d+) Grad$/, 'Ángulo de $1 grados'],
            // the vertex S (Scheitel) is V (vértice)
            [/(<text class="g-pt"[^>]*>)S(<\/text>)/, '$1V$2'],
            // winkelpaare5
            [/g und h sind (nicht )?parallel\./, (m, n) => 'g y h ' + (n ? 'no son' : 'son') + ' paralelas.'],
            // spiegel5
            [/Jeder Punkt wandert (\d+) nach (links|rechts) und (\d+) nach (unten|oben)\./,
                (m, a, lr, b, du) => 'Cada punto se mueve ' + a + ' hacia la ' + (lr === 'links' ? 'izquierda' : 'derecha') + ' y ' + b + ' hacia ' + (du === 'oben' ? 'arriba' : 'abajo') + '.'],
            [/Drehung um Z(\([^)]*\)) um (\d+)°\./, 'Giro de $2° alrededor de Z$1.'],
            [/(data-v="schraeg">)schräg</, '$1oblicuo<'],
            [/(Richtig, es ist|Nicht ganz\. Es ist) eine (Spiegelung|Verschiebung|Drehung)\./,
                (m, p, k) => (p[0] === 'R' ? 'Correcto, es ' : 'No exactamente. Es ') + MOVE[k] + '.'],
            // rechteck5
            [/^Rechteck aus (\d+) Einheitsquadraten$/, 'Rectángulo formado por $1 cuadrados unidad'],
            [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, (m, r, k) => pl(r, 'Es 1 fila', 'Son ' + r + ' filas') + ' de ' + k + ' ' + pl(k, 'cuadradito', 'cuadraditos') + '.'],
            [/<p>Zusammen (\d+) cm²/, '<p>En total $1 cm²'],
            // quader5
            [/^Quader (\d+) mal (\d+) mal (\d+)$/, 'Ortoedro de $1 por $2 por $3'],
            [/(\d+) Schicht(en)? mit je (.+?) Würfeln\./, (m, c, en, x) => c + ' ' + pl(c, 'capa', 'capas') + ' de ' + x + ' cubos cada una.'],
            // einheiten5
            [/^Einheitentreppe (Länge|Masse|Zeit|Fläche|Volumen)$/, (m, k) => 'Escalera de unidades de ' + QTY[k]],
            // zahlschrift5 ("Zahl" alone is a coin side elsewhere)
            [/^Die Zahl (\d+) in (aegypten|rom|maya|binaer)$/, (m, v, k) => 'El número ' + v + ' en ' + SCRIPT[k]],
            [/(<label for="[^"]*">)Zahl(<\/label>)/, '$1Número$2'], [/^Zahl$/, 'Número'],
            // symmetrie5
            [/^Farbe (\d)$/, 'Color $1'],
            // koord5
            [/<\/span> geht durch A und B, (<span[^>]*>h<\/span>) durch C und D\./, '</span> pasa por A y B; $1, por C y D.'],
            [/Getroffen! A liegt auf /, '¡Acertaste! A está en '], [/<b>Aufgabe:<\/b> Zieh A auf den Punkt /, '<b>Tarea:</b> arrastra A hasta el punto '],
            // linien5
            [/(<span class="b-ctrl">)Zahl (?=<input)/, '$1Número '],
            [new RegExp('Fünf Pfennige auf der Linie (' + G + ') werden zu einem im Feld (' + G + ')\\.'), 'Cinco fichas en la línea $1 se convierten en una en el espacio $2.'],
            [new RegExp('Zwei Pfennige im Feld (' + G + ') werden zu einem auf der Linie (' + G + ')\\.'), 'Dos fichas en el espacio $1 se convierten en una en la línea $2.'],
            [new RegExp('(' + G + ') ist gelegt\\.'), '$1 está colocado.'],
            [new RegExp('(' + G + ') dazugelegt\\. Jetzt muss gebündelt werden\\.'), 'Se ha añadido $1. Ahora hay que agrupar.'],

        ]
    });
})();
