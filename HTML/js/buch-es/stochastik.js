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
        'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich': 'Distribución binomial bajo la hipótesis nula con la región de rechazo'
    },
    phrase: [
        // book es-3 mathe13-es: helpers of the module (venn: the combinations of A and B)
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o ambos)'], ['$A$ und $B$', '$A$ y $B$'], ['nicht $A$ und nicht $B$', 'no $A$ y no $B$'],
        ['nicht $A$ oder nicht $B$', 'no $A$ o no $B$'], ['weder $A$ noch $B$', 'ni $A$ ni $B$'], ['nicht beide', 'no ambos'], ['nicht $A$', 'no $A$'],
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
        ['$ fälschlich beibehalten (Fehler 2. Art).', '$ (error de tipo II).']
    ],
    rule: []
});
