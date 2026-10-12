/* js/buch-es/stochastik.js — Spanish for the widgets of js/buch-stochastik.js.
 * Loaded by the Spanish editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * "Würfel" is never a global word here (dado / cubo, tools/buch-es/glosario.md): only with its context.
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('stochastik', {
    word: {
        // book es-2 mathe12-es: treeSVG (helper), venn presets (helper), baum-hero, schnelltest, vierfeld-trainer,
        // histo-hero, unabhaengig, zufallsgroesse, binomial, bernoulli-baum
        'Baumdiagramm': 'Diagrama de árbol', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagrama de árbol: dos bolas sin reemplazamiento',
        'unvereinbar': 'incompatibles',
        'Anteil der Erkrankten': 'Proporción de enfermos', 'Test erkennt Kranke (Sensitivität)': 'El test detecta a los enfermos (sensibilidad)',
        'Test erkennt Gesunde (Spezifität)': 'El test detecta a los sanos (especificidad)', 'Darstellung': 'Representación',
        'Anzahlen (von 10 000)': 'Cantidades (de 10 000)', 'Wahrscheinlichkeiten': 'Probabilidades', 'Anzahlen': 'Cantidades',
        'positiv $T^+$': 'positivo $T^+$', 'negativ $T^-$': 'negativo $T^-$', 'krank $K$': 'enfermo $E$', 'gesund $\\overline{K}$': 'sano $\\overline{E}$',
        'krank': 'enfermo', 'gesund': 'sano', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagrama de árbol: enfermo o sano, después el resultado del test',
        'Neue Tafel': 'Nueva tabla', 'A und B': 'A y B', 'A und nicht B': 'A y no B', 'nicht A und B': 'no A y B', 'nicht A und nicht B': 'no A y no B',
        'A gesamt': 'total de A', 'nicht A gesamt': 'total de no A', 'B gesamt': 'total de B', 'nicht B gesamt': 'total de no B', 'gesamt': 'total',
        'Unabhängig machen': 'Hacer independientes', 'Unvereinbar machen': 'Hacer incompatibles',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Cuadrado unidad: proporción de A en B y en no B',
        'Drei Münzen': 'Tres monedas', 'Augensumme': 'Suma de puntos', 'Glücksrad': 'Ruleta', 'Zufallsgröße': 'Variable aleatoria',
        'Einsatz': 'Apuesta', 'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribución de probabilidad como diagrama de barras',
        'Spielen:': 'Jugar:', 'SPIELE n': 'PARTIDAS n', 'MITTELWERT': 'MEDIA', 'ERWARTUNGSWERT': 'ESPERANZA', 'LETZTE': 'ÚLTIMAS',
        'Anzahl der Versuche $n$': 'Número de ensayos $n$', 'Trefferwahrscheinlichkeit $p$': 'Probabilidad de éxito $p$',
        'Was wird berechnet?': '¿Qué se calcula?', 'Histogramm der Binomialverteilung': 'Histograma de la distribución binomial',
        'Stufen $n$:': 'Etapas $n$:', 'Anzahl der Stufen': 'Número de etapas', 'Genau $k$ Treffer:': 'Exactamente $k$ éxitos:',
        'Anzahl der Treffer': 'Número de éxitos', 'Baumdiagramm einer Bernoulli-Kette': 'Diagrama de árbol de un proceso de Bernoulli',
    },
    phrase: [
        // book es-2 mathe12-es: venn (helper VOPS, VPRE), schnelltest, vierfeld-trainer, histo-hero, unabhaengig,
        // zufallsgroesse, binomial, bernoulli-baum
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o ambos)'], ['$A$ und $B$', '$A$ y $B$'], ['nicht $A$', 'no $A$'],
        ['weder $A$ noch $B$', 'ni $A$ ni $B$'], ['nicht $A$ und nicht $B$', 'no $A$ y no $B$'], ['nicht beide', 'no ambos'],
        ['nicht $A$ oder nicht $B$', 'no $A$ o no $B$'],
        ['gerade · Vielfaches von 3', 'par · múltiplo de 3'], ['Primzahl · größer als 6', 'primo · mayor que 6'],
        // schnelltest: "Dan positivo 1.090 de 10 000 personas – pero solo 190 de ellas están realmente enfermas."
        ['Positiv getestet werden <b>', 'Dan positivo <b>'], ['</b> von 10 000 Personen – ', '</b> de 10 000 personas – '],
        ['aber nur <b>', 'pero solo <b>'], ['</b> davon sind wirklich krank.', '</b> de ellas están realmente enfermas.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proporción de enfermos entre los que dan positivo: '],
        [' alles richtig', ' todo correcto'],
        ['Histogramm einer Binomialverteilung', 'Histograma de una distribución binomial'],
        ['$ und $P(A \\cap B) = ', '$ y $P(A \\cap B) = '],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.',
            '<b>Independientes:</b> ocurra $B$ o no, la proporción de $A$ es la misma. En el cuadrado, el límite está a la misma altura en las dos columnas.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.',
            '<b>Incompatibles</b> ($A \\cap B = \\emptyset$) y, por tanto, <b>dependientes</b>: si ocurre $B$, $A$ ya no puede ocurrir.'],
        ['<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ', '<b>Dependientes:</b> $B$ modifica la probabilidad de $A$ '],
        ['nach oben', 'hacia arriba'], ['nach unten', 'hacia abajo'],
        ['Augensumme zweier Würfel', 'suma de puntos de dos dados'], ['Anzahl Wappen', 'número de caras'], ['Augenzahl', 'número de puntos'],
        ['Gewinn = Auszahlung − Einsatz', 'ganancia = premio − apuesta'], ['Gewinn bei 1 € Einsatz', 'ganancia con una apuesta de 1 €'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Premios de 0 €, 1 €, 2 € y 10 € con las probabilidades '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.',
            ' Apuestas 1 € a un número y se lanzan tres dados. Por cada dado que muestra tu número ganas 1 €; si no sale ninguno, pierdes la apuesta.'],
        ['Erwartungswert: $E(X)', 'Esperanza: $E(X)'], [' · Das Spiel ist <b>fair</b>.', ' · El juego es <b>justo</b>.'],
        [' · Auf lange Sicht <b>verlierst</b> du im Mittel ', ' · A la larga <b>pierdes</b> de media '],
        [' · Auf lange Sicht <b>gewinnst</b> du im Mittel ', ' · A la larga <b>ganas</b> de media '], [' € pro Spiel.', ' € por partida.'],
        ['Varianz: $V(X)', 'Varianza: $V(X)'], ['$ · Standardabweichung: $', '$ · desviación típica: $'],
        ['$X$ ist binomialverteilt mit $n = ', '$X$ sigue una distribución binomial con $n = '], ['$ und $p = ', '$ y $p = '],
        ['Erwartungswert $\\mu', 'Esperanza $\\mu'], ['$ · Standardabweichung $', '$ · desviación típica $'],
        ['Pfade mit genau ', 'Ramas con exactamente '], [' Treffern: $', ' éxitos: $'], ['$ · jeder hat die Wahrscheinlichkeit $', '$ · cada una tiene la probabilidad $'],
        ['Formel von Bernoulli: $P(X = ', 'Fórmula de Bernoulli: $P(X = '],
    ],
    rule: [
        // book es-2 mathe12-es
        // zufallsgroesse: the seg button "Würfel" is the dice (never a global word: dado / cubo)
        [/(<button type="button" data-v="wuerfel">)Würfel(<\/button>)/g, '$1Dado$2'],
        // bernoulli-baum: the paths are labelled T (Treffer) and N (Niete) → E (éxito) and F (fracaso)
        [/(<text\b[^>]*>)([TN]{1,4})(<\/text>)/g, (m, a, k, b) => a + k.replace(/T/g, 'E').replace(/N/g, 'F') + b],
        // bernoulli-baum: singular "1 éxito" (before the pieces make it "1 éxitos")
        [/Pfade mit genau 1 Treffern: \$/g, 'Ramas con exactamente 1 éxito: $'],
        // schnelltest: tree nodes K (krank) and G (gesund) → E (enfermo) and S (sano)
        [/(font-weight:700">)K(<\/text>)/g, '$1E$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        // vierfeld-trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 de $2 correctas'],
    ]
});
