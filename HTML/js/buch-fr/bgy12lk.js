/* js/buch-fr/bgy12lk.js — French for the widgets of js/buch-bgy12lk.js.
 * Loaded by the French editions right after js/buch-bgy12lk.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md (Verteilungsfunktion: fonction de répartition, as js/buch-fr/gy12lk.js).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * 'Drei Münzen', 'Glücksrad', 'Zufallsgröße' are in js/buch-fr/stochastik.js, which the same page loads.
 */
window.BuchFR && BuchFR.add('bgy12lk', {
    word: {
        // book fr-22 mathe12lk-fr:
        // titelbildbgy12lk
        'Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt':
            'Couverture : une fonction de répartition en escalier au-dessus de ses bâtons, une courbe avec la tangente qui la remplace au point de contact, et une pyramide à base triangulaire avec son centre de gravité',
        // verteilungsfunktion
        'Würfel': 'Dé',
        'Gesuchte Wahrscheinlichkeit': 'Probabilité cherchée',
        'Wahrscheinlichkeitsfunktion als Stabdiagramm': 'Loi de probabilité en diagramme en bâtons',
        'Verteilungsfunktion als Treppenfunktion': 'Fonction de répartition en escalier',
    },
    phrase: [
        // book fr-22 mathe12lk-fr:
        ['Anzahl Wappen bei drei Münzwürfen', 'nombre de faces en trois lancers d’une pièce'],
        ['Augenzahl eines Würfels', 'numéro obtenu avec un dé'],
        ['Gewinn in € (Auszahlung minus 2 € Einsatz)', 'gain en € (somme versée moins la mise de 2 €)'],
        ['. Oben die Wahrscheinlichkeitsfunktion', '. En haut, la loi de probabilité'],
        [', unten die Verteilungsfunktion', ', en bas, la fonction de répartition'],
    ],
    rule: []
});
