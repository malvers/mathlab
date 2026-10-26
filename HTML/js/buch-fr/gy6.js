/* js/buch-fr/gy6.js — French for the widgets of js/buch-gy6.js.
 * Loaded by the French editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/gy6.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy6', {
    word: {
        // book fr-13 mathegy6-fr:
        // titelbildgy6
        'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
            'Illustration de couverture : un disque avec trois huitièmes colorés, les nombres premiers jusqu’à 30 comme des points lumineux, un triangle avec ses trois angles et la parallèle passant par le sommet du haut, un prisme à base triangulaire en perspective cavalière',
        // bruchbild6 (the same words as bruch5 in js/buch-fr/gy5.js)
        'Zähler': 'Numérateur', 'Nenner': 'Dénominateur', 'Kreis': 'Cercle', 'Streifen': 'Bande', 'Bild': 'Représentation',
        'Der Bruch ist eine natürliche Zahl.': 'La fraction est un entier naturel.',
        // mengen6
        'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagramme de Venn : les entiers naturels sont à l’intérieur des nombres rationnels positifs',
        'Richtig.': 'Correct.', 'Noch nicht.': 'Pas encore.', 'Noch einmal': 'Recommencer',
        'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcule la valeur : est-ce un nombre entier, sans reste ?',
        'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Ce nombre ne serait-il pas entre deux entiers naturels ?',
        'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'dans $\\mathbb{N}$ (et donc aussi dans $\\mathbb{Q}^+$)',
        'nur in $\\mathbb{Q}^+$': 'seulement dans $\\mathbb{Q}^+$',
        'In der Schule zählt die 0 zu den natürlichen Zahlen.': 'À l’école, 0 fait partie des entiers naturels.',
    },
    phrase: [
        // book fr-13 mathegy6-fr:
        // bruchbild6
        ['Bruch: $', 'Fraction : $'], ['Dezimalzahl: $', 'Écriture décimale : $'], ['Prozent: $', 'Pourcentage : $'],
        ['Der gekürzte Nenner ', 'Le dénominateur simplifié '],
        [' hat nur die Primfaktoren 2 und 5. ', ' n’a que les facteurs premiers 2 et 5. '],
        ['. Die Dezimalzahl <b>bricht ab</b>.', '. L’écriture décimale <b>s’arrête</b>.'],
        ['$ enthält den Primfaktor $', '$ contient le facteur premier $'],
        ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
            '$. Impossible d’amplifier pour obtenir 10, 100, 1 000… : l’écriture décimale est <b>périodique</b>.'],
        // mengen6: the reasons of the twelve numbers
        ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 est un entier naturel, et tout entier naturel est aussi un nombre rationnel positif : '],
        [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' est compris entre 0 et 1. Ce n’est pas un entier naturel.'],
        [' liegt zwischen 0 und 1.', ' est compris entre 0 et 1.'], [' liegt zwischen 2 und 3.', ' est compris entre 2 et 3.'],
        [' liegt zwischen 4 und 5.', ' est compris entre 4 et 5.'],
        ['. Der Bruch sieht nur anders aus als die 3.', '. La fraction n’est qu’une autre écriture de 3.'],
        ['. Die Null nach dem Komma ändert nichts.', '. Le zéro après la virgule ne change rien.'],
        // mengen6: the text under the diagram before the first answer
        [': die natürlichen Zahlen $0, 1, 2, 3, \\dots$', ' : les entiers naturels $0\\,;\\,1\\,;\\,2\\,;\\,3\\,;\\,\\dots$'],
        [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $\\tfrac{p}{q}$ schreiben kann.',
            ' : les nombres rationnels positifs, c’est-à-dire tous les nombres qu’on peut écrire sous forme de fraction $\\tfrac{p}{q}$.'],
        ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Tout entier naturel est aussi un nombre rationnel positif : $'],
    ],
    rule: [
        // book fr-13 mathegy6-fr:
        // French school notation (Doc, 26.10.2026: always the conventions of the target language): × for the product
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // the steppers' aria-labels: "Zähler kleiner" → "Numérateur : diminuer"
        [/^(Zähler|Nenner|erster Zähler|erster Nenner|zweiter Zähler|zweiter Nenner|zu Fuß|Fahrrad|Bus oder Bahn|Auto) (kleiner|größer)$/, (m, w, d) => ({
            'Zähler': 'Numérateur', 'Nenner': 'Dénominateur', 'erster Zähler': 'Premier numérateur', 'erster Nenner': 'Premier dénominateur',
            'zweiter Zähler': 'Deuxième numérateur', 'zweiter Nenner': 'Deuxième dénominateur',
            'zu Fuß': 'À pied', 'Fahrrad': 'À vélo', 'Bus oder Bahn': 'Bus ou train', 'Auto': 'En voiture' })[w] + (d === 'kleiner' ? ' : diminuer' : ' : augmenter')],
        // bruchbild6
        [/^Bild des Bruches (\d+) durch (\d+)$/, 'La fraction $1/$2 en image'],
        [/Erweitern mit \$(\d+)\$: /, 'On amplifie par $$$1$$ : '],
        [/Null Teile von (\d+) sind nichts: \$0\$\./, 'Zéro part sur $1, ce n’est rien : $0$.'],
        // mengen6
        [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Nombre $1 sur $2 : où va <b>$3</b> ?'],
        [/Alle Zahlen sind einsortiert(?:, (\d+) von (\d+) gleich beim ersten Versuch richtig)?\./g,
            (m, a, b) => 'Tous les nombres sont rangés' + (a ? ' : ' + a + ' sur ' + b + ' justes du premier coup' : '') + '.'],
        [/(\\in \\mathbb\{Q\}\^\+\$) und \$/g, '$1 et $'], [/(\\in \\mathbb\{Q\}\^\+\$), aber \$/g, '$1, mais $'],
    ]
});
