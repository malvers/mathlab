/* js/buch-es/stochastik.js — Spanish for the widgets of js/buch-stochastik.js.
 * Loaded by the Spanish editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('stochastik', {
    word: {
        // book es-1 mathe11-es: baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm': 'Diagrama de árbol', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagrama de árbol: dos bolas sin reemplazamiento',
        'Rot': 'Rojo', 'eine rote Kugel weniger': 'una bola roja menos', 'eine rote Kugel mehr': 'una bola roja más',
        'eine blaue Kugel weniger': 'una bola azul menos', 'eine blaue Kugel mehr': 'una bola azul más',
        'Anzahl der Züge': 'Número de extracciones', '2 Züge': '2 extracciones', '3 Züge': '3 extracciones', 'Ziehen': 'Extracción',
        'ohne Zurücklegen': 'sin reemplazamiento', 'mit Zurücklegen': 'con reemplazamiento', 'Urne:': 'Urna:',
        'Ereignis wählen:': 'Elige un suceso:', 'Ereignis': 'Suceso', 'Baumdiagramm der Urne': 'Diagrama de árbol de la urna', 'unmöglich': 'imposible',
        'beide Rot': 'las dos rojas', 'alle Rot': 'todas rojas', 'genau einmal Rot': 'exactamente una roja', 'mindestens einmal Rot': 'al menos una roja',
        'keinmal Rot': 'ninguna roja', 'beide gleich': 'las dos iguales', 'alle gleich': 'todas iguales', 'leeren': 'borrar',
        'Anteil der Erkrankten': 'Proporción de enfermos', 'Test erkennt Kranke (Sensitivität)': 'El test detecta a los enfermos (sensibilidad)',
        'Test erkennt Gesunde (Spezifität)': 'El test detecta a los sanos (especificidad)', 'Darstellung': 'Representación',
        'Anzahlen (von 10 000)': 'Cantidades (de 10 000)', 'Wahrscheinlichkeiten': 'Probabilidades', 'Anzahlen': 'Cantidades',
        'positiv $T^+$': 'positivo $T^+$', 'negativ $T^-$': 'negativo $T^-$', 'krank $K$': 'enfermo $E$', 'gesund $\\overline{K}$': 'sano $\\overline{E}$',
        'krank': 'enfermo', 'gesund': 'sano', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagrama de árbol: enfermo o sano, después el resultado del test',
        'Neue Tafel': 'Nueva tabla', 'A und B': 'A y B', 'A und nicht B': 'A y no B', 'nicht A und B': 'no A y B', 'nicht A und nicht B': 'no A y no B',
        'A gesamt': 'total de A', 'nicht A gesamt': 'total de no A', 'B gesamt': 'total de B', 'nicht B gesamt': 'total de no B', 'gesamt': 'total',
        // "Würfel" (dado / cubo) is never a global word: the simulator's button is a rule below
        'Münze': 'Moneda', 'Zwei Würfel': 'Dos dados', 'Urne': 'Urna', 'Wappen': 'cara', 'Sechs': 'seis', 'Augensumme 7': 'suma de puntos 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'las dos rojas (3 rojas, 2 azules, sin reemplazamiento)',
        'mindestens eine Sechs in vier Würfen': 'al menos un seis en cuatro lanzamientos', 'Zufallsversuch': 'Experimento aleatorio', 'Durchführen:': 'Realizar:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Frecuencia relativa en función del número de ensayos',
        'VERSUCHE n': 'ENSAYOS n', 'TREFFER': 'ÉXITOS', 'REL. HÄUFIGKEIT': 'FREC. RELATIVA', 'WAHRSCHEINLICHKEIT': 'PROBABILIDAD',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Todavía no hay ningún ensayo – empieza con +1 o +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Detrás de una puerta hay un coche y detrás de cada una de las otras dos, una cabra. Elige una puerta.',
        'Neues Spiel': 'Nueva partida', '1000 Spiele vom Rechner spielen lassen': 'Que el ordenador juegue 1000 partidas',
        'Strategie': 'Estrategia', 'Spiele': 'Partidas', 'Autos': 'Coches', 'Gewinnquote': 'Tasa de éxito',
        'du: bleiben': 'tú: te quedas', 'du: wechseln': 'tú: cambias', 'Rechner: bleiben': 'ordenador: se queda', 'Rechner: wechseln': 'ordenador: cambia',
        // book es-3 mathe13-es: helpers of the module (tree, venn templates)
        'Baumdiagramm': 'Diagrama de árbol', 'gerade · Vielfaches von 3': 'par · múltiplo de 3', 'Primzahl · größer als 6': 'primo · mayor que 6',
        // book es-3 mathe13-es: histo-hero, binomial
        'Histogramm einer Binomialverteilung': 'Histograma de una distribución binomial',
        'Anzahl der Versuche $n$': 'Número de ensayos $n$', 'Trefferwahrscheinlichkeit $p$': 'Probabilidad de éxito $p$',
        'Was wird berechnet?': '¿Qué se calcula?', 'Histogramm der Binomialverteilung': 'Histograma de la distribución binomial',
        // book es-3 mathe13-es: stichprobe, signifikanztest
        'Anteil in der Grundgesamtheit $p$': 'Proporción en la población $p$', 'Stichprobenumfang $n$': 'Tamaño de la muestra $n$',
        'Stichproben ziehen:': 'Extraer muestras:', 'Verteilung der relativen Häufigkeiten vieler Stichproben': 'Distribución de las frecuencias relativas de muchas muestras',
        'Noch keine Stichprobe gezogen.': 'Todavía no se ha extraído ninguna muestra.',
        'Nullhypothese $p_0$': 'Hipótesis nula $p_0$', 'linksseitig': 'por la izquierda', 'rechtsseitig': 'por la derecha', 'zweiseitig': 'bilateral',
        'Test:': 'Contraste:', 'Art des Tests': 'Tipo de contraste', 'Signifikanzniveau $\\alpha$:': 'Nivel de significación $\\alpha$:', 'Signifikanzniveau': 'Nivel de significación',
        'Beobachtete Trefferzahl $k$': 'Número de éxitos observado $k$', 'Fehler 2. Art zeigen: wahres $p$ =': 'Mostrar error de tipo II: $p$ verdadero =',
        'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich': 'Distribución binomial bajo la hipótesis nula con la región de rechazo',
        // book es-2 mathe12-es: treeSVG, venn, baum-hero, schnelltest, vierfeld-trainer, histo-hero, unabhaengig, zufallsgroesse, binomial, bernoulli-baum (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        'unvereinbar': 'incompatibles',
        'Unabhängig machen': 'Hacer independientes',
        'Unvereinbar machen': 'Hacer incompatibles',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Cuadrado unidad: proporción de A en B y en no B',
        'Drei Münzen': 'Tres monedas',
        'Augensumme': 'Suma de puntos',
        'Glücksrad': 'Ruleta',
        'Zufallsgröße': 'Variable aleatoria',
        'Einsatz': 'Apuesta',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribución de probabilidad como diagrama de barras',
        'Spielen:': 'Jugar:',
        'SPIELE n': 'PARTIDAS n',
        'MITTELWERT': 'MEDIA',
        'ERWARTUNGSWERT': 'ESPERANZA',
        'LETZTE': 'ÚLTIMAS',
        'Stufen $n$:': 'Etapas $n$:',
        'Anzahl der Stufen': 'Número de etapas',
        'Genau $k$ Treffer:': 'Exactamente $k$ éxitos:',
        'Anzahl der Treffer': 'Número de éxitos',
        'Baumdiagramm einer Bernoulli-Kette': 'Diagrama de árbol de un proceso de Bernoulli',

        // book es mathegy8-es (Curie)
        // venn
        'Ein Glücksrad hat 12 gleich große Felder: $\\Omega = \\{1; 2; \\ldots; 12\\}$. Wähle eine Vorlage oder stell $A$ und $B$ selbst zusammen: Ereignis wählen, dann Zahlen antippen.':
            'Una ruleta tiene 12 sectores iguales: $\\Omega = \\{1, 2, \\ldots, 12\\}$. Elige un modelo o forma $A$ y $B$ tú mismo: elige el suceso y después toca los números.',
        'Vorlage': 'Modelo', '$A$ bearbeiten': 'Editar $A$', '$B$ bearbeiten': 'Editar $B$', 'Ereignis bearbeiten': 'Suceso que se edita',
        'Verknüpfung:': 'Combinación:', 'Verknüpfung': 'Combinación', 'Mengendiagramm der Ereignisse A und B': 'Diagrama de Venn de los sucesos A y B',
        // urne
        'Kugeln $n$': 'Bolas $n$', 'Ziehungen $k$': 'Extracciones $k$', 'n kleiner': 'n menor', 'n größer': 'n mayor', 'k kleiner': 'k menor', 'k größer': 'k mayor',
        'mit Reihenfolge': 'con orden', 'ohne Reihenfolge': 'sin orden', 'Reihenfolge': 'Orden', 'Zurücklegen': 'Reemplazamiento', 'Einmal ziehen': 'Extraer una vez', 'URNE': 'URNA',

        // book es mathe10-es (Curie)

        // book es mathegy11-es (Turing)
        // pascal (also in FOS 11)
        '$n$ (Zeile)': '$n$ (fila)', '$k$ (Stelle)': '$k$ (posición)', 'Pascalsches Dreieck bis zur Zeile 10': 'Triángulo de Pascal hasta la fila 10',

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    },
    phrase: [
        // book es-1 mathe11-es: baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Haz clic en los extremos de las ramas (a la derecha del árbol) o elige arriba un suceso. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'El libro te calcula paso a paso las reglas de las ramas.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1.ª regla de las ramas</b> (multiplicar a lo largo de la rama):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2.ª regla de las ramas</b> (sumar las ramas):'],
        ['aber nur <b>', 'pero solo <b>'], ['</b> davon sind wirklich krank.', '</b> de ellas están realmente enfermas.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proporción de enfermos entre los que dan positivo: '],
        [' alles richtig', ' todo correcto'], ['Ereignis: <b>', 'Suceso: <b>'], ['Zuletzt: ', 'Últimos: '],
        ['TÜR', 'PUERTA'], ['Tür', 'Puerta'], ['Gewonnen – das Auto! ', '¡Has ganado el coche! '], ['Leider eine Ziege. ', 'Lo siento, una cabra. '],
        ['Du hast gewechselt.', 'Has cambiado.'], ['Du bist geblieben.', 'Te has quedado.'],
        // book es-1 mathe11-es: the module-level constants of venn (not on a BGY 11 page, but check.mjs reads them for every page)
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o ambos)'], ['$A$ und $B$', '$A$ y $B$'], ['nicht $A$ und nicht $B$', 'no $A$ y no $B$'],
        ['nicht $A$ oder nicht $B$', 'no $A$ o no $B$'], ['weder $A$ noch $B$', 'ni $A$ ni $B$'], ['nicht beide', 'no ambos'], ['nicht $A$', 'no $A$'],
        ['gerade · Vielfaches von 3', 'par · múltiplo de 3'], ['Primzahl · größer als 6', 'primo · mayor que 6'], ['unvereinbar', 'incompatibles'],
        // book es-3 mathe13-es: helpers of the module (venn: the combinations of A and B)
        // book es-3 mathe13-es: binomial
        ['$X$ ist binomialverteilt mit $n = ', '$X$ sigue una distribución binomial con $n = '], ['$ und $p = ', '$ y $p = '],
        ['Erwartungswert $\\mu', 'Esperanza $\\mu'], ['$ · Standardabweichung $', '$ · desviación típica $'],
        // book es-3 mathe13-es: stichprobe
        [' Stichproben vom Umfang ', ' muestras de tamaño '], [' · letzte: $h = ', ' · última: $h = '], ['$ (gold)', '$ (dorado)'],
        ['Mittelwert der $h$: $', 'Media de las $h$: $'], ['$ · Standardabweichung der $h$: $', '$ · desviación típica de las $h$: $'],
        ['Theorie: $', 'Teoría: $'], ['$. Viermal so großes $n$ halbiert die Streuung.', '$. Un $n$ cuatro veces mayor reduce la dispersión a la mitad.'],
        // book es-3 mathe13-es: signifikanztest
        ['$ gegen $H_1\\colon ', '$ frente a $H_1\\colon '], ['Ablehnungsbereich (rot): $', 'Región de rechazo (rojo): $'],
        ['$ · tatsächliche Irrtumswahrscheinlichkeit $\\approx ', '$ · probabilidad de error real $\\approx '], ['Beobachtet $k = ', 'Observado $k = '],
        ['<b>$H_0$ wird abgelehnt.</b> Das Ergebnis ist signifikant.', '<b>Se rechaza $H_0$.</b> El resultado es significativo.'],
        ['<b>$H_0$ wird nicht abgelehnt.</b> Das beweist aber nicht, dass $H_0$ stimmt.', '<b>No se rechaza $H_0$.</b> Pero eso no demuestra que $H_0$ sea cierta.'],
        ['Ist in Wahrheit $p = ', 'Si en realidad $p = '], ['$ (violett), wird $H_0$ mit $\\beta \\approx ', '$ (violeta), se mantiene $H_0$ por error con $\\beta \\approx '],
        ['$ fälschlich beibehalten (Fehler 2. Art).', '$ (error de tipo II).'],
        // book es-2 mathe12-es: treeSVG, venn, baum-hero, schnelltest, vierfeld-trainer, histo-hero, unabhaengig, zufallsgroesse, binomial, bernoulli-baum (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        ['Positiv getestet werden <b>', 'Dan positivo <b>'],
        ['</b> von 10 000 Personen – ', '</b> de 10 000 personas – '],
        ['Histogramm einer Binomialverteilung', 'Histograma de una distribución binomial'],
        ['$ und $P(A \\cap B) = ', '$ y $P(A \\cap B) = '],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.', '<b>Independientes:</b> ocurra $B$ o no, la proporción de $A$ es la misma. En el cuadrado, el límite está a la misma altura en las dos columnas.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.', '<b>Incompatibles</b> ($A \\cap B = \\emptyset$) y, por tanto, <b>dependientes</b>: si ocurre $B$, $A$ ya no puede ocurrir.'],
        ['<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ', '<b>Dependientes:</b> $B$ modifica la probabilidad de $A$ '],
        ['nach oben', 'hacia arriba'],
        ['nach unten', 'hacia abajo'],
        ['Augensumme zweier Würfel', 'suma de puntos de dos dados'],
        ['Anzahl Wappen', 'número de caras'],
        ['Augenzahl', 'número de puntos'],
        ['Gewinn = Auszahlung − Einsatz', 'ganancia = premio − apuesta'],
        ['Gewinn bei 1 € Einsatz', 'ganancia con una apuesta de 1 €'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Premios de 0 €, 1 €, 2 € y 10 € con las probabilidades '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.', ' Apuestas 1 € a un número y se lanzan tres dados. Por cada dado que muestra tu número ganas 1 €; si no sale ninguno, pierdes la apuesta.'],
        ['Erwartungswert: $E(X)', 'Esperanza: $E(X)'],
        [' · Das Spiel ist <b>fair</b>.', ' · El juego es <b>justo</b>.'],
        [' · Auf lange Sicht <b>verlierst</b> du im Mittel ', ' · A la larga <b>pierdes</b> de media '],
        [' · Auf lange Sicht <b>gewinnst</b> du im Mittel ', ' · A la larga <b>ganas</b> de media '],
        [' € pro Spiel.', ' € por partida.'],
        ['Varianz: $V(X)', 'Varianza: $V(X)'],
        ['$ · Standardabweichung: $', '$ · desviación típica: $'],
        ['Pfade mit genau ', 'Ramas con exactamente '],
        [' Treffern: $', ' éxitos: $'],
        ['$ · jeder hat die Wahrscheinlichkeit $', '$ · cada una tiene la probabilidad $'],
        ['Formel von Bernoulli: $P(X = ', 'Fórmula de Bernoulli: $P(X = '],

        // book es mathegy8-es (Curie)
        // venn
        ['Additionssatz: $', 'Regla de la suma: $'], ['Gegenereignis: $', 'Suceso contrario: $'],
        [' · $A$ und $B$ sind <b>unvereinbar</b> ($A \\cap B = \\emptyset$), es wird nichts doppelt gezählt.', ' · $A$ y $B$ son <b>incompatibles</b> ($A \\cap B = \\emptyset$): no se cuenta nada dos veces.'],
        ['Die Zahlen, die in beiden Ereignissen liegen.', 'Los números que están en los dos sucesos.'],
        ['$A \\cap B = \\emptyset$: Die Ereignisse sind <b>unvereinbar</b>, sie können nicht zusammen eintreten.', '$A \\cap B = \\emptyset$: los sucesos son <b>incompatibles</b>, no pueden ocurrir a la vez.'],
        ['Regel von de Morgan: $', 'Leyes de De Morgan: $'], ['$. Wähle die andere Seite und vergleiche: Es ist dieselbe Menge.', '$. Elige el otro miembro y compara: es el mismo conjunto.'],
        // urne
        ['Variation mit Wiederholung', 'Variación con repetición'], ['Permutation (alle Kugeln, mit Reihenfolge)', 'Permutación (todas las bolas, con orden)'],
        ['Variation ohne Wiederholung', 'Variación sin repetición'], ['Kombination ohne Wiederholung', 'Combinación sin repetición'],
        ['Kombination mit Wiederholung', 'Combinación con repetición'], ['</b> · Beispiel: ', '</b> · ejemplo: '], ['Anzahl der Möglichkeiten: ', 'Número de posibilidades: '],
        ['Gezogen: <b>', 'Extraído: <b>'], ['Ergebnisse als Tupel $(\\ldots)$: Die Reihenfolge zählt.', 'Resultados como tuplas $(\\ldots)$: el orden cuenta.'],
        ['Ergebnisse als Mengen $\\{\\ldots\\}$: Die Reihenfolge zählt nicht.', 'Resultados como conjuntos $\\{\\ldots\\}$: el orden no cuenta.'],
        [' Genau dafür gibt es die Formel.', ' Justo para eso está la fórmula.'],
        // urne: the pieces of the examples that the rules below translate as a whole (for tools/buch-en/check.mjs)
        ['ein Zahlenschloss mit ', 'un candado de números con '], [' Rädern zu je ', ' ruedas de '], [' Personen stellen sich in eine Reihe', ' personas se ponen en fila'],
        ['ein Siegerpodest: ', 'un podio: '], [' Startern auf die Plätze 1 bis ', ' participantes en los puestos del 1 al '], ['Lotto: ', 'lotería: '],
        [' Zahlen, die Reihenfolge der Ziehung zählt nicht', ' números, el orden de la extracción no cuenta'], [' Kugeln Eis aus ', ' bolas de helado de '],
        [' Sorten, eine Sorte darf mehrfach vorkommen', ' sabores, un sabor puede repetirse'], [' Möglichkeiten sind zu viele zum Auflisten.', ' posibilidades son demasiadas para listarlas.'],

        // book es mathe10-es (Curie)

        // book es mathegy11-es (Turing)
        // pascal
        [': So viele Möglichkeiten gibt es, $', ': hay tantas maneras de elegir $'], ['$ aus $', '$ de entre $'], ['$ auszuwählen.', '$.'],
        ['Summenregel (grün umrandet): $', 'Regla de la suma (recuadro verde): $'], ['Symmetrie (gestrichelt): $', 'Simetría (discontinua): $'],
        ['Die Mitte der Zeile: $', 'El centro de la fila: $'], ['}$ ist hier sein eigenes Spiegelbild.', '}$ es aquí su propia imagen especular.'],

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)
        // stichprobe: the singular after one sample (German widget fixed 13.10., "1 Stichprobe vom Umfang 50")
        [' Stichprobe vom Umfang ', ' muestra de tamaño '],

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    ],
    rule: [
        // book es-1 mathe11-es
        // letters in the trees and in the simulator: R/B (rot/blau) → R/A (rojo/azul), K/G (krank/gesund) → E/S (enfermo/sano),
        // coin W/Z (Wappen/Zahl) → C/X (cara/cruz); the chapter text lb1 uses the same letters
        [/(font-weight:700">)B(<\/t(?:ext|span)>)/g, '$1A$2'],
        [/(font-weight:700">)K(<\/text>)/g, '$1E$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(<text x="10" y="20">)([RB]{2,3})(<\/text>)/g, (m, a, k, b) => a + k.replace(/B/g, 'A') + b],
        [/\\text\{([RB]{2,3})\}/g, (m, k) => '\\text{' + k.replace(/B/g, 'A') + '}'],
        [/(margin-right:10px">)([RB]{2})</g, (m, a, k) => a + k.replace(/B/g, 'A') + '<'],
        [/(margin-right:10px">)W</g, '$1C<'], [/(margin-right:10px">)Z</g, '$1X<'],
        // simulator: the dice button ("Würfel" has two meanings, so no global word)
        [/(data-x="wuerfel">)Würfel</g, '$1Dado<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 de $2 correctas'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'De 10 000 personas, <b>' + n + '</b> dan positivo, '],
        // goats (before the header rule "^Zu " of js/buch-es.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'El presentador sabe dónde está el coche y abre la puerta $1: una cabra. ¿Te quedas o cambias?'],
        [/Bei Tür (\d) bleiben/g, 'Quedarme con la puerta $1'], [/Zu Tür (\d) wechseln/g, 'Cambiar a la puerta $1'],
        // book es-2 mathe12-es: treeSVG, venn, baum-hero, schnelltest, vierfeld-trainer, histo-hero, unabhaengig, zufallsgroesse, binomial, bernoulli-baum (entries the dictionary did not have yet; a German key already above keeps its Spanish)
        [/(<button type="button" data-v="wuerfel">)Würfel(<\/button>)/g, '$1Dado$2'],
        [/(<text\b[^>]*>)([TN]{1,4})(<\/text>)/g, (m, a, k, b) => a + k.replace(/T/g, 'E').replace(/N/g, 'F') + b],
        [/Pfade mit genau 1 Treffern: \$/g, 'Ramas con exactamente 1 éxito: $'],

        // book es mathegy8-es (Curie)
        // venn: sets of whole numbers in TeX, \{2;\,4\} → \{2, 4\} (with a decimal comma the semicolon stays)
        [/\\\{([^$]*?)\\\}/g, (m, s) => /\d(?:,|\{,\})\d/.test(s) ? m : '\\{' + s.replace(/;\\,|; /g, ', ') + '\\}'],
        // urne: outcomes "(1; 2)" and "{1; 2}" → "(1, 2)", "{1, 2}"; the examples with their numbers (singular for 1)
        [/[({]\d+(?:; \d+)+[)}]/g, m => m.replace(/; /g, ', ')],
        [/ein Zahlenschloss mit (\d+) Rädern zu je (\d+) Ziffern/g, (m, k, n) => 'un candado de números con ' + k + (k === '1' ? ' rueda' : ' ruedas') + ' de ' + n + ' cifras'],
        [/(\d+) Personen stellen sich in eine Reihe/g, '$1 personas se ponen en fila'],
        [/ein Siegerpodest: (\d+) von (\d+) Startern auf die Plätze 1 bis (\d+)/g, (m, k, n, p) => 'un podio: ' + k + ' de ' + n + ' participantes ' + (p === '1' ? 'en el puesto 1' : 'en los puestos del 1 al ' + p)],
        [/Lotto: (\d+) aus (\d+) Zahlen, die Reihenfolge der Ziehung zählt nicht/g, 'lotería: $1 de $2 números, el orden de la extracción no cuenta'],
        [/(\d+) Kugeln Eis aus (\d+) Sorten, eine Sorte darf mehrfach vorkommen/g, (m, k, n) => k + (k === '1' ? ' bola' : ' bolas') + ' de helado de ' + n + ' sabores, un sabor puede repetirse'],
        [/(\d{1,3}(?:\.\d{3})*) Möglichkeiten sind zu viele zum Auflisten\./g, '$1 posibilidades son demasiadas para listarlas.'],

        // book es mathe10-es (Curie)

        // book es mathegy11-es (Turing)
        // pascal: "$, denn $2$ auswählen heißt $3$ weglassen."
        [/\$, denn \$(\d+)\$ auswählen heißt \$(\d+)\$ weglassen\./g, (m, k, r) => '$, porque elegir $' + k + '$ es lo mismo que dejar fuera $' + r + '$.'],

        // book es mathegy11lk-es (Turing)

        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

        // book es mathegy10-es (offen)

    ]
});
