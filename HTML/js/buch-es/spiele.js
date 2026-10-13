/* js/buch-es/spiele.js — Spanish for the widgets of js/buch-spiele.js.
 * Loaded by the Spanish editions right after js/buch-spiele.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('spiele', {
    word: {
        // book es mathegy8-es (Curie)
        // verteilung, and the module constants of spielstreuung that tools/buch-en/check.mjs reads for every page
        'Augensumme': 'Suma de puntos', 'Differenz': 'Diferencia', 'Maximum': 'Máximo', 'Anzahl Sechsen': 'Número de seises', 'Zufallsgröße': 'Variable aleatoria',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribución de probabilidad como diagrama de barras',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'Los 36 resultados de dos dados con el valor de la variable aleatoria',
        '2. Würfel →': '2.º dado →',
        'Münzwette': 'Apuesta con moneda', 'Glücksrad': 'Ruleta', 'Los': 'Papeleta',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Apuesta 1 €. Cara: te devuelven 2 €; cruz: nada.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Apuesta 1 €. Con probabilidad $\\tfrac{1}{10}$ te devuelven 10 €; si no, nada.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Apuesta 1 €. Con probabilidad $\\tfrac{1}{100}$ te devuelven 100 €; si no, nada.',

        // book es mathe10-es (Curie)

        // book es mathegy10-es (offen)

    },
    phrase: [
        // book es mathegy8-es (Curie)
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'la suma de las dos puntuaciones'], ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'la distancia entre las dos puntuaciones, la mayor menos la menor'],
        ['die größere der beiden Augenzahlen', 'la mayor de las dos puntuaciones'], ['wie viele der beiden Würfel eine Sechs zeigen', 'cuántos de los dos dados muestran un seis'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Toca una casilla o un valor.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' de los 36 resultados igual de probables pertenecen a él. Todas las probabilidades juntas suman $1$.'],

        // book es mathe10-es (Curie)

        // book es mathegy10-es (offen)

    ],
    rule: [
        // book es mathegy8-es (Curie)
        // verteilung: one outcome takes the singular
        [/· 1 der 36 gleich wahrscheinlichen Ergebnisse gehören dazu\./g, '· 1 de los 36 resultados igual de probables pertenece a él.'],

        // book es mathe10-es (Curie)

        // book es mathegy10-es (offen)

    ]
});
