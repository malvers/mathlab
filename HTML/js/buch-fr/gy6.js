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
        // bruchop6
        'plus': 'plus', 'minus': 'moins', 'mal': 'fois', 'durch': 'divisé par', 'Rechenart': 'Opération',
        'Zähler 1': 'Numérateur 1', 'Nenner 1': 'Dénominateur 1', 'Zähler 2': 'Numérateur 2', 'Nenner 2': 'Dénominateur 2',
        'Das Ergebnis wäre kleiner als null.': 'Le résultat serait plus petit que zéro.',
        'Für das Bild sind die Zahlen zu groß.': 'Les nombres sont trop grands pour la figure.',
        'Das Bild zeigt nur Brüche bis 1.': 'La figure ne montre que des fractions jusqu’à 1.',
        'Mal null ist null.': 'Zéro fois un nombre, c’est zéro.', 'Durch null kann man nicht teilen.': 'On ne peut pas diviser par zéro.',
        '1. Bruch': '1re fraction', '2. Bruch': '2e fraction', 'Ergebnis': 'Résultat', 'Grün': 'Vert',
        'Streifenbild der Rechnung': 'Le calcul représenté par des bandes', 'Rechteckbild: ein Teil von einem Teil': 'Rectangle : une part d’une part',
        'Wie oft passt der zweite Bruch in den ersten?': 'Combien de fois la deuxième fraction tient-elle dans la première ?',
        'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numérateur fois numérateur, dénominateur fois dénominateur. Simplifier avant fait gagner du travail.',
        'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Pour diviser par une fraction, on multiplie par son inverse.',
        // vorrang6 (the steps; "Jetzt:" and the sentences with a formula are phrases)
        'Punkt vor Strich': '× et : avant + et −', 'Klammern zuerst': 'Parenthèses d’abord', 'Mit Komma': 'Avec une virgule',
        'Von links nach rechts': 'De gauche à droite', 'Rechenvorteil': 'Calcul astucieux', 'Aufgabe': 'Exercice',
        'Nächster Schritt': 'Étape suivante', 'Von vorn': 'Recommencer', 'Fertig.': 'Terminé.',
        'Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.': 'Terminé. Avec la parenthèse, on n’obtient pas la même chose que sans.',
        'Fertig. Wer von links rechnet, erhält falsch $6$.': 'Terminé. Qui calcule simplement de gauche à droite trouve, à tort, $6$.',
        'Jetzt die Strichrechnung.': 'l’addition.',
        'Distributivgesetz: $\\tfrac25$ ausklammern.': 'distributivité : on met $\\tfrac25$ en facteur.',
        // probieren6
        'Einsetzen': 'Essayer', 'Alle Werte prüfen': 'Tester toutes les valeurs',
        'Zahlenstrahl: grün erfüllt, rot nicht': 'Droite graduée : en vert les valeurs qui conviennent, en rouge les autres',
        'Passt.': 'Convient.', 'Passt nicht.': 'Ne convient pas.',
        'Probe: Einsetzen ergibt eine wahre Aussage.': 'Vérification : en remplaçant, on obtient une égalité vraie.',
        'Die linke Seite ist zu klein.': 'Le membre de gauche est trop petit.', 'Die linke Seite ist zu groß.': 'Le membre de gauche est trop grand.',
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
        // bruchop6
        ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
            '$ : avec les nombres rationnels positifs, cette soustraction est impossible. Tu découvriras les nombres négatifs en 7e année.'],
        ['Hauptnenner: $', 'Dénominateur commun : $'],
        ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
            '$ : combien de fois « rien » tient-il dans quelque chose ? Cette question n’a pas de réponse. On ne divise jamais par $0$.'],
        // vorrang6
        ['<b>Jetzt:</b> ', '<b>Maintenant :</b> '], ['Punktrechnung zuerst: $', 'la multiplication d’abord : $'], ['Hauptnenner 4: $', 'dénominateur commun 4 : $'],
        ['Die Klammer zuerst: $', 'la parenthèse d’abord : $'], ['Punkt vor Strich: $', 'la multiplication avant la soustraction : $'],
        ['Zwei Punktrechnungen: die linke zuerst. $', 'deux opérations prioritaires : celle de gauche d’abord. $'],
        ['Fertig. Ohne Ausklammern: $', 'Terminé. Sans mettre en facteur : $'], ['$, mehr Arbeit.', '$, c’est plus de travail.'],
        // probieren6
        ['Es passen: ', 'Conviennent : '], ['Bisher passt keiner.', 'Aucune valeur ne convient pour l’instant.'],
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
        // bruchop6
        [/\(das kleinste gemeinsame Vielfache von \$(\d+)\$ und \$(\d+)\$\)/g, (m, a, b) => '(le plus petit multiple commun de $' + a + '$ et $' + b + '$)'],
        [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g, (m, v) =>
            'On met d’abord au même dénominateur, puis on ' + (v === 'addieren' ? 'additionne' : 'soustrait') + ' les numérateurs. Le dénominateur reste le même.'],
        [/(<span class="g-phi">)(?:Grün|\u0003\d+\u0004)(<\/span>): \$(\d+)\$ von \$(\d+)\$ Kästchen\. Das ist (\$[^$]*\$) von (\$[^$]*\$)\./g, (m, s1, s2, a, b, x, y) =>
            s1 + 'Vert' + s2 + ' : $' + a + '$ cases sur $' + b + '$. C’est ' + x + ' de ' + y + '.'],
        [/(\$[^$]*\$) passt (\$[^$]*\$)-mal in (\$[^$]*\$)\./g, (m, x, k, y) => x + ' tient ' + k + ' fois dans ' + y + '.'],
        // probieren6
        [/(\$[a-z] = [^$]*\$): &nbsp; /g, '$1 : &nbsp; '], [/(\$[^$]*\$), und (\$[^$]*\$)<\/p>/g, '$1, et $2</p>'],
        [/Gesucht sind alle Zahlen, für die die linke Seite (kleiner|größer) als (\$[^$]*\$) ist\./g, (m, r, x) =>
            'On cherche tous les nombres pour lesquels le membre de gauche est ' + (r === 'kleiner' ? 'inférieur' : 'supérieur') + ' à ' + x + '.'],
        [/Geprüft: (\d+) von (\d+) Werten\. /g, (m, a, b) => (a === '1' ? 'Valeur testée : 1 sur ' : 'Valeurs testées : ' + a + ' sur ') + b + '. '],
    ]
});
