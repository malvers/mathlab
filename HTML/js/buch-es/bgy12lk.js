/* js/buch-es/bgy12lk.js — Spanish for the widgets of js/buch-bgy12lk.js.
 * Loaded by the Spanish editions right after js/buch-bgy12lk.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section: entries go right below the book's comment line, every entry ends with a comma.
 */
window.BuchES && BuchES.add('bgy12lk', {
    word: {
        // book es mathe12lk-es (Casamayor)
        // titelbildbgy12lk
        'Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt':
            'Portada: una función de distribución como escalera sobre sus barras, una curva con la tangente que la sustituye en el punto de tangencia y una pirámide triangular con su baricentro',
        // verteilungsfunktion
        'Würfel': 'Dado', 'Gesuchte Wahrscheinlichkeit': 'Probabilidad buscada',
        'Wahrscheinlichkeitsfunktion als Stabdiagramm': 'Función de probabilidad como diagrama de barras',
        'Verteilungsfunktion als Treppenfunktion': 'Función de distribución como función escalonada',
    },
    phrase: [
        // book es mathe12lk-es (Casamayor)
        // verteilungsfunktion: the help line "$X$ = <set>. Oben … unten …"
        ['Anzahl Wappen bei drei Münzwürfen', 'número de caras en tres lanzamientos de moneda'],
        ['Augenzahl eines Würfels', 'puntuación de un dado'],
        ['Gewinn in € (Auszahlung minus 2 € Einsatz)', 'ganancia en € (premio menos 2 € de apuesta)'],
        ['. Oben die Wahrscheinlichkeitsfunktion $x_i \\mapsto P(X = x_i)$, unten die Verteilungsfunktion $F(x) = P(X \\le x)$.',
            '. Arriba, la función de probabilidad $x_i \\mapsto P(X = x_i)$; abajo, la función de distribución $F(x) = P(X \\le x)$.'],
    ],
    rule: []
});
