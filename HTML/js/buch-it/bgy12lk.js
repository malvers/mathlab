/* js/buch-it/bgy12lk.js — Italian for the widgets of js/buch-bgy12lk.js.
 * Loaded by the Italian editions right after js/buch-bgy12lk.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Book it-22 mathe12lk-it (Cibrario, 28.10.2026). The words that js/buch-it/stochastik.js already has are repeated here with
 * the same Italian, so the start page and the print edition need no other dictionary.
 */
window.BuchIT && BuchIT.add('bgy12lk', {
    word: {
        // book it-22 mathe12lk-it:
        // titelbildbgy12lk
        'Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt':
            'Copertina: una funzione di ripartizione come scala sopra le sue barre, una curva con la tangente che la sostituisce nel punto di tangenza e una piramide a base triangolare con il suo baricentro',
        // verteilungsfunktion
        'Drei Münzen': 'Tre monete', 'Glücksrad': 'Ruota della fortuna', 'Zufallsgröße': 'Variabile aleatoria',
        'Gesuchte Wahrscheinlichkeit': 'Probabilità cercata',
        'Wahrscheinlichkeitsfunktion als Stabdiagramm': 'Funzione di probabilità come diagramma a barre',
        'Verteilungsfunktion als Treppenfunktion': 'Funzione di ripartizione come funzione a gradini',
    },
    phrase: [
        // book it-22 mathe12lk-it:
        // verteilungsfunktion: "$X$ = <what X counts>. Oben … unten …"
        ['Anzahl Wappen bei drei Münzwürfen', 'numero di teste in tre lanci di una moneta'],
        ['Augenzahl eines Würfels', 'punteggio di un dado'],
        ['Gewinn in € (Auszahlung minus 2 € Einsatz)', 'guadagno in € (vincita meno 2 € di puntata)'],
        ['. Oben die Wahrscheinlichkeitsfunktion $x_i \\mapsto P(X = x_i)$, unten die Verteilungsfunktion $F(x) = P(X \\le x)$.',
            '. Sopra la funzione di probabilità $x_i \\mapsto P(X = x_i)$, sotto la funzione di ripartizione $F(x) = P(X \\le x)$.'],
    ],
    rule: [
        // book it-22 mathe12lk-it:
        // verteilungsfunktion: the dice button ("Würfel" has two meanings, so no global word; the same rule as in stochastik.js)
        [/(<button type="button" data-v="wuerfel">)Würfel(<\/button>)/g, '$1Dado$2'],
    ]
});
