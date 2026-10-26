/* js/buch-es/os5.js — Spanish for the widgets of js/buch-os5.js.
 * Loaded by the Spanish editions right after js/buch-os5.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Only the pages of mathe5-es load this file, so its rules may also localise what the widgets of js/buch-gy5.js write on
 * them (Doc, 26.10.2026: school conventions of Spain): lines r and s instead of g and h (koord5), the perimeter P instead
 * of u (rechteck5) and the total area A_T instead of O (quader5).
 */
(function () {
    // a number as the widgets write it, grouped with a narrow no-break space: 4 738 216
    const G = '\\d[\\d\\u202f]*';
    const pl = (n, one, many) => (+n === 1 ? one : many);
    // the places of the written calculations: heading of a step, and the bundles of "Entbündeln" (singular → plural)
    const PLACE = { Tausendstel: 'Milésimas', Hundertstel: 'Centésimas', Zehntel: 'Décimas', Einer: 'Unidades', Zehner: 'Decenas',
        Hunderter: 'Centenas', Tausender: 'Unidades de millar', Zehntausender: 'Decenas de millar', Hunderttausender: 'Centenas de millar',
        Millionen: 'Unidades de millón', Zehnmillionen: 'Decenas de millón', Hundertmillionen: 'Centenas de millón', Milliarden: 'Unidades de millar de millón' };
    const PLACES = Object.keys(PLACE).sort((a, b) => b.length - a.length).join('|');
    const ONE = { Zehntel: 'décima', Hundertstel: 'centésima', Einer: 'unidad', Zehner: 'decena', Hunderter: 'centena', Tausender: 'unidad de millar',
        Zehntausender: 'decena de millar', Hunderttausender: 'centena de millar', Million: 'unidad de millón', Zehnmillion: 'decena de millón',
        Hundertmillion: 'centena de millón', Milliarden: 'unidad de millar de millón' };
    const ONES = Object.keys(ONE).sort((a, b) => b.length - a.length).join('|');
    const low = s => s.charAt(0).toLowerCase() + s.slice(1);
    // the powers of ten in words (zehnerpotenzos5)
    const TEN = { 'eins': 'uno', 'zehn': 'diez', 'hundert': 'cien', 'tausend': 'mil', 'zehntausend': 'diez mil', 'hunderttausend': 'cien mil',
        'eine Million': 'un millón', 'zehn Millionen': 'diez millones', 'hundert Millionen': 'cien millones', 'eine Milliarde': 'mil millones',
        'zehn Milliarden': 'diez mil millones', 'hundert Milliarden': 'cien mil millones', 'eine Billion': 'un billón' };
    // the names of the pieces of a fraction (halbesos5): German plural → Spanish plural / singular
    const NTH = { Ganze: ['enteros', 'entero'], Halbe: ['medios', 'medio'], Drittel: ['tercios', 'tercio'], Viertel: ['cuartos', 'cuarto'],
        'Fünftel': ['quintos', 'quinto'], Sechstel: ['sextos', 'sexto'], Siebtel: ['séptimos', 'séptimo'], Achtel: ['octavos', 'octavo'],
        Neuntel: ['novenos', 'noveno'], Zehntel: ['décimos', 'décimo'], Elftel: ['onceavos', 'onceavo'], 'Zwölftel': ['doceavos', 'doceavo'] };
    const NTHS = Object.keys(NTH).sort((a, b) => b.length - a.length).join('|');
    const piece = (n, k) => NTH[k][+n === 1 ? 1 : 0];
    // rounding places (rundenos5)
    const RND = { Ganze: 'las unidades', Zehntel: 'las décimas', Hundertstel: 'las centésimas', Tausendstel: 'las milésimas' };
    const MOTIF = { Fahne: 'la bandera', 'Schlüssel': 'la llave', Blume: 'la flor' };
    const LESS = { 'weniger als': 'menos de', 'mehr als': 'más de', genau: 'exactamente' };
    // the rule labels of vorrangos5
    // the digits after the comma as pupils in Spain read them (stellenwert5 of js/buch-gy5.js reads them one by one):
    // 3,047 → «tres coma cero cuarenta y siete», 3,5 → «tres coma cinco»
    const W1 = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce',
        'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
        'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const W10 = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const W100 = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const u100 = n => n < 30 ? W1[n] : W10[Math.floor(n / 10)] + (n % 10 ? ' y ' + W1[n % 10] : '');
    const u1000 = n => n === 100 ? 'cien' : [W100[Math.floor(n / 100)], n % 100 ? u100(n % 100) : ''].filter(Boolean).join(' ');
    const decimals = f => { const z = f.match(/^0*/)[0].length, r = f.slice(z); return Array(z).fill('cero').concat(r ? [u1000(+r)] : []).join(' '); };
    const VR = [['Klammer zuerst', 'primero el paréntesis'], [', darin ', '; dentro, '], ['Punkt vor Strich', '· y : antes que + y −'],
        ['von links nach rechts', 'de izquierda a derecha'], ['die letzte Rechnung', 'la última operación'], ['Ergebnis', 'resultado']];

    window.BuchES && BuchES.add('os5', {
        word: {
            // book es mathe5-es (Wonenburger)
            // titelbildos5
            'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
                'Portada: un cubo en perspectiva caballera y su desarrollo, un círculo con dos tercios de colores, una mariposa reflejada, números babilonios en escritura cuneiforme y una recta numérica',
            // zahlenstrahlos5
            'Erkunden': 'Explorar', 'Ablesen': 'Leer', 'Einteilung': 'Escala', 'Neue Aufgabe': 'Nuevo ejercicio',
            'Welche Zahl ist markiert?': '¿Qué número está marcado?',
            'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?':
                'Cuenta las rayas a partir del número de la izquierda. ¿Cuánto mide un paso de raya a raya?',
            'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.':
                'Arrastra el punto por la recta numérica. Cuanto más a la derecha, mayor es el número.',
            // schriftlichos5
            'Addieren': 'Sumar', 'Subtrahieren': 'Restar', 'Multiplizieren': 'Multiplicar', 'Dividieren': 'Dividir', 'Rechenart': 'Operación',
            'Entbündeln': 'Desagrupar', 'Verfahren': 'Método', 'Alles zeigen': 'Mostrarlo todo',
            'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.':
                'El segundo número es mayor que el primero. Con números naturales esta resta no se puede hacer.',
            'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.':
                'Aquí el segundo factor tiene que ser un número natural. Cambia el orden de los factores si hace falta.',
            'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.': 'Como mucho siete cifras en el primer factor y tres en el segundo, por favor.',
            'Hier teilst du durch eine einstellige Zahl von 1 bis 9.': 'Aquí divides entre un número de una cifra, del 1 al 9.',
            'Bitte höchstens acht Ziffern.': 'Como mucho ocho cifras, por favor.',
            'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.': 'Escribe dos números, por ejemplo 4738 y 1296.',
            'Bitte höchstens drei Stellen nach dem Komma.': 'Como mucho tres cifras después de la coma, por favor.',
            'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.': 'Números de nueve cifras como mucho antes de la coma, por favor.',
            // vorrangos5
            'Eigener Term': 'Expresión propia', 'Alle Schritte': 'Todos los pasos',
            'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.':
                'Se permiten números naturales, + − · : y paréntesis. Para · también puedes escribir *, y para :, también /.',
            'Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.': 'La expresión no está completa. Revisa los números, los signos y los paréntesis.',
            'Unterstrichen ist, was als Nächstes gerechnet wird.': 'Lo subrayado es lo que se calcula a continuación.',
            'Durch 0 kann man nicht teilen.': 'No se puede dividir entre 0.',
            // zehnerpotenzos5
            'Zehnerpotenzen': 'Potencias de diez', 'Nullen abtrennen': 'Separar ceros', 'Hochzahl': 'Exponente',
            'Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel 4 700 000.': 'Escribe un número natural de 15 cifras como mucho, por ejemplo 4 700 000.',
            'Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.': 'El número no tiene ningún cero final. Aquí no se puede separar ninguna potencia de diez.',
            'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.': 'Delante del punto de multiplicar ya no queda ningún cero final: es la forma más corta.',
            'So zeigt ein Taschenrechner mit 10 Stellen die Zahl:': 'Así muestra el número una calculadora de 10 posiciones:',
            'Anzeige des Taschenrechners': 'Pantalla de la calculadora', 'Die Zahl passt in die Anzeige.': 'El número cabe en la pantalla.',
            // quadratos5
            'Quadrieren': 'Elevar al cuadrado', 'Wurzel ziehen': 'Sacar la raíz', 'Richtung': 'Sentido', 'Seitenlänge n': 'Longitud del lado n',
            'Anzahl Plättchen': 'Número de fichas', 'Bitte eine Zahl von 1 bis 440 eingeben.': 'Escribe un número del 1 al 440, por favor.',
            // probierenos5
            'Aufgabe': 'Ejercicio', 'Einsetzen': 'Sustituir', 'Alle Zahlen prüfen': 'Comprobar todos los números',
            'Zahlenstrahl mit den eingesetzten Zahlen': 'Recta numérica con los números sustituidos',
            'stimmt!': '¡es correcto!', 'Nimm eine größere Zahl.': 'Toma un número mayor.', 'Nimm eine kleinere Zahl.': 'Toma un número menor.',
            'erfüllt die Ungleichung.': 'cumple la inecuación.', 'erfüllt sie nicht.': 'no la cumple.',
            // teilbarkeitos5
            'Bitte eine natürliche Zahl von 1 bis 999 999 999 eingeben.': 'Escribe un número natural del 1 al 999 999 999, por favor.',
            'Die 1 hat nur einen Teiler. Sie ist keine Primzahl.': 'El 1 solo tiene un divisor. No es un número primo.',
            // bruchteilos5
            'Ganzes': 'Todo',
            'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.':
                'El todo solo se puede dividir en grupos iguales si es un múltiplo del denominador. Por eso va a saltos.',
            'Alle Gruppen: Das ist das Ganze.': 'Todos los grupos: es el todo.', 'Genau die Hälfte.': 'Exactamente la mitad.',
            // halbesos5
            'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes': 'Dos tiras de fracciones una debajo de otra, con la marca de un medio',
            // rundenos5
            'auf Ganze': 'a las unidades', 'auf Zehntel': 'a las décimas', 'auf Hundertstel': 'a las centésimas', 'Runden': 'Redondear',
            'Der Zahlenstrahl zeigt nur den Ausschnitt zwischen den beiden möglichen Ergebnissen, wie unter einer Lupe. Zieh den Punkt.':
                'La recta numérica muestra solo el tramo entre los dos resultados posibles, como con una lupa. Arrastra el punto.',
            // wuerfelnetzos5
            'Zufälliges Netz': 'Desarrollo al azar', 'Alles löschen': 'Borrarlo todo',
            'Tippe Quadrate an, um sie hinzuzufügen oder wegzunehmen. Sechs zusammenhängende Quadrate werden sofort geprüft.':
                'Toca cuadrados para añadirlos o quitarlos. Seis cuadrados unidos se comprueban enseguida.',
            'Ein Würfel hat 6 Flächen, also besteht jedes Würfelnetz aus 6 Quadraten.': 'Un cubo tiene 6 caras, así que todo desarrollo del cubo está formado por 6 cuadrados.',
            'Die Quadrate hängen nicht alle zusammen.': 'No todos los cuadrados están unidos.',
            'Jedes Quadrat muss mit einer ganzen Kante an ein anderes stoßen.': 'Cada cuadrado tiene que tocar a otro por una arista entera.',
            'Beim Falten würden die rot markierten Quadrate aufeinanderliegen, und eine Fläche des Würfels bliebe offen.':
                'Al plegar, los cuadrados marcados en rojo quedarían uno encima de otro y una cara del cubo quedaría abierta.',
            'Die Zahlen zeigen, wie ein Spielwürfel beschriftet wäre: Gegenüberliegende Flächen haben dieselbe Farbe und ergeben zusammen 7.':
                'Los números muestran cómo estaría numerado un dado: las caras opuestas tienen el mismo color y suman 7.',
            // bandos5
            'Fahne': 'Bandera', 'Schlüssel': 'Llave', 'Blume': 'Flor', 'Motiv': 'Motivo', 'Verschieben': 'Trasladar',
            'Spiegeln, senkrechte Achsen': 'Reflejar, ejes verticales', 'Spiegeln, waagerechte Achse': 'Reflejar, eje horizontal',
            'Verschiebungspfeil': 'Flecha de traslación',
            'Alle Motive sind deckungsgleich: gleiche Form, gleiche Größe.': 'Todos los motivos son congruentes: misma forma, mismo tamaño.',
            // zahlzeichenos5
            'Kerbholz und Strichliste': 'Palo de tarja y tabla de recuento', 'Babylonische Keilschrift': 'Escritura cuneiforme babilónica',
            'Zahlzeichen': 'Signos numéricos', 'Auf 0': 'A 0',
            'Auf dem Kerbholz ist jede fünfte Kerbe länger. So muss man nicht jede einzelne Kerbe zählen, sondern nur die Bündel.':
                'En el palo de tarja, cada quinta muesca es más larga. Así no hay que contar cada muesca, sino solo los grupos.',
        },
        phrase: [
            // book es mathe5-es (Wonenburger)
            // the check row of the helpers (askRow): "✓ richtig" is shared, "noch nicht" is not
            ['noch nicht', 'todavía no'],
            // zahlenstrahlos5
            ['Richtig: ', 'Correcto: '],
            // schriftlichos5: the first step, the carries, estimate and check
            ['Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer', 'Escribe los números uno debajo de otro, cada cifra en su posición: unidades bajo unidades'],
            [', Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf', ', coma bajo coma. Las posiciones que faltan después de la coma las rellenas con ceros'],
            ['. Gerechnet wird von rechts nach links.', '. Se calcula de derecha a izquierda.'],
            ['Schreibe die Zahlen stellengerecht untereinander', 'Escribe los números uno debajo de otro, cada cifra en su posición'],
            [', Komma unter Komma', ', coma bajo coma'], ['. Gerechnet wird von rechts nach links', '. Se calcula de derecha a izquierda'],
            [', beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.', '; al desagrupar cambias 1 de la posición siguiente por 10.'],
            [', beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?', '; al completar te preguntas: ¿cuánto falta del número de abajo al de arriba?'],
            [' (Übertrag)', ' (llevada)'], [' (gemerkt)', ' (llevada)'], ['. Schreibe ', '. Escribe '], [' und übertrage ', ' y llévate '],
            [' in die nächste Spalte.', ' a la columna siguiente.'], [', merke ', ' y llévate '],
            [' Übertrag 1 in die nächste Spalte.', ' Te llevas 1 a la columna siguiente.'],
            ['Der letzte Übertrag ', 'La última llevada, '], [' kommt vorn ins Ergebnis.', ', va delante en el resultado.'],
            [' Eine Null ganz vorn schreibt man nicht.', ' Delante del todo no se escribe un cero.'],
            ['Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal',
                'Escribe la operación en una línea. Multiplicas el primer factor por cada cifra del segundo factor, una tras otra'],
            [', zuerst ohne auf das Komma zu achten.', ', primero sin fijarte en la coma.'],
            ['. Das ist die letzte Ziffer: Schreibe ', '. Es la última cifra: escribe '], [' ganz hin.', ' entero.'],
            ['Addiere die Teilprodukte stellengerecht, so wie sie stehen. Das ergibt ', 'Suma los productos parciales, cada cifra en su posición, tal como están. Resultado: '],
            [' Hinten hängst du Nullen an, das ändert den Wert nicht.', ' Detrás añades ceros; eso no cambia el valor.'],
            [', denn ', ', porque '], ['Es bleibt nichts übrig.', 'No sobra nada.'],
            [' Hier kommt das Komma: Setze es auch im Ergebnis.', ' Aquí va la coma: ponla también en el resultado.'],
            ['Überschlag: ', 'Estimación: '], ['. Probe: ', '. Prueba: '],
            // vorrangos5
            [' geht in den natürlichen Zahlen nicht.', ' no se puede calcular con números naturales.'],
            [' geht nicht ohne Rest auf. Wähle andere Zahlen.', ' no es exacta: tiene resto. Elige otros números.'],
            // zehnerpotenzos5
            ['Alle Schreibweisen: ', 'Todas las formas de escribirlo: '], ['Die Zahl ist zu lang. Der Rechner zeigt ', 'El número es demasiado largo. La calculadora muestra '],
            // quadratos5, probierenos5
            ['Umgekehrt: ', 'Al revés: '], ['ist zu klein', 'es demasiado pequeño'], ['ist zu groß', 'es demasiado grande'],
            ['Einsetzen: ', 'Sustituyendo: '], ['Lösung: $', 'Solución: $'], ['. Mit der Umkehraufgabe geht es direkt: ', '. Con la operación inversa sale directamente: '],
            ['Alle Lösungen: ', 'Todas las soluciones: '], [', … und jede größere Zahl.', ', … y cualquier número mayor.'],
            ['Bisher gefundene Lösungen: ', 'Soluciones encontradas hasta ahora: '], ['Noch keine Lösung gefunden.', 'Todavía no has encontrado ninguna solución.'],
            [' Eine Ungleichung hat oft viele Lösungen.', ' Una inecuación tiene a menudo muchas soluciones.'],
            // teilbarkeitos5
            ['Durch 2 und durch 3 teilbar.', 'divisible entre 2 y entre 3.'], ['Durch 2, aber nicht durch 3 teilbar.', 'divisible entre 2, pero no entre 3.'],
            ['Durch 3, aber nicht durch 2 teilbar.', 'divisible entre 3, pero no entre 2.'], ['Weder durch 2 noch durch 3 teilbar.', 'no es divisible ni entre 2 ni entre 3.'],
            ['<b>Alle Teiler</b> (', '<b>Todos los divisores</b> ('], [' ist eine Primzahl: genau zwei Teiler.', ' es un número primo: exactamente dos divisores.'],
            [' ist keine Primzahl.', ' no es un número primo.'],
            // halbesos5
            ['Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.', 'Las longitudes coloreadas son exactamente iguales: dos nombres para el mismo número.'],
            ['<b>Vergleich mit 1:</b> ', '<b>Comparar con 1:</b> '], ['<b>Vergleich mit einem Halben:</b> ', '<b>Comparar con un medio:</b> '],
            ['Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.',
                'Aquí ayuda la figura: la tira coloreada más larga corresponde a la fracción mayor. Podrás comprobarlo con exactitud en 6.º curso, cuando amplíes fracciones.'],
            // wuerfelnetzos5
            ['Kein Würfelnetz.', 'No es un desarrollo del cubo.'], ['Ein Würfelnetz!', '¡Un desarrollo del cubo!'],
            // bandos5
            ['<b>Verschiebung:</b> Jedes Motiv entsteht aus dem vorigen durch dieselbe Verschiebung nach rechts, um eine Kästchenbreite. Alle Motive zeigen in dieselbe Richtung.',
                '<b>Traslación:</b> cada motivo sale del anterior con la misma traslación hacia la derecha, de una casilla de ancho. Todos los motivos apuntan en la misma dirección.'],
            ['<b>Spiegelung an senkrechten Achsen:</b> Jedes Motiv ist das Spiegelbild seines Nachbarn. Die grünen Linien sind die Spiegelachsen. Jedes zweite Motiv ist umgeklappt.',
                '<b>Reflexión respecto a ejes verticales:</b> cada motivo es la imagen reflejada de su vecino. Las líneas verdes son los ejes de simetría. Uno de cada dos motivos está dado la vuelta.'],
            ['<b>Spiegelung an einer waagerechten Achse:</b> Die untere Reihe ist das Spiegelbild der oberen. Oben und unten ist vertauscht, links und rechts nicht.',
                '<b>Reflexión respecto a un eje horizontal:</b> la fila de abajo es la imagen reflejada de la de arriba. Arriba y abajo se intercambian; izquierda y derecha, no.'],
            // zahlzeichenos5
            ['Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert.',
                'Una cuña vertical cuenta 1; una espiga, 10. Cada posición hacia la izquierda vale 60 veces más.'],
            [' Eine leere Stelle hatte lange kein eigenes Zeichen: Man sah nur eine Lücke.', ' Durante mucho tiempo, una posición vacía no tuvo signo propio: solo se veía un hueco.'],
        ],
        rule: [
            // book es mathe5-es (Wonenburger)
            // zahlenstrahlos5: the scale buttons "Schritt 1 000" and the sentences with numbers
            [/(>)Schritt (\d[\d  ]*)(<\/button>)/g, '$1Paso $2$3'],
            [/^Zahlenstrahl von (.+) bis (.+)$/, 'Recta numérica de $1 a $2'],
            [new RegExp('Von (' + G + ') bis (' + G + ') sind es 10 Schritte, einer ist (' + G + ') groß\\.'), 'De $1 a $2 hay 10 pasos; cada uno mide $3.'],
            [new RegExp('Links steht (' + G + '), rechts (' + G + ')\\. Dazwischen liegen 10 gleich große Schritte\\.'), 'A la izquierda está $1; a la derecha, $2. Entre ellos hay 10 pasos iguales.'],
            [new RegExp('Ein Schritt von Strich zu Strich ist <b>(' + G + ')</b>\\. Der Punkt liegt (\\d+) Schritte rechts von (' + G + ')\\.'),
                (m, s, k, a) => 'Un paso de raya a raya mide <b>' + s + '</b>. El punto está ' + k + ' ' + pl(k, 'paso', 'pasos') + ' a la derecha de ' + a + '.'],
            [new RegExp('Vorgänger (' + G + '|–), Nachfolger (' + G + ')\\.'), 'Anterior: $1; siguiente: $2.'],
            [new RegExp('Die Zahl liegt zwischen (' + G + ') und (' + G + ')\\.'), 'El número está entre $1 y $2.'],
            // schriftlichos5: "Schritt 2 von 5", the place of a step, the bundles, the subtraction by completing
            [/(<p class="g5-dim">)Schritt (\d+) von (\d+)(<\/p>)/, '$1Paso $2 de $3$4'],
            [new RegExp('<b>(' + PLACES + '):</b> '), (m, p) => '<b>' + PLACE[p] + ':</b> '],
            [/Von (\d+) bis (\d+) sind (\d+)\./g, 'De $1 a $2 van $3.'],
            [/(\d+) ist kleiner als (\d+)\. Entbündle: /, '$1 es menor que $2. Desagrupa: '],
            [new RegExp('1 (' + ONES + ') → 10 (' + PLACES + ')', 'g'), (m, a, b) => '1 ' + ONE[a] + ' → 10 ' + low(PLACE[b])],
            [/, dann (?=1 [a-zé])/g, ', después '],
            [/\. Die letzte Ziffer steht genau unter der (\d) des zweiten Faktors\./, '. La última cifra va justo debajo del $1 del segundo factor.'],
            [/Der erste Faktor hat (\d+) (?:Stellen|Stelle) nach dem Komma, also auch das Ergebnis: /,
                (m, n) => 'El primer factor tiene ' + n + ' ' + pl(n, 'cifra', 'cifras') + ' después de la coma; el resultado, también: '],
            [/Teile von links nach rechts\. Frage bei jeder Stelle: Wie oft passt die (\d) hinein\?/, 'Divide de izquierda a derecha. En cada posición pregúntate: ¿cuántas veces cabe el $1?'],
            [/Hole die (\d) herunter: (\d+)\. /, 'Baja el $1: $2. '],
            [/In die (\d) passt die (\d) nicht, nimm die ersten (\d+) Ziffern: (\d+)\. /, 'En el $1 no cabe el $2: toma las $3 primeras cifras: $4. '],
            [/Es bleibt (\d+)\./, (m, r) => (r === '1' ? 'Queda 1.' : 'Quedan ' + r + '.')],
            [/ Rest (\d+)/g, ' resto $1'],
            [/Die Division geht nicht auf\. Nach (\d+) Stellen hinter dem Komma wird abgebrochen\./,
                (m, n) => 'La división no es exacta. Se para después de ' + n + ' ' + pl(n, 'cifra decimal', 'cifras decimales') + '.'],
            [/(<p class="g5-dim">)Probe: /, '$1Prueba: '],
            // vorrangos5: the label of the rule of each step
            [/(<span class="os5-rule">)([^<]*)(<\/span>)/g, (m, a, r, b) => a + VR.reduce((s, [de, es]) => s.split(de).join(es), r) + b],
            // zehnerpotenzos5
            [/Die Hochzahl (\d+) sagt: (\d+) Faktoren 10, also (?:eine Null|\d+ Nullen)\. Das ist <b>([^<]+)<\/b>\./,
                (m, n, f, w) => 'El exponente ' + n + ' dice: ' + f + ' ' + pl(f, 'factor', 'factores') + ' 10, es decir, ' + (n === '1' ? 'un cero' : n + ' ceros') + '. Es <b>' + (TEN[w] || w) + '</b>.'],
            [/Du kannst noch (\d+) (?:Nullen|Null) mehr abtrennen\./, (m, n) => 'Todavía puedes separar ' + n + ' ' + pl(n, 'cero más', 'ceros más') + '.'],
            [/: Rücke das Komma um (\d+) Stellen nach rechts, dann hast du die Zahl\./, ': desplaza la coma $1 posiciones hacia la derecha y tendrás el número.'],
            // quadratos5
            [/^(\d+) mal (\d+) Plättchen(?: und (\d+) weitere)?$/, (m, a, b, e) => a + ' por ' + b + ' fichas' + (e ? ' y ' + e + ' más' : '')],
            [/(\d+) Reihen mit je (\d+) Plättchen ergeben ein Quadrat aus (\d+) Plättchen\./,
                (m, r, k, v) => r + ' ' + pl(r, 'fila', 'filas') + ' de ' + k + ' ' + pl(k, 'ficha', 'fichas') + pl(r, ' forma', ' cada una forman') + ' un cuadrado de ' + v + ' ' + pl(v, 'ficha', 'fichas') + '.'],
            [/(\d+) ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite (\d+)\./, '$1 es un cuadrado perfecto: las fichas forman un cuadrado de lado $2.'],
            [/(\d+) ist keine Quadratzahl\./, '$1 no es un cuadrado perfecto.'],
            [/Es bleiben (\d+) Plättchen übrig, zum nächsten Quadrat fehlen (\d+)\./,
                (m, e, f) => pl(e, 'Sobra 1 ficha', 'Sobran ' + e + ' fichas') + ' y para el siguiente cuadrado ' + pl(f, 'falta 1', 'faltan ' + f) + '.'],
            [/\$ liegt zwischen (\d+) und (\d+)\./, (m, a, b) => '$ está entre ' + a + ' y ' + b + '.'],
            // probierenos5
            [/ \((\d+) Zahlen\)\./, ' ($1 números).'],
            // stellenwert5 (js/buch-gy5.js, its rule has already written "Se lee: tres coma cero cuatro siete"): the digits after the comma as one number
            [new RegExp('(<p class="g5-big">)(' + G + '),(\\d+)(</p>[\\s\\S]*?<p class="g5-dim">Se lee: [^<]*? coma )[^<]*'), (m, a, i, f, b) => a + i + ',' + f + b + decimals(f)],
            // zehnerpotenzos5, teilbarkeitos5, rundenos5: the label "Zahl" in front of the field
            [/(<label class="b-ctrl" for="[^"]*">)Zahl(<\/label>)/g, '$1Número$2'],
            // teilbarkeitos5
            [/<b>durch (\d+)( nicht)?:<\/b>/g, (m, d, n) => '<b>' + (n ? 'no divisible' : 'divisible') + ' entre ' + d + ':</b>'],
            [/Die letzte Ziffer (\d) ist (gerade|ungerade)\./, (m, d, g) => 'la última cifra, ' + d + ', es ' + (g === 'gerade' ? 'par' : 'impar') + '.'],
            [/Quersumme ([\d +=]+?) ist (nicht )?durch (\d) teilbar\./g, (m, q, n, d) => 'la suma de las cifras, ' + q + ', ' + (n ? 'no es' : 'es') + ' divisible entre ' + d + '.'],
            [/Die letzten zwei Ziffern bilden (\d+), das ist (nicht )?durch 4 teilbar\./, (m, z, n) => 'las dos últimas cifras forman el ' + z + ', que ' + (n ? 'no es' : 'es') + ' divisible entre 4.'],
            [/Die letzte Ziffer ist (\d)(, nicht 0 oder 5|, nicht 0)?\./g, (m, d, x) => 'la última cifra es ' + d + (x ? (x.includes('5') ? ', no 0 ni 5.' : ', no 0.') : '.')],
            // bruchteilos5, halbesos5: the steppers "Zähler A kleiner"
            [/^(Zähler|Nenner|Ganzes)( [AB])? (kleiner|größer)$/, (m, w, ab, d) => (d === 'kleiner' ? 'Reducir ' : 'Aumentar ') +
                ({ 'Zähler': 'el numerador', Nenner: 'el denominador', Ganzes: 'el todo' })[w] + (ab ? ' de' + ab : '')],
            [/^(\d+) von (\d+) Gruppen zu je (\d+) sind gefärbt$/, (m, z, n, k) => z + ' de ' + n + ' grupos de ' + k + ' ' + pl(z, 'está coloreado', 'están coloreados')],
            [/(\$\\tfrac\{\d+\}\{\d+\}\$) von (\d+) sind (\d+)\./, (m, f, g, r) => f + ' de ' + g + ' son ' + r + '.'],
            [/(\$\\tfrac\{\d+\}\{\d+\}\$) von (\d+)/g, (m, f, g) => f + ' de ' + g],
            [/1\. Teile das Ganze in (\d+) gleich große Gruppen: /, '1. Divide el todo en $1 grupos iguales: '],
            [/2\. Nimm (\d+) (?:Gruppen|Gruppe): /, (m, z) => '2. Toma ' + z + ' ' + pl(z, 'grupo', 'grupos') + ': '],
            [new RegExp('<b>Gleicher Nenner:</b> Beide Male sind es (' + NTHS + '), also gleich große Stücke\\. Es kommt nur darauf an, wie viele: '),
                (m, k) => '<b>Mismo denominador:</b> las dos veces son ' + NTH[k][0] + ', es decir, trozos iguales. Solo importa cuántos: '],
            [new RegExp('<b>Gleicher Zähler:</b> Beide Male sind es (\\d+) (?:Stücke|Stück)\\. (' + NTHS + ') sind größer als (' + NTHS + '): Je größer der Nenner, desto kleiner die Stücke\\.'),
                (m, z, a, b) => '<b>Mismo numerador:</b> las dos veces son ' + z + ' ' + pl(z, 'trozo', 'trozos') + '. Los ' + NTH[a][0] + ' son más grandes que los ' + NTH[b][0] +
                    ': cuanto mayor es el denominador, más pequeños son los trozos.'],
            [/\$ ist (weniger als|mehr als|genau) ein Ganzes/g, (m, w) => '$ es ' + LESS[w] + ' un entero'],
            [/\$ ist (weniger als|mehr als|genau) ein Halbes/g, (m, w) => '$ es ' + LESS[w] + ' un medio'],
            [/, denn (\d+) ist (weniger|mehr|genau) als die Hälfte von (\d+)\./,
                (m, a, w, b) => ', porque ' + a + ' es ' + ({ weniger: 'menos que la mitad', mehr: 'más que la mitad', genau: 'exactamente la mitad' })[w] + ' de ' + b + '.'],
            [new RegExp('<b>Was fehlt zum Ganzen\\?</b> Bei A fehlen (\\d+) (' + NTHS + '), bei B (\\d+) (' + NTHS + ')\\. (' + NTHS + ') sind kleiner, also fehlt bei ([AB]) weniger\\.'),
                (m, ma, ka, mb, kb, k, x) => '<b>¿Qué falta hasta el entero?</b> A la fracción A le ' + pl(ma, 'falta', 'faltan') + ' ' + ma + ' ' + piece(ma, ka) + '; a la B, ' + mb + ' ' + piece(mb, kb) +
                    '. Los ' + NTH[k][0] + ' son más pequeños, así que a la ' + x + ' le falta menos.'],
            // rundenos5
            [/(>)Mitte ([\d ]+(?:,\d+)?)(<)/, '$1Mitad $2$3'],
            [/^Zahlenstrahl zwischen (.+) und (.+)$/, 'Recta numérica entre $1 y $2'],
            [/Gerundet auf (Ganze|Zehntel|Hundertstel)\. Entscheidend ist die Ziffer der (Zehntel|Hundertstel|Tausendstel): /,
                (m, a, b) => 'Redondeado a ' + RND[a] + '. Lo que decide es la cifra de ' + RND[b] + ': '],
            [/Die Null am Ende bleibt stehen: Sie zeigt, dass auf (Zehntel|Hundertstel) gerundet wurde\./, (m, a) => 'El cero del final se queda: muestra que se ha redondeado a ' + RND[a] + '.'],
            // wuerfelnetzos5
            [/^Gitter mit (\d+) ausgewählten Quadraten$/, (m, n) => 'Cuadrícula con ' + n + ' ' + pl(n, 'cuadrado elegido', 'cuadrados elegidos')],
            [/Wähle 6 Quadrate aus(?:, es fehlen noch (\d))?\./, (m, k) => 'Elige 6 cuadrados' + (k ? '; todavía ' + pl(k, 'falta 1', 'faltan ' + k) : '') + '.'],
            [/Das sind (\d+) Quadrate\. Ein Würfel hat nur 6 Flächen\./, 'Son $1 cuadrados. Un cubo solo tiene 6 caras.'],
            [/Gefunden: (\d+) von 11 verschiedenen Würfelnetzen\./, 'Encontrados: $1 de los 11 desarrollos del cubo distintos.'],
            // bandos5
            [/^Bandornament aus dem Motiv (Fahne|Schlüssel|Blume)$/, (m, k) => 'Friso con el motivo de ' + MOTIF[k]],
            // zahlzeichenos5
            [/^Kerbholz und Strichliste mit (\d+) Strichen$/, (m, n) => 'Palo de tarja y tabla de recuento con ' + n + ' ' + pl(n, 'raya', 'rayas')],
            [/(\d+) Fünferbündel(?: und (\d+) (?:einzelner Strich|einzelne Striche))?/,
                (m, b, r) => b + ' ' + pl(b, 'grupo de cinco', 'grupos de cinco') + (r ? ' y ' + r + ' ' + pl(r, 'raya suelta', 'rayas sueltas') : '')],
            [/(\d+) (?:einzelner Strich|einzelne Striche)/, (m, r) => r + ' ' + pl(r, 'raya suelta', 'rayas sueltas')],
            [/^Die Zahl (\d+) in babylonischer Keilschrift$/, 'El número $1 en escritura cuneiforme babilónica'],
            // the widgets of js/buch-gy5.js on these pages, written as pupils in Spain learn it (Doc, 26.10.2026):
            // koord5: the lines r and s (German g and h, from "Gerade"); the gy5 rule has already made the sentence of the lines Spanish
            [/(<span class="g-lam">)g(<\/span> pasa por A y B; <span class="g-cy">)h(<\/span>, por C y D\.)/, '$1r$2s$3'],
            [/g ∥ h: Die Geraden sind <b>parallel<\/b>, sie schneiden sich nie\./, 'r ∥ s: las rectas son <b>paralelas</b>, nunca se cortan.'],
            [/g ⊥ h: Die Geraden stehen <b>senkrecht<\/b> aufeinander\./, 'r ⊥ s: las rectas son <b>perpendiculares</b>.'],
            [/g und h sind weder parallel noch senkrecht\. Versuche, sie parallel oder senkrecht zu stellen\./,
                'r y s no son ni paralelas ni perpendiculares. Intenta ponerlas paralelas o perpendiculares.'],
            // rechteck5: the perimeter P (German u, from "Umfang")
            [/(<p class="g5-big">)u = /g, '$1P = '],
            [/\$u = 2 \\cdot a \+ 2 \\cdot b/, () => '$P = 2 \\cdot a + 2 \\cdot b'],
            // quader5: the total area A_T (German O, from "Oberfläche")
            [/(<p class="g5-big">)O = /g, '$1A<sub>T</sub> = '],
            [/\$O = 2 \\cdot \(ab \+ ac \+ bc\)/, () => '$A_T = 2 \\cdot (ab + ac + bc)'],
        ]
    });
})();
