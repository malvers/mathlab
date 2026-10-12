/* js/buch-es/analysis.js — Spanish for the widgets of js/buch-analysis.js.
 * Loaded by the Spanish editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Package ES0 put in only the cover of the start page; the book package (ES2, mathe12-es) fills in the rest, in its own block.
 */
window.BuchES && BuchES.add('analysis', {
    word: {
        // es0: the cover of the start page
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Portada: curva con la tangente en el punto de inflexión y su derivada, distribución binomial y un vector en el espacio',
        // book es-3 mathe13-es: kurve
        'Zeige auch:': 'Mostrar también:',
        'nur f': 'solo f',
        'f′ und f″': 'f′ y f″',
        'Ableitungen zeigen': 'Mostrar las derivadas',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Gráfica de una función de tercer grado con extremos y punto de inflexión',
        'Intervall': 'Intervalo',
        'konstant': 'constante',
        'steigt ↗': 'crece ↗',
        'fällt ↘': 'decrece ↘',
        'keine Extrempunkte': 'sin extremos',
        // book es-3 mathe13-es: schar, gewinn
        'Funktionenschar': 'Familia de funciones',
        'Ortskurve der Extrempunkte zeigen': 'Mostrar el lugar geométrico de los extremos',
        'Funktionenschar mit Ortskurve': 'Familia de funciones con el lugar geométrico',
        'Parameter $a$': 'Parámetro $a$',
        'Hochpunkt': 'Máximo',
        'Tiefpunkt': 'Mínimo',
        'Verkaufspreis $p$ (€ pro Stück)': 'Precio de venta $p$ (€ por unidad)',
        'x in Stück': 'x en unidades',
        'Kosten, Erlös und Gewinn': 'Costes, ingresos y beneficio',
        // book es-3 mathe13-es: helpers of the module (rules of the derivative and integral trainers, the sketches of optimieren)
        'Mauer': 'muro',
        'Karton mit ausgeschnittenen Ecken': 'Cartón con las esquinas recortadas',
        'Gehege an einer Mauer': 'Recinto junto a un muro'
    },
    phrase: [
        // book es-3 mathe13-es: kurve
        ['Hochpunkt $', 'Máximo $'],
        ['Tiefpunkt $', 'Mínimo $'],
        [' · Sattelpunkt bei $x = ', ' · punto de silla en $x = '],
        ['Wendepunkt $W', 'Punto de inflexión $W'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung ', '$: ahí $f\'\'(x) = 0$ y la pendiente es '],
                ['am kleinsten', 'mínima'], ['am größten', 'máxima'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Para $a = 0$, $f$ es una parábola (o una recta) sin punto de inflexión.'],
        // book es-3 mathe13-es: schar, gewinn
        ['keine Extrempunkte', 'sin extremos'],
        ['Ortskurve aller Extrempunkte (violett): $', 'Lugar geométrico de todos los extremos (violeta): $'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.', 'Para $a \\le 0$ no hay extremos: entonces $f_a\'(x) = 3x^2 - a$ no tiene ningún cero con cambio de signo.'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Todas las parábolas de la familia pasan por el origen, porque $f_a(0) = 0$ para todo $a$.'],
        ['Gewinnschwelle bei $x \\approx ', 'Umbral de rentabilidad en $x \\approx '],
        ['$, Gewinngrenze bei $x \\approx ', '$, límite de beneficio en $x \\approx '],
        ['$ Stück.', '$ unidades.'],
        ['Gewinn ab $x \\approx ', 'Beneficio a partir de $x \\approx '],
        ['Bei diesem Preis wird nie Gewinn gemacht.', 'Con este precio nunca hay beneficio.'],
        ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Beneficio máximo: $G\'(x) = 0$ en $x \\approx '],
        ['$ Stück, $G \\approx ', '$ unidades, $G \\approx '],
        ['Kein positives Gewinnmaximum.', 'No hay beneficio máximo positivo.'],
        // book es-3 mathe13-es: helpers of the module (rules of the derivative and integral trainers, the sketches of optimieren)
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Regla de la potencia $(x^n)\' = n\\,x^{n-1}$ y regla del factor constante: el factor se mantiene.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Regla de la suma: cada sumando se deriva por separado. Un sumando constante desaparece.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.', 'La regla de la potencia también vale para exponentes racionales: $(x^r)\' = r\\,x^{r-1}$.'],
        ['$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.', '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ y $(\\sin x)\' = \\cos x$.'],
        ['$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.', '$(\\sin x)\' = \\cos x$, y $(c \\cdot x)\' = c$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.', 'Regla del producto $(u \\cdot v)\' = u\'v + uv\'$ con $u = x$, $v = \\mathrm{e}^x$.'],
        ['Produktregel mit $u = ', 'Regla del producto con $u = '],
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.', 'Regla de la potencia al revés: sube el exponente en 1 y divide entre el nuevo exponente, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.'],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.', 'Reglas de la suma y del factor constante: cada sumando se integra por separado, un factor se mantiene. Una constante $a$ tiene la primitiva $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: exponente $\\tfrac12 + 1 = \\tfrac32$; dividir entre $\\tfrac32$ es multiplicar por $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.', '$: exponente $-1$, dividir entre $-1$, es decir, $-x^{-1} = -\\tfrac1x$.'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: exponente $\\tfrac12$; dividir entre $\\tfrac12$ es multiplicar por 2.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.', 'La regla de la potencia vale para todo exponente $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.'],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ es su propia derivada y, por tanto, también su propia primitiva.'],
        ['Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.', 'El hueco de la regla de la potencia: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Para $x > 0$ basta con $\\ln x$.'],
        ['Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', 'Composición lineal: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Comprobación: la regla de la cadena da el factor $a$ y $\\tfrac1a$ lo anula.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: primero la primitiva de $\\sin$, después divide entre la derivada interior $a$.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: regla de la potencia para el paréntesis, después divide entre la derivada interior.']
    ],
    rule: [
        // book es-3 mathe13-es: kurve, the sliders "$a$ (vor $x^3$)" → "$a$ (coeficiente de $x^3$)"
        [/\(vor (\$x(?:\^\d)?\$)\)/g, '(coeficiente de $1)']
    ]
});
